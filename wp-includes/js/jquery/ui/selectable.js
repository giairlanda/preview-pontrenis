/*!
 * jquery ui selectable 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: selectable
//>>group: interactions
//>>description: allows groups of elements to be selected with the mouse.
//>>docs: https://api.jqueryui.com/selectable/
//>>demos: https://jqueryui.com/selectable/
//>>css.structure: ../../themes/base/selectable.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
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

return $.widget( "ui.selectable", $.ui.mouse, {
	version: "1.13.3",
	options: {
		appendto: "body",
		autorefresh: true,
		distance: 0,
		filter: "*",
		tolerance: "touch",

		// callbacks
		selected: null,
		selecting: null,
		start: null,
		stop: null,
		unselected: null,
		unselecting: null
	},
	_create: function() {
		var that = this;

		this._addclass( "ui-selectable" );

		this.dragged = false;

		// cache selectee children based on filter
		this.refresh = function() {
			that.elementpos = $( that.element[ 0 ] ).offset();
			that.selectees = $( that.options.filter, that.element[ 0 ] );
			that._addclass( that.selectees, "ui-selectee" );
			that.selectees.each( function() {
				var $this = $( this ),
					selecteeoffset = $this.offset(),
					pos = {
						left: selecteeoffset.left - that.elementpos.left,
						top: selecteeoffset.top - that.elementpos.top
					};
				$.data( this, "selectable-item", {
					element: this,
					$element: $this,
					left: pos.left,
					top: pos.top,
					right: pos.left + $this.outerwidth(),
					bottom: pos.top + $this.outerheight(),
					startselected: false,
					selected: $this.hasclass( "ui-selected" ),
					selecting: $this.hasclass( "ui-selecting" ),
					unselecting: $this.hasclass( "ui-unselecting" )
				} );
			} );
		};
		this.refresh();

		this._mouseinit();

		this.helper = $( "<div>" );
		this._addclass( this.helper, "ui-selectable-helper" );
	},

	_destroy: function() {
		this.selectees.removedata( "selectable-item" );
		this._mousedestroy();
	},

	_mousestart: function( event ) {
		var that = this,
			options = this.options;

		this.opos = [ event.pagex, event.pagey ];
		this.elementpos = $( this.element[ 0 ] ).offset();

		if ( this.options.disabled ) {
			return;
		}

		this.selectees = $( options.filter, this.element[ 0 ] );

		this._trigger( "start", event );

		$( options.appendto ).append( this.helper );

		// position helper (lasso)
		this.helper.css( {
			"left": event.pagex,
			"top": event.pagey,
			"width": 0,
			"height": 0
		} );

		if ( options.autorefresh ) {
			this.refresh();
		}

		this.selectees.filter( ".ui-selected" ).each( function() {
			var selectee = $.data( this, "selectable-item" );
			selectee.startselected = true;
			if ( !event.metakey && !event.ctrlkey ) {
				that._removeclass( selectee.$element, "ui-selected" );
				selectee.selected = false;
				that._addclass( selectee.$element, "ui-unselecting" );
				selectee.unselecting = true;

				// selectable unselecting callback
				that._trigger( "unselecting", event, {
					unselecting: selectee.element
				} );
			}
		} );

		$( event.target ).parents().addback().each( function() {
			var doselect,
				selectee = $.data( this, "selectable-item" );
			if ( selectee ) {
				doselect = ( !event.metakey && !event.ctrlkey ) ||
					!selectee.$element.hasclass( "ui-selected" );
				that._removeclass( selectee.$element, doselect ? "ui-unselecting" : "ui-selected" )
					._addclass( selectee.$element, doselect ? "ui-selecting" : "ui-unselecting" );
				selectee.unselecting = !doselect;
				selectee.selecting = doselect;
				selectee.selected = doselect;

				// selectable (un)selecting callback
				if ( doselect ) {
					that._trigger( "selecting", event, {
						selecting: selectee.element
					} );
				} else {
					that._trigger( "unselecting", event, {
						unselecting: selectee.element
					} );
				}
				return false;
			}
		} );

	},

	_mousedrag: function( event ) {

		this.dragged = true;

		if ( this.options.disabled ) {
			return;
		}

		var tmp,
			that = this,
			options = this.options,
			x1 = this.opos[ 0 ],
			y1 = this.opos[ 1 ],
			x2 = event.pagex,
			y2 = event.pagey;

		if ( x1 > x2 ) {
			tmp = x2; x2 = x1; x1 = tmp;
		}
		if ( y1 > y2 ) {
			tmp = y2; y2 = y1; y1 = tmp;
		}
		this.helper.css( { left: x1, top: y1, width: x2 - x1, height: y2 - y1 } );

		this.selectees.each( function() {
			var selectee = $.data( this, "selectable-item" ),
				hit = false,
				offset = {};

			//prevent helper from being selected if appendto: selectable
			if ( !selectee || selectee.element === that.element[ 0 ] ) {
				return;
			}

			offset.left   = selectee.left   + that.elementpos.left;
			offset.right  = selectee.right  + that.elementpos.left;
			offset.top    = selectee.top    + that.elementpos.top;
			offset.bottom = selectee.bottom + that.elementpos.top;

			if ( options.tolerance === "touch" ) {
				hit = ( !( offset.left > x2 || offset.right < x1 || offset.top > y2 ||
                    offset.bottom < y1 ) );
			} else if ( options.tolerance === "fit" ) {
				hit = ( offset.left > x1 && offset.right < x2 && offset.top > y1 &&
                    offset.bottom < y2 );
			}

			if ( hit ) {

				// select
				if ( selectee.selected ) {
					that._removeclass( selectee.$element, "ui-selected" );
					selectee.selected = false;
				}
				if ( selectee.unselecting ) {
					that._removeclass( selectee.$element, "ui-unselecting" );
					selectee.unselecting = false;
				}
				if ( !selectee.selecting ) {
					that._addclass( selectee.$element, "ui-selecting" );
					selectee.selecting = true;

					// selectable selecting callback
					that._trigger( "selecting", event, {
						selecting: selectee.element
					} );
				}
			} else {

				// unselect
				if ( selectee.selecting ) {
					if ( ( event.metakey || event.ctrlkey ) && selectee.startselected ) {
						that._removeclass( selectee.$element, "ui-selecting" );
						selectee.selecting = false;
						that._addclass( selectee.$element, "ui-selected" );
						selectee.selected = true;
					} else {
						that._removeclass( selectee.$element, "ui-selecting" );
						selectee.selecting = false;
						if ( selectee.startselected ) {
							that._addclass( selectee.$element, "ui-unselecting" );
							selectee.unselecting = true;
						}

						// selectable unselecting callback
						that._trigger( "unselecting", event, {
							unselecting: selectee.element
						} );
					}
				}
				if ( selectee.selected ) {
					if ( !event.metakey && !event.ctrlkey && !selectee.startselected ) {
						that._removeclass( selectee.$element, "ui-selected" );
						selectee.selected = false;

						that._addclass( selectee.$element, "ui-unselecting" );
						selectee.unselecting = true;

						// selectable unselecting callback
						that._trigger( "unselecting", event, {
							unselecting: selectee.element
						} );
					}
				}
			}
		} );

		return false;
	},

	_mousestop: function( event ) {
		var that = this;

		this.dragged = false;

		$( ".ui-unselecting", this.element[ 0 ] ).each( function() {
			var selectee = $.data( this, "selectable-item" );
			that._removeclass( selectee.$element, "ui-unselecting" );
			selectee.unselecting = false;
			selectee.startselected = false;
			that._trigger( "unselected", event, {
				unselected: selectee.element
			} );
		} );
		$( ".ui-selecting", this.element[ 0 ] ).each( function() {
			var selectee = $.data( this, "selectable-item" );
			that._removeclass( selectee.$element, "ui-selecting" )
				._addclass( selectee.$element, "ui-selected" );
			selectee.selecting = false;
			selectee.selected = true;
			selectee.startselected = true;
			that._trigger( "selected", event, {
				selected: selectee.element
			} );
		} );
		this._trigger( "stop", event );

		this.helper.remove();

		return false;
	}

} );

} );






