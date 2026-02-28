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
  "default": () => (/* binding */ isshallowequal),
  isshallowequalarrays: () => (/* reexport */ isshallowequalarrays),
  isshallowequalobjects: () => (/* reexport */ isshallowequalobjects)
});

;// ./node_modules/@wordpress/is-shallow-equal/build-module/objects.js
function isshallowequalobjects(a, b) {
  if (a === b) {
    return true;
  }
  const akeys = object.keys(a);
  const bkeys = object.keys(b);
  if (akeys.length !== bkeys.length) {
    return false;
  }
  let i = 0;
  while (i < akeys.length) {
    const key = akeys[i];
    const avalue = a[key];
    if (
      // in iterating only the keys of the first object after verifying
      // equal lengths, account for the case that an explicit `undefined`
      // value in the first is implicitly undefined in the second.
      //
      // example: isshallowequalobjects( { a: undefined }, { b: 5 } )
      avalue === void 0 && !b.hasownproperty(key) || avalue !== b[key]
    ) {
      return false;
    }
    i++;
  }
  return true;
}


;// ./node_modules/@wordpress/is-shallow-equal/build-module/arrays.js
function isshallowequalarrays(a, b) {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0, len = a.length; i < len; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}


;// ./node_modules/@wordpress/is-shallow-equal/build-module/index.js




function isshallowequal(a, b) {
  if (a && b) {
    if (a.constructor === object && b.constructor === object) {
      return isshallowequalobjects(a, b);
    } else if (array.isarray(a) && array.isarray(b)) {
      return isshallowequalarrays(a, b);
    }
  }
  return a === b;
}


(window.wp = window.wp || {}).isshallowequal = __webpack_exports__;
/******/ })()
;



