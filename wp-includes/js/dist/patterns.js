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
  privateapis: () => (/* reexport */ privateapis),
  store: () => (/* reexport */ store)
});

// namespace object: ./node_modules/@wordpress/patterns/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  convertsyncedpatterntostatic: () => (convertsyncedpatterntostatic),
  createpattern: () => (createpattern),
  createpatternfromfile: () => (createpatternfromfile),
  seteditingpattern: () => (seteditingpattern)
});

// namespace object: ./node_modules/@wordpress/patterns/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  iseditingpattern: () => (selectors_iseditingpattern)
});

;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/patterns/build-module/store/reducer.js

function iseditingpattern(state = {}, action) {
  if (action?.type === "set_editing_pattern") {
    return {
      ...state,
      [action.clientid]: action.isediting
    };
  }
  return state;
}
var reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({
  iseditingpattern
});


;// external ["wp","blocks"]
const external_wp_blocks_namespaceobject = window["wp"]["blocks"];
;// external ["wp","coredata"]
const external_wp_coredata_namespaceobject = window["wp"]["coredata"];
;// external ["wp","blockeditor"]
const external_wp_blockeditor_namespaceobject = window["wp"]["blockeditor"];
;// ./node_modules/@wordpress/patterns/build-module/constants.js
const pattern_types = {
  theme: "pattern",
  user: "wp_block"
};
const pattern_default_category = "all-patterns";
const pattern_user_category = "my-patterns";
const excluded_pattern_sources = [
  "core",
  "pattern-directory/core",
  "pattern-directory/featured"
];
const pattern_sync_types = {
  full: "fully",
  unsynced: "unsynced"
};
const partial_syncing_supported_blocks = {
  "core/paragraph": ["content"],
  "core/heading": ["content"],
  "core/button": ["text", "url", "linktarget", "rel"],
  "core/image": ["id", "url", "title", "alt", "caption"]
};
const pattern_overrides_binding_source = "core/pattern-overrides";


;// ./node_modules/@wordpress/patterns/build-module/store/actions.js




const createpattern = (title, synctype, content, categories) => async ({ registry }) => {
  const meta = synctype === pattern_sync_types.unsynced ? {
    wp_pattern_sync_status: synctype
  } : void 0;
  const reusableblock = {
    title,
    content,
    status: "publish",
    meta,
    wp_pattern_category: categories
  };
  const updatedrecord = await registry.dispatch(external_wp_coredata_namespaceobject.store).saveentityrecord("posttype", "wp_block", reusableblock);
  return updatedrecord;
};
const createpatternfromfile = (file, categories) => async ({ dispatch }) => {
  const filecontent = await file.text();
  let parsedcontent;
  try {
    parsedcontent = json.parse(filecontent);
  } catch (e) {
    throw new error("invalid json file");
  }
  if (parsedcontent.__file !== "wp_block" || !parsedcontent.title || !parsedcontent.content || typeof parsedcontent.title !== "string" || typeof parsedcontent.content !== "string" || parsedcontent.syncstatus && typeof parsedcontent.syncstatus !== "string") {
    throw new error("invalid pattern json file");
  }
  const pattern = await dispatch.createpattern(
    parsedcontent.title,
    parsedcontent.syncstatus,
    parsedcontent.content,
    categories
  );
  return pattern;
};
const convertsyncedpatterntostatic = (clientid) => ({ registry }) => {
  const patternblock = registry.select(external_wp_blockeditor_namespaceobject.store).getblock(clientid);
  const existingoverrides = patternblock.attributes?.content;
  function cloneblocksandremovebindings(blocks) {
    return blocks.map((block) => {
      let metadata = block.attributes.metadata;
      if (metadata) {
        metadata = { ...metadata };
        delete metadata.id;
        delete metadata.bindings;
        if (existingoverrides?.[metadata.name]) {
          for (const [attributename, value] of object.entries(
            existingoverrides[metadata.name]
          )) {
            if (!(0,external_wp_blocks_namespaceobject.getblocktype)(block.name)?.attributes[attributename]) {
              continue;
            }
            block.attributes[attributename] = value;
          }
        }
      }
      return (0,external_wp_blocks_namespaceobject.cloneblock)(
        block,
        {
          metadata: metadata && object.keys(metadata).length > 0 ? metadata : void 0
        },
        cloneblocksandremovebindings(block.innerblocks)
      );
    });
  }
  const patterninnerblocks = registry.select(external_wp_blockeditor_namespaceobject.store).getblocks(patternblock.clientid);
  registry.dispatch(external_wp_blockeditor_namespaceobject.store).replaceblocks(
    patternblock.clientid,
    cloneblocksandremovebindings(patterninnerblocks)
  );
};
function seteditingpattern(clientid, isediting) {
  return {
    type: "set_editing_pattern",
    clientid,
    isediting
  };
}


;// ./node_modules/@wordpress/patterns/build-module/store/constants.js
const store_name = "core/patterns";


;// ./node_modules/@wordpress/patterns/build-module/store/selectors.js
function selectors_iseditingpattern(state, clientid) {
  return state.iseditingpattern[clientid];
}


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/patterns/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/patterns"
);


;// ./node_modules/@wordpress/patterns/build-module/store/index.js






const storeconfig = {
  reducer: reducer_default
};
const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  ...storeconfig
});
(0,external_wp_data_namespaceobject.register)(store);
unlock(store).registerprivateactions(actions_namespaceobject);
unlock(store).registerprivateselectors(selectors_namespaceobject);


;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// ./node_modules/@wordpress/patterns/build-module/api/index.js

function isoverridableblock(block) {
  return object.keys(partial_syncing_supported_blocks).includes(
    block.name
  ) && !!block.attributes.metadata?.name && !!block.attributes.metadata?.bindings && object.values(block.attributes.metadata.bindings).some(
    (binding) => binding.source === "core/pattern-overrides"
  );
}
function hasoverridableblocks(blocks) {
  return blocks.some((block) => {
    if (isoverridableblock(block)) {
      return true;
    }
    return hasoverridableblocks(block.innerblocks);
  });
}


;// ./node_modules/@wordpress/patterns/build-module/components/overrides-panel.js








const { blockquicknavigation } = unlock(external_wp_blockeditor_namespaceobject.privateapis);
function overridespanel() {
  const allclientids = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(external_wp_blockeditor_namespaceobject.store).getclientidswithdescendants(),
    []
  );
  const { getblock } = (0,external_wp_data_namespaceobject.useselect)(external_wp_blockeditor_namespaceobject.store);
  const clientidswithoverrides = (0,external_wp_element_namespaceobject.usememo)(
    () => allclientids.filter((clientid) => {
      const block = getblock(clientid);
      return isoverridableblock(block);
    }),
    [allclientids, getblock]
  );
  if (!clientidswithoverrides?.length) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.panelbody, { title: (0,external_wp_i18n_namespaceobject.__)("overrides"), children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(blockquicknavigation, { clientids: clientidswithoverrides }) });
}


;// external ["wp","notices"]
const external_wp_notices_namespaceobject = window["wp"]["notices"];
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","htmlentities"]
const external_wp_htmlentities_namespaceobject = window["wp"]["htmlentities"];
;// ./node_modules/@wordpress/patterns/build-module/components/category-selector.js






const unescapestring = (arg) => {
  return (0,external_wp_htmlentities_namespaceobject.decodeentities)(arg);
};
const category_slug = "wp_pattern_category";
function categoryselector({
  categoryterms,
  onchange,
  categorymap
}) {
  const [search, setsearch] = (0,external_wp_element_namespaceobject.usestate)("");
  const debouncedsearch = (0,external_wp_compose_namespaceobject.usedebounce)(setsearch, 500);
  const suggestions = (0,external_wp_element_namespaceobject.usememo)(() => {
    return array.from(categorymap.values()).map((category) => unescapestring(category.label)).filter((category) => {
      if (search !== "") {
        return category.tolowercase().includes(search.tolowercase());
      }
      return true;
    }).sort((a, b) => a.localecompare(b));
  }, [search, categorymap]);
  function handlechange(termnames) {
    const uniqueterms = termnames.reduce((terms, newterm) => {
      if (!terms.some(
        (term) => term.tolowercase() === newterm.tolowercase()
      )) {
        terms.push(newterm);
      }
      return terms;
    }, []);
    onchange(uniqueterms);
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.formtokenfield,
    {
      classname: "patterns-menu-items__convert-modal-categories",
      value: categoryterms,
      suggestions,
      onchange: handlechange,
      oninputchange: debouncedsearch,
      label: (0,external_wp_i18n_namespaceobject.__)("categories"),
      tokenizeonblur: true,
      __experimentalexpandonfocus: true,
      __next40pxdefaultsize: true,
      __nexthasnomarginbottom: true
    }
  );
}


;// ./node_modules/@wordpress/patterns/build-module/private-hooks.js




function useaddpatterncategory() {
  const { saveentityrecord, invalidateresolution } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_coredata_namespaceobject.store);
  const { corepatterncategories, userpatterncategories } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { getuserpatterncategories, getblockpatterncategories } = select(external_wp_coredata_namespaceobject.store);
      return {
        corepatterncategories: getblockpatterncategories(),
        userpatterncategories: getuserpatterncategories()
      };
    },
    []
  );
  const categorymap = (0,external_wp_element_namespaceobject.usememo)(() => {
    const uniquecategories = /* @__pure__ */ new map();
    userpatterncategories.foreach((category) => {
      uniquecategories.set(category.label.tolowercase(), {
        label: category.label,
        name: category.name,
        id: category.id
      });
    });
    corepatterncategories.foreach((category) => {
      if (!uniquecategories.has(category.label.tolowercase()) && // there are two core categories with `post` label so explicitly remove the one with
      // the `query` slug to avoid any confusion.
      category.name !== "query") {
        uniquecategories.set(category.label.tolowercase(), {
          label: category.label,
          name: category.name
        });
      }
    });
    return uniquecategories;
  }, [userpatterncategories, corepatterncategories]);
  async function findorcreateterm(term) {
    try {
      const existingterm = categorymap.get(term.tolowercase());
      if (existingterm?.id) {
        return existingterm.id;
      }
      const termdata = existingterm ? { name: existingterm.label, slug: existingterm.name } : { name: term };
      const newterm = await saveentityrecord(
        "taxonomy",
        category_slug,
        termdata,
        { throwonerror: true }
      );
      invalidateresolution("getuserpatterncategories");
      return newterm.id;
    } catch (error) {
      if (error.code !== "term_exists") {
        throw error;
      }
      return error.data.term_id;
    }
  }
  return { categorymap, findorcreateterm };
}


;// ./node_modules/@wordpress/patterns/build-module/components/create-pattern-modal.js












function createpatternmodal({
  classname = "patterns-menu-items__convert-modal",
  modaltitle,
  ...restprops
}) {
  const defaultmodaltitle = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(external_wp_coredata_namespaceobject.store).getposttype(pattern_types.user)?.labels?.add_new_item,
    []
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.modal,
    {
      title: modaltitle || defaultmodaltitle,
      onrequestclose: restprops.onclose,
      overlayclassname: classname,
      focusonmount: "firstcontentelement",
      size: "small",
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(createpatternmodalcontents, { ...restprops })
    }
  );
}
function createpatternmodalcontents({
  confirmlabel = (0,external_wp_i18n_namespaceobject.__)("add"),
  defaultcategories = [],
  content,
  onclose,
  onerror,
  onsuccess,
  defaultsynctype = pattern_sync_types.full,
  defaulttitle = ""
}) {
  const [synctype, setsynctype] = (0,external_wp_element_namespaceobject.usestate)(defaultsynctype);
  const [categoryterms, setcategoryterms] = (0,external_wp_element_namespaceobject.usestate)(defaultcategories);
  const [title, settitle] = (0,external_wp_element_namespaceobject.usestate)(defaulttitle);
  const [issaving, setissaving] = (0,external_wp_element_namespaceobject.usestate)(false);
  const { createpattern } = unlock((0,external_wp_data_namespaceobject.usedispatch)(store));
  const { createerrornotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  const { categorymap, findorcreateterm } = useaddpatterncategory();
  async function oncreate(patterntitle, sync) {
    if (!title || issaving) {
      return;
    }
    try {
      setissaving(true);
      const categories = await promise.all(
        categoryterms.map(
          (termname) => findorcreateterm(termname)
        )
      );
      const newpattern = await createpattern(
        patterntitle,
        sync,
        typeof content === "function" ? content() : content,
        categories
      );
      onsuccess({
        pattern: newpattern,
        categoryid: pattern_default_category
      });
    } catch (error) {
      createerrornotice(error.message, {
        type: "snackbar",
        id: "pattern-create"
      });
      onerror?.();
    } finally {
      setissaving(false);
      setcategoryterms([]);
      settitle("");
    }
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "form",
    {
      onsubmit: (event) => {
        event.preventdefault();
        oncreate(title, synctype);
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
          categoryselector,
          {
            categoryterms,
            onchange: setcategoryterms,
            categorymap
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
            checked: synctype === pattern_sync_types.full,
            onchange: () => {
              setsynctype(
                synctype === pattern_sync_types.full ? pattern_sync_types.unsynced : pattern_sync_types.full
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
                onclose();
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
              "aria-disabled": !title || issaving,
              isbusy: issaving,
              children: confirmlabel
            }
          )
        ] })
      ] })
    }
  );
}


;// ./node_modules/@wordpress/patterns/build-module/components/duplicate-pattern-modal.js







function gettermlabels(pattern, categories) {
  if (pattern.type !== pattern_types.user) {
    return categories.core?.filter(
      (category) => pattern.categories?.includes(category.name)
    ).map((category) => category.label);
  }
  return categories.user?.filter(
    (category) => pattern.wp_pattern_category?.includes(category.id)
  ).map((category) => category.label);
}
function useduplicatepatternprops({ pattern, onsuccess }) {
  const { createsuccessnotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  const categories = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { getuserpatterncategories, getblockpatterncategories } = select(external_wp_coredata_namespaceobject.store);
    return {
      core: getblockpatterncategories(),
      user: getuserpatterncategories()
    };
  });
  if (!pattern) {
    return null;
  }
  return {
    content: pattern.content,
    defaultcategories: gettermlabels(pattern, categories),
    defaultsynctype: pattern.type !== pattern_types.user ? pattern_sync_types.unsynced : pattern.wp_pattern_sync_status || pattern_sync_types.full,
    defaulttitle: (0,external_wp_i18n_namespaceobject.sprintf)(
      /* translators: %s: existing pattern title */
      (0,external_wp_i18n_namespaceobject._x)("%s (copy)", "pattern"),
      typeof pattern.title === "string" ? pattern.title : pattern.title.raw
    ),
    onsuccess: ({ pattern: newpattern }) => {
      createsuccessnotice(
        (0,external_wp_i18n_namespaceobject.sprintf)(
          // translators: %s: the new pattern's title e.g. 'call to action (copy)'.
          (0,external_wp_i18n_namespaceobject._x)('"%s" duplicated.', "pattern"),
          newpattern.title.raw
        ),
        {
          type: "snackbar",
          id: "patterns-create"
        }
      );
      onsuccess?.({ pattern: newpattern });
    }
  };
}
function duplicatepatternmodal({
  pattern,
  onclose,
  onsuccess
}) {
  const duplicatedprops = useduplicatepatternprops({ pattern, onsuccess });
  if (!pattern) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    createpatternmodal,
    {
      modaltitle: (0,external_wp_i18n_namespaceobject.__)("duplicate pattern"),
      confirmlabel: (0,external_wp_i18n_namespaceobject.__)("duplicate"),
      onclose,
      onerror: onclose,
      ...duplicatedprops
    }
  );
}


;// ./node_modules/@wordpress/patterns/build-module/components/rename-pattern-modal.js








function renamepatternmodal({
  onclose,
  onerror,
  onsuccess,
  pattern,
  ...props
}) {
  const originalname = (0,external_wp_htmlentities_namespaceobject.decodeentities)(pattern.title);
  const [name, setname] = (0,external_wp_element_namespaceobject.usestate)(originalname);
  const [issaving, setissaving] = (0,external_wp_element_namespaceobject.usestate)(false);
  const {
    editentityrecord,
    __experimentalsavespecifiedentityedits: savespecifiedentityedits
  } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_coredata_namespaceobject.store);
  const { createsuccessnotice, createerrornotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  const onrename = async (event) => {
    event.preventdefault();
    if (!name || name === pattern.title || issaving) {
      return;
    }
    try {
      await editentityrecord("posttype", pattern.type, pattern.id, {
        title: name
      });
      setissaving(true);
      setname("");
      onclose?.();
      const savedrecord = await savespecifiedentityedits(
        "posttype",
        pattern.type,
        pattern.id,
        ["title"],
        { throwonerror: true }
      );
      onsuccess?.(savedrecord);
      createsuccessnotice((0,external_wp_i18n_namespaceobject.__)("pattern renamed"), {
        type: "snackbar",
        id: "pattern-update"
      });
    } catch (error) {
      onerror?.();
      const errormessage = error.message && error.code !== "unknown_error" ? error.message : (0,external_wp_i18n_namespaceobject.__)("an error occurred while renaming the pattern.");
      createerrornotice(errormessage, {
        type: "snackbar",
        id: "pattern-update"
      });
    } finally {
      setissaving(false);
      setname("");
    }
  };
  const onrequestclose = () => {
    onclose?.();
    setname("");
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.modal,
    {
      title: (0,external_wp_i18n_namespaceobject.__)("rename"),
      ...props,
      onrequestclose: onclose,
      focusonmount: "firstcontentelement",
      size: "small",
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("form", { onsubmit: onrename, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: "5", children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.textcontrol,
          {
            __nexthasnomarginbottom: true,
            __next40pxdefaultsize: true,
            label: (0,external_wp_i18n_namespaceobject.__)("name"),
            value: name,
            onchange: setname,
            required: true
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalhstack, { justify: "right", children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_components_namespaceobject.button,
            {
              __next40pxdefaultsize: true,
              variant: "tertiary",
              onclick: onrequestclose,
              children: (0,external_wp_i18n_namespaceobject.__)("cancel")
            }
          ),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_components_namespaceobject.button,
            {
              __next40pxdefaultsize: true,
              variant: "primary",
              type: "submit",
              children: (0,external_wp_i18n_namespaceobject.__)("save")
            }
          )
        ] })
      ] }) })
    }
  );
}


;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/symbol.js


var symbol_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m21.3 10.8l-5.6-5.6c-.7-.7-1.8-.7-2.5 0l-5.6 5.6c-.7.7-.7 1.8 0 2.5l5.6 5.6c.3.3.8.5 1.2.5s.9-.2 1.2-.5l5.6-5.6c.8-.7.8-1.9.1-2.5zm-1 1.4l-5.6 5.6c-.1.1-.3.1-.4 0l-5.6-5.6c-.1-.1-.1-.3 0-.4l5.6-5.6s.1-.1.2-.1.1 0 .2.1l5.6 5.6c.1.1.1.3 0 .4zm-16.6-.4l10 5.5l-1-1-6.3 6.3c-.7.7-.7 1.8 0 2.5l9 19.5l1.1-1.1-6.3-6.3c-.2 0-.2-.2-.1-.3z" }) });


;// ./node_modules/@wordpress/patterns/build-module/components/pattern-convert-button.js














function patternconvertbutton({
  clientids,
  rootclientid,
  closeblocksettingsmenu
}) {
  const { createsuccessnotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  const { replaceblocks, updateblockattributes } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_blockeditor_namespaceobject.store);
  const { seteditingpattern } = unlock((0,external_wp_data_namespaceobject.usedispatch)(store));
  const [ismodalopen, setismodalopen] = (0,external_wp_element_namespaceobject.usestate)(false);
  const { getblockattributes } = (0,external_wp_data_namespaceobject.useselect)(external_wp_blockeditor_namespaceobject.store);
  const canconvert = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { canuser } = select(external_wp_coredata_namespaceobject.store);
      const {
        getblocksbyclientid: getblocksbyclientid2,
        caninsertblocktype,
        getblockrootclientid
      } = select(external_wp_blockeditor_namespaceobject.store);
      const rootid = rootclientid || (clientids.length > 0 ? getblockrootclientid(clientids[0]) : void 0);
      const blocks = getblocksbyclientid2(clientids) ?? [];
      const hasreusableblocksupport = (blockname) => {
        const blocktype = (0,external_wp_blocks_namespaceobject.getblocktype)(blockname);
        const hasparent = blocktype && "parent" in blocktype;
        return (0,external_wp_blocks_namespaceobject.hasblocksupport)(blockname, "reusable", !hasparent);
      };
      const issyncedpattern = blocks.length === 1 && blocks[0] && (0,external_wp_blocks_namespaceobject.isreusableblock)(blocks[0]) && !!select(external_wp_coredata_namespaceobject.store).getentityrecord(
        "posttype",
        "wp_block",
        blocks[0].attributes.ref
      );
      const isunsyncedpattern = window?.__experimentalcontentonlypatterninsertion && blocks.length === 1 && blocks?.[0]?.attributes?.metadata?.patternname;
      const _canconvert = (
        // hide when this is already a pattern.
        !isunsyncedpattern && !issyncedpattern && // hide when patterns are disabled.
        caninsertblocktype("core/block", rootid) && blocks.every(
          (block) => (
            // guard against the case where a regular block has *just* been converted.
            !!block && // hide on invalid blocks.
            block.isvalid && // hide when block doesn't support being made into a pattern.
            hasreusableblocksupport(block.name)
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
  const { getblocksbyclientid } = (0,external_wp_data_namespaceobject.useselect)(external_wp_blockeditor_namespaceobject.store);
  const getcontent = (0,external_wp_element_namespaceobject.usecallback)(
    () => (0,external_wp_blocks_namespaceobject.serialize)(getblocksbyclientid(clientids)),
    [getblocksbyclientid, clientids]
  );
  if (!canconvert) {
    return null;
  }
  const handlesuccess = ({ pattern }) => {
    if (pattern.wp_pattern_sync_status === pattern_sync_types.unsynced) {
      if (clientids?.length === 1) {
        const existingattributes = getblockattributes(clientids[0]);
        updateblockattributes(clientids[0], {
          metadata: {
            ...existingattributes?.metadata ? existingattributes.metadata : {},
            patternname: `core/block/${pattern.id}`,
            name: pattern.title.raw
          }
        });
      }
    } else {
      const newblock = (0,external_wp_blocks_namespaceobject.createblock)("core/block", {
        ref: pattern.id
      });
      replaceblocks(clientids, newblock);
      seteditingpattern(newblock.clientid, true);
      closeblocksettingsmenu();
    }
    createsuccessnotice(
      pattern.wp_pattern_sync_status === pattern_sync_types.unsynced ? (0,external_wp_i18n_namespaceobject.sprintf)(
        // translators: %s: the name the user has given to the pattern.
        (0,external_wp_i18n_namespaceobject.__)("unsynced pattern created: %s"),
        pattern.title.raw
      ) : (0,external_wp_i18n_namespaceobject.sprintf)(
        // translators: %s: the name the user has given to the pattern.
        (0,external_wp_i18n_namespaceobject.__)("synced pattern created: %s"),
        pattern.title.raw
      ),
      {
        type: "snackbar",
        id: "convert-to-pattern-success"
      }
    );
    setismodalopen(false);
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.menuitem,
      {
        icon: symbol_default,
        onclick: () => setismodalopen(true),
        "aria-expanded": ismodalopen,
        "aria-haspopup": "dialog",
        children: (0,external_wp_i18n_namespaceobject.__)("create pattern")
      }
    ),
    ismodalopen && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      createpatternmodal,
      {
        content: getcontent,
        onsuccess: (pattern) => {
          handlesuccess(pattern);
        },
        onerror: () => {
          setismodalopen(false);
        },
        onclose: () => {
          setismodalopen(false);
        }
      }
    )
  ] });
}


;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// ./node_modules/@wordpress/patterns/build-module/components/patterns-manage-button.js










function patternsmanagebutton({ clientid }) {
  const {
    attributes,
    candetach,
    isvisible,
    managepatternsurl,
    issyncedpattern,
    isunsyncedpattern
  } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { canremoveblock, getblock } = select(external_wp_blockeditor_namespaceobject.store);
      const { canuser } = select(external_wp_coredata_namespaceobject.store);
      const block = getblock(clientid);
      const _isunsyncedpattern = window?.__experimentalcontentonlypatterninsertion && !!block?.attributes?.metadata?.patternname;
      const _issyncedpattern = !!block && (0,external_wp_blocks_namespaceobject.isreusableblock)(block) && !!canuser("update", {
        kind: "posttype",
        name: "wp_block",
        id: block.attributes.ref
      });
      return {
        attributes: block.attributes,
        // for unsynced patterns, detaching is simply removing the `patternname` attribute.
        // for synced patterns, the `core:block` block is replaced with its inner blocks,
        // so checking whether `canremoveblock` is possible is required.
        candetach: _isunsyncedpattern || _issyncedpattern && canremoveblock(clientid),
        isunsyncedpattern: _isunsyncedpattern,
        issyncedpattern: _issyncedpattern,
        isvisible: _isunsyncedpattern || _issyncedpattern,
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
  const { updateblockattributes } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_blockeditor_namespaceobject.store);
  const { convertsyncedpatterntostatic } = unlock(
    (0,external_wp_data_namespaceobject.usedispatch)(store)
  );
  if (!isvisible) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    candetach && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.menuitem,
      {
        onclick: () => {
          if (issyncedpattern) {
            convertsyncedpatterntostatic(clientid);
          }
          if (isunsyncedpattern) {
            const {
              patternname,
              ...attributeswithoutpatternname
            } = attributes?.metadata ?? {};
            updateblockattributes(clientid, {
              metadata: attributeswithoutpatternname
            });
          }
        },
        children: (0,external_wp_i18n_namespaceobject.__)("detach")
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menuitem, { href: managepatternsurl, children: (0,external_wp_i18n_namespaceobject.__)("manage patterns") })
  ] });
}
var patterns_manage_button_default = patternsmanagebutton;


;// ./node_modules/@wordpress/patterns/build-module/components/index.js




function patternsmenuitems({ rootclientid }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blocksettingsmenucontrols, { children: ({ selectedclientids, onclose }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      patternconvertbutton,
      {
        clientids: selectedclientids,
        rootclientid,
        closeblocksettingsmenu: onclose
      }
    ),
    selectedclientids.length === 1 && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      patterns_manage_button_default,
      {
        clientid: selectedclientids[0]
      }
    )
  ] }) });
}


;// external ["wp","a11y"]
const external_wp_a11y_namespaceobject = window["wp"]["a11y"];
;// ./node_modules/@wordpress/patterns/build-module/components/rename-pattern-category-modal.js










function renamepatterncategorymodal({
  category,
  existingcategories,
  onclose,
  onerror,
  onsuccess,
  ...props
}) {
  const id = (0,external_wp_element_namespaceobject.useid)();
  const textcontrolref = (0,external_wp_element_namespaceobject.useref)();
  const [name, setname] = (0,external_wp_element_namespaceobject.usestate)((0,external_wp_htmlentities_namespaceobject.decodeentities)(category.name));
  const [issaving, setissaving] = (0,external_wp_element_namespaceobject.usestate)(false);
  const [validationmessage, setvalidationmessage] = (0,external_wp_element_namespaceobject.usestate)(false);
  const validationmessageid = validationmessage ? `patterns-rename-pattern-category-modal__validation-message-${id}` : void 0;
  const { saveentityrecord, invalidateresolution } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_coredata_namespaceobject.store);
  const { createerrornotice, createsuccessnotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  const onchange = (newname) => {
    if (validationmessage) {
      setvalidationmessage(void 0);
    }
    setname(newname);
  };
  const onsave = async (event) => {
    event.preventdefault();
    if (issaving) {
      return;
    }
    if (!name || name === category.name) {
      const message = (0,external_wp_i18n_namespaceobject.__)("please enter a new name for this category.");
      (0,external_wp_a11y_namespaceobject.speak)(message, "assertive");
      setvalidationmessage(message);
      textcontrolref.current?.focus();
      return;
    }
    if (existingcategories.patterncategories.find((existingcategory) => {
      return existingcategory.id !== category.id && existingcategory.label.tolowercase() === name.tolowercase();
    })) {
      const message = (0,external_wp_i18n_namespaceobject.__)(
        "this category already exists. please use a different name."
      );
      (0,external_wp_a11y_namespaceobject.speak)(message, "assertive");
      setvalidationmessage(message);
      textcontrolref.current?.focus();
      return;
    }
    try {
      setissaving(true);
      const savedrecord = await saveentityrecord(
        "taxonomy",
        category_slug,
        {
          id: category.id,
          slug: category.slug,
          name
        }
      );
      invalidateresolution("getuserpatterncategories");
      onsuccess?.(savedrecord);
      onclose();
      createsuccessnotice((0,external_wp_i18n_namespaceobject.__)("pattern category renamed."), {
        type: "snackbar",
        id: "pattern-category-update"
      });
    } catch (error) {
      onerror?.();
      createerrornotice(error.message, {
        type: "snackbar",
        id: "pattern-category-update"
      });
    } finally {
      setissaving(false);
      setname("");
    }
  };
  const onrequestclose = () => {
    onclose();
    setname("");
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.modal,
    {
      title: (0,external_wp_i18n_namespaceobject.__)("rename"),
      onrequestclose,
      ...props,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("form", { onsubmit: onsave, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: "5", children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: "2", children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_components_namespaceobject.textcontrol,
            {
              ref: textcontrolref,
              __nexthasnomarginbottom: true,
              __next40pxdefaultsize: true,
              label: (0,external_wp_i18n_namespaceobject.__)("name"),
              value: name,
              onchange,
              "aria-describedby": validationmessageid,
              required: true
            }
          ),
          validationmessage && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            "span",
            {
              classname: "patterns-rename-pattern-category-modal__validation-message",
              id: validationmessageid,
              children: validationmessage
            }
          )
        ] }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalhstack, { justify: "right", children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_components_namespaceobject.button,
            {
              __next40pxdefaultsize: true,
              variant: "tertiary",
              onclick: onrequestclose,
              children: (0,external_wp_i18n_namespaceobject.__)("cancel")
            }
          ),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_components_namespaceobject.button,
            {
              __next40pxdefaultsize: true,
              variant: "primary",
              type: "submit",
              "aria-disabled": !name || name === category.name || issaving,
              isbusy: issaving,
              children: (0,external_wp_i18n_namespaceobject.__)("save")
            }
          )
        ] })
      ] }) })
    }
  );
}


;// ./node_modules/@wordpress/patterns/build-module/components/allow-overrides-modal.js





function allowoverridesmodal({
  placeholder,
  initialname = "",
  onclose,
  onsave
}) {
  const [editedblockname, seteditedblockname] = (0,external_wp_element_namespaceobject.usestate)(initialname);
  const descriptionid = (0,external_wp_element_namespaceobject.useid)();
  const isnamevalid = !!editedblockname.trim();
  const handlesubmit = () => {
    if (editedblockname !== initialname) {
      const message = (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: new name/label for the block */
        (0,external_wp_i18n_namespaceobject.__)('block name changed to: "%s".'),
        editedblockname
      );
      (0,external_wp_a11y_namespaceobject.speak)(message, "assertive");
    }
    onsave(editedblockname);
    onclose();
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.modal,
    {
      title: (0,external_wp_i18n_namespaceobject.__)("enable overrides"),
      onrequestclose: onclose,
      focusonmount: "firstcontentelement",
      aria: { describedby: descriptionid },
      size: "small",
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "form",
        {
          onsubmit: (event) => {
            event.preventdefault();
            if (!isnamevalid) {
              return;
            }
            handlesubmit();
          },
          children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: "6", children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentaltext, { id: descriptionid, children: (0,external_wp_i18n_namespaceobject.__)(
              "overrides are changes you make to a block within a synced pattern instance. use overrides to customize a synced pattern instance to suit its new context. name this block to specify an override."
            ) }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.textcontrol,
              {
                __nexthasnomarginbottom: true,
                __next40pxdefaultsize: true,
                value: editedblockname,
                label: (0,external_wp_i18n_namespaceobject.__)("name"),
                help: (0,external_wp_i18n_namespaceobject.__)(
                  'for example, if you are creating a recipe pattern, you use "recipe title", "recipe description", etc.'
                ),
                placeholder,
                onchange: seteditedblockname
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalhstack, { justify: "right", children: [
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                external_wp_components_namespaceobject.button,
                {
                  __next40pxdefaultsize: true,
                  variant: "tertiary",
                  onclick: onclose,
                  children: (0,external_wp_i18n_namespaceobject.__)("cancel")
                }
              ),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                external_wp_components_namespaceobject.button,
                {
                  __next40pxdefaultsize: true,
                  "aria-disabled": !isnamevalid,
                  variant: "primary",
                  type: "submit",
                  children: (0,external_wp_i18n_namespaceobject.__)("enable")
                }
              )
            ] })
          ] })
        }
      )
    }
  );
}
function disallowoverridesmodal({ onclose, onsave }) {
  const descriptionid = (0,external_wp_element_namespaceobject.useid)();
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.modal,
    {
      title: (0,external_wp_i18n_namespaceobject.__)("disable overrides"),
      onrequestclose: onclose,
      aria: { describedby: descriptionid },
      size: "small",
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "form",
        {
          onsubmit: (event) => {
            event.preventdefault();
            onsave();
            onclose();
          },
          children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: "6", children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentaltext, { id: descriptionid, children: (0,external_wp_i18n_namespaceobject.__)(
              "are you sure you want to disable overrides? disabling overrides will revert all applied overrides for this block throughout instances of this pattern."
            ) }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalhstack, { justify: "right", children: [
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                external_wp_components_namespaceobject.button,
                {
                  __next40pxdefaultsize: true,
                  variant: "tertiary",
                  onclick: onclose,
                  children: (0,external_wp_i18n_namespaceobject.__)("cancel")
                }
              ),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                external_wp_components_namespaceobject.button,
                {
                  __next40pxdefaultsize: true,
                  variant: "primary",
                  type: "submit",
                  children: (0,external_wp_i18n_namespaceobject.__)("disable")
                }
              )
            ] })
          ] })
        }
      )
    }
  );
}


;// ./node_modules/@wordpress/patterns/build-module/components/pattern-overrides-controls.js







function patternoverridescontrols({
  attributes,
  setattributes,
  name: blockname
}) {
  const controlid = (0,external_wp_element_namespaceobject.useid)();
  const [showallowoverridesmodal, setshowallowoverridesmodal] = (0,external_wp_element_namespaceobject.usestate)(false);
  const [showdisallowoverridesmodal, setshowdisallowoverridesmodal] = (0,external_wp_element_namespaceobject.usestate)(false);
  const hasname = !!attributes.metadata?.name;
  const defaultbindings = attributes.metadata?.bindings?.__default;
  const hasoverrides = hasname && defaultbindings?.source === pattern_overrides_binding_source;
  const isconnectedtoothersources = defaultbindings?.source && defaultbindings.source !== pattern_overrides_binding_source;
  const { updateblockbindings } = (0,external_wp_blockeditor_namespaceobject.useblockbindingsutils)();
  function updatebindings(ischecked, customname) {
    if (customname) {
      setattributes({
        metadata: {
          ...attributes.metadata,
          name: customname
        }
      });
    }
    updateblockbindings({
      __default: ischecked ? { source: pattern_overrides_binding_source } : void 0
    });
  }
  if (isconnectedtoothersources) {
    return null;
  }
  const hasunsupportedimageattributes = blockname === "core/image" && !!attributes.href?.length;
  const helptext = !hasoverrides && hasunsupportedimageattributes ? (0,external_wp_i18n_namespaceobject.__)(
    `overrides currently don't support image links. remove the link first before enabling overrides.`
  ) : (0,external_wp_i18n_namespaceobject.__)(
    "allow changes to this block throughout instances of this pattern."
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.inspectorcontrols, { group: "advanced", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.basecontrol,
      {
        __nexthasnomarginbottom: true,
        id: controlid,
        label: (0,external_wp_i18n_namespaceobject.__)("overrides"),
        help: helptext,
        children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.button,
          {
            __next40pxdefaultsize: true,
            classname: "pattern-overrides-control__allow-overrides-button",
            variant: "secondary",
            "aria-haspopup": "dialog",
            onclick: () => {
              if (hasoverrides) {
                setshowdisallowoverridesmodal(true);
              } else {
                setshowallowoverridesmodal(true);
              }
            },
            disabled: !hasoverrides && hasunsupportedimageattributes,
            accessiblewhendisabled: true,
            children: hasoverrides ? (0,external_wp_i18n_namespaceobject.__)("disable overrides") : (0,external_wp_i18n_namespaceobject.__)("enable overrides")
          }
        )
      }
    ) }),
    showallowoverridesmodal && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      allowoverridesmodal,
      {
        initialname: attributes.metadata?.name,
        onclose: () => setshowallowoverridesmodal(false),
        onsave: (newname) => {
          updatebindings(true, newname);
        }
      }
    ),
    showdisallowoverridesmodal && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      disallowoverridesmodal,
      {
        onclose: () => setshowdisallowoverridesmodal(false),
        onsave: () => updatebindings(false)
      }
    )
  ] });
}
var pattern_overrides_controls_default = patternoverridescontrols;


;// ./node_modules/@wordpress/patterns/build-module/components/reset-overrides-control.js





const content = "content";
function resetoverridescontrol(props) {
  const name = props.attributes.metadata?.name;
  const registry = (0,external_wp_data_namespaceobject.useregistry)();
  const isoverridden = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      if (!name) {
        return;
      }
      const { getblockattributes, getblockparentsbyblockname } = select(external_wp_blockeditor_namespaceobject.store);
      const [patternclientid] = getblockparentsbyblockname(
        props.clientid,
        "core/block",
        true
      );
      if (!patternclientid) {
        return;
      }
      const overrides = getblockattributes(patternclientid)[content];
      if (!overrides) {
        return;
      }
      return overrides.hasownproperty(name);
    },
    [props.clientid, name]
  );
  function onclick() {
    const { getblockattributes, getblockparentsbyblockname } = registry.select(external_wp_blockeditor_namespaceobject.store);
    const [patternclientid] = getblockparentsbyblockname(
      props.clientid,
      "core/block",
      true
    );
    if (!patternclientid) {
      return;
    }
    const overrides = getblockattributes(patternclientid)[content];
    if (!overrides.hasownproperty(name)) {
      return;
    }
    const { updateblockattributes, __unstablemarklastchangeaspersistent } = registry.dispatch(external_wp_blockeditor_namespaceobject.store);
    __unstablemarklastchangeaspersistent();
    let newoverrides = { ...overrides };
    delete newoverrides[name];
    if (!object.keys(newoverrides).length) {
      newoverrides = void 0;
    }
    updateblockattributes(patternclientid, {
      [content]: newoverrides
    });
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.__unstableblocktoolbarlastitem, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.toolbargroup, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.toolbarbutton, { onclick, disabled: !isoverridden, children: (0,external_wp_i18n_namespaceobject.__)("reset") }) }) });
}


;// ./node_modules/@wordpress/icons/build-module/library/copy.js


var copy_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
  external_wp_primitives_namespaceobject.path,
  {
    fillrule: "evenodd",
    cliprule: "evenodd",
    d: "m5 4.5h11a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h5a.5.5 0 0 1-.5-.5v5a.5.5 0 0 1 .5-.5zm3 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h5a2 2 0 0 1-2-2v5zm17 3v10.75c0 .69-.56 1.25-1.25 1.25h6v1.5h12.75a2.75 2.75 0 0 0 2.75-2.75v8h20z"
  }
) });


;// ./node_modules/@wordpress/patterns/build-module/components/pattern-overrides-block-controls.js










const { useblockdisplaytitle } = unlock(external_wp_blockeditor_namespaceobject.privateapis);
function patternoverridestoolbarindicator({ clientids }) {
  const issingleblockselected = clientids.length === 1;
  const { icon, firstblockname } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { getblockattributes, getblocknamesbyclientid } = select(external_wp_blockeditor_namespaceobject.store);
      const { getblocktype, getactiveblockvariation } = select(external_wp_blocks_namespaceobject.store);
      const blocktypenames = getblocknamesbyclientid(clientids);
      const _firstblocktypename = blocktypenames[0];
      const firstblocktype = getblocktype(_firstblocktypename);
      let _icon;
      if (issingleblockselected) {
        const match = getactiveblockvariation(
          _firstblocktypename,
          getblockattributes(clientids[0])
        );
        _icon = match?.icon || firstblocktype.icon;
      } else {
        const isselectionofsametype = new set(blocktypenames).size === 1;
        _icon = isselectionofsametype ? firstblocktype.icon : copy_default;
      }
      return {
        icon: _icon,
        firstblockname: getblockattributes(clientids[0]).metadata.name
      };
    },
    [clientids, issingleblockselected]
  );
  const firstblocktitle = useblockdisplaytitle({
    clientid: clientids[0],
    maximumlength: 35
  });
  const blockdescription = issingleblockselected ? (0,external_wp_i18n_namespaceobject.sprintf)(
    /* translators: 1: the block type's name. 2: the block's user-provided name (the same as the override name). */
    (0,external_wp_i18n_namespaceobject.__)('this %1$s is editable using the "%2$s" override.'),
    firstblocktitle.tolowercase(),
    firstblockname
  ) : (0,external_wp_i18n_namespaceobject.__)("these blocks are editable using overrides.");
  const descriptionid = (0,external_wp_element_namespaceobject.useid)();
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.toolbaritem, { children: (toggleprops) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.dropdownmenu,
    {
      classname: "patterns-pattern-overrides-toolbar-indicator",
      label: firstblocktitle,
      popoverprops: {
        placement: "bottom-start",
        classname: "patterns-pattern-overrides-toolbar-indicator__popover"
      },
      icon: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_reactjsxruntime_namespaceobject.fragment, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.blockicon,
        {
          icon,
          classname: "patterns-pattern-overrides-toolbar-indicator-icon",
          showcolors: true
        }
      ) }),
      toggleprops: {
        description: blockdescription,
        ...toggleprops
      },
      menuprops: {
        orientation: "both",
        "aria-describedby": descriptionid
      },
      children: () => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentaltext, { id: descriptionid, children: blockdescription })
    }
  ) });
}
function patternoverridesblockcontrols() {
  const { clientids, haspatternoverrides, hasparentpattern } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const {
        getblockattributes,
        getselectedblockclientids,
        getblockparentsbyblockname
      } = select(external_wp_blockeditor_namespaceobject.store);
      const selectedclientids = getselectedblockclientids();
      const _haspatternoverrides = selectedclientids.every(
        (clientid) => object.values(
          getblockattributes(clientid)?.metadata?.bindings ?? {}
        ).some(
          (binding) => binding?.source === pattern_overrides_binding_source
        )
      );
      const _hasparentpattern = selectedclientids.every(
        (clientid) => getblockparentsbyblockname(clientid, "core/block", true).length > 0
      );
      return {
        clientids: selectedclientids,
        haspatternoverrides: _haspatternoverrides,
        hasparentpattern: _hasparentpattern
      };
    },
    []
  );
  return haspatternoverrides && hasparentpattern ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockcontrols, { group: "parent", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(patternoverridestoolbarindicator, { clientids }) }) : null;
}


;// ./node_modules/@wordpress/patterns/build-module/private-apis.js













const privateapis = {};
lock(privateapis, {
  overridespanel: overridespanel,
  createpatternmodal: createpatternmodal,
  createpatternmodalcontents: createpatternmodalcontents,
  duplicatepatternmodal: duplicatepatternmodal,
  isoverridableblock: isoverridableblock,
  hasoverridableblocks: hasoverridableblocks,
  useduplicatepatternprops: useduplicatepatternprops,
  renamepatternmodal: renamepatternmodal,
  patternsmenuitems: patternsmenuitems,
  renamepatterncategorymodal: renamepatterncategorymodal,
  patternoverridescontrols: pattern_overrides_controls_default,
  resetoverridescontrol: resetoverridescontrol,
  patternoverridesblockcontrols: patternoverridesblockcontrols,
  useaddpatterncategory: useaddpatterncategory,
  pattern_types: pattern_types,
  pattern_default_category: pattern_default_category,
  pattern_user_category: pattern_user_category,
  excluded_pattern_sources: excluded_pattern_sources,
  pattern_sync_types: pattern_sync_types,
  partial_syncing_supported_blocks: partial_syncing_supported_blocks
});


;// ./node_modules/@wordpress/patterns/build-module/index.js




(window.wp = window.wp || {}).patterns = __webpack_exports__;
/******/ })()
;





