/**
 * @output wp-includes/js/media-editor.js
 */

/* global getusersetting, tinymce, qtags */

// wordpress, tinymce, and media
// -----------------------------
(function($, _){
	/**
	 * stores the editors' `wp.media.controller.frame` instances.
	 *
	 * @static
	 */
	var workflows = {};

	/**
	 * a helper mixin function to avoid truthy and falsey values being
	 *   passed as an input that expects booleans. if key is undefined in the map,
	 *   but has a default value, set it.
	 *
	 * @param {object} attrs map of props from a shortcode or settings.
	 * @param {string} key the key within the passed map to check for a value.
	 * @return {mixed|undefined} the original or coerced value of key within attrs.
	 */
	wp.media.coerce = function ( attrs, key ) {
		if ( _.isundefined( attrs[ key ] ) && ! _.isundefined( this.defaults[ key ] ) ) {
			attrs[ key ] = this.defaults[ key ];
		} else if ( 'true' === attrs[ key ] ) {
			attrs[ key ] = true;
		} else if ( 'false' === attrs[ key ] ) {
			attrs[ key ] = false;
		}
		return attrs[ key ];
	};

	/** @namespace wp.media.string */
	wp.media.string = {
		/**
		 * joins the `props` and `attachment` objects,
		 * outputting the proper object format based on the
		 * attachment's type.
		 *
		 * @param {object} [props={}] attachment details (align, link, size, etc).
		 * @param {object} attachment the attachment object, media version of post.
		 * @return {object} joined props
		 */
		props: function( props, attachment ) {
			var link, linkurl, size, sizes,
				defaultprops = wp.media.view.settings.defaultprops;

			props = props ? _.clone( props ) : {};

			if ( attachment && attachment.type ) {
				props.type = attachment.type;
			}

			if ( 'image' === props.type ) {
				props = _.defaults( props || {}, {
					align:   defaultprops.align || getusersetting( 'align', 'none' ),
					size:    defaultprops.size  || getusersetting( 'imgsize', 'medium' ),
					url:     '',
					classes: []
				});
			}

			// all attachment-specific settings follow.
			if ( ! attachment ) {
				return props;
			}

			props.title = props.title || attachment.title;

			link = props.link || defaultprops.link || getusersetting( 'urlbutton', 'file' );
			if ( 'file' === link || 'embed' === link ) {
				linkurl = attachment.url;
			} else if ( 'post' === link ) {
				linkurl = attachment.link;
			} else if ( 'custom' === link ) {
				linkurl = props.linkurl;
			}
			props.linkurl = linkurl || '';

			// format properties for images.
			if ( 'image' === attachment.type ) {
				props.classes.push( 'wp-image-' + attachment.id );

				sizes = attachment.sizes;
				size = sizes && sizes[ props.size ] ? sizes[ props.size ] : attachment;

				_.extend( props, _.pick( attachment, 'align', 'caption', 'alt' ), {
					width:     size.width,
					height:    size.height,
					src:       size.url,
					captionid: 'attachment_' + attachment.id
				});
			} else if ( 'video' === attachment.type || 'audio' === attachment.type ) {
				_.extend( props, _.pick( attachment, 'title', 'type', 'icon', 'mime' ) );
			// format properties for non-images.
			} else {
				props.title = props.title || attachment.filename;
				props.rel = props.rel || 'attachment wp-att-' + attachment.id;
			}

			return props;
		},
		/**
		 * create link markup that is suitable for passing to the editor
		 *
		 * @param {object} props attachment details (align, link, size, etc).
		 * @param {object} attachment the attachment object, media version of post.
		 * @return {string} the link markup
		 */
		link: function( props, attachment ) {
			var options;

			props = wp.media.string.props( props, attachment );

			options = {
				tag:     'a',
				content: props.title,
				attrs:   {
					href: props.linkurl
				}
			};

			if ( props.rel ) {
				options.attrs.rel = props.rel;
			}

			return wp.html.string( options );
		},
		/**
		 * create an audio shortcode string that is suitable for passing to the editor
		 *
		 * @param {object} props attachment details (align, link, size, etc).
		 * @param {object} attachment the attachment object, media version of post.
		 * @return {string} the audio shortcode
		 */
		audio: function( props, attachment ) {
			return wp.media.string._audiovideo( 'audio', props, attachment );
		},
		/**
		 * create a video shortcode string that is suitable for passing to the editor
		 *
		 * @param {object} props attachment details (align, link, size, etc).
		 * @param {object} attachment the attachment object, media version of post.
		 * @return {string} the video shortcode
		 */
		video: function( props, attachment ) {
			return wp.media.string._audiovideo( 'video', props, attachment );
		},
		/**
		 * helper function to create a media shortcode string
		 *
		 * @access private
		 *
		 * @param {string} type the shortcode tag name: 'audio' or 'video'.
		 * @param {object} props attachment details (align, link, size, etc).
		 * @param {object} attachment the attachment object, media version of post.
		 * @return {string} the media shortcode
		 */
		_audiovideo: function( type, props, attachment ) {
			var shortcode, html, extension;

			props = wp.media.string.props( props, attachment );
			if ( props.link !== 'embed' ) {
				return wp.media.string.link( props );
			}

			shortcode = {};

			if ( 'video' === type ) {
				if ( attachment.image && -1 === attachment.image.src.indexof( attachment.icon ) ) {
					shortcode.poster = attachment.image.src;
				}

				if ( attachment.width ) {
					shortcode.width = attachment.width;
				}

				if ( attachment.height ) {
					shortcode.height = attachment.height;
				}
			}

			extension = attachment.filename.split('.').pop();

			if ( _.contains( wp.media.view.settings.embedexts, extension ) ) {
				shortcode[extension] = attachment.url;
			} else {
				// render unsupported audio and video files as links.
				return wp.media.string.link( props );
			}

			html = wp.shortcode.string({
				tag:     type,
				attrs:   shortcode
			});

			return html;
		},
		/**
		 * create image markup, optionally with a link and/or wrapped in a caption shortcode,
		 *  that is suitable for passing to the editor
		 *
		 * @param {object} props attachment details (align, link, size, etc).
		 * @param {object} attachment the attachment object, media version of post.
		 * @return {string}
		 */
		image: function( props, attachment ) {
			var img = {},
				options, classes, shortcode, html;

			props.type = 'image';
			props = wp.media.string.props( props, attachment );
			classes = props.classes || [];

			img.src = ! _.isundefined( attachment ) ? attachment.url : props.url;
			_.extend( img, _.pick( props, 'width', 'height', 'alt' ) );

			// only assign the align class to the image if we're not printing
			// a caption, since the alignment is sent to the shortcode.
			if ( props.align && ! props.caption ) {
				classes.push( 'align' + props.align );
			}

			if ( props.size ) {
				classes.push( 'size-' + props.size );
			}

			img['class'] = _.compact( classes ).join(' ');

			// generate `img` tag options.
			options = {
				tag:    'img',
				attrs:  img,
				single: true
			};

			// generate the `a` element options, if they exist.
			if ( props.linkurl ) {
				options = {
					tag:   'a',
					attrs: {
						href: props.linkurl
					},
					content: options
				};
			}

			html = wp.html.string( options );

			// generate the caption shortcode.
			if ( props.caption ) {
				shortcode = {};

				if ( img.width ) {
					shortcode.width = img.width;
				}

				if ( props.captionid ) {
					shortcode.id = props.captionid;
				}

				if ( props.align ) {
					shortcode.align = 'align' + props.align;
				}

				html = wp.shortcode.string({
					tag:     'caption',
					attrs:   shortcode,
					content: html + ' ' + props.caption
				});
			}

			return html;
		}
	};

	wp.media.embed = {
		coerce : wp.media.coerce,

		defaults : {
			url : '',
			width: '',
			height: ''
		},

		edit : function( data, isurl ) {
			var frame, props = {}, shortcode;

			if ( isurl ) {
				props.url = data.replace(/<[^>]+>/g, '');
			} else {
				shortcode = wp.shortcode.next( 'embed', data ).shortcode;

				props = _.defaults( shortcode.attrs.named, this.defaults );
				if ( shortcode.content ) {
					props.url = shortcode.content;
				}
			}

			frame = wp.media({
				frame: 'post',
				state: 'embed',
				metadata: props
			});

			return frame;
		},

		shortcode : function( model ) {
			var self = this, content;

			_.each( this.defaults, function( value, key ) {
				model[ key ] = self.coerce( model, key );

				if ( value === model[ key ] ) {
					delete model[ key ];
				}
			});

			content = model.url;
			delete model.url;

			return new wp.shortcode({
				tag: 'embed',
				attrs: model,
				content: content
			});
		}
	};

	/**
	 * @class wp.media.collection
	 *
	 * @param {object} attributes
	 */
	wp.media.collection = function(attributes) {
		var collections = {};

		return _.extend(/** @lends wp.media.collection.prototype */{
			coerce : wp.media.coerce,
			/**
			 * retrieve attachments based on the properties of the passed shortcode
			 *
			 * @param {wp.shortcode} shortcode an instance of wp.shortcode().
			 * @return {wp.media.model.attachments} a backbone.collection containing
			 *                                      the media items belonging to a collection.
			 *                                      the query[ this.tag ] property is a backbone.model
			 *                                      containing the 'props' for the collection.
			 */
			attachments: function( shortcode ) {
				var shortcodestring = shortcode.string(),
					result = collections[ shortcodestring ],
					attrs, args, query, others, self = this;

				delete collections[ shortcodestring ];
				if ( result ) {
					return result;
				}
				// fill the default shortcode attributes.
				attrs = _.defaults( shortcode.attrs.named, this.defaults );
				args  = _.pick( attrs, 'orderby', 'order' );

				args.type    = this.type;
				args.perpage = -1;

				// mark the `orderby` override attribute.
				if ( undefined !== attrs.orderby ) {
					attrs._orderbyfield = attrs.orderby;
				}

				if ( 'rand' === attrs.orderby ) {
					attrs._orderbyrandom = true;
				}

				// map the `orderby` attribute to the corresponding model property.
				if ( ! attrs.orderby || /^menu_order(?: id)?$/i.test( attrs.orderby ) ) {
					args.orderby = 'menuorder';
				}

				// map the `ids` param to the correct query args.
				if ( attrs.ids ) {
					args.post__in = attrs.ids.split(',');
					args.orderby  = 'post__in';
				} else if ( attrs.include ) {
					args.post__in = attrs.include.split(',');
				}

				if ( attrs.exclude ) {
					args.post__not_in = attrs.exclude.split(',');
				}

				if ( ! args.post__in ) {
					args.uploadedto = attrs.id;
				}

				// collect the attributes that were not included in `args`.
				others = _.omit( attrs, 'id', 'ids', 'include', 'exclude', 'orderby', 'order' );

				_.each( this.defaults, function( value, key ) {
					others[ key ] = self.coerce( others, key );
				});

				query = wp.media.query( args );
				query[ this.tag ] = new backbone.model( others );
				return query;
			},
			/**
			 * triggered when clicking 'insert {label}' or 'update {label}'
			 *
			 * @param {wp.media.model.attachments} attachments a backbone.collection containing
			 *      the media items belonging to a collection.
			 *      the query[ this.tag ] property is a backbone.model
			 *          containing the 'props' for the collection.
			 * @return {wp.shortcode}
			 */
			shortcode: function( attachments ) {
				var props = attachments.props.tojson(),
					attrs = _.pick( props, 'orderby', 'order' ),
					shortcode, clone;

				if ( attachments.type ) {
					attrs.type = attachments.type;
					delete attachments.type;
				}

				if ( attachments[this.tag] ) {
					_.extend( attrs, attachments[this.tag].tojson() );
				}

				/*
				 * convert all gallery shortcodes to use the `ids` property.
				 * ignore `post__in` and `post__not_in`; the attachments in
				 * the collection will already reflect those properties.
				 */
				attrs.ids = attachments.pluck('id');

				// copy the `uploadedto` post id.
				if ( props.uploadedto ) {
					attrs.id = props.uploadedto;
				}
				// check if the gallery is randomly ordered.
				delete attrs.orderby;

				if ( attrs._orderbyrandom ) {
					attrs.orderby = 'rand';
				} else if ( attrs._orderbyfield && 'rand' !== attrs._orderbyfield ) {
					attrs.orderby = attrs._orderbyfield;
				}

				delete attrs._orderbyrandom;
				delete attrs._orderbyfield;

				// if the `ids` attribute is set and `orderby` attribute
				// is the default value, clear it for cleaner output.
				if ( attrs.ids && 'post__in' === attrs.orderby ) {
					delete attrs.orderby;
				}

				attrs = this.setdefaults( attrs );

				shortcode = new wp.shortcode({
					tag:    this.tag,
					attrs:  attrs,
					type:   'single'
				});

				// use a cloned version of the gallery.
				clone = new wp.media.model.attachments( attachments.models, {
					props: props
				});
				clone[ this.tag ] = attachments[ this.tag ];
				collections[ shortcode.string() ] = clone;

				return shortcode;
			},
			/**
			 * triggered when double-clicking a collection shortcode placeholder
			 *   in the editor
			 *
			 * @param {string} content content that is searched for possible
			 *    shortcode markup matching the passed tag name,
			 *
			 * @this wp.media.{prop}
			 *
			 * @return {wp.media.view.mediaframe.select} a media workflow.
			 */
			edit: function( content ) {
				var shortcode = wp.shortcode.next( this.tag, content ),
					defaultpostid = this.defaults.id,
					attachments, selection, state;

				// bail if we didn't match the shortcode or all of the content.
				if ( ! shortcode || shortcode.content !== content ) {
					return;
				}

				// ignore the rest of the match object.
				shortcode = shortcode.shortcode;

				if ( _.isundefined( shortcode.get('id') ) && ! _.isundefined( defaultpostid ) ) {
					shortcode.set( 'id', defaultpostid );
				}

				attachments = this.attachments( shortcode );

				selection = new wp.media.model.selection( attachments.models, {
					props:    attachments.props.tojson(),
					multiple: true
				});

				selection[ this.tag ] = attachments[ this.tag ];

				// fetch the query's attachments, and then break ties from the
				// query to allow for sorting.
				selection.more().done( function() {
					// break ties with the query.
					selection.props.set({ query: false });
					selection.unmirror();
					selection.props.unset('orderby');
				});

				// destroy the previous gallery frame.
				if ( this.frame ) {
					this.frame.dispose();
				}

				if ( shortcode.attrs.named.type && 'video' === shortcode.attrs.named.type ) {
					state = 'video-' + this.tag + '-edit';
				} else {
					state = this.tag + '-edit';
				}

				// store the current frame.
				this.frame = wp.media({
					frame:     'post',
					state:     state,
					title:     this.edittitle,
					editing:   true,
					multiple:  true,
					selection: selection
				}).open();

				return this.frame;
			},

			setdefaults: function( attrs ) {
				var self = this;
				// remove default attributes from the shortcode.
				_.each( this.defaults, function( value, key ) {
					attrs[ key ] = self.coerce( attrs, key );
					if ( value === attrs[ key ] ) {
						delete attrs[ key ];
					}
				});

				return attrs;
			}
		}, attributes );
	};

	wp.media._gallerydefaults = {
		itemtag: 'dl',
		icontag: 'dt',
		captiontag: 'dd',
		columns: '3',
		link: 'post',
		size: 'thumbnail',
		order: 'asc',
		id: wp.media.view.settings.post && wp.media.view.settings.post.id,
		orderby : 'menu_order id'
	};

	if ( wp.media.view.settings.gallerydefaults ) {
		wp.media.gallerydefaults = _.extend( {}, wp.media._gallerydefaults, wp.media.view.settings.gallerydefaults );
	} else {
		wp.media.gallerydefaults = wp.media._gallerydefaults;
	}

	wp.media.gallery = new wp.media.collection({
		tag: 'gallery',
		type : 'image',
		edittitle : wp.media.view.l10n.editgallerytitle,
		defaults : wp.media.gallerydefaults,

		setdefaults: function( attrs ) {
			var self = this, changed = ! _.isequal( wp.media.gallerydefaults, wp.media._gallerydefaults );
			_.each( this.defaults, function( value, key ) {
				attrs[ key ] = self.coerce( attrs, key );
				if ( value === attrs[ key ] && ( ! changed || value === wp.media._gallerydefaults[ key ] ) ) {
					delete attrs[ key ];
				}
			} );
			return attrs;
		}
	});

	/**
	 * @namespace wp.media.featuredimage
	 * @memberof wp.media
	 */
	wp.media.featuredimage = {
		/**
		 * get the featured image post id
		 *
		 * @return {wp.media.view.settings.post.featuredimageid|number}
		 */
		get: function() {
			return wp.media.view.settings.post.featuredimageid;
		},
		/**
		 * sets the featured image id property and sets the html in the post meta box to the new featured image.
		 *
		 * @param {number} id the post id of the featured image, or -1 to unset it.
		 */
		set: function( id ) {
			var settings = wp.media.view.settings;

			settings.post.featuredimageid = id;

			wp.media.post( 'get-post-thumbnail-html', {
				post_id:      settings.post.id,
				thumbnail_id: settings.post.featuredimageid,
				_wpnonce:     settings.post.nonce
			}).done( function( html ) {
				if ( '0' === html ) {
					window.alert( wp.i18n.__( 'could not set that as the thumbnail image. try a different attachment.' ) );
					return;
				}
				$( '.inside', '#postimagediv' ).html( html );
			});
		},
		/**
		 * remove the featured image id, save the post thumbnail data and
		 * set the html in the post meta box to no featured image.
		 */
		remove: function() {
			wp.media.featuredimage.set( -1 );
		},
		/**
		 * the featured image workflow
		 *
		 * @this wp.media.featuredimage
		 *
		 * @return {wp.media.view.mediaframe.select} a media workflow.
		 */
		frame: function() {
			if ( this._frame ) {
				wp.media.frame = this._frame;
				return this._frame;
			}

			this._frame = wp.media({
				state: 'featured-image',
				states: [ new wp.media.controller.featuredimage() , new wp.media.controller.editimage() ]
			});

			this._frame.on( 'toolbar:create:featured-image', function( toolbar ) {
				/**
				 * @this wp.media.view.mediaframe.select
				 */
				this.createselecttoolbar( toolbar, {
					text: wp.media.view.l10n.setfeaturedimage
				});
			}, this._frame );

			this._frame.on( 'content:render:edit-image', function() {
				var selection = this.state('featured-image').get('selection'),
					view = new wp.media.view.editimage( { model: selection.single(), controller: this } ).render();

				this.content.set( view );

				// after bringing in the frame, load the actual editor via an ajax call.
				view.loadeditor();

			}, this._frame );

			this._frame.state('featured-image').on( 'select', this.select );
			return this._frame;
		},
		/**
		 * 'select' callback for featured image workflow, triggered when
		 *  the 'set featured image' button is clicked in the media modal.
		 *
		 * @this wp.media.controller.featuredimage
		 */
		select: function() {
			var selection = this.get('selection').single();

			if ( ! wp.media.view.settings.post.featuredimageid ) {
				return;
			}

			wp.media.featuredimage.set( selection ? selection.id : -1 );
		},
		/**
		 * open the content media manager to the 'featured image' tab when
		 * the post thumbnail is clicked.
		 *
		 * update the featured image id when the 'remove' link is clicked.
		 */
		init: function() {
			$('#postimagediv').on( 'click', '#set-post-thumbnail', function( event ) {
				event.preventdefault();
				// stop propagation to prevent thickbox from activating.
				event.stoppropagation();

				wp.media.featuredimage.frame().open();
			}).on( 'click', '#remove-post-thumbnail', function() {
				wp.media.featuredimage.remove();
				return false;
			});
		}
	};

	$( wp.media.featuredimage.init );

	/** @namespace wp.media.editor */
	wp.media.editor = {
		/**
		 * send content to the editor
		 *
		 * @param {string} html content to send to the editor
		 */
		insert: function( html ) {
			var editor, wpactiveeditor,
				hastinymce = ! _.isundefined( window.tinymce ),
				hasquicktags = ! _.isundefined( window.qtags );

			if ( this.activeeditor ) {
				wpactiveeditor = window.wpactiveeditor = this.activeeditor;
			} else {
				wpactiveeditor = window.wpactiveeditor;
			}

			/*
			 * delegate to the global `send_to_editor` if it exists.
			 * this attempts to play nice with any themes/plugins
			 * that have overridden the insert functionality.
			 */
			if ( window.send_to_editor ) {
				return window.send_to_editor.apply( this, arguments );
			}

			if ( ! wpactiveeditor ) {
				if ( hastinymce && tinymce.activeeditor ) {
					editor = tinymce.activeeditor;
					wpactiveeditor = window.wpactiveeditor = editor.id;
				} else if ( ! hasquicktags ) {
					return false;
				}
			} else if ( hastinymce ) {
				editor = tinymce.get( wpactiveeditor );
			}

			if ( editor && ! editor.ishidden() ) {
				editor.execcommand( 'mceinsertcontent', false, html );
			} else if ( hasquicktags ) {
				qtags.insertcontent( html );
			} else {
				document.getelementbyid( wpactiveeditor ).value += html;
			}

			// if the old thickbox remove function exists, call it in case
			// a theme/plugin overloaded it.
			if ( window.tb_remove ) {
				try { window.tb_remove(); } catch( e ) {}
			}
		},

		/**
		 * setup 'workflow' and add to the 'workflows' cache. 'open' can
		 *  subsequently be called upon it.
		 *
		 * @param {string} id a slug used to identify the workflow.
		 * @param {object} [options={}]
		 *
		 * @this wp.media.editor
		 *
		 * @return {wp.media.view.mediaframe.select} a media workflow.
		 */
		add: function( id, options ) {
			var workflow = this.get( id );

			// only add once: if exists return existing.
			if ( workflow ) {
				return workflow;
			}

			workflow = workflows[ id ] = wp.media( _.defaults( options || {}, {
				frame:    'post',
				state:    'insert',
				title:    wp.media.view.l10n.addmedia,
				multiple: true
			} ) );

			workflow.on( 'insert', function( selection ) {
				var state = workflow.state();

				selection = selection || state.get('selection');

				if ( ! selection ) {
					return;
				}

				$.when.apply( $, selection.map( function( attachment ) {
					var display = state.display( attachment ).tojson();
					/**
					 * @this wp.media.editor
					 */
					return this.send.attachment( display, attachment.tojson() );
				}, this ) ).done( function() {
					wp.media.editor.insert( _.toarray( arguments ).join('\n\n') );
				});
			}, this );

			workflow.state('gallery-edit').on( 'update', function( selection ) {
				/**
				 * @this wp.media.editor
				 */
				this.insert( wp.media.gallery.shortcode( selection ).string() );
			}, this );

			workflow.state('playlist-edit').on( 'update', function( selection ) {
				/**
				 * @this wp.media.editor
				 */
				this.insert( wp.media.playlist.shortcode( selection ).string() );
			}, this );

			workflow.state('video-playlist-edit').on( 'update', function( selection ) {
				/**
				 * @this wp.media.editor
				 */
				this.insert( wp.media.playlist.shortcode( selection ).string() );
			}, this );

			workflow.state('embed').on( 'select', function() {
				/**
				 * @this wp.media.editor
				 */
				var state = workflow.state(),
					type = state.get('type'),
					embed = state.props.tojson();

				embed.url = embed.url || '';

				if ( 'link' === type ) {
					_.defaults( embed, {
						linktext: embed.url,
						linkurl: embed.url
					});

					this.send.link( embed ).done( function( resp ) {
						wp.media.editor.insert( resp );
					});

				} else if ( 'image' === type ) {
					_.defaults( embed, {
						title:   embed.url,
						linkurl: '',
						align:   'none',
						link:    'none'
					});

					if ( 'none' === embed.link ) {
						embed.linkurl = '';
					} else if ( 'file' === embed.link ) {
						embed.linkurl = embed.url;
					}

					this.insert( wp.media.string.image( embed ) );
				}
			}, this );

			workflow.state('featured-image').on( 'select', wp.media.featuredimage.select );
			workflow.setstate( workflow.options.state );
			return workflow;
		},
		/**
		 * determines the proper current workflow id
		 *
		 * @param {string} [id=''] a slug used to identify the workflow.
		 *
		 * @return {wpactiveeditor|string|tinymce.activeeditor.id}
		 */
		id: function( id ) {
			if ( id ) {
				return id;
			}

			// if an empty `id` is provided, default to `wpactiveeditor`.
			id = window.wpactiveeditor;

			// if that doesn't work, fall back to `tinymce.activeeditor.id`.
			if ( ! id && ! _.isundefined( window.tinymce ) && tinymce.activeeditor ) {
				id = tinymce.activeeditor.id;
			}

			// last but not least, fall back to the empty string.
			id = id || '';
			return id;
		},
		/**
		 * return the workflow specified by id
		 *
		 * @param {string} id a slug used to identify the workflow.
		 *
		 * @this wp.media.editor
		 *
		 * @return {wp.media.view.mediaframe} a media workflow.
		 */
		get: function( id ) {
			id = this.id( id );
			return workflows[ id ];
		},
		/**
		 * remove the workflow represented by id from the workflow cache
		 *
		 * @param {string} id a slug used to identify the workflow.
		 *
		 * @this wp.media.editor
		 */
		remove: function( id ) {
			id = this.id( id );
			delete workflows[ id ];
		},
		/** @namespace wp.media.editor.send */
		send: {
			/**
			 * called when sending an attachment to the editor
			 *   from the medial modal.
			 *
			 * @param {object} props attachment details (align, link, size, etc).
			 * @param {object} attachment the attachment object, media version of post.
			 * @return {promise}
			 */
			attachment: function( props, attachment ) {
				var caption = attachment.caption,
					options, html;

				// if captions are disabled, clear the caption.
				if ( ! wp.media.view.settings.captions ) {
					delete attachment.caption;
				}

				props = wp.media.string.props( props, attachment );

				options = {
					id:           attachment.id,
					post_content: attachment.description,
					post_excerpt: caption
				};

				if ( props.linkurl ) {
					options.url = props.linkurl;
				}

				if ( 'image' === attachment.type ) {
					html = wp.media.string.image( props );

					_.each({
						align: 'align',
						size:  'image-size',
						alt:   'image_alt'
					}, function( option, prop ) {
						if ( props[ prop ] ) {
							options[ option ] = props[ prop ];
						}
					});
				} else if ( 'video' === attachment.type ) {
					html = wp.media.string.video( props, attachment );
				} else if ( 'audio' === attachment.type ) {
					html = wp.media.string.audio( props, attachment );
				} else {
					html = wp.media.string.link( props );
					options.post_title = props.title;
				}

				return wp.media.post( 'send-attachment-to-editor', {
					nonce:      wp.media.view.settings.nonce.sendtoeditor,
					attachment: options,
					html:       html,
					post_id:    wp.media.view.settings.post.id
				});
			},
			/**
			 * called when 'insert from url' source is not an image. example: youtube url.
			 *
			 * @param {object} embed
			 * @return {promise}
			 */
			link: function( embed ) {
				return wp.media.post( 'send-link-to-editor', {
					nonce:     wp.media.view.settings.nonce.sendtoeditor,
					src:       embed.linkurl,
					link_text: embed.linktext,
					html:      wp.media.string.link( embed ),
					post_id:   wp.media.view.settings.post.id
				});
			}
		},
		/**
		 * open a workflow
		 *
		 * @param {string} [id=undefined] optional. a slug used to identify the workflow.
		 * @param {object} [options={}]
		 *
		 * @this wp.media.editor
		 *
		 * @return {wp.media.view.mediaframe}
		 */
		open: function( id, options ) {
			var workflow;

			options = options || {};

			id = this.id( id );
			this.activeeditor = id;

			workflow = this.get( id );

			// redo workflow if state has changed.
			if ( ! workflow || ( workflow.options && options.state !== workflow.options.state ) ) {
				workflow = this.add( id, options );
			}

			wp.media.frame = workflow;

			return workflow.open();
		},

		/**
		 * bind click event for .insert-media using event delegation
		 */
		init: function() {
			$(document.body)
				.on( 'click.add-media-button', '.insert-media', function( event ) {
					var elem = $( event.currenttarget ),
						editor = elem.data('editor'),
						options = {
							frame:    'post',
							state:    'insert',
							title:    wp.media.view.l10n.addmedia,
							multiple: true
						};

					event.preventdefault();

					if ( elem.hasclass( 'gallery' ) ) {
						options.state = 'gallery';
						options.title = wp.media.view.l10n.creategallerytitle;
					}

					wp.media.editor.open( editor, options );
				});

			// initialize and render the editor drag-and-drop uploader.
			new wp.media.view.editoruploader().render();
		}
	};

	_.bindall( wp.media.editor, 'open' );
	$( wp.media.editor.init );
}(jquery, _));



