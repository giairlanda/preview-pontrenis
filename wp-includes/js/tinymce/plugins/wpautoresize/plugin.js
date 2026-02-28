/**
 * plugin.js
 *
 * copyright, moxiecode systems ab
 * released under lgpl license.
 *
 * license: http://www.tinymce.com/license
 * contributing: http://www.tinymce.com/contributing
 */

// forked for wordpress so it can be turned on/off after loading.

/*global tinymce:true */
/*eslint no-nested-ternary:0 */

/**
 * auto resize
 *
 * this plugin automatically resizes the content area to fit its content height.
 * it will retain a minimum height, which is the height of the content area when
 * it's initialized.
 */
tinymce.pluginmanager.add( 'wpautoresize', function( editor ) {
	var settings = editor.settings,
		oldsize = 300,
		isactive = false;

	if ( editor.settings.inline || tinymce.env.ios ) {
		return;
	}

	function isfullscreen() {
		return editor.plugins.fullscreen && editor.plugins.fullscreen.isfullscreen();
	}

	function getint( n ) {
		return parseint( n, 10 ) || 0;
	}

	/**
	 * this method gets executed each time the editor needs to resize.
	 */
	function resize( e ) {
		var deltasize, doc, body, docelm, dom = tinymce.dom, resizeheight, myheight,
			margintop, marginbottom, paddingtop, paddingbottom, bordertop, borderbottom;

		if ( ! isactive ) {
			return;
		}

		doc = editor.getdoc();
		if ( ! doc ) {
			return;
		}

		e = e || {};
		body = doc.body;
		docelm = doc.documentelement;
		resizeheight = settings.autoresize_min_height;

		if ( ! body || ( e && e.type === 'setcontent' && e.initial ) || isfullscreen() ) {
			if ( body && docelm ) {
				body.style.overflowy = 'auto';
				docelm.style.overflowy = 'auto'; // old ie.
			}

			return;
		}

		// calculate outer height of the body element using css styles.
		margintop = editor.dom.getstyle( body, 'margin-top', true );
		marginbottom = editor.dom.getstyle( body, 'margin-bottom', true );
		paddingtop = editor.dom.getstyle( body, 'padding-top', true );
		paddingbottom = editor.dom.getstyle( body, 'padding-bottom', true );
		bordertop = editor.dom.getstyle( body, 'border-top-width', true );
		borderbottom = editor.dom.getstyle( body, 'border-bottom-width', true );
		myheight = body.offsetheight + getint( margintop ) + getint( marginbottom ) +
			getint( paddingtop ) + getint( paddingbottom ) +
			getint( bordertop ) + getint( borderbottom );

		// ie < 11, other?
		if ( myheight && myheight < docelm.offsetheight ) {
			myheight = docelm.offsetheight;
		}

		// make sure we have a valid height.
		if ( isnan( myheight ) || myheight <= 0 ) {
			// get height differently depending on the browser used.
			myheight = tinymce.env.ie ? body.scrollheight : ( tinymce.env.webkit && body.clientheight === 0 ? 0 : body.offsetheight );
		}

		// don't make it smaller than the minimum height.
		if ( myheight > settings.autoresize_min_height ) {
			resizeheight = myheight;
		}

		// if a maximum height has been defined don't exceed this height.
		if ( settings.autoresize_max_height && myheight > settings.autoresize_max_height ) {
			resizeheight = settings.autoresize_max_height;
			body.style.overflowy = 'auto';
			docelm.style.overflowy = 'auto'; // old ie.
		} else {
			body.style.overflowy = 'hidden';
			docelm.style.overflowy = 'hidden'; // old ie.
			body.scrolltop = 0;
		}

		// resize content element.
		if (resizeheight !== oldsize) {
			deltasize = resizeheight - oldsize;
			dom.setstyle( editor.iframeelement, 'height', resizeheight + 'px' );
			oldsize = resizeheight;

			// webkit doesn't decrease the size of the body element until the iframe gets resized.
			// so we need to continue to resize the iframe down until the size gets fixed.
			if ( tinymce.iswebkit && deltasize < 0 ) {
				resize( e );
			}

			editor.fire( 'wp-autoresize', { height: resizeheight, deltaheight: e.type === 'nodechange' ? deltasize : null } );
		}
	}

	/**
	 * calls the resize x times in 100ms intervals. we can't wait for load events since
	 * the css files might load async.
	 */
	function wait( times, interval, callback ) {
		settimeout( function() {
			resize();

			if ( times-- ) {
				wait( times, interval, callback );
			} else if ( callback ) {
				callback();
			}
		}, interval );
	}

	// define minimum height.
	settings.autoresize_min_height = parseint(editor.getparam( 'autoresize_min_height', editor.getelement().offsetheight), 10 );

	// define maximum height.
	settings.autoresize_max_height = parseint(editor.getparam( 'autoresize_max_height', 0), 10 );

	function on() {
		if ( ! editor.dom.hasclass( editor.getbody(), 'wp-autoresize' ) ) {
			isactive = true;
			editor.dom.addclass( editor.getbody(), 'wp-autoresize' );
			// add appropriate listeners for resizing the content area.
			editor.on( 'nodechange setcontent keyup fullscreenstatechanged', resize );
			resize();
		}
	}

	function off() {
		var doc;

		// don't turn off if the setting is 'on'.
		if ( ! settings.wp_autoresize_on ) {
			isactive = false;
			doc = editor.getdoc();
			editor.dom.removeclass( editor.getbody(), 'wp-autoresize' );
			editor.off( 'nodechange setcontent keyup fullscreenstatechanged', resize );
			doc.body.style.overflowy = 'auto';
			doc.documentelement.style.overflowy = 'auto'; // old ie.
			oldsize = 0;
		}
	}

	if ( settings.wp_autoresize_on ) {
		// turn resizing on when the editor loads.
		isactive = true;

		editor.on( 'init', function() {
			editor.dom.addclass( editor.getbody(), 'wp-autoresize' );
		});

		editor.on( 'nodechange keyup fullscreenstatechanged', resize );

		editor.on( 'setcontent', function() {
			wait( 3, 100 );
		});

		if ( editor.getparam( 'autoresize_on_init', true ) ) {
			editor.on( 'init', function() {
				// hit it 10 times in 200 ms intervals.
				wait( 10, 200, function() {
					// hit it 5 times in 1 sec intervals.
					wait( 5, 1000 );
				});
			});
		}
	}

	// reset the stored size.
	editor.on( 'show', function() {
		oldsize = 0;
	});

	// register the command.
	editor.addcommand( 'wpautoresize', resize );

	// on/off.
	editor.addcommand( 'wpautoresizeon', on );
	editor.addcommand( 'wpautoresizeoff', off );
});


