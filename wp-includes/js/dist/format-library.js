/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3533:
/***/ ((module) => {

module.exports = window["wp"]["latextomathml"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// the module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// the require function
/******/ 	function __webpack_require__(moduleid) {
/******/ 		// check if module is in cache
/******/ 		var cachedmodule = __webpack_module_cache__[moduleid];
/******/ 		if (cachedmodule !== undefined) {
/******/ 			return cachedmodule.exports;
/******/ 		}
/******/ 		// create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleid] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// execute the module function
/******/ 		__webpack_modules__[moduleid](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getproto = object.getprototypeof ? (obj) => (object.getprototypeof(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafprototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esmodule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafprototypes = leafprototypes || [null, getproto({}), getproto([]), getproto(getproto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafprototypes.indexof(current); current = getproto(current)) {
/******/ 				object.getownpropertynames(current).foreach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
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

;// external ["wp","richtext"]
const external_wp_richtext_namespaceobject = window["wp"]["richtext"];
;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","blockeditor"]
const external_wp_blockeditor_namespaceobject = window["wp"]["blockeditor"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/format-bold.js


var format_bold_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m14.7 11.3c1-.6 1.5-1.6 1.5-3 0-2.3-1.3-3.4-4-3.4h7v14h5.8c1.4 0 2.5-.3 3.3-1 .8-.7 1.2-1.7 1.2-2.9.1-1.9-.8-3.1-2.6-3.7zm-5.1-4h2.3c.6 0 1.1.1 1.4.4.3.3.5.7.5 1.2s-.2 1-.5 1.2c-.3.3-.8.4-1.4.4h9.6v7.3zm4.6 9c-.4.3-1 .4-1.7.4h9.6v-3.9h2.9c.7 0 1.3.2 1.7.5.4.3.6.8.6 1.5s-.2 1.2-.6 1.5z" }) });


;// ./node_modules/@wordpress/format-library/build-module/bold/index.js





const bold_name = "core/bold";
const title = (0,external_wp_i18n_namespaceobject.__)("bold");
const bold = {
  name: bold_name,
  title,
  tagname: "strong",
  classname: null,
  edit({ isactive, value, onchange, onfocus }) {
    function ontoggle() {
      onchange((0,external_wp_richtext_namespaceobject.toggleformat)(value, { type: bold_name, title }));
    }
    function onclick() {
      onchange((0,external_wp_richtext_namespaceobject.toggleformat)(value, { type: bold_name }));
      onfocus();
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtextshortcut,
        {
          type: "primary",
          character: "b",
          onuse: ontoggle
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
        {
          name: "bold",
          icon: format_bold_default,
          title,
          onclick,
          isactive,
          shortcuttype: "primary",
          shortcutcharacter: "b"
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.__unstablerichtextinputevent,
        {
          inputtype: "formatbold",
          oninput: ontoggle
        }
      )
    ] });
  }
};


;// ./node_modules/@wordpress/icons/build-module/library/code.js


var code_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m20.8 10.7l-4.3-4.3-1.1 1.1 4.3 4.3c.1.1.1.3 0 .4l-4.3 4.3 1.1 1.1 4.3-4.3c.7-.8.7-1.9 0-2.6zm4.2 11.8l4.3-4.3-1-1-4.3 4.3c-.7.7-.7 1.8 0 2.5l4.3 4.3 1.1-1.1-4.3-4.3c-.2-.1-.2-.3-.1-.4z" }) });


;// ./node_modules/@wordpress/format-library/build-module/code/index.js





const code_name = "core/code";
const code_title = (0,external_wp_i18n_namespaceobject.__)("inline code");
const code = {
  name: code_name,
  title: code_title,
  tagname: "code",
  classname: null,
  __unstableinputrule(value) {
    const backtick = "`";
    const { start, text } = value;
    const characterbefore = text[start - 1];
    if (characterbefore !== backtick) {
      return value;
    }
    if (start - 2 < 0) {
      return value;
    }
    const indexbefore = text.lastindexof(backtick, start - 2);
    if (indexbefore === -1) {
      return value;
    }
    const startindex = indexbefore;
    const endindex = start - 2;
    if (startindex === endindex) {
      return value;
    }
    value = (0,external_wp_richtext_namespaceobject.remove)(value, startindex, startindex + 1);
    value = (0,external_wp_richtext_namespaceobject.remove)(value, endindex, endindex + 1);
    value = (0,external_wp_richtext_namespaceobject.applyformat)(value, { type: code_name }, startindex, endindex);
    return value;
  },
  edit({ value, onchange, onfocus, isactive }) {
    function onclick() {
      onchange((0,external_wp_richtext_namespaceobject.toggleformat)(value, { type: code_name, title: code_title }));
      onfocus();
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtextshortcut,
        {
          type: "access",
          character: "x",
          onuse: onclick
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
        {
          icon: code_default,
          title: code_title,
          onclick,
          isactive,
          role: "menuitemcheckbox"
        }
      )
    ] });
  }
};


;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// ./node_modules/@wordpress/format-library/build-module/image/index.js






const allowed_media_types = ["image"];
const image_name = "core/image";
const image_title = (0,external_wp_i18n_namespaceobject.__)("inline image");
function getcurrentimageid(activeobjectattributes) {
  if (!activeobjectattributes?.classname) {
    return void 0;
  }
  const [, id] = activeobjectattributes.classname.match(/wp-image-(\d+)/) ?? [];
  return id ? parseint(id, 10) : void 0;
}
const image_image = {
  name: image_name,
  title: image_title,
  keywords: [(0,external_wp_i18n_namespaceobject.__)("photo"), (0,external_wp_i18n_namespaceobject.__)("media")],
  object: true,
  tagname: "img",
  classname: null,
  attributes: {
    classname: "class",
    style: "style",
    url: "src",
    alt: "alt"
  },
  edit: edit
};
function inlineui({ value, onchange, activeobjectattributes, contentref }) {
  const { style, alt } = activeobjectattributes;
  const width = style?.replace(/\d/g, "");
  const [editedwidth, seteditedwidth] = (0,external_wp_element_namespaceobject.usestate)(width);
  const [editedalt, seteditedalt] = (0,external_wp_element_namespaceobject.usestate)(alt);
  const haschanged = editedwidth !== width || editedalt !== alt;
  const popoveranchor = (0,external_wp_richtext_namespaceobject.useanchor)({
    editablecontentelement: contentref.current,
    settings: image_image
  });
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.popover,
    {
      placement: "bottom",
      focusonmount: false,
      anchor: popoveranchor,
      classname: "block-editor-format-toolbar__image-popover",
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "form",
        {
          classname: "block-editor-format-toolbar__image-container-content",
          onsubmit: (event) => {
            const newreplacements = value.replacements.slice();
            newreplacements[value.start] = {
              type: image_name,
              attributes: {
                ...activeobjectattributes,
                style: editedwidth ? `width: ${editedwidth}px;` : "",
                alt: editedalt
              }
            };
            onchange({
              ...value,
              replacements: newreplacements
            });
            event.preventdefault();
          },
          children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: 4, children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.__experimentalnumbercontrol,
              {
                __next40pxdefaultsize: true,
                label: (0,external_wp_i18n_namespaceobject.__)("width"),
                value: editedwidth,
                min: 1,
                onchange: (newwidth) => {
                  seteditedwidth(newwidth);
                }
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.textareacontrol,
              {
                label: (0,external_wp_i18n_namespaceobject.__)("alternative text"),
                __nexthasnomarginbottom: true,
                value: editedalt,
                onchange: (newalt) => {
                  seteditedalt(newalt);
                },
                help: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
                  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                    external_wp_components_namespaceobject.externallink,
                    {
                      href: (
                        // translators: localized tutorial, if one exists. w3c web accessibility initiative link has list of existing translations.
                        (0,external_wp_i18n_namespaceobject.__)(
                          "https://www.w3.org/wai/tutorials/images/decision-tree/"
                        )
                      ),
                      children: (0,external_wp_i18n_namespaceobject.__)(
                        "describe the purpose of the image."
                      )
                    }
                  ),
                  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("br", {}),
                  (0,external_wp_i18n_namespaceobject.__)("leave empty if decorative.")
                ] })
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentalhstack, { justify: "right", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.button,
              {
                disabled: !haschanged,
                accessiblewhendisabled: true,
                variant: "primary",
                type: "submit",
                size: "compact",
                children: (0,external_wp_i18n_namespaceobject.__)("apply")
              }
            ) })
          ] })
        }
      )
    }
  );
}
function edit({
  value,
  onchange,
  onfocus,
  isobjectactive,
  activeobjectattributes,
  contentref
}) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_blockeditor_namespaceobject.mediauploadcheck, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.mediaupload,
      {
        allowedtypes: allowed_media_types,
        value: getcurrentimageid(activeobjectattributes),
        onselect: ({ id, url, alt, width: imgwidth }) => {
          onchange(
            (0,external_wp_richtext_namespaceobject.insertobject)(value, {
              type: image_name,
              attributes: {
                classname: `wp-image-${id}`,
                style: `width: ${math.min(
                  imgwidth,
                  150
                )}px;`,
                url,
                alt
              }
            })
          );
          onfocus();
        },
        render: ({ open }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
          {
            icon: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.svg,
              {
                xmlns: "http://www.w3.org/2000/svg",
                viewbox: "0 0 24 24",
                children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.path, { d: "m4 18.5h16v17h4v1.5zm16 13v1.5h4v13h-4zm5.1 15h7.8c.6 0 1.1-.5 1.1-1.1v6.1c0-.6-.5-1.1-1.1-1.1h5.1c4.5 5 4 5.5 4 6.1v7.8c0 .6.5 1.1 1.1 1.1zm.4-8.5h7v10l-1-1c-.3-.3-.8-.3-1 0l-1.6 1.5-1.2-.7c-.3-.2-.6-.2-.9 0l-1.3 1v6.5zm0 6.1l1.8-1.3 1.3.8c.3.2.7.2.9-.1l1.5-1.4 1.5 1.4v1.5h-7v-.9z" })
              }
            ),
            title: isobjectactive ? (0,external_wp_i18n_namespaceobject.__)("replace image") : image_title,
            onclick: open,
            isactive: isobjectactive
          }
        )
      }
    ),
    isobjectactive && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      inlineui,
      {
        value,
        onchange,
        activeobjectattributes,
        contentref
      }
    )
  ] });
}


;// ./node_modules/@wordpress/icons/build-module/library/format-italic.js


var format_italic_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m12.5 5l10 19h1.9l2.5-14z" }) });


;// ./node_modules/@wordpress/format-library/build-module/italic/index.js





const italic_name = "core/italic";
const italic_title = (0,external_wp_i18n_namespaceobject.__)("italic");
const italic = {
  name: italic_name,
  title: italic_title,
  tagname: "em",
  classname: null,
  edit({ isactive, value, onchange, onfocus }) {
    function ontoggle() {
      onchange((0,external_wp_richtext_namespaceobject.toggleformat)(value, { type: italic_name, title: italic_title }));
    }
    function onclick() {
      onchange((0,external_wp_richtext_namespaceobject.toggleformat)(value, { type: italic_name }));
      onfocus();
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtextshortcut,
        {
          type: "primary",
          character: "i",
          onuse: ontoggle
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
        {
          name: "italic",
          icon: format_italic_default,
          title: italic_title,
          onclick,
          isactive,
          shortcuttype: "primary",
          shortcutcharacter: "i"
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.__unstablerichtextinputevent,
        {
          inputtype: "formatitalic",
          oninput: ontoggle
        }
      )
    ] });
  }
};


;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// external ["wp","htmlentities"]
const external_wp_htmlentities_namespaceobject = window["wp"]["htmlentities"];
;// ./node_modules/@wordpress/icons/build-module/library/link.js


var link_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m10 17.389h8.444a5.194 5.194 0 1 1 8.444 7h10v1.5h8.444a3.694 3.694 0 0 0 0 7.389h10v1.5zm14 7h1.556a5.194 5.194 0 0 1 0 10.39h14v-1.5h1.556a3.694 3.694 0 0 0 0-7.39h14v7zm-4.5 6h5v-1.5h-5v13z" }) });


;// external ["wp","a11y"]
const external_wp_a11y_namespaceobject = window["wp"]["a11y"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/format-library/build-module/link/utils.js

function isvalidhref(href) {
  if (!href) {
    return false;
  }
  const trimmedhref = href.trim();
  if (!trimmedhref) {
    return false;
  }
  if (/^\s+:/.test(trimmedhref)) {
    const protocol = (0,external_wp_url_namespaceobject.getprotocol)(trimmedhref);
    if (!(0,external_wp_url_namespaceobject.isvalidprotocol)(protocol)) {
      return false;
    }
    if (protocol.startswith("http") && !/^https?:\/\/[^\/\s]/i.test(trimmedhref)) {
      return false;
    }
    const authority = (0,external_wp_url_namespaceobject.getauthority)(trimmedhref);
    if (!(0,external_wp_url_namespaceobject.isvalidauthority)(authority)) {
      return false;
    }
    const path = (0,external_wp_url_namespaceobject.getpath)(trimmedhref);
    if (path && !(0,external_wp_url_namespaceobject.isvalidpath)(path)) {
      return false;
    }
    const querystring = (0,external_wp_url_namespaceobject.getquerystring)(trimmedhref);
    if (querystring && !(0,external_wp_url_namespaceobject.isvalidquerystring)(querystring)) {
      return false;
    }
    const fragment = (0,external_wp_url_namespaceobject.getfragment)(trimmedhref);
    if (fragment && !(0,external_wp_url_namespaceobject.isvalidfragment)(fragment)) {
      return false;
    }
  }
  if (trimmedhref.startswith("#") && !(0,external_wp_url_namespaceobject.isvalidfragment)(trimmedhref)) {
    return false;
  }
  return true;
}
function createlinkformat({
  url,
  type,
  id,
  opensinnewwindow,
  nofollow,
  cssclasses
}) {
  const format = {
    type: "core/link",
    attributes: {
      url
    }
  };
  if (type) {
    format.attributes.type = type;
  }
  if (id) {
    format.attributes.id = id;
  }
  if (opensinnewwindow) {
    format.attributes.target = "_blank";
    format.attributes.rel = format.attributes.rel ? format.attributes.rel + " noreferrer noopener" : "noreferrer noopener";
  }
  if (nofollow) {
    format.attributes.rel = format.attributes.rel ? format.attributes.rel + " nofollow" : "nofollow";
  }
  const trimmedcssclasses = cssclasses?.trim();
  if (trimmedcssclasses?.length) {
    format.attributes.class = trimmedcssclasses;
  }
  return format;
}
function getformatboundary(value, format, startindex = value.start, endindex = value.end) {
  const empty_boundaries = {
    start: null,
    end: null
  };
  const { formats } = value;
  let targetformat;
  let initialindex;
  if (!formats?.length) {
    return empty_boundaries;
  }
  const newformats = formats.slice();
  const formatatstart = newformats[startindex]?.find(
    ({ type }) => type === format.type
  );
  const formatatend = newformats[endindex]?.find(
    ({ type }) => type === format.type
  );
  const formatatendminusone = newformats[endindex - 1]?.find(
    ({ type }) => type === format.type
  );
  if (!!formatatstart) {
    targetformat = formatatstart;
    initialindex = startindex;
  } else if (!!formatatend) {
    targetformat = formatatend;
    initialindex = endindex;
  } else if (!!formatatendminusone) {
    targetformat = formatatendminusone;
    initialindex = endindex - 1;
  } else {
    return empty_boundaries;
  }
  const index = newformats[initialindex].indexof(targetformat);
  const walkingargs = [newformats, initialindex, targetformat, index];
  startindex = walktostart(...walkingargs);
  endindex = walktoend(...walkingargs);
  startindex = startindex < 0 ? 0 : startindex;
  return {
    start: startindex,
    end: endindex
  };
}
function walktoboundary(formats, initialindex, targetformatref, formatindex, direction) {
  let index = initialindex;
  const directions = {
    forwards: 1,
    backwards: -1
  };
  const directionincrement = directions[direction] || 1;
  const inversedirectionincrement = directionincrement * -1;
  while (formats[index] && formats[index][formatindex] === targetformatref) {
    index = index + directionincrement;
  }
  index = index + inversedirectionincrement;
  return index;
}
const partialright = (fn, ...partialargs) => (...args) => fn(...args, ...partialargs);
const walktostart = partialright(walktoboundary, "backwards");
const walktoend = partialright(walktoboundary, "forwards");


;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// ./node_modules/@wordpress/format-library/build-module/link/css-classes-setting.js





const cssclassessettingcomponent = ({ setting, value, onchange }) => {
  const hasvalue = value ? value?.cssclasses?.length > 0 : false;
  const [issettingactive, setissettingactive] = (0,external_wp_element_namespaceobject.usestate)(hasvalue);
  const instanceid = (0,external_wp_compose_namespaceobject.useinstanceid)(cssclassessettingcomponent);
  const controlledregionid = `css-classes-setting-${instanceid}`;
  const handlesettingchange = (newvalue) => {
    const sanitizedvalue = typeof newvalue === "string" ? newvalue.replace(/,/g, " ").replace(/\s+/g, " ").trim() : newvalue;
    onchange({
      ...value,
      [setting.id]: sanitizedvalue
    });
  };
  const handlecheckboxchange = () => {
    if (issettingactive) {
      if (hasvalue) {
        handlesettingchange("");
      }
      setissettingactive(false);
    } else {
      setissettingactive(true);
    }
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("fieldset", { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.visuallyhidden, { as: "legend", children: setting.title }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: 3, children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_components_namespaceobject.checkboxcontrol,
        {
          __nexthasnomarginbottom: true,
          label: setting.title,
          onchange: handlecheckboxchange,
          checked: issettingactive || hasvalue,
          "aria-expanded": issettingactive,
          "aria-controls": issettingactive ? controlledregionid : void 0
        }
      ),
      issettingactive && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { id: controlledregionid, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_components_namespaceobject.__experimentalinputcontrol,
        {
          label: (0,external_wp_i18n_namespaceobject.__)("css classes"),
          value: value?.cssclasses,
          onchange: handlesettingchange,
          help: (0,external_wp_i18n_namespaceobject.__)(
            "separate multiple classes with spaces."
          ),
          __unstableinputwidth: "100%",
          __next40pxdefaultsize: true
        }
      ) })
    ] })
  ] });
};
var css_classes_setting_default = cssclassessettingcomponent;


;// ./node_modules/@wordpress/format-library/build-module/link/inline.js












const link_settings = [
  ...external_wp_blockeditor_namespaceobject.linkcontrol.default_link_settings,
  {
    id: "nofollow",
    title: (0,external_wp_i18n_namespaceobject.__)("mark as nofollow")
  },
  {
    id: "cssclasses",
    title: (0,external_wp_i18n_namespaceobject.__)("additional css class(es)"),
    render: (setting, value, onchange) => {
      return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        css_classes_setting_default,
        {
          setting,
          value,
          onchange
        }
      );
    }
  }
];
function inlinelinkui({
  isactive,
  activeattributes,
  value,
  onchange,
  onfocusoutside,
  stopaddinglink,
  contentref,
  focusonmount
}) {
  const richlinktextvalue = getrichtextvaluefromselection(value, isactive);
  const richtexttext = richlinktextvalue.text;
  const { selectionchange } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_blockeditor_namespaceobject.store);
  const { createpageentity, usercancreatepages, selectionstart } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { getsettings, getselectionstart } = select(external_wp_blockeditor_namespaceobject.store);
      const _settings = getsettings();
      return {
        createpageentity: _settings.__experimentalcreatepageentity,
        usercancreatepages: _settings.__experimentalusercancreatepages,
        selectionstart: getselectionstart()
      };
    },
    []
  );
  const linkvalue = (0,external_wp_element_namespaceobject.usememo)(
    () => ({
      url: activeattributes.url,
      type: activeattributes.type,
      id: activeattributes.id,
      opensinnewtab: activeattributes.target === "_blank",
      nofollow: activeattributes.rel?.includes("nofollow"),
      title: richtexttext,
      cssclasses: activeattributes.class
    }),
    [
      activeattributes.class,
      activeattributes.id,
      activeattributes.rel,
      activeattributes.target,
      activeattributes.type,
      activeattributes.url,
      richtexttext
    ]
  );
  function removelink() {
    const newvalue = (0,external_wp_richtext_namespaceobject.removeformat)(value, "core/link");
    onchange(newvalue);
    stopaddinglink();
    (0,external_wp_a11y_namespaceobject.speak)((0,external_wp_i18n_namespaceobject.__)("link removed."), "assertive");
  }
  function onchangelink(nextvalue) {
    const haslink = linkvalue?.url;
    const isnewlink = !haslink;
    nextvalue = {
      ...linkvalue,
      ...nextvalue
    };
    const newurl = (0,external_wp_url_namespaceobject.prependhttp)(nextvalue.url);
    const linkformat = createlinkformat({
      url: newurl,
      type: nextvalue.type,
      id: nextvalue.id !== void 0 && nextvalue.id !== null ? string(nextvalue.id) : void 0,
      opensinnewwindow: nextvalue.opensinnewtab,
      nofollow: nextvalue.nofollow,
      cssclasses: nextvalue.cssclasses
    });
    const newtext = nextvalue.title || newurl;
    let newvalue;
    if ((0,external_wp_richtext_namespaceobject.iscollapsed)(value) && !isactive) {
      const inserted = (0,external_wp_richtext_namespaceobject.insert)(value, newtext);
      newvalue = (0,external_wp_richtext_namespaceobject.applyformat)(
        inserted,
        linkformat,
        value.start,
        value.start + newtext.length
      );
      onchange(newvalue);
      stopaddinglink();
      selectionchange({
        clientid: selectionstart.clientid,
        identifier: selectionstart.attributekey,
        start: value.start + newtext.length + 1
      });
      return;
    } else if (newtext === richtexttext) {
      newvalue = (0,external_wp_richtext_namespaceobject.applyformat)(value, linkformat);
    } else {
      newvalue = (0,external_wp_richtext_namespaceobject.create)({ text: newtext });
      newvalue = (0,external_wp_richtext_namespaceobject.applyformat)(newvalue, linkformat, 0, newtext.length);
      const boundary = getformatboundary(value, {
        type: "core/link"
      });
      const [valbefore, valafter] = (0,external_wp_richtext_namespaceobject.split)(
        value,
        boundary.start,
        boundary.start
      );
      const newvalafter = (0,external_wp_richtext_namespaceobject.replace)(valafter, richtexttext, newvalue);
      newvalue = (0,external_wp_richtext_namespaceobject.concat)(valbefore, newvalafter);
    }
    onchange(newvalue);
    if (!isnewlink) {
      stopaddinglink();
    }
    if (!isvalidhref(newurl)) {
      (0,external_wp_a11y_namespaceobject.speak)(
        (0,external_wp_i18n_namespaceobject.__)(
          "warning: the link has been inserted but may have errors. please test it."
        ),
        "assertive"
      );
    } else if (isactive) {
      (0,external_wp_a11y_namespaceobject.speak)((0,external_wp_i18n_namespaceobject.__)("link edited."), "assertive");
    } else {
      (0,external_wp_a11y_namespaceobject.speak)((0,external_wp_i18n_namespaceobject.__)("link inserted."), "assertive");
    }
  }
  const popoveranchor = (0,external_wp_richtext_namespaceobject.useanchor)({
    editablecontentelement: contentref.current,
    settings: {
      ...link_link,
      isactive
    }
  });
  async function handlecreate(pagetitle) {
    const page = await createpageentity({
      title: pagetitle,
      status: "draft"
    });
    return {
      id: page.id,
      type: page.type,
      title: page.title.rendered,
      url: page.link,
      kind: "post-type"
    };
  }
  function createbuttontext(searchterm) {
    return (0,external_wp_element_namespaceobject.createinterpolateelement)(
      (0,external_wp_i18n_namespaceobject.sprintf)(
        /* translators: %s: search term. */
        (0,external_wp_i18n_namespaceobject.__)("create page: <mark>%s</mark>"),
        searchterm
      ),
      { mark: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("mark", {}) }
    );
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.popover,
    {
      anchor: popoveranchor,
      animate: false,
      onclose: stopaddinglink,
      onfocusoutside,
      placement: "bottom",
      offset: 8,
      shift: true,
      focusonmount,
      constraintabbing: true,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.linkcontrol,
        {
          value: linkvalue,
          onchange: onchangelink,
          onremove: removelink,
          hasrichpreviews: true,
          createsuggestion: createpageentity && handlecreate,
          withcreatesuggestion: usercancreatepages,
          createsuggestionbuttontext: createbuttontext,
          hastextcontrol: true,
          settings: link_settings,
          showinitialsuggestions: true,
          suggestionsquery: {
            // always show pages as initial suggestions
            initialsuggestionssearchoptions: {
              type: "post",
              subtype: "page",
              perpage: 20
            }
          }
        }
      )
    }
  );
}
function getrichtextvaluefromselection(value, isactive) {
  let textstart = value.start;
  let textend = value.end;
  if (isactive) {
    const boundary = getformatboundary(value, {
      type: "core/link"
    });
    textstart = boundary.start;
    textend = boundary.end + 1;
  }
  return (0,external_wp_richtext_namespaceobject.slice)(value, textstart, textend);
}
var inline_default = inlinelinkui;


;// ./node_modules/@wordpress/format-library/build-module/link/index.js











const link_name = "core/link";
const link_title = (0,external_wp_i18n_namespaceobject.__)("link");
function link_edit({
  isactive,
  activeattributes,
  value,
  onchange,
  onfocus,
  contentref
}) {
  const [addinglink, setaddinglink] = (0,external_wp_element_namespaceobject.usestate)(false);
  const [openedby, setopenedby] = (0,external_wp_element_namespaceobject.usestate)(null);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (!isactive) {
      setaddinglink(false);
    }
  }, [isactive]);
  (0,external_wp_element_namespaceobject.uselayouteffect)(() => {
    const editablecontentelement = contentref.current;
    if (!editablecontentelement) {
      return;
    }
    function handleclick(event) {
      const link2 = event.target.closest("[contenteditable] a");
      if (!link2 || // other formats (e.g. bold) may be nested within the link.
      !isactive) {
        return;
      }
      setaddinglink(true);
      setopenedby({
        el: link2,
        action: "click"
      });
    }
    editablecontentelement.addeventlistener("click", handleclick);
    return () => {
      editablecontentelement.removeeventlistener("click", handleclick);
    };
  }, [contentref, isactive]);
  function addlink(target) {
    const text = (0,external_wp_richtext_namespaceobject.gettextcontent)((0,external_wp_richtext_namespaceobject.slice)(value));
    if (!isactive && text && (0,external_wp_url_namespaceobject.isurl)(text) && isvalidhref(text)) {
      onchange(
        (0,external_wp_richtext_namespaceobject.applyformat)(value, {
          type: link_name,
          attributes: { url: text }
        })
      );
    } else if (!isactive && text && (0,external_wp_url_namespaceobject.isemail)(text)) {
      onchange(
        (0,external_wp_richtext_namespaceobject.applyformat)(value, {
          type: link_name,
          attributes: { url: `mailto:${text}` }
        })
      );
    } else if (!isactive && text && (0,external_wp_url_namespaceobject.isphonenumber)(text)) {
      onchange(
        (0,external_wp_richtext_namespaceobject.applyformat)(value, {
          type: link_name,
          attributes: { url: `tel:${text.replace(/\d/g, "")}` }
        })
      );
    } else {
      if (target) {
        setopenedby({
          el: target,
          action: null
          // we don't need to distinguish between click or keyboard here
        });
      }
      setaddinglink(true);
    }
  }
  function stopaddinglink() {
    setaddinglink(false);
    if (openedby?.el?.tagname === "button") {
      openedby.el.focus();
    } else {
      onfocus();
    }
    setopenedby(null);
  }
  function onfocusoutside() {
    setaddinglink(false);
    setopenedby(null);
  }
  function onremoveformat() {
    onchange((0,external_wp_richtext_namespaceobject.removeformat)(value, link_name));
    (0,external_wp_a11y_namespaceobject.speak)((0,external_wp_i18n_namespaceobject.__)("link removed."), "assertive");
  }
  const shouldautofocus = !(openedby?.el?.tagname === "a" && openedby?.action === "click");
  const hasselection = !(0,external_wp_richtext_namespaceobject.iscollapsed)(value);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    hasselection && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtextshortcut,
      {
        type: "primary",
        character: "k",
        onuse: addlink
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtextshortcut,
      {
        type: "primaryshift",
        character: "k",
        onuse: onremoveformat
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
      {
        name: "link",
        icon: link_default,
        title: isactive ? (0,external_wp_i18n_namespaceobject.__)("link") : link_title,
        onclick: (event) => {
          addlink(event.currenttarget);
        },
        isactive: isactive || addinglink,
        shortcuttype: "primary",
        shortcutcharacter: "k",
        "aria-haspopup": "true",
        "aria-expanded": addinglink
      }
    ),
    addinglink && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      inline_default,
      {
        stopaddinglink,
        onfocusoutside,
        isactive,
        activeattributes,
        value,
        onchange,
        contentref,
        focusonmount: shouldautofocus ? "firstelement" : false
      }
    )
  ] });
}
const link_link = {
  name: link_name,
  title: link_title,
  tagname: "a",
  classname: null,
  attributes: {
    url: "href",
    type: "data-type",
    id: "data-id",
    _id: "id",
    target: "target",
    rel: "rel",
    class: "class"
  },
  __unstablepasterule(value, { html, plaintext }) {
    const pastedtext = (html || plaintext).replace(/<[^>]+>/g, "").trim();
    if (!(0,external_wp_url_namespaceobject.isurl)(pastedtext) || !/^https?:/.test(pastedtext)) {
      return value;
    }
    window.console.log("created link:\n\n", pastedtext);
    const format = {
      type: link_name,
      attributes: {
        url: (0,external_wp_htmlentities_namespaceobject.decodeentities)(pastedtext)
      }
    };
    if ((0,external_wp_richtext_namespaceobject.iscollapsed)(value)) {
      return (0,external_wp_richtext_namespaceobject.insert)(
        value,
        (0,external_wp_richtext_namespaceobject.applyformat)(
          (0,external_wp_richtext_namespaceobject.create)({ text: plaintext }),
          format,
          0,
          plaintext.length
        )
      );
    }
    return (0,external_wp_richtext_namespaceobject.applyformat)(value, format);
  },
  edit: link_edit
};


;// ./node_modules/@wordpress/icons/build-module/library/format-strikethrough.js


var format_strikethrough_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m9.1 9v-.5c0-.6.2-1.1.7-1.4.5-.3 1.2-.5 2-.5.7 0 1.4.1 2.1.3.7.2 1.4.5 2.1.9l.2-1.9c-.6-.3-1.2-.5-1.9-.7-.8-.1-1.6-.2-2.4-.2-1.5 0-2.7.3-3.6 1-.8.7-1.2 1.5-1.2 2.6v9h2zm20 12h4v1h8.3c.3.1.6.2.8.3.5.2.9.5 1.1.8.3.3.4.7.4 1.2 0 .7-.2 1.1-.8 1.5-.5.3-1.2.5-2.1.5-.8 0-1.6-.1-2.4-.3-.8-.2-1.5-.5-2.2-.8l7 18.1c.5.2 1.2.4 2 .6.8.2 1.6.3 2.4.3 1.7 0 3-.3 3.9-1 .9-.7 1.3-1.6 1.3-2.8 0-.9-.2-1.7-.7-2.2h20v-1z" }) });


;// ./node_modules/@wordpress/format-library/build-module/strikethrough/index.js





const strikethrough_name = "core/strikethrough";
const strikethrough_title = (0,external_wp_i18n_namespaceobject.__)("strikethrough");
const strikethrough = {
  name: strikethrough_name,
  title: strikethrough_title,
  tagname: "s",
  classname: null,
  edit({ isactive, value, onchange, onfocus }) {
    function onclick() {
      onchange((0,external_wp_richtext_namespaceobject.toggleformat)(value, { type: strikethrough_name, title: strikethrough_title }));
      onfocus();
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtextshortcut,
        {
          type: "access",
          character: "d",
          onuse: onclick
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
        {
          icon: format_strikethrough_default,
          title: strikethrough_title,
          onclick,
          isactive,
          role: "menuitemcheckbox"
        }
      )
    ] });
  }
};


;// ./node_modules/@wordpress/format-library/build-module/underline/index.js




const underline_name = "core/underline";
const underline_title = (0,external_wp_i18n_namespaceobject.__)("underline");
const underline = {
  name: underline_name,
  title: underline_title,
  tagname: "span",
  classname: null,
  attributes: {
    style: "style"
  },
  edit({ value, onchange }) {
    const ontoggle = () => {
      onchange(
        (0,external_wp_richtext_namespaceobject.toggleformat)(value, {
          type: underline_name,
          attributes: {
            style: "text-decoration: underline;"
          },
          title: underline_title
        })
      );
    };
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtextshortcut,
        {
          type: "primary",
          character: "u",
          onuse: ontoggle
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.__unstablerichtextinputevent,
        {
          inputtype: "formatunderline",
          oninput: ontoggle
        }
      )
    ] });
  }
};


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


;// ./node_modules/@wordpress/icons/build-module/library/text-color.js


var text_color_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m12.9 6h-2l-4 11h1.9l1.1-3h4.2l1.1 3h1.9l12.9 6zm-2.5 6.5l1.5-4.9 1.7 4.9h-3.2z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/color.js


var color_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m17.2 10.9c-.5-1-1.2-2.1-2.1-3.2-.6-.9-1.3-1.7-2.1-2.6l12 4l-1 1.1c-.6.9-1.3 1.7-2 2.6-.8 1.2-1.5 2.3-2 3.2-.6 1.2-1 2.2-1 3 0 3.4 2.7 6.1 6.1 6.1s6.1-2.7 6.1-6.1c0-.8-.3-1.8-1-3zm-5.1 7.6c-2.5 0-4.6-2.1-4.6-4.6 0-.3.1-1 .8-2.3.5-.9 1.1-1.9 2-3.1.7-.9 1.3-1.7 1.8-2.3.7.8 1.3 1.6 1.8 2.3.8 1.1 1.5 2.2 2 3.1.7 1.3.8 2 .8 2.3 0 2.5-2.1 4.6-4.6 4.6z" }) });


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/format-library/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/format-library"
);


;// ./node_modules/@wordpress/format-library/build-module/text-color/inline.js









const { tabs } = unlock(external_wp_components_namespaceobject.privateapis);
const tabs = [
  { name: "color", title: (0,external_wp_i18n_namespaceobject.__)("text") },
  { name: "backgroundcolor", title: (0,external_wp_i18n_namespaceobject.__)("background") }
];
function parsecss(css = "") {
  return css.split(";").reduce((accumulator, rule) => {
    if (rule) {
      const [property, value] = rule.split(":");
      if (property === "color") {
        accumulator.color = value;
      }
      if (property === "background-color" && value !== transparentvalue) {
        accumulator.backgroundcolor = value;
      }
    }
    return accumulator;
  }, {});
}
function parseclassname(classname = "", colorsettings) {
  return classname.split(" ").reduce((accumulator, name) => {
    if (name.startswith("has-") && name.endswith("-color")) {
      const colorslug = name.replace(/^has-/, "").replace(/-color$/, "");
      const colorobject = (0,external_wp_blockeditor_namespaceobject.getcolorobjectbyattributevalues)(
        colorsettings,
        colorslug
      );
      accumulator.color = colorobject.color;
    }
    return accumulator;
  }, {});
}
function getactivecolors(value, name, colorsettings) {
  const activecolorformat = (0,external_wp_richtext_namespaceobject.getactiveformat)(value, name);
  if (!activecolorformat) {
    return {};
  }
  return {
    ...parsecss(activecolorformat.attributes.style),
    ...parseclassname(activecolorformat.attributes.class, colorsettings)
  };
}
function setcolors(value, name, colorsettings, colors) {
  const { color, backgroundcolor } = {
    ...getactivecolors(value, name, colorsettings),
    ...colors
  };
  if (!color && !backgroundcolor) {
    return (0,external_wp_richtext_namespaceobject.removeformat)(value, name);
  }
  const styles = [];
  const classnames = [];
  const attributes = {};
  if (backgroundcolor) {
    styles.push(["background-color", backgroundcolor].join(":"));
  } else {
    styles.push(["background-color", transparentvalue].join(":"));
  }
  if (color) {
    const colorobject = (0,external_wp_blockeditor_namespaceobject.getcolorobjectbycolorvalue)(colorsettings, color);
    if (colorobject) {
      classnames.push((0,external_wp_blockeditor_namespaceobject.getcolorclassname)("color", colorobject.slug));
    } else {
      styles.push(["color", color].join(":"));
    }
  }
  if (styles.length) {
    attributes.style = styles.join(";");
  }
  if (classnames.length) {
    attributes.class = classnames.join(" ");
  }
  return (0,external_wp_richtext_namespaceobject.applyformat)(value, { type: name, attributes });
}
function colorpicker({ name, property, value, onchange }) {
  const colors = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { getsettings } = select(external_wp_blockeditor_namespaceobject.store);
    return getsettings().colors ?? [];
  }, []);
  const activecolors = (0,external_wp_element_namespaceobject.usememo)(
    () => getactivecolors(value, name, colors),
    [name, value, colors]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_blockeditor_namespaceobject.colorpalette,
    {
      value: activecolors[property],
      onchange: (color) => {
        onchange(
          setcolors(value, name, colors, { [property]: color })
        );
      },
      enablealpha: true,
      __experimentalisrenderedinsidebar: true
    }
  );
}
function inlinecolorui({
  name,
  value,
  onchange,
  onclose,
  contentref,
  isactive
}) {
  const popoveranchor = (0,external_wp_richtext_namespaceobject.useanchor)({
    editablecontentelement: contentref.current,
    settings: { ...textcolor, isactive }
  });
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.popover,
    {
      onclose,
      classname: "format-library__inline-color-popover",
      anchor: popoveranchor,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(tabs, { children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(tabs.tablist, { children: tabs.map((tab) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(tabs.tab, { tabid: tab.name, children: tab.title }, tab.name)) }),
        tabs.map((tab) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          tabs.tabpanel,
          {
            tabid: tab.name,
            focusable: false,
            children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              colorpicker,
              {
                name,
                property: tab.name,
                value,
                onchange
              }
            )
          },
          tab.name
        ))
      ] })
    }
  );
}


;// ./node_modules/@wordpress/format-library/build-module/text-color/index.js







const transparentvalue = "rgba(0, 0, 0, 0)";
const text_color_name = "core/text-color";
const text_color_title = (0,external_wp_i18n_namespaceobject.__)("highlight");
const empty_array = [];
function getcomputedstyleproperty(element, property) {
  const { ownerdocument } = element;
  const { defaultview } = ownerdocument;
  const style = defaultview.getcomputedstyle(element);
  const value = style.getpropertyvalue(property);
  if (property === "background-color" && value === transparentvalue && element.parentelement) {
    return getcomputedstyleproperty(element.parentelement, property);
  }
  return value;
}
function fillcomputedcolors(element, { color, backgroundcolor }) {
  if (!color && !backgroundcolor) {
    return;
  }
  return {
    color: color || getcomputedstyleproperty(element, "color"),
    backgroundcolor: backgroundcolor === transparentvalue ? getcomputedstyleproperty(element, "background-color") : backgroundcolor
  };
}
function textcoloredit({
  value,
  onchange,
  isactive,
  activeattributes,
  contentref
}) {
  const [allowcustomcontrol, colors = empty_array] = (0,external_wp_blockeditor_namespaceobject.usesettings)(
    "color.custom",
    "color.palette"
  );
  const [isaddingcolor, setisaddingcolor] = (0,external_wp_element_namespaceobject.usestate)(false);
  const colorindicatorstyle = (0,external_wp_element_namespaceobject.usememo)(
    () => fillcomputedcolors(
      contentref.current,
      getactivecolors(value, text_color_name, colors)
    ),
    [contentref, value, colors]
  );
  const hascolorstochoose = !!colors.length || allowcustomcontrol;
  if (!hascolorstochoose && !isactive) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
      {
        classname: "format-library-text-color-button",
        isactive,
        icon: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          icon_default,
          {
            icon: object.keys(activeattributes).length ? text_color_default : color_default,
            style: colorindicatorstyle
          }
        ),
        title: text_color_title,
        onclick: hascolorstochoose ? () => setisaddingcolor(true) : () => onchange((0,external_wp_richtext_namespaceobject.removeformat)(value, text_color_name)),
        role: "menuitemcheckbox"
      }
    ),
    isaddingcolor && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      inlinecolorui,
      {
        name: text_color_name,
        onclose: () => setisaddingcolor(false),
        activeattributes,
        value,
        onchange,
        contentref,
        isactive
      }
    )
  ] });
}
const textcolor = {
  name: text_color_name,
  title: text_color_title,
  tagname: "mark",
  classname: "has-inline-color",
  attributes: {
    style: "style",
    class: "class"
  },
  edit: textcoloredit
};


;// ./node_modules/@wordpress/icons/build-module/library/subscript.js


var subscript_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m16.9 18.3l.8-1.2c.4-.6.7-1.2.9-1.6.2-.4.3-.8.3-1.2 0-.3-.1-.7-.2-1-.1-.3-.4-.5-.6-.7-.3-.2-.6-.3-1-.3s-.8.1-1.1.2c-.3.1-.7.3-1 .6l.2 1.3c.3-.3.5-.5.8-.6s.6-.2.9-.2c.3 0 .5.1.7.2.2.2.2.4.2.7 0 .3-.1.5-.2.8-.1.3-.4.7-.8 1.3l15 19.4h4.3v-1.2h-2.4zm14.1 7.2h-2l9.5 11 6.9 7.2h-2l3.6 5.3l4.7 18h2l2.7-4 2.7 4h2l-3.8-5.5 3.8-5.3z" }) });


;// ./node_modules/@wordpress/format-library/build-module/subscript/index.js





const subscript_name = "core/subscript";
const subscript_title = (0,external_wp_i18n_namespaceobject.__)("subscript");
const subscript = {
  name: subscript_name,
  title: subscript_title,
  tagname: "sub",
  classname: null,
  edit({ isactive, value, onchange, onfocus }) {
    function ontoggle() {
      onchange((0,external_wp_richtext_namespaceobject.toggleformat)(value, { type: subscript_name, title: subscript_title }));
    }
    function onclick() {
      ontoggle();
      onfocus();
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
      {
        icon: subscript_default,
        title: subscript_title,
        onclick,
        isactive,
        role: "menuitemcheckbox"
      }
    );
  }
};


;// ./node_modules/@wordpress/icons/build-module/library/superscript.js


var superscript_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m16.9 10.3l.8-1.3c.4-.6.7-1.2.9-1.6.2-.4.3-.8.3-1.2 0-.3-.1-.7-.2-1-.2-.2-.4-.4-.7-.6-.3-.2-.6-.3-1-.3s-.8.1-1.1.2c-.3.1-.7.3-1 .6l.1 1.3c.3-.3.5-.5.8-.6s.6-.2.9-.2c.3 0 .5.1.7.2.2.2.2.4.2.7 0 .3-.1.5-.2.8-.1.3-.4.7-.8 1.3l-1.8 2.8h4.3v-1.2h-2.2zm-2.8-3.1h-2l9.5 11 6.9 7.2h-2l3.6 5.3l4.7 18h2l2.7-4 2.7 4h2l-3.8-5.5 3.8-5.3z" }) });


;// ./node_modules/@wordpress/format-library/build-module/superscript/index.js





const superscript_name = "core/superscript";
const superscript_title = (0,external_wp_i18n_namespaceobject.__)("superscript");
const superscript = {
  name: superscript_name,
  title: superscript_title,
  tagname: "sup",
  classname: null,
  edit({ isactive, value, onchange, onfocus }) {
    function ontoggle() {
      onchange((0,external_wp_richtext_namespaceobject.toggleformat)(value, { type: superscript_name, title: superscript_title }));
    }
    function onclick() {
      ontoggle();
      onfocus();
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
      {
        icon: superscript_default,
        title: superscript_title,
        onclick,
        isactive,
        role: "menuitemcheckbox"
      }
    );
  }
};


;// ./node_modules/@wordpress/icons/build-module/library/button.js


var button_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m8 12.5h8v11h8v1.5z m19 6.5h5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v8.5a2 2 0 0 0-2-2zm5 8h14a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h5a.5.5 0 0 1-.5-.5v8.5a.5.5 0 0 1 5 8z" }) });


;// ./node_modules/@wordpress/format-library/build-module/keyboard/index.js





const keyboard_name = "core/keyboard";
const keyboard_title = (0,external_wp_i18n_namespaceobject.__)("keyboard input");
const keyboard = {
  name: keyboard_name,
  title: keyboard_title,
  tagname: "kbd",
  classname: null,
  edit({ isactive, value, onchange, onfocus }) {
    function ontoggle() {
      onchange((0,external_wp_richtext_namespaceobject.toggleformat)(value, { type: keyboard_name, title: keyboard_title }));
    }
    function onclick() {
      ontoggle();
      onfocus();
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
      {
        icon: button_default,
        title: keyboard_title,
        onclick,
        isactive,
        role: "menuitemcheckbox"
      }
    );
  }
};


;// ./node_modules/@wordpress/icons/build-module/library/help.js


var help_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m12 4a8 8 0 1 1 .001 16.001a8 8 0 0 1 12 4zm0 1.5a6.5 6.5 0 1 0-.001 13.001a6.5 6.5 0 0 0 12 5.5zm.75 11h-1.5v15h1.5v1.5zm-.445-9.234a3 3 0 0 1 .445 5.89v14h-1.5v-1.25c0-.57.452-.958.917-1.01a1.5 1.5 0 0 0 12 8.75a1.5 1.5 0 0 0-1.5 1.5h9a3 3 0 0 1 3.305-2.984z" }) });


;// ./node_modules/@wordpress/format-library/build-module/unknown/index.js





const unknown_name = "core/unknown";
const unknown_title = (0,external_wp_i18n_namespaceobject.__)("clear unknown formatting");
function selectioncontainsunknownformats(value) {
  if ((0,external_wp_richtext_namespaceobject.iscollapsed)(value)) {
    return false;
  }
  const selectedvalue = (0,external_wp_richtext_namespaceobject.slice)(value);
  return selectedvalue.formats.some((formats) => {
    return formats.some((format) => format.type === unknown_name);
  });
}
const unknown = {
  name: unknown_name,
  title: unknown_title,
  tagname: "*",
  classname: null,
  edit({ isactive, value, onchange, onfocus }) {
    if (!isactive && !selectioncontainsunknownformats(value)) {
      return null;
    }
    function onclick() {
      onchange((0,external_wp_richtext_namespaceobject.removeformat)(value, unknown_name));
      onfocus();
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
      {
        name: "unknown",
        icon: help_default,
        title: unknown_title,
        onclick,
        isactive: true
      }
    );
  }
};


;// ./node_modules/@wordpress/icons/build-module/library/language.js


var language_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m17.5 10h-1.7l-3.7 10.5h1.7l.9-2.6h3.9l.9 2.6h1.7l17.5 10zm-2.2 6.3 1.4-4 1.4 4h-2.8zm-4.8-3.8c1.6-1.8 2.9-3.6 3.7-5.7h16v5.2h-5.8v3h8.8v2.2h3v1.5h9.6c-.7 1.6-1.8 3.1-3.1 4.6c8.6 10.2 7.8 9 7.2 8h5.6c.6 1.4 1.7 2.9 2.9 4.4l-2.4 2.4c-.3.4-.7.8-1.1 1.2l1 1 1.2-1.2c.8-.8 1.6-1.5 2.3-2.3.8.9 1.7 1.7 2.5 2.5l.6-1.5c-.7-.6-1.4-1.3-2.1-2z" }) });


;// ./node_modules/@wordpress/format-library/build-module/language/index.js







const language_name = "core/language";
const language_title = (0,external_wp_i18n_namespaceobject.__)("language");
const language = {
  name: language_name,
  tagname: "bdo",
  classname: null,
  edit: language_edit,
  title: language_title
};
function language_edit({ isactive, value, onchange, contentref }) {
  const [ispopovervisible, setispopovervisible] = (0,external_wp_element_namespaceobject.usestate)(false);
  const togglepopover = () => {
    setispopovervisible((state) => !state);
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
      {
        icon: language_default,
        label: language_title,
        title: language_title,
        onclick: () => {
          if (isactive) {
            onchange((0,external_wp_richtext_namespaceobject.removeformat)(value, language_name));
          } else {
            togglepopover();
          }
        },
        isactive,
        role: "menuitemcheckbox"
      }
    ),
    ispopovervisible && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      inlinelanguageui,
      {
        value,
        onchange,
        onclose: togglepopover,
        contentref
      }
    )
  ] });
}
function inlinelanguageui({ value, contentref, onchange, onclose }) {
  const popoveranchor = (0,external_wp_richtext_namespaceobject.useanchor)({
    editablecontentelement: contentref.current,
    settings: language
  });
  const [lang, setlang] = (0,external_wp_element_namespaceobject.usestate)("");
  const [dir, setdir] = (0,external_wp_element_namespaceobject.usestate)("ltr");
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.popover,
    {
      classname: "block-editor-format-toolbar__language-popover",
      anchor: popoveranchor,
      onclose,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
        external_wp_components_namespaceobject.__experimentalvstack,
        {
          as: "form",
          spacing: 4,
          classname: "block-editor-format-toolbar__language-container-content",
          onsubmit: (event) => {
            event.preventdefault();
            onchange(
              (0,external_wp_richtext_namespaceobject.applyformat)(value, {
                type: language_name,
                attributes: {
                  lang,
                  dir
                }
              })
            );
            onclose();
          },
          children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.textcontrol,
              {
                __next40pxdefaultsize: true,
                __nexthasnomarginbottom: true,
                label: language_title,
                value: lang,
                onchange: (val) => setlang(val),
                help: (0,external_wp_i18n_namespaceobject.__)(
                  'a valid language attribute, like "en" or "fr".'
                )
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.selectcontrol,
              {
                __next40pxdefaultsize: true,
                __nexthasnomarginbottom: true,
                label: (0,external_wp_i18n_namespaceobject.__)("text direction"),
                value: dir,
                options: [
                  {
                    label: (0,external_wp_i18n_namespaceobject.__)("left to right"),
                    value: "ltr"
                  },
                  {
                    label: (0,external_wp_i18n_namespaceobject.__)("right to left"),
                    value: "rtl"
                  }
                ],
                onchange: (val) => setdir(val)
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.__experimentalhstack, { alignment: "right", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.button,
              {
                __next40pxdefaultsize: true,
                variant: "primary",
                type: "submit",
                text: (0,external_wp_i18n_namespaceobject.__)("apply")
              }
            ) })
          ]
        }
      )
    }
  );
}


;// ./node_modules/@wordpress/icons/build-module/library/math.js


var math_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m11.2 6.8c-.7 0-1.4.5-1.6 1.1l-2.8 7.5-1.2-1.8c-.1-.2-.4-.3-.6-.3h3v1.5h1.6l1.2 1.8c.6.9 1.9.7 2.2-.3l2.9-7.9s.1-.2.2-.2h7.8v6.7h-7.8zm5.3 3.4-1.9 1.9-1.9-1.9-1.1 1.1 1.9 1.9-1.9 1.9 1.1 1.1 1.9-1.9 1.9 1.9 1.1-1.1-1.9-1.9 1.9-1.9-1.1-1.1z" }) });


;// ./node_modules/@wordpress/format-library/build-module/math/index.js









const { badge } = unlock(external_wp_components_namespaceobject.privateapis);
const math_name = "core/math";
const math_title = (0,external_wp_i18n_namespaceobject.__)("math");
function math_inlineui({
  value,
  onchange,
  activeattributes,
  contentref,
  latextomathml
}) {
  const [latex, setlatex] = (0,external_wp_element_namespaceobject.usestate)(
    activeattributes?.["data-latex"] || ""
  );
  const [error, seterror] = (0,external_wp_element_namespaceobject.usestate)(null);
  const popoveranchor = (0,external_wp_richtext_namespaceobject.useanchor)({
    editablecontentelement: contentref.current,
    settings: math
  });
  const handlelatexchange = (newlatex) => {
    let mathml = "";
    setlatex(newlatex);
    if (newlatex) {
      try {
        mathml = latextomathml(newlatex, { displaymode: false });
        seterror(null);
      } catch (err) {
        seterror(err.message);
        (0,external_wp_a11y_namespaceobject.speak)(err.message);
        return;
      }
    }
    const newreplacements = value.replacements.slice();
    newreplacements[value.start] = {
      type: math_name,
      attributes: {
        "data-latex": newlatex
      },
      innerhtml: mathml
    };
    onchange({
      ...value,
      replacements: newreplacements
    });
  };
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.popover,
    {
      placement: "bottom-start",
      offset: 8,
      focusonmount: false,
      anchor: popoveranchor,
      classname: "block-editor-format-toolbar__math-popover",
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { style: { minwidth: "300px", padding: "4px" }, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.__experimentalvstack, { spacing: 1, children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_components_namespaceobject.textcontrol,
          {
            __nexthasnomarginbottom: true,
            __next40pxdefaultsize: true,
            hidelabelfromvision: true,
            label: (0,external_wp_i18n_namespaceobject.__)("latex math syntax"),
            value: latex,
            onchange: handlelatexchange,
            placeholder: (0,external_wp_i18n_namespaceobject.__)("e.g., x^2, \\frac{a}{b}"),
            autocomplete: "off",
            classname: "block-editor-format-toolbar__math-input"
          }
        ),
        error && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            badge,
            {
              intent: "error",
              classname: "wp-block-math__error",
              children: error
            }
          ),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("style", { children: ".wp-block-math__error .components-badge__content{white-space:normal}" })
        ] })
      ] }) })
    }
  );
}
function math_edit({
  value,
  onchange,
  onfocus,
  isobjectactive,
  activeobjectattributes,
  contentref
}) {
  const [latextomathml, setlatextomathml] = (0,external_wp_element_namespaceobject.usestate)();
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 3533, 23)).then((module) => {
      setlatextomathml(() => module.default);
    });
  }, []);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtexttoolbarbutton,
      {
        icon: math_default,
        title: math_title,
        onclick: () => {
          const newvalue = (0,external_wp_richtext_namespaceobject.insertobject)(value, {
            type: math_name,
            attributes: {
              "data-latex": ""
            },
            innerhtml: ""
          });
          newvalue.start = newvalue.end - 1;
          onchange(newvalue);
          onfocus();
        },
        isactive: isobjectactive
      }
    ),
    isobjectactive && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      math_inlineui,
      {
        value,
        onchange,
        activeattributes: activeobjectattributes,
        contentref,
        latextomathml
      }
    )
  ] });
}
const math = {
  name: math_name,
  title: math_title,
  tagname: "math",
  classname: null,
  attributes: {
    "data-latex": "data-latex"
  },
  contenteditable: false,
  edit: math_edit
};


;// ./node_modules/@wordpress/format-library/build-module/non-breaking-space/index.js




const non_breaking_space_name = "core/non-breaking-space";
const non_breaking_space_title = (0,external_wp_i18n_namespaceobject.__)("non breaking space");
const nonbreakingspace = {
  name: non_breaking_space_name,
  title: non_breaking_space_title,
  tagname: "nbsp",
  classname: null,
  edit({ value, onchange }) {
    function addnonbreakingspace() {
      onchange((0,external_wp_richtext_namespaceobject.insert)(value, "\xa0"));
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtextshortcut,
      {
        type: "primaryshift",
        character: " ",
        onuse: addnonbreakingspace
      }
    );
  }
};


;// ./node_modules/@wordpress/format-library/build-module/default-formats.js















var default_formats_default = [
  bold,
  code,
  image_image,
  italic,
  link_link,
  strikethrough,
  underline,
  textcolor,
  subscript,
  superscript,
  keyboard,
  unknown,
  language,
  math,
  nonbreakingspace
];


;// ./node_modules/@wordpress/format-library/build-module/index.js


default_formats_default.foreach(
  ({ name, ...settings }) => (0,external_wp_richtext_namespaceobject.registerformattype)(name, settings)
);

(window.wp = window.wp || {}).formatlibrary = __webpack_exports__;
/******/ })()
;







