(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new error("cannot find module '"+i+"'");throw a.code="module_not_found",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') {
    throw typeerror(string(it) + ' is not a function');
  } return it;
};

},{}],2:[function(require,module,exports){
var isobject = require('../internals/is-object');

module.exports = function (it) {
  if (!isobject(it) && it !== null) {
    throw typeerror("can't set " + string(it) + ' as a prototype');
  } return it;
};

},{"../internals/is-object":37}],3:[function(require,module,exports){
var wellknownsymbol = require('../internals/well-known-symbol');
var create = require('../internals/object-create');
var definepropertymodule = require('../internals/object-define-property');

var unscopables = wellknownsymbol('unscopables');
var arrayprototype = array.prototype;

// array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (arrayprototype[unscopables] == undefined) {
  definepropertymodule.f(arrayprototype, unscopables, {
    configurable: true,
    value: create(null)
  });
}

// add a key to array.prototype[@@unscopables]
module.exports = function (key) {
  arrayprototype[unscopables][key] = true;
};

},{"../internals/object-create":45,"../internals/object-define-property":47,"../internals/well-known-symbol":77}],4:[function(require,module,exports){
module.exports = function (it, constructor, name) {
  if (!(it instanceof constructor)) {
    throw typeerror('incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

},{}],5:[function(require,module,exports){
var isobject = require('../internals/is-object');

module.exports = function (it) {
  if (!isobject(it)) {
    throw typeerror(string(it) + ' is not an object');
  } return it;
};

},{"../internals/is-object":37}],6:[function(require,module,exports){
'use strict';
var bind = require('../internals/function-bind-context');
var toobject = require('../internals/to-object');
var callwithsafeiterationclosing = require('../internals/call-with-safe-iteration-closing');
var isarrayiteratormethod = require('../internals/is-array-iterator-method');
var tolength = require('../internals/to-length');
var createproperty = require('../internals/create-property');
var getiteratormethod = require('../internals/get-iterator-method');

// `array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arraylike /* , mapfn = undefined, thisarg = undefined */) {
  var o = toobject(arraylike);
  var c = typeof this == 'function' ? this : array;
  var argumentslength = arguments.length;
  var mapfn = argumentslength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratormethod = getiteratormethod(o);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentslength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratormethod != undefined && !(c == array && isarrayiteratormethod(iteratormethod))) {
    iterator = iteratormethod.call(o);
    next = iterator.next;
    result = new c();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callwithsafeiterationclosing(iterator, mapfn, [step.value, index], true) : step.value;
      createproperty(result, index, value);
    }
  } else {
    length = tolength(o.length);
    result = new c(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(o[index], index) : o[index];
      createproperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

},{"../internals/call-with-safe-iteration-closing":8,"../internals/create-property":16,"../internals/function-bind-context":23,"../internals/get-iterator-method":25,"../internals/is-array-iterator-method":35,"../internals/to-length":71,"../internals/to-object":72}],7:[function(require,module,exports){
var toindexedobject = require('../internals/to-indexed-object');
var tolength = require('../internals/to-length');
var toabsoluteindex = require('../internals/to-absolute-index');

// `array.prototype.{ indexof, includes }` methods implementation
var createmethod = function (is_includes) {
  return function ($this, el, fromindex) {
    var o = toindexedobject($this);
    var length = tolength(o.length);
    var index = toabsoluteindex(fromindex, length);
    var value;
    // array#includes uses samevaluezero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (is_includes && el != el) while (length > index) {
      value = o[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // array#indexof ignores holes, array#includes - not
    } else for (;length > index; index++) {
      if ((is_includes || index in o) && o[index] === el) return is_includes || index || 0;
    } return !is_includes && -1;
  };
};

module.exports = {
  // `array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createmethod(true),
  // `array.prototype.indexof` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexof: createmethod(false)
};

},{"../internals/to-absolute-index":68,"../internals/to-indexed-object":69,"../internals/to-length":71}],8:[function(require,module,exports){
var anobject = require('../internals/an-object');

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anobject(value)[0], value[1]) : fn(value);
  // 7.4.6 iteratorclose(iterator, completion)
  } catch (error) {
    var returnmethod = iterator['return'];
    if (returnmethod !== undefined) anobject(returnmethod.call(iterator));
    throw error;
  }
};

},{"../internals/an-object":5}],9:[function(require,module,exports){
var tostring = {}.tostring;

module.exports = function (it) {
  return tostring.call(it).slice(8, -1);
};

},{}],10:[function(require,module,exports){
var to_string_tag_support = require('../internals/to-string-tag-support');
var classofraw = require('../internals/classof-raw');
var wellknownsymbol = require('../internals/well-known-symbol');

var to_string_tag = wellknownsymbol('tostringtag');
// es3 wrong here
var correct_arguments = classofraw(function () { return arguments; }()) == 'arguments';

// fallback for ie11 script access denied error
var tryget = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from es6+ `object.prototype.tostring`
module.exports = to_string_tag_support ? classofraw : function (it) {
  var o, tag, result;
  return it === undefined ? 'undefined' : it === null ? 'null'
    // @@tostringtag case
    : typeof (tag = tryget(o = object(it), to_string_tag)) == 'string' ? tag
    // builtintag case
    : correct_arguments ? classofraw(o)
    // es3 arguments fallback
    : (result = classofraw(o)) == 'object' && typeof o.callee == 'function' ? 'arguments' : result;
};

},{"../internals/classof-raw":9,"../internals/to-string-tag-support":74,"../internals/well-known-symbol":77}],11:[function(require,module,exports){
var has = require('../internals/has');
var ownkeys = require('../internals/own-keys');
var getownpropertydescriptormodule = require('../internals/object-get-own-property-descriptor');
var definepropertymodule = require('../internals/object-define-property');

module.exports = function (target, source) {
  var keys = ownkeys(source);
  var defineproperty = definepropertymodule.f;
  var getownpropertydescriptor = getownpropertydescriptormodule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineproperty(target, key, getownpropertydescriptor(source, key));
  }
};

},{"../internals/has":28,"../internals/object-define-property":47,"../internals/object-get-own-property-descriptor":48,"../internals/own-keys":56}],12:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !fails(function () {
  function f() { /* empty */ }
  f.prototype.constructor = null;
  return object.getprototypeof(new f()) !== f.prototype;
});

},{"../internals/fails":22}],13:[function(require,module,exports){
'use strict';
var iteratorprototype = require('../internals/iterators-core').iteratorprototype;
var create = require('../internals/object-create');
var createpropertydescriptor = require('../internals/create-property-descriptor');
var settostringtag = require('../internals/set-to-string-tag');
var iterators = require('../internals/iterators');

var returnthis = function () { return this; };

module.exports = function (iteratorconstructor, name, next) {
  var to_string_tag = name + ' iterator';
  iteratorconstructor.prototype = create(iteratorprototype, { next: createpropertydescriptor(1, next) });
  settostringtag(iteratorconstructor, to_string_tag, false, true);
  iterators[to_string_tag] = returnthis;
  return iteratorconstructor;
};

},{"../internals/create-property-descriptor":15,"../internals/iterators":40,"../internals/iterators-core":39,"../internals/object-create":45,"../internals/set-to-string-tag":62}],14:[function(require,module,exports){
var descriptors = require('../internals/descriptors');
var definepropertymodule = require('../internals/object-define-property');
var createpropertydescriptor = require('../internals/create-property-descriptor');

module.exports = descriptors ? function (object, key, value) {
  return definepropertymodule.f(object, key, createpropertydescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":15,"../internals/descriptors":18,"../internals/object-define-property":47}],15:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],16:[function(require,module,exports){
'use strict';
var toprimitive = require('../internals/to-primitive');
var definepropertymodule = require('../internals/object-define-property');
var createpropertydescriptor = require('../internals/create-property-descriptor');

module.exports = function (object, key, value) {
  var propertykey = toprimitive(key);
  if (propertykey in object) definepropertymodule.f(object, propertykey, createpropertydescriptor(0, value));
  else object[propertykey] = value;
};

},{"../internals/create-property-descriptor":15,"../internals/object-define-property":47,"../internals/to-primitive":73}],17:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var createiteratorconstructor = require('../internals/create-iterator-constructor');
var getprototypeof = require('../internals/object-get-prototype-of');
var setprototypeof = require('../internals/object-set-prototype-of');
var settostringtag = require('../internals/set-to-string-tag');
var createnonenumerableproperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var wellknownsymbol = require('../internals/well-known-symbol');
var is_pure = require('../internals/is-pure');
var iterators = require('../internals/iterators');
var iteratorscore = require('../internals/iterators-core');

var iteratorprototype = iteratorscore.iteratorprototype;
var buggy_safari_iterators = iteratorscore.buggy_safari_iterators;
var iterator = wellknownsymbol('iterator');
var keys = 'keys';
var values = 'values';
var entries = 'entries';

var returnthis = function () { return this; };

module.exports = function (iterable, name, iteratorconstructor, next, default, is_set, forced) {
  createiteratorconstructor(iteratorconstructor, name, next);

  var getiterationmethod = function (kind) {
    if (kind === default && defaultiterator) return defaultiterator;
    if (!buggy_safari_iterators && kind in iterableprototype) return iterableprototype[kind];
    switch (kind) {
      case keys: return function keys() { return new iteratorconstructor(this, kind); };
      case values: return function values() { return new iteratorconstructor(this, kind); };
      case entries: return function entries() { return new iteratorconstructor(this, kind); };
    } return function () { return new iteratorconstructor(this); };
  };

  var to_string_tag = name + ' iterator';
  var incorrect_values_name = false;
  var iterableprototype = iterable.prototype;
  var nativeiterator = iterableprototype[iterator]
    || iterableprototype['@@iterator']
    || default && iterableprototype[default];
  var defaultiterator = !buggy_safari_iterators && nativeiterator || getiterationmethod(default);
  var anynativeiterator = name == 'array' ? iterableprototype.entries || nativeiterator : nativeiterator;
  var currentiteratorprototype, methods, key;

  // fix native
  if (anynativeiterator) {
    currentiteratorprototype = getprototypeof(anynativeiterator.call(new iterable()));
    if (iteratorprototype !== object.prototype && currentiteratorprototype.next) {
      if (!is_pure && getprototypeof(currentiteratorprototype) !== iteratorprototype) {
        if (setprototypeof) {
          setprototypeof(currentiteratorprototype, iteratorprototype);
        } else if (typeof currentiteratorprototype[iterator] != 'function') {
          createnonenumerableproperty(currentiteratorprototype, iterator, returnthis);
        }
      }
      // set @@tostringtag to native iterators
      settostringtag(currentiteratorprototype, to_string_tag, true, true);
      if (is_pure) iterators[to_string_tag] = returnthis;
    }
  }

  // fix array#{values, @@iterator}.name in v8 / ff
  if (default == values && nativeiterator && nativeiterator.name !== values) {
    incorrect_values_name = true;
    defaultiterator = function values() { return nativeiterator.call(this); };
  }

  // define iterator
  if ((!is_pure || forced) && iterableprototype[iterator] !== defaultiterator) {
    createnonenumerableproperty(iterableprototype, iterator, defaultiterator);
  }
  iterators[name] = defaultiterator;

  // export additional methods
  if (default) {
    methods = {
      values: getiterationmethod(values),
      keys: is_set ? defaultiterator : getiterationmethod(keys),
      entries: getiterationmethod(entries)
    };
    if (forced) for (key in methods) {
      if (buggy_safari_iterators || incorrect_values_name || !(key in iterableprototype)) {
        redefine(iterableprototype, key, methods[key]);
      }
    } else $({ target: name, proto: true, forced: buggy_safari_iterators || incorrect_values_name }, methods);
  }

  return methods;
};

},{"../internals/create-iterator-constructor":13,"../internals/create-non-enumerable-property":14,"../internals/export":21,"../internals/is-pure":38,"../internals/iterators":40,"../internals/iterators-core":39,"../internals/object-get-prototype-of":51,"../internals/object-set-prototype-of":55,"../internals/redefine":59,"../internals/set-to-string-tag":62,"../internals/well-known-symbol":77}],18:[function(require,module,exports){
var fails = require('../internals/fails');

// thank's ie8 for his funny defineproperty
module.exports = !fails(function () {
  return object.defineproperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

},{"../internals/fails":22}],19:[function(require,module,exports){
var global = require('../internals/global');
var isobject = require('../internals/is-object');

var document = global.document;
// typeof document.createelement is 'object' in old ie
var exists = isobject(document) && isobject(document.createelement);

module.exports = function (it) {
  return exists ? document.createelement(it) : {};
};

},{"../internals/global":27,"../internals/is-object":37}],20:[function(require,module,exports){
// ie8- don't enum bug keys
module.exports = [
  'constructor',
  'hasownproperty',
  'isprototypeof',
  'propertyisenumerable',
  'tolocalestring',
  'tostring',
  'valueof'
];

},{}],21:[function(require,module,exports){
var global = require('../internals/global');
var getownpropertydescriptor = require('../internals/object-get-own-property-descriptor').f;
var createnonenumerableproperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var setglobal = require('../internals/set-global');
var copyconstructorproperties = require('../internals/copy-constructor-properties');
var isforced = require('../internals/is-forced');

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineproperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.notargetget - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var target = options.target;
  var global = options.global;
  var static = options.stat;
  var forced, target, key, targetproperty, sourceproperty, descriptor;
  if (global) {
    target = global;
  } else if (static) {
    target = global[target] || setglobal(target, {});
  } else {
    target = (global[target] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceproperty = source[key];
    if (options.notargetget) {
      descriptor = getownpropertydescriptor(target, key);
      targetproperty = descriptor && descriptor.value;
    } else targetproperty = target[key];
    forced = isforced(global ? key : target + (static ? '.' : '#') + key, options.forced);
    // contained in target
    if (!forced && targetproperty !== undefined) {
      if (typeof sourceproperty === typeof targetproperty) continue;
      copyconstructorproperties(sourceproperty, targetproperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetproperty && targetproperty.sham)) {
      createnonenumerableproperty(sourceproperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceproperty, options);
  }
};

},{"../internals/copy-constructor-properties":11,"../internals/create-non-enumerable-property":14,"../internals/global":27,"../internals/is-forced":36,"../internals/object-get-own-property-descriptor":48,"../internals/redefine":59,"../internals/set-global":61}],22:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],23:[function(require,module,exports){
var afunction = require('../internals/a-function');

// optional / simple context binding
module.exports = function (fn, that, length) {
  afunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"../internals/a-function":1}],24:[function(require,module,exports){
var path = require('../internals/path');
var global = require('../internals/global');

var afunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? afunction(path[namespace]) || afunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};

},{"../internals/global":27,"../internals/path":57}],25:[function(require,module,exports){
var classof = require('../internals/classof');
var iterators = require('../internals/iterators');
var wellknownsymbol = require('../internals/well-known-symbol');

var iterator = wellknownsymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[iterator]
    || it['@@iterator']
    || iterators[classof(it)];
};

},{"../internals/classof":10,"../internals/iterators":40,"../internals/well-known-symbol":77}],26:[function(require,module,exports){
var anobject = require('../internals/an-object');
var getiteratormethod = require('../internals/get-iterator-method');

module.exports = function (it) {
  var iteratormethod = getiteratormethod(it);
  if (typeof iteratormethod != 'function') {
    throw typeerror(string(it) + ' is not iterable');
  } return anobject(iteratormethod.call(it));
};

},{"../internals/an-object":5,"../internals/get-iterator-method":25}],27:[function(require,module,exports){
(function (global){
var check = function (it) {
  return it && it.math == math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalthis == 'object' && globalthis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func
  function('return this')();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
var hasownproperty = {}.hasownproperty;

module.exports = function (it, key) {
  return hasownproperty.call(it, key);
};

},{}],29:[function(require,module,exports){
module.exports = {};

},{}],30:[function(require,module,exports){
var getbuiltin = require('../internals/get-built-in');

module.exports = getbuiltin('document', 'documentelement');

},{"../internals/get-built-in":24}],31:[function(require,module,exports){
var descriptors = require('../internals/descriptors');
var fails = require('../internals/fails');
var createelement = require('../internals/document-create-element');

// thank's ie8 for his funny defineproperty
module.exports = !descriptors && !fails(function () {
  return object.defineproperty(createelement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":18,"../internals/document-create-element":19,"../internals/fails":22}],32:[function(require,module,exports){
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');

var split = ''.split;

// fallback for non-array-like es3 and non-enumerable old v8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !object('z').propertyisenumerable(0);
}) ? function (it) {
  return classof(it) == 'string' ? split.call(it, '') : object(it);
} : object;

},{"../internals/classof-raw":9,"../internals/fails":22}],33:[function(require,module,exports){
var store = require('../internals/shared-store');

var functiontostring = function.tostring;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectsource != 'function') {
  store.inspectsource = function (it) {
    return functiontostring.call(it);
  };
}

module.exports = store.inspectsource;

},{"../internals/shared-store":64}],34:[function(require,module,exports){
var native_weak_map = require('../internals/native-weak-map');
var global = require('../internals/global');
var isobject = require('../internals/is-object');
var createnonenumerableproperty = require('../internals/create-non-enumerable-property');
var objecthas = require('../internals/has');
var sharedkey = require('../internals/shared-key');
var hiddenkeys = require('../internals/hidden-keys');

var weakmap = global.weakmap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterfor = function (type) {
  return function (it) {
    var state;
    if (!isobject(it) || (state = get(it)).type !== type) {
      throw typeerror('incompatible receiver, ' + type + ' required');
    } return state;
  };
};

if (native_weak_map) {
  var store = new weakmap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var state = sharedkey('state');
  hiddenkeys[state] = true;
  set = function (it, metadata) {
    createnonenumerableproperty(it, state, metadata);
    return metadata;
  };
  get = function (it) {
    return objecthas(it, state) ? it[state] : {};
  };
  has = function (it) {
    return objecthas(it, state);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterfor: getterfor
};

},{"../internals/create-non-enumerable-property":14,"../internals/global":27,"../internals/has":28,"../internals/hidden-keys":29,"../internals/is-object":37,"../internals/native-weak-map":43,"../internals/shared-key":63}],35:[function(require,module,exports){
var wellknownsymbol = require('../internals/well-known-symbol');
var iterators = require('../internals/iterators');

var iterator = wellknownsymbol('iterator');
var arrayprototype = array.prototype;

// check on default array iterator
module.exports = function (it) {
  return it !== undefined && (iterators.array === it || arrayprototype[iterator] === it);
};

},{"../internals/iterators":40,"../internals/well-known-symbol":77}],36:[function(require,module,exports){
var fails = require('../internals/fails');

var replacement = /#|\.prototype\./;

var isforced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == polyfill ? true
    : value == native ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isforced.normalize = function (string) {
  return string(string).replace(replacement, '.').tolowercase();
};

var data = isforced.data = {};
var native = isforced.native = 'n';
var polyfill = isforced.polyfill = 'p';

module.exports = isforced;

},{"../internals/fails":22}],37:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],38:[function(require,module,exports){
module.exports = false;

},{}],39:[function(require,module,exports){
'use strict';
var getprototypeof = require('../internals/object-get-prototype-of');
var createnonenumerableproperty = require('../internals/create-non-enumerable-property');
var has = require('../internals/has');
var wellknownsymbol = require('../internals/well-known-symbol');
var is_pure = require('../internals/is-pure');

var iterator = wellknownsymbol('iterator');
var buggy_safari_iterators = false;

var returnthis = function () { return this; };

// `%iteratorprototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var iteratorprototype, prototypeofarrayiteratorprototype, arrayiterator;

if ([].keys) {
  arrayiterator = [].keys();
  // safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayiterator)) buggy_safari_iterators = true;
  else {
    prototypeofarrayiteratorprototype = getprototypeof(getprototypeof(arrayiterator));
    if (prototypeofarrayiteratorprototype !== object.prototype) iteratorprototype = prototypeofarrayiteratorprototype;
  }
}

if (iteratorprototype == undefined) iteratorprototype = {};

// 25.1.2.1.1 %iteratorprototype%[@@iterator]()
if (!is_pure && !has(iteratorprototype, iterator)) {
  createnonenumerableproperty(iteratorprototype, iterator, returnthis);
}

module.exports = {
  iteratorprototype: iteratorprototype,
  buggy_safari_iterators: buggy_safari_iterators
};

},{"../internals/create-non-enumerable-property":14,"../internals/has":28,"../internals/is-pure":38,"../internals/object-get-prototype-of":51,"../internals/well-known-symbol":77}],40:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],41:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !!object.getownpropertysymbols && !fails(function () {
  // chrome 38 symbol has incorrect tostring conversion
  // eslint-disable-next-line no-undef
  return !string(symbol());
});

},{"../internals/fails":22}],42:[function(require,module,exports){
var fails = require('../internals/fails');
var wellknownsymbol = require('../internals/well-known-symbol');
var is_pure = require('../internals/is-pure');

var iterator = wellknownsymbol('iterator');

module.exports = !fails(function () {
  var url = new url('b?a=1&b=2&c=3', 'http://a');
  var searchparams = url.searchparams;
  var result = '';
  url.pathname = 'c%20d';
  searchparams.foreach(function (value, key) {
    searchparams['delete']('b');
    result += key + value;
  });
  return (is_pure && !url.tojson)
    || !searchparams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchparams.get('c') !== '3'
    || string(new urlsearchparams('?a=1')) !== 'a=1'
    || !searchparams[iterator]
    // throws in edge
    || new url('https://a@b').username !== 'a'
    || new urlsearchparams(new urlsearchparams('a=b')).get('a') !== 'b'
    // not punycoded in edge
    || new url('http://ñ‚ðµññ‚').host !== 'xn--e1aybc'
    // not escaped in chrome 62-
    || new url('http://a#ð±').hash !== '#%d0%b1'
    // fails in chrome 66-
    || result !== 'a1c3'
    // throws in safari
    || new url('http://x', undefined).host !== 'x';
});

},{"../internals/fails":22,"../internals/is-pure":38,"../internals/well-known-symbol":77}],43:[function(require,module,exports){
var global = require('../internals/global');
var inspectsource = require('../internals/inspect-source');

var weakmap = global.weakmap;

module.exports = typeof weakmap === 'function' && /native code/.test(inspectsource(weakmap));

},{"../internals/global":27,"../internals/inspect-source":33}],44:[function(require,module,exports){
'use strict';
var descriptors = require('../internals/descriptors');
var fails = require('../internals/fails');
var objectkeys = require('../internals/object-keys');
var getownpropertysymbolsmodule = require('../internals/object-get-own-property-symbols');
var propertyisenumerablemodule = require('../internals/object-property-is-enumerable');
var toobject = require('../internals/to-object');
var indexedobject = require('../internals/indexed-object');

var nativeassign = object.assign;
var defineproperty = object.defineproperty;

// `object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
module.exports = !nativeassign || fails(function () {
  // should have correct order of operations (edge bug)
  if (descriptors && nativeassign({ b: 1 }, nativeassign(defineproperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineproperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (v8 bug)
  var a = {};
  var b = {};
  // eslint-disable-next-line no-undef
  var symbol = symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  a[symbol] = 7;
  alphabet.split('').foreach(function (chr) { b[chr] = chr; });
  return nativeassign({}, a)[symbol] != 7 || objectkeys(nativeassign({}, b)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var t = toobject(target);
  var argumentslength = arguments.length;
  var index = 1;
  var getownpropertysymbols = getownpropertysymbolsmodule.f;
  var propertyisenumerable = propertyisenumerablemodule.f;
  while (argumentslength > index) {
    var s = indexedobject(arguments[index++]);
    var keys = getownpropertysymbols ? objectkeys(s).concat(getownpropertysymbols(s)) : objectkeys(s);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyisenumerable.call(s, key)) t[key] = s[key];
    }
  } return t;
} : nativeassign;

},{"../internals/descriptors":18,"../internals/fails":22,"../internals/indexed-object":32,"../internals/object-get-own-property-symbols":50,"../internals/object-keys":53,"../internals/object-property-is-enumerable":54,"../internals/to-object":72}],45:[function(require,module,exports){
var anobject = require('../internals/an-object');
var defineproperties = require('../internals/object-define-properties');
var enumbugkeys = require('../internals/enum-bug-keys');
var hiddenkeys = require('../internals/hidden-keys');
var html = require('../internals/html');
var documentcreateelement = require('../internals/document-create-element');
var sharedkey = require('../internals/shared-key');

var gt = '>';
var lt = '<';
var prototype = 'prototype';
var script = 'script';
var ie_proto = sharedkey('ie_proto');

var emptyconstructor = function () { /* empty */ };

var scripttag = function (content) {
  return lt + script + gt + content + lt + '/' + script + gt;
};

// create object with fake `null` prototype: use activex object with cleared prototype
var nullprotoobjectviaactivex = function (activexdocument) {
  activexdocument.write(scripttag(''));
  activexdocument.close();
  var temp = activexdocument.parentwindow.object;
  activexdocument = null; // avoid memory leak
  return temp;
};

// create object with fake `null` prototype: use iframe object with cleared prototype
var nullprotoobjectviaiframe = function () {
  // thrash, waste and sodomy: ie gc bug
  var iframe = documentcreateelement('iframe');
  var js = 'java' + script + ':';
  var iframedocument;
  iframe.style.display = 'none';
  html.appendchild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = string(js);
  iframedocument = iframe.contentwindow.document;
  iframedocument.open();
  iframedocument.write(scripttag('document.f=object'));
  iframedocument.close();
  return iframedocument.f;
};

// check for document.domain and active x support
// no need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid ie gc bug
var activexdocument;
var nullprotoobject = function () {
  try {
    /* global activexobject */
    activexdocument = document.domain && new activexobject('htmlfile');
  } catch (error) { /* ignore */ }
  nullprotoobject = activexdocument ? nullprotoobjectviaactivex(activexdocument) : nullprotoobjectviaiframe();
  var length = enumbugkeys.length;
  while (length--) delete nullprotoobject[prototype][enumbugkeys[length]];
  return nullprotoobject();
};

hiddenkeys[ie_proto] = true;

// `object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
module.exports = object.create || function create(o, properties) {
  var result;
  if (o !== null) {
    emptyconstructor[prototype] = anobject(o);
    result = new emptyconstructor();
    emptyconstructor[prototype] = null;
    // add "__proto__" for object.getprototypeof polyfill
    result[ie_proto] = o;
  } else result = nullprotoobject();
  return properties === undefined ? result : defineproperties(result, properties);
};

},{"../internals/an-object":5,"../internals/document-create-element":19,"../internals/enum-bug-keys":20,"../internals/hidden-keys":29,"../internals/html":30,"../internals/object-define-properties":46,"../internals/shared-key":63}],46:[function(require,module,exports){
var descriptors = require('../internals/descriptors');
var definepropertymodule = require('../internals/object-define-property');
var anobject = require('../internals/an-object');
var objectkeys = require('../internals/object-keys');

// `object.defineproperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
module.exports = descriptors ? object.defineproperties : function defineproperties(o, properties) {
  anobject(o);
  var keys = objectkeys(properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definepropertymodule.f(o, key = keys[index++], properties[key]);
  return o;
};

},{"../internals/an-object":5,"../internals/descriptors":18,"../internals/object-define-property":47,"../internals/object-keys":53}],47:[function(require,module,exports){
var descriptors = require('../internals/descriptors');
var ie8_dom_define = require('../internals/ie8-dom-define');
var anobject = require('../internals/an-object');
var toprimitive = require('../internals/to-primitive');

var nativedefineproperty = object.defineproperty;

// `object.defineproperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
exports.f = descriptors ? nativedefineproperty : function defineproperty(o, p, attributes) {
  anobject(o);
  p = toprimitive(p, true);
  anobject(attributes);
  if (ie8_dom_define) try {
    return nativedefineproperty(o, p, attributes);
  } catch (error) { /* empty */ }
  if ('get' in attributes || 'set' in attributes) throw typeerror('accessors not supported');
  if ('value' in attributes) o[p] = attributes.value;
  return o;
};

},{"../internals/an-object":5,"../internals/descriptors":18,"../internals/ie8-dom-define":31,"../internals/to-primitive":73}],48:[function(require,module,exports){
var descriptors = require('../internals/descriptors');
var propertyisenumerablemodule = require('../internals/object-property-is-enumerable');
var createpropertydescriptor = require('../internals/create-property-descriptor');
var toindexedobject = require('../internals/to-indexed-object');
var toprimitive = require('../internals/to-primitive');
var has = require('../internals/has');
var ie8_dom_define = require('../internals/ie8-dom-define');

var nativegetownpropertydescriptor = object.getownpropertydescriptor;

// `object.getownpropertydescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = descriptors ? nativegetownpropertydescriptor : function getownpropertydescriptor(o, p) {
  o = toindexedobject(o);
  p = toprimitive(p, true);
  if (ie8_dom_define) try {
    return nativegetownpropertydescriptor(o, p);
  } catch (error) { /* empty */ }
  if (has(o, p)) return createpropertydescriptor(!propertyisenumerablemodule.f.call(o, p), o[p]);
};

},{"../internals/create-property-descriptor":15,"../internals/descriptors":18,"../internals/has":28,"../internals/ie8-dom-define":31,"../internals/object-property-is-enumerable":54,"../internals/to-indexed-object":69,"../internals/to-primitive":73}],49:[function(require,module,exports){
var internalobjectkeys = require('../internals/object-keys-internal');
var enumbugkeys = require('../internals/enum-bug-keys');

var hiddenkeys = enumbugkeys.concat('length', 'prototype');

// `object.getownpropertynames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = object.getownpropertynames || function getownpropertynames(o) {
  return internalobjectkeys(o, hiddenkeys);
};

},{"../internals/enum-bug-keys":20,"../internals/object-keys-internal":52}],50:[function(require,module,exports){
exports.f = object.getownpropertysymbols;

},{}],51:[function(require,module,exports){
var has = require('../internals/has');
var toobject = require('../internals/to-object');
var sharedkey = require('../internals/shared-key');
var correct_prototype_getter = require('../internals/correct-prototype-getter');

var ie_proto = sharedkey('ie_proto');
var objectprototype = object.prototype;

// `object.getprototypeof` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
module.exports = correct_prototype_getter ? object.getprototypeof : function (o) {
  o = toobject(o);
  if (has(o, ie_proto)) return o[ie_proto];
  if (typeof o.constructor == 'function' && o instanceof o.constructor) {
    return o.constructor.prototype;
  } return o instanceof object ? objectprototype : null;
};

},{"../internals/correct-prototype-getter":12,"../internals/has":28,"../internals/shared-key":63,"../internals/to-object":72}],52:[function(require,module,exports){
var has = require('../internals/has');
var toindexedobject = require('../internals/to-indexed-object');
var indexof = require('../internals/array-includes').indexof;
var hiddenkeys = require('../internals/hidden-keys');

module.exports = function (object, names) {
  var o = toindexedobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in o) !has(hiddenkeys, key) && has(o, key) && result.push(key);
  // don't enum bug & hidden keys
  while (names.length > i) if (has(o, key = names[i++])) {
    ~indexof(result, key) || result.push(key);
  }
  return result;
};

},{"../internals/array-includes":7,"../internals/has":28,"../internals/hidden-keys":29,"../internals/to-indexed-object":69}],53:[function(require,module,exports){
var internalobjectkeys = require('../internals/object-keys-internal');
var enumbugkeys = require('../internals/enum-bug-keys');

// `object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = object.keys || function keys(o) {
  return internalobjectkeys(o, enumbugkeys);
};

},{"../internals/enum-bug-keys":20,"../internals/object-keys-internal":52}],54:[function(require,module,exports){
'use strict';
var nativepropertyisenumerable = {}.propertyisenumerable;
var getownpropertydescriptor = object.getownpropertydescriptor;

// nashorn ~ jdk8 bug
var nashorn_bug = getownpropertydescriptor && !nativepropertyisenumerable.call({ 1: 2 }, 1);

// `object.prototype.propertyisenumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = nashorn_bug ? function propertyisenumerable(v) {
  var descriptor = getownpropertydescriptor(this, v);
  return !!descriptor && descriptor.enumerable;
} : nativepropertyisenumerable;

},{}],55:[function(require,module,exports){
var anobject = require('../internals/an-object');
var apossibleprototype = require('../internals/a-possible-prototype');

// `object.setprototypeof` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// works with __proto__ only. old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = object.setprototypeof || ('__proto__' in {} ? function () {
  var correct_setter = false;
  var test = {};
  var setter;
  try {
    setter = object.getownpropertydescriptor(object.prototype, '__proto__').set;
    setter.call(test, []);
    correct_setter = test instanceof array;
  } catch (error) { /* empty */ }
  return function setprototypeof(o, proto) {
    anobject(o);
    apossibleprototype(proto);
    if (correct_setter) setter.call(o, proto);
    else o.__proto__ = proto;
    return o;
  };
}() : undefined);

},{"../internals/a-possible-prototype":2,"../internals/an-object":5}],56:[function(require,module,exports){
var getbuiltin = require('../internals/get-built-in');
var getownpropertynamesmodule = require('../internals/object-get-own-property-names');
var getownpropertysymbolsmodule = require('../internals/object-get-own-property-symbols');
var anobject = require('../internals/an-object');

// all object keys, includes non-enumerable and symbols
module.exports = getbuiltin('reflect', 'ownkeys') || function ownkeys(it) {
  var keys = getownpropertynamesmodule.f(anobject(it));
  var getownpropertysymbols = getownpropertysymbolsmodule.f;
  return getownpropertysymbols ? keys.concat(getownpropertysymbols(it)) : keys;
};

},{"../internals/an-object":5,"../internals/get-built-in":24,"../internals/object-get-own-property-names":49,"../internals/object-get-own-property-symbols":50}],57:[function(require,module,exports){
var global = require('../internals/global');

module.exports = global;

},{"../internals/global":27}],58:[function(require,module,exports){
var redefine = require('../internals/redefine');

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

},{"../internals/redefine":59}],59:[function(require,module,exports){
var global = require('../internals/global');
var createnonenumerableproperty = require('../internals/create-non-enumerable-property');
var has = require('../internals/has');
var setglobal = require('../internals/set-global');
var inspectsource = require('../internals/inspect-source');
var internalstatemodule = require('../internals/internal-state');

var getinternalstate = internalstatemodule.get;
var enforceinternalstate = internalstatemodule.enforce;
var template = string(string).split('string');

(module.exports = function (o, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var notargetget = options ? !!options.notargetget : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createnonenumerableproperty(value, 'name', key);
    enforceinternalstate(value).source = template.join(typeof key == 'string' ? key : '');
  }
  if (o === global) {
    if (simple) o[key] = value;
    else setglobal(key, value);
    return;
  } else if (!unsafe) {
    delete o[key];
  } else if (!notargetget && o[key]) {
    simple = true;
  }
  if (simple) o[key] = value;
  else createnonenumerableproperty(o, key, value);
// add fake function#tostring for correct work wrapped methods / constructors with methods like lodash isnative
})(function.prototype, 'tostring', function tostring() {
  return typeof this == 'function' && getinternalstate(this).source || inspectsource(this);
});

},{"../internals/create-non-enumerable-property":14,"../internals/global":27,"../internals/has":28,"../internals/inspect-source":33,"../internals/internal-state":34,"../internals/set-global":61}],60:[function(require,module,exports){
// `requireobjectcoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw typeerror("can't call method on " + it);
  return it;
};

},{}],61:[function(require,module,exports){
var global = require('../internals/global');
var createnonenumerableproperty = require('../internals/create-non-enumerable-property');

module.exports = function (key, value) {
  try {
    createnonenumerableproperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/create-non-enumerable-property":14,"../internals/global":27}],62:[function(require,module,exports){
var defineproperty = require('../internals/object-define-property').f;
var has = require('../internals/has');
var wellknownsymbol = require('../internals/well-known-symbol');

var to_string_tag = wellknownsymbol('tostringtag');

module.exports = function (it, tag, static) {
  if (it && !has(it = static ? it : it.prototype, to_string_tag)) {
    defineproperty(it, to_string_tag, { configurable: true, value: tag });
  }
};

},{"../internals/has":28,"../internals/object-define-property":47,"../internals/well-known-symbol":77}],63:[function(require,module,exports){
var shared = require('../internals/shared');
var uid = require('../internals/uid');

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":65,"../internals/uid":75}],64:[function(require,module,exports){
var global = require('../internals/global');
var setglobal = require('../internals/set-global');

var shared = '__core-js_shared__';
var store = global[shared] || setglobal(shared, {});

module.exports = store;

},{"../internals/global":27,"../internals/set-global":61}],65:[function(require,module,exports){
var is_pure = require('../internals/is-pure');
var store = require('../internals/shared-store');

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.4',
  mode: is_pure ? 'pure' : 'global',
  copyright: 'â© 2020 denis pushkarev (zloirock.ru)'
});

},{"../internals/is-pure":38,"../internals/shared-store":64}],66:[function(require,module,exports){
var tointeger = require('../internals/to-integer');
var requireobjectcoercible = require('../internals/require-object-coercible');

// `string.prototype.{ codepointat, at }` methods implementation
var createmethod = function (convert_to_string) {
  return function ($this, pos) {
    var s = string(requireobjectcoercible($this));
    var position = tointeger(pos);
    var size = s.length;
    var first, second;
    if (position < 0 || position >= size) return convert_to_string ? '' : undefined;
    first = s.charcodeat(position);
    return first < 0xd800 || first > 0xdbff || position + 1 === size
      || (second = s.charcodeat(position + 1)) < 0xdc00 || second > 0xdfff
        ? convert_to_string ? s.charat(position) : first
        : convert_to_string ? s.slice(position, position + 2) : (first - 0xd800 << 10) + (second - 0xdc00) + 0x10000;
  };
};

module.exports = {
  // `string.prototype.codepointat` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeat: createmethod(false),
  // `string.prototype.at` method
  // https://github.com/mathiasbynens/string.prototype.at
  charat: createmethod(true)
};

},{"../internals/require-object-coercible":60,"../internals/to-integer":70}],67:[function(require,module,exports){
'use strict';
// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxint = 2147483647; // aka. 0x7fffffff or 2^31-1
var base = 36;
var tmin = 1;
var tmax = 26;
var skew = 38;
var damp = 700;
var initialbias = 72;
var initialn = 128; // 0x80
var delimiter = '-'; // '\x2d'
var regexnonascii = /[^\0-\u007e]/; // non-ascii chars
var regexseparators = /[.\u3002\uff0e\uff61]/g; // rfc 3490 separators
var overflow_error = 'overflow: input needs wider integers to process';
var baseminustmin = base - tmin;
var floor = math.floor;
var stringfromcharcode = string.fromcharcode;

/**
 * creates an array containing the numeric code points of each unicode
 * character in the string. while javascript uses ucs-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * ucs-2 exposes as separate characters) into a single code point,
 * matching utf-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charcodeat(counter++);
    if (value >= 0xd800 && value <= 0xdbff && counter < length) {
      // it's a high surrogate, and there is a next character.
      var extra = string.charcodeat(counter++);
      if ((extra & 0xfc00) == 0xdc00) { // low surrogate.
        output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
      } else {
        // it's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * converts a digit/integer into a basic code point.
 */
var digittobasic = function (digit) {
  //  0..25 map to ascii a..z or a..z
  // 26..35 map to ascii 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * bias adaptation function as per section 3.4 of rfc 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numpoints, firsttime) {
  var k = 0;
  delta = firsttime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numpoints);
  for (; delta > baseminustmin * tmax >> 1; k += base) {
    delta = floor(delta / baseminustmin);
  }
  return floor(k + (baseminustmin + 1) * delta / (delta + skew));
};

/**
 * converts a string of unicode symbols (e.g. a domain name label) to a
 * punycode string of ascii-only symbols.
 */
// eslint-disable-next-line  max-statements
var encode = function (input) {
  var output = [];

  // convert the input in ucs-2 to an array of unicode code points.
  input = ucs2decode(input);

  // cache the length.
  var inputlength = input.length;

  // initialize the state.
  var n = initialn;
  var delta = 0;
  var bias = initialbias;
  var i, currentvalue;

  // handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentvalue = input[i];
    if (currentvalue < 0x80) {
      output.push(stringfromcharcode(currentvalue));
    }
  }

  var basiclength = output.length; // number of basic code points.
  var handledcpcount = basiclength; // number of code points that have been handled;

  // finish the basic string with a delimiter unless it's empty.
  if (basiclength) {
    output.push(delimiter);
  }

  // main encoding loop:
  while (handledcpcount < inputlength) {
    // all non-basic code points < n have been handled already. find the next larger one:
    var m = maxint;
    for (i = 0; i < input.length; i++) {
      currentvalue = input[i];
      if (currentvalue >= n && currentvalue < m) {
        m = currentvalue;
      }
    }

    // increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledcpcountplusone = handledcpcount + 1;
    if (m - n > floor((maxint - delta) / handledcpcountplusone)) {
      throw rangeerror(overflow_error);
    }

    delta += (m - n) * handledcpcountplusone;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentvalue = input[i];
      if (currentvalue < n && ++delta > maxint) {
        throw rangeerror(overflow_error);
      }
      if (currentvalue == n) {
        // represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tmin : (k >= bias + tmax ? tmax : k - bias);
          if (q < t) break;
          var qminust = q - t;
          var baseminust = base - t;
          output.push(stringfromcharcode(digittobasic(t + qminust % baseminust)));
          q = floor(qminust / baseminust);
        }

        output.push(stringfromcharcode(digittobasic(q)));
        bias = adapt(delta, handledcpcountplusone, handledcpcount == basiclength);
        delta = 0;
        ++handledcpcount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

module.exports = function (input) {
  var encoded = [];
  var labels = input.tolowercase().replace(regexseparators, '\u002e').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexnonascii.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};

},{}],68:[function(require,module,exports){
var tointeger = require('../internals/to-integer');

var max = math.max;
var min = math.min;

// helper for a popular repeating case of the spec:
// let integer be ? tointeger(index).
// if integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = tointeger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer":70}],69:[function(require,module,exports){
// toobject with fallback for non-array-like es3 strings
var indexedobject = require('../internals/indexed-object');
var requireobjectcoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return indexedobject(requireobjectcoercible(it));
};

},{"../internals/indexed-object":32,"../internals/require-object-coercible":60}],70:[function(require,module,exports){
var ceil = math.ceil;
var floor = math.floor;

// `tointeger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isnan(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

},{}],71:[function(require,module,exports){
var tointeger = require('../internals/to-integer');

var min = math.min;

// `tolength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(tointeger(argument), 0x1fffffffffffff) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer":70}],72:[function(require,module,exports){
var requireobjectcoercible = require('../internals/require-object-coercible');

// `toobject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return object(requireobjectcoercible(argument));
};

},{"../internals/require-object-coercible":60}],73:[function(require,module,exports){
var isobject = require('../internals/is-object');

// `toprimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the es6 spec version, we didn't implement @@toprimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, preferred_string) {
  if (!isobject(input)) return input;
  var fn, val;
  if (preferred_string && typeof (fn = input.tostring) == 'function' && !isobject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueof) == 'function' && !isobject(val = fn.call(input))) return val;
  if (!preferred_string && typeof (fn = input.tostring) == 'function' && !isobject(val = fn.call(input))) return val;
  throw typeerror("can't convert object to primitive value");
};

},{"../internals/is-object":37}],74:[function(require,module,exports){
var wellknownsymbol = require('../internals/well-known-symbol');

var to_string_tag = wellknownsymbol('tostringtag');
var test = {};

test[to_string_tag] = 'z';

module.exports = string(test) === '[object z]';

},{"../internals/well-known-symbol":77}],75:[function(require,module,exports){
var id = 0;
var postfix = math.random();

module.exports = function (key) {
  return 'symbol(' + string(key === undefined ? '' : key) + ')_' + (++id + postfix).tostring(36);
};

},{}],76:[function(require,module,exports){
var native_symbol = require('../internals/native-symbol');

module.exports = native_symbol
  // eslint-disable-next-line no-undef
  && !symbol.sham
  // eslint-disable-next-line no-undef
  && typeof symbol.iterator == 'symbol';

},{"../internals/native-symbol":41}],77:[function(require,module,exports){
var global = require('../internals/global');
var shared = require('../internals/shared');
var has = require('../internals/has');
var uid = require('../internals/uid');
var native_symbol = require('../internals/native-symbol');
var use_symbol_as_uid = require('../internals/use-symbol-as-uid');

var wellknownsymbolsstore = shared('wks');
var symbol = global.symbol;
var createwellknownsymbol = use_symbol_as_uid ? symbol : symbol && symbol.withoutsetter || uid;

module.exports = function (name) {
  if (!has(wellknownsymbolsstore, name)) {
    if (native_symbol && has(symbol, name)) wellknownsymbolsstore[name] = symbol[name];
    else wellknownsymbolsstore[name] = createwellknownsymbol('symbol.' + name);
  } return wellknownsymbolsstore[name];
};

},{"../internals/global":27,"../internals/has":28,"../internals/native-symbol":41,"../internals/shared":65,"../internals/uid":75,"../internals/use-symbol-as-uid":76}],78:[function(require,module,exports){
'use strict';
var toindexedobject = require('../internals/to-indexed-object');
var addtounscopables = require('../internals/add-to-unscopables');
var iterators = require('../internals/iterators');
var internalstatemodule = require('../internals/internal-state');
var defineiterator = require('../internals/define-iterator');

var array_iterator = 'array iterator';
var setinternalstate = internalstatemodule.set;
var getinternalstate = internalstatemodule.getterfor(array_iterator);

// `array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `createarrayiterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineiterator(array, 'array', function (iterated, kind) {
  setinternalstate(this, {
    type: array_iterator,
    target: toindexedobject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%arrayiteratorprototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getinternalstate(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentslist[@@iterator] is %arrayproto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
iterators.arguments = iterators.array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addtounscopables('keys');
addtounscopables('values');
addtounscopables('entries');

},{"../internals/add-to-unscopables":3,"../internals/define-iterator":17,"../internals/internal-state":34,"../internals/iterators":40,"../internals/to-indexed-object":69}],79:[function(require,module,exports){
'use strict';
var charat = require('../internals/string-multibyte').charat;
var internalstatemodule = require('../internals/internal-state');
var defineiterator = require('../internals/define-iterator');

var string_iterator = 'string iterator';
var setinternalstate = internalstatemodule.set;
var getinternalstate = internalstatemodule.getterfor(string_iterator);

// `string.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineiterator(string, 'string', function (iterated) {
  setinternalstate(this, {
    type: string_iterator,
    string: string(iterated),
    index: 0
  });
// `%stringiteratorprototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getinternalstate(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charat(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

},{"../internals/define-iterator":17,"../internals/internal-state":34,"../internals/string-multibyte":66}],80:[function(require,module,exports){
'use strict';
// todo: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
require('../modules/es.array.iterator');
var $ = require('../internals/export');
var getbuiltin = require('../internals/get-built-in');
var use_native_url = require('../internals/native-url');
var redefine = require('../internals/redefine');
var redefineall = require('../internals/redefine-all');
var settostringtag = require('../internals/set-to-string-tag');
var createiteratorconstructor = require('../internals/create-iterator-constructor');
var internalstatemodule = require('../internals/internal-state');
var aninstance = require('../internals/an-instance');
var hasown = require('../internals/has');
var bind = require('../internals/function-bind-context');
var classof = require('../internals/classof');
var anobject = require('../internals/an-object');
var isobject = require('../internals/is-object');
var create = require('../internals/object-create');
var createpropertydescriptor = require('../internals/create-property-descriptor');
var getiterator = require('../internals/get-iterator');
var getiteratormethod = require('../internals/get-iterator-method');
var wellknownsymbol = require('../internals/well-known-symbol');

var $fetch = getbuiltin('fetch');
var headers = getbuiltin('headers');
var iterator = wellknownsymbol('iterator');
var url_search_params = 'urlsearchparams';
var url_search_params_iterator = url_search_params + 'iterator';
var setinternalstate = internalstatemodule.set;
var getinternalparamsstate = internalstatemodule.getterfor(url_search_params);
var getinternaliteratorstate = internalstatemodule.getterfor(url_search_params_iterator);

var plus = /\+/g;
var sequences = array(4);

var percentsequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = regexp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentdecode = function (sequence) {
  try {
    return decodeuricomponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeuricomponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentsequence(bytes--), percentdecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7e',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeuricomponent(it).replace(find, replacer);
};

var parsesearchparams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updatesearchparams = function (query) {
  this.entries.length = 0;
  parsesearchparams(this.entries, query);
};

var validateargumentslength = function (passed, required) {
  if (passed < required) throw typeerror('not enough arguments');
};

var urlsearchparamsiterator = createiteratorconstructor(function iterator(params, kind) {
  setinternalstate(this, {
    type: url_search_params_iterator,
    iterator: getiterator(getinternalparamsstate(params).entries),
    kind: kind
  });
}, 'iterator', function next() {
  var state = getinternaliteratorstate(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `urlsearchparams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var urlsearchparamsconstructor = function urlsearchparams(/* init */) {
  aninstance(this, urlsearchparamsconstructor, url_search_params);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratormethod, iterator, next, step, entryiterator, entrynext, first, second, key;

  setinternalstate(that, {
    type: url_search_params,
    entries: entries,
    updateurl: function () { /* empty */ },
    updatesearchparams: updatesearchparams
  });

  if (init !== undefined) {
    if (isobject(init)) {
      iteratormethod = getiteratormethod(init);
      if (typeof iteratormethod === 'function') {
        iterator = iteratormethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryiterator = getiterator(anobject(step.value));
          entrynext = entryiterator.next;
          if (
            (first = entrynext.call(entryiterator)).done ||
            (second = entrynext.call(entryiterator)).done ||
            !entrynext.call(entryiterator).done
          ) throw typeerror('expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (hasown(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parsesearchparams(entries, typeof init === 'string' ? init.charat(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var urlsearchparamsprototype = urlsearchparamsconstructor.prototype;

redefineall(urlsearchparamsprototype, {
  // `urlsearchparams.prototype.appent` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateargumentslength(arguments.length, 2);
    var state = getinternalparamsstate(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateurl();
  },
  // `urlsearchparams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateargumentslength(arguments.length, 1);
    var state = getinternalparamsstate(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateurl();
  },
  // `urlsearchparams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateargumentslength(arguments.length, 1);
    var entries = getinternalparamsstate(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `urlsearchparams.prototype.getall` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getall: function getall(name) {
    validateargumentslength(arguments.length, 1);
    var entries = getinternalparamsstate(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `urlsearchparams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateargumentslength(arguments.length, 1);
    var entries = getinternalparamsstate(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `urlsearchparams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateargumentslength(arguments.length, 1);
    var state = getinternalparamsstate(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateurl();
  },
  // `urlsearchparams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getinternalparamsstate(this);
    var entries = state.entries;
    // array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesindex, sliceindex;
    entries.length = 0;
    for (sliceindex = 0; sliceindex < slice.length; sliceindex++) {
      entry = slice[sliceindex];
      for (entriesindex = 0; entriesindex < sliceindex; entriesindex++) {
        if (entries[entriesindex].key > entry.key) {
          entries.splice(entriesindex, 0, entry);
          break;
        }
      }
      if (entriesindex === sliceindex) entries.push(entry);
    }
    state.updateurl();
  },
  // `urlsearchparams.prototype.foreach` method
  foreach: function foreach(callback /* , thisarg */) {
    var entries = getinternalparamsstate(this).entries;
    var boundfunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundfunction(entry.value, entry.key, this);
    }
  },
  // `urlsearchparams.prototype.keys` method
  keys: function keys() {
    return new urlsearchparamsiterator(this, 'keys');
  },
  // `urlsearchparams.prototype.values` method
  values: function values() {
    return new urlsearchparamsiterator(this, 'values');
  },
  // `urlsearchparams.prototype.entries` method
  entries: function entries() {
    return new urlsearchparamsiterator(this, 'entries');
  }
}, { enumerable: true });

// `urlsearchparams.prototype[@@iterator]` method
redefine(urlsearchparamsprototype, iterator, urlsearchparamsprototype.entries);

// `urlsearchparams.prototype.tostring` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(urlsearchparamsprototype, 'tostring', function tostring() {
  var entries = getinternalparamsstate(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

settostringtag(urlsearchparamsconstructor, url_search_params);

$({ global: true, forced: !use_native_url }, {
  urlsearchparams: urlsearchparamsconstructor
});

// wrap `fetch` for correct work with polyfilled `urlsearchparams`
// https://github.com/zloirock/core-js/issues/674
if (!use_native_url && typeof $fetch == 'function' && typeof headers == 'function') {
  $({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isobject(init)) {
          body = init.body;
          if (classof(body) === url_search_params) {
            headers = init.headers ? new headers(init.headers) : new headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=utf-8');
            }
            init = create(init, {
              body: createpropertydescriptor(0, string(body)),
              headers: createpropertydescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch.apply(this, args);
    }
  });
}

module.exports = {
  urlsearchparams: urlsearchparamsconstructor,
  getstate: getinternalparamsstate
};

},{"../internals/an-instance":4,"../internals/an-object":5,"../internals/classof":10,"../internals/create-iterator-constructor":13,"../internals/create-property-descriptor":15,"../internals/export":21,"../internals/function-bind-context":23,"../internals/get-built-in":24,"../internals/get-iterator":26,"../internals/get-iterator-method":25,"../internals/has":28,"../internals/internal-state":34,"../internals/is-object":37,"../internals/native-url":42,"../internals/object-create":45,"../internals/redefine":59,"../internals/redefine-all":58,"../internals/set-to-string-tag":62,"../internals/well-known-symbol":77,"../modules/es.array.iterator":78}],81:[function(require,module,exports){
'use strict';
// todo: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
require('../modules/es.string.iterator');
var $ = require('../internals/export');
var descriptors = require('../internals/descriptors');
var use_native_url = require('../internals/native-url');
var global = require('../internals/global');
var defineproperties = require('../internals/object-define-properties');
var redefine = require('../internals/redefine');
var aninstance = require('../internals/an-instance');
var has = require('../internals/has');
var assign = require('../internals/object-assign');
var arrayfrom = require('../internals/array-from');
var codeat = require('../internals/string-multibyte').codeat;
var toascii = require('../internals/string-punycode-to-ascii');
var settostringtag = require('../internals/set-to-string-tag');
var urlsearchparamsmodule = require('../modules/web.url-search-params');
var internalstatemodule = require('../internals/internal-state');

var nativeurl = global.url;
var urlsearchparams = urlsearchparamsmodule.urlsearchparams;
var getinternalsearchparamsstate = urlsearchparamsmodule.getstate;
var setinternalstate = internalstatemodule.set;
var getinternalurlstate = internalstatemodule.getterfor('url');
var floor = math.floor;
var pow = math.pow;

var invalid_authority = 'invalid authority';
var invalid_scheme = 'invalid scheme';
var invalid_host = 'invalid host';
var invalid_port = 'invalid port';

var alpha = /[a-za-z]/;
var alphanumeric = /[\d+\-.a-za-z]/;
var digit = /\d/;
var hex_start = /^(0x|0x)/;
var oct = /^[0-7]+$/;
var dec = /^\d+$/;
var hex = /^[\da-fa-f]+$/;
// eslint-disable-next-line no-control-regex
var forbidden_host_code_point = /[\u0000\u0009\u000a\u000d #%/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var forbidden_host_code_point_excluding_percent = /[\u0000\u0009\u000a\u000d #/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var leading_and_trailing_c0_control_or_space = /^[\u0000-\u001f ]+|[\u0000-\u001f ]+$/g;
// eslint-disable-next-line no-control-regex
var tab_and_new_line = /[\u0009\u000a\u000d]/g;
var eof;

var parsehost = function (url, input) {
  var result, codepoints, index;
  if (input.charat(0) == '[') {
    if (input.charat(input.length - 1) != ']') return invalid_host;
    result = parseipv6(input.slice(1, -1));
    if (!result) return invalid_host;
    url.host = result;
  // opaque host
  } else if (!isspecial(url)) {
    if (forbidden_host_code_point_excluding_percent.test(input)) return invalid_host;
    result = '';
    codepoints = arrayfrom(input);
    for (index = 0; index < codepoints.length; index++) {
      result += percentencode(codepoints[index], c0controlpercentencodeset);
    }
    url.host = result;
  } else {
    input = toascii(input);
    if (forbidden_host_code_point.test(input)) return invalid_host;
    result = parseipv4(input);
    if (result === null) return invalid_host;
    url.host = result;
  }
};

var parseipv4 = function (input) {
  var parts = input.split('.');
  var partslength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partslength = parts.length;
  if (partslength > 4) return input;
  numbers = [];
  for (index = 0; index < partslength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charat(0) == '0') {
      radix = hex_start.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? dec : radix == 8 ? oct : hex).test(part)) return input;
      number = parseint(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partslength; index++) {
    number = numbers[index];
    if (index == partslength - 1) {
      if (number >= pow(256, 5 - partslength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements
var parseipv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceindex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersseen, ipv4piece, number, swaps, swap;

  var char = function () {
    return input.charat(pointer);
  };

  if (char() == ':') {
    if (input.charat(1) != ':') return;
    pointer += 2;
    pieceindex++;
    compress = pieceindex;
  }
  while (char()) {
    if (pieceindex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceindex++;
      compress = pieceindex;
      continue;
    }
    value = length = 0;
    while (length < 4 && hex.test(char())) {
      value = value * 16 + parseint(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceindex > 6) return;
      numbersseen = 0;
      while (char()) {
        ipv4piece = null;
        if (numbersseen > 0) {
          if (char() == '.' && numbersseen < 4) pointer++;
          else return;
        }
        if (!digit.test(char())) return;
        while (digit.test(char())) {
          number = parseint(char(), 10);
          if (ipv4piece === null) ipv4piece = number;
          else if (ipv4piece == 0) return;
          else ipv4piece = ipv4piece * 10 + number;
          if (ipv4piece > 255) return;
          pointer++;
        }
        address[pieceindex] = address[pieceindex] * 256 + ipv4piece;
        numbersseen++;
        if (numbersseen == 2 || numbersseen == 4) pieceindex++;
      }
      if (numbersseen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceindex++] = value;
  }
  if (compress !== null) {
    swaps = pieceindex - compress;
    pieceindex = 7;
    while (pieceindex != 0 && swaps > 0) {
      swap = address[pieceindex];
      address[pieceindex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceindex != 8) return;
  return address;
};

var findlongestzerosequence = function (ipv6) {
  var maxindex = null;
  var maxlength = 1;
  var currstart = null;
  var currlength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currlength > maxlength) {
        maxindex = currstart;
        maxlength = currlength;
      }
      currstart = null;
      currlength = 0;
    } else {
      if (currstart === null) currstart = index;
      ++currlength;
    }
  }
  if (currlength > maxlength) {
    maxindex = currstart;
    maxlength = currlength;
  }
  return maxindex;
};

var serializehost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findlongestzerosequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].tostring(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var c0controlpercentencodeset = {};
var fragmentpercentencodeset = assign({}, c0controlpercentencodeset, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathpercentencodeset = assign({}, fragmentpercentencodeset, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfopercentencodeset = assign({}, pathpercentencodeset, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentencode = function (char, set) {
  var code = codeat(char, 0);
  return code > 0x20 && code < 0x7f && !has(set, char) ? char : encodeuricomponent(char);
};

var specialschemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isspecial = function (url) {
  return has(specialschemes, url.scheme);
};

var includescredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannothaveusernamepasswordport = function (url) {
  return !url.host || url.cannotbeabaseurl || url.scheme == 'file';
};

var iswindowsdriveletter = function (string, normalized) {
  var second;
  return string.length == 2 && alpha.test(string.charat(0))
    && ((second = string.charat(1)) == ':' || (!normalized && second == '|'));
};

var startswithwindowsdriveletter = function (string) {
  var third;
  return string.length > 1 && iswindowsdriveletter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charat(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenurlspath = function (url) {
  var path = url.path;
  var pathsize = path.length;
  if (pathsize && (url.scheme != 'file' || pathsize != 1 || !iswindowsdriveletter(path[0], true))) {
    path.pop();
  }
};

var issingledot = function (segment) {
  return segment === '.' || segment.tolowercase() === '%2e';
};

var isdoubledot = function (segment) {
  segment = segment.tolowercase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// states:
var scheme_start = {};
var scheme = {};
var no_scheme = {};
var special_relative_or_authority = {};
var path_or_authority = {};
var relative = {};
var relative_slash = {};
var special_authority_slashes = {};
var special_authority_ignore_slashes = {};
var authority = {};
var host = {};
var hostname = {};
var port = {};
var file = {};
var file_slash = {};
var file_host = {};
var path_start = {};
var path = {};
var cannot_be_a_base_url_path = {};
var query = {};
var fragment = {};

// eslint-disable-next-line max-statements
var parseurl = function (url, input, stateoverride, base) {
  var state = stateoverride || scheme_start;
  var pointer = 0;
  var buffer = '';
  var seenat = false;
  var seenbracket = false;
  var seenpasswordtoken = false;
  var codepoints, char, buffercodepoints, failure;

  if (!stateoverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotbeabaseurl = false;
    input = input.replace(leading_and_trailing_c0_control_or_space, '');
  }

  input = input.replace(tab_and_new_line, '');

  codepoints = arrayfrom(input);

  while (pointer <= codepoints.length) {
    char = codepoints[pointer];
    switch (state) {
      case scheme_start:
        if (char && alpha.test(char)) {
          buffer += char.tolowercase();
          state = scheme;
        } else if (!stateoverride) {
          state = no_scheme;
          continue;
        } else return invalid_scheme;
        break;

      case scheme:
        if (char && (alphanumeric.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.tolowercase();
        } else if (char == ':') {
          if (stateoverride && (
            (isspecial(url) != has(specialschemes, buffer)) ||
            (buffer == 'file' && (includescredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateoverride) {
            if (isspecial(url) && specialschemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = file;
          } else if (isspecial(url) && base && base.scheme == url.scheme) {
            state = special_relative_or_authority;
          } else if (isspecial(url)) {
            state = special_authority_slashes;
          } else if (codepoints[pointer + 1] == '/') {
            state = path_or_authority;
            pointer++;
          } else {
            url.cannotbeabaseurl = true;
            url.path.push('');
            state = cannot_be_a_base_url_path;
          }
        } else if (!stateoverride) {
          buffer = '';
          state = no_scheme;
          pointer = 0;
          continue;
        } else return invalid_scheme;
        break;

      case no_scheme:
        if (!base || (base.cannotbeabaseurl && char != '#')) return invalid_scheme;
        if (base.cannotbeabaseurl && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotbeabaseurl = true;
          state = fragment;
          break;
        }
        state = base.scheme == 'file' ? file : relative;
        continue;

      case special_relative_or_authority:
        if (char == '/' && codepoints[pointer + 1] == '/') {
          state = special_authority_ignore_slashes;
          pointer++;
        } else {
          state = relative;
          continue;
        } break;

      case path_or_authority:
        if (char == '/') {
          state = authority;
          break;
        } else {
          state = path;
          continue;
        }

      case relative:
        url.scheme = base.scheme;
        if (char == eof) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isspecial(url))) {
          state = relative_slash;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = query;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = fragment;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = path;
          continue;
        } break;

      case relative_slash:
        if (isspecial(url) && (char == '/' || char == '\\')) {
          state = special_authority_ignore_slashes;
        } else if (char == '/') {
          state = authority;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = path;
          continue;
        } break;

      case special_authority_slashes:
        state = special_authority_ignore_slashes;
        if (char != '/' || buffer.charat(pointer + 1) != '/') continue;
        pointer++;
        break;

      case special_authority_ignore_slashes:
        if (char != '/' && char != '\\') {
          state = authority;
          continue;
        } break;

      case authority:
        if (char == '@') {
          if (seenat) buffer = '%40' + buffer;
          seenat = true;
          buffercodepoints = arrayfrom(buffer);
          for (var i = 0; i < buffercodepoints.length; i++) {
            var codepoint = buffercodepoints[i];
            if (codepoint == ':' && !seenpasswordtoken) {
              seenpasswordtoken = true;
              continue;
            }
            var encodedcodepoints = percentencode(codepoint, userinfopercentencodeset);
            if (seenpasswordtoken) url.password += encodedcodepoints;
            else url.username += encodedcodepoints;
          }
          buffer = '';
        } else if (
          char == eof || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isspecial(url))
        ) {
          if (seenat && buffer == '') return invalid_authority;
          pointer -= arrayfrom(buffer).length + 1;
          buffer = '';
          state = host;
        } else buffer += char;
        break;

      case host:
      case hostname:
        if (stateoverride && url.scheme == 'file') {
          state = file_host;
          continue;
        } else if (char == ':' && !seenbracket) {
          if (buffer == '') return invalid_host;
          failure = parsehost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = port;
          if (stateoverride == hostname) return;
        } else if (
          char == eof || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isspecial(url))
        ) {
          if (isspecial(url) && buffer == '') return invalid_host;
          if (stateoverride && buffer == '' && (includescredentials(url) || url.port !== null)) return;
          failure = parsehost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = path_start;
          if (stateoverride) return;
          continue;
        } else {
          if (char == '[') seenbracket = true;
          else if (char == ']') seenbracket = false;
          buffer += char;
        } break;

      case port:
        if (digit.test(char)) {
          buffer += char;
        } else if (
          char == eof || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isspecial(url)) ||
          stateoverride
        ) {
          if (buffer != '') {
            var port = parseint(buffer, 10);
            if (port > 0xffff) return invalid_port;
            url.port = (isspecial(url) && port === specialschemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateoverride) return;
          state = path_start;
          continue;
        } else return invalid_port;
        break;

      case file:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = file_slash;
        else if (base && base.scheme == 'file') {
          if (char == eof) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = query;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = fragment;
          } else {
            if (!startswithwindowsdriveletter(codepoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenurlspath(url);
            }
            state = path;
            continue;
          }
        } else {
          state = path;
          continue;
        } break;

      case file_slash:
        if (char == '/' || char == '\\') {
          state = file_host;
          break;
        }
        if (base && base.scheme == 'file' && !startswithwindowsdriveletter(codepoints.slice(pointer).join(''))) {
          if (iswindowsdriveletter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = path;
        continue;

      case file_host:
        if (char == eof || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateoverride && iswindowsdriveletter(buffer)) {
            state = path;
          } else if (buffer == '') {
            url.host = '';
            if (stateoverride) return;
            state = path_start;
          } else {
            failure = parsehost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateoverride) return;
            buffer = '';
            state = path_start;
          } continue;
        } else buffer += char;
        break;

      case path_start:
        if (isspecial(url)) {
          state = path;
          if (char != '/' && char != '\\') continue;
        } else if (!stateoverride && char == '?') {
          url.query = '';
          state = query;
        } else if (!stateoverride && char == '#') {
          url.fragment = '';
          state = fragment;
        } else if (char != eof) {
          state = path;
          if (char != '/') continue;
        } break;

      case path:
        if (
          char == eof || char == '/' ||
          (char == '\\' && isspecial(url)) ||
          (!stateoverride && (char == '?' || char == '#'))
        ) {
          if (isdoubledot(buffer)) {
            shortenurlspath(url);
            if (char != '/' && !(char == '\\' && isspecial(url))) {
              url.path.push('');
            }
          } else if (issingledot(buffer)) {
            if (char != '/' && !(char == '\\' && isspecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && iswindowsdriveletter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charat(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == eof || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = query;
          } else if (char == '#') {
            url.fragment = '';
            state = fragment;
          }
        } else {
          buffer += percentencode(char, pathpercentencodeset);
        } break;

      case cannot_be_a_base_url_path:
        if (char == '?') {
          url.query = '';
          state = query;
        } else if (char == '#') {
          url.fragment = '';
          state = fragment;
        } else if (char != eof) {
          url.path[0] += percentencode(char, c0controlpercentencodeset);
        } break;

      case query:
        if (!stateoverride && char == '#') {
          url.fragment = '';
          state = fragment;
        } else if (char != eof) {
          if (char == "'" && isspecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentencode(char, c0controlpercentencodeset);
        } break;

      case fragment:
        if (char != eof) url.fragment += percentencode(char, fragmentpercentencodeset);
        break;
    }

    pointer++;
  }
};

// `url` constructor
// https://url.spec.whatwg.org/#url-class
var urlconstructor = function url(url /* , base */) {
  var that = aninstance(this, urlconstructor, 'url');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlstring = string(url);
  var state = setinternalstate(that, { type: 'url' });
  var basestate, failure;
  if (base !== undefined) {
    if (base instanceof urlconstructor) basestate = getinternalurlstate(base);
    else {
      failure = parseurl(basestate = {}, string(base));
      if (failure) throw typeerror(failure);
    }
  }
  failure = parseurl(state, urlstring, null, basestate);
  if (failure) throw typeerror(failure);
  var searchparams = state.searchparams = new urlsearchparams();
  var searchparamsstate = getinternalsearchparamsstate(searchparams);
  searchparamsstate.updatesearchparams(state.query);
  searchparamsstate.updateurl = function () {
    state.query = string(searchparams) || null;
  };
  if (!descriptors) {
    that.href = serializeurl.call(that);
    that.origin = getorigin.call(that);
    that.protocol = getprotocol.call(that);
    that.username = getusername.call(that);
    that.password = getpassword.call(that);
    that.host = gethost.call(that);
    that.hostname = gethostname.call(that);
    that.port = getport.call(that);
    that.pathname = getpathname.call(that);
    that.search = getsearch.call(that);
    that.searchparams = getsearchparams.call(that);
    that.hash = gethash.call(that);
  }
};

var urlprototype = urlconstructor.prototype;

var serializeurl = function () {
  var url = getinternalurlstate(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includescredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializehost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotbeabaseurl ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getorigin = function () {
  var url = getinternalurlstate(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new url(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isspecial(url)) return 'null';
  return scheme + '://' + serializehost(url.host) + (port !== null ? ':' + port : '');
};

var getprotocol = function () {
  return getinternalurlstate(this).scheme + ':';
};

var getusername = function () {
  return getinternalurlstate(this).username;
};

var getpassword = function () {
  return getinternalurlstate(this).password;
};

var gethost = function () {
  var url = getinternalurlstate(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializehost(host)
    : serializehost(host) + ':' + port;
};

var gethostname = function () {
  var host = getinternalurlstate(this).host;
  return host === null ? '' : serializehost(host);
};

var getport = function () {
  var port = getinternalurlstate(this).port;
  return port === null ? '' : string(port);
};

var getpathname = function () {
  var url = getinternalurlstate(this);
  var path = url.path;
  return url.cannotbeabaseurl ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getsearch = function () {
  var query = getinternalurlstate(this).query;
  return query ? '?' + query : '';
};

var getsearchparams = function () {
  return getinternalurlstate(this).searchparams;
};

var gethash = function () {
  var fragment = getinternalurlstate(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessordescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (descriptors) {
  defineproperties(urlprototype, {
    // `url.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessordescriptor(serializeurl, function (href) {
      var url = getinternalurlstate(this);
      var urlstring = string(href);
      var failure = parseurl(url, urlstring);
      if (failure) throw typeerror(failure);
      getinternalsearchparamsstate(url.searchparams).updatesearchparams(url.query);
    }),
    // `url.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessordescriptor(getorigin),
    // `url.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessordescriptor(getprotocol, function (protocol) {
      var url = getinternalurlstate(this);
      parseurl(url, string(protocol) + ':', scheme_start);
    }),
    // `url.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessordescriptor(getusername, function (username) {
      var url = getinternalurlstate(this);
      var codepoints = arrayfrom(string(username));
      if (cannothaveusernamepasswordport(url)) return;
      url.username = '';
      for (var i = 0; i < codepoints.length; i++) {
        url.username += percentencode(codepoints[i], userinfopercentencodeset);
      }
    }),
    // `url.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessordescriptor(getpassword, function (password) {
      var url = getinternalurlstate(this);
      var codepoints = arrayfrom(string(password));
      if (cannothaveusernamepasswordport(url)) return;
      url.password = '';
      for (var i = 0; i < codepoints.length; i++) {
        url.password += percentencode(codepoints[i], userinfopercentencodeset);
      }
    }),
    // `url.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessordescriptor(gethost, function (host) {
      var url = getinternalurlstate(this);
      if (url.cannotbeabaseurl) return;
      parseurl(url, string(host), host);
    }),
    // `url.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessordescriptor(gethostname, function (hostname) {
      var url = getinternalurlstate(this);
      if (url.cannotbeabaseurl) return;
      parseurl(url, string(hostname), hostname);
    }),
    // `url.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessordescriptor(getport, function (port) {
      var url = getinternalurlstate(this);
      if (cannothaveusernamepasswordport(url)) return;
      port = string(port);
      if (port == '') url.port = null;
      else parseurl(url, port, port);
    }),
    // `url.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessordescriptor(getpathname, function (pathname) {
      var url = getinternalurlstate(this);
      if (url.cannotbeabaseurl) return;
      url.path = [];
      parseurl(url, pathname + '', path_start);
    }),
    // `url.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessordescriptor(getsearch, function (search) {
      var url = getinternalurlstate(this);
      search = string(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charat(0)) search = search.slice(1);
        url.query = '';
        parseurl(url, search, query);
      }
      getinternalsearchparamsstate(url.searchparams).updatesearchparams(url.query);
    }),
    // `url.prototype.searchparams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchparams: accessordescriptor(getsearchparams),
    // `url.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessordescriptor(gethash, function (hash) {
      var url = getinternalurlstate(this);
      hash = string(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charat(0)) hash = hash.slice(1);
      url.fragment = '';
      parseurl(url, hash, fragment);
    })
  });
}

// `url.prototype.tojson` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(urlprototype, 'tojson', function tojson() {
  return serializeurl.call(this);
}, { enumerable: true });

// `url.prototype.tostring` method
// https://url.spec.whatwg.org/#url-stringification-behavior
redefine(urlprototype, 'tostring', function tostring() {
  return serializeurl.call(this);
}, { enumerable: true });

if (nativeurl) {
  var nativecreateobjecturl = nativeurl.createobjecturl;
  var nativerevokeobjecturl = nativeurl.revokeobjecturl;
  // `url.createobjecturl` method
  // https://developer.mozilla.org/en-us/docs/web/api/url/createobjecturl
  // eslint-disable-next-line no-unused-vars
  if (nativecreateobjecturl) redefine(urlconstructor, 'createobjecturl', function createobjecturl(blob) {
    return nativecreateobjecturl.apply(nativeurl, arguments);
  });
  // `url.revokeobjecturl` method
  // https://developer.mozilla.org/en-us/docs/web/api/url/revokeobjecturl
  // eslint-disable-next-line no-unused-vars
  if (nativerevokeobjecturl) redefine(urlconstructor, 'revokeobjecturl', function revokeobjecturl(url) {
    return nativerevokeobjecturl.apply(nativeurl, arguments);
  });
}

settostringtag(urlconstructor, 'url');

$({ global: true, forced: !use_native_url, sham: !descriptors }, {
  url: urlconstructor
});

},{"../internals/an-instance":4,"../internals/array-from":6,"../internals/descriptors":18,"../internals/export":21,"../internals/global":27,"../internals/has":28,"../internals/internal-state":34,"../internals/native-url":42,"../internals/object-assign":44,"../internals/object-define-properties":46,"../internals/redefine":59,"../internals/set-to-string-tag":62,"../internals/string-multibyte":66,"../internals/string-punycode-to-ascii":67,"../modules/es.string.iterator":79,"../modules/web.url-search-params":80}],82:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');

// `url.prototype.tojson` method
// https://url.spec.whatwg.org/#dom-url-tojson
$({ target: 'url', proto: true, enumerable: true }, {
  tojson: function tojson() {
    return url.prototype.tostring.call(this);
  }
});

},{"../internals/export":21}],83:[function(require,module,exports){
require('../modules/web.url');
require('../modules/web.url.to-json');
require('../modules/web.url-search-params');
var path = require('../internals/path');

module.exports = path.url;

},{"../internals/path":57,"../modules/web.url":81,"../modules/web.url-search-params":80,"../modules/web.url.to-json":82}]},{},[83]);







