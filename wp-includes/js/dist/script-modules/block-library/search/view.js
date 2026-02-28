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
const interactivity_namespaceobject = x({ ["getcontext"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.getcontext), ["getelement"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.getelement), ["store"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.store), ["withsyncevent"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.withsyncevent) });
;// ./node_modules/@wordpress/block-library/build-module/search/view.js

const { actions } = (0,interactivity_namespaceobject.store)(
  "core/search",
  {
    state: {
      get arialabel() {
        const {
          issearchinputvisible,
          arialabelcollapsed,
          arialabelexpanded
        } = (0,interactivity_namespaceobject.getcontext)();
        return issearchinputvisible ? arialabelexpanded : arialabelcollapsed;
      },
      get ariacontrols() {
        const { issearchinputvisible, inputid } = (0,interactivity_namespaceobject.getcontext)();
        return issearchinputvisible ? null : inputid;
      },
      get type() {
        const { issearchinputvisible } = (0,interactivity_namespaceobject.getcontext)();
        return issearchinputvisible ? "submit" : "button";
      },
      get tabindex() {
        const { issearchinputvisible } = (0,interactivity_namespaceobject.getcontext)();
        return issearchinputvisible ? "0" : "-1";
      }
    },
    actions: {
      opensearchinput: (0,interactivity_namespaceobject.withsyncevent)((event) => {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        if (!ctx.issearchinputvisible) {
          event.preventdefault();
          ctx.issearchinputvisible = true;
          ref.parentelement.queryselector("input").focus();
        }
      }),
      closesearchinput() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        ctx.issearchinputvisible = false;
      },
      handlesearchkeydown: (0,interactivity_namespaceobject.withsyncevent)((event) => {
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        if (event?.key === "escape") {
          actions.closesearchinput();
          ref.queryselector("button").focus();
        }
      }),
      handlesearchfocusout: (0,interactivity_namespaceobject.withsyncevent)((event) => {
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        if (!ref.contains(event.relatedtarget) && event.target !== window.document.activeelement) {
          actions.closesearchinput();
        }
      })
    }
  },
  { lock: true }
);




