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

var _en = _dereq_(9);

var _general = _dereq_(18);

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

},{"18":18,"7":7,"9":9}],6:[function(_dereq_,module,exports){
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

var _general = _dereq_(18);

var _media2 = _dereq_(19);

var _renderer = _dereq_(8);

var _constants = _dereq_(16);

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

},{"16":16,"18":18,"19":19,"2":2,"3":3,"7":7,"8":8}],7:[function(_dereq_,module,exports){
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

},{}],10:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(18);

var _media = _dereq_(19);

var _constants = _dereq_(16);

var _dom = _dereq_(17);

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

},{"16":16,"17":17,"18":18,"19":19,"3":3,"7":7,"8":8}],11:[function(_dereq_,module,exports){
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

var _general = _dereq_(18);

var _constants = _dereq_(16);

var _media = _dereq_(19);

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

},{"16":16,"18":18,"19":19,"2":2,"3":3,"5":5,"7":7,"8":8}],12:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(18);

var _constants = _dereq_(16);

var _media = _dereq_(19);

var _dom = _dereq_(17);

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

},{"16":16,"17":17,"18":18,"19":19,"3":3,"7":7,"8":8}],13:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof symbol === "function" && typeof symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(18);

var _constants = _dereq_(16);

var _media = _dereq_(19);

var _dom = _dereq_(17);

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

},{"16":16,"17":17,"18":18,"19":19,"3":3,"7":7,"8":8}],14:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(18);

var _constants = _dereq_(16);

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

},{"16":16,"18":18,"2":2,"3":3,"7":7,"8":8}],15:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interoprequiredefault(_window);

var _document = _dereq_(2);

var _document2 = _interoprequiredefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interoprequiredefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(18);

var _media = _dereq_(19);

var _dom = _dereq_(17);

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

},{"17":17,"18":18,"19":19,"2":2,"3":3,"7":7,"8":8}],16:[function(_dereq_,module,exports){
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

},{"2":2,"3":3,"7":7}],17:[function(_dereq_,module,exports){
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

},{"2":2,"3":3,"7":7}],18:[function(_dereq_,module,exports){
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

},{"7":7}],19:[function(_dereq_,module,exports){
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

var _general = _dereq_(18);

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

},{"18":18,"7":7}],20:[function(_dereq_,module,exports){
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

},{"2":2,"4":4}]},{},[20,6,5,9,14,11,10,12,13,15]);






