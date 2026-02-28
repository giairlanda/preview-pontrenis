/*!
 * jquery ui controlgroup 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: controlgroup
//>>group: widgets
//>>description: visually groups form control widgets
//>>docs: https://api.jqueryui.com/controlgroup/
//>>demos: https://jqueryui.com/controlgroup/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/controlgroup.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

var controlgroupcornerregex = /ui-corner-([a-z]){2,6}/g;

return $.widget( "ui.controlgroup", {
	version: "1.13.3",
	defaultelement: "<div>",
	options: {
		direction: "horizontal",
		disabled: null,
		onlyvisible: true,
		items: {
			"button": "input[type=button], input[type=submit], input[type=reset], button, a",
			"controlgrouplabel": ".ui-controlgroup-label",
			"checkboxradio": "input[type='checkbox'], input[type='radio']",
			"selectmenu": "select",
			"spinner": ".ui-spinner-input"
		}
	},

	_create: function() {
		this._enhance();
	},

	// to support the enhanced option in jquery mobile, we isolate dom manipulation
	_enhance: function() {
		this.element.attr( "role", "toolbar" );
		this.refresh();
	},

	_destroy: function() {
		this._callchildmethod( "destroy" );
		this.childwidgets.removedata( "ui-controlgroup-data" );
		this.element.removeattr( "role" );
		if ( this.options.items.controlgrouplabel ) {
			this.element
				.find( this.options.items.controlgrouplabel )
				.find( ".ui-controlgroup-label-contents" )
				.contents().unwrap();
		}
	},

	_initwidgets: function() {
		var that = this,
			childwidgets = [];

		// first we iterate over each of the items options
		$.each( this.options.items, function( widget, selector ) {
			var labels;
			var options = {};

			// make sure the widget has a selector set
			if ( !selector ) {
				return;
			}

			if ( widget === "controlgrouplabel" ) {
				labels = that.element.find( selector );
				labels.each( function() {
					var element = $( this );

					if ( element.children( ".ui-controlgroup-label-contents" ).length ) {
						return;
					}
					element.contents()
						.wrapall( "<span class='ui-controlgroup-label-contents'></span>" );
				} );
				that._addclass( labels, null, "ui-widget ui-widget-content ui-state-default" );
				childwidgets = childwidgets.concat( labels.get() );
				return;
			}

			// make sure the widget actually exists
			if ( !$.fn[ widget ] ) {
				return;
			}

			// we assume everything is in the middle to start because we can't determine
			// first / last elements until all enhancments are done.
			if ( that[ "_" + widget + "options" ] ) {
				options = that[ "_" + widget + "options" ]( "middle" );
			} else {
				options = { classes: {} };
			}

			// find instances of this widget inside controlgroup and init them
			that.element
				.find( selector )
				.each( function() {
					var element = $( this );
					var instance = element[ widget ]( "instance" );

					// we need to clone the default options for this type of widget to avoid
					// polluting the variable options which has a wider scope than a single widget.
					var instanceoptions = $.widget.extend( {}, options );

					// if the button is the child of a spinner ignore it
					// todo: find a more generic solution
					if ( widget === "button" && element.parent( ".ui-spinner" ).length ) {
						return;
					}

					// create the widget if it doesn't exist
					if ( !instance ) {
						instance = element[ widget ]()[ widget ]( "instance" );
					}
					if ( instance ) {
						instanceoptions.classes =
							that._resolveclassesvalues( instanceoptions.classes, instance );
					}
					element[ widget ]( instanceoptions );

					// store an instance of the controlgroup to be able to reference
					// from the outermost element for changing options and refresh
					var widgetelement = element[ widget ]( "widget" );
					$.data( widgetelement[ 0 ], "ui-controlgroup-data",
						instance ? instance : element[ widget ]( "instance" ) );

					childwidgets.push( widgetelement[ 0 ] );
				} );
		} );

		this.childwidgets = $( $.uniquesort( childwidgets ) );
		this._addclass( this.childwidgets, "ui-controlgroup-item" );
	},

	_callchildmethod: function( method ) {
		this.childwidgets.each( function() {
			var element = $( this ),
				data = element.data( "ui-controlgroup-data" );
			if ( data && data[ method ] ) {
				data[ method ]();
			}
		} );
	},

	_updatecornerclass: function( element, position ) {
		var remove = "ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all";
		var add = this._buildsimpleoptions( position, "label" ).classes.label;

		this._removeclass( element, null, remove );
		this._addclass( element, null, add );
	},

	_buildsimpleoptions: function( position, key ) {
		var direction = this.options.direction === "vertical";
		var result = {
			classes: {}
		};
		result.classes[ key ] = {
			"middle": "",
			"first": "ui-corner-" + ( direction ? "top" : "left" ),
			"last": "ui-corner-" + ( direction ? "bottom" : "right" ),
			"only": "ui-corner-all"
		}[ position ];

		return result;
	},

	_spinneroptions: function( position ) {
		var options = this._buildsimpleoptions( position, "ui-spinner" );

		options.classes[ "ui-spinner-up" ] = "";
		options.classes[ "ui-spinner-down" ] = "";

		return options;
	},

	_buttonoptions: function( position ) {
		return this._buildsimpleoptions( position, "ui-button" );
	},

	_checkboxradiooptions: function( position ) {
		return this._buildsimpleoptions( position, "ui-checkboxradio-label" );
	},

	_selectmenuoptions: function( position ) {
		var direction = this.options.direction === "vertical";
		return {
			width: direction ? "auto" : false,
			classes: {
				middle: {
					"ui-selectmenu-button-open": "",
					"ui-selectmenu-button-closed": ""
				},
				first: {
					"ui-selectmenu-button-open": "ui-corner-" + ( direction ? "top" : "tl" ),
					"ui-selectmenu-button-closed": "ui-corner-" + ( direction ? "top" : "left" )
				},
				last: {
					"ui-selectmenu-button-open": direction ? "" : "ui-corner-tr",
					"ui-selectmenu-button-closed": "ui-corner-" + ( direction ? "bottom" : "right" )
				},
				only: {
					"ui-selectmenu-button-open": "ui-corner-top",
					"ui-selectmenu-button-closed": "ui-corner-all"
				}

			}[ position ]
		};
	},

	_resolveclassesvalues: function( classes, instance ) {
		var result = {};
		$.each( classes, function( key ) {
			var current = instance.options.classes[ key ] || "";
			current = string.prototype.trim.call( current.replace( controlgroupcornerregex, "" ) );
			result[ key ] = ( current + " " + classes[ key ] ).replace( /\s+/g, " " );
		} );
		return result;
	},

	_setoption: function( key, value ) {
		if ( key === "direction" ) {
			this._removeclass( "ui-controlgroup-" + this.options.direction );
		}

		this._super( key, value );
		if ( key === "disabled" ) {
			this._callchildmethod( value ? "disable" : "enable" );
			return;
		}

		this.refresh();
	},

	refresh: function() {
		var children,
			that = this;

		this._addclass( "ui-controlgroup ui-controlgroup-" + this.options.direction );

		if ( this.options.direction === "horizontal" ) {
			this._addclass( null, "ui-helper-clearfix" );
		}
		this._initwidgets();

		children = this.childwidgets;

		// we filter here because we need to track all childwidgets not just the visible ones
		if ( this.options.onlyvisible ) {
			children = children.filter( ":visible" );
		}

		if ( children.length ) {

			// we do this last because we need to make sure all enhancment is done
			// before determining first and last
			$.each( [ "first", "last" ], function( index, value ) {
				var instance = children[ value ]().data( "ui-controlgroup-data" );

				if ( instance && that[ "_" + instance.widgetname + "options" ] ) {
					var options = that[ "_" + instance.widgetname + "options" ](
						children.length === 1 ? "only" : value
					);
					options.classes = that._resolveclassesvalues( options.classes, instance );
					instance.element[ instance.widgetname ]( options );
				} else {
					that._updatecornerclass( children[ value ](), value );
				}
			} );

			// finally call the refresh method on each of the child widgets.
			this._callchildmethod( "refresh" );
		}
	}
} );
} );






