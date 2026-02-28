/**
 * @output wp-includes/js/customize-preview-widgets.js
 */

/* global _wpwidgetcustomizerpreviewsettings */

/**
 * handles the initialization, refreshing and rendering of widget partials and sidebar widgets.
 *
 * @since 4.5.0
 *
 * @namespace wp.customize.widgetspreview
 *
 * @param {jquery} $   the jquery object.
 * @param {object} _   the utilities library.
 * @param {object} wp  current wordpress environment instance.
 * @param {object} api information from the api.
 *
 * @return {object} widget-related variables.
 */
wp.customize.widgetspreview = wp.customize.widgetcustomizerpreview = (function( $, _, wp, api ) {

	var self;

	self = {
		renderedsidebars: {},
		renderedwidgets: {},
		registeredsidebars: [],
		registeredwidgets: {},
		widgetselectors: [],
		preview: null,
		l10n: {
			widgettooltip: ''
		},
		selectiverefreshablewidgets: {}
	};

	/**
	 * initializes the widgets preview.
	 *
	 * @since 4.5.0
	 *
	 * @memberof wp.customize.widgetspreview
	 *
	 * @return {void}
	 */
	self.init = function() {
		var self = this;

		self.preview = api.preview;
		if ( ! _.isempty( self.selectiverefreshablewidgets ) ) {
			self.addpartials();
		}

		self.buildwidgetselectors();
		self.highlightcontrols();

		self.preview.bind( 'highlight-widget', self.highlightwidget );

		api.preview.bind( 'active', function() {
			self.highlightcontrols();
		} );

		/*
		 * refresh a partial when the controls pane requests it. this is used currently just by the
		 * gallery widget so that when an attachment's caption is updated in the media modal,
		 * the widget in the preview will then be refreshed to show the change. normally doing this
		 * would not be necessary because all of the state should be contained inside the changeset,
		 * as everything done in the customizer should not make a change to the site unless the
		 * changeset itself is published. attachments are a current exception to this rule.
		 * for a proposal to include attachments in the customized state, see #37887.
		 */
		api.preview.bind( 'refresh-widget-partial', function( widgetid ) {
			var partialid = 'widget[' + widgetid + ']';
			if ( api.selectiverefresh.partial.has( partialid ) ) {
				api.selectiverefresh.partial( partialid ).refresh();
			} else if ( self.renderedwidgets[ widgetid ] ) {
				api.preview.send( 'refresh' ); // fallback in case theme does not support 'customize-selective-refresh-widgets'.
			}
		} );
	};

	self.widgetpartial = api.selectiverefresh.partial.extend(/** @lends wp.customize.widgetspreview.widgetpartial.prototype */{

		/**
		 * represents a partial widget instance.
		 *
		 * @since 4.5.0
		 *
		 * @constructs
		 * @augments wp.customize.selectiverefresh.partial
		 *
		 * @alias wp.customize.widgetspreview.widgetpartial
		 * @memberof wp.customize.widgetspreview
		 *
		 * @param {string} id             the partial's id.
		 * @param {object} options        options used to initialize the partial's
		 *                                instance.
		 * @param {object} options.params the options parameters.
		 */
		initialize: function( id, options ) {
			var partial = this, matches;
			matches = id.match( /^widget\[(.+)]$/ );
			if ( ! matches ) {
				throw new error( 'illegal id for widget partial.' );
			}

			partial.widgetid = matches[1];
			partial.widgetidparts = self.parsewidgetid( partial.widgetid );
			options = options || {};
			options.params = _.extend(
				{
					settings: [ self.getwidgetsettingid( partial.widgetid ) ],
					containerinclusive: true
				},
				options.params || {}
			);

			api.selectiverefresh.partial.prototype.initialize.call( partial, id, options );
		},

		/**
		 * refreshes the widget partial.
		 *
		 * @since 4.5.0
		 *
		 * @return {promise|void} either a promise postponing the refresh, or void.
		 */
		refresh: function() {
			var partial = this, refreshdeferred;
			if ( ! self.selectiverefreshablewidgets[ partial.widgetidparts.idbase ] ) {
				refreshdeferred = $.deferred();
				refreshdeferred.reject();
				partial.fallback();
				return refreshdeferred.promise();
			} else {
				return api.selectiverefresh.partial.prototype.refresh.call( partial );
			}
		},

		/**
		 * sends the widget-updated message to the parent so the spinner will get
		 * removed from the widget control.
		 *
		 * @inheritdoc
		 * @param {wp.customize.selectiverefresh.placement} placement the placement
		 *                                                            function.
		 *
		 * @return {void}
		 */
		rendercontent: function( placement ) {
			var partial = this;
			if ( api.selectiverefresh.partial.prototype.rendercontent.call( partial, placement ) ) {
				api.preview.send( 'widget-updated', partial.widgetid );
				api.selectiverefresh.trigger( 'widget-updated', partial );
			}
		}
	});

	self.sidebarpartial = api.selectiverefresh.partial.extend(/** @lends wp.customize.widgetspreview.sidebarpartial.prototype */{

		/**
		 * represents a partial widget area.
		 *
		 * @since 4.5.0
		 *
		 * @class
		 * @augments wp.customize.selectiverefresh.partial
		 *
		 * @memberof wp.customize.widgetspreview
		 * @alias wp.customize.widgetspreview.sidebarpartial
		 *
		 * @param {string} id             the partial's id.
		 * @param {object} options        options used to initialize the partial's instance.
		 * @param {object} options.params the options parameters.
		 */
		initialize: function( id, options ) {
			var partial = this, matches;
			matches = id.match( /^sidebar\[(.+)]$/ );
			if ( ! matches ) {
				throw new error( 'illegal id for sidebar partial.' );
			}
			partial.sidebarid = matches[1];

			options = options || {};
			options.params = _.extend(
				{
					settings: [ 'sidebars_widgets[' + partial.sidebarid + ']' ]
				},
				options.params || {}
			);

			api.selectiverefresh.partial.prototype.initialize.call( partial, id, options );

			if ( ! partial.params.sidebarargs ) {
				throw new error( 'the sidebarargs param was not provided.' );
			}
			if ( partial.params.settings.length > 1 ) {
				throw new error( 'expected sidebarpartial to only have one associated setting' );
			}
		},

		/**
		 * sets up the partial.
		 *
		 * @since 4.5.0
		 *
		 * @return {void}
		 */
		ready: function() {
			var sidebarpartial = this;

			// watch for changes to the sidebar_widgets setting.
			_.each( sidebarpartial.settings(), function( settingid ) {
				api( settingid ).bind( _.bind( sidebarpartial.handlesettingchange, sidebarpartial ) );
			} );

			// trigger an event for this sidebar being updated whenever a widget inside is rendered.
			api.selectiverefresh.bind( 'partial-content-rendered', function( placement ) {
				var isassignedwidgetpartial = (
					placement.partial.extended( self.widgetpartial ) &&
					( -1 !== _.indexof( sidebarpartial.getwidgetids(), placement.partial.widgetid ) )
				);
				if ( isassignedwidgetpartial ) {
					api.selectiverefresh.trigger( 'sidebar-updated', sidebarpartial );
				}
			} );

			// make sure that a widget partial has a container in the dom prior to a refresh.
			api.bind( 'change', function( widgetsetting ) {
				var widgetid, parsedid;
				parsedid = self.parsewidgetsettingid( widgetsetting.id );
				if ( ! parsedid ) {
					return;
				}
				widgetid = parsedid.idbase;
				if ( parsedid.number ) {
					widgetid += '-' + string( parsedid.number );
				}
				if ( -1 !== _.indexof( sidebarpartial.getwidgetids(), widgetid ) ) {
					sidebarpartial.ensurewidgetplacementcontainers( widgetid );
				}
			} );
		},

		/**
		 * gets the before/after boundary nodes for all instances of this sidebar
		 * (usually one).
		 *
		 * note that treewalker is not implemented in ie8.
		 *
		 * @since 4.5.0
		 *
		 * @return {array.<{before: comment, after: comment, instancenumber: number}>}
		 *         an array with an object for each sidebar instance, containing the
		 *         node before and after the sidebar instance and its instance number.
		 */
		finddynamicsidebarboundarynodes: function() {
			var partial = this, regexp, boundarynodes = {}, recursivecommenttraversal;
			regexp = /^(dynamic_sidebar_before|dynamic_sidebar_after):(.+):(\d+)$/;
			recursivecommenttraversal = function( childnodes ) {
				_.each( childnodes, function( node ) {
					var matches;
					if ( 8 === node.nodetype ) {
						matches = node.nodevalue.match( regexp );
						if ( ! matches || matches[2] !== partial.sidebarid ) {
							return;
						}
						if ( _.isundefined( boundarynodes[ matches[3] ] ) ) {
							boundarynodes[ matches[3] ] = {
								before: null,
								after: null,
								instancenumber: parseint( matches[3], 10 )
							};
						}
						if ( 'dynamic_sidebar_before' === matches[1] ) {
							boundarynodes[ matches[3] ].before = node;
						} else {
							boundarynodes[ matches[3] ].after = node;
						}
					} else if ( 1 === node.nodetype ) {
						recursivecommenttraversal( node.childnodes );
					}
				} );
			};

			recursivecommenttraversal( document.body.childnodes );
			return _.values( boundarynodes );
		},

		/**
		 * gets the placements for this partial.
		 *
		 * @since 4.5.0
		 *
		 * @return {array} an array containing placement objects for each of the
		 *                 dynamic sidebar boundary nodes.
		 */
		placements: function() {
			var partial = this;
			return _.map( partial.finddynamicsidebarboundarynodes(), function( boundarynodes ) {
				return new api.selectiverefresh.placement( {
					partial: partial,
					container: null,
					startnode: boundarynodes.before,
					endnode: boundarynodes.after,
					context: {
						instancenumber: boundarynodes.instancenumber
					}
				} );
			} );
		},

		/**
		 * get the list of widget ids associated with this widget area.
		 *
		 * @since 4.5.0
		 *
		 * @throws {error} if there's no settingid.
		 * @throws {error} if the setting doesn't exist in the api.
		 * @throws {error} if the api doesn't pass an array of widget ids.
		 *
		 * @return {array} a shallow copy of the array containing widget ids.
		 */
		getwidgetids: function() {
			var sidebarpartial = this, settingid, widgetids;
			settingid = sidebarpartial.settings()[0];
			if ( ! settingid ) {
				throw new error( 'missing associated setting.' );
			}
			if ( ! api.has( settingid ) ) {
				throw new error( 'setting does not exist.' );
			}
			widgetids = api( settingid ).get();
			if ( ! _.isarray( widgetids ) ) {
				throw new error( 'expected setting to be array of widget ids' );
			}
			return widgetids.slice( 0 );
		},

		/**
		 * reflows widgets in the sidebar, ensuring they have the proper position in the
		 * dom.
		 *
		 * @since 4.5.0
		 *
		 * @return {array.<wp.customize.selectiverefresh.placement>} list of placements
		 *                                                           that were reflowed.
		 */
		reflowwidgets: function() {
			var sidebarpartial = this, sidebarplacements, widgetids, widgetpartials, sortedsidebarcontainers = [];
			widgetids = sidebarpartial.getwidgetids();
			sidebarplacements = sidebarpartial.placements();

			widgetpartials = {};
			_.each( widgetids, function( widgetid ) {
				var widgetpartial = api.selectiverefresh.partial( 'widget[' + widgetid + ']' );
				if ( widgetpartial ) {
					widgetpartials[ widgetid ] = widgetpartial;
				}
			} );

			_.each( sidebarplacements, function( sidebarplacement ) {
				var sidebarwidgets = [], needssort = false, thisposition, lastposition = -1;

				// gather list of widget partial containers in this sidebar, and determine if a sort is needed.
				_.each( widgetpartials, function( widgetpartial ) {
					_.each( widgetpartial.placements(), function( widgetplacement ) {

						if ( sidebarplacement.context.instancenumber === widgetplacement.context.sidebar_instance_number ) {
							thisposition = widgetplacement.container.index();
							sidebarwidgets.push( {
								partial: widgetpartial,
								placement: widgetplacement,
								position: thisposition
							} );
							if ( thisposition < lastposition ) {
								needssort = true;
							}
							lastposition = thisposition;
						}
					} );
				} );

				if ( needssort ) {
					_.each( sidebarwidgets, function( sidebarwidget ) {
						sidebarplacement.endnode.parentnode.insertbefore(
							sidebarwidget.placement.container[0],
							sidebarplacement.endnode
						);

						// @todo rename partial-placement-moved?
						api.selectiverefresh.trigger( 'partial-content-moved', sidebarwidget.placement );
					} );

					sortedsidebarcontainers.push( sidebarplacement );
				}
			} );

			if ( sortedsidebarcontainers.length > 0 ) {
				api.selectiverefresh.trigger( 'sidebar-updated', sidebarpartial );
			}

			return sortedsidebarcontainers;
		},

		/**
		 * makes sure there is a widget instance container in this sidebar for the given
		 * widget id.
		 *
		 * @since 4.5.0
		 *
		 * @param {string} widgetid the widget id.
		 *
		 * @return {wp.customize.selectiverefresh.partial} the widget instance partial.
		 */
		ensurewidgetplacementcontainers: function( widgetid ) {
			var sidebarpartial = this, widgetpartial, wasinserted = false, partialid = 'widget[' + widgetid + ']';
			widgetpartial = api.selectiverefresh.partial( partialid );
			if ( ! widgetpartial ) {
				widgetpartial = new self.widgetpartial( partialid, {
					params: {}
				} );
			}

			// make sure that there is a container element for the widget in the sidebar, if at least a placeholder.
			_.each( sidebarpartial.placements(), function( sidebarplacement ) {
				var foundwidgetplacement, widgetcontainerelement;

				foundwidgetplacement = _.find( widgetpartial.placements(), function( widgetplacement ) {
					return ( widgetplacement.context.sidebar_instance_number === sidebarplacement.context.instancenumber );
				} );
				if ( foundwidgetplacement ) {
					return;
				}

				widgetcontainerelement = $(
					sidebarpartial.params.sidebarargs.before_widget.replace( /%1\$s/g, widgetid ).replace( /%2\$s/g, 'widget' ) +
					sidebarpartial.params.sidebarargs.after_widget
				);

				// handle rare case where before_widget and after_widget are empty.
				if ( ! widgetcontainerelement[0] ) {
					return;
				}

				widgetcontainerelement.attr( 'data-customize-partial-id', widgetpartial.id );
				widgetcontainerelement.attr( 'data-customize-partial-type', 'widget' );
				widgetcontainerelement.attr( 'data-customize-widget-id', widgetid );

				/*
				 * make sure the widget container element has the customize-container context data.
				 * the sidebar_instance_number is used to disambiguate multiple instances of the
				 * same sidebar are rendered onto the template, and so the same widget is embedded
				 * multiple times.
				 */
				widgetcontainerelement.data( 'customize-partial-placement-context', {
					'sidebar_id': sidebarpartial.sidebarid,
					'sidebar_instance_number': sidebarplacement.context.instancenumber
				} );

				sidebarplacement.endnode.parentnode.insertbefore( widgetcontainerelement[0], sidebarplacement.endnode );
				wasinserted = true;
			} );

			api.selectiverefresh.partial.add( widgetpartial );

			if ( wasinserted ) {
				sidebarpartial.reflowwidgets();
			}

			return widgetpartial;
		},

		/**
		 * handles changes to the sidebars_widgets[] setting.
		 *
		 * @since 4.5.0
		 *
		 * @param {array} newwidgetids new widget ids.
		 * @param {array} oldwidgetids old widget ids.
		 *
		 * @return {void}
		 */
		handlesettingchange: function( newwidgetids, oldwidgetids ) {
			var sidebarpartial = this, needsrefresh, widgetsremoved, widgetsadded, addedwidgetpartials = [];

			needsrefresh = (
				( oldwidgetids.length > 0 && 0 === newwidgetids.length ) ||
				( newwidgetids.length > 0 && 0 === oldwidgetids.length )
			);
			if ( needsrefresh ) {
				sidebarpartial.fallback();
				return;
			}

			// handle removal of widgets.
			widgetsremoved = _.difference( oldwidgetids, newwidgetids );
			_.each( widgetsremoved, function( removedwidgetid ) {
				var widgetpartial = api.selectiverefresh.partial( 'widget[' + removedwidgetid + ']' );
				if ( widgetpartial ) {
					_.each( widgetpartial.placements(), function( placement ) {
						var isremoved = (
							placement.context.sidebar_id === sidebarpartial.sidebarid ||
							( placement.context.sidebar_args && placement.context.sidebar_args.id === sidebarpartial.sidebarid )
						);
						if ( isremoved ) {
							placement.container.remove();
						}
					} );
				}
				delete self.renderedwidgets[ removedwidgetid ];
			} );

			// handle insertion of widgets.
			widgetsadded = _.difference( newwidgetids, oldwidgetids );
			_.each( widgetsadded, function( addedwidgetid ) {
				var widgetpartial = sidebarpartial.ensurewidgetplacementcontainers( addedwidgetid );
				addedwidgetpartials.push( widgetpartial );
				self.renderedwidgets[ addedwidgetid ] = true;
			} );

			_.each( addedwidgetpartials, function( widgetpartial ) {
				widgetpartial.refresh();
			} );

			api.selectiverefresh.trigger( 'sidebar-updated', sidebarpartial );
		},

		/**
		 * refreshes the sidebar partial.
		 *
		 * note that the meat is handled in handlesettingchange because it has the
		 * context of which widgets were removed.
		 *
		 * @since 4.5.0
		 *
		 * @return {promise} a promise postponing the refresh.
		 */
		refresh: function() {
			var partial = this, deferred = $.deferred();

			deferred.fail( function() {
				partial.fallback();
			} );

			if ( 0 === partial.placements().length ) {
				deferred.reject();
			} else {
				_.each( partial.reflowwidgets(), function( sidebarplacement ) {
					api.selectiverefresh.trigger( 'partial-content-rendered', sidebarplacement );
				} );
				deferred.resolve();
			}

			return deferred.promise();
		}
	});

	api.selectiverefresh.partialconstructor.sidebar = self.sidebarpartial;
	api.selectiverefresh.partialconstructor.widget = self.widgetpartial;

	/**
	 * adds partials for the registered widget areas (sidebars).
	 *
	 * @since 4.5.0
	 *
	 * @return {void}
	 */
	self.addpartials = function() {
		_.each( self.registeredsidebars, function( registeredsidebar ) {
			var partial, partialid = 'sidebar[' + registeredsidebar.id + ']';
			partial = api.selectiverefresh.partial( partialid );
			if ( ! partial ) {
				partial = new self.sidebarpartial( partialid, {
					params: {
						sidebarargs: registeredsidebar
					}
				} );
				api.selectiverefresh.partial.add( partial );
			}
		} );
	};

	/**
	 * calculates the selector for the sidebar's widgets based on the registered
	 * sidebar's info.
	 *
	 * @memberof wp.customize.widgetspreview
	 *
	 * @since 3.9.0
	 *
	 * @return {void}
	 */
	self.buildwidgetselectors = function() {
		var self = this;

		$.each( self.registeredsidebars, function( i, sidebar ) {
			var widgettpl = [
					sidebar.before_widget,
					sidebar.before_title,
					sidebar.after_title,
					sidebar.after_widget
				].join( '' ),
				emptywidget,
				widgetselector,
				widgetclasses;

			emptywidget = $( widgettpl );
			widgetselector = emptywidget.prop( 'tagname' ) || '';
			widgetclasses = emptywidget.prop( 'classname' ) || '';

			// prevent a rare case when before_widget, before_title, after_title and after_widget is empty.
			if ( ! widgetclasses ) {
				return;
			}

			// remove class names that incorporate the string formatting placeholders %1$s and %2$s.
			widgetclasses = widgetclasses.replace( /\s*%[12]\$s\s*/g, '' );
			widgetclasses = widgetclasses.replace( /^\s+|\s+$/g, '' );
			if ( widgetclasses ) {
				widgetselector += '.' + widgetclasses.split( /\s+/ ).join( '.' );
			}
			self.widgetselectors.push( widgetselector );
		});
	};

	/**
	 * highlights the widget on widget updates or widget control mouse overs.
	 *
	 * @memberof wp.customize.widgetspreview
	 *
	 * @since 3.9.0
	 * @param {string} widgetid id of the widget.
	 *
	 * @return {void}
	 */
	self.highlightwidget = function( widgetid ) {
		var $body = $( document.body ),
			$widget = $( '#' + widgetid );

		$body.find( '.widget-customizer-highlighted-widget' ).removeclass( 'widget-customizer-highlighted-widget' );

		$widget.addclass( 'widget-customizer-highlighted-widget' );
		settimeout( function() {
			$widget.removeclass( 'widget-customizer-highlighted-widget' );
		}, 500 );
	};

	/**
	 * shows a title and highlights widgets on hover. on shift+clicking focuses the
	 * widget control.
	 *
	 * @memberof wp.customize.widgetspreview
	 *
	 * @since 3.9.0
	 *
	 * @return {void}
	 */
	self.highlightcontrols = function() {
		var self = this,
			selector = this.widgetselectors.join( ',' );

		// skip adding highlights if not in the customizer preview iframe.
		if ( ! api.settings.channel ) {
			return;
		}

		$( selector ).attr( 'title', this.l10n.widgettooltip );
		// highlights widget when entering the widget editor.
		$( document ).on( 'mouseenter', selector, function() {
			self.preview.send( 'highlight-widget-control', $( this ).prop( 'id' ) );
		});

		// open expand the widget control when shift+clicking the widget element.
		$( document ).on( 'click', selector, function( e ) {
			if ( ! e.shiftkey ) {
				return;
			}
			e.preventdefault();

			self.preview.send( 'focus-widget-control', $( this ).prop( 'id' ) );
		});
	};

	/**
	 * parses a widget id.
	 *
	 * @memberof wp.customize.widgetspreview
	 *
	 * @since 4.5.0
	 *
	 * @param {string} widgetid the widget id.
	 *
	 * @return {{idbase: string, number: number|null}} an object containing the idbase
	 *                                                 and number of the parsed widget id.
	 */
	self.parsewidgetid = function( widgetid ) {
		var matches, parsed = {
			idbase: '',
			number: null
		};

		matches = widgetid.match( /^(.+)-(\d+)$/ );
		if ( matches ) {
			parsed.idbase = matches[1];
			parsed.number = parseint( matches[2], 10 );
		} else {
			parsed.idbase = widgetid; // likely an old single widget.
		}

		return parsed;
	};

	/**
	 * parses a widget setting id.
	 *
	 * @memberof wp.customize.widgetspreview
	 *
	 * @since 4.5.0
	 *
	 * @param {string} settingid widget setting id.
	 *
	 * @return {{idbase: string, number: number|null}|null} either an object containing the idbase
	 *                                                      and number of the parsed widget setting id,
	 *                                                      or null.
	 */
	self.parsewidgetsettingid = function( settingid ) {
		var matches, parsed = {
			idbase: '',
			number: null
		};

		matches = settingid.match( /^widget_([^\[]+?)(?:\[(\d+)])?$/ );
		if ( ! matches ) {
			return null;
		}
		parsed.idbase = matches[1];
		if ( matches[2] ) {
			parsed.number = parseint( matches[2], 10 );
		}
		return parsed;
	};

	/**
	 * converts a widget id into a customizer setting id.
	 *
	 * @memberof wp.customize.widgetspreview
	 *
	 * @since 4.5.0
	 *
	 * @param {string} widgetid the widget id.
	 *
	 * @return {string} the setting id.
	 */
	self.getwidgetsettingid = function( widgetid ) {
		var parsed = this.parsewidgetid( widgetid ), settingid;

		settingid = 'widget_' + parsed.idbase;
		if ( parsed.number ) {
			settingid += '[' + string( parsed.number ) + ']';
		}

		return settingid;
	};

	api.bind( 'preview-ready', function() {
		$.extend( self, _wpwidgetcustomizerpreviewsettings );
		self.init();
	});

	return self;
})( jquery, _, wp, wp.customize );





