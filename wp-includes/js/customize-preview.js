/*
 * script run inside a customizer preview frame.
 *
 * @output wp-includes/js/customize-preview.js
 */
(function( exports, $ ){
	var api = wp.customize,
		debounce,
		currenthistorystate = {};

	/*
	 * capture the state that is passed into history.replacestate() and history.pushstate()
	 * and also which is returned in the popstate event so that when the changeset_uuid
	 * gets updated when transitioning to a new changeset there the current state will
	 * be supplied in the call to history.replacestate().
	 */
	( function( history ) {
		var injecturlwithstate;

		if ( ! history.replacestate ) {
			return;
		}

		/**
		 * amend the supplied url with the customized state.
		 *
		 * @since 4.7.0
		 * @access private
		 *
		 * @param {string} url url.
		 * @return {string} url with customized state.
		 */
		injecturlwithstate = function( url ) {
			var urlparser, oldqueryparams, newqueryparams;
			urlparser = document.createelement( 'a' );
			urlparser.href = url;
			oldqueryparams = api.utils.parsequerystring( location.search.substr( 1 ) );
			newqueryparams = api.utils.parsequerystring( urlparser.search.substr( 1 ) );

			newqueryparams.customize_changeset_uuid = oldqueryparams.customize_changeset_uuid;
			if ( oldqueryparams.customize_autosaved ) {
				newqueryparams.customize_autosaved = 'on';
			}
			if ( oldqueryparams.customize_theme ) {
				newqueryparams.customize_theme = oldqueryparams.customize_theme;
			}
			if ( oldqueryparams.customize_messenger_channel ) {
				newqueryparams.customize_messenger_channel = oldqueryparams.customize_messenger_channel;
			}
			urlparser.search = $.param( newqueryparams );
			return urlparser.href;
		};

		history.replacestate = ( function( nativereplacestate ) {
			return function historyreplacestate( data, title, url ) {
				currenthistorystate = data;
				return nativereplacestate.call( history, data, title, 'string' === typeof url && url.length > 0 ? injecturlwithstate( url ) : url );
			};
		} )( history.replacestate );

		history.pushstate = ( function( nativepushstate ) {
			return function historypushstate( data, title, url ) {
				currenthistorystate = data;
				return nativepushstate.call( history, data, title, 'string' === typeof url && url.length > 0 ? injecturlwithstate( url ) : url );
			};
		} )( history.pushstate );

		window.addeventlistener( 'popstate', function( event ) {
			currenthistorystate = event.state;
		} );

	}( history ) );

	/**
	 * returns a debounced version of the function.
	 *
	 * @todo require underscore.js for this file and retire this.
	 */
	debounce = function( fn, delay, context ) {
		var timeout;
		return function() {
			var args = arguments;

			context = context || this;

			cleartimeout( timeout );
			timeout = settimeout( function() {
				timeout = null;
				fn.apply( context, args );
			}, delay );
		};
	};

	/**
	 * @memberof wp.customize
	 * @alias wp.customize.preview
	 *
	 * @constructor
	 * @augments wp.customize.messenger
	 * @augments wp.customize.class
	 * @mixes wp.customize.events
	 */
	api.preview = api.messenger.extend(/** @lends wp.customize.preview.prototype */{
		/**
		 * @param {object} params  - parameters to configure the messenger.
		 * @param {object} options - extend any instance parameter or method with this object.
		 */
		initialize: function( params, options ) {
			var preview = this, urlparser = document.createelement( 'a' );

			api.messenger.prototype.initialize.call( preview, params, options );

			urlparser.href = preview.origin();
			preview.add( 'scheme', urlparser.protocol.replace( /:$/, '' ) );

			preview.body = $( document.body );
			preview.window = $( window );

			if ( api.settings.channel ) {

				// if in an iframe, then intercept the link clicks and form submissions.
				preview.body.on( 'click.preview', 'a', function( event ) {
					preview.handlelinkclick( event );
				} );
				preview.body.on( 'submit.preview', 'form', function( event ) {
					preview.handleformsubmit( event );
				} );

				preview.window.on( 'scroll.preview', debounce( function() {
					preview.send( 'scroll', preview.window.scrolltop() );
				}, 200 ) );

				preview.bind( 'scroll', function( distance ) {
					preview.window.scrolltop( distance );
				});
			}
		},

		/**
		 * handle link clicks in preview.
		 *
		 * @since 4.7.0
		 * @access public
		 *
		 * @param {jquery.event} event event.
		 */
		handlelinkclick: function( event ) {
			var preview = this, link, isinternaljumplink;
			link = $( event.target ).closest( 'a' );

			// no-op if the anchor is not a link.
			if ( _.isundefined( link.attr( 'href' ) ) ) {
				return;
			}

			// allow internal jump links and js links to behave normally without preventing default.
			isinternaljumplink = ( '#' === link.attr( 'href' ).substr( 0, 1 ) );
			if ( isinternaljumplink || ! /^https?:$/.test( link.prop( 'protocol' ) ) ) {
				return;
			}

			// if the link is not previewable, prevent the browser from navigating to it.
			if ( ! api.islinkpreviewable( link[0] ) ) {
				wp.a11y.speak( api.settings.l10n.linkunpreviewable );
				event.preventdefault();
				return;
			}

			// prevent initiating navigating from click and instead rely on sending url message to pane.
			event.preventdefault();

			/*
			 * note the shift key is checked so shift+click on widgets or
			 * nav menu items can just result on focusing on the corresponding
			 * control instead of also navigating to the url linked to.
			 */
			if ( event.shiftkey ) {
				return;
			}

			// note: it's not relevant to send scroll because sending url message will have the same effect.
			preview.send( 'url', link.prop( 'href' ) );
		},

		/**
		 * handle form submit.
		 *
		 * @since 4.7.0
		 * @access public
		 *
		 * @param {jquery.event} event event.
		 */
		handleformsubmit: function( event ) {
			var preview = this, urlparser, form;
			urlparser = document.createelement( 'a' );
			form = $( event.target );
			urlparser.href = form.prop( 'action' );

			// if the link is not previewable, prevent the browser from navigating to it.
			if ( 'get' !== form.prop( 'method' ).touppercase() || ! api.islinkpreviewable( urlparser ) ) {
				wp.a11y.speak( api.settings.l10n.formunpreviewable );
				event.preventdefault();
				return;
			}

			/*
			 * if the default wasn't prevented already (in which case the form
			 * submission is already being handled by js), and if it has a get
			 * request method, then take the serialized form data and add it as
			 * a query string to the action url and send this in a url message
			 * to the customizer pane so that it will be loaded. if the form's
			 * action points to a non-previewable url, the customizer pane's
			 * previewurl setter will reject it so that the form submission is
			 * a no-op, which is the same behavior as when clicking a link to an
			 * external site in the preview.
			 */
			if ( ! event.isdefaultprevented() ) {
				if ( urlparser.search.length > 1 ) {
					urlparser.search += '&';
				}
				urlparser.search += form.serialize();
				preview.send( 'url', urlparser.href );
			}

			// prevent default since navigation should be done via sending url message or via js submit handler.
			event.preventdefault();
		}
	});

	/**
	 * inject the changeset uuid into links in the document.
	 *
	 * @since 4.7.0
	 * @access protected
	 * @access private
	 *
	 * @return {void}
	 */
	api.addlinkpreviewing = function addlinkpreviewing() {
		var linkselectors = 'a[href], area[href]';

		// inject links into initial document.
		$( document.body ).find( linkselectors ).each( function() {
			api.preparelinkpreview( this );
		} );

		// inject links for new elements added to the page.
		if ( 'undefined' !== typeof mutationobserver ) {
			api.mutationobserver = new mutationobserver( function( mutations ) {
				_.each( mutations, function( mutation ) {
					$( mutation.target ).find( linkselectors ).each( function() {
						api.preparelinkpreview( this );
					} );
				} );
			} );
			api.mutationobserver.observe( document.documentelement, {
				childlist: true,
				subtree: true
			} );
		} else {

			// if mutation observers aren't available, fallback to just-in-time injection.
			$( document.documentelement ).on( 'click focus mouseover', linkselectors, function() {
				api.preparelinkpreview( this );
			} );
		}
	};

	/**
	 * should the supplied link is previewable.
	 *
	 * @since 4.7.0
	 * @access public
	 *
	 * @param {htmlanchorelement|htmlareaelement} element link element.
	 * @param {string} element.search query string.
	 * @param {string} element.pathname path.
	 * @param {string} element.host host.
	 * @param {object} [options]
	 * @param {object} [options.allowadminajax=false] allow admin-ajax.php requests.
	 * @return {boolean} is appropriate for changeset link.
	 */
	api.islinkpreviewable = function islinkpreviewable( element, options ) {
		var matchesallowedurl, parsedallowedurl, args, elementhost;

		args = _.extend( {}, { allowadminajax: false }, options || {} );

		if ( 'javascript:' === element.protocol ) { // jshint ignore:line
			return true;
		}

		// only web urls can be previewed.
		if ( 'https:' !== element.protocol && 'http:' !== element.protocol ) {
			return false;
		}

		elementhost = element.host.replace( /:(80|443)$/, '' );
		parsedallowedurl = document.createelement( 'a' );
		matchesallowedurl = ! _.isundefined( _.find( api.settings.url.allowed, function( allowedurl ) {
			parsedallowedurl.href = allowedurl;
			return parsedallowedurl.protocol === element.protocol && parsedallowedurl.host.replace( /:(80|443)$/, '' ) === elementhost && 0 === element.pathname.indexof( parsedallowedurl.pathname.replace( /\/$/, '' ) );
		} ) );
		if ( ! matchesallowedurl ) {
			return false;
		}

		// skip wp login and signup pages.
		if ( /\/wp-(login|signup)\.php$/.test( element.pathname ) ) {
			return false;
		}

		// allow links to admin ajax as faux frontend urls.
		if ( /\/wp-admin\/admin-ajax\.php$/.test( element.pathname ) ) {
			return args.allowadminajax;
		}

		// disallow links to admin, includes, and content.
		if ( /\/wp-(admin|includes|content)(\/|$)/.test( element.pathname ) ) {
			return false;
		}

		return true;
	};

	/**
	 * inject the customize_changeset_uuid query param into links on the frontend.
	 *
	 * @since 4.7.0
	 * @access protected
	 *
	 * @param {htmlanchorelement|htmlareaelement} element link element.
	 * @param {string} element.search query string.
	 * @param {string} element.host host.
	 * @param {string} element.protocol protocol.
	 * @return {void}
	 */
	api.preparelinkpreview = function preparelinkpreview( element ) {
		var queryparams, $element = $( element );

        // skip elements with no href attribute. check first to avoid more expensive checks down the road.
        if ( ! element.hasattribute( 'href' ) ) {
            return;
        }

		// skip links in admin bar.
		if ( $element.closest( '#wpadminbar' ).length ) {
			return;
		}

		// ignore links with href="#", href="#id", or non-http protocols (e.g. javascript: and mailto:).
		if ( '#' === $element.attr( 'href' ).substr( 0, 1 ) || ! /^https?:$/.test( element.protocol ) ) {
			return;
		}

		// make sure links in preview use https if parent frame uses https.
		if ( api.settings.channel && 'https' === api.preview.scheme.get() && 'http:' === element.protocol && -1 !== api.settings.url.allowedhosts.indexof( element.host ) ) {
			element.protocol = 'https:';
		}

		// ignore links with class wp-playlist-caption.
		if ( $element.hasclass( 'wp-playlist-caption' ) ) {
			return;
		}

		if ( ! api.islinkpreviewable( element ) ) {

			// style link as unpreviewable only if previewing in iframe; if previewing on frontend, links will be allowed to work normally.
			if ( api.settings.channel ) {
				$element.addclass( 'customize-unpreviewable' );
			}
			return;
		}
		$element.removeclass( 'customize-unpreviewable' );

		queryparams = api.utils.parsequerystring( element.search.substring( 1 ) );
		queryparams.customize_changeset_uuid = api.settings.changeset.uuid;
		if ( api.settings.changeset.autosaved ) {
			queryparams.customize_autosaved = 'on';
		}
		if ( ! api.settings.theme.active ) {
			queryparams.customize_theme = api.settings.theme.stylesheet;
		}
		if ( api.settings.channel ) {
			queryparams.customize_messenger_channel = api.settings.channel;
		}
		element.search = $.param( queryparams );
	};

	/**
	 * inject the changeset uuid into ajax requests.
	 *
	 * @since 4.7.0
	 * @access protected
	 *
	 * @return {void}
	 */
	api.addrequestpreviewing = function addrequestpreviewing() {

		/**
		 * rewrite ajax requests to inject customizer state.
		 *
		 * @param {object} options options.
		 * @param {string} options.type type.
		 * @param {string} options.url url.
		 * @param {object} originaloptions original options.
		 * @param {xmlhttprequest} xhr xhr.
		 * @return {void}
		 */
		var prefilterajax = function( options, originaloptions, xhr ) {
			var urlparser, queryparams, requestmethod, dirtyvalues = {};
			urlparser = document.createelement( 'a' );
			urlparser.href = options.url;

			// abort if the request is not for this site.
			if ( ! api.islinkpreviewable( urlparser, { allowadminajax: true } ) ) {
				return;
			}
			queryparams = api.utils.parsequerystring( urlparser.search.substring( 1 ) );

			// note that _dirty flag will be cleared with changeset updates.
			api.each( function( setting ) {
				if ( setting._dirty ) {
					dirtyvalues[ setting.id ] = setting.get();
				}
			} );

			if ( ! _.isempty( dirtyvalues ) ) {
				requestmethod = options.type.touppercase();

				// override underlying request method to ensure unsaved changes to changeset can be included (force backbone.emulatehttp).
				if ( 'post' !== requestmethod ) {
					xhr.setrequestheader( 'x-http-method-override', requestmethod );
					queryparams._method = requestmethod;
					options.type = 'post';
				}

				// amend the post data with the customized values.
				if ( options.data ) {
					options.data += '&';
				} else {
					options.data = '';
				}
				options.data += $.param( {
					customized: json.stringify( dirtyvalues )
				} );
			}

			// include customized state query params in url.
			queryparams.customize_changeset_uuid = api.settings.changeset.uuid;
			if ( api.settings.changeset.autosaved ) {
				queryparams.customize_autosaved = 'on';
			}
			if ( ! api.settings.theme.active ) {
				queryparams.customize_theme = api.settings.theme.stylesheet;
			}

			// ensure preview nonce is included with every customized request, to allow post data to be read.
			queryparams.customize_preview_nonce = api.settings.nonce.preview;

			urlparser.search = $.param( queryparams );
			options.url = urlparser.href;
		};

		$.ajaxprefilter( prefilterajax );
	};

	/**
	 * inject changeset uuid into forms, allowing preview to persist through submissions.
	 *
	 * @since 4.7.0
	 * @access protected
	 *
	 * @return {void}
	 */
	api.addformpreviewing = function addformpreviewing() {

		// inject inputs for forms in initial document.
		$( document.body ).find( 'form' ).each( function() {
			api.prepareformpreview( this );
		} );

		// inject inputs for new forms added to the page.
		if ( 'undefined' !== typeof mutationobserver ) {
			api.mutationobserver = new mutationobserver( function( mutations ) {
				_.each( mutations, function( mutation ) {
					$( mutation.target ).find( 'form' ).each( function() {
						api.prepareformpreview( this );
					} );
				} );
			} );
			api.mutationobserver.observe( document.documentelement, {
				childlist: true,
				subtree: true
			} );
		}
	};

	/**
	 * inject changeset into form inputs.
	 *
	 * @since 4.7.0
	 * @access protected
	 *
	 * @param {htmlformelement} form form.
	 * @return {void}
	 */
	api.prepareformpreview = function prepareformpreview( form ) {
		var urlparser, stateparams = {};

		if ( ! form.action ) {
			form.action = location.href;
		}

		urlparser = document.createelement( 'a' );
		urlparser.href = form.action;

		// make sure forms in preview use https if parent frame uses https.
		if ( api.settings.channel && 'https' === api.preview.scheme.get() && 'http:' === urlparser.protocol && -1 !== api.settings.url.allowedhosts.indexof( urlparser.host ) ) {
			urlparser.protocol = 'https:';
			form.action = urlparser.href;
		}

		if ( 'get' !== form.method.touppercase() || ! api.islinkpreviewable( urlparser ) ) {

			// style form as unpreviewable only if previewing in iframe; if previewing on frontend, all forms will be allowed to work normally.
			if ( api.settings.channel ) {
				$( form ).addclass( 'customize-unpreviewable' );
			}
			return;
		}
		$( form ).removeclass( 'customize-unpreviewable' );

		stateparams.customize_changeset_uuid = api.settings.changeset.uuid;
		if ( api.settings.changeset.autosaved ) {
			stateparams.customize_autosaved = 'on';
		}
		if ( ! api.settings.theme.active ) {
			stateparams.customize_theme = api.settings.theme.stylesheet;
		}
		if ( api.settings.channel ) {
			stateparams.customize_messenger_channel = api.settings.channel;
		}

		_.each( stateparams, function( value, name ) {
			var input = $( form ).find( 'input[name="' + name + '"]' );
			if ( input.length ) {
				input.val( value );
			} else {
				$( form ).prepend( $( '<input>', {
					type: 'hidden',
					name: name,
					value: value
				} ) );
			}
		} );

		// prevent links from breaking out of preview iframe.
		if ( api.settings.channel ) {
			form.target = '_self';
		}
	};

	/**
	 * watch current url and send keep-alive (heartbeat) messages to the parent.
	 *
	 * keep the customizer pane notified that the preview is still alive
	 * and that the user hasn't navigated to a non-customized url.
	 *
	 * @since 4.7.0
	 * @access protected
	 */
	api.keepalivecurrenturl = ( function() {
		var previouspathname = location.pathname,
			previousquerystring = location.search.substr( 1 ),
			previousqueryparams = null,
			statequeryparams = [ 'customize_theme', 'customize_changeset_uuid', 'customize_messenger_channel', 'customize_autosaved' ];

		return function keepalivecurrenturl() {
			var urlparser, currentqueryparams;

			// short-circuit with keep-alive if previous url is identical (as is normal case).
			if ( previousquerystring === location.search.substr( 1 ) && previouspathname === location.pathname ) {
				api.preview.send( 'keep-alive' );
				return;
			}

			urlparser = document.createelement( 'a' );
			if ( null === previousqueryparams ) {
				urlparser.search = previousquerystring;
				previousqueryparams = api.utils.parsequerystring( previousquerystring );
				_.each( statequeryparams, function( name ) {
					delete previousqueryparams[ name ];
				} );
			}

			// determine if current url minus customized state params and url hash.
			urlparser.href = location.href;
			currentqueryparams = api.utils.parsequerystring( urlparser.search.substr( 1 ) );
			_.each( statequeryparams, function( name ) {
				delete currentqueryparams[ name ];
			} );

			if ( previouspathname !== location.pathname || ! _.isequal( previousqueryparams, currentqueryparams ) ) {
				urlparser.search = $.param( currentqueryparams );
				urlparser.hash = '';
				api.settings.url.self = urlparser.href;
				api.preview.send( 'ready', {
					currenturl: api.settings.url.self,
					activepanels: api.settings.activepanels,
					activesections: api.settings.activesections,
					activecontrols: api.settings.activecontrols,
					settingvalidities: api.settings.settingvalidities
				} );
			} else {
				api.preview.send( 'keep-alive' );
			}
			previousqueryparams = currentqueryparams;
			previousquerystring = location.search.substr( 1 );
			previouspathname = location.pathname;
		};
	} )();

	api.settingpreviewhandlers = {

		/**
		 * preview changes to custom logo.
		 *
		 * @param {number} attachmentid attachment id for custom logo.
		 * @return {void}
		 */
		custom_logo: function( attachmentid ) {
			$( 'body' ).toggleclass( 'wp-custom-logo', !! attachmentid );
		},

		/**
		 * preview changes to custom css.
		 *
		 * @param {string} value custom css.
		 * @return {void}
		 */
		custom_css: function( value ) {
			var style;
			if ( api.settings.theme.isblocktheme ) {
				style = $( 'style#global-styles-inline-css' );

				// forbid milestone comments from appearing in custom css which would break live preview.
				value = value.replace( /\/\*(begin|end)_customizer_custom_css\*\//g, '' );

				var textcontent = style.text().replace(
					/(\/\*begin_customizer_custom_css\*\/)((?:.|\s)*?)(\/\*end_customizer_custom_css\*\/)/,
					function ( match, beforecomment, oldvalue, aftercomment ) {
						return beforecomment + '\n' + value + '\n' + aftercomment;
					}
				);
				style.text( textcontent );
			} else {
				style = $( 'style#wp-custom-css' );
				style.text( value );
			}
		},

		/**
		 * preview changes to any of the background settings.
		 *
		 * @return {void}
		 */
		background: function() {
			var css = '', settings = {};

			_.each( ['color', 'image', 'preset', 'position_x', 'position_y', 'size', 'repeat', 'attachment'], function( prop ) {
				settings[ prop ] = api( 'background_' + prop );
			} );

			/*
			 * the body will support custom backgrounds if either the color or image are set.
			 *
			 * see get_body_class() in /wp-includes/post-template.php
			 */
			$( document.body ).toggleclass( 'custom-background', !! ( settings.color() || settings.image() ) );

			if ( settings.color() ) {
				css += 'background-color: ' + settings.color() + ';';
			}

			if ( settings.image() ) {
				css += 'background-image: url("' + settings.image() + '");';
				css += 'background-size: ' + settings.size() + ';';
				css += 'background-position: ' + settings.position_x() + ' ' + settings.position_y() + ';';
				css += 'background-repeat: ' + settings.repeat() + ';';
				css += 'background-attachment: ' + settings.attachment() + ';';
			}

			$( '#custom-background-css' ).text( 'body.custom-background { ' + css + ' }' );
		}
	};

	$( function() {
		var bg, setvalue, handleupdatedchangesetuuid;

		api.settings = window._wpcustomizesettings;
		if ( ! api.settings ) {
			return;
		}

		api.preview = new api.preview({
			url: window.location.href,
			channel: api.settings.channel
		});

		api.addlinkpreviewing();
		api.addrequestpreviewing();
		api.addformpreviewing();

		/**
		 * create/update a setting value.
		 *
		 * @param {string}  id            - setting id.
		 * @param {*}       value         - setting value.
		 * @param {boolean} [createdirty] - whether to create a setting as dirty. defaults to false.
		 */
		setvalue = function( id, value, createdirty ) {
			var setting = api( id );
			if ( setting ) {
				setting.set( value );
			} else {
				createdirty = createdirty || false;
				setting = api.create( id, value, {
					id: id
				} );

				// mark dynamically-created settings as dirty so they will get posted.
				if ( createdirty ) {
					setting._dirty = true;
				}
			}
		};

		api.preview.bind( 'settings', function( values ) {
			$.each( values, setvalue );
		});

		api.preview.trigger( 'settings', api.settings.values );

		$.each( api.settings._dirty, function( i, id ) {
			var setting = api( id );
			if ( setting ) {
				setting._dirty = true;
			}
		} );

		api.preview.bind( 'setting', function( args ) {
			var createdirty = true;
			setvalue.apply( null, args.concat( createdirty ) );
		});

		api.preview.bind( 'sync', function( events ) {

			/*
			 * delete any settings that already exist locally which haven't been
			 * modified in the controls while the preview was loading. this prevents
			 * situations where the js value being synced from the pane may differ
			 * from the php-sanitized js value in the preview which causes the
			 * non-sanitized js value to clobber the php-sanitized value. this
			 * is particularly important for selective refresh partials that
			 * have a fallback refresh behavior since infinite refreshing would
			 * result.
			 */
			if ( events.settings && events['settings-modified-while-loading'] ) {
				_.each( _.keys( events.settings ), function( syncedsettingid ) {
					if ( api.has( syncedsettingid ) && ! events['settings-modified-while-loading'][ syncedsettingid ] ) {
						delete events.settings[ syncedsettingid ];
					}
				} );
			}

			$.each( events, function( event, args ) {
				api.preview.trigger( event, args );
			});
			api.preview.send( 'synced' );
		});

		api.preview.bind( 'active', function() {
			api.preview.send( 'nonce', api.settings.nonce );

			api.preview.send( 'documenttitle', document.title );

			// send scroll in case of loading via non-refresh.
			api.preview.send( 'scroll', $( window ).scrolltop() );
		});

		/**
		 * handle update to changeset uuid.
		 *
		 * @param {string} uuid - uuid.
		 * @return {void}
		 */
		handleupdatedchangesetuuid = function( uuid ) {
			api.settings.changeset.uuid = uuid;

			// update uuids in links and forms.
			$( document.body ).find( 'a[href], area[href]' ).each( function() {
				api.preparelinkpreview( this );
			} );
			$( document.body ).find( 'form' ).each( function() {
				api.prepareformpreview( this );
			} );

			/*
			 * replace the uuid in the url. note that the wrapped history.replacestate()
			 * will handle injecting the current api.settings.changeset.uuid into the url,
			 * so this is merely to trigger that logic.
			 */
			if ( history.replacestate ) {
				history.replacestate( currenthistorystate, '', location.href );
			}
		};

		api.preview.bind( 'changeset-uuid', handleupdatedchangesetuuid );

		api.preview.bind( 'saved', function( response ) {
			if ( response.next_changeset_uuid ) {
				handleupdatedchangesetuuid( response.next_changeset_uuid );
			}
			api.trigger( 'saved', response );
		} );

		// update the urls to reflect the fact we've started autosaving.
		api.preview.bind( 'autosaving', function() {
			if ( api.settings.changeset.autosaved ) {
				return;
			}

			api.settings.changeset.autosaved = true; // start deferring to any autosave once changeset is updated.

			$( document.body ).find( 'a[href], area[href]' ).each( function() {
				api.preparelinkpreview( this );
			} );
			$( document.body ).find( 'form' ).each( function() {
				api.prepareformpreview( this );
			} );
			if ( history.replacestate ) {
				history.replacestate( currenthistorystate, '', location.href );
			}
		} );

		/*
		 * clear dirty flag for settings when saved to changeset so that they
		 * won't be needlessly included in selective refresh or ajax requests.
		 */
		api.preview.bind( 'changeset-saved', function( data ) {
			_.each( data.saved_changeset_values, function( value, settingid ) {
				var setting = api( settingid );
				if ( setting && _.isequal( setting.get(), value ) ) {
					setting._dirty = false;
				}
			} );
		} );

		api.preview.bind( 'nonce-refresh', function( nonce ) {
			$.extend( api.settings.nonce, nonce );
		} );

		/*
		 * send a message to the parent customize frame with a list of which
		 * containers and controls are active.
		 */
		api.preview.send( 'ready', {
			currenturl: api.settings.url.self,
			activepanels: api.settings.activepanels,
			activesections: api.settings.activesections,
			activecontrols: api.settings.activecontrols,
			settingvalidities: api.settings.settingvalidities
		} );

		// send ready when url changes via js.
		setinterval( api.keepalivecurrenturl, api.settings.timeouts.keepalivesend );

		// display a loading indicator when preview is reloading, and remove on failure.
		api.preview.bind( 'loading-initiated', function () {
			$( 'body' ).addclass( 'wp-customizer-unloading' );
		});
		api.preview.bind( 'loading-failed', function () {
			$( 'body' ).removeclass( 'wp-customizer-unloading' );
		});

		/* custom backgrounds */
		bg = $.map( ['color', 'image', 'preset', 'position_x', 'position_y', 'size', 'repeat', 'attachment'], function( prop ) {
			return 'background_' + prop;
		} );

		api.when.apply( api, bg ).done( function() {
			$.each( arguments, function() {
				this.bind( api.settingpreviewhandlers.background );
			});
		});

		/**
		 * custom logo
		 *
		 * toggle the wp-custom-logo body class when a logo is added or removed.
		 *
		 * @since 4.5.0
		 */
		api( 'custom_logo', function ( setting ) {
			api.settingpreviewhandlers.custom_logo.call( setting, setting.get() );
			setting.bind( api.settingpreviewhandlers.custom_logo );
		} );

		api( 'custom_css[' + api.settings.theme.stylesheet + ']', function( setting ) {
			setting.bind( api.settingpreviewhandlers.custom_css );
		} );

		api.trigger( 'preview-ready' );
	});

})( wp, jquery );







