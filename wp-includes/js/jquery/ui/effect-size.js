/*!
 * jquery ui effects size 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: size effect
//>>group: effects
//>>description: resize an element to a specified width and height.
//>>docs: https://api.jqueryui.com/size-effect/
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

return $.effects.define( "size", function( options, done ) {

	// create element
	var baseline, factor, temp,
		element = $( this ),

		// copy for children
		cprops = [ "fontsize" ],
		vprops = [ "bordertopwidth", "borderbottomwidth", "paddingtop", "paddingbottom" ],
		hprops = [ "borderleftwidth", "borderrightwidth", "paddingleft", "paddingright" ],

		// set options
		mode = options.mode,
		restore = mode !== "effect",
		scale = options.scale || "both",
		origin = options.origin || [ "middle", "center" ],
		position = element.css( "position" ),
		pos = element.position(),
		original = $.effects.scaleddimensions( element ),
		from = options.from || original,
		to = options.to || $.effects.scaleddimensions( element, 0 );

	$.effects.createplaceholder( element );

	if ( mode === "show" ) {
		temp = from;
		from = to;
		to = temp;
	}

	// set scaling factor
	factor = {
		from: {
			y: from.height / original.height,
			x: from.width / original.width
		},
		to: {
			y: to.height / original.height,
			x: to.width / original.width
		}
	};

	// scale the css box
	if ( scale === "box" || scale === "both" ) {

		// vertical props scaling
		if ( factor.from.y !== factor.to.y ) {
			from = $.effects.settransition( element, vprops, factor.from.y, from );
			to = $.effects.settransition( element, vprops, factor.to.y, to );
		}

		// horizontal props scaling
		if ( factor.from.x !== factor.to.x ) {
			from = $.effects.settransition( element, hprops, factor.from.x, from );
			to = $.effects.settransition( element, hprops, factor.to.x, to );
		}
	}

	// scale the content
	if ( scale === "content" || scale === "both" ) {

		// vertical props scaling
		if ( factor.from.y !== factor.to.y ) {
			from = $.effects.settransition( element, cprops, factor.from.y, from );
			to = $.effects.settransition( element, cprops, factor.to.y, to );
		}
	}

	// adjust the position properties based on the provided origin points
	if ( origin ) {
		baseline = $.effects.getbaseline( origin, original );
		from.top = ( original.outerheight - from.outerheight ) * baseline.y + pos.top;
		from.left = ( original.outerwidth - from.outerwidth ) * baseline.x + pos.left;
		to.top = ( original.outerheight - to.outerheight ) * baseline.y + pos.top;
		to.left = ( original.outerwidth - to.outerwidth ) * baseline.x + pos.left;
	}
	delete from.outerheight;
	delete from.outerwidth;
	element.css( from );

	// animate the children if desired
	if ( scale === "content" || scale === "both" ) {

		vprops = vprops.concat( [ "margintop", "marginbottom" ] ).concat( cprops );
		hprops = hprops.concat( [ "marginleft", "marginright" ] );

		// only animate children with width attributes specified
		// todo: is this right? should we include anything with css width specified as well
		element.find( "*[width]" ).each( function() {
			var child = $( this ),
				childoriginal = $.effects.scaleddimensions( child ),
				childfrom = {
					height: childoriginal.height * factor.from.y,
					width: childoriginal.width * factor.from.x,
					outerheight: childoriginal.outerheight * factor.from.y,
					outerwidth: childoriginal.outerwidth * factor.from.x
				},
				childto = {
					height: childoriginal.height * factor.to.y,
					width: childoriginal.width * factor.to.x,
					outerheight: childoriginal.height * factor.to.y,
					outerwidth: childoriginal.width * factor.to.x
				};

			// vertical props scaling
			if ( factor.from.y !== factor.to.y ) {
				childfrom = $.effects.settransition( child, vprops, factor.from.y, childfrom );
				childto = $.effects.settransition( child, vprops, factor.to.y, childto );
			}

			// horizontal props scaling
			if ( factor.from.x !== factor.to.x ) {
				childfrom = $.effects.settransition( child, hprops, factor.from.x, childfrom );
				childto = $.effects.settransition( child, hprops, factor.to.x, childto );
			}

			if ( restore ) {
				$.effects.savestyle( child );
			}

			// animate children
			child.css( childfrom );
			child.animate( childto, options.duration, options.easing, function() {

				// restore children
				if ( restore ) {
					$.effects.restorestyle( child );
				}
			} );
		} );
	}

	// animate
	element.animate( to, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: function() {

			var offset = element.offset();

			if ( to.opacity === 0 ) {
				element.css( "opacity", from.opacity );
			}

			if ( !restore ) {
				element
					.css( "position", position === "static" ? "relative" : position )
					.offset( offset );

				// need to save style here so that automatic style restoration
				// doesn't restore to the original styles from before the animation.
				$.effects.savestyle( element );
			}

			done();
		}
	} );

} );

} );


