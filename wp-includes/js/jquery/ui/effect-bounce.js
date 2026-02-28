/*!
 * jquery ui effects bounce 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: bounce effect
//>>group: effects
//>>description: bounces an element horizontally or vertically n times.
//>>docs: https://api.jqueryui.com/bounce-effect/
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

return $.effects.define( "bounce", function( options, done ) {
	var upanim, downanim, refvalue,
		element = $( this ),

		// defaults:
		mode = options.mode,
		hide = mode === "hide",
		show = mode === "show",
		direction = options.direction || "up",
		distance = options.distance,
		times = options.times || 5,

		// number of internal animations
		anims = times * 2 + ( show || hide ? 1 : 0 ),
		speed = options.duration / anims,
		easing = options.easing,

		// utility:
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		motion = ( direction === "up" || direction === "left" ),
		i = 0,

		queuelen = element.queue().length;

	$.effects.createplaceholder( element );

	refvalue = element.css( ref );

	// default distance for the biggest bounce is the outer distance / 3
	if ( !distance ) {
		distance = element[ ref === "top" ? "outerheight" : "outerwidth" ]() / 3;
	}

	if ( show ) {
		downanim = { opacity: 1 };
		downanim[ ref ] = refvalue;

		// if we are showing, force opacity 0 and set the initial position
		// then do the "first" animation
		element
			.css( "opacity", 0 )
			.css( ref, motion ? -distance * 2 : distance * 2 )
			.animate( downanim, speed, easing );
	}

	// start at the smallest distance if we are hiding
	if ( hide ) {
		distance = distance / math.pow( 2, times - 1 );
	}

	downanim = {};
	downanim[ ref ] = refvalue;

	// bounces up/down/left/right then back to 0 -- times * 2 animations happen here
	for ( ; i < times; i++ ) {
		upanim = {};
		upanim[ ref ] = ( motion ? "-=" : "+=" ) + distance;

		element
			.animate( upanim, speed, easing )
			.animate( downanim, speed, easing );

		distance = hide ? distance * 2 : distance / 2;
	}

	// last bounce when hiding
	if ( hide ) {
		upanim = { opacity: 0 };
		upanim[ ref ] = ( motion ? "-=" : "+=" ) + distance;

		element.animate( upanim, speed, easing );
	}

	element.queue( done );

	$.effects.unshift( element, queuelen, anims + 1 );
} );

} );


