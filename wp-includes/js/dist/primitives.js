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
  blockquotation: () => (/* reexport */ blockquotation),
  circle: () => (/* reexport */ circle),
  defs: () => (/* reexport */ defs),
  g: () => (/* reexport */ g),
  horizontalrule: () => (/* reexport */ horizontalrule),
  line: () => (/* reexport */ line),
  lineargradient: () => (/* reexport */ lineargradient),
  path: () => (/* reexport */ path),
  polygon: () => (/* reexport */ polygon),
  radialgradient: () => (/* reexport */ radialgradient),
  rect: () => (/* reexport */ rect),
  svg: () => (/* reexport */ svg),
  stop: () => (/* reexport */ stop),
  view: () => (/* reexport */ view)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// ./node_modules/clsx/dist/clsx.mjs
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(array.isarray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const dist_clsx = (clsx);
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// ./node_modules/@wordpress/primitives/build-module/svg/index.js



const circle = (props) => (0,external_wp_element_namespaceobject.createelement)("circle", props);
const g = (props) => (0,external_wp_element_namespaceobject.createelement)("g", props);
const line = (props) => (0,external_wp_element_namespaceobject.createelement)("line", props);
const path = (props) => (0,external_wp_element_namespaceobject.createelement)("path", props);
const polygon = (props) => (0,external_wp_element_namespaceobject.createelement)("polygon", props);
const rect = (props) => (0,external_wp_element_namespaceobject.createelement)("rect", props);
const defs = (props) => (0,external_wp_element_namespaceobject.createelement)("defs", props);
const radialgradient = (props) => (0,external_wp_element_namespaceobject.createelement)("radialgradient", props);
const lineargradient = (props) => (0,external_wp_element_namespaceobject.createelement)("lineargradient", props);
const stop = (props) => (0,external_wp_element_namespaceobject.createelement)("stop", props);
const svg = (0,external_wp_element_namespaceobject.forwardref)(
  /**
   * @param {svgprops}                                    props ispressed indicates whether the svg should appear as pressed.
   *                                                            other props will be passed through to svg component.
   * @param {import('react').forwardedref<svgsvgelement>} ref   the forwarded ref to the svg element.
   *
   * @return {jsx.element} stop component
   */
  ({ classname, ispressed, ...props }, ref) => {
    const appliedprops = {
      ...props,
      classname: dist_clsx(classname, { "is-pressed": ispressed }) || void 0,
      "aria-hidden": true,
      focusable: false
    };
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("svg", { ...appliedprops, ref });
  }
);
svg.displayname = "svg";


;// ./node_modules/@wordpress/primitives/build-module/horizontal-rule/index.js
const horizontalrule = "hr";


;// ./node_modules/@wordpress/primitives/build-module/block-quotation/index.js
const blockquotation = "blockquote";


;// ./node_modules/@wordpress/primitives/build-module/view/index.js
const view = "div";


;// ./node_modules/@wordpress/primitives/build-module/index.js





(window.wp = window.wp || {}).primitives = __webpack_exports__;
/******/ })()
;







