/**
 * @output wp-includes/js/wplink.js
 */

 /* global wplink */

( function( $, wplinkl10n, wp ) {
	var editor, searchtimer, river, query, correctedurl,
		emailregexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i,
		urlregexp = /^(https?|ftp):\/\/[a-z0-9.-]+\.[a-z]{2,63}[^ "]*$/i,
		inputs = {},
		rivers = {},
		istouch = ( 'ontouchend' in document );

	function getlink() {
		if ( editor ) {
			return editor.$( 'a[data-wplink-edit="true"]' );
		}

		return null;
	}

	window.wplink = {
		timetotriggerriver: 150,
		minriverajaxduration: 200,
		riverbottomthreshold: 5,
		keysensitivity: 100,
		lastsearch: '',
		textarea: '',
		modalopen: false,

		init: function() {
			inputs.wrap = $('#wp-link-wrap');
			inputs.dialog = $( '#wp-link' );
			inputs.backdrop = $( '#wp-link-backdrop' );
			inputs.submit = $( '#wp-link-submit' );
			inputs.close = $( '#wp-link-close' );

			// input.
			inputs.text = $( '#wp-link-text' );
			inputs.url = $( '#wp-link-url' );
			inputs.nonce = $( '#_ajax_linking_nonce' );
			inputs.openinnewtab = $( '#wp-link-target' );
			inputs.search = $( '#wp-link-search' );

			// build rivers.
			rivers.search = new river( $( '#search-results' ) );
			rivers.recent = new river( $( '#most-recent-results' ) );
			rivers.elements = inputs.dialog.find( '.query-results' );

			// get search notice text.
			inputs.querynotice = $( '#query-notice-message' );
			inputs.querynoticetextdefault = inputs.querynotice.find( '.query-notice-default' );
			inputs.querynoticetexthint = inputs.querynotice.find( '.query-notice-hint' );

			// bind event handlers.
			inputs.dialog.on( 'keydown', wplink.keydown );
			inputs.dialog.on( 'keyup', wplink.keyup );
			inputs.submit.on( 'click', function( event ) {
				event.preventdefault();
				wplink.update();
			});

			inputs.close.add( inputs.backdrop ).add( '#wp-link-cancel button' ).on( 'click', function( event ) {
				event.preventdefault();
				wplink.close();
			});

			rivers.elements.on( 'river-select', wplink.updatefields );

			// display 'hint' message when search field or 'query-results' box are focused.
			inputs.search.on( 'focus.wplink', function() {
				inputs.querynoticetextdefault.hide();
				inputs.querynoticetexthint.removeclass( 'screen-reader-text' ).show();
			} ).on( 'blur.wplink', function() {
				inputs.querynoticetextdefault.show();
				inputs.querynoticetexthint.addclass( 'screen-reader-text' ).hide();
			} );

			inputs.search.on( 'keyup input', function() {
				window.cleartimeout( searchtimer );
				searchtimer = window.settimeout( function() {
					wplink.searchinternallinks();
				}, 500 );
			});

			inputs.url.on( 'paste', function() {
				settimeout( wplink.correcturl, 0 );
			} );

			inputs.url.on( 'blur', wplink.correcturl );
		},

		// if url wasn't corrected last time and doesn't start with http:, https:, ? # or /, prepend http://.
		correcturl: function () {
			var url = inputs.url.val().trim();

			if ( url && correctedurl !== url && ! /^(?:[a-z]+:|#|\?|\.|\/)/.test( url ) ) {
				inputs.url.val( 'http://' + url );
				correctedurl = url;
			}
		},

		open: function( editorid, url, text ) {
			var ed,
				$body = $( document.body );

			$( '#wpwrap' ).attr( 'aria-hidden', 'true' );
			$body.addclass( 'modal-open' );
			wplink.modalopen = true;

			wplink.range = null;

			if ( editorid ) {
				window.wpactiveeditor = editorid;
			}

			if ( ! window.wpactiveeditor ) {
				return;
			}

			this.textarea = $( '#' + window.wpactiveeditor ).get( 0 );

			if ( typeof window.tinymce !== 'undefined' ) {
				// make sure the link wrapper is the last element in the body,
				// or the inline editor toolbar may show above the backdrop.
				$body.append( inputs.backdrop, inputs.wrap );

				ed = window.tinymce.get( window.wpactiveeditor );

				if ( ed && ! ed.ishidden() ) {
					editor = ed;
				} else {
					editor = null;
				}
			}

			if ( ! wplink.ismce() && document.selection ) {
				this.textarea.focus();
				this.range = document.selection.createrange();
			}

			inputs.wrap.show();
			inputs.backdrop.show();

			wplink.refresh( url, text );

			$( document ).trigger( 'wplink-open', inputs.wrap );
		},

		ismce: function() {
			return editor && ! editor.ishidden();
		},

		refresh: function( url, text ) {
			var linktext = '';

			// refresh rivers (clear links, check visibility).
			rivers.search.refresh();
			rivers.recent.refresh();

			if ( wplink.ismce() ) {
				wplink.mcerefresh( url, text );
			} else {
				// for the code editor the "link text" field is always shown.
				if ( ! inputs.wrap.hasclass( 'has-text-field' ) ) {
					inputs.wrap.addclass( 'has-text-field' );
				}

				if ( document.selection ) {
					// old ie.
					linktext = document.selection.createrange().text || text || '';
				} else if ( typeof this.textarea.selectionstart !== 'undefined' &&
					( this.textarea.selectionstart !== this.textarea.selectionend ) ) {
					// w3c.
					text = this.textarea.value.substring( this.textarea.selectionstart, this.textarea.selectionend ) || text || '';
				}

				inputs.text.val( text );
				wplink.setdefaultvalues();
			}

			if ( istouch ) {
				// close the onscreen keyboard.
				inputs.url.trigger( 'focus' ).trigger( 'blur' );
			} else {
				/*
				 * focus the url field and highlight its contents.
				 * if this is moved above the selection changes,
				 * ie will show a flashing cursor over the dialog.
				 */
				window.settimeout( function() {
					inputs.url[0].select();
					inputs.url.trigger( 'focus' );
				} );
			}

			// load the most recent results if this is the first time opening the panel.
			if ( ! rivers.recent.ul.children().length ) {
				rivers.recent.ajax();
			}

			correctedurl = inputs.url.val().replace( /^http:\/\//, '' );
		},

		hasselectedtext: function( linknode ) {
			var node, nodes, i, html = editor.selection.getcontent();

			// partial html and not a fully selected anchor element.
			if ( /</.test( html ) && ( ! /^<a [^>]+>[^<]+<\/a>$/.test( html ) || html.indexof('href=') === -1 ) ) {
				return false;
			}

			if ( linknode.length ) {
				nodes = linknode[0].childnodes;

				if ( ! nodes || ! nodes.length ) {
					return false;
				}

				for ( i = nodes.length - 1; i >= 0; i-- ) {
					node = nodes[i];

					if ( node.nodetype != 3 && ! window.tinymce.dom.bookmarkmanager.isbookmarknode( node ) ) {
						return false;
					}
				}
			}

			return true;
		},

		mcerefresh: function( searchstr, text ) {
			var linktext, href,
				linknode = getlink(),
				onlytext = this.hasselectedtext( linknode );

			if ( linknode.length ) {
				linktext = linknode.text();
				href = linknode.attr( 'href' );

				if ( ! linktext.trim() ) {
					linktext = text || '';
				}

				if ( searchstr && ( urlregexp.test( searchstr ) || emailregexp.test( searchstr ) ) ) {
					href = searchstr;
				}

				if ( href !== '_wp_link_placeholder' ) {
					inputs.url.val( href );
					inputs.openinnewtab.prop( 'checked', '_blank' === linknode.attr( 'target' ) );
					inputs.submit.val( wplinkl10n.update );
				} else {
					this.setdefaultvalues( linktext );
				}

				if ( searchstr && searchstr !== href ) {
					// the user has typed something in the inline dialog. trigger a search with it.
					inputs.search.val( searchstr );
				} else {
					inputs.search.val( '' );
				}

				// always reset the search.
				window.settimeout( function() {
					wplink.searchinternallinks();
				} );
			} else {
				linktext = editor.selection.getcontent({ format: 'text' }) || text || '';
				this.setdefaultvalues( linktext );
			}

			if ( onlytext ) {
				inputs.text.val( linktext );
				inputs.wrap.addclass( 'has-text-field' );
			} else {
				inputs.text.val( '' );
				inputs.wrap.removeclass( 'has-text-field' );
			}
		},

		close: function( reset ) {
			$( document.body ).removeclass( 'modal-open' );
			$( '#wpwrap' ).removeattr( 'aria-hidden' );
			wplink.modalopen = false;

			if ( reset !== 'noreset' ) {
				if ( ! wplink.ismce() ) {
					wplink.textarea.focus();

					if ( wplink.range ) {
						wplink.range.movetobookmark( wplink.range.getbookmark() );
						wplink.range.select();
					}
				} else {
					if ( editor.plugins.wplink ) {
						editor.plugins.wplink.close();
					}

					editor.focus();
				}
			}

			inputs.backdrop.hide();
			inputs.wrap.hide();

			correctedurl = false;

			$( document ).trigger( 'wplink-close', inputs.wrap );
		},

		getattrs: function() {
			wplink.correcturl();

			return {
				href: inputs.url.val().trim(),
				target: inputs.openinnewtab.prop( 'checked' ) ? '_blank' : null
			};
		},

		buildhtml: function(attrs) {
			var html = '<a href="' + attrs.href + '"';

			if ( attrs.target ) {
				html += ' target="' + attrs.target + '"';
			}

			return html + '>';
		},

		update: function() {
			if ( wplink.ismce() ) {
				wplink.mceupdate();
			} else {
				wplink.htmlupdate();
			}
		},

		htmlupdate: function() {
			var attrs, text, html, begin, end, cursor, selection,
				textarea = wplink.textarea;

			if ( ! textarea ) {
				return;
			}

			attrs = wplink.getattrs();
			text = inputs.text.val();

			var parser = document.createelement( 'a' );
			parser.href = attrs.href;

			if ( 'javascript:' === parser.protocol || 'data:' === parser.protocol ) { // jshint ignore:line
				attrs.href = '';
			}

			// if there's no href, return.
			if ( ! attrs.href ) {
				return;
			}

			html = wplink.buildhtml(attrs);

			// insert html.
			if ( document.selection && wplink.range ) {
				// ie.
				// note: if no text is selected, ie will not place the cursor
				// inside the closing tag.
				textarea.focus();
				wplink.range.text = html + ( text || wplink.range.text ) + '</a>';
				wplink.range.movetobookmark( wplink.range.getbookmark() );
				wplink.range.select();

				wplink.range = null;
			} else if ( typeof textarea.selectionstart !== 'undefined' ) {
				// w3c.
				begin = textarea.selectionstart;
				end = textarea.selectionend;
				selection = text || textarea.value.substring( begin, end );
				html = html + selection + '</a>';
				cursor = begin + html.length;

				// if no text is selected, place the cursor inside the closing tag.
				if ( begin === end && ! selection ) {
					cursor -= 4;
				}

				textarea.value = (
					textarea.value.substring( 0, begin ) +
					html +
					textarea.value.substring( end, textarea.value.length )
				);

				// update cursor position.
				textarea.selectionstart = textarea.selectionend = cursor;
			}

			wplink.close();
			textarea.focus();
			$( textarea ).trigger( 'change' );

			// audible confirmation message when a link has been inserted in the editor.
			wp.a11y.speak( wplinkl10n.linkinserted );
		},

		mceupdate: function() {
			var attrs = wplink.getattrs(),
				$link, text, hastext;

			var parser = document.createelement( 'a' );
			parser.href = attrs.href;

			if ( 'javascript:' === parser.protocol || 'data:' === parser.protocol ) { // jshint ignore:line
				attrs.href = '';
			}

			if ( ! attrs.href ) {
				editor.execcommand( 'unlink' );
				wplink.close();
				return;
			}

			$link = getlink();

			editor.undomanager.transact( function() {
				if ( ! $link.length ) {
					editor.execcommand( 'mceinsertlink', false, { href: '_wp_link_placeholder', 'data-wp-temp-link': 1 } );
					$link = editor.$( 'a[data-wp-temp-link="1"]' ).removeattr( 'data-wp-temp-link' );
					hastext = $link.text().trim();
				}

				if ( ! $link.length ) {
					editor.execcommand( 'unlink' );
				} else {
					if ( inputs.wrap.hasclass( 'has-text-field' ) ) {
						text = inputs.text.val();

						if ( text ) {
							$link.text( text );
						} else if ( ! hastext ) {
							$link.text( attrs.href );
						}
					}

					attrs['data-wplink-edit'] = null;
					attrs['data-mce-href'] = attrs.href;
					$link.attr( attrs );
				}
			} );

			wplink.close( 'noreset' );
			editor.focus();

			if ( $link.length ) {
				editor.selection.select( $link[0] );

				if ( editor.plugins.wplink ) {
					editor.plugins.wplink.checklink( $link[0] );
				}
			}

			editor.nodechanged();

			// audible confirmation message when a link has been inserted in the editor.
			wp.a11y.speak( wplinkl10n.linkinserted );
		},

		updatefields: function( e, li ) {
			inputs.url.val( li.children( '.item-permalink' ).val() );

			if ( inputs.wrap.hasclass( 'has-text-field' ) && ! inputs.text.val() ) {
				inputs.text.val( li.children( '.item-title' ).text() );
			}
		},

		geturlfromselection: function( selection ) {
			if ( ! selection ) {
				if ( this.ismce() ) {
					selection = editor.selection.getcontent({ format: 'text' });
				} else if ( document.selection && wplink.range ) {
					selection = wplink.range.text;
				} else if ( typeof this.textarea.selectionstart !== 'undefined' ) {
					selection = this.textarea.value.substring( this.textarea.selectionstart, this.textarea.selectionend );
				}
			}

			selection = selection || '';
			selection = selection.trim();

			if ( selection && emailregexp.test( selection ) ) {
				// selection is email address.
				return 'mailto:' + selection;
			} else if ( selection && urlregexp.test( selection ) ) {
				// selection is url.
				return selection.replace( /&amp;|&#0?38;/gi, '&' );
			}

			return '';
		},

		setdefaultvalues: function( selection ) {
			inputs.url.val( this.geturlfromselection( selection ) );

			// empty the search field and swap the "rivers".
			inputs.search.val('');
			wplink.searchinternallinks();

			// update save prompt.
			inputs.submit.val( wplinkl10n.save );
		},

		searchinternallinks: function() {
			var waiting,
				search = inputs.search.val() || '',
				mininputlength = parseint( wplinkl10n.mininputlength, 10 ) || 3;

			if ( search.length >= mininputlength ) {
				rivers.recent.hide();
				rivers.search.show();

				// don't search if the keypress didn't change the title.
				if ( wplink.lastsearch == search )
					return;

				wplink.lastsearch = search;
				waiting = inputs.search.parent().find( '.spinner' ).addclass( 'is-active' );

				rivers.search.change( search );
				rivers.search.ajax( function() {
					waiting.removeclass( 'is-active' );
				});
			} else {
				rivers.search.hide();
				rivers.recent.show();
			}
		},

		next: function() {
			rivers.search.next();
			rivers.recent.next();
		},

		prev: function() {
			rivers.search.prev();
			rivers.recent.prev();
		},

		keydown: function( event ) {
			var fn, id;

			// escape key.
			if ( 27 === event.keycode ) {
				wplink.close();
				event.stopimmediatepropagation();
			// tab key.
			} else if ( 9 === event.keycode ) {
				id = event.target.id;

				// wp-link-submit must always be the last focusable element in the dialog.
				// following focusable elements will be skipped on keyboard navigation.
				if ( id === 'wp-link-submit' && ! event.shiftkey ) {
					inputs.close.trigger( 'focus' );
					event.preventdefault();
				} else if ( id === 'wp-link-close' && event.shiftkey ) {
					inputs.submit.trigger( 'focus' );
					event.preventdefault();
				}
			}

			// up arrow and down arrow keys.
			if ( event.shiftkey || ( 38 !== event.keycode && 40 !== event.keycode ) ) {
				return;
			}

			if ( document.activeelement &&
				( document.activeelement.id === 'link-title-field' || document.activeelement.id === 'url-field' ) ) {
				return;
			}

			// up arrow key.
			fn = 38 === event.keycode ? 'prev' : 'next';
			clearinterval( wplink.keyinterval );
			wplink[ fn ]();
			wplink.keyinterval = setinterval( wplink[ fn ], wplink.keysensitivity );
			event.preventdefault();
		},

		keyup: function( event ) {
			// up arrow and down arrow keys.
			if ( 38 === event.keycode || 40 === event.keycode ) {
				clearinterval( wplink.keyinterval );
				event.preventdefault();
			}
		},

		delayedcallback: function( func, delay ) {
			var timeouttriggered, functriggered, funcargs, funccontext;

			if ( ! delay )
				return func;

			settimeout( function() {
				if ( functriggered )
					return func.apply( funccontext, funcargs );
				// otherwise, wait.
				timeouttriggered = true;
			}, delay );

			return function() {
				if ( timeouttriggered )
					return func.apply( this, arguments );
				// otherwise, wait.
				funcargs = arguments;
				funccontext = this;
				functriggered = true;
			};
		}
	};

	river = function( element, search ) {
		var self = this;
		this.element = element;
		this.ul = element.children( 'ul' );
		this.contentheight = element.children( '#link-selector-height' );
		this.waiting = element.find('.river-waiting');

		this.change( search );
		this.refresh();

		$( '#wp-link .query-results, #wp-link #link-selector' ).on( 'scroll', function() {
			self.maybeload();
		});
		element.on( 'click', 'li', function( event ) {
			self.select( $( this ), event );
		});
	};

	$.extend( river.prototype, {
		refresh: function() {
			this.deselect();
			this.visible = this.element.is( ':visible' );
		},
		show: function() {
			if ( ! this.visible ) {
				this.deselect();
				this.element.show();
				this.visible = true;
			}
		},
		hide: function() {
			this.element.hide();
			this.visible = false;
		},
		// selects a list item and triggers the river-select event.
		select: function( li, event ) {
			var liheight, elheight, litop, eltop;

			if ( li.hasclass( 'unselectable' ) || li == this.selected )
				return;

			this.deselect();
			this.selected = li.addclass( 'selected' );
			// make sure the element is visible.
			liheight = li.outerheight();
			elheight = this.element.height();
			litop = li.position().top;
			eltop = this.element.scrolltop();

			if ( litop < 0 ) // make first visible element.
				this.element.scrolltop( eltop + litop );
			else if ( litop + liheight > elheight ) // make last visible element.
				this.element.scrolltop( eltop + litop - elheight + liheight );

			// trigger the river-select event.
			this.element.trigger( 'river-select', [ li, event, this ] );
		},
		deselect: function() {
			if ( this.selected )
				this.selected.removeclass( 'selected' );
			this.selected = false;
		},
		prev: function() {
			if ( ! this.visible )
				return;

			var to;
			if ( this.selected ) {
				to = this.selected.prev( 'li' );
				if ( to.length )
					this.select( to );
			}
		},
		next: function() {
			if ( ! this.visible )
				return;

			var to = this.selected ? this.selected.next( 'li' ) : $( 'li:not(.unselectable):first', this.element );
			if ( to.length )
				this.select( to );
		},
		ajax: function( callback ) {
			var self = this,
				delay = this.query.page == 1 ? 0 : wplink.minriverajaxduration,
				response = wplink.delayedcallback( function( results, params ) {
					self.process( results, params );
					if ( callback )
						callback( results, params );
				}, delay );

			this.query.ajax( response );
		},
		change: function( search ) {
			if ( this.query && this._search == search )
				return;

			this._search = search;
			this.query = new query( search );
			this.element.scrolltop( 0 );
		},
		process: function( results, params ) {
			var list = '', alt = true, classes = '',
				firstpage = params.page == 1;

			if ( ! results ) {
				if ( firstpage ) {
					list += '<li class="unselectable no-matches-found"><span class="item-title"><em>' +
						wplinkl10n.nomatchesfound + '</em></span></li>';
				}
			} else {
				$.each( results, function() {
					classes = alt ? 'alternate' : '';
					classes += this.title ? '' : ' no-title';
					list += classes ? '<li class="' + classes + '">' : '<li>';
					list += '<input type="hidden" class="item-permalink" value="' + this.permalink + '" />';
					list += '<span class="item-title">';
					list += this.title ? this.title : wplinkl10n.notitle;
					list += '</span><span class="item-info">' + this.info + '</span></li>';
					alt = ! alt;
				});
			}

			this.ul[ firstpage ? 'html' : 'append' ]( list );
		},
		maybeload: function() {
			var self = this,
				el = this.element,
				bottom = el.scrolltop() + el.height();

			if ( ! this.query.ready() || bottom < this.contentheight.height() - wplink.riverbottomthreshold )
				return;

			settimeout(function() {
				var newtop = el.scrolltop(),
					newbottom = newtop + el.height();

				if ( ! self.query.ready() || newbottom < self.contentheight.height() - wplink.riverbottomthreshold )
					return;

				self.waiting.addclass( 'is-active' );
				el.scrolltop( newtop + self.waiting.outerheight() );

				self.ajax( function() {
					self.waiting.removeclass( 'is-active' );
				});
			}, wplink.timetotriggerriver );
		}
	});

	query = function( search ) {
		this.page = 1;
		this.allloaded = false;
		this.querying = false;
		this.search = search;
	};

	$.extend( query.prototype, {
		ready: function() {
			return ! ( this.querying || this.allloaded );
		},
		ajax: function( callback ) {
			var self = this,
				query = {
					action : 'wp-link-ajax',
					page : this.page,
					'_ajax_linking_nonce' : inputs.nonce.val()
				};

			if ( this.search )
				query.search = this.search;

			this.querying = true;

			$.post( window.ajaxurl, query, function( r ) {
				self.page++;
				self.querying = false;
				self.allloaded = ! r;
				callback( r, query );
			}, 'json' );
		}
	});

	$( wplink.init );
})( jquery, window.wplinkl10n, window.wp );


