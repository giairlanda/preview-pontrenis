/*!
 * jquery ui tabs 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: tabs
//>>group: widgets
//>>description: transforms a set of container elements into a tab structure.
//>>docs: https://api.jqueryui.com/tabs/
//>>demos: https://jqueryui.com/tabs/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/tabs.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../keycode",
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

$.widget( "ui.tabs", {
	version: "1.13.3",
	delay: 300,
	options: {
		active: null,
		classes: {
			"ui-tabs": "ui-corner-all",
			"ui-tabs-nav": "ui-corner-all",
			"ui-tabs-panel": "ui-corner-bottom",
			"ui-tabs-tab": "ui-corner-top"
		},
		collapsible: false,
		event: "click",
		heightstyle: "content",
		hide: null,
		show: null,

		// callbacks
		activate: null,
		beforeactivate: null,
		beforeload: null,
		load: null
	},

	_islocal: ( function() {
		var rhash = /#.*$/;

		return function( anchor ) {
			var anchorurl, locationurl;

			anchorurl = anchor.href.replace( rhash, "" );
			locationurl = location.href.replace( rhash, "" );

			// decoding may throw an error if the url isn't utf-8 (#9518)
			try {
				anchorurl = decodeuricomponent( anchorurl );
			} catch ( error ) {}
			try {
				locationurl = decodeuricomponent( locationurl );
			} catch ( error ) {}

			return anchor.hash.length > 1 && anchorurl === locationurl;
		};
	} )(),

	_create: function() {
		var that = this,
			options = this.options;

		this.running = false;

		this._addclass( "ui-tabs", "ui-widget ui-widget-content" );
		this._toggleclass( "ui-tabs-collapsible", null, options.collapsible );

		this._processtabs();
		options.active = this._initialactive();

		// take disabling tabs via class attribute from html
		// into account and update option properly.
		if ( array.isarray( options.disabled ) ) {
			options.disabled = $.uniquesort( options.disabled.concat(
				$.map( this.tabs.filter( ".ui-state-disabled" ), function( li ) {
					return that.tabs.index( li );
				} )
			) ).sort();
		}

		// check for length avoids error when initializing empty list
		if ( this.options.active !== false && this.anchors.length ) {
			this.active = this._findactive( options.active );
		} else {
			this.active = $();
		}

		this._refresh();

		if ( this.active.length ) {
			this.load( options.active );
		}
	},

	_initialactive: function() {
		var active = this.options.active,
			collapsible = this.options.collapsible,
			locationhash = location.hash.substring( 1 );

		if ( active === null ) {

			// check the fragment identifier in the url
			if ( locationhash ) {
				this.tabs.each( function( i, tab ) {
					if ( $( tab ).attr( "aria-controls" ) === locationhash ) {
						active = i;
						return false;
					}
				} );
			}

			// check for a tab marked active via a class
			if ( active === null ) {
				active = this.tabs.index( this.tabs.filter( ".ui-tabs-active" ) );
			}

			// no active tab, set to false
			if ( active === null || active === -1 ) {
				active = this.tabs.length ? 0 : false;
			}
		}

		// handle numbers: negative, out of range
		if ( active !== false ) {
			active = this.tabs.index( this.tabs.eq( active ) );
			if ( active === -1 ) {
				active = collapsible ? false : 0;
			}
		}

		// don't allow collapsible: false and active: false
		if ( !collapsible && active === false && this.anchors.length ) {
			active = 0;
		}

		return active;
	},

	_getcreateeventdata: function() {
		return {
			tab: this.active,
			panel: !this.active.length ? $() : this._getpanelfortab( this.active )
		};
	},

	_tabkeydown: function( event ) {
		var focusedtab = $( $.ui.safeactiveelement( this.document[ 0 ] ) ).closest( "li" ),
			selectedindex = this.tabs.index( focusedtab ),
			goingforward = true;

		if ( this._handlepagenav( event ) ) {
			return;
		}

		switch ( event.keycode ) {
		case $.ui.keycode.right:
		case $.ui.keycode.down:
			selectedindex++;
			break;
		case $.ui.keycode.up:
		case $.ui.keycode.left:
			goingforward = false;
			selectedindex--;
			break;
		case $.ui.keycode.end:
			selectedindex = this.anchors.length - 1;
			break;
		case $.ui.keycode.home:
			selectedindex = 0;
			break;
		case $.ui.keycode.space:

			// activate only, no collapsing
			event.preventdefault();
			cleartimeout( this.activating );
			this._activate( selectedindex );
			return;
		case $.ui.keycode.enter:

			// toggle (cancel delayed activation, allow collapsing)
			event.preventdefault();
			cleartimeout( this.activating );

			// determine if we should collapse or activate
			this._activate( selectedindex === this.options.active ? false : selectedindex );
			return;
		default:
			return;
		}

		// focus the appropriate tab, based on which key was pressed
		event.preventdefault();
		cleartimeout( this.activating );
		selectedindex = this._focusnexttab( selectedindex, goingforward );

		// navigating with control/command key will prevent automatic activation
		if ( !event.ctrlkey && !event.metakey ) {

			// update aria-selected immediately so that at think the tab is already selected.
			// otherwise at may confuse the user by stating that they need to activate the tab,
			// but the tab will already be activated by the time the announcement finishes.
			focusedtab.attr( "aria-selected", "false" );
			this.tabs.eq( selectedindex ).attr( "aria-selected", "true" );

			this.activating = this._delay( function() {
				this.option( "active", selectedindex );
			}, this.delay );
		}
	},

	_panelkeydown: function( event ) {
		if ( this._handlepagenav( event ) ) {
			return;
		}

		// ctrl+up moves focus to the current tab
		if ( event.ctrlkey && event.keycode === $.ui.keycode.up ) {
			event.preventdefault();
			this.active.trigger( "focus" );
		}
	},

	// alt+page up/down moves focus to the previous/next tab (and activates)
	_handlepagenav: function( event ) {
		if ( event.altkey && event.keycode === $.ui.keycode.page_up ) {
			this._activate( this._focusnexttab( this.options.active - 1, false ) );
			return true;
		}
		if ( event.altkey && event.keycode === $.ui.keycode.page_down ) {
			this._activate( this._focusnexttab( this.options.active + 1, true ) );
			return true;
		}
	},

	_findnexttab: function( index, goingforward ) {
		var lasttabindex = this.tabs.length - 1;

		function constrain() {
			if ( index > lasttabindex ) {
				index = 0;
			}
			if ( index < 0 ) {
				index = lasttabindex;
			}
			return index;
		}

		while ( $.inarray( constrain(), this.options.disabled ) !== -1 ) {
			index = goingforward ? index + 1 : index - 1;
		}

		return index;
	},

	_focusnexttab: function( index, goingforward ) {
		index = this._findnexttab( index, goingforward );
		this.tabs.eq( index ).trigger( "focus" );
		return index;
	},

	_setoption: function( key, value ) {
		if ( key === "active" ) {

			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		this._super( key, value );

		if ( key === "collapsible" ) {
			this._toggleclass( "ui-tabs-collapsible", null, value );

			// setting collapsible: false while collapsed; open first panel
			if ( !value && this.options.active === false ) {
				this._activate( 0 );
			}
		}

		if ( key === "event" ) {
			this._setupevents( value );
		}

		if ( key === "heightstyle" ) {
			this._setupheightstyle( value );
		}
	},

	_sanitizeselector: function( hash ) {
		return hash ? hash.replace( /[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&" ) : "";
	},

	refresh: function() {
		var options = this.options,
			lis = this.tablist.children( ":has(a[href])" );

		// get disabled tabs from class attribute from html
		// this will get converted to a boolean if needed in _refresh()
		options.disabled = $.map( lis.filter( ".ui-state-disabled" ), function( tab ) {
			return lis.index( tab );
		} );

		this._processtabs();

		// was collapsed or no tabs
		if ( options.active === false || !this.anchors.length ) {
			options.active = false;
			this.active = $();

		// was active, but active tab is gone
		} else if ( this.active.length && !$.contains( this.tablist[ 0 ], this.active[ 0 ] ) ) {

			// all remaining tabs are disabled
			if ( this.tabs.length === options.disabled.length ) {
				options.active = false;
				this.active = $();

			// activate previous tab
			} else {
				this._activate( this._findnexttab( math.max( 0, options.active - 1 ), false ) );
			}

		// was active, active tab still exists
		} else {

			// make sure active index is correct
			options.active = this.tabs.index( this.active );
		}

		this._refresh();
	},

	_refresh: function() {
		this._setoptiondisabled( this.options.disabled );
		this._setupevents( this.options.event );
		this._setupheightstyle( this.options.heightstyle );

		this.tabs.not( this.active ).attr( {
			"aria-selected": "false",
			"aria-expanded": "false",
			tabindex: -1
		} );
		this.panels.not( this._getpanelfortab( this.active ) )
			.hide()
			.attr( {
				"aria-hidden": "true"
			} );

		// make sure one tab is in the tab order
		if ( !this.active.length ) {
			this.tabs.eq( 0 ).attr( "tabindex", 0 );
		} else {
			this.active
				.attr( {
					"aria-selected": "true",
					"aria-expanded": "true",
					tabindex: 0
				} );
			this._addclass( this.active, "ui-tabs-active", "ui-state-active" );
			this._getpanelfortab( this.active )
				.show()
				.attr( {
					"aria-hidden": "false"
				} );
		}
	},

	_processtabs: function() {
		var that = this,
			prevtabs = this.tabs,
			prevanchors = this.anchors,
			prevpanels = this.panels;

		this.tablist = this._getlist().attr( "role", "tablist" );
		this._addclass( this.tablist, "ui-tabs-nav",
			"ui-helper-reset ui-helper-clearfix ui-widget-header" );

		// prevent users from focusing disabled tabs via click
		this.tablist
			.on( "mousedown" + this.eventnamespace, "> li", function( event ) {
				if ( $( this ).is( ".ui-state-disabled" ) ) {
					event.preventdefault();
				}
			} )

			// support: ie <9
			// preventing the default action in mousedown doesn't prevent ie
			// from focusing the element, so if the anchor gets focused, blur.
			// we don't have to worry about focusing the previously focused
			// element since clicking on a non-focusable element should focus
			// the body anyway.
			.on( "focus" + this.eventnamespace, ".ui-tabs-anchor", function() {
				if ( $( this ).closest( "li" ).is( ".ui-state-disabled" ) ) {
					this.blur();
				}
			} );

		this.tabs = this.tablist.find( "> li:has(a[href])" )
			.attr( {
				role: "tab",
				tabindex: -1
			} );
		this._addclass( this.tabs, "ui-tabs-tab", "ui-state-default" );

		this.anchors = this.tabs.map( function() {
			return $( "a", this )[ 0 ];
		} )
			.attr( {
				tabindex: -1
			} );
		this._addclass( this.anchors, "ui-tabs-anchor" );

		this.panels = $();

		this.anchors.each( function( i, anchor ) {
			var selector, panel, panelid,
				anchorid = $( anchor ).uniqueid().attr( "id" ),
				tab = $( anchor ).closest( "li" ),
				originalariacontrols = tab.attr( "aria-controls" );

			// inline tab
			if ( that._islocal( anchor ) ) {
				selector = anchor.hash;
				panelid = selector.substring( 1 );
				panel = that.element.find( that._sanitizeselector( selector ) );

			// remote tab
			} else {

				// if the tab doesn't already have aria-controls,
				// generate an id by using a throw-away element
				panelid = tab.attr( "aria-controls" ) || $( {} ).uniqueid()[ 0 ].id;
				selector = "#" + panelid;
				panel = that.element.find( selector );
				if ( !panel.length ) {
					panel = that._createpanel( panelid );
					panel.insertafter( that.panels[ i - 1 ] || that.tablist );
				}
				panel.attr( "aria-live", "polite" );
			}

			if ( panel.length ) {
				that.panels = that.panels.add( panel );
			}
			if ( originalariacontrols ) {
				tab.data( "ui-tabs-aria-controls", originalariacontrols );
			}
			tab.attr( {
				"aria-controls": panelid,
				"aria-labelledby": anchorid
			} );
			panel.attr( "aria-labelledby", anchorid );
		} );

		this.panels.attr( "role", "tabpanel" );
		this._addclass( this.panels, "ui-tabs-panel", "ui-widget-content" );

		// avoid memory leaks (#10056)
		if ( prevtabs ) {
			this._off( prevtabs.not( this.tabs ) );
			this._off( prevanchors.not( this.anchors ) );
			this._off( prevpanels.not( this.panels ) );
		}
	},

	// allow overriding how to find the list for rare usage scenarios (#7715)
	_getlist: function() {
		return this.tablist || this.element.find( "ol, ul" ).eq( 0 );
	},

	_createpanel: function( id ) {
		return $( "<div>" )
			.attr( "id", id )
			.data( "ui-tabs-destroy", true );
	},

	_setoptiondisabled: function( disabled ) {
		var currentitem, li, i;

		if ( array.isarray( disabled ) ) {
			if ( !disabled.length ) {
				disabled = false;
			} else if ( disabled.length === this.anchors.length ) {
				disabled = true;
			}
		}

		// disable tabs
		for ( i = 0; ( li = this.tabs[ i ] ); i++ ) {
			currentitem = $( li );
			if ( disabled === true || $.inarray( i, disabled ) !== -1 ) {
				currentitem.attr( "aria-disabled", "true" );
				this._addclass( currentitem, null, "ui-state-disabled" );
			} else {
				currentitem.removeattr( "aria-disabled" );
				this._removeclass( currentitem, null, "ui-state-disabled" );
			}
		}

		this.options.disabled = disabled;

		this._toggleclass( this.widget(), this.widgetfullname + "-disabled", null,
			disabled === true );
	},

	_setupevents: function( event ) {
		var events = {};
		if ( event ) {
			$.each( event.split( " " ), function( index, eventname ) {
				events[ eventname ] = "_eventhandler";
			} );
		}

		this._off( this.anchors.add( this.tabs ).add( this.panels ) );

		// always prevent the default action, even when disabled
		this._on( true, this.anchors, {
			click: function( event ) {
				event.preventdefault();
			}
		} );
		this._on( this.anchors, events );
		this._on( this.tabs, { keydown: "_tabkeydown" } );
		this._on( this.panels, { keydown: "_panelkeydown" } );

		this._focusable( this.tabs );
		this._hoverable( this.tabs );
	},

	_setupheightstyle: function( heightstyle ) {
		var maxheight,
			parent = this.element.parent();

		if ( heightstyle === "fill" ) {
			maxheight = parent.height();
			maxheight -= this.element.outerheight() - this.element.height();

			this.element.siblings( ":visible" ).each( function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxheight -= elem.outerheight( true );
			} );

			this.element.children().not( this.panels ).each( function() {
				maxheight -= $( this ).outerheight( true );
			} );

			this.panels.each( function() {
				$( this ).height( math.max( 0, maxheight -
					$( this ).innerheight() + $( this ).height() ) );
			} )
				.css( "overflow", "auto" );
		} else if ( heightstyle === "auto" ) {
			maxheight = 0;
			this.panels.each( function() {
				maxheight = math.max( maxheight, $( this ).height( "" ).height() );
			} ).height( maxheight );
		}
	},

	_eventhandler: function( event ) {
		var options = this.options,
			active = this.active,
			anchor = $( event.currenttarget ),
			tab = anchor.closest( "li" ),
			clickedisactive = tab[ 0 ] === active[ 0 ],
			collapsing = clickedisactive && options.collapsible,
			toshow = collapsing ? $() : this._getpanelfortab( tab ),
			tohide = !active.length ? $() : this._getpanelfortab( active ),
			eventdata = {
				oldtab: active,
				oldpanel: tohide,
				newtab: collapsing ? $() : tab,
				newpanel: toshow
			};

		event.preventdefault();

		if ( tab.hasclass( "ui-state-disabled" ) ||

				// tab is already loading
				tab.hasclass( "ui-tabs-loading" ) ||

				// can't switch durning an animation
				this.running ||

				// click on active header, but not collapsible
				( clickedisactive && !options.collapsible ) ||

				// allow canceling activation
				( this._trigger( "beforeactivate", event, eventdata ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.tabs.index( tab );

		this.active = clickedisactive ? $() : tab;
		if ( this.xhr ) {
			this.xhr.abort();
		}

		if ( !tohide.length && !toshow.length ) {
			$.error( "jquery ui tabs: mismatching fragment identifier." );
		}

		if ( toshow.length ) {
			this.load( this.tabs.index( tab ), event );
		}
		this._toggle( event, eventdata );
	},

	// handles show/hide for selecting tabs
	_toggle: function( event, eventdata ) {
		var that = this,
			toshow = eventdata.newpanel,
			tohide = eventdata.oldpanel;

		this.running = true;

		function complete() {
			that.running = false;
			that._trigger( "activate", event, eventdata );
		}

		function show() {
			that._addclass( eventdata.newtab.closest( "li" ), "ui-tabs-active", "ui-state-active" );

			if ( toshow.length && that.options.show ) {
				that._show( toshow, that.options.show, complete );
			} else {
				toshow.show();
				complete();
			}
		}

		// start out by hiding, then showing, then completing
		if ( tohide.length && this.options.hide ) {
			this._hide( tohide, this.options.hide, function() {
				that._removeclass( eventdata.oldtab.closest( "li" ),
					"ui-tabs-active", "ui-state-active" );
				show();
			} );
		} else {
			this._removeclass( eventdata.oldtab.closest( "li" ),
				"ui-tabs-active", "ui-state-active" );
			tohide.hide();
			show();
		}

		tohide.attr( "aria-hidden", "true" );
		eventdata.oldtab.attr( {
			"aria-selected": "false",
			"aria-expanded": "false"
		} );

		// if we're switching tabs, remove the old tab from the tab order.
		// if we're opening from collapsed state, remove the previous tab from the tab order.
		// if we're collapsing, then keep the collapsing tab in the tab order.
		if ( toshow.length && tohide.length ) {
			eventdata.oldtab.attr( "tabindex", -1 );
		} else if ( toshow.length ) {
			this.tabs.filter( function() {
				return $( this ).attr( "tabindex" ) === 0;
			} )
				.attr( "tabindex", -1 );
		}

		toshow.attr( "aria-hidden", "false" );
		eventdata.newtab.attr( {
			"aria-selected": "true",
			"aria-expanded": "true",
			tabindex: 0
		} );
	},

	_activate: function( index ) {
		var anchor,
			active = this._findactive( index );

		// trying to activate the already active panel
		if ( active[ 0 ] === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the current active header
		if ( !active.length ) {
			active = this.active;
		}

		anchor = active.find( ".ui-tabs-anchor" )[ 0 ];
		this._eventhandler( {
			target: anchor,
			currenttarget: anchor,
			preventdefault: $.noop
		} );
	},

	_findactive: function( index ) {
		return index === false ? $() : this.tabs.eq( index );
	},

	_getindex: function( index ) {

		// meta-function to give users option to provide a href string instead of a numerical index.
		if ( typeof index === "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$='" +
				$.escapeselector( index ) + "']" ) );
		}

		return index;
	},

	_destroy: function() {
		if ( this.xhr ) {
			this.xhr.abort();
		}

		this.tablist
			.removeattr( "role" )
			.off( this.eventnamespace );

		this.anchors
			.removeattr( "role tabindex" )
			.removeuniqueid();

		this.tabs.add( this.panels ).each( function() {
			if ( $.data( this, "ui-tabs-destroy" ) ) {
				$( this ).remove();
			} else {
				$( this ).removeattr( "role tabindex " +
					"aria-live aria-busy aria-selected aria-labelledby aria-hidden aria-expanded" );
			}
		} );

		this.tabs.each( function() {
			var li = $( this ),
				prev = li.data( "ui-tabs-aria-controls" );
			if ( prev ) {
				li
					.attr( "aria-controls", prev )
					.removedata( "ui-tabs-aria-controls" );
			} else {
				li.removeattr( "aria-controls" );
			}
		} );

		this.panels.show();

		if ( this.options.heightstyle !== "content" ) {
			this.panels.css( "height", "" );
		}
	},

	enable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === false ) {
			return;
		}

		if ( index === undefined ) {
			disabled = false;
		} else {
			index = this._getindex( index );
			if ( array.isarray( disabled ) ) {
				disabled = $.map( disabled, function( num ) {
					return num !== index ? num : null;
				} );
			} else {
				disabled = $.map( this.tabs, function( li, num ) {
					return num !== index ? num : null;
				} );
			}
		}
		this._setoptiondisabled( disabled );
	},

	disable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === true ) {
			return;
		}

		if ( index === undefined ) {
			disabled = true;
		} else {
			index = this._getindex( index );
			if ( $.inarray( index, disabled ) !== -1 ) {
				return;
			}
			if ( array.isarray( disabled ) ) {
				disabled = $.merge( [ index ], disabled ).sort();
			} else {
				disabled = [ index ];
			}
		}
		this._setoptiondisabled( disabled );
	},

	load: function( index, event ) {
		index = this._getindex( index );
		var that = this,
			tab = this.tabs.eq( index ),
			anchor = tab.find( ".ui-tabs-anchor" ),
			panel = this._getpanelfortab( tab ),
			eventdata = {
				tab: tab,
				panel: panel
			},
			complete = function( jqxhr, status ) {
				if ( status === "abort" ) {
					that.panels.stop( false, true );
				}

				that._removeclass( tab, "ui-tabs-loading" );
				panel.removeattr( "aria-busy" );

				if ( jqxhr === that.xhr ) {
					delete that.xhr;
				}
			};

		// not remote
		if ( this._islocal( anchor[ 0 ] ) ) {
			return;
		}

		this.xhr = $.ajax( this._ajaxsettings( anchor, event, eventdata ) );

		// support: jquery <1.8
		// jquery <1.8 returns false if the request is canceled in beforesend,
		// but as of 1.8, $.ajax() always returns a jqxhr object.
		if ( this.xhr && this.xhr.statustext !== "canceled" ) {
			this._addclass( tab, "ui-tabs-loading" );
			panel.attr( "aria-busy", "true" );

			this.xhr
				.done( function( response, status, jqxhr ) {

					// support: jquery <1.8
					// https://bugs.jquery.com/ticket/11778
					settimeout( function() {
						panel.html( response );
						that._trigger( "load", event, eventdata );

						complete( jqxhr, status );
					}, 1 );
				} )
				.fail( function( jqxhr, status ) {

					// support: jquery <1.8
					// https://bugs.jquery.com/ticket/11778
					settimeout( function() {
						complete( jqxhr, status );
					}, 1 );
				} );
		}
	},

	_ajaxsettings: function( anchor, event, eventdata ) {
		var that = this;
		return {

			// support: ie <11 only
			// strip any hash that exists to prevent errors with the ajax request
			url: anchor.attr( "href" ).replace( /#.*$/, "" ),
			beforesend: function( jqxhr, settings ) {
				return that._trigger( "beforeload", event,
					$.extend( { jqxhr: jqxhr, ajaxsettings: settings }, eventdata ) );
			}
		};
	},

	_getpanelfortab: function( tab ) {
		var id = $( tab ).attr( "aria-controls" );
		return this.element.find( this._sanitizeselector( "#" + id ) );
	}
} );

// deprecated
// todo: switch return back to widget declaration at top of file when this is removed
if ( $.uibackcompat !== false ) {

	// backcompat for ui-tab class (now ui-tabs-tab)
	$.widget( "ui.tabs", $.ui.tabs, {
		_processtabs: function() {
			this._superapply( arguments );
			this._addclass( this.tabs, "ui-tab" );
		}
	} );
}

return $.ui.tabs;

} );







