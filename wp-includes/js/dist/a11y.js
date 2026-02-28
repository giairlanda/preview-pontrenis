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
  setup: () => (/* binding */ setup),
  speak: () => (/* reexport */ speak)
});

;// external ["wp","domready"]
const external_wp_domready_namespaceobject = window["wp"]["domready"];
var external_wp_domready_default = /*#__pure__*/__webpack_require__.n(external_wp_domready_namespaceobject);
;// ./node_modules/@wordpress/a11y/build-module/script/add-container.js
function addcontainer(arialive = "polite") {
  const container = document.createelement("div");
  container.id = `a11y-speak-${arialive}`;
  container.classname = "a11y-speak-region";
  container.setattribute(
    "style",
    "position:absolute;margin:-1px;padding:0;height:1px;width:1px;overflow:hidden;clip-path:inset(50%);border:0;word-wrap:normal !important;"
  );
  container.setattribute("aria-live", arialive);
  container.setattribute("aria-relevant", "additions text");
  container.setattribute("aria-atomic", "true");
  const { body } = document;
  if (body) {
    body.appendchild(container);
  }
  return container;
}


;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// ./node_modules/@wordpress/a11y/build-module/script/add-intro-text.js

function addintrotext() {
  const introtext = document.createelement("p");
  introtext.id = "a11y-speak-intro-text";
  introtext.classname = "a11y-speak-intro-text";
  introtext.textcontent = (0,external_wp_i18n_namespaceobject.__)("notifications");
  introtext.setattribute(
    "style",
    "position:absolute;margin:-1px;padding:0;height:1px;width:1px;overflow:hidden;clip-path:inset(50%);border:0;word-wrap:normal !important;"
  );
  introtext.setattribute("hidden", "");
  const { body } = document;
  if (body) {
    body.appendchild(introtext);
  }
  return introtext;
}


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


;// ./node_modules/@wordpress/a11y/build-module/index.js




function setup() {
  const introtext = document.getelementbyid("a11y-speak-intro-text");
  const containerassertive = document.getelementbyid(
    "a11y-speak-assertive"
  );
  const containerpolite = document.getelementbyid("a11y-speak-polite");
  if (introtext === null) {
    addintrotext();
  }
  if (containerassertive === null) {
    addcontainer("assertive");
  }
  if (containerpolite === null) {
    addcontainer("polite");
  }
}
external_wp_domready_default()(setup);


(window.wp = window.wp || {}).a11y = __webpack_exports__;
/******/ })()
;







