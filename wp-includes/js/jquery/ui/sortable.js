/*!
 * jquery ui sortable 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: sortable
//>>group: interactions
//>>description: enables items in a list to be sorted using the mouse.
//>>docs: https://api.jqueryui.com/sortable/
//>>demos: https://jqueryui.com/sortable/
//>>css.structure: ../../themes/base/sortable.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./mouse",
			"../data",
			"../ie",
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

return $.widget( "ui.sortable", $.ui.mouse, {
	version: "1.13.3",
	widgeteventprefix: "sort",
	ready: false,
	options: {
		appendto: "parent",
		axis: false,
		connectwith: false,
		containment: false,
		cursor: "auto",
		cursorat: false,
		droponempty: true,
		forceplaceholdersize: false,
		forcehelpersize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: "> *",
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollsensitivity: 20,
		scrollspeed: 20,
		scope: "default",
		tolerance: "intersect",
		zindex: 1000,

		// callbacks
		activate: null,
		beforestop: null,
		change: null,
		deactivate: null,
		out: null,
		over: null,
		receive: null,
		remove: null,
		sort: null,
		start: null,
		stop: null,
		update: null
	},

	_isoveraxis: function( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	},

	_isfloating: function( item ) {
		return ( /left|right/ ).test( item.css( "float" ) ) ||
			( /inline|table-cell/ ).test( item.css( "display" ) );
	},

	_create: function() {
		this.containercache = {};
		this._addclass( "ui-sortable" );

		//get the items
		this.refresh();

		//let's determine the parent's offset
		this.offset = this.element.offset();

		//initialize mouse events for interaction
		this._mouseinit();

		this._sethandleclassname();

		//we're ready to go
		this.ready = true;

	},

	_setoption: function( key, value ) {
		this._super( key, value );

		if ( key === "handle" ) {
			this._sethandleclassname();
		}
	},

	_sethandleclassname: function() {
		var that = this;
		this._removeclass( this.element.find( ".ui-sortable-handle" ), "ui-sortable-handle" );
		$.each( this.items, function() {
			that._addclass(
				this.instance.options.handle ?
					this.item.find( this.instance.options.handle ) :
					this.item,
				"ui-sortable-handle"
			);
		} );
	},

	_destroy: function() {
		this._mousedestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- ) {
			this.items[ i ].item.removedata( this.widgetname + "-item" );
		}

		return this;
	},

	_mousecapture: function( event, overridehandle ) {
		var currentitem = null,
			validhandle = false,
			that = this;

		if ( this.reverting ) {
			return false;
		}

		if ( this.options.disabled || this.options.type === "static" ) {
			return false;
		}

		//we have to refresh the items data once first
		this._refreshitems( event );

		//find out if the clicked node (or one of its parents) is a actual item in this.items
		$( event.target ).parents().each( function() {
			if ( $.data( this, that.widgetname + "-item" ) === that ) {
				currentitem = $( this );
				return false;
			}
		} );
		if ( $.data( event.target, that.widgetname + "-item" ) === that ) {
			currentitem = $( event.target );
		}

		if ( !currentitem ) {
			return false;
		}
		if ( this.options.handle && !overridehandle ) {
			$( this.options.handle, currentitem ).find( "*" ).addback().each( function() {
				if ( this === event.target ) {
					validhandle = true;
				}
			} );
			if ( !validhandle ) {
				return false;
			}
		}

		this.currentitem = currentitem;
		this._removecurrentsfromitems();
		return true;

	},

	_mousestart: function( event, overridehandle, noactivation ) {

		var i, body,
			o = this.options;

		this.currentcontainer = this;

		//we only need to call refreshpositions, because the refreshitems call has been moved to
		// mousecapture
		this.refreshpositions();

		//prepare the dragged items parent
		this.appendto = $( o.appendto !== "parent" ?
				o.appendto :
				this.currentitem.parent() );

		//create and append the visible helper
		this.helper = this._createhelper( event );

		//cache the helper size
		this._cachehelperproportions();

		/*
		 * - position generation -
		 * this block generates everything position related - it's the core of draggables.
		 */

		//cache the margins of the original element
		this._cachemargins();

		//the element's absolute position on the page minus margins
		this.offset = this.currentitem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend( this.offset, {
			click: { //where the click happened, relative to the element
				left: event.pagex - this.offset.left,
				top: event.pagey - this.offset.top
			},

			// this is a relative to absolute position minus the actual position calculation -
			// only used for relative positioned helper
			relative: this._getrelativeoffset()
		} );

		// after we get the helper offset, but before we get the parent offset we can
		// change the helper's position to absolute
		// todo: still need to figure out a way to make relative sorting possible
		this.helper.css( "position", "absolute" );
		this.cssposition = this.helper.css( "position" );

		//adjust the mouse offset relative to the helper if "cursorat" is supplied
		if ( o.cursorat ) {
			this._adjustoffsetfromhelper( o.cursorat );
		}

		//cache the former dom position
		this.domposition = {
			prev: this.currentitem.prev()[ 0 ],
			parent: this.currentitem.parent()[ 0 ]
		};

		// if the helper is not the original, hide the original so it's not playing any role during
		// the drag, won't cause anything bad this way
		if ( this.helper[ 0 ] !== this.currentitem[ 0 ] ) {
			this.currentitem.hide();
		}

		//create the placeholder
		this._createplaceholder();

		//get the next scrolling parent
		this.scrollparent = this.placeholder.scrollparent();

		$.extend( this.offset, {
			parent: this._getparentoffset()
		} );

		//set a containment if given in the options
		if ( o.containment ) {
			this._setcontainment();
		}

		if ( o.cursor && o.cursor !== "auto" ) { // cursor option
			body = this.document.find( "body" );

			// support: ie
			this.storedcursor = body.css( "cursor" );
			body.css( "cursor", o.cursor );

			this.storedstylesheet =
				$( "<style>*{ cursor: " + o.cursor + " !important; }</style>" ).appendto( body );
		}

		// we need to make sure to grab the zindex before setting the
		// opacity, because setting the opacity to anything lower than 1
		// causes the zindex to change from "auto" to 0.
		if ( o.zindex ) { // zindex option
			if ( this.helper.css( "zindex" ) ) {
				this._storedzindex = this.helper.css( "zindex" );
			}
			this.helper.css( "zindex", o.zindex );
		}

		if ( o.opacity ) { // opacity option
			if ( this.helper.css( "opacity" ) ) {
				this._storedopacity = this.helper.css( "opacity" );
			}
			this.helper.css( "opacity", o.opacity );
		}

		//prepare scrolling
		if ( this.scrollparent[ 0 ] !== this.document[ 0 ] &&
				this.scrollparent[ 0 ].tagname !== "html" ) {
			this.overflowoffset = this.scrollparent.offset();
		}

		//call callbacks
		this._trigger( "start", event, this._uihash() );

		//recache the helper size
		if ( !this._preservehelperproportions ) {
			this._cachehelperproportions();
		}

		//post "activate" events to possible containers
		if ( !noactivation ) {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "activate", event, this._uihash( this ) );
			}
		}

		//prepare possible droppables
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.current = this;
		}

		if ( $.ui.ddmanager && !o.dropbehaviour ) {
			$.ui.ddmanager.prepareoffsets( this, event );
		}

		this.dragging = true;

		this._addclass( this.helper, "ui-sortable-helper" );

		//move the helper, if needed
		if ( !this.helper.parent().is( this.appendto ) ) {
			this.helper.detach().appendto( this.appendto );

			//update position
			this.offset.parent = this._getparentoffset();
		}

		//generate the original position
		this.position = this.originalposition = this._generateposition( event );
		this.originalpagex = event.pagex;
		this.originalpagey = event.pagey;
		this.lastpositionabs = this.positionabs = this._convertpositionto( "absolute" );

		this._mousedrag( event );

		return true;

	},

	_scroll: function( event ) {
		var o = this.options,
			scrolled = false;

		if ( this.scrollparent[ 0 ] !== this.document[ 0 ] &&
				this.scrollparent[ 0 ].tagname !== "html" ) {

			if ( ( this.overflowoffset.top + this.scrollparent[ 0 ].offsetheight ) -
					event.pagey < o.scrollsensitivity ) {
				this.scrollparent[ 0 ].scrolltop =
					scrolled = this.scrollparent[ 0 ].scrolltop + o.scrollspeed;
			} else if ( event.pagey - this.overflowoffset.top < o.scrollsensitivity ) {
				this.scrollparent[ 0 ].scrolltop =
					scrolled = this.scrollparent[ 0 ].scrolltop - o.scrollspeed;
			}

			if ( ( this.overflowoffset.left + this.scrollparent[ 0 ].offsetwidth ) -
					event.pagex < o.scrollsensitivity ) {
				this.scrollparent[ 0 ].scrollleft = scrolled =
					this.scrollparent[ 0 ].scrollleft + o.scrollspeed;
			} else if ( event.pagex - this.overflowoffset.left < o.scrollsensitivity ) {
				this.scrollparent[ 0 ].scrollleft = scrolled =
					this.scrollparent[ 0 ].scrollleft - o.scrollspeed;
			}

		} else {

			if ( event.pagey - this.document.scrolltop() < o.scrollsensitivity ) {
				scrolled = this.document.scrolltop( this.document.scrolltop() - o.scrollspeed );
			} else if ( this.window.height() - ( event.pagey - this.document.scrolltop() ) <
					o.scrollsensitivity ) {
				scrolled = this.document.scrolltop( this.document.scrolltop() + o.scrollspeed );
			}

			if ( event.pagex - this.document.scrollleft() < o.scrollsensitivity ) {
				scrolled = this.document.scrollleft(
					this.document.scrollleft() - o.scrollspeed
				);
			} else if ( this.window.width() - ( event.pagex - this.document.scrollleft() ) <
					o.scrollsensitivity ) {
				scrolled = this.document.scrollleft(
					this.document.scrollleft() + o.scrollspeed
				);
			}

		}

		return scrolled;
	},

	_mousedrag: function( event ) {
		var i, item, itemelement, intersection,
			o = this.options;

		//compute the helpers position
		this.position = this._generateposition( event );
		this.positionabs = this._convertpositionto( "absolute" );

		//set the helper position
		if ( !this.options.axis || this.options.axis !== "y" ) {
			this.helper[ 0 ].style.left = this.position.left + "px";
		}
		if ( !this.options.axis || this.options.axis !== "x" ) {
			this.helper[ 0 ].style.top = this.position.top + "px";
		}

		//do scrolling
		if ( o.scroll ) {
			if ( this._scroll( event ) !== false ) {

				//update item positions used in position checks
				this._refreshitempositions( true );

				if ( $.ui.ddmanager && !o.dropbehaviour ) {
					$.ui.ddmanager.prepareoffsets( this, event );
				}
			}
		}

		this.dragdirection = {
			vertical: this._getdragverticaldirection(),
			horizontal: this._getdraghorizontaldirection()
		};

		//rearrange
		for ( i = this.items.length - 1; i >= 0; i-- ) {

			//cache variables and intersection, continue if no intersection
			item = this.items[ i ];
			itemelement = item.item[ 0 ];
			intersection = this._intersectswithpointer( item );
			if ( !intersection ) {
				continue;
			}

			// only put the placeholder inside the current container, skip all
			// items from other containers. this works because when moving
			// an item from one container to another the
			// currentcontainer is switched before the placeholder is moved.
			//
			// without this, moving items in "sub-sortables" can cause
			// the placeholder to jitter between the outer and inner container.
			if ( item.instance !== this.currentcontainer ) {
				continue;
			}

			// cannot intersect with itself
			// no useless actions that have been done before
			// no action if the item moved is the parent of the item checked
			if ( itemelement !== this.currentitem[ 0 ] &&
				this.placeholder[ intersection === 1 ?
				"next" : "prev" ]()[ 0 ] !== itemelement &&
				!$.contains( this.placeholder[ 0 ], itemelement ) &&
				( this.options.type === "semi-dynamic" ?
					!$.contains( this.element[ 0 ], itemelement ) :
					true
				)
			) {

				this.direction = intersection === 1 ? "down" : "up";

				if ( this.options.tolerance === "pointer" ||
						this._intersectswithsides( item ) ) {
					this._rearrange( event, item );
				} else {
					break;
				}

				this._trigger( "change", event, this._uihash() );
				break;
			}
		}

		//post events to containers
		this._contactcontainers( event );

		//interconnect with droppables
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.drag( this, event );
		}

		//call callbacks
		this._trigger( "sort", event, this._uihash() );

		this.lastpositionabs = this.positionabs;
		return false;

	},

	_mousestop: function( event, nopropagation ) {

		if ( !event ) {
			return;
		}

		//if we are using droppables, inform the manager about the drop
		if ( $.ui.ddmanager && !this.options.dropbehaviour ) {
			$.ui.ddmanager.drop( this, event );
		}

		if ( this.options.revert ) {
			var that = this,
				cur = this.placeholder.offset(),
				axis = this.options.axis,
				animation = {};

			if ( !axis || axis === "x" ) {
				animation.left = cur.left - this.offset.parent.left - this.margins.left +
					( this.offsetparent[ 0 ] === this.document[ 0 ].body ?
						0 :
						this.offsetparent[ 0 ].scrollleft
					);
			}
			if ( !axis || axis === "y" ) {
				animation.top = cur.top - this.offset.parent.top - this.margins.top +
					( this.offsetparent[ 0 ] === this.document[ 0 ].body ?
						0 :
						this.offsetparent[ 0 ].scrolltop
					);
			}
			this.reverting = true;
			$( this.helper ).animate(
				animation,
				parseint( this.options.revert, 10 ) || 500,
				function() {
					that._clear( event );
				}
			);
		} else {
			this._clear( event, nopropagation );
		}

		return false;

	},

	cancel: function() {

		if ( this.dragging ) {

			this._mouseup( new $.event( "mouseup", { target: null } ) );

			if ( this.options.helper === "original" ) {
				this.currentitem.css( this._storedcss );
				this._removeclass( this.currentitem, "ui-sortable-helper" );
			} else {
				this.currentitem.show();
			}

			//post deactivating events to containers
			for ( var i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "deactivate", null, this._uihash( this ) );
				if ( this.containers[ i ].containercache.over ) {
					this.containers[ i ]._trigger( "out", null, this._uihash( this ) );
					this.containers[ i ].containercache.over = 0;
				}
			}

		}

		if ( this.placeholder ) {

			//$(this.placeholder[0]).remove(); would have been the jquery way - unfortunately,
			// it unbinds all events from the original node!
			if ( this.placeholder[ 0 ].parentnode ) {
				this.placeholder[ 0 ].parentnode.removechild( this.placeholder[ 0 ] );
			}
			if ( this.options.helper !== "original" && this.helper &&
					this.helper[ 0 ].parentnode ) {
				this.helper.remove();
			}

			$.extend( this, {
				helper: null,
				dragging: false,
				reverting: false,
				_nofinalsort: null
			} );

			if ( this.domposition.prev ) {
				$( this.domposition.prev ).after( this.currentitem );
			} else {
				$( this.domposition.parent ).prepend( this.currentitem );
			}
		}

		return this;

	},

	serialize: function( o ) {

		var items = this._getitemsasjquery( o && o.connected ),
			str = [];
		o = o || {};

		$( items ).each( function() {
			var res = ( $( o.item || this ).attr( o.attribute || "id" ) || "" )
				.match( o.expression || ( /(.+)[\-=_](.+)/ ) );
			if ( res ) {
				str.push(
					( o.key || res[ 1 ] + "[]" ) +
					"=" + ( o.key && o.expression ? res[ 1 ] : res[ 2 ] ) );
			}
		} );

		if ( !str.length && o.key ) {
			str.push( o.key + "=" );
		}

		return str.join( "&" );

	},

	toarray: function( o ) {

		var items = this._getitemsasjquery( o && o.connected ),
			ret = [];

		o = o || {};

		items.each( function() {
			ret.push( $( o.item || this ).attr( o.attribute || "id" ) || "" );
		} );
		return ret;

	},

	/* be careful with the following core functions */
	_intersectswith: function( item ) {

		var x1 = this.positionabs.left,
			x2 = x1 + this.helperproportions.width,
			y1 = this.positionabs.top,
			y2 = y1 + this.helperproportions.height,
			l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height,
			dyclick = this.offset.click.top,
			dxclick = this.offset.click.left,
			isoverelementheight = ( this.options.axis === "x" ) || ( ( y1 + dyclick ) > t &&
				( y1 + dyclick ) < b ),
			isoverelementwidth = ( this.options.axis === "y" ) || ( ( x1 + dxclick ) > l &&
				( x1 + dxclick ) < r ),
			isoverelement = isoverelementheight && isoverelementwidth;

		if ( this.options.tolerance === "pointer" ||
			this.options.forcepointerforcontainers ||
			( this.options.tolerance !== "pointer" &&
				this.helperproportions[ this.floating ? "width" : "height" ] >
				item[ this.floating ? "width" : "height" ] )
		) {
			return isoverelement;
		} else {

			return ( l < x1 + ( this.helperproportions.width / 2 ) && // right half
				x2 - ( this.helperproportions.width / 2 ) < r && // left half
				t < y1 + ( this.helperproportions.height / 2 ) && // bottom half
				y2 - ( this.helperproportions.height / 2 ) < b ); // top half

		}
	},

	_intersectswithpointer: function( item ) {
		var verticaldirection, horizontaldirection,
			isoverelementheight = ( this.options.axis === "x" ) ||
				this._isoveraxis(
					this.positionabs.top + this.offset.click.top, item.top, item.height ),
			isoverelementwidth = ( this.options.axis === "y" ) ||
				this._isoveraxis(
					this.positionabs.left + this.offset.click.left, item.left, item.width ),
			isoverelement = isoverelementheight && isoverelementwidth;

		if ( !isoverelement ) {
			return false;
		}

		verticaldirection = this.dragdirection.vertical;
		horizontaldirection = this.dragdirection.horizontal;

		return this.floating ?
			( ( horizontaldirection === "right" || verticaldirection === "down" ) ? 2 : 1 ) :
			( verticaldirection && ( verticaldirection === "down" ? 2 : 1 ) );

	},

	_intersectswithsides: function( item ) {

		var isoverbottomhalf = this._isoveraxis( this.positionabs.top +
				this.offset.click.top, item.top + ( item.height / 2 ), item.height ),
			isoverrighthalf = this._isoveraxis( this.positionabs.left +
				this.offset.click.left, item.left + ( item.width / 2 ), item.width ),
			verticaldirection = this.dragdirection.vertical,
			horizontaldirection = this.dragdirection.horizontal;

		if ( this.floating && horizontaldirection ) {
			return ( ( horizontaldirection === "right" && isoverrighthalf ) ||
				( horizontaldirection === "left" && !isoverrighthalf ) );
		} else {
			return verticaldirection && ( ( verticaldirection === "down" && isoverbottomhalf ) ||
				( verticaldirection === "up" && !isoverbottomhalf ) );
		}

	},

	_getdragverticaldirection: function() {
		var delta = this.positionabs.top - this.lastpositionabs.top;
		return delta !== 0 && ( delta > 0 ? "down" : "up" );
	},

	_getdraghorizontaldirection: function() {
		var delta = this.positionabs.left - this.lastpositionabs.left;
		return delta !== 0 && ( delta > 0 ? "right" : "left" );
	},

	refresh: function( event ) {
		this._refreshitems( event );
		this._sethandleclassname();
		this.refreshpositions();
		return this;
	},

	_connectwith: function() {
		var options = this.options;
		return options.connectwith.constructor === string ?
			[ options.connectwith ] :
			options.connectwith;
	},

	_getitemsasjquery: function( connected ) {

		var i, j, cur, inst,
			items = [],
			queries = [],
			connectwith = this._connectwith();

		if ( connectwith && connected ) {
			for ( i = connectwith.length - 1; i >= 0; i-- ) {
				cur = $( connectwith[ i ], this.document[ 0 ] );
				for ( j = cur.length - 1; j >= 0; j-- ) {
					inst = $.data( cur[ j ], this.widgetfullname );
					if ( inst && inst !== this && !inst.options.disabled ) {
						queries.push( [ typeof inst.options.items === "function" ?
							inst.options.items.call( inst.element ) :
							$( inst.options.items, inst.element )
								.not( ".ui-sortable-helper" )
								.not( ".ui-sortable-placeholder" ), inst ] );
					}
				}
			}
		}

		queries.push( [ typeof this.options.items === "function" ?
			this.options.items
				.call( this.element, null, { options: this.options, item: this.currentitem } ) :
			$( this.options.items, this.element )
				.not( ".ui-sortable-helper" )
				.not( ".ui-sortable-placeholder" ), this ] );

		function additems() {
			items.push( this );
		}
		for ( i = queries.length - 1; i >= 0; i-- ) {
			queries[ i ][ 0 ].each( additems );
		}

		return $( items );

	},

	_removecurrentsfromitems: function() {

		var list = this.currentitem.find( ":data(" + this.widgetname + "-item)" );

		this.items = $.grep( this.items, function( item ) {
			for ( var j = 0; j < list.length; j++ ) {
				if ( list[ j ] === item.item[ 0 ] ) {
					return false;
				}
			}
			return true;
		} );

	},

	_refreshitems: function( event ) {

		this.items = [];
		this.containers = [ this ];

		var i, j, cur, inst, targetdata, _queries, item, querieslength,
			items = this.items,
			queries = [ [ typeof this.options.items === "function" ?
				this.options.items.call( this.element[ 0 ], event, { item: this.currentitem } ) :
				$( this.options.items, this.element ), this ] ],
			connectwith = this._connectwith();

		//shouldn't be run the first time through due to massive slow-down
		if ( connectwith && this.ready ) {
			for ( i = connectwith.length - 1; i >= 0; i-- ) {
				cur = $( connectwith[ i ], this.document[ 0 ] );
				for ( j = cur.length - 1; j >= 0; j-- ) {
					inst = $.data( cur[ j ], this.widgetfullname );
					if ( inst && inst !== this && !inst.options.disabled ) {
						queries.push( [ typeof inst.options.items === "function" ?
							inst.options.items
								.call( inst.element[ 0 ], event, { item: this.currentitem } ) :
							$( inst.options.items, inst.element ), inst ] );
						this.containers.push( inst );
					}
				}
			}
		}

		for ( i = queries.length - 1; i >= 0; i-- ) {
			targetdata = queries[ i ][ 1 ];
			_queries = queries[ i ][ 0 ];

			for ( j = 0, querieslength = _queries.length; j < querieslength; j++ ) {
				item = $( _queries[ j ] );

				// data for target checking (mouse manager)
				item.data( this.widgetname + "-item", targetdata );

				items.push( {
					item: item,
					instance: targetdata,
					width: 0, height: 0,
					left: 0, top: 0
				} );
			}
		}

	},

	_refreshitempositions: function( fast ) {
		var i, item, t, p;

		for ( i = this.items.length - 1; i >= 0; i-- ) {
			item = this.items[ i ];

			//we ignore calculating positions of all connected containers when we're not over them
			if ( this.currentcontainer && item.instance !== this.currentcontainer &&
					item.item[ 0 ] !== this.currentitem[ 0 ] ) {
				continue;
			}

			t = this.options.toleranceelement ?
				$( this.options.toleranceelement, item.item ) :
				item.item;

			if ( !fast ) {
				item.width = t.outerwidth();
				item.height = t.outerheight();
			}

			p = t.offset();
			item.left = p.left;
			item.top = p.top;
		}
	},

	refreshpositions: function( fast ) {

		// determine whether items are being displayed horizontally
		this.floating = this.items.length ?
			this.options.axis === "x" || this._isfloating( this.items[ 0 ].item ) :
			false;

		// this has to be redone because due to the item being moved out/into the offsetparent,
		// the offsetparent's position will change
		if ( this.offsetparent && this.helper ) {
			this.offset.parent = this._getparentoffset();
		}

		this._refreshitempositions( fast );

		var i, p;

		if ( this.options.custom && this.options.custom.refreshcontainers ) {
			this.options.custom.refreshcontainers.call( this );
		} else {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				p = this.containers[ i ].element.offset();
				this.containers[ i ].containercache.left = p.left;
				this.containers[ i ].containercache.top = p.top;
				this.containers[ i ].containercache.width =
					this.containers[ i ].element.outerwidth();
				this.containers[ i ].containercache.height =
					this.containers[ i ].element.outerheight();
			}
		}

		return this;
	},

	_createplaceholder: function( that ) {
		that = that || this;
		var classname, nodename,
			o = that.options;

		if ( !o.placeholder || o.placeholder.constructor === string ) {
			classname = o.placeholder;
			nodename = that.currentitem[ 0 ].nodename.tolowercase();
			o.placeholder = {
				element: function() {

					var element = $( "<" + nodename + ">", that.document[ 0 ] );

					that._addclass( element, "ui-sortable-placeholder",
							classname || that.currentitem[ 0 ].classname )
						._removeclass( element, "ui-sortable-helper" );

					if ( nodename === "tbody" ) {
						that._createtrplaceholder(
							that.currentitem.find( "tr" ).eq( 0 ),
							$( "<tr>", that.document[ 0 ] ).appendto( element )
						);
					} else if ( nodename === "tr" ) {
						that._createtrplaceholder( that.currentitem, element );
					} else if ( nodename === "img" ) {
						element.attr( "src", that.currentitem.attr( "src" ) );
					}

					if ( !classname ) {
						element.css( "visibility", "hidden" );
					}

					return element;
				},
				update: function( container, p ) {

					// 1. if a classname is set as 'placeholder option, we don't force sizes -
					// the class is responsible for that
					// 2. the option 'forceplaceholdersize can be enabled to force it even if a
					// class name is specified
					if ( classname && !o.forceplaceholdersize ) {
						return;
					}

					// if the element doesn't have a actual height or width by itself (without
					// styles coming from a stylesheet), it receives the inline height and width
					// from the dragged item. or, if it's a tbody or tr, it's going to have a height
					// anyway since we're populating them with <td>s above, but they're unlikely to
					// be the correct height on their own if the row heights are dynamic, so we'll
					// always assign the height of the dragged item given forceplaceholdersize
					// is true.
					if ( !p.height() || ( o.forceplaceholdersize &&
							( nodename === "tbody" || nodename === "tr" ) ) ) {
						p.height(
							that.currentitem.innerheight() -
							parseint( that.currentitem.css( "paddingtop" ) || 0, 10 ) -
							parseint( that.currentitem.css( "paddingbottom" ) || 0, 10 ) );
					}
					if ( !p.width() ) {
						p.width(
							that.currentitem.innerwidth() -
							parseint( that.currentitem.css( "paddingleft" ) || 0, 10 ) -
							parseint( that.currentitem.css( "paddingright" ) || 0, 10 ) );
					}
				}
			};
		}

		//create the placeholder
		that.placeholder = $( o.placeholder.element.call( that.element, that.currentitem ) );

		//append it after the actual current item
		that.currentitem.after( that.placeholder );

		//update the size of the placeholder (todo: logic to fuzzy, see line 316/317)
		o.placeholder.update( that, that.placeholder );

	},

	_createtrplaceholder: function( sourcetr, targettr ) {
		var that = this;

		sourcetr.children().each( function() {
			$( "<td>&#160;</td>", that.document[ 0 ] )
				.attr( "colspan", $( this ).attr( "colspan" ) || 1 )
				.appendto( targettr );
		} );
	},

	_contactcontainers: function( event ) {
		var i, j, dist, itemwithleastdistance, posproperty, sizeproperty, cur, nearbottom,
			floating, axis,
			innermostcontainer = null,
			innermostindex = null;

		// get innermost container that intersects with item
		for ( i = this.containers.length - 1; i >= 0; i-- ) {

			// never consider a container that's located within the item itself
			if ( $.contains( this.currentitem[ 0 ], this.containers[ i ].element[ 0 ] ) ) {
				continue;
			}

			if ( this._intersectswith( this.containers[ i ].containercache ) ) {

				// if we've already found a container and it's more "inner" than this, then continue
				if ( innermostcontainer &&
						$.contains(
							this.containers[ i ].element[ 0 ],
							innermostcontainer.element[ 0 ] ) ) {
					continue;
				}

				innermostcontainer = this.containers[ i ];
				innermostindex = i;

			} else {

				// container doesn't intersect. trigger "out" event if necessary
				if ( this.containers[ i ].containercache.over ) {
					this.containers[ i ]._trigger( "out", event, this._uihash( this ) );
					this.containers[ i ].containercache.over = 0;
				}
			}

		}

		// if no intersecting containers found, return
		if ( !innermostcontainer ) {
			return;
		}

		// move the item into the container if it's not there already
		if ( this.containers.length === 1 ) {
			if ( !this.containers[ innermostindex ].containercache.over ) {
				this.containers[ innermostindex ]._trigger( "over", event, this._uihash( this ) );
				this.containers[ innermostindex ].containercache.over = 1;
			}
		} else {

			// when entering a new container, we will find the item with the least distance and
			// append our item near it
			dist = 10000;
			itemwithleastdistance = null;
			floating = innermostcontainer.floating || this._isfloating( this.currentitem );
			posproperty = floating ? "left" : "top";
			sizeproperty = floating ? "width" : "height";
			axis = floating ? "pagex" : "pagey";

			for ( j = this.items.length - 1; j >= 0; j-- ) {
				if ( !$.contains(
						this.containers[ innermostindex ].element[ 0 ], this.items[ j ].item[ 0 ] )
				) {
					continue;
				}
				if ( this.items[ j ].item[ 0 ] === this.currentitem[ 0 ] ) {
					continue;
				}

				cur = this.items[ j ].item.offset()[ posproperty ];
				nearbottom = false;
				if ( event[ axis ] - cur > this.items[ j ][ sizeproperty ] / 2 ) {
					nearbottom = true;
				}

				if ( math.abs( event[ axis ] - cur ) < dist ) {
					dist = math.abs( event[ axis ] - cur );
					itemwithleastdistance = this.items[ j ];
					this.direction = nearbottom ? "up" : "down";
				}
			}

			//check if droponempty is enabled
			if ( !itemwithleastdistance && !this.options.droponempty ) {
				return;
			}

			if ( this.currentcontainer === this.containers[ innermostindex ] ) {
				if ( !this.currentcontainer.containercache.over ) {
					this.containers[ innermostindex ]._trigger( "over", event, this._uihash() );
					this.currentcontainer.containercache.over = 1;
				}
				return;
			}

			if ( itemwithleastdistance ) {
				this._rearrange( event, itemwithleastdistance, null, true );
			} else {
				this._rearrange( event, null, this.containers[ innermostindex ].element, true );
			}
			this._trigger( "change", event, this._uihash() );
			this.containers[ innermostindex ]._trigger( "change", event, this._uihash( this ) );
			this.currentcontainer = this.containers[ innermostindex ];

			//update the placeholder
			this.options.placeholder.update( this.currentcontainer, this.placeholder );

			//update scrollparent
			this.scrollparent = this.placeholder.scrollparent();

			//update overflowoffset
			if ( this.scrollparent[ 0 ] !== this.document[ 0 ] &&
					this.scrollparent[ 0 ].tagname !== "html" ) {
				this.overflowoffset = this.scrollparent.offset();
			}

			this.containers[ innermostindex ]._trigger( "over", event, this._uihash( this ) );
			this.containers[ innermostindex ].containercache.over = 1;
		}

	},

	_createhelper: function( event ) {

		var o = this.options,
			helper = typeof o.helper === "function" ?
				$( o.helper.apply( this.element[ 0 ], [ event, this.currentitem ] ) ) :
				( o.helper === "clone" ? this.currentitem.clone() : this.currentitem );

		//add the helper to the dom if that didn't happen already
		if ( !helper.parents( "body" ).length ) {
			this.appendto[ 0 ].appendchild( helper[ 0 ] );
		}

		if ( helper[ 0 ] === this.currentitem[ 0 ] ) {
			this._storedcss = {
				width: this.currentitem[ 0 ].style.width,
				height: this.currentitem[ 0 ].style.height,
				position: this.currentitem.css( "position" ),
				top: this.currentitem.css( "top" ),
				left: this.currentitem.css( "left" )
			};
		}

		if ( !helper[ 0 ].style.width || o.forcehelpersize ) {
			helper.width( this.currentitem.width() );
		}
		if ( !helper[ 0 ].style.height || o.forcehelpersize ) {
			helper.height( this.currentitem.height() );
		}

		return helper;

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

	_getparentoffset: function() {

		//get the offsetparent and cache its position
		this.offsetparent = this.helper.offsetparent();
		var po = this.offsetparent.offset();

		// this is a special case where we need to modify a offset calculated on start, since the
		// following happened:
		// 1. the position of the helper is absolute, so it's position is calculated based on the
		// next positioned parent
		// 2. the actual offset parent is a child of the scroll parent, and the scroll parent isn't
		// the document, which means that the scroll is included in the initial calculation of the
		// offset of the parent, and never recalculated upon drag
		if ( this.cssposition === "absolute" && this.scrollparent[ 0 ] !== this.document[ 0 ] &&
				$.contains( this.scrollparent[ 0 ], this.offsetparent[ 0 ] ) ) {
			po.left += this.scrollparent.scrollleft();
			po.top += this.scrollparent.scrolltop();
		}

		// this needs to be actually done for all browsers, since pagex/pagey includes this
		// information with an ugly ie fix
		if ( this.offsetparent[ 0 ] === this.document[ 0 ].body ||
				( this.offsetparent[ 0 ].tagname &&
				this.offsetparent[ 0 ].tagname.tolowercase() === "html" && $.ui.ie ) ) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + ( parseint( this.offsetparent.css( "bordertopwidth" ), 10 ) || 0 ),
			left: po.left + ( parseint( this.offsetparent.css( "borderleftwidth" ), 10 ) || 0 )
		};

	},

	_getrelativeoffset: function() {

		if ( this.cssposition === "relative" ) {
			var p = this.currentitem.position();
			return {
				top: p.top - ( parseint( this.helper.css( "top" ), 10 ) || 0 ) +
					this.scrollparent.scrolltop(),
				left: p.left - ( parseint( this.helper.css( "left" ), 10 ) || 0 ) +
					this.scrollparent.scrollleft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cachemargins: function() {
		this.margins = {
			left: ( parseint( this.currentitem.css( "marginleft" ), 10 ) || 0 ),
			top: ( parseint( this.currentitem.css( "margintop" ), 10 ) || 0 )
		};
	},

	_cachehelperproportions: function() {
		this.helperproportions = {
			width: this.helper.outerwidth(),
			height: this.helper.outerheight()
		};
	},

	_setcontainment: function() {

		var ce, co, over,
			o = this.options;
		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentnode;
		}
		if ( o.containment === "document" || o.containment === "window" ) {
			this.containment = [
				0 - this.offset.relative.left - this.offset.parent.left,
				0 - this.offset.relative.top - this.offset.parent.top,
				o.containment === "document" ?
					this.document.width() :
					this.window.width() - this.helperproportions.width - this.margins.left,
				( o.containment === "document" ?
					( this.document.height() || document.body.parentnode.scrollheight ) :
					this.window.height() || this.document[ 0 ].body.parentnode.scrollheight
				) - this.helperproportions.height - this.margins.top
			];
		}

		if ( !( /^(document|window|parent)$/ ).test( o.containment ) ) {
			ce = $( o.containment )[ 0 ];
			co = $( o.containment ).offset();
			over = ( $( ce ).css( "overflow" ) !== "hidden" );

			this.containment = [
				co.left + ( parseint( $( ce ).css( "borderleftwidth" ), 10 ) || 0 ) +
					( parseint( $( ce ).css( "paddingleft" ), 10 ) || 0 ) - this.margins.left,
				co.top + ( parseint( $( ce ).css( "bordertopwidth" ), 10 ) || 0 ) +
					( parseint( $( ce ).css( "paddingtop" ), 10 ) || 0 ) - this.margins.top,
				co.left + ( over ? math.max( ce.scrollwidth, ce.offsetwidth ) : ce.offsetwidth ) -
					( parseint( $( ce ).css( "borderleftwidth" ), 10 ) || 0 ) -
					( parseint( $( ce ).css( "paddingright" ), 10 ) || 0 ) -
					this.helperproportions.width - this.margins.left,
				co.top + ( over ? math.max( ce.scrollheight, ce.offsetheight ) : ce.offsetheight ) -
					( parseint( $( ce ).css( "bordertopwidth" ), 10 ) || 0 ) -
					( parseint( $( ce ).css( "paddingbottom" ), 10 ) || 0 ) -
					this.helperproportions.height - this.margins.top
			];
		}

	},

	_convertpositionto: function( d, pos ) {

		if ( !pos ) {
			pos = this.position;
		}
		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssposition === "absolute" &&
				!( this.scrollparent[ 0 ] !== this.document[ 0 ] &&
				$.contains( this.scrollparent[ 0 ], this.offsetparent[ 0 ] ) ) ?
					this.offsetparent :
					this.scrollparent,
			scrollisrootnode = ( /(html|body)/i ).test( scroll[ 0 ].tagname );

		return {
			top: (

				// the absolute mouse position
				pos.top	+

				// only for relative positioned nodes: relative offset from element to offset parent
				this.offset.relative.top * mod +

				// the offsetparent's offset without borders (offset + border)
				this.offset.parent.top * mod -
				( ( this.cssposition === "fixed" ?
					-this.scrollparent.scrolltop() :
					( scrollisrootnode ? 0 : scroll.scrolltop() ) ) * mod )
			),
			left: (

				// the absolute mouse position
				pos.left +

				// only for relative positioned nodes: relative offset from element to offset parent
				this.offset.relative.left * mod +

				// the offsetparent's offset without borders (offset + border)
				this.offset.parent.left * mod	-
				( ( this.cssposition === "fixed" ?
					-this.scrollparent.scrollleft() : scrollisrootnode ? 0 :
					scroll.scrollleft() ) * mod )
			)
		};

	},

	_generateposition: function( event ) {

		var top, left,
			o = this.options,
			pagex = event.pagex,
			pagey = event.pagey,
			scroll = this.cssposition === "absolute" &&
				!( this.scrollparent[ 0 ] !== this.document[ 0 ] &&
				$.contains( this.scrollparent[ 0 ], this.offsetparent[ 0 ] ) ) ?
					this.offsetparent :
					this.scrollparent,
				scrollisrootnode = ( /(html|body)/i ).test( scroll[ 0 ].tagname );

		// this is another very weird special case that only happens for relative elements:
		// 1. if the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if ( this.cssposition === "relative" && !( this.scrollparent[ 0 ] !== this.document[ 0 ] &&
				this.scrollparent[ 0 ] !== this.offsetparent[ 0 ] ) ) {
			this.offset.relative = this._getrelativeoffset();
		}

		/*
		 * - position constraining -
		 * constrain the position to a mix of grid, containment.
		 */

		if ( this.originalposition ) { //if we are not dragging yet, we won't check for options

			if ( this.containment ) {
				if ( event.pagex - this.offset.click.left < this.containment[ 0 ] ) {
					pagex = this.containment[ 0 ] + this.offset.click.left;
				}
				if ( event.pagey - this.offset.click.top < this.containment[ 1 ] ) {
					pagey = this.containment[ 1 ] + this.offset.click.top;
				}
				if ( event.pagex - this.offset.click.left > this.containment[ 2 ] ) {
					pagex = this.containment[ 2 ] + this.offset.click.left;
				}
				if ( event.pagey - this.offset.click.top > this.containment[ 3 ] ) {
					pagey = this.containment[ 3 ] + this.offset.click.top;
				}
			}

			if ( o.grid ) {
				top = this.originalpagey + math.round( ( pagey - this.originalpagey ) /
					o.grid[ 1 ] ) * o.grid[ 1 ];
				pagey = this.containment ?
					( ( top - this.offset.click.top >= this.containment[ 1 ] &&
						top - this.offset.click.top <= this.containment[ 3 ] ) ?
							top :
							( ( top - this.offset.click.top >= this.containment[ 1 ] ) ?
								top - o.grid[ 1 ] : top + o.grid[ 1 ] ) ) :
								top;

				left = this.originalpagex + math.round( ( pagex - this.originalpagex ) /
					o.grid[ 0 ] ) * o.grid[ 0 ];
				pagex = this.containment ?
					( ( left - this.offset.click.left >= this.containment[ 0 ] &&
						left - this.offset.click.left <= this.containment[ 2 ] ) ?
							left :
							( ( left - this.offset.click.left >= this.containment[ 0 ] ) ?
								left - o.grid[ 0 ] : left + o.grid[ 0 ] ) ) :
								left;
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
				( ( this.cssposition === "fixed" ?
					-this.scrollparent.scrolltop() :
					( scrollisrootnode ? 0 : scroll.scrolltop() ) ) )
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
				( ( this.cssposition === "fixed" ?
					-this.scrollparent.scrollleft() :
					scrollisrootnode ? 0 : scroll.scrollleft() ) )
			)
		};

	},

	_rearrange: function( event, i, a, hardrefresh ) {

		if ( a ) {
			a[ 0 ].appendchild( this.placeholder[ 0 ] );
		} else {
			i.item[ 0 ].parentnode.insertbefore( this.placeholder[ 0 ],
				( this.direction === "down" ? i.item[ 0 ] : i.item[ 0 ].nextsibling ) );
		}

		//various things done here to improve the performance:
		// 1. we create a settimeout, that calls refreshpositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout,
		// if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay( function() {
			if ( counter === this.counter ) {

				//precompute after each dom insertion, not on mousemove
				this.refreshpositions( !hardrefresh );
			}
		} );

	},

	_clear: function( event, nopropagation ) {

		this.reverting = false;

		// we delay all events that have to be triggered to after the point where the placeholder
		// has been removed and everything else normalized again
		var i,
			delayedtriggers = [];

		// we first have to update the dom position of the actual currentitem
		// note: don't do it if the current item is already removed (by a user), or it gets
		// reappended (see #4088)
		if ( !this._nofinalsort && this.currentitem.parent().length ) {
			this.placeholder.before( this.currentitem );
		}
		this._nofinalsort = null;

		if ( this.helper[ 0 ] === this.currentitem[ 0 ] ) {
			for ( i in this._storedcss ) {
				if ( this._storedcss[ i ] === "auto" || this._storedcss[ i ] === "static" ) {
					this._storedcss[ i ] = "";
				}
			}
			this.currentitem.css( this._storedcss );
			this._removeclass( this.currentitem, "ui-sortable-helper" );
		} else {
			this.currentitem.show();
		}

		if ( this.fromoutside && !nopropagation ) {
			delayedtriggers.push( function( event ) {
				this._trigger( "receive", event, this._uihash( this.fromoutside ) );
			} );
		}
		if ( ( this.fromoutside ||
				this.domposition.prev !==
				this.currentitem.prev().not( ".ui-sortable-helper" )[ 0 ] ||
				this.domposition.parent !== this.currentitem.parent()[ 0 ] ) && !nopropagation ) {

			// trigger update callback if the dom position has changed
			delayedtriggers.push( function( event ) {
				this._trigger( "update", event, this._uihash() );
			} );
		}

		// check if the items container has changed and trigger appropriate
		// events.
		if ( this !== this.currentcontainer ) {
			if ( !nopropagation ) {
				delayedtriggers.push( function( event ) {
					this._trigger( "remove", event, this._uihash() );
				} );
				delayedtriggers.push( ( function( c ) {
					return function( event ) {
						c._trigger( "receive", event, this._uihash( this ) );
					};
				} ).call( this, this.currentcontainer ) );
				delayedtriggers.push( ( function( c ) {
					return function( event ) {
						c._trigger( "update", event, this._uihash( this ) );
					};
				} ).call( this, this.currentcontainer ) );
			}
		}

		//post events to containers
		function delayevent( type, instance, container ) {
			return function( event ) {
				container._trigger( type, event, instance._uihash( instance ) );
			};
		}
		for ( i = this.containers.length - 1; i >= 0; i-- ) {
			if ( !nopropagation ) {
				delayedtriggers.push( delayevent( "deactivate", this, this.containers[ i ] ) );
			}
			if ( this.containers[ i ].containercache.over ) {
				delayedtriggers.push( delayevent( "out", this, this.containers[ i ] ) );
				this.containers[ i ].containercache.over = 0;
			}
		}

		//do what was originally in plugins
		if ( this.storedcursor ) {
			this.document.find( "body" ).css( "cursor", this.storedcursor );
			this.storedstylesheet.remove();
		}
		if ( this._storedopacity ) {
			this.helper.css( "opacity", this._storedopacity );
		}
		if ( this._storedzindex ) {
			this.helper.css( "zindex", this._storedzindex === "auto" ? "" : this._storedzindex );
		}

		this.dragging = false;

		if ( !nopropagation ) {
			this._trigger( "beforestop", event, this._uihash() );
		}

		//$(this.placeholder[0]).remove(); would have been the jquery way - unfortunately,
		// it unbinds all events from the original node!
		this.placeholder[ 0 ].parentnode.removechild( this.placeholder[ 0 ] );

		if ( !this.cancelhelperremoval ) {
			if ( this.helper[ 0 ] !== this.currentitem[ 0 ] ) {
				this.helper.remove();
			}
			this.helper = null;
		}

		if ( !nopropagation ) {
			for ( i = 0; i < delayedtriggers.length; i++ ) {

				// trigger all delayed events
				delayedtriggers[ i ].call( this, event );
			}
			this._trigger( "stop", event, this._uihash() );
		}

		this.fromoutside = false;
		return !this.cancelhelperremoval;

	},

	_trigger: function() {
		if ( $.widget.prototype._trigger.apply( this, arguments ) === false ) {
			this.cancel();
		}
	},

	_uihash: function( _inst ) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $( [] ),
			position: inst.position,
			originalposition: inst.originalposition,
			offset: inst.positionabs,
			item: inst.currentitem,
			sender: _inst ? _inst.element : null
		};
	}

} );

} );





