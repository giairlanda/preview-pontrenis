( function( tinymce ) {
	tinymce.ui.factory.add( 'wplinkpreview', tinymce.ui.control.extend( {
		url: '#',
		renderhtml: function() {
			return (
				'<div id="' + this._id + '" class="wp-link-preview">' +
					'<a href="' + this.url + '" target="_blank" tabindex="-1">' + this.url + '</a>' +
				'</div>'
			);
		},
		seturl: function( url ) {
			var index, lastindex;

			if ( this.url !== url ) {
				this.url = url;

				url = window.decodeuricomponent( url );

				url = url.replace( /^(?:https?:)?\/\/(?:www\.)?/, '' );

				if ( ( index = url.indexof( '?' ) ) !== -1 ) {
					url = url.slice( 0, index );
				}

				if ( ( index = url.indexof( '#' ) ) !== -1 ) {
					url = url.slice( 0, index );
				}

				url = url.replace( /(?:index)?\.html$/, '' );

				if ( url.charat( url.length - 1 ) === '/' ) {
					url = url.slice( 0, -1 );
				}

				// if nothing's left (maybe the url was just a fragment), use the whole url.
				if ( url === '' ) {
					url = this.url;
				}

				// if the url is longer that 40 chars, concatenate the beginning (after the domain) and ending with '...'.
				if ( url.length > 40 && ( index = url.indexof( '/' ) ) !== -1 && ( lastindex = url.lastindexof( '/' ) ) !== -1 && lastindex !== index ) {
					// if the beginning + ending are shorter that 40 chars, show more of the ending.
					if ( index + url.length - lastindex < 40 ) {
						lastindex = -( 40 - ( index + 1 ) );
					}

					url = url.slice( 0, index + 1 ) + '\u2026' + url.slice( lastindex );
				}

				tinymce.$( this.getel().firstchild ).attr( 'href', this.url ).text( url );
			}
		}
	} ) );

	tinymce.ui.factory.add( 'wplinkinput', tinymce.ui.control.extend( {
		renderhtml: function() {
			return (
				'<div id="' + this._id + '" class="wp-link-input">' +
					'<label for="' + this._id + '_label">' + tinymce.translate( 'paste url or type to search' ) + '</label><input id="' + this._id + '_label" type="text" value="" />' +
					'<input type="text" style="display:none" value="" />' +
				'</div>'
			);
		},
		seturl: function( url ) {
			this.getel().firstchild.nextsibling.value = url;
		},
		geturl: function() {
			return tinymce.trim( this.getel().firstchild.nextsibling.value );
		},
		getlinktext: function() {
			var text = this.getel().firstchild.nextsibling.nextsibling.value;

			if ( ! tinymce.trim( text ) ) {
				return '';
			}

			return text.replace( /[\r\n\t ]+/g, ' ' );
		},
		reset: function() {
			var urlinput = this.getel().firstchild.nextsibling;

			urlinput.value = '';
			urlinput.nextsibling.value = '';
		}
	} ) );

	tinymce.pluginmanager.add( 'wplink', function( editor ) {
		var toolbar;
		var edittoolbar;
		var previewinstance;
		var inputinstance;
		var linknode;
		var doingundoredo;
		var doingundoredotimer;
		var $ = window.jquery;
		var emailregex = /^(mailto:)?[a-z0-9._%+-]+@[a-z0-9][a-z0-9.-]*\.[a-z]{2,63}$/i;
		var urlregex1 = /^https?:\/\/([^\s/?.#-][^\s\/?.#]*\.?)+(\/[^\s"]*)?$/i;
		var urlregex2 = /^https?:\/\/[^\/]+\.[^\/]+($|\/)/i;
		var speak = ( typeof window.wp !== 'undefined' && window.wp.a11y && window.wp.a11y.speak ) ? window.wp.a11y.speak : function() {};
		var haslinkerror = false;
		var __ = window.wp.i18n.__;
		var _n = window.wp.i18n._n;
		var sprintf = window.wp.i18n.sprintf;

		function getselectedlink() {
			var href, html,
				node = editor.selection.getstart(),
				link = editor.dom.getparent( node, 'a[href]' );

			if ( ! link ) {
				html = editor.selection.getcontent({ format: 'raw' });

				if ( html && html.indexof( '</a>' ) !== -1 ) {
					href = html.match( /href="([^">]+)"/ );

					if ( href && href[1] ) {
						link = editor.$( 'a[href="' + href[1] + '"]', node )[0];
					}

					if ( link ) {
						editor.selection.select( link );
					}
				}
			}

			return link;
		}

		function removeplaceholders() {
			editor.$( 'a' ).each( function( i, element ) {
				var $element = editor.$( element );

				if ( $element.attr( 'href' ) === '_wp_link_placeholder' ) {
					editor.dom.remove( element, true );
				} else if ( $element.attr( 'data-wplink-edit' ) ) {
					$element.attr( 'data-wplink-edit', null );
				}
			});
		}

		function removeplaceholderstrings( content, dataattr ) {
			return content.replace( /(<a [^>]+>)([\s\s]*?)<\/a>/g, function( all, tag, text ) {
				if ( tag.indexof( ' href="_wp_link_placeholder"' ) > -1 ) {
					return text;
				}

				if ( dataattr ) {
					tag = tag.replace( / data-wplink-edit="true"/g, '' );
				}

				tag = tag.replace( / data-wplink-url-error="true"/g, '' );

				return tag + text + '</a>';
			});
		}

		function checklink( node ) {
			var $link = editor.$( node );
			var href = $link.attr( 'href' );

			if ( ! href || typeof $ === 'undefined' ) {
				return;
			}

			haslinkerror = false;

			if ( /^http/i.test( href ) && ( ! urlregex1.test( href ) || ! urlregex2.test( href ) ) ) {
				haslinkerror = true;
				$link.attr( 'data-wplink-url-error', 'true' );
				speak( editor.translate( 'warning: the link has been inserted but may have errors. please test it.' ), 'assertive' );
			} else {
				$link.removeattr( 'data-wplink-url-error' );
			}
		}

		editor.on( 'preinit', function() {
			if ( editor.wp && editor.wp._createtoolbar ) {
				toolbar = editor.wp._createtoolbar( [
					'wp_link_preview',
					'wp_link_edit',
					'wp_link_remove'
				], true );

				var editbuttons = [
					'wp_link_input',
					'wp_link_apply'
				];

				if ( typeof window.wplink !== 'undefined' ) {
					editbuttons.push( 'wp_link_advanced' );
				}

				edittoolbar = editor.wp._createtoolbar( editbuttons, true );

				edittoolbar.on( 'show', function() {
					if ( typeof window.wplink === 'undefined' || ! window.wplink.modalopen ) {
						window.settimeout( function() {
							var element = edittoolbar.$el.find( 'input.ui-autocomplete-input' )[0],
								selection = linknode && ( linknode.textcontent || linknode.innertext );

							if ( element ) {
								if ( ! element.value && selection && typeof window.wplink !== 'undefined' ) {
									element.value = window.wplink.geturlfromselection( selection );
								}

								if ( ! doingundoredo ) {
									element.focus();
									element.select();
								}
							}
						} );
					}
				} );

				edittoolbar.on( 'hide', function() {
					if ( ! edittoolbar.scrolling ) {
						editor.execcommand( 'wp_link_cancel' );
					}
				} );
			}
		} );

		editor.addcommand( 'wp_link', function() {
			if ( tinymce.env.ie && tinymce.env.ie < 10 && typeof window.wplink !== 'undefined' ) {
				window.wplink.open( editor.id );
				return;
			}

			linknode = getselectedlink();
			edittoolbar.temphide = false;

			if ( ! linknode ) {
				removeplaceholders();
				editor.execcommand( 'mceinsertlink', false, { href: '_wp_link_placeholder' } );

				linknode = editor.$( 'a[href="_wp_link_placeholder"]' )[0];
				editor.nodechanged();
			}

			editor.dom.setattribs( linknode, { 'data-wplink-edit': true } );
		} );

		editor.addcommand( 'wp_link_apply', function() {
			if ( edittoolbar.scrolling ) {
				return;
			}

			var href, text;

			if ( linknode ) {
				href = inputinstance.geturl();
				text = inputinstance.getlinktext();
				editor.focus();

				var parser = document.createelement( 'a' );
				parser.href = href;

				if ( 'javascript:' === parser.protocol || 'data:' === parser.protocol ) { // jshint ignore:line
					href = '';
				}

				if ( ! href ) {
					editor.dom.remove( linknode, true );
					return;
				}

				if ( ! /^(?:[a-z]+:|#|\?|\.|\/)/.test( href ) && ! emailregex.test( href ) ) {
					href = 'http://' + href;
				}

				editor.dom.setattribs( linknode, { href: href, 'data-wplink-edit': null } );

				if ( ! tinymce.trim( linknode.innerhtml ) ) {
					editor.$( linknode ).text( text || href );
				}

				checklink( linknode );
			}

			inputinstance.reset();
			editor.nodechanged();

			// audible confirmation message when a link has been inserted in the editor.
			if ( typeof window.wplinkl10n !== 'undefined' && ! haslinkerror ) {
				speak( window.wplinkl10n.linkinserted );
			}
		} );

		editor.addcommand( 'wp_link_cancel', function() {
			inputinstance.reset();

			if ( ! edittoolbar.temphide ) {
				removeplaceholders();
			}
		} );

		editor.addcommand( 'wp_unlink', function() {
			editor.execcommand( 'unlink' );
			edittoolbar.temphide = false;
			editor.execcommand( 'wp_link_cancel' );
		} );

		// wp default shortcuts.
		editor.addshortcut( 'access+a', '', 'wp_link' );
		editor.addshortcut( 'access+s', '', 'wp_unlink' );
		// the "de-facto standard" shortcut, see #27305.
		editor.addshortcut( 'meta+k', '', 'wp_link' );

		editor.addbutton( 'link', {
			icon: 'link',
			tooltip: 'insert/edit link',
			cmd: 'wp_link',
			stateselector: 'a[href]'
		});

		editor.addbutton( 'unlink', {
			icon: 'unlink',
			tooltip: 'remove link',
			cmd: 'unlink'
		});

		editor.addmenuitem( 'link', {
			icon: 'link',
			text: 'insert/edit link',
			cmd: 'wp_link',
			stateselector: 'a[href]',
			context: 'insert',
			prependtocontext: true
		});

		editor.on( 'pastepreprocess', function( event ) {
			var pastedstr = event.content,
				regexp = /^(?:https?:)?\/\/\s+$/i;

			if ( ! editor.selection.iscollapsed() && ! regexp.test( editor.selection.getcontent() ) ) {
				pastedstr = pastedstr.replace( /<[^>]+>/g, '' );
				pastedstr = tinymce.trim( pastedstr );

				if ( regexp.test( pastedstr ) ) {
					editor.execcommand( 'mceinsertlink', false, {
						href: editor.dom.decode( pastedstr )
					} );

					event.preventdefault();
				}
			}
		} );

		// remove any remaining placeholders on saving.
		editor.on( 'savecontent', function( event ) {
			event.content = removeplaceholderstrings( event.content, true );
		});

		// prevent adding undo levels on inserting link placeholder.
		editor.on( 'beforeaddundo', function( event ) {
			if ( event.lastlevel && event.lastlevel.content && event.level.content &&
				event.lastlevel.content === removeplaceholderstrings( event.level.content ) ) {

				event.preventdefault();
			}
		});

		// when doing undo and redo with keyboard shortcuts (ctrl|cmd+z, ctrl|cmd+shift+z, ctrl|cmd+y),
		// set a flag to not focus the inline dialog. the editor has to remain focused so the users can do consecutive undo/redo.
		editor.on( 'keydown', function( event ) {
			if ( event.keycode === 27 ) { // esc
				editor.execcommand( 'wp_link_cancel' );
			}

			if ( event.altkey || ( tinymce.env.mac && ( ! event.metakey || event.ctrlkey ) ) ||
				( ! tinymce.env.mac && ! event.ctrlkey ) ) {

				return;
			}

			if ( event.keycode === 89 || event.keycode === 90 ) { // y or z
				doingundoredo = true;

				window.cleartimeout( doingundoredotimer );
				doingundoredotimer = window.settimeout( function() {
					doingundoredo = false;
				}, 500 );
			}
		} );

		editor.addbutton( 'wp_link_preview', {
			type: 'wplinkpreview',
			onpostrender: function() {
				previewinstance = this;
			}
		} );

		editor.addbutton( 'wp_link_input', {
			type: 'wplinkinput',
			onpostrender: function() {
				var element = this.getel(),
					input = element.firstchild.nextsibling,
					$input, cache, last;

				inputinstance = this;

				if ( $ && $.ui && $.ui.autocomplete ) {
					$input = $( input );

					$input.on( 'keydown', function() {
						$input.removeattr( 'aria-activedescendant' );
					} )
					.autocomplete( {
						source: function( request, response ) {
							if ( last === request.term ) {
								response( cache );
								return;
							}

							if ( /^https?:/.test( request.term ) || request.term.indexof( '.' ) !== -1 ) {
								return response();
							}

							$.post( window.ajaxurl, {
								action: 'wp-link-ajax',
								page: 1,
								search: request.term,
								_ajax_linking_nonce: $( '#_ajax_linking_nonce' ).val()
							}, function( data ) {
								cache = data;
								response( data );
							}, 'json' );

							last = request.term;
						},
						focus: function( event, ui ) {
							$input.attr( 'aria-activedescendant', 'mce-wp-autocomplete-' + ui.item.id );
							/*
							 * don't empty the url input field, when using the arrow keys to
							 * highlight items. see api.jqueryui.com/autocomplete/#event-focus
							 */
							event.preventdefault();
						},
						select: function( event, ui ) {
							$input.val( ui.item.permalink );
							$( element.firstchild.nextsibling.nextsibling ).val( ui.item.title );

							if ( 9 === event.keycode && typeof window.wplinkl10n !== 'undefined' ) {
								// audible confirmation message when a link has been selected.
								speak( window.wplinkl10n.linkselected );
							}

							return false;
						},
						open: function() {
							$input.attr( 'aria-expanded', 'true' );
							edittoolbar.blockhide = true;
						},
						close: function() {
							$input.attr( 'aria-expanded', 'false' );
							edittoolbar.blockhide = false;
						},
						minlength: 2,
						position: {
							my: 'left top+2'
						},
						messages: {
							noresults: __( 'no results found.' ) ,
							results: function( number ) {
								return sprintf(
									/* translators: %d: number of search results found. */
									_n(
										'%d result found. use up and down arrow keys to navigate.',
										'%d results found. use up and down arrow keys to navigate.',
										number
									),
									number
								);
							}
						}
					} ).autocomplete( 'instance' )._renderitem = function( ul, item ) {
						var fallbacktitle = ( typeof window.wplinkl10n !== 'undefined' ) ? window.wplinkl10n.notitle : '',
							title = item.title ? item.title : fallbacktitle;

						return $( '<li role="option" id="mce-wp-autocomplete-' + item.id + '">' )
						.append( '<span>' + title + '</span>&nbsp;<span class="wp-editor-float-right">' + item.info + '</span>' )
						.appendto( ul );
					};

					$input.attr( {
						'role': 'combobox',
						'aria-autocomplete': 'list',
						'aria-expanded': 'false',
						'aria-owns': $input.autocomplete( 'widget' ).attr( 'id' )
					} )
					.on( 'focus', function() {
						var inputvalue = $input.val();
						/*
						 * don't trigger a search if the url field already has a link or is empty.
						 * also, avoids screen readers announce `no search results`.
						 */
						if ( inputvalue && ! /^https?:/.test( inputvalue ) ) {
							$input.autocomplete( 'search' );
						}
					} )
					// returns a jquery object containing the menu element.
					.autocomplete( 'widget' )
						.addclass( 'wplink-autocomplete' )
						.attr( 'role', 'listbox' )
						.removeattr( 'tabindex' ) // remove the `tabindex=0` attribute added by jquery ui.
						/*
						 * looks like safari and voiceover need an `aria-selected` attribute. see ticket #33301.
						 * the `menufocus` and `menublur` events are the same events used to add and remove
						 * the `ui-state-focus` css class on the menu items. see jquery ui menu widget.
						 */
						.on( 'menufocus', function( event, ui ) {
							ui.item.attr( 'aria-selected', 'true' );
						})
						.on( 'menublur', function() {
							/*
							 * the `menublur` event returns an object where the item is `null`
							 * so we need to find the active item with other means.
							 */
							$( this ).find( '[aria-selected="true"]' ).removeattr( 'aria-selected' );
						});
				}

				tinymce.$( input ).on( 'keydown', function( event ) {
					if ( event.keycode === 13 ) {
						editor.execcommand( 'wp_link_apply' );
						event.preventdefault();
					}
				} );
			}
		} );

		editor.on( 'wptoolbar', function( event ) {
			var linknode = editor.dom.getparent( event.element, 'a' ),
				$linknode, href, edit;

			if ( typeof window.wplink !== 'undefined' && window.wplink.modalopen ) {
				edittoolbar.temphide = true;
				return;
			}

			edittoolbar.temphide = false;

			if ( linknode ) {
				$linknode = editor.$( linknode );
				href = $linknode.attr( 'href' );
				edit = $linknode.attr( 'data-wplink-edit' );

				if ( href === '_wp_link_placeholder' || edit ) {
					if ( href !== '_wp_link_placeholder' && ! inputinstance.geturl() ) {
						inputinstance.seturl( href );
					}

					event.element = linknode;
					event.toolbar = edittoolbar;
				} else if ( href && ! $linknode.find( 'img' ).length ) {
					previewinstance.seturl( href );
					event.element = linknode;
					event.toolbar = toolbar;

					if ( $linknode.attr( 'data-wplink-url-error' ) === 'true' ) {
						toolbar.$el.find( '.wp-link-preview a' ).addclass( 'wplink-url-error' );
					} else {
						toolbar.$el.find( '.wp-link-preview a' ).removeclass( 'wplink-url-error' );
						haslinkerror = false;
					}
				}
			} else if ( edittoolbar.visible() ) {
				editor.execcommand( 'wp_link_cancel' );
			}
		} );

		editor.addbutton( 'wp_link_edit', {
			tooltip: 'edit|button', // '|button' is not displayed, only used for context.
			icon: 'dashicon dashicons-edit',
			cmd: 'wp_link'
		} );

		editor.addbutton( 'wp_link_remove', {
			tooltip: 'remove link',
			icon: 'dashicon dashicons-editor-unlink',
			cmd: 'wp_unlink'
		} );

		editor.addbutton( 'wp_link_advanced', {
			tooltip: 'link options',
			icon: 'dashicon dashicons-admin-generic',
			onclick: function() {
				if ( typeof window.wplink !== 'undefined' ) {
					var url = inputinstance.geturl() || null,
						text = inputinstance.getlinktext() || null;

					window.wplink.open( editor.id, url, text );

					edittoolbar.temphide = true;
					edittoolbar.hide();
				}
			}
		} );

		editor.addbutton( 'wp_link_apply', {
			tooltip: 'apply',
			icon: 'dashicon dashicons-editor-break',
			cmd: 'wp_link_apply',
			classes: 'widget btn primary'
		} );

		return {
			close: function() {
				edittoolbar.temphide = false;
				editor.execcommand( 'wp_link_cancel' );
			},
			checklink: checklink
		};
	} );
} )( window.tinymce );


