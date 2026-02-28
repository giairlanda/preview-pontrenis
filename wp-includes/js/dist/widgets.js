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
  movetowidgetarea: () => (/* reexport */ movetowidgetarea),
  addwidgetidtoblock: () => (/* reexport */ addwidgetidtoblock),
  getwidgetidfromblock: () => (/* reexport */ getwidgetidfromblock),
  registerlegacywidgetblock: () => (/* binding */ registerlegacywidgetblock),
  registerlegacywidgetvariations: () => (/* reexport */ registerlegacywidgetvariations),
  registerwidgetgroupblock: () => (/* binding */ registerwidgetgroupblock)
});

// namespace object: ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/index.js
var legacy_widget_namespaceobject = {};
__webpack_require__.r(legacy_widget_namespaceobject);
__webpack_require__.d(legacy_widget_namespaceobject, {
  yu: () => (block_namespaceobject),
  uu: () => (legacy_widget_name),
  w0: () => (settings)
});

// namespace object: ./node_modules/@wordpress/widgets/build-module/blocks/widget-group/index.js
var widget_group_namespaceobject = {};
__webpack_require__.r(widget_group_namespaceobject);
__webpack_require__.d(widget_group_namespaceobject, {
  yu: () => (widget_group_block_namespaceobject),
  uu: () => (widget_group_name),
  w0: () => (widget_group_settings)
});

;// external ["wp","blocks"]
const external_wp_blocks_namespaceobject = window["wp"]["blocks"];
;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/widget.js


var widget_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m6 3h8v5h16v3h18v5c19.1046 5 20 5.89543 20 7v19c20 20.1046 19.1046 21 18 21h6c4.89543 21 4 20.1046 4 19v7c4 5.89543 4.89543 5 6 5v3zm18 6.5h6c5.72386 6.5 5.5 6.72386 5.5 7v8h18.5v7c18.5 6.72386 18.2761 6.5 18 6.5zm18.5 9.5h5.5v19c5.5 19.2761 5.72386 19.5 6 19.5h18c18.2761 19.5 18.5 19.2761 18.5 19v9.5zm11 11h13v13h11v11zm7 11v13h9v11h7zm15 13v11h17v13h15z" }) });


;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/block.json
const block_namespaceobject = /*#__pure__*/json.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiversion":3,"name":"core/legacy-widget","title":"legacy widget","category":"widgets","description":"display a legacy widget.","textdomain":"default","attributes":{"id":{"type":"string","default":null},"idbase":{"type":"string","default":null},"instance":{"type":"object","default":null}},"supports":{"html":false,"customclassname":false,"reusable":false},"editorstyle":"wp-block-legacy-widget-editor"}');
;// ./node_modules/clsx/dist/clsx.mjs
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(array.isarray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const dist_clsx = (clsx);
;// external ["wp","blockeditor"]
const external_wp_blockeditor_namespaceobject = window["wp"]["blockeditor"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// ./node_modules/@wordpress/icons/build-module/library/brush.js


var brush_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m4 20h8v-1.5h4v20zm18.9 3.5c-.6-.6-1.5-.6-2.1 0l-7.2 7.2c-.4-.1-.7 0-1.1.1-.5.2-1.5.7-1.9 2.2-.4 1.7-.8 2.2-1.1 2.7-.1.1-.2.3-.3.4l-.6 1.1h6c2 0 3.4-.4 4.7-1.4.8-.6 1.2-1.4 1.3-2.3 0-.3 0-.5-.1-.7l19 5.7c.5-.6.5-1.6-.1-2.2zm9.7 14.7c-.7.5-1.5.8-2.4 1 .2-.5.5-1.2.8-2.3.2-.6.4-1 .8-1.1.5-.1 1 .1 1.3.3.2.2.3.5.2.8 0 .3-.1.9-.7 1.3z" }) });


;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","coredata"]
const external_wp_coredata_namespaceobject = window["wp"]["coredata"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/edit/widget-type-selector.js






function widgettypeselector({ selectedid, onselect }) {
  const widgettypes = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const hiddenids = select(external_wp_blockeditor_namespaceobject.store).getsettings()?.widgettypestohidefromlegacywidgetblock ?? [];
    return select(external_wp_coredata_namespaceobject.store).getwidgettypes({ per_page: -1 })?.filter((widgettype) => !hiddenids.includes(widgettype.id));
  }, []);
  if (!widgettypes) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.spinner, {});
  }
  if (widgettypes.length === 0) {
    return (0,external_wp_i18n_namespaceobject.__)("there are no widgets available.");
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.selectcontrol,
    {
      __next40pxdefaultsize: true,
      __nexthasnomarginbottom: true,
      label: (0,external_wp_i18n_namespaceobject.__)("legacy widget"),
      value: selectedid ?? "",
      options: [
        { value: "", label: (0,external_wp_i18n_namespaceobject.__)("select widget") },
        ...widgettypes.map((widgettype) => ({
          value: widgettype.id,
          label: widgettype.name
        }))
      ],
      onchange: (value) => {
        if (value) {
          const selected = widgettypes.find(
            (widgettype) => widgettype.id === value
          );
          onselect({
            selectedid: selected.id,
            ismulti: selected.is_multi
          });
        } else {
          onselect({ selectedid: null });
        }
      }
    }
  );
}


;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/edit/inspector-card.js

function inspectorcard({ name, description }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "wp-block-legacy-widget-inspector-card", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h3", { classname: "wp-block-legacy-widget-inspector-card__name", children: name }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("span", { children: description })
  ] });
}


;// external ["wp","notices"]
const external_wp_notices_namespaceobject = window["wp"]["notices"];
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","apifetch"]
const external_wp_apifetch_namespaceobject = window["wp"]["apifetch"];
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_namespaceobject);
;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/edit/control.js



class control {
  /**
   * creates and loads a new control.
   *
   * @access public
   * @param {object}   params
   * @param {string}   params.id
   * @param {string}   params.idbase
   * @param {object}   params.instance
   * @param {function} params.onchangeinstance
   * @param {function} params.onchangehaspreview
   * @param {function} params.onerror
   */
  constructor({
    id,
    idbase,
    instance,
    onchangeinstance,
    onchangehaspreview,
    onerror
  }) {
    this.id = id;
    this.idbase = idbase;
    this._instance = instance;
    this._haspreview = null;
    this.onchangeinstance = onchangeinstance;
    this.onchangehaspreview = onchangehaspreview;
    this.onerror = onerror;
    this.number = ++lastnumber;
    this.handleformchange = (0,external_wp_compose_namespaceobject.debounce)(
      this.handleformchange.bind(this),
      200
    );
    this.handleformsubmit = this.handleformsubmit.bind(this);
    this.initdom();
    this.bindevents();
    this.loadcontent();
  }
  /**
   * clean up the control so that it can be garbage collected.
   *
   * @access public
   */
  destroy() {
    this.unbindevents();
    this.element.remove();
  }
  /**
   * creates the control's dom structure.
   *
   * @access private
   */
  initdom() {
    this.element = el("div", { class: "widget open" }, [
      el("div", { class: "widget-inside" }, [
        this.form = el("form", { class: "form", method: "post" }, [
          // these hidden form inputs are what most widgets' scripts
          // use to access data about the widget.
          el("input", {
            class: "widget-id",
            type: "hidden",
            name: "widget-id",
            value: this.id ?? `${this.idbase}-${this.number}`
          }),
          el("input", {
            class: "id_base",
            type: "hidden",
            name: "id_base",
            value: this.idbase ?? this.id
          }),
          el("input", {
            class: "widget-width",
            type: "hidden",
            name: "widget-width",
            value: "250"
          }),
          el("input", {
            class: "widget-height",
            type: "hidden",
            name: "widget-height",
            value: "200"
          }),
          el("input", {
            class: "widget_number",
            type: "hidden",
            name: "widget_number",
            value: this.idbase ? this.number.tostring() : ""
          }),
          this.content = el("div", { class: "widget-content" }),
          // non-multi widgets can be saved via a save button.
          this.id && el(
            "button",
            {
              class: "button is-primary",
              type: "submit"
            },
            (0,external_wp_i18n_namespaceobject.__)("save")
          )
        ])
      ])
    ]);
  }
  /**
   * adds the control's event listeners.
   *
   * @access private
   */
  bindevents() {
    if (window.jquery) {
      const { jquery: $ } = window;
      $(this.form).on("change", null, this.handleformchange);
      $(this.form).on("input", null, this.handleformchange);
      $(this.form).on("submit", this.handleformsubmit);
    } else {
      this.form.addeventlistener("change", this.handleformchange);
      this.form.addeventlistener("input", this.handleformchange);
      this.form.addeventlistener("submit", this.handleformsubmit);
    }
  }
  /**
   * removes the control's event listeners.
   *
   * @access private
   */
  unbindevents() {
    if (window.jquery) {
      const { jquery: $ } = window;
      $(this.form).off("change", null, this.handleformchange);
      $(this.form).off("input", null, this.handleformchange);
      $(this.form).off("submit", this.handleformsubmit);
    } else {
      this.form.removeeventlistener("change", this.handleformchange);
      this.form.removeeventlistener("input", this.handleformchange);
      this.form.removeeventlistener("submit", this.handleformsubmit);
    }
  }
  /**
   * fetches the widget's form html from the rest api and loads it into the
   * control's form.
   *
   * @access private
   */
  async loadcontent() {
    try {
      if (this.id) {
        const { form } = await savewidget(this.id);
        this.content.innerhtml = form;
      } else if (this.idbase) {
        const { form, preview } = await encodewidget({
          idbase: this.idbase,
          instance: this.instance,
          number: this.number
        });
        this.content.innerhtml = form;
        this.haspreview = !isemptyhtml(preview);
        if (!this.instance.hash) {
          const { instance } = await encodewidget({
            idbase: this.idbase,
            instance: this.instance,
            number: this.number,
            formdata: serializeform(this.form)
          });
          this.instance = instance;
        }
      }
      if (window.jquery) {
        const { jquery: $ } = window;
        $(document).trigger("widget-added", [$(this.element)]);
      }
    } catch (error) {
      this.onerror(error);
    }
  }
  /**
   * perform a save when a multi widget's form is changed. non-multi widgets
   * are saved manually.
   *
   * @access private
   */
  handleformchange() {
    if (this.idbase) {
      this.saveform();
    }
  }
  /**
   * perform a save when the control's form is manually submitted.
   *
   * @access private
   * @param {event} event
   */
  handleformsubmit(event) {
    event.preventdefault();
    this.saveform();
  }
  /**
   * serialize the control's form, send it to the rest api, and update the
   * instance with the encoded instance that the rest api returns.
   *
   * @access private
   */
  async saveform() {
    const formdata = serializeform(this.form);
    try {
      if (this.id) {
        const { form } = await savewidget(this.id, formdata);
        this.content.innerhtml = form;
        if (window.jquery) {
          const { jquery: $ } = window;
          $(document).trigger("widget-updated", [
            $(this.element)
          ]);
        }
      } else if (this.idbase) {
        const { instance, preview } = await encodewidget({
          idbase: this.idbase,
          instance: this.instance,
          number: this.number,
          formdata
        });
        this.instance = instance;
        this.haspreview = !isemptyhtml(preview);
      }
    } catch (error) {
      this.onerror(error);
    }
  }
  /**
   * the widget's instance object.
   *
   * @access private
   */
  get instance() {
    return this._instance;
  }
  /**
   * the widget's instance object.
   *
   * @access private
   */
  set instance(instance) {
    if (this._instance !== instance) {
      this._instance = instance;
      this.onchangeinstance(instance);
    }
  }
  /**
   * whether or not the widget can be previewed.
   *
   * @access public
   */
  get haspreview() {
    return this._haspreview;
  }
  /**
   * whether or not the widget can be previewed.
   *
   * @access private
   */
  set haspreview(haspreview) {
    if (this._haspreview !== haspreview) {
      this._haspreview = haspreview;
      this.onchangehaspreview(haspreview);
    }
  }
}
let lastnumber = 0;
function el(tagname, attributes = {}, content = null) {
  const element = document.createelement(tagname);
  for (const [attribute, value] of object.entries(attributes)) {
    element.setattribute(attribute, value);
  }
  if (array.isarray(content)) {
    for (const child of content) {
      if (child) {
        element.appendchild(child);
      }
    }
  } else if (typeof content === "string") {
    element.innertext = content;
  }
  return element;
}
async function savewidget(id, formdata = null) {
  let widget;
  if (formdata) {
    widget = await external_wp_apifetch_default()({
      path: `/wp/v2/widgets/${id}?context=edit`,
      method: "put",
      data: {
        form_data: formdata
      }
    });
  } else {
    widget = await external_wp_apifetch_default()({
      path: `/wp/v2/widgets/${id}?context=edit`,
      method: "get"
    });
  }
  return { form: widget.rendered_form };
}
async function encodewidget({ idbase, instance, number, formdata = null }) {
  const response = await external_wp_apifetch_default()({
    path: `/wp/v2/widget-types/${idbase}/encode`,
    method: "post",
    data: {
      instance,
      number,
      form_data: formdata
    }
  });
  return {
    instance: response.instance,
    form: response.form,
    preview: response.preview
  };
}
function isemptyhtml(html) {
  const element = document.createelement("div");
  element.innerhtml = html;
  return isemptynode(element);
}
function isemptynode(node) {
  switch (node.nodetype) {
    case node.text_node:
      return node.nodevalue.trim() === "";
    case node.element_node:
      if ([
        "audio",
        "canvas",
        "embed",
        "iframe",
        "img",
        "math",
        "object",
        "svg",
        "video"
      ].includes(node.tagname)) {
        return false;
      }
      if (!node.haschildnodes()) {
        return true;
      }
      return array.from(node.childnodes).every(isemptynode);
    default:
      return true;
  }
}
function serializeform(form) {
  return new window.urlsearchparams(
    array.from(new window.formdata(form))
  ).tostring();
}


;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/edit/form.js









function form({
  title,
  isvisible,
  id,
  idbase,
  instance,
  iswide,
  onchangeinstance,
  onchangehaspreview
}) {
  const ref = (0,external_wp_element_namespaceobject.useref)();
  const ismediumlargeviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("small");
  const outgoinginstances = (0,external_wp_element_namespaceobject.useref)(/* @__pure__ */ new set());
  const incominginstances = (0,external_wp_element_namespaceobject.useref)(/* @__pure__ */ new set());
  const { createnotice } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_notices_namespaceobject.store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (incominginstances.current.has(instance)) {
      incominginstances.current.delete(instance);
      return;
    }
    const control = new control({
      id,
      idbase,
      instance,
      onchangeinstance(nextinstance) {
        outgoinginstances.current.add(instance);
        incominginstances.current.add(nextinstance);
        onchangeinstance(nextinstance);
      },
      onchangehaspreview,
      onerror(error) {
        window.console.error(error);
        createnotice(
          "error",
          (0,external_wp_i18n_namespaceobject.sprintf)(
            /* translators: %s: the name of the affected block. */
            (0,external_wp_i18n_namespaceobject.__)(
              'the "%s" block was affected by errors and may not function properly. check the developer tools for more details.'
            ),
            idbase || id
          )
        );
      }
    });
    ref.current.appendchild(control.element);
    return () => {
      if (outgoinginstances.current.has(instance)) {
        outgoinginstances.current.delete(instance);
        return;
      }
      control.destroy();
    };
  }, [
    id,
    idbase,
    instance,
    onchangeinstance,
    onchangehaspreview,
    ismediumlargeviewport
  ]);
  if (iswide && ismediumlargeviewport) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
      "div",
      {
        classname: dist_clsx({
          "wp-block-legacy-widget__container": isvisible
        }),
        children: [
          isvisible && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h3", { classname: "wp-block-legacy-widget__edit-form-title", children: title }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_components_namespaceobject.popover,
            {
              focusonmount: false,
              placement: "right",
              offset: 32,
              resize: false,
              flip: false,
              shift: true,
              children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                "div",
                {
                  ref,
                  classname: "wp-block-legacy-widget__edit-form",
                  hidden: !isvisible
                }
              )
            }
          )
        ]
      }
    );
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "div",
    {
      ref,
      classname: "wp-block-legacy-widget__edit-form",
      hidden: !isvisible,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h3", { classname: "wp-block-legacy-widget__edit-form-title", children: title })
    }
  );
}


;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/edit/preview.js







function preview({ idbase, instance, isvisible }) {
  const [isloaded, setisloaded] = (0,external_wp_element_namespaceobject.usestate)(false);
  const [srcdoc, setsrcdoc] = (0,external_wp_element_namespaceobject.usestate)("");
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const abortcontroller = typeof window.abortcontroller === "undefined" ? void 0 : new window.abortcontroller();
    async function fetchpreviewhtml() {
      const restroute = `/wp/v2/widget-types/${idbase}/render`;
      return await external_wp_apifetch_default()({
        path: restroute,
        method: "post",
        signal: abortcontroller?.signal,
        data: instance ? { instance } : {}
      });
    }
    fetchpreviewhtml().then((response) => {
      setsrcdoc(response.preview);
    }).catch((error) => {
      if ("aborterror" === error.name) {
        return;
      }
      throw error;
    });
    return () => abortcontroller?.abort();
  }, [idbase, instance]);
  const ref = (0,external_wp_compose_namespaceobject.userefeffect)(
    (iframe) => {
      if (!isloaded) {
        return;
      }
      function setheight() {
        const height = math.max(
          iframe.contentdocument.documentelement?.offsetheight ?? 0,
          iframe.contentdocument.body?.offsetheight ?? 0
        );
        iframe.style.height = `${height !== 0 ? height : 100}px`;
      }
      const { intersectionobserver } = iframe.ownerdocument.defaultview;
      const intersectionobserver = new intersectionobserver(
        ([entry]) => {
          if (entry.isintersecting) {
            setheight();
          }
        },
        {
          threshold: 1
        }
      );
      intersectionobserver.observe(iframe);
      iframe.addeventlistener("load", setheight);
      return () => {
        intersectionobserver.disconnect();
        iframe.removeeventlistener("load", setheight);
      };
    },
    [isloaded]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    isvisible && !isloaded && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.placeholder, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.spinner, {}) }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      "div",
      {
        classname: dist_clsx("wp-block-legacy-widget__edit-preview", {
          "is-offscreen": !isvisible || !isloaded
        }),
        children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.disabled, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          "iframe",
          {
            ref,
            classname: "wp-block-legacy-widget__edit-preview-iframe",
            tabindex: "-1",
            title: (0,external_wp_i18n_namespaceobject.__)("legacy widget preview"),
            srcdoc,
            onload: (event) => {
              event.target.contentdocument.body.style.overflow = "hidden";
              setisloaded(true);
            },
            height: 100
          }
        ) })
      }
    )
  ] });
}


;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/edit/no-preview.js


function nopreview({ name }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "wp-block-legacy-widget__edit-no-preview", children: [
    name && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h3", { children: name }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { children: (0,external_wp_i18n_namespaceobject.__)("no preview available.") })
  ] });
}


;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/edit/convert-to-blocks-button.js






function converttoblocksbutton({ clientid, rawinstance }) {
  const { replaceblocks } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_blockeditor_namespaceobject.store);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.toolbarbutton,
    {
      onclick: () => {
        if (rawinstance.title) {
          replaceblocks(clientid, [
            (0,external_wp_blocks_namespaceobject.createblock)("core/heading", {
              content: rawinstance.title
            }),
            ...(0,external_wp_blocks_namespaceobject.rawhandler)({ html: rawinstance.text })
          ]);
        } else {
          replaceblocks(
            clientid,
            (0,external_wp_blocks_namespaceobject.rawhandler)({ html: rawinstance.text })
          );
        }
      },
      children: (0,external_wp_i18n_namespaceobject.__)("convert to blocks")
    }
  );
}


;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/edit/index.js














function edit(props) {
  const { id, idbase } = props.attributes;
  const { iswide = false } = props;
  const blockprops = (0,external_wp_blockeditor_namespaceobject.useblockprops)({
    classname: dist_clsx({
      "is-wide-widget": iswide
    })
  });
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { ...blockprops, children: !id && !idbase ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(empty, { ...props }) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(notempty, { ...props }) });
}
function empty({ attributes: { id, idbase }, setattributes }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.placeholder,
    {
      icon: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockicon, { icon: brush_default }),
      label: (0,external_wp_i18n_namespaceobject.__)("legacy widget"),
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.flex, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.flexblock, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        widgettypeselector,
        {
          selectedid: id ?? idbase,
          onselect: ({ selectedid, ismulti }) => {
            if (!selectedid) {
              setattributes({
                id: null,
                idbase: null,
                instance: null
              });
            } else if (ismulti) {
              setattributes({
                id: null,
                idbase: selectedid,
                instance: {}
              });
            } else {
              setattributes({
                id: selectedid,
                idbase: null,
                instance: null
              });
            }
          }
        }
      ) }) })
    }
  );
}
function notempty({
  attributes: { id, idbase, instance },
  setattributes,
  clientid,
  isselected,
  iswide = false
}) {
  const [haspreview, sethaspreview] = (0,external_wp_element_namespaceobject.usestate)(null);
  const widgettypeid = id ?? idbase;
  const { record: widgettype, hasresolved: hasresolvedwidgettype } = (0,external_wp_coredata_namespaceobject.useentityrecord)("root", "widgettype", widgettypeid);
  const setinstance = (0,external_wp_element_namespaceobject.usecallback)((nextinstance) => {
    setattributes({ instance: nextinstance });
  }, []);
  if (!widgettype && hasresolvedwidgettype) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.placeholder,
      {
        icon: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockicon, { icon: brush_default }),
        label: (0,external_wp_i18n_namespaceobject.__)("legacy widget"),
        children: (0,external_wp_i18n_namespaceobject.__)("widget is missing.")
      }
    );
  }
  if (!hasresolvedwidgettype) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.placeholder, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.spinner, {}) });
  }
  const mode = idbase && !isselected ? "preview" : "edit";
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    idbase === "text" && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockcontrols, { group: "other", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      converttoblocksbutton,
      {
        clientid,
        rawinstance: instance.raw
      }
    ) }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.inspectorcontrols, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      inspectorcard,
      {
        name: widgettype.name,
        description: widgettype.description
      }
    ) }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      form,
      {
        title: widgettype.name,
        isvisible: mode === "edit",
        id,
        idbase,
        instance,
        iswide,
        onchangeinstance: setinstance,
        onchangehaspreview: sethaspreview
      }
    ),
    idbase && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      haspreview === null && mode === "preview" && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.placeholder, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.spinner, {}) }),
      haspreview === true && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        preview,
        {
          idbase,
          instance,
          isvisible: mode === "preview"
        }
      ),
      haspreview === false && mode === "preview" && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(nopreview, { name: widgettype.name })
    ] })
  ] });
}


;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/transforms.js

const legacywidgettransforms = [
  {
    block: "core/calendar",
    widget: "calendar"
  },
  {
    block: "core/search",
    widget: "search"
  },
  {
    block: "core/html",
    widget: "custom_html",
    transform: ({ content }) => ({
      content
    })
  },
  {
    block: "core/archives",
    widget: "archives",
    transform: ({ count, dropdown }) => {
      return {
        displayasdropdown: !!dropdown,
        showpostcounts: !!count
      };
    }
  },
  {
    block: "core/latest-posts",
    widget: "recent-posts",
    transform: ({ show_date: displaypostdate, number }) => {
      return {
        displaypostdate: !!displaypostdate,
        poststoshow: number
      };
    }
  },
  {
    block: "core/latest-comments",
    widget: "recent-comments",
    transform: ({ number }) => {
      return {
        commentstoshow: number
      };
    }
  },
  {
    block: "core/tag-cloud",
    widget: "tag_cloud",
    transform: ({ taxonomy, count }) => {
      return {
        showtagcounts: !!count,
        taxonomy
      };
    }
  },
  {
    block: "core/categories",
    widget: "categories",
    transform: ({ count, dropdown, hierarchical }) => {
      return {
        displayasdropdown: !!dropdown,
        showpostcounts: !!count,
        showhierarchy: !!hierarchical
      };
    }
  },
  {
    block: "core/audio",
    widget: "media_audio",
    transform: ({ url, preload, loop, attachment_id: id }) => {
      return {
        src: url,
        id,
        preload,
        loop
      };
    }
  },
  {
    block: "core/video",
    widget: "media_video",
    transform: ({ url, preload, loop, attachment_id: id }) => {
      return {
        src: url,
        id,
        preload,
        loop
      };
    }
  },
  {
    block: "core/image",
    widget: "media_image",
    transform: ({
      alt,
      attachment_id: id,
      caption,
      height,
      link_classes: linkclass,
      link_rel: rel,
      link_target_blank: targetblack,
      link_type: linkdestination,
      link_url: link,
      size: sizeslug,
      url,
      width
    }) => {
      return {
        alt,
        caption,
        height,
        id,
        link,
        linkclass,
        linkdestination,
        linktarget: targetblack ? "_blank" : void 0,
        rel,
        sizeslug,
        url,
        width
      };
    }
  },
  {
    block: "core/gallery",
    widget: "media_gallery",
    transform: ({ ids, link_type: linkto, size, number }) => {
      return {
        ids,
        columns: number,
        linkto,
        sizeslug: size,
        images: ids.map((id) => ({
          id
        }))
      };
    }
  },
  {
    block: "core/rss",
    widget: "rss",
    transform: ({
      url,
      show_author: displayauthor,
      show_date: displaydate,
      show_summary: displayexcerpt,
      items
    }) => {
      return {
        feedurl: url,
        displayauthor: !!displayauthor,
        displaydate: !!displaydate,
        displayexcerpt: !!displayexcerpt,
        itemstoshow: items
      };
    }
  }
].map(({ block, widget, transform }) => {
  return {
    type: "block",
    blocks: [block],
    ismatch: ({ idbase, instance }) => {
      return idbase === widget && !!instance?.raw;
    },
    transform: ({ instance }) => {
      const transformedblock = (0,external_wp_blocks_namespaceobject.createblock)(
        block,
        transform ? transform(instance.raw) : void 0
      );
      if (!instance.raw?.title) {
        return transformedblock;
      }
      return [
        (0,external_wp_blocks_namespaceobject.createblock)("core/heading", {
          content: instance.raw.title
        }),
        transformedblock
      ];
    }
  };
});
const transforms = {
  to: legacywidgettransforms
};
var transforms_default = transforms;


;// ./node_modules/@wordpress/widgets/build-module/blocks/legacy-widget/index.js




const { name: legacy_widget_name } = block_namespaceobject;
const settings = {
  icon: widget_default,
  edit: edit,
  transforms: transforms_default
};


;// ./node_modules/@wordpress/icons/build-module/library/group.js


var group_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { viewbox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m18 4h-7c-1.1 0-2 .9-2 2v3h6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2v-3h3c1.1 0 2-.9 2-2v6c0-1.1-.9-2-2-2zm-4.5 14c0 .3-.2.5-.5.5h6c-.3 0-.5-.2-.5-.5v-7c0-.3.2-.5.5-.5h3v13c0 1.1.9 2 2 2h2.5v3zm0-4.5h11c-.3 0-.5-.2-.5-.5v-2.5h13c.3 0 .5.2.5.5v2.5zm5-.5c0 .3-.2.5-.5.5h-3v11c0-1.1-.9-2-2-2h-2.5v6c0-.3.2-.5.5-.5h7c.3 0 .5.2.5.5v7z" }) });


;// ./node_modules/@wordpress/widgets/build-module/blocks/widget-group/block.json
const widget_group_block_namespaceobject = /*#__pure__*/json.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiversion":3,"name":"core/widget-group","title":"widget group","category":"widgets","attributes":{"title":{"type":"string"}},"supports":{"html":false,"inserter":true,"customclassname":true,"reusable":false},"editorstyle":"wp-block-widget-group-editor","style":"wp-block-widget-group"}');
;// ./node_modules/@wordpress/widgets/build-module/blocks/widget-group/edit.js






function edit_edit(props) {
  const { clientid } = props;
  const { innerblocks } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(external_wp_blockeditor_namespaceobject.store).getblock(clientid),
    [clientid]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { ...(0,external_wp_blockeditor_namespaceobject.useblockprops)({ classname: "widget" }), children: innerblocks.length === 0 ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(placeholdercontent, { ...props }) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(previewcontent, { ...props }) });
}
function placeholdercontent({ clientid }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.placeholder,
      {
        classname: "wp-block-widget-group__placeholder",
        icon: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockicon, { icon: group_default }),
        label: (0,external_wp_i18n_namespaceobject.__)("widget group"),
        children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.buttonblockappender, { rootclientid: clientid })
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.innerblocks, { renderappender: false })
  ] });
}
function previewcontent({ attributes, setattributes }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtext,
      {
        tagname: "h2",
        identifier: "title",
        classname: "widget-title",
        allowedformats: [],
        placeholder: (0,external_wp_i18n_namespaceobject.__)("title"),
        value: attributes.title ?? "",
        onchange: (title) => setattributes({ title })
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.innerblocks, {})
  ] });
}


;// ./node_modules/@wordpress/widgets/build-module/blocks/widget-group/save.js


function save({ attributes }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.richtext.content,
      {
        tagname: "h2",
        classname: "widget-title",
        value: attributes.title
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "wp-widget-group__inner-blocks", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.innerblocks.content, {}) })
  ] });
}


;// ./node_modules/@wordpress/widgets/build-module/blocks/widget-group/deprecated.js


const v1 = {
  attributes: {
    title: {
      type: "string"
    }
  },
  supports: {
    html: false,
    inserter: true,
    customclassname: true,
    reusable: false
  },
  save({ attributes }) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_blockeditor_namespaceobject.richtext.content,
        {
          tagname: "h2",
          classname: "widget-title",
          value: attributes.title
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.innerblocks.content, {})
    ] });
  }
};
var deprecated_default = [v1];


;// ./node_modules/@wordpress/widgets/build-module/blocks/widget-group/index.js







const { name: widget_group_name } = widget_group_block_namespaceobject;
const widget_group_settings = {
  title: (0,external_wp_i18n_namespaceobject.__)("widget group"),
  description: (0,external_wp_i18n_namespaceobject.__)(
    "create a classic widget layout with a title that\u2019s styled by your theme for your widget areas."
  ),
  icon: group_default,
  __experimentallabel: ({ name: label }) => label,
  edit: edit_edit,
  save: save,
  transforms: {
    from: [
      {
        type: "block",
        ismultiblock: true,
        blocks: ["*"],
        ismatch(attributes, blocks) {
          return !blocks.some(
            (block) => block.name === "core/widget-group"
          );
        },
        __experimentalconvert(blocks) {
          let innerblocks = [
            ...blocks.map((block) => {
              return (0,external_wp_blocks_namespaceobject.createblock)(
                block.name,
                block.attributes,
                block.innerblocks
              );
            })
          ];
          const firstheadingblock = innerblocks[0].name === "core/heading" ? innerblocks[0] : null;
          innerblocks = innerblocks.filter(
            (block) => block !== firstheadingblock
          );
          return (0,external_wp_blocks_namespaceobject.createblock)(
            "core/widget-group",
            {
              ...firstheadingblock && {
                title: firstheadingblock.attributes.content
              }
            },
            innerblocks
          );
        }
      }
    ]
  },
  deprecated: deprecated_default
};


;// ./node_modules/@wordpress/icons/build-module/library/move-to.js


var move_to_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m19.75 9c0-1.257-.565-2.197-1.39-2.858-.797-.64-1.827-1.017-2.815-1.247-1.802-.42-3.703-.403-4.383-.396l11 4.5v6l.177-.001c.696-.006 2.416-.02 4.028.356.887.207 1.67.518 2.216.957.52.416.829.945.829 1.688 0 .592-.167.966-.407 1.23-.255.281-.656.508-1.236.674-1.19.34-2.82.346-4.607.346h-.077c-1.692 0-3.527 0-4.942.404-.732.209-1.424.545-1.935 1.108-.526.579-.796 1.33-.796 2.238 0 1.257.565 2.197 1.39 2.858.797.64 1.827 1.017 2.815 1.247 1.802.42 3.703.403 4.383.396l13 19.5h.714v22l18 18.5 13.714 15v3h13l-.177.001c-.696.006-2.416.02-4.028-.356-.887-.207-1.67-.518-2.216-.957-.52-.416-.829-.945-.829-1.688 0-.592.167-.966.407-1.23.255-.281.656-.508 1.237-.674 1.189-.34 2.819-.346 4.606-.346h.077c1.692 0 3.527 0 4.941-.404.732-.209 1.425-.545 1.936-1.108.526-.579.796-1.33.796-2.238z" }) });


;// ./node_modules/@wordpress/widgets/build-module/components/move-to-widget-area/index.js




function movetowidgetarea({
  currentwidgetareaid,
  widgetareas,
  onselect
}) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.toolbargroup, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.toolbaritem, { children: (toggleprops) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.dropdownmenu,
    {
      icon: move_to_default,
      label: (0,external_wp_i18n_namespaceobject.__)("move to widget area"),
      toggleprops,
      children: ({ onclose }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menugroup, { label: (0,external_wp_i18n_namespaceobject.__)("move to"), children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_components_namespaceobject.menuitemschoice,
        {
          choices: widgetareas.map(
            (widgetarea) => ({
              value: widgetarea.id,
              label: widgetarea.name,
              info: widgetarea.description
            })
          ),
          value: currentwidgetareaid,
          onselect: (value) => {
            onselect(value);
            onclose();
          }
        }
      ) })
    }
  ) }) });
}


;// ./node_modules/@wordpress/widgets/build-module/components/index.js



;// ./node_modules/@wordpress/widgets/build-module/utils.js
function getwidgetidfromblock(block) {
  return block.attributes.__internalwidgetid;
}
function addwidgetidtoblock(block, widgetid) {
  return {
    ...block,
    attributes: {
      ...block.attributes || {},
      __internalwidgetid: widgetid
    }
  };
}


;// ./node_modules/@wordpress/widgets/build-module/register-legacy-widget-variations.js



function registerlegacywidgetvariations(settings) {
  const unsubscribe = (0,external_wp_data_namespaceobject.subscribe)(() => {
    const hiddenids = settings?.widgettypestohidefromlegacywidgetblock ?? [];
    const widgettypes = (0,external_wp_data_namespaceobject.select)(external_wp_coredata_namespaceobject.store).getwidgettypes({ per_page: -1 })?.filter((widgettype) => !hiddenids.includes(widgettype.id));
    if (widgettypes) {
      unsubscribe();
      (0,external_wp_data_namespaceobject.dispatch)(external_wp_blocks_namespaceobject.store).addblockvariations(
        "core/legacy-widget",
        widgettypes.map((widgettype) => ({
          name: widgettype.id,
          title: widgettype.name,
          description: widgettype.description,
          attributes: widgettype.is_multi ? {
            idbase: widgettype.id,
            instance: {}
          } : {
            id: widgettype.id
          }
        }))
      );
    }
  });
}


;// ./node_modules/@wordpress/widgets/build-module/index.js





function registerlegacywidgetblock(supports = {}) {
  const { /* metadata */ "yu": metadata, /* settings */ "w0": settings, /* name */ "uu": name } = legacy_widget_namespaceobject;
  (0,external_wp_blocks_namespaceobject.registerblocktype)(
    { name, ...metadata },
    {
      ...settings,
      supports: {
        ...settings.supports,
        ...supports
      }
    }
  );
}
function registerwidgetgroupblock(supports = {}) {
  const { /* metadata */ "yu": metadata, /* settings */ "w0": settings, /* name */ "uu": name } = widget_group_namespaceobject;
  (0,external_wp_blocks_namespaceobject.registerblocktype)(
    { name, ...metadata },
    {
      ...settings,
      supports: {
        ...settings.supports,
        ...supports
      }
    }
  );
}



(window.wp = window.wp || {}).widgets = __webpack_exports__;
/******/ })()
;





