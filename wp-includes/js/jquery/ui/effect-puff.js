/*!
 * jquery ui effects puff 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: puff effect
//>>group: effects
//>>description: creates a puff effect by scaling the element up and hiding it at the same time.
//>>docs: https://api.jqueryui.com/puff-effect/
//>>demos: https://jqueryui.com/effect/

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../version",
			"../effect",
			"./effect-scale"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

return $.effects.define( "puff", "hide", function( options, done ) {
	var newoptions = $.extend( true, {}, options, {
		fade: true,
		percent: parseint( options.percent, 10 ) || 150
	} );

	$.effects.effect.scale.call( this, newoptions, done );
} );

} );



