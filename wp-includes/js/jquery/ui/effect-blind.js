/*!
 * jquery ui effects blind 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: blind effect
//>>group: effects
//>>description: blinds the element.
//>>docs: https://api.jqueryui.com/blind-effect/
//>>demos: https://jqueryui.com/effect/

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../version",
			"../effect"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

return $.effects.define( "blind", "hide", function( options, done ) {
	var map = {
			up: [ "bottom", "top" ],
			vertical: [ "bottom", "top" ],
			down: [ "top", "bottom" ],
			left: [ "right", "left" ],
			horizontal: [ "right", "left" ],
			right: [ "left", "right" ]
		},
		element = $( this ),
		direction = options.direction || "up",
		start = element.cssclip(),
		animate = { clip: $.extend( {}, start ) },
		placeholder = $.effects.createplaceholder( element );

	animate.clip[ map[ direction ][ 0 ] ] = animate.clip[ map[ direction ][ 1 ] ];

	if ( options.mode === "show" ) {
		element.cssclip( animate.clip );
		if ( placeholder ) {
			placeholder.css( $.effects.cliptobox( animate ) );
		}

		animate.clip = start;
	}

	if ( placeholder ) {
		placeholder.animate( $.effects.cliptobox( animate ), options.duration, options.easing );
	}

	element.animate( animate, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: done
	} );
} );

} );






