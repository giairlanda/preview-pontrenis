/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	// the require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getdefaultexport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esmodule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
  dottip: () => (/* reexport */ dot_tip_default),
  store: () => (/* reexport */ store)
});

// namespace object: ./node_modules/@wordpress/nux/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  disabletips: () => (disabletips),
  dismisstip: () => (dismisstip),
  enabletips: () => (enabletips),
  triggerguide: () => (triggerguide)
});

// namespace object: ./node_modules/@wordpress/nux/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  aretipsenabled: () => (selectors_aretipsenabled),
  getassociatedguide: () => (getassociatedguide),
  istipvisible: () => (istipvisible)
});

;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/nux/build-module/store/reducer.js

function guides(state = [], action) {
  switch (action.type) {
    case "trigger_guide":
      return [...state, action.tipids];
  }
  return state;
}
function aretipsenabled(state = true, action) {
  switch (action.type) {
    case "disable_tips":
      return false;
    case "enable_tips":
      return true;
  }
  return state;
}
function dismissedtips(state = {}, action) {
  switch (action.type) {
    case "dismiss_tip":
      return {
        ...state,
        [action.id]: true
      };
    case "enable_tips":
      return {};
  }
  return state;
}
const preferences = (0,external_wp_data_namespaceobject.combinereducers)({ aretipsenabled, dismissedtips });
var reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({ guides, preferences });


;// ./node_modules/@wordpress/nux/build-module/store/actions.js
function triggerguide(tipids) {
  return {
    type: "trigger_guide",
    tipids
  };
}
function dismisstip(id) {
  return {
    type: "dismiss_tip",
    id
  };
}
function disabletips() {
  return {
    type: "disable_tips"
  };
}
function enabletips() {
  return {
    type: "enable_tips"
  };
}


;// ./node_modules/@wordpress/nux/build-module/store/selectors.js

const getassociatedguide = (0,external_wp_data_namespaceobject.createselector)(
  (state, tipid) => {
    for (const tipids of state.guides) {
      if (tipids.includes(tipid)) {
        const nondismissedtips = tipids.filter(
          (tid) => !object.keys(
            state.preferences.dismissedtips
          ).includes(tid)
        );
        const [currenttipid = null, nexttipid = null] = nondismissedtips;
        return { tipids, currenttipid, nexttipid };
      }
    }
    return null;
  },
  (state) => [state.guides, state.preferences.dismissedtips]
);
function istipvisible(state, tipid) {
  if (!state.preferences.aretipsenabled) {
    return false;
  }
  if (state.preferences.dismissedtips?.hasownproperty(tipid)) {
    return false;
  }
  const associatedguide = getassociatedguide(state, tipid);
  if (associatedguide && associatedguide.currenttipid !== tipid) {
    return false;
  }
  return true;
}
function selectors_aretipsenabled(state) {
  return state.preferences.aretipsenabled;
}


;// ./node_modules/@wordpress/nux/build-module/store/index.js




const store_name = "core/nux";
const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  reducer: reducer_default,
  actions: actions_namespaceobject,
  selectors: selectors_namespaceobject,
  persist: ["preferences"]
});
(0,external_wp_data_namespaceobject.registerstore)(store_name, {
  reducer: reducer_default,
  actions: actions_namespaceobject,
  selectors: selectors_namespaceobject,
  persist: ["preferences"]
});


;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/close.js


var close_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m13.06 12 6.47-6.47-1.06-1.06l12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06l12 13.06l6.47 6.47 1.06-1.06l13.06 12z" }) });


;// ./node_modules/@wordpress/nux/build-module/components/dot-tip/index.js








function onclick(event) {
  event.stoppropagation();
}
function dottip({
  position = "middle right",
  children,
  isvisible,
  hasnexttip,
  ondismiss,
  ondisable
}) {
  const anchorparent = (0,external_wp_element_namespaceobject.useref)(null);
  const onfocusoutsidecallback = (0,external_wp_element_namespaceobject.usecallback)(
    (event) => {
      if (!anchorparent.current) {
        return;
      }
      if (anchorparent.current.contains(event.relatedtarget)) {
        return;
      }
      ondisable();
    },
    [ondisable, anchorparent]
  );
  if (!isvisible) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    external_wp_components_namespaceobject.popover,
    {
      classname: "nux-dot-tip",
      position,
      focusonmount: true,
      role: "dialog",
      "aria-label": (0,external_wp_i18n_namespaceobject.__)("editor tips"),
      onclick,
      onfocusoutside: onfocusoutsidecallback,
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { children }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.button,
          {
            __next40pxdefaultsize: true,
            variant: "link",
            onclick: ondismiss,
            children: hasnexttip ? (0,external_wp_i18n_namespaceobject.__)("see next tip") : (0,external_wp_i18n_namespaceobject.__)("got it")
          }
        ) }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.button,
          {
            size: "small",
            classname: "nux-dot-tip__disable",
            icon: close_default,
            label: (0,external_wp_i18n_namespaceobject.__)("disable tips"),
            onclick: ondisable
          }
        )
      ]
    }
  );
}
var dot_tip_default = (0,external_wp_compose_namespaceobject.compose)(
  (0,external_wp_data_namespaceobject.withselect)((select, { tipid }) => {
    const { istipvisible, getassociatedguide } = select(store);
    const associatedguide = getassociatedguide(tipid);
    return {
      isvisible: istipvisible(tipid),
      hasnexttip: !!(associatedguide && associatedguide.nexttipid)
    };
  }),
  (0,external_wp_data_namespaceobject.withdispatch)((dispatch, { tipid }) => {
    const { dismisstip, disabletips } = dispatch(store);
    return {
      ondismiss() {
        dismisstip(tipid);
      },
      ondisable() {
        disabletips();
      }
    };
  })
)(dottip);


;// ./node_modules/@wordpress/nux/build-module/index.js



external_wp_deprecated_default()("wp.nux", {
  since: "5.4",
  hint: "wp.components.guide can be used to show a user guide.",
  version: "6.2"
});


(window.wp = window.wp || {}).nux = __webpack_exports__;
/******/ })()
;


