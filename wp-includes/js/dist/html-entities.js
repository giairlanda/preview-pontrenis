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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decodeentities: () => (/* binding */ decodeentities)
/* harmony export */ });
let _decodetextarea;
function decodeentities(html) {
  if ("string" !== typeof html || -1 === html.indexof("&")) {
    return html;
  }
  if (void 0 === _decodetextarea) {
    if (document.implementation && document.implementation.createhtmldocument) {
      _decodetextarea = document.implementation.createhtmldocument("").createelement("textarea");
    } else {
      _decodetextarea = document.createelement("textarea");
    }
  }
  _decodetextarea.innerhtml = html;
  const decoded = _decodetextarea.textcontent ?? "";
  _decodetextarea.innerhtml = "";
  return decoded;
}


(window.wp = window.wp || {}).htmlentities = __webpack_exports__;
/******/ })()
;



