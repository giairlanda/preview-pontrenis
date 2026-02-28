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
  "default": () => (/* binding */ latextomathml)
});

;// ./node_modules/temml/dist/temml.mjs
/**
 * this is the parseerror class, which is the main error thrown by temml
 * functions when something has gone wrong. this is used to distinguish internal
 * errors from errors in the expression that the user provided.
 *
 * if possible, a caller should provide a token or parsenode with information
 * about where in the source string the problem occurred.
 */
class parseerror {
  constructor(
    message, // the error message
    token // an object providing position information
  ) {
    let error = " " + message;
    let start;

    const loc = token && token.loc;
    if (loc && loc.start <= loc.end) {
      // if we have the input and a position, make the error a bit fancier

      // get the input
      const input = loc.lexer.input;

      // prepend some information
      start = loc.start;
      const end = loc.end;
      if (start === input.length) {
        error += " at end of input: ";
      } else {
        error += " at position " + (start + 1) + ": ";
      }

      // underline token in question using combining underscores
      const underlined = input.slice(start, end).replace(/[^]/g, "$&\u0332");

      // extract some context from the input and add it to the error
      let left;
      if (start > 15) {
        left = "‚Ä¶" + input.slice(start - 15, start);
      } else {
        left = input.slice(0, start);
      }
      let right;
      if (end + 15 < input.length) {
        right = input.slice(end, end + 15) + "‚Ä¶";
      } else {
        right = input.slice(end);
      }
      error += left + underlined + right;
    }

    // some hackery to make parseerror a prototype of error
    // see http://stackoverflow.com/a/8460753
    const self = new error(error);
    self.name = "parseerror";
    self.__proto__ = parseerror.prototype;
    self.position = start;
    return self;
  }
}

parseerror.prototype.__proto__ = error.prototype;

//
/**
 * this file contains a list of utility functions which are useful in other
 * files.
 */

/**
 * provide a default value if a setting is undefined
 */
const deflt = function(setting, defaultifundefined) {
  return setting === undefined ? defaultifundefined : setting;
};

// hyphenate and escape adapted from facebook's react under apache 2 license

const uppercase = /([a-z])/g;
const hyphenate = function(str) {
  return str.replace(uppercase, "-$1").tolowercase();
};

const escape_lookup = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  '"': "&quot;",
  "'": "&#x27;"
};

const escape_regex = /[&><"']/g;

/**
 * escapes text to prevent scripting attacks.
 */
function temml_escape(text) {
  return string(text).replace(escape_regex, (match) => escape_lookup[match]);
}

/**
 * sometimes we want to pull out the innermost element of a group. in most
 * cases, this will just be the group itself, but when ordgroups and colors have
 * a single element, we want to pull that out.
 */
const getbaseelem = function(group) {
  if (group.type === "ordgroup") {
    if (group.body.length === 1) {
      return getbaseelem(group.body[0]);
    } else {
      return group;
    }
  } else if (group.type === "color") {
    if (group.body.length === 1) {
      return getbaseelem(group.body[0]);
    } else {
      return group;
    }
  } else if (group.type === "font") {
    return getbaseelem(group.body);
  } else {
    return group;
  }
};

/**
 * texbook algorithms often reference "character boxes", which are simply groups
 * with a single character in them. to decide if something is a character box,
 * we find its innermost group, and see if it is a single character.
 */
const ischaracterbox = function(group) {
  const baseelem = getbaseelem(group);

  // these are all the types of groups which hold single characters
  return baseelem.type === "mathord" || baseelem.type === "textord" || baseelem.type === "atom"
};

const assert = function(value) {
  if (!value) {
    throw new error("expected non-null, but got " + string(value));
  }
  return value;
};

/**
 * return the protocol of a url, or "_relative" if the url does not specify a
 * protocol (and thus is relative), or `null` if url has invalid protocol
 * (so should be outright rejected).
 */
const protocolfromurl = function(url) {
  // check for possible leading protocol.
  // https://url.spec.whatwg.org/#url-parsing strips leading whitespace
  // (\x00) or c0 control (\x00-\x1f) characters.
  // eslint-disable-next-line no-control-regex
  const protocol = /^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(url);
  if (!protocol) {
    return "_relative";
  }
  // reject weird colons
  if (protocol[2] !== ":") {
    return null;
  }
  // reject invalid characters in scheme according to
  // https://datatracker.ietf.org/doc/html/rfc3986#section-3.1
  if (!/^[a-za-z][a-za-z0-9+\-.]*$/.test(protocol[1])) {
    return null;
  }
  // lowercase the protocol
  return protocol[1].tolowercase();
};

/**
 * round `n` to 4 decimal places, or to the nearest 1/10,000th em. the texbook
 * gives an acceptable rounding error of 100sp (which would be the nearest
 * 1/6551.6em with our ptperem = 10):
 * http://www.ctex.org/documents/shredder/src/texbook.pdf#page=69
 */
const round = function(n) {
  return +n.tofixed(4);
};

var utils = {
  deflt,
  escape: temml_escape,
  hyphenate,
  getbaseelem,
  ischaracterbox,
  protocolfromurl,
  round
};

/**
 * this is a module for storing settings passed into temml. it correctly handles
 * default settings.
 */


/**
 * the main settings object
 */
class settings {
  constructor(options) {
    // allow null options
    options = options || {};
    this.displaymode = utils.deflt(options.displaymode, false);    // boolean
    this.annotate = utils.deflt(options.annotate, false);           // boolean
    this.leqno = utils.deflt(options.leqno, false);                // boolean
    this.throwonerror = utils.deflt(options.throwonerror, false);  // boolean
    this.errorcolor = utils.deflt(options.errorcolor, "#b22222");  // string
    this.macros = options.macros || {};
    this.wrap = utils.deflt(options.wrap, "tex");                    // "tex" | "="
    this.xml = utils.deflt(options.xml, false);                     // boolean
    this.coloristextcolor = utils.deflt(options.coloristextcolor, false);  // booelean
    this.strict = utils.deflt(options.strict, false);    // boolean
    this.trust = utils.deflt(options.trust, false);  // trust context. see html.js.
    this.maxsize = (options.maxsize === undefined
      ? [infinity, infinity]
      : array.isarray(options.maxsize)
      ? options.maxsize
      : [infinity, infinity]
    );
    this.maxexpand = math.max(0, utils.deflt(options.maxexpand, 1000)); // number
  }

  /**
   * check whether to test potentially dangerous input, and return
   * `true` (trusted) or `false` (untrusted).  the sole argument `context`
   * should be an object with `command` field specifying the relevant latex
   * command (as a string starting with `\`), and any other arguments, etc.
   * if `context` has a `url` field, a `protocol` field will automatically
   * get added by this function (changing the specified object).
   */
  istrusted(context) {
    if (context.url && !context.protocol) {
      const protocol = utils.protocolfromurl(context.url);
      if (protocol == null) {
        return false
      }
      context.protocol = protocol;
    }
    const trust = typeof this.trust === "function" ? this.trust(context) : this.trust;
    return boolean(trust);
  }
}

/**
 * all registered functions.
 * `functions.js` just exports this same dictionary again and makes it public.
 * `parser.js` requires this dictionary.
 */
const _functions = {};

/**
 * all mathml builders. should be only used in the `define*` and the `build*ml`
 * functions.
 */
const _mathmlgroupbuilders = {};

function definefunction({
  type,
  names,
  props,
  handler,
  mathmlbuilder
}) {
  // set default values of functions
  const data = {
    type,
    numargs: props.numargs,
    argtypes: props.argtypes,
    allowedinargument: !!props.allowedinargument,
    allowedintext: !!props.allowedintext,
    allowedinmath: props.allowedinmath === undefined ? true : props.allowedinmath,
    numoptionalargs: props.numoptionalargs || 0,
    infix: !!props.infix,
    primitive: !!props.primitive,
    handler: handler
  };
  for (let i = 0; i < names.length; ++i) {
    _functions[names[i]] = data;
  }
  if (type) {
    if (mathmlbuilder) {
      _mathmlgroupbuilders[type] = mathmlbuilder;
    }
  }
}

/**
 * use this to register only the mathml builder for a function(e.g.
 * if the function's parsenode is generated in parser.js rather than via a
 * stand-alone handler provided to `definefunction`).
 */
function definefunctionbuilders({ type, mathmlbuilder }) {
  definefunction({
    type,
    names: [],
    props: { numargs: 0 },
    handler() {
      throw new error("should never be called.")
    },
    mathmlbuilder
  });
}

const normalizeargument = function(arg) {
  return arg.type === "ordgroup" && arg.body.length === 1 ? arg.body[0] : arg
};

// since the corresponding buildmathml function expects a
// list of elements, we normalize for different kinds of arguments
const ordargument = function(arg) {
  return arg.type === "ordgroup" ? arg.body : [arg]
};

/**
 * this node represents a document fragment, which contains elements, but when
 * placed into the dom doesn't have any representation itself. it only contains
 * children and doesn't have any dom node properties.
 */
class documentfragment {
  constructor(children) {
    this.children = children;
    this.classes = [];
    this.style = {};
  }

  hasclass(classname) {
    return this.classes.includes(classname);
  }

  /** convert the fragment into a node. */
  tonode() {
    const frag = document.createdocumentfragment();

    for (let i = 0; i < this.children.length; i++) {
      frag.appendchild(this.children[i].tonode());
    }

    return frag;
  }

  /** convert the fragment into html markup. */
  tomarkup() {
    let markup = "";

    // simply concatenate the markup for the children together.
    for (let i = 0; i < this.children.length; i++) {
      markup += this.children[i].tomarkup();
    }

    return markup;
  }

  /**
   * converts the math node into a string, similar to innertext. applies to
   * mathdomnode's only.
   */
  totext() {
    // to avoid this, we would subclass documentfragment separately for
    // mathml, but polyfills for subclassing is expensive per pr 1469.
    const totext = (child) => child.totext();
    return this.children.map(totext).join("");
  }
}

/**
 * these objects store the data about the dom nodes we create, as well as some
 * extra data. they can then be transformed into real dom nodes with the
 * `tonode` function or html markup using `tomarkup`. they are useful for both
 * storing extra properties on the nodes, as well as providing a way to easily
 * work with the dom.
 *
 * similar functions for working with mathml nodes exist in mathmltree.js.
 *
 */

/**
 * create an html classname based on a list of classes. in addition to joining
 * with spaces, we also remove empty classes.
 */
const createclass = function(classes) {
  return classes.filter((cls) => cls).join(" ");
};

const initnode = function(classes, style) {
  this.classes = classes || [];
  this.attributes = {};
  this.style = style || {};
};

/**
 * convert into an html node
 */
const tonode = function(tagname) {
  const node = document.createelement(tagname);

  // apply the class
  node.classname = createclass(this.classes);

  // apply inline styles
  for (const style in this.style) {
    if (object.prototype.hasownproperty.call(this.style, style )) {
      node.style[style] = this.style[style];
    }
  }

  // apply attributes
  for (const attr in this.attributes) {
    if (object.prototype.hasownproperty.call(this.attributes, attr )) {
      node.setattribute(attr, this.attributes[attr]);
    }
  }

  // append the children, also as html nodes
  for (let i = 0; i < this.children.length; i++) {
    node.appendchild(this.children[i].tonode());
  }

  return node;
};

/**
 * convert into an html markup string
 */
const tomarkup = function(tagname) {
  let markup = `<${tagname}`;

  // add the class
  if (this.classes.length) {
    markup += ` class="${utils.escape(createclass(this.classes))}"`;
  }

  let styles = "";

  // add the styles, after hyphenation
  for (const style in this.style) {
    if (object.prototype.hasownproperty.call(this.style, style )) {
      styles += `${utils.hyphenate(style)}:${this.style[style]};`;
    }
  }

  if (styles) {
    markup += ` style="${styles}"`;
  }

  // add the attributes
  for (const attr in this.attributes) {
    if (object.prototype.hasownproperty.call(this.attributes, attr )) {
      markup += ` ${attr}="${utils.escape(this.attributes[attr])}"`;
    }
  }

  markup += ">";

  // add the markup of the children, also as markup
  for (let i = 0; i < this.children.length; i++) {
    markup += this.children[i].tomarkup();
  }

  markup += `</${tagname}>`;

  return markup;
};

/**
 * this node represents a span node, with a classname, a list of children, and
 * an inline style.
 *
 */
class span {
  constructor(classes, children, style) {
    initnode.call(this, classes, style);
    this.children = children || [];
  }

  setattribute(attribute, value) {
    this.attributes[attribute] = value;
  }

  tonode() {
    return tonode.call(this, "span");
  }

  tomarkup() {
    return tomarkup.call(this, "span");
  }
}

let textnode$1 = class textnode {
  constructor(text) {
    this.text = text;
  }
  tonode() {
    return document.createtextnode(this.text);
  }
  tomarkup() {
    return utils.escape(this.text);
  }
};

// create an <a href="‚Ä¶"> node.
class anchornode {
  constructor(href, classes, children) {
    this.href = href;
    this.classes = classes;
    this.children = children || [];
  }

  tonode() {
    const node = document.createelement("a");
    node.setattribute("href", this.href);
    if (this.classes.length > 0) {
      node.classname = createclass(this.classes);
    }
    for (let i = 0; i < this.children.length; i++) {
      node.appendchild(this.children[i].tonode());
    }
    return node
  }

  tomarkup() {
    let markup = `<a href='${utils.escape(this.href)}'`;
    if (this.classes.length > 0) {
      markup += ` class="${utils.escape(createclass(this.classes))}"`;
    }
    markup += ">";
    for (let i = 0; i < this.children.length; i++) {
      markup += this.children[i].tomarkup();
    }
    markup += "</a>";
    return markup
  }
}

/*
 * this node represents an image embed (<img>) element.
 */
class img {
  constructor(src, alt, style) {
    this.alt = alt;
    this.src = src;
    this.classes = ["mord"];
    this.style = style;
  }

  hasclass(classname) {
    return this.classes.includes(classname);
  }

  tonode() {
    const node = document.createelement("img");
    node.src = this.src;
    node.alt = this.alt;
    node.classname = "mord";

    // apply inline styles
    for (const style in this.style) {
      if (object.prototype.hasownproperty.call(this.style, style )) {
        node.style[style] = this.style[style];
      }
    }

    return node;
  }

  tomarkup() {
    let markup = `<img src='${this.src}' alt='${this.alt}'`;

    // add the styles, after hyphenation
    let styles = "";
    for (const style in this.style) {
      if (object.prototype.hasownproperty.call(this.style, style )) {
        styles += `${utils.hyphenate(style)}:${this.style[style]};`;
      }
    }
    if (styles) {
      markup += ` style="${utils.escape(styles)}"`;
    }

    markup += ">";
    return markup;
  }
}

//
/**
 * these objects store data about mathml nodes.
 * the `tonode` and `tomarkup` functions  create namespaced dom nodes and
 * html text markup respectively.
 */


function newdocumentfragment(children) {
  return new documentfragment(children);
}

/**
 * this node represents a general purpose mathml node of any type,
 * for example, `"mo"` or `"mspace"`, corresponding to `<mo>` and
 * `<mspace>` tags).
 */
class mathnode {
  constructor(type, children, classes, style) {
    this.type = type;
    this.attributes = {};
    this.children = children || [];
    this.classes = classes || [];
    this.style = style || {};   // used for <mstyle> elements
    this.label = "";
  }

  /**
   * sets an attribute on a mathml node. mathml depends on attributes to convey a
   * semantic content, so this is used heavily.
   */
  setattribute(name, value) {
    this.attributes[name] = value;
  }

  /**
   * gets an attribute on a mathml node.
   */
  getattribute(name) {
    return this.attributes[name];
  }

  setlabel(value) {
    this.label = value;
  }

  /**
   * converts the math node into a mathml-namespaced dom element.
   */
  tonode() {
    const node = document.createelementns("http://www.w3.org/1998/math/mathml", this.type);

    for (const attr in this.attributes) {
      if (object.prototype.hasownproperty.call(this.attributes, attr)) {
        node.setattribute(attr, this.attributes[attr]);
      }
    }

    if (this.classes.length > 0) {
      node.classname = createclass(this.classes);
    }

    // apply inline styles
    for (const style in this.style) {
      if (object.prototype.hasownproperty.call(this.style, style )) {
        node.style[style] = this.style[style];
      }
    }

    for (let i = 0; i < this.children.length; i++) {
      node.appendchild(this.children[i].tonode());
    }

    return node;
  }

  /**
   * converts the math node into an html markup string.
   */
  tomarkup() {
    let markup = "<" + this.type;

    // add the attributes
    for (const attr in this.attributes) {
      if (object.prototype.hasownproperty.call(this.attributes, attr)) {
        markup += " " + attr + '="';
        markup += utils.escape(this.attributes[attr]);
        markup += '"';
      }
    }

    if (this.classes.length > 0) {
      markup += ` class="${utils.escape(createclass(this.classes))}"`;
    }

    let styles = "";

    // add the styles, after hyphenation
    for (const style in this.style) {
      if (object.prototype.hasownproperty.call(this.style, style )) {
        styles += `${utils.hyphenate(style)}:${this.style[style]};`;
      }
    }

    if (styles) {
      markup += ` style="${styles}"`;
    }

    markup += ">";

    for (let i = 0; i < this.children.length; i++) {
      markup += this.children[i].tomarkup();
    }

    markup += "</" + this.type + ">";

    return markup;
  }

  /**
   * converts the math node into a string, similar to innertext, but escaped.
   */
  totext() {
    return this.children.map((child) => child.totext()).join("");
  }
}

/**
 * this node represents a piece of text.
 */
class textnode {
  constructor(text) {
    this.text = text;
  }

  /**
   * converts the text node into a dom text node.
   */
  tonode() {
    return document.createtextnode(this.text);
  }

  /**
   * converts the text node into escaped html markup
   * (representing the text itself).
   */
  tomarkup() {
    return utils.escape(this.totext());
  }

  /**
   * converts the text node into a string
   * (representing the text itself).
   */
  totext() {
    return this.text;
  }
}

// do not make an <mrow> the only child of a <mstyle>.
// an <mstyle> acts as its own implicit <mrow>.
const wrapwithmstyle = expression => {
  let node;
  if (expression.length === 1 && expression[0].type === "mrow") {
    node = expression.pop();
    node.type = "mstyle";
  } else {
    node = new mathnode("mstyle", expression);
  }
  return node
};

var mathmltree = {
  mathnode,
  textnode,
  newdocumentfragment
};

/**
 * this file provides support for building horizontal stretchy elements.
 */


// todo: remove when chromium stretches \widetilde & \widehat
const estimatedwidth = node => {
  let width = 0;
  if (node.body) {
    for (const item of node.body) {
      width += estimatedwidth(item);
    }
  } else if (node.type === "supsub") {
    width += estimatedwidth(node.base);
    if (node.sub) { width += 0.7 * estimatedwidth(node.sub); }
    if (node.sup) { width += 0.7 * estimatedwidth(node.sup); }
  } else if (node.type === "mathord" || node.type === "textord") {
    for (const ch of node.text.split('')) {
      const codepoint = ch.codepointat(0);
      if ((0x60 < codepoint && codepoint < 0x7b) || (0x03b0 < codepoint && codepoint < 0x3ca)) {
        width += 0.56; // lower case latin or greek. use advance width of letter n
      } else if (0x2f < codepoint && codepoint < 0x3a) {
        width += 0.50; // numerals.
      } else {
        width += 0.92; // advance width of letter m
      }
    }
  } else {
    width += 1.0;
  }
  return width
};

const stretchycodepoint = {
  widehat: "^",
  widecheck: "Îá",
  widetilde: "~",
  wideparen: "‚èú", // \u23dc
  utilde: "~",
  overleftarrow: "\u2190",
  underleftarrow: "\u2190",
  xleftarrow: "\u2190",
  overrightarrow: "\u2192",
  underrightarrow: "\u2192",
  xrightarrow: "\u2192",
  underbrace: "\u23df",
  overbrace: "\u23de",
  overgroup: "\u23e0",
  overparen: "‚èú",
  undergroup: "\u23e1",
  underparen: "\u23dd",
  overleftrightarrow: "\u2194",
  underleftrightarrow: "\u2194",
  xleftrightarrow: "\u2194",
  overrightarrow: "\u21d2",
  xrightarrow: "\u21d2",
  overleftharpoon: "\u21bc",
  xleftharpoonup: "\u21bc",
  overrightharpoon: "\u21c0",
  xrightharpoonup: "\u21c0",
  xleftarrow: "\u21d0",
  xleftrightarrow: "\u21d4",
  xhookleftarrow: "\u21a9",
  xhookrightarrow: "\u21aa",
  xmapsto: "\u21a6",
  xrightharpoondown: "\u21c1",
  xleftharpoondown: "\u21bd",
  xtwoheadleftarrow: "\u219e",
  xtwoheadrightarrow: "\u21a0",
  xlongequal: "=",
  xrightleftarrows: "\u21c4",
  yields: "\u2192",
  yieldsleft: "\u2190",
  mesomerism: "\u2194",
  longrightharpoonup: "\u21c0",
  longleftharpoondown: "\u21bd",
  eqrightharpoonup: "\u21c0",
  eqleftharpoondown: "\u21bd",
  "\\cdrightarrow": "\u2192",
  "\\cdleftarrow": "\u2190",
  "\\cdlongequal": "="
};

const mathmlnode = function(label) {
  const child = new mathmltree.textnode(stretchycodepoint[label.slice(1)]);
  const node = new mathmltree.mathnode("mo", [child]);
  node.setattribute("stretchy", "true");
  return node
};

const crookedwides = ["\\widetilde", "\\widehat", "\\widecheck", "\\utilde"];

// todo: remove when chromium stretches \widetilde & \widehat
const accentnode = (group) => {
  const mo = mathmlnode(group.label);
  if (crookedwides.includes(group.label)) {
    const width = estimatedwidth(group.base);
    if (1 < width && width < 1.6) {
      mo.classes.push("tml-crooked-2");
    } else if (1.6 <= width && width < 2.5) {
      mo.classes.push("tml-crooked-3");
    } else if (2.5 <= width) {
      mo.classes.push("tml-crooked-4");
    }
  }
  return mo
};

var stretchy = {
  mathmlnode,
  accentnode
};

/**
 * this file holds a list of all no-argument functions and single-character
 * symbols (like 'a' or ';').
 *
 * for each of the symbols, there are two properties they can have:
 * - group (required): the parsenode group type the symbol should have (i.e.
     "textord", "mathord", etc).
 * - replace: the character that this symbol or function should be
 *   replaced with (i.e. "\phi" has a replace value of "\u03d5", the phi
 *   character in the main font).
 *
 * the outermost map in the table indicates what mode the symbols should be
 * accepted in (e.g. "math" or "text").
 */

// some of these have a "-token" suffix since these are also used as `parsenode`
// types for raw text tokens, and we want to avoid conflicts with higher-level
// `parsenode` types. these `parsenode`s are constructed within `parser` by
// looking up the `symbols` map.
const atoms = {
  bin: 1,
  close: 1,
  inner: 1,
  open: 1,
  punct: 1,
  rel: 1
};
const non_atoms = {
  "accent-token": 1,
  mathord: 1,
  "op-token": 1,
  spacing: 1,
  textord: 1
};

const symbols = {
  math: {},
  text: {}
};

/** `acceptunicodechar = true` is only applicable if `replace` is set. */
function definesymbol(mode, group, replace, name, acceptunicodechar) {
  symbols[mode][name] = { group, replace };

  if (acceptunicodechar && replace) {
    symbols[mode][replace] = symbols[mode][name];
  }
}

// some abbreviations for commonly used strings.
// this helps minify the code, and also spotting typos using jshint.

// modes:
const math = "math";
const temml_text = "text";

// groups:
const accent = "accent-token";
const bin = "bin";
const temml_close = "close";
const inner = "inner";
const mathord = "mathord";
const op = "op-token";
const temml_open = "open";
const punct = "punct";
const rel = "rel";
const spacing = "spacing";
const textord = "textord";

// now comes the symbol table

// relation symbols
definesymbol(math, rel, "\u2261", "\\equiv", true);
definesymbol(math, rel, "\u227a", "\\prec", true);
definesymbol(math, rel, "\u227b", "\\succ", true);
definesymbol(math, rel, "\u223c", "\\sim", true);
definesymbol(math, rel, "\u27c2", "\\perp", true);
definesymbol(math, rel, "\u2aaf", "\\preceq", true);
definesymbol(math, rel, "\u2ab0", "\\succeq", true);
definesymbol(math, rel, "\u2243", "\\simeq", true);
definesymbol(math, rel, "\u224c", "\\backcong", true);
definesymbol(math, rel, "|", "\\mid", true);
definesymbol(math, rel, "\u226a", "\\ll", true);
definesymbol(math, rel, "\u226b", "\\gg", true);
definesymbol(math, rel, "\u224d", "\\asymp", true);
definesymbol(math, rel, "\u2225", "\\parallel");
definesymbol(math, rel, "\u2323", "\\smile", true);
definesymbol(math, rel, "\u2291", "\\sqsubseteq", true);
definesymbol(math, rel, "\u2292", "\\sqsupseteq", true);
definesymbol(math, rel, "\u2250", "\\doteq", true);
definesymbol(math, rel, "\u2322", "\\frown", true);
definesymbol(math, rel, "\u220b", "\\ni", true);
definesymbol(math, rel, "\u220c", "\\notni", true);
definesymbol(math, rel, "\u221d", "\\propto", true);
definesymbol(math, rel, "\u22a2", "\\vdash", true);
definesymbol(math, rel, "\u22a3", "\\dashv", true);
definesymbol(math, rel, "\u220b", "\\owns");
definesymbol(math, rel, "\u2258", "\\arceq", true);
definesymbol(math, rel, "\u2259", "\\wedgeq", true);
definesymbol(math, rel, "\u225a", "\\veeeq", true);
definesymbol(math, rel, "\u225b", "\\stareq", true);
definesymbol(math, rel, "\u225d", "\\eqdef", true);
definesymbol(math, rel, "\u225e", "\\measeq", true);
definesymbol(math, rel, "\u225f", "\\questeq", true);
definesymbol(math, rel, "\u2260", "\\ne", true);
definesymbol(math, rel, "\u2260", "\\neq");
// unicodemath
definesymbol(math, rel, "\u2a75", "\\eqeq", true);
definesymbol(math, rel, "\u2a76", "\\eqeqeq", true);
// mathtools.sty
definesymbol(math, rel, "\u2237", "\\dblcolon", true);
definesymbol(math, rel, "\u2254", "\\coloneqq", true);
definesymbol(math, rel, "\u2255", "\\eqqcolon", true);
definesymbol(math, rel, "\u2239", "\\eqcolon", true);
definesymbol(math, rel, "\u2a74", "\\coloneqq", true);

// punctuation
definesymbol(math, punct, "\u002e", "\\ldotp");
definesymbol(math, punct, "\u00b7", "\\cdotp");

// misc symbols
definesymbol(math, textord, "\u0023", "\\#");
definesymbol(temml_text, textord, "\u0023", "\\#");
definesymbol(math, textord, "\u0026", "\\&");
definesymbol(temml_text, textord, "\u0026", "\\&");
definesymbol(math, textord, "\u2135", "\\aleph", true);
definesymbol(math, textord, "\u2200", "\\forall", true);
definesymbol(math, textord, "\u210f", "\\hbar", true);
definesymbol(math, textord, "\u2203", "\\exists", true);
// ‚àá is actually a unary operator, not binary. but this works.
definesymbol(math, bin, "\u2207", "\\nabla", true);
definesymbol(math, textord, "\u266d", "\\flat", true);
definesymbol(math, textord, "\u2113", "\\ell", true);
definesymbol(math, textord, "\u266e", "\\natural", true);
definesymbol(math, textord, "‚Ñ´", "\\angstrom", true);
definesymbol(temml_text, textord, "‚Ñ´", "\\angstrom", true);
definesymbol(math, textord, "\u2663", "\\clubsuit", true);
definesymbol(math, textord, "\u2667", "\\varclubsuit", true);
definesymbol(math, textord, "\u2118", "\\wp", true);
definesymbol(math, textord, "\u266f", "\\sharp", true);
definesymbol(math, textord, "\u2662", "\\diamondsuit", true);
definesymbol(math, textord, "\u2666", "\\vardiamondsuit", true);
definesymbol(math, textord, "\u211c", "\\re", true);
definesymbol(math, textord, "\u2661", "\\heartsuit", true);
definesymbol(math, textord, "\u2665", "\\varheartsuit", true);
definesymbol(math, textord, "\u2111", "\\im", true);
definesymbol(math, textord, "\u2660", "\\spadesuit", true);
definesymbol(math, textord, "\u2664", "\\varspadesuit", true);
definesymbol(math, textord, "\u2640", "\\female", true);
definesymbol(math, textord, "\u2642", "\\male", true);
definesymbol(math, textord, "\u00a7", "\\s", true);
definesymbol(temml_text, textord, "\u00a7", "\\s");
definesymbol(math, textord, "\u00b6", "\\p", true);
definesymbol(temml_text, textord, "\u00b6", "\\p");
definesymbol(temml_text, textord, "\u263a", "\\smiley", true);
definesymbol(math, textord, "\u263a", "\\smiley", true);

// math and text
definesymbol(math, textord, "\u2020", "\\dag");
definesymbol(temml_text, textord, "\u2020", "\\dag");
definesymbol(temml_text, textord, "\u2020", "\\textdagger");
definesymbol(math, textord, "\u2021", "\\ddag");
definesymbol(temml_text, textord, "\u2021", "\\ddag");
definesymbol(temml_text, textord, "\u2021", "\\textdaggerdbl");

// large delimiters
definesymbol(math, temml_close, "\u23b1", "\\rmoustache", true);
definesymbol(math, temml_open, "\u23b0", "\\lmoustache", true);
definesymbol(math, temml_close, "\u27ef", "\\rgroup", true);
definesymbol(math, temml_open, "\u27ee", "\\lgroup", true);

// binary operators
definesymbol(math, bin, "\u2213", "\\mp", true);
definesymbol(math, bin, "\u2296", "\\ominus", true);
definesymbol(math, bin, "\u228e", "\\uplus", true);
definesymbol(math, bin, "\u2293", "\\sqcap", true);
definesymbol(math, bin, "\u2217", "\\ast");
definesymbol(math, bin, "\u2294", "\\sqcup", true);
definesymbol(math, bin, "\u25ef", "\\bigcirc", true);
definesymbol(math, bin, "\u2219", "\\bullet", true);
definesymbol(math, bin, "\u2021", "\\ddagger");
definesymbol(math, bin, "\u2240", "\\wr", true);
definesymbol(math, bin, "\u2a3f", "\\amalg");
definesymbol(math, bin, "\u0026", "\\and"); // from amsmath
definesymbol(math, bin, "\u2afd", "\\sslash", true); // from stmaryrd

// arrow symbols
definesymbol(math, rel, "\u27f5", "\\longleftarrow", true);
definesymbol(math, rel, "\u21d0", "\\leftarrow", true);
definesymbol(math, rel, "\u27f8", "\\longleftarrow", true);
definesymbol(math, rel, "\u27f6", "\\longrightarrow", true);
definesymbol(math, rel, "\u21d2", "\\rightarrow", true);
definesymbol(math, rel, "\u27f9", "\\longrightarrow", true);
definesymbol(math, rel, "\u2194", "\\leftrightarrow", true);
definesymbol(math, rel, "\u27f7", "\\longleftrightarrow", true);
definesymbol(math, rel, "\u21d4", "\\leftrightarrow", true);
definesymbol(math, rel, "\u27fa", "\\longleftrightarrow", true);
definesymbol(math, rel, "\u21a4", "\\mapsfrom", true);
definesymbol(math, rel, "\u21a6", "\\mapsto", true);
definesymbol(math, rel, "\u27fc", "\\longmapsto", true);
definesymbol(math, rel, "\u2197", "\\nearrow", true);
definesymbol(math, rel, "\u21a9", "\\hookleftarrow", true);
definesymbol(math, rel, "\u21aa", "\\hookrightarrow", true);
definesymbol(math, rel, "\u2198", "\\searrow", true);
definesymbol(math, rel, "\u21bc", "\\leftharpoonup", true);
definesymbol(math, rel, "\u21c0", "\\rightharpoonup", true);
definesymbol(math, rel, "\u2199", "\\swarrow", true);
definesymbol(math, rel, "\u21bd", "\\leftharpoondown", true);
definesymbol(math, rel, "\u21c1", "\\rightharpoondown", true);
definesymbol(math, rel, "\u2196", "\\nwarrow", true);
definesymbol(math, rel, "\u21cc", "\\rightleftharpoons", true);
definesymbol(math, mathord, "\u21af", "\\lightning", true);
definesymbol(math, mathord, "\u220e", "\\qed", true);
definesymbol(math, mathord, "\u2030", "\\permil", true);
definesymbol(temml_text, textord, "\u2030", "\\permil");
definesymbol(math, mathord, "\u2609", "\\astrosun", true);
definesymbol(math, mathord, "\u263c", "\\sun", true);
definesymbol(math, mathord, "\u263e", "\\leftmoon", true);
definesymbol(math, mathord, "\u263d", "\\rightmoon", true);
definesymbol(math, mathord, "\u2295", "\\earth");

// ams negated binary relations
definesymbol(math, rel, "\u226e", "\\nless", true);
// symbol names preceeded by "@" each have a corresponding macro.
definesymbol(math, rel, "\u2a87", "\\lneq", true);
definesymbol(math, rel, "\u2268", "\\lneqq", true);
definesymbol(math, rel, "\u2268\ufe00", "\\lvertneqq");
definesymbol(math, rel, "\u22e6", "\\lnsim", true);
definesymbol(math, rel, "\u2a89", "\\lnapprox", true);
definesymbol(math, rel, "\u2280", "\\nprec", true);
// unicode-math maps \u22e0 to \npreccurlyeq. we'll use the ams synonym.
definesymbol(math, rel, "\u22e0", "\\npreceq", true);
definesymbol(math, rel, "\u22e8", "\\precnsim", true);
definesymbol(math, rel, "\u2ab9", "\\precnapprox", true);
definesymbol(math, rel, "\u2241", "\\nsim", true);
definesymbol(math, rel, "\u2224", "\\nmid", true);
definesymbol(math, rel, "\u2224", "\\nshortmid");
definesymbol(math, rel, "\u22ac", "\\nvdash", true);
definesymbol(math, rel, "\u22ad", "\\nvdash", true);
definesymbol(math, rel, "\u22ea", "\\ntriangleleft");
definesymbol(math, rel, "\u22ec", "\\ntrianglelefteq", true);
definesymbol(math, rel, "\u2284", "\\nsubset", true);
definesymbol(math, rel, "\u2285", "\\nsupset", true);
definesymbol(math, rel, "\u228a", "\\subsetneq", true);
definesymbol(math, rel, "\u228a\ufe00", "\\varsubsetneq");
definesymbol(math, rel, "\u2acb", "\\subsetneqq", true);
definesymbol(math, rel, "\u2acb\ufe00", "\\varsubsetneqq");
definesymbol(math, rel, "\u226f", "\\ngtr", true);
definesymbol(math, rel, "\u2a88", "\\gneq", true);
definesymbol(math, rel, "\u2269", "\\gneqq", true);
definesymbol(math, rel, "\u2269\ufe00", "\\gvertneqq");
definesymbol(math, rel, "\u22e7", "\\gnsim", true);
definesymbol(math, rel, "\u2a8a", "\\gnapprox", true);
definesymbol(math, rel, "\u2281", "\\nsucc", true);
// unicode-math maps \u22e1 to \nsucccurlyeq. we'll use the ams synonym.
definesymbol(math, rel, "\u22e1", "\\nsucceq", true);
definesymbol(math, rel, "\u22e9", "\\succnsim", true);
definesymbol(math, rel, "\u2aba", "\\succnapprox", true);
// unicode-math maps \u2246 to \simneqq. we'll use the ams synonym.
definesymbol(math, rel, "\u2246", "\\ncong", true);
definesymbol(math, rel, "\u2226", "\\nparallel", true);
definesymbol(math, rel, "\u2226", "\\nshortparallel");
definesymbol(math, rel, "\u22af", "\\nvdash", true);
definesymbol(math, rel, "\u22eb", "\\ntriangleright");
definesymbol(math, rel, "\u22ed", "\\ntrianglerighteq", true);
definesymbol(math, rel, "\u228b", "\\supsetneq", true);
definesymbol(math, rel, "\u228b", "\\varsupsetneq");
definesymbol(math, rel, "\u2acc", "\\supsetneqq", true);
definesymbol(math, rel, "\u2acc\ufe00", "\\varsupsetneqq");
definesymbol(math, rel, "\u22ae", "\\nvdash", true);
definesymbol(math, rel, "\u2ab5", "\\precneqq", true);
definesymbol(math, rel, "\u2ab6", "\\succneqq", true);
definesymbol(math, bin, "\u22b4", "\\unlhd");
definesymbol(math, bin, "\u22b5", "\\unrhd");

// ams negated arrows
definesymbol(math, rel, "\u219a", "\\nleftarrow", true);
definesymbol(math, rel, "\u219b", "\\nrightarrow", true);
definesymbol(math, rel, "\u21cd", "\\nleftarrow", true);
definesymbol(math, rel, "\u21cf", "\\nrightarrow", true);
definesymbol(math, rel, "\u21ae", "\\nleftrightarrow", true);
definesymbol(math, rel, "\u21ce", "\\nleftrightarrow", true);

// ams misc
definesymbol(math, rel, "\u25b3", "\\vartriangle");
definesymbol(math, textord, "\u210f", "\\hslash");
definesymbol(math, textord, "\u25bd", "\\triangledown");
definesymbol(math, textord, "\u25ca", "\\lozenge");
definesymbol(math, textord, "\u24c8", "\\circleds");
definesymbol(math, textord, "\u00ae", "\\circledr", true);
definesymbol(temml_text, textord, "\u00ae", "\\circledr");
definesymbol(temml_text, textord, "\u00ae", "\\textregistered");
definesymbol(math, textord, "\u2221", "\\measuredangle", true);
definesymbol(math, textord, "\u2204", "\\nexists");
definesymbol(math, textord, "\u2127", "\\mho");
definesymbol(math, textord, "\u2132", "\\finv", true);
definesymbol(math, textord, "\u2141", "\\game", true);
definesymbol(math, textord, "\u2035", "\\backprime");
definesymbol(math, textord, "\u2036", "\\backdprime");
definesymbol(math, textord, "\u2037", "\\backtrprime");
definesymbol(math, textord, "\u25b2", "\\blacktriangle");
definesymbol(math, textord, "\u25bc", "\\blacktriangledown");
definesymbol(math, textord, "\u25a0", "\\blacksquare");
definesymbol(math, textord, "\u29eb", "\\blacklozenge");
definesymbol(math, textord, "\u2605", "\\bigstar");
definesymbol(math, textord, "\u2222", "\\sphericalangle", true);
definesymbol(math, textord, "\u2201", "\\complement", true);
// unicode-math maps u+f0 to \matheth. we map to ams function \eth
definesymbol(math, textord, "\u00f0", "\\eth", true);
definesymbol(temml_text, textord, "\u00f0", "\u00f0");
definesymbol(math, textord, "\u2571", "\\diagup");
definesymbol(math, textord, "\u2572", "\\diagdown");
definesymbol(math, textord, "\u25a1", "\\square");
definesymbol(math, textord, "\u25a1", "\\box");
definesymbol(math, textord, "\u25ca", "\\diamond");
// unicode-math maps u+a5 to \mathyen. we map to ams function \yen
definesymbol(math, textord, "\u00a5", "\\yen", true);
definesymbol(temml_text, textord, "\u00a5", "\\yen", true);
definesymbol(math, textord, "\u2713", "\\checkmark", true);
definesymbol(temml_text, textord, "\u2713", "\\checkmark");
definesymbol(math, textord, "\u2717", "\\ballotx", true);
definesymbol(temml_text, textord, "\u2717", "\\ballotx");
definesymbol(temml_text, textord, "\u2022", "\\textbullet");

// ams hebrew
definesymbol(math, textord, "\u2136", "\\beth", true);
definesymbol(math, textord, "\u2138", "\\daleth", true);
definesymbol(math, textord, "\u2137", "\\gimel", true);

// ams greek
definesymbol(math, textord, "\u03dd", "\\digamma", true);
definesymbol(math, textord, "\u03f0", "\\varkappa");

// ams delimiters
definesymbol(math, temml_open, "\u231c", "\\ulcorner", true);
definesymbol(math, temml_close, "\u231d", "\\urcorner", true);
definesymbol(math, temml_open, "\u231e", "\\llcorner", true);
definesymbol(math, temml_close, "\u231f", "\\lrcorner", true);

// ams binary relations
definesymbol(math, rel, "\u2266", "\\leqq", true);
definesymbol(math, rel, "\u2a7d", "\\leqslant", true);
definesymbol(math, rel, "\u2a95", "\\eqslantless", true);
definesymbol(math, rel, "\u2272", "\\lesssim", true);
definesymbol(math, rel, "\u2a85", "\\lessapprox", true);
definesymbol(math, rel, "\u224a", "\\approxeq", true);
definesymbol(math, bin, "\u22d6", "\\lessdot");
definesymbol(math, rel, "\u22d8", "\\lll", true);
definesymbol(math, rel, "\u2276", "\\lessgtr", true);
definesymbol(math, rel, "\u22da", "\\lesseqgtr", true);
definesymbol(math, rel, "\u2a8b", "\\lesseqqgtr", true);
definesymbol(math, rel, "\u2251", "\\doteqdot");
definesymbol(math, rel, "\u2253", "\\risingdotseq", true);
definesymbol(math, rel, "\u2252", "\\fallingdotseq", true);
definesymbol(math, rel, "\u223d", "\\backsim", true);
definesymbol(math, rel, "\u22cd", "\\backsimeq", true);
definesymbol(math, rel, "\u2ac5", "\\subseteqq", true);
definesymbol(math, rel, "\u22d0", "\\subset", true);
definesymbol(math, rel, "\u228f", "\\sqsubset", true);
definesymbol(math, rel, "\u227c", "\\preccurlyeq", true);
definesymbol(math, rel, "\u22de", "\\curlyeqprec", true);
definesymbol(math, rel, "\u227e", "\\precsim", true);
definesymbol(math, rel, "\u2ab7", "\\precapprox", true);
definesymbol(math, rel, "\u22b2", "\\vartriangleleft");
definesymbol(math, rel, "\u22b4", "\\trianglelefteq");
definesymbol(math, rel, "\u22a8", "\\vdash", true);
definesymbol(math, rel, "\u22ab", "\\vdash", true);
definesymbol(math, rel, "\u22aa", "\\vvdash", true);
definesymbol(math, rel, "\u2323", "\\smallsmile");
definesymbol(math, rel, "\u2322", "\\smallfrown");
definesymbol(math, rel, "\u224f", "\\bumpeq", true);
definesymbol(math, rel, "\u224e", "\\bumpeq", true);
definesymbol(math, rel, "\u2267", "\\geqq", true);
definesymbol(math, rel, "\u2a7e", "\\geqslant", true);
definesymbol(math, rel, "\u2a96", "\\eqslantgtr", true);
definesymbol(math, rel, "\u2273", "\\gtrsim", true);
definesymbol(math, rel, "\u2a86", "\\gtrapprox", true);
definesymbol(math, bin, "\u22d7", "\\gtrdot");
definesymbol(math, rel, "\u22d9", "\\ggg", true);
definesymbol(math, rel, "\u2277", "\\gtrless", true);
definesymbol(math, rel, "\u22db", "\\gtreqless", true);
definesymbol(math, rel, "\u2a8c", "\\gtreqqless", true);
definesymbol(math, rel, "\u2256", "\\eqcirc", true);
definesymbol(math, rel, "\u2257", "\\circeq", true);
definesymbol(math, rel, "\u225c", "\\triangleq", true);
definesymbol(math, rel, "\u223c", "\\thicksim");
definesymbol(math, rel, "\u2248", "\\thickapprox");
definesymbol(math, rel, "\u2ac6", "\\supseteqq", true);
definesymbol(math, rel, "\u22d1", "\\supset", true);
definesymbol(math, rel, "\u2290", "\\sqsupset", true);
definesymbol(math, rel, "\u227d", "\\succcurlyeq", true);
definesymbol(math, rel, "\u22df", "\\curlyeqsucc", true);
definesymbol(math, rel, "\u227f", "\\succsim", true);
definesymbol(math, rel, "\u2ab8", "\\succapprox", true);
definesymbol(math, rel, "\u22b3", "\\vartriangleright");
definesymbol(math, rel, "\u22b5", "\\trianglerighteq");
definesymbol(math, rel, "\u22a9", "\\vdash", true);
definesymbol(math, rel, "\u2223", "\\shortmid");
definesymbol(math, rel, "\u2225", "\\shortparallel");
definesymbol(math, rel, "\u226c", "\\between", true);
definesymbol(math, rel, "\u22d4", "\\pitchfork", true);
definesymbol(math, rel, "\u221d", "\\varpropto");
definesymbol(math, rel, "\u25c0", "\\blacktriangleleft");
// unicode-math says that \therefore is a mathord atom.
// we kept the amssymb atom type, which is rel.
definesymbol(math, rel, "\u2234", "\\therefore", true);
definesymbol(math, rel, "\u220d", "\\backepsilon");
definesymbol(math, rel, "\u25b6", "\\blacktriangleright");
// unicode-math says that \because is a mathord atom.
// we kept the amssymb atom type, which is rel.
definesymbol(math, rel, "\u2235", "\\because", true);
definesymbol(math, rel, "\u22d8", "\\llless");
definesymbol(math, rel, "\u22d9", "\\gggtr");
definesymbol(math, bin, "\u22b2", "\\lhd");
definesymbol(math, bin, "\u22b3", "\\rhd");
definesymbol(math, rel, "\u2242", "\\eqsim", true);
definesymbol(math, rel, "\u2251", "\\doteq", true);
definesymbol(math, rel, "\u297d", "\\strictif", true);
definesymbol(math, rel, "\u297c", "\\strictfi", true);

// ams binary operators
definesymbol(math, bin, "\u2214", "\\dotplus", true);
definesymbol(math, bin, "\u2216", "\\smallsetminus");
definesymbol(math, bin, "\u22d2", "\\cap", true);
definesymbol(math, bin, "\u22d3", "\\cup", true);
definesymbol(math, bin, "\u2a5e", "\\doublebarwedge", true);
definesymbol(math, bin, "\u229f", "\\boxminus", true);
definesymbol(math, bin, "\u229e", "\\boxplus", true);
definesymbol(math, bin, "\u29c4", "\\boxslash", true);
definesymbol(math, bin, "\u22c7", "\\divideontimes", true);
definesymbol(math, bin, "\u22c9", "\\ltimes", true);
definesymbol(math, bin, "\u22ca", "\\rtimes", true);
definesymbol(math, bin, "\u22cb", "\\leftthreetimes", true);
definesymbol(math, bin, "\u22cc", "\\rightthreetimes", true);
definesymbol(math, bin, "\u22cf", "\\curlywedge", true);
definesymbol(math, bin, "\u22ce", "\\curlyvee", true);
definesymbol(math, bin, "\u229d", "\\circleddash", true);
definesymbol(math, bin, "\u229b", "\\circledast", true);
definesymbol(math, bin, "\u22ba", "\\intercal", true);
definesymbol(math, bin, "\u22d2", "\\doublecap");
definesymbol(math, bin, "\u22d3", "\\doublecup");
definesymbol(math, bin, "\u22a0", "\\boxtimes", true);
definesymbol(math, bin, "\u22c8", "\\bowtie", true);
definesymbol(math, bin, "\u22c8", "\\join");
definesymbol(math, bin, "\u27d5", "\\leftouterjoin", true);
definesymbol(math, bin, "\u27d6", "\\rightouterjoin", true);
definesymbol(math, bin, "\u27d7", "\\fullouterjoin", true);

// stix binary operators
definesymbol(math, bin, "\u2238", "\\dotminus", true);
definesymbol(math, bin, "\u27d1", "\\wedgedot", true);
definesymbol(math, bin, "\u27c7", "\\veedot", true);
definesymbol(math, bin, "\u2a62", "\\doublebarvee", true);
definesymbol(math, bin, "\u2a63", "\\veedoublebar", true);
definesymbol(math, bin, "\u2a5f", "\\wedgebar", true);
definesymbol(math, bin, "\u2a60", "\\wedgedoublebar", true);
definesymbol(math, bin, "\u2a54", "\\vee", true);
definesymbol(math, bin, "\u2a53", "\\wedge", true);
definesymbol(math, bin, "\u2a43", "\\barcap", true);
definesymbol(math, bin, "\u2a42", "\\barcup", true);
definesymbol(math, bin, "\u2a48", "\\capbarcup", true);
definesymbol(math, bin, "\u2a40", "\\capdot", true);
definesymbol(math, bin, "\u2a47", "\\capovercup", true);
definesymbol(math, bin, "\u2a46", "\\cupovercap", true);
definesymbol(math, bin, "\u2a4d", "\\closedvarcap", true);
definesymbol(math, bin, "\u2a4c", "\\closedvarcup", true);
definesymbol(math, bin, "\u2a2a", "\\minusdot", true);
definesymbol(math, bin, "\u2a2b", "\\minusfdots", true);
definesymbol(math, bin, "\u2a2c", "\\minusrdots", true);
definesymbol(math, bin, "\u22bb", "\\xor", true);
definesymbol(math, bin, "\u22bc", "\\nand", true);
definesymbol(math, bin, "\u22bd", "\\nor", true);
definesymbol(math, bin, "\u22bd", "\\barvee");
definesymbol(math, bin, "\u2af4", "\\interleave", true);
definesymbol(math, bin, "\u29e2", "\\shuffle", true);
definesymbol(math, bin, "\u2af6", "\\threedotcolon", true);
definesymbol(math, bin, "\u2982", "\\typecolon", true);
definesymbol(math, bin, "\u223e", "\\invlazys", true);
definesymbol(math, bin, "\u2a4b", "\\twocaps", true);
definesymbol(math, bin, "\u2a4a", "\\twocups", true);
definesymbol(math, bin, "\u2a4e", "\\sqcap", true);
definesymbol(math, bin, "\u2a4f", "\\sqcup", true);
definesymbol(math, bin, "\u2a56", "\\veeonvee", true);
definesymbol(math, bin, "\u2a55", "\\wedgeonwedge", true);
definesymbol(math, bin, "\u29d7", "\\blackhourglass", true);
definesymbol(math, bin, "\u29c6", "\\boxast", true);
definesymbol(math, bin, "\u29c8", "\\boxbox", true);
definesymbol(math, bin, "\u29c7", "\\boxcircle", true);
definesymbol(math, bin, "\u229c", "\\circledequal", true);
definesymbol(math, bin, "\u29b7", "\\circledparallel", true);
definesymbol(math, bin, "\u29b6", "\\circledvert", true);
definesymbol(math, bin, "\u29b5", "\\circlehbar", true);
definesymbol(math, bin, "\u27e1", "\\concavediamond", true);
definesymbol(math, bin, "\u27e2", "\\concavediamondtickleft", true);
definesymbol(math, bin, "\u27e3", "\\concavediamondtickright", true);
definesymbol(math, bin, "\u22c4", "\\diamond", true);
definesymbol(math, bin, "\u29d6", "\\hourglass", true);
definesymbol(math, bin, "\u27e0", "\\lozengeminus", true);
definesymbol(math, bin, "\u233d", "\\obar", true);
definesymbol(math, bin, "\u29b8", "\\obslash", true);
definesymbol(math, bin, "\u2a38", "\\odiv", true);
definesymbol(math, bin, "\u29c1", "\\ogreaterthan", true);
definesymbol(math, bin, "\u29c0", "\\olessthan", true);
definesymbol(math, bin, "\u29b9", "\\operp", true);
definesymbol(math, bin, "\u2a37", "\\otimes", true);
definesymbol(math, bin, "\u2a36", "\\otimeshat", true);
definesymbol(math, bin, "\u22c6", "\\star", true);
definesymbol(math, bin, "\u25b3", "\\triangle", true);
definesymbol(math, bin, "\u2a3a", "\\triangleminus", true);
definesymbol(math, bin, "\u2a39", "\\triangleplus", true);
definesymbol(math, bin, "\u2a3b", "\\triangletimes", true);
definesymbol(math, bin, "\u27e4", "\\whitesquaretickleft", true);
definesymbol(math, bin, "\u27e5", "\\whitesquaretickright", true);
definesymbol(math, bin, "\u2a33", "\\smashtimes", true);

// ams arrows
// note: unicode-math maps \u21e2 to their own function \rightdasharrow.
// we'll map it to ams function \dashrightarrow. it produces the same atom.
definesymbol(math, rel, "\u21e2", "\\dashrightarrow", true);
// unicode-math maps \u21e0 to \leftdasharrow. we'll use the ams synonym.
definesymbol(math, rel, "\u21e0", "\\dashleftarrow", true);
definesymbol(math, rel, "\u21c7", "\\leftleftarrows", true);
definesymbol(math, rel, "\u21c6", "\\leftrightarrows", true);
definesymbol(math, rel, "\u21da", "\\lleftarrow", true);
definesymbol(math, rel, "\u219e", "\\twoheadleftarrow", true);
definesymbol(math, rel, "\u21a2", "\\leftarrowtail", true);
definesymbol(math, rel, "\u21ab", "\\looparrowleft", true);
definesymbol(math, rel, "\u21cb", "\\leftrightharpoons", true);
definesymbol(math, rel, "\u21b6", "\\curvearrowleft", true);
// unicode-math maps \u21ba to \acwopencirclearrow. we'll use the ams synonym.
definesymbol(math, rel, "\u21ba", "\\circlearrowleft", true);
definesymbol(math, rel, "\u21b0", "\\lsh", true);
definesymbol(math, rel, "\u21c8", "\\upuparrows", true);
definesymbol(math, rel, "\u21bf", "\\upharpoonleft", true);
definesymbol(math, rel, "\u21c3", "\\downharpoonleft", true);
definesymbol(math, rel, "\u22b6", "\\origof", true);
definesymbol(math, rel, "\u22b7", "\\imageof", true);
definesymbol(math, rel, "\u22b8", "\\multimap", true);
definesymbol(math, rel, "\u21ad", "\\leftrightsquigarrow", true);
definesymbol(math, rel, "\u21c9", "\\rightrightarrows", true);
definesymbol(math, rel, "\u21c4", "\\rightleftarrows", true);
definesymbol(math, rel, "\u21a0", "\\twoheadrightarrow", true);
definesymbol(math, rel, "\u21a3", "\\rightarrowtail", true);
definesymbol(math, rel, "\u21ac", "\\looparrowright", true);
definesymbol(math, rel, "\u21b7", "\\curvearrowright", true);
// unicode-math maps \u21bb to \cwopencirclearrow. we'll use the ams synonym.
definesymbol(math, rel, "\u21bb", "\\circlearrowright", true);
definesymbol(math, rel, "\u21b1", "\\rsh", true);
definesymbol(math, rel, "\u21ca", "\\downdownarrows", true);
definesymbol(math, rel, "\u21be", "\\upharpoonright", true);
definesymbol(math, rel, "\u21c2", "\\downharpoonright", true);
definesymbol(math, rel, "\u21dd", "\\rightsquigarrow", true);
definesymbol(math, rel, "\u21dd", "\\leadsto");
definesymbol(math, rel, "\u21db", "\\rrightarrow", true);
definesymbol(math, rel, "\u21be", "\\restriction");

definesymbol(math, textord, "\u2018", "`");
definesymbol(math, textord, "$", "\\$");
definesymbol(temml_text, textord, "$", "\\$");
definesymbol(temml_text, textord, "$", "\\textdollar");
definesymbol(math, textord, "‚¢", "\\cent");
definesymbol(temml_text, textord, "‚¢", "\\cent");
definesymbol(math, textord, "%", "\\%");
definesymbol(temml_text, textord, "%", "\\%");
definesymbol(math, textord, "_", "\\_");
definesymbol(temml_text, textord, "_", "\\_");
definesymbol(temml_text, textord, "_", "\\textunderscore");
definesymbol(temml_text, textord, "\u2423", "\\textvisiblespace", true);
definesymbol(math, textord, "\u2220", "\\angle", true);
definesymbol(math, textord, "\u221e", "\\infty", true);
definesymbol(math, textord, "\u2032", "\\prime");
definesymbol(math, textord, "\u2033", "\\dprime");
definesymbol(math, textord, "\u2034", "\\trprime");
definesymbol(math, textord, "\u2057", "\\qprime");
definesymbol(math, textord, "\u25b3", "\\triangle");
definesymbol(temml_text, textord, "\u0391", "\\alpha", true);
definesymbol(temml_text, textord, "\u0392", "\\beta", true);
definesymbol(temml_text, textord, "\u0393", "\\gamma", true);
definesymbol(temml_text, textord, "\u0394", "\\delta", true);
definesymbol(temml_text, textord, "\u0395", "\\epsilon", true);
definesymbol(temml_text, textord, "\u0396", "\\zeta", true);
definesymbol(temml_text, textord, "\u0397", "\\eta", true);
definesymbol(temml_text, textord, "\u0398", "\\theta", true);
definesymbol(temml_text, textord, "\u0399", "\\iota", true);
definesymbol(temml_text, textord, "\u039a", "\\kappa", true);
definesymbol(temml_text, textord, "\u039b", "\\lambda", true);
definesymbol(temml_text, textord, "\u039c", "\\mu", true);
definesymbol(temml_text, textord, "\u039d", "\\nu", true);
definesymbol(temml_text, textord, "\u039e", "\\xi", true);
definesymbol(temml_text, textord, "\u039f", "\\omicron", true);
definesymbol(temml_text, textord, "\u03a0", "\\pi", true);
definesymbol(temml_text, textord, "\u03a1", "\\rho", true);
definesymbol(temml_text, textord, "\u03a3", "\\sigma", true);
definesymbol(temml_text, textord, "\u03a4", "\\tau", true);
definesymbol(temml_text, textord, "\u03a5", "\\upsilon", true);
definesymbol(temml_text, textord, "\u03a6", "\\phi", true);
definesymbol(temml_text, textord, "\u03a7", "\\chi", true);
definesymbol(temml_text, textord, "\u03a8", "\\psi", true);
definesymbol(temml_text, textord, "\u03a9", "\\omega", true);
definesymbol(math, mathord, "\u0391", "\\alpha", true);
definesymbol(math, mathord, "\u0392", "\\beta", true);
definesymbol(math, mathord, "\u0393", "\\gamma", true);
definesymbol(math, mathord, "\u0394", "\\delta", true);
definesymbol(math, mathord, "\u0395", "\\epsilon", true);
definesymbol(math, mathord, "\u0396", "\\zeta", true);
definesymbol(math, mathord, "\u0397", "\\eta", true);
definesymbol(math, mathord, "\u0398", "\\theta", true);
definesymbol(math, mathord, "\u0399", "\\iota", true);
definesymbol(math, mathord, "\u039a", "\\kappa", true);
definesymbol(math, mathord, "\u039b", "\\lambda", true);
definesymbol(math, mathord, "\u039c", "\\mu", true);
definesymbol(math, mathord, "\u039d", "\\nu", true);
definesymbol(math, mathord, "\u039e", "\\xi", true);
definesymbol(math, mathord, "\u039f", "\\omicron", true);
definesymbol(math, mathord, "\u03a0", "\\pi", true);
definesymbol(math, mathord, "\u03a1", "\\rho", true);
definesymbol(math, mathord, "\u03a3", "\\sigma", true);
definesymbol(math, mathord, "\u03a4", "\\tau", true);
definesymbol(math, mathord, "\u03a5", "\\upsilon", true);
definesymbol(math, mathord, "\u03a6", "\\phi", true);
definesymbol(math, mathord, "\u03a7", "\\chi", true);
definesymbol(math, mathord, "\u03a8", "\\psi", true);
definesymbol(math, mathord, "\u03a9", "\\omega", true);
definesymbol(math, temml_open, "\u00ac", "\\neg", true);
definesymbol(math, temml_open, "\u00ac", "\\lnot");
definesymbol(math, textord, "\u22a4", "\\top");
definesymbol(math, textord, "\u22a5", "\\bot");
definesymbol(math, textord, "\u2205", "\\emptyset");
definesymbol(math, textord, "\u2300", "\\varnothing");
definesymbol(math, mathord, "\u03b1", "\\alpha", true);
definesymbol(math, mathord, "\u03b2", "\\beta", true);
definesymbol(math, mathord, "\u03b3", "\\gamma", true);
definesymbol(math, mathord, "\u03b4", "\\delta", true);
definesymbol(math, mathord, "\u03f5", "\\epsilon", true);
definesymbol(math, mathord, "\u03b6", "\\zeta", true);
definesymbol(math, mathord, "\u03b7", "\\eta", true);
definesymbol(math, mathord, "\u03b8", "\\theta", true);
definesymbol(math, mathord, "\u03b9", "\\iota", true);
definesymbol(math, mathord, "\u03ba", "\\kappa", true);
definesymbol(math, mathord, "\u03bb", "\\lambda", true);
definesymbol(math, mathord, "\u03bc", "\\mu", true);
definesymbol(math, mathord, "\u03bd", "\\nu", true);
definesymbol(math, mathord, "\u03be", "\\xi", true);
definesymbol(math, mathord, "\u03bf", "\\omicron", true);
definesymbol(math, mathord, "\u03c0", "\\pi", true);
definesymbol(math, mathord, "\u03c1", "\\rho", true);
definesymbol(math, mathord, "\u03c3", "\\sigma", true);
definesymbol(math, mathord, "\u03c4", "\\tau", true);
definesymbol(math, mathord, "\u03c5", "\\upsilon", true);
definesymbol(math, mathord, "\u03d5", "\\phi", true);
definesymbol(math, mathord, "\u03c7", "\\chi", true);
definesymbol(math, mathord, "\u03c8", "\\psi", true);
definesymbol(math, mathord, "\u03c9", "\\omega", true);
definesymbol(math, mathord, "\u03b5", "\\varepsilon", true);
definesymbol(math, mathord, "\u03d1", "\\vartheta", true);
definesymbol(math, mathord, "\u03d6", "\\varpi", true);
definesymbol(math, mathord, "\u03f1", "\\varrho", true);
definesymbol(math, mathord, "\u03c2", "\\varsigma", true);
definesymbol(math, mathord, "\u03c6", "\\varphi", true);
definesymbol(math, mathord, "\u03d8", "\\coppa", true);
definesymbol(math, mathord, "\u03d9", "\\coppa", true);
definesymbol(math, mathord, "\u03d9", "\\varcoppa", true);
definesymbol(math, mathord, "\u03de", "\\koppa", true);
definesymbol(math, mathord, "\u03df", "\\koppa", true);
definesymbol(math, mathord, "\u03e0", "\\sampi", true);
definesymbol(math, mathord, "\u03e1", "\\sampi", true);
definesymbol(math, mathord, "\u03da", "\\stigma", true);
definesymbol(math, mathord, "\u03db", "\\stigma", true);
definesymbol(math, mathord, "\u2aeb", "\\bot");
definesymbol(math, bin, "\u2217", "\u2217", true);
definesymbol(math, bin, "+", "+");
definesymbol(math, bin, "\u2217", "*");
definesymbol(math, bin, "\u2044", "/", true);
definesymbol(math, bin, "\u2044", "\u2044");
definesymbol(math, bin, "\u2212", "-", true);
definesymbol(math, bin, "\u22c5", "\\cdot", true);
definesymbol(math, bin, "\u2218", "\\circ", true);
definesymbol(math, bin, "\u00f7", "\\div", true);
definesymbol(math, bin, "\u00b1", "\\pm", true);
definesymbol(math, bin, "\u00d7", "\\times", true);
definesymbol(math, bin, "\u2229", "\\cap", true);
definesymbol(math, bin, "\u222a", "\\cup", true);
definesymbol(math, bin, "\u2216", "\\setminus", true);
definesymbol(math, bin, "\u2227", "\\land");
definesymbol(math, bin, "\u2228", "\\lor");
definesymbol(math, bin, "\u2227", "\\wedge", true);
definesymbol(math, bin, "\u2228", "\\vee", true);
definesymbol(math, temml_open, "\u27e6", "\\llbracket", true); // stmaryrd/semantic packages
definesymbol(math, temml_close, "\u27e7", "\\rrbracket", true);
definesymbol(math, temml_open, "\u27e8", "\\langle", true);
definesymbol(math, temml_open, "\u27ea", "\\langle", true);
definesymbol(math, temml_open, "\u2989", "\\llangle", true);
definesymbol(math, temml_open, "|", "\\lvert");
definesymbol(math, temml_open, "\u2016", "\\lvert", true);
definesymbol(math, textord, "!", "\\oc"); // cmll package
definesymbol(math, textord, "?", "\\wn");
definesymbol(math, textord, "\u2193", "\\shpos");
definesymbol(math, textord, "\u2195", "\\shift");
definesymbol(math, textord, "\u2191", "\\shneg");
definesymbol(math, temml_close, "?", "?");
definesymbol(math, temml_close, "!", "!");
definesymbol(math, temml_close, "‚Äº", "‚Äº");
definesymbol(math, temml_close, "\u27e9", "\\rangle", true);
definesymbol(math, temml_close, "\u27eb", "\\rangle", true);
definesymbol(math, temml_close, "\u298a", "\\rrangle", true);
definesymbol(math, temml_close, "|", "\\rvert");
definesymbol(math, temml_close, "\u2016", "\\rvert");
definesymbol(math, temml_open, "\u2983", "\\lbrace", true); // stmaryrd/semantic packages
definesymbol(math, temml_close, "\u2984", "\\rbrace", true);
definesymbol(math, rel, "=", "\\equal", true);
definesymbol(math, rel, ":", ":");
definesymbol(math, rel, "\u2248", "\\approx", true);
definesymbol(math, rel, "\u2245", "\\cong", true);
definesymbol(math, rel, "\u2265", "\\ge");
definesymbol(math, rel, "\u2265", "\\geq", true);
definesymbol(math, rel, "\u2190", "\\gets");
definesymbol(math, rel, ">", "\\gt", true);
definesymbol(math, rel, "\u2208", "\\in", true);
definesymbol(math, rel, "\u2209", "\\notin", true);
definesymbol(math, rel, "\ue020", "\\@not");
definesymbol(math, rel, "\u2282", "\\subset", true);
definesymbol(math, rel, "\u2283", "\\supset", true);
definesymbol(math, rel, "\u2286", "\\subseteq", true);
definesymbol(math, rel, "\u2287", "\\supseteq", true);
definesymbol(math, rel, "\u2288", "\\nsubseteq", true);
definesymbol(math, rel, "\u2288", "\\nsubseteqq");
definesymbol(math, rel, "\u2289", "\\nsupseteq", true);
definesymbol(math, rel, "\u2289", "\\nsupseteqq");
definesymbol(math, rel, "\u22a8", "\\models");
definesymbol(math, rel, "\u2190", "\\leftarrow", true);
definesymbol(math, rel, "\u2264", "\\le");
definesymbol(math, rel, "\u2264", "\\leq", true);
definesymbol(math, rel, "<", "\\lt", true);
definesymbol(math, rel, "\u2192", "\\rightarrow", true);
definesymbol(math, rel, "\u2192", "\\to");
definesymbol(math, rel, "\u2271", "\\ngeq", true);
definesymbol(math, rel, "\u2271", "\\ngeqq");
definesymbol(math, rel, "\u2271", "\\ngeqslant");
definesymbol(math, rel, "\u2270", "\\nleq", true);
definesymbol(math, rel, "\u2270", "\\nleqq");
definesymbol(math, rel, "\u2270", "\\nleqslant");
definesymbol(math, rel, "\u2aeb", "\\perp", true); //cmll package
definesymbol(math, spacing, "\u00a0", "\\ ");
definesymbol(math, spacing, "\u00a0", "\\space");
// ref: latex source 2e: \declarerobustcommand{\nobreakspace}{%
definesymbol(math, spacing, "\u00a0", "\\nobreakspace");
definesymbol(temml_text, spacing, "\u00a0", "\\ ");
definesymbol(temml_text, spacing, "\u00a0", " ");
definesymbol(temml_text, spacing, "\u00a0", "\\space");
definesymbol(temml_text, spacing, "\u00a0", "\\nobreakspace");
definesymbol(math, spacing, null, "\\nobreak");
definesymbol(math, spacing, null, "\\allowbreak");
definesymbol(math, punct, ",", ",");
definesymbol(temml_text, punct, ":", ":");
definesymbol(math, punct, ";", ";");
definesymbol(math, bin, "\u22bc", "\\barwedge");
definesymbol(math, bin, "\u22bb", "\\veebar");
definesymbol(math, bin, "\u2299", "\\odot", true);
// firefox turns ‚öï into an emoji. so append \ufe0e. define unicode character in macros, not here.
definesymbol(math, bin, "\u2295\ufe0e", "\\oplus");
definesymbol(math, bin, "\u2297", "\\otimes", true);
definesymbol(math, textord, "\u2202", "\\partial", true);
definesymbol(math, bin, "\u2298", "\\oslash", true);
definesymbol(math, bin, "\u229a", "\\circledcirc", true);
definesymbol(math, bin, "\u22a1", "\\boxdot", true);
definesymbol(math, bin, "\u25b3", "\\bigtriangleup");
definesymbol(math, bin, "\u25bd", "\\bigtriangledown");
definesymbol(math, bin, "\u2020", "\\dagger");
definesymbol(math, bin, "\u22c4", "\\diamond");
definesymbol(math, bin, "\u25c3", "\\triangleleft");
definesymbol(math, bin, "\u25b9", "\\triangleright");
definesymbol(math, temml_open, "{", "\\{");
definesymbol(temml_text, textord, "{", "\\{");
definesymbol(temml_text, textord, "{", "\\textbraceleft");
definesymbol(math, temml_close, "}", "\\}");
definesymbol(temml_text, textord, "}", "\\}");
definesymbol(temml_text, textord, "}", "\\textbraceright");
definesymbol(math, temml_open, "{", "\\lbrace");
definesymbol(math, temml_close, "}", "\\rbrace");
definesymbol(math, temml_open, "[", "\\lbrack", true);
definesymbol(temml_text, textord, "[", "\\lbrack", true);
definesymbol(math, temml_close, "]", "\\rbrack", true);
definesymbol(temml_text, textord, "]", "\\rbrack", true);
definesymbol(math, temml_open, "(", "\\lparen", true);
definesymbol(math, temml_close, ")", "\\rparen", true);
definesymbol(math, temml_open, "‚¶á", "\\llparenthesis", true);
definesymbol(math, temml_close, "‚¶à", "\\rrparenthesis", true);
definesymbol(temml_text, textord, "<", "\\textless", true); // in t1 fontenc
definesymbol(temml_text, textord, ">", "\\textgreater", true); // in t1 fontenc
definesymbol(math, temml_open, "\u230a", "\\lfloor", true);
definesymbol(math, temml_close, "\u230b", "\\rfloor", true);
definesymbol(math, temml_open, "\u2308", "\\lceil", true);
definesymbol(math, temml_close, "\u2309", "\\rceil", true);
definesymbol(math, textord, "\\", "\\backslash");
definesymbol(math, textord, "|", "|");
definesymbol(math, textord, "|", "\\vert");
definesymbol(temml_text, textord, "|", "\\textbar", true); // in t1 fontenc
definesymbol(math, textord, "\u2016", "\\|");
definesymbol(math, textord, "\u2016", "\\vert");
definesymbol(temml_text, textord, "\u2016", "\\textbardbl");
definesymbol(temml_text, textord, "~", "\\textasciitilde");
definesymbol(temml_text, textord, "\\", "\\textbackslash");
definesymbol(temml_text, textord, "^", "\\textasciicircum");
definesymbol(math, rel, "\u2191", "\\uparrow", true);
definesymbol(math, rel, "\u21d1", "\\uparrow", true);
definesymbol(math, rel, "\u2193", "\\downarrow", true);
definesymbol(math, rel, "\u21d3", "\\downarrow", true);
definesymbol(math, rel, "\u2195", "\\updownarrow", true);
definesymbol(math, rel, "\u21d5", "\\updownarrow", true);
definesymbol(math, op, "\u2210", "\\coprod");
definesymbol(math, op, "\u22c1", "\\bigvee");
definesymbol(math, op, "\u22c0", "\\bigwedge");
definesymbol(math, op, "\u2a04", "\\biguplus");
definesymbol(math, op, "\u2a04", "\\bigcupplus");
definesymbol(math, op, "\u2a03", "\\bigcupdot");
definesymbol(math, op, "\u2a07", "\\bigdoublevee");
definesymbol(math, op, "\u2a08", "\\bigdoublewedge");
definesymbol(math, op, "\u22c2", "\\bigcap");
definesymbol(math, op, "\u22c3", "\\bigcup");
definesymbol(math, op, "\u222b", "\\int");
definesymbol(math, op, "\u222b", "\\intop");
definesymbol(math, op, "\u222c", "\\iint");
definesymbol(math, op, "\u222d", "\\iiint");
definesymbol(math, op, "\u220f", "\\prod");
definesymbol(math, op, "\u2211", "\\sum");
definesymbol(math, op, "\u2a02", "\\bigotimes");
definesymbol(math, op, "\u2a01", "\\bigoplus");
definesymbol(math, op, "\u2a00", "\\bigodot");
definesymbol(math, op, "\u2a09", "\\bigtimes");
definesymbol(math, op, "\u222e", "\\oint");
definesymbol(math, op, "\u222f", "\\oiint");
definesymbol(math, op, "\u2230", "\\oiiint");
definesymbol(math, op, "\u2231", "\\intclockwise");
definesymbol(math, op, "\u2232", "\\varointclockwise");
definesymbol(math, op, "\u2a0c", "\\iiiint");
definesymbol(math, op, "\u2a0d", "\\intbar");
definesymbol(math, op, "\u2a0e", "\\intbar");
definesymbol(math, op, "\u2a0f", "\\fint");
definesymbol(math, op, "\u2a12", "\\rppolint");
definesymbol(math, op, "\u2a13", "\\scpolint");
definesymbol(math, op, "\u2a15", "\\pointint");
definesymbol(math, op, "\u2a16", "\\sqint");
definesymbol(math, op, "\u2a17", "\\intlarhk");
definesymbol(math, op, "\u2a18", "\\intx");
definesymbol(math, op, "\u2a19", "\\intcap");
definesymbol(math, op, "\u2a1a", "\\intcup");
definesymbol(math, op, "\u2a05", "\\bigsqcap");
definesymbol(math, op, "\u2a06", "\\bigsqcup");
definesymbol(math, op, "\u222b", "\\smallint");
definesymbol(temml_text, inner, "\u2026", "\\textellipsis");
definesymbol(math, inner, "\u2026", "\\mathellipsis");
definesymbol(temml_text, inner, "\u2026", "\\ldots", true);
definesymbol(math, inner, "\u2026", "\\ldots", true);
definesymbol(math, inner, "\u22f0", "\\iddots", true);
definesymbol(math, inner, "\u22ef", "\\@cdots", true);
definesymbol(math, inner, "\u22f1", "\\ddots", true);
definesymbol(math, textord, "\u22ee", "\\varvdots"); // \vdots is a macro
definesymbol(temml_text, textord, "\u22ee", "\\varvdots");
definesymbol(math, accent, "\u02ca", "\\acute");
definesymbol(math, accent, "\u0060", "\\grave");
definesymbol(math, accent, "\u00a8", "\\ddot");
definesymbol(math, accent, "\u2026", "\\dddot");
definesymbol(math, accent, "\u2026\u002e", "\\ddddot");
definesymbol(math, accent, "\u007e", "\\tilde");
definesymbol(math, accent, "\u203e", "\\bar");
definesymbol(math, accent, "\u02d8", "\\breve");
definesymbol(math, accent, "\u02c7", "\\check");
definesymbol(math, accent, "\u005e", "\\hat");
definesymbol(math, accent, "\u2192", "\\vec");
definesymbol(math, accent, "\u02d9", "\\dot");
definesymbol(math, accent, "\u02da", "\\mathring");
definesymbol(math, mathord, "\u0131", "\\imath", true);
definesymbol(math, mathord, "\u0237", "\\jmath", true);
definesymbol(math, textord, "\u0131", "\u0131");
definesymbol(math, textord, "\u0237", "\u0237");
definesymbol(temml_text, textord, "\u0131", "\\i", true);
definesymbol(temml_text, textord, "\u0237", "\\j", true);
definesymbol(temml_text, textord, "\u00df", "\\ss", true);
definesymbol(temml_text, textord, "\u00e6", "\\ae", true);
definesymbol(temml_text, textord, "\u0153", "\\oe", true);
definesymbol(temml_text, textord, "\u00f8", "\\o", true);
definesymbol(math, mathord, "\u00f8", "\\o", true);
definesymbol(temml_text, textord, "\u00c6", "\\ae", true);
definesymbol(temml_text, textord, "\u0152", "\\oe", true);
definesymbol(temml_text, textord, "\u00d8", "\\o", true);
definesymbol(math, mathord, "\u00d8", "\\o", true);
definesymbol(temml_text, accent, "\u02ca", "\\'"); // acute
definesymbol(temml_text, accent, "\u02cb", "\\`"); // grave
definesymbol(temml_text, accent, "\u02c6", "\\^"); // circumflex
definesymbol(temml_text, accent, "\u02dc", "\\~"); // tilde
definesymbol(temml_text, accent, "\u02c9", "\\="); // macron
definesymbol(temml_text, accent, "\u02d8", "\\u"); // breve
definesymbol(temml_text, accent, "\u02d9", "\\."); // dot above
definesymbol(temml_text, accent, "\u00b8", "\\c"); // cedilla
definesymbol(temml_text, accent, "\u02da", "\\r"); // ring above
definesymbol(temml_text, accent, "\u02c7", "\\v"); // caron
definesymbol(temml_text, accent, "\u00a8", '\\"'); // diaresis
definesymbol(temml_text, accent, "\u02dd", "\\h"); // double acute
definesymbol(math, accent, "\u02ca", "\\'"); // acute
definesymbol(math, accent, "\u02cb", "\\`"); // grave
definesymbol(math, accent, "\u02c6", "\\^"); // circumflex
definesymbol(math, accent, "\u02dc", "\\~"); // tilde
definesymbol(math, accent, "\u02c9", "\\="); // macron
definesymbol(math, accent, "\u02d8", "\\u"); // breve
definesymbol(math, accent, "\u02d9", "\\."); // dot above
definesymbol(math, accent, "\u00b8", "\\c"); // cedilla
definesymbol(math, accent, "\u02da", "\\r"); // ring above
definesymbol(math, accent, "\u02c7", "\\v"); // caron
definesymbol(math, accent, "\u00a8", '\\"'); // diaresis
definesymbol(math, accent, "\u02dd", "\\h"); // double acute

// these ligatures are detected and created in parser.js's `formligatures`.
const ligatures = {
  "--": true,
  "---": true,
  "``": true,
  "''": true
};

definesymbol(temml_text, textord, "\u2013", "--", true);
definesymbol(temml_text, textord, "\u2013", "\\textendash");
definesymbol(temml_text, textord, "\u2014", "---", true);
definesymbol(temml_text, textord, "\u2014", "\\textemdash");
definesymbol(temml_text, textord, "\u2018", "`", true);
definesymbol(temml_text, textord, "\u2018", "\\textquoteleft");
definesymbol(temml_text, textord, "\u2019", "'", true);
definesymbol(temml_text, textord, "\u2019", "\\textquoteright");
definesymbol(temml_text, textord, "\u201c", "``", true);
definesymbol(temml_text, textord, "\u201c", "\\textquotedblleft");
definesymbol(temml_text, textord, "\u201d", "''", true);
definesymbol(temml_text, textord, "\u201d", "\\textquotedblright");
//  \degree from gensymb package
definesymbol(math, textord, "\u00b0", "\\degree", true);
definesymbol(temml_text, textord, "\u00b0", "\\degree");
// \textdegree from inputenc package
definesymbol(temml_text, textord, "\u00b0", "\\textdegree", true);
// todo: in latex, \pounds can generate a different character in text and math
// mode, but among our fonts, only main-regular defines this character "163".
definesymbol(math, textord, "\u00a3", "\\pounds");
definesymbol(math, textord, "\u00a3", "\\mathsterling", true);
definesymbol(temml_text, textord, "\u00a3", "\\pounds");
definesymbol(temml_text, textord, "\u00a3", "\\textsterling", true);
definesymbol(math, textord, "\u2720", "\\maltese");
definesymbol(temml_text, textord, "\u2720", "\\maltese");
definesymbol(math, textord, "\u20ac", "\\euro", true);
definesymbol(temml_text, textord, "\u20ac", "\\euro", true);
definesymbol(temml_text, textord, "\u20ac", "\\texteuro");
definesymbol(math, textord, "\u00a9", "\\copyright", true);
definesymbol(temml_text, textord, "\u00a9", "\\textcopyright");
definesymbol(math, textord, "\u2300", "\\diameter", true);
definesymbol(temml_text, textord, "\u2300", "\\diameter");

// italic greek
definesymbol(math, textord, "ùõ§", "\\vargamma");
definesymbol(math, textord, "ùõ•", "\\vardelta");
definesymbol(math, textord, "ùõ©", "\\vartheta");
definesymbol(math, textord, "ùõ¨", "\\varlambda");
definesymbol(math, textord, "ùõØ", "\\varxi");
definesymbol(math, textord, "ùõ±", "\\varpi");
definesymbol(math, textord, "ùõ¥", "\\varsigma");
definesymbol(math, textord, "ùõ∂", "\\varupsilon");
definesymbol(math, textord, "ùõ∑", "\\varphi");
definesymbol(math, textord, "ùõπ", "\\varpsi");
definesymbol(math, textord, "ùõ∫", "\\varomega");
definesymbol(temml_text, textord, "ùõ§", "\\vargamma");
definesymbol(temml_text, textord, "ùõ•", "\\vardelta");
definesymbol(temml_text, textord, "ùõ©", "\\vartheta");
definesymbol(temml_text, textord, "ùõ¨", "\\varlambda");
definesymbol(temml_text, textord, "ùõØ", "\\varxi");
definesymbol(temml_text, textord, "ùõ±", "\\varpi");
definesymbol(temml_text, textord, "ùõ¥", "\\varsigma");
definesymbol(temml_text, textord, "ùõ∂", "\\varupsilon");
definesymbol(temml_text, textord, "ùõ∑", "\\varphi");
definesymbol(temml_text, textord, "ùõπ", "\\varpsi");
definesymbol(temml_text, textord, "ùõ∫", "\\varomega");


// there are lots of symbols which are the same, so we add them in afterwards.
// all of these are textords in math mode
const mathtextsymbols = '0123456789/@."';
for (let i = 0; i < mathtextsymbols.length; i++) {
  const ch = mathtextsymbols.charat(i);
  definesymbol(math, textord, ch, ch);
}

// all of these are textords in text mode
const textsymbols = '0123456789!@*()-=+";:?/.,';
for (let i = 0; i < textsymbols.length; i++) {
  const ch = textsymbols.charat(i);
  definesymbol(temml_text, textord, ch, ch);
}

// all of these are textords in text mode, and mathords in math mode
const letters = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
for (let i = 0; i < letters.length; i++) {
  const ch = letters.charat(i);
  definesymbol(math, mathord, ch, ch);
  definesymbol(temml_text, textord, ch, ch);
}

// some more letters in unicode basic multilingual plane.
const narrow = "„á„ê„û„ß„æ‚ÑÇ‚Ñç‚Ñï‚Ñô‚Ñö‚Ñù‚Ñ§‚Ñû‚Ñè‚Ñö‚Ñã‚Ñú‚Ñê‚Ñë‚Ñí‚Ñì‚Ñò‚Ñõ‚Ñú‚Ñ¨‚Ñ∞‚Ñ±‚Ñ≥‚Ñ≠‚Ñ®";
for (let i = 0; i < narrow.length; i++) {
  const ch = narrow.charat(i);
  definesymbol(math, mathord, ch, ch);
  definesymbol(temml_text, textord, ch, ch);
}

// the next loop loads wide (surrogate pair) characters.
// we support some letters in the unicode range u+1d400 to u+1d7ff,
// mathematical alphanumeric symbols.
let widechar = "";
for (let i = 0; i < letters.length; i++) {
  // the hex numbers in the next line are a surrogate pair.
  // 0xd835 is the high surrogate for all letters in the range we support.
  // 0xdc00 is the low surrogate for bold a.
  widechar = string.fromcharcode(0xd835, 0xdc00 + i); // a-z a-z bold
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xdc34 + i); // a-z a-z italic
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xdc68 + i); // a-z a-z bold italic
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xdd04 + i); // a-z a-z fractur
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xdda0 + i); // a-z a-z sans-serif
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xddd4 + i); // a-z a-z sans bold
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xde08 + i); // a-z a-z sans italic
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xde70 + i); // a-z a-z monospace
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xdd38 + i); // a-z a-z double struck
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  const ch = letters.charat(i);
  widechar = string.fromcharcode(0xd835, 0xdc9c + i); // a-z a-z calligraphic
  definesymbol(math, mathord, ch, widechar);
  definesymbol(temml_text, textord, ch, widechar);
}

// next, some wide character numerals
for (let i = 0; i < 10; i++) {
  widechar = string.fromcharcode(0xd835, 0xdfce + i); // 0-9 bold
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xdfe2 + i); // 0-9 sans serif
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xdfec + i); // 0-9 bold sans
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);

  widechar = string.fromcharcode(0xd835, 0xdff6 + i); // 0-9 monospace
  definesymbol(math, mathord, widechar, widechar);
  definesymbol(temml_text, textord, widechar, widechar);
}

/*
 * neither firefox nor chrome support hard line breaks or soft line breaks.
 * (despite https://www.w3.org/math/draft-spec/mathml.html#chapter3_presm.lbattrs)
 * so temml has work-arounds for both hard and soft breaks.
 * the work-arounds sadly do not work simultaneously. any top-level hard
 * break makes soft line breaks impossible.
 *
 * hard breaks are simulated by creating a <mtable> and putting each line in its own <mtr>.
 *
 * to create soft line breaks, temml avoids using the <semantics> and <annotation> tags.
 * then the top level of a <math> element can be occupied by <mrow> elements, and the browser
 * will break after a <mrow> if the expression extends beyond the container limit.
 *
 * the default is for soft line breaks after each top-level binary or
 * relational operator, per texbook p. 173. so we gather the expression into <mrow>s so that
 * each <mrow> ends in a binary or relational operator.
 *
 * an option is for soft line breaks before an "=" sign. that changes the <mrow>s.
 *
 * soft line breaks will not work in chromium and safari, only firefox.
 *
 * hopefully browsers will someday do their own linebreaking and we will be able to delete
 * much of this module.
 */

const opendelims = "([{‚úö‚úà‚ˇ®‚ˇÆ‚û∞‚ˇ¶‚¶É";
const closedelims = ")]}‚úã‚úâ‚ˇ©‚ˇØ‚û±‚ˇ¶‚¶Ñ";

function setlinebreaks(expression, wrapmode, isdisplaymode) {
  const mtrs = [];
  let mrows = [];
  let block = [];
  let numtoplevelequals = 0;
  let i = 0;
  let level = 0;
  while (i < expression.length) {
    while (expression[i] instanceof documentfragment) {
      expression.splice(i, 1, ...expression[i].children); // expand the fragment.
    }
    const node = expression[i];
    if (node.attributes && node.attributes.linebreak &&
      node.attributes.linebreak === "newline") {
      // a hard line break. create a <mtr> for the current block.
      if (block.length > 0) {
        mrows.push(new mathmltree.mathnode("mrow", block));
      }
      mrows.push(node);
      block = [];
      const mtd = new mathmltree.mathnode("mtd", mrows);
      mtd.style.textalign = "left";
      mtrs.push(new mathmltree.mathnode("mtr", [mtd]));
      mrows = [];
      i += 1;
      continue
    }
    block.push(node);
    if (node.type && node.type === "mo" && node.children.length === 1 &&
        !object.hasown(node.attributes, "movablelimits")) {
      const ch = node.children[0].text;
      if (opendelims.indexof(ch) > -1) {
        level += 1;
      } else if (closedelims.indexof(ch) > -1) {
        level -= 1;
      } else if (level === 0 && wrapmode === "=" && ch === "=") {
        numtoplevelequals += 1;
        if (numtoplevelequals > 1) {
          block.pop();
          // start a new block. (insert a soft linebreak.)
          const element = new mathmltree.mathnode("mrow", block);
          mrows.push(element);
          block = [node];
        }
      } else if (level === 0 && wrapmode === "tex" && ch !== "‚àá") {
        // check if the following node is a \nobreak text node, e.g. "~""
        const next = i < expression.length - 1 ? expression[i + 1] : null;
        let glueisfreeofnobreak = true;
        if (
          !(
            next &&
            next.type === "mtext" &&
            next.attributes.linebreak &&
            next.attributes.linebreak === "nobreak"
          )
        ) {
          // we may need to start a new block.
          // first, put any post-operator glue on same line as operator.
          for (let j = i + 1; j < expression.length; j++) {
            const nd = expression[j];
            if (
              nd.type &&
              nd.type === "mspace" &&
              !(nd.attributes.linebreak && nd.attributes.linebreak === "newline")
            ) {
              block.push(nd);
              i += 1;
              if (
                nd.attributes &&
                nd.attributes.linebreak &&
                nd.attributes.linebreak === "nobreak"
              ) {
                glueisfreeofnobreak = false;
              }
            } else {
              break;
            }
          }
        }
        if (glueisfreeofnobreak) {
          // start a new block. (insert a soft linebreak.)
          const element = new mathmltree.mathnode("mrow", block);
          mrows.push(element);
          block = [];
        }
      }
    }
    i += 1;
  }
  if (block.length > 0) {
    const element = new mathmltree.mathnode("mrow", block);
    mrows.push(element);
  }
  if (mtrs.length > 0) {
    const mtd = new mathmltree.mathnode("mtd", mrows);
    mtd.style.textalign = "left";
    const mtr = new mathmltree.mathnode("mtr", [mtd]);
    mtrs.push(mtr);
    const mtable = new mathmltree.mathnode("mtable", mtrs);
    if (!isdisplaymode) {
      mtable.setattribute("columnalign", "left");
      mtable.setattribute("rowspacing", "0em");
    }
    return mtable
  }
  return mathmltree.newdocumentfragment(mrows);
}

/**
 * this file converts a parse tree into a corresponding mathml tree. the main
 * entry point is the `buildmathml` function, which takes a parse tree from the
 * parser.
 */


/**
 * takes a symbol and converts it into a mathml text node after performing
 * optional replacement from symbols.js.
 */
const maketext = function(text, mode, style) {
  if (
    symbols[mode][text] &&
    symbols[mode][text].replace &&
    text.charcodeat(0) !== 0xd835 &&
    !(
      object.prototype.hasownproperty.call(ligatures, text) &&
      style &&
      ((style.fontfamily && style.fontfamily.slice(4, 6) === "tt") ||
        (style.font && style.font.slice(4, 6) === "tt"))
    )
  ) {
    text = symbols[mode][text].replace;
  }

  return new mathmltree.textnode(text);
};

const copychar = (newrow, child) => {
  if (newrow.children.length === 0 ||
      newrow.children[newrow.children.length - 1].type !== "mtext") {
    const mtext = new mathmltree.mathnode(
      "mtext",
      [new mathmltree.textnode(child.children[0].text)]
    );
    newrow.children.push(mtext);
  } else {
    newrow.children[newrow.children.length - 1].children[0].text += child.children[0].text;
  }
};

const consolidatetext = mrow => {
  // if possible, consolidate adjacent <mtext> elements into a single element.
  if (mrow.type !== "mrow" && mrow.type !== "mstyle") { return mrow }
  if (mrow.children.length === 0) { return mrow } // empty group, e.g., \text{}
  const newrow = new mathmltree.mathnode("mrow");
  for (let i = 0; i < mrow.children.length; i++) {
    const child = mrow.children[i];
    if (child.type === "mtext" && object.keys(child.attributes).length === 0) {
      copychar(newrow, child);
    } else if (child.type === "mrow") {
      // we'll also check the children of an mrow. one level only. no recursion.
      let canconsolidate = true;
      for (let j = 0; j < child.children.length; j++) {
        const grandchild = child.children[j];
        if (grandchild.type !== "mtext" || object.keys(child.attributes).length !== 0) {
          canconsolidate = false;
          break
        }
      }
      if (canconsolidate) {
        for (let j = 0; j < child.children.length; j++) {
          const grandchild = child.children[j];
          copychar(newrow, grandchild);
        }
      } else {
        newrow.children.push(child);
      }
    } else {
      newrow.children.push(child);
    }
  }
  for (let i = 0; i < newrow.children.length; i++) {
    if (newrow.children[i].type === "mtext") {
      const mtext = newrow.children[i];
      // firefox does not render a space at either end of an <mtext> string.
      // to get proper rendering, we replace leading or trailing spaces with no-break spaces.
      if (mtext.children[0].text.charat(0) === " ") {
        mtext.children[0].text = "\u00a0" + mtext.children[0].text.slice(1);
      }
      const l = mtext.children[0].text.length;
      if (l > 0 && mtext.children[0].text.charat(l - 1) === " ") {
        mtext.children[0].text = mtext.children[0].text.slice(0, -1) + "\u00a0";
      }
      for (const [key, value] of object.entries(mrow.attributes)) {
        mtext.attributes[key] = value;
      }
    }
  }
  if (newrow.children.length === 1 && newrow.children[0].type === "mtext") {
    return newrow.children[0]; // a consolidated <mtext>
  } else {
    return newrow
  }
};

/**
 * wrap the given array of nodes in an <mrow> node if needed, i.e.,
 * unless the array has length 1.  always returns a single node.
 */
const makerow = function(body, semisimple = false) {
  if (body.length === 1 && !(body[0] instanceof documentfragment)) {
    return body[0];
  } else if (!semisimple) {
    // suppress spacing on <mo> nodes at both ends of the row.
    if (body[0] instanceof mathnode && body[0].type === "mo" && !body[0].attributes.fence) {
      body[0].attributes.lspace = "0em";
      body[0].attributes.rspace = "0em";
    }
    const end = body.length - 1;
    if (body[end] instanceof mathnode && body[end].type === "mo" && !body[end].attributes.fence) {
      body[end].attributes.lspace = "0em";
      body[end].attributes.rspace = "0em";
    }
  }
  return new mathmltree.mathnode("mrow", body);
};

/**
 * check for <mi>.</mi> which is how a dot renders in mathml,
 * or <mo separator="true" lspace="0em" rspace="0em">,</mo>
 * which is how a braced comma {,} renders in mathml
 */
function isnumberpunctuation(group) {
  if (!group) {
    return false
  }
  if (group.type === 'mi' && group.children.length === 1) {
    const child = group.children[0];
    return child instanceof textnode && child.text === '.'
  } else if (group.type === "mtext" && group.children.length === 1) {
    const child = group.children[0];
    return child instanceof textnode && child.text === '\u2008' // punctuation space
  } else if (group.type === 'mo' && group.children.length === 1 &&
    group.getattribute('separator') === 'true' &&
    group.getattribute('lspace') === '0em' &&
    group.getattribute('rspace') === '0em') {
    const child = group.children[0];
    return child instanceof textnode && child.text === ','
  } else {
    return false
  }
}
const iscomma = (expression, i) => {
  const node = expression[i];
  const followingnode = expression[i + 1];
  return (node.type === "atom" && node.text === ",") &&
    // don't consolidate if there is a space after the comma.
    node.loc && followingnode.loc && node.loc.end === followingnode.loc.start
};

const isrel = item => {
  return (item.type === "atom" && item.family === "rel") ||
      (item.type === "mclass" && item.mclass === "mrel")
};

/**
 * takes a list of nodes, builds them, and returns a list of the generated
 * mathml nodes.  also do a couple chores along the way:
 * (1) suppress spacing when an author wraps an operator w/braces, as in {=}.
 * (2) suppress spacing between two adjacent relations.
 */
const buildexpression = function(expression, style, semisimple = false) {
  if (!semisimple && expression.length === 1) {
    const group = buildgroup$1(expression[0], style);
    if (group instanceof mathnode && group.type === "mo") {
      // when tex writers want to suppress spacing on an operator,
      // they often put the operator by itself inside braces.
      group.setattribute("lspace", "0em");
      group.setattribute("rspace", "0em");
    }
    return [group];
  }

  const groups = [];
  const grouparray = [];
  let lastgroup;
  for (let i = 0; i < expression.length; i++) {
    grouparray.push(buildgroup$1(expression[i], style));
  }

  for (let i = 0; i < grouparray.length; i++) {
    const group = grouparray[i];

    // suppress spacing between adjacent relations
    if (i < expression.length - 1 && isrel(expression[i]) && isrel(expression[i + 1])) {
      group.setattribute("rspace", "0em");
    }
    if (i > 0 && isrel(expression[i]) && isrel(expression[i - 1])) {
      group.setattribute("lspace", "0em");
    }

    // concatenate numbers
    if (group.type === 'mn' && lastgroup && lastgroup.type === 'mn') {
      // concatenate <mn>...</mn> followed by <mi>.</mi>
      lastgroup.children.push(...group.children);
      continue
    } else if (isnumberpunctuation(group) && lastgroup && lastgroup.type === 'mn') {
      // concatenate <mn>...</mn> followed by <mi>.</mi>
      lastgroup.children.push(...group.children);
      continue
    } else if (lastgroup && lastgroup.type === "mn" && i < grouparray.length - 1 &&
      grouparray[i + 1].type === "mn" && iscomma(expression, i)) {
      lastgroup.children.push(...group.children);
      continue
    } else if (group.type === 'mn' && isnumberpunctuation(lastgroup)) {
      // concatenate <mi>.</mi> followed by <mn>...</mn>
      group.children = [...lastgroup.children, ...group.children];
      groups.pop();
    } else if ((group.type === 'msup' || group.type === 'msub') &&
        group.children.length >= 1 && lastgroup &&
        (lastgroup.type === 'mn' || isnumberpunctuation(lastgroup))) {
      // put preceding <mn>...</mn> or <mi>.</mi> inside base of
      // <msup><mn>...base...</mn>...exponent...</msup> (or <msub>)
      const base = group.children[0];
      if (base instanceof mathnode && base.type === 'mn' && lastgroup) {
        base.children = [...lastgroup.children, ...base.children];
        groups.pop();
      }
    }
    groups.push(group);
    lastgroup = group;
  }
  return groups
};

/**
 * equivalent to buildexpression, but wraps the elements in an <mrow>
 * if there's more than one.  returns a single node instead of an array.
 */
const buildexpressionrow = function(expression, style, semisimple = false) {
  return makerow(buildexpression(expression, style, semisimple), semisimple);
};

/**
 * takes a group from the parser and calls the appropriate groupbuilders function
 * on it to produce a mathml node.
 */
const buildgroup$1 = function(group, style) {
  if (!group) {
    return new mathmltree.mathnode("mrow");
  }

  if (_mathmlgroupbuilders[group.type]) {
    // call the groupbuilders function
    const result = _mathmlgroupbuilders[group.type](group, style);
    return result;
  } else {
    throw new parseerror("got group of unknown type: '" + group.type + "'");
  }
};

const glue$1 = _ => {
  return new mathmltree.mathnode("mtd", [], [], { padding: "0", width: "50%" })
};

const labelcontainers = ["mrow", "mtd", "mtable", "mtr"];
const getlabel = parent => {
  for (const node of parent.children) {
    if (node.type && labelcontainers.includes(node.type)) {
      if (node.classes && node.classes[0] === "tml-label") {
        const label = node.label;
        return label
      } else {
        const label = getlabel(node);
        if (label) { return label }
      }
    } else if (!node.type) {
      const label = getlabel(node);
      if (label) { return label }
    }
  }
};

const taggedexpression = (expression, tag, style, leqno) => {
  tag = buildexpressionrow(tag[0].body, style);
  tag = consolidatetext(tag);
  tag.classes.push("tml-tag");

  const label = getlabel(expression); // from a \label{} function.
  expression = new mathmltree.mathnode("mtd", [expression]);
  const rowarray = [glue$1(), expression, glue$1()];
  rowarray[leqno ? 0 : 2].classes.push(leqno ? "tml-left" : "tml-right");
  rowarray[leqno ? 0 : 2].children.push(tag);
  const mtr = new mathmltree.mathnode("mtr", rowarray, ["tml-tageqn"]);
  if (label) { mtr.setattribute("id", label); }
  const table = new mathmltree.mathnode("mtable", [mtr]);
  table.style.width = "100%";
  table.setattribute("displaystyle", "true");
  return table
};

/**
 * takes a full parse tree and settings and builds a mathml representation of
 * it.
 */
function buildmathml(tree, texexpression, style, settings) {
  // strip off outer tag wrapper for processing below.
  let tag = null;
  if (tree.length === 1 && tree[0].type === "tag") {
    tag = tree[0].tag;
    tree = tree[0].body;
  }

  const expression = buildexpression(tree, style);

  if (expression.length === 1 && expression[0] instanceof anchornode) {
    return expression[0]
  }

  const wrap = (settings.displaymode || settings.annotate) ? "none" : settings.wrap;

  const n1 = expression.length === 0 ? null : expression[0];
  let wrapper = expression.length === 1 && tag === null && (n1 instanceof mathnode)
      ? expression[0]
      : setlinebreaks(expression, wrap, settings.displaymode);

  if (tag) {
    wrapper = taggedexpression(wrapper, tag, style, settings.leqno);
  }

  if (settings.annotate) {
    // build a tex annotation of the source
    const annotation = new mathmltree.mathnode(
      "annotation", [new mathmltree.textnode(texexpression)]);
    annotation.setattribute("encoding", "application/x-tex");
    wrapper = new mathmltree.mathnode("semantics", [wrapper, annotation]);
  }

  const math = new mathmltree.mathnode("math", [wrapper]);

  if (settings.xml) {
    math.setattribute("xmlns", "http://www.w3.org/1998/math/mathml");
  }
  if (wrapper.style.width) {
    math.style.width = "100%";
  }
  if (settings.displaymode) {
    math.setattribute("display", "block");
    math.style.display = "block math"; // necessary in chromium.
    // firefox and safari do not recognize display: "block math".
    // set a class so that the css file can set display: block.
    math.classes = ["tml-display"];
  }
  return math;
}

const smalls = "aceg‰±Ë∑mnopqrsuvwxyzÓ±Ó≥ÓµÓ∑ÓπÓ∫ÓºÓΩÓøÔÄÔÅÔÇÔÉÔÑÔÖÔáÔâÔïùêöùêúùêûùê†ùê¶ùêßùê®ùê©ùê™ùê´ùê¨ùêÆùêØùê∞ùê±ùê≤ùê≥";
const talls = "abcdefghijklmnopqrstuvwxyzbdfhkltÓëÓíÓìÓîÓïÓñÓóÓòÓôÓöÓõÓúÓùÓûÓˇÓ†Ó°Ó£Ó§Ó•Ó¶ÓßÓ®Ó©Ó≤Ó¥ÓªÓ∂ÔÜÓ∏Ôà"
             + "ùêÄùêÅùêÇùêÉùêÑùêÖùêÜùêáùêàùêâùêöùêãùêúùêçùêûùêèùêêùêëùêíùêìùêîùêïùêñùêóùêòùêôùêõùêùùêˇùê°ùê§ùê•ùê≠";
const longsmalls = new set(["\\alpha", "\\gamma", "\\delta", "\\epsilon", "\\eta", "\\iota",
  "\\kappa", "\\mu", "\\nu", "\\pi", "\\rho", "\\sigma", "\\tau", "\\upsilon", "\\chi", "\\psi",
  "\\omega", "\\imath", "\\jmath"]);
const longtalls = new set(["\\gamma", "\\delta", "\\sigma", "\\omega", "\\beta", "\\delta",
  "\\lambda", "\\theta", "\\psi"]);

const mathmlbuilder$a = (group, style) => {
  const accentnode = group.isstretchy
    ? stretchy.accentnode(group)
    : new mathmltree.mathnode("mo", [maketext(group.label, group.mode)]);

  if (group.label === "\\vec") {
    accentnode.style.transform = "scale(0.75) translate(10%, 30%)";
  } else {
    accentnode.style.mathstyle = "normal";
    accentnode.style.mathdepth = "0";
    if (needwebkitshift.has(group.label) &&  utils.ischaracterbox(group.base)) {
      let shift = "";
      const ch = group.base.text;
      if (smalls.indexof(ch) > -1 || longsmalls.has(ch)) { shift = "tml-xshift"; }
      if (talls.indexof(ch) > -1  || longtalls.has(ch))  { shift = "tml-capshift"; }
      if (shift) { accentnode.classes.push(shift); }
    }
  }
  if (!group.isstretchy) {
    accentnode.setattribute("stretchy", "false");
  }

  const node = new mathmltree.mathnode((group.label === "\\c" ? "munder" : "mover"),
    [buildgroup$1(group.base, style), accentnode]
  );

  return node;
};

const nonstretchyaccents = new set([
  "\\acute",
  "\\grave",
  "\\ddot",
  "\\dddot",
  "\\ddddot",
  "\\tilde",
  "\\bar",
  "\\breve",
  "\\check",
  "\\hat",
  "\\vec",
  "\\dot",
  "\\mathring"
]);

const needwebkitshift = new set([
  "\\acute",
  "\\bar",
  "\\breve",
  "\\check",
  "\\dot",
  "\\ddot",
  "\\grave",
  "\\hat",
  "\\mathring",
  "\\'", "\\^", "\\~", "\\=", "\\u", "\\.", '\\"', "\\r", "\\h", "\\v"
]);

const combiningchar = {
  "\\`": "\u0300",
  "\\'": "\u0301",
  "\\^": "\u0302",
  "\\~": "\u0303",
  "\\=": "\u0304",
  "\\u": "\u0306",
  "\\.": "\u0307",
  '\\"': "\u0308",
  "\\r": "\u030a",
  "\\h": "\u030b",
  "\\v": "\u030c"
};

// accents
definefunction({
  type: "accent",
  names: [
    "\\acute",
    "\\grave",
    "\\ddot",
    "\\dddot",
    "\\ddddot",
    "\\tilde",
    "\\bar",
    "\\breve",
    "\\check",
    "\\hat",
    "\\vec",
    "\\dot",
    "\\mathring",
    "\\overparen",
    "\\widecheck",
    "\\widehat",
    "\\wideparen",
    "\\widetilde",
    "\\overrightarrow",
    "\\overleftarrow",
    "\\overrightarrow",
    "\\overleftrightarrow",
    "\\overgroup",
    "\\overleftharpoon",
    "\\overrightharpoon"
  ],
  props: {
    numargs: 1
  },
  handler: (context, args) => {
    const base = normalizeargument(args[0]);

    const isstretchy = !nonstretchyaccents.has(context.funcname);

    return {
      type: "accent",
      mode: context.parser.mode,
      label: context.funcname,
      isstretchy: isstretchy,
      base: base
    };
  },
  mathmlbuilder: mathmlbuilder$a
});

// text-mode accents
definefunction({
  type: "accent",
  names: ["\\'", "\\`", "\\^", "\\~", "\\=", "\\c", "\\u", "\\.", '\\"', "\\r", "\\h", "\\v"],
  props: {
    numargs: 1,
    allowedintext: true,
    allowedinmath: true,
    argtypes: ["primitive"]
  },
  handler: (context, args) => {
    const base = normalizeargument(args[0]);
    const mode = context.parser.mode;

    if (mode === "math" && context.parser.settings.strict) {
      // latex only writes a warning. it doesn't stop. we'll issue the same warning.
      // eslint-disable-next-line no-console
      console.log(`temml parse error: command ${context.funcname} is invalid in math mode.`);
    }

    if (mode === "text" && base.text && base.text.length === 1
        && context.funcname in combiningchar  && smalls.indexof(base.text) > -1) {
      // return a combining accent character
      return {
        type: "textord",
        mode: "text",
        text: base.text + combiningchar[context.funcname]
      }
    } else {
      // build up the accent
      return {
        type: "accent",
        mode: mode,
        label: context.funcname,
        isstretchy: false,
        base: base
      }
    }
  },
  mathmlbuilder: mathmlbuilder$a
});

definefunction({
  type: "accentunder",
  names: [
    "\\underleftarrow",
    "\\underrightarrow",
    "\\underleftrightarrow",
    "\\undergroup",
    "\\underparen",
    "\\utilde"
  ],
  props: {
    numargs: 1
  },
  handler: ({ parser, funcname }, args) => {
    const base = args[0];
    return {
      type: "accentunder",
      mode: parser.mode,
      label: funcname,
      base: base
    };
  },
  mathmlbuilder: (group, style) => {
    const accentnode = stretchy.accentnode(group);
    accentnode.style["math-depth"] = 0;
    const node = new mathmltree.mathnode("munder", [
      buildgroup$1(group.base, style),
      accentnode
    ]);
    return node;
  }
});

/**
 * this file does conversion between units.  in particular, it provides
 * calculatesize to convert other units into css units.
 */


const ptperunit = {
  // convert to css (postscipt) points, not tex points
  // https://en.wikibooks.org/wiki/latex/lengths and
  // https://tex.stackexchange.com/a/8263
  pt: 800 / 803, // convert tex point to css (postscript) point
  pc: (12 * 800) / 803, // pica
  dd: ((1238 / 1157) * 800) / 803, // didot
  cc: ((14856 / 1157) * 800) / 803, // cicero (12 didot)
  nd: ((685 / 642) * 800) / 803, // new didot
  nc: ((1370 / 107) * 800) / 803, // new cicero (12 new didot)
  sp: ((1 / 65536) * 800) / 803, // scaled point (tex's internal smallest unit)
  mm: (25.4 / 72),
  cm: (2.54 / 72),
  in: (1 / 72),
  px: (96 / 72)
};

/**
 * determine whether the specified unit (either a string defining the unit
 * or a "size" parse node containing a unit field) is valid.
 */
const validunits = [
  "em",
  "ex",
  "mu",
  "pt",
  "mm",
  "cm",
  "in",
  "px",
  "bp",
  "pc",
  "dd",
  "cc",
  "nd",
  "nc",
  "sp"
];

const validunit = function(unit) {
  if (typeof unit !== "string") {
    unit = unit.unit;
  }
  return validunits.indexof(unit) > -1
};

const emscale = stylelevel => {
  const scriptlevel = math.max(stylelevel - 1, 0);
  return [1, 0.7, 0.5][scriptlevel]
};

/*
 * convert a "size" parse node (with numeric "number" and string "unit" fields,
 * as parsed by functions.js argtype "size") into a css value.
 */
const calculatesize = function(sizevalue, style) {
  let number = sizevalue.number;
  if (style.maxsize[0] < 0 && number > 0) {
    return { number: 0, unit: "em" }
  }
  const unit = sizevalue.unit;
  switch (unit) {
    case "mm":
    case "cm":
    case "in":
    case "px": {
      const numincsspts = number * ptperunit[unit];
      if (numincsspts > style.maxsize[1]) {
        return { number: style.maxsize[1], unit: "pt" }
      }
      return { number, unit }; // absolute css units.
    }
    case "em":
    case "ex": {
      // in tex, em and ex do not change size in \scriptstyle.
      if (unit === "ex") { number *= 0.431; }
      number = math.min(number / emscale(style.level), style.maxsize[0]);
      return { number: utils.round(number), unit: "em" };
    }
    case "bp": {
      if (number > style.maxsize[1]) { number = style.maxsize[1]; }
      return { number, unit: "pt" }; // tex bp is a css pt. (1/72 inch).
    }
    case "pt":
    case "pc":
    case "dd":
    case "cc":
    case "nd":
    case "nc":
    case "sp": {
      number = math.min(number * ptperunit[unit], style.maxsize[1]);
      return { number: utils.round(number), unit: "pt" }
    }
    case "mu": {
      number = math.min(number / 18, style.maxsize[0]);
      return { number: utils.round(number), unit: "em" }
    }
    default:
      throw new parseerror("invalid unit: '" + unit + "'")
  }
};

// helper functions

const padding$2 = width => {
  const node = new mathmltree.mathnode("mspace");
  node.setattribute("width", width + "em");
  return node
};

const paddednode = (group, lspace = 0.3, rspace = 0, mustsmash = false) => {
  if (group == null && rspace === 0) { return padding$2(lspace) }
  const row = group ? [group] : [];
  if (lspace !== 0)   { row.unshift(padding$2(lspace)); }
  if (rspace > 0) { row.push(padding$2(rspace)); }
  if (mustsmash) {
    // used for the bottom arrow in a {cd} environment
    const mpadded = new mathmltree.mathnode("mpadded", row);
    mpadded.setattribute("height", "0");
    return mpadded
  } else {
    return new mathmltree.mathnode("mrow", row)
  }
};

const labelsize = (size, scriptlevel) =>  number(size) / emscale(scriptlevel);

const munderovernode = (fname, body, below, style) => {
  const arrownode = stretchy.mathmlnode(fname);
  // is this the short part of a mhchem equilibrium arrow?
  const iseq = fname.slice(1, 3) === "eq";
  const minwidth = fname.charat(1) === "x"
    ? "1.75"  // mathtools extensible arrows are ‚â• 1.75em long
    : fname.slice(2, 4) === "cd"
    ? "3.0"  // cd package arrows
    : iseq
    ? "1.0"  // the shorter harpoon of a mhchem equilibrium arrow
    : "2.0"; // other mhchem arrows
  // todo: when firefox supports minsize, use the next line.
  //arrownode.setattribute("minsize", string(minwidth) + "em")
  arrownode.setattribute("lspace", "0");
  arrownode.setattribute("rspace", (iseq ? "0.5em" : "0"));

  // <munderover> upper and lower labels are set to scriptlevel by mathml
  // so we have to adjust our label dimensions accordingly.
  const labelstyle = style.withlevel(style.level < 2 ? 2 : 3);
  const minarrowwidth = labelsize(minwidth, labelstyle.level);
  // the dummynode will be inside a <mover> inside a <mover>
  // so it will be at scriptlevel 3
  const dummywidth = labelsize(minwidth, 3);
  const emptylabel = paddednode(null, minarrowwidth.tofixed(4), 0);
  const dummynode = paddednode(null, dummywidth.tofixed(4), 0);
  // the arrow is a little longer than the label. set a spacer length.
  const space = labelsize((iseq ? 0 : 0.3), labelstyle.level).tofixed(4);
  let uppernode;
  let lowernode;

  const gotupper = (body && body.body &&
    // \hphantom        visible content
    (body.body.body || body.body.length > 0));
  if (gotupper) {
    let label =  buildgroup$1(body, labelstyle);
    const mustsmash = (fname === "\\\\cdrightarrow" || fname === "\\\\cdleftarrow");
    label = paddednode(label, space, space, mustsmash);
    // since firefox does not support minsize, stack a invisible node
    // on top of the label. its width will serve as a min-width.
    // todo: refactor this after firefox supports minsize.
    uppernode = new mathmltree.mathnode("mover", [label, dummynode]);
  }
  const gotlower = (below && below.body &&
    (below.body.body || below.body.length > 0));
  if (gotlower) {
    let label =  buildgroup$1(below, labelstyle);
    label = paddednode(label, space, space);
    lowernode = new mathmltree.mathnode("munder", [label, dummynode]);
  }

  let node;
  if (!gotupper && !gotlower) {
    node = new mathmltree.mathnode("mover", [arrownode, emptylabel]);
  } else if (gotupper && gotlower) {
    node = new mathmltree.mathnode("munderover", [arrownode, lowernode, uppernode]);
  } else if (gotupper) {
    node = new mathmltree.mathnode("mover", [arrownode, uppernode]);
  } else {
    node = new mathmltree.mathnode("munder", [arrownode, lowernode]);
  }
  if (minwidth === "3.0") { node.style.height = "1em"; } // cd environment
  node.setattribute("accent", "false"); // necessary for ms word
  return node
};

// stretchy arrows with an optional argument
definefunction({
  type: "xarrow",
  names: [
    "\\xleftarrow",
    "\\xrightarrow",
    "\\xleftarrow",
    "\\xrightarrow",
    "\\xleftrightarrow",
    "\\xleftrightarrow",
    "\\xhookleftarrow",
    "\\xhookrightarrow",
    "\\xmapsto",
    "\\xrightharpoondown",
    "\\xrightharpoonup",
    "\\xleftharpoondown",
    "\\xleftharpoonup",
    "\\xlongequal",
    "\\xtwoheadrightarrow",
    "\\xtwoheadleftarrow",
    // the next 5 functions are here only to support mhchem
    "\\yields",
    "\\yieldsleft",
    "\\mesomerism",
    "\\longrightharpoonup",
    "\\longleftharpoondown",
    // the next 3 functions are here only to support the {cd} environment.
    "\\\\cdrightarrow",
    "\\\\cdleftarrow",
    "\\\\cdlongequal"
  ],
  props: {
    numargs: 1,
    numoptionalargs: 1
  },
  handler({ parser, funcname }, args, optargs) {
    return {
      type: "xarrow",
      mode: parser.mode,
      name: funcname,
      body: args[0],
      below: optargs[0]
    };
  },
  mathmlbuilder(group, style) {
    // build the arrow and its labels.
    const node = munderovernode(group.name, group.body, group.below, style);
    // create operator spacing for a relation.
    const row = [node];
    row.unshift(padding$2(0.2778));
    row.push(padding$2(0.2778));
    return new mathmltree.mathnode("mrow", row)
  }
});

const arrowcomponent = {
  "\\xtofrom": ["\\xrightarrow", "\\xleftarrow"],
  "\\xleftrightharpoons": ["\\xleftharpoonup", "\\xrightharpoondown"],
  "\\xrightleftharpoons": ["\\xrightharpoonup", "\\xleftharpoondown"],
  "\\yieldsleftright": ["\\yields", "\\yieldsleft"],
  // the next three all get the same harpoon glyphs. only the lengths and paddings differ.
  "\\equilibrium": ["\\longrightharpoonup", "\\longleftharpoondown"],
  "\\equilibriumright": ["\\longrightharpoonup", "\\eqleftharpoondown"],
  "\\equilibriumleft": ["\\eqrightharpoonup", "\\longleftharpoondown"]
};

// browsers are not good at stretching a glyph that contains a pair of stacked arrows such as ‚áÑ.
// so we stack a pair of single arrows.
definefunction({
  type: "stackedarrow",
  names: [
    "\\xtofrom",              // expfeil
    "\\xleftrightharpoons",   // mathtools
    "\\xrightleftharpoons",   // mathtools
    "\\yieldsleftright",      // mhchem
    "\\equilibrium",          // mhchem
    "\\equilibriumright",
    "\\equilibriumleft"
  ],
  props: {
    numargs: 1,
    numoptionalargs: 1
  },
  handler({ parser, funcname }, args, optargs) {
    const lowerarrowbody = args[0]
      ? {
        type: "hphantom",
        mode: parser.mode,
        body: args[0]
      }
      : null;
    const upperarrowbelow = optargs[0]
      ? {
        type: "hphantom",
        mode: parser.mode,
        body: optargs[0]
      }
      : null;
    return {
      type: "stackedarrow",
      mode: parser.mode,
      name: funcname,
      body: args[0],
      upperarrowbelow,
      lowerarrowbody,
      below: optargs[0]
    };
  },
  mathmlbuilder(group, style) {
    const toplabel = arrowcomponent[group.name][0];
    const botlabel = arrowcomponent[group.name][1];
    const toparrow = munderovernode(toplabel, group.body, group.upperarrowbelow, style);
    const botarrow = munderovernode(botlabel, group.lowerarrowbody, group.below, style);
    let wrapper;

    const raisenode = new mathmltree.mathnode("mpadded", [toparrow]);
    raisenode.setattribute("voffset", "0.3em");
    raisenode.setattribute("height", "+0.3em");
    raisenode.setattribute("depth", "-0.3em");
    // one of the arrows is given ~zero width. so the other has the same horzontal alignment.
    if (group.name === "\\equilibriumleft") {
      const botnode =  new mathmltree.mathnode("mpadded", [botarrow]);
      botnode.setattribute("width", "0.5em");
      wrapper = new mathmltree.mathnode(
        "mpadded",
        [padding$2(0.2778), botnode, raisenode, padding$2(0.2778)]
      );
    } else {
      raisenode.setattribute("width", (group.name === "\\equilibriumright" ? "0.5em" : "0"));
      wrapper = new mathmltree.mathnode(
        "mpadded",
        [padding$2(0.2778), raisenode, botarrow, padding$2(0.2778)]
      );
    }

    wrapper.setattribute("voffset", "-0.18em");
    wrapper.setattribute("height", "-0.18em");
    wrapper.setattribute("depth", "+0.18em");
    return wrapper
  }
});

/**
 * asserts that the node is of the given type and returns it with stricter
 * typing. throws if the node's type does not match.
 */
function assertnodetype(node, type) {
  if (!node || node.type !== type) {
    throw new error(
      `expected node of type ${type}, but got ` +
        (node ? `node of type ${node.type}` : string(node))
    );
  }
  return node;
}

/**
 * returns the node more strictly typed iff it is of the given type. otherwise,
 * returns null.
 */
function assertsymbolnodetype(node) {
  const typednode = checksymbolnodetype(node);
  if (!typednode) {
    throw new error(
      `expected node of symbol group type, but got ` +
        (node ? `node of type ${node.type}` : string(node))
    );
  }
  return typednode;
}

/**
 * returns the node more strictly typed iff it is of the given type. otherwise,
 * returns null.
 */
function checksymbolnodetype(node) {
  if (node && (node.type === "atom" ||
      object.prototype.hasownproperty.call(non_atoms, node.type))) {
    return node;
  }
  return null;
}

const cdarrowfunctionname = {
  ">": "\\\\cdrightarrow",
  "<": "\\\\cdleftarrow",
  "=": "\\\\cdlongequal",
  a: "\\uparrow",
  v: "\\downarrow",
  "|": "\\vert",
  ".": "no arrow"
};

const newcell = () => {
  // create an empty cell, to be filled below with parse nodes.
  return { type: "styling", body: [], mode: "math", scriptlevel: "display" };
};

const isstartofarrow = (node) => {
  return node.type === "textord" && node.text === "@";
};

const islabelend = (node, endchar) => {
  return (node.type === "mathord" || node.type === "atom") && node.text === endchar;
};

function cdarrow(arrowchar, labels, parser) {
  // return a parse tree of an arrow and its labels.
  // this acts in a way similar to a macro expansion.
  const funcname = cdarrowfunctionname[arrowchar];
  switch (funcname) {
    case "\\\\cdrightarrow":
    case "\\\\cdleftarrow":
      return parser.callfunction(funcname, [labels[0]], [labels[1]]);
    case "\\uparrow":
    case "\\downarrow": {
      const leftlabel = parser.callfunction("\\\\cdleft", [labels[0]], []);
      const barearrow = {
        type: "atom",
        text: funcname,
        mode: "math",
        family: "rel"
      };
      const sizedarrow = parser.callfunction("\\big", [barearrow], []);
      const rightlabel = parser.callfunction("\\\\cdright", [labels[1]], []);
      const arrowgroup = {
        type: "ordgroup",
        mode: "math",
        body: [leftlabel, sizedarrow, rightlabel],
        semisimple: true
      };
      return parser.callfunction("\\\\cdparent", [arrowgroup], []);
    }
    case "\\\\cdlongequal":
      return parser.callfunction("\\\\cdlongequal", [], []);
    case "\\vert": {
      const arrow = { type: "textord", text: "\\vert", mode: "math" };
      return parser.callfunction("\\big", [arrow], []);
    }
    default:
      return { type: "textord", text: " ", mode: "math" };
  }
}

function parsecd(parser) {
  // get the array's parse nodes with \\ temporarily mapped to \cr.
  const parsedrows = [];
  parser.gullet.begingroup();
  parser.gullet.macros.set("\\cr", "\\\\\\relax");
  parser.gullet.begingroup();
  while (true) {
    // get the parse nodes for the next row.
    parsedrows.push(parser.parseexpression(false, "\\\\"));
    parser.gullet.endgroup();
    parser.gullet.begingroup();
    const next = parser.fetch().text;
    if (next === "&" || next === "\\\\") {
      parser.consume();
    } else if (next === "\\end") {
      if (parsedrows[parsedrows.length - 1].length === 0) {
        parsedrows.pop(); // final row ended in \\
      }
      break;
    } else {
      throw new parseerror("expected \\\\ or \\cr or \\end", parser.nexttoken);
    }
  }

  let row = [];
  const body = [row];

  // loop thru the parse nodes. collect them into cells and arrows.
  for (let i = 0; i < parsedrows.length; i++) {
    // start a new row.
    const rownodes = parsedrows[i];
    // create the first cell.
    let cell = newcell();

    for (let j = 0; j < rownodes.length; j++) {
      if (!isstartofarrow(rownodes[j])) {
        // if a parsenode is not an arrow, it goes into a cell.
        cell.body.push(rownodes[j]);
      } else {
        // parse node j is an "@", the start of an arrow.
        // before starting on the arrow, push the cell into `row`.
        row.push(cell);

        // now collect parsenodes into an arrow.
        // the character after "@" defines the arrow type.
        j += 1;
        const arrowchar = assertsymbolnodetype(rownodes[j]).text;

        // create two empty label nodes. we may or may not use them.
        const labels = new array(2);
        labels[0] = { type: "ordgroup", mode: "math", body: [] };
        labels[1] = { type: "ordgroup", mode: "math", body: [] };

        // process the arrow.
        if ("=|.".indexof(arrowchar) > -1) ; else if ("<>av".indexof(arrowchar) > -1) {
          // four arrows, `@>>>`, `@<<<`, `@aaa`, and `@vvv`, each take
          // two optional labels. e.g. the right-point arrow syntax is
          // really:  @>{optional label}>{optional label}>
          // collect parsenodes into labels.
          for (let labelnum = 0; labelnum < 2; labelnum++) {
            let inlabel = true;
            for (let k = j + 1; k < rownodes.length; k++) {
              if (islabelend(rownodes[k], arrowchar)) {
                inlabel = false;
                j = k;
                break;
              }
              if (isstartofarrow(rownodes[k])) {
                throw new parseerror(
                  "missing a " + arrowchar + " character to complete a cd arrow.",
                  rownodes[k]
                );
              }

              labels[labelnum].body.push(rownodes[k]);
            }
            if (inlabel) {
              // islabelend never returned a true.
              throw new parseerror(
                "missing a " + arrowchar + " character to complete a cd arrow.",
                rownodes[j]
              );
            }
          }
        } else {
          throw new parseerror(`expected one of "<>av=|." after @.`);
        }

        // now join the arrow to its labels.
        const arrow = cdarrow(arrowchar, labels, parser);

        // wrap the arrow in a styling node
        row.push(arrow);
        // in cd's syntax, cells are implicit. that is, everything that
        // is not an arrow gets collected into a cell. so create an empty
        // cell now. it will collect upcoming parsenodes.
        cell = newcell();
      }
    }
    if (i % 2 === 0) {
      // even-numbered rows consist of: cell, arrow, cell, arrow, ... cell
      // the last cell is not yet pushed into `row`, so:
      row.push(cell);
    } else {
      // odd-numbered rows consist of: vert arrow, empty cell, ... vert arrow
      // remove the empty cell that was placed at the beginning of `row`.
      row.shift();
    }
    row = [];
    body.push(row);
  }
  body.pop();

  // end row group
  parser.gullet.endgroup();
  // end array group defining \\
  parser.gullet.endgroup();

  return {
    type: "array",
    mode: "math",
    body,
    tags: null,
    labels: new array(body.length + 1).fill(""),
    envclasses: ["jot", "cd"],
    cols: [],
    hlinesbeforerow: new array(body.length + 1).fill([])
  };
}

// the functions below are not available for general use.
// they are here only for internal use by the {cd} environment in placing labels
// next to vertical arrows.

// we don't need any such functions for horizontal arrows because we can reuse
// the functionality that already exists for extensible arrows.

definefunction({
  type: "cdlabel",
  names: ["\\\\cdleft", "\\\\cdright"],
  props: {
    numargs: 1
  },
  handler({ parser, funcname }, args) {
    return {
      type: "cdlabel",
      mode: parser.mode,
      side: funcname.slice(4),
      label: args[0]
    };
  },
  mathmlbuilder(group, style) {
    if (group.label.body.length === 0) {
      return new mathmltree.mathnode("mrow", style)  // empty label
    }
    // abuse an <mtable> to create vertically centered content.
    const mtd = new mathmltree.mathnode("mtd", [buildgroup$1(group.label, style)]);
    mtd.style.padding = "0";
    const mtr = new mathmltree.mathnode("mtr", [mtd]);
    const mtable = new mathmltree.mathnode("mtable", [mtr]);
    const label = new mathmltree.mathnode("mpadded", [mtable]);
    // set the label width to zero so that the arrow will be centered under the corner cell.
    label.setattribute("width", "0");
    label.setattribute("displaystyle", "false");
    label.setattribute("scriptlevel", "1");
    if (group.side === "left") {
      label.style.display = "flex";
      label.style.justifycontent = "flex-end";
    }
    return label;
  }
});

definefunction({
  type: "cdlabelparent",
  names: ["\\\\cdparent"],
  props: {
    numargs: 1
  },
  handler({ parser }, args) {
    return {
      type: "cdlabelparent",
      mode: parser.mode,
      fragment: args[0]
    };
  },
  mathmlbuilder(group, style) {
    return new mathmltree.mathnode("mrow", [buildgroup$1(group.fragment, style)]);
  }
});

// \@char is an internal function that takes a grouped decimal argument like
// {123} and converts into symbol with code 123.  it is used by the *macro*
// \char defined in macros.js.
definefunction({
  type: "textord",
  names: ["\\@char"],
  props: {
    numargs: 1,
    allowedintext: true
  },
  handler({ parser, token }, args) {
    const arg = assertnodetype(args[0], "ordgroup");
    const group = arg.body;
    let number = "";
    for (let i = 0; i < group.length; i++) {
      const node = assertnodetype(group[i], "textord");
      number += node.text;
    }
    const code = parseint(number);
    if (isnan(code)) {
      throw new parseerror(`\\@char has non-numeric argument ${number}`, token)
    }
    return {
      type: "textord",
      mode: parser.mode,
      text: string.fromcodepoint(code)
    }
  }
});

// helpers
const htmlregex = /^(#[a-f0-9]{3}|#?[a-f0-9]{6})$/i;
const htmlornameregex = /^(#[a-f0-9]{3}|#?[a-f0-9]{6}|[a-z]+)$/i;
const rgbregex = /^ *\d{1,3} *(?:, *\d{1,3} *){2}$/;
const rgbregex = /^ *[10](?:\.\d*)? *(?:, *[10](?:\.\d*)? *){2}$/;
const xcolorhtmlregex = /^[a-f0-9]{6}$/i;
const tohex = num => {
  let str = num.tostring(16);
  if (str.length === 1) { str = "0" + str; }
  return str
};

// colors from tables 4.1 and 4.2 of the xcolor package.
// table 4.1 (lower case) rgb values are taken from chroma and xcolor.dtx.
// table 4.2 (capitalizzed) values were sampled, because chroma contains a unreliable
// conversion from cmyk to rgb. see https://tex.stackexchange.com/a/537274.
const xcolors = json.parse(`{
  "apricot": "#ffb484",
  "aquamarine": "#08b4bc",
  "bittersweet": "#c84c14",
  "blue": "#0000ff",
  "blue": "#303494",
  "bluegreen": "#08b4bc",
  "blueviolet": "#503c94",
  "brickred": "#b8341c",
  "brown": "#bf8040",
  "brown": "#802404",
  "burntorange": "#f8941c",
  "cadetblue": "#78749c",
  "carnationpink": "#f884b4",
  "cerulean": "#08a4e4",
  "cornflowerblue": "#40ace4",
  "cyan": "#00ffff",
  "cyan": "#08acec",
  "dandelion": "#ffbc44",
  "darkgray": "#404040",
  "darkorchid": "#a8548c",
  "emerald": "#08ac9c",
  "forestgreen": "#089c54",
  "fuchsia": "#90348c",
  "goldenrod": "#ffdc44",
  "gray": "#808080",
  "gray": "#98949c",
  "green": "#00ff00",
  "green": "#08a44c",
  "greenyellow": "#e0e474",
  "junglegreen": "#08ac9c",
  "lavender": "#f89cc4",
  "lightgray": "#c0c0c0",
  "lime": "#bfff00",
  "limegreen": "#90c43c",
  "magenta": "#ff00ff",
  "magenta": "#f0048c",
  "mahogany": "#b0341c",
  "maroon": "#b03434",
  "melon": "#f89c7c",
  "midnightblue": "#086494",
  "mulberry": "#b03c94",
  "navyblue": "#086cbc",
  "olive": "#7f7f00",
  "olivegreen": "#407c34",
  "orange": "#ff8000",
  "orange": "#f8843c",
  "orangered": "#f0145c",
  "orchid": "#b074ac",
  "peach": "#f8945c",
  "periwinkle": "#8074bc",
  "pinegreen": "#088c74",
  "pink": "#ff7f7f",
  "plum": "#98248c",
  "processblue": "#08b4ec",
  "purple": "#bf0040",
  "purple": "#a0449c",
  "rawsienna": "#983c04",
  "red": "#ff0000",
  "red": "#f01c24",
  "redorange": "#f86434",
  "redviolet": "#a0246c",
  "rhodamine": "#f0549c",
  "royallue": "#0874bc",
  "royalpurple": "#683c9c",
  "rubinered": "#f0047c",
  "salmon": "#f8948c",
  "seagreen": "#30bc9c",
  "sepia": "#701404",
  "skyblue": "#48c4dc",
  "springgreen": "#c8dc64",
  "tan": "#e09c74",
  "teal": "#007f7f",
  "tealblue": "#08acb4",
  "thistle": "#d884b4",
  "turquoise": "#08b4cc",
  "violet": "#800080",
  "violet": "#60449c",
  "violetred": "#f054a4",
  "wildstrawberry": "#f0246c",
  "yellow": "#ffff00",
  "yellow": "#fff404",
  "yellowgreen": "#98cc6c",
  "yelloworange": "#ffa41c"
}`);

const colorfromspec = (model, spec) => {
  let color = "";
  if (model === "html") {
    if (!htmlregex.test(spec)) {
      throw new parseerror("invalid html input.")
    }
    color = spec;
  } else if (model === "rgb") {
    if (!rgbregex.test(spec)) {
      throw new parseerror("invalid rgb input.")
    }
    spec.split(",").map(e => { color += tohex(number(e.trim())); });
  } else {
    if (!rgbregex.test(spec)) {
      throw new parseerror("invalid rbg input.")
    }
    spec.split(",").map(e => {
      const num = number(e.trim());
      if (num > 1) { throw new parseerror("color rgb input must be < 1.") }
      color += tohex(number((num * 255).tofixed(0)));
    });
  }
  if (color.charat(0) !== "#") { color = "#" + color; }
  return color
};

const validatecolor = (color, macros, token) => {
  const macroname = `\\\\color@${color}`; // from \definecolor.
  const match = htmlornameregex.exec(color);
  if (!match) { throw new parseerror("invalid color: '" + color + "'", token) }
  // we allow a 6-digit html color spec without a leading "#".
  // this follows the xcolor package's html color model.
  // predefined color names are all missed by this regex pattern.
  if (xcolorhtmlregex.test(color)) {
    return "#" + color
  } else if (color.charat(0) === "#") {
    return color
  } else if (macros.has(macroname)) {
    color = macros.get(macroname).tokens[0].text;
  } else if (xcolors[color]) {
    color = xcolors[color];
  }
  return color
};

const mathmlbuilder$9 = (group, style) => {
  // in latex, color is not supposed to change the spacing of any node.
  // so instead of wrapping the group in an <mstyle>, we apply
  // the color individually to each node and return a document fragment.
  let expr = buildexpression(group.body, style.withcolor(group.color));
  expr = expr.map(e => {
    e.style.color = group.color;
    return e
  });
  return mathmltree.newdocumentfragment(expr)
};

definefunction({
  type: "color",
  names: ["\\textcolor"],
  props: {
    numargs: 2,
    numoptionalargs: 1,
    allowedintext: true,
    argtypes: ["raw", "raw", "original"]
  },
  handler({ parser, token }, args, optargs) {
    const model = optargs[0] && assertnodetype(optargs[0], "raw").string;
    let color = "";
    if (model) {
      const spec = assertnodetype(args[0], "raw").string;
      color = colorfromspec(model, spec);
    } else {
      color = validatecolor(assertnodetype(args[0], "raw").string, parser.gullet.macros, token);
    }
    const body = args[1];
    return {
      type: "color",
      mode: parser.mode,
      color,
      istextcolor: true,
      body: ordargument(body)
    }
  },
  mathmlbuilder: mathmlbuilder$9
});

definefunction({
  type: "color",
  names: ["\\color"],
  props: {
    numargs: 1,
    numoptionalargs: 1,
    allowedintext: true,
    argtypes: ["raw", "raw"]
  },
  handler({ parser, breakontokentext, token }, args, optargs) {
    const model = optargs[0] && assertnodetype(optargs[0], "raw").string;
    let color = "";
    if (model) {
      const spec = assertnodetype(args[0], "raw").string;
      color = colorfromspec(model, spec);
    } else {
      color = validatecolor(assertnodetype(args[0], "raw").string, parser.gullet.macros, token);
    }

    // parse out the implicit body that should be colored.
    const body = parser.parseexpression(true, breakontokentext, true);

    return {
      type: "color",
      mode: parser.mode,
      color,
      istextcolor: false,
      body
    }
  },
  mathmlbuilder: mathmlbuilder$9
});

definefunction({
  type: "color",
  names: ["\\definecolor"],
  props: {
    numargs: 3,
    allowedintext: true,
    argtypes: ["raw", "raw", "raw"]
  },
  handler({ parser, funcname, token }, args) {
    const name = assertnodetype(args[0], "raw").string;
    if (!/^[a-za-z]+$/.test(name)) {
      throw new parseerror("color name must be latin letters.", token)
    }
    const model = assertnodetype(args[1], "raw").string;
    if (!["html", "rgb", "rgb"].includes(model)) {
      throw new parseerror("color model must be html, rgb, or rgb.", token)
    }
    const spec = assertnodetype(args[2], "raw").string;
    const color = colorfromspec(model, spec);
    parser.gullet.macros.set(`\\\\color@${name}`, { tokens: [{ text: color }], numargs: 0 });
    return { type: "internal", mode: parser.mode }
  }
  // no mathmlbuilder. the point of \definecolor is to set a macro.
});

// row breaks within tabular environments, and line breaks at top level


// \declarerobustcommand\\{...\@xnewline}
definefunction({
  type: "cr",
  names: ["\\\\"],
  props: {
    numargs: 0,
    numoptionalargs: 0,
    allowedintext: true
  },

  handler({ parser }, args, optargs) {
    const size = parser.gullet.future().text === "[" ? parser.parsesizegroup(true) : null;
    const newline = !parser.settings.displaymode;
    return {
      type: "cr",
      mode: parser.mode,
      newline,
      size: size && assertnodetype(size, "size").value
    }
  },

  // the following builder is called only at the top level,
  // not within tabular/array environments.

  mathmlbuilder(group, style) {
    // mathml 3.0 calls for newline to occur in an <mo> or an <mspace>.
    // ref: https://www.w3.org/tr/mathml3/chapter3.html#presm.linebreaking
    const node = new mathmltree.mathnode("mo");
    if (group.newline) {
      node.setattribute("linebreak", "newline");
      if (group.size) {
        const size = calculatesize(group.size, style);
        node.setattribute("height", size.number + size.unit);
      }
    }
    return node
  }
});

const globalmap = {
  "\\global": "\\global",
  "\\long": "\\\\globallong",
  "\\\\globallong": "\\\\globallong",
  "\\def": "\\gdef",
  "\\gdef": "\\gdef",
  "\\edef": "\\xdef",
  "\\xdef": "\\xdef",
  "\\let": "\\\\globallet",
  "\\futurelet": "\\\\globalfuture"
};

const checkcontrolsequence = (tok) => {
  const name = tok.text;
  if (/^(?:[\\{}$&#^_]|eof)$/.test(name)) {
    throw new parseerror("expected a control sequence", tok);
  }
  return name;
};

const getrhs = (parser) => {
  let tok = parser.gullet.poptoken();
  if (tok.text === "=") {
    // consume optional equals
    tok = parser.gullet.poptoken();
    if (tok.text === " ") {
      // consume one optional space
      tok = parser.gullet.poptoken();
    }
  }
  return tok;
};

const letcommand = (parser, name, tok, global) => {
  let macro = parser.gullet.macros.get(tok.text);
  if (macro == null) {
    // don't expand it later even if a macro with the same name is defined
    // e.g., \let\foo=\frac \def\frac{\relax} \frac12
    tok.noexpand = true;
    macro = {
      tokens: [tok],
      numargs: 0,
      // reproduce the same behavior in expansion
      unexpandable: !parser.gullet.isexpandable(tok.text)
    };
  }
  parser.gullet.macros.set(name, macro, global);
};

// <assignment> -> <non-macro assignment>|<macro assignment>
// <non-macro assignment> -> <simple assignment>|\global<non-macro assignment>
// <macro assignment> -> <definition>|<prefix><macro assignment>
// <prefix> -> \global|\long|\outer
definefunction({
  type: "internal",
  names: [
    "\\global",
    "\\long",
    "\\\\globallong" // can‚Äôt be entered directly
  ],
  props: {
    numargs: 0,
    allowedintext: true
  },
  handler({ parser, funcname }) {
    parser.consumespaces();
    const token = parser.fetch();
    if (globalmap[token.text]) {
      // temml doesn't have \par, so ignore \long
      if (funcname === "\\global" || funcname === "\\\\globallong") {
        token.text = globalmap[token.text];
      }
      return assertnodetype(parser.parsefunction(), "internal");
    }
    throw new parseerror(`invalid token after macro prefix`, token);
  }
});

// basic support for macro definitions: \def, \gdef, \edef, \xdef
// <definition> -> <def><control sequence><definition text>
// <def> -> \def|\gdef|\edef|\xdef
// <definition text> -> <parameter text><left brace><balanced text><right brace>
definefunction({
  type: "internal",
  names: ["\\def", "\\gdef", "\\edef", "\\xdef"],
  props: {
    numargs: 0,
    allowedintext: true,
    primitive: true
  },
  handler({ parser, funcname }) {
    let tok = parser.gullet.poptoken();
    const name = tok.text;
    if (/^(?:[\\{}$&#^_]|eof)$/.test(name)) {
      throw new parseerror("expected a control sequence", tok);
    }

    let numargs = 0;
    let insert;
    const delimiters = [[]];
    // <parameter text> contains no braces
    while (parser.gullet.future().text !== "{") {
      tok = parser.gullet.poptoken();
      if (tok.text === "#") {
        // if the very last character of the <parameter text> is #, so that
        // this # is immediately followed by {, tex will behave as if the {
        // had been inserted at the right end of both the parameter text
        // and the replacement text.
        if (parser.gullet.future().text === "{") {
          insert = parser.gullet.future();
          delimiters[numargs].push("{");
          break;
        }

        // a parameter, the first appearance of # must be followed by 1,
        // the next by 2, and so on; up to nine #‚Äôs are allowed
        tok = parser.gullet.poptoken();
        if (!/^[1-9]$/.test(tok.text)) {
          throw new parseerror(`invalid argument number "${tok.text}"`);
        }
        if (parseint(tok.text) !== numargs + 1) {
          throw new parseerror(`argument number "${tok.text}" out of order`);
        }
        numargs++;
        delimiters.push([]);
      } else if (tok.text === "eof") {
        throw new parseerror("expected a macro definition");
      } else {
        delimiters[numargs].push(tok.text);
      }
    }
    // replacement text, enclosed in '{' and '}' and properly nested
    let { tokens } = parser.gullet.consumearg();
    if (insert) {
      tokens.unshift(insert);
    }

    if (funcname === "\\edef" || funcname === "\\xdef") {
      tokens = parser.gullet.expandtokens(tokens);
      if (tokens.length > parser.gullet.settings.maxexpand) {
        throw new parseerror("too many expansions in an " + funcname);
      }
      tokens.reverse(); // to fit in with stack order
    }
    // final arg is the expansion of the macro
    parser.gullet.macros.set(
      name,
      { tokens, numargs, delimiters },
      funcname === globalmap[funcname]
    );
    return { type: "internal", mode: parser.mode };
  }
});

// <simple assignment> -> <let assignment>
// <let assignment> -> \futurelet<control sequence><token><token>
//     | \let<control sequence><equals><one optional space><token>
// <equals> -> <optional spaces>|<optional spaces>=
definefunction({
  type: "internal",
  names: [
    "\\let",
    "\\\\globallet" // can‚Äôt be entered directly
  ],
  props: {
    numargs: 0,
    allowedintext: true,
    primitive: true
  },
  handler({ parser, funcname }) {
    const name = checkcontrolsequence(parser.gullet.poptoken());
    parser.gullet.consumespaces();
    const tok = getrhs(parser);
    letcommand(parser, name, tok, funcname === "\\\\globallet");
    return { type: "internal", mode: parser.mode };
  }
});

// ref: https://www.tug.org/tugboat/tb09-3/tb22bechtolsheim.pdf
definefunction({
  type: "internal",
  names: [
    "\\futurelet",
    "\\\\globalfuture" // can‚Äôt be entered directly
  ],
  props: {
    numargs: 0,
    allowedintext: true,
    primitive: true
  },
  handler({ parser, funcname }) {
    const name = checkcontrolsequence(parser.gullet.poptoken());
    const middle = parser.gullet.poptoken();
    const tok = parser.gullet.poptoken();
    letcommand(parser, name, tok, funcname === "\\\\globalfuture");
    parser.gullet.pushtoken(tok);
    parser.gullet.pushtoken(middle);
    return { type: "internal", mode: parser.mode };
  }
});

definefunction({
  type: "internal",
  names: ["\\newcommand", "\\renewcommand", "\\providecommand"],
  props: {
    numargs: 0,
    allowedintext: true,
    primitive: true
  },
  handler({ parser, funcname }) {
    let name = "";
    const tok = parser.gullet.poptoken();
    if (tok.text === "{") {
      name = checkcontrolsequence(parser.gullet.poptoken());
      parser.gullet.poptoken();
    } else {
      name = checkcontrolsequence(tok);
    }

    const exists = parser.gullet.isdefined(name);
    if (exists && funcname === "\\newcommand") {
      throw new parseerror(
        `\\newcommand{${name}} attempting to redefine ${name}; use \\renewcommand`
      );
    }
    if (!exists && funcname === "\\renewcommand") {
      throw new parseerror(
        `\\renewcommand{${name}} when command ${name} does not yet exist; use \\newcommand`
      );
    }

    let numargs = 0;
    if (parser.gullet.future().text === "[") {
      let tok = parser.gullet.poptoken();
      tok = parser.gullet.poptoken();
      if (!/^[0-9]$/.test(tok.text)) {
        throw new parseerror(`invalid number of arguments: "${tok.text}"`);
      }
      numargs = parseint(tok.text);
      tok = parser.gullet.poptoken();
      if (tok.text !== "]") {
        throw new parseerror(`invalid argument "${tok.text}"`);
      }
    }

    // replacement text, enclosed in '{' and '}' and properly nested
    const { tokens } = parser.gullet.consumearg();

    if (!(funcname === "\\providecommand" && parser.gullet.macros.has(name))) {
      // ignore \providecommand
      parser.gullet.macros.set(
        name,
        { tokens, numargs }
      );
    }

    return { type: "internal", mode: parser.mode };

  }
});

// extra data needed for the delimiter handler down below
const delimitersizes = {
  "\\bigl": { mclass: "mopen", size: 1 },
  "\\bigl": { mclass: "mopen", size: 2 },
  "\\biggl": { mclass: "mopen", size: 3 },
  "\\biggl": { mclass: "mopen", size: 4 },
  "\\bigr": { mclass: "mclose", size: 1 },
  "\\bigr": { mclass: "mclose", size: 2 },
  "\\biggr": { mclass: "mclose", size: 3 },
  "\\biggr": { mclass: "mclose", size: 4 },
  "\\bigm": { mclass: "mrel", size: 1 },
  "\\bigm": { mclass: "mrel", size: 2 },
  "\\biggm": { mclass: "mrel", size: 3 },
  "\\biggm": { mclass: "mrel", size: 4 },
  "\\big": { mclass: "mord", size: 1 },
  "\\big": { mclass: "mord", size: 2 },
  "\\bigg": { mclass: "mord", size: 3 },
  "\\bigg": { mclass: "mord", size: 4 }
};

const delimiters = [
  "(",
  "\\lparen",
  ")",
  "\\rparen",
  "[",
  "\\lbrack",
  "]",
  "\\rbrack",
  "\\{",
  "\\lbrace",
  "\\}",
  "\\rbrace",
  "‚¶á",
  "\\llparenthesis",
  "‚¶à",
  "\\rrparenthesis",
  "\\lfloor",
  "\\rfloor",
  "\u230a",
  "\u230b",
  "\\lceil",
  "\\rceil",
  "\u2308",
  "\u2309",
  "<",
  ">",
  "\\langle",
  "\u27e8",
  "\\rangle",
  "\u27e9",
  "\\langle",
  "\u27ea",
  "\\rangle",
  "\u27eb",
  "\\llangle",
  "‚¶â",
  "\\rrangle",
  "‚¶ö",
  "\\lt",
  "\\gt",
  "\\lvert",
  "\\rvert",
  "\\lvert",
  "\\rvert",
  "\\lgroup",
  "\\rgroup",
  "\u27ee",
  "\u27ef",
  "\\lmoustache",
  "\\rmoustache",
  "\u23b0",
  "\u23b1",
  "\\llbracket",
  "\\rrbracket",
  "\u27e6",
  "\u27e6",
  "\\lbrace",
  "\\rbrace",
  "\u2983",
  "\u2984",
  "/",
  "\\backslash",
  "|",
  "\\vert",
  "\\|",
  "\\vert",
  "\u2016",
  "\\uparrow",
  "\\uparrow",
  "\\downarrow",
  "\\downarrow",
  "\\updownarrow",
  "\\updownarrow",
  "."
];

// export isdelimiter for benefit of parser.
const dels = ["}", "\\left", "\\middle", "\\right"];
const isdelimiter = str => str.length > 0 &&
  (delimiters.includes(str) || delimitersizes[str] || dels.includes(str));

// metrics of the different sizes. found by looking at tex's output of
// $\bigl| // \bigl| \biggl| \biggl| \showlists$
// used to create stacked delimiters of appropriate sizes in makesizeddelim.
const sizetomaxheight = [0, 1.2, 1.8, 2.4, 3.0];

// delimiter functions
function checkdelimiter(delim, context) {
  const symdelim = checksymbolnodetype(delim);
  if (symdelim && delimiters.includes(symdelim.text)) {
    // if a character is not in the mathml operator dictionary, it will not stretch.
    // replace such characters w/characters that will stretch.
    if (["<", "\\lt"].includes(symdelim.text)) { symdelim.text = "‚ˇ®"; }
    if ([">", "\\gt"].includes(symdelim.text)) { symdelim.text = "‚ˇ©"; }
    return symdelim;
  } else if (symdelim) {
    throw new parseerror(`invalid delimiter '${symdelim.text}' after '${context.funcname}'`, delim);
  } else {
    throw new parseerror(`invalid delimiter type '${delim.type}'`, delim);
  }
}

//                               /         \
const needexplicitstretch = ["\u002f", "\u005c", "\\backslash", "\\vert", "|"];

definefunction({
  type: "delimsizing",
  names: [
    "\\bigl",
    "\\bigl",
    "\\biggl",
    "\\biggl",
    "\\bigr",
    "\\bigr",
    "\\biggr",
    "\\biggr",
    "\\bigm",
    "\\bigm",
    "\\biggm",
    "\\biggm",
    "\\big",
    "\\big",
    "\\bigg",
    "\\bigg"
  ],
  props: {
    numargs: 1,
    argtypes: ["primitive"]
  },
  handler: (context, args) => {
    const delim = checkdelimiter(args[0], context);

    return {
      type: "delimsizing",
      mode: context.parser.mode,
      size: delimitersizes[context.funcname].size,
      mclass: delimitersizes[context.funcname].mclass,
      delim: delim.text
    };
  },
  mathmlbuilder: (group) => {
    const children = [];

    if (group.delim === ".") { group.delim = ""; }
    children.push(maketext(group.delim, group.mode));

    const node = new mathmltree.mathnode("mo", children);

    if (group.mclass === "mopen" || group.mclass === "mclose") {
      // only some of the delimsizing functions act as fences, and they
      // return "mopen" or "mclose" mclass.
      node.setattribute("fence", "true");
    } else {
      // explicitly disable fencing if it's not a fence, to override the
      // defaults.
      node.setattribute("fence", "false");
    }
    if (needexplicitstretch.includes(group.delim) || group.delim.indexof("arrow") > -1) {
      // we have to explicitly set stretchy to true.
      node.setattribute("stretchy", "true");
    }
    node.setattribute("symmetric", "true"); // needed for tall arrows in firefox.
    node.setattribute("minsize", sizetomaxheight[group.size] + "em");
    node.setattribute("maxsize", sizetomaxheight[group.size] + "em");
    return node;
  }
});

function assertparsed(group) {
  if (!group.body) {
    throw new error("bug: the leftright parsenode wasn't fully parsed.");
  }
}

definefunction({
  type: "leftright-right",
  names: ["\\right"],
  props: {
    numargs: 1,
    argtypes: ["primitive"]
  },
  handler: (context, args) => {
    return {
      type: "leftright-right",
      mode: context.parser.mode,
      delim: checkdelimiter(args[0], context).text
    };
  }
});

definefunction({
  type: "leftright",
  names: ["\\left"],
  props: {
    numargs: 1,
    argtypes: ["primitive"]
  },
  handler: (context, args) => {
    const delim = checkdelimiter(args[0], context);

    const parser = context.parser;
    // parse out the implicit body
    ++parser.leftrightdepth;
    // parseexpression stops before '\\right' or `\\middle`
    let body = parser.parseexpression(false, null, true);
    let nexttoken = parser.fetch();
    while (nexttoken.text === "\\middle") {
      // `\middle`, from the Óµ-tex package, ends one group and starts another group.
      // we had to parse this expression with `breakonmiddle` enabled in order
      // to get tex-compliant parsing of \over.
      // but we do not want, at this point, to end on \middle, so continue
      // to parse until we fetch a `\right`.
      parser.consume();
      const middle = parser.fetch().text;
      if (!symbols.math[middle]) {
        throw new parseerror(`invalid delimiter '${middle}' after '\\middle'`);
      }
      checkdelimiter({ type: "atom", mode: "math", text: middle }, { funcname: "\\middle" });
      body.push({ type: "middle", mode: "math", delim: middle });
      parser.consume();
      body = body.concat(parser.parseexpression(false, null, true));
      nexttoken = parser.fetch();
    }
    --parser.leftrightdepth;
    // check the next token
    parser.expect("\\right", false);
    const right = assertnodetype(parser.parsefunction(), "leftright-right");
    return {
      type: "leftright",
      mode: parser.mode,
      body,
      left: delim.text,
      right: right.delim
    };
  },
  mathmlbuilder: (group, style) => {
    assertparsed(group);
    const inner = buildexpression(group.body, style);

    if (group.left === ".") { group.left = ""; }
    const leftnode = new mathmltree.mathnode("mo", [maketext(group.left, group.mode)]);
    leftnode.setattribute("fence", "true");
    leftnode.setattribute("form", "prefix");
    if (group.left === "/" || group.left === "\u005c" || group.left.indexof("arrow") > -1) {
      leftnode.setattribute("stretchy", "true");
    }
    inner.unshift(leftnode);

    if (group.right === ".") { group.right = ""; }
    const rightnode = new mathmltree.mathnode("mo", [maketext(group.right, group.mode)]);
    rightnode.setattribute("fence", "true");
    rightnode.setattribute("form", "postfix");
    if (group.right === "\u2216" || group.right.indexof("arrow") > -1) {
      rightnode.setattribute("stretchy", "true");
    }
    if (group.body.length > 0) {
      const lastelement = group.body[group.body.length - 1];
      if (lastelement.type === "color" && !lastelement.istextcolor) {
        // \color is a switch. if the last element is of type "color" then
        // the user set the \color switch and left it on.
        // a \right delimiter turns the switch off, but the delimiter itself gets the color.
        rightnode.setattribute("mathcolor", lastelement.color);
      }
    }
    inner.push(rightnode);

    return makerow(inner);
  }
});

definefunction({
  type: "middle",
  names: ["\\middle"],
  props: {
    numargs: 1,
    argtypes: ["primitive"]
  },
  handler: (context, args) => {
    const delim = checkdelimiter(args[0], context);
    if (!context.parser.leftrightdepth) {
      throw new parseerror("\\middle without preceding \\left", delim);
    }

    return {
      type: "middle",
      mode: context.parser.mode,
      delim: delim.text
    };
  },
  mathmlbuilder: (group, style) => {
    const textnode = maketext(group.delim, group.mode);
    const middlenode = new mathmltree.mathnode("mo", [textnode]);
    middlenode.setattribute("fence", "true");
    if (group.delim.indexof("arrow") > -1) {
      middlenode.setattribute("stretchy", "true");
    }
    // the next line is not semantically correct, but
    // chromium fails to stretch if it is not there.
    middlenode.setattribute("form", "prefix");
    // mathml gives 5/18em spacing to each <mo> element.
    // \middle should get delimiter spacing instead.
    middlenode.setattribute("lspace", "0.05em");
    middlenode.setattribute("rspace", "0.05em");
    return middlenode;
  }
});

const padding$1 = _ => {
  const node = new mathmltree.mathnode("mspace");
  node.setattribute("width", "3pt");
  return node
};

const mathmlbuilder$8 = (group, style) => {
  let node;
  if (group.label.indexof("colorbox") > -1 || group.label === "\\boxed") {
    // mathml core does not support +width attribute in <mpadded>.
    // firefox does not reliably add side padding.
    // insert <mspace>
    node = new mathmltree.mathnode("mrow", [
      padding$1(),
      buildgroup$1(group.body, style),
      padding$1()
    ]);
  } else {
    node = new mathmltree.mathnode("menclose", [buildgroup$1(group.body, style)]);
  }
  switch (group.label) {
    case "\\overline":
      node.setattribute("notation", "top"); // for firefox & webkit
      node.classes.push("tml-overline");    // for chromium
      break
    case "\\underline":
      node.setattribute("notation", "bottom");
      node.classes.push("tml-underline");
      break
    case "\\cancel":
      node.setattribute("notation", "updiagonalstrike");
      node.children.push(new mathmltree.mathnode("mrow", [], ["tml-cancel", "upstrike"]));
      break
    case "\\bcancel":
      node.setattribute("notation", "downdiagonalstrike");
      node.children.push(new mathmltree.mathnode("mrow", [], ["tml-cancel", "downstrike"]));
      break
    case "\\sout":
      node.setattribute("notation", "horizontalstrike");
      node.children.push(new mathmltree.mathnode("mrow", [], ["tml-cancel", "sout"]));
      break
    case "\\xcancel":
      node.setattribute("notation", "updiagonalstrike downdiagonalstrike");
      node.classes.push("tml-xcancel");
      break
    case "\\longdiv":
      node.setattribute("notation", "longdiv");
      node.classes.push("longdiv-top");
      node.children.push(new mathmltree.mathnode("mrow", [], ["longdiv-arc"]));
      break
    case "\\phase":
      node.setattribute("notation", "phasorangle");
      node.classes.push("phasor-bottom");
      node.children.push(new mathmltree.mathnode("mrow", [], ["phasor-angle"]));
      break
    case "\\textcircled":
      node.setattribute("notation", "circle");
      node.classes.push("circle-pad");
      node.children.push(new mathmltree.mathnode("mrow", [], ["textcircle"]));
      break
    case "\\angl":
      node.setattribute("notation", "actuarial");
      node.classes.push("actuarial");
      break
    case "\\boxed":
      // \newcommand{\boxed}[1]{\fbox{\m@th$\displaystyle#1$}} from amsmath.sty
      node.setattribute("notation", "box");
      node.classes.push("tml-box");
      node.setattribute("scriptlevel", "0");
      node.setattribute("displaystyle", "true");
      break
    case "\\fbox":
      node.setattribute("notation", "box");
      node.classes.push("tml-fbox");
      break
    case "\\fcolorbox":
    case "\\colorbox": {
      // <menclose> doesn't have a good notation option for \colorbox.
      // so use <mpadded> instead. set some attributes that come
      // included with <menclose>.
      //const fboxsep = 3; // 3 pt from latex source2e
      //node.setattribute("height", `+${2 * fboxsep}pt`)
      //node.setattribute("voffset", `${fboxsep}pt`)
      const style = { padding: "3pt 0 3pt 0" };

      if (group.label === "\\fcolorbox") {
        style.border = "0.0667em solid " + string(group.bordercolor);
      }
      node.style = style;
      break
    }
  }
  if (group.backgroundcolor) {
    node.setattribute("mathbackground", group.backgroundcolor);
  }
  return node;
};

definefunction({
  type: "enclose",
  names: ["\\colorbox"],
  props: {
    numargs: 2,
    numoptionalargs: 1,
    allowedintext: true,
    argtypes: ["raw", "raw", "text"]
  },
  handler({ parser, funcname }, args, optargs) {
    const model = optargs[0] && assertnodetype(optargs[0], "raw").string;
    let color = "";
    if (model) {
      const spec = assertnodetype(args[0], "raw").string;
      color = colorfromspec(model, spec);
    } else {
      color = validatecolor(assertnodetype(args[0], "raw").string, parser.gullet.macros);
    }
    const body = args[1];
    return {
      type: "enclose",
      mode: parser.mode,
      label: funcname,
      backgroundcolor: color,
      body
    };
  },
  mathmlbuilder: mathmlbuilder$8
});

definefunction({
  type: "enclose",
  names: ["\\fcolorbox"],
  props: {
    numargs: 3,
    numoptionalargs: 1,
    allowedintext: true,
    argtypes: ["raw", "raw", "raw", "text"]
  },
  handler({ parser, funcname }, args, optargs) {
    const model = optargs[0] && assertnodetype(optargs[0], "raw").string;
    let bordercolor = "";
    let backgroundcolor;
    if (model) {
      const borderspec = assertnodetype(args[0], "raw").string;
      const backgroundspec = assertnodetype(args[0], "raw").string;
      bordercolor = colorfromspec(model, borderspec);
      backgroundcolor = colorfromspec(model, backgroundspec);
    } else {
      bordercolor = validatecolor(assertnodetype(args[0], "raw").string, parser.gullet.macros);
      backgroundcolor = validatecolor(assertnodetype(args[1], "raw").string, parser.gullet.macros);
    }
    const body = args[2];
    return {
      type: "enclose",
      mode: parser.mode,
      label: funcname,
      backgroundcolor,
      bordercolor,
      body
    };
  },
  mathmlbuilder: mathmlbuilder$8
});

definefunction({
  type: "enclose",
  names: ["\\fbox"],
  props: {
    numargs: 1,
    argtypes: ["hbox"],
    allowedintext: true
  },
  handler({ parser }, args) {
    return {
      type: "enclose",
      mode: parser.mode,
      label: "\\fbox",
      body: args[0]
    };
  }
});

definefunction({
  type: "enclose",
  names: ["\\angl", "\\cancel", "\\bcancel", "\\xcancel", "\\sout", "\\overline",
    "\\boxed", "\\longdiv", "\\phase"],
  props: {
    numargs: 1
  },
  handler({ parser, funcname }, args) {
    const body = args[0];
    return {
      type: "enclose",
      mode: parser.mode,
      label: funcname,
      body
    };
  },
  mathmlbuilder: mathmlbuilder$8
});

definefunction({
  type: "enclose",
  names: ["\\underline"],
  props: {
    numargs: 1,
    allowedintext: true
  },
  handler({ parser, funcname }, args) {
    const body = args[0];
    return {
      type: "enclose",
      mode: parser.mode,
      label: funcname,
      body
    };
  },
  mathmlbuilder: mathmlbuilder$8
});


definefunction({
  type: "enclose",
  names: ["\\textcircled"],
  props: {
    numargs: 1,
    argtypes: ["text"],
    allowedinargument: true,
    allowedintext: true
  },
  handler({ parser, funcname }, args) {
    const body = args[0];
    return {
      type: "enclose",
      mode: parser.mode,
      label: funcname,
      body
    };
  },
  mathmlbuilder: mathmlbuilder$8
});

/**
 * all registered environments.
 * `environments.js` exports this same dictionary again and makes it public.
 * `parser.js` requires this dictionary via `environments.js`.
 */
const _environments = {};

function defineenvironment({ type, names, props, handler, mathmlbuilder }) {
  // set default values of environments.
  const data = {
    type,
    numargs: props.numargs || 0,
    allowedintext: false,
    numoptionalargs: 0,
    handler
  };
  for (let i = 0; i < names.length; ++i) {
    _environments[names[i]] = data;
  }
  if (mathmlbuilder) {
    _mathmlgroupbuilders[type] = mathmlbuilder;
  }
}

/**
 * lexing or parsing positional information for error reporting.
 * this object is immutable.
 */
class sourcelocation {
  constructor(lexer, start, end) {
    this.lexer = lexer; // lexer holding the input string.
    this.start = start; // start offset, zero-based inclusive.
    this.end = end;     // end offset, zero-based exclusive.
  }

  /**
   * merges two `sourcelocation`s from location providers, given they are
   * provided in order of appearance.
   * - returns the first one's location if only the first is provided.
   * - returns a merged range of the first and the last if both are provided
   *   and their lexers match.
   * - otherwise, returns null.
   */
  static range(first, second) {
    if (!second) {
      return first && first.loc;
    } else if (!first || !first.loc || !second.loc || first.loc.lexer !== second.loc.lexer) {
      return null;
    } else {
      return new sourcelocation(first.loc.lexer, first.loc.start, second.loc.end);
    }
  }
}

/**
 * interface required to break circular dependency between token, lexer, and
 * parseerror.
 */

/**
 * the resulting token returned from `lex`.
 *
 * it consists of the token text plus some position information.
 * the position information is essentially a range in an input string,
 * but instead of referencing the bare input string, we refer to the lexer.
 * that way it is possible to attach extra metadata to the input string,
 * like for example a file name or similar.
 *
 * the position information is optional, so it is ok to construct synthetic
 * tokens if appropriate. not providing available position information may
 * lead to degraded error reporting, though.
 */
class token {
  constructor(
    text, // the text of this token
    loc
  ) {
    this.text = text;
    this.loc = loc;
  }

  /**
   * given a pair of tokens (this and endtoken), compute a `token` encompassing
   * the whole input range enclosed by these two.
   */
  range(
    endtoken, // last token of the range, inclusive
    text // the text of the newly constructed token
  ) {
    return new token(text, sourcelocation.range(this, endtoken));
  }
}

// in tex, there are actually three sets of dimensions, one for each of
// textstyle, scriptstyle, and scriptscriptstyle.  these are
// provided in the the arrays below, in that order.
//

// math style is not quite the same thing as script level.
const stylelevel = {
  display: 0,
  text: 1,
  script: 2,
  scriptscript: 3
};

/**
 * all registered global/built-in macros.
 * `macros.js` exports this same dictionary again and makes it public.
 * `parser.js` requires this dictionary via `macros.js`.
 */
const _macros = {};

// this function might one day accept an additional argument and do more things.
function definemacro(name, body) {
  _macros[name] = body;
}

/**
 * predefined macros for temml.
 * this can be used to define some commands in terms of others.
 */

const macros = _macros;

//////////////////////////////////////////////////////////////////////
// macro tools

definemacro("\\noexpand", function(context) {
  // the expansion is the token itself; but that token is interpreted
  // as if its meaning were ‚Äò\relax‚Äô if it is a control sequence that
  // would ordinarily be expanded by tex‚Äôs expansion rules.
  const t = context.poptoken();
  if (context.isexpandable(t.text)) {
    t.noexpand = true;
    t.treatasrelax = true;
  }
  return { tokens: [t], numargs: 0 };
});

definemacro("\\expandafter", function(context) {
  // tex first reads the token that comes immediately after \expandafter,
  // without expanding it; let‚Äôs call this token t. then tex reads the
  // token that comes after t (and possibly more tokens, if that token
  // has an argument), replacing it by its expansion. finally tex puts
  // t back in front of that expansion.
  const t = context.poptoken();
  context.expandonce(true); // expand only an expandable token
  return { tokens: [t], numargs: 0 };
});

// latex's \@firstoftwo{#1}{#2} expands to #1, skipping #2
// tex source: \long\def\@firstoftwo#1#2{#1}
definemacro("\\@firstoftwo", function(context) {
  const args = context.consumeargs(2);
  return { tokens: args[0], numargs: 0 };
});

// latex's \@secondoftwo{#1}{#2} expands to #2, skipping #1
// tex source: \long\def\@secondoftwo#1#2{#2}
definemacro("\\@secondoftwo", function(context) {
  const args = context.consumeargs(2);
  return { tokens: args[1], numargs: 0 };
});

// latex's \@ifnextchar{#1}{#2}{#3} looks ahead to the next (unexpanded)
// symbol that isn't a space, consuming any spaces but not consuming the
// first nonspace character.  if that nonspace character matches #1, then
// the macro expands to #2; otherwise, it expands to #3.
definemacro("\\@ifnextchar", function(context) {
  const args = context.consumeargs(3); // symbol, if, else
  context.consumespaces();
  const nexttoken = context.future();
  if (args[0].length === 1 && args[0][0].text === nexttoken.text) {
    return { tokens: args[1], numargs: 0 };
  } else {
    return { tokens: args[2], numargs: 0 };
  }
});

// latex's \@ifstar{#1}{#2} looks ahead to the next (unexpanded) symbol.
// if it is `*`, then it consumes the symbol, and the macro expands to #1;
// otherwise, the macro expands to #2 (without consuming the symbol).
// tex source: \def\@ifstar#1{\@ifnextchar *{\@firstoftwo{#1}}}
definemacro("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}");

// latex's \textormath{#1}{#2} expands to #1 in text mode, #2 in math mode
definemacro("\\textormath", function(context) {
  const args = context.consumeargs(2);
  if (context.mode === "text") {
    return { tokens: args[0], numargs: 0 };
  } else {
    return { tokens: args[1], numargs: 0 };
  }
});

const stringfromarg = arg => {
  // reverse the order of the arg and return a string.
  let str = "";
  for (let i = arg.length - 1; i > -1; i--) {
    str += arg[i].text;
  }
  return str
};

// lookup table for parsing numbers in base 8 through 16
const digittonumber = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  a: 10,
  b: 11,
  b: 11,
  c: 12,
  c: 12,
  d: 13,
  d: 13,
  e: 14,
  e: 14,
  f: 15,
  f: 15
};

const nextcharnumber = context => {
  const numstr = context.future().text;
  if (numstr === "eof") { return [null, ""] }
  return [digittonumber[numstr.charat(0)], numstr]
};

const appendcharnumbers = (number, numstr, base) => {
  for (let i = 1; i < numstr.length; i++) {
    const digit = digittonumber[numstr.charat(i)];
    number *= base;
    number += digit;
  }
  return number
};

// tex \char makes a literal character (catcode 12) using the following forms:
// (see the texbook, p. 43)
//   \char123  -- decimal
//   \char'123 -- octal
//   \char"123 -- hex
//   \char`x   -- character that can be written (i.e. isn't active)
//   \char`\x  -- character that cannot be written (e.g. %)
// these all refer to characters from the font, so we turn them into special
// calls to a function \@char dealt with in the parser.
definemacro("\\char", function(context) {
  let token = context.poptoken();
  let base;
  let number = "";
  if (token.text === "'") {
    base = 8;
    token = context.poptoken();
  } else if (token.text === '"') {
    base = 16;
    token = context.poptoken();
  } else if (token.text === "`") {
    token = context.poptoken();
    if (token.text[0] === "\\") {
      number = token.text.charcodeat(1);
    } else if (token.text === "eof") {
      throw new parseerror("\\char` missing argument");
    } else {
      number = token.text.charcodeat(0);
    }
  } else {
    base = 10;
  }
  if (base) {
    // parse a number in the given base, starting with first `token`.
    let numstr = token.text;
    number = digittonumber[numstr.charat(0)];
    if (number == null || number >= base) {
      throw new parseerror(`invalid base-${base} digit ${token.text}`);
    }
    number = appendcharnumbers(number, numstr, base);
    let digit;
    [digit, numstr] = nextcharnumber(context);
    while (digit != null && digit < base) {
      number *= base;
      number += digit;
      number = appendcharnumbers(number, numstr, base);
      context.poptoken();
      [digit, numstr] = nextcharnumber(context);
    }
  }
  return `\\@char{${number}}`;
});

function recreateargstr(context) {
  // recreate the macro's original argument string from the array of parse tokens.
  const tokens = context.consumeargs(1)[0];
  let str = "";
  let expectedloc = tokens[tokens.length - 1].loc.start;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const actualloc = tokens[i].loc.start;
    if (actualloc > expectedloc) {
      // context.consumeargs has eaten a space.
      str += " ";
      expectedloc = actualloc;
    }
    str += tokens[i].text;
    expectedloc += tokens[i].text.length;
  }
  return str
}

// the latin modern font renders <mi>‚àö</mi> at the wrong vertical alignment.
// this macro provides a better rendering.
definemacro("\\surd", '\\sqrt{\\vphantom{|}}');

// see comment for \oplus in symbols.js.
definemacro("\u2295", "\\oplus");

// since temml has no \par, ignore \long.
definemacro("\\long", "");

//////////////////////////////////////////////////////////////////////
// grouping
// \let\bgroup={ \let\egroup=}
definemacro("\\bgroup", "{");
definemacro("\\egroup", "}");

// symbols from latex.ltx:
// \def~{\nobreakspace{}}
// \def\lq{`}
// \def\rq{'}
// \def \aa {\r a}
definemacro("~", "\\nobreakspace");
definemacro("\\lq", "`");
definemacro("\\rq", "'");
definemacro("\\aa", "\\r a");

definemacro("\\bbbk", "\\bbb{k}");

// \mathstrut from the texbook, p 360
definemacro("\\mathstrut", "\\vphantom{(}");

// \underbar from texbook p 353
definemacro("\\underbar", "\\underline{\\text{#1}}");

//////////////////////////////////////////////////////////////////////
// latex_2Óµ

// \vdots{\vbox{\baselineskip4\p@  \lineskiplimit\z@
// \kern6\p@\hbox{.}\hbox{.}\hbox{.}}}
// we'll call \varvdots, which gets a glyph from symbols.js.
// the zero-width rule gets us an equivalent to the vertical 6pt kern.
definemacro("\\vdots", "{\\varvdots\\rule{0pt}{15pt}}");
definemacro("\u22ee", "\\vdots");

// {array} environment gaps
definemacro("\\arraystretch", "1");     // line spacing factor times 12pt
definemacro("\\arraycolsep", "6pt");    // half the width separating columns

//////////////////////////////////////////////////////////////////////
// amsmath.sty
// http://mirrors.concertpass.com/tex-archive/macros/latex/required/amsmath/amsmath.pdf

//\newcommand{\substack}[1]{\subarray{c}#1\endsubarray}
definemacro("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");

// \def\iff{\dotsb\;\longleftrightarrow\;}
// \def\implies{\dotsb\;\longrightarrow\;}
// \def\impliedby{\dotsb\;\longleftarrow\;}
definemacro("\\iff", "\\dotsb\\;\\longleftrightarrow\\;");
definemacro("\\implies", "\\dotsb\\;\\longrightarrow\\;");
definemacro("\\impliedby", "\\dotsb\\;\\longleftarrow\\;");

// amsmath's automatic \dots, based on \mdots@@ macro.
const dotsbytoken = {
  ",": "\\dotsc",
  "\\not": "\\dotsb",
  // \keybin@ checks for the following:
  "+": "\\dotsb",
  "=": "\\dotsb",
  "<": "\\dotsb",
  ">": "\\dotsb",
  "-": "\\dotsb",
  "*": "\\dotsb",
  ":": "\\dotsb",
  // symbols whose definition starts with \dotsb:
  "\\dotsb": "\\dotsb",
  "\\coprod": "\\dotsb",
  "\\bigvee": "\\dotsb",
  "\\bigwedge": "\\dotsb",
  "\\biguplus": "\\dotsb",
  "\\bigcap": "\\dotsb",
  "\\bigcup": "\\dotsb",
  "\\prod": "\\dotsb",
  "\\sum": "\\dotsb",
  "\\bigotimes": "\\dotsb",
  "\\bigoplus": "\\dotsb",
  "\\bigodot": "\\dotsb",
  "\\bigsqcap": "\\dotsb",
  "\\bigsqcup": "\\dotsb",
  "\\bigtimes": "\\dotsb",
  "\\and": "\\dotsb",
  "\\longrightarrow": "\\dotsb",
  "\\longrightarrow": "\\dotsb",
  "\\longleftarrow": "\\dotsb",
  "\\longleftarrow": "\\dotsb",
  "\\longleftrightarrow": "\\dotsb",
  "\\longleftrightarrow": "\\dotsb",
  "\\mapsto": "\\dotsb",
  "\\longmapsto": "\\dotsb",
  "\\hookrightarrow": "\\dotsb",
  "\\doteq": "\\dotsb",
  // symbols whose definition starts with \mathbin:
  "\\mathbin": "\\dotsb",
  // symbols whose definition starts with \mathrel:
  "\\mathrel": "\\dotsb",
  "\\relbar": "\\dotsb",
  "\\relbar": "\\dotsb",
  "\\xrightarrow": "\\dotsb",
  "\\xleftarrow": "\\dotsb",
  // symbols whose definition starts with \dotsi:
  "\\dotsi": "\\dotsi",
  "\\int": "\\dotsi",
  "\\oint": "\\dotsi",
  "\\iint": "\\dotsi",
  "\\iiint": "\\dotsi",
  "\\iiiint": "\\dotsi",
  "\\idotsint": "\\dotsi",
  // symbols whose definition starts with \dotsx:
  "\\dotsx": "\\dotsx"
};

definemacro("\\dots", function(context) {
  // todo: if used in text mode, should expand to \textellipsis.
  // however, in temml, \textellipsis and \ldots behave the same
  // (in text mode), and it's unlikely we'd see any of the math commands
  // that affect the behavior of \dots when in text mode.  so fine for now
  // (until we support \ifmmode ... \else ... \fi).
  let thedots = "\\dotso";
  const next = context.expandafterfuture().text;
  if (next in dotsbytoken) {
    thedots = dotsbytoken[next];
  } else if (next.slice(0, 4) === "\\not") {
    thedots = "\\dotsb";
  } else if (next in symbols.math) {
    if (["bin", "rel"].includes(symbols.math[next].group)) {
      thedots = "\\dotsb";
    }
  }
  return thedots;
});

const spaceafterdots = {
  // \rightdelim@ checks for the following:
  ")": true,
  "]": true,
  "\\rbrack": true,
  "\\}": true,
  "\\rbrace": true,
  "\\rangle": true,
  "\\rceil": true,
  "\\rfloor": true,
  "\\rgroup": true,
  "\\rmoustache": true,
  "\\right": true,
  "\\bigr": true,
  "\\biggr": true,
  "\\bigr": true,
  "\\biggr": true,
  // \extra@ also tests for the following:
  $: true,
  // \extrap@ checks for the following:
  ";": true,
  ".": true,
  ",": true
};

definemacro("\\dotso", function(context) {
  const next = context.future().text;
  if (next in spaceafterdots) {
    return "\\ldots\\,";
  } else {
    return "\\ldots";
  }
});

definemacro("\\dotsc", function(context) {
  const next = context.future().text;
  // \dotsc uses \extra@ but not \extrap@, instead specially checking for
  // ';' and '.', but doesn't check for ','.
  if (next in spaceafterdots && next !== ",") {
    return "\\ldots\\,";
  } else {
    return "\\ldots";
  }
});

definemacro("\\cdots", function(context) {
  const next = context.future().text;
  if (next in spaceafterdots) {
    return "\\@cdots\\,";
  } else {
    return "\\@cdots";
  }
});

definemacro("\\dotsb", "\\cdots");
definemacro("\\dotsm", "\\cdots");
definemacro("\\dotsi", "\\!\\cdots");
definemacro("\\idotsint", "\\dotsi");
// amsmath doesn't actually define \dotsx, but \dots followed by a macro
// starting with \dotsx implies \dotso, and then \extra@ detects this case
// and forces the added `\,`.
definemacro("\\dotsx", "\\ldots\\,");

// \let\dotsi\relax
// \let\dotsb\relax
// \let\dotsx\relax
definemacro("\\dotsi", "\\relax");
definemacro("\\dotsb", "\\relax");
definemacro("\\dotsx", "\\relax");

// spacing, based on amsmath.sty's override of latex defaults
// \declarerobustcommand{\tmspace}[3]{%
//   \ifmmode\mskip#1#2\else\kern#1#3\fi\relax}
definemacro("\\tmspace", "\\textormath{\\kern#1#3}{\\mskip#1#2}\\relax");
// \renewcommand{\,}{\tmspace+\thinmuskip{.1667em}}
// todo: math mode should use \thinmuskip
definemacro("\\,", "{\\tmspace+{3mu}{.1667em}}");
// \let\thinspace\,
definemacro("\\thinspace", "\\,");
// \def\>{\mskip\medmuskip}
// \renewcommand{\:}{\tmspace+\medmuskip{.2222em}}
// todo: \> and math mode of \: should use \medmuskip = 4mu plus 2mu minus 4mu
definemacro("\\>", "\\mskip{4mu}");
definemacro("\\:", "{\\tmspace+{4mu}{.2222em}}");
// \let\medspace\:
definemacro("\\medspace", "\\:");
// \renewcommand{\;}{\tmspace+\thickmuskip{.2777em}}
// todo: math mode should use \thickmuskip = 5mu plus 5mu
definemacro("\\;", "{\\tmspace+{5mu}{.2777em}}");
// \let\thickspace\;
definemacro("\\thickspace", "\\;");
// \renewcommand{\!}{\tmspace-\thinmuskip{.1667em}}
// todo: math mode should use \thinmuskip
definemacro("\\!", "{\\tmspace-{3mu}{.1667em}}");
// \let\negthinspace\!
definemacro("\\negthinspace", "\\!");
// \newcommand{\negmedspace}{\tmspace-\medmuskip{.2222em}}
// todo: math mode should use \medmuskip
definemacro("\\negmedspace", "{\\tmspace-{4mu}{.2222em}}");
// \newcommand{\negthickspace}{\tmspace-\thickmuskip{.2777em}}
// todo: math mode should use \thickmuskip
definemacro("\\negthickspace", "{\\tmspace-{5mu}{.277em}}");
// \def\enspace{\kern.5em }
definemacro("\\enspace", "\\kern.5em ");
// \def\enskip{\hskip.5em\relax}
definemacro("\\enskip", "\\hskip.5em\\relax");
// \def\quad{\hskip1em\relax}
definemacro("\\quad", "\\hskip1em\\relax");
// \def\qquad{\hskip2em\relax}
definemacro("\\qquad", "\\hskip2em\\relax");

definemacro("\\aa", "\\textormath{\\angstrom}{\\mathring{a}}\\relax");

// \tag@in@display form of \tag
definemacro("\\tag", "\\@ifstar\\tag@literal\\tag@paren");
definemacro("\\tag@paren", "\\tag@literal{({#1})}");
definemacro("\\tag@literal", (context) => {
  if (context.macros.get("\\df@tag")) {
    throw new parseerror("multiple \\tag");
  }
  return "\\gdef\\df@tag{\\text{#1}}";
});
definemacro("\\notag", "\\nonumber");
definemacro("\\nonumber", "\\gdef\\@eqnsw{0}");

// \renewcommand{\bmod}{\nonscript\mskip-\medmuskip\mkern5mu\mathbin
//   {\operator@font mod}\penalty900
//   \mkern5mu\nonscript\mskip-\medmuskip}
// \newcommand{\pod}[1]{\allowbreak
//   \if@display\mkern18mu\else\mkern8mu\fi(#1)}
// \renewcommand{\pmod}[1]{\pod{{\operator@font mod}\mkern6mu#1}}
// \newcommand{\mod}[1]{\allowbreak\if@display\mkern18mu
//   \else\mkern12mu\fi{\operator@font mod}\,\,#1}
// todo: math mode should use \medmuskip = 4mu plus 2mu minus 4mu
definemacro("\\bmod", "\\mathbin{\\text{mod}}");
definemacro(
  "\\pod",
  "\\allowbreak" + "\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)"
);
definemacro("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}");
definemacro(
  "\\mod",
  "\\allowbreak" +
    "\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}" +
    "{\\rm mod}\\,\\,#1"
);

//////////////////////////////////////////////////////////////////////
// latex source2e

// \expandafter\let\expandafter\@normalcr
//     \csname\expandafter\@gobble\string\\ \endcsname
// \declarerobustcommand\newline{\@normalcr\relax}
definemacro("\\newline", "\\\\\\relax");

// \def\tex{t\kern-.1667em\lower.5ex\hbox{e}\kern-.125emx\@}
// todo: doesn't normally work in math mode because \@ fails.
definemacro("\\tex", "\\textrm{t}\\kern-.1667em\\raisebox{-.5ex}{e}\\kern-.125em\\textrm{x}");

definemacro(
  "\\latex",
    "\\textrm{l}\\kern-.35em\\raisebox{0.2em}{\\scriptstyle a}\\kern-.15em\\tex"
);

definemacro(
  "\\temml",
  // eslint-disable-next-line max-len
  "\\textrm{t}\\kern-0.2em\\lower{0.2em}{\\textrm{e}}\\kern-0.08em{\\textrm{m}\\kern-0.08em\\raise{0.2em}\\textrm{m}\\kern-0.08em\\textrm{l}}"
);

// \declarerobustcommand\hspace{\@ifstar\@hspacer\@hspace}
// \def\@hspace#1{\hskip  #1\relax}
// \def\@hspacer#1{\vrule \@width\z@\nobreak
//                 \hskip #1\hskip \z@skip}
definemacro("\\hspace", "\\@ifstar\\@hspacer\\@hspace");
definemacro("\\@hspace", "\\hskip #1\\relax");
definemacro("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax");

definemacro("\\colon", `\\mathpunct{\\char"3a}`);

//////////////////////////////////////////////////////////////////////
// mathtools.sty

definemacro("\\prescript", "\\pres@cript{_{#1}^{#2}}{}{#3}");

//\providecommand\ordinarycolon{:}
definemacro("\\ordinarycolon", `\\char"3a`);
// raise to center on the math axis, as closely as possible.
definemacro("\\vcentcolon", "\\mathrel{\\raisebox{0.035em}{\\ordinarycolon}}");
// \providecommand*\coloneq{\vcentcolon\mathrel{\mkern-1.2mu}\mathrel{-}}
definemacro("\\coloneq", '\\mathrel{\\raisebox{0.035em}{\\ordinarycolon}\\char"2212}');
// \providecommand*\coloneq{\dblcolon\mathrel{\mkern-1.2mu}\mathrel{-}}
definemacro("\\coloneq", '\\mathrel{\\char"2237\\char"2212}');
// \providecommand*\eqqcolon{=\mathrel{\mkern-1.2mu}\dblcolon}
definemacro("\\eqqcolon", '\\mathrel{\\char"3d\\char"2237}');
// \providecommand*\eqcolon{\mathrel{-}\mathrel{\mkern-1.2mu}\dblcolon}
definemacro("\\eqcolon", '\\mathrel{\\char"2212\\char"2237}');
// \providecommand*\colonapprox{\vcentcolon\mathrel{\mkern-1.2mu}\approx}
definemacro("\\colonapprox", '\\mathrel{\\raisebox{0.035em}{\\ordinarycolon}\\char"2248}');
// \providecommand*\colonapprox{\dblcolon\mathrel{\mkern-1.2mu}\approx}
definemacro("\\colonapprox", '\\mathrel{\\char"2237\\char"2248}');
// \providecommand*\colonsim{\vcentcolon\mathrel{\mkern-1.2mu}\sim}
definemacro("\\colonsim", '\\mathrel{\\raisebox{0.035em}{\\ordinarycolon}\\char"223c}');
// \providecommand*\colonsim{\dblcolon\mathrel{\mkern-1.2mu}\sim}
definemacro("\\colonsim", '\\mathrel{\\raisebox{0.035em}{\\ordinarycolon}\\char"223c}');

//////////////////////////////////////////////////////////////////////
// colonequals.sty

// alternate names for mathtools's macros:
definemacro("\\ratio", "\\vcentcolon");
definemacro("\\coloncolon", "\\dblcolon");
definemacro("\\colonequals", "\\coloneqq");
definemacro("\\coloncolonequals", "\\coloneqq");
definemacro("\\equalscolon", "\\eqqcolon");
definemacro("\\equalscoloncolon", "\\eqqcolon");
definemacro("\\colonminus", "\\coloneq");
definemacro("\\coloncolonminus", "\\coloneq");
definemacro("\\minuscolon", "\\eqcolon");
definemacro("\\minuscoloncolon", "\\eqcolon");
// \colonapprox name is same in mathtools and colonequals.
definemacro("\\coloncolonapprox", "\\colonapprox");
// \colonsim name is same in mathtools and colonequals.
definemacro("\\coloncolonsim", "\\colonsim");

// present in newtxmath, pxfonts and txfonts
definemacro("\\notni", "\\mathrel{\\char`\u220c}");
definemacro("\\limsup", "\\dotsb\\operatorname*{lim\\,sup}");
definemacro("\\liminf", "\\dotsb\\operatorname*{lim\\,inf}");

//////////////////////////////////////////////////////////////////////
// from amsopn.sty
definemacro("\\injlim", "\\dotsb\\operatorname*{inj\\,lim}");
definemacro("\\projlim", "\\dotsb\\operatorname*{proj\\,lim}");
definemacro("\\varlimsup", "\\dotsb\\operatorname*{\\overline{\\text{lim}}}");
definemacro("\\varliminf", "\\dotsb\\operatorname*{\\underline{\\text{lim}}}");
definemacro("\\varinjlim", "\\dotsb\\operatorname*{\\underrightarrow{\\text{lim}}}");
definemacro("\\varprojlim", "\\dotsb\\operatorname*{\\underleftarrow{\\text{lim}}}");

definemacro("\\centerdot", "{\\medspace\\rule{0.167em}{0.189em}\\medspace}");

//////////////////////////////////////////////////////////////////////
// statmath.sty
// https://ctan.math.illinois.edu/macros/latex/contrib/statmath/statmath.pdf

definemacro("\\argmin", "\\dotsb\\operatorname*{arg\\,min}");
definemacro("\\argmax", "\\dotsb\\operatorname*{arg\\,max}");
definemacro("\\plim", "\\dotsb\\operatorname*{plim}");

//////////////////////////////////////////////////////////////////////
// mnsymbol.sty

definemacro("\\leftmodels", "\\mathop{\\reflectbox{$\\models$}}");

//////////////////////////////////////////////////////////////////////
// braket.sty
// http://ctan.math.washington.edu/tex-archive/macros/latex/contrib/braket/braket.pdf

definemacro("\\bra", "\\mathinner{\\langle{#1}|}");
definemacro("\\ket", "\\mathinner{|{#1}\\rangle}");
definemacro("\\braket", "\\mathinner{\\langle{#1}\\rangle}");
definemacro("\\bra", "\\left\\langle#1\\right|");
definemacro("\\ket", "\\left|#1\\right\\rangle");
// a helper for \braket and \set
const replacevert = (argstr, match) => {
  const ch = match[0] === "|" ? "\\vert" : "\\vert";
  const replacestr = `}\\,\\middle${ch}\\,{`;
  return argstr.slice(0, match.index) + replacestr + argstr.slice(match.index + match[0].length)
};
definemacro("\\braket",  function(context) {
  let argstr = recreateargstr(context);
  const regex = /\|\||\||\\\|/g;
  let match;
  while ((match = regex.exec(argstr)) !== null) {
    argstr = replacevert(argstr, match);
  }
  return "\\left\\langle{" + argstr + "}\\right\\rangle"
});
definemacro("\\set",  function(context) {
  let argstr = recreateargstr(context);
  const match = /\|\||\||\\\|/.exec(argstr);
  if (match) {
    argstr = replacevert(argstr, match);
  }
  return "\\left\\{\\:{" + argstr + "}\\:\\right\\}"
});
definemacro("\\set",  function(context) {
  const argstr = recreateargstr(context);
  return "\\{{" + argstr.replace(/\|/, "}\\mid{") + "}\\}"
});

//////////////////////////////////////////////////////////////////////
// actuarialangle.dtx
definemacro("\\angln", "{\\angl n}");

//////////////////////////////////////////////////////////////////////
// derivative.sty
definemacro("\\odv", "\\@ifstar\\odv@next\\odv@numerator");
definemacro("\\odv@numerator", "\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}");
definemacro("\\odv@next", "\\frac{\\mathrm{d}}{\\mathrm{d}#2}#1");
definemacro("\\pdv", "\\@ifstar\\pdv@next\\pdv@numerator");

const pdvhelper = args => {
  const numerator = args[0][0].text;
  const denoms = stringfromarg(args[1]).split(",");
  const power = string(denoms.length);
  const numop = power === "1" ? "\\partial" : `\\partial^${power}`;
  let denominator = "";
  denoms.map(e => { denominator += "\\partial " + e.trim() +  "\\,";});
  return [numerator, numop,  denominator.replace(/\\,$/, "")]
};
definemacro("\\pdv@numerator", function(context) {
  const [numerator, numop, denominator] = pdvhelper(context.consumeargs(2));
  return `\\frac{${numop} ${numerator}}{${denominator}}`
});
definemacro("\\pdv@next", function(context) {
  const [numerator, numop, denominator] = pdvhelper(context.consumeargs(2));
  return `\\frac{${numop}}{${denominator}} ${numerator}`
});

//////////////////////////////////////////////////////////////////////
// upgreek.dtx
definemacro("\\upalpha", "\\up@greek{\\alpha}");
definemacro("\\upbeta", "\\up@greek{\\beta}");
definemacro("\\upgamma", "\\up@greek{\\gamma}");
definemacro("\\updelta", "\\up@greek{\\delta}");
definemacro("\\upepsilon", "\\up@greek{\\epsilon}");
definemacro("\\upzeta", "\\up@greek{\\zeta}");
definemacro("\\upeta", "\\up@greek{\\eta}");
definemacro("\\uptheta", "\\up@greek{\\theta}");
definemacro("\\upiota", "\\up@greek{\\iota}");
definemacro("\\upkappa", "\\up@greek{\\kappa}");
definemacro("\\uplambda", "\\up@greek{\\lambda}");
definemacro("\\upmu", "\\up@greek{\\mu}");
definemacro("\\upnu", "\\up@greek{\\nu}");
definemacro("\\upxi", "\\up@greek{\\xi}");
definemacro("\\upomicron", "\\up@greek{\\omicron}");
definemacro("\\uppi", "\\up@greek{\\pi}");
definemacro("\\upalpha", "\\up@greek{\\alpha}");
definemacro("\\uprho", "\\up@greek{\\rho}");
definemacro("\\upsigma", "\\up@greek{\\sigma}");
definemacro("\\uptau", "\\up@greek{\\tau}");
definemacro("\\upupsilon", "\\up@greek{\\upsilon}");
definemacro("\\upphi", "\\up@greek{\\phi}");
definemacro("\\upchi", "\\up@greek{\\chi}");
definemacro("\\uppsi", "\\up@greek{\\psi}");
definemacro("\\upomega", "\\up@greek{\\omega}");

//////////////////////////////////////////////////////////////////////
// cmll package
definemacro("\\invamp", '\\mathbin{\\char"214b}');
definemacro("\\parr", '\\mathbin{\\char"214b}');
definemacro("\\with", '\\mathbin{\\char"26}');
definemacro("\\multimapinv", '\\mathrel{\\char"27dc}');
definemacro("\\multimapboth", '\\mathrel{\\char"29df}');
definemacro("\\scoh", '{\\mkern5mu\\char"2322\\mkern5mu}');
definemacro("\\sincoh", '{\\mkern5mu\\char"2323\\mkern5mu}');
definemacro("\\coh", `{\\mkern5mu\\rule{}{0.7em}\\mathrlap{\\smash{\\raise2mu{\\char"2322}}}
{\\smash{\\lower4mu{\\char"2323}}}\\mkern5mu}`);
definemacro("\\incoh", `{\\mkern5mu\\rule{}{0.7em}\\mathrlap{\\smash{\\raise2mu{\\char"2323}}}
{\\smash{\\lower4mu{\\char"2322}}}\\mkern5mu}`);


//////////////////////////////////////////////////////////////////////
// chemstyle package
definemacro("\\standardstate", "\\text{\\tiny\\char`‚¶µ}");

Ôªø/* eslint-disable */
/* -*- mode: javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  temml mhchem.js
 *
 *  this file implements a temml version of mhchem version 3.3.0.
 *  it is adapted from mathjax/extensions/tex/mhchem.js
 *  it differs from the mathjax version as follows:
 *    1. the interface is changed so that it can be called from temml, not mathjax.
 *    2. \rlap and \llap are replaced with \mathrlap and \mathllap.
 *    3. the reaction arrow code is simplified. all reaction arrows are rendered
 *       using temml extensible arrows instead of building non-extensible arrows.
 *    4. the ~bond forms are composed entirely of \rule elements.
 *    5. two dashes in _getbond are wrapped in braces to suppress spacing. i.e., {-}
 *    6. the electron dot uses \textbullet instead of \bullet.
 *    7. \smash[t] has been removed. (webkit hides anything inside \smash{‚Ä¶})
 *
 *    this code, as other temml code, is released under the mit license.
 * 
 * /*************************************************************
 *
 *  mathjax/extensions/tex/mhchem.js
 *
 *  implements the \ce command for handling chemical formulas
 *  from the mhchem latex package.
 *
 *  ---------------------------------------------------------------------
 *
 *  copyright (c) 2011-2015 the mathjax consortium
 *  copyright (c) 2015-2018 martin hensel
 *
 *  licensed under the apache license, version 2.0 (the "license");
 *  you may not use this file except in compliance with the license.
 *  you may obtain a copy of the license at
 *
 *      http://www.apache.org/licenses/license-2.0
 *
 *  unless required by applicable law or agreed to in writing, software
 *  distributed under the license is distributed on an "as is" basis,
 *  without warranties or conditions of any kind, either express or implied.
 *  see the license for the specific language governing permissions and
 *  limitations under the license.
 */

//
// coding style
//   - use '' for identifiers that can by minified/uglified
//   - use "" for strings that need to stay untouched

// version: "3.3.0" for mathjax and temml


// add \ce, \pu, and \tripledash to the temml macros.

definemacro("\\ce", function(context) {
  return chemparse(context.consumeargs(1)[0], "ce")
});

definemacro("\\pu", function(context) {
  return chemparse(context.consumeargs(1)[0], "pu");
});

// math fonts do not include glyphs for the ~ form of bonds. so we'll send path geometry
// so we'll compose characters built from \rule elements.
definemacro("\\unidash", `{\\rule{0.672em}{0.06em}}`)
definemacro("\\tridash", `{\\rule{0.15em}{0.06em}\\kern2mu\\rule{0.15em}{0.06em}\\kern2mu\\rule{0.15em}{0.06em}}`)
definemacro("\\tripledash", `\\kern0.075em\\raise0.25em{\\tridash}\\kern0.075em`)
definemacro("\\tripledashoverline", `\\kern0.075em\\mathrlap{\\raise0.125em{\\unidash}}\\raise0.34em{\\tridash}\\kern0.075em`)
definemacro("\\tripledashoverdoubleline", `\\kern0.075em\\mathrlap{\\mathrlap{\\raise0.48em{\\tridash}}\\raise0.27em{\\unidash}}{\\raise0.05em{\\unidash}}\\kern0.075em`)
definemacro("\\tripledashbetweendoubleline", `\\kern0.075em\\mathrlap{\\mathrlap{\\raise0.48em{\\unidash}}\\raise0.27em{\\tridash}}{\\raise0.05em{\\unidash}}\\kern0.075em`)

  //
  //  this is the main function for handing the \ce and \pu commands.
  //  it takes the argument to \ce or \pu and returns the corresponding tex string.
  //

  var chemparse = function (tokens, statemachine) {
    // recreate the argument string from temml's array of tokens.
    var str = "";
    var expectedloc = tokens.length && tokens[tokens.length - 1].loc.start
    for (var i = tokens.length - 1; i >= 0; i--) {
      if(tokens[i].loc.start > expectedloc) {
        // context.consumeargs has eaten a space.
        str += " ";
        expectedloc = tokens[i].loc.start;
      }
      str += tokens[i].text;
      expectedloc += tokens[i].text.length;
    }
    // call the mhchem core parser.
    var tex = texify.go(mhchemparser.go(str, statemachine));
    return tex;
  };

  //
  // core parser for mhchem syntax  (recursive)
  //
  /** @type {mhchemparser} */
  var mhchemparser = {
    //
    // parses mchem \ce syntax
    //
    // call like
    //   go("h2o");
    //
    go: function (input, statemachine) {
      if (!input) { return []; }
      if (statemachine === undefined) { statemachine = 'ce'; }
      var state = '0';

      //
      // string buffers for parsing:
      //
      // buffer.a == amount
      // buffer.o == element
      // buffer.b == left-side superscript
      // buffer.p == left-side subscript
      // buffer.q == right-side subscript
      // buffer.d == right-side superscript
      //
      // buffer.r == arrow
      // buffer.rdt == arrow, script above, type
      // buffer.rd == arrow, script above, content
      // buffer.rqt == arrow, script below, type
      // buffer.rq == arrow, script below, content
      //
      // buffer.text_
      // buffer.rm
      // etc.
      //
      // buffer.parenthesislevel == int, starting at 0
      // buffer.sb == bool, space before
      // buffer.beginswithbond == bool
      //
      // these letters are also used as state names.
      //
      // other states:
      // 0 == begin of main part (arrow/operator unlikely)
      // 1 == next entity
      // 2 == next entity (arrow/operator unlikely)
      // 3 == next atom
      // c == macro
      //
      /** @type {buffer} */
      var buffer = {};
      buffer['parenthesislevel'] = 0;

      input = input.replace(/\n/g, " ");
      input = input.replace(/[\u2212\u2013\u2014\u2010]/g, "-");
      input = input.replace(/[\u2026]/g, "...");

      //
      // looks through mhchemparser.transitions, to execute a matching action
      // (recursive)
      //
      var lastinput;
      var watchdog = 10;
      /** @type {parseroutput[]} */
      var output = [];
      while (true) {
        if (lastinput !== input) {
          watchdog = 10;
          lastinput = input;
        } else {
          watchdog--;
        }
        //
        // find actions in transition table
        //
        var machine = mhchemparser.statemachines[statemachine];
        var t = machine.transitions[state] || machine.transitions['*'];
        iteratetransitions:
        for (var i=0; i<t.length; i++) {
          var matches = mhchemparser.patterns.match_(t[i].pattern, input);
          if (matches) {
            //
            // execute actions
            //
            var task = t[i].task;
            for (var ia=0; ia<task.action_.length; ia++) {
              var o;
              //
              // find and execute action
              //
              if (machine.actions[task.action_[ia].type_]) {
                o = machine.actions[task.action_[ia].type_](buffer, matches.match_, task.action_[ia].option);
              } else if (mhchemparser.actions[task.action_[ia].type_]) {
                o = mhchemparser.actions[task.action_[ia].type_](buffer, matches.match_, task.action_[ia].option);
              } else {
                throw ["mhchembuga", "mhchem bug a. please report. (" + task.action_[ia].type_ + ")"];  // trying to use non-existing action
              }
              //
              // add output
              //
              mhchemparser.concatarray(output, o);
            }
            //
            // set next state,
            // shorten input,
            // continue with next character
            //   (= apply only one transition per position)
            //
            state = task.nextstate || state;
            if (input.length > 0) {
              if (!task.revisit) {
                input = matches.remainder;
              }
              if (!task.tocontinue) {
                break iteratetransitions;
              }
            } else {
              return output;
            }
          }
        }
        //
        // prevent infinite loop
        //
        if (watchdog <= 0) {
          throw ["mhchembugu", "mhchem bug u. please report."];  // unexpected character
        }
      }
    },
    concatarray: function (a, b) {
      if (b) {
        if (array.isarray(b)) {
          for (var ib=0; ib<b.length; ib++) {
            a.push(b[ib]);
          }
        } else {
          a.push(b);
        }
      }
    },

    patterns: {
      //
      // matching patterns
      // either regexps or function that return null or {match_:"a", remainder:"bc"}
      //
      patterns: {
        // property names must not look like integers ("2") for correct property traversal order, later on
        'empty': /^$/,
        'else': /^./,
        'else2': /^./,
        'space': /^\s/,
        'space a': /^\s(?=[a-z\\$])/,
        'space$': /^\s$/,
        'a-z': /^[a-z]/,
        'x': /^x/,
        'x$': /^x$/,
        'i$': /^i$/,
        'letters': /^(?:[a-za-z\u03b1-\u03c9\u0391-\u03a9?@]|(?:\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|gamma|delta|theta|lambda|xi|pi|sigma|upsilon|phi|psi|omega)(?:\s+|\{\}|(?![a-za-z]))))+/,
        '\\greek': /^\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|gamma|delta|theta|lambda|xi|pi|sigma|upsilon|phi|psi|omega)(?:\s+|\{\}|(?![a-za-z]))/,
        'one lowercase latin letter $': /^(?:([a-z])(?:$|[^a-za-z]))$/,
        '$one lowercase latin letter$ $': /^\$(?:([a-z])(?:$|[^a-za-z]))\$$/,
        'one lowercase greek letter $': /^(?:\$?[\u03b1-\u03c9]\$?|\$?\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)\s*\$?)(?:\s+|\{\}|(?![a-za-z]))$/,
        'digits': /^[0-9]+/,
        '-9.,9': /^[+\-]?(?:[0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))/,
        '-9.,9 no missing 0': /^[+\-]?[0-9]+(?:[.,][0-9]+)?/,
        '(-)(9.,9)(e)(99)': function (input) {
          var m = input.match(/^(\+\-|\+\/\-|\+|\-|\\pm\s?)?([0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))?(\((?:[0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))\))?(?:([ee]|\s*(\*|x|\\times|\u00d7)\s*10\^)([+\-]?[0-9]+|\{[+\-]?[0-9]+\}))?/);
          if (m && m[0]) {
            return { match_: m.splice(1), remainder: input.substr(m[0].length) };
          }
          return null;
        },
        '(-)(9)^(-9)': function (input) {
          var m = input.match(/^(\+\-|\+\/\-|\+|\-|\\pm\s?)?([0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+)?)\^([+\-]?[0-9]+|\{[+\-]?[0-9]+\})/);
          if (m && m[0]) {
            return { match_: m.splice(1), remainder: input.substr(m[0].length) };
          }
          return null;
        },
        'state of aggregation $': function (input) {  // ... or crystal system
          var a = mhchemparser.patterns.findobservegroups(input, "", /^\([a-z]{1,3}(?=[\),])/, ")", "");  // (aq), (aq,$\infty$), (aq, sat)
          if (a  &&  a.remainder.match(/^($|[\s,;\)\]\}])/)) { return a; }  //  and end of 'phrase'
          var m = input.match(/^(?:\((?:\\ca\s?)?\$[amothc]\$\))/);  // or crystal system ($o$) (\ca$c$)
          if (m) {
            return { match_: m[0], remainder: input.substr(m[0].length) };
          }
          return null;
        },
        '_{(state of aggregation)}$': /^_\{(\([a-z]{1,3}\))\}/,
        '{[(': /^(?:\\\{|\[|\()/,
        ')]}': /^(?:\)|\]|\\\})/,
        ', ': /^[,;]\s*/,
        ',': /^[,;]/,
        '.': /^[.]/,
        '. ': /^([.\u22c5\u00b7\u2022])\s*/,
        '...': /^\.\.\.(?=$|[^.])/,
        '* ': /^([*])\s*/,
        '^{(...)}': function (input) { return mhchemparser.patterns.findobservegroups(input, "^{", "", "", "}"); },
        '^($...$)': function (input) { return mhchemparser.patterns.findobservegroups(input, "^", "$", "$", ""); },
        '^a': /^\^([0-9]+|[^\\_])/,
        '^\\x{}{}': function (input) { return mhchemparser.patterns.findobservegroups(input, "^", /^\\[a-za-z]+\{/, "}", "", "", "{", "}", "", true); },
        '^\\x{}': function (input) { return mhchemparser.patterns.findobservegroups(input, "^", /^\\[a-za-z]+\{/, "}", ""); },
        '^\\x': /^\^(\\[a-za-z]+)\s*/,
        '^(-1)': /^\^(-?\d+)/,
        '\'': /^'/,
        '_{(...)}': function (input) { return mhchemparser.patterns.findobservegroups(input, "_{", "", "", "}"); },
        '_($...$)': function (input) { return mhchemparser.patterns.findobservegroups(input, "_", "$", "$", ""); },
        '_9': /^_([+\-]?[0-9]+|[^\\])/,
        '_\\x{}{}': function (input) { return mhchemparser.patterns.findobservegroups(input, "_", /^\\[a-za-z]+\{/, "}", "", "", "{", "}", "", true); },
        '_\\x{}': function (input) { return mhchemparser.patterns.findobservegroups(input, "_", /^\\[a-za-z]+\{/, "}", ""); },
        '_\\x': /^_(\\[a-za-z]+)\s*/,
        '^_': /^(?:\^(?=_)|\_(?=\^)|[\^_]$)/,
        '{}': /^\{\}/,
        '{...}': function (input) { return mhchemparser.patterns.findobservegroups(input, "", "{", "}", ""); },
        '{(...)}': function (input) { return mhchemparser.patterns.findobservegroups(input, "{", "", "", "}"); },
        '$...$': function (input) { return mhchemparser.patterns.findobservegroups(input, "", "$", "$", ""); },
        '${(...)}$': function (input) { return mhchemparser.patterns.findobservegroups(input, "${", "", "", "}$"); },
        '$(...)$': function (input) { return mhchemparser.patterns.findobservegroups(input, "$", "", "", "$"); },
        '=<>': /^[=<>]/,
        '#': /^[#\u2261]/,
        '+': /^\+/,
        '-$': /^-(?=[\s_},;\]/]|$|\([a-z]+\))/,  // -space -, -; -] -/ -$ -state-of-aggregation
        '-9': /^-(?=[0-9])/,
        '- orbital overlap': /^-(?=(?:[spd]|sp)(?:$|[\s,;\)\]\}]))/,
        '-': /^-/,
        'pm-operator': /^(?:\\pm|\$\\pm\$|\+-|\+\/-)/,
        'operator': /^(?:\+|(?:[\-=<>]|<<|>>|\\approx|\$\\approx\$)(?=\s|$|-?[0-9]))/,
        'arrowupdown': /^(?:v|\(v\)|\^|\(\^\))(?=$|[\s,;\)\]\}])/,
        '\\bond{(...)}': function (input) { return mhchemparser.patterns.findobservegroups(input, "\\bond{", "", "", "}"); },
        '->': /^(?:<->|<-->|->|<-|<=>>|<<=>|<=>|[\u2192\u27f6\u21cc])/,
        'cmt': /^[cmt](?=\[)/,
        '[(...)]': function (input) { return mhchemparser.patterns.findobservegroups(input, "[", "", "", "]"); },
        '1st-level escape': /^(&|\\\\|\\hline)\s*/,
        '\\,': /^(?:\\[,\ ;:])/,  // \\x - but output no space before
        '\\x{}{}': function (input) { return mhchemparser.patterns.findobservegroups(input, "", /^\\[a-za-z]+\{/, "}", "", "", "{", "}", "", true); },
        '\\x{}': function (input) { return mhchemparser.patterns.findobservegroups(input, "", /^\\[a-za-z]+\{/, "}", ""); },
        '\\ca': /^\\ca(?:\s+|(?![a-za-z]))/,
        '\\x': /^(?:\\[a-za-z]+\s*|\\[_&{}%])/,
        'orbital': /^(?:[0-9]{1,2}[spdfgh]|[0-9]{0,2}sp)(?=$|[^a-za-z])/,  // only those with numbers in front, because the others will be formatted correctly anyway
        'others': /^[\/~|]/,
        '\\frac{(...)}': function (input) { return mhchemparser.patterns.findobservegroups(input, "\\frac{", "", "", "}", "{", "", "", "}"); },
        '\\overset{(...)}': function (input) { return mhchemparser.patterns.findobservegroups(input, "\\overset{", "", "", "}", "{", "", "", "}"); },
        '\\underset{(...)}': function (input) { return mhchemparser.patterns.findobservegroups(input, "\\underset{", "", "", "}", "{", "", "", "}"); },
        '\\underbrace{(...)}': function (input) { return mhchemparser.patterns.findobservegroups(input, "\\underbrace{", "", "", "}_", "{", "", "", "}"); },
        '\\color{(...)}0': function (input) { return mhchemparser.patterns.findobservegroups(input, "\\color{", "", "", "}"); },
        '\\color{(...)}{(...)}1': function (input) { return mhchemparser.patterns.findobservegroups(input, "\\color{", "", "", "}", "{", "", "", "}"); },
        '\\color(...){(...)}2': function (input) { return mhchemparser.patterns.findobservegroups(input, "\\color", "\\", "", /^(?=\{)/, "{", "", "", "}"); },
        '\\ce{(...)}': function (input) { return mhchemparser.patterns.findobservegroups(input, "\\ce{", "", "", "}"); },
        'oxidation$': /^(?:[+-][ivx]+|\\pm\s*0|\$\\pm\$\s*0)$/,
        'd-oxidation$': /^(?:[+-]?\s?[ivx]+|\\pm\s*0|\$\\pm\$\s*0)$/,  // 0 could be oxidation or charge
        'roman numeral': /^[ivx]+/,
        '1/2$': /^[+\-]?(?:[0-9]+|\$[a-z]\$|[a-z])\/[0-9]+(?:\$[a-z]\$|[a-z])?$/,
        'amount': function (input) {
          var match;
          // e.g. 2, 0.5, 1/2, -2, n/2, +;  $a$ could be added later in parsing
          match = input.match(/^(?:(?:(?:\([+\-]?[0-9]+\/[0-9]+\)|[+\-]?(?:[0-9]+|\$[a-z]\$|[a-z])\/[0-9]+|[+\-]?[0-9]+[.,][0-9]+|[+\-]?\.[0-9]+|[+\-]?[0-9]+)(?:[a-z](?=\s*[a-z]))?)|[+\-]?[a-z](?=\s*[a-z])|\+(?!\s))/);
          if (match) {
            return { match_: match[0], remainder: input.substr(match[0].length) };
          }
          var a = mhchemparser.patterns.findobservegroups(input, "", "$", "$", "");
          if (a) {  // e.g. $2n-1$, $-$
            match = a.match_.match(/^\$(?:\(?[+\-]?(?:[0-9]*[a-z]?[+\-])?[0-9]*[a-z](?:[+\-][0-9]*[a-z]?)?\)?|\+|-)\$$/);
            if (match) {
              return { match_: match[0], remainder: input.substr(match[0].length) };
            }
          }
          return null;
        },
        'amount2': function (input) { return this['amount'](input); },
        '(kv letters),': /^(?:[a-z][a-z]{0,2}|i)(?=,)/,
        'formula$': function (input) {
          if (input.match(/^\([a-z]+\)$/)) { return null; }  // state of aggregation = no formula
          var match = input.match(/^(?:[a-z]|(?:[0-9\ \+\-\,\.\(\)]+[a-z])+[0-9\ \+\-\,\.\(\)]*|(?:[a-z][0-9\ \+\-\,\.\(\)]+)+[a-z]?)$/);
          if (match) {
            return { match_: match[0], remainder: input.substr(match[0].length) };
          }
          return null;
        },
        'uprightentities': /^(?:ph|poh|pc|pk|ipr|ibu)(?=$|[^a-za-z])/,
        '/': /^\s*(\/)\s*/,
        '//': /^\s*(\/\/)\s*/,
        '*': /^\s*[*.]\s*/
      },
      findobservegroups: function (input, begexcl, begincl, endincl, endexcl, beg2excl, beg2incl, end2incl, end2excl, combine) {
        /** @type {{(input: string, pattern: string | regexp): string | string[] | null;}} */
        var _match = function (input, pattern) {
          if (typeof pattern === "string") {
            if (input.indexof(pattern) !== 0) { return null; }
            return pattern;
          } else {
            var match = input.match(pattern);
            if (!match) { return null; }
            return match[0];
          }
        };
        /** @type {{(input: string, i: number, endchars: string | regexp): {endmatchbegin: number, endmatchend: number} | null;}} */
        var _findobservegroups = function (input, i, endchars) {
          var braces = 0;
          while (i < input.length) {
            var a = input.charat(i);
            var match = _match(input.substr(i), endchars);
            if (match !== null  &&  braces === 0) {
              return { endmatchbegin: i, endmatchend: i + match.length };
            } else if (a === "{") {
              braces++;
            } else if (a === "}") {
              if (braces === 0) {
                throw ["extraclosemissingopen", "extra close brace or missing open brace"];
              } else {
                braces--;
              }
            }
            i++;
          }
          if (braces > 0) {
            return null;
          }
          return null;
        };
        var match = _match(input, begexcl);
        if (match === null) { return null; }
        input = input.substr(match.length);
        match = _match(input, begincl);
        if (match === null) { return null; }
        var e = _findobservegroups(input, match.length, endincl || endexcl);
        if (e === null) { return null; }
        var match1 = input.substring(0, (endincl ? e.endmatchend : e.endmatchbegin));
        if (!(beg2excl || beg2incl)) {
          return {
            match_: match1,
            remainder: input.substr(e.endmatchend)
          };
        } else {
          var group2 = this.findobservegroups(input.substr(e.endmatchend), beg2excl, beg2incl, end2incl, end2excl);
          if (group2 === null) { return null; }
          /** @type {string[]} */
          var matchret = [match1, group2.match_];
          return {
            match_: (combine ? matchret.join("") : matchret),
            remainder: group2.remainder
          };
        }
      },

      //
      // matching function
      // e.g. match("a", input) will look for the regexp called "a" and see if it matches
      // returns null or {match_:"a", remainder:"bc"}
      //
      match_: function (m, input) {
        var pattern = mhchemparser.patterns.patterns[m];
        if (pattern === undefined) {
          throw ["mhchembugp", "mhchem bug p. please report. (" + m + ")"];  // trying to use non-existing pattern
        } else if (typeof pattern === "function") {
          return mhchemparser.patterns.patterns[m](input);  // cannot use cached var pattern here, because some pattern functions need this===mhchemparser
        } else {  // regexp
          var match = input.match(pattern);
          if (match) {
            var mm;
            if (match[2]) {
              mm = [ match[1], match[2] ];
            } else if (match[1]) {
              mm = match[1];
            } else {
              mm = match[0];
            }
            return { match_: mm, remainder: input.substr(match[0].length) };
          }
          return null;
        }
      }
    },

    //
    // generic state machine actions
    //
    actions: {
      'a=': function (buffer, m) { buffer.a = (buffer.a || "") + m; },
      'b=': function (buffer, m) { buffer.b = (buffer.b || "") + m; },
      'p=': function (buffer, m) { buffer.p = (buffer.p || "") + m; },
      'o=': function (buffer, m) { buffer.o = (buffer.o || "") + m; },
      'q=': function (buffer, m) { buffer.q = (buffer.q || "") + m; },
      'd=': function (buffer, m) { buffer.d = (buffer.d || "") + m; },
      'rm=': function (buffer, m) { buffer.rm = (buffer.rm || "") + m; },
      'text=': function (buffer, m) { buffer.text_ = (buffer.text_ || "") + m; },
      'insert': function (buffer, m, a) { return { type_: a }; },
      'insert+p1': function (buffer, m, a) { return { type_: a, p1: m }; },
      'insert+p1+p2': function (buffer, m, a) { return { type_: a, p1: m[0], p2: m[1] }; },
      'copy': function (buffer, m) { return m; },
      'rm': function (buffer, m) { return { type_: 'rm', p1: m || ""}; },
      'text': function (buffer, m) { return mhchemparser.go(m, 'text'); },
      '{text}': function (buffer, m) {
        var ret = [ "{" ];
        mhchemparser.concatarray(ret, mhchemparser.go(m, 'text'));
        ret.push("}");
        return ret;
      },
      'tex-math': function (buffer, m) { return mhchemparser.go(m, 'tex-math'); },
      'tex-math tight': function (buffer, m) { return mhchemparser.go(m, 'tex-math tight'); },
      'bond': function (buffer, m, k) { return { type_: 'bond', kind_: k || m }; },
      'color0-output': function (buffer, m) { return { type_: 'color0', color: m[0] }; },
      'ce': function (buffer, m) { return mhchemparser.go(m); },
      '1/2': function (buffer, m) {
        /** @type {parseroutput[]} */
        var ret = [];
        if (m.match(/^[+\-]/)) {
          ret.push(m.substr(0, 1));
          m = m.substr(1);
        }
        var n = m.match(/^([0-9]+|\$[a-z]\$|[a-z])\/([0-9]+)(\$[a-z]\$|[a-z])?$/);
        n[1] = n[1].replace(/\$/g, "");
        ret.push({ type_: 'frac', p1: n[1], p2: n[2] });
        if (n[3]) {
          n[3] = n[3].replace(/\$/g, "");
          ret.push({ type_: 'tex-math', p1: n[3] });
        }
        return ret;
      },
      '9,9': function (buffer, m) { return mhchemparser.go(m, '9,9'); }
    },
    //
    // createtransitions
    // convert  { 'letter': { 'state': { action_: 'output' } } }  to  { 'state' => [ { pattern: 'letter', task: { action_: [{type_: 'output'}] } } ] }
    // with expansion of 'a|b' to 'a' and 'b' (at 2 places)
    //
    createtransitions: function (o) {
      var pattern, state;
      /** @type {string[]} */
      var statearray;
      var i;
      //
      // 1. collect all states
      //
      /** @type {transitions} */
      var transitions = {};
      for (pattern in o) {
        for (state in o[pattern]) {
          statearray = state.split("|");
          o[pattern][state].statearray = statearray;
          for (i=0; i<statearray.length; i++) {
            transitions[statearray[i]] = [];
          }
        }
      }
      //
      // 2. fill states
      //
      for (pattern in o) {
        for (state in o[pattern]) {
          statearray = o[pattern][state].statearray || [];
          for (i=0; i<statearray.length; i++) {
            //
            // 2a. normalize actions into array:  'text=' ==> [{type_:'text='}]
            // (note to myself: resolving the function here would be problematic. it would need .bind (for *this*) and currying (for *option*).)
            //
            /** @type {any} */
            var p = o[pattern][state];
            if (p.action_) {
              p.action_ = [].concat(p.action_);
              for (var k=0; k<p.action_.length; k++) {
                if (typeof p.action_[k] === "string") {
                  p.action_[k] = { type_: p.action_[k] };
                }
              }
            } else {
              p.action_ = [];
            }
            //
            // 2.b multi-insert
            //
            var patternarray = pattern.split("|");
            for (var j=0; j<patternarray.length; j++) {
              if (statearray[i] === '*') {  // insert into all
                for (var t in transitions) {
                  transitions[t].push({ pattern: patternarray[j], task: p });
                }
              } else {
                transitions[statearray[i]].push({ pattern: patternarray[j], task: p });
              }
            }
          }
        }
      }
      return transitions;
    },
    statemachines: {}
  };

  //
  // definition of state machines
  //
  mhchemparser.statemachines = {
    //
    // \ce state machines
    //
    //#region ce
    'ce': {  // main parser
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': { action_: 'output' } },
        'else':  {
          '0|1|2': { action_: 'beginswithbond=false', revisit: true, tocontinue: true } },
        'oxidation$': {
          '0': { action_: 'oxidation-output' } },
        'cmt': {
          'r': { action_: 'rdt=', nextstate: 'rt' },
          'rd': { action_: 'rqt=', nextstate: 'rdt' } },
        'arrowupdown': {
          '0|1|2|as': { action_: [ 'sb=false', 'output', 'operator' ], nextstate: '1' } },
        'uprightentities': {
          '0|1|2': { action_: [ 'o=', 'output' ], nextstate: '1' } },
        'orbital': {
          '0|1|2|3': { action_: 'o=', nextstate: 'o' } },
        '->': {
          '0|1|2|3': { action_: 'r=', nextstate: 'r' },
          'a|as': { action_: [ 'output', 'r=' ], nextstate: 'r' },
          '*': { action_: [ 'output', 'r=' ], nextstate: 'r' } },
        '+': {
          'o': { action_: 'd= kv',  nextstate: 'd' },
          'd|d': { action_: 'd=', nextstate: 'd' },
          'q': { action_: 'd=',  nextstate: 'qd' },
          'qd|qd': { action_: 'd=', nextstate: 'qd' },
          'dq': { action_: [ 'output', 'd=' ], nextstate: 'd' },
          '3': { action_: [ 'sb=false', 'output', 'operator' ], nextstate: '0' } },
        'amount': {
          '0|2': { action_: 'a=', nextstate: 'a' } },
        'pm-operator': {
          '0|1|2|a|as': { action_: [ 'sb=false', 'output', { type_: 'operator', option: '\\pm' } ], nextstate: '0' } },
        'operator': {
          '0|1|2|a|as': { action_: [ 'sb=false', 'output', 'operator' ], nextstate: '0' } },
        '-$': {
          'o|q': { action_: [ 'charge or bond', 'output' ],  nextstate: 'qd' },
          'd': { action_: 'd=', nextstate: 'd' },
          'd': { action_: [ 'output', { type_: 'bond', option: "-" } ], nextstate: '3' },
          'q': { action_: 'd=',  nextstate: 'qd' },
          'qd': { action_: 'd=', nextstate: 'qd' },
          'qd|dq': { action_: [ 'output', { type_: 'bond', option: "-" } ], nextstate: '3' } },
        '-9': {
          '3|o': { action_: [ 'output', { type_: 'insert', option: 'hyphen' } ], nextstate: '3' } },
        '- orbital overlap': {
          'o': { action_: [ 'output', { type_: 'insert', option: 'hyphen' } ], nextstate: '2' },
          'd': { action_: [ 'output', { type_: 'insert', option: 'hyphen' } ], nextstate: '2' } },
        '-': {
          '0|1|2': { action_: [ { type_: 'output', option: 1 }, 'beginswithbond=true', { type_: 'bond', option: "-" } ], nextstate: '3' },
          '3': { action_: { type_: 'bond', option: "-" } },
          'a': { action_: [ 'output', { type_: 'insert', option: 'hyphen' } ], nextstate: '2' },
          'as': { action_: [ { type_: 'output', option: 2 }, { type_: 'bond', option: "-" } ], nextstate: '3' },
          'b': { action_: 'b=' },
          'o': { action_: { type_: '- after o/d', option: false }, nextstate: '2' },
          'q': { action_: { type_: '- after o/d', option: false }, nextstate: '2' },
          'd|qd|dq': { action_: { type_: '- after o/d', option: true }, nextstate: '2' },
          'd|qd|p': { action_: [ 'output', { type_: 'bond', option: "-" } ], nextstate: '3' } },
        'amount2': {
          '1|3': { action_: 'a=', nextstate: 'a' } },
        'letters': {
          '0|1|2|3|a|as|b|p|bp|o': { action_: 'o=', nextstate: 'o' },
          'q|dq': { action_: ['output', 'o='], nextstate: 'o' },
          'd|d|qd|qd': { action_: 'o after d', nextstate: 'o' } },
        'digits': {
          'o': { action_: 'q=', nextstate: 'q' },
          'd|d': { action_: 'q=', nextstate: 'dq' },
          'q': { action_: [ 'output', 'o=' ], nextstate: 'o' },
          'a': { action_: 'o=', nextstate: 'o' } },
        'space a': {
          'b|p|bp': {} },
        'space': {
          'a': { nextstate: 'as' },
          '0': { action_: 'sb=false' },
          '1|2': { action_: 'sb=true' },
          'r|rt|rd|rdt|rdq': { action_: 'output', nextstate: '0' },
          '*': { action_: [ 'output', 'sb=true' ], nextstate: '1'} },
        '1st-level escape': {
          '1|2': { action_: [ 'output', { type_: 'insert+p1', option: '1st-level escape' } ] },
          '*': { action_: [ 'output', { type_: 'insert+p1', option: '1st-level escape' } ], nextstate: '0' } },
        '[(...)]': {
          'r|rt': { action_: 'rd=', nextstate: 'rd' },
          'rd|rdt': { action_: 'rq=', nextstate: 'rdq' } },
        '...': {
          'o|d|d|dq|qd|qd': { action_: [ 'output', { type_: 'bond', option: "..." } ], nextstate: '3' },
          '*': { action_: [ { type_: 'output', option: 1 }, { type_: 'insert', option: 'ellipsis' } ], nextstate: '1' } },
        '. |* ': {
          '*': { action_: [ 'output', { type_: 'insert', option: 'addition compound' } ], nextstate: '1' } },
        'state of aggregation $': {
          '*': { action_: [ 'output', 'state of aggregation' ], nextstate: '1' } },
        '{[(': {
          'a|as|o': { action_: [ 'o=', 'output', 'parenthesislevel++' ], nextstate: '2' },
          '0|1|2|3': { action_: [ 'o=', 'output', 'parenthesislevel++' ], nextstate: '2' },
          '*': { action_: [ 'output', 'o=', 'output', 'parenthesislevel++' ], nextstate: '2' } },
        ')]}': {
          '0|1|2|3|b|p|bp|o': { action_: [ 'o=', 'parenthesislevel--' ], nextstate: 'o' },
          'a|as|d|d|q|qd|qd|dq': { action_: [ 'output', 'o=', 'parenthesislevel--' ], nextstate: 'o' } },
        ', ': {
          '*': { action_: [ 'output', 'comma' ], nextstate: '0' } },
        '^_': {  // ^ and _ without a sensible argument
          '*': { } },
        '^{(...)}|^($...$)': {
          '0|1|2|as': { action_: 'b=', nextstate: 'b' },
          'p': { action_: 'b=', nextstate: 'bp' },
          '3|o': { action_: 'd= kv', nextstate: 'd' },
          'q': { action_: 'd=', nextstate: 'qd' },
          'd|d|qd|qd|dq': { action_: [ 'output', 'd=' ], nextstate: 'd' } },
        '^a|^\\x{}{}|^\\x{}|^\\x|\'': {
          '0|1|2|as': { action_: 'b=', nextstate: 'b' },
          'p': { action_: 'b=', nextstate: 'bp' },
          '3|o': { action_: 'd= kv', nextstate: 'd' },
          'q': { action_: 'd=', nextstate: 'qd' },
          'd|qd|d|qd': { action_: 'd=' },
          'dq': { action_: [ 'output', 'd=' ], nextstate: 'd' } },
        '_{(state of aggregation)}$': {
          'd|d|q|qd|qd|dq': { action_: [ 'output', 'q=' ], nextstate: 'q' } },
        '_{(...)}|_($...$)|_9|_\\x{}{}|_\\x{}|_\\x': {
          '0|1|2|as': { action_: 'p=', nextstate: 'p' },
          'b': { action_: 'p=', nextstate: 'bp' },
          '3|o': { action_: 'q=', nextstate: 'q' },
          'd|d': { action_: 'q=', nextstate: 'dq' },
          'q|qd|qd|dq': { action_: [ 'output', 'q=' ], nextstate: 'q' } },
        '=<>': {
          '0|1|2|3|a|as|o|q|d|d|qd|qd|dq': { action_: [ { type_: 'output', option: 2 }, 'bond' ], nextstate: '3' } },
        '#': {
          '0|1|2|3|a|as|o': { action_: [ { type_: 'output', option: 2 }, { type_: 'bond', option: "#" } ], nextstate: '3' } },
        '{}': {
          '*': { action_: { type_: 'output', option: 1 },  nextstate: '1' } },
        '{...}': {
          '0|1|2|3|a|as|b|p|bp': { action_: 'o=', nextstate: 'o' },
          'o|d|d|q|qd|qd|dq': { action_: [ 'output', 'o=' ], nextstate: 'o' } },
        '$...$': {
          'a': { action_: 'a=' },  // 2$n$
          '0|1|2|3|as|b|p|bp|o': { action_: 'o=', nextstate: 'o' },  // not 'amount'
          'as|o': { action_: 'o=' },
          'q|d|d|qd|qd|dq': { action_: [ 'output', 'o=' ], nextstate: 'o' } },
        '\\bond{(...)}': {
          '*': { action_: [ { type_: 'output', option: 2 }, 'bond' ], nextstate: "3" } },
        '\\frac{(...)}': {
          '*': { action_: [ { type_: 'output', option: 1 }, 'frac-output' ], nextstate: '3' } },
        '\\overset{(...)}': {
          '*': { action_: [ { type_: 'output', option: 2 }, 'overset-output' ], nextstate: '3' } },
        '\\underset{(...)}': {
          '*': { action_: [ { type_: 'output', option: 2 }, 'underset-output' ], nextstate: '3' } },
        '\\underbrace{(...)}': {
          '*': { action_: [ { type_: 'output', option: 2 }, 'underbrace-output' ], nextstate: '3' } },
        '\\color{(...)}{(...)}1|\\color(...){(...)}2': {
          '*': { action_: [ { type_: 'output', option: 2 }, 'color-output' ], nextstate: '3' } },
        '\\color{(...)}0': {
          '*': { action_: [ { type_: 'output', option: 2 }, 'color0-output' ] } },
        '\\ce{(...)}': {
          '*': { action_: [ { type_: 'output', option: 2 }, 'ce' ], nextstate: '3' } },
        '\\,': {
          '*': { action_: [ { type_: 'output', option: 1 }, 'copy' ], nextstate: '1' } },
        '\\x{}{}|\\x{}|\\x': {
          '0|1|2|3|a|as|b|p|bp|o|c0': { action_: [ 'o=', 'output' ], nextstate: '3' },
          '*': { action_: ['output', 'o=', 'output' ], nextstate: '3' } },
        'others': {
          '*': { action_: [ { type_: 'output', option: 1 }, 'copy' ], nextstate: '3' } },
        'else2': {
          'a': { action_: 'a to o', nextstate: 'o', revisit: true },
          'as': { action_: [ 'output', 'sb=true' ], nextstate: '1', revisit: true },
          'r|rt|rd|rdt|rdq': { action_: [ 'output' ], nextstate: '0', revisit: true },
          '*': { action_: [ 'output', 'copy' ], nextstate: '3' } }
      }),
      actions: {
        'o after d': function (buffer, m) {
          var ret;
          if ((buffer.d || "").match(/^[0-9]+$/)) {
            var tmp = buffer.d;
            buffer.d = undefined;
            ret = this['output'](buffer);
            buffer.b = tmp;
          } else {
            ret = this['output'](buffer);
          }
          mhchemparser.actions['o='](buffer, m);
          return ret;
        },
        'd= kv': function (buffer, m) {
          buffer.d = m;
          buffer.dtype = 'kv';
        },
        'charge or bond': function (buffer, m) {
          if (buffer['beginswithbond']) {
            /** @type {parseroutput[]} */
            var ret = [];
            mhchemparser.concatarray(ret, this['output'](buffer));
            mhchemparser.concatarray(ret, mhchemparser.actions['bond'](buffer, m, "-"));
            return ret;
          } else {
            buffer.d = m;
          }
        },
        '- after o/d': function (buffer, m, isafterd) {
          var c1 = mhchemparser.patterns.match_('orbital', buffer.o || "");
          var c2 = mhchemparser.patterns.match_('one lowercase greek letter $', buffer.o || "");
          var c3 = mhchemparser.patterns.match_('one lowercase latin letter $', buffer.o || "");
          var c4 = mhchemparser.patterns.match_('$one lowercase latin letter$ $', buffer.o || "");
          var hyphenfollows =  m==="-" && ( c1 && c1.remainder===""  ||  c2  ||  c3  ||  c4 );
          if (hyphenfollows && !buffer.a && !buffer.b && !buffer.p && !buffer.d && !buffer.q && !c1 && c3) {
            buffer.o = '$' + buffer.o + '$';
          }
          /** @type {parseroutput[]} */
          var ret = [];
          if (hyphenfollows) {
            mhchemparser.concatarray(ret, this['output'](buffer));
            ret.push({ type_: 'hyphen' });
          } else {
            c1 = mhchemparser.patterns.match_('digits', buffer.d || "");
            if (isafterd && c1 && c1.remainder==='') {
              mhchemparser.concatarray(ret, mhchemparser.actions['d='](buffer, m));
              mhchemparser.concatarray(ret, this['output'](buffer));
            } else {
              mhchemparser.concatarray(ret, this['output'](buffer));
              mhchemparser.concatarray(ret, mhchemparser.actions['bond'](buffer, m, "-"));
            }
          }
          return ret;
        },
        'a to o': function (buffer) {
          buffer.o = buffer.a;
          buffer.a = undefined;
        },
        'sb=true': function (buffer) { buffer.sb = true; },
        'sb=false': function (buffer) { buffer.sb = false; },
        'beginswithbond=true': function (buffer) { buffer['beginswithbond'] = true; },
        'beginswithbond=false': function (buffer) { buffer['beginswithbond'] = false; },
        'parenthesislevel++': function (buffer) { buffer['parenthesislevel']++; },
        'parenthesislevel--': function (buffer) { buffer['parenthesislevel']--; },
        'state of aggregation': function (buffer, m) {
          return { type_: 'state of aggregation', p1: mhchemparser.go(m, 'o') };
        },
        'comma': function (buffer, m) {
          var a = m.replace(/\s*$/, '');
          var withspace = (a !== m);
          if (withspace  &&  buffer['parenthesislevel'] === 0) {
            return { type_: 'comma enumeration l', p1: a };
          } else {
            return { type_: 'comma enumeration m', p1: a };
          }
        },
        'output': function (buffer, m, entityfollows) {
          // entityfollows:
          //   undefined = if we have nothing else to output, also ignore the just read space (buffer.sb)
          //   1 = an entity follows, never omit the space if there was one just read before (can only apply to state 1)
          //   2 = 1 + the entity can have an amount, so output a\, instead of converting it to o (can only apply to states a|as)
          /** @type {parseroutput | parseroutput[]} */
          var ret;
          if (!buffer.r) {
            ret = [];
            if (!buffer.a && !buffer.b && !buffer.p && !buffer.o && !buffer.q && !buffer.d && !entityfollows) {
              //ret = [];
            } else {
              if (buffer.sb) {
                ret.push({ type_: 'entityskip' });
              }
              if (!buffer.o && !buffer.q && !buffer.d && !buffer.b && !buffer.p && entityfollows!==2) {
                buffer.o = buffer.a;
                buffer.a = undefined;
              } else if (!buffer.o && !buffer.q && !buffer.d && (buffer.b || buffer.p)) {
                buffer.o = buffer.a;
                buffer.d = buffer.b;
                buffer.q = buffer.p;
                buffer.a = buffer.b = buffer.p = undefined;
              } else {
                if (buffer.o && buffer.dtype==='kv' && mhchemparser.patterns.match_('d-oxidation$', buffer.d || "")) {
                  buffer.dtype = 'oxidation';
                } else if (buffer.o && buffer.dtype==='kv' && !buffer.q) {
                  buffer.dtype = undefined;
                }
              }
              ret.push({
                type_: 'chemfive',
                a: mhchemparser.go(buffer.a, 'a'),
                b: mhchemparser.go(buffer.b, 'bd'),
                p: mhchemparser.go(buffer.p, 'pq'),
                o: mhchemparser.go(buffer.o, 'o'),
                q: mhchemparser.go(buffer.q, 'pq'),
                d: mhchemparser.go(buffer.d, (buffer.dtype === 'oxidation' ? 'oxidation' : 'bd')),
                dtype: buffer.dtype
              });
            }
          } else {  // r
            /** @type {parseroutput[]} */
            var rd;
            if (buffer.rdt === 'm') {
              rd = mhchemparser.go(buffer.rd, 'tex-math');
            } else if (buffer.rdt === 't') {
              rd = [ { type_: 'text', p1: buffer.rd || "" } ];
            } else {
              rd = mhchemparser.go(buffer.rd);
            }
            /** @type {parseroutput[]} */
            var rq;
            if (buffer.rqt === 'm') {
              rq = mhchemparser.go(buffer.rq, 'tex-math');
            } else if (buffer.rqt === 't') {
              rq = [ { type_: 'text', p1: buffer.rq || ""} ];
            } else {
              rq = mhchemparser.go(buffer.rq);
            }
            ret = {
              type_: 'arrow',
              r: buffer.r,
              rd: rd,
              rq: rq
            };
          }
          for (var p in buffer) {
            if (p !== 'parenthesislevel'  &&  p !== 'beginswithbond') {
              delete buffer[p];
            }
          }
          return ret;
        },
        'oxidation-output': function (buffer, m) {
          var ret = [ "{" ];
          mhchemparser.concatarray(ret, mhchemparser.go(m, 'oxidation'));
          ret.push("}");
          return ret;
        },
        'frac-output': function (buffer, m) {
          return { type_: 'frac-ce', p1: mhchemparser.go(m[0]), p2: mhchemparser.go(m[1]) };
        },
        'overset-output': function (buffer, m) {
          return { type_: 'overset', p1: mhchemparser.go(m[0]), p2: mhchemparser.go(m[1]) };
        },
        'underset-output': function (buffer, m) {
          return { type_: 'underset', p1: mhchemparser.go(m[0]), p2: mhchemparser.go(m[1]) };
        },
        'underbrace-output': function (buffer, m) {
          return { type_: 'underbrace', p1: mhchemparser.go(m[0]), p2: mhchemparser.go(m[1]) };
        },
        'color-output': function (buffer, m) {
          return { type_: 'color', color1: m[0], color2: mhchemparser.go(m[1]) };
        },
        'r=': function (buffer, m) { buffer.r = m; },
        'rdt=': function (buffer, m) { buffer.rdt = m; },
        'rd=': function (buffer, m) { buffer.rd = m; },
        'rqt=': function (buffer, m) { buffer.rqt = m; },
        'rq=': function (buffer, m) { buffer.rq = m; },
        'operator': function (buffer, m, p1) { return { type_: 'operator', kind_: (p1 || m) }; }
      }
    },
    'a': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': {} },
        '1/2$': {
          '0': { action_: '1/2' } },
        'else': {
          '0': { nextstate: '1', revisit: true } },
        '$(...)$': {
          '*': { action_: 'tex-math tight', nextstate: '1' } },
        ',': {
          '*': { action_: { type_: 'insert', option: 'commadecimal' } } },
        'else2': {
          '*': { action_: 'copy' } }
      }),
      actions: {}
    },
    'o': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': {} },
        '1/2$': {
          '0': { action_: '1/2' } },
        'else': {
          '0': { nextstate: '1', revisit: true } },
        'letters': {
          '*': { action_: 'rm' } },
        '\\ca': {
          '*': { action_: { type_: 'insert', option: 'circa' } } },
        '\\x{}{}|\\x{}|\\x': {
          '*': { action_: 'copy' } },
        '${(...)}$|$(...)$': {
          '*': { action_: 'tex-math' } },
        '{(...)}': {
          '*': { action_: '{text}' } },
        'else2': {
          '*': { action_: 'copy' } }
      }),
      actions: {}
    },
    'text': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': { action_: 'output' } },
        '{...}': {
          '*': { action_: 'text=' } },
        '${(...)}$|$(...)$': {
          '*': { action_: 'tex-math' } },
        '\\greek': {
          '*': { action_: [ 'output', 'rm' ] } },
        '\\,|\\x{}{}|\\x{}|\\x': {
          '*': { action_: [ 'output', 'copy' ] } },
        'else': {
          '*': { action_: 'text=' } }
      }),
      actions: {
        'output': function (buffer) {
          if (buffer.text_) {
            /** @type {parseroutput} */
            var ret = { type_: 'text', p1: buffer.text_ };
            for (var p in buffer) { delete buffer[p]; }
            return ret;
          }
        }
      }
    },
    'pq': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': {} },
        'state of aggregation $': {
          '*': { action_: 'state of aggregation' } },
        'i$': {
          '0': { nextstate: '!f', revisit: true } },
        '(kv letters),': {
          '0': { action_: 'rm', nextstate: '0' } },
        'formula$': {
          '0': { nextstate: 'f', revisit: true } },
        '1/2$': {
          '0': { action_: '1/2' } },
        'else': {
          '0': { nextstate: '!f', revisit: true } },
        '${(...)}$|$(...)$': {
          '*': { action_: 'tex-math' } },
        '{(...)}': {
          '*': { action_: 'text' } },
        'a-z': {
          'f': { action_: 'tex-math' } },
        'letters': {
          '*': { action_: 'rm' } },
        '-9.,9': {
          '*': { action_: '9,9'  } },
        ',': {
          '*': { action_: { type_: 'insert+p1', option: 'comma enumeration s' } } },
        '\\color{(...)}{(...)}1|\\color(...){(...)}2': {
          '*': { action_: 'color-output' } },
        '\\color{(...)}0': {
          '*': { action_: 'color0-output' } },
        '\\ce{(...)}': {
          '*': { action_: 'ce' } },
        '\\,|\\x{}{}|\\x{}|\\x': {
          '*': { action_: 'copy' } },
        'else2': {
          '*': { action_: 'copy' } }
      }),
      actions: {
        'state of aggregation': function (buffer, m) {
          return { type_: 'state of aggregation subscript', p1: mhchemparser.go(m, 'o') };
        },
        'color-output': function (buffer, m) {
          return { type_: 'color', color1: m[0], color2: mhchemparser.go(m[1], 'pq') };
        }
      }
    },
    'bd': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': {} },
        'x$': {
          '0': { nextstate: '!f', revisit: true } },
        'formula$': {
          '0': { nextstate: 'f', revisit: true } },
        'else': {
          '0': { nextstate: '!f', revisit: true } },
        '-9.,9 no missing 0': {
          '*': { action_: '9,9' } },
        '.': {
          '*': { action_: { type_: 'insert', option: 'electron dot' } } },
        'a-z': {
          'f': { action_: 'tex-math' } },
        'x': {
          '*': { action_: { type_: 'insert', option: 'kv x' } } },
        'letters': {
          '*': { action_: 'rm' } },
        '\'': {
          '*': { action_: { type_: 'insert', option: 'prime' } } },
        '${(...)}$|$(...)$': {
          '*': { action_: 'tex-math' } },
        '{(...)}': {
          '*': { action_: 'text' } },
        '\\color{(...)}{(...)}1|\\color(...){(...)}2': {
          '*': { action_: 'color-output' } },
        '\\color{(...)}0': {
          '*': { action_: 'color0-output' } },
        '\\ce{(...)}': {
          '*': { action_: 'ce' } },
        '\\,|\\x{}{}|\\x{}|\\x': {
          '*': { action_: 'copy' } },
        'else2': {
          '*': { action_: 'copy' } }
      }),
      actions: {
        'color-output': function (buffer, m) {
          return { type_: 'color', color1: m[0], color2: mhchemparser.go(m[1], 'bd') };
        }
      }
    },
    'oxidation': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': {} },
        'roman numeral': {
          '*': { action_: 'roman-numeral' } },
        '${(...)}$|$(...)$': {
          '*': { action_: 'tex-math' } },
        'else': {
          '*': { action_: 'copy' } }
      }),
      actions: {
        'roman-numeral': function (buffer, m) { return { type_: 'roman numeral', p1: m || "" }; }
      }
    },
    'tex-math': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': { action_: 'output' } },
        '\\ce{(...)}': {
          '*': { action_: [ 'output', 'ce' ] } },
        '{...}|\\,|\\x{}{}|\\x{}|\\x': {
          '*': { action_: 'o=' } },
        'else': {
          '*': { action_: 'o=' } }
      }),
      actions: {
        'output': function (buffer) {
          if (buffer.o) {
            /** @type {parseroutput} */
            var ret = { type_: 'tex-math', p1: buffer.o };
            for (var p in buffer) { delete buffer[p]; }
            return ret;
          }
        }
      }
    },
    'tex-math tight': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': { action_: 'output' } },
        '\\ce{(...)}': {
          '*': { action_: [ 'output', 'ce' ] } },
        '{...}|\\,|\\x{}{}|\\x{}|\\x': {
          '*': { action_: 'o=' } },
        '-|+': {
          '*': { action_: 'tight operator' } },
        'else': {
          '*': { action_: 'o=' } }
      }),
      actions: {
        'tight operator': function (buffer, m) { buffer.o = (buffer.o || "") + "{"+m+"}"; },
        'output': function (buffer) {
          if (buffer.o) {
            /** @type {parseroutput} */
            var ret = { type_: 'tex-math', p1: buffer.o };
            for (var p in buffer) { delete buffer[p]; }
            return ret;
          }
        }
      }
    },
    '9,9': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': {} },
        ',': {
          '*': { action_: 'comma' } },
        'else': {
          '*': { action_: 'copy' } }
      }),
      actions: {
        'comma': function () { return { type_: 'commadecimal' }; }
      }
    },
    //#endregion
    //
    // \pu state machines
    //
    //#region pu
    'pu': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': { action_: 'output' } },
        'space$': {
          '*': { action_: [ 'output', 'space' ] } },
        '{[(|)]}': {
          '0|a': { action_: 'copy' } },
        '(-)(9)^(-9)': {
          '0': { action_: 'number^', nextstate: 'a' } },
        '(-)(9.,9)(e)(99)': {
          '0': { action_: 'enumber', nextstate: 'a' } },
        'space': {
          '0|a': {} },
        'pm-operator': {
          '0|a': { action_: { type_: 'operator', option: '\\pm' }, nextstate: '0' } },
        'operator': {
          '0|a': { action_: 'copy', nextstate: '0' } },
        '//': {
          'd': { action_: 'o=', nextstate: '/' } },
        '/': {
          'd': { action_: 'o=', nextstate: '/' } },
        '{...}|else': {
          '0|d': { action_: 'd=', nextstate: 'd' },
          'a': { action_: [ 'space', 'd=' ], nextstate: 'd' },
          '/|q': { action_: 'q=', nextstate: 'q' } }
      }),
      actions: {
        'enumber': function (buffer, m) {
          /** @type {parseroutput[]} */
          var ret = [];
          if (m[0] === "+-"  ||  m[0] === "+/-") {
            ret.push("\\pm ");
          } else if (m[0]) {
            ret.push(m[0]);
          }
          if (m[1]) {
            mhchemparser.concatarray(ret, mhchemparser.go(m[1], 'pu-9,9'));
            if (m[2]) {
              if (m[2].match(/[,.]/)) {
                mhchemparser.concatarray(ret, mhchemparser.go(m[2], 'pu-9,9'));
              } else {
                ret.push(m[2]);
              }
            }
            m[3] = m[4] || m[3];
            if (m[3]) {
              m[3] = m[3].trim();
              if (m[3] === "e"  ||  m[3].substr(0, 1) === "*") {
                ret.push({ type_: 'cdot' });
              } else {
                ret.push({ type_: 'times' });
              }
            }
          }
          if (m[3]) {
            ret.push("10^{"+m[5]+"}");
          }
          return ret;
        },
        'number^': function (buffer, m) {
          /** @type {parseroutput[]} */
          var ret = [];
          if (m[0] === "+-"  ||  m[0] === "+/-") {
            ret.push("\\pm ");
          } else if (m[0]) {
            ret.push(m[0]);
          }
          mhchemparser.concatarray(ret, mhchemparser.go(m[1], 'pu-9,9'));
          ret.push("^{"+m[2]+"}");
          return ret;
        },
        'operator': function (buffer, m, p1) { return { type_: 'operator', kind_: (p1 || m) }; },
        'space': function () { return { type_: 'pu-space-1' }; },
        'output': function (buffer) {
          /** @type {parseroutput | parseroutput[]} */
          var ret;
          var md = mhchemparser.patterns.match_('{(...)}', buffer.d || "");
          if (md  &&  md.remainder === '') { buffer.d = md.match_; }
          var mq = mhchemparser.patterns.match_('{(...)}', buffer.q || "");
          if (mq  &&  mq.remainder === '') { buffer.q = mq.match_; }
          if (buffer.d) {
            buffer.d = buffer.d.replace(/\u00b0c|\^oc|\^{o}c/g, "{}^{\\circ}c");
            buffer.d = buffer.d.replace(/\u00b0f|\^of|\^{o}f/g, "{}^{\\circ}f");
          }
          if (buffer.q) {  // fraction
            buffer.q = buffer.q.replace(/\u00b0c|\^oc|\^{o}c/g, "{}^{\\circ}c");
            buffer.q = buffer.q.replace(/\u00b0f|\^of|\^{o}f/g, "{}^{\\circ}f");
            var b5 = {
              d: mhchemparser.go(buffer.d, 'pu'),
              q: mhchemparser.go(buffer.q, 'pu')
            };
            if (buffer.o === '//') {
              ret = { type_: 'pu-frac', p1: b5.d, p2: b5.q };
            } else {
              ret = b5.d;
              if (b5.d.length > 1  ||  b5.q.length > 1) {
                ret.push({ type_: ' / ' });
              } else {
                ret.push({ type_: '/' });
              }
              mhchemparser.concatarray(ret, b5.q);
            }
          } else {  // no fraction
            ret = mhchemparser.go(buffer.d, 'pu-2');
          }
          for (var p in buffer) { delete buffer[p]; }
          return ret;
        }
      }
    },
    'pu-2': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '*': { action_: 'output' } },
        '*': {
          '*': { action_: [ 'output', 'cdot' ], nextstate: '0' } },
        '\\x': {
          '*': { action_: 'rm=' } },
        'space': {
          '*': { action_: [ 'output', 'space' ], nextstate: '0' } },
        '^{(...)}|^(-1)': {
          '1': { action_: '^(-1)' } },
        '-9.,9': {
          '0': { action_: 'rm=', nextstate: '0' },
          '1': { action_: '^(-1)', nextstate: '0' } },
        '{...}|else': {
          '*': { action_: 'rm=', nextstate: '1' } }
      }),
      actions: {
        'cdot': function () { return { type_: 'tight cdot' }; },
        '^(-1)': function (buffer, m) { buffer.rm += "^{"+m+"}"; },
        'space': function () { return { type_: 'pu-space-2' }; },
        'output': function (buffer) {
          /** @type {parseroutput | parseroutput[]} */
          var ret = [];
          if (buffer.rm) {
            var mrm = mhchemparser.patterns.match_('{(...)}', buffer.rm || "");
            if (mrm  &&  mrm.remainder === '') {
              ret = mhchemparser.go(mrm.match_, 'pu');
            } else {
              ret = { type_: 'rm', p1: buffer.rm };
            }
          }
          for (var p in buffer) { delete buffer[p]; }
          return ret;
        }
      }
    },
    'pu-9,9': {
      transitions: mhchemparser.createtransitions({
        'empty': {
          '0': { action_: 'output-0' },
          'o': { action_: 'output-o' } },
        ',': {
          '0': { action_: [ 'output-0', 'comma' ], nextstate: 'o' } },
        '.': {
          '0': { action_: [ 'output-0', 'copy' ], nextstate: 'o' } },
        'else': {
          '*': { action_: 'text=' } }
      }),
      actions: {
        'comma': function () { return { type_: 'commadecimal' }; },
        'output-0': function (buffer) {
          /** @type {parseroutput[]} */
          var ret = [];
          buffer.text_ = buffer.text_ || "";
          if (buffer.text_.length > 4) {
            var a = buffer.text_.length % 3;
            if (a === 0) { a = 3; }
            for (var i=buffer.text_.length-3; i>0; i-=3) {
              ret.push(buffer.text_.substr(i, 3));
              ret.push({ type_: '1000 separator' });
            }
            ret.push(buffer.text_.substr(0, a));
            ret.reverse();
          } else {
            ret.push(buffer.text_);
          }
          for (var p in buffer) { delete buffer[p]; }
          return ret;
        },
        'output-o': function (buffer) {
          /** @type {parseroutput[]} */
          var ret = [];
          buffer.text_ = buffer.text_ || "";
          if (buffer.text_.length > 4) {
            var a = buffer.text_.length - 3;
            for (var i=0; i<a; i+=3) {
              ret.push(buffer.text_.substr(i, 3));
              ret.push({ type_: '1000 separator' });
            }
            ret.push(buffer.text_.substr(i));
          } else {
            ret.push(buffer.text_);
          }
          for (var p in buffer) { delete buffer[p]; }
          return ret;
        }
      }
    }
    //#endregion
  };

  //
  // texify: take mhchemparser output and convert it to tex
  //
  /** @type {texify} */
  var texify = {
    go: function (input, isinner) {  // (recursive, max 4 levels)
      if (!input) { return ""; }
      var res = "";
      var cee = false;
      for (var i=0; i < input.length; i++) {
        var inputi = input[i];
        if (typeof inputi === "string") {
          res += inputi;
        } else {
          res += texify._go2(inputi);
          if (inputi.type_ === '1st-level escape') { cee = true; }
        }
      }
      if (!isinner && !cee && res) {
        res = "{" + res + "}";
      }
      return res;
    },
    _goinner: function (input) {
      if (!input) { return input; }
      return texify.go(input, true);
    },
    _go2: function (buf) {
      /** @type {undefined | string} */
      var res;
      switch (buf.type_) {
        case 'chemfive':
          res = "";
          var b5 = {
            a: texify._goinner(buf.a),
            b: texify._goinner(buf.b),
            p: texify._goinner(buf.p),
            o: texify._goinner(buf.o),
            q: texify._goinner(buf.q),
            d: texify._goinner(buf.d)
          };
          //
          // a
          //
          if (b5.a) {
            if (b5.a.match(/^[+\-]/)) { b5.a = "{"+b5.a+"}"; }
            res += b5.a + "\\,";
          }
          //
          // b and p
          //
          if (b5.b || b5.p) {
            res += "{\\vphantom{x}}";
            res += "^{\\hphantom{"+(b5.b||"")+"}}_{\\hphantom{"+(b5.p||"")+"}}";
            res += "{\\vphantom{x}}";
            // in the next two lines, i've removed \smash[t] (ron)
            // todo: revert \smash[t] when webkit properly renders <mpadded> w/height="0"
            //res += "^{\\smash[t]{\\vphantom{2}}\\mathllap{"+(b5.b||"")+"}}";
            res += "^{\\vphantom{2}\\mathllap{"+(b5.b||"")+"}}";
            //res += "_{\\vphantom{2}\\mathllap{\\smash[t]{"+(b5.p||"")+"}}}";
            res += "_{\\vphantom{2}\\mathllap{"+(b5.p||"")+"}}";
          }
          //
          // o
          //
          if (b5.o) {
            if (b5.o.match(/^[+\-]/)) { b5.o = "{"+b5.o+"}"; }
            res += b5.o;
          }
          //
          // q and d
          //
          if (buf.dtype === 'kv') {
            if (b5.d || b5.q) {
              res += "{\\vphantom{x}}";
            }
            if (b5.d) {
              res += "^{"+b5.d+"}";
            }
            if (b5.q) {
              // in the next line, i've removed \smash[t] (ron)
              // todo: revert \smash[t] when webkit properly renders <mpadded> w/height="0"
              //res += "_{\\smash[t]{"+b5.q+"}}";
              res += "_{"+b5.q+"}";
            }
          } else if (buf.dtype === 'oxidation') {
            if (b5.d) {
              res += "{\\vphantom{x}}";
              res += "^{"+b5.d+"}";
            }
            if (b5.q) {
              // a firefox bug adds a bogus depth to <mphantom>, so we change \vphantom{x} to {}
              // todo: reinstate \vphantom{x} when the firefox bug is fixed.
//              res += "{\\vphantom{x}}";
              res += "{{}}";
              // in the next line, i've removed \smash[t] (ron)
              // todo: revert \smash[t] when webkit properly renders <mpadded> w/height="0"
              //res += "_{\\smash[t]{"+b5.q+"}}";
              res += "_{"+b5.q+"}";
            }
          } else {
            if (b5.q) {
              // todo: reinstate \vphantom{x} when the firefox bug is fixed.
//              res += "{\\vphantom{x}}";
              res += "{{}}";
              // in the next line, i've removed \smash[t] (ron)
              // todo: revert \smash[t] when webkit properly renders <mpadded> w/height="0"
              //res += "_{\\smash[t]{"+b5.q+"}}";
              res += "_{"+b5.q+"}";
            }
            if (b5.d) {
              // todo: reinstate \vphantom{x} when the firefox bug is fixed.
//              res += "{\\vphantom{x}}";
              res += "{{}}";
              res += "^{"+b5.d+"}";
            }
          }
          break;
        case 'rm':
          res = "\\mathrm{"+buf.p1+"}";
          break;
        case 'text':
          if (buf.p1.match(/[\^_]/)) {
            buf.p1 = buf.p1.replace(" ", "~").replace("-", "\\text{-}");
            res = "\\mathrm{"+buf.p1+"}";
          } else {
            res = "\\text{"+buf.p1+"}";
          }
          break;
        case 'roman numeral':
          res = "\\mathrm{"+buf.p1+"}";
          break;
        case 'state of aggregation':
          res = "\\mskip2mu "+texify._goinner(buf.p1);
          break;
        case 'state of aggregation subscript':
          res = "\\mskip1mu "+texify._goinner(buf.p1);
          break;
        case 'bond':
          res = texify._getbond(buf.kind_);
          if (!res) {
            throw ["mhchemerrorbond", "mhchem error. unknown bond type (" + buf.kind_ + ")"];
          }
          break;
        case 'frac':
          var c = "\\frac{" + buf.p1 + "}{" + buf.p2 + "}";
          res = "\\mathchoice{\\textstyle"+c+"}{"+c+"}{"+c+"}{"+c+"}";
          break;
        case 'pu-frac':
          var d = "\\frac{" + texify._goinner(buf.p1) + "}{" + texify._goinner(buf.p2) + "}";
          res = "\\mathchoice{\\textstyle"+d+"}{"+d+"}{"+d+"}{"+d+"}";
          break;
        case 'tex-math':
          res = buf.p1 + " ";
          break;
        case 'frac-ce':
          res = "\\frac{" + texify._goinner(buf.p1) + "}{" + texify._goinner(buf.p2) + "}";
          break;
        case 'overset':
          res = "\\overset{" + texify._goinner(buf.p1) + "}{" + texify._goinner(buf.p2) + "}";
          break;
        case 'underset':
          res = "\\underset{" + texify._goinner(buf.p1) + "}{" + texify._goinner(buf.p2) + "}";
          break;
        case 'underbrace':
          res =  "\\underbrace{" + texify._goinner(buf.p1) + "}_{" + texify._goinner(buf.p2) + "}";
          break;
        case 'color':
          res = "{\\color{" + buf.color1 + "}{" + texify._goinner(buf.color2) + "}}";
          break;
        case 'color0':
          res = "\\color{" + buf.color + "}";
          break;
        case 'arrow':
          var b6 = {
            rd: texify._goinner(buf.rd),
            rq: texify._goinner(buf.rq)
          };
          var arrow = texify._getarrow(buf.r);
          if (b6.rq) { arrow += "[{\\rm " + b6.rq + "}]"; }
          if (b6.rd) {
            arrow += "{\\rm " + b6.rd + "}";
          } else {
            arrow += "{}";
          }
          res = arrow;
          break;
        case 'operator':
          res = texify._getoperator(buf.kind_);
          break;
        case '1st-level escape':
          res = buf.p1+" ";  // &, \\\\, \\hlin
          break;
        case 'space':
          res = " ";
          break;
        case 'entityskip':
          res = "~";
          break;
        case 'pu-space-1':
          res = "~";
          break;
        case 'pu-space-2':
          res = "\\mkern3mu ";
          break;
        case '1000 separator':
          res = "\\mkern2mu ";
          break;
        case 'commadecimal':
          res = "{,}";
          break;
          case 'comma enumeration l':
          res = "{"+buf.p1+"}\\mkern6mu ";
          break;
        case 'comma enumeration m':
          res = "{"+buf.p1+"}\\mkern3mu ";
          break;
        case 'comma enumeration s':
          res = "{"+buf.p1+"}\\mkern1mu ";
          break;
        case 'hyphen':
          res = "\\text{-}";
          break;
        case 'addition compound':
          res = "\\,{\\cdot}\\,";
          break;
        case 'electron dot':
          res = "\\mkern1mu \\text{\\textbullet}\\mkern1mu ";
          break;
        case 'kv x':
          res = "{\\times}";
          break;
        case 'prime':
          res = "\\prime ";
          break;
        case 'cdot':
          res = "\\cdot ";
          break;
        case 'tight cdot':
          res = "\\mkern1mu{\\cdot}\\mkern1mu ";
          break;
        case 'times':
          res = "\\times ";
          break;
        case 'circa':
          res = "{\\sim}";
          break;
        case '^':
          res = "uparrow";
          break;
        case 'v':
          res = "downarrow";
          break;
        case 'ellipsis':
          res = "\\ldots ";
          break;
        case '/':
          res = "/";
          break;
        case ' / ':
          res = "\\,/\\,";
          break;
        default:
          assertnever(buf);
          throw ["mhchembugt", "mhchem bug t. please report."];  // missing texify rule or unknown mhchemparser output
      }
      assertstring(res);
      return res;
    },
    _getarrow: function (a) {
      switch (a) {
        case "->": return "\\yields";
        case "\u2192": return "\\yields";
        case "\u27f6": return "\\yields";
        case "<-": return "\\yieldsleft";
        case "<->": return "\\mesomerism";
        case "<-->": return "\\yieldsleftright";
        case "<=>": return "\\equilibrium";
        case "\u21cc": return "\\equilibrium";
        case "<=>>": return "\\equilibriumright";
        case "<<=>": return "\\equilibriumleft";
        default:
          assertnever(a);
          throw ["mhchembugt", "mhchem bug t. please report."];
      }
    },
    _getbond: function (a) {
      switch (a) {
        case "-": return "{-}";
        case "1": return "{-}";
        case "=": return "{=}";
        case "2": return "{=}";
        case "#": return "{\\equiv}";
        case "3": return "{\\equiv}";
        case "~": return "{\\tripledash}";
        case "~-": return "{\\tripledashoverline}";
        case "~=": return "{\\tripledashoverdoubleline}";
        case "~--": return "{\\tripledashoverdoubleline}";
        case "-~-": return "{\\tripledashbetweendoubleline}";
        case "...": return "{{\\cdot}{\\cdot}{\\cdot}}";
        case "....": return "{{\\cdot}{\\cdot}{\\cdot}{\\cdot}}";
        case "->": return "{\\rightarrow}";
        case "<-": return "{\\leftarrow}";
        case "<": return "{<}";
        case ">": return "{>}";
        default:
          assertnever(a);
          throw ["mhchembugt", "mhchem bug t. please report."];
      }
    },
    _getoperator: function (a) {
      switch (a) {
        case "+": return " {}+{} ";
        case "-": return " {}-{} ";
        case "=": return " {}={} ";
        case "<": return " {}<{} ";
        case ">": return " {}>{} ";
        case "<<": return " {}\\ll{} ";
        case ">>": return " {}\\gg{} ";
        case "\\pm": return " {}\\pm{} ";
        case "\\approx": return " {}\\approx{} ";
        case "$\\approx$": return " {}\\approx{} ";
        case "v": return " \\downarrow{} ";
        case "(v)": return " \\downarrow{} ";
        case "^": return " \\uparrow{} ";
        case "(^)": return " \\uparrow{} ";
        default:
          assertnever(a);
          throw ["mhchembugt", "mhchem bug t. please report."];
      }
    }
  };

  //
  // helpers for code analysis
  // will show type error at calling position
  //
  /** @param {number} a */
  function assertnever(a) {}
  /** @param {string} a */
  function assertstring(a) {}

/* eslint-disable no-undef */

//////////////////////////////////////////////////////////////////////
// texvc.sty

// the texvc package contains macros available in mediawiki pages.
// we omit the functions deprecated at
// https://en.wikipedia.org/wiki/help:displaying_a_formula#deprecated_syntax

// we also omit texvc's \o, which conflicts with \text{\o}

definemacro("\\darr", "\\downarrow");
definemacro("\\darr", "\\downarrow");
definemacro("\\darr", "\\downarrow");
definemacro("\\lang", "\\langle");
definemacro("\\rang", "\\rangle");
definemacro("\\uarr", "\\uparrow");
definemacro("\\uarr", "\\uparrow");
definemacro("\\uarr", "\\uparrow");
definemacro("\\n", "\\mathbb{n}");
definemacro("\\r", "\\mathbb{r}");
definemacro("\\z", "\\mathbb{z}");
definemacro("\\alef", "\\aleph");
definemacro("\\alefsym", "\\aleph");
definemacro("\\bull", "\\bullet");
definemacro("\\clubs", "\\clubsuit");
definemacro("\\cnums", "\\mathbb{c}");
definemacro("\\complex", "\\mathbb{c}");
definemacro("\\dagger", "\\ddagger");
definemacro("\\diamonds", "\\diamondsuit");
definemacro("\\empty", "\\emptyset");
definemacro("\\exist", "\\exists");
definemacro("\\harr", "\\leftrightarrow");
definemacro("\\harr", "\\leftrightarrow");
definemacro("\\harr", "\\leftrightarrow");
definemacro("\\hearts", "\\heartsuit");
definemacro("\\image", "\\im");
definemacro("\\infin", "\\infty");
definemacro("\\isin", "\\in");
definemacro("\\larr", "\\leftarrow");
definemacro("\\larr", "\\leftarrow");
definemacro("\\larr", "\\leftarrow");
definemacro("\\lrarr", "\\leftrightarrow");
definemacro("\\lrarr", "\\leftrightarrow");
definemacro("\\lrarr", "\\leftrightarrow");
definemacro("\\natnums", "\\mathbb{n}");
definemacro("\\plusmn", "\\pm");
definemacro("\\rarr", "\\rightarrow");
definemacro("\\rarr", "\\rightarrow");
definemacro("\\rarr", "\\rightarrow");
definemacro("\\real", "\\re");
definemacro("\\reals", "\\mathbb{r}");
definemacro("\\reals", "\\mathbb{r}");
definemacro("\\sdot", "\\cdot");
definemacro("\\sect", "\\s");
definemacro("\\spades", "\\spadesuit");
definemacro("\\sub", "\\subset");
definemacro("\\sube", "\\subseteq");
definemacro("\\supe", "\\supseteq");
definemacro("\\thetasym", "\\vartheta");
definemacro("\\weierp", "\\wp");

/* eslint-disable no-undef */

/****************************************************
 *
 *  physics.js
 *
 *  implements the physics package for latex input.
 *
 *  ---------------------------------------------------------------------
 *
 *  the original version of this file is licensed as follows:
 *  copyright (c) 2015-2016 kolen cheung <https://github.com/ickc/mathjax-third-party-extensions>.
 *
 *  licensed under the apache license, version 2.0 (the "license");
 *  you may not use this file except in compliance with the license.
 *  you may obtain a copy of the license at
 *
 *      http://www.apache.org/licenses/license-2.0
 *
 *  unless required by applicable law or agreed to in writing, software
 *  distributed under the license is distributed on an "as is" basis,
 *  without warranties or conditions of any kind, either express or implied.
 *  see the license for the specific language governing permissions and
 *  limitations under the license.
 *
 *  ---------------------------------------------------------------------
 *
 *  this file has been revised from the original in the following ways:
 *  1. the interface is changed so that it can be called from temml, not mathjax.
 *  2. \re and \im are not used, to avoid conflict with existing latex letters.
 *
 *  this revision of the file is released under the mit license.
 *  https://mit-license.org/
 */
definemacro("\\quantity", "{\\left\\{ #1 \\right\\}}");
definemacro("\\qty", "{\\left\\{ #1 \\right\\}}");
definemacro("\\pqty", "{\\left( #1 \\right)}");
definemacro("\\bqty", "{\\left[ #1 \\right]}");
definemacro("\\vqty", "{\\left\\vert #1 \\right\\vert}");
definemacro("\\bqty", "{\\left\\{ #1 \\right\\}}");
definemacro("\\absolutevalue", "{\\left\\vert #1 \\right\\vert}");
definemacro("\\abs", "{\\left\\vert #1 \\right\\vert}");
definemacro("\\norm", "{\\left\\vert #1 \\right\\vert}");
definemacro("\\evaluated", "{\\left.#1 \\right\\vert}");
definemacro("\\eval", "{\\left.#1 \\right\\vert}");
definemacro("\\order", "{\\mathcal{o} \\left( #1 \\right)}");
definemacro("\\commutator", "{\\left[ #1 , #2 \\right]}");
definemacro("\\comm", "{\\left[ #1 , #2 \\right]}");
definemacro("\\anticommutator", "{\\left\\{ #1 , #2 \\right\\}}");
definemacro("\\acomm", "{\\left\\{ #1 , #2 \\right\\}}");
definemacro("\\poissonbracket", "{\\left\\{ #1 , #2 \\right\\}}");
definemacro("\\pb", "{\\left\\{ #1 , #2 \\right\\}}");
definemacro("\\vectorbold", "{\\boldsymbol{ #1 }}");
definemacro("\\vb", "{\\boldsymbol{ #1 }}");
definemacro("\\vectorarrow", "{\\vec{\\boldsymbol{ #1 }}}");
definemacro("\\va", "{\\vec{\\boldsymbol{ #1 }}}");
definemacro("\\vectorunit", "{{\\boldsymbol{\\hat{ #1 }}}}");
definemacro("\\vu", "{{\\boldsymbol{\\hat{ #1 }}}}");
definemacro("\\dotproduct", "\\mathbin{\\boldsymbol\\cdot}");
definemacro("\\vdot", "{\\boldsymbol\\cdot}");
definemacro("\\crossproduct", "\\mathbin{\\boldsymbol\\times}");
definemacro("\\cross", "\\mathbin{\\boldsymbol\\times}");
definemacro("\\cp", "\\mathbin{\\boldsymbol\\times}");
definemacro("\\gradient", "{\\boldsymbol\\nabla}");
definemacro("\\grad", "{\\boldsymbol\\nabla}");
definemacro("\\divergence", "{\\grad\\vdot}");
//definemacro("\\div", "{\\grad\\vdot}"); not included in temml. conflicts w/latex \div
definemacro("\\curl", "{\\grad\\cross}");
definemacro("\\laplacian", "\\nabla^2");
definemacro("\\tr", "{\\operatorname{tr}}");
definemacro("\\tr", "{\\operatorname{tr}}");
definemacro("\\rank", "{\\operatorname{rank}}");
definemacro("\\erf", "{\\operatorname{erf}}");
definemacro("\\res", "{\\operatorname{res}}");
definemacro("\\principalvalue", "{\\mathcal{p}}");
definemacro("\\pv", "{\\mathcal{p}}");
definemacro("\\pv", "{\\operatorname{p.v.}}");
// temml does not use the next two lines. they conflict with latex letters.
//definemacro("\\re", "{\\operatorname{re} \\left\\{ #1 \\right\\}}");
//definemacro("\\im", "{\\operatorname{im} \\left\\{ #1 \\right\\}}");
definemacro("\\qqtext", "{\\quad\\text{ #1 }\\quad}");
definemacro("\\qq", "{\\quad\\text{ #1 }\\quad}");
definemacro("\\qcomma", "{\\text{,}\\quad}");
definemacro("\\qc", "{\\text{,}\\quad}");
definemacro("\\qcc", "{\\quad\\text{c.c.}\\quad}");
definemacro("\\qif", "{\\quad\\text{if}\\quad}");
definemacro("\\qthen", "{\\quad\\text{then}\\quad}");
definemacro("\\qelse", "{\\quad\\text{else}\\quad}");
definemacro("\\qotherwise", "{\\quad\\text{otherwise}\\quad}");
definemacro("\\qunless", "{\\quad\\text{unless}\\quad}");
definemacro("\\qgiven", "{\\quad\\text{given}\\quad}");
definemacro("\\qusing", "{\\quad\\text{using}\\quad}");
definemacro("\\qassume", "{\\quad\\text{assume}\\quad}");
definemacro("\\qsince", "{\\quad\\text{since}\\quad}");
definemacro("\\qlet", "{\\quad\\text{let}\\quad}");
definemacro("\\qfor", "{\\quad\\text{for}\\quad}");
definemacro("\\qall", "{\\quad\\text{all}\\quad}");
definemacro("\\qeven", "{\\quad\\text{even}\\quad}");
definemacro("\\qodd", "{\\quad\\text{odd}\\quad}");
definemacro("\\qinteger", "{\\quad\\text{integer}\\quad}");
definemacro("\\qand", "{\\quad\\text{and}\\quad}");
definemacro("\\qor", "{\\quad\\text{or}\\quad}");
definemacro("\\qas", "{\\quad\\text{as}\\quad}");
definemacro("\\qin", "{\\quad\\text{in}\\quad}");
definemacro("\\differential", "{\\text{d}}");
definemacro("\\dd", "{\\text{d}}");
definemacro("\\derivative", "{\\frac{\\text{d}{ #1 }}{\\text{d}{ #2 }}}");
definemacro("\\dv", "{\\frac{\\text{d}{ #1 }}{\\text{d}{ #2 }}}");
definemacro("\\partialderivative", "{\\frac{\\partial{ #1 }}{\\partial{ #2 }}}");
definemacro("\\variation", "{\\delta}");
definemacro("\\var", "{\\delta}");
definemacro("\\functionalderivative", "{\\frac{\\delta{ #1 }}{\\delta{ #2 }}}");
definemacro("\\fdv", "{\\frac{\\delta{ #1 }}{\\delta{ #2 }}}");
definemacro("\\innerproduct", "{\\left\\langle {#1} \\mid { #2} \\right\\rangle}");
definemacro("\\outerproduct",
  "{\\left\\vert { #1 } \\right\\rangle\\left\\langle { #2} \\right\\vert}");
definemacro("\\dyad",
  "{\\left\\vert { #1 } \\right\\rangle\\left\\langle { #2} \\right\\vert}");
definemacro("\\ketbra",
  "{\\left\\vert { #1 } \\right\\rangle\\left\\langle { #2} \\right\\vert}");
definemacro("\\op",
  "{\\left\\vert { #1 } \\right\\rangle\\left\\langle { #2} \\right\\vert}");
definemacro("\\expectationvalue", "{\\left\\langle {#1 } \\right\\rangle}");
definemacro("\\expval", "{\\left\\langle {#1 } \\right\\rangle}");
definemacro("\\ev", "{\\left\\langle {#1 } \\right\\rangle}");
definemacro("\\matrixelement",
  "{\\left\\langle{ #1 }\\right\\vert{ #2 }\\left\\vert{#3}\\right\\rangle}");
definemacro("\\matrixel",
  "{\\left\\langle{ #1 }\\right\\vert{ #2 }\\left\\vert{#3}\\right\\rangle}");
definemacro("\\mel",
  "{\\left\\langle{ #1 }\\right\\vert{ #2 }\\left\\vert{#3}\\right\\rangle}");

// helper functions
function gethlines(parser) {
  // return an array. the array length = number of hlines.
  // each element in the array tells if the line is dashed.
  const hlineinfo = [];
  parser.consumespaces();
  let nxt = parser.fetch().text;
  if (nxt === "\\relax") {
    parser.consume();
    parser.consumespaces();
    nxt = parser.fetch().text;
  }
  while (nxt === "\\hline" || nxt === "\\hdashline") {
    parser.consume();
    hlineinfo.push(nxt === "\\hdashline");
    parser.consumespaces();
    nxt = parser.fetch().text;
  }
  return hlineinfo;
}

const validateamsenvironmentcontext = context => {
  const settings = context.parser.settings;
  if (!settings.displaymode) {
    throw new parseerror(`{${context.envname}} can be used only in display mode.`);
  }
};

const sizeregex$1 = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/;
const arraygaps = macros => {
  let arraystretch = macros.get("\\arraystretch");
  if (typeof arraystretch !== "string") {
    arraystretch = stringfromarg(arraystretch.tokens);
  }
  arraystretch = isnan(arraystretch) ? null : number(arraystretch);
  let arraycolsepstr = macros.get("\\arraycolsep");
  if (typeof arraycolsepstr !== "string") {
    arraycolsepstr = stringfromarg(arraycolsepstr.tokens);
  }
  const match = sizeregex$1.exec(arraycolsepstr);
  const arraycolsep = match
    ? { number: +(match[1] + match[2]), unit: match[3] }
    : null;
  return [arraystretch, arraycolsep]
};

const checkcellforlabels = cell => {
  // check if the author wrote a \tag{} inside this cell.
  let rowlabel = "";
  for (let i = 0; i < cell.length; i++) {
    if (cell[i].type === "label") {
      if (rowlabel) { throw new parseerror(("multiple \\labels in one row")) }
      rowlabel = cell[i].string;
    }
  }
  return rowlabel
};

// autotag (an argument to parsearray) can be one of three values:
// * undefined: regular (not-top-level) array; no tags on each row
// * true: automatic equation numbering, overridable by \tag
// * false: tags allowed on each row, but no automatic numbering
// this function *doesn't* work with the "split" environment name.
function getautotag(name) {
  if (name.indexof("ed") === -1) {
    return name.indexof("*") === -1;
  }
  // return undefined;
}

/**
 * parse the body of the environment, with rows delimited by \\ and
 * columns delimited by &, and create a nested list in row-major order
 * with one group per cell.  if given an optional argument scriptlevel
 * ("text", "display", etc.), then each cell is cast into that scriptlevel.
 */
function parsearray(
  parser,
  {
    cols, // [{ type: string , align: l|c|r|null }]
    envclasses, // align(ed|at|edat) | array | cases | cd | small | multline
    autotag,        // boolean
    singlerow,      // boolean
    emptysinglerow, // boolean
    maxnumcols,     // number
    leqno,          // boolean
    arraystretch,   // number  | null
    arraycolsep     // size value | null
},
  scriptlevel
) {
  parser.gullet.begingroup();
  if (!singlerow) {
    // \cr is equivalent to \\ without the optional size argument (see below)
    // todo: provide helpful error when \cr is used outside array environment
    parser.gullet.macros.set("\\cr", "\\\\\\relax");
  }

  // start group for first cell
  parser.gullet.begingroup();

  let row = [];
  const body = [row];
  const rowgaps = [];
  const labels = [];

  const hlinesbeforerow = [];

  const tags = (autotag != null ? [] : undefined);

  // amsmath uses \global\@eqnswtrue and \global\@eqnswfalse to represent
  // whether this row should have an equation number.  simulate this with
  // a \@eqnsw macro set to 1 or 0.
  function beginrow() {
    if (autotag) {
      parser.gullet.macros.set("\\@eqnsw", "1", true);
    }
  }
  function endrow() {
    if (tags) {
      if (parser.gullet.macros.get("\\df@tag")) {
        tags.push(parser.subparse([new token("\\df@tag")]));
        parser.gullet.macros.set("\\df@tag", undefined, true);
      } else {
        tags.push(boolean(autotag) &&
            parser.gullet.macros.get("\\@eqnsw") === "1");
      }
    }
  }
  beginrow();

  // test for \hline at the top of the array.
  hlinesbeforerow.push(gethlines(parser));

  while (true) {
    // parse each cell in its own group (namespace)
    let cell = parser.parseexpression(false, singlerow ? "\\end" : "\\\\");
    parser.gullet.endgroup();
    parser.gullet.begingroup();

    cell = {
      type: "ordgroup",
      mode: parser.mode,
      body: cell,
      semisimple: true
    };
    row.push(cell);
    const next = parser.fetch().text;
    if (next === "&") {
      if (maxnumcols && row.length === maxnumcols) {
        if (envclasses.includes("array")) {
          if (parser.settings.strict) {
            throw new parseerror("too few columns " + "specified in the {array} column argument.",
              parser.nexttoken)
          }
        } else if (maxnumcols === 2) {
          throw new parseerror("the split environment accepts no more than two columns",
            parser.nexttoken);
        } else {
          throw new parseerror("the equation environment accepts only one column",
            parser.nexttoken)
        }
      }
      parser.consume();
    } else if (next === "\\end") {
      endrow();
      // arrays terminate newlines with `\crcr` which consumes a `\cr` if
      // the last line is empty.  however, ams environments keep the
      // empty row if it's the only one.
      // note: currently, `cell` is the last item added into `row`.
      if (row.length === 1 && cell.body.length === 0 && (body.length > 1 || !emptysinglerow)) {
        body.pop();
      }
      labels.push(checkcellforlabels(cell.body));
      if (hlinesbeforerow.length < body.length + 1) {
        hlinesbeforerow.push([]);
      }
      break;
    } else if (next === "\\\\") {
      parser.consume();
      let size;
      // \def\let@{\let\\\math@cr}
      // \def\math@cr{...\math@cr@}
      // \def\math@cr@{\new@ifnextchar[\math@cr@@{\math@cr@@[\z@]}}
      // \def\math@cr@@[#1]{...\math@cr@@@...}
      // \def\math@cr@@@{\cr}
      if (parser.gullet.future().text !== " ") {
        size = parser.parsesizegroup(true);
      }
      rowgaps.push(size ? size.value : null);
      endrow();

      labels.push(checkcellforlabels(cell.body));

      // check for \hline(s) following the row separator
      hlinesbeforerow.push(gethlines(parser));

      row = [];
      body.push(row);
      beginrow();
    } else {
      throw new parseerror("expected & or \\\\ or \\cr or \\end", parser.nexttoken);
    }
  }

  // end cell group
  parser.gullet.endgroup();
  // end array group defining \cr
  parser.gullet.endgroup();

  return {
    type: "array",
    mode: parser.mode,
    body,
    cols,
    rowgaps,
    hlinesbeforerow,
    envclasses,
    autotag,
    scriptlevel,
    tags,
    labels,
    leqno,
    arraystretch,
    arraycolsep
  };
}

// decides on a scriptlevel for cells in an array according to whether the given
// environment name starts with the letter 'd'.
function dcellstyle(envname) {
  return envname.slice(0, 1) === "d" ? "display" : "text"
}

const alignmap = {
  c: "center ",
  l: "left ",
  r: "right "
};

const glue = group => {
  const gluenode = new mathmltree.mathnode("mtd", []);
  gluenode.style = { padding: "0", width: "50%" };
  if (group.envclasses.includes("multline")) {
    gluenode.style.width = "7.5%";
  }
  return gluenode
};

const mathmlbuilder$7 = function(group, style) {
  const tbl = [];
  const numrows = group.body.length;
  const hlines = group.hlinesbeforerow;

  for (let i = 0; i < numrows; i++) {
    const rw = group.body[i];
    const row = [];
    const celllevel = group.scriptlevel === "text"
      ? stylelevel.text
      : group.scriptlevel === "script"
      ? stylelevel.script
      : stylelevel.display;

    for (let j = 0; j < rw.length; j++) {
      const mtd = new mathmltree.mathnode(
        "mtd",
        [buildgroup$1(rw[j], style.withlevel(celllevel))]
      );

      if (group.envclasses.includes("multline")) {
        const align = i === 0 ? "left" : i === numrows - 1 ? "right" : "center";
        mtd.setattribute("columnalign", align);
        if (align !== "center") {
          mtd.classes.push("tml-" + align);
        }
      }
      row.push(mtd);
    }
    const numcolumns = group.body[0].length;
    // fill out a short row with empty <mtd> elements.
    for (let k = 0; k < numcolumns - rw.length; k++) {
      row.push(new mathmltree.mathnode("mtd", [], style));
    }
    if (group.autotag) {
      const tag = group.tags[i];
      let tagelement;
      if (tag === true) {  // automatic numbering
        tagelement = new mathmltree.mathnode("mtext", [new span(["tml-eqn"])]);
      } else if (tag === false) {
        // \nonumber/\notag or starred environment
        tagelement = new mathmltree.mathnode("mtext", [], []);
      } else {  // manual \tag
        tagelement = buildexpressionrow(tag[0].body, style.withlevel(celllevel), true);
        tagelement = consolidatetext(tagelement);
        tagelement.classes = ["tml-tag"];
      }
      if (tagelement) {
        row.unshift(glue(group));
        row.push(glue(group));
        if (group.leqno) {
          row[0].children.push(tagelement);
          row[0].classes.push("tml-left");
        } else {
          row[row.length - 1].children.push(tagelement);
          row[row.length - 1].classes.push("tml-right");
        }
      }
    }
    const mtr = new mathmltree.mathnode("mtr", row, []);
    const label = group.labels.shift();
    if (label && group.tags && group.tags[i]) {
      mtr.setattribute("id", label);
      if (array.isarray(group.tags[i])) { mtr.classes.push("tml-tageqn"); }
    }

    // write horizontal rules
    if (i === 0 && hlines[0].length > 0) {
      if (hlines[0].length === 2) {
        mtr.children.foreach(cell => { cell.style.bordertop = "0.15em double"; });
      } else {
        mtr.children.foreach(cell => {
          cell.style.bordertop = hlines[0][0] ? "0.06em dashed" : "0.06em solid";
        });
      }
    }
    if (hlines[i + 1].length > 0) {
      if (hlines[i + 1].length === 2) {
        mtr.children.foreach(cell => { cell.style.borderbottom = "0.15em double"; });
      } else {
        mtr.children.foreach(cell => {
          cell.style.borderbottom = hlines[i + 1][0] ? "0.06em dashed" : "0.06em solid";
        });
      }
    }
    tbl.push(mtr);
  }

  if (group.envclasses.length > 0) {
    if (group.arraystretch && group.arraystretch !== 1) {
      // in latex, \arraystretch is a factor applied to a 12pt strut height.
      // it defines a baseline to baseline distance.
      // here, we do an approximation of that approach.
      const pad = string(1.4 * group.arraystretch - 0.8) + "ex";
      for (let i = 0; i < tbl.length; i++) {
        for (let j = 0; j < tbl[i].children.length; j++) {
          tbl[i].children[j].style.paddingtop = pad;
          tbl[i].children[j].style.paddingbottom = pad;
        }
      }
    }
    let sidepadding = group.envclasses.includes("abut")
      ? "0"
      : group.envclasses.includes("cases")
      ? "0"
      : group.envclasses.includes("small")
      ? "0.1389"
      : group.envclasses.includes("cd")
      ? "0.25"
      : "0.4"; // default side padding
    let sidepadunit = "em";
    if (group.arraycolsep) {
      const arraysidepad = calculatesize(group.arraycolsep, style);
      sidepadding = arraysidepad.number.tofixed(4);
      sidepadunit = arraysidepad.unit;
    }

    const numcols = tbl.length === 0 ? 0 : tbl[0].children.length;

    const sidepad = (j, hand) => {
      if (j === 0 && hand === 0) { return "0" }
      if (j === numcols - 1 && hand === 1) { return "0" }
      if (group.envclasses[0] !== "align") { return sidepadding }
      if (hand === 1) { return "0" }
      if (group.autotag) {
        return (j % 2) ? "1" : "0"
      } else {
        return (j % 2) ? "0" : "1"
      }
    };

    // side padding
    for (let i = 0; i < tbl.length; i++) {
      for (let j = 0; j < tbl[i].children.length; j++) {
        tbl[i].children[j].style.paddingleft = `${sidepad(j, 0)}${sidepadunit}`;
        tbl[i].children[j].style.paddingright = `${sidepad(j, 1)}${sidepadunit}`;
      }
    }

    // justification
    const align = group.envclasses.includes("align") || group.envclasses.includes("alignat");
    for (let i = 0; i < tbl.length; i++) {
      const row = tbl[i];
      if (align) {
        for (let j = 0; j < row.children.length; j++) {
          // chromium does not recognize text-align: left. use -webkit-
          // todo: remove -webkit- when chromium no longer needs it.
          row.children[j].classes = ["tml-" + (j % 2 ? "left" : "right")];
        }
        if (group.autotag) {
          const k = group.leqno ? 0 : row.children.length - 1;
          row.children[k].classes = ["tml-" + (group.leqno ? "left" : "right")];
        }
      }
      if (row.children.length > 1 && group.envclasses.includes("cases")) {
        row.children[1].style.paddingleft = "1em";
      }

      if (group.envclasses.includes("cases") || group.envclasses.includes("subarray")) {
        for (const cell of row.children) {
          cell.classes.push("tml-left");
        }
      }
    }
  } else {
    // set zero padding on side of the matrix
    for (let i = 0; i < tbl.length; i++) {
      tbl[i].children[0].style.paddingleft = "0em";
      if (tbl[i].children.length === tbl[0].children.length) {
        tbl[i].children[tbl[i].children.length - 1].style.paddingright = "0em";
      }
    }
  }

  let table = new mathmltree.mathnode("mtable", tbl);
  if (group.envclasses.length > 0) {
    // top & bottom padding
    if (group.envclasses.includes("jot")) {
      table.classes.push("tml-jot");
    } else if (group.envclasses.includes("small")) {
      table.classes.push("tml-small");
    }
  }
  if (group.scriptlevel === "display") { table.setattribute("displaystyle", "true"); }

  if (group.autotag || group.envclasses.includes("multline")) {
    table.style.width = "100%";
  }

  // column separator lines and column alignment
  let align = "";

  if (group.cols && group.cols.length > 0) {
    const cols = group.cols;
    let prevtypewasalign = false;
    let istart = 0;
    let iend = cols.length;

    while (cols[istart].type === "separator") {
      istart += 1;
    }
    while (cols[iend - 1].type === "separator") {
      iend -= 1;
    }

    if (cols[0].type === "separator") {
      const sep = cols[1].type === "separator"
        ? "0.15em double"
        : cols[0].separator === "|"
        ? "0.06em solid "
        : "0.06em dashed ";
      for (const row of table.children) {
        row.children[0].style.borderleft = sep;
      }
    }
    let icol = group.autotag ? 0 : -1;
    for (let i = istart; i < iend; i++) {
      if (cols[i].type === "align") {
        const colalign = alignmap[cols[i].align];
        align += colalign;
        icol += 1;
        for (const row of table.children) {
          if (colalign.trim() !== "center" && icol < row.children.length) {
            row.children[icol].classes = ["tml-" + colalign.trim()];
          }
        }
        prevtypewasalign = true;
      } else if (cols[i].type === "separator") {
        // mathml accepts only single lines between cells.
        // so we read only the first of consecutive separators.
        if (prevtypewasalign) {
          const sep = cols[i + 1].type === "separator"
            ? "0.15em double"
            : cols[i].separator === "|"
            ? "0.06em solid"
            : "0.06em dashed";
          for (const row of table.children) {
            if (icol < row.children.length) {
              row.children[icol].style.borderright = sep;
            }
          }
        }
        prevtypewasalign = false;
      }
    }
    if (cols[cols.length - 1].type === "separator") {
      const sep = cols[cols.length - 2].type === "separator"
        ? "0.15em double"
        : cols[cols.length - 1].separator === "|"
        ? "0.06em solid"
        : "0.06em dashed";
      for (const row of table.children) {
        row.children[row.children.length - 1].style.borderright = sep;
        row.children[row.children.length - 1].style.paddingright = "0.4em";
      }
    }
  }
  if (group.autotag) {
     // allow for glue cells on each side
    align = "left " + (align.length > 0 ? align : "center ") + "right ";
  }
  if (align) {
    // firefox reads this attribute, not the -webkit-left|right written above.
    // todo: when chrome no longer needs "-webkit-", use css and delete the next line.
    table.setattribute("columnalign", align.trim());
  }

  if (group.envclasses.includes("small")) {
    // a small array. wrap in scriptstyle.
    table = new mathmltree.mathnode("mstyle", [table]);
    table.setattribute("scriptlevel", "1");
  }

  return table
};

// convenience function for align, align*, aligned, alignat, alignat*, alignedat, split.
const alignedhandler = function(context, args) {
  if (context.envname.indexof("ed") === -1) {
    validateamsenvironmentcontext(context);
  }
  const issplit = context.envname === "split";
  const cols = [];
  const res = parsearray(
    context.parser,
    {
      cols,
      emptysinglerow: true,
      autotag: issplit ? undefined : getautotag(context.envname),
      envclasses: ["abut", "jot"], // set row spacing & provisional column spacing
      maxnumcols: context.envname === "split" ? 2 : undefined,
      leqno: context.parser.settings.leqno
    },
    "display"
  );

  // determining number of columns.
  // 1. if the first argument is given, we use it as a number of columns,
  //    and makes sure that each row doesn't exceed that number.
  // 2. otherwise, just count number of columns = maximum number
  //    of cells in each row ("aligned" mode -- isaligned will be true).
  //
  // at the same time, prepend empty group {} at beginning of every second
  // cell in each row (starting with second cell) so that operators become
  // binary.  this behavior is implemented in amsmath's \start@aligned.
  let nummaths;
  let numcols = 0;
  const isalignedat = context.envname.indexof("at") > -1;
  if (args[0] && isalignedat) {
    // alignat environment takes an argument w/ number of columns
    let arg0 = "";
    for (let i = 0; i < args[0].body.length; i++) {
      const textord = assertnodetype(args[0].body[i], "textord");
      arg0 += textord.text;
    }
    if (isnan(arg0)) {
      throw new parseerror("the alignat enviroment requires a numeric first argument.")
    }
    nummaths = number(arg0);
    numcols = nummaths * 2;
  }
  res.body.foreach(function(row) {
    if (isalignedat) {
      // case 1
      const curmaths = row.length / 2;
      if (nummaths < curmaths) {
        throw new parseerror(
          "too many math in a row: " + `expected ${nummaths}, but got ${curmaths}`,
          row[0]
        );
      }
    } else if (numcols < row.length) {
      // case 2
      numcols = row.length;
    }
  });

  // adjusting alignment.
  // in aligned mode, we add one \qquad between columns;
  // otherwise we add nothing.
  for (let i = 0; i < numcols; ++i) {
    let align = "r";
    if (i % 2 === 1) {
      align = "l";
    }
    cols[i] = {
      type: "align",
      align: align
    };
  }
  if (context.envname === "split") ; else if (isalignedat) {
    res.envclasses.push("alignat"); // sets justification
  } else {
    res.envclasses[0] = "align"; // sets column spacing & justification
  }
  return res;
};

// arrays are part of latex, defined in lttab.dtx so its documentation
// is part of the source2e.pdf file of latex2e source documentation.
// {darray} is an {array} environment where cells are set in \displaystyle,
// as defined in nccmath.sty.
defineenvironment({
  type: "array",
  names: ["array", "darray"],
  props: {
    numargs: 1
  },
  handler(context, args) {
    // since no types are specified above, the two possibilities are
    // - the argument is wrapped in {} or [], in which case parser's
    //   parsegroup() returns an "ordgroup" wrapping some symbol node.
    // - the argument is a bare symbol node.
    const symnode = checksymbolnodetype(args[0]);
    const colalign = symnode ? [args[0]] : assertnodetype(args[0], "ordgroup").body;
    const cols = colalign.map(function(nde) {
      const node = assertsymbolnodetype(nde);
      const ca = node.text;
      if ("lcr".indexof(ca) !== -1) {
        return {
          type: "align",
          align: ca
        };
      } else if (ca === "|") {
        return {
          type: "separator",
          separator: "|"
        };
      } else if (ca === ":") {
        return {
          type: "separator",
          separator: ":"
        };
      }
      throw new parseerror("unknown column alignment: " + ca, nde);
    });
    const [arraystretch, arraycolsep] = arraygaps(context.parser.gullet.macros);
    const res = {
      cols,
      envclasses: ["array"],
      maxnumcols: cols.length,
      arraystretch,
      arraycolsep
    };
    return parsearray(context.parser, res, dcellstyle(context.envname));
  },
  mathmlbuilder: mathmlbuilder$7
});

// the matrix environments of amsmath builds on the array environment
// of latex, which is discussed above.
// the mathtools package adds starred versions of the same environments.
// these have an optional argument to choose left|center|right justification.
defineenvironment({
  type: "array",
  names: [
    "matrix",
    "pmatrix",
    "bmatrix",
    "bmatrix",
    "vmatrix",
    "vmatrix",
    "matrix*",
    "pmatrix*",
    "bmatrix*",
    "bmatrix*",
    "vmatrix*",
    "vmatrix*"
  ],
  props: {
    numargs: 0
  },
  handler(context) {
    const delimiters = {
      matrix: null,
      pmatrix: ["(", ")"],
      bmatrix: ["[", "]"],
      bmatrix: ["\\{", "\\}"],
      vmatrix: ["|", "|"],
      vmatrix: ["\\vert", "\\vert"]
    }[context.envname.replace("*", "")];
    // \hskip -\arraycolsep in amsmath
    let colalign = "c";
    const payload = {
      envclasses: [],
      cols: []
    };
    if (context.envname.charat(context.envname.length - 1) === "*") {
      // it's one of the mathtools starred functions.
      // parse the optional alignment argument.
      const parser = context.parser;
      parser.consumespaces();
      if (parser.fetch().text === "[") {
        parser.consume();
        parser.consumespaces();
        colalign = parser.fetch().text;
        if ("lcr".indexof(colalign) === -1) {
          throw new parseerror("expected l or c or r", parser.nexttoken);
        }
        parser.consume();
        parser.consumespaces();
        parser.expect("]");
        parser.consume();
        payload.cols = [];
      }
    }
    const res = parsearray(context.parser, payload, "text");
    res.cols = new array(res.body[0].length).fill({ type: "align", align: colalign });
    const [arraystretch, arraycolsep] = arraygaps(context.parser.gullet.macros);
    return delimiters
      ? {
        type: "leftright",
        mode: context.mode,
        body: [res],
        left: delimiters[0],
        right: delimiters[1],
        rightcolor: undefined, // \right uninfluenced by \color in array
        arraystretch,
        arraycolsep
      }
      : res;
  },
  mathmlbuilder: mathmlbuilder$7
});

defineenvironment({
  type: "array",
  names: ["smallmatrix"],
  props: {
    numargs: 0
  },
  handler(context) {
    const payload = { type: "small" };
    const res = parsearray(context.parser, payload, "script");
    res.envclasses = ["small"];
    return res;
  },
  mathmlbuilder: mathmlbuilder$7
});

defineenvironment({
  type: "array",
  names: ["subarray"],
  props: {
    numargs: 1
  },
  handler(context, args) {
    // parsing of {subarray} is similar to {array}
    const symnode = checksymbolnodetype(args[0]);
    const colalign = symnode ? [args[0]] : assertnodetype(args[0], "ordgroup").body;
    const cols = colalign.map(function(nde) {
      const node = assertsymbolnodetype(nde);
      const ca = node.text;
      // {subarray} only recognizes "l" & "c"
      if ("lc".indexof(ca) !== -1) {
        return {
          type: "align",
          align: ca
        };
      }
      throw new parseerror("unknown column alignment: " + ca, nde);
    });
    if (cols.length > 1) {
      throw new parseerror("{subarray} can contain only one column");
    }
    let res = {
      cols,
      envclasses: ["small"]
    };
    res = parsearray(context.parser, res, "script");
    if (res.body.length > 0 && res.body[0].length > 1) {
      throw new parseerror("{subarray} can contain only one column");
    }
    return res;
  },
  mathmlbuilder: mathmlbuilder$7
});

// a cases environment (in amsmath.sty) is almost equivalent to
// \def
// \left\{\begin{array}{@{}l@{\quad}l@{}} ‚Ä¶ \end{array}\right.
// {dcases} is a {cases} environment where cells are set in \displaystyle,
// as defined in mathtools.sty.
// {rcases} is another mathtools environment. it's brace is on the right side.
defineenvironment({
  type: "array",
  names: ["cases", "dcases", "rcases", "drcases"],
  props: {
    numargs: 0
  },
  handler(context) {
    const payload = {
      cols: [],
      envclasses: ["cases"]
    };
    const res = parsearray(context.parser, payload, dcellstyle(context.envname));
    return {
      type: "leftright",
      mode: context.mode,
      body: [res],
      left: context.envname.indexof("r") > -1 ? "." : "\\{",
      right: context.envname.indexof("r") > -1 ? "\\}" : ".",
      rightcolor: undefined
    };
  },
  mathmlbuilder: mathmlbuilder$7
});

// in the align environment, one uses ampersands, &, to specify number of
// columns in each row, and to locate spacing between each column.
// align gets automatic numbering. align* and aligned do not.
// the alignedat environment can be used in math mode.
defineenvironment({
  type: "array",
  names: ["align", "align*", "aligned", "split"],
  props: {
    numargs: 0
  },
  handler: alignedhandler,
  mathmlbuilder: mathmlbuilder$7
});

// alignat environment is like an align environment, but one must explicitly
// specify maximum number of columns in each row, and can adjust where spacing occurs.
defineenvironment({
  type: "array",
  names: ["alignat", "alignat*", "alignedat"],
  props: {
    numargs: 1
  },
  handler: alignedhandler,
  mathmlbuilder: mathmlbuilder$7
});

// a gathered environment is like an array environment with one centered
// column, but where rows are considered lines so get \jot line spacing
// and contents are set in \displaystyle.
defineenvironment({
  type: "array",
  names: ["gathered", "gather", "gather*"],
  props: {
    numargs: 0
  },
  handler(context) {
    if (context.envname !== "gathered") {
      validateamsenvironmentcontext(context);
    }
    const res = {
      cols: [],
      envclasses: ["abut", "jot"],
      autotag: getautotag(context.envname),
      emptysinglerow: true,
      leqno: context.parser.settings.leqno
    };
    return parsearray(context.parser, res, "display");
  },
  mathmlbuilder: mathmlbuilder$7
});

defineenvironment({
  type: "array",
  names: ["equation", "equation*"],
  props: {
    numargs: 0
  },
  handler(context) {
    validateamsenvironmentcontext(context);
    const res = {
      autotag: getautotag(context.envname),
      emptysinglerow: true,
      singlerow: true,
      maxnumcols: 1,
      envclasses: ["align"],
      leqno: context.parser.settings.leqno
    };
    return parsearray(context.parser, res, "display");
  },
  mathmlbuilder: mathmlbuilder$7
});

defineenvironment({
  type: "array",
  names: ["multline", "multline*"],
  props: {
    numargs: 0
  },
  handler(context) {
    validateamsenvironmentcontext(context);
    const res = {
      autotag: context.envname === "multline",
      maxnumcols: 1,
      envclasses: ["jot", "multline"],
      leqno: context.parser.settings.leqno
    };
    return parsearray(context.parser, res, "display");
  },
  mathmlbuilder: mathmlbuilder$7
});

defineenvironment({
  type: "array",
  names: ["cd"],
  props: {
    numargs: 0
  },
  handler(context) {
    validateamsenvironmentcontext(context);
    return parsecd(context.parser);
  },
  mathmlbuilder: mathmlbuilder$7
});

// catch \hline outside array environment
definefunction({
  type: "text", // doesn't matter what this is.
  names: ["\\hline", "\\hdashline"],
  props: {
    numargs: 0,
    allowedintext: true,
    allowedinmath: true
  },
  handler(context, args) {
    throw new parseerror(`${context.funcname} valid only within array environment`);
  }
});

const environments = _environments;

// environment delimiters. html/mathml rendering is defined in the corresponding
// defineenvironment definitions.
definefunction({
  type: "environment",
  names: ["\\begin", "\\end"],
  props: {
    numargs: 1,
    argtypes: ["text"]
  },
  handler({ parser, funcname }, args) {
    const namegroup = args[0];
    if (namegroup.type !== "ordgroup") {
      throw new parseerror("invalid environment name", namegroup);
    }
    let envname = "";
    for (let i = 0; i < namegroup.body.length; ++i) {
      envname += assertnodetype(namegroup.body[i], "textord").text;
    }

    if (funcname === "\\begin") {
      // begin...end is similar to left...right
      if (!object.prototype.hasownproperty.call(environments, envname )) {
        throw new parseerror("no such environment: " + envname, namegroup);
      }
      // build the environment object. arguments and other information will
      // be made available to the begin and end methods using properties.
      const env = environments[envname];
      const { args, optargs } = parser.parsearguments("\\begin{" + envname + "}", env);
      const context = {
        mode: parser.mode,
        envname,
        parser
      };
      const result = env.handler(context, args, optargs);
      parser.expect("\\end", false);
      const endnametoken = parser.nexttoken;
      const end = assertnodetype(parser.parsefunction(), "environment");
      if (end.name !== envname) {
        throw new parseerror(
          `mismatch: \\begin{${envname}} matched by \\end{${end.name}}`,
          endnametoken
        );
      }
      return result;
    }

    return {
      type: "environment",
      mode: parser.mode,
      name: envname,
      namegroup
    };
  }
});

definefunction({
  type: "envtag",
  names: ["\\env@tag"],
  props: {
    numargs: 1,
    argtypes: ["math"]
  },
  handler({ parser }, args) {
    return {
      type: "envtag",
      mode: parser.mode,
      body: args[0]
    };
  },
  mathmlbuilder(group, style) {
    return new mathmltree.mathnode("mrow");
  }
});

definefunction({
  type: "notag",
  names: ["\\env@notag"],
  props: {
    numargs: 0
  },
  handler({ parser }) {
    return {
      type: "notag",
      mode: parser.mode
    };
  },
  mathmlbuilder(group, style) {
    return new mathmltree.mathnode("mrow");
  }
});

const islongvariablename = (group, font) => {
  if (font !== "mathrm" || group.body.type !== "ordgroup" || group.body.body.length === 1) {
    return false
  }
  if (group.body.body[0].type !== "mathord") { return false }
  for (let i = 1; i < group.body.body.length; i++) {
    const parsenodetype = group.body.body[i].type;
    if (!(parsenodetype ===  "mathord" ||
    (parsenodetype ===  "textord" && !isnan(group.body.body[i].text)))) {
      return false
    }
  }
  return true
};

const mathmlbuilder$6 = (group, style) => {
  const font = group.font;
  const newstyle = style.withfont(font);
  const mathgroup = buildgroup$1(group.body, newstyle);

  if (mathgroup.children.length === 0) { return mathgroup } // empty group, e.g., \mathrm{}
  if (font === "boldsymbol" && ["mo", "mpadded", "mrow"].includes(mathgroup.type)) {
    mathgroup.style.fontweight = "bold";
    return mathgroup
  }
  // check if it is possible to consolidate elements into a single <mi> element.
  if (islongvariablename(group, font)) {
    // this is a \mathrm{‚Ä¶} group. it gets special treatment because symbolsord.js
    // wraps <mi> elements with <mrow>s to work around a firefox bug.
    const mi = mathgroup.children[0].children[0];
    delete mi.attributes.mathvariant;
    for (let i = 1; i < mathgroup.children.length; i++) {
      mi.children[0].text += mathgroup.children[i].type === "mn"
        ? mathgroup.children[i].children[0].text
        : mathgroup.children[i].children[0].children[0].text;
    }
    // wrap in a <mrow> to prevent the same firefox bug.
    const bogus = new mathmltree.mathnode("mtext", new mathmltree.textnode("\u200b"));
    return new mathmltree.mathnode("mrow", [bogus, mi])
  }
  let canconsolidate = mathgroup.children[0].type === "mo";
  for (let i = 1; i < mathgroup.children.length; i++) {
    if (mathgroup.children[i].type === "mo" && font === "boldsymbol") {
      mathgroup.children[i].style.fontweight = "bold";
    }
    if (mathgroup.children[i].type !== "mi") { canconsolidate = false; }
    const localvariant = mathgroup.children[i].attributes &&
      mathgroup.children[i].attributes.mathvariant || "";
    if (localvariant !== "normal") { canconsolidate = false; }
  }
  if (!canconsolidate) { return mathgroup }
  // consolidate the <mi> elements.
  const mi = mathgroup.children[0];
  for (let i = 1; i < mathgroup.children.length; i++) {
    mi.children.push(mathgroup.children[i].children[0]);
  }
  if (mi.attributes.mathvariant && mi.attributes.mathvariant === "normal") {
    // workaround for a firefox bug that renders spurious space around
    // a <mi mathvariant="normal">
    // ref: https://bugs.webkit.org/show_bug.cgi?id=129097
    // we insert a text node that contains a zero-width space and wrap in an mrow.
    // todo: get rid of this <mi> workaround when the firefox bug is fixed.
    const bogus = new mathmltree.mathnode("mtext", new mathmltree.textnode("\u200b"));
    return new mathmltree.mathnode("mrow", [bogus, mi])
  }
  return mi
};

const fontaliases = {
  "\\bbb": "\\mathbb",
  "\\bold": "\\mathbf",
  "\\frak": "\\mathfrak",
  "\\bm": "\\boldsymbol"
};

definefunction({
  type: "font",
  names: [
    // styles
    "\\mathrm",
    "\\mathit",
    "\\mathbf",
    "\\mathnormal",
    "\\up@greek",
    "\\boldsymbol",

    // families
    "\\mathbb",
    "\\mathcal",
    "\\mathfrak",
    "\\mathscr",
    "\\mathsf",
    "\\mathsfit",
    "\\mathtt",

    // aliases
    "\\bbb",
    "\\bm",
    "\\bold",
    "\\frak"
  ],
  props: {
    numargs: 1,
    allowedinargument: true
  },
  handler: ({ parser, funcname }, args) => {
    const body = normalizeargument(args[0]);
    let func = funcname;
    if (func in fontaliases) {
      func = fontaliases[func];
    }
    return {
      type: "font",
      mode: parser.mode,
      font: func.slice(1),
      body
    };
  },
  mathmlbuilder: mathmlbuilder$6
});

// old font changing functions
definefunction({
  type: "font",
  names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it", "\\cal"],
  props: {
    numargs: 0,
    allowedintext: true
  },
  handler: ({ parser, funcname, breakontokentext }, args) => {
    const { mode } = parser;
    const body = parser.parseexpression(true, breakontokentext, true);
    const fontstyle = `math${funcname.slice(1)}`;

    return {
      type: "font",
      mode: mode,
      font: fontstyle,
      body: {
        type: "ordgroup",
        mode: parser.mode,
        body
      }
    };
  },
  mathmlbuilder: mathmlbuilder$6
});

const stylarray = ["display", "text", "script", "scriptscript"];
const scriptlevel = { auto: -1, display: 0, text: 0, script: 1, scriptscript: 2 };

const mathmlbuilder$5 = (group, style) => {
  // track the scriptlevel of the numerator and denominator.
  // we may need that info for \mathchoice or for adjusting em dimensions.
  const childoptions = group.scriptlevel === "auto"
    ? style.incrementlevel()
    : group.scriptlevel === "display"
    ? style.withlevel(stylelevel.text)
    : group.scriptlevel === "text"
    ? style.withlevel(stylelevel.script)
    : style.withlevel(stylelevel.scriptscript);

  // chromium (wrongly) continues to shrink fractions beyond scriptscriptlevel.
  // so we check for levels that chromium shrinks too small.
  // if necessary, set an explicit fraction depth.
  const numer = buildgroup$1(group.numer, childoptions);
  const denom = buildgroup$1(group.denom, childoptions);
  if (style.level === 3) {
    numer.style.mathdepth = "2";
    numer.setattribute("scriptlevel", "2");
    denom.style.mathdepth = "2";
    denom.setattribute("scriptlevel", "2");
  }

  let node = new mathmltree.mathnode("mfrac", [numer, denom]);

  if (!group.hasbarline) {
    node.setattribute("linethickness", "0px");
  } else if (group.barsize) {
    const rulewidth = calculatesize(group.barsize, style);
    node.setattribute("linethickness", rulewidth.number + rulewidth.unit);
  }

  if (group.leftdelim != null || group.rightdelim != null) {
    const withdelims = [];

    if (group.leftdelim != null) {
      const leftop = new mathmltree.mathnode("mo", [
        new mathmltree.textnode(group.leftdelim.replace("\\", ""))
      ]);
      leftop.setattribute("fence", "true");
      withdelims.push(leftop);
    }

    withdelims.push(node);

    if (group.rightdelim != null) {
      const rightop = new mathmltree.mathnode("mo", [
        new mathmltree.textnode(group.rightdelim.replace("\\", ""))
      ]);
      rightop.setattribute("fence", "true");
      withdelims.push(rightop);
    }

    node = makerow(withdelims);
  }

  if (group.scriptlevel !== "auto") {
    node = new mathmltree.mathnode("mstyle", [node]);
    node.setattribute("displaystyle", string(group.scriptlevel === "display"));
    node.setattribute("scriptlevel", scriptlevel[group.scriptlevel]);
  }

  return node;
};

definefunction({
  type: "genfrac",
  names: [
    "\\dfrac",
    "\\frac",
    "\\tfrac",
    "\\dbinom",
    "\\binom",
    "\\tbinom",
    "\\\\atopfrac", // can‚Äôt be entered directly
    "\\\\bracefrac",
    "\\\\brackfrac" // ditto
  ],
  props: {
    numargs: 2,
    allowedinargument: true
  },
  handler: ({ parser, funcname }, args) => {
    const numer = args[0];
    const denom = args[1];
    let hasbarline = false;
    let leftdelim = null;
    let rightdelim = null;
    let scriptlevel = "auto";

    switch (funcname) {
      case "\\dfrac":
      case "\\frac":
      case "\\tfrac":
        hasbarline = true;
        break;
      case "\\\\atopfrac":
        hasbarline = false;
        break;
      case "\\dbinom":
      case "\\binom":
      case "\\tbinom":
        leftdelim = "(";
        rightdelim = ")";
        break;
      case "\\\\bracefrac":
        leftdelim = "\\{";
        rightdelim = "\\}";
        break;
      case "\\\\brackfrac":
        leftdelim = "[";
        rightdelim = "]";
        break;
      default:
        throw new error("unrecognized genfrac command");
    }

    switch (funcname) {
      case "\\dfrac":
      case "\\dbinom":
        scriptlevel = "display";
        break;
      case "\\tfrac":
      case "\\tbinom":
        scriptlevel = "text";
        break;
    }

    return {
      type: "genfrac",
      mode: parser.mode,
      continued: false,
      numer,
      denom,
      hasbarline,
      leftdelim,
      rightdelim,
      scriptlevel,
      barsize: null
    };
  },
  mathmlbuilder: mathmlbuilder$5
});

definefunction({
  type: "genfrac",
  names: ["\\cfrac"],
  props: {
    numargs: 2
  },
  handler: ({ parser, funcname }, args) => {
    const numer = args[0];
    const denom = args[1];

    return {
      type: "genfrac",
      mode: parser.mode,
      continued: true,
      numer,
      denom,
      hasbarline: true,
      leftdelim: null,
      rightdelim: null,
      scriptlevel: "display",
      barsize: null
    };
  }
});

// infix generalized fractions -- these are not rendered directly, but replaced
// immediately by one of the variants above.
definefunction({
  type: "infix",
  names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
  props: {
    numargs: 0,
    infix: true
  },
  handler({ parser, funcname, token }) {
    let replacewith;
    switch (funcname) {
      case "\\over":
        replacewith = "\\frac";
        break;
      case "\\choose":
        replacewith = "\\binom";
        break;
      case "\\atop":
        replacewith = "\\\\atopfrac";
        break;
      case "\\brace":
        replacewith = "\\\\bracefrac";
        break;
      case "\\brack":
        replacewith = "\\\\brackfrac";
        break;
      default:
        throw new error("unrecognized infix genfrac command");
    }
    return {
      type: "infix",
      mode: parser.mode,
      replacewith,
      token
    };
  }
});

const delimfromvalue = function(delimstring) {
  let delim = null;
  if (delimstring.length > 0) {
    delim = delimstring;
    delim = delim === "." ? null : delim;
  }
  return delim;
};

definefunction({
  type: "genfrac",
  names: ["\\genfrac"],
  props: {
    numargs: 6,
    allowedinargument: true,
    argtypes: ["math", "math", "size", "text", "math", "math"]
  },
  handler({ parser }, args) {
    const numer = args[4];
    const denom = args[5];

    // look into the parse nodes to get the desired delimiters.
    const leftnode = normalizeargument(args[0]);
    const leftdelim = leftnode.type === "atom" && leftnode.family === "open"
      ? delimfromvalue(leftnode.text)
      : null;
    const rightnode = normalizeargument(args[1]);
    const rightdelim =
      rightnode.type === "atom" && rightnode.family === "close"
        ? delimfromvalue(rightnode.text)
        : null;

    const barnode = assertnodetype(args[2], "size");
    let hasbarline;
    let barsize = null;
    if (barnode.isblank) {
      // \genfrac acts differently than \above.
      // \genfrac treats an empty size group as a signal to use a
      // standard bar size. \above would see size = 0 and omit the bar.
      hasbarline = true;
    } else {
      barsize = barnode.value;
      hasbarline = barsize.number > 0;
    }

    // find out if we want displaystyle, textstyle, etc.
    let scriptlevel = "auto";
    let styl = args[3];
    if (styl.type === "ordgroup") {
      if (styl.body.length > 0) {
        const textord = assertnodetype(styl.body[0], "textord");
        scriptlevel = stylarray[number(textord.text)];
      }
    } else {
      styl = assertnodetype(styl, "textord");
      scriptlevel = stylarray[number(styl.text)];
    }

    return {
      type: "genfrac",
      mode: parser.mode,
      numer,
      denom,
      continued: false,
      hasbarline,
      barsize,
      leftdelim,
      rightdelim,
      scriptlevel
    };
  },
  mathmlbuilder: mathmlbuilder$5
});

// \above is an infix fraction that also defines a fraction bar size.
definefunction({
  type: "infix",
  names: ["\\above"],
  props: {
    numargs: 1,
    argtypes: ["size"],
    infix: true
  },
  handler({ parser, funcname, token }, args) {
    return {
      type: "infix",
      mode: parser.mode,
      replacewith: "\\\\abovefrac",
      barsize: assertnodetype(args[0], "size").value,
      token
    };
  }
});

definefunction({
  type: "genfrac",
  names: ["\\\\abovefrac"],
  props: {
    numargs: 3,
    argtypes: ["math", "size", "math"]
  },
  handler: ({ parser, funcname }, args) => {
    const numer = args[0];
    const barsize = assert(assertnodetype(args[1], "infix").barsize);
    const denom = args[2];

    const hasbarline = barsize.number > 0;
    return {
      type: "genfrac",
      mode: parser.mode,
      numer,
      denom,
      continued: false,
      hasbarline,
      barsize,
      leftdelim: null,
      rightdelim: null,
      scriptlevel: "auto"
    };
  },

  mathmlbuilder: mathmlbuilder$5
});

// \hbox is provided for compatibility with latex functions that act on a box.
// this function by itself doesn't do anything but set scriptlevel to \textstyle
// and prevent a soft line break.

definefunction({
  type: "hbox",
  names: ["\\hbox"],
  props: {
    numargs: 1,
    argtypes: ["hbox"],
    allowedinargument: true,
    allowedintext: false
  },
  handler({ parser }, args) {
    return {
      type: "hbox",
      mode: parser.mode,
      body: ordargument(args[0])
    };
  },
  mathmlbuilder(group, style) {
    const newstyle = style.withlevel(stylelevel.text);
    const mrow = buildexpressionrow(group.body, newstyle);
    return consolidatetext(mrow)
  }
});

const mathmlbuilder$4 = (group, style) => {
  const accentnode = stretchy.mathmlnode(group.label);
  accentnode.style["math-depth"] = 0;
  return new mathmltree.mathnode(group.isover ? "mover" : "munder", [
    buildgroup$1(group.base, style),
    accentnode
  ]);
};

// horizontal stretchy braces
definefunction({
  type: "horizbrace",
  names: ["\\overbrace", "\\underbrace"],
  props: {
    numargs: 1
  },
  handler({ parser, funcname }, args) {
    return {
      type: "horizbrace",
      mode: parser.mode,
      label: funcname,
      isover: /^\\over/.test(funcname),
      base: args[0]
    };
  },
  mathmlbuilder: mathmlbuilder$4
});

definefunction({
  type: "href",
  names: ["\\href"],
  props: {
    numargs: 2,
    argtypes: ["url", "original"],
    allowedintext: true
  },
  handler: ({ parser, token }, args) => {
    const body = args[1];
    const href = assertnodetype(args[0], "url").url;

    if (
      !parser.settings.istrusted({
        command: "\\href",
        url: href
      })
    ) {
      throw new parseerror(`function "\\href" is not trusted`, token)
    }

    return {
      type: "href",
      mode: parser.mode,
      href,
      body: ordargument(body)
    };
  },
  mathmlbuilder: (group, style) => {
    const math = new mathnode("math", [buildexpressionrow(group.body, style)]);
    const anchornode = new anchornode(group.href, [], [math]);
    return anchornode
  }
});

definefunction({
  type: "href",
  names: ["\\url"],
  props: {
    numargs: 1,
    argtypes: ["url"],
    allowedintext: true
  },
  handler: ({ parser, token }, args) => {
    const href = assertnodetype(args[0], "url").url;

    if (
      !parser.settings.istrusted({
        command: "\\url",
        url: href
      })
    ) {
      throw new parseerror(`function "\\url" is not trusted`, token)
    }

    const chars = [];
    for (let i = 0; i < href.length; i++) {
      let c = href[i];
      if (c === "~") {
        c = "\\textasciitilde";
      }
      chars.push({
        type: "textord",
        mode: "text",
        text: c
      });
    }
    const body = {
      type: "text",
      mode: parser.mode,
      font: "\\texttt",
      body: chars
    };
    return {
      type: "href",
      mode: parser.mode,
      href,
      body: ordargument(body)
    };
  }
});

definefunction({
  type: "html",
  names: ["\\class", "\\id", "\\style", "\\data"],
  props: {
    numargs: 2,
    argtypes: ["raw", "original"],
    allowedintext: true
  },
  handler: ({ parser, funcname, token }, args) => {
    const value = assertnodetype(args[0], "raw").string;
    const body = args[1];

    if (parser.settings.strict) {
      throw new parseerror(`function "${funcname}" is disabled in strict mode`, token)
    }

    let trustcontext;
    const attributes = {};

    switch (funcname) {
      case "\\class":
        attributes.class = value;
        trustcontext = {
          command: "\\class",
          class: value
        };
        break;
      case "\\id":
        attributes.id = value;
        trustcontext = {
          command: "\\id",
          id: value
        };
        break;
      case "\\style":
        attributes.style = value;
        trustcontext = {
          command: "\\style",
          style: value
        };
        break;
      case "\\data": {
        const data = value.split(",");
        for (let i = 0; i < data.length; i++) {
          const keyval = data[i].split("=");
          if (keyval.length !== 2) {
            throw new parseerror("error parsing key-value for \\data");
          }
          attributes["data-" + keyval[0].trim()] = keyval[1].trim();
        }

        trustcontext = {
          command: "\\data",
          attributes
        };
        break;
      }
      default:
        throw new error("unrecognized html command");
    }

    if (!parser.settings.istrusted(trustcontext)) {
      throw new parseerror(`function "${funcname}" is not trusted`, token)
    }
    return {
      type: "html",
      mode: parser.mode,
      attributes,
      body: ordargument(body)
    };
  },
  mathmlbuilder: (group, style) => {
    const element =  buildexpressionrow(group.body, style);

    const classes = [];
    if (group.attributes.class) {
      classes.push(...group.attributes.class.trim().split(/\s+/));
    }
    element.classes = classes;

    for (const attr in group.attributes) {
      if (attr !== "class" && object.prototype.hasownproperty.call(group.attributes, attr)) {
        element.setattribute(attr, group.attributes[attr]);
      }
    }

    return element;
  }
});

const sizedata = function(str) {
  if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(str)) {
    // str is a number with no unit specified.
    // default unit is bp, per graphix package.
    return { number: +str, unit: "bp" }
  } else {
    const match = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(str);
    if (!match) {
      throw new parseerror("invalid size: '" + str + "' in \\includegraphics");
    }
    const data = {
      number: +(match[1] + match[2]), // sign + magnitude, cast to number
      unit: match[3]
    };
    if (!validunit(data)) {
      throw new parseerror("invalid unit: '" + data.unit + "' in \\includegraphics.");
    }
    return data
  }
};

definefunction({
  type: "includegraphics",
  names: ["\\includegraphics"],
  props: {
    numargs: 1,
    numoptionalargs: 1,
    argtypes: ["raw", "url"],
    allowedintext: false
  },
  handler: ({ parser, token }, args, optargs) => {
    let width = { number: 0, unit: "em" };
    let height = { number: 0.9, unit: "em" };  // sorta character sized.
    let totalheight = { number: 0, unit: "em" };
    let alt = "";

    if (optargs[0]) {
      const attributestr = assertnodetype(optargs[0], "raw").string;

      // parser.js does not parse key/value pairs. we get a string.
      const attributes = attributestr.split(",");
      for (let i = 0; i < attributes.length; i++) {
        const keyval = attributes[i].split("=");
        if (keyval.length === 2) {
          const str = keyval[1].trim();
          switch (keyval[0].trim()) {
            case "alt":
              alt = str;
              break
            case "width":
              width = sizedata(str);
              break
            case "height":
              height = sizedata(str);
              break
            case "totalheight":
              totalheight = sizedata(str);
              break
            default:
              throw new parseerror("invalid key: '" + keyval[0] + "' in \\includegraphics.")
          }
        }
      }
    }

    const src = assertnodetype(args[0], "url").url;

    if (alt === "") {
      // no alt given. use the file name. strip away the path.
      alt = src;
      alt = alt.replace(/^.*[\\/]/, "");
      alt = alt.substring(0, alt.lastindexof("."));
    }

    if (
      !parser.settings.istrusted({
        command: "\\includegraphics",
        url: src
      })
    ) {
      throw new parseerror(`function "\\includegraphics" is not trusted`, token)
    }

    return {
      type: "includegraphics",
      mode: parser.mode,
      alt: alt,
      width: width,
      height: height,
      totalheight: totalheight,
      src: src
    }
  },
  mathmlbuilder: (group, style) => {
    const height = calculatesize(group.height, style);
    const depth = { number: 0, unit: "em" };

    if (group.totalheight.number > 0) {
      if (group.totalheight.unit === height.unit &&
        group.totalheight.number > height.number) {
        depth.number = group.totalheight.number - height.number;
        depth.unit = height.unit;
      }
    }

    let width = 0;
    if (group.width.number > 0) {
      width = calculatesize(group.width, style);
    }

    const graphicstyle = { height: height.number + depth.number + "em" };
    if (width.number > 0) {
      graphicstyle.width = width.number + width.unit;
    }
    if (depth.number > 0) {
      graphicstyle.verticalalign = -depth.number + depth.unit;
    }

    const node = new img(group.src, group.alt, graphicstyle);
    node.height = height;
    node.depth = depth;
    return new mathmltree.mathnode("mtext", [node])
  }
});

// horizontal spacing commands


// todo: \hskip and \mskip should support plus and minus in lengths

definefunction({
  type: "kern",
  names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
  props: {
    numargs: 1,
    argtypes: ["size"],
    primitive: true,
    allowedintext: true
  },
  handler({ parser, funcname, token }, args) {
    const size = assertnodetype(args[0], "size");
    if (parser.settings.strict) {
      const mathfunction = funcname[1] === "m"; // \mkern, \mskip
      const muunit = size.value.unit === "mu";
      if (mathfunction) {
        if (!muunit) {
          throw new parseerror(`latex's ${funcname} supports only mu units, ` +
            `not ${size.value.unit} units`, token)
        }
        if (parser.mode !== "math") {
          throw new parseerror(`latex's ${funcname} works only in math mode`, token)
        }
      } else {
        // !mathfunction
        if (muunit) {
          throw new parseerror(`latex's ${funcname} doesn't support mu units`, token)
        }
      }
    }
    return {
      type: "kern",
      mode: parser.mode,
      dimension: size.value
    };
  },
  mathmlbuilder(group, style) {
    const dimension = calculatesize(group.dimension, style);
    const ch = dimension.unit === "em" ? spacecharacter(dimension.number) : "";
    if (group.mode === "text" && ch.length > 0) {
      const character = new mathmltree.textnode(ch);
      return new mathmltree.mathnode("mtext", [character]);
    } else {
      const node = new mathmltree.mathnode("mspace");
      node.setattribute("width", dimension.number + dimension.unit);
      if (dimension.number < 0) {
        node.style.marginleft = dimension.number + dimension.unit;
      }
      return node;
    }
  }
});

const spacecharacter = function(width) {
  if (width >= 0.05555 && width <= 0.05556) {
    return "\u200a"; // &verythinspace;
  } else if (width >= 0.1666 && width <= 0.1667) {
    return "\u2009"; // &thinspace;
  } else if (width >= 0.2222 && width <= 0.2223) {
    return "\u2005"; // &mediumspace;
  } else if (width >= 0.2777 && width <= 0.2778) {
    return "\u2005\u200a"; // &thickspace;
  } else {
    return "";
  }
};

// limit valid characters to a small set, for safety.
const invalididregex = /[^a-za-z_0-9-]/g;

definefunction({
  type: "label",
  names: ["\\label"],
  props: {
    numargs: 1,
    argtypes: ["raw"]
  },
  handler({ parser }, args) {
    return {
      type: "label",
      mode: parser.mode,
      string: args[0].string.replace(invalididregex, "")
    };
  },
  mathmlbuilder(group, style) {
    // return a no-width, no-ink element with an html id.
    const node = new mathmltree.mathnode("mrow", [], ["tml-label"]);
    if (group.string.length > 0) {
      node.setlabel(group.string);
    }
    return node
  }
});

// horizontal overlap functions

const textmodelap = ["\\clap", "\\llap", "\\rlap"];

definefunction({
  type: "lap",
  names: ["\\mathllap", "\\mathrlap", "\\mathclap", "\\clap", "\\llap", "\\rlap"],
  props: {
    numargs: 1,
    allowedintext: true
  },
  handler: ({ parser, funcname, token }, args) => {
    if (textmodelap.includes(funcname)) {
      if (parser.settings.strict && parser.mode !== "text") {
        throw new parseerror(`{${funcname}} can be used only in text mode.
 try \\math${funcname.slice(1)}`, token)
      }
      funcname = funcname.slice(1);
    } else {
      funcname = funcname.slice(5);
    }
    const body = args[0];
    return {
      type: "lap",
      mode: parser.mode,
      alignment: funcname,
      body
    }
  },
  mathmlbuilder: (group, style) => {
    // mathllap, mathrlap, mathclap
    let strut;
    if (group.alignment === "llap") {
      // we need an invisible strut with the same depth as the group.
      // we can't just read the depth, so we use \vphantom methods.
      const phantominner = buildexpression(ordargument(group.body), style);
      const phantom = new mathmltree.mathnode("mphantom", phantominner);
      strut = new mathmltree.mathnode("mpadded", [phantom]);
      strut.setattribute("width", "0px");
    }

    const inner = buildgroup$1(group.body, style);
    let node;
    if (group.alignment === "llap") {
      inner.style.position = "absolute";
      inner.style.right = "0";
      inner.style.bottom = `0`; // if we could have read the ink depth, it would go here.
      node = new mathmltree.mathnode("mpadded", [strut, inner]);
    } else {
      node = new mathmltree.mathnode("mpadded", [inner]);
    }

    if (group.alignment === "rlap") {
      if (group.body.body.length > 0 && group.body.body[0].type === "genfrac") {
        // in firefox, a <mpadded> squashes the 3/18em padding of a child \frac. put it back.
        node.setattribute("lspace", "0.16667em");
      }
    } else {
      const offset = group.alignment === "llap" ? "-1" : "-0.5";
      node.setattribute("lspace", offset + "width");
      if (group.alignment === "llap") {
        node.style.position = "relative";
      } else {
        node.style.display = "flex";
        node.style.justifycontent = "center";
      }
    }
    node.setattribute("width", "0px");
    return node
  }
});

// switching from text mode back to math mode
definefunction({
  type: "ordgroup",
  names: ["\\(", "$"],
  props: {
    numargs: 0,
    allowedintext: true,
    allowedinmath: false
  },
  handler({ funcname, parser }, args) {
    const outermode = parser.mode;
    parser.switchmode("math");
    const close = funcname === "\\(" ? "\\)" : "$";
    const body = parser.parseexpression(false, close);
    parser.expect(close);
    parser.switchmode(outermode);
    return {
      type: "ordgroup",
      mode: parser.mode,
      body
    };
  }
});

// check for extra closing math delimiters
definefunction({
  type: "text", // doesn't matter what this is.
  names: ["\\)", "\\]"],
  props: {
    numargs: 0,
    allowedintext: true,
    allowedinmath: false
  },
  handler(context, token) {
    throw new parseerror(`mismatched ${context.funcname}`, token);
  }
});

const choosestyle = (group, style) => {
  switch (style.level) {
    case stylelevel.display:       // 0
      return group.display;
    case stylelevel.text:          // 1
      return group.text;
    case stylelevel.script:        // 2
      return group.script;
    case stylelevel.scriptscript:  // 3
      return group.scriptscript;
    default:
      return group.text;
  }
};

definefunction({
  type: "mathchoice",
  names: ["\\mathchoice"],
  props: {
    numargs: 4,
    primitive: true
  },
  handler: ({ parser }, args) => {
    return {
      type: "mathchoice",
      mode: parser.mode,
      display: ordargument(args[0]),
      text: ordargument(args[1]),
      script: ordargument(args[2]),
      scriptscript: ordargument(args[3])
    };
  },
  mathmlbuilder: (group, style) => {
    const body = choosestyle(group, style);
    return buildexpressionrow(body, style);
  }
});

const textatomtypes = ["text", "textord", "mathord", "atom"];

const padding = width => {
  const node = new mathmltree.mathnode("mspace");
  node.setattribute("width", width + "em");
  return node
};

function mathmlbuilder$3(group, style) {
  let node;
  const inner = buildexpression(group.body, style);

  if (group.mclass === "minner") {
    node = new mathmltree.mathnode("mpadded", inner);
  } else if (group.mclass === "mord") {
    if (group.ischaracterbox || inner[0].type === "mathord") {
      node = inner[0];
      node.type = "mi";
      if (node.children.length === 1 && node.children[0].text && node.children[0].text === "‚àá") {
        node.setattribute("mathvariant", "normal");
      }
    } else {
      node = new mathmltree.mathnode("mi", inner);
    }
  } else {
    node = new mathmltree.mathnode("mrow", inner);
    if (group.mustpromote) {
      node = inner[0];
      node.type = "mo";
      if (group.ischaracterbox && group.body[0].text && /[a-za-z]/.test(group.body[0].text)) {
        node.setattribute("mathvariant", "italic");
      }
    } else {
      node = new mathmltree.mathnode("mrow", inner);
    }

    // set spacing based on what is the most likely adjacent atom type.
    // see texbook p170.
    const dospacing = style.level < 2; // operator spacing is zero inside a (sub|super)script.
    if (node.type === "mrow") {
      if (dospacing ) {
        if (group.mclass === "mbin") {
          // medium space
          node.children.unshift(padding(0.2222));
          node.children.push(padding(0.2222));
        } else if (group.mclass === "mrel") {
          // thickspace
          node.children.unshift(padding(0.2778));
          node.children.push(padding(0.2778));
        } else if (group.mclass === "mpunct") {
          node.children.push(padding(0.1667));
        } else if (group.mclass === "minner") {
          node.children.unshift(padding(0.0556));  // 1 mu is the most likely option
          node.children.push(padding(0.0556));
        }
      }
    } else {
      if (group.mclass === "mbin") {
        // medium space
        node.attributes.lspace = (dospacing ? "0.2222em" : "0");
        node.attributes.rspace = (dospacing ? "0.2222em" : "0");
      } else if (group.mclass === "mrel") {
        // thickspace
        node.attributes.lspace = (dospacing ? "0.2778em" : "0");
        node.attributes.rspace = (dospacing ? "0.2778em" : "0");
      } else if (group.mclass === "mpunct") {
        node.attributes.lspace = "0em";
        node.attributes.rspace = (dospacing ? "0.1667em" : "0");
      } else if (group.mclass === "mopen" || group.mclass === "mclose") {
        node.attributes.lspace = "0em";
        node.attributes.rspace = "0em";
      } else if (group.mclass === "minner" && dospacing) {
        node.attributes.lspace = "0.0556em"; // 1 mu is the most likely option
        node.attributes.width = "+0.1111em";
      }
    }

    if (!(group.mclass === "mopen" || group.mclass === "mclose")) {
      delete node.attributes.stretchy;
      delete node.attributes.form;
    }
  }
  return node;
}

// math class commands except \mathop
definefunction({
  type: "mclass",
  names: [
    "\\mathord",
    "\\mathbin",
    "\\mathrel",
    "\\mathopen",
    "\\mathclose",
    "\\mathpunct",
    "\\mathinner"
  ],
  props: {
    numargs: 1,
    primitive: true
  },
  handler({ parser, funcname }, args) {
    const body = args[0];
    const ischaracterbox = utils.ischaracterbox(body);
    // we should not wrap a <mo> around a <mi> or <mord>. that would be invalid mathml.
    // in that case, we instead promote the text contents of the body to the parent.
    let mustpromote = true;
    const mord = { type: "mathord", text: "", mode: parser.mode };
    const arr = (body.body) ? body.body : [body];
    for (const arg of arr) {
      if (textatomtypes.includes(arg.type)) {
        if (symbols[parser.mode][arg.text]) {
          mord.text += symbols[parser.mode][arg.text].replace;
        } else if (arg.text) {
          mord.text += arg.text;
        } else if (arg.body) {
          arg.body.map(e => { mord.text += e.text; });
        }
      } else {
        mustpromote = false;
        break
      }
    }
    return {
      type: "mclass",
      mode: parser.mode,
      mclass: "m" + funcname.slice(5),
      body: ordargument(mustpromote ? mord : body),
      ischaracterbox,
      mustpromote
    };
  },
  mathmlbuilder: mathmlbuilder$3
});

const binrelclass = (arg) => {
  // \binrel@ spacing varies with (bin|rel|ord) of the atom in the argument.
  // (by rendering separately and with {}s before and after, and measuring
  // the change in spacing).  we'll do roughly the same by detecting the
  // atom type directly.
  const atom = arg.type === "ordgroup" && arg.body.length ? arg.body[0] : arg;
  if (atom.type === "atom" && (atom.family === "bin" || atom.family === "rel")) {
    return "m" + atom.family;
  } else {
    return "mord";
  }
};

// \@binrel{x}{y} renders like y but as mbin/mrel/mord if x is mbin/mrel/mord.
// this is equivalent to \binrel@{x}\binrel@@{y} in amstex.
definefunction({
  type: "mclass",
  names: ["\\@binrel"],
  props: {
    numargs: 2
  },
  handler({ parser }, args) {
    return {
      type: "mclass",
      mode: parser.mode,
      mclass: binrelclass(args[0]),
      body: ordargument(args[1]),
      ischaracterbox: utils.ischaracterbox(args[1])
    };
  }
});

// build a relation or stacked op by placing one symbol on top of another
definefunction({
  type: "mclass",
  names: ["\\stackrel", "\\overset", "\\underset"],
  props: {
    numargs: 2
  },
  handler({ parser, funcname }, args) {
    const basearg = args[1];
    const shiftedarg = args[0];

    const baseop = {
      type: "op",
      mode: basearg.mode,
      limits: true,
      alwayshandlesupsub: true,
      parentissupsub: false,
      symbol: false,
      stack: true,
      suppressbaseshift: funcname !== "\\stackrel",
      body: ordargument(basearg)
    };

    return {
      type: "supsub",
      mode: shiftedarg.mode,
      base: baseop,
      sup: funcname === "\\underset" ? null : shiftedarg,
      sub: funcname === "\\underset" ? shiftedarg : null
    };
  },
  mathmlbuilder: mathmlbuilder$3
});

// helper function
const buildgroup = (el, style, nonenode) => {
  if (!el) { return nonenode }
  const node = buildgroup$1(el, style);
  if (node.type === "mrow" && node.children.length === 0) { return nonenode }
  return node
};

definefunction({
  type: "multiscript",
  names: ["\\sideset", "\\pres@cript"], // see macros.js for \prescript
  props: {
    numargs: 3
  },
  handler({ parser, funcname, token }, args) {
    if (args[2].body.length === 0) {
      throw new parseerror(funcname + `cannot parse an empty base.`)
    }
    const base = args[2].body[0];
    if (parser.settings.strict && funcname === "\\sideset" && !base.symbol) {
      throw new parseerror(`the base of \\sideset must be a big operator. try \\prescript.`)
    }

    if ((args[0].body.length > 0 && args[0].body[0].type !== "supsub") ||
        (args[1].body.length > 0 && args[1].body[0].type !== "supsub")) {
      throw new parseerror("\\sideset can parse only subscripts and " +
                            "superscripts in its first two arguments", token)
    }

    // the prescripts and postscripts come wrapped in a supsub.
    const prescripts = args[0].body.length > 0 ? args[0].body[0] : null;
    const postscripts = args[1].body.length > 0 ? args[1].body[0] : null;

    if (!prescripts && !postscripts) {
      return base
    } else if (!prescripts) {
      // it's not a multi-script. get a \textstyle supsub.
      return {
        type: "styling",
        mode: parser.mode,
        scriptlevel: "text",
        body: [{
          type: "supsub",
          mode: parser.mode,
          base,
          sup: postscripts.sup,
          sub: postscripts.sub
        }]
      }
    } else {
      return {
        type: "multiscript",
        mode: parser.mode,
        issideset: funcname === "\\sideset",
        prescripts,
        postscripts,
        base
      }
    }
  },
  mathmlbuilder(group, style) {
    const base =  buildgroup$1(group.base, style);

    const prescriptsnode = new mathmltree.mathnode("mprescripts");
    const nonenode = new mathmltree.mathnode("none");
    let children = [];

    const presub = buildgroup(group.prescripts.sub, style, nonenode);
    const presup = buildgroup(group.prescripts.sup, style, nonenode);
    if (group.issideset) {
      // this seems silly, but latex does this. firefox ignores it, which does not make me sad.
      presub.setattribute("style", "text-align: left;");
      presup.setattribute("style", "text-align: left;");
    }

    if (group.postscripts) {
      const postsub = buildgroup(group.postscripts.sub, style, nonenode);
      const postsup = buildgroup(group.postscripts.sup, style, nonenode);
      children = [base, postsub, postsup, prescriptsnode, presub, presup];
    } else {
      children = [base, prescriptsnode, presub, presup];
    }

    return new mathmltree.mathnode("mmultiscripts", children);
  }
});

definefunction({
  type: "not",
  names: ["\\not"],
  props: {
    numargs: 1,
    primitive: true,
    allowedintext: false
  },
  handler({ parser }, args) {
    const ischaracterbox = utils.ischaracterbox(args[0]);
    let body;
    if (ischaracterbox) {
      body = ordargument(args[0]);
      if (body[0].text.charat(0) === "\\") {
        body[0].text = symbols.math[body[0].text].replace;
      }
      // \u0338 is the unicode combining long solidus overlay
      body[0].text = body[0].text.slice(0, 1) + "\u0338" + body[0].text.slice(1);
    } else {
      // when the argument is not a character box, tex does an awkward, poorly placed overlay.
      // we'll do the same.
      const notnode = { type: "textord", mode: "math", text: "\u0338" };
      const kernnode = { type: "kern", mode: "math", dimension: { number: -0.6, unit: "em" } };
      body = [notnode, kernnode, args[0]];
    }
    return {
      type: "not",
      mode: parser.mode,
      body,
      ischaracterbox
    };
  },
  mathmlbuilder(group, style) {
    if (group.ischaracterbox) {
      const inner = buildexpression(group.body, style, true);
      return inner[0]
    } else {
      return buildexpressionrow(group.body, style)
    }
  }
});

// limits, symbols

// some helpers

const ordatomtypes = ["textord", "mathord", "atom"];

// most operators have a large successor symbol, but these don't.
const nosuccessor = ["\\smallint"];

// math operators (e.g. \sin) need a space between these types and themselves:
const ordtypes = ["textord", "mathord", "ordgroup", "close", "leftright", "font"];

// note: unlike most `builders`s, this one handles not only "op", but also
// "supsub" since some of them (like \int) can affect super/subscripting.

const setspacing = node => {
  // the user wrote a \mathop{‚Ä¶} function. change spacing from default to op spacing.
  // the most likely spacing for an op is a thin space per texbook p170.
  node.attributes.lspace = "0.1667em";
  node.attributes.rspace = "0.1667em";
};

const mathmlbuilder$2 = (group, style) => {
  let node;

  if (group.symbol) {
    // this is a symbol. just add the symbol.
    node = new mathnode("mo", [maketext(group.name, group.mode)]);
    if (nosuccessor.includes(group.name)) {
      node.setattribute("largeop", "false");
    } else {
      node.setattribute("movablelimits", "false");
    }
    if (group.frommathop) { setspacing(node); }
  } else if (group.body) {
    // this is an operator with children. add them.
    node = new mathnode("mo", buildexpression(group.body, style));
    if (group.frommathop) { setspacing(node); }
  } else {
    // this is a text operator. add all of the characters from the operator's name.
    node = new mathnode("mi", [new textnode(group.name.slice(1))]);

    if (!group.parentissupsub) {
      // append an invisible <mo>&applyfunction;</mo>.
      // ref: https://www.w3.org/tr/rec-mathml/chap3_2.html#sec3.2.4
      const operator = new mathnode("mo", [maketext("\u2061", "text")]);
      const row = [node, operator];
      // set spacing
      if (group.needsleadingspace) {
        const lead = new mathnode("mspace");
        lead.setattribute("width", "0.1667em"); // thin space.
        row.unshift(lead);
      }
      if (!group.isfollowedbydelimiter) {
        const trail = new mathnode("mspace");
        trail.setattribute("width", "0.1667em"); // thin space.
        row.push(trail);
      }
      node = new mathnode("mrow", row);
    }
  }

  return node;
};

const singlecharbigops = {
  "\u220f": "\\prod",
  "\u2210": "\\coprod",
  "\u2211": "\\sum",
  "\u22c0": "\\bigwedge",
  "\u22c1": "\\bigvee",
  "\u22c2": "\\bigcap",
  "\u22c3": "\\bigcup",
  "\u2a00": "\\bigodot",
  "\u2a01": "\\bigoplus",
  "\u2a02": "\\bigotimes",
  "\u2a04": "\\biguplus",
  "\u2a05": "\\bigsqcap",
  "\u2a06": "\\bigsqcup",
  "\u2a03": "\\bigcupdot",
  "\u2a07": "\\bigdoublevee",
  "\u2a08": "\\bigdoublewedge",
  "\u2a09": "\\bigtimes"
};

definefunction({
  type: "op",
  names: [
    "\\coprod",
    "\\bigvee",
    "\\bigwedge",
    "\\biguplus",
    "\\bigcupplus",
    "\\bigcupdot",
    "\\bigcap",
    "\\bigcup",
    "\\bigdoublevee",
    "\\bigdoublewedge",
    "\\intop",
    "\\prod",
    "\\sum",
    "\\bigotimes",
    "\\bigoplus",
    "\\bigodot",
    "\\bigsqcap",
    "\\bigsqcup",
    "\\bigtimes",
    "\\smallint",
    "\u220f",
    "\u2210",
    "\u2211",
    "\u22c0",
    "\u22c1",
    "\u22c2",
    "\u22c3",
    "\u2a00",
    "\u2a01",
    "\u2a02",
    "\u2a04",
    "\u2a06"
  ],
  props: {
    numargs: 0
  },
  handler: ({ parser, funcname }, args) => {
    let fname = funcname;
    if (fname.length === 1) {
      fname = singlecharbigops[fname];
    }
    return {
      type: "op",
      mode: parser.mode,
      limits: true,
      parentissupsub: false,
      symbol: true,
      stack: false, // this is true for \stackrel{}, not here.
      name: fname
    };
  },
  mathmlbuilder: mathmlbuilder$2
});

// note: calling definefunction with a type that's already been defined only
// works because the same mathmlbuilder is being used.
definefunction({
  type: "op",
  names: ["\\mathop"],
  props: {
    numargs: 1,
    primitive: true
  },
  handler: ({ parser }, args) => {
    const body = args[0];
    // it would be convienient to just wrap a <mo> around the argument.
    // but if the argument is a <mi> or <mord>, that would be invalid mathml.
    // in that case, we instead promote the text contents of the body to the parent.
    const arr = (body.body) ? body.body : [body];
    const issymbol = arr.length === 1 && ordatomtypes.includes(arr[0].type);
    return {
      type: "op",
      mode: parser.mode,
      limits: true,
      parentissupsub: false,
      symbol: issymbol,
      frommathop: true,
      stack: false,
      name: issymbol ? arr[0].text : null,
      body: issymbol ? null : ordargument(body)
    };
  },
  mathmlbuilder: mathmlbuilder$2
});

// there are 2 flags for operators; whether they produce limits in
// displaystyle, and whether they are symbols and should grow in
// displaystyle. these four groups cover the four possible choices.

const singlecharintegrals = {
  "\u222b": "\\int",
  "\u222c": "\\iint",
  "\u222d": "\\iiint",
  "\u222e": "\\oint",
  "\u222f": "\\oiint",
  "\u2230": "\\oiiint",
  "\u2231": "\\intclockwise",
  "\u2232": "\\varointclockwise",
  "\u2a0c": "\\iiiint",
  "\u2a0d": "\\intbar",
  "\u2a0e": "\\intbar",
  "\u2a0f": "\\fint",
  "\u2a12": "\\rppolint",
  "\u2a13": "\\scpolint",
  "\u2a15": "\\pointint",
  "\u2a16": "\\sqint",
  "\u2a17": "\\intlarhk",
  "\u2a18": "\\intx",
  "\u2a19": "\\intcap",
  "\u2a1a": "\\intcup"
};

// no limits, not symbols
definefunction({
  type: "op",
  names: [
    "\\arcsin",
    "\\arccos",
    "\\arctan",
    "\\arctg",
    "\\arcctg",
    "\\arg",
    "\\ch",
    "\\cos",
    "\\cosec",
    "\\cosh",
    "\\cot",
    "\\cotg",
    "\\coth",
    "\\csc",
    "\\ctg",
    "\\cth",
    "\\deg",
    "\\dim",
    "\\exp",
    "\\hom",
    "\\ker",
    "\\lg",
    "\\ln",
    "\\log",
    "\\sec",
    "\\sin",
    "\\sinh",
    "\\sh",
    "\\sgn",
    "\\tan",
    "\\tanh",
    "\\tg",
    "\\th"
  ],
  props: {
    numargs: 0
  },
  handler({ parser, funcname }) {
    const prevatomtype = parser.prevatomtype;
    const next = parser.gullet.future().text;
    return {
      type: "op",
      mode: parser.mode,
      limits: false,
      parentissupsub: false,
      symbol: false,
      stack: false,
      isfollowedbydelimiter: isdelimiter(next),
      needsleadingspace: prevatomtype.length > 0 && ordtypes.includes(prevatomtype),
      name: funcname
    };
  },
  mathmlbuilder: mathmlbuilder$2
});

// limits, not symbols
definefunction({
  type: "op",
  names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\pr", "\\sup"],
  props: {
    numargs: 0
  },
  handler({ parser, funcname }) {
    const prevatomtype = parser.prevatomtype;
    const next = parser.gullet.future().text;
    return {
      type: "op",
      mode: parser.mode,
      limits: true,
      parentissupsub: false,
      symbol: false,
      stack: false,
      isfollowedbydelimiter: isdelimiter(next),
      needsleadingspace: prevatomtype.length > 0 && ordtypes.includes(prevatomtype),
      name: funcname
    };
  },
  mathmlbuilder: mathmlbuilder$2
});

// no limits, symbols
definefunction({
  type: "op",
  names: [
    "\\int",
    "\\iint",
    "\\iiint",
    "\\iiiint",
    "\\oint",
    "\\oiint",
    "\\oiiint",
    "\\intclockwise",
    "\\varointclockwise",
    "\\intbar",
    "\\intbar",
    "\\fint",
    "\\rppolint",
    "\\scpolint",
    "\\pointint",
    "\\sqint",
    "\\intlarhk",
    "\\intx",
    "\\intcap",
    "\\intcup",
    "\u222b",
    "\u222c",
    "\u222d",
    "\u222e",
    "\u222f",
    "\u2230",
    "\u2231",
    "\u2232",
    "\u2a0c",
    "\u2a0d",
    "\u2a0e",
    "\u2a0f",
    "\u2a12",
    "\u2a13",
    "\u2a15",
    "\u2a16",
    "\u2a17",
    "\u2a18",
    "\u2a19",
    "\u2a1a"
  ],
  props: {
    numargs: 0
  },
  handler({ parser, funcname }) {
    let fname = funcname;
    if (fname.length === 1) {
      fname = singlecharintegrals[fname];
    }
    return {
      type: "op",
      mode: parser.mode,
      limits: false,
      parentissupsub: false,
      symbol: true,
      stack: false,
      name: fname
    };
  },
  mathmlbuilder: mathmlbuilder$2
});

// note: unlike most builders, this one handles not only
// "operatorname", but also  "supsub" since \operatorname* can
// affect super/subscripting.

const mathmlbuilder$1 = (group, style) => {
  let expression = buildexpression(group.body, style.withfont("mathrm"));

  // is expression a string or has it something like a fraction?
  let isallstring = true; // default
  for (let i = 0; i < expression.length; i++) {
    let node = expression[i];
    if (node instanceof mathmltree.mathnode) {
      if (node.type === "mrow" && node.children.length === 1 &&
          node.children[0] instanceof mathmltree.mathnode) {
        node = node.children[0];
      }
      switch (node.type) {
        case "mi":
        case "mn":
        case "ms":
        case "mtext":
          break; // do nothing yet.
        case "mspace":
          {
            if (node.attributes.width) {
              const width = node.attributes.width.replace("em", "");
              const ch = spacecharacter(number(width));
              if (ch === "") {
                isallstring = false;
              } else {
                expression[i] = new mathmltree.mathnode("mtext", [new mathmltree.textnode(ch)]);
              }
            }
          }
          break
        case "mo": {
          const child = node.children[0];
          if (node.children.length === 1 && child instanceof mathmltree.textnode) {
            child.text = child.text.replace(/\u2212/, "-").replace(/\u2217/, "*");
          } else {
            isallstring = false;
          }
          break
        }
        default:
          isallstring = false;
      }
    } else {
      isallstring = false;
    }
  }

  if (isallstring) {
    // write a single textnode instead of multiple nested tags.
    const word = expression.map((node) => node.totext()).join("");
    expression = [new mathmltree.textnode(word)];
  } else if (
    expression.length === 1
    && ["mover", "munder"].includes(expression[0].type) &&
    (expression[0].children[0].type === "mi" || expression[0].children[0].type === "mtext")
  ) {
    expression[0].children[0].type = "mi";
    if (group.parentissupsub) {
      return new mathmltree.mathnode("mrow", expression)
    } else {
      const operator = new mathmltree.mathnode("mo", [maketext("\u2061", "text")]);
      return mathmltree.newdocumentfragment([expression[0], operator])
    }
  }

  let wrapper;
  if (isallstring) {
    wrapper = new mathmltree.mathnode("mi", expression);
    if (expression[0].text.length === 1) {
      wrapper.setattribute("mathvariant", "normal");
    }
  } else {
    wrapper = new mathmltree.mathnode("mrow", expression);
  }

  if (!group.parentissupsub) {
    // append an <mo>&applyfunction;</mo>.
    // ref: https://www.w3.org/tr/rec-mathml/chap3_2.html#sec3.2.4
    const operator = new mathmltree.mathnode("mo", [maketext("\u2061", "text")]);
    const fragment = [wrapper, operator];
    if (group.needsleadingspace) {
      // latex gives operator spacing, but a <mi> gets ord spacing.
      // so add a leading space.
      const space = new mathmltree.mathnode("mspace");
      space.setattribute("width", "0.1667em"); // thin space.
      fragment.unshift(space);
    }
    if (!group.isfollowedbydelimiter) {
      const trail = new mathmltree.mathnode("mspace");
      trail.setattribute("width", "0.1667em"); // thin space.
      fragment.push(trail);
    }
    return mathmltree.newdocumentfragment(fragment)
  }

  return wrapper
};

// \operatorname
// amsopn.dtx: \mathop{#1\kern\z@\operator@font#3}\newmcodes@
definefunction({
  type: "operatorname",
  names: ["\\operatorname@", "\\operatornamewithlimits"],
  props: {
    numargs: 1,
    allowedinargument: true
  },
  handler: ({ parser, funcname }, args) => {
    const body = args[0];
    const prevatomtype = parser.prevatomtype;
    const next = parser.gullet.future().text;
    return {
      type: "operatorname",
      mode: parser.mode,
      body: ordargument(body),
      alwayshandlesupsub: (funcname === "\\operatornamewithlimits"),
      limits: false,
      parentissupsub: false,
      isfollowedbydelimiter: isdelimiter(next),
      needsleadingspace: prevatomtype.length > 0 && ordtypes.includes(prevatomtype)
    };
  },
  mathmlbuilder: mathmlbuilder$1
});

definemacro("\\operatorname",
  "\\@ifstar\\operatornamewithlimits\\operatorname@");

definefunctionbuilders({
  type: "ordgroup",
  mathmlbuilder(group, style) {
    return buildexpressionrow(group.body, style, group.semisimple);
  }
});

definefunction({
  type: "phantom",
  names: ["\\phantom"],
  props: {
    numargs: 1,
    allowedintext: true
  },
  handler: ({ parser }, args) => {
    const body = args[0];
    return {
      type: "phantom",
      mode: parser.mode,
      body: ordargument(body)
    };
  },
  mathmlbuilder: (group, style) => {
    const inner = buildexpression(group.body, style);
    return new mathmltree.mathnode("mphantom", inner);
  }
});

definefunction({
  type: "hphantom",
  names: ["\\hphantom"],
  props: {
    numargs: 1,
    allowedintext: true
  },
  handler: ({ parser }, args) => {
    const body = args[0];
    return {
      type: "hphantom",
      mode: parser.mode,
      body
    };
  },
  mathmlbuilder: (group, style) => {
    const inner = buildexpression(ordargument(group.body), style);
    const phantom = new mathmltree.mathnode("mphantom", inner);
    const node = new mathmltree.mathnode("mpadded", [phantom]);
    node.setattribute("height", "0px");
    node.setattribute("depth", "0px");
    return node;
  }
});

definefunction({
  type: "vphantom",
  names: ["\\vphantom"],
  props: {
    numargs: 1,
    allowedintext: true
  },
  handler: ({ parser }, args) => {
    const body = args[0];
    return {
      type: "vphantom",
      mode: parser.mode,
      body
    };
  },
  mathmlbuilder: (group, style) => {
    const inner = buildexpression(ordargument(group.body), style);
    const phantom = new mathmltree.mathnode("mphantom", inner);
    const node = new mathmltree.mathnode("mpadded", [phantom]);
    node.setattribute("width", "0px");
    return node;
  }
});

// in latex, \pmb is a simulation of bold font.
// the version of \pmb in ambsy.sty works by typesetting three copies of the argument
// with small offsets. we use css font-weight:bold.

definefunction({
  type: "pmb",
  names: ["\\pmb"],
  props: {
    numargs: 1,
    allowedintext: true
  },
  handler({ parser }, args) {
    return {
      type: "pmb",
      mode: parser.mode,
      body: ordargument(args[0])
    }
  },
  mathmlbuilder(group, style) {
    const inner = buildexpression(group.body, style);
    // wrap with an <mstyle> element.
    const node = wrapwithmstyle(inner);
    node.setattribute("style", "font-weight:bold");
    return node
  }
});

// \raise, \lower, and \raisebox

const mathmlbuilder = (group, style) => {
  const newstyle = style.withlevel(stylelevel.text);
  const node = new mathmltree.mathnode("mpadded", [buildgroup$1(group.body, newstyle)]);
  const dy = calculatesize(group.dy, style);
  node.setattribute("voffset", dy.number + dy.unit);
  // add padding, which acts to increase height in chromium.
  // todo: figure out some way to change height in firefox w/o breaking chromium.
  if (dy.number > 0) {
    node.style.padding = dy.number + dy.unit + " 0 0 0";
  } else {
    node.style.padding = "0 0 " + math.abs(dy.number) + dy.unit + " 0";
  }
  return node
};

definefunction({
  type: "raise",
  names: ["\\raise", "\\lower"],
  props: {
    numargs: 2,
    argtypes: ["size", "primitive"],
    primitive: true
  },
  handler({ parser, funcname }, args) {
    const amount = assertnodetype(args[0], "size").value;
    if (funcname === "\\lower") { amount.number *= -1; }
    const body = args[1];
    return {
      type: "raise",
      mode: parser.mode,
      dy: amount,
      body
    };
  },
  mathmlbuilder
});


definefunction({
  type: "raise",
  names: ["\\raisebox"],
  props: {
    numargs: 2,
    argtypes: ["size", "hbox"],
    allowedintext: true
  },
  handler({ parser, funcname }, args) {
    const amount = assertnodetype(args[0], "size").value;
    const body = args[1];
    return {
      type: "raise",
      mode: parser.mode,
      dy: amount,
      body
    };
  },
  mathmlbuilder
});

definefunction({
  type: "ref",
  names: ["\\ref", "\\eqref"],
  props: {
    numargs: 1,
    argtypes: ["raw"]
  },
  handler({ parser, funcname }, args) {
    return {
      type: "ref",
      mode: parser.mode,
      funcname,
      string: args[0].string.replace(invalididregex, "")
    };
  },
  mathmlbuilder(group, style) {
    // create an empty <a> node. set a class and an href attribute.
    // the post-processor will populate with the target's tag or equation number.
    const classes = group.funcname === "\\ref" ? ["tml-ref"] : ["tml-ref", "tml-eqref"];
    return new anchornode("#" + group.string, classes, null)
  }
});

definefunction({
  type: "reflect",
  names: ["\\reflectbox"],
  props: {
    numargs: 1,
    argtypes: ["hbox"],
    allowedintext: true
  },
  handler({ parser }, args) {
    return {
      type: "reflect",
      mode: parser.mode,
      body: args[0]
    };
  },
  mathmlbuilder(group, style) {
    const node = buildgroup$1(group.body, style);
    node.style.transform = "scalex(-1)";
    return node
  }
});

definefunction({
  type: "internal",
  names: ["\\relax"],
  props: {
    numargs: 0,
    allowedintext: true
  },
  handler({ parser }) {
    return {
      type: "internal",
      mode: parser.mode
    };
  }
});

definefunction({
  type: "rule",
  names: ["\\rule"],
  props: {
    numargs: 2,
    numoptionalargs: 1,
    allowedintext: true,
    allowedinmath: true,
    argtypes: ["size", "size", "size"]
  },
  handler({ parser }, args, optargs) {
    const shift = optargs[0];
    const width = assertnodetype(args[0], "size");
    const height = assertnodetype(args[1], "size");
    return {
      type: "rule",
      mode: parser.mode,
      shift: shift && assertnodetype(shift, "size").value,
      width: width.value,
      height: height.value
    };
  },
  mathmlbuilder(group, style) {
    const width = calculatesize(group.width, style);
    const height = calculatesize(group.height, style);
    const shift = group.shift
      ? calculatesize(group.shift, style)
      : { number: 0, unit: "em" };
    const color = (style.color && style.getcolor()) || "black";

    const rule = new mathmltree.mathnode("mspace");
    if (width.number > 0 && height.number > 0) {
      rule.setattribute("mathbackground", color);
    }
    rule.setattribute("width", width.number + width.unit);
    rule.setattribute("height", height.number + height.unit);
    if (shift.number === 0) { return rule }

    const wrapper = new mathmltree.mathnode("mpadded", [rule]);
    if (shift.number >= 0) {
      wrapper.setattribute("height", "+" + shift.number + shift.unit);
    } else {
      wrapper.setattribute("height", shift.number + shift.unit);
      wrapper.setattribute("depth", "+" + -shift.number + shift.unit);
    }
    wrapper.setattribute("voffset", shift.number + shift.unit);
    return wrapper;
  }
});

// the size mappings are taken from tex with \normalsize=10pt.
// we don't have to track script level. mathml does that.
const sizemap = {
  "\\tiny": 0.5,
  "\\sixptsize": 0.6,
  "\\tiny": 0.6,
  "\\scriptsize": 0.7,
  "\\footnotesize": 0.8,
  "\\small": 0.9,
  "\\normalsize": 1.0,
  "\\large": 1.2,
  "\\large": 1.44,
  "\\large": 1.728,
  "\\huge": 2.074,
  "\\huge": 2.488
};

definefunction({
  type: "sizing",
  names: [
    "\\tiny",
    "\\sixptsize",
    "\\tiny",
    "\\scriptsize",
    "\\footnotesize",
    "\\small",
    "\\normalsize",
    "\\large",
    "\\large",
    "\\large",
    "\\huge",
    "\\huge"
  ],
  props: {
    numargs: 0,
    allowedintext: true
  },
  handler: ({ breakontokentext, funcname, parser }, args) => {
    if (parser.settings.strict && parser.mode === "math") {
      // eslint-disable-next-line no-console
      console.log(`temml strict-mode warning: command ${funcname} is invalid in math mode.`);
    }
    const body = parser.parseexpression(false, breakontokentext, true);
    return {
      type: "sizing",
      mode: parser.mode,
      funcname,
      body
    };
  },
  mathmlbuilder: (group, style) => {
    const newstyle = style.withfontsize(sizemap[group.funcname]);
    const inner = buildexpression(group.body, newstyle);
    // wrap with an <mstyle> element.
    const node = wrapwithmstyle(inner);
    const factor = (sizemap[group.funcname] / style.fontsize).tofixed(4);
    node.setattribute("mathsize", factor + "em");
    return node;
  }
});

// smash, with optional [tb], as in ams

definefunction({
  type: "smash",
  names: ["\\smash"],
  props: {
    numargs: 1,
    numoptionalargs: 1,
    allowedintext: true
  },
  handler: ({ parser }, args, optargs) => {
    let smashheight = false;
    let smashdepth = false;
    const tbarg = optargs[0] && assertnodetype(optargs[0], "ordgroup");
    if (tbarg) {
      // optional [tb] argument is engaged.
      // ref: amsmath: \renewcommand{\smash}[1][tb]{%
      //               def\mb@t{\ht}\def\mb@b{\dp}\def\mb@tb{\ht\z@\z@\dp}%
      let letter = "";
      for (let i = 0; i < tbarg.body.length; ++i) {
        const node = tbarg.body[i];
        // todo: write an assertsymbolnode
        letter = node.text;
        if (letter === "t") {
          smashheight = true;
        } else if (letter === "b") {
          smashdepth = true;
        } else {
          smashheight = false;
          smashdepth = false;
          break;
        }
      }
    } else {
      smashheight = true;
      smashdepth = true;
    }

    const body = args[0];
    return {
      type: "smash",
      mode: parser.mode,
      body,
      smashheight,
      smashdepth
    };
  },
  mathmlbuilder: (group, style) => {
    const node = new mathmltree.mathnode("mpadded", [buildgroup$1(group.body, style)]);

    if (group.smashheight) {
      node.setattribute("height", "0px");
    }

    if (group.smashdepth) {
      node.setattribute("depth", "0px");
    }

    return node;
  }
});

definefunction({
  type: "sqrt",
  names: ["\\sqrt"],
  props: {
    numargs: 1,
    numoptionalargs: 1
  },
  handler({ parser }, args, optargs) {
    const index = optargs[0];
    const body = args[0];
    return {
      type: "sqrt",
      mode: parser.mode,
      body,
      index
    };
  },
  mathmlbuilder(group, style) {
    const { body, index } = group;
    return index
      ? new mathmltree.mathnode("mroot", [
        buildgroup$1(body, style),
        buildgroup$1(index, style.incrementlevel())
      ])
    : new mathmltree.mathnode("msqrt", [buildgroup$1(body, style)]);
  }
});

const stylemap = {
  display: 0,
  text: 1,
  script: 2,
  scriptscript: 3
};

const styleattributes = {
  display: ["0", "true"],
  text: ["0", "false"],
  script: ["1", "false"],
  scriptscript: ["2", "false"]
};

definefunction({
  type: "styling",
  names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
  props: {
    numargs: 0,
    allowedintext: true,
    primitive: true
  },
  handler({ breakontokentext, funcname, parser }, args) {
    // parse out the implicit body
    const body = parser.parseexpression(true, breakontokentext, true);

    const scriptlevel = funcname.slice(1, funcname.length - 5);
    return {
      type: "styling",
      mode: parser.mode,
      // figure out what scriptlevel to use by pulling out the scriptlevel from
      // the function name
      scriptlevel,
      body
    };
  },
  mathmlbuilder(group, style) {
    // figure out what scriptlevel we're changing to.
    const newstyle = style.withlevel(stylemap[group.scriptlevel]);
    // the style argument in the next line does not directly set a mathml script level.
    // it just tracks the style level, in case we need to know it for supsub or mathchoice.
    const inner = buildexpression(group.body, newstyle);
    // wrap with an <mstyle> element.
    const node = wrapwithmstyle(inner);

    const attr = styleattributes[group.scriptlevel];

    // here is where we set the mathml script level.
    node.setattribute("scriptlevel", attr[0]);
    node.setattribute("displaystyle", attr[1]);

    return node;
  }
});

/**
 * sometimes, groups perform special rules when they have superscripts or
 * subscripts attached to them. this function lets the `supsub` group know that
 * sometimes, groups perform special rules when they have superscripts or
 * its inner element should handle the superscripts and subscripts instead of
 * handling them itself.
 */

// helpers
const symbolregex = /^m(over|under|underover)$/;

// super scripts and subscripts, whose precise placement can depend on other
// functions that precede them.
definefunctionbuilders({
  type: "supsub",
  mathmlbuilder(group, style) {
    // is the inner group a relevant horizonal brace?
    let isbrace = false;
    let isover;
    let issup;
    let appendapplyfunction = false;
    let appendspace = false;
    let needsleadingspace = false;

    if (group.base && group.base.type === "horizbrace") {
      issup = !!group.sup;
      if (issup === group.base.isover) {
        isbrace = true;
        isover = group.base.isover;
      }
    }

    if (group.base && !group.base.stack &&
      (group.base.type === "op" || group.base.type === "operatorname")) {
      group.base.parentissupsub = true;
      appendapplyfunction = !group.base.symbol;
      appendspace = appendapplyfunction && !group.isfollowedbydelimiter;
      needsleadingspace = group.base.needsleadingspace;
    }

    const children = group.base && group.base.stack
      ? [buildgroup$1(group.base.body[0], style)]
      : [buildgroup$1(group.base, style)];

    // note regarding scriptstyle level.
    // (sub|super)scripts should not shrink beyond mathml scriptlevel 2 aka \scriptscriptstyle
    // ref: https://w3c.github.io/mathml-core/#the-displaystyle-and-scriptlevel-attributes
    // (btw, mathml scriptlevel 2 is equal to temml level 3.)
    // but chromium continues to shrink the (sub|super)scripts. so we explicitly set scriptlevel 2.

    const childstyle = style.insuborsup();
    if (group.sub) {
      const sub = buildgroup$1(group.sub, childstyle);
      if (style.level === 3) { sub.setattribute("scriptlevel", "2"); }
      children.push(sub);
    }

    if (group.sup) {
      const sup = buildgroup$1(group.sup, childstyle);
      if (style.level === 3) { sup.setattribute("scriptlevel", "2"); }
      const testnode = sup.type === "mrow" ? sup.children[0] : sup;
      if ((testnode && testnode.type === "mo" && testnode.classes.includes("tml-prime"))
        && group.base && group.base.text && "ff".indexof(group.base.text) > -1) {
        // chromium does not address italic correction on prime.  prevent f‚Ä≤ from overlapping.
        testnode.classes.push("prime-pad");
      }
      children.push(sup);
    }

    let nodetype;
    if (isbrace) {
      nodetype = isover ? "mover" : "munder";
    } else if (!group.sub) {
      const base = group.base;
      if (
        base &&
        base.type === "op" &&
        base.limits &&
        (style.level === stylelevel.display || base.alwayshandlesupsub)
      ) {
        nodetype = "mover";
      } else if (
        base &&
        base.type === "operatorname" &&
        base.alwayshandlesupsub &&
        (base.limits || style.level === stylelevel.display)
      ) {
        nodetype = "mover";
      } else {
        nodetype = "msup";
      }
    } else if (!group.sup) {
      const base = group.base;
      if (
        base &&
        base.type === "op" &&
        base.limits &&
        (style.level === stylelevel.display || base.alwayshandlesupsub)
      ) {
        nodetype = "munder";
      } else if (
        base &&
        base.type === "operatorname" &&
        base.alwayshandlesupsub &&
        (base.limits || style.level === stylelevel.display)
      ) {
        nodetype = "munder";
      } else {
        nodetype = "msub";
      }
    } else {
      const base = group.base;
      if (base && ((base.type === "op" && base.limits) || base.type === "multiscript") &&
        (style.level === stylelevel.display || base.alwayshandlesupsub)
      ) {
        nodetype = "munderover";
      } else if (
        base &&
        base.type === "operatorname" &&
        base.alwayshandlesupsub &&
        (style.level === stylelevel.display || base.limits)
      ) {
        nodetype = "munderover";
      } else {
        nodetype = "msubsup";
      }
    }

    let node = new mathmltree.mathnode(nodetype, children);
    if (appendapplyfunction) {
      // append an <mo>&applyfunction;</mo>.
      // ref: https://www.w3.org/tr/rec-mathml/chap3_2.html#sec3.2.4
      const operator = new mathmltree.mathnode("mo", [maketext("\u2061", "text")]);
      if (needsleadingspace) {
        const space = new mathmltree.mathnode("mspace");
        space.setattribute("width", "0.1667em"); // thin space.
        node = mathmltree.newdocumentfragment([space, node, operator]);
      } else {
        node = mathmltree.newdocumentfragment([node, operator]);
      }
      if (appendspace) {
        const space = new mathmltree.mathnode("mspace");
        space.setattribute("width", "0.1667em"); // thin space.
        node.children.push(space);
      }
    } else if (symbolregex.test(nodetype)) {
      // wrap in a <mrow>. otherwise firefox stretchy parens will not stretch to include limits.
      node = new mathmltree.mathnode("mrow", [node]);
    }

    return node
  }
});

// operator parsenodes created in parser.js from symbol groups in src/symbols.js.

const temml_short = ["\\shortmid", "\\nshortmid", "\\shortparallel",
  "\\nshortparallel", "\\smallsetminus"];

const arrows = ["\\rsh", "\\lsh", "\\restriction"];

const isarrow = str => {
  if (str.length === 1) {
    const codepoint = str.codepointat(0);
    return (0x218f < codepoint && codepoint < 0x2200)
  }
  return str.indexof("arrow") > -1 || str.indexof("harpoon") > -1 || arrows.includes(str)
};

definefunctionbuilders({
  type: "atom",
  mathmlbuilder(group, style) {
    const node = new mathmltree.mathnode("mo", [maketext(group.text, group.mode)]);
    if (group.family === "punct") {
      node.setattribute("separator", "true");
    } else if (group.family === "open" || group.family === "close") {
      // delims built here should not stretch vertically.
      // see delimsizing.js for stretchy delims.
      if (group.family === "open") {
        node.setattribute("form", "prefix");
        // set an explicit attribute for stretch. otherwise firefox may do it wrong.
        node.setattribute("stretchy", "false");
      } else if (group.family === "close") {
        node.setattribute("form", "postfix");
        node.setattribute("stretchy", "false");
      }
    } else if (group.text === "\\mid") {
      // firefox messes up this spacing if at the end of an <mrow>. see it explicitly.
      node.setattribute("lspace", "0.22em"); // medium space
      node.setattribute("rspace", "0.22em");
      node.setattribute("stretchy", "false");
    } else if (group.family === "rel" && isarrow(group.text)) {
      node.setattribute("stretchy", "false");
    } else if (temml_short.includes(group.text)) {
      node.setattribute("mathsize", "70%");
    } else if (group.text === ":") {
      // ":" is not in the mathml operator dictionary. give it bin spacing.
      node.attributes.lspace = "0.2222em";
      node.attributes.rspace = "0.2222em";
    }
    return node;
  }
});

/**
 * maps tex font commands to "mathvariant" attribute in buildmathml.js
 */
const fontmap = {
  // styles
  mathbf: "bold",
  mathrm: "normal",
  textit: "italic",
  mathit: "italic",
  mathnormal: "italic",

  // families
  mathbb: "double-struck",
  mathcal: "script",
  mathfrak: "fraktur",
  mathscr: "script",
  mathsf: "sans-serif",
  mathtt: "monospace"
};

/**
 * returns the math variant as a string or null if none is required.
 */
const getvariant = function(group, style) {
  // handle font specifiers as best we can.
  // chromium does not support the mathml mathvariant attribute.
  // so we'll use unicode replacement characters instead.
  // but first, determine the math variant.

  // deal with the \textit, \textbf, etc., functions.
  if (style.fontfamily === "texttt") {
    return "monospace"
  } else if (style.fontfamily === "textsc") {
    return "normal"; // handled via character substitution in symbolsord.js.
  } else if (style.fontfamily === "textsf") {
    if (style.fontshape === "textit" && style.fontweight === "textbf") {
      return "sans-serif-bold-italic"
    } else if (style.fontshape === "textit") {
      return "sans-serif-italic"
    } else if (style.fontweight === "textbf") {
      return "sans-serif-bold"
    } else {
      return "sans-serif"
    }
  } else if (style.fontshape === "textit" && style.fontweight === "textbf") {
    return "bold-italic"
  } else if (style.fontshape === "textit") {
    return "italic"
  } else if (style.fontweight === "textbf") {
    return "bold"
  }

  // deal with the \mathit, mathbf, etc, functions.
  const font = style.font;
  if (!font || font === "mathnormal") {
    return null
  }

  const mode = group.mode;
  switch (font) {
    case "mathit":
      return "italic"
    case "mathrm": {
      const codepoint = group.text.codepointat(0);
      // latex \mathrm returns italic for greek characters.
      return  (0x03ab < codepoint && codepoint < 0x03cf) ? "italic" : "normal"
    }
    case "greekitalic":
      return "italic"
    case "up@greek":
      return "normal"
    case "boldsymbol":
    case "mathboldsymbol":
      return "bold-italic"
    case "mathbf":
      return "bold"
    case "mathbb":
      return "double-struck"
    case "mathfrak":
      return "fraktur"
    case "mathscr":
    case "mathcal":
      return "script"
    case "mathsf":
      return "sans-serif"
    case "mathsfit":
      return "sans-serif-italic"
    case "mathtt":
      return "monospace"
  }

  let text = group.text;
  if (symbols[mode][text] && symbols[mode][text].replace) {
    text = symbols[mode][text].replace;
  }

  return object.prototype.hasownproperty.call(fontmap, font) ? fontmap[font] : null
};

// chromium does not support the mathml `mathvariant` attribute.
// instead, we replace ascii characters with unicode characters that
// are defined in the font as bold, italic, double-struck, etc.
// this module identifies those unicode code points.

// first, a few helpers.
const script = object.freeze({
  b: 0x20ea, // offset from ascii b to unicode script b
  e: 0x20eb,
  f: 0x20eb,
  h: 0x20c3,
  i: 0x20c7,
  l: 0x20c6,
  m: 0x20e6,
  r: 0x20c9,
  e: 0x20ca,
  g: 0x20a3,
  o: 0x20c5
});

const frak = object.freeze({
  c: 0x20ea,
  h: 0x20c4,
  i: 0x20c8,
  r: 0x20ca,
  z: 0x20ce
});

const bbb = object.freeze({
  c: 0x20bf, // blackboard bold
  h: 0x20c5,
  n: 0x20c7,
  p: 0x20c9,
  q: 0x20c9,
  r: 0x20cb,
  z: 0x20ca
});

const bold = object.freeze({
  "\u03f5": 0x1d2e7, // lunate epsilon
  "\u03d1": 0x1d30c, // vartheta
  "\u03f0": 0x1d2ee, // varkappa
  "\u03c6": 0x1d319, // varphi
  "\u03f1": 0x1d2ef, // varrho
  "\u03d6": 0x1d30b  // varpi
});

const bolditalic = object.freeze({
  "\u03f5": 0x1d35b, // lunate epsilon
  "\u03d1": 0x1d380, // vartheta
  "\u03f0": 0x1d362, // varkappa
  "\u03c6": 0x1d38d, // varphi
  "\u03f1": 0x1d363, // varrho
  "\u03d6": 0x1d37f  // varpi
});

const boldsf = object.freeze({
  "\u03f5": 0x1d395, // lunate epsilon
  "\u03d1": 0x1d3ba, // vartheta
  "\u03f0": 0x1d39c, // varkappa
  "\u03c6": 0x1d3c7, // varphi
  "\u03f1": 0x1d39d, // varrho
  "\u03d6": 0x1d3b9  // varpi
});

const bisf = object.freeze({
  "\u03f5": 0x1d3cf, // lunate epsilon
  "\u03d1": 0x1d3f4, // vartheta
  "\u03f0": 0x1d3d6, // varkappa
  "\u03c6": 0x1d401, // varphi
  "\u03f1": 0x1d3d7, // varrho
  "\u03d6": 0x1d3f3  // varpi
});

// code point offsets below are derived from https://www.unicode.org/charts/pdf/u1d400.pdf
const offset = object.freeze({
  uppercaselatin: { // a-z
    "normal": ch =>                 { return 0 },
    "bold": ch =>                   { return 0x1d3bf },
    "italic": ch =>                 { return 0x1d3f3 },
    "bold-italic": ch =>            { return 0x1d427 },
    "script": ch =>                 { return script[ch] || 0x1d45b },
    "script-bold": ch =>            { return 0x1d48f },
    "fraktur": ch =>                { return frak[ch] || 0x1d4c3 },
    "fraktur-bold": ch =>           { return 0x1d52b },
    "double-struck": ch =>          { return bbb[ch] || 0x1d4f7 },
    "sans-serif": ch =>             { return 0x1d55f },
    "sans-serif-bold": ch =>        { return 0x1d593 },
    "sans-serif-italic": ch =>      { return 0x1d5c7 },
    "sans-serif-bold-italic": ch => { return 0x1d63c },
    "monospace": ch =>              { return 0x1d62f }
  },
  lowercaselatin: { // a-z
    "normal": ch =>                 { return 0 },
    "bold": ch =>                   { return 0x1d3b9 },
    "italic": ch =>                 { return ch === "h" ? 0x20a6 : 0x1d3ed },
    "bold-italic": ch =>            { return 0x1d421 },
    "script": ch =>                 { return script[ch] || 0x1d455 },
    "script-bold": ch =>            { return 0x1d489 },
    "fraktur": ch =>                { return 0x1d4bd },
    "fraktur-bold": ch =>           { return 0x1d525 },
    "double-struck": ch =>          { return 0x1d4f1 },
    "sans-serif": ch =>             { return 0x1d559 },
    "sans-serif-bold": ch =>        { return 0x1d58d },
    "sans-serif-italic": ch =>      { return 0x1d5c1 },
    "sans-serif-bold-italic": ch => { return 0x1d5f5 },
    "monospace": ch =>              { return 0x1d629 }
  },
  uppercasegreek: { // a-Ó©
    "normal": ch =>                 { return 0 },
    "bold": ch =>                   { return 0x1d317 },
    "italic": ch =>                 { return 0x1d351 },
    // \boldsymbol actually returns upright bold for uppercasegreek
    "bold-italic": ch =>            { return 0x1d317 },
    "script": ch =>                 { return 0 },
    "script-bold": ch =>            { return 0 },
    "fraktur": ch =>                { return 0 },
    "fraktur-bold": ch =>           { return 0 },
    "double-struck": ch =>          { return 0 },
    // unicode has no code points for regular-weight san-serif greek. use bold.
    "sans-serif": ch =>             { return 0x1d3c5 },
    "sans-serif-bold": ch =>        { return 0x1d3c5 },
    "sans-serif-italic": ch =>      { return 0 },
    "sans-serif-bold-italic": ch => { return 0x1d3ff },
    "monospace": ch =>              { return 0 }
  },
  lowercasegreek: { // Ó±-Ôâ
    "normal": ch =>                 { return 0 },
    "bold": ch =>                   { return 0x1d311 },
    "italic": ch =>                 { return 0x1d34b },
    "bold-italic": ch =>            { return ch === "\u03d5" ? 0x1d37e : 0x1d385 },
    "script": ch =>                 { return 0 },
    "script-bold": ch =>            { return 0 },
    "fraktur": ch =>                { return 0 },
    "fraktur-bold": ch =>           { return 0 },
    "double-struck": ch =>          { return 0 },
    // unicode has no code points for regular-weight san-serif greek. use bold.
    "sans-serif": ch =>             { return 0x1d3bf },
    "sans-serif-bold": ch =>        { return 0x1d3bf },
    "sans-serif-italic": ch =>      { return 0 },
    "sans-serif-bold-italic": ch => { return 0x1d3f9 },
    "monospace": ch =>              { return 0 }
  },
  vargreek: { // \vargamma, etc
    "normal": ch =>                 { return 0 },
    "bold": ch =>                   { return  bold[ch] || -51 },
    "italic": ch =>                 { return 0 },
    "bold-italic": ch =>            { return bolditalic[ch] || 0x3a },
    "script": ch =>                 { return 0 },
    "script-bold": ch =>            { return 0 },
    "fraktur": ch =>                { return 0 },
    "fraktur-bold": ch =>           { return 0 },
    "double-struck": ch =>          { return 0 },
    "sans-serif": ch =>             { return boldsf[ch] || 0x74 },
    "sans-serif-bold": ch =>        { return boldsf[ch] || 0x74 },
    "sans-serif-italic": ch =>      { return 0 },
    "sans-serif-bold-italic": ch => { return bisf[ch] || 0xae },
    "monospace": ch =>              { return 0 }
  },
  numeral: { // 0-9
    "normal": ch =>                 { return 0 },
    "bold": ch =>                   { return 0x1d79e },
    "italic": ch =>                 { return 0 },
    "bold-italic": ch =>            { return 0 },
    "script": ch =>                 { return 0 },
    "script-bold": ch =>            { return 0 },
    "fraktur": ch =>                { return 0 },
    "fraktur-bold": ch =>           { return 0 },
    "double-struck": ch =>          { return 0x1d7a8 },
    "sans-serif": ch =>             { return 0x1d7b2 },
    "sans-serif-bold": ch =>        { return 0x1d7bc },
    "sans-serif-italic": ch =>      { return 0 },
    "sans-serif-bold-italic": ch => { return 0 },
    "monospace": ch =>              { return 0x1d7c6 }
  }
});

const variantchar = (ch, variant) => {
  const codepoint = ch.codepointat(0);
  const block = 0x40 < codepoint && codepoint < 0x5b
    ? "uppercaselatin"
    : 0x60 < codepoint && codepoint < 0x7b
    ? "lowercaselatin"
    : (0x390  < codepoint && codepoint < 0x3aa)
    ? "uppercasegreek"
    : 0x3b0 < codepoint && codepoint < 0x3ca || ch === "\u03d5"
    ? "lowercasegreek"
    : 0x1d6e1 < codepoint && codepoint < 0x1d6fc  || bold[ch]
    ? "vargreek"
    : (0x2f < codepoint && codepoint <  0x3a)
    ? "numeral"
    : "other";
  return block === "other"
    ? ch
    : string.fromcodepoint(codepoint + offset[block][variant](ch))
};

const smallcaps = object.freeze({
  a: "·¥Ä",
  b: "Íô",
  c: "·¥Ñ",
  d: "·¥Ö",
  e: "·¥á",
  f: "Íú∞",
  g: "È¢",
  h: "Íú",
  i: "È™",
  j: "·¥ö",
  k: "·¥ã",
  l: "Íˇ",
  m: "·¥ç",
  n: "È¥",
  o: "·¥è",
  p: "·¥ò",
  q: "Á´",
  r: "ÍÄ",
  s: "s",
  t: "·¥õ",
  u: "·¥ú",
  v: "·¥†",
  w: "·¥°",
  x: "x",
  y: "Íè",
  z: "·¥¢"
});

// "mathord" and "textord" parsenodes created in parser.js from symbol groups in
// src/symbols.js.

const numberregex = /^\d(?:[\d,.]*\d)?$/;
const latinregex = /[a-ba-z]/;
const primes = new set(["\\prime", "\\dprime", "\\trprime", "\\qprime",
  "\\backprime", "\\backdprime", "\\backtrprime"]);

const italicnumber = (text, variant, tag) => {
  const mn = new mathmltree.mathnode(tag, [text]);
  const wrapper = new mathmltree.mathnode("mstyle", [mn]);
  wrapper.style["font-style"] = "italic";
  wrapper.style["font-family"] = "cambria, 'times new roman', serif";
  if (variant === "bold-italic") { wrapper.style["font-weight"] = "bold"; }
  return wrapper
};

definefunctionbuilders({
  type: "mathord",
  mathmlbuilder(group, style) {
    const text = maketext(group.text, group.mode, style);
    const codepoint = text.text.codepointat(0);
    // test for upper-case greek
    const defaultvariant = (0x0390 < codepoint && codepoint < 0x03aa) ? "normal" : "italic";
    const variant = getvariant(group, style) || defaultvariant;
    if (variant === "script") {
      text.text = variantchar(text.text, variant);
      return new mathmltree.mathnode("mi", [text], [style.font])
    } else if (variant !== "italic") {
      text.text = variantchar(text.text, variant);
    }
    let node = new mathmltree.mathnode("mi", [text]);
    // todo: handle u+1d49c - u+1d4cf per https://www.unicode.org/charts/pdf/u1d400.pdf
    if (variant === "normal") {
      node.setattribute("mathvariant", "normal");
      if (text.text.length === 1) {
        // a firefox bug will apply spacing here, but there should be none. fix it.
        node = new mathmltree.mathnode("mrow", [node]);
      }
    }
    return node
  }
});

definefunctionbuilders({
  type: "textord",
  mathmlbuilder(group, style) {
    let ch = group.text;
    const codepoint = ch.codepointat(0);
    if (style.fontfamily === "textsc") {
      // convert small latin letters to small caps.
      if (96 < codepoint && codepoint < 123) {
        ch = smallcaps[ch];
      }
    }
    const text = maketext(ch, group.mode, style);
    const variant = getvariant(group, style) || "normal";

    let node;
    if (numberregex.test(group.text)) {
      const tag = group.mode === "text" ? "mtext" : "mn";
      if (variant === "italic" || variant === "bold-italic") {
        return italicnumber(text, variant, tag)
      } else {
        if (variant !== "normal") {
          text.text = text.text.split("").map(c => variantchar(c, variant)).join("");
        }
        node = new mathmltree.mathnode(tag, [text]);
      }
    } else if (group.mode === "text") {
      if (variant !== "normal") {
        text.text = variantchar(text.text, variant);
      }
      node = new mathmltree.mathnode("mtext", [text]);
    } else if (primes.has(group.text)) {
      node = new mathmltree.mathnode("mo", [text]);
      // todo: if/when chromium uses ssty variant for prime, remove the next line.
      node.classes.push("tml-prime");
    } else {
      const origtext = text.text;
      if (variant !== "italic") {
        text.text = variantchar(text.text, variant);
      }
      node = new mathmltree.mathnode("mi", [text]);
      if (text.text === origtext && latinregex.test(origtext)) {
        node.setattribute("mathvariant", "italic");
      }
    }
    return node
  }
});

// a map of css-based spacing functions to their css class.
const cssspace = {
  "\\nobreak": "nobreak",
  "\\allowbreak": "allowbreak"
};

// a lookup table to determine whether a spacing function/symbol should be
// treated like a regular space character.  if a symbol or command is a key
// in this table, then it should be a regular space character.  furthermore,
// the associated value may have a `classname` specifying an extra css class
// to add to the created `span`.
const regularspace = {
  " ": {},
  "\\ ": {},
  "~": {
    classname: "nobreak"
  },
  "\\space": {},
  "\\nobreakspace": {
    classname: "nobreak"
  }
};

// parsenode<"spacing"> created in parser.js from the "spacing" symbol groups in
// src/symbols.js.
definefunctionbuilders({
  type: "spacing",
  mathmlbuilder(group, style) {
    let node;

    if (object.prototype.hasownproperty.call(regularspace, group.text)) {
      // firefox does not render a space in a <mtext> </mtext>. so write a no-break space.
      // todo: if firefox fixes that bug, uncomment the next line and write ch into the node.
      //const ch = (regularspace[group.text].classname === "nobreak") ? "\u00a0" : " "
      node = new mathmltree.mathnode("mtext", [new mathmltree.textnode("\u00a0")]);
    } else if (object.prototype.hasownproperty.call(cssspace, group.text)) {
      // mathml 3.0 calls for nobreak to occur in an <mo>, not an <mtext>
      // ref: https://www.w3.org/math/draft-spec/mathml.html#chapter3_presm.lbattrs
      node = new mathmltree.mathnode("mo");
      if (group.text === "\\nobreak") {
        node.setattribute("linebreak", "nobreak");
      }
    } else {
      throw new parseerror(`unknown type of space "${group.text}"`)
    }

    return node
  }
});

definefunctionbuilders({
  type: "tag"
});

// for a \tag, the work usually done in a mathmlbuilder is instead done in buildmathml.js.
// that way, a \tag can be pulled out of the parse tree and wrapped around the outer node.

// non-mathy text, possibly in a font
const textfontfamilies = {
  "\\text": undefined,
  "\\textrm": "textrm",
  "\\textsf": "textsf",
  "\\texttt": "texttt",
  "\\textnormal": "textrm",
  "\\textsc": "textsc"      // small caps
};

const textfontweights = {
  "\\textbf": "textbf",
  "\\textmd": "textmd"
};

const textfontshapes = {
  "\\textit": "textit",
  "\\textup": "textup"
};

const stylewithfont = (group, style) => {
  const font = group.font;
  // checks if the argument is a font family or a font style.
  if (!font) {
    return style;
  } else if (textfontfamilies[font]) {
    return style.withtextfontfamily(textfontfamilies[font]);
  } else if (textfontweights[font]) {
    return style.withtextfontweight(textfontweights[font]);
  } else if (font === "\\emph") {
    return style.fontshape === "textit"
      ? style.withtextfontshape("textup")
      : style.withtextfontshape("textit")
  }
  return style.withtextfontshape(textfontshapes[font])
};

definefunction({
  type: "text",
  names: [
    // font families
    "\\text",
    "\\textrm",
    "\\textsf",
    "\\texttt",
    "\\textnormal",
    "\\textsc",
    // font weights
    "\\textbf",
    "\\textmd",
    // font shapes
    "\\textit",
    "\\textup",
    "\\emph"
  ],
  props: {
    numargs: 1,
    argtypes: ["text"],
    allowedinargument: true,
    allowedintext: true
  },
  handler({ parser, funcname }, args) {
    const body = args[0];
    return {
      type: "text",
      mode: parser.mode,
      body: ordargument(body),
      font: funcname
    };
  },
  mathmlbuilder(group, style) {
    const newstyle = stylewithfont(group, style);
    const mrow = buildexpressionrow(group.body, newstyle);
    return consolidatetext(mrow)
  }
});

// \vcenter:  vertically center the argument group on the math axis.

definefunction({
  type: "vcenter",
  names: ["\\vcenter"],
  props: {
    numargs: 1,
    argtypes: ["original"],
    allowedintext: false
  },
  handler({ parser }, args) {
    return {
      type: "vcenter",
      mode: parser.mode,
      body: args[0]
    };
  },
  mathmlbuilder(group, style) {
    // use a math table to create vertically centered content.
    const mtd = new mathmltree.mathnode("mtd", [buildgroup$1(group.body, style)]);
    mtd.style.padding = "0";
    const mtr = new mathmltree.mathnode("mtr", [mtd]);
    return new mathmltree.mathnode("mtable", [mtr])
  }
});

definefunction({
  type: "verb",
  names: ["\\verb"],
  props: {
    numargs: 0,
    allowedintext: true
  },
  handler(context, args, optargs) {
    // \verb and \verb* are dealt with directly in parser.js.
    // if we end up here, it's because of a failure to match the two delimiters
    // in the regex in lexer.js.  latex raises the following error when \verb is
    // terminated by end of line (or file).
    throw new parseerror("\\verb ended by end of line instead of matching delimiter");
  },
  mathmlbuilder(group, style) {
    const text = new mathmltree.textnode(makeverb(group));
    const node = new mathmltree.mathnode("mtext", [text]);
    node.setattribute("mathvariant", "monospace");
    return node;
  }
});

/**
 * converts verb group into body string.
 *
 * \verb* replaces each space with an open box \u2423
 * \verb replaces each space with a no-break space \xa0
 */
const makeverb = (group) => group.body.replace(/ /g, group.star ? "\u2423" : "\xa0");

/** include this to ensure that all functions are defined. */

const functions = _functions;

/**
 * the lexer class handles tokenizing the input in various ways. since our
 * parser expects us to be able to backtrack, the lexer allows lexing from any
 * given starting point.
 *
 * its main exposed function is the `lex` function, which takes a position to
 * lex from and a type of token to lex. it defers to the appropriate `_innerlex`
 * function.
 *
 * the various `_innerlex` functions perform the actual lexing of different
 * kinds.
 */


/* the following tokenregex
 * - matches typical whitespace (but not nbsp etc.) using its first two groups
 * - does not match any control character \x00-\x1f except whitespace
 * - does not match a bare backslash
 * - matches any ascii character except those just mentioned
 * - does not match the bmp private use area \ue000-\uf8ff
 * - does not match bare surrogate code units
 * - matches any bmp character except for those just described
 * - matches any valid unicode surrogate pair
 * - mathches numerals
 * - matches a backslash followed by one or more whitespace characters
 * - matches a backslash followed by one or more letters then whitespace
 * - matches a backslash followed by any bmp character
 * capturing groups:
 *   [1] regular whitespace
 *   [2] backslash followed by whitespace
 *   [3] anything else, which may include:
 *     [4] left character of \verb*
 *     [5] left character of \verb
 *     [6] backslash followed by word, excluding any trailing whitespace
 * just because the lexer matches something doesn't mean it's valid input:
 * if there is no matching function or symbol definition, the parser will
 * still reject the input.
 */
const spaceregexstring = "[ \r\n\t]";
const controlwordregexstring = "\\\\[a-za-z@]+";
const controlsymbolregexstring = "\\\\[^\ud800-\udfff]";
const controlwordwhitespaceregexstring = `(${controlwordregexstring})${spaceregexstring}*`;
const controlspaceregexstring = "\\\\(\n|[ \r\t]+\n?)[ \r\t]*";
const combiningdiacriticalmarkstring = "[\u0300-\u036f]";
const combiningdiacriticalmarksendregex = new regexp(`${combiningdiacriticalmarkstring}+$`);
const tokenregexstring =
  `(${spaceregexstring}+)|` + // whitespace
  `${controlspaceregexstring}|` +  // whitespace
  "([!-\\[\\]-\u2027\u202a-\ud7ff\uf900-\uffff]" + // single codepoint
  `${combiningdiacriticalmarkstring}*` + // ...plus accents
  "|[\ud800-\udbff][\udc00-\udfff]" + // surrogate pair
  `${combiningdiacriticalmarkstring}*` + // ...plus accents
  "|\\\\verb\\*([^]).*?\\4" + // \verb*
  "|\\\\verb([^*a-za-z]).*?\\5" + // \verb unstarred
  `|${controlwordwhitespaceregexstring}` + // \macroname + spaces
  `|${controlsymbolregexstring})`; // \\, \', etc.

/** main lexer class */
class lexer {
  constructor(input, settings) {
    // separate accents from characters
    this.input = input;
    this.settings = settings;
    this.tokenregex = new regexp(tokenregexstring, 'g');
    // category codes. the lexer only supports comment characters (14) for now.
    // macroexpander additionally distinguishes active (13).
    this.catcodes = {
      "%": 14, // comment character
      "~": 13  // active character
    };
  }

  setcatcode(char, code) {
    this.catcodes[char] = code;
  }

  /**
   * this function lexes a single token.
   */
  lex() {
    const input = this.input;
    const pos = this.tokenregex.lastindex;
    if (pos === input.length) {
      return new token("eof", new sourcelocation(this, pos, pos));
    }
    const match = this.tokenregex.exec(input);
    if (match === null || match.index !== pos) {
      throw new parseerror(
        `unexpected character: '${input[pos]}'`,
        new token(input[pos], new sourcelocation(this, pos, pos + 1))
      );
    }
    const text = match[6] || match[3] || (match[2] ? "\\ " : " ");

    if (this.catcodes[text] === 14) {
      // comment character
      const nlindex = input.indexof("\n", this.tokenregex.lastindex);
      if (nlindex === -1) {
        this.tokenregex.lastindex = input.length; // eof
        if (this.settings.strict) {
          throw new parseerror("% comment has no terminating newline; latex would " +
              "fail because of commenting the end of math mode")
        }
      } else {
        this.tokenregex.lastindex = nlindex + 1;
      }
      return this.lex();
    }

    return new token(text, new sourcelocation(this, pos, this.tokenregex.lastindex));
  }
}

/**
 * a `namespace` refers to a space of nameable things like macros or lengths,
 * which can be `set` either globally or local to a nested group, using an
 * undo stack similar to how tex implements this functionality.
 * performance-wise, `get` and local `set` take constant time, while global
 * `set` takes time proportional to the depth of group nesting.
 */


class namespace {
  /**
   * both arguments are optional.  the first argument is an object of
   * built-in mappings which never change.  the second argument is an object
   * of initial (global-level) mappings, which will constantly change
   * according to any global/top-level `set`s done.
   */
  constructor(builtins = {}, globalmacros = {}) {
    this.current = globalmacros;
    this.builtins = builtins;
    this.undefstack = [];
  }

  /**
   * start a new nested group, affecting future local `set`s.
   */
  begingroup() {
    this.undefstack.push({});
  }

  /**
   * end current nested group, restoring values before the group began.
   */
  endgroup() {
    if (this.undefstack.length === 0) {
      throw new parseerror(
        "unbalanced namespace destruction: attempt " +
          "to pop global namespace; please report this as a bug"
      );
    }
    const undefs = this.undefstack.pop();
    for (const undef in undefs) {
      if (object.prototype.hasownproperty.call(undefs, undef )) {
        if (undefs[undef] === undefined) {
          delete this.current[undef];
        } else {
          this.current[undef] = undefs[undef];
        }
      }
    }
  }

  /**
   * detect whether `name` has a definition.  equivalent to
   * `get(name) != null`.
   */
  has(name) {
    return object.prototype.hasownproperty.call(this.current, name ) ||
    object.prototype.hasownproperty.call(this.builtins, name );
  }

  /**
   * get the current value of a name, or `undefined` if there is no value.
   *
   * note: do not use `if (namespace.get(...))` to detect whether a macro
   * is defined, as the definition may be the empty string which evaluates
   * to `false` in javascript.  use `if (namespace.get(...) != null)` or
   * `if (namespace.has(...))`.
   */
  get(name) {
    if (object.prototype.hasownproperty.call(this.current, name )) {
      return this.current[name];
    } else {
      return this.builtins[name];
    }
  }

  /**
   * set the current value of a name, and optionally set it globally too.
   * local set() sets the current value and (when appropriate) adds an undo
   * operation to the undo stack.  global set() may change the undo
   * operation at every level, so takes time linear in their number.
   */
  set(name, value, global = false) {
    if (global) {
      // global set is equivalent to setting in all groups.  simulate this
      // by destroying any undos currently scheduled for this name,
      // and adding an undo with the *new* value (in case it later gets
      // locally reset within this environment).
      for (let i = 0; i < this.undefstack.length; i++) {
        delete this.undefstack[i][name];
      }
      if (this.undefstack.length > 0) {
        this.undefstack[this.undefstack.length - 1][name] = value;
      }
    } else {
      // undo this set at end of this group (possibly to `undefined`),
      // unless an undo is already in place, in which case that older
      // value is the correct one.
      const top = this.undefstack[this.undefstack.length - 1];
      if (top && !object.prototype.hasownproperty.call(top, name )) {
        top[name] = this.current[name];
      }
    }
    this.current[name] = value;
  }
}

/**
 * this file contains the ‚Äúgullet‚Äù where macros are expanded
 * until only non-macro tokens remain.
 */


// list of commands that act like macros but aren't defined as a macro,
// function, or symbol.  used in `isdefined`.
const implicitcommands = {
  "^": true, // parser.js
  _: true, // parser.js
  "\\limits": true, // parser.js
  "\\nolimits": true // parser.js
};

class macroexpander {
  constructor(input, settings, mode) {
    this.settings = settings;
    this.expansioncount = 0;
    this.feed(input);
    // make new global namespace
    this.macros = new namespace(macros, settings.macros);
    this.mode = mode;
    this.stack = []; // contains tokens in reverse order
  }

  /**
   * feed a new input string to the same macroexpander
   * (with existing macros etc.).
   */
  feed(input) {
    this.lexer = new lexer(input, this.settings);
  }

  /**
   * switches between "text" and "math" modes.
   */
  switchmode(newmode) {
    this.mode = newmode;
  }

  /**
   * start a new group nesting within all namespaces.
   */
  begingroup() {
    this.macros.begingroup();
  }

  /**
   * end current group nesting within all namespaces.
   */
  endgroup() {
    this.macros.endgroup();
  }

  /**
   * returns the topmost token on the stack, without expanding it.
   * similar in behavior to tex's `\futurelet`.
   */
  future() {
    if (this.stack.length === 0) {
      this.pushtoken(this.lexer.lex());
    }
    return this.stack[this.stack.length - 1]
  }

  /**
   * remove and return the next unexpanded token.
   */
  poptoken() {
    this.future(); // ensure non-empty stack
    return this.stack.pop();
  }

  /**
   * add a given token to the token stack.  in particular, this get be used
   * to put back a token returned from one of the other methods.
   */
  pushtoken(token) {
    this.stack.push(token);
  }

  /**
   * append an array of tokens to the token stack.
   */
  pushtokens(tokens) {
    this.stack.push(...tokens);
  }

  /**
   * find an macro argument without expanding tokens and append the array of
   * tokens to the token stack. uses token as a container for the result.
   */
  scanargument(isoptional) {
    let start;
    let end;
    let tokens;
    if (isoptional) {
      this.consumespaces(); // \@ifnextchar gobbles any space following it
      if (this.future().text !== "[") {
        return null;
      }
      start = this.poptoken(); // don't include [ in tokens
      ({ tokens, end } = this.consumearg(["]"]));
    } else {
      ({ tokens, start, end } = this.consumearg());
    }

    // indicate the end of an argument
    this.pushtoken(new token("eof", end.loc));

    this.pushtokens(tokens);
    return start.range(end, "");
  }

  /**
   * consume all following space tokens, without expansion.
   */
  consumespaces() {
    for (;;) {
      const token = this.future();
      if (token.text === " ") {
        this.stack.pop();
      } else {
        break;
      }
    }
  }

  /**
   * consume an argument from the token stream, and return the resulting array
   * of tokens and start/end token.
   */
  consumearg(delims) {
    // the argument for a delimited parameter is the shortest (possibly
    // empty) sequence of tokens with properly nested {...} groups that is
    // followed ... by this particular list of non-parameter tokens.
    // the argument for an undelimited parameter is the next nonblank
    // token, unless that token is ‚Äò{‚Äô, when the argument will be the
    // entire {...} group that follows.
    const tokens = [];
    const isdelimited = delims && delims.length > 0;
    if (!isdelimited) {
      // ignore spaces between arguments.  as the texbook says:
      // "after you have said ‚Äò\def\row#1#2{...}‚Äô, you are allowed to
      //  put spaces between the arguments (e.g., ‚Äò\row x n‚Äô), because
      //  tex doesn‚Äôt use single spaces as undelimited arguments."
      this.consumespaces();
    }
    const start = this.future();
    let tok;
    let depth = 0;
    let match = 0;
    do {
      tok = this.poptoken();
      tokens.push(tok);
      if (tok.text === "{") {
        ++depth;
      } else if (tok.text === "}") {
        --depth;
        if (depth === -1) {
          throw new parseerror("extra }", tok);
        }
      } else if (tok.text === "eof") {
        throw new parseerror(
          "unexpected end of input in a macro argument" +
            ", expected '" +
            (delims && isdelimited ? delims[match] : "}") +
            "'",
          tok
        );
      }
      if (delims && isdelimited) {
        if ((depth === 0 || (depth === 1 && delims[match] === "{")) && tok.text === delims[match]) {
          ++match;
          if (match === delims.length) {
            // don't include delims in tokens
            tokens.splice(-match, match);
            break;
          }
        } else {
          match = 0;
        }
      }
    } while (depth !== 0 || isdelimited);
    // if the argument found ... has the form ‚Äò{<nested tokens>}‚Äô,
    // ... the outermost braces enclosing the argument are removed
    if (start.text === "{" && tokens[tokens.length - 1].text === "}") {
      tokens.pop();
      tokens.shift();
    }
    tokens.reverse(); // to fit in with stack order
    return { tokens, start, end: tok };
  }

  /**
   * consume the specified number of (delimited) arguments from the token
   * stream and return the resulting array of arguments.
   */
  consumeargs(numargs, delimiters) {
    if (delimiters) {
      if (delimiters.length !== numargs + 1) {
        throw new parseerror("the length of delimiters doesn't match the number of args!");
      }
      const delims = delimiters[0];
      for (let i = 0; i < delims.length; i++) {
        const tok = this.poptoken();
        if (delims[i] !== tok.text) {
          throw new parseerror("use of the macro doesn't match its definition", tok);
        }
      }
    }

    const args = [];
    for (let i = 0; i < numargs; i++) {
      args.push(this.consumearg(delimiters && delimiters[i + 1]).tokens);
    }
    return args;
  }

  /**
   * expand the next token only once if possible.
   *
   * if the token is expanded, the resulting tokens will be pushed onto
   * the stack in reverse order, and the number of such tokens will be
   * returned.  this number might be zero or positive.
   *
   * if not, the return value is `false`, and the next token remains at the
   * top of the stack.
   *
   * in either case, the next token will be on the top of the stack,
   * or the stack will be empty (in case of empty expansion
   * and no other tokens).
   *
   * used to implement `expandafterfuture` and `expandnexttoken`.
   *
   * if expandableonly, only expandable tokens are expanded and
   * an undefined control sequence results in an error.
   */
  expandonce(expandableonly) {
    const toptoken = this.poptoken();
    const name = toptoken.text;
    const expansion = !toptoken.noexpand ? this._getexpansion(name) : null;
    if (expansion == null || (expandableonly && expansion.unexpandable)) {
      if (expandableonly && expansion == null && name[0] === "\\" && !this.isdefined(name)) {
        throw new parseerror("undefined control sequence: " + name);
      }
      this.pushtoken(toptoken);
      return false;
    }
    this.expansioncount++;
    if (this.expansioncount > this.settings.maxexpand) {
      throw new parseerror(
        "too many expansions: infinite loop or " + "need to increase maxexpand setting"
      );
    }
    let tokens = expansion.tokens;
    const args = this.consumeargs(expansion.numargs, expansion.delimiters);
    if (expansion.numargs) {
      // paste arguments in place of the placeholders
      tokens = tokens.slice(); // make a shallow copy
      for (let i = tokens.length - 1; i >= 0; --i) {
        let tok = tokens[i];
        if (tok.text === "#") {
          if (i === 0) {
            throw new parseerror("incomplete placeholder at end of macro body", tok);
          }
          tok = tokens[--i]; // next token on stack
          if (tok.text === "#") {
            // ## ‚Üí #
            tokens.splice(i + 1, 1); // drop first #
          } else if (/^[1-9]$/.test(tok.text)) {
            // replace the placeholder with the indicated argument
            tokens.splice(i, 2, ...args[+tok.text - 1]);
          } else {
            throw new parseerror("not a valid argument number", tok);
          }
        }
      }
    }
    // concatenate expansion onto top of stack.
    this.pushtokens(tokens);
    return tokens.length;
  }

  /**
   * expand the next token only once (if possible), and return the resulting
   * top token on the stack (without removing anything from the stack).
   * similar in behavior to tex's `\expandafter\futurelet`.
   * equivalent to expandonce() followed by future().
   */
  expandafterfuture() {
    this.expandonce();
    return this.future();
  }

  /**
   * recursively expand first token, then return first non-expandable token.
   */
  expandnexttoken() {
    for (;;) {
      if (this.expandonce() === false) { // fully expanded
        const token = this.stack.pop();
        // the token after \noexpand is interpreted as if its meaning were ‚Äò\relax‚Äô
        if (token.treatasrelax) {
          token.text = "\\relax";
        }
        return token
      }
    }

    // this pathway is impossible.
    throw new error(); // eslint-disable-line no-unreachable
  }

  /**
   * fully expand the given macro name and return the resulting list of
   * tokens, or return `undefined` if no such macro is defined.
   */
  expandmacro(name) {
    return this.macros.has(name) ? this.expandtokens([new token(name)]) : undefined;
  }

  /**
   * fully expand the given token stream and return the resulting list of
   * tokens.  note that the input tokens are in reverse order, but the
   * output tokens are in forward order.
   */
  expandtokens(tokens) {
    const output = [];
    const oldstacklength = this.stack.length;
    this.pushtokens(tokens);
    while (this.stack.length > oldstacklength) {
      // expand only expandable tokens
      if (this.expandonce(true) === false) {  // fully expanded
        const token = this.stack.pop();
        if (token.treatasrelax) {
          // the expansion of \noexpand is the token itself
          token.noexpand = false;
          token.treatasrelax = false;
        }
        output.push(token);
      }
    }
    return output;
  }

  /**
   * fully expand the given macro name and return the result as a string,
   * or return `undefined` if no such macro is defined.
   */
  expandmacroastext(name) {
    const tokens = this.expandmacro(name);
    if (tokens) {
      return tokens.map((token) => token.text).join("");
    } else {
      return tokens;
    }
  }

  /**
   * returns the expanded macro as a reversed array of tokens and a macro
   * argument count.  or returns `null` if no such macro.
   */
  _getexpansion(name) {
    const definition = this.macros.get(name);
    if (definition == null) {
      // mainly checking for undefined here
      return definition;
    }
    // if a single character has an associated catcode other than 13
    // (active character), then don't expand it.
    if (name.length === 1) {
      const catcode = this.lexer.catcodes[name];
      if (catcode != null && catcode !== 13) {
        return
      }
    }
    const expansion = typeof definition === "function" ? definition(this) : definition;
    if (typeof expansion === "string") {
      let numargs = 0;
      if (expansion.indexof("#") !== -1) {
        const stripped = expansion.replace(/##/g, "");
        while (stripped.indexof("#" + (numargs + 1)) !== -1) {
          ++numargs;
        }
      }
      const bodylexer = new lexer(expansion, this.settings);
      const tokens = [];
      let tok = bodylexer.lex();
      while (tok.text !== "eof") {
        tokens.push(tok);
        tok = bodylexer.lex();
      }
      tokens.reverse(); // to fit in with stack using push and pop
      const expanded = { tokens, numargs };
      return expanded;
    }

    return expansion;
  }

  /**
   * determine whether a command is currently "defined" (has some
   * functionality), meaning that it's a macro (in the current group),
   * a function, a symbol, or one of the special commands listed in
   * `implicitcommands`.
   */
  isdefined(name) {
    return (
      this.macros.has(name) ||
      object.prototype.hasownproperty.call(functions, name ) ||
      object.prototype.hasownproperty.call(symbols.math, name ) ||
      object.prototype.hasownproperty.call(symbols.text, name ) ||
      object.prototype.hasownproperty.call(implicitcommands, name )
    );
  }

  /**
   * determine whether a command is expandable.
   */
  isexpandable(name) {
    const macro = this.macros.get(name);
    return macro != null
      ? typeof macro === "string" || typeof macro === "function" || !macro.unexpandable
      : object.prototype.hasownproperty.call(functions, name ) && !functions[name].primitive;
  }
}

// helpers for parser.js handling of unicode (sub|super)script characters.

const unicodesubregex = /^[‚Çö‚Çã‚Çú‚Çç‚Çû‚ÇÄ‚ÇÅ‚ÇÇ‚ÇÉ‚ÇÑ‚ÇÖ‚ÇÜ‚Çá‚Çà‚Çâ‚Çê‚Çë‚Çï·µ¢‚±º‚Çñ‚Çó‚Çò‚Çô‚Çí‚Çö·µ£‚Çõ‚Çú·µ§·µ•‚Çì·µ¶·µß·µ®·µ©·µ™]/;

const usubsandsups = object.freeze({
  '‚Çö': '+',
  '‚Çã': '-',
  '‚Çú': '=',
  '‚Çç': '(',
  '‚Çû': ')',
  '‚ÇÄ': '0',
  '‚ÇÅ': '1',
  '‚ÇÇ': '2',
  '‚ÇÉ': '3',
  '‚ÇÑ': '4',
  '‚ÇÖ': '5',
  '‚ÇÜ': '6',
  '‚Çá': '7',
  '‚Çà': '8',
  '‚Çâ': '9',
  '\u2090': 'a',
  '\u2091': 'e',
  '\u2095': 'h',
  '\u1d62': 'i',
  '\u2c7c': 'j',
  '\u2096': 'k',
  '\u2097': 'l',
  '\u2098': 'm',
  '\u2099': 'n',
  '\u2092': 'o',
  '\u209a': 'p',
  '\u1d63': 'r',
  '\u209b': 's',
  '\u209c': 't',
  '\u1d64': 'u',
  '\u1d65': 'v',
  '\u2093': 'x',
  '\u1d66': 'Ó≤',
  '\u1d67': 'Ó≥',
  '\u1d68': 'ÔÅ',
  '\u1d69': '\u03d5',
  '\u1d6a': 'Ôá',
  '‚Å∫': '+',
  '‚Åª': '-',
  '‚Åº': '=',
  '‚ÅΩ': '(',
  '‚Åæ': ')',
  '‚Å∞': '0',
  '‚π': '1',
  '‚≤': '2',
  '‚≥': '3',
  '‚Å¥': '4',
  '‚Åµ': '5',
  '‚Å∂': '6',
  '‚Å∑': '7',
  '‚Å∏': '8',
  '‚Åπ': '9',
  '\u1d2c': 'a',
  '\u1d2e': 'b',
  '\u1d30': 'd',
  '\u1d31': 'e',
  '\u1d33': 'g',
  '\u1d34': 'h',
  '\u1d35': 'i',
  '\u1d36': 'j',
  '\u1d37': 'k',
  '\u1d38': 'l',
  '\u1d39': 'm',
  '\u1d3a': 'n',
  '\u1d3c': 'o',
  '\u1d3e': 'p',
  '\u1d3f': 'r',
  '\u1d40': 't',
  '\u1d41': 'u',
  '\u2c7d': 'v',
  '\u1d42': 'w',
  '\u1d43': 'a',
  '\u1d47': 'b',
  '\u1d9c': 'c',
  '\u1d48': 'd',
  '\u1d49': 'e',
  '\u1da0': 'f',
  '\u1d4d': 'g',
  '\u02b0': 'h',
  '\u2071': 'i',
  '\u02b2': 'j',
  '\u1d4f': 'k',
  '\u02e1': 'l',
  '\u1d50': 'm',
  '\u207f': 'n',
  '\u1d52': 'o',
  '\u1d56': 'p',
  '\u02b3': 'r',
  '\u02e2': 's',
  '\u1d57': 't',
  '\u1d58': 'u',
  '\u1d5b': 'v',
  '\u02b7': 'w',
  '\u02e3': 'x',
  '\u02b8': 'y',
  '\u1dbb': 'z',
  '\u1d5d': 'Ó≤',
  '\u1d5e': 'Ó≥',
  '\u1d5f': 'Ó¥',
  '\u1d60': '\u03d5',
  '\u1d61': 'Ôá',
  '\u1dbf': 'Ó∏'
});

// used for unicode input of calligraphic and script letters
const asciifromscript = object.freeze({
  "\ud835\udc9c": "a",
  "\u212c": "b",
  "\ud835\udc9e": "c",
  "\ud835\udc9f": "d",
  "\u2130": "e",
  "\u2131": "f",
  "\ud835\udca2": "g",
  "\u210b": "h",
  "\u2110": "i",
  "\ud835\udca5": "j",
  "\ud835\udca6": "k",
  "\u2112": "l",
  "\u2133": "m",
  "\ud835\udca9": "n",
  "\ud835\udcaa": "o",
  "\ud835\udcab": "p",
  "\ud835\udcac": "q",
  "\u211b": "r",
  "\ud835\udcae": "s",
  "\ud835\udcaf": "t",
  "\ud835\udcb0": "u",
  "\ud835\udcb1": "v",
  "\ud835\udcb2": "w",
  "\ud835\udcb3": "x",
  "\ud835\udcb4": "y",
  "\ud835\udcb5": "z"
});

// mapping of unicode accent characters to their latex equivalent in text and
// math mode (when they exist).
var unicodeaccents = {
  "\u0301": { text: "\\'", math: "\\acute" },
  "\u0300": { text: "\\`", math: "\\grave" },
  "\u0308": { text: '\\"', math: "\\ddot" },
  "\u0303": { text: "\\~", math: "\\tilde" },
  "\u0304": { text: "\\=", math: "\\bar" },
  "\u0306": { text: "\\u", math: "\\breve" },
  "\u030c": { text: "\\v", math: "\\check" },
  "\u0302": { text: "\\^", math: "\\hat" },
  "\u0307": { text: "\\.", math: "\\dot" },
  "\u030a": { text: "\\r", math: "\\mathring" },
  "\u030b": { text: "\\h" },
  '\u0327': { text: '\\c' }
};

var unicodesymbols = {
  "„°": "aÏÅ",
  "„†": "aÏÄ",
  "„§": "aÏà",
  "Áˇ": "aÏàÏÑ",
  "„£": "aÏÉ",
  "‰Å": "aÏÑ",
  "‰É": "aÏÜ",
  "·∫Ø": "aÏÜÏÅ",
  "·∫±": "aÏÜÏÄ",
  "·∫µ": "aÏÜÏÉ",
  "Áû": "aÏú",
  "„¢": "aÏÇ",
  "·∫•": "aÏÇÏÅ",
  "·∫ß": "aÏÇÏÄ",
  "·∫´": "aÏÇÏÉ",
  "Ëß": "aÏá",
  "Á°": "aÏáÏÑ",
  "„•": "aÏö",
  "Áª": "aÏöÏÅ",
  "·∏É": "bÏá",
  "‰á": "cÏÅ",
  "‰ç": "cÏú",
  "‰â": "cÏÇ",
  "‰ã": "cÏá",
  "‰è": "dÏú",
  "·∏ã": "dÏá",
  "„©": "eÏÅ",
  "„®": "eÏÄ",
  "„´": "eÏà",
  "·∫Ω": "eÏÉ",
  "‰ì": "eÏÑ",
  "·∏ó": "eÏÑÏÅ",
  "·∏ï": "eÏÑÏÄ",
  "‰ï": "eÏÜ",
  "‰õ": "eÏú",
  "„™": "eÏÇ",
  "·∫ø": "eÏÇÏÅ",
  "·ªÅ": "eÏÇÏÄ",
  "·ªÖ": "eÏÇÏÉ",
  "‰ó": "eÏá",
  "·∏ˇ": "fÏá",
  "Áµ": "gÏÅ",
  "·∏°": "gÏÑ",
  "‰ˇ": "gÏÜ",
  "Áß": "gÏú",
  "‰ù": "gÏÇ",
  "‰°": "gÏá",
  "·∏ß": "hÏà",
  "Ëˇ": "hÏú",
  "‰•": "hÏÇ",
  "·∏£": "hÏá",
  "„≠": "iÏÅ",
  "„¨": "iÏÄ",
  "„Ø": "iÏà",
  "·∏Ø": "iÏàÏÅ",
  "‰©": "iÏÉ",
  "‰´": "iÏÑ",
  "‰≠": "iÏÜ",
  "Áê": "iÏú",
  "„Æ": "iÏÇ",
  "Á∞": "jÏú",
  "‰µ": "jÏÇ",
  "·∏±": "kÏÅ",
  "Á©": "kÏú",
  "‰∫": "lÏÅ",
  "‰æ": "lÏú",
  "·∏ø": "mÏÅ",
  "·πÅ": "mÏá",
  "ÂÑ": "nÏÅ",
  "Áπ": "nÏÄ",
  "„±": "nÏÉ",
  "Âà": "nÏú",
  "·πÖ": "nÏá",
  "„≥": "oÏÅ",
  "„≤": "oÏÄ",
  "„∂": "oÏà",
  "Ë´": "oÏàÏÑ",
  "„µ": "oÏÉ",
  "·πç": "oÏÉÏÅ",
  "·πè": "oÏÉÏà",
  "Ë≠": "oÏÉÏÑ",
  "Âç": "oÏÑ",
  "·πì": "oÏÑÏÅ",
  "·πë": "oÏÑÏÄ",
  "Âè": "oÏÜ",
  "Áí": "oÏú",
  "„¥": "oÏÇ",
  "·ªë": "oÏÇÏÅ",
  "·ªì": "oÏÇÏÄ",
  "·ªó": "oÏÇÏÉ",
  "ËØ": "oÏá",
  "Ë±": "oÏáÏÑ",
  "Âë": "oÏã",
  "·πï": "pÏÅ",
  "·πó": "pÏá",
  "Âï": "rÏÅ",
  "Âô": "rÏú",
  "·πô": "rÏá",
  "Âõ": "sÏÅ",
  "·π•": "sÏÅÏá",
  "Â°": "sÏú",
  "·πß": "sÏúÏá",
  "Âù": "sÏÇ",
  "·π°": "sÏá",
  "·∫ó": "tÏà",
  "Â•": "tÏú",
  "·π´": "tÏá",
  "„∫": "uÏÅ",
  "„π": "uÏÄ",
  "„º": "uÏà",
  "Áò": "uÏàÏÅ",
  "Áú": "uÏàÏÄ",
  "Áñ": "uÏàÏÑ",
  "Áö": "uÏàÏú",
  "Â©": "uÏÉ",
  "·ππ": "uÏÉÏÅ",
  "Â´": "uÏÑ",
  "·πª": "uÏÑÏà",
  "Â≠": "uÏÜ",
  "Áî": "uÏú",
  "„ª": "uÏÇ",
  "ÂØ": "uÏö",
  "Â±": "uÏã",
  "·πΩ": "vÏÉ",
  "·∫É": "wÏÅ",
  "·∫Å": "wÏÄ",
  "·∫Ö": "wÏà",
  "Âµ": "wÏÇ",
  "·∫á": "wÏá",
  "·∫ò": "wÏö",
  "·∫ç": "xÏà",
  "·∫ã": "xÏá",
  "„Ω": "yÏÅ",
  "·ª≥": "yÏÄ",
  "„ø": "yÏà",
  "·ªπ": "yÏÉ",
  "Ë≥": "yÏÑ",
  "Â∑": "yÏÇ",
  "·∫è": "yÏá",
  "·∫ô": "yÏö",
  "Â∫": "zÏÅ",
  "Âæ": "zÏú",
  "·∫ë": "zÏÇ",
  "Âº": "zÏá",
  "„Å": "aÏÅ",
  "„Ä": "aÏÄ",
  "„Ñ": "aÏà",
  "Áû": "aÏàÏÑ",
  "„É": "aÏÉ",
  "‰Ä": "aÏÑ",
  "‰Ç": "aÏÜ",
  "·∫Æ": "aÏÜÏÅ",
  "·∫∞": "aÏÜÏÄ",
  "·∫¥": "aÏÜÏÉ",
  "Áç": "aÏú",
  "„Ç": "aÏÇ",
  "·∫§": "aÏÇÏÅ",
  "·∫¶": "aÏÇÏÄ",
  "·∫™": "aÏÇÏÉ",
  "Ë¶": "aÏá",
  "Á†": "aÏáÏÑ",
  "„Ö": "aÏö",
  "Á∫": "aÏöÏÅ",
  "·∏Ç": "bÏá",
  "‰Ü": "cÏÅ",
  "‰ú": "cÏú",
  "‰à": "cÏÇ",
  "‰ö": "cÏá",
  "‰û": "dÏú",
  "·∏ö": "dÏá",
  "„â": "eÏÅ",
  "„à": "eÏÄ",
  "„ã": "eÏà",
  "·∫º": "eÏÉ",
  "‰í": "eÏÑ",
  "·∏ñ": "eÏÑÏÅ",
  "·∏î": "eÏÑÏÄ",
  "‰î": "eÏÜ",
  "‰ö": "eÏú",
  "„ö": "eÏÇ",
  "·∫æ": "eÏÇÏÅ",
  "·ªÄ": "eÏÇÏÄ",
  "·ªÑ": "eÏÇÏÉ",
  "‰ñ": "eÏá",
  "·∏û": "fÏá",
  "Á¥": "gÏÅ",
  "·∏†": "gÏÑ",
  "‰û": "gÏÜ",
  "Á¶": "gÏú",
  "‰ú": "gÏÇ",
  "‰†": "gÏá",
  "·∏¶": "hÏà",
  "Ëû": "hÏú",
  "‰§": "hÏÇ",
  "·∏¢": "hÏá",
  "„ç": "iÏÅ",
  "„ú": "iÏÄ",
  "„è": "iÏà",
  "·∏Æ": "iÏàÏÅ",
  "‰®": "iÏÉ",
  "‰™": "iÏÑ",
  "‰¨": "iÏÜ",
  "Áè": "iÏú",
  "„û": "iÏÇ",
  "‰∞": "iÏá",
  "‰¥": "jÏÇ",
  "·∏∞": "kÏÅ",
  "Á®": "kÏú",
  "‰π": "lÏÅ",
  "‰Ω": "lÏú",
  "·∏æ": "mÏÅ",
  "·πÄ": "mÏá",
  "ÂÉ": "nÏÅ",
  "Á∏": "nÏÄ",
  "„ë": "nÏÉ",
  "Âá": "nÏú",
  "·πÑ": "nÏá",
  "„ì": "oÏÅ",
  "„í": "oÏÄ",
  "„ñ": "oÏà",
  "Ë™": "oÏàÏÑ",
  "„ï": "oÏÉ",
  "·πú": "oÏÉÏÅ",
  "·πû": "oÏÉÏà",
  "Ë¨": "oÏÉÏÑ",
  "Âú": "oÏÑ",
  "·πí": "oÏÑÏÅ",
  "·πê": "oÏÑÏÄ",
  "Âû": "oÏÜ",
  "Áë": "oÏú",
  "„î": "oÏÇ",
  "·ªê": "oÏÇÏÅ",
  "·ªí": "oÏÇÏÄ",
  "·ªñ": "oÏÇÏÉ",
  "ËÆ": "oÏá",
  "Ë∞": "oÏáÏÑ",
  "Âê": "oÏã",
  "·πî": "pÏÅ",
  "·πñ": "pÏá",
  "Âî": "rÏÅ",
  "Âò": "rÏú",
  "·πò": "rÏá",
  "Âö": "sÏÅ",
  "·π§": "sÏÅÏá",
  "Â†": "sÏú",
  "·π¶": "sÏúÏá",
  "Âú": "sÏÇ",
  "·π†": "sÏá",
  "Â§": "tÏú",
  "·π™": "tÏá",
  "„ö": "uÏÅ",
  "„ô": "uÏÄ",
  "„ú": "uÏà",
  "Áó": "uÏàÏÅ",
  "Áõ": "uÏàÏÄ",
  "Áï": "uÏàÏÑ",
  "Áô": "uÏàÏú",
  "Â®": "uÏÉ",
  "·π∏": "uÏÉÏÅ",
  "Â™": "uÏÑ",
  "·π∫": "uÏÑÏà",
  "Â¨": "uÏÜ",
  "Áì": "uÏú",
  "„õ": "uÏÇ",
  "ÂÆ": "uÏö",
  "Â∞": "uÏã",
  "·πº": "vÏÉ",
  "·∫Ç": "wÏÅ",
  "·∫Ä": "wÏÄ",
  "·∫Ñ": "wÏà",
  "Â¥": "wÏÇ",
  "·∫Ü": "wÏá",
  "·∫ú": "xÏà",
  "·∫ö": "xÏá",
  "„ù": "yÏÅ",
  "·ª≤": "yÏÄ",
  "Â∏": "yÏà",
  "·ª∏": "yÏÉ",
  "Ë≤": "yÏÑ",
  "Â∂": "yÏÇ",
  "·∫û": "yÏá",
  "Âπ": "zÏÅ",
  "ÂΩ": "zÏú",
  "·∫ê": "zÏÇ",
  "Âª": "zÏá",
  "Ó¨": "Ó±ÏÅ",
  "·Ω∞": "Ó±ÏÄ",
  "·æ±": "Ó±ÏÑ",
  "·æ∞": "Ó±ÏÜ",
  "Ó≠": "ÓµÏÅ",
  "·Ω≤": "ÓµÏÄ",
  "ÓÆ": "Ó∑ÏÅ",
  "·Ω¥": "Ó∑ÏÄ",
  "ÓØ": "ÓπÏÅ",
  "·Ω∂": "ÓπÏÄ",
  "Ôö": "ÓπÏà",
  "Óê": "ÓπÏàÏÅ",
  "·øí": "ÓπÏàÏÄ",
  "·øë": "ÓπÏÑ",
  "·øê": "ÓπÏÜ",
  "Ôú": "ÓøÏÅ",
  "·Ω∏": "ÓøÏÄ",
  "Ôç": "ÔÖÏÅ",
  "·Ω∫": "ÔÖÏÄ",
  "Ôã": "ÔÖÏà",
  "Ó∞": "ÔÖÏàÏÅ",
  "·ø¢": "ÔÖÏàÏÄ",
  "·ø°": "ÔÖÏÑ",
  "·ø†": "ÔÖÏÜ",
  "Ôû": "ÔâÏÅ",
  "·Ωº": "ÔâÏÄ",
  "Óû": "Ó•ÏÅ",
  "·ø™": "Ó•ÏÄ",
  "Ó´": "Ó•Ïà",
  "·ø©": "Ó•ÏÑ",
  "·ø®": "Ó•ÏÜ",
  "Óè": "Ó©ÏÅ",
  "·ø∫": "Ó©ÏÄ"
};

/* eslint no-constant-condition:0 */

const binleftcancellers = ["bin", "op", "open", "punct", "rel"];
const sizeregex = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/;

/**
 * this file contains the parser used to parse out a tex expression from the
 * input. since tex isn't context-free, standard parsers don't work particularly
 * well.
 *
 * the strategy of this parser is as such:
 *
 * the main functions (the `.parse...` ones) take a position in the current
 * parse string to parse tokens from. the lexer (found in lexer.js, stored at
 * this.gullet.lexer) also supports pulling out tokens at arbitrary places. when
 * individual tokens are needed at a position, the lexer is called to pull out a
 * token, which is then used.
 *
 * the parser has a property called "mode" indicating the mode that
 * the parser is currently in. currently it has to be one of "math" or
 * "text", which denotes whether the current environment is a math-y
 * one or a text-y one (e.g. inside \text). currently, this serves to
 * limit the functions which can be used in text mode.
 *
 * the main functions then return an object which contains the useful data that
 * was parsed at its given point, and a new position at the end of the parsed
 * data. the main functions can call each other and continue the parsing by
 * using the returned position as a new starting point.
 *
 * there are also extra `.handle...` functions, which pull out some reused
 * functionality into self-contained functions.
 *
 * the functions return parsenodes.
 */

class parser {
  constructor(input, settings, ispreamble = false) {
    // start in math mode
    this.mode = "math";
    // create a new macro expander (gullet) and (indirectly via that) also a
    // new lexer (mouth) for this parser (stomach, in the language of tex)
    this.gullet = new macroexpander(input, settings, this.mode);
    // store the settings for use in parsing
    this.settings = settings;
    // are we defining a preamble?
    this.ispreamble = ispreamble;
    // count leftright depth (for \middle errors)
    this.leftrightdepth = 0;
    this.prevatomtype = "";
  }

  /**
   * checks a result to make sure it has the right type, and throws an
   * appropriate error otherwise.
   */
  expect(text, consume = true) {
    if (this.fetch().text !== text) {
      throw new parseerror(`expected '${text}', got '${this.fetch().text}'`, this.fetch());
    }
    if (consume) {
      this.consume();
    }
  }

  /**
   * discards the current lookahead token, considering it consumed.
   */
  consume() {
    this.nexttoken = null;
  }

  /**
   * return the current lookahead token, or if there isn't one (at the
   * beginning, or if the previous lookahead token was consume()d),
   * fetch the next token as the new lookahead token and return it.
   */
  fetch() {
    if (this.nexttoken == null) {
      this.nexttoken = this.gullet.expandnexttoken();
    }
    return this.nexttoken;
  }

  /**
   * switches between "text" and "math" modes.
   */
  switchmode(newmode) {
    this.mode = newmode;
    this.gullet.switchmode(newmode);
  }

  /**
   * main parsing function, which parses an entire input.
   */
  parse() {
    // create a group namespace for every $...$, $$...$$, \[...\].)
    // a \def is then valid only within that pair of delimiters.
    this.gullet.begingroup();

    if (this.settings.coloristextcolor) {
      // use old \color behavior (same as latex's \textcolor) if requested.
      // we do this within the group for the math expression, so it doesn't
      // pollute settings.macros.
      this.gullet.macros.set("\\color", "\\textcolor");
    }

    // try to parse the input
    const parse = this.parseexpression(false);

    // if we succeeded, make sure there's an eof at the end
    this.expect("eof");

    if (this.ispreamble) {
      const macros = object.create(null);
      object.entries(this.gullet.macros.current).foreach(([key, value]) => {
        macros[key] = value;
      });
      this.gullet.endgroup();
      return macros
    }

    // the only local macro that we want to save is from \tag.
    const tag = this.gullet.macros.get("\\df@tag");

    // end the group namespace for the expression
    this.gullet.endgroup();

    if (tag) { this.gullet.macros.current["\\df@tag"] = tag; }

    return parse;
  }

  static get endofexpression() {
    return ["}", "\\endgroup", "\\end", "\\right", "\\endtoggle", "&"];
  }

  /**
   * fully parse a separate sequence of tokens as a separate job.
   * tokens should be specified in reverse order, as in a macrodefinition.
   */
  subparse(tokens) {
    // save the next token from the current job.
    const oldtoken = this.nexttoken;
    this.consume();

    // run the new job, terminating it with an excess '}'
    this.gullet.pushtoken(new token("}"));
    this.gullet.pushtokens(tokens);
    const parse = this.parseexpression(false);
    this.expect("}");

    // restore the next token from the current job.
    this.nexttoken = oldtoken;

    return parse;
  }

/**
   * parses an "expression", which is a list of atoms.
   *
   * `breakoninfix`: should the parsing stop when we hit infix nodes? this
   *                 happens when functions have higher precedence han infix
   *                 nodes in implicit parses.
   *
   * `breakontokentext`: the text of the token that the expression should end
   *                     with, or `null` if something else should end the
   *                     expression.
   *
   * `breakonmiddle`: \color, \over, and old styling functions work on an implicit group.
   *                  these groups end just before the usual tokens, but they also
   *                  end just before `\middle`.
   */
  parseexpression(breakoninfix, breakontokentext, breakonmiddle) {
    const body = [];
    this.prevatomtype = "";
    // keep adding atoms to the body until we can't parse any more atoms (either
    // we reached the end, a }, or a \right)
    while (true) {
      // ignore spaces in math mode
      if (this.mode === "math") {
        this.consumespaces();
      }
      const lex = this.fetch();
      if (parser.endofexpression.indexof(lex.text) !== -1) {
        break;
      }
      if (breakontokentext && lex.text === breakontokentext) {
        break;
      }
      if (breakonmiddle && lex.text === "\\middle") {
        break
      }
      if (breakoninfix && functions[lex.text] && functions[lex.text].infix) {
        break;
      }
      const atom = this.parseatom(breakontokentext);
      if (!atom) {
        break;
      } else if (atom.type === "internal") {
        continue;
      }
      body.push(atom);
      // keep a record of the atom type, so that op.js can set correct spacing.
      this.prevatomtype = atom.type === "atom" ? atom.family : atom.type;
    }
    if (this.mode === "text") {
      this.formligatures(body);
    }
    return this.handleinfixnodes(body);
  }

  /**
   * rewrites infix operators such as \over with corresponding commands such
   * as \frac.
   *
   * there can only be one infix operator per group.  if there's more than one
   * then the expression is ambiguous.  this can be resolved by adding {}.
   */
  handleinfixnodes(body) {
    let overindex = -1;
    let funcname;

    for (let i = 0; i < body.length; i++) {
      if (body[i].type === "infix") {
        if (overindex !== -1) {
          throw new parseerror("only one infix operator per group", body[i].token);
        }
        overindex = i;
        funcname = body[i].replacewith;
      }
    }

    if (overindex !== -1 && funcname) {
      let numernode;
      let denomnode;

      const numerbody = body.slice(0, overindex);
      const denombody = body.slice(overindex + 1);

      if (numerbody.length === 1 && numerbody[0].type === "ordgroup") {
        numernode = numerbody[0];
      } else {
        numernode = { type: "ordgroup", mode: this.mode, body: numerbody };
      }

      if (denombody.length === 1 && denombody[0].type === "ordgroup") {
        denomnode = denombody[0];
      } else {
        denomnode = { type: "ordgroup", mode: this.mode, body: denombody };
      }

      let node;
      if (funcname === "\\\\abovefrac") {
        node = this.callfunction(funcname, [numernode, body[overindex], denomnode], []);
      } else {
        node = this.callfunction(funcname, [numernode, denomnode], []);
      }
      return [node];
    } else {
      return body;
    }
  }

  /**
   * handle a subscript or superscript with nice errors.
   */
  handlesupsubscript(
    name // for error reporting.
  ) {
    const symboltoken = this.fetch();
    const symbol = symboltoken.text;
    this.consume();
    this.consumespaces(); // ignore spaces before sup/subscript argument
    const group = this.parsegroup(name);

    if (!group) {
      throw new parseerror("expected group after '" + symbol + "'", symboltoken);
    }

    return group;
  }

  /**
   * converts the textual input of an unsupported command into a text node
   * contained within a color node whose color is determined by errorcolor
   */
  formatunsupportedcmd(text) {
    const textordarray = [];

    for (let i = 0; i < text.length; i++) {
      textordarray.push({ type: "textord", mode: "text", text: text[i] });
    }

    const textnode = {
      type: "text",
      mode: this.mode,
      body: textordarray
    };

    const colornode = {
      type: "color",
      mode: this.mode,
      color: this.settings.errorcolor,
      body: [textnode]
    };

    return colornode;
  }

  /**
   * parses a group with optional super/subscripts.
   */
  parseatom(breakontokentext) {
    // the body of an atom is an implicit group, so that things like
    // \left(x\right)^2 work correctly.
    const base = this.parsegroup("atom", breakontokentext);

    // in text mode, we don't have superscripts or subscripts
    if (this.mode === "text") {
      return base;
    }

    // note that base may be empty (i.e. null) at this point.

    let superscript;
    let subscript;
    while (true) {
      // guaranteed in math mode, so eat any spaces first.
      this.consumespaces();

      // lex the first token
      const lex = this.fetch();

      if (lex.text === "\\limits" || lex.text === "\\nolimits") {
        // we got a limit control
        if (base && base.type === "op") {
          const limits = lex.text === "\\limits";
          base.limits = limits;
          base.alwayshandlesupsub = true;
        } else if (base && base.type === "operatorname") {
          if (base.alwayshandlesupsub) {
            base.limits = lex.text === "\\limits";
          }
        } else {
          throw new parseerror("limit controls must follow a math operator", lex);
        }
        this.consume();
      } else if (lex.text === "^") {
        // we got a superscript start
        if (superscript) {
          throw new parseerror("double superscript", lex);
        }
        superscript = this.handlesupsubscript("superscript");
      } else if (lex.text === "_") {
        // we got a subscript start
        if (subscript) {
          throw new parseerror("double subscript", lex);
        }
        subscript = this.handlesupsubscript("subscript");
      } else if (lex.text === "'") {
        // we got a prime
        if (superscript) {
          throw new parseerror("double superscript", lex);
        }
        const prime = { type: "textord", mode: this.mode, text: "\\prime" };

        // many primes can be grouped together, so we handle this here
        const primes = [prime];
        this.consume();
        // keep lexing tokens until we get something that's not a prime
        while (this.fetch().text === "'") {
          // for each one, add another prime to the list
          primes.push(prime);
          this.consume();
        }
        // if there's a superscript following the primes, combine that
        // superscript in with the primes.
        if (this.fetch().text === "^") {
          primes.push(this.handlesupsubscript("superscript"));
        }
        // put everything into an ordgroup as the superscript
        superscript = { type: "ordgroup", mode: this.mode, body: primes };
      } else if (usubsandsups[lex.text]) {
        // a unicode subscript or superscript character.
        // we treat these similarly to the unicode-math package.
        // so we render a string of unicode (sub|super)scripts the
        // same as a (sub|super)script of regular characters.
        const issub = unicodesubregex.test(lex.text);
        const subsuptokens = [];
        subsuptokens.push(new token(usubsandsups[lex.text]));
        this.consume();
        // continue fetching tokens to fill out the group.
        while (true) {
          const token = this.fetch().text;
          if (!(usubsandsups[token])) { break }
          if (unicodesubregex.test(token) !== issub) { break }
          subsuptokens.unshift(new token(usubsandsups[token]));
          this.consume();
        }
        // now create a (sub|super)script.
        const body = this.subparse(subsuptokens);
        if (issub) {
          subscript = { type: "ordgroup", mode: "math", body };
        } else {
          superscript = { type: "ordgroup", mode: "math", body };
        }
      } else {
        // if it wasn't ^, _, a unicode (sub|super)script, or ', stop parsing super/subscripts
        break;
      }
    }

    if (superscript || subscript) {
      if (base && base.type === "multiscript" && !base.postscripts) {
        // base is the result of a \prescript function.
        // write the sub- & superscripts into the multiscript element.
        base.postscripts = { sup: superscript, sub: subscript };
        return base
      } else {
        // we got either a superscript or subscript, create a supsub
        const isfollowedbydelimiter = (!base || base.type !== "op" && base.type !== "operatorname")
          ? undefined
          : isdelimiter(this.nexttoken.text);
        return {
          type: "supsub",
          mode: this.mode,
          base: base,
          sup: superscript,
          sub: subscript,
          isfollowedbydelimiter
        }
      }
    } else {
      // otherwise return the original body
      return base;
    }
  }

  /**
   * parses an entire function, including its base and all of its arguments.
   */
  parsefunction(
    breakontokentext,
    name // for determining its context
  ) {
    const token = this.fetch();
    const func = token.text;
    const funcdata = functions[func];
    if (!funcdata) {
      return null;
    }
    this.consume(); // consume command token

    if (name && name !== "atom" && !funcdata.allowedinargument) {
      throw new parseerror(
        "got function '" + func + "' with no arguments" + (name ? " as " + name : ""),
        token
      );
    } else if (this.mode === "text" && !funcdata.allowedintext) {
      throw new parseerror("can't use function '" + func + "' in text mode", token);
    } else if (this.mode === "math" && funcdata.allowedinmath === false) {
      throw new parseerror("can't use function '" + func + "' in math mode", token);
    }

    const prevatomtype = this.prevatomtype;
    const { args, optargs } = this.parsearguments(func, funcdata);
    this.prevatomtype = prevatomtype;
    return this.callfunction(func, args, optargs, token, breakontokentext);
  }

  /**
   * call a function handler with a suitable context and arguments.
   */
  callfunction(name, args, optargs, token, breakontokentext) {
    const context = {
      funcname: name,
      parser: this,
      token,
      breakontokentext
    };
    const func = functions[name];
    if (func && func.handler) {
      return func.handler(context, args, optargs);
    } else {
      throw new parseerror(`no function handler for ${name}`);
    }
  }

  /**
   * parses the arguments of a function or environment
   */
  parsearguments(
    func, // should look like "\name" or "\begin{name}".
    funcdata
  ) {
    const totalargs = funcdata.numargs + funcdata.numoptionalargs;
    if (totalargs === 0) {
      return { args: [], optargs: [] };
    }

    const args = [];
    const optargs = [];

    for (let i = 0; i < totalargs; i++) {
      let argtype = funcdata.argtypes && funcdata.argtypes[i];
      const isoptional = i < funcdata.numoptionalargs;

      if (
        (funcdata.primitive && argtype == null) ||
        // \sqrt expands into primitive if optional argument doesn't exist
        (funcdata.type === "sqrt" && i === 1 && optargs[0] == null)
      ) {
        argtype = "primitive";
      }

      const arg = this.parsegroupoftype(`argument to '${func}'`, argtype, isoptional);
      if (isoptional) {
        optargs.push(arg);
      } else if (arg != null) {
        args.push(arg);
      } else {
        // should be unreachable
        throw new parseerror("null argument, please report this as a bug");
      }
    }

    return { args, optargs };
  }

  /**
   * parses a group when the mode is changing.
   */
  parsegroupoftype(name, type, optional) {
    switch (type) {
      case "size":
        return this.parsesizegroup(optional);
      case "url":
        return this.parseurlgroup(optional);
      case "math":
      case "text":
        return this.parseargumentgroup(optional, type);
      case "hbox": {
        // hbox argument type wraps the argument in the equivalent of
        // \hbox, which is like \text but switching to \textstyle size.
        const group = this.parseargumentgroup(optional, "text");
        return group != null
          ? {
            type: "styling",
            mode: group.mode,
            body: [group],
            scriptlevel: "text" // simulate \textstyle
          }
          : null;
      }
      case "raw": {
        const token = this.parsestringgroup("raw", optional);
        return token != null
          ? {
            type: "raw",
            mode: "text",
            string: token.text
          }
          : null;
      }
      case "primitive": {
        if (optional) {
          throw new parseerror("a primitive argument cannot be optional");
        }
        const group = this.parsegroup(name);
        if (group == null) {
          throw new parseerror("expected group as " + name, this.fetch());
        }
        return group;
      }
      case "original":
      case null:
      case undefined:
        return this.parseargumentgroup(optional);
      default:
        throw new parseerror("unknown group type as " + name, this.fetch());
    }
  }

  /**
   * discard any space tokens, fetching the next non-space token.
   */
  consumespaces() {
    while (true) {
      const ch = this.fetch().text;
      // \ufe0e is the unicode variation selector to supress emoji. ignore it.
      if (ch === " " || ch === "\u00a0" || ch === "\ufe0e") {
        this.consume();
      } else {
        break
      }
    }
  }

  /**
   * parses a group, essentially returning the string formed by the
   * brace-enclosed tokens plus some position information.
   */
  parsestringgroup(
    modename, // used to describe the mode in error messages.
    optional
  ) {
    const argtoken = this.gullet.scanargument(optional);
    if (argtoken == null) {
      return null;
    }
    let str = "";
    let nexttoken;
    while ((nexttoken = this.fetch()).text !== "eof") {
      str += nexttoken.text;
      this.consume();
    }
    this.consume(); // consume the end of the argument
    argtoken.text = str;
    return argtoken;
  }

  /**
   * parses a regex-delimited group: the largest sequence of tokens
   * whose concatenated strings match `regex`. returns the string
   * formed by the tokens plus some position information.
   */
  parseregexgroup(
    regex,
    modename // used to describe the mode in error messages.
  ) {
    const firsttoken = this.fetch();
    let lasttoken = firsttoken;
    let str = "";
    let nexttoken;
    while ((nexttoken = this.fetch()).text !== "eof" && regex.test(str + nexttoken.text)) {
      lasttoken = nexttoken;
      str += lasttoken.text;
      this.consume();
    }
    if (str === "") {
      throw new parseerror("invalid " + modename + ": '" + firsttoken.text + "'", firsttoken);
    }
    return firsttoken.range(lasttoken, str);
  }

  /**
   * parses a size specification, consisting of magnitude and unit.
   */
  parsesizegroup(optional) {
    let res;
    let isblank = false;
    // don't expand before parsestringgroup
    this.gullet.consumespaces();
    if (!optional && this.gullet.future().text !== "{") {
      res = this.parseregexgroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size");
    } else {
      res = this.parsestringgroup("size", optional);
    }
    if (!res) {
      return null;
    }
    if (!optional && res.text.length === 0) {
      // because we've tested for what is !optional, this block won't
      // affect \kern, \hspace, etc. it will capture the mandatory arguments
      // to \genfrac and \above.
      res.text = "0pt"; // enable \above{}
      isblank = true; // this is here specifically for \genfrac
    }
    const match = sizeregex.exec(res.text);
    if (!match) {
      throw new parseerror("invalid size: '" + res.text + "'", res);
    }
    const data = {
      number: +(match[1] + match[2]), // sign + magnitude, cast to number
      unit: match[3]
    };
    if (!validunit(data)) {
      throw new parseerror("invalid unit: '" + data.unit + "'", res);
    }
    return {
      type: "size",
      mode: this.mode,
      value: data,
      isblank
    };
  }

  /**
   * parses an url, checking escaped letters and allowed protocols,
   * and setting the catcode of % as an active character (as in \hyperref).
   */
  parseurlgroup(optional) {
    this.gullet.lexer.setcatcode("%", 13); // active character
    this.gullet.lexer.setcatcode("~", 12); // other character
    const res = this.parsestringgroup("url", optional);
    this.gullet.lexer.setcatcode("%", 14); // comment character
    this.gullet.lexer.setcatcode("~", 13); // active character
    if (res == null) {
      return null;
    }
    // hyperref package allows backslashes alone in href, but doesn't
    // generate valid links in such cases; we interpret this as
    // "undefined" behaviour, and keep them as-is. some browser will
    // replace backslashes with forward slashes.
    let url = res.text.replace(/\\([#$%&~_^{}])/g, "$1");
    url = res.text.replace(/{\u2044}/g, "/");
    return {
      type: "url",
      mode: this.mode,
      url
    };
  }

  /**
   * parses an argument with the mode specified.
   */
  parseargumentgroup(optional, mode) {
    const argtoken = this.gullet.scanargument(optional);
    if (argtoken == null) {
      return null;
    }
    const outermode = this.mode;
    if (mode) {
      // switch to specified mode
      this.switchmode(mode);
    }

    this.gullet.begingroup();
    const expression = this.parseexpression(false, "eof");
    // todo: find an alternative way to denote the end
    this.expect("eof"); // expect the end of the argument
    this.gullet.endgroup();
    const result = {
      type: "ordgroup",
      mode: this.mode,
      loc: argtoken.loc,
      body: expression
    };

    if (mode) {
      // switch mode back
      this.switchmode(outermode);
    }
    return result;
  }

  /**
   * parses an ordinary group, which is either a single nucleus (like "x")
   * or an expression in braces (like "{x+y}") or an implicit group, a group
   * that starts at the current position, and ends right before a higher explicit
   * group ends, or at eof.
   */
  parsegroup(
    name, // for error reporting.
    breakontokentext
  ) {
    const firsttoken = this.fetch();
    const text = firsttoken.text;

    let result;
    // try to parse an open brace or \begingroup
    if (text === "{" || text === "\\begingroup" || text === "\\toggle") {
      this.consume();
      const groupend = text === "{"
        ? "}"
        : text === "\\begingroup"
        ? "\\endgroup"
        : "\\endtoggle";

      this.gullet.begingroup();
      // if we get a brace, parse an expression
      const expression = this.parseexpression(false, groupend);
      const lasttoken = this.fetch();
      this.expect(groupend); // check that we got a matching closing brace
      this.gullet.endgroup();
      result = {
        type: (lasttoken.text === "\\endtoggle" ? "toggle" : "ordgroup"),
        mode: this.mode,
        loc: sourcelocation.range(firsttoken, lasttoken),
        body: expression,
        // a group formed by \begingroup...\endgroup is a semi-simple group
        // which doesn't affect spacing in math mode, i.e., is transparent.
        // https://tex.stackexchange.com/questions/1930/
        semisimple: text === "\\begingroup" || undefined
      };
    } else {
      // if there exists a function with this name, parse the function.
      // otherwise, just return a nucleus
      result = this.parsefunction(breakontokentext, name) || this.parsesymbol();
      if (result == null && text[0] === "\\" &&
          !object.prototype.hasownproperty.call(implicitcommands, text )) {
        result = this.formatunsupportedcmd(text);
        this.consume();
      }
    }
    return result;
  }

  /**
   * form ligature-like combinations of characters for text mode.
   * this includes inputs like "--", "---", "``" and "''".
   * the result will simply replace multiple textord nodes with a single
   * character in each value by a single textord node having multiple
   * characters in its value.  the representation is still ascii source.
   * the group will be modified in place.
   */
  formligatures(group) {
    let n = group.length - 1;
    for (let i = 0; i < n; ++i) {
      const a = group[i];
      const v = a.text;
      if (v === "-" && group[i + 1].text === "-") {
        if (i + 1 < n && group[i + 2].text === "-") {
          group.splice(i, 3, {
            type: "textord",
            mode: "text",
            loc: sourcelocation.range(a, group[i + 2]),
            text: "---"
          });
          n -= 2;
        } else {
          group.splice(i, 2, {
            type: "textord",
            mode: "text",
            loc: sourcelocation.range(a, group[i + 1]),
            text: "--"
          });
          n -= 1;
        }
      }
      if ((v === "'" || v === "`") && group[i + 1].text === v) {
        group.splice(i, 2, {
          type: "textord",
          mode: "text",
          loc: sourcelocation.range(a, group[i + 1]),
          text: v + v
        });
        n -= 1;
      }
    }
  }

  /**
   * parse a single symbol out of the string. here, we handle single character
   * symbols and special functions like \verb.
   */
  parsesymbol() {
    const nucleus = this.fetch();
    let text = nucleus.text;

    if (/^\\verb[^a-za-z]/.test(text)) {
      this.consume();
      let arg = text.slice(5);
      const star = arg.charat(0) === "*";
      if (star) {
        arg = arg.slice(1);
      }
      // lexer's tokenregex is constructed to always have matching
      // first/last characters.
      if (arg.length < 2 || arg.charat(0) !== arg.slice(-1)) {
        throw new parseerror(`\\verb assertion failed --
                    please report what input caused this bug`);
      }
      arg = arg.slice(1, -1); // remove first and last char
      return {
        type: "verb",
        mode: "text",
        body: arg,
        star
      };
    }
    // at this point, we should have a symbol, possibly with accents.
    // first expand any accented base symbol according to unicodesymbols.
    if (object.prototype.hasownproperty.call(unicodesymbols, text[0]) &&
      this.mode === "math" && !symbols[this.mode][text[0]]) {
      // this behavior is not strict (xetex-compatible) in math mode.
      if (this.settings.strict && this.mode === "math") {
        throw new parseerror(`accented unicode text character "${text[0]}" used in ` + `math mode`,
          nucleus
        );
      }
      text = unicodesymbols[text[0]] + text.slice(1);
    }
    // strip off any combining characters
    const match = this.mode === "math"
      ? combiningdiacriticalmarksendregex.exec(text)
      : null;
    if (match) {
      text = text.substring(0, match.index);
      if (text === "i") {
        text = "\u0131"; // dotless i, in math and text mode
      } else if (text === "j") {
        text = "\u0237"; // dotless j, in math and text mode
      }
    }
    // recognize base symbol
    let symbol;
    if (symbols[this.mode][text]) {
      let group = symbols[this.mode][text].group;
      if (group === "bin" && binleftcancellers.includes(this.prevatomtype)) {
        // change from a binary operator to a unary (prefix) operator
        group = "open";
      }
      const loc = sourcelocation.range(nucleus);
      let s;
      if (object.prototype.hasownproperty.call(atoms, group )) {
        const family = group;
        s = {
          type: "atom",
          mode: this.mode,
          family,
          loc,
          text
        };
      } else {
        if (asciifromscript[text]) {
          // unicode 14 disambiguates chancery from roundhand.
          // see https://www.unicode.org/charts/pdf/u1d400.pdf
          this.consume();
          const nextcode = this.fetch().text.charcodeat(0);
          // mathcal is temml default. use mathscript if called for.
          const font = nextcode === 0xfe01 ? "mathscr" : "mathcal";
          if (nextcode === 0xfe00 || nextcode === 0xfe01) { this.consume(); }
          return {
            type: "font",
            mode: "math",
            font,
            body: { type: "mathord", mode: "math", loc, text: asciifromscript[text] }
          }
        }
        // default ord character. no disambiguation necessary.
        s = {
          type: group,
          mode: this.mode,
          loc,
          text
        };
      }
      symbol = s;
    } else if (text.charcodeat(0) >= 0x80 || combiningdiacriticalmarksendregex.exec(text)) {
      // no symbol for e.g. ^
      if (this.settings.strict && this.mode === "math") {
        throw new parseerror(`unicode text character "${text[0]}" used in math mode`, nucleus)
      }
      // all nonmathematical unicode characters are rendered as if they
      // are in text mode (wrapped in \text) because that's what it
      // takes to render them in latex.
      symbol = {
        type: "textord",
        mode: "text",
        loc: sourcelocation.range(nucleus),
        text
      };
    } else {
      return null; // eof, ^, _, {, }, etc.
    }
    this.consume();
    // transform combining characters into accents
    if (match) {
      for (let i = 0; i < match[0].length; i++) {
        const accent = match[0][i];
        if (!unicodeaccents[accent]) {
          throw new parseerror(`unknown accent ' ${accent}'`, nucleus);
        }
        const command = unicodeaccents[accent][this.mode] ||
                        unicodeaccents[accent].text;
        if (!command) {
          throw new parseerror(`accent ${accent} unsupported in ${this.mode} mode`, nucleus);
        }
        symbol = {
          type: "accent",
          mode: this.mode,
          loc: sourcelocation.range(nucleus),
          label: command,
          isstretchy: false,
          base: symbol
        };
      }
    }
    return symbol;
  }
}

/**
 * parses an expression using a parser, then returns the parsed result.
 */
const parsetree = function(toparse, settings) {
  if (!(typeof toparse === "string" || toparse instanceof string)) {
    throw new typeerror("temml can only parse string typed expression")
  }
  const parser = new parser(toparse, settings);
  // blank out any \df@tag to avoid spurious "duplicate \tag" errors
  delete parser.gullet.macros.current["\\df@tag"];

  let tree = parser.parse();

  // latex ignores a \tag placed outside an ams environment.
  if (!(tree.length > 0 &&  tree[0].type && tree[0].type === "array" && tree[0].addeqnnum)) {
    // if the input used \tag, it will set the \df@tag macro to the tag.
    // in this case, we separately parse the tag and wrap the tree.
    if (parser.gullet.macros.get("\\df@tag")) {
      if (!settings.displaymode) {
        throw new parseerror("\\tag works only in display mode")
      }
      parser.gullet.feed("\\df@tag");
      tree = [
        {
          type: "tag",
          mode: "text",
          body: tree,
          tag: parser.parse()
        }
      ];
    }
  }

  return tree
};

/**
 * this file contains information about the style that the mathmlbuilder carries
 * around with it. data is held in an `style` object, and when
 * recursing, a new `style` object can be created with the `.with*` functions.
 */

const suborsuplevel = [2, 2, 3, 3];

/**
 * this is the main style class. it contains the current style.level, color, and font.
 *
 * style objects should not be modified. to create a new style with
 * different properties, call a `.with*` method.
 */
class style {
  constructor(data) {
    // style.level can be 0 | 1 | 2 | 3, which correspond to
    //       displaystyle, textstyle, scriptstyle, and scriptscriptstyle.
    // style.level usually does not directly set mathml's script level. mathml does that itself.
    // however, chromium does not stop shrinking after scriptscriptstyle, so we do explicitly
    // set a scriptlevel attribute in those conditions.
    // we also use style.level to track math style so that we can get the correct
    // scriptlevel when needed in supsub.js, mathchoice.js, or for dimensions in em.
    this.level = data.level;
    this.color = data.color;  // string | void
    // a font family applies to a group of fonts (i.e. sansserif), while a font
    // represents a specific font (i.e. sansserif bold).
    // see: https://tex.stackexchange.com/questions/22350/difference-between-textrm-and-mathrm
    this.font = data.font || "";                // string
    this.fontfamily = data.fontfamily || "";    // string
    this.fontsize = data.fontsize || 1.0;       // number
    this.fontweight = data.fontweight || "";
    this.fontshape = data.fontshape || "";
    this.maxsize = data.maxsize;                // [number, number]
  }

  /**
   * returns a new style object with the same properties as "this".  properties
   * from "extension" will be copied to the new style object.
   */
  extend(extension) {
    const data = {
      level: this.level,
      color: this.color,
      font: this.font,
      fontfamily: this.fontfamily,
      fontsize: this.fontsize,
      fontweight: this.fontweight,
      fontshape: this.fontshape,
      maxsize: this.maxsize
    };

    for (const key in extension) {
      if (object.prototype.hasownproperty.call(extension, key)) {
        data[key] = extension[key];
      }
    }

    return new style(data);
  }

  withlevel(n) {
    return this.extend({
      level: n
    });
  }

  incrementlevel() {
    return this.extend({
      level: math.min(this.level + 1, 3)
    });
  }

  insuborsup() {
    return this.extend({
      level: suborsuplevel[this.level]
    })
  }

  /**
   * create a new style object with the given color.
   */
  withcolor(color) {
    return this.extend({
      color: color
    });
  }

  /**
   * creates a new style object with the given math font or old text font.
   * @type {[type]}
   */
  withfont(font) {
    return this.extend({
      font
    });
  }

  /**
   * create a new style objects with the given fontfamily.
   */
  withtextfontfamily(fontfamily) {
    return this.extend({
      fontfamily,
      font: ""
    });
  }

  /**
   * creates a new style object with the given font size
   */
  withfontsize(num) {
    return this.extend({
      fontsize: num
    });
  }

  /**
   * creates a new style object with the given font weight
   */
  withtextfontweight(fontweight) {
    return this.extend({
      fontweight,
      font: ""
    });
  }

  /**
   * creates a new style object with the given font weight
   */
  withtextfontshape(fontshape) {
    return this.extend({
      fontshape,
      font: ""
    });
  }

  /**
   * gets the css color of the current style object
   */
  getcolor() {
    return this.color;
  }
}

/* temml post process
 * populate the text contents of each \ref & \eqref
 *
 * as with other temml code, this file is released under terms of the mit license.
 * https://mit-license.org/
 */

const version = "0.10.34";

function postprocess(block) {
  const labelmap = {};
  let i = 0;

  // get a collection of the parents of each \tag & auto-numbered equation
  const amseqns = document.getelementsbyclassname('tml-eqn');
  for (let parent of amseqns) {
    // ams automatically numbered equation.
    // assign an id.
    i += 1;
    parent.setattribute("id", "tml-eqn-" + string(i));
    // no need to write a number into the text content of the element.
    // a css counter has done that even if this postprocess() function is not used.

    // find any \label that refers to an ams automatic eqn number.
    while (true) {
      if (parent.tagname === "mtable") { break }
      const labels = parent.getelementsbyclassname("tml-label");
      if (labels.length > 0) {
        const id = parent.attributes.id.value;
        labelmap[id] = string(i);
        break
      } else {
        parent = parent.parentelement;
      }
    }
  }

  // find \labels associated with \tag
  const taggedeqns = document.getelementsbyclassname('tml-tageqn');
  for (const parent of taggedeqns) {
    const labels = parent.getelementsbyclassname("tml-label");
    if (labels.length > 0) {
      const tags = parent.getelementsbyclassname("tml-tag");
      if (tags.length > 0) {
        const id = parent.attributes.id.value;
        labelmap[id] = tags[0].textcontent;
      }
    }
  }

  // populate \ref & \eqref text content
  const refs = block.getelementsbyclassname("tml-ref");
  [...refs].foreach(ref => {
    const attr = ref.getattribute("href");
    let str = labelmap[attr.slice(1)];
    if (ref.classname.indexof("tml-eqref") === -1) {
      // \ref. omit parens.
      str = str.replace(/^\(/, "");
      str = str.replace(/\)$/, "");
    } else {
      // \eqref. include parens
      if (str.charat(0) !== "(") { str = "(" + str; }
      if (str.slice(-1) !== ")") { str =  str + ")"; }
    }
    const mtext = document.createelementns("http://www.w3.org/1998/math/mathml", "mtext");
    mtext.appendchild(document.createtextnode(str));
    const math =  document.createelementns("http://www.w3.org/1998/math/mathml", "math");
    math.appendchild(mtext);
    ref.appendchild(math);
  });
}

/* eslint no-console:0 */
/**
 * this is the main entry point for temml. here, we expose functions for
 * rendering expressions either to dom nodes or to markup strings.
 *
 * we also expose the parseerror class to check if errors thrown from temml are
 * errors in the expression, or errors in javascript handling.
 */


/**
 * @type {import('./temml').render}
 * parse and build an expression, and place that expression in the dom node
 * given.
 */
let render = function(expression, basenode, options = {}) {
  basenode.textcontent = "";
  const alreadyinmathelement = basenode.tagname.tolowercase() === "math";
  if (alreadyinmathelement) { options.wrap = "none"; }
  const math = rendertomathmltree(expression, options);
  if (alreadyinmathelement) {
    // the <math> element already exists. populate it.
    basenode.textcontent = "";
    math.children.foreach(e => { basenode.appendchild(e.tonode()); });
  } else if (math.children.length > 1) {
    basenode.textcontent = "";
    math.children.foreach(e => { basenode.appendchild(e.tonode()); });
  } else {
    basenode.appendchild(math.tonode());
  }
};

// temml's styles don't work properly in quirks mode. print out an error, and
// disable rendering.
if (typeof document !== "undefined") {
  if (document.compatmode !== "css1compat") {
    typeof console !== "undefined" &&
      console.warn(
        "warning: temml doesn't work in quirks mode. make sure your " +
          "website has a suitable doctype."
      );

    render = function() {
      throw new parseerror("temml doesn't work in quirks mode.");
    };
  }
}

/**
 * @type {import('./temml').rendertostring}
 * parse and build an expression, and return the markup for that.
 */
const rendertostring = function(expression, options) {
  const markup = rendertomathmltree(expression, options).tomarkup();
  return markup;
};

/**
 * @type {import('./temml').generateparsetree}
 * parse an expression and return the parse tree.
 */
const generateparsetree = function(expression, options) {
  const settings = new settings(options);
  return parsetree(expression, settings);
};

/**
 * @type {import('./temml').definepreamble}
 * take an expression which contains a preamble.
 * parse it and return the macros.
 */
const definepreamble = function(expression, options) {
  const settings = new settings(options);
  settings.macros = {};
  if (!(typeof expression === "string" || expression instanceof string)) {
    throw new typeerror("temml can only parse string typed expression")
  }
  const parser = new parser(expression, settings, true);
  // blank out any \df@tag to avoid spurious "duplicate \tag" errors
  delete parser.gullet.macros.current["\\df@tag"];
  const macros = parser.parse();
  return macros
};

/**
 * if the given error is a temml parseerror,
 * renders the invalid latex as a span with hover title giving the temml
 * error message.  otherwise, simply throws the error.
 */
const rendererror = function(error, expression, options) {
  if (options.throwonerror || !(error instanceof parseerror)) {
    throw error;
  }
  const node = new span(["temml-error"], [new textnode$1(expression + "\n" + error.tostring())]);
  node.style.color = options.errorcolor;
  node.style.whitespace = "pre-line";
  return node;
};

/**
 * @type {import('./temml').rendertomathmltree}
 * generates and returns the temml build tree. this is used for advanced
 * use cases (like rendering to custom output).
 */
const rendertomathmltree = function(expression, options) {
  const settings = new settings(options);
  try {
    const tree = parsetree(expression, settings);
    const style = new style({
      level: settings.displaymode ? stylelevel.display : stylelevel.text,
      maxsize: settings.maxsize
    });
    return buildmathml(tree, expression, style, settings);
  } catch (error) {
    return rendererror(error, expression, settings);
  }
};

/** @type {import('./temml').default} */
var temml = {
  /**
   * current temml version
   */
  version: version,
  /**
   * renders the given latex into mathml, and adds
   * it as a child to the specified dom node.
   */
  render,
  /**
   * renders the given latex into mathml string,
   * for sending to the client.
   */
  rendertostring,
  /**
   * post-process an entire html block.
   * writes ams auto-numbers and implements \ref{}.
   * typcally called once, after a loop has rendered many individual spans.
   */
  postprocess,
  /**
   * temml error, usually during parsing.
   */
  parseerror,
  /**
   * creates a set of macros with document-wide scope.
   */
  definepreamble,
  /**
   * parses the given latex into temml's internal parse tree structure,
   * without rendering to html or mathml.
   *
   * note: this method is not currently recommended for public use.
   * the internal tree representation is unstable and is very likely
   * to change. use at your own risk.
   */
  __parse: generateparsetree,
  /**
   * renders the given latex into a mathml internal dom tree
   * representation, without flattening that representation to a string.
   *
   * note: this method is not currently recommended for public use.
   * the internal tree representation is unstable and is very likely
   * to change. use at your own risk.
   */
  __rendertomathmltree: rendertomathmltree,
  /**
   * adds a new symbol to builtin symbols table
   */
  __definesymbol: definesymbol,
  /**
   * adds a new macro to builtin macro list
   */
  __definemacro: definemacro
};



;// ./node_modules/@wordpress/latex-to-mathml/build-module/index.js

function latextomathml(latex, { displaymode = true } = {}) {
  const mathml = temml.rendertostring(latex, {
    displaymode,
    annotate: true,
    throwonerror: true
  });
  const doc = document.implementation.createhtmldocument("");
  doc.body.innerhtml = mathml;
  return doc.body.queryselector("math")?.innerhtml ?? "";
}


(window.wp = window.wp || {}).latextomathml = __webpack_exports__;
/******/ })()
;






