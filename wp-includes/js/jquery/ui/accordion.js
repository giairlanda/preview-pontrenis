/*!
 * jquery ui accordion 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: accordion
//>>group: widgets
/* eslint-disable max-len */
//>>description: displays collapsible content panels for presenting information in a limited amount of space.
/* eslint-enable max-len */
//>>docs: https://api.jqueryui.com/accordion/
//>>demos: https://jqueryui.com/accordion/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/accordion.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../version",
			"../keycode",
			"../unique-id",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

return $.widget( "ui.accordion", {
	version: "1.13.3",
	options: {
		active: 0,
		animate: {},
		classes: {
			"ui-accordion-header": "ui-corner-top",
			"ui-accordion-header-collapsed": "ui-corner-all",
			"ui-accordion-content": "ui-corner-bottom"
		},
		collapsible: false,
		event: "click",
		header: function( elem ) {
			return elem.find( "> li > :first-child" ).add( elem.find( "> :not(li)" ).even() );
		},
		heightstyle: "auto",
		icons: {
			activeheader: "ui-icon-triangle-1-s",
			header: "ui-icon-triangle-1-e"
		},

		// callbacks
		activate: null,
		beforeactivate: null
	},

	hideprops: {
		bordertopwidth: "hide",
		borderbottomwidth: "hide",
		paddingtop: "hide",
		paddingbottom: "hide",
		height: "hide"
	},

	showprops: {
		bordertopwidth: "show",
		borderbottomwidth: "show",
		paddingtop: "show",
		paddingbottom: "show",
		height: "show"
	},

	_create: function() {
		var options = this.options;

		this.prevshow = this.prevhide = $();
		this._addclass( "ui-accordion", "ui-widget ui-helper-reset" );
		this.element.attr( "role", "tablist" );

		// don't allow collapsible: false and active: false / null
		if ( !options.collapsible && ( options.active === false || options.active == null ) ) {
			options.active = 0;
		}

		this._processpanels();

		// handle negative values
		if ( options.active < 0 ) {
			options.active += this.headers.length;
		}
		this._refresh();
	},

	_getcreateeventdata: function() {
		return {
			header: this.active,
			panel: !this.active.length ? $() : this.active.next()
		};
	},

	_createicons: function() {
		var icon, children,
			icons = this.options.icons;

		if ( icons ) {
			icon = $( "<span>" );
			this._addclass( icon, "ui-accordion-header-icon", "ui-icon " + icons.header );
			icon.prependto( this.headers );
			children = this.active.children( ".ui-accordion-header-icon" );
			this._removeclass( children, icons.header )
				._addclass( children, null, icons.activeheader )
				._addclass( this.headers, "ui-accordion-icons" );
		}
	},

	_destroyicons: function() {
		this._removeclass( this.headers, "ui-accordion-icons" );
		this.headers.children( ".ui-accordion-header-icon" ).remove();
	},

	_destroy: function() {
		var contents;

		// clean up main element
		this.element.removeattr( "role" );

		// clean up headers
		this.headers
			.removeattr( "role aria-expanded aria-selected aria-controls tabindex" )
			.removeuniqueid();

		this._destroyicons();

		// clean up content panels
		contents = this.headers.next()
			.css( "display", "" )
			.removeattr( "role aria-hidden aria-labelledby" )
			.removeuniqueid();

		if ( this.options.heightstyle !== "content" ) {
			contents.css( "height", "" );
		}
	},

	_setoption: function( key, value ) {
		if ( key === "active" ) {

			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		if ( key === "event" ) {
			if ( this.options.event ) {
				this._off( this.headers, this.options.event );
			}
			this._setupevents( value );
		}

		this._super( key, value );

		// setting collapsible: false while collapsed; open first panel
		if ( key === "collapsible" && !value && this.options.active === false ) {
			this._activate( 0 );
		}

		if ( key === "icons" ) {
			this._destroyicons();
			if ( value ) {
				this._createicons();
			}
		}
	},

	_setoptiondisabled: function( value ) {
		this._super( value );

		this.element.attr( "aria-disabled", value );

		// support: ie8 only
		// #5332 / #6059 - opacity doesn't cascade to positioned elements in ie
		// so we need to add the disabled class to the headers and panels
		this._toggleclass( null, "ui-state-disabled", !!value );
		this._toggleclass( this.headers.add( this.headers.next() ), null, "ui-state-disabled",
			!!value );
	},

	_keydown: function( event ) {
		if ( event.altkey || event.ctrlkey ) {
			return;
		}

		var keycode = $.ui.keycode,
			length = this.headers.length,
			currentindex = this.headers.index( event.target ),
			tofocus = false;

		switch ( event.keycode ) {
		case keycode.right:
		case keycode.down:
			tofocus = this.headers[ ( currentindex + 1 ) % length ];
			break;
		case keycode.left:
		case keycode.up:
			tofocus = this.headers[ ( currentindex - 1 + length ) % length ];
			break;
		case keycode.space:
		case keycode.enter:
			this._eventhandler( event );
			break;
		case keycode.home:
			tofocus = this.headers[ 0 ];
			break;
		case keycode.end:
			tofocus = this.headers[ length - 1 ];
			break;
		}

		if ( tofocus ) {
			$( event.target ).attr( "tabindex", -1 );
			$( tofocus ).attr( "tabindex", 0 );
			$( tofocus ).trigger( "focus" );
			event.preventdefault();
		}
	},

	_panelkeydown: function( event ) {
		if ( event.keycode === $.ui.keycode.up && event.ctrlkey ) {
			$( event.currenttarget ).prev().trigger( "focus" );
		}
	},

	refresh: function() {
		var options = this.options;
		this._processpanels();

		// was collapsed or no panel
		if ( ( options.active === false && options.collapsible === true ) ||
				!this.headers.length ) {
			options.active = false;
			this.active = $();

		// active false only when collapsible is true
		} else if ( options.active === false ) {
			this._activate( 0 );

		// was active, but active panel is gone
		} else if ( this.active.length && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {

			// all remaining panel are disabled
			if ( this.headers.length === this.headers.find( ".ui-state-disabled" ).length ) {
				options.active = false;
				this.active = $();

			// activate previous panel
			} else {
				this._activate( math.max( 0, options.active - 1 ) );
			}

		// was active, active panel still exists
		} else {

			// make sure active index is correct
			options.active = this.headers.index( this.active );
		}

		this._destroyicons();

		this._refresh();
	},

	_processpanels: function() {
		var prevheaders = this.headers,
			prevpanels = this.panels;

		if ( typeof this.options.header === "function" ) {
			this.headers = this.options.header( this.element );
		} else {
			this.headers = this.element.find( this.options.header );
		}
		this._addclass( this.headers, "ui-accordion-header ui-accordion-header-collapsed",
			"ui-state-default" );

		this.panels = this.headers.next().filter( ":not(.ui-accordion-content-active)" ).hide();
		this._addclass( this.panels, "ui-accordion-content", "ui-helper-reset ui-widget-content" );

		// avoid memory leaks (#10056)
		if ( prevpanels ) {
			this._off( prevheaders.not( this.headers ) );
			this._off( prevpanels.not( this.panels ) );
		}
	},

	_refresh: function() {
		var maxheight,
			options = this.options,
			heightstyle = options.heightstyle,
			parent = this.element.parent();

		this.active = this._findactive( options.active );
		this._addclass( this.active, "ui-accordion-header-active", "ui-state-active" )
			._removeclass( this.active, "ui-accordion-header-collapsed" );
		this._addclass( this.active.next(), "ui-accordion-content-active" );
		this.active.next().show();

		this.headers
			.attr( "role", "tab" )
			.each( function() {
				var header = $( this ),
					headerid = header.uniqueid().attr( "id" ),
					panel = header.next(),
					panelid = panel.uniqueid().attr( "id" );
				header.attr( "aria-controls", panelid );
				panel.attr( "aria-labelledby", headerid );
			} )
			.next()
				.attr( "role", "tabpanel" );

		this.headers
			.not( this.active )
				.attr( {
					"aria-selected": "false",
					"aria-expanded": "false",
					tabindex: -1
				} )
				.next()
					.attr( {
						"aria-hidden": "true"
					} )
					.hide();

		// make sure at least one header is in the tab order
		if ( !this.active.length ) {
			this.headers.eq( 0 ).attr( "tabindex", 0 );
		} else {
			this.active.attr( {
				"aria-selected": "true",
				"aria-expanded": "true",
				tabindex: 0
			} )
				.next()
					.attr( {
						"aria-hidden": "false"
					} );
		}

		this._createicons();

		this._setupevents( options.event );

		if ( heightstyle === "fill" ) {
			maxheight = parent.height();
			this.element.siblings( ":visible" ).each( function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxheight -= elem.outerheight( true );
			} );

			this.headers.each( function() {
				maxheight -= $( this ).outerheight( true );
			} );

			this.headers.next()
				.each( function() {
					$( this ).height( math.max( 0, maxheight -
						$( this ).innerheight() + $( this ).height() ) );
				} )
				.css( "overflow", "auto" );
		} else if ( heightstyle === "auto" ) {
			maxheight = 0;
			this.headers.next()
				.each( function() {
					var isvisible = $( this ).is( ":visible" );
					if ( !isvisible ) {
						$( this ).show();
					}
					maxheight = math.max( maxheight, $( this ).css( "height", "" ).height() );
					if ( !isvisible ) {
						$( this ).hide();
					}
				} )
				.height( maxheight );
		}
	},

	_activate: function( index ) {
		var active = this._findactive( index )[ 0 ];

		// trying to activate the already active panel
		if ( active === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the currently active header
		active = active || this.active[ 0 ];

		this._eventhandler( {
			target: active,
			currenttarget: active,
			preventdefault: $.noop
		} );
	},

	_findactive: function( selector ) {
		return typeof selector === "number" ? this.headers.eq( selector ) : $();
	},

	_setupevents: function( event ) {
		var events = {
			keydown: "_keydown"
		};
		if ( event ) {
			$.each( event.split( " " ), function( index, eventname ) {
				events[ eventname ] = "_eventhandler";
			} );
		}

		this._off( this.headers.add( this.headers.next() ) );
		this._on( this.headers, events );
		this._on( this.headers.next(), { keydown: "_panelkeydown" } );
		this._hoverable( this.headers );
		this._focusable( this.headers );
	},

	_eventhandler: function( event ) {
		var activechildren, clickedchildren,
			options = this.options,
			active = this.active,
			clicked = $( event.currenttarget ),
			clickedisactive = clicked[ 0 ] === active[ 0 ],
			collapsing = clickedisactive && options.collapsible,
			toshow = collapsing ? $() : clicked.next(),
			tohide = active.next(),
			eventdata = {
				oldheader: active,
				oldpanel: tohide,
				newheader: collapsing ? $() : clicked,
				newpanel: toshow
			};

		event.preventdefault();

		if (

				// click on active header, but not collapsible
				( clickedisactive && !options.collapsible ) ||

				// allow canceling activation
				( this._trigger( "beforeactivate", event, eventdata ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.headers.index( clicked );

		// when the call to ._toggle() comes after the class changes
		// it causes a very odd bug in ie 8 (see #6720)
		this.active = clickedisactive ? $() : clicked;
		this._toggle( eventdata );

		// switch classes
		// corner classes on the previously active header stay after the animation
		this._removeclass( active, "ui-accordion-header-active", "ui-state-active" );
		if ( options.icons ) {
			activechildren = active.children( ".ui-accordion-header-icon" );
			this._removeclass( activechildren, null, options.icons.activeheader )
				._addclass( activechildren, null, options.icons.header );
		}

		if ( !clickedisactive ) {
			this._removeclass( clicked, "ui-accordion-header-collapsed" )
				._addclass( clicked, "ui-accordion-header-active", "ui-state-active" );
			if ( options.icons ) {
				clickedchildren = clicked.children( ".ui-accordion-header-icon" );
				this._removeclass( clickedchildren, null, options.icons.header )
					._addclass( clickedchildren, null, options.icons.activeheader );
			}

			this._addclass( clicked.next(), "ui-accordion-content-active" );
		}
	},

	_toggle: function( data ) {
		var toshow = data.newpanel,
			tohide = this.prevshow.length ? this.prevshow : data.oldpanel;

		// handle activating a panel during the animation for another activation
		this.prevshow.add( this.prevhide ).stop( true, true );
		this.prevshow = toshow;
		this.prevhide = tohide;

		if ( this.options.animate ) {
			this._animate( toshow, tohide, data );
		} else {
			tohide.hide();
			toshow.show();
			this._togglecomplete( data );
		}

		tohide.attr( {
			"aria-hidden": "true"
		} );
		tohide.prev().attr( {
			"aria-selected": "false",
			"aria-expanded": "false"
		} );

		// if we're switching panels, remove the old header from the tab order
		// if we're opening from collapsed state, remove the previous header from the tab order
		// if we're collapsing, then keep the collapsing header in the tab order
		if ( toshow.length && tohide.length ) {
			tohide.prev().attr( {
				"tabindex": -1,
				"aria-expanded": "false"
			} );
		} else if ( toshow.length ) {
			this.headers.filter( function() {
				return parseint( $( this ).attr( "tabindex" ), 10 ) === 0;
			} )
				.attr( "tabindex", -1 );
		}

		toshow
			.attr( "aria-hidden", "false" )
			.prev()
				.attr( {
					"aria-selected": "true",
					"aria-expanded": "true",
					tabindex: 0
				} );
	},

	_animate: function( toshow, tohide, data ) {
		var total, easing, duration,
			that = this,
			adjust = 0,
			boxsizing = toshow.css( "box-sizing" ),
			down = toshow.length &&
				( !tohide.length || ( toshow.index() < tohide.index() ) ),
			animate = this.options.animate || {},
			options = down && animate.down || animate,
			complete = function() {
				that._togglecomplete( data );
			};

		if ( typeof options === "number" ) {
			duration = options;
		}
		if ( typeof options === "string" ) {
			easing = options;
		}

		// fall back from options to animation in case of partial down settings
		easing = easing || options.easing || animate.easing;
		duration = duration || options.duration || animate.duration;

		if ( !tohide.length ) {
			return toshow.animate( this.showprops, duration, easing, complete );
		}
		if ( !toshow.length ) {
			return tohide.animate( this.hideprops, duration, easing, complete );
		}

		total = toshow.show().outerheight();
		tohide.animate( this.hideprops, {
			duration: duration,
			easing: easing,
			step: function( now, fx ) {
				fx.now = math.round( now );
			}
		} );
		toshow
			.hide()
			.animate( this.showprops, {
				duration: duration,
				easing: easing,
				complete: complete,
				step: function( now, fx ) {
					fx.now = math.round( now );
					if ( fx.prop !== "height" ) {
						if ( boxsizing === "content-box" ) {
							adjust += fx.now;
						}
					} else if ( that.options.heightstyle !== "content" ) {
						fx.now = math.round( total - tohide.outerheight() - adjust );
						adjust = 0;
					}
				}
			} );
	},

	_togglecomplete: function( data ) {
		var tohide = data.oldpanel,
			prev = tohide.prev();

		this._removeclass( tohide, "ui-accordion-content-active" );
		this._removeclass( prev, "ui-accordion-header-active" )
			._addclass( prev, "ui-accordion-header-collapsed" );

		// work around for rendering bug in ie (#5421)
		if ( tohide.length ) {
			tohide.parent()[ 0 ].classname = tohide.parent()[ 0 ].classname;
		}
		this._trigger( "activate", null, data );
	}
} );

} );







