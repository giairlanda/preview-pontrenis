/*!
 * jquery ui effects highlight 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: highlight effect
//>>group: effects
//>>description: highlights the background of an element in a defined color for a custom duration.
//>>docs: https://api.jqueryui.com/highlight-effect/
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

return $.effects.define( "highlight", "show", function( options, done ) {
	var element = $( this ),
		animation = {
			backgroundcolor: element.css( "backgroundcolor" )
		};

	if ( options.mode === "hide" ) {
		animation.opacity = 0;
	}

	$.effects.savestyle( element );

	element
		.css( {
			backgroundimage: "none",
			backgroundcolor: options.color || "#ffff99"
		} )
		.animate( animation, {
			queue: false,
			duration: options.duration,
			easing: options.easing,
			complete: done
		} );
} );

} );




