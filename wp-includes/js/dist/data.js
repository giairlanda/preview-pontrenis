/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 66:
/***/ ((module) => {



var ismergeableobject = function ismergeableobject(value) {
	return isnonnullobject(value)
		&& !isspecial(value)
};

function isnonnullobject(value) {
	return !!value && typeof value === 'object'
}

function isspecial(value) {
	var stringvalue = object.prototype.tostring.call(value);

	return stringvalue === '[object regexp]'
		|| stringvalue === '[object date]'
		|| isreactelement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/reactelement.js#l21-l25
var canusesymbol = typeof symbol === 'function' && symbol.for;
var react_element_type = canusesymbol ? symbol.for('react.element') : 0xeac7;

function isreactelement(value) {
	return value.$$typeof === react_element_type
}

function emptytarget(val) {
	return array.isarray(val) ? [] : {}
}

function cloneunlessotherwisespecified(value, options) {
	return (options.clone !== false && options.ismergeableobject(value))
		? deepmerge(emptytarget(value), value, options)
		: value
}

function defaultarraymerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneunlessotherwisespecified(element, options)
	})
}

function getmergefunction(key, options) {
	if (!options.custommerge) {
		return deepmerge
	}
	var custommerge = options.custommerge(key);
	return typeof custommerge === 'function' ? custommerge : deepmerge
}

function getenumerableownpropertysymbols(target) {
	return object.getownpropertysymbols
		? object.getownpropertysymbols(target).filter(function(symbol) {
			return object.propertyisenumerable.call(target, symbol)
		})
		: []
}

function getkeys(target) {
	return object.keys(target).concat(getenumerableownpropertysymbols(target))
}

function propertyisonobject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyisunsafe(target, key) {
	return propertyisonobject(target, key) // properties are safe to merge if they don't exist in the target yet,
		&& !(object.hasownproperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& object.propertyisenumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeobject(target, source, options) {
	var destination = {};
	if (options.ismergeableobject(target)) {
		getkeys(target).foreach(function(key) {
			destination[key] = cloneunlessotherwisespecified(target[key], options);
		});
	}
	getkeys(source).foreach(function(key) {
		if (propertyisunsafe(target, key)) {
			return
		}

		if (propertyisonobject(target, key) && options.ismergeableobject(source[key])) {
			destination[key] = getmergefunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneunlessotherwisespecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arraymerge = options.arraymerge || defaultarraymerge;
	options.ismergeableobject = options.ismergeableobject || ismergeableobject;
	// cloneunlessotherwisespecified is added to `options` so that custom arraymerge()
	// implementations can use it. the caller may not replace it.
	options.cloneunlessotherwisespecified = cloneunlessotherwisespecified;

	var sourceisarray = array.isarray(source);
	var targetisarray = array.isarray(target);
	var sourceandtargettypesmatch = sourceisarray === targetisarray;

	if (!sourceandtargettypesmatch) {
		return cloneunlessotherwisespecified(source, options)
	} else if (sourceisarray) {
		return options.arraymerge(target, source, options)
	} else {
		return mergeobject(target, source, options)
	}
}

deepmerge.all = function deepmergeall(array, options) {
	if (!array.isarray(array)) {
		throw new error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),

/***/ 3249:
/***/ ((module) => {



function _typeof(obj) {
  if (typeof symbol === "function" && typeof symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classcallcheck(instance, constructor) {
  if (!(instance instanceof constructor)) {
    throw new typeerror("cannot call a class as a function");
  }
}

function _defineproperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    object.defineproperty(target, descriptor.key, descriptor);
  }
}

function _createclass(constructor, protoprops, staticprops) {
  if (protoprops) _defineproperties(constructor.prototype, protoprops);
  if (staticprops) _defineproperties(constructor, staticprops);
  return constructor;
}

/**
 * given an instance of equivalentkeymap, returns its internal value pair tuple
 * for a key, if one exists. the tuple members consist of the last reference
 * value for the key (used in efficient subsequent lookups) and the value
 * assigned for the key at the leaf node.
 *
 * @param {equivalentkeymap} instance equivalentkeymap instance.
 * @param {*} key                     the key for which to return value pair.
 *
 * @return {?array} value pair, if exists.
 */
function getvaluepair(instance, key) {
  var _map = instance._map,
      _arraytreemap = instance._arraytreemap,
      _objecttreemap = instance._objecttreemap; // map keeps a reference to the last object-like key used to set the
  // value, which can be used to shortcut immediately to the value.

  if (_map.has(key)) {
    return _map.get(key);
  } // sort keys to ensure stable retrieval from tree.


  var properties = object.keys(key).sort(); // tree by type to avoid conflicts on numeric object keys, empty value.

  var map = array.isarray(key) ? _arraytreemap : _objecttreemap;

  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    map = map.get(property);

    if (map === undefined) {
      return;
    }

    var propertyvalue = key[property];
    map = map.get(propertyvalue);

    if (map === undefined) {
      return;
    }
  }

  var valuepair = map.get('_ekm_value');

  if (!valuepair) {
    return;
  } // if reached, it implies that an object-like key was set with another
  // reference, so delete the reference and replace with the current.


  _map.delete(valuepair[0]);

  valuepair[0] = key;
  map.set('_ekm_value', valuepair);

  _map.set(key, valuepair);

  return valuepair;
}
/**
 * variant of a map object which enables lookup by equivalent (deeply equal)
 * object and array keys.
 */


var equivalentkeymap =
/*#__pure__*/
function () {
  /**
   * constructs a new instance of equivalentkeymap.
   *
   * @param {iterable.<*>} iterable initial pair of key, value for map.
   */
  function equivalentkeymap(iterable) {
    _classcallcheck(this, equivalentkeymap);

    this.clear();

    if (iterable instanceof equivalentkeymap) {
      // map#foreach is only means of iterating with support for ie11.
      var iterablepairs = [];
      iterable.foreach(function (value, key) {
        iterablepairs.push([key, value]);
      });
      iterable = iterablepairs;
    }

    if (iterable != null) {
      for (var i = 0; i < iterable.length; i++) {
        this.set(iterable[i][0], iterable[i][1]);
      }
    }
  }
  /**
   * accessor property returning the number of elements.
   *
   * @return {number} number of elements.
   */


  _createclass(equivalentkeymap, [{
    key: "set",

    /**
     * add or update an element with a specified key and value.
     *
     * @param {*} key   the key of the element to add.
     * @param {*} value the value of the element to add.
     *
     * @return {equivalentkeymap} map instance.
     */
    value: function set(key, value) {
      // shortcut non-object-like to set on internal map.
      if (key === null || _typeof(key) !== 'object') {
        this._map.set(key, value);

        return this;
      } // sort keys to ensure stable assignment into tree.


      var properties = object.keys(key).sort();
      var valuepair = [key, value]; // tree by type to avoid conflicts on numeric object keys, empty value.

      var map = array.isarray(key) ? this._arraytreemap : this._objecttreemap;

      for (var i = 0; i < properties.length; i++) {
        var property = properties[i];

        if (!map.has(property)) {
          map.set(property, new equivalentkeymap());
        }

        map = map.get(property);
        var propertyvalue = key[property];

        if (!map.has(propertyvalue)) {
          map.set(propertyvalue, new equivalentkeymap());
        }

        map = map.get(propertyvalue);
      } // if an _ekm_value exists, there was already an equivalent key. before
      // overriding, ensure that the old key reference is removed from map to
      // avoid memory leak of accumulating equivalent keys. this is, in a
      // sense, a poor man's weakmap, while still enabling iterability.


      var previousvaluepair = map.get('_ekm_value');

      if (previousvaluepair) {
        this._map.delete(previousvaluepair[0]);
      }

      map.set('_ekm_value', valuepair);

      this._map.set(key, valuepair);

      return this;
    }
    /**
     * returns a specified element.
     *
     * @param {*} key the key of the element to return.
     *
     * @return {?*} the element associated with the specified key or undefined
     *              if the key can't be found.
     */

  }, {
    key: "get",
    value: function get(key) {
      // shortcut non-object-like to get from internal map.
      if (key === null || _typeof(key) !== 'object') {
        return this._map.get(key);
      }

      var valuepair = getvaluepair(this, key);

      if (valuepair) {
        return valuepair[1];
      }
    }
    /**
     * returns a boolean indicating whether an element with the specified key
     * exists or not.
     *
     * @param {*} key the key of the element to test for presence.
     *
     * @return {boolean} whether an element with the specified key exists.
     */

  }, {
    key: "has",
    value: function has(key) {
      if (key === null || _typeof(key) !== 'object') {
        return this._map.has(key);
      } // test on the _presence_ of the pair, not its value, as even undefined
      // can be a valid member value for a key.


      return getvaluepair(this, key) !== undefined;
    }
    /**
     * removes the specified element.
     *
     * @param {*} key the key of the element to remove.
     *
     * @return {boolean} returns true if an element existed and has been
     *                   removed, or false if the element does not exist.
     */

  }, {
    key: "delete",
    value: function _delete(key) {
      if (!this.has(key)) {
        return false;
      } // this naive implementation will leave orphaned child trees. a better
      // implementation should traverse and remove orphans.


      this.set(key, undefined);
      return true;
    }
    /**
     * executes a provided function once per each key/value pair, in insertion
     * order.
     *
     * @param {function} callback function to execute for each element.
     * @param {*}        thisarg  value to use as `this` when executing
     *                            `callback`.
     */

  }, {
    key: "foreach",
    value: function foreach(callback) {
      var _this = this;

      var thisarg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

      this._map.foreach(function (value, key) {
        // unwrap value from object-like value pair.
        if (key !== null && _typeof(key) === 'object') {
          value = value[1];
        }

        callback.call(thisarg, value, key, _this);
      });
    }
    /**
     * removes all elements.
     */

  }, {
    key: "clear",
    value: function clear() {
      this._map = new map();
      this._arraytreemap = new map();
      this._objecttreemap = new map();
    }
  }, {
    key: "size",
    get: function get() {
      return this._map.size;
    }
  }]);

  return equivalentkeymap;
}();

module.exports = equivalentkeymap;


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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getdefaultexport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esmodule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					object.defineproperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasownproperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (object.prototype.hasownproperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esmodule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof symbol !== 'undefined' && symbol.tostringtag) {
/******/ 				object.defineproperty(exports, symbol.tostringtag, { value: 'module' });
/******/ 			}
/******/ 			object.defineproperty(exports, '__esmodule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  asyncmodeprovider: () => (/* reexport */ context_context_default),
  registryconsumer: () => (/* reexport */ registryconsumer),
  registryprovider: () => (/* reexport */ context_default),
  combinereducers: () => (/* binding */ build_module_combinereducers),
  controls: () => (/* reexport */ controls),
  createreduxstore: () => (/* reexport */ createreduxstore),
  createregistry: () => (/* reexport */ createregistry),
  createregistrycontrol: () => (/* reexport */ createregistrycontrol),
  createregistryselector: () => (/* reexport */ createregistryselector),
  createselector: () => (/* reexport */ rememo),
  dispatch: () => (/* reexport */ dispatch_dispatch),
  plugins: () => (/* reexport */ plugins_namespaceobject),
  register: () => (/* binding */ register),
  registergenericstore: () => (/* binding */ registergenericstore),
  registerstore: () => (/* binding */ registerstore),
  resolveselect: () => (/* binding */ build_module_resolveselect),
  select: () => (/* reexport */ select_select),
  subscribe: () => (/* binding */ subscribe),
  suspendselect: () => (/* binding */ suspendselect),
  use: () => (/* binding */ use),
  usedispatch: () => (/* reexport */ use_dispatch_default),
  useregistry: () => (/* reexport */ useregistry),
  useselect: () => (/* reexport */ useselect),
  usesuspenseselect: () => (/* reexport */ usesuspenseselect),
  withdispatch: () => (/* reexport */ with_dispatch_default),
  withregistry: () => (/* reexport */ with_registry_default),
  withselect: () => (/* reexport */ with_select_default)
});

// namespace object: ./node_modules/@wordpress/data/build-module/redux-store/metadata/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  countselectorsbystatus: () => (countselectorsbystatus),
  getcachedresolvers: () => (getcachedresolvers),
  getisresolving: () => (getisresolving),
  getresolutionerror: () => (getresolutionerror),
  getresolutionstate: () => (getresolutionstate),
  hasfinishedresolution: () => (hasfinishedresolution),
  hasresolutionfailed: () => (hasresolutionfailed),
  hasresolvingselectors: () => (hasresolvingselectors),
  hasstartedresolution: () => (hasstartedresolution),
  isresolving: () => (isresolving)
});

// namespace object: ./node_modules/@wordpress/data/build-module/redux-store/metadata/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  failresolution: () => (failresolution),
  failresolutions: () => (failresolutions),
  finishresolution: () => (finishresolution),
  finishresolutions: () => (finishresolutions),
  invalidateresolution: () => (invalidateresolution),
  invalidateresolutionforstore: () => (invalidateresolutionforstore),
  invalidateresolutionforstoreselector: () => (invalidateresolutionforstoreselector),
  startresolution: () => (startresolution),
  startresolutions: () => (startresolutions)
});

// namespace object: ./node_modules/@wordpress/data/build-module/plugins/index.js
var plugins_namespaceobject = {};
__webpack_require__.r(plugins_namespaceobject);
__webpack_require__.d(plugins_namespaceobject, {
  persistence: () => (persistence_default)
});

;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// ./node_modules/redux/dist/redux.mjs
// src/utils/formatproderrormessage.ts
function formatproderrormessage(code) {
  return `minified redux error #${code}; visit https://redux.js.org/errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
}

// src/utils/symbol-observable.ts
var $$observable = /* @__pure__ */ (() => typeof symbol === "function" && symbol.observable || "@@observable")();
var symbol_observable_default = $$observable;

// src/utils/actiontypes.ts
var randomstring = () => math.random().tostring(36).substring(7).split("").join(".");
var actiontypes = {
  init: `@@redux/init${/* @__pure__ */ randomstring()}`,
  replace: `@@redux/replace${/* @__pure__ */ randomstring()}`,
  probe_unknown_action: () => `@@redux/probe_unknown_action${randomstring()}`
};
var actiontypes_default = actiontypes;

// src/utils/isplainobject.ts
function isplainobject(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  let proto = obj;
  while (object.getprototypeof(proto) !== null) {
    proto = object.getprototypeof(proto);
  }
  return object.getprototypeof(obj) === proto || object.getprototypeof(obj) === null;
}

// src/utils/kindof.ts
function minikindof(val) {
  if (val === void 0)
    return "undefined";
  if (val === null)
    return "null";
  const type = typeof val;
  switch (type) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function": {
      return type;
    }
  }
  if (array.isarray(val))
    return "array";
  if (isdate(val))
    return "date";
  if (iserror(val))
    return "error";
  const constructorname = ctorname(val);
  switch (constructorname) {
    case "symbol":
    case "promise":
    case "weakmap":
    case "weakset":
    case "map":
    case "set":
      return constructorname;
  }
  return object.prototype.tostring.call(val).slice(8, -1).tolowercase().replace(/\s/g, "");
}
function ctorname(val) {
  return typeof val.constructor === "function" ? val.constructor.name : null;
}
function iserror(val) {
  return val instanceof error || typeof val.message === "string" && val.constructor && typeof val.constructor.stacktracelimit === "number";
}
function isdate(val) {
  if (val instanceof date)
    return true;
  return typeof val.todatestring === "function" && typeof val.getdate === "function" && typeof val.setdate === "function";
}
function kindof(val) {
  let typeofval = typeof val;
  if (false) {}
  return typeofval;
}

// src/createstore.ts
function createstore(reducer, preloadedstate, enhancer) {
  if (typeof reducer !== "function") {
    throw new error( true ? formatproderrormessage(2) : 0);
  }
  if (typeof preloadedstate === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new error( true ? formatproderrormessage(0) : 0);
  }
  if (typeof preloadedstate === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedstate;
    preloadedstate = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new error( true ? formatproderrormessage(1) : 0);
    }
    return enhancer(createstore)(reducer, preloadedstate);
  }
  let currentreducer = reducer;
  let currentstate = preloadedstate;
  let currentlisteners = /* @__pure__ */ new map();
  let nextlisteners = currentlisteners;
  let listeneridcounter = 0;
  let isdispatching = false;
  function ensurecanmutatenextlisteners() {
    if (nextlisteners === currentlisteners) {
      nextlisteners = /* @__pure__ */ new map();
      currentlisteners.foreach((listener, key) => {
        nextlisteners.set(key, listener);
      });
    }
  }
  function getstate() {
    if (isdispatching) {
      throw new error( true ? formatproderrormessage(3) : 0);
    }
    return currentstate;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new error( true ? formatproderrormessage(4) : 0);
    }
    if (isdispatching) {
      throw new error( true ? formatproderrormessage(5) : 0);
    }
    let issubscribed = true;
    ensurecanmutatenextlisteners();
    const listenerid = listeneridcounter++;
    nextlisteners.set(listenerid, listener);
    return function unsubscribe() {
      if (!issubscribed) {
        return;
      }
      if (isdispatching) {
        throw new error( true ? formatproderrormessage(6) : 0);
      }
      issubscribed = false;
      ensurecanmutatenextlisteners();
      nextlisteners.delete(listenerid);
      currentlisteners = null;
    };
  }
  function dispatch(action) {
    if (!isplainobject(action)) {
      throw new error( true ? formatproderrormessage(7) : 0);
    }
    if (typeof action.type === "undefined") {
      throw new error( true ? formatproderrormessage(8) : 0);
    }
    if (typeof action.type !== "string") {
      throw new error( true ? formatproderrormessage(17) : 0);
    }
    if (isdispatching) {
      throw new error( true ? formatproderrormessage(9) : 0);
    }
    try {
      isdispatching = true;
      currentstate = currentreducer(currentstate, action);
    } finally {
      isdispatching = false;
    }
    const listeners = currentlisteners = nextlisteners;
    listeners.foreach((listener) => {
      listener();
    });
    return action;
  }
  function replacereducer(nextreducer) {
    if (typeof nextreducer !== "function") {
      throw new error( true ? formatproderrormessage(10) : 0);
    }
    currentreducer = nextreducer;
    dispatch({
      type: actiontypes_default.replace
    });
  }
  function observable() {
    const outersubscribe = subscribe;
    return {
      /**
       * the minimal observable subscription method.
       * @param observer any object that can be used as an observer.
       * the observer object should have a `next` method.
       * @returns an object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new error( true ? formatproderrormessage(11) : 0);
        }
        function observestate() {
          const observerasobserver = observer;
          if (observerasobserver.next) {
            observerasobserver.next(getstate());
          }
        }
        observestate();
        const unsubscribe = outersubscribe(observestate);
        return {
          unsubscribe
        };
      },
      [symbol_observable_default]() {
        return this;
      }
    };
  }
  dispatch({
    type: actiontypes_default.init
  });
  const store = {
    dispatch,
    subscribe,
    getstate,
    replacereducer,
    [symbol_observable_default]: observable
  };
  return store;
}
function legacy_createstore(reducer, preloadedstate, enhancer) {
  return createstore(reducer, preloadedstate, enhancer);
}

// src/utils/warning.ts
function warning(message) {
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  try {
    throw new error(message);
  } catch (e) {
  }
}

// src/combinereducers.ts
function getunexpectedstateshapewarningmessage(inputstate, reducers, action, unexpectedkeycache) {
  const reducerkeys = object.keys(reducers);
  const argumentname = action && action.type === actiontypes_default.init ? "preloadedstate argument passed to createstore" : "previous state received by the reducer";
  if (reducerkeys.length === 0) {
    return "store does not have a valid reducer. make sure the argument passed to combinereducers is an object whose values are reducers.";
  }
  if (!isplainobject(inputstate)) {
    return `the ${argumentname} has unexpected type of "${kindof(inputstate)}". expected argument to be an object with the following keys: "${reducerkeys.join('", "')}"`;
  }
  const unexpectedkeys = object.keys(inputstate).filter((key) => !reducers.hasownproperty(key) && !unexpectedkeycache[key]);
  unexpectedkeys.foreach((key) => {
    unexpectedkeycache[key] = true;
  });
  if (action && action.type === actiontypes_default.replace)
    return;
  if (unexpectedkeys.length > 0) {
    return `unexpected ${unexpectedkeys.length > 1 ? "keys" : "key"} "${unexpectedkeys.join('", "')}" found in ${argumentname}. expected to find one of the known reducer keys instead: "${reducerkeys.join('", "')}". unexpected keys will be ignored.`;
  }
}
function assertreducershape(reducers) {
  object.keys(reducers).foreach((key) => {
    const reducer = reducers[key];
    const initialstate = reducer(void 0, {
      type: actiontypes_default.init
    });
    if (typeof initialstate === "undefined") {
      throw new error( true ? formatproderrormessage(12) : 0);
    }
    if (typeof reducer(void 0, {
      type: actiontypes_default.probe_unknown_action()
    }) === "undefined") {
      throw new error( true ? formatproderrormessage(13) : 0);
    }
  });
}
function combinereducers(reducers) {
  const reducerkeys = object.keys(reducers);
  const finalreducers = {};
  for (let i = 0; i < reducerkeys.length; i++) {
    const key = reducerkeys[i];
    if (false) {}
    if (typeof reducers[key] === "function") {
      finalreducers[key] = reducers[key];
    }
  }
  const finalreducerkeys = object.keys(finalreducers);
  let unexpectedkeycache;
  if (false) {}
  let shapeassertionerror;
  try {
    assertreducershape(finalreducers);
  } catch (e) {
    shapeassertionerror = e;
  }
  return function combination(state = {}, action) {
    if (shapeassertionerror) {
      throw shapeassertionerror;
    }
    if (false) {}
    let haschanged = false;
    const nextstate = {};
    for (let i = 0; i < finalreducerkeys.length; i++) {
      const key = finalreducerkeys[i];
      const reducer = finalreducers[key];
      const previousstateforkey = state[key];
      const nextstateforkey = reducer(previousstateforkey, action);
      if (typeof nextstateforkey === "undefined") {
        const actiontype = action && action.type;
        throw new error( true ? formatproderrormessage(14) : 0);
      }
      nextstate[key] = nextstateforkey;
      haschanged = haschanged || nextstateforkey !== previousstateforkey;
    }
    haschanged = haschanged || finalreducerkeys.length !== object.keys(state).length;
    return haschanged ? nextstate : state;
  };
}

// src/bindactioncreators.ts
function bindactioncreator(actioncreator, dispatch) {
  return function(...args) {
    return dispatch(actioncreator.apply(this, args));
  };
}
function bindactioncreators(actioncreators, dispatch) {
  if (typeof actioncreators === "function") {
    return bindactioncreator(actioncreators, dispatch);
  }
  if (typeof actioncreators !== "object" || actioncreators === null) {
    throw new error( true ? formatproderrormessage(16) : 0);
  }
  const boundactioncreators = {};
  for (const key in actioncreators) {
    const actioncreator = actioncreators[key];
    if (typeof actioncreator === "function") {
      boundactioncreators[key] = bindactioncreator(actioncreator, dispatch);
    }
  }
  return boundactioncreators;
}

// src/compose.ts
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// src/applymiddleware.ts
function applymiddleware(...middlewares) {
  return (createstore2) => (reducer, preloadedstate) => {
    const store = createstore2(reducer, preloadedstate);
    let dispatch = () => {
      throw new error( true ? formatproderrormessage(15) : 0);
    };
    const middlewareapi = {
      getstate: store.getstate,
      dispatch: (action, ...args) => dispatch(action, ...args)
    };
    const chain = middlewares.map((middleware) => middleware(middlewareapi));
    dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      dispatch
    };
  };
}

// src/utils/isaction.ts
function isaction(action) {
  return isplainobject(action) && "type" in action && typeof action.type === "string";
}

//# sourcemappingurl=redux.mjs.map
// external module: ./node_modules/equivalent-key-map/equivalent-key-map.js
var equivalent_key_map = __webpack_require__(3249);
var equivalent_key_map_default = /*#__pure__*/__webpack_require__.n(equivalent_key_map);
;// external ["wp","reduxroutine"]
const external_wp_reduxroutine_namespaceobject = window["wp"]["reduxroutine"];
var external_wp_reduxroutine_default = /*#__pure__*/__webpack_require__.n(external_wp_reduxroutine_namespaceobject);
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// ./node_modules/@wordpress/data/build-module/redux-store/combine-reducers.js
function combine_reducers_combinereducers(reducers) {
  const keys = object.keys(reducers);
  return function combinedreducer(state = {}, action) {
    const nextstate = {};
    let haschanged = false;
    for (const key of keys) {
      const reducer = reducers[key];
      const prevstateforkey = state[key];
      const nextstateforkey = reducer(prevstateforkey, action);
      nextstate[key] = nextstateforkey;
      haschanged = haschanged || nextstateforkey !== prevstateforkey;
    }
    return haschanged ? nextstate : state;
  };
}


;// ./node_modules/@wordpress/data/build-module/factory.js
function createregistryselector(registryselector) {
  const selectorsbyregistry = /* @__pure__ */ new weakmap();
  const wrappedselector = (...args) => {
    let selector = selectorsbyregistry.get(wrappedselector.registry);
    if (!selector) {
      selector = registryselector(wrappedselector.registry.select);
      selectorsbyregistry.set(wrappedselector.registry, selector);
    }
    return selector(...args);
  };
  wrappedselector.isregistryselector = true;
  return wrappedselector;
}
function createregistrycontrol(registrycontrol) {
  registrycontrol.isregistrycontrol = true;
  return registrycontrol;
}


;// ./node_modules/@wordpress/data/build-module/controls.js

const select = "@@data/select";
const resolve_select = "@@data/resolve_select";
const dispatch = "@@data/dispatch";
function isobject(object) {
  return object !== null && typeof object === "object";
}
function controls_select(storenameordescriptor, selectorname, ...args) {
  return {
    type: select,
    storekey: isobject(storenameordescriptor) ? storenameordescriptor.name : storenameordescriptor,
    selectorname,
    args
  };
}
function resolveselect(storenameordescriptor, selectorname, ...args) {
  return {
    type: resolve_select,
    storekey: isobject(storenameordescriptor) ? storenameordescriptor.name : storenameordescriptor,
    selectorname,
    args
  };
}
function dispatch(storenameordescriptor, actionname, ...args) {
  return {
    type: dispatch,
    storekey: isobject(storenameordescriptor) ? storenameordescriptor.name : storenameordescriptor,
    actionname,
    args
  };
}
const controls = { select: controls_select, resolveselect, dispatch };
const builtincontrols = {
  [select]: createregistrycontrol(
    (registry) => ({ storekey, selectorname, args }) => registry.select(storekey)[selectorname](...args)
  ),
  [resolve_select]: createregistrycontrol(
    (registry) => ({ storekey, selectorname, args }) => {
      const method = registry.select(storekey)[selectorname].hasresolver ? "resolveselect" : "select";
      return registry[method](storekey)[selectorname](
        ...args
      );
    }
  ),
  [dispatch]: createregistrycontrol(
    (registry) => ({ storekey, actionname, args }) => registry.dispatch(storekey)[actionname](...args)
  )
};


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/data/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/data"
);


;// ./node_modules/is-promise/index.mjs
function ispromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

;// ./node_modules/@wordpress/data/build-module/promise-middleware.js

const promisemiddleware = () => (next) => (action) => {
  if (ispromise(action)) {
    return action.then((resolvedaction) => {
      if (resolvedaction) {
        return next(resolvedaction);
      }
    });
  }
  return next(action);
};
var promise_middleware_default = promisemiddleware;


;// ./node_modules/@wordpress/data/build-module/resolvers-cache-middleware.js
const createresolverscachemiddleware = (registry, storename) => () => (next) => (action) => {
  const resolvers = registry.select(storename).getcachedresolvers();
  const resolverentries = object.entries(resolvers);
  resolverentries.foreach(([selectorname, resolversbyargs]) => {
    const resolver = registry.stores[storename]?.resolvers?.[selectorname];
    if (!resolver || !resolver.shouldinvalidate) {
      return;
    }
    resolversbyargs.foreach((value, args) => {
      if (value === void 0) {
        return;
      }
      if (value.status !== "finished" && value.status !== "error") {
        return;
      }
      if (!resolver.shouldinvalidate(action, ...args)) {
        return;
      }
      registry.dispatch(storename).invalidateresolution(selectorname, args);
    });
  });
  return next(action);
};
var resolvers_cache_middleware_default = createresolverscachemiddleware;


;// ./node_modules/@wordpress/data/build-module/redux-store/thunk-middleware.js
function createthunkmiddleware(args) {
  return () => (next) => (action) => {
    if (typeof action === "function") {
      return action(args);
    }
    return next(action);
  };
}


;// ./node_modules/@wordpress/data/build-module/redux-store/metadata/utils.js
const onsubkey = (actionproperty) => (reducer) => (state = {}, action) => {
  const key = action[actionproperty];
  if (key === void 0) {
    return state;
  }
  const nextkeystate = reducer(state[key], action);
  if (nextkeystate === state[key]) {
    return state;
  }
  return {
    ...state,
    [key]: nextkeystate
  };
};
function selectorargstostatekey(args) {
  if (args === void 0 || args === null) {
    return [];
  }
  const len = args.length;
  let idx = len;
  while (idx > 0 && args[idx - 1] === void 0) {
    idx--;
  }
  return idx === len ? args : args.slice(0, idx);
}


;// ./node_modules/@wordpress/data/build-module/redux-store/metadata/reducer.js


const subkeysisresolved = onsubkey("selectorname")((state = new (equivalent_key_map_default())(), action) => {
  switch (action.type) {
    case "start_resolution": {
      const nextstate = new (equivalent_key_map_default())(state);
      nextstate.set(selectorargstostatekey(action.args), {
        status: "resolving"
      });
      return nextstate;
    }
    case "finish_resolution": {
      const nextstate = new (equivalent_key_map_default())(state);
      nextstate.set(selectorargstostatekey(action.args), {
        status: "finished"
      });
      return nextstate;
    }
    case "fail_resolution": {
      const nextstate = new (equivalent_key_map_default())(state);
      nextstate.set(selectorargstostatekey(action.args), {
        status: "error",
        error: action.error
      });
      return nextstate;
    }
    case "start_resolutions": {
      const nextstate = new (equivalent_key_map_default())(state);
      for (const resolutionargs of action.args) {
        nextstate.set(selectorargstostatekey(resolutionargs), {
          status: "resolving"
        });
      }
      return nextstate;
    }
    case "finish_resolutions": {
      const nextstate = new (equivalent_key_map_default())(state);
      for (const resolutionargs of action.args) {
        nextstate.set(selectorargstostatekey(resolutionargs), {
          status: "finished"
        });
      }
      return nextstate;
    }
    case "fail_resolutions": {
      const nextstate = new (equivalent_key_map_default())(state);
      action.args.foreach((resolutionargs, idx) => {
        const resolutionstate = {
          status: "error",
          error: void 0
        };
        const error = action.errors[idx];
        if (error) {
          resolutionstate.error = error;
        }
        nextstate.set(
          selectorargstostatekey(resolutionargs),
          resolutionstate
        );
      });
      return nextstate;
    }
    case "invalidate_resolution": {
      const nextstate = new (equivalent_key_map_default())(state);
      nextstate.delete(selectorargstostatekey(action.args));
      return nextstate;
    }
  }
  return state;
});
const isresolved = (state = {}, action) => {
  switch (action.type) {
    case "invalidate_resolution_for_store":
      return {};
    case "invalidate_resolution_for_store_selector": {
      if (action.selectorname in state) {
        const {
          [action.selectorname]: removedselector,
          ...reststate
        } = state;
        return reststate;
      }
      return state;
    }
    case "start_resolution":
    case "finish_resolution":
    case "fail_resolution":
    case "start_resolutions":
    case "finish_resolutions":
    case "fail_resolutions":
    case "invalidate_resolution":
      return subkeysisresolved(state, action);
  }
  return state;
};
var reducer_default = isresolved;


;// ./node_modules/rememo/rememo.js


/** @typedef {(...args: any[]) => *[]} getdependants */

/** @typedef {() => void} clear */

/**
 * @typedef {{
 *   getdependants: getdependants,
 *   clear: clear
 * }} enhancedselector
 */

/**
 * internal cache entry.
 *
 * @typedef cachenode
 *
 * @property {?cachenode|undefined} [prev] previous node.
 * @property {?cachenode|undefined} [next] next node.
 * @property {*[]} args function arguments for cache entry.
 * @property {*} val function result.
 */

/**
 * @typedef cache
 *
 * @property {clear} clear function to clear cache.
 * @property {boolean} [isuniquebydependants] whether dependants are valid in
 * considering cache uniqueness. a cache is unique if dependents are all arrays
 * or objects.
 * @property {cachenode?} [head] cache head.
 * @property {*[]} [lastdependants] dependants from previous invocation.
 */

/**
 * arbitrary value used as key for referencing cache object in weakmap tree.
 *
 * @type {{}}
 */
var leaf_key = {};

/**
 * returns the first argument as the sole entry in an array.
 *
 * @template t
 *
 * @param {t} value value to return.
 *
 * @return {[t]} value returned as entry in array.
 */
function arrayof(value) {
	return [value];
}

/**
 * returns true if the value passed is object-like, or false otherwise. a value
 * is object-like if it can support property assignment, e.g. object or array.
 *
 * @param {*} value value to test.
 *
 * @return {boolean} whether value is object-like.
 */
function isobjectlike(value) {
	return !!value && 'object' === typeof value;
}

/**
 * creates and returns a new cache object.
 *
 * @return {cache} cache object.
 */
function createcache() {
	/** @type {cache} */
	var cache = {
		clear: function () {
			cache.head = null;
		},
	};

	return cache;
}

/**
 * returns true if entries within the two arrays are strictly equal by
 * reference from a starting index.
 *
 * @param {*[]} a first array.
 * @param {*[]} b second array.
 * @param {number} fromindex index from which to start comparison.
 *
 * @return {boolean} whether arrays are shallowly equal.
 */
function isshallowequal(a, b, fromindex) {
	var i;

	if (a.length !== b.length) {
		return false;
	}

	for (i = fromindex; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
}

/**
 * returns a memoized selector function. the getdependants function argument is
 * called before the memoized selector and is expected to return an immutable
 * reference or array of references on which the selector depends for computing
 * its own return value. the memoize cache is preserved only as long as those
 * dependant references remain the same. if getdependants returns a different
 * reference(s), the cache is cleared and the selector value regenerated.
 *
 * @template {(...args: *[]) => *} s
 *
 * @param {s} selector selector function.
 * @param {getdependants=} getdependants dependant getter returning an array of
 * references used in cache bust consideration.
 */
/* harmony default export */ function rememo(selector, getdependants) {
	/** @type {weakmap<*,*>} */
	var rootcache;

	/** @type {getdependants} */
	var normalizedgetdependants = getdependants ? getdependants : arrayof;

	/**
	 * returns the cache for a given dependants array. when possible, a weakmap
	 * will be used to create a unique cache for each set of dependants. this
	 * is feasible due to the nature of weakmap in allowing garbage collection
	 * to occur on entries where the key object is no longer referenced. since
	 * weakmap requires the key to be an object, this is only possible when the
	 * dependant is object-like. the root cache is created as a hierarchy where
	 * each top-level key is the first entry in a dependants set, the value a
	 * weakmap where each key is the next dependant, and so on. this continues
	 * so long as the dependants are object-like. if no dependants are object-
	 * like, then the cache is shared across all invocations.
	 *
	 * @see isobjectlike
	 *
	 * @param {*[]} dependants selector dependants.
	 *
	 * @return {cache} cache object.
	 */
	function getcache(dependants) {
		var caches = rootcache,
			isuniquebydependants = true,
			i,
			dependant,
			map,
			cache;

		for (i = 0; i < dependants.length; i++) {
			dependant = dependants[i];

			// can only compose weakmap from object-like key.
			if (!isobjectlike(dependant)) {
				isuniquebydependants = false;
				break;
			}

			// does current segment of cache already have a weakmap?
			if (caches.has(dependant)) {
				// traverse into nested weakmap.
				caches = caches.get(dependant);
			} else {
				// create, set, and traverse into a new one.
				map = new weakmap();
				caches.set(dependant, map);
				caches = map;
			}
		}

		// we use an arbitrary (but consistent) object as key for the last item
		// in the weakmap to serve as our running cache.
		if (!caches.has(leaf_key)) {
			cache = createcache();
			cache.isuniquebydependants = isuniquebydependants;
			caches.set(leaf_key, cache);
		}

		return caches.get(leaf_key);
	}

	/**
	 * resets root memoization cache.
	 */
	function clear() {
		rootcache = new weakmap();
	}

	/* eslint-disable jsdoc/check-param-names */
	/**
	 * the augmented selector call, considering first whether dependants have
	 * changed before passing it to underlying memoize function.
	 *
	 * @param {*}    source    source object for derivation.
	 * @param {...*} extraargs additional arguments to pass to selector.
	 *
	 * @return {*} selector result.
	 */
	/* eslint-enable jsdoc/check-param-names */
	function callselector(/* source, ...extraargs */) {
		var len = arguments.length,
			cache,
			node,
			i,
			args,
			dependants;

		// create copy of arguments (avoid leaking deoptimization).
		args = new array(len);
		for (i = 0; i < len; i++) {
			args[i] = arguments[i];
		}

		dependants = normalizedgetdependants.apply(null, args);
		cache = getcache(dependants);

		// if not guaranteed uniqueness by dependants (primitive type), shallow
		// compare against last dependants and, if references have changed,
		// destroy cache to recalculate result.
		if (!cache.isuniquebydependants) {
			if (
				cache.lastdependants &&
				!isshallowequal(dependants, cache.lastdependants, 0)
			) {
				cache.clear();
			}

			cache.lastdependants = dependants;
		}

		node = cache.head;
		while (node) {
			// check whether node arguments match arguments
			if (!isshallowequal(node.args, args, 1)) {
				node = node.next;
				continue;
			}

			// at this point we can assume we've found a match

			// surface matched node to head if not already
			if (node !== cache.head) {
				// adjust siblings to point to each other.
				/** @type {cachenode} */ (node.prev).next = node.next;
				if (node.next) {
					node.next.prev = node.prev;
				}

				node.next = cache.head;
				node.prev = null;
				/** @type {cachenode} */ (cache.head).prev = node;
				cache.head = node;
			}

			// return immediately
			return node.val;
		}

		// no cached value found. continue to insertion phase:

		node = /** @type {cachenode} */ ({
			// generate the result from original function
			val: selector.apply(null, args),
		});

		// avoid including the source object in the cache.
		args[0] = null;
		node.args = args;

		// don't need to check whether node is already head, since it would
		// have been returned above already if it was

		// shift existing head down list
		if (cache.head) {
			cache.head.prev = node;
			node.next = cache.head;
		}

		cache.head = node;

		return node.val;
	}

	callselector.getdependants = normalizedgetdependants;
	callselector.clear = clear;
	clear();

	return /** @type {s & enhancedselector} */ (callselector);
}

;// ./node_modules/@wordpress/data/build-module/redux-store/metadata/selectors.js



function getresolutionstate(state, selectorname, args) {
  const map = state[selectorname];
  if (!map) {
    return;
  }
  return map.get(selectorargstostatekey(args));
}
function getisresolving(state, selectorname, args) {
  external_wp_deprecated_default()("wp.data.select( store ).getisresolving", {
    since: "6.6",
    version: "6.8",
    alternative: "wp.data.select( store ).getresolutionstate"
  });
  const resolutionstate = getresolutionstate(state, selectorname, args);
  return resolutionstate && resolutionstate.status === "resolving";
}
function hasstartedresolution(state, selectorname, args) {
  return getresolutionstate(state, selectorname, args) !== void 0;
}
function hasfinishedresolution(state, selectorname, args) {
  const status = getresolutionstate(state, selectorname, args)?.status;
  return status === "finished" || status === "error";
}
function hasresolutionfailed(state, selectorname, args) {
  return getresolutionstate(state, selectorname, args)?.status === "error";
}
function getresolutionerror(state, selectorname, args) {
  const resolutionstate = getresolutionstate(state, selectorname, args);
  return resolutionstate?.status === "error" ? resolutionstate.error : null;
}
function isresolving(state, selectorname, args) {
  return getresolutionstate(state, selectorname, args)?.status === "resolving";
}
function getcachedresolvers(state) {
  return state;
}
function hasresolvingselectors(state) {
  return object.values(state).some(
    (selectorstate) => (
      /**
       * this uses the internal `_map` property of `equivalentkeymap` for
       * optimization purposes, since the `equivalentkeymap` implementation
       * does not support a `.values()` implementation.
       *
       * @see https://github.com/aduth/equivalent-key-map
       */
      array.from(selectorstate._map.values()).some(
        (resolution) => resolution[1]?.status === "resolving"
      )
    )
  );
}
const countselectorsbystatus = rememo(
  (state) => {
    const selectorsbystatus = {};
    object.values(state).foreach(
      (selectorstate) => (
        /**
         * this uses the internal `_map` property of `equivalentkeymap` for
         * optimization purposes, since the `equivalentkeymap` implementation
         * does not support a `.values()` implementation.
         *
         * @see https://github.com/aduth/equivalent-key-map
         */
        array.from(selectorstate._map.values()).foreach(
          (resolution) => {
            const currentstatus = resolution[1]?.status ?? "error";
            if (!selectorsbystatus[currentstatus]) {
              selectorsbystatus[currentstatus] = 0;
            }
            selectorsbystatus[currentstatus]++;
          }
        )
      )
    );
    return selectorsbystatus;
  },
  (state) => [state]
);


;// ./node_modules/@wordpress/data/build-module/redux-store/metadata/actions.js
function startresolution(selectorname, args) {
  return {
    type: "start_resolution",
    selectorname,
    args
  };
}
function finishresolution(selectorname, args) {
  return {
    type: "finish_resolution",
    selectorname,
    args
  };
}
function failresolution(selectorname, args, error) {
  return {
    type: "fail_resolution",
    selectorname,
    args,
    error
  };
}
function startresolutions(selectorname, args) {
  return {
    type: "start_resolutions",
    selectorname,
    args
  };
}
function finishresolutions(selectorname, args) {
  return {
    type: "finish_resolutions",
    selectorname,
    args
  };
}
function failresolutions(selectorname, args, errors) {
  return {
    type: "fail_resolutions",
    selectorname,
    args,
    errors
  };
}
function invalidateresolution(selectorname, args) {
  return {
    type: "invalidate_resolution",
    selectorname,
    args
  };
}
function invalidateresolutionforstore() {
  return {
    type: "invalidate_resolution_for_store"
  };
}
function invalidateresolutionforstoreselector(selectorname) {
  return {
    type: "invalidate_resolution_for_store_selector",
    selectorname
  };
}


;// ./node_modules/@wordpress/data/build-module/redux-store/index.js













const trimundefinedvalues = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i] === void 0) {
      result.splice(i, 1);
    }
  }
  return result;
};
const mapvalues = (obj, callback) => object.fromentries(
  object.entries(obj ?? {}).map(([key, value]) => [
    key,
    callback(value, key)
  ])
);
const devtoolsreplacer = (key, state) => {
  if (state instanceof map) {
    return object.fromentries(state);
  }
  if (state instanceof window.htmlelement) {
    return null;
  }
  return state;
};
function createresolverscache() {
  const cache = {};
  return {
    isrunning(selectorname, args) {
      return cache[selectorname] && cache[selectorname].get(trimundefinedvalues(args));
    },
    clear(selectorname, args) {
      if (cache[selectorname]) {
        cache[selectorname].delete(trimundefinedvalues(args));
      }
    },
    markasrunning(selectorname, args) {
      if (!cache[selectorname]) {
        cache[selectorname] = new (equivalent_key_map_default())();
      }
      cache[selectorname].set(trimundefinedvalues(args), true);
    }
  };
}
function createbindingcache(getitem, binditem) {
  const cache = /* @__pure__ */ new weakmap();
  return {
    get(itemname) {
      const item = getitem(itemname);
      if (!item) {
        return null;
      }
      let bounditem = cache.get(item);
      if (!bounditem) {
        bounditem = binditem(item, itemname);
        cache.set(item, bounditem);
      }
      return bounditem;
    }
  };
}
function createprivateproxy(publicitems, privateitems) {
  return new proxy(publicitems, {
    get: (target, itemname) => privateitems.get(itemname) || reflect.get(target, itemname)
  });
}
function createreduxstore(key, options) {
  const privateactions = {};
  const privateselectors = {};
  const privateregistrationfunctions = {
    privateactions,
    registerprivateactions: (actions) => {
      object.assign(privateactions, actions);
    },
    privateselectors,
    registerprivateselectors: (selectors) => {
      object.assign(privateselectors, selectors);
    }
  };
  const storedescriptor = {
    name: key,
    instantiate: (registry) => {
      const listeners = /* @__pure__ */ new set();
      const reducer = options.reducer;
      const thunkargs = {
        registry,
        get dispatch() {
          return thunkdispatch;
        },
        get select() {
          return thunkselect;
        },
        get resolveselect() {
          return resolveselectors;
        }
      };
      const store = instantiatereduxstore(
        key,
        options,
        registry,
        thunkargs
      );
      lock(store, privateregistrationfunctions);
      const resolverscache = createresolverscache();
      function bindaction(action) {
        return (...args) => promise.resolve(store.dispatch(action(...args)));
      }
      const actions = {
        ...mapvalues(actions_namespaceobject, bindaction),
        ...mapvalues(options.actions, bindaction)
      };
      const allactions = createprivateproxy(
        actions,
        createbindingcache(
          (name) => privateactions[name],
          bindaction
        )
      );
      const thunkdispatch = new proxy(
        (action) => store.dispatch(action),
        { get: (target, name) => allactions[name] }
      );
      lock(actions, allactions);
      const resolvers = options.resolvers ? mapvalues(options.resolvers, mapresolver) : {};
      function bindselector(selector, selectorname) {
        if (selector.isregistryselector) {
          selector.registry = registry;
        }
        const boundselector = (...args) => {
          args = normalize(selector, args);
          const state = store.__unstableoriginalgetstate();
          if (selector.isregistryselector) {
            selector.registry = registry;
          }
          return selector(state.root, ...args);
        };
        boundselector.__unstablenormalizeargs = selector.__unstablenormalizeargs;
        const resolver = resolvers[selectorname];
        if (!resolver) {
          boundselector.hasresolver = false;
          return boundselector;
        }
        return mapselectorwithresolver(
          boundselector,
          selectorname,
          resolver,
          store,
          resolverscache,
          boundmetadataselectors
        );
      }
      function bindmetadataselector(metadataselector) {
        const boundselector = (selectorname, selectorargs, ...args) => {
          if (selectorname) {
            const targetselector = options.selectors?.[selectorname];
            if (targetselector) {
              selectorargs = normalize(
                targetselector,
                selectorargs
              );
            }
          }
          const state = store.__unstableoriginalgetstate();
          return metadataselector(
            state.metadata,
            selectorname,
            selectorargs,
            ...args
          );
        };
        boundselector.hasresolver = false;
        return boundselector;
      }
      const boundmetadataselectors = mapvalues(
        selectors_namespaceobject,
        bindmetadataselector
      );
      const boundselectors = mapvalues(options.selectors, bindselector);
      const selectors = {
        ...boundmetadataselectors,
        ...boundselectors
      };
      const boundprivateselectors = createbindingcache(
        (name) => privateselectors[name],
        bindselector
      );
      const allselectors = createprivateproxy(
        selectors,
        boundprivateselectors
      );
      for (const selectorname of object.keys(privateselectors)) {
        boundprivateselectors.get(selectorname);
      }
      const thunkselect = new proxy(
        (selector) => selector(store.__unstableoriginalgetstate()),
        { get: (target, name) => allselectors[name] }
      );
      lock(selectors, allselectors);
      const bindresolveselector = mapresolveselector(
        store,
        boundmetadataselectors
      );
      const resolveselectors = mapvalues(
        boundselectors,
        bindresolveselector
      );
      const allresolveselectors = createprivateproxy(
        resolveselectors,
        createbindingcache(
          (name) => boundprivateselectors.get(name),
          bindresolveselector
        )
      );
      lock(resolveselectors, allresolveselectors);
      const bindsuspendselector = mapsuspendselector(
        store,
        boundmetadataselectors
      );
      const suspendselectors = {
        ...boundmetadataselectors,
        // no special suspense behavior
        ...mapvalues(boundselectors, bindsuspendselector)
      };
      const allsuspendselectors = createprivateproxy(
        suspendselectors,
        createbindingcache(
          (name) => boundprivateselectors.get(name),
          bindsuspendselector
        )
      );
      lock(suspendselectors, allsuspendselectors);
      const getselectors = () => selectors;
      const getactions = () => actions;
      const getresolveselectors = () => resolveselectors;
      const getsuspendselectors = () => suspendselectors;
      store.__unstableoriginalgetstate = store.getstate;
      store.getstate = () => store.__unstableoriginalgetstate().root;
      const subscribe = store && ((listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      });
      let laststate = store.__unstableoriginalgetstate();
      store.subscribe(() => {
        const state = store.__unstableoriginalgetstate();
        const haschanged = state !== laststate;
        laststate = state;
        if (haschanged) {
          for (const listener of listeners) {
            listener();
          }
        }
      });
      return {
        reducer,
        store,
        actions,
        selectors,
        resolvers,
        getselectors,
        getresolveselectors,
        getsuspendselectors,
        getactions,
        subscribe
      };
    }
  };
  lock(storedescriptor, privateregistrationfunctions);
  return storedescriptor;
}
function instantiatereduxstore(key, options, registry, thunkargs) {
  const controls = {
    ...options.controls,
    ...builtincontrols
  };
  const normalizedcontrols = mapvalues(
    controls,
    (control) => control.isregistrycontrol ? control(registry) : control
  );
  const middlewares = [
    resolvers_cache_middleware_default(registry, key),
    promise_middleware_default,
    external_wp_reduxroutine_default()(normalizedcontrols),
    createthunkmiddleware(thunkargs)
  ];
  const enhancers = [applymiddleware(...middlewares)];
  if (typeof window !== "undefined" && window.__redux_devtools_extension__) {
    enhancers.push(
      window.__redux_devtools_extension__({
        name: key,
        instanceid: key,
        serialize: {
          replacer: devtoolsreplacer
        }
      })
    );
  }
  const { reducer, initialstate } = options;
  const enhancedreducer = combine_reducers_combinereducers({
    metadata: reducer_default,
    root: reducer
  });
  return createstore(
    enhancedreducer,
    { root: initialstate },
    (0,external_wp_compose_namespaceobject.compose)(enhancers)
  );
}
function mapresolveselector(store, boundmetadataselectors) {
  return (selector, selectorname) => {
    if (!selector.hasresolver) {
      return async (...args) => selector.apply(null, args);
    }
    return (...args) => new promise((resolve, reject) => {
      const hasfinished = () => {
        return boundmetadataselectors.hasfinishedresolution(
          selectorname,
          args
        );
      };
      const finalize = (result2) => {
        const hasfailed = boundmetadataselectors.hasresolutionfailed(
          selectorname,
          args
        );
        if (hasfailed) {
          const error = boundmetadataselectors.getresolutionerror(
            selectorname,
            args
          );
          reject(error);
        } else {
          resolve(result2);
        }
      };
      const getresult = () => selector.apply(null, args);
      const result = getresult();
      if (hasfinished()) {
        return finalize(result);
      }
      const unsubscribe = store.subscribe(() => {
        if (hasfinished()) {
          unsubscribe();
          finalize(getresult());
        }
      });
    });
  };
}
function mapsuspendselector(store, boundmetadataselectors) {
  return (selector, selectorname) => {
    if (!selector.hasresolver) {
      return selector;
    }
    return (...args) => {
      const result = selector.apply(null, args);
      if (boundmetadataselectors.hasfinishedresolution(
        selectorname,
        args
      )) {
        if (boundmetadataselectors.hasresolutionfailed(
          selectorname,
          args
        )) {
          throw boundmetadataselectors.getresolutionerror(
            selectorname,
            args
          );
        }
        return result;
      }
      throw new promise((resolve) => {
        const unsubscribe = store.subscribe(() => {
          if (boundmetadataselectors.hasfinishedresolution(
            selectorname,
            args
          )) {
            resolve();
            unsubscribe();
          }
        });
      });
    };
  };
}
function mapresolver(resolver) {
  if (resolver.fulfill) {
    return resolver;
  }
  return {
    ...resolver,
    // copy the enumerable properties of the resolver function.
    fulfill: resolver
    // add the fulfill method.
  };
}
function mapselectorwithresolver(selector, selectorname, resolver, store, resolverscache, boundmetadataselectors) {
  function fulfillselector(args) {
    const state = store.getstate();
    if (resolverscache.isrunning(selectorname, args) || typeof resolver.isfulfilled === "function" && resolver.isfulfilled(state, ...args)) {
      return;
    }
    if (boundmetadataselectors.hasstartedresolution(selectorname, args)) {
      return;
    }
    resolverscache.markasrunning(selectorname, args);
    settimeout(async () => {
      resolverscache.clear(selectorname, args);
      store.dispatch(
        startresolution(selectorname, args)
      );
      try {
        const action = resolver.fulfill(...args);
        if (action) {
          await store.dispatch(action);
        }
        store.dispatch(
          finishresolution(selectorname, args)
        );
      } catch (error) {
        store.dispatch(
          failresolution(selectorname, args, error)
        );
      }
    }, 0);
  }
  const selectorresolver = (...args) => {
    args = normalize(selector, args);
    fulfillselector(args);
    return selector(...args);
  };
  selectorresolver.hasresolver = true;
  return selectorresolver;
}
function normalize(selector, args) {
  if (selector.__unstablenormalizeargs && typeof selector.__unstablenormalizeargs === "function" && args?.length) {
    return selector.__unstablenormalizeargs(args);
  }
  return args;
}


;// ./node_modules/@wordpress/data/build-module/store/index.js
const coredatastore = {
  name: "core/data",
  instantiate(registry) {
    const getcoredataselector = (selectorname) => (key, ...args) => {
      return registry.select(key)[selectorname](...args);
    };
    const getcoredataaction = (actionname) => (key, ...args) => {
      return registry.dispatch(key)[actionname](...args);
    };
    return {
      getselectors() {
        return object.fromentries(
          [
            "getisresolving",
            "hasstartedresolution",
            "hasfinishedresolution",
            "isresolving",
            "getcachedresolvers"
          ].map((selectorname) => [
            selectorname,
            getcoredataselector(selectorname)
          ])
        );
      },
      getactions() {
        return object.fromentries(
          [
            "startresolution",
            "finishresolution",
            "invalidateresolution",
            "invalidateresolutionforstore",
            "invalidateresolutionforstoreselector"
          ].map((actionname) => [
            actionname,
            getcoredataaction(actionname)
          ])
        );
      },
      subscribe() {
        return () => () => {
        };
      }
    };
  }
};
var store_default = coredatastore;


;// ./node_modules/@wordpress/data/build-module/utils/emitter.js
function createemitter() {
  let ispaused = false;
  let ispending = false;
  const listeners = /* @__pure__ */ new set();
  const notifylisteners = () => (
    // we use array.from to clone the listeners set
    // this ensures that we don't run a listener
    // that was added as a response to another listener.
    array.from(listeners).foreach((listener) => listener())
  );
  return {
    get ispaused() {
      return ispaused;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    pause() {
      ispaused = true;
    },
    resume() {
      ispaused = false;
      if (ispending) {
        ispending = false;
        notifylisteners();
      }
    },
    emit() {
      if (ispaused) {
        ispending = true;
        return;
      }
      notifylisteners();
    }
  };
}


;// ./node_modules/@wordpress/data/build-module/registry.js





function getstorename(storenameordescriptor) {
  return typeof storenameordescriptor === "string" ? storenameordescriptor : storenameordescriptor.name;
}
function createregistry(storeconfigs = {}, parent = null) {
  const stores = {};
  const emitter = createemitter();
  let listeningstores = null;
  function globallistener() {
    emitter.emit();
  }
  const subscribe = (listener, storenameordescriptor) => {
    if (!storenameordescriptor) {
      return emitter.subscribe(listener);
    }
    const storename = getstorename(storenameordescriptor);
    const store = stores[storename];
    if (store) {
      return store.subscribe(listener);
    }
    if (!parent) {
      return emitter.subscribe(listener);
    }
    return parent.subscribe(listener, storenameordescriptor);
  };
  function select(storenameordescriptor) {
    const storename = getstorename(storenameordescriptor);
    listeningstores?.add(storename);
    const store = stores[storename];
    if (store) {
      return store.getselectors();
    }
    return parent?.select(storename);
  }
  function __unstablemarklisteningstores(callback, ref) {
    listeningstores = /* @__pure__ */ new set();
    try {
      return callback.call(this);
    } finally {
      ref.current = array.from(listeningstores);
      listeningstores = null;
    }
  }
  function resolveselect(storenameordescriptor) {
    const storename = getstorename(storenameordescriptor);
    listeningstores?.add(storename);
    const store = stores[storename];
    if (store) {
      return store.getresolveselectors();
    }
    return parent && parent.resolveselect(storename);
  }
  function suspendselect(storenameordescriptor) {
    const storename = getstorename(storenameordescriptor);
    listeningstores?.add(storename);
    const store = stores[storename];
    if (store) {
      return store.getsuspendselectors();
    }
    return parent && parent.suspendselect(storename);
  }
  function dispatch(storenameordescriptor) {
    const storename = getstorename(storenameordescriptor);
    const store = stores[storename];
    if (store) {
      return store.getactions();
    }
    return parent && parent.dispatch(storename);
  }
  function withplugins(attributes) {
    return object.fromentries(
      object.entries(attributes).map(([key, attribute]) => {
        if (typeof attribute !== "function") {
          return [key, attribute];
        }
        return [
          key,
          function() {
            return registry[key].apply(null, arguments);
          }
        ];
      })
    );
  }
  function registerstoreinstance(name, createstore) {
    if (stores[name]) {
      console.error('store "' + name + '" is already registered.');
      return stores[name];
    }
    const store = createstore();
    if (typeof store.getselectors !== "function") {
      throw new typeerror("store.getselectors must be a function");
    }
    if (typeof store.getactions !== "function") {
      throw new typeerror("store.getactions must be a function");
    }
    if (typeof store.subscribe !== "function") {
      throw new typeerror("store.subscribe must be a function");
    }
    store.emitter = createemitter();
    const currentsubscribe = store.subscribe;
    store.subscribe = (listener) => {
      const unsubscribefromemitter = store.emitter.subscribe(listener);
      const unsubscribefromstore = currentsubscribe(() => {
        if (store.emitter.ispaused) {
          store.emitter.emit();
          return;
        }
        listener();
      });
      return () => {
        unsubscribefromstore?.();
        unsubscribefromemitter?.();
      };
    };
    stores[name] = store;
    store.subscribe(globallistener);
    if (parent) {
      try {
        unlock(store.store).registerprivateactions(
          unlock(parent).privateactionsof(name)
        );
        unlock(store.store).registerprivateselectors(
          unlock(parent).privateselectorsof(name)
        );
      } catch (e) {
      }
    }
    return store;
  }
  function register(store) {
    registerstoreinstance(
      store.name,
      () => store.instantiate(registry)
    );
  }
  function registergenericstore(name, store) {
    external_wp_deprecated_default()("wp.data.registergenericstore", {
      since: "5.9",
      alternative: "wp.data.register( storedescriptor )"
    });
    registerstoreinstance(name, () => store);
  }
  function registerstore(storename, options) {
    if (!options.reducer) {
      throw new typeerror("must specify store reducer");
    }
    const store = registerstoreinstance(
      storename,
      () => createreduxstore(storename, options).instantiate(registry)
    );
    return store.store;
  }
  function batch(callback) {
    if (emitter.ispaused) {
      callback();
      return;
    }
    emitter.pause();
    object.values(stores).foreach((store) => store.emitter.pause());
    try {
      callback();
    } finally {
      emitter.resume();
      object.values(stores).foreach(
        (store) => store.emitter.resume()
      );
    }
  }
  let registry = {
    batch,
    stores,
    namespaces: stores,
    // todo: deprecate/remove this.
    subscribe,
    select,
    resolveselect,
    suspendselect,
    dispatch,
    use,
    register,
    registergenericstore,
    registerstore,
    __unstablemarklisteningstores
  };
  function use(plugin, options) {
    if (!plugin) {
      return;
    }
    registry = {
      ...registry,
      ...plugin(registry, options)
    };
    return registry;
  }
  registry.register(store_default);
  for (const [name, config] of object.entries(storeconfigs)) {
    registry.register(createreduxstore(name, config));
  }
  if (parent) {
    parent.subscribe(globallistener);
  }
  const registrywithplugins = withplugins(registry);
  lock(registrywithplugins, {
    privateactionsof: (name) => {
      try {
        return unlock(stores[name].store).privateactions;
      } catch (e) {
        return {};
      }
    },
    privateselectorsof: (name) => {
      try {
        return unlock(stores[name].store).privateselectors;
      } catch (e) {
        return {};
      }
    }
  });
  return registrywithplugins;
}


;// ./node_modules/@wordpress/data/build-module/default-registry.js

var default_registry_default = createregistry();


;// ./node_modules/is-plain-object/dist/is-plain-object.mjs
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * copyright (c) 2014-2017, jon schlinkert.
 * released under the mit license.
 */

function is_plain_object_isobject(o) {
  return object.prototype.tostring.call(o) === '[object object]';
}

function is_plain_object_isplainobject(o) {
  var ctor,prot;

  if (is_plain_object_isobject(o) === false) return false;

  // if has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // if has modified prototype
  prot = ctor.prototype;
  if (is_plain_object_isobject(prot) === false) return false;

  // if constructor does not have an object-specific method
  if (prot.hasownproperty('isprototypeof') === false) {
    return false;
  }

  // most likely a plain object
  return true;
}



// external module: ./node_modules/deepmerge/dist/cjs.js
var cjs = __webpack_require__(66);
var cjs_default = /*#__pure__*/__webpack_require__.n(cjs);
;// ./node_modules/@wordpress/data/build-module/plugins/persistence/storage/object.js
let objectstorage;
const storage = {
  getitem(key) {
    if (!objectstorage || !objectstorage[key]) {
      return null;
    }
    return objectstorage[key];
  },
  setitem(key, value) {
    if (!objectstorage) {
      storage.clear();
    }
    objectstorage[key] = string(value);
  },
  clear() {
    objectstorage = /* @__pure__ */ object.create(null);
  }
};
var object_default = storage;


;// ./node_modules/@wordpress/data/build-module/plugins/persistence/storage/default.js

let default_storage;
try {
  default_storage = window.localstorage;
  default_storage.setitem("__wpdatatestlocalstorage", "");
  default_storage.removeitem("__wpdatatestlocalstorage");
} catch (error) {
  default_storage = object_default;
}
var default_default = default_storage;


;// ./node_modules/@wordpress/data/build-module/plugins/persistence/index.js




const default_storage = default_default;
const default_storage_key = "wp_data";
const withlazysamestate = (reducer) => (state, action) => {
  if (action.nextstate === state) {
    return state;
  }
  return reducer(state, action);
};
function createpersistenceinterface(options) {
  const { storage = default_storage, storagekey = default_storage_key } = options;
  let data;
  function getdata() {
    if (data === void 0) {
      const persisted = storage.getitem(storagekey);
      if (persisted === null) {
        data = {};
      } else {
        try {
          data = json.parse(persisted);
        } catch (error) {
          data = {};
        }
      }
    }
    return data;
  }
  function setdata(key, value) {
    data = { ...data, [key]: value };
    storage.setitem(storagekey, json.stringify(data));
  }
  return {
    get: getdata,
    set: setdata
  };
}
function persistenceplugin(registry, pluginoptions) {
  const persistence = createpersistenceinterface(pluginoptions);
  function createpersistonchange(getstate, storename, keys) {
    let getpersistedstate;
    if (array.isarray(keys)) {
      const reducers = keys.reduce(
        (accumulator, key) => object.assign(accumulator, {
          [key]: (state, action) => action.nextstate[key]
        }),
        {}
      );
      getpersistedstate = withlazysamestate(
        build_module_combinereducers(reducers)
      );
    } else {
      getpersistedstate = (state, action) => action.nextstate;
    }
    let laststate = getpersistedstate(void 0, {
      nextstate: getstate()
    });
    return () => {
      const state = getpersistedstate(laststate, {
        nextstate: getstate()
      });
      if (state !== laststate) {
        persistence.set(storename, state);
        laststate = state;
      }
    };
  }
  return {
    registerstore(storename, options) {
      if (!options.persist) {
        return registry.registerstore(storename, options);
      }
      const persistedstate = persistence.get()[storename];
      if (persistedstate !== void 0) {
        let initialstate = options.reducer(options.initialstate, {
          type: "@@wp/persistence_restore"
        });
        if (is_plain_object_isplainobject(initialstate) && is_plain_object_isplainobject(persistedstate)) {
          initialstate = cjs_default()(initialstate, persistedstate, {
            ismergeableobject: is_plain_object_isplainobject
          });
        } else {
          initialstate = persistedstate;
        }
        options = {
          ...options,
          initialstate
        };
      }
      const store = registry.registerstore(storename, options);
      store.subscribe(
        createpersistonchange(
          store.getstate,
          storename,
          options.persist
        )
      );
      return store;
    }
  };
}
persistenceplugin.__unstablemigrate = () => {
};
var persistence_default = persistenceplugin;


;// ./node_modules/@wordpress/data/build-module/plugins/index.js



;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","priorityqueue"]
const external_wp_priorityqueue_namespaceobject = window["wp"]["priorityqueue"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","isshallowequal"]
const external_wp_isshallowequal_namespaceobject = window["wp"]["isshallowequal"];
var external_wp_isshallowequal_default = /*#__pure__*/__webpack_require__.n(external_wp_isshallowequal_namespaceobject);
;// ./node_modules/@wordpress/data/build-module/components/registry-provider/context.js


const context = (0,external_wp_element_namespaceobject.createcontext)(default_registry_default);
context.displayname = "registryprovidercontext";
const { consumer, provider } = context;
const registryconsumer = consumer;
var context_default = provider;


;// ./node_modules/@wordpress/data/build-module/components/registry-provider/use-registry.js


function useregistry() {
  return (0,external_wp_element_namespaceobject.usecontext)(context);
}


;// ./node_modules/@wordpress/data/build-module/components/async-mode-provider/context.js

const context_context = (0,external_wp_element_namespaceobject.createcontext)(false);
context_context.displayname = "asyncmodecontext";
const { consumer: context_consumer, provider: context_provider } = context_context;
const asyncmodeconsumer = (/* unused pure expression or super */ null && (context_consumer));
var context_context_default = context_provider;


;// ./node_modules/@wordpress/data/build-module/components/async-mode-provider/use-async-mode.js


function useasyncmode() {
  return (0,external_wp_element_namespaceobject.usecontext)(context_context);
}


;// ./node_modules/@wordpress/data/build-module/components/use-select/index.js





const renderqueue = (0,external_wp_priorityqueue_namespaceobject.createqueue)();
function warnonunstablereference(a, b) {
  if (!a || !b) {
    return;
  }
  const keys = typeof a === "object" && typeof b === "object" ? object.keys(a).filter((k) => a[k] !== b[k]) : [];
  console.warn(
    "the `useselect` hook returns different values when called with the same state and parameters.\nthis can lead to unnecessary re-renders and performance issues if not fixed.\n\nnon-equal value keys: %s\n\n",
    keys.join(", ")
  );
}
function store(registry, suspense) {
  const select = suspense ? registry.suspendselect : registry.select;
  const queuecontext = {};
  let lastmapselect;
  let lastmapresult;
  let lastmapresultvalid = false;
  let lastisasync;
  let subscriber;
  let didwarnunstablereference;
  const storestatesonmount = /* @__pure__ */ new map();
  function getstorestate(name) {
    return registry.stores[name]?.store?.getstate?.() ?? {};
  }
  const createsubscriber = (stores) => {
    const activestores = [...stores];
    const activesubscriptions = /* @__pure__ */ new set();
    function subscribe(listener) {
      if (lastmapresultvalid) {
        for (const name of activestores) {
          if (storestatesonmount.get(name) !== getstorestate(name)) {
            lastmapresultvalid = false;
          }
        }
      }
      storestatesonmount.clear();
      const onstorechange = () => {
        lastmapresultvalid = false;
        listener();
      };
      const onchange = () => {
        if (lastisasync) {
          renderqueue.add(queuecontext, onstorechange);
        } else {
          onstorechange();
        }
      };
      const unsubs = [];
      function subscribestore(storename) {
        unsubs.push(registry.subscribe(onchange, storename));
      }
      for (const storename of activestores) {
        subscribestore(storename);
      }
      activesubscriptions.add(subscribestore);
      return () => {
        activesubscriptions.delete(subscribestore);
        for (const unsub of unsubs.values()) {
          unsub?.();
        }
        renderqueue.cancel(queuecontext);
      };
    }
    function updatestores(newstores) {
      for (const newstore of newstores) {
        if (activestores.includes(newstore)) {
          continue;
        }
        activestores.push(newstore);
        for (const subscription of activesubscriptions) {
          subscription(newstore);
        }
      }
    }
    return { subscribe, updatestores };
  };
  return (mapselect, isasync) => {
    function updatevalue() {
      if (lastmapresultvalid && mapselect === lastmapselect) {
        return lastmapresult;
      }
      const listeningstores = { current: null };
      const mapresult = registry.__unstablemarklisteningstores(
        () => mapselect(select, registry),
        listeningstores
      );
      if (true) {
        if (!didwarnunstablereference) {
          const secondmapresult = mapselect(select, registry);
          if (!external_wp_isshallowequal_default()(mapresult, secondmapresult)) {
            warnonunstablereference(mapresult, secondmapresult);
            didwarnunstablereference = true;
          }
        }
      }
      if (!subscriber) {
        for (const name of listeningstores.current) {
          storestatesonmount.set(name, getstorestate(name));
        }
        subscriber = createsubscriber(listeningstores.current);
      } else {
        subscriber.updatestores(listeningstores.current);
      }
      if (!external_wp_isshallowequal_default()(lastmapresult, mapresult)) {
        lastmapresult = mapresult;
      }
      lastmapselect = mapselect;
      lastmapresultvalid = true;
    }
    function getvalue() {
      updatevalue();
      return lastmapresult;
    }
    if (lastisasync && !isasync) {
      lastmapresultvalid = false;
      renderqueue.cancel(queuecontext);
    }
    updatevalue();
    lastisasync = isasync;
    return { subscribe: subscriber.subscribe, getvalue };
  };
}
function _usestaticselect(storename) {
  return useregistry().select(storename);
}
function _usemappingselect(suspense, mapselect, deps) {
  const registry = useregistry();
  const isasync = useasyncmode();
  const store = (0,external_wp_element_namespaceobject.usememo)(
    () => store(registry, suspense),
    [registry, suspense]
  );
  const selector = (0,external_wp_element_namespaceobject.usecallback)(mapselect, deps);
  const { subscribe, getvalue } = store(selector, isasync);
  const result = (0,external_wp_element_namespaceobject.usesyncexternalstore)(subscribe, getvalue, getvalue);
  (0,external_wp_element_namespaceobject.usedebugvalue)(result);
  return result;
}
function useselect(mapselect, deps) {
  const staticselectmode = typeof mapselect !== "function";
  const staticselectmoderef = (0,external_wp_element_namespaceobject.useref)(staticselectmode);
  if (staticselectmode !== staticselectmoderef.current) {
    const prevmode = staticselectmoderef.current ? "static" : "mapping";
    const nextmode = staticselectmode ? "static" : "mapping";
    throw new error(
      `switching useselect from ${prevmode} to ${nextmode} is not allowed`
    );
  }
  return staticselectmode ? _usestaticselect(mapselect) : _usemappingselect(false, mapselect, deps);
}
function usesuspenseselect(mapselect, deps) {
  return _usemappingselect(true, mapselect, deps);
}


;// ./node_modules/@wordpress/data/build-module/components/with-select/index.js



const withselect = (mapselecttoprops) => (0,external_wp_compose_namespaceobject.createhigherordercomponent)(
  (wrappedcomponent) => (0,external_wp_compose_namespaceobject.pure)((ownprops) => {
    const mapselect = (select, registry) => mapselecttoprops(select, ownprops, registry);
    const mergeprops = useselect(mapselect);
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(wrappedcomponent, { ...ownprops, ...mergeprops });
  }),
  "withselect"
);
var with_select_default = withselect;


;// ./node_modules/@wordpress/data/build-module/components/use-dispatch/use-dispatch-with-map.js



const usedispatchwithmap = (dispatchmap, deps) => {
  const registry = useregistry();
  const currentdispatchmapref = (0,external_wp_element_namespaceobject.useref)(dispatchmap);
  (0,external_wp_compose_namespaceobject.useisomorphiclayouteffect)(() => {
    currentdispatchmapref.current = dispatchmap;
  });
  return (0,external_wp_element_namespaceobject.usememo)(() => {
    const currentdispatchprops = currentdispatchmapref.current(
      registry.dispatch,
      registry
    );
    return object.fromentries(
      object.entries(currentdispatchprops).map(
        ([propname, dispatcher]) => {
          if (typeof dispatcher !== "function") {
            console.warn(
              `property ${propname} returned from dispatchmap in usedispatchwithmap must be a function.`
            );
          }
          return [
            propname,
            (...args) => currentdispatchmapref.current(registry.dispatch, registry)[propname](...args)
          ];
        }
      )
    );
  }, [registry, ...deps]);
};
var use_dispatch_with_map_default = usedispatchwithmap;


;// ./node_modules/@wordpress/data/build-module/components/with-dispatch/index.js



const withdispatch = (mapdispatchtoprops) => (0,external_wp_compose_namespaceobject.createhigherordercomponent)(
  (wrappedcomponent) => (ownprops) => {
    const mapdispatch = (dispatch, registry) => mapdispatchtoprops(dispatch, ownprops, registry);
    const dispatchprops = use_dispatch_with_map_default(mapdispatch, []);
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(wrappedcomponent, { ...ownprops, ...dispatchprops });
  },
  "withdispatch"
);
var with_dispatch_default = withdispatch;


;// ./node_modules/@wordpress/data/build-module/components/with-registry/index.js



const withregistry = (0,external_wp_compose_namespaceobject.createhigherordercomponent)(
  (originalcomponent) => (props) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(registryconsumer, { children: (registry) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(originalcomponent, { ...props, registry }) }),
  "withregistry"
);
var with_registry_default = withregistry;


;// ./node_modules/@wordpress/data/build-module/components/use-dispatch/use-dispatch.js

const usedispatch = (storenameordescriptor) => {
  const { dispatch } = useregistry();
  return storenameordescriptor === void 0 ? dispatch : dispatch(storenameordescriptor);
};
var use_dispatch_default = usedispatch;


;// ./node_modules/@wordpress/data/build-module/dispatch.js

function dispatch_dispatch(storenameordescriptor) {
  return default_registry_default.dispatch(storenameordescriptor);
}


;// ./node_modules/@wordpress/data/build-module/select.js

function select_select(storenameordescriptor) {
  return default_registry_default.select(storenameordescriptor);
}


;// ./node_modules/@wordpress/data/build-module/index.js

















const build_module_combinereducers = combine_reducers_combinereducers;
const build_module_resolveselect = default_registry_default.resolveselect;
const suspendselect = default_registry_default.suspendselect;
const subscribe = default_registry_default.subscribe;
const registergenericstore = default_registry_default.registergenericstore;
const registerstore = default_registry_default.registerstore;
const use = default_registry_default.use;
const register = default_registry_default.register;


(window.wp = window.wp || {}).data = __webpack_exports__;
/******/ })()
;







