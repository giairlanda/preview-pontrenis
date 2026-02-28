/**
 * @output wp-includes/js/wp-backbone.js
 */

/** @namespace wp */
window.wp = window.wp || {};

(function ($) {
	/**
	 * create the wordpress backbone namespace.
	 *
	 * @namespace wp.backbone
	 */
	wp.backbone = {};

	/**
	 * a backbone subview manager.
	 *
	 * @since 3.5.0
	 * @since 3.6.0 moved wp.media.views to wp.backbone.subviews.
	 *
	 * @memberof wp.backbone
	 *
	 * @class
	 *
	 * @param {wp.backbone.view} view  the main view.
	 * @param {array|object}     views the subviews for the main view.
	 */
	wp.backbone.subviews = function( view, views ) {
		this.view = view;
		this._views = _.isarray( views ) ? { '': views } : views || {};
	};

	wp.backbone.subviews.extend = backbone.model.extend;

	_.extend( wp.backbone.subviews.prototype, {
		/**
		 * fetches all of the subviews.
		 *
		 * @since 3.5.0
		 *
		 * @return {array} all the subviews.
		 */
		all: function() {
			return _.flatten( _.values( this._views ) );
		},

		/**
		 * fetches all subviews that match a given `selector`.
		 *
		 * if no `selector` is provided, it will grab all subviews attached
		 * to the view's root.
		 *
		 * @since 3.5.0
		 *
		 * @param {string} selector a jquery selector.
		 *
		 * @return {array} all the subviews that match the selector.
		 */
		get: function( selector ) {
			selector = selector || '';
			return this._views[ selector ];
		},

		/**
		 * fetches the first subview that matches a given `selector`.
		 *
		 * if no `selector` is provided, it will grab the first subview attached to the
		 * view's root.
		 *
		 * useful when a selector only has one subview at a time.
		 *
		 * @since 3.5.0
		 *
		 * @param {string} selector a jquery selector.
		 *
		 * @return {backbone.view} the view.
		 */
		first: function( selector ) {
			var views = this.get( selector );
			return views && views.length ? views[0] : null;
		},

		/**
		 * registers subview(s).
		 *
		 * registers any number of `views` to a `selector`.
		 *
		 * when no `selector` is provided, the root selector (the empty string)
		 * is used. `views` accepts a `backbone.view` instance or an array of
		 * `backbone.view` instances.
		 *
		 * ---
		 *
		 * accepts an `options` object, which has a significant effect on the
		 * resulting behavior.
		 *
		 * `options.silent` - *boolean, `false`*
		 * if `options.silent` is true, no dom modifications will be made.
		 *
		 * `options.add` - *boolean, `false`*
		 * use `views.add()` as a shortcut for setting `options.add` to true.
		 *
		 * by default, the provided `views` will replace any existing views
		 * associated with the selector. if `options.add` is true, the provided
		 * `views` will be added to the existing views.
		 *
		 * `options.at` - *integer, `undefined`*
		 * when adding, to insert `views` at a specific index, use `options.at`.
		 * by default, `views` are added to the end of the array.
		 *
		 * @since 3.5.0
		 *
		 * @param {string}       selector a jquery selector.
		 * @param {array|object} views    the subviews for the main view.
		 * @param {object}       options  options for call. if `options.silent` is true,
		 *                                no dom  modifications will be made. use
		 *                                `views.add()` as a shortcut for setting
		 *                                `options.add` to true. if `options.add` is
		 *                                true, the provided `views` will be added to
		 *                                the existing views. when adding, to insert
		 *                                `views` at a specific index, use `options.at`.
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		 */
		set: function( selector, views, options ) {
			var existing, next;

			if ( ! _.isstring( selector ) ) {
				options  = views;
				views    = selector;
				selector = '';
			}

			options  = options || {};
			views    = _.isarray( views ) ? views : [ views ];
			existing = this.get( selector );
			next     = views;

			if ( existing ) {
				if ( options.add ) {
					if ( _.isundefined( options.at ) ) {
						next = existing.concat( views );
					} else {
						next = existing;
						next.splice.apply( next, [ options.at, 0 ].concat( views ) );
					}
				} else {
					_.each( next, function( view ) {
						view.__detach = true;
					});

					_.each( existing, function( view ) {
						if ( view.__detach )
							view.$el.detach();
						else
							view.remove();
					});

					_.each( next, function( view ) {
						delete view.__detach;
					});
				}
			}

			this._views[ selector ] = next;

			_.each( views, function( subview ) {
				var constructor = subview.views || wp.backbone.subviews,
					subviews = subview.views = subview.views || new constructor( subview );
				subviews.parent   = this.view;
				subviews.selector = selector;
			}, this );

			if ( ! options.silent )
				this._attach( selector, views, _.extend({ ready: this._isready() }, options ) );

			return this;
		},

		/**
		 * add subview(s) to existing subviews.
		 *
		 * an alias to `views.set()`, which defaults `options.add` to true.
		 *
		 * adds any number of `views` to a `selector`.
		 *
		 * when no `selector` is provided, the root selector (the empty string)
		 * is used. `views` accepts a `backbone.view` instance or an array of
		 * `backbone.view` instances.
		 *
		 * uses `views.set()` when setting `options.add` to `false`.
		 *
		 * accepts an `options` object. by default, provided `views` will be
		 * inserted at the end of the array of existing views. to insert
		 * `views` at a specific index, use `options.at`. if `options.silent`
		 * is true, no dom modifications will be made.
		 *
		 * for more information on the `options` object, see `views.set()`.
		 *
		 * @since 3.5.0
		 *
		 * @param {string}       selector a jquery selector.
		 * @param {array|object} views    the subviews for the main view.
		 * @param {object}       options  options for call.  to insert `views` at a
		 *                                specific index, use `options.at`. if
		 *                                `options.silent` is true, no dom modifications
		 *                                will be made.
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		 */
		add: function( selector, views, options ) {
			if ( ! _.isstring( selector ) ) {
				options  = views;
				views    = selector;
				selector = '';
			}

			return this.set( selector, views, _.extend({ add: true }, options ) );
		},

		/**
		 * removes an added subview.
		 *
		 * stops tracking `views` registered to a `selector`. if no `views` are
		 * set, then all of the `selector`'s subviews will be unregistered and
		 * removed.
		 *
		 * accepts an `options` object. if `options.silent` is set, `remove`
		 * will *not* be triggered on the unregistered views.
		 *
		 * @since 3.5.0
		 *
		 * @param {string}       selector a jquery selector.
		 * @param {array|object} views    the subviews for the main view.
		 * @param {object}       options  options for call. if `options.silent` is set,
		 *                                `remove` will *not* be triggered on the
		 *                                unregistered views.
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		 */
		unset: function( selector, views, options ) {
			var existing;

			if ( ! _.isstring( selector ) ) {
				options = views;
				views = selector;
				selector = '';
			}

			views = views || [];

			if ( existing = this.get( selector ) ) {
				views = _.isarray( views ) ? views : [ views ];
				this._views[ selector ] = views.length ? _.difference( existing, views ) : [];
			}

			if ( ! options || ! options.silent )
				_.invoke( views, 'remove' );

			return this;
		},

		/**
		 * detaches all subviews.
		 *
		 * helps to preserve all subview events when re-rendering the master
		 * view. used in conjunction with `views.render()`.
		 *
		 * @since 3.5.0
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		 */
		detach: function() {
			$( _.pluck( this.all(), 'el' ) ).detach();
			return this;
		},

		/**
		 * renders all subviews.
		 *
		 * used in conjunction with `views.detach()`.
		 *
		 * @since 3.5.0
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		*/
		render: function() {
			var options = {
					ready: this._isready()
				};

			_.each( this._views, function( views, selector ) {
				this._attach( selector, views, options );
			}, this );

			this.rendered = true;
			return this;
		},

		/**
		 * removes all subviews.
		 *
		 * triggers the `remove()` method on all subviews. detaches the master
		 * view from its parent. resets the internals of the views manager.
		 *
		 * accepts an `options` object. if `options.silent` is set, `unset`
		 * will *not* be triggered on the master view's parent.
		 *
		 * @since 3.6.0
		 *
		 * @param {object}  options        options for call.
		 * @param {boolean} options.silent if true, `unset` will *not* be triggered on
		 *                                 the master views' parent.
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		*/
		remove: function( options ) {
			if ( ! options || ! options.silent ) {
				if ( this.parent && this.parent.views )
					this.parent.views.unset( this.selector, this.view, { silent: true });
				delete this.parent;
				delete this.selector;
			}

			_.invoke( this.all(), 'remove' );
			this._views = [];
			return this;
		},

		/**
		 * replaces a selector's subviews
		 *
		 * by default, sets the `$target` selector's html to the subview `els`.
		 *
		 * can be overridden in subclasses.
		 *
		 * @since 3.5.0
		 *
		 * @param {string} $target selector where to put the elements.
		 * @param {*} els html or elements to put into the selector's html.
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		 */
		replace: function( $target, els ) {
			$target.html( els );
			return this;
		},

		/**
		 * insert subviews into a selector.
		 *
		 * by default, appends the subview `els` to the end of the `$target`
		 * selector. if `options.at` is set, inserts the subview `els` at the
		 * provided index.
		 *
		 * can be overridden in subclasses.
		 *
		 * @since 3.5.0
		 *
		 * @param {string}  $target    selector where to put the elements.
		 * @param {*}       els        html or elements to put at the end of the
		 *                             $target.
		 * @param {?object} options    options for call.
		 * @param {?number} options.at at which index to put the elements.
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		 */
		insert: function( $target, els, options ) {
			var at = options && options.at,
				$children;

			if ( _.isnumber( at ) && ($children = $target.children()).length > at )
				$children.eq( at ).before( els );
			else
				$target.append( els );

			return this;
		},

		/**
		 * triggers the ready event.
		 *
		 * only use this method if you know what you're doing. for performance reasons,
		 * this method does not check if the view is actually attached to the dom. it's
		 * taking your word for it.
		 *
		 * fires the ready event on the current view and all attached subviews.
		 *
		 * @since 3.5.0
		 */
		ready: function() {
			this.view.trigger('ready');

			// find all attached subviews, and call ready on them.
			_.chain( this.all() ).map( function( view ) {
				return view.views;
			}).flatten().where({ attached: true }).invoke('ready');
		},
		/**
		 * attaches a series of views to a selector. internal.
		 *
		 * checks to see if a matching selector exists, renders the views,
		 * performs the proper dom operation, and then checks if the view is
		 * attached to the document.
		 *
		 * @since 3.5.0
		 *
		 * @private
		 *
		 * @param {string}       selector    a jquery selector.
		 * @param {array|object} views       the subviews for the main view.
		 * @param {object}       options     options for call.
		 * @param {boolean}      options.add if true the provided views will be added.
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		 */
		_attach: function( selector, views, options ) {
			var $selector = selector ? this.view.$( selector ) : this.view.$el,
				managers;

			// check if we found a location to attach the views.
			if ( ! $selector.length )
				return this;

			managers = _.chain( views ).pluck('views').flatten().value();

			// render the views if necessary.
			_.each( managers, function( manager ) {
				if ( manager.rendered )
					return;

				manager.view.render();
				manager.rendered = true;
			}, this );

			// insert or replace the views.
			this[ options.add ? 'insert' : 'replace' ]( $selector, _.pluck( views, 'el' ), options );

			/*
			 * set attached and trigger ready if the current view is already
			 * attached to the dom.
			 */
			_.each( managers, function( manager ) {
				manager.attached = true;

				if ( options.ready )
					manager.ready();
			}, this );

			return this;
		},

		/**
		 * determines whether or not the current view is in the dom.
		 *
		 * @since 3.5.0
		 *
		 * @private
		 *
		 * @return {boolean} whether or not the current view is in the dom.
		 */
		_isready: function() {
			var node = this.view.el;
			while ( node ) {
				if ( node === document.body )
					return true;
				node = node.parentnode;
			}

			return false;
		}
	});

	wp.backbone.view = backbone.view.extend({

		// the constructor for the `views` manager.
		subviews: wp.backbone.subviews,

		/**
		 * the base view class.
		 *
		 * this extends the backbone view to have a build-in way to use subviews. this
		 * makes it easier to have nested views.
		 *
		 * @since 3.5.0
		 * @since 3.6.0 moved wp.media.view to wp.backbone.view
		 *
		 * @constructs
		 * @augments backbone.view
		 *
		 * @memberof wp.backbone
		 *
		 *
		 * @param {object} options the options for this view.
		 */
		constructor: function( options ) {
			this.views = new this.subviews( this, this.views );
			this.on( 'ready', this.ready, this );

			this.options = options || {};

			backbone.view.apply( this, arguments );
		},

		/**
		 * removes this view and all subviews.
		 *
		 * @since 3.5.0
		 *
		 * @return {wp.backbone.subviews} the current subviews instance.
		 */
		remove: function() {
			var result = backbone.view.prototype.remove.apply( this, arguments );

			// recursively remove child views.
			if ( this.views )
				this.views.remove();

			return result;
		},

		/**
		 * renders this view and all subviews.
		 *
		 * @since 3.5.0
		 *
		 * @return {wp.backbone.view} the current instance of the view.
		 */
		render: function() {
			var options;

			if ( this.prepare )
				options = this.prepare();

			this.views.detach();

			if ( this.template ) {
				options = options || {};
				this.trigger( 'prepare', options );
				this.$el.html( this.template( options ) );
			}

			this.views.render();
			return this;
		},

		/**
		 * returns the options for this view.
		 *
		 * @since 3.5.0
		 *
		 * @return {object} the options for this view.
		 */
		prepare: function() {
			return this.options;
		},

		/**
		 * method that is called when the ready event is triggered.
		 *
		 * @since 3.5.0
		 */
		ready: function() {}
	});
}(jquery));





