/*!
 * jquery ui effects shake 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: shake effect
//>>group: effects
//>>description: shakes an element horizontally or vertically n times.
//>>docs: https://api.jqueryui.com/shake-effect/
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

return $.effects.define( "shake", function( options, done ) {

	var i = 1,
		element = $( this ),
		direction = options.direction || "left",
		distance = options.distance || 20,
		times = options.times || 3,
		anims = times * 2 + 1,
		speed = math.round( options.duration / anims ),
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		positivemotion = ( direction === "up" || direction === "left" ),
		animation = {},
		animation1 = {},
		animation2 = {},

		queuelen = element.queue().length;

	$.effects.createplaceholder( element );

	// animation
	animation[ ref ] = ( positivemotion ? "-=" : "+=" ) + distance;
	animation1[ ref ] = ( positivemotion ? "+=" : "-=" ) + distance * 2;
	animation2[ ref ] = ( positivemotion ? "-=" : "+=" ) + distance * 2;

	// animate
	element.animate( animation, speed, options.easing );

	// shakes
	for ( ; i < times; i++ ) {
		element
			.animate( animation1, speed, options.easing )
			.animate( animation2, speed, options.easing );
	}

	element
		.animate( animation1, speed, options.easing )
		.animate( animation, speed / 2, options.easing )
		.queue( done );

	$.effects.unshift( element, queuelen, anims + 1 );
} );

} );



