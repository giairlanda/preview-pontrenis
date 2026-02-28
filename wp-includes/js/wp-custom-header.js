/**
 * @output wp-includes/js/wp-custom-header.js
 */

/* global yt */
(function( window, settings ) {

	var nativehandler, youtubehandler;

	/** @namespace wp */
	window.wp = window.wp || {};

	// fail gracefully in unsupported browsers.
	if ( ! ( 'addeventlistener' in window ) ) {
		return;
	}

	/**
	 * trigger an event.
	 *
	 * @param {element} target html element to dispatch the event on.
	 * @param {string} name event name.
	 */
	function trigger( target, name ) {
		var evt;

		if ( 'function' === typeof window.event ) {
			evt = new event( name );
		} else {
			evt = document.createevent( 'event' );
			evt.initevent( name, true, true );
		}

		target.dispatchevent( evt );
	}

	/**
	 * create a custom header instance.
	 *
	 * @memberof wp
	 *
	 * @class
	 */
	function customheader() {
		this.handlers = {
			nativevideo: new nativehandler(),
			youtube: new youtubehandler()
		};
	}

	customheader.prototype = {
		/**
		 * initialize the custom header.
		 *
		 * if the environment supports video, loops through registered handlers
		 * until one is found that can handle the video.
		 */
		initialize: function() {
			if ( this.supportsvideo() ) {
				for ( var id in this.handlers ) {
					var handler = this.handlers[ id ];

					if ( 'test' in handler && handler.test( settings ) ) {
						this.activehandler = handler.initialize.call( handler, settings );

						// dispatch custom event when the video is loaded.
						trigger( document, 'wp-custom-header-video-loaded' );
						break;
					}
				}
			}
		},

		/**
		 * determines if the current environment supports video.
		 *
		 * themes and plugins can override this method to change the criteria.
		 *
		 * @return {boolean}
		 */
		supportsvideo: function() {
			// don't load video on small screens. @todo consider bandwidth and other factors.
			if ( window.innerwidth < settings.minwidth || window.innerheight < settings.minheight ) {
				return false;
			}

			return true;
		},

		/**
		 * base handler for custom handlers to extend.
		 *
		 * @type {basehandler}
		 */
		basevideohandler: basehandler
	};

	/**
	 * create a video handler instance.
	 *
	 * @memberof wp
	 *
	 * @class
	 */
	function basehandler() {}

	basehandler.prototype = {
		/**
		 * initialize the video handler.
		 *
		 * @param {object} settings video settings.
		 */
		initialize: function( settings ) {
			var handler = this,
				button = document.createelement( 'button' );

			this.settings = settings;
			this.container = document.getelementbyid( 'wp-custom-header' );
			this.button = button;

			button.setattribute( 'type', 'button' );
			button.setattribute( 'id', 'wp-custom-header-video-button' );
			button.setattribute( 'class', 'wp-custom-header-video-button wp-custom-header-video-play' );
			button.innerhtml = settings.l10n.play;

			// toggle video playback when the button is clicked.
			button.addeventlistener( 'click', function() {
				if ( handler.ispaused() ) {
					handler.play();
				} else {
					handler.pause();
				}
			});

			// update the button class and text when the video state changes.
			this.container.addeventlistener( 'play', function() {
				button.classname = 'wp-custom-header-video-button wp-custom-header-video-play';
				button.innerhtml = settings.l10n.pause;
				if ( 'a11y' in window.wp ) {
					window.wp.a11y.speak( settings.l10n.playspeak);
				}
			});

			this.container.addeventlistener( 'pause', function() {
				button.classname = 'wp-custom-header-video-button wp-custom-header-video-pause';
				button.innerhtml = settings.l10n.play;
				if ( 'a11y' in window.wp ) {
					window.wp.a11y.speak( settings.l10n.pausespeak);
				}
			});

			this.ready();
		},

		/**
		 * ready method called after a handler is initialized.
		 *
		 * @abstract
		 */
		ready: function() {},

		/**
		 * whether the video is paused.
		 *
		 * @abstract
		 * @return {boolean}
		 */
		ispaused: function() {},

		/**
		 * pause the video.
		 *
		 * @abstract
		 */
		pause: function() {},

		/**
		 * play the video.
		 *
		 * @abstract
		 */
		play: function() {},

		/**
		 * append a video node to the header container.
		 *
		 * @param {element} node html element.
		 */
		setvideo: function( node ) {
			var editshortcutnode,
				editshortcut = this.container.getelementsbyclassname( 'customize-partial-edit-shortcut' );

			if ( editshortcut.length ) {
				editshortcutnode = this.container.removechild( editshortcut[0] );
			}

			this.container.innerhtml = '';
			this.container.appendchild( node );

			if ( editshortcutnode ) {
				this.container.appendchild( editshortcutnode );
			}
		},

		/**
		 * show the video controls.
		 *
		 * appends a play/pause button to header container.
		 */
		showcontrols: function() {
			if ( ! this.container.contains( this.button ) ) {
				this.container.appendchild( this.button );
			}
		},

		/**
		 * whether the handler can process a video.
		 *
		 * @abstract
		 * @param {object} settings video settings.
		 * @return {boolean}
		 */
		test: function() {
			return false;
		},

		/**
		 * trigger an event on the header container.
		 *
		 * @param {string} name event name.
		 */
		trigger: function( name ) {
			trigger( this.container, name );
		}
	};

	/**
	 * create a custom handler.
	 *
	 * @memberof wp
	 *
	 * @param {object} protoprops properties to apply to the prototype.
	 * @return customhandler the subclass.
	 */
	basehandler.extend = function( protoprops ) {
		var prop;

		function customhandler() {
			var result = basehandler.apply( this, arguments );
			return result;
		}

		customhandler.prototype = object.create( basehandler.prototype );
		customhandler.prototype.constructor = customhandler;

		for ( prop in protoprops ) {
			customhandler.prototype[ prop ] = protoprops[ prop ];
		}

		return customhandler;
	};

	/**
	 * native video handler.
	 *
	 * @memberof wp
	 *
	 * @class
	 */
	nativehandler = basehandler.extend(/** @lends wp.nativehandler.prototype */{
		/**
		 * whether the native handler supports a video.
		 *
		 * @param {object} settings video settings.
		 * @return {boolean}
		 */
		test: function( settings ) {
			var video = document.createelement( 'video' );
			return video.canplaytype( settings.mimetype );
		},

		/**
		 * set up a native video element.
		 */
		ready: function() {
			var handler = this,
				video = document.createelement( 'video' );

			video.id = 'wp-custom-header-video';
			video.autoplay = true;
			video.loop = true;
			video.muted = true;
			video.playsinline = true;
			video.width = this.settings.width;
			video.height = this.settings.height;

			video.addeventlistener( 'play', function() {
				handler.trigger( 'play' );
			});

			video.addeventlistener( 'pause', function() {
				handler.trigger( 'pause' );
			});

			video.addeventlistener( 'canplay', function() {
				handler.showcontrols();
			});

			this.video = video;
			handler.setvideo( video );
			video.src = this.settings.videourl;
		},

		/**
		 * whether the video is paused.
		 *
		 * @return {boolean}
		 */
		ispaused: function() {
			return this.video.paused;
		},

		/**
		 * pause the video.
		 */
		pause: function() {
			this.video.pause();
		},

		/**
		 * play the video.
		 */
		play: function() {
			this.video.play();
		}
	});

	/**
	 * youtube video handler.
	 *
	 * @memberof wp
	 *
	 * @class wp.youtubehandler
	 */
	youtubehandler = basehandler.extend(/** @lends wp.youtubehandler.prototype */{
		/**
		 * whether the handler supports a video.
		 *
		 * @param {object} settings video settings.
		 * @return {boolean}
		 */
		test: function( settings ) {
			return 'video/x-youtube' === settings.mimetype;
		},

		/**
		 * set up a youtube iframe.
		 *
		 * loads the youtube iframe api if the 'yt' global doesn't exist.
		 */
		ready: function() {
			var handler = this;

			if ( 'yt' in window ) {
				yt.ready( handler.loadvideo.bind( handler ) );
			} else {
				var tag = document.createelement( 'script' );
				tag.src = 'https://www.youtube.com/iframe_api';
				tag.onload = function () {
					yt.ready( handler.loadvideo.bind( handler ) );
				};

				document.getelementsbytagname( 'head' )[0].appendchild( tag );
			}
		},

		/**
		 * load a youtube video.
		 */
		loadvideo: function() {
			var handler = this,
				video = document.createelement( 'div' ),
				// @link http://stackoverflow.com/a/27728417
				video_id_regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

			video.id = 'wp-custom-header-video';
			handler.setvideo( video );

			handler.player = new yt.player( video, {
				height: this.settings.height,
				width: this.settings.width,
				videoid: this.settings.videourl.match( video_id_regex )[1],
				events: {
					onready: function( e ) {
						e.target.mute();
						handler.showcontrols();
					},
					onstatechange: function( e ) {
						if ( yt.playerstate.playing === e.data ) {
							handler.trigger( 'play' );
						} else if ( yt.playerstate.paused === e.data ) {
							handler.trigger( 'pause' );
						} else if ( yt.playerstate.ended === e.data ) {
							e.target.playvideo();
						}
					}
				},
				playervars: {
					autoplay: 1,
					controls: 0,
					disablekb: 1,
					fs: 0,
					iv_load_policy: 3,
					loop: 1,
					modestbranding: 1,
					playsinline: 1,
					rel: 0,
					showinfo: 0
				}
			});
		},

		/**
		 * whether the video is paused.
		 *
		 * @return {boolean}
		 */
		ispaused: function() {
			return yt.playerstate.paused === this.player.getplayerstate();
		},

		/**
		 * pause the video.
		 */
		pause: function() {
			this.player.pausevideo();
		},

		/**
		 * play the video.
		 */
		play: function() {
			this.player.playvideo();
		}
	});

	// initialize the custom header when the dom is ready.
	window.wp.customheader = new customheader();
	document.addeventlistener( 'domcontentloaded', window.wp.customheader.initialize.bind( window.wp.customheader ), false );

	// selective refresh support in the customizer.
	if ( 'customize' in window.wp ) {
		window.wp.customize.selectiverefresh.bind( 'render-partials-response', function( response ) {
			if ( 'custom_header_settings' in response ) {
				settings = response.custom_header_settings;
			}
		});

		window.wp.customize.selectiverefresh.bind( 'partial-content-rendered', function( placement ) {
			if ( 'custom_header' === placement.partial.id ) {
				window.wp.customheader.initialize();
			}
		});
	}

})( window, window._wpcustomheadersettings || {} );








