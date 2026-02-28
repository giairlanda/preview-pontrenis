import * as __webpack_external_module__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ 438:
/***/ ((module) => {

module.exports = import("@wordpress/interactivity-router");;

/***/ })

/******/ });
/************************************************************************/
/******/ // the module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // the require function
/******/ function __webpack_require__(moduleid) {
/******/ 	// check if module is in cache
/******/ 	var cachedmodule = __webpack_module_cache__[moduleid];
/******/ 	if (cachedmodule !== undefined) {
/******/ 		return cachedmodule.exports;
/******/ 	}
/******/ 	// create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleid] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// execute the module function
/******/ 	__webpack_modules__[moduleid](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// return the exports of the module
/******/ 	return module.exports;
/******/ }
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
;// ./node_modules/@wordpress/block-library/build-module/query/view.js

const isvalidlink = (ref) => ref && ref instanceof window.htmlanchorelement && ref.href && (!ref.target || ref.target === "_self") && ref.origin === window.location.origin;
const isvalidevent = (event) => event.button === 0 && // left clicks only.
!event.metakey && // open in new tab (mac).
!event.ctrlkey && // open in new tab (windows).
!event.altkey && // download.
!event.shiftkey && !event.defaultprevented;
(0,interactivity_namespaceobject.store)(
  "core/query",
  {
    actions: {
      navigate: (0,interactivity_namespaceobject.withsyncevent)(function* (event) {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        const queryref = ref.closest(
          ".wp-block-query[data-wp-router-region]"
        );
        if (isvalidlink(ref) && isvalidevent(event)) {
          event.preventdefault();
          const { actions } = yield promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 438));
          yield actions.navigate(ref.href);
          ctx.url = ref.href;
          const firstanchor = `.wp-block-post-template a[href]`;
          queryref.queryselector(firstanchor)?.focus();
        }
      }),
      *prefetch() {
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        if (isvalidlink(ref)) {
          const { actions } = yield promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 438));
          yield actions.prefetch(ref.href);
        }
      }
    },
    callbacks: {
      *prefetch() {
        const { url } = (0,interactivity_namespaceobject.getcontext)();
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        if (url && isvalidlink(ref)) {
          const { actions } = yield promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 438));
          yield actions.prefetch(ref.href);
        }
      }
    }
  },
  { lock: true }
);




