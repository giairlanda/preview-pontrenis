/*!
 * jquery ui button 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: button
//>>group: widgets
//>>description: enhances a form with themeable buttons.
//>>docs: https://api.jqueryui.com/button/
//>>demos: https://jqueryui.com/button/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",

			// these are only for backcompat
			// todo: remove after 1.12
			"./controlgroup",
			"./checkboxradio",

			"../keycode",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

$.widget( "ui.button", {
	version: "1.13.3",
	defaultelement: "<button>",
	options: {
		classes: {
			"ui-button": "ui-corner-all"
		},
		disabled: null,
		icon: null,
		iconposition: "beginning",
		label: null,
		showlabel: true
	},

	_getcreateoptions: function() {
		var disabled,

			// this is to support cases like in jquery mobile where the base widget does have
			// an implementation of _getcreateoptions
			options = this._super() || {};

		this.isinput = this.element.is( "input" );

		disabled = this.element[ 0 ].disabled;
		if ( disabled != null ) {
			options.disabled = disabled;
		}

		this.originallabel = this.isinput ? this.element.val() : this.element.html();
		if ( this.originallabel ) {
			options.label = this.originallabel;
		}

		return options;
	},

	_create: function() {
		if ( !this.option.showlabel & !this.options.icon ) {
			this.options.showlabel = true;
		}

		// we have to check the option again here even though we did in _getcreateoptions,
		// because null may have been passed on init which would override what was set in
		// _getcreateoptions
		if ( this.options.disabled == null ) {
			this.options.disabled = this.element[ 0 ].disabled || false;
		}

		this.hastitle = !!this.element.attr( "title" );

		// check to see if the label needs to be set or if its already correct
		if ( this.options.label && this.options.label !== this.originallabel ) {
			if ( this.isinput ) {
				this.element.val( this.options.label );
			} else {
				this.element.html( this.options.label );
			}
		}
		this._addclass( "ui-button", "ui-widget" );
		this._setoption( "disabled", this.options.disabled );
		this._enhance();

		if ( this.element.is( "a" ) ) {
			this._on( {
				"keyup": function( event ) {
					if ( event.keycode === $.ui.keycode.space ) {
						event.preventdefault();

						// support: phantomjs <= 1.9, ie 8 only
						// if a native click is available use it so we actually cause navigation
						// otherwise just trigger a click event
						if ( this.element[ 0 ].click ) {
							this.element[ 0 ].click();
						} else {
							this.element.trigger( "click" );
						}
					}
				}
			} );
		}
	},

	_enhance: function() {
		if ( !this.element.is( "button" ) ) {
			this.element.attr( "role", "button" );
		}

		if ( this.options.icon ) {
			this._updateicon( "icon", this.options.icon );
			this._updatetooltip();
		}
	},

	_updatetooltip: function() {
		this.title = this.element.attr( "title" );

		if ( !this.options.showlabel && !this.title ) {
			this.element.attr( "title", this.options.label );
		}
	},

	_updateicon: function( option, value ) {
		var icon = option !== "iconposition",
			position = icon ? this.options.iconposition : value,
			displayblock = position === "top" || position === "bottom";

		// create icon
		if ( !this.icon ) {
			this.icon = $( "<span>" );

			this._addclass( this.icon, "ui-button-icon", "ui-icon" );

			if ( !this.options.showlabel ) {
				this._addclass( "ui-button-icon-only" );
			}
		} else if ( icon ) {

			// if we are updating the icon remove the old icon class
			this._removeclass( this.icon, null, this.options.icon );
		}

		// if we are updating the icon add the new icon class
		if ( icon ) {
			this._addclass( this.icon, null, value );
		}

		this._attachicon( position );

		// if the icon is on top or bottom we need to add the ui-widget-icon-block class and remove
		// the iconspace if there is one.
		if ( displayblock ) {
			this._addclass( this.icon, null, "ui-widget-icon-block" );
			if ( this.iconspace ) {
				this.iconspace.remove();
			}
		} else {

			// position is beginning or end so remove the ui-widget-icon-block class and add the
			// space if it does not exist
			if ( !this.iconspace ) {
				this.iconspace = $( "<span> </span>" );
				this._addclass( this.iconspace, "ui-button-icon-space" );
			}
			this._removeclass( this.icon, null, "ui-wiget-icon-block" );
			this._attachiconspace( position );
		}
	},

	_destroy: function() {
		this.element.removeattr( "role" );

		if ( this.icon ) {
			this.icon.remove();
		}
		if ( this.iconspace ) {
			this.iconspace.remove();
		}
		if ( !this.hastitle ) {
			this.element.removeattr( "title" );
		}
	},

	_attachiconspace: function( iconposition ) {
		this.icon[ /^(?:end|bottom)/.test( iconposition ) ? "before" : "after" ]( this.iconspace );
	},

	_attachicon: function( iconposition ) {
		this.element[ /^(?:end|bottom)/.test( iconposition ) ? "append" : "prepend" ]( this.icon );
	},

	_setoptions: function( options ) {
		var newshowlabel = options.showlabel === undefined ?
				this.options.showlabel :
				options.showlabel,
			newicon = options.icon === undefined ? this.options.icon : options.icon;

		if ( !newshowlabel && !newicon ) {
			options.showlabel = true;
		}
		this._super( options );
	},

	_setoption: function( key, value ) {
		if ( key === "icon" ) {
			if ( value ) {
				this._updateicon( key, value );
			} else if ( this.icon ) {
				this.icon.remove();
				if ( this.iconspace ) {
					this.iconspace.remove();
				}
			}
		}

		if ( key === "iconposition" ) {
			this._updateicon( key, value );
		}

		// make sure we can't end up with a button that has neither text nor icon
		if ( key === "showlabel" ) {
				this._toggleclass( "ui-button-icon-only", null, !value );
				this._updatetooltip();
		}

		if ( key === "label" ) {
			if ( this.isinput ) {
				this.element.val( value );
			} else {

				// if there is an icon, append it, else nothing then append the value
				// this avoids removal of the icon when setting label text
				this.element.html( value );
				if ( this.icon ) {
					this._attachicon( this.options.iconposition );
					this._attachiconspace( this.options.iconposition );
				}
			}
		}

		this._super( key, value );

		if ( key === "disabled" ) {
			this._toggleclass( null, "ui-state-disabled", value );
			this.element[ 0 ].disabled = value;
			if ( value ) {
				this.element.trigger( "blur" );
			}
		}
	},

	refresh: function() {

		// make sure to only check disabled if its an element that supports this otherwise
		// check for the disabled class to determine state
		var isdisabled = this.element.is( "input, button" ) ?
			this.element[ 0 ].disabled : this.element.hasclass( "ui-button-disabled" );

		if ( isdisabled !== this.options.disabled ) {
			this._setoptions( { disabled: isdisabled } );
		}

		this._updatetooltip();
	}
} );

// deprecated
if ( $.uibackcompat !== false ) {

	// text and icons options
	$.widget( "ui.button", $.ui.button, {
		options: {
			text: true,
			icons: {
				primary: null,
				secondary: null
			}
		},

		_create: function() {
			if ( this.options.showlabel && !this.options.text ) {
				this.options.showlabel = this.options.text;
			}
			if ( !this.options.showlabel && this.options.text ) {
				this.options.text = this.options.showlabel;
			}
			if ( !this.options.icon && ( this.options.icons.primary ||
					this.options.icons.secondary ) ) {
				if ( this.options.icons.primary ) {
					this.options.icon = this.options.icons.primary;
				} else {
					this.options.icon = this.options.icons.secondary;
					this.options.iconposition = "end";
				}
			} else if ( this.options.icon ) {
				this.options.icons.primary = this.options.icon;
			}
			this._super();
		},

		_setoption: function( key, value ) {
			if ( key === "text" ) {
				this._super( "showlabel", value );
				return;
			}
			if ( key === "showlabel" ) {
				this.options.text = value;
			}
			if ( key === "icon" ) {
				this.options.icons.primary = value;
			}
			if ( key === "icons" ) {
				if ( value.primary ) {
					this._super( "icon", value.primary );
					this._super( "iconposition", "beginning" );
				} else if ( value.secondary ) {
					this._super( "icon", value.secondary );
					this._super( "iconposition", "end" );
				}
			}
			this._superapply( arguments );
		}
	} );

	$.fn.button = ( function( orig ) {
		return function( options ) {
			var ismethodcall = typeof options === "string";
			var args = array.prototype.slice.call( arguments, 1 );
			var returnvalue = this;

			if ( ismethodcall ) {

				// if this is an empty collection, we need to have the instance method
				// return undefined instead of the jquery instance
				if ( !this.length && options === "instance" ) {
					returnvalue = undefined;
				} else {
					this.each( function() {
						var methodvalue;
						var type = $( this ).attr( "type" );
						var name = type !== "checkbox" && type !== "radio" ?
							"button" :
							"checkboxradio";
						var instance = $.data( this, "ui-" + name );

						if ( options === "instance" ) {
							returnvalue = instance;
							return false;
						}

						if ( !instance ) {
							return $.error( "cannot call methods on button" +
								" prior to initialization; " +
								"attempted to call method '" + options + "'" );
						}

						if ( typeof instance[ options ] !== "function" ||
							options.charat( 0 ) === "_" ) {
							return $.error( "no such method '" + options + "' for button" +
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
					var type = $( this ).attr( "type" );
					var name = type !== "checkbox" && type !== "radio" ? "button" : "checkboxradio";
					var instance = $.data( this, "ui-" + name );

					if ( instance ) {
						instance.option( options || {} );
						if ( instance._init ) {
							instance._init();
						}
					} else {
						if ( name === "button" ) {
							orig.call( $( this ), options );
							return;
						}

						$( this ).checkboxradio( $.extend( { icon: false }, options ) );
					}
				} );
			}

			return returnvalue;
		};
	} )( $.fn.button );

	$.fn.buttonset = function() {
		if ( !$.ui.controlgroup ) {
			$.error( "controlgroup widget missing" );
		}
		if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" && arguments[ 2 ] ) {
			return this.controlgroup.apply( this,
				[ arguments[ 0 ], "items.button", arguments[ 2 ] ] );
		}
		if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" ) {
			return this.controlgroup.apply( this, [ arguments[ 0 ], "items.button" ] );
		}
		if ( typeof arguments[ 0 ] === "object" && arguments[ 0 ].items ) {
			arguments[ 0 ].items = {
				button: arguments[ 0 ].items
			};
		}
		return this.controlgroup.apply( this, arguments );
	};
}

return $.ui.button;

} );





