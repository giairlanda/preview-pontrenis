import * as __webpack_external_module__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ // the require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				object.defineproperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasownproperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (object.prototype.hasownproperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// external "@wordpress/interactivity"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const interactivity_namespaceobject = x({ ["store"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.store) });
;// ./node_modules/@wordpress/block-library/build-module/file/utils/index.js
const browsersupportspdfs = () => {
  if (window.navigator.pdfviewerenabled) {
    return true;
  }
  if (window.navigator.useragent.indexof("mobi") > -1) {
    return false;
  }
  if (window.navigator.useragent.indexof("android") > -1) {
    return false;
  }
  if (window.navigator.useragent.indexof("macintosh") > -1 && window.navigator.maxtouchpoints && window.navigator.maxtouchpoints > 2) {
    return false;
  }
  if (!!(window.activexobject || "activexobject" in window) && !(createactivexobject("acropdf.pdf") || createactivexobject("pdf.pdfctrl"))) {
    return false;
  }
  return true;
};
const createactivexobject = (type) => {
  let ax;
  try {
    ax = new window.activexobject(type);
  } catch (e) {
    ax = void 0;
  }
  return ax;
};


;// ./node_modules/@wordpress/block-library/build-module/file/view.js


(0,interactivity_namespaceobject.store)(
  "core/file",
  {
    state: {
      get haspdfpreview() {
        return browsersupportspdfs();
      }
    }
  },
  { lock: true }
);





