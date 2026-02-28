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
  preferencetogglemenuitem: () => (/* reexport */ preferencetogglemenuitem),
  privateapis: () => (/* reexport */ privateapis),
  store: () => (/* reexport */ store)
});

// namespace object: ./node_modules/@wordpress/preferences/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  set: () => (set),
  setdefaults: () => (setdefaults),
  setpersistencelayer: () => (setpersistencelayer),
  toggle: () => (toggle)
});

// namespace object: ./node_modules/@wordpress/preferences/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  get: () => (get)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/check.js


var check_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m16.5 7.5 10 13.9l-2.5-2.4-1 1 3.5 3.6 7.5-7.6z" }) });


;// external ["wp","a11y"]
const external_wp_a11y_namespaceobject = window["wp"]["a11y"];
;// ./node_modules/@wordpress/preferences/build-module/store/reducer.js

function defaults(state = {}, action) {
  if (action.type === "set_preference_defaults") {
    const { scope, defaults: values } = action;
    return {
      ...state,
      [scope]: {
        ...state[scope],
        ...values
      }
    };
  }
  return state;
}
function withpersistencelayer(reducer) {
  let persistencelayer;
  return (state, action) => {
    if (action.type === "set_persistence_layer") {
      const { persistencelayer: persistence, persisteddata } = action;
      persistencelayer = persistence;
      return persisteddata;
    }
    const nextstate = reducer(state, action);
    if (action.type === "set_preference_value") {
      persistencelayer?.set(nextstate);
    }
    return nextstate;
  };
}
const preferences = withpersistencelayer((state = {}, action) => {
  if (action.type === "set_preference_value") {
    const { scope, name, value } = action;
    return {
      ...state,
      [scope]: {
        ...state[scope],
        [name]: value
      }
    };
  }
  return state;
});
var reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({
  defaults,
  preferences
});


;// ./node_modules/@wordpress/preferences/build-module/store/actions.js
function toggle(scope, name) {
  return function({ select, dispatch }) {
    const currentvalue = select.get(scope, name);
    dispatch.set(scope, name, !currentvalue);
  };
}
function set(scope, name, value) {
  return {
    type: "set_preference_value",
    scope,
    name,
    value
  };
}
function setdefaults(scope, defaults) {
  return {
    type: "set_preference_defaults",
    scope,
    defaults
  };
}
async function setpersistencelayer(persistencelayer) {
  const persisteddata = await persistencelayer.get();
  return {
    type: "set_persistence_layer",
    persistencelayer,
    persisteddata
  };
}


;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// ./node_modules/@wordpress/preferences/build-module/store/selectors.js

const withdeprecatedkeys = (originalget) => (state, scope, name) => {
  const settingstomovetocore = [
    "allowrightclickoverrides",
    "distractionfree",
    "editormode",
    "fixedtoolbar",
    "focusmode",
    "hiddenblocktypes",
    "inactivepanels",
    "keepcaretinsideblock",
    "mostusedblocks",
    "openpanels",
    "showblockbreadcrumbs",
    "showiconlabels",
    "showlistviewbydefault",
    "ispublishsidebarenabled",
    "iscomplementaryareavisible",
    "pinneditems"
  ];
  if (settingstomovetocore.includes(name) && ["core/edit-post", "core/edit-site"].includes(scope)) {
    external_wp_deprecated_default()(
      `wp.data.select( 'core/preferences' ).get( '${scope}', '${name}' )`,
      {
        since: "6.5",
        alternative: `wp.data.select( 'core/preferences' ).get( 'core', '${name}' )`
      }
    );
    return originalget(state, "core", name);
  }
  return originalget(state, scope, name);
};
const get = withdeprecatedkeys((state, scope, name) => {
  const value = state.preferences[scope]?.[name];
  return value !== void 0 ? value : state.defaults[scope]?.[name];
});


;// ./node_modules/@wordpress/preferences/build-module/store/constants.js
const store_name = "core/preferences";


;// ./node_modules/@wordpress/preferences/build-module/store/index.js





const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  reducer: reducer_default,
  actions: actions_namespaceobject,
  selectors: selectors_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);


;// ./node_modules/@wordpress/preferences/build-module/components/preference-toggle-menu-item/index.js







function preferencetogglemenuitem({
  scope,
  name,
  label,
  info,
  messageactivated,
  messagedeactivated,
  shortcut,
  handletoggling = true,
  ontoggle = () => null,
  disabled = false
}) {
  const isactive = (0,external_wp_data_namespaceobject.useselect)(
    (select) => !!select(store).get(scope, name),
    [scope, name]
  );
  const { toggle } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const speakmessage = () => {
    if (isactive) {
      const message = messagedeactivated || (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: preference name, e.g. 'fullscreen mode' */
        (0,external_wp_i18n_namespaceobject.__)("preference deactivated - %s"),
        label
      );
      (0,external_wp_a11y_namespaceobject.speak)(message);
    } else {
      const message = messageactivated || (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: preference name, e.g. 'fullscreen mode' */
        (0,external_wp_i18n_namespaceobject.__)("preference activated - %s"),
        label
      );
      (0,external_wp_a11y_namespaceobject.speak)(message);
    }
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.menuitem,
    {
      icon: isactive && check_default,
      isselected: isactive,
      onclick: () => {
        ontoggle();
        if (handletoggling) {
          toggle(scope, name);
        }
        speakmessage();
      },
      role: "menuitemcheckbox",
      info,
      shortcut,
      disabled,
      children: label
    }
  );
}


;// ./node_modules/@wordpress/preferences/build-module/components/index.js



;// ./node_modules/@wordpress/preferences/build-module/components/preference-base-option/index.js


function baseoption({ help, label, ischecked, onchange, children }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "preference-base-option", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.togglecontrol,
      {
        __nexthasnomarginbottom: true,
        help,
        label,
        checked: ischecked,
        onchange
      }
    ),
    children
  ] });
}
var preference_base_option_default = baseoption;


;// ./node_modules/@wordpress/preferences/build-module/components/preference-toggle-control/index.js




function preferencetogglecontrol(props) {
  const {
    scope,
    featurename,
    ontoggle = () => {
    },
    ...remainingprops
  } = props;
  const ischecked = (0,external_wp_data_namespaceobject.useselect)(
    (select) => !!select(store).get(scope, featurename),
    [scope, featurename]
  );
  const { toggle } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const onchange = () => {
    ontoggle();
    toggle(scope, featurename);
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    preference_base_option_default,
    {
      onchange,
      ischecked,
      ...remainingprops
    }
  );
}
var preference_toggle_control_default = preferencetogglecontrol;


;// ./node_modules/@wordpress/preferences/build-module/components/preferences-modal/index.js



function preferencesmodal({ closemodal, children }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.modal,
    {
      classname: "preferences-modal",
      title: (0,external_wp_i18n_namespaceobject.__)("preferences"),
      onrequestclose: closemodal,
      children
    }
  );
}


;// ./node_modules/@wordpress/preferences/build-module/components/preferences-modal-section/index.js

const section = ({ description, title, children }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("fieldset", { classname: "preferences-modal__section", children: [
  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("legend", { classname: "preferences-modal__section-legend", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h2", { classname: "preferences-modal__section-title", children: title }),
    description && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "preferences-modal__section-description", children: description })
  ] }),
  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "preferences-modal__section-content", children })
] });
var preferences_modal_section_default = section;


;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// ./node_modules/@wordpress/icons/build-module/icon/index.js

var icon_default = (0,external_wp_element_namespaceobject.forwardref)(
  ({ icon, size = 24, ...props }, ref) => {
    return (0,external_wp_element_namespaceobject.cloneelement)(icon, {
      width: size,
      height: size,
      ...props,
      ref
    });
  }
);


;// ./node_modules/@wordpress/icons/build-module/library/chevron-left.js


var chevron_left_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m14.6 7l-1.2-1l8 12l5.4 6 1.2-1-4.6-5z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/chevron-right.js


var chevron_right_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m10.6 6l9.4 7l4.6 5-4.6 5 1.2 1 5.4-6z" }) });


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/preferences/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/preferences"
);


;// ./node_modules/@wordpress/preferences/build-module/components/preferences-modal-tabs/index.js







const { tabs } = unlock(external_wp_components_namespaceobject.privateapis);
const preferences_menu = "preferences-menu";
function preferencesmodaltabs({ sections }) {
  const islargeviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium");
  const [activemenu, setactivemenu] = (0,external_wp_element_namespaceobject.usestate)(preferences_menu);
  const { tabs, sectionscontentmap } = (0,external_wp_element_namespaceobject.usememo)(() => {
    let mappedtabs = {
      tabs: [],
      sectionscontentmap: {}
    };
    if (sections.length) {
      mappedtabs = sections.reduce(
        (accumulator, { name, tablabel: title, content }) => {
          accumulator.tabs.push({ name, title });
          accumulator.sectionscontentmap[name] = content;
          return accumulator;
        },
        { tabs: [], sectionscontentmap: {} }
      );
    }
    return mappedtabs;
  }, [sections]);
  let modalcontent;
  if (islargeviewport) {
    modalcontent = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "preferences__tabs", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
      tabs,
      {
        defaulttabid: activemenu !== preferences_menu ? activemenu : void 0,
        onselect: setactivemenu,
        orientation: "vertical",
        children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(tabs.tablist, { classname: "preferences__tabs-tablist", children: tabs.map((tab) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            tabs.tab,
            {
              tabid: tab.name,
              classname: "preferences__tabs-tab",
              children: tab.title
            },
            tab.name
          )) }),
          tabs.map((tab) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            tabs.tabpanel,
            {
              tabid: tab.name,
              classname: "preferences__tabs-tabpanel",
              focusable: false,
              children: sectionscontentmap[tab.name] || null
            },
            tab.name
          ))
        ]
      }
    ) });
  } else {
    modalcontent = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.navigator, { initialpath: "/", classname: "preferences__provider", children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.navigator.screen, { path: "/", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.card, { isborderless: true, size: "small", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.cardbody, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentalitemgroup, { children: tabs.map((tab) => {
        return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.navigator.button,
          {
            path: `/${tab.name}`,
            as: external_wp_components_namespaceobject.__experimentalitem,
            isaction: true,
            children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalhstack, { justify: "space-between", children: [
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.flexitem, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentaltruncate, { children: tab.title }) }),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.flexitem, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                icon_default,
                {
                  icon: (0,external_wp_i18n_namespaceobject.isrtl)() ? chevron_left_default : chevron_right_default
                }
              ) })
            ] })
          },
          tab.name
        );
      }) }) }) }) }),
      sections.length && sections.map((section) => {
        return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.navigator.screen,
          {
            path: `/${section.name}`,
            children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.card, { isborderless: true, size: "large", children: [
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
                external_wp_components_namespaceobject.cardheader,
                {
                  isborderless: false,
                  justify: "left",
                  size: "small",
                  gap: "6",
                  children: [
                    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                      external_wp_components_namespaceobject.navigator.backbutton,
                      {
                        icon: (0,external_wp_i18n_namespaceobject.isrtl)() ? chevron_right_default : chevron_left_default,
                        label: (0,external_wp_i18n_namespaceobject.__)("back")
                      }
                    ),
                    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentaltext, { size: "16", children: section.tablabel })
                  ]
                }
              ),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.cardbody, { children: section.content })
            ] })
          },
          `${section.name}-menu`
        );
      })
    ] });
  }
  return modalcontent;
}


;// ./node_modules/@wordpress/preferences/build-module/private-apis.js






const privateapis = {};
lock(privateapis, {
  preferencebaseoption: preference_base_option_default,
  preferencetogglecontrol: preference_toggle_control_default,
  preferencesmodal: preferencesmodal,
  preferencesmodalsection: preferences_modal_section_default,
  preferencesmodaltabs: preferencesmodaltabs
});


;// ./node_modules/@wordpress/preferences/build-module/index.js





(window.wp = window.wp || {}).preferences = __webpack_exports__;
/******/ })()
;




