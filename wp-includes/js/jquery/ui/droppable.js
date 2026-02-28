/*!
 * jquery ui droppable 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: droppable
//>>group: interactions
//>>description: enables drop targets for draggable elements.
//>>docs: https://api.jqueryui.com/droppable/
//>>demos: https://jqueryui.com/droppable/

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./draggable",
			"./mouse",
			"../version",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

$.widget( "ui.droppable", {
	version: "1.13.3",
	widgeteventprefix: "drop",
	options: {
		accept: "*",
		addclasses: true,
		greedy: false,
		scope: "default",
		tolerance: "intersect",

		// callbacks
		activate: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	},
	_create: function() {

		var proportions,
			o = this.options,
			accept = o.accept;

		this.isover = false;
		this.isout = true;

		this.accept = typeof accept === "function" ? accept : function( d ) {
			return d.is( accept );
		};

		this.proportions = function( /* valuetowrite */ ) {
			if ( arguments.length ) {

				// store the droppable's proportions
				proportions = arguments[ 0 ];
			} else {

				// retrieve or derive the droppable's proportions
				return proportions ?
					proportions :
					proportions = {
						width: this.element[ 0 ].offsetwidth,
						height: this.element[ 0 ].offsetheight
					};
			}
		};

		this._addtomanager( o.scope );

		if ( o.addclasses ) {
			this._addclass( "ui-droppable" );
		}

	},

	_addtomanager: function( scope ) {

		// add the reference and positions to the manager
		$.ui.ddmanager.droppables[ scope ] = $.ui.ddmanager.droppables[ scope ] || [];
		$.ui.ddmanager.droppables[ scope ].push( this );
	},

	_splice: function( drop ) {
		var i = 0;
		for ( ; i < drop.length; i++ ) {
			if ( drop[ i ] === this ) {
				drop.splice( i, 1 );
			}
		}
	},

	_destroy: function() {
		var drop = $.ui.ddmanager.droppables[ this.options.scope ];

		this._splice( drop );
	},

	_setoption: function( key, value ) {

		if ( key === "accept" ) {
			this.accept = typeof value === "function" ? value : function( d ) {
				return d.is( value );
			};
		} else if ( key === "scope" ) {
			var drop = $.ui.ddmanager.droppables[ this.options.scope ];

			this._splice( drop );
			this._addtomanager( value );
		}

		this._super( key, value );
	},

	_activate: function( event ) {
		var draggable = $.ui.ddmanager.current;

		this._addactiveclass();
		if ( draggable ) {
			this._trigger( "activate", event, this.ui( draggable ) );
		}
	},

	_deactivate: function( event ) {
		var draggable = $.ui.ddmanager.current;

		this._removeactiveclass();
		if ( draggable ) {
			this._trigger( "deactivate", event, this.ui( draggable ) );
		}
	},

	_over: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentitem ||
				draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentitem ||
				draggable.element ) ) ) {
			this._addhoverclass();
			this._trigger( "over", event, this.ui( draggable ) );
		}

	},

	_out: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentitem ||
				draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentitem ||
				draggable.element ) ) ) {
			this._removehoverclass();
			this._trigger( "out", event, this.ui( draggable ) );
		}

	},

	_drop: function( event, custom ) {

		var draggable = custom || $.ui.ddmanager.current,
			childrenintersection = false;

		// bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentitem ||
				draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return false;
		}

		this.element
			.find( ":data(ui-droppable)" )
			.not( ".ui-draggable-dragging" )
			.each( function() {
				var inst = $( this ).droppable( "instance" );
				if (
					inst.options.greedy &&
					!inst.options.disabled &&
					inst.options.scope === draggable.options.scope &&
					inst.accept.call(
						inst.element[ 0 ], ( draggable.currentitem || draggable.element )
					) &&
					$.ui.intersect(
						draggable,
						$.extend( inst, { offset: inst.element.offset() } ),
						inst.options.tolerance, event
					)
				) {
					childrenintersection = true;
					return false;
				}
			} );
		if ( childrenintersection ) {
			return false;
		}

		if ( this.accept.call( this.element[ 0 ],
				( draggable.currentitem || draggable.element ) ) ) {
			this._removeactiveclass();
			this._removehoverclass();

			this._trigger( "drop", event, this.ui( draggable ) );
			return this.element;
		}

		return false;

	},

	ui: function( c ) {
		return {
			draggable: ( c.currentitem || c.element ),
			helper: c.helper,
			position: c.position,
			offset: c.positionabs
		};
	},

	// extension points just to make backcompat sane and avoid duplicating logic
	// todo: remove in 1.14 along with call to it below
	_addhoverclass: function() {
		this._addclass( "ui-droppable-hover" );
	},

	_removehoverclass: function() {
		this._removeclass( "ui-droppable-hover" );
	},

	_addactiveclass: function() {
		this._addclass( "ui-droppable-active" );
	},

	_removeactiveclass: function() {
		this._removeclass( "ui-droppable-active" );
	}
} );

$.ui.intersect = ( function() {
	function isoveraxis( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	}

	return function( draggable, droppable, tolerancemode, event ) {

		if ( !droppable.offset ) {
			return false;
		}

		var x1 = ( draggable.positionabs ||
				draggable.position.absolute ).left + draggable.margins.left,
			y1 = ( draggable.positionabs ||
				draggable.position.absolute ).top + draggable.margins.top,
			x2 = x1 + draggable.helperproportions.width,
			y2 = y1 + draggable.helperproportions.height,
			l = droppable.offset.left,
			t = droppable.offset.top,
			r = l + droppable.proportions().width,
			b = t + droppable.proportions().height;

		switch ( tolerancemode ) {
		case "fit":
			return ( l <= x1 && x2 <= r && t <= y1 && y2 <= b );
		case "intersect":
			return ( l < x1 + ( draggable.helperproportions.width / 2 ) && // right half
				x2 - ( draggable.helperproportions.width / 2 ) < r && // left half
				t < y1 + ( draggable.helperproportions.height / 2 ) && // bottom half
				y2 - ( draggable.helperproportions.height / 2 ) < b ); // top half
		case "pointer":
			return isoveraxis( event.pagey, t, droppable.proportions().height ) &&
				isoveraxis( event.pagex, l, droppable.proportions().width );
		case "touch":
			return (
				( y1 >= t && y1 <= b ) || // top edge touching
				( y2 >= t && y2 <= b ) || // bottom edge touching
				( y1 < t && y2 > b ) // surrounded vertically
			) && (
				( x1 >= l && x1 <= r ) || // left edge touching
				( x2 >= l && x2 <= r ) || // right edge touching
				( x1 < l && x2 > r ) // surrounded horizontally
			);
		default:
			return false;
		}
	};
} )();

/*
	this manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { "default": [] },
	prepareoffsets: function( t, event ) {

		var i, j,
			m = $.ui.ddmanager.droppables[ t.options.scope ] || [],
			type = event ? event.type : null, // workaround for #2317
			list = ( t.currentitem || t.element ).find( ":data(ui-droppable)" ).addback();

		droppablesloop: for ( i = 0; i < m.length; i++ ) {

			// no disabled and non-accepted
			if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ],
					( t.currentitem || t.element ) ) ) ) {
				continue;
			}

			// filter out elements in the current dragged item
			for ( j = 0; j < list.length; j++ ) {
				if ( list[ j ] === m[ i ].element[ 0 ] ) {
					m[ i ].proportions().height = 0;
					continue droppablesloop;
				}
			}

			m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
			if ( !m[ i ].visible ) {
				continue;
			}

			// activate the droppable if used directly from draggables
			if ( type === "mousedown" ) {
				m[ i ]._activate.call( m[ i ], event );
			}

			m[ i ].offset = m[ i ].element.offset();
			m[ i ].proportions( {
				width: m[ i ].element[ 0 ].offsetwidth,
				height: m[ i ].element[ 0 ].offsetheight
			} );

		}

	},
	drop: function( draggable, event ) {

		var dropped = false;

		// create a copy of the droppables in case the list changes during the drop (#9116)
		$.each( ( $.ui.ddmanager.droppables[ draggable.options.scope ] || [] ).slice(), function() {

			if ( !this.options ) {
				return;
			}
			if ( !this.options.disabled && this.visible &&
					$.ui.intersect( draggable, this, this.options.tolerance, event ) ) {
				dropped = this._drop.call( this, event ) || dropped;
			}

			if ( !this.options.disabled && this.visible && this.accept.call( this.element[ 0 ],
					( draggable.currentitem || draggable.element ) ) ) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call( this, event );
			}

		} );
		return dropped;

	},
	dragstart: function( draggable, event ) {

		// listen for scrolling so that if the dragging causes scrolling the position of the
		// droppables can be recalculated (see #5003)
		draggable.element.parentsuntil( "body" ).on( "scroll.droppable", function() {
			if ( !draggable.options.refreshpositions ) {
				$.ui.ddmanager.prepareoffsets( draggable, event );
			}
		} );
	},
	drag: function( draggable, event ) {

		// if you have a highly dynamic page, you might try this option. it renders positions
		// every time you move the mouse.
		if ( draggable.options.refreshpositions ) {
			$.ui.ddmanager.prepareoffsets( draggable, event );
		}

		// run through all droppables and check their positions based on specific tolerance options
		$.each( $.ui.ddmanager.droppables[ draggable.options.scope ] || [], function() {

			if ( this.options.disabled || this.greedychild || !this.visible ) {
				return;
			}

			var parentinstance, scope, parent,
				intersects = $.ui.intersect( draggable, this, this.options.tolerance, event ),
				c = !intersects && this.isover ?
					"isout" :
					( intersects && !this.isover ? "isover" : null );
			if ( !c ) {
				return;
			}

			if ( this.options.greedy ) {

				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents( ":data(ui-droppable)" ).filter( function() {
					return $( this ).droppable( "instance" ).options.scope === scope;
				} );

				if ( parent.length ) {
					parentinstance = $( parent[ 0 ] ).droppable( "instance" );
					parentinstance.greedychild = ( c === "isover" );
				}
			}

			// we just moved into a greedy child
			if ( parentinstance && c === "isover" ) {
				parentinstance.isover = false;
				parentinstance.isout = true;
				parentinstance._out.call( parentinstance, event );
			}

			this[ c ] = true;
			this[ c === "isout" ? "isover" : "isout" ] = false;
			this[ c === "isover" ? "_over" : "_out" ].call( this, event );

			// we just moved out of a greedy child
			if ( parentinstance && c === "isout" ) {
				parentinstance.isout = false;
				parentinstance.isover = true;
				parentinstance._over.call( parentinstance, event );
			}
		} );

	},
	dragstop: function( draggable, event ) {
		draggable.element.parentsuntil( "body" ).off( "scroll.droppable" );

		// call prepareoffsets one final time since ie does not fire return scroll events when
		// overflow was caused by drag (see #5003)
		if ( !draggable.options.refreshpositions ) {
			$.ui.ddmanager.prepareoffsets( draggable, event );
		}
	}
};

// deprecated
// todo: switch return back to widget declaration at top of file when this is removed
if ( $.uibackcompat !== false ) {

	// backcompat for activeclass and hoverclass options
	$.widget( "ui.droppable", $.ui.droppable, {
		options: {
			hoverclass: false,
			activeclass: false
		},
		_addactiveclass: function() {
			this._super();
			if ( this.options.activeclass ) {
				this.element.addclass( this.options.activeclass );
			}
		},
		_removeactiveclass: function() {
			this._super();
			if ( this.options.activeclass ) {
				this.element.removeclass( this.options.activeclass );
			}
		},
		_addhoverclass: function() {
			this._super();
			if ( this.options.hoverclass ) {
				this.element.addclass( this.options.hoverclass );
			}
		},
		_removehoverclass: function() {
			this._super();
			if ( this.options.hoverclass ) {
				this.element.removeclass( this.options.hoverclass );
			}
		}
	} );
}

return $.ui.droppable;

} );


