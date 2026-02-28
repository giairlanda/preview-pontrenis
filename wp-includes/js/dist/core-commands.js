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
  initializecommandpalette: () => (/* binding */ initializecommandpalette),
  privateapis: () => (/* reexport */ privateapis)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","router"]
const external_wp_router_namespaceobject = window["wp"]["router"];
;// external ["wp","commands"]
const external_wp_commands_namespaceobject = window["wp"]["commands"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/external.js


var external_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m19.5 4.5h-7v6h4.44l-5.97 5.97 1.06 1.06l18 7.06v4.44h1.5v-7zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3h17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3v5.5h-3z" }) });


;// external ["wp","coredata"]
const external_wp_coredata_namespaceobject = window["wp"]["coredata"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/core-commands/build-module/admin-navigation-commands.js






const getviewsitecommand = () => function useviewsitecommand() {
  const homeurl = (0,external_wp_data_namespaceobject.useselect)((select) => {
    return select(external_wp_coredata_namespaceobject.store).getentityrecord(
      "root",
      "__unstablebase"
    )?.home;
  }, []);
  const commands = (0,external_wp_element_namespaceobject.usememo)(() => {
    if (!homeurl) {
      return [];
    }
    return [
      {
        name: "core/view-site",
        label: (0,external_wp_i18n_namespaceobject.__)("view site"),
        icon: external_default,
        callback: ({ close }) => {
          close();
          window.open(homeurl, "_blank");
        }
      }
    ];
  }, [homeurl]);
  return {
    isloading: false,
    commands
  };
};
function useadminnavigationcommands(menucommands) {
  const commands = (0,external_wp_element_namespaceobject.usememo)(() => {
    return (menucommands ?? []).map((menucommand) => {
      const label = (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: menu label */
        (0,external_wp_i18n_namespaceobject.__)("go to: %s"),
        menucommand.label
      );
      return {
        name: menucommand.name,
        label,
        searchlabel: label,
        callback: ({ close }) => {
          document.location = menucommand.url;
          close();
        }
      };
    });
  }, [menucommands]);
  (0,external_wp_commands_namespaceobject.usecommands)(commands);
  (0,external_wp_commands_namespaceobject.usecommandloader)({
    name: "core/view-site",
    hook: getviewsitecommand()
  });
}


;// ./node_modules/@wordpress/icons/build-module/library/post.js


var post_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m7.3 9.7 1.4 1.4c.2-.2.3-.3.4-.5 0 0 0-.1.1-.1.3-.5.4-1.1.3-1.6l12 7 9 4 7.2 6.5c-.6-.1-1.1 0-1.6.3 0 0-.1 0-.1.1-.3.1-.4.2-.6.4l1.4 1.4l4 11v1h1l2.3-2.3zm4 20h9v-1.5h4v20zm0-5.5v16h16v-1.5h4z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/page.js


var page_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: [
  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m15.5 7.5h-7v9h7v7.5zm-7 3.5h7v1.5h-7v11zm7 3.5h-7v16h7v-1.5z" }),
  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m17 4h7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v6a2 2 0 0 0-2-2zm7 5.5h10a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h7a.5.5 0 0 1-.5-.5v6a.5.5 0 0 1 .5-.5z" })
] });


;// ./node_modules/@wordpress/icons/build-module/library/layout.js


var layout_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m18 5.5h6a.5.5 0 00-.5.5v3h13v6a.5.5 0 00-.5-.5zm.5 5h10v8h8a.5.5 0 00.5-.5v-7.5zm-10 0h-3v18a.5.5 0 00.5.5h2.5v-8zm6 4h12a2 2 0 012 2v12a2 2 0 01-2 2h6a2 2 0 01-2-2v6a2 2 0 012-2z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/symbol-filled.js


var symbol_filled_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m21.3 10.8l-5.6-5.6c-.7-.7-1.8-.7-2.5 0l-5.6 5.6c-.7.7-.7 1.8 0 2.5l5.6 5.6c.3.3.8.5 1.2.5s.9-.2 1.2-.5l5.6-5.6c.8-.7.8-1.9.1-2.5zm-17.6 1l10 5.5l-1-1-6.3 6.3c-.7.7-.7 1.8 0 2.5l9 19.5l1.1-1.1-6.3-6.3c-.2 0-.2-.2-.1-.3z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/styles.js


var styles_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
  external_wp_primitives_namespaceobject.path,
  {
    fillrule: "evenodd",
    cliprule: "evenodd",
    d: "m20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-1.5 0a6.5 6.5 0 0 1-6.5 6.5v-13a6.5 6.5 0 0 1 6.5 6.5z"
  }
) });


;// ./node_modules/@wordpress/icons/build-module/library/navigation.js


var navigation_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.5c-3.6 0-6.5-2.9-6.5-6.5s8.4 5.5 12 5.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5zm9 16l4.5-3l15 8.4l-4.5 3l9 16z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/symbol.js


var symbol_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m21.3 10.8l-5.6-5.6c-.7-.7-1.8-.7-2.5 0l-5.6 5.6c-.7.7-.7 1.8 0 2.5l5.6 5.6c.3.3.8.5 1.2.5s.9-.2 1.2-.5l5.6-5.6c.8-.7.8-1.9.1-2.5zm-1 1.4l-5.6 5.6c-.1.1-.3.1-.4 0l-5.6-5.6c-.1-.1-.1-.3 0-.4l5.6-5.6s.1-.1.2-.1.1 0 .2.1l5.6 5.6c.1.1.1.3 0 .4zm-16.6-.4l10 5.5l-1-1-6.3 6.3c-.7.7-.7 1.8 0 2.5l9 19.5l1.1-1.1-6.3-6.3c-.2 0-.2-.2-.1-.3z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/brush.js


var brush_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m4 20h8v-1.5h4v20zm18.9 3.5c-.6-.6-1.5-.6-2.1 0l-7.2 7.2c-.4-.1-.7 0-1.1.1-.5.2-1.5.7-1.9 2.2-.4 1.7-.8 2.2-1.1 2.7-.1.1-.2.3-.3.4l-.6 1.1h6c2 0 3.4-.4 4.7-1.4.8-.6 1.2-1.4 1.3-2.3 0-.3 0-.5-.1-.7l19 5.7c.5-.6.5-1.6-.1-2.2zm9.7 14.7c-.7.5-1.5.8-2.4 1 .2-.5.5-1.2.8-2.3.2-.6.4-1 .8-1.1.5-.1 1 .1 1.3.3.2.2.3.5.2.8 0 .3-.1.9-.7 1.3z" }) });


;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","htmlentities"]
const external_wp_htmlentities_namespaceobject = window["wp"]["htmlentities"];
;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/core-commands/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/core-commands"
);


;// ./node_modules/@wordpress/core-commands/build-module/utils/order-entity-records-by-search.js
function orderentityrecordsbysearch(records = [], search = "") {
  if (!array.isarray(records) || !records.length) {
    return [];
  }
  if (!search) {
    return records;
  }
  const priority = [];
  const nonpriority = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (record?.title?.raw?.tolowercase()?.includes(search?.tolowercase())) {
      priority.push(record);
    } else {
      nonpriority.push(record);
    }
  }
  return priority.concat(nonpriority);
}


;// ./node_modules/@wordpress/core-commands/build-module/site-editor-navigation-commands.js












const { usehistory } = unlock(external_wp_router_namespaceobject.privateapis);
const icons = {
  post: post_default,
  page: page_default,
  wp_template: layout_default,
  wp_template_part: symbol_filled_default
};
function usedebouncedvalue(value) {
  const [debouncedvalue, setdebouncedvalue] = (0,external_wp_element_namespaceobject.usestate)("");
  const debounced = (0,external_wp_compose_namespaceobject.usedebounce)(setdebouncedvalue, 250);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    debounced(value);
    return () => debounced.cancel();
  }, [debounced, value]);
  return debouncedvalue;
}
const getnavigationcommandloaderperposttype = (posttype) => function usenavigationcommandloader({ search }) {
  const history = usehistory();
  const { isblockbasedtheme, cancreatetemplate } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      return {
        isblockbasedtheme: select(external_wp_coredata_namespaceobject.store).getcurrenttheme()?.is_block_theme,
        cancreatetemplate: select(external_wp_coredata_namespaceobject.store).canuser("create", {
          kind: "posttype",
          name: "wp_template"
        })
      };
    },
    []
  );
  const delayedsearch = usedebouncedvalue(search);
  const { records, isloading } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      if (!delayedsearch) {
        return {
          isloading: false
        };
      }
      const query = {
        search: delayedsearch,
        per_page: 10,
        orderby: "relevance",
        status: [
          "publish",
          "future",
          "draft",
          "pending",
          "private"
        ]
      };
      return {
        records: select(external_wp_coredata_namespaceobject.store).getentityrecords(
          "posttype",
          posttype,
          query
        ),
        isloading: !select(external_wp_coredata_namespaceobject.store).hasfinishedresolution(
          "getentityrecords",
          ["posttype", posttype, query]
        )
      };
    },
    [delayedsearch]
  );
  const commands = (0,external_wp_element_namespaceobject.usememo)(() => {
    return (records ?? []).map((record) => {
      const command = {
        name: posttype + "-" + record.id,
        searchlabel: record.title?.rendered + " " + record.id,
        label: record.title?.rendered ? (0,external_wp_htmlentities_namespaceobject.decodeentities)(record.title?.rendered) : (0,external_wp_i18n_namespaceobject.__)("(no title)"),
        icon: icons[posttype]
      };
      if (!cancreatetemplate || posttype === "post" || posttype === "page" && !isblockbasedtheme) {
        return {
          ...command,
          callback: ({ close }) => {
            const args = {
              post: record.id,
              action: "edit"
            };
            const targeturl = (0,external_wp_url_namespaceobject.addqueryargs)("post.php", args);
            document.location = targeturl;
            close();
          }
        };
      }
      const issiteeditor = (0,external_wp_url_namespaceobject.getpath)(window.location.href)?.includes(
        "site-editor.php"
      );
      return {
        ...command,
        callback: ({ close }) => {
          if (issiteeditor) {
            history.navigate(
              `/${posttype}/${record.id}?canvas=edit`
            );
          } else {
            document.location = (0,external_wp_url_namespaceobject.addqueryargs)(
              "site-editor.php",
              {
                p: `/${posttype}/${record.id}`,
                canvas: "edit"
              }
            );
          }
          close();
        }
      };
    });
  }, [cancreatetemplate, records, isblockbasedtheme, history]);
  return {
    commands,
    isloading
  };
};
const getnavigationcommandloaderpertemplate = (templatetype) => function usenavigationcommandloader({ search }) {
  const history = usehistory();
  const { isblockbasedtheme, cancreatetemplate } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      return {
        isblockbasedtheme: select(external_wp_coredata_namespaceobject.store).getcurrenttheme()?.is_block_theme,
        cancreatetemplate: select(external_wp_coredata_namespaceobject.store).canuser("create", {
          kind: "posttype",
          name: templatetype
        })
      };
    },
    []
  );
  const { records, isloading } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { getentityrecords } = select(external_wp_coredata_namespaceobject.store);
    const query = { per_page: -1 };
    return {
      records: getentityrecords("posttype", templatetype, query),
      isloading: !select(external_wp_coredata_namespaceobject.store).hasfinishedresolution(
        "getentityrecords",
        ["posttype", templatetype, query]
      )
    };
  }, []);
  const orderedrecords = (0,external_wp_element_namespaceobject.usememo)(() => {
    return orderentityrecordsbysearch(records, search).slice(0, 10);
  }, [records, search]);
  const commands = (0,external_wp_element_namespaceobject.usememo)(() => {
    if (!cancreatetemplate || !isblockbasedtheme && !templatetype === "wp_template_part") {
      return [];
    }
    const issiteeditor = (0,external_wp_url_namespaceobject.getpath)(window.location.href)?.includes(
      "site-editor.php"
    );
    const result = [];
    result.push(
      ...orderedrecords.map((record) => {
        return {
          name: templatetype + "-" + record.id,
          searchlabel: record.title?.rendered + " " + record.id,
          label: record.title?.rendered ? record.title?.rendered : (0,external_wp_i18n_namespaceobject.__)("(no title)"),
          icon: icons[templatetype],
          callback: ({ close }) => {
            if (issiteeditor) {
              history.navigate(
                `/${templatetype}/${record.id}?canvas=edit`
              );
            } else {
              document.location = (0,external_wp_url_namespaceobject.addqueryargs)(
                "site-editor.php",
                {
                  p: `/${templatetype}/${record.id}`,
                  canvas: "edit"
                }
              );
            }
            close();
          }
        };
      })
    );
    if (orderedrecords?.length > 0 && templatetype === "wp_template_part") {
      result.push({
        name: "core/edit-site/open-template-parts",
        label: (0,external_wp_i18n_namespaceobject.__)("go to: template parts"),
        icon: symbol_filled_default,
        callback: ({ close }) => {
          if (issiteeditor) {
            history.navigate(
              "/pattern?posttype=wp_template_part&categoryid=all-parts"
            );
          } else {
            document.location = (0,external_wp_url_namespaceobject.addqueryargs)(
              "site-editor.php",
              {
                p: "/pattern",
                posttype: "wp_template_part",
                categoryid: "all-parts"
              }
            );
          }
          close();
        }
      });
    }
    return result;
  }, [cancreatetemplate, isblockbasedtheme, orderedrecords, history]);
  return {
    commands,
    isloading
  };
};
const getsiteeditorbasicnavigationcommands = () => function usesiteeditorbasicnavigationcommands() {
  const history = usehistory();
  const issiteeditor = (0,external_wp_url_namespaceobject.getpath)(window.location.href)?.includes(
    "site-editor.php"
  );
  const { isblockbasedtheme, cancreatetemplate, cancreatepatterns } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    return {
      isblockbasedtheme: select(external_wp_coredata_namespaceobject.store).getcurrenttheme()?.is_block_theme,
      cancreatetemplate: select(external_wp_coredata_namespaceobject.store).canuser("create", {
        kind: "posttype",
        name: "wp_template"
      }),
      cancreatepatterns: select(external_wp_coredata_namespaceobject.store).canuser("create", {
        kind: "posttype",
        name: "wp_block"
      })
    };
  }, []);
  const commands = (0,external_wp_element_namespaceobject.usememo)(() => {
    const result = [];
    if (cancreatetemplate && isblockbasedtheme) {
      result.push({
        name: "core/edit-site/open-styles",
        label: (0,external_wp_i18n_namespaceobject.__)("go to: styles"),
        icon: styles_default,
        callback: ({ close }) => {
          if (issiteeditor) {
            history.navigate("/styles");
          } else {
            document.location = (0,external_wp_url_namespaceobject.addqueryargs)(
              "site-editor.php",
              {
                p: "/styles"
              }
            );
          }
          close();
        }
      });
      result.push({
        name: "core/edit-site/open-navigation",
        label: (0,external_wp_i18n_namespaceobject.__)("go to: navigation"),
        icon: navigation_default,
        callback: ({ close }) => {
          if (issiteeditor) {
            history.navigate("/navigation");
          } else {
            document.location = (0,external_wp_url_namespaceobject.addqueryargs)(
              "site-editor.php",
              {
                p: "/navigation"
              }
            );
          }
          close();
        }
      });
      result.push({
        name: "core/edit-site/open-templates",
        label: (0,external_wp_i18n_namespaceobject.__)("go to: templates"),
        icon: layout_default,
        callback: ({ close }) => {
          if (issiteeditor) {
            history.navigate("/template");
          } else {
            document.location = (0,external_wp_url_namespaceobject.addqueryargs)(
              "site-editor.php",
              {
                p: "/template"
              }
            );
          }
          close();
        }
      });
    }
    if (cancreatepatterns) {
      result.push({
        name: "core/edit-site/open-patterns",
        label: (0,external_wp_i18n_namespaceobject.__)("go to: patterns"),
        icon: symbol_default,
        callback: ({ close }) => {
          if (cancreatetemplate) {
            if (issiteeditor) {
              history.navigate("/pattern");
            } else {
              document.location = (0,external_wp_url_namespaceobject.addqueryargs)(
                "site-editor.php",
                {
                  p: "/pattern"
                }
              );
            }
            close();
          } else {
            document.location.href = "edit.php?post_type=wp_block";
          }
        }
      });
    }
    return result;
  }, [
    history,
    issiteeditor,
    cancreatetemplate,
    cancreatepatterns,
    isblockbasedtheme
  ]);
  return {
    commands,
    isloading: false
  };
};
const getglobalstylesopencsscommands = () => function useglobalstylesopencsscommands() {
  const history = usehistory();
  const issiteeditor = (0,external_wp_url_namespaceobject.getpath)(window.location.href)?.includes(
    "site-editor.php"
  );
  const { caneditcss } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { getentityrecord, __experimentalgetcurrentglobalstylesid } = select(external_wp_coredata_namespaceobject.store);
    const globalstylesid = __experimentalgetcurrentglobalstylesid();
    const globalstyles = globalstylesid ? getentityrecord("root", "globalstyles", globalstylesid) : void 0;
    return {
      caneditcss: !!globalstyles?._links?.["wp:action-edit-css"]
    };
  }, []);
  const commands = (0,external_wp_element_namespaceobject.usememo)(() => {
    if (!caneditcss) {
      return [];
    }
    return [
      {
        name: "core/open-styles-css",
        label: (0,external_wp_i18n_namespaceobject.__)("open custom css"),
        icon: brush_default,
        callback: ({ close }) => {
          close();
          if (issiteeditor) {
            history.navigate("/styles?section=/css");
          } else {
            document.location = (0,external_wp_url_namespaceobject.addqueryargs)(
              "site-editor.php",
              {
                p: "/styles",
                section: "/css"
              }
            );
          }
        }
      }
    ];
  }, [history, caneditcss, issiteeditor]);
  return {
    isloading: false,
    commands
  };
};
function usesiteeditornavigationcommands(isnetworkadmin) {
  (0,external_wp_commands_namespaceobject.usecommandloader)({
    name: "core/edit-site/navigate-pages",
    hook: getnavigationcommandloaderperposttype("page"),
    disabled: isnetworkadmin
  });
  (0,external_wp_commands_namespaceobject.usecommandloader)({
    name: "core/edit-site/navigate-posts",
    hook: getnavigationcommandloaderperposttype("post"),
    disabled: isnetworkadmin
  });
  (0,external_wp_commands_namespaceobject.usecommandloader)({
    name: "core/edit-site/navigate-templates",
    hook: getnavigationcommandloaderpertemplate("wp_template"),
    disabled: isnetworkadmin
  });
  (0,external_wp_commands_namespaceobject.usecommandloader)({
    name: "core/edit-site/navigate-template-parts",
    hook: getnavigationcommandloaderpertemplate("wp_template_part"),
    disabled: isnetworkadmin
  });
  (0,external_wp_commands_namespaceobject.usecommandloader)({
    name: "core/edit-site/basic-navigation",
    hook: getsiteeditorbasicnavigationcommands(),
    context: "site-editor",
    disabled: isnetworkadmin
  });
  (0,external_wp_commands_namespaceobject.usecommandloader)({
    name: "core/edit-site/global-styles-css",
    hook: getglobalstylesopencsscommands(),
    disabled: isnetworkadmin
  });
}


;// ./node_modules/@wordpress/core-commands/build-module/private-apis.js



function usecommands() {
  useadminnavigationcommands();
  usesiteeditornavigationcommands();
}
const privateapis = {};
lock(privateapis, {
  usecommands
});


;// ./node_modules/@wordpress/core-commands/build-module/index.js








const { routerprovider } = unlock(external_wp_router_namespaceobject.privateapis);
function commandpalette({ settings }) {
  const { menu_commands: menucommands, is_network_admin: isnetworkadmin } = settings;
  useadminnavigationcommands(menucommands);
  usesiteeditornavigationcommands(isnetworkadmin);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(routerprovider, { patharg: "p", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_commands_namespaceobject.commandmenu, {}) });
}
function initializecommandpalette(settings) {
  const root = document.createelement("div");
  document.body.appendchild(root);
  (0,external_wp_element_namespaceobject.createroot)(root).render(
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.strictmode, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(commandpalette, { settings }) })
  );
}


(window.wp = window.wp || {}).corecommands = __webpack_exports__;
/******/ })()
;







