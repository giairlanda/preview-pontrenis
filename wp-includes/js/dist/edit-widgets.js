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
  initialize: () => (/* binding */ initialize),
  initializeeditor: () => (/* binding */ initializeeditor),
  reinitializeeditor: () => (/* binding */ reinitializeeditor),
  store: () => (/* reexport */ store_store)
});

// namespace object: ./node_modules/@wordpress/interface/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  closemodal: () => (closemodal),
  disablecomplementaryarea: () => (disablecomplementaryarea),
  enablecomplementaryarea: () => (enablecomplementaryarea),
  openmodal: () => (openmodal),
  pinitem: () => (pinitem),
  setdefaultcomplementaryarea: () => (setdefaultcomplementaryarea),
  setfeaturedefaults: () => (setfeaturedefaults),
  setfeaturevalue: () => (setfeaturevalue),
  togglefeature: () => (togglefeature),
  unpinitem: () => (unpinitem)
});

// namespace object: ./node_modules/@wordpress/interface/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  getactivecomplementaryarea: () => (getactivecomplementaryarea),
  iscomplementaryarealoading: () => (iscomplementaryarealoading),
  isfeatureactive: () => (isfeatureactive),
  isitempinned: () => (isitempinned),
  ismodalactive: () => (ismodalactive)
});

// namespace object: ./node_modules/@wordpress/edit-widgets/build-module/store/actions.js
var store_actions_namespaceobject = {};
__webpack_require__.r(store_actions_namespaceobject);
__webpack_require__.d(store_actions_namespaceobject, {
  closegeneralsidebar: () => (closegeneralsidebar),
  lockwidgetsaving: () => (lockwidgetsaving),
  moveblocktowidgetarea: () => (moveblocktowidgetarea),
  persiststubpost: () => (persiststubpost),
  saveeditedwidgetareas: () => (saveeditedwidgetareas),
  savewidgetarea: () => (savewidgetarea),
  savewidgetareas: () => (savewidgetareas),
  setisinserteropened: () => (setisinserteropened),
  setislistviewopened: () => (setislistviewopened),
  setiswidgetareaopen: () => (setiswidgetareaopen),
  setwidgetareasopenstate: () => (setwidgetareasopenstate),
  setwidgetidforclientid: () => (setwidgetidforclientid),
  unlockwidgetsaving: () => (unlockwidgetsaving)
});

// namespace object: ./node_modules/@wordpress/edit-widgets/build-module/store/resolvers.js
var resolvers_namespaceobject = {};
__webpack_require__.r(resolvers_namespaceobject);
__webpack_require__.d(resolvers_namespaceobject, {
  getwidgetareas: () => (getwidgetareas),
  getwidgets: () => (getwidgets)
});

// namespace object: ./node_modules/@wordpress/edit-widgets/build-module/store/selectors.js
var store_selectors_namespaceobject = {};
__webpack_require__.r(store_selectors_namespaceobject);
__webpack_require__.d(store_selectors_namespaceobject, {
  __experimentalgetinsertionpoint: () => (__experimentalgetinsertionpoint),
  caninsertblockinwidgetarea: () => (caninsertblockinwidgetarea),
  geteditedwidgetareas: () => (geteditedwidgetareas),
  getiswidgetareaopen: () => (getiswidgetareaopen),
  getparentwidgetareablock: () => (getparentwidgetareablock),
  getreferencewidgetblocks: () => (getreferencewidgetblocks),
  getwidget: () => (getwidget),
  getwidgetareaforwidgetid: () => (getwidgetareaforwidgetid),
  getwidgetareas: () => (selectors_getwidgetareas),
  getwidgets: () => (selectors_getwidgets),
  isinserteropened: () => (isinserteropened),
  islistviewopened: () => (islistviewopened),
  issavingwidgetareas: () => (issavingwidgetareas),
  iswidgetsavinglocked: () => (iswidgetsavinglocked)
});

// namespace object: ./node_modules/@wordpress/edit-widgets/build-module/store/private-selectors.js
var private_selectors_namespaceobject = {};
__webpack_require__.r(private_selectors_namespaceobject);
__webpack_require__.d(private_selectors_namespaceobject, {
  getinsertersidebartoggleref: () => (getinsertersidebartoggleref),
  getlistviewtoggleref: () => (getlistviewtoggleref)
});

// namespace object: ./node_modules/@wordpress/edit-widgets/build-module/blocks/widget-area/index.js
var widget_area_namespaceobject = {};
__webpack_require__.r(widget_area_namespaceobject);
__webpack_require__.d(widget_area_namespaceobject, {
  metadata: () => (block_namespaceobject),
  name: () => (widget_area_name),
  settings: () => (settings)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","blocks"]
const external_wp_blocks_namespaceobject = window["wp"]["blocks"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","blocklibrary"]
const external_wp_blocklibrary_namespaceobject = window["wp"]["blocklibrary"];
;// external ["wp","coredata"]
const external_wp_coredata_namespaceobject = window["wp"]["coredata"];
;// external ["wp","widgets"]
const external_wp_widgets_namespaceobject = window["wp"]["widgets"];
;// external ["wp","preferences"]
const external_wp_preferences_namespaceobject = window["wp"]["preferences"];
;// external ["wp","apifetch"]
const external_wp_apifetch_namespaceobject = window["wp"]["apifetch"];
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_namespaceobject);
;// ./node_modules/@wordpress/edit-widgets/build-module/store/reducer.js

function widgetareasopenstate(state = {}, action) {
  const { type } = action;
  switch (type) {
    case "set_widget_areas_open_state": {
      return action.widgetareasopenstate;
    }
    case "set_is_widget_area_open": {
      const { clientid, isopen } = action;
      return {
        ...state,
        [clientid]: isopen
      };
    }
    default: {
      return state;
    }
  }
}
function blockinserterpanel(state = false, action) {
  switch (action.type) {
    case "set_is_list_view_opened":
      return action.isopen ? false : state;
    case "set_is_inserter_opened":
      return action.value;
  }
  return state;
}
function listviewpanel(state = false, action) {
  switch (action.type) {
    case "set_is_inserter_opened":
      return action.value ? false : state;
    case "set_is_list_view_opened":
      return action.isopen;
  }
  return state;
}
function listviewtoggleref(state = { current: null }) {
  return state;
}
function insertersidebartoggleref(state = { current: null }) {
  return state;
}
function widgetsavinglock(state = {}, action) {
  switch (action.type) {
    case "lock_widget_saving":
      return { ...state, [action.lockname]: true };
    case "unlock_widget_saving": {
      const { [action.lockname]: removedlockname, ...reststate } = state;
      return reststate;
    }
  }
  return state;
}
var reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({
  blockinserterpanel,
  insertersidebartoggleref,
  listviewpanel,
  listviewtoggleref,
  widgetareasopenstate,
  widgetsavinglock
});


;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","notices"]
const external_wp_notices_namespaceobject = window["wp"]["notices"];
;// ./node_modules/clsx/dist/clsx.mjs
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(array.isarray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const dist_clsx = (clsx);
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/check.js


var check_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m16.5 7.5 10 13.9l-2.5-2.4-1 1 3.5 3.6 7.5-7.6z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/star-filled.js


var star_filled_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m11.776 4.454a.25.25 0 01.448 0l2.069 4.192a.25.25 0 00.188.137l4.626.672a.25.25 0 01.139.426l-3.348 3.263a.25.25 0 00-.072.222l.79 4.607a.25.25 0 01-.362.263l-4.138-2.175a.25.25 0 00-.232 0l-4.138 2.175a.25.25 0 01-.363-.263l.79-4.607a.25.25 0 00-.071-.222l4.754 9.881a.25.25 0 01.139-.426l4.626-.672a.25.25 0 00.188-.137l2.069-4.192z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/star-empty.js


var star_empty_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
  external_wp_primitives_namespaceobject.path,
  {
    fillrule: "evenodd",
    d: "m9.706 8.646a.25.25 0 01-.188.137l-4.626.672a.25.25 0 00-.139.427l3.348 3.262a.25.25 0 01.072.222l-.79 4.607a.25.25 0 00.362.264l4.138-2.176a.25.25 0 01.233 0l4.137 2.175a.25.25 0 00.363-.263l-.79-4.607a.25.25 0 01.072-.222l3.347-3.262a.25.25 0 00-.139-.427l-4.626-.672a.25.25 0 01-.188-.137l-2.069-4.192a.25.25 0 00-.448 0l9.706 8.646zm12 7.39l-.948 1.921a1.75 1.75 0 01-1.317.957l-2.12.308 1.534 1.495c.412.402.6.982.503 1.55l-.362 2.11 1.896-.997a1.75 1.75 0 011.629 0l1.895.997-.362-2.11a1.75 1.75 0 01.504-1.55l1.533-1.495-2.12-.308a1.75 1.75 0 01-1.317-.957l12 7.39z",
    cliprule: "evenodd"
  }
) });


;// external ["wp","viewport"]
const external_wp_viewport_namespaceobject = window["wp"]["viewport"];
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","plugins"]
const external_wp_plugins_namespaceobject = window["wp"]["plugins"];
;// ./node_modules/@wordpress/icons/build-module/library/close-small.js


var close_small_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m12 13.06l3.712 3.713 1.061-1.06l13.061 12l3.712-3.712-1.06-1.06l12 10.938 8.288 7.227l-1.061 1.06l10.939 12l-3.712 3.712 1.06 1.061l12 13.061z" }) });


;// ./node_modules/@wordpress/interface/build-module/store/deprecated.js

function normalizecomplementaryareascope(scope) {
  if (["core/edit-post", "core/edit-site"].includes(scope)) {
    external_wp_deprecated_default()(`${scope} interface scope`, {
      alternative: "core interface scope",
      hint: "core/edit-post and core/edit-site are merging.",
      version: "6.6"
    });
    return "core";
  }
  return scope;
}
function normalizecomplementaryareaname(scope, name) {
  if (scope === "core" && name === "edit-site/template") {
    external_wp_deprecated_default()(`edit-site/template sidebar`, {
      alternative: "edit-post/document",
      version: "6.6"
    });
    return "edit-post/document";
  }
  if (scope === "core" && name === "edit-site/block-inspector") {
    external_wp_deprecated_default()(`edit-site/block-inspector sidebar`, {
      alternative: "edit-post/block",
      version: "6.6"
    });
    return "edit-post/block";
  }
  return name;
}


;// ./node_modules/@wordpress/interface/build-module/store/actions.js



const setdefaultcomplementaryarea = (scope, area) => {
  scope = normalizecomplementaryareascope(scope);
  area = normalizecomplementaryareaname(scope, area);
  return {
    type: "set_default_complementary_area",
    scope,
    area
  };
};
const enablecomplementaryarea = (scope, area) => ({ registry, dispatch }) => {
  if (!area) {
    return;
  }
  scope = normalizecomplementaryareascope(scope);
  area = normalizecomplementaryareaname(scope, area);
  const iscomplementaryareavisible = registry.select(external_wp_preferences_namespaceobject.store).get(scope, "iscomplementaryareavisible");
  if (!iscomplementaryareavisible) {
    registry.dispatch(external_wp_preferences_namespaceobject.store).set(scope, "iscomplementaryareavisible", true);
  }
  dispatch({
    type: "enable_complementary_area",
    scope,
    area
  });
};
const disablecomplementaryarea = (scope) => ({ registry }) => {
  scope = normalizecomplementaryareascope(scope);
  const iscomplementaryareavisible = registry.select(external_wp_preferences_namespaceobject.store).get(scope, "iscomplementaryareavisible");
  if (iscomplementaryareavisible) {
    registry.dispatch(external_wp_preferences_namespaceobject.store).set(scope, "iscomplementaryareavisible", false);
  }
};
const pinitem = (scope, item) => ({ registry }) => {
  if (!item) {
    return;
  }
  scope = normalizecomplementaryareascope(scope);
  item = normalizecomplementaryareaname(scope, item);
  const pinneditems = registry.select(external_wp_preferences_namespaceobject.store).get(scope, "pinneditems");
  if (pinneditems?.[item] === true) {
    return;
  }
  registry.dispatch(external_wp_preferences_namespaceobject.store).set(scope, "pinneditems", {
    ...pinneditems,
    [item]: true
  });
};
const unpinitem = (scope, item) => ({ registry }) => {
  if (!item) {
    return;
  }
  scope = normalizecomplementaryareascope(scope);
  item = normalizecomplementaryareaname(scope, item);
  const pinneditems = registry.select(external_wp_preferences_namespaceobject.store).get(scope, "pinneditems");
  registry.dispatch(external_wp_preferences_namespaceobject.store).set(scope, "pinneditems", {
    ...pinneditems,
    [item]: false
  });
};
function togglefeature(scope, featurename) {
  return function({ registry }) {
    external_wp_deprecated_default()(`dispatch( 'core/interface' ).togglefeature`, {
      since: "6.0",
      alternative: `dispatch( 'core/preferences' ).toggle`
    });
    registry.dispatch(external_wp_preferences_namespaceobject.store).toggle(scope, featurename);
  };
}
function setfeaturevalue(scope, featurename, value) {
  return function({ registry }) {
    external_wp_deprecated_default()(`dispatch( 'core/interface' ).setfeaturevalue`, {
      since: "6.0",
      alternative: `dispatch( 'core/preferences' ).set`
    });
    registry.dispatch(external_wp_preferences_namespaceobject.store).set(scope, featurename, !!value);
  };
}
function setfeaturedefaults(scope, defaults) {
  return function({ registry }) {
    external_wp_deprecated_default()(`dispatch( 'core/interface' ).setfeaturedefaults`, {
      since: "6.0",
      alternative: `dispatch( 'core/preferences' ).setdefaults`
    });
    registry.dispatch(external_wp_preferences_namespaceobject.store).setdefaults(scope, defaults);
  };
}
function openmodal(name) {
  return {
    type: "open_modal",
    name
  };
}
function closemodal() {
  return {
    type: "close_modal"
  };
}


;// ./node_modules/@wordpress/interface/build-module/store/selectors.js




const getactivecomplementaryarea = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, scope) => {
    scope = normalizecomplementaryareascope(scope);
    const iscomplementaryareavisible = select(external_wp_preferences_namespaceobject.store).get(
      scope,
      "iscomplementaryareavisible"
    );
    if (iscomplementaryareavisible === void 0) {
      return void 0;
    }
    if (iscomplementaryareavisible === false) {
      return null;
    }
    return state?.complementaryareas?.[scope];
  }
);
const iscomplementaryarealoading = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, scope) => {
    scope = normalizecomplementaryareascope(scope);
    const isvisible = select(external_wp_preferences_namespaceobject.store).get(
      scope,
      "iscomplementaryareavisible"
    );
    const identifier = state?.complementaryareas?.[scope];
    return isvisible && identifier === void 0;
  }
);
const isitempinned = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, scope, item) => {
    scope = normalizecomplementaryareascope(scope);
    item = normalizecomplementaryareaname(scope, item);
    const pinneditems = select(external_wp_preferences_namespaceobject.store).get(
      scope,
      "pinneditems"
    );
    return pinneditems?.[item] ?? true;
  }
);
const isfeatureactive = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, scope, featurename) => {
    external_wp_deprecated_default()(
      `select( 'core/interface' ).isfeatureactive( scope, featurename )`,
      {
        since: "6.0",
        alternative: `select( 'core/preferences' ).get( scope, featurename )`
      }
    );
    return !!select(external_wp_preferences_namespaceobject.store).get(scope, featurename);
  }
);
function ismodalactive(state, modalname) {
  return state.activemodal === modalname;
}


;// ./node_modules/@wordpress/interface/build-module/store/reducer.js

function complementaryareas(state = {}, action) {
  switch (action.type) {
    case "set_default_complementary_area": {
      const { scope, area } = action;
      if (state[scope]) {
        return state;
      }
      return {
        ...state,
        [scope]: area
      };
    }
    case "enable_complementary_area": {
      const { scope, area } = action;
      return {
        ...state,
        [scope]: area
      };
    }
  }
  return state;
}
function activemodal(state = null, action) {
  switch (action.type) {
    case "open_modal":
      return action.name;
    case "close_modal":
      return null;
  }
  return state;
}
var reducer_reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({
  complementaryareas,
  activemodal
});


;// ./node_modules/@wordpress/interface/build-module/store/constants.js
const store_name = "core/interface";


;// ./node_modules/@wordpress/interface/build-module/store/index.js





const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  reducer: reducer_reducer_default,
  actions: actions_namespaceobject,
  selectors: selectors_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);


;// ./node_modules/@wordpress/interface/build-module/components/complementary-area-toggle/index.js





function rolesupportscheckedstate(role) {
  return [
    "checkbox",
    "option",
    "radio",
    "switch",
    "menuitemcheckbox",
    "menuitemradio",
    "treeitem"
  ].includes(role);
}
function complementaryareatoggle({
  as = external_wp_components_namespaceobject.button,
  scope,
  identifier: identifierprop,
  icon: iconprop,
  selectedicon,
  name,
  shortcut,
  ...props
}) {
  const componenttouse = as;
  const context = (0,external_wp_plugins_namespaceobject.useplugincontext)();
  const icon = iconprop || context.icon;
  const identifier = identifierprop || `${context.name}/${name}`;
  const isselected = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store).getactivecomplementaryarea(scope) === identifier,
    [identifier, scope]
  );
  const { enablecomplementaryarea, disablecomplementaryarea } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    componenttouse,
    {
      icon: selectedicon && isselected ? selectedicon : icon,
      "aria-controls": identifier.replace("/", ":"),
      "aria-checked": rolesupportscheckedstate(props.role) ? isselected : void 0,
      onclick: () => {
        if (isselected) {
          disablecomplementaryarea(scope);
        } else {
          enablecomplementaryarea(scope, identifier);
        }
      },
      shortcut,
      ...props
    }
  );
}


;// ./node_modules/@wordpress/interface/build-module/components/complementary-area-header/index.js




const complementaryareaheader = ({
  children,
  classname,
  togglebuttonprops
}) => {
  const togglebutton = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(complementaryareatoggle, { icon: close_small_default, ...togglebuttonprops });
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    "div",
    {
      classname: dist_clsx(
        "components-panel__header",
        "interface-complementary-area-header",
        classname
      ),
      tabindex: -1,
      children: [
        children,
        togglebutton
      ]
    }
  );
};
var complementary_area_header_default = complementaryareaheader;


;// ./node_modules/@wordpress/interface/build-module/components/action-item/index.js



const noop = () => {
};
function actionitemslot({
  name,
  as: component = external_wp_components_namespaceobject.menugroup,
  fillprops = {},
  bubblesvirtually,
  ...props
}) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.slot,
    {
      name,
      bubblesvirtually,
      fillprops,
      children: (fills) => {
        if (!external_wp_element_namespaceobject.children.toarray(fills).length) {
          return null;
        }
        const initializedbyplugins = [];
        external_wp_element_namespaceobject.children.foreach(
          fills,
          ({
            props: { __unstableexplicitmenuitem, __unstabletarget }
          }) => {
            if (__unstabletarget && __unstableexplicitmenuitem) {
              initializedbyplugins.push(__unstabletarget);
            }
          }
        );
        const children = external_wp_element_namespaceobject.children.map(fills, (child) => {
          if (!child.props.__unstableexplicitmenuitem && initializedbyplugins.includes(
            child.props.__unstabletarget
          )) {
            return null;
          }
          return child;
        });
        return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(component, { ...props, children });
      }
    }
  );
}
function actionitem({ name, as: component = external_wp_components_namespaceobject.button, onclick, ...props }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.fill, { name, children: ({ onclick: fponclick }) => {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      component,
      {
        onclick: onclick || fponclick ? (...args) => {
          (onclick || noop)(...args);
          (fponclick || noop)(...args);
        } : void 0,
        ...props
      }
    );
  } });
}
actionitem.slot = actionitemslot;
var action_item_default = actionitem;


;// ./node_modules/@wordpress/interface/build-module/components/complementary-area-more-menu-item/index.js





const pluginsmenuitem = ({
  // menu item is marked with unstable prop for backward compatibility.
  // they are removed so they don't leak to dom elements.
  // @see https://github.com/wordpress/gutenberg/issues/14457
  __unstableexplicitmenuitem,
  __unstabletarget,
  ...restprops
}) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menuitem, { ...restprops });
function complementaryareamoremenuitem({
  scope,
  target,
  __unstableexplicitmenuitem,
  ...props
}) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    complementaryareatoggle,
    {
      as: (toggleprops) => {
        return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          action_item_default,
          {
            __unstableexplicitmenuitem,
            __unstabletarget: `${scope}/${target}`,
            as: pluginsmenuitem,
            name: `${scope}/plugin-more-menu`,
            ...toggleprops
          }
        );
      },
      role: "menuitemcheckbox",
      selectedicon: check_default,
      name: target,
      scope,
      ...props
    }
  );
}


;// ./node_modules/@wordpress/interface/build-module/components/pinned-items/index.js



function pinneditems({ scope, ...props }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.fill, { name: `pinneditems/${scope}`, ...props });
}
function pinneditemsslot({ scope, classname, ...props }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.slot, { name: `pinneditems/${scope}`, ...props, children: (fills) => fills?.length > 0 && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "div",
    {
      classname: dist_clsx(
        classname,
        "interface-pinned-items"
      ),
      children: fills
    }
  ) });
}
pinneditems.slot = pinneditemsslot;
var pinned_items_default = pinneditems;


;// ./node_modules/@wordpress/interface/build-module/components/complementary-area/index.js
















const animation_duration = 0.3;
function complementaryareaslot({ scope, ...props }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.slot, { name: `complementaryarea/${scope}`, ...props });
}
const sidebar_width = 280;
const variants = {
  open: { width: sidebar_width },
  closed: { width: 0 },
  mobileopen: { width: "100vw" }
};
function complementaryareafill({
  activearea,
  isactive,
  scope,
  children,
  classname,
  id
}) {
  const disablemotion = (0,external_wp_compose_namespaceobject.usereducedmotion)();
  const ismobileviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium", "<");
  const previousactivearea = (0,external_wp_compose_namespaceobject.useprevious)(activearea);
  const previousisactive = (0,external_wp_compose_namespaceobject.useprevious)(isactive);
  const [, setstate] = (0,external_wp_element_namespaceobject.usestate)({});
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    setstate({});
  }, [isactive]);
  const transition = {
    type: "tween",
    duration: disablemotion || ismobileviewport || !!previousactivearea && !!activearea && activearea !== previousactivearea ? 0 : animation_duration,
    ease: [0.6, 0, 0.4, 1]
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.fill, { name: `complementaryarea/${scope}`, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__unstableanimatepresence, { initial: false, children: (previousisactive || isactive) && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.__unstablemotion.div,
    {
      variants,
      initial: "closed",
      animate: ismobileviewport ? "mobileopen" : "open",
      exit: "closed",
      transition,
      classname: "interface-complementary-area__fill",
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "div",
        {
          id,
          classname,
          style: {
            width: ismobileviewport ? "100vw" : sidebar_width
          },
          children
        }
      )
    }
  ) }) });
}
function useadjustcomplementarylistener(scope, identifier, activearea, isactive, issmall) {
  const previousissmallref = (0,external_wp_element_namespaceobject.useref)(false);
  const shouldopenwhennotsmallref = (0,external_wp_element_namespaceobject.useref)(false);
  const { enablecomplementaryarea, disablecomplementaryarea } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (isactive && issmall && !previousissmallref.current) {
      disablecomplementaryarea(scope);
      shouldopenwhennotsmallref.current = true;
    } else if (
      // if there is a flag indicating the complementary area should be
      // enabled when we go from small to big window size and we are going
      // from a small to big window size.
      shouldopenwhennotsmallref.current && !issmall && previousissmallref.current
    ) {
      shouldopenwhennotsmallref.current = false;
      enablecomplementaryarea(scope, identifier);
    } else if (
      // if the flag is indicating the current complementary should be
      // reopened but another complementary area becomes active, remove
      // the flag.
      shouldopenwhennotsmallref.current && activearea && activearea !== identifier
    ) {
      shouldopenwhennotsmallref.current = false;
    }
    if (issmall !== previousissmallref.current) {
      previousissmallref.current = issmall;
    }
  }, [
    isactive,
    issmall,
    scope,
    identifier,
    activearea,
    disablecomplementaryarea,
    enablecomplementaryarea
  ]);
}
function complementaryarea({
  children,
  classname,
  closelabel = (0,external_wp_i18n_namespaceobject.__)("close plugin"),
  identifier: identifierprop,
  header,
  headerclassname,
  icon: iconprop,
  ispinnable = true,
  panelclassname,
  scope,
  name,
  title,
  toggleshortcut,
  isactivebydefault
}) {
  const context = (0,external_wp_plugins_namespaceobject.useplugincontext)();
  const icon = iconprop || context.icon;
  const identifier = identifierprop || `${context.name}/${name}`;
  const [isready, setisready] = (0,external_wp_element_namespaceobject.usestate)(false);
  const {
    isloading,
    isactive,
    ispinned,
    activearea,
    issmall,
    islarge,
    showiconlabels
  } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const {
        getactivecomplementaryarea,
        iscomplementaryarealoading,
        isitempinned
      } = select(store);
      const { get } = select(external_wp_preferences_namespaceobject.store);
      const _activearea = getactivecomplementaryarea(scope);
      return {
        isloading: iscomplementaryarealoading(scope),
        isactive: _activearea === identifier,
        ispinned: isitempinned(scope, identifier),
        activearea: _activearea,
        issmall: select(external_wp_viewport_namespaceobject.store).isviewportmatch("< medium"),
        islarge: select(external_wp_viewport_namespaceobject.store).isviewportmatch("large"),
        showiconlabels: get("core", "showiconlabels")
      };
    },
    [identifier, scope]
  );
  const ismobileviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium", "<");
  useadjustcomplementarylistener(
    scope,
    identifier,
    activearea,
    isactive,
    issmall
  );
  const {
    enablecomplementaryarea,
    disablecomplementaryarea,
    pinitem,
    unpinitem
  } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (isactivebydefault && activearea === void 0 && !issmall) {
      enablecomplementaryarea(scope, identifier);
    } else if (activearea === void 0 && issmall) {
      disablecomplementaryarea(scope, identifier);
    }
    setisready(true);
  }, [
    activearea,
    isactivebydefault,
    scope,
    identifier,
    issmall,
    enablecomplementaryarea,
    disablecomplementaryarea
  ]);
  if (!isready) {
    return;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    ispinnable && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(pinned_items_default, { scope, children: ispinned && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      complementaryareatoggle,
      {
        scope,
        identifier,
        ispressed: isactive && (!showiconlabels || islarge),
        "aria-expanded": isactive,
        "aria-disabled": isloading,
        label: title,
        icon: showiconlabels ? check_default : icon,
        showtooltip: !showiconlabels,
        variant: showiconlabels ? "tertiary" : void 0,
        size: "compact",
        shortcut: toggleshortcut
      }
    ) }),
    name && ispinnable && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      complementaryareamoremenuitem,
      {
        target: name,
        scope,
        icon,
        identifier,
        children: title
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
      complementaryareafill,
      {
        activearea,
        isactive,
        classname: dist_clsx("interface-complementary-area", classname),
        scope,
        id: identifier.replace("/", ":"),
        children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            complementary_area_header_default,
            {
              classname: headerclassname,
              closelabel,
              onclose: () => disablecomplementaryarea(scope),
              togglebuttonprops: {
                label: closelabel,
                size: "compact",
                shortcut: toggleshortcut,
                scope,
                identifier
              },
              children: header || /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
                /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h2", { classname: "interface-complementary-area-header__title", children: title }),
                ispinnable && !ismobileviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                  external_wp_components_namespaceobject.button,
                  {
                    classname: "interface-complementary-area__pin-unpin-item",
                    icon: ispinned ? star_filled_default : star_empty_default,
                    label: ispinned ? (0,external_wp_i18n_namespaceobject.__)("unpin from toolbar") : (0,external_wp_i18n_namespaceobject.__)("pin to toolbar"),
                    onclick: () => (ispinned ? unpinitem : pinitem)(
                      scope,
                      identifier
                    ),
                    ispressed: ispinned,
                    "aria-expanded": ispinned,
                    size: "compact"
                  }
                )
              ] })
            }
          ),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.panel, { classname: panelclassname, children })
        ]
      }
    )
  ] });
}
complementaryarea.slot = complementaryareaslot;
var complementary_area_default = complementaryarea;


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


;// ./node_modules/@wordpress/interface/build-module/components/interface-skeleton/index.js







const interface_skeleton_animation_duration = 0.25;
const commontransition = {
  type: "tween",
  duration: interface_skeleton_animation_duration,
  ease: [0.6, 0, 0.4, 1]
};
function usehtmlclass(classname) {
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const element = document && document.queryselector(`html:not(.${classname})`);
    if (!element) {
      return;
    }
    element.classlist.toggle(classname);
    return () => {
      element.classlist.toggle(classname);
    };
  }, [classname]);
}
const headervariants = {
  hidden: { opacity: 1, margintop: -60 },
  visible: { opacity: 1, margintop: 0 },
  distractionfreehover: {
    opacity: 1,
    margintop: 0,
    transition: {
      ...commontransition,
      delay: 0.2,
      delaychildren: 0.2
    }
  },
  distractionfreehidden: {
    opacity: 0,
    margintop: -60
  },
  distractionfreedisabled: {
    opacity: 0,
    margintop: 0,
    transition: {
      ...commontransition,
      delay: 0.8,
      delaychildren: 0.8
    }
  }
};
function interfaceskeleton({
  isdistractionfree,
  footer,
  header,
  editornotices,
  sidebar,
  secondarysidebar,
  content,
  actions,
  labels,
  classname
}, ref) {
  const [secondarysidebarresizelistener, secondarysidebarsize] = (0,external_wp_compose_namespaceobject.useresizeobserver)();
  const ismobileviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium", "<");
  const disablemotion = (0,external_wp_compose_namespaceobject.usereducedmotion)();
  const defaulttransition = {
    type: "tween",
    duration: disablemotion ? 0 : interface_skeleton_animation_duration,
    ease: [0.6, 0, 0.4, 1]
  };
  usehtmlclass("interface-interface-skeleton__html-container");
  const defaultlabels = {
    /* translators: accessibility text for the top bar landmark region. */
    header: (0,external_wp_i18n_namespaceobject._x)("header", "header landmark area"),
    /* translators: accessibility text for the content landmark region. */
    body: (0,external_wp_i18n_namespaceobject.__)("content"),
    /* translators: accessibility text for the secondary sidebar landmark region. */
    secondarysidebar: (0,external_wp_i18n_namespaceobject.__)("block library"),
    /* translators: accessibility text for the settings landmark region. */
    sidebar: (0,external_wp_i18n_namespaceobject._x)("settings", "settings landmark area"),
    /* translators: accessibility text for the publish landmark region. */
    actions: (0,external_wp_i18n_namespaceobject.__)("publish"),
    /* translators: accessibility text for the footer landmark region. */
    footer: (0,external_wp_i18n_namespaceobject.__)("footer")
  };
  const mergedlabels = { ...defaultlabels, ...labels };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    "div",
    {
      ref,
      classname: dist_clsx(
        classname,
        "interface-interface-skeleton",
        !!footer && "has-footer"
      ),
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "interface-interface-skeleton__editor", children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__unstableanimatepresence, { initial: false, children: !!header && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            navigable_region_default,
            {
              as: external_wp_components_namespaceobject.__unstablemotion.div,
              classname: "interface-interface-skeleton__header",
              "aria-label": mergedlabels.header,
              initial: isdistractionfree && !ismobileviewport ? "distractionfreehidden" : "hidden",
              whilehover: isdistractionfree && !ismobileviewport ? "distractionfreehover" : "visible",
              animate: isdistractionfree && !ismobileviewport ? "distractionfreedisabled" : "visible",
              exit: isdistractionfree && !ismobileviewport ? "distractionfreehidden" : "hidden",
              variants: headervariants,
              transition: defaulttransition,
              children: header
            }
          ) }),
          isdistractionfree && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "interface-interface-skeleton__header", children: editornotices }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "interface-interface-skeleton__body", children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__unstableanimatepresence, { initial: false, children: !!secondarysidebar && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              navigable_region_default,
              {
                classname: "interface-interface-skeleton__secondary-sidebar",
                arialabel: mergedlabels.secondarysidebar,
                as: external_wp_components_namespaceobject.__unstablemotion.div,
                initial: "closed",
                animate: "open",
                exit: "closed",
                variants: {
                  open: { width: secondarysidebarsize.width },
                  closed: { width: 0 }
                },
                transition: defaulttransition,
                children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
                  external_wp_components_namespaceobject.__unstablemotion.div,
                  {
                    style: {
                      position: "absolute",
                      width: ismobileviewport ? "100vw" : "fit-content",
                      height: "100%",
                      left: 0
                    },
                    variants: {
                      open: { x: 0 },
                      closed: { x: "-100%" }
                    },
                    transition: defaulttransition,
                    children: [
                      secondarysidebarresizelistener,
                      secondarysidebar
                    ]
                  }
                )
              }
            ) }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              navigable_region_default,
              {
                classname: "interface-interface-skeleton__content",
                arialabel: mergedlabels.body,
                children: content
              }
            ),
            !!sidebar && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              navigable_region_default,
              {
                classname: "interface-interface-skeleton__sidebar",
                arialabel: mergedlabels.sidebar,
                children: sidebar
              }
            ),
            !!actions && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              navigable_region_default,
              {
                classname: "interface-interface-skeleton__actions",
                arialabel: mergedlabels.actions,
                children: actions
              }
            )
          ] })
        ] }),
        !!footer && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          navigable_region_default,
          {
            classname: "interface-interface-skeleton__footer",
            arialabel: mergedlabels.footer,
            children: footer
          }
        )
      ]
    }
  );
}
var interface_skeleton_default = (0,external_wp_element_namespaceobject.forwardref)(interfaceskeleton);


;// ./node_modules/@wordpress/interface/build-module/components/index.js








;// ./node_modules/@wordpress/interface/build-module/index.js




;// external ["wp","blockeditor"]
const external_wp_blockeditor_namespaceobject = window["wp"]["blockeditor"];
;// ./node_modules/@wordpress/edit-widgets/build-module/store/transformers.js


function transformwidgettoblock(widget) {
  if (widget.id_base === "block") {
    const parsedblocks = (0,external_wp_blocks_namespaceobject.parse)(widget.instance.raw.content, {
      __unstableskipautop: true
    });
    if (!parsedblocks.length) {
      return (0,external_wp_widgets_namespaceobject.addwidgetidtoblock)(
        (0,external_wp_blocks_namespaceobject.createblock)("core/paragraph", {}, []),
        widget.id
      );
    }
    return (0,external_wp_widgets_namespaceobject.addwidgetidtoblock)(parsedblocks[0], widget.id);
  }
  let attributes;
  if (widget._embedded.about[0].is_multi) {
    attributes = {
      idbase: widget.id_base,
      instance: widget.instance
    };
  } else {
    attributes = {
      id: widget.id
    };
  }
  return (0,external_wp_widgets_namespaceobject.addwidgetidtoblock)(
    (0,external_wp_blocks_namespaceobject.createblock)("core/legacy-widget", attributes, []),
    widget.id
  );
}
function transformblocktowidget(block, relatedwidget = {}) {
  let widget;
  const isvalidlegacywidgetblock = block.name === "core/legacy-widget" && (block.attributes.id || block.attributes.instance);
  if (isvalidlegacywidgetblock) {
    widget = {
      ...relatedwidget,
      id: block.attributes.id ?? relatedwidget.id,
      id_base: block.attributes.idbase ?? relatedwidget.id_base,
      instance: block.attributes.instance ?? relatedwidget.instance
    };
  } else {
    widget = {
      ...relatedwidget,
      id_base: "block",
      instance: {
        raw: {
          content: (0,external_wp_blocks_namespaceobject.serialize)(block)
        }
      }
    };
  }
  delete widget.rendered;
  delete widget.rendered_form;
  return widget;
}


;// ./node_modules/@wordpress/edit-widgets/build-module/store/utils.js
const kind = "root";
const widget_area_entity_type = "sidebar";
const post_type = "posttype";
const buildwidgetareapostid = (widgetareaid) => `widget-area-${widgetareaid}`;
const buildwidgetareaspostid = () => `widget-areas`;
function buildwidgetareasquery() {
  return {
    per_page: -1
  };
}
function buildwidgetsquery() {
  return {
    per_page: -1,
    _embed: "about"
  };
}
const createstubpost = (id, blocks) => ({
  id,
  slug: id,
  status: "draft",
  type: "page",
  blocks,
  meta: {
    widgetareaid: id
  }
});


;// ./node_modules/@wordpress/edit-widgets/build-module/store/constants.js
const constants_store_name = "core/edit-widgets";


;// ./node_modules/@wordpress/edit-widgets/build-module/store/actions.js









const persiststubpost = (id, blocks) => ({ registry }) => {
  const stubpost = createstubpost(id, blocks);
  registry.dispatch(external_wp_coredata_namespaceobject.store).receiveentityrecords(
    kind,
    post_type,
    stubpost,
    { id: stubpost.id },
    false
  );
  return stubpost;
};
const saveeditedwidgetareas = () => async ({ select, dispatch, registry }) => {
  const editedwidgetareas = select.geteditedwidgetareas();
  if (!editedwidgetareas?.length) {
    return;
  }
  try {
    await dispatch.savewidgetareas(editedwidgetareas);
    registry.dispatch(external_wp_notices_namespaceobject.store).createsuccessnotice((0,external_wp_i18n_namespaceobject.__)("widgets saved."), {
      type: "snackbar"
    });
  } catch (e) {
    registry.dispatch(external_wp_notices_namespaceobject.store).createerrornotice(
      /* translators: %s: the error message. */
      (0,external_wp_i18n_namespaceobject.sprintf)((0,external_wp_i18n_namespaceobject.__)("there was an error. %s"), e.message),
      {
        type: "snackbar"
      }
    );
  }
};
const savewidgetareas = (widgetareas) => async ({ dispatch, registry }) => {
  try {
    for (const widgetarea of widgetareas) {
      await dispatch.savewidgetarea(widgetarea.id);
    }
  } finally {
    await registry.dispatch(external_wp_coredata_namespaceobject.store).finishresolution(
      "getentityrecord",
      kind,
      widget_area_entity_type,
      buildwidgetareasquery()
    );
  }
};
const savewidgetarea = (widgetareaid) => async ({ dispatch, select, registry }) => {
  const widgets = select.getwidgets();
  const post = registry.select(external_wp_coredata_namespaceobject.store).geteditedentityrecord(
    kind,
    post_type,
    buildwidgetareapostid(widgetareaid)
  );
  const areawidgets = object.values(widgets).filter(
    ({ sidebar }) => sidebar === widgetareaid
  );
  const usedreferencewidgets = [];
  const widgetsblocks = post.blocks.filter((block) => {
    const { id } = block.attributes;
    if (block.name === "core/legacy-widget" && id) {
      if (usedreferencewidgets.includes(id)) {
        return false;
      }
      usedreferencewidgets.push(id);
    }
    return true;
  });
  const deletedwidgets = [];
  for (const widget of areawidgets) {
    const widgetsnewarea = select.getwidgetareaforwidgetid(widget.id);
    if (!widgetsnewarea) {
      deletedwidgets.push(widget);
    }
  }
  const batchmeta = [];
  const batchtasks = [];
  const sidebarwidgetsids = [];
  for (let i = 0; i < widgetsblocks.length; i++) {
    const block = widgetsblocks[i];
    const widgetid = (0,external_wp_widgets_namespaceobject.getwidgetidfromblock)(block);
    const oldwidget = widgets[widgetid];
    const widget = transformblocktowidget(block, oldwidget);
    sidebarwidgetsids.push(widgetid);
    if (oldwidget) {
      registry.dispatch(external_wp_coredata_namespaceobject.store).editentityrecord(
        "root",
        "widget",
        widgetid,
        {
          ...widget,
          sidebar: widgetareaid
        },
        { undoignore: true }
      );
      const hasedits = registry.select(external_wp_coredata_namespaceobject.store).haseditsforentityrecord("root", "widget", widgetid);
      if (!hasedits) {
        continue;
      }
      batchtasks.push(
        ({ saveeditedentityrecord }) => saveeditedentityrecord("root", "widget", widgetid)
      );
    } else {
      batchtasks.push(
        ({ saveentityrecord }) => saveentityrecord("root", "widget", {
          ...widget,
          sidebar: widgetareaid
        })
      );
    }
    batchmeta.push({
      block,
      position: i,
      clientid: block.clientid
    });
  }
  for (const widget of deletedwidgets) {
    batchtasks.push(
      ({ deleteentityrecord }) => deleteentityrecord("root", "widget", widget.id, {
        force: true
      })
    );
  }
  const records = await registry.dispatch(external_wp_coredata_namespaceobject.store).__experimentalbatch(batchtasks);
  const preservedrecords = records.filter(
    (record) => !record.hasownproperty("deleted")
  );
  const failedwidgetnames = [];
  for (let i = 0; i < preservedrecords.length; i++) {
    const widget = preservedrecords[i];
    const { block, position } = batchmeta[i];
    post.blocks[position].attributes.__internalwidgetid = widget.id;
    const error = registry.select(external_wp_coredata_namespaceobject.store).getlastentitysaveerror("root", "widget", widget.id);
    if (error) {
      failedwidgetnames.push(block.attributes?.name || block?.name);
    }
    if (!sidebarwidgetsids[position]) {
      sidebarwidgetsids[position] = widget.id;
    }
  }
  if (failedwidgetnames.length) {
    throw new error(
      (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: list of widget names */
        (0,external_wp_i18n_namespaceobject.__)("could not save the following widgets: %s."),
        failedwidgetnames.join(", ")
      )
    );
  }
  registry.dispatch(external_wp_coredata_namespaceobject.store).editentityrecord(
    kind,
    widget_area_entity_type,
    widgetareaid,
    {
      widgets: sidebarwidgetsids
    },
    { undoignore: true }
  );
  dispatch(trysavewidgetarea(widgetareaid));
  registry.dispatch(external_wp_coredata_namespaceobject.store).receiveentityrecords(kind, post_type, post, void 0);
};
const trysavewidgetarea = (widgetareaid) => ({ registry }) => {
  registry.dispatch(external_wp_coredata_namespaceobject.store).saveeditedentityrecord(
    kind,
    widget_area_entity_type,
    widgetareaid,
    {
      throwonerror: true
    }
  );
};
function setwidgetidforclientid(clientid, widgetid) {
  return {
    type: "set_widget_id_for_client_id",
    clientid,
    widgetid
  };
}
function setwidgetareasopenstate(widgetareasopenstate) {
  return {
    type: "set_widget_areas_open_state",
    widgetareasopenstate
  };
}
function setiswidgetareaopen(clientid, isopen) {
  return {
    type: "set_is_widget_area_open",
    clientid,
    isopen
  };
}
function setisinserteropened(value) {
  return {
    type: "set_is_inserter_opened",
    value
  };
}
function setislistviewopened(isopen) {
  return {
    type: "set_is_list_view_opened",
    isopen
  };
}
const closegeneralsidebar = () => ({ registry }) => {
  registry.dispatch(store).disablecomplementaryarea(constants_store_name);
};
const moveblocktowidgetarea = (clientid, widgetareaid) => async ({ dispatch, select, registry }) => {
  const sourcerootclientid = registry.select(external_wp_blockeditor_namespaceobject.store).getblockrootclientid(clientid);
  const widgetareas = registry.select(external_wp_blockeditor_namespaceobject.store).getblocks();
  const destinationwidgetareablock = widgetareas.find(
    ({ attributes }) => attributes.id === widgetareaid
  );
  const destinationrootclientid = destinationwidgetareablock.clientid;
  const destinationinnerblocksclientids = registry.select(external_wp_blockeditor_namespaceobject.store).getblockorder(destinationrootclientid);
  const destinationindex = destinationinnerblocksclientids.length;
  const isdestinationwidgetareaopen = select.getiswidgetareaopen(
    destinationrootclientid
  );
  if (!isdestinationwidgetareaopen) {
    dispatch.setiswidgetareaopen(destinationrootclientid, true);
  }
  registry.dispatch(external_wp_blockeditor_namespaceobject.store).moveblockstoposition(
    [clientid],
    sourcerootclientid,
    destinationrootclientid,
    destinationindex
  );
};
function unlockwidgetsaving(lockname) {
  return {
    type: "unlock_widget_saving",
    lockname
  };
}
function lockwidgetsaving(lockname) {
  return {
    type: "lock_widget_saving",
    lockname
  };
}


;// ./node_modules/@wordpress/edit-widgets/build-module/store/resolvers.js





const getwidgetareas = () => async ({ dispatch, registry }) => {
  const query = buildwidgetareasquery();
  const widgetareas = await registry.resolveselect(external_wp_coredata_namespaceobject.store).getentityrecords(kind, widget_area_entity_type, query);
  const widgetareablocks = [];
  const sortedwidgetareas = widgetareas.sort((a, b) => {
    if (a.id === "wp_inactive_widgets") {
      return 1;
    }
    if (b.id === "wp_inactive_widgets") {
      return -1;
    }
    return 0;
  });
  for (const widgetarea of sortedwidgetareas) {
    widgetareablocks.push(
      (0,external_wp_blocks_namespaceobject.createblock)("core/widget-area", {
        id: widgetarea.id,
        name: widgetarea.name
      })
    );
    if (!widgetarea.widgets.length) {
      dispatch(
        persiststubpost(
          buildwidgetareapostid(widgetarea.id),
          []
        )
      );
    }
  }
  const widgetareasopenstate = {};
  widgetareablocks.foreach((widgetareablock, index) => {
    widgetareasopenstate[widgetareablock.clientid] = index === 0;
  });
  dispatch(setwidgetareasopenstate(widgetareasopenstate));
  dispatch(
    persiststubpost(buildwidgetareaspostid(), widgetareablocks)
  );
};
const getwidgets = () => async ({ dispatch, registry }) => {
  const query = buildwidgetsquery();
  const widgets = await registry.resolveselect(external_wp_coredata_namespaceobject.store).getentityrecords("root", "widget", query);
  const groupedbysidebar = {};
  for (const widget of widgets) {
    const block = transformwidgettoblock(widget);
    groupedbysidebar[widget.sidebar] = groupedbysidebar[widget.sidebar] || [];
    groupedbysidebar[widget.sidebar].push(block);
  }
  for (const sidebarid in groupedbysidebar) {
    if (groupedbysidebar.hasownproperty(sidebarid)) {
      dispatch(
        persiststubpost(
          buildwidgetareapostid(sidebarid),
          groupedbysidebar[sidebarid]
        )
      );
    }
  }
};


;// ./node_modules/@wordpress/edit-widgets/build-module/store/selectors.js






const empty_insertion_point = {
  rootclientid: void 0,
  insertionindex: void 0
};
const selectors_getwidgets = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (0,external_wp_data_namespaceobject.createselector)(
    () => {
      const widgets = select(external_wp_coredata_namespaceobject.store).getentityrecords(
        "root",
        "widget",
        buildwidgetsquery()
      );
      return (
        // key widgets by their id.
        widgets?.reduce(
          (allwidgets, widget) => ({
            ...allwidgets,
            [widget.id]: widget
          }),
          {}
        ) ?? {}
      );
    },
    () => [
      select(external_wp_coredata_namespaceobject.store).getentityrecords(
        "root",
        "widget",
        buildwidgetsquery()
      )
    ]
  )
);
const getwidget = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, id) => {
    const widgets = select(constants_store_name).getwidgets();
    return widgets[id];
  }
);
const selectors_getwidgetareas = (0,external_wp_data_namespaceobject.createregistryselector)((select) => () => {
  const query = buildwidgetareasquery();
  return select(external_wp_coredata_namespaceobject.store).getentityrecords(
    kind,
    widget_area_entity_type,
    query
  );
});
const getwidgetareaforwidgetid = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, widgetid) => {
    const widgetareas = select(constants_store_name).getwidgetareas();
    return widgetareas.find((widgetarea) => {
      const post = select(external_wp_coredata_namespaceobject.store).geteditedentityrecord(
        kind,
        post_type,
        buildwidgetareapostid(widgetarea.id)
      );
      const blockwidgetids = post.blocks.map(
        (block) => (0,external_wp_widgets_namespaceobject.getwidgetidfromblock)(block)
      );
      return blockwidgetids.includes(widgetid);
    });
  }
);
const getparentwidgetareablock = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, clientid) => {
    const { getblock, getblockname, getblockparents } = select(external_wp_blockeditor_namespaceobject.store);
    const blockparents = getblockparents(clientid);
    const widgetareaclientid = blockparents.find(
      (parentclientid) => getblockname(parentclientid) === "core/widget-area"
    );
    return getblock(widgetareaclientid);
  }
);
const geteditedwidgetareas = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, ids) => {
    let widgetareas = select(constants_store_name).getwidgetareas();
    if (!widgetareas) {
      return [];
    }
    if (ids) {
      widgetareas = widgetareas.filter(
        ({ id }) => ids.includes(id)
      );
    }
    return widgetareas.filter(
      ({ id }) => select(external_wp_coredata_namespaceobject.store).haseditsforentityrecord(
        kind,
        post_type,
        buildwidgetareapostid(id)
      )
    ).map(
      ({ id }) => select(external_wp_coredata_namespaceobject.store).geteditedentityrecord(
        kind,
        widget_area_entity_type,
        id
      )
    );
  }
);
const getreferencewidgetblocks = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, referencewidgetname = null) => {
    const results = [];
    const widgetareas = select(constants_store_name).getwidgetareas();
    for (const _widgetarea of widgetareas) {
      const post = select(external_wp_coredata_namespaceobject.store).geteditedentityrecord(
        kind,
        post_type,
        buildwidgetareapostid(_widgetarea.id)
      );
      for (const block of post.blocks) {
        if (block.name === "core/legacy-widget" && (!referencewidgetname || block.attributes?.referencewidgetname === referencewidgetname)) {
          results.push(block);
        }
      }
    }
    return results;
  }
);
const issavingwidgetareas = (0,external_wp_data_namespaceobject.createregistryselector)((select) => () => {
  const widgetareasids = select(constants_store_name).getwidgetareas()?.map(({ id }) => id);
  if (!widgetareasids) {
    return false;
  }
  for (const id of widgetareasids) {
    const issaving = select(external_wp_coredata_namespaceobject.store).issavingentityrecord(
      kind,
      widget_area_entity_type,
      id
    );
    if (issaving) {
      return true;
    }
  }
  const widgetids = [
    ...object.keys(select(constants_store_name).getwidgets()),
    void 0
    // account for new widgets without an id
  ];
  for (const id of widgetids) {
    const issaving = select(external_wp_coredata_namespaceobject.store).issavingentityrecord(
      "root",
      "widget",
      id
    );
    if (issaving) {
      return true;
    }
  }
  return false;
});
const getiswidgetareaopen = (state, clientid) => {
  const { widgetareasopenstate } = state;
  return !!widgetareasopenstate[clientid];
};
function isinserteropened(state) {
  return !!state.blockinserterpanel;
}
function __experimentalgetinsertionpoint(state) {
  if (typeof state.blockinserterpanel === "boolean") {
    return empty_insertion_point;
  }
  return state.blockinserterpanel;
}
const caninsertblockinwidgetarea = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, blockname) => {
    const widgetareas = select(external_wp_blockeditor_namespaceobject.store).getblocks();
    const [firstwidgetarea] = widgetareas;
    return select(external_wp_blockeditor_namespaceobject.store).caninsertblocktype(
      blockname,
      firstwidgetarea.clientid
    );
  }
);
function islistviewopened(state) {
  return state.listviewpanel;
}
function iswidgetsavinglocked(state) {
  return object.keys(state.widgetsavinglock).length > 0;
}


;// ./node_modules/@wordpress/edit-widgets/build-module/store/private-selectors.js
function getlistviewtoggleref(state) {
  return state.listviewtoggleref;
}
function getinsertersidebartoggleref(state) {
  return state.insertersidebartoggleref;
}


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/edit-widgets/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/edit-widgets"
);


;// ./node_modules/@wordpress/edit-widgets/build-module/store/index.js









const storeconfig = {
  reducer: reducer_default,
  selectors: store_selectors_namespaceobject,
  resolvers: resolvers_namespaceobject,
  actions: store_actions_namespaceobject
};
const store_store = (0,external_wp_data_namespaceobject.createreduxstore)(constants_store_name, storeconfig);
(0,external_wp_data_namespaceobject.register)(store_store);
external_wp_apifetch_default().use(function(options, next) {
  if (options.path?.indexof("/wp/v2/types/widget-area") === 0) {
    return promise.resolve({});
  }
  return next(options);
});
unlock(store_store).registerprivateselectors(private_selectors_namespaceobject);


;// external ["wp","hooks"]
const external_wp_hooks_namespaceobject = window["wp"]["hooks"];
;// ./node_modules/@wordpress/edit-widgets/build-module/filters/move-to-widget-area.js







const withmovetowidgetareatoolbaritem = (0,external_wp_compose_namespaceobject.createhigherordercomponent)(
  (blockedit) => (props) => {
    const { clientid, name: blockname } = props;
    const { widgetareas, currentwidgetareaid, caninsertblockinwidgetarea } = (0,external_wp_data_namespaceobject.useselect)(
      (select) => {
        if (blockname === "core/widget-area") {
          return {};
        }
        const selectors = select(store_store);
        const widgetareablock = selectors.getparentwidgetareablock(clientid);
        return {
          widgetareas: selectors.getwidgetareas(),
          currentwidgetareaid: widgetareablock?.attributes?.id,
          caninsertblockinwidgetarea: selectors.caninsertblockinwidgetarea(blockname)
        };
      },
      [clientid, blockname]
    );
    const { moveblocktowidgetarea } = (0,external_wp_data_namespaceobject.usedispatch)(store_store);
    const hasmultiplewidgetareas = widgetareas?.length > 1;
    const ismovetowidgetareavisible = blockname !== "core/widget-area" && hasmultiplewidgetareas && caninsertblockinwidgetarea;
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(blockedit, { ...props }, "edit"),
      ismovetowidgetareavisible && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockcontrols, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_widgets_namespaceobject.movetowidgetarea,
        {
          widgetareas,
          currentwidgetareaid,
          onselect: (widgetareaid) => {
            moveblocktowidgetarea(
              props.clientid,
              widgetareaid
            );
          }
        }
      ) })
    ] });
  },
  "withmovetowidgetareatoolbaritem"
);
(0,external_wp_hooks_namespaceobject.addfilter)(
  "editor.blockedit",
  "core/edit-widgets/block-edit",
  withmovetowidgetareatoolbaritem
);

;// external ["wp","mediautils"]
const external_wp_mediautils_namespaceobject = window["wp"]["mediautils"];
;// ./node_modules/@wordpress/edit-widgets/build-module/filters/replace-media-upload.js


const replacemediaupload = () => external_wp_mediautils_namespaceobject.mediaupload;
(0,external_wp_hooks_namespaceobject.addfilter)(
  "editor.mediaupload",
  "core/edit-widgets/replace-media-upload",
  replacemediaupload
);

;// ./node_modules/@wordpress/edit-widgets/build-module/filters/index.js



;// ./node_modules/@wordpress/edit-widgets/build-module/blocks/widget-area/block.json
const block_namespaceobject = /*#__pure__*/json.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiversion":3,"name":"core/widget-area","title":"widget area","category":"widgets","attributes":{"id":{"type":"string"},"name":{"type":"string"}},"supports":{"html":false,"inserter":false,"customclassname":false,"reusable":false,"__experimentaltoolbar":false,"__experimentalparentselector":false,"__experimentaldisableblockoverlay":true},"editorstyle":"wp-block-widget-area-editor","style":"wp-block-widget-area"}');
;// ./node_modules/@wordpress/edit-widgets/build-module/blocks/widget-area/edit/use-is-dragging-within.js

const useisdraggingwithin = (elementref) => {
  const [isdraggingwithin, setisdraggingwithin] = (0,external_wp_element_namespaceobject.usestate)(false);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const { ownerdocument } = elementref.current;
    function handledragstart(event) {
      handledragenter(event);
    }
    function handledragend() {
      setisdraggingwithin(false);
    }
    function handledragenter(event) {
      if (elementref.current.contains(event.target)) {
        setisdraggingwithin(true);
      } else {
        setisdraggingwithin(false);
      }
    }
    ownerdocument.addeventlistener("dragstart", handledragstart);
    ownerdocument.addeventlistener("dragend", handledragend);
    ownerdocument.addeventlistener("dragenter", handledragenter);
    return () => {
      ownerdocument.removeeventlistener("dragstart", handledragstart);
      ownerdocument.removeeventlistener("dragend", handledragend);
      ownerdocument.removeeventlistener("dragenter", handledragenter);
    };
  }, []);
  return isdraggingwithin;
};
var use_is_dragging_within_default = useisdraggingwithin;


;// ./node_modules/@wordpress/edit-widgets/build-module/blocks/widget-area/edit/inner-blocks.js






function widgetareainnerblocks({ id }) {
  const [blocks, oninput, onchange] = (0,external_wp_coredata_namespaceobject.useentityblockeditor)(
    "root",
    "posttype"
  );
  const innerblocksref = (0,external_wp_element_namespaceobject.useref)();
  const isdraggingwithininnerblocks = use_is_dragging_within_default(innerblocksref);
  const shouldhighlightdropzone = isdraggingwithininnerblocks;
  const innerblocksprops = (0,external_wp_blockeditor_namespaceobject.useinnerblocksprops)(
    { ref: innerblocksref },
    {
      value: blocks,
      oninput,
      onchange,
      templatelock: false,
      renderappender: external_wp_blockeditor_namespaceobject.innerblocks.buttonblockappender
    }
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "div",
    {
      "data-widget-area-id": id,
      classname: dist_clsx(
        "wp-block-widget-area__inner-blocks block-editor-inner-blocks editor-styles-wrapper",
        {
          "wp-block-widget-area__highlight-drop-zone": shouldhighlightdropzone
        }
      ),
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { ...innerblocksprops })
    }
  );
}


;// ./node_modules/@wordpress/edit-widgets/build-module/blocks/widget-area/edit/index.js









function widgetareaedit({
  clientid,
  attributes: { id, name }
}) {
  const isopen = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store_store).getiswidgetareaopen(clientid),
    [clientid]
  );
  const { setiswidgetareaopen } = (0,external_wp_data_namespaceobject.usedispatch)(store_store);
  const wrapper = (0,external_wp_element_namespaceobject.useref)();
  const setopen = (0,external_wp_element_namespaceobject.usecallback)(
    (openstate) => setiswidgetareaopen(clientid, openstate),
    [clientid]
  );
  const isdragging = useisdragging(wrapper);
  const isdraggingwithin = use_is_dragging_within_default(wrapper);
  const [openedwhiledragging, setopenedwhiledragging] = (0,external_wp_element_namespaceobject.usestate)(false);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (!isdragging) {
      setopenedwhiledragging(false);
      return;
    }
    if (isdraggingwithin && !isopen) {
      setopen(true);
      setopenedwhiledragging(true);
    } else if (!isdraggingwithin && isopen && openedwhiledragging) {
      setopen(false);
    }
  }, [isopen, isdragging, isdraggingwithin, openedwhiledragging]);
  const blockprops = (0,external_wp_blockeditor_namespaceobject.useblockprops)();
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { ...blockprops, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.panel, { ref: wrapper, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.panelbody,
    {
      title: name,
      opened: isopen,
      ontoggle: () => {
        setiswidgetareaopen(clientid, !isopen);
      },
      scrollafteropen: !isdragging,
      children: ({ opened }) => (
        // this is required to ensure legacywidget blocks are not
        // unmounted when the panel is collapsed. unmounting legacy
        // widgets may have unintended consequences (e.g.  tinymce
        // not being properly reinitialized)
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.__unstabledisclosurecontent,
          {
            classname: "wp-block-widget-area__panel-body-content",
            visible: opened,
            children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_coredata_namespaceobject.entityprovider,
              {
                kind: "root",
                type: "posttype",
                id: `widget-area-${id}`,
                children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(widgetareainnerblocks, { id })
              }
            )
          }
        )
      )
    }
  ) }) });
}
const useisdragging = (elementref) => {
  const [isdragging, setisdragging] = (0,external_wp_element_namespaceobject.usestate)(false);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const { ownerdocument } = elementref.current;
    function handledragstart() {
      setisdragging(true);
    }
    function handledragend() {
      setisdragging(false);
    }
    ownerdocument.addeventlistener("dragstart", handledragstart);
    ownerdocument.addeventlistener("dragend", handledragend);
    return () => {
      ownerdocument.removeeventlistener("dragstart", handledragstart);
      ownerdocument.removeeventlistener("dragend", handledragend);
    };
  }, []);
  return isdragging;
};


;// ./node_modules/@wordpress/edit-widgets/build-module/blocks/widget-area/index.js



const { name: widget_area_name } = block_namespaceobject;
const settings = {
  title: (0,external_wp_i18n_namespaceobject.__)("widget area"),
  description: (0,external_wp_i18n_namespaceobject.__)("a widget area container."),
  __experimentallabel: ({ name: label }) => label,
  edit: widgetareaedit
};


;// ./node_modules/@wordpress/edit-widgets/build-module/components/error-boundary/index.js







function copybutton({ text, children }) {
  const ref = (0,external_wp_compose_namespaceobject.usecopytoclipboard)(text);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.button, { __next40pxdefaultsize: true, variant: "secondary", ref, children });
}
function errorboundarywarning({ message, error }) {
  const actions = [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(copybutton, { text: error.stack, children: (0,external_wp_i18n_namespaceobject.__)("copy error") }, "copy-error")
  ];
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.warning, { classname: "edit-widgets-error-boundary", actions, children: message });
}
class errorboundary extends external_wp_element_namespaceobject.component {
  constructor() {
    super(...arguments);
    this.state = {
      error: null
    };
  }
  componentdidcatch(error) {
    (0,external_wp_hooks_namespaceobject.doaction)("editor.errorboundary.errorlogged", error);
  }
  static getderivedstatefromerror(error) {
    return { error };
  }
  render() {
    if (!this.state.error) {
      return this.props.children;
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      errorboundarywarning,
      {
        message: (0,external_wp_i18n_namespaceobject.__)(
          "the editor has encountered an unexpected error."
        ),
        error: this.state.error
      }
    );
  }
}


;// external ["wp","patterns"]
const external_wp_patterns_namespaceobject = window["wp"]["patterns"];
;// external ["wp","keyboardshortcuts"]
const external_wp_keyboardshortcuts_namespaceobject = window["wp"]["keyboardshortcuts"];
;// external ["wp","keycodes"]
const external_wp_keycodes_namespaceobject = window["wp"]["keycodes"];
;// ./node_modules/@wordpress/edit-widgets/build-module/components/keyboard-shortcuts/index.js







function keyboardshortcuts() {
  const { redo, undo } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_coredata_namespaceobject.store);
  const { saveeditedwidgetareas } = (0,external_wp_data_namespaceobject.usedispatch)(store_store);
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)("core/edit-widgets/undo", (event) => {
    undo();
    event.preventdefault();
  });
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)("core/edit-widgets/redo", (event) => {
    redo();
    event.preventdefault();
  });
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)("core/edit-widgets/save", (event) => {
    event.preventdefault();
    saveeditedwidgetareas();
  });
  return null;
}
function keyboardshortcutsregister() {
  const { registershortcut } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_keyboardshortcuts_namespaceobject.store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    registershortcut({
      name: "core/edit-widgets/undo",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("undo your last changes."),
      keycombination: {
        modifier: "primary",
        character: "z"
      }
    });
    registershortcut({
      name: "core/edit-widgets/redo",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("redo your last undo."),
      keycombination: {
        modifier: "primaryshift",
        character: "z"
      },
      // disable on apple os because it conflicts with the browser's
      // history shortcut. it's a fine alias for both windows and linux.
      // since there's no conflict for ctrl+shift+z on both windows and
      // linux, we keep it as the default for consistency.
      aliases: (0,external_wp_keycodes_namespaceobject.isappleos)() ? [] : [
        {
          modifier: "primary",
          character: "y"
        }
      ]
    });
    registershortcut({
      name: "core/edit-widgets/save",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("save your changes."),
      keycombination: {
        modifier: "primary",
        character: "s"
      }
    });
    registershortcut({
      name: "core/edit-widgets/keyboard-shortcuts",
      category: "main",
      description: (0,external_wp_i18n_namespaceobject.__)("display these keyboard shortcuts."),
      keycombination: {
        modifier: "access",
        character: "h"
      }
    });
    registershortcut({
      name: "core/edit-widgets/next-region",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("navigate to the next part of the editor."),
      keycombination: {
        modifier: "ctrl",
        character: "`"
      },
      aliases: [
        {
          modifier: "access",
          character: "n"
        }
      ]
    });
    registershortcut({
      name: "core/edit-widgets/previous-region",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("navigate to the previous part of the editor."),
      keycombination: {
        modifier: "ctrlshift",
        character: "`"
      },
      aliases: [
        {
          modifier: "access",
          character: "p"
        },
        {
          modifier: "ctrlshift",
          character: "~"
        }
      ]
    });
  }, [registershortcut]);
  return null;
}
keyboardshortcuts.register = keyboardshortcutsregister;
var keyboard_shortcuts_default = keyboardshortcuts;


;// ./node_modules/@wordpress/edit-widgets/build-module/hooks/use-last-selected-widget-area.js





const uselastselectedwidgetarea = () => (0,external_wp_data_namespaceobject.useselect)((select) => {
  const { getblockselectionend, getblockname } = select(external_wp_blockeditor_namespaceobject.store);
  const selectionendclientid = getblockselectionend();
  if (getblockname(selectionendclientid) === "core/widget-area") {
    return selectionendclientid;
  }
  const { getparentwidgetareablock } = select(store_store);
  const widgetareablock = getparentwidgetareablock(selectionendclientid);
  const widgetareablockclientid = widgetareablock?.clientid;
  if (widgetareablockclientid) {
    return widgetareablockclientid;
  }
  const { getentityrecord } = select(external_wp_coredata_namespaceobject.store);
  const widgetareaspost = getentityrecord(
    kind,
    post_type,
    buildwidgetareaspostid()
  );
  return widgetareaspost?.blocks[0]?.clientid;
}, []);
var use_last_selected_widget_area_default = uselastselectedwidgetarea;


;// ./node_modules/@wordpress/edit-widgets/build-module/constants.js
const allow_reusable_blocks = false;
const enable_experimental_fse_blocks = false;


;// ./node_modules/@wordpress/edit-widgets/build-module/components/widget-areas-block-editor-provider/index.js

















const { experimentalblockeditorprovider } = unlock(external_wp_blockeditor_namespaceobject.privateapis);
const { patternsmenuitems } = unlock(external_wp_patterns_namespaceobject.privateapis);
const { blockkeyboardshortcuts } = unlock(external_wp_blocklibrary_namespaceobject.privateapis);
const empty_array = [];
function widgetareasblockeditorprovider({
  blockeditorsettings,
  children,
  ...props
}) {
  const islargeviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium");
  const {
    hasuploadpermissions,
    reusableblocks,
    isfixedtoolbaractive,
    keepcaretinsideblock,
    pageonfront,
    pageforposts
  } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { canuser, getentityrecord, getentityrecords } = select(external_wp_coredata_namespaceobject.store);
    const sitesettings = canuser("read", {
      kind: "root",
      name: "site"
    }) ? getentityrecord("root", "site") : void 0;
    return {
      hasuploadpermissions: canuser("create", {
        kind: "posttype",
        name: "attachment"
      }) ?? true,
      reusableblocks: allow_reusable_blocks ? getentityrecords("posttype", "wp_block") : empty_array,
      isfixedtoolbaractive: !!select(external_wp_preferences_namespaceobject.store).get(
        "core/edit-widgets",
        "fixedtoolbar"
      ),
      keepcaretinsideblock: !!select(external_wp_preferences_namespaceobject.store).get(
        "core/edit-widgets",
        "keepcaretinsideblock"
      ),
      pageonfront: sitesettings?.page_on_front,
      pageforposts: sitesettings?.page_for_posts
    };
  }, []);
  const { setisinserteropened } = (0,external_wp_data_namespaceobject.usedispatch)(store_store);
  const settings = (0,external_wp_element_namespaceobject.usememo)(() => {
    let mediauploadblockeditor;
    if (hasuploadpermissions) {
      mediauploadblockeditor = ({ onerror, ...argumentsobject }) => {
        (0,external_wp_mediautils_namespaceobject.uploadmedia)({
          wpallowedmimetypes: blockeditorsettings.allowedmimetypes,
          onerror: ({ message }) => onerror(message),
          ...argumentsobject
        });
      };
    }
    return {
      ...blockeditorsettings,
      __experimentalreusableblocks: reusableblocks,
      hasfixedtoolbar: isfixedtoolbaractive || !islargeviewport,
      keepcaretinsideblock,
      mediaupload: mediauploadblockeditor,
      templatelock: "all",
      __experimentalsetisinserteropened: setisinserteropened,
      pageonfront,
      pageforposts,
      editortool: "edit"
    };
  }, [
    hasuploadpermissions,
    blockeditorsettings,
    isfixedtoolbaractive,
    islargeviewport,
    keepcaretinsideblock,
    reusableblocks,
    setisinserteropened,
    pageonfront,
    pageforposts
  ]);
  const widgetareaid = use_last_selected_widget_area_default();
  const [blocks, oninput, onchange] = (0,external_wp_coredata_namespaceobject.useentityblockeditor)(
    kind,
    post_type,
    { id: buildwidgetareaspostid() }
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.slotfillprovider, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(keyboard_shortcuts_default.register, {}),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(blockkeyboardshortcuts, {}),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
      experimentalblockeditorprovider,
      {
        value: blocks,
        oninput,
        onchange,
        settings,
        usesubregistry: false,
        ...props,
        children: [
          children,
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(patternsmenuitems, { rootclientid: widgetareaid })
        ]
      }
    )
  ] });
}


;// ./node_modules/@wordpress/icons/build-module/library/drawer-left.js


var drawer_left_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
  external_wp_primitives_namespaceobject.path,
  {
    fillrule: "evenodd",
    cliprule: "evenodd",
    d: "m18 4h6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v6c0-1.1-.9-2-2-2zm8.5 18.5h6c-.3 0-.5-.2-.5-.5v6c0-.3.2-.5.5-.5h2.5v13zm10-.5c0 .3-.2.5-.5.5h-8v-13h8c.3 0 .5.2.5.5v12z"
  }
) });


;// ./node_modules/@wordpress/icons/build-module/library/drawer-right.js


var drawer_right_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
  external_wp_primitives_namespaceobject.path,
  {
    fillrule: "evenodd",
    cliprule: "evenodd",
    d: "m18 4h6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v6c0-1.1-.9-2-2-2zm-4 14.5h6c-.3 0-.5-.2-.5-.5v6c0-.3.2-.5.5-.5h8v13zm4.5-.5c0 .3-.2.5-.5.5h-2.5v-13h18c.3 0 .5.2.5.5v12z"
  }
) });


;// ./node_modules/@wordpress/icons/build-module/library/block-default.js


var block_default_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m19 8h-1v6h-5v2h-2v6h6v2h5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm.5 10c0 .3-.2.5-.5.5h5c-.3 0-.5-.2-.5-.5v-8c0-.3.2-.5.5-.5h14c.3 0 .5.2.5.5v8z" }) });


;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// external ["wp","dom"]
const external_wp_dom_namespaceobject = window["wp"]["dom"];
;// ./node_modules/@wordpress/edit-widgets/build-module/components/sidebar/widget-areas.js










function widgetareas({ selectedwidgetareaid }) {
  const widgetareas = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store_store).getwidgetareas(),
    []
  );
  const selectedwidgetarea = (0,external_wp_element_namespaceobject.usememo)(
    () => selectedwidgetareaid && widgetareas?.find(
      (widgetarea) => widgetarea.id === selectedwidgetareaid
    ),
    [selectedwidgetareaid, widgetareas]
  );
  let description;
  if (!selectedwidgetarea) {
    description = (0,external_wp_i18n_namespaceobject.__)(
      // eslint-disable-next-line no-restricted-syntax -- 'sidebar' is a common web design term for layouts
      "widget areas are global parts in your site\u2019s layout that can accept blocks. these vary by theme, but are typically parts like your sidebar or footer."
    );
  } else if (selectedwidgetareaid === "wp_inactive_widgets") {
    description = (0,external_wp_i18n_namespaceobject.__)(
      "blocks in this widget area will not be displayed in your site."
    );
  } else {
    description = selectedwidgetarea.description;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "edit-widgets-widget-areas", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "edit-widgets-widget-areas__top-container", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockicon, { icon: block_default_default }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "p",
        {
          dangerouslysetinnerhtml: {
            __html: (0,external_wp_dom_namespaceobject.safehtml)(description)
          }
        }
      ),
      widgetareas?.length === 0 && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { children: (0,external_wp_i18n_namespaceobject.__)(
        "your theme does not contain any widget areas."
      ) }),
      !selectedwidgetarea && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_components_namespaceobject.button,
        {
          __next40pxdefaultsize: true,
          href: (0,external_wp_url_namespaceobject.addqueryargs)("customize.php", {
            "autofocus[panel]": "widgets",
            return: window.location.pathname
          }),
          variant: "tertiary",
          children: (0,external_wp_i18n_namespaceobject.__)("manage with live preview")
        }
      )
    ] })
  ] }) });
}


;// ./node_modules/@wordpress/edit-widgets/build-module/components/sidebar/index.js








const sidebar_active_by_default = external_wp_element_namespaceobject.platform.select({
  web: true,
  native: false
});
const block_inspector_identifier = "edit-widgets/block-inspector";
const widget_areas_identifier = "edit-widgets/block-areas";



const { tabs } = unlock(external_wp_components_namespaceobject.privateapis);
function sidebarheader({ selectedwidgetareablock }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(tabs.tablist, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(tabs.tab, { tabid: widget_areas_identifier, children: selectedwidgetareablock ? selectedwidgetareablock.attributes.name : (0,external_wp_i18n_namespaceobject.__)("widget areas") }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(tabs.tab, { tabid: block_inspector_identifier, children: (0,external_wp_i18n_namespaceobject.__)("block") })
  ] });
}
function sidebarcontent({
  hasselectednonareablock,
  currentarea,
  isgeneralsidebaropen,
  selectedwidgetareablock
}) {
  const { enablecomplementaryarea } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (hasselectednonareablock && currentarea === widget_areas_identifier && isgeneralsidebaropen) {
      enablecomplementaryarea(
        "core/edit-widgets",
        block_inspector_identifier
      );
    }
    if (!hasselectednonareablock && currentarea === block_inspector_identifier && isgeneralsidebaropen) {
      enablecomplementaryarea(
        "core/edit-widgets",
        widget_areas_identifier
      );
    }
  }, [hasselectednonareablock, enablecomplementaryarea]);
  const tabscontextvalue = (0,external_wp_element_namespaceobject.usecontext)(tabs.context);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    complementary_area_default,
    {
      classname: "edit-widgets-sidebar",
      header: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(tabs.context.provider, { value: tabscontextvalue, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        sidebarheader,
        {
          selectedwidgetareablock
        }
      ) }),
      headerclassname: "edit-widgets-sidebar__panel-tabs",
      title: (0,external_wp_i18n_namespaceobject.__)("settings"),
      closelabel: (0,external_wp_i18n_namespaceobject.__)("close settings"),
      scope: "core/edit-widgets",
      identifier: currentarea,
      icon: (0,external_wp_i18n_namespaceobject.isrtl)() ? drawer_left_default : drawer_right_default,
      isactivebydefault: sidebar_active_by_default,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(tabs.context.provider, { value: tabscontextvalue, children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          tabs.tabpanel,
          {
            tabid: widget_areas_identifier,
            focusable: false,
            children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              widgetareas,
              {
                selectedwidgetareaid: selectedwidgetareablock?.attributes.id
              }
            )
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          tabs.tabpanel,
          {
            tabid: block_inspector_identifier,
            focusable: false,
            children: hasselectednonareablock ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockinspector, {}) : (
              // pretend that widget areas are part of the ui by not
              // showing the block inspector when one is selected.
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("span", { classname: "block-editor-block-inspector__no-blocks", children: (0,external_wp_i18n_namespaceobject.__)("no block selected.") })
            )
          }
        )
      ] })
    }
  );
}
function sidebar() {
  const {
    currentarea,
    hasselectednonareablock,
    isgeneralsidebaropen,
    selectedwidgetareablock
  } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { getselectedblock, getblock, getblockparentsbyblockname } = select(external_wp_blockeditor_namespaceobject.store);
    const { getactivecomplementaryarea } = select(store);
    const selectedblock = getselectedblock();
    const activearea = getactivecomplementaryarea(store_store.name);
    let currentselection = activearea;
    if (!currentselection) {
      if (selectedblock) {
        currentselection = block_inspector_identifier;
      } else {
        currentselection = widget_areas_identifier;
      }
    }
    let widgetareablock;
    if (selectedblock) {
      if (selectedblock.name === "core/widget-area") {
        widgetareablock = selectedblock;
      } else {
        widgetareablock = getblock(
          getblockparentsbyblockname(
            selectedblock.clientid,
            "core/widget-area"
          )[0]
        );
      }
    }
    return {
      currentarea: currentselection,
      hasselectednonareablock: !!(selectedblock && selectedblock.name !== "core/widget-area"),
      isgeneralsidebaropen: !!activearea,
      selectedwidgetareablock: widgetareablock
    };
  }, []);
  const { enablecomplementaryarea } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const ontabselect = (0,external_wp_element_namespaceobject.usecallback)(
    (newselectedtabid) => {
      if (!!newselectedtabid) {
        enablecomplementaryarea(
          store_store.name,
          newselectedtabid
        );
      }
    },
    [enablecomplementaryarea]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    tabs,
    {
      selectedtabid: isgeneralsidebaropen ? currentarea : null,
      onselect: ontabselect,
      selectonmove: false,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        sidebarcontent,
        {
          hasselectednonareablock,
          currentarea,
          isgeneralsidebaropen,
          selectedwidgetareablock
        }
      )
    }
  );
}


;// ./node_modules/@wordpress/icons/build-module/library/plus.js


var plus_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m11 12.5v17.5h12.5v12.5h17.5v11h12.5v6h11v11h6v12.5h11z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/list-view.js


var list_view_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m3 6h11v1.5h3v6zm3.5 5.5h11v13h-11v-1.5zm21 17h10v1.5h11v17z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/undo.js


var undo_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m18.3 11.7c-.6-.6-1.4-.9-2.3-.9h6.7l2.9-3.3-1.1-1-4.5 5l8.5 16l1-1-2.7-2.7h16c.5 0 .9.2 1.3.5 1 1 1 3.4 1 4.5v.3h1.5v-.2c0-1.5 0-4.3-1.5-5.7z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/redo.js


var redo_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m15.6 6.5l-1.1 1 2.9 3.3h8c-.9 0-1.7.3-2.3.9-1.4 1.5-1.4 4.2-1.4 5.6v.2h1.5v-.3c0-1.1 0-3.5 1-4.5.3-.3.7-.5 1.3-.5h9.2l14.5 15l1.1 1.1 4.6-4.6-4.6-5z" }) });


;// ./node_modules/@wordpress/edit-widgets/build-module/components/header/undo-redo/undo.js








function undobutton(props, ref) {
  const hasundo = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(external_wp_coredata_namespaceobject.store).hasundo(),
    []
  );
  const { undo } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_coredata_namespaceobject.store);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.button,
    {
      ...props,
      ref,
      icon: !(0,external_wp_i18n_namespaceobject.isrtl)() ? undo_default : redo_default,
      label: (0,external_wp_i18n_namespaceobject.__)("undo"),
      shortcut: external_wp_keycodes_namespaceobject.displayshortcut.primary("z"),
      "aria-disabled": !hasundo,
      onclick: hasundo ? undo : void 0,
      size: "compact"
    }
  );
}
var undo_undo_default = (0,external_wp_element_namespaceobject.forwardref)(undobutton);


;// ./node_modules/@wordpress/edit-widgets/build-module/components/header/undo-redo/redo.js








function redobutton(props, ref) {
  const shortcut = (0,external_wp_keycodes_namespaceobject.isappleos)() ? external_wp_keycodes_namespaceobject.displayshortcut.primaryshift("z") : external_wp_keycodes_namespaceobject.displayshortcut.primary("y");
  const hasredo = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(external_wp_coredata_namespaceobject.store).hasredo(),
    []
  );
  const { redo } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_coredata_namespaceobject.store);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.button,
    {
      ...props,
      ref,
      icon: !(0,external_wp_i18n_namespaceobject.isrtl)() ? redo_default : undo_default,
      label: (0,external_wp_i18n_namespaceobject.__)("redo"),
      shortcut,
      "aria-disabled": !hasredo,
      onclick: hasredo ? redo : void 0,
      size: "compact"
    }
  );
}
var redo_redo_default = (0,external_wp_element_namespaceobject.forwardref)(redobutton);


;// ./node_modules/@wordpress/edit-widgets/build-module/components/header/document-tools/index.js












function documenttools() {
  const ismediumviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium");
  const {
    isinserteropen,
    islistviewopen,
    insertersidebartoggleref,
    listviewtoggleref
  } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const {
      isinserteropened,
      getinsertersidebartoggleref,
      islistviewopened,
      getlistviewtoggleref
    } = unlock(select(store_store));
    return {
      isinserteropen: isinserteropened(),
      islistviewopen: islistviewopened(),
      insertersidebartoggleref: getinsertersidebartoggleref(),
      listviewtoggleref: getlistviewtoggleref()
    };
  }, []);
  const { setisinserteropened, setislistviewopened } = (0,external_wp_data_namespaceobject.usedispatch)(store_store);
  const togglelistview = (0,external_wp_element_namespaceobject.usecallback)(
    () => setislistviewopened(!islistviewopen),
    [setislistviewopened, islistviewopen]
  );
  const toggleinsertersidebar = (0,external_wp_element_namespaceobject.usecallback)(
    () => setisinserteropened(!isinserteropen),
    [setisinserteropened, isinserteropen]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    external_wp_blockeditor_namespaceobject.navigabletoolbar,
    {
      classname: "edit-widgets-header-toolbar",
      "aria-label": (0,external_wp_i18n_namespaceobject.__)("document tools"),
      variant: "unstyled",
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.toolbaritem,
          {
            ref: insertersidebartoggleref,
            as: external_wp_components_namespaceobject.button,
            classname: "edit-widgets-header-toolbar__inserter-toggle",
            variant: "primary",
            ispressed: isinserteropen,
            onmousedown: (event) => {
              event.preventdefault();
            },
            onclick: toggleinsertersidebar,
            icon: plus_default,
            label: (0,external_wp_i18n_namespaceobject._x)(
              "block inserter",
              "generic label for block inserter button"
            ),
            size: "compact"
          }
        ),
        ismediumviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.toolbaritem, { as: undo_undo_default }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.toolbaritem, { as: redo_redo_default }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_components_namespaceobject.toolbaritem,
            {
              as: external_wp_components_namespaceobject.button,
              classname: "edit-widgets-header-toolbar__list-view-toggle",
              icon: list_view_default,
              ispressed: islistviewopen,
              label: (0,external_wp_i18n_namespaceobject.__)("list view"),
              onclick: togglelistview,
              ref: listviewtoggleref,
              size: "compact"
            }
          )
        ] })
      ]
    }
  );
}
var document_tools_default = documenttools;


;// ./node_modules/@wordpress/edit-widgets/build-module/components/save-button/index.js





function savebutton() {
  const { haseditedwidgetareaids, issaving, iswidgetsavelocked } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const {
        geteditedwidgetareas,
        issavingwidgetareas,
        iswidgetsavinglocked
      } = select(store_store);
      return {
        haseditedwidgetareaids: geteditedwidgetareas()?.length > 0,
        issaving: issavingwidgetareas(),
        iswidgetsavelocked: iswidgetsavinglocked()
      };
    },
    []
  );
  const { saveeditedwidgetareas } = (0,external_wp_data_namespaceobject.usedispatch)(store_store);
  const isdisabled = iswidgetsavelocked || issaving || !haseditedwidgetareaids;
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.button,
    {
      variant: "primary",
      isbusy: issaving,
      "aria-disabled": isdisabled,
      onclick: isdisabled ? void 0 : saveeditedwidgetareas,
      size: "compact",
      children: issaving ? (0,external_wp_i18n_namespaceobject.__)("saving\u2026") : (0,external_wp_i18n_namespaceobject.__)("update")
    }
  );
}
var save_button_default = savebutton;


;// ./node_modules/@wordpress/icons/build-module/library/more-vertical.js


var more_vertical_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m13 19h-2v-2h2v2zm0-6h-2v-2h2v2zm0-6h-2v5h2v2z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/external.js


var external_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m19.5 4.5h-7v6h4.44l-5.97 5.97 1.06 1.06l18 7.06v4.44h1.5v-7zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3h17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3v5.5h-3z" }) });


;// ./node_modules/@wordpress/edit-widgets/build-module/components/keyboard-shortcut-help-modal/config.js

const textformattingshortcuts = [
  {
    keycombination: { modifier: "primary", character: "b" },
    description: (0,external_wp_i18n_namespaceobject.__)("make the selected text bold.")
  },
  {
    keycombination: { modifier: "primary", character: "i" },
    description: (0,external_wp_i18n_namespaceobject.__)("make the selected text italic.")
  },
  {
    keycombination: { modifier: "primary", character: "k" },
    description: (0,external_wp_i18n_namespaceobject.__)("convert the selected text into a link.")
  },
  {
    keycombination: { modifier: "primaryshift", character: "k" },
    description: (0,external_wp_i18n_namespaceobject.__)("remove a link.")
  },
  {
    keycombination: { character: "[[" },
    description: (0,external_wp_i18n_namespaceobject.__)("insert a link to a post or page.")
  },
  {
    keycombination: { modifier: "primary", character: "u" },
    description: (0,external_wp_i18n_namespaceobject.__)("underline the selected text.")
  },
  {
    keycombination: { modifier: "access", character: "d" },
    description: (0,external_wp_i18n_namespaceobject.__)("strikethrough the selected text.")
  },
  {
    keycombination: { modifier: "access", character: "x" },
    description: (0,external_wp_i18n_namespaceobject.__)("make the selected text inline code.")
  },
  {
    keycombination: {
      modifier: "access",
      character: "0"
    },
    aliases: [
      {
        modifier: "access",
        character: "7"
      }
    ],
    description: (0,external_wp_i18n_namespaceobject.__)("convert the current heading to a paragraph.")
  },
  {
    keycombination: { modifier: "access", character: "1-6" },
    description: (0,external_wp_i18n_namespaceobject.__)(
      "convert the current paragraph or heading to a heading of level 1 to 6."
    )
  },
  {
    keycombination: { modifier: "primaryshift", character: "space" },
    description: (0,external_wp_i18n_namespaceobject.__)("add non breaking space.")
  }
];


;// ./node_modules/@wordpress/edit-widgets/build-module/components/keyboard-shortcut-help-modal/shortcut.js



function keycombination({ keycombination, forcearialabel }) {
  const shortcut = keycombination.modifier ? external_wp_keycodes_namespaceobject.displayshortcutlist[keycombination.modifier](
    keycombination.character
  ) : keycombination.character;
  const arialabel = keycombination.modifier ? external_wp_keycodes_namespaceobject.shortcutarialabel[keycombination.modifier](
    keycombination.character
  ) : keycombination.character;
  const shortcuts = array.isarray(shortcut) ? shortcut : [shortcut];
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "kbd",
    {
      classname: "edit-widgets-keyboard-shortcut-help-modal__shortcut-key-combination",
      "aria-label": forcearialabel || arialabel,
      children: shortcuts.map((character, index) => {
        if (character === "+") {
          return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.fragment, { children: character }, index);
        }
        return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          "kbd",
          {
            classname: "edit-widgets-keyboard-shortcut-help-modal__shortcut-key",
            children: character
          },
          index
        );
      })
    }
  );
}
function shortcut({ description, keycombination, aliases = [], arialabel }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "edit-widgets-keyboard-shortcut-help-modal__shortcut-description", children: description }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "edit-widgets-keyboard-shortcut-help-modal__shortcut-term", children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        keycombination,
        {
          keycombination,
          forcearialabel: arialabel
        }
      ),
      aliases.map((alias, index) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        keycombination,
        {
          keycombination: alias,
          forcearialabel: arialabel
        },
        index
      ))
    ] })
  ] });
}
var shortcut_default = shortcut;


;// ./node_modules/@wordpress/edit-widgets/build-module/components/keyboard-shortcut-help-modal/dynamic-shortcut.js




function dynamicshortcut({ name }) {
  const { keycombination, description, aliases } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const {
        getshortcutkeycombination,
        getshortcutdescription,
        getshortcutaliases
      } = select(external_wp_keyboardshortcuts_namespaceobject.store);
      return {
        keycombination: getshortcutkeycombination(name),
        aliases: getshortcutaliases(name),
        description: getshortcutdescription(name)
      };
    },
    [name]
  );
  if (!keycombination) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    shortcut_default,
    {
      keycombination,
      description,
      aliases
    }
  );
}
var dynamic_shortcut_default = dynamicshortcut;


;// ./node_modules/@wordpress/edit-widgets/build-module/components/keyboard-shortcut-help-modal/index.js









const shortcutlist = ({ shortcuts }) => (
  /*
   * disable reason: the `list` aria role is redundant but
   * safari+voiceover won't announce the list otherwise.
   */
  /* eslint-disable jsx-a11y/no-redundant-roles */
  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "ul",
    {
      classname: "edit-widgets-keyboard-shortcut-help-modal__shortcut-list",
      role: "list",
      children: shortcuts.map((shortcut, index) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "li",
        {
          classname: "edit-widgets-keyboard-shortcut-help-modal__shortcut",
          children: typeof shortcut === "string" ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(dynamic_shortcut_default, { name: shortcut }) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(shortcut_default, { ...shortcut })
        },
        index
      ))
    }
  )
);
const shortcutsection = ({ title, shortcuts, classname }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
  "section",
  {
    classname: dist_clsx(
      "edit-widgets-keyboard-shortcut-help-modal__section",
      classname
    ),
    children: [
      !!title && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h2", { classname: "edit-widgets-keyboard-shortcut-help-modal__section-title", children: title }),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(shortcutlist, { shortcuts })
    ]
  }
);
const shortcutcategorysection = ({
  title,
  categoryname,
  additionalshortcuts = []
}) => {
  const categoryshortcuts = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      return select(external_wp_keyboardshortcuts_namespaceobject.store).getcategoryshortcuts(
        categoryname
      );
    },
    [categoryname]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    shortcutsection,
    {
      title,
      shortcuts: categoryshortcuts.concat(additionalshortcuts)
    }
  );
};
function keyboardshortcuthelpmodal({
  ismodalactive,
  togglemodal
}) {
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)("core/edit-widgets/keyboard-shortcuts", togglemodal, {
    bindglobal: true
  });
  if (!ismodalactive) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    external_wp_components_namespaceobject.modal,
    {
      classname: "edit-widgets-keyboard-shortcut-help-modal",
      title: (0,external_wp_i18n_namespaceobject.__)("keyboard shortcuts"),
      onrequestclose: togglemodal,
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutsection,
          {
            classname: "edit-widgets-keyboard-shortcut-help-modal__main-shortcuts",
            shortcuts: ["core/edit-widgets/keyboard-shortcuts"]
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutcategorysection,
          {
            title: (0,external_wp_i18n_namespaceobject.__)("global shortcuts"),
            categoryname: "global"
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutcategorysection,
          {
            title: (0,external_wp_i18n_namespaceobject.__)("selection shortcuts"),
            categoryname: "selection"
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutcategorysection,
          {
            title: (0,external_wp_i18n_namespaceobject.__)("block shortcuts"),
            categoryname: "block",
            additionalshortcuts: [
              {
                keycombination: { character: "/" },
                description: (0,external_wp_i18n_namespaceobject.__)(
                  "change the block type after adding a new paragraph."
                ),
                /* translators: the forward-slash character. e.g. '/'. */
                arialabel: (0,external_wp_i18n_namespaceobject.__)("forward-slash")
              }
            ]
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutsection,
          {
            title: (0,external_wp_i18n_namespaceobject.__)("text formatting"),
            shortcuts: textformattingshortcuts
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutcategorysection,
          {
            title: (0,external_wp_i18n_namespaceobject.__)("list view shortcuts"),
            categoryname: "list-view"
          }
        )
      ]
    }
  );
}


;// ./node_modules/@wordpress/edit-widgets/build-module/components/more-menu/tools-more-menu-group.js


const { fill: toolsmoremenugroup, slot } = (0,external_wp_components_namespaceobject.createslotfill)(
  "editwidgetstoolsmoremenugroup"
);
toolsmoremenugroup.slot = ({ fillprops }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(slot, { fillprops, children: (fills) => fills.length > 0 && fills });
var tools_more_menu_group_default = toolsmoremenugroup;


;// ./node_modules/@wordpress/edit-widgets/build-module/components/more-menu/index.js











function moremenu() {
  const [
    iskeyboardshortcutsmodalactive,
    setiskeyboardshortcutsmodalvisible
  ] = (0,external_wp_element_namespaceobject.usestate)(false);
  const togglekeyboardshortcutsmodal = () => setiskeyboardshortcutsmodalvisible(!iskeyboardshortcutsmodalactive);
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)(
    "core/edit-widgets/keyboard-shortcuts",
    togglekeyboardshortcutsmodal
  );
  const islargeviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.dropdownmenu,
      {
        icon: more_vertical_default,
        label: (0,external_wp_i18n_namespaceobject.__)("options"),
        popoverprops: {
          placement: "bottom-end",
          classname: "more-menu-dropdown__content"
        },
        toggleprops: {
          tooltipposition: "bottom",
          size: "compact"
        },
        children: (onclose) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
          islargeviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menugroup, { label: (0,external_wp_i18n_namespaceobject._x)("view", "noun"), children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_preferences_namespaceobject.preferencetogglemenuitem,
            {
              scope: "core/edit-widgets",
              name: "fixedtoolbar",
              label: (0,external_wp_i18n_namespaceobject.__)("top toolbar"),
              info: (0,external_wp_i18n_namespaceobject.__)(
                "access all block and document tools in a single place"
              ),
              messageactivated: (0,external_wp_i18n_namespaceobject.__)(
                "top toolbar activated"
              ),
              messagedeactivated: (0,external_wp_i18n_namespaceobject.__)(
                "top toolbar deactivated"
              )
            }
          ) }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.menugroup, { label: (0,external_wp_i18n_namespaceobject.__)("tools"), children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.menuitem,
              {
                onclick: () => {
                  setiskeyboardshortcutsmodalvisible(true);
                },
                shortcut: external_wp_keycodes_namespaceobject.displayshortcut.access("h"),
                children: (0,external_wp_i18n_namespaceobject.__)("keyboard shortcuts")
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_preferences_namespaceobject.preferencetogglemenuitem,
              {
                scope: "core/edit-widgets",
                name: "welcomeguide",
                label: (0,external_wp_i18n_namespaceobject.__)("welcome guide")
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
              external_wp_components_namespaceobject.menuitem,
              {
                role: "menuitem",
                icon: external_default,
                href: (0,external_wp_i18n_namespaceobject.__)(
                  "https://wordpress.org/documentation/article/block-based-widgets-editor/"
                ),
                target: "_blank",
                rel: "noopener noreferrer",
                children: [
                  (0,external_wp_i18n_namespaceobject.__)("help"),
                  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.visuallyhidden, {
                    as: "span",
                    /* translators: accessibility text */
                    children: (0,external_wp_i18n_namespaceobject.__)("(opens in a new tab)")
                  })
                ]
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              tools_more_menu_group_default.slot,
              {
                fillprops: { onclose }
              }
            )
          ] }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.menugroup, { label: (0,external_wp_i18n_namespaceobject.__)("preferences"), children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_preferences_namespaceobject.preferencetogglemenuitem,
              {
                scope: "core/edit-widgets",
                name: "keepcaretinsideblock",
                label: (0,external_wp_i18n_namespaceobject.__)(
                  "contain text cursor inside block"
                ),
                info: (0,external_wp_i18n_namespaceobject.__)(
                  "aids screen readers by stopping text caret from leaving blocks."
                ),
                messageactivated: (0,external_wp_i18n_namespaceobject.__)(
                  "contain text cursor inside block activated"
                ),
                messagedeactivated: (0,external_wp_i18n_namespaceobject.__)(
                  "contain text cursor inside block deactivated"
                )
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_preferences_namespaceobject.preferencetogglemenuitem,
              {
                scope: "core/edit-widgets",
                name: "themestyles",
                info: (0,external_wp_i18n_namespaceobject.__)(
                  "make the editor look like your theme."
                ),
                label: (0,external_wp_i18n_namespaceobject.__)("use theme styles")
              }
            ),
            islargeviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_preferences_namespaceobject.preferencetogglemenuitem,
              {
                scope: "core/edit-widgets",
                name: "showblockbreadcrumbs",
                label: (0,external_wp_i18n_namespaceobject.__)("display block breadcrumbs"),
                info: (0,external_wp_i18n_namespaceobject.__)(
                  "shows block breadcrumbs at the bottom of the editor."
                ),
                messageactivated: (0,external_wp_i18n_namespaceobject.__)(
                  "display block breadcrumbs activated"
                ),
                messagedeactivated: (0,external_wp_i18n_namespaceobject.__)(
                  "display block breadcrumbs deactivated"
                )
              }
            )
          ] })
        ] })
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      keyboardshortcuthelpmodal,
      {
        ismodalactive: iskeyboardshortcutsmodalactive,
        togglemodal: togglekeyboardshortcutsmodal
      }
    )
  ] });
}


;// ./node_modules/@wordpress/edit-widgets/build-module/components/header/index.js












function header() {
  const islargeviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium");
  const blocktoolbarref = (0,external_wp_element_namespaceobject.useref)();
  const { hasfixedtoolbar } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => ({
      hasfixedtoolbar: !!select(external_wp_preferences_namespaceobject.store).get(
        "core/edit-widgets",
        "fixedtoolbar"
      )
    }),
    []
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_reactjsxruntime_namespaceobject.fragment, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "edit-widgets-header", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "edit-widgets-header__navigable-toolbar-wrapper", children: [
      islargeviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-widgets-header__title", children: (0,external_wp_i18n_namespaceobject.__)("widgets") }),
      !islargeviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_components_namespaceobject.visuallyhidden,
        {
          as: "h1",
          classname: "edit-widgets-header__title",
          children: (0,external_wp_i18n_namespaceobject.__)("widgets")
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(document_tools_default, {}),
      hasfixedtoolbar && islargeviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "selected-block-tools-wrapper", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blocktoolbar, { hidedraghandle: true }) }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.popover.slot,
          {
            ref: blocktoolbarref,
            name: "block-toolbar"
          }
        )
      ] })
    ] }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "edit-widgets-header__actions", children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(pinned_items_default.slot, { scope: "core/edit-widgets" }),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(save_button_default, {}),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(moremenu, {})
    ] })
  ] }) });
}
var header_default = header;


;// ./node_modules/@wordpress/edit-widgets/build-module/components/notices/index.js




const max_visible_notices = -3;
function notices() {
  const { removenotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  const { notices } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    return {
      notices: select(external_wp_notices_namespaceobject.store).getnotices()
    };
  }, []);
  const dismissiblenotices = notices.filter(
    ({ isdismissible, type }) => isdismissible && type === "default"
  );
  const nondismissiblenotices = notices.filter(
    ({ isdismissible, type }) => !isdismissible && type === "default"
  );
  const snackbarnotices = notices.filter(({ type }) => type === "snackbar").slice(max_visible_notices);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.noticelist,
      {
        notices: nondismissiblenotices,
        classname: "edit-widgets-notices__pinned"
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.noticelist,
      {
        notices: dismissiblenotices,
        classname: "edit-widgets-notices__dismissible",
        onremove: removenotice
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.snackbarlist,
      {
        notices: snackbarnotices,
        classname: "edit-widgets-notices__snackbar",
        onremove: removenotice
      }
    )
  ] });
}
var notices_default = notices;


;// ./node_modules/@wordpress/edit-widgets/build-module/components/widget-areas-block-editor-content/index.js








function widgetareasblockeditorcontent({
  blockeditorsettings
}) {
  const hasthemestyles = (0,external_wp_data_namespaceobject.useselect)(
    (select) => !!select(external_wp_preferences_namespaceobject.store).get(
      "core/edit-widgets",
      "themestyles"
    ),
    []
  );
  const islargeviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium");
  const styles = (0,external_wp_element_namespaceobject.usememo)(() => {
    return hasthemestyles ? blockeditorsettings.styles : [];
  }, [blockeditorsettings, hasthemestyles]);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "edit-widgets-block-editor", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(notices_default, {}),
    !islargeviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blocktoolbar, { hidedraghandle: true }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_blockeditor_namespaceobject.blocktools, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(keyboard_shortcuts_default, {}),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.__unstableeditorstyles,
        {
          styles,
          scope: ":where(.editor-styles-wrapper)"
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockselectionclearer, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.writingflow, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blocklist, { classname: "edit-widgets-main-block-list" }) }) })
    ] })
  ] });
}


;// ./node_modules/@wordpress/edit-widgets/build-module/hooks/use-widget-library-insertion-point.js





const usewidgetlibraryinsertionpoint = () => {
  const firstrootid = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { getentityrecord } = select(external_wp_coredata_namespaceobject.store);
    const widgetareaspost = getentityrecord(
      kind,
      post_type,
      buildwidgetareaspostid()
    );
    return widgetareaspost?.blocks[0]?.clientid;
  }, []);
  return (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const {
        getblockrootclientid,
        getblockselectionend,
        getblockorder,
        getblockindex
      } = select(external_wp_blockeditor_namespaceobject.store);
      const insertionpoint = select(store_store).__experimentalgetinsertionpoint();
      if (insertionpoint.rootclientid) {
        return insertionpoint;
      }
      const clientid = getblockselectionend() || firstrootid;
      const rootclientid = getblockrootclientid(clientid);
      if (clientid && rootclientid === "") {
        return {
          rootclientid: clientid,
          insertionindex: getblockorder(clientid).length
        };
      }
      return {
        rootclientid,
        insertionindex: getblockindex(clientid) + 1
      };
    },
    [firstrootid]
  );
};
var use_widget_library_insertion_point_default = usewidgetlibraryinsertionpoint;


;// ./node_modules/@wordpress/edit-widgets/build-module/components/secondary-sidebar/inserter-sidebar.js







function insertersidebar() {
  const ismobileviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium", "<");
  const { rootclientid, insertionindex } = use_widget_library_insertion_point_default();
  const { setisinserteropened } = (0,external_wp_data_namespaceobject.usedispatch)(store_store);
  const closeinserter = (0,external_wp_element_namespaceobject.usecallback)(() => {
    return setisinserteropened(false);
  }, [setisinserteropened]);
  const libraryref = (0,external_wp_element_namespaceobject.useref)();
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "edit-widgets-layout__inserter-panel", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "edit-widgets-layout__inserter-panel-content", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_blockeditor_namespaceobject.__experimentallibrary,
    {
      showinserterhelppanel: true,
      shouldfocusblock: ismobileviewport,
      rootclientid,
      __experimentalinsertionindex: insertionindex,
      ref: libraryref,
      onclose: closeinserter
    }
  ) }) });
}


;// ./node_modules/@wordpress/edit-widgets/build-module/components/secondary-sidebar/list-view-sidebar.js











function listviewsidebar() {
  const { setislistviewopened } = (0,external_wp_data_namespaceobject.usedispatch)(store_store);
  const { getlistviewtoggleref } = unlock((0,external_wp_data_namespaceobject.useselect)(store_store));
  const [dropzoneelement, setdropzoneelement] = (0,external_wp_element_namespaceobject.usestate)(null);
  const focusonmountref = (0,external_wp_compose_namespaceobject.usefocusonmount)("firstelement");
  const closelistview = (0,external_wp_element_namespaceobject.usecallback)(() => {
    setislistviewopened(false);
    getlistviewtoggleref().current?.focus();
  }, [getlistviewtoggleref, setislistviewopened]);
  const closeonescape = (0,external_wp_element_namespaceobject.usecallback)(
    (event) => {
      if (event.keycode === external_wp_keycodes_namespaceobject.escape && !event.defaultprevented) {
        event.preventdefault();
        closelistview();
      }
    },
    [closelistview]
  );
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
      "div",
      {
        classname: "edit-widgets-editor__list-view-panel",
        onkeydown: closeonescape,
        children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "edit-widgets-editor__list-view-panel-header", children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("strong", { children: (0,external_wp_i18n_namespaceobject.__)("list view") }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.button,
              {
                icon: close_small_default,
                label: (0,external_wp_i18n_namespaceobject.__)("close"),
                onclick: closelistview,
                size: "compact"
              }
            )
          ] }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            "div",
            {
              classname: "edit-widgets-editor__list-view-panel-content",
              ref: (0,external_wp_compose_namespaceobject.usemergerefs)([focusonmountref, setdropzoneelement]),
              children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.__experimentallistview, { dropzoneelement })
            }
          )
        ]
      }
    )
  );
}


;// ./node_modules/@wordpress/edit-widgets/build-module/components/secondary-sidebar/index.js





function secondarysidebar() {
  const { isinserteropen, islistviewopen } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { isinserteropened, islistviewopened } = select(store_store);
    return {
      isinserteropen: isinserteropened(),
      islistviewopen: islistviewopened()
    };
  }, []);
  if (isinserteropen) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(insertersidebar, {});
  }
  if (islistviewopen) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(listviewsidebar, {});
  }
  return null;
}


;// ./node_modules/@wordpress/edit-widgets/build-module/components/layout/interface.js












const interfacelabels = {
  /* translators: accessibility text for the widgets screen top bar landmark region. */
  header: (0,external_wp_i18n_namespaceobject.__)("widgets top bar"),
  /* translators: accessibility text for the widgets screen content landmark region. */
  body: (0,external_wp_i18n_namespaceobject.__)("widgets and blocks"),
  /* translators: accessibility text for the widgets screen settings landmark region. */
  sidebar: (0,external_wp_i18n_namespaceobject.__)("widgets settings"),
  /* translators: accessibility text for the widgets screen footer landmark region. */
  footer: (0,external_wp_i18n_namespaceobject.__)("widgets footer")
};
function interface({ blockeditorsettings }) {
  const ismobileviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium", "<");
  const ishugeviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("huge", ">=");
  const { setisinserteropened, setislistviewopened, closegeneralsidebar } = (0,external_wp_data_namespaceobject.usedispatch)(store_store);
  const {
    hasblockbreadcrumbsenabled,
    hassidebarenabled,
    isinserteropened,
    islistviewopened
  } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => ({
      hassidebarenabled: !!select(
        store
      ).getactivecomplementaryarea(store_store.name),
      isinserteropened: !!select(store_store).isinserteropened(),
      islistviewopened: !!select(store_store).islistviewopened(),
      hasblockbreadcrumbsenabled: !!select(external_wp_preferences_namespaceobject.store).get(
        "core/edit-widgets",
        "showblockbreadcrumbs"
      )
    }),
    []
  );
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (hassidebarenabled && !ishugeviewport) {
      setisinserteropened(false);
      setislistviewopened(false);
    }
  }, [hassidebarenabled, ishugeviewport]);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if ((isinserteropened || islistviewopened) && !ishugeviewport) {
      closegeneralsidebar();
    }
  }, [isinserteropened, islistviewopened, ishugeviewport]);
  const secondarysidebarlabel = islistviewopened ? (0,external_wp_i18n_namespaceobject.__)("list view") : (0,external_wp_i18n_namespaceobject.__)("block library");
  const hassecondarysidebar = islistviewopened || isinserteropened;
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    interface_skeleton_default,
    {
      labels: {
        ...interfacelabels,
        secondarysidebar: secondarysidebarlabel
      },
      header: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(header_default, {}),
      secondarysidebar: hassecondarysidebar && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(secondarysidebar, {}),
      sidebar: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(complementary_area_default.slot, { scope: "core/edit-widgets" }),
      content: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_reactjsxruntime_namespaceobject.fragment, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        widgetareasblockeditorcontent,
        {
          blockeditorsettings
        }
      ) }),
      footer: hasblockbreadcrumbsenabled && !ismobileviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "edit-widgets-layout__footer", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockbreadcrumb, { rootlabeltext: (0,external_wp_i18n_namespaceobject.__)("widgets") }) })
    }
  );
}
var interface_default = interface;


;// ./node_modules/@wordpress/edit-widgets/build-module/components/layout/unsaved-changes-warning.js




function unsavedchangeswarning() {
  const isdirty = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { geteditedwidgetareas } = select(store_store);
    const editedwidgetareas = geteditedwidgetareas();
    return editedwidgetareas?.length > 0;
  }, []);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const warnifunsavedchanges = (event) => {
      if (isdirty) {
        event.returnvalue = (0,external_wp_i18n_namespaceobject.__)(
          "you have unsaved changes. if you proceed, they will be lost."
        );
        return event.returnvalue;
      }
    };
    window.addeventlistener("beforeunload", warnifunsavedchanges);
    return () => {
      window.removeeventlistener("beforeunload", warnifunsavedchanges);
    };
  }, [isdirty]);
  return null;
}


;// ./node_modules/@wordpress/edit-widgets/build-module/components/welcome-guide/index.js







function welcomeguide() {
  const isactive = (0,external_wp_data_namespaceobject.useselect)(
    (select) => !!select(external_wp_preferences_namespaceobject.store).get(
      "core/edit-widgets",
      "welcomeguide"
    ),
    []
  );
  const { toggle } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_preferences_namespaceobject.store);
  const widgetareas = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store_store).getwidgetareas({ per_page: -1 }),
    []
  );
  if (!isactive) {
    return null;
  }
  const isentirelyblockwidgets = widgetareas?.every(
    (widgetarea) => widgetarea.id === "wp_inactive_widgets" || widgetarea.widgets.every(
      (widgetid) => widgetid.startswith("block-")
    )
  );
  const numwidgetareas = widgetareas?.filter(
    (widgetarea) => widgetarea.id !== "wp_inactive_widgets"
  ).length ?? 0;
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.guide,
    {
      classname: "edit-widgets-welcome-guide",
      contentlabel: (0,external_wp_i18n_namespaceobject.__)("welcome to block widgets"),
      finishbuttontext: (0,external_wp_i18n_namespaceobject.__)("get started"),
      onfinish: () => toggle("core/edit-widgets", "welcomeguide"),
      pages: [
        {
          image: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            welcomeguideimage,
            {
              nonanimatedsrc: "https://s.w.org/images/block-editor/welcome-canvas.svg",
              animatedsrc: "https://s.w.org/images/block-editor/welcome-canvas.gif"
            }
          ),
          content: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-widgets-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("welcome to block widgets") }),
            isentirelyblockwidgets ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_reactjsxruntime_namespaceobject.fragment, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-widgets-welcome-guide__text", children: (0,external_wp_i18n_namespaceobject.sprintf)(
              // translators: %s: number of block areas in the current theme.
              (0,external_wp_i18n_namespaceobject._n)(
                "your theme provides %s \u201cblock\u201d area for you to add and edit content.\xa0try adding a search bar, social icons, or other types of blocks here and see how they\u2019ll look on your site.",
                "your theme provides %s different \u201cblock\u201d areas for you to add and edit content.\xa0try adding a search bar, social icons, or other types of blocks here and see how they\u2019ll look on your site.",
                numwidgetareas
              ),
              numwidgetareas
            ) }) }) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-widgets-welcome-guide__text", children: (0,external_wp_i18n_namespaceobject.__)(
                "you can now add any block to your site\u2019s widget areas. don\u2019t worry, all of your favorite widgets still work flawlessly."
              ) }),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("p", { classname: "edit-widgets-welcome-guide__text", children: [
                /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("strong", { children: (0,external_wp_i18n_namespaceobject.__)(
                  "want to stick with the old widgets?"
                ) }),
                " ",
                /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                  external_wp_components_namespaceobject.externallink,
                  {
                    href: (0,external_wp_i18n_namespaceobject.__)(
                      "https://wordpress.org/plugins/classic-widgets/"
                    ),
                    children: (0,external_wp_i18n_namespaceobject.__)(
                      "get the classic widgets plugin."
                    )
                  }
                )
              ] })
            ] })
          ] })
        },
        {
          image: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            welcomeguideimage,
            {
              nonanimatedsrc: "https://s.w.org/images/block-editor/welcome-editor.svg",
              animatedsrc: "https://s.w.org/images/block-editor/welcome-editor.gif"
            }
          ),
          content: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-widgets-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("customize each block") }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-widgets-welcome-guide__text", children: (0,external_wp_i18n_namespaceobject.__)(
              "each block comes with its own set of controls for changing things like color, width, and alignment. these will show and hide automatically when you have a block selected."
            ) })
          ] })
        },
        {
          image: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            welcomeguideimage,
            {
              nonanimatedsrc: "https://s.w.org/images/block-editor/welcome-library.svg",
              animatedsrc: "https://s.w.org/images/block-editor/welcome-library.gif"
            }
          ),
          content: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-widgets-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("explore all blocks") }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-widgets-welcome-guide__text", children: (0,external_wp_element_namespaceobject.createinterpolateelement)(
              (0,external_wp_i18n_namespaceobject.__)(
                "all of the blocks available to you live in the block library. you\u2019ll find it wherever you see the <insertericonimage /> icon."
              ),
              {
                insertericonimage: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                  "img",
                  {
                    classname: "edit-widgets-welcome-guide__inserter-icon",
                    alt: (0,external_wp_i18n_namespaceobject.__)("inserter"),
                    src: "data:image/svg+xml,%3csvg width='18' height='18' viewbox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='18' height='18' rx='2' fill='%231e1e1e'/%3e%3cpath d='m9.22727 4v14m4 8.77273h14' stroke='white' stroke-width='1.5'/%3e%3c/svg%3e%0a"
                  }
                )
              }
            ) })
          ] })
        },
        {
          image: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            welcomeguideimage,
            {
              nonanimatedsrc: "https://s.w.org/images/block-editor/welcome-documentation.svg",
              animatedsrc: "https://s.w.org/images/block-editor/welcome-documentation.gif"
            }
          ),
          content: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-widgets-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("learn more") }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-widgets-welcome-guide__text", children: (0,external_wp_element_namespaceobject.createinterpolateelement)(
              (0,external_wp_i18n_namespaceobject.__)(
                "new to the block editor? want to learn more about using it? <a>here's a detailed guide.</a>"
              ),
              {
                a: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                  external_wp_components_namespaceobject.externallink,
                  {
                    href: (0,external_wp_i18n_namespaceobject.__)(
                      "https://wordpress.org/documentation/article/wordpress-block-editor/"
                    )
                  }
                )
              }
            ) })
          ] })
        }
      ]
    }
  );
}
function welcomeguideimage({ nonanimatedsrc, animatedsrc }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("picture", { classname: "edit-widgets-welcome-guide__image", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      "source",
      {
        srcset: nonanimatedsrc,
        media: "(prefers-reduced-motion: reduce)"
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("img", { src: animatedsrc, width: "312", height: "240", alt: "" })
  ] });
}


;// ./node_modules/@wordpress/edit-widgets/build-module/components/layout/index.js












function layout({ blockeditorsettings }) {
  const { createerrornotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  function onpluginareaerror(name) {
    createerrornotice(
      (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: plugin name */
        (0,external_wp_i18n_namespaceobject.__)(
          'the "%s" plugin has encountered an error and cannot be rendered.'
        ),
        name
      )
    );
  }
  const navigateregionsprops = (0,external_wp_components_namespaceobject.__unstableusenavigateregions)();
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(errorboundary, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "div",
    {
      classname: navigateregionsprops.classname,
      ...navigateregionsprops,
      ref: navigateregionsprops.ref,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
        widgetareasblockeditorprovider,
        {
          blockeditorsettings,
          children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(interface_default, { blockeditorsettings }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(sidebar, {}),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_plugins_namespaceobject.pluginarea, { onerror: onpluginareaerror }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(unsavedchangeswarning, {}),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(welcomeguide, {})
          ]
        }
      )
    }
  ) });
}
var layout_default = layout;


;// ./node_modules/@wordpress/edit-widgets/build-module/index.js














const disabledblocks = [
  "core/more",
  "core/freeform",
  "core/template-part",
  ...allow_reusable_blocks ? [] : ["core/block"]
];
function initializeeditor(id, settings) {
  const target = document.getelementbyid(id);
  const root = (0,external_wp_element_namespaceobject.createroot)(target);
  const coreblocks = (0,external_wp_blocklibrary_namespaceobject.__experimentalgetcoreblocks)().filter((block) => {
    return !(disabledblocks.includes(block.name) || block.name.startswith("core/post") || block.name.startswith("core/query") || block.name.startswith("core/site") || block.name.startswith("core/navigation"));
  });
  (0,external_wp_data_namespaceobject.dispatch)(external_wp_preferences_namespaceobject.store).setdefaults("core/edit-widgets", {
    fixedtoolbar: false,
    welcomeguide: true,
    showblockbreadcrumbs: true,
    themestyles: true
  });
  (0,external_wp_data_namespaceobject.dispatch)(external_wp_blocks_namespaceobject.store).reapplyblocktypefilters();
  (0,external_wp_blocklibrary_namespaceobject.registercoreblocks)(coreblocks);
  (0,external_wp_widgets_namespaceobject.registerlegacywidgetblock)();
  if (false) {}
  (0,external_wp_widgets_namespaceobject.registerlegacywidgetvariations)(settings);
  registerblock(widget_area_namespaceobject);
  (0,external_wp_widgets_namespaceobject.registerwidgetgroupblock)();
  settings.__experimentalfetchlinksuggestions = (search, searchoptions) => (0,external_wp_coredata_namespaceobject.__experimentalfetchlinksuggestions)(search, searchoptions, settings);
  (0,external_wp_blocks_namespaceobject.setfreeformcontenthandlername)("core/html");
  root.render(
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.strictmode, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(layout_default, { blockeditorsettings: settings }) })
  );
  return root;
}
const initialize = initializeeditor;
function reinitializeeditor() {
  external_wp_deprecated_default()("wp.editwidgets.reinitializeeditor", {
    since: "6.2",
    version: "6.3"
  });
}
const registerblock = (block) => {
  if (!block) {
    return;
  }
  const { metadata, settings, name } = block;
  if (metadata) {
    (0,external_wp_blocks_namespaceobject.unstable__bootstrapserversideblockdefinitions)({ [name]: metadata });
  }
  (0,external_wp_blocks_namespaceobject.registerblocktype)(name, settings);
};



(window.wp = window.wp || {}).editwidgets = __webpack_exports__;
/******/ })()
;






