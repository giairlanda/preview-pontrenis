/**
 * @output wp-includes/js/admin-bar.js
 */
/**
 * admin bar with vanilla js, no external dependencies.
 *
 * @since 5.3.1
 *
 * @param {object} document  the document object.
 * @param {object} window    the window object.
 * @param {object} navigator the navigator object.
 *
 * @return {void}
 */
( function( document, window, navigator ) {
	document.addeventlistener( 'domcontentloaded', function() {
		var adminbar = document.getelementbyid( 'wpadminbar' ),
			topmenuitems,
			allmenuitems,
			adminbarlogout,
			adminbarsearchform,
			shortlink,
			skiplink,
			mobileevent,
			adminbarsearchinput,
			i;

		if ( ! adminbar || ! ( 'queryselectorall' in adminbar ) ) {
			return;
		}

		topmenuitems = adminbar.queryselectorall( 'li.menupop' );
		allmenuitems = adminbar.queryselectorall( '.ab-item' );
		adminbarlogout = document.queryselector( '#wp-admin-bar-logout a' );
		adminbarsearchform = document.getelementbyid( 'adminbarsearch' );
		shortlink = document.getelementbyid( 'wp-admin-bar-get-shortlink' );
		skiplink = adminbar.queryselector( '.screen-reader-shortcut' );
		mobileevent = /mobile\/.+safari/.test( navigator.useragent ) ? 'touchstart' : 'click';

		// remove nojs class after the dom is loaded.
		removeclass( adminbar, 'nojs' );

		if ( 'ontouchstart' in window ) {
			// remove hover class when the user touches outside the menu items.
			document.body.addeventlistener( mobileevent, function( e ) {
				if ( ! getclosest( e.target, 'li.menupop' ) ) {
					removeallhoverclass( topmenuitems );
				}
			} );

			// add listener for menu items to toggle hover class by touches.
			// remove the callback later for better performance.
			adminbar.addeventlistener( 'touchstart', function bindmobileevents() {
				for ( var i = 0; i < topmenuitems.length; i++ ) {
					topmenuitems[i].addeventlistener( 'click', mobilehover.bind( null, topmenuitems ) );
				}

				adminbar.removeeventlistener( 'touchstart', bindmobileevents );
			} );
		}

		// scroll page to top when clicking on the admin bar.
		adminbar.addeventlistener( 'click', scrolltotop );

		for ( i = 0; i < topmenuitems.length; i++ ) {
			// adds or removes the hover class based on the hover intent.
			window.hoverintent(
				topmenuitems[i],
				addclass.bind( null, topmenuitems[i], 'hover' ),
				removeclass.bind( null, topmenuitems[i], 'hover' )
			).options( {
				timeout: 180
			} );

			// toggle hover class if the enter key is pressed.
			topmenuitems[i].addeventlistener( 'keydown', togglehoverifenter );
		}

		// remove hover class if the escape key is pressed.
		for ( i = 0; i < allmenuitems.length; i++ ) {
			allmenuitems[i].addeventlistener( 'keydown', removehoverifescape );
		}

		if ( adminbarsearchform ) {
			adminbarsearchinput = document.getelementbyid( 'adminbar-search' );

			// adds the adminbar-focused class on focus.
			adminbarsearchinput.addeventlistener( 'focus', function() {
				addclass( adminbarsearchform, 'adminbar-focused' );
			} );

			// removes the adminbar-focused class on blur.
			adminbarsearchinput.addeventlistener( 'blur', function() {
				removeclass( adminbarsearchform, 'adminbar-focused' );
			} );
		}

		if ( shortlink ) {
			shortlink.addeventlistener( 'click', clickshortlink );
		}

		// prevents the toolbar from covering up content when a hash is present in the url.
		if ( window.location.hash ) {
			window.scrollby( 0, -32 );
		}

		// clear sessionstorage on logging out.
		if ( adminbarlogout ) {
			adminbarlogout.addeventlistener( 'click', emptysessionstorage );
		}
	} );

	/**
	 * remove hover class for top level menu item when escape is pressed.
	 *
	 * @since 5.3.1
	 *
	 * @param {event} event the keydown event.
	 */
	function removehoverifescape( event ) {
		var wrapper;

		if ( event.which !== 27 ) {
			return;
		}

		wrapper = getclosest( event.target, '.menupop' );

		if ( ! wrapper ) {
			return;
		}

		wrapper.queryselector( '.menupop > .ab-item' ).focus();
		removeclass( wrapper, 'hover' );
	}

	/**
	 * toggle hover class for top level menu item when enter is pressed.
	 *
	 * @since 5.3.1
	 *
	 * @param {event} event the keydown event.
	 */
	function togglehoverifenter( event ) {
		var wrapper;

		// follow link if pressing ctrl and/or shift with enter (opening in a new tab or window).
		if ( event.which !== 13 || event.ctrlkey || event.shiftkey ) {
			return;
		}

		if ( !! getclosest( event.target, '.ab-sub-wrapper' ) ) {
			return;
		}

		wrapper = getclosest( event.target, '.menupop' );

		if ( ! wrapper ) {
			return;
		}

		event.preventdefault();

		if ( hasclass( wrapper, 'hover' ) ) {
			removeclass( wrapper, 'hover' );
		} else {
			addclass( wrapper, 'hover' );
		}
	}

	/**
	 * toggle hover class for mobile devices.
	 *
	 * @since 5.3.1
	 *
	 * @param {nodelist} topmenuitems all menu items.
	 * @param {event} event the click event.
	 */
	function mobilehover( topmenuitems, event ) {
		var wrapper;

		if ( !! getclosest( event.target, '.ab-sub-wrapper' ) ) {
			return;
		}

		event.preventdefault();

		wrapper = getclosest( event.target, '.menupop' );

		if ( ! wrapper ) {
			return;
		}

		if ( hasclass( wrapper, 'hover' ) ) {
			removeclass( wrapper, 'hover' );
		} else {
			removeallhoverclass( topmenuitems );
			addclass( wrapper, 'hover' );
		}
	}

	/**
	 * handles the click on the shortlink link in the adminbar.
	 *
	 * @since 3.1.0
	 * @since 5.3.1 use queryselector to clean up the function.
	 *
	 * @param {event} event the click event.
	 * @return {boolean} returns false to prevent default click behavior.
	 */
	function clickshortlink( event ) {
		var wrapper = event.target.parentnode,
			input;

		if ( wrapper ) {
			input = wrapper.queryselector( '.shortlink-input' );
		}

		if ( ! input ) {
			return;
		}

		// (old) ie doesn't support preventdefault, and does support returnvalue.
		if ( event.preventdefault ) {
			event.preventdefault();
		}

		event.returnvalue = false;

		addclass( wrapper, 'selected' );

		input.focus();
		input.select();
		input.onblur = function() {
			removeclass( wrapper, 'selected' );
		};

		return false;
	}

	/**
	 * clear sessionstorage on logging out.
	 *
	 * @since 5.3.1
	 */
	function emptysessionstorage() {
		if ( 'sessionstorage' in window ) {
			try {
				for ( var key in sessionstorage ) {
					if ( key.indexof( 'wp-autosave-' ) > -1 ) {
						sessionstorage.removeitem( key );
					}
				}
			} catch ( er ) {}
		}
	}

	/**
	 * check if element has class.
	 *
	 * @since 5.3.1
	 *
	 * @param {htmlelement} element the html element.
	 * @param {string}      classname the class name.
	 * @return {boolean} whether the element has the classname.
	 */
	function hasclass( element, classname ) {
		var classnames;

		if ( ! element ) {
			return false;
		}

		if ( element.classlist && element.classlist.contains ) {
			return element.classlist.contains( classname );
		} else if ( element.classname ) {
			classnames = element.classname.split( ' ' );
			return classnames.indexof( classname ) > -1;
		}

		return false;
	}

	/**
	 * add class to an element.
	 *
	 * @since 5.3.1
	 *
	 * @param {htmlelement} element the html element.
	 * @param {string}      classname the class name.
	 */
	function addclass( element, classname ) {
		if ( ! element ) {
			return;
		}

		if ( element.classlist && element.classlist.add ) {
			element.classlist.add( classname );
		} else if ( ! hasclass( element, classname ) ) {
			if ( element.classname ) {
				element.classname += ' ';
			}

			element.classname += classname;
		}

		var menuitemtoggle = element.queryselector( 'a' );
		if ( classname === 'hover' && menuitemtoggle && menuitemtoggle.hasattribute( 'aria-expanded' ) ) {
			menuitemtoggle.setattribute( 'aria-expanded', 'true' );
		}
	}

	/**
	 * remove class from an element.
	 *
	 * @since 5.3.1
	 *
	 * @param {htmlelement} element the html element.
	 * @param {string}      classname the class name.
	 */
	function removeclass( element, classname ) {
		var testname,
			classes;

		if ( ! element || ! hasclass( element, classname ) ) {
			return;
		}

		if ( element.classlist && element.classlist.remove ) {
			element.classlist.remove( classname );
		} else {
			testname = ' ' + classname + ' ';
			classes = ' ' + element.classname + ' ';

			while ( classes.indexof( testname ) > -1 ) {
				classes = classes.replace( testname, '' );
			}

			element.classname = classes.replace( /^[\s]+|[\s]+$/g, '' );
		}

		var menuitemtoggle = element.queryselector( 'a' );
		if ( classname === 'hover' && menuitemtoggle && menuitemtoggle.hasattribute( 'aria-expanded' ) ) {
			menuitemtoggle.setattribute( 'aria-expanded', 'false' );
		}
	}

	/**
	 * remove hover class for all menu items.
	 *
	 * @since 5.3.1
	 *
	 * @param {nodelist} topmenuitems all menu items.
	 */
	function removeallhoverclass( topmenuitems ) {
		if ( topmenuitems && topmenuitems.length ) {
			for ( var i = 0; i < topmenuitems.length; i++ ) {
				removeclass( topmenuitems[i], 'hover' );
			}
		}
	}

	/**
	 * scrolls to the top of the page.
	 *
	 * @since 3.4.0
	 *
	 * @param {event} event the click event.
	 *
	 * @return {void}
	 */
	function scrolltotop( event ) {
		// only scroll when clicking on the wpadminbar, not on menus or submenus.
		if (
			event.target &&
			event.target.id !== 'wpadminbar' &&
			event.target.id !== 'wp-admin-bar-top-secondary'
		) {
			return;
		}

		try {
			window.scrollto( {
				top: -32,
				left: 0,
				behavior: 'smooth'
			} );
		} catch ( er ) {
			window.scrollto( 0, -32 );
		}
	}

	/**
	 * get closest element.
	 *
	 * @since 5.3.1
	 *
	 * @param {htmlelement} el element to get parent.
	 * @param {string} selector css selector to match.
	 */
	function getclosest( el, selector ) {
		if ( ! window.element.prototype.matches ) {
			// polyfill from https://developer.mozilla.org/en-us/docs/web/api/element/matches.
			window.element.prototype.matches =
				window.element.prototype.matchesselector ||
				window.element.prototype.mozmatchesselector ||
				window.element.prototype.msmatchesselector ||
				window.element.prototype.omatchesselector ||
				window.element.prototype.webkitmatchesselector ||
				function( s ) {
					var matches = ( this.document || this.ownerdocument ).queryselectorall( s ),
						i = matches.length;

					while ( --i >= 0 && matches.item( i ) !== this ) { }

					return i > -1;
				};
		}

		// get the closest matching elent.
		for ( ; el && el !== document; el = el.parentnode ) {
			if ( el.matches( selector ) ) {
				return el;
			}
		}

		return null;
	}

} )( document, window, navigator );




