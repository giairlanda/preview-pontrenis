/*!
 * jquery ui effects drop 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: drop effect
//>>group: effects
//>>description: moves an element in one direction and hides it at the same time.
//>>docs: https://api.jqueryui.com/drop-effect/
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

return $.effects.define( "drop", "hide", function( options, done ) {

	var distance,
		element = $( this ),
		mode = options.mode,
		show = mode === "show",
		direction = options.direction || "left",
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		motion = ( direction === "up" || direction === "left" ) ? "-=" : "+=",
		oppositemotion = ( motion === "+=" ) ? "-=" : "+=",
		animation = {
			opacity: 0
		};

	$.effects.createplaceholder( element );

	distance = options.distance ||
		element[ ref === "top" ? "outerheight" : "outerwidth" ]( true ) / 2;

	animation[ ref ] = motion + distance;

	if ( show ) {
		element.css( animation );

		animation[ ref ] = oppositemotion + distance;
		animation.opacity = 1;
	}

	// animate
	element.animate( animation, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: done
	} );
} );

} );




