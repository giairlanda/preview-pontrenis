/*!
 * jquery ui effects 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: effects core
//>>group: effects
/* eslint-disable max-len */
//>>description: extends the internal jquery effects. includes morphing and easing. required by all other effects.
/* eslint-enable max-len */
//>>docs: https://api.jqueryui.com/category/effects-core/
//>>demos: https://jqueryui.com/effect/

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./jquery-var-for-color",
			"./vendor/jquery-color/jquery.color",
			"./version"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

var dataspace = "ui-effects-",
	dataspacestyle = "ui-effects-style",
	dataspaceanimated = "ui-effects-animated";

$.effects = {
	effect: {}
};

/******************************************************************************/
/****************************** class animations ******************************/
/******************************************************************************/
( function() {

var classanimationactions = [ "add", "remove", "toggle" ],
	shorthandstyles = {
		border: 1,
		borderbottom: 1,
		bordercolor: 1,
		borderleft: 1,
		borderright: 1,
		bordertop: 1,
		borderwidth: 1,
		margin: 1,
		padding: 1
	};

$.each(
	[ "borderleftstyle", "borderrightstyle", "borderbottomstyle", "bordertopstyle" ],
	function( _, prop ) {
		$.fx.step[ prop ] = function( fx ) {
			if ( fx.end !== "none" && !fx.setattr || fx.pos === 1 && !fx.setattr ) {
				jquery.style( fx.elem, prop, fx.end );
				fx.setattr = true;
			}
		};
	}
);

function camelcase( string ) {
	return string.replace( /-([\da-z])/gi, function( all, letter ) {
		return letter.touppercase();
	} );
}

function getelementstyles( elem ) {
	var key, len,
		style = elem.ownerdocument.defaultview ?
			elem.ownerdocument.defaultview.getcomputedstyle( elem, null ) :
			elem.currentstyle,
		styles = {};

	if ( style && style.length && style[ 0 ] && style[ style[ 0 ] ] ) {
		len = style.length;
		while ( len-- ) {
			key = style[ len ];
			if ( typeof style[ key ] === "string" ) {
				styles[ camelcase( key ) ] = style[ key ];
			}
		}

	// support: opera, ie <9
	} else {
		for ( key in style ) {
			if ( typeof style[ key ] === "string" ) {
				styles[ key ] = style[ key ];
			}
		}
	}

	return styles;
}

function styledifference( oldstyle, newstyle ) {
	var diff = {},
		name, value;

	for ( name in newstyle ) {
		value = newstyle[ name ];
		if ( oldstyle[ name ] !== value ) {
			if ( !shorthandstyles[ name ] ) {
				if ( $.fx.step[ name ] || !isnan( parsefloat( value ) ) ) {
					diff[ name ] = value;
				}
			}
		}
	}

	return diff;
}

// support: jquery <1.8
if ( !$.fn.addback ) {
	$.fn.addback = function( selector ) {
		return this.add( selector == null ?
			this.prevobject : this.prevobject.filter( selector )
		);
	};
}

$.effects.animateclass = function( value, duration, easing, callback ) {
	var o = $.speed( duration, easing, callback );

	return this.queue( function() {
		var animated = $( this ),
			baseclass = animated.attr( "class" ) || "",
			applyclasschange,
			allanimations = o.children ? animated.find( "*" ).addback() : animated;

		// map the animated objects to store the original styles.
		allanimations = allanimations.map( function() {
			var el = $( this );
			return {
				el: el,
				start: getelementstyles( this )
			};
		} );

		// apply class change
		applyclasschange = function() {
			$.each( classanimationactions, function( i, action ) {
				if ( value[ action ] ) {
					animated[ action + "class" ]( value[ action ] );
				}
			} );
		};
		applyclasschange();

		// map all animated objects again - calculate new styles and diff
		allanimations = allanimations.map( function() {
			this.end = getelementstyles( this.el[ 0 ] );
			this.diff = styledifference( this.start, this.end );
			return this;
		} );

		// apply original class
		animated.attr( "class", baseclass );

		// map all animated objects again - this time collecting a promise
		allanimations = allanimations.map( function() {
			var styleinfo = this,
				dfd = $.deferred(),
				opts = $.extend( {}, o, {
					queue: false,
					complete: function() {
						dfd.resolve( styleinfo );
					}
				} );

			this.el.animate( this.diff, opts );
			return dfd.promise();
		} );

		// once all animations have completed:
		$.when.apply( $, allanimations.get() ).done( function() {

			// set the final class
			applyclasschange();

			// for each animated element,
			// clear all css properties that were animated
			$.each( arguments, function() {
				var el = this.el;
				$.each( this.diff, function( key ) {
					el.css( key, "" );
				} );
			} );

			// this is guarnteed to be there if you use jquery.speed()
			// it also handles dequeuing the next anim...
			o.complete.call( animated[ 0 ] );
		} );
	} );
};

$.fn.extend( {
	addclass: ( function( orig ) {
		return function( classnames, speed, easing, callback ) {
			return speed ?
				$.effects.animateclass.call( this,
					{ add: classnames }, speed, easing, callback ) :
				orig.apply( this, arguments );
		};
	} )( $.fn.addclass ),

	removeclass: ( function( orig ) {
		return function( classnames, speed, easing, callback ) {
			return arguments.length > 1 ?
				$.effects.animateclass.call( this,
					{ remove: classnames }, speed, easing, callback ) :
				orig.apply( this, arguments );
		};
	} )( $.fn.removeclass ),

	toggleclass: ( function( orig ) {
		return function( classnames, force, speed, easing, callback ) {
			if ( typeof force === "boolean" || force === undefined ) {
				if ( !speed ) {

					// without speed parameter
					return orig.apply( this, arguments );
				} else {
					return $.effects.animateclass.call( this,
						( force ? { add: classnames } : { remove: classnames } ),
						speed, easing, callback );
				}
			} else {

				// without force parameter
				return $.effects.animateclass.call( this,
					{ toggle: classnames }, force, speed, easing );
			}
		};
	} )( $.fn.toggleclass ),

	switchclass: function( remove, add, speed, easing, callback ) {
		return $.effects.animateclass.call( this, {
			add: add,
			remove: remove
		}, speed, easing, callback );
	}
} );

} )();

/******************************************************************************/
/*********************************** effects **********************************/
/******************************************************************************/

( function() {

if ( $.expr && $.expr.pseudos && $.expr.pseudos.animated ) {
	$.expr.pseudos.animated = ( function( orig ) {
		return function( elem ) {
			return !!$( elem ).data( dataspaceanimated ) || orig( elem );
		};
	} )( $.expr.pseudos.animated );
}

if ( $.uibackcompat !== false ) {
	$.extend( $.effects, {

		// saves a set of properties in a data storage
		save: function( element, set ) {
			var i = 0, length = set.length;
			for ( ; i < length; i++ ) {
				if ( set[ i ] !== null ) {
					element.data( dataspace + set[ i ], element[ 0 ].style[ set[ i ] ] );
				}
			}
		},

		// restores a set of previously saved properties from a data storage
		restore: function( element, set ) {
			var val, i = 0, length = set.length;
			for ( ; i < length; i++ ) {
				if ( set[ i ] !== null ) {
					val = element.data( dataspace + set[ i ] );
					element.css( set[ i ], val );
				}
			}
		},

		setmode: function( el, mode ) {
			if ( mode === "toggle" ) {
				mode = el.is( ":hidden" ) ? "show" : "hide";
			}
			return mode;
		},

		// wraps the element around a wrapper that copies position properties
		createwrapper: function( element ) {

			// if the element is already wrapped, return it
			if ( element.parent().is( ".ui-effects-wrapper" ) ) {
				return element.parent();
			}

			// wrap the element
			var props = {
					width: element.outerwidth( true ),
					height: element.outerheight( true ),
					"float": element.css( "float" )
				},
				wrapper = $( "<div></div>" )
					.addclass( "ui-effects-wrapper" )
					.css( {
						fontsize: "100%",
						background: "transparent",
						border: "none",
						margin: 0,
						padding: 0
					} ),

				// store the size in case width/height are defined in % - fixes #5245
				size = {
					width: element.width(),
					height: element.height()
				},
				active = document.activeelement;

			// support: firefox
			// firefox incorrectly exposes anonymous content
			// https://bugzilla.mozilla.org/show_bug.cgi?id=561664
			try {
				// eslint-disable-next-line no-unused-expressions
				active.id;
			} catch ( e ) {
				active = document.body;
			}

			element.wrap( wrapper );

			// fixes #7595 - elements lose focus when wrapped.
			if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
				$( active ).trigger( "focus" );
			}

			// hotfix for jquery 1.4 since some change in wrap() seems to actually
			// lose the reference to the wrapped element
			wrapper = element.parent();

			// transfer positioning properties to the wrapper
			if ( element.css( "position" ) === "static" ) {
				wrapper.css( { position: "relative" } );
				element.css( { position: "relative" } );
			} else {
				$.extend( props, {
					position: element.css( "position" ),
					zindex: element.css( "z-index" )
				} );
				$.each( [ "top", "left", "bottom", "right" ], function( i, pos ) {
					props[ pos ] = element.css( pos );
					if ( isnan( parseint( props[ pos ], 10 ) ) ) {
						props[ pos ] = "auto";
					}
				} );
				element.css( {
					position: "relative",
					top: 0,
					left: 0,
					right: "auto",
					bottom: "auto"
				} );
			}
			element.css( size );

			return wrapper.css( props ).show();
		},

		removewrapper: function( element ) {
			var active = document.activeelement;

			if ( element.parent().is( ".ui-effects-wrapper" ) ) {
				element.parent().replacewith( element );

				// fixes #7595 - elements lose focus when wrapped.
				if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
					$( active ).trigger( "focus" );
				}
			}

			return element;
		}
	} );
}

$.extend( $.effects, {
	version: "1.13.3",

	define: function( name, mode, effect ) {
		if ( !effect ) {
			effect = mode;
			mode = "effect";
		}

		$.effects.effect[ name ] = effect;
		$.effects.effect[ name ].mode = mode;

		return effect;
	},

	scaleddimensions: function( element, percent, direction ) {
		if ( percent === 0 ) {
			return {
				height: 0,
				width: 0,
				outerheight: 0,
				outerwidth: 0
			};
		}

		var x = direction !== "horizontal" ? ( ( percent || 100 ) / 100 ) : 1,
			y = direction !== "vertical" ? ( ( percent || 100 ) / 100 ) : 1;

		return {
			height: element.height() * y,
			width: element.width() * x,
			outerheight: element.outerheight() * y,
			outerwidth: element.outerwidth() * x
		};

	},

	cliptobox: function( animation ) {
		return {
			width: animation.clip.right - animation.clip.left,
			height: animation.clip.bottom - animation.clip.top,
			left: animation.clip.left,
			top: animation.clip.top
		};
	},

	// injects recently queued functions to be first in line (after "inprogress")
	unshift: function( element, queuelength, count ) {
		var queue = element.queue();

		if ( queuelength > 1 ) {
			queue.splice.apply( queue,
				[ 1, 0 ].concat( queue.splice( queuelength, count ) ) );
		}
		element.dequeue();
	},

	savestyle: function( element ) {
		element.data( dataspacestyle, element[ 0 ].style.csstext );
	},

	restorestyle: function( element ) {
		element[ 0 ].style.csstext = element.data( dataspacestyle ) || "";
		element.removedata( dataspacestyle );
	},

	mode: function( element, mode ) {
		var hidden = element.is( ":hidden" );

		if ( mode === "toggle" ) {
			mode = hidden ? "show" : "hide";
		}
		if ( hidden ? mode === "hide" : mode === "show" ) {
			mode = "none";
		}
		return mode;
	},

	// translates a [top,left] array into a baseline value
	getbaseline: function( origin, original ) {
		var y, x;

		switch ( origin[ 0 ] ) {
		case "top":
			y = 0;
			break;
		case "middle":
			y = 0.5;
			break;
		case "bottom":
			y = 1;
			break;
		default:
			y = origin[ 0 ] / original.height;
		}

		switch ( origin[ 1 ] ) {
		case "left":
			x = 0;
			break;
		case "center":
			x = 0.5;
			break;
		case "right":
			x = 1;
			break;
		default:
			x = origin[ 1 ] / original.width;
		}

		return {
			x: x,
			y: y
		};
	},

	// creates a placeholder element so that the original element can be made absolute
	createplaceholder: function( element ) {
		var placeholder,
			cssposition = element.css( "position" ),
			position = element.position();

		// lock in margins first to account for form elements, which
		// will change margin if you explicitly set height
		// see: https://jsfiddle.net/jzsmt/3/ https://bugs.webkit.org/show_bug.cgi?id=107380
		// support: safari
		element.css( {
			margintop: element.css( "margintop" ),
			marginbottom: element.css( "marginbottom" ),
			marginleft: element.css( "marginleft" ),
			marginright: element.css( "marginright" )
		} )
		.outerwidth( element.outerwidth() )
		.outerheight( element.outerheight() );

		if ( /^(static|relative)/.test( cssposition ) ) {
			cssposition = "absolute";

			placeholder = $( "<" + element[ 0 ].nodename + ">" ).insertafter( element ).css( {

				// convert inline to inline block to account for inline elements
				// that turn to inline block based on content (like img)
				display: /^(inline|ruby)/.test( element.css( "display" ) ) ?
					"inline-block" :
					"block",
				visibility: "hidden",

				// margins need to be set to account for margin collapse
				margintop: element.css( "margintop" ),
				marginbottom: element.css( "marginbottom" ),
				marginleft: element.css( "marginleft" ),
				marginright: element.css( "marginright" ),
				"float": element.css( "float" )
			} )
			.outerwidth( element.outerwidth() )
			.outerheight( element.outerheight() )
			.addclass( "ui-effects-placeholder" );

			element.data( dataspace + "placeholder", placeholder );
		}

		element.css( {
			position: cssposition,
			left: position.left,
			top: position.top
		} );

		return placeholder;
	},

	removeplaceholder: function( element ) {
		var datakey = dataspace + "placeholder",
				placeholder = element.data( datakey );

		if ( placeholder ) {
			placeholder.remove();
			element.removedata( datakey );
		}
	},

	// removes a placeholder if it exists and restores
	// properties that were modified during placeholder creation
	cleanup: function( element ) {
		$.effects.restorestyle( element );
		$.effects.removeplaceholder( element );
	},

	settransition: function( element, list, factor, value ) {
		value = value || {};
		$.each( list, function( i, x ) {
			var unit = element.cssunit( x );
			if ( unit[ 0 ] > 0 ) {
				value[ x ] = unit[ 0 ] * factor + unit[ 1 ];
			}
		} );
		return value;
	}
} );

// return an effect options object for the given parameters:
function _normalizearguments( effect, options, speed, callback ) {

	// allow passing all options as the first parameter
	if ( $.isplainobject( effect ) ) {
		options = effect;
		effect = effect.effect;
	}

	// convert to an object
	effect = { effect: effect };

	// catch (effect, null, ...)
	if ( options == null ) {
		options = {};
	}

	// catch (effect, callback)
	if ( typeof options === "function" ) {
		callback = options;
		speed = null;
		options = {};
	}

	// catch (effect, speed, ?)
	if ( typeof options === "number" || $.fx.speeds[ options ] ) {
		callback = speed;
		speed = options;
		options = {};
	}

	// catch (effect, options, callback)
	if ( typeof speed === "function" ) {
		callback = speed;
		speed = null;
	}

	// add options to effect
	if ( options ) {
		$.extend( effect, options );
	}

	speed = speed || options.duration;
	effect.duration = $.fx.off ? 0 :
		typeof speed === "number" ? speed :
		speed in $.fx.speeds ? $.fx.speeds[ speed ] :
		$.fx.speeds._default;

	effect.complete = callback || options.complete;

	return effect;
}

function standardanimationoption( option ) {

	// valid standard speeds (nothing, number, named speed)
	if ( !option || typeof option === "number" || $.fx.speeds[ option ] ) {
		return true;
	}

	// invalid strings - treat as "normal" speed
	if ( typeof option === "string" && !$.effects.effect[ option ] ) {
		return true;
	}

	// complete callback
	if ( typeof option === "function" ) {
		return true;
	}

	// options hash (but not naming an effect)
	if ( typeof option === "object" && !option.effect ) {
		return true;
	}

	// didn't match any standard api
	return false;
}

$.fn.extend( {
	effect: function( /* effect, options, speed, callback */ ) {
		var args = _normalizearguments.apply( this, arguments ),
			effectmethod = $.effects.effect[ args.effect ],
			defaultmode = effectmethod.mode,
			queue = args.queue,
			queuename = queue || "fx",
			complete = args.complete,
			mode = args.mode,
			modes = [],
			prefilter = function( next ) {
				var el = $( this ),
					normalizedmode = $.effects.mode( el, mode ) || defaultmode;

				// sentinel for duck-punching the :animated pseudo-selector
				el.data( dataspaceanimated, true );

				// save effect mode for later use,
				// we can't just call $.effects.mode again later,
				// as the .show() below destroys the initial state
				modes.push( normalizedmode );

				// see $.uibackcompat inside of run() for removal of defaultmode in 1.14
				if ( defaultmode && ( normalizedmode === "show" ||
						( normalizedmode === defaultmode && normalizedmode === "hide" ) ) ) {
					el.show();
				}

				if ( !defaultmode || normalizedmode !== "none" ) {
					$.effects.savestyle( el );
				}

				if ( typeof next === "function" ) {
					next();
				}
			};

		if ( $.fx.off || !effectmethod ) {

			// delegate to the original method (e.g., .show()) if possible
			if ( mode ) {
				return this[ mode ]( args.duration, complete );
			} else {
				return this.each( function() {
					if ( complete ) {
						complete.call( this );
					}
				} );
			}
		}

		function run( next ) {
			var elem = $( this );

			function cleanup() {
				elem.removedata( dataspaceanimated );

				$.effects.cleanup( elem );

				if ( args.mode === "hide" ) {
					elem.hide();
				}

				done();
			}

			function done() {
				if ( typeof complete === "function" ) {
					complete.call( elem[ 0 ] );
				}

				if ( typeof next === "function" ) {
					next();
				}
			}

			// override mode option on a per element basis,
			// as toggle can be either show or hide depending on element state
			args.mode = modes.shift();

			if ( $.uibackcompat !== false && !defaultmode ) {
				if ( elem.is( ":hidden" ) ? mode === "hide" : mode === "show" ) {

					// call the core method to track "olddisplay" properly
					elem[ mode ]();
					done();
				} else {
					effectmethod.call( elem[ 0 ], args, done );
				}
			} else {
				if ( args.mode === "none" ) {

					// call the core method to track "olddisplay" properly
					elem[ mode ]();
					done();
				} else {
					effectmethod.call( elem[ 0 ], args, cleanup );
				}
			}
		}

		// run prefilter on all elements first to ensure that
		// any showing or hiding happens before placeholder creation,
		// which ensures that any layout changes are correctly captured.
		return queue === false ?
			this.each( prefilter ).each( run ) :
			this.queue( queuename, prefilter ).queue( queuename, run );
	},

	show: ( function( orig ) {
		return function( option ) {
			if ( standardanimationoption( option ) ) {
				return orig.apply( this, arguments );
			} else {
				var args = _normalizearguments.apply( this, arguments );
				args.mode = "show";
				return this.effect.call( this, args );
			}
		};
	} )( $.fn.show ),

	hide: ( function( orig ) {
		return function( option ) {
			if ( standardanimationoption( option ) ) {
				return orig.apply( this, arguments );
			} else {
				var args = _normalizearguments.apply( this, arguments );
				args.mode = "hide";
				return this.effect.call( this, args );
			}
		};
	} )( $.fn.hide ),

	toggle: ( function( orig ) {
		return function( option ) {
			if ( standardanimationoption( option ) || typeof option === "boolean" ) {
				return orig.apply( this, arguments );
			} else {
				var args = _normalizearguments.apply( this, arguments );
				args.mode = "toggle";
				return this.effect.call( this, args );
			}
		};
	} )( $.fn.toggle ),

	cssunit: function( key ) {
		var style = this.css( key ),
			val = [];

		$.each( [ "em", "px", "%", "pt" ], function( i, unit ) {
			if ( style.indexof( unit ) > 0 ) {
				val = [ parsefloat( style ), unit ];
			}
		} );
		return val;
	},

	cssclip: function( clipobj ) {
		if ( clipobj ) {
			return this.css( "clip", "rect(" + clipobj.top + "px " + clipobj.right + "px " +
				clipobj.bottom + "px " + clipobj.left + "px)" );
		}
		return parseclip( this.css( "clip" ), this );
	},

	transfer: function( options, done ) {
		var element = $( this ),
			target = $( options.to ),
			targetfixed = target.css( "position" ) === "fixed",
			body = $( "body" ),
			fixtop = targetfixed ? body.scrolltop() : 0,
			fixleft = targetfixed ? body.scrollleft() : 0,
			endposition = target.offset(),
			animation = {
				top: endposition.top - fixtop,
				left: endposition.left - fixleft,
				height: target.innerheight(),
				width: target.innerwidth()
			},
			startposition = element.offset(),
			transfer = $( "<div class='ui-effects-transfer'></div>" );

		transfer
			.appendto( "body" )
			.addclass( options.classname )
			.css( {
				top: startposition.top - fixtop,
				left: startposition.left - fixleft,
				height: element.innerheight(),
				width: element.innerwidth(),
				position: targetfixed ? "fixed" : "absolute"
			} )
			.animate( animation, options.duration, options.easing, function() {
				transfer.remove();
				if ( typeof done === "function" ) {
					done();
				}
			} );
	}
} );

function parseclip( str, element ) {
		var outerwidth = element.outerwidth(),
			outerheight = element.outerheight(),
			clipregex = /^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,
			values = clipregex.exec( str ) || [ "", 0, outerwidth, outerheight, 0 ];

		return {
			top: parsefloat( values[ 1 ] ) || 0,
			right: values[ 2 ] === "auto" ? outerwidth : parsefloat( values[ 2 ] ),
			bottom: values[ 3 ] === "auto" ? outerheight : parsefloat( values[ 3 ] ),
			left: parsefloat( values[ 4 ] ) || 0
		};
}

$.fx.step.clip = function( fx ) {
	if ( !fx.clipinit ) {
		fx.start = $( fx.elem ).cssclip();
		if ( typeof fx.end === "string" ) {
			fx.end = parseclip( fx.end, fx.elem );
		}
		fx.clipinit = true;
	}

	$( fx.elem ).cssclip( {
		top: fx.pos * ( fx.end.top - fx.start.top ) + fx.start.top,
		right: fx.pos * ( fx.end.right - fx.start.right ) + fx.start.right,
		bottom: fx.pos * ( fx.end.bottom - fx.start.bottom ) + fx.start.bottom,
		left: fx.pos * ( fx.end.left - fx.start.left ) + fx.start.left
	} );
};

} )();

/******************************************************************************/
/*********************************** easing ***********************************/
/******************************************************************************/

( function() {

// based on easing equations from robert penner (http://robertpenner.com/easing)

var baseeasings = {};

$.each( [ "quad", "cubic", "quart", "quint", "expo" ], function( i, name ) {
	baseeasings[ name ] = function( p ) {
		return math.pow( p, i + 2 );
	};
} );

$.extend( baseeasings, {
	sine: function( p ) {
		return 1 - math.cos( p * math.pi / 2 );
	},
	circ: function( p ) {
		return 1 - math.sqrt( 1 - p * p );
	},
	elastic: function( p ) {
		return p === 0 || p === 1 ? p :
			-math.pow( 2, 8 * ( p - 1 ) ) * math.sin( ( ( p - 1 ) * 80 - 7.5 ) * math.pi / 15 );
	},
	back: function( p ) {
		return p * p * ( 3 * p - 2 );
	},
	bounce: function( p ) {
		var pow2,
			bounce = 4;

		while ( p < ( ( pow2 = math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
		return 1 / math.pow( 4, 3 - bounce ) - 7.5625 * math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
	}
} );

$.each( baseeasings, function( name, easein ) {
	$.easing[ "easein" + name ] = easein;
	$.easing[ "easeout" + name ] = function( p ) {
		return 1 - easein( 1 - p );
	};
	$.easing[ "easeinout" + name ] = function( p ) {
		return p < 0.5 ?
			easein( p * 2 ) / 2 :
			1 - easein( p * -2 + 2 ) / 2;
	};
} );

} )();

return $.effects;

} );








