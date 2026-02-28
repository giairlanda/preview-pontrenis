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
  alt: () => (/* binding */ alt),
  backspace: () => (/* binding */ backspace),
  command: () => (/* binding */ command),
  ctrl: () => (/* binding */ ctrl),
  delete: () => (/* binding */ delete),
  down: () => (/* binding */ down),
  end: () => (/* binding */ end),
  enter: () => (/* binding */ enter),
  escape: () => (/* binding */ escape),
  f10: () => (/* binding */ f10),
  home: () => (/* binding */ home),
  left: () => (/* binding */ left),
  pagedown: () => (/* binding */ pagedown),
  pageup: () => (/* binding */ pageup),
  right: () => (/* binding */ right),
  shift: () => (/* binding */ shift),
  space: () => (/* binding */ space),
  tab: () => (/* binding */ tab),
  up: () => (/* binding */ up),
  zero: () => (/* binding */ zero),
  displayshortcut: () => (/* binding */ displayshortcut),
  displayshortcutlist: () => (/* binding */ displayshortcutlist),
  isappleos: () => (/* reexport */ isappleos),
  iskeyboardevent: () => (/* binding */ iskeyboardevent),
  modifiers: () => (/* binding */ modifiers),
  rawshortcut: () => (/* binding */ rawshortcut),
  shortcutarialabel: () => (/* binding */ shortcutarialabel)
});

;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// ./node_modules/@wordpress/keycodes/build-module/platform.js
function isappleos(_window) {
  if (!_window) {
    if (typeof window === "undefined") {
      return false;
    }
    _window = window;
  }
  const { platform } = _window.navigator;
  return platform.indexof("mac") !== -1 || ["ipad", "iphone"].includes(platform);
}


;// ./node_modules/@wordpress/keycodes/build-module/index.js


const backspace = 8;
const tab = 9;
const enter = 13;
const escape = 27;
const space = 32;
const pageup = 33;
const pagedown = 34;
const end = 35;
const home = 36;
const left = 37;
const up = 38;
const right = 39;
const down = 40;
const delete = 46;
const f10 = 121;
const alt = "alt";
const ctrl = "ctrl";
const command = "meta";
const shift = "shift";
const zero = 48;
function capitalisefirstcharacter(string) {
  return string.length < 2 ? string.touppercase() : string.charat(0).touppercase() + string.slice(1);
}
function mapvalues(object, mapfn) {
  return object.fromentries(
    object.entries(object).map(([key, value]) => [
      key,
      mapfn(value)
    ])
  );
}
const modifiers = {
  primary: (_isapple) => _isapple() ? [command] : [ctrl],
  primaryshift: (_isapple) => _isapple() ? [shift, command] : [ctrl, shift],
  primaryalt: (_isapple) => _isapple() ? [alt, command] : [ctrl, alt],
  secondary: (_isapple) => _isapple() ? [shift, alt, command] : [ctrl, shift, alt],
  access: (_isapple) => _isapple() ? [ctrl, alt] : [shift, alt],
  ctrl: () => [ctrl],
  alt: () => [alt],
  ctrlshift: () => [ctrl, shift],
  shift: () => [shift],
  shiftalt: () => [shift, alt],
  undefined: () => []
};
const rawshortcut = /* @__pure__ */ mapvalues(modifiers, (modifier) => {
  return (character, _isapple = isappleos) => {
    return [...modifier(_isapple), character.tolowercase()].join(
      "+"
    );
  };
});
const displayshortcutlist = /* @__pure__ */ mapvalues(
  modifiers,
  (modifier) => {
    return (character, _isapple = isappleos) => {
      const isapple = _isapple();
      const replacementkeymap = {
        [alt]: isapple ? "\u2325" : "alt",
        [ctrl]: isapple ? "\u2303" : "ctrl",
        // make sure ✃ is the u+2303 up arrowhead unicode character and not the caret character.
        [command]: "\u2318",
        [shift]: isapple ? "\u21e7" : "shift"
      };
      const modifierkeys = modifier(_isapple).reduce(
        (accumulator, key) => {
          const replacementkey = replacementkeymap[key] ?? key;
          if (isapple) {
            return [...accumulator, replacementkey];
          }
          return [...accumulator, replacementkey, "+"];
        },
        []
      );
      return [
        ...modifierkeys,
        capitalisefirstcharacter(character)
      ];
    };
  }
);
const displayshortcut = /* @__pure__ */ mapvalues(
  displayshortcutlist,
  (shortcutlist) => {
    return (character, _isapple = isappleos) => shortcutlist(character, _isapple).join("");
  }
);
const shortcutarialabel = /* @__pure__ */ mapvalues(modifiers, (modifier) => {
  return (character, _isapple = isappleos) => {
    const isapple = _isapple();
    const replacementkeymap = {
      [shift]: "shift",
      [command]: isapple ? "command" : "control",
      [ctrl]: "control",
      [alt]: isapple ? "option" : "alt",
      /* translators: comma as in the character ',' */
      ",": (0,external_wp_i18n_namespaceobject.__)("comma"),
      /* translators: period as in the character '.' */
      ".": (0,external_wp_i18n_namespaceobject.__)("period"),
      /* translators: backtick as in the character '`' */
      "`": (0,external_wp_i18n_namespaceobject.__)("backtick"),
      /* translators: tilde as in the character '~' */
      "~": (0,external_wp_i18n_namespaceobject.__)("tilde")
    };
    return [...modifier(_isapple), character].map(
      (key) => capitalisefirstcharacter(replacementkeymap[key] ?? key)
    ).join(isapple ? " " : " + ");
  };
});
function geteventmodifiers(event) {
  return [alt, ctrl, command, shift].filter(
    (key) => event[`${key}key`]
  );
}
const iskeyboardevent = /* @__pure__ */ mapvalues(modifiers, (getmodifiers) => {
  return (event, character, _isapple = isappleos) => {
    const mods = getmodifiers(_isapple);
    const eventmods = geteventmodifiers(event);
    const replacementwithshiftkeymap = {
      comma: ",",
      backslash: "\\",
      // windows returns `\` for both intlro and intlyen.
      intlro: "\\",
      intlyen: "\\"
    };
    const modsdiff = mods.filter(
      (mod) => !eventmods.includes(mod)
    );
    const eventmodsdiff = eventmods.filter(
      (mod) => !mods.includes(mod)
    );
    if (modsdiff.length > 0 || eventmodsdiff.length > 0) {
      return false;
    }
    let key = event.key.tolowercase();
    if (!character) {
      return mods.includes(key);
    }
    if (event.altkey && character.length === 1) {
      key = string.fromcharcode(event.keycode).tolowercase();
    }
    if (event.shiftkey && character.length === 1 && replacementwithshiftkeymap[event.code]) {
      key = replacementwithshiftkeymap[event.code];
    }
    if (character === "del") {
      character = "delete";
    }
    return key === character.tolowercase();
  };
});


(window.wp = window.wp || {}).keycodes = __webpack_exports__;
/******/ })()
;







