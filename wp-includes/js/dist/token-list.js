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
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ tokenlist)
/* harmony export */ });
class tokenlist {
  _currentvalue;
  _valueasarray;
  /**
   * constructs a new instance of tokenlist.
   *
   * @param initialvalue initial value to assign.
   */
  constructor(initialvalue = "") {
    this._currentvalue = "";
    this._valueasarray = [];
    this.value = initialvalue;
  }
  entries(...args) {
    return this._valueasarray.entries(...args);
  }
  foreach(...args) {
    return this._valueasarray.foreach(...args);
  }
  keys(...args) {
    return this._valueasarray.keys(...args);
  }
  values(...args) {
    return this._valueasarray.values(...args);
  }
  /**
   * returns the associated set as string.
   *
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-value
   *
   * @return token set as string.
   */
  get value() {
    return this._currentvalue;
  }
  /**
   * replaces the associated set with a new string value.
   *
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-value
   *
   * @param value new token set as string.
   */
  set value(value) {
    value = string(value);
    this._valueasarray = [
      ...new set(value.split(/\s+/g).filter(boolean))
    ];
    this._currentvalue = this._valueasarray.join(" ");
  }
  /**
   * returns the number of tokens.
   *
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-length
   *
   * @return number of tokens.
   */
  get length() {
    return this._valueasarray.length;
  }
  /**
   * returns the stringified form of the tokenlist.
   *
   * @see https://dom.spec.whatwg.org/#domtokenlist-stringification-behavior
   * @see https://www.ecma-international.org/ecma-262/9.0/index.html#sec-tostring
   *
   * @return token set as string.
   */
  tostring() {
    return this.value;
  }
  /**
   * returns an iterator for the tokenlist, iterating items of the set.
   *
   * @see https://dom.spec.whatwg.org/#domtokenlist
   *
   * @return tokenlist iterator.
   */
  *[symbol.iterator]() {
    return yield* this._valueasarray;
  }
  /**
   * returns the token with index `index`.
   *
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-item
   *
   * @param index index at which to return token.
   *
   * @return token at index.
   */
  item(index) {
    return this._valueasarray[index];
  }
  /**
   * returns true if `token` is present, and false otherwise.
   *
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-contains
   *
   * @param item token to test.
   *
   * @return whether token is present.
   */
  contains(item) {
    return this._valueasarray.indexof(item) !== -1;
  }
  /**
   * adds all arguments passed, except those already present.
   *
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-add
   *
   * @param items items to add.
   */
  add(...items) {
    this.value += " " + items.join(" ");
  }
  /**
   * removes arguments passed, if they are present.
   *
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-remove
   *
   * @param items items to remove.
   */
  remove(...items) {
    this.value = this._valueasarray.filter((val) => !items.includes(val)).join(" ");
  }
  /**
   * if `force` is not given, "toggles" `token`, removing it if it’s present
   * and adding it if it’s not present. if `force` is true, adds token (same
   * as add()). if force is false, removes token (same as remove()). returns
   * true if `token` is now present, and false otherwise.
   *
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-toggle
   *
   * @param token   token to toggle.
   * @param [force] presence to force.
   *
   * @return whether token is present after toggle.
   */
  toggle(token, force) {
    if (void 0 === force) {
      force = !this.contains(token);
    }
    if (force) {
      this.add(token);
    } else {
      this.remove(token);
    }
    return force;
  }
  /**
   * replaces `token` with `newtoken`. returns true if `token` was replaced
   * with `newtoken`, and false otherwise.
   *
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-replace
   *
   * @param token    token to replace with `newtoken`.
   * @param newtoken token to use in place of `token`.
   *
   * @return whether replacement occurred.
   */
  replace(token, newtoken) {
    if (!this.contains(token)) {
      return false;
    }
    this.remove(token);
    this.add(newtoken);
    return true;
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /**
   * returns true if `token` is in the associated attribute’s supported
   * tokens. returns false otherwise.
   *
   * always returns `true` in this implementation.
   *
   * @param _token
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-supports
   *
   * @return whether token is supported.
   */
  supports(_token) {
    return true;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}


(window.wp = window.wp || {}).tokenlist = __webpack_exports__["default"];
/******/ })()
;


