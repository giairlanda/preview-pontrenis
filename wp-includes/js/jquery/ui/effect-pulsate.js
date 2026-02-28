/*!
 * jquery ui effects pulsate 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: pulsate effect
//>>group: effects
//>>description: pulsates an element n times by changing the opacity to zero and back.
//>>docs: https://api.jqueryui.com/pulsate-effect/
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

return $.effects.define( "pulsate", "show", function( options, done ) {
	var element = $( this ),
		mode = options.mode,
		show = mode === "show",
		hide = mode === "hide",
		showhide = show || hide,

		// showing or hiding leaves off the "last" animation
		anims = ( ( options.times || 5 ) * 2 ) + ( showhide ? 1 : 0 ),
		duration = options.duration / anims,
		animateto = 0,
		i = 1,
		queuelen = element.queue().length;

	if ( show || !element.is( ":visible" ) ) {
		element.css( "opacity", 0 ).show();
		animateto = 1;
	}

	// anims - 1 opacity "toggles"
	for ( ; i < anims; i++ ) {
		element.animate( { opacity: animateto }, duration, options.easing );
		animateto = 1 - animateto;
	}

	element.animate( { opacity: animateto }, duration, options.easing );

	element.queue( done );

	$.effects.unshift( element, queuelen, anims + 1 );
} );

} );








