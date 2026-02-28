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
const interactivity_namespaceobject = x({ ["getcontext"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.getcontext), ["getelement"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.getelement), ["store"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.store) });
;// ./node_modules/@wordpress/block-editor/build-module/utils/fit-text-utils.js
function findoptimalfontsize(textelement, applyfontsize) {
  const alreadyhasscrollableheight = textelement.scrollheight > textelement.clientheight;
  let minsize = 5;
  let maxsize = 2400;
  let bestsize = minsize;
  const computedstyle = window.getcomputedstyle(textelement);
  let paddingleft = parsefloat(computedstyle.paddingleft) || 0;
  let paddingright = parsefloat(computedstyle.paddingright) || 0;
  const range = document.createrange();
  range.selectnodecontents(textelement);
  let referenceelement = textelement;
  const parentelement = textelement.parentelement;
  if (parentelement) {
    const parentelementcomputedstyle = window.getcomputedstyle(parentelement);
    if (parentelementcomputedstyle?.display === "flex") {
      referenceelement = parentelement;
      paddingleft += parsefloat(parentelementcomputedstyle.paddingleft) || 0;
      paddingright += parsefloat(parentelementcomputedstyle.paddingright) || 0;
    }
  }
  let maxclientheight = referenceelement.clientheight;
  while (minsize <= maxsize) {
    const midsize = math.floor((minsize + maxsize) / 2);
    applyfontsize(midsize);
    const rect = range.getboundingclientrect();
    const textwidth = rect.width;
    const fitswidth = textelement.scrollwidth <= referenceelement.clientwidth && textwidth <= referenceelement.clientwidth - paddingleft - paddingright;
    const fitsheight = alreadyhasscrollableheight || textelement.scrollheight <= referenceelement.clientheight || textelement.scrollheight <= maxclientheight;
    if (referenceelement.clientheight > maxclientheight) {
      maxclientheight = referenceelement.clientheight;
    }
    if (fitswidth && fitsheight) {
      bestsize = midsize;
      minsize = midsize + 1;
    } else {
      maxsize = midsize - 1;
    }
  }
  range.detach();
  return bestsize;
}
function optimizefittext(textelement, applyfontsize) {
  if (!textelement) {
    return;
  }
  applyfontsize(0);
  const optimalsize = findoptimalfontsize(textelement, applyfontsize);
  applyfontsize(optimalsize);
  return optimalsize;
}


;// ./node_modules/@wordpress/block-editor/build-module/utils/fit-text-frontend.js


(0,interactivity_namespaceobject.store)("core/fit-text", {
  callbacks: {
    init() {
      const context = (0,interactivity_namespaceobject.getcontext)();
      const { ref } = (0,interactivity_namespaceobject.getelement)();
      const applyfontsize = (fontsize) => {
        if (fontsize === 0) {
          ref.style.fontsize = "";
        } else {
          ref.style.fontsize = `${fontsize}px`;
        }
      };
      context.fontsize = optimizefittext(ref, applyfontsize);
      if (window.resizeobserver && ref.parentelement) {
        const resizeobserver = new window.resizeobserver(() => {
          context.fontsize = optimizefittext(ref, applyfontsize);
        });
        resizeobserver.observe(ref.parentelement);
        resizeobserver.observe(ref);
        return () => {
          if (resizeobserver) {
            resizeobserver.disconnect();
          }
        };
      }
    }
  }
});



