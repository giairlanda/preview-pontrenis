/* global pluploadl10n, plupload, _wppluploadsettings */

/**
 * @namespace wp
 */
window.wp = window.wp || {};

( function( exports, $ ) {
	var uploader;

	if ( typeof _wppluploadsettings === 'undefined' ) {
		return;
	}

	/**
	 * a wordpress uploader.
	 *
	 * the plupload library provides cross-browser uploader ui integration.
	 * this object bridges the plupload api to integrate uploads into the
	 * wordpress back end and the wordpress media experience.
	 *
	 * @class
	 * @memberof wp
	 * @alias wp.uploader
	 *
	 * @param {object} options           the options passed to the new plupload instance.
	 * @param {object} options.container the id of uploader container.
	 * @param {object} options.browser   the id of button to trigger the file select.
	 * @param {object} options.dropzone  the id of file drop target.
	 * @param {object} options.plupload  an object of parameters to pass to the plupload instance.
	 * @param {object} options.params    an object of parameters to pass to $_post when uploading the file.
	 *                                   extends this.plupload.multipart_params under the hood.
	 */
	uploader = function( options ) {
		var self = this,
			isie, // not used, back-compat.
			elements = {
				container: 'container',
				browser:   'browse_button',
				dropzone:  'drop_element'
			},
			tryagaincount = {},
			tryagain,
			key,
			error,
			fileuploaded;

		this.supports = {
			upload: uploader.browser.supported
		};

		this.supported = this.supports.upload;

		if ( ! this.supported ) {
			return;
		}

		// arguments to send to pluplad.uploader().
		// use deep extend to ensure that multipart_params and other objects are cloned.
		this.plupload = $.extend( true, { multipart_params: {} }, uploader.defaults );
		this.container = document.body; // set default container.

		/*
		 * extend the instance with options.
		 *
		 * use deep extend to allow options.plupload to override individual
		 * default plupload keys.
		 */
		$.extend( true, this, options );

		// proxy all methods so this always refers to the current instance.
		for ( key in this ) {
			if ( typeof this[ key ] === 'function' ) {
				this[ key ] = $.proxy( this[ key ], this );
			}
		}

		// ensure all elements are jquery elements and have id attributes,
		// then set the proper plupload arguments to the ids.
		for ( key in elements ) {
			if ( ! this[ key ] ) {
				continue;
			}

			this[ key ] = $( this[ key ] ).first();

			if ( ! this[ key ].length ) {
				delete this[ key ];
				continue;
			}

			if ( ! this[ key ].prop('id') ) {
				this[ key ].prop( 'id', '__wp-uploader-id-' + uploader.uuid++ );
			}

			this.plupload[ elements[ key ] ] = this[ key ].prop('id');
		}

		// if the uploader has neither a browse button nor a dropzone, bail.
		if ( ! ( this.browser && this.browser.length ) && ! ( this.dropzone && this.dropzone.length ) ) {
			return;
		}

		// initialize the plupload instance.
		this.uploader = new plupload.uploader( this.plupload );
		delete this.plupload;

		// set default params and remove this.params alias.
		this.param( this.params || {} );
		delete this.params;

		/**
		 * attempt to create image sub-sizes when an image was uploaded successfully
		 * but the server responded with http 5xx error.
		 *
		 * @since 5.3.0
		 *
		 * @param {string}        message error message.
		 * @param {object}        data    error data from plupload.
		 * @param {plupload.file} file    file that was uploaded.
		 */
		tryagain = function( message, data, file ) {
			var times, id;

			if ( ! data || ! data.responseheaders ) {
				error( pluploadl10n.http_error_image, data, file, 'no-retry' );
				return;
			}

			id = data.responseheaders.match( /x-wp-upload-attachment-id:\s*(\d+)/i );

			if ( id && id[1] ) {
				id = id[1];
			} else {
				error( pluploadl10n.http_error_image, data, file, 'no-retry' );
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
						_wpnonce: _wppluploadsettings.defaults.multipart_params._wpnonce,
						attachment_id: id,
						_wp_upload_failed_cleanup: true,
					}
				});

				error( message, data, file, 'no-retry' );
				return;
			}

			if ( ! times ) {
				tryagaincount[ file.id ] = 1;
			} else {
				tryagaincount[ file.id ] = ++times;
			}

			// another request to try to create the missing image sub-sizes.
			$.ajax({
				type: 'post',
				url: ajaxurl,
				datatype: 'json',
				data: {
					action: 'media-create-image-subsizes',
					_wpnonce: _wppluploadsettings.defaults.multipart_params._wpnonce,
					attachment_id: id,
				}
			}).done( function( response ) {
				if ( response.success ) {
					fileuploaded( self.uploader, file, response );
				} else {
					if ( response.data && response.data.message ) {
						message = response.data.message;
					}

					error( message, data, file, 'no-retry' );
				}
			}).fail( function( jqxhr ) {
				// if another http 5xx error, try try again...
				if ( jqxhr.status >= 500 && jqxhr.status < 600 ) {
					tryagain( message, data, file );
					return;
				}

				error( message, data, file, 'no-retry' );
			});
		}

		/**
		 * custom error callback.
		 *
		 * add a new error to the errors collection, so other modules can track
		 * and display errors. @see wp.uploader.errors.
		 *
		 * @param {string}        message error message.
		 * @param {object}        data    error data from plupload.
		 * @param {plupload.file} file    file that was uploaded.
		 * @param {string}        retry   whether to try again to create image sub-sizes. passing 'no-retry' will prevent it.
		 */
		error = function( message, data, file, retry ) {
			var isimage = file.type && file.type.indexof( 'image/' ) === 0,
				status = data && data.status;

			// if the file is an image and the error is http 5xx try to create sub-sizes again.
			if ( retry !== 'no-retry' && isimage && status >= 500 && status < 600 ) {
				tryagain( message, data, file );
				return;
			}

			if ( file.attachment ) {
				file.attachment.destroy();
			}

			uploader.errors.unshift({
				message: message || pluploadl10n.default_error,
				data:    data,
				file:    file
			});

			self.error( message, data, file );
		};

		/**
		 * after a file is successfully uploaded, update its model.
		 *
		 * @param {plupload.uploader} up       uploader instance.
		 * @param {plupload.file}     file     file that was uploaded.
		 * @param {object}            response object with response properties.
		 */
		fileuploaded = function( up, file, response ) {
			var complete;

			// remove the "uploading" ui elements.
			_.each( ['file','loaded','size','percent'], function( key ) {
				file.attachment.unset( key );
			} );

			file.attachment.set( _.extend( response.data, { uploading: false } ) );

			wp.media.model.attachment.get( response.data.id, file.attachment );

			complete = uploader.queue.all( function( attachment ) {
				return ! attachment.get( 'uploading' );
			});

			if ( complete ) {
				uploader.queue.reset();
			}

			self.success( file.attachment );
		}

		/**
		 * after the uploader has been initialized, initialize some behaviors for the dropzone.
		 *
		 * @param {plupload.uploader} uploader uploader instance.
		 */
		this.uploader.bind( 'init', function( uploader ) {
			var timer, active, dragdrop,
				dropzone = self.dropzone;

			dragdrop = self.supports.dragdrop = uploader.features.dragdrop && ! uploader.browser.mobile;

			// generate drag/drop helper classes.
			if ( ! dropzone ) {
				return;
			}

			dropzone.toggleclass( 'supports-drag-drop', !! dragdrop );

			if ( ! dragdrop ) {
				return dropzone.unbind('.wp-uploader');
			}

			// 'dragenter' doesn't fire correctly, simulate it with a limited 'dragover'.
			dropzone.on( 'dragover.wp-uploader', function() {
				if ( timer ) {
					cleartimeout( timer );
				}

				if ( active ) {
					return;
				}

				dropzone.trigger('dropzone:enter').addclass('drag-over');
				active = true;
			});

			dropzone.on('dragleave.wp-uploader, drop.wp-uploader', function() {
				/*
				 * using an instant timer prevents the drag-over class
				 * from being quickly removed and re-added when elements
				 * inside the dropzone are repositioned.
				 *
				 * @see https://core.trac.wordpress.org/ticket/21705
				 */
				timer = settimeout( function() {
					active = false;
					dropzone.trigger('dropzone:leave').removeclass('drag-over');
				}, 0 );
			});

			self.ready = true;
			$(self).trigger( 'uploader:ready' );
		});

		this.uploader.bind( 'postinit', function( up ) {
			up.refresh();
			self.init();
		});

		this.uploader.init();

		if ( this.browser ) {
			this.browser.on( 'mouseenter', this.refresh );
		} else {
			this.uploader.disablebrowse( true );
		}

		$( self ).on( 'uploader:ready', function() {
			$( '.moxie-shim-html5 input[type="file"]' )
				.attr( {
					tabindex:      '-1',
					'aria-hidden': 'true'
				} );
		} );

		/**
		 * after files were filtered and added to the queue, create a model for each.
		 *
		 * @param {plupload.uploader} up    uploader instance.
		 * @param {array}             files array of file objects that were added to queue by the user.
		 */
		this.uploader.bind( 'filesadded', function( up, files ) {
			_.each( files, function( file ) {
				var attributes, image;

				// ignore failed uploads.
				if ( plupload.failed === file.status ) {
					return;
				}

				if ( file.type === 'image/heic' && up.settings.heic_upload_error ) {
					// show error but do not block uploading.
					uploader.errors.unshift({
						message: pluploadl10n.unsupported_image,
						data:    {},
						file:    file
					});
				} else if ( file.type === 'image/webp' && up.settings.webp_upload_error ) {
					// disallow uploading of webp images if the server cannot edit them.
					error( pluploadl10n.noneditable_image, {}, file, 'no-retry' );
					up.removefile( file );
					return;
				} else if ( file.type === 'image/avif' && up.settings.avif_upload_error ) {
					// disallow uploading of avif images if the server cannot edit them.
					error( pluploadl10n.noneditable_image, {}, file, 'no-retry' );
					up.removefile( file );
					return;
				}

				// generate attributes for a new `attachment` model.
				attributes = _.extend({
					file:      file,
					uploading: true,
					date:      new date(),
					filename:  file.name,
					menuorder: 0,
					uploadedto: wp.media.model.settings.post.id
				}, _.pick( file, 'loaded', 'size', 'percent' ) );

				// handle early mime type scanning for images.
				image = /(?:jpe?g|png|gif)$/i.exec( file.name );

				// for images set the model's type and subtype attributes.
				if ( image ) {
					attributes.type = 'image';

					// `jpeg`, `png` and `gif` are valid subtypes.
					// `jpg` is not, so map it to `jpeg`.
					attributes.subtype = ( 'jpg' === image[0] ) ? 'jpeg' : image[0];
				}

				// create a model for the attachment, and add it to the upload queue collection
				// so listeners to the upload queue can track and display upload progress.
				file.attachment = wp.media.model.attachment.create( attributes );
				uploader.queue.add( file.attachment );

				self.added( file.attachment );
			});

			up.refresh();
			up.start();
		});

		this.uploader.bind( 'uploadprogress', function( up, file ) {
			file.attachment.set( _.pick( file, 'loaded', 'percent' ) );
			self.progress( file.attachment );
		});

		/**
		 * after a file is successfully uploaded, update its model.
		 *
		 * @param {plupload.uploader} up       uploader instance.
		 * @param {plupload.file}     file     file that was uploaded.
		 * @param {object}            response object with response properties.
		 * @return {mixed}
		 */
		this.uploader.bind( 'fileuploaded', function( up, file, response ) {

			try {
				response = json.parse( response.response );
			} catch ( e ) {
				return error( pluploadl10n.default_error, e, file );
			}

			if ( ! _.isobject( response ) || _.isundefined( response.success ) ) {
				return error( pluploadl10n.default_error, null, file );
			} else if ( ! response.success ) {
				return error( response.data && response.data.message, response.data, file );
			}

			// success. update the ui with the new attachment.
			fileuploaded( up, file, response );
		});

		/**
		 * when plupload surfaces an error, send it to the error handler.
		 *
		 * @param {plupload.uploader} up            uploader instance.
		 * @param {object}            pluploaderror contains code, message and sometimes file and other details.
		 */
		this.uploader.bind( 'error', function( up, pluploaderror ) {
			var message = pluploadl10n.default_error,
				key;

			// check for plupload errors.
			for ( key in uploader.errormap ) {
				if ( pluploaderror.code === plupload[ key ] ) {
					message = uploader.errormap[ key ];

					if ( typeof message === 'function' ) {
						message = message( pluploaderror.file, pluploaderror );
					}

					break;
				}
			}

			error( message, pluploaderror, pluploaderror.file );
			up.refresh();
		});

	};

	// adds the 'defaults' and 'browser' properties.
	$.extend( uploader, _wppluploadsettings );

	uploader.uuid = 0;

	// map plupload error codes to user friendly error messages.
	uploader.errormap = {
		'failed':                 pluploadl10n.upload_failed,
		'file_extension_error':   pluploadl10n.invalid_filetype,
		'image_format_error':     pluploadl10n.not_an_image,
		'image_memory_error':     pluploadl10n.image_memory_exceeded,
		'image_dimensions_error': pluploadl10n.image_dimensions_exceeded,
		'generic_error':          pluploadl10n.upload_failed,
		'io_error':               pluploadl10n.io_error,
		'security_error':         pluploadl10n.security_error,

		'file_size_error': function( file ) {
			return pluploadl10n.file_exceeds_size_limit.replace( '%s', file.name );
		},

		'http_error': function( file ) {
			if ( file.type && file.type.indexof( 'image/' ) === 0 ) {
				return pluploadl10n.http_error_image;
			}

			return pluploadl10n.http_error;
		},
	};

	$.extend( uploader.prototype, /** @lends wp.uploader.prototype */{
		/**
		 * acts as a shortcut to extending the uploader's multipart_params object.
		 *
		 * param( key )
		 *    returns the value of the key.
		 *
		 * param( key, value )
		 *    sets the value of a key.
		 *
		 * param( map )
		 *    sets values for a map of data.
		 */
		param: function( key, value ) {
			if ( arguments.length === 1 && typeof key === 'string' ) {
				return this.uploader.settings.multipart_params[ key ];
			}

			if ( arguments.length > 1 ) {
				this.uploader.settings.multipart_params[ key ] = value;
			} else {
				$.extend( this.uploader.settings.multipart_params, key );
			}
		},

		/**
		 * make a few internal event callbacks available on the wp.uploader object
		 * to change the uploader internals if absolutely necessary.
		 */
		init:     function() {},
		error:    function() {},
		success:  function() {},
		added:    function() {},
		progress: function() {},
		complete: function() {},
		refresh:  function() {
			var node, attached, container, id;

			if ( this.browser ) {
				node = this.browser[0];

				// check if the browser node is in the dom.
				while ( node ) {
					if ( node === document.body ) {
						attached = true;
						break;
					}
					node = node.parentnode;
				}

				/*
				 * if the browser node is not attached to the dom,
				 * use a temporary container to house it, as the browser button shims
				 * require the button to exist in the dom at all times.
				 */
				if ( ! attached ) {
					id = 'wp-uploader-browser-' + this.uploader.id;

					container = $( '#' + id );
					if ( ! container.length ) {
						container = $('<div class="wp-uploader-browser" />').css({
							position: 'fixed',
							top: '-1000px',
							left: '-1000px',
							height: 0,
							width: 0
						}).attr( 'id', 'wp-uploader-browser-' + this.uploader.id ).appendto('body');
					}

					container.append( this.browser );
				}
			}

			this.uploader.refresh();
		}
	});

	// create a collection of attachments in the upload queue,
	// so that other modules can track and display upload progress.
	uploader.queue = new wp.media.model.attachments( [], { query: false });

	// create a collection to collect errors incurred while attempting upload.
	uploader.errors = new backbone.collection();

	exports.uploader = uploader;
})( wp, jquery );




