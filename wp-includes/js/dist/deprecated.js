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
  "default": () => (/* binding */ deprecated)
});

// unused exports: logged

;// external ["wp","hooks"]
const external_wp_hooks_namespaceobject = window["wp"]["hooks"];
;// ./node_modules/@wordpress/deprecated/build-module/index.js

const logged = /* @__pure__ */ object.create(null);
function deprecated(feature, options = {}) {
  const { since, version, alternative, plugin, link, hint } = options;
  const pluginmessage = plugin ? ` from ${plugin}` : "";
  const sincemessage = since ? ` since version ${since}` : "";
  const versionmessage = version ? ` and will be removed${pluginmessage} in version ${version}` : "";
  const useinsteadmessage = alternative ? ` please use ${alternative} instead.` : "";
  const linkmessage = link ? ` see: ${link}` : "";
  const hintmessage = hint ? ` note: ${hint}` : "";
  const message = `${feature} is deprecated${sincemessage}${versionmessage}.${useinsteadmessage}${linkmessage}${hintmessage}`;
  if (message in logged) {
    return;
  }
  (0,external_wp_hooks_namespaceobject.doaction)("deprecated", feature, options, message);
  console.warn(message);
  logged[message] = true;
}


(window.wp = window.wp || {}).deprecated = __webpack_exports__["default"];
/******/ })()
;




