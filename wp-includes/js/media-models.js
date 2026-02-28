/******/ (() => { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 1288:
/***/ ((module) => {

var attachments = wp.media.model.attachments,
	query;

/**
 * wp.media.model.query
 *
 * a collection of attachments that match the supplied query arguments.
 *
 * note: do not change this.args after the query has been initialized.
 *       things will break.
 *
 * @memberof wp.media.model
 *
 * @class
 * @augments wp.media.model.attachments
 * @augments backbone.collection
 *
 * @param {array}  [models]                      models to initialize with the collection.
 * @param {object} [options]                     options hash.
 * @param {object} [options.args]                attachments query arguments.
 * @param {object} [options.args.posts_per_page]
 */
query = attachments.extend(/** @lends wp.media.model.query.prototype */{
	/**
	 * @param {array}  [models=[]]  array of initial models to populate the collection.
	 * @param {object} [options={}]
	 */
	initialize: function( models, options ) {
		var allowed;

		options = options || {};
		attachments.prototype.initialize.apply( this, arguments );

		this.args     = options.args;
		this._hasmore = true;
		this.created  = new date();

		this.filters.order = function( attachment ) {
			var orderby = this.props.get('orderby'),
				order = this.props.get('order');

			if ( ! this.comparator ) {
				return true;
			}

			/*
			 * we want any items that can be placed before the last
			 * item in the set. if we add any items after the last
			 * item, then we can't guarantee the set is complete.
			 */
			if ( this.length ) {
				return 1 !== this.comparator( attachment, this.last(), { ties: true });

			/*
			 * handle the case where there are no items yet and
			 * we're sorting for recent items. in that case, we want
			 * changes that occurred after we created the query.
			 */
			} else if ( 'desc' === order && ( 'date' === orderby || 'modified' === orderby ) ) {
				return attachment.get( orderby ) >= this.created;

			// if we're sorting by menu order and we have no items,
			// accept any items that have the default menu order (0).
			} else if ( 'asc' === order && 'menuorder' === orderby ) {
				return attachment.get( orderby ) === 0;
			}

			// otherwise, we don't want any items yet.
			return false;
		};

		/*
		 * observe the central `wp.uploader.queue` collection to watch for
		 * new matches for the query.
		 *
		 * only observe when a limited number of query args are set. there
		 * are no filters for other properties, so observing will result in
		 * false positives in those queries.
		 */
		allowed = [ 's', 'order', 'orderby', 'posts_per_page', 'post_mime_type', 'post_parent', 'author' ];
		if ( wp.uploader && _( this.args ).chain().keys().difference( allowed ).isempty().value() ) {
			this.observe( wp.uploader.queue );
		}
	},
	/**
	 * whether there are more attachments that haven't been sync'd from the server
	 * that match the collection's query.
	 *
	 * @return {boolean}
	 */
	hasmore: function() {
		return this._hasmore;
	},
	/**
	 * fetch more attachments from the server for the collection.
	 *
	 * @param {object} [options={}]
	 * @return {promise}
	 */
	more: function( options ) {
		var query = this;

		// if there is already a request pending, return early with the deferred object.
		if ( this._more && 'pending' === this._more.state() ) {
			return this._more;
		}

		if ( ! this.hasmore() ) {
			return jquery.deferred().resolvewith( this ).promise();
		}

		options = options || {};
		options.remove = false;

		return this._more = this.fetch( options ).done( function( response ) {
			if ( _.isempty( response ) || -1 === query.args.posts_per_page || response.length < query.args.posts_per_page ) {
				query._hasmore = false;
			}
		});
	},
	/**
	 * overrides backbone.collection.sync
	 * overrides wp.media.model.attachments.sync
	 *
	 * @param {string} method
	 * @param {backbone.model} model
	 * @param {object} [options={}]
	 * @return {promise}
	 */
	sync: function( method, model, options ) {
		var args, fallback;

		// overload the read method so attachment.fetch() functions correctly.
		if ( 'read' === method ) {
			options = options || {};
			options.context = this;
			options.data = _.extend( options.data || {}, {
				action:  'query-attachments',
				post_id: wp.media.model.settings.post.id
			});

			// clone the args so manipulation is non-destructive.
			args = _.clone( this.args );

			// determine which page to query.
			if ( -1 !== args.posts_per_page ) {
				args.paged = math.round( this.length / args.posts_per_page ) + 1;
			}

			options.data.query = args;
			return wp.media.ajax( options );

		// otherwise, fall back to `backbone.sync()`.
		} else {
			/**
			 * call wp.media.model.attachments.sync or backbone.sync
			 */
			fallback = attachments.prototype.sync ? attachments.prototype : backbone;
			return fallback.sync.apply( this, arguments );
		}
	}
}, /** @lends wp.media.model.query */{
	/**
	 * @readonly
	 */
	defaultprops: {
		orderby: 'date',
		order:   'desc'
	},
	/**
	 * @readonly
	 */
	defaultargs: {
		posts_per_page: 80
	},
	/**
	 * @readonly
	 */
	orderby: {
		allowed:  [ 'name', 'author', 'date', 'title', 'modified', 'uploadedto', 'id', 'post__in', 'menuorder' ],
		/**
		 * a map of javascript orderby values to their wp_query equivalents.
		 * @type {object}
		 */
		valuemap: {
			'id':         'id',
			'uploadedto': 'parent',
			'menuorder':  'menu_order id'
		}
	},
	/**
	 * a map of javascript query properties to their wp_query equivalents.
	 *
	 * @readonly
	 */
	propmap: {
		'search':		's',
		'type':			'post_mime_type',
		'perpage':		'posts_per_page',
		'menuorder':	'menu_order',
		'uploadedto':	'post_parent',
		'status':		'post_status',
		'include':		'post__in',
		'exclude':		'post__not_in',
		'author':		'author'
	},
	/**
	 * creates and returns an attachments query collection given the properties.
	 *
	 * caches query objects and reuses where possible.
	 *
	 * @static
	 * @method
	 *
	 * @param {object} [props]
	 * @param {object} [props.order]
	 * @param {object} [props.orderby]
	 * @param {object} [props.include]
	 * @param {object} [props.exclude]
	 * @param {object} [props.s]
	 * @param {object} [props.post_mime_type]
	 * @param {object} [props.posts_per_page]
	 * @param {object} [props.menu_order]
	 * @param {object} [props.post_parent]
	 * @param {object} [props.post_status]
	 * @param {object} [props.author]
	 * @param {object} [options]
	 *
	 * @return {wp.media.model.query} a new attachments query collection.
	 */
	get: (function(){
		/**
		 * @static
		 * @type array
		 */
		var queries = [];

		/**
		 * @return {query}
		 */
		return function( props, options ) {
			var args     = {},
				orderby  = query.orderby,
				defaults = query.defaultprops,
				query;

			// remove the `query` property. this isn't linked to a query,
			// this *is* the query.
			delete props.query;

			// fill default args.
			_.defaults( props, defaults );

			// normalize the order.
			props.order = props.order.touppercase();
			if ( 'desc' !== props.order && 'asc' !== props.order ) {
				props.order = defaults.order.touppercase();
			}

			// ensure we have a valid orderby value.
			if ( ! _.contains( orderby.allowed, props.orderby ) ) {
				props.orderby = defaults.orderby;
			}

			_.each( [ 'include', 'exclude' ], function( prop ) {
				if ( props[ prop ] && ! _.isarray( props[ prop ] ) ) {
					props[ prop ] = [ props[ prop ] ];
				}
			} );

			// generate the query `args` object.
			// correct any differing property names.
			_.each( props, function( value, prop ) {
				if ( _.isnull( value ) ) {
					return;
				}

				args[ query.propmap[ prop ] || prop ] = value;
			});

			// fill any other default query args.
			_.defaults( args, query.defaultargs );

			// `props.orderby` does not always map directly to `args.orderby`.
			// substitute exceptions specified in orderby.keymap.
			args.orderby = orderby.valuemap[ props.orderby ] || props.orderby;

			queries = [];

			// otherwise, create a new query and add it to the cache.
			if ( ! query ) {
				query = new query( [], _.extend( options || {}, {
					props: props,
					args:  args
				} ) );
				queries.push( query );
			}

			return query;
		};
	}())
});

module.exports = query;


/***/ }),

/***/ 3343:
/***/ ((module) => {

var $ = backbone.$,
	attachment;

/**
 * wp.media.model.attachment
 *
 * @memberof wp.media.model
 *
 * @class
 * @augments backbone.model
 */
attachment = backbone.model.extend(/** @lends wp.media.model.attachment.prototype */{
	/**
	 * triggered when attachment details change
	 * overrides backbone.model.sync
	 *
	 * @param {string} method
	 * @param {wp.media.model.attachment} model
	 * @param {object} [options={}]
	 *
	 * @return {promise}
	 */
	sync: function( method, model, options ) {
		// if the attachment does not yet have an `id`, return an instantly
		// rejected promise. otherwise, all of our requests will fail.
		if ( _.isundefined( this.id ) ) {
			return $.deferred().rejectwith( this ).promise();
		}

		// overload the `read` request so attachment.fetch() functions correctly.
		if ( 'read' === method ) {
			options = options || {};
			options.context = this;
			options.data = _.extend( options.data || {}, {
				action: 'get-attachment',
				id: this.id
			});
			return wp.media.ajax( options );

		// overload the `update` request so properties can be saved.
		} else if ( 'update' === method ) {
			// if we do not have the necessary nonce, fail immediately.
			if ( ! this.get('nonces') || ! this.get('nonces').update ) {
				return $.deferred().rejectwith( this ).promise();
			}

			options = options || {};
			options.context = this;

			// set the action and id.
			options.data = _.extend( options.data || {}, {
				action:  'save-attachment',
				id:      this.id,
				nonce:   this.get('nonces').update,
				post_id: wp.media.model.settings.post.id
			});

			// record the values of the changed attributes.
			if ( model.haschanged() ) {
				options.data.changes = {};

				_.each( model.changed, function( value, key ) {
					options.data.changes[ key ] = this.get( key );
				}, this );
			}

			return wp.media.ajax( options );

		// overload the `delete` request so attachments can be removed.
		// this will permanently delete an attachment.
		} else if ( 'delete' === method ) {
			options = options || {};

			if ( ! options.wait ) {
				this.destroyed = true;
			}

			options.context = this;
			options.data = _.extend( options.data || {}, {
				action:   'delete-post',
				id:       this.id,
				_wpnonce: this.get('nonces')['delete']
			});

			return wp.media.ajax( options ).done( function() {
				this.destroyed = true;
			}).fail( function() {
				this.destroyed = false;
			});

		// otherwise, fall back to `backbone.sync()`.
		} else {
			/**
			 * call `sync` directly on backbone.model
			 */
			return backbone.model.prototype.sync.apply( this, arguments );
		}
	},
	/**
	 * convert date strings into date objects.
	 *
	 * @param {object} resp the raw response object, typically returned by fetch()
	 * @return {object} the modified response object, which is the attributes hash
	 *                  to be set on the model.
	 */
	parse: function( resp ) {
		if ( ! resp ) {
			return resp;
		}

		resp.date = new date( resp.date );
		resp.modified = new date( resp.modified );
		return resp;
	},
	/**
	 * @param {object} data the properties to be saved.
	 * @param {object} options sync options. e.g. patch, wait, success, error.
	 *
	 * @this backbone.model
	 *
	 * @return {promise}
	 */
	savecompat: function( data, options ) {
		var model = this;

		// if we do not have the necessary nonce, fail immediately.
		if ( ! this.get('nonces') || ! this.get('nonces').update ) {
			return $.deferred().rejectwith( this ).promise();
		}

		return wp.media.post( 'save-attachment-compat', _.defaults({
			id:      this.id,
			nonce:   this.get('nonces').update,
			post_id: wp.media.model.settings.post.id
		}, data ) ).done( function( resp, status, xhr ) {
			model.set( model.parse( resp, xhr ), options );
		});
	}
},/** @lends wp.media.model.attachment */{
	/**
	 * create a new model on the static 'all' attachments collection and return it.
	 *
	 * @static
	 *
	 * @param {object} attrs
	 * @return {wp.media.model.attachment}
	 */
	create: function( attrs ) {
		var attachments = wp.media.model.attachments;
		return attachments.all.push( attrs );
	},
	/**
	 * create a new model on the static 'all' attachments collection and return it.
	 *
	 * if this function has already been called for the id,
	 * it returns the specified attachment.
	 *
	 * @static
	 * @param {string} id a string used to identify a model.
	 * @param {backbone.model|undefined} attachment
	 * @return {wp.media.model.attachment}
	 */
	get: _.memoize( function( id, attachment ) {
		var attachments = wp.media.model.attachments;
		return attachments.all.push( attachment || { id: id } );
	})
});

module.exports = attachment;


/***/ }),

/***/ 4134:
/***/ ((module) => {

var attachments = wp.media.model.attachments,
	selection;

/**
 * wp.media.model.selection
 *
 * a selection of attachments.
 *
 * @memberof wp.media.model
 *
 * @class
 * @augments wp.media.model.attachments
 * @augments backbone.collection
 */
selection = attachments.extend(/** @lends wp.media.model.selection.prototype */{
	/**
	 * refresh the `single` model whenever the selection changes.
	 * binds `single` instead of using the context argument to ensure
	 * it receives no parameters.
	 *
	 * @param {array} [models=[]] array of models used to populate the collection.
	 * @param {object} [options={}]
	 */
	initialize: function( models, options ) {
		/**
		 * call 'initialize' directly on the parent class
		 */
		attachments.prototype.initialize.apply( this, arguments );
		this.multiple = options && options.multiple;

		this.on( 'add remove reset', _.bind( this.single, this, false ) );
	},

	/**
	 * if the workflow does not support multi-select, clear out the selection
	 * before adding a new attachment to it.
	 *
	 * @param {array} models
	 * @param {object} options
	 * @return {wp.media.model.attachment[]}
	 */
	add: function( models, options ) {
		if ( ! this.multiple ) {
			this.remove( this.models );
		}
		/**
		 * call 'add' directly on the parent class
		 */
		return attachments.prototype.add.call( this, models, options );
	},

	/**
	 * fired when toggling (clicking on) an attachment in the modal.
	 *
	 * @param {undefined|boolean|wp.media.model.attachment} model
	 *
	 * @fires wp.media.model.selection#selection:single
	 * @fires wp.media.model.selection#selection:unsingle
	 *
	 * @return {backbone.model}
	 */
	single: function( model ) {
		var previous = this._single;

		// if a `model` is provided, use it as the single model.
		if ( model ) {
			this._single = model;
		}
		// if the single model isn't in the selection, remove it.
		if ( this._single && ! this.get( this._single.cid ) ) {
			delete this._single;
		}

		this._single = this._single || this.last();

		// if single has changed, fire an event.
		if ( this._single !== previous ) {
			if ( previous ) {
				previous.trigger( 'selection:unsingle', previous, this );

				// if the model was already removed, trigger the collection
				// event manually.
				if ( ! this.get( previous.cid ) ) {
					this.trigger( 'selection:unsingle', previous, this );
				}
			}
			if ( this._single ) {
				this._single.trigger( 'selection:single', this._single, this );
			}
		}

		// return the single model, or the last model as a fallback.
		return this._single;
	}
});

module.exports = selection;


/***/ }),

/***/ 8266:
/***/ ((module) => {

/**
 * wp.media.model.attachments
 *
 * a collection of attachments.
 *
 * this collection has no persistence with the server without supplying
 * 'options.props.query = true', which will mirror the collection
 * to an attachments query collection - @see wp.media.model.attachments.mirror().
 *
 * @memberof wp.media.model
 *
 * @class
 * @augments backbone.collection
 *
 * @param {array}  [models]                models to initialize with the collection.
 * @param {object} [options]               options hash for the collection.
 * @param {string} [options.props]         options hash for the initial query properties.
 * @param {string} [options.props.order]   initial order (asc or desc) for the collection.
 * @param {string} [options.props.orderby] initial attribute key to order the collection by.
 * @param {string} [options.props.query]   whether the collection is linked to an attachments query.
 * @param {string} [options.observe]
 * @param {string} [options.filters]
 *
 */
var attachments = backbone.collection.extend(/** @lends wp.media.model.attachments.prototype */{
	/**
	 * @type {wp.media.model.attachment}
	 */
	model: wp.media.model.attachment,
	/**
	 * @param {array} [models=[]] array of models used to populate the collection.
	 * @param {object} [options={}]
	 */
	initialize: function( models, options ) {
		options = options || {};

		this.props   = new backbone.model();
		this.filters = options.filters || {};

		// bind default `change` events to the `props` model.
		this.props.on( 'change', this._changefilteredprops, this );

		this.props.on( 'change:order',   this._changeorder,   this );
		this.props.on( 'change:orderby', this._changeorderby, this );
		this.props.on( 'change:query',   this._changequery,   this );

		this.props.set( _.defaults( options.props || {} ) );

		if ( options.observe ) {
			this.observe( options.observe );
		}
	},
	/**
	 * sort the collection when the order attribute changes.
	 *
	 * @access private
	 */
	_changeorder: function() {
		if ( this.comparator ) {
			this.sort();
		}
	},
	/**
	 * set the default comparator only when the `orderby` property is set.
	 *
	 * @access private
	 *
	 * @param {backbone.model} model
	 * @param {string} orderby
	 */
	_changeorderby: function( model, orderby ) {
		// if a different comparator is defined, bail.
		if ( this.comparator && this.comparator !== attachments.comparator ) {
			return;
		}

		if ( orderby && 'post__in' !== orderby ) {
			this.comparator = attachments.comparator;
		} else {
			delete this.comparator;
		}
	},
	/**
	 * if the `query` property is set to true, query the server using
	 * the `props` values, and sync the results to this collection.
	 *
	 * @access private
	 *
	 * @param {backbone.model} model
	 * @param {boolean} query
	 */
	_changequery: function( model, query ) {
		if ( query ) {
			this.props.on( 'change', this._requery, this );
			this._requery();
		} else {
			this.props.off( 'change', this._requery, this );
		}
	},
	/**
	 * @access private
	 *
	 * @param {backbone.model} model
	 */
	_changefilteredprops: function( model ) {
		// if this is a query, updating the collection will be handled by
		// `this._requery()`.
		if ( this.props.get('query') ) {
			return;
		}

		var changed = _.chain( model.changed ).map( function( t, prop ) {
			var filter = attachments.filters[ prop ],
				term = model.get( prop );

			if ( ! filter ) {
				return;
			}

			if ( term && ! this.filters[ prop ] ) {
				this.filters[ prop ] = filter;
			} else if ( ! term && this.filters[ prop ] === filter ) {
				delete this.filters[ prop ];
			} else {
				return;
			}

			// record the change.
			return true;
		}, this ).any().value();

		if ( ! changed ) {
			return;
		}

		// if no `attachments` model is provided to source the searches from,
		// then automatically generate a source from the existing models.
		if ( ! this._source ) {
			this._source = new attachments( this.models );
		}

		this.reset( this._source.filter( this.validator, this ) );
	},

	validatedestroyed: false,
	/**
	 * checks whether an attachment is valid.
	 *
	 * @param {wp.media.model.attachment} attachment
	 * @return {boolean}
	 */
	validator: function( attachment ) {

		if ( ! this.validatedestroyed && attachment.destroyed ) {
			return false;
		}
		return _.all( this.filters, function( filter ) {
			return !! filter.call( this, attachment );
		}, this );
	},
	/**
	 * add or remove an attachment to the collection depending on its validity.
	 *
	 * @param {wp.media.model.attachment} attachment
	 * @param {object} options
	 * @return {wp.media.model.attachments} returns itself to allow chaining.
	 */
	validate: function( attachment, options ) {
		var valid = this.validator( attachment ),
			hasattachment = !! this.get( attachment.cid );

		if ( ! valid && hasattachment ) {
			this.remove( attachment, options );
		} else if ( valid && ! hasattachment ) {
			this.add( attachment, options );
		}

		return this;
	},

	/**
	 * add or remove all attachments from another collection depending on each one's validity.
	 *
	 * @param {wp.media.model.attachments} attachments
	 * @param {object} [options={}]
	 *
	 * @fires wp.media.model.attachments#reset
	 *
	 * @return {wp.media.model.attachments} returns itself to allow chaining.
	 */
	validateall: function( attachments, options ) {
		options = options || {};

		_.each( attachments.models, function( attachment ) {
			this.validate( attachment, { silent: true });
		}, this );

		if ( ! options.silent ) {
			this.trigger( 'reset', this, options );
		}
		return this;
	},
	/**
	 * start observing another attachments collection change events
	 * and replicate them on this collection.
	 *
	 * @param {wp.media.model.attachments} the attachments collection to observe.
	 * @return {wp.media.model.attachments} returns itself to allow chaining.
	 */
	observe: function( attachments ) {
		this.observers = this.observers || [];
		this.observers.push( attachments );

		attachments.on( 'add change remove', this._validatehandler, this );
		attachments.on( 'add', this._addtototalattachments, this );
		attachments.on( 'remove', this._removefromtotalattachments, this );
		attachments.on( 'reset', this._validateallhandler, this );
		this.validateall( attachments );
		return this;
	},
	/**
	 * stop replicating collection change events from another attachments collection.
	 *
	 * @param {wp.media.model.attachments} the attachments collection to stop observing.
	 * @return {wp.media.model.attachments} returns itself to allow chaining.
	 */
	unobserve: function( attachments ) {
		if ( attachments ) {
			attachments.off( null, null, this );
			this.observers = _.without( this.observers, attachments );

		} else {
			_.each( this.observers, function( attachments ) {
				attachments.off( null, null, this );
			}, this );
			delete this.observers;
		}

		return this;
	},
	/**
	 * update total attachment count when items are added to a collection.
	 *
	 * @access private
	 *
	 * @since 5.8.0
	 */
	_removefromtotalattachments: function() {
		if ( this.mirroring ) {
			this.mirroring.totalattachments = this.mirroring.totalattachments - 1;
		}
	},
	/**
	 * update total attachment count when items are added to a collection.
	 *
	 * @access private
	 *
	 * @since 5.8.0
	 */
	_addtototalattachments: function() {
		if ( this.mirroring ) {
			this.mirroring.totalattachments = this.mirroring.totalattachments + 1;
		}
	},
	/**
	 * @access private
	 *
	 * @param {wp.media.model.attachments} attachment
	 * @param {wp.media.model.attachments} attachments
	 * @param {object} options
	 *
	 * @return {wp.media.model.attachments} returns itself to allow chaining.
	 */
	_validatehandler: function( attachment, attachments, options ) {
		// if we're not mirroring this `attachments` collection,
		// only retain the `silent` option.
		options = attachments === this.mirroring ? options : {
			silent: options && options.silent
		};

		return this.validate( attachment, options );
	},
	/**
	 * @access private
	 *
	 * @param {wp.media.model.attachments} attachments
	 * @param {object} options
	 * @return {wp.media.model.attachments} returns itself to allow chaining.
	 */
	_validateallhandler: function( attachments, options ) {
		return this.validateall( attachments, options );
	},
	/**
	 * start mirroring another attachments collection, clearing out any models already
	 * in the collection.
	 *
	 * @param {wp.media.model.attachments} the attachments collection to mirror.
	 * @return {wp.media.model.attachments} returns itself to allow chaining.
	 */
	mirror: function( attachments ) {
		if ( this.mirroring && this.mirroring === attachments ) {
			return this;
		}

		this.unmirror();
		this.mirroring = attachments;

		// clear the collection silently. a `reset` event will be fired
		// when `observe()` calls `validateall()`.
		this.reset( [], { silent: true } );
		this.observe( attachments );

		// used for the search results.
		this.trigger( 'attachments:received', this );
		return this;
	},
	/**
	 * stop mirroring another attachments collection.
	 */
	unmirror: function() {
		if ( ! this.mirroring ) {
			return;
		}

		this.unobserve( this.mirroring );
		delete this.mirroring;
	},
	/**
	 * retrieve more attachments from the server for the collection.
	 *
	 * only works if the collection is mirroring a query attachments collection,
	 * and forwards to its `more` method. this collection class doesn't have
	 * server persistence by itself.
	 *
	 * @param {object} options
	 * @return {promise}
	 */
	more: function( options ) {
		var deferred = jquery.deferred(),
			mirroring = this.mirroring,
			attachments = this;

		if ( ! mirroring || ! mirroring.more ) {
			return deferred.resolvewith( this ).promise();
		}
		/*
		 * if we're mirroring another collection, forward `more` to
		 * the mirrored collection. account for a race condition by
		 * checking if we're still mirroring that collection when
		 * the request resolves.
		 */
		mirroring.more( options ).done( function() {
			if ( this === attachments.mirroring ) {
				deferred.resolvewith( this );
			}

			// used for the search results.
			attachments.trigger( 'attachments:received', this );
		});

		return deferred.promise();
	},
	/**
	 * whether there are more attachments that haven't been sync'd from the server
	 * that match the collection's query.
	 *
	 * only works if the collection is mirroring a query attachments collection,
	 * and forwards to its `hasmore` method. this collection class doesn't have
	 * server persistence by itself.
	 *
	 * @return {boolean}
	 */
	hasmore: function() {
		return this.mirroring ? this.mirroring.hasmore() : false;
	},
	/**
	 * holds the total number of attachments.
	 *
	 * @since 5.8.0
	 */
	totalattachments: 0,

	/**
	 * gets the total number of attachments.
	 *
	 * @since 5.8.0
	 *
	 * @return {number} the total number of attachments.
	 */
	gettotalattachments: function() {
		return this.mirroring ? this.mirroring.totalattachments : 0;
	},

	/**
	 * a custom ajax-response parser.
	 *
	 * see trac ticket #24753.
	 *
	 * called automatically by backbone whenever a collection's models are returned
	 * by the server, in fetch. the default implementation is a no-op, simply
	 * passing through the json response. we override this to add attributes to
	 * the collection items.
	 *
	 * @param {object|array} response the raw response object/array.
	 * @param {object} xhr
	 * @return {array} the array of model attributes to be added to the collection
	 */
	parse: function( response, xhr ) {
		if ( ! _.isarray( response ) ) {
			  response = [response];
		}
		return _.map( response, function( attrs ) {
			var id, attachment, newattributes;

			if ( attrs instanceof backbone.model ) {
				id = attrs.get( 'id' );
				attrs = attrs.attributes;
			} else {
				id = attrs.id;
			}

			attachment = wp.media.model.attachment.get( id );
			newattributes = attachment.parse( attrs, xhr );

			if ( ! _.isequal( attachment.attributes, newattributes ) ) {
				attachment.set( newattributes );
			}

			return attachment;
		});
	},

	/**
	 * if the collection is a query, create and mirror an attachments query collection.
	 *
	 * @access private
	 * @param {boolean} refresh deprecated, refresh parameter no longer used.
	 */
	_requery: function() {
		var props;
		if ( this.props.get('query') ) {
			props = this.props.tojson();
			this.mirror( wp.media.model.query.get( props ) );
		}
	},
	/**
	 * if this collection is sorted by `menuorder`, recalculates and saves
	 * the menu order to the database.
	 *
	 * @return {undefined|promise}
	 */
	savemenuorder: function() {
		if ( 'menuorder' !== this.props.get('orderby') ) {
			return;
		}

		/*
		 * removes any uploading attachments, updates each attachment's
		 * menu order, and returns an object with an { id: menuorder }
		 * mapping to pass to the request.
		 */
		var attachments = this.chain().filter( function( attachment ) {
			return ! _.isundefined( attachment.id );
		}).map( function( attachment, index ) {
			// indices start at 1.
			index = index + 1;
			attachment.set( 'menuorder', index );
			return [ attachment.id, index ];
		}).object().value();

		if ( _.isempty( attachments ) ) {
			return;
		}

		return wp.media.post( 'save-attachment-order', {
			nonce:       wp.media.model.settings.post.nonce,
			post_id:     wp.media.model.settings.post.id,
			attachments: attachments
		});
	}
},/** @lends wp.media.model.attachments */{
	/**
	 * a function to compare two attachment models in an attachments collection.
	 *
	 * used as the default comparator for instances of wp.media.model.attachments
	 * and its subclasses. @see wp.media.model.attachments._changeorderby().
	 *
	 * @param {backbone.model} a
	 * @param {backbone.model} b
	 * @param {object} options
	 * @return {number} -1 if the first model should come before the second,
	 *                   0 if they are of the same rank and
	 *                   1 if the first model should come after.
	 */
	comparator: function( a, b, options ) {
		var key   = this.props.get('orderby'),
			order = this.props.get('order') || 'desc',
			ac    = a.cid,
			bc    = b.cid;

		a = a.get( key );
		b = b.get( key );

		if ( 'date' === key || 'modified' === key ) {
			a = a || new date();
			b = b || new date();
		}

		// if `options.ties` is set, don't enforce the `cid` tiebreaker.
		if ( options && options.ties ) {
			ac = bc = null;
		}

		return ( 'desc' === order ) ? wp.media.compare( a, b, ac, bc ) : wp.media.compare( b, a, bc, ac );
	},
	/** @namespace wp.media.model.attachments.filters */
	filters: {
		/**
		 * @static
		 * note that this client-side searching is *not* equivalent
		 * to our server-side searching.
		 *
		 * @param {wp.media.model.attachment} attachment
		 *
		 * @this wp.media.model.attachments
		 *
		 * @return {boolean}
		 */
		search: function( attachment ) {
			if ( ! this.props.get('search') ) {
				return true;
			}

			return _.any(['title','filename','description','caption','name'], function( key ) {
				var value = attachment.get( key );
				return value && -1 !== value.search( this.props.get('search') );
			}, this );
		},
		/**
		 * @static
		 * @param {wp.media.model.attachment} attachment
		 *
		 * @this wp.media.model.attachments
		 *
		 * @return {boolean}
		 */
		type: function( attachment ) {
			var type = this.props.get('type'), atts = attachment.tojson(), mime, found;

			if ( ! type || ( _.isarray( type ) && ! type.length ) ) {
				return true;
			}

			mime = atts.mime || ( atts.file && atts.file.type ) || '';

			if ( _.isarray( type ) ) {
				found = _.find( type, function (t) {
					return -1 !== mime.indexof( t );
				} );
			} else {
				found = -1 !== mime.indexof( type );
			}

			return found;
		},
		/**
		 * @static
		 * @param {wp.media.model.attachment} attachment
		 *
		 * @this wp.media.model.attachments
		 *
		 * @return {boolean}
		 */
		uploadedto: function( attachment ) {
			var uploadedto = this.props.get('uploadedto');
			if ( _.isundefined( uploadedto ) ) {
				return true;
			}

			return uploadedto === attachment.get('uploadedto');
		},
		/**
		 * @static
		 * @param {wp.media.model.attachment} attachment
		 *
		 * @this wp.media.model.attachments
		 *
		 * @return {boolean}
		 */
		status: function( attachment ) {
			var status = this.props.get('status');
			if ( _.isundefined( status ) ) {
				return true;
			}

			return status === attachment.get('status');
		}
	}
});

module.exports = attachments;


/***/ }),

/***/ 9104:
/***/ ((module) => {

/**
 * wp.media.model.postimage
 *
 * an instance of an image that's been embedded into a post.
 *
 * used in the embedded image attachment display settings modal - @see wp.media.view.mediaframe.imagedetails.
 *
 * @memberof wp.media.model
 *
 * @class
 * @augments backbone.model
 *
 * @param {int} [attributes]               initial model attributes.
 * @param {int} [attributes.attachment_id] id of the attachment.
 **/
var postimage = backbone.model.extend(/** @lends wp.media.model.postimage.prototype */{

	initialize: function( attributes ) {
		var attachment = wp.media.model.attachment;
		this.attachment = false;

		if ( attributes.attachment_id ) {
			this.attachment = attachment.get( attributes.attachment_id );
			if ( this.attachment.get( 'url' ) ) {
				this.dfd = jquery.deferred();
				this.dfd.resolve();
			} else {
				this.dfd = this.attachment.fetch();
			}
			this.bindattachmentlisteners();
		}

		// keep url in sync with changes to the type of link.
		this.on( 'change:link', this.updatelinkurl, this );
		this.on( 'change:size', this.updatesize, this );

		this.setlinktypefromurl();
		this.setaspectratio();

		this.set( 'originalurl', attributes.url );
	},

	bindattachmentlisteners: function() {
		this.listento( this.attachment, 'sync', this.setlinktypefromurl );
		this.listento( this.attachment, 'sync', this.setaspectratio );
		this.listento( this.attachment, 'change', this.updatesize );
	},

	changeattachment: function( attachment, props ) {
		this.stoplistening( this.attachment );
		this.attachment = attachment;
		this.bindattachmentlisteners();

		this.set( 'attachment_id', this.attachment.get( 'id' ) );
		this.set( 'caption', this.attachment.get( 'caption' ) );
		this.set( 'alt', this.attachment.get( 'alt' ) );
		this.set( 'size', props.get( 'size' ) );
		this.set( 'align', props.get( 'align' ) );
		this.set( 'link', props.get( 'link' ) );
		this.updatelinkurl();
		this.updatesize();
	},

	setlinktypefromurl: function() {
		var linkurl = this.get( 'linkurl' ),
			type;

		if ( ! linkurl ) {
			this.set( 'link', 'none' );
			return;
		}

		// default to custom if there is a linkurl.
		type = 'custom';

		if ( this.attachment ) {
			if ( this.attachment.get( 'url' ) === linkurl ) {
				type = 'file';
			} else if ( this.attachment.get( 'link' ) === linkurl ) {
				type = 'post';
			}
		} else {
			if ( this.get( 'url' ) === linkurl ) {
				type = 'file';
			}
		}

		this.set( 'link', type );
	},

	updatelinkurl: function() {
		var link = this.get( 'link' ),
			url;

		switch( link ) {
			case 'file':
				if ( this.attachment ) {
					url = this.attachment.get( 'url' );
				} else {
					url = this.get( 'url' );
				}
				this.set( 'linkurl', url );
				break;
			case 'post':
				this.set( 'linkurl', this.attachment.get( 'link' ) );
				break;
			case 'none':
				this.set( 'linkurl', '' );
				break;
		}
	},

	updatesize: function() {
		var size;

		if ( ! this.attachment ) {
			return;
		}

		if ( this.get( 'size' ) === 'custom' ) {
			this.set( 'width', this.get( 'customwidth' ) );
			this.set( 'height', this.get( 'customheight' ) );
			this.set( 'url', this.get( 'originalurl' ) );
			return;
		}

		size = this.attachment.get( 'sizes' )[ this.get( 'size' ) ];

		if ( ! size ) {
			return;
		}

		this.set( 'url', size.url );
		this.set( 'width', size.width );
		this.set( 'height', size.height );
	},

	setaspectratio: function() {
		var full;

		if ( this.attachment && this.attachment.get( 'sizes' ) ) {
			full = this.attachment.get( 'sizes' ).full;

			if ( full ) {
				this.set( 'aspectratio', full.width / full.height );
				return;
			}
		}

		this.set( 'aspectratio', this.get( 'customwidth' ) / this.get( 'customheight' ) );
	}
});

module.exports = postimage;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// the module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// the require function
/******/ 	function __webpack_require__(moduleid) {
/******/ 		// check if module is in cache
/******/ 		var cachedmodule = __webpack_module_cache__[moduleid];
/******/ 		if (cachedmodule !== undefined) {
/******/ 			return cachedmodule.exports;
/******/ 		}
/******/ 		// create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleid] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// execute the module function
/******/ 		__webpack_modules__[moduleid](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/**
 * @output wp-includes/js/media-models.js
 */

var attachment, attachments, l10n, media;

/** @namespace wp */
window.wp = window.wp || {};

/**
 * create and return a media frame.
 *
 * handles the default media experience.
 *
 * @alias wp.media
 * @memberof wp
 * @namespace
 *
 * @param {object} attributes the properties passed to the main media controller.
 * @return {wp.media.view.mediaframe} a media workflow.
 */
media = wp.media = function( attributes ) {
	var mediaframe = media.view.mediaframe,
		frame;

	if ( ! mediaframe ) {
		return;
	}

	attributes = _.defaults( attributes || {}, {
		frame: 'select'
	});

	if ( 'select' === attributes.frame && mediaframe.select ) {
		frame = new mediaframe.select( attributes );
	} else if ( 'post' === attributes.frame && mediaframe.post ) {
		frame = new mediaframe.post( attributes );
	} else if ( 'manage' === attributes.frame && mediaframe.manage ) {
		frame = new mediaframe.manage( attributes );
	} else if ( 'image' === attributes.frame && mediaframe.imagedetails ) {
		frame = new mediaframe.imagedetails( attributes );
	} else if ( 'audio' === attributes.frame && mediaframe.audiodetails ) {
		frame = new mediaframe.audiodetails( attributes );
	} else if ( 'video' === attributes.frame && mediaframe.videodetails ) {
		frame = new mediaframe.videodetails( attributes );
	} else if ( 'edit-attachments' === attributes.frame && mediaframe.editattachments ) {
		frame = new mediaframe.editattachments( attributes );
	}

	delete attributes.frame;

	media.frame = frame;

	return frame;
};

/** @namespace wp.media.model */
/** @namespace wp.media.view */
/** @namespace wp.media.controller */
/** @namespace wp.media.frames */
_.extend( media, { model: {}, view: {}, controller: {}, frames: {} });

// link any localized strings.
l10n = media.model.l10n = window._wpmediamodelsl10n || {};

// link any settings.
media.model.settings = l10n.settings || {};
delete l10n.settings;

attachment = media.model.attachment = __webpack_require__( 3343 );
attachments = media.model.attachments = __webpack_require__( 8266 );

media.model.query = __webpack_require__( 1288 );
media.model.postimage = __webpack_require__( 9104 );
media.model.selection = __webpack_require__( 4134 );

/**
 * ========================================================================
 * utilities
 * ========================================================================
 */

/**
 * a basic equality comparator for backbone models.
 *
 * used to order models within a collection - @see wp.media.model.attachments.comparator().
 *
 * @param {mixed}  a  the primary parameter to compare.
 * @param {mixed}  b  the primary parameter to compare.
 * @param {string} ac the fallback parameter to compare, a's cid.
 * @param {string} bc the fallback parameter to compare, b's cid.
 * @return {number} -1: a should come before b.
 *                   0: a and b are of the same rank.
 *                   1: b should come before a.
 */
media.compare = function( a, b, ac, bc ) {
	if ( _.isequal( a, b ) ) {
		return ac === bc ? 0 : (ac > bc ? -1 : 1);
	} else {
		return a > b ? -1 : 1;
	}
};

_.extend( media, /** @lends wp.media */{
	/**
	 * media.template( id )
	 *
	 * fetch a javascript template for an id, and return a templating function for it.
	 *
	 * see wp.template() in `wp-includes/js/wp-util.js`.
	 *
	 * @borrows wp.template as template
	 */
	template: wp.template,

	/**
	 * media.post( [action], [data] )
	 *
	 * sends a post request to wordpress.
	 * see wp.ajax.post() in `wp-includes/js/wp-util.js`.
	 *
	 * @borrows wp.ajax.post as post
	 */
	post: wp.ajax.post,

	/**
	 * media.ajax( [action], [options] )
	 *
	 * sends an xhr request to wordpress.
	 * see wp.ajax.send() in `wp-includes/js/wp-util.js`.
	 *
	 * @borrows wp.ajax.send as ajax
	 */
	ajax: wp.ajax.send,

	/**
	 * scales a set of dimensions to fit within bounding dimensions.
	 *
	 * @param {object} dimensions
	 * @return {object}
	 */
	fit: function( dimensions ) {
		var width     = dimensions.width,
			height    = dimensions.height,
			maxwidth  = dimensions.maxwidth,
			maxheight = dimensions.maxheight,
			constraint;

		/*
		 * compare ratios between the two values to determine
		 * which max to constrain by. if a max value doesn't exist,
		 * then the opposite side is the constraint.
		 */
		if ( ! _.isundefined( maxwidth ) && ! _.isundefined( maxheight ) ) {
			constraint = ( width / height > maxwidth / maxheight ) ? 'width' : 'height';
		} else if ( _.isundefined( maxheight ) ) {
			constraint = 'width';
		} else if (  _.isundefined( maxwidth ) && height > maxheight ) {
			constraint = 'height';
		}

		// if the value of the constrained side is larger than the max,
		// then scale the values. otherwise return the originals; they fit.
		if ( 'width' === constraint && width > maxwidth ) {
			return {
				width : maxwidth,
				height: math.round( maxwidth * height / width )
			};
		} else if ( 'height' === constraint && height > maxheight ) {
			return {
				width : math.round( maxheight * width / height ),
				height: maxheight
			};
		} else {
			return {
				width : width,
				height: height
			};
		}
	},
	/**
	 * truncates a string by injecting an ellipsis into the middle.
	 * useful for filenames.
	 *
	 * @param {string} string
	 * @param {number} [length=30]
	 * @param {string} [replacement=&hellip;]
	 * @return {string} the string, unless length is greater than string.length.
	 */
	truncate: function( string, length, replacement ) {
		length = length || 30;
		replacement = replacement || '&hellip;';

		if ( string.length <= length ) {
			return string;
		}

		return string.substr( 0, length / 2 ) + replacement + string.substr( -1 * length / 2 );
	}
});

/**
 * ========================================================================
 * models
 * ========================================================================
 */
/**
 * wp.media.attachment
 *
 * @static
 * @param {string} id a string used to identify a model.
 * @return {wp.media.model.attachment}
 */
media.attachment = function( id ) {
	return attachment.get( id );
};

/**
 * a collection of all attachments that have been fetched from the server.
 *
 * @static
 * @member {wp.media.model.attachments}
 */
attachments.all = new attachments();

/**
 * wp.media.query
 *
 * shorthand for creating a new attachments query.
 *
 * @param {object} [props]
 * @return {wp.media.model.attachments}
 */
media.query = function( props ) {
	return new attachments( null, {
		props: _.extend( _.defaults( props || {}, { orderby: 'date' } ), { query: true } )
	});
};

/******/ })()
;




