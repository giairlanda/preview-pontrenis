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
  __unstablecreatepersistencelayer: () => (/* binding */ __unstablecreatepersistencelayer),
  create: () => (/* reexport */ create)
});

;// external ["wp","apifetch"]
const external_wp_apifetch_namespaceobject = window["wp"]["apifetch"];
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_namespaceobject);
;// ./node_modules/@wordpress/preferences-persistence/build-module/create/debounce-async.js
function debounceasync(func, delayms) {
  let timeoutid;
  let activepromise;
  return async function debounced(...args) {
    if (!activepromise && !timeoutid) {
      return new promise((resolve, reject) => {
        activepromise = func(...args).then((...thenargs) => {
          resolve(...thenargs);
        }).catch((error) => {
          reject(error);
        }).finally(() => {
          activepromise = null;
        });
      });
    }
    if (activepromise) {
      await activepromise;
    }
    if (timeoutid) {
      cleartimeout(timeoutid);
      timeoutid = null;
    }
    return new promise((resolve, reject) => {
      timeoutid = settimeout(() => {
        activepromise = func(...args).then((...thenargs) => {
          resolve(...thenargs);
        }).catch((error) => {
          reject(error);
        }).finally(() => {
          activepromise = null;
          timeoutid = null;
        });
      }, delayms);
    });
  };
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/create/index.js


const empty_object = {};
const localstorage = window.localstorage;
function create({
  preloadeddata,
  localstoragerestorekey = "wp_preferences_restore_data",
  requestdebouncems = 2500
} = {}) {
  let cache = preloadeddata;
  const debouncedapifetch = debounceasync((external_wp_apifetch_default()), requestdebouncems);
  async function get() {
    if (cache) {
      return cache;
    }
    const user = await external_wp_apifetch_default()({
      path: "/wp/v2/users/me?context=edit"
    });
    const serverdata = user?.meta?.persisted_preferences;
    const localdata = json.parse(
      localstorage.getitem(localstoragerestorekey)
    );
    const servertimestamp = date.parse(serverdata?._modified) || 0;
    const localtimestamp = date.parse(localdata?._modified) || 0;
    if (serverdata && servertimestamp >= localtimestamp) {
      cache = serverdata;
    } else if (localdata) {
      cache = localdata;
    } else {
      cache = empty_object;
    }
    return cache;
  }
  function set(newdata) {
    const datawithtimestamp = {
      ...newdata,
      _modified: (/* @__pure__ */ new date()).toisostring()
    };
    cache = datawithtimestamp;
    localstorage.setitem(
      localstoragerestorekey,
      json.stringify(datawithtimestamp)
    );
    debouncedapifetch({
      path: "/wp/v2/users/me",
      method: "put",
      // `keepalive` will still send the request in the background,
      // even when a browser unload event might interrupt it.
      // this should hopefully make things more resilient.
      // this does have a size limit of 64kb, but the data is usually
      // much less.
      keepalive: true,
      data: {
        meta: {
          persisted_preferences: datawithtimestamp
        }
      }
    }).catch(() => {
    });
  }
  return {
    get,
    set
  };
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/migrations/legacy-local-storage-data/move-feature-preferences.js
function movefeaturepreferences(state, sourcestorename) {
  const preferencesstorename = "core/preferences";
  const interfacestorename = "core/interface";
  const interfacefeatures = state?.[interfacestorename]?.preferences?.features?.[sourcestorename];
  const sourcefeatures = state?.[sourcestorename]?.preferences?.features;
  const featurestomigrate = interfacefeatures ? interfacefeatures : sourcefeatures;
  if (!featurestomigrate) {
    return state;
  }
  const existingpreferences = state?.[preferencesstorename]?.preferences;
  if (existingpreferences?.[sourcestorename]) {
    return state;
  }
  let updatedinterfacestate;
  if (interfacefeatures) {
    const otherinterfacestate = state?.[interfacestorename];
    const otherinterfacescopes = state?.[interfacestorename]?.preferences?.features;
    updatedinterfacestate = {
      [interfacestorename]: {
        ...otherinterfacestate,
        preferences: {
          features: {
            ...otherinterfacescopes,
            [sourcestorename]: void 0
          }
        }
      }
    };
  }
  let updatedsourcestate;
  if (sourcefeatures) {
    const othersourcestate = state?.[sourcestorename];
    const sourcepreferences = state?.[sourcestorename]?.preferences;
    updatedsourcestate = {
      [sourcestorename]: {
        ...othersourcestate,
        preferences: {
          ...sourcepreferences,
          features: void 0
        }
      }
    };
  }
  return {
    ...state,
    [preferencesstorename]: {
      preferences: {
        ...existingpreferences,
        [sourcestorename]: featurestomigrate
      }
    },
    ...updatedinterfacestate,
    ...updatedsourcestate
  };
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/migrations/legacy-local-storage-data/move-third-party-feature-preferences.js
function movethirdpartyfeaturepreferencestopreferences(state) {
  const interfacestorename = "core/interface";
  const preferencesstorename = "core/preferences";
  const interfacescopes = state?.[interfacestorename]?.preferences?.features;
  const interfacescopekeys = interfacescopes ? object.keys(interfacescopes) : [];
  if (!interfacescopekeys?.length) {
    return state;
  }
  return interfacescopekeys.reduce(function(convertedstate, scope) {
    if (scope.startswith("core")) {
      return convertedstate;
    }
    const featurestomigrate = interfacescopes?.[scope];
    if (!featurestomigrate) {
      return convertedstate;
    }
    const existingmigrateddata = convertedstate?.[preferencesstorename]?.preferences?.[scope];
    if (existingmigrateddata) {
      return convertedstate;
    }
    const otherpreferencesscopes = convertedstate?.[preferencesstorename]?.preferences;
    const otherinterfacestate = convertedstate?.[interfacestorename];
    const otherinterfacescopes = convertedstate?.[interfacestorename]?.preferences?.features;
    return {
      ...convertedstate,
      [preferencesstorename]: {
        preferences: {
          ...otherpreferencesscopes,
          [scope]: featurestomigrate
        }
      },
      [interfacestorename]: {
        ...otherinterfacestate,
        preferences: {
          features: {
            ...otherinterfacescopes,
            [scope]: void 0
          }
        }
      }
    };
  }, state);
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/migrations/legacy-local-storage-data/move-individual-preference.js
const identity = (arg) => arg;
function moveindividualpreferencetopreferences(state, { from: sourcestorename, to: scope }, key, convert = identity) {
  const preferencesstorename = "core/preferences";
  const sourcepreference = state?.[sourcestorename]?.preferences?.[key];
  if (sourcepreference === void 0) {
    return state;
  }
  const targetpreference = state?.[preferencesstorename]?.preferences?.[scope]?.[key];
  if (targetpreference) {
    return state;
  }
  const otherscopes = state?.[preferencesstorename]?.preferences;
  const otherpreferences = state?.[preferencesstorename]?.preferences?.[scope];
  const othersourcestate = state?.[sourcestorename];
  const allsourcepreferences = state?.[sourcestorename]?.preferences;
  const convertedpreferences = convert({ [key]: sourcepreference });
  return {
    ...state,
    [preferencesstorename]: {
      preferences: {
        ...otherscopes,
        [scope]: {
          ...otherpreferences,
          ...convertedpreferences
        }
      }
    },
    [sourcestorename]: {
      ...othersourcestate,
      preferences: {
        ...allsourcepreferences,
        [key]: void 0
      }
    }
  };
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/migrations/legacy-local-storage-data/move-interface-enable-items.js
function moveinterfaceenableitems(state) {
  const interfacestorename = "core/interface";
  const preferencesstorename = "core/preferences";
  const sourceenableitems = state?.[interfacestorename]?.enableitems;
  if (!sourceenableitems) {
    return state;
  }
  const allpreferences = state?.[preferencesstorename]?.preferences ?? {};
  const sourcecomplementaryareas = sourceenableitems?.singleenableitems?.complementaryarea ?? {};
  const preferenceswithconvertedcomplementaryareas = object.keys(
    sourcecomplementaryareas
  ).reduce((accumulator, scope) => {
    const data = sourcecomplementaryareas[scope];
    if (accumulator?.[scope]?.complementaryarea) {
      return accumulator;
    }
    return {
      ...accumulator,
      [scope]: {
        ...accumulator[scope],
        complementaryarea: data
      }
    };
  }, allpreferences);
  const sourcepinneditems = sourceenableitems?.multipleenableitems?.pinneditems ?? {};
  const allconverteddata = object.keys(sourcepinneditems).reduce(
    (accumulator, scope) => {
      const data = sourcepinneditems[scope];
      if (accumulator?.[scope]?.pinneditems) {
        return accumulator;
      }
      return {
        ...accumulator,
        [scope]: {
          ...accumulator[scope],
          pinneditems: data
        }
      };
    },
    preferenceswithconvertedcomplementaryareas
  );
  const otherinterfaceitems = state[interfacestorename];
  return {
    ...state,
    [preferencesstorename]: {
      preferences: allconverteddata
    },
    [interfacestorename]: {
      ...otherinterfaceitems,
      enableitems: void 0
    }
  };
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/migrations/legacy-local-storage-data/convert-edit-post-panels.js
function converteditpostpanels(preferences) {
  const panels = preferences?.panels ?? {};
  return object.keys(panels).reduce(
    (converteddata, panelname) => {
      const panel = panels[panelname];
      if (panel?.enabled === false) {
        converteddata.inactivepanels.push(panelname);
      }
      if (panel?.opened === true) {
        converteddata.openpanels.push(panelname);
      }
      return converteddata;
    },
    { inactivepanels: [], openpanels: [] }
  );
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/migrations/legacy-local-storage-data/index.js





function getlegacydata(userid) {
  const key = `wp_data_user_${userid}`;
  const unparseddata = window.localstorage.getitem(key);
  return json.parse(unparseddata);
}
function convertlegacydata(data) {
  if (!data) {
    return;
  }
  data = movefeaturepreferences(data, "core/edit-widgets");
  data = movefeaturepreferences(data, "core/customize-widgets");
  data = movefeaturepreferences(data, "core/edit-post");
  data = movefeaturepreferences(data, "core/edit-site");
  data = movethirdpartyfeaturepreferencestopreferences(data);
  data = moveinterfaceenableitems(data);
  data = moveindividualpreferencetopreferences(
    data,
    { from: "core/edit-post", to: "core/edit-post" },
    "hiddenblocktypes"
  );
  data = moveindividualpreferencetopreferences(
    data,
    { from: "core/edit-post", to: "core/edit-post" },
    "editormode"
  );
  data = moveindividualpreferencetopreferences(
    data,
    { from: "core/edit-post", to: "core/edit-post" },
    "panels",
    converteditpostpanels
  );
  data = moveindividualpreferencetopreferences(
    data,
    { from: "core/editor", to: "core" },
    "ispublishsidebarenabled"
  );
  data = moveindividualpreferencetopreferences(
    data,
    { from: "core/edit-post", to: "core" },
    "ispublishsidebarenabled"
  );
  data = moveindividualpreferencetopreferences(
    data,
    { from: "core/edit-site", to: "core/edit-site" },
    "editormode"
  );
  return data?.["core/preferences"]?.preferences;
}
function convertlegacylocalstoragedata(userid) {
  const data = getlegacydata(userid);
  return convertlegacydata(data);
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/migrations/preferences-package-data/convert-complementary-areas.js
function convertcomplementaryareas(state) {
  return object.keys(state).reduce((stateaccumulator, scope) => {
    const scopedata = state[scope];
    if (scopedata?.complementaryarea) {
      const updatedscopedata = { ...scopedata };
      delete updatedscopedata.complementaryarea;
      updatedscopedata.iscomplementaryareavisible = true;
      stateaccumulator[scope] = updatedscopedata;
      return stateaccumulator;
    }
    return stateaccumulator;
  }, state);
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/migrations/preferences-package-data/convert-editor-settings.js
function converteditorsettings(data) {
  let newdata = data;
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
  settingstomovetocore.foreach((setting) => {
    if (data?.["core/edit-post"]?.[setting] !== void 0) {
      newdata = {
        ...newdata,
        core: {
          ...newdata?.core,
          [setting]: data["core/edit-post"][setting]
        }
      };
      delete newdata["core/edit-post"][setting];
    }
    if (data?.["core/edit-site"]?.[setting] !== void 0) {
      delete newdata["core/edit-site"][setting];
    }
  });
  if (object.keys(newdata?.["core/edit-post"] ?? {})?.length === 0) {
    delete newdata["core/edit-post"];
  }
  if (object.keys(newdata?.["core/edit-site"] ?? {})?.length === 0) {
    delete newdata["core/edit-site"];
  }
  return newdata;
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/migrations/preferences-package-data/index.js


function convertpreferencespackagedata(data) {
  let newdata = convertcomplementaryareas(data);
  newdata = converteditorsettings(newdata);
  return newdata;
}


;// ./node_modules/@wordpress/preferences-persistence/build-module/index.js



function __unstablecreatepersistencelayer(serverdata, userid) {
  const localstoragerestorekey = `wp_preferences_user_${userid}`;
  const localdata = json.parse(
    window.localstorage.getitem(localstoragerestorekey)
  );
  const servermodified = date.parse(serverdata && serverdata._modified) || 0;
  const localmodified = date.parse(localdata && localdata._modified) || 0;
  let preloadeddata;
  if (serverdata && servermodified >= localmodified) {
    preloadeddata = convertpreferencespackagedata(serverdata);
  } else if (localdata) {
    preloadeddata = convertpreferencespackagedata(localdata);
  } else {
    preloadeddata = convertlegacylocalstoragedata(userid);
  }
  return create({
    preloadeddata,
    localstoragerestorekey
  });
}


(window.wp = window.wp || {}).preferencespersistence = __webpack_exports__;
/******/ })()
;


