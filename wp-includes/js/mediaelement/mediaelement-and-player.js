/*!
 * mediaelement.js
 * http://www.mediaelementjs.com/
 *
 * wrapper that mimics native html5 mediaelement (audio and video)
 * using a variety of technologies (pure javascript, flash, iframe)
 *
 * copyright 2010-2017, john dyer (http://j.hn/)
 * license: mit
 *
 */(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new error("cannot find module '"+o+"'");throw f.code="module_not_found",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(_dereq_,module,exports){

},{}],2:[function(_dereq_,module,exports){
(function (global){
var toplevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var mindoc = _dereq_(1);

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = toplevel['__global_document_cache@4'];

    if (!doccy) {
        doccy = toplevel['__global_document_cache@4'] = mindoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"1":1}],3:[function(_dereq_,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(_dereq_,module,exports){
(function (root) {

  // store settimeout reference so promise-polyfill will be unaffected by
  // other code modifying settimeout (like sinon.usefaketimers())
  var settimeoutfunc = settimeout;

  function noop() {}
  
  // polyfill for function.prototype.bind
  function bind(fn, thisarg) {
    return function () {
      fn.apply(thisarg, arguments);
    };
  }

  function promise(fn) {
    if (typeof this !== 'object') throw new typeerror('promises must be constructed via new');
    if (typeof fn !== 'function') throw new typeerror('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doresolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    promise._immediatefn(function () {
      var cb = self._state === 1 ? deferred.onfulfilled : deferred.onrejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newvalue) {
    try {
      // promise resolution procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newvalue === self) throw new typeerror('a promise cannot be resolved with itself.');
      if (newvalue && (typeof newvalue === 'object' || typeof newvalue === 'function')) {
        var then = newvalue.then;
        if (newvalue instanceof promise) {
          self._state = 3;
          self._value = newvalue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doresolve(bind(then, newvalue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newvalue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newvalue) {
    self._state = 2;
    self._value = newvalue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      promise._immediatefn(function() {
        if (!self._handled) {
          promise._unhandledrejectionfn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function handler(onfulfilled, onrejected, promise) {
    this.onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : null;
    this.onrejected = typeof onrejected === 'function' ? onrejected : null;
    this.promise = promise;
  }

  /**
   * take a potentially misbehaving resolver function and make sure
   * onfulfilled and onrejected are only called once.
   *
   * makes no guarantees about asynchrony.
   */
  function doresolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  promise.prototype['catch'] = function (onrejected) {
    return this.then(null, onrejected);
  };

  promise.prototype.then = function (onfulfilled, onrejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new handler(onfulfilled, onrejected, prom));
    return prom;
  };

  promise.all = function (arr) {
    var args = array.prototype.slice.call(arr);

    return new promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === promise) {
      return value;
    }

    return new promise(function (resolve) {
      resolve(value);
    });
  };

  promise.reject = function (value) {
    return new promise(function (resolve, reject) {
      reject(value);
    });
  };

  promise.race = function (values) {
    return new promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // use polyfill for setimmediate for performance gains
  promise._immediatefn = (typeof setimmediate === 'function' && function (fn) { setimmediate(fn); }) ||
    function (fn) {
      settimeoutfunc(fn, 0);
    };

  promise._unhandledrejectionfn = function _unhandledrejectionfn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('possible unhandled promise rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * set the immediate function to execute callbacks
   * @param fn {function} function to execute
   * @deprecated
   */
  promise._setimmediatefn = function _setimmediatefn(fn) {
    promise._immediatefn = fn;
  };

  /**
   * change the function to execute on unhandled rejection
   * @param {function} fn function to execute on unhandled rejection
   * @deprecated
   */
  promise._setunhandledrejectionfn = function _setunhandledrejectionfn(fn) {
    promise._unhandledrejectionfn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = promise;
  } else if (!root.promise) {
    root.promise = promise;
  }

})(this);

},{}],5:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _en = _dereq_(15);

var _general = _dereq_(27);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var i18n = { lang: 'en', en: _en.en };

i18n.language = function () {
	for (var _len = arguments.length, args = array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	if (args !== null && args !== undefined && args.length) {

		if (typeof args[0] !== 'string') {
			throw new typeerror('language code must be a string value');
		}

		if (!/^[a-z]{2,3}((\-|_)[a-z]{2})?$/i.test(args[0])) {
			throw new typeerror('language code must have format 2-3 letters and. optionally, hyphen, underscore followed by 2 more letters');
		}

		i18n.lang = args[0];

		if (i18n[args[0]] === undefined) {
			args[1] = args[1] !== null && args[1] !== undefined && _typeof(args[1]) === 'object' ? args[1] : {};
			i18n[args[0]] = !(0, _general.isobjectempty)(args[1]) ? args[1] : _en.en;
		} else if (args[1] !== null && args[1] !== undefined && _typeof(args[1]) === 'object') {
			i18n[args[0]] = args[1];
		}
	}

	return i18n.lang;
};

i18n.t = function (message) {
	var pluralparam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


	if (typeof message === 'string' && message.length) {

		var str = void 0,
		    pluralform = void 0;

		var language = i18n.language();

		var _plural = function _plural(input, number, form) {

			if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object' || typeof number !== 'number' || typeof form !== 'number') {
				return input;
			}

			var _pluralforms = function () {
				return [function () {
					return arguments.length <= 1 ? undefined : arguments[1];
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) !== 0) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1 || (arguments.length <= 0 ? undefined : arguments[0]) === 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2 || (arguments.length <= 0 ? undefined : arguments[0]) === 12) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 2 && (arguments.length <= 0 ? undefined : arguments[0]) < 20) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 > 0 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 20) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return [3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) <= 4) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 2) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 3 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 === 4) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else {
						return arguments.length <= 1 ? undefined : arguments[1];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 2 && (arguments.length <= 0 ? undefined : arguments[0]) < 7) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 6 && (arguments.length <= 0 ? undefined : arguments[0]) < 11) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else {
						return arguments.length <= 5 ? undefined : arguments[5];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 0) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 3 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 <= 10) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 11) {
						return arguments.length <= 5 ? undefined : arguments[5];
					} else {
						return arguments.length <= 6 ? undefined : arguments[6];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 > 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 11) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 > 10 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 20) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) !== 11 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) !== 8 && (arguments.length <= 0 ? undefined : arguments[0]) !== 11) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 0 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 3) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 0) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}];
			}();

			return _pluralforms[form].apply(null, [number].concat(input));
		};

		if (i18n[language] !== undefined) {
			str = i18n[language][message];
			if (pluralparam !== null && typeof pluralparam === 'number') {
				pluralform = i18n[language]['mejs.plural-form'];
				str = _plural.apply(null, [str, pluralparam, pluralform]);
			}
		}

		if (!str && i18n.en) {
			str = i18n.en[message];
			if (pluralparam !== null && typeof pluralparam === 'number') {
				pluralform = i18n.en['mejs.plural-form'];
				str = _plural.apply(null, [str, pluralparam, pluralform]);
			}
		}

		str = str || message;

		if (pluralparam !== null && typeof pluralparam === 'number') {
			str = str.replace('%1', pluralparam);
		}

		return (0, _general.escapehtml)(str);
	}

	return message;
};

_mejs2.default.i18n = i18n;

if (typeof mejsl10n !== 'undefined') {
	_mejs2.default.i18n.language(mejsl10n.language, mejsl10n.strings);
}

exports.default = i18n;

},{"15":15,"27":27,"7":7}],6:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _general = _dereq_(27);

var _media2 = _dereq_(28);

var _renderer = _dereq_(8);

var _constants = _dereq_(25);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

function _classcallcheck(instance, constructor) { if (!(instance instanceof constructor)) { throw new typeerror("cannot call a class as a function"); } }

var mediaelement = function mediaelement(idornode, options, sources) {
	var _this = this;

	_classcallcheck(this, mediaelement);

	var t = this;

	sources = array.isarray(sources) ? sources : null;

	t.defaults = {
		renderers: [],

		fakenodename: 'mediaelementwrapper',

		pluginpath: 'build/',

		shimscriptaccess: 'samedomain'
	};

	options = object.assign(t.defaults, options);

	t.mediaelement = _document2.default.createelement(options.fakenodename);

	var id = idornode,
	    error = false;

	if (typeof idornode === 'string') {
		t.mediaelement.originalnode = _document2.default.getelementbyid(idornode);
	} else {
		t.mediaelement.originalnode = idornode;
		id = idornode.id;
	}

	if (t.mediaelement.originalnode === undefined || t.mediaelement.originalnode === null) {
		return null;
	}

	t.mediaelement.options = options;
	id = id || 'mejs_' + math.random().tostring().slice(2);

	t.mediaelement.originalnode.setattribute('id', id + '_from_mejs');

	var tagname = t.mediaelement.originalnode.tagname.tolowercase();
	if (['video', 'audio'].indexof(tagname) > -1 && !t.mediaelement.originalnode.getattribute('preload')) {
		t.mediaelement.originalnode.setattribute('preload', 'none');
	}

	t.mediaelement.originalnode.parentnode.insertbefore(t.mediaelement, t.mediaelement.originalnode);

	t.mediaelement.appendchild(t.mediaelement.originalnode);

	var processurl = function processurl(url, type) {
		if (_window2.default.location.protocol === 'https:' && url.indexof('http:') === 0 && _constants.is_ios && _mejs2.default.html5media.mediatypes.indexof(type) > -1) {
			var xhr = new xmlhttprequest();
			xhr.onreadystatechange = function () {
				if (this.readystate === 4 && this.status === 200) {
					var _url = _window2.default.url || _window2.default.webkiturl,
					    bloburl = _url.createobjecturl(this.response);
					t.mediaelement.originalnode.setattribute('src', bloburl);
					return bloburl;
				}
				return url;
			};
			xhr.open('get', url);
			xhr.responsetype = 'blob';
			xhr.send();
		}

		return url;
	};

	var mediafiles = void 0;

	if (sources !== null) {
		mediafiles = sources;
	} else if (t.mediaelement.originalnode !== null) {

		mediafiles = [];

		switch (t.mediaelement.originalnode.nodename.tolowercase()) {
			case 'iframe':
				mediafiles.push({
					type: '',
					src: t.mediaelement.originalnode.getattribute('src')
				});
				break;
			case 'audio':
			case 'video':
				var _sources = t.mediaelement.originalnode.children.length,
				    nodesource = t.mediaelement.originalnode.getattribute('src');

				if (nodesource) {
					var node = t.mediaelement.originalnode,
					    type = (0, _media2.formattype)(nodesource, node.getattribute('type'));
					mediafiles.push({
						type: type,
						src: processurl(nodesource, type)
					});
				}

				for (var i = 0; i < _sources; i++) {
					var n = t.mediaelement.originalnode.children[i];
					if (n.tagname.tolowercase() === 'source') {
						var src = n.getattribute('src'),
						    _type = (0, _media2.formattype)(src, n.getattribute('type'));
						mediafiles.push({ type: _type, src: processurl(src, _type) });
					}
				}
				break;
		}
	}

	t.mediaelement.id = id;
	t.mediaelement.renderers = {};
	t.mediaelement.events = {};
	t.mediaelement.promises = [];
	t.mediaelement.renderer = null;
	t.mediaelement.renderername = null;

	t.mediaelement.changerenderer = function (renderername, mediafiles) {

		var t = _this,
		    media = object.keys(mediafiles[0]).length > 2 ? mediafiles[0] : mediafiles[0].src;

		if (t.mediaelement.renderer !== undefined && t.mediaelement.renderer !== null && t.mediaelement.renderer.name === renderername) {
			t.mediaelement.renderer.pause();
			if (t.mediaelement.renderer.stop) {
				t.mediaelement.renderer.stop();
			}
			t.mediaelement.renderer.show();
			t.mediaelement.renderer.setsrc(media);
			return true;
		}

		if (t.mediaelement.renderer !== undefined && t.mediaelement.renderer !== null) {
			t.mediaelement.renderer.pause();
			if (t.mediaelement.renderer.stop) {
				t.mediaelement.renderer.stop();
			}
			t.mediaelement.renderer.hide();
		}

		var newrenderer = t.mediaelement.renderers[renderername],
		    newrenderertype = null;

		if (newrenderer !== undefined && newrenderer !== null) {
			newrenderer.show();
			newrenderer.setsrc(media);
			t.mediaelement.renderer = newrenderer;
			t.mediaelement.renderername = renderername;
			return true;
		}

		var rendererarray = t.mediaelement.options.renderers.length ? t.mediaelement.options.renderers : _renderer.renderer.order;

		for (var _i = 0, total = rendererarray.length; _i < total; _i++) {
			var index = rendererarray[_i];

			if (index === renderername) {
				var rendererlist = _renderer.renderer.renderers;
				newrenderertype = rendererlist[index];

				var renderoptions = object.assign(newrenderertype.options, t.mediaelement.options);
				newrenderer = newrenderertype.create(t.mediaelement, renderoptions, mediafiles);
				newrenderer.name = renderername;

				t.mediaelement.renderers[newrenderertype.name] = newrenderer;
				t.mediaelement.renderer = newrenderer;
				t.mediaelement.renderername = renderername;
				newrenderer.show();
				return true;
			}
		}

		return false;
	};

	t.mediaelement.setsize = function (width, height) {
		if (t.mediaelement.renderer !== undefined && t.mediaelement.renderer !== null) {
			t.mediaelement.renderer.setsize(width, height);
		}
	};

	t.mediaelement.generateerror = function (message, urllist) {
		message = message || '';
		urllist = array.isarray(urllist) ? urllist : [];
		var event = (0, _general.createevent)('error', t.mediaelement);
		event.message = message;
		event.urls = urllist;
		t.mediaelement.dispatchevent(event);
		error = true;
	};

	var props = _mejs2.default.html5media.properties,
	    methods = _mejs2.default.html5media.methods,
	    addproperty = function addproperty(obj, name, onget, onset) {
		var oldvalue = obj[name];
		var getfn = function getfn() {
			return onget.apply(obj, [oldvalue]);
		},
		    setfn = function setfn(newvalue) {
			oldvalue = onset.apply(obj, [newvalue]);
			return oldvalue;
		};

		object.defineproperty(obj, name, {
			get: getfn,
			set: setfn
		});
	},
	    assigngetterssetters = function assigngetterssetters(propname) {
		if (propname !== 'src') {

			var capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1),
			    getfn = function getfn() {
				return t.mediaelement.renderer !== undefined && t.mediaelement.renderer !== null && typeof t.mediaelement.renderer['get' + capname] === 'function' ? t.mediaelement.renderer['get' + capname]() : null;
			},
			    setfn = function setfn(value) {
				if (t.mediaelement.renderer !== undefined && t.mediaelement.renderer !== null && typeof t.mediaelement.renderer['set' + capname] === 'function') {
					t.mediaelement.renderer['set' + capname](value);
				}
			};

			addproperty(t.mediaelement, propname, getfn, setfn);
			t.mediaelement['get' + capname] = getfn;
			t.mediaelement['set' + capname] = setfn;
		}
	},
	    getsrc = function getsrc() {
		return t.mediaelement.renderer !== undefined && t.mediaelement.renderer !== null ? t.mediaelement.renderer.getsrc() : null;
	},
	    setsrc = function setsrc(value) {
		var mediafiles = [];

		if (typeof value === 'string') {
			mediafiles.push({
				src: value,
				type: value ? (0, _media2.gettypefromfile)(value) : ''
			});
		} else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src !== undefined) {
			var _src = (0, _media2.absolutizeurl)(value.src),
			    _type2 = value.type,
			    media = object.assign(value, {
				src: _src,
				type: (_type2 === '' || _type2 === null || _type2 === undefined) && _src ? (0, _media2.gettypefromfile)(_src) : _type2
			});
			mediafiles.push(media);
		} else if (array.isarray(value)) {
			for (var _i2 = 0, total = value.length; _i2 < total; _i2++) {

				var _src2 = (0, _media2.absolutizeurl)(value[_i2].src),
				    _type3 = value[_i2].type,
				    _media = object.assign(value[_i2], {
					src: _src2,
					type: (_type3 === '' || _type3 === null || _type3 === undefined) && _src2 ? (0, _media2.gettypefromfile)(_src2) : _type3
				});

				mediafiles.push(_media);
			}
		}

		var renderinfo = _renderer.renderer.select(mediafiles, t.mediaelement.options.renderers.length ? t.mediaelement.options.renderers : []),
		    event = void 0;

		if (!t.mediaelement.paused && !(t.mediaelement.src == null || t.mediaelement.src === '')) {
			t.mediaelement.pause();
			event = (0, _general.createevent)('pause', t.mediaelement);
			t.mediaelement.dispatchevent(event);
		}
		t.mediaelement.originalnode.src = mediafiles[0].src || '';

		if (renderinfo === null && mediafiles[0].src) {
			t.mediaelement.generateerror('no renderer found', mediafiles);
			return;
		}

		var shouldchangerenderer = !(mediafiles[0].src == null || mediafiles[0].src === '');
		return shouldchangerenderer ? t.mediaelement.changerenderer(renderinfo.renderername, mediafiles) : null;
	},
	    triggeraction = function triggeraction(methodname, args) {
		try {
			if (methodname === 'play' && (t.mediaelement.renderername === 'native_dash' || t.mediaelement.renderername === 'native_hls' || t.mediaelement.renderername === 'vimeo_iframe')) {
				var response = t.mediaelement.renderer[methodname](args);
				if (response && typeof response.then === 'function') {
					response.catch(function () {
						if (t.mediaelement.paused) {
							settimeout(function () {
								var tmpresponse = t.mediaelement.renderer.play();
								if (tmpresponse !== undefined) {
									tmpresponse.catch(function () {
										if (!t.mediaelement.renderer.paused) {
											t.mediaelement.renderer.pause();
										}
									});
								}
							}, 150);
						}
					});
				}
			} else {
				t.mediaelement.renderer[methodname](args);
			}
		} catch (e) {
			t.mediaelement.generateerror(e, mediafiles);
		}
	},
	    assignmethods = function assignmethods(methodname) {
		t.mediaelement[methodname] = function () {
			for (var _len = arguments.length, args = array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			if (t.mediaelement.renderer !== undefined && t.mediaelement.renderer !== null && typeof t.mediaelement.renderer[methodname] === 'function') {
				if (t.mediaelement.promises.length) {
					promise.all(t.mediaelement.promises).then(function () {
						triggeraction(methodname, args);
					}).catch(function (e) {
						t.mediaelement.generateerror(e, mediafiles);
					});
				} else {
					triggeraction(methodname, args);
				}
			}
			return null;
		};
	};

	addproperty(t.mediaelement, 'src', getsrc, setsrc);
	t.mediaelement.getsrc = getsrc;
	t.mediaelement.setsrc = setsrc;

	for (var _i3 = 0, total = props.length; _i3 < total; _i3++) {
		assigngetterssetters(props[_i3]);
	}

	for (var _i4 = 0, _total = methods.length; _i4 < _total; _i4++) {
		assignmethods(methods[_i4]);
	}

	t.mediaelement.addeventlistener = function (eventname, callback) {
		t.mediaelement.events[eventname] = t.mediaelement.events[eventname] || [];

		t.mediaelement.events[eventname].push(callback);
	};
	t.mediaelement.removeeventlistener = function (eventname, callback) {
		if (!eventname) {
			t.mediaelement.events = {};
			return true;
		}

		var callbacks = t.mediaelement.events[eventname];

		if (!callbacks) {
			return true;
		}

		if (!callback) {
			t.mediaelement.events[eventname] = [];
			return true;
		}

		for (var _i5 = 0; _i5 < callbacks.length; _i5++) {
			if (callbacks[_i5] === callback) {
				t.mediaelement.events[eventname].splice(_i5, 1);
				return true;
			}
		}
		return false;
	};

	t.mediaelement.dispatchevent = function (event) {
		var callbacks = t.mediaelement.events[event.type];
		if (callbacks) {
			for (var _i6 = 0; _i6 < callbacks.length; _i6++) {
				callbacks[_i6].apply(null, [event]);
			}
		}
	};

	t.mediaelement.destroy = function () {
		var mediaelement = t.mediaelement.originalnode.clonenode(true);
		var wrapper = t.mediaelement.parentelement;
		mediaelement.removeattribute('id');
		mediaelement.remove();
		t.mediaelement.remove();
		wrapper.appendchild(mediaelement);
	};

	if (mediafiles.length) {
		t.mediaelement.src = mediafiles;
	}

	if (t.mediaelement.promises.length) {
		promise.all(t.mediaelement.promises).then(function () {
			if (t.mediaelement.options.success) {
				t.mediaelement.options.success(t.mediaelement, t.mediaelement.originalnode);
			}
		}).catch(function () {
			if (error && t.mediaelement.options.error) {
				t.mediaelement.options.error(t.mediaelement, t.mediaelement.originalnode);
			}
		});
	} else {
		if (t.mediaelement.options.success) {
			t.mediaelement.options.success(t.mediaelement, t.mediaelement.originalnode);
		}

		if (error && t.mediaelement.options.error) {
			t.mediaelement.options.error(t.mediaelement, t.mediaelement.originalnode);
		}
	}

	return t.mediaelement;
};

_window2.default.mediaelement = mediaelement;
_mejs2.default.mediaelement = mediaelement;

exports.default = mediaelement;

},{"2":2,"25":25,"27":27,"28":28,"3":3,"7":7,"8":8}],7:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var mejs = {};

mejs.version = '4.2.17';

mejs.html5media = {
	properties: ['volume', 'src', 'currenttime', 'muted', 'duration', 'paused', 'ended', 'buffered', 'error', 'networkstate', 'readystate', 'seeking', 'seekable', 'currentsrc', 'preload', 'bufferedbytes', 'bufferedtime', 'initialtime', 'startoffsettime', 'defaultplaybackrate', 'playbackrate', 'played', 'autoplay', 'loop', 'controls'],
	readonlyproperties: ['duration', 'paused', 'ended', 'buffered', 'error', 'networkstate', 'readystate', 'seeking', 'seekable'],

	methods: ['load', 'play', 'pause', 'canplaytype'],

	events: ['loadstart', 'durationchange', 'loadedmetadata', 'loadeddata', 'progress', 'canplay', 'canplaythrough', 'suspend', 'abort', 'error', 'emptied', 'stalled', 'play', 'playing', 'pause', 'waiting', 'seeking', 'seeked', 'timeupdate', 'ended', 'ratechange', 'volumechange'],

	mediatypes: ['audio/mp3', 'audio/ogg', 'audio/oga', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/x-pn-wav', 'audio/mpeg', 'audio/mp4', 'video/mp4', 'video/webm', 'video/ogg', 'video/ogv']
};

_window2.default.mejs = mejs;

exports.default = mejs;

},{"3":3}],8:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});
exports.renderer = undefined;

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _createclass = function () { function defineproperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; object.defineproperty(target, descriptor.key, descriptor); } } return function (constructor, protoprops, staticprops) { if (protoprops) defineproperties(constructor.prototype, protoprops); if (staticprops) defineproperties(constructor, staticprops); return constructor; }; }();

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

function _classcallcheck(instance, constructor) { if (!(instance instanceof constructor)) { throw new typeerror("cannot call a class as a function"); } }

var renderer = function () {
	function renderer() {
		_classcallcheck(this, renderer);

		this.renderers = {};
		this.order = [];
	}

	_createclass(renderer, [{
		key: 'add',
		value: function add(renderer) {
			if (renderer.name === undefined) {
				throw new typeerror('renderer must contain at least `name` property');
			}

			this.renderers[renderer.name] = renderer;
			this.order.push(renderer.name);
		}
	}, {
		key: 'select',
		value: function select(mediafiles) {
			var renderers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			var rendererslength = renderers.length;

			renderers = renderers.length ? renderers : this.order;

			if (!rendererslength) {
				var rendererindicator = [/^(html5|native)/i, /^flash/i, /iframe$/i],
				    rendererranking = function rendererranking(renderer) {
					for (var i = 0, total = rendererindicator.length; i < total; i++) {
						if (rendererindicator[i].test(renderer)) {
							return i;
						}
					}
					return rendererindicator.length;
				};

				renderers.sort(function (a, b) {
					return rendererranking(a) - rendererranking(b);
				});
			}

			for (var i = 0, total = renderers.length; i < total; i++) {
				var key = renderers[i],
				    _renderer = this.renderers[key];

				if (_renderer !== null && _renderer !== undefined) {
					for (var j = 0, jl = mediafiles.length; j < jl; j++) {
						if (typeof _renderer.canplaytype === 'function' && typeof mediafiles[j].type === 'string' && _renderer.canplaytype(mediafiles[j].type)) {
							return {
								renderername: _renderer.name,
								src: mediafiles[j].src
							};
						}
					}
				}
			}

			return null;
		}
	}, {
		key: 'order',
		set: function set(order) {
			if (!array.isarray(order)) {
				throw new typeerror('order must be an array of strings.');
			}

			this._order = order;
		},
		get: function get() {
			return this._order;
		}
	}, {
		key: 'renderers',
		set: function set(renderers) {
			if (renderers !== null && (typeof renderers === 'undefined' ? 'undefined' : _typeof(renderers)) !== 'object') {
				throw new typeerror('renderers must be an array of objects.');
			}

			this._renderers = renderers;
		},
		get: function get() {
			return this._renderers;
		}
	}]);

	return renderer;
}();

var renderer = exports.renderer = new renderer();

_mejs2.default.renderers = renderer;

},{"7":7}],9:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _i18n = _dereq_(5);

var _i18n2 = _interoprequiredefault(_i18n);

var _player = _dereq_(16);

var _player2 = _interoprequiredefault(_player);

var _constants = _dereq_(25);

var features = _interoprequirewildcard(_constants);

var _general = _dereq_(27);

var _dom = _dereq_(26);

var _media = _dereq_(28);

function _interoprequirewildcard(obj) { if (obj && obj.__esmodule) { return obj; } else { var newobj = {}; if (obj != null) { for (var key in obj) { if (object.prototype.hasownproperty.call(obj, key)) newobj[key] = obj[key]; } } newobj.default = obj; return newobj; } }

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

object.assign(_player.config, {
	usepluginfullscreen: true,

	fullscreentext: null,

	usefakefullscreen: false
});

object.assign(_player2.default.prototype, {
	isfullscreen: false,

	isnativefullscreen: false,

	isiniframe: false,

	ispluginclickthroughcreated: false,

	fullscreenmode: '',

	containersizetimeout: null,

	buildfullscreen: function buildfullscreen(player) {
		if (!player.isvideo) {
			return;
		}

		player.isiniframe = _window2.default.location !== _window2.default.parent.location;

		player.detectfullscreenmode();

		var t = this,
		    fullscreentitle = (0, _general.isstring)(t.options.fullscreentext) ? t.options.fullscreentext : _i18n2.default.t('mejs.fullscreen'),
		    fullscreenbtn = _document2.default.createelement('div');

		fullscreenbtn.classname = t.options.classprefix + 'button ' + t.options.classprefix + 'fullscreen-button';
		fullscreenbtn.innerhtml = '<button type="button" aria-controls="' + t.id + '" title="' + fullscreentitle + '" aria-label="' + fullscreentitle + '" tabindex="0"></button>';
		t.addcontrolelement(fullscreenbtn, 'fullscreen');

		fullscreenbtn.addeventlistener('click', function () {
			var isfullscreen = features.has_true_native_fullscreen && features.is_fullscreen || player.isfullscreen;

			if (isfullscreen) {
				player.exitfullscreen();
			} else {
				player.enterfullscreen();
			}
		});

		player.fullscreenbtn = fullscreenbtn;

		t.options.keyactions.push({
			keys: [70],
			action: function action(player, media, key, event) {
				if (!event.ctrlkey) {
					if (typeof player.enterfullscreen !== 'undefined') {
						if (player.isfullscreen) {
							player.exitfullscreen();
						} else {
							player.enterfullscreen();
						}
					}
				}
			}
		});

		t.exitfullscreencallback = function (e) {
			var key = e.which || e.keycode || 0;
			if (t.options.enablekeyboard && key === 27 && (features.has_true_native_fullscreen && features.is_fullscreen || t.isfullscreen)) {
				player.exitfullscreen();
			}
		};

		t.globalbind('keydown', t.exitfullscreencallback);

		t.normalheight = 0;
		t.normalwidth = 0;

		if (features.has_true_native_fullscreen) {
			var fullscreenchanged = function fullscreenchanged() {
				if (player.isfullscreen) {
					if (features.isfullscreen()) {
						player.isnativefullscreen = true;

						player.setcontrolssize();
					} else {
						player.isnativefullscreen = false;

						player.exitfullscreen();
					}
				}
			};

			player.globalbind(features.fullscreen_event_name, fullscreenchanged);
		}
	},
	cleanfullscreen: function cleanfullscreen(player) {
		player.exitfullscreen();
		player.globalunbind('keydown', player.exitfullscreencallback);
	},
	detectfullscreenmode: function detectfullscreenmode() {
		var t = this,
		    isnative = t.media.renderername !== null && /(native|html5)/i.test(t.media.renderername);

		var mode = '';

		if (features.has_true_native_fullscreen && isnative) {
			mode = 'native-native';
		} else if (features.has_true_native_fullscreen && !isnative) {
			mode = 'plugin-native';
		} else if (t.usepluginfullscreen && features.support_pointer_events) {
			mode = 'plugin-click';
		}

		t.fullscreenmode = mode;
		return mode;
	},
	enterfullscreen: function enterfullscreen() {
		var t = this,
		    isnative = t.media.renderername !== null && /(html5|native)/i.test(t.media.renderername),
		    containerstyles = getcomputedstyle(t.getelement(t.container));

		if (!t.isvideo) {
			return;
		}

		if (t.options.usefakefullscreen === false && (features.is_ios || features.is_safari) && features.has_ios_fullscreen && typeof t.media.originalnode.webkitenterfullscreen === 'function' && t.media.originalnode.canplaytype((0, _media.gettypefromfile)(t.media.getsrc()))) {
			t.media.originalnode.webkitenterfullscreen();
			return;
		}

		(0, _dom.addclass)(_document2.default.documentelement, t.options.classprefix + 'fullscreen');
		(0, _dom.addclass)(t.getelement(t.container), t.options.classprefix + 'container-fullscreen');

		t.normalheight = parsefloat(containerstyles.height);
		t.normalwidth = parsefloat(containerstyles.width);

		if (t.fullscreenmode === 'native-native' || t.fullscreenmode === 'plugin-native') {
			features.requestfullscreen(t.getelement(t.container));

			if (t.isiniframe) {
				settimeout(function checkfullscreen() {

					if (t.isnativefullscreen) {
						var percenterrormargin = 0.002,
						    windowwidth = _window2.default.innerwidth || _document2.default.documentelement.clientwidth || _document2.default.body.clientwidth,
						    screenwidth = screen.width,
						    absdiff = math.abs(screenwidth - windowwidth),
						    marginerror = screenwidth * percenterrormargin;

						if (absdiff > marginerror) {
							t.exitfullscreen();
						} else {
							settimeout(checkfullscreen, 500);
						}
					}
				}, 1000);
			}
		}

		t.getelement(t.container).style.width = '100%';
		t.getelement(t.container).style.height = '100%';

		t.containersizetimeout = settimeout(function () {
			t.getelement(t.container).style.width = '100%';
			t.getelement(t.container).style.height = '100%';
			t.setcontrolssize();
		}, 500);

		if (isnative) {
			t.node.style.width = '100%';
			t.node.style.height = '100%';
		} else {
			var elements = t.getelement(t.container).queryselectorall('embed, object, video'),
			    _total = elements.length;
			for (var i = 0; i < _total; i++) {
				elements[i].style.width = '100%';
				elements[i].style.height = '100%';
			}
		}

		if (t.options.setdimensions && typeof t.media.setsize === 'function') {
			t.media.setsize(screen.width, screen.height);
		}

		var layers = t.getelement(t.layers).children,
		    total = layers.length;
		for (var _i = 0; _i < total; _i++) {
			layers[_i].style.width = '100%';
			layers[_i].style.height = '100%';
		}

		if (t.fullscreenbtn) {
			(0, _dom.removeclass)(t.fullscreenbtn, t.options.classprefix + 'fullscreen');
			(0, _dom.addclass)(t.fullscreenbtn, t.options.classprefix + 'unfullscreen');
		}

		t.setcontrolssize();
		t.isfullscreen = true;

		var zoomfactor = math.min(screen.width / t.width, screen.height / t.height),
		    captiontext = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'captions-text');
		if (captiontext) {
			captiontext.style.fontsize = zoomfactor * 100 + '%';
			captiontext.style.lineheight = 'normal';
			t.getelement(t.container).queryselector('.' + t.options.classprefix + 'captions-position').style.bottom = (screen.height - t.normalheight) / 2 - t.getelement(t.controls).offsetheight / 2 + zoomfactor + 15 + 'px';
		}
		var event = (0, _general.createevent)('enteredfullscreen', t.getelement(t.container));
		t.getelement(t.container).dispatchevent(event);
	},
	exitfullscreen: function exitfullscreen() {
		var t = this,
		    isnative = t.media.renderername !== null && /(native|html5)/i.test(t.media.renderername);

		if (!t.isvideo) {
			return;
		}

		cleartimeout(t.containersizetimeout);

		if (features.has_true_native_fullscreen && (features.is_fullscreen || t.isfullscreen)) {
			features.cancelfullscreen();
		}

		(0, _dom.removeclass)(_document2.default.documentelement, t.options.classprefix + 'fullscreen');
		(0, _dom.removeclass)(t.getelement(t.container), t.options.classprefix + 'container-fullscreen');

		if (t.options.setdimensions) {
			t.getelement(t.container).style.width = t.normalwidth + 'px';
			t.getelement(t.container).style.height = t.normalheight + 'px';

			if (isnative) {
				t.node.style.width = t.normalwidth + 'px';
				t.node.style.height = t.normalheight + 'px';
			} else {
				var elements = t.getelement(t.container).queryselectorall('embed, object, video'),
				    _total2 = elements.length;
				for (var i = 0; i < _total2; i++) {
					elements[i].style.width = t.normalwidth + 'px';
					elements[i].style.height = t.normalheight + 'px';
				}
			}

			if (typeof t.media.setsize === 'function') {
				t.media.setsize(t.normalwidth, t.normalheight);
			}

			var layers = t.getelement(t.layers).children,
			    total = layers.length;
			for (var _i2 = 0; _i2 < total; _i2++) {
				layers[_i2].style.width = t.normalwidth + 'px';
				layers[_i2].style.height = t.normalheight + 'px';
			}
		}

		if (t.fullscreenbtn) {
			(0, _dom.removeclass)(t.fullscreenbtn, t.options.classprefix + 'unfullscreen');
			(0, _dom.addclass)(t.fullscreenbtn, t.options.classprefix + 'fullscreen');
		}

		t.setcontrolssize();
		t.isfullscreen = false;

		var captiontext = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'captions-text');
		if (captiontext) {
			captiontext.style.fontsize = '';
			captiontext.style.lineheight = '';
			t.getelement(t.container).queryselector('.' + t.options.classprefix + 'captions-position').style.bottom = '';
		}
		var event = (0, _general.createevent)('exitedfullscreen', t.getelement(t.container));
		t.getelement(t.container).dispatchevent(event);
	}
});

},{"16":16,"2":2,"25":25,"26":26,"27":27,"28":28,"3":3,"5":5}],10:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _player = _dereq_(16);

var _player2 = _interoprequiredefault(_player);

var _i18n = _dereq_(5);

var _i18n2 = _interoprequiredefault(_i18n);

var _general = _dereq_(27);

var _dom = _dereq_(26);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

object.assign(_player.config, {
	playtext: null,

	pausetext: null
});

object.assign(_player2.default.prototype, {
	buildplaypause: function buildplaypause(player, controls, layers, media) {
		var t = this,
		    op = t.options,
		    playtitle = (0, _general.isstring)(op.playtext) ? op.playtext : _i18n2.default.t('mejs.play'),
		    pausetitle = (0, _general.isstring)(op.pausetext) ? op.pausetext : _i18n2.default.t('mejs.pause'),
		    play = _document2.default.createelement('div');

		play.classname = t.options.classprefix + 'button ' + t.options.classprefix + 'playpause-button ' + t.options.classprefix + 'play';
		play.innerhtml = '<button type="button" aria-controls="' + t.id + '" title="' + playtitle + '" aria-label="' + pausetitle + '" tabindex="0"></button>';
		play.addeventlistener('click', function () {
			if (t.paused) {
				t.play();
			} else {
				t.pause();
			}
		});

		var playbtn = play.queryselector('button');
		t.addcontrolelement(play, 'playpause');

		function toggleplaypause(which) {
			if ('play' === which) {
				(0, _dom.removeclass)(play, t.options.classprefix + 'play');
				(0, _dom.removeclass)(play, t.options.classprefix + 'replay');
				(0, _dom.addclass)(play, t.options.classprefix + 'pause');
				playbtn.setattribute('title', pausetitle);
				playbtn.setattribute('aria-label', pausetitle);
			} else {

				(0, _dom.removeclass)(play, t.options.classprefix + 'pause');
				(0, _dom.removeclass)(play, t.options.classprefix + 'replay');
				(0, _dom.addclass)(play, t.options.classprefix + 'play');
				playbtn.setattribute('title', playtitle);
				playbtn.setattribute('aria-label', playtitle);
			}
		}

		toggleplaypause('pse');

		media.addeventlistener('loadedmetadata', function () {
			if (media.renderername.indexof('flash') === -1) {
				toggleplaypause('pse');
			}
		});
		media.addeventlistener('play', function () {
			toggleplaypause('play');
		});
		media.addeventlistener('playing', function () {
			toggleplaypause('play');
		});
		media.addeventlistener('pause', function () {
			toggleplaypause('pse');
		});
		media.addeventlistener('ended', function () {
			if (!player.options.loop) {
				(0, _dom.removeclass)(play, t.options.classprefix + 'pause');
				(0, _dom.removeclass)(play, t.options.classprefix + 'play');
				(0, _dom.addclass)(play, t.options.classprefix + 'replay');
				playbtn.setattribute('title', playtitle);
				playbtn.setattribute('aria-label', playtitle);
			}
		});
	}
});

},{"16":16,"2":2,"26":26,"27":27,"5":5}],11:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _player = _dereq_(16);

var _player2 = _interoprequiredefault(_player);

var _i18n = _dereq_(5);

var _i18n2 = _interoprequiredefault(_i18n);

var _constants = _dereq_(25);

var _time = _dereq_(30);

var _dom = _dereq_(26);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

object.assign(_player.config, {
	enableprogresstooltip: true,

	usesmoothhover: true,

	forcelive: false
});

object.assign(_player2.default.prototype, {
	buildprogress: function buildprogress(player, controls, layers, media) {

		var lastkeypresstime = 0,
		    mouseisdown = false,
		    startedpaused = false;

		var t = this,
		    autorewindinitial = player.options.autorewind,
		    tooltip = player.options.enableprogresstooltip ? '<span class="' + t.options.classprefix + 'time-float">' + ('<span class="' + t.options.classprefix + 'time-float-current">00:00</span>') + ('<span class="' + t.options.classprefix + 'time-float-corner"></span>') + '</span>' : '',
		    rail = _document2.default.createelement('div');

		rail.classname = t.options.classprefix + 'time-rail';
		rail.innerhtml = '<span class="' + t.options.classprefix + 'time-total ' + t.options.classprefix + 'time-slider">' + ('<span class="' + t.options.classprefix + 'time-buffering"></span>') + ('<span class="' + t.options.classprefix + 'time-loaded"></span>') + ('<span class="' + t.options.classprefix + 'time-current"></span>') + ('<span class="' + t.options.classprefix + 'time-hovered no-hover"></span>') + ('<span class="' + t.options.classprefix + 'time-handle"><span class="' + t.options.classprefix + 'time-handle-content"></span></span>') + ('' + tooltip) + '</span>';

		t.addcontrolelement(rail, 'progress');

		t.options.keyactions.push({
			keys: [37, 227],
			action: function action(player) {
				if (!isnan(player.duration) && player.duration > 0) {
					if (player.isvideo) {
						player.showcontrols();
						player.startcontrolstimer();
					}

					var timeslider = player.getelement(player.container).queryselector('.' + t.options.classprefix + 'time-total');
					if (timeslider) {
						timeslider.focus();
					}

					var newtime = math.max(player.currenttime - player.options.defaultseekbackwardinterval(player), 0);

					if (!player.paused) {
						player.pause();
					}

					settimeout(function () {
						player.setcurrenttime(newtime);
					}, 0);

					settimeout(function () {
						player.play();
					}, 0);
				}
			}
		}, {
			keys: [39, 228],
			action: function action(player) {

				if (!isnan(player.duration) && player.duration > 0) {
					if (player.isvideo) {
						player.showcontrols();
						player.startcontrolstimer();
					}

					var timeslider = player.getelement(player.container).queryselector('.' + t.options.classprefix + 'time-total');
					if (timeslider) {
						timeslider.focus();
					}

					var newtime = math.min(player.currenttime + player.options.defaultseekforwardinterval(player), player.duration);

					if (!player.paused) {
						player.pause();
					}

					settimeout(function () {
						player.setcurrenttime(newtime);
					}, 0);

					settimeout(function () {
						player.play();
					}, 0);
				}
			}
		});

		t.rail = controls.queryselector('.' + t.options.classprefix + 'time-rail');
		t.total = controls.queryselector('.' + t.options.classprefix + 'time-total');
		t.loaded = controls.queryselector('.' + t.options.classprefix + 'time-loaded');
		t.current = controls.queryselector('.' + t.options.classprefix + 'time-current');
		t.handle = controls.queryselector('.' + t.options.classprefix + 'time-handle');
		t.timefloat = controls.queryselector('.' + t.options.classprefix + 'time-float');
		t.timefloatcurrent = controls.queryselector('.' + t.options.classprefix + 'time-float-current');
		t.slider = controls.queryselector('.' + t.options.classprefix + 'time-slider');
		t.hovered = controls.queryselector('.' + t.options.classprefix + 'time-hovered');
		t.buffer = controls.queryselector('.' + t.options.classprefix + 'time-buffering');
		t.newtime = 0;
		t.forcedhandlepause = false;
		t.settransformstyle = function (element, value) {
			element.style.transform = value;
			element.style.webkittransform = value;
			element.style.moztransform = value;
			element.style.mstransform = value;
			element.style.otransform = value;
		};

		t.buffer.style.display = 'none';

		var handlemousemove = function handlemousemove(e) {
			var totalstyles = getcomputedstyle(t.total),
			    offsetstyles = (0, _dom.offset)(t.total),
			    width = t.total.offsetwidth,
			    transform = function () {
				if (totalstyles.webkittransform !== undefined) {
					return 'webkittransform';
				} else if (totalstyles.moztransform !== undefined) {
					return 'moztransform ';
				} else if (totalstyles.otransform !== undefined) {
					return 'otransform';
				} else if (totalstyles.mstransform !== undefined) {
					return 'mstransform';
				} else {
					return 'transform';
				}
			}(),
			    cssmatrix = function () {
				if ('webkitcssmatrix' in window) {
					return 'webkitcssmatrix';
				} else if ('mscssmatrix' in window) {
					return 'mscssmatrix';
				} else if ('cssmatrix' in window) {
					return 'cssmatrix';
				}
			}();

			var percentage = 0,
			    leftpos = 0,
			    pos = 0,
			    x = void 0;

			if (e.originalevent && e.originalevent.changedtouches) {
				x = e.originalevent.changedtouches[0].pagex;
			} else if (e.changedtouches) {
				x = e.changedtouches[0].pagex;
			} else {
				x = e.pagex;
			}

			if (t.getduration()) {
				if (x < offsetstyles.left) {
					x = offsetstyles.left;
				} else if (x > width + offsetstyles.left) {
					x = width + offsetstyles.left;
				}

				pos = x - offsetstyles.left;
				percentage = pos / width;
				t.newtime = percentage * t.getduration();

				if (mouseisdown && t.getcurrenttime() !== null && t.newtime.tofixed(4) !== t.getcurrenttime().tofixed(4)) {
					t.setcurrentrailhandle(t.newtime);
					t.updatecurrent(t.newtime);
				}

				if (!_constants.is_ios && !_constants.is_android) {
					if (pos < 0) {
						pos = 0;
					}
					if (t.options.usesmoothhover && cssmatrix !== null && typeof window[cssmatrix] !== 'undefined') {
						var matrix = new window[cssmatrix](getcomputedstyle(t.handle)[transform]),
						    handlelocation = matrix.m41,
						    hoverscalex = pos / parsefloat(getcomputedstyle(t.total).width) - handlelocation / parsefloat(getcomputedstyle(t.total).width);

						t.hovered.style.left = handlelocation + 'px';
						t.settransformstyle(t.hovered, 'scalex(' + hoverscalex + ')');
						t.hovered.setattribute('pos', pos);

						if (hoverscalex >= 0) {
							(0, _dom.removeclass)(t.hovered, 'negative');
						} else {
							(0, _dom.addclass)(t.hovered, 'negative');
						}
					}

					if (t.timefloat) {
						var half = t.timefloat.offsetwidth / 2,
						    offsetcontainer = mejs.utils.offset(t.getelement(t.container)),
						    tooltipstyles = getcomputedstyle(t.timefloat);

						if (x - offsetcontainer.left < t.timefloat.offsetwidth) {
							leftpos = half;
						} else if (x - offsetcontainer.left >= t.getelement(t.container).offsetwidth - half) {
							leftpos = t.total.offsetwidth - half;
						} else {
							leftpos = pos;
						}

						if ((0, _dom.hasclass)(t.getelement(t.container), t.options.classprefix + 'long-video')) {
							leftpos += parsefloat(tooltipstyles.marginleft) / 2 + t.timefloat.offsetwidth / 2;
						}

						t.timefloat.style.left = leftpos + 'px';
						t.timefloatcurrent.innerhtml = (0, _time.secondstotimecode)(t.newtime, player.options.alwaysshowhours, player.options.showtimecodeframecount, player.options.framespersecond, player.options.secondsdecimallength, player.options.timeformat);
						t.timefloat.style.display = 'block';
					}
				}
			} else if (!_constants.is_ios && !_constants.is_android && t.timefloat) {
				leftpos = t.timefloat.offsetwidth + width >= t.getelement(t.container).offsetwidth ? t.timefloat.offsetwidth / 2 : 0;
				t.timefloat.style.left = leftpos + 'px';
				t.timefloat.style.left = leftpos + 'px';
				t.timefloat.style.display = 'block';
			}
		},
		    updateslider = function updateslider() {
			var seconds = t.getcurrenttime(),
			    timeslidertext = _i18n2.default.t('mejs.time-slider'),
			    time = (0, _time.secondstotimecode)(seconds, player.options.alwaysshowhours, player.options.showtimecodeframecount, player.options.framespersecond, player.options.secondsdecimallength, player.options.timeformat),
			    duration = t.getduration();

			t.slider.setattribute('role', 'slider');
			t.slider.tabindex = 0;

			if (media.paused) {
				t.slider.setattribute('aria-label', timeslidertext);
				t.slider.setattribute('aria-valuemin', 0);
				t.slider.setattribute('aria-valuemax', isnan(duration) ? 0 : duration);
				t.slider.setattribute('aria-valuenow', seconds);
				t.slider.setattribute('aria-valuetext', time);
			} else {
				t.slider.removeattribute('aria-label');
				t.slider.removeattribute('aria-valuemin');
				t.slider.removeattribute('aria-valuemax');
				t.slider.removeattribute('aria-valuenow');
				t.slider.removeattribute('aria-valuetext');
			}
		},
		    restartplayer = function restartplayer() {
			if (new date() - lastkeypresstime >= 1000) {
				t.play();
			}
		},
		    handlemouseup = function handlemouseup() {
			if (mouseisdown && t.getcurrenttime() !== null && t.newtime.tofixed(4) !== t.getcurrenttime().tofixed(4)) {
				t.setcurrenttime(t.newtime);
				t.setcurrentrailhandle(t.newtime);
				t.updatecurrent(t.newtime);
			}
			if (t.forcedhandlepause) {
				t.slider.focus();
				t.play();
			}
			t.forcedhandlepause = false;
		};

		t.slider.addeventlistener('focus', function () {
			player.options.autorewind = false;
		});
		t.slider.addeventlistener('blur', function () {
			player.options.autorewind = autorewindinitial;
		});
		t.slider.addeventlistener('keydown', function (e) {
			if (new date() - lastkeypresstime >= 1000) {
				startedpaused = t.paused;
			}

			if (t.options.enablekeyboard && t.options.keyactions.length) {

				var keycode = e.which || e.keycode || 0,
				    duration = t.getduration(),
				    seekforward = player.options.defaultseekforwardinterval(media),
				    seekbackward = player.options.defaultseekbackwardinterval(media);

				var seektime = t.getcurrenttime();
				var volume = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'volume-slider');

				if (keycode === 38 || keycode === 40) {
					if (volume) {
						volume.style.display = 'block';
					}
					if (t.isvideo) {
						t.showcontrols();
						t.startcontrolstimer();
					}

					var newvolume = keycode === 38 ? math.min(t.volume + 0.1, 1) : math.max(t.volume - 0.1, 0),
					    muteplayer = newvolume <= 0;
					t.setvolume(newvolume);
					t.setmuted(muteplayer);
					return;
				} else {
					if (volume) {
						volume.style.display = 'none';
					}
				}

				switch (keycode) {
					case 37:
						if (t.getduration() !== infinity) {
							seektime -= seekbackward;
						}
						break;
					case 39:
						if (t.getduration() !== infinity) {
							seektime += seekforward;
						}
						break;
					case 36:
						seektime = 0;
						break;
					case 35:
						seektime = duration;
						break;
					case 13:
					case 32:
						if (_constants.is_firefox) {
							if (t.paused) {
								t.play();
							} else {
								t.pause();
							}
						}
						return;
					default:
						return;
				}

				seektime = seektime < 0 || isnan(seektime) ? 0 : seektime >= duration ? duration : math.floor(seektime);
				lastkeypresstime = new date();
				if (!startedpaused) {
					player.pause();
				}

				settimeout(function () {
					t.setcurrenttime(seektime);
				}, 0);

				if (seektime < t.getduration() && !startedpaused) {
					settimeout(restartplayer, 1100);
				}

				player.showcontrols();

				e.preventdefault();
				e.stoppropagation();
			}
		});

		var events = ['mousedown', 'touchstart'];

		t.slider.addeventlistener('dragstart', function () {
			return false;
		});

		for (var i = 0, total = events.length; i < total; i++) {
			t.slider.addeventlistener(events[i], function (e) {
				t.forcedhandlepause = false;
				if (t.getduration() !== infinity) {
					if (e.which === 1 || e.which === 0) {
						if (!t.paused) {
							t.pause();
							t.forcedhandlepause = true;
						}

						mouseisdown = true;
						handlemousemove(e);
						var endevents = ['mouseup', 'touchend'];

						for (var j = 0, totalevents = endevents.length; j < totalevents; j++) {
							t.getelement(t.container).addeventlistener(endevents[j], function (event) {
								var target = event.target;
								if (target === t.slider || target.closest('.' + t.options.classprefix + 'time-slider')) {
									handlemousemove(event);
								}
							});
						}
						t.globalbind('mouseup.dur touchend.dur', function () {
							handlemouseup();
							mouseisdown = false;
							if (t.timefloat) {
								t.timefloat.style.display = 'none';
							}
						});
					}
				}
			}, _constants.support_passive_event && events[i] === 'touchstart' ? { passive: true } : false);
		}
		t.slider.addeventlistener('mouseenter', function (e) {
			if (e.target === t.slider && t.getduration() !== infinity) {
				t.getelement(t.container).addeventlistener('mousemove', function (event) {
					var target = event.target;
					if (target === t.slider || target.closest('.' + t.options.classprefix + 'time-slider')) {
						handlemousemove(event);
					}
				});
				if (t.timefloat && !_constants.is_ios && !_constants.is_android) {
					t.timefloat.style.display = 'block';
				}
				if (t.hovered && !_constants.is_ios && !_constants.is_android && t.options.usesmoothhover) {
					(0, _dom.removeclass)(t.hovered, 'no-hover');
				}
			}
		});
		t.slider.addeventlistener('mouseleave', function () {
			if (t.getduration() !== infinity) {
				if (!mouseisdown) {
					if (t.timefloat) {
						t.timefloat.style.display = 'none';
					}
					if (t.hovered && t.options.usesmoothhover) {
						(0, _dom.addclass)(t.hovered, 'no-hover');
					}
				}
			}
		});

		t.broadcastcallback = function (e) {
			var broadcast = controls.queryselector('.' + t.options.classprefix + 'broadcast');
			if (!t.options.forcelive && t.getduration() !== infinity) {
				if (broadcast) {
					t.slider.style.display = '';
					broadcast.remove();
				}

				player.setprogressrail(e);
				if (!t.forcedhandlepause) {
					player.setcurrentrail(e);
				}
				updateslider();
			} else if (!broadcast && t.options.forcelive) {
				var label = _document2.default.createelement('span');
				label.classname = t.options.classprefix + 'broadcast';
				label.innertext = _i18n2.default.t('mejs.live-broadcast');
				t.slider.style.display = 'none';
				t.rail.appendchild(label);
			}
		};

		media.addeventlistener('progress', t.broadcastcallback);
		media.addeventlistener('timeupdate', t.broadcastcallback);
		media.addeventlistener('play', function () {
			t.buffer.style.display = 'none';
		});
		media.addeventlistener('playing', function () {
			t.buffer.style.display = 'none';
		});
		media.addeventlistener('seeking', function () {
			t.buffer.style.display = '';
		});
		media.addeventlistener('seeked', function () {
			t.buffer.style.display = 'none';
		});
		media.addeventlistener('pause', function () {
			t.buffer.style.display = 'none';
		});
		media.addeventlistener('waiting', function () {
			t.buffer.style.display = '';
		});
		media.addeventlistener('loadeddata', function () {
			t.buffer.style.display = '';
		});
		media.addeventlistener('canplay', function () {
			t.buffer.style.display = 'none';
		});
		media.addeventlistener('error', function () {
			t.buffer.style.display = 'none';
		});

		t.getelement(t.container).addeventlistener('controlsresize', function (e) {
			if (t.getduration() !== infinity) {
				player.setprogressrail(e);
				if (!t.forcedhandlepause) {
					player.setcurrentrail(e);
				}
			}
		});
	},
	cleanprogress: function cleanprogress(player, controls, layers, media) {
		media.removeeventlistener('progress', player.broadcastcallback);
		media.removeeventlistener('timeupdate', player.broadcastcallback);
		if (player.rail) {
			player.rail.remove();
		}
	},
	setprogressrail: function setprogressrail(e) {
		var t = this,
		    target = e !== undefined ? e.detail.target || e.target : t.media;

		var percent = null;

		if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && t.getduration()) {
			percent = target.buffered.end(target.buffered.length - 1) / t.getduration();
		} else if (target && target.bytestotal !== undefined && target.bytestotal > 0 && target.bufferedbytes !== undefined) {
				percent = target.bufferedbytes / target.bytestotal;
			} else if (e && e.lengthcomputable && e.total !== 0) {
					percent = e.loaded / e.total;
				}

		if (percent !== null) {
			percent = math.min(1, math.max(0, percent));

			if (t.loaded) {
				t.settransformstyle(t.loaded, 'scalex(' + percent + ')');
			}
		}
	},
	setcurrentrailhandle: function setcurrentrailhandle(faketime) {
		var t = this;
		t.setcurrentrailmain(t, faketime);
	},
	setcurrentrail: function setcurrentrail() {
		var t = this;
		t.setcurrentrailmain(t);
	},
	setcurrentrailmain: function setcurrentrailmain(t, faketime) {
		if (t.getcurrenttime() !== undefined && t.getduration()) {
			var ntime = typeof faketime === 'undefined' ? t.getcurrenttime() : faketime;

			if (t.total && t.handle) {
				var tw = parsefloat(getcomputedstyle(t.total).width);

				var newwidth = math.round(tw * ntime / t.getduration()),
				    handlepos = newwidth - math.round(t.handle.offsetwidth / 2);

				handlepos = handlepos < 0 ? 0 : handlepos;
				t.settransformstyle(t.current, 'scalex(' + newwidth / tw + ')');
				t.settransformstyle(t.handle, 'translatex(' + handlepos + 'px)');

				if (t.options.usesmoothhover && !(0, _dom.hasclass)(t.hovered, 'no-hover')) {
					var pos = parseint(t.hovered.getattribute('pos'), 10);
					pos = isnan(pos) ? 0 : pos;

					var hoverscalex = pos / tw - handlepos / tw;

					t.hovered.style.left = handlepos + 'px';
					t.settransformstyle(t.hovered, 'scalex(' + hoverscalex + ')');

					if (hoverscalex >= 0) {
						(0, _dom.removeclass)(t.hovered, 'negative');
					} else {
						(0, _dom.addclass)(t.hovered, 'negative');
					}
				}
			}
		}
	}
});

},{"16":16,"2":2,"25":25,"26":26,"30":30,"5":5}],12:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _player = _dereq_(16);

var _player2 = _interoprequiredefault(_player);

var _time = _dereq_(30);

var _dom = _dereq_(26);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

object.assign(_player.config, {
	duration: 0,

	timeanddurationseparator: '<span> | </span>'
});

object.assign(_player2.default.prototype, {
	buildcurrent: function buildcurrent(player, controls, layers, media) {
		var t = this,
		    time = _document2.default.createelement('div');

		time.classname = t.options.classprefix + 'time';
		time.setattribute('role', 'timer');
		time.setattribute('aria-live', 'off');
		time.innerhtml = '<span class="' + t.options.classprefix + 'currenttime">' + (0, _time.secondstotimecode)(0, player.options.alwaysshowhours, player.options.showtimecodeframecount, player.options.framespersecond, player.options.secondsdecimallength, player.options.timeformat) + '</span>';

		t.addcontrolelement(time, 'current');
		player.updatecurrent();
		t.updatetimecallback = function () {
			if (t.controlsarevisible) {
				player.updatecurrent();
			}
		};
		media.addeventlistener('timeupdate', t.updatetimecallback);
	},
	cleancurrent: function cleancurrent(player, controls, layers, media) {
		media.removeeventlistener('timeupdate', player.updatetimecallback);
	},
	buildduration: function buildduration(player, controls, layers, media) {
		var t = this,
		    currtime = controls.lastchild.queryselector('.' + t.options.classprefix + 'currenttime');

		if (currtime) {
			controls.queryselector('.' + t.options.classprefix + 'time').innerhtml += t.options.timeanddurationseparator + '<span class="' + t.options.classprefix + 'duration">' + ((0, _time.secondstotimecode)(t.options.duration, t.options.alwaysshowhours, t.options.showtimecodeframecount, t.options.framespersecond, t.options.secondsdecimallength, t.options.timeformat) + '</span>');
		} else {
			if (controls.queryselector('.' + t.options.classprefix + 'currenttime')) {
				(0, _dom.addclass)(controls.queryselector('.' + t.options.classprefix + 'currenttime').parentnode, t.options.classprefix + 'currenttime-container');
			}

			var duration = _document2.default.createelement('div');
			duration.classname = t.options.classprefix + 'time ' + t.options.classprefix + 'duration-container';
			duration.innerhtml = '<span class="' + t.options.classprefix + 'duration">' + ((0, _time.secondstotimecode)(t.options.duration, t.options.alwaysshowhours, t.options.showtimecodeframecount, t.options.framespersecond, t.options.secondsdecimallength, t.options.timeformat) + '</span>');

			t.addcontrolelement(duration, 'duration');
		}

		t.updatedurationcallback = function () {
			if (t.controlsarevisible) {
				player.updateduration();
			}
		};

		media.addeventlistener('timeupdate', t.updatedurationcallback);
	},
	cleanduration: function cleanduration(player, controls, layers, media) {
		media.removeeventlistener('timeupdate', player.updatedurationcallback);
	},
	updatecurrent: function updatecurrent() {
		var t = this;

		var currenttime = t.getcurrenttime();

		if (isnan(currenttime)) {
			currenttime = 0;
		}

		var timecode = (0, _time.secondstotimecode)(currenttime, t.options.alwaysshowhours, t.options.showtimecodeframecount, t.options.framespersecond, t.options.secondsdecimallength, t.options.timeformat);

		if (timecode.length > 5) {
			(0, _dom.addclass)(t.getelement(t.container), t.options.classprefix + 'long-video');
		} else {
			(0, _dom.removeclass)(t.getelement(t.container), t.options.classprefix + 'long-video');
		}

		if (t.getelement(t.controls).queryselector('.' + t.options.classprefix + 'currenttime')) {
			t.getelement(t.controls).queryselector('.' + t.options.classprefix + 'currenttime').innertext = timecode;
		}
	},
	updateduration: function updateduration() {
		var t = this;

		var duration = t.getduration();

		if (t.media !== undefined && (isnan(duration) || duration === infinity || duration < 0)) {
			t.media.duration = t.options.duration = duration = 0;
		}

		if (t.options.duration > 0) {
			duration = t.options.duration;
		}

		var timecode = (0, _time.secondstotimecode)(duration, t.options.alwaysshowhours, t.options.showtimecodeframecount, t.options.framespersecond, t.options.secondsdecimallength, t.options.timeformat);

		if (timecode.length > 5) {
			(0, _dom.addclass)(t.getelement(t.container), t.options.classprefix + 'long-video');
		} else {
			(0, _dom.removeclass)(t.getelement(t.container), t.options.classprefix + 'long-video');
		}

		if (t.getelement(t.controls).queryselector('.' + t.options.classprefix + 'duration') && duration > 0) {
			t.getelement(t.controls).queryselector('.' + t.options.classprefix + 'duration').innerhtml = timecode;
		}
	}
});

},{"16":16,"2":2,"26":26,"30":30}],13:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _i18n = _dereq_(5);

var _i18n2 = _interoprequiredefault(_i18n);

var _player = _dereq_(16);

var _player2 = _interoprequiredefault(_player);

var _time = _dereq_(30);

var _general = _dereq_(27);

var _dom = _dereq_(26);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

object.assign(_player.config, {
	startlanguage: '',

	trackstext: null,

	chapterstext: null,

	tracksarialive: false,

	hidecaptionsbuttonwhenempty: true,

	togglecaptionsbuttonwhenonlyone: false,

	slidesselector: ''
});

object.assign(_player2.default.prototype, {
	haschapters: false,

	buildtracks: function buildtracks(player, controls, layers, media) {

		this.findtracks();

		if (!player.tracks.length && (!player.trackfiles || !player.trackfiles.length === 0)) {
			return;
		}

		var t = this,
		    attr = t.options.tracksarialive ? ' role="log" aria-live="assertive" aria-atomic="false"' : '',
		    trackstitle = (0, _general.isstring)(t.options.trackstext) ? t.options.trackstext : _i18n2.default.t('mejs.captions-subtitles'),
		    chapterstitle = (0, _general.isstring)(t.options.chapterstext) ? t.options.chapterstext : _i18n2.default.t('mejs.captions-chapters'),
		    total = player.trackfiles === null ? player.tracks.length : player.trackfiles.length;

		if (t.domnode.texttracks) {
			for (var i = t.domnode.texttracks.length - 1; i >= 0; i--) {
				t.domnode.texttracks[i].mode = 'hidden';
			}
		}

		t.cleartracks(player);

		player.captions = _document2.default.createelement('div');
		player.captions.classname = t.options.classprefix + 'captions-layer ' + t.options.classprefix + 'layer';
		player.captions.innerhtml = '<div class="' + t.options.classprefix + 'captions-position ' + t.options.classprefix + 'captions-position-hover"' + attr + '>' + ('<span class="' + t.options.classprefix + 'captions-text"></span>') + '</div>';
		player.captions.style.display = 'none';
		layers.insertbefore(player.captions, layers.firstchild);

		player.captionstext = player.captions.queryselector('.' + t.options.classprefix + 'captions-text');

		player.captionsbutton = _document2.default.createelement('div');
		player.captionsbutton.classname = t.options.classprefix + 'button ' + t.options.classprefix + 'captions-button';
		player.captionsbutton.innerhtml = '<button type="button" aria-controls="' + t.id + '" title="' + trackstitle + '" aria-label="' + trackstitle + '" tabindex="0"></button>' + ('<div class="' + t.options.classprefix + 'captions-selector ' + t.options.classprefix + 'offscreen">') + ('<ul class="' + t.options.classprefix + 'captions-selector-list">') + ('<li class="' + t.options.classprefix + 'captions-selector-list-item">') + ('<input type="radio" class="' + t.options.classprefix + 'captions-selector-input" ') + ('name="' + player.id + '_captions" id="' + player.id + '_captions_none" ') + 'value="none" checked disabled>' + ('<label class="' + t.options.classprefix + 'captions-selector-label ') + (t.options.classprefix + 'captions-selected" ') + ('for="' + player.id + '_captions_none">' + _i18n2.default.t('mejs.none') + '</label>') + '</li>' + '</ul>' + '</div>';

		t.addcontrolelement(player.captionsbutton, 'tracks');

		player.captionsbutton.queryselector('.' + t.options.classprefix + 'captions-selector-input').disabled = false;

		player.chaptersbutton = _document2.default.createelement('div');
		player.chaptersbutton.classname = t.options.classprefix + 'button ' + t.options.classprefix + 'chapters-button';
		player.chaptersbutton.innerhtml = '<button type="button" aria-controls="' + t.id + '" title="' + chapterstitle + '" aria-label="' + chapterstitle + '" tabindex="0"></button>' + ('<div class="' + t.options.classprefix + 'chapters-selector ' + t.options.classprefix + 'offscreen">') + ('<ul class="' + t.options.classprefix + 'chapters-selector-list"></ul>') + '</div>';

		var subtitlecount = 0;

		for (var _i = 0; _i < total; _i++) {
			var kind = player.tracks[_i].kind,
			    src = player.tracks[_i].src;
			if (src.trim()) {
				if (kind === 'subtitles' || kind === 'captions') {
					subtitlecount++;
				} else if (kind === 'chapters' && !controls.queryselector('.' + t.options.classprefix + 'chapter-selector')) {
					player.captionsbutton.parentnode.insertbefore(player.chaptersbutton, player.captionsbutton);
				}
			}
		}

		player.tracktoload = -1;
		player.selectedtrack = null;
		player.isloadingtrack = false;

		for (var _i2 = 0; _i2 < total; _i2++) {
			var _kind = player.tracks[_i2].kind;
			if (player.tracks[_i2].src.trim() && (_kind === 'subtitles' || _kind === 'captions')) {
				player.addtrackbutton(player.tracks[_i2].trackid, player.tracks[_i2].srclang, player.tracks[_i2].label);
			}
		}

		player.loadnexttrack();

		var inevents = ['mouseenter', 'focusin'],
		    outevents = ['mouseleave', 'focusout'];

		if (t.options.togglecaptionsbuttonwhenonlyone && subtitlecount === 1) {
			player.captionsbutton.addeventlistener('click', function (e) {
				var trackid = 'none';
				if (player.selectedtrack === null) {
					trackid = player.tracks[0].trackid;
				}
				var keyboard = e.keycode || e.which;
				player.settrack(trackid, typeof keyboard !== 'undefined');
			});
		} else {
			var labels = player.captionsbutton.queryselectorall('.' + t.options.classprefix + 'captions-selector-label'),
			    captions = player.captionsbutton.queryselectorall('input[type=radio]');

			for (var _i3 = 0, _total = inevents.length; _i3 < _total; _i3++) {
				player.captionsbutton.addeventlistener(inevents[_i3], function () {
					(0, _dom.removeclass)(this.queryselector('.' + t.options.classprefix + 'captions-selector'), t.options.classprefix + 'offscreen');
				});
			}

			for (var _i4 = 0, _total2 = outevents.length; _i4 < _total2; _i4++) {
				player.captionsbutton.addeventlistener(outevents[_i4], function () {
					(0, _dom.addclass)(this.queryselector('.' + t.options.classprefix + 'captions-selector'), t.options.classprefix + 'offscreen');
				});
			}

			for (var _i5 = 0, _total3 = captions.length; _i5 < _total3; _i5++) {
				captions[_i5].addeventlistener('click', function (e) {
					var keyboard = e.keycode || e.which;
					player.settrack(this.value, typeof keyboard !== 'undefined');
				});
			}

			for (var _i6 = 0, _total4 = labels.length; _i6 < _total4; _i6++) {
				labels[_i6].addeventlistener('click', function (e) {
					var radio = (0, _dom.siblings)(this, function (el) {
						return el.tagname === 'input';
					})[0],
					    event = (0, _general.createevent)('click', radio);
					radio.dispatchevent(event);
					e.preventdefault();
				});
			}

			player.captionsbutton.addeventlistener('keydown', function (e) {
				e.stoppropagation();
			});
		}

		for (var _i7 = 0, _total5 = inevents.length; _i7 < _total5; _i7++) {
			player.chaptersbutton.addeventlistener(inevents[_i7], function () {
				if (this.queryselector('.' + t.options.classprefix + 'chapters-selector-list').children.length) {
					(0, _dom.removeclass)(this.queryselector('.' + t.options.classprefix + 'chapters-selector'), t.options.classprefix + 'offscreen');
				}
			});
		}

		for (var _i8 = 0, _total6 = outevents.length; _i8 < _total6; _i8++) {
			player.chaptersbutton.addeventlistener(outevents[_i8], function () {
				(0, _dom.addclass)(this.queryselector('.' + t.options.classprefix + 'chapters-selector'), t.options.classprefix + 'offscreen');
			});
		}

		player.chaptersbutton.addeventlistener('keydown', function (e) {
			e.stoppropagation();
		});

		if (!player.options.alwaysshowcontrols) {
			player.getelement(player.container).addeventlistener('controlsshown', function () {
				(0, _dom.addclass)(player.getelement(player.container).queryselector('.' + t.options.classprefix + 'captions-position'), t.options.classprefix + 'captions-position-hover');
			});

			player.getelement(player.container).addeventlistener('controlshidden', function () {
				if (!media.paused) {
					(0, _dom.removeclass)(player.getelement(player.container).queryselector('.' + t.options.classprefix + 'captions-position'), t.options.classprefix + 'captions-position-hover');
				}
			});
		} else {
			(0, _dom.addclass)(player.getelement(player.container).queryselector('.' + t.options.classprefix + 'captions-position'), t.options.classprefix + 'captions-position-hover');
		}

		media.addeventlistener('timeupdate', function () {
			player.displaycaptions();
		});

		if (player.options.slidesselector !== '') {
			player.slidescontainer = _document2.default.queryselectorall(player.options.slidesselector);

			media.addeventlistener('timeupdate', function () {
				player.displayslides();
			});
		}
	},
	cleartracks: function cleartracks(player) {
		if (player) {
			if (player.captions) {
				player.captions.remove();
			}
			if (player.chapters) {
				player.chapters.remove();
			}
			if (player.captionstext) {
				player.captionstext.remove();
			}
			if (player.captionsbutton) {
				player.captionsbutton.remove();
			}
			if (player.chaptersbutton) {
				player.chaptersbutton.remove();
			}
		}
	},
	rebuildtracks: function rebuildtracks() {
		var t = this;
		t.findtracks();
		t.buildtracks(t, t.getelement(t.controls), t.getelement(t.layers), t.media);
	},
	findtracks: function findtracks() {
		var t = this,
		    tracktags = t.trackfiles === null ? t.node.queryselectorall('track') : t.trackfiles,
		    total = tracktags.length;

		t.tracks = [];
		for (var i = 0; i < total; i++) {
			var track = tracktags[i],
			    srclang = track.getattribute('srclang').tolowercase() || '',
			    trackid = t.id + '_track_' + i + '_' + track.getattribute('kind') + '_' + srclang;
			t.tracks.push({
				trackid: trackid,
				srclang: srclang,
				src: track.getattribute('src'),
				kind: track.getattribute('kind'),
				label: track.getattribute('label') || '',
				entries: [],
				isloaded: false
			});
		}
	},
	settrack: function settrack(trackid, setbykeyboard) {

		var t = this,
		    radios = t.captionsbutton.queryselectorall('input[type="radio"]'),
		    captions = t.captionsbutton.queryselectorall('.' + t.options.classprefix + 'captions-selected'),
		    track = t.captionsbutton.queryselector('input[value="' + trackid + '"]');

		for (var i = 0, total = radios.length; i < total; i++) {
			radios[i].checked = false;
		}

		for (var _i9 = 0, _total7 = captions.length; _i9 < _total7; _i9++) {
			(0, _dom.removeclass)(captions[_i9], t.options.classprefix + 'captions-selected');
		}

		track.checked = true;
		var labels = (0, _dom.siblings)(track, function (el) {
			return (0, _dom.hasclass)(el, t.options.classprefix + 'captions-selector-label');
		});
		for (var _i10 = 0, _total8 = labels.length; _i10 < _total8; _i10++) {
			(0, _dom.addclass)(labels[_i10], t.options.classprefix + 'captions-selected');
		}

		if (trackid === 'none') {
			t.selectedtrack = null;
			(0, _dom.removeclass)(t.captionsbutton, t.options.classprefix + 'captions-enabled');
		} else {
			for (var _i11 = 0, _total9 = t.tracks.length; _i11 < _total9; _i11++) {
				var _track = t.tracks[_i11];
				if (_track.trackid === trackid) {
					if (t.selectedtrack === null) {
						(0, _dom.addclass)(t.captionsbutton, t.options.classprefix + 'captions-enabled');
					}
					t.selectedtrack = _track;
					t.captions.setattribute('lang', t.selectedtrack.srclang);
					t.displaycaptions();
					break;
				}
			}
		}

		var event = (0, _general.createevent)('captionschange', t.media);
		event.detail.caption = t.selectedtrack;
		t.media.dispatchevent(event);

		if (!setbykeyboard) {
			settimeout(function () {
				t.getelement(t.container).focus();
			}, 500);
		}
	},
	loadnexttrack: function loadnexttrack() {
		var t = this;

		t.tracktoload++;
		if (t.tracktoload < t.tracks.length) {
			t.isloadingtrack = true;
			t.loadtrack(t.tracktoload);
		} else {
			t.isloadingtrack = false;
			t.checkfortracks();
		}
	},
	loadtrack: function loadtrack(index) {
		var t = this,
		    track = t.tracks[index];

		if (track !== undefined && (track.src !== undefined || track.src !== "")) {
			(0, _dom.ajax)(track.src, 'text', function (d) {
				track.entries = typeof d === 'string' && /<tt\s+xml/ig.exec(d) ? _mejs2.default.trackformatparser.dfxp.parse(d) : _mejs2.default.trackformatparser.webvtt.parse(d);

				track.isloaded = true;
				t.enabletrackbutton(track);
				t.loadnexttrack();

				if (track.kind === 'slides') {
					t.setupslides(track);
				} else if (track.kind === 'chapters' && !t.haschapters) {
						t.drawchapters(track);
						t.haschapters = true;
					}
			}, function () {
				t.removetrackbutton(track.trackid);
				t.loadnexttrack();
			});
		}
	},
	enabletrackbutton: function enabletrackbutton(track) {
		var t = this,
		    lang = track.srclang,
		    target = _document2.default.getelementbyid('' + track.trackid);

		if (!target) {
			return;
		}

		var label = track.label;

		if (label === '') {
			label = _i18n2.default.t(_mejs2.default.language.codes[lang]) || lang;
		}
		target.disabled = false;
		var targetsiblings = (0, _dom.siblings)(target, function (el) {
			return (0, _dom.hasclass)(el, t.options.classprefix + 'captions-selector-label');
		});
		for (var i = 0, total = targetsiblings.length; i < total; i++) {
			targetsiblings[i].innerhtml = label;
		}

		if (t.options.startlanguage === lang) {
			target.checked = true;
			var event = (0, _general.createevent)('click', target);
			target.dispatchevent(event);
		}
	},
	removetrackbutton: function removetrackbutton(trackid) {
		var element = _document2.default.getelementbyid('' + trackid);
		if (element) {
			var button = element.closest('li');
			if (button) {
				button.remove();
			}
		}
	},
	addtrackbutton: function addtrackbutton(trackid, lang, label) {
		var t = this;
		if (label === '') {
			label = _i18n2.default.t(_mejs2.default.language.codes[lang]) || lang;
		}

		t.captionsbutton.queryselector('ul').innerhtml += '<li class="' + t.options.classprefix + 'captions-selector-list-item">' + ('<input type="radio" class="' + t.options.classprefix + 'captions-selector-input" ') + ('name="' + t.id + '_captions" id="' + trackid + '" value="' + trackid + '" disabled>') + ('<label class="' + t.options.classprefix + 'captions-selector-label"') + ('for="' + trackid + '">' + label + ' (loading)</label>') + '</li>';
	},
	checkfortracks: function checkfortracks() {
		var t = this;

		var hassubtitles = false;

		if (t.options.hidecaptionsbuttonwhenempty) {
			for (var i = 0, total = t.tracks.length; i < total; i++) {
				var kind = t.tracks[i].kind;
				if ((kind === 'subtitles' || kind === 'captions') && t.tracks[i].isloaded) {
					hassubtitles = true;
					break;
				}
			}

			t.captionsbutton.style.display = hassubtitles ? '' : 'none';
			t.setcontrolssize();
		}
	},
	displaycaptions: function displaycaptions() {
		if (this.tracks === undefined) {
			return;
		}

		var t = this,
		    track = t.selectedtrack,
		    sanitize = function sanitize(html) {
			var div = _document2.default.createelement('div');
			div.innerhtml = html;

			var scripts = div.getelementsbytagname('script');
			var i = scripts.length;
			while (i--) {
				scripts[i].remove();
			}

			var allelements = div.getelementsbytagname('*');
			for (var _i12 = 0, n = allelements.length; _i12 < n; _i12++) {
				var attributesobj = allelements[_i12].attributes,
				    attributes = array.prototype.slice.call(attributesobj);

				for (var j = 0, total = attributes.length; j < total; j++) {
					if (attributes[j].name.startswith('on') || attributes[j].value.startswith('javascript')) {
						allelements[_i12].remove();
					} else if (attributes[j].name === 'style') {
						allelements[_i12].removeattribute(attributes[j].name);
					}
				}
			}
			return div.innerhtml;
		};

		if (track !== null && track.isloaded) {
			var i = t.searchtrackposition(track.entries, t.media.currenttime);
			if (i > -1) {
				var text = track.entries[i].text;
				if (typeof t.options.captiontextpreprocessor === 'function') text = t.options.captiontextpreprocessor(text);
				t.captionstext.innerhtml = sanitize(text);
				t.captionstext.classname = t.options.classprefix + 'captions-text ' + (track.entries[i].identifier || '');
				t.captions.style.display = '';
				t.captions.style.height = '0px';
				return;
			}
			t.captions.style.display = 'none';
		} else {
			t.captions.style.display = 'none';
		}
	},
	setupslides: function setupslides(track) {
		var t = this;
		t.slides = track;
		t.slides.entries.imgs = [t.slides.entries.length];
		t.showslide(0);
	},
	showslide: function showslide(index) {
		var _this = this;

		var t = this;

		if (t.tracks === undefined || t.slidescontainer === undefined) {
			return;
		}

		var url = t.slides.entries[index].text;

		var img = t.slides.entries[index].imgs;

		if (img === undefined || img.fadein === undefined) {
			var image = _document2.default.createelement('img');
			image.src = url;
			image.addeventlistener('load', function () {
				var self = _this,
				    visible = (0, _dom.siblings)(self, function (el) {
					return visible(el);
				});
				self.style.display = 'none';
				t.slidescontainer.innerhtml += self.innerhtml;
				(0, _dom.fadein)(t.slidescontainer.queryselector(image));
				for (var i = 0, total = visible.length; i < total; i++) {
					(0, _dom.fadeout)(visible[i], 400);
				}
			});
			t.slides.entries[index].imgs = img = image;
		} else if (!(0, _dom.visible)(img)) {
			var _visible = (0, _dom.siblings)(self, function (el) {
				return _visible(el);
			});
			(0, _dom.fadein)(t.slidescontainer.queryselector(img));
			for (var i = 0, total = _visible.length; i < total; i++) {
				(0, _dom.fadeout)(_visible[i]);
			}
		}
	},
	displayslides: function displayslides() {
		var t = this;

		if (this.slides === undefined) {
			return;
		}

		var slides = t.slides,
		    i = t.searchtrackposition(slides.entries, t.media.currenttime);

		if (i > -1) {
			t.showslide(i);
		}
	},
	drawchapters: function drawchapters(chapters) {
		var t = this,
		    total = chapters.entries.length;

		if (!total) {
			return;
		}

		t.chaptersbutton.queryselector('ul').innerhtml = '';

		for (var i = 0; i < total; i++) {
			t.chaptersbutton.queryselector('ul').innerhtml += '<li class="' + t.options.classprefix + 'chapters-selector-list-item" ' + 'role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="false">' + ('<input type="radio" class="' + t.options.classprefix + 'captions-selector-input" ') + ('name="' + t.id + '_chapters" id="' + t.id + '_chapters_' + i + '" value="' + chapters.entries[i].start + '" disabled>') + ('<label class="' + t.options.classprefix + 'chapters-selector-label"') + ('for="' + t.id + '_chapters_' + i + '">' + chapters.entries[i].text + '</label>') + '</li>';
		}

		var radios = t.chaptersbutton.queryselectorall('input[type="radio"]'),
		    labels = t.chaptersbutton.queryselectorall('.' + t.options.classprefix + 'chapters-selector-label');

		for (var _i13 = 0, _total10 = radios.length; _i13 < _total10; _i13++) {
			radios[_i13].disabled = false;
			radios[_i13].checked = false;
			radios[_i13].addeventlistener('click', function (e) {
				var self = this,
				    listitems = t.chaptersbutton.queryselectorall('li'),
				    label = (0, _dom.siblings)(self, function (el) {
					return (0, _dom.hasclass)(el, t.options.classprefix + 'chapters-selector-label');
				})[0];

				self.checked = true;
				self.parentnode.setattribute('aria-checked', true);
				(0, _dom.addclass)(label, t.options.classprefix + 'chapters-selected');
				(0, _dom.removeclass)(t.chaptersbutton.queryselector('.' + t.options.classprefix + 'chapters-selected'), t.options.classprefix + 'chapters-selected');

				for (var _i14 = 0, _total11 = listitems.length; _i14 < _total11; _i14++) {
					listitems[_i14].setattribute('aria-checked', false);
				}

				var keyboard = e.keycode || e.which;
				if (typeof keyboard === 'undefined') {
					settimeout(function () {
						t.getelement(t.container).focus();
					}, 500);
				}

				t.media.setcurrenttime(parsefloat(self.value));
				if (t.media.paused) {
					t.media.play();
				}
			});
		}

		for (var _i15 = 0, _total12 = labels.length; _i15 < _total12; _i15++) {
			labels[_i15].addeventlistener('click', function (e) {
				var radio = (0, _dom.siblings)(this, function (el) {
					return el.tagname === 'input';
				})[0],
				    event = (0, _general.createevent)('click', radio);
				radio.dispatchevent(event);
				e.preventdefault();
			});
		}
	},
	searchtrackposition: function searchtrackposition(tracks, currenttime) {
		var lo = 0,
		    hi = tracks.length - 1,
		    mid = void 0,
		    start = void 0,
		    stop = void 0;

		while (lo <= hi) {
			mid = lo + hi >> 1;
			start = tracks[mid].start;
			stop = tracks[mid].stop;

			if (currenttime >= start && currenttime < stop) {
				return mid;
			} else if (start < currenttime) {
				lo = mid + 1;
			} else if (start > currenttime) {
				hi = mid - 1;
			}
		}

		return -1;
	}
});

_mejs2.default.language = {
	codes: {
		af: 'mejs.afrikaans',
		sq: 'mejs.albanian',
		ar: 'mejs.arabic',
		be: 'mejs.belarusian',
		bg: 'mejs.bulgarian',
		ca: 'mejs.catalan',
		zh: 'mejs.chinese',
		'zh-cn': 'mejs.chinese-simplified',
		'zh-tw': 'mejs.chines-traditional',
		hr: 'mejs.croatian',
		cs: 'mejs.czech',
		da: 'mejs.danish',
		nl: 'mejs.dutch',
		en: 'mejs.english',
		et: 'mejs.estonian',
		fl: 'mejs.filipino',
		fi: 'mejs.finnish',
		fr: 'mejs.french',
		gl: 'mejs.galician',
		de: 'mejs.german',
		el: 'mejs.greek',
		ht: 'mejs.haitian-creole',
		iw: 'mejs.hebrew',
		hi: 'mejs.hindi',
		hu: 'mejs.hungarian',
		is: 'mejs.icelandic',
		id: 'mejs.indonesian',
		ga: 'mejs.irish',
		it: 'mejs.italian',
		ja: 'mejs.japanese',
		ko: 'mejs.korean',
		lv: 'mejs.latvian',
		lt: 'mejs.lithuanian',
		mk: 'mejs.macedonian',
		ms: 'mejs.malay',
		mt: 'mejs.maltese',
		no: 'mejs.norwegian',
		fa: 'mejs.persian',
		pl: 'mejs.polish',
		pt: 'mejs.portuguese',
		ro: 'mejs.romanian',
		ru: 'mejs.russian',
		sr: 'mejs.serbian',
		sk: 'mejs.slovak',
		sl: 'mejs.slovenian',
		es: 'mejs.spanish',
		sw: 'mejs.swahili',
		sv: 'mejs.swedish',
		tl: 'mejs.tagalog',
		th: 'mejs.thai',
		tr: 'mejs.turkish',
		uk: 'mejs.ukrainian',
		vi: 'mejs.vietnamese',
		cy: 'mejs.welsh',
		yi: 'mejs.yiddish'
	}
};

_mejs2.default.trackformatparser = {
	webvtt: {
		pattern: /^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,

		parse: function parse(tracktext) {
			var lines = tracktext.split(/\r?\n/),
			    entries = [];

			var timecode = void 0,
			    text = void 0,
			    identifier = void 0;

			for (var i = 0, total = lines.length; i < total; i++) {
				timecode = this.pattern.exec(lines[i]);

				if (timecode && i < lines.length) {
					if (i - 1 >= 0 && lines[i - 1] !== '') {
						identifier = lines[i - 1];
					}
					i++;

					text = lines[i];
					i++;
					while (lines[i] !== '' && i < lines.length) {
						text = text + '\n' + lines[i];
						i++;
					}
					text = text === null ? '' : text.trim().replace(/(\b(https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
					entries.push({
						identifier: identifier,
						start: (0, _time.convertsmptetoseconds)(timecode[1]) === 0 ? 0.200 : (0, _time.convertsmptetoseconds)(timecode[1]),
						stop: (0, _time.convertsmptetoseconds)(timecode[3]),
						text: text,
						settings: timecode[5]
					});
				}
				identifier = '';
			}
			return entries;
		}
	},

	dfxp: {
		parse: function parse(tracktext) {
			var trackelem = _document2.default.adoptnode(new domparser().parsefromstring(tracktext, 'application/xml').documentelement),
			    container = trackelem.queryselector('div'),
			    lines = container.queryselectorall('p'),
			    stylenode = _document2.default.getelementbyid(container.getattribute('style')),
			    entries = [];

			var styles = void 0;

			if (stylenode) {
				stylenode.removeattribute('id');
				var attributes = stylenode.attributes;
				if (attributes.length) {
					styles = {};
					for (var i = 0, total = attributes.length; i < total; i++) {
						styles[attributes[i].name.split(":")[1]] = attributes[i].value;
					}
				}
			}

			for (var _i16 = 0, _total13 = lines.length; _i16 < _total13; _i16++) {
				var style = void 0,
				    _temp = {
					start: null,
					stop: null,
					style: null,
					text: null
				};

				if (lines[_i16].getattribute('begin')) {
					_temp.start = (0, _time.convertsmptetoseconds)(lines[_i16].getattribute('begin'));
				}
				if (!_temp.start && lines[_i16 - 1].getattribute('end')) {
					_temp.start = (0, _time.convertsmptetoseconds)(lines[_i16 - 1].getattribute('end'));
				}
				if (lines[_i16].getattribute('end')) {
					_temp.stop = (0, _time.convertsmptetoseconds)(lines[_i16].getattribute('end'));
				}
				if (!_temp.stop && lines[_i16 + 1].getattribute('begin')) {
					_temp.stop = (0, _time.convertsmptetoseconds)(lines[_i16 + 1].getattribute('begin'));
				}

				if (styles) {
					style = '';
					for (var _style in styles) {
						style += _style + ': ' + styles[_style] + ';';
					}
				}
				if (style) {
					_temp.style = style;
				}
				if (_temp.start === 0) {
					_temp.start = 0.200;
				}
				_temp.text = lines[_i16].innerhtml.trim().replace(/(\b(https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_| !:, .; ]*[-a-z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
				entries.push(_temp);
			}
			return entries;
		}
	}
};

},{"16":16,"2":2,"26":26,"27":27,"30":30,"5":5,"7":7}],14:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _player = _dereq_(16);

var _player2 = _interoprequiredefault(_player);

var _i18n = _dereq_(5);

var _i18n2 = _interoprequiredefault(_i18n);

var _constants = _dereq_(25);

var _general = _dereq_(27);

var _dom = _dereq_(26);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

object.assign(_player.config, {
	mutetext: null,

	unmutetext: null,

	allyvolumecontroltext: null,

	hidevolumeontouchdevices: true,

	audiovolume: 'horizontal',

	videovolume: 'vertical',

	startvolume: 0.8
});

object.assign(_player2.default.prototype, {
	buildvolume: function buildvolume(player, controls, layers, media) {
		if ((_constants.is_android || _constants.is_ios) && this.options.hidevolumeontouchdevices) {
			return;
		}

		var t = this,
		    mode = t.isvideo ? t.options.videovolume : t.options.audiovolume,
		    mutetext = (0, _general.isstring)(t.options.mutetext) ? t.options.mutetext : _i18n2.default.t('mejs.mute'),
		    unmutetext = (0, _general.isstring)(t.options.unmutetext) ? t.options.unmutetext : _i18n2.default.t('mejs.unmute'),
		    volumecontroltext = (0, _general.isstring)(t.options.allyvolumecontroltext) ? t.options.allyvolumecontroltext : _i18n2.default.t('mejs.volume-help-text'),
		    mute = _document2.default.createelement('div');

		mute.classname = t.options.classprefix + 'button ' + t.options.classprefix + 'volume-button ' + t.options.classprefix + 'mute';
		mute.innerhtml = mode === 'horizontal' ? '<button type="button" aria-controls="' + t.id + '" title="' + mutetext + '" aria-label="' + mutetext + '" tabindex="0"></button>' : '<button type="button" aria-controls="' + t.id + '" title="' + mutetext + '" aria-label="' + mutetext + '" tabindex="0"></button>' + ('<a href="javascript:void(0);" class="' + t.options.classprefix + 'volume-slider" ') + ('aria-label="' + _i18n2.default.t('mejs.volume-slider') + '" aria-valuemin="0" aria-valuemax="100" role="slider" ') + 'aria-orientation="vertical">' + ('<span class="' + t.options.classprefix + 'offscreen">' + volumecontroltext + '</span>') + ('<div class="' + t.options.classprefix + 'volume-total">') + ('<div class="' + t.options.classprefix + 'volume-current"></div>') + ('<div class="' + t.options.classprefix + 'volume-handle"></div>') + '</div>' + '</a>';

		t.addcontrolelement(mute, 'volume');

		t.options.keyactions.push({
			keys: [38],
			action: function action(player) {
				var volumeslider = player.getelement(player.container).queryselector('.' + t.options.classprefix + 'volume-slider');
				if (volumeslider && volumeslider.matches(':focus')) {
					volumeslider.style.display = 'block';
				}
				if (player.isvideo) {
					player.showcontrols();
					player.startcontrolstimer();
				}

				var newvolume = math.min(player.volume + 0.1, 1);
				player.setvolume(newvolume);
				if (newvolume > 0) {
					player.setmuted(false);
				}
			}
		}, {
			keys: [40],
			action: function action(player) {
				var volumeslider = player.getelement(player.container).queryselector('.' + t.options.classprefix + 'volume-slider');
				if (volumeslider) {
					volumeslider.style.display = 'block';
				}

				if (player.isvideo) {
					player.showcontrols();
					player.startcontrolstimer();
				}

				var newvolume = math.max(player.volume - 0.1, 0);
				player.setvolume(newvolume);

				if (newvolume <= 0.1) {
					player.setmuted(true);
				}
			}
		}, {
			keys: [77],
			action: function action(player) {
				var volumeslider = player.getelement(player.container).queryselector('.' + t.options.classprefix + 'volume-slider');
				if (volumeslider) {
					volumeslider.style.display = 'block';
				}

				if (player.isvideo) {
					player.showcontrols();
					player.startcontrolstimer();
				}
				if (player.media.muted) {
					player.setmuted(false);
				} else {
					player.setmuted(true);
				}
			}
		});

		if (mode === 'horizontal') {
			var anchor = _document2.default.createelement('a');
			anchor.classname = t.options.classprefix + 'horizontal-volume-slider';
			anchor.href = 'javascript:void(0);';
			anchor.setattribute('aria-label', _i18n2.default.t('mejs.volume-slider'));
			anchor.setattribute('aria-valuemin', 0);
			anchor.setattribute('aria-valuemax', 100);
			anchor.setattribute('aria-valuenow', 100);
			anchor.setattribute('role', 'slider');
			anchor.innerhtml += '<span class="' + t.options.classprefix + 'offscreen">' + volumecontroltext + '</span>' + ('<div class="' + t.options.classprefix + 'horizontal-volume-total">') + ('<div class="' + t.options.classprefix + 'horizontal-volume-current"></div>') + ('<div class="' + t.options.classprefix + 'horizontal-volume-handle"></div>') + '</div>';
			mute.parentnode.insertbefore(anchor, mute.nextsibling);
		}

		var mouseisdown = false,
		    mouseisover = false,
		    modified = false,
		    updatevolumeslider = function updatevolumeslider() {
			var volume = math.floor(media.volume * 100);
			volumeslider.setattribute('aria-valuenow', volume);
			volumeslider.setattribute('aria-valuetext', volume + '%');
		};

		var volumeslider = mode === 'vertical' ? t.getelement(t.container).queryselector('.' + t.options.classprefix + 'volume-slider') : t.getelement(t.container).queryselector('.' + t.options.classprefix + 'horizontal-volume-slider'),
		    volumetotal = mode === 'vertical' ? t.getelement(t.container).queryselector('.' + t.options.classprefix + 'volume-total') : t.getelement(t.container).queryselector('.' + t.options.classprefix + 'horizontal-volume-total'),
		    volumecurrent = mode === 'vertical' ? t.getelement(t.container).queryselector('.' + t.options.classprefix + 'volume-current') : t.getelement(t.container).queryselector('.' + t.options.classprefix + 'horizontal-volume-current'),
		    volumehandle = mode === 'vertical' ? t.getelement(t.container).queryselector('.' + t.options.classprefix + 'volume-handle') : t.getelement(t.container).queryselector('.' + t.options.classprefix + 'horizontal-volume-handle'),
		    positionvolumehandle = function positionvolumehandle(volume) {

			if (volume === null || isnan(volume) || volume === undefined) {
				return;
			}

			volume = math.max(0, volume);
			volume = math.min(volume, 1);

			if (volume === 0) {
				(0, _dom.removeclass)(mute, t.options.classprefix + 'mute');
				(0, _dom.addclass)(mute, t.options.classprefix + 'unmute');
				var button = mute.firstelementchild;
				button.setattribute('title', unmutetext);
				button.setattribute('aria-label', unmutetext);
			} else {
				(0, _dom.removeclass)(mute, t.options.classprefix + 'unmute');
				(0, _dom.addclass)(mute, t.options.classprefix + 'mute');
				var _button = mute.firstelementchild;
				_button.setattribute('title', mutetext);
				_button.setattribute('aria-label', mutetext);
			}

			var volumepercentage = volume * 100 + '%',
			    volumestyles = getcomputedstyle(volumehandle);

			if (mode === 'vertical') {
				volumecurrent.style.bottom = 0;
				volumecurrent.style.height = volumepercentage;
				volumehandle.style.bottom = volumepercentage;
				volumehandle.style.marginbottom = -parsefloat(volumestyles.height) / 2 + 'px';
			} else {
				volumecurrent.style.left = 0;
				volumecurrent.style.width = volumepercentage;
				volumehandle.style.left = volumepercentage;
				volumehandle.style.marginleft = -parsefloat(volumestyles.width) / 2 + 'px';
			}
		},
		    handlevolumemove = function handlevolumemove(e) {
			var totaloffset = (0, _dom.offset)(volumetotal),
			    volumestyles = getcomputedstyle(volumetotal);

			modified = true;

			var volume = null;

			if (mode === 'vertical') {
				var railheight = parsefloat(volumestyles.height),
				    newy = e.pagey - totaloffset.top;

				volume = (railheight - newy) / railheight;

				if (totaloffset.top === 0 || totaloffset.left === 0) {
					return;
				}
			} else {
				var railwidth = parsefloat(volumestyles.width),
				    newx = e.pagex - totaloffset.left;

				volume = newx / railwidth;
			}

			volume = math.max(0, volume);
			volume = math.min(volume, 1);

			positionvolumehandle(volume);

			t.setmuted(volume === 0);
			t.setvolume(volume);

			e.preventdefault();
			e.stoppropagation();
		},
		    togglemute = function togglemute() {
			if (t.muted) {
				positionvolumehandle(0);
				(0, _dom.removeclass)(mute, t.options.classprefix + 'mute');
				(0, _dom.addclass)(mute, t.options.classprefix + 'unmute');
			} else {

				positionvolumehandle(media.volume);
				(0, _dom.removeclass)(mute, t.options.classprefix + 'unmute');
				(0, _dom.addclass)(mute, t.options.classprefix + 'mute');
			}
		};

		player.getelement(player.container).addeventlistener('keydown', function (e) {
			var hasfocus = !!e.target.closest('.' + t.options.classprefix + 'container');
			if (!hasfocus && mode === 'vertical') {
				volumeslider.style.display = 'none';
			}
		});

		mute.addeventlistener('mouseenter', function (e) {
			if (e.target === mute) {
				volumeslider.style.display = 'block';
				mouseisover = true;
				e.preventdefault();
				e.stoppropagation();
			}
		});
		mute.addeventlistener('focusin', function () {
			volumeslider.style.display = 'block';
			mouseisover = true;
		});

		mute.addeventlistener('focusout', function (e) {
			if ((!e.relatedtarget || e.relatedtarget && !e.relatedtarget.matches('.' + t.options.classprefix + 'volume-slider')) && mode === 'vertical') {
				volumeslider.style.display = 'none';
			}
		});
		mute.addeventlistener('mouseleave', function () {
			mouseisover = false;
			if (!mouseisdown && mode === 'vertical') {
				volumeslider.style.display = 'none';
			}
		});
		mute.addeventlistener('focusout', function () {
			mouseisover = false;
		});
		mute.addeventlistener('keydown', function (e) {
			if (t.options.enablekeyboard && t.options.keyactions.length) {
				var keycode = e.which || e.keycode || 0,
				    volume = media.volume;

				switch (keycode) {
					case 38:
						volume = math.min(volume + 0.1, 1);
						break;
					case 40:
						volume = math.max(0, volume - 0.1);
						break;
					default:
						return true;
				}

				mouseisdown = false;
				positionvolumehandle(volume);
				media.setvolume(volume);

				e.preventdefault();
				e.stoppropagation();
			}
		});
		mute.queryselector('button').addeventlistener('click', function () {
			media.setmuted(!media.muted);
			var event = (0, _general.createevent)('volumechange', media);
			media.dispatchevent(event);
		});

		volumeslider.addeventlistener('dragstart', function () {
			return false;
		});

		volumeslider.addeventlistener('mouseover', function () {
			mouseisover = true;
		});
		volumeslider.addeventlistener('focusin', function () {
			volumeslider.style.display = 'block';
			mouseisover = true;
		});
		volumeslider.addeventlistener('focusout', function () {
			mouseisover = false;
			if (!mouseisdown && mode === 'vertical') {
				volumeslider.style.display = 'none';
			}
		});
		volumeslider.addeventlistener('mousedown', function (e) {
			handlevolumemove(e);
			t.globalbind('mousemove.vol', function (event) {
				var target = event.target;
				if (mouseisdown && (target === volumeslider || target.closest(mode === 'vertical' ? '.' + t.options.classprefix + 'volume-slider' : '.' + t.options.classprefix + 'horizontal-volume-slider'))) {
					handlevolumemove(event);
				}
			});
			t.globalbind('mouseup.vol', function () {
				mouseisdown = false;
				if (!mouseisover && mode === 'vertical') {
					volumeslider.style.display = 'none';
				}
			});
			mouseisdown = true;
			e.preventdefault();
			e.stoppropagation();
		});

		media.addeventlistener('volumechange', function (e) {
			if (!mouseisdown) {
				togglemute();
			}
			updatevolumeslider(e);
		});

		var rendered = false;
		media.addeventlistener('rendererready', function () {
			if (!modified) {
				settimeout(function () {
					rendered = true;
					if (player.options.startvolume === 0 || media.originalnode.muted) {
						media.setmuted(true);
					}
					media.setvolume(player.options.startvolume);
					t.setcontrolssize();
				}, 250);
			}
		});

		media.addeventlistener('loadedmetadata', function () {
			settimeout(function () {
				if (!modified && !rendered) {
					if (player.options.startvolume === 0 || media.originalnode.muted) {
						media.setmuted(true);
					}
					if (player.options.startvolume === 0) {
						player.options.startvolume = 0;
					}
					media.setvolume(player.options.startvolume);
					t.setcontrolssize();
				}
				rendered = false;
			}, 250);
		});

		if (player.options.startvolume === 0 || media.originalnode.muted) {
			media.setmuted(true);
			if (player.options.startvolume === 0) {
				player.options.startvolume = 0;
			}
			togglemute();
		}

		t.getelement(t.container).addeventlistener('controlsresize', function () {
			togglemute();
		});
	}
});

},{"16":16,"2":2,"25":25,"26":26,"27":27,"5":5}],15:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});
var en = exports.en = {
	'mejs.plural-form': 1,

	'mejs.download-file': 'download file',

	'mejs.install-flash': 'you are using a browser that does not have flash player enabled or installed. please turn on your flash player plugin or download the latest version from https://get.adobe.com/flashplayer/',

	'mejs.fullscreen': 'fullscreen',

	'mejs.play': 'play',
	'mejs.pause': 'pause',

	'mejs.time-slider': 'time slider',
	'mejs.time-help-text': 'use left/right arrow keys to advance one second, up/down arrows to advance ten seconds.',
	'mejs.live-broadcast': 'live broadcast',

	'mejs.volume-help-text': 'use up/down arrow keys to increase or decrease volume.',
	'mejs.unmute': 'unmute',
	'mejs.mute': 'mute',
	'mejs.volume-slider': 'volume slider',

	'mejs.video-player': 'video player',
	'mejs.audio-player': 'audio player',

	'mejs.captions-subtitles': 'captions/subtitles',
	'mejs.captions-chapters': 'chapters',
	'mejs.none': 'none',
	'mejs.afrikaans': 'afrikaans',
	'mejs.albanian': 'albanian',
	'mejs.arabic': 'arabic',
	'mejs.belarusian': 'belarusian',
	'mejs.bulgarian': 'bulgarian',
	'mejs.catalan': 'catalan',
	'mejs.chinese': 'chinese',
	'mejs.chinese-simplified': 'chinese (simplified)',
	'mejs.chinese-traditional': 'chinese (traditional)',
	'mejs.croatian': 'croatian',
	'mejs.czech': 'czech',
	'mejs.danish': 'danish',
	'mejs.dutch': 'dutch',
	'mejs.english': 'english',
	'mejs.estonian': 'estonian',
	'mejs.filipino': 'filipino',
	'mejs.finnish': 'finnish',
	'mejs.french': 'french',
	'mejs.galician': 'galician',
	'mejs.german': 'german',
	'mejs.greek': 'greek',
	'mejs.haitian-creole': 'haitian creole',
	'mejs.hebrew': 'hebrew',
	'mejs.hindi': 'hindi',
	'mejs.hungarian': 'hungarian',
	'mejs.icelandic': 'icelandic',
	'mejs.indonesian': 'indonesian',
	'mejs.irish': 'irish',
	'mejs.italian': 'italian',
	'mejs.japanese': 'japanese',
	'mejs.korean': 'korean',
	'mejs.latvian': 'latvian',
	'mejs.lithuanian': 'lithuanian',
	'mejs.macedonian': 'macedonian',
	'mejs.malay': 'malay',
	'mejs.maltese': 'maltese',
	'mejs.norwegian': 'norwegian',
	'mejs.persian': 'persian',
	'mejs.polish': 'polish',
	'mejs.portuguese': 'portuguese',
	'mejs.romanian': 'romanian',
	'mejs.russian': 'russian',
	'mejs.serbian': 'serbian',
	'mejs.slovak': 'slovak',
	'mejs.slovenian': 'slovenian',
	'mejs.spanish': 'spanish',
	'mejs.swahili': 'swahili',
	'mejs.swedish': 'swedish',
	'mejs.tagalog': 'tagalog',
	'mejs.thai': 'thai',
	'mejs.turkish': 'turkish',
	'mejs.ukrainian': 'ukrainian',
	'mejs.vietnamese': 'vietnamese',
	'mejs.welsh': 'welsh',
	'mejs.yiddish': 'yiddish'
};

},{}],16:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});
exports.config = undefined;

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _createclass = function () { function defineproperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; object.defineproperty(target, descriptor.key, descriptor); } } return function (constructor, protoprops, staticprops) { if (protoprops) defineproperties(constructor.prototype, protoprops); if (staticprops) defineproperties(constructor, staticprops); return constructor; }; }();

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _mediaelement = _dereq_(6);

var _mediaelement2 = _interoprequiredefault(_mediaelement);

var _default = _dereq_(17);

var _default2 = _interoprequiredefault(_default);

var _i18n = _dereq_(5);

var _i18n2 = _interoprequiredefault(_i18n);

var _constants = _dereq_(25);

var _general = _dereq_(27);

var _time = _dereq_(30);

var _media = _dereq_(28);

var _dom = _dereq_(26);

var dom = _interoprequirewildcard(_dom);

function _interoprequirewildcard(obj) { if (obj && obj.__esmodule) { return obj; } else { var newobj = {}; if (obj != null) { for (var key in obj) { if (object.prototype.hasownproperty.call(obj, key)) newobj[key] = obj[key]; } } newobj.default = obj; return newobj; } }

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

function _classcallcheck(instance, constructor) { if (!(instance instanceof constructor)) { throw new typeerror("cannot call a class as a function"); } }

_mejs2.default.mepindex = 0;

_mejs2.default.players = {};

var config = exports.config = {
	poster: '',

	showposterwhenended: false,

	showposterwhenpaused: false,

	defaultvideowidth: 480,

	defaultvideoheight: 270,

	videowidth: -1,

	videoheight: -1,

	defaultaudiowidth: 400,

	defaultaudioheight: 40,

	defaultseekbackwardinterval: function defaultseekbackwardinterval(media) {
		return media.getduration() * 0.05;
	},

	defaultseekforwardinterval: function defaultseekforwardinterval(media) {
		return media.getduration() * 0.05;
	},

	setdimensions: true,

	audiowidth: -1,

	audioheight: -1,

	loop: false,

	autorewind: true,

	enableautosize: true,

	timeformat: '',

	alwaysshowhours: false,

	showtimecodeframecount: false,

	framespersecond: 25,

	alwaysshowcontrols: false,

	hidevideocontrolsonload: false,

	hidevideocontrolsonpause: false,

	clicktoplaypause: true,

	controlstimeoutdefault: 1500,

	controlstimeoutmouseenter: 2500,

	controlstimeoutmouseleave: 1000,

	ipadusenativecontrols: false,

	iphoneusenativecontrols: false,

	androidusenativecontrols: false,

	features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'],

	usedefaultcontrols: false,

	isvideo: true,

	stretching: 'auto',

	classprefix: 'mejs__',

	enablekeyboard: true,

	pauseotherplayers: true,

	secondsdecimallength: 0,

	customerror: null,

	keyactions: [{
		keys: [32, 179],
		action: function action(player) {

			if (!_constants.is_firefox) {
				if (player.paused || player.ended) {
					player.play();
				} else {
					player.pause();
				}
			}
		}
	}]
};

_mejs2.default.mepdefaults = config;

var mediaelementplayer = function () {
	function mediaelementplayer(node, o) {
		_classcallcheck(this, mediaelementplayer);

		var t = this,
		    element = typeof node === 'string' ? _document2.default.getelementbyid(node) : node;

		if (!(t instanceof mediaelementplayer)) {
			return new mediaelementplayer(element, o);
		}

		t.node = t.media = element;

		if (!t.node) {
			return;
		}

		if (t.media.player) {
			return t.media.player;
		}

		t.hasfocus = false;

		t.controlsarevisible = true;

		t.controlsenabled = true;

		t.controlstimer = null;

		t.currentmediatime = 0;

		t.proxy = null;

		if (o === undefined) {
			var options = t.node.getattribute('data-mejsoptions');
			o = options ? json.parse(options) : {};
		}

		t.options = object.assign({}, config, o);

		if (t.options.loop && !t.media.getattribute('loop')) {
			t.media.loop = true;
			t.node.loop = true;
		} else if (t.media.loop) {
			t.options.loop = true;
		}

		if (!t.options.timeformat) {
			t.options.timeformat = 'mm:ss';
			if (t.options.alwaysshowhours) {
				t.options.timeformat = 'hh:mm:ss';
			}
			if (t.options.showtimecodeframecount) {
				t.options.timeformat += ':ff';
			}
		}

		(0, _time.calculatetimeformat)(0, t.options, t.options.framespersecond || 25);

		t.id = 'mep_' + _mejs2.default.mepindex++;

		_mejs2.default.players[t.id] = t;

		t.init();

		return t;
	}

	_createclass(mediaelementplayer, [{
		key: 'getelement',
		value: function getelement(element) {
			return element;
		}
	}, {
		key: 'init',
		value: function init() {
			var t = this,
			    playeroptions = object.assign({}, t.options, {
				success: function success(media, domnode) {
					t._meready(media, domnode);
				},
				error: function error(e) {
					t._handleerror(e);
				}
			}),
			    tagname = t.node.tagname.tolowercase();

			t.isdynamic = tagname !== 'audio' && tagname !== 'video' && tagname !== 'iframe';
			t.isvideo = t.isdynamic ? t.options.isvideo : tagname !== 'audio' && t.options.isvideo;
			t.mediafiles = null;
			t.trackfiles = null;

			if (_constants.is_ipad && t.options.ipadusenativecontrols || _constants.is_iphone && t.options.iphoneusenativecontrols) {
				t.node.setattribute('controls', true);

				if (_constants.is_ipad && t.node.getattribute('autoplay')) {
					t.play();
				}
			} else if ((t.isvideo || !t.isvideo && (t.options.features.length || t.options.usedefaultcontrols)) && !(_constants.is_android && t.options.androidusenativecontrols)) {
				t.node.removeattribute('controls');
				var videoplayertitle = t.isvideo ? _i18n2.default.t('mejs.video-player') : _i18n2.default.t('mejs.audio-player');

				var offscreen = _document2.default.createelement('span');
				offscreen.classname = t.options.classprefix + 'offscreen';
				offscreen.innertext = videoplayertitle;
				t.media.parentnode.insertbefore(offscreen, t.media);

				t.container = _document2.default.createelement('div');
				t.getelement(t.container).id = t.id;
				t.getelement(t.container).classname = t.options.classprefix + 'container ' + t.options.classprefix + 'container-keyboard-inactive ' + t.media.classname;
				t.getelement(t.container).tabindex = 0;
				t.getelement(t.container).setattribute('role', 'application');
				t.getelement(t.container).setattribute('aria-label', videoplayertitle);
				t.getelement(t.container).innerhtml = '<div class="' + t.options.classprefix + 'inner">' + ('<div class="' + t.options.classprefix + 'mediaelement"></div>') + ('<div class="' + t.options.classprefix + 'layers"></div>') + ('<div class="' + t.options.classprefix + 'controls"></div>') + '</div>';
				t.getelement(t.container).addeventlistener('focus', function (e) {
					if (!t.controlsarevisible && !t.hasfocus && t.controlsenabled) {
						t.showcontrols(true);

						var btnselector = (0, _general.isnodeafter)(e.relatedtarget, t.getelement(t.container)) ? '.' + t.options.classprefix + 'controls .' + t.options.classprefix + 'button:last-child > button' : '.' + t.options.classprefix + 'playpause-button > button',
						    button = t.getelement(t.container).queryselector(btnselector);

						button.focus();
					}
				});
				t.node.parentnode.insertbefore(t.getelement(t.container), t.node);

				if (!t.options.features.length && !t.options.usedefaultcontrols) {
					t.getelement(t.container).style.background = 'transparent';
					t.getelement(t.container).queryselector('.' + t.options.classprefix + 'controls').style.display = 'none';
				}

				if (t.isvideo && t.options.stretching === 'fill' && !dom.hasclass(t.getelement(t.container).parentnode, t.options.classprefix + 'fill-container')) {
					t.outercontainer = t.media.parentnode;

					var wrapper = _document2.default.createelement('div');
					wrapper.classname = t.options.classprefix + 'fill-container';
					t.getelement(t.container).parentnode.insertbefore(wrapper, t.getelement(t.container));
					wrapper.appendchild(t.getelement(t.container));
				}

				if (_constants.is_android) {
					dom.addclass(t.getelement(t.container), t.options.classprefix + 'android');
				}
				if (_constants.is_ios) {
					dom.addclass(t.getelement(t.container), t.options.classprefix + 'ios');
				}
				if (_constants.is_ipad) {
					dom.addclass(t.getelement(t.container), t.options.classprefix + 'ipad');
				}
				if (_constants.is_iphone) {
					dom.addclass(t.getelement(t.container), t.options.classprefix + 'iphone');
				}
				dom.addclass(t.getelement(t.container), t.isvideo ? t.options.classprefix + 'video' : t.options.classprefix + 'audio');

				t.getelement(t.container).queryselector('.' + t.options.classprefix + 'mediaelement').appendchild(t.node);

				t.media.player = t;

				t.controls = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'controls');
				t.layers = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'layers');

				var tagtype = t.isvideo ? 'video' : 'audio',
				    capstagname = tagtype.substring(0, 1).touppercase() + tagtype.substring(1);

				if (t.options[tagtype + 'width'] > 0 || t.options[tagtype + 'width'].tostring().indexof('%') > -1) {
					t.width = t.options[tagtype + 'width'];
				} else if (t.node.style.width !== '' && t.node.style.width !== null) {
					t.width = t.node.style.width;
				} else if (t.node.getattribute('width')) {
					t.width = t.node.getattribute('width');
				} else {
					t.width = t.options['default' + capstagname + 'width'];
				}

				if (t.options[tagtype + 'height'] > 0 || t.options[tagtype + 'height'].tostring().indexof('%') > -1) {
					t.height = t.options[tagtype + 'height'];
				} else if (t.node.style.height !== '' && t.node.style.height !== null) {
					t.height = t.node.style.height;
				} else if (t.node.getattribute('height')) {
					t.height = t.node.getattribute('height');
				} else {
					t.height = t.options['default' + capstagname + 'height'];
				}

				t.initialaspectratio = t.height >= t.width ? t.width / t.height : t.height / t.width;

				t.setplayersize(t.width, t.height);

				playeroptions.pluginwidth = t.width;
				playeroptions.pluginheight = t.height;
			} else if (!t.isvideo && !t.options.features.length && !t.options.usedefaultcontrols) {
					t.node.style.display = 'none';
				}

			_mejs2.default.mepdefaults = playeroptions;

			new _mediaelement2.default(t.media, playeroptions, t.mediafiles);

			if (t.getelement(t.container) !== undefined && t.options.features.length && t.controlsarevisible && !t.options.hidevideocontrolsonload) {
				var event = (0, _general.createevent)('controlsshown', t.getelement(t.container));
				t.getelement(t.container).dispatchevent(event);
			}
		}
	}, {
		key: 'showcontrols',
		value: function showcontrols(doanimation) {
			var t = this;

			doanimation = doanimation === undefined || doanimation;

			if (t.controlsarevisible || !t.isvideo) {
				return;
			}

			if (doanimation) {
				(function () {
					dom.fadein(t.getelement(t.controls), 200, function () {
						dom.removeclass(t.getelement(t.controls), t.options.classprefix + 'offscreen');
						var event = (0, _general.createevent)('controlsshown', t.getelement(t.container));
						t.getelement(t.container).dispatchevent(event);
					});

					var controls = t.getelement(t.container).queryselectorall('.' + t.options.classprefix + 'control');

					var _loop = function _loop(i, total) {
						dom.fadein(controls[i], 200, function () {
							dom.removeclass(controls[i], t.options.classprefix + 'offscreen');
						});
					};

					for (var i = 0, total = controls.length; i < total; i++) {
						_loop(i, total);
					}
				})();
			} else {
				dom.removeclass(t.getelement(t.controls), t.options.classprefix + 'offscreen');
				t.getelement(t.controls).style.display = '';
				t.getelement(t.controls).style.opacity = 1;

				var controls = t.getelement(t.container).queryselectorall('.' + t.options.classprefix + 'control');
				for (var i = 0, total = controls.length; i < total; i++) {
					dom.removeclass(controls[i], t.options.classprefix + 'offscreen');
					controls[i].style.display = '';
				}

				var event = (0, _general.createevent)('controlsshown', t.getelement(t.container));
				t.getelement(t.container).dispatchevent(event);
			}

			t.controlsarevisible = true;
			t.setcontrolssize();
		}
	}, {
		key: 'hidecontrols',
		value: function hidecontrols(doanimation, forcehide) {
			var t = this;

			doanimation = doanimation === undefined || doanimation;

			if (forcehide !== true && (!t.controlsarevisible || t.options.alwaysshowcontrols || t.paused && t.readystate === 4 && (!t.options.hidevideocontrolsonload && t.currenttime <= 0 || !t.options.hidevideocontrolsonpause && t.currenttime > 0) || t.isvideo && !t.options.hidevideocontrolsonload && !t.readystate || t.ended)) {
				return;
			}

			if (doanimation) {
				(function () {
					dom.fadeout(t.getelement(t.controls), 200, function () {
						dom.addclass(t.getelement(t.controls), t.options.classprefix + 'offscreen');
						t.getelement(t.controls).style.display = '';
						var event = (0, _general.createevent)('controlshidden', t.getelement(t.container));
						t.getelement(t.container).dispatchevent(event);
					});

					var controls = t.getelement(t.container).queryselectorall('.' + t.options.classprefix + 'control');

					var _loop2 = function _loop2(i, total) {
						dom.fadeout(controls[i], 200, function () {
							dom.addclass(controls[i], t.options.classprefix + 'offscreen');
							controls[i].style.display = '';
						});
					};

					for (var i = 0, total = controls.length; i < total; i++) {
						_loop2(i, total);
					}
				})();
			} else {
				dom.addclass(t.getelement(t.controls), t.options.classprefix + 'offscreen');
				t.getelement(t.controls).style.display = '';
				t.getelement(t.controls).style.opacity = 0;

				var controls = t.getelement(t.container).queryselectorall('.' + t.options.classprefix + 'control');
				for (var i = 0, total = controls.length; i < total; i++) {
					dom.addclass(controls[i], t.options.classprefix + 'offscreen');
					controls[i].style.display = '';
				}

				var event = (0, _general.createevent)('controlshidden', t.getelement(t.container));
				t.getelement(t.container).dispatchevent(event);
			}

			t.controlsarevisible = false;
		}
	}, {
		key: 'startcontrolstimer',
		value: function startcontrolstimer(timeout) {
			var t = this;

			timeout = typeof timeout !== 'undefined' ? timeout : t.options.controlstimeoutdefault;

			t.killcontrolstimer('start');

			t.controlstimer = settimeout(function () {
				t.hidecontrols();
				t.killcontrolstimer('hide');
			}, timeout);
		}
	}, {
		key: 'killcontrolstimer',
		value: function killcontrolstimer() {
			var t = this;

			if (t.controlstimer !== null) {
				cleartimeout(t.controlstimer);
				delete t.controlstimer;
				t.controlstimer = null;
			}
		}
	}, {
		key: 'disablecontrols',
		value: function disablecontrols() {
			var t = this;

			t.killcontrolstimer();
			t.controlsenabled = false;
			t.hidecontrols(false, true);
		}
	}, {
		key: 'enablecontrols',
		value: function enablecontrols() {
			var t = this;

			t.controlsenabled = true;
			t.showcontrols(false);
		}
	}, {
		key: '_setdefaultplayer',
		value: function _setdefaultplayer() {
			var t = this;
			if (t.proxy) {
				t.proxy.pause();
			}
			t.proxy = new _default2.default(t);
			t.media.addeventlistener('loadedmetadata', function () {
				if (t.getcurrenttime() > 0 && t.currentmediatime > 0) {
					t.setcurrenttime(t.currentmediatime);
					if (!_constants.is_ios && !_constants.is_android) {
						t.play();
					}
				}
			});
		}
	}, {
		key: '_meready',
		value: function _meready(media, domnode) {
			var t = this,
			    autoplayattr = domnode.getattribute('autoplay'),
			    autoplay = !(autoplayattr === undefined || autoplayattr === null || autoplayattr === 'false'),
			    isnative = media.renderername !== null && /(native|html5)/i.test(media.renderername);

			if (t.getelement(t.controls)) {
				t.enablecontrols();
			}

			if (t.getelement(t.container) && t.getelement(t.container).queryselector('.' + t.options.classprefix + 'overlay-play')) {
				t.getelement(t.container).queryselector('.' + t.options.classprefix + 'overlay-play').style.display = '';
			}

			if (t.created) {
				return;
			}

			t.created = true;
			t.media = media;
			t.domnode = domnode;

			if (!(_constants.is_android && t.options.androidusenativecontrols) && !(_constants.is_ipad && t.options.ipadusenativecontrols) && !(_constants.is_iphone && t.options.iphoneusenativecontrols)) {
				if (!t.isvideo && !t.options.features.length && !t.options.usedefaultcontrols) {
					if (autoplay && isnative) {
						t.play();
					}

					if (t.options.success) {

						if (typeof t.options.success === 'string') {
							_window2.default[t.options.success](t.media, t.domnode, t);
						} else {
							t.options.success(t.media, t.domnode, t);
						}
					}

					return;
				}

				t.featureposition = {};

				t._setdefaultplayer();

				t.buildposter(t, t.getelement(t.controls), t.getelement(t.layers), t.media);
				t.buildkeyboard(t, t.getelement(t.controls), t.getelement(t.layers), t.media);
				t.buildoverlays(t, t.getelement(t.controls), t.getelement(t.layers), t.media);

				if (t.options.usedefaultcontrols) {
					var defaultcontrols = ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'];
					t.options.features = defaultcontrols.concat(t.options.features.filter(function (item) {
						return defaultcontrols.indexof(item) === -1;
					}));
				}

				t.buildfeatures(t, t.getelement(t.controls), t.getelement(t.layers), t.media);

				var event = (0, _general.createevent)('controlsready', t.getelement(t.container));
				t.getelement(t.container).dispatchevent(event);

				t.setplayersize(t.width, t.height);
				t.setcontrolssize();

				if (t.isvideo) {
					t.clicktoplaypausecallback = function () {

						if (t.options.clicktoplaypause) {
							var button = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'overlay-button'),
							    pressed = button.getattribute('aria-pressed');

							if (t.paused && pressed) {
								t.pause();
							} else if (t.paused) {
								t.play();
							} else {
								t.pause();
							}

							button.setattribute('aria-pressed', !pressed);
							t.getelement(t.container).focus();
						}
					};

					t.createiframelayer();

					t.media.addeventlistener('click', t.clicktoplaypausecallback);

					if ((_constants.is_android || _constants.is_ios) && !t.options.alwaysshowcontrols) {
						t.node.addeventlistener('touchstart', function () {
							if (t.controlsarevisible) {
								t.hidecontrols(false);
							} else {
								if (t.controlsenabled) {
									t.showcontrols(false);
								}
							}
						}, _constants.support_passive_event ? { passive: true } : false);
					} else {
						t.getelement(t.container).addeventlistener('mouseenter', function () {
							if (t.controlsenabled) {
								if (!t.options.alwaysshowcontrols) {
									t.killcontrolstimer('enter');
									t.showcontrols();
									t.startcontrolstimer(t.options.controlstimeoutmouseenter);
								}
							}
						});
						t.getelement(t.container).addeventlistener('mousemove', function () {
							if (t.controlsenabled) {
								if (!t.controlsarevisible) {
									t.showcontrols();
								}
								if (!t.options.alwaysshowcontrols) {
									t.startcontrolstimer(t.options.controlstimeoutmouseenter);
								}
							}
						});
						t.getelement(t.container).addeventlistener('mouseleave', function () {
							if (t.controlsenabled) {
								if (!t.paused && !t.options.alwaysshowcontrols) {
									t.startcontrolstimer(t.options.controlstimeoutmouseleave);
								}
							}
						});
					}

					if (t.options.hidevideocontrolsonload) {
						t.hidecontrols(false);
					}

					if (t.options.enableautosize) {
						t.media.addeventlistener('loadedmetadata', function (e) {
							var target = e !== undefined ? e.detail.target || e.target : t.media;
							if (t.options.videoheight <= 0 && !t.domnode.getattribute('height') && !t.domnode.style.height && target !== null && !isnan(target.videoheight)) {
								t.setplayersize(target.videowidth, target.videoheight);
								t.setcontrolssize();
								t.media.setsize(target.videowidth, target.videoheight);
							}
						});
					}
				}

				t.media.addeventlistener('play', function () {
					t.hasfocus = true;

					for (var playerindex in _mejs2.default.players) {
						if (_mejs2.default.players.hasownproperty(playerindex)) {
							var p = _mejs2.default.players[playerindex];

							if (p.id !== t.id && t.options.pauseotherplayers && !p.paused && !p.ended && p.options.ignorepauseotherplayersoption !== true) {
								p.pause();
								p.hasfocus = false;
							}
						}
					}

					if (!(_constants.is_android || _constants.is_ios) && !t.options.alwaysshowcontrols && t.isvideo) {
						t.hidecontrols();
					}
				});

				t.media.addeventlistener('ended', function () {
					if (t.options.autorewind) {
						try {
							t.setcurrenttime(0);

							settimeout(function () {
								var loadingelement = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'overlay-loading');
								if (loadingelement && loadingelement.parentnode) {
									loadingelement.parentnode.style.display = 'none';
								}
							}, 20);
						} catch (exp) {
							
						}
					}

					if (typeof t.media.renderer.stop === 'function') {
						t.media.renderer.stop();
					} else {
						t.pause();
					}

					if (t.setprogressrail) {
						t.setprogressrail();
					}
					if (t.setcurrentrail) {
						t.setcurrentrail();
					}

					if (t.options.loop) {
						t.play();
					} else if (!t.options.alwaysshowcontrols && t.controlsenabled) {
						t.showcontrols();
					}
				});

				t.media.addeventlistener('loadedmetadata', function () {

					(0, _time.calculatetimeformat)(t.getduration(), t.options, t.options.framespersecond || 25);

					if (t.updateduration) {
						t.updateduration();
					}
					if (t.updatecurrent) {
						t.updatecurrent();
					}

					if (!t.isfullscreen) {
						t.setplayersize(t.width, t.height);
						t.setcontrolssize();
					}
				});

				var duration = null;
				t.media.addeventlistener('timeupdate', function () {
					if (!isnan(t.getduration()) && duration !== t.getduration()) {
						duration = t.getduration();
						(0, _time.calculatetimeformat)(duration, t.options, t.options.framespersecond || 25);

						if (t.updateduration) {
							t.updateduration();
						}
						if (t.updatecurrent) {
							t.updatecurrent();
						}

						t.setcontrolssize();
					}
				});

				t.getelement(t.container).addeventlistener('click', function (e) {
					dom.addclass(e.currenttarget, t.options.classprefix + 'container-keyboard-inactive');
				});

				t.getelement(t.container).addeventlistener('focusin', function (e) {
					dom.removeclass(e.currenttarget, t.options.classprefix + 'container-keyboard-inactive');
					if (t.isvideo && !_constants.is_android && !_constants.is_ios && t.controlsenabled && !t.options.alwaysshowcontrols) {
						t.killcontrolstimer('enter');
						t.showcontrols();
						t.startcontrolstimer(t.options.controlstimeoutmouseenter);
					}
				});

				t.getelement(t.container).addeventlistener('focusout', function (e) {
					settimeout(function () {
						if (e.relatedtarget) {
							if (t.keyboardaction && !e.relatedtarget.closest('.' + t.options.classprefix + 'container')) {
								t.keyboardaction = false;
								if (t.isvideo && !t.options.alwaysshowcontrols && !t.paused) {
									t.startcontrolstimer(t.options.controlstimeoutmouseleave);
								}
							}
						}
					}, 0);
				});

				settimeout(function () {
					t.setplayersize(t.width, t.height);
					t.setcontrolssize();
				}, 0);

				t.globalresizecallback = function () {
					if (!(t.isfullscreen || _constants.has_true_native_fullscreen && _document2.default.webkitisfullscreen)) {
						t.setplayersize(t.width, t.height);
					}

					t.setcontrolssize();
				};

				t.globalbind('resize', t.globalresizecallback);
			}

			if (autoplay && isnative) {
				t.play();
			}

			if (t.options.success) {
				if (typeof t.options.success === 'string') {
					_window2.default[t.options.success](t.media, t.domnode, t);
				} else {
					t.options.success(t.media, t.domnode, t);
				}
			}
		}
	}, {
		key: '_handleerror',
		value: function _handleerror(e, media, node) {
			var t = this,
			    play = t.getelement(t.layers).queryselector('.' + t.options.classprefix + 'overlay-play');

			if (play) {
				play.style.display = 'none';
			}

			if (t.options.error) {
				t.options.error(e, media, node);
			}

			if (t.getelement(t.container).queryselector('.' + t.options.classprefix + 'cannotplay')) {
				t.getelement(t.container).queryselector('.' + t.options.classprefix + 'cannotplay').remove();
			}

			var errorcontainer = _document2.default.createelement('div');
			errorcontainer.classname = t.options.classprefix + 'cannotplay';
			errorcontainer.style.width = '100%';
			errorcontainer.style.height = '100%';

			var errorcontent = typeof t.options.customerror === 'function' ? t.options.customerror(t.media, t.media.originalnode) : t.options.customerror,
			    imgerror = '';

			if (!errorcontent) {
				var poster = t.media.originalnode.getattribute('poster');
				if (poster) {
					imgerror = '<img src="' + poster + '" alt="' + _mejs2.default.i18n.t('mejs.download-file') + '">';
				}

				if (e.message) {
					errorcontent = '<p>' + e.message + '</p>';
				}

				if (e.urls) {
					for (var i = 0, total = e.urls.length; i < total; i++) {
						var url = e.urls[i];
						errorcontent += '<a href="' + url.src + '" data-type="' + url.type + '"><span>' + _mejs2.default.i18n.t('mejs.download-file') + ': ' + url.src + '</span></a>';
					}
				}
			}

			if (errorcontent && t.getelement(t.layers).queryselector('.' + t.options.classprefix + 'overlay-error')) {
				errorcontainer.innerhtml = errorcontent;
				t.getelement(t.layers).queryselector('.' + t.options.classprefix + 'overlay-error').innerhtml = '' + imgerror + errorcontainer.outerhtml;
				t.getelement(t.layers).queryselector('.' + t.options.classprefix + 'overlay-error').parentnode.style.display = 'block';
			}

			if (t.controlsenabled) {
				t.disablecontrols();
			}
		}
	}, {
		key: 'setplayersize',
		value: function setplayersize(width, height) {
			var t = this;

			if (!t.options.setdimensions) {
				return false;
			}

			if (typeof width !== 'undefined') {
				t.width = width;
			}

			if (typeof height !== 'undefined') {
				t.height = height;
			}

			switch (t.options.stretching) {
				case 'fill':
					if (t.isvideo) {
						t.setfillmode();
					} else {
						t.setdimensions(t.width, t.height);
					}
					break;
				case 'responsive':
					t.setresponsivemode();
					break;
				case 'none':
					t.setdimensions(t.width, t.height);
					break;

				default:
					if (t.hasfluidmode() === true) {
						t.setresponsivemode();
					} else {
						t.setdimensions(t.width, t.height);
					}
					break;
			}
		}
	}, {
		key: 'hasfluidmode',
		value: function hasfluidmode() {
			var t = this;

			return t.height.tostring().indexof('%') !== -1 || t.node && t.node.style.maxwidth && t.node.style.maxwidth !== 'none' && t.node.style.maxwidth !== t.width || t.node && t.node.currentstyle && t.node.currentstyle.maxwidth === '100%';
		}
	}, {
		key: 'setresponsivemode',
		value: function setresponsivemode() {
			var t = this,
			    parent = function () {

				var parentel = void 0,
				    el = t.getelement(t.container);

				while (el) {
					try {
						if (_constants.is_firefox && el.tagname.tolowercase() === 'html' && _window2.default.self !== _window2.default.top && _window2.default.frameelement !== null) {
							return _window2.default.frameelement;
						} else {
							parentel = el.parentelement;
						}
					} catch (e) {
						parentel = el.parentelement;
					}

					if (parentel && dom.visible(parentel)) {
						return parentel;
					}
					el = parentel;
				}

				return null;
			}(),
			    parentstyles = parent ? getcomputedstyle(parent, null) : getcomputedstyle(_document2.default.body, null),
			    nativewidth = function () {
				if (t.isvideo) {
					if (t.node.videowidth && t.node.videowidth > 0) {
						return t.node.videowidth;
					} else if (t.node.getattribute('width')) {
						return t.node.getattribute('width');
					} else {
						return t.options.defaultvideowidth;
					}
				} else {
					return t.options.defaultaudiowidth;
				}
			}(),
			    nativeheight = function () {
				if (t.isvideo) {
					if (t.node.videoheight && t.node.videoheight > 0) {
						return t.node.videoheight;
					} else if (t.node.getattribute('height')) {
						return t.node.getattribute('height');
					} else {
						return t.options.defaultvideoheight;
					}
				} else {
					return t.options.defaultaudioheight;
				}
			}(),
			    aspectratio = function () {
				if (!t.options.enableautosize) {
					return t.initialaspectratio;
				}
				var ratio = 1;
				if (!t.isvideo) {
					return ratio;
				}

				if (t.node.videowidth && t.node.videowidth > 0 && t.node.videoheight && t.node.videoheight > 0) {
					ratio = t.height >= t.width ? t.node.videowidth / t.node.videoheight : t.node.videoheight / t.node.videowidth;
				} else {
					ratio = t.initialaspectratio;
				}

				if (isnan(ratio) || ratio < 0.01 || ratio > 100) {
					ratio = 1;
				}

				return ratio;
			}(),
			    parentheight = parsefloat(parentstyles.height);

			var newheight = void 0,
			    parentwidth = parsefloat(parentstyles.width);

			if (t.isvideo) {
				if (t.height === '100%') {
					newheight = parsefloat(parentwidth * nativeheight / nativewidth, 10);
				} else {
					newheight = t.height >= t.width ? parsefloat(parentwidth / aspectratio, 10) : parsefloat(parentwidth * aspectratio, 10);
				}
			} else {
				newheight = nativeheight;
			}

			if (isnan(newheight)) {
				newheight = parentheight;
			}

			if (t.getelement(t.container).parentnode.length > 0 && t.getelement(t.container).parentnode.tagname.tolowercase() === 'body') {
				parentwidth = _window2.default.innerwidth || _document2.default.documentelement.clientwidth || _document2.default.body.clientwidth;
				newheight = _window2.default.innerheight || _document2.default.documentelement.clientheight || _document2.default.body.clientheight;
			}

			if (newheight && parentwidth) {
				t.getelement(t.container).style.width = parentwidth + 'px';
				t.getelement(t.container).style.height = newheight + 'px';

				t.node.style.width = '100%';
				t.node.style.height = '100%';

				if (t.isvideo && t.media.setsize) {
					t.media.setsize(parentwidth, newheight);
				}

				var layerchildren = t.getelement(t.layers).children;
				for (var i = 0, total = layerchildren.length; i < total; i++) {
					layerchildren[i].style.width = '100%';
					layerchildren[i].style.height = '100%';
				}
			}
		}
	}, {
		key: 'setfillmode',
		value: function setfillmode() {
			var t = this;
			var isiframe = _window2.default.self !== _window2.default.top && _window2.default.frameelement !== null;
			var parent = function () {
				var parentel = void 0,
				    el = t.getelement(t.container);

				while (el) {
					try {
						if (_constants.is_firefox && el.tagname.tolowercase() === 'html' && _window2.default.self !== _window2.default.top && _window2.default.frameelement !== null) {
							return _window2.default.frameelement;
						} else {
							parentel = el.parentelement;
						}
					} catch (e) {
						parentel = el.parentelement;
					}

					if (parentel && dom.visible(parentel)) {
						return parentel;
					}
					el = parentel;
				}

				return null;
			}();
			var parentstyles = parent ? getcomputedstyle(parent, null) : getcomputedstyle(_document2.default.body, null);

			if (t.node.style.height !== 'none' && t.node.style.height !== t.height) {
				t.node.style.height = 'auto';
			}
			if (t.node.style.maxwidth !== 'none' && t.node.style.maxwidth !== t.width) {
				t.node.style.maxwidth = 'none';
			}

			if (t.node.style.maxheight !== 'none' && t.node.style.maxheight !== t.height) {
				t.node.style.maxheight = 'none';
			}

			if (t.node.currentstyle) {
				if (t.node.currentstyle.height === '100%') {
					t.node.currentstyle.height = 'auto';
				}
				if (t.node.currentstyle.maxwidth === '100%') {
					t.node.currentstyle.maxwidth = 'none';
				}
				if (t.node.currentstyle.maxheight === '100%') {
					t.node.currentstyle.maxheight = 'none';
				}
			}

			if (!isiframe && !parsefloat(parentstyles.width)) {
				parent.style.width = t.media.offsetwidth + 'px';
			}

			if (!isiframe && !parsefloat(parentstyles.height)) {
				parent.style.height = t.media.offsetheight + 'px';
			}

			parentstyles = getcomputedstyle(parent);

			var parentwidth = parsefloat(parentstyles.width),
			    parentheight = parsefloat(parentstyles.height);

			t.setdimensions('100%', '100%');

			var poster = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'poster>img');
			if (poster) {
				poster.style.display = '';
			}

			var targetelement = t.getelement(t.container).queryselectorall('object, embed, iframe, video'),
			    initheight = t.height,
			    initwidth = t.width,
			    scalex1 = parentwidth,
			    scaley1 = initheight * parentwidth / initwidth,
			    scalex2 = initwidth * parentheight / initheight,
			    scaley2 = parentheight,
			    bscaleonwidth = scalex2 > parentwidth === false,
			    finalwidth = bscaleonwidth ? math.floor(scalex1) : math.floor(scalex2),
			    finalheight = bscaleonwidth ? math.floor(scaley1) : math.floor(scaley2),
			    width = bscaleonwidth ? parentwidth + 'px' : finalwidth + 'px',
			    height = bscaleonwidth ? finalheight + 'px' : parentheight + 'px';

			for (var i = 0, total = targetelement.length; i < total; i++) {
				targetelement[i].style.height = height;
				targetelement[i].style.width = width;
				if (t.media.setsize) {
					t.media.setsize(width, height);
				}

				targetelement[i].style.marginleft = math.floor((parentwidth - finalwidth) / 2) + 'px';
				targetelement[i].style.margintop = 0;
			}
		}
	}, {
		key: 'setdimensions',
		value: function setdimensions(width, height) {
			var t = this;

			width = (0, _general.isstring)(width) && width.indexof('%') > -1 ? width : parsefloat(width) + 'px';
			height = (0, _general.isstring)(height) && height.indexof('%') > -1 ? height : parsefloat(height) + 'px';

			t.getelement(t.container).style.width = width;
			t.getelement(t.container).style.height = height;

			var layers = t.getelement(t.layers).children;
			for (var i = 0, total = layers.length; i < total; i++) {
				layers[i].style.width = width;
				layers[i].style.height = height;
			}
		}
	}, {
		key: 'setcontrolssize',
		value: function setcontrolssize() {
			var t = this;

			if (!dom.visible(t.getelement(t.container))) {
				return;
			}

			if (t.rail && dom.visible(t.rail)) {
				var totalstyles = t.total ? getcomputedstyle(t.total, null) : null,
				    totalmargin = totalstyles ? parsefloat(totalstyles.marginleft) + parsefloat(totalstyles.marginright) : 0,
				    railstyles = getcomputedstyle(t.rail),
				    railmargin = parsefloat(railstyles.marginleft) + parsefloat(railstyles.marginright);

				var siblingswidth = 0;

				var siblings = dom.siblings(t.rail, function (el) {
					return el !== t.rail;
				}),
				    total = siblings.length;
				for (var i = 0; i < total; i++) {
					siblingswidth += siblings[i].offsetwidth;
				}

				siblingswidth += totalmargin + (totalmargin === 0 ? railmargin * 2 : railmargin) + 1;

				t.getelement(t.container).style.minwidth = siblingswidth + 'px';

				var event = (0, _general.createevent)('controlsresize', t.getelement(t.container));
				t.getelement(t.container).dispatchevent(event);
			} else {
				var children = t.getelement(t.controls).children;
				var minwidth = 0;

				for (var _i = 0, _total = children.length; _i < _total; _i++) {
					minwidth += children[_i].offsetwidth;
				}

				t.getelement(t.container).style.minwidth = minwidth + 'px';
			}
		}
	}, {
		key: 'addcontrolelement',
		value: function addcontrolelement(element, key) {

			var t = this;

			if (t.featureposition[key] !== undefined) {
				var child = t.getelement(t.controls).children[t.featureposition[key] - 1];
				child.parentnode.insertbefore(element, child.nextsibling);
			} else {
				t.getelement(t.controls).appendchild(element);
				var children = t.getelement(t.controls).children;
				for (var i = 0, total = children.length; i < total; i++) {
					if (element === children[i]) {
						t.featureposition[key] = i;
						break;
					}
				}
			}
		}
	}, {
		key: 'createiframelayer',
		value: function createiframelayer() {
			var t = this;

			if (t.isvideo && t.media.renderername !== null && t.media.renderername.indexof('iframe') > -1 && !_document2.default.getelementbyid(t.media.id + '-iframe-overlay')) {

				var layer = _document2.default.createelement('div'),
				    target = _document2.default.getelementbyid(t.media.id + '_' + t.media.renderername);

				layer.id = t.media.id + '-iframe-overlay';
				layer.classname = t.options.classprefix + 'iframe-overlay';
				layer.addeventlistener('click', function (e) {
					if (t.options.clicktoplaypause) {
						if (t.paused) {
							t.play();
						} else {
							t.pause();
						}

						e.preventdefault();
						e.stoppropagation();
					}
				});

				target.parentnode.insertbefore(layer, target);
			}
		}
	}, {
		key: 'resetsize',
		value: function resetsize() {
			var t = this;

			settimeout(function () {
				t.setplayersize(t.width, t.height);
				t.setcontrolssize();
			}, 50);
		}
	}, {
		key: 'setposter',
		value: function setposter(url) {
			var t = this;

			if (t.getelement(t.container)) {
				var posterdiv = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'poster');

				if (!posterdiv) {
					posterdiv = _document2.default.createelement('div');
					posterdiv.classname = t.options.classprefix + 'poster ' + t.options.classprefix + 'layer';
					t.getelement(t.layers).appendchild(posterdiv);
				}

				var posterimg = posterdiv.queryselector('img');

				if (!posterimg && url) {
					posterimg = _document2.default.createelement('img');
					posterimg.classname = t.options.classprefix + 'poster-img';
					posterimg.width = '100%';
					posterimg.height = '100%';
					posterdiv.style.display = '';
					posterdiv.appendchild(posterimg);
				}

				if (url) {
					posterimg.setattribute('src', url);
					posterdiv.style.backgroundimage = 'url("' + url + '")';
					posterdiv.style.display = '';
				} else if (posterimg) {
					posterdiv.style.backgroundimage = 'none';
					posterdiv.style.display = 'none';
					posterimg.remove();
				} else {
					posterdiv.style.display = 'none';
				}
			} else if (_constants.is_ipad && t.options.ipadusenativecontrols || _constants.is_iphone && t.options.iphoneusenativecontrols || _constants.is_android && t.options.androidusenativecontrols) {
				t.media.originalnode.poster = url;
			}
		}
	}, {
		key: 'changeskin',
		value: function changeskin(classname) {
			var t = this;

			t.getelement(t.container).classname = t.options.classprefix + 'container ' + classname;
			t.setplayersize(t.width, t.height);
			t.setcontrolssize();
		}
	}, {
		key: 'globalbind',
		value: function globalbind(events, callback) {
			var t = this,
			    doc = t.node ? t.node.ownerdocument : _document2.default;

			events = (0, _general.splitevents)(events, t.id);
			if (events.d) {
				var eventlist = events.d.split(' ');
				for (var i = 0, total = eventlist.length; i < total; i++) {
					eventlist[i].split('.').reduce(function (part, e) {
						doc.addeventlistener(e, callback, false);
						return e;
					}, '');
				}
			}
			if (events.w) {
				var _eventlist = events.w.split(' ');
				for (var _i2 = 0, _total2 = _eventlist.length; _i2 < _total2; _i2++) {
					_eventlist[_i2].split('.').reduce(function (part, e) {
						_window2.default.addeventlistener(e, callback, false);
						return e;
					}, '');
				}
			}
		}
	}, {
		key: 'globalunbind',
		value: function globalunbind(events, callback) {
			var t = this,
			    doc = t.node ? t.node.ownerdocument : _document2.default;

			events = (0, _general.splitevents)(events, t.id);
			if (events.d) {
				var eventlist = events.d.split(' ');
				for (var i = 0, total = eventlist.length; i < total; i++) {
					eventlist[i].split('.').reduce(function (part, e) {
						doc.removeeventlistener(e, callback, false);
						return e;
					}, '');
				}
			}
			if (events.w) {
				var _eventlist2 = events.w.split(' ');
				for (var _i3 = 0, _total3 = _eventlist2.length; _i3 < _total3; _i3++) {
					_eventlist2[_i3].split('.').reduce(function (part, e) {
						_window2.default.removeeventlistener(e, callback, false);
						return e;
					}, '');
				}
			}
		}
	}, {
		key: 'buildfeatures',
		value: function buildfeatures(player, controls, layers, media) {
			var t = this;

			for (var i = 0, total = t.options.features.length; i < total; i++) {
				var feature = t.options.features[i];
				if (t['build' + feature]) {
					try {
						t['build' + feature](player, controls, layers, media);
					} catch (e) {
						console.error('error building ' + feature, e);
					}
				}
			}
		}
	}, {
		key: 'buildposter',
		value: function buildposter(player, controls, layers, media) {
			var t = this,
			    poster = _document2.default.createelement('div');

			poster.classname = t.options.classprefix + 'poster ' + t.options.classprefix + 'layer';
			layers.appendchild(poster);

			var posterurl = media.originalnode.getattribute('poster');

			if (player.options.poster !== '') {
				if (posterurl && _constants.is_ios) {
					media.originalnode.removeattribute('poster');
				}
				posterurl = player.options.poster;
			}

			if (posterurl) {
				t.setposter(posterurl);
			} else if (t.media.renderer !== null && typeof t.media.renderer.getposterurl === 'function') {
				t.setposter(t.media.renderer.getposterurl());
			} else {
				poster.style.display = 'none';
			}

			media.addeventlistener('play', function () {
				poster.style.display = 'none';
			});

			media.addeventlistener('playing', function () {
				poster.style.display = 'none';
			});

			if (player.options.showposterwhenended && player.options.autorewind) {
				media.addeventlistener('ended', function () {
					poster.style.display = '';
				});
			}

			media.addeventlistener('error', function () {
				poster.style.display = 'none';
			});

			if (player.options.showposterwhenpaused) {
				media.addeventlistener('pause', function () {
					if (!player.ended) {
						poster.style.display = '';
					}
				});
			}
		}
	}, {
		key: 'buildoverlays',
		value: function buildoverlays(player, controls, layers, media) {

			if (!player.isvideo) {
				return;
			}

			var t = this,
			    loading = _document2.default.createelement('div'),
			    error = _document2.default.createelement('div'),
			    bigplay = _document2.default.createelement('div');

			loading.style.display = 'none';
			loading.classname = t.options.classprefix + 'overlay ' + t.options.classprefix + 'layer';
			loading.innerhtml = '<div class="' + t.options.classprefix + 'overlay-loading">' + ('<span class="' + t.options.classprefix + 'overlay-loading-bg-img"></span>') + '</div>';
			layers.appendchild(loading);

			error.style.display = 'none';
			error.classname = t.options.classprefix + 'overlay ' + t.options.classprefix + 'layer';
			error.innerhtml = '<div class="' + t.options.classprefix + 'overlay-error"></div>';
			layers.appendchild(error);

			bigplay.classname = t.options.classprefix + 'overlay ' + t.options.classprefix + 'layer ' + t.options.classprefix + 'overlay-play';
			bigplay.innerhtml = '<div class="' + t.options.classprefix + 'overlay-button" role="button" tabindex="0" ' + ('aria-label="' + _i18n2.default.t('mejs.play') + '" aria-pressed="false"></div>');
			bigplay.addeventlistener('click', function () {
				if (t.options.clicktoplaypause) {

					var button = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'overlay-button'),
					    pressed = button.getattribute('aria-pressed');

					if (t.paused) {
						t.play();
					} else {
						t.pause();
					}

					button.setattribute('aria-pressed', !!pressed);
					t.getelement(t.container).focus();
				}
			});

			bigplay.addeventlistener('keydown', function (e) {
				var keypressed = e.keycode || e.which || 0;

				if (keypressed === 13 || _constants.is_firefox && keypressed === 32) {
					var event = (0, _general.createevent)('click', bigplay);
					bigplay.dispatchevent(event);
					return false;
				}
			});

			layers.appendchild(bigplay);

			if (t.media.renderername !== null && (/(youtube|facebook)/i.test(t.media.renderername) && !(t.media.originalnode.getattribute('poster') || player.options.poster || typeof t.media.renderer.getposterurl === 'function' && t.media.renderer.getposterurl()) || _constants.is_stock_android || t.media.originalnode.getattribute('autoplay'))) {
				bigplay.style.display = 'none';
			}

			var haserror = false;

			media.addeventlistener('play', function () {
				bigplay.style.display = 'none';
				loading.style.display = 'none';
				error.style.display = 'none';
				haserror = false;
			});
			media.addeventlistener('playing', function () {
				bigplay.style.display = 'none';
				loading.style.display = 'none';
				error.style.display = 'none';
				haserror = false;
			});
			media.addeventlistener('seeking', function () {
				bigplay.style.display = 'none';
				loading.style.display = '';
				haserror = false;
			});
			media.addeventlistener('seeked', function () {
				bigplay.style.display = t.paused && !_constants.is_stock_android ? '' : 'none';
				loading.style.display = 'none';
				haserror = false;
			});
			media.addeventlistener('pause', function () {
				loading.style.display = 'none';
				if (!_constants.is_stock_android && !haserror) {
					bigplay.style.display = '';
				}
				haserror = false;
			});
			media.addeventlistener('waiting', function () {
				loading.style.display = '';
				haserror = false;
			});

			media.addeventlistener('loadeddata', function () {
				loading.style.display = '';

				if (_constants.is_android) {
					media.canplaytimeout = settimeout(function () {
						if (_document2.default.createevent) {
							var evt = _document2.default.createevent('htmlevents');
							evt.initevent('canplay', true, true);
							return media.dispatchevent(evt);
						}
					}, 300);
				}
				haserror = false;
			});
			media.addeventlistener('canplay', function () {
				loading.style.display = 'none';

				cleartimeout(media.canplaytimeout);
				haserror = false;
			});

			media.addeventlistener('error', function (e) {
				t._handleerror(e, t.media, t.node);
				loading.style.display = 'none';
				bigplay.style.display = 'none';
				haserror = true;
			});

			media.addeventlistener('loadedmetadata', function () {
				if (!t.controlsenabled) {
					t.enablecontrols();
				}
			});

			media.addeventlistener('keydown', function (e) {
				t.onkeydown(player, media, e);
				haserror = false;
			});
		}
	}, {
		key: 'buildkeyboard',
		value: function buildkeyboard(player, controls, layers, media) {

			var t = this;

			t.getelement(t.container).addeventlistener('keydown', function () {
				t.keyboardaction = true;
			});

			t.globalkeydowncallback = function (event) {
				var container = _document2.default.activeelement.closest('.' + t.options.classprefix + 'container'),
				    target = t.media.closest('.' + t.options.classprefix + 'container');
				t.hasfocus = !!(container && target && container.id === target.id);
				return t.onkeydown(player, media, event);
			};

			t.globalclickcallback = function (event) {
				t.hasfocus = !!event.target.closest('.' + t.options.classprefix + 'container');
			};

			t.globalbind('keydown', t.globalkeydowncallback);

			t.globalbind('click', t.globalclickcallback);
		}
	}, {
		key: 'onkeydown',
		value: function onkeydown(player, media, e) {

			if (player.hasfocus && player.options.enablekeyboard) {
				for (var i = 0, total = player.options.keyactions.length; i < total; i++) {
					var keyaction = player.options.keyactions[i];

					for (var j = 0, jl = keyaction.keys.length; j < jl; j++) {
						if (e.keycode === keyaction.keys[j]) {
							keyaction.action(player, media, e.keycode, e);
							e.preventdefault();
							e.stoppropagation();
							return;
						}
					}
				}
			}

			return true;
		}
	}, {
		key: 'play',
		value: function play() {
			this.proxy.play();
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.proxy.pause();
		}
	}, {
		key: 'load',
		value: function load() {
			this.proxy.load();
		}
	}, {
		key: 'setcurrenttime',
		value: function setcurrenttime(time) {
			this.proxy.setcurrenttime(time);
		}
	}, {
		key: 'getcurrenttime',
		value: function getcurrenttime() {
			return this.proxy.currenttime;
		}
	}, {
		key: 'getduration',
		value: function getduration() {
			return this.proxy.duration;
		}
	}, {
		key: 'setvolume',
		value: function setvolume(volume) {
			this.proxy.volume = volume;
		}
	}, {
		key: 'getvolume',
		value: function getvolume() {
			return this.proxy.getvolume();
		}
	}, {
		key: 'setmuted',
		value: function setmuted(value) {
			this.proxy.setmuted(value);
		}
	}, {
		key: 'setsrc',
		value: function setsrc(src) {
			if (!this.controlsenabled) {
				this.enablecontrols();
			}
			this.proxy.setsrc(src);
		}
	}, {
		key: 'getsrc',
		value: function getsrc() {
			return this.proxy.getsrc();
		}
	}, {
		key: 'canplaytype',
		value: function canplaytype(type) {
			return this.proxy.canplaytype(type);
		}
	}, {
		key: 'remove',
		value: function remove() {
			var t = this,
			    renderername = t.media.renderername,
			    src = t.media.originalnode.src;

			for (var featureindex in t.options.features) {
				var feature = t.options.features[featureindex];
				if (t['clean' + feature]) {
					try {
						t['clean' + feature](t, t.getelement(t.layers), t.getelement(t.controls), t.media);
					} catch (e) {
						console.error('error cleaning ' + feature, e);
					}
				}
			}

			var nativewidth = t.node.getattribute('width'),
			    nativeheight = t.node.getattribute('height');

			if (nativewidth) {
				if (nativewidth.indexof('%') === -1) {
					nativewidth = nativewidth + 'px';
				}
			} else {
				nativewidth = 'auto';
			}

			if (nativeheight) {
				if (nativeheight.indexof('%') === -1) {
					nativeheight = nativeheight + 'px';
				}
			} else {
				nativeheight = 'auto';
			}

			t.node.style.width = nativewidth;
			t.node.style.height = nativeheight;

			t.setplayersize(0, 0);

			if (!t.isdynamic) {
				(function () {
					t.node.setattribute('controls', true);
					t.node.setattribute('id', t.node.getattribute('id').replace('_' + renderername, '').replace('_from_mejs', ''));
					var poster = t.getelement(t.container).queryselector('.' + t.options.classprefix + 'poster>img');
					if (poster) {
						t.node.setattribute('poster', poster.src);
					}

					delete t.node.autoplay;

					t.node.setattribute('src', '');
					if (t.media.canplaytype((0, _media.gettypefromfile)(src)) !== '') {
						t.node.setattribute('src', src);
					}

					if (renderername && renderername.indexof('iframe') > -1) {
						var layer = _document2.default.getelementbyid(t.media.id + '-iframe-overlay');
						layer.remove();
					}

					var node = t.node.clonenode();
					node.style.display = '';
					t.getelement(t.container).parentnode.insertbefore(node, t.getelement(t.container));
					t.node.remove();

					if (t.mediafiles) {
						for (var i = 0, total = t.mediafiles.length; i < total; i++) {
							var source = _document2.default.createelement('source');
							source.setattribute('src', t.mediafiles[i].src);
							source.setattribute('type', t.mediafiles[i].type);
							node.appendchild(source);
						}
					}
					if (t.trackfiles) {
						var _loop3 = function _loop3(_i4, _total4) {
							var track = t.trackfiles[_i4];
							var newtrack = _document2.default.createelement('track');
							newtrack.kind = track.kind;
							newtrack.label = track.label;
							newtrack.srclang = track.srclang;
							newtrack.src = track.src;

							node.appendchild(newtrack);
							newtrack.addeventlistener('load', function () {
								this.mode = 'showing';
								node.texttracks[_i4].mode = 'showing';
							});
						};

						for (var _i4 = 0, _total4 = t.trackfiles.length; _i4 < _total4; _i4++) {
							_loop3(_i4, _total4);
						}
					}

					delete t.node;
					delete t.mediafiles;
					delete t.trackfiles;
				})();
			} else {
				t.getelement(t.container).parentnode.insertbefore(t.node, t.getelement(t.container));
			}

			if (t.media.renderer && typeof t.media.renderer.destroy === 'function') {
				t.media.renderer.destroy();
			}

			delete _mejs2.default.players[t.id];

			if (_typeof(t.getelement(t.container)) === 'object') {
				var offscreen = t.getelement(t.container).parentnode.queryselector('.' + t.options.classprefix + 'offscreen');
				if (offscreen) {
					offscreen.remove();
				}
				t.getelement(t.container).remove();
			}
			t.globalunbind('resize', t.globalresizecallback);
			t.globalunbind('keydown', t.globalkeydowncallback);
			t.globalunbind('click', t.globalclickcallback);

			delete t.media.player;
		}
	}, {
		key: 'paused',
		get: function get() {
			return this.proxy.paused;
		}
	}, {
		key: 'muted',
		get: function get() {
			return this.proxy.muted;
		},
		set: function set(muted) {
			this.setmuted(muted);
		}
	}, {
		key: 'ended',
		get: function get() {
			return this.proxy.ended;
		}
	}, {
		key: 'readystate',
		get: function get() {
			return this.proxy.readystate;
		}
	}, {
		key: 'currenttime',
		set: function set(time) {
			this.setcurrenttime(time);
		},
		get: function get() {
			return this.getcurrenttime();
		}
	}, {
		key: 'duration',
		get: function get() {
			return this.getduration();
		}
	}, {
		key: 'volume',
		set: function set(volume) {
			this.setvolume(volume);
		},
		get: function get() {
			return this.getvolume();
		}
	}, {
		key: 'src',
		set: function set(src) {
			this.setsrc(src);
		},
		get: function get() {
			return this.getsrc();
		}
	}]);

	return mediaelementplayer;
}();

_window2.default.mediaelementplayer = mediaelementplayer;
_mejs2.default.mediaelementplayer = mediaelementplayer;

exports.default = mediaelementplayer;

},{"17":17,"2":2,"25":25,"26":26,"27":27,"28":28,"3":3,"30":30,"5":5,"6":6,"7":7}],17:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});

var _createclass = function () { function defineproperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; object.defineproperty(target, descriptor.key, descriptor); } } return function (constructor, protoprops, staticprops) { if (protoprops) defineproperties(constructor.prototype, protoprops); if (staticprops) defineproperties(constructor, staticprops); return constructor; }; }();

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

function _classcallcheck(instance, constructor) { if (!(instance instanceof constructor)) { throw new typeerror("cannot call a class as a function"); } }

var defaultplayer = function () {
	function defaultplayer(player) {
		_classcallcheck(this, defaultplayer);

		this.media = player.media;
		this.isvideo = player.isvideo;
		this.classprefix = player.options.classprefix;
		this.createiframelayer = function () {
			return player.createiframelayer();
		};
		this.setposter = function (url) {
			return player.setposter(url);
		};
		return this;
	}

	_createclass(defaultplayer, [{
		key: 'play',
		value: function play() {
			this.media.play();
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.media.pause();
		}
	}, {
		key: 'load',
		value: function load() {
			var t = this;

			if (!t.isloaded) {
				t.media.load();
			}

			t.isloaded = true;
		}
	}, {
		key: 'setcurrenttime',
		value: function setcurrenttime(time) {
			this.media.setcurrenttime(time);
		}
	}, {
		key: 'getcurrenttime',
		value: function getcurrenttime() {
			return this.media.currenttime;
		}
	}, {
		key: 'getduration',
		value: function getduration() {
			var duration = this.media.getduration();
			if (duration === infinity && this.media.seekable && this.media.seekable.length) {
				duration = this.media.seekable.end(0);
			}
			return duration;
		}
	}, {
		key: 'setvolume',
		value: function setvolume(volume) {
			this.media.setvolume(volume);
		}
	}, {
		key: 'getvolume',
		value: function getvolume() {
			return this.media.getvolume();
		}
	}, {
		key: 'setmuted',
		value: function setmuted(value) {
			this.media.setmuted(value);
		}
	}, {
		key: 'setsrc',
		value: function setsrc(src) {
			var t = this,
			    layer = document.getelementbyid(t.media.id + '-iframe-overlay');

			if (layer) {
				layer.remove();
			}

			t.media.setsrc(src);
			t.createiframelayer();
			if (t.media.renderer !== null && typeof t.media.renderer.getposterurl === 'function') {
				t.setposter(t.media.renderer.getposterurl());
			}
		}
	}, {
		key: 'getsrc',
		value: function getsrc() {
			return this.media.getsrc();
		}
	}, {
		key: 'canplaytype',
		value: function canplaytype(type) {
			return this.media.canplaytype(type);
		}
	}, {
		key: 'paused',
		get: function get() {
			return this.media.paused;
		}
	}, {
		key: 'muted',
		set: function set(muted) {
			this.setmuted(muted);
		},
		get: function get() {
			return this.media.muted;
		}
	}, {
		key: 'ended',
		get: function get() {
			return this.media.ended;
		}
	}, {
		key: 'readystate',
		get: function get() {
			return this.media.readystate;
		}
	}, {
		key: 'currenttime',
		set: function set(time) {
			this.setcurrenttime(time);
		},
		get: function get() {
			return this.getcurrenttime();
		}
	}, {
		key: 'duration',
		get: function get() {
			return this.getduration();
		}
	}, {
		key: 'remainingtime',
		get: function get() {
			return this.getduration() - this.currenttime();
		}
	}, {
		key: 'volume',
		set: function set(volume) {
			this.setvolume(volume);
		},
		get: function get() {
			return this.getvolume();
		}
	}, {
		key: 'src',
		set: function set(src) {
			this.setsrc(src);
		},
		get: function get() {
			return this.getsrc();
		}
	}]);

	return defaultplayer;
}();

exports.default = defaultplayer;


_window2.default.defaultplayer = defaultplayer;

},{"3":3}],18:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _player = _dereq_(16);

var _player2 = _interoprequiredefault(_player);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

if (typeof jquery !== 'undefined') {
	_mejs2.default.$ = jquery;
} else if (typeof zepto !== 'undefined') {
	_mejs2.default.$ = zepto;
} else if (typeof ender !== 'undefined') {
	_mejs2.default.$ = ender;
}

(function ($) {
	if (typeof $ !== 'undefined') {
		$.fn.mediaelementplayer = function (options) {
			if (options === false) {
				this.each(function () {
					var player = $(this).data('mediaelementplayer');
					if (player) {
						player.remove();
					}
					$(this).removedata('mediaelementplayer');
				});
			} else {
				this.each(function () {
					$(this).data('mediaelementplayer', new _player2.default(this, options));
				});
			}
			return this;
		};

		$(document).ready(function () {
			$('.' + _mejs2.default.mepdefaults.classprefix + 'player').mediaelementplayer();
		});
	}
})(_mejs2.default.$);

},{"16":16,"3":3,"7":7}],19:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _media = _dereq_(28);

var _constants = _dereq_(25);

var _dom = _dereq_(26);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var nativedash = {

	promise: null,

	load: function load(settings) {
		if (typeof dashjs !== 'undefined') {
			nativedash.promise = new promise(function (resolve) {
				resolve();
			}).then(function () {
				nativedash._createplayer(settings);
			});
		} else {
			settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : 'https://cdn.dashjs.org/latest/dash.all.min.js';

			nativedash.promise = nativedash.promise || (0, _dom.loadscript)(settings.options.path);
			nativedash.promise.then(function () {
				nativedash._createplayer(settings);
			});
		}

		return nativedash.promise;
	},

	_createplayer: function _createplayer(settings) {
		var player = dashjs.mediaplayer().create();
		_window2.default['__ready__' + settings.id](player);
		return player;
	}
};

var dashnativerenderer = {
	name: 'native_dash',
	options: {
		prefix: 'native_dash',
		dash: {
			path: 'https://cdn.dashjs.org/latest/dash.all.min.js',
			debug: false,
			drm: {},

			robustnesslevel: ''
		}
	},

	canplaytype: function canplaytype(type) {
		return _constants.has_mse && ['application/dash+xml'].indexof(type.tolowercase()) > -1;
	},

	create: function create(mediaelement, options, mediafiles) {

		var originalnode = mediaelement.originalnode,
		    id = mediaelement.id + '_' + options.prefix,
		    autoplay = originalnode.autoplay,
		    children = originalnode.children;

		var node = null,
		    dashplayer = null;

		originalnode.removeattribute('type');
		for (var i = 0, total = children.length; i < total; i++) {
			children[i].removeattribute('type');
		}

		node = originalnode.clonenode(true);
		options = object.assign(options, mediaelement.options);

		var props = _mejs2.default.html5media.properties,
		    events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']).filter(function (e) {
			return e !== 'error';
		}),
		    attachnativeevents = function attachnativeevents(e) {
			var event = (0, _general.createevent)(e.type, mediaelement);
			mediaelement.dispatchevent(event);
		},
		    assigngetterssetters = function assigngetterssetters(propname) {
			var capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

			node['get' + capname] = function () {
				return dashplayer !== null ? node[propname] : null;
			};

			node['set' + capname] = function (value) {
				if (_mejs2.default.html5media.readonlyproperties.indexof(propname) === -1) {
					if (propname === 'src') {
						var source = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src ? value.src : value;
						node[propname] = source;
						if (dashplayer !== null) {
							dashplayer.reset();
							for (var _i = 0, _total = events.length; _i < _total; _i++) {
								node.removeeventlistener(events[_i], attachnativeevents);
							}
							dashplayer = nativedash._createplayer({
								options: options.dash,
								id: id
							});

							if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && _typeof(value.drm) === 'object') {
								dashplayer.setprotectiondata(value.drm);
								if ((0, _general.isstring)(options.dash.robustnesslevel) && options.dash.robustnesslevel) {
									dashplayer.getprotectioncontroller().setrobustnesslevel(options.dash.robustnesslevel);
								}
							}
							dashplayer.attachsource(source);
							if (autoplay) {
								dashplayer.play();
							}
						}
					} else {
						node[propname] = value;
					}
				}
			};
		};

		for (var _i2 = 0, _total2 = props.length; _i2 < _total2; _i2++) {
			assigngetterssetters(props[_i2]);
		}

		_window2.default['__ready__' + id] = function (_dashplayer) {
			mediaelement.dashplayer = dashplayer = _dashplayer;

			var dashevents = dashjs.mediaplayer.events,
			    assignevents = function assignevents(eventname) {
				if (eventname === 'loadedmetadata') {
					dashplayer.initialize();
					dashplayer.attachview(node);
					dashplayer.setautoplay(false);

					if (_typeof(options.dash.drm) === 'object' && !_mejs2.default.utils.isobjectempty(options.dash.drm)) {
						dashplayer.setprotectiondata(options.dash.drm);
						if ((0, _general.isstring)(options.dash.robustnesslevel) && options.dash.robustnesslevel) {
							dashplayer.getprotectioncontroller().setrobustnesslevel(options.dash.robustnesslevel);
						}
					}
					dashplayer.attachsource(node.getsrc());
				}

				node.addeventlistener(eventname, attachnativeevents);
			};

			for (var _i3 = 0, _total3 = events.length; _i3 < _total3; _i3++) {
				assignevents(events[_i3]);
			}

			var assignmdashevents = function assignmdashevents(e) {
				if (e.type.tolowercase() === 'error') {
					mediaelement.generateerror(e.message, node.src);
					console.error(e);
				} else {
					var _event = (0, _general.createevent)(e.type, mediaelement);
					_event.data = e;
					mediaelement.dispatchevent(_event);
				}
			};

			for (var eventtype in dashevents) {
				if (dashevents.hasownproperty(eventtype)) {
					dashplayer.on(dashevents[eventtype], function (e) {
						return assignmdashevents(e);
					});
				}
			}
		};

		if (mediafiles && mediafiles.length > 0) {
			for (var _i4 = 0, _total4 = mediafiles.length; _i4 < _total4; _i4++) {
				if (_renderer.renderer.renderers[options.prefix].canplaytype(mediafiles[_i4].type)) {
					node.setattribute('src', mediafiles[_i4].src);
					if (typeof mediafiles[_i4].drm !== 'undefined') {
						options.dash.drm = mediafiles[_i4].drm;
					}
					break;
				}
			}
		}

		node.setattribute('id', id);

		originalnode.parentnode.insertbefore(node, originalnode);
		originalnode.autoplay = false;
		originalnode.style.display = 'none';

		node.setsize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			if (dashplayer !== null) {
				dashplayer.reset();
			}
		};

		var event = (0, _general.createevent)('rendererready', node);
		mediaelement.dispatchevent(event);

		mediaelement.promises.push(nativedash.load({
			options: options.dash,
			id: id
		}));

		return node;
	}
};

_media.typechecks.push(function (url) {
	return ~url.tolowercase().indexof('.mpd') ? 'application/dash+xml' : null;
});

_renderer.renderer.add(dashnativerenderer);

},{"25":25,"26":26,"27":27,"28":28,"3":3,"7":7,"8":8}],20:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});
exports.plugindetector = undefined;

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _i18n = _dereq_(5);

var _i18n2 = _interoprequiredefault(_i18n);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _constants = _dereq_(25);

var _media = _dereq_(28);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var plugindetector = exports.plugindetector = {
	plugins: [],

	haspluginversion: function haspluginversion(plugin, v) {
		var pv = plugindetector.plugins[plugin];
		v[1] = v[1] || 0;
		v[2] = v[2] || 0;
		return pv[0] > v[0] || pv[0] === v[0] && pv[1] > v[1] || pv[0] === v[0] && pv[1] === v[1] && pv[2] >= v[2];
	},

	addplugin: function addplugin(p, pluginname, mimetype, activex, axdetect) {
		plugindetector.plugins[p] = plugindetector.detectplugin(pluginname, mimetype, activex, axdetect);
	},

	detectplugin: function detectplugin(pluginname, mimetype, activex, axdetect) {

		var version = [0, 0, 0],
		    description = void 0,
		    ax = void 0;

		if (_constants.nav.plugins !== null && _constants.nav.plugins !== undefined && _typeof(_constants.nav.plugins[pluginname]) === 'object') {
			description = _constants.nav.plugins[pluginname].description;
			if (description && !(typeof _constants.nav.mimetypes !== 'undefined' && _constants.nav.mimetypes[mimetype] && !_constants.nav.mimetypes[mimetype].enabledplugin)) {
				version = description.replace(pluginname, '').replace(/^\s+/, '').replace(/\sr/gi, '.').split('.');
				for (var i = 0, total = version.length; i < total; i++) {
					version[i] = parseint(version[i].match(/\d+/), 10);
				}
			}
		} else if (_window2.default.activexobject !== undefined) {
			try {
				ax = new activexobject(activex);
				if (ax) {
					version = axdetect(ax);
				}
			} catch (e) {
				
			}
		}
		return version;
	}
};

plugindetector.addplugin('flash', 'shockwave flash', 'application/x-shockwave-flash', 'shockwaveflash.shockwaveflash', function (ax) {
	var version = [],
	    d = ax.getvariable("$version");

	if (d) {
		d = d.split(" ")[1].split(",");
		version = [parseint(d[0], 10), parseint(d[1], 10), parseint(d[2], 10)];
	}
	return version;
});

var flashmediaelementrenderer = {
	create: function create(mediaelement, options, mediafiles) {

		var flash = {};
		var isactive = false;

		flash.options = options;
		flash.id = mediaelement.id + '_' + flash.options.prefix;
		flash.mediaelement = mediaelement;
		flash.flashstate = {};
		flash.flashapi = null;
		flash.flashapistack = [];

		var props = _mejs2.default.html5media.properties,
		    assigngetterssetters = function assigngetterssetters(propname) {
			flash.flashstate[propname] = null;

			var capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

			flash['get' + capname] = function () {
				if (flash.flashapi !== null) {
					if (typeof flash.flashapi['get_' + propname] === 'function') {
						var value = flash.flashapi['get_' + propname]();

						if (propname === 'buffered') {
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return value;
								},
								length: 1
							};
						}
						return value;
					} else {
						return null;
					}
				} else {
					return null;
				}
			};

			flash['set' + capname] = function (value) {
				if (propname === 'src') {
					value = (0, _media.absolutizeurl)(value);
				}

				if (flash.flashapi !== null && flash.flashapi['set_' + propname] !== undefined) {
					try {
						flash.flashapi['set_' + propname](value);
					} catch (e) {
						
					}
				} else {
					flash.flashapistack.push({
						type: 'set',
						propname: propname,
						value: value
					});
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assigngetterssetters(props[i]);
		}

		var methods = _mejs2.default.html5media.methods,
		    assignmethods = function assignmethods(methodname) {
			flash[methodname] = function () {
				if (isactive) {
					if (flash.flashapi !== null) {
						if (flash.flashapi['fire_' + methodname]) {
							try {
								flash.flashapi['fire_' + methodname]();
							} catch (e) {
								
							}
						} else {
							
						}
					} else {
						flash.flashapistack.push({
							type: 'call',
							methodname: methodname
						});
					}
				}
			};
		};
		methods.push('stop');
		for (var _i = 0, _total = methods.length; _i < _total; _i++) {
			assignmethods(methods[_i]);
		}

		var initevents = ['rendererready'];

		for (var _i2 = 0, _total2 = initevents.length; _i2 < _total2; _i2++) {
			var event = (0, _general.createevent)(initevents[_i2], flash);
			mediaelement.dispatchevent(event);
		}

		_window2.default['__ready__' + flash.id] = function () {

			flash.flashready = true;
			flash.flashapi = _document2.default.getelementbyid('__' + flash.id);

			if (flash.flashapistack.length) {
				for (var _i3 = 0, _total3 = flash.flashapistack.length; _i3 < _total3; _i3++) {
					var stackitem = flash.flashapistack[_i3];

					if (stackitem.type === 'set') {
						var propname = stackitem.propname,
						    capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

						flash['set' + capname](stackitem.value);
					} else if (stackitem.type === 'call') {
						flash[stackitem.methodname]();
					}
				}
			}
		};

		_window2.default['__event__' + flash.id] = function (eventname, message) {
			var event = (0, _general.createevent)(eventname, flash);
			if (message) {
				try {
					event.data = json.parse(message);
					event.details.data = json.parse(message);
				} catch (e) {
					event.message = message;
				}
			}

			flash.mediaelement.dispatchevent(event);
		};

		flash.flashwrapper = _document2.default.createelement('div');

		if (['always', 'samedomain'].indexof(flash.options.shimscriptaccess) === -1) {
			flash.options.shimscriptaccess = 'samedomain';
		}

		var autoplay = mediaelement.originalnode.autoplay,
		    flashvars = ['uid=' + flash.id, 'autoplay=' + autoplay, 'allowscriptaccess=' + flash.options.shimscriptaccess, 'preload=' + (mediaelement.originalnode.getattribute('preload') || '')],
		    isvideo = mediaelement.originalnode !== null && mediaelement.originalnode.tagname.tolowercase() === 'video',
		    flashheight = isvideo ? mediaelement.originalnode.height : 1,
		    flashwidth = isvideo ? mediaelement.originalnode.width : 1;

		if (mediaelement.originalnode.getattribute('src')) {
			flashvars.push('src=' + mediaelement.originalnode.getattribute('src'));
		}

		if (flash.options.enablepseudostreaming === true) {
			flashvars.push('pseudostreamstart=' + flash.options.pseudostreamingstartqueryparam);
			flashvars.push('pseudostreamtype=' + flash.options.pseudostreamingtype);
		}

		if (flash.options.streamdelimiter) {
			flashvars.push('streamdelimiter=' + encodeuricomponent(flash.options.streamdelimiter));
		}

		if (flash.options.proxytype) {
			flashvars.push('proxytype=' + flash.options.proxytype);
		}

		mediaelement.appendchild(flash.flashwrapper);
		mediaelement.originalnode.style.display = 'none';

		var settings = [];

		if (_constants.is_ie || _constants.is_edge) {
			var specialiecontainer = _document2.default.createelement('div');
			flash.flashwrapper.appendchild(specialiecontainer);

			if (_constants.is_edge) {
				settings = ['type="application/x-shockwave-flash"', 'data="' + flash.options.pluginpath + flash.options.filename + '"', 'id="__' + flash.id + '"', 'width="' + flashwidth + '"', 'height="' + flashheight + '\'"'];
			} else {
				settings = ['classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"', 'codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"', 'id="__' + flash.id + '"', 'width="' + flashwidth + '"', 'height="' + flashheight + '"'];
			}

			if (!isvideo) {
				settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
			}

			specialiecontainer.outerhtml = '<object ' + settings.join(' ') + '>' + ('<param name="movie" value="' + flash.options.pluginpath + flash.options.filename + '?x=' + new date() + '" />') + ('<param name="flashvars" value="' + flashvars.join('&amp;') + '" />') + '<param name="quality" value="high" />' + '<param name="bgcolor" value="#000000" />' + '<param name="wmode" value="transparent" />' + ('<param name="allowscriptaccess" value="' + flash.options.shimscriptaccess + '" />') + '<param name="allowfullscreen" value="true" />' + ('<div>' + _i18n2.default.t('mejs.install-flash') + '</div>') + '</object>';
		} else {

			settings = ['id="__' + flash.id + '"', 'name="__' + flash.id + '"', 'play="true"', 'loop="false"', 'quality="high"', 'bgcolor="#000000"', 'wmode="transparent"', 'allowscriptaccess="' + flash.options.shimscriptaccess + '"', 'allowfullscreen="true"', 'type="application/x-shockwave-flash"', 'pluginspage="//www.macromedia.com/go/getflashplayer"', 'src="' + flash.options.pluginpath + flash.options.filename + '"', 'flashvars="' + flashvars.join('&') + '"'];

			if (isvideo) {
				settings.push('width="' + flashwidth + '"');
				settings.push('height="' + flashheight + '"');
			} else {
				settings.push('style="position: fixed; left: -9999em; top: -9999em;"');
			}

			flash.flashwrapper.innerhtml = '<embed ' + settings.join(' ') + '>';
		}

		flash.flashnode = flash.flashwrapper.lastchild;

		flash.hide = function () {
			isactive = false;
			if (isvideo) {
				flash.flashnode.style.display = 'none';
			}
		};
		flash.show = function () {
			isactive = true;
			if (isvideo) {
				flash.flashnode.style.display = '';
			}
		};
		flash.setsize = function (width, height) {
			flash.flashnode.style.width = width + 'px';
			flash.flashnode.style.height = height + 'px';

			if (flash.flashapi !== null && typeof flash.flashapi.fire_setsize === 'function') {
				flash.flashapi.fire_setsize(width, height);
			}
		};

		flash.destroy = function () {
			flash.flashnode.remove();
		};

		if (mediafiles && mediafiles.length > 0) {
			for (var _i4 = 0, _total4 = mediafiles.length; _i4 < _total4; _i4++) {
				if (_renderer.renderer.renderers[options.prefix].canplaytype(mediafiles[_i4].type)) {
					flash.setsrc(mediafiles[_i4].src);
					break;
				}
			}
		}

		return flash;
	}
};

var hasflash = plugindetector.haspluginversion('flash', [10, 0, 0]);

if (hasflash) {
	_media.typechecks.push(function (url) {
		url = url.tolowercase();

		if (url.startswith('rtmp')) {
			if (~url.indexof('.mp3')) {
				return 'audio/rtmp';
			} else {
				return 'video/rtmp';
			}
		} else if (/\.og(a|g)/i.test(url)) {
			return 'audio/ogg';
		} else if (~url.indexof('.m3u8')) {
			return 'application/x-mpegurl';
		} else if (~url.indexof('.mpd')) {
			return 'application/dash+xml';
		} else if (~url.indexof('.flv')) {
			return 'video/flv';
		} else {
			return null;
		}
	});

	var flashmediaelementvideorenderer = {
		name: 'flash_video',
		options: {
			prefix: 'flash_video',
			filename: 'mediaelement-flash-video.swf',
			enablepseudostreaming: false,

			pseudostreamingstartqueryparam: 'start',

			pseudostreamingtype: 'byte',

			proxytype: '',

			streamdelimiter: ''
		},

		canplaytype: function canplaytype(type) {
			return ~['video/mp4', 'video/rtmp', 'audio/rtmp', 'rtmp/mp4', 'audio/mp4', 'video/flv', 'video/x-flv'].indexof(type.tolowercase());
		},

		create: flashmediaelementrenderer.create

	};
	_renderer.renderer.add(flashmediaelementvideorenderer);

	var flashmediaelementhlsvideorenderer = {
		name: 'flash_hls',
		options: {
			prefix: 'flash_hls',
			filename: 'mediaelement-flash-video-hls.swf'
		},

		canplaytype: function canplaytype(type) {
			return ~['application/x-mpegurl', 'application/vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].indexof(type.tolowercase());
		},

		create: flashmediaelementrenderer.create
	};
	_renderer.renderer.add(flashmediaelementhlsvideorenderer);

	var flashmediaelementmdashvideorenderer = {
		name: 'flash_dash',
		options: {
			prefix: 'flash_dash',
			filename: 'mediaelement-flash-video-mdash.swf'
		},

		canplaytype: function canplaytype(type) {
			return ~['application/dash+xml'].indexof(type.tolowercase());
		},

		create: flashmediaelementrenderer.create
	};
	_renderer.renderer.add(flashmediaelementmdashvideorenderer);

	var flashmediaelementaudiorenderer = {
		name: 'flash_audio',
		options: {
			prefix: 'flash_audio',
			filename: 'mediaelement-flash-audio.swf'
		},

		canplaytype: function canplaytype(type) {
			return ~['audio/mp3'].indexof(type.tolowercase());
		},

		create: flashmediaelementrenderer.create
	};
	_renderer.renderer.add(flashmediaelementaudiorenderer);

	var flashmediaelementaudiooggrenderer = {
		name: 'flash_audio_ogg',
		options: {
			prefix: 'flash_audio_ogg',
			filename: 'mediaelement-flash-audio-ogg.swf'
		},

		canplaytype: function canplaytype(type) {
			return ~['audio/ogg', 'audio/oga', 'audio/ogv'].indexof(type.tolowercase());
		},

		create: flashmediaelementrenderer.create
	};
	_renderer.renderer.add(flashmediaelementaudiooggrenderer);
}

},{"2":2,"25":25,"27":27,"28":28,"3":3,"5":5,"7":7,"8":8}],21:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _constants = _dereq_(25);

var _media = _dereq_(28);

var _dom = _dereq_(26);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var nativeflv = {

	promise: null,

	load: function load(settings) {
		if (typeof flvjs !== 'undefined') {
			nativeflv.promise = new promise(function (resolve) {
				resolve();
			}).then(function () {
				nativeflv._createplayer(settings);
			});
		} else {
			settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : 'https://cdn.jsdelivr.net/npm/flv.js@latest';

			nativeflv.promise = nativeflv.promise || (0, _dom.loadscript)(settings.options.path);
			nativeflv.promise.then(function () {
				nativeflv._createplayer(settings);
			});
		}

		return nativeflv.promise;
	},

	_createplayer: function _createplayer(settings) {
		flvjs.loggingcontrol.enabledebug = settings.options.debug;
		flvjs.loggingcontrol.enableverbose = settings.options.debug;
		var player = flvjs.createplayer(settings.options, settings.configs);
		_window2.default['__ready__' + settings.id](player);
		return player;
	}
};

var flvnativerenderer = {
	name: 'native_flv',
	options: {
		prefix: 'native_flv',
		flv: {
			path: 'https://cdn.jsdelivr.net/npm/flv.js@latest',

			cors: true,
			debug: false
		}
	},

	canplaytype: function canplaytype(type) {
		return _constants.has_mse && ['video/x-flv', 'video/flv'].indexof(type.tolowercase()) > -1;
	},

	create: function create(mediaelement, options, mediafiles) {

		var originalnode = mediaelement.originalnode,
		    id = mediaelement.id + '_' + options.prefix;

		var node = null,
		    flvplayer = null;

		node = originalnode.clonenode(true);
		options = object.assign(options, mediaelement.options);

		var props = _mejs2.default.html5media.properties,
		    events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']).filter(function (e) {
			return e !== 'error';
		}),
		    attachnativeevents = function attachnativeevents(e) {
			var event = (0, _general.createevent)(e.type, mediaelement);
			mediaelement.dispatchevent(event);
		},
		    assigngetterssetters = function assigngetterssetters(propname) {
			var capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

			node['get' + capname] = function () {
				return flvplayer !== null ? node[propname] : null;
			};

			node['set' + capname] = function (value) {
				if (_mejs2.default.html5media.readonlyproperties.indexof(propname) === -1) {
					if (propname === 'src') {
						node[propname] = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src ? value.src : value;
						if (flvplayer !== null) {
							var _flvoptions = {};
							_flvoptions.type = 'flv';
							_flvoptions.url = value;
							_flvoptions.cors = options.flv.cors;
							_flvoptions.debug = options.flv.debug;
							_flvoptions.path = options.flv.path;
							var _flvconfigs = options.flv.configs;

							flvplayer.destroy();
							for (var i = 0, total = events.length; i < total; i++) {
								node.removeeventlistener(events[i], attachnativeevents);
							}
							flvplayer = nativeflv._createplayer({
								options: _flvoptions,
								configs: _flvconfigs,
								id: id
							});
							flvplayer.attachmediaelement(node);
							flvplayer.load();
						}
					} else {
						node[propname] = value;
					}
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assigngetterssetters(props[i]);
		}

		_window2.default['__ready__' + id] = function (_flvplayer) {
			mediaelement.flvplayer = flvplayer = _flvplayer;

			var flvevents = flvjs.events,
			    assignevents = function assignevents(eventname) {
				if (eventname === 'loadedmetadata') {
					flvplayer.unload();
					flvplayer.detachmediaelement();
					flvplayer.attachmediaelement(node);
					flvplayer.load();
				}

				node.addeventlistener(eventname, attachnativeevents);
			};

			for (var _i = 0, _total = events.length; _i < _total; _i++) {
				assignevents(events[_i]);
			}

			var assignflvevents = function assignflvevents(name, data) {
				if (name === 'error') {
					var message = data[0] + ': ' + data[1] + ' ' + data[2].msg;
					mediaelement.generateerror(message, node.src);
				} else {
					var _event = (0, _general.createevent)(name, mediaelement);
					_event.data = data;
					mediaelement.dispatchevent(_event);
				}
			};

			var _loop = function _loop(eventtype) {
				if (flvevents.hasownproperty(eventtype)) {
					flvplayer.on(flvevents[eventtype], function () {
						for (var _len = arguments.length, args = array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						return assignflvevents(flvevents[eventtype], args);
					});
				}
			};

			for (var eventtype in flvevents) {
				_loop(eventtype);
			}
		};

		if (mediafiles && mediafiles.length > 0) {
			for (var _i2 = 0, _total2 = mediafiles.length; _i2 < _total2; _i2++) {
				if (_renderer.renderer.renderers[options.prefix].canplaytype(mediafiles[_i2].type)) {
					node.setattribute('src', mediafiles[_i2].src);
					break;
				}
			}
		}

		node.setattribute('id', id);

		originalnode.parentnode.insertbefore(node, originalnode);
		originalnode.autoplay = false;
		originalnode.style.display = 'none';

		var flvoptions = {};
		flvoptions.type = 'flv';
		flvoptions.url = node.src;
		flvoptions.cors = options.flv.cors;
		flvoptions.debug = options.flv.debug;
		flvoptions.path = options.flv.path;
		var flvconfigs = options.flv.configs;

		node.setsize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			if (flvplayer !== null) {
				flvplayer.pause();
			}
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			if (flvplayer !== null) {
				flvplayer.destroy();
			}
		};

		var event = (0, _general.createevent)('rendererready', node);
		mediaelement.dispatchevent(event);

		mediaelement.promises.push(nativeflv.load({
			options: flvoptions,
			configs: flvconfigs,
			id: id
		}));

		return node;
	}
};

_media.typechecks.push(function (url) {
	return ~url.tolowercase().indexof('.flv') ? 'video/flv' : null;
});

_renderer.renderer.add(flvnativerenderer);

},{"25":25,"26":26,"27":27,"28":28,"3":3,"7":7,"8":8}],22:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _constants = _dereq_(25);

var _media = _dereq_(28);

var _dom = _dereq_(26);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var nativehls = {

	promise: null,

	load: function load(settings) {
		if (typeof hls !== 'undefined') {
			nativehls.promise = new promise(function (resolve) {
				resolve();
			}).then(function () {
				nativehls._createplayer(settings);
			});
		} else {
			settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : 'https://cdn.jsdelivr.net/npm/hls.js@latest';

			nativehls.promise = nativehls.promise || (0, _dom.loadscript)(settings.options.path);
			nativehls.promise.then(function () {
				nativehls._createplayer(settings);
			});
		}

		return nativehls.promise;
	},

	_createplayer: function _createplayer(settings) {
		var player = new hls(settings.options);
		_window2.default['__ready__' + settings.id](player);
		return player;
	}
};

var hlsnativerenderer = {
	name: 'native_hls',
	options: {
		prefix: 'native_hls',
		hls: {
			path: 'https://cdn.jsdelivr.net/npm/hls.js@latest',

			autostartload: false,
			debug: false
		}
	},

	canplaytype: function canplaytype(type) {
		return _constants.has_mse && ['application/x-mpegurl', 'application/vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].indexof(type.tolowercase()) > -1;
	},

	create: function create(mediaelement, options, mediafiles) {

		var originalnode = mediaelement.originalnode,
		    id = mediaelement.id + '_' + options.prefix,
		    preload = originalnode.getattribute('preload'),
		    autoplay = originalnode.autoplay;

		var hlsplayer = null,
		    node = null,
		    index = 0,
		    total = mediafiles.length;

		node = originalnode.clonenode(true);
		options = object.assign(options, mediaelement.options);
		options.hls.autostartload = preload && preload !== 'none' || autoplay;

		var props = _mejs2.default.html5media.properties,
		    events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']).filter(function (e) {
			return e !== 'error';
		}),
		    attachnativeevents = function attachnativeevents(e) {
			var event = (0, _general.createevent)(e.type, mediaelement);
			mediaelement.dispatchevent(event);
		},
		    assigngetterssetters = function assigngetterssetters(propname) {
			var capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

			node['get' + capname] = function () {
				return hlsplayer !== null ? node[propname] : null;
			};

			node['set' + capname] = function (value) {
				if (_mejs2.default.html5media.readonlyproperties.indexof(propname) === -1) {
					if (propname === 'src') {
						node[propname] = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src ? value.src : value;
						if (hlsplayer !== null) {
							hlsplayer.destroy();
							for (var i = 0, _total = events.length; i < _total; i++) {
								node.removeeventlistener(events[i], attachnativeevents);
							}
							hlsplayer = nativehls._createplayer({
								options: options.hls,
								id: id
							});
							hlsplayer.loadsource(value);
							hlsplayer.attachmedia(node);
						}
					} else {
						node[propname] = value;
					}
				}
			};
		};

		for (var i = 0, _total2 = props.length; i < _total2; i++) {
			assigngetterssetters(props[i]);
		}

		_window2.default['__ready__' + id] = function (_hlsplayer) {
			mediaelement.hlsplayer = hlsplayer = _hlsplayer;
			var hlsevents = hls.events,
			    assignevents = function assignevents(eventname) {
				if (eventname === 'loadedmetadata') {
					var url = mediaelement.originalnode.src;
					hlsplayer.detachmedia();
					hlsplayer.loadsource(url);
					hlsplayer.attachmedia(node);
				}

				node.addeventlistener(eventname, attachnativeevents);
			};

			for (var _i = 0, _total3 = events.length; _i < _total3; _i++) {
				assignevents(events[_i]);
			}

			var recoverdecodingerrordate = void 0,
			    recoverswapaudiocodecdate = void 0;
			var assignhlsevents = function assignhlsevents(name, data) {
				if (name === 'hlserror') {
					console.warn(data);
					data = data[1];

					if (data.fatal) {
						switch (data.type) {
							case 'mediaerror':
								var now = new date().gettime();
								if (!recoverdecodingerrordate || now - recoverdecodingerrordate > 3000) {
									recoverdecodingerrordate = new date().gettime();
									hlsplayer.recovermediaerror();
								} else if (!recoverswapaudiocodecdate || now - recoverswapaudiocodecdate > 3000) {
									recoverswapaudiocodecdate = new date().gettime();
									console.warn('attempting to swap audio codec and recover from media error');
									hlsplayer.swapaudiocodec();
									hlsplayer.recovermediaerror();
								} else {
									var message = 'cannot recover, last media error recovery failed';
									mediaelement.generateerror(message, node.src);
									console.error(message);
								}
								break;
							case 'networkerror':
								if (data.details === 'manifestloaderror') {
									if (index < total && mediafiles[index + 1] !== undefined) {
										node.setsrc(mediafiles[index++].src);
										node.load();
										node.play();
									} else {
										var _message = 'network error';
										mediaelement.generateerror(_message, mediafiles);
										console.error(_message);
									}
								} else {
									var _message2 = 'network error';
									mediaelement.generateerror(_message2, mediafiles);
									console.error(_message2);
								}
								break;
							default:
								hlsplayer.destroy();
								break;
						}
						return;
					}
				}
				var event = (0, _general.createevent)(name, mediaelement);
				event.data = data;
				mediaelement.dispatchevent(event);
			};

			var _loop = function _loop(eventtype) {
				if (hlsevents.hasownproperty(eventtype)) {
					hlsplayer.on(hlsevents[eventtype], function () {
						for (var _len = arguments.length, args = array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						return assignhlsevents(hlsevents[eventtype], args);
					});
				}
			};

			for (var eventtype in hlsevents) {
				_loop(eventtype);
			}
		};

		if (total > 0) {
			for (; index < total; index++) {
				if (_renderer.renderer.renderers[options.prefix].canplaytype(mediafiles[index].type)) {
					node.setattribute('src', mediafiles[index].src);
					break;
				}
			}
		}

		if (preload !== 'auto' && !autoplay) {
			node.addeventlistener('play', function () {
				if (hlsplayer !== null) {
					hlsplayer.startload();
				}
			});

			node.addeventlistener('pause', function () {
				if (hlsplayer !== null) {
					hlsplayer.stopload();
				}
			});
		}

		node.setattribute('id', id);

		originalnode.parentnode.insertbefore(node, originalnode);
		originalnode.autoplay = false;
		originalnode.style.display = 'none';

		node.setsize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			if (hlsplayer !== null) {
				hlsplayer.stopload();
				hlsplayer.destroy();
			}
		};

		var event = (0, _general.createevent)('rendererready', node);
		mediaelement.dispatchevent(event);

		mediaelement.promises.push(nativehls.load({
			options: options.hls,
			id: id
		}));

		return node;
	}
};

_media.typechecks.push(function (url) {
	return ~url.tolowercase().indexof('.m3u8') ? 'application/x-mpegurl' : null;
});

_renderer.renderer.add(hlsnativerenderer);

},{"25":25,"26":26,"27":27,"28":28,"3":3,"7":7,"8":8}],23:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _constants = _dereq_(25);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var htmlmediaelement = {
	name: 'html5',
	options: {
		prefix: 'html5'
	},

	canplaytype: function canplaytype(type) {

		var mediaelement = _document2.default.createelement('video');

		if (_constants.is_android && /\/mp(3|4)$/i.test(type) || ~['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].indexof(type.tolowercase()) && _constants.supports_native_hls) {
			return 'yes';
		} else if (mediaelement.canplaytype) {
			return mediaelement.canplaytype(type.tolowercase()).replace(/no/, '');
		} else {
			return '';
		}
	},

	create: function create(mediaelement, options, mediafiles) {

		var id = mediaelement.id + '_' + options.prefix;
		var isactive = false;

		var node = null;

		if (mediaelement.originalnode === undefined || mediaelement.originalnode === null) {
			node = _document2.default.createelement('audio');
			mediaelement.appendchild(node);
		} else {
			node = mediaelement.originalnode;
		}

		node.setattribute('id', id);

		var props = _mejs2.default.html5media.properties,
		    assigngetterssetters = function assigngetterssetters(propname) {
			var capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

			node['get' + capname] = function () {
				return node[propname];
			};

			node['set' + capname] = function (value) {
				if (_mejs2.default.html5media.readonlyproperties.indexof(propname) === -1) {
					node[propname] = value;
				}
			};
		};

		for (var i = 0, _total = props.length; i < _total; i++) {
			assigngetterssetters(props[i]);
		}

		var events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']).filter(function (e) {
			return e !== 'error';
		}),
		    assignevents = function assignevents(eventname) {
			node.addeventlistener(eventname, function (e) {
				if (isactive) {
					var _event = (0, _general.createevent)(e.type, e.target);
					mediaelement.dispatchevent(_event);
				}
			});
		};

		for (var _i = 0, _total2 = events.length; _i < _total2; _i++) {
			assignevents(events[_i]);
		}

		node.setsize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			isactive = false;
			node.style.display = 'none';

			return node;
		};

		node.show = function () {
			isactive = true;
			node.style.display = '';

			return node;
		};

		var index = 0,
		    total = mediafiles.length;
		if (total > 0) {
			for (; index < total; index++) {
				if (_renderer.renderer.renderers[options.prefix].canplaytype(mediafiles[index].type)) {
					node.setattribute('src', mediafiles[index].src);
					break;
				}
			}
		}

		node.addeventlistener('error', function (e) {
			if (e && e.target && e.target.error && e.target.error.code === 4 && isactive) {
				if (index < total && mediafiles[index + 1] !== undefined) {
					node.src = mediafiles[index++].src;
					node.load();
					node.play();
				} else {
					mediaelement.generateerror('media error: format(s) not supported or source(s) not found', mediafiles);
				}
			}
		});

		var event = (0, _general.createevent)('rendererready', node);
		mediaelement.dispatchevent(event);

		return node;
	}
};

_window2.default.htmlmediaelement = _mejs2.default.htmlmediaelement = htmlmediaelement;

_renderer.renderer.add(htmlmediaelement);

},{"2":2,"25":25,"27":27,"3":3,"7":7,"8":8}],24:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _media = _dereq_(28);

var _dom = _dereq_(26);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var youtubeapi = {
	isiframestarted: false,

	isiframeloaded: false,

	iframequeue: [],

	enqueueiframe: function enqueueiframe(settings) {
		youtubeapi.isloaded = typeof yt !== 'undefined' && yt.loaded;

		if (youtubeapi.isloaded) {
			youtubeapi.createiframe(settings);
		} else {
			youtubeapi.loadiframeapi();
			youtubeapi.iframequeue.push(settings);
		}
	},

	loadiframeapi: function loadiframeapi() {
		if (!youtubeapi.isiframestarted) {
			(0, _dom.loadscript)('https://www.youtube.com/player_api');
			youtubeapi.isiframestarted = true;
		}
	},

	iframeready: function iframeready() {

		youtubeapi.isloaded = true;
		youtubeapi.isiframeloaded = true;

		while (youtubeapi.iframequeue.length > 0) {
			var settings = youtubeapi.iframequeue.pop();
			youtubeapi.createiframe(settings);
		}
	},

	createiframe: function createiframe(settings) {
		return new yt.player(settings.containerid, settings);
	},

	getyoutubeid: function getyoutubeid(url) {

		var youtubeid = '';

		if (url.indexof('?') > 0) {
			youtubeid = youtubeapi.getyoutubeidfromparam(url);

			if (youtubeid === '') {
				youtubeid = youtubeapi.getyoutubeidfromurl(url);
			}
		} else {
			youtubeid = youtubeapi.getyoutubeidfromurl(url);
		}

		var id = youtubeid.substring(youtubeid.lastindexof('/') + 1);
		youtubeid = id.split('?');
		return youtubeid[0];
	},

	getyoutubeidfromparam: function getyoutubeidfromparam(url) {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		var parts = url.split('?'),
		    parameters = parts[1].split('&');

		var youtubeid = '';

		for (var i = 0, total = parameters.length; i < total; i++) {
			var paramparts = parameters[i].split('=');
			if (paramparts[0] === 'v') {
				youtubeid = paramparts[1];
				break;
			}
		}

		return youtubeid;
	},

	getyoutubeidfromurl: function getyoutubeidfromurl(url) {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		var parts = url.split('?');
		url = parts[0];
		return url.substring(url.lastindexof('/') + 1);
	},

	getyoutubenocookieurl: function getyoutubenocookieurl(url) {
		if (url === undefined || url === null || !url.trim().length || url.indexof('//www.youtube') === -1) {
			return url;
		}

		var parts = url.split('/');
		parts[2] = parts[2].replace('.com', '-nocookie.com');
		return parts.join('/');
	}
};

var youtubeiframerenderer = {
	name: 'youtube_iframe',

	options: {
		prefix: 'youtube_iframe',

		youtube: {
			autoplay: 0,
			controls: 0,
			disablekb: 1,
			end: 0,
			loop: 0,
			modestbranding: 0,
			playsinline: 0,
			rel: 0,
			showinfo: 0,
			start: 0,
			iv_load_policy: 3,

			nocookie: false,

			imagequality: null
		}
	},

	canplaytype: function canplaytype(type) {
		return ~['video/youtube', 'video/x-youtube'].indexof(type.tolowercase());
	},

	create: function create(mediaelement, options, mediafiles) {

		var youtube = {},
		    apistack = [],
		    readystate = 4;

		var youtubeapi = null,
		    paused = true,
		    ended = false,
		    youtubeiframe = null,
		    volume = 1;

		youtube.options = options;
		youtube.id = mediaelement.id + '_' + options.prefix;
		youtube.mediaelement = mediaelement;

		var props = _mejs2.default.html5media.properties,
		    assigngetterssetters = function assigngetterssetters(propname) {

			var capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

			youtube['get' + capname] = function () {
				if (youtubeapi !== null) {
					var value = null;

					switch (propname) {
						case 'currenttime':
							return youtubeapi.getcurrenttime();
						case 'duration':
							return youtubeapi.getduration();
						case 'volume':
							volume = youtubeapi.getvolume() / 100;
							return volume;
						case 'playbackrate':
							return youtubeapi.getplaybackrate();
						case 'paused':
							return paused;
						case 'ended':
							return ended;
						case 'muted':
							return youtubeapi.ismuted();
						case 'buffered':
							var percentloaded = youtubeapi.getvideoloadedfraction(),
							    duration = youtubeapi.getduration();
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return percentloaded * duration;
								},
								length: 1
							};
						case 'src':
							return youtubeapi.getvideourl();
						case 'readystate':
							return readystate;
					}

					return value;
				} else {
					return null;
				}
			};

			youtube['set' + capname] = function (value) {
				if (youtubeapi !== null) {
					switch (propname) {
						case 'src':
							var url = typeof value === 'string' ? value : value[0].src,
							    _videoid = youtubeapi.getyoutubeid(url);

							if (mediaelement.originalnode.autoplay) {
								youtubeapi.loadvideobyid(_videoid);
							} else {
								youtubeapi.cuevideobyid(_videoid);
							}
							break;
						case 'currenttime':
							youtubeapi.seekto(value);
							break;
						case 'muted':
							if (value) {
								youtubeapi.mute();
							} else {
								youtubeapi.unmute();
							}
							settimeout(function () {
								var event = (0, _general.createevent)('volumechange', youtube);
								mediaelement.dispatchevent(event);
							}, 50);
							break;
						case 'volume':
							volume = value;
							youtubeapi.setvolume(value * 100);
							settimeout(function () {
								var event = (0, _general.createevent)('volumechange', youtube);
								mediaelement.dispatchevent(event);
							}, 50);
							break;
						case 'playbackrate':
							youtubeapi.setplaybackrate(value);
							settimeout(function () {
								var event = (0, _general.createevent)('ratechange', youtube);
								mediaelement.dispatchevent(event);
							}, 50);
							break;
						case 'readystate':
							var event = (0, _general.createevent)('canplay', youtube);
							mediaelement.dispatchevent(event);
							break;
						default:
							
							break;
					}
				} else {
					apistack.push({ type: 'set', propname: propname, value: value });
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assigngetterssetters(props[i]);
		}

		var methods = _mejs2.default.html5media.methods,
		    assignmethods = function assignmethods(methodname) {
			youtube[methodname] = function () {
				if (youtubeapi !== null) {
					switch (methodname) {
						case 'play':
							paused = false;
							return youtubeapi.playvideo();
						case 'pause':
							paused = true;
							return youtubeapi.pausevideo();
						case 'load':
							return null;
					}
				} else {
					apistack.push({ type: 'call', methodname: methodname });
				}
			};
		};

		for (var _i = 0, _total = methods.length; _i < _total; _i++) {
			assignmethods(methods[_i]);
		}

		var errorhandler = function errorhandler(error) {
			var message = '';
			switch (error.data) {
				case 2:
					message = 'the request contains an invalid parameter value. verify that video id has 11 characters and that contains no invalid characters, such as exclamation points or asterisks.';
					break;
				case 5:
					message = 'the requested content cannot be played in an html5 player or another error related to the html5 player has occurred.';
					break;
				case 100:
					message = 'the video requested was not found. either video has been removed or has been marked as private.';
					break;
				case 101:
				case 105:
					message = 'the owner of the requested video does not allow it to be played in embedded players.';
					break;
				default:
					message = 'unknown error.';
					break;
			}
			mediaelement.generateerror('code ' + error.data + ': ' + message, mediafiles);
		};

		var youtubecontainer = _document2.default.createelement('div');
		youtubecontainer.id = youtube.id;

		if (youtube.options.youtube.nocookie) {
			mediaelement.originalnode.src = youtubeapi.getyoutubenocookieurl(mediafiles[0].src);
		}

		mediaelement.originalnode.parentnode.insertbefore(youtubecontainer, mediaelement.originalnode);
		mediaelement.originalnode.style.display = 'none';

		var isaudio = mediaelement.originalnode.tagname.tolowercase() === 'audio',
		    height = isaudio ? '1' : mediaelement.originalnode.height,
		    width = isaudio ? '1' : mediaelement.originalnode.width,
		    videoid = youtubeapi.getyoutubeid(mediafiles[0].src),
		    youtubesettings = {
			id: youtube.id,
			containerid: youtubecontainer.id,
			videoid: videoid,
			height: height,
			width: width,
			host: youtube.options.youtube && youtube.options.youtube.nocookie ? 'https://www.youtube-nocookie.com' : undefined,
			playervars: object.assign({
				controls: 0,
				rel: 0,
				disablekb: 1,
				showinfo: 0,
				modestbranding: 0,
				html5: 1,
				iv_load_policy: 3
			}, youtube.options.youtube),
			origin: _window2.default.location.host,
			events: {
				onready: function onready(e) {
					mediaelement.youtubeapi = youtubeapi = e.target;
					mediaelement.youtubestate = {
						paused: true,
						ended: false
					};

					if (apistack.length) {
						for (var _i2 = 0, _total2 = apistack.length; _i2 < _total2; _i2++) {

							var stackitem = apistack[_i2];

							if (stackitem.type === 'set') {
								var propname = stackitem.propname,
								    capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

								youtube['set' + capname](stackitem.value);
							} else if (stackitem.type === 'call') {
								youtube[stackitem.methodname]();
							}
						}
					}

					youtubeiframe = youtubeapi.getiframe();

					if (mediaelement.originalnode.muted) {
						youtubeapi.mute();
					}

					var events = ['mouseover', 'mouseout'],
					    assignevents = function assignevents(e) {
						var newevent = (0, _general.createevent)(e.type, youtube);
						mediaelement.dispatchevent(newevent);
					};

					for (var _i3 = 0, _total3 = events.length; _i3 < _total3; _i3++) {
						youtubeiframe.addeventlistener(events[_i3], assignevents, false);
					}

					var initevents = ['rendererready', 'loadedmetadata', 'loadeddata', 'canplay'];

					for (var _i4 = 0, _total4 = initevents.length; _i4 < _total4; _i4++) {
						var event = (0, _general.createevent)(initevents[_i4], youtube);
						mediaelement.dispatchevent(event);
					}
				},
				onstatechange: function onstatechange(e) {
					var events = [];

					switch (e.data) {
						case -1:
							events = ['loadedmetadata'];
							paused = true;
							ended = false;
							break;
						case 0:
							events = ['ended'];
							paused = false;
							ended = !youtube.options.youtube.loop;
							if (!youtube.options.youtube.loop) {
								youtube.stopinterval();
							}
							break;
						case 1:
							events = ['play', 'playing'];
							paused = false;
							ended = false;
							youtube.startinterval();
							break;
						case 2:
							events = ['pause'];
							paused = true;
							ended = false;
							youtube.stopinterval();
							break;
						case 3:
							events = ['progress'];
							ended = false;
							break;
						case 5:
							events = ['loadeddata', 'loadedmetadata', 'canplay'];
							paused = true;
							ended = false;
							break;
					}

					for (var _i5 = 0, _total5 = events.length; _i5 < _total5; _i5++) {
						var event = (0, _general.createevent)(events[_i5], youtube);
						mediaelement.dispatchevent(event);
					}
				},
				onerror: function onerror(e) {
					return errorhandler(e);
				}
			}
		};

		if (isaudio || mediaelement.originalnode.hasattribute('playsinline')) {
			youtubesettings.playervars.playsinline = 1;
		}

		if (mediaelement.originalnode.controls) {
			youtubesettings.playervars.controls = 1;
		}
		if (mediaelement.originalnode.autoplay) {
			youtubesettings.playervars.autoplay = 1;
		}
		if (mediaelement.originalnode.loop) {
			youtubesettings.playervars.loop = 1;
		}

		if ((youtubesettings.playervars.loop && parseint(youtubesettings.playervars.loop, 10) === 1 || mediaelement.originalnode.src.indexof('loop=') > -1) && !youtubesettings.playervars.playlist && mediaelement.originalnode.src.indexof('playlist=') === -1) {
			youtubesettings.playervars.playlist = youtubeapi.getyoutubeid(mediaelement.originalnode.src);
		}

		youtubeapi.enqueueiframe(youtubesettings);

		youtube.onevent = function (eventname, player, _youtubestate) {
			if (_youtubestate !== null && _youtubestate !== undefined) {
				mediaelement.youtubestate = _youtubestate;
			}
		};

		youtube.setsize = function (width, height) {
			if (youtubeapi !== null) {
				youtubeapi.setsize(width, height);
			}
		};
		youtube.hide = function () {
			youtube.stopinterval();
			youtube.pause();
			if (youtubeiframe) {
				youtubeiframe.style.display = 'none';
			}
		};
		youtube.show = function () {
			if (youtubeiframe) {
				youtubeiframe.style.display = '';
			}
		};
		youtube.destroy = function () {
			youtubeapi.destroy();
		};
		youtube.interval = null;

		youtube.startinterval = function () {
			youtube.interval = setinterval(function () {
				var event = (0, _general.createevent)('timeupdate', youtube);
				mediaelement.dispatchevent(event);
			}, 250);
		};
		youtube.stopinterval = function () {
			if (youtube.interval) {
				clearinterval(youtube.interval);
			}
		};
		youtube.getposterurl = function () {
			var quality = options.youtube.imagequality,
			    resolutions = ['default', 'hqdefault', 'mqdefault', 'sddefault', 'maxresdefault'],
			    id = youtubeapi.getyoutubeid(mediaelement.originalnode.src);
			return quality && resolutions.indexof(quality) > -1 && id ? 'https://img.youtube.com/vi/' + id + '/' + quality + '.jpg' : '';
		};

		return youtube;
	}
};

_window2.default.onyoutubeplayerapiready = function () {
	youtubeapi.iframeready();
};

_media.typechecks.push(function (url) {
	return (/\/\/(www\.youtube|youtu\.?be)/i.test(url) ? 'video/x-youtube' : null
	);
});

_renderer.renderer.add(youtubeiframerenderer);

},{"2":2,"26":26,"27":27,"28":28,"3":3,"7":7,"8":8}],25:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});
exports.cancelfullscreen = exports.requestfullscreen = exports.isfullscreen = exports.fullscreen_event_name = exports.has_native_fullscreen_enabled = exports.has_true_native_fullscreen = exports.has_ios_fullscreen = exports.has_ms_native_fullscreen = exports.has_moz_native_fullscreen = exports.has_webkit_native_fullscreen = exports.has_native_fullscreen = exports.supports_native_hls = exports.support_passive_event = exports.support_pointer_events = exports.has_mse = exports.is_stock_android = exports.is_safari = exports.is_firefox = exports.is_chrome = exports.is_edge = exports.is_ie = exports.is_android = exports.is_ios = exports.is_ipod = exports.is_iphone = exports.is_ipad = exports.ua = exports.nav = undefined;

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var nav = exports.nav = _window2.default.navigator;
var ua = exports.ua = nav.useragent.tolowercase();
var is_ipad = exports.is_ipad = /ipad/i.test(ua) && !_window2.default.msstream;
var is_iphone = exports.is_iphone = /iphone/i.test(ua) && !_window2.default.msstream;
var is_ipod = exports.is_ipod = /ipod/i.test(ua) && !_window2.default.msstream;
var is_ios = exports.is_ios = /ipad|iphone|ipod/i.test(ua) && !_window2.default.msstream;
var is_android = exports.is_android = /android/i.test(ua);
var is_ie = exports.is_ie = /(trident|microsoft)/i.test(nav.appname);
var is_edge = exports.is_edge = 'mslaunchuri' in nav && !('documentmode' in _document2.default);
var is_chrome = exports.is_chrome = /chrome/i.test(ua);
var is_firefox = exports.is_firefox = /firefox/i.test(ua);
var is_safari = exports.is_safari = /safari/i.test(ua) && !is_chrome;
var is_stock_android = exports.is_stock_android = /^mozilla\/\d+\.\d+\s\(linux;\su;/i.test(ua);
var has_mse = exports.has_mse = 'mediasource' in _window2.default;
var support_pointer_events = exports.support_pointer_events = function () {
	var element = _document2.default.createelement('x'),
	    documentelement = _document2.default.documentelement,
	    getcomputedstyle = _window2.default.getcomputedstyle;

	if (!('pointerevents' in element.style)) {
		return false;
	}

	element.style.pointerevents = 'auto';
	element.style.pointerevents = 'x';
	documentelement.appendchild(element);
	var supports = getcomputedstyle && (getcomputedstyle(element, '') || {}).pointerevents === 'auto';
	element.remove();
	return !!supports;
}();

var support_passive_event = exports.support_passive_event = function () {
	var supportspassive = false;
	try {
		var opts = object.defineproperty({}, 'passive', {
			get: function get() {
				supportspassive = true;
			}
		});
		_window2.default.addeventlistener('test', null, opts);
	} catch (e) {}

	return supportspassive;
}();

var html5elements = ['source', 'track', 'audio', 'video'];
var video = void 0;

for (var i = 0, total = html5elements.length; i < total; i++) {
	video = _document2.default.createelement(html5elements[i]);
}

var supports_native_hls = exports.supports_native_hls = is_safari || is_ie && /edge/i.test(ua);

var hasiosfullscreen = video.webkitenterfullscreen !== undefined;

var hasnativefullscreen = video.requestfullscreen !== undefined;

if (hasiosfullscreen && /mac os x 10_5/i.test(ua)) {
	hasnativefullscreen = false;
	hasiosfullscreen = false;
}

var haswebkitnativefullscreen = video.webkitrequestfullscreen !== undefined;
var hasmoznativefullscreen = video.mozrequestfullscreen !== undefined;
var hasmsnativefullscreen = video.msrequestfullscreen !== undefined;
var hastruenativefullscreen = haswebkitnativefullscreen || hasmoznativefullscreen || hasmsnativefullscreen;
var nativefullscreenenabled = hastruenativefullscreen;
var fullscreeneventname = '';
var isfullscreen = void 0,
    requestfullscreen = void 0,
    cancelfullscreen = void 0;

if (hasmoznativefullscreen) {
	nativefullscreenenabled = _document2.default.mozfullscreenenabled;
} else if (hasmsnativefullscreen) {
	nativefullscreenenabled = _document2.default.msfullscreenenabled;
}

if (is_chrome) {
	hasiosfullscreen = false;
}

if (hastruenativefullscreen) {
	if (haswebkitnativefullscreen) {
		fullscreeneventname = 'webkitfullscreenchange';
	} else if (hasmoznativefullscreen) {
		fullscreeneventname = 'fullscreenchange';
	} else if (hasmsnativefullscreen) {
		fullscreeneventname = 'msfullscreenchange';
	}

	exports.isfullscreen = isfullscreen = function isfullscreen() {
		if (hasmoznativefullscreen) {
			return _document2.default.mozfullscreen;
		} else if (haswebkitnativefullscreen) {
			return _document2.default.webkitisfullscreen;
		} else if (hasmsnativefullscreen) {
			return _document2.default.msfullscreenelement !== null;
		}
	};

	exports.requestfullscreen = requestfullscreen = function requestfullscreen(el) {
		if (haswebkitnativefullscreen) {
			el.webkitrequestfullscreen();
		} else if (hasmoznativefullscreen) {
			el.mozrequestfullscreen();
		} else if (hasmsnativefullscreen) {
			el.msrequestfullscreen();
		}
	};

	exports.cancelfullscreen = cancelfullscreen = function cancelfullscreen() {
		if (haswebkitnativefullscreen) {
			_document2.default.webkitcancelfullscreen();
		} else if (hasmoznativefullscreen) {
			_document2.default.mozcancelfullscreen();
		} else if (hasmsnativefullscreen) {
			_document2.default.msexitfullscreen();
		}
	};
}

var has_native_fullscreen = exports.has_native_fullscreen = hasnativefullscreen;
var has_webkit_native_fullscreen = exports.has_webkit_native_fullscreen = haswebkitnativefullscreen;
var has_moz_native_fullscreen = exports.has_moz_native_fullscreen = hasmoznativefullscreen;
var has_ms_native_fullscreen = exports.has_ms_native_fullscreen = hasmsnativefullscreen;
var has_ios_fullscreen = exports.has_ios_fullscreen = hasiosfullscreen;
var has_true_native_fullscreen = exports.has_true_native_fullscreen = hastruenativefullscreen;
var has_native_fullscreen_enabled = exports.has_native_fullscreen_enabled = nativefullscreenenabled;
var fullscreen_event_name = exports.fullscreen_event_name = fullscreeneventname;
exports.isfullscreen = isfullscreen;
exports.requestfullscreen = requestfullscreen;
exports.cancelfullscreen = cancelfullscreen;


_mejs2.default.features = _mejs2.default.features || {};
_mejs2.default.features.isipad = is_ipad;
_mejs2.default.features.isipod = is_ipod;
_mejs2.default.features.isiphone = is_iphone;
_mejs2.default.features.isios = _mejs2.default.features.isiphone || _mejs2.default.features.isipad;
_mejs2.default.features.isandroid = is_android;
_mejs2.default.features.isie = is_ie;
_mejs2.default.features.isedge = is_edge;
_mejs2.default.features.ischrome = is_chrome;
_mejs2.default.features.isfirefox = is_firefox;
_mejs2.default.features.issafari = is_safari;
_mejs2.default.features.isstockandroid = is_stock_android;
_mejs2.default.features.hasmse = has_mse;
_mejs2.default.features.supportsnativehls = supports_native_hls;
_mejs2.default.features.supportspointerevents = support_pointer_events;
_mejs2.default.features.supportspassiveevent = support_passive_event;
_mejs2.default.features.hasiosfullscreen = has_ios_fullscreen;
_mejs2.default.features.hasnativefullscreen = has_native_fullscreen;
_mejs2.default.features.haswebkitnativefullscreen = has_webkit_native_fullscreen;
_mejs2.default.features.hasmoznativefullscreen = has_moz_native_fullscreen;
_mejs2.default.features.hasmsnativefullscreen = has_ms_native_fullscreen;
_mejs2.default.features.hastruenativefullscreen = has_true_native_fullscreen;
_mejs2.default.features.nativefullscreenenabled = has_native_fullscreen_enabled;
_mejs2.default.features.fullscreeneventname = fullscreen_event_name;
_mejs2.default.features.isfullscreen = isfullscreen;
_mejs2.default.features.requestfullscreen = requestfullscreen;
_mejs2.default.features.cancelfullscreen = cancelfullscreen;

},{"2":2,"3":3,"7":7}],26:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});
exports.removeclass = exports.addclass = exports.hasclass = undefined;
exports.loadscript = loadscript;
exports.offset = offset;
exports.toggleclass = toggleclass;
exports.fadeout = fadeout;
exports.fadein = fadein;
exports.siblings = siblings;
exports.visible = visible;
exports.ajax = ajax;

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

function loadscript(url) {
	return new promise(function (resolve, reject) {
		var script = _document2.default.createelement('script');
		script.src = url;
		script.async = true;
		script.onload = function () {
			script.remove();
			resolve();
		};
		script.onerror = function () {
			script.remove();
			reject();
		};
		_document2.default.head.appendchild(script);
	});
}

function offset(el) {
	var rect = el.getboundingclientrect(),
	    scrollleft = _window2.default.pagexoffset || _document2.default.documentelement.scrollleft,
	    scrolltop = _window2.default.pageyoffset || _document2.default.documentelement.scrolltop;
	return { top: rect.top + scrolltop, left: rect.left + scrollleft };
}

var hasclassmethod = void 0,
    addclassmethod = void 0,
    removeclassmethod = void 0;

if ('classlist' in _document2.default.documentelement) {
	hasclassmethod = function hasclassmethod(el, classname) {
		return el.classlist !== undefined && el.classlist.contains(classname);
	};
	addclassmethod = function addclassmethod(el, classname) {
		return el.classlist.add(classname);
	};
	removeclassmethod = function removeclassmethod(el, classname) {
		return el.classlist.remove(classname);
	};
} else {
	hasclassmethod = function hasclassmethod(el, classname) {
		return new regexp('\\b' + classname + '\\b').test(el.classname);
	};
	addclassmethod = function addclassmethod(el, classname) {
		if (!hasclass(el, classname)) {
			el.classname += ' ' + classname;
		}
	};
	removeclassmethod = function removeclassmethod(el, classname) {
		el.classname = el.classname.replace(new regexp('\\b' + classname + '\\b', 'g'), '');
	};
}

var hasclass = exports.hasclass = hasclassmethod;
var addclass = exports.addclass = addclassmethod;
var removeclass = exports.removeclass = removeclassmethod;

function toggleclass(el, classname) {
	hasclass(el, classname) ? removeclass(el, classname) : addclass(el, classname);
}

function fadeout(el) {
	var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
	var callback = arguments[2];

	if (!el.style.opacity) {
		el.style.opacity = 1;
	}

	var start = null;
	_window2.default.requestanimationframe(function animate(timestamp) {
		start = start || timestamp;
		var progress = timestamp - start;
		var opacity = parsefloat(1 - progress / duration, 2);
		el.style.opacity = opacity < 0 ? 0 : opacity;
		if (progress > duration) {
			if (callback && typeof callback === 'function') {
				callback();
			}
		} else {
			_window2.default.requestanimationframe(animate);
		}
	});
}

function fadein(el) {
	var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
	var callback = arguments[2];

	if (!el.style.opacity) {
		el.style.opacity = 0;
	}

	var start = null;
	_window2.default.requestanimationframe(function animate(timestamp) {
		start = start || timestamp;
		var progress = timestamp - start;
		var opacity = parsefloat(progress / duration, 2);
		el.style.opacity = opacity > 1 ? 1 : opacity;
		if (progress > duration) {
			if (callback && typeof callback === 'function') {
				callback();
			}
		} else {
			_window2.default.requestanimationframe(animate);
		}
	});
}

function siblings(el, filter) {
	var siblings = [];
	el = el.parentnode.firstchild;
	do {
		if (!filter || filter(el)) {
			siblings.push(el);
		}
	} while (el = el.nextsibling);
	return siblings;
}

function visible(elem) {
	if (elem.getclientrects !== undefined && elem.getclientrects === 'function') {
		return !!(elem.offsetwidth || elem.offsetheight || elem.getclientrects().length);
	}
	return !!(elem.offsetwidth || elem.offsetheight);
}

function ajax(url, datatype, success, error) {
	var xhr = _window2.default.xmlhttprequest ? new xmlhttprequest() : new activexobject('microsoft.xmlhttp');

	var type = 'application/x-www-form-urlencoded; charset=utf-8',
	    completed = false,
	    accept = '*/'.concat('*');

	switch (datatype) {
		case 'text':
			type = 'text/plain';
			break;
		case 'json':
			type = 'application/json, text/javascript';
			break;
		case 'html':
			type = 'text/html';
			break;
		case 'xml':
			type = 'application/xml, text/xml';
			break;
	}

	if (type !== 'application/x-www-form-urlencoded') {
		accept = type + ', */*; q=0.01';
	}

	if (xhr) {
		xhr.open('get', url, true);
		xhr.setrequestheader('accept', accept);
		xhr.onreadystatechange = function () {
			if (completed) {
				return;
			}

			if (xhr.readystate === 4) {
				if (xhr.status === 200) {
					completed = true;
					var data = void 0;
					switch (datatype) {
						case 'json':
							data = json.parse(xhr.responsetext);
							break;
						case 'xml':
							data = xhr.responsexml;
							break;
						default:
							data = xhr.responsetext;
							break;
					}
					success(data);
				} else if (typeof error === 'function') {
					error(xhr.status);
				}
			}
		};

		xhr.send();
	}
}

_mejs2.default.utils = _mejs2.default.utils || {};
_mejs2.default.utils.offset = offset;
_mejs2.default.utils.hasclass = hasclass;
_mejs2.default.utils.addclass = addclass;
_mejs2.default.utils.removeclass = removeclass;
_mejs2.default.utils.toggleclass = toggleclass;
_mejs2.default.utils.fadein = fadein;
_mejs2.default.utils.fadeout = fadeout;
_mejs2.default.utils.siblings = siblings;
_mejs2.default.utils.visible = visible;
_mejs2.default.utils.ajax = ajax;
_mejs2.default.utils.loadscript = loadscript;

},{"2":2,"3":3,"7":7}],27:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});
exports.escapehtml = escapehtml;
exports.debounce = debounce;
exports.isobjectempty = isobjectempty;
exports.splitevents = splitevents;
exports.createevent = createevent;
exports.isnodeafter = isnodeafter;
exports.isstring = isstring;

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

function escapehtml(input) {

	if (typeof input !== 'string') {
		throw new error('argument passed must be a string');
	}

	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;'
	};

	return input.replace(/[&<>"]/g, function (c) {
		return map[c];
	});
}

function debounce(func, wait) {
	var _this = this,
	    _arguments = arguments;

	var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


	if (typeof func !== 'function') {
		throw new error('first argument must be a function');
	}

	if (typeof wait !== 'number') {
		throw new error('second argument must be a numeric value');
	}

	var timeout = void 0;
	return function () {
		var context = _this,
		    args = _arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		var callnow = immediate && !timeout;
		cleartimeout(timeout);
		timeout = settimeout(later, wait);

		if (callnow) {
			func.apply(context, args);
		}
	};
}

function isobjectempty(instance) {
	return object.getownpropertynames(instance).length <= 0;
}

function splitevents(events, id) {
	var rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;

	var ret = { d: [], w: [] };
	(events || '').split(' ').foreach(function (v) {
		var eventname = '' + v + (id ? '.' + id : '');

		if (eventname.startswith('.')) {
			ret.d.push(eventname);
			ret.w.push(eventname);
		} else {
			ret[rwindow.test(v) ? 'w' : 'd'].push(eventname);
		}
	});

	ret.d = ret.d.join(' ');
	ret.w = ret.w.join(' ');
	return ret;
}

function createevent(eventname, target) {

	if (typeof eventname !== 'string') {
		throw new error('event name must be a string');
	}

	var eventfrags = eventname.match(/([a-z]+\.([a-z]+))/i),
	    detail = {
		target: target
	};

	if (eventfrags !== null) {
		eventname = eventfrags[1];
		detail.namespace = eventfrags[2];
	}

	return new window.customevent(eventname, {
		detail: detail
	});
}

function isnodeafter(sourcenode, targetnode) {

	return !!(sourcenode && targetnode && sourcenode.comparedocumentposition(targetnode) & 2);
}

function isstring(value) {
	return typeof value === 'string';
}

_mejs2.default.utils = _mejs2.default.utils || {};
_mejs2.default.utils.escapehtml = escapehtml;
_mejs2.default.utils.debounce = debounce;
_mejs2.default.utils.isobjectempty = isobjectempty;
_mejs2.default.utils.splitevents = splitevents;
_mejs2.default.utils.createevent = createevent;
_mejs2.default.utils.isnodeafter = isnodeafter;
_mejs2.default.utils.isstring = isstring;

},{"7":7}],28:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});
exports.typechecks = undefined;
exports.absolutizeurl = absolutizeurl;
exports.formattype = formattype;
exports.getmimefromtype = getmimefromtype;
exports.gettypefromfile = gettypefromfile;
exports.getextension = getextension;
exports.normalizeextension = normalizeextension;

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _general = _dereq_(27);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

var typechecks = exports.typechecks = [];

function absolutizeurl(url) {

	if (typeof url !== 'string') {
		throw new error('`url` argument must be a string');
	}

	var el = document.createelement('div');
	el.innerhtml = '<a href="' + (0, _general.escapehtml)(url) + '">x</a>';
	return el.firstchild.href;
}

function formattype(url) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	return url && !type ? gettypefromfile(url) : type;
}

function getmimefromtype(type) {

	if (typeof type !== 'string') {
		throw new error('`type` argument must be a string');
	}

	return type && type.indexof(';') > -1 ? type.substr(0, type.indexof(';')) : type;
}

function gettypefromfile(url) {

	if (typeof url !== 'string') {
		throw new error('`url` argument must be a string');
	}

	for (var i = 0, total = typechecks.length; i < total; i++) {
		var type = typechecks[i](url);

		if (type) {
			return type;
		}
	}

	var ext = getextension(url),
	    normalizedext = normalizeextension(ext);

	var mime = 'video/mp4';

	if (normalizedext) {
		if (~['mp4', 'm4v', 'ogg', 'ogv', 'webm', 'flv', 'mpeg'].indexof(normalizedext)) {
			mime = 'video/' + normalizedext;
		} else if ('mov' === normalizedext) {
			mime = 'video/quicktime';
		} else if (~['mp3', 'oga', 'wav', 'mid', 'midi'].indexof(normalizedext)) {
			mime = 'audio/' + normalizedext;
		}
	}

	return mime;
}

function getextension(url) {

	if (typeof url !== 'string') {
		throw new error('`url` argument must be a string');
	}

	var baseurl = url.split('?')[0],
	    basename = baseurl.split('\\').pop().split('/').pop();
	return ~basename.indexof('.') ? basename.substring(basename.lastindexof('.') + 1) : '';
}

function normalizeextension(extension) {

	if (typeof extension !== 'string') {
		throw new error('`extension` argument must be a string');
	}

	switch (extension) {
		case 'mp4':
		case 'm4v':
			return 'mp4';
		case 'webm':
		case 'webma':
		case 'webmv':
			return 'webm';
		case 'ogg':
		case 'oga':
		case 'ogv':
			return 'ogg';
		default:
			return extension;
	}
}

_mejs2.default.utils = _mejs2.default.utils || {};
_mejs2.default.utils.typechecks = typechecks;
_mejs2.default.utils.absolutizeurl = absolutizeurl;
_mejs2.default.utils.formattype = formattype;
_mejs2.default.utils.getmimefromtype = getmimefromtype;
_mejs2.default.utils.gettypefromfile = gettypefromfile;
_mejs2.default.utils.getextension = getextension;
_mejs2.default.utils.normalizeextension = normalizeextension;

},{"27":27,"7":7}],29:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _promisepolyfill = _dereq_(4);

var _promisepolyfill2 = _interoprequiredefault(_promisepolyfill);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

(function (arr) {
	arr.foreach(function (item) {
		if (item.hasownproperty('remove')) {
			return;
		}
		object.defineproperty(item, 'remove', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function remove() {
				this.parentnode.removechild(this);
			}
		});
	});
})([element.prototype, characterdata.prototype, documenttype.prototype]);

(function () {

	if (typeof window.customevent === 'function') {
		return false;
	}

	function customevent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = _document2.default.createevent('customevent');
		evt.initcustomevent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	customevent.prototype = window.event.prototype;
	window.customevent = customevent;
})();

if (typeof object.assign !== 'function') {
	object.assign = function (target) {

		if (target === null || target === undefined) {
			throw new typeerror('cannot convert undefined or null to object');
		}

		var to = object(target);

		for (var index = 1, total = arguments.length; index < total; index++) {
			var nextsource = arguments[index];

			if (nextsource !== null) {
				for (var nextkey in nextsource) {
					if (object.prototype.hasownproperty.call(nextsource, nextkey)) {
						to[nextkey] = nextsource[nextkey];
					}
				}
			}
		}
		return to;
	};
}

if (!string.prototype.startswith) {
	string.prototype.startswith = function (searchstring, position) {
		position = position || 0;
		return this.substr(position, searchstring.length) === searchstring;
	};
}

if (!element.prototype.matches) {
	element.prototype.matches = element.prototype.matchesselector || element.prototype.mozmatchesselector || element.prototype.msmatchesselector || element.prototype.omatchesselector || element.prototype.webkitmatchesselector || function (s) {
		var matches = (this.document || this.ownerdocument).queryselectorall(s),
		    i = matches.length - 1;
		while (--i >= 0 && matches.item(i) !== this) {}
		return i > -1;
	};
}

if (window.element && !element.prototype.closest) {
	element.prototype.closest = function (s) {
		var matches = (this.document || this.ownerdocument).queryselectorall(s),
		    i = void 0,
		    el = this;
		do {
			i = matches.length;
			while (--i >= 0 && matches.item(i) !== el) {}
		} while (i < 0 && (el = el.parentelement));
		return el;
	};
}

(function () {
	var lasttime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestanimationframe; ++x) {
		window.requestanimationframe = window[vendors[x] + 'requestanimationframe'];
		window.cancelanimationframe = window[vendors[x] + 'cancelanimationframe'] || window[vendors[x] + 'cancelrequestanimationframe'];
	}

	if (!window.requestanimationframe) window.requestanimationframe = function (callback) {
		var currtime = new date().gettime();
		var timetocall = math.max(0, 16 - (currtime - lasttime));
		var id = window.settimeout(function () {
			callback(currtime + timetocall);
		}, timetocall);
		lasttime = currtime + timetocall;
		return id;
	};

	if (!window.cancelanimationframe) window.cancelanimationframe = function (id) {
		cleartimeout(id);
	};
})();

if (/firefox/i.test(navigator.useragent)) {
	var getcomputedstyle = window.getcomputedstyle;
	window.getcomputedstyle = function (el, pseudoel) {
		var t = getcomputedstyle(el, pseudoel);
		return t === null ? { getpropertyvalue: function getpropertyvalue() {} } : t;
	};
}

if (!window.promise) {
	window.promise = _promisepolyfill2.default;
}

(function (constructor) {
	if (constructor && constructor.prototype && constructor.prototype.children === null) {
		object.defineproperty(constructor.prototype, 'children', {
			get: function get() {
				var i = 0,
				    node = void 0,
				    nodes = this.childnodes,
				    children = [];
				while (node = nodes[i++]) {
					if (node.nodetype === 1) {
						children.push(node);
					}
				}
				return children;
			}
		});
	}
})(window.node || window.element);

},{"2":2,"4":4}],30:[function(_dereq_,module,exports){
'use strict';

object.defineproperty(exports, "__esmodule", {
	value: true
});
exports.isdropframe = isdropframe;
exports.secondstotimecode = secondstotimecode;
exports.timecodetoseconds = timecodetoseconds;
exports.calculatetimeformat = calculatetimeformat;
exports.convertsmptetoseconds = convertsmptetoseconds;

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

function _interoprequiredefault(obj) { return obj && obj.__esmodule ? obj : { default: obj }; }

function isdropframe() {
	var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 25;

	return !(fps % 1 === 0);
}
function secondstotimecode(time) {
	var forcehours = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	var showframecount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	var fps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 25;
	var secondsdecimallength = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	var timeformat = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'hh:mm:ss';


	time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

	var dropframes = math.round(fps * 0.066666),
	    timebase = math.round(fps),
	    framesper24hours = math.round(fps * 3600) * 24,
	    framesper10minutes = math.round(fps * 600),
	    framesep = isdropframe(fps) ? ';' : ':',
	    hours = void 0,
	    minutes = void 0,
	    seconds = void 0,
	    frames = void 0,
	    f = math.round(time * fps);

	if (isdropframe(fps)) {

		if (f < 0) {
			f = framesper24hours + f;
		}

		f = f % framesper24hours;

		var d = math.floor(f / framesper10minutes);
		var m = f % framesper10minutes;
		f = f + dropframes * 9 * d;
		if (m > dropframes) {
			f = f + dropframes * math.floor((m - dropframes) / math.round(timebase * 60 - dropframes));
		}

		var timebasedivision = math.floor(f / timebase);

		hours = math.floor(math.floor(timebasedivision / 60) / 60);
		minutes = math.floor(timebasedivision / 60) % 60;

		if (showframecount) {
			seconds = timebasedivision % 60;
		} else {
			seconds = math.floor(f / timebase % 60).tofixed(secondsdecimallength);
		}
	} else {
		hours = math.floor(time / 3600) % 24;
		minutes = math.floor(time / 60) % 60;
		if (showframecount) {
			seconds = math.floor(time % 60);
		} else {
			seconds = math.floor(time % 60).tofixed(secondsdecimallength);
		}
	}
	hours = hours <= 0 ? 0 : hours;
	minutes = minutes <= 0 ? 0 : minutes;
	seconds = seconds <= 0 ? 0 : seconds;

	seconds = seconds === 60 ? 0 : seconds;
	minutes = minutes === 60 ? 0 : minutes;

	var timeformatfrags = timeformat.split(':');
	var timeformatsettings = {};
	for (var i = 0, total = timeformatfrags.length; i < total; ++i) {
		var unique = '';
		for (var j = 0, t = timeformatfrags[i].length; j < t; j++) {
			if (unique.indexof(timeformatfrags[i][j]) < 0) {
				unique += timeformatfrags[i][j];
			}
		}
		if (~['f', 's', 'm', 'h'].indexof(unique)) {
			timeformatsettings[unique] = timeformatfrags[i].length;
		}
	}

	var result = forcehours || hours > 0 ? (hours < 10 && timeformatsettings.h > 1 ? '0' + hours : hours) + ':' : '';
	result += (minutes < 10 && timeformatsettings.m > 1 ? '0' + minutes : minutes) + ':';
	result += '' + (seconds < 10 && timeformatsettings.s > 1 ? '0' + seconds : seconds);

	if (showframecount) {
		frames = (f % timebase).tofixed(0);
		frames = frames <= 0 ? 0 : frames;
		result += frames < 10 && timeformatsettings.f ? framesep + '0' + frames : '' + framesep + frames;
	}

	return result;
}

function timecodetoseconds(time) {
	var fps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;


	if (typeof time !== 'string') {
		throw new typeerror('time must be a string');
	}

	if (time.indexof(';') > 0) {
		time = time.replace(';', ':');
	}

	if (!/\d{2}(\:\d{2}){0,3}/i.test(time)) {
		throw new typeerror('time code must have the format `00:00:00`');
	}

	var parts = time.split(':');

	var output = void 0,
	    hours = 0,
	    minutes = 0,
	    seconds = 0,
	    frames = 0,
	    totalminutes = 0,
	    dropframes = math.round(fps * 0.066666),
	    timebase = math.round(fps),
	    hframes = timebase * 3600,
	    mframes = timebase * 60;

	switch (parts.length) {
		default:
		case 1:
			seconds = parseint(parts[0], 10);
			break;
		case 2:
			minutes = parseint(parts[0], 10);
			seconds = parseint(parts[1], 10);
			break;
		case 3:
			hours = parseint(parts[0], 10);
			minutes = parseint(parts[1], 10);
			seconds = parseint(parts[2], 10);
			break;
		case 4:
			hours = parseint(parts[0], 10);
			minutes = parseint(parts[1], 10);
			seconds = parseint(parts[2], 10);
			frames = parseint(parts[3], 10);
			break;
	}

	if (isdropframe(fps)) {
		totalminutes = 60 * hours + minutes;
		output = hframes * hours + mframes * minutes + timebase * seconds + frames - dropframes * (totalminutes - math.floor(totalminutes / 10));
	} else {
		output = (hframes * hours + mframes * minutes + fps * seconds + frames) / fps;
	}

	return parsefloat(output.tofixed(3));
}

function calculatetimeformat(time, options) {
	var fps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;


	time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

	var hours = math.floor(time / 3600) % 24,
	    minutes = math.floor(time / 60) % 60,
	    seconds = math.floor(time % 60),
	    frames = math.floor((time % 1 * fps).tofixed(3)),
	    lis = [[frames, 'f'], [seconds, 's'], [minutes, 'm'], [hours, 'h']];

	var format = options.timeformat,
	    firsttwoplaces = format[1] === format[0],
	    separatorindex = firsttwoplaces ? 2 : 1,
	    separator = format.length < separatorindex ? format[separatorindex] : ':',
	    firstchar = format[0],
	    required = false;

	for (var i = 0, len = lis.length; i < len; i++) {
		if (~format.indexof(lis[i][1])) {
			required = true;
		} else if (required) {
			var hasnextvalue = false;
			for (var j = i; j < len; j++) {
				if (lis[j][0] > 0) {
					hasnextvalue = true;
					break;
				}
			}

			if (!hasnextvalue) {
				break;
			}

			if (!firsttwoplaces) {
				format = firstchar + format;
			}
			format = lis[i][1] + separator + format;
			if (firsttwoplaces) {
				format = lis[i][1] + format;
			}
			firstchar = lis[i][1];
		}
	}

	options.timeformat = format;
}

function convertsmptetoseconds(smpte) {

	if (typeof smpte !== 'string') {
		throw new typeerror('argument must be a string value');
	}

	smpte = smpte.replace(',', '.');

	var decimallen = ~smpte.indexof('.') ? smpte.split('.')[1].length : 0;

	var secs = 0,
	    multiplier = 1;

	smpte = smpte.split(':').reverse();

	for (var i = 0, total = smpte.length; i < total; i++) {
		multiplier = 1;
		if (i > 0) {
			multiplier = math.pow(60, i);
		}
		secs += number(smpte[i]) * multiplier;
	}
	return number(secs.tofixed(decimallen));
}

_mejs2.default.utils = _mejs2.default.utils || {};
_mejs2.default.utils.secondstotimecode = secondstotimecode;
_mejs2.default.utils.timecodetoseconds = timecodetoseconds;
_mejs2.default.utils.calculatetimeformat = calculatetimeformat;
_mejs2.default.utils.convertsmptetoseconds = convertsmptetoseconds;

},{"7":7}]},{},[29,6,5,15,23,20,19,21,22,24,16,18,17,9,10,11,12,13,14]);


