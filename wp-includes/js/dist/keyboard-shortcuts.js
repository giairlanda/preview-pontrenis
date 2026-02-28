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
  shortcutprovider: () => (/* reexport */ shortcutprovider),
  __unstableuseshortcuteventmatch: () => (/* reexport */ useshortcuteventmatch),
  store: () => (/* reexport */ store),
  useshortcut: () => (/* reexport */ useshortcut)
});

// namespace object: ./node_modules/@wordpress/keyboard-shortcuts/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  registershortcut: () => (registershortcut),
  unregistershortcut: () => (unregistershortcut)
});

// namespace object: ./node_modules/@wordpress/keyboard-shortcuts/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  getallshortcutkeycombinations: () => (getallshortcutkeycombinations),
  getallshortcutrawkeycombinations: () => (getallshortcutrawkeycombinations),
  getcategoryshortcuts: () => (getcategoryshortcuts),
  getshortcutaliases: () => (getshortcutaliases),
  getshortcutdescription: () => (getshortcutdescription),
  getshortcutkeycombination: () => (getshortcutkeycombination),
  getshortcutrepresentation: () => (getshortcutrepresentation)
});

;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/keyboard-shortcuts/build-module/store/reducer.js
function reducer(state = {}, action) {
  switch (action.type) {
    case "register_shortcut":
      return {
        ...state,
        [action.name]: {
          category: action.category,
          keycombination: action.keycombination,
          aliases: action.aliases,
          description: action.description
        }
      };
    case "unregister_shortcut":
      const { [action.name]: actionname, ...remainingstate } = state;
      return remainingstate;
  }
  return state;
}
var reducer_default = reducer;


;// ./node_modules/@wordpress/keyboard-shortcuts/build-module/store/actions.js
function registershortcut({
  name,
  category,
  description,
  keycombination,
  aliases
}) {
  return {
    type: "register_shortcut",
    name,
    category,
    keycombination,
    aliases,
    description
  };
}
function unregistershortcut(name) {
  return {
    type: "unregister_shortcut",
    name
  };
}


;// external ["wp","keycodes"]
const external_wp_keycodes_namespaceobject = window["wp"]["keycodes"];
;// ./node_modules/@wordpress/keyboard-shortcuts/build-module/store/selectors.js


const empty_array = [];
const formatting_methods = {
  display: external_wp_keycodes_namespaceobject.displayshortcut,
  raw: external_wp_keycodes_namespaceobject.rawshortcut,
  arialabel: external_wp_keycodes_namespaceobject.shortcutarialabel
};
function getkeycombinationrepresentation(shortcut, representation) {
  if (!shortcut) {
    return null;
  }
  return shortcut.modifier ? formatting_methods[representation][shortcut.modifier](
    shortcut.character
  ) : shortcut.character;
}
function getshortcutkeycombination(state, name) {
  return state[name] ? state[name].keycombination : null;
}
function getshortcutrepresentation(state, name, representation = "display") {
  const shortcut = getshortcutkeycombination(state, name);
  return getkeycombinationrepresentation(shortcut, representation);
}
function getshortcutdescription(state, name) {
  return state[name] ? state[name].description : null;
}
function getshortcutaliases(state, name) {
  return state[name] && state[name].aliases ? state[name].aliases : empty_array;
}
const getallshortcutkeycombinations = (0,external_wp_data_namespaceobject.createselector)(
  (state, name) => {
    return [
      getshortcutkeycombination(state, name),
      ...getshortcutaliases(state, name)
    ].filter(boolean);
  },
  (state, name) => [state[name]]
);
const getallshortcutrawkeycombinations = (0,external_wp_data_namespaceobject.createselector)(
  (state, name) => {
    return getallshortcutkeycombinations(state, name).map(
      (combination) => getkeycombinationrepresentation(combination, "raw")
    );
  },
  (state, name) => [state[name]]
);
const getcategoryshortcuts = (0,external_wp_data_namespaceobject.createselector)(
  (state, categoryname) => {
    return object.entries(state).filter(([, shortcut]) => shortcut.category === categoryname).map(([name]) => name);
  },
  (state) => [state]
);


;// ./node_modules/@wordpress/keyboard-shortcuts/build-module/store/index.js




const store_name = "core/keyboard-shortcuts";
const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  reducer: reducer_default,
  actions: actions_namespaceobject,
  selectors: selectors_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);


;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// ./node_modules/@wordpress/keyboard-shortcuts/build-module/hooks/use-shortcut-event-match.js



function useshortcuteventmatch() {
  const { getallshortcutkeycombinations } = (0,external_wp_data_namespaceobject.useselect)(
    store
  );
  function ismatch(name, event) {
    return getallshortcutkeycombinations(name).some(
      ({ modifier, character }) => {
        return external_wp_keycodes_namespaceobject.iskeyboardevent[modifier](event, character);
      }
    );
  }
  return ismatch;
}


;// ./node_modules/@wordpress/keyboard-shortcuts/build-module/context.js

const globalshortcuts = /* @__pure__ */ new set();
const globallistener = (event) => {
  for (const keyboardshortcut of globalshortcuts) {
    keyboardshortcut(event);
  }
};
const context = (0,external_wp_element_namespaceobject.createcontext)({
  add: (shortcut) => {
    if (globalshortcuts.size === 0) {
      document.addeventlistener("keydown", globallistener);
    }
    globalshortcuts.add(shortcut);
  },
  delete: (shortcut) => {
    globalshortcuts.delete(shortcut);
    if (globalshortcuts.size === 0) {
      document.removeeventlistener("keydown", globallistener);
    }
  }
});
context.displayname = "keyboardshortcutscontext";


;// ./node_modules/@wordpress/keyboard-shortcuts/build-module/hooks/use-shortcut.js



function useshortcut(name, callback, { isdisabled = false } = {}) {
  const shortcuts = (0,external_wp_element_namespaceobject.usecontext)(context);
  const ismatch = useshortcuteventmatch();
  const callbackref = (0,external_wp_element_namespaceobject.useref)();
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    callbackref.current = callback;
  }, [callback]);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (isdisabled) {
      return;
    }
    function _callback(event) {
      if (ismatch(name, event)) {
        callbackref.current(event);
      }
    }
    shortcuts.add(_callback);
    return () => {
      shortcuts.delete(_callback);
    };
  }, [name, isdisabled, shortcuts]);
}


;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// ./node_modules/@wordpress/keyboard-shortcuts/build-module/components/shortcut-provider.js



const { provider } = context;
function shortcutprovider(props) {
  const [keyboardshortcuts] = (0,external_wp_element_namespaceobject.usestate)(() => /* @__pure__ */ new set());
  function onkeydown(event) {
    if (props.onkeydown) {
      props.onkeydown(event);
    }
    for (const keyboardshortcut of keyboardshortcuts) {
      keyboardshortcut(event);
    }
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(provider, { value: keyboardshortcuts, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { ...props, onkeydown }) });
}


;// ./node_modules/@wordpress/keyboard-shortcuts/build-module/index.js






(window.wp = window.wp || {}).keyboardshortcuts = __webpack_exports__;
/******/ })()
;




