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
  escapeampersand: () => (/* binding */ escapeampersand),
  escapeattribute: () => (/* binding */ escapeattribute),
  escapeeditablehtml: () => (/* binding */ escapeeditablehtml),
  escapehtml: () => (/* binding */ escapehtml),
  escapelessthan: () => (/* binding */ escapelessthan),
  escapequotationmark: () => (/* binding */ escapequotationmark),
  isvalidattributename: () => (/* binding */ isvalidattributename)
});

;// ./node_modules/@wordpress/escape-html/build-module/escape-greater.js
function __unstableescapegreaterthan(value) {
  return value.replace(/>/g, "&gt;");
}


;// ./node_modules/@wordpress/escape-html/build-module/index.js

const regexp_invalid_attribute_name = /[\u007f-\u009f "'>/="\ufdd0-\ufdef]/;
function escapeampersand(value) {
  return value.replace(/&(?!([a-z0-9]+|#[0-9]+|#x[a-f0-9]+);)/gi, "&amp;");
}
function escapequotationmark(value) {
  return value.replace(/"/g, "&quot;");
}
function escapelessthan(value) {
  return value.replace(/</g, "&lt;");
}
function escapeattribute(value) {
  return __unstableescapegreaterthan(
    escapequotationmark(escapeampersand(value))
  );
}
function escapehtml(value) {
  return escapelessthan(escapeampersand(value));
}
function escapeeditablehtml(value) {
  return escapelessthan(value.replace(/&/g, "&amp;"));
}
function isvalidattributename(name) {
  return !regexp_invalid_attribute_name.test(name);
}


(window.wp = window.wp || {}).escapehtml = __webpack_exports__;
/******/ })()
;



