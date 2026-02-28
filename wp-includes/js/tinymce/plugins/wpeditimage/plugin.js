/* global tinymce */
tinymce.pluginmanager.add( 'wpeditimage', function( editor ) {
	var toolbar, serializer, touchonimage, pasteincaption,
		each = tinymce.each,
		trim = tinymce.trim,
		ios = tinymce.env.ios;

	function isplaceholder( node ) {
		return !! ( editor.dom.getattrib( node, 'data-mce-placeholder' ) || editor.dom.getattrib( node, 'data-mce-object' ) );
	}

	editor.addbutton( 'wp_img_remove', {
		tooltip: 'remove',
		icon: 'dashicon dashicons-no',
		onclick: function() {
			removeimage( editor.selection.getnode() );
		}
	} );

	editor.addbutton( 'wp_img_edit', {
		tooltip: 'edit|button', // '|button' is not displayed, only used for context.
		icon: 'dashicon dashicons-edit',
		onclick: function() {
			editimage( editor.selection.getnode() );
		}
	} );

	each( {
		alignleft: 'align left',
		aligncenter: 'align center',
		alignright: 'align right',
		alignnone: 'no alignment'
	}, function( tooltip, name ) {
		var direction = name.slice( 5 );

		editor.addbutton( 'wp_img_' + name, {
			tooltip: tooltip,
			icon: 'dashicon dashicons-align-' + direction,
			cmd: 'alignnone' === name ? 'wpalignnone' : 'justify' + direction.slice( 0, 1 ).touppercase() + direction.slice( 1 ),
			onpostrender: function() {
				var self = this;

				editor.on( 'nodechange', function( event ) {
					var node;

					// don't bother.
					if ( event.element.nodename !== 'img' ) {
						return;
					}

					node = editor.dom.getparent( event.element, '.wp-caption' ) || event.element;

					if ( 'alignnone' === name ) {
						self.active( ! /\balign(left|center|right)\b/.test( node.classname ) );
					} else {
						self.active( editor.dom.hasclass( node, name ) );
					}
				} );
			}
		} );
	} );

	editor.once( 'preinit', function() {
		if ( editor.wp && editor.wp._createtoolbar ) {
			toolbar = editor.wp._createtoolbar( [
				'wp_img_alignleft',
				'wp_img_aligncenter',
				'wp_img_alignright',
				'wp_img_alignnone',
				'wp_img_edit',
				'wp_img_remove'
			] );
		}
	} );

	editor.on( 'wptoolbar', function( event ) {
		if ( event.element.nodename === 'img' && ! isplaceholder( event.element ) ) {
			event.toolbar = toolbar;
		}
	} );

	function isnoneditable( node ) {
		var parent = editor.$( node ).parents( '[contenteditable]' );
		return parent && parent.attr( 'contenteditable' ) === 'false';
	}

	// safari on ios fails to select images in contenteditoble mode on touch.
	// select them again.
	if ( ios ) {
		editor.on( 'init', function() {
			editor.on( 'touchstart', function( event ) {
				if ( event.target.nodename === 'img' && ! isnoneditable( event.target ) ) {
					touchonimage = true;
				}
			});

			editor.dom.bind( editor.getdoc(), 'touchmove', function() {
				touchonimage = false;
			});

			editor.on( 'touchend', function( event ) {
				if ( touchonimage && event.target.nodename === 'img' && ! isnoneditable( event.target ) ) {
					var node = event.target;

					touchonimage = false;

					window.settimeout( function() {
						editor.selection.select( node );
						editor.nodechanged();
					}, 100 );
				} else if ( toolbar ) {
					toolbar.hide();
				}
			});
		});
	}

	function parseshortcode( content ) {
		return content.replace( /(?:<p>)?\[(?:wp_)?caption([^\]]+)\]([\s\s]+?)\[\/(?:wp_)?caption\](?:<\/p>)?/g, function( a, b, c ) {
			var id, align, classes, caption, img, width;

			id = b.match( /id=['"]([^'"]*)['"] ?/ );
			if ( id ) {
				b = b.replace( id[0], '' );
			}

			align = b.match( /align=['"]([^'"]*)['"] ?/ );
			if ( align ) {
				b = b.replace( align[0], '' );
			}

			classes = b.match( /class=['"]([^'"]*)['"] ?/ );
			if ( classes ) {
				b = b.replace( classes[0], '' );
			}

			width = b.match( /width=['"]([0-9]*)['"] ?/ );
			if ( width ) {
				b = b.replace( width[0], '' );
			}

			c = trim( c );
			img = c.match( /((?:<a [^>]+>)?<img [^>]+>(?:<\/a>)?)([\s\s]*)/i );

			if ( img && img[2] ) {
				caption = trim( img[2] );
				img = trim( img[1] );
			} else {
				// old captions shortcode style.
				caption = trim( b ).replace( /caption=['"]/, '' ).replace( /['"]$/, '' );
				img = c;
			}

			id = ( id && id[1] ) ? id[1].replace( /[<>&]+/g,  '' ) : '';
			align = ( align && align[1] ) ? align[1] : 'alignnone';
			classes = ( classes && classes[1] ) ? ' ' + classes[1].replace( /[<>&]+/g,  '' ) : '';

			if ( ! width && img ) {
				width = img.match( /width=['"]([0-9]*)['"]/ );
			}

			if ( width && width[1] ) {
				width = width[1];
			}

			if ( ! width || ! caption ) {
				return c;
			}

			width = parseint( width, 10 );
			if ( ! editor.getparam( 'wpeditimage_html5_captions' ) ) {
				width += 10;
			}

			return '<div class="mcetemp"><dl id="' + id + '" class="wp-caption ' + align + classes + '" style="width: ' + width + 'px">' +
				'<dt class="wp-caption-dt">'+ img +'</dt><dd class="wp-caption-dd">'+ caption +'</dd></dl></div>';
		});
	}

	function getshortcode( content ) {
		return content.replace( /(?:<div [^>]+mcetemp[^>]+>)?\s*(<dl [^>]+wp-caption[^>]+>[\s\s]+?<\/dl>)\s*(?:<\/div>)?/g, function( all, dl ) {
			var out = '';

			if ( dl.indexof('<img ') === -1 || dl.indexof('</p>') !== -1 ) {
				// broken caption. the user managed to drag the image out or type in the wrapper div?
				// remove the <dl>, <dd> and <dt> and return the remaining text.
				return dl.replace( /<d[ldt]( [^>]+)?>/g, '' ).replace( /<\/d[ldt]>/g, '' );
			}

			out = dl.replace( /\s*<dl ([^>]+)>\s*<dt [^>]+>([\s\s]+?)<\/dt>\s*<dd [^>]+>([\s\s]*?)<\/dd>\s*<\/dl>\s*/gi, function( a, b, c, caption ) {
				var id, classes, align, width;

				width = c.match( /width="([0-9]*)"/ );
				width = ( width && width[1] ) ? width[1] : '';

				classes = b.match( /class="([^"]*)"/ );
				classes = ( classes && classes[1] ) ? classes[1] : '';
				align = classes.match( /align[a-z]+/i ) || 'alignnone';

				if ( ! width || ! caption ) {
					if ( 'alignnone' !== align[0] ) {
						c = c.replace( /><img/, ' class="' + align[0] + '"><img' );
					}
					return c;
				}

				id = b.match( /id="([^"]*)"/ );
				id = ( id && id[1] ) ? id[1] : '';

				classes = classes.replace( /wp-caption ?|align[a-z]+ ?/gi, '' );

				if ( classes ) {
					classes = ' class="' + classes + '"';
				}

				caption = caption.replace( /\r\n|\r/g, '\n' ).replace( /<[a-za-z0-9]+( [^<>]+)?>/g, function( a ) {
					// no line breaks inside html tags.
					return a.replace( /[\r\n\t]+/, ' ' );
				});

				// convert remaining line breaks to <br>.
				caption = caption.replace( /\s*\n\s*/g, '<br />' );

				return '[caption id="' + id + '" align="' + align + '" width="' + width + '"' + classes + ']' + c + ' ' + caption + '[/caption]';
			});

			if ( out.indexof('[caption') === -1 ) {
				// the caption html seems broken, try to find the image that may be wrapped in a link
				// and may be followed by <p> with the caption text.
				out = dl.replace( /[\s\s]*?((?:<a [^>]+>)?<img [^>]+>(?:<\/a>)?)(<p>[\s\s]*<\/p>)?[\s\s]*/gi, '<p>$1</p>$2' );
			}

			return out;
		});
	}

	function extractimagedata( imagenode ) {
		var classes, extraclasses, metadata, captionblock, caption, link, width, height,
			captionclassname = [],
			dom = editor.dom,
			isintregexp = /^\d+$/;

		// default attributes.
		metadata = {
			attachment_id: false,
			size: 'custom',
			caption: '',
			align: 'none',
			extraclasses: '',
			link: false,
			linkurl: '',
			linkclassname: '',
			linktargetblank: false,
			linkrel: '',
			title: ''
		};

		metadata.url = dom.getattrib( imagenode, 'src' );
		metadata.alt = dom.getattrib( imagenode, 'alt' );
		metadata.title = dom.getattrib( imagenode, 'title' );

		width = dom.getattrib( imagenode, 'width' );
		height = dom.getattrib( imagenode, 'height' );

		if ( ! isintregexp.test( width ) || parseint( width, 10 ) < 1 ) {
			width = imagenode.naturalwidth || imagenode.width;
		}

		if ( ! isintregexp.test( height ) || parseint( height, 10 ) < 1 ) {
			height = imagenode.naturalheight || imagenode.height;
		}

		metadata.customwidth = metadata.width = width;
		metadata.customheight = metadata.height = height;

		classes = tinymce.explode( imagenode.classname, ' ' );
		extraclasses = [];

		tinymce.each( classes, function( name ) {

			if ( /^wp-image/.test( name ) ) {
				metadata.attachment_id = parseint( name.replace( 'wp-image-', '' ), 10 );
			} else if ( /^align/.test( name ) ) {
				metadata.align = name.replace( 'align', '' );
			} else if ( /^size/.test( name ) ) {
				metadata.size = name.replace( 'size-', '' );
			} else {
				extraclasses.push( name );
			}

		} );

		metadata.extraclasses = extraclasses.join( ' ' );

		// extract caption.
		captionblock = dom.getparents( imagenode, '.wp-caption' );

		if ( captionblock.length ) {
			captionblock = captionblock[0];

			classes = captionblock.classname.split( ' ' );
			tinymce.each( classes, function( name ) {
				if ( /^align/.test( name ) ) {
					metadata.align = name.replace( 'align', '' );
				} else if ( name && name !== 'wp-caption' ) {
					captionclassname.push( name );
				}
			} );

			metadata.captionclassname = captionclassname.join( ' ' );

			caption = dom.select( 'dd.wp-caption-dd', captionblock );
			if ( caption.length ) {
				caption = caption[0];

				metadata.caption = editor.serializer.serialize( caption )
					.replace( /<br[^>]*>/g, '$&\n' ).replace( /^<p>/, '' ).replace( /<\/p>$/, '' );
			}
		}

		// extract linkto.
		if ( imagenode.parentnode && imagenode.parentnode.nodename === 'a' ) {
			link = imagenode.parentnode;
			metadata.linkurl = dom.getattrib( link, 'href' );
			metadata.linktargetblank = dom.getattrib( link, 'target' ) === '_blank' ? true : false;
			metadata.linkrel = dom.getattrib( link, 'rel' );
			metadata.linkclassname = link.classname;
		}

		return metadata;
	}

	function hastextcontent( node ) {
		return node && !! ( node.textcontent || node.innertext ).replace( /\ufeff/g, '' );
	}

	// verify html in captions.
	function verifyhtml( caption ) {
		if ( ! caption || ( caption.indexof( '<' ) === -1 && caption.indexof( '>' ) === -1 ) ) {
			return caption;
		}

		if ( ! serializer ) {
			serializer = new tinymce.html.serializer( {}, editor.schema );
		}

		return serializer.serialize( editor.parser.parse( caption, { forced_root_block: false } ) );
	}

	function updateimage( $imagenode, imagedata ) {
		var classes, classname, node, html, parent, wrap, linknode, imagenode,
			captionnode, dd, dl, id, attrs, linkattrs, width, height, align,
			$imagenode, srcset, src,
			dom = editor.dom;

		if ( ! $imagenode || ! $imagenode.length ) {
			return;
		}

		imagenode = $imagenode[0];
		classes = tinymce.explode( imagedata.extraclasses, ' ' );

		if ( ! classes ) {
			classes = [];
		}

		if ( ! imagedata.caption ) {
			classes.push( 'align' + imagedata.align );
		}

		if ( imagedata.attachment_id ) {
			classes.push( 'wp-image-' + imagedata.attachment_id );
			if ( imagedata.size && imagedata.size !== 'custom' ) {
				classes.push( 'size-' + imagedata.size );
			}
		}

		width = imagedata.width;
		height = imagedata.height;

		if ( imagedata.size === 'custom' ) {
			width = imagedata.customwidth;
			height = imagedata.customheight;
		}

		attrs = {
			src: imagedata.url,
			width: width || null,
			height: height || null,
			title: imagedata.title || null,
			'class': classes.join( ' ' ) || null
		};

		dom.setattribs( imagenode, attrs );

		// preserve empty alt attributes.
		$imagenode.attr( 'alt', imagedata.alt || '' );

		linkattrs = {
			href: imagedata.linkurl,
			rel: imagedata.linkrel || null,
			target: imagedata.linktargetblank ? '_blank': null,
			'class': imagedata.linkclassname || null
		};

		if ( imagenode.parentnode && imagenode.parentnode.nodename === 'a' && ! hastextcontent( imagenode.parentnode ) ) {
			// update or remove an existing link wrapped around the image.
			if ( imagedata.linkurl ) {
				dom.setattribs( imagenode.parentnode, linkattrs );
			} else {
				dom.remove( imagenode.parentnode, true );
			}
		} else if ( imagedata.linkurl ) {
			if ( linknode = dom.getparent( imagenode, 'a' ) ) {
				// the image is inside a link together with other nodes,
				// or is nested in another node, move it out.
				dom.insertafter( imagenode, linknode );
			}

			// add link wrapped around the image.
			linknode = dom.create( 'a', linkattrs );
			imagenode.parentnode.insertbefore( linknode, imagenode );
			linknode.appendchild( imagenode );
		}

		captionnode = editor.dom.getparent( imagenode, '.mcetemp' );

		if ( imagenode.parentnode && imagenode.parentnode.nodename === 'a' && ! hastextcontent( imagenode.parentnode ) ) {
			node = imagenode.parentnode;
		} else {
			node = imagenode;
		}

		if ( imagedata.caption ) {
			imagedata.caption = verifyhtml( imagedata.caption );

			id = imagedata.attachment_id ? 'attachment_' + imagedata.attachment_id : null;
			align = 'align' + ( imagedata.align || 'none' );
			classname = 'wp-caption ' + align;

			if ( imagedata.captionclassname ) {
				classname += ' ' + imagedata.captionclassname.replace( /[<>&]+/g,  '' );
			}

			if ( ! editor.getparam( 'wpeditimage_html5_captions' ) ) {
				width = parseint( width, 10 );
				width += 10;
			}

			if ( captionnode ) {
				dl = dom.select( 'dl.wp-caption', captionnode );

				if ( dl.length ) {
					dom.setattribs( dl, {
						id: id,
						'class': classname,
						style: 'width: ' + width + 'px'
					} );
				}

				dd = dom.select( '.wp-caption-dd', captionnode );

				if ( dd.length ) {
					dom.sethtml( dd[0], imagedata.caption );
				}

			} else {
				id = id ? 'id="'+ id +'" ' : '';

				// should create a new function for generating the caption markup.
				html =  '<dl ' + id + 'class="' + classname +'" style="width: '+ width +'px">' +
					'<dt class="wp-caption-dt"></dt><dd class="wp-caption-dd">'+ imagedata.caption +'</dd></dl>';

				wrap = dom.create( 'div', { 'class': 'mcetemp' }, html );

				if ( parent = dom.getparent( node, 'p' ) ) {
					parent.parentnode.insertbefore( wrap, parent );
				} else {
					node.parentnode.insertbefore( wrap, node );
				}

				editor.$( wrap ).find( 'dt.wp-caption-dt' ).append( node );

				if ( parent && dom.isempty( parent ) ) {
					dom.remove( parent );
				}
			}
		} else if ( captionnode ) {
			// remove the caption wrapper and place the image in new paragraph.
			parent = dom.create( 'p' );
			captionnode.parentnode.insertbefore( parent, captionnode );
			parent.appendchild( node );
			dom.remove( captionnode );
		}

		$imagenode = editor.$( imagenode );
		srcset = $imagenode.attr( 'srcset' );
		src = $imagenode.attr( 'src' );

		// remove srcset and sizes if the image file was edited or the image was replaced.
		if ( srcset && src ) {
			src = src.replace( /[?#].*/, '' );

			if ( srcset.indexof( src ) === -1 ) {
				$imagenode.attr( 'srcset', null ).attr( 'sizes', null );
			}
		}

		if ( wp.media.events ) {
			wp.media.events.trigger( 'editor:image-update', {
				editor: editor,
				metadata: imagedata,
				image: imagenode
			} );
		}

		editor.nodechanged();
	}

	function editimage( img ) {
		var frame, callback, metadata, imagenode;

		if ( typeof wp === 'undefined' || ! wp.media ) {
			editor.execcommand( 'mceimage' );
			return;
		}

		metadata = extractimagedata( img );

		// mark the image node so we can select it later.
		editor.$( img ).attr( 'data-wp-editing', 1 );

		// manipulate the metadata by reference that is fed into the postimage model used in the media modal.
		wp.media.events.trigger( 'editor:image-edit', {
			editor: editor,
			metadata: metadata,
			image: img
		} );

		frame = wp.media({
			frame: 'image',
			state: 'image-details',
			metadata: metadata
		} );

		wp.media.events.trigger( 'editor:frame-create', { frame: frame } );

		callback = function( imagedata ) {
			editor.undomanager.transact( function() {
				updateimage( imagenode, imagedata );
			} );
			frame.detach();
		};

		frame.state('image-details').on( 'update', callback );
		frame.state('replace-image').on( 'replace', callback );
		frame.on( 'close', function() {
			editor.focus();
			frame.detach();

			/*
			 * `close` fires first...
			 * to be able to update the image node, we need to find it here,
			 * and use it in the callback.
			 */
			imagenode = editor.$( 'img[data-wp-editing]' )
			imagenode.removeattr( 'data-wp-editing' );
		});

		frame.open();
	}

	function removeimage( node ) {
		var wrap = editor.dom.getparent( node, 'div.mcetemp' );

		if ( ! wrap && node.nodename === 'img' ) {
			wrap = editor.dom.getparent( node, 'a' );
		}

		if ( wrap ) {
			if ( wrap.nextsibling ) {
				editor.selection.select( wrap.nextsibling );
			} else if ( wrap.previoussibling ) {
				editor.selection.select( wrap.previoussibling );
			} else {
				editor.selection.select( wrap.parentnode );
			}

			editor.selection.collapse( true );
			editor.dom.remove( wrap );
		} else {
			editor.dom.remove( node );
		}

		editor.nodechanged();
		editor.undomanager.add();
	}

	editor.on( 'init', function() {
		var dom = editor.dom,
			captionclass = editor.getparam( 'wpeditimage_html5_captions' ) ? 'html5-captions' : 'html4-captions';

		dom.addclass( editor.getbody(), captionclass );

		// prevent ie11 from making dl.wp-caption resizable.
		if ( tinymce.env.ie && tinymce.env.ie > 10 ) {
			// the 'mscontrolselect' event is supported only in ie11+.
			dom.bind( editor.getbody(), 'mscontrolselect', function( event ) {
				if ( event.target.nodename === 'img' && dom.getparent( event.target, '.wp-caption' ) ) {
					// hide the thick border with resize handles around dl.wp-caption.
					editor.getbody().focus(); // :(
				} else if ( event.target.nodename === 'dl' && dom.hasclass( event.target, 'wp-caption' ) ) {
					// trigger the thick border with resize handles...
					// this will make the caption text editable.
					event.target.focus();
				}
			});
		}
	});

	editor.on( 'objectresized', function( event ) {
		var node = event.target;

		if ( node.nodename === 'img' ) {
			editor.undomanager.transact( function() {
				var parent, width,
					dom = editor.dom;

				node.classname = node.classname.replace( /\bsize-[^ ]+/, '' );

				if ( parent = dom.getparent( node, '.wp-caption' ) ) {
					width = event.width || dom.getattrib( node, 'width' );

					if ( width ) {
						width = parseint( width, 10 );

						if ( ! editor.getparam( 'wpeditimage_html5_captions' ) ) {
							width += 10;
						}

						dom.setstyle( parent, 'width', width + 'px' );
					}
				}
			});
		}
	});

	editor.on( 'pastepostprocess', function( event ) {
		// pasting in a caption node.
		if ( editor.dom.getparent( editor.selection.getnode(), 'dd.wp-caption-dd' ) ) {
			// remove "non-block" elements that should not be in captions.
			editor.$( 'img, audio, video, object, embed, iframe, script, style', event.node ).remove();

			editor.$( '*', event.node ).each( function( i, node ) {
				if ( editor.dom.isblock( node ) ) {
					// insert <br> where the blocks used to be. makes it look better after pasting in the caption.
					if ( tinymce.trim( node.textcontent || node.innertext ) ) {
						editor.dom.insertafter( editor.dom.create( 'br' ), node );
						editor.dom.remove( node, true );
					} else {
						editor.dom.remove( node );
					}
				}
			});

			// trim <br> tags.
			editor.$( 'br',  event.node ).each( function( i, node ) {
				if ( ! node.nextsibling || node.nextsibling.nodename === 'br' ||
					! node.previoussibling || node.previoussibling.nodename === 'br' ) {

					editor.dom.remove( node );
				}
			} );

			// pasted html is cleaned up for inserting in the caption.
			pasteincaption = true;
		}
	});

	editor.on( 'beforeexeccommand', function( event ) {
		var node, p, dl, align, replacement, captionparent,
			cmd = event.command,
			dom = editor.dom;

		if ( cmd === 'mceinsertcontent' || cmd === 'indent' || cmd === 'outdent' ) {
			node = editor.selection.getnode();
			captionparent = dom.getparent( node, 'div.mcetemp' );

			if ( captionparent ) {
				if ( cmd === 'mceinsertcontent' ) {
					if ( pasteincaption ) {
						pasteincaption = false;
						/*
						 * we are in the caption element, and in 'paste' context,
						 * and the pasted html was cleaned up on 'pastepostprocess' above.
						 * let it be pasted in the caption.
						 */
						return;
					}

					/*
					 * the paste is somewhere else in the caption dl element.
					 * prevent pasting in there as it will break the caption.
					 * make new paragraph under the caption dl and move the caret there.
					 */
					p = dom.create( 'p' );
					dom.insertafter( p, captionparent );
					editor.selection.setcursorlocation( p, 0 );

					/*
					 * if the image is selected and the user pastes "over" it,
					 * replace both the image and the caption elements with the pasted content.
					 * this matches the behavior when pasting over non-caption images.
					 */
					if ( node.nodename === 'img' ) {
						editor.$( captionparent ).remove();
					}

					editor.nodechanged();
				} else {
					// clicking indent or outdent while an image with a caption is selected breaks the caption.
					// see #38313.
					event.preventdefault();
					event.stopimmediatepropagation();
					return false;
				}
			}
		} else if ( cmd === 'justifyleft' || cmd === 'justifyright' || cmd === 'justifycenter' || cmd === 'wpalignnone' ) {
			node = editor.selection.getnode();
			align = 'align' + cmd.slice( 7 ).tolowercase();
			dl = editor.dom.getparent( node, '.wp-caption' );

			if ( node.nodename !== 'img' && ! dl ) {
				return;
			}

			node = dl || node;

			if ( editor.dom.hasclass( node, align ) ) {
				replacement = ' alignnone';
			} else {
				replacement = ' ' + align;
			}

			node.classname = trim( node.classname.replace( / ?align(left|center|right|none)/g, '' ) + replacement );

			editor.nodechanged();
			event.preventdefault();

			if ( toolbar ) {
				toolbar.reposition();
			}

			editor.fire( 'execcommand', {
				command: cmd,
				ui: event.ui,
				value: event.value
			} );
		}
	});

	editor.on( 'keydown', function( event ) {
		var node, wrap, p, spacer,
			selection = editor.selection,
			keycode = event.keycode,
			dom = editor.dom,
			vk = tinymce.util.vk;

		if ( keycode === vk.enter ) {
			// when pressing enter inside a caption move the caret to a new parapraph under it.
			node = selection.getnode();
			wrap = dom.getparent( node, 'div.mcetemp' );

			if ( wrap ) {
				dom.events.cancel( event ); // doesn't cancel all :(

				// remove any extra dt and dd cleated on pressing enter...
				tinymce.each( dom.select( 'dt, dd', wrap ), function( element ) {
					if ( dom.isempty( element ) ) {
						dom.remove( element );
					}
				});

				spacer = tinymce.env.ie && tinymce.env.ie < 11 ? '' : '<br data-mce-bogus="1" />';
				p = dom.create( 'p', null, spacer );

				if ( node.nodename === 'dd' ) {
					dom.insertafter( p, wrap );
				} else {
					wrap.parentnode.insertbefore( p, wrap );
				}

				editor.nodechanged();
				selection.setcursorlocation( p, 0 );
			}
		} else if ( keycode === vk.delete || keycode === vk.backspace ) {
			node = selection.getnode();

			if ( node.nodename === 'div' && dom.hasclass( node, 'mcetemp' ) ) {
				wrap = node;
			} else if ( node.nodename === 'img' || node.nodename === 'dt' || node.nodename === 'a' ) {
				wrap = dom.getparent( node, 'div.mcetemp' );
			}

			if ( wrap ) {
				dom.events.cancel( event );
				removeimage( node );
				return false;
			}
		}
	});

	/*
	 * after undo/redo ff seems to set the image height very slowly when it is set to 'auto' in the css.
	 * this causes image.getboundingclientrect() to return wrong values and the resize handles are shown in wrong places.
	 * collapse the selection to remove the resize handles.
	 */
	if ( tinymce.env.gecko ) {
		editor.on( 'undo redo', function() {
			if ( editor.selection.getnode().nodename === 'img' ) {
				editor.selection.collapse();
			}
		});
	}

	editor.wpsetimgcaption = function( content ) {
		return parseshortcode( content );
	};

	editor.wpgetimgcaption = function( content ) {
		return getshortcode( content );
	};

	editor.on( 'beforegetcontent', function( event ) {
		if ( event.format !== 'raw' ) {
			editor.$( 'img[id="__wp-temp-img-id"]' ).removeattr( 'id' );
		}
	});

	editor.on( 'beforesetcontent', function( event ) {
		if ( event.format !== 'raw' ) {
			event.content = editor.wpsetimgcaption( event.content );
		}
	});

	editor.on( 'postprocess', function( event ) {
		if ( event.get ) {
			event.content = editor.wpgetimgcaption( event.content );
		}
	});

	( function() {
		var wrap;

		editor.on( 'dragstart', function() {
			var node = editor.selection.getnode();

			if ( node.nodename === 'img' ) {
				wrap = editor.dom.getparent( node, '.mcetemp' );

				if ( ! wrap && node.parentnode.nodename === 'a' && ! hastextcontent( node.parentnode ) ) {
					wrap = node.parentnode;
				}
			}
		} );

		editor.on( 'drop', function( event ) {
			var dom = editor.dom,
				rng = tinymce.dom.rangeutils.getcaretrangefrompoint( event.clientx, event.clienty, editor.getdoc() );

			// don't allow anything to be dropped in a captioned image.
			if ( rng && dom.getparent( rng.startcontainer, '.mcetemp' ) ) {
				event.preventdefault();
			} else if ( wrap ) {
				event.preventdefault();

				editor.undomanager.transact( function() {
					if ( rng ) {
						editor.selection.setrng( rng );
					}

					editor.selection.setnode( wrap );
					dom.remove( wrap );
				} );
			}

			wrap = null;
		} );
	} )();

	// add to editor.wp.
	editor.wp = editor.wp || {};
	editor.wp.isplaceholder = isplaceholder;

	// back-compat.
	return {
		_do_shcode: parseshortcode,
		_get_shcode: getshortcode
	};
});






