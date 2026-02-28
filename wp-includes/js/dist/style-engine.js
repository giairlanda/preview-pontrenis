/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	// the require scope
/******/ 	var __webpack_require__ = {};
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
  compilecss: () => (/* binding */ compilecss),
  getcssrules: () => (/* binding */ getcssrules),
  getcssvaluefromrawstyle: () => (/* reexport */ getcssvaluefromrawstyle)
});

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

;// ./node_modules/@wordpress/style-engine/build-module/styles/constants.js
const variable_reference_prefix = "var:";
const variable_path_separator_token_attribute = "|";
const variable_path_separator_token_style = "--";


;// ./node_modules/@wordpress/style-engine/build-module/styles/utils.js


const getstylevaluebypath = (object, path) => {
  let value = object;
  path.foreach((fieldname) => {
    value = value?.[fieldname];
  });
  return value;
};
function generaterule(style, options, path, rulekey) {
  const stylevalue = getstylevaluebypath(style, path);
  return stylevalue ? [
    {
      selector: options?.selector,
      key: rulekey,
      value: getcssvaluefromrawstyle(stylevalue)
    }
  ] : [];
}
function generateboxrules(style, options, path, rulekeys, individualproperties = ["top", "right", "bottom", "left"]) {
  const boxstyle = getstylevaluebypath(
    style,
    path
  );
  if (!boxstyle) {
    return [];
  }
  const rules = [];
  if (typeof boxstyle === "string") {
    rules.push({
      selector: options?.selector,
      key: rulekeys.default,
      value: getcssvaluefromrawstyle(boxstyle)
    });
  } else {
    const siderules = individualproperties.reduce(
      (acc, side) => {
        const value = getcssvaluefromrawstyle(
          getstylevaluebypath(boxstyle, [side])
        );
        if (value) {
          acc.push({
            selector: options?.selector,
            key: rulekeys?.individual.replace(
              "%s",
              upperfirst(side)
            ),
            value
          });
        }
        return acc;
      },
      []
    );
    rules.push(...siderules);
  }
  return rules;
}
function getcssvaluefromrawstyle(stylevalue) {
  if (typeof stylevalue === "string" && stylevalue.startswith(variable_reference_prefix)) {
    const variable = stylevalue.slice(variable_reference_prefix.length).split(variable_path_separator_token_attribute).map(
      (presetvariable) => paramcase(presetvariable, {
        splitregexp: [
          /([a-z0-9])([a-z])/g,
          // foobar => foo-bar, 3bar => 3-bar
          /([0-9])([a-z])/g,
          // 3bar => 3-bar
          /([a-za-z])([0-9])/g,
          // foo3 => foo-3, foo3 => foo-3
          /([a-z])([a-z][a-z])/g
          // foobar => foo-bar
        ]
      })
    ).join(variable_path_separator_token_style);
    return `var(--wp--${variable})`;
  }
  return stylevalue;
}
function upperfirst(string) {
  const [firstletter, ...rest] = string;
  return firstletter.touppercase() + rest.join("");
}
function camelcasejoin(strings) {
  const [firstitem, ...rest] = strings;
  return firstitem.tolowercase() + rest.map(upperfirst).join("");
}
function safedecodeuri(uri) {
  try {
    return decodeuri(uri);
  } catch (urierror) {
    return uri;
  }
}


;// ./node_modules/@wordpress/style-engine/build-module/styles/border/index.js

function createbordergeneratefunction(path) {
  return (style, options) => generaterule(style, options, path, camelcasejoin(path));
}
function createborderedgegeneratefunction(edge) {
  return (style, options) => {
    return ["color", "style", "width"].flatmap((key) => {
      const path = ["border", edge, key];
      return createbordergeneratefunction(path)(style, options);
    });
  };
}
const color = {
  name: "color",
  generate: createbordergeneratefunction(["border", "color"])
};
const radius = {
  name: "radius",
  generate: (style, options) => {
    return generateboxrules(
      style,
      options,
      ["border", "radius"],
      {
        default: "borderradius",
        individual: "border%sradius"
      },
      ["topleft", "topright", "bottomleft", "bottomright"]
    );
  }
};
const borderstyle = {
  name: "style",
  generate: createbordergeneratefunction(["border", "style"])
};
const width = {
  name: "width",
  generate: createbordergeneratefunction(["border", "width"])
};
const bordertop = {
  name: "bordertop",
  generate: createborderedgegeneratefunction("top")
};
const borderright = {
  name: "borderright",
  generate: createborderedgegeneratefunction("right")
};
const borderbottom = {
  name: "borderbottom",
  generate: createborderedgegeneratefunction("bottom")
};
const borderleft = {
  name: "borderleft",
  generate: createborderedgegeneratefunction("left")
};
var border_default = [
  color,
  borderstyle,
  width,
  radius,
  bordertop,
  borderright,
  borderbottom,
  borderleft
];


;// ./node_modules/@wordpress/style-engine/build-module/styles/color/background.js

const background = {
  name: "background",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["color", "background"],
      "backgroundcolor"
    );
  }
};
var background_default = background;


;// ./node_modules/@wordpress/style-engine/build-module/styles/color/gradient.js

const gradient = {
  name: "gradient",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["color", "gradient"],
      "background"
    );
  }
};
var gradient_default = gradient;


;// ./node_modules/@wordpress/style-engine/build-module/styles/color/text.js

const text_text = {
  name: "text",
  generate: (style, options) => {
    return generaterule(style, options, ["color", "text"], "color");
  }
};
var text_default = text_text;


;// ./node_modules/@wordpress/style-engine/build-module/styles/color/index.js



var color_default = [text_default, gradient_default, background_default];


;// ./node_modules/@wordpress/style-engine/build-module/styles/dimensions/index.js

const minheight = {
  name: "minheight",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["dimensions", "minheight"],
      "minheight"
    );
  }
};
const aspectratio = {
  name: "aspectratio",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["dimensions", "aspectratio"],
      "aspectratio"
    );
  }
};
var dimensions_default = [minheight, aspectratio];


;// ./node_modules/@wordpress/style-engine/build-module/styles/background/index.js

const backgroundimage = {
  name: "backgroundimage",
  generate: (style, options) => {
    const _backgroundimage = style?.background?.backgroundimage;
    if (typeof _backgroundimage === "object" && _backgroundimage?.url) {
      return [
        {
          selector: options.selector,
          key: "backgroundimage",
          // passed `url` may already be encoded. to prevent double encoding, decodeuri is executed to revert to the original string.
          value: `url( '${encodeuri(
            safedecodeuri(_backgroundimage.url)
          )}' )`
        }
      ];
    }
    return generaterule(
      style,
      options,
      ["background", "backgroundimage"],
      "backgroundimage"
    );
  }
};
const backgroundposition = {
  name: "backgroundposition",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["background", "backgroundposition"],
      "backgroundposition"
    );
  }
};
const backgroundrepeat = {
  name: "backgroundrepeat",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["background", "backgroundrepeat"],
      "backgroundrepeat"
    );
  }
};
const backgroundsize = {
  name: "backgroundsize",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["background", "backgroundsize"],
      "backgroundsize"
    );
  }
};
const backgroundattachment = {
  name: "backgroundattachment",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["background", "backgroundattachment"],
      "backgroundattachment"
    );
  }
};
var background_background_default = [
  backgroundimage,
  backgroundposition,
  backgroundrepeat,
  backgroundsize,
  backgroundattachment
];


;// ./node_modules/@wordpress/style-engine/build-module/styles/shadow/index.js

const shadow = {
  name: "shadow",
  generate: (style, options) => {
    return generaterule(style, options, ["shadow"], "boxshadow");
  }
};
var shadow_default = [shadow];


;// ./node_modules/@wordpress/style-engine/build-module/styles/outline/index.js

const outline_color = {
  name: "color",
  generate: (style, options, path = ["outline", "color"], rulekey = "outlinecolor") => {
    return generaterule(style, options, path, rulekey);
  }
};
const offset = {
  name: "offset",
  generate: (style, options, path = ["outline", "offset"], rulekey = "outlineoffset") => {
    return generaterule(style, options, path, rulekey);
  }
};
const outlinestyle = {
  name: "style",
  generate: (style, options, path = ["outline", "style"], rulekey = "outlinestyle") => {
    return generaterule(style, options, path, rulekey);
  }
};
const outline_width = {
  name: "width",
  generate: (style, options, path = ["outline", "width"], rulekey = "outlinewidth") => {
    return generaterule(style, options, path, rulekey);
  }
};
var outline_default = [outline_color, outlinestyle, offset, outline_width];


;// ./node_modules/@wordpress/style-engine/build-module/styles/spacing/padding.js

const padding = {
  name: "padding",
  generate: (style, options) => {
    return generateboxrules(style, options, ["spacing", "padding"], {
      default: "padding",
      individual: "padding%s"
    });
  }
};
var padding_default = padding;


;// ./node_modules/@wordpress/style-engine/build-module/styles/spacing/margin.js

const margin = {
  name: "margin",
  generate: (style, options) => {
    return generateboxrules(style, options, ["spacing", "margin"], {
      default: "margin",
      individual: "margin%s"
    });
  }
};
var margin_default = margin;


;// ./node_modules/@wordpress/style-engine/build-module/styles/spacing/index.js


var spacing_default = [margin_default, padding_default];


;// ./node_modules/@wordpress/style-engine/build-module/styles/typography/index.js

const fontsize = {
  name: "fontsize",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "fontsize"],
      "fontsize"
    );
  }
};
const fontstyle = {
  name: "fontstyle",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "fontstyle"],
      "fontstyle"
    );
  }
};
const fontweight = {
  name: "fontweight",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "fontweight"],
      "fontweight"
    );
  }
};
const fontfamily = {
  name: "fontfamily",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "fontfamily"],
      "fontfamily"
    );
  }
};
const letterspacing = {
  name: "letterspacing",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "letterspacing"],
      "letterspacing"
    );
  }
};
const lineheight = {
  name: "lineheight",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "lineheight"],
      "lineheight"
    );
  }
};
const textcolumns = {
  name: "textcolumns",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "textcolumns"],
      "columncount"
    );
  }
};
const textdecoration = {
  name: "textdecoration",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "textdecoration"],
      "textdecoration"
    );
  }
};
const texttransform = {
  name: "texttransform",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "texttransform"],
      "texttransform"
    );
  }
};
const writingmode = {
  name: "writingmode",
  generate: (style, options) => {
    return generaterule(
      style,
      options,
      ["typography", "writingmode"],
      "writingmode"
    );
  }
};
var typography_default = [
  fontfamily,
  fontsize,
  fontstyle,
  fontweight,
  letterspacing,
  lineheight,
  textcolumns,
  textdecoration,
  texttransform,
  writingmode
];


;// ./node_modules/@wordpress/style-engine/build-module/styles/index.js








const styledefinitions = [
  ...border_default,
  ...color_default,
  ...dimensions_default,
  ...outline_default,
  ...spacing_default,
  ...typography_default,
  ...shadow_default,
  ...background_background_default
];


;// ./node_modules/@wordpress/style-engine/build-module/index.js


function compilecss(style, options = {}) {
  const rules = getcssrules(style, options);
  if (!options?.selector) {
    const inlinerules = [];
    rules.foreach((rule) => {
      inlinerules.push(`${paramcase(rule.key)}: ${rule.value};`);
    });
    return inlinerules.join(" ");
  }
  const groupedrules = rules.reduce(
    (acc, rule) => {
      const { selector } = rule;
      if (!selector) {
        return acc;
      }
      if (!acc[selector]) {
        acc[selector] = [];
      }
      acc[selector].push(rule);
      return acc;
    },
    {}
  );
  const selectorrules = object.keys(groupedrules).reduce(
    (acc, subselector) => {
      acc.push(
        `${subselector} { ${groupedrules[subselector].map(
          (rule) => `${paramcase(rule.key)}: ${rule.value};`
        ).join(" ")} }`
      );
      return acc;
    },
    []
  );
  return selectorrules.join("\n");
}
function getcssrules(style, options = {}) {
  const rules = [];
  styledefinitions.foreach((definition) => {
    if (typeof definition.generate === "function") {
      rules.push(...definition.generate(style, options));
    }
  });
  return rules;
}



(window.wp = window.wp || {}).styleengine = __webpack_exports__;
/******/ })()
;


