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
  reusableblocksmenuitems: () => (/* reexport */ reusableblocksmenuitems),
  store: () => (/* reexport */ store)
});

// namespace object: ./node_modules/@wordpress/reusable-blocks/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  __experimentalconvertblocktostatic: () => (__experimentalconvertblocktostatic),
  __experimentalconvertblockstoreusable: () => (__experimentalconvertblockstoreusable),
  __experimentaldeletereusableblock: () => (__experimentaldeletereusableblock),
  __experimentalseteditingreusableblock: () => (__experimentalseteditingreusableblock)
});

// namespace object: ./node_modules/@wordpress/reusable-blocks/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  __experimentaliseditingreusableblock: () => (__experimentaliseditingreusableblock)
});

;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// external ["wp","blockeditor"]
const external_wp_blockeditor_namespaceobject = window["wp"]["blockeditor"];
;// external ["wp","blocks"]
const external_wp_blocks_namespaceobject = window["wp"]["blocks"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// ./node_modules/@wordpress/reusable-blocks/build-module/store/actions.js



const __experimentalconvertblocktostatic = (clientid) => ({ registry }) => {
  const oldblock = registry.select(external_wp_blockeditor_namespaceobject.store).getblock(clientid);
  const reusableblock = registry.select("core").geteditedentityrecord(
    "posttype",
    "wp_block",
    oldblock.attributes.ref
  );
  const newblocks = (0,external_wp_blocks_namespaceobject.parse)(
    typeof reusableblock.content === "function" ? reusableblock.content(reusableblock) : reusableblock.content
  );
  registry.dispatch(external_wp_blockeditor_namespaceobject.store).replaceblocks(oldblock.clientid, newblocks);
};
const __experimentalconvertblockstoreusable = (clientids, title, synctype) => async ({ registry, dispatch }) => {
  const meta = synctype === "unsynced" ? {
    wp_pattern_sync_status: synctype
  } : void 0;
  const reusableblock = {
    title: title || (0,external_wp_i18n_namespaceobject.__)("untitled pattern block"),
    content: (0,external_wp_blocks_namespaceobject.serialize)(
      registry.select(external_wp_blockeditor_namespaceobject.store).getblocksbyclientid(clientids)
    ),
    status: "publish",
    meta
  };
  const updatedrecord = await registry.dispatch("core").saveentityrecord("posttype", "wp_block", reusableblock);
  if (synctype === "unsynced") {
    return;
  }
  const newblock = (0,external_wp_blocks_namespaceobject.createblock)("core/block", {
    ref: updatedrecord.id
  });
  registry.dispatch(external_wp_blockeditor_namespaceobject.store).replaceblocks(clientids, newblock);
  dispatch.__experimentalseteditingreusableblock(
    newblock.clientid,
    true
  );
};
const __experimentaldeletereusableblock = (id) => async ({ registry }) => {
  const reusableblock = registry.select("core").geteditedentityrecord("posttype", "wp_block", id);
  if (!reusableblock) {
    return;
  }
  const allblocks = registry.select(external_wp_blockeditor_namespaceobject.store).getblocks();
  const associatedblocks = allblocks.filter(
    (block) => (0,external_wp_blocks_namespaceobject.isreusableblock)(block) && block.attributes.ref === id
  );
  const associatedblockclientids = associatedblocks.map(
    (block) => block.clientid
  );
  if (associatedblockclientids.length) {
    registry.dispatch(external_wp_blockeditor_namespaceobject.store).removeblocks(associatedblockclientids);
  }
  await registry.dispatch("core").deleteentityrecord("posttype", "wp_block", id);
};
function __experimentalseteditingreusableblock(clientid, isediting) {
  return {
    type: "set_editing_reusable_block",
    clientid,
    isediting
  };
}


;// ./node_modules/@wordpress/reusable-blocks/build-module/store/reducer.js

function iseditingreusableblock(state = {}, action) {
  if (action?.type === "set_editing_reusable_block") {
    return {
      ...state,
      [action.clientid]: action.isediting
    };
  }
  return state;
}
var reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({
  iseditingreusableblock
});


;// ./node_modules/@wordpress/reusable-blocks/build-module/store/selectors.js
function __experimentaliseditingreusableblock(state, clientid) {
  return state.iseditingreusableblock[clientid];
}


;// ./node_modules/@wordpress/reusable-blocks/build-module/store/index.js




const store_name = "core/reusable-blocks";
const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  actions: actions_namespaceobject,
  reducer: reducer_default,
  selectors: selectors_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);


;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/symbol.js


var symbol_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m21.3 10.8l-5.6-5.6c-.7-.7-1.8-.7-2.5 0l-5.6 5.6c-.7.7-.7 1.8 0 2.5l5.6 5.6c.3.3.8.5 1.2.5s.9-.2 1.2-.5l5.6-5.6c.8-.7.8-1.9.1-2.5zm-1 1.4l-5.6 5.6c-.1.1-.3.1-.4 0l-5.6-5.6c-.1-.1-.1-.3 0-.4l5.6-5.6s.1-.1.2-.1.1 0 .2.1l5.6 5.6c.1.1.1.3 0 .4zm-16.6-.4l10 5.5l-1-1-6.3 6.3c-.7.7-.7 1.8 0 2.5l9 19.5l1.1-1.1-6.3-6.3c-.2 0-.2-.2-.1-.3z" }) });


;// external ["wp","notices"]
const external_wp_notices_namespaceobject = window["wp"]["notices"];
;// external ["wp","coredata"]
const external_wp_coredata_namespaceobject = window["wp"]["coredata"];
;// ./node_modules/@wordpress/reusable-blocks/build-module/components/reusable-blocks-menu-items/reusable-block-convert-button.js











function reusableblockconvertbutton({
  clientids,
  rootclientid,
  onclose
}) {
  const [synctype, setsynctype] = (0,external_wp_element_namespaceobject.usestate)(void 0);
  const [ismodalopen, setismodalopen] = (0,external_wp_element_namespaceobject.usestate)(false);
  const [title, settitle] = (0,external_wp_element_namespaceobject.usestate)("");
  const canconvert = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { canuser } = select(external_wp_coredata_namespaceobject.store);
      const {
        getblocksbyclientid,
        caninsertblocktype,
        getblockrootclientid
      } = select(external_wp_blockeditor_namespaceobject.store);
      const rootid = rootclientid || (clientids.length > 0 ? getblockrootclientid(clientids[0]) : void 0);
      const blocks = getblocksbyclientid(clientids) ?? [];
      const isreusable = blocks.length === 1 && blocks[0] && (0,external_wp_blocks_namespaceobject.isreusableblock)(blocks[0]) && !!select(external_wp_coredata_namespaceobject.store).getentityrecord(
        "posttype",
        "wp_block",
        blocks[0].attributes.ref
      );
      const _canconvert = (
        // hide when this is already a reusable block.
        !isreusable && // hide when reusable blocks are disabled.
        caninsertblocktype("core/block", rootid) && blocks.every(
          (block) => (
            // guard against the case where a regular block has *just* been converted.
            !!block && // hide on invalid blocks.
            block.isvalid && // hide when block doesn't support being made reusable.
            (0,external_wp_blocks_namespaceobject.hasblocksupport)(block.name, "reusable", true)
          )
        ) && // hide when current doesn't have permission to do that.
        // blocks refers to the wp_block post type, this checks the ability to create a post of that type.
        !!canuser("create", {
          kind: "posttype",
          name: "wp_block"
        })
      );
      return _canconvert;
    },
    [clientids, rootclientid]
  );
  const { __experimentalconvertblockstoreusable: convertblockstoreusable } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const { createsuccessnotice, createerrornotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  const onconvert = (0,external_wp_element_namespaceobject.usecallback)(
    async function(reusableblocktitle) {
      try {
        await convertblockstoreusable(
          clientids,
          reusableblocktitle,
          synctype
        );
        createsuccessnotice(
          !synctype ? (0,external_wp_i18n_namespaceobject.sprintf)(
            // translators: %s: the name the user has given to the pattern.
            (0,external_wp_i18n_namespaceobject.__)("synced pattern created: %s"),
            reusableblocktitle
          ) : (0,external_wp_i18n_namespaceobject.sprintf)(
            // translators: %s: the name the user has given to the pattern.
            (0,external_wp_i18n_namespaceobject.__)("unsynced pattern created: %s"),
            reusableblocktitle
          ),
          {
            type: "snackbar",
            id: "convert-to-reusable-block-success"
          }
        );
      } catch (error) {
        createerrornotice(error.message, {
          type: "snackbar",
          id: "convert-to-reusable-block-error"
        });
      }
    },
    [
      convertblockstoreusable,
      clientids,
      synctype,
      createsuccessnotice,
      createerrornotice
    ]
  );
  if (!canconvert) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menuitem, { icon: symbol_default, onclick: () => setismodalopen(true), children: (0,external_wp_i18n_namespaceobject.__)("create pattern") }),
    ismodalopen && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.modal,
      {
        title: (0,external_wp_i18n_namespaceobject.__)("create pattern"),
        onrequestclose: () => {
          setismodalopen(false);
          settitle("");
        },
        overlayclassname: "reusable-blocks-menu-items__convert-modal",
        children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          "form",
          {
            onsubmit: (event) => {
              event.preventdefault();
              onconvert(title);
              setismodalopen(false);
              settitle("");
              onclose();
            },
            children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: "5", children: [
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                external_wp_components_namespaceobject.textcontrol,
                {
                  __next40pxdefaultsize: true,
                  __nexthasnomarginbottom: true,
                  label: (0,external_wp_i18n_namespaceobject.__)("name"),
                  value: title,
                  onchange: settitle,
                  placeholder: (0,external_wp_i18n_namespaceobject.__)("my pattern")
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
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalhstack, { justify: "right", children: [
                /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                  external_wp_components_namespaceobject.button,
                  {
                    __next40pxdefaultsize: true,
                    variant: "tertiary",
                    onclick: () => {
                      setismodalopen(false);
                      settitle("");
                    },
                    children: (0,external_wp_i18n_namespaceobject.__)("cancel")
                  }
                ),
                /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                  external_wp_components_namespaceobject.button,
                  {
                    __next40pxdefaultsize: true,
                    variant: "primary",
                    type: "submit",
                    children: (0,external_wp_i18n_namespaceobject.__)("create")
                  }
                )
              ] })
            ] })
          }
        )
      }
    )
  ] });
}


;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// ./node_modules/@wordpress/reusable-blocks/build-module/components/reusable-blocks-menu-items/reusable-blocks-manage-button.js









function reusableblocksmanagebutton({ clientid }) {
  const { canremove, isvisible, managepatternsurl } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { getblock, canremoveblock } = select(external_wp_blockeditor_namespaceobject.store);
      const { canuser } = select(external_wp_coredata_namespaceobject.store);
      const reusableblock = getblock(clientid);
      return {
        canremove: canremoveblock(clientid),
        isvisible: !!reusableblock && (0,external_wp_blocks_namespaceobject.isreusableblock)(reusableblock) && !!canuser("update", {
          kind: "posttype",
          name: "wp_block",
          id: reusableblock.attributes.ref
        }),
        // the site editor and templates both check whether the user
        // has edit_theme_options capabilities. we can leverage that here
        // and omit the manage patterns link if the user can't access it.
        managepatternsurl: canuser("create", {
          kind: "posttype",
          name: "wp_template"
        }) ? (0,external_wp_url_namespaceobject.addqueryargs)("site-editor.php", {
          p: "/pattern"
        }) : (0,external_wp_url_namespaceobject.addqueryargs)("edit.php", {
          post_type: "wp_block"
        })
      };
    },
    [clientid]
  );
  const { __experimentalconvertblocktostatic: convertblocktostatic } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  if (!isvisible) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menuitem, { href: managepatternsurl, children: (0,external_wp_i18n_namespaceobject.__)("manage patterns") }),
    canremove && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menuitem, { onclick: () => convertblocktostatic(clientid), children: (0,external_wp_i18n_namespaceobject.__)("detach") })
  ] });
}
var reusable_blocks_manage_button_default = reusableblocksmanagebutton;


;// ./node_modules/@wordpress/reusable-blocks/build-module/components/reusable-blocks-menu-items/index.js




function reusableblocksmenuitems({ rootclientid }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blocksettingsmenucontrols, { children: ({ onclose, selectedclientids }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      reusableblockconvertbutton,
      {
        clientids: selectedclientids,
        rootclientid,
        onclose
      }
    ),
    selectedclientids.length === 1 && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      reusable_blocks_manage_button_default,
      {
        clientid: selectedclientids[0]
      }
    )
  ] }) });
}


;// ./node_modules/@wordpress/reusable-blocks/build-module/components/index.js



;// ./node_modules/@wordpress/reusable-blocks/build-module/index.js




(window.wp = window.wp || {}).reusableblocks = __webpack_exports__;
/******/ })()
;



