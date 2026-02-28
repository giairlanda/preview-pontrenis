/**
 * @output wp-includes/js/customize-loader.js
 */

/* global _wpcustomizeloadersettings */

/**
 * expose a public api that allows the customizer to be
 * loaded on any page.
 *
 * @namespace wp
 */
window.wp = window.wp || {};

(function( exports, $ ){
	var api = wp.customize,
		loader;

	$.extend( $.support, {
		history: !! ( window.history && history.pushstate ),
		hashchange: ('onhashchange' in window) && (document.documentmode === undefined || document.documentmode > 7)
	});

	/**
	 * allows the customizer to be overlaid on any page.
	 *
	 * by default, any element in the body with the load-customize class will open
	 * an iframe overlay with the url specified.
	 *
	 *     e.g. <a class="load-customize" href="<?php echo wp_customize_url(); ?>">open customizer</a>
	 *
	 * @memberof wp.customize
	 *
	 * @class
	 * @augments wp.customize.events
	 */
	loader = $.extend( {}, api.events,/** @lends wp.customize.loader.prototype */{
		/**
		 * setup the loader; triggered on document#ready.
		 */
		initialize: function() {
			this.body = $( document.body );

			// ensure the loader is supported.
			// check for settings, postmessage support, and whether we require cors support.
			if ( ! loader.settings || ! $.support.postmessage || ( ! $.support.cors && loader.settings.iscrossdomain ) ) {
				return;
			}

			this.window  = $( window );
			this.element = $( '<div id="customize-container" />' ).appendto( this.body );

			// bind events for opening and closing the overlay.
			this.bind( 'open', this.overlay.show );
			this.bind( 'close', this.overlay.hide );

			// any element in the body with the `load-customize` class opens
			// the customizer.
			$('#wpbody').on( 'click', '.load-customize', function( event ) {
				event.preventdefault();

				// store a reference to the link that opened the customizer.
				loader.link = $(this);
				// load the theme.
				loader.open( loader.link.attr('href') );
			});

			// add navigation listeners.
			if ( $.support.history ) {
				this.window.on( 'popstate', loader.popstate );
			}

			if ( $.support.hashchange ) {
				this.window.on( 'hashchange', loader.hashchange );
				this.window.triggerhandler( 'hashchange' );
			}
		},

		popstate: function( e ) {
			var state = e.originalevent.state;
			if ( state && state.customize ) {
				loader.open( state.customize );
			} else if ( loader.active ) {
				loader.close();
			}
		},

		hashchange: function() {
			var hash = window.location.tostring().split('#')[1];

			if ( hash && 0 === hash.indexof( 'wp_customize=on' ) ) {
				loader.open( loader.settings.url + '?' + hash );
			}

			if ( ! hash && ! $.support.history ) {
				loader.close();
			}
		},

		beforeunload: function () {
			if ( ! loader.saved() ) {
				return loader.settings.l10n.savealert;
			}
		},

		/**
		 * open the customizer overlay for a specific url.
		 *
		 * @param string src url to load in the customizer.
		 */
		open: function( src ) {

			if ( this.active ) {
				return;
			}

			// load the full page on mobile devices.
			if ( loader.settings.browser.mobile ) {
				return window.location = src;
			}

			// store the document title prior to opening the live preview.
			this.originaldocumenttitle = document.title;

			this.active = true;
			this.body.addclass('customize-loading');

			/*
			 * track the dirtiness state (whether the drafted changes have been published)
			 * of the customizer in the iframe. this is used to decide whether to display
			 * an ays alert if the user tries to close the window before saving changes.
			 */
			this.saved = new api.value( true );

			this.iframe = $( '<iframe />', { 'src': src, 'title': loader.settings.l10n.mainiframetitle } ).appendto( this.element );
			this.iframe.one( 'load', this.loaded );

			// create a postmessage connection with the iframe.
			this.messenger = new api.messenger({
				url: src,
				channel: 'loader',
				targetwindow: this.iframe[0].contentwindow
			});

			// expose the changeset uuid on the parent window's url so that the customized state can survive a refresh.
			if ( history.replacestate ) {
				this.messenger.bind( 'changeset-uuid', function( changesetuuid ) {
					var urlparser = document.createelement( 'a' );
					urlparser.href = location.href;
					urlparser.search = $.param( _.extend(
						api.utils.parsequerystring( urlparser.search.substr( 1 ) ),
						{ changeset_uuid: changesetuuid }
					) );
					history.replacestate( { customize: urlparser.href }, '', urlparser.href );
				} );
			}

			// wait for the connection from the iframe before sending any postmessage events.
			this.messenger.bind( 'ready', function() {
				loader.messenger.send( 'back' );
			});

			this.messenger.bind( 'close', function() {
				if ( $.support.history ) {
					history.back();
				} else if ( $.support.hashchange ) {
					window.location.hash = '';
				} else {
					loader.close();
				}
			});

			// prompt ays dialog when navigating away.
			$( window ).on( 'beforeunload', this.beforeunload );

			this.messenger.bind( 'saved', function () {
				loader.saved( true );
			} );
			this.messenger.bind( 'change', function () {
				loader.saved( false );
			} );

			this.messenger.bind( 'title', function( newtitle ){
				window.document.title = newtitle;
			});

			this.pushstate( src );

			this.trigger( 'open' );
		},

		pushstate: function ( src ) {
			var hash = src.split( '?' )[1];

			// ensure we don't call pushstate if the user hit the forward button.
			if ( $.support.history && window.location.href !== src ) {
				history.pushstate( { customize: src }, '', src );
			} else if ( ! $.support.history && $.support.hashchange && hash ) {
				window.location.hash = 'wp_customize=on&' + hash;
			}

			this.trigger( 'open' );
		},

		/**
		 * callback after the customizer has been opened.
		 */
		opened: function() {
			loader.body.addclass( 'customize-active full-overlay-active' ).attr( 'aria-busy', 'true' );
		},

		/**
		 * close the customizer overlay.
		 */
		close: function() {
			var self = this, onconfirmclose;
			if ( ! self.active ) {
				return;
			}

			onconfirmclose = function( confirmed ) {
				if ( confirmed ) {
					self.active = false;
					self.trigger( 'close' );

					// restore document title prior to opening the live preview.
					if ( self.originaldocumenttitle ) {
						document.title = self.originaldocumenttitle;
					}
				} else {

					// go forward since customizer is exited by history.back().
					history.forward();
				}
				self.messenger.unbind( 'confirmed-close', onconfirmclose );
			};
			self.messenger.bind( 'confirmed-close', onconfirmclose );

			loader.messenger.send( 'confirm-close' );
		},

		/**
		 * callback after the customizer has been closed.
		 */
		closed: function() {
			loader.iframe.remove();
			loader.messenger.destroy();
			loader.iframe    = null;
			loader.messenger = null;
			loader.saved     = null;
			loader.body.removeclass( 'customize-active full-overlay-active' ).removeclass( 'customize-loading' );
			$( window ).off( 'beforeunload', loader.beforeunload );
			/*
			 * return focus to the link that opened the customizer overlay after
			 * the body element visibility is restored.
			 */
			if ( loader.link ) {
				loader.link.focus();
			}
		},

		/**
		 * callback for the `load` event on the customizer iframe.
		 */
		loaded: function() {
			loader.body.removeclass( 'customize-loading' ).attr( 'aria-busy', 'false' );
		},

		/**
		 * overlay hide/show utility methods.
		 */
		overlay: {
			show: function() {
				this.element.fadein( 200, loader.opened );
			},

			hide: function() {
				this.element.fadeout( 200, loader.closed );
			}
		}
	});

	// bootstrap the loader on document#ready.
	$( function() {
		loader.settings = _wpcustomizeloadersettings;
		loader.initialize();
	});

	// expose the api publicly on window.wp.customize.loader.
	api.loader = loader;
})( wp, jquery );





