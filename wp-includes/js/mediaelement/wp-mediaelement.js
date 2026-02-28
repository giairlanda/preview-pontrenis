/* global _wpmejssettings, mejsl10n */
(function( window, $ ) {

	window.wp = window.wp || {};

	function wpmediaelement() {
		var settings = {};

		/**
		 * initialize media elements.
		 *
		 * ensures media elements that have already been initialized won't be
		 * processed again.
		 *
		 * @memberof wp.mediaelement
		 *
		 * @since 4.4.0
		 *
		 * @return {void}
		 */
		function initialize() {
			var selectors = [];

			if ( typeof _wpmejssettings !== 'undefined' ) {
				settings = $.extend( true, {}, _wpmejssettings );
			}
			settings.classprefix = 'mejs-';
			settings.success = settings.success || function ( mejs ) {
				var autoplay, loop;

				if ( mejs.renderername && -1 !== mejs.renderername.indexof( 'flash' ) ) {
					autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
					loop = mejs.attributes.loop && 'false' !== mejs.attributes.loop;

					if ( autoplay ) {
						mejs.addeventlistener( 'canplay', function() {
							mejs.play();
						}, false );
					}

					if ( loop ) {
						mejs.addeventlistener( 'ended', function() {
							mejs.play();
						}, false );
					}
				}
			};

			/**
			 * custom error handler.
			 *
			 * sets up a custom error handler in case a video render fails, and provides a download
			 * link as the fallback.
			 *
			 * @since 4.9.3
			 *
			 * @param {object} media the wrapper that mimics all the native events/properties/methods for all renderers.
			 * @param {object} node  the original html video, audio, or iframe tag where the media was loaded.
			 * @return {string}
			 */
			settings.customerror = function ( media, node ) {
				// make sure we only fall back to a download link for flash files.
				if ( -1 !== media.renderername.indexof( 'flash' ) || -1 !== media.renderername.indexof( 'flv' ) ) {
					return '<a href="' + node.src + '">' + mejsl10n.strings['mejs.download-file'] + '</a>';
				}
			};

			if ( 'undefined' === typeof settings.videoshortcodelibrary || 'mediaelement' === settings.videoshortcodelibrary ) {
				selectors.push( '.wp-video-shortcode' );
			}
			if ( 'undefined' === typeof settings.audioshortcodelibrary || 'mediaelement' === settings.audioshortcodelibrary ) {
				selectors.push( '.wp-audio-shortcode' );
			}
			if ( ! selectors.length ) {
				return;
			}

			// only initialize new media elements.
			$( selectors.join( ', ' ) )
				.not( '.mejs-container' )
				.filter(function () {
					return ! $( this ).parent().hasclass( 'mejs-mediaelement' );
				})
				.mediaelementplayer( settings );
		}

		return {
			initialize: initialize
		};
	}

	/**
	 * @namespace wp.mediaelement
	 * @memberof wp
	 */
	window.wp.mediaelement = new wpmediaelement();

	$( window.wp.mediaelement.initialize );

})( window, jquery );








