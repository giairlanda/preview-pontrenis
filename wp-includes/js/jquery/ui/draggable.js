/*!
 * jquery ui draggable 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: draggable
//>>group: interactions
//>>description: enables dragging functionality for any element.
//>>docs: https://api.jqueryui.com/draggable/
//>>demos: https://jqueryui.com/draggable/
//>>css.structure: ../../themes/base/draggable.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./mouse",
			"../data",
			"../plugin",
			"../safe-active-element",
			"../safe-blur",
			"../scroll-parent",
			"../version",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

$.widget( "ui.draggable", $.ui.mouse, {
	version: "1.13.3",
	widgeteventprefix: "drag",
	options: {
		addclasses: true,
		appendto: "parent",
		axis: false,
		connecttosortable: false,
		containment: false,
		cursor: "auto",
		cursorat: false,
		grid: false,
		handle: false,
		helper: "original",
		iframefix: false,
		opacity: false,
		refreshpositions: false,
		revert: false,
		revertduration: 500,
		scope: "default",
		scroll: true,
		scrollsensitivity: 20,
		scrollspeed: 20,
		snap: false,
		snapmode: "both",
		snaptolerance: 20,
		stack: false,
		zindex: false,

		// callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if ( this.options.helper === "original" ) {
			this._setpositionrelative();
		}
		if ( this.options.addclasses ) {
			this._addclass( "ui-draggable" );
		}
		this._sethandleclassname();

		this._mouseinit();
	},

	_setoption: function( key, value ) {
		this._super( key, value );
		if ( key === "handle" ) {
			this._removehandleclassname();
			this._sethandleclassname();
		}
	},

	_destroy: function() {
		if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
			this.destroyonclear = true;
			return;
		}
		this._removehandleclassname();
		this._mousedestroy();
	},

	_mousecapture: function( event ) {
		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if ( this.helper || o.disabled ||
				$( event.target ).closest( ".ui-resizable-handle" ).length > 0 ) {
			return false;
		}

		//quit if we're not on a valid handle
		this.handle = this._gethandle( event );
		if ( !this.handle ) {
			return false;
		}

		this._bluractiveelement( event );

		this._blockframes( o.iframefix === true ? "iframe" : o.iframefix );

		return true;

	},

	_blockframes: function( selector ) {
		this.iframeblocks = this.document.find( selector ).map( function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( "position", "absolute" )
				.appendto( iframe.parent() )
				.outerwidth( iframe.outerwidth() )
				.outerheight( iframe.outerheight() )
				.offset( iframe.offset() )[ 0 ];
		} );
	},

	_unblockframes: function() {
		if ( this.iframeblocks ) {
			this.iframeblocks.remove();
			delete this.iframeblocks;
		}
	},

	_bluractiveelement: function( event ) {
		var activeelement = $.ui.safeactiveelement( this.document[ 0 ] ),
			target = $( event.target );

		// don't blur if the event occurred on an element that is within
		// the currently focused element
		// see #10527, #12472
		if ( target.closest( activeelement ).length ) {
			return;
		}

		// blur any element that currently has focus, see #4261
		$.ui.safeblur( activeelement );
	},

	_mousestart: function( event ) {

		var o = this.options;

		//create and append the visible helper
		this.helper = this._createhelper( event );

		this._addclass( this.helper, "ui-draggable-dragging" );

		//cache the helper size
		this._cachehelperproportions();

		//if ddmanager is used for droppables, set the global draggable
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - position generation -
		 * this block generates everything position related - it's the core of draggables.
		 */

		//cache the margins of the original element
		this._cachemargins();

		//store the helper's css position
		this.cssposition = this.helper.css( "position" );
		this.scrollparent = this.helper.scrollparent( true );
		this.offsetparent = this.helper.offsetparent();
		this.hasfixedancestor = this.helper.parents().filter( function() {
				return $( this ).css( "position" ) === "fixed";
			} ).length > 0;

		//the element's absolute position on the page minus margins
		this.positionabs = this.element.offset();
		this._refreshoffsets( event );

		//generate the original position
		this.originalposition = this.position = this._generateposition( event, false );
		this.originalpagex = event.pagex;
		this.originalpagey = event.pagey;

		//adjust the mouse offset relative to the helper if "cursorat" is supplied
		if ( o.cursorat ) {
			this._adjustoffsetfromhelper( o.cursorat );
		}

		//set a containment if given in the options
		this._setcontainment();

		//trigger event + callbacks
		if ( this._trigger( "start", event ) === false ) {
			this._clear();
			return false;
		}

		//recache the helper size
		this._cachehelperproportions();

		//prepare the droppable offsets
		if ( $.ui.ddmanager && !o.dropbehaviour ) {
			$.ui.ddmanager.prepareoffsets( this, event );
		}

		// execute the drag once - this causes the helper not to be visible before getting its
		// correct position
		this._mousedrag( event, true );

		// if the ddmanager is used for droppables, inform the manager that dragging has started
		// (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragstart( this, event );
		}

		return true;
	},

	_refreshoffsets: function( event ) {
		this.offset = {
			top: this.positionabs.top - this.margins.top,
			left: this.positionabs.left - this.margins.left,
			scroll: false,
			parent: this._getparentoffset(),
			relative: this._getrelativeoffset()
		};

		this.offset.click = {
			left: event.pagex - this.offset.left,
			top: event.pagey - this.offset.top
		};
	},

	_mousedrag: function( event, nopropagation ) {

		// reset any necessary cached properties (see #5009)
		if ( this.hasfixedancestor ) {
			this.offset.parent = this._getparentoffset();
		}

		//compute the helpers position
		this.position = this._generateposition( event, true );
		this.positionabs = this._convertpositionto( "absolute" );

		//call plugins and callbacks and use the resulting position if something is returned
		if ( !nopropagation ) {
			var ui = this._uihash();
			if ( this._trigger( "drag", event, ui ) === false ) {
				this._mouseup( new $.event( "mouseup", event ) );
				return false;
			}
			this.position = ui.position;
		}

		this.helper[ 0 ].style.left = this.position.left + "px";
		this.helper[ 0 ].style.top = this.position.top + "px";

		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.drag( this, event );
		}

		return false;
	},

	_mousestop: function( event ) {

		//if we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ( $.ui.ddmanager && !this.options.dropbehaviour ) {
			dropped = $.ui.ddmanager.drop( this, event );
		}

		//if a drop comes from outside (a sortable)
		if ( this.dropped ) {
			dropped = this.dropped;
			this.dropped = false;
		}

		if ( ( this.options.revert === "invalid" && !dropped ) ||
				( this.options.revert === "valid" && dropped ) ||
				this.options.revert === true || ( typeof this.options.revert === "function" &&
				this.options.revert.call( this.element, dropped ) )
		) {
			$( this.helper ).animate(
				this.originalposition,
				parseint( this.options.revertduration, 10 ),
				function() {
					if ( that._trigger( "stop", event ) !== false ) {
						that._clear();
					}
				}
			);
		} else {
			if ( this._trigger( "stop", event ) !== false ) {
				this._clear();
			}
		}

		return false;
	},

	_mouseup: function( event ) {
		this._unblockframes();

		// if the ddmanager is used for droppables, inform the manager that dragging has stopped
		// (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragstop( this, event );
		}

		// only need to focus if the event occurred on the draggable itself, see #10527
		if ( this.handleelement.is( event.target ) ) {

			// the interaction is over; whether or not the click resulted in a drag,
			// focus the element
			this.element.trigger( "focus" );
		}

		return $.ui.mouse.prototype._mouseup.call( this, event );
	},

	cancel: function() {

		if ( this.helper.is( ".ui-draggable-dragging" ) ) {
			this._mouseup( new $.event( "mouseup", { target: this.element[ 0 ] } ) );
		} else {
			this._clear();
		}

		return this;

	},

	_gethandle: function( event ) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_sethandleclassname: function() {
		this.handleelement = this.options.handle ?
			this.element.find( this.options.handle ) : this.element;
		this._addclass( this.handleelement, "ui-draggable-handle" );
	},

	_removehandleclassname: function() {
		this._removeclass( this.handleelement, "ui-draggable-handle" );
	},

	_createhelper: function( event ) {

		var o = this.options,
			helperisfunction = typeof o.helper === "function",
			helper = helperisfunction ?
				$( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
				( o.helper === "clone" ?
					this.element.clone().removeattr( "id" ) :
					this.element );

		if ( !helper.parents( "body" ).length ) {
			helper.appendto( ( o.appendto === "parent" ?
				this.element[ 0 ].parentnode :
				o.appendto ) );
		}

		// https://bugs.jqueryui.com/ticket/9446
		// a helper function can return the original element
		// which wouldn't have been set to relative in _create
		if ( helperisfunction && helper[ 0 ] === this.element[ 0 ] ) {
			this._setpositionrelative();
		}

		if ( helper[ 0 ] !== this.element[ 0 ] &&
				!( /(fixed|absolute)/ ).test( helper.css( "position" ) ) ) {
			helper.css( "position", "absolute" );
		}

		return helper;

	},

	_setpositionrelative: function() {
		if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
			this.element[ 0 ].style.position = "relative";
		}
	},

	_adjustoffsetfromhelper: function( obj ) {
		if ( typeof obj === "string" ) {
			obj = obj.split( " " );
		}
		if ( array.isarray( obj ) ) {
			obj = { left: +obj[ 0 ], top: +obj[ 1 ] || 0 };
		}
		if ( "left" in obj ) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ( "right" in obj ) {
			this.offset.click.left = this.helperproportions.width - obj.right + this.margins.left;
		}
		if ( "top" in obj ) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ( "bottom" in obj ) {
			this.offset.click.top = this.helperproportions.height - obj.bottom + this.margins.top;
		}
	},

	_isrootnode: function( element ) {
		return ( /(html|body)/i ).test( element.tagname ) || element === this.document[ 0 ];
	},

	_getparentoffset: function() {

		//get the offsetparent and cache its position
		var po = this.offsetparent.offset(),
			document = this.document[ 0 ];

		// this is a special case where we need to modify a offset calculated on start, since the
		// following happened:
		// 1. the position of the helper is absolute, so it's position is calculated based on the
		// next positioned parent
		// 2. the actual offset parent is a child of the scroll parent, and the scroll parent isn't
		// the document, which means that the scroll is included in the initial calculation of the
		// offset of the parent, and never recalculated upon drag
		if ( this.cssposition === "absolute" && this.scrollparent[ 0 ] !== document &&
				$.contains( this.scrollparent[ 0 ], this.offsetparent[ 0 ] ) ) {
			po.left += this.scrollparent.scrollleft();
			po.top += this.scrollparent.scrolltop();
		}

		if ( this._isrootnode( this.offsetparent[ 0 ] ) ) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + ( parseint( this.offsetparent.css( "bordertopwidth" ), 10 ) || 0 ),
			left: po.left + ( parseint( this.offsetparent.css( "borderleftwidth" ), 10 ) || 0 )
		};

	},

	_getrelativeoffset: function() {
		if ( this.cssposition !== "relative" ) {
			return { top: 0, left: 0 };
		}

		var p = this.element.position(),
			scrollisrootnode = this._isrootnode( this.scrollparent[ 0 ] );

		return {
			top: p.top - ( parseint( this.helper.css( "top" ), 10 ) || 0 ) +
				( !scrollisrootnode ? this.scrollparent.scrolltop() : 0 ),
			left: p.left - ( parseint( this.helper.css( "left" ), 10 ) || 0 ) +
				( !scrollisrootnode ? this.scrollparent.scrollleft() : 0 )
		};

	},

	_cachemargins: function() {
		this.margins = {
			left: ( parseint( this.element.css( "marginleft" ), 10 ) || 0 ),
			top: ( parseint( this.element.css( "margintop" ), 10 ) || 0 ),
			right: ( parseint( this.element.css( "marginright" ), 10 ) || 0 ),
			bottom: ( parseint( this.element.css( "marginbottom" ), 10 ) || 0 )
		};
	},

	_cachehelperproportions: function() {
		this.helperproportions = {
			width: this.helper.outerwidth(),
			height: this.helper.outerheight()
		};
	},

	_setcontainment: function() {

		var isuserscrollable, c, ce,
			o = this.options,
			document = this.document[ 0 ];

		this.relativecontainer = null;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollleft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrolltop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollleft() + $( window ).width() -
					this.helperproportions.width - this.margins.left,
				$( window ).scrolltop() +
					( $( window ).height() || document.body.parentnode.scrollheight ) -
					this.helperproportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document" ) {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperproportions.width - this.margins.left,
				( $( document ).height() || document.body.parentnode.scrollheight ) -
					this.helperproportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentnode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if ( !ce ) {
			return;
		}

		isuserscrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

		this.containment = [
			( parseint( c.css( "borderleftwidth" ), 10 ) || 0 ) +
				( parseint( c.css( "paddingleft" ), 10 ) || 0 ),
			( parseint( c.css( "bordertopwidth" ), 10 ) || 0 ) +
				( parseint( c.css( "paddingtop" ), 10 ) || 0 ),
			( isuserscrollable ? math.max( ce.scrollwidth, ce.offsetwidth ) : ce.offsetwidth ) -
				( parseint( c.css( "borderrightwidth" ), 10 ) || 0 ) -
				( parseint( c.css( "paddingright" ), 10 ) || 0 ) -
				this.helperproportions.width -
				this.margins.left -
				this.margins.right,
			( isuserscrollable ? math.max( ce.scrollheight, ce.offsetheight ) : ce.offsetheight ) -
				( parseint( c.css( "borderbottomwidth" ), 10 ) || 0 ) -
				( parseint( c.css( "paddingbottom" ), 10 ) || 0 ) -
				this.helperproportions.height -
				this.margins.top -
				this.margins.bottom
		];
		this.relativecontainer = c;
	},

	_convertpositionto: function( d, pos ) {

		if ( !pos ) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scrollisrootnode = this._isrootnode( this.scrollparent[ 0 ] );

		return {
			top: (

				// the absolute mouse position
				pos.top	+

				// only for relative positioned nodes: relative offset from element to offset parent
				this.offset.relative.top * mod +

				// the offsetparent's offset without borders (offset + border)
				this.offset.parent.top * mod -
				( ( this.cssposition === "fixed" ?
					-this.offset.scroll.top :
					( scrollisrootnode ? 0 : this.offset.scroll.top ) ) * mod )
			),
			left: (

				// the absolute mouse position
				pos.left +

				// only for relative positioned nodes: relative offset from element to offset parent
				this.offset.relative.left * mod +

				// the offsetparent's offset without borders (offset + border)
				this.offset.parent.left * mod	-
				( ( this.cssposition === "fixed" ?
					-this.offset.scroll.left :
					( scrollisrootnode ? 0 : this.offset.scroll.left ) ) * mod )
			)
		};

	},

	_generateposition: function( event, constrainposition ) {

		var containment, co, top, left,
			o = this.options,
			scrollisrootnode = this._isrootnode( this.scrollparent[ 0 ] ),
			pagex = event.pagex,
			pagey = event.pagey;

		// cache the scroll
		if ( !scrollisrootnode || !this.offset.scroll ) {
			this.offset.scroll = {
				top: this.scrollparent.scrolltop(),
				left: this.scrollparent.scrollleft()
			};
		}

		/*
		 * - position constraining -
		 * constrain the position to a mix of grid, containment.
		 */

		// if we are not dragging yet, we won't check for options
		if ( constrainposition ) {
			if ( this.containment ) {
				if ( this.relativecontainer ) {
					co = this.relativecontainer.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				} else {
					containment = this.containment;
				}

				if ( event.pagex - this.offset.click.left < containment[ 0 ] ) {
					pagex = containment[ 0 ] + this.offset.click.left;
				}
				if ( event.pagey - this.offset.click.top < containment[ 1 ] ) {
					pagey = containment[ 1 ] + this.offset.click.top;
				}
				if ( event.pagex - this.offset.click.left > containment[ 2 ] ) {
					pagex = containment[ 2 ] + this.offset.click.left;
				}
				if ( event.pagey - this.offset.click.top > containment[ 3 ] ) {
					pagey = containment[ 3 ] + this.offset.click.top;
				}
			}

			if ( o.grid ) {

				//check for grid elements set to 0 to prevent divide by 0 error causing invalid
				// argument errors in ie (see ticket #6950)
				top = o.grid[ 1 ] ? this.originalpagey + math.round( ( pagey -
					this.originalpagey ) / o.grid[ 1 ] ) * o.grid[ 1 ] : this.originalpagey;
				pagey = containment ? ( ( top - this.offset.click.top >= containment[ 1 ] ||
					top - this.offset.click.top > containment[ 3 ] ) ?
						top :
						( ( top - this.offset.click.top >= containment[ 1 ] ) ?
							top - o.grid[ 1 ] : top + o.grid[ 1 ] ) ) : top;

				left = o.grid[ 0 ] ? this.originalpagex +
					math.round( ( pagex - this.originalpagex ) / o.grid[ 0 ] ) * o.grid[ 0 ] :
					this.originalpagex;
				pagex = containment ? ( ( left - this.offset.click.left >= containment[ 0 ] ||
					left - this.offset.click.left > containment[ 2 ] ) ?
						left :
						( ( left - this.offset.click.left >= containment[ 0 ] ) ?
							left - o.grid[ 0 ] : left + o.grid[ 0 ] ) ) : left;
			}

			if ( o.axis === "y" ) {
				pagex = this.originalpagex;
			}

			if ( o.axis === "x" ) {
				pagey = this.originalpagey;
			}
		}

		return {
			top: (

				// the absolute mouse position
				pagey -

				// click offset (relative to the element)
				this.offset.click.top -

				// only for relative positioned nodes: relative offset from element to offset parent
				this.offset.relative.top -

				// the offsetparent's offset without borders (offset + border)
				this.offset.parent.top +
				( this.cssposition === "fixed" ?
					-this.offset.scroll.top :
					( scrollisrootnode ? 0 : this.offset.scroll.top ) )
			),
			left: (

				// the absolute mouse position
				pagex -

				// click offset (relative to the element)
				this.offset.click.left -

				// only for relative positioned nodes: relative offset from element to offset parent
				this.offset.relative.left -

				// the offsetparent's offset without borders (offset + border)
				this.offset.parent.left +
				( this.cssposition === "fixed" ?
					-this.offset.scroll.left :
					( scrollisrootnode ? 0 : this.offset.scroll.left ) )
			)
		};

	},

	_clear: function() {
		this._removeclass( this.helper, "ui-draggable-dragging" );
		if ( this.helper[ 0 ] !== this.element[ 0 ] && !this.cancelhelperremoval ) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelhelperremoval = false;
		if ( this.destroyonclear ) {
			this.destroy();
		}
	},

	// from now on bulk stuff - mainly helpers

	_trigger: function( type, event, ui ) {
		ui = ui || this._uihash();
		$.ui.plugin.call( this, type, [ event, ui, this ], true );

		// absolute position and offset (see #6884 ) have to be recalculated after plugins
		if ( /^(drag|start|stop)/.test( type ) ) {
			this.positionabs = this._convertpositionto( "absolute" );
			ui.offset = this.positionabs;
		}
		return $.widget.prototype._trigger.call( this, type, event, ui );
	},

	plugins: {},

	_uihash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalposition: this.originalposition,
			offset: this.positionabs
		};
	}

} );

$.ui.plugin.add( "draggable", "connecttosortable", {
	start: function( event, ui, draggable ) {
		var uisortable = $.extend( {}, ui, {
			item: draggable.element
		} );

		draggable.sortables = [];
		$( draggable.options.connecttosortable ).each( function() {
			var sortable = $( this ).sortable( "instance" );

			if ( sortable && !sortable.options.disabled ) {
				draggable.sortables.push( sortable );

				// refreshpositions is called at drag start to refresh the containercache
				// which is used in drag. this ensures it's initialized and synchronized
				// with any changes that might have happened on the page since initialization.
				sortable.refreshpositions();
				sortable._trigger( "activate", event, uisortable );
			}
		} );
	},
	stop: function( event, ui, draggable ) {
		var uisortable = $.extend( {}, ui, {
			item: draggable.element
		} );

		draggable.cancelhelperremoval = false;

		$.each( draggable.sortables, function() {
			var sortable = this;

			if ( sortable.isover ) {
				sortable.isover = 0;

				// allow this sortable to handle removing the helper
				draggable.cancelhelperremoval = true;
				sortable.cancelhelperremoval = false;

				// use _storedcss to restore properties in the sortable,
				// as this also handles revert (#9675) since the draggable
				// may have modified them in unexpected ways (#8809)
				sortable._storedcss = {
					position: sortable.placeholder.css( "position" ),
					top: sortable.placeholder.css( "top" ),
					left: sortable.placeholder.css( "left" )
				};

				sortable._mousestop( event );

				// once drag has ended, the sortable should return to using
				// its original helper, not the shared helper from draggable
				sortable.options.helper = sortable.options._helper;
			} else {

				// prevent this sortable from removing the helper.
				// however, don't set the draggable to remove the helper
				// either as another connected sortable may yet handle the removal.
				sortable.cancelhelperremoval = true;

				sortable._trigger( "deactivate", event, uisortable );
			}
		} );
	},
	drag: function( event, ui, draggable ) {
		$.each( draggable.sortables, function() {
			var innermostintersecting = false,
				sortable = this;

			// copy over variables that sortable's _intersectswith uses
			sortable.positionabs = draggable.positionabs;
			sortable.helperproportions = draggable.helperproportions;
			sortable.offset.click = draggable.offset.click;

			if ( sortable._intersectswith( sortable.containercache ) ) {
				innermostintersecting = true;

				$.each( draggable.sortables, function() {

					// copy over variables that sortable's _intersectswith uses
					this.positionabs = draggable.positionabs;
					this.helperproportions = draggable.helperproportions;
					this.offset.click = draggable.offset.click;

					if ( this !== sortable &&
							this._intersectswith( this.containercache ) &&
							$.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
						innermostintersecting = false;
					}

					return innermostintersecting;
				} );
			}

			if ( innermostintersecting ) {

				// if it intersects, we use a little isover variable and set it once,
				// so that the move-in stuff gets fired only once.
				if ( !sortable.isover ) {
					sortable.isover = 1;

					// store draggable's parent in case we need to reappend to it later.
					draggable._parent = ui.helper.parent();

					sortable.currentitem = ui.helper
						.appendto( sortable.element )
						.data( "ui-sortable-item", true );

					// store helper option to later restore it
					sortable.options._helper = sortable.options.helper;

					sortable.options.helper = function() {
						return ui.helper[ 0 ];
					};

					// fire the start events of the sortable with our passed browser event,
					// and our own helper (so it doesn't create a new one)
					event.target = sortable.currentitem[ 0 ];
					sortable._mousecapture( event, true );
					sortable._mousestart( event, true, true );

					// because the browser event is way off the new appended portlet,
					// modify necessary variables to reflect the changes
					sortable.offset.click.top = draggable.offset.click.top;
					sortable.offset.click.left = draggable.offset.click.left;
					sortable.offset.parent.left -= draggable.offset.parent.left -
						sortable.offset.parent.left;
					sortable.offset.parent.top -= draggable.offset.parent.top -
						sortable.offset.parent.top;

					draggable._trigger( "tosortable", event );

					// inform draggable that the helper is in a valid drop zone,
					// used solely in the revert option to handle "valid/invalid".
					draggable.dropped = sortable.element;

					// need to refreshpositions of all sortables in the case that
					// adding to one sortable changes the location of the other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshpositions();
					} );

					// hack so receive/update callbacks work (mostly)
					draggable.currentitem = draggable.element;
					sortable.fromoutside = draggable;
				}

				if ( sortable.currentitem ) {
					sortable._mousedrag( event );

					// copy the sortable's position because the draggable's can potentially reflect
					// a relative position, while sortable is always absolute, which the dragged
					// element has now become. (#8809)
					ui.position = sortable.position;
				}
			} else {

				// if it doesn't intersect with the sortable, and it intersected before,
				// we fake the drag stop of the sortable, but make sure it doesn't remove
				// the helper by using cancelhelperremoval.
				if ( sortable.isover ) {

					sortable.isover = 0;
					sortable.cancelhelperremoval = true;

					// calling sortable's mousestop would trigger a revert,
					// so revert must be temporarily false until after mousestop is called.
					sortable.options._revert = sortable.options.revert;
					sortable.options.revert = false;

					sortable._trigger( "out", event, sortable._uihash( sortable ) );
					sortable._mousestop( event, true );

					// restore sortable behaviors that were modfied
					// when the draggable entered the sortable area (#9481)
					sortable.options.revert = sortable.options._revert;
					sortable.options.helper = sortable.options._helper;

					if ( sortable.placeholder ) {
						sortable.placeholder.remove();
					}

					// restore and recalculate the draggable's offset considering the sortable
					// may have modified them in unexpected ways. (#8809, #10669)
					ui.helper.appendto( draggable._parent );
					draggable._refreshoffsets( event );
					ui.position = draggable._generateposition( event, true );

					draggable._trigger( "fromsortable", event );

					// inform draggable that the helper is no longer in a valid drop zone
					draggable.dropped = false;

					// need to refreshpositions of all sortables just in case removing
					// from one sortable changes the location of other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshpositions();
					} );
				}
			}
		} );
	}
} );

$.ui.plugin.add( "draggable", "cursor", {
	start: function( event, ui, instance ) {
		var t = $( "body" ),
			o = instance.options;

		if ( t.css( "cursor" ) ) {
			o._cursor = t.css( "cursor" );
		}
		t.css( "cursor", o.cursor );
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if ( o._cursor ) {
			$( "body" ).css( "cursor", o._cursor );
		}
	}
} );

$.ui.plugin.add( "draggable", "opacity", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;
		if ( t.css( "opacity" ) ) {
			o._opacity = t.css( "opacity" );
		}
		t.css( "opacity", o.opacity );
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if ( o._opacity ) {
			$( ui.helper ).css( "opacity", o._opacity );
		}
	}
} );

$.ui.plugin.add( "draggable", "scroll", {
	start: function( event, ui, i ) {
		if ( !i.scrollparentnothidden ) {
			i.scrollparentnothidden = i.helper.scrollparent( false );
		}

		if ( i.scrollparentnothidden[ 0 ] !== i.document[ 0 ] &&
				i.scrollparentnothidden[ 0 ].tagname !== "html" ) {
			i.overflowoffset = i.scrollparentnothidden.offset();
		}
	},
	drag: function( event, ui, i  ) {

		var o = i.options,
			scrolled = false,
			scrollparent = i.scrollparentnothidden[ 0 ],
			document = i.document[ 0 ];

		if ( scrollparent !== document && scrollparent.tagname !== "html" ) {
			if ( !o.axis || o.axis !== "x" ) {
				if ( ( i.overflowoffset.top + scrollparent.offsetheight ) - event.pagey <
						o.scrollsensitivity ) {
					scrollparent.scrolltop = scrolled = scrollparent.scrolltop + o.scrollspeed;
				} else if ( event.pagey - i.overflowoffset.top < o.scrollsensitivity ) {
					scrollparent.scrolltop = scrolled = scrollparent.scrolltop - o.scrollspeed;
				}
			}

			if ( !o.axis || o.axis !== "y" ) {
				if ( ( i.overflowoffset.left + scrollparent.offsetwidth ) - event.pagex <
						o.scrollsensitivity ) {
					scrollparent.scrollleft = scrolled = scrollparent.scrollleft + o.scrollspeed;
				} else if ( event.pagex - i.overflowoffset.left < o.scrollsensitivity ) {
					scrollparent.scrollleft = scrolled = scrollparent.scrollleft - o.scrollspeed;
				}
			}

		} else {

			if ( !o.axis || o.axis !== "x" ) {
				if ( event.pagey - $( document ).scrolltop() < o.scrollsensitivity ) {
					scrolled = $( document ).scrolltop( $( document ).scrolltop() - o.scrollspeed );
				} else if ( $( window ).height() - ( event.pagey - $( document ).scrolltop() ) <
						o.scrollsensitivity ) {
					scrolled = $( document ).scrolltop( $( document ).scrolltop() + o.scrollspeed );
				}
			}

			if ( !o.axis || o.axis !== "y" ) {
				if ( event.pagex - $( document ).scrollleft() < o.scrollsensitivity ) {
					scrolled = $( document ).scrollleft(
						$( document ).scrollleft() - o.scrollspeed
					);
				} else if ( $( window ).width() - ( event.pagex - $( document ).scrollleft() ) <
						o.scrollsensitivity ) {
					scrolled = $( document ).scrollleft(
						$( document ).scrollleft() + o.scrollspeed
					);
				}
			}

		}

		if ( scrolled !== false && $.ui.ddmanager && !o.dropbehaviour ) {
			$.ui.ddmanager.prepareoffsets( i, event );
		}

	}
} );

$.ui.plugin.add( "draggable", "snap", {
	start: function( event, ui, i ) {

		var o = i.options;

		i.snapelements = [];

		$( o.snap.constructor !== string ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap )
			.each( function() {
				var $t = $( this ),
					$o = $t.offset();
				if ( this !== i.element[ 0 ] ) {
					i.snapelements.push( {
						item: this,
						width: $t.outerwidth(), height: $t.outerheight(),
						top: $o.top, left: $o.left
					} );
				}
			} );

	},
	drag: function( event, ui, inst ) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			o = inst.options,
			d = o.snaptolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperproportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperproportions.height;

		for ( i = inst.snapelements.length - 1; i >= 0; i-- ) {

			l = inst.snapelements[ i ].left - inst.margins.left;
			r = l + inst.snapelements[ i ].width;
			t = inst.snapelements[ i ].top - inst.margins.top;
			b = t + inst.snapelements[ i ].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d ||
					!$.contains( inst.snapelements[ i ].item.ownerdocument,
					inst.snapelements[ i ].item ) ) {
				if ( inst.snapelements[ i ].snapping ) {
					if ( inst.options.snap.release ) {
						inst.options.snap.release.call(
							inst.element,
							event,
							$.extend( inst._uihash(), { snapitem: inst.snapelements[ i ].item } )
						);
					}
				}
				inst.snapelements[ i ].snapping = false;
				continue;
			}

			if ( o.snapmode !== "inner" ) {
				ts = math.abs( t - y2 ) <= d;
				bs = math.abs( b - y1 ) <= d;
				ls = math.abs( l - x2 ) <= d;
				rs = math.abs( r - x1 ) <= d;
				if ( ts ) {
					ui.position.top = inst._convertpositionto( "relative", {
						top: t - inst.helperproportions.height,
						left: 0
					} ).top;
				}
				if ( bs ) {
					ui.position.top = inst._convertpositionto( "relative", {
						top: b,
						left: 0
					} ).top;
				}
				if ( ls ) {
					ui.position.left = inst._convertpositionto( "relative", {
						top: 0,
						left: l - inst.helperproportions.width
					} ).left;
				}
				if ( rs ) {
					ui.position.left = inst._convertpositionto( "relative", {
						top: 0,
						left: r
					} ).left;
				}
			}

			first = ( ts || bs || ls || rs );

			if ( o.snapmode !== "outer" ) {
				ts = math.abs( t - y1 ) <= d;
				bs = math.abs( b - y2 ) <= d;
				ls = math.abs( l - x1 ) <= d;
				rs = math.abs( r - x2 ) <= d;
				if ( ts ) {
					ui.position.top = inst._convertpositionto( "relative", {
						top: t,
						left: 0
					} ).top;
				}
				if ( bs ) {
					ui.position.top = inst._convertpositionto( "relative", {
						top: b - inst.helperproportions.height,
						left: 0
					} ).top;
				}
				if ( ls ) {
					ui.position.left = inst._convertpositionto( "relative", {
						top: 0,
						left: l
					} ).left;
				}
				if ( rs ) {
					ui.position.left = inst._convertpositionto( "relative", {
						top: 0,
						left: r - inst.helperproportions.width
					} ).left;
				}
			}

			if ( !inst.snapelements[ i ].snapping && ( ts || bs || ls || rs || first ) ) {
				if ( inst.options.snap.snap ) {
					inst.options.snap.snap.call(
						inst.element,
						event,
						$.extend( inst._uihash(), {
							snapitem: inst.snapelements[ i ].item
						} ) );
				}
			}
			inst.snapelements[ i ].snapping = ( ts || bs || ls || rs || first );

		}

	}
} );

$.ui.plugin.add( "draggable", "stack", {
	start: function( event, ui, instance ) {
		var min,
			o = instance.options,
			group = $.makearray( $( o.stack ) ).sort( function( a, b ) {
				return ( parseint( $( a ).css( "zindex" ), 10 ) || 0 ) -
					( parseint( $( b ).css( "zindex" ), 10 ) || 0 );
			} );

		if ( !group.length ) {
			return;
		}

		min = parseint( $( group[ 0 ] ).css( "zindex" ), 10 ) || 0;
		$( group ).each( function( i ) {
			$( this ).css( "zindex", min + i );
		} );
		this.css( "zindex", ( min + group.length ) );
	}
} );

$.ui.plugin.add( "draggable", "zindex", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;

		if ( t.css( "zindex" ) ) {
			o._zindex = t.css( "zindex" );
		}
		t.css( "zindex", o.zindex );
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;

		if ( o._zindex ) {
			$( ui.helper ).css( "zindex", o._zindex );
		}
	}
} );

return $.ui.draggable;

} );


