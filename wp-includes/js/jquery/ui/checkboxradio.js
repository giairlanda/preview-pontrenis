/*!
 * jquery ui checkboxradio 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: checkboxradio
//>>group: widgets
//>>description: enhances a form with multiple themeable checkboxes or radio buttons.
//>>docs: https://api.jqueryui.com/checkboxradio/
//>>demos: https://jqueryui.com/checkboxradio/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.structure: ../../themes/base/checkboxradio.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../form-reset-mixin",
			"../labels",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

$.widget( "ui.checkboxradio", [ $.ui.formresetmixin, {
	version: "1.13.3",
	options: {
		disabled: null,
		label: null,
		icon: true,
		classes: {
			"ui-checkboxradio-label": "ui-corner-all",
			"ui-checkboxradio-icon": "ui-corner-all"
		}
	},

	_getcreateoptions: function() {
		var disabled, labels, labelcontents;
		var options = this._super() || {};

		// we read the type here, because it makes more sense to throw a element type error first,
		// rather then the error for lack of a label. often if its the wrong type, it
		// won't have a label (e.g. calling on a div, btn, etc)
		this._readtype();

		labels = this.element.labels();

		// if there are multiple labels, use the last one
		this.label = $( labels[ labels.length - 1 ] );
		if ( !this.label.length ) {
			$.error( "no label found for checkboxradio widget" );
		}

		this.originallabel = "";

		// we need to get the label text but this may also need to make sure it does not contain the
		// input itself.
		// the label contents could be text, html, or a mix. we wrap all elements
		// and read the wrapper's `innerhtml` to get a string representation of
		// the label, without the input as part of it.
		labelcontents = this.label.contents().not( this.element[ 0 ] );

		if ( labelcontents.length ) {
			this.originallabel += labelcontents
				.clone()
				.wrapall( "<div></div>" )
				.parent()
				.html();
		}

		// set the label option if we found label text
		if ( this.originallabel ) {
			options.label = this.originallabel;
		}

		disabled = this.element[ 0 ].disabled;
		if ( disabled != null ) {
			options.disabled = disabled;
		}
		return options;
	},

	_create: function() {
		var checked = this.element[ 0 ].checked;

		this._bindformresethandler();

		if ( this.options.disabled == null ) {
			this.options.disabled = this.element[ 0 ].disabled;
		}

		this._setoption( "disabled", this.options.disabled );
		this._addclass( "ui-checkboxradio", "ui-helper-hidden-accessible" );
		this._addclass( this.label, "ui-checkboxradio-label", "ui-button ui-widget" );

		if ( this.type === "radio" ) {
			this._addclass( this.label, "ui-checkboxradio-radio-label" );
		}

		if ( this.options.label && this.options.label !== this.originallabel ) {
			this._updatelabel();
		} else if ( this.originallabel ) {
			this.options.label = this.originallabel;
		}

		this._enhance();

		if ( checked ) {
			this._addclass( this.label, "ui-checkboxradio-checked", "ui-state-active" );
		}

		this._on( {
			change: "_toggleclasses",
			focus: function() {
				this._addclass( this.label, null, "ui-state-focus ui-visual-focus" );
			},
			blur: function() {
				this._removeclass( this.label, null, "ui-state-focus ui-visual-focus" );
			}
		} );
	},

	_readtype: function() {
		var nodename = this.element[ 0 ].nodename.tolowercase();
		this.type = this.element[ 0 ].type;
		if ( nodename !== "input" || !/radio|checkbox/.test( this.type ) ) {
			$.error( "can't create checkboxradio on element.nodename=" + nodename +
				" and element.type=" + this.type );
		}
	},

	// support jquery mobile enhanced option
	_enhance: function() {
		this._updateicon( this.element[ 0 ].checked );
	},

	widget: function() {
		return this.label;
	},

	_getradiogroup: function() {
		var group;
		var name = this.element[ 0 ].name;
		var nameselector = "input[name='" + $.escapeselector( name ) + "']";

		if ( !name ) {
			return $( [] );
		}

		if ( this.form.length ) {
			group = $( this.form[ 0 ].elements ).filter( nameselector );
		} else {

			// not inside a form, check all inputs that also are not inside a form
			group = $( nameselector ).filter( function() {
				return $( this )._form().length === 0;
			} );
		}

		return group.not( this.element );
	},

	_toggleclasses: function() {
		var checked = this.element[ 0 ].checked;
		this._toggleclass( this.label, "ui-checkboxradio-checked", "ui-state-active", checked );

		if ( this.options.icon && this.type === "checkbox" ) {
			this._toggleclass( this.icon, null, "ui-icon-check ui-state-checked", checked )
				._toggleclass( this.icon, null, "ui-icon-blank", !checked );
		}

		if ( this.type === "radio" ) {
			this._getradiogroup()
				.each( function() {
					var instance = $( this ).checkboxradio( "instance" );

					if ( instance ) {
						instance._removeclass( instance.label,
							"ui-checkboxradio-checked", "ui-state-active" );
					}
				} );
		}
	},

	_destroy: function() {
		this._unbindformresethandler();

		if ( this.icon ) {
			this.icon.remove();
			this.iconspace.remove();
		}
	},

	_setoption: function( key, value ) {

		// we don't allow the value to be set to nothing
		if ( key === "label" && !value ) {
			return;
		}

		this._super( key, value );

		if ( key === "disabled" ) {
			this._toggleclass( this.label, null, "ui-state-disabled", value );
			this.element[ 0 ].disabled = value;

			// don't refresh when setting disabled
			return;
		}
		this.refresh();
	},

	_updateicon: function( checked ) {
		var toadd = "ui-icon ui-icon-background ";

		if ( this.options.icon ) {
			if ( !this.icon ) {
				this.icon = $( "<span>" );
				this.iconspace = $( "<span> </span>" );
				this._addclass( this.iconspace, "ui-checkboxradio-icon-space" );
			}

			if ( this.type === "checkbox" ) {
				toadd += checked ? "ui-icon-check ui-state-checked" : "ui-icon-blank";
				this._removeclass( this.icon, null, checked ? "ui-icon-blank" : "ui-icon-check" );
			} else {
				toadd += "ui-icon-blank";
			}
			this._addclass( this.icon, "ui-checkboxradio-icon", toadd );
			if ( !checked ) {
				this._removeclass( this.icon, null, "ui-icon-check ui-state-checked" );
			}
			this.icon.prependto( this.label ).after( this.iconspace );
		} else if ( this.icon !== undefined ) {
			this.icon.remove();
			this.iconspace.remove();
			delete this.icon;
		}
	},

	_updatelabel: function() {

		// remove the contents of the label ( minus the icon, icon space, and input )
		var contents = this.label.contents().not( this.element[ 0 ] );
		if ( this.icon ) {
			contents = contents.not( this.icon[ 0 ] );
		}
		if ( this.iconspace ) {
			contents = contents.not( this.iconspace[ 0 ] );
		}
		contents.remove();

		this.label.append( this.options.label );
	},

	refresh: function() {
		var checked = this.element[ 0 ].checked,
			isdisabled = this.element[ 0 ].disabled;

		this._updateicon( checked );
		this._toggleclass( this.label, "ui-checkboxradio-checked", "ui-state-active", checked );
		if ( this.options.label !== null ) {
			this._updatelabel();
		}

		if ( isdisabled !== this.options.disabled ) {
			this._setoptions( { "disabled": isdisabled } );
		}
	}

} ] );

return $.ui.checkboxradio;

} );



