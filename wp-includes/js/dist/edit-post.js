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
  pluginblocksettingsmenuitem: () => (/* reexport */ pluginblocksettingsmenuitem),
  plugindocumentsettingpanel: () => (/* reexport */ plugindocumentsettingpanel),
  pluginmoremenuitem: () => (/* reexport */ pluginmoremenuitem),
  pluginpostpublishpanel: () => (/* reexport */ pluginpostpublishpanel),
  pluginpoststatusinfo: () => (/* reexport */ pluginpoststatusinfo),
  pluginprepublishpanel: () => (/* reexport */ pluginprepublishpanel),
  pluginsidebar: () => (/* reexport */ pluginsidebar),
  pluginsidebarmoremenuitem: () => (/* reexport */ pluginsidebarmoremenuitem),
  __experimentalfullscreenmodeclose: () => (/* reexport */ fullscreen_mode_close_default),
  __experimentalmaindashboardbutton: () => (/* binding */ __experimentalmaindashboardbutton),
  __experimentalpluginpostexcerpt: () => (/* reexport */ __experimentalpluginpostexcerpt),
  initializeeditor: () => (/* binding */ initializeeditor),
  reinitializeeditor: () => (/* binding */ reinitializeeditor),
  store: () => (/* reexport */ store)
});

// namespace object: ./node_modules/@wordpress/edit-post/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  __experimentalsetpreviewdevicetype: () => (__experimentalsetpreviewdevicetype),
  __unstablecreatetemplate: () => (__unstablecreatetemplate),
  closegeneralsidebar: () => (closegeneralsidebar),
  closemodal: () => (closemodal),
  closepublishsidebar: () => (closepublishsidebar),
  hideblocktypes: () => (hideblocktypes),
  initializemetaboxes: () => (initializemetaboxes),
  metaboxupdatesfailure: () => (metaboxupdatesfailure),
  metaboxupdatessuccess: () => (metaboxupdatessuccess),
  opengeneralsidebar: () => (opengeneralsidebar),
  openmodal: () => (openmodal),
  openpublishsidebar: () => (openpublishsidebar),
  removeeditorpanel: () => (removeeditorpanel),
  requestmetaboxupdates: () => (requestmetaboxupdates),
  setavailablemetaboxesperlocation: () => (setavailablemetaboxesperlocation),
  setiseditingtemplate: () => (setiseditingtemplate),
  setisinserteropened: () => (setisinserteropened),
  setislistviewopened: () => (setislistviewopened),
  showblocktypes: () => (showblocktypes),
  switcheditormode: () => (switcheditormode),
  toggledistractionfree: () => (toggledistractionfree),
  toggleeditorpanelenabled: () => (toggleeditorpanelenabled),
  toggleeditorpanelopened: () => (toggleeditorpanelopened),
  togglefeature: () => (togglefeature),
  togglefullscreenmode: () => (togglefullscreenmode),
  togglepinnedpluginitem: () => (togglepinnedpluginitem),
  togglepublishsidebar: () => (togglepublishsidebar),
  updatepreferredstylevariations: () => (updatepreferredstylevariations)
});

// namespace object: ./node_modules/@wordpress/edit-post/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  __experimentalgetinsertionpoint: () => (__experimentalgetinsertionpoint),
  __experimentalgetpreviewdevicetype: () => (__experimentalgetpreviewdevicetype),
  aremetaboxesinitialized: () => (aremetaboxesinitialized),
  getactivegeneralsidebarname: () => (getactivegeneralsidebarname),
  getactivemetaboxlocations: () => (getactivemetaboxlocations),
  getallmetaboxes: () => (getallmetaboxes),
  geteditedposttemplate: () => (geteditedposttemplate),
  geteditormode: () => (geteditormode),
  gethiddenblocktypes: () => (gethiddenblocktypes),
  getmetaboxesperlocation: () => (getmetaboxesperlocation),
  getpreference: () => (getpreference),
  getpreferences: () => (getpreferences),
  hasmetaboxes: () => (hasmetaboxes),
  iseditingtemplate: () => (iseditingtemplate),
  iseditorpanelenabled: () => (iseditorpanelenabled),
  iseditorpanelopened: () => (iseditorpanelopened),
  iseditorpanelremoved: () => (iseditorpanelremoved),
  iseditorsidebaropened: () => (iseditorsidebaropened),
  isfeatureactive: () => (isfeatureactive),
  isinserteropened: () => (isinserteropened),
  islistviewopened: () => (islistviewopened),
  ismetaboxlocationactive: () => (ismetaboxlocationactive),
  ismetaboxlocationvisible: () => (ismetaboxlocationvisible),
  ismodalactive: () => (ismodalactive),
  ispluginitempinned: () => (ispluginitempinned),
  ispluginsidebaropened: () => (ispluginsidebaropened),
  ispublishsidebaropened: () => (ispublishsidebaropened),
  issavingmetaboxes: () => (selectors_issavingmetaboxes)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","blocks"]
const external_wp_blocks_namespaceobject = window["wp"]["blocks"];
;// external ["wp","blocklibrary"]
const external_wp_blocklibrary_namespaceobject = window["wp"]["blocklibrary"];
;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// external ["wp","preferences"]
const external_wp_preferences_namespaceobject = window["wp"]["preferences"];
;// external ["wp","widgets"]
const external_wp_widgets_namespaceobject = window["wp"]["widgets"];
;// external ["wp","editor"]
const external_wp_editor_namespaceobject = window["wp"]["editor"];
;// ./node_modules/clsx/dist/clsx.mjs
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(array.isarray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const dist_clsx = (clsx);
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


;// external ["wp","blockeditor"]
const external_wp_blockeditor_namespaceobject = window["wp"]["blockeditor"];
;// external ["wp","plugins"]
const external_wp_plugins_namespaceobject = window["wp"]["plugins"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/chevron-up.js


var chevron_up_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m6.5 12.4l12 8l5.5 4.4-.9 1.2l12 10l-4.5 3.6-1-1.2z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/chevron-down.js


var chevron_down_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m17.5 11.6l12 16l-5.5-4.4.9-1.2l12 14l4.5-3.6 1 1.2z" }) });


;// external ["wp","notices"]
const external_wp_notices_namespaceobject = window["wp"]["notices"];
;// external ["wp","commands"]
const external_wp_commands_namespaceobject = window["wp"]["commands"];
;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// external ["wp","htmlentities"]
const external_wp_htmlentities_namespaceobject = window["wp"]["htmlentities"];
;// external ["wp","coredata"]
const external_wp_coredata_namespaceobject = window["wp"]["coredata"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// ./node_modules/@wordpress/icons/build-module/library/wordpress.js


var wordpress_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "-2 -2 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m20 10c0-5.51-4.49-10-10-10c4.48 0 0 4.49 0 10c0 5.52 4.48 10 10 10 5.51 0 10-4.48 10-10zm7.78 15.37l4.37 6.22c.55-.02 1.17-.08 1.17-.08.5-.06.44-1.13-.06-1.11 0 0-1.45.11-2.37.11-.18 0-.37 0-.58-.01c4.12 2.69 6.87 1.11 10 1.11c2.33 0 4.45.87 6.05 2.34-.68-.11-1.65.39-1.65 1.58 0 .74.45 1.36.9 2.1.35.61.55 1.36.55 2.46 0 1.49-1.4 5-1.4 5l-3.03-8.37c.54-.02.82-.17.82-.17.5-.05.44-1.25-.06-1.22 0 0-1.44.12-2.38.12-.87 0-2.33-.12-2.33-.12-.5-.03-.56 1.2-.06 1.22l.92.08 1.26 3.41zm17.41 10c.24-.64.74-1.87.43-4.25.7 1.29 1.05 2.71 1.05 4.25 0 3.29-1.73 6.24-4.4 7.78.97-2.59 1.94-5.2 2.92-7.78zm6.1 18.09c3.12 16.65 1.11 13.53 1.11 10c0-1.3.23-2.48.72-3.59c3.25 10.3 4.67 14.2 6.1 18.09zm4.03-6.63l2.58 6.98c-.86.29-1.76.45-2.71.45-.79 0-1.57-.11-2.29-.33.81-2.38 1.62-4.74 2.42-7.1z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/arrow-up-left.js


var arrow_up_left_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m14 6h6v8h1.5v8.5l17 18l1-1-9.5-9.5h14v6z" }) });


;// ./node_modules/@wordpress/edit-post/build-module/components/back-button/fullscreen-mode-close.js










const siteiconvariants = {
  edit: {
    clippath: "inset(0% round 0px)"
  },
  hover: {
    clippath: "inset( 22% round 2px )"
  },
  tap: {
    clippath: "inset(0% round 0px)"
  }
};
const togglehomeiconvariants = {
  edit: {
    opacity: 0,
    scale: 0.2
  },
  hover: {
    opacity: 1,
    scale: 1,
    clippath: "inset( 22% round 2px )"
  }
};
function fullscreenmodeclose({ showtooltip, icon, href, initialpost }) {
  const { isrequestingsiteicon, posttype, siteiconurl } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { getcurrentposttype } = select(external_wp_editor_namespaceobject.store);
      const { getentityrecord, getposttype, isresolving } = select(external_wp_coredata_namespaceobject.store);
      const sitedata = getentityrecord("root", "__unstablebase", void 0) || {};
      const _posttype = initialpost?.type || getcurrentposttype();
      return {
        isrequestingsiteicon: isresolving("getentityrecord", [
          "root",
          "__unstablebase",
          void 0
        ]),
        posttype: getposttype(_posttype),
        siteiconurl: sitedata.site_icon_url
      };
    },
    [initialpost?.type]
  );
  const disablemotion = (0,external_wp_compose_namespaceobject.usereducedmotion)();
  const transition = {
    duration: disablemotion ? 0 : 0.2
  };
  if (!posttype) {
    return null;
  }
  let siteiconcontent;
  if (isrequestingsiteicon && !siteiconurl) {
    siteiconcontent = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "edit-post-fullscreen-mode-close-site-icon__image" });
  } else if (siteiconurl) {
    siteiconcontent = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      "img",
      {
        classname: "edit-post-fullscreen-mode-close-site-icon__image",
        alt: (0,external_wp_i18n_namespaceobject.__)("site icon"),
        src: siteiconurl
      }
    );
  } else {
    siteiconcontent = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.icon,
      {
        classname: "edit-post-fullscreen-mode-close-site-icon__icon",
        icon: wordpress_default,
        size: 48
      }
    );
  }
  const buttonicon = icon ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.icon, { size: "36px", icon }) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "edit-post-fullscreen-mode-close-site-icon", children: siteiconcontent });
  const classes = dist_clsx("edit-post-fullscreen-mode-close", {
    "has-icon": siteiconurl
  });
  const buttonhref = href ?? (0,external_wp_url_namespaceobject.addqueryargs)("edit.php", {
    post_type: posttype.slug
  });
  const buttonlabel = posttype?.labels?.view_items ?? (0,external_wp_i18n_namespaceobject.__)("back");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    external_wp_components_namespaceobject.__unstablemotion.div,
    {
      classname: "edit-post-fullscreen-mode-close__view-mode-toggle",
      animate: "edit",
      initial: "edit",
      whilehover: "hover",
      whiletap: "tap",
      transition,
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.button,
          {
            __next40pxdefaultsize: true,
            classname: classes,
            href: buttonhref,
            label: buttonlabel,
            showtooltip,
            tooltipposition: "middle right",
            children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__unstablemotion.div, { variants: !disablemotion && siteiconvariants, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "edit-post-fullscreen-mode-close__view-mode-toggle-icon", children: buttonicon }) })
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.__unstablemotion.div,
          {
            classname: dist_clsx(
              "edit-post-fullscreen-mode-close__back-icon",
              {
                "has-site-icon": siteiconurl
              }
            ),
            variants: !disablemotion && togglehomeiconvariants,
            children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.icon, { icon: arrow_up_left_default })
          }
        )
      ]
    }
  );
}
var fullscreen_mode_close_default = fullscreenmodeclose;


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/edit-post/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/edit-post"
);


;// ./node_modules/@wordpress/edit-post/build-module/components/back-button/index.js





const { backbutton: backbuttonfill } = unlock(external_wp_editor_namespaceobject.privateapis);
const slidex = {
  hidden: { x: "-100%" },
  distractionfreeinactive: { x: 0 },
  hover: { x: 0, transition: { type: "tween", delay: 0.2 } }
};
function backbutton({ initialpost }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(backbuttonfill, { children: ({ length }) => length <= 1 && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.__unstablemotion.div,
    {
      variants: slidex,
      transition: { type: "tween", delay: 0.8 },
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        fullscreen_mode_close_default,
        {
          showtooltip: true,
          initialpost
        }
      )
    }
  ) });
}
var back_button_default = backbutton;


;// ./node_modules/@wordpress/edit-post/build-module/store/constants.js
const store_name = "core/edit-post";
const view_as_link_selector = "#wp-admin-bar-view a";
const view_as_preview_link_selector = "#wp-admin-bar-preview a";


;// ./node_modules/@wordpress/edit-post/build-module/components/editor-initialization/listener-hooks.js





const useupdatepostlinklistener = () => {
  const { isviewable, newpermalink } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { getposttype } = select(external_wp_coredata_namespaceobject.store);
    const { getcurrentpost, geteditedpostattribute } = select(external_wp_editor_namespaceobject.store);
    const posttype = getposttype(geteditedpostattribute("type"));
    return {
      isviewable: posttype?.viewable,
      newpermalink: getcurrentpost().link
    };
  }, []);
  const nodetoupdateref = (0,external_wp_element_namespaceobject.useref)();
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    nodetoupdateref.current = document.queryselector(view_as_preview_link_selector) || document.queryselector(view_as_link_selector);
  }, []);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (!newpermalink || !nodetoupdateref.current) {
      return;
    }
    if (!isviewable) {
      nodetoupdateref.current.style.display = "none";
      return;
    }
    nodetoupdateref.current.style.display = "";
    nodetoupdateref.current.setattribute("href", newpermalink);
  }, [newpermalink, isviewable]);
};


;// ./node_modules/@wordpress/edit-post/build-module/components/editor-initialization/index.js

function editorinitialization() {
  useupdatepostlinklistener();
  return null;
}


;// external ["wp","keyboardshortcuts"]
const external_wp_keyboardshortcuts_namespaceobject = window["wp"]["keyboardshortcuts"];
;// ./node_modules/@wordpress/edit-post/build-module/store/reducer.js

function issavingmetaboxes(state = false, action) {
  switch (action.type) {
    case "request_meta_box_updates":
      return true;
    case "meta_box_updates_success":
    case "meta_box_updates_failure":
      return false;
    default:
      return state;
  }
}
function mergemetaboxes(metaboxes = [], newmetaboxes) {
  const mergedmetaboxes = [...metaboxes];
  for (const metabox of newmetaboxes) {
    const existing = mergedmetaboxes.findindex(
      (box) => box.id === metabox.id
    );
    if (existing !== -1) {
      mergedmetaboxes[existing] = metabox;
    } else {
      mergedmetaboxes.push(metabox);
    }
  }
  return mergedmetaboxes;
}
function metaboxlocations(state = {}, action) {
  switch (action.type) {
    case "set_meta_boxes_per_locations": {
      const newstate = { ...state };
      for (const [location, metaboxes] of object.entries(
        action.metaboxesperlocation
      )) {
        newstate[location] = mergemetaboxes(
          newstate[location],
          metaboxes
        );
      }
      return newstate;
    }
  }
  return state;
}
function metaboxesinitialized(state = false, action) {
  switch (action.type) {
    case "meta_boxes_initialized":
      return true;
  }
  return state;
}
const metaboxes = (0,external_wp_data_namespaceobject.combinereducers)({
  issaving: issavingmetaboxes,
  locations: metaboxlocations,
  initialized: metaboxesinitialized
});
var reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({
  metaboxes
});


;// external ["wp","apifetch"]
const external_wp_apifetch_namespaceobject = window["wp"]["apifetch"];
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_namespaceobject);
;// external ["wp","hooks"]
const external_wp_hooks_namespaceobject = window["wp"]["hooks"];
;// ./node_modules/@wordpress/edit-post/build-module/utils/meta-boxes.js
const getmetaboxcontainer = (location) => {
  const area = document.queryselector(
    `.edit-post-meta-boxes-area.is-${location} .metabox-location-${location}`
  );
  if (area) {
    return area;
  }
  return document.queryselector("#metaboxes .metabox-location-" + location);
};


;// ./node_modules/@wordpress/edit-post/build-module/store/actions.js










const { interfacestore } = unlock(external_wp_editor_namespaceobject.privateapis);
const opengeneralsidebar = (name) => ({ registry }) => {
  registry.dispatch(interfacestore).enablecomplementaryarea("core", name);
};
const closegeneralsidebar = () => ({ registry }) => registry.dispatch(interfacestore).disablecomplementaryarea("core");
const openmodal = (name) => ({ registry }) => {
  external_wp_deprecated_default()("select( 'core/edit-post' ).openmodal( name )", {
    since: "6.3",
    alternative: "select( 'core/interface').openmodal( name )"
  });
  return registry.dispatch(interfacestore).openmodal(name);
};
const closemodal = () => ({ registry }) => {
  external_wp_deprecated_default()("select( 'core/edit-post' ).closemodal()", {
    since: "6.3",
    alternative: "select( 'core/interface').closemodal()"
  });
  return registry.dispatch(interfacestore).closemodal();
};
const openpublishsidebar = () => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).openpublishsidebar", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').openpublishsidebar"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).openpublishsidebar();
};
const closepublishsidebar = () => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).closepublishsidebar", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').closepublishsidebar"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).closepublishsidebar();
};
const togglepublishsidebar = () => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).togglepublishsidebar", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').togglepublishsidebar"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).togglepublishsidebar();
};
const toggleeditorpanelenabled = (panelname) => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).toggleeditorpanelenabled", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').toggleeditorpanelenabled"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).toggleeditorpanelenabled(panelname);
};
const toggleeditorpanelopened = (panelname) => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).toggleeditorpanelopened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').toggleeditorpanelopened"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).toggleeditorpanelopened(panelname);
};
const removeeditorpanel = (panelname) => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).removeeditorpanel", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').removeeditorpanel"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).removeeditorpanel(panelname);
};
const togglefeature = (feature) => ({ registry }) => registry.dispatch(external_wp_preferences_namespaceobject.store).toggle("core/edit-post", feature);
const switcheditormode = (mode) => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).switcheditormode", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').switcheditormode"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).switcheditormode(mode);
};
const togglepinnedpluginitem = (pluginname) => ({ registry }) => {
  const ispinned = registry.select(interfacestore).isitempinned("core", pluginname);
  registry.dispatch(interfacestore)[ispinned ? "unpinitem" : "pinitem"]("core", pluginname);
};
function updatepreferredstylevariations() {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).updatepreferredstylevariations", {
    since: "6.6",
    hint: "preferred style variations are not supported anymore."
  });
  return { type: "nothing" };
}
const showblocktypes = (blocknames) => ({ registry }) => {
  unlock(registry.dispatch(external_wp_editor_namespaceobject.store)).showblocktypes(blocknames);
};
const hideblocktypes = (blocknames) => ({ registry }) => {
  unlock(registry.dispatch(external_wp_editor_namespaceobject.store)).hideblocktypes(blocknames);
};
function setavailablemetaboxesperlocation(metaboxesperlocation) {
  return {
    type: "set_meta_boxes_per_locations",
    metaboxesperlocation
  };
}
const requestmetaboxupdates = () => async ({ registry, select, dispatch }) => {
  dispatch({
    type: "request_meta_box_updates"
  });
  if (window.tinymce) {
    window.tinymce.triggersave();
  }
  const baseformdata = new window.formdata(
    document.queryselector(".metabox-base-form")
  );
  const postid = baseformdata.get("post_id");
  const posttype = baseformdata.get("post_type");
  const post = registry.select(external_wp_coredata_namespaceobject.store).geteditedentityrecord("posttype", posttype, postid);
  const additionaldata = [
    post.comment_status ? ["comment_status", post.comment_status] : false,
    post.ping_status ? ["ping_status", post.ping_status] : false,
    post.sticky ? ["sticky", post.sticky] : false,
    post.author ? ["post_author", post.author] : false
  ].filter(boolean);
  const activemetaboxlocations = select.getactivemetaboxlocations();
  const formdatatomerge = [
    baseformdata,
    ...activemetaboxlocations.map(
      (location) => new window.formdata(getmetaboxcontainer(location))
    )
  ];
  const formdata = formdatatomerge.reduce((memo, currentformdata) => {
    for (const [key, value] of currentformdata) {
      memo.append(key, value);
    }
    return memo;
  }, new window.formdata());
  additionaldata.foreach(
    ([key, value]) => formdata.append(key, value)
  );
  try {
    await external_wp_apifetch_default()({
      url: window._wpmetaboxurl,
      method: "post",
      body: formdata,
      parse: false
    });
    dispatch.metaboxupdatessuccess();
  } catch {
    dispatch.metaboxupdatesfailure();
  }
};
function metaboxupdatessuccess() {
  return {
    type: "meta_box_updates_success"
  };
}
function metaboxupdatesfailure() {
  return {
    type: "meta_box_updates_failure"
  };
}
const __experimentalsetpreviewdevicetype = (devicetype) => ({ registry }) => {
  external_wp_deprecated_default()(
    "dispatch( 'core/edit-post' ).__experimentalsetpreviewdevicetype",
    {
      since: "6.5",
      version: "6.7",
      hint: "registry.dispatch( editorstore ).setdevicetype"
    }
  );
  registry.dispatch(external_wp_editor_namespaceobject.store).setdevicetype(devicetype);
};
const setisinserteropened = (value) => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).setisinserteropened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setisinserteropened"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).setisinserteropened(value);
};
const setislistviewopened = (isopen) => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).setislistviewopened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setislistviewopened"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).setislistviewopened(isopen);
};
function setiseditingtemplate() {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).setiseditingtemplate", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setrenderingmode"
  });
  return { type: "nothing" };
}
function __unstablecreatetemplate() {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).__unstablecreatetemplate", {
    since: "6.5"
  });
  return { type: "nothing" };
}
let actions_metaboxesinitialized = false;
const initializemetaboxes = () => ({ registry, select, dispatch }) => {
  const iseditorready = registry.select(external_wp_editor_namespaceobject.store).__unstableiseditorready();
  if (!iseditorready) {
    return;
  }
  if (actions_metaboxesinitialized) {
    return;
  }
  const posttype = registry.select(external_wp_editor_namespaceobject.store).getcurrentposttype();
  if (window.postboxes.page !== posttype) {
    window.postboxes.add_postbox_toggles(posttype);
  }
  actions_metaboxesinitialized = true;
  (0,external_wp_hooks_namespaceobject.addaction)(
    "editor.savepost",
    "core/edit-post/save-metaboxes",
    async (post, options) => {
      if (!options.isautosave && select.hasmetaboxes()) {
        await dispatch.requestmetaboxupdates();
      }
    }
  );
  dispatch({
    type: "meta_boxes_initialized"
  });
};
const toggledistractionfree = () => ({ registry }) => {
  external_wp_deprecated_default()("dispatch( 'core/edit-post' ).toggledistractionfree", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').toggledistractionfree"
  });
  registry.dispatch(external_wp_editor_namespaceobject.store).toggledistractionfree();
};
const togglefullscreenmode = () => ({ registry }) => {
  const isfullscreen = registry.select(external_wp_preferences_namespaceobject.store).get("core/edit-post", "fullscreenmode");
  registry.dispatch(external_wp_preferences_namespaceobject.store).toggle("core/edit-post", "fullscreenmode");
  registry.dispatch(external_wp_notices_namespaceobject.store).createinfonotice(
    isfullscreen ? (0,external_wp_i18n_namespaceobject.__)("fullscreen mode deactivated.") : (0,external_wp_i18n_namespaceobject.__)("fullscreen mode activated."),
    {
      id: "core/edit-post/toggle-fullscreen-mode/notice",
      type: "snackbar",
      actions: [
        {
          label: (0,external_wp_i18n_namespaceobject.__)("undo"),
          onclick: () => {
            registry.dispatch(external_wp_preferences_namespaceobject.store).toggle(
              "core/edit-post",
              "fullscreenmode"
            );
          }
        }
      ]
    }
  );
};


;// ./node_modules/@wordpress/edit-post/build-module/store/selectors.js






const { interfacestore: selectors_interfacestore } = unlock(external_wp_editor_namespaceobject.privateapis);
const empty_array = [];
const empty_object = {};
const geteditormode = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => () => select(external_wp_preferences_namespaceobject.store).get("core", "editormode") ?? "visual"
);
const iseditorsidebaropened = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => () => {
    const activegeneralsidebar = select(selectors_interfacestore).getactivecomplementaryarea("core");
    return ["edit-post/document", "edit-post/block"].includes(
      activegeneralsidebar
    );
  }
);
const ispluginsidebaropened = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => () => {
    const activegeneralsidebar = select(selectors_interfacestore).getactivecomplementaryarea("core");
    return !!activegeneralsidebar && !["edit-post/document", "edit-post/block"].includes(
      activegeneralsidebar
    );
  }
);
const getactivegeneralsidebarname = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => () => {
    return select(selectors_interfacestore).getactivecomplementaryarea("core");
  }
);
function convertpanelstooldformat(inactivepanels, openpanels) {
  const panelswithenabledstate = inactivepanels?.reduce(
    (accumulatedpanels, panelname) => ({
      ...accumulatedpanels,
      [panelname]: {
        enabled: false
      }
    }),
    {}
  );
  const panels = openpanels?.reduce((accumulatedpanels, panelname) => {
    const currentpanelstate = accumulatedpanels?.[panelname];
    return {
      ...accumulatedpanels,
      [panelname]: {
        ...currentpanelstate,
        opened: true
      }
    };
  }, panelswithenabledstate ?? {});
  return panels ?? panelswithenabledstate ?? empty_object;
}
const getpreferences = (0,external_wp_data_namespaceobject.createregistryselector)((select) => () => {
  external_wp_deprecated_default()(`select( 'core/edit-post' ).getpreferences`, {
    since: "6.0",
    alternative: `select( 'core/preferences' ).get`
  });
  const corepreferences = ["editormode", "hiddenblocktypes"].reduce(
    (accumulatedprefs, preferencekey) => {
      const value = select(external_wp_preferences_namespaceobject.store).get(
        "core",
        preferencekey
      );
      return {
        ...accumulatedprefs,
        [preferencekey]: value
      };
    },
    {}
  );
  const inactivepanels = select(external_wp_preferences_namespaceobject.store).get(
    "core",
    "inactivepanels"
  );
  const openpanels = select(external_wp_preferences_namespaceobject.store).get("core", "openpanels");
  const panels = convertpanelstooldformat(inactivepanels, openpanels);
  return {
    ...corepreferences,
    panels
  };
});
function getpreference(state, preferencekey, defaultvalue) {
  external_wp_deprecated_default()(`select( 'core/edit-post' ).getpreference`, {
    since: "6.0",
    alternative: `select( 'core/preferences' ).get`
  });
  const preferences = getpreferences(state);
  const value = preferences[preferencekey];
  return value === void 0 ? defaultvalue : value;
}
const gethiddenblocktypes = (0,external_wp_data_namespaceobject.createregistryselector)((select) => () => {
  return select(external_wp_preferences_namespaceobject.store).get("core", "hiddenblocktypes") ?? empty_array;
});
const ispublishsidebaropened = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => () => {
    external_wp_deprecated_default()(`select( 'core/edit-post' ).ispublishsidebaropened`, {
      since: "6.6",
      alternative: `select( 'core/editor' ).ispublishsidebaropened`
    });
    return select(external_wp_editor_namespaceobject.store).ispublishsidebaropened();
  }
);
const iseditorpanelremoved = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, panelname) => {
    external_wp_deprecated_default()(`select( 'core/edit-post' ).iseditorpanelremoved`, {
      since: "6.5",
      alternative: `select( 'core/editor' ).iseditorpanelremoved`
    });
    return select(external_wp_editor_namespaceobject.store).iseditorpanelremoved(panelname);
  }
);
const iseditorpanelenabled = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, panelname) => {
    external_wp_deprecated_default()(`select( 'core/edit-post' ).iseditorpanelenabled`, {
      since: "6.5",
      alternative: `select( 'core/editor' ).iseditorpanelenabled`
    });
    return select(external_wp_editor_namespaceobject.store).iseditorpanelenabled(panelname);
  }
);
const iseditorpanelopened = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, panelname) => {
    external_wp_deprecated_default()(`select( 'core/edit-post' ).iseditorpanelopened`, {
      since: "6.5",
      alternative: `select( 'core/editor' ).iseditorpanelopened`
    });
    return select(external_wp_editor_namespaceobject.store).iseditorpanelopened(panelname);
  }
);
const ismodalactive = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, modalname) => {
    external_wp_deprecated_default()(`select( 'core/edit-post' ).ismodalactive`, {
      since: "6.3",
      alternative: `select( 'core/interface' ).ismodalactive`
    });
    return !!select(selectors_interfacestore).ismodalactive(modalname);
  }
);
const isfeatureactive = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, feature) => {
    return !!select(external_wp_preferences_namespaceobject.store).get("core/edit-post", feature);
  }
);
const ispluginitempinned = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, pluginname) => {
    return select(selectors_interfacestore).isitempinned("core", pluginname);
  }
);
const getactivemetaboxlocations = (0,external_wp_data_namespaceobject.createselector)(
  (state) => {
    return object.keys(state.metaboxes.locations).filter(
      (location) => ismetaboxlocationactive(state, location)
    );
  },
  (state) => [state.metaboxes.locations]
);
const ismetaboxlocationvisible = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => (state, location) => {
    return ismetaboxlocationactive(state, location) && getmetaboxesperlocation(state, location)?.some(({ id }) => {
      return select(external_wp_editor_namespaceobject.store).iseditorpanelenabled(
        `meta-box-${id}`
      );
    });
  }
);
function ismetaboxlocationactive(state, location) {
  const metaboxes = getmetaboxesperlocation(state, location);
  return !!metaboxes && metaboxes.length !== 0;
}
function getmetaboxesperlocation(state, location) {
  return state.metaboxes.locations[location];
}
const getallmetaboxes = (0,external_wp_data_namespaceobject.createselector)(
  (state) => {
    return object.values(state.metaboxes.locations).flat();
  },
  (state) => [state.metaboxes.locations]
);
function hasmetaboxes(state) {
  return getactivemetaboxlocations(state).length > 0;
}
function selectors_issavingmetaboxes(state) {
  return state.metaboxes.issaving;
}
const __experimentalgetpreviewdevicetype = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => () => {
    external_wp_deprecated_default()(
      `select( 'core/edit-site' ).__experimentalgetpreviewdevicetype`,
      {
        since: "6.5",
        version: "6.7",
        alternative: `select( 'core/editor' ).getdevicetype`
      }
    );
    return select(external_wp_editor_namespaceobject.store).getdevicetype();
  }
);
const isinserteropened = (0,external_wp_data_namespaceobject.createregistryselector)((select) => () => {
  external_wp_deprecated_default()(`select( 'core/edit-post' ).isinserteropened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).isinserteropened`
  });
  return select(external_wp_editor_namespaceobject.store).isinserteropened();
});
const __experimentalgetinsertionpoint = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => () => {
    external_wp_deprecated_default()(
      `select( 'core/edit-post' ).__experimentalgetinsertionpoint`,
      {
        since: "6.5",
        version: "6.7"
      }
    );
    return unlock(select(external_wp_editor_namespaceobject.store)).getinserter();
  }
);
const islistviewopened = (0,external_wp_data_namespaceobject.createregistryselector)((select) => () => {
  external_wp_deprecated_default()(`select( 'core/edit-post' ).islistviewopened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).islistviewopened`
  });
  return select(external_wp_editor_namespaceobject.store).islistviewopened();
});
const iseditingtemplate = (0,external_wp_data_namespaceobject.createregistryselector)((select) => () => {
  external_wp_deprecated_default()(`select( 'core/edit-post' ).iseditingtemplate`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).getrenderingmode`
  });
  return select(external_wp_editor_namespaceobject.store).getcurrentposttype() === "wp_template";
});
function aremetaboxesinitialized(state) {
  return state.metaboxes.initialized;
}
const geteditedposttemplate = (0,external_wp_data_namespaceobject.createregistryselector)(
  (select) => () => {
    const { id: postid, type: posttype } = select(external_wp_editor_namespaceobject.store).getcurrentpost();
    const templateid = unlock(select(external_wp_coredata_namespaceobject.store)).gettemplateid(
      posttype,
      postid
    );
    if (!templateid) {
      return void 0;
    }
    return select(external_wp_coredata_namespaceobject.store).geteditedentityrecord(
      "posttype",
      "wp_template",
      templateid
    );
  }
);


;// ./node_modules/@wordpress/edit-post/build-module/store/index.js





const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  reducer: reducer_default,
  actions: actions_namespaceobject,
  selectors: selectors_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);


;// ./node_modules/@wordpress/edit-post/build-module/components/keyboard-shortcuts/index.js





function keyboardshortcuts() {
  const { togglefullscreenmode } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const { registershortcut } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_keyboardshortcuts_namespaceobject.store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    registershortcut({
      name: "core/edit-post/toggle-fullscreen",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("enable or disable fullscreen mode."),
      keycombination: {
        modifier: "secondary",
        character: "f"
      }
    });
  }, []);
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)("core/edit-post/toggle-fullscreen", () => {
    togglefullscreenmode();
  });
  return null;
}
var keyboard_shortcuts_default = keyboardshortcuts;


;// ./node_modules/@wordpress/edit-post/build-module/components/init-pattern-modal/index.js






function initpatternmodal() {
  const { editpost } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_editor_namespaceobject.store);
  const [synctype, setsynctype] = (0,external_wp_element_namespaceobject.usestate)(void 0);
  const [title, settitle] = (0,external_wp_element_namespaceobject.usestate)("");
  const { posttype, isnewpost } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { geteditedpostattribute, iscleannewpost } = select(external_wp_editor_namespaceobject.store);
    return {
      posttype: geteditedpostattribute("type"),
      isnewpost: iscleannewpost()
    };
  }, []);
  const [ismodalopen, setismodalopen] = (0,external_wp_element_namespaceobject.usestate)(
    () => isnewpost && posttype === "wp_block"
  );
  if (posttype !== "wp_block" || !isnewpost) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_reactjsxruntime_namespaceobject.fragment, { children: ismodalopen && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.modal,
    {
      title: (0,external_wp_i18n_namespaceobject.__)("create pattern"),
      onrequestclose: () => {
        setismodalopen(false);
      },
      overlayclassname: "reusable-blocks-menu-items__convert-modal",
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "form",
        {
          onsubmit: (event) => {
            event.preventdefault();
            setismodalopen(false);
            editpost({
              title,
              meta: {
                wp_pattern_sync_status: synctype
              }
            });
          },
          children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: "5", children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.textcontrol,
              {
                label: (0,external_wp_i18n_namespaceobject.__)("name"),
                value: title,
                onchange: settitle,
                placeholder: (0,external_wp_i18n_namespaceobject.__)("my pattern"),
                classname: "patterns-create-modal__name-input",
                __nexthasnomarginbottom: true,
                __next40pxdefaultsize: true
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.togglecontrol,
              {
                __nexthasnomarginbottom: true,
                label: (0,external_wp_i18n_namespaceobject._x)("synced", "pattern (singular)"),
                help: (0,external_wp_i18n_namespaceobject.__)(
                  "sync this pattern across multiple locations."
                ),
                checked: !synctype,
                onchange: () => {
                  setsynctype(
                    !synctype ? "unsynced" : void 0
                  );
                }
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentalhstack, { justify: "right", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.button,
              {
                __next40pxdefaultsize: true,
                variant: "primary",
                type: "submit",
                disabled: !title,
                accessiblewhendisabled: true,
                children: (0,external_wp_i18n_namespaceobject.__)("create")
              }
            ) })
          ] })
        }
      )
    }
  ) });
}


;// ./node_modules/@wordpress/edit-post/build-module/components/browser-url/index.js




function getpostediturl(postid) {
  return (0,external_wp_url_namespaceobject.addqueryargs)("post.php", { post: postid, action: "edit" });
}
function browserurl() {
  const [historyid, sethistoryid] = (0,external_wp_element_namespaceobject.usestate)(null);
  const { postid, poststatus } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { getcurrentpost } = select(external_wp_editor_namespaceobject.store);
    const post = getcurrentpost();
    let { id, status, type } = post;
    const istemplate = ["wp_template", "wp_template_part"].includes(
      type
    );
    if (istemplate) {
      id = post.wp_id;
    }
    return {
      postid: id,
      poststatus: status
    };
  }, []);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (postid && postid !== historyid && poststatus !== "auto-draft") {
      window.history.replacestate(
        { id: postid },
        "post " + postid,
        getpostediturl(postid)
      );
      sethistoryid(postid);
    }
  }, [postid, poststatus, historyid]);
  return null;
}


;// ./node_modules/@wordpress/edit-post/build-module/components/meta-boxes/meta-boxes-area/index.js






function metaboxesarea({ location }) {
  const container = (0,external_wp_element_namespaceobject.useref)(null);
  const formref = (0,external_wp_element_namespaceobject.useref)(null);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    formref.current = document.queryselector(
      ".metabox-location-" + location
    );
    if (formref.current) {
      container.current.appendchild(formref.current);
    }
    return () => {
      if (formref.current) {
        document.queryselector("#metaboxes").appendchild(formref.current);
      }
    };
  }, [location]);
  const issaving = (0,external_wp_data_namespaceobject.useselect)((select) => {
    return select(store).issavingmetaboxes();
  }, []);
  const classes = dist_clsx("edit-post-meta-boxes-area", `is-${location}`, {
    "is-loading": issaving
  });
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: classes, children: [
    issaving && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.spinner, {}),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      "div",
      {
        classname: "edit-post-meta-boxes-area__container",
        ref: container
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "edit-post-meta-boxes-area__clear" })
  ] });
}
var meta_boxes_area_default = metaboxesarea;


;// ./node_modules/@wordpress/edit-post/build-module/components/meta-boxes/meta-box-visibility.js



function metaboxvisibility({ id }) {
  const isvisible = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      return select(external_wp_editor_namespaceobject.store).iseditorpanelenabled(
        `meta-box-${id}`
      );
    },
    [id]
  );
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const element = document.getelementbyid(id);
    if (!element) {
      return;
    }
    if (isvisible) {
      element.classlist.remove("is-hidden");
    } else {
      element.classlist.add("is-hidden");
    }
  }, [id, isvisible]);
  return null;
}


;// ./node_modules/@wordpress/edit-post/build-module/components/meta-boxes/index.js





function metaboxes({ location }) {
  const metaboxes = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store).getmetaboxesperlocation(location),
    [location]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    (metaboxes ?? []).map(({ id }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(metaboxvisibility, { id }, id)),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(meta_boxes_area_default, { location })
  ] });
}


;// external ["wp","keycodes"]
const external_wp_keycodes_namespaceobject = window["wp"]["keycodes"];
;// ./node_modules/@wordpress/edit-post/build-module/components/more-menu/manage-patterns-menu-item.js






function managepatternsmenuitem() {
  const url = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { canuser } = select(external_wp_coredata_namespaceobject.store);
    const defaulturl = (0,external_wp_url_namespaceobject.addqueryargs)("edit.php", {
      post_type: "wp_block"
    });
    const patternsurl = (0,external_wp_url_namespaceobject.addqueryargs)("site-editor.php", {
      p: "/pattern"
    });
    return canuser("create", {
      kind: "posttype",
      name: "wp_template"
    }) ? patternsurl : defaulturl;
  }, []);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menuitem, { role: "menuitem", href: url, children: (0,external_wp_i18n_namespaceobject.__)("manage patterns") });
}
var manage_patterns_menu_item_default = managepatternsmenuitem;


;// ./node_modules/@wordpress/edit-post/build-module/components/more-menu/welcome-guide-menu-item.js





function welcomeguidemenuitem() {
  const iseditingtemplate = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(external_wp_editor_namespaceobject.store).getcurrentposttype() === "wp_template",
    []
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_preferences_namespaceobject.preferencetogglemenuitem,
    {
      scope: "core/edit-post",
      name: iseditingtemplate ? "welcomeguidetemplate" : "welcomeguide",
      label: (0,external_wp_i18n_namespaceobject.__)("welcome guide")
    }
  );
}


;// ./node_modules/@wordpress/edit-post/build-module/components/preferences-modal/enable-custom-fields.js









const { preferencebaseoption } = unlock(external_wp_preferences_namespaceobject.privateapis);
function submitcustomfieldsform() {
  const customfieldsform = document.getelementbyid(
    "toggle-custom-fields-form"
  );
  customfieldsform.queryselector('[name="_wp_http_referer"]').setattribute("value", (0,external_wp_url_namespaceobject.getpathandquerystring)(window.location.href));
  customfieldsform.submit();
}
function customfieldsconfirmation({ willenable }) {
  const [isreloading, setisreloading] = (0,external_wp_element_namespaceobject.usestate)(false);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-post-preferences-modal__custom-fields-confirmation-message", children: (0,external_wp_i18n_namespaceobject.__)(
      "a page reload is required for this change. make sure your content is saved before reloading."
    ) }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.button,
      {
        __next40pxdefaultsize: true,
        variant: "secondary",
        isbusy: isreloading,
        accessiblewhendisabled: true,
        disabled: isreloading,
        onclick: () => {
          setisreloading(true);
          submitcustomfieldsform();
        },
        children: willenable ? (0,external_wp_i18n_namespaceobject.__)("show & reload page") : (0,external_wp_i18n_namespaceobject.__)("hide & reload page")
      }
    )
  ] });
}
function enablecustomfieldsoption({ label }) {
  const arecustomfieldsenabled = (0,external_wp_data_namespaceobject.useselect)((select) => {
    return !!select(external_wp_editor_namespaceobject.store).geteditorsettings().enablecustomfields;
  }, []);
  const [ischecked, setischecked] = (0,external_wp_element_namespaceobject.usestate)(arecustomfieldsenabled);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    preferencebaseoption,
    {
      label,
      ischecked,
      onchange: setischecked,
      children: ischecked !== arecustomfieldsenabled && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(customfieldsconfirmation, { willenable: ischecked })
    }
  );
}


;// ./node_modules/@wordpress/edit-post/build-module/components/preferences-modal/enable-panel.js





const { preferencebaseoption: enable_panel_preferencebaseoption } = unlock(external_wp_preferences_namespaceobject.privateapis);
function enablepaneloption(props) {
  const { toggleeditorpanelenabled } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_editor_namespaceobject.store);
  const { ischecked, isremoved } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { iseditorpanelenabled, iseditorpanelremoved } = select(external_wp_editor_namespaceobject.store);
      return {
        ischecked: iseditorpanelenabled(props.panelname),
        isremoved: iseditorpanelremoved(props.panelname)
      };
    },
    [props.panelname]
  );
  if (isremoved) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    enable_panel_preferencebaseoption,
    {
      ischecked,
      onchange: () => toggleeditorpanelenabled(props.panelname),
      ...props
    }
  );
}


;// ./node_modules/@wordpress/edit-post/build-module/components/preferences-modal/meta-boxes-section.js









const { preferencesmodalsection } = unlock(external_wp_preferences_namespaceobject.privateapis);
function metaboxessection({
  arecustomfieldsregistered,
  metaboxes,
  ...sectionprops
}) {
  const thirdpartymetaboxes = metaboxes.filter(
    ({ id }) => id !== "postcustom"
  );
  if (!arecustomfieldsregistered && thirdpartymetaboxes.length === 0) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(preferencesmodalsection, { ...sectionprops, children: [
    arecustomfieldsregistered && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(enablecustomfieldsoption, { label: (0,external_wp_i18n_namespaceobject.__)("custom fields") }),
    thirdpartymetaboxes.map(({ id, title }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      enablepaneloption,
      {
        label: title,
        panelname: `meta-box-${id}`
      },
      id
    ))
  ] });
}
var meta_boxes_section_default = (0,external_wp_data_namespaceobject.withselect)((select) => {
  const { geteditorsettings } = select(external_wp_editor_namespaceobject.store);
  const { getallmetaboxes } = select(store);
  return {
    // this setting should not live in the block editor's store.
    arecustomfieldsregistered: geteditorsettings().enablecustomfields !== void 0,
    metaboxes: getallmetaboxes()
  };
})(metaboxessection);


;// ./node_modules/@wordpress/edit-post/build-module/components/preferences-modal/index.js






const { preferencetogglecontrol } = unlock(external_wp_preferences_namespaceobject.privateapis);
const { preferencesmodal } = unlock(external_wp_editor_namespaceobject.privateapis);
function editpostpreferencesmodal() {
  const extrasections = {
    general: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(meta_boxes_section_default, { title: (0,external_wp_i18n_namespaceobject.__)("advanced") }),
    appearance: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      preferencetogglecontrol,
      {
        scope: "core/edit-post",
        featurename: "themestyles",
        help: (0,external_wp_i18n_namespaceobject.__)("make the editor look like your theme."),
        label: (0,external_wp_i18n_namespaceobject.__)("use theme styles")
      }
    )
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(preferencesmodal, { extrasections });
}


;// ./node_modules/@wordpress/edit-post/build-module/components/more-menu/index.js










const { toolsmoremenugroup, viewmoremenugroup } = unlock(external_wp_editor_namespaceobject.privateapis);
const moremenu = () => {
  const islargeviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("large");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    islargeviewport && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(viewmoremenugroup, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_preferences_namespaceobject.preferencetogglemenuitem,
      {
        scope: "core/edit-post",
        name: "fullscreenmode",
        label: (0,external_wp_i18n_namespaceobject.__)("fullscreen mode"),
        info: (0,external_wp_i18n_namespaceobject.__)("show and hide the admin user interface"),
        messageactivated: (0,external_wp_i18n_namespaceobject.__)("fullscreen mode activated."),
        messagedeactivated: (0,external_wp_i18n_namespaceobject.__)(
          "fullscreen mode deactivated."
        ),
        shortcut: external_wp_keycodes_namespaceobject.displayshortcut.secondary("f")
      }
    ) }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(toolsmoremenugroup, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(manage_patterns_menu_item_default, {}),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(welcomeguidemenuitem, {})
    ] }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(editpostpreferencesmodal, {})
  ] });
};
var more_menu_default = moremenu;


;// ./node_modules/@wordpress/edit-post/build-module/components/welcome-guide/image.js

function welcomeguideimage({ nonanimatedsrc, animatedsrc }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("picture", { classname: "edit-post-welcome-guide__image", children: [
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


;// ./node_modules/@wordpress/edit-post/build-module/components/welcome-guide/default.js







function welcomeguidedefault() {
  const { togglefeature } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.guide,
    {
      classname: "edit-post-welcome-guide",
      contentlabel: (0,external_wp_i18n_namespaceobject.__)("welcome to the editor"),
      finishbuttontext: (0,external_wp_i18n_namespaceobject.__)("get started"),
      onfinish: () => togglefeature("welcomeguide"),
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
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-post-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("welcome to the editor") }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-post-welcome-guide__text", children: (0,external_wp_i18n_namespaceobject.__)(
              "in the wordpress editor, each paragraph, image, or video is presented as a distinct \u201cblock\u201d of content."
            ) })
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
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-post-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("customize each block") }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-post-welcome-guide__text", children: (0,external_wp_i18n_namespaceobject.__)(
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
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-post-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("explore all blocks") }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-post-welcome-guide__text", children: (0,external_wp_element_namespaceobject.createinterpolateelement)(
              (0,external_wp_i18n_namespaceobject.__)(
                "all of the blocks available to you live in the block library. you\u2019ll find it wherever you see the <insertericonimage /> icon."
              ),
              {
                insertericonimage: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                  "img",
                  {
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
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-post-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("learn more") }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-post-welcome-guide__text", children: (0,external_wp_element_namespaceobject.createinterpolateelement)(
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


;// ./node_modules/@wordpress/edit-post/build-module/components/welcome-guide/template.js






function welcomeguidetemplate() {
  const { togglefeature } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.guide,
    {
      classname: "edit-template-welcome-guide",
      contentlabel: (0,external_wp_i18n_namespaceobject.__)("welcome to the template editor"),
      finishbuttontext: (0,external_wp_i18n_namespaceobject.__)("get started"),
      onfinish: () => togglefeature("welcomeguidetemplate"),
      pages: [
        {
          image: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            welcomeguideimage,
            {
              nonanimatedsrc: "https://s.w.org/images/block-editor/welcome-template-editor.svg",
              animatedsrc: "https://s.w.org/images/block-editor/welcome-template-editor.gif"
            }
          ),
          content: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "edit-post-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("welcome to the template editor") }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "edit-post-welcome-guide__text", children: (0,external_wp_i18n_namespaceobject.__)(
              "templates help define the layout of the site. you can customize all aspects of your posts and pages using blocks and patterns in this editor."
            ) })
          ] })
        }
      ]
    }
  );
}


;// ./node_modules/@wordpress/edit-post/build-module/components/welcome-guide/index.js





function welcomeguide({ posttype }) {
  const { isactive, iseditingtemplate } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { isfeatureactive } = select(store);
      const _iseditingtemplate = posttype === "wp_template";
      const feature = _iseditingtemplate ? "welcomeguidetemplate" : "welcomeguide";
      return {
        isactive: isfeatureactive(feature),
        iseditingtemplate: _iseditingtemplate
      };
    },
    [posttype]
  );
  if (!isactive) {
    return null;
  }
  return iseditingtemplate ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(welcomeguidetemplate, {}) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(welcomeguidedefault, {});
}


;// ./node_modules/@wordpress/icons/build-module/library/fullscreen.js


var fullscreen_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m6 4a2 2 0 0 0-2 2v3h1.5v6a.5.5 0 0 1 .5-.5h3v4h6zm3 14.5h6a.5.5 0 0 1-.5-.5v-3h4v3a2 2 0 0 0 2 2h3v-1.5zm6 1.5v-1.5h3a.5.5 0 0 0 .5-.5v-3h20v3a2 2 0 0 1-2 2h-3zm3-16a2 2 0 0 1 2 2v3h-1.5v6a.5.5 0 0 0-.5-.5h-3v4h3z" }) });


;// ./node_modules/@wordpress/edit-post/build-module/commands/use-commands.js






function usecommands() {
  const { isfullscreen } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { get } = select(external_wp_preferences_namespaceobject.store);
    return {
      isfullscreen: get("core/edit-post", "fullscreenmode")
    };
  }, []);
  const { toggle } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_preferences_namespaceobject.store);
  const { createinfonotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  (0,external_wp_commands_namespaceobject.usecommand)({
    name: "core/toggle-fullscreen-mode",
    label: isfullscreen ? (0,external_wp_i18n_namespaceobject.__)("exit fullscreen") : (0,external_wp_i18n_namespaceobject.__)("enter fullscreen"),
    icon: fullscreen_default,
    callback: ({ close }) => {
      toggle("core/edit-post", "fullscreenmode");
      close();
      createinfonotice(
        isfullscreen ? (0,external_wp_i18n_namespaceobject.__)("fullscreen off.") : (0,external_wp_i18n_namespaceobject.__)("fullscreen on."),
        {
          id: "core/edit-post/toggle-fullscreen-mode/notice",
          type: "snackbar",
          actions: [
            {
              label: (0,external_wp_i18n_namespaceobject.__)("undo"),
              onclick: () => {
                toggle("core/edit-post", "fullscreenmode");
              }
            }
          ]
        }
      );
    }
  });
}


;// ./node_modules/@wordpress/edit-post/build-module/components/layout/use-padding-appender.js




const css = ':root :where(.editor-styles-wrapper)::after {content: ""; display: block; height: 40vh;}';
function usepaddingappender(enabled) {
  const registry = (0,external_wp_data_namespaceobject.useregistry)();
  const effect = (0,external_wp_compose_namespaceobject.userefeffect)(
    (node) => {
      function onmousedown(event) {
        if (event.target !== node && // tests for the parent element because in the iframed editor if the click is
        // below the padding the target will be the parent element (html) and should
        // still be treated as intent to append.
        event.target !== node.parentelement) {
          return;
        }
        const lastchild = node.lastelementchild;
        if (!lastchild) {
          return;
        }
        const lastchildrect = lastchild.getboundingclientrect();
        if (event.clienty < lastchildrect.bottom) {
          return;
        }
        event.preventdefault();
        const blockorder = registry.select(external_wp_blockeditor_namespaceobject.store).getblockorder("");
        const lastblockclientid = blockorder[blockorder.length - 1];
        const lastblock = registry.select(external_wp_blockeditor_namespaceobject.store).getblock(lastblockclientid);
        const { selectblock, insertdefaultblock } = registry.dispatch(external_wp_blockeditor_namespaceobject.store);
        if (lastblock && (0,external_wp_blocks_namespaceobject.isunmodifieddefaultblock)(lastblock)) {
          selectblock(lastblockclientid);
        } else {
          insertdefaultblock();
        }
      }
      const { ownerdocument } = node;
      ownerdocument.addeventlistener("pointerdown", onmousedown);
      return () => {
        ownerdocument.removeeventlistener("pointerdown", onmousedown);
      };
    },
    [registry]
  );
  return enabled ? [effect, css] : [];
}


;// ./node_modules/@wordpress/edit-post/build-module/components/layout/use-should-iframe.js





const isgutenbergplugin =  false ? 0 : false;
function useshouldiframe() {
  return (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { geteditorsettings, getcurrentposttype, getdevicetype } = select(external_wp_editor_namespaceobject.store);
    return (
      // if the theme is block based and the gutenberg plugin is active,
      // we always use the iframe for consistency across the post and site
      // editor.
      isgutenbergplugin && geteditorsettings().__unstableisblockbasedtheme || // we also still want to iframe all the special
      // editor features and modes such as device previews, zoom out, and
      // template/pattern editing.
      getdevicetype() !== "desktop" || ["wp_template", "wp_block"].includes(getcurrentposttype()) || unlock(select(external_wp_blockeditor_namespaceobject.store)).iszoomout() || // finally, still iframe the editor if all blocks are v3 (which means
      // they are marked as iframe-compatible).
      select(external_wp_blocks_namespaceobject.store).getblocktypes().every((type) => type.apiversion >= 3)
    );
  }, []);
}


;// ./node_modules/@wordpress/edit-post/build-module/hooks/use-navigate-to-entity-record.js



function usenavigatetoentityrecord(initialpostid, initialposttype, defaultrenderingmode) {
  const [posthistory, dispatch] = (0,external_wp_element_namespaceobject.usereducer)(
    (historystate, { type, post: post2, previousrenderingmode: previousrenderingmode2 }) => {
      if (type === "push") {
        return [...historystate, { post: post2, previousrenderingmode: previousrenderingmode2 }];
      }
      if (type === "pop") {
        if (historystate.length > 1) {
          return historystate.slice(0, -1);
        }
      }
      return historystate;
    },
    [
      {
        post: { postid: initialpostid, posttype: initialposttype }
      }
    ]
  );
  const { post, previousrenderingmode } = posthistory[posthistory.length - 1];
  const { getrenderingmode } = (0,external_wp_data_namespaceobject.useselect)(external_wp_editor_namespaceobject.store);
  const { setrenderingmode } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_editor_namespaceobject.store);
  const onnavigatetoentityrecord = (0,external_wp_element_namespaceobject.usecallback)(
    (params) => {
      dispatch({
        type: "push",
        post: { postid: params.postid, posttype: params.posttype },
        // save the current rendering mode so we can restore it when navigating back.
        previousrenderingmode: getrenderingmode()
      });
      setrenderingmode(defaultrenderingmode);
    },
    [getrenderingmode, setrenderingmode, defaultrenderingmode]
  );
  const onnavigatetopreviousentityrecord = (0,external_wp_element_namespaceobject.usecallback)(() => {
    dispatch({ type: "pop" });
    if (previousrenderingmode) {
      setrenderingmode(previousrenderingmode);
    }
  }, [setrenderingmode, previousrenderingmode]);
  return {
    currentpost: post,
    onnavigatetoentityrecord,
    onnavigatetopreviousentityrecord: posthistory.length > 1 ? onnavigatetopreviousentityrecord : void 0
  };
}


;// ./node_modules/@wordpress/edit-post/build-module/components/meta-boxes/use-meta-box-initialization.js




const usemetaboxinitialization = (enabled) => {
  const isenabledandeditorready = (0,external_wp_data_namespaceobject.useselect)(
    (select) => enabled && select(external_wp_editor_namespaceobject.store).__unstableiseditorready(),
    [enabled]
  );
  const { initializemetaboxes } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (isenabledandeditorready) {
      initializemetaboxes();
    }
  }, [isenabledandeditorready, initializemetaboxes]);
};


;// ./node_modules/@wordpress/edit-post/build-module/components/layout/index.js


































const { getlayoutstyles } = unlock(external_wp_blockeditor_namespaceobject.privateapis);
const { usecommandcontext } = unlock(external_wp_commands_namespaceobject.privateapis);
const { editor, fullscreenmode } = unlock(external_wp_editor_namespaceobject.privateapis);
const { blockkeyboardshortcuts } = unlock(external_wp_blocklibrary_namespaceobject.privateapis);
const design_post_types = [
  "wp_template",
  "wp_template_part",
  "wp_block",
  "wp_navigation"
];
function useeditorstyles(...additionalstyles) {
  const { hasthemestylesupport, editorsettings } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    return {
      hasthemestylesupport: select(store).isfeatureactive("themestyles"),
      editorsettings: select(external_wp_editor_namespaceobject.store).geteditorsettings()
    };
  }, []);
  const addedstyles = additionalstyles.join("\n");
  return (0,external_wp_element_namespaceobject.usememo)(() => {
    const presetstyles = editorsettings.styles?.filter(
      (style) => style.__unstabletype && style.__unstabletype !== "theme"
    ) ?? [];
    const defaulteditorstyles = [
      ...editorsettings?.defaulteditorstyles ?? [],
      ...presetstyles
    ];
    const hasthemestyles = hasthemestylesupport && presetstyles.length !== (editorsettings.styles?.length ?? 0);
    if (!editorsettings.disablelayoutstyles && !hasthemestyles) {
      defaulteditorstyles.push({
        css: getlayoutstyles({
          style: {},
          selector: "body",
          hasblockgapsupport: false,
          hasfallbackgapsupport: true,
          fallbackgapvalue: "0.5em"
        })
      });
    }
    const basestyles = hasthemestyles ? editorsettings.styles ?? [] : defaulteditorstyles;
    if (addedstyles) {
      return [...basestyles, { css: addedstyles }];
    }
    return basestyles;
  }, [
    editorsettings.defaulteditorstyles,
    editorsettings.disablelayoutstyles,
    editorsettings.styles,
    hasthemestylesupport,
    addedstyles
  ]);
}
function metaboxesmain({ islegacy }) {
  const [isopen, openheight, hasanyvisible] = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { get } = select(external_wp_preferences_namespaceobject.store);
    const { ismetaboxlocationvisible } = select(store);
    return [
      !!get("core/edit-post", "metaboxesmainisopen"),
      get("core/edit-post", "metaboxesmainopenheight"),
      ismetaboxlocationvisible("normal") || ismetaboxlocationvisible("advanced") || ismetaboxlocationvisible("side")
    ];
  }, []);
  const { set: setpreference } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_preferences_namespaceobject.store);
  const metaboxesmainref = (0,external_wp_element_namespaceobject.useref)();
  const isshort = (0,external_wp_compose_namespaceobject.usemediaquery)("(max-height: 549px)");
  const [{ min, max }, setheightconstraints] = (0,external_wp_element_namespaceobject.usestate)(() => ({}));
  const effectsizeconstraints = (0,external_wp_compose_namespaceobject.userefeffect)((node) => {
    const container = node.closest(
      ".interface-interface-skeleton__content"
    );
    if (!container) {
      return;
    }
    const noticelists = container.queryselectorall(
      ":scope > .components-notice-list"
    );
    const resizehandle = container.queryselector(
      ".edit-post-meta-boxes-main__presenter"
    );
    const deriveconstraints = () => {
      const fullheight = container.offsetheight;
      let nextmax = fullheight;
      for (const element of noticelists) {
        nextmax -= element.offsetheight;
      }
      const nextmin = resizehandle.offsetheight;
      setheightconstraints({ min: nextmin, max: nextmax });
    };
    const observer = new window.resizeobserver(deriveconstraints);
    observer.observe(container);
    for (const element of noticelists) {
      observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);
  const resizedataref = (0,external_wp_element_namespaceobject.useref)({});
  const separatorref = (0,external_wp_element_namespaceobject.useref)();
  const separatorhelpid = (0,external_wp_element_namespaceobject.useid)();
  const applyheight = (candidateheight = "auto", ispersistent, isinstant) => {
    if (candidateheight === "auto") {
      ispersistent = false;
    } else {
      candidateheight = math.min(max, math.max(min, candidateheight));
    }
    if (ispersistent) {
      setpreference(
        "core/edit-post",
        "metaboxesmainopenheight",
        candidateheight
      );
    } else if (!isshort) {
      separatorref.current.ariavaluenow = getariavaluenow(candidateheight);
    }
    if (isinstant) {
      metaboxesmainref.current.updatesize({
        height: candidateheight,
        // oddly, when the event that triggered this was not from the mouse (e.g. keydown),
        // if `width` is left unspecified a subsequent drag gesture applies a fixed
        // width and the pane fails to widen/narrow with parent width changes from
        // sidebars opening/closing or window resizes.
        width: "auto"
      });
    }
  };
  const getrendervalues = (0,external_wp_compose_namespaceobject.useevent)(() => ({ isopen, openheight, min }));
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const fresh = getrendervalues();
    if (fresh.min !== void 0 && metaboxesmainref.current) {
      const usedopenheight = isshort ? "auto" : fresh.openheight;
      const usedheight = fresh.isopen ? usedopenheight : fresh.min;
      applyheight(usedheight, false, true);
    }
  }, [isshort]);
  if (!hasanyvisible) {
    return;
  }
  const contents = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    "div",
    {
      classname: "edit-post-layout__metaboxes edit-post-meta-boxes-main__liner",
      hidden: !islegacy && !isopen,
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(metaboxes, { location: "normal" }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(metaboxes, { location: "advanced" })
      ]
    }
  );
  if (islegacy) {
    return contents;
  }
  const isautoheight = openheight === void 0;
  const getariavaluenow = (height) => math.round((height - min) / (max - min) * 100);
  const usedariavaluenow = max === void 0 || isautoheight ? 50 : getariavaluenow(openheight);
  const persistisopen = (to = !isopen) => setpreference("core/edit-post", "metaboxesmainisopen", to);
  const onseparatorkeydown = (event) => {
    const delta = { arrowup: 20, arrowdown: -20 }[event.key];
    if (delta) {
      const pane = metaboxesmainref.current.resizable;
      const fromheight = isautoheight ? pane.offsetheight : openheight;
      const nextheight = delta + fromheight;
      applyheight(nextheight, true, true);
      persistisopen(nextheight > min);
      event.preventdefault();
    }
  };
  const panelabel = (0,external_wp_i18n_namespaceobject.__)("meta boxes");
  const toggle = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    "button",
    {
      "aria-expanded": isopen,
      onclick: ({ detail }) => {
        const { istoggleinferred } = resizedataref.current;
        if (isshort || !detail || istoggleinferred) {
          persistisopen();
          const usedopenheight = isshort ? "auto" : openheight;
          const usedheight = isopen ? min : usedopenheight;
          applyheight(usedheight, false, true);
        }
      },
      ...isshort && {
        onmousedown: (event) => event.stoppropagation(),
        ontouchstart: (event) => event.stoppropagation()
      },
      children: [
        panelabel,
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.icon, { icon: isopen ? chevron_up_default : chevron_down_default })
      ]
    }
  );
  const separator = !isshort && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.tooltip, { text: (0,external_wp_i18n_namespaceobject.__)("drag to resize"), children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      "button",
      {
        ref: separatorref,
        role: "separator",
        "aria-valuenow": usedariavaluenow,
        "aria-label": (0,external_wp_i18n_namespaceobject.__)("drag to resize"),
        "aria-describedby": separatorhelpid,
        onkeydown: onseparatorkeydown
      }
    ) }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.visuallyhidden, { id: separatorhelpid, children: (0,external_wp_i18n_namespaceobject.__)(
      "use up and down arrow keys to resize the meta box panel."
    ) })
  ] });
  const paneprops = (
    /** @type {parameters<typeof resizablebox>[0]} */
    {
      as: navigable_region_default,
      ref: metaboxesmainref,
      classname: "edit-post-meta-boxes-main",
      defaultsize: { height: isopen ? openheight : 0 },
      minheight: min,
      maxheight: max,
      enable: { top: true },
      handleclasses: { top: "edit-post-meta-boxes-main__presenter" },
      handlecomponent: {
        top: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
          toggle,
          separator
        ] })
      },
      // avoids hiccups while dragging over objects like iframes and ensures that
      // the event to end the drag is captured by the target (resize handle)
      // whether or not it’s under the pointer.
      onpointerdown: ({ pointerid, target }) => {
        if (separatorref.current?.parentelement.contains(target)) {
          target.setpointercapture(pointerid);
        }
      },
      onresizestart: ({ timestamp }, direction, elementref) => {
        if (isautoheight) {
          applyheight(elementref.offsetheight, false, true);
        }
        elementref.classlist.add("is-resizing");
        resizedataref.current = { timestamp, maxdelta: 0 };
      },
      onresize: (event, direction, elementref, delta) => {
        const { maxdelta } = resizedataref.current;
        const newdelta = math.abs(delta.height);
        resizedataref.current.maxdelta = math.max(maxdelta, newdelta);
        applyheight(metaboxesmainref.current.state.height);
      },
      onresizestop: (event, direction, elementref) => {
        elementref.classlist.remove("is-resizing");
        const duration = event.timestamp - resizedataref.current.timestamp;
        const wasseparator = event.target === separatorref.current;
        const { maxdelta } = resizedataref.current;
        const istoggleinferred = maxdelta < 1 || duration < 144 && maxdelta < 5;
        if (isshort || !wasseparator && istoggleinferred) {
          resizedataref.current.istoggleinferred = true;
        } else {
          const { height } = metaboxesmainref.current.state;
          const nextisopen = height > min;
          persistisopen(nextisopen);
          if (nextisopen) {
            applyheight(height, true);
          }
        }
      }
    }
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.resizablebox, { "aria-label": panelabel, ...paneprops, children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("meta", { ref: effectsizeconstraints }),
    contents
  ] });
}
function layout({
  postid: initialpostid,
  posttype: initialposttype,
  settings,
  initialedits
}) {
  usecommands();
  const shouldiframe = useshouldiframe();
  const { createerrornotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  const {
    currentpost: { postid: currentpostid, posttype: currentposttype },
    onnavigatetoentityrecord,
    onnavigatetopreviousentityrecord
  } = usenavigatetoentityrecord(
    initialpostid,
    initialposttype,
    "post-only"
  );
  const iseditingtemplate = currentposttype === "wp_template";
  const {
    mode,
    isfullscreenactive,
    hasresolvedmode,
    hasactivemetaboxes,
    hasblockselected,
    showiconlabels,
    isdistractionfree,
    showmetaboxes,
    iswelcomeguidevisible,
    templateid,
    enablepaddingappender,
    isdevicepreview
  } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { get } = select(external_wp_preferences_namespaceobject.store);
      const { isfeatureactive, hasmetaboxes } = select(store);
      const { canuser, getposttype, gettemplateid } = unlock(
        select(external_wp_coredata_namespaceobject.store)
      );
      const supportstemplatemode = settings.supportstemplatemode;
      const isviewable = getposttype(currentposttype)?.viewable ?? false;
      const canviewtemplate = canuser("read", {
        kind: "posttype",
        name: "wp_template"
      });
      const { getblockselectionstart, iszoomout } = unlock(
        select(external_wp_blockeditor_namespaceobject.store)
      );
      const {
        geteditormode,
        getrenderingmode,
        getdefaultrenderingmode,
        getdevicetype
      } = unlock(select(external_wp_editor_namespaceobject.store));
      const isrenderingpostonly = getrenderingmode() === "post-only";
      const isnotdesignposttype = !design_post_types.includes(currentposttype);
      const isdirectlyeditingpattern = currentposttype === "wp_block" && !onnavigatetopreviousentityrecord;
      const _templateid = gettemplateid(currentposttype, currentpostid);
      const defaultmode = getdefaultrenderingmode(currentposttype);
      return {
        mode: geteditormode(),
        isfullscreenactive: isfeatureactive("fullscreenmode"),
        hasactivemetaboxes: hasmetaboxes(),
        hasresolvedmode: defaultmode === "template-locked" ? !!_templateid : defaultmode !== void 0,
        hasblockselected: !!getblockselectionstart(),
        showiconlabels: get("core", "showiconlabels"),
        isdistractionfree: get("core", "distractionfree"),
        showmetaboxes: isnotdesignposttype && !iszoomout() || isdirectlyeditingpattern,
        iswelcomeguidevisible: isfeatureactive("welcomeguide"),
        templateid: supportstemplatemode && isviewable && canviewtemplate && !iseditingtemplate ? _templateid : null,
        enablepaddingappender: !iszoomout() && isrenderingpostonly && isnotdesignposttype,
        isdevicepreview: getdevicetype() !== "desktop"
      };
    },
    [
      currentposttype,
      currentpostid,
      iseditingtemplate,
      settings.supportstemplatemode,
      onnavigatetopreviousentityrecord
    ]
  );
  usemetaboxinitialization(hasactivemetaboxes && hasresolvedmode);
  const [paddingappenderref, paddingstyle] = usepaddingappender(
    enablepaddingappender
  );
  const commandcontext = hasblockselected ? "block-selection-edit" : "entity-edit";
  usecommandcontext(commandcontext);
  const editorsettings = (0,external_wp_element_namespaceobject.usememo)(
    () => ({
      ...settings,
      onnavigatetoentityrecord,
      onnavigatetopreviousentityrecord,
      defaultrenderingmode: "post-only"
    }),
    [settings, onnavigatetoentityrecord, onnavigatetopreviousentityrecord]
  );
  const styles = useeditorstyles(paddingstyle);
  if (showiconlabels) {
    document.body.classlist.add("show-icon-labels");
  } else {
    document.body.classlist.remove("show-icon-labels");
  }
  const navigateregionsprops = (0,external_wp_components_namespaceobject.__unstableusenavigateregions)();
  const classname = dist_clsx("edit-post-layout", "is-mode-" + mode, {
    "has-metaboxes": hasactivemetaboxes
  });
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
  const { createsuccessnotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  const onactionperformed = (0,external_wp_element_namespaceobject.usecallback)(
    (actionid, items) => {
      switch (actionid) {
        case "move-to-trash":
          {
            document.location.href = (0,external_wp_url_namespaceobject.addqueryargs)("edit.php", {
              trashed: 1,
              post_type: items[0].type,
              ids: items[0].id
            });
          }
          break;
        case "duplicate-post":
          {
            const newitem = items[0];
            const title = typeof newitem.title === "string" ? newitem.title : newitem.title?.rendered;
            createsuccessnotice(
              (0,external_wp_i18n_namespaceobject.sprintf)(
                // translators: %s: title of the created post or template, e.g: "hello world".
                (0,external_wp_i18n_namespaceobject.__)('"%s" successfully created.'),
                (0,external_wp_htmlentities_namespaceobject.decodeentities)(title) || (0,external_wp_i18n_namespaceobject.__)("(no title)")
              ),
              {
                type: "snackbar",
                id: "duplicate-post-action",
                actions: [
                  {
                    label: (0,external_wp_i18n_namespaceobject.__)("edit"),
                    onclick: () => {
                      const postid = newitem.id;
                      document.location.href = (0,external_wp_url_namespaceobject.addqueryargs)("post.php", {
                        post: postid,
                        action: "edit"
                      });
                    }
                  }
                ]
              }
            );
          }
          break;
      }
    },
    [createsuccessnotice]
  );
  const initialpost = (0,external_wp_element_namespaceobject.usememo)(() => {
    return {
      type: initialposttype,
      id: initialpostid
    };
  }, [initialposttype, initialpostid]);
  const backbutton = (0,external_wp_compose_namespaceobject.useviewportmatch)("medium") && isfullscreenactive ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(back_button_default, { initialpost }) : null;
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.slotfillprovider, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_editor_namespaceobject.errorboundary, { cancopycontent: true, children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(welcomeguide, { posttype: currentposttype }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      "div",
      {
        classname: navigateregionsprops.classname,
        ...navigateregionsprops,
        ref: navigateregionsprops.ref,
        children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
          editor,
          {
            settings: editorsettings,
            initialedits,
            posttype: currentposttype,
            postid: currentpostid,
            templateid,
            classname,
            styles,
            forceisdirty: hasactivemetaboxes,
            contentref: paddingappenderref,
            disableiframe: !shouldiframe,
            autofocus: !iswelcomeguidevisible,
            onactionperformed,
            extrasidebarpanels: showmetaboxes && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(metaboxes, { location: "side" }),
            extracontent: !isdistractionfree && showmetaboxes && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              metaboxesmain,
              {
                islegacy: !shouldiframe || isdevicepreview
              }
            ),
            children: [
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.postlockedmodal, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(editorinitialization, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(fullscreenmode, { isactive: isfullscreenactive }),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(browserurl, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.unsavedchangeswarning, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.autosavemonitor, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.localautosavemonitor, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(keyboard_shortcuts_default, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.editorkeyboardshortcutsregister, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(blockkeyboardshortcuts, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(initpatternmodal, {}),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_plugins_namespaceobject.pluginarea, { onerror: onpluginareaerror }),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(more_menu_default, {}),
              backbutton,
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.editorsnackbars, {})
            ]
          }
        )
      }
    )
  ] }) });
}
var layout_default = layout;


;// ./node_modules/@wordpress/edit-post/build-module/deprecated.js





const { pluginpostexcerpt } = unlock(external_wp_editor_namespaceobject.privateapis);
const issiteeditor = (0,external_wp_url_namespaceobject.getpath)(window.location.href)?.includes(
  "site-editor.php"
);
const deprecateslot = (name) => {
  external_wp_deprecated_default()(`wp.editpost.${name}`, {
    since: "6.6",
    alternative: `wp.editor.${name}`
  });
};
function pluginblocksettingsmenuitem(props) {
  if (issiteeditor) {
    return null;
  }
  deprecateslot("pluginblocksettingsmenuitem");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.pluginblocksettingsmenuitem, { ...props });
}
function plugindocumentsettingpanel(props) {
  if (issiteeditor) {
    return null;
  }
  deprecateslot("plugindocumentsettingpanel");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.plugindocumentsettingpanel, { ...props });
}
function pluginmoremenuitem(props) {
  if (issiteeditor) {
    return null;
  }
  deprecateslot("pluginmoremenuitem");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.pluginmoremenuitem, { ...props });
}
function pluginprepublishpanel(props) {
  if (issiteeditor) {
    return null;
  }
  deprecateslot("pluginprepublishpanel");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.pluginprepublishpanel, { ...props });
}
function pluginpostpublishpanel(props) {
  if (issiteeditor) {
    return null;
  }
  deprecateslot("pluginpostpublishpanel");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.pluginpostpublishpanel, { ...props });
}
function pluginpoststatusinfo(props) {
  if (issiteeditor) {
    return null;
  }
  deprecateslot("pluginpoststatusinfo");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.pluginpoststatusinfo, { ...props });
}
function pluginsidebar(props) {
  if (issiteeditor) {
    return null;
  }
  deprecateslot("pluginsidebar");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.pluginsidebar, { ...props });
}
function pluginsidebarmoremenuitem(props) {
  if (issiteeditor) {
    return null;
  }
  deprecateslot("pluginsidebarmoremenuitem");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_editor_namespaceobject.pluginsidebarmoremenuitem, { ...props });
}
function __experimentalpluginpostexcerpt() {
  if (issiteeditor) {
    return null;
  }
  external_wp_deprecated_default()("wp.editpost.__experimentalpluginpostexcerpt", {
    since: "6.6",
    hint: "core and custom panels can be access programmatically using their panel name.",
    link: "https://developer.wordpress.org/block-editor/reference-guides/slotfills/plugin-document-setting-panel/#accessing-a-panel-programmatically"
  });
  return pluginpostexcerpt;
}


;// ./node_modules/@wordpress/edit-post/build-module/index.js











const {
  backbutton: __experimentalmaindashboardbutton,
  registercoreblockbindingssources
} = unlock(external_wp_editor_namespaceobject.privateapis);
function initializeeditor(id, posttype, postid, settings, initialedits) {
  const ismediumorbigger = window.matchmedia("(min-width: 782px)").matches;
  const target = document.getelementbyid(id);
  const root = (0,external_wp_element_namespaceobject.createroot)(target);
  (0,external_wp_data_namespaceobject.dispatch)(external_wp_preferences_namespaceobject.store).setdefaults("core/edit-post", {
    fullscreenmode: true,
    themestyles: true,
    welcomeguide: true,
    welcomeguidetemplate: true
  });
  (0,external_wp_data_namespaceobject.dispatch)(external_wp_preferences_namespaceobject.store).setdefaults("core", {
    allowrightclickoverrides: true,
    editormode: "visual",
    editortool: "edit",
    fixedtoolbar: false,
    hiddenblocktypes: [],
    inactivepanels: [],
    openpanels: ["post-status"],
    showblockbreadcrumbs: true,
    showiconlabels: false,
    showlistviewbydefault: false,
    enablechoosepatternmodal: true,
    ispublishsidebarenabled: true
  });
  if (window.__experimentalmediaprocessing) {
    (0,external_wp_data_namespaceobject.dispatch)(external_wp_preferences_namespaceobject.store).setdefaults("core/media", {
      requireapproval: true,
      optimizeonupload: true
    });
  }
  (0,external_wp_data_namespaceobject.dispatch)(external_wp_blocks_namespaceobject.store).reapplyblocktypefilters();
  if (ismediumorbigger && (0,external_wp_data_namespaceobject.select)(external_wp_preferences_namespaceobject.store).get("core", "showlistviewbydefault") && !(0,external_wp_data_namespaceobject.select)(external_wp_preferences_namespaceobject.store).get("core", "distractionfree")) {
    (0,external_wp_data_namespaceobject.dispatch)(external_wp_editor_namespaceobject.store).setislistviewopened(true);
  }
  (0,external_wp_blocklibrary_namespaceobject.registercoreblocks)();
  registercoreblockbindingssources();
  (0,external_wp_widgets_namespaceobject.registerlegacywidgetblock)({ inserter: false });
  (0,external_wp_widgets_namespaceobject.registerwidgetgroupblock)({ inserter: false });
  if (false) {}
  const documentmode = document.compatmode === "css1compat" ? "standards" : "quirks";
  if (documentmode !== "standards") {
    console.warn(
      "your browser is using quirks mode. \nthis can cause rendering issues such as blocks overlaying meta boxes in the editor. quirks mode can be triggered by php errors or html code appearing before the opening <!doctype html>. try checking the raw page source or your site's php error log and resolving errors there, removing any html before the doctype, or disabling plugins."
    );
  }
  const isiphone = window.navigator.useragent.indexof("iphone") !== -1;
  if (isiphone) {
    window.addeventlistener("scroll", (event) => {
      const editorscrollcontainer = document.getelementsbyclassname(
        "interface-interface-skeleton__body"
      )[0];
      if (event.target === document) {
        if (window.scrolly > 100) {
          editorscrollcontainer.scrolltop = editorscrollcontainer.scrolltop + window.scrolly;
        }
        if (document.getelementsbyclassname("is-mode-visual")[0]) {
          window.scrollto(0, 0);
        }
      }
    });
  }
  window.addeventlistener("dragover", (e) => e.preventdefault(), false);
  window.addeventlistener("drop", (e) => e.preventdefault(), false);
  root.render(
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.strictmode, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      layout_default,
      {
        settings,
        postid,
        posttype,
        initialedits
      }
    ) })
  );
  return root;
}
function reinitializeeditor() {
  external_wp_deprecated_default()("wp.editpost.reinitializeeditor", {
    since: "6.2",
    version: "6.3"
  });
}





(window.wp = window.wp || {}).editpost = __webpack_exports__;
/******/ })()
;







