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
/* harmony export */   createbloburl: () => (/* binding */ createbloburl),
/* harmony export */   downloadblob: () => (/* binding */ downloadblob),
/* harmony export */   getblobbyurl: () => (/* binding */ getblobbyurl),
/* harmony export */   getblobtypebyurl: () => (/* binding */ getblobtypebyurl),
/* harmony export */   isbloburl: () => (/* binding */ isbloburl),
/* harmony export */   revokebloburl: () => (/* binding */ revokebloburl)
/* harmony export */ });
const cache = {};
function createbloburl(file) {
  const url = window.url.createobjecturl(file);
  cache[url] = file;
  return url;
}
function getblobbyurl(url) {
  return cache[url];
}
function getblobtypebyurl(url) {
  return getblobbyurl(url)?.type.split("/")[0];
}
function revokebloburl(url) {
  if (cache[url]) {
    window.url.revokeobjecturl(url);
  }
  delete cache[url];
}
function isbloburl(url) {
  if (!url || !url.indexof) {
    return false;
  }
  return url.indexof("blob:") === 0;
}
function downloadblob(filename, content, contenttype = "") {
  if (!filename || !content) {
    return;
  }
  const file = new window.blob([content], { type: contenttype });
  const url = window.url.createobjecturl(file);
  const anchorelement = document.createelement("a");
  anchorelement.href = url;
  anchorelement.download = filename;
  anchorelement.style.display = "none";
  document.body.appendchild(anchorelement);
  anchorelement.click();
  document.body.removechild(anchorelement);
  window.url.revokeobjecturl(url);
}


(window.wp = window.wp || {}).blob = __webpack_exports__;
/******/ })()
;

