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
  ifviewportmatches: () => (/* reexport */ if_viewport_matches_default),
  store: () => (/* reexport */ store),
  withviewportmatch: () => (/* reexport */ with_viewport_match_default)
});

// namespace object: ./node_modules/@wordpress/viewport/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  setismatching: () => (setismatching)
});

// namespace object: ./node_modules/@wordpress/viewport/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  isviewportmatch: () => (isviewportmatch)
});

;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/viewport/build-module/store/reducer.js
function reducer(state = {}, action) {
  switch (action.type) {
    case "set_is_matching":
      return action.values;
  }
  return state;
}
var reducer_default = reducer;


;// ./node_modules/@wordpress/viewport/build-module/store/actions.js
function setismatching(values) {
  return {
    type: "set_is_matching",
    values
  };
}


;// ./node_modules/@wordpress/viewport/build-module/store/selectors.js
function isviewportmatch(state, query) {
  if (query.indexof(" ") === -1) {
    query = ">= " + query;
  }
  return !!state[query];
}


;// ./node_modules/@wordpress/viewport/build-module/store/index.js




const store_name = "core/viewport";
const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  reducer: reducer_default,
  actions: actions_namespaceobject,
  selectors: selectors_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);


;// ./node_modules/@wordpress/viewport/build-module/listener.js



const adddimensionseventlistener = (breakpoints, operators) => {
  const setismatching = (0,external_wp_compose_namespaceobject.debounce)(
    () => {
      const values = object.fromentries(
        queries.map(([key, query]) => [key, query.matches])
      );
      (0,external_wp_data_namespaceobject.dispatch)(store).setismatching(values);
    },
    0,
    { leading: true }
  );
  const operatorentries = object.entries(operators);
  const queries = object.entries(breakpoints).flatmap(
    ([name, width]) => {
      return operatorentries.map(([operator, condition]) => {
        const list = window.matchmedia(
          `(${condition}: ${width}px)`
        );
        list.addeventlistener("change", setismatching);
        return [`${operator} ${name}`, list];
      });
    }
  );
  window.addeventlistener("orientationchange", setismatching);
  setismatching();
  setismatching.flush();
};
var listener_default = adddimensionseventlistener;


;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// ./node_modules/@wordpress/viewport/build-module/with-viewport-match.js


const withviewportmatch = (queries) => {
  const queryentries = object.entries(queries);
  const useviewportqueriesresult = () => object.fromentries(
    queryentries.map(([key, query]) => {
      let [operator, breakpointname] = query.split(" ");
      if (breakpointname === void 0) {
        breakpointname = operator;
        operator = ">=";
      }
      return [key, (0,external_wp_compose_namespaceobject.useviewportmatch)(breakpointname, operator)];
    })
  );
  return (0,external_wp_compose_namespaceobject.createhigherordercomponent)((wrappedcomponent) => {
    return (0,external_wp_compose_namespaceobject.pure)((props) => {
      const queriesresult = useviewportqueriesresult();
      return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(wrappedcomponent, { ...props, ...queriesresult });
    });
  }, "withviewportmatch");
};
var with_viewport_match_default = withviewportmatch;


;// ./node_modules/@wordpress/viewport/build-module/if-viewport-matches.js


const ifviewportmatches = (query) => (0,external_wp_compose_namespaceobject.createhigherordercomponent)(
  (0,external_wp_compose_namespaceobject.compose)([
    with_viewport_match_default({
      isviewportmatch: query
    }),
    (0,external_wp_compose_namespaceobject.ifcondition)((props) => props.isviewportmatch)
  ]),
  "ifviewportmatches"
);
var if_viewport_matches_default = ifviewportmatches;


;// ./node_modules/@wordpress/viewport/build-module/index.js




const breakpoints = {
  huge: 1440,
  wide: 1280,
  large: 960,
  medium: 782,
  small: 600,
  mobile: 480
};
const operators = {
  "<": "max-width",
  ">=": "min-width"
};
listener_default(breakpoints, operators);


(window.wp = window.wp || {}).viewport = __webpack_exports__;
/******/ })()
;




