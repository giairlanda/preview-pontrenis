/******/ (() => { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 677:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ striptags)
/* harmony export */ });
function striptags(settings, text) {
  return text.replace(settings.htmlregexp, "\n");
}



/***/ }),

/***/ 2125:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ transposeastralstocountablechar)
/* harmony export */ });
function transposeastralstocountablechar(settings, text) {
  return text.replace(settings.astralregexp, "a");
}



/***/ }),

/***/ 3608:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ stripconnectors)
/* harmony export */ });
function stripconnectors(settings, text) {
  return text.replace(settings.connectorregexp, " ");
}



/***/ }),

/***/ 4516:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ stripshortcodes)
/* harmony export */ });
function stripshortcodes(settings, text) {
  if (settings.shortcodesregexp) {
    return text.replace(settings.shortcodesregexp, "\n");
  }
  return text;
}



/***/ }),

/***/ 4579:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ striphtmlcomments)
/* harmony export */ });
function striphtmlcomments(settings, text) {
  return text.replace(settings.htmlcommentregexp, "");
}



/***/ }),

/***/ 4846:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ striphtmlentities)
/* harmony export */ });
function striphtmlentities(settings, text) {
  return text.replace(settings.htmlentityregexp, "");
}



/***/ }),

/***/ 6019:
/***/ (() => {



/***/ }),

/***/ 6542:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ stripremovables)
/* harmony export */ });
function stripremovables(settings, text) {
  return text.replace(settings.removeregexp, "");
}



/***/ }),

/***/ 7742:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ defaultsettings)
/* harmony export */ });
const defaultsettings = {
  htmlregexp: /<\/?[a-z][^>]*?>/gi,
  htmlcommentregexp: /<!--[\s\s]*?-->/g,
  spaceregexp: /&nbsp;|&#160;/gi,
  htmlentityregexp: /&\s+?;/g,
  // \u2014 = em-dash.
  connectorregexp: /--|\u2014/g,
  // characters to be removed from input text.
  removeregexp: new regexp(
    [
      "[",
      // basic latin (extract)
      "!-/:-@[-`{-~",
      // latin-1 supplement (extract)
      "\x80-\xbf\xd7\xf7",
      /*
       * the following range consists of:
       * general punctuation
       * superscripts and subscripts
       * currency symbols
       * combining diacritical marks for symbols
       * letterlike symbols
       * number forms
       * arrows
       * mathematical operators
       * miscellaneous technical
       * control pictures
       * optical character recognition
       * enclosed alphanumerics
       * box drawing
       * block elements
       * geometric shapes
       * miscellaneous symbols
       * dingbats
       * miscellaneous mathematical symbols-a
       * supplemental arrows-a
       * braille patterns
       * supplemental arrows-b
       * miscellaneous mathematical symbols-b
       * supplemental mathematical operators
       * miscellaneous symbols and arrows
       */
      "\u2000-\u2bff",
      // supplemental punctuation.
      "\u2e00-\u2e7f",
      "]"
    ].join(""),
    "g"
  ),
  // remove utf-16 surrogate points, see https://en.wikipedia.org/wiki/utf-16#u.2bd800_to_u.2bdfff
  astralregexp: /[\ud800-\udbff][\udc00-\udfff]/g,
  wordsregexp: /\s\s+/g,
  characters_excluding_spacesregexp: /\s/g,
  /*
   * match anything that is not a formatting character, excluding:
   * \f = form feed
   * \n = new line
   * \r = carriage return
   * \t = tab
   * \v = vertical tab
   * \u00ad = soft hyphen
   * \u2028 = line separator
   * \u2029 = paragraph separator
   */
  characters_including_spacesregexp: /[^\f\n\r\t\v\u00ad\u2028\u2029]/g,
  l10n: {
    type: "words"
  }
};



/***/ }),

/***/ 8026:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ transposehtmlentitiestocountablechars)
/* harmony export */ });
function transposehtmlentitiestocountablechars(settings, text) {
  return text.replace(settings.htmlentityregexp, "a");
}



/***/ }),

/***/ 8511:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ stripspaces)
/* harmony export */ });
function stripspaces(settings, text) {
  return text.replace(settings.spaceregexp, " ");
}



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
// this entry needs to be wrapped in an iife because it needs to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   count: () => (/* binding */ count)
/* harmony export */ });
/* harmony import */ var _defaultsettings__webpack_imported_module_0__ = __webpack_require__(7742);
/* harmony import */ var _striptags__webpack_imported_module_1__ = __webpack_require__(677);
/* harmony import */ var _transposeastralstocountablechar__webpack_imported_module_8__ = __webpack_require__(2125);
/* harmony import */ var _striphtmlentities__webpack_imported_module_5__ = __webpack_require__(4846);
/* harmony import */ var _stripconnectors__webpack_imported_module_6__ = __webpack_require__(3608);
/* harmony import */ var _stripremovables__webpack_imported_module_7__ = __webpack_require__(6542);
/* harmony import */ var _striphtmlcomments__webpack_imported_module_2__ = __webpack_require__(4579);
/* harmony import */ var _stripshortcodes__webpack_imported_module_3__ = __webpack_require__(4516);
/* harmony import */ var _stripspaces__webpack_imported_module_4__ = __webpack_require__(8511);
/* harmony import */ var _transposehtmlentitiestocountablechars__webpack_imported_module_9__ = __webpack_require__(8026);
/* harmony import */ var _types__webpack_imported_module_10__ = __webpack_require__(6019);
/* harmony import */ var _types__webpack_imported_module_10___default = /*#__pure__*/__webpack_require__.n(_types__webpack_imported_module_10__);
/* harmony reexport (unknown) */ var __webpack_reexport_object__ = {};
/* harmony reexport (unknown) */ for(const __webpack_import_key__ in _types__webpack_imported_module_10__) if(["default","count"].indexof(__webpack_import_key__) < 0) __webpack_reexport_object__[__webpack_import_key__] = () => _types__webpack_imported_module_10__[__webpack_import_key__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __webpack_reexport_object__);










function loadsettings(type = "words", usersettings = {}) {
  const mergedsettings = { ..._defaultsettings__webpack_imported_module_0__/* .defaultsettings */ .l, ...usersettings };
  const settings = {
    ...mergedsettings,
    type,
    shortcodes: []
  };
  settings.shortcodes = settings.l10n?.shortcodes ?? [];
  if (settings.shortcodes && settings.shortcodes.length) {
    settings.shortcodesregexp = new regexp(
      "\\[\\/?(?:" + settings.shortcodes.join("|") + ")[^\\]]*?\\]",
      "g"
    );
  }
  if (settings.type !== "characters_excluding_spaces" && settings.type !== "characters_including_spaces") {
    settings.type = "words";
  }
  return settings;
}
function countwords(text, regex, settings) {
  text = [
    _striptags__webpack_imported_module_1__/* ["default"] */ .a.bind(null, settings),
    _striphtmlcomments__webpack_imported_module_2__/* ["default"] */ .a.bind(null, settings),
    _stripshortcodes__webpack_imported_module_3__/* ["default"] */ .a.bind(null, settings),
    _stripspaces__webpack_imported_module_4__/* ["default"] */ .a.bind(null, settings),
    _striphtmlentities__webpack_imported_module_5__/* ["default"] */ .a.bind(null, settings),
    _stripconnectors__webpack_imported_module_6__/* ["default"] */ .a.bind(null, settings),
    _stripremovables__webpack_imported_module_7__/* ["default"] */ .a.bind(null, settings)
  ].reduce((result, fn) => fn(result), text);
  text = text + "\n";
  return text.match(regex)?.length ?? 0;
}
function countcharacters(text, regex, settings) {
  text = [
    _striptags__webpack_imported_module_1__/* ["default"] */ .a.bind(null, settings),
    _striphtmlcomments__webpack_imported_module_2__/* ["default"] */ .a.bind(null, settings),
    _stripshortcodes__webpack_imported_module_3__/* ["default"] */ .a.bind(null, settings),
    _transposeastralstocountablechar__webpack_imported_module_8__/* ["default"] */ .a.bind(null, settings),
    _stripspaces__webpack_imported_module_4__/* ["default"] */ .a.bind(null, settings),
    _transposehtmlentitiestocountablechars__webpack_imported_module_9__/* ["default"] */ .a.bind(null, settings)
  ].reduce((result, fn) => fn(result), text);
  text = text + "\n";
  return text.match(regex)?.length ?? 0;
}
function count(text, type, usersettings) {
  const settings = loadsettings(type, usersettings);
  let matchregexp;
  switch (settings.type) {
    case "words":
      matchregexp = settings.wordsregexp;
      return countwords(text, matchregexp, settings);
    case "characters_including_spaces":
      matchregexp = settings.characters_including_spacesregexp;
      return countcharacters(text, matchregexp, settings);
    case "characters_excluding_spaces":
      matchregexp = settings.characters_excluding_spacesregexp;
      return countcharacters(text, matchregexp, settings);
    default:
      return 0;
  }
}



})();

(window.wp = window.wp || {}).wordcount = __webpack_exports__;
/******/ })()
;



