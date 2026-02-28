/* eslint-disable max-len, camelcase */
/*!
 * jquery ui datepicker 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: datepicker
//>>group: widgets
//>>description: displays a calendar from an input or inline for selecting dates.
//>>docs: https://api.jqueryui.com/datepicker/
//>>demos: https://jqueryui.com/datepicker/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/datepicker.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"../version",
			"../keycode"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

$.extend( $.ui, { datepicker: { version: "1.13.3" } } );

var datepicker_instactive;

function datepicker_getzindex( elem ) {
	var position, value;
	while ( elem.length && elem[ 0 ] !== document ) {

		// ignore z-index if position is set to a value where z-index is ignored by the browser
		// this makes behavior of this function consistent across browsers
		// webkit always returns auto if the element is positioned
		position = elem.css( "position" );
		if ( position === "absolute" || position === "relative" || position === "fixed" ) {

			// ie returns 0 when zindex is not specified
			// other browsers return a string
			// we ignore the case of nested elements with an explicit value of 0
			// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
			value = parseint( elem.css( "zindex" ), 10 );
			if ( !isnan( value ) && value !== 0 ) {
				return value;
			}
		}
		elem = elem.parent();
	}

	return 0;
}

/* date picker manager.
   use the singleton instance of this class, $.datepicker, to interact with the date picker.
   settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function datepicker() {
	this._curinst = null; // the current instance in use
	this._keyevent = false; // if the last event was a key event
	this._disabledinputs = []; // list of date picker inputs that have been disabled
	this._datepickershowing = false; // true if the popup picker is showing , false if not
	this._indialog = false; // true if showing within a "dialog", false if not
	this._maindivid = "ui-datepicker-div"; // the id of the main datepicker division
	this._inlineclass = "ui-datepicker-inline"; // the name of the inline marker class
	this._appendclass = "ui-datepicker-append"; // the name of the append marker class
	this._triggerclass = "ui-datepicker-trigger"; // the name of the trigger marker class
	this._dialogclass = "ui-datepicker-dialog"; // the name of the dialog marker class
	this._disableclass = "ui-datepicker-disabled"; // the name of the disabled covering marker class
	this._unselectableclass = "ui-datepicker-unselectable"; // the name of the unselectable cell marker class
	this._currentclass = "ui-datepicker-current-day"; // the name of the current day marker class
	this._dayoverclass = "ui-datepicker-days-cell-over"; // the name of the day hover marker class
	this.regional = []; // available regional settings, indexed by language code
	this.regional[ "" ] = { // default regional settings
		closetext: "done", // display text for close link
		prevtext: "prev", // display text for previous month link
		nexttext: "next", // display text for next month link
		currenttext: "today", // display text for current month link
		monthnames: [ "january", "february", "march", "april", "may", "june",
			"july", "august", "september", "october", "november", "december" ], // names of months for drop-down and formatting
		monthnamesshort: [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ], // for formatting
		daynames: [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ], // for formatting
		daynamesshort: [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ], // for formatting
		daynamesmin: [ "su", "mo", "tu", "we", "th", "fr", "sa" ], // column headings for days starting at sunday
		weekheader: "wk", // column header for week of the year
		dateformat: "mm/dd/yy", // see format options on parsedate
		firstday: 0, // the first day of the week, sun = 0, mon = 1, ...
		isrtl: false, // true if right-to-left language, false if left-to-right
		showmonthafteryear: false, // true if the year select precedes month, false for month then year
		yearsuffix: "", // additional text to append to the year in the month headers,
		selectmonthlabel: "select month", // invisible label for month selector
		selectyearlabel: "select year" // invisible label for year selector
	};
	this._defaults = { // global defaults for all the date picker instances
		showon: "focus", // "focus" for popup on focus,
			// "button" for trigger button, or "both" for either
		showanim: "fadein", // name of jquery animation for popup
		showoptions: {}, // options for enhanced animations
		defaultdate: null, // used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendtext: "", // display text following the input box, e.g. showing the format
		buttontext: "...", // text for trigger button
		buttonimage: "", // url for trigger button image
		buttonimageonly: false, // true if the image appears alone, false if it appears on a button
		hideifnoprevnext: false, // true to hide next/previous month links
			// if not applicable, false to just disable them
		navigationasdateformat: false, // true if date formatting applied to prev/today/next links
		gotocurrent: false, // true if today link goes back to current selection instead
		changemonth: false, // true if month can be selected directly, false if only prev/next
		changeyear: false, // true if year can be selected directly, false if only prev/next
		yearrange: "c-10:c+10", // range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
		showothermonths: false, // true to show dates in other months, false to leave blank
		selectothermonths: false, // true to allow selection of dates in other months, false for unselectable
		showweek: false, // true to show week of the year, false to not show it
		calculateweek: this.iso8601week, // how to calculate the week of the year,
			// takes a date and returns the number of the week for it
		shortyearcutoff: "+10", // short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with "+" for current year + value
		mindate: null, // the earliest selectable date, or null for no limit
		maxdate: null, // the latest selectable date, or null for no limit
		duration: "fast", // duration of display/closure
		beforeshowday: null, // function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom css class name(s) or "",
			// [2] = cell title (optional), e.g. $.datepicker.noweekends
		beforeshow: null, // function that takes an input field and
			// returns a set of custom settings for the date picker
		onselect: null, // define a callback function when a date is selected
		onchangemonthyear: null, // define a callback function when the month or year is changed
		onclose: null, // define a callback function when the datepicker is closed
		onupdatedatepicker: null, // define a callback function when the datepicker is updated
		numberofmonths: 1, // number of months to show at a time
		showcurrentatpos: 0, // the position in multipe months at which to show the current month (starting at 0)
		stepmonths: 1, // number of months to step back/forward
		stepbigmonths: 12, // number of months to step back/forward for the big links
		altfield: "", // selector for an alternate field to store selected dates into
		altformat: "", // the date format to use for the alternate field
		constraininput: true, // the input is constrained by the current date format
		showbuttonpanel: false, // true to show button panel, false to not show it
		autosize: false, // true to size the input for the date format, false to leave as is
		disabled: false // the initial disabled state
	};
	$.extend( this._defaults, this.regional[ "" ] );
	this.regional.en = $.extend( true, {}, this.regional[ "" ] );
	this.regional[ "en-us" ] = $.extend( true, {}, this.regional.en );
	this.dpdiv = datepicker_bindhover( $( "<div id='" + this._maindivid + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>" ) );
}

$.extend( datepicker.prototype, {

	/* class name added to elements to indicate already configured with a date picker. */
	markerclassname: "hasdatepicker",

	//keep track of the maximum number of rows displayed (see #7043)
	maxrows: 4,

	// todo rename to "widget" when switching to widget factory
	_widgetdatepicker: function() {
		return this.dpdiv;
	},

	/* override the default settings for all instances of the date picker.
	 * @param  settings  object - the new settings to use as defaults (anonymous object)
	 * @return the manager object
	 */
	setdefaults: function( settings ) {
		datepicker_extendremove( this._defaults, settings || {} );
		return this;
	},

	/* attach the date picker to a jquery selection.
	 * @param  target	element - the target input field or division or span
	 * @param  settings  object - the new settings to use for this date picker instance (anonymous)
	 */
	_attachdatepicker: function( target, settings ) {
		var nodename, inline, inst;
		nodename = target.nodename.tolowercase();
		inline = ( nodename === "div" || nodename === "span" );
		if ( !target.id ) {
			this.uuid += 1;
			target.id = "dp" + this.uuid;
		}
		inst = this._newinst( $( target ), inline );
		inst.settings = $.extend( {}, settings || {} );
		if ( nodename === "input" ) {
			this._connectdatepicker( target, inst );
		} else if ( inline ) {
			this._inlinedatepicker( target, inst );
		}
	},

	/* create a new instance object. */
	_newinst: function( target, inline ) {
		var id = target[ 0 ].id.replace( /([^a-za-z0-9_\-])/g, "\\\\$1" ); // escape jquery meta chars
		return { id: id, input: target, // associated target
			selectedday: 0, selectedmonth: 0, selectedyear: 0, // current selection
			drawmonth: 0, drawyear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpdiv: ( !inline ? this.dpdiv : // presentation div
			datepicker_bindhover( $( "<div class='" + this._inlineclass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>" ) ) ) };
	},

	/* attach the date picker to an input field. */
	_connectdatepicker: function( target, inst ) {
		var input = $( target );
		inst.append = $( [] );
		inst.trigger = $( [] );
		if ( input.hasclass( this.markerclassname ) ) {
			return;
		}
		this._attachments( input, inst );
		input.addclass( this.markerclassname ).on( "keydown", this._dokeydown ).
			on( "keypress", this._dokeypress ).on( "keyup", this._dokeyup );
		this._autosize( inst );
		$.data( target, "datepicker", inst );

		//if disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if ( inst.settings.disabled ) {
			this._disabledatepicker( target );
		}
	},

	/* make attachments based on settings. */
	_attachments: function( input, inst ) {
		var showon, buttontext, buttonimage,
			appendtext = this._get( inst, "appendtext" ),
			isrtl = this._get( inst, "isrtl" );

		if ( inst.append ) {
			inst.append.remove();
		}
		if ( appendtext ) {
			inst.append = $( "<span>" )
				.addclass( this._appendclass )
				.text( appendtext );
			input[ isrtl ? "before" : "after" ]( inst.append );
		}

		input.off( "focus", this._showdatepicker );

		if ( inst.trigger ) {
			inst.trigger.remove();
		}

		showon = this._get( inst, "showon" );
		if ( showon === "focus" || showon === "both" ) { // pop-up date picker when in the marked field
			input.on( "focus", this._showdatepicker );
		}
		if ( showon === "button" || showon === "both" ) { // pop-up date picker when button clicked
			buttontext = this._get( inst, "buttontext" );
			buttonimage = this._get( inst, "buttonimage" );

			if ( this._get( inst, "buttonimageonly" ) ) {
				inst.trigger = $( "<img>" )
					.addclass( this._triggerclass )
					.attr( {
						src: buttonimage,
						alt: buttontext,
						title: buttontext
					} );
			} else {
				inst.trigger = $( "<button type='button'>" )
					.addclass( this._triggerclass );
				if ( buttonimage ) {
					inst.trigger.html(
						$( "<img>" )
							.attr( {
								src: buttonimage,
								alt: buttontext,
								title: buttontext
							} )
					);
				} else {
					inst.trigger.text( buttontext );
				}
			}

			input[ isrtl ? "before" : "after" ]( inst.trigger );
			inst.trigger.on( "click", function() {
				if ( $.datepicker._datepickershowing && $.datepicker._lastinput === input[ 0 ] ) {
					$.datepicker._hidedatepicker();
				} else if ( $.datepicker._datepickershowing && $.datepicker._lastinput !== input[ 0 ] ) {
					$.datepicker._hidedatepicker();
					$.datepicker._showdatepicker( input[ 0 ] );
				} else {
					$.datepicker._showdatepicker( input[ 0 ] );
				}
				return false;
			} );
		}
	},

	/* apply the maximum length for the date format. */
	_autosize: function( inst ) {
		if ( this._get( inst, "autosize" ) && !inst.inline ) {
			var findmax, max, maxi, i,
				date = new date( 2009, 12 - 1, 20 ), // ensure double digits
				dateformat = this._get( inst, "dateformat" );

			if ( dateformat.match( /[dm]/ ) ) {
				findmax = function( names ) {
					max = 0;
					maxi = 0;
					for ( i = 0; i < names.length; i++ ) {
						if ( names[ i ].length > max ) {
							max = names[ i ].length;
							maxi = i;
						}
					}
					return maxi;
				};
				date.setmonth( findmax( this._get( inst, ( dateformat.match( /mm/ ) ?
					"monthnames" : "monthnamesshort" ) ) ) );
				date.setdate( findmax( this._get( inst, ( dateformat.match( /dd/ ) ?
					"daynames" : "daynamesshort" ) ) ) + 20 - date.getday() );
			}
			inst.input.attr( "size", this._formatdate( inst, date ).length );
		}
	},

	/* attach an inline date picker to a div. */
	_inlinedatepicker: function( target, inst ) {
		var divspan = $( target );
		if ( divspan.hasclass( this.markerclassname ) ) {
			return;
		}
		divspan.addclass( this.markerclassname ).append( inst.dpdiv );
		$.data( target, "datepicker", inst );
		this._setdate( inst, this._getdefaultdate( inst ), true );
		this._updatedatepicker( inst );
		this._updatealternate( inst );

		//if disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if ( inst.settings.disabled ) {
			this._disabledatepicker( target );
		}

		// set display:block in place of inst.dpdiv.show() which won't work on disconnected elements
		// https://bugs.jqueryui.com/ticket/7552 - a datepicker created on a detached div has zero height
		inst.dpdiv.css( "display", "block" );
	},

	/* pop-up the date picker in a "dialog" box.
	 * @param  input element - ignored
	 * @param  date	string or date - the initial date to display
	 * @param  onselect  function - the function to call when a date is selected
	 * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	 * @param  pos int[2] - coordinates for the dialog's position within the screen or
	 *					event - with x/y coordinates or
	 *					leave empty for default (screen centre)
	 * @return the manager object
	 */
	_dialogdatepicker: function( input, date, onselect, settings, pos ) {
		var id, browserwidth, browserheight, scrollx, scrolly,
			inst = this._dialoginst; // internal instance

		if ( !inst ) {
			this.uuid += 1;
			id = "dp" + this.uuid;
			this._dialoginput = $( "<input type='text' id='" + id +
				"' style='position: absolute; top: -100px; width: 0px;'/>" );
			this._dialoginput.on( "keydown", this._dokeydown );
			$( "body" ).append( this._dialoginput );
			inst = this._dialoginst = this._newinst( this._dialoginput, false );
			inst.settings = {};
			$.data( this._dialoginput[ 0 ], "datepicker", inst );
		}
		datepicker_extendremove( inst.settings, settings || {} );
		date = ( date && date.constructor === date ? this._formatdate( inst, date ) : date );
		this._dialoginput.val( date );

		this._pos = ( pos ? ( pos.length ? pos : [ pos.pagex, pos.pagey ] ) : null );
		if ( !this._pos ) {
			browserwidth = document.documentelement.clientwidth;
			browserheight = document.documentelement.clientheight;
			scrollx = document.documentelement.scrollleft || document.body.scrollleft;
			scrolly = document.documentelement.scrolltop || document.body.scrolltop;
			this._pos = // should use actual width/height below
				[ ( browserwidth / 2 ) - 100 + scrollx, ( browserheight / 2 ) - 150 + scrolly ];
		}

		// move input on screen for focus, but hidden behind dialog
		this._dialoginput.css( "left", ( this._pos[ 0 ] + 20 ) + "px" ).css( "top", this._pos[ 1 ] + "px" );
		inst.settings.onselect = onselect;
		this._indialog = true;
		this.dpdiv.addclass( this._dialogclass );
		this._showdatepicker( this._dialoginput[ 0 ] );
		if ( $.blockui ) {
			$.blockui( this.dpdiv );
		}
		$.data( this._dialoginput[ 0 ], "datepicker", inst );
		return this;
	},

	/* detach a datepicker from its control.
	 * @param  target	element - the target input field or division or span
	 */
	_destroydatepicker: function( target ) {
		var nodename,
			$target = $( target ),
			inst = $.data( target, "datepicker" );

		if ( !$target.hasclass( this.markerclassname ) ) {
			return;
		}

		nodename = target.nodename.tolowercase();
		$.removedata( target, "datepicker" );
		if ( nodename === "input" ) {
			inst.append.remove();
			inst.trigger.remove();
			$target.removeclass( this.markerclassname ).
				off( "focus", this._showdatepicker ).
				off( "keydown", this._dokeydown ).
				off( "keypress", this._dokeypress ).
				off( "keyup", this._dokeyup );
		} else if ( nodename === "div" || nodename === "span" ) {
			$target.removeclass( this.markerclassname ).empty();
		}

		if ( datepicker_instactive === inst ) {
			datepicker_instactive = null;
			this._curinst = null;
		}
	},

	/* enable the date picker to a jquery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_enabledatepicker: function( target ) {
		var nodename, inline,
			$target = $( target ),
			inst = $.data( target, "datepicker" );

		if ( !$target.hasclass( this.markerclassname ) ) {
			return;
		}

		nodename = target.nodename.tolowercase();
		if ( nodename === "input" ) {
			target.disabled = false;
			inst.trigger.filter( "button" ).
				each( function() {
					this.disabled = false;
				} ).end().
				filter( "img" ).css( { opacity: "1.0", cursor: "" } );
		} else if ( nodename === "div" || nodename === "span" ) {
			inline = $target.children( "." + this._inlineclass );
			inline.children().removeclass( "ui-state-disabled" );
			inline.find( "select.ui-datepicker-month, select.ui-datepicker-year" ).
				prop( "disabled", false );
		}
		this._disabledinputs = $.map( this._disabledinputs,

			// delete entry
			function( value ) {
				return ( value === target ? null : value );
			} );
	},

	/* disable the date picker to a jquery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_disabledatepicker: function( target ) {
		var nodename, inline,
			$target = $( target ),
			inst = $.data( target, "datepicker" );

		if ( !$target.hasclass( this.markerclassname ) ) {
			return;
		}

		nodename = target.nodename.tolowercase();
		if ( nodename === "input" ) {
			target.disabled = true;
			inst.trigger.filter( "button" ).
				each( function() {
					this.disabled = true;
				} ).end().
				filter( "img" ).css( { opacity: "0.5", cursor: "default" } );
		} else if ( nodename === "div" || nodename === "span" ) {
			inline = $target.children( "." + this._inlineclass );
			inline.children().addclass( "ui-state-disabled" );
			inline.find( "select.ui-datepicker-month, select.ui-datepicker-year" ).
				prop( "disabled", true );
		}
		this._disabledinputs = $.map( this._disabledinputs,

			// delete entry
			function( value ) {
				return ( value === target ? null : value );
			} );
		this._disabledinputs[ this._disabledinputs.length ] = target;
	},

	/* is the first field in a jquery collection disabled as a datepicker?
	 * @param  target	element - the target input field or division or span
	 * @return boolean - true if disabled, false if enabled
	 */
	_isdisableddatepicker: function( target ) {
		if ( !target ) {
			return false;
		}
		for ( var i = 0; i < this._disabledinputs.length; i++ ) {
			if ( this._disabledinputs[ i ] === target ) {
				return true;
			}
		}
		return false;
	},

	/* retrieve the instance data for the target control.
	 * @param  target  element - the target input field or division or span
	 * @return  object - the associated instance data
	 * @throws  error if a jquery problem getting data
	 */
	_getinst: function( target ) {
		try {
			return $.data( target, "datepicker" );
		} catch ( err ) {
			throw "missing instance data for this datepicker";
		}
	},

	/* update or retrieve the settings for a date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 * @param  name	object - the new settings to update or
	 *				string - the name of the setting to change or retrieve,
	 *				when retrieving also "all" for all instance settings or
	 *				"defaults" for all global defaults
	 * @param  value   any - the new value for the setting
	 *				(omit if above is an object or to retrieve a value)
	 */
	_optiondatepicker: function( target, name, value ) {
		var settings, date, mindate, maxdate,
			inst = this._getinst( target );

		if ( arguments.length === 2 && typeof name === "string" ) {
			return ( name === "defaults" ? $.extend( {}, $.datepicker._defaults ) :
				( inst ? ( name === "all" ? $.extend( {}, inst.settings ) :
				this._get( inst, name ) ) : null ) );
		}

		settings = name || {};
		if ( typeof name === "string" ) {
			settings = {};
			settings[ name ] = value;
		}

		if ( inst ) {
			if ( this._curinst === inst ) {
				this._hidedatepicker();
			}

			date = this._getdatedatepicker( target, true );
			mindate = this._getminmaxdate( inst, "min" );
			maxdate = this._getminmaxdate( inst, "max" );
			datepicker_extendremove( inst.settings, settings );

			// reformat the old mindate/maxdate values if dateformat changes and a new mindate/maxdate isn't provided
			if ( mindate !== null && settings.dateformat !== undefined && settings.mindate === undefined ) {
				inst.settings.mindate = this._formatdate( inst, mindate );
			}
			if ( maxdate !== null && settings.dateformat !== undefined && settings.maxdate === undefined ) {
				inst.settings.maxdate = this._formatdate( inst, maxdate );
			}
			if ( "disabled" in settings ) {
				if ( settings.disabled ) {
					this._disabledatepicker( target );
				} else {
					this._enabledatepicker( target );
				}
			}
			this._attachments( $( target ), inst );
			this._autosize( inst );
			this._setdate( inst, date );
			this._updatealternate( inst );
			this._updatedatepicker( inst );
		}
	},

	// change method deprecated
	_changedatepicker: function( target, name, value ) {
		this._optiondatepicker( target, name, value );
	},

	/* redraw the date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 */
	_refreshdatepicker: function( target ) {
		var inst = this._getinst( target );
		if ( inst ) {
			this._updatedatepicker( inst );
		}
	},

	/* set the dates for a jquery selection.
	 * @param  target element - the target input field or division or span
	 * @param  date	date - the new date
	 */
	_setdatedatepicker: function( target, date ) {
		var inst = this._getinst( target );
		if ( inst ) {
			this._setdate( inst, date );
			this._updatedatepicker( inst );
			this._updatealternate( inst );
		}
	},

	/* get the date(s) for the first entry in a jquery selection.
	 * @param  target element - the target input field or division or span
	 * @param  nodefault boolean - true if no default date is to be used
	 * @return date - the current date
	 */
	_getdatedatepicker: function( target, nodefault ) {
		var inst = this._getinst( target );
		if ( inst && !inst.inline ) {
			this._setdatefromfield( inst, nodefault );
		}
		return ( inst ? this._getdate( inst ) : null );
	},

	/* handle keystrokes. */
	_dokeydown: function( event ) {
		var onselect, datestr, sel,
			inst = $.datepicker._getinst( event.target ),
			handled = true,
			isrtl = inst.dpdiv.is( ".ui-datepicker-rtl" );

		inst._keyevent = true;
		if ( $.datepicker._datepickershowing ) {
			switch ( event.keycode ) {
				case 9: $.datepicker._hidedatepicker();
						handled = false;
						break; // hide on tab out
				case 13: sel = $( "td." + $.datepicker._dayoverclass + ":not(." +
									$.datepicker._currentclass + ")", inst.dpdiv );
						if ( sel[ 0 ] ) {
							$.datepicker._selectday( event.target, inst.selectedmonth, inst.selectedyear, sel[ 0 ] );
						}

						onselect = $.datepicker._get( inst, "onselect" );
						if ( onselect ) {
							datestr = $.datepicker._formatdate( inst );

							// trigger custom callback
							onselect.apply( ( inst.input ? inst.input[ 0 ] : null ), [ datestr, inst ] );
						} else {
							$.datepicker._hidedatepicker();
						}

						return false; // don't submit the form
				case 27: $.datepicker._hidedatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustdate( event.target, ( event.ctrlkey ?
							-$.datepicker._get( inst, "stepbigmonths" ) :
							-$.datepicker._get( inst, "stepmonths" ) ), "m" );
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustdate( event.target, ( event.ctrlkey ?
							+$.datepicker._get( inst, "stepbigmonths" ) :
							+$.datepicker._get( inst, "stepmonths" ) ), "m" );
						break; // next month/year on page down/+ ctrl
				case 35: if ( event.ctrlkey || event.metakey ) {
							$.datepicker._cleardate( event.target );
						}
						handled = event.ctrlkey || event.metakey;
						break; // clear on ctrl or command +end
				case 36: if ( event.ctrlkey || event.metakey ) {
							$.datepicker._gototoday( event.target );
						}
						handled = event.ctrlkey || event.metakey;
						break; // current on ctrl or command +home
				case 37: if ( event.ctrlkey || event.metakey ) {
							$.datepicker._adjustdate( event.target, ( isrtl ? +1 : -1 ), "d" );
						}
						handled = event.ctrlkey || event.metakey;

						// -1 day on ctrl or command +left
						if ( event.originalevent.altkey ) {
							$.datepicker._adjustdate( event.target, ( event.ctrlkey ?
								-$.datepicker._get( inst, "stepbigmonths" ) :
								-$.datepicker._get( inst, "stepmonths" ) ), "m" );
						}

						// next month/year on alt +left on mac
						break;
				case 38: if ( event.ctrlkey || event.metakey ) {
							$.datepicker._adjustdate( event.target, -7, "d" );
						}
						handled = event.ctrlkey || event.metakey;
						break; // -1 week on ctrl or command +up
				case 39: if ( event.ctrlkey || event.metakey ) {
							$.datepicker._adjustdate( event.target, ( isrtl ? -1 : +1 ), "d" );
						}
						handled = event.ctrlkey || event.metakey;

						// +1 day on ctrl or command +right
						if ( event.originalevent.altkey ) {
							$.datepicker._adjustdate( event.target, ( event.ctrlkey ?
								+$.datepicker._get( inst, "stepbigmonths" ) :
								+$.datepicker._get( inst, "stepmonths" ) ), "m" );
						}

						// next month/year on alt +right
						break;
				case 40: if ( event.ctrlkey || event.metakey ) {
							$.datepicker._adjustdate( event.target, +7, "d" );
						}
						handled = event.ctrlkey || event.metakey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		} else if ( event.keycode === 36 && event.ctrlkey ) { // display the date picker on ctrl+home
			$.datepicker._showdatepicker( this );
		} else {
			handled = false;
		}

		if ( handled ) {
			event.preventdefault();
			event.stoppropagation();
		}
	},

	/* filter entered characters - based on date format. */
	_dokeypress: function( event ) {
		var chars, chr,
			inst = $.datepicker._getinst( event.target );

		if ( $.datepicker._get( inst, "constraininput" ) ) {
			chars = $.datepicker._possiblechars( $.datepicker._get( inst, "dateformat" ) );
			chr = string.fromcharcode( event.charcode == null ? event.keycode : event.charcode );
			return event.ctrlkey || event.metakey || ( chr < " " || !chars || chars.indexof( chr ) > -1 );
		}
	},

	/* synchronise manual entry and field/alternate field. */
	_dokeyup: function( event ) {
		var date,
			inst = $.datepicker._getinst( event.target );

		if ( inst.input.val() !== inst.lastval ) {
			try {
				date = $.datepicker.parsedate( $.datepicker._get( inst, "dateformat" ),
					( inst.input ? inst.input.val() : null ),
					$.datepicker._getformatconfig( inst ) );

				if ( date ) { // only if valid
					$.datepicker._setdatefromfield( inst );
					$.datepicker._updatealternate( inst );
					$.datepicker._updatedatepicker( inst );
				}
			} catch ( err ) {
			}
		}
		return true;
	},

	/* pop-up the date picker for a given input field.
	 * if false returned from beforeshow event handler do not show.
	 * @param  input  element - the input field attached to the date picker or
	 *					event - if triggered by focus
	 */
	_showdatepicker: function( input ) {
		input = input.target || input;
		if ( input.nodename.tolowercase() !== "input" ) { // find from button/image trigger
			input = $( "input", input.parentnode )[ 0 ];
		}

		if ( $.datepicker._isdisableddatepicker( input ) || $.datepicker._lastinput === input ) { // already here
			return;
		}

		var inst, beforeshow, beforeshowsettings, isfixed,
			offset, showanim, duration;

		inst = $.datepicker._getinst( input );
		if ( $.datepicker._curinst && $.datepicker._curinst !== inst ) {
			$.datepicker._curinst.dpdiv.stop( true, true );
			if ( inst && $.datepicker._datepickershowing ) {
				$.datepicker._hidedatepicker( $.datepicker._curinst.input[ 0 ] );
			}
		}

		beforeshow = $.datepicker._get( inst, "beforeshow" );
		beforeshowsettings = beforeshow ? beforeshow.apply( input, [ input, inst ] ) : {};
		if ( beforeshowsettings === false ) {
			return;
		}
		datepicker_extendremove( inst.settings, beforeshowsettings );

		inst.lastval = null;
		$.datepicker._lastinput = input;
		$.datepicker._setdatefromfield( inst );

		if ( $.datepicker._indialog ) { // hide cursor
			input.value = "";
		}
		if ( !$.datepicker._pos ) { // position below input
			$.datepicker._pos = $.datepicker._findpos( input );
			$.datepicker._pos[ 1 ] += input.offsetheight; // add the height
		}

		isfixed = false;
		$( input ).parents().each( function() {
			isfixed |= $( this ).css( "position" ) === "fixed";
			return !isfixed;
		} );

		offset = { left: $.datepicker._pos[ 0 ], top: $.datepicker._pos[ 1 ] };
		$.datepicker._pos = null;

		//to avoid flashes on firefox
		inst.dpdiv.empty();

		// determine sizing offscreen
		inst.dpdiv.css( { position: "absolute", display: "block", top: "-1000px" } );
		$.datepicker._updatedatepicker( inst );

		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkoffset( inst, offset, isfixed );
		inst.dpdiv.css( { position: ( $.datepicker._indialog && $.blockui ?
			"static" : ( isfixed ? "fixed" : "absolute" ) ), display: "none",
			left: offset.left + "px", top: offset.top + "px" } );

		if ( !inst.inline ) {
			showanim = $.datepicker._get( inst, "showanim" );
			duration = $.datepicker._get( inst, "duration" );
			inst.dpdiv.css( "z-index", datepicker_getzindex( $( input ) ) + 1 );
			$.datepicker._datepickershowing = true;

			if ( $.effects && $.effects.effect[ showanim ] ) {
				inst.dpdiv.show( showanim, $.datepicker._get( inst, "showoptions" ), duration );
			} else {
				inst.dpdiv[ showanim || "show" ]( showanim ? duration : null );
			}

			if ( $.datepicker._shouldfocusinput( inst ) ) {
				inst.input.trigger( "focus" );
			}

			$.datepicker._curinst = inst;
		}
	},

	/* generate the date picker content. */
	_updatedatepicker: function( inst ) {
		this.maxrows = 4; //reset the max number of rows being displayed (see #7043)
		datepicker_instactive = inst; // for delegate hover events
		inst.dpdiv.empty().append( this._generatehtml( inst ) );
		this._attachhandlers( inst );

		var origyearshtml,
			nummonths = this._getnumberofmonths( inst ),
			cols = nummonths[ 1 ],
			width = 17,
			activecell = inst.dpdiv.find( "." + this._dayoverclass + " a" ),
			onupdatedatepicker = $.datepicker._get( inst, "onupdatedatepicker" );

		if ( activecell.length > 0 ) {
			datepicker_handlemouseover.apply( activecell.get( 0 ) );
		}

		inst.dpdiv.removeclass( "ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4" ).width( "" );
		if ( cols > 1 ) {
			inst.dpdiv.addclass( "ui-datepicker-multi-" + cols ).css( "width", ( width * cols ) + "em" );
		}
		inst.dpdiv[ ( nummonths[ 0 ] !== 1 || nummonths[ 1 ] !== 1 ? "add" : "remove" ) +
			"class" ]( "ui-datepicker-multi" );
		inst.dpdiv[ ( this._get( inst, "isrtl" ) ? "add" : "remove" ) +
			"class" ]( "ui-datepicker-rtl" );

		if ( inst === $.datepicker._curinst && $.datepicker._datepickershowing && $.datepicker._shouldfocusinput( inst ) ) {
			inst.input.trigger( "focus" );
		}

		// deffered render of the years select (to avoid flashes on firefox)
		if ( inst.yearshtml ) {
			origyearshtml = inst.yearshtml;
			settimeout( function() {

				//assure that inst.yearshtml didn't change.
				if ( origyearshtml === inst.yearshtml && inst.yearshtml ) {
					inst.dpdiv.find( "select.ui-datepicker-year" ).first().replacewith( inst.yearshtml );
				}
				origyearshtml = inst.yearshtml = null;
			}, 0 );
		}

		if ( onupdatedatepicker ) {
			onupdatedatepicker.apply( ( inst.input ? inst.input[ 0 ] : null ), [ inst ] );
		}
	},

	// #6694 - don't focus the input if it's already focused
	// this breaks the change event in ie
	// support: ie and jquery <1.9
	_shouldfocusinput: function( inst ) {
		return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
	},

	/* check positioning to remain on screen. */
	_checkoffset: function( inst, offset, isfixed ) {
		var dpwidth = inst.dpdiv.outerwidth(),
			dpheight = inst.dpdiv.outerheight(),
			inputwidth = inst.input ? inst.input.outerwidth() : 0,
			inputheight = inst.input ? inst.input.outerheight() : 0,
			viewwidth = document.documentelement.clientwidth + ( isfixed ? 0 : $( document ).scrollleft() ),
			viewheight = document.documentelement.clientheight + ( isfixed ? 0 : $( document ).scrolltop() );

		offset.left -= ( this._get( inst, "isrtl" ) ? ( dpwidth - inputwidth ) : 0 );
		offset.left -= ( isfixed && offset.left === inst.input.offset().left ) ? $( document ).scrollleft() : 0;
		offset.top -= ( isfixed && offset.top === ( inst.input.offset().top + inputheight ) ) ? $( document ).scrolltop() : 0;

		// now check if datepicker is showing outside window viewport - move to a better place if so.
		offset.left -= math.min( offset.left, ( offset.left + dpwidth > viewwidth && viewwidth > dpwidth ) ?
			math.abs( offset.left + dpwidth - viewwidth ) : 0 );
		offset.top -= math.min( offset.top, ( offset.top + dpheight > viewheight && viewheight > dpheight ) ?
			math.abs( dpheight + inputheight ) : 0 );

		return offset;
	},

	/* find an object's position on the screen. */
	_findpos: function( obj ) {
		var position,
			inst = this._getinst( obj ),
			isrtl = this._get( inst, "isrtl" );

		while ( obj && ( obj.type === "hidden" || obj.nodetype !== 1 || $.expr.pseudos.hidden( obj ) ) ) {
			obj = obj[ isrtl ? "previoussibling" : "nextsibling" ];
		}

		position = $( obj ).offset();
		return [ position.left, position.top ];
	},

	/* hide the date picker from view.
	 * @param  input  element - the input field attached to the date picker
	 */
	_hidedatepicker: function( input ) {
		var showanim, duration, postprocess, onclose,
			inst = this._curinst;

		if ( !inst || ( input && inst !== $.data( input, "datepicker" ) ) ) {
			return;
		}

		if ( this._datepickershowing ) {
			showanim = this._get( inst, "showanim" );
			duration = this._get( inst, "duration" );
			postprocess = function() {
				$.datepicker._tidydialog( inst );
			};

			// deprecated: after bc for 1.8.x $.effects[ showanim ] is not needed
			if ( $.effects && ( $.effects.effect[ showanim ] || $.effects[ showanim ] ) ) {
				inst.dpdiv.hide( showanim, $.datepicker._get( inst, "showoptions" ), duration, postprocess );
			} else {
				inst.dpdiv[ ( showanim === "slidedown" ? "slideup" :
					( showanim === "fadein" ? "fadeout" : "hide" ) ) ]( ( showanim ? duration : null ), postprocess );
			}

			if ( !showanim ) {
				postprocess();
			}
			this._datepickershowing = false;

			onclose = this._get( inst, "onclose" );
			if ( onclose ) {
				onclose.apply( ( inst.input ? inst.input[ 0 ] : null ), [ ( inst.input ? inst.input.val() : "" ), inst ] );
			}

			this._lastinput = null;
			if ( this._indialog ) {
				this._dialoginput.css( { position: "absolute", left: "0", top: "-100px" } );
				if ( $.blockui ) {
					$.unblockui();
					$( "body" ).append( this.dpdiv );
				}
			}
			this._indialog = false;
		}
	},

	/* tidy up after a dialog display. */
	_tidydialog: function( inst ) {
		inst.dpdiv.removeclass( this._dialogclass ).off( ".ui-datepicker-calendar" );
	},

	/* close date picker if clicked elsewhere. */
	_checkexternalclick: function( event ) {
		if ( !$.datepicker._curinst ) {
			return;
		}

		var $target = $( event.target ),
			inst = $.datepicker._getinst( $target[ 0 ] );

		if ( ( ( $target[ 0 ].id !== $.datepicker._maindivid &&
				$target.parents( "#" + $.datepicker._maindivid ).length === 0 &&
				!$target.hasclass( $.datepicker.markerclassname ) &&
				!$target.closest( "." + $.datepicker._triggerclass ).length &&
				$.datepicker._datepickershowing && !( $.datepicker._indialog && $.blockui ) ) ) ||
			( $target.hasclass( $.datepicker.markerclassname ) && $.datepicker._curinst !== inst ) ) {
				$.datepicker._hidedatepicker();
		}
	},

	/* adjust one of the date sub-fields. */
	_adjustdate: function( id, offset, period ) {
		var target = $( id ),
			inst = this._getinst( target[ 0 ] );

		if ( this._isdisableddatepicker( target[ 0 ] ) ) {
			return;
		}
		this._adjustinstdate( inst, offset, period );
		this._updatedatepicker( inst );
	},

	/* action for current link. */
	_gototoday: function( id ) {
		var date,
			target = $( id ),
			inst = this._getinst( target[ 0 ] );

		if ( this._get( inst, "gotocurrent" ) && inst.currentday ) {
			inst.selectedday = inst.currentday;
			inst.drawmonth = inst.selectedmonth = inst.currentmonth;
			inst.drawyear = inst.selectedyear = inst.currentyear;
		} else {
			date = new date();
			inst.selectedday = date.getdate();
			inst.drawmonth = inst.selectedmonth = date.getmonth();
			inst.drawyear = inst.selectedyear = date.getfullyear();
		}
		this._notifychange( inst );
		this._adjustdate( target );
	},

	/* action for selecting a new month/year. */
	_selectmonthyear: function( id, select, period ) {
		var target = $( id ),
			inst = this._getinst( target[ 0 ] );

		inst[ "selected" + ( period === "m" ? "month" : "year" ) ] =
		inst[ "draw" + ( period === "m" ? "month" : "year" ) ] =
			parseint( select.options[ select.selectedindex ].value, 10 );

		this._notifychange( inst );
		this._adjustdate( target );
	},

	/* action for selecting a day. */
	_selectday: function( id, month, year, td ) {
		var inst,
			target = $( id );

		if ( $( td ).hasclass( this._unselectableclass ) || this._isdisableddatepicker( target[ 0 ] ) ) {
			return;
		}

		inst = this._getinst( target[ 0 ] );
		inst.selectedday = inst.currentday = parseint( $( "a", td ).attr( "data-date" ) );
		inst.selectedmonth = inst.currentmonth = month;
		inst.selectedyear = inst.currentyear = year;
		this._selectdate( id, this._formatdate( inst,
			inst.currentday, inst.currentmonth, inst.currentyear ) );
	},

	/* erase the input field and hide the date picker. */
	_cleardate: function( id ) {
		var target = $( id );
		this._selectdate( target, "" );
	},

	/* update the input field with the selected date. */
	_selectdate: function( id, datestr ) {
		var onselect,
			target = $( id ),
			inst = this._getinst( target[ 0 ] );

		datestr = ( datestr != null ? datestr : this._formatdate( inst ) );
		if ( inst.input ) {
			inst.input.val( datestr );
		}
		this._updatealternate( inst );

		onselect = this._get( inst, "onselect" );
		if ( onselect ) {
			onselect.apply( ( inst.input ? inst.input[ 0 ] : null ), [ datestr, inst ] );  // trigger custom callback
		} else if ( inst.input ) {
			inst.input.trigger( "change" ); // fire the change event
		}

		if ( inst.inline ) {
			this._updatedatepicker( inst );
		} else {
			this._hidedatepicker();
			this._lastinput = inst.input[ 0 ];
			if ( typeof( inst.input[ 0 ] ) !== "object" ) {
				inst.input.trigger( "focus" ); // restore focus
			}
			this._lastinput = null;
		}
	},

	/* update any alternate field to synchronise with the main field. */
	_updatealternate: function( inst ) {
		var altformat, date, datestr,
			altfield = this._get( inst, "altfield" );

		if ( altfield ) { // update alternate field too
			altformat = this._get( inst, "altformat" ) || this._get( inst, "dateformat" );
			date = this._getdate( inst );
			datestr = this.formatdate( altformat, date, this._getformatconfig( inst ) );
			$( document ).find( altfield ).val( datestr );
		}
	},

	/* set as beforeshowday function to prevent selection of weekends.
	 * @param  date  date - the date to customise
	 * @return [boolean, string] - is this date selectable?, what is its css class?
	 */
	noweekends: function( date ) {
		var day = date.getday();
		return [ ( day > 0 && day < 6 ), "" ];
	},

	/* set as calculateweek to determine the week of the year based on the iso 8601 definition.
	 * @param  date  date - the date to get the week for
	 * @return  number - the number of the week within the year that contains this date
	 */
	iso8601week: function( date ) {
		var time,
			checkdate = new date( date.gettime() );

		// find thursday of this week starting on monday
		checkdate.setdate( checkdate.getdate() + 4 - ( checkdate.getday() || 7 ) );

		time = checkdate.gettime();
		checkdate.setmonth( 0 ); // compare with jan 1
		checkdate.setdate( 1 );
		return math.floor( math.round( ( time - checkdate ) / 86400000 ) / 7 ) + 1;
	},

	/* parse a string value into a date object.
	 * see formatdate below for the possible formats.
	 *
	 * @param  format string - the expected format of the date
	 * @param  value string - the date in the above format
	 * @param  settings object - attributes include:
	 *					shortyearcutoff  number - the cutoff year for determining the century (optional)
	 *					daynamesshort	string[7] - abbreviated names of the days from sunday (optional)
	 *					daynames		string[7] - names of the days from sunday (optional)
	 *					monthnamesshort string[12] - abbreviated names of the months (optional)
	 *					monthnames		string[12] - names of the months (optional)
	 * @return  date - the extracted date value or null if value is blank
	 */
	parsedate: function( format, value, settings ) {
		if ( format == null || value == null ) {
			throw "invalid arguments";
		}

		value = ( typeof value === "object" ? value.tostring() : value + "" );
		if ( value === "" ) {
			return null;
		}

		var iformat, dim, extra,
			ivalue = 0,
			shortyearcutofftemp = ( settings ? settings.shortyearcutoff : null ) || this._defaults.shortyearcutoff,
			shortyearcutoff = ( typeof shortyearcutofftemp !== "string" ? shortyearcutofftemp :
				new date().getfullyear() % 100 + parseint( shortyearcutofftemp, 10 ) ),
			daynamesshort = ( settings ? settings.daynamesshort : null ) || this._defaults.daynamesshort,
			daynames = ( settings ? settings.daynames : null ) || this._defaults.daynames,
			monthnamesshort = ( settings ? settings.monthnamesshort : null ) || this._defaults.monthnamesshort,
			monthnames = ( settings ? settings.monthnames : null ) || this._defaults.monthnames,
			year = -1,
			month = -1,
			day = -1,
			doy = -1,
			literal = false,
			date,

			// check whether a format character is doubled
			lookahead = function( match ) {
				var matches = ( iformat + 1 < format.length && format.charat( iformat + 1 ) === match );
				if ( matches ) {
					iformat++;
				}
				return matches;
			},

			// extract a number from the string value
			getnumber = function( match ) {
				var isdoubled = lookahead( match ),
					size = ( match === "@" ? 14 : ( match === "!" ? 20 :
					( match === "y" && isdoubled ? 4 : ( match === "o" ? 3 : 2 ) ) ) ),
					minsize = ( match === "y" ? size : 1 ),
					digits = new regexp( "^\\d{" + minsize + "," + size + "}" ),
					num = value.substring( ivalue ).match( digits );
				if ( !num ) {
					throw "missing number at position " + ivalue;
				}
				ivalue += num[ 0 ].length;
				return parseint( num[ 0 ], 10 );
			},

			// extract a name from the string value and convert to an index
			getname = function( match, shortnames, longnames ) {
				var index = -1,
					names = $.map( lookahead( match ) ? longnames : shortnames, function( v, k ) {
						return [ [ k, v ] ];
					} ).sort( function( a, b ) {
						return -( a[ 1 ].length - b[ 1 ].length );
					} );

				$.each( names, function( i, pair ) {
					var name = pair[ 1 ];
					if ( value.substr( ivalue, name.length ).tolowercase() === name.tolowercase() ) {
						index = pair[ 0 ];
						ivalue += name.length;
						return false;
					}
				} );
				if ( index !== -1 ) {
					return index + 1;
				} else {
					throw "unknown name at position " + ivalue;
				}
			},

			// confirm that a literal character matches the string value
			checkliteral = function() {
				if ( value.charat( ivalue ) !== format.charat( iformat ) ) {
					throw "unexpected literal at position " + ivalue;
				}
				ivalue++;
			};

		for ( iformat = 0; iformat < format.length; iformat++ ) {
			if ( literal ) {
				if ( format.charat( iformat ) === "'" && !lookahead( "'" ) ) {
					literal = false;
				} else {
					checkliteral();
				}
			} else {
				switch ( format.charat( iformat ) ) {
					case "d":
						day = getnumber( "d" );
						break;
					case "d":
						getname( "d", daynamesshort, daynames );
						break;
					case "o":
						doy = getnumber( "o" );
						break;
					case "m":
						month = getnumber( "m" );
						break;
					case "m":
						month = getname( "m", monthnamesshort, monthnames );
						break;
					case "y":
						year = getnumber( "y" );
						break;
					case "@":
						date = new date( getnumber( "@" ) );
						year = date.getfullyear();
						month = date.getmonth() + 1;
						day = date.getdate();
						break;
					case "!":
						date = new date( ( getnumber( "!" ) - this._ticksto1970 ) / 10000 );
						year = date.getfullyear();
						month = date.getmonth() + 1;
						day = date.getdate();
						break;
					case "'":
						if ( lookahead( "'" ) ) {
							checkliteral();
						} else {
							literal = true;
						}
						break;
					default:
						checkliteral();
				}
			}
		}

		if ( ivalue < value.length ) {
			extra = value.substr( ivalue );
			if ( !/^\s+/.test( extra ) ) {
				throw "extra/unparsed characters found in date: " + extra;
			}
		}

		if ( year === -1 ) {
			year = new date().getfullyear();
		} else if ( year < 100 ) {
			year += new date().getfullyear() - new date().getfullyear() % 100 +
				( year <= shortyearcutoff ? 0 : -100 );
		}

		if ( doy > -1 ) {
			month = 1;
			day = doy;
			do {
				dim = this._getdaysinmonth( year, month - 1 );
				if ( day <= dim ) {
					break;
				}
				month++;
				day -= dim;
			} while ( true );
		}

		date = this._daylightsavingadjust( new date( year, month - 1, day ) );
		if ( date.getfullyear() !== year || date.getmonth() + 1 !== month || date.getdate() !== day ) {
			throw "invalid date"; // e.g. 31/02/00
		}
		return date;
	},

	/* standard date formats. */
	atom: "yy-mm-dd", // rfc 3339 (iso 8601)
	cookie: "d, dd m yy",
	iso_8601: "yy-mm-dd",
	rfc_822: "d, d m y",
	rfc_850: "dd, dd-m-y",
	rfc_1036: "d, d m y",
	rfc_1123: "d, d m yy",
	rfc_2822: "d, d m yy",
	rss: "d, d m y", // rfc 822
	ticks: "!",
	timestamp: "@",
	w3c: "yy-mm-dd", // iso 8601

	_ticksto1970: ( ( ( 1970 - 1 ) * 365 + math.floor( 1970 / 4 ) - math.floor( 1970 / 100 ) +
		math.floor( 1970 / 400 ) ) * 24 * 60 * 60 * 10000000 ),

	/* format a date object into a string value.
	 * the format can be combinations of the following:
	 * d  - day of month (no leading zero)
	 * dd - day of month (two digit)
	 * o  - day of year (no leading zeros)
	 * oo - day of year (three digit)
	 * d  - day name short
	 * dd - day name long
	 * m  - month of year (no leading zero)
	 * mm - month of year (two digit)
	 * m  - month name short
	 * mm - month name long
	 * y  - year (two digit)
	 * yy - year (four digit)
	 * @ - unix timestamp (ms since 01/01/1970)
	 * ! - windows ticks (100ns since 01/01/0001)
	 * "..." - literal text
	 * '' - single quote
	 *
	 * @param  format string - the desired format of the date
	 * @param  date date - the date value to format
	 * @param  settings object - attributes include:
	 *					daynamesshort	string[7] - abbreviated names of the days from sunday (optional)
	 *					daynames		string[7] - names of the days from sunday (optional)
	 *					monthnamesshort string[12] - abbreviated names of the months (optional)
	 *					monthnames		string[12] - names of the months (optional)
	 * @return  string - the date in the above format
	 */
	formatdate: function( format, date, settings ) {
		if ( !date ) {
			return "";
		}

		var iformat,
			daynamesshort = ( settings ? settings.daynamesshort : null ) || this._defaults.daynamesshort,
			daynames = ( settings ? settings.daynames : null ) || this._defaults.daynames,
			monthnamesshort = ( settings ? settings.monthnamesshort : null ) || this._defaults.monthnamesshort,
			monthnames = ( settings ? settings.monthnames : null ) || this._defaults.monthnames,

			// check whether a format character is doubled
			lookahead = function( match ) {
				var matches = ( iformat + 1 < format.length && format.charat( iformat + 1 ) === match );
				if ( matches ) {
					iformat++;
				}
				return matches;
			},

			// format a number, with leading zero if necessary
			formatnumber = function( match, value, len ) {
				var num = "" + value;
				if ( lookahead( match ) ) {
					while ( num.length < len ) {
						num = "0" + num;
					}
				}
				return num;
			},

			// format a name, short or long as requested
			formatname = function( match, value, shortnames, longnames ) {
				return ( lookahead( match ) ? longnames[ value ] : shortnames[ value ] );
			},
			output = "",
			literal = false;

		if ( date ) {
			for ( iformat = 0; iformat < format.length; iformat++ ) {
				if ( literal ) {
					if ( format.charat( iformat ) === "'" && !lookahead( "'" ) ) {
						literal = false;
					} else {
						output += format.charat( iformat );
					}
				} else {
					switch ( format.charat( iformat ) ) {
						case "d":
							output += formatnumber( "d", date.getdate(), 2 );
							break;
						case "d":
							output += formatname( "d", date.getday(), daynamesshort, daynames );
							break;
						case "o":
							output += formatnumber( "o",
								math.round( ( new date( date.getfullyear(), date.getmonth(), date.getdate() ).gettime() - new date( date.getfullyear(), 0, 0 ).gettime() ) / 86400000 ), 3 );
							break;
						case "m":
							output += formatnumber( "m", date.getmonth() + 1, 2 );
							break;
						case "m":
							output += formatname( "m", date.getmonth(), monthnamesshort, monthnames );
							break;
						case "y":
							output += ( lookahead( "y" ) ? date.getfullyear() :
								( date.getfullyear() % 100 < 10 ? "0" : "" ) + date.getfullyear() % 100 );
							break;
						case "@":
							output += date.gettime();
							break;
						case "!":
							output += date.gettime() * 10000 + this._ticksto1970;
							break;
						case "'":
							if ( lookahead( "'" ) ) {
								output += "'";
							} else {
								literal = true;
							}
							break;
						default:
							output += format.charat( iformat );
					}
				}
			}
		}
		return output;
	},

	/* extract all possible characters from the date format. */
	_possiblechars: function( format ) {
		var iformat,
			chars = "",
			literal = false,

			// check whether a format character is doubled
			lookahead = function( match ) {
				var matches = ( iformat + 1 < format.length && format.charat( iformat + 1 ) === match );
				if ( matches ) {
					iformat++;
				}
				return matches;
			};

		for ( iformat = 0; iformat < format.length; iformat++ ) {
			if ( literal ) {
				if ( format.charat( iformat ) === "'" && !lookahead( "'" ) ) {
					literal = false;
				} else {
					chars += format.charat( iformat );
				}
			} else {
				switch ( format.charat( iformat ) ) {
					case "d": case "m": case "y": case "@":
						chars += "0123456789";
						break;
					case "d": case "m":
						return null; // accept anything
					case "'":
						if ( lookahead( "'" ) ) {
							chars += "'";
						} else {
							literal = true;
						}
						break;
					default:
						chars += format.charat( iformat );
				}
			}
		}
		return chars;
	},

	/* get a setting value, defaulting if necessary. */
	_get: function( inst, name ) {
		return inst.settings[ name ] !== undefined ?
			inst.settings[ name ] : this._defaults[ name ];
	},

	/* parse existing date and initialise date picker. */
	_setdatefromfield: function( inst, nodefault ) {
		if ( inst.input.val() === inst.lastval ) {
			return;
		}

		var dateformat = this._get( inst, "dateformat" ),
			dates = inst.lastval = inst.input ? inst.input.val() : null,
			defaultdate = this._getdefaultdate( inst ),
			date = defaultdate,
			settings = this._getformatconfig( inst );

		try {
			date = this.parsedate( dateformat, dates, settings ) || defaultdate;
		} catch ( event ) {
			dates = ( nodefault ? "" : dates );
		}
		inst.selectedday = date.getdate();
		inst.drawmonth = inst.selectedmonth = date.getmonth();
		inst.drawyear = inst.selectedyear = date.getfullyear();
		inst.currentday = ( dates ? date.getdate() : 0 );
		inst.currentmonth = ( dates ? date.getmonth() : 0 );
		inst.currentyear = ( dates ? date.getfullyear() : 0 );
		this._adjustinstdate( inst );
	},

	/* retrieve the default date shown on opening. */
	_getdefaultdate: function( inst ) {
		return this._restrictminmax( inst,
			this._determinedate( inst, this._get( inst, "defaultdate" ), new date() ) );
	},

	/* a date may be specified as an exact value or a relative one. */
	_determinedate: function( inst, date, defaultdate ) {
		var offsetnumeric = function( offset ) {
				var date = new date();
				date.setdate( date.getdate() + offset );
				return date;
			},
			offsetstring = function( offset ) {
				try {
					return $.datepicker.parsedate( $.datepicker._get( inst, "dateformat" ),
						offset, $.datepicker._getformatconfig( inst ) );
				} catch ( e ) {

					// ignore
				}

				var date = ( offset.tolowercase().match( /^c/ ) ?
					$.datepicker._getdate( inst ) : null ) || new date(),
					year = date.getfullyear(),
					month = date.getmonth(),
					day = date.getdate(),
					pattern = /([+\-]?[0-9]+)\s*(d|d|w|w|m|m|y|y)?/g,
					matches = pattern.exec( offset );

				while ( matches ) {
					switch ( matches[ 2 ] || "d" ) {
						case "d" : case "d" :
							day += parseint( matches[ 1 ], 10 ); break;
						case "w" : case "w" :
							day += parseint( matches[ 1 ], 10 ) * 7; break;
						case "m" : case "m" :
							month += parseint( matches[ 1 ], 10 );
							day = math.min( day, $.datepicker._getdaysinmonth( year, month ) );
							break;
						case "y": case "y" :
							year += parseint( matches[ 1 ], 10 );
							day = math.min( day, $.datepicker._getdaysinmonth( year, month ) );
							break;
					}
					matches = pattern.exec( offset );
				}
				return new date( year, month, day );
			},
			newdate = ( date == null || date === "" ? defaultdate : ( typeof date === "string" ? offsetstring( date ) :
				( typeof date === "number" ? ( isnan( date ) ? defaultdate : offsetnumeric( date ) ) : new date( date.gettime() ) ) ) );

		newdate = ( newdate && newdate.tostring() === "invalid date" ? defaultdate : newdate );
		if ( newdate ) {
			newdate.sethours( 0 );
			newdate.setminutes( 0 );
			newdate.setseconds( 0 );
			newdate.setmilliseconds( 0 );
		}
		return this._daylightsavingadjust( newdate );
	},

	/* handle switch to/from daylight saving.
	 * hours may be non-zero on daylight saving cut-over:
	 * > 12 when midnight changeover, but then cannot generate
	 * midnight datetime, so jump to 1am, otherwise reset.
	 * @param  date  (date) the date to check
	 * @return  (date) the corrected date
	 */
	_daylightsavingadjust: function( date ) {
		if ( !date ) {
			return null;
		}
		date.sethours( date.gethours() > 12 ? date.gethours() + 2 : 0 );
		return date;
	},

	/* set the date(s) directly. */
	_setdate: function( inst, date, nochange ) {
		var clear = !date,
			origmonth = inst.selectedmonth,
			origyear = inst.selectedyear,
			newdate = this._restrictminmax( inst, this._determinedate( inst, date, new date() ) );

		inst.selectedday = inst.currentday = newdate.getdate();
		inst.drawmonth = inst.selectedmonth = inst.currentmonth = newdate.getmonth();
		inst.drawyear = inst.selectedyear = inst.currentyear = newdate.getfullyear();
		if ( ( origmonth !== inst.selectedmonth || origyear !== inst.selectedyear ) && !nochange ) {
			this._notifychange( inst );
		}
		this._adjustinstdate( inst );
		if ( inst.input ) {
			inst.input.val( clear ? "" : this._formatdate( inst ) );
		}
	},

	/* retrieve the date(s) directly. */
	_getdate: function( inst ) {
		var startdate = ( !inst.currentyear || ( inst.input && inst.input.val() === "" ) ? null :
			this._daylightsavingadjust( new date(
			inst.currentyear, inst.currentmonth, inst.currentday ) ) );
			return startdate;
	},

	/* attach the onxxx handlers.  these are declared statically so
	 * they work with static code transformers like caja.
	 */
	_attachhandlers: function( inst ) {
		var stepmonths = this._get( inst, "stepmonths" ),
			id = "#" + inst.id.replace( /\\\\/g, "\\" );
		inst.dpdiv.find( "[data-handler]" ).map( function() {
			var handler = {
				prev: function() {
					$.datepicker._adjustdate( id, -stepmonths, "m" );
				},
				next: function() {
					$.datepicker._adjustdate( id, +stepmonths, "m" );
				},
				hide: function() {
					$.datepicker._hidedatepicker();
				},
				today: function() {
					$.datepicker._gototoday( id );
				},
				selectday: function() {
					$.datepicker._selectday( id, +this.getattribute( "data-month" ), +this.getattribute( "data-year" ), this );
					return false;
				},
				selectmonth: function() {
					$.datepicker._selectmonthyear( id, this, "m" );
					return false;
				},
				selectyear: function() {
					$.datepicker._selectmonthyear( id, this, "y" );
					return false;
				}
			};
			$( this ).on( this.getattribute( "data-event" ), handler[ this.getattribute( "data-handler" ) ] );
		} );
	},

	/* generate the html for the current state of the date picker. */
	_generatehtml: function( inst ) {
		var maxdraw, prevtext, prev, nexttext, next, currenttext, gotodate,
			controls, buttonpanel, firstday, showweek, daynames, daynamesmin,
			monthnames, monthnamesshort, beforeshowday, showothermonths,
			selectothermonths, defaultdate, html, dow, row, group, col, selecteddate,
			cornerclass, calender, thead, day, daysinmonth, leaddays, currows, numrows,
			printdate, drow, tbody, daysettings, othermonth, unselectable,
			tempdate = new date(),
			today = this._daylightsavingadjust(
				new date( tempdate.getfullyear(), tempdate.getmonth(), tempdate.getdate() ) ), // clear time
			isrtl = this._get( inst, "isrtl" ),
			showbuttonpanel = this._get( inst, "showbuttonpanel" ),
			hideifnoprevnext = this._get( inst, "hideifnoprevnext" ),
			navigationasdateformat = this._get( inst, "navigationasdateformat" ),
			nummonths = this._getnumberofmonths( inst ),
			showcurrentatpos = this._get( inst, "showcurrentatpos" ),
			stepmonths = this._get( inst, "stepmonths" ),
			ismultimonth = ( nummonths[ 0 ] !== 1 || nummonths[ 1 ] !== 1 ),
			currentdate = this._daylightsavingadjust( ( !inst.currentday ? new date( 9999, 9, 9 ) :
				new date( inst.currentyear, inst.currentmonth, inst.currentday ) ) ),
			mindate = this._getminmaxdate( inst, "min" ),
			maxdate = this._getminmaxdate( inst, "max" ),
			drawmonth = inst.drawmonth - showcurrentatpos,
			drawyear = inst.drawyear;

		if ( drawmonth < 0 ) {
			drawmonth += 12;
			drawyear--;
		}
		if ( maxdate ) {
			maxdraw = this._daylightsavingadjust( new date( maxdate.getfullyear(),
				maxdate.getmonth() - ( nummonths[ 0 ] * nummonths[ 1 ] ) + 1, maxdate.getdate() ) );
			maxdraw = ( mindate && maxdraw < mindate ? mindate : maxdraw );
			while ( this._daylightsavingadjust( new date( drawyear, drawmonth, 1 ) ) > maxdraw ) {
				drawmonth--;
				if ( drawmonth < 0 ) {
					drawmonth = 11;
					drawyear--;
				}
			}
		}
		inst.drawmonth = drawmonth;
		inst.drawyear = drawyear;

		prevtext = this._get( inst, "prevtext" );
		prevtext = ( !navigationasdateformat ? prevtext : this.formatdate( prevtext,
			this._daylightsavingadjust( new date( drawyear, drawmonth - stepmonths, 1 ) ),
			this._getformatconfig( inst ) ) );

		if ( this._canadjustmonth( inst, -1, drawyear, drawmonth ) ) {
			prev = $( "<a>" )
				.attr( {
					"class": "ui-datepicker-prev ui-corner-all",
					"data-handler": "prev",
					"data-event": "click",
					title: prevtext
				} )
				.append(
					$( "<span>" )
						.addclass( "ui-icon ui-icon-circle-triangle-" +
							( isrtl ? "e" : "w" ) )
						.text( prevtext )
				)[ 0 ].outerhtml;
		} else if ( hideifnoprevnext ) {
			prev = "";
		} else {
			prev = $( "<a>" )
				.attr( {
					"class": "ui-datepicker-prev ui-corner-all ui-state-disabled",
					title: prevtext
				} )
				.append(
					$( "<span>" )
						.addclass( "ui-icon ui-icon-circle-triangle-" +
							( isrtl ? "e" : "w" ) )
						.text( prevtext )
				)[ 0 ].outerhtml;
		}

		nexttext = this._get( inst, "nexttext" );
		nexttext = ( !navigationasdateformat ? nexttext : this.formatdate( nexttext,
			this._daylightsavingadjust( new date( drawyear, drawmonth + stepmonths, 1 ) ),
			this._getformatconfig( inst ) ) );

		if ( this._canadjustmonth( inst, +1, drawyear, drawmonth ) ) {
			next = $( "<a>" )
				.attr( {
					"class": "ui-datepicker-next ui-corner-all",
					"data-handler": "next",
					"data-event": "click",
					title: nexttext
				} )
				.append(
					$( "<span>" )
						.addclass( "ui-icon ui-icon-circle-triangle-" +
							( isrtl ? "w" : "e" ) )
						.text( nexttext )
				)[ 0 ].outerhtml;
		} else if ( hideifnoprevnext ) {
			next = "";
		} else {
			next = $( "<a>" )
				.attr( {
					"class": "ui-datepicker-next ui-corner-all ui-state-disabled",
					title: nexttext
				} )
				.append(
					$( "<span>" )
						.attr( "class", "ui-icon ui-icon-circle-triangle-" +
							( isrtl ? "w" : "e" ) )
						.text( nexttext )
				)[ 0 ].outerhtml;
		}

		currenttext = this._get( inst, "currenttext" );
		gotodate = ( this._get( inst, "gotocurrent" ) && inst.currentday ? currentdate : today );
		currenttext = ( !navigationasdateformat ? currenttext :
			this.formatdate( currenttext, gotodate, this._getformatconfig( inst ) ) );

		controls = "";
		if ( !inst.inline ) {
			controls = $( "<button>" )
				.attr( {
					type: "button",
					"class": "ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all",
					"data-handler": "hide",
					"data-event": "click"
				} )
				.text( this._get( inst, "closetext" ) )[ 0 ].outerhtml;
		}

		buttonpanel = "";
		if ( showbuttonpanel ) {
			buttonpanel = $( "<div class='ui-datepicker-buttonpane ui-widget-content'>" )
				.append( isrtl ? controls : "" )
				.append( this._isinrange( inst, gotodate ) ?
					$( "<button>" )
						.attr( {
							type: "button",
							"class": "ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all",
							"data-handler": "today",
							"data-event": "click"
						} )
						.text( currenttext ) :
					"" )
				.append( isrtl ? "" : controls )[ 0 ].outerhtml;
		}

		firstday = parseint( this._get( inst, "firstday" ), 10 );
		firstday = ( isnan( firstday ) ? 0 : firstday );

		showweek = this._get( inst, "showweek" );
		daynames = this._get( inst, "daynames" );
		daynamesmin = this._get( inst, "daynamesmin" );
		monthnames = this._get( inst, "monthnames" );
		monthnamesshort = this._get( inst, "monthnamesshort" );
		beforeshowday = this._get( inst, "beforeshowday" );
		showothermonths = this._get( inst, "showothermonths" );
		selectothermonths = this._get( inst, "selectothermonths" );
		defaultdate = this._getdefaultdate( inst );
		html = "";

		for ( row = 0; row < nummonths[ 0 ]; row++ ) {
			group = "";
			this.maxrows = 4;
			for ( col = 0; col < nummonths[ 1 ]; col++ ) {
				selecteddate = this._daylightsavingadjust( new date( drawyear, drawmonth, inst.selectedday ) );
				cornerclass = " ui-corner-all";
				calender = "";
				if ( ismultimonth ) {
					calender += "<div class='ui-datepicker-group";
					if ( nummonths[ 1 ] > 1 ) {
						switch ( col ) {
							case 0: calender += " ui-datepicker-group-first";
								cornerclass = " ui-corner-" + ( isrtl ? "right" : "left" ); break;
							case nummonths[ 1 ] - 1: calender += " ui-datepicker-group-last";
								cornerclass = " ui-corner-" + ( isrtl ? "left" : "right" ); break;
							default: calender += " ui-datepicker-group-middle"; cornerclass = ""; break;
						}
					}
					calender += "'>";
				}
				calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerclass + "'>" +
					( /all|left/.test( cornerclass ) && row === 0 ? ( isrtl ? next : prev ) : "" ) +
					( /all|right/.test( cornerclass ) && row === 0 ? ( isrtl ? prev : next ) : "" ) +
					this._generatemonthyearheader( inst, drawmonth, drawyear, mindate, maxdate,
					row > 0 || col > 0, monthnames, monthnamesshort ) + // draw month headers
					"</div><table class='ui-datepicker-calendar'><thead>" +
					"<tr>";
				thead = ( showweek ? "<th class='ui-datepicker-week-col'>" + this._get( inst, "weekheader" ) + "</th>" : "" );
				for ( dow = 0; dow < 7; dow++ ) { // days of the week
					day = ( dow + firstday ) % 7;
					thead += "<th scope='col'" + ( ( dow + firstday + 6 ) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "" ) + ">" +
						"<span title='" + daynames[ day ] + "'>" + daynamesmin[ day ] + "</span></th>";
				}
				calender += thead + "</tr></thead><tbody>";
				daysinmonth = this._getdaysinmonth( drawyear, drawmonth );
				if ( drawyear === inst.selectedyear && drawmonth === inst.selectedmonth ) {
					inst.selectedday = math.min( inst.selectedday, daysinmonth );
				}
				leaddays = ( this._getfirstdayofmonth( drawyear, drawmonth ) - firstday + 7 ) % 7;
				currows = math.ceil( ( leaddays + daysinmonth ) / 7 ); // calculate the number of rows to generate
				numrows = ( ismultimonth ? this.maxrows > currows ? this.maxrows : currows : currows ); //if multiple months, use the higher number of rows (see #7043)
				this.maxrows = numrows;
				printdate = this._daylightsavingadjust( new date( drawyear, drawmonth, 1 - leaddays ) );
				for ( drow = 0; drow < numrows; drow++ ) { // create date picker rows
					calender += "<tr>";
					tbody = ( !showweek ? "" : "<td class='ui-datepicker-week-col'>" +
						this._get( inst, "calculateweek" )( printdate ) + "</td>" );
					for ( dow = 0; dow < 7; dow++ ) { // create date picker days
						daysettings = ( beforeshowday ?
							beforeshowday.apply( ( inst.input ? inst.input[ 0 ] : null ), [ printdate ] ) : [ true, "" ] );
						othermonth = ( printdate.getmonth() !== drawmonth );
						unselectable = ( othermonth && !selectothermonths ) || !daysettings[ 0 ] ||
							( mindate && printdate < mindate ) || ( maxdate && printdate > maxdate );
						tbody += "<td class='" +
							( ( dow + firstday + 6 ) % 7 >= 5 ? " ui-datepicker-week-end" : "" ) + // highlight weekends
							( othermonth ? " ui-datepicker-other-month" : "" ) + // highlight days from other months
							( ( printdate.gettime() === selecteddate.gettime() && drawmonth === inst.selectedmonth && inst._keyevent ) || // user pressed key
							( defaultdate.gettime() === printdate.gettime() && defaultdate.gettime() === selecteddate.gettime() ) ?

							// or defaultdate is current printeddate and defaultdate is selecteddate
							" " + this._dayoverclass : "" ) + // highlight selected day
							( unselectable ? " " + this._unselectableclass + " ui-state-disabled" : "" ) +  // highlight unselectable days
							( othermonth && !showothermonths ? "" : " " + daysettings[ 1 ] + // highlight custom dates
							( printdate.gettime() === currentdate.gettime() ? " " + this._currentclass : "" ) + // highlight selected day
							( printdate.gettime() === today.gettime() ? " ui-datepicker-today" : "" ) ) + "'" + // highlight today (if different)
							( ( !othermonth || showothermonths ) && daysettings[ 2 ] ? " title='" + daysettings[ 2 ].replace( /'/g, "&#39;" ) + "'" : "" ) + // cell title
							( unselectable ? "" : " data-handler='selectday' data-event='click' data-month='" + printdate.getmonth() + "' data-year='" + printdate.getfullyear() + "'" ) + ">" + // actions
							( othermonth && !showothermonths ? "&#xa0;" : // display for other months
							( unselectable ? "<span class='ui-state-default'>" + printdate.getdate() + "</span>" : "<a class='ui-state-default" +
							( printdate.gettime() === today.gettime() ? " ui-state-highlight" : "" ) +
							( printdate.gettime() === currentdate.gettime() ? " ui-state-active" : "" ) + // highlight selected day
							( othermonth ? " ui-priority-secondary" : "" ) + // distinguish dates from other months
							"' href='#' aria-current='" + ( printdate.gettime() === currentdate.gettime() ? "true" : "false" ) + // mark date as selected for screen reader
							"' data-date='" + printdate.getdate() + // store date as data
							"'>" + printdate.getdate() + "</a>" ) ) + "</td>"; // display selectable date
						printdate.setdate( printdate.getdate() + 1 );
						printdate = this._daylightsavingadjust( printdate );
					}
					calender += tbody + "</tr>";
				}
				drawmonth++;
				if ( drawmonth > 11 ) {
					drawmonth = 0;
					drawyear++;
				}
				calender += "</tbody></table>" + ( ismultimonth ? "</div>" +
							( ( nummonths[ 0 ] > 0 && col === nummonths[ 1 ] - 1 ) ? "<div class='ui-datepicker-row-break'></div>" : "" ) : "" );
				group += calender;
			}
			html += group;
		}
		html += buttonpanel;
		inst._keyevent = false;
		return html;
	},

	/* generate the month and year header. */
	_generatemonthyearheader: function( inst, drawmonth, drawyear, mindate, maxdate,
			secondary, monthnames, monthnamesshort ) {

		var inminyear, inmaxyear, month, years, thisyear, determineyear, year, endyear,
			changemonth = this._get( inst, "changemonth" ),
			changeyear = this._get( inst, "changeyear" ),
			showmonthafteryear = this._get( inst, "showmonthafteryear" ),
			selectmonthlabel = this._get( inst, "selectmonthlabel" ),
			selectyearlabel = this._get( inst, "selectyearlabel" ),
			html = "<div class='ui-datepicker-title'>",
			monthhtml = "";

		// month selection
		if ( secondary || !changemonth ) {
			monthhtml += "<span class='ui-datepicker-month'>" + monthnames[ drawmonth ] + "</span>";
		} else {
			inminyear = ( mindate && mindate.getfullyear() === drawyear );
			inmaxyear = ( maxdate && maxdate.getfullyear() === drawyear );
			monthhtml += "<select class='ui-datepicker-month' aria-label='" + selectmonthlabel + "' data-handler='selectmonth' data-event='change'>";
			for ( month = 0; month < 12; month++ ) {
				if ( ( !inminyear || month >= mindate.getmonth() ) && ( !inmaxyear || month <= maxdate.getmonth() ) ) {
					monthhtml += "<option value='" + month + "'" +
						( month === drawmonth ? " selected='selected'" : "" ) +
						">" + monthnamesshort[ month ] + "</option>";
				}
			}
			monthhtml += "</select>";
		}

		if ( !showmonthafteryear ) {
			html += monthhtml + ( secondary || !( changemonth && changeyear ) ? "&#xa0;" : "" );
		}

		// year selection
		if ( !inst.yearshtml ) {
			inst.yearshtml = "";
			if ( secondary || !changeyear ) {
				html += "<span class='ui-datepicker-year'>" + drawyear + "</span>";
			} else {

				// determine range of years to display
				years = this._get( inst, "yearrange" ).split( ":" );
				thisyear = new date().getfullyear();
				determineyear = function( value ) {
					var year = ( value.match( /c[+\-].*/ ) ? drawyear + parseint( value.substring( 1 ), 10 ) :
						( value.match( /[+\-].*/ ) ? thisyear + parseint( value, 10 ) :
						parseint( value, 10 ) ) );
					return ( isnan( year ) ? thisyear : year );
				};
				year = determineyear( years[ 0 ] );
				endyear = math.max( year, determineyear( years[ 1 ] || "" ) );
				year = ( mindate ? math.max( year, mindate.getfullyear() ) : year );
				endyear = ( maxdate ? math.min( endyear, maxdate.getfullyear() ) : endyear );
				inst.yearshtml += "<select class='ui-datepicker-year' aria-label='" + selectyearlabel + "' data-handler='selectyear' data-event='change'>";
				for ( ; year <= endyear; year++ ) {
					inst.yearshtml += "<option value='" + year + "'" +
						( year === drawyear ? " selected='selected'" : "" ) +
						">" + year + "</option>";
				}
				inst.yearshtml += "</select>";

				html += inst.yearshtml;
				inst.yearshtml = null;
			}
		}

		html += this._get( inst, "yearsuffix" );
		if ( showmonthafteryear ) {
			html += ( secondary || !( changemonth && changeyear ) ? "&#xa0;" : "" ) + monthhtml;
		}
		html += "</div>"; // close datepicker_header
		return html;
	},

	/* adjust one of the date sub-fields. */
	_adjustinstdate: function( inst, offset, period ) {
		var year = inst.selectedyear + ( period === "y" ? offset : 0 ),
			month = inst.selectedmonth + ( period === "m" ? offset : 0 ),
			day = math.min( inst.selectedday, this._getdaysinmonth( year, month ) ) + ( period === "d" ? offset : 0 ),
			date = this._restrictminmax( inst, this._daylightsavingadjust( new date( year, month, day ) ) );

		inst.selectedday = date.getdate();
		inst.drawmonth = inst.selectedmonth = date.getmonth();
		inst.drawyear = inst.selectedyear = date.getfullyear();
		if ( period === "m" || period === "y" ) {
			this._notifychange( inst );
		}
	},

	/* ensure a date is within any min/max bounds. */
	_restrictminmax: function( inst, date ) {
		var mindate = this._getminmaxdate( inst, "min" ),
			maxdate = this._getminmaxdate( inst, "max" ),
			newdate = ( mindate && date < mindate ? mindate : date );
		return ( maxdate && newdate > maxdate ? maxdate : newdate );
	},

	/* notify change of month/year. */
	_notifychange: function( inst ) {
		var onchange = this._get( inst, "onchangemonthyear" );
		if ( onchange ) {
			onchange.apply( ( inst.input ? inst.input[ 0 ] : null ),
				[ inst.selectedyear, inst.selectedmonth + 1, inst ] );
		}
	},

	/* determine the number of months to show. */
	_getnumberofmonths: function( inst ) {
		var nummonths = this._get( inst, "numberofmonths" );
		return ( nummonths == null ? [ 1, 1 ] : ( typeof nummonths === "number" ? [ 1, nummonths ] : nummonths ) );
	},

	/* determine the current maximum date - ensure no time components are set. */
	_getminmaxdate: function( inst, minmax ) {
		return this._determinedate( inst, this._get( inst, minmax + "date" ), null );
	},

	/* find the number of days in a given month. */
	_getdaysinmonth: function( year, month ) {
		return 32 - this._daylightsavingadjust( new date( year, month, 32 ) ).getdate();
	},

	/* find the day of the week of the first of a month. */
	_getfirstdayofmonth: function( year, month ) {
		return new date( year, month, 1 ).getday();
	},

	/* determines if we should allow a "next/prev" month display change. */
	_canadjustmonth: function( inst, offset, curyear, curmonth ) {
		var nummonths = this._getnumberofmonths( inst ),
			date = this._daylightsavingadjust( new date( curyear,
			curmonth + ( offset < 0 ? offset : nummonths[ 0 ] * nummonths[ 1 ] ), 1 ) );

		if ( offset < 0 ) {
			date.setdate( this._getdaysinmonth( date.getfullyear(), date.getmonth() ) );
		}
		return this._isinrange( inst, date );
	},

	/* is the given date in the accepted range? */
	_isinrange: function( inst, date ) {
		var yearsplit, currentyear,
			mindate = this._getminmaxdate( inst, "min" ),
			maxdate = this._getminmaxdate( inst, "max" ),
			minyear = null,
			maxyear = null,
			years = this._get( inst, "yearrange" );
			if ( years ) {
				yearsplit = years.split( ":" );
				currentyear = new date().getfullyear();
				minyear = parseint( yearsplit[ 0 ], 10 );
				maxyear = parseint( yearsplit[ 1 ], 10 );
				if ( yearsplit[ 0 ].match( /[+\-].*/ ) ) {
					minyear += currentyear;
				}
				if ( yearsplit[ 1 ].match( /[+\-].*/ ) ) {
					maxyear += currentyear;
				}
			}

		return ( ( !mindate || date.gettime() >= mindate.gettime() ) &&
			( !maxdate || date.gettime() <= maxdate.gettime() ) &&
			( !minyear || date.getfullyear() >= minyear ) &&
			( !maxyear || date.getfullyear() <= maxyear ) );
	},

	/* provide the configuration settings for formatting/parsing. */
	_getformatconfig: function( inst ) {
		var shortyearcutoff = this._get( inst, "shortyearcutoff" );
		shortyearcutoff = ( typeof shortyearcutoff !== "string" ? shortyearcutoff :
			new date().getfullyear() % 100 + parseint( shortyearcutoff, 10 ) );
		return { shortyearcutoff: shortyearcutoff,
			daynamesshort: this._get( inst, "daynamesshort" ), daynames: this._get( inst, "daynames" ),
			monthnamesshort: this._get( inst, "monthnamesshort" ), monthnames: this._get( inst, "monthnames" ) };
	},

	/* format the given date for display. */
	_formatdate: function( inst, day, month, year ) {
		if ( !day ) {
			inst.currentday = inst.selectedday;
			inst.currentmonth = inst.selectedmonth;
			inst.currentyear = inst.selectedyear;
		}
		var date = ( day ? ( typeof day === "object" ? day :
			this._daylightsavingadjust( new date( year, month, day ) ) ) :
			this._daylightsavingadjust( new date( inst.currentyear, inst.currentmonth, inst.currentday ) ) );
		return this.formatdate( this._get( inst, "dateformat" ), date, this._getformatconfig( inst ) );
	}
} );

/*
 * bind hover events for datepicker elements.
 * done via delegate so the binding only occurs once in the lifetime of the parent div.
 * global datepicker_instactive, set by _updatedatepicker allows the handlers to find their way back to the active picker.
 */
function datepicker_bindhover( dpdiv ) {
	var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
	return dpdiv.on( "mouseout", selector, function() {
			$( this ).removeclass( "ui-state-hover" );
			if ( this.classname.indexof( "ui-datepicker-prev" ) !== -1 ) {
				$( this ).removeclass( "ui-datepicker-prev-hover" );
			}
			if ( this.classname.indexof( "ui-datepicker-next" ) !== -1 ) {
				$( this ).removeclass( "ui-datepicker-next-hover" );
			}
		} )
		.on( "mouseover", selector, datepicker_handlemouseover );
}

function datepicker_handlemouseover() {
	if ( !$.datepicker._isdisableddatepicker( datepicker_instactive.inline ? datepicker_instactive.dpdiv.parent()[ 0 ] : datepicker_instactive.input[ 0 ] ) ) {
		$( this ).parents( ".ui-datepicker-calendar" ).find( "a" ).removeclass( "ui-state-hover" );
		$( this ).addclass( "ui-state-hover" );
		if ( this.classname.indexof( "ui-datepicker-prev" ) !== -1 ) {
			$( this ).addclass( "ui-datepicker-prev-hover" );
		}
		if ( this.classname.indexof( "ui-datepicker-next" ) !== -1 ) {
			$( this ).addclass( "ui-datepicker-next-hover" );
		}
	}
}

/* jquery extend now ignores nulls! */
function datepicker_extendremove( target, props ) {
	$.extend( target, props );
	for ( var name in props ) {
		if ( props[ name ] == null ) {
			target[ name ] = props[ name ];
		}
	}
	return target;
}

/* invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
					object - settings for attaching new datepicker functionality
   @return  jquery object */
$.fn.datepicker = function( options ) {

	/* verify an empty collection wasn't passed - fixes #6976 */
	if ( !this.length ) {
		return this;
	}

	/* initialise the date picker. */
	if ( !$.datepicker.initialized ) {
		$( document ).on( "mousedown", $.datepicker._checkexternalclick );
		$.datepicker.initialized = true;
	}

	/* append datepicker main container to body if not exist. */
	if ( $( "#" + $.datepicker._maindivid ).length === 0 ) {
		$( "body" ).append( $.datepicker.dpdiv );
	}

	var otherargs = array.prototype.slice.call( arguments, 1 );
	if ( typeof options === "string" && ( options === "isdisabled" || options === "getdate" || options === "widget" ) ) {
		return $.datepicker[ "_" + options + "datepicker" ].
			apply( $.datepicker, [ this[ 0 ] ].concat( otherargs ) );
	}
	if ( options === "option" && arguments.length === 2 && typeof arguments[ 1 ] === "string" ) {
		return $.datepicker[ "_" + options + "datepicker" ].
			apply( $.datepicker, [ this[ 0 ] ].concat( otherargs ) );
	}
	return this.each( function() {
		if ( typeof options === "string" ) {
			$.datepicker[ "_" + options + "datepicker" ]
				.apply( $.datepicker, [ this ].concat( otherargs ) );
		} else {
			$.datepicker._attachdatepicker( this, options );
		}
	} );
};

$.datepicker = new datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new date().gettime();
$.datepicker.version = "1.13.3";

return $.datepicker;

} );


