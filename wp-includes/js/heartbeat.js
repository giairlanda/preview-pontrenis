/**
 * heartbeat api
 *
 * heartbeat is a simple server polling api that sends xhr requests to
 * the server every 15 - 60 seconds and triggers events (or callbacks) upon
 * receiving data. currently these 'ticks' handle transports for post locking,
 * login-expiration warnings, autosave, and related tasks while a user is logged in.
 *
 * available php filters (in ajax-actions.php):
 * - heartbeat_received
 * - heartbeat_send
 * - heartbeat_tick
 * - heartbeat_nopriv_received
 * - heartbeat_nopriv_send
 * - heartbeat_nopriv_tick
 * @see wp_ajax_nopriv_heartbeat(), wp_ajax_heartbeat()
 *
 * custom jquery events:
 * - heartbeat-send
 * - heartbeat-tick
 * - heartbeat-error
 * - heartbeat-connection-lost
 * - heartbeat-connection-restored
 * - heartbeat-nonces-expired
 *
 * @since 3.6.0
 * @output wp-includes/js/heartbeat.js
 */

( function( $, window, undefined ) {

	/**
	 * constructs the heartbeat api.
	 *
	 * @since 3.6.0
	 *
	 * @return {object} an instance of the heartbeat class.
	 * @constructor
	 */
	var heartbeat = function() {
		var $document = $(document),
			settings = {
				// suspend/resume.
				suspend: false,

				// whether suspending is enabled.
				suspendenabled: true,

				// current screen id, defaults to the js global 'pagenow' when present
				// (in the admin) or 'front'.
				screenid: '',

				// xhr request url, defaults to the js global 'ajaxurl' when present.
				url: '',

				// timestamp, start of the last connection request.
				lasttick: 0,

				// container for the enqueued items.
				queue: {},

				// connect interval (in seconds).
				maininterval: 60,

				// used when the interval is set to 5 seconds temporarily.
				tempinterval: 0,

				// used when the interval is reset.
				originalinterval: 0,

				// used to limit the number of ajax requests.
				minimalinterval: 0,

				// used together with tempinterval.
				countdown: 0,

				// whether a connection is currently in progress.
				connecting: false,

				// whether a connection error occurred.
				connectionerror: false,

				// used to track non-critical errors.
				errorcount: 0,

				// whether at least one connection has been completed successfully.
				hasconnected: false,

				// whether the current browser window is in focus and the user is active.
				hasfocus: true,

				// timestamp, last time the user was active. checked every 30 seconds.
				useractivity: 0,

				// flag whether events tracking user activity were set.
				useractivityevents: false,

				// timer that keeps track of how long a user has focus.
				checkfocustimer: 0,

				// timer that keeps track of how long needs to be waited before connecting to
				// the server again.
				beattimer: 0
			};

		/**
		 * sets local variables and events, then starts the heartbeat.
		 *
		 * @since 3.8.0
		 * @access private
		 *
		 * @return {void}
		 */
		function initialize() {
			var options, hidden, visibilitystate, visibilitychange;

			if ( typeof window.pagenow === 'string' ) {
				settings.screenid = window.pagenow;
			}

			if ( typeof window.ajaxurl === 'string' ) {
				settings.url = window.ajaxurl;
			}

			// pull in options passed from php.
			if ( typeof window.heartbeatsettings === 'object' ) {
				options = window.heartbeatsettings;

				// the xhr url can be passed as option when window.ajaxurl is not set.
				if ( ! settings.url && options.ajaxurl ) {
					settings.url = options.ajaxurl;
				}

				/*
				 * logic check: the interval can be from 1 to 3600 seconds and can be set temporarily
				 * to 5 seconds. it can be set in the initial options or changed later from js
				 * or from php through the ajax responses.
				 */
				if ( options.interval ) {
					settings.maininterval = options.interval;

					if ( settings.maininterval < 1 ) {
						settings.maininterval = 1;
					} else if ( settings.maininterval > 3600 ) {
						settings.maininterval = 3600;
					}
				}

				/*
				 * used to limit the number of ajax requests. overrides all other intervals
				 * if they are shorter. needed for some hosts that cannot handle frequent requests
				 * and the user may exceed the allocated server cpu time, etc. the minimal interval
				 * can be up to 600 seconds, however setting it to longer than 120 seconds
				 * will limit or disable some of the functionality (like post locks).
				 * once set at initialization, minimalinterval cannot be changed/overridden.
				 */
				if ( options.minimalinterval ) {
					options.minimalinterval = parseint( options.minimalinterval, 10 );
					settings.minimalinterval = options.minimalinterval > 0 && options.minimalinterval <= 600 ? options.minimalinterval : 0;
				}

				if ( settings.minimalinterval && settings.maininterval < settings.minimalinterval ) {
					settings.maininterval = settings.minimalinterval;
				}

				// 'screenid' can be added from settings on the front end where the js global
				// 'pagenow' is not set.
				if ( ! settings.screenid ) {
					settings.screenid = options.screenid || 'front';
				}

				if ( options.suspension === 'disable' ) {
					settings.suspendenabled = false;
				}
			}

			// convert to milliseconds.
			settings.maininterval = settings.maininterval * 1000;
			settings.originalinterval = settings.maininterval;
			if ( settings.minimalinterval ) {
				settings.minimalinterval = settings.minimalinterval * 1000;
			}

			/*
			 * switch the interval to 120 seconds by using the page visibility api.
			 * if the browser doesn't support it (safari < 7, android < 4.4, ie < 10), the
			 * interval will be increased to 120 seconds after 5 minutes of mouse and keyboard
			 * inactivity.
			 */
			if ( typeof document.hidden !== 'undefined' ) {
				hidden = 'hidden';
				visibilitychange = 'visibilitychange';
				visibilitystate = 'visibilitystate';
			} else if ( typeof document.mshidden !== 'undefined' ) { // ie10.
				hidden = 'mshidden';
				visibilitychange = 'msvisibilitychange';
				visibilitystate = 'msvisibilitystate';
			} else if ( typeof document.webkithidden !== 'undefined' ) { // android.
				hidden = 'webkithidden';
				visibilitychange = 'webkitvisibilitychange';
				visibilitystate = 'webkitvisibilitystate';
			}

			if ( hidden ) {
				if ( document[hidden] ) {
					settings.hasfocus = false;
				}

				$document.on( visibilitychange + '.wp-heartbeat', function() {
					if ( document[visibilitystate] === 'hidden' ) {
						blurred();
						window.clearinterval( settings.checkfocustimer );
					} else {
						focused();
						if ( document.hasfocus ) {
							settings.checkfocustimer = window.setinterval( checkfocus, 10000 );
						}
					}
				});
			}

			// use document.hasfocus() if available.
			if ( document.hasfocus ) {
				settings.checkfocustimer = window.setinterval( checkfocus, 10000 );
			}

			$(window).on( 'pagehide.wp-heartbeat', function() {
				// don't connect anymore.
				suspend();

				// abort the last request if not completed.
				if ( settings.xhr && settings.xhr.readystate !== 4 ) {
					settings.xhr.abort();
				}
			});

			$(window).on(
				'pageshow.wp-heartbeat',
				/**
				 * handles pageshow event, specifically when page navigation is restored from back/forward cache.
				 *
				 * @param {jquery.event} event
				 * @param {pagetransitionevent} event.originalevent
				 */
				function ( event ) {
					if ( event.originalevent.persisted ) {
						/*
						 * when page navigation is stored via bfcache (back/forward cache), consider this the same as
						 * if the user had just switched to the tab since the behavior is similar.
						 */
						focused();
					}
				}
			);

			// check for user activity every 30 seconds.
			window.setinterval( checkuseractivity, 30000 );

			// start one tick after dom ready.
			$( function() {
				settings.lasttick = time();
				schedulenexttick();
			});
		}

		/**
		 * returns the current time according to the browser.
		 *
		 * @since 3.6.0
		 * @access private
		 *
		 * @return {number} returns the current time.
		 */
		function time() {
			return (new date()).gettime();
		}

		/**
		 * checks if the iframe is from the same origin.
		 *
		 * @since 3.6.0
		 * @access private
		 *
		 * @return {boolean} returns whether or not the iframe is from the same origin.
		 */
		function islocalframe( frame ) {
			var origin, src = frame.src;

			/*
			 * need to compare strings as webkit doesn't throw js errors when iframes have
			 * different origin. it throws uncatchable exceptions.
			 */
			if ( src && /^https?:\/\//.test( src ) ) {
				origin = window.location.origin ? window.location.origin : window.location.protocol + '//' + window.location.host;

				if ( src.indexof( origin ) !== 0 ) {
					return false;
				}
			}

			try {
				if ( frame.contentwindow.document ) {
					return true;
				}
			} catch(e) {}

			return false;
		}

		/**
		 * checks if the document's focus has changed.
		 *
		 * @since 4.1.0
		 * @access private
		 *
		 * @return {void}
		 */
		function checkfocus() {
			if ( settings.hasfocus && ! document.hasfocus() ) {
				blurred();
			} else if ( ! settings.hasfocus && document.hasfocus() ) {
				focused();
			}
		}

		/**
		 * sets error state and fires an event on xhr errors or timeout.
		 *
		 * @since 3.8.0
		 * @access private
		 *
		 * @param {string} error  the error type passed from the xhr.
		 * @param {number} status the http status code passed from jqxhr
		 *                        (200, 404, 500, etc.).
		 *
		 * @return {void}
		 */
		function seterrorstate( error, status ) {
			var trigger;

			if ( error ) {
				switch ( error ) {
					case 'abort':
						// do nothing.
						break;
					case 'timeout':
						// no response for 30 seconds.
						trigger = true;
						break;
					case 'error':
						if ( 503 === status && settings.hasconnected ) {
							trigger = true;
							break;
						}
						/* falls through */
					case 'parsererror':
					case 'empty':
					case 'unknown':
						settings.errorcount++;

						if ( settings.errorcount > 2 && settings.hasconnected ) {
							trigger = true;
						}

						break;
				}

				if ( trigger && ! hasconnectionerror() ) {
					settings.connectionerror = true;
					$document.trigger( 'heartbeat-connection-lost', [error, status] );
					wp.hooks.doaction( 'heartbeat.connection-lost', error, status );
				}
			}
		}

		/**
		 * clears the error state and fires an event if there is a connection error.
		 *
		 * @since 3.8.0
		 * @access private
		 *
		 * @return {void}
		 */
		function clearerrorstate() {
			// has connected successfully.
			settings.hasconnected = true;

			if ( hasconnectionerror() ) {
				settings.errorcount = 0;
				settings.connectionerror = false;
				$document.trigger( 'heartbeat-connection-restored' );
				wp.hooks.doaction( 'heartbeat.connection-restored' );
			}
		}

		/**
		 * gathers the data and connects to the server.
		 *
		 * @since 3.6.0
		 * @access private
		 *
		 * @return {void}
		 */
		function connect() {
			var ajaxdata, heartbeatdata;

			// if the connection to the server is slower than the interval,
			// heartbeat connects as soon as the previous connection's response is received.
			if ( settings.connecting || settings.suspend ) {
				return;
			}

			settings.lasttick = time();

			heartbeatdata = $.extend( {}, settings.queue );
			// clear the data queue. anything added after this point will be sent on the next tick.
			settings.queue = {};

			$document.trigger( 'heartbeat-send', [ heartbeatdata ] );
			wp.hooks.doaction( 'heartbeat.send', heartbeatdata );

			ajaxdata = {
				data: heartbeatdata,
				interval: settings.tempinterval ? settings.tempinterval / 1000 : settings.maininterval / 1000,
				_nonce: typeof window.heartbeatsettings === 'object' ? window.heartbeatsettings.nonce : '',
				action: 'heartbeat',
				screen_id: settings.screenid,
				has_focus: settings.hasfocus
			};

			if ( 'customize' === settings.screenid  ) {
				ajaxdata.wp_customize = 'on';
			}

			settings.connecting = true;
			settings.xhr = $.ajax({
				url: settings.url,
				type: 'post',
				timeout: 30000, // throw an error if not completed after 30 seconds.
				data: ajaxdata,
				datatype: 'json'
			}).always( function() {
				settings.connecting = false;
				schedulenexttick();
			}).done( function( response, textstatus, jqxhr ) {
				var newinterval;

				if ( ! response ) {
					seterrorstate( 'empty' );
					return;
				}

				clearerrorstate();

				if ( response.nonces_expired ) {
					$document.trigger( 'heartbeat-nonces-expired' );
					wp.hooks.doaction( 'heartbeat.nonces-expired' );
				}

				// change the interval from php.
				if ( response.heartbeat_interval ) {
					newinterval = response.heartbeat_interval;
					delete response.heartbeat_interval;
				}

				// update the heartbeat nonce if set.
				if ( response.heartbeat_nonce && typeof window.heartbeatsettings === 'object' ) {
					window.heartbeatsettings.nonce = response.heartbeat_nonce;
					delete response.heartbeat_nonce;
				}

				// update the rest api nonce if set and wp-api loaded.
				if ( response.rest_nonce && typeof window.wpapisettings === 'object' ) {
					window.wpapisettings.nonce = response.rest_nonce;
					// this nonce is required for api-fetch through heartbeat.tick.
					// delete response.rest_nonce;
				}

				$document.trigger( 'heartbeat-tick', [response, textstatus, jqxhr] );
				wp.hooks.doaction( 'heartbeat.tick', response, textstatus, jqxhr );

				// do this last. can trigger the next xhr if connection time > 5 seconds and newinterval == 'fast'.
				if ( newinterval ) {
					interval( newinterval );
				}
			}).fail( function( jqxhr, textstatus, error ) {
				seterrorstate( textstatus || 'unknown', jqxhr.status );
				$document.trigger( 'heartbeat-error', [jqxhr, textstatus, error] );
				wp.hooks.doaction( 'heartbeat.error', jqxhr, textstatus, error );
			});
		}

		/**
		 * schedules the next connection.
		 *
		 * fires immediately if the connection time is longer than the interval.
		 *
		 * @since 3.8.0
		 * @access private
		 *
		 * @return {void}
		 */
		function schedulenexttick() {
			var delta = time() - settings.lasttick,
				interval = settings.maininterval;

			if ( settings.suspend ) {
				return;
			}

			if ( ! settings.hasfocus ) {
				interval = 120000; // 120 seconds. post locks expire after 150 seconds.
			} else if ( settings.countdown > 0 && settings.tempinterval ) {
				interval = settings.tempinterval;
				settings.countdown--;

				if ( settings.countdown < 1 ) {
					settings.tempinterval = 0;
				}
			}

			if ( settings.minimalinterval && interval < settings.minimalinterval ) {
				interval = settings.minimalinterval;
			}

			window.cleartimeout( settings.beattimer );

			if ( delta < interval ) {
				settings.beattimer = window.settimeout(
					function() {
						connect();
					},
					interval - delta
				);
			} else {
				connect();
			}
		}

		/**
		 * sets the internal state when the browser window becomes hidden or loses focus.
		 *
		 * @since 3.6.0
		 * @access private
		 *
		 * @return {void}
		 */
		function blurred() {
			settings.hasfocus = false;
		}

		/**
		 * sets the internal state when the browser window becomes visible or is in focus.
		 *
		 * @since 3.6.0
		 * @access private
		 *
		 * @return {void}
		 */
		function focused() {
			settings.useractivity = time();

			// resume if suspended.
			resume();

			if ( ! settings.hasfocus ) {
				settings.hasfocus = true;
				schedulenexttick();
			}
		}

		/**
		 * suspends connecting.
		 */
		function suspend() {
			settings.suspend = true;
		}

		/**
		 * resumes connecting.
		 */
		function resume() {
			settings.suspend = false;
		}

		/**
		 * runs when the user becomes active after a period of inactivity.
		 *
		 * @since 3.6.0
		 * @access private
		 *
		 * @return {void}
		 */
		function userisactive() {
			settings.useractivityevents = false;
			$document.off( '.wp-heartbeat-active' );

			$('iframe').each( function( i, frame ) {
				if ( islocalframe( frame ) ) {
					$( frame.contentwindow ).off( '.wp-heartbeat-active' );
				}
			});

			focused();
		}

		/**
		 * checks for user activity.
		 *
		 * runs every 30 seconds. sets 'hasfocus = true' if user is active and the window
		 * is in the background. sets 'hasfocus = false' if the user has been inactive
		 * (no mouse or keyboard activity) for 5 minutes even when the window has focus.
		 *
		 * @since 3.8.0
		 * @access private
		 *
		 * @return {void}
		 */
		function checkuseractivity() {
			var lastactive = settings.useractivity ? time() - settings.useractivity : 0;

			// throttle down when no mouse or keyboard activity for 5 minutes.
			if ( lastactive > 300000 && settings.hasfocus ) {
				blurred();
			}

			// suspend after 10 minutes of inactivity when suspending is enabled.
			// always suspend after 60 minutes of inactivity. this will release the post lock, etc.
			if ( ( settings.suspendenabled && lastactive > 600000 ) || lastactive > 3600000 ) {
				suspend();
			}

			if ( ! settings.useractivityevents ) {
				$document.on( 'mouseover.wp-heartbeat-active keyup.wp-heartbeat-active touchend.wp-heartbeat-active', function() {
					userisactive();
				});

				$('iframe').each( function( i, frame ) {
					if ( islocalframe( frame ) ) {
						$( frame.contentwindow ).on( 'mouseover.wp-heartbeat-active keyup.wp-heartbeat-active touchend.wp-heartbeat-active', function() {
							userisactive();
						});
					}
				});

				settings.useractivityevents = true;
			}
		}

		// public methods.

		/**
		 * checks whether the window (or any local iframe in it) has focus, or the user
		 * is active.
		 *
		 * @since 3.6.0
		 * @memberof wp.heartbeat.prototype
		 *
		 * @return {boolean} true if the window or the user is active.
		 */
		function hasfocus() {
			return settings.hasfocus;
		}

		/**
		 * checks whether there is a connection error.
		 *
		 * @since 3.6.0
		 *
		 * @memberof wp.heartbeat.prototype
		 *
		 * @return {boolean} true if a connection error was found.
		 */
		function hasconnectionerror() {
			return settings.connectionerror;
		}

		/**
		 * connects as soon as possible regardless of 'hasfocus' state.
		 *
		 * will not open two concurrent connections. if a connection is in progress,
		 * will connect again immediately after the current connection completes.
		 *
		 * @since 3.8.0
		 *
		 * @memberof wp.heartbeat.prototype
		 *
		 * @return {void}
		 */
		function connectnow() {
			settings.lasttick = 0;
			schedulenexttick();
		}

		/**
		 * disables suspending.
		 *
		 * should be used only when heartbeat is performing critical tasks like
		 * autosave, post-locking, etc. using this on many screens may overload
		 * the user's hosting account if several browser windows/tabs are left open
		 * for a long time.
		 *
		 * @since 3.8.0
		 *
		 * @memberof wp.heartbeat.prototype
		 *
		 * @return {void}
		 */
		function disablesuspend() {
			settings.suspendenabled = false;
		}

		/**
		 * gets/sets the interval.
		 *
		 * when setting to 'fast' or 5, the interval is 5 seconds for the next 30 ticks
		 * (for 2 minutes and 30 seconds) by default. in this case the number of 'ticks'
		 * can be passed as second argument. if the window doesn't have focus,
		 * the interval slows down to 2 minutes.
		 *
		 * @since 3.6.0
		 *
		 * @memberof wp.heartbeat.prototype
		 *
		 * @param {string|number} speed interval: 'fast' or integer between 1 and 3600 (seconds).
		 *                              fast equals 5.
		 * @param {number}        ticks tells how many ticks before the interval reverts back.
		 *                              value must be between 1 and 30. used with speed = 'fast' or 5.
		 *
		 * @return {number} current interval in seconds.
		 */
		function interval( speed, ticks ) {
			var newinterval,
				oldinterval = settings.tempinterval ? settings.tempinterval : settings.maininterval;

			if ( speed ) {
				if ( 'fast' === speed ) {
					// special case, see below.
					newinterval = 5000;
				} else if ( 'long-polling' === speed ) {
					// allow long polling (experimental).
					settings.maininterval = 0;
					return 0;
				} else {
					speed = parseint( speed, 10 );

					if ( speed >= 1 && speed <= 3600 ) {
						newinterval = speed * 1000;
					} else {
						newinterval = settings.originalinterval;
					}
				}

				if ( settings.minimalinterval && newinterval < settings.minimalinterval ) {
					newinterval = settings.minimalinterval;
				}

				// special case, runs for a number of ticks then reverts to the previous interval.
				if ( 5000 === newinterval ) {
					ticks = parseint( ticks, 10 ) || 30;
					ticks = ticks < 1 || ticks > 30 ? 30 : ticks;

					settings.countdown = ticks;
					settings.tempinterval = newinterval;
				} else {
					settings.countdown = 0;
					settings.tempinterval = 0;
					settings.maininterval = newinterval;
				}

				/*
				 * change the next connection time if new interval has been set.
				 * will connect immediately if the time since the last connection
				 * is greater than the new interval.
				 */
				if ( newinterval !== oldinterval ) {
					schedulenexttick();
				}
			}

			return settings.tempinterval ? settings.tempinterval / 1000 : settings.maininterval / 1000;
		}

		/**
		 * enqueues data to send with the next xhr.
		 *
		 * as the data is send asynchronously, this function doesn't return the xhr
		 * response. to see the response, use the custom jquery event 'heartbeat-tick'
		 * on the document, example:
		 *		$(document).on( 'heartbeat-tick.myname', function( event, data, textstatus, jqxhr ) {
		 *			// code
		 *		});
		 * if the same 'handle' is used more than once, the data is not overwritten when
		 * the third argument is 'true'. use `wp.heartbeat.isqueued('handle')` to see if
		 * any data is already queued for that handle.
		 *
		 * @since 3.6.0
		 *
		 * @memberof wp.heartbeat.prototype
		 *
		 * @param {string}  handle      unique handle for the data, used in php to
		 *                              receive the data.
		 * @param {*}       data        the data to send.
		 * @param {boolean} nooverwrite whether to overwrite existing data in the queue.
		 *
		 * @return {boolean} true if the data was queued.
		 */
		function enqueue( handle, data, nooverwrite ) {
			if ( handle ) {
				if ( nooverwrite && this.isqueued( handle ) ) {
					return false;
				}

				settings.queue[handle] = data;
				return true;
			}
			return false;
		}

		/**
		 * checks if data with a particular handle is queued.
		 *
		 * @since 3.6.0
		 *
		 * @param {string} handle the handle for the data.
		 *
		 * @return {boolean} true if the data is queued with this handle.
		 */
		function isqueued( handle ) {
			if ( handle ) {
				return settings.queue.hasownproperty( handle );
			}
		}

		/**
		 * removes data with a particular handle from the queue.
		 *
		 * @since 3.7.0
		 *
		 * @memberof wp.heartbeat.prototype
		 *
		 * @param {string} handle the handle for the data.
		 *
		 * @return {void}
		 */
		function dequeue( handle ) {
			if ( handle ) {
				delete settings.queue[handle];
			}
		}

		/**
		 * gets data that was enqueued with a particular handle.
		 *
		 * @since 3.7.0
		 *
		 * @memberof wp.heartbeat.prototype
		 *
		 * @param {string} handle the handle for the data.
		 *
		 * @return {*} the data or undefined.
		 */
		function getqueueditem( handle ) {
			if ( handle ) {
				return this.isqueued( handle ) ? settings.queue[handle] : undefined;
			}
		}

		initialize();

		// expose public methods.
		return {
			hasfocus: hasfocus,
			connectnow: connectnow,
			disablesuspend: disablesuspend,
			interval: interval,
			hasconnectionerror: hasconnectionerror,
			enqueue: enqueue,
			dequeue: dequeue,
			isqueued: isqueued,
			getqueueditem: getqueueditem
		};
	};

	/**
	 * ensure the global `wp` object exists.
	 *
	 * @namespace wp
	 */
	window.wp = window.wp || {};

	/**
	 * contains the heartbeat api.
	 *
	 * @namespace wp.heartbeat
	 * @type {heartbeat}
	 */
	window.wp.heartbeat = new heartbeat();

}( jquery, window ));








