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
/************************************************************************/
var __webpack_exports__ = {};

// exports
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ index_default)
});

// unused exports: attrs, frommatch, next, regexp, replace, string

;// ./node_modules/memize/dist/index.js
/**
 * memize options object.
 *
 * @typedef memizeoptions
 *
 * @property {number} [maxsize] maximum size of the cache.
 */

/**
 * internal cache entry.
 *
 * @typedef memizecachenode
 *
 * @property {?memizecachenode|undefined} [prev] previous node.
 * @property {?memizecachenode|undefined} [next] next node.
 * @property {array<*>}                   args   function arguments for cache
 *                                               entry.
 * @property {*}                          val    function result.
 */

/**
 * properties of the enhanced function for controlling cache.
 *
 * @typedef memizememoizedfunction
 *
 * @property {()=>void} clear clear the cache.
 */

/**
 * accepts a function to be memoized, and returns a new memoized function, with
 * optional options.
 *
 * @template {(...args: any[]) => any} f
 *
 * @param {f}             fn        function to memoize.
 * @param {memizeoptions} [options] options object.
 *
 * @return {((...args: parameters<f>) => returntype<f>) & memizememoizedfunction} memoized function.
 */
function memize(fn, options) {
	var size = 0;

	/** @type {?memizecachenode|undefined} */
	var head;

	/** @type {?memizecachenode|undefined} */
	var tail;

	options = options || {};

	function memoized(/* ...args */) {
		var node = head,
			len = arguments.length,
			args,
			i;

		searchcache: while (node) {
			// perform a shallow equality test to confirm that whether the node
			// under test is a candidate for the arguments passed. two arrays
			// are shallowly equal if their length matches and each entry is
			// strictly equal between the two sets. avoid abstracting to a
			// function which could incur an arguments leaking deoptimization.

			// check whether node arguments match arguments length
			if (node.args.length !== arguments.length) {
				node = node.next;
				continue;
			}

			// check whether node arguments match arguments values
			for (i = 0; i < len; i++) {
				if (node.args[i] !== arguments[i]) {
					node = node.next;
					continue searchcache;
				}
			}

			// at this point we can assume we've found a match

			// surface matched node to head if not already
			if (node !== head) {
				// as tail, shift to previous. must only shift if not also
				// head, since if both head and tail, there is no previous.
				if (node === tail) {
					tail = node.prev;
				}

				// adjust siblings to point to each other. if node was tail,
				// this also handles new tail's empty `next` assignment.
				/** @type {memizecachenode} */ (node.prev).next = node.next;
				if (node.next) {
					node.next.prev = node.prev;
				}

				node.next = head;
				node.prev = null;
				/** @type {memizecachenode} */ (head).prev = node;
				head = node;
			}

			// return immediately
			return node.val;
		}

		// no cached value found. continue to insertion phase:

		// create a copy of arguments (avoid leaking deoptimization)
		args = new array(len);
		for (i = 0; i < len; i++) {
			args[i] = arguments[i];
		}

		node = {
			args: args,

			// generate the result from original function
			val: fn.apply(null, args),
		};

		// don't need to check whether node is already head, since it would
		// have been returned above already if it was

		// shift existing head down list
		if (head) {
			head.prev = node;
			node.next = head;
		} else {
			// if no head, follows that there's no tail (at initial or reset)
			tail = node;
		}

		// trim tail if we're reached max size and are pending cache insertion
		if (size === /** @type {memizeoptions} */ (options).maxsize) {
			tail = /** @type {memizecachenode} */ (tail).prev;
			/** @type {memizecachenode} */ (tail).next = null;
		} else {
			size++;
		}

		head = node;

		return node.val;
	}

	memoized.clear = function () {
		head = null;
		tail = null;
		size = 0;
	};

	// ignore reason: there's not a clear solution to create an intersection of
	// the function with additional properties, where the goal is to retain the
	// function signature of the incoming argument and add control properties
	// on the return value.

	// @ts-ignore
	return memoized;
}



;// ./node_modules/@wordpress/shortcode/build-module/index.js


function next(tag, text, index = 0) {
  const re = regexp(tag);
  re.lastindex = index;
  const match = re.exec(text);
  if (!match) {
    return;
  }
  if ("[" === match[1] && "]" === match[7]) {
    return next(tag, text, re.lastindex);
  }
  const result = {
    index: match.index,
    content: match[0],
    shortcode: frommatch(match)
  };
  if (match[1]) {
    result.content = result.content.slice(1);
    result.index++;
  }
  if (match[7]) {
    result.content = result.content.slice(0, -1);
  }
  return result;
}
function replace(tag, text, callback) {
  return text.replace(
    regexp(tag),
    function(match, left, $3, attrs2, slash, content, closing, right) {
      if (left === "[" && right === "]") {
        return match;
      }
      const result = callback(frommatch(arguments));
      return result || result === "" ? left + result + right : match;
    }
  );
}
function string(options) {
  return new shortcode(options).string();
}
function regexp(tag) {
  return new regexp(
    "\\[(\\[?)(" + tag + ")(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)",
    "g"
  );
}
const attrs = memize((text) => {
  const named = {};
  const numeric = [];
  const pattern = /([\w-]+)\s*=\s*"([^"]*)"(?:\s|$)|([\w-]+)\s*=\s*'([^']*)'(?:\s|$)|([\w-]+)\s*=\s*([^\s'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|'([^']*)'(?:\s|$)|(\s+)(?:\s|$)/g;
  text = text.replace(/[\u00a0\u200b]/g, " ");
  let match;
  while (match = pattern.exec(text)) {
    if (match[1]) {
      named[match[1].tolowercase()] = match[2];
    } else if (match[3]) {
      named[match[3].tolowercase()] = match[4];
    } else if (match[5]) {
      named[match[5].tolowercase()] = match[6];
    } else if (match[7]) {
      numeric.push(match[7]);
    } else if (match[8]) {
      numeric.push(match[8]);
    } else if (match[9]) {
      numeric.push(match[9]);
    }
  }
  return { named, numeric };
});
function frommatch(match) {
  let type;
  if (match[4]) {
    type = "self-closing";
  } else if (match[6]) {
    type = "closed";
  } else {
    type = "single";
  }
  return new shortcode({
    tag: match[2],
    attrs: match[3],
    type,
    content: match[5]
  });
}
const shortcode = object.assign(
  function(options) {
    const { tag, attrs: attributes, type, content } = options || {};
    object.assign(this, { tag, type, content });
    this.attrs = {
      named: {},
      numeric: []
    };
    if (!attributes) {
      return;
    }
    const attributetypes = ["named", "numeric"];
    if (typeof attributes === "string") {
      this.attrs = attrs(attributes);
    } else if (attributes.length === attributetypes.length && attributetypes.every((t, key) => t === attributes[key])) {
      this.attrs = attributes;
    } else {
      object.entries(attributes).foreach(([key, value]) => {
        this.set(key, value);
      });
    }
  },
  {
    next,
    replace,
    string,
    regexp,
    attrs,
    frommatch
  }
);
object.assign(shortcode.prototype, {
  /**
   * get a shortcode attribute.
   *
   * automatically detects whether `attr` is named or numeric and routes it
   * accordingly.
   *
   * @param {(number|string)} attr attribute key.
   *
   * @return {string} attribute value.
   */
  get(attr) {
    return this.attrs[typeof attr === "number" ? "numeric" : "named"][attr];
  },
  /**
   * set a shortcode attribute.
   *
   * automatically detects whether `attr` is named or numeric and routes it
   * accordingly.
   *
   * @param {(number|string)} attr  attribute key.
   * @param {string}          value attribute value.
   *
   * @return {instancetype< import('./types').shortcode >} shortcode instance.
   */
  set(attr, value) {
    this.attrs[typeof attr === "number" ? "numeric" : "named"][attr] = value;
    return this;
  },
  /**
   * transform the shortcode into a string.
   *
   * @return {string} string representation of the shortcode.
   */
  string() {
    let text = "[" + this.tag;
    this.attrs.numeric.foreach((value) => {
      if (/\s/.test(value)) {
        text += ' "' + value + '"';
      } else {
        text += " " + value;
      }
    });
    object.entries(this.attrs.named).foreach(([name, value]) => {
      text += " " + name + '="' + value + '"';
    });
    if ("single" === this.type) {
      return text + "]";
    } else if ("self-closing" === this.type) {
      return text + " /]";
    }
    text += "]";
    if (this.content) {
      text += this.content;
    }
    return text + "[/" + this.tag + "]";
  }
});
var index_default = shortcode;


(window.wp = window.wp || {}).shortcode = __webpack_exports__["default"];
/******/ })()
;




