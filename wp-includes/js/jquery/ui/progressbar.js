/*!
 * jquery ui progressbar 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: progressbar
//>>group: widgets
/* eslint-disable max-len */
//>>description: displays a status indicator for loading state, standard percentage, and other progress indicators.
/* eslint-enable max-len */
//>>docs: https://api.jqueryui.com/progressbar/
//>>demos: https://jqueryui.com/progressbar/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/progressbar.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../version",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

return $.widget( "ui.progressbar", {
	version: "1.13.3",
	options: {
		classes: {
			"ui-progressbar": "ui-corner-all",
			"ui-progressbar-value": "ui-corner-left",
			"ui-progressbar-complete": "ui-corner-right"
		},
		max: 100,
		value: 0,

		change: null,
		complete: null
	},

	min: 0,

	_create: function() {

		// constrain initial value
		this.oldvalue = this.options.value = this._constrainedvalue();

		this.element.attr( {

			// only set static values; aria-valuenow and aria-valuemax are
			// set inside _refreshvalue()
			role: "progressbar",
			"aria-valuemin": this.min
		} );
		this._addclass( "ui-progressbar", "ui-widget ui-widget-content" );

		this.valuediv = $( "<div>" ).appendto( this.element );
		this._addclass( this.valuediv, "ui-progressbar-value", "ui-widget-header" );
		this._refreshvalue();
	},

	_destroy: function() {
		this.element.removeattr( "role aria-valuemin aria-valuemax aria-valuenow" );

		this.valuediv.remove();
	},

	value: function( newvalue ) {
		if ( newvalue === undefined ) {
			return this.options.value;
		}

		this.options.value = this._constrainedvalue( newvalue );
		this._refreshvalue();
	},

	_constrainedvalue: function( newvalue ) {
		if ( newvalue === undefined ) {
			newvalue = this.options.value;
		}

		this.indeterminate = newvalue === false;

		// sanitize value
		if ( typeof newvalue !== "number" ) {
			newvalue = 0;
		}

		return this.indeterminate ? false :
			math.min( this.options.max, math.max( this.min, newvalue ) );
	},

	_setoptions: function( options ) {

		// ensure "value" option is set after other values (like max)
		var value = options.value;
		delete options.value;

		this._super( options );

		this.options.value = this._constrainedvalue( value );
		this._refreshvalue();
	},

	_setoption: function( key, value ) {
		if ( key === "max" ) {

			// don't allow a max less than min
			value = math.max( this.min, value );
		}
		this._super( key, value );
	},

	_setoptiondisabled: function( value ) {
		this._super( value );

		this.element.attr( "aria-disabled", value );
		this._toggleclass( null, "ui-state-disabled", !!value );
	},

	_percentage: function() {
		return this.indeterminate ?
			100 :
			100 * ( this.options.value - this.min ) / ( this.options.max - this.min );
	},

	_refreshvalue: function() {
		var value = this.options.value,
			percentage = this._percentage();

		this.valuediv
			.toggle( this.indeterminate || value > this.min )
			.width( percentage.tofixed( 0 ) + "%" );

		this
			._toggleclass( this.valuediv, "ui-progressbar-complete", null,
				value === this.options.max )
			._toggleclass( "ui-progressbar-indeterminate", null, this.indeterminate );

		if ( this.indeterminate ) {
			this.element.removeattr( "aria-valuenow" );
			if ( !this.overlaydiv ) {
				this.overlaydiv = $( "<div>" ).appendto( this.valuediv );
				this._addclass( this.overlaydiv, "ui-progressbar-overlay" );
			}
		} else {
			this.element.attr( {
				"aria-valuemax": this.options.max,
				"aria-valuenow": value
			} );
			if ( this.overlaydiv ) {
				this.overlaydiv.remove();
				this.overlaydiv = null;
			}
		}

		if ( this.oldvalue !== value ) {
			this.oldvalue = value;
			this._trigger( "change" );
		}
		if ( value === this.options.max ) {
			this._trigger( "complete" );
		}
	}
} );

} );


