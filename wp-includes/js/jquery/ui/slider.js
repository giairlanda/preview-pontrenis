/*!
 * jquery ui slider 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: slider
//>>group: widgets
//>>description: displays a flexible slider with ranges and accessibility via keyboard.
//>>docs: https://api.jqueryui.com/slider/
//>>demos: https://jqueryui.com/slider/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/slider.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./mouse",
			"../keycode",
			"../version",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

return $.widget( "ui.slider", $.ui.mouse, {
	version: "1.13.3",
	widgeteventprefix: "slide",

	options: {
		animate: false,
		classes: {
			"ui-slider": "ui-corner-all",
			"ui-slider-handle": "ui-corner-all",

			// note: ui-widget-header isn't the most fittingly semantic framework class for this
			// element, but worked best visually with a variety of themes
			"ui-slider-range": "ui-corner-all ui-widget-header"
		},
		distance: 0,
		max: 100,
		min: 0,
		orientation: "horizontal",
		range: false,
		step: 1,
		value: 0,
		values: null,

		// callbacks
		change: null,
		slide: null,
		start: null,
		stop: null
	},

	// number of pages in a slider
	// (how many times can you page up/down to go through the whole range)
	numpages: 5,

	_create: function() {
		this._keysliding = false;
		this._mousesliding = false;
		this._animateoff = true;
		this._handleindex = null;
		this._detectorientation();
		this._mouseinit();
		this._calculatenewmax();

		this._addclass( "ui-slider ui-slider-" + this.orientation,
			"ui-widget ui-widget-content" );

		this._refresh();

		this._animateoff = false;
	},

	_refresh: function() {
		this._createrange();
		this._createhandles();
		this._setupevents();
		this._refreshvalue();
	},

	_createhandles: function() {
		var i, handlecount,
			options = this.options,
			existinghandles = this.element.find( ".ui-slider-handle" ),
			handle = "<span tabindex='0'></span>",
			handles = [];

		handlecount = ( options.values && options.values.length ) || 1;

		if ( existinghandles.length > handlecount ) {
			existinghandles.slice( handlecount ).remove();
			existinghandles = existinghandles.slice( 0, handlecount );
		}

		for ( i = existinghandles.length; i < handlecount; i++ ) {
			handles.push( handle );
		}

		this.handles = existinghandles.add( $( handles.join( "" ) ).appendto( this.element ) );

		this._addclass( this.handles, "ui-slider-handle", "ui-state-default" );

		this.handle = this.handles.eq( 0 );

		this.handles.each( function( i ) {
			$( this )
				.data( "ui-slider-handle-index", i )
				.attr( "tabindex", 0 );
		} );
	},

	_createrange: function() {
		var options = this.options;

		if ( options.range ) {
			if ( options.range === true ) {
				if ( !options.values ) {
					options.values = [ this._valuemin(), this._valuemin() ];
				} else if ( options.values.length && options.values.length !== 2 ) {
					options.values = [ options.values[ 0 ], options.values[ 0 ] ];
				} else if ( array.isarray( options.values ) ) {
					options.values = options.values.slice( 0 );
				}
			}

			if ( !this.range || !this.range.length ) {
				this.range = $( "<div>" )
					.appendto( this.element );

				this._addclass( this.range, "ui-slider-range" );
			} else {
				this._removeclass( this.range, "ui-slider-range-min ui-slider-range-max" );

				// handle range switching from true to min/max
				this.range.css( {
					"left": "",
					"bottom": ""
				} );
			}
			if ( options.range === "min" || options.range === "max" ) {
				this._addclass( this.range, "ui-slider-range-" + options.range );
			}
		} else {
			if ( this.range ) {
				this.range.remove();
			}
			this.range = null;
		}
	},

	_setupevents: function() {
		this._off( this.handles );
		this._on( this.handles, this._handleevents );
		this._hoverable( this.handles );
		this._focusable( this.handles );
	},

	_destroy: function() {
		this.handles.remove();
		if ( this.range ) {
			this.range.remove();
		}

		this._mousedestroy();
	},

	_mousecapture: function( event ) {
		var position, normvalue, distance, closesthandle, index, allowed, offset, mouseoverhandle,
			that = this,
			o = this.options;

		if ( o.disabled ) {
			return false;
		}

		this.elementsize = {
			width: this.element.outerwidth(),
			height: this.element.outerheight()
		};
		this.elementoffset = this.element.offset();

		position = { x: event.pagex, y: event.pagey };
		normvalue = this._normvaluefrommouse( position );
		distance = this._valuemax() - this._valuemin() + 1;
		this.handles.each( function( i ) {
			var thisdistance = math.abs( normvalue - that.values( i ) );
			if ( ( distance > thisdistance ) ||
				( distance === thisdistance &&
					( i === that._lastchangedvalue || that.values( i ) === o.min ) ) ) {
				distance = thisdistance;
				closesthandle = $( this );
				index = i;
			}
		} );

		allowed = this._start( event, index );
		if ( allowed === false ) {
			return false;
		}
		this._mousesliding = true;

		this._handleindex = index;

		this._addclass( closesthandle, null, "ui-state-active" );
		closesthandle.trigger( "focus" );

		offset = closesthandle.offset();
		mouseoverhandle = !$( event.target ).parents().addback().is( ".ui-slider-handle" );
		this._clickoffset = mouseoverhandle ? { left: 0, top: 0 } : {
			left: event.pagex - offset.left - ( closesthandle.width() / 2 ),
			top: event.pagey - offset.top -
				( closesthandle.height() / 2 ) -
				( parseint( closesthandle.css( "bordertopwidth" ), 10 ) || 0 ) -
				( parseint( closesthandle.css( "borderbottomwidth" ), 10 ) || 0 ) +
				( parseint( closesthandle.css( "margintop" ), 10 ) || 0 )
		};

		if ( !this.handles.hasclass( "ui-state-hover" ) ) {
			this._slide( event, index, normvalue );
		}
		this._animateoff = true;
		return true;
	},

	_mousestart: function() {
		return true;
	},

	_mousedrag: function( event ) {
		var position = { x: event.pagex, y: event.pagey },
			normvalue = this._normvaluefrommouse( position );

		this._slide( event, this._handleindex, normvalue );

		return false;
	},

	_mousestop: function( event ) {
		this._removeclass( this.handles, null, "ui-state-active" );
		this._mousesliding = false;

		this._stop( event, this._handleindex );
		this._change( event, this._handleindex );

		this._handleindex = null;
		this._clickoffset = null;
		this._animateoff = false;

		return false;
	},

	_detectorientation: function() {
		this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
	},

	_normvaluefrommouse: function( position ) {
		var pixeltotal,
			pixelmouse,
			percentmouse,
			valuetotal,
			valuemouse;

		if ( this.orientation === "horizontal" ) {
			pixeltotal = this.elementsize.width;
			pixelmouse = position.x - this.elementoffset.left -
				( this._clickoffset ? this._clickoffset.left : 0 );
		} else {
			pixeltotal = this.elementsize.height;
			pixelmouse = position.y - this.elementoffset.top -
				( this._clickoffset ? this._clickoffset.top : 0 );
		}

		percentmouse = ( pixelmouse / pixeltotal );
		if ( percentmouse > 1 ) {
			percentmouse = 1;
		}
		if ( percentmouse < 0 ) {
			percentmouse = 0;
		}
		if ( this.orientation === "vertical" ) {
			percentmouse = 1 - percentmouse;
		}

		valuetotal = this._valuemax() - this._valuemin();
		valuemouse = this._valuemin() + percentmouse * valuetotal;

		return this._trimalignvalue( valuemouse );
	},

	_uihash: function( index, value, values ) {
		var uihash = {
			handle: this.handles[ index ],
			handleindex: index,
			value: value !== undefined ? value : this.value()
		};

		if ( this._hasmultiplevalues() ) {
			uihash.value = value !== undefined ? value : this.values( index );
			uihash.values = values || this.values();
		}

		return uihash;
	},

	_hasmultiplevalues: function() {
		return this.options.values && this.options.values.length;
	},

	_start: function( event, index ) {
		return this._trigger( "start", event, this._uihash( index ) );
	},

	_slide: function( event, index, newval ) {
		var allowed, otherval,
			currentvalue = this.value(),
			newvalues = this.values();

		if ( this._hasmultiplevalues() ) {
			otherval = this.values( index ? 0 : 1 );
			currentvalue = this.values( index );

			if ( this.options.values.length === 2 && this.options.range === true ) {
				newval =  index === 0 ? math.min( otherval, newval ) : math.max( otherval, newval );
			}

			newvalues[ index ] = newval;
		}

		if ( newval === currentvalue ) {
			return;
		}

		allowed = this._trigger( "slide", event, this._uihash( index, newval, newvalues ) );

		// a slide can be canceled by returning false from the slide callback
		if ( allowed === false ) {
			return;
		}

		if ( this._hasmultiplevalues() ) {
			this.values( index, newval );
		} else {
			this.value( newval );
		}
	},

	_stop: function( event, index ) {
		this._trigger( "stop", event, this._uihash( index ) );
	},

	_change: function( event, index ) {
		if ( !this._keysliding && !this._mousesliding ) {

			//store the last changed value index for reference when handles overlap
			this._lastchangedvalue = index;
			this._trigger( "change", event, this._uihash( index ) );
		}
	},

	value: function( newvalue ) {
		if ( arguments.length ) {
			this.options.value = this._trimalignvalue( newvalue );
			this._refreshvalue();
			this._change( null, 0 );
			return;
		}

		return this._value();
	},

	values: function( index, newvalue ) {
		var vals,
			newvalues,
			i;

		if ( arguments.length > 1 ) {
			this.options.values[ index ] = this._trimalignvalue( newvalue );
			this._refreshvalue();
			this._change( null, index );
			return;
		}

		if ( arguments.length ) {
			if ( array.isarray( arguments[ 0 ] ) ) {
				vals = this.options.values;
				newvalues = arguments[ 0 ];
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimalignvalue( newvalues[ i ] );
					this._change( null, i );
				}
				this._refreshvalue();
			} else {
				if ( this._hasmultiplevalues() ) {
					return this._values( index );
				} else {
					return this.value();
				}
			}
		} else {
			return this._values();
		}
	},

	_setoption: function( key, value ) {
		var i,
			valslength = 0;

		if ( key === "range" && this.options.range === true ) {
			if ( value === "min" ) {
				this.options.value = this._values( 0 );
				this.options.values = null;
			} else if ( value === "max" ) {
				this.options.value = this._values( this.options.values.length - 1 );
				this.options.values = null;
			}
		}

		if ( array.isarray( this.options.values ) ) {
			valslength = this.options.values.length;
		}

		this._super( key, value );

		switch ( key ) {
			case "orientation":
				this._detectorientation();
				this._removeclass( "ui-slider-horizontal ui-slider-vertical" )
					._addclass( "ui-slider-" + this.orientation );
				this._refreshvalue();
				if ( this.options.range ) {
					this._refreshrange( value );
				}

				// reset positioning from previous orientation
				this.handles.css( value === "horizontal" ? "bottom" : "left", "" );
				break;
			case "value":
				this._animateoff = true;
				this._refreshvalue();
				this._change( null, 0 );
				this._animateoff = false;
				break;
			case "values":
				this._animateoff = true;
				this._refreshvalue();

				// start from the last handle to prevent unreachable handles (#9046)
				for ( i = valslength - 1; i >= 0; i-- ) {
					this._change( null, i );
				}
				this._animateoff = false;
				break;
			case "step":
			case "min":
			case "max":
				this._animateoff = true;
				this._calculatenewmax();
				this._refreshvalue();
				this._animateoff = false;
				break;
			case "range":
				this._animateoff = true;
				this._refresh();
				this._animateoff = false;
				break;
		}
	},

	_setoptiondisabled: function( value ) {
		this._super( value );

		this._toggleclass( null, "ui-state-disabled", !!value );
	},

	//internal value getter
	// _value() returns value trimmed by min and max, aligned by step
	_value: function() {
		var val = this.options.value;
		val = this._trimalignvalue( val );

		return val;
	},

	//internal values getter
	// _values() returns array of values trimmed by min and max, aligned by step
	// _values( index ) returns single value trimmed by min and max, aligned by step
	_values: function( index ) {
		var val,
			vals,
			i;

		if ( arguments.length ) {
			val = this.options.values[ index ];
			val = this._trimalignvalue( val );

			return val;
		} else if ( this._hasmultiplevalues() ) {

			// .slice() creates a copy of the array
			// this copy gets trimmed by min and max and then returned
			vals = this.options.values.slice();
			for ( i = 0; i < vals.length; i += 1 ) {
				vals[ i ] = this._trimalignvalue( vals[ i ] );
			}

			return vals;
		} else {
			return [];
		}
	},

	// returns the step-aligned value that val is closest to, between (inclusive) min and max
	_trimalignvalue: function( val ) {
		if ( val <= this._valuemin() ) {
			return this._valuemin();
		}
		if ( val >= this._valuemax() ) {
			return this._valuemax();
		}
		var step = ( this.options.step > 0 ) ? this.options.step : 1,
			valmodstep = ( val - this._valuemin() ) % step,
			alignvalue = val - valmodstep;

		if ( math.abs( valmodstep ) * 2 >= step ) {
			alignvalue += ( valmodstep > 0 ) ? step : ( -step );
		}

		// since javascript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see #4124)
		return parsefloat( alignvalue.tofixed( 5 ) );
	},

	_calculatenewmax: function() {
		var max = this.options.max,
			min = this._valuemin(),
			step = this.options.step,
			abovemin = math.round( ( max - min ) / step ) * step;
		max = abovemin + min;
		if ( max > this.options.max ) {

			//if max is not divisible by step, rounding off may increase its value
			max -= step;
		}
		this.max = parsefloat( max.tofixed( this._precision() ) );
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

	_valuemin: function() {
		return this.options.min;
	},

	_valuemax: function() {
		return this.max;
	},

	_refreshrange: function( orientation ) {
		if ( orientation === "vertical" ) {
			this.range.css( { "width": "", "left": "" } );
		}
		if ( orientation === "horizontal" ) {
			this.range.css( { "height": "", "bottom": "" } );
		}
	},

	_refreshvalue: function() {
		var lastvalpercent, valpercent, value, valuemin, valuemax,
			orange = this.options.range,
			o = this.options,
			that = this,
			animate = ( !this._animateoff ) ? o.animate : false,
			_set = {};

		if ( this._hasmultiplevalues() ) {
			this.handles.each( function( i ) {
				valpercent = ( that.values( i ) - that._valuemin() ) / ( that._valuemax() -
					that._valuemin() ) * 100;
				_set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valpercent + "%";
				$( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
				if ( that.options.range === true ) {
					if ( that.orientation === "horizontal" ) {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
								left: valpercent + "%"
							}, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( {
								width: ( valpercent - lastvalpercent ) + "%"
							}, {
								queue: false,
								duration: o.animate
							} );
						}
					} else {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
								bottom: ( valpercent ) + "%"
							}, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( {
								height: ( valpercent - lastvalpercent ) + "%"
							}, {
								queue: false,
								duration: o.animate
							} );
						}
					}
				}
				lastvalpercent = valpercent;
			} );
		} else {
			value = this.value();
			valuemin = this._valuemin();
			valuemax = this._valuemax();
			valpercent = ( valuemax !== valuemin ) ?
					( value - valuemin ) / ( valuemax - valuemin ) * 100 :
					0;
			_set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valpercent + "%";
			this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

			if ( orange === "min" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					width: valpercent + "%"
				}, o.animate );
			}
			if ( orange === "max" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					width: ( 100 - valpercent ) + "%"
				}, o.animate );
			}
			if ( orange === "min" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					height: valpercent + "%"
				}, o.animate );
			}
			if ( orange === "max" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					height: ( 100 - valpercent ) + "%"
				}, o.animate );
			}
		}
	},

	_handleevents: {
		keydown: function( event ) {
			var allowed, curval, newval, step,
				index = $( event.target ).data( "ui-slider-handle-index" );

			switch ( event.keycode ) {
				case $.ui.keycode.home:
				case $.ui.keycode.end:
				case $.ui.keycode.page_up:
				case $.ui.keycode.page_down:
				case $.ui.keycode.up:
				case $.ui.keycode.right:
				case $.ui.keycode.down:
				case $.ui.keycode.left:
					event.preventdefault();
					if ( !this._keysliding ) {
						this._keysliding = true;
						this._addclass( $( event.target ), null, "ui-state-active" );
						allowed = this._start( event, index );
						if ( allowed === false ) {
							return;
						}
					}
					break;
			}

			step = this.options.step;
			if ( this._hasmultiplevalues() ) {
				curval = newval = this.values( index );
			} else {
				curval = newval = this.value();
			}

			switch ( event.keycode ) {
				case $.ui.keycode.home:
					newval = this._valuemin();
					break;
				case $.ui.keycode.end:
					newval = this._valuemax();
					break;
				case $.ui.keycode.page_up:
					newval = this._trimalignvalue(
						curval + ( ( this._valuemax() - this._valuemin() ) / this.numpages )
					);
					break;
				case $.ui.keycode.page_down:
					newval = this._trimalignvalue(
						curval - ( ( this._valuemax() - this._valuemin() ) / this.numpages ) );
					break;
				case $.ui.keycode.up:
				case $.ui.keycode.right:
					if ( curval === this._valuemax() ) {
						return;
					}
					newval = this._trimalignvalue( curval + step );
					break;
				case $.ui.keycode.down:
				case $.ui.keycode.left:
					if ( curval === this._valuemin() ) {
						return;
					}
					newval = this._trimalignvalue( curval - step );
					break;
			}

			this._slide( event, index, newval );
		},
		keyup: function( event ) {
			var index = $( event.target ).data( "ui-slider-handle-index" );

			if ( this._keysliding ) {
				this._keysliding = false;
				this._stop( event, index );
				this._change( event, index );
				this._removeclass( $( event.target ), null, "ui-state-active" );
			}
		}
	}
} );

} );


