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
  richtextdata: () => (/* reexport */ richtextdata),
  __experimentalrichtext: () => (/* reexport */ __experimentalrichtext),
  __unstablecreateelement: () => (/* reexport */ createelement),
  __unstabletodom: () => (/* reexport */ todom),
  __unstableuserichtext: () => (/* reexport */ userichtext),
  applyformat: () => (/* reexport */ applyformat),
  concat: () => (/* reexport */ concat),
  create: () => (/* reexport */ create),
  getactiveformat: () => (/* reexport */ getactiveformat),
  getactiveformats: () => (/* reexport */ getactiveformats),
  getactiveobject: () => (/* reexport */ getactiveobject),
  gettextcontent: () => (/* reexport */ gettextcontent),
  insert: () => (/* reexport */ insert),
  insertobject: () => (/* reexport */ insertobject),
  iscollapsed: () => (/* reexport */ iscollapsed),
  isempty: () => (/* reexport */ isempty),
  join: () => (/* reexport */ join),
  registerformattype: () => (/* reexport */ registerformattype),
  remove: () => (/* reexport */ remove_remove),
  removeformat: () => (/* reexport */ removeformat),
  replace: () => (/* reexport */ replace_replace),
  slice: () => (/* reexport */ slice),
  split: () => (/* reexport */ split),
  store: () => (/* reexport */ store),
  tohtmlstring: () => (/* reexport */ tohtmlstring),
  toggleformat: () => (/* reexport */ toggleformat),
  unregisterformattype: () => (/* reexport */ unregisterformattype),
  useanchor: () => (/* reexport */ useanchor),
  useanchorref: () => (/* reexport */ useanchorref)
});

// namespace object: ./node_modules/@wordpress/rich-text/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  getformattype: () => (getformattype),
  getformattypeforbareelement: () => (getformattypeforbareelement),
  getformattypeforclassname: () => (getformattypeforclassname),
  getformattypes: () => (getformattypes)
});

// namespace object: ./node_modules/@wordpress/rich-text/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  addformattypes: () => (addformattypes),
  removeformattypes: () => (removeformattypes)
});

;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/rich-text/build-module/store/reducer.js

function formattypes(state = {}, action) {
  switch (action.type) {
    case "add_format_types":
      return {
        ...state,
        // key format types by their name.
        ...action.formattypes.reduce(
          (newformattypes, type) => ({
            ...newformattypes,
            [type.name]: type
          }),
          {}
        )
      };
    case "remove_format_types":
      return object.fromentries(
        object.entries(state).filter(
          ([key]) => !action.names.includes(key)
        )
      );
  }
  return state;
}
var reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({ formattypes });


;// ./node_modules/@wordpress/rich-text/build-module/store/selectors.js

const getformattypes = (0,external_wp_data_namespaceobject.createselector)(
  (state) => object.values(state.formattypes),
  (state) => [state.formattypes]
);
function getformattype(state, name) {
  return state.formattypes[name];
}
function getformattypeforbareelement(state, bareelementtagname) {
  const formattypes = getformattypes(state);
  return formattypes.find(({ classname, tagname }) => {
    return classname === null && bareelementtagname === tagname;
  }) || formattypes.find(({ classname, tagname }) => {
    return classname === null && "*" === tagname;
  });
}
function getformattypeforclassname(state, elementclassname) {
  return getformattypes(state).find(({ classname }) => {
    if (classname === null) {
      return false;
    }
    return ` ${elementclassname} `.indexof(` ${classname} `) >= 0;
  });
}


;// ./node_modules/@wordpress/rich-text/build-module/store/actions.js
function addformattypes(formattypes) {
  return {
    type: "add_format_types",
    formattypes: array.isarray(formattypes) ? formattypes : [formattypes]
  };
}
function removeformattypes(names) {
  return {
    type: "remove_format_types",
    names: array.isarray(names) ? names : [names]
  };
}


;// ./node_modules/@wordpress/rich-text/build-module/store/index.js




const store_name = "core/rich-text";
const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  reducer: reducer_default,
  selectors: selectors_namespaceobject,
  actions: actions_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);


;// ./node_modules/@wordpress/rich-text/build-module/is-format-equal.js
function isformatequal(format1, format2) {
  if (format1 === format2) {
    return true;
  }
  if (!format1 || !format2) {
    return false;
  }
  if (format1.type !== format2.type) {
    return false;
  }
  const attributes1 = format1.attributes;
  const attributes2 = format2.attributes;
  if (attributes1 === attributes2) {
    return true;
  }
  if (!attributes1 || !attributes2) {
    return false;
  }
  const keys1 = object.keys(attributes1);
  const keys2 = object.keys(attributes2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  const length = keys1.length;
  for (let i = 0; i < length; i++) {
    const name = keys1[i];
    if (attributes1[name] !== attributes2[name]) {
      return false;
    }
  }
  return true;
}


;// ./node_modules/@wordpress/rich-text/build-module/normalise-formats.js

function normaliseformats(value) {
  const newformats = value.formats.slice();
  newformats.foreach((formatsatindex, index) => {
    const formatsatpreviousindex = newformats[index - 1];
    if (formatsatpreviousindex) {
      const newformatsatindex = formatsatindex.slice();
      newformatsatindex.foreach((format, formatindex) => {
        const previousformat = formatsatpreviousindex[formatindex];
        if (isformatequal(format, previousformat)) {
          newformatsatindex[formatindex] = previousformat;
        }
      });
      newformats[index] = newformatsatindex;
    }
  });
  return {
    ...value,
    formats: newformats
  };
}


;// ./node_modules/@wordpress/rich-text/build-module/apply-format.js

function replace(array, index, value) {
  array = array.slice();
  array[index] = value;
  return array;
}
function applyformat(value, format, startindex = value.start, endindex = value.end) {
  const { formats, activeformats } = value;
  const newformats = formats.slice();
  if (startindex === endindex) {
    const startformat = newformats[startindex]?.find(
      ({ type }) => type === format.type
    );
    if (startformat) {
      const index = newformats[startindex].indexof(startformat);
      while (newformats[startindex] && newformats[startindex][index] === startformat) {
        newformats[startindex] = replace(
          newformats[startindex],
          index,
          format
        );
        startindex--;
      }
      endindex++;
      while (newformats[endindex] && newformats[endindex][index] === startformat) {
        newformats[endindex] = replace(
          newformats[endindex],
          index,
          format
        );
        endindex++;
      }
    }
  } else {
    let position = infinity;
    for (let index = startindex; index < endindex; index++) {
      if (newformats[index]) {
        newformats[index] = newformats[index].filter(
          ({ type }) => type !== format.type
        );
        const length = newformats[index].length;
        if (length < position) {
          position = length;
        }
      } else {
        newformats[index] = [];
        position = 0;
      }
    }
    for (let index = startindex; index < endindex; index++) {
      newformats[index].splice(position, 0, format);
    }
  }
  return normaliseformats({
    ...value,
    formats: newformats,
    // always revise active formats. this serves as a placeholder for new
    // inputs with the format so new input appears with the format applied,
    // and ensures a format of the same type uses the latest values.
    activeformats: [
      ...activeformats?.filter(
        ({ type }) => type !== format.type
      ) || [],
      format
    ]
  });
}


;// ./node_modules/@wordpress/rich-text/build-module/create-element.js
function createelement({ implementation }, html) {
  if (!createelement.body) {
    createelement.body = implementation.createhtmldocument("").body;
  }
  createelement.body.innerhtml = html;
  return createelement.body;
}


;// ./node_modules/@wordpress/rich-text/build-module/special-characters.js
const object_replacement_character = "\ufffc";
const zwnbsp = "\ufeff";


;// external ["wp","escapehtml"]
const external_wp_escapehtml_namespaceobject = window["wp"]["escapehtml"];
;// ./node_modules/@wordpress/rich-text/build-module/get-active-formats.js

function getactiveformats(value, empty_active_formats = []) {
  const { formats, start, end, activeformats } = value;
  if (start === void 0) {
    return empty_active_formats;
  }
  if (start === end) {
    if (activeformats) {
      return activeformats;
    }
    const formatsbefore = formats[start - 1] || empty_active_formats;
    const formatsafter = formats[start] || empty_active_formats;
    if (formatsbefore.length < formatsafter.length) {
      return formatsbefore;
    }
    return formatsafter;
  }
  if (!formats[start]) {
    return empty_active_formats;
  }
  const selectedformats = formats.slice(start, end);
  const _activeformats = [...selectedformats[0]];
  let i = selectedformats.length;
  while (i--) {
    const formatsatindex = selectedformats[i];
    if (!formatsatindex) {
      return empty_active_formats;
    }
    let ii = _activeformats.length;
    while (ii--) {
      const format = _activeformats[ii];
      if (!formatsatindex.find(
        (_format) => isformatequal(format, _format)
      )) {
        _activeformats.splice(ii, 1);
      }
    }
    if (_activeformats.length === 0) {
      return empty_active_formats;
    }
  }
  return _activeformats || empty_active_formats;
}


;// ./node_modules/@wordpress/rich-text/build-module/get-format-type.js


function get_format_type_getformattype(name) {
  return (0,external_wp_data_namespaceobject.select)(store).getformattype(name);
}


;// ./node_modules/@wordpress/rich-text/build-module/to-tree.js



function restoreonattributes(attributes, iseditabletree) {
  if (iseditabletree) {
    return attributes;
  }
  const newattributes = {};
  for (const key in attributes) {
    let newkey = key;
    if (key.startswith("data-disable-rich-text-")) {
      newkey = key.slice("data-disable-rich-text-".length);
    }
    newattributes[newkey] = attributes[key];
  }
  return newattributes;
}
function fromformat({
  type,
  tagname,
  attributes,
  unregisteredattributes,
  object,
  boundaryclass,
  iseditabletree
}) {
  const formattype = get_format_type_getformattype(type);
  let elementattributes = {};
  if (boundaryclass && iseditabletree) {
    elementattributes["data-rich-text-format-boundary"] = "true";
  }
  if (!formattype) {
    if (attributes) {
      elementattributes = { ...attributes, ...elementattributes };
    }
    return {
      type,
      attributes: restoreonattributes(
        elementattributes,
        iseditabletree
      ),
      object
    };
  }
  elementattributes = { ...unregisteredattributes, ...elementattributes };
  for (const name in attributes) {
    const key = formattype.attributes ? formattype.attributes[name] : false;
    if (key) {
      elementattributes[key] = attributes[name];
    } else {
      elementattributes[name] = attributes[name];
    }
  }
  if (formattype.classname) {
    if (elementattributes.class) {
      elementattributes.class = `${formattype.classname} ${elementattributes.class}`;
    } else {
      elementattributes.class = formattype.classname;
    }
  }
  return {
    type: tagname || formattype.tagname,
    object: formattype.object,
    attributes: restoreonattributes(elementattributes, iseditabletree)
  };
}
function isequaluntil(a, b, index) {
  do {
    if (a[index] !== b[index]) {
      return false;
    }
  } while (index--);
  return true;
}
function totree({
  value,
  preservewhitespace,
  createempty,
  append,
  getlastchild,
  getparent,
  istext,
  gettext,
  remove,
  appendtext,
  onstartindex,
  onendindex,
  iseditabletree,
  placeholder
}) {
  const { formats, replacements, text, start, end } = value;
  const formatslength = formats.length + 1;
  const tree = createempty();
  const activeformats = getactiveformats(value);
  const deepestactiveformat = activeformats[activeformats.length - 1];
  let lastcharacterformats;
  let lastcharacter;
  append(tree, "");
  for (let i = 0; i < formatslength; i++) {
    const character = text.charat(i);
    const shouldinsertpadding = iseditabletree && // pad the line if the line is empty.
    (!lastcharacter || // pad the line if the previous character is a line break, otherwise
    // the line break won't be visible.
    lastcharacter === "\n");
    const characterformats = formats[i];
    let pointer = getlastchild(tree);
    if (characterformats) {
      characterformats.foreach((format, formatindex) => {
        if (pointer && lastcharacterformats && // reuse the last element if all formats remain the same.
        isequaluntil(
          characterformats,
          lastcharacterformats,
          formatindex
        )) {
          pointer = getlastchild(pointer);
          return;
        }
        const { type, tagname, attributes, unregisteredattributes } = format;
        const boundaryclass = iseditabletree && format === deepestactiveformat;
        const parent = getparent(pointer);
        const newnode = append(
          parent,
          fromformat({
            type,
            tagname,
            attributes,
            unregisteredattributes,
            boundaryclass,
            iseditabletree
          })
        );
        if (istext(pointer) && gettext(pointer).length === 0) {
          remove(pointer);
        }
        pointer = append(newnode, "");
      });
    }
    if (i === 0) {
      if (onstartindex && start === 0) {
        onstartindex(tree, pointer);
      }
      if (onendindex && end === 0) {
        onendindex(tree, pointer);
      }
    }
    if (character === object_replacement_character) {
      const replacement = replacements[i];
      if (!replacement) {
        continue;
      }
      const { type, attributes, innerhtml } = replacement;
      const formattype = get_format_type_getformattype(type);
      if (iseditabletree && type === "#comment") {
        pointer = append(getparent(pointer), {
          type: "span",
          attributes: {
            contenteditable: "false",
            "data-rich-text-comment": attributes["data-rich-text-comment"]
          }
        });
        append(
          append(pointer, { type: "span" }),
          attributes["data-rich-text-comment"].trim()
        );
      } else if (!iseditabletree && type === "script") {
        pointer = append(
          getparent(pointer),
          fromformat({
            type: "script",
            iseditabletree
          })
        );
        append(pointer, {
          html: decodeuricomponent(
            attributes["data-rich-text-script"]
          )
        });
      } else if (formattype?.contenteditable === false) {
        if (innerhtml || iseditabletree) {
          pointer = getparent(pointer);
          if (iseditabletree) {
            const attrs = {
              contenteditable: "false",
              "data-rich-text-bogus": true
            };
            if (start === i && end === i + 1) {
              attrs["data-rich-text-format-boundary"] = true;
            }
            pointer = append(pointer, {
              type: "span",
              attributes: attrs
            });
            if (iseditabletree && i + 1 === text.length) {
              append(getparent(pointer), zwnbsp);
            }
          }
          pointer = append(
            pointer,
            fromformat({
              ...replacement,
              iseditabletree
            })
          );
          if (innerhtml) {
            append(pointer, {
              html: innerhtml
            });
          }
        }
      } else {
        pointer = append(
          getparent(pointer),
          fromformat({
            ...replacement,
            object: true,
            iseditabletree
          })
        );
      }
      pointer = append(getparent(pointer), "");
    } else if (!preservewhitespace && character === "\n") {
      pointer = append(getparent(pointer), {
        type: "br",
        attributes: iseditabletree ? {
          "data-rich-text-line-break": "true"
        } : void 0,
        object: true
      });
      pointer = append(getparent(pointer), "");
    } else if (!istext(pointer)) {
      pointer = append(getparent(pointer), character);
    } else {
      appendtext(pointer, character);
    }
    if (onstartindex && start === i + 1) {
      onstartindex(tree, pointer);
    }
    if (onendindex && end === i + 1) {
      onendindex(tree, pointer);
    }
    if (shouldinsertpadding && i === text.length) {
      append(getparent(pointer), zwnbsp);
      if (placeholder && text.length === 0) {
        append(getparent(pointer), {
          type: "span",
          attributes: {
            "data-rich-text-placeholder": placeholder,
            // necessary to prevent the placeholder from catching
            // selection and being editable.
            style: "pointer-events:none;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;"
          }
        });
      }
    }
    lastcharacterformats = characterformats;
    lastcharacter = character;
  }
  return tree;
}


;// ./node_modules/@wordpress/rich-text/build-module/to-html-string.js


function tohtmlstring({ value, preservewhitespace }) {
  const tree = totree({
    value,
    preservewhitespace,
    createempty,
    append,
    getlastchild,
    getparent,
    istext,
    gettext,
    remove,
    appendtext
  });
  return createchildrenhtml(tree.children);
}
function createempty() {
  return {};
}
function getlastchild({ children }) {
  return children && children[children.length - 1];
}
function append(parent, object) {
  if (typeof object === "string") {
    object = { text: object };
  }
  object.parent = parent;
  parent.children = parent.children || [];
  parent.children.push(object);
  return object;
}
function appendtext(object, text) {
  object.text += text;
}
function getparent({ parent }) {
  return parent;
}
function istext({ text }) {
  return typeof text === "string";
}
function gettext({ text }) {
  return text;
}
function remove(object) {
  const index = object.parent.children.indexof(object);
  if (index !== -1) {
    object.parent.children.splice(index, 1);
  }
  return object;
}
function createelementhtml({ type, attributes, object, children }) {
  if (type === "#comment") {
    return `<!--${attributes["data-rich-text-comment"]}-->`;
  }
  let attributestring = "";
  for (const key in attributes) {
    if (!(0,external_wp_escapehtml_namespaceobject.isvalidattributename)(key)) {
      continue;
    }
    attributestring += ` ${key}="${(0,external_wp_escapehtml_namespaceobject.escapeattribute)(
      attributes[key]
    )}"`;
  }
  if (object) {
    return `<${type}${attributestring}>`;
  }
  return `<${type}${attributestring}>${createchildrenhtml(
    children
  )}</${type}>`;
}
function createchildrenhtml(children = []) {
  return children.map((child) => {
    if (child.html !== void 0) {
      return child.html;
    }
    return child.text === void 0 ? createelementhtml(child) : (0,external_wp_escapehtml_namespaceobject.escapeeditablehtml)(child.text);
  }).join("");
}


;// ./node_modules/@wordpress/rich-text/build-module/get-text-content.js

function gettextcontent({ text }) {
  return text.replace(object_replacement_character, "");
}


;// ./node_modules/@wordpress/rich-text/build-module/create.js







function createemptyvalue() {
  return {
    formats: [],
    replacements: [],
    text: ""
  };
}
function toformat({ tagname, attributes }) {
  let formattype;
  if (attributes && attributes.class) {
    formattype = (0,external_wp_data_namespaceobject.select)(store).getformattypeforclassname(
      attributes.class
    );
    if (formattype) {
      attributes.class = ` ${attributes.class} `.replace(` ${formattype.classname} `, " ").trim();
      if (!attributes.class) {
        delete attributes.class;
      }
    }
  }
  if (!formattype) {
    formattype = (0,external_wp_data_namespaceobject.select)(store).getformattypeforbareelement(tagname);
  }
  if (!formattype) {
    return attributes ? { type: tagname, attributes } : { type: tagname };
  }
  if (formattype.__experimentalcreateprepareeditabletree && !formattype.__experimentalcreateonchangeeditablevalue) {
    return null;
  }
  if (!attributes) {
    return { formattype, type: formattype.name, tagname };
  }
  const registeredattributes = {};
  const unregisteredattributes = {};
  const _attributes = { ...attributes };
  for (const key in formattype.attributes) {
    const name = formattype.attributes[key];
    registeredattributes[key] = _attributes[name];
    delete _attributes[name];
    if (typeof registeredattributes[key] === "undefined") {
      delete registeredattributes[key];
    }
  }
  for (const name in _attributes) {
    unregisteredattributes[name] = attributes[name];
  }
  if (formattype.contenteditable === false) {
    delete unregisteredattributes.contenteditable;
  }
  return {
    formattype,
    type: formattype.name,
    tagname,
    attributes: registeredattributes,
    unregisteredattributes
  };
}
class richtextdata {
  #value;
  static empty() {
    return new richtextdata();
  }
  static fromplaintext(text) {
    return new richtextdata(create({ text }));
  }
  static fromhtmlstring(html) {
    return new richtextdata(create({ html }));
  }
  /**
   * create a richtextdata instance from an html element.
   *
   * @param {htmlelement}                    htmlelement the html element to create the instance from.
   * @param {{preservewhitespace?: boolean}} options     options.
   * @return {richtextdata} the richtextdata instance.
   */
  static fromhtmlelement(htmlelement, options = {}) {
    const { preservewhitespace = false } = options;
    const element = preservewhitespace ? htmlelement : collapsewhitespace(htmlelement);
    const richtextdata = new richtextdata(create({ element }));
    object.defineproperty(richtextdata, "originalhtml", {
      value: htmlelement.innerhtml
    });
    return richtextdata;
  }
  constructor(init = createemptyvalue()) {
    this.#value = init;
  }
  toplaintext() {
    return gettextcontent(this.#value);
  }
  // we could expose `tohtmlelement` at some point as well, but we'd only use
  // it internally.
  /**
   * convert the rich text value to an html string.
   *
   * @param {{preservewhitespace?: boolean}} options options.
   * @return {string} the html string.
   */
  tohtmlstring({ preservewhitespace } = {}) {
    return this.originalhtml || tohtmlstring({ value: this.#value, preservewhitespace });
  }
  valueof() {
    return this.tohtmlstring();
  }
  tostring() {
    return this.tohtmlstring();
  }
  tojson() {
    return this.tohtmlstring();
  }
  get length() {
    return this.text.length;
  }
  get formats() {
    return this.#value.formats;
  }
  get replacements() {
    return this.#value.replacements;
  }
  get text() {
    return this.#value.text;
  }
}
for (const name of object.getownpropertynames(string.prototype)) {
  if (richtextdata.prototype.hasownproperty(name)) {
    continue;
  }
  object.defineproperty(richtextdata.prototype, name, {
    value(...args) {
      return this.tohtmlstring()[name](...args);
    }
  });
}
function create({
  element,
  text,
  html,
  range,
  __unstableiseditabletree: iseditabletree
} = {}) {
  if (html instanceof richtextdata) {
    return {
      text: html.text,
      formats: html.formats,
      replacements: html.replacements
    };
  }
  if (typeof text === "string" && text.length > 0) {
    return {
      formats: array(text.length),
      replacements: array(text.length),
      text
    };
  }
  if (typeof html === "string" && html.length > 0) {
    element = createelement(document, html);
  }
  if (typeof element !== "object") {
    return createemptyvalue();
  }
  return createfromelement({
    element,
    range,
    iseditabletree
  });
}
function accumulateselection(accumulator, node, range, value) {
  if (!range) {
    return;
  }
  const { parentnode } = node;
  const { startcontainer, startoffset, endcontainer, endoffset } = range;
  const currentlength = accumulator.text.length;
  if (value.start !== void 0) {
    accumulator.start = currentlength + value.start;
  } else if (node === startcontainer && node.nodetype === node.text_node) {
    accumulator.start = currentlength + startoffset;
  } else if (parentnode === startcontainer && node === startcontainer.childnodes[startoffset]) {
    accumulator.start = currentlength;
  } else if (parentnode === startcontainer && node === startcontainer.childnodes[startoffset - 1]) {
    accumulator.start = currentlength + value.text.length;
  } else if (node === startcontainer) {
    accumulator.start = currentlength;
  }
  if (value.end !== void 0) {
    accumulator.end = currentlength + value.end;
  } else if (node === endcontainer && node.nodetype === node.text_node) {
    accumulator.end = currentlength + endoffset;
  } else if (parentnode === endcontainer && node === endcontainer.childnodes[endoffset - 1]) {
    accumulator.end = currentlength + value.text.length;
  } else if (parentnode === endcontainer && node === endcontainer.childnodes[endoffset]) {
    accumulator.end = currentlength;
  } else if (node === endcontainer) {
    accumulator.end = currentlength + endoffset;
  }
}
function filterrange(node, range, filter) {
  if (!range) {
    return;
  }
  const { startcontainer, endcontainer } = range;
  let { startoffset, endoffset } = range;
  if (node === startcontainer) {
    startoffset = filter(node.nodevalue.slice(0, startoffset)).length;
  }
  if (node === endcontainer) {
    endoffset = filter(node.nodevalue.slice(0, endoffset)).length;
  }
  return { startcontainer, startoffset, endcontainer, endoffset };
}
function collapsewhitespace(element, isroot = true) {
  const clone = element.clonenode(true);
  clone.normalize();
  array.from(clone.childnodes).foreach((node, i, nodes) => {
    if (node.nodetype === node.text_node) {
      let newnodevalue = node.nodevalue;
      if (/[\n\t\r\f]/.test(newnodevalue)) {
        newnodevalue = newnodevalue.replace(/[\n\t\r\f]+/g, " ");
      }
      if (newnodevalue.indexof("  ") !== -1) {
        newnodevalue = newnodevalue.replace(/ {2,}/g, " ");
      }
      if (i === 0 && newnodevalue.startswith(" ")) {
        newnodevalue = newnodevalue.slice(1);
      } else if (isroot && i === nodes.length - 1 && newnodevalue.endswith(" ")) {
        newnodevalue = newnodevalue.slice(0, -1);
      }
      node.nodevalue = newnodevalue;
    } else if (node.nodetype === node.element_node) {
      node.replacewith(collapsewhitespace(node, false));
    }
  });
  return clone;
}
const carriage_return = "\r";
function removereservedcharacters(string) {
  return string.replace(
    new regexp(
      `[${zwnbsp}${object_replacement_character}${carriage_return}]`,
      "gu"
    ),
    ""
  );
}
function createfromelement({ element, range, iseditabletree }) {
  const accumulator = createemptyvalue();
  if (!element) {
    return accumulator;
  }
  if (!element.haschildnodes()) {
    accumulateselection(accumulator, element, range, createemptyvalue());
    return accumulator;
  }
  const length = element.childnodes.length;
  for (let index = 0; index < length; index++) {
    const node = element.childnodes[index];
    const tagname = node.nodename.tolowercase();
    if (node.nodetype === node.text_node) {
      const text = removereservedcharacters(node.nodevalue);
      range = filterrange(node, range, removereservedcharacters);
      accumulateselection(accumulator, node, range, { text });
      accumulator.formats.length += text.length;
      accumulator.replacements.length += text.length;
      accumulator.text += text;
      continue;
    }
    if (node.nodetype === node.comment_node || node.nodetype === node.element_node && node.tagname === "span" && node.hasattribute("data-rich-text-comment")) {
      const value2 = {
        formats: [,],
        replacements: [
          {
            type: "#comment",
            attributes: {
              "data-rich-text-comment": node.nodetype === node.comment_node ? node.nodevalue : node.getattribute(
                "data-rich-text-comment"
              )
            }
          }
        ],
        text: object_replacement_character
      };
      accumulateselection(accumulator, node, range, value2);
      mergepair(accumulator, value2);
      continue;
    }
    if (node.nodetype !== node.element_node) {
      continue;
    }
    if (iseditabletree && // ignore any line breaks that are not inserted by us.
    tagname === "br" && !node.getattribute("data-rich-text-line-break")) {
      accumulateselection(accumulator, node, range, createemptyvalue());
      continue;
    }
    if (tagname === "script") {
      const value2 = {
        formats: [,],
        replacements: [
          {
            type: tagname,
            attributes: {
              "data-rich-text-script": node.getattribute("data-rich-text-script") || encodeuricomponent(node.innerhtml)
            }
          }
        ],
        text: object_replacement_character
      };
      accumulateselection(accumulator, node, range, value2);
      mergepair(accumulator, value2);
      continue;
    }
    if (tagname === "br") {
      accumulateselection(accumulator, node, range, createemptyvalue());
      mergepair(accumulator, create({ text: "\n" }));
      continue;
    }
    const format = toformat({
      tagname,
      attributes: getattributes({ element: node })
    });
    if (format?.formattype?.contenteditable === false) {
      delete format.formattype;
      accumulateselection(accumulator, node, range, createemptyvalue());
      mergepair(accumulator, {
        formats: [,],
        replacements: [
          {
            ...format,
            innerhtml: node.innerhtml
          }
        ],
        text: object_replacement_character
      });
      continue;
    }
    if (format) {
      delete format.formattype;
    }
    const value = createfromelement({
      element: node,
      range,
      iseditabletree
    });
    accumulateselection(accumulator, node, range, value);
    if (!format || node.getattribute("data-rich-text-placeholder") || node.getattribute("data-rich-text-bogus")) {
      mergepair(accumulator, value);
    } else if (value.text.length === 0) {
      if (format.attributes) {
        mergepair(accumulator, {
          formats: [,],
          replacements: [format],
          text: object_replacement_character
        });
      }
    } else {
      let mergeformats2 = function(formats) {
        if (mergeformats2.formats === formats) {
          return mergeformats2.newformats;
        }
        const newformats = formats ? [format, ...formats] : [format];
        mergeformats2.formats = formats;
        mergeformats2.newformats = newformats;
        return newformats;
      };
      var mergeformats = mergeformats2;
      mergeformats2.newformats = [format];
      mergepair(accumulator, {
        ...value,
        formats: array.from(value.formats, mergeformats2)
      });
    }
  }
  return accumulator;
}
function getattributes({ element }) {
  if (!element.hasattributes()) {
    return;
  }
  const length = element.attributes.length;
  let accumulator;
  for (let i = 0; i < length; i++) {
    const { name, value } = element.attributes[i];
    if (name.indexof("data-rich-text-") === 0) {
      continue;
    }
    const safename = /^on/i.test(name) ? "data-disable-rich-text-" + name : name;
    accumulator = accumulator || {};
    accumulator[safename] = value;
  }
  return accumulator;
}


;// ./node_modules/@wordpress/rich-text/build-module/concat.js


function mergepair(a, b) {
  a.formats = a.formats.concat(b.formats);
  a.replacements = a.replacements.concat(b.replacements);
  a.text += b.text;
  return a;
}
function concat(...values) {
  return normaliseformats(values.reduce(mergepair, create()));
}


;// ./node_modules/@wordpress/rich-text/build-module/get-active-format.js

function getactiveformat(value, formattype) {
  return getactiveformats(value).find(
    ({ type }) => type === formattype
  );
}


;// ./node_modules/@wordpress/rich-text/build-module/get-active-object.js

function getactiveobject({ start, end, replacements, text }) {
  if (start + 1 !== end || text[start] !== object_replacement_character) {
    return;
  }
  return replacements[start];
}


;// ./node_modules/@wordpress/rich-text/build-module/is-collapsed.js
function iscollapsed({
  start,
  end
}) {
  if (start === void 0 || end === void 0) {
    return;
  }
  return start === end;
}


;// ./node_modules/@wordpress/rich-text/build-module/is-empty.js
function isempty({ text }) {
  return text.length === 0;
}


;// ./node_modules/@wordpress/rich-text/build-module/join.js


function join(values, separator = "") {
  if (typeof separator === "string") {
    separator = create({ text: separator });
  }
  return normaliseformats(
    values.reduce((accumulator, { formats, replacements, text }) => ({
      formats: accumulator.formats.concat(separator.formats, formats),
      replacements: accumulator.replacements.concat(
        separator.replacements,
        replacements
      ),
      text: accumulator.text + separator.text + text
    }))
  );
}


;// ./node_modules/@wordpress/rich-text/build-module/register-format-type.js


function registerformattype(name, settings) {
  settings = {
    name,
    ...settings
  };
  if (typeof settings.name !== "string") {
    window.console.error("format names must be strings.");
    return;
  }
  if (!/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test(settings.name)) {
    window.console.error(
      "format names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. example: my-plugin/my-custom-format"
    );
    return;
  }
  if ((0,external_wp_data_namespaceobject.select)(store).getformattype(settings.name)) {
    window.console.error(
      'format "' + settings.name + '" is already registered.'
    );
    return;
  }
  if (typeof settings.tagname !== "string" || settings.tagname === "") {
    window.console.error("format tag names must be a string.");
    return;
  }
  if ((typeof settings.classname !== "string" || settings.classname === "") && settings.classname !== null) {
    window.console.error(
      "format class names must be a string, or null to handle bare elements."
    );
    return;
  }
  if (!/^[_a-za-z]+[a-za-z0-9_-]*$/.test(settings.classname)) {
    window.console.error(
      "a class name must begin with a letter, followed by any number of hyphens, underscores, letters, or numbers."
    );
    return;
  }
  if (settings.classname === null) {
    const formattypeforbareelement = (0,external_wp_data_namespaceobject.select)(
      store
    ).getformattypeforbareelement(settings.tagname);
    if (formattypeforbareelement && formattypeforbareelement.name !== "core/unknown") {
      window.console.error(
        `format "${formattypeforbareelement.name}" is already registered to handle bare tag name "${settings.tagname}".`
      );
      return;
    }
  } else {
    const formattypeforclassname = (0,external_wp_data_namespaceobject.select)(
      store
    ).getformattypeforclassname(settings.classname);
    if (formattypeforclassname) {
      window.console.error(
        `format "${formattypeforclassname.name}" is already registered to handle class name "${settings.classname}".`
      );
      return;
    }
  }
  if (!("title" in settings) || settings.title === "") {
    window.console.error(
      'the format "' + settings.name + '" must have a title.'
    );
    return;
  }
  if ("keywords" in settings && settings.keywords.length > 3) {
    window.console.error(
      'the format "' + settings.name + '" can have a maximum of 3 keywords.'
    );
    return;
  }
  if (typeof settings.title !== "string") {
    window.console.error("format titles must be strings.");
    return;
  }
  (0,external_wp_data_namespaceobject.dispatch)(store).addformattypes(settings);
  return settings;
}


;// ./node_modules/@wordpress/rich-text/build-module/remove-format.js

function removeformat(value, formattype, startindex = value.start, endindex = value.end) {
  const { formats, activeformats } = value;
  const newformats = formats.slice();
  if (startindex === endindex) {
    const format = newformats[startindex]?.find(
      ({ type }) => type === formattype
    );
    if (format) {
      while (newformats[startindex]?.find(
        (newformat) => newformat === format
      )) {
        filterformats(newformats, startindex, formattype);
        startindex--;
      }
      endindex++;
      while (newformats[endindex]?.find(
        (newformat) => newformat === format
      )) {
        filterformats(newformats, endindex, formattype);
        endindex++;
      }
    }
  } else {
    for (let i = startindex; i < endindex; i++) {
      if (newformats[i]) {
        filterformats(newformats, i, formattype);
      }
    }
  }
  return normaliseformats({
    ...value,
    formats: newformats,
    activeformats: activeformats?.filter(({ type }) => type !== formattype) || []
  });
}
function filterformats(formats, index, formattype) {
  const newformats = formats[index].filter(
    ({ type }) => type !== formattype
  );
  if (newformats.length) {
    formats[index] = newformats;
  } else {
    delete formats[index];
  }
}


;// ./node_modules/@wordpress/rich-text/build-module/insert.js


function insert(value, valuetoinsert, startindex = value.start, endindex = value.end) {
  const { formats, replacements, text } = value;
  if (typeof valuetoinsert === "string") {
    valuetoinsert = create({ text: valuetoinsert });
  }
  const index = startindex + valuetoinsert.text.length;
  return normaliseformats({
    formats: formats.slice(0, startindex).concat(valuetoinsert.formats, formats.slice(endindex)),
    replacements: replacements.slice(0, startindex).concat(
      valuetoinsert.replacements,
      replacements.slice(endindex)
    ),
    text: text.slice(0, startindex) + valuetoinsert.text + text.slice(endindex),
    start: index,
    end: index
  });
}


;// ./node_modules/@wordpress/rich-text/build-module/remove.js


function remove_remove(value, startindex, endindex) {
  return insert(value, create(), startindex, endindex);
}


;// ./node_modules/@wordpress/rich-text/build-module/replace.js

function replace_replace({ formats, replacements, text, start, end }, pattern, replacement) {
  text = text.replace(pattern, (match, ...rest) => {
    const offset = rest[rest.length - 2];
    let newtext = replacement;
    let newformats;
    let newreplacements;
    if (typeof newtext === "function") {
      newtext = replacement(match, ...rest);
    }
    if (typeof newtext === "object") {
      newformats = newtext.formats;
      newreplacements = newtext.replacements;
      newtext = newtext.text;
    } else {
      newformats = array(newtext.length);
      newreplacements = array(newtext.length);
      if (formats[offset]) {
        newformats = newformats.fill(formats[offset]);
      }
    }
    formats = formats.slice(0, offset).concat(newformats, formats.slice(offset + match.length));
    replacements = replacements.slice(0, offset).concat(
      newreplacements,
      replacements.slice(offset + match.length)
    );
    if (start) {
      start = end = offset + newtext.length;
    }
    return newtext;
  });
  return normaliseformats({ formats, replacements, text, start, end });
}


;// ./node_modules/@wordpress/rich-text/build-module/insert-object.js


function insertobject(value, formattoinsert, startindex, endindex) {
  const valuetoinsert = {
    formats: [,],
    replacements: [formattoinsert],
    text: object_replacement_character
  };
  return insert(value, valuetoinsert, startindex, endindex);
}


;// ./node_modules/@wordpress/rich-text/build-module/slice.js
function slice(value, startindex = value.start, endindex = value.end) {
  const { formats, replacements, text } = value;
  if (startindex === void 0 || endindex === void 0) {
    return { ...value };
  }
  return {
    formats: formats.slice(startindex, endindex),
    replacements: replacements.slice(startindex, endindex),
    text: text.slice(startindex, endindex)
  };
}


;// ./node_modules/@wordpress/rich-text/build-module/split.js
function split({ formats, replacements, text, start, end }, string) {
  if (typeof string !== "string") {
    return splitatselection(...arguments);
  }
  let nextstart = 0;
  return text.split(string).map((substring) => {
    const startindex = nextstart;
    const value = {
      formats: formats.slice(startindex, startindex + substring.length),
      replacements: replacements.slice(
        startindex,
        startindex + substring.length
      ),
      text: substring
    };
    nextstart += string.length + substring.length;
    if (start !== void 0 && end !== void 0) {
      if (start >= startindex && start < nextstart) {
        value.start = start - startindex;
      } else if (start < startindex && end > startindex) {
        value.start = 0;
      }
      if (end >= startindex && end < nextstart) {
        value.end = end - startindex;
      } else if (start < nextstart && end > nextstart) {
        value.end = substring.length;
      }
    }
    return value;
  });
}
function splitatselection({ formats, replacements, text, start, end }, startindex = start, endindex = end) {
  if (start === void 0 || end === void 0) {
    return;
  }
  const before = {
    formats: formats.slice(0, startindex),
    replacements: replacements.slice(0, startindex),
    text: text.slice(0, startindex)
  };
  const after = {
    formats: formats.slice(endindex),
    replacements: replacements.slice(endindex),
    text: text.slice(endindex),
    start: 0,
    end: 0
  };
  return [before, after];
}


;// ./node_modules/@wordpress/rich-text/build-module/is-range-equal.js
function israngeequal(a, b) {
  return a === b || a && b && a.startcontainer === b.startcontainer && a.startoffset === b.startoffset && a.endcontainer === b.endcontainer && a.endoffset === b.endoffset;
}


;// ./node_modules/@wordpress/rich-text/build-module/to-dom.js



const mathml_namespace = "http://www.w3.org/1998/math/mathml";
function createpathtonode(node, rootnode, path) {
  const parentnode = node.parentnode;
  let i = 0;
  while (node = node.previoussibling) {
    i++;
  }
  path = [i, ...path];
  if (parentnode !== rootnode) {
    path = createpathtonode(parentnode, rootnode, path);
  }
  return path;
}
function getnodebypath(node, path) {
  path = [...path];
  while (node && path.length > 1) {
    node = node.childnodes[path.shift()];
  }
  return {
    node,
    offset: path[0]
  };
}
function to_dom_append(element, child) {
  if (child.html !== void 0) {
    return element.innerhtml += child.html;
  }
  if (typeof child === "string") {
    child = element.ownerdocument.createtextnode(child);
  }
  const { type, attributes } = child;
  if (type) {
    if (type === "#comment") {
      child = element.ownerdocument.createcomment(
        attributes["data-rich-text-comment"]
      );
    } else {
      const parentnamespace = element.namespaceuri;
      if (type === "math") {
        child = element.ownerdocument.createelementns(
          mathml_namespace,
          type
        );
      } else if (parentnamespace === mathml_namespace) {
        if (element.tagname === "mtext") {
          child = element.ownerdocument.createelement(type);
        } else {
          child = element.ownerdocument.createelementns(
            mathml_namespace,
            type
          );
        }
      } else {
        child = element.ownerdocument.createelement(type);
      }
      for (const key in attributes) {
        child.setattribute(key, attributes[key]);
      }
    }
  }
  return element.appendchild(child);
}
function to_dom_appendtext(node, text) {
  node.appenddata(text);
}
function to_dom_getlastchild({ lastchild }) {
  return lastchild;
}
function to_dom_getparent({ parentnode }) {
  return parentnode;
}
function to_dom_istext(node) {
  return node.nodetype === node.text_node;
}
function to_dom_gettext({ nodevalue }) {
  return nodevalue;
}
function to_dom_remove(node) {
  return node.parentnode.removechild(node);
}
function todom({
  value,
  prepareeditabletree,
  iseditabletree = true,
  placeholder,
  doc = document
}) {
  let startpath = [];
  let endpath = [];
  if (prepareeditabletree) {
    value = {
      ...value,
      formats: prepareeditabletree(value)
    };
  }
  const createempty = () => createelement(doc, "");
  const tree = totree({
    value,
    createempty,
    append: to_dom_append,
    getlastchild: to_dom_getlastchild,
    getparent: to_dom_getparent,
    istext: to_dom_istext,
    gettext: to_dom_gettext,
    remove: to_dom_remove,
    appendtext: to_dom_appendtext,
    onstartindex(body, pointer) {
      startpath = createpathtonode(pointer, body, [
        pointer.nodevalue.length
      ]);
    },
    onendindex(body, pointer) {
      endpath = createpathtonode(pointer, body, [
        pointer.nodevalue.length
      ]);
    },
    iseditabletree,
    placeholder
  });
  return {
    body: tree,
    selection: { startpath, endpath }
  };
}
function apply({
  value,
  current,
  prepareeditabletree,
  __unstabledomonly,
  placeholder
}) {
  const { body, selection } = todom({
    value,
    prepareeditabletree,
    placeholder,
    doc: current.ownerdocument
  });
  applyvalue(body, current);
  if (value.start !== void 0 && !__unstabledomonly) {
    applyselection(selection, current);
  }
}
function applyvalue(future, current) {
  let i = 0;
  let futurechild;
  while (futurechild = future.firstchild) {
    const currentchild = current.childnodes[i];
    if (!currentchild) {
      current.appendchild(futurechild);
    } else if (!currentchild.isequalnode(futurechild)) {
      if (currentchild.nodename !== futurechild.nodename || currentchild.nodetype === currentchild.text_node && currentchild.data !== futurechild.data) {
        current.replacechild(futurechild, currentchild);
      } else {
        const currentattributes = currentchild.attributes;
        const futureattributes = futurechild.attributes;
        if (currentattributes) {
          let ii = currentattributes.length;
          while (ii--) {
            const { name } = currentattributes[ii];
            if (!futurechild.getattribute(name)) {
              currentchild.removeattribute(name);
            }
          }
        }
        if (futureattributes) {
          for (let ii = 0; ii < futureattributes.length; ii++) {
            const { name, value } = futureattributes[ii];
            if (currentchild.getattribute(name) !== value) {
              currentchild.setattribute(name, value);
            }
          }
        }
        applyvalue(futurechild, currentchild);
        future.removechild(futurechild);
      }
    } else {
      future.removechild(futurechild);
    }
    i++;
  }
  while (current.childnodes[i]) {
    current.removechild(current.childnodes[i]);
  }
}
function applyselection({ startpath, endpath }, current) {
  const { node: startcontainer, offset: startoffset } = getnodebypath(
    current,
    startpath
  );
  const { node: endcontainer, offset: endoffset } = getnodebypath(
    current,
    endpath
  );
  const { ownerdocument } = current;
  const { defaultview } = ownerdocument;
  const selection = defaultview.getselection();
  const range = ownerdocument.createrange();
  range.setstart(startcontainer, startoffset);
  range.setend(endcontainer, endoffset);
  const { activeelement } = ownerdocument;
  if (selection.rangecount > 0) {
    if (israngeequal(range, selection.getrangeat(0))) {
      return;
    }
    selection.removeallranges();
  }
  selection.addrange(range);
  if (activeelement !== ownerdocument.activeelement) {
    if (activeelement instanceof defaultview.htmlelement) {
      activeelement.focus();
    }
  }
}


;// external ["wp","a11y"]
const external_wp_a11y_namespaceobject = window["wp"]["a11y"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// ./node_modules/@wordpress/rich-text/build-module/toggle-format.js





function toggleformat(value, format) {
  if (getactiveformat(value, format.type)) {
    if (format.title) {
      (0,external_wp_a11y_namespaceobject.speak)((0,external_wp_i18n_namespaceobject.sprintf)((0,external_wp_i18n_namespaceobject.__)("%s removed."), format.title), "assertive");
    }
    return removeformat(value, format.type);
  }
  if (format.title) {
    (0,external_wp_a11y_namespaceobject.speak)((0,external_wp_i18n_namespaceobject.sprintf)((0,external_wp_i18n_namespaceobject.__)("%s applied."), format.title), "assertive");
  }
  return applyformat(value, format);
}


;// ./node_modules/@wordpress/rich-text/build-module/unregister-format-type.js


function unregisterformattype(name) {
  const oldformat = (0,external_wp_data_namespaceobject.select)(store).getformattype(name);
  if (!oldformat) {
    window.console.error(`format ${name} is not registered.`);
    return;
  }
  (0,external_wp_data_namespaceobject.dispatch)(store).removeformattypes(name);
  return oldformat;
}


;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// ./node_modules/@wordpress/rich-text/build-module/component/use-anchor-ref.js



function useanchorref({ ref, value, settings = {} }) {
  external_wp_deprecated_default()("`useanchorref` hook", {
    since: "6.1",
    alternative: "`useanchor` hook"
  });
  const { tagname, classname, name } = settings;
  const activeformat = name ? getactiveformat(value, name) : void 0;
  return (0,external_wp_element_namespaceobject.usememo)(() => {
    if (!ref.current) {
      return;
    }
    const {
      ownerdocument: { defaultview }
    } = ref.current;
    const selection = defaultview.getselection();
    if (!selection.rangecount) {
      return;
    }
    const range = selection.getrangeat(0);
    if (!activeformat) {
      return range;
    }
    let element = range.startcontainer;
    element = element.nextelementsibling || element;
    while (element.nodetype !== element.element_node) {
      element = element.parentnode;
    }
    return element.closest(
      tagname + (classname ? "." + classname : "")
    );
  }, [activeformat, value.start, value.end, tagname, classname]);
}


;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// ./node_modules/@wordpress/rich-text/build-module/component/use-anchor.js


function getformatelement(range, editablecontentelement, tagname, classname) {
  let element = range.startcontainer;
  if (element.nodetype === element.text_node && range.startoffset === element.length && element.nextsibling) {
    element = element.nextsibling;
    while (element.firstchild) {
      element = element.firstchild;
    }
  }
  if (element.nodetype !== element.element_node) {
    element = element.parentelement;
  }
  if (!element) {
    return;
  }
  if (element === editablecontentelement) {
    return;
  }
  if (!editablecontentelement.contains(element)) {
    return;
  }
  const selector = tagname + (classname ? "." + classname : "");
  while (element !== editablecontentelement) {
    if (element.matches(selector)) {
      return element;
    }
    element = element.parentelement;
  }
}
function createvirtualanchorelement(range, editablecontentelement) {
  return {
    contextelement: editablecontentelement,
    getboundingclientrect() {
      return editablecontentelement.contains(range.startcontainer) ? range.getboundingclientrect() : editablecontentelement.getboundingclientrect();
    }
  };
}
function getanchor(editablecontentelement, tagname, classname) {
  if (!editablecontentelement) {
    return;
  }
  const { ownerdocument } = editablecontentelement;
  const { defaultview } = ownerdocument;
  const selection = defaultview.getselection();
  if (!selection) {
    return;
  }
  if (!selection.rangecount) {
    return;
  }
  const range = selection.getrangeat(0);
  if (!range || !range.startcontainer) {
    return;
  }
  const formatelement = getformatelement(
    range,
    editablecontentelement,
    tagname,
    classname
  );
  if (formatelement) {
    return formatelement;
  }
  return createvirtualanchorelement(range, editablecontentelement);
}
function useanchor({ editablecontentelement, settings = {} }) {
  const { tagname, classname, isactive } = settings;
  const [anchor, setanchor] = (0,external_wp_element_namespaceobject.usestate)(
    () => getanchor(editablecontentelement, tagname, classname)
  );
  const wasactive = (0,external_wp_compose_namespaceobject.useprevious)(isactive);
  (0,external_wp_element_namespaceobject.uselayouteffect)(() => {
    if (!editablecontentelement) {
      return;
    }
    function callback() {
      setanchor(
        getanchor(editablecontentelement, tagname, classname)
      );
    }
    function attach() {
      ownerdocument.addeventlistener("selectionchange", callback);
    }
    function detach() {
      ownerdocument.removeeventlistener("selectionchange", callback);
    }
    const { ownerdocument } = editablecontentelement;
    if (editablecontentelement === ownerdocument.activeelement || // when a link is created, we need to attach the popover to the newly created anchor.
    !wasactive && isactive || // sometimes we're _removing_ an active anchor, such as the inline color popover.
    // when we add the color, it switches from a virtual anchor to a `<mark>` element.
    // when we _remove_ the color, it switches from a `<mark>` element to a virtual anchor.
    wasactive && !isactive) {
      setanchor(
        getanchor(editablecontentelement, tagname, classname)
      );
      attach();
    }
    editablecontentelement.addeventlistener("focusin", attach);
    editablecontentelement.addeventlistener("focusout", detach);
    return () => {
      detach();
      editablecontentelement.removeeventlistener("focusin", attach);
      editablecontentelement.removeeventlistener("focusout", detach);
    };
  }, [editablecontentelement, tagname, classname, isactive, wasactive]);
  return anchor;
}


;// ./node_modules/@wordpress/rich-text/build-module/component/use-default-style.js

const whitespace = "pre-wrap";
const minwidth = "1px";
function usedefaultstyle() {
  return (0,external_wp_element_namespaceobject.usecallback)((element) => {
    if (!element) {
      return;
    }
    element.style.whitespace = whitespace;
    element.style.minwidth = minwidth;
  }, []);
}


;// ./node_modules/colord/index.mjs
var r={grad:.9,turn:360,rad:360/(2*math.pi)},t=function(r){return"string"==typeof r?r.length>0:"number"==typeof r},n=function(r,t,n){return void 0===t&&(t=0),void 0===n&&(n=math.pow(10,t)),math.round(n*r)/n+0},e=function(r,t,n){return void 0===t&&(t=0),void 0===n&&(n=1),r>n?n:r>t?r:t},u=function(r){return(r=isfinite(r)?r%360:0)>0?r:r+360},a=function(r){return{r:e(r.r,0,255),g:e(r.g,0,255),b:e(r.b,0,255),a:e(r.a)}},o=function(r){return{r:n(r.r),g:n(r.g),b:n(r.b),a:n(r.a,3)}},i=/^#([0-9a-f]{3,8})$/i,s=function(r){var t=r.tostring(16);return t.length<2?"0"+t:t},h=function(r){var t=r.r,n=r.g,e=r.b,u=r.a,a=math.max(t,n,e),o=a-math.min(t,n,e),i=o?a===t?(n-e)/o:a===n?2+(e-t)/o:4+(t-n)/o:0;return{h:60*(i<0?i+6:i),s:a?o/a*100:0,v:a/255*100,a:u}},b=function(r){var t=r.h,n=r.s,e=r.v,u=r.a;t=t/360*6,n/=100,e/=100;var a=math.floor(t),o=e*(1-n),i=e*(1-(t-a)*n),s=e*(1-(1-t+a)*n),h=a%6;return{r:255*[e,i,o,o,s,e][h],g:255*[s,e,e,i,o,o][h],b:255*[o,o,s,e,e,i][h],a:u}},g=function(r){return{h:u(r.h),s:e(r.s,0,100),l:e(r.l,0,100),a:e(r.a)}},d=function(r){return{h:n(r.h),s:n(r.s),l:n(r.l),a:n(r.a,3)}},f=function(r){return b((n=(t=r).s,{h:t.h,s:(n*=((e=t.l)<50?e:100-e)/100)>0?2*n/(e+n)*100:0,v:e+n,a:t.a}));var t,n,e},c=function(r){return{h:(t=h(r)).h,s:(u=(200-(n=t.s))*(e=t.v)/100)>0&&u<200?n*e/100/(u<=100?u:200-u)*100:0,l:u/2,a:t.a};var t,n,e,u},l=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,p=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,v=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,m=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,y={string:[[function(r){var t=i.exec(r);return t?(r=t[1]).length<=4?{r:parseint(r[0]+r[0],16),g:parseint(r[1]+r[1],16),b:parseint(r[2]+r[2],16),a:4===r.length?n(parseint(r[3]+r[3],16)/255,2):1}:6===r.length||8===r.length?{r:parseint(r.substr(0,2),16),g:parseint(r.substr(2,2),16),b:parseint(r.substr(4,2),16),a:8===r.length?n(parseint(r.substr(6,2),16)/255,2):1}:null:null},"hex"],[function(r){var t=v.exec(r)||m.exec(r);return t?t[2]!==t[4]||t[4]!==t[6]?null:a({r:number(t[1])/(t[2]?100/255:1),g:number(t[3])/(t[4]?100/255:1),b:number(t[5])/(t[6]?100/255:1),a:void 0===t[7]?1:number(t[7])/(t[8]?100:1)}):null},"rgb"],[function(t){var n=l.exec(t)||p.exec(t);if(!n)return null;var e,u,a=g({h:(e=n[1],u=n[2],void 0===u&&(u="deg"),number(e)*(r[u]||1)),s:number(n[3]),l:number(n[4]),a:void 0===n[5]?1:number(n[5])/(n[6]?100:1)});return f(a)},"hsl"]],object:[[function(r){var n=r.r,e=r.g,u=r.b,o=r.a,i=void 0===o?1:o;return t(n)&&t(e)&&t(u)?a({r:number(n),g:number(e),b:number(u),a:number(i)}):null},"rgb"],[function(r){var n=r.h,e=r.s,u=r.l,a=r.a,o=void 0===a?1:a;if(!t(n)||!t(e)||!t(u))return null;var i=g({h:number(n),s:number(e),l:number(u),a:number(o)});return f(i)},"hsl"],[function(r){var n=r.h,a=r.s,o=r.v,i=r.a,s=void 0===i?1:i;if(!t(n)||!t(a)||!t(o))return null;var h=function(r){return{h:u(r.h),s:e(r.s,0,100),v:e(r.v,0,100),a:e(r.a)}}({h:number(n),s:number(a),v:number(o),a:number(s)});return b(h)},"hsv"]]},n=function(r,t){for(var n=0;n<t.length;n++){var e=t[n][0](r);if(e)return[e,t[n][1]]}return[null,void 0]},x=function(r){return"string"==typeof r?n(r.trim(),y.string):"object"==typeof r&&null!==r?n(r,y.object):[null,void 0]},i=function(r){return x(r)[1]},m=function(r,t){var n=c(r);return{h:n.h,s:e(n.s+100*t,0,100),l:n.l,a:n.a}},h=function(r){return(299*r.r+587*r.g+114*r.b)/1e3/255},$=function(r,t){var n=c(r);return{h:n.h,s:n.s,l:e(n.l+100*t,0,100),a:n.a}},j=function(){function r(r){this.parsed=x(r)[0],this.rgba=this.parsed||{r:0,g:0,b:0,a:1}}return r.prototype.isvalid=function(){return null!==this.parsed},r.prototype.brightness=function(){return n(h(this.rgba),2)},r.prototype.isdark=function(){return h(this.rgba)<.5},r.prototype.islight=function(){return h(this.rgba)>=.5},r.prototype.tohex=function(){return r=o(this.rgba),t=r.r,e=r.g,u=r.b,i=(a=r.a)<1?s(n(255*a)):"","#"+s(t)+s(e)+s(u)+i;var r,t,e,u,a,i},r.prototype.torgb=function(){return o(this.rgba)},r.prototype.torgbstring=function(){return r=o(this.rgba),t=r.r,n=r.g,e=r.b,(u=r.a)<1?"rgba("+t+", "+n+", "+e+", "+u+")":"rgb("+t+", "+n+", "+e+")";var r,t,n,e,u},r.prototype.tohsl=function(){return d(c(this.rgba))},r.prototype.tohslstring=function(){return r=d(c(this.rgba)),t=r.h,n=r.s,e=r.l,(u=r.a)<1?"hsla("+t+", "+n+"%, "+e+"%, "+u+")":"hsl("+t+", "+n+"%, "+e+"%)";var r,t,n,e,u},r.prototype.tohsv=function(){return r=h(this.rgba),{h:n(r.h),s:n(r.s),v:n(r.v),a:n(r.a,3)};var r},r.prototype.invert=function(){return w({r:255-(r=this.rgba).r,g:255-r.g,b:255-r.b,a:r.a});var r},r.prototype.saturate=function(r){return void 0===r&&(r=.1),w(m(this.rgba,r))},r.prototype.desaturate=function(r){return void 0===r&&(r=.1),w(m(this.rgba,-r))},r.prototype.grayscale=function(){return w(m(this.rgba,-1))},r.prototype.lighten=function(r){return void 0===r&&(r=.1),w($(this.rgba,r))},r.prototype.darken=function(r){return void 0===r&&(r=.1),w($(this.rgba,-r))},r.prototype.rotate=function(r){return void 0===r&&(r=15),this.hue(this.hue()+r)},r.prototype.alpha=function(r){return"number"==typeof r?w({r:(t=this.rgba).r,g:t.g,b:t.b,a:r}):n(this.rgba.a,3);var t},r.prototype.hue=function(r){var t=c(this.rgba);return"number"==typeof r?w({h:r,s:t.s,l:t.l,a:t.a}):n(t.h)},r.prototype.isequal=function(r){return this.tohex()===w(r).tohex()},r}(),w=function(r){return r instanceof j?r:new j(r)},s=(/* unused pure expression or super */ null && ([])),k=function(r){r.foreach(function(r){s.indexof(r)<0&&(r(j,y),s.push(r))})},e=function(){return new j({r:255*math.random(),g:255*math.random(),b:255*math.random()})};

;// ./node_modules/@wordpress/rich-text/build-module/component/use-boundary-style.js


function useboundarystyle({ record }) {
  const ref = (0,external_wp_element_namespaceobject.useref)();
  const { activeformats = [], replacements, start } = record.current;
  const activereplacement = replacements[start];
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if ((!activeformats || !activeformats.length) && !activereplacement) {
      return;
    }
    const boundaryselector = "*[data-rich-text-format-boundary]";
    const element = ref.current.queryselector(boundaryselector);
    if (!element) {
      return;
    }
    const { ownerdocument } = element;
    const { defaultview } = ownerdocument;
    const computedstyle = defaultview.getcomputedstyle(element);
    const newcolor = w(computedstyle.color).alpha(0.2).torgbstring();
    const selector = `.rich-text:focus ${boundaryselector}`;
    const rule = `background-color: ${newcolor}`;
    const style = `${selector} {${rule}}`;
    const globalstyleid = "rich-text-boundary-style";
    let globalstyle = ownerdocument.getelementbyid(globalstyleid);
    if (!globalstyle) {
      globalstyle = ownerdocument.createelement("style");
      globalstyle.id = globalstyleid;
      ownerdocument.head.appendchild(globalstyle);
    }
    if (globalstyle.innerhtml !== style) {
      globalstyle.innerhtml = style;
    }
  }, [activeformats, activereplacement]);
  return ref;
}


;// ./node_modules/@wordpress/rich-text/build-module/component/event-listeners/copy-handler.js




var copy_handler_default = (props) => (element) => {
  function oncopy(event) {
    const { record } = props.current;
    const { ownerdocument } = element;
    if (iscollapsed(record.current) || !element.contains(ownerdocument.activeelement)) {
      return;
    }
    const selectedrecord = slice(record.current);
    const plaintext = gettextcontent(selectedrecord);
    const html = tohtmlstring({ value: selectedrecord });
    event.clipboarddata.setdata("text/plain", plaintext);
    event.clipboarddata.setdata("text/html", html);
    event.clipboarddata.setdata("rich-text", "true");
    event.preventdefault();
    if (event.type === "cut") {
      ownerdocument.execcommand("delete");
    }
  }
  const { defaultview } = element.ownerdocument;
  defaultview.addeventlistener("copy", oncopy);
  defaultview.addeventlistener("cut", oncopy);
  return () => {
    defaultview.removeeventlistener("copy", oncopy);
    defaultview.removeeventlistener("cut", oncopy);
  };
};


;// ./node_modules/@wordpress/rich-text/build-module/component/event-listeners/select-object.js
var select_object_default = () => (element) => {
  function onclick(event) {
    const { target } = event;
    if (target === element || target.textcontent && target.iscontenteditable) {
      return;
    }
    const { ownerdocument } = target;
    const { defaultview } = ownerdocument;
    const selection = defaultview.getselection();
    if (selection.containsnode(target)) {
      return;
    }
    const range = ownerdocument.createrange();
    const nodetoselect = target.iscontenteditable ? target : target.closest("[contenteditable]");
    range.selectnode(nodetoselect);
    selection.removeallranges();
    selection.addrange(range);
    event.preventdefault();
  }
  function onfocusin(event) {
    if (event.relatedtarget && !element.contains(event.relatedtarget) && event.relatedtarget.tagname === "a") {
      onclick(event);
    }
  }
  element.addeventlistener("click", onclick);
  element.addeventlistener("focusin", onfocusin);
  return () => {
    element.removeeventlistener("click", onclick);
    element.removeeventlistener("focusin", onfocusin);
  };
};


;// external ["wp","keycodes"]
const external_wp_keycodes_namespaceobject = window["wp"]["keycodes"];
;// ./node_modules/@wordpress/rich-text/build-module/component/event-listeners/format-boundaries.js


const empty_active_formats = [];
var format_boundaries_default = (props) => (element) => {
  function onkeydown(event) {
    const { keycode, shiftkey, altkey, metakey, ctrlkey } = event;
    if (
      // only override left and right keys without modifiers pressed.
      shiftkey || altkey || metakey || ctrlkey || keycode !== external_wp_keycodes_namespaceobject.left && keycode !== external_wp_keycodes_namespaceobject.right
    ) {
      return;
    }
    const { record, applyrecord, forcerender } = props.current;
    const {
      text,
      formats,
      start,
      end,
      activeformats: currentactiveformats = []
    } = record.current;
    const collapsed = iscollapsed(record.current);
    const { ownerdocument } = element;
    const { defaultview } = ownerdocument;
    const { direction } = defaultview.getcomputedstyle(element);
    const reversekey = direction === "rtl" ? external_wp_keycodes_namespaceobject.right : external_wp_keycodes_namespaceobject.left;
    const isreverse = event.keycode === reversekey;
    if (collapsed && currentactiveformats.length === 0) {
      if (start === 0 && isreverse) {
        return;
      }
      if (end === text.length && !isreverse) {
        return;
      }
    }
    if (!collapsed) {
      return;
    }
    const formatsbefore = formats[start - 1] || empty_active_formats;
    const formatsafter = formats[start] || empty_active_formats;
    const destination = isreverse ? formatsbefore : formatsafter;
    const isincreasing = currentactiveformats.every(
      (format, index) => format === destination[index]
    );
    let newactiveformatslength = currentactiveformats.length;
    if (!isincreasing) {
      newactiveformatslength--;
    } else if (newactiveformatslength < destination.length) {
      newactiveformatslength++;
    }
    if (newactiveformatslength === currentactiveformats.length) {
      record.current._newactiveformats = destination;
      return;
    }
    event.preventdefault();
    const origin = isreverse ? formatsafter : formatsbefore;
    const source = isincreasing ? destination : origin;
    const newactiveformats = source.slice(0, newactiveformatslength);
    const newvalue = {
      ...record.current,
      activeformats: newactiveformats
    };
    record.current = newvalue;
    applyrecord(newvalue);
    forcerender();
  }
  element.addeventlistener("keydown", onkeydown);
  return () => {
    element.removeeventlistener("keydown", onkeydown);
  };
};


;// ./node_modules/@wordpress/rich-text/build-module/component/event-listeners/delete.js


var delete_default = (props) => (element) => {
  function onkeydown(event) {
    const { keycode } = event;
    const { createrecord, handlechange } = props.current;
    if (event.defaultprevented) {
      return;
    }
    if (keycode !== external_wp_keycodes_namespaceobject.delete && keycode !== external_wp_keycodes_namespaceobject.backspace) {
      return;
    }
    const currentvalue = createrecord();
    const { start, end, text } = currentvalue;
    if (start === 0 && end !== 0 && end === text.length) {
      handlechange(remove_remove(currentvalue));
      event.preventdefault();
    }
  }
  element.addeventlistener("keydown", onkeydown);
  return () => {
    element.removeeventlistener("keydown", onkeydown);
  };
};


;// ./node_modules/@wordpress/rich-text/build-module/update-formats.js

function updateformats({ value, start, end, formats }) {
  const min = math.min(start, end);
  const max = math.max(start, end);
  const formatsbefore = value.formats[min - 1] || [];
  const formatsafter = value.formats[max] || [];
  value.activeformats = formats.map((format, index) => {
    if (formatsbefore[index]) {
      if (isformatequal(format, formatsbefore[index])) {
        return formatsbefore[index];
      }
    } else if (formatsafter[index]) {
      if (isformatequal(format, formatsafter[index])) {
        return formatsafter[index];
      }
    }
    return format;
  });
  while (--end >= start) {
    if (value.activeformats.length > 0) {
      value.formats[end] = value.activeformats;
    } else {
      delete value.formats[end];
    }
  }
  return value;
}


;// ./node_modules/@wordpress/rich-text/build-module/component/event-listeners/input-and-selection.js


const insertion_input_types_to_ignore = /* @__pure__ */ new set([
  "insertparagraph",
  "insertorderedlist",
  "insertunorderedlist",
  "inserthorizontalrule",
  "insertlink"
]);
const input_and_selection_empty_active_formats = [];
const placeholder_attr_name = "data-rich-text-placeholder";
function fixplaceholderselection(defaultview) {
  const selection = defaultview.getselection();
  const { anchornode, anchoroffset } = selection;
  if (anchornode.nodetype !== anchornode.element_node) {
    return;
  }
  const targetnode = anchornode.childnodes[anchoroffset];
  if (!targetnode || targetnode.nodetype !== targetnode.element_node || !targetnode.hasattribute(placeholder_attr_name)) {
    return;
  }
  selection.collapsetostart();
}
var input_and_selection_default = (props) => (element) => {
  const { ownerdocument } = element;
  const { defaultview } = ownerdocument;
  let iscomposing = false;
  function oninput(event) {
    if (iscomposing) {
      return;
    }
    let inputtype;
    if (event) {
      inputtype = event.inputtype;
    }
    const { record, applyrecord, createrecord, handlechange } = props.current;
    if (inputtype && (inputtype.indexof("format") === 0 || insertion_input_types_to_ignore.has(inputtype))) {
      applyrecord(record.current);
      return;
    }
    const currentvalue = createrecord();
    const { start, activeformats: oldactiveformats = [] } = record.current;
    const change = updateformats({
      value: currentvalue,
      start,
      end: currentvalue.start,
      formats: oldactiveformats
    });
    handlechange(change);
  }
  function handleselectionchange() {
    const { record, applyrecord, createrecord, onselectionchange } = props.current;
    if (element.contenteditable !== "true") {
      return;
    }
    if (ownerdocument.activeelement !== element) {
      ownerdocument.removeeventlistener(
        "selectionchange",
        handleselectionchange
      );
      return;
    }
    if (iscomposing) {
      return;
    }
    const { start, end, text } = createrecord();
    const oldrecord = record.current;
    if (text !== oldrecord.text) {
      oninput();
      return;
    }
    if (start === oldrecord.start && end === oldrecord.end) {
      if (oldrecord.text.length === 0 && start === 0) {
        fixplaceholderselection(defaultview);
      }
      return;
    }
    const newvalue = {
      ...oldrecord,
      start,
      end,
      // _newactiveformats may be set on arrow key navigation to control
      // the right boundary position. if undefined, getactiveformats will
      // give the active formats according to the browser.
      activeformats: oldrecord._newactiveformats,
      _newactiveformats: void 0
    };
    const newactiveformats = getactiveformats(
      newvalue,
      input_and_selection_empty_active_formats
    );
    newvalue.activeformats = newactiveformats;
    record.current = newvalue;
    applyrecord(newvalue, { domonly: true });
    onselectionchange(start, end);
  }
  function oncompositionstart() {
    iscomposing = true;
    ownerdocument.removeeventlistener(
      "selectionchange",
      handleselectionchange
    );
    element.queryselector(`[${placeholder_attr_name}]`)?.remove();
  }
  function oncompositionend() {
    iscomposing = false;
    oninput({ inputtype: "inserttext" });
    ownerdocument.addeventlistener(
      "selectionchange",
      handleselectionchange
    );
  }
  function onfocus() {
    const { record, isselected, onselectionchange, applyrecord } = props.current;
    if (element.parentelement.closest('[contenteditable="true"]')) {
      return;
    }
    if (!isselected) {
      const index = void 0;
      record.current = {
        ...record.current,
        start: index,
        end: index,
        activeformats: input_and_selection_empty_active_formats
      };
    } else {
      applyrecord(record.current, { domonly: true });
    }
    onselectionchange(record.current.start, record.current.end);
    window.queuemicrotask(handleselectionchange);
    ownerdocument.addeventlistener(
      "selectionchange",
      handleselectionchange
    );
  }
  element.addeventlistener("input", oninput);
  element.addeventlistener("compositionstart", oncompositionstart);
  element.addeventlistener("compositionend", oncompositionend);
  element.addeventlistener("focus", onfocus);
  return () => {
    element.removeeventlistener("input", oninput);
    element.removeeventlistener("compositionstart", oncompositionstart);
    element.removeeventlistener("compositionend", oncompositionend);
    element.removeeventlistener("focus", onfocus);
  };
};


;// ./node_modules/@wordpress/rich-text/build-module/component/event-listeners/selection-change-compat.js

var selection_change_compat_default = () => (element) => {
  const { ownerdocument } = element;
  const { defaultview } = ownerdocument;
  const selection = defaultview?.getselection();
  let range;
  function getrange() {
    return selection.rangecount ? selection.getrangeat(0) : null;
  }
  function ondown(event) {
    const type = event.type === "keydown" ? "keyup" : "pointerup";
    function oncancel() {
      ownerdocument.removeeventlistener(type, onup);
      ownerdocument.removeeventlistener("selectionchange", oncancel);
      ownerdocument.removeeventlistener("input", oncancel);
    }
    function onup() {
      oncancel();
      if (israngeequal(range, getrange())) {
        return;
      }
      ownerdocument.dispatchevent(new event("selectionchange"));
    }
    ownerdocument.addeventlistener(type, onup);
    ownerdocument.addeventlistener("selectionchange", oncancel);
    ownerdocument.addeventlistener("input", oncancel);
    range = getrange();
  }
  element.addeventlistener("pointerdown", ondown);
  element.addeventlistener("keydown", ondown);
  return () => {
    element.removeeventlistener("pointerdown", ondown);
    element.removeeventlistener("keydown", ondown);
  };
};


;// ./node_modules/@wordpress/rich-text/build-module/component/event-listeners/prevent-focus-capture.js
function preventfocuscapture() {
  return (element) => {
    const { ownerdocument } = element;
    const { defaultview } = ownerdocument;
    let value = null;
    function onpointerdown(event) {
      if (event.defaultprevented) {
        return;
      }
      if (event.target === element) {
        return;
      }
      if (!event.target.contains(element)) {
        return;
      }
      value = element.getattribute("contenteditable");
      element.setattribute("contenteditable", "false");
      defaultview.getselection().removeallranges();
    }
    function onpointerup() {
      if (value !== null) {
        element.setattribute("contenteditable", value);
        value = null;
      }
    }
    defaultview.addeventlistener("pointerdown", onpointerdown);
    defaultview.addeventlistener("pointerup", onpointerup);
    return () => {
      defaultview.removeeventlistener("pointerdown", onpointerdown);
      defaultview.removeeventlistener("pointerup", onpointerup);
    };
  };
}


;// ./node_modules/@wordpress/rich-text/build-module/component/event-listeners/index.js









const alleventlisteners = [
  copy_handler_default,
  select_object_default,
  format_boundaries_default,
  delete_default,
  input_and_selection_default,
  selection_change_compat_default,
  preventfocuscapture
];
function useeventlisteners(props) {
  const propsref = (0,external_wp_element_namespaceobject.useref)(props);
  (0,external_wp_element_namespaceobject.useinsertioneffect)(() => {
    propsref.current = props;
  });
  const refeffects = (0,external_wp_element_namespaceobject.usememo)(
    () => alleventlisteners.map((refeffect) => refeffect(propsref)),
    [propsref]
  );
  return (0,external_wp_compose_namespaceobject.userefeffect)(
    (element) => {
      const cleanups = refeffects.map((effect) => effect(element));
      return () => {
        cleanups.foreach((cleanup) => cleanup());
      };
    },
    [refeffects]
  );
}


;// ./node_modules/@wordpress/rich-text/build-module/component/index.js









function userichtext({
  value = "",
  selectionstart,
  selectionend,
  placeholder,
  onselectionchange,
  preservewhitespace,
  onchange,
  __unstabledisableformats: disableformats,
  __unstableisselected: isselected,
  __unstabledependencies = [],
  __unstableafterparse,
  __unstablebeforeserialize,
  __unstableaddinvisibleformats
}) {
  const registry = (0,external_wp_data_namespaceobject.useregistry)();
  const [, forcerender] = (0,external_wp_element_namespaceobject.usereducer)(() => ({}));
  const ref = (0,external_wp_element_namespaceobject.useref)();
  function createrecord() {
    const {
      ownerdocument: { defaultview }
    } = ref.current;
    const selection = defaultview.getselection();
    const range = selection.rangecount > 0 ? selection.getrangeat(0) : null;
    return create({
      element: ref.current,
      range,
      __unstableiseditabletree: true
    });
  }
  function applyrecord(newrecord, { domonly } = {}) {
    apply({
      value: newrecord,
      current: ref.current,
      prepareeditabletree: __unstableaddinvisibleformats,
      __unstabledomonly: domonly,
      placeholder
    });
  }
  const _valueref = (0,external_wp_element_namespaceobject.useref)(value);
  const recordref = (0,external_wp_element_namespaceobject.useref)();
  function setrecordfromprops() {
    _valueref.current = value;
    recordref.current = value;
    if (!(value instanceof richtextdata)) {
      recordref.current = value ? richtextdata.fromhtmlstring(value, { preservewhitespace }) : richtextdata.empty();
    }
    recordref.current = {
      text: recordref.current.text,
      formats: recordref.current.formats,
      replacements: recordref.current.replacements
    };
    if (disableformats) {
      recordref.current.formats = array(value.length);
      recordref.current.replacements = array(value.length);
    }
    if (__unstableafterparse) {
      recordref.current.formats = __unstableafterparse(
        recordref.current
      );
    }
    recordref.current.start = selectionstart;
    recordref.current.end = selectionend;
  }
  const hadselectionupdateref = (0,external_wp_element_namespaceobject.useref)(false);
  if (!recordref.current) {
    hadselectionupdateref.current = isselected;
    setrecordfromprops();
  } else if (selectionstart !== recordref.current.start || selectionend !== recordref.current.end) {
    hadselectionupdateref.current = isselected;
    recordref.current = {
      ...recordref.current,
      start: selectionstart,
      end: selectionend,
      activeformats: void 0
    };
  }
  function handlechange(newrecord) {
    recordref.current = newrecord;
    applyrecord(newrecord);
    if (disableformats) {
      _valueref.current = newrecord.text;
    } else {
      const newformats = __unstablebeforeserialize ? __unstablebeforeserialize(newrecord) : newrecord.formats;
      newrecord = { ...newrecord, formats: newformats };
      if (typeof value === "string") {
        _valueref.current = tohtmlstring({
          value: newrecord,
          preservewhitespace
        });
      } else {
        _valueref.current = new richtextdata(newrecord);
      }
    }
    const { start, end, formats, text } = recordref.current;
    registry.batch(() => {
      onselectionchange(start, end);
      onchange(_valueref.current, {
        __unstableformats: formats,
        __unstabletext: text
      });
    });
    forcerender();
  }
  function applyfromprops() {
    const previousvalue = _valueref.current;
    setrecordfromprops();
    const contentlengthchanged = previousvalue && typeof previousvalue === "string" && typeof value === "string" && previousvalue.length !== value.length;
    const hasfocus = ref.current?.contains(
      ref.current.ownerdocument.activeelement
    );
    const skipselection = contentlengthchanged && !hasfocus;
    applyrecord(recordref.current, { domonly: skipselection });
  }
  const didmountref = (0,external_wp_element_namespaceobject.useref)(false);
  (0,external_wp_element_namespaceobject.uselayouteffect)(() => {
    if (didmountref.current && value !== _valueref.current) {
      applyfromprops();
      forcerender();
    }
  }, [value]);
  (0,external_wp_element_namespaceobject.uselayouteffect)(() => {
    if (!hadselectionupdateref.current) {
      return;
    }
    if (ref.current.ownerdocument.activeelement !== ref.current) {
      ref.current.focus();
    }
    applyrecord(recordref.current);
    hadselectionupdateref.current = false;
  }, [hadselectionupdateref.current]);
  const mergedrefs = (0,external_wp_compose_namespaceobject.usemergerefs)([
    ref,
    usedefaultstyle(),
    useboundarystyle({ record: recordref }),
    useeventlisteners({
      record: recordref,
      handlechange,
      applyrecord,
      createrecord,
      isselected,
      onselectionchange,
      forcerender
    }),
    (0,external_wp_compose_namespaceobject.userefeffect)(() => {
      applyfromprops();
      didmountref.current = true;
    }, [placeholder, ...__unstabledependencies])
  ]);
  return {
    value: recordref.current,
    // a function to get the most recent value so event handlers in
    // userichtext implementations have access to it. for example when
    // listening to input events, we internally update the state, but this
    // state is not yet available to the input event handler because react
    // may re-render asynchronously.
    getvalue: () => recordref.current,
    onchange: handlechange,
    ref: mergedrefs
  };
}
function __experimentalrichtext() {
}


;// ./node_modules/@wordpress/rich-text/build-module/index.js





























(window.wp = window.wp || {}).richtext = __webpack_exports__;
/******/ })()
;







