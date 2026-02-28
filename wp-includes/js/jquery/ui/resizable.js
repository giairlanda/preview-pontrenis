/*!
 * jquery ui resizable 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: resizable
//>>group: interactions
//>>description: enables resize functionality for any element.
//>>docs: https://api.jqueryui.com/resizable/
//>>demos: https://jqueryui.com/resizable/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/resizable.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./mouse",
			"../disable-selection",
			"../plugin",
			"../version",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

$.widget( "ui.resizable", $.ui.mouse, {
	version: "1.13.3",
	widgeteventprefix: "resize",
	options: {
		alsoresize: false,
		animate: false,
		animateduration: "slow",
		animateeasing: "swing",
		aspectratio: false,
		autohide: false,
		classes: {
			"ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
		},
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxheight: null,
		maxwidth: null,
		minheight: 10,
		minwidth: 10,

		// see #7960
		zindex: 90,

		// callbacks
		resize: null,
		start: null,
		stop: null
	},

	_num: function( value ) {
		return parsefloat( value ) || 0;
	},

	_isnumber: function( value ) {
		return !isnan( parsefloat( value ) );
	},

	_hasscroll: function( el, a ) {

		if ( $( el ).css( "overflow" ) === "hidden" ) {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollleft" : "scrolltop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// todo: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		try {
			el[ scroll ] = 1;
			has = ( el[ scroll ] > 0 );
			el[ scroll ] = 0;
		} catch ( e ) {

			// `el` might be a string, then setting `scroll` will throw
			// an error in strict mode; ignore it.
		}
		return has;
	},

	_create: function() {

		var margins,
			o = this.options,
			that = this;
		this._addclass( "ui-resizable" );

		$.extend( this, {
			_aspectratio: !!( o.aspectratio ),
			aspectratio: o.aspectratio,
			originalelement: this.element,
			_proportionallyresizeelements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		} );

		// wrap the element if it cannot hold child nodes
		if ( this.element[ 0 ].nodename.match( /^(canvas|textarea|input|select|button|img)$/i ) ) {

			this.element.wrap(
				$( "<div class='ui-wrapper'></div>" ).css( {
					overflow: "hidden",
					position: this.element.css( "position" ),
					width: this.element.outerwidth(),
					height: this.element.outerheight(),
					top: this.element.css( "top" ),
					left: this.element.css( "left" )
				} )
			);

			this.element = this.element.parent().data(
				"ui-resizable", this.element.resizable( "instance" )
			);

			this.elementiswrapper = true;

			margins = {
				margintop: this.originalelement.css( "margintop" ),
				marginright: this.originalelement.css( "marginright" ),
				marginbottom: this.originalelement.css( "marginbottom" ),
				marginleft: this.originalelement.css( "marginleft" )
			};

			this.element.css( margins );
			this.originalelement.css( "margin", 0 );

			// support: safari
			// prevent safari textarea resize
			this.originalresizestyle = this.originalelement.css( "resize" );
			this.originalelement.css( "resize", "none" );

			this._proportionallyresizeelements.push( this.originalelement.css( {
				position: "static",
				zoom: 1,
				display: "block"
			} ) );

			// support: ie9
			// avoid ie jump (hard set the margin)
			this.originalelement.css( margins );

			this._proportionallyresize();
		}

		this._setuphandles();

		if ( o.autohide ) {
			$( this.element )
				.on( "mouseenter", function() {
					if ( o.disabled ) {
						return;
					}
					that._removeclass( "ui-resizable-autohide" );
					that._handles.show();
				} )
				.on( "mouseleave", function() {
					if ( o.disabled ) {
						return;
					}
					if ( !that.resizing ) {
						that._addclass( "ui-resizable-autohide" );
						that._handles.hide();
					}
				} );
		}

		this._mouseinit();
	},

	_destroy: function() {

		this._mousedestroy();
		this._addedhandles.remove();

		var wrapper,
			_destroy = function( exp ) {
				$( exp )
					.removedata( "resizable" )
					.removedata( "ui-resizable" )
					.off( ".resizable" );
			};

		// todo: unwrap at same dom position
		if ( this.elementiswrapper ) {
			_destroy( this.element );
			wrapper = this.element;
			this.originalelement.css( {
				position: wrapper.css( "position" ),
				width: wrapper.outerwidth(),
				height: wrapper.outerheight(),
				top: wrapper.css( "top" ),
				left: wrapper.css( "left" )
			} ).insertafter( wrapper );
			wrapper.remove();
		}

		this.originalelement.css( "resize", this.originalresizestyle );
		_destroy( this.originalelement );

		return this;
	},

	_setoption: function( key, value ) {
		this._super( key, value );

		switch ( key ) {
		case "handles":
			this._removehandles();
			this._setuphandles();
			break;
		case "aspectratio":
			this._aspectratio = !!value;
			break;
		default:
			break;
		}
	},

	_setuphandles: function() {
		var o = this.options, handle, i, n, hname, axis, that = this;
		this.handles = o.handles ||
			( !$( ".ui-resizable-handle", this.element ).length ?
				"e,s,se" : {
					n: ".ui-resizable-n",
					e: ".ui-resizable-e",
					s: ".ui-resizable-s",
					w: ".ui-resizable-w",
					se: ".ui-resizable-se",
					sw: ".ui-resizable-sw",
					ne: ".ui-resizable-ne",
					nw: ".ui-resizable-nw"
				} );

		this._handles = $();
		this._addedhandles = $();
		if ( this.handles.constructor === string ) {

			if ( this.handles === "all" ) {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split( "," );
			this.handles = {};

			for ( i = 0; i < n.length; i++ ) {

				handle = string.prototype.trim.call( n[ i ] );
				hname = "ui-resizable-" + handle;
				axis = $( "<div>" );
				this._addclass( axis, "ui-resizable-handle " + hname );

				axis.css( { zindex: o.zindex } );

				this.handles[ handle ] = ".ui-resizable-" + handle;
				if ( !this.element.children( this.handles[ handle ] ).length ) {
					this.element.append( axis );
					this._addedhandles = this._addedhandles.add( axis );
				}
			}

		}

		this._renderaxis = function( target ) {

			var i, axis, padpos, padwrapper;

			target = target || this.element;

			for ( i in this.handles ) {

				if ( this.handles[ i ].constructor === string ) {
					this.handles[ i ] = this.element.children( this.handles[ i ] ).first().show();
				} else if ( this.handles[ i ].jquery || this.handles[ i ].nodetype ) {
					this.handles[ i ] = $( this.handles[ i ] );
					this._on( this.handles[ i ], { "mousedown": that._mousedown } );
				}

				if ( this.elementiswrapper &&
						this.originalelement[ 0 ]
							.nodename
							.match( /^(textarea|input|select|button)$/i ) ) {
					axis = $( this.handles[ i ], this.element );

					padwrapper = /sw|ne|nw|se|n|s/.test( i ) ?
						axis.outerheight() :
						axis.outerwidth();

					padpos = [ "padding",
						/ne|nw|n/.test( i ) ? "top" :
						/se|sw|s/.test( i ) ? "bottom" :
						/^e$/.test( i ) ? "right" : "left" ].join( "" );

					target.css( padpos, padwrapper );

					this._proportionallyresize();
				}

				this._handles = this._handles.add( this.handles[ i ] );
			}
		};

		// todo: make renderaxis a prototype function
		this._renderaxis( this.element );

		this._handles = this._handles.add( this.element.find( ".ui-resizable-handle" ) );
		this._handles.disableselection();

		this._handles.on( "mouseover", function() {
			if ( !that.resizing ) {
				if ( this.classname ) {
					axis = this.classname.match( /ui-resizable-(se|sw|ne|nw|n|e|s|w)/i );
				}
				that.axis = axis && axis[ 1 ] ? axis[ 1 ] : "se";
			}
		} );

		if ( o.autohide ) {
			this._handles.hide();
			this._addclass( "ui-resizable-autohide" );
		}
	},

	_removehandles: function() {
		this._addedhandles.remove();
	},

	_mousecapture: function( event ) {
		var i, handle,
			capture = false;

		for ( i in this.handles ) {
			handle = $( this.handles[ i ] )[ 0 ];
			if ( handle === event.target || $.contains( handle, event.target ) ) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mousestart: function( event ) {

		var curleft, curtop, cursor,
			o = this.options,
			el = this.element;

		this.resizing = true;

		this._renderproxy();

		curleft = this._num( this.helper.css( "left" ) );
		curtop = this._num( this.helper.css( "top" ) );

		if ( o.containment ) {
			curleft += $( o.containment ).scrollleft() || 0;
			curtop += $( o.containment ).scrolltop() || 0;
		}

		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };

		this.size = this._helper ? {
				width: this.helper.width(),
				height: this.helper.height()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.originalsize = this._helper ? {
				width: el.outerwidth(),
				height: el.outerheight()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.sizediff = {
			width: el.outerwidth() - el.width(),
			height: el.outerheight() - el.height()
		};

		this.originalposition = { left: curleft, top: curtop };
		this.originalmouseposition = { left: event.pagex, top: event.pagey };

		this.aspectratio = ( typeof o.aspectratio === "number" ) ?
			o.aspectratio :
			( ( this.originalsize.width / this.originalsize.height ) || 1 );

		cursor = $( ".ui-resizable-" + this.axis ).css( "cursor" );
		$( "body" ).css( "cursor", cursor === "auto" ? this.axis + "-resize" : cursor );

		this._addclass( "ui-resizable-resizing" );
		this._propagate( "start", event );
		return true;
	},

	_mousedrag: function( event ) {

		var data, props,
			smp = this.originalmouseposition,
			a = this.axis,
			dx = ( event.pagex - smp.left ) || 0,
			dy = ( event.pagey - smp.top ) || 0,
			trigger = this._change[ a ];

		this._updateprevproperties();

		if ( !trigger ) {
			return false;
		}

		data = trigger.apply( this, [ event, dx, dy ] );

		this._updatevirtualboundaries( event.shiftkey );
		if ( this._aspectratio || event.shiftkey ) {
			data = this._updateratio( data, event );
		}

		data = this._respectsize( data, event );

		this._updatecache( data );

		this._propagate( "resize", event );

		props = this._applychanges();

		if ( !this._helper && this._proportionallyresizeelements.length ) {
			this._proportionallyresize();
		}

		if ( !$.isemptyobject( props ) ) {
			this._updateprevproperties();
			this._trigger( "resize", event, this.ui() );
			this._applychanges();
		}

		return false;
	},

	_mousestop: function( event ) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, left, top,
			o = this.options, that = this;

		if ( this._helper ) {

			pr = this._proportionallyresizeelements;
			ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodename );
			soffseth = ista && this._hasscroll( pr[ 0 ], "left" ) ? 0 : that.sizediff.height;
			soffsetw = ista ? 0 : that.sizediff.width;

			s = {
				width: ( that.helper.width()  - soffsetw ),
				height: ( that.helper.height() - soffseth )
			};
			left = ( parsefloat( that.element.css( "left" ) ) +
				( that.position.left - that.originalposition.left ) ) || null;
			top = ( parsefloat( that.element.css( "top" ) ) +
				( that.position.top - that.originalposition.top ) ) || null;

			if ( !o.animate ) {
				this.element.css( $.extend( s, { top: top, left: left } ) );
			}

			that.helper.height( that.size.height );
			that.helper.width( that.size.width );

			if ( this._helper && !o.animate ) {
				this._proportionallyresize();
			}
		}

		$( "body" ).css( "cursor", "auto" );

		this._removeclass( "ui-resizable-resizing" );

		this._propagate( "stop", event );

		if ( this._helper ) {
			this.helper.remove();
		}

		return false;

	},

	_updateprevproperties: function() {
		this.prevposition = {
			top: this.position.top,
			left: this.position.left
		};
		this.prevsize = {
			width: this.size.width,
			height: this.size.height
		};
	},

	_applychanges: function() {
		var props = {};

		if ( this.position.top !== this.prevposition.top ) {
			props.top = this.position.top + "px";
		}
		if ( this.position.left !== this.prevposition.left ) {
			props.left = this.position.left + "px";
		}

		this.helper.css( props );

		if ( this.size.width !== this.prevsize.width ) {
			props.width = this.size.width + "px";
			this.helper.width( props.width );
		}
		if ( this.size.height !== this.prevsize.height ) {
			props.height = this.size.height + "px";
			this.helper.height( props.height );
		}

		return props;
	},

	_updatevirtualboundaries: function( forceaspectratio ) {
		var pminwidth, pmaxwidth, pminheight, pmaxheight, b,
			o = this.options;

		b = {
			minwidth: this._isnumber( o.minwidth ) ? o.minwidth : 0,
			maxwidth: this._isnumber( o.maxwidth ) ? o.maxwidth : infinity,
			minheight: this._isnumber( o.minheight ) ? o.minheight : 0,
			maxheight: this._isnumber( o.maxheight ) ? o.maxheight : infinity
		};

		if ( this._aspectratio || forceaspectratio ) {
			pminwidth = b.minheight * this.aspectratio;
			pminheight = b.minwidth / this.aspectratio;
			pmaxwidth = b.maxheight * this.aspectratio;
			pmaxheight = b.maxwidth / this.aspectratio;

			if ( pminwidth > b.minwidth ) {
				b.minwidth = pminwidth;
			}
			if ( pminheight > b.minheight ) {
				b.minheight = pminheight;
			}
			if ( pmaxwidth < b.maxwidth ) {
				b.maxwidth = pmaxwidth;
			}
			if ( pmaxheight < b.maxheight ) {
				b.maxheight = pmaxheight;
			}
		}
		this._vboundaries = b;
	},

	_updatecache: function( data ) {
		this.offset = this.helper.offset();
		if ( this._isnumber( data.left ) ) {
			this.position.left = data.left;
		}
		if ( this._isnumber( data.top ) ) {
			this.position.top = data.top;
		}
		if ( this._isnumber( data.height ) ) {
			this.size.height = data.height;
		}
		if ( this._isnumber( data.width ) ) {
			this.size.width = data.width;
		}
	},

	_updateratio: function( data ) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if ( this._isnumber( data.height ) ) {
			data.width = ( data.height * this.aspectratio );
		} else if ( this._isnumber( data.width ) ) {
			data.height = ( data.width / this.aspectratio );
		}

		if ( a === "sw" ) {
			data.left = cpos.left + ( csize.width - data.width );
			data.top = null;
		}
		if ( a === "nw" ) {
			data.top = cpos.top + ( csize.height - data.height );
			data.left = cpos.left + ( csize.width - data.width );
		}

		return data;
	},

	_respectsize: function( data ) {

		var o = this._vboundaries,
			a = this.axis,
			ismaxw = this._isnumber( data.width ) && o.maxwidth && ( o.maxwidth < data.width ),
			ismaxh = this._isnumber( data.height ) && o.maxheight && ( o.maxheight < data.height ),
			isminw = this._isnumber( data.width ) && o.minwidth && ( o.minwidth > data.width ),
			isminh = this._isnumber( data.height ) && o.minheight && ( o.minheight > data.height ),
			dw = this.originalposition.left + this.originalsize.width,
			dh = this.originalposition.top + this.originalsize.height,
			cw = /sw|nw|w/.test( a ), ch = /nw|ne|n/.test( a );
		if ( isminw ) {
			data.width = o.minwidth;
		}
		if ( isminh ) {
			data.height = o.minheight;
		}
		if ( ismaxw ) {
			data.width = o.maxwidth;
		}
		if ( ismaxh ) {
			data.height = o.maxheight;
		}

		if ( isminw && cw ) {
			data.left = dw - o.minwidth;
		}
		if ( ismaxw && cw ) {
			data.left = dw - o.maxwidth;
		}
		if ( isminh && ch ) {
			data.top = dh - o.minheight;
		}
		if ( ismaxh && ch ) {
			data.top = dh - o.maxheight;
		}

		// fixing jump error on top/left - bug #2330
		if ( !data.width && !data.height && !data.left && data.top ) {
			data.top = null;
		} else if ( !data.width && !data.height && !data.top && data.left ) {
			data.left = null;
		}

		return data;
	},

	_getpaddingplusborderdimensions: function( element ) {
		var i = 0,
			widths = [],
			borders = [
				element.css( "bordertopwidth" ),
				element.css( "borderrightwidth" ),
				element.css( "borderbottomwidth" ),
				element.css( "borderleftwidth" )
			],
			paddings = [
				element.css( "paddingtop" ),
				element.css( "paddingright" ),
				element.css( "paddingbottom" ),
				element.css( "paddingleft" )
			];

		for ( ; i < 4; i++ ) {
			widths[ i ] = ( parsefloat( borders[ i ] ) || 0 );
			widths[ i ] += ( parsefloat( paddings[ i ] ) || 0 );
		}

		return {
			height: widths[ 0 ] + widths[ 2 ],
			width: widths[ 1 ] + widths[ 3 ]
		};
	},

	_proportionallyresize: function() {

		if ( !this._proportionallyresizeelements.length ) {
			return;
		}

		var prel,
			i = 0,
			element = this.helper || this.element;

		for ( ; i < this._proportionallyresizeelements.length; i++ ) {

			prel = this._proportionallyresizeelements[ i ];

			// todo: seems like a bug to cache this.outerdimensions
			// considering that we are in a loop.
			if ( !this.outerdimensions ) {
				this.outerdimensions = this._getpaddingplusborderdimensions( prel );
			}

			prel.css( {
				height: ( element.height() - this.outerdimensions.height ) || 0,
				width: ( element.width() - this.outerdimensions.width ) || 0
			} );

		}

	},

	_renderproxy: function() {

		var el = this.element, o = this.options;
		this.elementoffset = el.offset();

		if ( this._helper ) {

			this.helper = this.helper || $( "<div></div>" ).css( { overflow: "hidden" } );

			this._addclass( this.helper, this._helper );
			this.helper.css( {
				width: this.element.outerwidth(),
				height: this.element.outerheight(),
				position: "absolute",
				left: this.elementoffset.left + "px",
				top: this.elementoffset.top + "px",
				zindex: ++o.zindex //todo: don't modify option
			} );

			this.helper
				.appendto( "body" )
				.disableselection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function( event, dx ) {
			return { width: this.originalsize.width + dx };
		},
		w: function( event, dx ) {
			var cs = this.originalsize, sp = this.originalposition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function( event, dx, dy ) {
			var cs = this.originalsize, sp = this.originalposition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function( event, dx, dy ) {
			return { height: this.originalsize.height + dy };
		},
		se: function( event, dx, dy ) {
			return $.extend( this._change.s.apply( this, arguments ),
				this._change.e.apply( this, [ event, dx, dy ] ) );
		},
		sw: function( event, dx, dy ) {
			return $.extend( this._change.s.apply( this, arguments ),
				this._change.w.apply( this, [ event, dx, dy ] ) );
		},
		ne: function( event, dx, dy ) {
			return $.extend( this._change.n.apply( this, arguments ),
				this._change.e.apply( this, [ event, dx, dy ] ) );
		},
		nw: function( event, dx, dy ) {
			return $.extend( this._change.n.apply( this, arguments ),
				this._change.w.apply( this, [ event, dx, dy ] ) );
		}
	},

	_propagate: function( n, event ) {
		$.ui.plugin.call( this, n, [ event, this.ui() ] );
		if ( n !== "resize" ) {
			this._trigger( n, event, this.ui() );
		}
	},

	plugins: {},

	ui: function() {
		return {
			originalelement: this.originalelement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalsize: this.originalsize,
			originalposition: this.originalposition
		};
	}

} );

/*
 * resizable extensions
 */

$.ui.plugin.add( "resizable", "animate", {

	stop: function( event ) {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			pr = that._proportionallyresizeelements,
			ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodename ),
			soffseth = ista && that._hasscroll( pr[ 0 ], "left" ) ? 0 : that.sizediff.height,
			soffsetw = ista ? 0 : that.sizediff.width,
			style = {
				width: ( that.size.width - soffsetw ),
				height: ( that.size.height - soffseth )
			},
			left = ( parsefloat( that.element.css( "left" ) ) +
				( that.position.left - that.originalposition.left ) ) || null,
			top = ( parsefloat( that.element.css( "top" ) ) +
				( that.position.top - that.originalposition.top ) ) || null;

		that.element.animate(
			$.extend( style, top && left ? { top: top, left: left } : {} ), {
				duration: o.animateduration,
				easing: o.animateeasing,
				step: function() {

					var data = {
						width: parsefloat( that.element.css( "width" ) ),
						height: parsefloat( that.element.css( "height" ) ),
						top: parsefloat( that.element.css( "top" ) ),
						left: parsefloat( that.element.css( "left" ) )
					};

					if ( pr && pr.length ) {
						$( pr[ 0 ] ).css( { width: data.width, height: data.height } );
					}

					// propagating resize, and updating values for each animation step
					that._updatecache( data );
					that._propagate( "resize", event );

				}
			}
		);
	}

} );

$.ui.plugin.add( "resizable", "containment", {

	start: function() {
		var element, p, co, ch, cw, width, height,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			el = that.element,
			oc = o.containment,
			ce = ( oc instanceof $ ) ?
				oc.get( 0 ) :
				( /parent/.test( oc ) ) ? el.parent().get( 0 ) : oc;

		if ( !ce ) {
			return;
		}

		that.containerelement = $( ce );

		if ( /document/.test( oc ) || oc === document ) {
			that.containeroffset = {
				left: 0,
				top: 0
			};
			that.containerposition = {
				left: 0,
				top: 0
			};

			that.parentdata = {
				element: $( document ),
				left: 0,
				top: 0,
				width: $( document ).width(),
				height: $( document ).height() || document.body.parentnode.scrollheight
			};
		} else {
			element = $( ce );
			p = [];
			$( [ "top", "right", "left", "bottom" ] ).each( function( i, name ) {
				p[ i ] = that._num( element.css( "padding" + name ) );
			} );

			that.containeroffset = element.offset();
			that.containerposition = element.position();
			that.containersize = {
				height: ( element.innerheight() - p[ 3 ] ),
				width: ( element.innerwidth() - p[ 1 ] )
			};

			co = that.containeroffset;
			ch = that.containersize.height;
			cw = that.containersize.width;
			width = ( that._hasscroll( ce, "left" ) ? ce.scrollwidth : cw );
			height = ( that._hasscroll( ce ) ? ce.scrollheight : ch );

			that.parentdata = {
				element: ce,
				left: co.left,
				top: co.top,
				width: width,
				height: height
			};
		}
	},

	resize: function( event ) {
		var woset, hoset, isparent, isoffsetrelative,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			co = that.containeroffset,
			cp = that.position,
			pratio = that._aspectratio || event.shiftkey,
			cop = {
				top: 0,
				left: 0
			},
			ce = that.containerelement,
			continueresize = true;

		if ( ce[ 0 ] !== document && ( /static/ ).test( ce.css( "position" ) ) ) {
			cop = co;
		}

		if ( cp.left < ( that._helper ? co.left : 0 ) ) {
			that.size.width = that.size.width +
				( that._helper ?
					( that.position.left - co.left ) :
					( that.position.left - cop.left ) );

			if ( pratio ) {
				that.size.height = that.size.width / that.aspectratio;
				continueresize = false;
			}
			that.position.left = o.helper ? co.left : 0;
		}

		if ( cp.top < ( that._helper ? co.top : 0 ) ) {
			that.size.height = that.size.height +
				( that._helper ?
					( that.position.top - co.top ) :
					that.position.top );

			if ( pratio ) {
				that.size.width = that.size.height * that.aspectratio;
				continueresize = false;
			}
			that.position.top = that._helper ? co.top : 0;
		}

		isparent = that.containerelement.get( 0 ) === that.element.parent().get( 0 );
		isoffsetrelative = /relative|absolute/.test( that.containerelement.css( "position" ) );

		if ( isparent && isoffsetrelative ) {
			that.offset.left = that.parentdata.left + that.position.left;
			that.offset.top = that.parentdata.top + that.position.top;
		} else {
			that.offset.left = that.element.offset().left;
			that.offset.top = that.element.offset().top;
		}

		woset = math.abs( that.sizediff.width +
			( that._helper ?
				that.offset.left - cop.left :
				( that.offset.left - co.left ) ) );

		hoset = math.abs( that.sizediff.height +
			( that._helper ?
				that.offset.top - cop.top :
				( that.offset.top - co.top ) ) );

		if ( woset + that.size.width >= that.parentdata.width ) {
			that.size.width = that.parentdata.width - woset;
			if ( pratio ) {
				that.size.height = that.size.width / that.aspectratio;
				continueresize = false;
			}
		}

		if ( hoset + that.size.height >= that.parentdata.height ) {
			that.size.height = that.parentdata.height - hoset;
			if ( pratio ) {
				that.size.width = that.size.height * that.aspectratio;
				continueresize = false;
			}
		}

		if ( !continueresize ) {
			that.position.left = that.prevposition.left;
			that.position.top = that.prevposition.top;
			that.size.width = that.prevsize.width;
			that.size.height = that.prevsize.height;
		}
	},

	stop: function() {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			co = that.containeroffset,
			cop = that.containerposition,
			ce = that.containerelement,
			helper = $( that.helper ),
			ho = helper.offset(),
			w = helper.outerwidth() - that.sizediff.width,
			h = helper.outerheight() - that.sizediff.height;

		if ( that._helper && !o.animate && ( /relative/ ).test( ce.css( "position" ) ) ) {
			$( this ).css( {
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			} );
		}

		if ( that._helper && !o.animate && ( /static/ ).test( ce.css( "position" ) ) ) {
			$( this ).css( {
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			} );
		}
	}
} );

$.ui.plugin.add( "resizable", "alsoresize", {

	start: function() {
		var that = $( this ).resizable( "instance" ),
			o = that.options;

		$( o.alsoresize ).each( function() {
			var el = $( this );
			el.data( "ui-resizable-alsoresize", {
				width: parsefloat( el.css( "width" ) ), height: parsefloat( el.css( "height" ) ),
				left: parsefloat( el.css( "left" ) ), top: parsefloat( el.css( "top" ) )
			} );
		} );
	},

	resize: function( event, ui ) {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			os = that.originalsize,
			op = that.originalposition,
			delta = {
				height: ( that.size.height - os.height ) || 0,
				width: ( that.size.width - os.width ) || 0,
				top: ( that.position.top - op.top ) || 0,
				left: ( that.position.left - op.left ) || 0
			};

			$( o.alsoresize ).each( function() {
				var el = $( this ), start = $( this ).data( "ui-resizable-alsoresize" ), style = {},
					css = el.parents( ui.originalelement[ 0 ] ).length ?
							[ "width", "height" ] :
							[ "width", "height", "top", "left" ];

				$.each( css, function( i, prop ) {
					var sum = ( start[ prop ] || 0 ) + ( delta[ prop ] || 0 );
					if ( sum && sum >= 0 ) {
						style[ prop ] = sum || null;
					}
				} );

				el.css( style );
			} );
	},

	stop: function() {
		$( this ).removedata( "ui-resizable-alsoresize" );
	}
} );

$.ui.plugin.add( "resizable", "ghost", {

	start: function() {

		var that = $( this ).resizable( "instance" ), cs = that.size;

		that.ghost = that.originalelement.clone();
		that.ghost.css( {
			opacity: 0.25,
			display: "block",
			position: "relative",
			height: cs.height,
			width: cs.width,
			margin: 0,
			left: 0,
			top: 0
		} );

		that._addclass( that.ghost, "ui-resizable-ghost" );

		// deprecated
		// todo: remove after 1.12
		if ( $.uibackcompat !== false && typeof that.options.ghost === "string" ) {

			// ghost option
			that.ghost.addclass( this.options.ghost );
		}

		that.ghost.appendto( that.helper );

	},

	resize: function() {
		var that = $( this ).resizable( "instance" );
		if ( that.ghost ) {
			that.ghost.css( {
				position: "relative",
				height: that.size.height,
				width: that.size.width
			} );
		}
	},

	stop: function() {
		var that = $( this ).resizable( "instance" );
		if ( that.ghost && that.helper ) {
			that.helper.get( 0 ).removechild( that.ghost.get( 0 ) );
		}
	}

} );

$.ui.plugin.add( "resizable", "grid", {

	resize: function() {
		var outerdimensions,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			cs = that.size,
			os = that.originalsize,
			op = that.originalposition,
			a = that.axis,
			grid = typeof o.grid === "number" ? [ o.grid, o.grid ] : o.grid,
			gridx = ( grid[ 0 ] || 1 ),
			gridy = ( grid[ 1 ] || 1 ),
			ox = math.round( ( cs.width - os.width ) / gridx ) * gridx,
			oy = math.round( ( cs.height - os.height ) / gridy ) * gridy,
			newwidth = os.width + ox,
			newheight = os.height + oy,
			ismaxwidth = o.maxwidth && ( o.maxwidth < newwidth ),
			ismaxheight = o.maxheight && ( o.maxheight < newheight ),
			isminwidth = o.minwidth && ( o.minwidth > newwidth ),
			isminheight = o.minheight && ( o.minheight > newheight );

		o.grid = grid;

		if ( isminwidth ) {
			newwidth += gridx;
		}
		if ( isminheight ) {
			newheight += gridy;
		}
		if ( ismaxwidth ) {
			newwidth -= gridx;
		}
		if ( ismaxheight ) {
			newheight -= gridy;
		}

		if ( /^(se|s|e)$/.test( a ) ) {
			that.size.width = newwidth;
			that.size.height = newheight;
		} else if ( /^(ne)$/.test( a ) ) {
			that.size.width = newwidth;
			that.size.height = newheight;
			that.position.top = op.top - oy;
		} else if ( /^(sw)$/.test( a ) ) {
			that.size.width = newwidth;
			that.size.height = newheight;
			that.position.left = op.left - ox;
		} else {
			if ( newheight - gridy <= 0 || newwidth - gridx <= 0 ) {
				outerdimensions = that._getpaddingplusborderdimensions( this );
			}

			if ( newheight - gridy > 0 ) {
				that.size.height = newheight;
				that.position.top = op.top - oy;
			} else {
				newheight = gridy - outerdimensions.height;
				that.size.height = newheight;
				that.position.top = op.top + os.height - newheight;
			}
			if ( newwidth - gridx > 0 ) {
				that.size.width = newwidth;
				that.position.left = op.left - ox;
			} else {
				newwidth = gridx - outerdimensions.width;
				that.size.width = newwidth;
				that.position.left = op.left + os.width - newwidth;
			}
		}
	}

} );

return $.ui.resizable;

} );








