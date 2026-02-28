(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('underscore', factory) :
  (global = typeof globalthis !== 'undefined' ? globalthis : global || self, (function () {
    var current = global._;
    var exports = global._ = factory();
    exports.noconflict = function () { global._ = current; return exports; };
  }()));
}(this, (function () {
  //     underscore.js 1.13.7
  //     https://underscorejs.org
  //     (c) 2009-2024 jeremy ashkenas, julian gonggrijp, and documentcloud and investigative reporters & editors
  //     underscore may be freely distributed under the mit license.

  // current version.
  var version = '1.13.7';

  // establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. we use `self`
  // instead of `window` for `webworker` support.
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global) ||
            function('return this')() ||
            {};

  // save bytes in the minified (but not gzipped) version:
  var arrayproto = array.prototype, objproto = object.prototype;
  var symbolproto = typeof symbol !== 'undefined' ? symbol.prototype : null;

  // create quick reference variables for speed access to core prototypes.
  var push = arrayproto.push,
      slice = arrayproto.slice,
      tostring = objproto.tostring,
      hasownproperty = objproto.hasownproperty;

  // modern feature detection.
  var supportsarraybuffer = typeof arraybuffer !== 'undefined',
      supportsdataview = typeof dataview !== 'undefined';

  // all **ecmascript 5+** native function implementations that we hope to use
  // are declared here.
  var nativeisarray = array.isarray,
      nativekeys = object.keys,
      nativecreate = object.create,
      nativeisview = supportsarraybuffer && arraybuffer.isview;

  // create references to these builtin functions because we override them.
  var _isnan = isnan,
      _isfinite = isfinite;

  // keys in ie < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasenumbug = !{tostring: null}.propertyisenumerable('tostring');
  var nonenumerableprops = ['valueof', 'isprototypeof', 'tostring',
    'propertyisenumerable', 'hasownproperty', 'tolocalestring'];

  // the largest integer that can be represented exactly.
  var max_array_index = math.pow(2, 53) - 1;

  // some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. this helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startindex`), into an array that becomes
  // the last argument. similar to es6’s "rest parameter".
  function restarguments(func, startindex) {
    startindex = startindex == null ? func.length - 1 : +startindex;
    return function() {
      var length = math.max(arguments.length - startindex, 0),
          rest = array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startindex];
      }
      switch (startindex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = array(startindex + 1);
      for (index = 0; index < startindex; index++) {
        args[index] = arguments[index];
      }
      args[startindex] = rest;
      return func.apply(this, args);
    };
  }

  // is a given variable an object?
  function isobject(obj) {
    var type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
  }

  // is a given value equal to null?
  function isnull(obj) {
    return obj === null;
  }

  // is a given variable undefined?
  function isundefined(obj) {
    return obj === void 0;
  }

  // is a given value a boolean?
  function isboolean(obj) {
    return obj === true || obj === false || tostring.call(obj) === '[object boolean]';
  }

  // is a given value a dom element?
  function iselement(obj) {
    return !!(obj && obj.nodetype === 1);
  }

  // internal function for creating a `tostring`-based type tester.
  function tagtester(name) {
    var tag = '[object ' + name + ']';
    return function(obj) {
      return tostring.call(obj) === tag;
    };
  }

  var isstring = tagtester('string');

  var isnumber = tagtester('number');

  var isdate = tagtester('date');

  var isregexp = tagtester('regexp');

  var iserror = tagtester('error');

  var issymbol = tagtester('symbol');

  var isarraybuffer = tagtester('arraybuffer');

  var isfunction = tagtester('function');

  // optimize `isfunction` if appropriate. work around some `typeof` bugs in old
  // v8, ie 11 (#1621), safari 8 (#1929), and phantomjs (#2236).
  var nodelist = root.document && root.document.childnodes;
  if (typeof /./ != 'function' && typeof int8array != 'object' && typeof nodelist != 'function') {
    isfunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  var isfunction$1 = isfunction;

  var hasobjecttag = tagtester('object');

  // in ie 10 - edge 13, `dataview` has string tag `'[object object]'`.
  // in ie 11, the most common among them, this problem also applies to
  // `map`, `weakmap` and `set`.
  // also, there are cases where an application can override the native
  // `dataview` object, in cases like that we can't use the constructor
  // safely and should just rely on alternate `dataview` checks
  var hasdataviewbug = (
        supportsdataview && (!/\[native code\]/.test(string(dataview)) || hasobjecttag(new dataview(new arraybuffer(8))))
      ),
      isie11 = (typeof map !== 'undefined' && hasobjecttag(new map));

  var isdataview = tagtester('dataview');

  // in ie 10 - edge 13, we need a different heuristic
  // to determine whether an object is a `dataview`.
  // also, in cases where the native `dataview` is
  // overridden we can't rely on the tag itself.
  function alternateisdataview(obj) {
    return obj != null && isfunction$1(obj.getint8) && isarraybuffer(obj.buffer);
  }

  var isdataview$1 = (hasdataviewbug ? alternateisdataview : isdataview);

  // is a given value an array?
  // delegates to ecma5's native `array.isarray`.
  var isarray = nativeisarray || tagtester('array');

  // internal function to check whether `key` is an own property name of `obj`.
  function has$1(obj, key) {
    return obj != null && hasownproperty.call(obj, key);
  }

  var isarguments = tagtester('arguments');

  // define a fallback version of the method in browsers (ahem, ie < 9), where
  // there isn't any inspectable "arguments" type.
  (function() {
    if (!isarguments(arguments)) {
      isarguments = function(obj) {
        return has$1(obj, 'callee');
      };
    }
  }());

  var isarguments$1 = isarguments;

  // is a given object a finite number?
  function isfinite$1(obj) {
    return !issymbol(obj) && _isfinite(obj) && !isnan(parsefloat(obj));
  }

  // is the given value `nan`?
  function isnan$1(obj) {
    return isnumber(obj) && _isnan(obj);
  }

  // predicate-generating function. often useful outside of underscore.
  function constant(value) {
    return function() {
      return value;
    };
  }

  // common internal logic for `isarraylike` and `isbufferlike`.
  function createsizepropertycheck(getsizeproperty) {
    return function(collection) {
      var sizeproperty = getsizeproperty(collection);
      return typeof sizeproperty == 'number' && sizeproperty >= 0 && sizeproperty <= max_array_index;
    }
  }

  // internal helper to generate a function to obtain property `key` from `obj`.
  function shallowproperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  // internal helper to obtain the `bytelength` property of an object.
  var getbytelength = shallowproperty('bytelength');

  // internal helper to determine whether we should spend extensive checks against
  // `arraybuffer` et al.
  var isbufferlike = createsizepropertycheck(getbytelength);

  // is a given value a typed array?
  var typedarraypattern = /\[object ((i|ui)nt(8|16|32)|float(32|64)|uint8clamped|big(i|ui)nt64)array\]/;
  function istypedarray(obj) {
    // `arraybuffer.isview` is the most future-proof, so use it when available.
    // otherwise, fall back on the above regular expression.
    return nativeisview ? (nativeisview(obj) && !isdataview$1(obj)) :
                  isbufferlike(obj) && typedarraypattern.test(tostring.call(obj));
  }

  var istypedarray$1 = supportsarraybuffer ? istypedarray : constant(false);

  // internal helper to obtain the `length` property of an object.
  var getlength = shallowproperty('length');

  // internal helper to create a simple lookup structure.
  // `collectnonenumprops` used to depend on `_.contains`, but this led to
  // circular imports. `emulatedset` is a one-off solution that only works for
  // arrays of strings.
  function emulatedset(keys) {
    var hash = {};
    for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
    return {
      contains: function(key) { return hash[key] === true; },
      push: function(key) {
        hash[key] = true;
        return keys.push(key);
      }
    };
  }

  // internal helper. checks `keys` for the presence of keys in ie < 9 that won't
  // be iterated by `for key in ...` and thus missed. extends `keys` in place if
  // needed.
  function collectnonenumprops(obj, keys) {
    keys = emulatedset(keys);
    var nonenumidx = nonenumerableprops.length;
    var constructor = obj.constructor;
    var proto = (isfunction$1(constructor) && constructor.prototype) || objproto;

    // constructor is a special case.
    var prop = 'constructor';
    if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);

    while (nonenumidx--) {
      prop = nonenumerableprops[nonenumidx];
      if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
        keys.push(prop);
      }
    }
  }

  // retrieve the names of an object's own properties.
  // delegates to **ecmascript 5**'s native `object.keys`.
  function keys(obj) {
    if (!isobject(obj)) return [];
    if (nativekeys) return nativekeys(obj);
    var keys = [];
    for (var key in obj) if (has$1(obj, key)) keys.push(key);
    // ahem, ie < 9.
    if (hasenumbug) collectnonenumprops(obj, keys);
    return keys;
  }

  // is a given array, string, or object empty?
  // an "empty" object has no enumerable own-properties.
  function isempty(obj) {
    if (obj == null) return true;
    // skip the more expensive `tostring`-based type checks if `obj` has no
    // `.length`.
    var length = getlength(obj);
    if (typeof length == 'number' && (
      isarray(obj) || isstring(obj) || isarguments$1(obj)
    )) return length === 0;
    return getlength(keys(obj)) === 0;
  }

  // returns whether an object has a given set of `key:value` pairs.
  function ismatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = object(object);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }

  // if underscore is called as a function, it returns a wrapped object that can
  // be used oo-style. this wrapper holds altered versions of all functions added
  // through `_.mixin`. wrapped objects may be chained.
  function _$1(obj) {
    if (obj instanceof _$1) return obj;
    if (!(this instanceof _$1)) return new _$1(obj);
    this._wrapped = obj;
  }

  _$1.version = version;

  // extracts the result from a wrapped and chained object.
  _$1.prototype.value = function() {
    return this._wrapped;
  };

  // provide unwrapping proxies for some methods used in engine operations
  // such as arithmetic and json stringification.
  _$1.prototype.valueof = _$1.prototype.tojson = _$1.prototype.value;

  _$1.prototype.tostring = function() {
    return string(this._wrapped);
  };

  // internal function to wrap or shallow-copy an arraybuffer,
  // typed array or dataview to a new view, reusing the buffer.
  function tobufferview(buffersource) {
    return new uint8array(
      buffersource.buffer || buffersource,
      buffersource.byteoffset || 0,
      getbytelength(buffersource)
    );
  }

  // we use this string twice, so give it a name for minification.
  var tagdataview = '[object dataview]';

  // internal recursive comparison function for `_.isequal`.
  function eq(a, b, astack, bstack) {
    // identical objects are equal. `0 === -0`, but they aren't identical.
    // see the [harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `nan`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepeq(a, b, astack, bstack);
  }

  // internal recursive comparison function for `_.isequal`.
  function deepeq(a, b, astack, bstack) {
    // unwrap any wrapped objects.
    if (a instanceof _$1) a = a._wrapped;
    if (b instanceof _$1) b = b._wrapped;
    // compare `[[class]]` names.
    var classname = tostring.call(a);
    if (classname !== tostring.call(b)) return false;
    // work around a bug in ie 10 - edge 13.
    if (hasdataviewbug && classname == '[object object]' && isdataview$1(a)) {
      if (!isdataview$1(b)) return false;
      classname = tagdataview;
    }
    switch (classname) {
      // these types are compared by value.
      case '[object regexp]':
        // regexps are coerced to strings for comparison (note: '' + /a/i === '/a/i')
      case '[object string]':
        // primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new string("5")`.
        return '' + a === '' + b;
      case '[object number]':
        // `nan`s are equivalent, but non-reflexive.
        // object(nan) is equivalent to nan.
        if (+a !== +a) return +b !== +b;
        // an `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object date]':
      case '[object boolean]':
        // coerce dates and booleans to numeric primitive values. dates are compared by their
        // millisecond representations. note that invalid dates with millisecond representations
        // of `nan` are not equivalent.
        return +a === +b;
      case '[object symbol]':
        return symbolproto.valueof.call(a) === symbolproto.valueof.call(b);
      case '[object arraybuffer]':
      case tagdataview:
        // coerce to typed array so we can fall through.
        return deepeq(tobufferview(a), tobufferview(b), astack, bstack);
    }

    var arearrays = classname === '[object array]';
    if (!arearrays && istypedarray$1(a)) {
        var bytelength = getbytelength(a);
        if (bytelength !== getbytelength(b)) return false;
        if (a.buffer === b.buffer && a.byteoffset === b.byteoffset) return true;
        arearrays = true;
    }
    if (!arearrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // objects with different constructors are not equivalent, but `object`s or `array`s
      // from different frames are.
      var actor = a.constructor, bctor = b.constructor;
      if (actor !== bctor && !(isfunction$1(actor) && actor instanceof actor &&
                               isfunction$1(bctor) && bctor instanceof bctor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // assume equality for cyclic structures. the algorithm for detecting cyclic
    // structures is adapted from es 5.1 section 15.12.3, abstract operation `jo`.

    // initializing stack of traversed objects.
    // it's done here since we only need them for objects and arrays comparison.
    astack = astack || [];
    bstack = bstack || [];
    var length = astack.length;
    while (length--) {
      // linear search. performance is inversely proportional to the number of
      // unique nested structures.
      if (astack[length] === a) return bstack[length] === b;
    }

    // add the first object to the stack of traversed objects.
    astack.push(a);
    bstack.push(b);

    // recursively compare objects and arrays.
    if (arearrays) {
      // compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], astack, bstack)) return false;
      }
    } else {
      // deep compare objects.
      var _keys = keys(a), key;
      length = _keys.length;
      // ensure that both objects contain the same number of properties before comparing deep equality.
      if (keys(b).length !== length) return false;
      while (length--) {
        // deep compare each member
        key = _keys[length];
        if (!(has$1(b, key) && eq(a[key], b[key], astack, bstack))) return false;
      }
    }
    // remove the first object from the stack of traversed objects.
    astack.pop();
    bstack.pop();
    return true;
  }

  // perform a deep comparison to check if two objects are equal.
  function isequal(a, b) {
    return eq(a, b);
  }

  // retrieve all the enumerable property names of an object.
  function allkeys(obj) {
    if (!isobject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // ahem, ie < 9.
    if (hasenumbug) collectnonenumprops(obj, keys);
    return keys;
  }

  // since the regular `object.prototype.tostring` type tests don't work for
  // some types in ie 11, we use a fingerprinting heuristic instead, based
  // on the methods. it's not great, but it's the best we got.
  // the fingerprint method lists are defined below.
  function ie11fingerprint(methods) {
    var length = getlength(methods);
    return function(obj) {
      if (obj == null) return false;
      // `map`, `weakmap` and `set` have no enumerable keys.
      var keys = allkeys(obj);
      if (getlength(keys)) return false;
      for (var i = 0; i < length; i++) {
        if (!isfunction$1(obj[methods[i]])) return false;
      }
      // if we are testing against `weakmap`, we need to ensure that
      // `obj` doesn't have a `foreach` method in order to distinguish
      // it from a regular `map`.
      return methods !== weakmapmethods || !isfunction$1(obj[foreachname]);
    };
  }

  // in the interest of compact minification, we write
  // each string in the fingerprints only once.
  var foreachname = 'foreach',
      hasname = 'has',
      commoninit = ['clear', 'delete'],
      maptail = ['get', hasname, 'set'];

  // `map`, `weakmap` and `set` each have slightly different
  // combinations of the above sublists.
  var mapmethods = commoninit.concat(foreachname, maptail),
      weakmapmethods = commoninit.concat(maptail),
      setmethods = ['add'].concat(commoninit, foreachname, hasname);

  var ismap = isie11 ? ie11fingerprint(mapmethods) : tagtester('map');

  var isweakmap = isie11 ? ie11fingerprint(weakmapmethods) : tagtester('weakmap');

  var isset = isie11 ? ie11fingerprint(setmethods) : tagtester('set');

  var isweakset = tagtester('weakset');

  // retrieve the values of an object's properties.
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[_keys[i]];
    }
    return values;
  }

  // convert an object into a list of `[key, value]` pairs.
  // the opposite of `_.object` with one argument.
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
  }

  // invert the keys and values of an object. the values must be serializable.
  function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result[obj[_keys[i]]] = _keys[i];
    }
    return result;
  }

  // return a sorted list of the function names available on the object.
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isfunction$1(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // an internal function for creating assigner functions.
  function createassigner(keysfunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysfunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // extend a given object with all the properties in passed-in object(s).
  var extend = createassigner(allkeys);

  // assigns a given object with all the own properties in the passed-in
  // object(s).
  // (https://developer.mozilla.org/docs/web/javascript/reference/global_objects/object/assign)
  var extendown = createassigner(keys);

  // fill in a given object with default properties.
  var defaults = createassigner(allkeys, true);

  // create a naked function reference for surrogate-prototype-swapping.
  function ctor() {
    return function(){};
  }

  // an internal function for creating a new object that inherits from another.
  function basecreate(prototype) {
    if (!isobject(prototype)) return {};
    if (nativecreate) return nativecreate(prototype);
    var ctor = ctor();
    ctor.prototype = prototype;
    var result = new ctor;
    ctor.prototype = null;
    return result;
  }

  // creates an object that inherits from the given prototype object.
  // if additional properties are provided then they will be added to the
  // created object.
  function create(prototype, props) {
    var result = basecreate(prototype);
    if (props) extendown(result, props);
    return result;
  }

  // create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (!isobject(obj)) return obj;
    return isarray(obj) ? obj.slice() : extend({}, obj);
  }

  // invokes `interceptor` with the `obj` and then returns `obj`.
  // the primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // normalize a (deep) property `path` to array.
  // like `_.iteratee`, this function can be customized.
  function topath$1(path) {
    return isarray(path) ? path : [path];
  }
  _$1.topath = topath$1;

  // internal wrapper for `_.topath` to enable minification.
  // similar to `cb` for `_.iteratee`.
  function topath(path) {
    return _$1.topath(path);
  }

  // internal function to obtain a nested property in `obj` along `path`.
  function deepget(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // get the value of the (deep) property on `path` from `object`.
  // if any property in `path` does not exist or if the value is
  // `undefined`, return `defaultvalue` instead.
  // the `path` is normalized through `_.topath`.
  function get(object, path, defaultvalue) {
    var value = deepget(object, topath(path));
    return isundefined(value) ? defaultvalue : value;
  }

  // shortcut function for checking if an object has a given property directly on
  // itself (in other words, not on a prototype). unlike the internal `has`
  // function, this public version can also traverse nested properties.
  function has(obj, path) {
    path = topath(path);
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (!has$1(obj, key)) return false;
      obj = obj[key];
    }
    return !!length;
  }

  // keep the identity function around for default iteratees.
  function identity(value) {
    return value;
  }

  // returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  function matcher(attrs) {
    attrs = extendown({}, attrs);
    return function(obj) {
      return ismatch(obj, attrs);
    };
  }

  // creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indices.
  function property(path) {
    path = topath(path);
    return function(obj) {
      return deepget(obj, path);
    };
  }

  // internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other underscore
  // functions.
  function optimizecb(func, context, argcount) {
    if (context === void 0) return func;
    switch (argcount == null ? 3 : argcount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // the 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // an internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `_.identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  function baseiteratee(value, context, argcount) {
    if (value == null) return identity;
    if (isfunction$1(value)) return optimizecb(value, context, argcount);
    if (isobject(value) && !isarray(value)) return matcher(value);
    return property(value);
  }

  // external wrapper for our callback generator. users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // this abstraction hides the internal-only `argcount` argument.
  function iteratee(value, context) {
    return baseiteratee(value, context, infinity);
  }
  _$1.iteratee = iteratee;

  // the function we call internally to generate a callback. it invokes
  // `_.iteratee` if overridden, otherwise `baseiteratee`.
  function cb(value, context, argcount) {
    if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
    return baseiteratee(value, context, argcount);
  }

  // returns the results of applying the `iteratee` to each element of `obj`.
  // in contrast to `_.map` it returns an object.
  function mapobject(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = keys(obj),
        length = _keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentkey = _keys[index];
      results[currentkey] = iteratee(obj[currentkey], currentkey, obj);
    }
    return results;
  }

  // predicate-generating function. often useful outside of underscore.
  function noop(){}

  // generates a function for a given object that returns a given property.
  function propertyof(obj) {
    if (obj == null) return noop;
    return function(path) {
      return get(obj, path);
    };
  }

  // run a function **n** times.
  function times(n, iteratee, context) {
    var accum = array(math.max(0, n));
    iteratee = optimizecb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  // return a random integer between `min` and `max` (inclusive).
  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + math.floor(math.random() * (max - min + 1));
  }

  // a (possibly faster) way to get the current timestamp as an integer.
  var now = date.now || function() {
    return new date().gettime();
  };

  // internal helper to generate functions for escaping and unescaping strings
  // to/from html interpolation.
  function createescaper(map) {
    var escaper = function(match) {
      return map[match];
    };
    // regexes for identifying a key that needs to be escaped.
    var source = '(?:' + keys(map).join('|') + ')';
    var testregexp = regexp(source);
    var replaceregexp = regexp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testregexp.test(string) ? string.replace(replaceregexp, escaper) : string;
    };
  }

  // internal list of html entities for escaping.
  var escapemap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  // function for escaping strings to html interpolation.
  var _escape = createescaper(escapemap);

  // internal list of html entities for unescaping.
  var unescapemap = invert(escapemap);

  // function for unescaping strings from html interpolation.
  var _unescape = createescaper(unescapemap);

  // by default, underscore uses erb-style template delimiters. change the
  // following template settings to use alternative delimiters.
  var templatesettings = _$1.templatesettings = {
    evaluate: /<%([\s\s]+?)%>/g,
    interpolate: /<%=([\s\s]+?)%>/g,
    escape: /<%-([\s\s]+?)%>/g
  };

  // when customizing `_.templatesettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var nomatch = /(.)^/;

  // certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaperegexp = /\\|'|\r|\n|\u2028|\u2029/g;

  function escapechar(match) {
    return '\\' + escapes[match];
  }

  // in order to prevent third-party code injection through
  // `_.templatesettings.variable`, we test it against the following regular
  // expression. it is intentionally a bit more liberal than just matching valid
  // identifiers, but still prevents possible loopholes through defaults or
  // destructuring assignment.
  var bareidentifier = /^\s*(\w|\$)+\s*$/;

  // javascript micro-templating, similar to john resig's implementation.
  // underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // nb: `oldsettings` only exists for backwards compatibility.
  function template(text, settings, oldsettings) {
    if (!settings && oldsettings) settings = oldsettings;
    settings = defaults({}, settings, _$1.templatesettings);

    // combine delimiters into one regular expression via alternation.
    var matcher = regexp([
      (settings.escape || nomatch).source,
      (settings.interpolate || nomatch).source,
      (settings.evaluate || nomatch).source
    ].join('|') + '|$', 'g');

    // compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaperegexp, escapechar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // adobe vms need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    var argument = settings.variable;
    if (argument) {
      // insure against third-party code injection. (cve-2021-23358)
      if (!bareidentifier.test(argument)) throw new error(
        'variable is not a bare identifier: ' + argument
      );
    } else {
      // if a variable is not specified, place data values in local scope.
      source = 'with(obj||{}){\n' + source + '}\n';
      argument = 'obj';
    }

    source = "var __t,__p='',__j=array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new function(argument, '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _$1);
    };

    // provide the compiled source as a convenience for precompilation.
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }

  // traverses the children of `obj` along `path`. if a child is a function, it
  // is invoked with its parent as context. returns the value of the final
  // child, or `fallback` if any child is undefined.
  function result(obj, path, fallback) {
    path = topath(path);
    var length = path.length;
    if (!length) {
      return isfunction$1(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // ensure we don't continue iterating.
      }
      obj = isfunction$1(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // generate a unique integer id (unique within the entire client session).
  // useful for temporary dom ids.
  var idcounter = 0;
  function uniqueid(prefix) {
    var id = ++idcounter + '';
    return prefix ? prefix + id : id;
  }

  // start chaining a wrapped underscore object.
  function chain(obj) {
    var instance = _$1(obj);
    instance._chain = true;
    return instance;
  }

  // internal function to execute `sourcefunc` bound to `context` with optional
  // `args`. determines whether to execute a function as a constructor or as a
  // normal function.
  function executebound(sourcefunc, boundfunc, context, callingcontext, args) {
    if (!(callingcontext instanceof boundfunc)) return sourcefunc.apply(context, args);
    var self = basecreate(sourcefunc.prototype);
    var result = sourcefunc.apply(self, args);
    if (isobject(result)) return result;
    return self;
  }

  // partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. `_` acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. set `_.partial.placeholder` for a custom placeholder argument.
  var partial = restarguments(function(func, boundargs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundargs.length;
      var args = array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundargs[i] === placeholder ? arguments[position++] : boundargs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executebound(func, bound, this, this, args);
    };
    return bound;
  });

  partial.placeholder = _$1;

  // create a function bound to a given object (assigning `this`, and arguments,
  // optionally).
  var bind = restarguments(function(func, context, args) {
    if (!isfunction$1(func)) throw new typeerror('bind must be called on a function');
    var bound = restarguments(function(callargs) {
      return executebound(func, bound, context, this, args.concat(callargs));
    });
    return bound;
  });

  // internal helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // avoids a very nasty ios 8 jit bug on arm-64. #2094
  var isarraylike = createsizepropertycheck(getlength);

  // internal implementation of a recursive `flatten` function.
  function flatten$1(input, depth, strict, output) {
    output = output || [];
    if (!depth && depth !== 0) {
      depth = infinity;
    } else if (depth <= 0) {
      return output.concat(input);
    }
    var idx = output.length;
    for (var i = 0, length = getlength(input); i < length; i++) {
      var value = input[i];
      if (isarraylike(value) && (isarray(value) || isarguments$1(value))) {
        // flatten current level of array or arguments object.
        if (depth > 1) {
          flatten$1(value, depth - 1, strict, output);
          idx = output.length;
        } else {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // bind a number of an object's methods to that object. remaining arguments
  // are the method names to be bound. useful for ensuring that all callbacks
  // defined on an object belong to it.
  var bindall = restarguments(function(obj, keys) {
    keys = flatten$1(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new error('bindall must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = bind(obj[key], obj);
    }
    return obj;
  });

  // memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  var delay = restarguments(function(func, wait, args) {
    return settimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // defers a function, scheduling it to run after the current call stack has
  // cleared.
  var defer = partial(delay, _$1, 1);

  // returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. to disable execution on the trailing edge, ditto.
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          cleartimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = settimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      cleartimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  // when a sequence of calls of the returned function ends, the argument
  // function is triggered. the end of a sequence is defined by the `wait`
  // parameter. if `immediate` is passed, the argument function will be
  // triggered at the beginning of the sequence instead of at the end.
  function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function() {
      var passed = now() - previous;
      if (wait > passed) {
        timeout = settimeout(later, wait - passed);
      } else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
        // this check is needed because `func` can recursively invoke `debounced`.
        if (!timeout) args = context = null;
      }
    };

    var debounced = restarguments(function(_args) {
      context = this;
      args = _args;
      previous = now();
      if (!timeout) {
        timeout = settimeout(later, wait);
        if (immediate) result = func.apply(context, args);
      }
      return result;
    });

    debounced.cancel = function() {
      cleartimeout(timeout);
      timeout = args = context = null;
    };

    return debounced;
  }

  // returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return partial(wrapper, func);
  }

  // returns a negated version of the passed-in predicate.
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  // returns a function that will only be executed on and after the nth call.
  function after(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // returns a function that will only be executed up to (but not including) the
  // nth call.
  function before(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  }

  // returns a function that will be executed at most one time, no matter how
  // often you call it. useful for lazy initialization.
  var once = partial(before, 2);

  // returns the first key on an object that passes a truth test.
  function findkey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // internal function to generate `_.findindex` and `_.findlastindex`.
  function createpredicateindexfinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getlength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // returns the first index on an array-like that passes a truth test.
  var findindex = createpredicateindexfinder(1);

  // returns the last index on an array-like that passes a truth test.
  var findlastindex = createpredicateindexfinder(-1);

  // use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. uses binary search.
  function sortedindex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getlength(array);
    while (low < high) {
      var mid = math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  }

  // internal function to generate the `_.indexof` and `_.lastindexof` functions.
  function createindexfinder(dir, predicatefind, sortedindex) {
    return function(array, item, idx) {
      var i = 0, length = getlength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : math.max(idx + length, i);
        } else {
          length = idx >= 0 ? math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedindex && idx && length) {
        idx = sortedindex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicatefind(slice.call(array, i, length), isnan$1);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // if the array is large and already in sort order, pass `true`
  // for **issorted** to use binary search.
  var indexof = createindexfinder(1, findindex, sortedindex);

  // return the position of the last occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  var lastindexof = createindexfinder(-1, findlastindex);

  // return the first value which passes a truth test.
  function find(obj, predicate, context) {
    var keyfinder = isarraylike(obj) ? findindex : findkey;
    var key = keyfinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // convenience version of a common use case of `_.find`: getting the first
  // object containing specific `key:value` pairs.
  function findwhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }

  // the cornerstone for collection functions, an `each`
  // implementation, aka `foreach`.
  // handles raw objects in addition to array-likes. treats all
  // sparse array-likes as if they were dense.
  function each(obj, iteratee, context) {
    iteratee = optimizecb(iteratee, context);
    var i, length;
    if (isarraylike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // return the results of applying the iteratee to each element.
  function map(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = !isarraylike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = array(length);
    for (var index = 0; index < length; index++) {
      var currentkey = _keys ? _keys[index] : index;
      results[index] = iteratee(obj[currentkey], currentkey, obj);
    }
    return results;
  }

  // internal helper to create a reducing function, iterating left or right.
  function createreduce(dir) {
    // wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var _keys = !isarraylike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentkey = _keys ? _keys[index] : index;
        memo = iteratee(memo, obj[currentkey], currentkey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizecb(iteratee, context, 4), memo, initial);
    };
  }

  // **reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  var reduce = createreduce(1);

  // the right-associative version of reduce, also known as `foldr`.
  var reduceright = createreduce(-1);

  // return all the elements that pass a truth test.
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // return all the elements for which a truth test fails.
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }

  // determine whether all of the elements pass a truth test.
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isarraylike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentkey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentkey], currentkey, obj)) return false;
    }
    return true;
  }

  // determine if at least one element in the object passes a truth test.
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isarraylike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentkey = _keys ? _keys[index] : index;
      if (predicate(obj[currentkey], currentkey, obj)) return true;
    }
    return false;
  }

  // determine if the array or object contains a given item (using `===`).
  function contains(obj, item, fromindex, guard) {
    if (!isarraylike(obj)) obj = values(obj);
    if (typeof fromindex != 'number' || guard) fromindex = 0;
    return indexof(obj, item, fromindex) >= 0;
  }

  // invoke a method (with arguments) on every item in a collection.
  var invoke = restarguments(function(obj, path, args) {
    var contextpath, func;
    if (isfunction$1(path)) {
      func = path;
    } else {
      path = topath(path);
      contextpath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextpath && contextpath.length) {
          context = deepget(context, contextpath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // convenience version of a common use case of `_.map`: fetching a property.
  function pluck(obj, key) {
    return map(obj, property(key));
  }

  // convenience version of a common use case of `_.filter`: selecting only
  // objects containing specific `key:value` pairs.
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }

  // return the maximum element (or element-based computation).
  function max(obj, iteratee, context) {
    var result = -infinity, lastcomputed = -infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
      obj = isarraylike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastcomputed || (computed === -infinity && result === -infinity)) {
          result = v;
          lastcomputed = computed;
        }
      });
    }
    return result;
  }

  // return the minimum element (or element-based computation).
  function min(obj, iteratee, context) {
    var result = infinity, lastcomputed = infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
      obj = isarraylike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastcomputed || (computed === infinity && result === infinity)) {
          result = v;
          lastcomputed = computed;
        }
      });
    }
    return result;
  }

  // safely create a real, live array from anything iterable.
  var restrsymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  function toarray(obj) {
    if (!obj) return [];
    if (isarray(obj)) return slice.call(obj);
    if (isstring(obj)) {
      // keep surrogate pair characters together.
      return obj.match(restrsymbol);
    }
    if (isarraylike(obj)) return map(obj, identity);
    return values(obj);
  }

  // sample **n** random values from a collection using the modern version of the
  // [fisher-yates shuffle](https://en.wikipedia.org/wiki/fisher–yates_shuffle).
  // if **n** is not specified, returns a single random element.
  // the internal `guard` argument allows it to work with `_.map`.
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isarraylike(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample = toarray(obj);
    var length = getlength(sample);
    n = math.max(math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  }

  // shuffle a collection.
  function shuffle(obj) {
    return sample(obj, infinity);
  }

  // sort the object's values by a criterion produced by an iteratee.
  function sortby(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return pluck(map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  }

  // an internal function used for aggregate "group by" operations.
  function group(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  }

  // groups the object's values by a criterion. pass either a string attribute
  // to group by, or a function that returns the criterion.
  var groupby = group(function(result, value, key) {
    if (has$1(result, key)) result[key].push(value); else result[key] = [value];
  });

  // indexes the object's values by a criterion, similar to `_.groupby`, but for
  // when you know that your index values will be unique.
  var indexby = group(function(result, value, key) {
    result[key] = value;
  });

  // counts instances of an object that group by a certain criterion. pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  var countby = group(function(result, value, key) {
    if (has$1(result, key)) result[key]++; else result[key] = 1;
  });

  // split a collection into two arrays: one whose elements all pass the given
  // truth test, and one whose elements all do not pass the truth test.
  var partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // return the number of elements in a collection.
  function size(obj) {
    if (obj == null) return 0;
    return isarraylike(obj) ? obj.length : keys(obj).length;
  }

  // internal `_.pick` helper function to determine whether `key` is an enumerable
  // property name of `obj`.
  function keyinobj(value, key, obj) {
    return key in obj;
  }

  // return a copy of the object only containing the allowed properties.
  var pick = restarguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (isfunction$1(iteratee)) {
      if (keys.length > 1) iteratee = optimizecb(iteratee, keys[1]);
      keys = allkeys(obj);
    } else {
      iteratee = keyinobj;
      keys = flatten$1(keys, false, false);
      obj = object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // return a copy of the object without the disallowed properties.
  var omit = restarguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (isfunction$1(iteratee)) {
      iteratee = negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = map(flatten$1(keys, false, false), string);
      iteratee = function(value, key) {
        return !contains(keys, key);
      };
    }
    return pick(obj, iteratee, context);
  });

  // returns everything but the last entry of the array. especially useful on
  // the arguments object. passing **n** will return all the values in
  // the array, excluding the last n.
  function initial(array, n, guard) {
    return slice.call(array, 0, math.max(0, array.length - (n == null || guard ? 1 : n)));
  }

  // get the first element of an array. passing **n** will return the first n
  // values in the array. the **guard** check allows it to work with `_.map`.
  function first(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[0];
    return initial(array, array.length - n);
  }

  // returns everything but the first entry of the `array`. especially useful on
  // the `arguments` object. passing an **n** will return the rest n values in the
  // `array`.
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }

  // get the last element of an array. passing **n** will return the last n
  // values in the array.
  function last(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return rest(array, math.max(0, array.length - n));
  }

  // trim out all falsy values from an array.
  function compact(array) {
    return filter(array, boolean);
  }

  // flatten out an array, either recursively (by default), or up to `depth`.
  // passing `true` or `false` as `depth` means `1` or `infinity`, respectively.
  function flatten(array, depth) {
    return flatten$1(array, depth, false);
  }

  // take the difference between one array and a number of other arrays.
  // only the elements present in just the first array will remain.
  var difference = restarguments(function(array, rest) {
    rest = flatten$1(rest, true, true);
    return filter(array, function(value){
      return !contains(rest, value);
    });
  });

  // return a version of the array that does not contain the specified value(s).
  var without = restarguments(function(array, otherarrays) {
    return difference(array, otherarrays);
  });

  // produce a duplicate-free version of the array. if the array has already
  // been sorted, you have the option of using a faster algorithm.
  // the faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  function uniq(array, issorted, iteratee, context) {
    if (!isboolean(issorted)) {
      context = iteratee;
      iteratee = issorted;
      issorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getlength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (issorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }

  // produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  var union = restarguments(function(arrays) {
    return uniq(flatten$1(arrays, true, true));
  });

  // produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersection(array) {
    var result = [];
    var argslength = arguments.length;
    for (var i = 0, length = getlength(array); i < length; i++) {
      var item = array[i];
      if (contains(result, item)) continue;
      var j;
      for (j = 1; j < argslength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argslength) result.push(item);
    }
    return result;
  }

  // complement of zip. unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  function unzip(array) {
    var length = (array && max(array, getlength).length) || 0;
    var result = array(length);

    for (var index = 0; index < length; index++) {
      result[index] = pluck(array, index);
    }
    return result;
  }

  // zip together multiple lists into a single array -- elements that share
  // an index go together.
  var zip = restarguments(unzip);

  // converts lists into objects. pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. passing by pairs is the reverse of `_.pairs`.
  function object(list, values) {
    var result = {};
    for (var i = 0, length = getlength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  }

  // generate an integer array containing an arithmetic progression. a port of
  // the native python `range()` function. see
  // [the python documentation](https://docs.python.org/library/functions.html#range).
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = math.max(math.ceil((stop - start) / step), 0);
    var range = array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  // chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  function chunk(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  }

  // helper function to continue chaining intermediate results.
  function chainresult(instance, obj) {
    return instance._chain ? _$1(obj).chain() : obj;
  }

  // add your own custom functions to the underscore object.
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _$1[name] = obj[name];
      _$1.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainresult(this, func.apply(_$1, args));
      };
    });
    return _$1;
  }

  // add all mutator `array` functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = arrayproto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) {
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) {
          delete obj[0];
        }
      }
      return chainresult(this, obj);
    };
  });

  // add all accessor `array` functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = arrayproto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) obj = method.apply(obj, arguments);
      return chainresult(this, obj);
    };
  });

  // named exports

  var allexports = {
    __proto__: null,
    version: version,
    restarguments: restarguments,
    isobject: isobject,
    isnull: isnull,
    isundefined: isundefined,
    isboolean: isboolean,
    iselement: iselement,
    isstring: isstring,
    isnumber: isnumber,
    isdate: isdate,
    isregexp: isregexp,
    iserror: iserror,
    issymbol: issymbol,
    isarraybuffer: isarraybuffer,
    isdataview: isdataview$1,
    isarray: isarray,
    isfunction: isfunction$1,
    isarguments: isarguments$1,
    isfinite: isfinite$1,
    isnan: isnan$1,
    istypedarray: istypedarray$1,
    isempty: isempty,
    ismatch: ismatch,
    isequal: isequal,
    ismap: ismap,
    isweakmap: isweakmap,
    isset: isset,
    isweakset: isweakset,
    keys: keys,
    allkeys: allkeys,
    values: values,
    pairs: pairs,
    invert: invert,
    functions: functions,
    methods: functions,
    extend: extend,
    extendown: extendown,
    assign: extendown,
    defaults: defaults,
    create: create,
    clone: clone,
    tap: tap,
    get: get,
    has: has,
    mapobject: mapobject,
    identity: identity,
    constant: constant,
    noop: noop,
    topath: topath$1,
    property: property,
    propertyof: propertyof,
    matcher: matcher,
    matches: matcher,
    times: times,
    random: random,
    now: now,
    escape: _escape,
    unescape: _unescape,
    templatesettings: templatesettings,
    template: template,
    result: result,
    uniqueid: uniqueid,
    chain: chain,
    iteratee: iteratee,
    partial: partial,
    bind: bind,
    bindall: bindall,
    memoize: memoize,
    delay: delay,
    defer: defer,
    throttle: throttle,
    debounce: debounce,
    wrap: wrap,
    negate: negate,
    compose: compose,
    after: after,
    before: before,
    once: once,
    findkey: findkey,
    findindex: findindex,
    findlastindex: findlastindex,
    sortedindex: sortedindex,
    indexof: indexof,
    lastindexof: lastindexof,
    find: find,
    detect: find,
    findwhere: findwhere,
    each: each,
    foreach: each,
    map: map,
    collect: map,
    reduce: reduce,
    foldl: reduce,
    inject: reduce,
    reduceright: reduceright,
    foldr: reduceright,
    filter: filter,
    select: filter,
    reject: reject,
    every: every,
    all: every,
    some: some,
    any: some,
    contains: contains,
    includes: contains,
    include: contains,
    invoke: invoke,
    pluck: pluck,
    where: where,
    max: max,
    min: min,
    shuffle: shuffle,
    sample: sample,
    sortby: sortby,
    groupby: groupby,
    indexby: indexby,
    countby: countby,
    partition: partition,
    toarray: toarray,
    size: size,
    pick: pick,
    omit: omit,
    first: first,
    head: first,
    take: first,
    initial: initial,
    last: last,
    rest: rest,
    tail: rest,
    drop: rest,
    compact: compact,
    flatten: flatten,
    without: without,
    uniq: uniq,
    unique: uniq,
    union: union,
    intersection: intersection,
    difference: difference,
    unzip: unzip,
    transpose: unzip,
    zip: zip,
    object: object,
    range: range,
    chunk: chunk,
    mixin: mixin,
    'default': _$1
  };

  // default export

  // add all of the underscore functions to the wrapper object.
  var _ = mixin(allexports);
  // legacy node.js api.
  _._ = _;

  return _;

})));


