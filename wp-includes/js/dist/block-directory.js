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
  store: () => (/* reexport */ store)
});

// namespace object: ./node_modules/@wordpress/block-directory/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  getdownloadableblocks: () => (getdownloadableblocks),
  geterrornoticeforblock: () => (geterrornoticeforblock),
  geterrornotices: () => (geterrornotices),
  getinstalledblocktypes: () => (getinstalledblocktypes),
  getnewblocktypes: () => (getnewblocktypes),
  getunusedblocktypes: () => (getunusedblocktypes),
  isinstalling: () => (isinstalling),
  isrequestingdownloadableblocks: () => (isrequestingdownloadableblocks)
});

// namespace object: ./node_modules/@wordpress/block-directory/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  addinstalledblocktype: () => (addinstalledblocktype),
  clearerrornotice: () => (clearerrornotice),
  fetchdownloadableblocks: () => (fetchdownloadableblocks),
  installblocktype: () => (installblocktype),
  receivedownloadableblocks: () => (receivedownloadableblocks),
  removeinstalledblocktype: () => (removeinstalledblocktype),
  seterrornotice: () => (seterrornotice),
  setisinstalling: () => (setisinstalling),
  uninstallblocktype: () => (uninstallblocktype)
});

// namespace object: ./node_modules/@wordpress/block-directory/build-module/store/resolvers.js
var resolvers_namespaceobject = {};
__webpack_require__.r(resolvers_namespaceobject);
__webpack_require__.d(resolvers_namespaceobject, {
  getdownloadableblocks: () => (resolvers_getdownloadableblocks)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","plugins"]
const external_wp_plugins_namespaceobject = window["wp"]["plugins"];
;// external ["wp","hooks"]
const external_wp_hooks_namespaceobject = window["wp"]["hooks"];
;// external ["wp","blocks"]
const external_wp_blocks_namespaceobject = window["wp"]["blocks"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","editor"]
const external_wp_editor_namespaceobject = window["wp"]["editor"];
;// ./node_modules/@wordpress/block-directory/build-module/store/reducer.js

const downloadableblocks = (state = {}, action) => {
  switch (action.type) {
    case "fetch_downloadable_blocks":
      return {
        ...state,
        [action.filtervalue]: {
          isrequesting: true
        }
      };
    case "receive_downloadable_blocks":
      return {
        ...state,
        [action.filtervalue]: {
          results: action.downloadableblocks,
          isrequesting: false
        }
      };
  }
  return state;
};
const blockmanagement = (state = {
  installedblocktypes: [],
  isinstalling: {}
}, action) => {
  switch (action.type) {
    case "add_installed_block_type":
      return {
        ...state,
        installedblocktypes: [
          ...state.installedblocktypes,
          action.item
        ]
      };
    case "remove_installed_block_type":
      return {
        ...state,
        installedblocktypes: state.installedblocktypes.filter(
          (blocktype) => blocktype.name !== action.item.name
        )
      };
    case "set_installing_block":
      return {
        ...state,
        isinstalling: {
          ...state.isinstalling,
          [action.blockid]: action.isinstalling
        }
      };
  }
  return state;
};
const errornotices = (state = {}, action) => {
  switch (action.type) {
    case "set_error_notice":
      return {
        ...state,
        [action.blockid]: {
          message: action.message,
          isfatal: action.isfatal
        }
      };
    case "clear_error_notice":
      const { [action.blockid]: blockid, ...reststate } = state;
      return reststate;
  }
  return state;
};
var reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({
  downloadableblocks,
  blockmanagement,
  errornotices
});


;// external ["wp","blockeditor"]
const external_wp_blockeditor_namespaceobject = window["wp"]["blockeditor"];
;// ./node_modules/@wordpress/block-directory/build-module/store/selectors.js


const empty_array = [];
function isrequestingdownloadableblocks(state, filtervalue) {
  return state.downloadableblocks[filtervalue]?.isrequesting ?? false;
}
function getdownloadableblocks(state, filtervalue) {
  return state.downloadableblocks[filtervalue]?.results ?? empty_array;
}
function getinstalledblocktypes(state) {
  return state.blockmanagement.installedblocktypes;
}
const getnewblocktypes = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (0,external_wp_data_namespaceobject.createselector)(
    (state) => {
      const installedblocktypes = getinstalledblocktypes(state);
      if (!installedblocktypes.length) {
        return empty_array;
      }
      const { getblockname, getclientidswithdescendants } = select(external_wp_blockeditor_namespaceobject.store);
      const installedblocknames = installedblocktypes.map(
        (blocktype) => blocktype.name
      );
      const foundblocknames = getclientidswithdescendants().flatmap(
        (clientid) => {
          const blockname = getblockname(clientid);
          return installedblocknames.includes(blockname) ? blockname : [];
        }
      );
      const newblocktypes = installedblocktypes.filter(
        (blocktype) => foundblocknames.includes(blocktype.name)
      );
      return newblocktypes.length > 0 ? newblocktypes : empty_array;
    },
    (state) => [
      getinstalledblocktypes(state),
      select(external_wp_blockeditor_namespaceobject.store).getclientidswithdescendants()
    ]
  )
);
const getunusedblocktypes = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (0,external_wp_data_namespaceobject.createselector)(
    (state) => {
      const installedblocktypes = getinstalledblocktypes(state);
      if (!installedblocktypes.length) {
        return empty_array;
      }
      const { getblockname, getclientidswithdescendants } = select(external_wp_blockeditor_namespaceobject.store);
      const installedblocknames = installedblocktypes.map(
        (blocktype) => blocktype.name
      );
      const foundblocknames = getclientidswithdescendants().flatmap(
        (clientid) => {
          const blockname = getblockname(clientid);
          return installedblocknames.includes(blockname) ? blockname : [];
        }
      );
      const unusedblocktypes = installedblocktypes.filter(
        (blocktype) => !foundblocknames.includes(blocktype.name)
      );
      return unusedblocktypes.length > 0 ? unusedblocktypes : empty_array;
    },
    (state) => [
      getinstalledblocktypes(state),
      select(external_wp_blockeditor_namespaceobject.store).getclientidswithdescendants()
    ]
  )
);
function isinstalling(state, blockid) {
  return state.blockmanagement.isinstalling[blockid] || false;
}
function geterrornotices(state) {
  return state.errornotices;
}
function geterrornoticeforblock(state, blockid) {
  return state.errornotices[blockid];
}


;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","apifetch"]
const external_wp_apifetch_namespaceobject = window["wp"]["apifetch"];
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_namespaceobject);
;// external ["wp","notices"]
const external_wp_notices_namespaceobject = window["wp"]["notices"];
;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// ./node_modules/@wordpress/block-directory/build-module/store/load-assets.js

const loadasset = (el) => {
  return new promise((resolve, reject) => {
    const newnode = document.createelement(el.nodename);
    ["id", "rel", "src", "href", "type"].foreach((attr) => {
      if (el[attr]) {
        newnode[attr] = el[attr];
      }
    });
    if (el.innerhtml) {
      newnode.appendchild(document.createtextnode(el.innerhtml));
    }
    newnode.onload = () => resolve(true);
    newnode.onerror = () => reject(new error("error loading asset."));
    document.body.appendchild(newnode);
    if ("link" === newnode.nodename.tolowercase() || "script" === newnode.nodename.tolowercase() && !newnode.src) {
      resolve();
    }
  });
};
async function loadassets() {
  const response = await external_wp_apifetch_default()({
    url: document.location.href,
    parse: false
  });
  const data = await response.text();
  const doc = new window.domparser().parsefromstring(data, "text/html");
  const newassets = array.from(
    doc.queryselectorall('link[rel="stylesheet"],script')
  ).filter((asset) => asset.id && !document.getelementbyid(asset.id));
  for (const newasset of newassets) {
    await loadasset(newasset);
  }
}


;// ./node_modules/@wordpress/block-directory/build-module/store/utils/get-plugin-url.js
function getpluginurl(block) {
  if (!block) {
    return false;
  }
  const link = block.links["wp:plugin"] || block.links.self;
  if (link && link.length) {
    return link[0].href;
  }
  return false;
}


;// ./node_modules/@wordpress/block-directory/build-module/store/actions.js







function fetchdownloadableblocks(filtervalue) {
  return { type: "fetch_downloadable_blocks", filtervalue };
}
function receivedownloadableblocks(downloadableblocks, filtervalue) {
  return {
    type: "receive_downloadable_blocks",
    downloadableblocks,
    filtervalue
  };
}
const installblocktype = (block) => async ({ registry, dispatch }) => {
  const { id, name } = block;
  let success = false;
  dispatch.clearerrornotice(id);
  try {
    dispatch.setisinstalling(id, true);
    const url = getpluginurl(block);
    let links = {};
    if (url) {
      await external_wp_apifetch_default()({
        method: "put",
        url,
        data: { status: "active" }
      });
    } else {
      const response = await external_wp_apifetch_default()({
        method: "post",
        path: "wp/v2/plugins",
        data: { slug: id, status: "active" }
      });
      links = response._links;
    }
    dispatch.addinstalledblocktype({
      ...block,
      links: { ...block.links, ...links }
    });
    const metadatafields = [
      "api_version",
      "title",
      "category",
      "parent",
      "ancestor",
      "icon",
      "description",
      "keywords",
      "attributes",
      "provides_context",
      "uses_context",
      "selectors",
      "supports",
      "styles",
      "example",
      "variations",
      "allowed_blocks",
      "block_hooks"
    ];
    await external_wp_apifetch_default()({
      path: (0,external_wp_url_namespaceobject.addqueryargs)(`/wp/v2/block-types/${name}`, {
        _fields: metadatafields
      })
    }).catch(() => {
    }).then((response) => {
      if (!response) {
        return;
      }
      (0,external_wp_blocks_namespaceobject.unstable__bootstrapserversideblockdefinitions)({
        [name]: object.fromentries(
          object.entries(response).filter(
            ([key]) => metadatafields.includes(key)
          )
        )
      });
    });
    await loadassets();
    const registeredblocks = registry.select(external_wp_blocks_namespaceobject.store).getblocktypes();
    if (!registeredblocks.some((i) => i.name === name)) {
      throw new error(
        (0,external_wp_i18n_namespaceobject.__)("error registering block. try reloading the page.")
      );
    }
    registry.dispatch(external_wp_notices_namespaceobject.store).createinfonotice(
      (0,external_wp_i18n_namespaceobject.sprintf)(
        // translators: %s is the block title.
        (0,external_wp_i18n_namespaceobject.__)("block %s installed and added."),
        block.title
      ),
      {
        speak: true,
        type: "snackbar"
      }
    );
    success = true;
  } catch (error) {
    let message = error.message || (0,external_wp_i18n_namespaceobject.__)("an error occurred.");
    let isfatal = error instanceof error;
    const fatalapierrors = {
      folder_exists: (0,external_wp_i18n_namespaceobject.__)(
        "this block is already installed. try reloading the page."
      ),
      unable_to_connect_to_filesystem: (0,external_wp_i18n_namespaceobject.__)(
        "error installing block. you can reload the page and try again."
      )
    };
    if (fatalapierrors[error.code]) {
      isfatal = true;
      message = fatalapierrors[error.code];
    }
    dispatch.seterrornotice(id, message, isfatal);
    registry.dispatch(external_wp_notices_namespaceobject.store).createerrornotice(message, {
      speak: true,
      isdismissible: true
    });
  }
  dispatch.setisinstalling(id, false);
  return success;
};
const uninstallblocktype = (block) => async ({ registry, dispatch }) => {
  try {
    const url = getpluginurl(block);
    await external_wp_apifetch_default()({
      method: "put",
      url,
      data: { status: "inactive" }
    });
    await external_wp_apifetch_default()({
      method: "delete",
      url
    });
    dispatch.removeinstalledblocktype(block);
  } catch (error) {
    registry.dispatch(external_wp_notices_namespaceobject.store).createerrornotice(
      error.message || (0,external_wp_i18n_namespaceobject.__)("an error occurred.")
    );
  }
};
function addinstalledblocktype(item) {
  return {
    type: "add_installed_block_type",
    item
  };
}
function removeinstalledblocktype(item) {
  return {
    type: "remove_installed_block_type",
    item
  };
}
function setisinstalling(blockid, isinstalling) {
  return {
    type: "set_installing_block",
    blockid,
    isinstalling
  };
}
function seterrornotice(blockid, message, isfatal = false) {
  return {
    type: "set_error_notice",
    blockid,
    message,
    isfatal
  };
}
function clearerrornotice(blockid) {
  return {
    type: "clear_error_notice",
    blockid
  };
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

;// ./node_modules/pascal-case/dist.es2015/index.js


function pascalcasetransform(input, index) {
    var firstchar = input.charat(0);
    var lowerchars = input.substr(1).tolowercase();
    if (index > 0 && firstchar >= "0" && firstchar <= "9") {
        return "_" + firstchar + lowerchars;
    }
    return "" + firstchar.touppercase() + lowerchars;
}
function dist_es2015_pascalcasetransformmerge(input) {
    return input.charat(0).touppercase() + input.slice(1).tolowercase();
}
function pascalcase(input, options) {
    if (options === void 0) { options = {}; }
    return nocase(input, __assign({ delimiter: "", transform: pascalcasetransform }, options));
}

;// ./node_modules/camel-case/dist.es2015/index.js


function camelcasetransform(input, index) {
    if (index === 0)
        return input.tolowercase();
    return pascalcasetransform(input, index);
}
function camelcasetransformmerge(input, index) {
    if (index === 0)
        return input.tolowercase();
    return pascalcasetransformmerge(input);
}
function camelcase(input, options) {
    if (options === void 0) { options = {}; }
    return pascalcase(input, __assign({ transform: camelcasetransform }, options));
}

;// ./node_modules/@wordpress/block-directory/build-module/store/resolvers.js



const resolvers_getdownloadableblocks = (filtervalue) => async ({ dispatch }) => {
  if (!filtervalue) {
    return;
  }
  try {
    dispatch(fetchdownloadableblocks(filtervalue));
    const results = await external_wp_apifetch_default()({
      path: `wp/v2/block-directory/search?term=${filtervalue}`
    });
    const blocks = results.map(
      (result) => object.fromentries(
        object.entries(result).map(([key, value]) => [
          camelcase(key),
          value
        ])
      )
    );
    dispatch(receivedownloadableblocks(blocks, filtervalue));
  } catch {
    dispatch(receivedownloadableblocks([], filtervalue));
  }
};


;// ./node_modules/@wordpress/block-directory/build-module/store/index.js





const store_name = "core/block-directory";
const storeconfig = {
  reducer: reducer_default,
  selectors: selectors_namespaceobject,
  actions: actions_namespaceobject,
  resolvers: resolvers_namespaceobject
};
const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, storeconfig);
(0,external_wp_data_namespaceobject.register)(store);


;// ./node_modules/@wordpress/block-directory/build-module/components/auto-block-uninstaller/index.js





function autoblockuninstaller() {
  const { uninstallblocktype } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const shouldremoveblocktypes = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { isautosavingpost, issavingpost } = select(external_wp_editor_namespaceobject.store);
    return issavingpost() && !isautosavingpost();
  }, []);
  const unusedblocktypes = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store).getunusedblocktypes(),
    []
  );
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (shouldremoveblocktypes && unusedblocktypes.length) {
      unusedblocktypes.foreach((blocktype) => {
        uninstallblocktype(blocktype);
        (0,external_wp_blocks_namespaceobject.unregisterblocktype)(blocktype.name);
      });
    }
  }, [shouldremoveblocktypes]);
  return null;
}


;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","coredata"]
const external_wp_coredata_namespaceobject = window["wp"]["coredata"];
;// ./node_modules/clsx/dist/clsx.mjs
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(array.isarray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const dist_clsx = (clsx);
;// external ["wp","htmlentities"]
const external_wp_htmlentities_namespaceobject = window["wp"]["htmlentities"];
;// ./node_modules/@wordpress/icons/build-module/icon/index.js

var icon_default = (0,external_wp_element_namespaceobject.forwardref)(
  ({ icon, size = 24, ...props }, ref) => {
    return (0,external_wp_element_namespaceobject.cloneelement)(icon, {
      width: size,
      height: size,
      ...props,
      ref
    });
  }
);


;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/star-filled.js


var star_filled_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m11.776 4.454a.25.25 0 01.448 0l2.069 4.192a.25.25 0 00.188.137l4.626.672a.25.25 0 01.139.426l-3.348 3.263a.25.25 0 00-.072.222l.79 4.607a.25.25 0 01-.362.263l-4.138-2.175a.25.25 0 00-.232 0l-4.138 2.175a.25.25 0 01-.363-.263l.79-4.607a.25.25 0 00-.071-.222l4.754 9.881a.25.25 0 01.139-.426l4.626-.672a.25.25 0 00.188-.137l2.069-4.192z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/star-half.js


var star_half_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m9.518 8.783a.25.25 0 00.188-.137l2.069-4.192a.25.25 0 01.448 0l2.07 4.192a.25.25 0 00.187.137l4.626.672a.25.25 0 01.139.427l-3.347 3.262a.25.25 0 00-.072.222l.79 4.607a.25.25 0 01-.363.264l-4.137-2.176a.25.25 0 00-.233 0l-4.138 2.175a.25.25 0 01-.362-.263l.79-4.607a.25.25 0 00-.072-.222l4.753 9.882a.25.25 0 01.14-.427l4.625-.672zm12 14.533c.28 0 .559.067.814.2l1.895.997-.362-2.11a1.75 1.75 0 01.504-1.55l1.533-1.495-2.12-.308a1.75 1.75 0 01-1.317-.957l12 7.39v7.143z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/star-empty.js


var star_empty_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
  external_wp_primitives_namespaceobject.path,
  {
    fillrule: "evenodd",
    d: "m9.706 8.646a.25.25 0 01-.188.137l-4.626.672a.25.25 0 00-.139.427l3.348 3.262a.25.25 0 01.072.222l-.79 4.607a.25.25 0 00.362.264l4.138-2.176a.25.25 0 01.233 0l4.137 2.175a.25.25 0 00.363-.263l-.79-4.607a.25.25 0 01.072-.222l3.347-3.262a.25.25 0 00-.139-.427l-4.626-.672a.25.25 0 01-.188-.137l-2.069-4.192a.25.25 0 00-.448 0l9.706 8.646zm12 7.39l-.948 1.921a1.75 1.75 0 01-1.317.957l-2.12.308 1.534 1.495c.412.402.6.982.503 1.55l-.362 2.11 1.896-.997a1.75 1.75 0 011.629 0l1.895.997-.362-2.11a1.75 1.75 0 01.504-1.55l1.533-1.495-2.12-.308a1.75 1.75 0 01-1.317-.957l12 7.39z",
    cliprule: "evenodd"
  }
) });


;// ./node_modules/@wordpress/block-directory/build-module/components/block-ratings/stars.js



function stars({ rating }) {
  const stars = math.round(rating / 0.5) * 0.5;
  const fullstarcount = math.floor(rating);
  const halfstarcount = math.ceil(rating - fullstarcount);
  const emptystarcount = 5 - (fullstarcount + halfstarcount);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    "span",
    {
      "aria-label": (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: number of stars. */
        (0,external_wp_i18n_namespaceobject.__)("%s out of 5 stars"),
        stars
      ),
      children: [
        array.from({ length: fullstarcount }).map((_, i) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          icon_default,
          {
            classname: "block-directory-block-ratings__star-full",
            icon: star_filled_default,
            size: 16
          },
          `full_stars_${i}`
        )),
        array.from({ length: halfstarcount }).map((_, i) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          icon_default,
          {
            classname: "block-directory-block-ratings__star-half-full",
            icon: star_half_default,
            size: 16
          },
          `half_stars_${i}`
        )),
        array.from({ length: emptystarcount }).map((_, i) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          icon_default,
          {
            classname: "block-directory-block-ratings__star-empty",
            icon: star_empty_default,
            size: 16
          },
          `empty_stars_${i}`
        ))
      ]
    }
  );
}
var stars_default = stars;


;// ./node_modules/@wordpress/block-directory/build-module/components/block-ratings/index.js


const blockratings = ({ rating }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("span", { classname: "block-directory-block-ratings", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(stars_default, { rating }) });
var block_ratings_default = blockratings;


;// ./node_modules/@wordpress/block-directory/build-module/components/downloadable-block-icon/index.js


function downloadableblockicon({ icon }) {
  const classname = "block-directory-downloadable-block-icon";
  return icon.match(/\.(jpeg|jpg|gif|png|svg)(?:\?.*)?$/) !== null ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("img", { classname, src: icon, alt: "" }) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockicon, { classname, icon, showcolors: true });
}
var downloadable_block_icon_default = downloadableblockicon;


;// ./node_modules/@wordpress/block-directory/build-module/components/downloadable-block-notice/index.js




const downloadableblocknotice = ({ block }) => {
  const errornotice = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store).geterrornoticeforblock(block.id),
    [block]
  );
  if (!errornotice) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "block-directory-downloadable-block-notice", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "block-directory-downloadable-block-notice__content", children: [
    errornotice.message,
    errornotice.isfatal ? " " + (0,external_wp_i18n_namespaceobject.__)("try reloading the page.") : null
  ] }) });
};
var downloadable_block_notice_default = downloadableblocknotice;


;// ./node_modules/@wordpress/block-directory/build-module/components/downloadable-block-list-item/index.js












function getdownloadableblocklabel({ title, rating, ratingcount }, { hasnotice, isinstalled, isinstalling }) {
  const stars = math.round(rating / 0.5) * 0.5;
  if (!isinstalled && hasnotice) {
    return (0,external_wp_i18n_namespaceobject.sprintf)("retry installing %s.", (0,external_wp_htmlentities_namespaceobject.decodeentities)(title));
  }
  if (isinstalled) {
    return (0,external_wp_i18n_namespaceobject.sprintf)("add %s.", (0,external_wp_htmlentities_namespaceobject.decodeentities)(title));
  }
  if (isinstalling) {
    return (0,external_wp_i18n_namespaceobject.sprintf)("installing %s.", (0,external_wp_htmlentities_namespaceobject.decodeentities)(title));
  }
  if (ratingcount < 1) {
    return (0,external_wp_i18n_namespaceobject.sprintf)("install %s.", (0,external_wp_htmlentities_namespaceobject.decodeentities)(title));
  }
  return (0,external_wp_i18n_namespaceobject.sprintf)(
    /* translators: 1: block title, 2: average rating, 3: total ratings count. */
    (0,external_wp_i18n_namespaceobject._n)(
      "install %1$s. %2$s stars with %3$s review.",
      "install %1$s. %2$s stars with %3$s reviews.",
      ratingcount
    ),
    (0,external_wp_htmlentities_namespaceobject.decodeentities)(title),
    stars,
    ratingcount
  );
}
function downloadableblocklistitem({ item, onclick }) {
  const { author, description, icon, rating, title } = item;
  const isinstalled = !!(0,external_wp_blocks_namespaceobject.getblocktype)(item.name);
  const { hasnotice, isinstalling, isinstallable } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { geterrornoticeforblock, isinstalling: isblockinstalling } = select(store);
      const notice = geterrornoticeforblock(item.id);
      const hasfatal = notice && notice.isfatal;
      return {
        hasnotice: !!notice,
        isinstalling: isblockinstalling(item.id),
        isinstallable: !hasfatal
      };
    },
    [item]
  );
  let statustext = "";
  if (isinstalled) {
    statustext = (0,external_wp_i18n_namespaceobject.__)("installed!");
  } else if (isinstalling) {
    statustext = (0,external_wp_i18n_namespaceobject.__)("installing\u2026");
  }
  const itemlabel = getdownloadableblocklabel(item, {
    hasnotice,
    isinstalled,
    isinstalling
  });
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.tooltip, { placement: "top", text: itemlabel, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    external_wp_components_namespaceobject.composite.item,
    {
      classname: dist_clsx(
        "block-directory-downloadable-block-list-item",
        isinstalling && "is-installing"
      ),
      accessiblewhendisabled: true,
      disabled: isinstalling || !isinstallable,
      onclick: (event) => {
        event.preventdefault();
        onclick();
      },
      "aria-label": itemlabel,
      type: "button",
      role: "option",
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "block-directory-downloadable-block-list-item__icon", children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(downloadable_block_icon_default, { icon, title }),
          isinstalling ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("span", { classname: "block-directory-downloadable-block-list-item__spinner", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.spinner, {}) }) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(block_ratings_default, { rating })
        ] }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("span", { classname: "block-directory-downloadable-block-list-item__details", children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("span", { classname: "block-directory-downloadable-block-list-item__title", children: (0,external_wp_element_namespaceobject.createinterpolateelement)(
            (0,external_wp_i18n_namespaceobject.sprintf)(
              /* translators: 1: block title. 2: author name. */
              (0,external_wp_i18n_namespaceobject.__)("%1$s <span>by %2$s</span>"),
              (0,external_wp_htmlentities_namespaceobject.decodeentities)(title),
              author
            ),
            {
              span: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("span", { classname: "block-directory-downloadable-block-list-item__author" })
            }
          ) }),
          hasnotice ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(downloadable_block_notice_default, { block: item }) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("span", { classname: "block-directory-downloadable-block-list-item__desc", children: !!statustext ? statustext : (0,external_wp_htmlentities_namespaceobject.decodeentities)(description) }),
            isinstallable && !(isinstalled || isinstalling) && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.visuallyhidden, { children: (0,external_wp_i18n_namespaceobject.__)("install block") })
          ] })
        ] })
      ]
    }
  ) });
}
var downloadable_block_list_item_default = downloadableblocklistitem;


;// ./node_modules/@wordpress/block-directory/build-module/components/downloadable-blocks-list/index.js







const noop = () => {
};
function downloadableblockslist({ items, onhover = noop, onselect }) {
  const { installblocktype } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  if (!items.length) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.composite,
    {
      role: "listbox",
      classname: "block-directory-downloadable-blocks-list",
      "aria-label": (0,external_wp_i18n_namespaceobject.__)("blocks available for install"),
      children: items.map((item) => {
        return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          downloadable_block_list_item_default,
          {
            onclick: () => {
              if ((0,external_wp_blocks_namespaceobject.getblocktype)(item.name)) {
                onselect(item);
              } else {
                installblocktype(item).then((success) => {
                  if (success) {
                    onselect(item);
                  }
                });
              }
              onhover(null);
            },
            onhover,
            item
          },
          item.id
        );
      })
    }
  );
}
var downloadable_blocks_list_default = downloadableblockslist;


;// external ["wp","a11y"]
const external_wp_a11y_namespaceobject = window["wp"]["a11y"];
;// ./node_modules/@wordpress/block-directory/build-module/components/downloadable-blocks-panel/inserter-panel.js




function downloadableblocksinserterpanel({
  children,
  downloadableitems,
  haslocalblocks
}) {
  const count = downloadableitems.length;
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    (0,external_wp_a11y_namespaceobject.speak)(
      (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %d: number of available blocks. */
        (0,external_wp_i18n_namespaceobject._n)(
          "%d additional block is available to install.",
          "%d additional blocks are available to install.",
          count
        ),
        count
      )
    );
  }, [count]);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    !haslocalblocks && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "block-directory-downloadable-blocks-panel__no-local", children: (0,external_wp_i18n_namespaceobject.__)("no results available from your installed blocks.") }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "block-editor-inserter__quick-inserter-separator" }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "block-directory-downloadable-blocks-panel", children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "block-directory-downloadable-blocks-panel__header", children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h2", { classname: "block-directory-downloadable-blocks-panel__title", children: (0,external_wp_i18n_namespaceobject.__)("available to install") }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "block-directory-downloadable-blocks-panel__description", children: (0,external_wp_i18n_namespaceobject.__)(
          "select a block to install and add it to your post."
        ) })
      ] }),
      children
    ] })
  ] });
}
var inserter_panel_default = downloadableblocksinserterpanel;


;// ./node_modules/@wordpress/block-directory/build-module/components/downloadable-blocks-panel/no-results.js



function downloadableblocksnoresults() {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "block-editor-inserter__no-results", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { children: (0,external_wp_i18n_namespaceobject.__)("no results found.") }) }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "block-editor-inserter__tips", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.tip, { children: [
      (0,external_wp_i18n_namespaceobject.__)("interested in creating your own block?"),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("br", {}),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.externallink, { href: "https://developer.wordpress.org/block-editor/", children: [
        (0,external_wp_i18n_namespaceobject.__)("get started here"),
        "."
      ] })
    ] }) })
  ] });
}
var no_results_default = downloadableblocksnoresults;


;// ./node_modules/@wordpress/block-directory/build-module/components/downloadable-blocks-panel/index.js










const downloadable_blocks_panel_empty_array = [];
const usedownloadableblocks = (filtervalue) => (0,external_wp_data_namespaceobject.useselect)(
  (select) => {
    const {
      getdownloadableblocks,
      isrequestingdownloadableblocks,
      getinstalledblocktypes
    } = select(store);
    const haspermission = select(external_wp_coredata_namespaceobject.store).canuser(
      "read",
      "block-directory/search"
    );
    let downloadableblocks = downloadable_blocks_panel_empty_array;
    if (haspermission) {
      downloadableblocks = getdownloadableblocks(filtervalue);
      const installedblocktypes = getinstalledblocktypes();
      const installableblocks = downloadableblocks.filter(
        ({ name }) => {
          const isjustinstalled = installedblocktypes.some(
            (blocktype) => blocktype.name === name
          );
          const ispreviouslyinstalled = (0,external_wp_blocks_namespaceobject.getblocktype)(name);
          return isjustinstalled || !ispreviouslyinstalled;
        }
      );
      if (installableblocks.length !== downloadableblocks.length) {
        downloadableblocks = installableblocks;
      }
      if (downloadableblocks.length === 0) {
        downloadableblocks = downloadable_blocks_panel_empty_array;
      }
    }
    return {
      haspermission,
      downloadableblocks,
      isloading: isrequestingdownloadableblocks(filtervalue)
    };
  },
  [filtervalue]
);
function downloadableblockspanel({
  onselect,
  onhover,
  haslocalblocks,
  istyping,
  filtervalue
}) {
  const { haspermission, downloadableblocks, isloading } = usedownloadableblocks(filtervalue);
  if (haspermission === void 0 || isloading || istyping) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      haspermission && !haslocalblocks && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "block-directory-downloadable-blocks-panel__no-local", children: (0,external_wp_i18n_namespaceobject.__)(
          "no results available from your installed blocks."
        ) }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "block-editor-inserter__quick-inserter-separator" })
      ] }),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "block-directory-downloadable-blocks-panel has-blocks-loading", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.spinner, {}) })
    ] });
  }
  if (false === haspermission) {
    if (!haslocalblocks) {
      return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(no_results_default, {});
    }
    return null;
  }
  if (downloadableblocks.length === 0) {
    return haslocalblocks ? null : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(no_results_default, {});
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    inserter_panel_default,
    {
      downloadableitems: downloadableblocks,
      haslocalblocks,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        downloadable_blocks_list_default,
        {
          items: downloadableblocks,
          onselect,
          onhover
        }
      )
    }
  );
}


;// ./node_modules/@wordpress/block-directory/build-module/plugins/inserter-menu-downloadable-blocks-panel/index.js





function insertermenudownloadableblockspanel() {
  const [debouncedfiltervalue, setfiltervalue] = (0,external_wp_element_namespaceobject.usestate)("");
  const debouncedsetfiltervalue = (0,external_wp_compose_namespaceobject.debounce)(setfiltervalue, 400);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.__unstableinsertermenuextension, { children: ({ onselect, onhover, filtervalue, hasitems }) => {
    if (debouncedfiltervalue !== filtervalue) {
      debouncedsetfiltervalue(filtervalue);
    }
    if (!debouncedfiltervalue) {
      return null;
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      downloadableblockspanel,
      {
        onselect,
        onhover,
        filtervalue: debouncedfiltervalue,
        haslocalblocks: hasitems,
        istyping: filtervalue !== debouncedfiltervalue
      }
    );
  } });
}
var inserter_menu_downloadable_blocks_panel_default = insertermenudownloadableblockspanel;


;// ./node_modules/@wordpress/block-directory/build-module/components/compact-list/index.js



function compactlist({ items }) {
  if (!items.length) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("ul", { classname: "block-directory-compact-list", children: items.map(({ icon, id, title, author }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("li", { classname: "block-directory-compact-list__item", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(downloadable_block_icon_default, { icon, title }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "block-directory-compact-list__item-details", children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "block-directory-compact-list__item-title", children: title }),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "block-directory-compact-list__item-author", children: (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: name of the block author. */
        (0,external_wp_i18n_namespaceobject.__)("by %s"),
        author
      ) })
    ] })
  ] }, id)) });
}


;// ./node_modules/@wordpress/block-directory/build-module/plugins/installed-blocks-pre-publish-panel/index.js






function installedblocksprepublishpanel() {
  const newblocktypes = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store).getnewblocktypes(),
    []
  );
  if (!newblocktypes.length) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    external_wp_editor_namespaceobject.pluginprepublishpanel,
    {
      title: (0,external_wp_i18n_namespaceobject.sprintf)(
        // translators: %d: number of blocks (number).
        (0,external_wp_i18n_namespaceobject._n)(
          "added: %d block",
          "added: %d blocks",
          newblocktypes.length
        ),
        newblocktypes.length
      ),
      initialopen: true,
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "installed-blocks-pre-publish-panel__copy", children: (0,external_wp_i18n_namespaceobject._n)(
          "the following block has been added to your site.",
          "the following blocks have been added to your site.",
          newblocktypes.length
        ) }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(compactlist, { items: newblocktypes })
      ]
    }
  );
}


;// ./node_modules/@wordpress/block-directory/build-module/plugins/get-install-missing/install-button.js







function installbutton({ attributes, block, clientid }) {
  const isinstallingblock = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store).isinstalling(block.id),
    [block.id]
  );
  const { installblocktype } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const { replaceblock } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_blockeditor_namespaceobject.store);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.button,
    {
      __next40pxdefaultsize: true,
      onclick: () => installblocktype(block).then((success) => {
        if (success) {
          const blocktype = (0,external_wp_blocks_namespaceobject.getblocktype)(block.name);
          const [originalblock] = (0,external_wp_blocks_namespaceobject.parse)(
            attributes.originalcontent
          );
          if (originalblock && blocktype) {
            replaceblock(
              clientid,
              (0,external_wp_blocks_namespaceobject.createblock)(
                blocktype.name,
                originalblock.attributes,
                originalblock.innerblocks
              )
            );
          }
        }
      }),
      accessiblewhendisabled: true,
      disabled: isinstallingblock,
      isbusy: isinstallingblock,
      variant: "primary",
      children: (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: block name */
        (0,external_wp_i18n_namespaceobject.__)("install %s"),
        block.title
      )
    }
  );
}


;// ./node_modules/@wordpress/block-directory/build-module/plugins/get-install-missing/index.js










const getinstallmissing = (originalcomponent) => (props) => {
  const { originalname } = props.attributes;
  const { block, haspermission } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { getdownloadableblocks } = select(store);
      const blocks = getdownloadableblocks(
        "block:" + originalname
      ).filter(({ name }) => originalname === name);
      return {
        haspermission: select(external_wp_coredata_namespaceobject.store).canuser(
          "read",
          "block-directory/search"
        ),
        block: blocks.length && blocks[0]
      };
    },
    [originalname]
  );
  if (!haspermission || !block) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(originalcomponent, { ...props });
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(modifiedwarning, { ...props, originalblock: block });
};
const modifiedwarning = ({ originalblock, ...props }) => {
  const { originalname, originalundelimitedcontent, clientid } = props.attributes;
  const { replaceblock } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_blockeditor_namespaceobject.store);
  const converttohtml = () => {
    replaceblock(
      props.clientid,
      (0,external_wp_blocks_namespaceobject.createblock)("core/html", {
        content: originalundelimitedcontent
      })
    );
  };
  const hascontent = !!originalundelimitedcontent;
  const hashtmlblock = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { caninsertblocktype, getblockrootclientid } = select(external_wp_blockeditor_namespaceobject.store);
      return caninsertblocktype(
        "core/html",
        getblockrootclientid(clientid)
      );
    },
    [clientid]
  );
  let messagehtml = (0,external_wp_i18n_namespaceobject.sprintf)(
    /* translators: %s: block name */
    (0,external_wp_i18n_namespaceobject.__)(
      "your site doesn\u2019t include support for the %s block. you can try installing the block or remove it entirely."
    ),
    originalblock.title || originalname
  );
  const actions = [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      installbutton,
      {
        block: originalblock,
        attributes: props.attributes,
        clientid: props.clientid
      },
      "install"
    )
  ];
  if (hascontent && hashtmlblock) {
    messagehtml = (0,external_wp_i18n_namespaceobject.sprintf)(
      /* translators: %s: block name */
      (0,external_wp_i18n_namespaceobject.__)(
        "your site doesn\u2019t include support for the %s block. you can try installing the block, convert it to a custom html block, or remove it entirely."
      ),
      originalblock.title || originalname
    );
    actions.push(
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_components_namespaceobject.button,
        {
          __next40pxdefaultsize: true,
          onclick: converttohtml,
          variant: "tertiary",
          children: (0,external_wp_i18n_namespaceobject.__)("keep as html")
        },
        "convert"
      )
    );
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { ...(0,external_wp_blockeditor_namespaceobject.useblockprops)(), children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.warning, { actions, children: messagehtml }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.rawhtml, { children: originalundelimitedcontent })
  ] });
};
var get_install_missing_default = getinstallmissing;


;// ./node_modules/@wordpress/block-directory/build-module/plugins/index.js







(0,external_wp_plugins_namespaceobject.registerplugin)("block-directory", {
  // the icon is explicitly set to undefined to prevent pluginprepublishpanel
  // from rendering the fallback icon pluginicon.
  icon: void 0,
  render() {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(autoblockuninstaller, {}),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(inserter_menu_downloadable_blocks_panel_default, {}),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(installedblocksprepublishpanel, {})
    ] });
  }
});
(0,external_wp_hooks_namespaceobject.addfilter)(
  "blocks.registerblocktype",
  "block-directory/fallback",
  (settings, name) => {
    if (name !== "core/missing") {
      return settings;
    }
    settings.edit = get_install_missing_default(settings.edit);
    return settings;
  }
);

;// ./node_modules/@wordpress/block-directory/build-module/index.js




(window.wp = window.wp || {}).blockdirectory = __webpack_exports__;
/******/ })()
;





