/*!
 * jquery ui mouse 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: mouse
//>>group: widgets
//>>description: abstracts mouse-based interactions to assist in creating certain widgets.
//>>docs: https://api.jqueryui.com/mouse/

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../ie",
			"../version",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

var mousehandled = false;
$( document ).on( "mouseup", function() {
	mousehandled = false;
} );

return $.widget( "ui.mouse", {
	version: "1.13.3",
	options: {
		cancel: "input, textarea, button, select, option",
		distance: 1,
		delay: 0
	},
	_mouseinit: function() {
		var that = this;

		this.element
			.on( "mousedown." + this.widgetname, function( event ) {
				return that._mousedown( event );
			} )
			.on( "click." + this.widgetname, function( event ) {
				if ( true === $.data( event.target, that.widgetname + ".preventclickevent" ) ) {
					$.removedata( event.target, that.widgetname + ".preventclickevent" );
					event.stopimmediatepropagation();
					return false;
				}
			} );

		this.started = false;
	},

	// todo: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mousedestroy: function() {
		this.element.off( "." + this.widgetname );
		if ( this._mousemovedelegate ) {
			this.document
				.off( "mousemove." + this.widgetname, this._mousemovedelegate )
				.off( "mouseup." + this.widgetname, this._mouseupdelegate );
		}
	},

	_mousedown: function( event ) {

		// don't let more than one widget handle mousestart
		if ( mousehandled ) {
			return;
		}

		this._mousemoved = false;

		// we may have missed mouseup (out of window)
		if ( this._mousestarted ) {
			this._mouseup( event );
		}

		this._mousedownevent = event;

		var that = this,
			btnisleft = ( event.which === 1 ),

			// event.target.nodename works around a bug in ie 8 with
			// disabled inputs (#7620)
			eliscancel = ( typeof this.options.cancel === "string" && event.target.nodename ?
				$( event.target ).closest( this.options.cancel ).length : false );
		if ( !btnisleft || eliscancel || !this._mousecapture( event ) ) {
			return true;
		}

		this.mousedelaymet = !this.options.delay;
		if ( !this.mousedelaymet ) {
			this._mousedelaytimer = settimeout( function() {
				that.mousedelaymet = true;
			}, this.options.delay );
		}

		if ( this._mousedistancemet( event ) && this._mousedelaymet( event ) ) {
			this._mousestarted = ( this._mousestart( event ) !== false );
			if ( !this._mousestarted ) {
				event.preventdefault();
				return true;
			}
		}

		// click event may never have fired (gecko & opera)
		if ( true === $.data( event.target, this.widgetname + ".preventclickevent" ) ) {
			$.removedata( event.target, this.widgetname + ".preventclickevent" );
		}

		// these delegates are required to keep context
		this._mousemovedelegate = function( event ) {
			return that._mousemove( event );
		};
		this._mouseupdelegate = function( event ) {
			return that._mouseup( event );
		};

		this.document
			.on( "mousemove." + this.widgetname, this._mousemovedelegate )
			.on( "mouseup." + this.widgetname, this._mouseupdelegate );

		event.preventdefault();

		mousehandled = true;
		return true;
	},

	_mousemove: function( event ) {

		// only check for mouseups outside the document if you've moved inside the document
		// at least once. this prevents the firing of mouseup in the case of ie<9, which will
		// fire a mousemove event if content is placed under the cursor. see #7778
		// support: ie <9
		if ( this._mousemoved ) {

			// ie mouseup check - mouseup happened when mouse was out of window
			if ( $.ui.ie && ( !document.documentmode || document.documentmode < 9 ) &&
					!event.button ) {
				return this._mouseup( event );

			// iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {

				// support: safari <=8 - 9
				// safari sets which to 0 if you press any of the following keys
				// during a drag (#14461)
				if ( event.originalevent.altkey || event.originalevent.ctrlkey ||
						event.originalevent.metakey || event.originalevent.shiftkey ) {
					this.ignoremissingwhich = true;
				} else if ( !this.ignoremissingwhich ) {
					return this._mouseup( event );
				}
			}
		}

		if ( event.which || event.button ) {
			this._mousemoved = true;
		}

		if ( this._mousestarted ) {
			this._mousedrag( event );
			return event.preventdefault();
		}

		if ( this._mousedistancemet( event ) && this._mousedelaymet( event ) ) {
			this._mousestarted =
				( this._mousestart( this._mousedownevent, event ) !== false );
			if ( this._mousestarted ) {
				this._mousedrag( event );
			} else {
				this._mouseup( event );
			}
		}

		return !this._mousestarted;
	},

	_mouseup: function( event ) {
		this.document
			.off( "mousemove." + this.widgetname, this._mousemovedelegate )
			.off( "mouseup." + this.widgetname, this._mouseupdelegate );

		if ( this._mousestarted ) {
			this._mousestarted = false;

			if ( event.target === this._mousedownevent.target ) {
				$.data( event.target, this.widgetname + ".preventclickevent", true );
			}

			this._mousestop( event );
		}

		if ( this._mousedelaytimer ) {
			cleartimeout( this._mousedelaytimer );
			delete this._mousedelaytimer;
		}

		this.ignoremissingwhich = false;
		mousehandled = false;
		event.preventdefault();
	},

	_mousedistancemet: function( event ) {
		return ( math.max(
				math.abs( this._mousedownevent.pagex - event.pagex ),
				math.abs( this._mousedownevent.pagey - event.pagey )
			) >= this.options.distance
		);
	},

	_mousedelaymet: function( /* event */ ) {
		return this.mousedelaymet;
	},

	// these are placeholder methods, to be overriden by extending plugin
	_mousestart: function( /* event */ ) {},
	_mousedrag: function( /* event */ ) {},
	_mousestop: function( /* event */ ) {},
	_mousecapture: function( /* event */ ) {
		return true;
	}
} );

} );





