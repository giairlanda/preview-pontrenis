/*!
 * jquery ui autocomplete 1.13.3
 * https://jqueryui.com
 *
 * copyright openjs foundation and other contributors
 * released under the mit license.
 * https://jquery.org/license
 */

//>>label: autocomplete
//>>group: widgets
//>>description: lists suggested words as the user is typing.
//>>docs: https://api.jqueryui.com/autocomplete/
//>>demos: https://jqueryui.com/autocomplete/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/autocomplete.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [
			"jquery",
			"./menu",
			"../keycode",
			"../position",
			"../safe-active-element",
			"../version",
			"../widget"
		], factory );
	} else {

		// browser globals
		factory( jquery );
	}
} )( function( $ ) {
"use strict";

$.widget( "ui.autocomplete", {
	version: "1.13.3",
	defaultelement: "<input>",
	options: {
		appendto: null,
		autofocus: false,
		delay: 300,
		minlength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	requestindex: 0,
	pending: 0,
	liveregiontimer: null,

	_create: function() {

		// some browsers only repeat keydown events, not keypress events,
		// so we use the suppresskeypress flag to determine if we've already
		// handled the keydown event. #7269
		// unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppresskeypressrepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppresskeypress, suppresskeypressrepeat, suppressinput,
			nodename = this.element[ 0 ].nodename.tolowercase(),
			istextarea = nodename === "textarea",
			isinput = nodename === "input";

		// textareas are always multi-line
		// inputs are always single-line, even if inside a contenteditable element
		// ie also treats inputs as contenteditable
		// all other element types are determined by whether or not they're contenteditable
		this.ismultiline = istextarea || !isinput && this._iscontenteditable( this.element );

		this.valuemethod = this.element[ istextarea || isinput ? "val" : "text" ];
		this.isnewmenu = true;

		this._addclass( "ui-autocomplete-input" );
		this.element.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readonly" ) ) {
					suppresskeypress = true;
					suppressinput = true;
					suppresskeypressrepeat = true;
					return;
				}

				suppresskeypress = false;
				suppressinput = false;
				suppresskeypressrepeat = false;
				var keycode = $.ui.keycode;
				switch ( event.keycode ) {
				case keycode.page_up:
					suppresskeypress = true;
					this._move( "previouspage", event );
					break;
				case keycode.page_down:
					suppresskeypress = true;
					this._move( "nextpage", event );
					break;
				case keycode.up:
					suppresskeypress = true;
					this._keyevent( "previous", event );
					break;
				case keycode.down:
					suppresskeypress = true;
					this._keyevent( "next", event );
					break;
				case keycode.enter:

					// when menu is open and has focus
					if ( this.menu.active ) {

						// #6055 - opera still allows the keypress to occur
						// which causes forms to submit
						suppresskeypress = true;
						event.preventdefault();
						this.menu.select( event );
					}
					break;
				case keycode.tab:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keycode.escape:
					if ( this.menu.element.is( ":visible" ) ) {
						if ( !this.ismultiline ) {
							this._value( this.term );
						}
						this.close( event );

						// different browsers have different default behavior for escape
						// single press can mean undo or clear
						// double press in ie means clear the whole form
						event.preventdefault();
					}
					break;
				default:
					suppresskeypressrepeat = true;

					// search timeout should be triggered before the input value is changed
					this._searchtimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppresskeypress ) {
					suppresskeypress = false;
					if ( !this.ismultiline || this.menu.element.is( ":visible" ) ) {
						event.preventdefault();
					}
					return;
				}
				if ( suppresskeypressrepeat ) {
					return;
				}

				// replicate some key handlers to allow them to repeat in firefox and opera
				var keycode = $.ui.keycode;
				switch ( event.keycode ) {
				case keycode.page_up:
					this._move( "previouspage", event );
					break;
				case keycode.page_down:
					this._move( "nextpage", event );
					break;
				case keycode.up:
					this._keyevent( "previous", event );
					break;
				case keycode.down:
					this._keyevent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressinput ) {
					suppressinput = false;
					event.preventdefault();
					return;
				}
				this._searchtimeout( event );
			},
			focus: function() {
				this.selecteditem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				cleartimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		} );

		this._initsource();
		this.menu = $( "<ul>" )
			.appendto( this._appendto() )
			.menu( {

				// disable aria support, the live region takes care of that
				role: null
			} )
			.hide()

			// support: ie 11 only, edge <= 14
			// for other browsers, we preventdefault() on the mousedown event
			// to keep the dropdown from taking focus from the input. this doesn't
			// work for ie/edge, causing problems with selection and scrolling (#9638)
			// happily, ie and edge support an "unselectable" attribute that
			// prevents an element from receiving focus, exactly what we want here.
			.attr( {
				"unselectable": "on"
			} )
			.menu( "instance" );

		this._addclass( this.menu.element, "ui-autocomplete", "ui-front" );
		this._on( this.menu.element, {
			mousedown: function( event ) {

				// prevent moving focus out of the text field
				event.preventdefault();
			},
			menufocus: function( event, ui ) {
				var label, item;

				// support: firefox
				// prevent accidental activation of menu items in firefox (#7024 #9118)
				if ( this.isnewmenu ) {
					this.isnewmenu = false;
					if ( event.originalevent && /^mouse/.test( event.originalevent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalevent );
						} );

						return;
					}
				}

				item = ui.item.data( "ui-autocomplete-item" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {

					// use value to match what will end up in the input, if it was a key event
					if ( event.originalevent && /^key/.test( event.originalevent.type ) ) {
						this._value( item.value );
					}
				}

				// announce the value in the liveregion
				label = ui.item.attr( "aria-label" ) || item.value;
				if ( label && string.prototype.trim.call( label ).length ) {
					cleartimeout( this.liveregiontimer );
					this.liveregiontimer = this._delay( function() {
						this.liveregion.html( $( "<div>" ).text( label ) );
					}, 100 );
				}
			},
			menuselect: function( event, ui ) {
				var item = ui.item.data( "ui-autocomplete-item" ),
					previous = this.previous;

				// only trigger when focus was lost (click on menu)
				if ( this.element[ 0 ] !== $.ui.safeactiveelement( this.document[ 0 ] ) ) {
					this.element.trigger( "focus" );
					this.previous = previous;

					// #6109 - ie triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay( function() {
						this.previous = previous;
						this.selecteditem = item;
					} );
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}

				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selecteditem = item;
			}
		} );

		this.liveregion = $( "<div>", {
			role: "status",
			"aria-live": "assertive",
			"aria-relevant": "additions"
		} )
			.appendto( this.document[ 0 ].body );

		this._addclass( this.liveregion, null, "ui-helper-hidden-accessible" );

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeattr( "autocomplete" );
			}
		} );
	},

	_destroy: function() {
		cleartimeout( this.searching );
		this.element.removeattr( "autocomplete" );
		this.menu.element.remove();
		this.liveregion.remove();
	},

	_setoption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initsource();
		}
		if ( key === "appendto" ) {
			this.menu.element.appendto( this._appendto() );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_iseventtargetinwidget: function( event ) {
		var menuelement = this.menu.element[ 0 ];

		return event.target === this.element[ 0 ] ||
			event.target === menuelement ||
			$.contains( menuelement, event.target );
	},

	_closeonclickoutside: function( event ) {
		if ( !this._iseventtargetinwidget( event ) ) {
			this.close();
		}
	},

	_appendto: function() {
		var element = this.options.appendto;

		if ( element ) {
			element = element.jquery || element.nodetype ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element || !element[ 0 ] ) {
			element = this.element.closest( ".ui-front, dialog" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_initsource: function() {
		var array, url,
			that = this;
		if ( array.isarray( this.options.source ) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax( {
					url: url,
					data: request,
					datatype: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response( [] );
					}
				} );
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchtimeout: function( event ) {
		cleartimeout( this.searching );
		this.searching = this._delay( function() {

			// search if the value has changed, or if the user retypes the same value (see #7434)
			var equalvalues = this.term === this._value(),
				menuvisible = this.menu.element.is( ":visible" ),
				modifierkey = event.altkey || event.ctrlkey || event.metakey || event.shiftkey;

			if ( !equalvalues || ( equalvalues && !menuvisible && !modifierkey ) ) {
				this.selecteditem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minlength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this._addclass( "ui-autocomplete-loading" );
		this.cancelsearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var index = ++this.requestindex;

		return function( content ) {
			if ( index === this.requestindex ) {
				this.__response( content );
			}

			this.pending--;
			if ( !this.pending ) {
				this._removeclass( "ui-autocomplete-loading" );
			}
		}.bind( this );
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelsearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {

			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
		this.cancelsearch = true;
		this._close( event );
	},

	_close: function( event ) {

		// remove the handler that closes the menu on outside clicks
		this._off( this.document, "mousedown" );

		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isnewmenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selecteditem } );
		}
	},

	_normalize: function( items ) {

		// assume all items have the right format when the first item is complete
		if ( items.length && items[ 0 ].label && items[ 0 ].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend( {}, item, {
				label: item.label || item.value,
				value: item.value || item.label
			} );
		} );
	},

	_suggest: function( items ) {
		var ul = this.menu.element.empty();
		this._rendermenu( ul, items );
		this.isnewmenu = true;
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizemenu();
		ul.position( $.extend( {
			of: this.element
		}, this.options.position ) );

		if ( this.options.autofocus ) {
			this.menu.next();
		}

		// listen for interactions outside of the widget (#6642)
		this._on( this.document, {
			mousedown: "_closeonclickoutside"
		} );
	},

	_resizemenu: function() {
		var ul = this.menu.element;
		ul.outerwidth( math.max(

			// firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerwidth() + 1,
			this.element.outerwidth()
		) );
	},

	_rendermenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderitemdata( ul, item );
		} );
	},

	_renderitemdata: function( ul, item ) {
		return this._renderitem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderitem: function( ul, item ) {
		return $( "<li>" )
			.append( $( "<div>" ).text( item.label ) )
			.appendto( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isfirstitem() && /^previous/.test( direction ) ||
				this.menu.islastitem() && /^next/.test( direction ) ) {

			if ( !this.ismultiline ) {
				this._value( this.term );
			}

			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valuemethod.apply( this.element, arguments );
	},

	_keyevent: function( keyevent, event ) {
		if ( !this.ismultiline || this.menu.element.is( ":visible" ) ) {
			this._move( keyevent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventdefault();
		}
	},

	// support: chrome <=50
	// we should be able to just use this.element.prop( "iscontenteditable" )
	// but hidden elements always report false in chrome.
	// https://code.google.com/p/chromium/issues/detail?id=313082
	_iscontenteditable: function( element ) {
		if ( !element.length ) {
			return false;
		}

		var editable = element.prop( "contenteditable" );

		if ( editable === "inherit" ) {
			return this._iscontenteditable( element.parent() );
		}

		return editable === "true";
	}
} );

$.extend( $.ui.autocomplete, {
	escaperegex: function( value ) {
		return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
	},
	filter: function( array, term ) {
		var matcher = new regexp( $.ui.autocomplete.escaperegex( term ), "i" );
		return $.grep( array, function( value ) {
			return matcher.test( value.label || value.value || value );
		} );
	}
} );

// live region extension, adding a `messages` option
// note: this is an experimental api. we are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noresults: "no search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superapply( arguments );
		if ( this.options.disabled || this.cancelsearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noresults;
		}
		cleartimeout( this.liveregiontimer );
		this.liveregiontimer = this._delay( function() {
			this.liveregion.html( $( "<div>" ).text( message ) );
		}, 100 );
	}
} );

return $.ui.autocomplete;

} );


