/**
 * wp-emoji.js is used to replace emoji with images in browsers when the browser
 * doesn't support emoji natively.
 *
 * @output wp-includes/js/wp-emoji.js
 */

( function( window, settings ) {
	/**
	 * replaces emoji with images when browsers don't support emoji.
	 *
	 * @since 4.2.0
	 * @access private
	 *
	 * @class
	 *
	 * @see  twitter emoji library
	 * @link https://github.com/twitter/twemoji
	 *
	 * @return {object} the wpemoji parse and test functions.
	 */
	function wpemoji() {
		var mutationobserver = window.mutationobserver || window.webkitmutationobserver || window.mozmutationobserver,

		// compression and maintain local scope.
		document = window.document,

		// private.
		twemoji, timer,
		loaded = false,
		count = 0,
		ie11 = window.navigator.useragent.indexof( 'trident/7.0' ) > 0;

		/**
		 * detect if the browser supports svg.
		 *
		 * @since 4.6.0
		 * @private
		 *
		 * @see modernizr
		 * @link https://github.com/modernizr/modernizr/blob/master/feature-detects/svg/asimg.js
		 *
		 * @return {boolean} true if the browser supports svg, false if not.
		 */
		function browsersupportssvgasimage() {
			if ( !! document.implementation.hasfeature ) {
				return document.implementation.hasfeature( 'http://www.w3.org/tr/svg11/feature#image', '1.1' );
			}

			// document.implementation.hasfeature is deprecated. it can be presumed
			// if future browsers remove it, the browser will support svgs as images.
			return true;
		}

		/**
		 * runs when the document load event is fired, so we can do our first parse of
		 * the page.
		 *
		 * listens to all the dom mutations and checks for added nodes that contain
		 * emoji characters and replaces those with twitter emoji images.
		 *
		 * @since 4.2.0
		 * @private
		 */
		function load() {
			if ( loaded ) {
				return;
			}

			// ensure twemoji is available on the global window before proceeding.
			if ( typeof window.twemoji === 'undefined' ) {
				// break if waiting for longer than 30 seconds.
				if ( count > 600 ) {
					return;
				}

				// still waiting.
				window.cleartimeout( timer );
				timer = window.settimeout( load, 50 );
				count++;

				return;
			}

			twemoji = window.twemoji;
			loaded = true;

			// initialize the mutation observer, which checks all added nodes for
			// replaceable emoji characters.
			if ( mutationobserver ) {
				new mutationobserver( function( mutationrecords ) {
					var i = mutationrecords.length,
						addednodes, removednodes, ii, node;

					while ( i-- ) {
						addednodes = mutationrecords[ i ].addednodes;
						removednodes = mutationrecords[ i ].removednodes;
						ii = addednodes.length;

						/*
						 * checks if an image has been replaced by a text element
						 * with the same text as the alternate description of the replaced image.
						 * (presumably because the image could not be loaded).
						 * if it is, do absolutely nothing.
						 *
						 * node type 3 is a text_node.
						 *
						 * @link https://developer.mozilla.org/en-us/docs/web/api/node/nodetype
						 */
						if (
							ii === 1 && removednodes.length === 1 &&
							addednodes[0].nodetype === 3 &&
							removednodes[0].nodename === 'img' &&
							addednodes[0].data === removednodes[0].alt &&
							'load-failed' === removednodes[0].getattribute( 'data-error' )
						) {
							return;
						}

						// loop through all the added nodes.
						while ( ii-- ) {
							node = addednodes[ ii ];

							// node type 3 is a text_node.
							if ( node.nodetype === 3 ) {
								if ( ! node.parentnode ) {
									continue;
								}

								if ( ie11 ) {
									/*
									 * ie 11's implementation of mutationobserver is buggy.
									 * it unnecessarily splits text nodes when it encounters a html
									 * template interpolation symbol ( "{{", for example ). so, we
									 * join the text nodes back together as a work-around.
									 *
									 * node type 3 is a text_node.
									 */
									while( node.nextsibling && 3 === node.nextsibling.nodetype ) {
										node.nodevalue = node.nodevalue + node.nextsibling.nodevalue;
										node.parentnode.removechild( node.nextsibling );
									}
								}

								node = node.parentnode;
							}

							if ( test( node.textcontent ) ) {
								parse( node );
							}
						}
					}
				} ).observe( document.body, {
					childlist: true,
					subtree: true
				} );
			}

			parse( document.body );
		}

		/**
		 * tests if a text string contains emoji characters.
		 *
		 * @since 4.3.0
		 *
		 * @memberof wp.emoji
		 *
		 * @param {string} text the string to test.
		 *
		 * @return {boolean} whether the string contains emoji characters.
		 */
		function test( text ) {
			// single char. u+20e3 to detect keycaps. u+00a9 "copyright sign" and u+00ae "registered sign" not included.
			var single = /[\u203c\u2049\u20e3\u2122\u2139\u2194-\u2199\u21a9\u21aa\u2300\u231a\u231b\u2328\u2388\u23cf\u23e9-\u23f3\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u261d\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638\u2639\u263a\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692\u2693\u2694\u2696\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26ce\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f7-\u26fa\u26fd\u2702\u2705\u2708-\u270d\u270f\u2712\u2714\u2716\u271d\u2721\u2728\u2733\u2734\u2744\u2747\u274c\u274e\u2753\u2754\u2755\u2757\u2763\u2764\u2795\u2796\u2797\u27a1\u27b0\u27bf\u2934\u2935\u2b05\u2b06\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299]/,
			// surrogate pair range. only tests for the second half.
			pair = /[\udc00-\udfff]/;

			if ( text ) {
				return  pair.test( text ) || single.test( text );
			}

			return false;
		}

		/**
		 * parses any emoji characters into twemoji images.
		 *
		 * - when passed an element the emoji characters are replaced inline.
		 * - when passed a string the emoji characters are replaced and the result is
		 *   returned.
		 *
		 * @since 4.2.0
		 *
		 * @memberof wp.emoji
		 *
		 * @param {htmlelement|string} object the element or string to parse.
		 * @param {object}             args   additional options for twemoji.
		 *
		 * @return {htmlelement|string} a string where all emoji are now image tags of
		 *                              emoji. or the element that was passed as the first argument.
		 */
		function parse( object, args ) {
			var params;

			/*
			 * if the browser has full support, twemoji is not loaded or our
			 * object is not what was expected, we do not parse anything.
			 */
			if ( settings.supports.everything || ! twemoji || ! object ||
				( 'string' !== typeof object && ( ! object.childnodes || ! object.childnodes.length ) ) ) {

				return object;
			}

			// compose the params for the twitter emoji library.
			args = args || {};
			params = {
				base: browsersupportssvgasimage() ? settings.svgurl : settings.baseurl,
				ext:  browsersupportssvgasimage() ? settings.svgext : settings.ext,
				classname: args.classname || 'emoji',
				callback: function( icon, options ) {
					// ignore some standard characters that tinymce recommends in its character map.
					switch ( icon ) {
						case 'a9':
						case 'ae':
						case '2122':
						case '2194':
						case '2660':
						case '2663':
						case '2665':
						case '2666':
							return false;
					}

					if ( settings.supports.everythingexceptflag &&
						! /^1f1(?:e[6-9a-f]|f[0-9a-f])-1f1(?:e[6-9a-f]|f[0-9a-f])$/.test( icon ) && // country flags.
						! /^(1f3f3-fe0f-200d-1f308|1f3f4-200d-2620-fe0f)$/.test( icon )             // rainbow and pirate flags.
					) {
						return false;
					}

					return ''.concat( options.base, icon, options.ext );
				},
				attributes: function() {
					return {
						role: 'img'
					};
				},
				onerror: function() {
					if ( twemoji.parentnode ) {
						this.setattribute( 'data-error', 'load-failed' );
						twemoji.parentnode.replacechild( document.createtextnode( twemoji.alt ), twemoji );
					}
				},
				donotparse: function( node ) {
					if (
						node &&
						node.classname &&
						typeof node.classname === 'string' &&
						node.classname.indexof( 'wp-exclude-emoji' ) !== -1
					) {
						// do not parse this node. emojis will not be replaced in this node and all sub-nodes.
						return true;
					}

					return false;
				}
			};

			if ( typeof args.imgattr === 'object' ) {
				params.attributes = function() {
					return args.imgattr;
				};
			}

			return twemoji.parse( object, params );
		}

		load();

		return {
			parse: parse,
			test: test
		};
	}

	window.wp = window.wp || {};

	/**
	 * @namespace wp.emoji
	 */
	window.wp.emoji = new wpemoji();

} )( window, window._wpemojisettings );


