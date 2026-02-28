/*!
 * jquery ui spinner 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: spinner
//>>group: widgets
//>>description: displays buttons to easily input numbers via the keyboard or mouse.
//>>docs: https://api.jqueryui.com/spinner/
//>>demos: https://jqueryui.com/spinner/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/spinner.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./button",
			"../version",
			"../keycode",
			"../safe-active-element",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

function spinnermodifier( fn ) {
	return function() {
		var previous = this.element.val();
		fn.apply( this, arguments );
		this._refresh();
		if ( previous !== this.element.val() ) {
			this._trigger( "change" );
		}
	};
}

$.widget( "ui.spinner", {
	version: "1.13.3",
	defaultelement: "<input>",
	widgeteventprefix: "spin",
	options: {
		classes: {
			"ui-spinner": "ui-corner-all",
			"ui-spinner-down": "ui-corner-br",
			"ui-spinner-up": "ui-corner-tr"
		},
		culture: null,
		icons: {
			down: "ui-icon-triangle-1-s",
			up: "ui-icon-triangle-1-n"
		},
		incremental: true,
		max: null,
		min: null,
		numberformat: null,
		page: 10,
		step: 1,

		change: null,
		spin: null,
		start: null,
		stop: null
	},

	_create: function() {

		// handle string values that need to be parsed
		this._setoption( "max", this.options.max );
		this._setoption( "min", this.options.min );
		this._setoption( "step", this.options.step );

		// only format if there is a value, prevents the field from being marked
		// as invalid in firefox, see #9573.
		if ( this.value() !== "" ) {

			// format the value, but don't constrain.
			this._value( this.element.val(), true );
		}

		this._draw();
		this._on( this._events );
		this._refresh();

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeattr( "autocomplete" );
			}
		} );
	},

	_getcreateoptions: function() {
		var options = this._super();
		var element = this.element;

		$.each( [ "min", "max", "step" ], function( i, option ) {
			var value = element.attr( option );
			if ( value != null && value.length ) {
				options[ option ] = value;
			}
		} );

		return options;
	},

	_events: {
		keydown: function( event ) {
			if ( this._start( event ) && this._keydown( event ) ) {
				event.preventdefault();
			}
		},
		keyup: "_stop",
		focus: function() {
			this.previous = this.element.val();
		},
		blur: function( event ) {
			if ( this.cancelblur ) {
				delete this.cancelblur;
				return;
			}

			this._stop();
			this._refresh();
			if ( this.previous !== this.element.val() ) {
				this._trigger( "change", event );
			}
		},
		mousewheel: function( event, delta ) {
			var activeelement = $.ui.safeactiveelement( this.document[ 0 ] );
			var isactive = this.element[ 0 ] === activeelement;

			if ( !isactive || !delta ) {
				return;
			}

			if ( !this.spinning && !this._start( event ) ) {
				return false;
			}

			this._spin( ( delta > 0 ? 1 : -1 ) * this.options.step, event );
			cleartimeout( this.mousewheeltimer );
			this.mousewheeltimer = this._delay( function() {
				if ( this.spinning ) {
					this._stop( event );
				}
			}, 100 );
			event.preventdefault();
		},
		"mousedown .ui-spinner-button": function( event ) {
			var previous;

			// we never want the buttons to have focus; whenever the user is
			// interacting with the spinner, the focus should be on the input.
			// if the input is focused then this.previous is properly set from
			// when the input first received focus. if the input is not focused
			// then we need to set this.previous based on the value before spinning.
			previous = this.element[ 0 ] === $.ui.safeactiveelement( this.document[ 0 ] ) ?
				this.previous : this.element.val();
			function checkfocus() {
				var isactive = this.element[ 0 ] === $.ui.safeactiveelement( this.document[ 0 ] );
				if ( !isactive ) {
					this.element.trigger( "focus" );
					this.previous = previous;

					// support: ie
					// ie sets focus asynchronously, so we need to check if focus
					// moved off of the input because the user clicked on the button.
					this._delay( function() {
						this.previous = previous;
					} );
				}
			}

			// ensure focus is on (or stays on) the text field
			event.preventdefault();
			checkfocus.call( this );

			// support: ie
			// ie doesn't prevent moving focus even with event.preventdefault()
			// so we set a flag to know when we should ignore the blur event
			// and check (again) if focus moved off of the input.
			this.cancelblur = true;
			this._delay( function() {
				delete this.cancelblur;
				checkfocus.call( this );
			} );

			if ( this._start( event ) === false ) {
				return;
			}

			this._repeat( null, $( event.currenttarget )
				.hasclass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		"mouseup .ui-spinner-button": "_stop",
		"mouseenter .ui-spinner-button": function( event ) {

			// button will add ui-state-active if mouse was down while mouseleave and kept down
			if ( !$( event.currenttarget ).hasclass( "ui-state-active" ) ) {
				return;
			}

			if ( this._start( event ) === false ) {
				return false;
			}
			this._repeat( null, $( event.currenttarget )
				.hasclass( "ui-spinner-up" ) ? 1 : -1, event );
		},

		// todo: do we really want to consider this a stop?
		// shouldn't we just stop the repeater and wait until mouseup before
		// we trigger the stop event?
		"mouseleave .ui-spinner-button": "_stop"
	},

	// support mobile enhanced option and make backcompat more sane
	_enhance: function() {
		this.uispinner = this.element
			.attr( "autocomplete", "off" )
			.wrap( "<span>" )
			.parent()

				// add buttons
				.append(
					"<a></a><a></a>"
				);
	},

	_draw: function() {
		this._enhance();

		this._addclass( this.uispinner, "ui-spinner", "ui-widget ui-widget-content" );
		this._addclass( "ui-spinner-input" );

		this.element.attr( "role", "spinbutton" );

		// button bindings
		this.buttons = this.uispinner.children( "a" )
			.attr( "tabindex", -1 )
			.attr( "aria-hidden", true )
			.button( {
				classes: {
					"ui-button": ""
				}
			} );

		// todo: right now button does not support classes this is already updated in button pr
		this._removeclass( this.buttons, "ui-corner-all" );

		this._addclass( this.buttons.first(), "ui-spinner-button ui-spinner-up" );
		this._addclass( this.buttons.last(), "ui-spinner-button ui-spinner-down" );
		this.buttons.first().button( {
			"icon": this.options.icons.up,
			"showlabel": false
		} );
		this.buttons.last().button( {
			"icon": this.options.icons.down,
			"showlabel": false
		} );

		// ie 6 doesn't understand height: 50% for the buttons
		// unless the wrapper has an explicit height
		if ( this.buttons.height() > math.ceil( this.uispinner.height() * 0.5 ) &&
				this.uispinner.height() > 0 ) {
			this.uispinner.height( this.uispinner.height() );
		}
	},

	_keydown: function( event ) {
		var options = this.options,
			keycode = $.ui.keycode;

		switch ( event.keycode ) {
		case keycode.up:
			this._repeat( null, 1, event );
			return true;
		case keycode.down:
			this._repeat( null, -1, event );
			return true;
		case keycode.page_up:
			this._repeat( null, options.page, event );
			return true;
		case keycode.page_down:
			this._repeat( null, -options.page, event );
			return true;
		}

		return false;
	},

	_start: function( event ) {
		if ( !this.spinning && this._trigger( "start", event ) === false ) {
			return false;
		}

		if ( !this.counter ) {
			this.counter = 1;
		}
		this.spinning = true;
		return true;
	},

	_repeat: function( i, steps, event ) {
		i = i || 500;

		cleartimeout( this.timer );
		this.timer = this._delay( function() {
			this._repeat( 40, steps, event );
		}, i );

		this._spin( steps * this.options.step, event );
	},

	_spin: function( step, event ) {
		var value = this.value() || 0;

		if ( !this.counter ) {
			this.counter = 1;
		}

		value = this._adjustvalue( value + step * this._increment( this.counter ) );

		if ( !this.spinning || this._trigger( "spin", event, { value: value } ) !== false ) {
			this._value( value );
			this.counter++;
		}
	},

	_increment: function( i ) {
		var incremental = this.options.incremental;

		if ( incremental ) {
			return typeof incremental === "function" ?
				incremental( i ) :
				math.floor( i * i * i / 50000 - i * i / 500 + 17 * i / 200 + 1 );
		}

		return 1;
	},

	_precision: function() {
		var precision = this._precisionof( this.options.step );
		if ( this.options.min !== null ) {
			precision = math.max( precision, this._precisionof( this.options.min ) );
		}
		return precision;
	},

	_precisionof: function( num ) {
		var str = num.tostring(),
			decimal = str.indexof( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_adjustvalue: function( value ) {
		var base, abovemin,
			options = this.options;

		// make sure we're at a valid step
		// - find out where we are relative to the base (min or 0)
		base = options.min !== null ? options.min : 0;
		abovemin = value - base;

		// - round to the nearest step
		abovemin = math.round( abovemin / options.step ) * options.step;

		// - rounding is based on 0, so adjust back to our base
		value = base + abovemin;

		// fix precision from bad js floating point math
		value = parsefloat( value.tofixed( this._precision() ) );

		// clamp the value
		if ( options.max !== null && value > options.max ) {
			return options.max;
		}
		if ( options.min !== null && value < options.min ) {
			return options.min;
		}

		return value;
	},

	_stop: function( event ) {
		if ( !this.spinning ) {
			return;
		}

		cleartimeout( this.timer );
		cleartimeout( this.mousewheeltimer );
		this.counter = 0;
		this.spinning = false;
		this._trigger( "stop", event );
	},

	_setoption: function( key, value ) {
		var prevvalue, first, last;

		if ( key === "culture" || key === "numberformat" ) {
			prevvalue = this._parse( this.element.val() );
			this.options[ key ] = value;
			this.element.val( this._format( prevvalue ) );
			return;
		}

		if ( key === "max" || key === "min" || key === "step" ) {
			if ( typeof value === "string" ) {
				value = this._parse( value );
			}
		}
		if ( key === "icons" ) {
			first = this.buttons.first().find( ".ui-icon" );
			this._removeclass( first, null, this.options.icons.up );
			this._addclass( first, null, value.up );
			last = this.buttons.last().find( ".ui-icon" );
			this._removeclass( last, null, this.options.icons.down );
			this._addclass( last, null, value.down );
		}

		this._super( key, value );
	},

	_setoptiondisabled: function( value ) {
		this._super( value );

		this._toggleclass( this.uispinner, null, "ui-state-disabled", !!value );
		this.element.prop( "disabled", !!value );
		this.buttons.button( value ? "disable" : "enable" );
	},

	_setoptions: spinnermodifier( function( options ) {
		this._super( options );
	} ),

	_parse: function( val ) {
		if ( typeof val === "string" && val !== "" ) {
			val = window.globalize && this.options.numberformat ?
				globalize.parsefloat( val, 10, this.options.culture ) : +val;
		}
		return val === "" || isnan( val ) ? null : val;
	},

	_format: function( value ) {
		if ( value === "" ) {
			return "";
		}
		return window.globalize && this.options.numberformat ?
			globalize.format( value, this.options.numberformat, this.options.culture ) :
			value;
	},

	_refresh: function() {
		this.element.attr( {
			"aria-valuemin": this.options.min,
			"aria-valuemax": this.options.max,

			// todo: what should we do with values that can't be parsed?
			"aria-valuenow": this._parse( this.element.val() )
		} );
	},

	isvalid: function() {
		var value = this.value();

		// null is invalid
		if ( value === null ) {
			return false;
		}

		// if value gets adjusted, it's invalid
		return value === this._adjustvalue( value );
	},

	// update the value without triggering change
	_value: function( value, allowany ) {
		var parsed;
		if ( value !== "" ) {
			parsed = this._parse( value );
			if ( parsed !== null ) {
				if ( !allowany ) {
					parsed = this._adjustvalue( parsed );
				}
				value = this._format( parsed );
			}
		}
		this.element.val( value );
		this._refresh();
	},

	_destroy: function() {
		this.element
			.prop( "disabled", false )
			.removeattr( "autocomplete role aria-valuemin aria-valuemax aria-valuenow" );

		this.uispinner.replacewith( this.element );
	},

	stepup: spinnermodifier( function( steps ) {
		this._stepup( steps );
	} ),
	_stepup: function( steps ) {
		if ( this._start() ) {
			this._spin( ( steps || 1 ) * this.options.step );
			this._stop();
		}
	},

	stepdown: spinnermodifier( function( steps ) {
		this._stepdown( steps );
	} ),
	_stepdown: function( steps ) {
		if ( this._start() ) {
			this._spin( ( steps || 1 ) * -this.options.step );
			this._stop();
		}
	},

	pageup: spinnermodifier( function( pages ) {
		this._stepup( ( pages || 1 ) * this.options.page );
	} ),

	pagedown: spinnermodifier( function( pages ) {
		this._stepdown( ( pages || 1 ) * this.options.page );
	} ),

	value: function( newval ) {
		if ( !arguments.length ) {
			return this._parse( this.element.val() );
		}
		spinnermodifier( this._value ).call( this, newval );
	},

	widget: function() {
		return this.uispinner;
	}
} );

// deprecated
// todo: switch return back to widget declaration at top of file when this is removed
if ( $.uibackcompat !== false ) {

	// backcompat for spinner html extension points
	$.widget( "ui.spinner", $.ui.spinner, {
		_enhance: function() {
			this.uispinner = this.element
				.attr( "autocomplete", "off" )
				.wrap( this._uispinnerhtml() )
				.parent()

					// add buttons
					.append( this._buttonhtml() );
		},
		_uispinnerhtml: function() {
			return "<span>";
		},

		_buttonhtml: function() {
			return "<a></a><a></a>";
		}
	} );
}

return $.ui.spinner;

} );


