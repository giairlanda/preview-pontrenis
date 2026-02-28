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
/************************************************************************/
var __webpack_exports__ = {};

// exports
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ index_default)
});

// unused exports: serversiderender, useserversiderender

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","apifetch"]
const external_wp_apifetch_namespaceobject = window["wp"]["apifetch"];
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_namespaceobject);
;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// external ["wp","blocks"]
const external_wp_blocks_namespaceobject = window["wp"]["blocks"];
;// ./node_modules/@wordpress/server-side-render/build-module/hook.js





function rendererpath(block, attributes = null, urlqueryargs = {}) {
  return (0,external_wp_url_namespaceobject.addqueryargs)(`/wp/v2/block-renderer/${block}`, {
    context: "edit",
    ...null !== attributes ? { attributes } : {},
    ...urlqueryargs
  });
}
function removeblocksupportattributes(attributes) {
  const {
    backgroundcolor,
    bordercolor,
    fontfamily,
    fontsize,
    gradient,
    textcolor,
    classname,
    ...restattributes
  } = attributes;
  const {
    border,
    color,
    elements,
    shadow,
    spacing,
    typography,
    ...reststyles
  } = attributes?.style || {};
  return {
    ...restattributes,
    style: reststyles
  };
}
function useserversiderender(args) {
  const [response, setresponse] = (0,external_wp_element_namespaceobject.usestate)({ status: "idle" });
  const shoulddebounceref = (0,external_wp_element_namespaceobject.useref)(false);
  const {
    attributes,
    block,
    skipblocksupportattributes = false,
    httpmethod = "get",
    urlqueryargs
  } = args;
  let sanitizedattributes = attributes && (0,external_wp_blocks_namespaceobject.__experimentalsanitizeblockattributes)(block, attributes);
  if (skipblocksupportattributes) {
    sanitizedattributes = removeblocksupportattributes(sanitizedattributes);
  }
  const ispostrequest = "post" === httpmethod;
  const urlattributes = ispostrequest ? null : sanitizedattributes;
  const path = rendererpath(block, urlattributes, urlqueryargs);
  const body = ispostrequest ? json.stringify({ attributes: sanitizedattributes ?? null }) : void 0;
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const controller = new abortcontroller();
    const debouncedfetch = (0,external_wp_compose_namespaceobject.debounce)(
      function() {
        {
          setresponse({ status: "loading" });
          external_wp_apifetch_default()({
            path,
            method: ispostrequest ? "post" : "get",
            body,
            headers: ispostrequest ? {
              "content-type": "application/json"
            } : {},
            signal: controller.signal
          }).then((res) => {
            setresponse({
              status: "success",
              content: res ? res.rendered : ""
            });
          }).catch((error) => {
            if (error.name === "aborterror") {
              return;
            }
            setresponse({
              status: "error",
              error: error.message
            });
          }).finally(() => {
            shoulddebounceref.current = true;
          });
        }
      },
      shoulddebounceref.current ? 500 : 0
    );
    debouncedfetch();
    return () => {
      controller.abort();
      debouncedfetch.cancel();
    };
  }, [path, ispostrequest, body]);
  return response;
}


;// ./node_modules/@wordpress/server-side-render/build-module/server-side-render.js






const empty_object = {};
function defaultemptyresponseplaceholder({ classname }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.placeholder, { classname, children: (0,external_wp_i18n_namespaceobject.__)("block rendered as empty.") });
}
function defaulterrorresponseplaceholder({ message, classname }) {
  const errormessage = (0,external_wp_i18n_namespaceobject.sprintf)(
    // translators: %s: error message describing the problem
    (0,external_wp_i18n_namespaceobject.__)("error loading block: %s"),
    message
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.placeholder, { classname, children: errormessage });
}
function defaultloadingresponseplaceholder({ children }) {
  const [showloader, setshowloader] = (0,external_wp_element_namespaceobject.usestate)(false);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const timeout = settimeout(() => {
      setshowloader(true);
    }, 1e3);
    return () => cleartimeout(timeout);
  }, []);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { style: { position: "relative" }, children: [
    showloader && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      "div",
      {
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          margintop: "-9px",
          marginleft: "-9px"
        },
        children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.spinner, {})
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { style: { opacity: showloader ? "0.3" : 1 }, children })
  ] });
}
function serversiderender(props) {
  const prevcontentref = (0,external_wp_element_namespaceobject.useref)("");
  const {
    classname,
    emptyresponseplaceholder = defaultemptyresponseplaceholder,
    errorresponseplaceholder = defaulterrorresponseplaceholder,
    loadingresponseplaceholder = defaultloadingresponseplaceholder,
    ...restprops
  } = props;
  const { content, status, error } = useserversiderender(restprops);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (content) {
      prevcontentref.current = content;
    }
  }, [content]);
  if (status === "loading") {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(loadingresponseplaceholder, { ...props, children: !!prevcontentref.current && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.rawhtml, { classname, children: prevcontentref.current }) });
  }
  if (status === "success" && !content) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(emptyresponseplaceholder, { ...props });
  }
  if (status === "error") {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(errorresponseplaceholder, { message: error, ...props });
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.rawhtml, { classname, children: content });
}
function serversiderenderwithpostid({
  urlqueryargs = empty_object,
  ...props
}) {
  const currentpostid = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const postid = select("core/editor")?.getcurrentpostid();
    return postid && typeof postid === "number" ? postid : null;
  }, []);
  const newurlqueryargs = (0,external_wp_element_namespaceobject.usememo)(() => {
    if (!currentpostid) {
      return urlqueryargs;
    }
    return {
      post_id: currentpostid,
      ...urlqueryargs
    };
  }, [currentpostid, urlqueryargs]);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(serversiderender, { urlqueryargs: newurlqueryargs, ...props });
}


;// ./node_modules/@wordpress/server-side-render/build-module/index.js


const serversiderendercompat = serversiderenderwithpostid;
serversiderendercompat.serversiderender = serversiderenderwithpostid;
serversiderendercompat.useserversiderender = useserversiderender;
var index_default = serversiderendercompat;


(window.wp = window.wp || {}).serversiderender = __webpack_exports__["default"];
/******/ })()
;

