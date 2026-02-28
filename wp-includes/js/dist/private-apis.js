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
  __dangerousoptintounstableapisonlyforcoremodules: () => (/* reexport */ __dangerousoptintounstableapisonlyforcoremodules)
});

;// ./node_modules/@wordpress/private-apis/build-module/implementation.js
const core_modules_using_private_apis = [
  "@wordpress/block-directory",
  "@wordpress/block-editor",
  "@wordpress/block-library",
  "@wordpress/blocks",
  "@wordpress/commands",
  "@wordpress/components",
  "@wordpress/core-commands",
  "@wordpress/core-data",
  "@wordpress/customize-widgets",
  "@wordpress/data",
  "@wordpress/edit-post",
  "@wordpress/edit-site",
  "@wordpress/edit-widgets",
  "@wordpress/editor",
  "@wordpress/format-library",
  "@wordpress/patterns",
  "@wordpress/preferences",
  "@wordpress/reusable-blocks",
  "@wordpress/router",
  "@wordpress/sync",
  "@wordpress/dataviews",
  "@wordpress/fields",
  "@wordpress/media-utils",
  "@wordpress/upload-media"
];
const registeredprivateapis = [];
const requiredconsent = "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.";
const allowreregistration =  true ? false : 0;
const __dangerousoptintounstableapisonlyforcoremodules = (consent, modulename) => {
  if (!core_modules_using_private_apis.includes(modulename)) {
    throw new error(
      `you tried to opt-in to unstable apis as module "${modulename}". this feature is only for javascript modules shipped with wordpress core. please do not use it in plugins and themes as the unstable apis will be removed without a warning. if you ignore this error and depend on unstable features, your product will inevitably break on one of the next wordpress releases.`
    );
  }
  if (!allowreregistration && registeredprivateapis.includes(modulename)) {
    throw new error(
      `you tried to opt-in to unstable apis as module "${modulename}" which is already registered. this feature is only for javascript modules shipped with wordpress core. please do not use it in plugins and themes as the unstable apis will be removed without a warning. if you ignore this error and depend on unstable features, your product will inevitably break on one of the next wordpress releases.`
    );
  }
  if (consent !== requiredconsent) {
    throw new error(
      `you tried to opt-in to unstable apis without confirming you know the consequences. this feature is only for javascript modules shipped with wordpress core. please do not use it in plugins and themes as the unstable apis will removed without a warning. if you ignore this error and depend on unstable features, your product will inevitably break on the next wordpress release.`
    );
  }
  registeredprivateapis.push(modulename);
  return {
    lock,
    unlock
  };
};
function lock(object, privatedata) {
  if (!object) {
    throw new error("cannot lock an undefined object.");
  }
  const _object = object;
  if (!(__private in _object)) {
    _object[__private] = {};
  }
  lockeddata.set(_object[__private], privatedata);
}
function unlock(object) {
  if (!object) {
    throw new error("cannot unlock an undefined object.");
  }
  const _object = object;
  if (!(__private in _object)) {
    throw new error(
      "cannot unlock an object that was not locked before. "
    );
  }
  return lockeddata.get(_object[__private]);
}
const lockeddata = /* @__pure__ */ new weakmap();
const __private = symbol("private api id");
function allowcoremodule(name) {
  core_modules_using_private_apis.push(name);
}
function resetallowedcoremodules() {
  while (core_modules_using_private_apis.length) {
    core_modules_using_private_apis.pop();
  }
}
function resetregisteredprivateapis() {
  while (registeredprivateapis.length) {
    registeredprivateapis.pop();
  }
}


;// ./node_modules/@wordpress/private-apis/build-module/index.js



(window.wp = window.wp || {}).privateapis = __webpack_exports__;
/******/ })()
;






