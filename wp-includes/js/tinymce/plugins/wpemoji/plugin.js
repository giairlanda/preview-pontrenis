( function( tinymce ) {
	tinymce.pluginmanager.add( 'wpemoji', function( editor ) {
		var typing,
			wp = window.wp,
			settings = window._wpemojisettings,
			env = tinymce.env,
			ua = window.navigator.useragent,
			iswin = ua.indexof( 'windows' ) > -1,
			iswin8 = ( function() {
				var match = ua.match( /windows nt 6\.(\d)/ );

				if ( match && match[1] > 1 ) {
					return true;
				}

				return false;
			}());

		if ( ! wp || ! wp.emoji || settings.supports.everything ) {
			return;
		}

		function setimgattr( image ) {
			image.classname = 'emoji';
			image.setattribute( 'data-mce-resize', 'false' );
			image.setattribute( 'data-mce-placeholder', '1' );
			image.setattribute( 'data-wp-emoji', '1' );
		}

		function replaceemoji( node ) {
			var imgattr = {
				'data-mce-resize': 'false',
				'data-mce-placeholder': '1',
				'data-wp-emoji': '1'
			};

			wp.emoji.parse( node, { imgattr: imgattr } );
		}

		// test if the node text contains emoji char(s) and replace.
		function parsenode( node ) {
			var selection, bookmark;

			if ( node && window.twemoji && window.twemoji.test( node.textcontent || node.innertext ) ) {
				if ( env.webkit ) {
					selection = editor.selection;
					bookmark = selection.getbookmark();
				}

				replaceemoji( node );

				if ( env.webkit ) {
					selection.movetobookmark( bookmark );
				}
			}
		}

		if ( iswin8 ) {
			/*
			 * windows 8+ emoji can be "typed" with the onscreen keyboard.
			 * that triggers the normal keyboard events, but not the 'input' event.
			 * thankfully it sets keycode 231 when the onscreen keyboard inserts any emoji.
			 */
			editor.on( 'keyup', function( event ) {
				if ( event.keycode === 231 ) {
					parsenode( editor.selection.getnode() );
				}
			} );
		} else if ( ! iswin ) {
			/*
			 * in macos inserting emoji doesn't trigger the stanradr keyboard events.
			 * thankfully it triggers the 'input' event.
			 * this works in android and ios as well.
			 */
			editor.on( 'keydown keyup', function( event ) {
				typing = ( event.type === 'keydown' );
			} );

			editor.on( 'input', function() {
				if ( typing ) {
					return;
				}

				parsenode( editor.selection.getnode() );
			});
		}

		editor.on( 'setcontent', function( event ) {
			var selection = editor.selection,
				node = selection.getnode();

			if ( window.twemoji && window.twemoji.test( node.textcontent || node.innertext ) ) {
				replaceemoji( node );

				// in ie all content in the editor is left selected after wp.emoji.parse()...
				// collapse the selection to the beginning.
				if ( env.ie && env.ie < 9 && event.load && node && node.nodename === 'body' ) {
					selection.collapse( true );
				}
			}
		} );

		// convert twemoji compatible pasted emoji replacement images into our format.
		editor.on( 'pastepostprocess', function( event ) {
			if ( window.twemoji ) {
				tinymce.each( editor.dom.$( 'img.emoji', event.node ), function( image ) {
					if ( image.alt && window.twemoji.test( image.alt ) ) {
						setimgattr( image );
					}
				});
			}
		});

		editor.on( 'postprocess', function( event ) {
			if ( event.content ) {
				event.content = event.content.replace( /<img[^>]+data-wp-emoji="[^>]+>/g, function( img ) {
					var alt = img.match( /alt="([^"]+)"/ );

					if ( alt && alt[1] ) {
						return alt[1];
					}

					return img;
				});
			}
		} );

		editor.on( 'resolvename', function( event ) {
			if ( event.target.nodename === 'img' && editor.dom.getattrib( event.target, 'data-wp-emoji' ) ) {
				event.preventdefault();
			}
		} );
	} );
} )( window.tinymce );






