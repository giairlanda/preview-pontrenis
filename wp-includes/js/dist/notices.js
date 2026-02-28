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
  store: () => (/* reexport */ store)
});

// namespace object: ./node_modules/@wordpress/notices/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  createerrornotice: () => (createerrornotice),
  createinfonotice: () => (createinfonotice),
  createnotice: () => (createnotice),
  createsuccessnotice: () => (createsuccessnotice),
  createwarningnotice: () => (createwarningnotice),
  removeallnotices: () => (removeallnotices),
  removenotice: () => (removenotice),
  removenotices: () => (removenotices)
});

// namespace object: ./node_modules/@wordpress/notices/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  getnotices: () => (getnotices)
});

;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/notices/build-module/store/utils/on-sub-key.js
const onsubkey = (actionproperty) => (reducer) => (state = {}, action) => {
  const key = action[actionproperty];
  if (key === void 0) {
    return state;
  }
  const nextkeystate = reducer(state[key], action);
  if (nextkeystate === state[key]) {
    return state;
  }
  return {
    ...state,
    [key]: nextkeystate
  };
};
var on_sub_key_default = onsubkey;


;// ./node_modules/@wordpress/notices/build-module/store/reducer.js

const notices = on_sub_key_default("context")((state = [], action) => {
  switch (action.type) {
    case "create_notice":
      return [
        ...state.filter(({ id }) => id !== action.notice.id),
        action.notice
      ];
    case "remove_notice":
      return state.filter(({ id }) => id !== action.id);
    case "remove_notices":
      return state.filter(({ id }) => !action.ids.includes(id));
    case "remove_all_notices":
      return state.filter(({ type }) => type !== action.noticetype);
  }
  return state;
});
var reducer_default = notices;


;// ./node_modules/@wordpress/notices/build-module/store/constants.js
const default_context = "global";
const default_status = "info";


;// ./node_modules/@wordpress/notices/build-module/store/actions.js

let uniqueid = 0;
function createnotice(status = default_status, content, options = {}) {
  const {
    speak = true,
    isdismissible = true,
    context = default_context,
    id = `${context}${++uniqueid}`,
    actions = [],
    type = "default",
    __unstablehtml,
    icon = null,
    explicitdismiss = false,
    ondismiss
  } = options;
  content = string(content);
  return {
    type: "create_notice",
    context,
    notice: {
      id,
      status,
      content,
      spokenmessage: speak ? content : null,
      __unstablehtml,
      isdismissible,
      actions,
      type,
      icon,
      explicitdismiss,
      ondismiss
    }
  };
}
function createsuccessnotice(content, options) {
  return createnotice("success", content, options);
}
function createinfonotice(content, options) {
  return createnotice("info", content, options);
}
function createerrornotice(content, options) {
  return createnotice("error", content, options);
}
function createwarningnotice(content, options) {
  return createnotice("warning", content, options);
}
function removenotice(id, context = default_context) {
  return {
    type: "remove_notice",
    id,
    context
  };
}
function removeallnotices(noticetype = "default", context = default_context) {
  return {
    type: "remove_all_notices",
    noticetype,
    context
  };
}
function removenotices(ids, context = default_context) {
  return {
    type: "remove_notices",
    ids,
    context
  };
}


;// ./node_modules/@wordpress/notices/build-module/store/selectors.js

const default_notices = [];
function getnotices(state, context = default_context) {
  return state[context] || default_notices;
}


;// ./node_modules/@wordpress/notices/build-module/store/index.js




const store = (0,external_wp_data_namespaceobject.createreduxstore)("core/notices", {
  reducer: reducer_default,
  actions: actions_namespaceobject,
  selectors: selectors_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);


;// ./node_modules/@wordpress/notices/build-module/index.js



(window.wp = window.wp || {}).notices = __webpack_exports__;
/******/ })()
;






