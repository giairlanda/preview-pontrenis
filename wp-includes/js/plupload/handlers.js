/* global plupload, pluploadl10n, ajaxurl, post_id, wpuploaderinit, deleteusersetting, setusersetting, getusersetting, shortform */
var topwin = window.dialogarguments || opener || parent || top, uploader, uploader_init;

// progress and success handlers for media multi uploads.
function filequeued( fileobj ) {
	// get rid of unused form.
	jquery( '.media-blank' ).remove();

	var items = jquery( '#media-items' ).children(), postid = post_id || 0;

	// collapse a single item.
	if ( items.length == 1 ) {
		items.removeclass( 'open' ).find( '.slidetoggle' ).slideup( 200 );
	}
	// create a progress bar containing the filename.
	jquery( '<div class="media-item">' )
		.attr( 'id', 'media-item-' + fileobj.id )
		.addclass( 'child-of-' + postid )
		.append( jquery( '<div class="filename original">' ).text( ' ' + fileobj.name ),
			'<div class="progress"><div class="percent">0%</div><div class="bar"></div></div>' )
		.appendto( jquery( '#media-items' ) );

	// disable submit.
	jquery( '#insert-gallery' ).prop( 'disabled', true );
}

function uploadstart() {
	try {
		if ( typeof topwin.tb_remove != 'undefined' )
			topwin.jquery( '#tb_overlay' ).unbind( 'click', topwin.tb_remove );
	} catch( e ){}

	return true;
}

function uploadprogress( up, file ) {
	var item = jquery( '#media-item-' + file.id );

	jquery( '.bar', item ).width( ( 200 * file.loaded ) / file.size );
	jquery( '.percent', item ).html( file.percent + '%' );
}

// check to see if a large file failed to upload.
function fileuploading( up, file ) {
	var hundredmb = 100 * 1024 * 1024,
		max = parseint( up.settings.max_file_size, 10 );

	if ( max > hundredmb && file.size > hundredmb ) {
		settimeout( function() {
			if ( file.status < 3 && file.loaded === 0 ) { // not uploading.
				wpfileerror( file, pluploadl10n.big_upload_failed.replace( '%1$s', '<a class="uploader-html" href="#">' ).replace( '%2$s', '</a>' ) );
				up.stop();  // stop the whole queue.
				up.removefile( file );
				up.start(); // restart the queue.
			}
		}, 10000 ); // wait for 10 seconds for the file to start uploading.
	}
}

function updatemediaform() {
	var items = jquery( '#media-items' ).children();

	// just one file, no need for collapsible part.
	if ( items.length == 1 ) {
		items.addclass( 'open' ).find( '.slidetoggle' ).show();
		jquery( '.insert-gallery' ).hide();
	} else if ( items.length > 1 ) {
		items.removeclass( 'open' );
		// only show gallery/playlist buttons when there are at least two files.
		jquery( '.insert-gallery' ).show();
	}

	// only show save buttons when there is at least one file.
	if ( items.not( '.media-blank' ).length > 0 )
		jquery( '.savebutton' ).show();
	else
		jquery( '.savebutton' ).hide();
}

function uploadsuccess( fileobj, serverdata ) {
	var item = jquery( '#media-item-' + fileobj.id );

	// on success serverdata should be numeric,
	// fix bug in html4 runtime returning the serverdata wrapped in a <pre> tag.
	if ( typeof serverdata === 'string' ) {
		serverdata = serverdata.replace( /^<pre>(\d+)<\/pre>$/, '$1' );

		// if async-upload returned an error message, place it in the media item div and return.
		if ( /media-upload-error|error-div/.test( serverdata ) ) {
			item.html( serverdata );
			return;
		}
	}

	item.find( '.percent' ).html( pluploadl10n.crunching );

	preparemediaitem( fileobj, serverdata );
	updatemediaform();

	// increment the counter.
	if ( post_id && item.hasclass( 'child-of-' + post_id ) ) {
		jquery( '#attachments-count' ).text( 1 * jquery( '#attachments-count' ).text() + 1 );
	}
}

function setresize( arg ) {
	if ( arg ) {
		if ( window.resize_width && window.resize_height ) {
			uploader.settings.resize = {
				enabled: true,
				width: window.resize_width,
				height: window.resize_height,
				quality: 100
			};
		} else {
			uploader.settings.multipart_params.image_resize = true;
		}
	} else {
		delete( uploader.settings.multipart_params.image_resize );
	}
}

function preparemediaitem( fileobj, serverdata ) {
	var f = ( typeof shortform == 'undefined' ) ? 1 : 2, item = jquery( '#media-item-' + fileobj.id );
	if ( f == 2 && shortform > 2 )
		f = shortform;

	try {
		if ( typeof topwin.tb_remove != 'undefined' )
			topwin.jquery( '#tb_overlay' ).click( topwin.tb_remove );
	} catch( e ){}

	if ( isnan( serverdata ) || !serverdata ) {
		// old style: append the html returned by the server -- thumbnail and form inputs.
		item.append( serverdata );
		preparemediaiteminit( fileobj );
	} else {
		// new style: server data is just the attachment id, fetch the thumbnail and form html from the server.
		item.load( 'async-upload.php', {attachment_id:serverdata, fetch:f}, function(){preparemediaiteminit( fileobj );updatemediaform();});
	}
}

function preparemediaiteminit( fileobj ) {
	var item = jquery( '#media-item-' + fileobj.id );
	// clone the thumbnail as a "pinkynail" -- a tiny image to the left of the filename.
	jquery( '.thumbnail', item ).clone().attr( 'class', 'pinkynail toggle' ).prependto( item );

	// replace the original filename with the new (unique) one assigned during upload.
	jquery( '.filename.original', item ).replacewith( jquery( '.filename.new', item ) );

	// bind ajax to the new delete button.
	jquery( 'a.delete', item ).on( 'click', function(){
		// tell the server to delete it. todo: handle exceptions.
		jquery.ajax({
			url: ajaxurl,
			type: 'post',
			success: deletesuccess,
			error: deleteerror,
			id: fileobj.id,
			data: {
				id : this.id.replace(/[^0-9]/g, '' ),
				action : 'trash-post',
				_ajax_nonce : this.href.replace(/^.*wpnonce=/,'' )
			}
		});
		return false;
	});

	// bind ajax to the new undo button.
	jquery( 'a.undo', item ).on( 'click', function(){
		// tell the server to untrash it. todo: handle exceptions.
		jquery.ajax({
			url: ajaxurl,
			type: 'post',
			id: fileobj.id,
			data: {
				id : this.id.replace(/[^0-9]/g,'' ),
				action: 'untrash-post',
				_ajax_nonce: this.href.replace(/^.*wpnonce=/,'' )
			},
			success: function( ){
				var type,
					item = jquery( '#media-item-' + fileobj.id );

				if ( type = jquery( '#type-of-' + fileobj.id ).val() )
					jquery( '#' + type + '-counter' ).text( jquery( '#' + type + '-counter' ).text()-0+1 );

				if ( post_id && item.hasclass( 'child-of-'+post_id ) )
					jquery( '#attachments-count' ).text( jquery( '#attachments-count' ).text()-0+1 );

				jquery( '.filename .trashnotice', item ).remove();
				jquery( '.filename .title', item ).css( 'font-weight','normal' );
				jquery( 'a.undo', item ).addclass( 'hidden' );
				jquery( '.menu_order_input', item ).show();
				item.css( {backgroundcolor:'#ceb'} ).animate( {backgroundcolor: '#fff'}, { queue: false, duration: 500, complete: function(){ jquery( this ).css({backgroundcolor:''}); } }).removeclass( 'undo' );
			}
		});
		return false;
	});

	// open this item if it says to start open (e.g. to display an error).
	jquery( '#media-item-' + fileobj.id + '.startopen' ).removeclass( 'startopen' ).addclass( 'open' ).find( 'slidetoggle' ).fadein();
}

// generic error message.
function wpqueueerror( message ) {
	jquery( '#media-upload-error' ).show().html( '<div class="notice notice-error"><p>' + message + '</p></div>' );
}

// file-specific error messages.
function wpfileerror( fileobj, message ) {
	itemajaxerror( fileobj.id, message );
}

function itemajaxerror( id, message ) {
	var item = jquery( '#media-item-' + id ), filename = item.find( '.filename' ).text(), last_err = item.data( 'last-err' );

	if ( last_err == id ) // prevent firing an error for the same file twice.
		return;

	item.html( '<div class="error-div">' +
				'<a class="dismiss" href="#">' + pluploadl10n.dismiss + '</a>' +
				'<strong>' + pluploadl10n.error_uploading.replace( '%s', jquery.trim( filename )) + '</strong> ' +
				message +
				'</div>' ).data( 'last-err', id );
}

function deletesuccess( data ) {
	var type, id, item;
	if ( data == '-1' )
		return itemajaxerror( this.id, 'you do not have permission. has your session expired?' );

	if ( data == '0' )
		return itemajaxerror( this.id, 'could not be deleted. has it been deleted already?' );

	id = this.id;
	item = jquery( '#media-item-' + id );

	// decrement the counters.
	if ( type = jquery( '#type-of-' + id ).val() )
		jquery( '#' + type + '-counter' ).text( jquery( '#' + type + '-counter' ).text() - 1 );

	if ( post_id && item.hasclass( 'child-of-'+post_id ) )
		jquery( '#attachments-count' ).text( jquery( '#attachments-count' ).text() - 1 );

	if ( jquery( 'form.type-form #media-items' ).children().length == 1 && jquery( '.hidden', '#media-items' ).length > 0 ) {
		jquery( '.toggle' ).toggle();
		jquery( '.slidetoggle' ).slideup( 200 ).siblings().removeclass( 'hidden' );
	}

	// vanish it.
	jquery( '.toggle', item ).toggle();
	jquery( '.slidetoggle', item ).slideup( 200 ).siblings().removeclass( 'hidden' );
	item.css( {backgroundcolor:'#faa'} ).animate( {backgroundcolor:'#f4f4f4'}, {queue:false, duration:500} ).addclass( 'undo' );

	jquery( '.filename:empty', item ).remove();
	jquery( '.filename .title', item ).css( 'font-weight','bold' );
	jquery( '.filename', item ).append( '<span class="trashnotice"> ' + pluploadl10n.deleted + ' </span>' ).siblings( 'a.toggle' ).hide();
	jquery( '.filename', item ).append( jquery( 'a.undo', item ).removeclass( 'hidden' ) );
	jquery( '.menu_order_input', item ).hide();

	return;
}

function deleteerror() {
}

function uploadcomplete() {
	jquery( '#insert-gallery' ).prop( 'disabled', false );
}

function switchuploader( s ) {
	if ( s ) {
		deleteusersetting( 'uploader' );
		jquery( '.media-upload-form' ).removeclass( 'html-uploader' );

		if ( typeof( uploader ) == 'object' )
			uploader.refresh();

		jquery( '#plupload-browse-button' ).trigger( 'focus' );
	} else {
		setusersetting( 'uploader', '1' ); // 1 == html uploader.
		jquery( '.media-upload-form' ).addclass( 'html-uploader' );
		jquery( '#async-upload' ).trigger( 'focus' );
	}
}

function uploaderror( fileobj, errorcode, message, up ) {
	var hundredmb = 100 * 1024 * 1024, max;

	switch ( errorcode ) {
		case plupload.failed:
			wpfileerror( fileobj, pluploadl10n.upload_failed );
			break;
		case plupload.file_extension_error:
			wpfileextensionerror( up, fileobj, pluploadl10n.invalid_filetype );
			break;
		case plupload.file_size_error:
			uploadsizeerror( up, fileobj );
			break;
		case plupload.image_format_error:
			wpfileerror( fileobj, pluploadl10n.not_an_image );
			break;
		case plupload.image_memory_error:
			wpfileerror( fileobj, pluploadl10n.image_memory_exceeded );
			break;
		case plupload.image_dimensions_error:
			wpfileerror( fileobj, pluploadl10n.image_dimensions_exceeded );
			break;
		case plupload.generic_error:
			wpqueueerror( pluploadl10n.upload_failed );
			break;
		case plupload.io_error:
			max = parseint( up.settings.filters.max_file_size, 10 );

			if ( max > hundredmb && fileobj.size > hundredmb ) {
				wpfileerror( fileobj, pluploadl10n.big_upload_failed.replace( '%1$s', '<a class="uploader-html" href="#">' ).replace( '%2$s', '</a>' ) );
			} else {
				wpqueueerror( pluploadl10n.io_error );
			}

			break;
		case plupload.http_error:
			wpqueueerror( pluploadl10n.http_error );
			break;
		case plupload.init_error:
			jquery( '.media-upload-form' ).addclass( 'html-uploader' );
			break;
		case plupload.security_error:
			wpqueueerror( pluploadl10n.security_error );
			break;
/*		case plupload.upload_error.upload_stopped:
		case plupload.upload_error.file_cancelled:
			jquery( '#media-item-' + fileobj.id ).remove();
			break;*/
		default:
			wpfileerror( fileobj, pluploadl10n.default_error );
	}
}

function uploadsizeerror( up, file ) {
	var message, errordiv;

	message = pluploadl10n.file_exceeds_size_limit.replace( '%s', file.name );

	// construct the error div.
	errordiv = jquery( '<div />' )
		.attr( {
			'id':    'media-item-' + file.id,
			'class': 'media-item error'
		} )
		.append(
			jquery( '<p />' )
				.text( message )
		);

	// append the error.
	jquery( '#media-items' ).append( errordiv );
	up.removefile( file );
}

function wpfileextensionerror( up, file, message ) {
	jquery( '#media-items' ).append( '<div id="media-item-' + file.id + '" class="media-item error"><p>' + message + '</p></div>' );
	up.removefile( file );
}

/**
 * copies the attachment url to the clipboard.
 *
 * @since 5.8.0
 *
 * @param {mouseevent} event a click event.
 *
 * @return {void}
 */
function copyattachmentuploadurlclipboard() {
	var clipboard = new clipboardjs( '.copy-attachment-url' ),
		successtimeout;

	clipboard.on( 'success', function( event ) {
		var triggerelement = jquery( event.trigger ),
			successelement = jquery( '.success', triggerelement.closest( '.copy-to-clipboard-container' ) );

		// clear the selection and move focus back to the trigger.
		event.clearselection();
		// show success visual feedback.
		cleartimeout( successtimeout );
		successelement.removeclass( 'hidden' );
		// hide success visual feedback after 3 seconds since last success.
		successtimeout = settimeout( function() {
			successelement.addclass( 'hidden' );
		}, 3000 );
		// handle success audible feedback.
		wp.a11y.speak( pluploadl10n.file_url_copied );
	} );
}

jquery( document ).ready( function( $ ) {
	copyattachmentuploadurlclipboard();
	var tryagaincount = {};
	var tryagain;

	$( '.media-upload-form' ).on( 'click.uploader', function( e ) {
		var target = $( e.target ), tr, c;

		if ( target.is( 'input[type="radio"]' ) ) { // remember the last used image size and alignment.
			tr = target.closest( 'tr' );

			if ( tr.hasclass( 'align' ) )
				setusersetting( 'align', target.val() );
			else if ( tr.hasclass( 'image-size' ) )
				setusersetting( 'imgsize', target.val() );

		} else if ( target.is( 'button.button' ) ) { // remember the last used image link url.
			c = e.target.classname || '';
			c = c.match( /url([^ '"]+)/ );

			if ( c && c[1] ) {
				setusersetting( 'urlbutton', c[1] );
				target.siblings( '.urlfield' ).val( target.data( 'link-url' ) );
			}
		} else if ( target.is( 'a.dismiss' ) ) {
			target.parents( '.media-item' ).fadeout( 200, function() {
				$( this ).remove();
			} );
		} else if ( target.is( '.upload-flash-bypass button' ) || target.is( 'a.uploader-html' ) ) { // switch uploader to html4.
			$( '#media-items, p.submit, span.big-file-warning' ).css( 'display', 'none' );
			switchuploader( 0 );
			e.preventdefault();
		} else if ( target.is( '.upload-html-bypass button' ) ) { // switch uploader to multi-file.
			$( '#media-items, p.submit, span.big-file-warning' ).css( 'display', '' );
			switchuploader( 1 );
			e.preventdefault();
		} else if ( target.is( 'a.describe-toggle-on' ) ) { // show.
			target.parent().addclass( 'open' );
			target.siblings( '.slidetoggle' ).fadein( 250, function() {
				var s = $( window ).scrolltop(),
					h = $( window ).height(),
					top = $( this ).offset().top,
					h = $( this ).height(),
					b,
					b;

				if ( h && top && h ) {
					b = top + h;
					b = s + h;

					if ( b > b ) {
						if ( b - b < top - s )
							window.scrollby( 0, ( b - b ) + 10 );
						else
							window.scrollby( 0, top - s - 40 );
					}
				}
			} );

			e.preventdefault();
		} else if ( target.is( 'a.describe-toggle-off' ) ) { // hide.
			target.siblings( '.slidetoggle' ).fadeout( 250, function() {
				target.parent().removeclass( 'open' );
			} );

			e.preventdefault();
		}
	});

	// attempt to create image sub-sizes when an image was uploaded successfully
	// but the server responded with an http 5xx error.
	tryagain = function( up, error ) {
		var file = error.file;
		var times;
		var id;

		if ( ! error || ! error.responseheaders ) {
			wpqueueerror( pluploadl10n.http_error_image );
			return;
		}

		id = error.responseheaders.match( /x-wp-upload-attachment-id:\s*(\d+)/i );

		if ( id && id[1] ) {
			id = id[1];
		} else {
			wpqueueerror( pluploadl10n.http_error_image );
			return;
		}

		times = tryagaincount[ file.id ];

		if ( times && times > 4 ) {
			/*
			 * the file may have been uploaded and attachment post created,
			 * but post-processing and resizing failed...
			 * do a cleanup then tell the user to scale down the image and upload it again.
			 */
			$.ajax({
				type: 'post',
				url: ajaxurl,
				datatype: 'json',
				data: {
					action: 'media-create-image-subsizes',
					_wpnonce: wpuploaderinit.multipart_params._wpnonce,
					attachment_id: id,
					_wp_upload_failed_cleanup: true,
				}
			});

			if ( error.message && ( error.status < 500 || error.status >= 600 ) ) {
				wpqueueerror( error.message );
			} else {
				wpqueueerror( pluploadl10n.http_error_image );
			}

			return;
		}

		if ( ! times ) {
			tryagaincount[ file.id ] = 1;
		} else {
			tryagaincount[ file.id ] = ++times;
		}

		// try to create the missing image sizes.
		$.ajax({
			type: 'post',
			url: ajaxurl,
			datatype: 'json',
			data: {
				action: 'media-create-image-subsizes',
				_wpnonce: wpuploaderinit.multipart_params._wpnonce,
				attachment_id: id,
				_legacy_support: 'true',
			}
		}).done( function( response ) {
			var message;

			if ( response.success ) {
				uploadsuccess( file, response.data.id );
			} else {
				if ( response.data && response.data.message ) {
					message = response.data.message;
				}

				wpqueueerror( message || pluploadl10n.http_error_image );
			}
		}).fail( function( jqxhr ) {
			// if another http 5xx error, try try again...
			if ( jqxhr.status >= 500 && jqxhr.status < 600 ) {
				tryagain( up, error );
				return;
			}

			wpqueueerror( pluploadl10n.http_error_image );
		});
	}

	// init and set the uploader.
	uploader_init = function() {
		uploader = new plupload.uploader( wpuploaderinit );

		$( '#image_resize' ).on( 'change', function() {
			var arg = $( this ).prop( 'checked' );

			setresize( arg );

			if ( arg )
				setusersetting( 'upload_resize', '1' );
			else
				deleteusersetting( 'upload_resize' );
		});

		uploader.bind( 'init', function( up ) {
			var uploaddiv = $( '#plupload-upload-ui' );

			setresize( getusersetting( 'upload_resize', false ) );

			if ( up.features.dragdrop && ! $( document.body ).hasclass( 'mobile' ) ) {
				uploaddiv.addclass( 'drag-drop' );

				$( '#drag-drop-area' ).on( 'dragover.wp-uploader', function() { // dragenter doesn't fire right :(
					uploaddiv.addclass( 'drag-over' );
				}).on( 'dragleave.wp-uploader, drop.wp-uploader', function() {
					uploaddiv.removeclass( 'drag-over' );
				});
			} else {
				uploaddiv.removeclass( 'drag-drop' );
				$( '#drag-drop-area' ).off( '.wp-uploader' );
			}

			if ( up.runtime === 'html4' ) {
				$( '.upload-flash-bypass' ).hide();
			}
		});

		uploader.bind( 'postinit', function( up ) {
			up.refresh();
		});

		uploader.init();

		uploader.bind( 'filesadded', function( up, files ) {
			$( '#media-upload-error' ).empty();
			uploadstart();

			plupload.each( files, function( file ) {
				if ( file.type === 'image/heic' && up.settings.heic_upload_error ) {
					// show error but do not block uploading.
					wpqueueerror( pluploadl10n.unsupported_image );
				} else if ( file.type === 'image/webp' && up.settings.webp_upload_error ) {
					// disallow uploading of webp images if the server cannot edit them.
					wpqueueerror( pluploadl10n.noneditable_image );
					up.removefile( file );
					return;
				} else if ( file.type === 'image/avif' && up.settings.avif_upload_error ) {
					// disallow uploading of avif images if the server cannot edit them.
					wpqueueerror( pluploadl10n.noneditable_image );
					up.removefile( file );
					return;
				}

				filequeued( file );
			});

			up.refresh();
			up.start();
		});

		uploader.bind( 'uploadfile', function( up, file ) {
			fileuploading( up, file );
		});

		uploader.bind( 'uploadprogress', function( up, file ) {
			uploadprogress( up, file );
		});

		uploader.bind( 'error', function( up, error ) {
			var isimage = error.file && error.file.type && error.file.type.indexof( 'image/' ) === 0;
			var status  = error && error.status;

			// if the file is an image and the error is http 5xx try to create sub-sizes again.
			if ( isimage && status >= 500 && status < 600 ) {
				tryagain( up, error );
				return;
			}

			uploaderror( error.file, error.code, error.message, up );
			up.refresh();
		});

		uploader.bind( 'fileuploaded', function( up, file, response ) {
			uploadsuccess( file, response.response );
		});

		uploader.bind( 'uploadcomplete', function() {
			uploadcomplete();
		});
	};

	if ( typeof( wpuploaderinit ) == 'object' ) {
		uploader_init();
	}

});


