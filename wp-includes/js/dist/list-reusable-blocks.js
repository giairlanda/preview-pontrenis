/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	// the require scope
/******/ 	var __webpack_require__ = {};
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
/************************************************************************/
var __webpack_exports__ = {};

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
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

;// external ["wp","apifetch"]
const external_wp_apifetch_namespaceobject = window["wp"]["apifetch"];
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_namespaceobject);
;// external ["wp","blob"]
const external_wp_blob_namespaceobject = window["wp"]["blob"];
;// ./node_modules/@wordpress/list-reusable-blocks/build-module/utils/export.js



async function exportreusableblock(id) {
  const posttype = await external_wp_apifetch_default()({ path: `/wp/v2/types/wp_block` });
  const post = await external_wp_apifetch_default()({
    path: `/wp/v2/${posttype.rest_base}/${id}?context=edit`
  });
  const title = post.title.raw;
  const content = post.content.raw;
  const syncstatus = post.wp_pattern_sync_status;
  const filecontent = json.stringify(
    {
      __file: "wp_block",
      title,
      content,
      syncstatus
    },
    null,
    2
  );
  const filename = paramcase(title) + ".json";
  (0,external_wp_blob_namespaceobject.downloadblob)(filename, filecontent, "application/json");
}
var export_default = exportreusableblock;


;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// ./node_modules/@wordpress/list-reusable-blocks/build-module/utils/file.js
function readtextfile(file) {
  const reader = new window.filereader();
  return new promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readastext(file);
  });
}


;// ./node_modules/@wordpress/list-reusable-blocks/build-module/utils/import.js


async function importreusableblock(file) {
  const filecontent = await readtextfile(file);
  let parsedcontent;
  try {
    parsedcontent = json.parse(filecontent);
  } catch (e) {
    throw new error("invalid json file");
  }
  if (parsedcontent.__file !== "wp_block" || !parsedcontent.title || !parsedcontent.content || typeof parsedcontent.title !== "string" || typeof parsedcontent.content !== "string" || parsedcontent.syncstatus && typeof parsedcontent.syncstatus !== "string") {
    throw new error("invalid pattern json file");
  }
  const posttype = await external_wp_apifetch_default()({ path: `/wp/v2/types/wp_block` });
  const reusableblock = await external_wp_apifetch_default()({
    path: `/wp/v2/${posttype.rest_base}`,
    data: {
      title: parsedcontent.title,
      content: parsedcontent.content,
      status: "publish",
      meta: parsedcontent.syncstatus === "unsynced" ? { wp_pattern_sync_status: parsedcontent.syncstatus } : void 0
    },
    method: "post"
  });
  return reusableblock;
}
var import_default = importreusableblock;


;// ./node_modules/@wordpress/list-reusable-blocks/build-module/components/import-form/index.js






function importform({ instanceid, onupload }) {
  const inputid = "list-reusable-blocks-import-form-" + instanceid;
  const formref = (0,external_wp_element_namespaceobject.useref)();
  const [isloading, setisloading] = (0,external_wp_element_namespaceobject.usestate)(false);
  const [error, seterror] = (0,external_wp_element_namespaceobject.usestate)(null);
  const [file, setfile] = (0,external_wp_element_namespaceobject.usestate)(null);
  const onchangefile = (event) => {
    setfile(event.target.files[0]);
    seterror(null);
  };
  const onsubmit = (event) => {
    event.preventdefault();
    if (!file) {
      return;
    }
    setisloading({ isloading: true });
    import_default(file).then((reusableblock) => {
      if (!formref) {
        return;
      }
      setisloading(false);
      onupload(reusableblock);
    }).catch((errors) => {
      if (!formref) {
        return;
      }
      let uimessage;
      switch (errors.message) {
        case "invalid json file":
          uimessage = (0,external_wp_i18n_namespaceobject.__)("invalid json file");
          break;
        case "invalid pattern json file":
          uimessage = (0,external_wp_i18n_namespaceobject.__)("invalid pattern json file");
          break;
        default:
          uimessage = (0,external_wp_i18n_namespaceobject.__)("unknown error");
      }
      setisloading(false);
      seterror(uimessage);
    });
  };
  const ondismisserror = () => {
    seterror(null);
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    "form",
    {
      classname: "list-reusable-blocks-import-form",
      onsubmit,
      ref: formref,
      children: [
        error && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.notice, { status: "error", onremove: () => ondismisserror(), children: error }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          "label",
          {
            htmlfor: inputid,
            classname: "list-reusable-blocks-import-form__label",
            children: (0,external_wp_i18n_namespaceobject.__)("file")
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("input", { id: inputid, type: "file", onchange: onchangefile }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.button,
          {
            __next40pxdefaultsize: true,
            type: "submit",
            isbusy: isloading,
            accessiblewhendisabled: true,
            disabled: !file || isloading,
            variant: "secondary",
            classname: "list-reusable-blocks-import-form__button",
            children: (0,external_wp_i18n_namespaceobject._x)("import", "button label")
          }
        )
      ]
    }
  );
}
var import_form_default = (0,external_wp_compose_namespaceobject.withinstanceid)(importform);


;// ./node_modules/@wordpress/list-reusable-blocks/build-module/components/import-dropdown/index.js





function importdropdown({ onupload }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.dropdown,
    {
      popoverprops: { placement: "bottom-start" },
      contentclassname: "list-reusable-blocks-import-dropdown__content",
      rendertoggle: ({ isopen, ontoggle }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_components_namespaceobject.button,
        {
          size: "compact",
          classname: "list-reusable-blocks-import-dropdown__button",
          "aria-expanded": isopen,
          onclick: ontoggle,
          variant: "primary",
          children: (0,external_wp_i18n_namespaceobject.__)("import from json")
        }
      ),
      rendercontent: ({ onclose }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(import_form_default, { onupload: (0,external_wp_compose_namespaceobject.pipe)(onclose, onupload) })
    }
  );
}
var import_dropdown_default = importdropdown;


;// ./node_modules/@wordpress/list-reusable-blocks/build-module/index.js





document.body.addeventlistener("click", (event) => {
  if (!event.target.classlist.contains("wp-list-reusable-blocks__export")) {
    return;
  }
  event.preventdefault();
  export_default(event.target.dataset.id);
});
document.addeventlistener("domcontentloaded", () => {
  const button = document.queryselector(".page-title-action");
  if (!button) {
    return;
  }
  const shownotice = () => {
    const notice = document.createelement("div");
    notice.classname = "notice notice-success is-dismissible";
    notice.innerhtml = `<p>${(0,external_wp_i18n_namespaceobject.__)("pattern imported successfully!")}</p>`;
    const headerend = document.queryselector(".wp-header-end");
    if (!headerend) {
      return;
    }
    headerend.parentnode.insertbefore(notice, headerend);
  };
  const container = document.createelement("div");
  container.classname = "list-reusable-blocks__container";
  button.parentnode.insertbefore(container, button);
  (0,external_wp_element_namespaceobject.createroot)(container).render(
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.strictmode, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(import_dropdown_default, { onupload: shownotice }) })
  );
});

(window.wp = window.wp || {}).listreusableblocks = __webpack_exports__;
/******/ })()
;



