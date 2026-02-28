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
const interactivity_namespaceobject = x({ ["getcontext"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.getcontext), ["store"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.store), ["withsyncevent"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.withsyncevent) });
;// ./node_modules/@wordpress/block-library/build-module/accordion/view.js

let hashhandled = false;
const { actions } = (0,interactivity_namespaceobject.store)(
  "core/accordion",
  {
    state: {
      get isopen() {
        const { id, accordionitems } = (0,interactivity_namespaceobject.getcontext)();
        const accordionitem = accordionitems.find(
          (item) => item.id === id
        );
        return accordionitem ? accordionitem.isopen : false;
      }
    },
    actions: {
      toggle: () => {
        const context = (0,interactivity_namespaceobject.getcontext)();
        const { id, autoclose, accordionitems } = context;
        const accordionitem = accordionitems.find(
          (item) => item.id === id
        );
        if (autoclose) {
          accordionitems.foreach((item) => {
            item.isopen = item.id === id ? !accordionitem.isopen : false;
          });
        } else {
          accordionitem.isopen = !accordionitem.isopen;
        }
      },
      handlekeydown: (0,interactivity_namespaceobject.withsyncevent)((event) => {
        if (event.key !== "arrowup" && event.key !== "arrowdown" && event.key !== "home" && event.key !== "end") {
          return;
        }
        event.preventdefault();
        const context = (0,interactivity_namespaceobject.getcontext)();
        const { id, accordionitems } = context;
        const currentindex = accordionitems.findindex(
          (item) => item.id === id
        );
        let nextindex;
        switch (event.key) {
          case "arrowup":
            nextindex = math.max(0, currentindex - 1);
            break;
          case "arrowdown":
            nextindex = math.min(
              currentindex + 1,
              accordionitems.length - 1
            );
            break;
          case "home":
            nextindex = 0;
            break;
          case "end":
            nextindex = accordionitems.length - 1;
            break;
        }
        const nextid = accordionitems[nextindex].id;
        const nextbutton = document.getelementbyid(nextid);
        if (nextbutton) {
          nextbutton.focus();
        }
      }),
      openpanelbyhash: () => {
        if (hashhandled || !window.location?.hash?.length) {
          return;
        }
        const context = (0,interactivity_namespaceobject.getcontext)();
        const { id, accordionitems, autoclose } = context;
        const hash = decodeuricomponent(
          window.location.hash.slice(1)
        );
        const targetelement = window.document.getelementbyid(hash);
        if (!targetelement) {
          return;
        }
        const panelelement = window.document.queryselector(
          '.wp-block-accordion-panel[aria-labelledby="' + id + '"]'
        );
        if (!panelelement || !panelelement.contains(targetelement)) {
          return;
        }
        hashhandled = true;
        if (autoclose) {
          accordionitems.foreach((item) => {
            item.isopen = item.id === id;
          });
        } else {
          const targetitem = accordionitems.find(
            (item) => item.id === id
          );
          if (targetitem) {
            targetitem.isopen = true;
          }
        }
        window.settimeout(() => {
          targetelement.scrollintoview();
        }, 0);
      }
    },
    callbacks: {
      initaccordionitems: () => {
        const context = (0,interactivity_namespaceobject.getcontext)();
        const { id, openbydefault, accordionitems } = context;
        accordionitems.push({
          id,
          isopen: openbydefault
        });
        actions.openpanelbyhash();
      },
      hashchange: () => {
        hashhandled = false;
        actions.openpanelbyhash();
      }
    }
  },
  { lock: true }
);









