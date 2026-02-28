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
  __unstableawaitpromise: () => (/* binding */ __unstableawaitpromise),
  apifetch: () => (/* binding */ apifetch),
  controls: () => (/* binding */ controls),
  dispatch: () => (/* binding */ dispatch),
  select: () => (/* binding */ build_module_select),
  syncselect: () => (/* binding */ syncselect)
});

;// external ["wp","apifetch"]
const external_wp_apifetch_namespaceobject = window["wp"]["apifetch"];
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_namespaceobject);
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// ./node_modules/@wordpress/data-controls/build-module/index.js



function apifetch(request) {
  return {
    type: "api_fetch",
    request
  };
}
function build_module_select(storenameordescriptor, selectorname, ...args) {
  external_wp_deprecated_default()("`select` control in `@wordpress/data-controls`", {
    since: "5.7",
    alternative: "built-in `resolveselect` control in `@wordpress/data`"
  });
  return external_wp_data_namespaceobject.controls.resolveselect(
    storenameordescriptor,
    selectorname,
    ...args
  );
}
function syncselect(storenameordescriptor, selectorname, ...args) {
  external_wp_deprecated_default()("`syncselect` control in `@wordpress/data-controls`", {
    since: "5.7",
    alternative: "built-in `select` control in `@wordpress/data`"
  });
  return external_wp_data_namespaceobject.controls.select(storenameordescriptor, selectorname, ...args);
}
function dispatch(storenameordescriptor, actionname, ...args) {
  external_wp_deprecated_default()("`dispatch` control in `@wordpress/data-controls`", {
    since: "5.7",
    alternative: "built-in `dispatch` control in `@wordpress/data`"
  });
  return external_wp_data_namespaceobject.controls.dispatch(storenameordescriptor, actionname, ...args);
}
const __unstableawaitpromise = function(promise) {
  return {
    type: "await_promise",
    promise
  };
};
const controls = {
  await_promise({ promise }) {
    return promise;
  },
  api_fetch({ request }) {
    return external_wp_apifetch_default()(request);
  }
};


(window.wp = window.wp || {}).datacontrols = __webpack_exports__;
/******/ })()
;

