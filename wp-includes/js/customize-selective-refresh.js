/**
 * @output wp-includes/js/customize-selective-refresh.js
 */

/* global jquery, json, _customizepartialrefreshexports, console */

/** @namespace wp.customize.selectiverefresh */
wp.customize.selectiverefresh = ( function( $, api ) {
	'use strict';
	var self, partial, placement;

	self = {
		ready: $.deferred(),
		editshortcutvisibility: new api.value(),
		data: {
			partials: {},
			renderqueryvar: '',
			l10n: {
				shiftclicktoedit: ''
			}
		},
		currentrequest: null
	};

	_.extend( self, api.events );

	/**
	 * a customizer partial.
	 *
	 * a partial provides a rendering of one or more settings according to a template.
	 *
	 * @memberof wp.customize.selectiverefresh
	 *
	 * @see php class wp_customize_partial.
	 *
	 * @class
	 * @augments wp.customize.class
	 * @since 4.5.0
	 */
	partial = self.partial = api.class.extend(/** @lends wp.customize.selectiverefresh.partial.prototype */{

		id: null,

		/**
		 * default params.
		 *
		 * @since 4.9.0
		 * @var {object}
		 */
		defaults: {
			selector: null,
			primarysetting: null,
			containerinclusive: false,
			fallbackrefresh: true // note this needs to be false in a front-end editing context.
		},

		/**
		 * constructor.
		 *
		 * @since 4.5.0
		 *
		 * @param {string}  id                      - unique identifier for the partial instance.
		 * @param {object}  options                 - options hash for the partial instance.
		 * @param {string}  options.type            - type of partial (e.g. nav_menu, widget, etc)
		 * @param {string}  options.selector        - jquery selector to find the container element in the page.
		 * @param {array}   options.settings        - the ids for the settings the partial relates to.
		 * @param {string}  options.primarysetting  - the id for the primary setting the partial renders.
		 * @param {boolean} options.fallbackrefresh - whether to refresh the entire preview in case of a partial refresh failure.
		 * @param {object}  [options.params]        - deprecated wrapper for the above properties.
		 */
		initialize: function( id, options ) {
			var partial = this;
			options = options || {};
			partial.id = id;

			partial.params = _.extend(
				{
					settings: []
				},
				partial.defaults,
				options.params || options
			);

			partial.deferred = {};
			partial.deferred.ready = $.deferred();

			partial.deferred.ready.done( function() {
				partial.ready();
			} );
		},

		/**
		 * set up the partial.
		 *
		 * @since 4.5.0
		 */
		ready: function() {
			var partial = this;
			_.each( partial.placements(), function( placement ) {
				$( placement.container ).attr( 'title', self.data.l10n.shiftclicktoedit );
				partial.createeditshortcutforplacement( placement );
			} );
			$( document ).on( 'click', partial.params.selector, function( e ) {
				if ( ! e.shiftkey ) {
					return;
				}
				e.preventdefault();
				_.each( partial.placements(), function( placement ) {
					if ( $( placement.container ).is( e.currenttarget ) ) {
						partial.showcontrol();
					}
				} );
			} );
		},

		/**
		 * create and show the edit shortcut for a given partial placement container.
		 *
		 * @since 4.7.0
		 * @access public
		 *
		 * @param {placement} placement the placement container element.
		 * @return {void}
		 */
		createeditshortcutforplacement: function( placement ) {
			var partial = this, $shortcut, $placementcontainer, illegalancestorselector, illegalcontainerselector;
			if ( ! placement.container ) {
				return;
			}
			$placementcontainer = $( placement.container );
			illegalancestorselector = 'head';
			illegalcontainerselector = 'area, audio, base, bdi, bdo, br, button, canvas, col, colgroup, command, datalist, embed, head, hr, html, iframe, img, input, keygen, label, link, map, math, menu, meta, noscript, object, optgroup, option, param, progress, rp, rt, ruby, script, select, source, style, svg, table, tbody, textarea, tfoot, thead, title, tr, track, video, wbr';
			if ( ! $placementcontainer.length || $placementcontainer.is( illegalcontainerselector ) || $placementcontainer.closest( illegalancestorselector ).length ) {
				return;
			}
			$shortcut = partial.createeditshortcut();
			$shortcut.on( 'click', function( event ) {
				event.preventdefault();
				event.stoppropagation();
				partial.showcontrol();
			} );
			partial.addeditshortcuttoplacement( placement, $shortcut );
		},

		/**
		 * add an edit shortcut to the placement container.
		 *
		 * @since 4.7.0
		 * @access public
		 *
		 * @param {placement} placement the placement for the partial.
		 * @param {jquery} $editshortcut the shortcut element as a jquery object.
		 * @return {void}
		 */
		addeditshortcuttoplacement: function( placement, $editshortcut ) {
			var $placementcontainer = $( placement.container );
			$placementcontainer.prepend( $editshortcut );
			if ( ! $placementcontainer.is( ':visible' ) || 'none' === $placementcontainer.css( 'display' ) ) {
				$editshortcut.addclass( 'customize-partial-edit-shortcut-hidden' );
			}
		},

		/**
		 * return the unique class name for the edit shortcut button for this partial.
		 *
		 * @since 4.7.0
		 * @access public
		 *
		 * @return {string} partial id converted into a class name for use in shortcut.
		 */
		geteditshortcutclassname: function() {
			var partial = this, cleanid;
			cleanid = partial.id.replace( /]/g, '' ).replace( /\[/g, '-' );
			return 'customize-partial-edit-shortcut-' + cleanid;
		},

		/**
		 * return the appropriate translated string for the edit shortcut button.
		 *
		 * @since 4.7.0
		 * @access public
		 *
		 * @return {string} tooltip for edit shortcut.
		 */
		geteditshortcuttitle: function() {
			var partial = this, l10n = self.data.l10n;
			switch ( partial.gettype() ) {
				case 'widget':
					return l10n.clickeditwidget;
				case 'blogname':
					return l10n.clickedittitle;
				case 'blogdescription':
					return l10n.clickedittitle;
				case 'nav_menu':
					return l10n.clickeditmenu;
				default:
					return l10n.clickeditmisc;
			}
		},

		/**
		 * return the type of this partial
		 *
		 * will use `params.type` if set, but otherwise will try to infer type from settingid.
		 *
		 * @since 4.7.0
		 * @access public
		 *
		 * @return {string} type of partial derived from type param or the related setting id.
		 */
		gettype: function() {
			var partial = this, settingid;
			settingid = partial.params.primarysetting || _.first( partial.settings() ) || 'unknown';
			if ( partial.params.type ) {
				return partial.params.type;
			}
			if ( settingid.match( /^nav_menu_instance\[/ ) ) {
				return 'nav_menu';
			}
			if ( settingid.match( /^widget_.+\[\d+]$/ ) ) {
				return 'widget';
			}
			return settingid;
		},

		/**
		 * create an edit shortcut button for this partial.
		 *
		 * @since 4.7.0
		 * @access public
		 *
		 * @return {jquery} the edit shortcut button element.
		 */
		createeditshortcut: function() {
			var partial = this, shortcuttitle, $buttoncontainer, $button, $image;
			shortcuttitle = partial.geteditshortcuttitle();
			$buttoncontainer = $( '<span>', {
				'class': 'customize-partial-edit-shortcut ' + partial.geteditshortcutclassname()
			} );
			$button = $( '<button>', {
				'aria-label': shortcuttitle,
				'title': shortcuttitle,
				'class': 'customize-partial-edit-shortcut-button'
			} );
			$image = $( '<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 20 20"><path d="m13.89 3.39l2.71 2.72c.46.46.42 1.24.03 1.64l-8.01 8.02-5.56 1.16 1.16-5.58s7.6-7.63 7.99-8.03c.39-.39 1.22-.39 1.68.07zm-2.73 2.79l-5.59 5.61 1.11 1.11 5.54-5.65zm-2.97 8.23l5.58-5.6-1.07-1.08-5.59 5.6z"/></svg>' );
			$button.append( $image );
			$buttoncontainer.append( $button );
			return $buttoncontainer;
		},

		/**
		 * find all placements for this partial in the document.
		 *
		 * @since 4.5.0
		 *
		 * @return {array.<placement>}
		 */
		placements: function() {
			var partial = this, selector;

			selector = partial.params.selector || '';
			if ( selector ) {
				selector += ', ';
			}
			selector += '[data-customize-partial-id="' + partial.id + '"]'; // @todo consider injecting customize-partial-id-${id} classnames instead.

			return $( selector ).map( function() {
				var container = $( this ), context;

				context = container.data( 'customize-partial-placement-context' );
				if ( _.isstring( context ) && '{' === context.substr( 0, 1 ) ) {
					throw new error( 'context json parse error' );
				}

				return new placement( {
					partial: partial,
					container: container,
					context: context
				} );
			} ).get();
		},

		/**
		 * get list of setting ids related to this partial.
		 *
		 * @since 4.5.0
		 *
		 * @return {string[]}
		 */
		settings: function() {
			var partial = this;
			if ( partial.params.settings && 0 !== partial.params.settings.length ) {
				return partial.params.settings;
			} else if ( partial.params.primarysetting ) {
				return [ partial.params.primarysetting ];
			} else {
				return [ partial.id ];
			}
		},

		/**
		 * return whether the setting is related to the partial.
		 *
		 * @since 4.5.0
		 *
		 * @param {wp.customize.value|string} setting  id or object for setting.
		 * @return {boolean} whether the setting is related to the partial.
		 */
		isrelatedsetting: function( setting /*... newvalue, oldvalue */ ) {
			var partial = this;
			if ( _.isstring( setting ) ) {
				setting = api( setting );
			}
			if ( ! setting ) {
				return false;
			}
			return -1 !== _.indexof( partial.settings(), setting.id );
		},

		/**
		 * show the control to modify this partial's setting(s).
		 *
		 * this may be overridden for inline editing.
		 *
		 * @since 4.5.0
		 */
		showcontrol: function() {
			var partial = this, settingid = partial.params.primarysetting;
			if ( ! settingid ) {
				settingid = _.first( partial.settings() );
			}
			if ( partial.gettype() === 'nav_menu' ) {
				if ( partial.params.navmenuargs.theme_location ) {
					settingid = 'nav_menu_locations[' + partial.params.navmenuargs.theme_location + ']';
				} else if ( partial.params.navmenuargs.menu )   {
					settingid = 'nav_menu[' + string( partial.params.navmenuargs.menu ) + ']';
				}
			}
			api.preview.send( 'focus-control-for-setting', settingid );
		},

		/**
		 * prepare container for selective refresh.
		 *
		 * @since 4.5.0
		 *
		 * @param {placement} placement
		 */
		prepareplacement: function( placement ) {
			$( placement.container ).addclass( 'customize-partial-refreshing' );
		},

		/**
		 * reference to the pending promise returned from self.requestpartial().
		 *
		 * @since 4.5.0
		 * @private
		 */
		_pendingrefreshpromise: null,

		/**
		 * request the new partial and render it into the placements.
		 *
		 * @since 4.5.0
		 *
		 * @this {wp.customize.selectiverefresh.partial}
		 * @return {jquery.promise}
		 */
		refresh: function() {
			var partial = this, refreshpromise;

			refreshpromise = self.requestpartial( partial );

			if ( ! partial._pendingrefreshpromise ) {
				_.each( partial.placements(), function( placement ) {
					partial.prepareplacement( placement );
				} );

				refreshpromise.done( function( placements ) {
					_.each( placements, function( placement ) {
						partial.rendercontent( placement );
					} );
				} );

				refreshpromise.fail( function( data, placements ) {
					partial.fallback( data, placements );
				} );

				// allow new request when this one finishes.
				partial._pendingrefreshpromise = refreshpromise;
				refreshpromise.always( function() {
					partial._pendingrefreshpromise = null;
				} );
			}

			return refreshpromise;
		},

		/**
		 * apply the addedcontent in the placement to the document.
		 *
		 * note the placement object will have its container and removednodes
		 * properties updated.
		 *
		 * @since 4.5.0
		 *
		 * @param {placement}             placement
		 * @param {element|jquery}        [placement.container]  - this param will be empty if there was no element matching the selector.
		 * @param {string|object|boolean} placement.addedcontent - rendered html content, a data object for js templates to render, or false if no render.
		 * @param {object}                [placement.context]    - optional context information about the container.
		 * @return {boolean} whether the rendering was successful and the fallback was not invoked.
		 */
		rendercontent: function( placement ) {
			var partial = this, content, newcontainerelement;
			if ( ! placement.container ) {
				partial.fallback( new error( 'no_container' ), [ placement ] );
				return false;
			}
			placement.container = $( placement.container );
			if ( false === placement.addedcontent ) {
				partial.fallback( new error( 'missing_render' ), [ placement ] );
				return false;
			}

			// currently a subclass needs to override rendercontent to handle partials returning data object.
			if ( ! _.isstring( placement.addedcontent ) ) {
				partial.fallback( new error( 'non_string_content' ), [ placement ] );
				return false;
			}

			/* jshint ignore:start */
			self.originaldocumentwrite = document.write;
			document.write = function() {
				throw new error( self.data.l10n.baddocumentwrite );
			};
			/* jshint ignore:end */
			try {
				content = placement.addedcontent;
				if ( wp.emoji && wp.emoji.parse && ! $.contains( document.head, placement.container[0] ) ) {
					content = wp.emoji.parse( content );
				}

				if ( partial.params.containerinclusive ) {

					// note that content may be an empty string, and in this case jquery will just remove the oldcontainer.
					newcontainerelement = $( content );

					// merge the new context on top of the old context.
					placement.context = _.extend(
						placement.context,
						newcontainerelement.data( 'customize-partial-placement-context' ) || {}
					);
					newcontainerelement.data( 'customize-partial-placement-context', placement.context );

					placement.removednodes = placement.container;
					placement.container = newcontainerelement;
					placement.removednodes.replacewith( placement.container );
					placement.container.attr( 'title', self.data.l10n.shiftclicktoedit );
				} else {
					placement.removednodes = document.createdocumentfragment();
					while ( placement.container[0].firstchild ) {
						placement.removednodes.appendchild( placement.container[0].firstchild );
					}

					placement.container.html( content );
				}

				placement.container.removeclass( 'customize-render-content-error' );
			} catch ( error ) {
				if ( 'undefined' !== typeof console && console.error ) {
					console.error( partial.id, error );
				}
				partial.fallback( error, [ placement ] );
			}
			/* jshint ignore:start */
			document.write = self.originaldocumentwrite;
			self.originaldocumentwrite = null;
			/* jshint ignore:end */

			partial.createeditshortcutforplacement( placement );
			placement.container.removeclass( 'customize-partial-refreshing' );

			// prevent placement container from being re-triggered as being rendered among nested partials.
			placement.container.data( 'customize-partial-content-rendered', true );

			/*
			 * note that the 'wp_audio_shortcode_library' and 'wp_video_shortcode_library' filters
			 * will determine whether or not wp.mediaelement is loaded and whether it will
			 * initialize audio and video respectively. see also https://core.trac.wordpress.org/ticket/40144
			 */
			if ( wp.mediaelement ) {
				wp.mediaelement.initialize();
			}

			if ( wp.playlist ) {
				wp.playlist.initialize();
			}

			/**
			 * announce when a partial's placement has been rendered so that dynamic elements can be re-built.
			 */
			self.trigger( 'partial-content-rendered', placement );
			return true;
		},

		/**
		 * handle fail to render partial.
		 *
		 * the first argument is either the failing jqxhr or an error object, and the second argument is the array of containers.
		 *
		 * @since 4.5.0
		 */
		fallback: function() {
			var partial = this;
			if ( partial.params.fallbackrefresh ) {
				self.requestfullrefresh();
			}
		}
	} );

	/**
	 * a placement for a partial.
	 *
	 * a partial placement is the actual physical representation of a partial for a given context.
	 * it also may have information in relation to how a placement may have just changed.
	 * the placement is conceptually similar to a dom range or mutationrecord.
	 *
	 * @memberof wp.customize.selectiverefresh
	 *
	 * @class placement
	 * @augments wp.customize.class
	 * @since 4.5.0
	 */
	self.placement = placement = api.class.extend(/** @lends wp.customize.selectiverefresh.prototype */{

		/**
		 * the partial with which the container is associated.
		 *
		 * @param {wp.customize.selectiverefresh.partial}
		 */
		partial: null,

		/**
		 * dom element which contains the placement's contents.
		 *
		 * this will be null if the startnode and endnode do not point to the same
		 * dom element, such as in the case of a sidebar partial.
		 * this container element itself will be replaced for partials that
		 * have containerinclusive param defined as true.
		 */
		container: null,

		/**
		 * dom node for the initial boundary of the placement.
		 *
		 * this will normally be the same as endnode since most placements appear as elements.
		 * this is primarily useful for widget sidebars which do not have intrinsic containers, but
		 * for which an html comment is output before to mark the starting position.
		 */
		startnode: null,

		/**
		 * dom node for the terminal boundary of the placement.
		 *
		 * this will normally be the same as startnode since most placements appear as elements.
		 * this is primarily useful for widget sidebars which do not have intrinsic containers, but
		 * for which an html comment is output before to mark the ending position.
		 */
		endnode: null,

		/**
		 * context data.
		 *
		 * this provides information about the placement which is included in the request
		 * in order to render the partial properly.
		 *
		 * @param {object}
		 */
		context: null,

		/**
		 * the content for the partial when refreshed.
		 *
		 * @param {string}
		 */
		addedcontent: null,

		/**
		 * dom node(s) removed when the partial is refreshed.
		 *
		 * if the partial is containerinclusive, then the removednodes will be
		 * the single element that was the partial's former placement. if the
		 * partial is not containerinclusive, then the removednodes will be a
		 * documentfragment containing the nodes removed.
		 *
		 * @param {element|documentfragment}
		 */
		removednodes: null,

		/**
		 * constructor.
		 *
		 * @since 4.5.0
		 *
		 * @param {object}                   args
		 * @param {partial}                  args.partial
		 * @param {jquery|element}           [args.container]
		 * @param {node}                     [args.startnode]
		 * @param {node}                     [args.endnode]
		 * @param {object}                   [args.context]
		 * @param {string}                   [args.addedcontent]
		 * @param {jquery|documentfragment}  [args.removednodes]
		 */
		initialize: function( args ) {
			var placement = this;

			args = _.extend( {}, args || {} );
			if ( ! args.partial || ! args.partial.extended( partial ) ) {
				throw new error( 'missing partial' );
			}
			args.context = args.context || {};
			if ( args.container ) {
				args.container = $( args.container );
			}

			_.extend( placement, args );
		}

	});

	/**
	 * mapping of type names to partial constructor subclasses.
	 *
	 * @since 4.5.0
	 *
	 * @type {object.<string, wp.customize.selectiverefresh.partial>}
	 */
	self.partialconstructor = {};

	self.partial = new api.values({ defaultconstructor: partial });

	/**
	 * get the post vars for a customizer preview request.
	 *
	 * @since 4.5.0
	 * @see wp.customize.previewer.query()
	 *
	 * @return {object}
	 */
	self.getcustomizequery = function() {
		var dirtycustomized = {};
		api.each( function( value, key ) {
			if ( value._dirty ) {
				dirtycustomized[ key ] = value();
			}
		} );

		return {
			wp_customize: 'on',
			nonce: api.settings.nonce.preview,
			customize_theme: api.settings.theme.stylesheet,
			customized: json.stringify( dirtycustomized ),
			customize_changeset_uuid: api.settings.changeset.uuid
		};
	};

	/**
	 * currently-requested partials and their associated deferreds.
	 *
	 * @since 4.5.0
	 * @type {object<string, { deferred: jquery.promise, partial: wp.customize.selectiverefresh.partial }>}
	 */
	self._pendingpartialrequests = {};

	/**
	 * timeout id for the current request, or null if no request is current.
	 *
	 * @since 4.5.0
	 * @type {number|null}
	 * @private
	 */
	self._debouncedtimeoutid = null;

	/**
	 * current jqxhr for the request to the partials.
	 *
	 * @since 4.5.0
	 * @type {jquery.jqxhr|null}
	 * @private
	 */
	self._currentrequest = null;

	/**
	 * request full page refresh.
	 *
	 * when selective refresh is embedded in the context of front-end editing, this request
	 * must fail or else changes will be lost, unless transactions are implemented.
	 *
	 * @since 4.5.0
	 */
	self.requestfullrefresh = function() {
		api.preview.send( 'refresh' );
	};

	/**
	 * request a re-rendering of a partial.
	 *
	 * @since 4.5.0
	 *
	 * @param {wp.customize.selectiverefresh.partial} partial
	 * @return {jquery.promise}
	 */
	self.requestpartial = function( partial ) {
		var partialrequest;

		if ( self._debouncedtimeoutid ) {
			cleartimeout( self._debouncedtimeoutid );
			self._debouncedtimeoutid = null;
		}
		if ( self._currentrequest ) {
			self._currentrequest.abort();
			self._currentrequest = null;
		}

		partialrequest = self._pendingpartialrequests[ partial.id ];
		if ( ! partialrequest || 'pending' !== partialrequest.deferred.state() ) {
			partialrequest = {
				deferred: $.deferred(),
				partial: partial
			};
			self._pendingpartialrequests[ partial.id ] = partialrequest;
		}

		// prevent leaking partial into debounced timeout callback.
		partial = null;

		self._debouncedtimeoutid = settimeout(
			function() {
				var data, partialplacementcontexts, partialsplacements, request;

				self._debouncedtimeoutid = null;
				data = self.getcustomizequery();

				/*
				 * it is key that the containers be fetched exactly at the point of the request being
				 * made, because the containers need to be mapped to responses by array indices.
				 */
				partialsplacements = {};

				partialplacementcontexts = {};

				_.each( self._pendingpartialrequests, function( pending, partialid ) {
					partialsplacements[ partialid ] = pending.partial.placements();
					if ( ! self.partial.has( partialid ) ) {
						pending.deferred.rejectwith( pending.partial, [ new error( 'partial_removed' ), partialsplacements[ partialid ] ] );
					} else {
						/*
						 * note that this may in fact be an empty array. in that case, it is the responsibility
						 * of the partial subclass instance to know where to inject the response, or else to
						 * just issue a refresh (default behavior). the data being returned with each container
						 * is the context information that may be needed to render certain partials, such as
						 * the contained sidebar for rendering widgets or what the nav menu args are for a menu.
						 */
						partialplacementcontexts[ partialid ] = _.map( partialsplacements[ partialid ], function( placement ) {
							return placement.context || {};
						} );
					}
				} );

				data.partials = json.stringify( partialplacementcontexts );
				data[ self.data.renderqueryvar ] = '1';

				request = self._currentrequest = wp.ajax.send( null, {
					data: data,
					url: api.settings.url.self
				} );

				request.done( function( data ) {

					/**
					 * announce the data returned from a request to render partials.
					 *
					 * the data is filtered on the server via customize_render_partials_response
					 * so plugins can inject data from the server to be utilized
					 * on the client via this event. plugins may use this filter
					 * to communicate script and style dependencies that need to get
					 * injected into the page to support the rendered partials.
					 * this is similar to the 'saved' event.
					 */
					self.trigger( 'render-partials-response', data );

					// relay errors (warnings) captured during rendering and relay to console.
					if ( data.errors && 'undefined' !== typeof console && console.warn ) {
						_.each( data.errors, function( error ) {
							console.warn( error );
						} );
					}

					/*
					 * note that data is an array of items that correspond to the array of
					 * containers that were submitted in the request. so we zip up the
					 * array of containers with the array of contents for those containers,
					 * and send them into .
					 */
					_.each( self._pendingpartialrequests, function( pending, partialid ) {
						var placementscontents;
						if ( ! _.isarray( data.contents[ partialid ] ) ) {
							pending.deferred.rejectwith( pending.partial, [ new error( 'unrecognized_partial' ), partialsplacements[ partialid ] ] );
						} else {
							placementscontents = _.map( data.contents[ partialid ], function( content, i ) {
								var partialplacement = partialsplacements[ partialid ][ i ];
								if ( partialplacement ) {
									partialplacement.addedcontent = content;
								} else {
									partialplacement = new placement( {
										partial: pending.partial,
										addedcontent: content
									} );
								}
								return partialplacement;
							} );
							pending.deferred.resolvewith( pending.partial, [ placementscontents ] );
						}
					} );
					self._pendingpartialrequests = {};
				} );

				request.fail( function( data, statustext ) {

					/*
					 * ignore failures caused by partial.currentrequest.abort()
					 * the pending deferreds will remain in self._pendingpartialrequests
					 * for re-use with the next request.
					 */
					if ( 'abort' === statustext ) {
						return;
					}

					_.each( self._pendingpartialrequests, function( pending, partialid ) {
						pending.deferred.rejectwith( pending.partial, [ data, partialsplacements[ partialid ] ] );
					} );
					self._pendingpartialrequests = {};
				} );
			},
			api.settings.timeouts.selectiverefresh
		);

		return partialrequest.deferred.promise();
	};

	/**
	 * add partials for any nav menu container elements in the document.
	 *
	 * this method may be called multiple times. containers that already have been
	 * seen will be skipped.
	 *
	 * @since 4.5.0
	 *
	 * @param {jquery|htmlelement} [rootelement]
	 * @param {object}             [options]
	 * @param {boolean=true}       [options.triggerrendered]
	 */
	self.addpartials = function( rootelement, options ) {
		var containerelements;
		if ( ! rootelement ) {
			rootelement = document.documentelement;
		}
		rootelement = $( rootelement );
		options = _.extend(
			{
				triggerrendered: true
			},
			options || {}
		);

		containerelements = rootelement.find( '[data-customize-partial-id]' );
		if ( rootelement.is( '[data-customize-partial-id]' ) ) {
			containerelements = containerelements.add( rootelement );
		}
		containerelements.each( function() {
			var containerelement = $( this ), partial, placement, id, constructor, partialoptions, containercontext;
			id = containerelement.data( 'customize-partial-id' );
			if ( ! id ) {
				return;
			}
			containercontext = containerelement.data( 'customize-partial-placement-context' ) || {};

			partial = self.partial( id );
			if ( ! partial ) {
				partialoptions = containerelement.data( 'customize-partial-options' ) || {};
				partialoptions.constructingcontainercontext = containerelement.data( 'customize-partial-placement-context' ) || {};
				constructor = self.partialconstructor[ containerelement.data( 'customize-partial-type' ) ] || self.partial;
				partial = new constructor( id, partialoptions );
				self.partial.add( partial );
			}

			/*
			 * only trigger renders on (nested) partials that have been not been
			 * handled yet. an example where this would apply is a nav menu
			 * embedded inside of a navigation menu widget. when the widget's title
			 * is updated, the entire widget will re-render and then the event
			 * will be triggered for the nested nav menu to do any initialization.
			 */
			if ( options.triggerrendered && ! containerelement.data( 'customize-partial-content-rendered' ) ) {

				placement = new placement( {
					partial: partial,
					context: containercontext,
					container: containerelement
				} );

				$( placement.container ).attr( 'title', self.data.l10n.shiftclicktoedit );
				partial.createeditshortcutforplacement( placement );

				/**
				 * announce when a partial's nested placement has been re-rendered.
				 */
				self.trigger( 'partial-content-rendered', placement );
			}
			containerelement.data( 'customize-partial-content-rendered', true );
		} );
	};

	api.bind( 'preview-ready', function() {
		var handlesettingchange, watchsettingchange, unwatchsettingchange;

		_.extend( self.data, _customizepartialrefreshexports );

		// create the partial js models.
		_.each( self.data.partials, function( data, id ) {
			var constructor, partial = self.partial( id );
			if ( ! partial ) {
				constructor = self.partialconstructor[ data.type ] || self.partial;
				partial = new constructor(
					id,
					_.extend( { params: data }, data ) // inclusion of params alias is for back-compat for custom partials that expect to augment this property.
				);
				self.partial.add( partial );
			} else {
				_.extend( partial.params, data );
			}
		} );

		/**
		 * handle change to a setting.
		 *
		 * note this is largely needed because adding a 'change' event handler to wp.customize
		 * will only include the changed setting object as an argument, not including the
		 * new value or the old value.
		 *
		 * @since 4.5.0
		 * @this {wp.customize.setting}
		 *
		 * @param {*|null} newvalue new value, or null if the setting was just removed.
		 * @param {*|null} oldvalue old value, or null if the setting was just added.
		 */
		handlesettingchange = function( newvalue, oldvalue ) {
			var setting = this;
			self.partial.each( function( partial ) {
				if ( partial.isrelatedsetting( setting, newvalue, oldvalue ) ) {
					partial.refresh();
				}
			} );
		};

		/**
		 * trigger the initial change for the added setting, and watch for changes.
		 *
		 * @since 4.5.0
		 * @this {wp.customize.values}
		 *
		 * @param {wp.customize.setting} setting
		 */
		watchsettingchange = function( setting ) {
			handlesettingchange.call( setting, setting(), null );
			setting.bind( handlesettingchange );
		};

		/**
		 * trigger the final change for the removed setting, and unwatch for changes.
		 *
		 * @since 4.5.0
		 * @this {wp.customize.values}
		 *
		 * @param {wp.customize.setting} setting
		 */
		unwatchsettingchange = function( setting ) {
			handlesettingchange.call( setting, null, setting() );
			setting.unbind( handlesettingchange );
		};

		api.bind( 'add', watchsettingchange );
		api.bind( 'remove', unwatchsettingchange );
		api.each( function( setting ) {
			setting.bind( handlesettingchange );
		} );

		// add (dynamic) initial partials that are declared via data-* attributes.
		self.addpartials( document.documentelement, {
			triggerrendered: false
		} );

		// add new dynamic partials when the document changes.
		if ( 'undefined' !== typeof mutationobserver ) {
			self.mutationobserver = new mutationobserver( function( mutations ) {
				_.each( mutations, function( mutation ) {
					self.addpartials( $( mutation.target ) );
				} );
			} );
			self.mutationobserver.observe( document.documentelement, {
				childlist: true,
				subtree: true
			} );
		}

		/**
		 * handle rendering of partials.
		 *
		 * @param {api.selectiverefresh.placement} placement
		 */
		api.selectiverefresh.bind( 'partial-content-rendered', function( placement ) {
			if ( placement.container ) {
				self.addpartials( placement.container );
			}
		} );

		/**
		 * handle setting validities in partial refresh response.
		 *
		 * @param {object} data response data.
		 * @param {object} data.setting_validities setting validities.
		 */
		api.selectiverefresh.bind( 'render-partials-response', function handlesettingvaliditiesresponse( data ) {
			if ( data.setting_validities ) {
				api.preview.send( 'selective-refresh-setting-validities', data.setting_validities );
			}
		} );

		api.preview.bind( 'edit-shortcut-visibility', function( visibility ) {
			api.selectiverefresh.editshortcutvisibility.set( visibility );
		} );
		api.selectiverefresh.editshortcutvisibility.bind( function( visibility ) {
			var body = $( document.body ), shouldanimatehide;

			shouldanimatehide = ( 'hidden' === visibility && body.hasclass( 'customize-partial-edit-shortcuts-shown' ) && ! body.hasclass( 'customize-partial-edit-shortcuts-hidden' ) );
			body.toggleclass( 'customize-partial-edit-shortcuts-hidden', shouldanimatehide );
			body.toggleclass( 'customize-partial-edit-shortcuts-shown', 'visible' === visibility );
		} );

		api.preview.bind( 'active', function() {

			// make all partials ready.
			self.partial.each( function( partial ) {
				partial.deferred.ready.resolve();
			} );

			// make all partials added henceforth as ready upon add.
			self.partial.bind( 'add', function( partial ) {
				partial.deferred.ready.resolve();
			} );
		} );

	} );

	return self;
}( jquery, wp.customize ) );




