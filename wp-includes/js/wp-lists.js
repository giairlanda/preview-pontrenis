/**
 * @output wp-includes/js/wp-lists.js
 */

/* global ajaxurl, wpajax */

/**
 * @param {jquery} $ jquery object.
 */
( function( $ ) {
var functions = {
	add:     'ajaxadd',
	del:     'ajaxdel',
	dim:     'ajaxdim',
	process: 'process',
	recolor: 'recolor'
}, wplist;

/**
 * @namespace
 */
wplist = {

	/**
	 * @member {object}
	 */
	settings: {

		/**
		 * url for ajax requests.
		 *
		 * @member {string}
		 */
		url: ajaxurl,

		/**
		 * the http method to use for ajax requests.
		 *
		 * @member {string}
		 */
		type: 'post',

		/**
		 * id of the element the parsed ajax response will be stored in.
		 *
		 * @member {string}
		 */
		response: 'ajax-response',

		/**
		 * the type of list.
		 *
		 * @member {string}
		 */
		what: '',

		/**
		 * css class name for alternate styling.
		 *
		 * @member {string}
		 */
		alt: 'alternate',

		/**
		 * offset to start alternate styling from.
		 *
		 * @member {number}
		 */
		altoffset: 0,

		/**
		 * color used in animation when adding an element.
		 *
		 * can be 'none' to disable the animation.
		 *
		 * @member {string}
		 */
		addcolor: '#ffff33',

		/**
		 * color used in animation when deleting an element.
		 *
		 * can be 'none' to disable the animation.
		 *
		 * @member {string}
		 */
		delcolor: '#faafaa',

		/**
		 * color used in dim add animation.
		 *
		 * can be 'none' to disable the animation.
		 *
		 * @member {string}
		 */
		dimaddcolor: '#ffff33',

		/**
		 * color used in dim delete animation.
		 *
		 * can be 'none' to disable the animation.
		 *
		 * @member {string}
		 */
		dimdelcolor: '#ff3333',

		/**
		 * callback that's run before a request is made.
		 *
		 * @callback wplist~confirm
		 * @param {object}      this
		 * @param {htmlelement} list            the list dom element.
		 * @param {object}      settings        settings for the current list.
		 * @param {string}      action          the type of action to perform: 'add', 'delete', or 'dim'.
		 * @param {string}      backgroundcolor background color of the list's dom element.
		 * @return {boolean} whether to proceed with the action or not.
		 */
		confirm: null,

		/**
		 * callback that's run before an item gets added to the list.
		 *
		 * allows to cancel the request.
		 *
		 * @callback wplist~addbefore
		 * @param {object} settings settings for the ajax request.
		 * @return {object|boolean} settings for the ajax request or false to abort.
		 */
		addbefore: null,

		/**
		 * callback that's run after an item got added to the list.
		 *
		 * @callback wplist~addafter
		 * @param {xml}    returnedresponse raw response returned from the server.
		 * @param {object} settings         settings for the ajax request.
		 * @param {jqxhr}  settings.xml     jquery xmlhttprequest object.
		 * @param {string} settings.status  status of the request: 'success', 'notmodified', 'nocontent', 'error',
		 *                                  'timeout', 'abort', or 'parsererror'.
		 * @param {object} settings.parsed  parsed response object.
		 */
		addafter: null,

		/**
		 * callback that's run before an item gets deleted from the list.
		 *
		 * allows to cancel the request.
		 *
		 * @callback wplist~delbefore
		 * @param {object}      settings settings for the ajax request.
		 * @param {htmlelement} list     the list dom element.
		 * @return {object|boolean} settings for the ajax request or false to abort.
		 */
		delbefore: null,

		/**
		 * callback that's run after an item got deleted from the list.
		 *
		 * @callback wplist~delafter
		 * @param {xml}    returnedresponse raw response returned from the server.
		 * @param {object} settings         settings for the ajax request.
		 * @param {jqxhr}  settings.xml     jquery xmlhttprequest object.
		 * @param {string} settings.status  status of the request: 'success', 'notmodified', 'nocontent', 'error',
		 *                                  'timeout', 'abort', or 'parsererror'.
		 * @param {object} settings.parsed  parsed response object.
		 */
		delafter: null,

		/**
		 * callback that's run before an item gets dim'd.
		 *
		 * allows to cancel the request.
		 *
		 * @callback wplist~dimbefore
		 * @param {object} settings settings for the ajax request.
		 * @return {object|boolean} settings for the ajax request or false to abort.
		 */
		dimbefore: null,

		/**
		 * callback that's run after an item got dim'd.
		 *
		 * @callback wplist~dimafter
		 * @param {xml}    returnedresponse raw response returned from the server.
		 * @param {object} settings         settings for the ajax request.
		 * @param {jqxhr}  settings.xml     jquery xmlhttprequest object.
		 * @param {string} settings.status  status of the request: 'success', 'notmodified', 'nocontent', 'error',
		 *                                  'timeout', 'abort', or 'parsererror'.
		 * @param {object} settings.parsed  parsed response object.
		 */
		dimafter: null
	},

	/**
	 * finds a nonce.
	 *
	 * 1. nonce in settings.
	 * 2. `_ajax_nonce` value in element's href attribute.
	 * 3. `_ajax_nonce` input field that is a descendant of element.
	 * 4. `_wpnonce` value in element's href attribute.
	 * 5. `_wpnonce` input field that is a descendant of element.
	 * 6. 0 if none can be found.
	 *
	 * @param {jquery} element  element that triggered the request.
	 * @param {object} settings settings for the ajax request.
	 * @return {string|number} nonce
	 */
	nonce: function( element, settings ) {
		var url      = wpajax.unserialize( element.attr( 'href' ) ),
			$element = $( '#' + settings.element );

		return settings.nonce || url._ajax_nonce || $element.find( 'input[name="_ajax_nonce"]' ).val() || url._wpnonce || $element.find( 'input[name="_wpnonce"]' ).val() || 0;
	},

	/**
	 * extract list item data from a dom element.
	 *
	 * example 1: data-wp-lists="delete:the-comment-list:comment-{comment_id}:66cc66:unspam=1"
	 * example 2: data-wp-lists="dim:the-comment-list:comment-{comment_id}:unapproved:e7e7d3:e7e7d3:new=approved"
	 *
	 * returns an unassociative array with the following data:
	 * data[0] - data identifier: 'list', 'add', 'delete', or 'dim'.
	 * data[1] - id of the corresponding list. if data[0] is 'list', the type of list ('comment', 'category', etc).
	 * data[2] - id of the parent element of all inputs necessary for the request.
	 * data[3] - hex color to be used in this request. if data[0] is 'dim', dim class.
	 * data[4] - additional arguments in query syntax that are added to the request. example: 'post_id=1234'.
	 *           if data[0] is 'dim', dim add color.
	 * data[5] - only available if data[0] is 'dim', dim delete color.
	 * data[6] - only available if data[0] is 'dim', additional arguments in query syntax that are added to the request.
	 *
	 * result for example 1:
	 * data[0] - delete
	 * data[1] - the-comment-list
	 * data[2] - comment-{comment_id}
	 * data[3] - 66cc66
	 * data[4] - unspam=1
	 *
	 * @param {htmlelement} element the dom element.
	 * @param {string}      type    the type of data to look for: 'list', 'add', 'delete', or 'dim'.
	 * @return {array} extracted list item data.
	 */
	parsedata: function( element, type ) {
		var data = [], wplistsdata;

		try {
			wplistsdata = $( element ).data( 'wp-lists' ) || '';
			wplistsdata = wplistsdata.match( new regexp( type + ':[\\s]+' ) );

			if ( wplistsdata ) {
				data = wplistsdata[0].split( ':' );
			}
		} catch ( error ) {}

		return data;
	},

	/**
	 * calls a confirm callback to verify the action that is about to be performed.
	 *
	 * @param {htmlelement} list     the dom element.
	 * @param {object}      settings settings for this list.
	 * @param {string}      action   the type of action to perform: 'add', 'delete', or 'dim'.
	 * @return {object|boolean} settings if confirmed, false if not.
	 */
	pre: function( list, settings, action ) {
		var $element, backgroundcolor, confirmed;

		settings = $.extend( {}, this.wplist.settings, {
			element: null,
			nonce:   0,
			target:  list.get( 0 )
		}, settings || {} );

		if ( typeof settings.confirm === 'function' ) {
			$element = $( '#' + settings.element );

			if ( 'add' !== action ) {
				backgroundcolor = $element.css( 'backgroundcolor' );
				$element.css( 'backgroundcolor', '#ff9966' );
			}

			confirmed = settings.confirm.call( this, list, settings, action, backgroundcolor );

			if ( 'add' !== action ) {
				$element.css( 'backgroundcolor', backgroundcolor );
			}

			if ( ! confirmed ) {
				return false;
			}
		}

		return settings;
	},

	/**
	 * adds an item to the list via ajax.
	 *
	 * @param {htmlelement} element  the dom element.
	 * @param {object}      settings settings for this list.
	 * @return {boolean} whether the item was added.
	 */
	ajaxadd: function( element, settings ) {
		var list     = this,
			$element = $( element ),
			data     = wplist.parsedata( $element, 'add' ),
			formvalues, formdata, parsedresponse, returnedresponse;

		settings = settings || {};
		settings = wplist.pre.call( list, $element, settings, 'add' );

		settings.element  = data[2] || $element.prop( 'id' ) || settings.element || null;
		settings.addcolor = data[3] ? '#' + data[3] : settings.addcolor;

		if ( ! settings ) {
			return false;
		}

		if ( ! $element.is( '[id="' + settings.element + '-submit"]' ) ) {
			return ! wplist.add.call( list, $element, settings );
		}

		if ( ! settings.element ) {
			return true;
		}

		settings.action = 'add-' + settings.what;
		settings.nonce  = wplist.nonce( $element, settings );

		if ( ! wpajax.validateform( '#' + settings.element ) ) {
			return false;
		}

		settings.data = $.param( $.extend( {
			_ajax_nonce: settings.nonce,
			action:      settings.action
		}, wpajax.unserialize( data[4] || '' ) ) );

		formvalues = $( '#' + settings.element + ' :input' ).not( '[name="_ajax_nonce"], [name="_wpnonce"], [name="action"]' );
		formdata   = typeof formvalues.fieldserialize === 'function' ? formvalues.fieldserialize() : formvalues.serialize();

		if ( formdata ) {
			settings.data += '&' + formdata;
		}

		if ( typeof settings.addbefore === 'function' ) {
			settings = settings.addbefore( settings );

			if ( ! settings ) {
				return true;
			}
		}

		if ( ! settings.data.match( /_ajax_nonce=[a-f0-9]+/ ) ) {
			return true;
		}

		settings.success = function( response ) {
			parsedresponse   = wpajax.parseajaxresponse( response, settings.response, settings.element );
			returnedresponse = response;

			if ( ! parsedresponse || parsedresponse.errors ) {
				return false;
			}

			if ( true === parsedresponse ) {
				return true;
			}

			$.each( parsedresponse.responses, function() {
				wplist.add.call( list, this.data, $.extend( {}, settings, { // this.firstchild.nodevalue
					position: this.position || 0,
					id:       this.id || 0,
					oldid:    this.oldid || null
				} ) );
			} );

			list.wplist.recolor();
			$( list ).trigger( 'wplistaddend', [ settings, list.wplist ] );
			wplist.clear.call( list, '#' + settings.element );
		};

		settings.complete = function( jqxhr, status ) {
			if ( typeof settings.addafter === 'function' ) {
				settings.addafter( returnedresponse, $.extend( {
					xml:    jqxhr,
					status: status,
					parsed: parsedresponse
				}, settings ) );
			}
		};

		$.ajax( settings );

		return false;
	},

	/**
	 * delete an item in the list via ajax.
	 *
	 * @param {htmlelement} element  a dom element containing item data.
	 * @param {object}      settings settings for this list.
	 * @return {boolean} whether the item was deleted.
	 */
	ajaxdel: function( element, settings ) {
		var list     = this,
			$element = $( element ),
			data     = wplist.parsedata( $element, 'delete' ),
			$eventtarget, parsedresponse, returnedresponse;

		settings = settings || {};
		settings = wplist.pre.call( list, $element, settings, 'delete' );

		settings.element  = data[2] || settings.element || null;
		settings.delcolor = data[3] ? '#' + data[3] : settings.delcolor;

		if ( ! settings || ! settings.element ) {
			return false;
		}

		settings.action = 'delete-' + settings.what;
		settings.nonce  = wplist.nonce( $element, settings );

		settings.data = $.extend( {
			_ajax_nonce: settings.nonce,
			action:      settings.action,
			id:          settings.element.split( '-' ).pop()
		}, wpajax.unserialize( data[4] || '' ) );

		if ( typeof settings.delbefore === 'function' ) {
			settings = settings.delbefore( settings, list );

			if ( ! settings ) {
				return true;
			}
		}

		if ( ! settings.data._ajax_nonce ) {
			return true;
		}

		$eventtarget = $( '#' + settings.element );

		if ( 'none' !== settings.delcolor ) {
			$eventtarget.css( 'backgroundcolor', settings.delcolor ).fadeout( 350, function() {
				list.wplist.recolor();
				$( list ).trigger( 'wplistdelend', [ settings, list.wplist ] );
			} );
		} else {
			list.wplist.recolor();
			$( list ).trigger( 'wplistdelend', [ settings, list.wplist ] );
		}

		settings.success = function( response ) {
			parsedresponse   = wpajax.parseajaxresponse( response, settings.response, settings.element );
			returnedresponse = response;

			if ( ! parsedresponse || parsedresponse.errors ) {
				$eventtarget.stop().stop().css( 'backgroundcolor', '#faa' ).show().queue( function() {
					list.wplist.recolor();
					$( this ).dequeue();
				} );

				return false;
			}
		};

		settings.complete = function( jqxhr, status ) {
			if ( typeof settings.delafter === 'function' ) {
				$eventtarget.queue( function() {
					settings.delafter( returnedresponse, $.extend( {
						xml:    jqxhr,
						status: status,
						parsed: parsedresponse
					}, settings ) );
				} ).dequeue();
			}
		};

		$.ajax( settings );

		return false;
	},

	/**
	 * dim an item in the list via ajax.
	 *
	 * @param {htmlelement} element  a dom element containing item data.
	 * @param {object}      settings settings for this list.
	 * @return {boolean} whether the item was dim'ed.
	 */
	ajaxdim: function( element, settings ) {
		var list     = this,
			$element = $( element ),
			data     = wplist.parsedata( $element, 'dim' ),
			$eventtarget, isclass, color, dimcolor, parsedresponse, returnedresponse;

		// prevent hidden links from being clicked by hotkeys.
		if ( 'none' === $element.parent().css( 'display' ) ) {
			return false;
		}

		settings = settings || {};
		settings = wplist.pre.call( list, $element, settings, 'dim' );

		settings.element     = data[2] || settings.element || null;
		settings.dimclass    = data[3] || settings.dimclass || null;
		settings.dimaddcolor = data[4] ? '#' + data[4] : settings.dimaddcolor;
		settings.dimdelcolor = data[5] ? '#' + data[5] : settings.dimdelcolor;

		if ( ! settings || ! settings.element || ! settings.dimclass ) {
			return true;
		}

		settings.action = 'dim-' + settings.what;
		settings.nonce  = wplist.nonce( $element, settings );

		settings.data = $.extend( {
			_ajax_nonce: settings.nonce,
			action:      settings.action,
			id:          settings.element.split( '-' ).pop(),
			dimclass:    settings.dimclass
		}, wpajax.unserialize( data[6] || '' ) );

		if ( typeof settings.dimbefore === 'function' ) {
			settings = settings.dimbefore( settings );

			if ( ! settings ) {
				return true;
			}
		}

		$eventtarget = $( '#' + settings.element );
		isclass      = $eventtarget.toggleclass( settings.dimclass ).is( '.' + settings.dimclass );
		color        = wplist.getcolor( $eventtarget );
		dimcolor     = isclass ? settings.dimaddcolor : settings.dimdelcolor;
		$eventtarget.toggleclass( settings.dimclass );

		if ( 'none' !== dimcolor ) {
			$eventtarget
				.animate( { backgroundcolor: dimcolor }, 'fast' )
				.queue( function() {
					$eventtarget.toggleclass( settings.dimclass );
					$( this ).dequeue();
				} )
				.animate( { backgroundcolor: color }, {
					complete: function() {
						$( this ).css( 'backgroundcolor', '' );
						$( list ).trigger( 'wplistdimend', [ settings, list.wplist ] );
					}
				} );
		} else {
			$( list ).trigger( 'wplistdimend', [ settings, list.wplist ] );
		}

		if ( ! settings.data._ajax_nonce ) {
			return true;
		}

		settings.success = function( response ) {
			parsedresponse   = wpajax.parseajaxresponse( response, settings.response, settings.element );
			returnedresponse = response;

			if ( true === parsedresponse ) {
				return true;
			}

			if ( ! parsedresponse || parsedresponse.errors ) {
				$eventtarget.stop().stop().css( 'backgroundcolor', '#ff3333' )[isclass ? 'removeclass' : 'addclass']( settings.dimclass ).show().queue( function() {
					list.wplist.recolor();
					$( this ).dequeue();
				} );

				return false;
			}

			/** @property {string} comment_link link of the comment to be dimmed. */
			if ( 'undefined' !== typeof parsedresponse.responses[0].supplemental.comment_link ) {
				var $submittedon = $element.find( '.submitted-on' ),
					$commentlink = $submittedon.find( 'a' );

				// comment is approved; link the date field.
				if ( '' !== parsedresponse.responses[0].supplemental.comment_link ) {
					$submittedon.html( $('<a></a>').text( $submittedon.text() ).prop( 'href', parsedresponse.responses[0].supplemental.comment_link ) );

				// comment is not approved; unlink the date field.
				} else if ( $commentlink.length ) {
					$submittedon.text( $commentlink.text() );
				}
			}
		};

		settings.complete = function( jqxhr, status ) {
			if ( typeof settings.dimafter === 'function' ) {
				$eventtarget.queue( function() {
					settings.dimafter( returnedresponse, $.extend( {
						xml:    jqxhr,
						status: status,
						parsed: parsedresponse
					}, settings ) );
				} ).dequeue();
			}
		};

		$.ajax( settings );

		return false;
	},

	/**
	 * returns the background color of the passed element.
	 *
	 * @param {jquery|string} element element to check.
	 * @return {string} background color value in hex. default: '#ffffff'.
	 */
	getcolor: function( element ) {
		return $( element ).css( 'backgroundcolor' ) || '#ffffff';
	},

	/**
	 * adds something.
	 *
	 * @param {htmlelement} element  a dom element containing item data.
	 * @param {object}      settings settings for this list.
	 * @return {boolean} whether the item was added.
	 */
	add: function( element, settings ) {
		var $list    = $( this ),
			$element = $( element ),
			old      = false,
			position, reference;

		if ( 'string' === typeof settings ) {
			settings = { what: settings };
		}

		settings = $.extend( { position: 0, id: 0, oldid: null }, this.wplist.settings, settings );

		if ( ! $element.length || ! settings.what ) {
			return false;
		}

		if ( settings.oldid ) {
			old = $( '#' + settings.what + '-' + settings.oldid );
		}

		if ( settings.id && ( settings.id !== settings.oldid || ! old || ! old.length ) ) {
			$( '#' + settings.what + '-' + settings.id ).remove();
		}

		if ( old && old.length ) {
			old.before( $element );
			old.remove();

		} else if ( isnan( settings.position ) ) {
			position = 'after';

			if ( '-' === settings.position.substr( 0, 1 ) ) {
				settings.position = settings.position.substr( 1 );
				position = 'before';
			}

			reference = $list.find( '#' + settings.position );

			if ( 1 === reference.length ) {
				reference[position]( $element );
			} else {
				$list.append( $element );
			}

		} else if ( 'comment' !== settings.what || 0 === $( '#' + settings.element ).length ) {
			if ( settings.position < 0 ) {
				$list.prepend( $element );
			} else {
				$list.append( $element );
			}
		}

		if ( settings.alt ) {
			$element.toggleclass( settings.alt, ( $list.children( ':visible' ).index( $element[0] ) + settings.altoffset ) % 2 );
		}

		if ( 'none' !== settings.addcolor ) {
			$element.css( 'backgroundcolor', settings.addcolor ).animate( { backgroundcolor: wplist.getcolor( $element ) }, {
				complete: function() {
					$( this ).css( 'backgroundcolor', '' );
				}
			} );
		}

		// add event handlers.
		$list.each( function( index, list ) {
			list.wplist.process( $element );
		} );

		return $element;
	},

	/**
	 * clears all input fields within the element passed.
	 *
	 * @param {string} elementid id of the element to check, including leading #.
	 */
	clear: function( elementid ) {
		var list     = this,
			$element = $( elementid ),
			type, tagname;

		// bail if we're within the list.
		if ( list.wplist && $element.parents( '#' + list.id ).length ) {
			return;
		}

		// check each input field.
		$element.find( ':input' ).each( function( index, input ) {

			// bail if the form was marked to not to be cleared.
			if ( $( input ).parents( '.form-no-clear' ).length ) {
				return;
			}

			type    = input.type.tolowercase();
			tagname = input.tagname.tolowercase();

			if ( 'text' === type || 'password' === type || 'textarea' === tagname ) {
				input.value = '';

			} else if ( 'checkbox' === type || 'radio' === type ) {
				input.checked = false;

			} else if ( 'select' === tagname ) {
				input.selectedindex = null;
			}
		} );
	},

	/**
	 * registers event handlers to add, delete, and dim items.
	 *
	 * @param {string} elementid
	 */
	process: function( elementid ) {
		var list     = this,
			$element = $( elementid || document );

		$element.on( 'submit', 'form[data-wp-lists^="add:' + list.id + ':"]', function() {
			return list.wplist.add( this );
		} );

		$element.on( 'click', '[data-wp-lists^="add:' + list.id + ':"], input[data-wp-lists^="add:' + list.id + ':"]', function() {
			return list.wplist.add( this );
		} );

		$element.on( 'click', '[data-wp-lists^="delete:' + list.id + ':"]', function() {
			return list.wplist.del( this );
		} );

		$element.on( 'click', '[data-wp-lists^="dim:' + list.id + ':"]', function() {
			return list.wplist.dim( this );
		} );
	},

	/**
	 * updates list item background colors.
	 */
	recolor: function() {
		var list    = this,
			evenodd = [':even', ':odd'],
			items;

		// bail if there is no alternate class name specified.
		if ( ! list.wplist.settings.alt ) {
			return;
		}

		items = $( '.list-item:visible', list );

		if ( ! items.length ) {
			items = $( list ).children( ':visible' );
		}

		if ( list.wplist.settings.altoffset % 2 ) {
			evenodd.reverse();
		}

		items.filter( evenodd[0] ).addclass( list.wplist.settings.alt ).end();
		items.filter( evenodd[1] ).removeclass( list.wplist.settings.alt );
	},

	/**
	 * sets up `process()` and `recolor()` functions.
	 */
	init: function() {
		var $list = this;

		$list.wplist.process = function( element ) {
			$list.each( function() {
				this.wplist.process( element );
			} );
		};

		$list.wplist.recolor = function() {
			$list.each( function() {
				this.wplist.recolor();
			} );
		};
	}
};

/**
 * initializes wplist object.
 *
 * @param {object}           settings
 * @param {string}           settings.url         url for ajax calls. default: ajaxurl.
 * @param {string}           settings.type        the http method to use for ajax requests. default: 'post'.
 * @param {string}           settings.response    id of the element the parsed ajax response will be stored in.
 *                                                default: 'ajax-response'.
 *
 * @param {string}           settings.what        default: ''.
 * @param {string}           settings.alt         css class name for alternate styling. default: 'alternate'.
 * @param {number}           settings.altoffset   offset to start alternate styling from. default: 0.
 * @param {string}           settings.addcolor    hex code or 'none' to disable animation. default: '#ffff33'.
 * @param {string}           settings.delcolor    hex code or 'none' to disable animation. default: '#faafaa'.
 * @param {string}           settings.dimaddcolor hex code or 'none' to disable animation. default: '#ffff33'.
 * @param {string}           settings.dimdelcolor hex code or 'none' to disable animation. default: '#ff3333'.
 *
 * @param {wplist~confirm}   settings.confirm     callback that's run before a request is made. default: null.
 * @param {wplist~addbefore} settings.addbefore   callback that's run before an item gets added to the list.
 *                                                default: null.
 * @param {wplist~addafter}  settings.addafter    callback that's run after an item got added to the list.
 *                                                default: null.
 * @param {wplist~delbefore} settings.delbefore   callback that's run before an item gets deleted from the list.
 *                                                default: null.
 * @param {wplist~delafter}  settings.delafter    callback that's run after an item got deleted from the list.
 *                                                default: null.
 * @param {wplist~dimbefore} settings.dimbefore   callback that's run before an item gets dim'd. default: null.
 * @param {wplist~dimafter}  settings.dimafter    callback that's run after an item got dim'd. default: null.
 * @return {$.fn} wplist api function.
 */
$.fn.wplist = function( settings ) {
	this.each( function( index, list ) {
		list.wplist = {
			settings: $.extend( {}, wplist.settings, { what: wplist.parsedata( list, 'list' )[1] || '' }, settings )
		};

		$.each( functions, function( func, callback ) {
			list.wplist[func] = function( element, setting ) {
				return wplist[callback].call( list, element, setting );
			};
		} );
	} );

	wplist.init.call( this );
	this.wplist.process();

	return this;
};
} ) ( jquery );





