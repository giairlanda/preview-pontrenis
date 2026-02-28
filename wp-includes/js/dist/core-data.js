/******/ (() => { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 287:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fl: () => (/* binding */ pascalcase),
/* harmony export */   l3: () => (/* binding */ pascalcasetransform)
/* harmony export */ });
/* unused harmony export pascalcasetransformmerge */
/* harmony import */ var tslib__webpack_imported_module_1__ = __webpack_require__(1635);
/* harmony import */ var no_case__webpack_imported_module_0__ = __webpack_require__(2226);


function pascalcasetransform(input, index) {
    var firstchar = input.charat(0);
    var lowerchars = input.substr(1).tolowercase();
    if (index > 0 && firstchar >= "0" && firstchar <= "9") {
        return "_" + firstchar + lowerchars;
    }
    return "" + firstchar.touppercase() + lowerchars;
}
function pascalcasetransformmerge(input) {
    return input.charat(0).touppercase() + input.slice(1).tolowercase();
}
function pascalcase(input, options) {
    if (options === void 0) { options = {}; }
    return (0,no_case__webpack_imported_module_0__/* .nocase */ .w)(input, (0,tslib__webpack_imported_module_1__/* .__assign */ .cl)({ delimiter: "", transform: pascalcasetransform }, options));
}


/***/ }),

/***/ 533:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ get_normalized_comma_separable_default)
/* harmony export */ });
function getnormalizedcommaseparable(value) {
  if (typeof value === "string") {
    return value.split(",");
  } else if (array.isarray(value)) {
    return value;
  }
  return null;
}
var get_normalized_comma_separable_default = getnormalizedcommaseparable;



/***/ }),

/***/ 1455:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["apifetch"];

/***/ }),

/***/ 1635:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cl: () => (/* binding */ __assign)
/* harmony export */ });
/* unused harmony exports __extends, __rest, __decorate, __param, __esdecorate, __runinitializers, __propkey, __setfunctionname, __metadata, __awaiter, __generator, __createbinding, __exportstar, __values, __read, __spread, __spreadarrays, __spreadarray, __await, __asyncgenerator, __asyncdelegator, __asyncvalues, __maketemplateobject, __importstar, __importdefault, __classprivatefieldget, __classprivatefieldset, __classprivatefieldin, __adddisposableresource, __disposeresources, __rewriterelativeimportextension */
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

/* unused harmony default export */ var __webpack_default_export__ = ({
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


/***/ }),

/***/ 2226:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   w: () => (/* binding */ nocase)
/* harmony export */ });
/* harmony import */ var lower_case__webpack_imported_module_0__ = __webpack_require__(7314);

// support camel case ("camelcase" -> "camel case" and "camelcase" -> "camel case").
var default_split_regexp = [/([a-z0-9])([a-z])/g, /([a-z])([a-z][a-z])/g];
// remove all non-word characters.
var default_strip_regexp = /[^a-z0-9]+/gi;
/**
 * normalize the string into something other libraries can manipulate easier.
 */
function nocase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitregexp, splitregexp = _a === void 0 ? default_split_regexp : _a, _b = options.stripregexp, stripregexp = _b === void 0 ? default_strip_regexp : _b, _c = options.transform, transform = _c === void 0 ? lower_case__webpack_imported_module_0__/* .lowercase */ .g : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
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


/***/ }),

/***/ 2239:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  a: () => (/* binding */ createlocksactions)
});

;// ./node_modules/@wordpress/core-data/build-module/locks/utils.js
function deepcopylockstreepath(tree, path) {
  const newtree = { ...tree };
  let currentnode = newtree;
  for (const branchname of path) {
    currentnode.children = {
      ...currentnode.children,
      [branchname]: {
        locks: [],
        children: {},
        ...currentnode.children[branchname]
      }
    };
    currentnode = currentnode.children[branchname];
  }
  return newtree;
}
function getnode(tree, path) {
  let currentnode = tree;
  for (const branchname of path) {
    const nextnode = currentnode.children[branchname];
    if (!nextnode) {
      return null;
    }
    currentnode = nextnode;
  }
  return currentnode;
}
function* iteratepath(tree, path) {
  let currentnode = tree;
  yield currentnode;
  for (const branchname of path) {
    const nextnode = currentnode.children[branchname];
    if (!nextnode) {
      break;
    }
    yield nextnode;
    currentnode = nextnode;
  }
}
function* iteratedescendants(node) {
  const stack = object.values(node.children);
  while (stack.length) {
    const childnode = stack.pop();
    yield childnode;
    stack.push(...object.values(childnode.children));
  }
}
function hasconflictinglock({ exclusive }, locks) {
  if (exclusive && locks.length) {
    return true;
  }
  if (!exclusive && locks.filter((lock) => lock.exclusive).length) {
    return true;
  }
  return false;
}


;// ./node_modules/@wordpress/core-data/build-module/locks/reducer.js

const default_state = {
  requests: [],
  tree: {
    locks: [],
    children: {}
  }
};
function locks(state = default_state, action) {
  switch (action.type) {
    case "enqueue_lock_request": {
      const { request } = action;
      return {
        ...state,
        requests: [request, ...state.requests]
      };
    }
    case "grant_lock_request": {
      const { lock, request } = action;
      const { store, path } = request;
      const storepath = [store, ...path];
      const newtree = deepcopylockstreepath(state.tree, storepath);
      const node = getnode(newtree, storepath);
      node.locks = [...node.locks, lock];
      return {
        ...state,
        requests: state.requests.filter((r) => r !== request),
        tree: newtree
      };
    }
    case "release_lock": {
      const { lock } = action;
      const storepath = [lock.store, ...lock.path];
      const newtree = deepcopylockstreepath(state.tree, storepath);
      const node = getnode(newtree, storepath);
      node.locks = node.locks.filter((l) => l !== lock);
      return {
        ...state,
        tree: newtree
      };
    }
  }
  return state;
}


;// ./node_modules/@wordpress/core-data/build-module/locks/selectors.js

function getpendinglockrequests(state) {
  return state.requests;
}
function islockavailable(state, store, path, { exclusive }) {
  const storepath = [store, ...path];
  const locks = state.tree;
  for (const node2 of iteratepath(locks, storepath)) {
    if (hasconflictinglock({ exclusive }, node2.locks)) {
      return false;
    }
  }
  const node = getnode(locks, storepath);
  if (!node) {
    return true;
  }
  for (const descendant of iteratedescendants(node)) {
    if (hasconflictinglock({ exclusive }, descendant.locks)) {
      return false;
    }
  }
  return true;
}


;// ./node_modules/@wordpress/core-data/build-module/locks/engine.js


function createlocks() {
  let state = locks(void 0, { type: "@@init" });
  function processpendinglockrequests() {
    for (const request of getpendinglockrequests(state)) {
      const { store, path, exclusive, notifyacquired } = request;
      if (islockavailable(state, store, path, { exclusive })) {
        const lock = { store, path, exclusive };
        state = locks(state, {
          type: "grant_lock_request",
          lock,
          request
        });
        notifyacquired(lock);
      }
    }
  }
  function acquire(store, path, exclusive) {
    return new promise((resolve) => {
      state = locks(state, {
        type: "enqueue_lock_request",
        request: { store, path, exclusive, notifyacquired: resolve }
      });
      processpendinglockrequests();
    });
  }
  function release(lock) {
    state = locks(state, {
      type: "release_lock",
      lock
    });
    processpendinglockrequests();
  }
  return { acquire, release };
}


;// ./node_modules/@wordpress/core-data/build-module/locks/actions.js

function createlocksactions() {
  const locks = createlocks();
  function __unstableacquirestorelock(store, path, { exclusive }) {
    return () => locks.acquire(store, path, exclusive);
  }
  function __unstablereleasestorelock(lock) {
    return () => locks.release(lock);
  }
  return { __unstableacquirestorelock, __unstablereleasestorelock };
}



/***/ }),

/***/ 2278:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ store_name)
/* harmony export */ });
const store_name = "core";



/***/ }),

/***/ 2577:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   co: () => (/* binding */ allowed_resource_actions),
/* harmony export */   kc: () => (/* binding */ getuserpermissioncachekey),
/* harmony export */   qy: () => (/* binding */ getuserpermissionsfromallowheader)
/* harmony export */ });
const allowed_resource_actions = [
  "create",
  "read",
  "update",
  "delete"
];
function getuserpermissionsfromallowheader(allowedmethods) {
  const permissions = {};
  if (!allowedmethods) {
    return permissions;
  }
  const methods = {
    create: "post",
    read: "get",
    update: "put",
    delete: "delete"
  };
  for (const [actionname, methodname] of object.entries(methods)) {
    permissions[actionname] = allowedmethods.includes(methodname);
  }
  return permissions;
}
function getuserpermissioncachekey(action, resource, id) {
  const key = (typeof resource === "object" ? [action, resource.kind, resource.name, resource.id] : [action, resource, id]).filter(boolean).join("/");
  return key;
}



/***/ }),

/***/ 2859:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   n: () => (/* binding */ status)
/* harmony export */ });
var status = /* @__pure__ */ ((status2) => {
  status2["idle"] = "idle";
  status2["resolving"] = "resolving";
  status2["error"] = "error";
  status2["success"] = "success";
  return status2;
})(status || {});



/***/ }),

/***/ 3249:
/***/ ((module) => {

"use strict";


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


/***/ }),

/***/ 3377:
/***/ (() => {



/***/ }),

/***/ 3440:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  __experimentalbatch: () => (/* binding */ __experimentalbatch),
  __experimentalreceivecurrentglobalstylesid: () => (/* binding */ __experimentalreceivecurrentglobalstylesid),
  __experimentalreceivethemebaseglobalstyles: () => (/* binding */ __experimentalreceivethemebaseglobalstyles),
  __experimentalreceivethemeglobalstylevariations: () => (/* binding */ __experimentalreceivethemeglobalstylevariations),
  __experimentalsavespecifiedentityedits: () => (/* binding */ __experimentalsavespecifiedentityedits),
  __unstablecreateundolevel: () => (/* binding */ __unstablecreateundolevel),
  addentities: () => (/* binding */ addentities),
  deleteentityrecord: () => (/* binding */ deleteentityrecord),
  editentityrecord: () => (/* binding */ editentityrecord),
  receiveautosaves: () => (/* binding */ receiveautosaves),
  receivecurrenttheme: () => (/* binding */ receivecurrenttheme),
  receivecurrentuser: () => (/* binding */ receivecurrentuser),
  receivedefaulttemplateid: () => (/* binding */ receivedefaulttemplateid),
  receiveembedpreview: () => (/* binding */ receiveembedpreview),
  receiveentityrecords: () => (/* binding */ receiveentityrecords),
  receivenavigationfallbackid: () => (/* binding */ receivenavigationfallbackid),
  receiverevisions: () => (/* binding */ receiverevisions),
  receivethemeglobalstylerevisions: () => (/* binding */ receivethemeglobalstylerevisions),
  receivethemesupports: () => (/* binding */ receivethemesupports),
  receiveuploadpermissions: () => (/* binding */ receiveuploadpermissions),
  receiveuserpermission: () => (/* binding */ receiveuserpermission),
  receiveuserpermissions: () => (/* binding */ receiveuserpermissions),
  receiveuserquery: () => (/* binding */ receiveuserquery),
  redo: () => (/* binding */ redo),
  saveeditedentityrecord: () => (/* binding */ saveeditedentityrecord),
  saveentityrecord: () => (/* binding */ saveentityrecord),
  undo: () => (/* binding */ undo)
});

// external module: ./node_modules/fast-deep-equal/es6/index.js
var es6 = __webpack_require__(7734);
var es6_default = /*#__pure__*/__webpack_require__.n(es6);
;// ./node_modules/@wordpress/core-data/node_modules/uuid/dist/esm-browser/native.js
const randomuuid = typeof crypto !== 'undefined' && crypto.randomuuid && crypto.randomuuid.bind(crypto);
/* harmony default export */ const esm_browser_native = ({
  randomuuid
});
;// ./node_modules/@wordpress/core-data/node_modules/uuid/dist/esm-browser/rng.js
// unique id creation requires a high quality random # generator. in the browser we therefore
// require the crypto api and do not support built-in fallback to lower quality random number
// generators (like math.random()).
let getrandomvalues;
const rnds8 = new uint8array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getrandomvalues) {
    // getrandomvalues needs to be invoked in a context where "this" is a crypto implementation.
    getrandomvalues = typeof crypto !== 'undefined' && crypto.getrandomvalues && crypto.getrandomvalues.bind(crypto);

    if (!getrandomvalues) {
      throw new error('crypto.getrandomvalues() not supported. see https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getrandomvalues(rnds8);
}
;// ./node_modules/@wordpress/core-data/node_modules/uuid/dist/esm-browser/stringify.js

/**
 * convert array of 16 byte values to uuid string format of the form:
 * xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */

const bytetohex = [];

for (let i = 0; i < 256; ++i) {
  bytetohex.push((i + 0x100).tostring(16).slice(1));
}

function unsafestringify(arr, offset = 0) {
  // note: be careful editing this code!  it's been tuned for performance
  // and works in ways you may not expect. see https://github.com/uuidjs/uuid/pull/434
  return bytetohex[arr[offset + 0]] + bytetohex[arr[offset + 1]] + bytetohex[arr[offset + 2]] + bytetohex[arr[offset + 3]] + '-' + bytetohex[arr[offset + 4]] + bytetohex[arr[offset + 5]] + '-' + bytetohex[arr[offset + 6]] + bytetohex[arr[offset + 7]] + '-' + bytetohex[arr[offset + 8]] + bytetohex[arr[offset + 9]] + '-' + bytetohex[arr[offset + 10]] + bytetohex[arr[offset + 11]] + bytetohex[arr[offset + 12]] + bytetohex[arr[offset + 13]] + bytetohex[arr[offset + 14]] + bytetohex[arr[offset + 15]];
}

function stringify(arr, offset = 0) {
  const uuid = unsafestringify(arr, offset); // consistency check for valid uuid.  if this throws, it's likely due to one
  // of the following:
  // - one or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - invalid input values for the rfc `version` or `variant` fields

  if (!validate(uuid)) {
    throw typeerror('stringified uuid is invalid');
  }

  return uuid;
}

/* harmony default export */ const esm_browser_stringify = ((/* unused pure expression or super */ null && (stringify)));
;// ./node_modules/@wordpress/core-data/node_modules/uuid/dist/esm-browser/v4.js




function v4(options, buf, offset) {
  if (esm_browser_native.randomuuid && !buf && !options) {
    return esm_browser_native.randomuuid();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafestringify(rnds);
}

/* harmony default export */ const esm_browser_v4 = (v4);
// external module: external ["wp","apifetch"]
var external_wp_apifetch_ = __webpack_require__(1455);
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_);
// external module: external ["wp","url"]
var external_wp_url_ = __webpack_require__(3832);
// external module: external ["wp","deprecated"]
var external_wp_deprecated_ = __webpack_require__(4040);
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_);
// external module: ./node_modules/@wordpress/core-data/build-module/utils/set-nested-value.js
var set_nested_value = __webpack_require__(5003);
;// ./node_modules/@wordpress/core-data/build-module/utils/get-nested-value.js
function getnestedvalue(object, path, defaultvalue) {
  if (!object || typeof object !== "object" || typeof path !== "string" && !array.isarray(path)) {
    return object;
  }
  const normalizedpath = array.isarray(path) ? path : path.split(".");
  let value = object;
  normalizedpath.foreach((fieldname) => {
    value = value?.[fieldname];
  });
  return value !== void 0 ? value : defaultvalue;
}


;// ./node_modules/@wordpress/core-data/build-module/queried-data/actions.js
function receiveitems(items, edits, meta) {
  return {
    type: "receive_items",
    items: array.isarray(items) ? items : [items],
    persistededits: edits,
    meta
  };
}
function removeitems(kind, name, records, invalidatecache = false) {
  return {
    type: "remove_items",
    itemids: array.isarray(records) ? records : [records],
    kind,
    name,
    invalidatecache
  };
}
function receivequerieditems(items, query = {}, edits, meta) {
  return {
    ...receiveitems(items, edits, meta),
    query
  };
}


// external module: ./node_modules/@wordpress/core-data/build-module/entities.js + 2 modules
var entities = __webpack_require__(5914);
;// ./node_modules/@wordpress/core-data/build-module/batch/default-processor.js

let maxitems = null;
function chunk(arr, chunksize) {
  const tmp = [...arr];
  const cache = [];
  while (tmp.length) {
    cache.push(tmp.splice(0, chunksize));
  }
  return cache;
}
async function defaultprocessor(requests) {
  if (maxitems === null) {
    const preflightresponse = await external_wp_apifetch_default()({
      path: "/batch/v1",
      method: "options"
    });
    maxitems = preflightresponse.endpoints[0].args.requests.maxitems;
  }
  const results = [];
  for (const batchrequests of chunk(requests, maxitems)) {
    const batchresponse = await external_wp_apifetch_default()({
      path: "/batch/v1",
      method: "post",
      data: {
        validation: "require-all-validate",
        requests: batchrequests.map((request) => ({
          path: request.path,
          body: request.data,
          // rename 'data' to 'body'.
          method: request.method,
          headers: request.headers
        }))
      }
    });
    let batchresults;
    if (batchresponse.failed) {
      batchresults = batchresponse.responses.map((response) => ({
        error: response?.body
      }));
    } else {
      batchresults = batchresponse.responses.map((response) => {
        const result = {};
        if (response.status >= 200 && response.status < 300) {
          result.output = response.body;
        } else {
          result.error = response.body;
        }
        return result;
      });
    }
    results.push(...batchresults);
  }
  return results;
}


;// ./node_modules/@wordpress/core-data/build-module/batch/create-batch.js

function createbatch(processor = defaultprocessor) {
  let lastid = 0;
  let queue = [];
  const pending = new observableset();
  return {
    /**
     * adds an input to the batch and returns a promise that is resolved or
     * rejected when the input is processed by `batch.run()`.
     *
     * you may also pass a thunk which allows inputs to be added
     * asynchronously.
     *
     * ```
     * // both are allowed:
     * batch.add( { path: '/v1/books', ... } );
     * batch.add( ( add ) => add( { path: '/v1/books', ... } ) );
     * ```
     *
     * if a thunk is passed, `batch.run()` will pause until either:
     *
     * - the thunk calls its `add` argument, or;
     * - the thunk returns a promise and that promise resolves, or;
     * - the thunk returns a non-promise.
     *
     * @param {any|function} inputorthunk input to add or thunk to execute.
     *
     * @return {promise|any} if given an input, returns a promise that
     *                       is resolved or rejected when the batch is
     *                       processed. if given a thunk, returns the return
     *                       value of that thunk.
     */
    add(inputorthunk) {
      const id = ++lastid;
      pending.add(id);
      const add = (input) => new promise((resolve, reject) => {
        queue.push({
          input,
          resolve,
          reject
        });
        pending.delete(id);
      });
      if (typeof inputorthunk === "function") {
        return promise.resolve(inputorthunk(add)).finally(() => {
          pending.delete(id);
        });
      }
      return add(inputorthunk);
    },
    /**
     * runs the batch. this calls `batchprocessor` and resolves or rejects
     * all promises returned by `add()`.
     *
     * @return {promise<boolean>} a promise that resolves to a boolean that is true
     *                   if the processor returned no errors.
     */
    async run() {
      if (pending.size) {
        await new promise((resolve) => {
          const unsubscribe = pending.subscribe(() => {
            if (!pending.size) {
              unsubscribe();
              resolve(void 0);
            }
          });
        });
      }
      let results;
      try {
        results = await processor(
          queue.map(({ input }) => input)
        );
        if (results.length !== queue.length) {
          throw new error(
            "run: array returned by processor must be same size as input array."
          );
        }
      } catch (error) {
        for (const { reject } of queue) {
          reject(error);
        }
        throw error;
      }
      let issuccess = true;
      results.foreach((result, key) => {
        const queueitem = queue[key];
        if (result?.error) {
          queueitem?.reject(result.error);
          issuccess = false;
        } else {
          queueitem?.resolve(result?.output ?? result);
        }
      });
      queue = [];
      return issuccess;
    }
  };
}
class observableset {
  constructor(...args) {
    this.set = new set(...args);
    this.subscribers = /* @__pure__ */ new set();
  }
  get size() {
    return this.set.size;
  }
  add(value) {
    this.set.add(value);
    this.subscribers.foreach((subscriber) => subscriber());
    return this;
  }
  delete(value) {
    const issuccess = this.set.delete(value);
    this.subscribers.foreach((subscriber) => subscriber());
    return issuccess;
  }
  subscribe(subscriber) {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }
}


// external module: ./node_modules/@wordpress/core-data/build-module/name.js
var build_module_name = __webpack_require__(2278);
// external module: ./node_modules/@wordpress/core-data/build-module/utils/log-entity-deprecation.js
var log_entity_deprecation = __webpack_require__(9410);
;// ./node_modules/@wordpress/core-data/build-module/actions.js












function receiveuserquery(queryid, users) {
  return {
    type: "receive_user_query",
    users: array.isarray(users) ? users : [users],
    queryid
  };
}
function receivecurrentuser(currentuser) {
  return {
    type: "receive_current_user",
    currentuser
  };
}
function addentities(entities) {
  return {
    type: "add_entities",
    entities
  };
}
function receiveentityrecords(kind, name, records, query, invalidatecache = false, edits, meta) {
  if (kind === "posttype") {
    records = (array.isarray(records) ? records : [records]).map(
      (record) => record.status === "auto-draft" ? { ...record, title: "" } : record
    );
  }
  let action;
  if (query) {
    action = receivequerieditems(records, query, edits, meta);
  } else {
    action = receiveitems(records, edits, meta);
  }
  return {
    ...action,
    kind,
    name,
    invalidatecache
  };
}
function receivecurrenttheme(currenttheme) {
  return {
    type: "receive_current_theme",
    currenttheme
  };
}
function __experimentalreceivecurrentglobalstylesid(currentglobalstylesid) {
  return {
    type: "receive_current_global_styles_id",
    id: currentglobalstylesid
  };
}
function __experimentalreceivethemebaseglobalstyles(stylesheet, globalstyles) {
  return {
    type: "receive_theme_global_styles",
    stylesheet,
    globalstyles
  };
}
function __experimentalreceivethemeglobalstylevariations(stylesheet, variations) {
  return {
    type: "receive_theme_global_style_variations",
    stylesheet,
    variations
  };
}
function receivethemesupports() {
  external_wp_deprecated_default()("wp.data.dispatch( 'core' ).receivethemesupports", {
    since: "5.9"
  });
  return {
    type: "do_nothing"
  };
}
function receivethemeglobalstylerevisions(currentid, revisions) {
  external_wp_deprecated_default()(
    "wp.data.dispatch( 'core' ).receivethemeglobalstylerevisions()",
    {
      since: "6.5.0",
      alternative: "wp.data.dispatch( 'core' ).receiverevisions"
    }
  );
  return {
    type: "receive_theme_global_style_revisions",
    currentid,
    revisions
  };
}
function receiveembedpreview(url, preview) {
  return {
    type: "receive_embed_preview",
    url,
    preview
  };
}
const deleteentityrecord = (kind, name, recordid, query, { __unstablefetch = (external_wp_apifetch_default()), throwonerror = false } = {}) => async ({ dispatch, resolveselect }) => {
  (0,log_entity_deprecation/* default */.a)(kind, name, "deleteentityrecord");
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.kind === kind && config.name === name
  );
  let error;
  let deletedrecord = false;
  if (!entityconfig) {
    return;
  }
  const lock = await dispatch.__unstableacquirestorelock(
    build_module_name/* store_name */.e,
    ["entities", "records", kind, name, recordid],
    { exclusive: true }
  );
  try {
    dispatch({
      type: "delete_entity_record_start",
      kind,
      name,
      recordid
    });
    let haserror = false;
    try {
      let path = `${entityconfig.baseurl}/${recordid}`;
      if (query) {
        path = (0,external_wp_url_.addqueryargs)(path, query);
      }
      deletedrecord = await __unstablefetch({
        path,
        method: "delete"
      });
      await dispatch(removeitems(kind, name, recordid, true));
    } catch (_error) {
      haserror = true;
      error = _error;
    }
    dispatch({
      type: "delete_entity_record_finish",
      kind,
      name,
      recordid,
      error
    });
    if (haserror && throwonerror) {
      throw error;
    }
    return deletedrecord;
  } finally {
    dispatch.__unstablereleasestorelock(lock);
  }
};
const editentityrecord = (kind, name, recordid, edits, options = {}) => ({ select, dispatch }) => {
  (0,log_entity_deprecation/* default */.a)(kind, name, "editentityrecord");
  const entityconfig = select.getentityconfig(kind, name);
  if (!entityconfig) {
    throw new error(
      `the entity being edited (${kind}, ${name}) does not have a loaded config.`
    );
  }
  const { mergededits = {} } = entityconfig;
  const record = select.getrawentityrecord(kind, name, recordid);
  const editedrecord = select.geteditedentityrecord(
    kind,
    name,
    recordid
  );
  const edit = {
    kind,
    name,
    recordid,
    // clear edits when they are equal to their persisted counterparts
    // so that the property is not considered dirty.
    edits: object.keys(edits).reduce((acc, key) => {
      const recordvalue = record[key];
      const editedrecordvalue = editedrecord[key];
      const value = mergededits[key] ? { ...editedrecordvalue, ...edits[key] } : edits[key];
      acc[key] = es6_default()(recordvalue, value) ? void 0 : value;
      return acc;
    }, {})
  };
  if (window.__experimentalenablesync && entityconfig.syncconfig) {
    if (false) {}
  }
  if (!options.undoignore) {
    select.getundomanager().addrecord(
      [
        {
          id: { kind, name, recordid },
          changes: object.keys(edits).reduce((acc, key) => {
            acc[key] = {
              from: editedrecord[key],
              to: edits[key]
            };
            return acc;
          }, {})
        }
      ],
      options.iscached
    );
  }
  dispatch({
    type: "edit_entity_record",
    ...edit
  });
};
const undo = () => ({ select, dispatch }) => {
  const undorecord = select.getundomanager().undo();
  if (!undorecord) {
    return;
  }
  dispatch({
    type: "undo",
    record: undorecord
  });
};
const redo = () => ({ select, dispatch }) => {
  const redorecord = select.getundomanager().redo();
  if (!redorecord) {
    return;
  }
  dispatch({
    type: "redo",
    record: redorecord
  });
};
const __unstablecreateundolevel = () => ({ select }) => {
  select.getundomanager().addrecord();
};
const saveentityrecord = (kind, name, record, {
  isautosave = false,
  __unstablefetch = (external_wp_apifetch_default()),
  throwonerror = false
} = {}) => async ({ select, resolveselect, dispatch }) => {
  (0,log_entity_deprecation/* default */.a)(kind, name, "saveentityrecord");
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.kind === kind && config.name === name
  );
  if (!entityconfig) {
    return;
  }
  const entityidkey = entityconfig.key ?? entities/* default_entity_key */.c_;
  const recordid = record[entityidkey];
  const isnewrecord = !!entityidkey && !recordid;
  const lock = await dispatch.__unstableacquirestorelock(
    build_module_name/* store_name */.e,
    ["entities", "records", kind, name, recordid || esm_browser_v4()],
    { exclusive: true }
  );
  try {
    for (const [key, value] of object.entries(record)) {
      if (typeof value === "function") {
        const evaluatedvalue = value(
          select.geteditedentityrecord(kind, name, recordid)
        );
        dispatch.editentityrecord(
          kind,
          name,
          recordid,
          {
            [key]: evaluatedvalue
          },
          { undoignore: true }
        );
        record[key] = evaluatedvalue;
      }
    }
    dispatch({
      type: "save_entity_record_start",
      kind,
      name,
      recordid,
      isautosave
    });
    let updatedrecord;
    let error;
    let haserror = false;
    try {
      const path = `${entityconfig.baseurl}${recordid ? "/" + recordid : ""}`;
      const persistedrecord = !isnewrecord ? select.getrawentityrecord(kind, name, recordid) : {};
      if (isautosave) {
        const currentuser = select.getcurrentuser();
        const currentuserid = currentuser ? currentuser.id : void 0;
        const autosavepost = await resolveselect.getautosave(
          persistedrecord.type,
          persistedrecord.id,
          currentuserid
        );
        let data = {
          ...persistedrecord,
          ...autosavepost,
          ...record
        };
        data = object.keys(data).reduce(
          (acc, key) => {
            if ([
              "title",
              "excerpt",
              "content",
              "meta"
            ].includes(key)) {
              acc[key] = data[key];
            }
            return acc;
          },
          {
            // do not update the `status` if we have edited it when auto saving.
            // it's very important to let the user explicitly save this change,
            // because it can lead to unexpected results. an example would be to
            // have a draft post and change the status to publish.
            status: data.status === "auto-draft" ? "draft" : void 0
          }
        );
        updatedrecord = await __unstablefetch({
          path: `${path}/autosaves`,
          method: "post",
          data
        });
        if (persistedrecord.id === updatedrecord.id) {
          let newrecord = {
            ...persistedrecord,
            ...data,
            ...updatedrecord
          };
          newrecord = object.keys(newrecord).reduce(
            (acc, key) => {
              if (["title", "excerpt", "content"].includes(
                key
              )) {
                acc[key] = newrecord[key];
              } else if (key === "status") {
                acc[key] = persistedrecord.status === "auto-draft" && newrecord.status === "draft" ? newrecord.status : persistedrecord.status;
              } else {
                acc[key] = persistedrecord[key];
              }
              return acc;
            },
            {}
          );
          dispatch.receiveentityrecords(
            kind,
            name,
            newrecord,
            void 0,
            true
          );
        } else {
          dispatch.receiveautosaves(
            persistedrecord.id,
            updatedrecord
          );
        }
      } else {
        let edits = record;
        if (entityconfig.__unstableprepersist) {
          edits = {
            ...edits,
            ...entityconfig.__unstableprepersist(
              persistedrecord,
              edits
            )
          };
        }
        updatedrecord = await __unstablefetch({
          path,
          method: recordid ? "put" : "post",
          data: edits
        });
        dispatch.receiveentityrecords(
          kind,
          name,
          updatedrecord,
          void 0,
          true,
          edits
        );
      }
    } catch (_error) {
      haserror = true;
      error = _error;
    }
    dispatch({
      type: "save_entity_record_finish",
      kind,
      name,
      recordid,
      error,
      isautosave
    });
    if (haserror && throwonerror) {
      throw error;
    }
    return updatedrecord;
  } finally {
    dispatch.__unstablereleasestorelock(lock);
  }
};
const __experimentalbatch = (requests) => async ({ dispatch }) => {
  const batch = createbatch();
  const api = {
    saveentityrecord(kind, name, record, options) {
      return batch.add(
        (add) => dispatch.saveentityrecord(kind, name, record, {
          ...options,
          __unstablefetch: add
        })
      );
    },
    saveeditedentityrecord(kind, name, recordid, options) {
      return batch.add(
        (add) => dispatch.saveeditedentityrecord(kind, name, recordid, {
          ...options,
          __unstablefetch: add
        })
      );
    },
    deleteentityrecord(kind, name, recordid, query, options) {
      return batch.add(
        (add) => dispatch.deleteentityrecord(kind, name, recordid, query, {
          ...options,
          __unstablefetch: add
        })
      );
    }
  };
  const resultpromises = requests.map((request) => request(api));
  const [, ...results] = await promise.all([
    batch.run(),
    ...resultpromises
  ]);
  return results;
};
const saveeditedentityrecord = (kind, name, recordid, options) => async ({ select, dispatch, resolveselect }) => {
  (0,log_entity_deprecation/* default */.a)(kind, name, "saveeditedentityrecord");
  if (!select.haseditsforentityrecord(kind, name, recordid)) {
    return;
  }
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.kind === kind && config.name === name
  );
  if (!entityconfig) {
    return;
  }
  const entityidkey = entityconfig.key || entities/* default_entity_key */.c_;
  const edits = select.getentityrecordnontransientedits(
    kind,
    name,
    recordid
  );
  const record = { [entityidkey]: recordid, ...edits };
  return await dispatch.saveentityrecord(kind, name, record, options);
};
const __experimentalsavespecifiedentityedits = (kind, name, recordid, itemstosave, options) => async ({ select, dispatch, resolveselect }) => {
  (0,log_entity_deprecation/* default */.a)(
    kind,
    name,
    "__experimentalsavespecifiedentityedits"
  );
  if (!select.haseditsforentityrecord(kind, name, recordid)) {
    return;
  }
  const edits = select.getentityrecordnontransientedits(
    kind,
    name,
    recordid
  );
  const editstosave = {};
  for (const item of itemstosave) {
    (0,set_nested_value/* default */.a)(editstosave, item, getnestedvalue(edits, item));
  }
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.kind === kind && config.name === name
  );
  const entityidkey = entityconfig?.key || entities/* default_entity_key */.c_;
  if (recordid) {
    editstosave[entityidkey] = recordid;
  }
  return await dispatch.saveentityrecord(
    kind,
    name,
    editstosave,
    options
  );
};
function receiveuploadpermissions(hasuploadpermissions) {
  external_wp_deprecated_default()("wp.data.dispatch( 'core' ).receiveuploadpermissions", {
    since: "5.9",
    alternative: "receiveuserpermission"
  });
  return receiveuserpermission("create/media", hasuploadpermissions);
}
function receiveuserpermission(key, isallowed) {
  return {
    type: "receive_user_permission",
    key,
    isallowed
  };
}
function receiveuserpermissions(permissions) {
  return {
    type: "receive_user_permissions",
    permissions
  };
}
function receiveautosaves(postid, autosaves) {
  return {
    type: "receive_autosaves",
    postid,
    autosaves: array.isarray(autosaves) ? autosaves : [autosaves]
  };
}
function receivenavigationfallbackid(fallbackid) {
  return {
    type: "receive_navigation_fallback_id",
    fallbackid
  };
}
function receivedefaulttemplateid(query, templateid) {
  return {
    type: "receive_default_template",
    query,
    templateid
  };
}
const receiverevisions = (kind, name, recordkey, records, query, invalidatecache = false, meta) => async ({ dispatch, resolveselect }) => {
  (0,log_entity_deprecation/* default */.a)(kind, name, "receiverevisions");
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.kind === kind && config.name === name
  );
  const key = entityconfig && entityconfig?.revisionkey ? entityconfig.revisionkey : entities/* default_entity_key */.c_;
  dispatch({
    type: "receive_item_revisions",
    key,
    items: array.isarray(records) ? records : [records],
    recordkey,
    meta,
    query,
    kind,
    name,
    invalidatecache
  });
};



/***/ }),

/***/ 3832:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["url"];

/***/ }),

/***/ 4027:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  a: () => (/* binding */ get_query_parts_default)
});

// unused exports: getqueryparts

// external module: external ["wp","url"]
var external_wp_url_ = __webpack_require__(3832);
// external module: ./node_modules/@wordpress/core-data/build-module/utils/get-normalized-comma-separable.js
var get_normalized_comma_separable = __webpack_require__(533);
;// ./node_modules/@wordpress/core-data/build-module/utils/with-weak-map-cache.js
function withweakmapcache(fn) {
  const cache = /* @__pure__ */ new weakmap();
  return (key) => {
    let value;
    if (cache.has(key)) {
      value = cache.get(key);
    } else {
      value = fn(key);
      if (key !== null && typeof key === "object") {
        cache.set(key, value);
      }
    }
    return value;
  };
}
var with_weak_map_cache_default = withweakmapcache;


;// ./node_modules/@wordpress/core-data/build-module/queried-data/get-query-parts.js


function getqueryparts(query) {
  const parts = {
    stablekey: "",
    page: 1,
    perpage: 10,
    fields: null,
    include: null,
    context: "default"
  };
  const keys = object.keys(query).sort();
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let value = query[key];
    switch (key) {
      case "page":
        parts[key] = number(value);
        break;
      case "per_page":
        parts.perpage = number(value);
        break;
      case "context":
        parts.context = value;
        break;
      default:
        if (key === "_fields") {
          parts.fields = (0,get_normalized_comma_separable/* default */.a)(value) ?? [];
          value = parts.fields.join();
        }
        if (key === "include") {
          if (typeof value === "number") {
            value = value.tostring();
          }
          parts.include = ((0,get_normalized_comma_separable/* default */.a)(value) ?? []).map(number);
          value = parts.include.join();
        }
        parts.stablekey += (parts.stablekey ? "&" : "") + (0,external_wp_url_.addqueryargs)("", { [key]: value }).slice(1);
    }
  }
  return parts;
}
var get_query_parts_default = with_weak_map_cache_default(getqueryparts);



/***/ }),

/***/ 4040:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["deprecated"];

/***/ }),

/***/ 4460:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  a: () => (/* binding */ entityprovider)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
// external module: external ["wp","element"]
var external_wp_element_ = __webpack_require__(6087);
// external module: ./node_modules/@wordpress/core-data/build-module/entity-context.js
var entity_context = __webpack_require__(8843);
;// ./node_modules/@wordpress/core-data/build-module/entity-provider.js



function entityprovider({ kind, type: name, id, children }) {
  const parent = (0,external_wp_element_.usecontext)(entity_context/* entitycontext */.d);
  const childcontext = (0,external_wp_element_.usememo)(
    () => ({
      ...parent,
      [kind]: {
        ...parent?.[kind],
        [name]: id
      }
    }),
    [parent, kind, name, id]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(entity_context/* entitycontext */.d.provider, { value: childcontext, children });
}



/***/ }),

/***/ 4565:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   entityprovider: () => (/* reexport safe */ _entity_provider__webpack_imported_module_17__.a),
/* harmony export */   __experimentalfetchlinksuggestions: () => (/* reexport safe */ _fetch__webpack_imported_module_14__.y3),
/* harmony export */   __experimentalfetchurldata: () => (/* reexport safe */ _fetch__webpack_imported_module_14__.gr),
/* harmony export */   __experimentaluseentityrecord: () => (/* reexport safe */ _hooks__webpack_imported_module_15__.qh),
/* harmony export */   __experimentaluseentityrecords: () => (/* reexport safe */ _hooks__webpack_imported_module_15__.bm),
/* harmony export */   __experimentaluseresourcepermissions: () => (/* reexport safe */ _hooks__webpack_imported_module_15__._),
/* harmony export */   fetchblockpatterns: () => (/* reexport safe */ _fetch__webpack_imported_module_14__.l$),
/* harmony export */   privateapis: () => (/* reexport safe */ _private_apis__webpack_imported_module_16__.j),
/* harmony export */   store: () => (/* binding */ store),
/* harmony export */   useentityblockeditor: () => (/* reexport safe */ _hooks__webpack_imported_module_15__.hg),
/* harmony export */   useentityid: () => (/* reexport safe */ _hooks__webpack_imported_module_15__.mv),
/* harmony export */   useentityprop: () => (/* reexport safe */ _hooks__webpack_imported_module_15__.s$),
/* harmony export */   useentityrecord: () => (/* reexport safe */ _hooks__webpack_imported_module_15__.ma),
/* harmony export */   useentityrecords: () => (/* reexport safe */ _hooks__webpack_imported_module_15__.$u),
/* harmony export */   useresourcepermissions: () => (/* reexport safe */ _hooks__webpack_imported_module_15__.qs)
/* harmony export */ });
/* harmony import */ var _wordpress_data__webpack_imported_module_0__ = __webpack_require__(7143);
/* harmony import */ var _wordpress_data__webpack_imported_module_0___default = /*#__pure__*/__webpack_require__.n(_wordpress_data__webpack_imported_module_0__);
/* harmony import */ var _reducer__webpack_imported_module_6__ = __webpack_require__(5469);
/* harmony import */ var _selectors__webpack_imported_module_3__ = __webpack_require__(8368);
/* harmony import */ var _private_selectors__webpack_imported_module_11__ = __webpack_require__(8741);
/* harmony import */ var _actions__webpack_imported_module_5__ = __webpack_require__(3440);
/* harmony import */ var _private_actions__webpack_imported_module_12__ = __webpack_require__(9424);
/* harmony import */ var _resolvers__webpack_imported_module_4__ = __webpack_require__(6384);
/* harmony import */ var _locks_actions__webpack_imported_module_8__ = __webpack_require__(2239);
/* harmony import */ var _entities__webpack_imported_module_1__ = __webpack_require__(5914);
/* harmony import */ var _name__webpack_imported_module_9__ = __webpack_require__(2278);
/* harmony import */ var _lock_unlock__webpack_imported_module_10__ = __webpack_require__(6378);
/* harmony import */ var _dynamic_entities__webpack_imported_module_7__ = __webpack_require__(8582);
/* harmony import */ var _utils_log_entity_deprecation__webpack_imported_module_2__ = __webpack_require__(9410);
/* harmony import */ var _entity_provider__webpack_imported_module_17__ = __webpack_require__(4460);
/* harmony import */ var _entity_types__webpack_imported_module_13__ = __webpack_require__(3377);
/* harmony import */ var _entity_types__webpack_imported_module_13___default = /*#__pure__*/__webpack_require__.n(_entity_types__webpack_imported_module_13__);
/* harmony reexport (unknown) */ var __webpack_reexport_object__ = {};
/* harmony reexport (unknown) */ for(const __webpack_import_key__ in _entity_types__webpack_imported_module_13__) if(["default","entityprovider","store"].indexof(__webpack_import_key__) < 0) __webpack_reexport_object__[__webpack_import_key__] = () => _entity_types__webpack_imported_module_13__[__webpack_import_key__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __webpack_reexport_object__);
/* harmony import */ var _fetch__webpack_imported_module_14__ = __webpack_require__(7006);
/* harmony import */ var _hooks__webpack_imported_module_15__ = __webpack_require__(5891);
/* harmony import */ var _private_apis__webpack_imported_module_16__ = __webpack_require__(7826);













const entitiesconfig = [
  ..._entities__webpack_imported_module_1__/* .rootentitiesconfig */ .mr,
  ..._entities__webpack_imported_module_1__/* .additionalentityconfigloaders */ .l2.filter((config) => !!config.name)
];
const entityselectors = entitiesconfig.reduce((result, entity) => {
  const { kind, name, plural } = entity;
  const getentityrecordmethodname = (0,_entities__webpack_imported_module_1__/* .getmethodname */ .zd)(kind, name);
  result[getentityrecordmethodname] = (state, key, query) => {
    (0,_utils_log_entity_deprecation__webpack_imported_module_2__/* ["default"] */ .a)(kind, name, getentityrecordmethodname, {
      isshorthandselector: true,
      alternativefunctionname: "getentityrecord"
    });
    return _selectors__webpack_imported_module_3__.getentityrecord(state, kind, name, key, query);
  };
  if (plural) {
    const getentityrecordsmethodname = (0,_entities__webpack_imported_module_1__/* .getmethodname */ .zd)(kind, plural, "get");
    result[getentityrecordsmethodname] = (state, query) => {
      (0,_utils_log_entity_deprecation__webpack_imported_module_2__/* ["default"] */ .a)(kind, name, getentityrecordsmethodname, {
        isshorthandselector: true,
        alternativefunctionname: "getentityrecords"
      });
      return _selectors__webpack_imported_module_3__.getentityrecords(state, kind, name, query);
    };
  }
  return result;
}, {});
const entityresolvers = entitiesconfig.reduce((result, entity) => {
  const { kind, name, plural } = entity;
  const getentityrecordmethodname = (0,_entities__webpack_imported_module_1__/* .getmethodname */ .zd)(kind, name);
  result[getentityrecordmethodname] = (key, query) => {
    (0,_utils_log_entity_deprecation__webpack_imported_module_2__/* ["default"] */ .a)(kind, name, getentityrecordmethodname, {
      isshorthandselector: true,
      alternativefunctionname: "getentityrecord"
    });
    return _resolvers__webpack_imported_module_4__.getentityrecord(kind, name, key, query);
  };
  if (plural) {
    const getentityrecordsmethodname = (0,_entities__webpack_imported_module_1__/* .getmethodname */ .zd)(kind, plural, "get");
    result[getentityrecordsmethodname] = (...args) => {
      (0,_utils_log_entity_deprecation__webpack_imported_module_2__/* ["default"] */ .a)(kind, plural, getentityrecordsmethodname, {
        isshorthandselector: true,
        alternativefunctionname: "getentityrecords"
      });
      return _resolvers__webpack_imported_module_4__.getentityrecords(kind, name, ...args);
    };
    result[getentityrecordsmethodname].shouldinvalidate = (action) => _resolvers__webpack_imported_module_4__.getentityrecords.shouldinvalidate(action, kind, name);
  }
  return result;
}, {});
const entityactions = entitiesconfig.reduce((result, entity) => {
  const { kind, name } = entity;
  const saveentityrecordmethodname = (0,_entities__webpack_imported_module_1__/* .getmethodname */ .zd)(kind, name, "save");
  result[saveentityrecordmethodname] = (record, options) => {
    (0,_utils_log_entity_deprecation__webpack_imported_module_2__/* ["default"] */ .a)(kind, name, saveentityrecordmethodname, {
      isshorthandselector: true,
      alternativefunctionname: "saveentityrecord"
    });
    return _actions__webpack_imported_module_5__.saveentityrecord(kind, name, record, options);
  };
  const deleteentityrecordmethodname = (0,_entities__webpack_imported_module_1__/* .getmethodname */ .zd)(kind, name, "delete");
  result[deleteentityrecordmethodname] = (key, query, options) => {
    (0,_utils_log_entity_deprecation__webpack_imported_module_2__/* ["default"] */ .a)(kind, name, deleteentityrecordmethodname, {
      isshorthandselector: true,
      alternativefunctionname: "deleteentityrecord"
    });
    return _actions__webpack_imported_module_5__.deleteentityrecord(kind, name, key, query, options);
  };
  return result;
}, {});
const storeconfig = () => ({
  reducer: _reducer__webpack_imported_module_6__/* ["default"] */ .ay,
  actions: {
    ..._dynamic_entities__webpack_imported_module_7__/* .dynamicactions */ .b,
    ..._actions__webpack_imported_module_5__,
    ...entityactions,
    ...(0,_locks_actions__webpack_imported_module_8__/* ["default"] */ .a)()
  },
  selectors: {
    ..._dynamic_entities__webpack_imported_module_7__/* .dynamicselectors */ .a,
    ..._selectors__webpack_imported_module_3__,
    ...entityselectors
  },
  resolvers: { ..._resolvers__webpack_imported_module_4__, ...entityresolvers }
});
const store = (0,_wordpress_data__webpack_imported_module_0__.createreduxstore)(_name__webpack_imported_module_9__/* .store_name */ .e, storeconfig());
(0,_lock_unlock__webpack_imported_module_10__/* .unlock */ .t)(store).registerprivateselectors(_private_selectors__webpack_imported_module_11__);
(0,_lock_unlock__webpack_imported_module_10__/* .unlock */ .t)(store).registerprivateactions(_private_actions__webpack_imported_module_12__);
(0,_wordpress_data__webpack_imported_module_0__.register)(store);









/***/ }),

/***/ 4997:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ 5003:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ setnestedvalue)
/* harmony export */ });
function setnestedvalue(object, path, value) {
  if (!object || typeof object !== "object") {
    return object;
  }
  const normalizedpath = array.isarray(path) ? path : path.split(".");
  normalizedpath.reduce((acc, key, idx) => {
    if (acc[key] === void 0) {
      if (number.isinteger(normalizedpath[idx + 1])) {
        acc[key] = [];
      } else {
        acc[key] = {};
      }
    }
    if (idx === normalizedpath.length - 1) {
      acc[key] = value;
    }
    return acc[key];
  }, object);
  return object;
}



/***/ }),

/***/ 5101:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ receive_intermediate_results)
/* harmony export */ });
const receive_intermediate_results = symbol(
  "receive_intermediate_results"
);



/***/ }),

/***/ 5469:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  ay: () => (/* binding */ reducer_reducer_default)
});

// unused exports: autosaves, blockpatterncategories, blockpatterns, currentglobalstylesid, currenttheme, currentuser, defaulttemplates, editsreference, embedpreviews, entities, entitiesconfig, navigationfallbackid, registeredpostmeta, themebaseglobalstyles, themeglobalstylerevisions, themeglobalstylevariations, undomanager, userpatterncategories, userpermissions, users

// external module: ./node_modules/fast-deep-equal/es6/index.js
var es6 = __webpack_require__(7734);
var es6_default = /*#__pure__*/__webpack_require__.n(es6);
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
// external module: external ["wp","data"]
var external_wp_data_ = __webpack_require__(7143);
;// external ["wp","isshallowequal"]
const external_wp_isshallowequal_namespaceobject = window["wp"]["isshallowequal"];
var external_wp_isshallowequal_default = /*#__pure__*/__webpack_require__.n(external_wp_isshallowequal_namespaceobject);
;// ./node_modules/@wordpress/undo-manager/build-module/index.js

function mergehistorychanges(changes1, changes2) {
  const newchanges = { ...changes1 };
  object.entries(changes2).foreach(([key, value]) => {
    if (newchanges[key]) {
      newchanges[key] = { ...newchanges[key], to: value.to };
    } else {
      newchanges[key] = value;
    }
  });
  return newchanges;
}
const addhistorychangesintorecord = (record, changes) => {
  const existingchangesindex = record?.findindex(
    ({ id: recordidentifier }) => {
      return typeof recordidentifier === "string" ? recordidentifier === changes.id : external_wp_isshallowequal_default()(recordidentifier, changes.id);
    }
  );
  const nextrecord = [...record];
  if (existingchangesindex !== -1) {
    nextrecord[existingchangesindex] = {
      id: changes.id,
      changes: mergehistorychanges(
        nextrecord[existingchangesindex].changes,
        changes.changes
      )
    };
  } else {
    nextrecord.push(changes);
  }
  return nextrecord;
};
function createundomanager() {
  let history = [];
  let stagedrecord = [];
  let offset = 0;
  const droppendingredos = () => {
    history = history.slice(0, offset || void 0);
    offset = 0;
  };
  const appendstagedrecordtolatesthistoryrecord = () => {
    const index = history.length === 0 ? 0 : history.length - 1;
    let latestrecord = history[index] ?? [];
    stagedrecord.foreach((changes) => {
      latestrecord = addhistorychangesintorecord(latestrecord, changes);
    });
    stagedrecord = [];
    history[index] = latestrecord;
  };
  const isrecordempty = (record) => {
    const filteredrecord = record.filter(({ changes }) => {
      return object.values(changes).some(
        ({ from, to }) => typeof from !== "function" && typeof to !== "function" && !external_wp_isshallowequal_default()(from, to)
      );
    });
    return !filteredrecord.length;
  };
  return {
    addrecord(record, isstaged = false) {
      const isempty = !record || isrecordempty(record);
      if (isstaged) {
        if (isempty) {
          return;
        }
        record.foreach((changes) => {
          stagedrecord = addhistorychangesintorecord(
            stagedrecord,
            changes
          );
        });
      } else {
        droppendingredos();
        if (stagedrecord.length) {
          appendstagedrecordtolatesthistoryrecord();
        }
        if (isempty) {
          return;
        }
        history.push(record);
      }
    },
    undo() {
      if (stagedrecord.length) {
        droppendingredos();
        appendstagedrecordtolatesthistoryrecord();
      }
      const undorecord = history[history.length - 1 + offset];
      if (!undorecord) {
        return;
      }
      offset -= 1;
      return undorecord;
    },
    redo() {
      const redorecord = history[history.length + offset];
      if (!redorecord) {
        return;
      }
      offset += 1;
      return redorecord;
    },
    hasundo() {
      return !!history[history.length - 1 + offset];
    },
    hasredo() {
      return !!history[history.length + offset];
    }
  };
}


;// ./node_modules/@wordpress/core-data/build-module/utils/if-matching-action.js
const ifmatchingaction = (ismatch) => (reducer) => (state, action) => {
  if (state === void 0 || ismatch(action)) {
    return reducer(state, action);
  }
  return state;
};
var if_matching_action_default = ifmatchingaction;


;// ./node_modules/@wordpress/core-data/build-module/utils/replace-action.js
const replaceaction = (replacer) => (reducer) => (state, action) => {
  return reducer(state, replacer(action));
};
var replace_action_default = replaceaction;


;// ./node_modules/@wordpress/core-data/build-module/utils/conservative-map-item.js

function conservativemapitem(item, nextitem) {
  if (!item) {
    return nextitem;
  }
  let haschanges = false;
  const result = {};
  for (const key in nextitem) {
    if (es6_default()(item[key], nextitem[key])) {
      result[key] = item[key];
    } else {
      haschanges = true;
      result[key] = nextitem[key];
    }
  }
  if (!haschanges) {
    return item;
  }
  for (const key in item) {
    if (!result.hasownproperty(key)) {
      result[key] = item[key];
    }
  }
  return result;
}


;// ./node_modules/@wordpress/core-data/build-module/utils/on-sub-key.js
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
var on_sub_key_default = onsubkey;


// external module: ./node_modules/@wordpress/core-data/build-module/entities.js + 2 modules
var entities = __webpack_require__(5914);
// external module: ./node_modules/@wordpress/core-data/build-module/queried-data/get-query-parts.js + 1 modules
var get_query_parts = __webpack_require__(4027);
;// ./node_modules/@wordpress/core-data/build-module/queried-data/reducer.js





function getcontextfromaction(action) {
  const { query } = action;
  if (!query) {
    return "default";
  }
  const queryparts = (0,get_query_parts/* default */.a)(query);
  return queryparts.context;
}
function getmergeditemids(itemids, nextitemids, page, perpage) {
  const receivedallids = page === 1 && perpage === -1;
  if (receivedallids) {
    return nextitemids;
  }
  const nextitemidsstartindex = (page - 1) * perpage;
  const size = math.max(
    itemids?.length ?? 0,
    nextitemidsstartindex + nextitemids.length
  );
  const mergeditemids = new array(size);
  for (let i = 0; i < size; i++) {
    const isinnextitemsrange = i >= nextitemidsstartindex && i < nextitemidsstartindex + perpage;
    mergeditemids[i] = isinnextitemsrange ? nextitemids[i - nextitemidsstartindex] : itemids?.[i];
  }
  return mergeditemids;
}
function removeentitiesbyid(entities, ids) {
  return object.fromentries(
    object.entries(entities).filter(
      ([id]) => !ids.some((itemid) => {
        if (number.isinteger(itemid)) {
          return itemid === +id;
        }
        return itemid === id;
      })
    )
  );
}
function items(state = {}, action) {
  switch (action.type) {
    case "receive_items": {
      const context = getcontextfromaction(action);
      const key = action.key || entities/* default_entity_key */.c_;
      return {
        ...state,
        [context]: {
          ...state[context],
          ...action.items.reduce((accumulator, value) => {
            const itemid = value?.[key];
            accumulator[itemid] = conservativemapitem(
              state?.[context]?.[itemid],
              value
            );
            return accumulator;
          }, {})
        }
      };
    }
    case "remove_items":
      return object.fromentries(
        object.entries(state).map(([itemid, contextstate]) => [
          itemid,
          removeentitiesbyid(contextstate, action.itemids)
        ])
      );
  }
  return state;
}
function itemiscomplete(state = {}, action) {
  switch (action.type) {
    case "receive_items": {
      const context = getcontextfromaction(action);
      const { query, key = entities/* default_entity_key */.c_ } = action;
      const queryparts = query ? (0,get_query_parts/* default */.a)(query) : {};
      const iscompletequery = !query || !array.isarray(queryparts.fields);
      return {
        ...state,
        [context]: {
          ...state[context],
          ...action.items.reduce((result, item) => {
            const itemid = item?.[key];
            result[itemid] = state?.[context]?.[itemid] || iscompletequery;
            return result;
          }, {})
        }
      };
    }
    case "remove_items":
      return object.fromentries(
        object.entries(state).map(([itemid, contextstate]) => [
          itemid,
          removeentitiesbyid(contextstate, action.itemids)
        ])
      );
  }
  return state;
}
const receivequeries = (0,external_wp_compose_namespaceobject.compose)([
  // limit to matching action type so we don't attempt to replace action on
  // an unhandled action.
  if_matching_action_default((action) => "query" in action),
  // inject query parts into action for use both in `onsubkey` and reducer.
  replace_action_default((action) => {
    if (action.query) {
      return {
        ...action,
        ...(0,get_query_parts/* default */.a)(action.query)
      };
    }
    return action;
  }),
  on_sub_key_default("context"),
  // queries shape is shared, but keyed by query `stablekey` part. original
  // reducer tracks only a single query object.
  on_sub_key_default("stablekey")
])((state = {}, action) => {
  const { type, page, perpage, key = entities/* default_entity_key */.c_ } = action;
  if (type !== "receive_items") {
    return state;
  }
  return {
    itemids: getmergeditemids(
      state?.itemids || [],
      action.items.map((item) => item?.[key]).filter(boolean),
      page,
      perpage
    ),
    meta: action.meta
  };
});
const queries = (state = {}, action) => {
  switch (action.type) {
    case "receive_items":
      return receivequeries(state, action);
    case "remove_items":
      const removeditems = action.itemids.reduce((result, itemid) => {
        result[itemid] = true;
        return result;
      }, {});
      return object.fromentries(
        object.entries(state).map(
          ([querygroup, contextqueries]) => [
            querygroup,
            object.fromentries(
              object.entries(contextqueries).map(
                ([query, queryitems]) => [
                  query,
                  {
                    ...queryitems,
                    itemids: queryitems.itemids.filter(
                      (queryid) => !removeditems[queryid]
                    )
                  }
                ]
              )
            )
          ]
        )
      );
    default:
      return state;
  }
};
var reducer_default = (0,external_wp_data_.combinereducers)({
  items,
  itemiscomplete,
  queries
});


;// ./node_modules/@wordpress/core-data/build-module/reducer.js







function users(state = { byid: {}, queries: {} }, action) {
  switch (action.type) {
    case "receive_user_query":
      return {
        byid: {
          ...state.byid,
          // key users by their id.
          ...action.users.reduce(
            (newusers, user) => ({
              ...newusers,
              [user.id]: user
            }),
            {}
          )
        },
        queries: {
          ...state.queries,
          [action.queryid]: action.users.map((user) => user.id)
        }
      };
  }
  return state;
}
function currentuser(state = {}, action) {
  switch (action.type) {
    case "receive_current_user":
      return action.currentuser;
  }
  return state;
}
function currenttheme(state = void 0, action) {
  switch (action.type) {
    case "receive_current_theme":
      return action.currenttheme.stylesheet;
  }
  return state;
}
function currentglobalstylesid(state = void 0, action) {
  switch (action.type) {
    case "receive_current_global_styles_id":
      return action.id;
  }
  return state;
}
function themebaseglobalstyles(state = {}, action) {
  switch (action.type) {
    case "receive_theme_global_styles":
      return {
        ...state,
        [action.stylesheet]: action.globalstyles
      };
  }
  return state;
}
function themeglobalstylevariations(state = {}, action) {
  switch (action.type) {
    case "receive_theme_global_style_variations":
      return {
        ...state,
        [action.stylesheet]: action.variations
      };
  }
  return state;
}
const withmultientityrecordedits = (reducer) => (state, action) => {
  if (action.type === "undo" || action.type === "redo") {
    const { record } = action;
    let newstate = state;
    record.foreach(({ id: { kind, name, recordid }, changes }) => {
      newstate = reducer(newstate, {
        type: "edit_entity_record",
        kind,
        name,
        recordid,
        edits: object.entries(changes).reduce(
          (acc, [key, value]) => {
            acc[key] = action.type === "undo" ? value.from : value.to;
            return acc;
          },
          {}
        )
      });
    });
    return newstate;
  }
  return reducer(state, action);
};
function entity(entityconfig) {
  return (0,external_wp_compose_namespaceobject.compose)([
    withmultientityrecordedits,
    // limit to matching action type so we don't attempt to replace action on
    // an unhandled action.
    if_matching_action_default(
      (action) => action.name && action.kind && action.name === entityconfig.name && action.kind === entityconfig.kind
    ),
    // inject the entity config into the action.
    replace_action_default((action) => {
      return {
        key: entityconfig.key || entities/* default_entity_key */.c_,
        ...action
      };
    })
  ])(
    (0,external_wp_data_.combinereducers)({
      querieddata: reducer_default,
      edits: (state = {}, action) => {
        switch (action.type) {
          case "receive_items":
            const context = action?.query?.context ?? "default";
            if (context !== "default") {
              return state;
            }
            const nextstate = { ...state };
            for (const record of action.items) {
              const recordid = record?.[action.key];
              const edits = nextstate[recordid];
              if (!edits) {
                continue;
              }
              const nextedits2 = object.keys(edits).reduce(
                (acc, key) => {
                  if (
                    // edits are the "raw" attribute values, but records may have
                    // objects with more properties, so we use `get` here for the
                    // comparison.
                    !es6_default()(
                      edits[key],
                      record[key]?.raw ?? record[key]
                    ) && // sometimes the server alters the sent value which means
                    // we need to also remove the edits before the api request.
                    (!action.persistededits || !es6_default()(
                      edits[key],
                      action.persistededits[key]
                    ))
                  ) {
                    acc[key] = edits[key];
                  }
                  return acc;
                },
                {}
              );
              if (object.keys(nextedits2).length) {
                nextstate[recordid] = nextedits2;
              } else {
                delete nextstate[recordid];
              }
            }
            return nextstate;
          case "edit_entity_record":
            const nextedits = {
              ...state[action.recordid],
              ...action.edits
            };
            object.keys(nextedits).foreach((key) => {
              if (nextedits[key] === void 0) {
                delete nextedits[key];
              }
            });
            return {
              ...state,
              [action.recordid]: nextedits
            };
        }
        return state;
      },
      saving: (state = {}, action) => {
        switch (action.type) {
          case "save_entity_record_start":
          case "save_entity_record_finish":
            return {
              ...state,
              [action.recordid]: {
                pending: action.type === "save_entity_record_start",
                error: action.error,
                isautosave: action.isautosave
              }
            };
        }
        return state;
      },
      deleting: (state = {}, action) => {
        switch (action.type) {
          case "delete_entity_record_start":
          case "delete_entity_record_finish":
            return {
              ...state,
              [action.recordid]: {
                pending: action.type === "delete_entity_record_start",
                error: action.error
              }
            };
        }
        return state;
      },
      revisions: (state = {}, action) => {
        if (action.type === "receive_item_revisions") {
          const recordkey = action.recordkey;
          delete action.recordkey;
          const newstate = reducer_default(state[recordkey], {
            ...action,
            type: "receive_items"
          });
          return {
            ...state,
            [recordkey]: newstate
          };
        }
        if (action.type === "remove_items") {
          return object.fromentries(
            object.entries(state).filter(
              ([id]) => !action.itemids.some((itemid) => {
                if (number.isinteger(itemid)) {
                  return itemid === +id;
                }
                return itemid === id;
              })
            )
          );
        }
        return state;
      }
    })
  );
}
function entitiesconfig(state = entities/* rootentitiesconfig */.mr, action) {
  switch (action.type) {
    case "add_entities":
      return [...state, ...action.entities];
  }
  return state;
}
const reducer_entities = (state = {}, action) => {
  const newconfig = entitiesconfig(state.config, action);
  let entitiesdatareducer = state.reducer;
  if (!entitiesdatareducer || newconfig !== state.config) {
    const entitiesbykind = newconfig.reduce((acc, record) => {
      const { kind } = record;
      if (!acc[kind]) {
        acc[kind] = [];
      }
      acc[kind].push(record);
      return acc;
    }, {});
    entitiesdatareducer = (0,external_wp_data_.combinereducers)(
      object.fromentries(
        object.entries(entitiesbykind).map(
          ([kind, subentities]) => {
            const kindreducer = (0,external_wp_data_.combinereducers)(
              object.fromentries(
                subentities.map((entityconfig) => [
                  entityconfig.name,
                  entity(entityconfig)
                ])
              )
            );
            return [kind, kindreducer];
          }
        )
      )
    );
  }
  const newdata = entitiesdatareducer(state.records, action);
  if (newdata === state.records && newconfig === state.config && entitiesdatareducer === state.reducer) {
    return state;
  }
  return {
    reducer: entitiesdatareducer,
    records: newdata,
    config: newconfig
  };
};
function undomanager(state = createundomanager()) {
  return state;
}
function editsreference(state = {}, action) {
  switch (action.type) {
    case "edit_entity_record":
    case "undo":
    case "redo":
      return {};
  }
  return state;
}
function embedpreviews(state = {}, action) {
  switch (action.type) {
    case "receive_embed_preview":
      const { url, preview } = action;
      return {
        ...state,
        [url]: preview
      };
  }
  return state;
}
function userpermissions(state = {}, action) {
  switch (action.type) {
    case "receive_user_permission":
      return {
        ...state,
        [action.key]: action.isallowed
      };
    case "receive_user_permissions":
      return {
        ...state,
        ...action.permissions
      };
  }
  return state;
}
function autosaves(state = {}, action) {
  switch (action.type) {
    case "receive_autosaves":
      const { postid, autosaves: autosavesdata } = action;
      return {
        ...state,
        [postid]: autosavesdata
      };
  }
  return state;
}
function blockpatterns(state = [], action) {
  switch (action.type) {
    case "receive_block_patterns":
      return action.patterns;
  }
  return state;
}
function blockpatterncategories(state = [], action) {
  switch (action.type) {
    case "receive_block_pattern_categories":
      return action.categories;
  }
  return state;
}
function userpatterncategories(state = [], action) {
  switch (action.type) {
    case "receive_user_pattern_categories":
      return action.patterncategories;
  }
  return state;
}
function navigationfallbackid(state = null, action) {
  switch (action.type) {
    case "receive_navigation_fallback_id":
      return action.fallbackid;
  }
  return state;
}
function themeglobalstylerevisions(state = {}, action) {
  switch (action.type) {
    case "receive_theme_global_style_revisions":
      return {
        ...state,
        [action.currentid]: action.revisions
      };
  }
  return state;
}
function defaulttemplates(state = {}, action) {
  switch (action.type) {
    case "receive_default_template":
      return {
        ...state,
        [json.stringify(action.query)]: action.templateid
      };
  }
  return state;
}
function registeredpostmeta(state = {}, action) {
  switch (action.type) {
    case "receive_registered_post_meta":
      return {
        ...state,
        [action.posttype]: action.registeredpostmeta
      };
  }
  return state;
}
var reducer_reducer_default = (0,external_wp_data_.combinereducers)({
  users,
  currenttheme,
  currentglobalstylesid,
  currentuser,
  themeglobalstylevariations,
  themebaseglobalstyles,
  themeglobalstylerevisions,
  entities: reducer_entities,
  editsreference,
  undomanager,
  embedpreviews,
  userpermissions,
  autosaves,
  blockpatterns,
  blockpatterncategories,
  userpatterncategories,
  navigationfallbackid,
  defaulttemplates,
  registeredpostmeta
});



/***/ }),

/***/ 5663:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   xq: () => (/* binding */ camelcase)
/* harmony export */ });
/* unused harmony exports camelcasetransform, camelcasetransformmerge */
/* harmony import */ var tslib__webpack_imported_module_1__ = __webpack_require__(1635);
/* harmony import */ var pascal_case__webpack_imported_module_0__ = __webpack_require__(287);


function camelcasetransform(input, index) {
    if (index === 0)
        return input.tolowercase();
    return (0,pascal_case__webpack_imported_module_0__/* .pascalcasetransform */ .l3)(input, index);
}
function camelcasetransformmerge(input, index) {
    if (index === 0)
        return input.tolowercase();
    return pascalcasetransformmerge(input);
}
function camelcase(input, options) {
    if (options === void 0) { options = {}; }
    return (0,pascal_case__webpack_imported_module_0__/* .pascalcase */ .fl)(input, (0,tslib__webpack_imported_module_1__/* .__assign */ .cl)({ transform: camelcasetransform }, options));
}


/***/ }),

/***/ 5891:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  qh: () => (/* reexport */ __experimentaluseentityrecord),
  bm: () => (/* reexport */ use_entity_records/* __experimentaluseentityrecords */.bm),
  _: () => (/* reexport */ __experimentaluseresourcepermissions),
  hg: () => (/* reexport */ useentityblockeditor),
  mv: () => (/* reexport */ useentityid),
  s$: () => (/* reexport */ useentityprop),
  ma: () => (/* reexport */ useentityrecord),
  $u: () => (/* reexport */ use_entity_records/* default */.ay),
  qs: () => (/* reexport */ use_resource_permissions_default)
});

// external module: external ["wp","data"]
var external_wp_data_ = __webpack_require__(7143);
// external module: external ["wp","deprecated"]
var external_wp_deprecated_ = __webpack_require__(4040);
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_);
// external module: external ["wp","element"]
var external_wp_element_ = __webpack_require__(6087);
// external module: ./node_modules/@wordpress/core-data/build-module/hooks/use-query-select.js + 2 modules
var use_query_select = __webpack_require__(7541);
// external module: ./node_modules/@wordpress/core-data/build-module/index.js
var build_module = __webpack_require__(4565);
;// ./node_modules/@wordpress/core-data/build-module/hooks/use-entity-record.js





const empty_object = {};
function useentityrecord(kind, name, recordid, options = { enabled: true }) {
  const { editentityrecord, saveeditedentityrecord } = (0,external_wp_data_.usedispatch)(build_module.store);
  const mutations = (0,external_wp_element_.usememo)(
    () => ({
      edit: (record2, editoptions = {}) => editentityrecord(kind, name, recordid, record2, editoptions),
      save: (saveoptions = {}) => saveeditedentityrecord(kind, name, recordid, {
        throwonerror: true,
        ...saveoptions
      })
    }),
    [editentityrecord, kind, name, recordid, saveeditedentityrecord]
  );
  const { editedrecord, hasedits, edits } = (0,external_wp_data_.useselect)(
    (select) => {
      if (!options.enabled) {
        return {
          editedrecord: empty_object,
          hasedits: false,
          edits: empty_object
        };
      }
      return {
        editedrecord: select(build_module.store).geteditedentityrecord(
          kind,
          name,
          recordid
        ),
        hasedits: select(build_module.store).haseditsforentityrecord(
          kind,
          name,
          recordid
        ),
        edits: select(build_module.store).getentityrecordnontransientedits(
          kind,
          name,
          recordid
        )
      };
    },
    [kind, name, recordid, options.enabled]
  );
  const { data: record, ...queryselectrest } = (0,use_query_select/* default */.a)(
    (query) => {
      if (!options.enabled) {
        return {
          data: null
        };
      }
      return query(build_module.store).getentityrecord(kind, name, recordid);
    },
    [kind, name, recordid, options.enabled]
  );
  return {
    record,
    editedrecord,
    hasedits,
    edits,
    ...queryselectrest,
    ...mutations
  };
}
function __experimentaluseentityrecord(kind, name, recordid, options) {
  external_wp_deprecated_default()(`wp.data.__experimentaluseentityrecord`, {
    alternative: "wp.data.useentityrecord",
    since: "6.1"
  });
  return useentityrecord(kind, name, recordid, options);
}


// external module: ./node_modules/@wordpress/core-data/build-module/hooks/use-entity-records.js
var use_entity_records = __webpack_require__(7078);
;// external ["wp","warning"]
const external_wp_warning_namespaceobject = window["wp"]["warning"];
var external_wp_warning_default = /*#__pure__*/__webpack_require__.n(external_wp_warning_namespaceobject);
// external module: ./node_modules/@wordpress/core-data/build-module/hooks/constants.js
var constants = __webpack_require__(2859);
;// ./node_modules/@wordpress/core-data/build-module/hooks/use-resource-permissions.js





function useresourcepermissions(resource, id) {
  const isentity = typeof resource === "object";
  const resourceasstring = isentity ? json.stringify(resource) : resource;
  if (isentity && typeof id !== "undefined") {
    external_wp_warning_default()(
      `when 'resource' is an entity object, passing 'id' as a separate argument isn't supported.`
    );
  }
  return (0,use_query_select/* default */.a)(
    (resolve) => {
      const hasid = isentity ? !!resource.id : !!id;
      const { canuser } = resolve(build_module.store);
      const create = canuser(
        "create",
        isentity ? { kind: resource.kind, name: resource.name } : resource
      );
      if (!hasid) {
        const read2 = canuser("read", resource);
        const isresolving2 = create.isresolving || read2.isresolving;
        const hasresolved2 = create.hasresolved && read2.hasresolved;
        let status2 = constants/* status */.n.idle;
        if (isresolving2) {
          status2 = constants/* status */.n.resolving;
        } else if (hasresolved2) {
          status2 = constants/* status */.n.success;
        }
        return {
          status: status2,
          isresolving: isresolving2,
          hasresolved: hasresolved2,
          cancreate: create.hasresolved && create.data,
          canread: read2.hasresolved && read2.data
        };
      }
      const read = canuser("read", resource, id);
      const update = canuser("update", resource, id);
      const _delete = canuser("delete", resource, id);
      const isresolving = read.isresolving || create.isresolving || update.isresolving || _delete.isresolving;
      const hasresolved = read.hasresolved && create.hasresolved && update.hasresolved && _delete.hasresolved;
      let status = constants/* status */.n.idle;
      if (isresolving) {
        status = constants/* status */.n.resolving;
      } else if (hasresolved) {
        status = constants/* status */.n.success;
      }
      return {
        status,
        isresolving,
        hasresolved,
        canread: hasresolved && read.data,
        cancreate: hasresolved && create.data,
        canupdate: hasresolved && update.data,
        candelete: hasresolved && _delete.data
      };
    },
    [resourceasstring, id]
  );
}
var use_resource_permissions_default = useresourcepermissions;
function __experimentaluseresourcepermissions(resource, id) {
  external_wp_deprecated_default()(`wp.data.__experimentaluseresourcepermissions`, {
    alternative: "wp.data.useresourcepermissions",
    since: "6.1"
  });
  return useresourcepermissions(resource, id);
}


// external module: external ["wp","blocks"]
var external_wp_blocks_ = __webpack_require__(4997);
// external module: ./node_modules/@wordpress/core-data/build-module/name.js
var build_module_name = __webpack_require__(2278);
// external module: ./node_modules/@wordpress/core-data/build-module/entity-context.js
var entity_context = __webpack_require__(8843);
;// ./node_modules/@wordpress/core-data/build-module/hooks/use-entity-id.js


function useentityid(kind, name) {
  const context = (0,external_wp_element_.usecontext)(entity_context/* entitycontext */.d);
  return context?.[kind]?.[name];
}


;// external ["wp","richtext"]
const external_wp_richtext_namespaceobject = window["wp"]["richtext"];
;// external ["wp","blockeditor"]
const external_wp_blockeditor_namespaceobject = window["wp"]["blockeditor"];
// external module: ./node_modules/@wordpress/core-data/build-module/lock-unlock.js + 1 modules
var lock_unlock = __webpack_require__(6378);
;// ./node_modules/@wordpress/core-data/build-module/footnotes/get-rich-text-values-cached.js


let unlockedapis;
const cache = /* @__pure__ */ new weakmap();
function getrichtextvaluescached(block) {
  if (!unlockedapis) {
    unlockedapis = (0,lock_unlock/* unlock */.t)(external_wp_blockeditor_namespaceobject.privateapis);
  }
  if (!cache.has(block)) {
    const values = unlockedapis.getrichtextvalues([block]);
    cache.set(block, values);
  }
  return cache.get(block);
}


;// ./node_modules/@wordpress/core-data/build-module/footnotes/get-footnotes-order.js

const get_footnotes_order_cache = /* @__pure__ */ new weakmap();
function getblockfootnotesorder(block) {
  if (!get_footnotes_order_cache.has(block)) {
    const order = [];
    for (const value of getrichtextvaluescached(block)) {
      if (!value) {
        continue;
      }
      value.replacements.foreach(({ type, attributes }) => {
        if (type === "core/footnote") {
          order.push(attributes["data-fn"]);
        }
      });
    }
    get_footnotes_order_cache.set(block, order);
  }
  return get_footnotes_order_cache.get(block);
}
function getfootnotesorder(blocks) {
  return blocks.flatmap(getblockfootnotesorder);
}


;// ./node_modules/@wordpress/core-data/build-module/footnotes/index.js


let oldfootnotes = {};
function updatefootnotesfrommeta(blocks, meta) {
  const output = { blocks };
  if (!meta) {
    return output;
  }
  if (meta.footnotes === void 0) {
    return output;
  }
  const neworder = getfootnotesorder(blocks);
  const footnotes = meta.footnotes ? json.parse(meta.footnotes) : [];
  const currentorder = footnotes.map((fn) => fn.id);
  if (currentorder.join("") === neworder.join("")) {
    return output;
  }
  const newfootnotes = neworder.map(
    (fnid) => footnotes.find((fn) => fn.id === fnid) || oldfootnotes[fnid] || {
      id: fnid,
      content: ""
    }
  );
  function updateattributes(attributes) {
    if (!attributes || array.isarray(attributes) || typeof attributes !== "object") {
      return attributes;
    }
    attributes = { ...attributes };
    for (const key in attributes) {
      const value = attributes[key];
      if (array.isarray(value)) {
        attributes[key] = value.map(updateattributes);
        continue;
      }
      if (typeof value !== "string" && !(value instanceof external_wp_richtext_namespaceobject.richtextdata)) {
        continue;
      }
      const richtextvalue = typeof value === "string" ? external_wp_richtext_namespaceobject.richtextdata.fromhtmlstring(value) : new external_wp_richtext_namespaceobject.richtextdata(value);
      let hasfootnotes = false;
      richtextvalue.replacements.foreach((replacement) => {
        if (replacement.type === "core/footnote") {
          const id = replacement.attributes["data-fn"];
          const index = neworder.indexof(id);
          const countvalue = (0,external_wp_richtext_namespaceobject.create)({
            html: replacement.innerhtml
          });
          countvalue.text = string(index + 1);
          countvalue.formats = array.from(
            { length: countvalue.text.length },
            () => countvalue.formats[0]
          );
          countvalue.replacements = array.from(
            { length: countvalue.text.length },
            () => countvalue.replacements[0]
          );
          replacement.innerhtml = (0,external_wp_richtext_namespaceobject.tohtmlstring)({
            value: countvalue
          });
          hasfootnotes = true;
        }
      });
      if (hasfootnotes) {
        attributes[key] = typeof value === "string" ? richtextvalue.tohtmlstring() : richtextvalue;
      }
    }
    return attributes;
  }
  function updateblocksattributes(__blocks) {
    return __blocks.map((block) => {
      return {
        ...block,
        attributes: updateattributes(block.attributes),
        innerblocks: updateblocksattributes(block.innerblocks)
      };
    });
  }
  const newblocks = updateblocksattributes(blocks);
  oldfootnotes = {
    ...oldfootnotes,
    ...footnotes.reduce((acc, fn) => {
      if (!neworder.includes(fn.id)) {
        acc[fn.id] = fn;
      }
      return acc;
    }, {})
  };
  return {
    meta: {
      ...meta,
      footnotes: json.stringify(newfootnotes)
    },
    blocks: newblocks
  };
}


;// ./node_modules/@wordpress/core-data/build-module/hooks/use-entity-block-editor.js






const empty_array = [];
const parsedblockscache = /* @__pure__ */ new weakmap();
function useentityblockeditor(kind, name, { id: _id } = {}) {
  const providerid = useentityid(kind, name);
  const id = _id ?? providerid;
  const { getentityrecord, getentityrecordedits } = (0,external_wp_data_.useselect)(build_module_name/* store_name */.e);
  const { content, editedblocks, meta } = (0,external_wp_data_.useselect)(
    (select) => {
      if (!id) {
        return {};
      }
      const { geteditedentityrecord } = select(build_module_name/* store_name */.e);
      const editedrecord = geteditedentityrecord(kind, name, id);
      return {
        editedblocks: editedrecord.blocks,
        content: editedrecord.content,
        meta: editedrecord.meta
      };
    },
    [kind, name, id]
  );
  const { __unstablecreateundolevel, editentityrecord } = (0,external_wp_data_.usedispatch)(build_module_name/* store_name */.e);
  const blocks = (0,external_wp_element_.usememo)(() => {
    if (!id) {
      return void 0;
    }
    if (editedblocks) {
      return editedblocks;
    }
    if (!content || typeof content !== "string") {
      return empty_array;
    }
    const edits = getentityrecordedits(kind, name, id);
    const isunedited = !edits || !object.keys(edits).length;
    const cackekey = isunedited ? getentityrecord(kind, name, id) : edits;
    let _blocks = parsedblockscache.get(cackekey);
    if (!_blocks) {
      _blocks = (0,external_wp_blocks_.parse)(content);
      parsedblockscache.set(cackekey, _blocks);
    }
    return _blocks;
  }, [
    kind,
    name,
    id,
    editedblocks,
    content,
    getentityrecord,
    getentityrecordedits
  ]);
  const onchange = (0,external_wp_element_.usecallback)(
    (newblocks, options) => {
      const nochange = blocks === newblocks;
      if (nochange) {
        return __unstablecreateundolevel(kind, name, id);
      }
      const { selection, ...rest } = options;
      const edits = {
        selection,
        content: ({ blocks: blocksforserialization = [] }) => (0,external_wp_blocks_.__unstableserializeandclean)(blocksforserialization),
        ...updatefootnotesfrommeta(newblocks, meta)
      };
      editentityrecord(kind, name, id, edits, {
        iscached: false,
        ...rest
      });
    },
    [
      kind,
      name,
      id,
      blocks,
      meta,
      __unstablecreateundolevel,
      editentityrecord
    ]
  );
  const oninput = (0,external_wp_element_.usecallback)(
    (newblocks, options) => {
      const { selection, ...rest } = options;
      const footnoteschanges = updatefootnotesfrommeta(newblocks, meta);
      const edits = { selection, ...footnoteschanges };
      editentityrecord(kind, name, id, edits, {
        iscached: true,
        ...rest
      });
    },
    [kind, name, id, meta, editentityrecord]
  );
  return [blocks, oninput, onchange];
}


;// ./node_modules/@wordpress/core-data/build-module/hooks/use-entity-prop.js




function useentityprop(kind, name, prop, _id) {
  const providerid = useentityid(kind, name);
  const id = _id ?? providerid;
  const { value, fullvalue } = (0,external_wp_data_.useselect)(
    (select) => {
      const { getentityrecord, geteditedentityrecord } = select(build_module_name/* store_name */.e);
      const record = getentityrecord(kind, name, id);
      const editedrecord = geteditedentityrecord(kind, name, id);
      return record && editedrecord ? {
        value: editedrecord[prop],
        fullvalue: record[prop]
      } : {};
    },
    [kind, name, id, prop]
  );
  const { editentityrecord } = (0,external_wp_data_.usedispatch)(build_module_name/* store_name */.e);
  const setvalue = (0,external_wp_element_.usecallback)(
    (newvalue) => {
      editentityrecord(kind, name, id, {
        [prop]: newvalue
      });
    },
    [editentityrecord, kind, name, id, prop]
  );
  return [value, setvalue, fullvalue];
}


;// ./node_modules/@wordpress/core-data/build-module/hooks/index.js









/***/ }),

/***/ 5914:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  c_: () => (/* binding */ default_entity_key),
  l2: () => (/* binding */ additionalentityconfigloaders),
  tk: () => (/* binding */ deprecatedentities),
  zd: () => (/* binding */ getmethodname),
  mr: () => (/* binding */ rootentitiesconfig)
});

// unused exports: prepersistposttype

// external module: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(1635);
// external module: ./node_modules/no-case/dist.es2015/index.js
var dist_es2015 = __webpack_require__(2226);
;// ./node_modules/upper-case-first/dist.es2015/index.js
/**
 * upper case the first character of an input string.
 */
function uppercasefirst(input) {
    return input.charat(0).touppercase() + input.substr(1);
}

;// ./node_modules/capital-case/dist.es2015/index.js



function capitalcasetransform(input) {
    return uppercasefirst(input.tolowercase());
}
function capitalcase(input, options) {
    if (options === void 0) { options = {}; }
    return (0,dist_es2015/* nocase */.w)(input, (0,tslib_es6/* __assign */.cl)({ delimiter: " ", transform: capitalcasetransform }, options));
}

// external module: ./node_modules/pascal-case/dist.es2015/index.js
var pascal_case_dist_es2015 = __webpack_require__(287);
// external module: external ["wp","apifetch"]
var external_wp_apifetch_ = __webpack_require__(1455);
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_);
// external module: external ["wp","blocks"]
var external_wp_blocks_ = __webpack_require__(4997);
// external module: external ["wp","i18n"]
var external_wp_i18n_ = __webpack_require__(7723);
;// ./node_modules/@wordpress/core-data/build-module/entities.js





const default_entity_key = "id";
const post_raw_attributes = ["title", "excerpt", "content"];
const blockstransientedits = {
  blocks: {
    read: (record) => (0,external_wp_blocks_.parse)(record.content?.raw ?? ""),
    write: (record) => ({
      content: (0,external_wp_blocks_.__unstableserializeandclean)(record.blocks)
    })
  }
};
const rootentitiesconfig = [
  {
    label: (0,external_wp_i18n_.__)("base"),
    kind: "root",
    key: false,
    name: "__unstablebase",
    baseurl: "/",
    baseurlparams: {
      // please also change the preload path when changing this.
      // @see lib/compat/wordpress-6.8/preload.php
      _fields: [
        "description",
        "gmt_offset",
        "home",
        "name",
        "site_icon",
        "site_icon_url",
        "site_logo",
        "timezone_string",
        "url",
        "page_for_posts",
        "page_on_front",
        "show_on_front"
      ].join(",")
    },
    // the entity doesn't support selecting multiple records.
    // the property is maintained for backward compatibility.
    plural: "__unstablebases"
  },
  {
    label: (0,external_wp_i18n_.__)("post type"),
    name: "posttype",
    kind: "root",
    key: "slug",
    baseurl: "/wp/v2/types",
    baseurlparams: { context: "edit" },
    plural: "posttypes"
  },
  {
    name: "media",
    kind: "root",
    baseurl: "/wp/v2/media",
    baseurlparams: { context: "edit" },
    plural: "mediaitems",
    label: (0,external_wp_i18n_.__)("media"),
    rawattributes: ["caption", "title", "description"],
    supportspagination: true
  },
  {
    name: "taxonomy",
    kind: "root",
    key: "slug",
    baseurl: "/wp/v2/taxonomies",
    baseurlparams: { context: "edit" },
    plural: "taxonomies",
    label: (0,external_wp_i18n_.__)("taxonomy")
  },
  {
    name: "sidebar",
    kind: "root",
    baseurl: "/wp/v2/sidebars",
    baseurlparams: { context: "edit" },
    plural: "sidebars",
    transientedits: { blocks: true },
    label: (0,external_wp_i18n_.__)("widget areas")
  },
  {
    name: "widget",
    kind: "root",
    baseurl: "/wp/v2/widgets",
    baseurlparams: { context: "edit" },
    plural: "widgets",
    transientedits: { blocks: true },
    label: (0,external_wp_i18n_.__)("widgets")
  },
  {
    name: "widgettype",
    kind: "root",
    baseurl: "/wp/v2/widget-types",
    baseurlparams: { context: "edit" },
    plural: "widgettypes",
    label: (0,external_wp_i18n_.__)("widget types")
  },
  {
    label: (0,external_wp_i18n_.__)("user"),
    name: "user",
    kind: "root",
    baseurl: "/wp/v2/users",
    gettitle: (record) => record?.name || record?.slug,
    baseurlparams: { context: "edit" },
    plural: "users",
    supportspagination: true
  },
  {
    name: "comment",
    kind: "root",
    baseurl: "/wp/v2/comments",
    baseurlparams: { context: "edit" },
    plural: "comments",
    label: (0,external_wp_i18n_.__)("comment"),
    supportspagination: true
  },
  {
    name: "menu",
    kind: "root",
    baseurl: "/wp/v2/menus",
    baseurlparams: { context: "edit" },
    plural: "menus",
    label: (0,external_wp_i18n_.__)("menu"),
    supportspagination: true
  },
  {
    name: "menuitem",
    kind: "root",
    baseurl: "/wp/v2/menu-items",
    baseurlparams: { context: "edit" },
    plural: "menuitems",
    label: (0,external_wp_i18n_.__)("menu item"),
    rawattributes: ["title"],
    supportspagination: true
  },
  {
    name: "menulocation",
    kind: "root",
    baseurl: "/wp/v2/menu-locations",
    baseurlparams: { context: "edit" },
    plural: "menulocations",
    label: (0,external_wp_i18n_.__)("menu location"),
    key: "name"
  },
  {
    label: (0,external_wp_i18n_.__)("global styles"),
    name: "globalstyles",
    kind: "root",
    baseurl: "/wp/v2/global-styles",
    baseurlparams: { context: "edit" },
    plural: "globalstylesvariations",
    // should be different from name.
    gettitle: () => (0,external_wp_i18n_.__)("custom styles"),
    getrevisionsurl: (parentid, revisionid) => `/wp/v2/global-styles/${parentid}/revisions${revisionid ? "/" + revisionid : ""}`,
    supportspagination: true
  },
  {
    label: (0,external_wp_i18n_.__)("themes"),
    name: "theme",
    kind: "root",
    baseurl: "/wp/v2/themes",
    baseurlparams: { context: "edit" },
    plural: "themes",
    key: "stylesheet"
  },
  {
    label: (0,external_wp_i18n_.__)("plugins"),
    name: "plugin",
    kind: "root",
    baseurl: "/wp/v2/plugins",
    baseurlparams: { context: "edit" },
    plural: "plugins",
    key: "plugin"
  },
  {
    label: (0,external_wp_i18n_.__)("status"),
    name: "status",
    kind: "root",
    baseurl: "/wp/v2/statuses",
    baseurlparams: { context: "edit" },
    plural: "statuses",
    key: "slug"
  }
];
const deprecatedentities = {
  root: {
    media: {
      since: "6.9",
      alternative: {
        kind: "posttype",
        name: "attachment"
      }
    }
  }
};
const additionalentityconfigloaders = [
  { kind: "posttype", loadentities: loadposttypeentities },
  { kind: "taxonomy", loadentities: loadtaxonomyentities },
  {
    kind: "root",
    name: "site",
    plural: "sites",
    loadentities: loadsiteentity
  }
];
const prepersistposttype = (persistedrecord, edits) => {
  const newedits = {};
  if (persistedrecord?.status === "auto-draft") {
    if (!edits.status && !newedits.status) {
      newedits.status = "draft";
    }
    if ((!edits.title || edits.title === "auto draft") && !newedits.title && (!persistedrecord?.title || persistedrecord?.title === "auto draft")) {
      newedits.title = "";
    }
  }
  return newedits;
};
async function loadposttypeentities() {
  const posttypes = await external_wp_apifetch_default()({
    path: "/wp/v2/types?context=view"
  });
  return object.entries(posttypes ?? {}).map(([name, posttype]) => {
    const istemplate = ["wp_template", "wp_template_part"].includes(
      name
    );
    const namespace = posttype?.rest_namespace ?? "wp/v2";
    const entity = {
      kind: "posttype",
      baseurl: `/${namespace}/${posttype.rest_base}`,
      baseurlparams: { context: "edit" },
      name,
      label: posttype.name,
      transientedits: {
        ...blockstransientedits,
        selection: true
      },
      mergededits: { meta: true },
      rawattributes: post_raw_attributes,
      gettitle: (record) => record?.title?.rendered || record?.title || (istemplate ? capitalcase(record.slug ?? "") : string(record.id)),
      __unstableprepersist: istemplate ? void 0 : prepersistposttype,
      __unstable_rest_base: posttype.rest_base,
      supportspagination: true,
      getrevisionsurl: (parentid, revisionid) => `/${namespace}/${posttype.rest_base}/${parentid}/revisions${revisionid ? "/" + revisionid : ""}`,
      revisionkey: istemplate ? "wp_id" : default_entity_key
    };
    if (window.__experimentalenablesync) {
      if (false) {}
    }
    return entity;
  });
}
async function loadtaxonomyentities() {
  const taxonomies = await external_wp_apifetch_default()({
    path: "/wp/v2/taxonomies?context=view"
  });
  return object.entries(taxonomies ?? {}).map(([name, taxonomy]) => {
    const namespace = taxonomy?.rest_namespace ?? "wp/v2";
    return {
      kind: "taxonomy",
      baseurl: `/${namespace}/${taxonomy.rest_base}`,
      baseurlparams: { context: "edit" },
      name,
      label: taxonomy.name,
      gettitle: (record) => record?.name,
      supportspagination: true
    };
  });
}
async function loadsiteentity() {
  const entity = {
    label: (0,external_wp_i18n_.__)("site"),
    name: "site",
    kind: "root",
    key: false,
    baseurl: "/wp/v2/settings",
    meta: {}
  };
  if (window.__experimentalenablesync) {
    if (false) {}
  }
  const site = await external_wp_apifetch_default()({
    path: entity.baseurl,
    method: "options"
  });
  const labels = {};
  object.entries(site?.schema?.properties ?? {}).foreach(
    ([key, value]) => {
      if (typeof value === "object" && value.title) {
        labels[key] = value.title;
      }
    }
  );
  return [{ ...entity, meta: { labels } }];
}
const getmethodname = (kind, name, prefix = "get") => {
  const kindprefix = kind === "root" ? "" : (0,pascal_case_dist_es2015/* pascalcase */.fl)(kind);
  const suffix = (0,pascal_case_dist_es2015/* pascalcase */.fl)(name);
  return `${prefix}${kindprefix}${suffix}`;
};



/***/ }),

/***/ 6087:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ 6378:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  s: () => (/* binding */ lock),
  t: () => (/* binding */ unlock)
});

;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/core-data/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/core-data"
);



/***/ }),

/***/ 6384:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  __experimentalgetcurrentglobalstylesid: () => (/* binding */ __experimentalgetcurrentglobalstylesid),
  __experimentalgetcurrentthemebaseglobalstyles: () => (/* binding */ __experimentalgetcurrentthemebaseglobalstyles),
  __experimentalgetcurrentthemeglobalstylesvariations: () => (/* binding */ __experimentalgetcurrentthemeglobalstylesvariations),
  canuser: () => (/* binding */ canuser),
  canusereditentityrecord: () => (/* binding */ canusereditentityrecord),
  getauthors: () => (/* binding */ getauthors),
  getautosave: () => (/* binding */ getautosave),
  getautosaves: () => (/* binding */ getautosaves),
  getblockpatterncategories: () => (/* binding */ getblockpatterncategories),
  getblockpatterns: () => (/* binding */ getblockpatterns),
  getcurrenttheme: () => (/* binding */ getcurrenttheme),
  getcurrentthemeglobalstylesrevisions: () => (/* binding */ getcurrentthemeglobalstylesrevisions),
  getcurrentuser: () => (/* binding */ getcurrentuser),
  getdefaulttemplateid: () => (/* binding */ getdefaulttemplateid),
  geteditedentityrecord: () => (/* binding */ geteditedentityrecord),
  getembedpreview: () => (/* binding */ getembedpreview),
  getentitiesconfig: () => (/* binding */ getentitiesconfig),
  getentityrecord: () => (/* binding */ getentityrecord),
  getentityrecords: () => (/* binding */ getentityrecords),
  getentityrecordstotalitems: () => (/* binding */ getentityrecordstotalitems),
  getentityrecordstotalpages: () => (/* binding */ getentityrecordstotalpages),
  getnavigationfallbackid: () => (/* binding */ getnavigationfallbackid),
  getrawentityrecord: () => (/* binding */ getrawentityrecord),
  getregisteredpostmeta: () => (/* binding */ getregisteredpostmeta),
  getrevision: () => (/* binding */ getrevision),
  getrevisions: () => (/* binding */ getrevisions),
  getthemesupports: () => (/* binding */ getthemesupports),
  getuserpatterncategories: () => (/* binding */ getuserpatterncategories)
});

// external module: ./node_modules/camel-case/dist.es2015/index.js
var dist_es2015 = __webpack_require__(5663);
// external module: external ["wp","url"]
var external_wp_url_ = __webpack_require__(3832);
// external module: external ["wp","htmlentities"]
var external_wp_htmlentities_ = __webpack_require__(8537);
// external module: external ["wp","apifetch"]
var external_wp_apifetch_ = __webpack_require__(1455);
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_);
// external module: ./node_modules/@wordpress/core-data/build-module/name.js
var build_module_name = __webpack_require__(2278);
// external module: ./node_modules/@wordpress/core-data/build-module/entities.js + 2 modules
var entities = __webpack_require__(5914);
// external module: ./node_modules/@wordpress/core-data/build-module/utils/get-normalized-comma-separable.js
var get_normalized_comma_separable = __webpack_require__(533);
// external module: ./node_modules/@wordpress/core-data/build-module/utils/user-permissions.js
var user_permissions = __webpack_require__(2577);
;// ./node_modules/@wordpress/core-data/build-module/utils/forward-resolver.js
const forwardresolver = (resolvername) => (...args) => async ({ resolveselect }) => {
  await resolveselect[resolvername](...args);
};
var forward_resolver_default = forwardresolver;


// external module: ./node_modules/@wordpress/core-data/build-module/utils/receive-intermediate-results.js
var receive_intermediate_results = __webpack_require__(5101);
// external module: ./node_modules/@wordpress/core-data/build-module/fetch/index.js + 2 modules
var fetch = __webpack_require__(7006);
;// ./node_modules/@wordpress/core-data/build-module/resolvers.js









const getauthors = (query) => async ({ dispatch }) => {
  const path = (0,external_wp_url_.addqueryargs)(
    "/wp/v2/users/?who=authors&per_page=100",
    query
  );
  const users = await external_wp_apifetch_default()({ path });
  dispatch.receiveuserquery(path, users);
};
const getcurrentuser = () => async ({ dispatch }) => {
  const currentuser = await external_wp_apifetch_default()({ path: "/wp/v2/users/me" });
  dispatch.receivecurrentuser(currentuser);
};
const getentityrecord = (kind, name, key = "", query) => async ({ select, dispatch, registry, resolveselect }) => {
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.name === name && config.kind === kind
  );
  if (!entityconfig) {
    return;
  }
  const lock = await dispatch.__unstableacquirestorelock(
    build_module_name/* store_name */.e,
    ["entities", "records", kind, name, key],
    { exclusive: false }
  );
  try {
    if (query !== void 0 && query._fields) {
      query = {
        ...query,
        _fields: [
          .../* @__pure__ */ new set([
            ...(0,get_normalized_comma_separable/* default */.a)(query._fields) || [],
            entityconfig.key || entities/* default_entity_key */.c_
          ])
        ].join()
      };
    }
    if (query !== void 0 && query._fields) {
      const hasrecord = select.hasentityrecord(
        kind,
        name,
        key,
        query
      );
      if (hasrecord) {
        return;
      }
    }
    const path = (0,external_wp_url_.addqueryargs)(
      entityconfig.baseurl + (key ? "/" + key : ""),
      {
        ...entityconfig.baseurlparams,
        ...query
      }
    );
    const response = await external_wp_apifetch_default()({ path, parse: false });
    const record = await response.json();
    const permissions = (0,user_permissions/* getuserpermissionsfromallowheader */.qy)(
      response.headers?.get("allow")
    );
    const canuserresolutionsargs = [];
    const receiveuserpermissionargs = {};
    for (const action of user_permissions/* allowed_resource_actions */.co) {
      receiveuserpermissionargs[(0,user_permissions/* getuserpermissioncachekey */.kc)(action, {
        kind,
        name,
        id: key
      })] = permissions[action];
      canuserresolutionsargs.push([
        action,
        { kind, name, id: key }
      ]);
    }
    if (window.__experimentalenablesync && entityconfig.syncconfig && !query) {
      if (false) {}
    }
    registry.batch(() => {
      dispatch.receiveentityrecords(kind, name, record, query);
      dispatch.receiveuserpermissions(receiveuserpermissionargs);
      dispatch.finishresolutions("canuser", canuserresolutionsargs);
    });
  } finally {
    dispatch.__unstablereleasestorelock(lock);
  }
};
const getrawentityrecord = forward_resolver_default("getentityrecord");
const geteditedentityrecord = forward_resolver_default("getentityrecord");
const getentityrecords = (kind, name, query = {}) => async ({ dispatch, registry, resolveselect }) => {
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.name === name && config.kind === kind
  );
  if (!entityconfig) {
    return;
  }
  const lock = await dispatch.__unstableacquirestorelock(
    build_module_name/* store_name */.e,
    ["entities", "records", kind, name],
    { exclusive: false }
  );
  const rawquery = { ...query };
  const key = entityconfig.key || entities/* default_entity_key */.c_;
  function getresolutionsargs(records, recordsquery) {
    const queryargs = object.fromentries(
      object.entries(recordsquery).filter(([k, v]) => {
        return ["context", "_fields"].includes(k) && !!v;
      })
    );
    return records.filter((record) => record?.[key]).map((record) => [
      kind,
      name,
      record[key],
      object.keys(queryargs).length > 0 ? queryargs : void 0
    ]);
  }
  try {
    if (query._fields) {
      query = {
        ...query,
        _fields: [
          .../* @__pure__ */ new set([
            ...(0,get_normalized_comma_separable/* default */.a)(query._fields) || [],
            key
          ])
        ].join()
      };
    }
    const path = (0,external_wp_url_.addqueryargs)(entityconfig.baseurl, {
      ...entityconfig.baseurlparams,
      ...query
    });
    let records = [], meta;
    if (entityconfig.supportspagination && query.per_page !== -1) {
      const response = await external_wp_apifetch_default()({ path, parse: false });
      records = object.values(await response.json());
      meta = {
        totalitems: parseint(
          response.headers.get("x-wp-total")
        ),
        totalpages: parseint(
          response.headers.get("x-wp-totalpages")
        )
      };
    } else if (query.per_page === -1 && query[receive_intermediate_results/* receive_intermediate_results */.z] === true) {
      let page = 1;
      let totalpages;
      do {
        const response = await external_wp_apifetch_default()({
          path: (0,external_wp_url_.addqueryargs)(path, { page, per_page: 100 }),
          parse: false
        });
        const pagerecords = object.values(await response.json());
        totalpages = parseint(
          response.headers.get("x-wp-totalpages")
        );
        if (!meta) {
          meta = {
            totalitems: parseint(
              response.headers.get("x-wp-total")
            ),
            totalpages: 1
          };
        }
        records.push(...pagerecords);
        registry.batch(() => {
          dispatch.receiveentityrecords(
            kind,
            name,
            records,
            query,
            false,
            void 0,
            meta
          );
          dispatch.finishresolutions(
            "getentityrecord",
            getresolutionsargs(pagerecords, rawquery)
          );
        });
        page++;
      } while (page <= totalpages);
    } else {
      records = object.values(await external_wp_apifetch_default()({ path }));
      meta = {
        totalitems: records.length,
        totalpages: 1
      };
    }
    if (query._fields) {
      records = records.map((record) => {
        query._fields.split(",").foreach((field) => {
          if (!record.hasownproperty(field)) {
            record[field] = void 0;
          }
        });
        return record;
      });
    }
    registry.batch(() => {
      dispatch.receiveentityrecords(
        kind,
        name,
        records,
        query,
        false,
        void 0,
        meta
      );
      const targethints = records.filter(
        (record) => !!record?.[key] && !!record?._links?.self?.[0]?.targethints?.allow
      ).map((record) => ({
        id: record[key],
        permissions: (0,user_permissions/* getuserpermissionsfromallowheader */.qy)(
          record._links.self[0].targethints.allow
        )
      }));
      const canuserresolutionsargs = [];
      const receiveuserpermissionargs = {};
      for (const targethint of targethints) {
        for (const action of user_permissions/* allowed_resource_actions */.co) {
          canuserresolutionsargs.push([
            action,
            { kind, name, id: targethint.id }
          ]);
          receiveuserpermissionargs[(0,user_permissions/* getuserpermissioncachekey */.kc)(action, {
            kind,
            name,
            id: targethint.id
          })] = targethint.permissions[action];
        }
      }
      if (targethints.length > 0) {
        dispatch.receiveuserpermissions(
          receiveuserpermissionargs
        );
        dispatch.finishresolutions(
          "canuser",
          canuserresolutionsargs
        );
      }
      dispatch.finishresolutions(
        "getentityrecord",
        getresolutionsargs(records, rawquery)
      );
      dispatch.__unstablereleasestorelock(lock);
    });
  } catch (e) {
    dispatch.__unstablereleasestorelock(lock);
  }
};
getentityrecords.shouldinvalidate = (action, kind, name) => {
  return (action.type === "receive_items" || action.type === "remove_items") && action.invalidatecache && kind === action.kind && name === action.name;
};
const getentityrecordstotalitems = forward_resolver_default("getentityrecords");
const getentityrecordstotalpages = forward_resolver_default("getentityrecords");
const getcurrenttheme = () => async ({ dispatch, resolveselect }) => {
  const activethemes = await resolveselect.getentityrecords(
    "root",
    "theme",
    { status: "active" }
  );
  dispatch.receivecurrenttheme(activethemes[0]);
};
const getthemesupports = forward_resolver_default("getcurrenttheme");
const getembedpreview = (url) => async ({ dispatch }) => {
  try {
    const embedproxyresponse = await external_wp_apifetch_default()({
      path: (0,external_wp_url_.addqueryargs)("/oembed/1.0/proxy", { url })
    });
    dispatch.receiveembedpreview(url, embedproxyresponse);
  } catch (error) {
    dispatch.receiveembedpreview(url, false);
  }
};
const canuser = (requestedaction, resource, id) => async ({ dispatch, registry, resolveselect }) => {
  if (!user_permissions/* allowed_resource_actions */.co.includes(requestedaction)) {
    throw new error(`'${requestedaction}' is not a valid action.`);
  }
  const { hasstartedresolution } = registry.select(build_module_name/* store_name */.e);
  for (const relatedaction of user_permissions/* allowed_resource_actions */.co) {
    if (relatedaction === requestedaction) {
      continue;
    }
    const isalreadyresolving = hasstartedresolution("canuser", [
      relatedaction,
      resource,
      id
    ]);
    if (isalreadyresolving) {
      return;
    }
  }
  let resourcepath = null;
  if (typeof resource === "object") {
    if (!resource.kind || !resource.name) {
      throw new error("the entity resource object is not valid.");
    }
    const configs = await resolveselect.getentitiesconfig(
      resource.kind
    );
    const entityconfig = configs.find(
      (config) => config.name === resource.name && config.kind === resource.kind
    );
    if (!entityconfig) {
      return;
    }
    resourcepath = entityconfig.baseurl + (resource.id ? "/" + resource.id : "");
  } else {
    resourcepath = `/wp/v2/${resource}` + (id ? "/" + id : "");
  }
  let response;
  try {
    response = await external_wp_apifetch_default()({
      path: resourcepath,
      method: "options",
      parse: false
    });
  } catch (error) {
    return;
  }
  const permissions = (0,user_permissions/* getuserpermissionsfromallowheader */.qy)(
    response.headers?.get("allow")
  );
  registry.batch(() => {
    for (const action of user_permissions/* allowed_resource_actions */.co) {
      const key = (0,user_permissions/* getuserpermissioncachekey */.kc)(action, resource, id);
      dispatch.receiveuserpermission(key, permissions[action]);
      if (action !== requestedaction) {
        dispatch.finishresolution("canuser", [
          action,
          resource,
          id
        ]);
      }
    }
  });
};
const canusereditentityrecord = (kind, name, recordid) => async ({ dispatch }) => {
  await dispatch(canuser("update", { kind, name, id: recordid }));
};
const getautosaves = (posttype, postid) => async ({ dispatch, resolveselect }) => {
  const {
    rest_base: restbase,
    rest_namespace: restnamespace = "wp/v2",
    supports
  } = await resolveselect.getposttype(posttype);
  if (!supports?.autosave) {
    return;
  }
  const autosaves = await external_wp_apifetch_default()({
    path: `/${restnamespace}/${restbase}/${postid}/autosaves?context=edit`
  });
  if (autosaves && autosaves.length) {
    dispatch.receiveautosaves(postid, autosaves);
  }
};
const getautosave = (posttype, postid) => async ({ resolveselect }) => {
  await resolveselect.getautosaves(posttype, postid);
};
const __experimentalgetcurrentglobalstylesid = () => async ({ dispatch, resolveselect }) => {
  const activethemes = await resolveselect.getentityrecords(
    "root",
    "theme",
    { status: "active" }
  );
  const globalstylesurl = activethemes?.[0]?._links?.["wp:user-global-styles"]?.[0]?.href;
  if (!globalstylesurl) {
    return;
  }
  const matches = globalstylesurl.match(/\/(\d+)(?:\?|$)/);
  const id = matches ? number(matches[1]) : null;
  if (id) {
    dispatch.__experimentalreceivecurrentglobalstylesid(id);
  }
};
const __experimentalgetcurrentthemebaseglobalstyles = () => async ({ resolveselect, dispatch }) => {
  const currenttheme = await resolveselect.getcurrenttheme();
  const themeglobalstyles = await external_wp_apifetch_default()({
    path: `/wp/v2/global-styles/themes/${currenttheme.stylesheet}?context=view`
  });
  dispatch.__experimentalreceivethemebaseglobalstyles(
    currenttheme.stylesheet,
    themeglobalstyles
  );
};
const __experimentalgetcurrentthemeglobalstylesvariations = () => async ({ resolveselect, dispatch }) => {
  const currenttheme = await resolveselect.getcurrenttheme();
  const variations = await external_wp_apifetch_default()({
    path: `/wp/v2/global-styles/themes/${currenttheme.stylesheet}/variations?context=view`
  });
  dispatch.__experimentalreceivethemeglobalstylevariations(
    currenttheme.stylesheet,
    variations
  );
};
const getcurrentthemeglobalstylesrevisions = () => async ({ resolveselect, dispatch }) => {
  const globalstylesid = await resolveselect.__experimentalgetcurrentglobalstylesid();
  const record = globalstylesid ? await resolveselect.getentityrecord(
    "root",
    "globalstyles",
    globalstylesid
  ) : void 0;
  const revisionsurl = record?._links?.["version-history"]?.[0]?.href;
  if (revisionsurl) {
    const resetrevisions = await external_wp_apifetch_default()({
      url: revisionsurl
    });
    const revisions = resetrevisions?.map(
      (revision) => object.fromentries(
        object.entries(revision).map(([key, value]) => [
          (0,dist_es2015/* camelcase */.xq)(key),
          value
        ])
      )
    );
    dispatch.receivethemeglobalstylerevisions(
      globalstylesid,
      revisions
    );
  }
};
getcurrentthemeglobalstylesrevisions.shouldinvalidate = (action) => {
  return action.type === "save_entity_record_finish" && action.kind === "root" && !action.error && action.name === "globalstyles";
};
const getblockpatterns = () => async ({ dispatch }) => {
  const patterns = await (0,fetch/* fetchblockpatterns */.l$)();
  dispatch({ type: "receive_block_patterns", patterns });
};
const getblockpatterncategories = () => async ({ dispatch }) => {
  const categories = await external_wp_apifetch_default()({
    path: "/wp/v2/block-patterns/categories"
  });
  dispatch({ type: "receive_block_pattern_categories", categories });
};
const getuserpatterncategories = () => async ({ dispatch, resolveselect }) => {
  const patterncategories = await resolveselect.getentityrecords(
    "taxonomy",
    "wp_pattern_category",
    {
      per_page: -1,
      _fields: "id,name,description,slug",
      context: "view"
    }
  );
  const mappedpatterncategories = patterncategories?.map((usercategory) => ({
    ...usercategory,
    label: (0,external_wp_htmlentities_.decodeentities)(usercategory.name),
    name: usercategory.slug
  })) || [];
  dispatch({
    type: "receive_user_pattern_categories",
    patterncategories: mappedpatterncategories
  });
};
const getnavigationfallbackid = () => async ({ dispatch, select, registry }) => {
  const fallback = await external_wp_apifetch_default()({
    path: (0,external_wp_url_.addqueryargs)("/wp-block-editor/v1/navigation-fallback", {
      _embed: true
    })
  });
  const record = fallback?._embedded?.self;
  registry.batch(() => {
    dispatch.receivenavigationfallbackid(fallback?.id);
    if (!record) {
      return;
    }
    const existingfallbackentityrecord = select.getentityrecord(
      "posttype",
      "wp_navigation",
      fallback.id
    );
    const invalidatenavigationqueries = !existingfallbackentityrecord;
    dispatch.receiveentityrecords(
      "posttype",
      "wp_navigation",
      record,
      void 0,
      invalidatenavigationqueries
    );
    dispatch.finishresolution("getentityrecord", [
      "posttype",
      "wp_navigation",
      fallback.id
    ]);
  });
};
const getdefaulttemplateid = (query) => async ({ dispatch, registry, resolveselect }) => {
  const template = await external_wp_apifetch_default()({
    path: (0,external_wp_url_.addqueryargs)("/wp/v2/templates/lookup", query)
  });
  await resolveselect.getentitiesconfig("posttype");
  if (template?.id) {
    registry.batch(() => {
      dispatch.receivedefaulttemplateid(query, template.id);
      dispatch.receiveentityrecords("posttype", "wp_template", [
        template
      ]);
      dispatch.finishresolution("getentityrecord", [
        "posttype",
        "wp_template",
        template.id
      ]);
    });
  }
};
const getrevisions = (kind, name, recordkey, query = {}) => async ({ dispatch, registry, resolveselect }) => {
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.name === name && config.kind === kind
  );
  if (!entityconfig) {
    return;
  }
  if (query._fields) {
    query = {
      ...query,
      _fields: [
        .../* @__pure__ */ new set([
          ...(0,get_normalized_comma_separable/* default */.a)(query._fields) || [],
          entityconfig.revisionkey || entities/* default_entity_key */.c_
        ])
      ].join()
    };
  }
  const path = (0,external_wp_url_.addqueryargs)(
    entityconfig.getrevisionsurl(recordkey),
    query
  );
  let records, response;
  const meta = {};
  const ispaginated = entityconfig.supportspagination && query.per_page !== -1;
  try {
    response = await external_wp_apifetch_default()({ path, parse: !ispaginated });
  } catch (error) {
    return;
  }
  if (response) {
    if (ispaginated) {
      records = object.values(await response.json());
      meta.totalitems = parseint(
        response.headers.get("x-wp-total")
      );
    } else {
      records = object.values(response);
    }
    if (query._fields) {
      records = records.map((record) => {
        query._fields.split(",").foreach((field) => {
          if (!record.hasownproperty(field)) {
            record[field] = void 0;
          }
        });
        return record;
      });
    }
    registry.batch(() => {
      dispatch.receiverevisions(
        kind,
        name,
        recordkey,
        records,
        query,
        false,
        meta
      );
      if (!query?._fields && !query.context) {
        const key = entityconfig.key || entities/* default_entity_key */.c_;
        const resolutionsargs = records.filter((record) => record[key]).map((record) => [
          kind,
          name,
          recordkey,
          record[key]
        ]);
        dispatch.finishresolutions(
          "getrevision",
          resolutionsargs
        );
      }
    });
  }
};
getrevisions.shouldinvalidate = (action, kind, name, recordkey) => action.type === "save_entity_record_finish" && name === action.name && kind === action.kind && !action.error && recordkey === action.recordid;
const getrevision = (kind, name, recordkey, revisionkey, query) => async ({ dispatch, resolveselect }) => {
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.name === name && config.kind === kind
  );
  if (!entityconfig) {
    return;
  }
  if (query !== void 0 && query._fields) {
    query = {
      ...query,
      _fields: [
        .../* @__pure__ */ new set([
          ...(0,get_normalized_comma_separable/* default */.a)(query._fields) || [],
          entityconfig.revisionkey || entities/* default_entity_key */.c_
        ])
      ].join()
    };
  }
  const path = (0,external_wp_url_.addqueryargs)(
    entityconfig.getrevisionsurl(recordkey, revisionkey),
    query
  );
  let record;
  try {
    record = await external_wp_apifetch_default()({ path });
  } catch (error) {
    return;
  }
  if (record) {
    dispatch.receiverevisions(kind, name, recordkey, record, query);
  }
};
const getregisteredpostmeta = (posttype) => async ({ dispatch, resolveselect }) => {
  let options;
  try {
    const {
      rest_namespace: restnamespace = "wp/v2",
      rest_base: restbase
    } = await resolveselect.getposttype(posttype) || {};
    options = await external_wp_apifetch_default()({
      path: `${restnamespace}/${restbase}/?context=edit`,
      method: "options"
    });
  } catch (error) {
    return;
  }
  if (options) {
    dispatch.receiveregisteredpostmeta(
      posttype,
      options?.schema?.properties?.meta?.properties
    );
  }
};
const getentitiesconfig = (kind) => async ({ dispatch }) => {
  const loader = entities/* additionalentityconfigloaders */.l2.find(
    (l) => l.kind === kind
  );
  if (!loader) {
    return;
  }
  try {
    const configs = await loader.loadentities();
    if (!configs.length) {
      return;
    }
    dispatch.addentities(configs);
  } catch {
  }
};



/***/ }),

/***/ 7006:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  y3: () => (/* reexport */ fetchlinksuggestions),
  gr: () => (/* reexport */ experimental_fetch_url_data_default),
  l$: () => (/* binding */ fetchblockpatterns)
});

// external module: ./node_modules/camel-case/dist.es2015/index.js
var dist_es2015 = __webpack_require__(5663);
// external module: external ["wp","apifetch"]
var external_wp_apifetch_ = __webpack_require__(1455);
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_);
// external module: external ["wp","url"]
var external_wp_url_ = __webpack_require__(3832);
// external module: external ["wp","htmlentities"]
var external_wp_htmlentities_ = __webpack_require__(8537);
// external module: external ["wp","i18n"]
var external_wp_i18n_ = __webpack_require__(7723);
;// ./node_modules/@wordpress/core-data/build-module/fetch/__experimental-fetch-link-suggestions.js




async function fetchlinksuggestions(search, searchoptions = {}, editorsettings = {}) {
  const searchoptionstouse = searchoptions.isinitialsuggestions && searchoptions.initialsuggestionssearchoptions ? {
    ...searchoptions,
    ...searchoptions.initialsuggestionssearchoptions
  } : searchoptions;
  const {
    type,
    subtype,
    page,
    perpage = searchoptions.isinitialsuggestions ? 3 : 20
  } = searchoptionstouse;
  const { disablepostformats = false } = editorsettings;
  const queries = [];
  if (!type || type === "post") {
    queries.push(
      external_wp_apifetch_default()({
        path: (0,external_wp_url_.addqueryargs)("/wp/v2/search", {
          search,
          page,
          per_page: perpage,
          type: "post",
          subtype
        })
      }).then((results2) => {
        return results2.map((result) => {
          return {
            id: result.id,
            url: result.url,
            title: (0,external_wp_htmlentities_.decodeentities)(result.title || "") || (0,external_wp_i18n_.__)("(no title)"),
            type: result.subtype || result.type,
            kind: "post-type"
          };
        });
      }).catch(() => [])
      // fail by returning no results.
    );
  }
  if (!type || type === "term") {
    queries.push(
      external_wp_apifetch_default()({
        path: (0,external_wp_url_.addqueryargs)("/wp/v2/search", {
          search,
          page,
          per_page: perpage,
          type: "term",
          subtype
        })
      }).then((results2) => {
        return results2.map((result) => {
          return {
            id: result.id,
            url: result.url,
            title: (0,external_wp_htmlentities_.decodeentities)(result.title || "") || (0,external_wp_i18n_.__)("(no title)"),
            type: result.subtype || result.type,
            kind: "taxonomy"
          };
        });
      }).catch(() => [])
      // fail by returning no results.
    );
  }
  if (!disablepostformats && (!type || type === "post-format")) {
    queries.push(
      external_wp_apifetch_default()({
        path: (0,external_wp_url_.addqueryargs)("/wp/v2/search", {
          search,
          page,
          per_page: perpage,
          type: "post-format",
          subtype
        })
      }).then((results2) => {
        return results2.map((result) => {
          return {
            id: result.id,
            url: result.url,
            title: (0,external_wp_htmlentities_.decodeentities)(result.title || "") || (0,external_wp_i18n_.__)("(no title)"),
            type: result.subtype || result.type,
            kind: "taxonomy"
          };
        });
      }).catch(() => [])
      // fail by returning no results.
    );
  }
  if (!type || type === "attachment") {
    queries.push(
      external_wp_apifetch_default()({
        path: (0,external_wp_url_.addqueryargs)("/wp/v2/media", {
          search,
          page,
          per_page: perpage
        })
      }).then((results2) => {
        return results2.map((result) => {
          return {
            id: result.id,
            url: result.source_url,
            title: (0,external_wp_htmlentities_.decodeentities)(result.title.rendered || "") || (0,external_wp_i18n_.__)("(no title)"),
            type: result.type,
            kind: "media"
          };
        });
      }).catch(() => [])
      // fail by returning no results.
    );
  }
  const responses = await promise.all(queries);
  let results = responses.flat();
  results = results.filter((result) => !!result.id);
  results = sortresults(results, search);
  results = results.slice(0, perpage);
  return results;
}
function sortresults(results, search) {
  const searchtokens = tokenize(search);
  const scores = {};
  for (const result of results) {
    if (result.title) {
      const titletokens = tokenize(result.title);
      const exactmatchingtokens = titletokens.filter(
        (titletoken) => searchtokens.some(
          (searchtoken) => titletoken === searchtoken
        )
      );
      const submatchingtokens = titletokens.filter(
        (titletoken) => searchtokens.some(
          (searchtoken) => titletoken !== searchtoken && titletoken.includes(searchtoken)
        )
      );
      const exactmatchscore = exactmatchingtokens.length / titletokens.length * 10;
      const submatchscore = submatchingtokens.length / titletokens.length;
      scores[result.id] = exactmatchscore + submatchscore;
    } else {
      scores[result.id] = 0;
    }
  }
  return results.sort((a, b) => scores[b.id] - scores[a.id]);
}
function tokenize(text) {
  return text.tolowercase().match(/[\p{l}\p{n}]+/gu) || [];
}


;// ./node_modules/@wordpress/core-data/build-module/fetch/__experimental-fetch-url-data.js


const cache = /* @__pure__ */ new map();
const fetchurldata = async (url, options = {}) => {
  const endpoint = "/wp-block-editor/v1/url-details";
  const args = {
    url: (0,external_wp_url_.prependhttp)(url)
  };
  if (!(0,external_wp_url_.isurl)(url)) {
    return promise.reject(`${url} is not a valid url.`);
  }
  const protocol = (0,external_wp_url_.getprotocol)(url);
  if (!protocol || !(0,external_wp_url_.isvalidprotocol)(protocol) || !protocol.startswith("http") || !/^https?:\/\/[^\/\s]/i.test(url)) {
    return promise.reject(
      `${url} does not have a valid protocol. urls must be "http" based`
    );
  }
  if (cache.has(url)) {
    return cache.get(url);
  }
  return external_wp_apifetch_default()({
    path: (0,external_wp_url_.addqueryargs)(endpoint, args),
    ...options
  }).then((res) => {
    cache.set(url, res);
    return res;
  });
};
var experimental_fetch_url_data_default = fetchurldata;


;// ./node_modules/@wordpress/core-data/build-module/fetch/index.js




async function fetchblockpatterns() {
  const restpatterns = await external_wp_apifetch_default()({
    path: "/wp/v2/block-patterns/patterns"
  });
  if (!restpatterns) {
    return [];
  }
  return restpatterns.map(
    (pattern) => object.fromentries(
      object.entries(pattern).map(([key, value]) => [
        (0,dist_es2015/* camelcase */.xq)(key),
        value
      ])
    )
  );
}



/***/ }),

/***/ 7078:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ay: () => (/* binding */ useentityrecords),
/* harmony export */   bm: () => (/* binding */ __experimentaluseentityrecords),
/* harmony export */   pu: () => (/* binding */ useentityrecordswithpermissions)
/* harmony export */ });
/* harmony import */ var _wordpress_url__webpack_imported_module_0__ = __webpack_require__(3832);
/* harmony import */ var _wordpress_url__webpack_imported_module_0___default = /*#__pure__*/__webpack_require__.n(_wordpress_url__webpack_imported_module_0__);
/* harmony import */ var _wordpress_deprecated__webpack_imported_module_1__ = __webpack_require__(4040);
/* harmony import */ var _wordpress_deprecated__webpack_imported_module_1___default = /*#__pure__*/__webpack_require__.n(_wordpress_deprecated__webpack_imported_module_1__);
/* harmony import */ var _wordpress_data__webpack_imported_module_2__ = __webpack_require__(7143);
/* harmony import */ var _wordpress_data__webpack_imported_module_2___default = /*#__pure__*/__webpack_require__.n(_wordpress_data__webpack_imported_module_2__);
/* harmony import */ var _wordpress_element__webpack_imported_module_3__ = __webpack_require__(6087);
/* harmony import */ var _wordpress_element__webpack_imported_module_3___default = /*#__pure__*/__webpack_require__.n(_wordpress_element__webpack_imported_module_3__);
/* harmony import */ var _use_query_select__webpack_imported_module_5__ = __webpack_require__(7541);
/* harmony import */ var ___webpack_imported_module_4__ = __webpack_require__(4565);
/* harmony import */ var _lock_unlock__webpack_imported_module_7__ = __webpack_require__(6378);
/* harmony import */ var _utils__webpack_imported_module_6__ = __webpack_require__(533);








const empty_array = [];
function useentityrecords(kind, name, queryargs = {}, options = { enabled: true }) {
  const queryasstring = (0,_wordpress_url__webpack_imported_module_0__.addqueryargs)("", queryargs);
  const { data: records, ...rest } = (0,_use_query_select__webpack_imported_module_5__/* ["default"] */ .a)(
    (query) => {
      if (!options.enabled) {
        return {
          // avoiding returning a new reference on every execution.
          data: empty_array
        };
      }
      return query(___webpack_imported_module_4__.store).getentityrecords(kind, name, queryargs);
    },
    [kind, name, queryasstring, options.enabled]
  );
  const { totalitems, totalpages } = (0,_wordpress_data__webpack_imported_module_2__.useselect)(
    (select) => {
      if (!options.enabled) {
        return {
          totalitems: null,
          totalpages: null
        };
      }
      return {
        totalitems: select(___webpack_imported_module_4__.store).getentityrecordstotalitems(
          kind,
          name,
          queryargs
        ),
        totalpages: select(___webpack_imported_module_4__.store).getentityrecordstotalpages(
          kind,
          name,
          queryargs
        )
      };
    },
    [kind, name, queryasstring, options.enabled]
  );
  return {
    records,
    totalitems,
    totalpages,
    ...rest
  };
}
function __experimentaluseentityrecords(kind, name, queryargs, options) {
  _wordpress_deprecated__webpack_imported_module_1___default()(`wp.data.__experimentaluseentityrecords`, {
    alternative: "wp.data.useentityrecords",
    since: "6.1"
  });
  return useentityrecords(kind, name, queryargs, options);
}
function useentityrecordswithpermissions(kind, name, queryargs = {}, options = { enabled: true }) {
  const entityconfig = (0,_wordpress_data__webpack_imported_module_2__.useselect)(
    (select) => select(___webpack_imported_module_4__.store).getentityconfig(kind, name),
    [kind, name]
  );
  const { records: data, ...ret } = useentityrecords(
    kind,
    name,
    {
      ...queryargs,
      // if _fields is provided, we need to include _links in the request for permission caching to work.
      ...queryargs._fields ? {
        _fields: [
          .../* @__pure__ */ new set([
            ...(0,_utils__webpack_imported_module_6__/* ["default"] */ .a)(
              queryargs._fields
            ) || [],
            "_links"
          ])
        ].join()
      } : {}
    },
    options
  );
  const ids = (0,_wordpress_element__webpack_imported_module_3__.usememo)(
    () => data?.map(
      // @ts-ignore
      (record) => record[entityconfig?.key ?? "id"]
    ) ?? [],
    [data, entityconfig?.key]
  );
  const permissions = (0,_wordpress_data__webpack_imported_module_2__.useselect)(
    (select) => {
      const { getentityrecordspermissions } = (0,_lock_unlock__webpack_imported_module_7__/* .unlock */ .t)(
        select(___webpack_imported_module_4__.store)
      );
      return getentityrecordspermissions(kind, name, ids);
    },
    [ids, kind, name]
  );
  const datawithpermissions = (0,_wordpress_element__webpack_imported_module_3__.usememo)(
    () => data?.map((record, index) => ({
      // @ts-ignore
      ...record,
      permissions: permissions[index]
    })) ?? [],
    [data, permissions]
  );
  return { records: datawithpermissions, ...ret };
}



/***/ }),

/***/ 7143:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ 7314:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ lowercase)
/* harmony export */ });
/* unused harmony export localelowercase */
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


/***/ }),

/***/ 7541:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  a: () => (/* binding */ usequeryselect)
});

// unused exports: meta_selectors

// external module: external ["wp","data"]
var external_wp_data_ = __webpack_require__(7143);
;// ./node_modules/memize/dist/index.js
/**
 * memize options object.
 *
 * @typedef memizeoptions
 *
 * @property {number} [maxsize] maximum size of the cache.
 */

/**
 * internal cache entry.
 *
 * @typedef memizecachenode
 *
 * @property {?memizecachenode|undefined} [prev] previous node.
 * @property {?memizecachenode|undefined} [next] next node.
 * @property {array<*>}                   args   function arguments for cache
 *                                               entry.
 * @property {*}                          val    function result.
 */

/**
 * properties of the enhanced function for controlling cache.
 *
 * @typedef memizememoizedfunction
 *
 * @property {()=>void} clear clear the cache.
 */

/**
 * accepts a function to be memoized, and returns a new memoized function, with
 * optional options.
 *
 * @template {(...args: any[]) => any} f
 *
 * @param {f}             fn        function to memoize.
 * @param {memizeoptions} [options] options object.
 *
 * @return {((...args: parameters<f>) => returntype<f>) & memizememoizedfunction} memoized function.
 */
function memize(fn, options) {
	var size = 0;

	/** @type {?memizecachenode|undefined} */
	var head;

	/** @type {?memizecachenode|undefined} */
	var tail;

	options = options || {};

	function memoized(/* ...args */) {
		var node = head,
			len = arguments.length,
			args,
			i;

		searchcache: while (node) {
			// perform a shallow equality test to confirm that whether the node
			// under test is a candidate for the arguments passed. two arrays
			// are shallowly equal if their length matches and each entry is
			// strictly equal between the two sets. avoid abstracting to a
			// function which could incur an arguments leaking deoptimization.

			// check whether node arguments match arguments length
			if (node.args.length !== arguments.length) {
				node = node.next;
				continue;
			}

			// check whether node arguments match arguments values
			for (i = 0; i < len; i++) {
				if (node.args[i] !== arguments[i]) {
					node = node.next;
					continue searchcache;
				}
			}

			// at this point we can assume we've found a match

			// surface matched node to head if not already
			if (node !== head) {
				// as tail, shift to previous. must only shift if not also
				// head, since if both head and tail, there is no previous.
				if (node === tail) {
					tail = node.prev;
				}

				// adjust siblings to point to each other. if node was tail,
				// this also handles new tail's empty `next` assignment.
				/** @type {memizecachenode} */ (node.prev).next = node.next;
				if (node.next) {
					node.next.prev = node.prev;
				}

				node.next = head;
				node.prev = null;
				/** @type {memizecachenode} */ (head).prev = node;
				head = node;
			}

			// return immediately
			return node.val;
		}

		// no cached value found. continue to insertion phase:

		// create a copy of arguments (avoid leaking deoptimization)
		args = new array(len);
		for (i = 0; i < len; i++) {
			args[i] = arguments[i];
		}

		node = {
			args: args,

			// generate the result from original function
			val: fn.apply(null, args),
		};

		// don't need to check whether node is already head, since it would
		// have been returned above already if it was

		// shift existing head down list
		if (head) {
			head.prev = node;
			node.next = head;
		} else {
			// if no head, follows that there's no tail (at initial or reset)
			tail = node;
		}

		// trim tail if we're reached max size and are pending cache insertion
		if (size === /** @type {memizeoptions} */ (options).maxsize) {
			tail = /** @type {memizecachenode} */ (tail).prev;
			/** @type {memizecachenode} */ (tail).next = null;
		} else {
			size++;
		}

		head = node;

		return node.val;
	}

	memoized.clear = function () {
		head = null;
		tail = null;
		size = 0;
	};

	// ignore reason: there's not a clear solution to create an intersection of
	// the function with additional properties, where the goal is to retain the
	// function signature of the incoming argument and add control properties
	// on the return value.

	// @ts-ignore
	return memoized;
}



;// ./node_modules/@wordpress/core-data/build-module/hooks/memoize.js

var memoize_default = memize;


// external module: ./node_modules/@wordpress/core-data/build-module/hooks/constants.js
var constants = __webpack_require__(2859);
;// ./node_modules/@wordpress/core-data/build-module/hooks/use-query-select.js



const meta_selectors = [
  "getisresolving",
  "hasstartedresolution",
  "hasfinishedresolution",
  "isresolving",
  "getcachedresolvers"
];
function usequeryselect(mapqueryselect, deps) {
  return (0,external_wp_data_.useselect)((select, registry) => {
    const resolve = (store) => enrichselectors(select(store));
    return mapqueryselect(resolve, registry);
  }, deps);
}
const enrichselectors = memoize_default(((selectors) => {
  const resolvers = {};
  for (const selectorname in selectors) {
    if (meta_selectors.includes(selectorname)) {
      continue;
    }
    object.defineproperty(resolvers, selectorname, {
      get: () => (...args) => {
        const data = selectors[selectorname](...args);
        const resolutionstatus = selectors.getresolutionstate(
          selectorname,
          args
        )?.status;
        let status;
        switch (resolutionstatus) {
          case "resolving":
            status = constants/* status */.n.resolving;
            break;
          case "finished":
            status = constants/* status */.n.success;
            break;
          case "error":
            status = constants/* status */.n.error;
            break;
          case void 0:
            status = constants/* status */.n.idle;
            break;
        }
        return {
          data,
          status,
          isresolving: status === constants/* status */.n.resolving,
          hasstarted: status !== constants/* status */.n.idle,
          hasresolved: status === constants/* status */.n.success || status === constants/* status */.n.error
        };
      }
    });
  }
  return resolvers;
}));



/***/ }),

/***/ 7723:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ 7734:
/***/ ((module) => {

"use strict";


// do not edit .js files directly - edit src/index.jst


  var envhasbigint64array = typeof bigint64array !== 'undefined';


module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (array.isarray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }


    if ((a instanceof map) && (b instanceof map)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      for (i of a.entries())
        if (!equal(i[1], b.get(i[0]))) return false;
      return true;
    }

    if ((a instanceof set) && (b instanceof set)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      return true;
    }

    if (arraybuffer.isview(a) && arraybuffer.isview(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (a[i] !== b[i]) return false;
      return true;
    }


    if (a.constructor === regexp) return a.source === b.source && a.flags === b.flags;
    if (a.valueof !== object.prototype.valueof) return a.valueof() === b.valueof();
    if (a.tostring !== object.prototype.tostring) return a.tostring() === b.tostring();

    keys = object.keys(a);
    length = keys.length;
    if (length !== object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!object.prototype.hasownproperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both nan, false otherwise
  return a!==a && b!==b;
};


/***/ }),

/***/ 7826:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ privateapis)
/* harmony export */ });
/* harmony import */ var _hooks_use_entity_records__webpack_imported_module_1__ = __webpack_require__(7078);
/* harmony import */ var _utils__webpack_imported_module_2__ = __webpack_require__(5101);
/* harmony import */ var _lock_unlock__webpack_imported_module_0__ = __webpack_require__(6378);



const privateapis = {};
(0,_lock_unlock__webpack_imported_module_0__/* .lock */ .s)(privateapis, {
  useentityrecordswithpermissions: _hooks_use_entity_records__webpack_imported_module_1__/* .useentityrecordswithpermissions */ .pu,
  receive_intermediate_results: _utils__webpack_imported_module_2__/* .receive_intermediate_results */ .z
});



/***/ }),

/***/ 8368:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  __experimentalgetcurrentglobalstylesid: () => (/* binding */ __experimentalgetcurrentglobalstylesid),
  __experimentalgetcurrentthemebaseglobalstyles: () => (/* binding */ __experimentalgetcurrentthemebaseglobalstyles),
  __experimentalgetcurrentthemeglobalstylesvariations: () => (/* binding */ __experimentalgetcurrentthemeglobalstylesvariations),
  __experimentalgetdirtyentityrecords: () => (/* binding */ __experimentalgetdirtyentityrecords),
  __experimentalgetentitiesbeingsaved: () => (/* binding */ __experimentalgetentitiesbeingsaved),
  __experimentalgetentityrecordnoresolver: () => (/* binding */ __experimentalgetentityrecordnoresolver),
  canuser: () => (/* binding */ canuser),
  canusereditentityrecord: () => (/* binding */ canusereditentityrecord),
  getauthors: () => (/* binding */ getauthors),
  getautosave: () => (/* binding */ getautosave),
  getautosaves: () => (/* binding */ getautosaves),
  getblockpatterncategories: () => (/* binding */ getblockpatterncategories),
  getblockpatterns: () => (/* binding */ getblockpatterns),
  getcurrenttheme: () => (/* binding */ getcurrenttheme),
  getcurrentthemeglobalstylesrevisions: () => (/* binding */ getcurrentthemeglobalstylesrevisions),
  getcurrentuser: () => (/* binding */ getcurrentuser),
  getdefaulttemplateid: () => (/* binding */ getdefaulttemplateid),
  geteditedentityrecord: () => (/* binding */ geteditedentityrecord),
  getembedpreview: () => (/* binding */ getembedpreview),
  getentitiesbykind: () => (/* binding */ getentitiesbykind),
  getentitiesconfig: () => (/* binding */ getentitiesconfig),
  getentity: () => (/* binding */ getentity),
  getentityconfig: () => (/* binding */ getentityconfig),
  getentityrecord: () => (/* binding */ getentityrecord),
  getentityrecordedits: () => (/* binding */ getentityrecordedits),
  getentityrecordnontransientedits: () => (/* binding */ getentityrecordnontransientedits),
  getentityrecords: () => (/* binding */ getentityrecords),
  getentityrecordstotalitems: () => (/* binding */ getentityrecordstotalitems),
  getentityrecordstotalpages: () => (/* binding */ getentityrecordstotalpages),
  getlastentitydeleteerror: () => (/* binding */ getlastentitydeleteerror),
  getlastentitysaveerror: () => (/* binding */ getlastentitysaveerror),
  getrawentityrecord: () => (/* binding */ getrawentityrecord),
  getredoedit: () => (/* binding */ getredoedit),
  getreferencebydistinctedits: () => (/* binding */ getreferencebydistinctedits),
  getrevision: () => (/* binding */ getrevision),
  getrevisions: () => (/* binding */ getrevisions),
  getthemesupports: () => (/* binding */ getthemesupports),
  getundoedit: () => (/* binding */ getundoedit),
  getuserpatterncategories: () => (/* binding */ getuserpatterncategories),
  getuserqueryresults: () => (/* binding */ getuserqueryresults),
  haseditsforentityrecord: () => (/* binding */ haseditsforentityrecord),
  hasentityrecord: () => (/* binding */ hasentityrecord),
  hasentityrecords: () => (/* binding */ hasentityrecords),
  hasfetchedautosaves: () => (/* binding */ hasfetchedautosaves),
  hasredo: () => (/* binding */ hasredo),
  hasundo: () => (/* binding */ hasundo),
  isautosavingentityrecord: () => (/* binding */ isautosavingentityrecord),
  isdeletingentityrecord: () => (/* binding */ isdeletingentityrecord),
  ispreviewembedfallback: () => (/* binding */ ispreviewembedfallback),
  isrequestingembedpreview: () => (/* binding */ isrequestingembedpreview),
  issavingentityrecord: () => (/* binding */ issavingentityrecord)
});

// external module: external ["wp","data"]
var external_wp_data_ = __webpack_require__(7143);
// external module: external ["wp","url"]
var external_wp_url_ = __webpack_require__(3832);
// external module: external ["wp","deprecated"]
var external_wp_deprecated_ = __webpack_require__(4040);
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_);
// external module: ./node_modules/@wordpress/core-data/build-module/name.js
var build_module_name = __webpack_require__(2278);
// external module: ./node_modules/equivalent-key-map/equivalent-key-map.js
var equivalent_key_map = __webpack_require__(3249);
var equivalent_key_map_default = /*#__pure__*/__webpack_require__.n(equivalent_key_map);
// external module: ./node_modules/@wordpress/core-data/build-module/queried-data/get-query-parts.js + 1 modules
var get_query_parts = __webpack_require__(4027);
// external module: ./node_modules/@wordpress/core-data/build-module/utils/set-nested-value.js
var set_nested_value = __webpack_require__(5003);
;// ./node_modules/@wordpress/core-data/build-module/queried-data/selectors.js




const querieditemscachebystate = /* @__pure__ */ new weakmap();
function getquerieditemsuncached(state, query) {
  const { stablekey, page, perpage, include, fields, context } = (0,get_query_parts/* default */.a)(query);
  let itemids;
  if (state.queries?.[context]?.[stablekey]) {
    itemids = state.queries[context][stablekey].itemids;
  }
  if (!itemids) {
    return null;
  }
  const startoffset = perpage === -1 ? 0 : (page - 1) * perpage;
  const endoffset = perpage === -1 ? itemids.length : math.min(startoffset + perpage, itemids.length);
  const items = [];
  for (let i = startoffset; i < endoffset; i++) {
    const itemid = itemids[i];
    if (array.isarray(include) && !include.includes(itemid)) {
      continue;
    }
    if (itemid === void 0) {
      continue;
    }
    if (!state.items[context]?.hasownproperty(itemid)) {
      return null;
    }
    const item = state.items[context][itemid];
    let filtereditem;
    if (array.isarray(fields)) {
      filtereditem = {};
      for (let f = 0; f < fields.length; f++) {
        const field = fields[f].split(".");
        let value = item;
        field.foreach((fieldname) => {
          value = value?.[fieldname];
        });
        (0,set_nested_value/* default */.a)(filtereditem, field, value);
      }
    } else {
      if (!state.itemiscomplete[context]?.[itemid]) {
        return null;
      }
      filtereditem = item;
    }
    items.push(filtereditem);
  }
  return items;
}
const getquerieditems = (0,external_wp_data_.createselector)((state, query = {}) => {
  let querieditemscache = querieditemscachebystate.get(state);
  if (querieditemscache) {
    const querieditems = querieditemscache.get(query);
    if (querieditems !== void 0) {
      return querieditems;
    }
  } else {
    querieditemscache = new (equivalent_key_map_default())();
    querieditemscachebystate.set(state, querieditemscache);
  }
  const items = getquerieditemsuncached(state, query);
  querieditemscache.set(query, items);
  return items;
});
function getqueriedtotalitems(state, query = {}) {
  const { stablekey, context } = (0,get_query_parts/* default */.a)(query);
  return state.queries?.[context]?.[stablekey]?.meta?.totalitems ?? null;
}
function getqueriedtotalpages(state, query = {}) {
  const { stablekey, context } = (0,get_query_parts/* default */.a)(query);
  return state.queries?.[context]?.[stablekey]?.meta?.totalpages ?? null;
}


// external module: ./node_modules/@wordpress/core-data/build-module/entities.js + 2 modules
var entities = __webpack_require__(5914);
// external module: ./node_modules/@wordpress/core-data/build-module/utils/get-normalized-comma-separable.js
var get_normalized_comma_separable = __webpack_require__(533);
;// ./node_modules/@wordpress/core-data/build-module/utils/is-numeric-id.js
function isnumericid(id) {
  return /^\s*\d+\s*$/.test(id);
}


;// ./node_modules/@wordpress/core-data/build-module/utils/is-raw-attribute.js
function israwattribute(entity, attribute) {
  return (entity.rawattributes || []).includes(attribute);
}


// external module: ./node_modules/@wordpress/core-data/build-module/utils/user-permissions.js
var user_permissions = __webpack_require__(2577);
// external module: ./node_modules/@wordpress/core-data/build-module/utils/log-entity-deprecation.js
var log_entity_deprecation = __webpack_require__(9410);
;// ./node_modules/@wordpress/core-data/build-module/selectors.js








const empty_object = {};
const isrequestingembedpreview = (0,external_wp_data_.createregistryselector)(
  (select) => (state, url) => {
    return select(build_module_name/* store_name */.e).isresolving("getembedpreview", [
      url
    ]);
  }
);
function getauthors(state, query) {
  external_wp_deprecated_default()("select( 'core' ).getauthors()", {
    since: "5.9",
    alternative: "select( 'core' ).getusers({ who: 'authors' })"
  });
  const path = (0,external_wp_url_.addqueryargs)(
    "/wp/v2/users/?who=authors&per_page=100",
    query
  );
  return getuserqueryresults(state, path);
}
function getcurrentuser(state) {
  return state.currentuser;
}
const getuserqueryresults = (0,external_wp_data_.createselector)(
  (state, queryid) => {
    const queryresults = state.users.queries[queryid] ?? [];
    return queryresults.map((id) => state.users.byid[id]);
  },
  (state, queryid) => [
    state.users.queries[queryid],
    state.users.byid
  ]
);
function getentitiesbykind(state, kind) {
  external_wp_deprecated_default()("wp.data.select( 'core' ).getentitiesbykind()", {
    since: "6.0",
    alternative: "wp.data.select( 'core' ).getentitiesconfig()"
  });
  return getentitiesconfig(state, kind);
}
const getentitiesconfig = (0,external_wp_data_.createselector)(
  (state, kind) => state.entities.config.filter((entity) => entity.kind === kind),
  /* eslint-disable @typescript-eslint/no-unused-vars */
  (state, kind) => state.entities.config
  /* eslint-enable @typescript-eslint/no-unused-vars */
);
function getentity(state, kind, name) {
  external_wp_deprecated_default()("wp.data.select( 'core' ).getentity()", {
    since: "6.0",
    alternative: "wp.data.select( 'core' ).getentityconfig()"
  });
  return getentityconfig(state, kind, name);
}
function getentityconfig(state, kind, name) {
  (0,log_entity_deprecation/* default */.a)(kind, name, "getentityconfig");
  return state.entities.config?.find(
    (config) => config.kind === kind && config.name === name
  );
}
const getentityrecord = (0,external_wp_data_.createselector)(
  ((state, kind, name, key, query) => {
    (0,log_entity_deprecation/* default */.a)(kind, name, "getentityrecord");
    const queriedstate = state.entities.records?.[kind]?.[name]?.querieddata;
    if (!queriedstate) {
      return void 0;
    }
    const context = query?.context ?? "default";
    if (!query || !query._fields) {
      if (!queriedstate.itemiscomplete[context]?.[key]) {
        return void 0;
      }
      return queriedstate.items[context][key];
    }
    const item = queriedstate.items[context]?.[key];
    if (!item) {
      return item;
    }
    const filtereditem = {};
    const fields = (0,get_normalized_comma_separable/* default */.a)(query._fields) ?? [];
    for (let f = 0; f < fields.length; f++) {
      const field = fields[f].split(".");
      let value = item;
      field.foreach((fieldname) => {
        value = value?.[fieldname];
      });
      (0,set_nested_value/* default */.a)(filtereditem, field, value);
    }
    return filtereditem;
  }),
  (state, kind, name, recordid, query) => {
    const context = query?.context ?? "default";
    const queriedstate = state.entities.records?.[kind]?.[name]?.querieddata;
    return [
      queriedstate?.items[context]?.[recordid],
      queriedstate?.itemiscomplete[context]?.[recordid]
    ];
  }
);
getentityrecord.__unstablenormalizeargs = (args) => {
  const newargs = [...args];
  const recordkey = newargs?.[2];
  newargs[2] = isnumericid(recordkey) ? number(recordkey) : recordkey;
  return newargs;
};
function hasentityrecord(state, kind, name, key, query) {
  const queriedstate = state.entities.records?.[kind]?.[name]?.querieddata;
  if (!queriedstate) {
    return false;
  }
  const context = query?.context ?? "default";
  if (!query || !query._fields) {
    return !!queriedstate.itemiscomplete[context]?.[key];
  }
  const item = queriedstate.items[context]?.[key];
  if (!item) {
    return false;
  }
  const fields = (0,get_normalized_comma_separable/* default */.a)(query._fields) ?? [];
  for (let i = 0; i < fields.length; i++) {
    const path = fields[i].split(".");
    let value = item;
    for (let p = 0; p < path.length; p++) {
      const part = path[p];
      if (!value || !object.hasown(value, part)) {
        return false;
      }
      value = value[part];
    }
  }
  return true;
}
function __experimentalgetentityrecordnoresolver(state, kind, name, key) {
  return getentityrecord(state, kind, name, key);
}
const getrawentityrecord = (0,external_wp_data_.createselector)(
  (state, kind, name, key) => {
    (0,log_entity_deprecation/* default */.a)(kind, name, "getrawentityrecord");
    const record = getentityrecord(
      state,
      kind,
      name,
      key
    );
    return record && object.keys(record).reduce((accumulator, _key) => {
      if (israwattribute(getentityconfig(state, kind, name), _key)) {
        accumulator[_key] = record[_key]?.raw !== void 0 ? record[_key]?.raw : record[_key];
      } else {
        accumulator[_key] = record[_key];
      }
      return accumulator;
    }, {});
  },
  (state, kind, name, recordid, query) => {
    const context = query?.context ?? "default";
    return [
      state.entities.config,
      state.entities.records?.[kind]?.[name]?.querieddata?.items[context]?.[recordid],
      state.entities.records?.[kind]?.[name]?.querieddata?.itemiscomplete[context]?.[recordid]
    ];
  }
);
function hasentityrecords(state, kind, name, query) {
  (0,log_entity_deprecation/* default */.a)(kind, name, "hasentityrecords");
  return array.isarray(getentityrecords(state, kind, name, query));
}
const getentityrecords = ((state, kind, name, query) => {
  (0,log_entity_deprecation/* default */.a)(kind, name, "getentityrecords");
  const queriedstate = state.entities.records?.[kind]?.[name]?.querieddata;
  if (!queriedstate) {
    return null;
  }
  return getquerieditems(queriedstate, query);
});
const getentityrecordstotalitems = (state, kind, name, query) => {
  (0,log_entity_deprecation/* default */.a)(kind, name, "getentityrecordstotalitems");
  const queriedstate = state.entities.records?.[kind]?.[name]?.querieddata;
  if (!queriedstate) {
    return null;
  }
  return getqueriedtotalitems(queriedstate, query);
};
const getentityrecordstotalpages = (state, kind, name, query) => {
  (0,log_entity_deprecation/* default */.a)(kind, name, "getentityrecordstotalpages");
  const queriedstate = state.entities.records?.[kind]?.[name]?.querieddata;
  if (!queriedstate) {
    return null;
  }
  if (query?.per_page === -1) {
    return 1;
  }
  const totalitems = getqueriedtotalitems(queriedstate, query);
  if (!totalitems) {
    return totalitems;
  }
  if (!query?.per_page) {
    return getqueriedtotalpages(queriedstate, query);
  }
  return math.ceil(totalitems / query.per_page);
};
const __experimentalgetdirtyentityrecords = (0,external_wp_data_.createselector)(
  (state) => {
    const {
      entities: { records }
    } = state;
    const dirtyrecords = [];
    object.keys(records).foreach((kind) => {
      object.keys(records[kind]).foreach((name) => {
        const primarykeys = object.keys(records[kind][name].edits).filter(
          (primarykey) => (
            // the entity record must exist (not be deleted),
            // and it must have edits.
            getentityrecord(state, kind, name, primarykey) && haseditsforentityrecord(state, kind, name, primarykey)
          )
        );
        if (primarykeys.length) {
          const entityconfig = getentityconfig(state, kind, name);
          primarykeys.foreach((primarykey) => {
            const entityrecord = geteditedentityrecord(
              state,
              kind,
              name,
              primarykey
            );
            dirtyrecords.push({
              // we avoid using primarykey because it's transformed into a string
              // when it's used as an object key.
              key: entityrecord ? entityrecord[entityconfig.key || entities/* default_entity_key */.c_] : void 0,
              title: entityconfig?.gettitle?.(entityrecord) || "",
              name,
              kind
            });
          });
        }
      });
    });
    return dirtyrecords;
  },
  (state) => [state.entities.records]
);
const __experimentalgetentitiesbeingsaved = (0,external_wp_data_.createselector)(
  (state) => {
    const {
      entities: { records }
    } = state;
    const recordsbeingsaved = [];
    object.keys(records).foreach((kind) => {
      object.keys(records[kind]).foreach((name) => {
        const primarykeys = object.keys(records[kind][name].saving).filter(
          (primarykey) => issavingentityrecord(state, kind, name, primarykey)
        );
        if (primarykeys.length) {
          const entityconfig = getentityconfig(state, kind, name);
          primarykeys.foreach((primarykey) => {
            const entityrecord = geteditedentityrecord(
              state,
              kind,
              name,
              primarykey
            );
            recordsbeingsaved.push({
              // we avoid using primarykey because it's transformed into a string
              // when it's used as an object key.
              key: entityrecord ? entityrecord[entityconfig.key || entities/* default_entity_key */.c_] : void 0,
              title: entityconfig?.gettitle?.(entityrecord) || "",
              name,
              kind
            });
          });
        }
      });
    });
    return recordsbeingsaved;
  },
  (state) => [state.entities.records]
);
function getentityrecordedits(state, kind, name, recordid) {
  (0,log_entity_deprecation/* default */.a)(kind, name, "getentityrecordedits");
  return state.entities.records?.[kind]?.[name]?.edits?.[recordid];
}
const getentityrecordnontransientedits = (0,external_wp_data_.createselector)(
  (state, kind, name, recordid) => {
    (0,log_entity_deprecation/* default */.a)(kind, name, "getentityrecordnontransientedits");
    const { transientedits } = getentityconfig(state, kind, name) || {};
    const edits = getentityrecordedits(state, kind, name, recordid) || {};
    if (!transientedits) {
      return edits;
    }
    return object.keys(edits).reduce((acc, key) => {
      if (!transientedits[key]) {
        acc[key] = edits[key];
      }
      return acc;
    }, {});
  },
  (state, kind, name, recordid) => [
    state.entities.config,
    state.entities.records?.[kind]?.[name]?.edits?.[recordid]
  ]
);
function haseditsforentityrecord(state, kind, name, recordid) {
  (0,log_entity_deprecation/* default */.a)(kind, name, "haseditsforentityrecord");
  return issavingentityrecord(state, kind, name, recordid) || object.keys(
    getentityrecordnontransientedits(state, kind, name, recordid)
  ).length > 0;
}
const geteditedentityrecord = (0,external_wp_data_.createselector)(
  (state, kind, name, recordid) => {
    (0,log_entity_deprecation/* default */.a)(kind, name, "geteditedentityrecord");
    const raw = getrawentityrecord(state, kind, name, recordid);
    const edited = getentityrecordedits(state, kind, name, recordid);
    if (!raw && !edited) {
      return false;
    }
    return {
      ...raw,
      ...edited
    };
  },
  (state, kind, name, recordid, query) => {
    const context = query?.context ?? "default";
    return [
      state.entities.config,
      state.entities.records?.[kind]?.[name]?.querieddata.items[context]?.[recordid],
      state.entities.records?.[kind]?.[name]?.querieddata.itemiscomplete[context]?.[recordid],
      state.entities.records?.[kind]?.[name]?.edits?.[recordid]
    ];
  }
);
function isautosavingentityrecord(state, kind, name, recordid) {
  (0,log_entity_deprecation/* default */.a)(kind, name, "isautosavingentityrecord");
  const { pending, isautosave } = state.entities.records?.[kind]?.[name]?.saving?.[recordid] ?? {};
  return boolean(pending && isautosave);
}
function issavingentityrecord(state, kind, name, recordid) {
  (0,log_entity_deprecation/* default */.a)(kind, name, "issavingentityrecord");
  return state.entities.records?.[kind]?.[name]?.saving?.[recordid]?.pending ?? false;
}
function isdeletingentityrecord(state, kind, name, recordid) {
  (0,log_entity_deprecation/* default */.a)(kind, name, "isdeletingentityrecord");
  return state.entities.records?.[kind]?.[name]?.deleting?.[recordid]?.pending ?? false;
}
function getlastentitysaveerror(state, kind, name, recordid) {
  (0,log_entity_deprecation/* default */.a)(kind, name, "getlastentitysaveerror");
  return state.entities.records?.[kind]?.[name]?.saving?.[recordid]?.error;
}
function getlastentitydeleteerror(state, kind, name, recordid) {
  (0,log_entity_deprecation/* default */.a)(kind, name, "getlastentitydeleteerror");
  return state.entities.records?.[kind]?.[name]?.deleting?.[recordid]?.error;
}
function getundoedit(state) {
  external_wp_deprecated_default()("select( 'core' ).getundoedit()", {
    since: "6.3"
  });
  return void 0;
}
function getredoedit(state) {
  external_wp_deprecated_default()("select( 'core' ).getredoedit()", {
    since: "6.3"
  });
  return void 0;
}
function hasundo(state) {
  return state.undomanager.hasundo();
}
function hasredo(state) {
  return state.undomanager.hasredo();
}
function getcurrenttheme(state) {
  if (!state.currenttheme) {
    return null;
  }
  return getentityrecord(state, "root", "theme", state.currenttheme);
}
function __experimentalgetcurrentglobalstylesid(state) {
  return state.currentglobalstylesid;
}
function getthemesupports(state) {
  return getcurrenttheme(state)?.theme_supports ?? empty_object;
}
function getembedpreview(state, url) {
  return state.embedpreviews[url];
}
function ispreviewembedfallback(state, url) {
  const preview = state.embedpreviews[url];
  const oembedlinkcheck = '<a href="' + url + '">' + url + "</a>";
  if (!preview) {
    return false;
  }
  return preview.html === oembedlinkcheck;
}
function canuser(state, action, resource, id) {
  const isentity = typeof resource === "object";
  if (isentity && (!resource.kind || !resource.name)) {
    return false;
  }
  if (isentity) {
    (0,log_entity_deprecation/* default */.a)(resource.kind, resource.name, "canuser");
  }
  const key = (0,user_permissions/* getuserpermissioncachekey */.kc)(action, resource, id);
  return state.userpermissions[key];
}
function canusereditentityrecord(state, kind, name, recordid) {
  external_wp_deprecated_default()(`wp.data.select( 'core' ).canusereditentityrecord()`, {
    since: "6.7",
    alternative: `wp.data.select( 'core' ).canuser( 'update', { kind, name, id } )`
  });
  return canuser(state, "update", { kind, name, id: recordid });
}
function getautosaves(state, posttype, postid) {
  return state.autosaves[postid];
}
function getautosave(state, posttype, postid, authorid) {
  if (authorid === void 0) {
    return;
  }
  const autosaves = state.autosaves[postid];
  return autosaves?.find(
    (autosave) => autosave.author === authorid
  );
}
const hasfetchedautosaves = (0,external_wp_data_.createregistryselector)(
  (select) => (state, posttype, postid) => {
    return select(build_module_name/* store_name */.e).hasfinishedresolution("getautosaves", [
      posttype,
      postid
    ]);
  }
);
function getreferencebydistinctedits(state) {
  return state.editsreference;
}
function __experimentalgetcurrentthemebaseglobalstyles(state) {
  const currenttheme = getcurrenttheme(state);
  if (!currenttheme) {
    return null;
  }
  return state.themebaseglobalstyles[currenttheme.stylesheet];
}
function __experimentalgetcurrentthemeglobalstylesvariations(state) {
  const currenttheme = getcurrenttheme(state);
  if (!currenttheme) {
    return null;
  }
  return state.themeglobalstylevariations[currenttheme.stylesheet];
}
function getblockpatterns(state) {
  return state.blockpatterns;
}
function getblockpatterncategories(state) {
  return state.blockpatterncategories;
}
function getuserpatterncategories(state) {
  return state.userpatterncategories;
}
function getcurrentthemeglobalstylesrevisions(state) {
  external_wp_deprecated_default()("select( 'core' ).getcurrentthemeglobalstylesrevisions()", {
    since: "6.5.0",
    alternative: "select( 'core' ).getrevisions( 'root', 'globalstyles', ${ recordkey } )"
  });
  const currentglobalstylesid = __experimentalgetcurrentglobalstylesid(state);
  if (!currentglobalstylesid) {
    return null;
  }
  return state.themeglobalstylerevisions[currentglobalstylesid];
}
function getdefaulttemplateid(state, query) {
  return state.defaulttemplates[json.stringify(query)];
}
const getrevisions = (state, kind, name, recordkey, query) => {
  (0,log_entity_deprecation/* default */.a)(kind, name, "getrevisions");
  const queriedstaterevisions = state.entities.records?.[kind]?.[name]?.revisions?.[recordkey];
  if (!queriedstaterevisions) {
    return null;
  }
  return getquerieditems(queriedstaterevisions, query);
};
const getrevision = (0,external_wp_data_.createselector)(
  (state, kind, name, recordkey, revisionkey, query) => {
    (0,log_entity_deprecation/* default */.a)(kind, name, "getrevision");
    const queriedstate = state.entities.records?.[kind]?.[name]?.revisions?.[recordkey];
    if (!queriedstate) {
      return void 0;
    }
    const context = query?.context ?? "default";
    if (!query || !query._fields) {
      if (!queriedstate.itemiscomplete[context]?.[revisionkey]) {
        return void 0;
      }
      return queriedstate.items[context][revisionkey];
    }
    const item = queriedstate.items[context]?.[revisionkey];
    if (!item) {
      return item;
    }
    const filtereditem = {};
    const fields = (0,get_normalized_comma_separable/* default */.a)(query._fields) ?? [];
    for (let f = 0; f < fields.length; f++) {
      const field = fields[f].split(".");
      let value = item;
      field.foreach((fieldname) => {
        value = value?.[fieldname];
      });
      (0,set_nested_value/* default */.a)(filtereditem, field, value);
    }
    return filtereditem;
  },
  (state, kind, name, recordkey, revisionkey, query) => {
    const context = query?.context ?? "default";
    const queriedstate = state.entities.records?.[kind]?.[name]?.revisions?.[recordkey];
    return [
      queriedstate?.items?.[context]?.[revisionkey],
      queriedstate?.itemiscomplete?.[context]?.[revisionkey]
    ];
  }
);



/***/ }),

/***/ 8537:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["htmlentities"];

/***/ }),

/***/ 8582:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ dynamicselectors),
/* harmony export */   b: () => (/* binding */ dynamicactions)
/* harmony export */ });
let dynamicactions;
let dynamicselectors;



/***/ }),

/***/ 8741:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getblockpatternsforposttype: () => (/* binding */ getblockpatternsforposttype),
/* harmony export */   getentityrecordpermissions: () => (/* binding */ getentityrecordpermissions),
/* harmony export */   getentityrecordspermissions: () => (/* binding */ getentityrecordspermissions),
/* harmony export */   gethomepage: () => (/* binding */ gethomepage),
/* harmony export */   getnavigationfallbackid: () => (/* binding */ getnavigationfallbackid),
/* harmony export */   getpostspageid: () => (/* binding */ getpostspageid),
/* harmony export */   getregisteredpostmeta: () => (/* binding */ getregisteredpostmeta),
/* harmony export */   gettemplateid: () => (/* binding */ gettemplateid),
/* harmony export */   getundomanager: () => (/* binding */ getundomanager)
/* harmony export */ });
/* harmony import */ var _wordpress_data__webpack_imported_module_0__ = __webpack_require__(7143);
/* harmony import */ var _wordpress_data__webpack_imported_module_0___default = /*#__pure__*/__webpack_require__.n(_wordpress_data__webpack_imported_module_0__);
/* harmony import */ var _selectors__webpack_imported_module_3__ = __webpack_require__(8368);
/* harmony import */ var _name__webpack_imported_module_1__ = __webpack_require__(2278);
/* harmony import */ var _lock_unlock__webpack_imported_module_4__ = __webpack_require__(6378);
/* harmony import */ var _utils_log_entity_deprecation__webpack_imported_module_2__ = __webpack_require__(9410);





function getundomanager(state) {
  return state.undomanager;
}
function getnavigationfallbackid(state) {
  return state.navigationfallbackid;
}
const getblockpatternsforposttype = (0,_wordpress_data__webpack_imported_module_0__.createregistryselector)(
  (select) => (0,_wordpress_data__webpack_imported_module_0__.createselector)(
    (state, posttype) => select(_name__webpack_imported_module_1__/* .store_name */ .e).getblockpatterns().filter(
      ({ posttypes }) => !posttypes || array.isarray(posttypes) && posttypes.includes(posttype)
    ),
    () => [select(_name__webpack_imported_module_1__/* .store_name */ .e).getblockpatterns()]
  )
);
const getentityrecordspermissions = (0,_wordpress_data__webpack_imported_module_0__.createregistryselector)(
  (select) => (0,_wordpress_data__webpack_imported_module_0__.createselector)(
    (state, kind, name, ids) => {
      const normalizedids = array.isarray(ids) ? ids : [ids];
      return normalizedids.map((id) => ({
        delete: select(_name__webpack_imported_module_1__/* .store_name */ .e).canuser("delete", {
          kind,
          name,
          id
        }),
        update: select(_name__webpack_imported_module_1__/* .store_name */ .e).canuser("update", {
          kind,
          name,
          id
        })
      }));
    },
    (state) => [state.userpermissions]
  )
);
function getentityrecordpermissions(state, kind, name, id) {
  (0,_utils_log_entity_deprecation__webpack_imported_module_2__/* ["default"] */ .a)(kind, name, "getentityrecordpermissions");
  return getentityrecordspermissions(state, kind, name, id)[0];
}
function getregisteredpostmeta(state, posttype) {
  return state.registeredpostmeta?.[posttype] ?? {};
}
function normalizepageid(value) {
  if (!value || !["number", "string"].includes(typeof value)) {
    return null;
  }
  if (number(value) === 0) {
    return null;
  }
  return value.tostring();
}
const gethomepage = (0,_wordpress_data__webpack_imported_module_0__.createregistryselector)(
  (select) => (0,_wordpress_data__webpack_imported_module_0__.createselector)(
    () => {
      const sitedata = select(_name__webpack_imported_module_1__/* .store_name */ .e).getentityrecord(
        "root",
        "__unstablebase"
      );
      if (!sitedata) {
        return null;
      }
      const homepageid = sitedata?.show_on_front === "page" ? normalizepageid(sitedata.page_on_front) : null;
      if (homepageid) {
        return { posttype: "page", postid: homepageid };
      }
      const frontpagetemplateid = select(
        _name__webpack_imported_module_1__/* .store_name */ .e
      ).getdefaulttemplateid({
        slug: "front-page"
      });
      if (!frontpagetemplateid) {
        return null;
      }
      return { posttype: "wp_template", postid: frontpagetemplateid };
    },
    (state) => [
      (0,_selectors__webpack_imported_module_3__.getentityrecord)(state, "root", "__unstablebase"),
      (0,_selectors__webpack_imported_module_3__.getdefaulttemplateid)(state, {
        slug: "front-page"
      })
    ]
  )
);
const getpostspageid = (0,_wordpress_data__webpack_imported_module_0__.createregistryselector)((select) => () => {
  const sitedata = select(_name__webpack_imported_module_1__/* .store_name */ .e).getentityrecord(
    "root",
    "__unstablebase"
  );
  return sitedata?.show_on_front === "page" ? normalizepageid(sitedata.page_for_posts) : null;
});
const gettemplateid = (0,_wordpress_data__webpack_imported_module_0__.createregistryselector)(
  (select) => (state, posttype, postid) => {
    const homepage = (0,_lock_unlock__webpack_imported_module_4__/* .unlock */ .t)(select(_name__webpack_imported_module_1__/* .store_name */ .e)).gethomepage();
    if (!homepage) {
      return;
    }
    if (posttype === "page" && posttype === homepage?.posttype && postid.tostring() === homepage?.postid) {
      const templates = select(_name__webpack_imported_module_1__/* .store_name */ .e).getentityrecords(
        "posttype",
        "wp_template",
        {
          per_page: -1
        }
      );
      if (!templates) {
        return;
      }
      const id = templates.find(({ slug }) => slug === "front-page")?.id;
      if (id) {
        return id;
      }
    }
    const editedentity = select(_name__webpack_imported_module_1__/* .store_name */ .e).geteditedentityrecord(
      "posttype",
      posttype,
      postid
    );
    if (!editedentity) {
      return;
    }
    const postspageid = (0,_lock_unlock__webpack_imported_module_4__/* .unlock */ .t)(select(_name__webpack_imported_module_1__/* .store_name */ .e)).getpostspageid();
    if (posttype === "page" && postspageid === postid.tostring()) {
      return select(_name__webpack_imported_module_1__/* .store_name */ .e).getdefaulttemplateid({
        slug: "home"
      });
    }
    const currenttemplateslug = editedentity.template;
    if (currenttemplateslug) {
      const currenttemplate = select(_name__webpack_imported_module_1__/* .store_name */ .e).getentityrecords("posttype", "wp_template", {
        per_page: -1
      })?.find(({ slug }) => slug === currenttemplateslug);
      if (currenttemplate) {
        return currenttemplate.id;
      }
    }
    let slugtocheck;
    if (editedentity.slug) {
      slugtocheck = posttype === "page" ? `${posttype}-${editedentity.slug}` : `single-${posttype}-${editedentity.slug}`;
    } else {
      slugtocheck = posttype === "page" ? "page" : `single-${posttype}`;
    }
    return select(_name__webpack_imported_module_1__/* .store_name */ .e).getdefaulttemplateid({
      slug: slugtocheck
    });
  }
);



/***/ }),

/***/ 8843:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ entitycontext)
/* harmony export */ });
/* harmony import */ var _wordpress_element__webpack_imported_module_0__ = __webpack_require__(6087);
/* harmony import */ var _wordpress_element__webpack_imported_module_0___default = /*#__pure__*/__webpack_require__.n(_wordpress_element__webpack_imported_module_0__);

const entitycontext = (0,_wordpress_element__webpack_imported_module_0__.createcontext)({});
entitycontext.displayname = "entitycontext";



/***/ }),

/***/ 9410:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ logentitydeprecation)
/* harmony export */ });
/* harmony import */ var _wordpress_deprecated__webpack_imported_module_0__ = __webpack_require__(4040);
/* harmony import */ var _wordpress_deprecated__webpack_imported_module_0___default = /*#__pure__*/__webpack_require__.n(_wordpress_deprecated__webpack_imported_module_0__);
/* harmony import */ var _entities__webpack_imported_module_1__ = __webpack_require__(5914);


let loggedalready = false;
function logentitydeprecation(kind, name, functionname, {
  alternativefunctionname,
  isshorthandselector = false
} = {}) {
  const deprecation = _entities__webpack_imported_module_1__/* .deprecatedentities */ .tk[kind]?.[name];
  if (!deprecation) {
    return;
  }
  if (!loggedalready) {
    const { alternative } = deprecation;
    const message = isshorthandselector ? `'${functionname}'` : `the '${kind}', '${name}' entity (used via '${functionname}')`;
    let alternativemessage = `the '${alternative.kind}', '${alternative.name}' entity`;
    if (alternativefunctionname) {
      alternativemessage += ` via the '${alternativefunctionname}' function`;
    }
    _wordpress_deprecated__webpack_imported_module_0___default()(message, {
      ...deprecation,
      alternative: alternativemessage
    });
  }
  loggedalready = true;
  settimeout(() => {
    loggedalready = false;
  }, 0);
}



/***/ }),

/***/ 9424:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   editmediaentity: () => (/* binding */ editmediaentity),
/* harmony export */   receiveregisteredpostmeta: () => (/* binding */ receiveregisteredpostmeta)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__webpack_imported_module_0__ = __webpack_require__(1455);
/* harmony import */ var _wordpress_api_fetch__webpack_imported_module_0___default = /*#__pure__*/__webpack_require__.n(_wordpress_api_fetch__webpack_imported_module_0__);
/* harmony import */ var _name__webpack_imported_module_1__ = __webpack_require__(2278);


function receiveregisteredpostmeta(posttype, registeredpostmeta) {
  return {
    type: "receive_registered_post_meta",
    posttype,
    registeredpostmeta
  };
}
const editmediaentity = (recordid, edits = {}, { __unstablefetch = (_wordpress_api_fetch__webpack_imported_module_0___default()), throwonerror = false } = {}) => async ({ dispatch, resolveselect }) => {
  if (!recordid) {
    return;
  }
  const kind = "posttype";
  const name = "attachment";
  const configs = await resolveselect.getentitiesconfig(kind);
  const entityconfig = configs.find(
    (config) => config.kind === kind && config.name === name
  );
  if (!entityconfig) {
    return;
  }
  const lock = await dispatch.__unstableacquirestorelock(
    _name__webpack_imported_module_1__/* .store_name */ .e,
    ["entities", "records", kind, name, recordid],
    { exclusive: true }
  );
  let updatedrecord;
  let error;
  let haserror = false;
  try {
    dispatch({
      type: "save_entity_record_start",
      kind,
      name,
      recordid
    });
    try {
      const path = `${entityconfig.baseurl}/${recordid}/edit`;
      const newrecord = await __unstablefetch({
        path,
        method: "post",
        data: {
          ...edits
        }
      });
      if (newrecord) {
        dispatch.receiveentityrecords(
          kind,
          name,
          [newrecord],
          void 0,
          true,
          void 0,
          void 0
        );
        updatedrecord = newrecord;
      }
    } catch (e) {
      error = e;
      haserror = true;
    }
    dispatch({
      type: "save_entity_record_finish",
      kind,
      name,
      recordid,
      error
    });
    if (haserror && throwonerror) {
      throw error;
    }
    return updatedrecord;
  } finally {
    dispatch.__unstablereleasestorelock(lock);
  }
};



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
/******/ 	
/******/ 	// startup
/******/ 	// load entry module and return exports
/******/ 	// this entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(4565);
/******/ 	(window.wp = window.wp || {}).coredata = __webpack_exports__;
/******/ 	
/******/ })()
;





