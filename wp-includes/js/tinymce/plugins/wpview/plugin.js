/**
 * wordpress view plugin.
 */
( function( tinymce ) {
	tinymce.pluginmanager.add( 'wpview', function( editor ) {
		function noop () {}

		// set this here as wp-tinymce.js may be loaded too early.
		var wp = window.wp;

		if ( ! wp || ! wp.mce || ! wp.mce.views ) {
			return {
				getview: noop
			};
		}

		// check if a node is a view or not.
		function isview( node ) {
			return editor.dom.hasclass( node, 'wpview' );
		}

		// replace view tags with their text.
		function resetviews( content ) {
			function callback( match, $1 ) {
				return '<p>' + window.decodeuricomponent( $1 ) + '</p>';
			}

			if ( ! content || content.indexof( ' data-wpview-' ) === -1 ) {
				return content;
			}

			return content
				.replace( /<div[^>]+data-wpview-text="([^"]+)"[^>]*>(?:\.|[\s\s]+?wpview-end[^>]+>\s*<\/span>\s*)?<\/div>/g, callback )
				.replace( /<p[^>]+data-wpview-marker="([^"]+)"[^>]*>[\s\s]*?<\/p>/g, callback );
		}

		editor.on( 'init', function() {
			var mutationobserver = window.mutationobserver || window.webkitmutationobserver;

			if ( mutationobserver ) {
				new mutationobserver( function() {
					editor.fire( 'wp-body-class-change' );
				} )
				.observe( editor.getbody(), {
					attributes: true,
					attributefilter: ['class']
				} );
			}

			// pass on body class name changes from the editor to the wpview iframes.
			editor.on( 'wp-body-class-change', function() {
				var classname = editor.getbody().classname;

				editor.$( 'iframe[class="wpview-sandbox"]' ).each( function( i, iframe ) {
					// make sure it is a local iframe.
					// jshint scripturl: true
					if ( ! iframe.src || iframe.src === 'javascript:""' ) {
						try {
							iframe.contentwindow.document.body.classname = classname;
						} catch( er ) {}
					}
				});
			} );
		});

		// scan new content for matching view patterns and replace them with markers.
		editor.on( 'beforesetcontent', function( event ) {
			var node;

			if ( ! event.selection ) {
				wp.mce.views.unbind();
			}

			if ( ! event.content ) {
				return;
			}

			if ( ! event.load ) {
				node = editor.selection.getnode();

				if ( node && node !== editor.getbody() && /^\s*https?:\/\/\s+\s*$/i.test( event.content ) ) {
					// when a url is pasted or inserted, only try to embed it when it is in an empty paragraph.
					node = editor.dom.getparent( node, 'p' );

					if ( node && /^[\s\ufeff\u00a0]*$/.test( editor.$( node ).text() || '' ) ) {
						// make sure there are no empty inline elements in the <p>.
						node.innerhtml = '';
					} else {
						return;
					}
				}
			}

			event.content = wp.mce.views.setmarkers( event.content, editor );
		} );

		// replace any new markers nodes with views.
		editor.on( 'setcontent', function() {
			wp.mce.views.render();
		} );

		// empty view nodes for easier processing.
		editor.on( 'preprocess hide', function( event ) {
			editor.$( 'div[data-wpview-text], p[data-wpview-marker]', event.node ).each( function( i, node ) {
				node.innerhtml = '.';
			} );
		}, true );

		// replace views with their text.
		editor.on( 'postprocess', function( event ) {
			event.content = resetviews( event.content );
		} );

		// prevent adding of undo levels when replacing wpview markers
		// or when there are changes only in the (non-editable) previews.
		editor.on( 'beforeaddundo', function( event ) {
			var lastcontent;
			var newcontent = event.level.content || ( event.level.fragments && event.level.fragments.join( '' ) );

			if ( ! event.lastlevel ) {
				lastcontent = editor.startcontent;
			} else {
				lastcontent = event.lastlevel.content || ( event.lastlevel.fragments && event.lastlevel.fragments.join( '' ) );
			}

			if (
				! newcontent ||
				! lastcontent ||
				newcontent.indexof( ' data-wpview-' ) === -1 ||
				lastcontent.indexof( ' data-wpview-' ) === -1
			) {
				return;
			}

			if ( resetviews( lastcontent ) === resetviews( newcontent ) ) {
				event.preventdefault();
			}
		} );

		// make sure views are copied as their text.
		editor.on( 'drop objectselected', function( event ) {
			if ( isview( event.targetclone ) ) {
				event.targetclone = editor.getdoc().createtextnode(
					window.decodeuricomponent( editor.dom.getattrib( event.targetclone, 'data-wpview-text' ) )
				);
			}
		} );

		// clean up urls for easier processing.
		editor.on( 'pastepreprocess', function( event ) {
			var content = event.content;

			if ( content ) {
				content = tinymce.trim( content.replace( /<[^>]+>/g, '' ) );

				if ( /^https?:\/\/\s+$/i.test( content ) ) {
					event.content = content;
				}
			}
		} );

		// show the view type in the element path.
		editor.on( 'resolvename', function( event ) {
			if ( isview( event.target ) ) {
				event.name = editor.dom.getattrib( event.target, 'data-wpview-type' ) || 'object';
			}
		} );

		// see `media` plugin.
		editor.on( 'click keyup', function() {
			var node = editor.selection.getnode();

			if ( isview( node ) ) {
				if ( editor.dom.getattrib( node, 'data-mce-selected' ) ) {
					node.setattribute( 'data-mce-selected', '2' );
				}
			}
		} );

		editor.addbutton( 'wp_view_edit', {
			tooltip: 'edit|button', // '|button' is not displayed, only used for context.
			icon: 'dashicon dashicons-edit',
			onclick: function() {
				var node = editor.selection.getnode();

				if ( isview( node ) ) {
					wp.mce.views.edit( editor, node );
				}
			}
		} );

		editor.addbutton( 'wp_view_remove', {
			tooltip: 'remove',
			icon: 'dashicon dashicons-no',
			onclick: function() {
				editor.fire( 'cut' );
			}
		} );

		editor.once( 'preinit', function() {
			var toolbar;

			if ( editor.wp && editor.wp._createtoolbar ) {
				toolbar = editor.wp._createtoolbar( [
					'wp_view_edit',
					'wp_view_remove'
				] );

				editor.on( 'wptoolbar', function( event ) {
					if ( ! event.collapsed && isview( event.element ) ) {
						event.toolbar = toolbar;
					}
				} );
			}
		} );

		editor.wp = editor.wp || {};
		editor.wp.getview = noop;
		editor.wp.setviewcursor = noop;

		return {
			getview: noop
		};
	} );
} )( window.tinymce );







