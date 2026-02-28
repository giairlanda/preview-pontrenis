/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3304:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



object.defineproperty(exports, "__esmodule", ({
  value: true
}));
exports.cps = exports.call = undefined;

var _is = __webpack_require__(6921);

var _is2 = _interoprequiredefault(_is);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

function _toconsumablearray(arr) { if (array.isarray(arr)) { for (var i = 0, arr2 = array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return array.from(arr); } }

var call = exports.call = function call(value, next, rungen, yieldnext, raisenext) {
  if (!_is2.default.call(value)) return false;
  try {
    next(value.func.apply(value.context, value.args));
  } catch (err) {
    raisenext(err);
  }
  return true;
};

var cps = exports.cps = function cps(value, next, rungen, yieldnext, raisenext) {
  var _value$func;

  if (!_is2.default.cps(value)) return false;
  (_value$func = value.func).call.apply(_value$func, [null].concat(_toconsumablearray(value.args), [function (err, result) {
    if (err) raisenext(err);else next(result);
  }]));
  return true;
};

exports["default"] = [call, cps];

/***/ }),

/***/ 3524:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



object.defineproperty(exports, "__esmodule", ({
  value: true
}));
exports.createchannel = exports.subscribe = exports.cps = exports.apply = exports.call = exports.invoke = exports.delay = exports.race = exports.join = exports.fork = exports.error = exports.all = undefined;

var _keys = __webpack_require__(4137);

var _keys2 = _interoprequiredefault(_keys);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var all = exports.all = function all(value) {
  return {
    type: _keys2.default.all,
    value: value
  };
};

var error = exports.error = function error(err) {
  return {
    type: _keys2.default.error,
    error: err
  };
};

var fork = exports.fork = function fork(iterator) {
  for (var _len = arguments.length, args = array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return {
    type: _keys2.default.fork,
    iterator: iterator,
    args: args
  };
};

var join = exports.join = function join(task) {
  return {
    type: _keys2.default.join,
    task: task
  };
};

var race = exports.race = function race(competitors) {
  return {
    type: _keys2.default.race,
    competitors: competitors
  };
};

var delay = exports.delay = function delay(timeout) {
  return new promise(function (resolve) {
    settimeout(function () {
      return resolve(true);
    }, timeout);
  });
};

var invoke = exports.invoke = function invoke(func) {
  for (var _len2 = arguments.length, args = array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return {
    type: _keys2.default.call,
    func: func,
    context: null,
    args: args
  };
};

var call = exports.call = function call(func, context) {
  for (var _len3 = arguments.length, args = array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  return {
    type: _keys2.default.call,
    func: func,
    context: context,
    args: args
  };
};

var apply = exports.apply = function apply(func, context, args) {
  return {
    type: _keys2.default.call,
    func: func,
    context: context,
    args: args
  };
};

var cps = exports.cps = function cps(func) {
  for (var _len4 = arguments.length, args = array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  return {
    type: _keys2.default.cps,
    func: func,
    args: args
  };
};

var subscribe = exports.subscribe = function subscribe(channel) {
  return {
    type: _keys2.default.subscribe,
    channel: channel
  };
};

var createchannel = exports.createchannel = function createchannel(callback) {
  var listeners = [];
  var subscribe = function subscribe(l) {
    listeners.push(l);
    return function () {
      return listeners.splice(listeners.indexof(l), 1);
    };
  };
  var next = function next(val) {
    return listeners.foreach(function (l) {
      return l(val);
    });
  };
  callback(next);

  return {
    subscribe: subscribe
  };
};

/***/ }),

/***/ 4137:
/***/ ((__unused_webpack_module, exports) => {



object.defineproperty(exports, "__esmodule", ({
  value: true
}));
var keys = {
  all: symbol('all'),
  error: symbol('error'),
  fork: symbol('fork'),
  join: symbol('join'),
  race: symbol('race'),
  call: symbol('call'),
  cps: symbol('cps'),
  subscribe: symbol('subscribe')
};

exports["default"] = keys;

/***/ }),

/***/ 5136:
/***/ ((__unused_webpack_module, exports) => {



object.defineproperty(exports, "__esmodule", ({
  value: true
}));
var createdispatcher = function createdispatcher() {
  var listeners = [];

  return {
    subscribe: function subscribe(listener) {
      listeners.push(listener);
      return function () {
        listeners = listeners.filter(function (l) {
          return l !== listener;
        });
      };
    },
    dispatch: function dispatch(action) {
      listeners.slice().foreach(function (listener) {
        return listener(action);
      });
    }
  };
};

exports["default"] = createdispatcher;

/***/ }),

/***/ 5357:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



object.defineproperty(exports, "__esmodule", ({
  value: true
}));
exports.iterator = exports.array = exports.object = exports.error = exports.any = undefined;

var _is = __webpack_require__(6921);

var _is2 = _interoprequiredefault(_is);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var any = exports.any = function any(value, next, rungen, yieldnext) {
  yieldnext(value);
  return true;
};

var error = exports.error = function error(value, next, rungen, yieldnext, raisenext) {
  if (!_is2.default.error(value)) return false;
  raisenext(value.error);
  return true;
};

var object = exports.object = function object(value, next, rungen, yieldnext, raisenext) {
  if (!_is2.default.all(value) || !_is2.default.obj(value.value)) return false;
  var result = {};
  var keys = object.keys(value.value);
  var count = 0;
  var haserror = false;
  var gotresultsuccess = function gotresultsuccess(key, ret) {
    if (haserror) return;
    result[key] = ret;
    count++;
    if (count === keys.length) {
      yieldnext(result);
    }
  };

  var gotresulterror = function gotresulterror(key, error) {
    if (haserror) return;
    haserror = true;
    raisenext(error);
  };

  keys.map(function (key) {
    rungen(value.value[key], function (ret) {
      return gotresultsuccess(key, ret);
    }, function (err) {
      return gotresulterror(key, err);
    });
  });

  return true;
};

var array = exports.array = function array(value, next, rungen, yieldnext, raisenext) {
  if (!_is2.default.all(value) || !_is2.default.array(value.value)) return false;
  var result = [];
  var count = 0;
  var haserror = false;
  var gotresultsuccess = function gotresultsuccess(key, ret) {
    if (haserror) return;
    result[key] = ret;
    count++;
    if (count === value.value.length) {
      yieldnext(result);
    }
  };

  var gotresulterror = function gotresulterror(key, error) {
    if (haserror) return;
    haserror = true;
    raisenext(error);
  };

  value.value.map(function (v, key) {
    rungen(v, function (ret) {
      return gotresultsuccess(key, ret);
    }, function (err) {
      return gotresulterror(key, err);
    });
  });

  return true;
};

var iterator = exports.iterator = function iterator(value, next, rungen, yieldnext, raisenext) {
  if (!_is2.default.iterator(value)) return false;
  rungen(value, next, raisenext);
  return true;
};

exports["default"] = [error, iterator, array, object, any];

/***/ }),

/***/ 6910:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



object.defineproperty(exports, "__esmodule", ({
  value: true
}));
exports.race = exports.join = exports.fork = exports.promise = undefined;

var _is = __webpack_require__(6921);

var _is2 = _interoprequiredefault(_is);

var _helpers = __webpack_require__(3524);

var _dispatcher = __webpack_require__(5136);

var _dispatcher2 = _interoprequiredefault(_dispatcher);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var promise = exports.promise = function promise(value, next, rungen, yieldnext, raisenext) {
  if (!_is2.default.promise(value)) return false;
  value.then(next, raisenext);
  return true;
};

var forkedtasks = new map();
var fork = exports.fork = function fork(value, next, rungen) {
  if (!_is2.default.fork(value)) return false;
  var task = symbol('fork');
  var dispatcher = (0, _dispatcher2.default)();
  forkedtasks.set(task, dispatcher);
  rungen(value.iterator.apply(null, value.args), function (result) {
    return dispatcher.dispatch(result);
  }, function (err) {
    return dispatcher.dispatch((0, _helpers.error)(err));
  });
  var unsubscribe = dispatcher.subscribe(function () {
    unsubscribe();
    forkedtasks.delete(task);
  });
  next(task);
  return true;
};

var join = exports.join = function join(value, next, rungen, yieldnext, raisenext) {
  if (!_is2.default.join(value)) return false;
  var dispatcher = forkedtasks.get(value.task);
  if (!dispatcher) {
    raisenext('join error : task not found');
  } else {
    (function () {
      var unsubscribe = dispatcher.subscribe(function (result) {
        unsubscribe();
        next(result);
      });
    })();
  }
  return true;
};

var race = exports.race = function race(value, next, rungen, yieldnext, raisenext) {
  if (!_is2.default.race(value)) return false;
  var finished = false;
  var success = function success(result, k, v) {
    if (finished) return;
    finished = true;
    result[k] = v;
    next(result);
  };

  var fail = function fail(err) {
    if (finished) return;
    raisenext(err);
  };
  if (_is2.default.array(value.competitors)) {
    (function () {
      var result = value.competitors.map(function () {
        return false;
      });
      value.competitors.foreach(function (competitor, index) {
        rungen(competitor, function (output) {
          return success(result, index, output);
        }, fail);
      });
    })();
  } else {
    (function () {
      var result = object.keys(value.competitors).reduce(function (p, c) {
        p[c] = false;
        return p;
      }, {});
      object.keys(value.competitors).foreach(function (index) {
        rungen(value.competitors[index], function (output) {
          return success(result, index, output);
        }, fail);
      });
    })();
  }
  return true;
};

var subscribe = function subscribe(value, next) {
  if (!_is2.default.subscribe(value)) return false;
  if (!_is2.default.channel(value.channel)) {
    throw new error('the first argument of "subscribe" must be a valid channel');
  }
  var unsubscribe = value.channel.subscribe(function (ret) {
    unsubscribe && unsubscribe();
    next(ret);
  });

  return true;
};

exports["default"] = [promise, fork, join, race, subscribe];

/***/ }),

/***/ 6921:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



object.defineproperty(exports, "__esmodule", ({
  value: true
}));

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol ? "symbol" : typeof obj; };

var _keys = __webpack_require__(4137);

var _keys2 = _interoprequiredefault(_keys);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var is = {
  obj: function obj(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !!value;
  },
  all: function all(value) {
    return is.obj(value) && value.type === _keys2.default.all;
  },
  error: function error(value) {
    return is.obj(value) && value.type === _keys2.default.error;
  },
  array: array.isarray,
  func: function func(value) {
    return typeof value === 'function';
  },
  promise: function promise(value) {
    return value && is.func(value.then);
  },
  iterator: function iterator(value) {
    return value && is.func(value.next) && is.func(value.throw);
  },
  fork: function fork(value) {
    return is.obj(value) && value.type === _keys2.default.fork;
  },
  join: function join(value) {
    return is.obj(value) && value.type === _keys2.default.join;
  },
  race: function race(value) {
    return is.obj(value) && value.type === _keys2.default.race;
  },
  call: function call(value) {
    return is.obj(value) && value.type === _keys2.default.call;
  },
  cps: function cps(value) {
    return is.obj(value) && value.type === _keys2.default.cps;
  },
  subscribe: function subscribe(value) {
    return is.obj(value) && value.type === _keys2.default.subscribe;
  },
  channel: function channel(value) {
    return is.obj(value) && is.func(value.subscribe);
  }
};

exports["default"] = is;

/***/ }),

/***/ 8975:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



object.defineproperty(exports, "__esmodule", ({
  value: true
}));
exports.wrapcontrols = exports.asynccontrols = exports.create = undefined;

var _helpers = __webpack_require__(3524);

object.keys(_helpers).foreach(function (key) {
  if (key === "default") return;
  object.defineproperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _helpers[key];
    }
  });
});

var _create = __webpack_require__(9127);

var _create2 = _interoprequiredefault(_create);

var _async = __webpack_require__(6910);

var _async2 = _interoprequiredefault(_async);

var _wrap = __webpack_require__(3304);

var _wrap2 = _interoprequiredefault(_wrap);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

exports.create = _create2.default;
exports.asynccontrols = _async2.default;
exports.wrapcontrols = _wrap2.default;

/***/ }),

/***/ 9127:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



object.defineproperty(exports, "__esmodule", ({
  value: true
}));

var _builtin = __webpack_require__(5357);

var _builtin2 = _interoprequiredefault(_builtin);

var _is = __webpack_require__(6921);

var _is2 = _interoprequiredefault(_is);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

function _toconsumablearray(arr) { if (array.isarray(arr)) { for (var i = 0, arr2 = array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return array.from(arr); } }

var create = function create() {
  var usercontrols = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  var controls = [].concat(_toconsumablearray(usercontrols), _toconsumablearray(_builtin2.default));

  var runtime = function runtime(input) {
    var success = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
    var error = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

    var iterate = function iterate(gen) {
      var yieldvalue = function yieldvalue(iserror) {
        return function (ret) {
          try {
            var _ref = iserror ? gen.throw(ret) : gen.next(ret);

            var value = _ref.value;
            var done = _ref.done;

            if (done) return success(value);
            next(value);
          } catch (e) {
            return error(e);
          }
        };
      };

      var next = function next(ret) {
        controls.some(function (control) {
          return control(ret, next, runtime, yieldvalue(false), yieldvalue(true));
        });
      };

      yieldvalue(false)();
    };

    var iterator = _is2.default.iterator(input) ? input : regeneratorruntime.mark(function _callee() {
      return regeneratorruntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return input;

            case 2:
              return _context.abrupt('return', _context.sent);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })();

    iterate(iterator, success, error);
  };

  return runtime;
};

exports["default"] = create;

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
/************************************************************************/
var __webpack_exports__ = {};

// exports
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ createmiddleware)
});

;// ./node_modules/@wordpress/redux-routine/build-module/is-generator.js
function isgenerator(object) {
  return !!object && typeof object[symbol.iterator] === "function" && typeof object.next === "function";
}


// external module: ./node_modules/rungen/dist/index.js
var dist = __webpack_require__(8975);
;// ./node_modules/is-promise/index.mjs
function ispromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

;// ./node_modules/is-plain-object/dist/is-plain-object.mjs
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * copyright (c) 2014-2017, jon schlinkert.
 * released under the mit license.
 */

function isobject(o) {
  return object.prototype.tostring.call(o) === '[object object]';
}

function isplainobject(o) {
  var ctor,prot;

  if (isobject(o) === false) return false;

  // if has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // if has modified prototype
  prot = ctor.prototype;
  if (isobject(prot) === false) return false;

  // if constructor does not have an object-specific method
  if (prot.hasownproperty('isprototypeof') === false) {
    return false;
  }

  // most likely a plain object
  return true;
}



;// ./node_modules/@wordpress/redux-routine/build-module/is-action.js

function isaction(object) {
  return isplainobject(object) && typeof object.type === "string";
}
function isactionoftype(object, expectedtype) {
  return isaction(object) && object.type === expectedtype;
}


;// ./node_modules/@wordpress/redux-routine/build-module/runtime.js



function createruntime(controls = {}, dispatch) {
  const rungencontrols = object.entries(controls).map(
    ([actiontype, control]) => (value, next, iterate, yieldnext, yielderror) => {
      if (!isactionoftype(value, actiontype)) {
        return false;
      }
      const routine = control(value);
      if (ispromise(routine)) {
        routine.then(yieldnext, yielderror);
      } else {
        yieldnext(routine);
      }
      return true;
    }
  );
  const unhandledactioncontrol = (value, next) => {
    if (!isaction(value)) {
      return false;
    }
    dispatch(value);
    next();
    return true;
  };
  rungencontrols.push(unhandledactioncontrol);
  const rungenruntime = (0,dist.create)(rungencontrols);
  return (action) => new promise(
    (resolve, reject) => rungenruntime(
      action,
      (result) => {
        if (isaction(result)) {
          dispatch(result);
        }
        resolve(result);
      },
      reject
    )
  );
}


;// ./node_modules/@wordpress/redux-routine/build-module/index.js


function createmiddleware(controls = {}) {
  return (store) => {
    const runtime = createruntime(controls, store.dispatch);
    return (next) => (action) => {
      if (!isgenerator(action)) {
        return next(action);
      }
      return runtime(action);
    };
  };
}


(window.wp = window.wp || {}).reduxroutine = __webpack_exports__["default"];
/******/ })()
;







