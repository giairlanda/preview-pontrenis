//     backbone.js 1.6.0

//     (c) 2010-2024 jeremy ashkenas and documentcloud
//     backbone may be freely distributed under the mit license.
//     for all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // we use `self` instead of `window` for `webworker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global;

  // set up backbone appropriately for the environment. start with amd.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // export global even in amd case in case this script is loaded with
      // others that may still expect a global backbone.
      root.backbone = factory(root, exports, _, $);
    });

  // next for node.js or commonjs. jquery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, exports, _, $);

  // finally, as a browser global.
  } else {
    root.backbone = factory(root, {}, root._, root.jquery || root.zepto || root.ender || root.$);
  }

})(function(root, backbone, _, $) {

  // initial setup
  // -------------

  // save the previous value of the `backbone` variable, so that it can be
  // restored later on, if `noconflict` is used.
  var previousbackbone = root.backbone;

  // create a local reference to a common array method we'll want to use later.
  var slice = array.prototype.slice;

  // current version of the library. keep in sync with `package.json`.
  backbone.version = '1.6.0';

  // for backbone's purposes, jquery, zepto, ender, or my library (kidding) owns
  // the `$` variable.
  backbone.$ = $;

  // runs backbone.js in *noconflict* mode, returning the `backbone` variable
  // to its previous owner. returns a reference to this backbone object.
  backbone.noconflict = function() {
    root.backbone = previousbackbone;
    return this;
  };

  // turn on `emulatehttp` to support legacy http servers. setting this option
  // will fake `"patch"`, `"put"` and `"delete"` requests via the `_method` parameter and
  // set a `x-http-method-override` header.
  backbone.emulatehttp = false;

  // turn on `emulatejson` to support legacy servers that can't deal with direct
  // `application/json` requests ... this will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  backbone.emulatejson = false;

  // backbone.events
  // ---------------

  // a module that can be mixed in to *any object* in order to provide it with
  // a custom event channel. you may bind a callback to an event with `on` or
  // remove with `off`; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, backbone.events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var events = backbone.events = {};

  // regular expression used to split event strings.
  var eventsplitter = /\s+/;

  // a private global variable to share between listeners and listenees.
  var _listening;

  // iterates over the standard `event, callback` (as well as the fancy multiple
  // space-separated events `"change blur", callback` and jquery-style event
  // maps `{event: callback}`).
  var eventsapi = function(iteratee, events, name, callback, opts) {
    var i = 0, names;
    if (name && typeof name === 'object') {
      // handle event maps.
      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
      for (names = _.keys(name); i < names.length ; i++) {
        events = eventsapi(iteratee, events, names[i], name[names[i]], opts);
      }
    } else if (name && eventsplitter.test(name)) {
      // handle space-separated event names by delegating them individually.
      for (names = name.split(eventsplitter); i < names.length; i++) {
        events = iteratee(events, names[i], callback, opts);
      }
    } else {
      // finally, standard events.
      events = iteratee(events, name, callback, opts);
    }
    return events;
  };

  // bind an event to a `callback` function. passing `"all"` will bind
  // the callback to all events fired.
  events.on = function(name, callback, context) {
    this._events = eventsapi(onapi, this._events || {}, name, callback, {
      context: context,
      ctx: this,
      listening: _listening
    });

    if (_listening) {
      var listeners = this._listeners || (this._listeners = {});
      listeners[_listening.id] = _listening;
      // allow the listening to use a counter, instead of tracking
      // callbacks for library interop
      _listening.interop = false;
    }

    return this;
  };

  // inversion-of-control versions of `on`. tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to
  // for easier unbinding later.
  events.listento = function(obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenid || (obj._listenid = _.uniqueid('l'));
    var listeningto = this._listeningto || (this._listeningto = {});
    var listening = _listening = listeningto[id];

    // this object is not listening to any other events on `obj` yet.
    // setup the necessary references to track the listening callbacks.
    if (!listening) {
      this._listenid || (this._listenid = _.uniqueid('l'));
      listening = _listening = listeningto[id] = new listening(this, obj);
    }

    // bind callbacks on obj.
    var error = trycatchon(obj, name, callback, this);
    _listening = void 0;

    if (error) throw error;
    // if the target obj is not backbone.events, track events manually.
    if (listening.interop) listening.on(name, callback);

    return this;
  };

  // the reducing api that adds a callback to the `events` object.
  var onapi = function(events, name, callback, options) {
    if (callback) {
      var handlers = events[name] || (events[name] = []);
      var context = options.context, ctx = options.ctx, listening = options.listening;
      if (listening) listening.count++;

      handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
    }
    return events;
  };

  // an try-catch guarded #on function, to prevent poisoning the global
  // `_listening` variable.
  var trycatchon = function(obj, name, callback, context) {
    try {
      obj.on(name, callback, context);
    } catch (e) {
      return e;
    }
  };

  // remove one or many callbacks. if `context` is null, removes all
  // callbacks with that function. if `callback` is null, removes all
  // callbacks for the event. if `name` is null, removes all bound
  // callbacks for all events.
  events.off = function(name, callback, context) {
    if (!this._events) return this;
    this._events = eventsapi(offapi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
    });

    return this;
  };

  // tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  events.stoplistening = function(obj, name, callback) {
    var listeningto = this._listeningto;
    if (!listeningto) return this;

    var ids = obj ? [obj._listenid] : _.keys(listeningto);
    for (var i = 0; i < ids.length; i++) {
      var listening = listeningto[ids[i]];

      // if listening doesn't exist, this object is not currently
      // listening to obj. break out early.
      if (!listening) break;

      listening.obj.off(name, callback, this);
      if (listening.interop) listening.off(name, callback);
    }
    if (_.isempty(listeningto)) this._listeningto = void 0;

    return this;
  };

  // the reducing api that removes a callback from the `events` object.
  var offapi = function(events, name, callback, options) {
    if (!events) return;

    var context = options.context, listeners = options.listeners;
    var i = 0, names;

    // delete all event listeners and "drop" events.
    if (!name && !context && !callback) {
      for (names = _.keys(listeners); i < names.length; i++) {
        listeners[names[i]].cleanup();
      }
      return;
    }

    names = name ? [name] : _.keys(events);
    for (; i < names.length; i++) {
      name = names[i];
      var handlers = events[name];

      // bail out if there are no events stored.
      if (!handlers) break;

      // find any remaining events.
      var remaining = [];
      for (var j = 0; j < handlers.length; j++) {
        var handler = handlers[j];
        if (
          callback && callback !== handler.callback &&
            callback !== handler.callback._callback ||
              context && context !== handler.context
        ) {
          remaining.push(handler);
        } else {
          var listening = handler.listening;
          if (listening) listening.off(name, callback);
        }
      }

      // replace events if there are any remaining.  otherwise, clean up.
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }

    return events;
  };

  // bind an event to only be triggered a single time. after the first time
  // the callback is invoked, its listener will be removed. if multiple events
  // are passed in using the space-separated syntax, the handler will fire
  // once for each event, not once for a combination of all events.
  events.once = function(name, callback, context) {
    // map the event into a `{event: once}` object.
    var events = eventsapi(oncemap, {}, name, callback, this.off.bind(this));
    if (typeof name === 'string' && context == null) callback = void 0;
    return this.on(events, callback, context);
  };

  // inversion-of-control versions of `once`.
  events.listentoonce = function(obj, name, callback) {
    // map the event into a `{event: once}` object.
    var events = eventsapi(oncemap, {}, name, callback, this.stoplistening.bind(this, obj));
    return this.listento(obj, events);
  };

  // reduces the event callbacks into a map of `{event: oncewrapper}`.
  // `offer` unbinds the `oncewrapper` after it has been called.
  var oncemap = function(map, name, callback, offer) {
    if (callback) {
      var once = map[name] = _.once(function() {
        offer(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
    }
    return map;
  };

  // trigger one or many events, firing all bound callbacks. callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  events.trigger = function(name) {
    if (!this._events) return this;

    var length = math.max(0, arguments.length - 1);
    var args = array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

    eventsapi(triggerapi, this._events, name, void 0, args);
    return this;
  };

  // handles triggering the appropriate event callbacks.
  var triggerapi = function(objevents, name, callback, args) {
    if (objevents) {
      var events = objevents[name];
      var allevents = objevents.all;
      if (events && allevents) allevents = allevents.slice();
      if (events) triggerevents(events, args);
      if (allevents) triggerevents(allevents, [name].concat(args));
    }
    return objevents;
  };

  // a difficult-to-believe, but optimized internal dispatch function for
  // triggering events. tries to keep the usual cases speedy (most internal
  // backbone events have 3 arguments).
  var triggerevents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  // a listening class that tracks and cleans up memory bindings
  // when all callbacks have been offed.
  var listening = function(listener, obj) {
    this.id = listener._listenid;
    this.listener = listener;
    this.obj = obj;
    this.interop = true;
    this.count = 0;
    this._events = void 0;
  };

  listening.prototype.on = events.on;

  // offs a callback (or several).
  // uses an optimized counter if the listenee uses backbone.events.
  // otherwise, falls back to manual tracking to support events
  // library interop.
  listening.prototype.off = function(name, callback) {
    var cleanup;
    if (this.interop) {
      this._events = eventsapi(offapi, this._events, name, callback, {
        context: void 0,
        listeners: void 0
      });
      cleanup = !this._events;
    } else {
      this.count--;
      cleanup = this.count === 0;
    }
    if (cleanup) this.cleanup();
  };

  // cleans up memory bindings between the listener and the listenee.
  listening.prototype.cleanup = function() {
    delete this.listener._listeningto[this.obj._listenid];
    if (!this.interop) delete this.obj._listeners[this.id];
  };

  // aliases for backwards compatibility.
  events.bind   = events.on;
  events.unbind = events.off;

  // allow the `backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(backbone, events);

  // backbone.model
  // --------------

  // backbone **models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // a discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // create a new model with the specified attributes. a client id (`cid`)
  // is automatically generated and assigned for you.
  var model = backbone.model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    this.cid = _.uniqueid(this.cidprefix);
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    var defaults = _.result(this, 'defaults');

    // just _.defaults would work fine, but the additional _.extends
    // is in there for historical reasons. see #3843.
    attrs = _.defaults(_.extend({}, defaults, attrs), defaults);

    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // attach all inheritable methods to the model prototype.
  _.extend(model.prototype, events, {

    // a hash of attributes whose current and previous value differ.
    changed: null,

    // the value returned during the last failed validation.
    validationerror: null,

    // the default name for the json `id` attribute is `"id"`. mongodb and
    // couchdb users may want to set this to `"_id"`.
    idattribute: 'id',

    // the prefix is used to create the client id which is used to identify models locally.
    // you may want to override this if you're experiencing name clashes with model ids.
    cidprefix: 'c',

    // preinitialize is an empty function by default. you can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the model.
    preinitialize: function(){},

    // initialize is an empty function by default. override it with your own
    // initialization logic.
    initialize: function(){},

    // return a copy of the model's `attributes` object.
    tojson: function(options) {
      return _.clone(this.attributes);
    },

    // proxy `backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return backbone.sync.apply(this, arguments);
    },

    // get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // get the html-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // special-cased proxy to underscore's `_.matches` method.
    matches: function(attrs) {
      return !!_.iteratee(attrs, this)(this.attributes);
    },

    // set a hash of model attributes on the object, firing `"change"`. this is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. the heart of the beast.
    set: function(key, val, options) {
      if (key == null) return this;

      // handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // run validation.
      if (!this._validate(attrs, options)) return false;

      // extract attributes and options.
      var unset      = options.unset;
      var silent     = options.silent;
      var changes    = [];
      var changing   = this._changing;
      this._changing = true;

      if (!changing) {
        this._previousattributes = _.clone(this.attributes);
        this.changed = {};
      }

      var current = this.attributes;
      var changed = this.changed;
      var prev    = this._previousattributes;

      // for each `set` attribute, update or delete the current value.
      for (var attr in attrs) {
        val = attrs[attr];
        if (!_.isequal(current[attr], val)) changes.push(attr);
        if (!_.isequal(prev[attr], val)) {
          changed[attr] = val;
        } else {
          delete changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // update the `id`.
      if (this.idattribute in attrs) {
        var previd = this.id;
        this.id = this.get(this.idattribute);
        this.trigger('changeid', this, previd, options);
      }

      // trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0; i < changes.length; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // you might be wondering why there's a `while` loop here. changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // determine if the model has changed since the last `"change"` event.
    // if you specify an attribute name, determine if that attribute has changed.
    haschanged: function(attr) {
      if (attr == null) return !_.isempty(this.changed);
      return _.has(this.changed, attr);
    },

    // return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. unset attributes will be set to undefined.
    // you can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedattributes: function(diff) {
      if (!diff) return this.haschanged() ? _.clone(this.changed) : false;
      var old = this._changing ? this._previousattributes : this.attributes;
      var changed = {};
      var haschanged;
      for (var attr in diff) {
        var val = diff[attr];
        if (_.isequal(old[attr], val)) continue;
        changed[attr] = val;
        haschanged = true;
      }
      return haschanged ? changed : false;
    },

    // get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousattributes) return null;
      return this._previousattributes[attr];
    },

    // get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousattributes: function() {
      return _.clone(this._previousattributes);
    },

    // fetch the model from the server, merging the response with the model's
    // local attributes. any changed attributes will trigger a "change" event.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        var serverattrs = options.parse ? model.parse(resp, options) : resp;
        if (!model.set(serverattrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wraperror(this, options);
      return this.sync('read', this, options);
    },

    // set a hash of model attributes, and sync the model to the server.
    // if the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      // handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true, parse: true}, options);
      var wait = options.wait;

      // if we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !wait) {
        if (!this.set(attrs, options)) return false;
      } else if (!this._validate(attrs, options)) {
        return false;
      }

      // after a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      var attributes = this.attributes;
      options.success = function(resp) {
        // ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverattrs = options.parse ? model.parse(resp, options) : resp;
        if (wait) serverattrs = _.extend({}, attrs, serverattrs);
        if (serverattrs && !model.set(serverattrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wraperror(this, options);

      // set temporary attributes if `{wait: true}` to properly find new ids.
      if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);

      var method = this.isnew() ? 'create' : options.patch ? 'patch' : 'update';
      if (method === 'patch' && !options.attrs) options.attrs = attrs;
      var xhr = this.sync(method, this, options);

      // restore attributes.
      this.attributes = attributes;

      return xhr;
    },

    // destroy this model on the server if it was already persisted.
    // optimistically removes the model from its collection, if it has one.
    // if `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      var wait = options.wait;

      var destroy = function() {
        model.stoplistening();
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (wait) destroy();
        if (success) success.call(options.context, model, resp, options);
        if (!model.isnew()) model.trigger('sync', model, resp, options);
      };

      var xhr = false;
      if (this.isnew()) {
        _.defer(options.success);
      } else {
        wraperror(this, options);
        xhr = this.sync('delete', this, options);
      }
      if (!wait) destroy();
      return xhr;
    },

    // default url for the model's representation on the server -- if you're
    // using backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlroot') ||
        _.result(this.collection, 'url') ||
        urlerror();
      if (this.isnew()) return base;
      var id = this.get(this.idattribute);
      return base.replace(/[^\/]$/, '$&/') + encodeuricomponent(id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. the default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // a model is new if it has never been saved to the server, and lacks an id.
    isnew: function() {
      return !this.has(this.idattribute);
    },

    // check if the model is currently in a valid state.
    isvalid: function(options) {
      return this._validate({}, _.extend({}, options, {validate: true}));
    },

    // run validation against the next complete set of model attributes,
    // returning `true` if all is well. otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationerror = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationerror: error}));
      return false;
    }

  });

  // backbone.collection
  // -------------------

  // if models tend to represent a single row of data, a backbone collection is
  // more analogous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // create a new **collection**, perhaps to contain a specific type of `model`.
  // if a `comparator` is specified, the collection will maintain
  // its models in sort order, as they're added and removed.
  var collection = backbone.collection = function(models, options) {
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // default options for `collection#set`.
  var setoptions = {add: true, remove: true, merge: true};
  var addoptions = {add: true, remove: false};

  // splices `insert` into `array` at index `at`.
  var splice = function(array, insert, at) {
    at = math.min(math.max(at, 0), array.length);
    var tail = array(array.length - at);
    var length = insert.length;
    var i;
    for (i = 0; i < tail.length; i++) tail[i] = array[i + at];
    for (i = 0; i < length; i++) array[i + at] = insert[i];
    for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
  };

  // define the collection's inheritable methods.
  _.extend(collection.prototype, events, {

    // the default model for a collection is just a **backbone.model**.
    // this should be overridden in most cases.
    model: model,


    // preinitialize is an empty function by default. you can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the collection.
    preinitialize: function(){},

    // initialize is an empty function by default. override it with your own
    // initialization logic.
    initialize: function(){},

    // the json representation of a collection is an array of the
    // models' attributes.
    tojson: function(options) {
      return this.map(function(model) { return model.tojson(options); });
    },

    // proxy `backbone.sync` by default.
    sync: function() {
      return backbone.sync.apply(this, arguments);
    },

    // add a model, or list of models to the set. `models` may be backbone
    // models or raw javascript objects to be converted to models, or any
    // combination of the two.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addoptions));
    },

    // remove a model, or a list of models from the set.
    remove: function(models, options) {
      options = _.extend({}, options);
      var singular = !_.isarray(models);
      models = singular ? [models] : models.slice();
      var removed = this._removemodels(models, options);
      if (!options.silent && removed.length) {
        options.changes = {added: [], merged: [], removed: removed};
        this.trigger('update', this, options);
      }
      return singular ? removed[0] : removed;
    },

    // update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. similar to **model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      if (models == null) return;

      options = _.extend({}, setoptions, options);
      if (options.parse && !this._ismodel(models)) {
        models = this.parse(models, options) || [];
      }

      var singular = !_.isarray(models);
      models = singular ? [models] : models.slice();

      var at = options.at;
      if (at != null) at = +at;
      if (at > this.length) at = this.length;
      if (at < 0) at += this.length + 1;

      var set = [];
      var toadd = [];
      var tomerge = [];
      var toremove = [];
      var modelmap = {};

      var add = options.add;
      var merge = options.merge;
      var remove = options.remove;

      var sort = false;
      var sortable = this.comparator && at == null && options.sort !== false;
      var sortattr = _.isstring(this.comparator) ? this.comparator : null;

      // turn bare objects into model references, and prevent invalid models
      // from being added.
      var model, i;
      for (i = 0; i < models.length; i++) {
        model = models[i];

        // if a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        var existing = this.get(model);
        if (existing) {
          if (merge && model !== existing) {
            var attrs = this._ismodel(model) ? model.attributes : model;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            tomerge.push(existing);
            if (sortable && !sort) sort = existing.haschanged(sortattr);
          }
          if (!modelmap[existing.cid]) {
            modelmap[existing.cid] = true;
            set.push(existing);
          }
          models[i] = existing;

        // if this is a new, valid model, push it to the `toadd` list.
        } else if (add) {
          model = models[i] = this._preparemodel(model, options);
          if (model) {
            toadd.push(model);
            this._addreference(model, options);
            modelmap[model.cid] = true;
            set.push(model);
          }
        }
      }

      // remove stale models.
      if (remove) {
        for (i = 0; i < this.length; i++) {
          model = this.models[i];
          if (!modelmap[model.cid]) toremove.push(model);
        }
        if (toremove.length) this._removemodels(toremove, options);
      }

      // see if sorting is needed, update `length` and splice in new models.
      var orderchanged = false;
      var replace = !sortable && add && remove;
      if (set.length && replace) {
        orderchanged = this.length !== set.length || _.some(this.models, function(m, index) {
          return m !== set[index];
        });
        this.models.length = 0;
        splice(this.models, set, 0);
        this.length = this.models.length;
      } else if (toadd.length) {
        if (sortable) sort = true;
        splice(this.models, toadd, at == null ? this.length : at);
        this.length = this.models.length;
      }

      // silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // unless silenced, it's time to fire all appropriate add/sort/update events.
      if (!options.silent) {
        for (i = 0; i < toadd.length; i++) {
          if (at != null) options.index = at + i;
          model = toadd[i];
          model.trigger('add', model, this, options);
        }
        if (sort || orderchanged) this.trigger('sort', this, options);
        if (toadd.length || toremove.length || tomerge.length) {
          options.changes = {
            added: toadd,
            removed: toremove,
            merged: tomerge
          };
          this.trigger('update', this, options);
        }
      }

      // return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // when you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. fires `reset` when finished.
    // useful for bulk operations and optimizations.
    reset: function(models, options) {
      options = options ? _.clone(options) : {};
      for (var i = 0; i < this.models.length; i++) {
        this._removereference(this.models[i], options);
      }
      options.previousmodels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      return this.remove(model, options);
    },

    // add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      return this.remove(model, options);
    },

    // slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // get a model from the set by id, cid, model object with id or cid
    // properties, or an attributes object that is transformed through modelid.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byid[obj] ||
        this._byid[this.modelid(this._ismodel(obj) ? obj.attributes : obj, obj.idattribute)] ||
        obj.cid && this._byid[obj.cid];
    },

    // returns `true` if the model is in the collection.
    has: function(obj) {
      return this.get(obj) != null;
    },

    // get the model at the given index.
    at: function(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    },

    // return models with matching attributes. useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      return this[first ? 'find' : 'filter'](attrs);
    },

    // return the first model with matching attributes. useful for simple cases
    // of `find`.
    findwhere: function(attrs) {
      return this.where(attrs, true);
    },

    // force the collection to re-sort itself. you don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      var comparator = this.comparator;
      if (!comparator) throw new error('cannot sort a set without a comparator');
      options || (options = {});

      var length = comparator.length;
      if (_.isfunction(comparator)) comparator = comparator.bind(this);

      // run sort based on type of `comparator`.
      if (length === 1 || _.isstring(comparator)) {
        this.models = this.sortby(comparator);
      } else {
        this.models.sort(comparator);
      }
      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return this.map(attr + '');
    },

    // fetch the default set of models for this collection, resetting the
    // collection when they arrive. if `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success.call(options.context, collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wraperror(this, options);
      return this.sync('read', this, options);
    },

    // create a new instance of a model in this collection. add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      var wait = options.wait;
      model = this._preparemodel(model, options);
      if (!model) return false;
      if (!wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(m, resp, callbackopts) {
        if (wait) {
          m.off('error', collection._forwardpristineerror, collection);
          collection.add(m, callbackopts);
        }
        if (success) success.call(callbackopts.context, m, resp, callbackopts);
      };
      // in case of wait:true, our collection is not listening to any
      // of the model's events yet, so it will not forward the error
      // event. in this special case, we need to listen for it
      // separately and handle the event just once.
      // (the reason we don't need to do this for the sync event is
      // in the success handler above: we add the model first, which
      // causes the collection to listen, and then invoke the callback
      // that triggers the event.)
      if (wait) {
        model.once('error', this._forwardpristineerror, this);
      }
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. the default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models, {
        model: this.model,
        comparator: this.comparator
      });
    },

    // define how to uniquely identify models in the collection.
    modelid: function(attrs, idattribute) {
      return attrs[idattribute || this.model.prototype.idattribute || 'id'];
    },

    // get an iterator of all models in this collection.
    values: function() {
      return new collectioniterator(this, iterator_values);
    },

    // get an iterator of all model ids in this collection.
    keys: function() {
      return new collectioniterator(this, iterator_keys);
    },

    // get an iterator of all [id, model] tuples in this collection.
    entries: function() {
      return new collectioniterator(this, iterator_keysvalues);
    },

    // private method to reset all internal state. called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byid  = {};
    },

    // prepare a hash of attributes (or other model) to be added to this
    // collection.
    _preparemodel: function(attrs, options) {
      if (this._ismodel(attrs)) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;

      var model;
      if (this.model.prototype) {
        model = new this.model(attrs, options);
      } else {
        // es class methods didn't have prototype
        model = this.model(attrs, options);
      }

      if (!model.validationerror) return model;
      this.trigger('invalid', this, model.validationerror, options);
      return false;
    },

    // internal method called by both remove and set.
    _removemodels: function(models, options) {
      var removed = [];
      for (var i = 0; i < models.length; i++) {
        var model = this.get(models[i]);
        if (!model) continue;

        var index = this.indexof(model);
        this.models.splice(index, 1);
        this.length--;

        // remove references before triggering 'remove' event to prevent an
        // infinite loop. #3693
        delete this._byid[model.cid];
        var id = this.modelid(model.attributes, model.idattribute);
        if (id != null) delete this._byid[id];

        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }

        removed.push(model);
        this._removereference(model, options);
      }
      if (models.length > 0 && !options.silent) delete options.index;
      return removed;
    },

    // method for checking whether an object should be considered a model for
    // the purposes of adding to the collection.
    _ismodel: function(model) {
      return model instanceof model;
    },

    // internal method to create a model's ties to a collection.
    _addreference: function(model, options) {
      this._byid[model.cid] = model;
      var id = this.modelid(model.attributes, model.idattribute);
      if (id != null) this._byid[id] = model;
      model.on('all', this._onmodelevent, this);
    },

    // internal method to sever a model's ties to a collection.
    _removereference: function(model, options) {
      delete this._byid[model.cid];
      var id = this.modelid(model.attributes, model.idattribute);
      if (id != null) delete this._byid[id];
      if (this === model.collection) delete model.collection;
      model.off('all', this._onmodelevent, this);
    },

    // internal method called every time a model in the set fires an event.
    // sets need to update their indexes when models change ids. all other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onmodelevent: function(event, model, collection, options) {
      if (model) {
        if ((event === 'add' || event === 'remove') && collection !== this) return;
        if (event === 'destroy') this.remove(model, options);
        if (event === 'changeid') {
          var previd = this.modelid(model.previousattributes(), model.idattribute);
          var id = this.modelid(model.attributes, model.idattribute);
          if (previd != null) delete this._byid[previd];
          if (id != null) this._byid[id] = model;
        }
      }
      this.trigger.apply(this, arguments);
    },

    // internal callback method used in `create`. it serves as a
    // stand-in for the `_onmodelevent` method, which is not yet bound
    // during the `wait` period of the `create` call. we still want to
    // forward any `'error'` event at the end of the `wait` period,
    // hence a customized callback.
    _forwardpristineerror: function(model, collection, options) {
      // prevent double forward if the model was already in the
      // collection before the call to `create`.
      if (this.has(model)) return;
      this._onmodelevent('error', model, collection, options);
    }
  });

  // defining an @@iterator method implements javascript's iterable protocol.
  // in modern es2015 browsers, this value is found at symbol.iterator.
  /* global symbol */
  var $$iterator = typeof symbol === 'function' && symbol.iterator;
  if ($$iterator) {
    collection.prototype[$$iterator] = collection.prototype.values;
  }

  // collectioniterator
  // ------------------

  // a collectioniterator implements javascript's iterator protocol, allowing the
  // use of `for of` loops in modern browsers and interoperation between
  // backbone.collection and other javascript functions and third-party libraries
  // which can operate on iterables.
  var collectioniterator = function(collection, kind) {
    this._collection = collection;
    this._kind = kind;
    this._index = 0;
  };

  // this "enum" defines the three possible kinds of values which can be emitted
  // by a collectioniterator that correspond to the values(), keys() and entries()
  // methods on collection, respectively.
  var iterator_values = 1;
  var iterator_keys = 2;
  var iterator_keysvalues = 3;

  // all iterators should themselves be iterable.
  if ($$iterator) {
    collectioniterator.prototype[$$iterator] = function() {
      return this;
    };
  }

  collectioniterator.prototype.next = function() {
    if (this._collection) {

      // only continue iterating if the iterated collection is long enough.
      if (this._index < this._collection.length) {
        var model = this._collection.at(this._index);
        this._index++;

        // construct a value depending on what kind of values should be iterated.
        var value;
        if (this._kind === iterator_values) {
          value = model;
        } else {
          var id = this._collection.modelid(model.attributes, model.idattribute);
          if (this._kind === iterator_keys) {
            value = id;
          } else { // iterator_keysvalues
            value = [id, model];
          }
        }
        return {value: value, done: false};
      }

      // once exhausted, remove the reference to the collection so future
      // calls to the next method always return done.
      this._collection = void 0;
    }

    return {value: void 0, done: true};
  };

  // backbone.view
  // -------------

  // backbone views are almost more convention than they are actual code. a view
  // is simply a javascript object that represents a logical chunk of ui in the
  // dom. this might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. defining a chunk of
  // ui as a **view** allows you to define your dom events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // creating a backbone.view creates its initial element outside of the dom,
  // if an existing element is not provided...
  var view = backbone.view = function(options) {
    this.cid = _.uniqueid('view');
    this.preinitialize.apply(this, arguments);
    _.extend(this, _.pick(options, viewoptions));
    this._ensureelement();
    this.initialize.apply(this, arguments);
  };

  // cached regex to split keys for `delegate`.
  var delegateeventsplitter = /^(\s+)\s*(.*)$/;

  // list of view options to be set as properties.
  var viewoptions = ['model', 'collection', 'el', 'id', 'attributes', 'classname', 'tagname', 'events'];

  // set up all inheritable **backbone.view** properties and methods.
  _.extend(view.prototype, events, {

    // the default `tagname` of a view's element is `"div"`.
    tagname: 'div',

    // jquery delegate for element lookup, scoped to dom elements within the
    // current view. this should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // preinitialize is an empty function by default. you can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the view
    preinitialize: function(){},

    // initialize is an empty function by default. override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate html. the
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // remove this view by taking the element out of the dom, and removing any
    // applicable backbone.events listeners.
    remove: function() {
      this._removeelement();
      this.stoplistening();
      return this;
    },

    // remove this view's element from the document and all event listeners
    // attached to it. exposed for subclasses using an alternative dom
    // manipulation api.
    _removeelement: function() {
      this.$el.remove();
    },

    // change the view's element (`this.el` property) and re-delegate the
    // view's events on the new element.
    setelement: function(element) {
      this.undelegateevents();
      this._setelement(element);
      this.delegateevents();
      return this;
    },

    // creates the `this.el` and `this.$el` references for this view using the
    // given `el`. `el` can be a css selector or an html string, a jquery
    // context or an element. subclasses can override this to utilize an
    // alternative dom manipulation api and are only required to set the
    // `this.el` property.
    _setelement: function(el) {
      this.$el = el instanceof backbone.$ ? el : backbone.$(el);
      this.el = this.$el[0];
    },

    // set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. callbacks will be bound to the view, with `this` set properly.
    // uses event delegation for efficiency.
    // omitting the selector binds the event to `this.el`.
    delegateevents: function(events) {
      events || (events = _.result(this, 'events'));
      if (!events) return this;
      this.undelegateevents();
      for (var key in events) {
        var method = events[key];
        if (!_.isfunction(method)) method = this[method];
        if (!method) continue;
        var match = key.match(delegateeventsplitter);
        this.delegate(match[1], match[2], method.bind(this));
      }
      return this;
    },

    // add a single event listener to the view's element (or a child element
    // using `selector`). this only works for delegate-able events: not `focus`,
    // `blur`, and not `change`, `submit`, and `reset` in internet explorer.
    delegate: function(eventname, selector, listener) {
      this.$el.on(eventname + '.delegateevents' + this.cid, selector, listener);
      return this;
    },

    // clears all callbacks previously bound to the view by `delegateevents`.
    // you usually don't need to use this, but may wish to if you have multiple
    // backbone views attached to the same dom element.
    undelegateevents: function() {
      if (this.$el) this.$el.off('.delegateevents' + this.cid);
      return this;
    },

    // a finer-grained `undelegateevents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventname, selector, listener) {
      this.$el.off(eventname + '.delegateevents' + this.cid, selector, listener);
      return this;
    },

    // produces a dom element to be assigned to your view. exposed for
    // subclasses using an alternative dom manipulation api.
    _createelement: function(tagname) {
      return document.createelement(tagname);
    },

    // ensure that the view has a dom element to render into.
    // if `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. otherwise, create
    // an element from the `id`, `classname` and `tagname` properties.
    _ensureelement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.classname) attrs['class'] = _.result(this, 'classname');
        this.setelement(this._createelement(_.result(this, 'tagname')));
        this._setattributes(attrs);
      } else {
        this.setelement(_.result(this, 'el'));
      }
    },

    // set attributes from a hash on this view's element.  exposed for
    // subclasses using an alternative dom manipulation api.
    _setattributes: function(attributes) {
      this.$el.attr(attributes);
    }

  });

  // proxy backbone class methods to underscore functions, wrapping the model's
  // `attributes` object or collection's `models` array behind the scenes.
  //
  // collection.filter(function(model) { return model.get('age') > 10 });
  // collection.each(this.addview);
  //
  // `function#apply` can be slow so we use the method's arg count, if we know it.
  var addmethod = function(base, length, method, attribute) {
    switch (length) {
      case 1: return function() {
        return base[method](this[attribute]);
      };
      case 2: return function(value) {
        return base[method](this[attribute], value);
      };
      case 3: return function(iteratee, context) {
        return base[method](this[attribute], cb(iteratee, this), context);
      };
      case 4: return function(iteratee, defaultval, context) {
        return base[method](this[attribute], cb(iteratee, this), defaultval, context);
      };
      default: return function() {
        var args = slice.call(arguments);
        args.unshift(this[attribute]);
        return base[method].apply(base, args);
      };
    }
  };

  var addunderscoremethods = function(class, base, methods, attribute) {
    _.each(methods, function(length, method) {
      if (base[method]) class.prototype[method] = addmethod(base, length, method, attribute);
    });
  };

  // support `collection.sortby('attr')` and `collection.findwhere({id: 1})`.
  var cb = function(iteratee, instance) {
    if (_.isfunction(iteratee)) return iteratee;
    if (_.isobject(iteratee) && !instance._ismodel(iteratee)) return modelmatcher(iteratee);
    if (_.isstring(iteratee)) return function(model) { return model.get(iteratee); };
    return iteratee;
  };
  var modelmatcher = function(attrs) {
    var matcher = _.matches(attrs);
    return function(model) {
      return matcher(model.attributes);
    };
  };

  // underscore methods that we want to implement on the collection.
  // 90% of the core usefulness of backbone collections is actually implemented
  // right here:
  var collectionmethods = {foreach: 3, each: 3, map: 3, collect: 3, reduce: 0,
    foldl: 0, inject: 0, reduceright: 0, foldr: 0, find: 3, detect: 3, filter: 3,
    select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
    contains: 3, invoke: 0, max: 3, min: 3, toarray: 1, size: 1, first: 3,
    head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
    without: 0, difference: 0, indexof: 3, shuffle: 1, lastindexof: 3,
    isempty: 1, chain: 1, sample: 3, partition: 3, groupby: 3, countby: 3,
    sortby: 3, indexby: 3, findindex: 3, findlastindex: 3};


  // underscore methods that we want to implement on the model, mapped to the
  // number of arguments they take.
  var modelmethods = {keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
    omit: 0, chain: 1, isempty: 1};

  // mix in each underscore method as a proxy to `collection#models`.

  _.each([
    [collection, collectionmethods, 'models'],
    [model, modelmethods, 'attributes']
  ], function(config) {
    var base = config[0],
        methods = config[1],
        attribute = config[2];

    base.mixin = function(obj) {
      var mappings = _.reduce(_.functions(obj), function(memo, name) {
        memo[name] = 0;
        return memo;
      }, {});
      addunderscoremethods(base, obj, mappings, attribute);
    };

    addunderscoremethods(base, _, methods, attribute);
  });

  // backbone.sync
  // -------------

  // override this function to change the manner in which backbone persists
  // models to the server. you will be passed the type of request, and the
  // model in question. by default, makes a restful ajax request
  // to the model's `url()`. some possible customizations could be:
  //
  // * use `settimeout` to batch rapid-fire updates into a single request.
  // * send up the models as xml instead of json.
  // * persist models via websockets instead of ajax.
  //
  // turn on `backbone.emulatehttp` in order to send `put` and `delete` requests
  // as `post`, with a `_method` parameter containing the true http method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // useful when interfacing with server-side languages like **php** that make
  // it difficult to read the body of `put` requests.
  backbone.sync = function(method, model, options) {
    var type = methodmap[method];

    // default options, unless specified.
    _.defaults(options || (options = {}), {
      emulatehttp: backbone.emulatehttp,
      emulatejson: backbone.emulatejson
    });

    // default json-request options.
    var params = {type: type, datatype: 'json'};

    // ensure that we have a url.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlerror();
    }

    // ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contenttype = 'application/json';
      params.data = json.stringify(options.attrs || model.tojson(options));
    }

    // for older servers, emulate json by encoding the request into an html-form.
    if (options.emulatejson) {
      params.contenttype = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // for older servers, emulate http by mimicking the http method with `_method`
    // and an `x-http-method-override` header.
    if (options.emulatehttp && (type === 'put' || type === 'delete' || type === 'patch')) {
      params.type = 'post';
      if (options.emulatejson) params.data._method = type;
      var beforesend = options.beforesend;
      options.beforesend = function(xhr) {
        xhr.setrequestheader('x-http-method-override', type);
        if (beforesend) return beforesend.apply(this, arguments);
      };
    }

    // don't process data on a non-get request.
    if (params.type !== 'get' && !options.emulatejson) {
      params.processdata = false;
    }

    // pass along `textstatus` and `errorthrown` from jquery.
    var error = options.error;
    options.error = function(xhr, textstatus, errorthrown) {
      options.textstatus = textstatus;
      options.errorthrown = errorthrown;
      if (error) error.call(options.context, xhr, textstatus, errorthrown);
    };

    // make the request, allowing the user to override any ajax options.
    var xhr = options.xhr = backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // map from crud to http for our default `backbone.sync` implementation.
  var methodmap = {
    'create': 'post',
    'update': 'put',
    'patch': 'patch',
    'delete': 'delete',
    'read': 'get'
  };

  // set the default implementation of `backbone.ajax` to proxy through to `$`.
  // override this if you'd like to use a different library.
  backbone.ajax = function() {
    return backbone.$.ajax.apply(backbone.$, arguments);
  };

  // backbone.router
  // ---------------

  // routers map faux-urls to actions, and fire events when routes are
  // matched. creating a new one sets its `routes` hash, if not set statically.
  var router = backbone.router = function(options) {
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    if (options.routes) this.routes = options.routes;
    this._bindroutes();
    this.initialize.apply(this, arguments);
  };

  // cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalparam = /\((.*?)\)/g;
  var namedparam    = /(\(\?)?:\w+/g;
  var splatparam    = /\*\w+/g;
  var escaperegexp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // set up all inheritable **backbone.router** properties and methods.
  _.extend(router.prototype, events, {

    // preinitialize is an empty function by default. you can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the router.
    preinitialize: function(){},

    // initialize is an empty function by default. override it with your own
    // initialization logic.
    initialize: function(){},

    // manually bind a single named route to a callback. for example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isregexp(route)) route = this._routetoregexp(route);
      if (_.isfunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      backbone.history.route(route, function(fragment) {
        var args = router._extractparameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // execute a route handler with the provided parameters.  this is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
    },

    // simple proxy to `backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      backbone.history.navigate(fragment, options);
      return this;
    },

    // bind all defined routes to `backbone.history`. we have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindroutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routetoregexp: function(route) {
      route = route.replace(escaperegexp, '\\$&')
      .replace(optionalparam, '(?:$1)?')
      .replace(namedparam, function(match, optional) {
        return optional ? match : '([^/?]+)';
      })
      .replace(splatparam, '([^?]*?)');
      return new regexp('^' + route + '(?:\\?([\\s\\s]*))?$');
    },

    // given a route, and a url fragment that it matches, return the array of
    // extracted decoded parameters. empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractparameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeuricomponent(param) : null;
      });
    }

  });

  // backbone.history
  // ----------------

  // handles cross-browser history management, based on either
  // [pushstate](http://diveintohtml5.info/history.html) and real urls, or
  // [onhashchange](https://developer.mozilla.org/en-us/docs/dom/window.onhashchange)
  // and url fragments. if the browser supports neither (old ie, natch),
  // falls back to polling.
  var history = backbone.history = function() {
    this.handlers = [];
    this.checkurl = this.checkurl.bind(this);

    // ensure that `history` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // cached regex for stripping a leading hash/slash and trailing space.
  var routestripper = /^[#\/]|\s+$/g;

  // cached regex for stripping leading and trailing slashes.
  var rootstripper = /^\/+|\/+$/g;

  // cached regex for stripping urls of hash.
  var pathstripper = /#.*$/;

  // has the history handling already been started?
  history.started = false;

  // set up all inheritable **backbone.history** properties and methods.
  _.extend(history.prototype, events, {

    // the default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // are we at the app root?
    atroot: function() {
      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
      return path === this.root && !this.getsearch();
    },

    // does the pathname match the root?
    matchroot: function() {
      var path = this.decodefragment(this.location.pathname);
      var rootpath = path.slice(0, this.root.length - 1) + '/';
      return rootpath === this.root;
    },

    // unicode characters in `location.pathname` are percent encoded so they're
    // decoded for comparison. `%25` should not be decoded since it may be part
    // of an encoded parameter.
    decodefragment: function(fragment) {
      return decodeuri(fragment.replace(/%25/g, '%2525'));
    },

    // in ie6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    getsearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    // gets the true hash value. cannot use location.hash directly due to bug
    // in firefox where location.hash will always be decoded.
    gethash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // get the pathname and search params, without the root.
    getpath: function() {
      var path = this.decodefragment(
        this.location.pathname + this.getsearch()
      ).slice(this.root.length - 1);
      return path.charat(0) === '/' ? path.slice(1) : path;
    },

    // get the cross-browser normalized url fragment from the path or hash.
    getfragment: function(fragment) {
      if (fragment == null) {
        if (this._usepushstate || !this._wantshashchange) {
          fragment = this.getpath();
        } else {
          fragment = this.gethash();
        }
      }
      return fragment.replace(routestripper, '');
    },

    // start the hash change handling, returning `true` if the current url matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (history.started) throw new error('backbone.history has already been started');
      history.started = true;

      // figure out the initial configuration. do we need an iframe?
      // is pushstate desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._trailingslash   = this.options.trailingslash;
      this._wantshashchange = this.options.hashchange !== false;
      this._hashashchange   = 'onhashchange' in window && (document.documentmode === void 0 || document.documentmode > 7);
      this._usehashchange   = this._wantshashchange && this._hashashchange;
      this._wantspushstate  = !!this.options.pushstate;
      this._haspushstate    = !!(this.history && this.history.pushstate);
      this._usepushstate    = this._wantspushstate && this._haspushstate;
      this.fragment         = this.getfragment();

      // normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootstripper, '/');

      // transition from hashchange to pushstate or vice versa if both are
      // requested.
      if (this._wantshashchange && this._wantspushstate) {

        // if we've started off with a route from a `pushstate`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._haspushstate && !this.atroot()) {
          var rootpath = this.root.slice(0, -1) || '/';
          this.location.replace(rootpath + '#' + this.getpath());
          // return immediately as browser will do redirect to new url
          return true;

        // or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushstate`-based instead...
        } else if (this._haspushstate && this.atroot()) {
          this.navigate(this.gethash(), {replace: true});
        }

      }

      // proxy an iframe to handle location events if the browser doesn't
      // support the `hashchange` event, html5 history, or the user wants
      // `hashchange` but not `pushstate`.
      if (!this._hashashchange && this._wantshashchange && !this._usepushstate) {
        this.iframe = document.createelement('iframe');
        this.iframe.src = 'javascript:0';
        this.iframe.style.display = 'none';
        this.iframe.tabindex = -1;
        var body = document.body;
        // using `appendchild` will throw on ie < 9 if the document is not ready.
        var iwindow = body.insertbefore(this.iframe, body.firstchild).contentwindow;
        iwindow.document.open();
        iwindow.document.close();
        iwindow.location.hash = '#' + this.fragment;
      }

      // add a cross-platform `addeventlistener` shim for older browsers.
      var addeventlistener = window.addeventlistener || function(eventname, listener) {
        return attachevent('on' + eventname, listener);
      };

      // depending on whether we're using pushstate or hashes, and whether
      // 'onhashchange' is supported, determine how we check the url state.
      if (this._usepushstate) {
        addeventlistener('popstate', this.checkurl, false);
      } else if (this._usehashchange && !this.iframe) {
        addeventlistener('hashchange', this.checkurl, false);
      } else if (this._wantshashchange) {
        this._checkurlinterval = setinterval(this.checkurl, this.interval);
      }

      if (!this.options.silent) return this.loadurl();
    },

    // disable backbone.history, perhaps temporarily. not useful in a real app,
    // but possibly useful for unit testing routers.
    stop: function() {
      // add a cross-platform `removeeventlistener` shim for older browsers.
      var removeeventlistener = window.removeeventlistener || function(eventname, listener) {
        return detachevent('on' + eventname, listener);
      };

      // remove window listeners.
      if (this._usepushstate) {
        removeeventlistener('popstate', this.checkurl, false);
      } else if (this._usehashchange && !this.iframe) {
        removeeventlistener('hashchange', this.checkurl, false);
      }

      // clean up the iframe if necessary.
      if (this.iframe) {
        document.body.removechild(this.iframe);
        this.iframe = null;
      }

      // some environments will throw when clearing an undefined interval.
      if (this._checkurlinterval) clearinterval(this._checkurlinterval);
      history.started = false;
    },

    // add a route to be tested when the fragment changes. routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // checks the current url to see if it has changed, and if it has,
    // calls `loadurl`, normalizing across the hidden iframe.
    checkurl: function(e) {
      var current = this.getfragment();

      // if the user pressed the back button, the iframe's hash will have
      // changed and we should use that for comparison.
      if (current === this.fragment && this.iframe) {
        current = this.gethash(this.iframe.contentwindow);
      }

      if (current === this.fragment) {
        if (!this.matchroot()) return this.notfound();
        return false;
      }
      if (this.iframe) this.navigate(current);
      this.loadurl();
    },

    // attempt to load the current url fragment. if a route succeeds with a
    // match, returns `true`. if no defined routes matches the fragment,
    // returns `false`.
    loadurl: function(fragment) {
      // if the root doesn't match, no routes can match either.
      if (!this.matchroot()) return this.notfound();
      fragment = this.fragment = this.getfragment(fragment);
      return _.some(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      }) || this.notfound();
    },

    // when no route could be matched, this method is called internally to
    // trigger the `'notfound'` event. it returns `false` so that it can be used
    // in tail position.
    notfound: function() {
      this.trigger('notfound');
      return false;
    },

    // save a fragment into the hash history, or replace the url state if the
    // 'replace' option is passed. you are responsible for properly url-encoding
    // the fragment in advance.
    //
    // the options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current url without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!history.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      // normalize the fragment.
      fragment = this.getfragment(fragment || '');

      // strip trailing slash on the root unless _trailingslash is true
      var rootpath = this.root;
      if (!this._trailingslash && (fragment === '' || fragment.charat(0) === '?')) {
        rootpath = rootpath.slice(0, -1) || '/';
      }
      var url = rootpath + fragment;

      // strip the fragment of the query and hash for matching.
      fragment = fragment.replace(pathstripper, '');

      // decode for matching.
      var decodedfragment = this.decodefragment(fragment);

      if (this.fragment === decodedfragment) return;
      this.fragment = decodedfragment;

      // if pushstate is available, we use it to set the fragment as a real url.
      if (this._usepushstate) {
        this.history[options.replace ? 'replacestate' : 'pushstate']({}, document.title, url);

      // if hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantshashchange) {
        this._updatehash(this.location, fragment, options.replace);
        if (this.iframe && fragment !== this.gethash(this.iframe.contentwindow)) {
          var iwindow = this.iframe.contentwindow;

          // opening and closing the iframe tricks ie7 and earlier to push a
          // history entry on hash-tag change.  when replace is true, we don't
          // want this.
          if (!options.replace) {
            iwindow.document.open();
            iwindow.document.close();
          }

          this._updatehash(iwindow.location, fragment, options.replace);
        }

      // if you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadurl(fragment);
    },

    // update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updatehash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // create the default backbone.history.
  backbone.history = new history;

  // helpers
  // -------

  // helper function to correctly set up the prototype chain for subclasses.
  // similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoprops, staticprops) {
    var parent = this;
    var child;

    // the constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent constructor.
    if (protoprops && _.has(protoprops, 'constructor')) {
      child = protoprops.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticprops);

    // set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function and add the prototype properties.
    child.prototype = _.create(parent.prototype, protoprops);
    child.prototype.constructor = child;

    // set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // set up inheritance for the model, collection, router, view and history.
  model.extend = collection.extend = router.extend = view.extend = history.extend = extend;

  // throw an error when a url is needed, and none is supplied.
  var urlerror = function() {
    throw new error('a "url" property or function must be specified');
  };

  // wrap an optional error callback with a fallback error event.
  var wraperror = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error.call(options.context, model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  // provide useful information when things go wrong. this method is not meant
  // to be used directly; it merely provides the necessary introspection for the
  // external `debuginfo` function.
  backbone._debug = function() {
    return {root: root, _: _};
  };

  return backbone;
});



