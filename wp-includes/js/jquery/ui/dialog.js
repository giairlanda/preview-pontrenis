/*!
 * jquery ui dialog 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: dialog
//>>group: widgets
//>>description: displays customizable dialog windows.
//>>docs: https://api.jqueryui.com/dialog/
//>>demos: https://jqueryui.com/dialog/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/dialog.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./button",
			"./draggable",
			"./mouse",
			"./resizable",
			"../focusable",
			"../keycode",
			"../position",
			"../safe-active-element",
			"../safe-blur",
			"../tabbable",
			"../unique-id",
			"../version",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

$.widget( "ui.dialog", {
	version: "1.13.3",
	options: {
		appendto: "body",
		autoopen: true,
		buttons: [],
		classes: {
			"ui-dialog": "ui-corner-all",
			"ui-dialog-titlebar": "ui-corner-all"
		},
		closeonescape: true,
		closetext: "close",
		draggable: true,
		hide: null,
		height: "auto",
		maxheight: null,
		maxwidth: null,
		minheight: 150,
		minwidth: 150,
		modal: false,
		position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",

			// ensure the titlebar is always visible
			using: function( pos ) {
				var topoffset = $( this ).css( pos ).offset().top;
				if ( topoffset < 0 ) {
					$( this ).css( "top", pos.top - topoffset );
				}
			}
		},
		resizable: true,
		show: null,
		title: null,
		width: 300,

		// callbacks
		beforeclose: null,
		close: null,
		drag: null,
		dragstart: null,
		dragstop: null,
		focus: null,
		open: null,
		resize: null,
		resizestart: null,
		resizestop: null
	},

	sizerelatedoptions: {
		buttons: true,
		height: true,
		maxheight: true,
		maxwidth: true,
		minheight: true,
		minwidth: true,
		width: true
	},

	resizablerelatedoptions: {
		maxheight: true,
		maxwidth: true,
		minheight: true,
		minwidth: true
	},

	_create: function() {
		this.originalcss = {
			display: this.element[ 0 ].style.display,
			width: this.element[ 0 ].style.width,
			minheight: this.element[ 0 ].style.minheight,
			maxheight: this.element[ 0 ].style.maxheight,
			height: this.element[ 0 ].style.height
		};
		this.originalposition = {
			parent: this.element.parent(),
			index: this.element.parent().children().index( this.element )
		};
		this.originaltitle = this.element.attr( "title" );
		if ( this.options.title == null && this.originaltitle != null ) {
			this.options.title = this.originaltitle;
		}

		// dialogs can't be disabled
		if ( this.options.disabled ) {
			this.options.disabled = false;
		}

		this._createwrapper();

		this.element
			.show()
			.removeattr( "title" )
			.appendto( this.uidialog );

		this._addclass( "ui-dialog-content", "ui-widget-content" );

		this._createtitlebar();
		this._createbuttonpane();

		if ( this.options.draggable && $.fn.draggable ) {
			this._makedraggable();
		}
		if ( this.options.resizable && $.fn.resizable ) {
			this._makeresizable();
		}

		this._isopen = false;

		this._trackfocus();
	},

	_init: function() {
		if ( this.options.autoopen ) {
			this.open();
		}
	},

	_appendto: function() {
		var element = this.options.appendto;
		if ( element && ( element.jquery || element.nodetype ) ) {
			return $( element );
		}
		return this.document.find( element || "body" ).eq( 0 );
	},

	_destroy: function() {
		var next,
			originalposition = this.originalposition;

		this._untrackinstance();
		this._destroyoverlay();

		this.element
			.removeuniqueid()
			.css( this.originalcss )

			// without detaching first, the following becomes really slow
			.detach();

		this.uidialog.remove();

		if ( this.originaltitle ) {
			this.element.attr( "title", this.originaltitle );
		}

		next = originalposition.parent.children().eq( originalposition.index );

		// don't try to place the dialog next to itself (#8613)
		if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
			next.before( this.element );
		} else {
			originalposition.parent.append( this.element );
		}
	},

	widget: function() {
		return this.uidialog;
	},

	disable: $.noop,
	enable: $.noop,

	close: function( event ) {
		var that = this;

		if ( !this._isopen || this._trigger( "beforeclose", event ) === false ) {
			return;
		}

		this._isopen = false;
		this._focusedelement = null;
		this._destroyoverlay();
		this._untrackinstance();

		if ( !this.opener.filter( ":focusable" ).trigger( "focus" ).length ) {

			// hiding a focused element doesn't trigger blur in webkit
			// so in case we have nothing to focus on, explicitly blur the active element
			// https://bugs.webkit.org/show_bug.cgi?id=47182
			$.ui.safeblur( $.ui.safeactiveelement( this.document[ 0 ] ) );
		}

		this._hide( this.uidialog, this.options.hide, function() {
			that._trigger( "close", event );
		} );
	},

	isopen: function() {
		return this._isopen;
	},

	movetotop: function() {
		this._movetotop();
	},

	_movetotop: function( event, silent ) {
		var moved = false,
			zindices = this.uidialog.siblings( ".ui-front:visible" ).map( function() {
				return +$( this ).css( "z-index" );
			} ).get(),
			zindexmax = math.max.apply( null, zindices );

		if ( zindexmax >= +this.uidialog.css( "z-index" ) ) {
			this.uidialog.css( "z-index", zindexmax + 1 );
			moved = true;
		}

		if ( moved && !silent ) {
			this._trigger( "focus", event );
		}
		return moved;
	},

	open: function() {
		var that = this;
		if ( this._isopen ) {
			if ( this._movetotop() ) {
				this._focustabbable();
			}
			return;
		}

		this._isopen = true;
		this.opener = $( $.ui.safeactiveelement( this.document[ 0 ] ) );

		this._size();
		this._position();
		this._createoverlay();
		this._movetotop( null, true );

		// ensure the overlay is moved to the top with the dialog, but only when
		// opening. the overlay shouldn't move after the dialog is open so that
		// modeless dialogs opened after the modal dialog stack properly.
		if ( this.overlay ) {
			this.overlay.css( "z-index", this.uidialog.css( "z-index" ) - 1 );
		}

		this._show( this.uidialog, this.options.show, function() {
			that._focustabbable();
			that._trigger( "focus" );
		} );

		// track the dialog immediately upon opening in case a focus event
		// somehow occurs outside of the dialog before an element inside the
		// dialog is focused (#10152)
		this._makefocustarget();

		this._trigger( "open" );
	},

	_focustabbable: function() {

		// set focus to the first match:
		// 1. an element that was focused previously
		// 2. first element inside the dialog matching [autofocus]
		// 3. tabbable element inside the content element
		// 4. tabbable element inside the buttonpane
		// 5. the close button
		// 6. the dialog itself
		var hasfocus = this._focusedelement;
		if ( !hasfocus ) {
			hasfocus = this.element.find( "[autofocus]" );
		}
		if ( !hasfocus.length ) {
			hasfocus = this.element.find( ":tabbable" );
		}
		if ( !hasfocus.length ) {
			hasfocus = this.uidialogbuttonpane.find( ":tabbable" );
		}
		if ( !hasfocus.length ) {
			hasfocus = this.uidialogtitlebarclose.filter( ":tabbable" );
		}
		if ( !hasfocus.length ) {
			hasfocus = this.uidialog;
		}
		hasfocus.eq( 0 ).trigger( "focus" );
	},

	_restoretabbablefocus: function() {
		var activeelement = $.ui.safeactiveelement( this.document[ 0 ] ),
			isactive = this.uidialog[ 0 ] === activeelement ||
				$.contains( this.uidialog[ 0 ], activeelement );
		if ( !isactive ) {
			this._focustabbable();
		}
	},

	_keepfocus: function( event ) {
		event.preventdefault();
		this._restoretabbablefocus();

		// support: ie
		// ie <= 8 doesn't prevent moving focus even with event.preventdefault()
		// so we check again later
		this._delay( this._restoretabbablefocus );
	},

	_createwrapper: function() {
		this.uidialog = $( "<div>" )
			.hide()
			.attr( {

				// setting tabindex makes the div focusable
				tabindex: -1,
				role: "dialog"
			} )
			.appendto( this._appendto() );

		this._addclass( this.uidialog, "ui-dialog", "ui-widget ui-widget-content ui-front" );
		this._on( this.uidialog, {
			keydown: function( event ) {
				if ( this.options.closeonescape && !event.isdefaultprevented() && event.keycode &&
						event.keycode === $.ui.keycode.escape ) {
					event.preventdefault();
					this.close( event );
					return;
				}

				// prevent tabbing out of dialogs
				if ( event.keycode !== $.ui.keycode.tab || event.isdefaultprevented() ) {
					return;
				}
				var tabbables = this.uidialog.find( ":tabbable" ),
					first = tabbables.first(),
					last = tabbables.last();

				if ( ( event.target === last[ 0 ] || event.target === this.uidialog[ 0 ] ) &&
						!event.shiftkey ) {
					this._delay( function() {
						first.trigger( "focus" );
					} );
					event.preventdefault();
				} else if ( ( event.target === first[ 0 ] ||
						event.target === this.uidialog[ 0 ] ) && event.shiftkey ) {
					this._delay( function() {
						last.trigger( "focus" );
					} );
					event.preventdefault();
				}
			},
			mousedown: function( event ) {
				if ( this._movetotop( event ) ) {
					this._focustabbable();
				}
			}
		} );

		// we assume that any existing aria-describedby attribute means
		// that the dialog content is marked up properly
		// otherwise we brute force the content as the description
		if ( !this.element.find( "[aria-describedby]" ).length ) {
			this.uidialog.attr( {
				"aria-describedby": this.element.uniqueid().attr( "id" )
			} );
		}
	},

	_createtitlebar: function() {
		var uidialogtitle;

		this.uidialogtitlebar = $( "<div>" );
		this._addclass( this.uidialogtitlebar,
			"ui-dialog-titlebar", "ui-widget-header ui-helper-clearfix" );
		this._on( this.uidialogtitlebar, {
			mousedown: function( event ) {

				// don't prevent click on close button (#8838)
				// focusing a dialog that is partially scrolled out of view
				// causes the browser to scroll it into view, preventing the click event
				if ( !$( event.target ).closest( ".ui-dialog-titlebar-close" ) ) {

					// dialog isn't getting focus when dragging (#8063)
					this.uidialog.trigger( "focus" );
				}
			}
		} );

		// support: ie
		// use type="button" to prevent enter keypresses in textboxes from closing the
		// dialog in ie (#9312)
		this.uidialogtitlebarclose = $( "<button type='button'></button>" )
			.button( {
				label: $( "<a>" ).text( this.options.closetext ).html(),
				icon: "ui-icon-closethick",
				showlabel: false
			} )
			.appendto( this.uidialogtitlebar );

		this._addclass( this.uidialogtitlebarclose, "ui-dialog-titlebar-close" );
		this._on( this.uidialogtitlebarclose, {
			click: function( event ) {
				event.preventdefault();
				this.close( event );
			}
		} );

		uidialogtitle = $( "<span>" ).uniqueid().prependto( this.uidialogtitlebar );
		this._addclass( uidialogtitle, "ui-dialog-title" );
		this._title( uidialogtitle );

		this.uidialogtitlebar.prependto( this.uidialog );

		this.uidialog.attr( {
			"aria-labelledby": uidialogtitle.attr( "id" )
		} );
	},

	_title: function( title ) {
		if ( this.options.title ) {
			title.text( this.options.title );
		} else {
			title.html( "&#160;" );
		}
	},

	_createbuttonpane: function() {
		this.uidialogbuttonpane = $( "<div>" );
		this._addclass( this.uidialogbuttonpane, "ui-dialog-buttonpane",
			"ui-widget-content ui-helper-clearfix" );

		this.uibuttonset = $( "<div>" )
			.appendto( this.uidialogbuttonpane );
		this._addclass( this.uibuttonset, "ui-dialog-buttonset" );

		this._createbuttons();
	},

	_createbuttons: function() {
		var that = this,
			buttons = this.options.buttons;

		// if we already have a button pane, remove it
		this.uidialogbuttonpane.remove();
		this.uibuttonset.empty();

		if ( $.isemptyobject( buttons ) || ( array.isarray( buttons ) && !buttons.length ) ) {
			this._removeclass( this.uidialog, "ui-dialog-buttons" );
			return;
		}

		$.each( buttons, function( name, props ) {
			var click, buttonoptions;
			props = typeof props === "function" ?
				{ click: props, text: name } :
				props;

			// default to a non-submitting button
			props = $.extend( { type: "button" }, props );

			// change the context for the click callback to be the main element
			click = props.click;
			buttonoptions = {
				icon: props.icon,
				iconposition: props.iconposition,
				showlabel: props.showlabel,

				// deprecated options
				icons: props.icons,
				text: props.text
			};

			delete props.click;
			delete props.icon;
			delete props.iconposition;
			delete props.showlabel;

			// deprecated options
			delete props.icons;
			if ( typeof props.text === "boolean" ) {
				delete props.text;
			}

			$( "<button></button>", props )
				.button( buttonoptions )
				.appendto( that.uibuttonset )
				.on( "click", function() {
					click.apply( that.element[ 0 ], arguments );
				} );
		} );
		this._addclass( this.uidialog, "ui-dialog-buttons" );
		this.uidialogbuttonpane.appendto( this.uidialog );
	},

	_makedraggable: function() {
		var that = this,
			options = this.options;

		function filteredui( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.uidialog.draggable( {
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			containment: "document",
			start: function( event, ui ) {
				that._addclass( $( this ), "ui-dialog-dragging" );
				that._blockframes();
				that._trigger( "dragstart", event, filteredui( ui ) );
			},
			drag: function( event, ui ) {
				that._trigger( "drag", event, filteredui( ui ) );
			},
			stop: function( event, ui ) {
				var left = ui.offset.left - that.document.scrollleft(),
					top = ui.offset.top - that.document.scrolltop();

				options.position = {
					my: "left top",
					at: "left" + ( left >= 0 ? "+" : "" ) + left + " " +
						"top" + ( top >= 0 ? "+" : "" ) + top,
					of: that.window
				};
				that._removeclass( $( this ), "ui-dialog-dragging" );
				that._unblockframes();
				that._trigger( "dragstop", event, filteredui( ui ) );
			}
		} );
	},

	_makeresizable: function() {
		var that = this,
			options = this.options,
			handles = options.resizable,

			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uidialog.css( "position" ),
			resizehandles = typeof handles === "string" ?
				handles :
				"n,e,s,w,se,sw,ne,nw";

		function filteredui( ui ) {
			return {
				originalposition: ui.originalposition,
				originalsize: ui.originalsize,
				position: ui.position,
				size: ui.size
			};
		}

		this.uidialog.resizable( {
			cancel: ".ui-dialog-content",
			containment: "document",
			alsoresize: this.element,
			maxwidth: options.maxwidth,
			maxheight: options.maxheight,
			minwidth: options.minwidth,
			minheight: this._minheight(),
			handles: resizehandles,
			start: function( event, ui ) {
				that._addclass( $( this ), "ui-dialog-resizing" );
				that._blockframes();
				that._trigger( "resizestart", event, filteredui( ui ) );
			},
			resize: function( event, ui ) {
				that._trigger( "resize", event, filteredui( ui ) );
			},
			stop: function( event, ui ) {
				var offset = that.uidialog.offset(),
					left = offset.left - that.document.scrollleft(),
					top = offset.top - that.document.scrolltop();

				options.height = that.uidialog.height();
				options.width = that.uidialog.width();
				options.position = {
					my: "left top",
					at: "left" + ( left >= 0 ? "+" : "" ) + left + " " +
						"top" + ( top >= 0 ? "+" : "" ) + top,
					of: that.window
				};
				that._removeclass( $( this ), "ui-dialog-resizing" );
				that._unblockframes();
				that._trigger( "resizestop", event, filteredui( ui ) );
			}
		} )
			.css( "position", position );
	},

	_trackfocus: function() {
		this._on( this.widget(), {
			focusin: function( event ) {
				this._makefocustarget();
				this._focusedelement = $( event.target );
			}
		} );
	},

	_makefocustarget: function() {
		this._untrackinstance();
		this._trackinginstances().unshift( this );
	},

	_untrackinstance: function() {
		var instances = this._trackinginstances(),
			exists = $.inarray( this, instances );
		if ( exists !== -1 ) {
			instances.splice( exists, 1 );
		}
	},

	_trackinginstances: function() {
		var instances = this.document.data( "ui-dialog-instances" );
		if ( !instances ) {
			instances = [];
			this.document.data( "ui-dialog-instances", instances );
		}
		return instances;
	},

	_minheight: function() {
		var options = this.options;

		return options.height === "auto" ?
			options.minheight :
			math.min( options.minheight, options.height );
	},

	_position: function() {

		// need to show the dialog to get the actual offset in the position plugin
		var isvisible = this.uidialog.is( ":visible" );
		if ( !isvisible ) {
			this.uidialog.show();
		}
		this.uidialog.position( this.options.position );
		if ( !isvisible ) {
			this.uidialog.hide();
		}
	},

	_setoptions: function( options ) {
		var that = this,
			resize = false,
			resizableoptions = {};

		$.each( options, function( key, value ) {
			that._setoption( key, value );

			if ( key in that.sizerelatedoptions ) {
				resize = true;
			}
			if ( key in that.resizablerelatedoptions ) {
				resizableoptions[ key ] = value;
			}
		} );

		if ( resize ) {
			this._size();
			this._position();
		}
		if ( this.uidialog.is( ":data(ui-resizable)" ) ) {
			this.uidialog.resizable( "option", resizableoptions );
		}
	},

	_setoption: function( key, value ) {
		var isdraggable, isresizable,
			uidialog = this.uidialog;

		if ( key === "disabled" ) {
			return;
		}

		this._super( key, value );

		if ( key === "appendto" ) {
			this.uidialog.appendto( this._appendto() );
		}

		if ( key === "buttons" ) {
			this._createbuttons();
		}

		if ( key === "closetext" ) {
			this.uidialogtitlebarclose.button( {

				// ensure that we always pass a string
				label: $( "<a>" ).text( "" + this.options.closetext ).html()
			} );
		}

		if ( key === "draggable" ) {
			isdraggable = uidialog.is( ":data(ui-draggable)" );
			if ( isdraggable && !value ) {
				uidialog.draggable( "destroy" );
			}

			if ( !isdraggable && value ) {
				this._makedraggable();
			}
		}

		if ( key === "position" ) {
			this._position();
		}

		if ( key === "resizable" ) {

			// currently resizable, becoming non-resizable
			isresizable = uidialog.is( ":data(ui-resizable)" );
			if ( isresizable && !value ) {
				uidialog.resizable( "destroy" );
			}

			// currently resizable, changing handles
			if ( isresizable && typeof value === "string" ) {
				uidialog.resizable( "option", "handles", value );
			}

			// currently non-resizable, becoming resizable
			if ( !isresizable && value !== false ) {
				this._makeresizable();
			}
		}

		if ( key === "title" ) {
			this._title( this.uidialogtitlebar.find( ".ui-dialog-title" ) );
		}
	},

	_size: function() {

		// if the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		// divs will both have width and height set, so we need to reset them
		var noncontentheight, mincontentheight, maxcontentheight,
			options = this.options;

		// reset content sizing
		this.element.show().css( {
			width: "auto",
			minheight: 0,
			maxheight: "none",
			height: 0
		} );

		if ( options.minwidth > options.width ) {
			options.width = options.minwidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		noncontentheight = this.uidialog.css( {
			height: "auto",
			width: options.width
		} )
			.outerheight();
		mincontentheight = math.max( 0, options.minheight - noncontentheight );
		maxcontentheight = typeof options.maxheight === "number" ?
			math.max( 0, options.maxheight - noncontentheight ) :
			"none";

		if ( options.height === "auto" ) {
			this.element.css( {
				minheight: mincontentheight,
				maxheight: maxcontentheight,
				height: "auto"
			} );
		} else {
			this.element.height( math.max( 0, options.height - noncontentheight ) );
		}

		if ( this.uidialog.is( ":data(ui-resizable)" ) ) {
			this.uidialog.resizable( "option", "minheight", this._minheight() );
		}
	},

	_blockframes: function() {
		this.iframeblocks = this.document.find( "iframe" ).map( function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( {
					position: "absolute",
					width: iframe.outerwidth(),
					height: iframe.outerheight()
				} )
				.appendto( iframe.parent() )
				.offset( iframe.offset() )[ 0 ];
		} );
	},

	_unblockframes: function() {
		if ( this.iframeblocks ) {
			this.iframeblocks.remove();
			delete this.iframeblocks;
		}
	},

	_allowinteraction: function( event ) {
		if ( $( event.target ).closest( ".ui-dialog" ).length ) {
			return true;
		}

		// todo: remove hack when datepicker implements
		// the .ui-front logic (#8989)
		return !!$( event.target ).closest( ".ui-datepicker" ).length;
	},

	_createoverlay: function() {
		if ( !this.options.modal ) {
			return;
		}

		var jqminor = $.fn.jquery.substring( 0, 4 );

		// we use a delay in case the overlay is created from an
		// event that we're going to be cancelling (#2804)
		var isopening = true;
		this._delay( function() {
			isopening = false;
		} );

		if ( !this.document.data( "ui-dialog-overlays" ) ) {

			// prevent use of anchors and inputs
			// this doesn't use `_on()` because it is a shared event handler
			// across all open modal dialogs.
			this.document.on( "focusin.ui-dialog", function( event ) {
				if ( isopening ) {
					return;
				}

				var instance = this._trackinginstances()[ 0 ];
				if ( !instance._allowinteraction( event ) ) {
					event.preventdefault();
					instance._focustabbable();

					// support: jquery >=3.4 <3.7 only
					// in jquery 3.4-3.6, there are multiple issues with focus/blur
					// trigger chains or when triggering is done on a hidden element
					// at least once.
					// trigger focus in a delay in addition if needed to avoid the issues.
					// see https://github.com/jquery/jquery/issues/4382
					// see https://github.com/jquery/jquery/issues/4856
					// see https://github.com/jquery/jquery/issues/4950
					if ( jqminor === "3.4." || jqminor === "3.5." || jqminor === "3.6." ) {
						instance._delay( instance._restoretabbablefocus );
					}
				}
			}.bind( this ) );
		}

		this.overlay = $( "<div>" )
			.appendto( this._appendto() );

		this._addclass( this.overlay, null, "ui-widget-overlay ui-front" );
		this._on( this.overlay, {
			mousedown: "_keepfocus"
		} );
		this.document.data( "ui-dialog-overlays",
			( this.document.data( "ui-dialog-overlays" ) || 0 ) + 1 );
	},

	_destroyoverlay: function() {
		if ( !this.options.modal ) {
			return;
		}

		if ( this.overlay ) {
			var overlays = this.document.data( "ui-dialog-overlays" ) - 1;

			if ( !overlays ) {
				this.document.off( "focusin.ui-dialog" );
				this.document.removedata( "ui-dialog-overlays" );
			} else {
				this.document.data( "ui-dialog-overlays", overlays );
			}

			this.overlay.remove();
			this.overlay = null;
		}
	}
} );

// deprecated
// todo: switch return back to widget declaration at top of file when this is removed
if ( $.uibackcompat !== false ) {

	// backcompat for dialogclass option
	$.widget( "ui.dialog", $.ui.dialog, {
		options: {
			dialogclass: ""
		},
		_createwrapper: function() {
			this._super();
			this.uidialog.addclass( this.options.dialogclass );
		},
		_setoption: function( key, value ) {
			if ( key === "dialogclass" ) {
				this.uidialog
					.removeclass( this.options.dialogclass )
					.addclass( value );
			}
			this._superapply( arguments );
		}
	} );
}

return $.ui.dialog;

} );








