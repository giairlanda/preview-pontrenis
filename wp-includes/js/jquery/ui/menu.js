/*!
 * jquery ui menu 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: menu
//>>group: widgets
//>>description: creates nestable menus.
//>>docs: https://api.jqueryui.com/menu/
//>>demos: https://jqueryui.com/menu/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/menu.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../keycode",
			"../position",
			"../safe-active-element",
			"../unique-id",
			"../version",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

return $.widget( "ui.menu", {
	version: "1.13.3",
	defaultelement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-caret-1-e"
		},
		items: "> *",
		menus: "ul",
		position: {
			my: "left top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activemenu = this.element;

		// flag used to prevent firing of the click handler
		// as the event bubbles up through nested menus
		this.mousehandled = false;
		this.lastmouseposition = { x: null, y: null };
		this.element
			.uniqueid()
			.attr( {
				role: this.options.role,
				tabindex: 0
			} );

		this._addclass( "ui-menu", "ui-widget ui-widget-content" );
		this._on( {

			// prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on ul during navigation).
			"mousedown .ui-menu-item": function( event ) {
				event.preventdefault();

				this._activateitem( event );
			},
			"click .ui-menu-item": function( event ) {
				var target = $( event.target );
				var active = $( $.ui.safeactiveelement( this.document[ 0 ] ) );
				if ( !this.mousehandled && target.not( ".ui-state-disabled" ).length ) {
					this.select( event );

					// only set the mousehandled flag if the event will bubble, see #9469.
					if ( !event.ispropagationstopped() ) {
						this.mousehandled = true;
					}

					// open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) &&
							active.closest( ".ui-menu" ).length ) {

						// redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// if the active item is on the top level, let it stay active.
						// otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							cleartimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": "_activateitem",
			"mousemove .ui-menu-item": "_activateitem",
			mouseleave: "collapseall",
			"mouseleave .ui-menu": "collapseall",
			focus: function( event, keepactiveitem ) {

				// if there's already an active item, keep it active
				// if not, activate the first item
				var item = this.active || this._menuitems().first();

				if ( !keepactiveitem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay( function() {
					var notcontained = !$.contains(
						this.element[ 0 ],
						$.ui.safeactiveelement( this.document[ 0 ] )
					);
					if ( notcontained ) {
						this.collapseall( event );
					}
				} );
			},
			keydown: "_keydown"
		} );

		this.refresh();

		// clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( this._closeondocumentclick( event ) ) {
					this.collapseall( event, true );
				}

				// reset the mousehandled flag
				this.mousehandled = false;
			}
		} );
	},

	_activateitem: function( event ) {

		// ignore mouse events while typeahead is active, see #10458.
		// prevents focusing the wrong item when typeahead causes a scroll while the mouse
		// is over an item in the menu
		if ( this.previousfilter ) {
			return;
		}

		// if the mouse didn't actually move, but the page was scrolled, ignore the event (#9356)
		if ( event.clientx === this.lastmouseposition.x &&
				event.clienty === this.lastmouseposition.y ) {
			return;
		}

		this.lastmouseposition = {
			x: event.clientx,
			y: event.clienty
		};

		var actualtarget = $( event.target ).closest( ".ui-menu-item" ),
			target = $( event.currenttarget );

		// ignore bubbled events on parent items, see #11641
		if ( actualtarget[ 0 ] !== target[ 0 ] ) {
			return;
		}

		// if the item is already active, there's nothing to do
		if ( target.is( ".ui-state-active" ) ) {
			return;
		}

		// remove ui-state-active class from siblings of the newly focused menu item
		// to avoid a jump caused by adjacent elements both having a class with a border
		this._removeclass( target.siblings().children( ".ui-state-active" ),
			null, "ui-state-active" );
		this.focus( event, target );
	},

	_destroy: function() {
		var items = this.element.find( ".ui-menu-item" )
				.removeattr( "role aria-disabled" ),
			submenus = items.children( ".ui-menu-item-wrapper" )
				.removeuniqueid()
				.removeattr( "tabindex role aria-haspopup" );

		// destroy (sub)menus
		this.element
			.removeattr( "aria-activedescendant" )
			.find( ".ui-menu" ).addback()
				.removeattr( "role aria-labelledby aria-expanded aria-hidden aria-disabled " +
					"tabindex" )
				.removeuniqueid()
				.show();

		submenus.children().each( function() {
			var elem = $( this );
			if ( elem.data( "ui-menu-submenu-caret" ) ) {
				elem.remove();
			}
		} );
	},

	_keydown: function( event ) {
		var match, prev, character, skip,
			preventdefault = true;

		switch ( event.keycode ) {
		case $.ui.keycode.page_up:
			this.previouspage( event );
			break;
		case $.ui.keycode.page_down:
			this.nextpage( event );
			break;
		case $.ui.keycode.home:
			this._move( "first", "first", event );
			break;
		case $.ui.keycode.end:
			this._move( "last", "last", event );
			break;
		case $.ui.keycode.up:
			this.previous( event );
			break;
		case $.ui.keycode.down:
			this.next( event );
			break;
		case $.ui.keycode.left:
			this.collapse( event );
			break;
		case $.ui.keycode.right:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keycode.enter:
		case $.ui.keycode.space:
			this._activate( event );
			break;
		case $.ui.keycode.escape:
			this.collapse( event );
			break;
		default:
			preventdefault = false;
			prev = this.previousfilter || "";
			skip = false;

			// support number pad values
			character = event.keycode >= 96 && event.keycode <= 105 ?
				( event.keycode - 96 ).tostring() : string.fromcharcode( event.keycode );

			cleartimeout( this.filtertimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			match = this._filtermenuitems( character );
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextall( ".ui-menu-item" ) :
				match;

			// if no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = string.fromcharcode( event.keycode );
				match = this._filtermenuitems( character );
			}

			if ( match.length ) {
				this.focus( event, match );
				this.previousfilter = character;
				this.filtertimer = this._delay( function() {
					delete this.previousfilter;
				}, 1000 );
			} else {
				delete this.previousfilter;
			}
		}

		if ( preventdefault ) {
			event.preventdefault();
		}
	},

	_activate: function( event ) {
		if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.children( "[aria-haspopup='true']" ).length ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus, items, newsubmenus, newitems, newwrappers,
			that = this,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		this._toggleclass( "ui-menu-icons", null, !!this.element.find( ".ui-icon" ).length );

		// initialize nested menus
		newsubmenus = submenus.filter( ":not(.ui-menu)" )
			.hide()
			.attr( {
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			} )
			.each( function() {
				var menu = $( this ),
					item = menu.prev(),
					submenucaret = $( "<span>" ).data( "ui-menu-submenu-caret", true );

				that._addclass( submenucaret, "ui-menu-icon", "ui-icon " + icon );
				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenucaret );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			} );

		this._addclass( newsubmenus, "ui-menu", "ui-widget ui-widget-content ui-front" );

		menus = submenus.add( this.element );
		items = menus.find( this.options.items );

		// initialize menu-items containing spaces and/or dashes only as dividers
		items.not( ".ui-menu-item" ).each( function() {
			var item = $( this );
			if ( that._isdivider( item ) ) {
				that._addclass( item, "ui-menu-divider", "ui-widget-content" );
			}
		} );

		// don't refresh list items that are already adapted
		newitems = items.not( ".ui-menu-item, .ui-menu-divider" );
		newwrappers = newitems.children()
			.not( ".ui-menu" )
				.uniqueid()
				.attr( {
					tabindex: -1,
					role: this._itemrole()
				} );
		this._addclass( newitems, "ui-menu-item" )
			._addclass( newwrappers, "ui-menu-item-wrapper" );

		// add aria-disabled attribute to any disabled menu item
		items.filter( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// if the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemrole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	_setoption: function( key, value ) {
		if ( key === "icons" ) {
			var icons = this.element.find( ".ui-menu-icon" );
			this._removeclass( icons, null, this.options.icons.submenu )
				._addclass( icons, null, value.submenu );
		}
		this._super( key, value );
	},

	_setoptiondisabled: function( value ) {
		this._super( value );

		this.element.attr( "aria-disabled", string( value ) );
		this._toggleclass( null, "ui-state-disabled", !!value );
	},

	focus: function( event, item ) {
		var nested, focused, activeparent;
		this.blur( event, event && event.type === "focus" );

		this._scrollintoview( item );

		this.active = item.first();

		focused = this.active.children( ".ui-menu-item-wrapper" );
		this._addclass( focused, null, "ui-state-active" );

		// only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// highlight active parent menu item, if any
		activeparent = this.active
			.parent()
				.closest( ".ui-menu-item" )
					.children( ".ui-menu-item-wrapper" );
		this._addclass( activeparent, null, "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay( function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
			this._startopening( nested );
		}
		this.activemenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollintoview: function( item ) {
		var bordertop, paddingtop, offset, scroll, elementheight, itemheight;
		if ( this._hasscroll() ) {
			bordertop = parsefloat( $.css( this.activemenu[ 0 ], "bordertopwidth" ) ) || 0;
			paddingtop = parsefloat( $.css( this.activemenu[ 0 ], "paddingtop" ) ) || 0;
			offset = item.offset().top - this.activemenu.offset().top - bordertop - paddingtop;
			scroll = this.activemenu.scrolltop();
			elementheight = this.activemenu.height();
			itemheight = item.outerheight();

			if ( offset < 0 ) {
				this.activemenu.scrolltop( scroll + offset );
			} else if ( offset + itemheight > elementheight ) {
				this.activemenu.scrolltop( scroll + offset - elementheight + itemheight );
			}
		}
	},

	blur: function( event, fromfocus ) {
		if ( !fromfocus ) {
			cleartimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this._removeclass( this.active.children( ".ui-menu-item-wrapper" ),
			null, "ui-state-active" );

		this._trigger( "blur", event, { item: this.active } );
		this.active = null;
	},

	_startopening: function( submenu ) {
		cleartimeout( this.timer );

		// don't open if already open fixes a firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the caret icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay( function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend( {
			of: this.active
		}, this.options.position );

		cleartimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeattr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseall: function( event, all ) {
		cleartimeout( this.timer );
		this.timer = this._delay( function() {

			// if we were passed an event, look for the submenu that contains the event
			var currentmenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// if we found no valid submenu ancestor, use the main menu to close all
			// sub menus anyway
			if ( !currentmenu.length ) {
				currentmenu = this.element;
			}

			this._close( currentmenu );

			this.blur( event );

			// work around active item staying active after menu is blurred
			this._removeclass( currentmenu.find( ".ui-state-active" ), null, "ui-state-active" );

			this.activemenu = currentmenu;
		}, all ? 0 : this.delay );
	},

	// with no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  if passed an argument, it will search for menus below
	_close: function( startmenu ) {
		if ( !startmenu ) {
			startmenu = this.active ? this.active.parent() : this.element;
		}

		startmenu.find( ".ui-menu" )
			.hide()
			.attr( "aria-hidden", "true" )
			.attr( "aria-expanded", "false" );
	},

	_closeondocumentclick: function( event ) {
		return !$( event.target ).closest( ".ui-menu" ).length;
	},

	_isdivider: function( item ) {

		// match hyphen, em dash, en dash
		return !/[^\-\u2014\u2013\s]/.test( item.text() );
	},

	collapse: function( event ) {
		var newitem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newitem && newitem.length ) {
			this._close();
			this.focus( event, newitem );
		}
	},

	expand: function( event ) {
		var newitem = this.active && this._menuitems( this.active.children( ".ui-menu" ) ).first();

		if ( newitem && newitem.length ) {
			this._open( newitem.parent() );

			// delay so firefox will not hide activedescendant change in expanding submenu from at
			this._delay( function() {
				this.focus( event, newitem );
			} );
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isfirstitem: function() {
		return this.active && !this.active.prevall( ".ui-menu-item" ).length;
	},

	islastitem: function() {
		return this.active && !this.active.nextall( ".ui-menu-item" ).length;
	},

	_menuitems: function( menu ) {
		return ( menu || this.element )
			.find( this.options.items )
			.filter( ".ui-menu-item" );
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevall" : "nextall" ]( ".ui-menu-item" )
					.last();
			} else {
				next = this.active
					[ direction + "all" ]( ".ui-menu-item" )
					.first();
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this._menuitems( this.activemenu )[ filter ]();
		}

		this.focus( event, next );
	},

	nextpage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.islastitem() ) {
			return;
		}
		if ( this._hasscroll() ) {
			base = this.active.offset().top;
			height = this.element.innerheight();

			// jquery 3.2 doesn't include scrollbars in innerheight, add it back.
			if ( $.fn.jquery.indexof( "3.2." ) === 0 ) {
				height += this.element[ 0 ].offsetheight - this.element.outerheight();
			}

			this.active.nextall( ".ui-menu-item" ).each( function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			} );

			this.focus( event, item );
		} else {
			this.focus( event, this._menuitems( this.activemenu )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previouspage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isfirstitem() ) {
			return;
		}
		if ( this._hasscroll() ) {
			base = this.active.offset().top;
			height = this.element.innerheight();

			// jquery 3.2 doesn't include scrollbars in innerheight, add it back.
			if ( $.fn.jquery.indexof( "3.2." ) === 0 ) {
				height += this.element[ 0 ].offsetheight - this.element.outerheight();
			}

			this.active.prevall( ".ui-menu-item" ).each( function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			} );

			this.focus( event, item );
		} else {
			this.focus( event, this._menuitems( this.activemenu ).first() );
		}
	},

	_hasscroll: function() {
		return this.element.outerheight() < this.element.prop( "scrollheight" );
	},

	select: function( event ) {

		// todo: it should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseall( event, true );
		}
		this._trigger( "select", event, ui );
	},

	_filtermenuitems: function( character ) {
		var escapedcharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
			regex = new regexp( "^" + escapedcharacter, "i" );

		return this.activemenu
			.find( this.options.items )

				// only match on items, not dividers or other content (#10571)
				.filter( ".ui-menu-item" )
					.filter( function() {
						return regex.test(
							string.prototype.trim.call(
								$( this ).children( ".ui-menu-item-wrapper" ).text() ) );
					} );
	}
} );

} );





