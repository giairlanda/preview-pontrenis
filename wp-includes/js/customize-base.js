/**
 * @output wp-includes/js/customize-base.js
 */

/** @namespace wp */
window.wp = window.wp || {};

(function( exports, $ ){
	var api = {}, ctor, inherits,
		slice = array.prototype.slice;

	// shared empty constructor function to aid in prototype-chain creation.
	ctor = function() {};

	/**
	 * helper function to correctly set up the prototype chain, for subclasses.
	 * similar to `goog.inherits`, but uses a hash of prototype properties and
	 * class properties to be extended.
	 *
	 * @param object parent      parent class constructor to inherit from.
	 * @param object protoprops  properties to apply to the prototype for use as class instance properties.
	 * @param object staticprops properties to apply directly to the class constructor.
	 * @return child the subclassed constructor.
	 */
	inherits = function( parent, protoprops, staticprops ) {
		var child;

		/*
		 * the constructor function for the new subclass is either defined by you
		 * (the "constructor" property in your `extend` definition), or defaulted
		 * by us to simply call `super()`.
		 */
		if ( protoprops && protoprops.hasownproperty( 'constructor' ) ) {
			child = protoprops.constructor;
		} else {
			child = function() {
				/*
				 * storing the result `super()` before returning the value
				 * prevents a bug in opera where, if the constructor returns
				 * a function, opera will reject the return value in favor of
				 * the original object. this causes all sorts of trouble.
				 */
				var result = parent.apply( this, arguments );
				return result;
			};
		}

		// inherit class (static) properties from parent.
		$.extend( child, parent );

		// set the prototype chain to inherit from `parent`,
		// without calling `parent`'s constructor function.
		ctor.prototype  = parent.prototype;
		child.prototype = new ctor();

		// add prototype properties (instance properties) to the subclass,
		// if supplied.
		if ( protoprops ) {
			$.extend( child.prototype, protoprops );
		}

		// add static properties to the constructor function, if supplied.
		if ( staticprops ) {
			$.extend( child, staticprops );
		}

		// correctly set child's `prototype.constructor`.
		child.prototype.constructor = child;

		// set a convenience property in case the parent's prototype is needed later.
		child.__super__ = parent.prototype;

		return child;
	};

	/**
	 * base class for object inheritance.
	 */
	api.class = function( applicator, argsarray, options ) {
		var magic, args = arguments;

		if ( applicator && argsarray && api.class.applicator === applicator ) {
			args = argsarray;
			$.extend( this, options || {} );
		}

		magic = this;

		/*
		 * if the class has a method called "instance",
		 * the return value from the class' constructor will be a function that
		 * calls the "instance" method.
		 *
		 * it is also an object that has properties and methods inside it.
		 */
		if ( this.instance ) {
			magic = function() {
				return magic.instance.apply( magic, arguments );
			};

			$.extend( magic, this );
		}

		magic.initialize.apply( magic, args );
		return magic;
	};

	/**
	 * creates a subclass of the class.
	 *
	 * @param object protoprops  properties to apply to the prototype.
	 * @param object staticprops properties to apply directly to the class.
	 * @return child the subclass.
	 */
	api.class.extend = function( protoprops, staticprops ) {
		var child = inherits( this, protoprops, staticprops );
		child.extend = this.extend;
		return child;
	};

	api.class.applicator = {};

	/**
	 * initialize a class instance.
	 *
	 * override this function in a subclass as needed.
	 */
	api.class.prototype.initialize = function() {};

	/*
	 * checks whether a given instance extended a constructor.
	 *
	 * the magic surrounding the instance parameter causes the instanceof
	 * keyword to return inaccurate results; it defaults to the function's
	 * prototype instead of the constructor chain. hence this function.
	 */
	api.class.prototype.extended = function( constructor ) {
		var proto = this;

		while ( typeof proto.constructor !== 'undefined' ) {
			if ( proto.constructor === constructor ) {
				return true;
			}
			if ( typeof proto.constructor.__super__ === 'undefined' ) {
				return false;
			}
			proto = proto.constructor.__super__;
		}
		return false;
	};

	/**
	 * an events manager object, offering the ability to bind to and trigger events.
	 *
	 * used as a mixin.
	 */
	api.events = {
		trigger: function( id ) {
			if ( this.topics && this.topics[ id ] ) {
				this.topics[ id ].firewith( this, slice.call( arguments, 1 ) );
			}
			return this;
		},

		bind: function( id ) {
			this.topics = this.topics || {};
			this.topics[ id ] = this.topics[ id ] || $.callbacks();
			this.topics[ id ].add.apply( this.topics[ id ], slice.call( arguments, 1 ) );
			return this;
		},

		unbind: function( id ) {
			if ( this.topics && this.topics[ id ] ) {
				this.topics[ id ].remove.apply( this.topics[ id ], slice.call( arguments, 1 ) );
			}
			return this;
		}
	};

	/**
	 * observable values that support two-way binding.
	 *
	 * @memberof wp.customize
	 * @alias wp.customize.value
	 *
	 * @constructor
	 */
	api.value = api.class.extend(/** @lends wp.customize.value.prototype */{
		/**
		 * @param {mixed}  initial the initial value.
		 * @param {object} options
		 */
		initialize: function( initial, options ) {
			this._value = initial; // @todo potentially change this to a this.set() call.
			this.callbacks = $.callbacks();
			this._dirty = false;

			$.extend( this, options || {} );

			this.set = this.set.bind( this );
		},

		/*
		 * magic. returns a function that will become the instance.
		 * set to null to prevent the instance from extending a function.
		 */
		instance: function() {
			return arguments.length ? this.set.apply( this, arguments ) : this.get();
		},

		/**
		 * get the value.
		 *
		 * @return {mixed}
		 */
		get: function() {
			return this._value;
		},

		/**
		 * set the value and trigger all bound callbacks.
		 *
		 * @param {object} to new value.
		 */
		set: function( to ) {
			var from = this._value;

			to = this._setter.apply( this, arguments );
			to = this.validate( to );

			// bail if the sanitized value is null or unchanged.
			if ( null === to || _.isequal( from, to ) ) {
				return this;
			}

			this._value = to;
			this._dirty = true;

			this.callbacks.firewith( this, [ to, from ] );

			return this;
		},

		_setter: function( to ) {
			return to;
		},

		setter: function( callback ) {
			var from = this.get();
			this._setter = callback;
			// temporarily clear value so setter can decide if it's valid.
			this._value = null;
			this.set( from );
			return this;
		},

		resetsetter: function() {
			this._setter = this.constructor.prototype._setter;
			this.set( this.get() );
			return this;
		},

		validate: function( value ) {
			return value;
		},

		/**
		 * bind a function to be invoked whenever the value changes.
		 *
		 * @param {...function} a function, or multiple functions, to add to the callback stack.
		 */
		bind: function() {
			this.callbacks.add.apply( this.callbacks, arguments );
			return this;
		},

		/**
		 * unbind a previously bound function.
		 *
		 * @param {...function} a function, or multiple functions, to remove from the callback stack.
		 */
		unbind: function() {
			this.callbacks.remove.apply( this.callbacks, arguments );
			return this;
		},

		link: function() { // values*
			var set = this.set;
			$.each( arguments, function() {
				this.bind( set );
			});
			return this;
		},

		unlink: function() { // values*
			var set = this.set;
			$.each( arguments, function() {
				this.unbind( set );
			});
			return this;
		},

		sync: function() { // values*
			var that = this;
			$.each( arguments, function() {
				that.link( this );
				this.link( that );
			});
			return this;
		},

		unsync: function() { // values*
			var that = this;
			$.each( arguments, function() {
				that.unlink( this );
				this.unlink( that );
			});
			return this;
		}
	});

	/**
	 * a collection of observable values.
	 *
	 * @memberof wp.customize
	 * @alias wp.customize.values
	 *
	 * @constructor
	 * @augments wp.customize.class
	 * @mixes wp.customize.events
	 */
	api.values = api.class.extend(/** @lends wp.customize.values.prototype */{

		/**
		 * the default constructor for items of the collection.
		 *
		 * @type {object}
		 */
		defaultconstructor: api.value,

		initialize: function( options ) {
			$.extend( this, options || {} );

			this._value = {};
			this._deferreds = {};
		},

		/**
		 * get the instance of an item from the collection if only id is specified.
		 *
		 * if more than one argument is supplied, all are expected to be ids and
		 * the last to be a function callback that will be invoked when the requested
		 * items are available.
		 *
		 * @see {api.values.when}
		 *
		 * @param {string} id id of the item.
		 * @param {...}       zero or more ids of items to wait for and a callback
		 *                    function to invoke when they're available. optional.
		 * @return {mixed} the item instance if only one id was supplied.
		 *                 a deferred promise object if a callback function is supplied.
		 */
		instance: function( id ) {
			if ( arguments.length === 1 ) {
				return this.value( id );
			}

			return this.when.apply( this, arguments );
		},

		/**
		 * get the instance of an item.
		 *
		 * @param {string} id the id of the item.
		 * @return {[type]} [description]
		 */
		value: function( id ) {
			return this._value[ id ];
		},

		/**
		 * whether the collection has an item with the given id.
		 *
		 * @param {string} id the id of the item to look for.
		 * @return {boolean}
		 */
		has: function( id ) {
			return typeof this._value[ id ] !== 'undefined';
		},

		/**
		 * add an item to the collection.
		 *
		 * @param {string|wp.customize.class} item         - the item instance to add, or the id for the instance to add.
		 *                                                   when an id string is supplied, then itemobject must be provided.
		 * @param {wp.customize.class}        [itemobject] - the item instance when the first argument is an id string.
		 * @return {wp.customize.class} the new item's instance, or an existing instance if already added.
		 */
		add: function( item, itemobject ) {
			var collection = this, id, instance;
			if ( 'string' === typeof item ) {
				id = item;
				instance = itemobject;
			} else {
				if ( 'string' !== typeof item.id ) {
					throw new error( 'unknown key' );
				}
				id = item.id;
				instance = item;
			}

			if ( collection.has( id ) ) {
				return collection.value( id );
			}

			collection._value[ id ] = instance;
			instance.parent = collection;

			// propagate a 'change' event on an item up to the collection.
			if ( instance.extended( api.value ) ) {
				instance.bind( collection._change );
			}

			collection.trigger( 'add', instance );

			// if a deferred object exists for this item,
			// resolve it.
			if ( collection._deferreds[ id ] ) {
				collection._deferreds[ id ].resolve();
			}

			return collection._value[ id ];
		},

		/**
		 * create a new item of the collection using the collection's default constructor
		 * and store it in the collection.
		 *
		 * @param {string} id    the id of the item.
		 * @param {mixed}  value any extra arguments are passed into the item's initialize method.
		 * @return {mixed} the new item's instance.
		 */
		create: function( id ) {
			return this.add( id, new this.defaultconstructor( api.class.applicator, slice.call( arguments, 1 ) ) );
		},

		/**
		 * iterate over all items in the collection invoking the provided callback.
		 *
		 * @param {function} callback function to invoke.
		 * @param {object}   context  object context to invoke the function with. optional.
		 */
		each: function( callback, context ) {
			context = typeof context === 'undefined' ? this : context;

			$.each( this._value, function( key, obj ) {
				callback.call( context, obj, key );
			});
		},

		/**
		 * remove an item from the collection.
		 *
		 * @param {string} id the id of the item to remove.
		 */
		remove: function( id ) {
			var value = this.value( id );

			if ( value ) {

				// trigger event right before the element is removed from the collection.
				this.trigger( 'remove', value );

				if ( value.extended( api.value ) ) {
					value.unbind( this._change );
				}
				delete value.parent;
			}

			delete this._value[ id ];
			delete this._deferreds[ id ];

			// trigger removed event after the item has been eliminated from the collection.
			if ( value ) {
				this.trigger( 'removed', value );
			}
		},

		/**
		 * runs a callback once all requested values exist.
		 *
		 * when( ids*, [callback] );
		 *
		 * for example:
		 *     when( id1, id2, id3, function( value1, value2, value3 ) {} );
		 *
		 * @return $.deferred.promise();
		 */
		when: function() {
			var self = this,
				ids  = slice.call( arguments ),
				dfd  = $.deferred();

			// if the last argument is a callback, bind it to .done().
			if ( typeof ids[ ids.length - 1 ] === 'function' ) {
				dfd.done( ids.pop() );
			}

			/*
			 * create a stack of deferred objects for each item that is not
			 * yet available, and invoke the supplied callback when they are.
			 */
			$.when.apply( $, $.map( ids, function( id ) {
				if ( self.has( id ) ) {
					return;
				}

				/*
				 * the requested item is not available yet, create a deferred
				 * object to resolve when it becomes available.
				 */
				return self._deferreds[ id ] = self._deferreds[ id ] || $.deferred();
			})).done( function() {
				var values = $.map( ids, function( id ) {
						return self( id );
					});

				// if a value is missing, we've used at least one expired deferred.
				// call values.when again to generate a new deferred.
				if ( values.length !== ids.length ) {
					// ids.push( callback );
					self.when.apply( self, ids ).done( function() {
						dfd.resolvewith( self, values );
					});
					return;
				}

				dfd.resolvewith( self, values );
			});

			return dfd.promise();
		},

		/**
		 * a helper function to propagate a 'change' event from an item
		 * to the collection itself.
		 */
		_change: function() {
			this.parent.trigger( 'change', this );
		}
	});

	// create a global events bus on the customizer.
	$.extend( api.values.prototype, api.events );


	/**
	 * cast a string to a jquery collection if it isn't already.
	 *
	 * @param {string|jquery collection} element
	 */
	api.ensure = function( element ) {
		return typeof element === 'string' ? $( element ) : element;
	};

	/**
	 * an observable value that syncs with an element.
	 *
	 * handles inputs, selects, and textareas by default.
	 *
	 * @memberof wp.customize
	 * @alias wp.customize.element
	 *
	 * @constructor
	 * @augments wp.customize.value
	 * @augments wp.customize.class
	 */
	api.element = api.value.extend(/** @lends wp.customize.element */{
		initialize: function( element, options ) {
			var self = this,
				synchronizer = api.element.synchronizer.html,
				type, update, refresh;

			this.element = api.ensure( element );
			this.events = '';

			if ( this.element.is( 'input, select, textarea' ) ) {
				type = this.element.prop( 'type' );
				this.events += ' change input';
				synchronizer = api.element.synchronizer.val;

				if ( this.element.is( 'input' ) && api.element.synchronizer[ type ] ) {
					synchronizer = api.element.synchronizer[ type ];
				}
			}

			api.value.prototype.initialize.call( this, null, $.extend( options || {}, synchronizer ) );
			this._value = this.get();

			update = this.update;
			refresh = this.refresh;

			this.update = function( to ) {
				if ( to !== refresh.call( self ) ) {
					update.apply( this, arguments );
				}
			};
			this.refresh = function() {
				self.set( refresh.call( self ) );
			};

			this.bind( this.update );
			this.element.on( this.events, this.refresh );
		},

		find: function( selector ) {
			return $( selector, this.element );
		},

		refresh: function() {},

		update: function() {}
	});

	api.element.synchronizer = {};

	$.each( [ 'html', 'val' ], function( index, method ) {
		api.element.synchronizer[ method ] = {
			update: function( to ) {
				this.element[ method ]( to );
			},
			refresh: function() {
				return this.element[ method ]();
			}
		};
	});

	api.element.synchronizer.checkbox = {
		update: function( to ) {
			this.element.prop( 'checked', to );
		},
		refresh: function() {
			return this.element.prop( 'checked' );
		}
	};

	api.element.synchronizer.radio = {
		update: function( to ) {
			this.element.filter( function() {
				return this.value === to;
			}).prop( 'checked', true );
		},
		refresh: function() {
			return this.element.filter( ':checked' ).val();
		}
	};

	$.support.postmessage = !! window.postmessage;

	/**
	 * a communicator for sending data from one window to another over postmessage.
	 *
	 * @memberof wp.customize
	 * @alias wp.customize.messenger
	 *
	 * @constructor
	 * @augments wp.customize.class
	 * @mixes wp.customize.events
	 */
	api.messenger = api.class.extend(/** @lends wp.customize.messenger.prototype */{
		/**
		 * create a new value.
		 *
		 * @param {string} key     unique identifier.
		 * @param {mixed}  initial initial value.
		 * @param {mixed}  options options hash. optional.
		 * @return {value} class instance of the value.
		 */
		add: function( key, initial, options ) {
			return this[ key ] = new api.value( initial, options );
		},

		/**
		 * initialize messenger.
		 *
		 * @param {object} params  - parameters to configure the messenger.
		 *        {string} params.url          - the url to communicate with.
		 *        {window} params.targetwindow - the window instance to communicate with. default window.parent.
		 *        {string} params.channel      - if provided, will send the channel with each message and only accept messages a matching channel.
		 * @param {object} options - extend any instance parameter or method with this object.
		 */
		initialize: function( params, options ) {
			// target the parent frame by default, but only if a parent frame exists.
			var defaulttarget = window.parent === window ? null : window.parent;

			$.extend( this, options || {} );

			this.add( 'channel', params.channel );
			this.add( 'url', params.url || '' );
			this.add( 'origin', this.url() ).link( this.url ).setter( function( to ) {
				var urlparser = document.createelement( 'a' );
				urlparser.href = to;
				// port stripping needed by ie since it adds to host but not to event.origin.
				return urlparser.protocol + '//' + urlparser.host.replace( /:(80|443)$/, '' );
			});

			// first add with no value.
			this.add( 'targetwindow', null );
			// this avoids securityerrors when setting a window object in x-origin iframe'd scenarios.
			this.targetwindow.set = function( to ) {
				var from = this._value;

				to = this._setter.apply( this, arguments );
				to = this.validate( to );

				if ( null === to || from === to ) {
					return this;
				}

				this._value = to;
				this._dirty = true;

				this.callbacks.firewith( this, [ to, from ] );

				return this;
			};
			// now set it.
			this.targetwindow( params.targetwindow || defaulttarget );


			/*
			 * since we want jquery to treat the receive function as unique
			 * to this instance, we give the function a new guid.
			 *
			 * this will prevent every messenger's receive function from being
			 * unbound when calling $.off( 'message', this.receive );
			 */
			this.receive = this.receive.bind( this );
			this.receive.guid = $.guid++;

			$( window ).on( 'message', this.receive );
		},

		destroy: function() {
			$( window ).off( 'message', this.receive );
		},

		/**
		 * receive data from the other window.
		 *
		 * @param {jquery.event} event event with embedded data.
		 */
		receive: function( event ) {
			var message;

			event = event.originalevent;

			if ( ! this.targetwindow || ! this.targetwindow() ) {
				return;
			}

			// check to make sure the origin is valid.
			if ( this.origin() && event.origin !== this.origin() ) {
				return;
			}

			// ensure we have a string that's json.parse-able.
			if ( typeof event.data !== 'string' || event.data[0] !== '{' ) {
				return;
			}

			message = json.parse( event.data );

			// check required message properties.
			if ( ! message || ! message.id || typeof message.data === 'undefined' ) {
				return;
			}

			// check if channel names match.
			if ( ( message.channel || this.channel() ) && this.channel() !== message.channel ) {
				return;
			}

			this.trigger( message.id, message.data );
		},

		/**
		 * send data to the other window.
		 *
		 * @param {string} id   the event name.
		 * @param {object} data data.
		 */
		send: function( id, data ) {
			var message;

			data = typeof data === 'undefined' ? null : data;

			if ( ! this.url() || ! this.targetwindow() ) {
				return;
			}

			message = { id: id, data: data };
			if ( this.channel() ) {
				message.channel = this.channel();
			}

			this.targetwindow().postmessage( json.stringify( message ), this.origin() );
		}
	});

	// add the events mixin to api.messenger.
	$.extend( api.messenger.prototype, api.events );

	/**
	 * notification.
	 *
	 * @class
	 * @augments wp.customize.class
	 * @since 4.6.0
	 *
	 * @memberof wp.customize
	 * @alias wp.customize.notification
	 *
	 * @param {string}  code - the error code.
	 * @param {object}  params - params.
	 * @param {string}  params.message=null - the error message.
	 * @param {string}  [params.type=error] - the notification type.
	 * @param {boolean} [params.fromserver=false] - whether the notification was server-sent.
	 * @param {string}  [params.setting=null] - the setting id that the notification is related to.
	 * @param {*}       [params.data=null] - any additional data.
	 */
	api.notification = api.class.extend(/** @lends wp.customize.notification.prototype */{

		/**
		 * template function for rendering the notification.
		 *
		 * this will be populated with template option or else it will be populated with template from the id.
		 *
		 * @since 4.9.0
		 * @var {function}
		 */
		template: null,

		/**
		 * id for the template to render the notification.
		 *
		 * @since 4.9.0
		 * @var {string}
		 */
		templateid: 'customize-notification',

		/**
		 * additional class names to add to the notification container.
		 *
		 * @since 4.9.0
		 * @var {string}
		 */
		containerclasses: '',

		/**
		 * initialize notification.
		 *
		 * @since 4.9.0
		 *
		 * @param {string}   code - notification code.
		 * @param {object}   params - notification parameters.
		 * @param {string}   params.message - message.
		 * @param {string}   [params.type=error] - type.
		 * @param {string}   [params.setting] - related setting id.
		 * @param {function} [params.template] - function for rendering template. if not provided, this will come from templateid.
		 * @param {string}   [params.templateid] - id for template to render the notification.
		 * @param {string}   [params.containerclasses] - additional class names to add to the notification container.
		 * @param {boolean}  [params.dismissible] - whether the notification can be dismissed.
		 */
		initialize: function( code, params ) {
			var _params;
			this.code = code;
			_params = _.extend(
				{
					message: null,
					type: 'error',
					fromserver: false,
					data: null,
					setting: null,
					template: null,
					dismissible: false,
					containerclasses: ''
				},
				params
			);
			delete _params.code;
			_.extend( this, _params );
		},

		/**
		 * render the notification.
		 *
		 * @since 4.9.0
		 *
		 * @return {jquery} notification container element.
		 */
		render: function() {
			var notification = this, container, data;
			if ( ! notification.template ) {
				notification.template = wp.template( notification.templateid );
			}
			data = _.extend( {}, notification, {
				alt: notification.parent && notification.parent.alt
			} );
			container = $( notification.template( data ) );

			if ( notification.dismissible ) {
				container.find( '.notice-dismiss' ).on( 'click keydown', function( event ) {
					if ( 'keydown' === event.type && 13 !== event.which ) {
						return;
					}

					if ( notification.parent ) {
						notification.parent.remove( notification.code );
					} else {
						container.remove();
					}
				});
			}

			return container;
		}
	});

	// the main api object is also a collection of all customizer settings.
	api = $.extend( new api.values(), api );

	/**
	 * get all customize settings.
	 *
	 * @alias wp.customize.get
	 *
	 * @return {object}
	 */
	api.get = function() {
		var result = {};

		this.each( function( obj, key ) {
			result[ key ] = obj.get();
		});

		return result;
	};

	/**
	 * utility function namespace
	 *
	 * @namespace wp.customize.utils
	 */
	api.utils = {};

	/**
	 * parse query string.
	 *
	 * @since 4.7.0
	 * @access public
	 *
	 * @alias wp.customize.utils.parsequerystring
	 *
	 * @param {string} querystring query string.
	 * @return {object} parsed query string.
	 */
	api.utils.parsequerystring = function parsequerystring( querystring ) {
		var queryparams = {};
		_.each( querystring.split( '&' ), function( pair ) {
			var parts, key, value;
			parts = pair.split( '=', 2 );
			if ( ! parts[0] ) {
				return;
			}
			key = decodeuricomponent( parts[0].replace( /\+/g, ' ' ) );
			key = key.replace( / /g, '_' ); // what php does.
			if ( _.isundefined( parts[1] ) ) {
				value = null;
			} else {
				value = decodeuricomponent( parts[1].replace( /\+/g, ' ' ) );
			}
			queryparams[ key ] = value;
		} );
		return queryparams;
	};

	/**
	 * expose the api publicly on window.wp.customize
	 *
	 * @namespace wp.customize
	 */
	exports.customize = api;
})( wp, jquery );





