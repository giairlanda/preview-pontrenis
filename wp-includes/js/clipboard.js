/*!
 * clipboard.js v2.0.11
 * https://clipboardjs.com/
 *
 * licensed mit â© zeno rocha
 */
(function webpackuniversalmoduledefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["clipboardjs"] = factory();
	else
		root["clipboardjs"] = factory();
})(this, function() {
return /******/ (function() { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 686:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ clipboard; }
});

// external module: ./node_modules/tiny-emitter/index.js
var tiny_emitter = __webpack_require__(279);
var tiny_emitter_default = /*#__pure__*/__webpack_require__.n(tiny_emitter);
// external module: ./node_modules/good-listener/src/listen.js
var listen = __webpack_require__(370);
var listen_default = /*#__pure__*/__webpack_require__.n(listen);
// external module: ./node_modules/select/src/select.js
var src_select = __webpack_require__(817);
var select_default = /*#__pure__*/__webpack_require__.n(src_select);
;// concatenated module: ./src/common/command.js
/**
 * executes a given operation type.
 * @param {string} type
 * @return {boolean}
 */
function command(type) {
  try {
    return document.execcommand(type);
  } catch (err) {
    return false;
  }
}
;// concatenated module: ./src/actions/cut.js


/**
 * cut action wrapper.
 * @param {string|htmlelement} target
 * @return {string}
 */

var clipboardactioncut = function clipboardactioncut(target) {
  var selectedtext = select_default()(target);
  command('cut');
  return selectedtext;
};

/* harmony default export */ var actions_cut = (clipboardactioncut);
;// concatenated module: ./src/common/create-fake-element.js
/**
 * creates a fake textarea element with a value.
 * @param {string} value
 * @return {htmlelement}
 */
function createfakeelement(value) {
  var isrtl = document.documentelement.getattribute('dir') === 'rtl';
  var fakeelement = document.createelement('textarea'); // prevent zooming on ios

  fakeelement.style.fontsize = '12pt'; // reset box model

  fakeelement.style.border = '0';
  fakeelement.style.padding = '0';
  fakeelement.style.margin = '0'; // move element out of screen horizontally

  fakeelement.style.position = 'absolute';
  fakeelement.style[isrtl ? 'right' : 'left'] = '-9999px'; // move element to the same position vertically

  var yposition = window.pageyoffset || document.documentelement.scrolltop;
  fakeelement.style.top = "".concat(yposition, "px");
  fakeelement.setattribute('readonly', '');
  fakeelement.value = value;
  return fakeelement;
}
;// concatenated module: ./src/actions/copy.js



/**
 * create fake copy action wrapper using a fake element.
 * @param {string} target
 * @param {object} options
 * @return {string}
 */

var fakecopyaction = function fakecopyaction(value, options) {
  var fakeelement = createfakeelement(value);
  options.container.appendchild(fakeelement);
  var selectedtext = select_default()(fakeelement);
  command('copy');
  fakeelement.remove();
  return selectedtext;
};
/**
 * copy action wrapper.
 * @param {string|htmlelement} target
 * @param {object} options
 * @return {string}
 */


var clipboardactioncopy = function clipboardactioncopy(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    container: document.body
  };
  var selectedtext = '';

  if (typeof target === 'string') {
    selectedtext = fakecopyaction(target, options);
  } else if (target instanceof htmlinputelement && !['text', 'search', 'url', 'tel', 'password'].includes(target === null || target === void 0 ? void 0 : target.type)) {
    // if input type doesn't support `setselectionrange`. simulate it. https://developer.mozilla.org/en-us/docs/web/api/htmlinputelement/setselectionrange
    selectedtext = fakecopyaction(target.value, options);
  } else {
    selectedtext = select_default()(target);
    command('copy');
  }

  return selectedtext;
};

/* harmony default export */ var actions_copy = (clipboardactioncopy);
;// concatenated module: ./src/actions/default.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof symbol === "function" && typeof symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/**
 * inner function which performs selection from either `text` or `target`
 * properties and then executes copy or cut operations.
 * @param {object} options
 */

var clipboardactiondefault = function clipboardactiondefault() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // defines base properties passed from constructor.
  var _options$action = options.action,
      action = _options$action === void 0 ? 'copy' : _options$action,
      container = options.container,
      target = options.target,
      text = options.text; // sets the `action` to be performed which can be either 'copy' or 'cut'.

  if (action !== 'copy' && action !== 'cut') {
    throw new error('invalid "action" value, use either "copy" or "cut"');
  } // sets the `target` property using an element that will be have its content copied.


  if (target !== undefined) {
    if (target && _typeof(target) === 'object' && target.nodetype === 1) {
      if (action === 'copy' && target.hasattribute('disabled')) {
        throw new error('invalid "target" attribute. please use "readonly" instead of "disabled" attribute');
      }

      if (action === 'cut' && (target.hasattribute('readonly') || target.hasattribute('disabled'))) {
        throw new error('invalid "target" attribute. you can\'t cut text from elements with "readonly" or "disabled" attributes');
      }
    } else {
      throw new error('invalid "target" value, use a valid element');
    }
  } // define selection strategy based on `text` property.


  if (text) {
    return actions_copy(text, {
      container: container
    });
  } // defines which selection strategy based on `target` property.


  if (target) {
    return action === 'cut' ? actions_cut(target) : actions_copy(target, {
      container: container
    });
  }
};

/* harmony default export */ var actions_default = (clipboardactiondefault);
;// concatenated module: ./src/clipboard.js
function clipboard_typeof(obj) { "@babel/helpers - typeof"; if (typeof symbol === "function" && typeof symbol.iterator === "symbol") { clipboard_typeof = function _typeof(obj) { return typeof obj; }; } else { clipboard_typeof = function _typeof(obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; }; } return clipboard_typeof(obj); }

function _classcallcheck(instance, constructor) { if (!(instance instanceof constructor)) { throw new typeerror("cannot call a class as a function"); } }

function _defineproperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; object.defineproperty(target, descriptor.key, descriptor); } }

function _createclass(constructor, protoprops, staticprops) { if (protoprops) _defineproperties(constructor.prototype, protoprops); if (staticprops) _defineproperties(constructor, staticprops); return constructor; }

function _inherits(subclass, superclass) { if (typeof superclass !== "function" && superclass !== null) { throw new typeerror("super expression must either be null or a function"); } subclass.prototype = object.create(superclass && superclass.prototype, { constructor: { value: subclass, writable: true, configurable: true } }); if (superclass) _setprototypeof(subclass, superclass); }

function _setprototypeof(o, p) { _setprototypeof = object.setprototypeof || function _setprototypeof(o, p) { o.__proto__ = p; return o; }; return _setprototypeof(o, p); }

function _createsuper(derived) { var hasnativereflectconstruct = _isnativereflectconstruct(); return function _createsuperinternal() { var super = _getprototypeof(derived), result; if (hasnativereflectconstruct) { var newtarget = _getprototypeof(this).constructor; result = reflect.construct(super, arguments, newtarget); } else { result = super.apply(this, arguments); } return _possibleconstructorreturn(this, result); }; }

function _possibleconstructorreturn(self, call) { if (call && (clipboard_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertthisinitialized(self); }

function _assertthisinitialized(self) { if (self === void 0) { throw new referenceerror("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isnativereflectconstruct() { if (typeof reflect === "undefined" || !reflect.construct) return false; if (reflect.construct.sham) return false; if (typeof proxy === "function") return true; try { date.prototype.tostring.call(reflect.construct(date, [], function () {})); return true; } catch (e) { return false; } }

function _getprototypeof(o) { _getprototypeof = object.setprototypeof ? object.getprototypeof : function _getprototypeof(o) { return o.__proto__ || object.getprototypeof(o); }; return _getprototypeof(o); }






/**
 * helper function to retrieve attribute value.
 * @param {string} suffix
 * @param {element} element
 */

function getattributevalue(suffix, element) {
  var attribute = "data-clipboard-".concat(suffix);

  if (!element.hasattribute(attribute)) {
    return;
  }

  return element.getattribute(attribute);
}
/**
 * base class which takes one or more elements, adds event listeners to them,
 * and instantiates a new `clipboardaction` on each click.
 */


var clipboard = /*#__pure__*/function (_emitter) {
  _inherits(clipboard, _emitter);

  var _super = _createsuper(clipboard);

  /**
   * @param {string|htmlelement|htmlcollection|nodelist} trigger
   * @param {object} options
   */
  function clipboard(trigger, options) {
    var _this;

    _classcallcheck(this, clipboard);

    _this = _super.call(this);

    _this.resolveoptions(options);

    _this.listenclick(trigger);

    return _this;
  }
  /**
   * defines if attributes would be resolved using internal setter functions
   * or custom functions that were passed in the constructor.
   * @param {object} options
   */


  _createclass(clipboard, [{
    key: "resolveoptions",
    value: function resolveoptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.action = typeof options.action === 'function' ? options.action : this.defaultaction;
      this.target = typeof options.target === 'function' ? options.target : this.defaulttarget;
      this.text = typeof options.text === 'function' ? options.text : this.defaulttext;
      this.container = clipboard_typeof(options.container) === 'object' ? options.container : document.body;
    }
    /**
     * adds a click event listener to the passed trigger.
     * @param {string|htmlelement|htmlcollection|nodelist} trigger
     */

  }, {
    key: "listenclick",
    value: function listenclick(trigger) {
      var _this2 = this;

      this.listener = listen_default()(trigger, 'click', function (e) {
        return _this2.onclick(e);
      });
    }
    /**
     * defines a new `clipboardaction` on each click event.
     * @param {event} e
     */

  }, {
    key: "onclick",
    value: function onclick(e) {
      var trigger = e.delegatetarget || e.currenttarget;
      var action = this.action(trigger) || 'copy';
      var text = actions_default({
        action: action,
        container: this.container,
        target: this.target(trigger),
        text: this.text(trigger)
      }); // fires an event based on the copy operation result.

      this.emit(text ? 'success' : 'error', {
        action: action,
        text: text,
        trigger: trigger,
        clearselection: function clearselection() {
          if (trigger) {
            trigger.focus();
          }

          window.getselection().removeallranges();
        }
      });
    }
    /**
     * default `action` lookup function.
     * @param {element} trigger
     */

  }, {
    key: "defaultaction",
    value: function defaultaction(trigger) {
      return getattributevalue('action', trigger);
    }
    /**
     * default `target` lookup function.
     * @param {element} trigger
     */

  }, {
    key: "defaulttarget",
    value: function defaulttarget(trigger) {
      var selector = getattributevalue('target', trigger);

      if (selector) {
        return document.queryselector(selector);
      }
    }
    /**
     * allow fire programmatically a copy action
     * @param {string|htmlelement} target
     * @param {object} options
     * @returns text copied.
     */

  }, {
    key: "defaulttext",

    /**
     * default `text` lookup function.
     * @param {element} trigger
     */
    value: function defaulttext(trigger) {
      return getattributevalue('text', trigger);
    }
    /**
     * destroy lifecycle.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.listener.destroy();
    }
  }], [{
    key: "copy",
    value: function copy(target) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        container: document.body
      };
      return actions_copy(target, options);
    }
    /**
     * allow fire programmatically a cut action
     * @param {string|htmlelement} target
     * @returns text cutted.
     */

  }, {
    key: "cut",
    value: function cut(target) {
      return actions_cut(target);
    }
    /**
     * returns the support of the given action, or all actions if no action is
     * given.
     * @param {string} [action]
     */

  }, {
    key: "issupported",
    value: function issupported() {
      var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];
      var actions = typeof action === 'string' ? [action] : action;
      var support = !!document.querycommandsupported;
      actions.foreach(function (action) {
        support = support && !!document.querycommandsupported(action);
      });
      return support;
    }
  }]);

  return clipboard;
}((tiny_emitter_default()));

/* harmony default export */ var clipboard = (clipboard);

/***/ }),

/***/ 828:
/***/ (function(module) {

var document_node_type = 9;

/**
 * a polyfill for element.matches()
 */
if (typeof element !== 'undefined' && !element.prototype.matches) {
    var proto = element.prototype;

    proto.matches = proto.matchesselector ||
                    proto.mozmatchesselector ||
                    proto.msmatchesselector ||
                    proto.omatchesselector ||
                    proto.webkitmatchesselector;
}

/**
 * finds the closest parent that matches a selector.
 *
 * @param {element} element
 * @param {string} selector
 * @return {function}
 */
function closest (element, selector) {
    while (element && element.nodetype !== document_node_type) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentnode;
    }
}

module.exports = closest;


/***/ }),

/***/ 438:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var closest = __webpack_require__(828);

/**
 * delegates event to a selector.
 *
 * @param {element} element
 * @param {string} selector
 * @param {string} type
 * @param {function} callback
 * @param {boolean} usecapture
 * @return {object}
 */
function _delegate(element, selector, type, callback, usecapture) {
    var listenerfn = listener.apply(this, arguments);

    element.addeventlistener(type, listenerfn, usecapture);

    return {
        destroy: function() {
            element.removeeventlistener(type, listenerfn, usecapture);
        }
    }
}

/**
 * delegates event to a selector.
 *
 * @param {element|string|array} [elements]
 * @param {string} selector
 * @param {string} type
 * @param {function} callback
 * @param {boolean} usecapture
 * @return {object}
 */
function delegate(elements, selector, type, callback, usecapture) {
    // handle the regular element usage
    if (typeof elements.addeventlistener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // handle element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // use `document` as the first parameter, then apply arguments
        // this is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // handle selector-based usage
    if (typeof elements === 'string') {
        elements = document.queryselectorall(elements);
    }

    // handle array-like based usage
    return array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, usecapture);
    });
}

/**
 * finds closest match and invokes callback.
 *
 * @param {element} element
 * @param {string} selector
 * @param {string} type
 * @param {function} callback
 * @return {function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegatetarget = closest(e.target, selector);

        if (e.delegatetarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),

/***/ 879:
/***/ (function(__unused_webpack_module, exports) {

/**
 * check if argument is a html element.
 *
 * @param {object} value
 * @return {boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof htmlelement
        && value.nodetype === 1;
};

/**
 * check if argument is a list of html elements.
 *
 * @param {object} value
 * @return {boolean}
 */
exports.nodelist = function(value) {
    var type = object.prototype.tostring.call(value);

    return value !== undefined
        && (type === '[object nodelist]' || type === '[object htmlcollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * check if argument is a string.
 *
 * @param {object} value
 * @return {boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof string;
};

/**
 * check if argument is a function.
 *
 * @param {object} value
 * @return {boolean}
 */
exports.fn = function(value) {
    var type = object.prototype.tostring.call(value);

    return type === '[object function]';
};


/***/ }),

/***/ 370:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var is = __webpack_require__(879);
var delegate = __webpack_require__(438);

/**
 * validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {string|htmlelement|htmlcollection|nodelist} target
 * @param {string} type
 * @param {function} callback
 * @return {object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new error('missing required arguments');
    }

    if (!is.string(type)) {
        throw new typeerror('second argument must be a string');
    }

    if (!is.fn(callback)) {
        throw new typeerror('third argument must be a function');
    }

    if (is.node(target)) {
        return listennode(target, type, callback);
    }
    else if (is.nodelist(target)) {
        return listennodelist(target, type, callback);
    }
    else if (is.string(target)) {
        return listenselector(target, type, callback);
    }
    else {
        throw new typeerror('first argument must be a string, htmlelement, htmlcollection, or nodelist');
    }
}

/**
 * adds an event listener to a html element
 * and returns a remove listener function.
 *
 * @param {htmlelement} node
 * @param {string} type
 * @param {function} callback
 * @return {object}
 */
function listennode(node, type, callback) {
    node.addeventlistener(type, callback);

    return {
        destroy: function() {
            node.removeeventlistener(type, callback);
        }
    }
}

/**
 * add an event listener to a list of html elements
 * and returns a remove listener function.
 *
 * @param {nodelist|htmlcollection} nodelist
 * @param {string} type
 * @param {function} callback
 * @return {object}
 */
function listennodelist(nodelist, type, callback) {
    array.prototype.foreach.call(nodelist, function(node) {
        node.addeventlistener(type, callback);
    });

    return {
        destroy: function() {
            array.prototype.foreach.call(nodelist, function(node) {
                node.removeeventlistener(type, callback);
            });
        }
    }
}

/**
 * add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {string} selector
 * @param {string} type
 * @param {function} callback
 * @return {object}
 */
function listenselector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;


/***/ }),

/***/ 817:
/***/ (function(module) {

function select(element) {
    var selectedtext;

    if (element.nodename === 'select') {
        element.focus();

        selectedtext = element.value;
    }
    else if (element.nodename === 'input' || element.nodename === 'textarea') {
        var isreadonly = element.hasattribute('readonly');

        if (!isreadonly) {
            element.setattribute('readonly', '');
        }

        element.select();
        element.setselectionrange(0, element.value.length);

        if (!isreadonly) {
            element.removeattribute('readonly');
        }

        selectedtext = element.value;
    }
    else {
        if (element.hasattribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getselection();
        var range = document.createrange();

        range.selectnodecontents(element);
        selection.removeallranges();
        selection.addrange(range);

        selectedtext = selection.tostring();
    }

    return selectedtext;
}

module.exports = select;


/***/ }),

/***/ 279:
/***/ (function(module) {

function e () {
  // keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

e.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtarr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtarr.length;

    for (i; i < len; i++) {
      evtarr[i].fn.apply(evtarr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveevents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveevents.push(evts[i]);
      }
    }

    // remove event from queue to prevent memory leak
    // suggested by https://github.com/lazd
    // ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveevents.length)
      ? e[name] = liveevents
      : delete e[name];

    return this;
  }
};

module.exports = e;
module.exports.tinyemitter = e;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// the module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// the require function
/******/ 	function __webpack_require__(moduleid) {
/******/ 		// check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleid]) {
/******/ 			return __webpack_module_cache__[moduleid].exports;
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
/******/ 	!function() {
/******/ 		// getdefaultexport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esmodule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					object.defineproperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasownproperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return object.prototype.hasownproperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// load entry module and return exports
/******/ 	return __webpack_require__(686);
/******/ })()
.default;
});






