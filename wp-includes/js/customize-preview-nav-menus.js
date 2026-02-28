/**
 * @output wp-includes/js/customize-preview-nav-menus.js
 */

/* global _wpcustomizepreviewnavmenusexports */

/** @namespace wp.customize.navmenuspreview */
wp.customize.navmenuspreview = wp.customize.menuscustomizerpreview = ( function( $, _, wp, api ) {
	'use strict';

	var self = {
		data: {
			navmenuinstanceargs: {}
		}
	};
	if ( 'undefined' !== typeof _wpcustomizepreviewnavmenusexports ) {
		_.extend( self.data, _wpcustomizepreviewnavmenusexports );
	}

	/**
	 * initialize nav menus preview.
	 */
	self.init = function() {
		var self = this, synced = false;

		/*
		 * keep track of whether we synced to determine whether or not bindsettinglistener
		 * should also initially fire the listener. this initial firing needs to wait until
		 * after all of the settings have been synced from the pane in order to prevent
		 * an infinite selective fallback-refresh. note that this sync handler will be
		 * added after the sync handler in customize-preview.js, so it will be triggered
		 * after all of the settings are added.
		 */
		api.preview.bind( 'sync', function() {
			synced = true;
		} );

		if ( api.selectiverefresh ) {
			// listen for changes to settings related to nav menus.
			api.each( function( setting ) {
				self.bindsettinglistener( setting );
			} );
			api.bind( 'add', function( setting ) {

				/*
				 * handle case where an invalid nav menu item (one for which its associated object has been deleted)
				 * is synced from the controls into the preview. since invalid nav menu items are filtered out from
				 * being exported to the frontend by the _is_valid_nav_menu_item filter in wp_get_nav_menu_items(),
				 * the customizer controls will have a nav_menu_item setting where the preview will have none, and
				 * this can trigger an infinite fallback refresh when the nav menu item lacks any valid items.
				 */
				if ( setting.get() && ! setting.get()._invalid ) {
					self.bindsettinglistener( setting, { fire: synced } );
				}
			} );
			api.bind( 'remove', function( setting ) {
				self.unbindsettinglistener( setting );
			} );

			/*
			 * ensure that wp_nav_menu() instances nested inside of other partials
			 * will be recognized as being present on the page.
			 */
			api.selectiverefresh.bind( 'render-partials-response', function( response ) {
				if ( response.nav_menu_instance_args ) {
					_.extend( self.data.navmenuinstanceargs, response.nav_menu_instance_args );
				}
			} );
		}

		api.preview.bind( 'active', function() {
			self.highlightcontrols();
		} );
	};

	if ( api.selectiverefresh ) {

		/**
		 * partial representing an invocation of wp_nav_menu().
		 *
		 * @memberof wp.customize.navmenuspreview
		 * @alias wp.customize.navmenuspreview.navmenuinstancepartial
		 *
		 * @class
		 * @augments wp.customize.selectiverefresh.partial
		 * @since 4.5.0
		 */
		self.navmenuinstancepartial = api.selectiverefresh.partial.extend(/** @lends wp.customize.navmenuspreview.navmenuinstancepartial.prototype */{

			/**
			 * constructor.
			 *
			 * @since 4.5.0
			 * @param {string} id - partial id.
			 * @param {object} options
			 * @param {object} options.params
			 * @param {object} options.params.navmenuargs
			 * @param {string} options.params.navmenuargs.args_hmac
			 * @param {string} [options.params.navmenuargs.theme_location]
			 * @param {number} [options.params.navmenuargs.menu]
			 * @param {object} [options.constructingcontainercontext]
			 */
			initialize: function( id, options ) {
				var partial = this, matches, argshmac;
				matches = id.match( /^nav_menu_instance\[([0-9a-f]{32})]$/ );
				if ( ! matches ) {
					throw new error( 'illegal id for nav_menu_instance partial. the key corresponds with the args hmac.' );
				}
				argshmac = matches[1];

				options = options || {};
				options.params = _.extend(
					{
						selector: '[data-customize-partial-id="' + id + '"]',
						navmenuargs: options.constructingcontainercontext || {},
						containerinclusive: true
					},
					options.params || {}
				);
				api.selectiverefresh.partial.prototype.initialize.call( partial, id, options );

				if ( ! _.isobject( partial.params.navmenuargs ) ) {
					throw new error( 'missing navmenuargs' );
				}
				if ( partial.params.navmenuargs.args_hmac !== argshmac ) {
					throw new error( 'args_hmac mismatch with id' );
				}
			},

			/**
			 * return whether the setting is related to this partial.
			 *
			 * @since 4.5.0
			 * @param {wp.customize.value|string} setting  - object or id.
			 * @param {number|object|false|null}  newvalue - new value, or null if the setting was just removed.
			 * @param {number|object|false|null}  oldvalue - old value, or null if the setting was just added.
			 * @return {boolean}
			 */
			isrelatedsetting: function( setting, newvalue, oldvalue ) {
				var partial = this, navmenulocationsetting, navmenuid, isnavmenuitemsetting, _newvalue, _oldvalue, urlparser;
				if ( _.isstring( setting ) ) {
					setting = api( setting );
				}

				/*
				 * prevent nav_menu_item changes only containing type_label differences triggering a refresh.
				 * these settings in the preview do not include type_label property, and so if one of these
				 * nav_menu_item settings is dirty, after a refresh the nav menu instance would do a selective
				 * refresh immediately because the setting from the pane would have the type_label whereas
				 * the setting in the preview would not, thus triggering a change event. the following
				 * condition short-circuits this unnecessary selective refresh and also prevents an infinite
				 * loop in the case where a nav_menu_instance partial had done a fallback refresh.
				 * @todo nav menu item settings should not include a type_label property to begin with.
				 */
				isnavmenuitemsetting = /^nav_menu_item\[/.test( setting.id );
				if ( isnavmenuitemsetting && _.isobject( newvalue ) && _.isobject( oldvalue ) ) {
					_newvalue = _.clone( newvalue );
					_oldvalue = _.clone( oldvalue );
					delete _newvalue.type_label;
					delete _oldvalue.type_label;

					// normalize url scheme when parent frame is https to prevent selective refresh upon initial page load.
					if ( 'https' === api.preview.scheme.get() ) {
						urlparser = document.createelement( 'a' );
						urlparser.href = _newvalue.url;
						urlparser.protocol = 'https:';
						_newvalue.url = urlparser.href;
						urlparser.href = _oldvalue.url;
						urlparser.protocol = 'https:';
						_oldvalue.url = urlparser.href;
					}

					// prevent original_title differences from causing refreshes if title is present.
					if ( newvalue.title ) {
						delete _oldvalue.original_title;
						delete _newvalue.original_title;
					}

					if ( _.isequal( _oldvalue, _newvalue ) ) {
						return false;
					}
				}

				if ( partial.params.navmenuargs.theme_location ) {
					if ( 'nav_menu_locations[' + partial.params.navmenuargs.theme_location + ']' === setting.id ) {
						return true;
					}
					navmenulocationsetting = api( 'nav_menu_locations[' + partial.params.navmenuargs.theme_location + ']' );
				}

				navmenuid = partial.params.navmenuargs.menu;
				if ( ! navmenuid && navmenulocationsetting ) {
					navmenuid = navmenulocationsetting();
				}

				if ( ! navmenuid ) {
					return false;
				}
				return (
					( 'nav_menu[' + navmenuid + ']' === setting.id ) ||
					( isnavmenuitemsetting && (
						( newvalue && newvalue.nav_menu_term_id === navmenuid ) ||
						( oldvalue && oldvalue.nav_menu_term_id === navmenuid )
					) )
				);
			},

			/**
			 * make sure that partial fallback behavior is invoked if there is no associated menu.
			 *
			 * @since 4.5.0
			 *
			 * @return {promise}
			 */
			refresh: function() {
				var partial = this, menuid, deferred = $.deferred();

				// make sure the fallback behavior is invoked when the partial is no longer associated with a menu.
				if ( _.isnumber( partial.params.navmenuargs.menu ) ) {
					menuid = partial.params.navmenuargs.menu;
				} else if ( partial.params.navmenuargs.theme_location && api.has( 'nav_menu_locations[' + partial.params.navmenuargs.theme_location + ']' ) ) {
					menuid = api( 'nav_menu_locations[' + partial.params.navmenuargs.theme_location + ']' ).get();
				}
				if ( ! menuid ) {
					partial.fallback();
					deferred.reject();
					return deferred.promise();
				}

				return api.selectiverefresh.partial.prototype.refresh.call( partial );
			},

			/**
			 * render content.
			 *
			 * @inheritdoc
			 * @param {wp.customize.selectiverefresh.placement} placement
			 */
			rendercontent: function( placement ) {
				var partial = this, previouscontainer = placement.container;

				// do fallback behavior to refresh preview if menu is now empty.
				if ( '' === placement.addedcontent ) {
					placement.partial.fallback();
				}

				if ( api.selectiverefresh.partial.prototype.rendercontent.call( partial, placement ) ) {

					// trigger deprecated event.
					$( document ).trigger( 'customize-preview-menu-refreshed', [ {
						instancenumber: null, // @deprecated
						wpnavargs: placement.context, // @deprecated
						wpnavmenuargs: placement.context,
						oldcontainer: previouscontainer,
						newcontainer: placement.container
					} ] );
				}
			}
		});

		api.selectiverefresh.partialconstructor.nav_menu_instance = self.navmenuinstancepartial;

		/**
		 * request full refresh if there are nav menu instances that lack partials which also match the supplied args.
		 *
		 * @param {object} navmenuinstanceargs
		 */
		self.handleunplacednavmenuinstances = function( navmenuinstanceargs ) {
			var unplacednavmenuinstances;
			unplacednavmenuinstances = _.filter( _.values( self.data.navmenuinstanceargs ), function( args ) {
				return ! api.selectiverefresh.partial.has( 'nav_menu_instance[' + args.args_hmac + ']' );
			} );
			if ( _.findwhere( unplacednavmenuinstances, navmenuinstanceargs ) ) {
				api.selectiverefresh.requestfullrefresh();
				return true;
			}
			return false;
		};

		/**
		 * add change listener for a nav_menu[], nav_menu_item[], or nav_menu_locations[] setting.
		 *
		 * @since 4.5.0
		 *
		 * @param {wp.customize.value} setting
		 * @param {object}             [options]
		 * @param {boolean}            options.fire whether to invoke the callback after binding.
		 *                                          this is used when a dynamic setting is added.
		 * @return {boolean} whether the setting was bound.
		 */
		self.bindsettinglistener = function( setting, options ) {
			var matches;
			options = options || {};

			matches = setting.id.match( /^nav_menu\[(-?\d+)]$/ );
			if ( matches ) {
				setting._navmenuid = parseint( matches[1], 10 );
				setting.bind( this.onchangenavmenusetting );
				if ( options.fire ) {
					this.onchangenavmenusetting.call( setting, setting(), false );
				}
				return true;
			}

			matches = setting.id.match( /^nav_menu_item\[(-?\d+)]$/ );
			if ( matches ) {
				setting._navmenuitemid = parseint( matches[1], 10 );
				setting.bind( this.onchangenavmenuitemsetting );
				if ( options.fire ) {
					this.onchangenavmenuitemsetting.call( setting, setting(), false );
				}
				return true;
			}

			matches = setting.id.match( /^nav_menu_locations\[(.+?)]/ );
			if ( matches ) {
				setting._navmenuthemelocation = matches[1];
				setting.bind( this.onchangenavmenulocationssetting );
				if ( options.fire ) {
					this.onchangenavmenulocationssetting.call( setting, setting(), false );
				}
				return true;
			}

			return false;
		};

		/**
		 * remove change listeners for nav_menu[], nav_menu_item[], or nav_menu_locations[] setting.
		 *
		 * @since 4.5.0
		 *
		 * @param {wp.customize.value} setting
		 */
		self.unbindsettinglistener = function( setting ) {
			setting.unbind( this.onchangenavmenusetting );
			setting.unbind( this.onchangenavmenuitemsetting );
			setting.unbind( this.onchangenavmenulocationssetting );
		};

		/**
		 * handle change for nav_menu[] setting for nav menu instances lacking partials.
		 *
		 * @since 4.5.0
		 *
		 * @this {wp.customize.value}
		 */
		self.onchangenavmenusetting = function() {
			var setting = this;

			self.handleunplacednavmenuinstances( {
				menu: setting._navmenuid
			} );

			// ensure all nav menu instances with a theme_location assigned to this menu are handled.
			api.each( function( othersetting ) {
				if ( ! othersetting._navmenuthemelocation ) {
					return;
				}
				if ( setting._navmenuid === othersetting() ) {
					self.handleunplacednavmenuinstances( {
						theme_location: othersetting._navmenuthemelocation
					} );
				}
			} );
		};

		/**
		 * handle change for nav_menu_item[] setting for nav menu instances lacking partials.
		 *
		 * @since 4.5.0
		 *
		 * @param {object} newitem new value for nav_menu_item[] setting.
		 * @param {object} olditem old value for nav_menu_item[] setting.
		 * @this {wp.customize.value}
		 */
		self.onchangenavmenuitemsetting = function( newitem, olditem ) {
			var item = newitem || olditem, navmenusetting;
			navmenusetting = api( 'nav_menu[' + string( item.nav_menu_term_id ) + ']' );
			if ( navmenusetting ) {
				self.onchangenavmenusetting.call( navmenusetting );
			}
		};

		/**
		 * handle change for nav_menu_locations[] setting for nav menu instances lacking partials.
		 *
		 * @since 4.5.0
		 *
		 * @this {wp.customize.value}
		 */
		self.onchangenavmenulocationssetting = function() {
			var setting = this, hasnavmenuinstance;
			self.handleunplacednavmenuinstances( {
				theme_location: setting._navmenuthemelocation
			} );

			// if there are no wp_nav_menu() instances that refer to the theme location, do full refresh.
			hasnavmenuinstance = !! _.findwhere( _.values( self.data.navmenuinstanceargs ), {
				theme_location: setting._navmenuthemelocation
			} );
			if ( ! hasnavmenuinstance ) {
				api.selectiverefresh.requestfullrefresh();
			}
		};
	}

	/**
	 * connect nav menu items with their corresponding controls in the pane.
	 *
	 * setup shift-click on nav menu items which are more granular than the nav menu partial itself.
	 * also this applies even if a nav menu is not partial-refreshable.
	 *
	 * @since 4.5.0
	 */
	self.highlightcontrols = function() {
		var selector = '.menu-item';

		// skip adding highlights if not in the customizer preview iframe.
		if ( ! api.settings.channel ) {
			return;
		}

		// focus on the menu item control when shift+clicking the menu item.
		$( document ).on( 'click', selector, function( e ) {
			var navmenuitemparts;
			if ( ! e.shiftkey ) {
				return;
			}

			navmenuitemparts = $( this ).attr( 'class' ).match( /(?:^|\s)menu-item-(-?\d+)(?:\s|$)/ );
			if ( navmenuitemparts ) {
				e.preventdefault();
				e.stoppropagation(); // make sure a sub-nav menu item will get focused instead of parent items.
				api.preview.send( 'focus-nav-menu-item-control', parseint( navmenuitemparts[1], 10 ) );
			}
		});
	};

	api.bind( 'preview-ready', function() {
		self.init();
	} );

	return self;

}( jquery, _, wp, wp.customize ) );


