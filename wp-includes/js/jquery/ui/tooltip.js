/*!
 * jquery ui tooltip 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: tooltip
//>>group: widgets
//>>description: shows additional information for any element on hover or focus.
//>>docs: https://api.jqueryui.com/tooltip/
//>>demos: https://jqueryui.com/tooltip/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/tooltip.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../keycode",
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

$.widget( "ui.tooltip", {
	version: "1.13.3",
	options: {
		classes: {
			"ui-tooltip": "ui-corner-all ui-widget-shadow"
		},
		content: function() {
			var title = $( this ).attr( "title" );

			// escape title, since we're going from an attribute to raw html
			return $( "<a>" ).text( title ).html();
		},
		hide: true,

		// disabled elements have inconsistent behavior across browsers (#8661)
		items: "[title]:not([disabled])",
		position: {
			my: "left top+15",
			at: "left bottom",
			collision: "flipfit flip"
		},
		show: true,
		track: false,

		// callbacks
		close: null,
		open: null
	},

	_adddescribedby: function( elem, id ) {
		var describedby = ( elem.attr( "aria-describedby" ) || "" ).split( /\s+/ );
		describedby.push( id );
		elem
			.data( "ui-tooltip-id", id )
			.attr( "aria-describedby", string.prototype.trim.call( describedby.join( " " ) ) );
	},

	_removedescribedby: function( elem ) {
		var id = elem.data( "ui-tooltip-id" ),
			describedby = ( elem.attr( "aria-describedby" ) || "" ).split( /\s+/ ),
			index = $.inarray( id, describedby );

		if ( index !== -1 ) {
			describedby.splice( index, 1 );
		}

		elem.removedata( "ui-tooltip-id" );
		describedby = string.prototype.trim.call( describedby.join( " " ) );
		if ( describedby ) {
			elem.attr( "aria-describedby", describedby );
		} else {
			elem.removeattr( "aria-describedby" );
		}
	},

	_create: function() {
		this._on( {
			mouseover: "open",
			focusin: "open"
		} );

		// ids of generated tooltips, needed for destroy
		this.tooltips = {};

		// ids of parent tooltips where we removed the title attribute
		this.parents = {};

		// append the aria-live region so tooltips announce correctly
		this.liveregion = $( "<div>" )
			.attr( {
				role: "log",
				"aria-live": "assertive",
				"aria-relevant": "additions"
			} )
			.appendto( this.document[ 0 ].body );
		this._addclass( this.liveregion, null, "ui-helper-hidden-accessible" );

		this.disabledtitles = $( [] );
	},

	_setoption: function( key, value ) {
		var that = this;

		this._super( key, value );

		if ( key === "content" ) {
			$.each( this.tooltips, function( id, tooltipdata ) {
				that._updatecontent( tooltipdata.element );
			} );
		}
	},

	_setoptiondisabled: function( value ) {
		this[ value ? "_disable" : "_enable" ]();
	},

	_disable: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, tooltipdata ) {
			var event = $.event( "blur" );
			event.target = event.currenttarget = tooltipdata.element[ 0 ];
			that.close( event, true );
		} );

		// remove title attributes to prevent native tooltips
		this.disabledtitles = this.disabledtitles.add(
			this.element.find( this.options.items ).addback()
				.filter( function() {
					var element = $( this );
					if ( element.is( "[title]" ) ) {
						return element
							.data( "ui-tooltip-title", element.attr( "title" ) )
							.removeattr( "title" );
					}
				} )
		);
	},

	_enable: function() {

		// restore title attributes
		this.disabledtitles.each( function() {
			var element = $( this );
			if ( element.data( "ui-tooltip-title" ) ) {
				element.attr( "title", element.data( "ui-tooltip-title" ) );
			}
		} );
		this.disabledtitles = $( [] );
	},

	open: function( event ) {
		var that = this,
			target = $( event ? event.target : this.element )

				// we need closest here due to mouseover bubbling,
				// but always pointing at the same event target
				.closest( this.options.items );

		// no element to show a tooltip for or the tooltip is already open
		if ( !target.length || target.data( "ui-tooltip-id" ) ) {
			return;
		}

		if ( target.attr( "title" ) ) {
			target.data( "ui-tooltip-title", target.attr( "title" ) );
		}

		target.data( "ui-tooltip-open", true );

		// kill parent tooltips, custom or native, for hover
		if ( event && event.type === "mouseover" ) {
			target.parents().each( function() {
				var parent = $( this ),
					blurevent;
				if ( parent.data( "ui-tooltip-open" ) ) {
					blurevent = $.event( "blur" );
					blurevent.target = blurevent.currenttarget = this;
					that.close( blurevent, true );
				}
				if ( parent.attr( "title" ) ) {
					parent.uniqueid();
					that.parents[ this.id ] = {
						element: this,
						title: parent.attr( "title" )
					};
					parent.attr( "title", "" );
				}
			} );
		}

		this._registerclosehandlers( event, target );
		this._updatecontent( target, event );
	},

	_updatecontent: function( target, event ) {
		var content,
			contentoption = this.options.content,
			that = this,
			eventtype = event ? event.type : null;

		if ( typeof contentoption === "string" || contentoption.nodetype ||
				contentoption.jquery ) {
			return this._open( event, target, contentoption );
		}

		content = contentoption.call( target[ 0 ], function( response ) {

			// ie may instantly serve a cached response for ajax requests
			// delay this call to _open so the other call to _open runs first
			that._delay( function() {

				// ignore async response if tooltip was closed already
				if ( !target.data( "ui-tooltip-open" ) ) {
					return;
				}

				// jquery creates a special event for focusin when it doesn't
				// exist natively. to improve performance, the native event
				// object is reused and the type is changed. therefore, we can't
				// rely on the type being correct after the event finished
				// bubbling, so we set it back to the previous value. (#8740)
				if ( event ) {
					event.type = eventtype;
				}
				this._open( event, target, response );
			} );
		} );
		if ( content ) {
			this._open( event, target, content );
		}
	},

	_open: function( event, target, content ) {
		var tooltipdata, tooltip, delayedshow, a11ycontent,
			positionoption = $.extend( {}, this.options.position );

		if ( !content ) {
			return;
		}

		// content can be updated multiple times. if the tooltip already
		// exists, then just update the content and bail.
		tooltipdata = this._find( target );
		if ( tooltipdata ) {
			tooltipdata.tooltip.find( ".ui-tooltip-content" ).html( content );
			return;
		}

		// if we have a title, clear it to prevent the native tooltip
		// we have to check first to avoid defining a title if none exists
		// (we don't want to cause an element to start matching [title])
		//
		// we use removeattr only for key events, to allow ie to export the correct
		// accessible attributes. for mouse events, set to empty string to avoid
		// native tooltip showing up (happens only when removing inside mouseover).
		if ( target.is( "[title]" ) ) {
			if ( event && event.type === "mouseover" ) {
				target.attr( "title", "" );
			} else {
				target.removeattr( "title" );
			}
		}

		tooltipdata = this._tooltip( target );
		tooltip = tooltipdata.tooltip;
		this._adddescribedby( target, tooltip.attr( "id" ) );
		tooltip.find( ".ui-tooltip-content" ).html( content );

		// support: voiceover on os x, jaws on ie <= 9
		// jaws announces deletions even when aria-relevant="additions"
		// voiceover will sometimes re-read the entire log region's contents from the beginning
		this.liveregion.children().hide();
		a11ycontent = $( "<div>" ).html( tooltip.find( ".ui-tooltip-content" ).html() );
		a11ycontent.removeattr( "name" ).find( "[name]" ).removeattr( "name" );
		a11ycontent.removeattr( "id" ).find( "[id]" ).removeattr( "id" );
		a11ycontent.appendto( this.liveregion );

		function position( event ) {
			positionoption.of = event;
			if ( tooltip.is( ":hidden" ) ) {
				return;
			}
			tooltip.position( positionoption );
		}
		if ( this.options.track && event && /^mouse/.test( event.type ) ) {
			this._on( this.document, {
				mousemove: position
			} );

			// trigger once to override element-relative positioning
			position( event );
		} else {
			tooltip.position( $.extend( {
				of: target
			}, this.options.position ) );
		}

		tooltip.hide();

		this._show( tooltip, this.options.show );

		// handle tracking tooltips that are shown with a delay (#8644). as soon
		// as the tooltip is visible, position the tooltip using the most recent
		// event.
		// adds the check to add the timers only when both delay and track options are set (#14682)
		if ( this.options.track && this.options.show && this.options.show.delay ) {
			delayedshow = this.delayedshow = setinterval( function() {
				if ( tooltip.is( ":visible" ) ) {
					position( positionoption.of );
					clearinterval( delayedshow );
				}
			}, 13 );
		}

		this._trigger( "open", event, { tooltip: tooltip } );
	},

	_registerclosehandlers: function( event, target ) {
		var events = {
			keyup: function( event ) {
				if ( event.keycode === $.ui.keycode.escape ) {
					var fakeevent = $.event( event );
					fakeevent.currenttarget = target[ 0 ];
					this.close( fakeevent, true );
				}
			}
		};

		// only bind remove handler for delegated targets. non-delegated
		// tooltips will handle this in destroy.
		if ( target[ 0 ] !== this.element[ 0 ] ) {
			events.remove = function() {
				var targetelement = this._find( target );
				if ( targetelement ) {
					this._removetooltip( targetelement.tooltip );
				}
			};
		}

		if ( !event || event.type === "mouseover" ) {
			events.mouseleave = "close";
		}
		if ( !event || event.type === "focusin" ) {
			events.focusout = "close";
		}
		this._on( true, target, events );
	},

	close: function( event ) {
		var tooltip,
			that = this,
			target = $( event ? event.currenttarget : this.element ),
			tooltipdata = this._find( target );

		// the tooltip may already be closed
		if ( !tooltipdata ) {

			// we set ui-tooltip-open immediately upon open (in open()), but only set the
			// additional data once there's actually content to show (in _open()). so even if the
			// tooltip doesn't have full data, we always remove ui-tooltip-open in case we're in
			// the period between open() and _open().
			target.removedata( "ui-tooltip-open" );
			return;
		}

		tooltip = tooltipdata.tooltip;

		// disabling closes the tooltip, so we need to track when we're closing
		// to avoid an infinite loop in case the tooltip becomes disabled on close
		if ( tooltipdata.closing ) {
			return;
		}

		// clear the interval for delayed tracking tooltips
		clearinterval( this.delayedshow );

		// only set title if we had one before (see comment in _open())
		// if the title attribute has changed since open(), don't restore
		if ( target.data( "ui-tooltip-title" ) && !target.attr( "title" ) ) {
			target.attr( "title", target.data( "ui-tooltip-title" ) );
		}

		this._removedescribedby( target );

		tooltipdata.hiding = true;
		tooltip.stop( true );
		this._hide( tooltip, this.options.hide, function() {
			that._removetooltip( $( this ) );
		} );

		target.removedata( "ui-tooltip-open" );
		this._off( target, "mouseleave focusout keyup" );

		// remove 'remove' binding only on delegated targets
		if ( target[ 0 ] !== this.element[ 0 ] ) {
			this._off( target, "remove" );
		}
		this._off( this.document, "mousemove" );

		if ( event && event.type === "mouseleave" ) {
			$.each( this.parents, function( id, parent ) {
				$( parent.element ).attr( "title", parent.title );
				delete that.parents[ id ];
			} );
		}

		tooltipdata.closing = true;
		this._trigger( "close", event, { tooltip: tooltip } );
		if ( !tooltipdata.hiding ) {
			tooltipdata.closing = false;
		}
	},

	_tooltip: function( element ) {
		var tooltip = $( "<div>" ).attr( "role", "tooltip" ),
			content = $( "<div>" ).appendto( tooltip ),
			id = tooltip.uniqueid().attr( "id" );

		this._addclass( content, "ui-tooltip-content" );
		this._addclass( tooltip, "ui-tooltip", "ui-widget ui-widget-content" );

		tooltip.appendto( this._appendto( element ) );

		return this.tooltips[ id ] = {
			element: element,
			tooltip: tooltip
		};
	},

	_find: function( target ) {
		var id = target.data( "ui-tooltip-id" );
		return id ? this.tooltips[ id ] : null;
	},

	_removetooltip: function( tooltip ) {

		// clear the interval for delayed tracking tooltips
		clearinterval( this.delayedshow );

		tooltip.remove();
		delete this.tooltips[ tooltip.attr( "id" ) ];
	},

	_appendto: function( target ) {
		var element = target.closest( ".ui-front, dialog" );

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_destroy: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, tooltipdata ) {

			// delegate to close method to handle common cleanup
			var event = $.event( "blur" ),
				element = tooltipdata.element;
			event.target = event.currenttarget = element[ 0 ];
			that.close( event, true );

			// remove immediately; destroying an open tooltip doesn't use the
			// hide animation
			$( "#" + id ).remove();

			// restore the title
			if ( element.data( "ui-tooltip-title" ) ) {

				// if the title attribute has changed since open(), don't restore
				if ( !element.attr( "title" ) ) {
					element.attr( "title", element.data( "ui-tooltip-title" ) );
				}
				element.removedata( "ui-tooltip-title" );
			}
		} );
		this.liveregion.remove();
	}
} );

// deprecated
// todo: switch return back to widget declaration at top of file when this is removed
if ( $.uibackcompat !== false ) {

	// backcompat for tooltipclass option
	$.widget( "ui.tooltip", $.ui.tooltip, {
		options: {
			tooltipclass: null
		},
		_tooltip: function() {
			var tooltipdata = this._superapply( arguments );
			if ( this.options.tooltipclass ) {
				tooltipdata.tooltip.addclass( this.options.tooltipclass );
			}
			return tooltipdata;
		}
	} );
}

return $.ui.tooltip;

} );




