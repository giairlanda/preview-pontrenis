/*!
 * jquery ui effects slide 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: slide effect
//>>group: effects
//>>description: slides an element in and out of the viewport.
//>>docs: https://api.jqueryui.com/slide-effect/
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

return $.effects.define( "slide", "show", function( options, done ) {
	var startclip, startref,
		element = $( this ),
		map = {
			up: [ "bottom", "top" ],
			down: [ "top", "bottom" ],
			left: [ "right", "left" ],
			right: [ "left", "right" ]
		},
		mode = options.mode,
		direction = options.direction || "left",
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		positivemotion = ( direction === "up" || direction === "left" ),
		distance = options.distance ||
			element[ ref === "top" ? "outerheight" : "outerwidth" ]( true ),
		animation = {};

	$.effects.createplaceholder( element );

	startclip = element.cssclip();
	startref = element.position()[ ref ];

	// define hide animation
	animation[ ref ] = ( positivemotion ? -1 : 1 ) * distance + startref;
	animation.clip = element.cssclip();
	animation.clip[ map[ direction ][ 1 ] ] = animation.clip[ map[ direction ][ 0 ] ];

	// reverse the animation if we're showing
	if ( mode === "show" ) {
		element.cssclip( animation.clip );
		element.css( ref, animation[ ref ] );
		animation.clip = startclip;
		animation[ ref ] = startref;
	}

	// actually animate
	element.animate( animation, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: done
	} );
} );

} );







