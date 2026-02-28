/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 4140:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(5795);
if (true) {
  exports.h = m.createroot;
  exports.c = m.hydrateroot;
} else { var i; }


/***/ }),

/***/ 5795:
/***/ ((module) => {

module.exports = window["reactdom"];

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
  children: () => (/* reexport */ external_react_namespaceobject.children),
  component: () => (/* reexport */ external_react_namespaceobject.component),
  fragment: () => (/* reexport */ external_react_namespaceobject.fragment),
  platform: () => (/* reexport */ platform_default),
  purecomponent: () => (/* reexport */ external_react_namespaceobject.purecomponent),
  rawhtml: () => (/* reexport */ rawhtml),
  strictmode: () => (/* reexport */ external_react_namespaceobject.strictmode),
  suspense: () => (/* reexport */ external_react_namespaceobject.suspense),
  cloneelement: () => (/* reexport */ external_react_namespaceobject.cloneelement),
  concatchildren: () => (/* reexport */ concatchildren),
  createcontext: () => (/* reexport */ external_react_namespaceobject.createcontext),
  createelement: () => (/* reexport */ external_react_namespaceobject.createelement),
  createinterpolateelement: () => (/* reexport */ create_interpolate_element_default),
  createportal: () => (/* reexport */ external_reactdom_.createportal),
  createref: () => (/* reexport */ external_react_namespaceobject.createref),
  createroot: () => (/* reexport */ client/* createroot */.h),
  finddomnode: () => (/* reexport */ external_reactdom_.finddomnode),
  flushsync: () => (/* reexport */ external_reactdom_.flushsync),
  forwardref: () => (/* reexport */ external_react_namespaceobject.forwardref),
  hydrate: () => (/* reexport */ external_reactdom_.hydrate),
  hydrateroot: () => (/* reexport */ client/* hydrateroot */.c),
  isemptyelement: () => (/* reexport */ isemptyelement),
  isvalidelement: () => (/* reexport */ external_react_namespaceobject.isvalidelement),
  lazy: () => (/* reexport */ external_react_namespaceobject.lazy),
  memo: () => (/* reexport */ external_react_namespaceobject.memo),
  render: () => (/* reexport */ external_reactdom_.render),
  rendertostring: () => (/* reexport */ serialize_default),
  starttransition: () => (/* reexport */ external_react_namespaceobject.starttransition),
  switchchildrennodename: () => (/* reexport */ switchchildrennodename),
  unmountcomponentatnode: () => (/* reexport */ external_reactdom_.unmountcomponentatnode),
  usecallback: () => (/* reexport */ external_react_namespaceobject.usecallback),
  usecontext: () => (/* reexport */ external_react_namespaceobject.usecontext),
  usedebugvalue: () => (/* reexport */ external_react_namespaceobject.usedebugvalue),
  usedeferredvalue: () => (/* reexport */ external_react_namespaceobject.usedeferredvalue),
  useeffect: () => (/* reexport */ external_react_namespaceobject.useeffect),
  useid: () => (/* reexport */ external_react_namespaceobject.useid),
  useimperativehandle: () => (/* reexport */ external_react_namespaceobject.useimperativehandle),
  useinsertioneffect: () => (/* reexport */ external_react_namespaceobject.useinsertioneffect),
  uselayouteffect: () => (/* reexport */ external_react_namespaceobject.uselayouteffect),
  usememo: () => (/* reexport */ external_react_namespaceobject.usememo),
  usereducer: () => (/* reexport */ external_react_namespaceobject.usereducer),
  useref: () => (/* reexport */ external_react_namespaceobject.useref),
  usestate: () => (/* reexport */ external_react_namespaceobject.usestate),
  usesyncexternalstore: () => (/* reexport */ external_react_namespaceobject.usesyncexternalstore),
  usetransition: () => (/* reexport */ external_react_namespaceobject.usetransition)
});

;// external "react"
const external_react_namespaceobject = window["react"];
;// ./node_modules/@wordpress/element/build-module/create-interpolate-element.js

let indoc;
let offset;
let output;
let stack;
const tokenizer = /<(\/)?(\w+)\s*(\/)?>/g;
function createframe(element, tokenstart, tokenlength, prevoffset, leadingtextstart) {
  return {
    element,
    tokenstart,
    tokenlength,
    prevoffset,
    leadingtextstart,
    children: []
  };
}
const createinterpolateelement = (interpolatedstring, conversionmap) => {
  indoc = interpolatedstring;
  offset = 0;
  output = [];
  stack = [];
  tokenizer.lastindex = 0;
  if (!isvalidconversionmap(conversionmap)) {
    throw new typeerror(
      "the conversionmap provided is not valid. it must be an object with values that are react elements"
    );
  }
  do {
  } while (proceed(conversionmap));
  return (0,external_react_namespaceobject.createelement)(external_react_namespaceobject.fragment, null, ...output);
};
const isvalidconversionmap = (conversionmap) => {
  const isobject = typeof conversionmap === "object" && conversionmap !== null;
  const values = isobject && object.values(conversionmap);
  return isobject && values.length > 0 && values.every((element) => (0,external_react_namespaceobject.isvalidelement)(element));
};
function proceed(conversionmap) {
  const next = nexttoken();
  const [tokentype, name, startoffset, tokenlength] = next;
  const stackdepth = stack.length;
  const leadingtextstart = startoffset > offset ? offset : null;
  if (name && !conversionmap[name]) {
    addtext();
    return false;
  }
  switch (tokentype) {
    case "no-more-tokens":
      if (stackdepth !== 0) {
        const { leadingtextstart: stackleadingtext, tokenstart } = stack.pop();
        output.push(indoc.substr(stackleadingtext, tokenstart));
      }
      addtext();
      return false;
    case "self-closed":
      if (0 === stackdepth) {
        if (null !== leadingtextstart) {
          output.push(
            indoc.substr(
              leadingtextstart,
              startoffset - leadingtextstart
            )
          );
        }
        output.push(conversionmap[name]);
        offset = startoffset + tokenlength;
        return true;
      }
      addchild(
        createframe(conversionmap[name], startoffset, tokenlength)
      );
      offset = startoffset + tokenlength;
      return true;
    case "opener":
      stack.push(
        createframe(
          conversionmap[name],
          startoffset,
          tokenlength,
          startoffset + tokenlength,
          leadingtextstart
        )
      );
      offset = startoffset + tokenlength;
      return true;
    case "closer":
      if (1 === stackdepth) {
        closeouterelement(startoffset);
        offset = startoffset + tokenlength;
        return true;
      }
      const stacktop = stack.pop();
      const text = indoc.substr(
        stacktop.prevoffset,
        startoffset - stacktop.prevoffset
      );
      stacktop.children.push(text);
      stacktop.prevoffset = startoffset + tokenlength;
      const frame = createframe(
        stacktop.element,
        stacktop.tokenstart,
        stacktop.tokenlength,
        startoffset + tokenlength
      );
      frame.children = stacktop.children;
      addchild(frame);
      offset = startoffset + tokenlength;
      return true;
    default:
      addtext();
      return false;
  }
}
function nexttoken() {
  const matches = tokenizer.exec(indoc);
  if (null === matches) {
    return ["no-more-tokens"];
  }
  const startedat = matches.index;
  const [match, isclosing, name, isselfclosed] = matches;
  const length = match.length;
  if (isselfclosed) {
    return ["self-closed", name, startedat, length];
  }
  if (isclosing) {
    return ["closer", name, startedat, length];
  }
  return ["opener", name, startedat, length];
}
function addtext() {
  const length = indoc.length - offset;
  if (0 === length) {
    return;
  }
  output.push(indoc.substr(offset, length));
}
function addchild(frame) {
  const { element, tokenstart, tokenlength, prevoffset, children } = frame;
  const parent = stack[stack.length - 1];
  const text = indoc.substr(
    parent.prevoffset,
    tokenstart - parent.prevoffset
  );
  if (text) {
    parent.children.push(text);
  }
  parent.children.push((0,external_react_namespaceobject.cloneelement)(element, null, ...children));
  parent.prevoffset = prevoffset ? prevoffset : tokenstart + tokenlength;
}
function closeouterelement(endoffset) {
  const { element, leadingtextstart, prevoffset, tokenstart, children } = stack.pop();
  const text = endoffset ? indoc.substr(prevoffset, endoffset - prevoffset) : indoc.substr(prevoffset);
  if (text) {
    children.push(text);
  }
  if (null !== leadingtextstart) {
    output.push(
      indoc.substr(leadingtextstart, tokenstart - leadingtextstart)
    );
  }
  output.push((0,external_react_namespaceobject.cloneelement)(element, null, ...children));
}
var create_interpolate_element_default = createinterpolateelement;


;// ./node_modules/@wordpress/element/build-module/react.js

function concatchildren(...childrenarguments) {
  return childrenarguments.reduce(
    (accumulator, children, i) => {
      external_react_namespaceobject.children.foreach(children, (child, j) => {
        if ((0,external_react_namespaceobject.isvalidelement)(child) && typeof child !== "string") {
          child = (0,external_react_namespaceobject.cloneelement)(child, {
            key: [i, j].join()
          });
        }
        accumulator.push(child);
      });
      return accumulator;
    },
    []
  );
}
function switchchildrennodename(children, nodename) {
  return children && external_react_namespaceobject.children.map(children, (elt, index) => {
    if (typeof elt?.valueof() === "string") {
      return (0,external_react_namespaceobject.createelement)(nodename, { key: index }, elt);
    }
    if (!(0,external_react_namespaceobject.isvalidelement)(elt)) {
      return elt;
    }
    const { children: childrenprop, ...props } = elt.props;
    return (0,external_react_namespaceobject.createelement)(
      nodename,
      { key: index, ...props },
      childrenprop
    );
  });
}


// external module: external "reactdom"
var external_reactdom_ = __webpack_require__(5795);
// external module: ./node_modules/react-dom/client.js
var client = __webpack_require__(4140);
;// ./node_modules/@wordpress/element/build-module/react-platform.js




;// ./node_modules/@wordpress/element/build-module/utils.js
const isemptyelement = (element) => {
  if (typeof element === "number") {
    return false;
  }
  if (typeof element?.valueof() === "string" || array.isarray(element)) {
    return !element.length;
  }
  return !element;
};


;// ./node_modules/@wordpress/element/build-module/platform.js
const platform = {
  /** platform identifier. will always be `'web'` in this module. */
  os: "web",
  /**
   * select a value based on the platform.
   *
   * @template t
   * @param    spec - object with optional platform-specific values.
   * @return the selected value.
   */
  select(spec) {
    return "web" in spec ? spec.web : spec.default;
  },
  /** whether the platform is web */
  isweb: true
};
var platform_default = platform;


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



;// ./node_modules/tslib/tslib.es6.mjs
/******************************************************************************
copyright (c) microsoft corporation.

permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

the software is provided "as is" and the author disclaims all warranties with
regard to this software including all implied warranties of merchantability
and fitness. in no event shall the author be liable for any special, direct,
indirect, or consequential damages or any damages whatsoever resulting from
loss of use, data or profits, whether in an action of contract, negligence or
other tortious action, arising out of or in connection with the use or
performance of this software.
***************************************************************************** */
/* global reflect, promise, suppressederror, symbol, iterator */

var extendstatics = function(d, b) {
  extendstatics = object.setprototypeof ||
      ({ __proto__: [] } instanceof array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (object.prototype.hasownproperty.call(b, p)) d[p] = b[p]; };
  return extendstatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new typeerror("class extends value " + string(b) + " is not a constructor or null");
  extendstatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (object.prototype.hasownproperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (object.prototype.hasownproperty.call(s, p) && e.indexof(p) < 0)
      t[p] = s[p];
  if (s != null && typeof object.getownpropertysymbols === "function")
      for (var i = 0, p = object.getownpropertysymbols(s); i < p.length; i++) {
          if (e.indexof(p[i]) < 0 && object.prototype.propertyisenumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = object.getownpropertydescriptor(target, key) : desc, d;
  if (typeof reflect === "object" && typeof reflect.decorate === "function") r = reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && object.defineproperty(target, key, r), r;
}

function __param(paramindex, decorator) {
  return function (target, key) { decorator(target, key, paramindex); }
}

function __esdecorate(ctor, descriptorin, decorators, contextin, initializers, extrainitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new typeerror("function expected"); return f; }
  var kind = contextin.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorin && ctor ? contextin["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorin || (target ? object.getownpropertydescriptor(target, contextin.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextin) context[p] = p === "access" ? {} : contextin[p];
      for (var p in contextin.access) context.access[p] = contextin.access[p];
      context.addinitializer = function (f) { if (done) throw new typeerror("cannot add initializers after decoration has completed"); extrainitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new typeerror("object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) object.defineproperty(target, contextin.name, descriptor);
  done = true;
};

function __runinitializers(thisarg, initializers, value) {
  var usevalue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = usevalue ? initializers[i].call(thisarg, value) : initializers[i].call(thisarg);
  }
  return usevalue ? value : void 0;
};

function __propkey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setfunctionname(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return object.defineproperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadatakey, metadatavalue) {
  if (typeof reflect === "object" && typeof reflect.metadata === "function") return reflect.metadata(metadatakey, metadatavalue);
}

function __awaiter(thisarg, _arguments, p, generator) {
  function adopt(value) { return value instanceof p ? value : new p(function (resolve) { resolve(value); }); }
  return new (p || (p = promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisarg, _arguments || [])).next());
  });
}

function __generator(thisarg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = object.create((typeof iterator === "function" ? iterator : object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof symbol === "function" && (g[symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new typeerror("generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisarg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createbinding = object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = object.getownpropertydescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esmodule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  object.defineproperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportstar(m, o) {
  for (var p in m) if (p !== "default" && !object.prototype.hasownproperty.call(o, p)) __createbinding(o, m, p);
}

function __values(o) {
  var s = typeof symbol === "function" && symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new typeerror(s ? "object is not iterable." : "symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof symbol === "function" && o[symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadarrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadarray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncgenerator(thisarg, _arguments, generator) {
  if (!symbol.asynciterator) throw new typeerror("symbol.asynciterator is not defined.");
  var g = generator.apply(thisarg, _arguments || []), i, q = [];
  return i = object.create((typeof asynciterator === "function" ? asynciterator : object).prototype), verb("next"), verb("throw"), verb("return", awaitreturn), i[symbol.asynciterator] = function () { return this; }, i;
  function awaitreturn(f) { return function (v) { return promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncdelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncvalues(o) {
  if (!symbol.asynciterator) throw new typeerror("symbol.asynciterator is not defined.");
  var m = o[symbol.asynciterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[symbol.asynciterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __maketemplateobject(cooked, raw) {
  if (object.defineproperty) { object.defineproperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setmoduledefault = object.create ? (function(o, v) {
  object.defineproperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownkeys = function(o) {
  ownkeys = object.getownpropertynames || function (o) {
    var ar = [];
    for (var k in o) if (object.prototype.hasownproperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownkeys(o);
};

function __importstar(mod) {
  if (mod && mod.__esmodule) return mod;
  var result = {};
  if (mod != null) for (var k = ownkeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createbinding(result, mod, k[i]);
  __setmoduledefault(result, mod);
  return result;
}

function __importdefault(mod) {
  return (mod && mod.__esmodule) ? mod : { default: mod };
}

function __classprivatefieldget(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new typeerror("private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new typeerror("cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classprivatefieldset(receiver, state, value, kind, f) {
  if (kind === "m") throw new typeerror("private method is not writable");
  if (kind === "a" && !f) throw new typeerror("private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new typeerror("cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classprivatefieldin(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new typeerror("cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __adddisposableresource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new typeerror("object expected.");
    var dispose, inner;
    if (async) {
      if (!symbol.asyncdispose) throw new typeerror("symbol.asyncdispose is not defined.");
      dispose = value[symbol.asyncdispose];
    }
    if (dispose === void 0) {
      if (!symbol.dispose) throw new typeerror("symbol.dispose is not defined.");
      dispose = value[symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new typeerror("object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _suppressederror = typeof suppressederror === "function" ? suppressederror : function (error, suppressed, message) {
  var e = new error(message);
  return e.name = "suppressederror", e.error = error, e.suppressed = suppressed, e;
};

function __disposeresources(env) {
  function fail(e) {
    env.error = env.haserror ? new _suppressederror(e, env.error, "an error was suppressed during disposal.") : e;
    env.haserror = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.haserror ? promise.reject(env.error) : promise.resolve();
    if (env.haserror) throw env.error;
  }
  return next();
}

function __rewriterelativeimportextension(path, preservejsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preservejsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.tolowercase() + "js");
      });
  }
  return path;
}

/* harmony default export */ const tslib_es6 = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esdecorate,
  __runinitializers,
  __propkey,
  __setfunctionname,
  __metadata,
  __awaiter,
  __generator,
  __createbinding,
  __exportstar,
  __values,
  __read,
  __spread,
  __spreadarrays,
  __spreadarray,
  __await,
  __asyncgenerator,
  __asyncdelegator,
  __asyncvalues,
  __maketemplateobject,
  __importstar,
  __importdefault,
  __classprivatefieldget,
  __classprivatefieldset,
  __classprivatefieldin,
  __adddisposableresource,
  __disposeresources,
  __rewriterelativeimportextension,
});

;// ./node_modules/lower-case/dist.es2015/index.js
/**
 * source: ftp://ftp.unicode.org/public/ucd/latest/ucd/specialcasing.txt
 */
var supported_locale = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            ä°: "\u0069",
            i: "\u0131",
            iì‡: "\u0069",
        },
    },
    az: {
        regexp: /\u0130/g,
        map: {
            ä°: "\u0069",
            i: "\u0131",
            iì‡: "\u0069",
        },
    },
    lt: {
        regexp: /\u0049|\u004a|\u012e|\u00cc|\u00cd|\u0128/g,
        map: {
            i: "\u0069\u0307",
            j: "\u006a\u0307",
            ä®: "\u012f\u0307",
            ãœ: "\u0069\u0307\u0300",
            ã: "\u0069\u0307\u0301",
            ä¨: "\u0069\u0307\u0303",
        },
    },
};
/**
 * localized lower case.
 */
function localelowercase(str, locale) {
    var lang = supported_locale[locale.tolowercase()];
    if (lang)
        return lowercase(str.replace(lang.regexp, function (m) { return lang.map[m]; }));
    return lowercase(str);
}
/**
 * lower case as a function.
 */
function lowercase(str) {
    return str.tolowercase();
}

;// ./node_modules/no-case/dist.es2015/index.js

// support camel case ("camelcase" -> "camel case" and "camelcase" -> "camel case").
var default_split_regexp = [/([a-z0-9])([a-z])/g, /([a-z])([a-z][a-z])/g];
// remove all non-word characters.
var default_strip_regexp = /[^a-z0-9]+/gi;
/**
 * normalize the string into something other libraries can manipulate easier.
 */
function nocase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitregexp, splitregexp = _a === void 0 ? default_split_regexp : _a, _b = options.stripregexp, stripregexp = _b === void 0 ? default_strip_regexp : _b, _c = options.transform, transform = _c === void 0 ? lowercase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitregexp, "$1\0$2"), stripregexp, "\0");
    var start = 0;
    var end = result.length;
    // trim the delimiter from around the output string.
    while (result.charat(start) === "\0")
        start++;
    while (result.charat(end - 1) === "\0")
        end--;
    // transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof regexp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}

;// ./node_modules/dot-case/dist.es2015/index.js


function dotcase(input, options) {
    if (options === void 0) { options = {}; }
    return nocase(input, __assign({ delimiter: "." }, options));
}

;// ./node_modules/param-case/dist.es2015/index.js


function paramcase(input, options) {
    if (options === void 0) { options = {}; }
    return dotcase(input, __assign({ delimiter: "-" }, options));
}

;// external ["wp","escapehtml"]
const external_wp_escapehtml_namespaceobject = window["wp"]["escapehtml"];
;// ./node_modules/@wordpress/element/build-module/raw-html.js

function rawhtml({
  children,
  ...props
}) {
  let rawhtml = "";
  external_react_namespaceobject.children.toarray(children).foreach((child) => {
    if (typeof child === "string" && child.trim() !== "") {
      rawhtml += child;
    }
  });
  return (0,external_react_namespaceobject.createelement)("div", {
    dangerouslysetinnerhtml: { __html: rawhtml },
    ...props
  });
}


;// ./node_modules/@wordpress/element/build-module/serialize.js





const context = (0,external_react_namespaceobject.createcontext)(void 0);
context.displayname = "elementcontext";
const { provider, consumer } = context;
const forwardref = (0,external_react_namespaceobject.forwardref)(() => {
  return null;
});
const attributes_types = /* @__pure__ */ new set(["string", "boolean", "number"]);
const self_closing_tags = /* @__pure__ */ new set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
const boolean_attributes = /* @__pure__ */ new set([
  "allowfullscreen",
  "allowpaymentrequest",
  "allowusermedia",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "download",
  "formnovalidate",
  "hidden",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "typemustmatch"
]);
const enumerated_attributes = /* @__pure__ */ new set([
  "autocapitalize",
  "autocomplete",
  "charset",
  "contenteditable",
  "crossorigin",
  "decoding",
  "dir",
  "draggable",
  "enctype",
  "formenctype",
  "formmethod",
  "http-equiv",
  "inputmode",
  "kind",
  "method",
  "preload",
  "scope",
  "shape",
  "spellcheck",
  "translate",
  "type",
  "wrap"
]);
const css_properties_supports_unitless = /* @__pure__ */ new set([
  "animation",
  "animationiterationcount",
  "baselineshift",
  "borderimageoutset",
  "borderimageslice",
  "borderimagewidth",
  "columncount",
  "cx",
  "cy",
  "fillopacity",
  "flexgrow",
  "flexshrink",
  "floodopacity",
  "fontweight",
  "gridcolumnend",
  "gridcolumnstart",
  "gridrowend",
  "gridrowstart",
  "lineheight",
  "opacity",
  "order",
  "orphans",
  "r",
  "rx",
  "ry",
  "shapeimagethreshold",
  "stopopacity",
  "strokedasharray",
  "strokedashoffset",
  "strokemiterlimit",
  "strokeopacity",
  "strokewidth",
  "tabsize",
  "widows",
  "x",
  "y",
  "zindex",
  "zoom"
]);
function hasprefix(string, prefixes) {
  return prefixes.some((prefix) => string.indexof(prefix) === 0);
}
function isinternalattribute(attribute) {
  return "key" === attribute || "children" === attribute;
}
function getnormalattributevalue(attribute, value) {
  switch (attribute) {
    case "style":
      return renderstyle(value);
  }
  return value;
}
const svg_attribute_with_dashes_list = [
  "accentheight",
  "alignmentbaseline",
  "arabicform",
  "baselineshift",
  "capheight",
  "clippath",
  "cliprule",
  "colorinterpolation",
  "colorinterpolationfilters",
  "colorprofile",
  "colorrendering",
  "dominantbaseline",
  "enablebackground",
  "fillopacity",
  "fillrule",
  "floodcolor",
  "floodopacity",
  "fontfamily",
  "fontsize",
  "fontsizeadjust",
  "fontstretch",
  "fontstyle",
  "fontvariant",
  "fontweight",
  "glyphname",
  "glyphorientationhorizontal",
  "glyphorientationvertical",
  "horizadvx",
  "horizoriginx",
  "imagerendering",
  "letterspacing",
  "lightingcolor",
  "markerend",
  "markermid",
  "markerstart",
  "overlineposition",
  "overlinethickness",
  "paintorder",
  "panose1",
  "pointerevents",
  "renderingintent",
  "shaperendering",
  "stopcolor",
  "stopopacity",
  "strikethroughposition",
  "strikethroughthickness",
  "strokedasharray",
  "strokedashoffset",
  "strokelinecap",
  "strokelinejoin",
  "strokemiterlimit",
  "strokeopacity",
  "strokewidth",
  "textanchor",
  "textdecoration",
  "textrendering",
  "underlineposition",
  "underlinethickness",
  "unicodebidi",
  "unicoderange",
  "unitsperem",
  "valphabetic",
  "vhanging",
  "videographic",
  "vmathematical",
  "vectoreffect",
  "vertadvy",
  "vertoriginx",
  "vertoriginy",
  "wordspacing",
  "writingmode",
  "xmlnsxlink",
  "xheight"
].reduce(
  (map, attribute) => {
    map[attribute.tolowercase()] = attribute;
    return map;
  },
  {}
);
const case_sensitive_svg_attributes = [
  "allowreorder",
  "attributename",
  "attributetype",
  "autoreverse",
  "basefrequency",
  "baseprofile",
  "calcmode",
  "clippathunits",
  "contentscripttype",
  "contentstyletype",
  "diffuseconstant",
  "edgemode",
  "externalresourcesrequired",
  "filterres",
  "filterunits",
  "glyphref",
  "gradienttransform",
  "gradientunits",
  "kernelmatrix",
  "kernelunitlength",
  "keypoints",
  "keysplines",
  "keytimes",
  "lengthadjust",
  "limitingconeangle",
  "markerheight",
  "markerunits",
  "markerwidth",
  "maskcontentunits",
  "maskunits",
  "numoctaves",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointsatx",
  "pointsaty",
  "pointsatz",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "requiredextensions",
  "requiredfeatures",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "suppresscontenteditablewarning",
  "suppresshydrationwarning",
  "surfacescale",
  "systemlanguage",
  "tablevalues",
  "targetx",
  "targety",
  "textlength",
  "viewbox",
  "viewtarget",
  "xchannelselector",
  "ychannelselector"
].reduce(
  (map, attribute) => {
    map[attribute.tolowercase()] = attribute;
    return map;
  },
  {}
);
const svg_attributes_with_colons = [
  "xlink:actuate",
  "xlink:arcrole",
  "xlink:href",
  "xlink:role",
  "xlink:show",
  "xlink:title",
  "xlink:type",
  "xml:base",
  "xml:lang",
  "xml:space",
  "xmlns:xlink"
].reduce(
  (map, attribute) => {
    map[attribute.replace(":", "").tolowercase()] = attribute;
    return map;
  },
  {}
);
function getnormalattributename(attribute) {
  switch (attribute) {
    case "htmlfor":
      return "for";
    case "classname":
      return "class";
  }
  const attributelowercase = attribute.tolowercase();
  if (case_sensitive_svg_attributes[attributelowercase]) {
    return case_sensitive_svg_attributes[attributelowercase];
  } else if (svg_attribute_with_dashes_list[attributelowercase]) {
    return paramcase(
      svg_attribute_with_dashes_list[attributelowercase]
    );
  } else if (svg_attributes_with_colons[attributelowercase]) {
    return svg_attributes_with_colons[attributelowercase];
  }
  return attributelowercase;
}
function getnormalstylepropertyname(property) {
  if (property.startswith("--")) {
    return property;
  }
  if (hasprefix(property, ["ms", "o", "moz", "webkit"])) {
    return "-" + paramcase(property);
  }
  return paramcase(property);
}
function getnormalstylepropertyvalue(property, value) {
  if (typeof value === "number" && 0 !== value && !hasprefix(property, ["--"]) && !css_properties_supports_unitless.has(property)) {
    return value + "px";
  }
  return value;
}
function renderelement(element, context, legacycontext = {}) {
  if (null === element || void 0 === element || false === element) {
    return "";
  }
  if (array.isarray(element)) {
    return renderchildren(element, context, legacycontext);
  }
  switch (typeof element) {
    case "string":
      return (0,external_wp_escapehtml_namespaceobject.escapehtml)(element);
    case "number":
      return element.tostring();
  }
  const { type, props } = element;
  switch (type) {
    case external_react_namespaceobject.strictmode:
    case external_react_namespaceobject.fragment:
      return renderchildren(props.children, context, legacycontext);
    case rawhtml:
      const { children, ...wrapperprops } = props;
      return rendernativecomponent(
        !object.keys(wrapperprops).length ? null : "div",
        {
          ...wrapperprops,
          dangerouslysetinnerhtml: { __html: children }
        },
        context,
        legacycontext
      );
  }
  switch (typeof type) {
    case "string":
      return rendernativecomponent(type, props, context, legacycontext);
    case "function":
      if (type.prototype && typeof type.prototype.render === "function") {
        return rendercomponent(type, props, context, legacycontext);
      }
      return renderelement(
        type(props, legacycontext),
        context,
        legacycontext
      );
  }
  switch (type && type.$$typeof) {
    case provider.$$typeof:
      return renderchildren(props.children, props.value, legacycontext);
    case consumer.$$typeof:
      return renderelement(
        props.children(context || type._currentvalue),
        context,
        legacycontext
      );
    case forwardref.$$typeof:
      return renderelement(
        type.render(props),
        context,
        legacycontext
      );
  }
  return "";
}
function rendernativecomponent(type, props, context, legacycontext = {}) {
  let content = "";
  if (type === "textarea" && props.hasownproperty("value")) {
    content = renderchildren(props.value, context, legacycontext);
    const { value, ...restprops } = props;
    props = restprops;
  } else if (props.dangerouslysetinnerhtml && typeof props.dangerouslysetinnerhtml.__html === "string") {
    content = props.dangerouslysetinnerhtml.__html;
  } else if (typeof props.children !== "undefined") {
    content = renderchildren(props.children, context, legacycontext);
  }
  if (!type) {
    return content;
  }
  const attributes = renderattributes(props);
  if (self_closing_tags.has(type)) {
    return "<" + type + attributes + "/>";
  }
  return "<" + type + attributes + ">" + content + "</" + type + ">";
}
function rendercomponent(component, props, context, legacycontext = {}) {
  const instance = new component(props, legacycontext);
  if (typeof instance.getchildcontext === "function") {
    object.assign(legacycontext, instance.getchildcontext());
  }
  const html = renderelement(instance.render(), context, legacycontext);
  return html;
}
function renderchildren(children, context, legacycontext = {}) {
  let result = "";
  const childrenarray = array.isarray(children) ? children : [children];
  for (let i = 0; i < childrenarray.length; i++) {
    const child = childrenarray[i];
    result += renderelement(child, context, legacycontext);
  }
  return result;
}
function renderattributes(props) {
  let result = "";
  for (const key in props) {
    const attribute = getnormalattributename(key);
    if (!(0,external_wp_escapehtml_namespaceobject.isvalidattributename)(attribute)) {
      continue;
    }
    let value = getnormalattributevalue(key, props[key]);
    if (!attributes_types.has(typeof value)) {
      continue;
    }
    if (isinternalattribute(key)) {
      continue;
    }
    const isbooleanattribute = boolean_attributes.has(attribute);
    if (isbooleanattribute && value === false) {
      continue;
    }
    const ismeaningfulattribute = isbooleanattribute || hasprefix(key, ["data-", "aria-"]) || enumerated_attributes.has(attribute);
    if (typeof value === "boolean" && !ismeaningfulattribute) {
      continue;
    }
    result += " " + attribute;
    if (isbooleanattribute) {
      continue;
    }
    if (typeof value === "string") {
      value = (0,external_wp_escapehtml_namespaceobject.escapeattribute)(value);
    }
    result += '="' + value + '"';
  }
  return result;
}
function renderstyle(style) {
  if (!isplainobject(style)) {
    return style;
  }
  let result;
  const styleobj = style;
  for (const property in styleobj) {
    const value = styleobj[property];
    if (null === value || void 0 === value) {
      continue;
    }
    if (result) {
      result += ";";
    } else {
      result = "";
    }
    const normalname = getnormalstylepropertyname(property);
    const normalvalue = getnormalstylepropertyvalue(property, value);
    result += normalname + ":" + normalvalue;
  }
  return result;
}
var serialize_default = renderelement;


;// ./node_modules/@wordpress/element/build-module/index.js









(window.wp = window.wp || {}).element = __webpack_exports__;
/******/ })()
;






