/******/ // the require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				object.defineproperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasownproperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (object.prototype.hasownproperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// exports
__webpack_require__.d(__webpack_exports__, {
  m: () => (/* binding */ setup),
  l: () => (/* reexport */ speak)
});

;// ./node_modules/@wordpress/a11y/build-module/shared/clear.js
function clear() {
  const regions = document.getelementsbyclassname("a11y-speak-region");
  const introtext = document.getelementbyid("a11y-speak-intro-text");
  for (let i = 0; i < regions.length; i++) {
    regions[i].textcontent = "";
  }
  if (introtext) {
    introtext.setattribute("hidden", "hidden");
  }
}


;// ./node_modules/@wordpress/a11y/build-module/shared/filter-message.js
let previousmessage = "";
function filtermessage(message) {
  message = message.replace(/<[^<>]+>/g, " ");
  if (previousmessage === message) {
    message += "\xa0";
  }
  previousmessage = message;
  return message;
}


;// ./node_modules/@wordpress/a11y/build-module/shared/index.js


function speak(message, arialive) {
  clear();
  message = filtermessage(message);
  const introtext = document.getelementbyid("a11y-speak-intro-text");
  const containerassertive = document.getelementbyid(
    "a11y-speak-assertive"
  );
  const containerpolite = document.getelementbyid("a11y-speak-polite");
  if (containerassertive && arialive === "assertive") {
    containerassertive.textcontent = message;
  } else if (containerpolite) {
    containerpolite.textcontent = message;
  }
  if (introtext) {
    introtext.removeattribute("hidden");
  }
}


;// ./node_modules/@wordpress/a11y/build-module/module/index.js

const setup = () => {
};


var __webpack_exports__setup = __webpack_exports__.m;
var __webpack_exports__speak = __webpack_exports__.l;
export { __webpack_exports__setup as setup, __webpack_exports__speak as speak };





