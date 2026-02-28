/*! jquery ui - v1.13.3 - 2024-04-26
* https://jqueryui.com
* includes: widget.js, position.js, data.js, disable-selection.js, effect.js, effects/effect-blind.js, effects/effect-bounce.js, effects/effect-clip.js, effects/effect-drop.js, effects/effect-explode.js, effects/effect-fade.js, effects/effect-fold.js, effects/effect-highlight.js, effects/effect-puff.js, effects/effect-pulsate.js, effects/effect-scale.js, effects/effect-shake.js, effects/effect-size.js, effects/effect-slide.js, effects/effect-transfer.js, focusable.js, form-reset-mixin.js, jquery-patch.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets/accordion.js, widgets/autocomplete.js, widgets/button.js, widgets/checkboxradio.js, widgets/controlgroup.js, widgets/datepicker.js, widgets/dialog.js, widgets/draggable.js, widgets/droppable.js, widgets/menu.js, widgets/mouse.js, widgets/progressbar.js, widgets/resizable.js, widgets/selectable.js, widgets/selectmenu.js, widgets/slider.js, widgets/sortable.js, widgets/spinner.js, widgets/tabs.js, widgets/tooltip.js
* copyright jquery foundation and other contributors; licensed mit */
( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [ "jquery" ], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} ( function( $ ) {
"use strict";

// source: version.js
$.ui = $.ui || {};

$.ui.version = "1.13.3";

// source: data.js
/*!
 * jquery ui :data 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: :data selector
//>>group: core
//>>description: selects elements which have data stored under the specified key.
//>>docs: https://api.jqueryui.com/data-selector/

$.extend( $.expr.pseudos, {
	data: $.expr.createpseudo ?
		$.expr.createpseudo( function( dataname ) {
			return function( elem ) {
				return !!$.data( elem, dataname );
			};
		} ) :

		// support: jquery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		}
} );

// source: disable-selection.js
/*!
 * jquery ui disable selection 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: disableselection
//>>group: core
//>>description: disable selection of text content within the set of matched elements.
//>>docs: https://api.jqueryui.com/disableselection/

// this file is deprecated
$.fn.extend( {
	disableselection: ( function() {
		var eventtype = "onselectstart" in document.createelement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.on( eventtype + ".ui-disableselection", function( event ) {
				event.preventdefault();
			} );
		};
	} )(),

	enableselection: function() {
		return this.off( ".ui-disableselection" );
	}
} );

// source: focusable.js
/*!
 * jquery ui focusable 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: :focusable selector
//>>group: core
//>>description: selects elements which can be focused.
//>>docs: https://api.jqueryui.com/focusable-selector/

// selectors
$.ui.focusable = function( element, hastabindex ) {
	var map, mapname, img, focusableifvisible, fieldset,
		nodename = element.nodename.tolowercase();

	if ( "area" === nodename ) {
		map = element.parentnode;
		mapname = map.name;
		if ( !element.href || !mapname || map.nodename.tolowercase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapname + "']" );
		return img.length > 0 && img.is( ":visible" );
	}

	if ( /^(input|select|textarea|button|object)$/.test( nodename ) ) {
		focusableifvisible = !element.disabled;

		if ( focusableifvisible ) {

			// form controls within a disabled fieldset are disabled.
			// however, controls within the fieldset's legend do not get disabled.
			// since controls generally aren't placed inside legends, we skip
			// this portion of the check.
			fieldset = $( element ).closest( "fieldset" )[ 0 ];
			if ( fieldset ) {
				focusableifvisible = !fieldset.disabled;
			}
		}
	} else if ( "a" === nodename ) {
		focusableifvisible = element.href || hastabindex;
	} else {
		focusableifvisible = hastabindex;
	}

	return focusableifvisible && $( element ).is( ":visible" ) && visible( $( element ) );
};

// support: ie 8 only
// ie 8 doesn't resolve inherit to visible/hidden for computed values
function visible( element ) {
	var visibility = element.css( "visibility" );
	while ( visibility === "inherit" ) {
		element = element.parent();
		visibility = element.css( "visibility" );
	}
	return visibility === "visible";
}

$.extend( $.expr.pseudos, {
	focusable: function( element ) {
		return $.ui.focusable( element, $.attr( element, "tabindex" ) != null );
	}
} );

// support: ie8 only
// ie8 does not support the form attribute and when it is supplied. it overwrites the form prop
// with a string, so we need to find the proper form.
$.fn._form = function() {
	return typeof this[ 0 ].form === "string" ? this.closest( "form" ) : $( this[ 0 ].form );
};

// source: form-reset-mixin.js
/*!
 * jquery ui form reset mixin 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: form reset mixin
//>>group: core
//>>description: refresh input widgets when their form is reset
//>>docs: https://api.jqueryui.com/form-reset-mixin/

$.ui.formresetmixin = {
	_formresethandler: function() {
		var form = $( this );

		// wait for the form reset to actually happen before refreshing
		settimeout( function() {
			var instances = form.data( "ui-form-reset-instances" );
			$.each( instances, function() {
				this.refresh();
			} );
		} );
	},

	_bindformresethandler: function() {
		this.form = this.element._form();
		if ( !this.form.length ) {
			return;
		}

		var instances = this.form.data( "ui-form-reset-instances" ) || [];
		if ( !instances.length ) {

			// we don't use _on() here because we use a single event handler per form
			this.form.on( "reset.ui-form-reset", this._formresethandler );
		}
		instances.push( this );
		this.form.data( "ui-form-reset-instances", instances );
	},

	_unbindformresethandler: function() {
		if ( !this.form.length ) {
			return;
		}

		var instances = this.form.data( "ui-form-reset-instances" );
		instances.splice( $.inarray( this, instances ), 1 );
		if ( instances.length ) {
			this.form.data( "ui-form-reset-instances", instances );
		} else {
			this.form
				.removedata( "ui-form-reset-instances" )
				.off( "reset.ui-form-reset" );
		}
	}
};

// source: ie.js
// this file is deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.useragent.tolowercase() );

// source: jquery-patch.js
/*!
 * jquery ui support for jquery core 1.8.x and newer 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 *
 */

//>>label: jquery 1.8+ support
//>>group: core
//>>description: support version 1.8.x and newer of jquery core

// support: jquery 1.9.x or older
// $.expr[ ":" ] is deprecated.
if ( !$.expr.pseudos ) {
	$.expr.pseudos = $.expr[ ":" ];
}

// support: jquery 1.11.x or older
// $.unique has been renamed to $.uniquesort
if ( !$.uniquesort ) {
	$.uniquesort = $.unique;
}

// support: jquery 2.2.x or older.
// this method has been defined in jquery 3.0.0.
// code from https://github.com/jquery/jquery/blob/e539bac79e666bba95bba86d690b4e609dca2286/src/selector/escapeselector.js
if ( !$.escapeselector ) {

	// css string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uffff\w-]/g;

	var fcssescape = function( ch, ascodepoint ) {
		if ( ascodepoint ) {

			// u+0000 null becomes u+fffd replacement character
			if ( ch === "\0" ) {
				return "\ufffd";
			}

			// control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charcodeat( ch.length - 1 ).tostring( 16 ) + " ";
		}

		// other potentially-special ascii characters get backslash-escaped
		return "\\" + ch;
	};

	$.escapeselector = function( sel ) {
		return ( sel + "" ).replace( rcssescape, fcssescape );
	};
}

// support: jquery 3.4.x or older
// these methods have been defined in jquery 3.5.0.
if ( !$.fn.even || !$.fn.odd ) {
	$.fn.extend( {
		even: function() {
			return this.filter( function( i ) {
				return i % 2 === 0;
			} );
		},
		odd: function() {
			return this.filter( function( i ) {
				return i % 2 === 1;
			} );
		}
	} );
}

// source: keycode.js
/*!
 * jquery ui keycode 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: keycode
//>>group: core
//>>description: provide keycodes as keynames
//>>docs: https://api.jqueryui.com/jquery.ui.keycode/

$.ui.keycode = {
	backspace: 8,
	comma: 188,
	delete: 46,
	down: 40,
	end: 35,
	enter: 13,
	escape: 27,
	home: 36,
	left: 37,
	page_down: 34,
	page_up: 33,
	period: 190,
	right: 39,
	space: 32,
	tab: 9,
	up: 38
};

// source: labels.js
/*!
 * jquery ui labels 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: labels
//>>group: core
//>>description: find all the labels associated with a given input
//>>docs: https://api.jqueryui.com/labels/

$.fn.labels = function() {
	var ancestor, selector, id, labels, ancestors;

	if ( !this.length ) {
		return this.pushstack( [] );
	}

	// check control.labels first
	if ( this[ 0 ].labels && this[ 0 ].labels.length ) {
		return this.pushstack( this[ 0 ].labels );
	}

	// support: ie <= 11, ff <= 37, android <= 2.3 only
	// above browsers do not support control.labels. everything below is to support them
	// as well as document fragments. control.labels does not work on document fragments
	labels = this.eq( 0 ).parents( "label" );

	// look for the label based on the id
	id = this.attr( "id" );
	if ( id ) {

		// we don't search against the document in case the element
		// is disconnected from the dom
		ancestor = this.eq( 0 ).parents().last();

		// get a full set of top level ancestors
		ancestors = ancestor.add( ancestor.length ? ancestor.siblings() : this.siblings() );

		// create a selector for the label based on the id
		selector = "label[for='" + $.escapeselector( id ) + "']";

		labels = labels.add( ancestors.find( selector ).addback( selector ) );

	}

	// return whatever we have found for labels
	return this.pushstack( labels );
};

// source: plugin.js
// $.ui.plugin is deprecated. use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowdisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowdisconnected && ( !instance.element[ 0 ].parentnode ||
				instance.element[ 0 ].parentnode.nodetype === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};

// source: position.js
/*!
 * jquery ui position 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 *
 * https://api.jqueryui.com/position/
 */

//>>label: position
//>>group: core
//>>description: positions elements relative to other elements.
//>>docs: https://api.jqueryui.com/position/
//>>demos: https://jqueryui.com/position/

( function() {
var cachedscrollbarwidth,
	max = math.max,
	abs = math.abs,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getoffsets( offsets, width, height ) {
	return [
		parsefloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parsefloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parsecss( element, property ) {
	return parseint( $.css( element, property ), 10 ) || 0;
}

function iswindow( obj ) {
	return obj != null && obj === obj.window;
}

function getdimensions( elem ) {
	var raw = elem[ 0 ];
	if ( raw.nodetype === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( iswindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrolltop(), left: elem.scrollleft() }
		};
	}
	if ( raw.preventdefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pagey, left: raw.pagex }
		};
	}
	return {
		width: elem.outerwidth(),
		height: elem.outerheight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarwidth: function() {
		if ( cachedscrollbarwidth !== undefined ) {
			return cachedscrollbarwidth;
		}
		var w1, w2,
			div = $( "<div style=" +
				"'display:block;position:absolute;width:200px;height:200px;overflow:hidden;'>" +
				"<div style='height:300px;width:auto;'></div></div>" ),
			innerdiv = div.children()[ 0 ];

		$( "body" ).append( div );
		w1 = innerdiv.offsetwidth;
		div.css( "overflow", "scroll" );

		w2 = innerdiv.offsetwidth;

		if ( w1 === w2 ) {
			w2 = div[ 0 ].clientwidth;
		}

		div.remove();

		return ( cachedscrollbarwidth = w1 - w2 );
	},
	getscrollinfo: function( within ) {
		var overflowx = within.iswindow || within.isdocument ? "" :
				within.element.css( "overflow-x" ),
			overflowy = within.iswindow || within.isdocument ? "" :
				within.element.css( "overflow-y" ),
			hasoverflowx = overflowx === "scroll" ||
				( overflowx === "auto" && within.width < within.element[ 0 ].scrollwidth ),
			hasoverflowy = overflowy === "scroll" ||
				( overflowy === "auto" && within.height < within.element[ 0 ].scrollheight );
		return {
			width: hasoverflowy ? $.position.scrollbarwidth() : 0,
			height: hasoverflowx ? $.position.scrollbarwidth() : 0
		};
	},
	getwithininfo: function( element ) {
		var withinelement = $( element || window ),
			iselemwindow = iswindow( withinelement[ 0 ] ),
			isdocument = !!withinelement[ 0 ] && withinelement[ 0 ].nodetype === 9,
			hasoffset = !iselemwindow && !isdocument;
		return {
			element: withinelement,
			iswindow: iselemwindow,
			isdocument: isdocument,
			offset: hasoffset ? $( element ).offset() : { left: 0, top: 0 },
			scrollleft: withinelement.scrollleft(),
			scrolltop: withinelement.scrolltop(),
			width: withinelement.outerwidth(),
			height: withinelement.outerheight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atoffset, targetwidth, targetheight, targetoffset, baseposition, dimensions,

		// make sure string options are treated as css selectors
		target = typeof options.of === "string" ?
			$( document ).find( options.of ) :
			$( options.of ),

		within = $.position.getwithininfo( options.within ),
		scrollinfo = $.position.getscrollinfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getdimensions( target );
	if ( target[ 0 ].preventdefault ) {

		// force left top to allow flipping
		options.at = "left top";
	}
	targetwidth = dimensions.width;
	targetheight = dimensions.height;
	targetoffset = dimensions.offset;

	// clone to reuse original targetoffset later
	baseposition = $.extend( {}, targetoffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontaloffset,
			verticaloffset;

		if ( pos.length === 1 ) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontaloffset = roffset.exec( pos[ 0 ] );
		verticaloffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontaloffset ? horizontaloffset[ 0 ] : 0,
			verticaloffset ? verticaloffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	} );

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		baseposition.left += targetwidth;
	} else if ( options.at[ 0 ] === "center" ) {
		baseposition.left += targetwidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		baseposition.top += targetheight;
	} else if ( options.at[ 1 ] === "center" ) {
		baseposition.top += targetheight / 2;
	}

	atoffset = getoffsets( offsets.at, targetwidth, targetheight );
	baseposition.left += atoffset[ 0 ];
	baseposition.top += atoffset[ 1 ];

	return this.each( function() {
		var collisionposition, using,
			elem = $( this ),
			elemwidth = elem.outerwidth(),
			elemheight = elem.outerheight(),
			marginleft = parsecss( this, "marginleft" ),
			margintop = parsecss( this, "margintop" ),
			collisionwidth = elemwidth + marginleft + parsecss( this, "marginright" ) +
				scrollinfo.width,
			collisionheight = elemheight + margintop + parsecss( this, "marginbottom" ) +
				scrollinfo.height,
			position = $.extend( {}, baseposition ),
			myoffset = getoffsets( offsets.my, elem.outerwidth(), elem.outerheight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemwidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemwidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemheight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemheight / 2;
		}

		position.left += myoffset[ 0 ];
		position.top += myoffset[ 1 ];

		collisionposition = {
			marginleft: marginleft,
			margintop: margintop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetwidth: targetwidth,
					targetheight: targetheight,
					elemwidth: elemwidth,
					elemheight: elemheight,
					collisionposition: collisionposition,
					collisionwidth: collisionwidth,
					collisionheight: collisionheight,
					offset: [ atoffset[ 0 ] + myoffset[ 0 ], atoffset [ 1 ] + myoffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				} );
			}
		} );

		if ( options.using ) {

			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetoffset.left - position.left,
					right = left + targetwidth - elemwidth,
					top = targetoffset.top - position.top,
					bottom = top + targetheight - elemheight,
					feedback = {
						target: {
							element: target,
							left: targetoffset.left,
							top: targetoffset.top,
							width: targetwidth,
							height: targetheight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemwidth,
							height: elemheight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetwidth < elemwidth && abs( left + right ) < targetwidth ) {
					feedback.horizontal = "center";
				}
				if ( targetheight < elemheight && abs( top + bottom ) < targetheight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	} );
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinoffset = within.iswindow ? within.scrollleft : within.offset.left,
				outerwidth = within.width,
				collisionposleft = position.left - data.collisionposition.marginleft,
				overleft = withinoffset - collisionposleft,
				overright = collisionposleft + data.collisionwidth - outerwidth - withinoffset,
				newoverright;

			// element is wider than within
			if ( data.collisionwidth > outerwidth ) {

				// element is initially over the left side of within
				if ( overleft > 0 && overright <= 0 ) {
					newoverright = position.left + overleft + data.collisionwidth - outerwidth -
						withinoffset;
					position.left += overleft - newoverright;

				// element is initially over right side of within
				} else if ( overright > 0 && overleft <= 0 ) {
					position.left = withinoffset;

				// element is initially over both left and right sides of within
				} else {
					if ( overleft > overright ) {
						position.left = withinoffset + outerwidth - data.collisionwidth;
					} else {
						position.left = withinoffset;
					}
				}

			// too far left -> align with left edge
			} else if ( overleft > 0 ) {
				position.left += overleft;

			// too far right -> align with right edge
			} else if ( overright > 0 ) {
				position.left -= overright;

			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionposleft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinoffset = within.iswindow ? within.scrolltop : within.offset.top,
				outerheight = data.within.height,
				collisionpostop = position.top - data.collisionposition.margintop,
				overtop = withinoffset - collisionpostop,
				overbottom = collisionpostop + data.collisionheight - outerheight - withinoffset,
				newoverbottom;

			// element is taller than within
			if ( data.collisionheight > outerheight ) {

				// element is initially over the top of within
				if ( overtop > 0 && overbottom <= 0 ) {
					newoverbottom = position.top + overtop + data.collisionheight - outerheight -
						withinoffset;
					position.top += overtop - newoverbottom;

				// element is initially over bottom of within
				} else if ( overbottom > 0 && overtop <= 0 ) {
					position.top = withinoffset;

				// element is initially over both top and bottom of within
				} else {
					if ( overtop > overbottom ) {
						position.top = withinoffset + outerheight - data.collisionheight;
					} else {
						position.top = withinoffset;
					}
				}

			// too far up -> align with top
			} else if ( overtop > 0 ) {
				position.top += overtop;

			// too far down -> align with bottom edge
			} else if ( overbottom > 0 ) {
				position.top -= overbottom;

			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionpostop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinoffset = within.offset.left + within.scrollleft,
				outerwidth = within.width,
				offsetleft = within.iswindow ? within.scrollleft : within.offset.left,
				collisionposleft = position.left - data.collisionposition.marginleft,
				overleft = collisionposleft - offsetleft,
				overright = collisionposleft + data.collisionwidth - outerwidth - offsetleft,
				myoffset = data.my[ 0 ] === "left" ?
					-data.elemwidth :
					data.my[ 0 ] === "right" ?
						data.elemwidth :
						0,
				atoffset = data.at[ 0 ] === "left" ?
					data.targetwidth :
					data.at[ 0 ] === "right" ?
						-data.targetwidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newoverright,
				newoverleft;

			if ( overleft < 0 ) {
				newoverright = position.left + myoffset + atoffset + offset + data.collisionwidth -
					outerwidth - withinoffset;
				if ( newoverright < 0 || newoverright < abs( overleft ) ) {
					position.left += myoffset + atoffset + offset;
				}
			} else if ( overright > 0 ) {
				newoverleft = position.left - data.collisionposition.marginleft + myoffset +
					atoffset + offset - offsetleft;
				if ( newoverleft > 0 || abs( newoverleft ) < overright ) {
					position.left += myoffset + atoffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinoffset = within.offset.top + within.scrolltop,
				outerheight = within.height,
				offsettop = within.iswindow ? within.scrolltop : within.offset.top,
				collisionpostop = position.top - data.collisionposition.margintop,
				overtop = collisionpostop - offsettop,
				overbottom = collisionpostop + data.collisionheight - outerheight - offsettop,
				top = data.my[ 1 ] === "top",
				myoffset = top ?
					-data.elemheight :
					data.my[ 1 ] === "bottom" ?
						data.elemheight :
						0,
				atoffset = data.at[ 1 ] === "top" ?
					data.targetheight :
					data.at[ 1 ] === "bottom" ?
						-data.targetheight :
						0,
				offset = -2 * data.offset[ 1 ],
				newovertop,
				newoverbottom;
			if ( overtop < 0 ) {
				newoverbottom = position.top + myoffset + atoffset + offset + data.collisionheight -
					outerheight - withinoffset;
				if ( newoverbottom < 0 || newoverbottom < abs( overtop ) ) {
					position.top += myoffset + atoffset + offset;
				}
			} else if ( overbottom > 0 ) {
				newovertop = position.top - data.collisionposition.margintop + myoffset + atoffset +
					offset - offsettop;
				if ( newovertop > 0 || abs( newovertop ) < overbottom ) {
					position.top += myoffset + atoffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

} )();

// source: safe-active-element.js
$.ui.safeactiveelement = function( document ) {
	var activeelement;

	// support: ie 9 only
	// ie9 throws an "unspecified error" accessing document.activeelement from an <iframe>
	try {
		activeelement = document.activeelement;
	} catch ( error ) {
		activeelement = document.body;
	}

	// support: ie 9 - 11 only
	// ie may return null instead of an element
	// interestingly, this only seems to occur when not in an iframe
	if ( !activeelement ) {
		activeelement = document.body;
	}

	// support: ie 11 only
	// ie11 returns a seemingly empty object in some cases when accessing
	// document.activeelement from an <iframe>
	if ( !activeelement.nodename ) {
		activeelement = document.body;
	}

	return activeelement;
};

// source: safe-blur.js
$.ui.safeblur = function( element ) {

	// support: ie9 - 10 only
	// if the <body> is blurred, ie will switch windows, see #9420
	if ( element && element.nodename.tolowercase() !== "body" ) {
		$( element ).trigger( "blur" );
	}
};

// source: scroll-parent.js
/*!
 * jquery ui scroll parent 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: scrollparent
//>>group: core
//>>description: get the closest ancestor element that is scrollable.
//>>docs: https://api.jqueryui.com/scrollparent/

$.fn.scrollparent = function( includehidden ) {
	var position = this.css( "position" ),
		excludestaticparent = position === "absolute",
		overflowregex = includehidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
		scrollparent = this.parents().filter( function() {
			var parent = $( this );
			if ( excludestaticparent && parent.css( "position" ) === "static" ) {
				return false;
			}
			return overflowregex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) +
				parent.css( "overflow-x" ) );
		} ).eq( 0 );

	return position === "fixed" || !scrollparent.length ?
		$( this[ 0 ].ownerdocument || document ) :
		scrollparent;
};

// source: tabbable.js
/*!
 * jquery ui tabbable 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: :tabbable selector
//>>group: core
//>>description: selects elements which can be tabbed to.
//>>docs: https://api.jqueryui.com/tabbable-selector/

$.extend( $.expr.pseudos, {
	tabbable: function( element ) {
		var tabindex = $.attr( element, "tabindex" ),
			hastabindex = tabindex != null;
		return ( !hastabindex || tabindex >= 0 ) && $.ui.focusable( element, hastabindex );
	}
} );

// source: unique-id.js
/*!
 * jquery ui unique id 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: uniqueid
//>>group: core
//>>description: functions to generate and remove uniqueid's
//>>docs: https://api.jqueryui.com/uniqueid/

$.fn.extend( {
	uniqueid: ( function() {
		var uuid = 0;

		return function() {
			return this.each( function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			} );
		};
	} )(),

	removeuniqueid: function() {
		return this.each( function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeattr( "id" );
			}
		} );
	}
} );

// source: widget.js
/*!
 * jquery ui widget 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: widget
//>>group: core
//>>description: provides a factory for creating stateful widgets with a common api.
//>>docs: https://api.jqueryui.com/jquery.widget/
//>>demos: https://jqueryui.com/widget/

var widgetuuid = 0;
var widgethasownproperty = array.prototype.hasownproperty;
var widgetslice = array.prototype.slice;

$.cleandata = ( function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; ( elem = elems[ i ] ) != null; i++ ) {

			// only trigger remove when necessary to save time
			events = $._data( elem, "events" );
			if ( events && events.remove ) {
				$( elem ).triggerhandler( "remove" );
			}
		}
		orig( elems );
	};
} )( $.cleandata );

$.widget = function( name, base, prototype ) {
	var existingconstructor, constructor, baseprototype;

	// proxiedprototype allows the provided prototype to remain unmodified
	// so that it can be used as a mixin for multiple widgets (#8876)
	var proxiedprototype = {};

	var namespace = name.split( "." )[ 0 ];
	name = name.split( "." )[ 1 ];
	var fullname = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.widget;
	}

	if ( array.isarray( prototype ) ) {
		prototype = $.extend.apply( null, [ {} ].concat( prototype ) );
	}

	// create selector for plugin
	$.expr.pseudos[ fullname.tolowercase() ] = function( elem ) {
		return !!$.data( elem, fullname );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingconstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {

		// allow instantiation without "new" keyword
		if ( !this || !this._createwidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createwidget( options, element );
		}
	};

	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingconstructor, {
		version: prototype.version,

		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),

		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childconstructors: []
	} );

	baseprototype = new base();

	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	baseprototype.options = $.widget.extend( {}, baseprototype.options );
	$.each( prototype, function( prop, value ) {
		if ( typeof value !== "function" ) {
			proxiedprototype[ prop ] = value;
			return;
		}
		proxiedprototype[ prop ] = ( function() {
			function _super() {
				return base.prototype[ prop ].apply( this, arguments );
			}

			function _superapply( args ) {
				return base.prototype[ prop ].apply( this, args );
			}

			return function() {
				var __super = this._super;
				var __superapply = this._superapply;
				var returnvalue;

				this._super = _super;
				this._superapply = _superapply;

				returnvalue = value.apply( this, arguments );

				this._super = __super;
				this._superapply = __superapply;

				return returnvalue;
			};
		} )();
	} );
	constructor.prototype = $.widget.extend( baseprototype, {

		// todo: remove support for widgeteventprefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't dom-based
		widgeteventprefix: existingconstructor ? ( baseprototype.widgeteventprefix || name ) : name
	}, proxiedprototype, {
		constructor: constructor,
		namespace: namespace,
		widgetname: name,
		widgetfullname: fullname
	} );

	// if this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. we're essentially trying to replace one
	// level in the prototype chain.
	if ( existingconstructor ) {
		$.each( existingconstructor._childconstructors, function( i, child ) {
			var childprototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childprototype.namespace + "." + childprototype.widgetname, constructor,
				child._proto );
		} );

		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingconstructor._childconstructors;
	} else {
		base._childconstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widgetslice.call( arguments, 1 );
	var inputindex = 0;
	var inputlength = input.length;
	var key;
	var value;

	for ( ; inputindex < inputlength; inputindex++ ) {
		for ( key in input[ inputindex ] ) {
			value = input[ inputindex ][ key ];
			if ( widgethasownproperty.call( input[ inputindex ], key ) && value !== undefined ) {

				// clone objects
				if ( $.isplainobject( value ) ) {
					target[ key ] = $.isplainobject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :

						// don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );

				// copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullname = object.prototype.widgetfullname || name;
	$.fn[ name ] = function( options ) {
		var ismethodcall = typeof options === "string";
		var args = widgetslice.call( arguments, 1 );
		var returnvalue = this;

		if ( ismethodcall ) {

			// if this is an empty collection, we need to have the instance method
			// return undefined instead of the jquery instance
			if ( !this.length && options === "instance" ) {
				returnvalue = undefined;
			} else {
				this.each( function() {
					var methodvalue;
					var instance = $.data( this, fullname );

					if ( options === "instance" ) {
						returnvalue = instance;
						return false;
					}

					if ( !instance ) {
						return $.error( "cannot call methods on " + name +
							" prior to initialization; " +
							"attempted to call method '" + options + "'" );
					}

					if ( typeof instance[ options ] !== "function" ||
						options.charat( 0 ) === "_" ) {
						return $.error( "no such method '" + options + "' for " + name +
							" widget instance" );
					}

					methodvalue = instance[ options ].apply( instance, args );

					if ( methodvalue !== instance && methodvalue !== undefined ) {
						returnvalue = methodvalue && methodvalue.jquery ?
							returnvalue.pushstack( methodvalue.get() ) :
							methodvalue;
						return false;
					}
				} );
			}
		} else {

			// allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat( args ) );
			}

			this.each( function() {
				var instance = $.data( this, fullname );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullname, new object( options, this ) );
				}
			} );
		}

		return returnvalue;
	};
};

$.widget = function( /* options, element */ ) {};
$.widget._childconstructors = [];

$.widget.prototype = {
	widgetname: "widget",
	widgeteventprefix: "",
	defaultelement: "<div>",

	options: {
		classes: {},
		disabled: false,

		// callbacks
		create: null
	},

	_createwidget: function( options, element ) {
		element = $( element || this.defaultelement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widgetuuid++;
		this.eventnamespace = "." + this.widgetname + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();
		this.classeselementlookup = {};

		if ( element !== this ) {
			$.data( element, this.widgetfullname, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			} );
			this.document = $( element.style ?

				// element within the document
				element.ownerdocument :

				// element is window or document
				element.document || element );
			this.window = $( this.document[ 0 ].defaultview || this.document[ 0 ].parentwindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getcreateoptions(),
			options );

		this._create();

		if ( this.options.disabled ) {
			this._setoptiondisabled( this.options.disabled );
		}

		this._trigger( "create", null, this._getcreateeventdata() );
		this._init();
	},

	_getcreateoptions: function() {
		return {};
	},

	_getcreateeventdata: $.noop,

	_create: $.noop,

	_init: $.noop,

	destroy: function() {
		var that = this;

		this._destroy();
		$.each( this.classeselementlookup, function( key, value ) {
			that._removeclass( value, key );
		} );

		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.off( this.eventnamespace )
			.removedata( this.widgetfullname );
		this.widget()
			.off( this.eventnamespace )
			.removeattr( "aria-disabled" );

		// clean up events and states
		this.bindings.off( this.eventnamespace );
	},

	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;
		var parts;
		var curoption;
		var i;

		if ( arguments.length === 0 ) {

			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {

			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curoption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curoption[ parts[ i ] ] = curoption[ parts[ i ] ] || {};
					curoption = curoption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curoption[ key ] === undefined ? null : curoption[ key ];
				}
				curoption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setoptions( options );

		return this;
	},

	_setoptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setoption( key, options[ key ] );
		}

		return this;
	},

	_setoption: function( key, value ) {
		if ( key === "classes" ) {
			this._setoptionclasses( value );
		}

		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this._setoptiondisabled( value );
		}

		return this;
	},

	_setoptionclasses: function( value ) {
		var classkey, elements, currentelements;

		for ( classkey in value ) {
			currentelements = this.classeselementlookup[ classkey ];
			if ( value[ classkey ] === this.options.classes[ classkey ] ||
					!currentelements ||
					!currentelements.length ) {
				continue;
			}

			// we are doing this to create a new jquery object because the _removeclass() call
			// on the next line is going to destroy the reference to the current elements being
			// tracked. we need to save a copy of this collection so that we can add the new classes
			// below.
			elements = $( currentelements.get() );
			this._removeclass( currentelements, classkey );

			// we don't use _addclass() here, because that uses this.options.classes
			// for generating the string of classes. we want to use the value passed in from
			// _setoption(), this is the new value of the classes option which was passed to
			// _setoption(). we pass this value directly to _classes().
			elements.addclass( this._classes( {
				element: elements,
				keys: classkey,
				classes: value,
				add: true
			} ) );
		}
	},

	_setoptiondisabled: function( value ) {
		this._toggleclass( this.widget(), this.widgetfullname + "-disabled", null, !!value );

		// if the widget is becoming disabled, then nothing is interactive
		if ( value ) {
			this._removeclass( this.hoverable, null, "ui-state-hover" );
			this._removeclass( this.focusable, null, "ui-state-focus" );
		}
	},

	enable: function() {
		return this._setoptions( { disabled: false } );
	},

	disable: function() {
		return this._setoptions( { disabled: true } );
	},

	_classes: function( options ) {
		var full = [];
		var that = this;

		options = $.extend( {
			element: this.element,
			classes: this.options.classes || {}
		}, options );

		function bindremoveevent() {
			var nodestobind = [];

			options.element.each( function( _, element ) {
				var istracked = $.map( that.classeselementlookup, function( elements ) {
					return elements;
				} )
					.some( function( elements ) {
						return elements.is( element );
					} );

				if ( !istracked ) {
					nodestobind.push( element );
				}
			} );

			that._on( $( nodestobind ), {
				remove: "_untrackclasseselement"
			} );
		}

		function processclassstring( classes, checkoption ) {
			var current, i;
			for ( i = 0; i < classes.length; i++ ) {
				current = that.classeselementlookup[ classes[ i ] ] || $();
				if ( options.add ) {
					bindremoveevent();
					current = $( $.uniquesort( current.get().concat( options.element.get() ) ) );
				} else {
					current = $( current.not( options.element ).get() );
				}
				that.classeselementlookup[ classes[ i ] ] = current;
				full.push( classes[ i ] );
				if ( checkoption && options.classes[ classes[ i ] ] ) {
					full.push( options.classes[ classes[ i ] ] );
				}
			}
		}

		if ( options.keys ) {
			processclassstring( options.keys.match( /\s+/g ) || [], true );
		}
		if ( options.extra ) {
			processclassstring( options.extra.match( /\s+/g ) || [] );
		}

		return full.join( " " );
	},

	_untrackclasseselement: function( event ) {
		var that = this;
		$.each( that.classeselementlookup, function( key, value ) {
			if ( $.inarray( event.target, value ) !== -1 ) {
				that.classeselementlookup[ key ] = $( value.not( event.target ).get() );
			}
		} );

		this._off( $( event.target ) );
	},

	_removeclass: function( element, keys, extra ) {
		return this._toggleclass( element, keys, extra, false );
	},

	_addclass: function( element, keys, extra ) {
		return this._toggleclass( element, keys, extra, true );
	},

	_toggleclass: function( element, keys, extra, add ) {
		add = ( typeof add === "boolean" ) ? add : extra;
		var shift = ( typeof element === "string" || element === null ),
			options = {
				extra: shift ? keys : extra,
				keys: shift ? element : keys,
				element: shift ? this.element : element,
				add: add
			};
		options.element.toggleclass( this._classes( options ), add );
		return this;
	},

	_on: function( suppressdisabledcheck, element, handlers ) {
		var delegateelement;
		var instance = this;

		// no suppressdisabledcheck flag, shuffle arguments
		if ( typeof suppressdisabledcheck !== "boolean" ) {
			handlers = element;
			element = suppressdisabledcheck;
			suppressdisabledcheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateelement = this.widget();
		} else {
			element = delegateelement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerproxy() {

				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressdisabledcheck &&
						( instance.options.disabled === true ||
						$( this ).hasclass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerproxy.guid = handler.guid =
					handler.guid || handlerproxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ );
			var eventname = match[ 1 ] + instance.eventnamespace;
			var selector = match[ 2 ];

			if ( selector ) {
				delegateelement.on( eventname, selector, handlerproxy );
			} else {
				element.on( eventname, handlerproxy );
			}
		} );
	},

	_off: function( element, eventname ) {
		eventname = ( eventname || "" ).split( " " ).join( this.eventnamespace + " " ) +
			this.eventnamespace;
		element.off( eventname );

		// clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerproxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return settimeout( handlerproxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				this._addclass( $( event.currenttarget ), null, "ui-state-hover" );
			},
			mouseleave: function( event ) {
				this._removeclass( $( event.currenttarget ), null, "ui-state-hover" );
			}
		} );
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				this._addclass( $( event.currenttarget ), null, "ui-state-focus" );
			},
			focusout: function( event ) {
				this._removeclass( $( event.currenttarget ), null, "ui-state-focus" );
			}
		} );
	},

	_trigger: function( type, event, data ) {
		var prop, orig;
		var callback = this.options[ type ];

		data = data || {};
		event = $.event( event );
		event.type = ( type === this.widgeteventprefix ?
			type :
			this.widgeteventprefix + type ).tolowercase();

		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalevent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( typeof callback === "function" &&
			callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
			event.isdefaultprevented() );
	}
};

$.each( { show: "fadein", hide: "fadeout" }, function( method, defaulteffect ) {
	$.widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}

		var hasoptions;
		var effectname = !options ?
			method :
			options === true || typeof options === "number" ?
				defaulteffect :
				options.effect || defaulteffect;

		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		} else if ( options === true ) {
			options = {};
		}

		hasoptions = !$.isemptyobject( options );
		options.complete = callback;

		if ( options.delay ) {
			element.delay( options.delay );
		}

		if ( hasoptions && $.effects && $.effects.effect[ effectname ] ) {
			element[ method ]( options );
		} else if ( effectname !== method && element[ effectname ] ) {
			element[ effectname ]( options.duration, options.easing, callback );
		} else {
			element.queue( function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			} );
		}
	};
} );


} ) );


