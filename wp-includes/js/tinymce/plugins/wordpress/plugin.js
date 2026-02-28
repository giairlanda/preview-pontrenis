/* global getusersetting, setusersetting */
( function( tinymce ) {
// set the minimum value for the modals z-index higher than #wpadminbar (100000).
if ( ! tinymce.ui.floatpanel.zindex || tinymce.ui.floatpanel.zindex < 100100 ) {
	tinymce.ui.floatpanel.zindex = 100100;
}

tinymce.pluginmanager.add( 'wordpress', function( editor ) {
	var wpadvbutton, style,
		dom = tinymce.dom,
		each = tinymce.each,
		__ = editor.editormanager.i18n.translate,
		$ = window.jquery,
		wp = window.wp,
		haswpautop = ( wp && wp.editor && wp.editor.autop && editor.getparam( 'wpautop', true ) ),
		wptooltips = false;

	if ( $ ) {
		// runs as soon as tinymce has started initializing, while plugins are loading.
		// handlers attached after the `tinymce.init()` call may not get triggered for this instance.
		$( document ).triggerhandler( 'tinymce-editor-setup', [ editor ] );
	}

	function toggletoolbars( state ) {
		var initial, toolbars, iframeheight,
			pixels = 0,
			classicblocktoolbar = tinymce.$( '.block-library-classic__toolbar' );

		if ( state === 'hide' ) {
			initial = true;
		} else if ( classicblocktoolbar.length && ! classicblocktoolbar.hasclass( 'has-advanced-toolbar' ) ) {
			// show the second, third, etc. toolbar rows in the classic block instance.
			classicblocktoolbar.addclass( 'has-advanced-toolbar' );
			state = 'show';
		}

		if ( editor.theme.panel ) {
			toolbars = editor.theme.panel.find('.toolbar:not(.menubar)');
		}

		if ( toolbars && toolbars.length > 1 ) {
			if ( ! state && toolbars[1].visible() ) {
				state = 'hide';
			}

			each( toolbars, function( toolbar, i ) {
				if ( i > 0 ) {
					if ( state === 'hide' ) {
						toolbar.hide();
						pixels += 34;
					} else {
						toolbar.show();
						pixels -= 34;
					}
				}
			});
		}

		// resize editor iframe, not needed for ios and inline instances.
		// don't resize if the editor is in a hidden container.
		if ( pixels && ! tinymce.env.ios && editor.iframeelement && editor.iframeelement.clientheight ) {
			iframeheight = editor.iframeelement.clientheight + pixels;

			// keep min-height.
			if ( iframeheight > 50  ) {
				dom.setstyle( editor.iframeelement, 'height', iframeheight );
			}
		}

		if ( ! initial ) {
			if ( state === 'hide' ) {
				setusersetting( 'hidetb', '0' );
				wpadvbutton && wpadvbutton.active( false );
			} else {
				setusersetting( 'hidetb', '1' );
				wpadvbutton && wpadvbutton.active( true );
			}
		}

		editor.fire( 'wp-toolbar-toggle' );
	}

	// add the kitchen sink button :)
	editor.addbutton( 'wp_adv', {
		tooltip: 'toolbar toggle',
		cmd: 'wp_adv',
		onpostrender: function() {
			wpadvbutton = this;
			wpadvbutton.active( getusersetting( 'hidetb' ) === '1' );
		}
	});

	// hide the toolbars after loading.
	editor.on( 'postrender', function() {
		if ( editor.getparam( 'wordpress_adv_hidden', true ) && getusersetting( 'hidetb', '0' ) === '0' ) {
			toggletoolbars( 'hide' );
		} else {
			tinymce.$( '.block-library-classic__toolbar' ).addclass( 'has-advanced-toolbar' );
		}
	});

	editor.addcommand( 'wp_adv', function() {
		toggletoolbars();
	});

	editor.on( 'focus', function() {
        window.wpactiveeditor = editor.id;
    });

	editor.on( 'beforesetcontent', function( event ) {
		var title;

		if ( event.content ) {
			if ( event.content.indexof( '<!--more' ) !== -1 ) {
				title = __( 'read more...' );

				event.content = event.content.replace( /<!--more(.*?)-->/g, function( match, moretext ) {
					return '<img src="' + tinymce.env.transparentsrc + '" data-wp-more="more" data-wp-more-text="' + moretext + '" ' +
						'class="wp-more-tag mce-wp-more" alt="' + title + '" data-mce-resize="false" data-mce-placeholder="1" />';
				});
			}

			if ( event.content.indexof( '<!--nextpage-->' ) !== -1 ) {
				title = __( 'page break' );

				event.content = event.content.replace( /<!--nextpage-->/g,
					'<img src="' + tinymce.env.transparentsrc + '" data-wp-more="nextpage" class="wp-more-tag mce-wp-nextpage" ' +
						'alt="' + title + '" data-mce-resize="false" data-mce-placeholder="1" />' );
			}

			if ( event.load && event.format !== 'raw' ) {
				if ( haswpautop ) {
					event.content = wp.editor.autop( event.content );
				} else {
					// prevent creation of paragraphs out of multiple html comments.
					event.content = event.content.replace( /-->\s+<!--/g, '--><!--' );
				}
			}

			if ( event.content.indexof( '<script' ) !== -1 || event.content.indexof( '<style' ) !== -1 ) {
				event.content = event.content.replace( /<(script|style)[^>]*>[\s\s]*?<\/\1>/g, function( match, tag ) {
					return '<img ' +
						'src="' + tinymce.env.transparentsrc + '" ' +
						'data-wp-preserve="' + encodeuricomponent( match ) + '" ' +
						'data-mce-resize="false" ' +
						'data-mce-placeholder="1" '+
						'class="mce-object mce-object-' + tag + '" ' +
						'width="20" height="20" '+
						'alt="&lt;' + tag + '&gt;" ' +
					'/>';
				} );
			}
		}
	});

	editor.on( 'setcontent', function() {
		// remove spaces from empty paragraphs.
		editor.$( 'p' ).each( function( i, node ) {
			if ( node.innerhtml && node.innerhtml.length < 10 ) {
				var html = tinymce.trim( node.innerhtml );

				if ( ! html || html === '&nbsp;' ) {
					node.innerhtml = ( tinymce.env.ie && tinymce.env.ie < 11 ) ? '' : '<br data-mce-bogus="1">';
				}
			}
		} );
	});

	editor.on( 'postprocess', function( event ) {
		if ( event.get ) {
			event.content = event.content.replace(/<img[^>]+>/g, function( image ) {
				var match,
					string,
					moretext = '';

				if ( image.indexof( 'data-wp-more="more"' ) !== -1 ) {
					if ( match = image.match( /data-wp-more-text="([^"]+)"/ ) ) {
						moretext = match[1];
					}

					string = '<!--more' + moretext + '-->';
				} else if ( image.indexof( 'data-wp-more="nextpage"' ) !== -1 ) {
					string = '<!--nextpage-->';
				} else if ( image.indexof( 'data-wp-preserve' ) !== -1 ) {
					if ( match = image.match( / data-wp-preserve="([^"]+)"/ ) ) {
						string = decodeuricomponent( match[1] );
					}
				}

				return string || image;
			});
		}
	});

	// display the tag name instead of img in element path.
	editor.on( 'resolvename', function( event ) {
		var attr;

		if ( event.target.nodename === 'img' && ( attr = editor.dom.getattrib( event.target, 'data-wp-more' ) ) ) {
			event.name = attr;
		}
	});

	// register commands.
	editor.addcommand( 'wp_more', function( tag ) {
		var parent, html, title,
			classname = 'wp-more-tag',
			dom = editor.dom,
			node = editor.selection.getnode(),
			rootnode = editor.getbody();

		tag = tag || 'more';
		classname += ' mce-wp-' + tag;
		title = tag === 'more' ? 'read more...' : 'next page';
		title = __( title );
		html = '<img src="' + tinymce.env.transparentsrc + '" alt="' + title + '" class="' + classname + '" ' +
			'data-wp-more="' + tag + '" data-mce-resize="false" data-mce-placeholder="1" />';

		// most common case.
		if ( node === rootnode || ( node.nodename === 'p' && node.parentnode === rootnode ) ) {
			editor.insertcontent( html );
			return;
		}

		// get the top level parent node.
		parent = dom.getparent( node, function( found ) {
			if ( found.parentnode && found.parentnode === rootnode ) {
				return true;
			}

			return false;
		}, editor.getbody() );

		if ( parent ) {
			if ( parent.nodename === 'p' ) {
				parent.appendchild( dom.create( 'p', null, html ).firstchild );
			} else {
				dom.insertafter( dom.create( 'p', null, html ), parent );
			}

			editor.nodechanged();
		}
	});

	editor.addcommand( 'wp_code', function() {
		editor.formatter.toggle('code');
	});

	editor.addcommand( 'wp_page', function() {
		editor.execcommand( 'wp_more', 'nextpage' );
	});

	editor.addcommand( 'wp_help', function() {
		var access = tinymce.env.mac ? __( 'ctrl + alt + letter:' ) : __( 'shift + alt + letter:' ),
			meta = tinymce.env.mac ? __( '✘ + letter:' ) : __( 'ctrl + letter:' ),
			table1 = [],
			table2 = [],
			row1 = {},
			row2 = {},
			i1 = 0,
			i2 = 0,
			labels = editor.settings.wp_shortcut_labels,
			header, html, dialog, $wrap;

		if ( ! labels ) {
			return;
		}

		function tr( row, columns ) {
			var out = '<tr>';
			var i = 0;

			columns = columns || 1;

			each( row, function( text, key ) {
				out += '<td><kbd>' + key + '</kbd></td><td>' + __( text ) + '</td>';
				i++;
			});

			while ( i < columns ) {
				out += '<td></td><td></td>';
				i++;
			}

			return out + '</tr>';
		}

		each ( labels, function( label, name ) {
			var letter;

			if ( label.indexof( 'meta' ) !== -1 ) {
				i1++;
				letter = label.replace( 'meta', '' ).tolowercase();

				if ( letter ) {
					row1[ letter ] = name;

					if ( i1 % 2 === 0 ) {
						table1.push( tr( row1, 2 ) );
						row1 = {};
					}
				}
			} else if ( label.indexof( 'access' ) !== -1 ) {
				i2++;
				letter = label.replace( 'access', '' ).tolowercase();

				if ( letter ) {
					row2[ letter ] = name;

					if ( i2 % 2 === 0 ) {
						table2.push( tr( row2, 2 ) );
						row2 = {};
					}
				}
			}
		} );

		// add remaining single entries.
		if ( i1 % 2 > 0 ) {
			table1.push( tr( row1, 2 ) );
		}

		if ( i2 % 2 > 0 ) {
			table2.push( tr( row2, 2 ) );
		}

		header = [ __( 'letter' ), __( 'action' ), __( 'letter' ), __( 'action' ) ];
		header = '<tr><th>' + header.join( '</th><th>' ) + '</th></tr>';

		html = '<div class="wp-editor-help">';

		// main section, default and additional shortcuts.
		html = html +
			'<h2>' + __( 'default shortcuts,' ) + ' ' + meta + '</h2>' +
			'<table class="wp-help-th-center fixed">' +
				header +
				table1.join('') +
			'</table>' +
			'<h2>' + __( 'additional shortcuts,' ) + ' ' + access + '</h2>' +
			'<table class="wp-help-th-center fixed">' +
				header +
				table2.join('') +
			'</table>';

		if ( editor.plugins.wptextpattern && ( ! tinymce.env.ie || tinymce.env.ie > 8 ) ) {
			// text pattern section.
			html = html +
				'<h2>' + __( 'when starting a new paragraph with one of these formatting shortcuts followed by a space, the formatting will be applied automatically. press backspace or escape to undo.' ) + '</h2>' +
				'<table class="wp-help-th-center fixed">' +
					tr({ '*':  'bullet list', '1.':  'numbered list' }) +
					tr({ '-':  'bullet list', '1)':  'numbered list' }) +
				'</table>';

			html = html +
				'<h2>' + __( 'the following formatting shortcuts are replaced when pressing enter. press escape or the undo button to undo.' ) + '</h2>' +
				'<table class="wp-help-single">' +
					tr({ '>': 'blockquote' }) +
					tr({ '##': 'heading 2' }) +
					tr({ '###': 'heading 3' }) +
					tr({ '####': 'heading 4' }) +
					tr({ '#####': 'heading 5' }) +
					tr({ '######': 'heading 6' }) +
					tr({ '---': 'horizontal line' }) +
				'</table>';
		}

		// focus management section.
		html = html +
			'<h2>' + __( 'focus shortcuts:' ) + '</h2>' +
			'<table class="wp-help-single">' +
				tr({ 'alt + f8':  'inline toolbar (when an image, link or preview is selected)' }) +
				tr({ 'alt + f9':  'editor menu (when enabled)' }) +
				tr({ 'alt + f10': 'editor toolbar' }) +
				tr({ 'alt + f11': 'elements path' }) +
			'</table>' +
			'<p>' + __( 'to move focus to other buttons use tab or the arrow keys. to return focus to the editor press escape or use one of the buttons.' ) + '</p>';

		html += '</div>';

		dialog = editor.windowmanager.open( {
			title: editor.settings.classic_block_editor ? 'classic block keyboard shortcuts' : 'keyboard shortcuts',
			items: {
				type: 'container',
				classes: 'wp-help',
				html: html
			},
			buttons: {
				text: 'close',
				onclick: 'close'
			}
		} );

		if ( dialog.$el ) {
			dialog.$el.find( 'div[role="application"]' ).attr( 'role', 'document' );
			$wrap = dialog.$el.find( '.mce-wp-help' );

			if ( $wrap[0] ) {
				$wrap.attr( 'tabindex', '0' );
				$wrap[0].focus();
				$wrap.on( 'keydown', function( event ) {
					// prevent use of: page up, page down, end, home, left arrow, up arrow, right arrow, down arrow
					// in the dialog keydown handler.
					if ( event.keycode >= 33 && event.keycode <= 40 ) {
						event.stoppropagation();
					}
				});
			}
		}
	} );

	editor.addcommand( 'wp_medialib', function() {
		if ( wp && wp.media && wp.media.editor ) {
			wp.media.editor.open( editor.id );
		}
	});

	// register buttons.
	editor.addbutton( 'wp_more', {
		tooltip: 'insert read more tag',
		onclick: function() {
			editor.execcommand( 'wp_more', 'more' );
		}
	});

	editor.addbutton( 'wp_page', {
		tooltip: 'page break',
		onclick: function() {
			editor.execcommand( 'wp_more', 'nextpage' );
		}
	});

	editor.addbutton( 'wp_help', {
		tooltip: 'keyboard shortcuts',
		cmd: 'wp_help'
	});

	editor.addbutton( 'wp_code', {
		tooltip: 'code',
		cmd: 'wp_code',
		stateselector: 'code'
	});

	// insert->add media.
	if ( wp && wp.media && wp.media.editor ) {
		editor.addbutton( 'wp_add_media', {
			tooltip: 'add media',
			icon: 'dashicon dashicons-admin-media',
			cmd: 'wp_medialib'
		} );

		editor.addmenuitem( 'add_media', {
			text: 'add media',
			icon: 'wp-media-library',
			context: 'insert',
			cmd: 'wp_medialib'
		});
	}

	// insert "read more...".
	editor.addmenuitem( 'wp_more', {
		text: 'insert read more tag',
		icon: 'wp_more',
		context: 'insert',
		onclick: function() {
			editor.execcommand( 'wp_more', 'more' );
		}
	});

	// insert "next page".
	editor.addmenuitem( 'wp_page', {
		text: 'page break',
		icon: 'wp_page',
		context: 'insert',
		onclick: function() {
			editor.execcommand( 'wp_more', 'nextpage' );
		}
	});

	editor.on( 'beforeexeccommand', function(e) {
		if ( tinymce.env.webkit && ( e.command === 'insertunorderedlist' || e.command === 'insertorderedlist' ) ) {
			if ( ! style ) {
				style = editor.dom.create( 'style', {'type': 'text/css'},
					'#tinymce,#tinymce span,#tinymce li,#tinymce li>span,#tinymce p,#tinymce p>span{font:medium sans-serif;color:#000;line-height:normal;}');
			}

			editor.getdoc().head.appendchild( style );
		}
	});

	editor.on( 'execcommand', function( e ) {
		if ( tinymce.env.webkit && style &&
			( 'insertunorderedlist' === e.command || 'insertorderedlist' === e.command ) ) {

			editor.dom.remove( style );
		}
	});

	editor.on( 'init', function() {
		var env = tinymce.env,
			bodyclass = ['mcecontentbody'], // back-compat for themes that use this in editor-style.css...
			doc = editor.getdoc(),
			dom = editor.dom;

		if ( env.ios ) {
			dom.addclass( doc.documentelement, 'ios' );
		}

		if ( editor.getparam( 'directionality' ) === 'rtl' ) {
			bodyclass.push('rtl');
			dom.setattrib( doc.documentelement, 'dir', 'rtl' );
		}

		dom.setattrib( doc.documentelement, 'lang', editor.getparam( 'wp_lang_attr' ) );

		if ( env.ie ) {
			if ( parseint( env.ie, 10 ) === 9 ) {
				bodyclass.push('ie9');
			} else if ( parseint( env.ie, 10 ) === 8 ) {
				bodyclass.push('ie8');
			} else if ( env.ie < 8 ) {
				bodyclass.push('ie7');
			}
		} else if ( env.webkit ) {
			bodyclass.push('webkit');
		}

		bodyclass.push('wp-editor');

		each( bodyclass, function( cls ) {
			if ( cls ) {
				dom.addclass( doc.body, cls );
			}
		});

		// remove invalid parent paragraphs when inserting html.
		editor.on( 'beforesetcontent', function( event ) {
			if ( event.content ) {
				event.content = event.content.replace( /<p>\s*<(p|div|ul|ol|dl|table|blockquote|h[1-6]|fieldset|pre)( [^>]*)?>/gi, '<$1$2>' )
					.replace( /<\/(p|div|ul|ol|dl|table|blockquote|h[1-6]|fieldset|pre)>\s*<\/p>/gi, '</$1>' );
			}
		});

		if ( $ ) {
			// run on dom ready. otherwise tinymce may initialize earlier and handlers attached
			// on dom ready of after the `tinymce.init()` call may not get triggered.
			$( function() {
				$( document ).triggerhandler( 'tinymce-editor-init', [editor] );
			});
		}

		if ( window.tinymcepreinit && window.tinymcepreinit.dragdropupload ) {
			dom.bind( doc, 'dragstart dragend dragover drop', function( event ) {
				if ( $ ) {
					// trigger the jquery handlers.
					$( document ).trigger( new $.event( event ) );
				}
			});
		}

		if ( editor.getparam( 'wp_paste_filters', true ) ) {
			editor.on( 'pastepreprocess', function( event ) {
				// remove trailing <br> added by webkit browsers to the clipboard.
				event.content = event.content.replace( /<br class="?apple-interchange-newline"?>/gi, '' );

				// in webkit this is handled by removewebkitstyles().
				if ( ! tinymce.env.webkit ) {
					// remove all inline styles.
					event.content = event.content.replace( /(<[^>]+) style="[^"]*"([^>]*>)/gi, '$1$2' );

					// put back the internal styles.
					event.content = event.content.replace(/(<[^>]+) data-mce-style=([^>]+>)/gi, '$1 style=$2' );
				}
			});

			editor.on( 'pastepostprocess', function( event ) {
				// remove empty paragraphs.
				editor.$( 'p', event.node ).each( function( i, node ) {
					if ( dom.isempty( node ) ) {
						dom.remove( node );
					}
				});

				if ( tinymce.isie ) {
					editor.$( 'a', event.node ).find( 'font, u' ).each( function( i, node ) {
						dom.remove( node, true );
					});
				}
			});
		}
	});

	editor.on( 'savecontent', function( event ) {
		// if editor is hidden, we just want the textarea's value to be saved.
		if ( ! editor.inline && editor.ishidden() ) {
			event.content = event.element.value;
			return;
		}

		// keep empty paragraphs :(
		event.content = event.content.replace( /<p>(?:<br ?\/?>|\u00a0|\ufeff| )*<\/p>/g, '<p>&nbsp;</p>' );

		if ( haswpautop ) {
			event.content = wp.editor.removep( event.content );
		} else {
			// restore formatting of block boundaries.
			event.content = event.content.replace( /-->\s*<!-- wp:/g, '-->\n\n<!-- wp:' );
		}
	});

	editor.on( 'preinit', function() {
		var validelementssetting = '@[id|accesskey|class|dir|lang|style|tabindex|' +
			'title|contenteditable|draggable|dropzone|hidden|spellcheck|translate],' + // global attributes.
			'i,' + // don't replace <i> with <em> and <b> with <strong> and don't remove them when empty.
			'b,' +
			'script[src|async|defer|type|charset|crossorigin|integrity]'; // add support for <script>.

		editor.schema.addvalidelements( validelementssetting );

		if ( tinymce.env.ios ) {
			editor.settings.height = 300;
		}

		each( {
			c: 'justifycenter',
			r: 'justifyright',
			l: 'justifyleft',
			j: 'justifyfull',
			q: 'mceblockquote',
			u: 'insertunorderedlist',
			o: 'insertorderedlist',
			m: 'wp_medialib',
			t: 'wp_more',
			d: 'strikethrough',
			p: 'wp_page',
			x: 'wp_code'
		}, function( command, key ) {
			editor.shortcuts.add( 'access+' + key, '', command );
		} );

		editor.addshortcut( 'meta+s', '', function() {
			if ( wp && wp.autosave ) {
				wp.autosave.server.triggersave();
			}
		} );

		// alt+shift+z removes a block in the block editor, don't add it to the classic block.
		if ( ! editor.settings.classic_block_editor ) {
			editor.addshortcut( 'access+z', '', 'wp_adv' );
		}

		// workaround for not triggering the global help modal in the block editor by the classic block shortcut.
		editor.on( 'keydown', function( event ) {
			var match;

			if ( tinymce.env.mac ) {
				match = event.ctrlkey && event.altkey && event.code === 'keyh';
			} else {
				match = event.shiftkey && event.altkey && event.code === 'keyh';
			}

			if ( match ) {
				editor.execcommand( 'wp_help' );
				event.stoppropagation();
				event.stopimmediatepropagation();
				return false;
			}

			return true;
		});

		if ( window.getusersetting( 'editor_plain_text_paste_warning' ) > 1 ) {
			editor.settings.paste_plaintext_inform = false;
		}

		// change the editor iframe title on macos, add the correct help shortcut.
		if ( tinymce.env.mac ) {
			tinymce.$( editor.iframeelement ).attr( 'title', __( 'rich text area. press control-option-h for help.' ) );
		}
	} );

	editor.on( 'pasteplaintexttoggle', function( event ) {
		// warn twice, then stop.
		if ( event.state === true ) {
			var times = parseint( window.getusersetting( 'editor_plain_text_paste_warning' ), 10 ) || 0;

			if ( times < 2 ) {
				window.setusersetting( 'editor_plain_text_paste_warning', ++times );
			}
		}
	});

	editor.on( 'beforerenderui', function() {
		if ( editor.theme.panel ) {
			each( [ 'button', 'colorbutton', 'splitbutton' ], function( buttontype ) {
				replacebuttonstooltips( editor.theme.panel.find( buttontype ) );
			} );

			addshortcutstolistbox();
		}
	} );

	function preparetooltips() {
		var access = 'shift+alt+';
		var meta = 'ctrl+';

		wptooltips = {};

		// for macos: ctrl = \u2303, cmd = \u2318, alt = \u2325.
		if ( tinymce.env.mac ) {
			access = '\u2303\u2325';
			meta = '\u2318';
		}

		// some tooltips are translated, others are not...
		if ( editor.settings.wp_shortcut_labels ) {
			each( editor.settings.wp_shortcut_labels, function( value, tooltip ) {
				var translated = editor.translate( tooltip );

				value = value.replace( 'access', access ).replace( 'meta', meta );
				wptooltips[ tooltip ] = value;

				// add the translated so we can match all of them.
				if ( tooltip !== translated ) {
					wptooltips[ translated ] = value;
				}
			} );
		}
	}

	function gettooltip( tooltip ) {
		var translated = editor.translate( tooltip );
		var label;

		if ( ! wptooltips ) {
			preparetooltips();
		}

		if ( wptooltips.hasownproperty( translated ) ) {
			label = wptooltips[ translated ];
		} else if ( wptooltips.hasownproperty( tooltip ) ) {
			label = wptooltips[ tooltip ];
		}

		return label ? translated + ' (' + label + ')' : translated;
	}

	function replacebuttonstooltips( buttons ) {

		if ( ! buttons ) {
			return;
		}

		each( buttons, function( button ) {
			var tooltip;

			if ( button && button.settings.tooltip ) {
				tooltip = gettooltip( button.settings.tooltip );
				button.settings.tooltip = tooltip;

				// override the aria label with the translated tooltip + shortcut.
				if ( button._aria && button._aria.label ) {
					button._aria.label = tooltip;
				}
			}
		} );
	}

	function addshortcutstolistbox() {
		// listbox for the "blocks" drop-down.
		each( editor.theme.panel.find( 'listbox' ), function( listbox ) {
			if ( listbox && listbox.settings.text === 'paragraph' ) {
				each( listbox.settings.values, function( item ) {
					if ( item.text && wptooltips.hasownproperty( item.text ) ) {
						item.shortcut = '(' + wptooltips[ item.text ] + ')';
					}
				} );
			}
		} );
	}

	/**
	 * experimental: create a floating toolbar.
	 * this functionality will change in the next releases. not recommended for use by plugins.
	 */
	editor.on( 'preinit', function() {
		var factory = tinymce.ui.factory,
			settings = editor.settings,
			activetoolbar,
			currentselection,
			timeout,
			container = editor.getcontainer(),
			wpadminbar = document.getelementbyid( 'wpadminbar' ),
			mceiframe = document.getelementbyid( editor.id + '_ifr' ),
			mcetoolbar,
			mcestatusbar,
			wpstatusbar,
			cachedwinsize;

			if ( container ) {
				mcetoolbar = tinymce.$( '.mce-toolbar-grp', container )[0];
				mcestatusbar = tinymce.$( '.mce-statusbar', container )[0];
			}

			if ( editor.id === 'content' ) {
				wpstatusbar = document.getelementbyid( 'post-status-info' );
			}

		function create( buttons, bottom ) {
			var toolbar,
				toolbaritems = [],
				buttongroup;

			each( buttons, function( item ) {
				var itemname;
				var tooltip;

				function bindselectorchanged() {
					var selection = editor.selection;

					if ( itemname === 'bullist' ) {
						selection.selectorchanged( 'ul > li', function( state, args ) {
							var i = args.parents.length,
								nodename;

							while ( i-- ) {
								nodename = args.parents[ i ].nodename;

								if ( nodename === 'ol' || nodename == 'ul' ) {
									break;
								}
							}

							item.active( state && nodename === 'ul' );
						} );
					}

					if ( itemname === 'numlist' ) {
						selection.selectorchanged( 'ol > li', function( state, args ) {
							var i = args.parents.length,
								nodename;

							while ( i-- ) {
								nodename = args.parents[ i ].nodename;

								if ( nodename === 'ol' || nodename === 'ul' ) {
									break;
								}
							}

							item.active( state && nodename === 'ol' );
						} );
					}

					if ( item.settings.stateselector ) {
						selection.selectorchanged( item.settings.stateselector, function( state ) {
							item.active( state );
						}, true );
					}

					if ( item.settings.disabledstateselector ) {
						selection.selectorchanged( item.settings.disabledstateselector, function( state ) {
							item.disabled( state );
						} );
					}
				}

				if ( item === '|' ) {
					buttongroup = null;
				} else {
					if ( factory.has( item ) ) {
						item = {
							type: item
						};

						if ( settings.toolbar_items_size ) {
							item.size = settings.toolbar_items_size;
						}

						toolbaritems.push( item );

						buttongroup = null;
					} else {
						if ( ! buttongroup ) {
							buttongroup = {
								type: 'buttongroup',
								items: []
							};

							toolbaritems.push( buttongroup );
						}

						if ( editor.buttons[ item ] ) {
							itemname = item;
							item = editor.buttons[ itemname ];

							if ( typeof item === 'function' ) {
								item = item();
							}

							item.type = item.type || 'button';

							if ( settings.toolbar_items_size ) {
								item.size = settings.toolbar_items_size;
							}

							tooltip = item.tooltip || item.title;

							if ( tooltip ) {
								item.tooltip = gettooltip( tooltip );
							}

							item = factory.create( item );

							buttongroup.items.push( item );

							if ( editor.initialized ) {
								bindselectorchanged();
							} else {
								editor.on( 'init', bindselectorchanged );
							}
						}
					}
				}
			} );

			toolbar = factory.create( {
				type: 'panel',
				layout: 'stack',
				classes: 'toolbar-grp inline-toolbar-grp',
				ariaroot: true,
				ariaremember: true,
				items: [ {
					type: 'toolbar',
					layout: 'flow',
					items: toolbaritems
				} ]
			} );

			toolbar.bottom = bottom;

			function reposition() {
				if ( ! currentselection ) {
					return this;
				}

				var scrollx = window.pagexoffset || document.documentelement.scrollleft,
					scrolly = window.pageyoffset || document.documentelement.scrolltop,
					windowwidth = window.innerwidth,
					windowheight = window.innerheight,
					iframerect = mceiframe ? mceiframe.getboundingclientrect() : {
						top: 0,
						right: windowwidth,
						bottom: windowheight,
						left: 0,
						width: windowwidth,
						height: windowheight
					},
					toolbar = this.getel(),
					toolbarwidth = toolbar.offsetwidth,
					toolbarheight = toolbar.clientheight,
					selection = currentselection.getboundingclientrect(),
					selectionmiddle = ( selection.left + selection.right ) / 2,
					buffer = 5,
					spaceneeded = toolbarheight + buffer,
					wpadminbarbottom = wpadminbar ? wpadminbar.getboundingclientrect().bottom : 0,
					mcetoolbarbottom = mcetoolbar ? mcetoolbar.getboundingclientrect().bottom : 0,
					mcestatusbartop = mcestatusbar ? windowheight - mcestatusbar.getboundingclientrect().top : 0,
					wpstatusbartop = wpstatusbar ? windowheight - wpstatusbar.getboundingclientrect().top : 0,
					blockedtop = math.max( 0, wpadminbarbottom, mcetoolbarbottom, iframerect.top ),
					blockedbottom = math.max( 0, mcestatusbartop, wpstatusbartop, windowheight - iframerect.bottom ),
					spacetop = selection.top + iframerect.top - blockedtop,
					spacebottom = windowheight - iframerect.top - selection.bottom - blockedbottom,
					editorheight = windowheight - blockedtop - blockedbottom,
					classname = '',
					iosoffsettop = 0,
					iosoffsetbottom = 0,
					top, left;

				if ( spacetop >= editorheight || spacebottom >= editorheight ) {
					this.scrolling = true;
					this.hide();
					this.scrolling = false;
					return this;
				}

				// add offset in ios to move the menu over the image, out of the way of the default ios menu.
				if ( tinymce.env.ios && currentselection.nodename === 'img' ) {
					iosoffsettop = 54;
					iosoffsetbottom = 46;
				}

				if ( this.bottom ) {
					if ( spacebottom >= spaceneeded ) {
						classname = ' mce-arrow-up';
						top = selection.bottom + iframerect.top + scrolly - iosoffsetbottom;
					} else if ( spacetop >= spaceneeded ) {
						classname = ' mce-arrow-down';
						top = selection.top + iframerect.top + scrolly - toolbarheight + iosoffsettop;
					}
				} else {
					if ( spacetop >= spaceneeded ) {
						classname = ' mce-arrow-down';
						top = selection.top + iframerect.top + scrolly - toolbarheight + iosoffsettop;
					} else if ( spacebottom >= spaceneeded && editorheight / 2 > selection.bottom + iframerect.top - blockedtop ) {
						classname = ' mce-arrow-up';
						top = selection.bottom + iframerect.top + scrolly - iosoffsetbottom;
					}
				}

				if ( typeof top === 'undefined' ) {
					top = scrolly + blockedtop + buffer + iosoffsetbottom;
				}

				left = selectionmiddle - toolbarwidth / 2 + iframerect.left + scrollx;

				if ( selection.left < 0 || selection.right > iframerect.width ) {
					left = iframerect.left + scrollx + ( iframerect.width - toolbarwidth ) / 2;
				} else if ( toolbarwidth >= windowwidth ) {
					classname += ' mce-arrow-full';
					left = 0;
				} else if ( ( left < 0 && selection.left + toolbarwidth > windowwidth ) || ( left + toolbarwidth > windowwidth && selection.right - toolbarwidth < 0 ) ) {
					left = ( windowwidth - toolbarwidth ) / 2;
				} else if ( left < iframerect.left + scrollx ) {
					classname += ' mce-arrow-left';
					left = selection.left + iframerect.left + scrollx;
				} else if ( left + toolbarwidth > iframerect.width + iframerect.left + scrollx ) {
					classname += ' mce-arrow-right';
					left = selection.right - toolbarwidth + iframerect.left + scrollx;
				}

				// no up/down arrows on the menu over images in ios.
				if ( tinymce.env.ios && currentselection.nodename === 'img' ) {
					classname = classname.replace( / ?mce-arrow-(up|down)/g, '' );
				}

				toolbar.classname = toolbar.classname.replace( / ?mce-arrow-[\w]+/g, '' ) + classname;

				dom.setstyles( toolbar, {
					'left': left,
					'top': top
				} );

				return this;
			}

			toolbar.on( 'show', function() {
				this.reposition();
			} );

			toolbar.on( 'keydown', function( event ) {
				if ( event.keycode === 27 ) {
					this.hide();
					editor.focus();
				}
			} );

			editor.on( 'remove', function() {
				toolbar.remove();
			} );

			toolbar.reposition = reposition;
			toolbar.hide().renderto( document.body );

			return toolbar;
		}

		editor.shortcuts.add( 'alt+119', '', function() {
			var node;

			if ( activetoolbar ) {
				node = activetoolbar.find( 'toolbar' )[0];
				node && node.focus( true );
			}
		} );

		editor.on( 'nodechange', function( event ) {
			var collapsed = editor.selection.iscollapsed();

			var args = {
				element: event.element,
				parents: event.parents,
				collapsed: collapsed
			};

			editor.fire( 'wptoolbar', args );

			currentselection = args.selection || args.element;

			if ( activetoolbar && activetoolbar !== args.toolbar ) {
				activetoolbar.hide();
			}

			if ( args.toolbar ) {
				activetoolbar = args.toolbar;

				if ( activetoolbar.visible() ) {
					activetoolbar.reposition();
				} else {
					activetoolbar.show();
				}
			} else {
				activetoolbar = false;
			}
		} );

		editor.on( 'focus', function() {
			if ( activetoolbar ) {
				activetoolbar.show();
			}
		} );

		function hide( event ) {
			var win;
			var size;

			if ( activetoolbar ) {
				if ( activetoolbar.temphide || event.type === 'hide' || event.type === 'blur' ) {
					activetoolbar.hide();
					activetoolbar = false;
				} else if ( (
					event.type === 'resizewindow' ||
					event.type === 'scrollwindow' ||
					event.type === 'resize' ||
					event.type === 'scroll'
				) && ! activetoolbar.blockhide ) {
					/*
					 * showing a tooltip may trigger a `resize` event in chromium browsers.
					 * that results in a flicketing inline menu; tooltips are shown on hovering over a button,
					 * which then hides the toolbar on `resize`, then it repeats as soon as the toolbar is shown again.
					 */
					if ( event.type === 'resize' || event.type === 'resizewindow' ) {
						win = editor.getwin();
						size = win.innerheight + win.innerwidth;

						// reset old cached size.
						if ( cachedwinsize && ( new date() ).gettime() - cachedwinsize.timestamp > 2000 ) {
							cachedwinsize = null;
						}

						if ( cachedwinsize ) {
							if ( size && math.abs( size - cachedwinsize.size ) < 2 ) {
								// `resize` fired but the window hasn't been resized. bail.
								return;
							}
						} else {
							// first of a new series of `resize` events. store the cached size and bail.
							cachedwinsize = {
								timestamp: ( new date() ).gettime(),
								size: size,
							};

							return;
						}
					}

					cleartimeout( timeout );

					timeout = settimeout( function() {
						if ( activetoolbar && typeof activetoolbar.show === 'function' ) {
							activetoolbar.scrolling = false;
							activetoolbar.show();
						}
					}, 250 );

					activetoolbar.scrolling = true;
					activetoolbar.hide();
				}
			}
		}

		if ( editor.inline ) {
			editor.on( 'resizewindow', hide );

			// enable `capture` for the event.
			// this will hide/reposition the toolbar on any scrolling in the document.
			document.addeventlistener( 'scroll', hide, true );
		} else {
			// bind to the editor iframe and to the parent window.
			editor.dom.bind( editor.getwin(), 'resize scroll', hide );
			editor.on( 'resizewindow scrollwindow', hide );
		}

		editor.on( 'remove', function() {
			document.removeeventlistener( 'scroll', hide, true );
			editor.off( 'resizewindow scrollwindow', hide );
			editor.dom.unbind( editor.getwin(), 'resize scroll', hide );
		} );

		editor.on( 'blur hide', hide );

		editor.wp = editor.wp || {};
		editor.wp._createtoolbar = create;
	}, true );

	function noop() {}

	// expose some functions (back-compat).
	return {
		_showbuttons: noop,
		_hidebuttons: noop,
		_setembed: noop,
		_getembed: noop
	};
});

}( window.tinymce ));



