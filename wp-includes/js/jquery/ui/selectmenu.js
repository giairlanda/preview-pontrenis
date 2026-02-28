/*!
 * jquery ui selectmenu 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: selectmenu
//>>group: widgets
/* eslint-disable max-len */
//>>description: duplicates and extends the functionality of a native html select element, allowing it to be customizable in behavior and appearance far beyond the limitations of a native select.
/* eslint-enable max-len */
//>>docs: https://api.jqueryui.com/selectmenu/
//>>demos: https://jqueryui.com/selectmenu/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/selectmenu.css, ../../themes/base/button.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./menu",
			"../form-reset-mixin",
			"../keycode",
			"../labels",
			"../position",
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

return $.widget( "ui.selectmenu", [ $.ui.formresetmixin, {
	version: "1.13.3",
	defaultelement: "<select>",
	options: {
		appendto: null,
		classes: {
			"ui-selectmenu-button-open": "ui-corner-top",
			"ui-selectmenu-button-closed": "ui-corner-all"
		},
		disabled: null,
		icons: {
			button: "ui-icon-triangle-1-s"
		},
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		width: false,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		select: null
	},

	_create: function() {
		var selectmenuid = this.element.uniqueid().attr( "id" );
		this.ids = {
			element: selectmenuid,
			button: selectmenuid + "-button",
			menu: selectmenuid + "-menu"
		};

		this._drawbutton();
		this._drawmenu();
		this._bindformresethandler();

		this._rendered = false;
		this.menuitems = $();
	},

	_drawbutton: function() {
		var icon,
			that = this,
			item = this._parseoption(
				this.element.find( "option:selected" ),
				this.element[ 0 ].selectedindex
			);

		// associate existing label with the new button
		this.labels = this.element.labels().attr( "for", this.ids.button );
		this._on( this.labels, {
			click: function( event ) {
				this.button.trigger( "focus" );
				event.preventdefault();
			}
		} );

		// hide original select element
		this.element.hide();

		// create button
		this.button = $( "<span>", {
			tabindex: this.options.disabled ? -1 : 0,
			id: this.ids.button,
			role: "combobox",
			"aria-expanded": "false",
			"aria-autocomplete": "list",
			"aria-owns": this.ids.menu,
			"aria-haspopup": "true",
			title: this.element.attr( "title" )
		} )
			.insertafter( this.element );

		this._addclass( this.button, "ui-selectmenu-button ui-selectmenu-button-closed",
			"ui-button ui-widget" );

		icon = $( "<span>" ).appendto( this.button );
		this._addclass( icon, "ui-selectmenu-icon", "ui-icon " + this.options.icons.button );
		this.buttonitem = this._renderbuttonitem( item )
			.appendto( this.button );

		if ( this.options.width !== false ) {
			this._resizebutton();
		}

		this._on( this.button, this._buttonevents );
		this.button.one( "focusin", function() {

			// delay rendering the menu items until the button receives focus.
			// the menu may have already been rendered via a programmatic open.
			if ( !that._rendered ) {
				that._refreshmenu();
			}
		} );
	},

	_drawmenu: function() {
		var that = this;

		// create menu
		this.menu = $( "<ul>", {
			"aria-hidden": "true",
			"aria-labelledby": this.ids.button,
			id: this.ids.menu
		} );

		// wrap menu
		this.menuwrap = $( "<div>" ).append( this.menu );
		this._addclass( this.menuwrap, "ui-selectmenu-menu", "ui-front" );
		this.menuwrap.appendto( this._appendto() );

		// initialize menu widget
		this.menuinstance = this.menu
			.menu( {
				classes: {
					"ui-menu": "ui-corner-bottom"
				},
				role: "listbox",
				select: function( event, ui ) {
					event.preventdefault();

					// support: ie8
					// if the item was selected via a click, the text selection
					// will be destroyed in ie
					that._setselection();

					that._select( ui.item.data( "ui-selectmenu-item" ), event );
				},
				focus: function( event, ui ) {
					var item = ui.item.data( "ui-selectmenu-item" );

					// prevent inital focus from firing and check if its a newly focused item
					if ( that.focusindex != null && item.index !== that.focusindex ) {
						that._trigger( "focus", event, { item: item } );
						if ( !that.isopen ) {
							that._select( item, event );
						}
					}
					that.focusindex = item.index;

					that.button.attr( "aria-activedescendant",
						that.menuitems.eq( item.index ).attr( "id" ) );
				}
			} )
			.menu( "instance" );

		// don't close the menu on mouseleave
		this.menuinstance._off( this.menu, "mouseleave" );

		// cancel the menu's collapseall on document click
		this.menuinstance._closeondocumentclick = function() {
			return false;
		};

		// selects often contain empty items, but never contain dividers
		this.menuinstance._isdivider = function() {
			return false;
		};
	},

	refresh: function() {
		this._refreshmenu();
		this.buttonitem.replacewith(
			this.buttonitem = this._renderbuttonitem(

				// fall back to an empty object in case there are no options
				this._getselecteditem().data( "ui-selectmenu-item" ) || {}
			)
		);
		if ( this.options.width === null ) {
			this._resizebutton();
		}
	},

	_refreshmenu: function() {
		var item,
			options = this.element.find( "option" );

		this.menu.empty();

		this._parseoptions( options );
		this._rendermenu( this.menu, this.items );

		this.menuinstance.refresh();
		this.menuitems = this.menu.find( "li" )
			.not( ".ui-selectmenu-optgroup" )
				.find( ".ui-menu-item-wrapper" );

		this._rendered = true;

		if ( !options.length ) {
			return;
		}

		item = this._getselecteditem();

		// update the menu to have the correct item focused
		this.menuinstance.focus( null, item );
		this._setaria( item.data( "ui-selectmenu-item" ) );

		// set disabled state
		this._setoption( "disabled", this.element.prop( "disabled" ) );
	},

	open: function( event ) {
		if ( this.options.disabled ) {
			return;
		}

		// if this is the first time the menu is being opened, render the items
		if ( !this._rendered ) {
			this._refreshmenu();
		} else {

			// menu clears focus on close, reset focus to selected item
			this._removeclass( this.menu.find( ".ui-state-active" ), null, "ui-state-active" );
			this.menuinstance.focus( null, this._getselecteditem() );
		}

		// if there are no options, don't open the menu
		if ( !this.menuitems.length ) {
			return;
		}

		this.isopen = true;
		this._toggleattr();
		this._resizemenu();
		this._position();

		this._on( this.document, this._documentclick );

		this._trigger( "open", event );
	},

	_position: function() {
		this.menuwrap.position( $.extend( { of: this.button }, this.options.position ) );
	},

	close: function( event ) {
		if ( !this.isopen ) {
			return;
		}

		this.isopen = false;
		this._toggleattr();

		this.range = null;
		this._off( this.document );

		this._trigger( "close", event );
	},

	widget: function() {
		return this.button;
	},

	menuwidget: function() {
		return this.menu;
	},

	_renderbuttonitem: function( item ) {
		var buttonitem = $( "<span>" );

		this._settext( buttonitem, item.label );
		this._addclass( buttonitem, "ui-selectmenu-text" );

		return buttonitem;
	},

	_rendermenu: function( ul, items ) {
		var that = this,
			currentoptgroup = "";

		$.each( items, function( index, item ) {
			var li;

			if ( item.optgroup !== currentoptgroup ) {
				li = $( "<li>", {
					text: item.optgroup
				} );
				that._addclass( li, "ui-selectmenu-optgroup", "ui-menu-divider" +
					( item.element.parent( "optgroup" ).prop( "disabled" ) ?
						" ui-state-disabled" :
						"" ) );

				li.appendto( ul );

				currentoptgroup = item.optgroup;
			}

			that._renderitemdata( ul, item );
		} );
	},

	_renderitemdata: function( ul, item ) {
		return this._renderitem( ul, item ).data( "ui-selectmenu-item", item );
	},

	_renderitem: function( ul, item ) {
		var li = $( "<li>" ),
			wrapper = $( "<div>", {
				title: item.element.attr( "title" )
			} );

		if ( item.disabled ) {
			this._addclass( li, null, "ui-state-disabled" );
		}

		if ( item.hidden ) {
			li.prop( "hidden", true );
		} else {
			this._settext( wrapper, item.label );
		}

		return li.append( wrapper ).appendto( ul );
	},

	_settext: function( element, value ) {
		if ( value ) {
			element.text( value );
		} else {
			element.html( "&#160;" );
		}
	},

	_move: function( direction, event ) {
		var item, next,
			filter = ".ui-menu-item";

		if ( this.isopen ) {
			item = this.menuitems.eq( this.focusindex ).parent( "li" );
		} else {
			item = this.menuitems.eq( this.element[ 0 ].selectedindex ).parent( "li" );
			filter += ":not(.ui-state-disabled)";
		}

		if ( direction === "first" || direction === "last" ) {
			next = item[ direction === "first" ? "prevall" : "nextall" ]( filter ).eq( -1 );
		} else {
			next = item[ direction + "all" ]( filter ).eq( 0 );
		}

		if ( next.length ) {
			this.menuinstance.focus( event, next );
		}
	},

	_getselecteditem: function() {
		return this.menuitems.eq( this.element[ 0 ].selectedindex ).parent( "li" );
	},

	_toggle: function( event ) {
		this[ this.isopen ? "close" : "open" ]( event );
	},

	_setselection: function() {
		var selection;

		if ( !this.range ) {
			return;
		}

		if ( window.getselection ) {
			selection = window.getselection();
			selection.removeallranges();
			selection.addrange( this.range );

		// support: ie8
		} else {
			this.range.select();
		}

		// support: ie
		// setting the text selection kills the button focus in ie, but
		// restoring the focus doesn't kill the selection.
		this.button.trigger( "focus" );
	},

	_documentclick: {
		mousedown: function( event ) {
			if ( !this.isopen ) {
				return;
			}

			if ( !$( event.target ).closest( ".ui-selectmenu-menu, #" +
				$.escapeselector( this.ids.button ) ).length ) {
				this.close( event );
			}
		}
	},

	_buttonevents: {

		// prevent text selection from being reset when interacting with the selectmenu (#10144)
		mousedown: function() {
			var selection;

			if ( window.getselection ) {
				selection = window.getselection();
				if ( selection.rangecount ) {
					this.range = selection.getrangeat( 0 );
				}

			// support: ie8
			} else {
				this.range = document.selection.createrange();
			}
		},

		click: function( event ) {
			this._setselection();
			this._toggle( event );
		},

		keydown: function( event ) {
			var preventdefault = true;
			switch ( event.keycode ) {
			case $.ui.keycode.tab:
			case $.ui.keycode.escape:
				this.close( event );
				preventdefault = false;
				break;
			case $.ui.keycode.enter:
				if ( this.isopen ) {
					this._selectfocuseditem( event );
				}
				break;
			case $.ui.keycode.up:
				if ( event.altkey ) {
					this._toggle( event );
				} else {
					this._move( "prev", event );
				}
				break;
			case $.ui.keycode.down:
				if ( event.altkey ) {
					this._toggle( event );
				} else {
					this._move( "next", event );
				}
				break;
			case $.ui.keycode.space:
				if ( this.isopen ) {
					this._selectfocuseditem( event );
				} else {
					this._toggle( event );
				}
				break;
			case $.ui.keycode.left:
				this._move( "prev", event );
				break;
			case $.ui.keycode.right:
				this._move( "next", event );
				break;
			case $.ui.keycode.home:
			case $.ui.keycode.page_up:
				this._move( "first", event );
				break;
			case $.ui.keycode.end:
			case $.ui.keycode.page_down:
				this._move( "last", event );
				break;
			default:
				this.menu.trigger( event );
				preventdefault = false;
			}

			if ( preventdefault ) {
				event.preventdefault();
			}
		}
	},

	_selectfocuseditem: function( event ) {
		var item = this.menuitems.eq( this.focusindex ).parent( "li" );
		if ( !item.hasclass( "ui-state-disabled" ) ) {
			this._select( item.data( "ui-selectmenu-item" ), event );
		}
	},

	_select: function( item, event ) {
		var oldindex = this.element[ 0 ].selectedindex;

		// change native select element
		this.element[ 0 ].selectedindex = item.index;
		this.buttonitem.replacewith( this.buttonitem = this._renderbuttonitem( item ) );
		this._setaria( item );
		this._trigger( "select", event, { item: item } );

		if ( item.index !== oldindex ) {
			this._trigger( "change", event, { item: item } );
		}

		this.close( event );
	},

	_setaria: function( item ) {
		var id = this.menuitems.eq( item.index ).attr( "id" );

		this.button.attr( {
			"aria-labelledby": id,
			"aria-activedescendant": id
		} );
		this.menu.attr( "aria-activedescendant", id );
	},

	_setoption: function( key, value ) {
		if ( key === "icons" ) {
			var icon = this.button.find( "span.ui-icon" );
			this._removeclass( icon, null, this.options.icons.button )
				._addclass( icon, null, value.button );
		}

		this._super( key, value );

		if ( key === "appendto" ) {
			this.menuwrap.appendto( this._appendto() );
		}

		if ( key === "width" ) {
			this._resizebutton();
		}
	},

	_setoptiondisabled: function( value ) {
		this._super( value );

		this.menuinstance.option( "disabled", value );
		this.button.attr( "aria-disabled", value );
		this._toggleclass( this.button, null, "ui-state-disabled", value );

		this.element.prop( "disabled", value );
		if ( value ) {
			this.button.attr( "tabindex", -1 );
			this.close();
		} else {
			this.button.attr( "tabindex", 0 );
		}
	},

	_appendto: function() {
		var element = this.options.appendto;

		if ( element ) {
			element = element.jquery || element.nodetype ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element || !element[ 0 ] ) {
			element = this.element.closest( ".ui-front, dialog" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_toggleattr: function() {
		this.button.attr( "aria-expanded", this.isopen );

		// we can't use two _toggleclass() calls here, because we need to make sure
		// we always remove classes first and add them second, otherwise if both classes have the
		// same theme class, it will be removed after we add it.
		this._removeclass( this.button, "ui-selectmenu-button-" +
			( this.isopen ? "closed" : "open" ) )
			._addclass( this.button, "ui-selectmenu-button-" +
				( this.isopen ? "open" : "closed" ) )
			._toggleclass( this.menuwrap, "ui-selectmenu-open", null, this.isopen );

		this.menu.attr( "aria-hidden", !this.isopen );
	},

	_resizebutton: function() {
		var width = this.options.width;

		// for `width: false`, just remove inline style and stop
		if ( width === false ) {
			this.button.css( "width", "" );
			return;
		}

		// for `width: null`, match the width of the original element
		if ( width === null ) {
			width = this.element.show().outerwidth();
			this.element.hide();
		}

		this.button.outerwidth( width );
	},

	_resizemenu: function() {
		this.menu.outerwidth( math.max(
			this.button.outerwidth(),

			// support: ie10
			// ie10 wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping
			this.menu.width( "" ).outerwidth() + 1
		) );
	},

	_getcreateoptions: function() {
		var options = this._super();

		options.disabled = this.element.prop( "disabled" );

		return options;
	},

	_parseoptions: function( options ) {
		var that = this,
			data = [];
		options.each( function( index, item ) {
			data.push( that._parseoption( $( item ), index ) );
		} );
		this.items = data;
	},

	_parseoption: function( option, index ) {
		var optgroup = option.parent( "optgroup" );

		return {
			element: option,
			index: index,
			value: option.val(),
			label: option.text(),
			hidden: optgroup.prop( "hidden" ) || option.prop( "hidden" ),
			optgroup: optgroup.attr( "label" ) || "",
			disabled: optgroup.prop( "disabled" ) || option.prop( "disabled" )
		};
	},

	_destroy: function() {
		this._unbindformresethandler();
		this.menuwrap.remove();
		this.button.remove();
		this.element.show();
		this.element.removeuniqueid();
		this.labels.attr( "for", this.ids.element );
	}
} ] );

} );







