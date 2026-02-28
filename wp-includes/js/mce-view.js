/**
 * @output wp-includes/js/mce-view.js
 */

/* global tinymce */

/*
 * the tinymce view api.
 *
 * note: this api is "experimental" meaning that it will probably change
 * in the next few releases based on feedback from 3.9.0.
 * if you decide to use it, please follow the development closely.
 *
 * diagram
 *
 * |- registered view constructor (type)
 * |  |- view instance (unique text)
 * |  |  |- editor 1
 * |  |  |  |- view node
 * |  |  |  |- view node
 * |  |  |  |- ...
 * |  |  |- editor 2
 * |  |  |  |- ...
 * |  |- view instance
 * |  |  |- ...
 * |- registered view
 * |  |- ...
 */
( function( window, wp, shortcode, $ ) {
	'use strict';

	var views = {},
		instances = {};

	wp.mce = wp.mce || {};

	/**
	 * wp.mce.views
	 *
	 * a set of utilities that simplifies adding custom ui within a tinymce editor.
	 * at its core, it serves as a series of converters, transforming text to a
	 * custom ui, and back again.
	 */
	wp.mce.views = {

		/**
		 * registers a new view type.
		 *
		 * @param {string} type   the view type.
		 * @param {object} extend an object to extend wp.mce.view.prototype with.
		 */
		register: function( type, extend ) {
			views[ type ] = wp.mce.view.extend( _.extend( extend, { type: type } ) );
		},

		/**
		 * unregisters a view type.
		 *
		 * @param {string} type the view type.
		 */
		unregister: function( type ) {
			delete views[ type ];
		},

		/**
		 * returns the settings of a view type.
		 *
		 * @param {string} type the view type.
		 *
		 * @return {function} the view constructor.
		 */
		get: function( type ) {
			return views[ type ];
		},

		/**
		 * unbinds all view nodes.
		 * runs before removing all view nodes from the dom.
		 */
		unbind: function() {
			_.each( instances, function( instance ) {
				instance.unbind();
			} );
		},

		/**
		 * scans a given string for each view's pattern,
		 * replacing any matches with markers,
		 * and creates a new instance for every match.
		 *
		 * @param {string} content the string to scan.
		 * @param {tinymce.editor} editor the editor.
		 *
		 * @return {string} the string with markers.
		 */
		setmarkers: function( content, editor ) {
			var pieces = [ { content: content } ],
				self = this,
				instance, current;

			_.each( views, function( view, type ) {
				current = pieces.slice();
				pieces  = [];

				_.each( current, function( piece ) {
					var remaining = piece.content,
						result, text;

					// ignore processed pieces, but retain their location.
					if ( piece.processed ) {
						pieces.push( piece );
						return;
					}

					// iterate through the string progressively matching views
					// and slicing the string as we go.
					while ( remaining && ( result = view.prototype.match( remaining ) ) ) {
						// any text before the match becomes an unprocessed piece.
						if ( result.index ) {
							pieces.push( { content: remaining.substring( 0, result.index ) } );
						}

						result.options.editor = editor;
						instance = self.createinstance( type, result.content, result.options );
						text = instance.loader ? '.' : instance.text;

						// add the processed piece for the match.
						pieces.push( {
							content: instance.ignore ? text : '<p data-wpview-marker="' + instance.encodedtext + '">' + text + '</p>',
							processed: true
						} );

						// update the remaining content.
						remaining = remaining.slice( result.index + result.content.length );
					}

					// there are no additional matches.
					// if any content remains, add it as an unprocessed piece.
					if ( remaining ) {
						pieces.push( { content: remaining } );
					}
				} );
			} );

			content = _.pluck( pieces, 'content' ).join( '' );
			return content.replace( /<p>\s*<p data-wpview-marker=/g, '<p data-wpview-marker=' ).replace( /<\/p>\s*<\/p>/g, '</p>' );
		},

		/**
		 * create a view instance.
		 *
		 * @param {string}  type    the view type.
		 * @param {string}  text    the textual representation of the view.
		 * @param {object}  options options.
		 * @param {boolean} force   recreate the instance. optional.
		 *
		 * @return {wp.mce.view} the view instance.
		 */
		createinstance: function( type, text, options, force ) {
			var view = this.get( type ),
				encodedtext,
				instance;

			if ( text.indexof( '[' ) !== -1 && text.indexof( ']' ) !== -1 ) {
				// looks like a shortcode? remove any line breaks from inside of shortcodes
				// or autop will replace them with <p> and <br> later and the string won't match.
				text = text.replace( /\[[^\]]+\]/g, function( match ) {
					return match.replace( /[\r\n]/g, '' );
				});
			}

			if ( ! force ) {
				instance = this.getinstance( text );

				if ( instance ) {
					return instance;
				}
			}

			encodedtext = encodeuricomponent( text );

			options = _.extend( options || {}, {
				text: text,
				encodedtext: encodedtext
			} );

			return instances[ encodedtext ] = new view( options );
		},

		/**
		 * get a view instance.
		 *
		 * @param {(string|htmlelement)} object the textual representation of the view or the view node.
		 *
		 * @return {wp.mce.view} the view instance or undefined.
		 */
		getinstance: function( object ) {
			if ( typeof object === 'string' ) {
				return instances[ encodeuricomponent( object ) ];
			}

			return instances[ $( object ).attr( 'data-wpview-text' ) ];
		},

		/**
		 * given a view node, get the view's text.
		 *
		 * @param {htmlelement} node the view node.
		 *
		 * @return {string} the textual representation of the view.
		 */
		gettext: function( node ) {
			return decodeuricomponent( $( node ).attr( 'data-wpview-text' ) || '' );
		},

		/**
		 * renders all view nodes that are not yet rendered.
		 *
		 * @param {boolean} force rerender all view nodes.
		 */
		render: function( force ) {
			_.each( instances, function( instance ) {
				instance.render( null, force );
			} );
		},

		/**
		 * update the text of a given view node.
		 *
		 * @param {string}         text   the new text.
		 * @param {tinymce.editor} editor the tinymce editor instance the view node is in.
		 * @param {htmlelement}    node   the view node to update.
		 * @param {boolean}        force  recreate the instance. optional.
		 */
		update: function( text, editor, node, force ) {
			var instance = this.getinstance( node );

			if ( instance ) {
				instance.update( text, editor, node, force );
			}
		},

		/**
		 * renders any editing interface based on the view type.
		 *
		 * @param {tinymce.editor} editor the tinymce editor instance the view node is in.
		 * @param {htmlelement}    node   the view node to edit.
		 */
		edit: function( editor, node ) {
			var instance = this.getinstance( node );

			if ( instance && instance.edit ) {
				instance.edit( instance.text, function( text, force ) {
					instance.update( text, editor, node, force );
				} );
			}
		},

		/**
		 * remove a given view node from the dom.
		 *
		 * @param {tinymce.editor} editor the tinymce editor instance the view node is in.
		 * @param {htmlelement}    node   the view node to remove.
		 */
		remove: function( editor, node ) {
			var instance = this.getinstance( node );

			if ( instance ) {
				instance.remove( editor, node );
			}
		}
	};

	/**
	 * a backbone-like view constructor intended for use when rendering a tinymce view.
	 * the main difference is that the tinymce view is not tied to a particular dom node.
	 *
	 * @param {object} options options.
	 */
	wp.mce.view = function( options ) {
		_.extend( this, options );
		this.initialize();
	};

	wp.mce.view.extend = backbone.view.extend;

	_.extend( wp.mce.view.prototype, /** @lends wp.mce.view.prototype */{

		/**
		 * the content.
		 *
		 * @type {*}
		 */
		content: null,

		/**
		 * whether or not to display a loader.
		 *
		 * @type {boolean}
		 */
		loader: true,

		/**
		 * runs after the view instance is created.
		 */
		initialize: function() {},

		/**
		 * returns the content to render in the view node.
		 *
		 * @return {*}
		 */
		getcontent: function() {
			return this.content;
		},

		/**
		 * renders all view nodes tied to this view instance that are not yet rendered.
		 *
		 * @param {string}  content the content to render. optional.
		 * @param {boolean} force   rerender all view nodes tied to this view instance. optional.
		 */
		render: function( content, force ) {
			if ( content != null ) {
				this.content = content;
			}

			content = this.getcontent();

			// if there's nothing to render an no loader needs to be shown, stop.
			if ( ! this.loader && ! content ) {
				return;
			}

			// we're about to rerender all views of this instance, so unbind rendered views.
			force && this.unbind();

			// replace any left over markers.
			this.replacemarkers();

			if ( content ) {
				this.setcontent( content, function( editor, node ) {
					$( node ).data( 'rendered', true );
					this.bindnode.call( this, editor, node );
				}, force ? null : false );
			} else {
				this.setloader();
			}
		},

		/**
		 * binds a given node after its content is added to the dom.
		 */
		bindnode: function() {},

		/**
		 * unbinds a given node before its content is removed from the dom.
		 */
		unbindnode: function() {},

		/**
		 * unbinds all view nodes tied to this view instance.
		 * runs before their content is removed from the dom.
		 */
		unbind: function() {
			this.getnodes( function( editor, node ) {
				this.unbindnode.call( this, editor, node );
			}, true );
		},

		/**
		 * gets all the tinymce editor instances that support views.
		 *
		 * @param {function} callback a callback.
		 */
		geteditors: function( callback ) {
			_.each( tinymce.editors, function( editor ) {
				if ( editor.plugins.wpview ) {
					callback.call( this, editor );
				}
			}, this );
		},

		/**
		 * gets all view nodes tied to this view instance.
		 *
		 * @param {function} callback a callback.
		 * @param {boolean}  rendered get (un)rendered view nodes. optional.
		 */
		getnodes: function( callback, rendered ) {
			this.geteditors( function( editor ) {
				var self = this;

				$( editor.getbody() )
					.find( '[data-wpview-text="' + self.encodedtext + '"]' )
					.filter( function() {
						var data;

						if ( rendered == null ) {
							return true;
						}

						data = $( this ).data( 'rendered' ) === true;

						return rendered ? data : ! data;
					} )
					.each( function() {
						callback.call( self, editor, this, this /* back compat */ );
					} );
			} );
		},

		/**
		 * gets all marker nodes tied to this view instance.
		 *
		 * @param {function} callback a callback.
		 */
		getmarkers: function( callback ) {
			this.geteditors( function( editor ) {
				var self = this;

				$( editor.getbody() )
					.find( '[data-wpview-marker="' + this.encodedtext + '"]' )
					.each( function() {
						callback.call( self, editor, this );
					} );
			} );
		},

		/**
		 * replaces all marker nodes tied to this view instance.
		 */
		replacemarkers: function() {
			this.getmarkers( function( editor, node ) {
				var selected = node === editor.selection.getnode();
				var $viewnode;

				if ( ! this.loader && $( node ).text() !== tinymce.dom.decode( this.text ) ) {
					editor.dom.setattrib( node, 'data-wpview-marker', null );
					return;
				}

				$viewnode = editor.$(
					'<div class="wpview wpview-wrap" data-wpview-text="' + this.encodedtext + '" data-wpview-type="' + this.type + '" contenteditable="false"></div>'
				);

				editor.undomanager.ignore( function() {
					editor.$( node ).replacewith( $viewnode );
				} );

				if ( selected ) {
					settimeout( function() {
						editor.undomanager.ignore( function() {
							editor.selection.select( $viewnode[0] );
							editor.selection.collapse();
						} );
					} );
				}
			} );
		},

		/**
		 * removes all marker nodes tied to this view instance.
		 */
		removemarkers: function() {
			this.getmarkers( function( editor, node ) {
				editor.dom.setattrib( node, 'data-wpview-marker', null );
			} );
		},

		/**
		 * sets the content for all view nodes tied to this view instance.
		 *
		 * @param {*}        content  the content to set.
		 * @param {function} callback a callback. optional.
		 * @param {boolean}  rendered only set for (un)rendered nodes. optional.
		 */
		setcontent: function( content, callback, rendered ) {
			if ( _.isobject( content ) && ( content.sandbox || content.head || content.body.indexof( '<script' ) !== -1 ) ) {
				this.setiframes( content.head || '', content.body, callback, rendered );
			} else if ( _.isstring( content ) && content.indexof( '<script' ) !== -1 ) {
				this.setiframes( '', content, callback, rendered );
			} else {
				this.getnodes( function( editor, node ) {
					content = content.body || content;

					if ( content.indexof( '<iframe' ) !== -1 ) {
						content += '<span class="mce-shim"></span>';
					}

					editor.undomanager.transact( function() {
						node.innerhtml = '';
						node.appendchild( _.isstring( content ) ? editor.dom.createfragment( content ) : content );
						editor.dom.add( node, 'span', { 'class': 'wpview-end' } );
					} );

					callback && callback.call( this, editor, node );
				}, rendered );
			}
		},

		/**
		 * sets the content in an iframe for all view nodes tied to this view instance.
		 *
		 * @param {string}   head     html string to be added to the head of the document.
		 * @param {string}   body     html string to be added to the body of the document.
		 * @param {function} callback a callback. optional.
		 * @param {boolean}  rendered only set for (un)rendered nodes. optional.
		 */
		setiframes: function( head, body, callback, rendered ) {
			var self = this;

			if ( body.indexof( '[' ) !== -1 && body.indexof( ']' ) !== -1 ) {
				var shortcodesregexp = new regexp( '\\[\\/?(?:' + window.mceviewl10n.shortcodes.join( '|' ) + ')[^\\]]*?\\]', 'g' );
				// escape tags inside shortcode previews.
				body = body.replace( shortcodesregexp, function( match ) {
					return match.replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
				} );
			}

			this.getnodes( function( editor, node ) {
				var dom = editor.dom,
					styles = '',
					bodyclasses = editor.getbody().classname || '',
					editorhead = editor.getdoc().getelementsbytagname( 'head' )[0],
					iframe, iframewin, iframedoc, mutationobserver, observer, i, block;

				tinymce.each( dom.$( 'link[rel="stylesheet"]', editorhead ), function( link ) {
					if ( link.href && link.href.indexof( 'skins/lightgray/content.min.css' ) === -1 &&
						link.href.indexof( 'skins/wordpress/wp-content.css' ) === -1 ) {

						styles += dom.getouterhtml( link );
					}
				} );

				if ( self.iframeheight ) {
					dom.add( node, 'span', {
						'data-mce-bogus': 1,
						style: {
							display: 'block',
							width: '100%',
							height: self.iframeheight
						}
					}, '\u200b' );
				}

				editor.undomanager.transact( function() {
					node.innerhtml = '';

					iframe = dom.add( node, 'iframe', {
						/* jshint scripturl: true */
						src: tinymce.env.ie ? 'javascript:""' : '',
						frameborder: '0',
						allowtransparency: 'true',
						scrolling: 'no',
						'class': 'wpview-sandbox',
						style: {
							width: '100%',
							display: 'block'
						},
						height: self.iframeheight
					} );

					dom.add( node, 'span', { 'class': 'mce-shim' } );
					dom.add( node, 'span', { 'class': 'wpview-end' } );
				} );

				/*
				 * bail if the iframe node is not attached to the dom.
				 * happens when the view is dragged in the editor.
				 * there is a browser restriction when iframes are moved in the dom. they get emptied.
				 * the iframe will be rerendered after dropping the view node at the new location.
				 */
				if ( ! iframe.contentwindow ) {
					return;
				}

				iframewin = iframe.contentwindow;
				iframedoc = iframewin.document;
				iframedoc.open();

				iframedoc.write(
					'<!doctype html>' +
					'<html>' +
						'<head>' +
							'<meta http-equiv="content-type" content="text/html; charset=utf-8" />' +
							head +
							styles +
							'<style>' +
								'html {' +
									'background: transparent;' +
									'padding: 0;' +
									'margin: 0;' +
								'}' +
								'body#wpview-iframe-sandbox {' +
									'background: transparent;' +
									'padding: 1px 0 !important;' +
									'margin: -1px 0 0 !important;' +
								'}' +
								'body#wpview-iframe-sandbox:before,' +
								'body#wpview-iframe-sandbox:after {' +
									'display: none;' +
									'content: "";' +
								'}' +
								'iframe {' +
									'max-width: 100%;' +
								'}' +
							'</style>' +
						'</head>' +
						'<body id="wpview-iframe-sandbox" class="' + bodyclasses + '">' +
							body +
						'</body>' +
					'</html>'
				);

				iframedoc.close();

				function resize() {
					var $iframe;

					if ( block ) {
						return;
					}

					// make sure the iframe still exists.
					if ( iframe.contentwindow ) {
						$iframe = $( iframe );
						self.iframeheight = $( iframedoc.body ).height();

						if ( $iframe.height() !== self.iframeheight ) {
							$iframe.height( self.iframeheight );
							editor.nodechanged();
						}
					}
				}

				if ( self.iframeheight ) {
					block = true;

					settimeout( function() {
						block = false;
						resize();
					}, 3000 );
				}

				function addobserver() {
					observer = new mutationobserver( _.debounce( resize, 100 ) );

					observer.observe( iframedoc.body, {
						attributes: true,
						childlist: true,
						subtree: true
					} );
				}

				$( iframewin ).on( 'load', resize );

				mutationobserver = iframewin.mutationobserver || iframewin.webkitmutationobserver || iframewin.mozmutationobserver;

				if ( mutationobserver ) {
					if ( ! iframedoc.body ) {
						iframedoc.addeventlistener( 'domcontentloaded', addobserver, false );
					} else {
						addobserver();
					}
				} else {
					for ( i = 1; i < 6; i++ ) {
						settimeout( resize, i * 700 );
					}
				}

				callback && callback.call( self, editor, node );
			}, rendered );
		},

		/**
		 * sets a loader for all view nodes tied to this view instance.
		 */
		setloader: function( dashicon ) {
			this.setcontent(
				'<div class="loading-placeholder">' +
					'<div class="dashicons dashicons-' + ( dashicon || 'admin-media' ) + '"></div>' +
					'<div class="wpview-loading"><ins></ins></div>' +
				'</div>'
			);
		},

		/**
		 * sets an error for all view nodes tied to this view instance.
		 *
		 * @param {string} message  the error message to set.
		 * @param {string} dashicon a dashicon id. optional. {@link https://developer.wordpress.org/resource/dashicons/}
		 */
		seterror: function( message, dashicon ) {
			this.setcontent(
				'<div class="wpview-error">' +
					'<div class="dashicons dashicons-' + ( dashicon || 'no' ) + '"></div>' +
					'<p>' + message + '</p>' +
				'</div>'
			);
		},

		/**
		 * tries to find a text match in a given string.
		 *
		 * @param {string} content the string to scan.
		 *
		 * @return {object}
		 */
		match: function( content ) {
			var match = shortcode.next( this.type, content );

			if ( match ) {
				return {
					index: match.index,
					content: match.content,
					options: {
						shortcode: match.shortcode
					}
				};
			}
		},

		/**
		 * update the text of a given view node.
		 *
		 * @param {string}         text   the new text.
		 * @param {tinymce.editor} editor the tinymce editor instance the view node is in.
		 * @param {htmlelement}    node   the view node to update.
		 * @param {boolean}        force  recreate the instance. optional.
		 */
		update: function( text, editor, node, force ) {
			_.find( views, function( view, type ) {
				var match = view.prototype.match( text );

				if ( match ) {
					$( node ).data( 'rendered', false );
					editor.dom.setattrib( node, 'data-wpview-text', encodeuricomponent( text ) );
					wp.mce.views.createinstance( type, text, match.options, force ).render();

					editor.selection.select( node );
					editor.nodechanged();
					editor.focus();

					return true;
				}
			} );
		},

		/**
		 * remove a given view node from the dom.
		 *
		 * @param {tinymce.editor} editor the tinymce editor instance the view node is in.
		 * @param {htmlelement}    node   the view node to remove.
		 */
		remove: function( editor, node ) {
			this.unbindnode.call( this, editor, node );
			editor.dom.remove( node );
			editor.focus();
		}
	} );
} )( window, window.wp, window.wp.shortcode, window.jquery );

/*
 * the wordpress core tinymce views.
 * views for the gallery, audio, video, playlist and embed shortcodes,
 * and a view for embeddable urls.
 */
( function( window, views, media, $ ) {
	var base, gallery, av, embed,
		schema, parser, serializer;

	function verifyhtml( string ) {
		var settings = {};

		if ( ! window.tinymce ) {
			return string.replace( /<[^>]+>/g, '' );
		}

		if ( ! string || ( string.indexof( '<' ) === -1 && string.indexof( '>' ) === -1 ) ) {
			return string;
		}

		schema = schema || new window.tinymce.html.schema( settings );
		parser = parser || new window.tinymce.html.domparser( settings, schema );
		serializer = serializer || new window.tinymce.html.serializer( settings, schema );

		return serializer.serialize( parser.parse( string, { forced_root_block: false } ) );
	}

	base = {
		state: [],

		edit: function( text, update ) {
			var type = this.type,
				frame = media[ type ].edit( text );

			this.pauseplayers && this.pauseplayers();

			_.each( this.state, function( state ) {
				frame.state( state ).on( 'update', function( selection ) {
					update( media[ type ].shortcode( selection ).string(), type === 'gallery' );
				} );
			} );

			frame.on( 'close', function() {
				frame.detach();
			} );

			frame.open();
		}
	};

	gallery = _.extend( {}, base, {
		state: [ 'gallery-edit' ],
		template: media.template( 'editor-gallery' ),

		initialize: function() {
			var attachments = media.gallery.attachments( this.shortcode, media.view.settings.post.id ),
				attrs = this.shortcode.attrs.named,
				self = this;

			attachments.more()
			.done( function() {
				attachments = attachments.tojson();

				_.each( attachments, function( attachment ) {
					if ( attachment.sizes ) {
						if ( attrs.size && attachment.sizes[ attrs.size ] ) {
							attachment.thumbnail = attachment.sizes[ attrs.size ];
						} else if ( attachment.sizes.thumbnail ) {
							attachment.thumbnail = attachment.sizes.thumbnail;
						} else if ( attachment.sizes.full ) {
							attachment.thumbnail = attachment.sizes.full;
						}
					}
				} );

				self.render( self.template( {
					verifyhtml: verifyhtml,
					attachments: attachments,
					columns: attrs.columns ? parseint( attrs.columns, 10 ) : media.gallerydefaults.columns
				} ) );
			} )
			.fail( function( jqxhr, textstatus ) {
				self.seterror( textstatus );
			} );
		}
	} );

	av = _.extend( {}, base, {
		action: 'parse-media-shortcode',

		initialize: function() {
			var self = this, maxwidth = null;

			if ( this.url ) {
				this.loader = false;
				this.shortcode = media.embed.shortcode( {
					url: this.text
				} );
			}

			// obtain the target width for the embed.
			if ( self.editor ) {
				maxwidth = self.editor.getbody().clientwidth;
			}

			wp.ajax.post( this.action, {
				post_id: media.view.settings.post.id,
				type: this.shortcode.tag,
				shortcode: this.shortcode.string(),
				maxwidth: maxwidth
			} )
			.done( function( response ) {
				self.render( response );
			} )
			.fail( function( response ) {
				if ( self.url ) {
					self.ignore = true;
					self.removemarkers();
				} else {
					self.seterror( response.message || response.statustext, 'admin-media' );
				}
			} );

			this.geteditors( function( editor ) {
				editor.on( 'wpview-selected', function() {
					self.pauseplayers();
				} );
			} );
		},

		pauseplayers: function() {
			this.getnodes( function( editor, node, content ) {
				var win = $( 'iframe.wpview-sandbox', content ).get( 0 );

				if ( win && ( win = win.contentwindow ) && win.mejs ) {
					_.each( win.mejs.players, function( player ) {
						try {
							player.pause();
						} catch ( e ) {}
					} );
				}
			} );
		}
	} );

	embed = _.extend( {}, av, {
		action: 'parse-embed',

		edit: function( text, update ) {
			var frame = media.embed.edit( text, this.url ),
				self = this;

			this.pauseplayers();

			frame.state( 'embed' ).props.on( 'change:url', function( model, url ) {
				if ( url && model.get( 'url' ) ) {
					frame.state( 'embed' ).metadata = model.tojson();
				}
			} );

			frame.state( 'embed' ).on( 'select', function() {
				var data = frame.state( 'embed' ).metadata;

				if ( self.url ) {
					update( data.url );
				} else {
					update( media.embed.shortcode( data ).string() );
				}
			} );

			frame.on( 'close', function() {
				frame.detach();
			} );

			frame.open();
		}
	} );

	views.register( 'gallery', _.extend( {}, gallery ) );

	views.register( 'audio', _.extend( {}, av, {
		state: [ 'audio-details' ]
	} ) );

	views.register( 'video', _.extend( {}, av, {
		state: [ 'video-details' ]
	} ) );

	views.register( 'playlist', _.extend( {}, av, {
		state: [ 'playlist-edit', 'video-playlist-edit' ]
	} ) );

	views.register( 'embed', _.extend( {}, embed ) );

	views.register( 'embedurl', _.extend( {}, embed, {
		match: function( content ) {
			// there may be a "bookmark" node next to the url...
			var re = /(^|<p>(?:<span data-mce-type="bookmark"[^>]+>\s*<\/span>)?)(https?:\/\/[^\s"]+?)((?:<span data-mce-type="bookmark"[^>]+>\s*<\/span>)?<\/p>\s*|$)/gi;
			var match = re.exec( content );

			if ( match ) {
				return {
					index: match.index + match[1].length,
					content: match[2],
					options: {
						url: true
					}
				};
			}
		}
	} ) );
} )( window, window.wp.mce.views, window.wp.media, window.jquery );



