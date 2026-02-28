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
/************************************************************************/
var __webpack_exports__ = {};

// exports
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ warning)
});

;// ./node_modules/@wordpress/warning/build-module/utils.js
const logged = /* @__pure__ */ new set();


;// ./node_modules/@wordpress/warning/build-module/index.js

function isdev() {
  return true === true;
}
function warning(message) {
  if (!isdev()) {
    return;
  }
  if (logged.has(message)) {
    return;
  }
  console.warn(message);
  try {
    throw error(message);
  } catch (x) {
  }
  logged.add(message);
}


(window.wp = window.wp || {}).warning = __webpack_exports__["default"];
/******/ })()
;





