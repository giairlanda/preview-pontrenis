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
;// ./node_modules/@wordpress/block-library/build-module/navigation/view.js

const focusableselectors = [
  "a[href]",
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  "select:not([disabled]):not([aria-hidden])",
  "textarea:not([disabled]):not([aria-hidden])",
  "button:not([disabled]):not([aria-hidden])",
  "[contenteditable]",
  '[tabindex]:not([tabindex^="-"])'
];
document.addeventlistener("click", () => {
});
const { state, actions } = (0,interactivity_namespaceobject.store)(
  "core/navigation",
  {
    state: {
      get roleattribute() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        return ctx.type === "overlay" && state.ismenuopen ? "dialog" : null;
      },
      get ariamodal() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        return ctx.type === "overlay" && state.ismenuopen ? "true" : null;
      },
      get arialabel() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        return ctx.type === "overlay" && state.ismenuopen ? ctx.arialabel : null;
      },
      get ismenuopen() {
        return object.values(state.menuopenedby).filter(boolean).length > 0;
      },
      get menuopenedby() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        return ctx.type === "overlay" ? ctx.overlayopenedby : ctx.submenuopenedby;
      }
    },
    actions: {
      openmenuonhover() {
        const { type, overlayopenedby } = (0,interactivity_namespaceobject.getcontext)();
        if (type === "submenu" && // only open on hover if the overlay is closed.
        object.values(overlayopenedby || {}).filter(boolean).length === 0) {
          actions.openmenu("hover");
        }
      },
      closemenuonhover() {
        const { type, overlayopenedby } = (0,interactivity_namespaceobject.getcontext)();
        if (type === "submenu" && // only close on hover if the overlay is closed.
        object.values(overlayopenedby || {}).filter(boolean).length === 0) {
          actions.closemenu("hover");
        }
      },
      openmenuonclick() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        ctx.previousfocus = ref;
        actions.openmenu("click");
      },
      closemenuonclick() {
        actions.closemenu("click");
        actions.closemenu("focus");
      },
      openmenuonfocus() {
        actions.openmenu("focus");
      },
      togglemenuonclick() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        if (window.document.activeelement !== ref) {
          ref.focus();
        }
        const { menuopenedby } = state;
        if (menuopenedby.click || menuopenedby.focus) {
          actions.closemenu("click");
          actions.closemenu("focus");
        } else {
          ctx.previousfocus = ref;
          actions.openmenu("click");
        }
      },
      handlemenukeydown: (0,interactivity_namespaceobject.withsyncevent)((event) => {
        const { type, firstfocusableelement, lastfocusableelement } = (0,interactivity_namespaceobject.getcontext)();
        if (state.menuopenedby.click) {
          if (event.key === "escape") {
            event.stoppropagation();
            actions.closemenu("click");
            actions.closemenu("focus");
            return;
          }
          if (type === "overlay" && event.key === "tab") {
            if (event.shiftkey && window.document.activeelement === firstfocusableelement) {
              event.preventdefault();
              lastfocusableelement.focus();
            } else if (!event.shiftkey && window.document.activeelement === lastfocusableelement) {
              event.preventdefault();
              firstfocusableelement.focus();
            }
          }
        }
      }),
      handlemenufocusout: (0,interactivity_namespaceobject.withsyncevent)((event) => {
        const { modal, type } = (0,interactivity_namespaceobject.getcontext)();
        if (event.relatedtarget === null || !modal?.contains(event.relatedtarget) && event.target !== window.document.activeelement && type === "submenu") {
          actions.closemenu("click");
          actions.closemenu("focus");
        }
      }),
      openmenu(menuopenedon = "click") {
        const { type } = (0,interactivity_namespaceobject.getcontext)();
        state.menuopenedby[menuopenedon] = true;
        if (type === "overlay") {
          document.documentelement.classlist.add("has-modal-open");
        }
      },
      closemenu(menuclosedon = "click") {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        state.menuopenedby[menuclosedon] = false;
        if (!state.ismenuopen) {
          if (ctx.modal?.contains(window.document.activeelement)) {
            ctx.previousfocus?.focus();
          }
          ctx.modal = null;
          ctx.previousfocus = null;
          if (ctx.type === "overlay") {
            document.documentelement.classlist.remove(
              "has-modal-open"
            );
          }
        }
      }
    },
    callbacks: {
      initmenu() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        if (state.ismenuopen) {
          const focusableelements = ref.queryselectorall(focusableselectors);
          ctx.modal = ref;
          ctx.firstfocusableelement = focusableelements[0];
          ctx.lastfocusableelement = focusableelements[focusableelements.length - 1];
        }
      },
      focusfirstelement() {
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        if (state.ismenuopen) {
          const focusableelements = ref.queryselectorall(focusableselectors);
          focusableelements?.[0]?.focus();
        }
      }
    }
  },
  { lock: true }
);







