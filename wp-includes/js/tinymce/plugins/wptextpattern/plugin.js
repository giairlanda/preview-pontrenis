/**
 * text pattern plugin for tinymce
 *
 * @since 4.3.0
 *
 * this plugin can automatically format text patterns as you type. it includes several groups of patterns.
 *
 * start of line patterns:
 *  as-you-type:
 *  - unordered list (`* ` and `- `).
 *  - ordered list (`1. ` and `1) `).
 *
 *  on enter:
 *  - h2 (## ).
 *  - h3 (### ).
 *  - h4 (#### ).
 *  - h5 (##### ).
 *  - h6 (###### ).
 *  - blockquote (> ).
 *  - hr (---).
 *
 * inline patterns:
 *  - <code> (`) (backtick).
 *
 * if the transformation in unwanted, the user can undo the change by pressing backspace,
 * using the undo shortcut, or the undo button in the toolbar.
 *
 * setting for the patterns can be overridden by plugins by using the `tiny_mce_before_init` php filter.
 * the setting name is `wptextpattern` and the value is an object containing override arrays for each
 * patterns group. there are three groups: "space", "enter", and "inline". example (php):
 *
 * add_filter( 'tiny_mce_before_init', 'my_mce_init_wptextpattern' );
 * function my_mce_init_wptextpattern( $init ) {
 *   $init['wptextpattern'] = wp_json_encode( array(
 *      'inline' => array(
 *        array( 'delimiter' => '**', 'format' => 'bold' ),
 *        array( 'delimiter' => '__', 'format' => 'italic' ),
 *      ),
 *   ) );
 *
 *   return $init;
 * }
 *
 * note that setting this will override the default text patterns. you will need to include them
 * in your settings array if you want to keep them working.
 */
( function( tinymce, settimeout ) {
	if ( tinymce.env.ie && tinymce.env.ie < 9 ) {
		return;
	}

	/**
	 * escapes characters for use in a regular expression.
	 *
	 * @param {string} string characters to escape
	 *
	 * @return {string} escaped characters
	 */
	function escaperegexp( string ) {
		return string.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
	}

	tinymce.pluginmanager.add( 'wptextpattern', function( editor ) {
		var vk = tinymce.util.vk;
		var settings = editor.settings.wptextpattern || {};

		var spacepatterns = settings.space || [
			{ regexp: /^[*-]\s/, cmd: 'insertunorderedlist' },
			{ regexp: /^1[.)]\s/, cmd: 'insertorderedlist' }
		];

		var enterpatterns = settings.enter || [
			{ start: '##', format: 'h2' },
			{ start: '###', format: 'h3' },
			{ start: '####', format: 'h4' },
			{ start: '#####', format: 'h5' },
			{ start: '######', format: 'h6' },
			{ start: '>', format: 'blockquote' },
			{ regexp: /^(-){3,}$/, element: 'hr' }
		];

		var inlinepatterns = settings.inline || [
			{ delimiter: '`', format: 'code' }
		];

		var canundo;

		editor.on( 'selectionchange', function() {
			canundo = null;
		} );

		editor.on( 'keydown', function( event ) {
			if ( ( canundo && event.keycode === 27 /* escape */ ) || ( canundo === 'space' && event.keycode === vk.backspace ) ) {
				editor.undomanager.undo();
				event.preventdefault();
				event.stopimmediatepropagation();
			}

			if ( vk.metakeypressed( event ) ) {
				return;
			}

			if ( event.keycode === vk.enter ) {
				enter();
			// wait for the browser to insert the character.
			} else if ( event.keycode === vk.spacebar ) {
				settimeout( space );
			} else if ( event.keycode > 47 && ! ( event.keycode >= 91 && event.keycode <= 93 ) ) {
				settimeout( inline );
			}
		}, true );

		function inline() {
			var rng = editor.selection.getrng();
			var node = rng.startcontainer;
			var offset = rng.startoffset;
			var startoffset;
			var endoffset;
			var pattern;
			var format;
			var zero;

			// we need a non-empty text node with an offset greater than zero.
			if ( ! node || node.nodetype !== 3 || ! node.data.length || ! offset ) {
				return;
			}

			var string = node.data.slice( 0, offset );
			var lastchar = node.data.charat( offset - 1 );

			tinymce.each( inlinepatterns, function( p ) {
				// character before selection should be delimiter.
				if ( lastchar !== p.delimiter.slice( -1 ) ) {
					return;
				}

				var escdelimiter = escaperegexp( p.delimiter );
				var delimiterfirstchar = p.delimiter.charat( 0 );
				var regexp = new regexp( '(.*)' + escdelimiter + '.+' + escdelimiter + '$' );
				var match = string.match( regexp );

				if ( ! match ) {
					return;
				}

				startoffset = match[1].length;
				endoffset = offset - p.delimiter.length;

				var before = string.charat( startoffset - 1 );
				var after = string.charat( startoffset + p.delimiter.length );

				// test*test*  => format applied.
				// test *test* => applied.
				// test* test* => not applied.
				if ( startoffset && /\s/.test( before ) ) {
					if ( /\s/.test( after ) || before === delimiterfirstchar ) {
						return;
					}
				}

				// do not replace when only whitespace and delimiter characters.
				if ( ( new regexp( '^[\\s' + escaperegexp( delimiterfirstchar ) + ']+$' ) ).test( string.slice( startoffset, endoffset ) ) ) {
					return;
				}

				pattern = p;

				return false;
			} );

			if ( ! pattern ) {
				return;
			}

			format = editor.formatter.get( pattern.format );

			if ( format && format[0].inline ) {
				editor.undomanager.add();

				editor.undomanager.transact( function() {
					node.insertdata( offset, '\ufeff' );

					node = node.splittext( startoffset );
					zero = node.splittext( offset - startoffset );

					node.deletedata( 0, pattern.delimiter.length );
					node.deletedata( node.data.length - pattern.delimiter.length, pattern.delimiter.length );

					editor.formatter.apply( pattern.format, {}, node );

					editor.selection.setcursorlocation( zero, 1 );
				} );

				// we need to wait for native events to be triggered.
				settimeout( function() {
					canundo = 'space';

					editor.once( 'selectionchange', function() {
						var offset;

						if ( zero ) {
							offset = zero.data.indexof( '\ufeff' );

							if ( offset !== -1 ) {
								zero.deletedata( offset, offset + 1 );
							}
						}
					} );
				} );
			}
		}

		function firsttextnode( node ) {
			var parent = editor.dom.getparent( node, 'p' ),
				child;

			if ( ! parent ) {
				return;
			}

			while ( child = parent.firstchild ) {
				if ( child.nodetype !== 3 ) {
					parent = child;
				} else {
					break;
				}
			}

			if ( ! child ) {
				return;
			}

			if ( ! child.data ) {
				if ( child.nextsibling && child.nextsibling.nodetype === 3 ) {
					child = child.nextsibling;
				} else {
					child = null;
				}
			}

			return child;
		}

		function space() {
			var rng = editor.selection.getrng(),
				node = rng.startcontainer,
				parent,
				text;

			if ( ! node || firsttextnode( node ) !== node ) {
				return;
			}

			parent = node.parentnode;
			text = node.data;

			tinymce.each( spacepatterns, function( pattern ) {
				var match = text.match( pattern.regexp );

				if ( ! match || rng.startoffset !== match[0].length ) {
					return;
				}

				editor.undomanager.add();

				editor.undomanager.transact( function() {
					node.deletedata( 0, match[0].length );

					if ( ! parent.innerhtml ) {
						parent.appendchild( document.createelement( 'br' ) );
					}

					editor.selection.setcursorlocation( parent );
					editor.execcommand( pattern.cmd );
				} );

				// we need to wait for native events to be triggered.
				settimeout( function() {
					canundo = 'space';
				} );

				return false;
			} );
		}

		function enter() {
			var rng = editor.selection.getrng(),
				start = rng.startcontainer,
				node = firsttextnode( start ),
				i = enterpatterns.length,
				text, pattern, parent;

			if ( ! node ) {
				return;
			}

			text = node.data;

			while ( i-- ) {
				if ( enterpatterns[ i ].start ) {
					if ( text.indexof( enterpatterns[ i ].start ) === 0 ) {
						pattern = enterpatterns[ i ];
						break;
					}
				} else if ( enterpatterns[ i ].regexp ) {
					if ( enterpatterns[ i ].regexp.test( text ) ) {
						pattern = enterpatterns[ i ];
						break;
					}
				}
			}

			if ( ! pattern ) {
				return;
			}

			if ( node === start && tinymce.trim( text ) === pattern.start ) {
				return;
			}

			editor.once( 'keyup', function() {
				editor.undomanager.add();

				editor.undomanager.transact( function() {
					if ( pattern.format ) {
						editor.formatter.apply( pattern.format, {}, node );
						node.replacedata( 0, node.data.length, ltrim( node.data.slice( pattern.start.length ) ) );
					} else if ( pattern.element ) {
						parent = node.parentnode && node.parentnode.parentnode;

						if ( parent ) {
							parent.replacechild( document.createelement( pattern.element ), node.parentnode );
						}
					}
				} );

				// we need to wait for native events to be triggered.
				settimeout( function() {
					canundo = 'enter';
				} );
			} );
		}

		function ltrim( text ) {
			return text ? text.replace( /^\s+/, '' ) : '';
		}
	} );
} )( window.tinymce, window.settimeout );




