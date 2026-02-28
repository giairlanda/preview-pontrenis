/* global tinymce */
tinymce.pluginmanager.add('wpgallery', function( editor ) {

	function replacegalleryshortcodes( content ) {
		return content.replace( /\[gallery([^\]]*)\]/g, function( match ) {
			return html( 'wp-gallery', match );
		});
	}

	function html( cls, data ) {
		data = window.encodeuricomponent( data );
		return '<img src="' + tinymce.env.transparentsrc + '" class="wp-media mceitem ' + cls + '" ' +
			'data-wp-media="' + data + '" data-mce-resize="false" data-mce-placeholder="1" alt="" />';
	}

	function restoremediashortcodes( content ) {
		function getattr( str, name ) {
			name = new regexp( name + '=\"([^\"]+)\"' ).exec( str );
			return name ? window.decodeuricomponent( name[1] ) : '';
		}

		return content.replace( /(?:<p(?: [^>]+)?>)*(<img [^>]+>)(?:<\/p>)*/g, function( match, image ) {
			var data = getattr( image, 'data-wp-media' );

			if ( data ) {
				return '<p>' + data + '</p>';
			}

			return match;
		});
	}

	function editmedia( node ) {
		var gallery, frame, data;

		if ( node.nodename !== 'img' ) {
			return;
		}

		// check if the `wp.media` api exists.
		if ( typeof wp === 'undefined' || ! wp.media ) {
			return;
		}

		data = window.decodeuricomponent( editor.dom.getattrib( node, 'data-wp-media' ) );

		// make sure we've selected a gallery node.
		if ( editor.dom.hasclass( node, 'wp-gallery' ) && wp.media.gallery ) {
			gallery = wp.media.gallery;
			frame = gallery.edit( data );

			frame.state('gallery-edit').on( 'update', function( selection ) {
				var shortcode = gallery.shortcode( selection ).string();
				editor.dom.setattrib( node, 'data-wp-media', window.encodeuricomponent( shortcode ) );
				frame.detach();
			});
		}
	}

	// register the command so that it can be invoked by using tinymce.activeeditor.execcommand('...').
	editor.addcommand( 'wp_gallery', function() {
		editmedia( editor.selection.getnode() );
	});

	editor.on( 'mouseup', function( event ) {
		var dom = editor.dom,
			node = event.target;

		function unselect() {
			dom.removeclass( dom.select( 'img.wp-media-selected' ), 'wp-media-selected' );
		}

		if ( node.nodename === 'img' && dom.getattrib( node, 'data-wp-media' ) ) {
			// don't trigger on right-click.
			if ( event.button !== 2 ) {
				if ( dom.hasclass( node, 'wp-media-selected' ) ) {
					editmedia( node );
				} else {
					unselect();
					dom.addclass( node, 'wp-media-selected' );
				}
			}
		} else {
			unselect();
		}
	});

	// display gallery, audio or video instead of img in the element path.
	editor.on( 'resolvename', function( event ) {
		var dom = editor.dom,
			node = event.target;

		if ( node.nodename === 'img' && dom.getattrib( node, 'data-wp-media' ) ) {
			if ( dom.hasclass( node, 'wp-gallery' ) ) {
				event.name = 'gallery';
			}
		}
	});

	editor.on( 'beforesetcontent', function( event ) {
		// 'wpview' handles the gallery shortcode when present.
		if ( ! editor.plugins.wpview || typeof wp === 'undefined' || ! wp.mce ) {
			event.content = replacegalleryshortcodes( event.content );
		}
	});

	editor.on( 'postprocess', function( event ) {
		if ( event.get ) {
			event.content = restoremediashortcodes( event.content );
		}
	});
});




