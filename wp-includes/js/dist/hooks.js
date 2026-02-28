/******/ (() => { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 507:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// exports
__webpack_require__.d(__webpack_exports__, {
  a: () => (/* binding */ createhooks_default)
});

// unused exports: _hooks

;// ./node_modules/@wordpress/hooks/build-module/validatenamespace.js
function validatenamespace(namespace) {
  if ("string" !== typeof namespace || "" === namespace) {
    console.error("the namespace must be a non-empty string.");
    return false;
  }
  if (!/^[a-za-z][a-za-z0-9_.\-\/]*$/.test(namespace)) {
    console.error(
      "the namespace can only contain numbers, letters, dashes, periods, underscores and slashes."
    );
    return false;
  }
  return true;
}
var validatenamespace_default = validatenamespace;


;// ./node_modules/@wordpress/hooks/build-module/validatehookname.js
function validatehookname(hookname) {
  if ("string" !== typeof hookname || "" === hookname) {
    console.error("the hook name must be a non-empty string.");
    return false;
  }
  if (/^__/.test(hookname)) {
    console.error("the hook name cannot begin with `__`.");
    return false;
  }
  if (!/^[a-za-z][a-za-z0-9_.-]*$/.test(hookname)) {
    console.error(
      "the hook name can only contain numbers, letters, dashes, periods and underscores."
    );
    return false;
  }
  return true;
}
var validatehookname_default = validatehookname;


;// ./node_modules/@wordpress/hooks/build-module/createaddhook.js


function createaddhook(hooks, storekey) {
  return function addhook(hookname, namespace, callback, priority = 10) {
    const hooksstore = hooks[storekey];
    if (!validatehookname_default(hookname)) {
      return;
    }
    if (!validatenamespace_default(namespace)) {
      return;
    }
    if ("function" !== typeof callback) {
      console.error("the hook callback must be a function.");
      return;
    }
    if ("number" !== typeof priority) {
      console.error(
        "if specified, the hook priority must be a number."
      );
      return;
    }
    const handler = { callback, priority, namespace };
    if (hooksstore[hookname]) {
      const handlers = hooksstore[hookname].handlers;
      let i;
      for (i = handlers.length; i > 0; i--) {
        if (priority >= handlers[i - 1].priority) {
          break;
        }
      }
      if (i === handlers.length) {
        handlers[i] = handler;
      } else {
        handlers.splice(i, 0, handler);
      }
      hooksstore.__current.foreach((hookinfo) => {
        if (hookinfo.name === hookname && hookinfo.currentindex >= i) {
          hookinfo.currentindex++;
        }
      });
    } else {
      hooksstore[hookname] = {
        handlers: [handler],
        runs: 0
      };
    }
    if (hookname !== "hookadded") {
      hooks.doaction(
        "hookadded",
        hookname,
        namespace,
        callback,
        priority
      );
    }
  };
}
var createaddhook_default = createaddhook;


;// ./node_modules/@wordpress/hooks/build-module/createremovehook.js


function createremovehook(hooks, storekey, removeall = false) {
  return function removehook(hookname, namespace) {
    const hooksstore = hooks[storekey];
    if (!validatehookname_default(hookname)) {
      return;
    }
    if (!removeall && !validatenamespace_default(namespace)) {
      return;
    }
    if (!hooksstore[hookname]) {
      return 0;
    }
    let handlersremoved = 0;
    if (removeall) {
      handlersremoved = hooksstore[hookname].handlers.length;
      hooksstore[hookname] = {
        runs: hooksstore[hookname].runs,
        handlers: []
      };
    } else {
      const handlers = hooksstore[hookname].handlers;
      for (let i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i].namespace === namespace) {
          handlers.splice(i, 1);
          handlersremoved++;
          hooksstore.__current.foreach((hookinfo) => {
            if (hookinfo.name === hookname && hookinfo.currentindex >= i) {
              hookinfo.currentindex--;
            }
          });
        }
      }
    }
    if (hookname !== "hookremoved") {
      hooks.doaction("hookremoved", hookname, namespace);
    }
    return handlersremoved;
  };
}
var createremovehook_default = createremovehook;


;// ./node_modules/@wordpress/hooks/build-module/createhashook.js
function createhashook(hooks, storekey) {
  return function hashook(hookname, namespace) {
    const hooksstore = hooks[storekey];
    if ("undefined" !== typeof namespace) {
      return hookname in hooksstore && hooksstore[hookname].handlers.some(
        (hook) => hook.namespace === namespace
      );
    }
    return hookname in hooksstore;
  };
}
var createhashook_default = createhashook;


;// ./node_modules/@wordpress/hooks/build-module/createrunhook.js
function createrunhook(hooks, storekey, returnfirstarg, async) {
  return function runhook(hookname, ...args) {
    const hooksstore = hooks[storekey];
    if (!hooksstore[hookname]) {
      hooksstore[hookname] = {
        handlers: [],
        runs: 0
      };
    }
    hooksstore[hookname].runs++;
    const handlers = hooksstore[hookname].handlers;
    if (false) {}
    if (!handlers || !handlers.length) {
      return returnfirstarg ? args[0] : void 0;
    }
    const hookinfo = {
      name: hookname,
      currentindex: 0
    };
    async function asyncrunner() {
      try {
        hooksstore.__current.add(hookinfo);
        let result = returnfirstarg ? args[0] : void 0;
        while (hookinfo.currentindex < handlers.length) {
          const handler = handlers[hookinfo.currentindex];
          result = await handler.callback.apply(null, args);
          if (returnfirstarg) {
            args[0] = result;
          }
          hookinfo.currentindex++;
        }
        return returnfirstarg ? result : void 0;
      } finally {
        hooksstore.__current.delete(hookinfo);
      }
    }
    function syncrunner() {
      try {
        hooksstore.__current.add(hookinfo);
        let result = returnfirstarg ? args[0] : void 0;
        while (hookinfo.currentindex < handlers.length) {
          const handler = handlers[hookinfo.currentindex];
          result = handler.callback.apply(null, args);
          if (returnfirstarg) {
            args[0] = result;
          }
          hookinfo.currentindex++;
        }
        return returnfirstarg ? result : void 0;
      } finally {
        hooksstore.__current.delete(hookinfo);
      }
    }
    return (async ? asyncrunner : syncrunner)();
  };
}
var createrunhook_default = createrunhook;


;// ./node_modules/@wordpress/hooks/build-module/createcurrenthook.js
function createcurrenthook(hooks, storekey) {
  return function currenthook() {
    const hooksstore = hooks[storekey];
    const currentarray = array.from(hooksstore.__current);
    return currentarray.at(-1)?.name ?? null;
  };
}
var createcurrenthook_default = createcurrenthook;


;// ./node_modules/@wordpress/hooks/build-module/createdoinghook.js
function createdoinghook(hooks, storekey) {
  return function doinghook(hookname) {
    const hooksstore = hooks[storekey];
    if ("undefined" === typeof hookname) {
      return hooksstore.__current.size > 0;
    }
    return array.from(hooksstore.__current).some(
      (hook) => hook.name === hookname
    );
  };
}
var createdoinghook_default = createdoinghook;


;// ./node_modules/@wordpress/hooks/build-module/createdidhook.js

function createdidhook(hooks, storekey) {
  return function didhook(hookname) {
    const hooksstore = hooks[storekey];
    if (!validatehookname_default(hookname)) {
      return;
    }
    return hooksstore[hookname] && hooksstore[hookname].runs ? hooksstore[hookname].runs : 0;
  };
}
var createdidhook_default = createdidhook;


;// ./node_modules/@wordpress/hooks/build-module/createhooks.js







class _hooks {
  actions;
  filters;
  addaction;
  addfilter;
  removeaction;
  removefilter;
  hasaction;
  hasfilter;
  removeallactions;
  removeallfilters;
  doaction;
  doactionasync;
  applyfilters;
  applyfiltersasync;
  currentaction;
  currentfilter;
  doingaction;
  doingfilter;
  didaction;
  didfilter;
  constructor() {
    this.actions = /* @__pure__ */ object.create(null);
    this.actions.__current = /* @__pure__ */ new set();
    this.filters = /* @__pure__ */ object.create(null);
    this.filters.__current = /* @__pure__ */ new set();
    this.addaction = createaddhook_default(this, "actions");
    this.addfilter = createaddhook_default(this, "filters");
    this.removeaction = createremovehook_default(this, "actions");
    this.removefilter = createremovehook_default(this, "filters");
    this.hasaction = createhashook_default(this, "actions");
    this.hasfilter = createhashook_default(this, "filters");
    this.removeallactions = createremovehook_default(this, "actions", true);
    this.removeallfilters = createremovehook_default(this, "filters", true);
    this.doaction = createrunhook_default(this, "actions", false, false);
    this.doactionasync = createrunhook_default(this, "actions", false, true);
    this.applyfilters = createrunhook_default(this, "filters", true, false);
    this.applyfiltersasync = createrunhook_default(this, "filters", true, true);
    this.currentaction = createcurrenthook_default(this, "actions");
    this.currentfilter = createcurrenthook_default(this, "filters");
    this.doingaction = createdoinghook_default(this, "actions");
    this.doingfilter = createdoinghook_default(this, "filters");
    this.didaction = createdidhook_default(this, "actions");
    this.didfilter = createdidhook_default(this, "filters");
  }
}
function createhooks() {
  return new _hooks();
}
var createhooks_default = createhooks;



/***/ }),

/***/ 8770:
/***/ (() => {



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
var __webpack_exports__ = {};
// this entry needs to be wrapped in an iife because it needs to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actions: () => (/* binding */ actions),
/* harmony export */   addaction: () => (/* binding */ addaction),
/* harmony export */   addfilter: () => (/* binding */ addfilter),
/* harmony export */   applyfilters: () => (/* binding */ applyfilters),
/* harmony export */   applyfiltersasync: () => (/* binding */ applyfiltersasync),
/* harmony export */   createhooks: () => (/* reexport safe */ _createhooks__webpack_imported_module_1__.a),
/* harmony export */   currentaction: () => (/* binding */ currentaction),
/* harmony export */   currentfilter: () => (/* binding */ currentfilter),
/* harmony export */   defaulthooks: () => (/* binding */ defaulthooks),
/* harmony export */   didaction: () => (/* binding */ didaction),
/* harmony export */   didfilter: () => (/* binding */ didfilter),
/* harmony export */   doaction: () => (/* binding */ doaction),
/* harmony export */   doactionasync: () => (/* binding */ doactionasync),
/* harmony export */   doingaction: () => (/* binding */ doingaction),
/* harmony export */   doingfilter: () => (/* binding */ doingfilter),
/* harmony export */   filters: () => (/* binding */ filters),
/* harmony export */   hasaction: () => (/* binding */ hasaction),
/* harmony export */   hasfilter: () => (/* binding */ hasfilter),
/* harmony export */   removeaction: () => (/* binding */ removeaction),
/* harmony export */   removeallactions: () => (/* binding */ removeallactions),
/* harmony export */   removeallfilters: () => (/* binding */ removeallfilters),
/* harmony export */   removefilter: () => (/* binding */ removefilter)
/* harmony export */ });
/* harmony import */ var _createhooks__webpack_imported_module_1__ = __webpack_require__(507);
/* harmony import */ var _types__webpack_imported_module_0__ = __webpack_require__(8770);
/* harmony import */ var _types__webpack_imported_module_0___default = /*#__pure__*/__webpack_require__.n(_types__webpack_imported_module_0__);
/* harmony reexport (unknown) */ var __webpack_reexport_object__ = {};
/* harmony reexport (unknown) */ for(const __webpack_import_key__ in _types__webpack_imported_module_0__) if(["default","actions","addaction","addfilter","applyfilters","applyfiltersasync","createhooks","currentaction","currentfilter","defaulthooks","didaction","didfilter","doaction","doactionasync","doingaction","doingfilter","filters","hasaction","hasfilter","removeaction","removeallactions","removeallfilters","removefilter"].indexof(__webpack_import_key__) < 0) __webpack_reexport_object__[__webpack_import_key__] = () => _types__webpack_imported_module_0__[__webpack_import_key__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __webpack_reexport_object__);


const defaulthooks = (0,_createhooks__webpack_imported_module_1__/* ["default"] */ .a)();
const {
  addaction,
  addfilter,
  removeaction,
  removefilter,
  hasaction,
  hasfilter,
  removeallactions,
  removeallfilters,
  doaction,
  doactionasync,
  applyfilters,
  applyfiltersasync,
  currentaction,
  currentfilter,
  doingaction,
  doingfilter,
  didaction,
  didfilter,
  actions,
  filters
} = defaulthooks;


})();

(window.wp = window.wp || {}).hooks = __webpack_exports__;
/******/ })()
;






