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
  navigableregion: () => (/* reexport */ navigable_region_default),
  page: () => (/* reexport */ page_default)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// ./node_modules/clsx/dist/clsx.mjs
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(array.isarray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const dist_clsx = (clsx);
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// ./node_modules/@wordpress/admin-ui/build-module/navigable-region/index.js



const navigableregion = (0,external_wp_element_namespaceobject.forwardref)(
  ({ children, classname, arialabel, as: tag = "div", ...props }, ref) => {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      tag,
      {
        ref,
        classname: dist_clsx("admin-ui-navigable-region", classname),
        "aria-label": arialabel,
        role: "region",
        tabindex: "-1",
        ...props,
        children
      }
    );
  }
);
navigableregion.displayname = "navigableregion";
var navigable_region_default = navigableregion;


;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// ./node_modules/@wordpress/admin-ui/build-module/page/header.js


function header({
  breadcrumbs,
  badges,
  title,
  subtitle,
  actions
}) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { classname: "admin-ui-page__header", as: "header", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
      external_wp_components_namespaceobject.__experimentalhstack,
      {
        classname: "admin-ui-page__header-title",
        justify: "space-between",
        spacing: 2,
        children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalhstack, { spacing: 2, children: [
            title && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentalheading, { as: "h2", level: 3, weight: 500, truncate: true, children: title }),
            breadcrumbs,
            badges
          ] }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_components_namespaceobject.__experimentalhstack,
            {
              style: { width: "auto", flexshrink: 0 },
              spacing: 2,
              classname: "admin-ui-page__header-actions",
              children: actions
            }
          )
        ]
      }
    ),
    subtitle && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "admin-ui-page__header-subtitle", children: subtitle })
  ] });
}


;// ./node_modules/@wordpress/admin-ui/build-module/page/index.js




function page({
  breadcrumbs,
  badges,
  title,
  subtitle,
  children,
  classname,
  actions,
  haspadding = false
}) {
  const classes = dist_clsx("admin-ui-page", classname);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(navigable_region_default, { classname: classes, arialabel: title, children: [
    (title || breadcrumbs || badges) && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      header,
      {
        breadcrumbs,
        badges,
        title,
        subtitle,
        actions
      }
    ),
    haspadding ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "admin-ui-page__content has-padding", children }) : children
  ] });
}
var page_default = page;


;// ./node_modules/@wordpress/admin-ui/build-module/index.js




(window.wp = window.wp || {}).adminui = __webpack_exports__;
/******/ })()
;







