/**
 * @output wp-includes/js/wp-embed-template.js
 */
(function ( window, document ) {
	'use strict';

	var supportedbrowser = ( document.queryselector && window.addeventlistener ),
		loaded = false,
		secret,
		secrettimeout,
		resizing;

	function sendembedmessage( message, value ) {
		window.parent.postmessage( {
			message: message,
			value: value,
			secret: secret
		}, '*' );
	}

	/**
	 * send the height message to the parent window.
	 */
	function sendheightmessage() {
		sendembedmessage( 'height', math.ceil( document.body.getboundingclientrect().height ) );
	}

	function onload() {
		if ( loaded ) {
			return;
		}
		loaded = true;

		var share_dialog = document.queryselector( '.wp-embed-share-dialog' ),
			share_dialog_open = document.queryselector( '.wp-embed-share-dialog-open' ),
			share_dialog_close = document.queryselector( '.wp-embed-share-dialog-close' ),
			share_input = document.queryselectorall( '.wp-embed-share-input' ),
			share_dialog_tabs = document.queryselectorall( '.wp-embed-share-tab-button button' ),
			featured_image = document.queryselector( '.wp-embed-featured-image img' ),
			i;

		if ( share_input ) {
			for ( i = 0; i < share_input.length; i++ ) {
				share_input[ i ].addeventlistener( 'click', function ( e ) {
					e.target.select();
				} );
			}
		}

		function opensharingdialog() {
			share_dialog.classname = share_dialog.classname.replace( 'hidden', '' );
			// initial focus should go on the currently selected tab in the dialog.
			document.queryselector( '.wp-embed-share-tab-button [aria-selected="true"]' ).focus();
		}

		function closesharingdialog() {
			share_dialog.classname += ' hidden';
			document.queryselector( '.wp-embed-share-dialog-open' ).focus();
		}

		if ( share_dialog_open ) {
			share_dialog_open.addeventlistener( 'click', function () {
				opensharingdialog();
			} );
		}

		if ( share_dialog_close ) {
			share_dialog_close.addeventlistener( 'click', function () {
				closesharingdialog();
			} );
		}

		function shareclickhandler( e ) {
			var currenttab = document.queryselector( '.wp-embed-share-tab-button [aria-selected="true"]' );
			currenttab.setattribute( 'aria-selected', 'false' );
			document.queryselector( '#' + currenttab.getattribute( 'aria-controls' ) ).setattribute( 'aria-hidden', 'true' );

			e.target.setattribute( 'aria-selected', 'true' );
			document.queryselector( '#' + e.target.getattribute( 'aria-controls' ) ).setattribute( 'aria-hidden', 'false' );
		}

		function sharekeyhandler( e ) {
			var target = e.target,
				previoussibling = target.parentelement.previouselementsibling,
				nextsibling = target.parentelement.nextelementsibling,
				newtab, newtabchild;

			if ( 37 === e.keycode ) {
				newtab = previoussibling;
			} else if ( 39 === e.keycode ) {
				newtab = nextsibling;
			} else {
				return false;
			}

			if ( 'rtl' === document.documentelement.getattribute( 'dir' ) ) {
				newtab = ( newtab === previoussibling ) ? nextsibling : previoussibling;
			}

			if ( newtab ) {
				newtabchild = newtab.firstelementchild;

				target.setattribute( 'tabindex', '-1' );
				target.setattribute( 'aria-selected', false );
				document.queryselector( '#' + target.getattribute( 'aria-controls' ) ).setattribute( 'aria-hidden', 'true' );

				newtabchild.setattribute( 'tabindex', '0' );
				newtabchild.setattribute( 'aria-selected', 'true' );
				newtabchild.focus();
				document.queryselector( '#' + newtabchild.getattribute( 'aria-controls' ) ).setattribute( 'aria-hidden', 'false' );
			}
		}

		if ( share_dialog_tabs ) {
			for ( i = 0; i < share_dialog_tabs.length; i++ ) {
				share_dialog_tabs[ i ].addeventlistener( 'click', shareclickhandler );

				share_dialog_tabs[ i ].addeventlistener( 'keydown', sharekeyhandler );
			}
		}

		document.addeventlistener( 'keydown', function ( e ) {
			if ( 27 === e.keycode && -1 === share_dialog.classname.indexof( 'hidden' ) ) {
				closesharingdialog();
			} else if ( 9 === e.keycode ) {
				constraintabbing( e );
			}
		}, false );

		function constraintabbing( e ) {
			// need to re-get the selected tab each time.
			var firstfocusable = document.queryselector( '.wp-embed-share-tab-button [aria-selected="true"]' );

			if ( share_dialog_close === e.target && ! e.shiftkey ) {
				firstfocusable.focus();
				e.preventdefault();
			} else if ( firstfocusable === e.target && e.shiftkey ) {
				share_dialog_close.focus();
				e.preventdefault();
			}
		}

		if ( window.self === window.top ) {
			return;
		}

		// send this document's height to the parent (embedding) site.
		sendheightmessage();

		// send the document's height again after the featured image has been loaded.
		if ( featured_image ) {
			featured_image.addeventlistener( 'load', sendheightmessage );
		}

		/**
		 * detect clicks to external (_top) links.
		 */
		function linkclickhandler( e ) {
			var target = e.target,
				href;
			if ( target.hasattribute( 'href' ) ) {
				href = target.getattribute( 'href' );
			} else {
				href = target.parentelement.getattribute( 'href' );
			}

			// only catch clicks from the primary mouse button, without any modifiers.
			if ( event.altkey || event.ctrlkey || event.metakey || event.shiftkey ) {
				return;
			}

			// send link target to the parent (embedding) site.
			if ( href ) {
				sendembedmessage( 'link', href );
				e.preventdefault();
			}
		}

		document.addeventlistener( 'click', linkclickhandler );
	}

	/**
	 * iframe resize handler.
	 */
	function onresize() {
		if ( window.self === window.top ) {
			return;
		}

		cleartimeout( resizing );

		resizing = settimeout( sendheightmessage, 100 );
	}

	/**
	 * message handler.
	 *
	 * @param {messageevent} event
	 */
	function onmessage( event ) {
		var data = event.data;

		if ( ! data ) {
			return;
		}

		if ( event.source !== window.parent ) {
			return;
		}

		if ( ! ( data.secret || data.message ) ) {
			return;
		}

		if ( data.secret !== secret ) {
			return;
		}

		if ( 'ready' === data.message ) {
			sendheightmessage();
		}
	}

	/**
	 * re-get the secret when it was added later on.
	 */
	function getsecret() {
		if ( window.self === window.top || !!secret ) {
			return;
		}

		secret = window.location.hash.replace( /.*secret=([\d\w]{10}).*/, '$1' );

		cleartimeout( secrettimeout );

		secrettimeout = settimeout( function () {
			getsecret();
		}, 100 );
	}

	if ( supportedbrowser ) {
		getsecret();
		document.documentelement.classname = document.documentelement.classname.replace( /\bno-js\b/, '' ) + ' js';
		document.addeventlistener( 'domcontentloaded', onload, false );
		window.addeventlistener( 'load', onload, false );
		window.addeventlistener( 'resize', onresize, false );
		window.addeventlistener( 'message', onmessage, false );
	}
})( window, document );


