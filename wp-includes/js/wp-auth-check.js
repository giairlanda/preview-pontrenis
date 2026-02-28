/**
 * interim login dialog.
 *
 * @output wp-includes/js/wp-auth-check.js
 */

( function( $ ) {
	var wrap,
		temphidden,
		temphiddentimeout;

	/**
	 * shows the authentication form popup.
	 *
	 * @since 3.6.0
	 * @private
	 */
	function show() {
		var parent = $( '#wp-auth-check' ),
			form = $( '#wp-auth-check-form' ),
			noframe = wrap.find( '.wp-auth-fallback-expired' ),
			frame, loaded = false;

		if ( form.length ) {
			// add unload confirmation to counter (frame-busting) js redirects.
			$( window ).on( 'beforeunload.wp-auth-check', function( event ) {
				event.originalevent.returnvalue = window.wp.i18n.__( 'your session has expired. you can log in again from this page or go to the login page.' );
			});

			frame = $( '<iframe id="wp-auth-check-frame" frameborder="0">' ).attr( 'title', noframe.text() );
			frame.on( 'load', function() {
				var height, body;

				loaded = true;
				// remove the spinner to avoid unnecessary cpu/gpu usage.
				form.removeclass( 'loading' );

				try {
					body = $( this ).contents().find( 'body' );
					height = body.height();
				} catch( er ) {
					wrap.addclass( 'fallback' );
					parent.css( 'max-height', '' );
					form.remove();
					noframe.focus();
					return;
				}

				if ( height ) {
					if ( body && body.hasclass( 'interim-login-success' ) ) {
						hide();
					} else {
						parent.css( 'max-height', height + 40 + 'px' );
					}
				} else if ( ! body || ! body.length ) {
					// catch "silent" iframe origin exceptions in webkit
					// after another page is loaded in the iframe.
					wrap.addclass( 'fallback' );
					parent.css( 'max-height', '' );
					form.remove();
					noframe.focus();
				}
			}).attr( 'src', form.data( 'src' ) );

			form.append( frame );
		}

		$( 'body' ).addclass( 'modal-open' );
		wrap.removeclass( 'hidden' );

		if ( frame ) {
			frame.focus();
			/*
			 * webkit doesn't throw an error if the iframe fails to load
			 * because of "x-frame-options: deny" header.
			 * wait for 10 seconds and switch to the fallback text.
			 */
			settimeout( function() {
				if ( ! loaded ) {
					wrap.addclass( 'fallback' );
					form.remove();
					noframe.focus();
				}
			}, 10000 );
		} else {
			noframe.focus();
		}
	}

	/**
	 * hides the authentication form popup.
	 *
	 * @since 3.6.0
	 * @private
	 */
	function hide() {
		var adminpage = window.adminpage,
			wp        = window.wp;

		$( window ).off( 'beforeunload.wp-auth-check' );

		// when on the edit post screen, speed up heartbeat
		// after the user logs in to quickly refresh nonces.
		if ( ( adminpage === 'post-php' || adminpage === 'post-new-php' ) && wp && wp.heartbeat ) {
			wp.heartbeat.connectnow();
		}

		wrap.fadeout( 200, function() {
			wrap.addclass( 'hidden' ).css( 'display', '' );
			$( '#wp-auth-check-frame' ).remove();
			$( 'body' ).removeclass( 'modal-open' );
		});
	}

	/**
	 * set or reset the temphidden variable used to pause showing of the modal
	 * after a user closes it without logging in.
	 *
	 * @since 5.5.0
	 * @private
	 */
	function setshowtimeout() {
		temphidden = true;
		window.cleartimeout( temphiddentimeout );
		temphiddentimeout = window.settimeout(
			function() {
				temphidden = false;
			},
			300000 // 5 min.
		);
	}

	/**
	 * binds to the heartbeat tick event.
	 *
	 * - shows the authentication form popup if user is not logged in.
	 * - hides the authentication form popup if it is already visible and user is
	 *   logged in.
	 *
	 * @ignore
	 *
	 * @since 3.6.0
	 *
	 * @param {object} e the heartbeat-tick event that has been triggered.
	 * @param {object} data response data.
	 */
	$( function() {

		/**
		 * hides the authentication form popup when the close icon is clicked.
		 *
		 * @ignore
		 *
		 * @since 3.6.0
		 */
		wrap = $( '#wp-auth-check-wrap' );
		wrap.find( '.wp-auth-check-close' ).on( 'click', function() {
			hide();
			setshowtimeout();
		});
	}).on( 'heartbeat-tick.wp-auth-check', function( e, data ) {
		if ( 'wp-auth-check' in data ) {
			if ( ! data['wp-auth-check'] && wrap.hasclass( 'hidden' ) && ! temphidden ) {
				show();
			} else if ( data['wp-auth-check'] && ! wrap.hasclass( 'hidden' ) ) {
				hide();
			}
		}
	});

}(jquery));





