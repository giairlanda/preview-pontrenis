/*!
 * jquery ui effects scale 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: scale effect
//>>group: effects
//>>description: grows or shrinks an element and its content.
//>>docs: https://api.jqueryui.com/scale-effect/
//>>demos: https://jqueryui.com/effect/

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../version",
			"../effect",
			"./effect-size"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

return $.effects.define( "scale", function( options, done ) {

	// create element
	var el = $( this ),
		mode = options.mode,
		percent = parseint( options.percent, 10 ) ||
			( parseint( options.percent, 10 ) === 0 ? 0 : ( mode !== "effect" ? 0 : 100 ) ),

		newoptions = $.extend( true, {
			from: $.effects.scaleddimensions( el ),
			to: $.effects.scaleddimensions( el, percent, options.direction || "both" ),
			origin: options.origin || [ "middle", "center" ]
		}, options );

	// fade option to support puff
	if ( options.fade ) {
		newoptions.from.opacity = 1;
		newoptions.to.opacity = 0;
	}

	$.effects.effect.size.call( this, newoptions, done );
} );

} );




