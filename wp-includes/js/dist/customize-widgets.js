/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 7734:
/***/ ((module) => {



// do not edit .js files directly - edit src/index.jst


  var envhasbigint64array = typeof bigint64array !== 'undefined';


module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (array.isarray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }


    if ((a instanceof map) && (b instanceof map)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      for (i of a.entries())
        if (!equal(i[1], b.get(i[0]))) return false;
      return true;
    }

    if ((a instanceof set) && (b instanceof set)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      return true;
    }

    if (arraybuffer.isview(a) && arraybuffer.isview(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (a[i] !== b[i]) return false;
      return true;
    }


    if (a.constructor === regexp) return a.source === b.source && a.flags === b.flags;
    if (a.valueof !== object.prototype.valueof) return a.valueof() === b.valueof();
    if (a.tostring !== object.prototype.tostring) return a.tostring() === b.tostring();

    keys = object.keys(a);
    length = keys.length;
    if (length !== object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!object.prototype.hasownproperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both nan, false otherwise
  return a!==a && b!==b;
};


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
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  initialize: () => (/* binding */ initialize),
  store: () => (/* reexport */ store)
});

// namespace object: ./node_modules/@wordpress/customize-widgets/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  __experimentalgetinsertionpoint: () => (__experimentalgetinsertionpoint),
  isinserteropened: () => (isinserteropened)
});

// namespace object: ./node_modules/@wordpress/customize-widgets/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  setisinserteropened: () => (setisinserteropened)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","blocklibrary"]
const external_wp_blocklibrary_namespaceobject = window["wp"]["blocklibrary"];
;// external ["wp","widgets"]
const external_wp_widgets_namespaceobject = window["wp"]["widgets"];
;// external ["wp","blocks"]
const external_wp_blocks_namespaceobject = window["wp"]["blocks"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// external ["wp","preferences"]
const external_wp_preferences_namespaceobject = window["wp"]["preferences"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","blockeditor"]
const external_wp_blockeditor_namespaceobject = window["wp"]["blockeditor"];
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","hooks"]
const external_wp_hooks_namespaceobject = window["wp"]["hooks"];
;// ./node_modules/@wordpress/customize-widgets/build-module/components/error-boundary/index.js







function copybutton({ text, children }) {
  const ref = (0,external_wp_compose_namespaceobject.usecopytoclipboard)(text);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.button, { size: "compact", variant: "secondary", ref, children });
}
class errorboundary extends external_wp_element_namespaceobject.component {
  constructor() {
    super(...arguments);
    this.state = {
      error: null
    };
  }
  componentdidcatch(error) {
    this.setstate({ error });
    (0,external_wp_hooks_namespaceobject.doaction)("editor.errorboundary.errorlogged", error);
  }
  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_blockeditor_namespaceobject.warning,
      {
        classname: "customize-widgets-error-boundary",
        actions: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(copybutton, { text: error.stack, children: (0,external_wp_i18n_namespaceobject.__)("copy error") }, "copy-error")
        ],
        children: (0,external_wp_i18n_namespaceobject.__)("the editor has encountered an unexpected error.")
      }
    );
  }
}


;// external ["wp","coredata"]
const external_wp_coredata_namespaceobject = window["wp"]["coredata"];
;// external ["wp","mediautils"]
const external_wp_mediautils_namespaceobject = window["wp"]["mediautils"];
;// ./node_modules/@wordpress/customize-widgets/build-module/components/block-inspector-button/index.js






function blockinspectorbutton({ inspector, closemenu, ...props }) {
  const selectedblockclientid = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(external_wp_blockeditor_namespaceobject.store).getselectedblockclientid(),
    []
  );
  const selectedblock = (0,external_wp_element_namespaceobject.usememo)(
    () => document.getelementbyid(`block-${selectedblockclientid}`),
    [selectedblockclientid]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.menuitem,
    {
      onclick: () => {
        inspector.open({
          returnfocuswhenclose: selectedblock
        });
        closemenu();
      },
      ...props,
      children: (0,external_wp_i18n_namespaceobject.__)("show more settings")
    }
  );
}
var block_inspector_button_default = blockinspectorbutton;


;// ./node_modules/clsx/dist/clsx.mjs
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(array.isarray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const dist_clsx = (clsx);
;// external ["wp","keycodes"]
const external_wp_keycodes_namespaceobject = window["wp"]["keycodes"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/undo.js


var undo_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m18.3 11.7c-.6-.6-1.4-.9-2.3-.9h6.7l2.9-3.3-1.1-1-4.5 5l8.5 16l1-1-2.7-2.7h16c.5 0 .9.2 1.3.5 1 1 1 3.4 1 4.5v.3h1.5v-.2c0-1.5 0-4.3-1.5-5.7z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/redo.js


var redo_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m15.6 6.5l-1.1 1 2.9 3.3h8c-.9 0-1.7.3-2.3.9-1.4 1.5-1.4 4.2-1.4 5.6v.2h1.5v-.3c0-1.1 0-3.5 1-4.5.3-.3.7-.5 1.3-.5h9.2l14.5 15l1.1 1.1 4.6-4.6-4.6-5z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/plus.js


var plus_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m11 12.5v17.5h12.5v12.5h17.5v11h12.5v6h11v11h6v12.5h11z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/close-small.js


var close_small_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m12 13.06l3.712 3.713 1.061-1.06l13.061 12l3.712-3.712-1.06-1.06l12 10.938 8.288 7.227l-1.061 1.06l10.939 12l-3.712 3.712 1.06 1.061l12 13.061z" }) });


;// ./node_modules/@wordpress/customize-widgets/build-module/store/reducer.js

function blockinserterpanel(state = false, action) {
  switch (action.type) {
    case "set_is_inserter_opened":
      return action.value;
  }
  return state;
}
var reducer_default = (0,external_wp_data_namespaceobject.combinereducers)({
  blockinserterpanel
});


;// ./node_modules/@wordpress/customize-widgets/build-module/store/selectors.js
const empty_insertion_point = {
  rootclientid: void 0,
  insertionindex: void 0
};
function isinserteropened(state) {
  return !!state.blockinserterpanel;
}
function __experimentalgetinsertionpoint(state) {
  if (typeof state.blockinserterpanel === "boolean") {
    return empty_insertion_point;
  }
  return state.blockinserterpanel;
}


;// ./node_modules/@wordpress/customize-widgets/build-module/store/actions.js
function setisinserteropened(value) {
  return {
    type: "set_is_inserter_opened",
    value
  };
}


;// ./node_modules/@wordpress/customize-widgets/build-module/store/constants.js
const store_name = "core/customize-widgets";


;// ./node_modules/@wordpress/customize-widgets/build-module/store/index.js





const storeconfig = {
  reducer: reducer_default,
  selectors: selectors_namespaceobject,
  actions: actions_namespaceobject
};
const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, storeconfig);
(0,external_wp_data_namespaceobject.register)(store);


;// ./node_modules/@wordpress/customize-widgets/build-module/components/inserter/index.js








function inserter({ setisopened }) {
  const insertertitleid = (0,external_wp_compose_namespaceobject.useinstanceid)(
    inserter,
    "customize-widget-layout__inserter-panel-title"
  );
  const insertionpoint = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store).__experimentalgetinsertionpoint(),
    []
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    "div",
    {
      classname: "customize-widgets-layout__inserter-panel",
      "aria-labelledby": insertertitleid,
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "customize-widgets-layout__inserter-panel-header", children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            "h2",
            {
              id: insertertitleid,
              classname: "customize-widgets-layout__inserter-panel-header-title",
              children: (0,external_wp_i18n_namespaceobject.__)("add a block")
            }
          ),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_components_namespaceobject.button,
            {
              size: "small",
              icon: close_small_default,
              onclick: () => setisopened(false),
              "aria-label": (0,external_wp_i18n_namespaceobject.__)("close inserter")
            }
          )
        ] }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "customize-widgets-layout__inserter-panel-content", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          external_wp_blockeditor_namespaceobject.__experimentallibrary,
          {
            rootclientid: insertionpoint.rootclientid,
            __experimentalinsertionindex: insertionpoint.insertionindex,
            showinserterhelppanel: true,
            onselect: () => setisopened(false)
          }
        ) })
      ]
    }
  );
}
var inserter_default = inserter;


;// ./node_modules/@wordpress/icons/build-module/library/more-vertical.js


var more_vertical_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m13 19h-2v-2h2v2zm0-6h-2v-2h2v2zm0-6h-2v5h2v2z" }) });


;// ./node_modules/@wordpress/icons/build-module/library/external.js


var external_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m19.5 4.5h-7v6h4.44l-5.97 5.97 1.06 1.06l18 7.06v4.44h1.5v-7zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3h17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3v5.5h-3z" }) });


;// external ["wp","keyboardshortcuts"]
const external_wp_keyboardshortcuts_namespaceobject = window["wp"]["keyboardshortcuts"];
;// ./node_modules/@wordpress/customize-widgets/build-module/components/keyboard-shortcut-help-modal/config.js

const textformattingshortcuts = [
  {
    keycombination: { modifier: "primary", character: "b" },
    description: (0,external_wp_i18n_namespaceobject.__)("make the selected text bold.")
  },
  {
    keycombination: { modifier: "primary", character: "i" },
    description: (0,external_wp_i18n_namespaceobject.__)("make the selected text italic.")
  },
  {
    keycombination: { modifier: "primary", character: "k" },
    description: (0,external_wp_i18n_namespaceobject.__)("convert the selected text into a link.")
  },
  {
    keycombination: { modifier: "primaryshift", character: "k" },
    description: (0,external_wp_i18n_namespaceobject.__)("remove a link.")
  },
  {
    keycombination: { character: "[[" },
    description: (0,external_wp_i18n_namespaceobject.__)("insert a link to a post or page.")
  },
  {
    keycombination: { modifier: "primary", character: "u" },
    description: (0,external_wp_i18n_namespaceobject.__)("underline the selected text.")
  },
  {
    keycombination: { modifier: "access", character: "d" },
    description: (0,external_wp_i18n_namespaceobject.__)("strikethrough the selected text.")
  },
  {
    keycombination: { modifier: "access", character: "x" },
    description: (0,external_wp_i18n_namespaceobject.__)("make the selected text inline code.")
  },
  {
    keycombination: {
      modifier: "access",
      character: "0"
    },
    aliases: [
      {
        modifier: "access",
        character: "7"
      }
    ],
    description: (0,external_wp_i18n_namespaceobject.__)("convert the current heading to a paragraph.")
  },
  {
    keycombination: { modifier: "access", character: "1-6" },
    description: (0,external_wp_i18n_namespaceobject.__)(
      "convert the current paragraph or heading to a heading of level 1 to 6."
    )
  },
  {
    keycombination: { modifier: "primaryshift", character: "space" },
    description: (0,external_wp_i18n_namespaceobject.__)("add non breaking space.")
  }
];


;// ./node_modules/@wordpress/customize-widgets/build-module/components/keyboard-shortcut-help-modal/shortcut.js



function keycombination({ keycombination, forcearialabel }) {
  const shortcut = keycombination.modifier ? external_wp_keycodes_namespaceobject.displayshortcutlist[keycombination.modifier](
    keycombination.character
  ) : keycombination.character;
  const arialabel = keycombination.modifier ? external_wp_keycodes_namespaceobject.shortcutarialabel[keycombination.modifier](
    keycombination.character
  ) : keycombination.character;
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "kbd",
    {
      classname: "customize-widgets-keyboard-shortcut-help-modal__shortcut-key-combination",
      "aria-label": forcearialabel || arialabel,
      children: (array.isarray(shortcut) ? shortcut : [shortcut]).map(
        (character, index) => {
          if (character === "+") {
            return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.fragment, { children: character }, index);
          }
          return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            "kbd",
            {
              classname: "customize-widgets-keyboard-shortcut-help-modal__shortcut-key",
              children: character
            },
            index
          );
        }
      )
    }
  );
}
function shortcut({ description, keycombination, aliases = [], arialabel }) {
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "customize-widgets-keyboard-shortcut-help-modal__shortcut-description", children: description }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "customize-widgets-keyboard-shortcut-help-modal__shortcut-term", children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        keycombination,
        {
          keycombination,
          forcearialabel: arialabel
        }
      ),
      aliases.map((alias, index) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        keycombination,
        {
          keycombination: alias,
          forcearialabel: arialabel
        },
        index
      ))
    ] })
  ] });
}
var shortcut_default = shortcut;


;// ./node_modules/@wordpress/customize-widgets/build-module/components/keyboard-shortcut-help-modal/dynamic-shortcut.js




function dynamicshortcut({ name }) {
  const { keycombination, description, aliases } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const {
        getshortcutkeycombination,
        getshortcutdescription,
        getshortcutaliases
      } = select(external_wp_keyboardshortcuts_namespaceobject.store);
      return {
        keycombination: getshortcutkeycombination(name),
        aliases: getshortcutaliases(name),
        description: getshortcutdescription(name)
      };
    },
    [name]
  );
  if (!keycombination) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    shortcut_default,
    {
      keycombination,
      description,
      aliases
    }
  );
}
var dynamic_shortcut_default = dynamicshortcut;


;// ./node_modules/@wordpress/customize-widgets/build-module/components/keyboard-shortcut-help-modal/index.js










const shortcutlist = ({ shortcuts }) => (
  /*
   * disable reason: the `list` aria role is redundant but
   * safari+voiceover won't announce the list otherwise.
   */
  /* eslint-disable jsx-a11y/no-redundant-roles */
  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "ul",
    {
      classname: "customize-widgets-keyboard-shortcut-help-modal__shortcut-list",
      role: "list",
      children: shortcuts.map((shortcut, index) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "li",
        {
          classname: "customize-widgets-keyboard-shortcut-help-modal__shortcut",
          children: typeof shortcut === "string" ? /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(dynamic_shortcut_default, { name: shortcut }) : /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(shortcut_default, { ...shortcut })
        },
        index
      ))
    }
  )
);
const shortcutsection = ({ title, shortcuts, classname }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
  "section",
  {
    classname: dist_clsx(
      "customize-widgets-keyboard-shortcut-help-modal__section",
      classname
    ),
    children: [
      !!title && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h2", { classname: "customize-widgets-keyboard-shortcut-help-modal__section-title", children: title }),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(shortcutlist, { shortcuts })
    ]
  }
);
const shortcutcategorysection = ({
  title,
  categoryname,
  additionalshortcuts = []
}) => {
  const categoryshortcuts = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      return select(external_wp_keyboardshortcuts_namespaceobject.store).getcategoryshortcuts(
        categoryname
      );
    },
    [categoryname]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    shortcutsection,
    {
      title,
      shortcuts: categoryshortcuts.concat(additionalshortcuts)
    }
  );
};
function keyboardshortcuthelpmodal({
  ismodalactive,
  togglemodal
}) {
  const { registershortcut } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_keyboardshortcuts_namespaceobject.store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    registershortcut({
      name: "core/customize-widgets/keyboard-shortcuts",
      category: "main",
      description: (0,external_wp_i18n_namespaceobject.__)("display these keyboard shortcuts."),
      keycombination: {
        modifier: "access",
        character: "h"
      }
    });
  }, [registershortcut]);
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)("core/customize-widgets/keyboard-shortcuts", togglemodal);
  if (!ismodalactive) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
    external_wp_components_namespaceobject.modal,
    {
      classname: "customize-widgets-keyboard-shortcut-help-modal",
      title: (0,external_wp_i18n_namespaceobject.__)("keyboard shortcuts"),
      onrequestclose: togglemodal,
      children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutsection,
          {
            classname: "customize-widgets-keyboard-shortcut-help-modal__main-shortcuts",
            shortcuts: ["core/customize-widgets/keyboard-shortcuts"]
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutcategorysection,
          {
            title: (0,external_wp_i18n_namespaceobject.__)("global shortcuts"),
            categoryname: "global"
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutcategorysection,
          {
            title: (0,external_wp_i18n_namespaceobject.__)("selection shortcuts"),
            categoryname: "selection"
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutcategorysection,
          {
            title: (0,external_wp_i18n_namespaceobject.__)("block shortcuts"),
            categoryname: "block",
            additionalshortcuts: [
              {
                keycombination: { character: "/" },
                description: (0,external_wp_i18n_namespaceobject.__)(
                  "change the block type after adding a new paragraph."
                ),
                /* translators: the forward-slash character. e.g. '/'. */
                arialabel: (0,external_wp_i18n_namespaceobject.__)("forward-slash")
              }
            ]
          }
        ),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          shortcutsection,
          {
            title: (0,external_wp_i18n_namespaceobject.__)("text formatting"),
            shortcuts: textformattingshortcuts
          }
        )
      ]
    }
  );
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/more-menu/index.js









function moremenu() {
  const [
    iskeyboardshortcutsmodalactive,
    setiskeyboardshortcutsmodalvisible
  ] = (0,external_wp_element_namespaceobject.usestate)(false);
  const togglekeyboardshortcutsmodal = () => setiskeyboardshortcutsmodalvisible(!iskeyboardshortcutsmodalactive);
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)(
    "core/customize-widgets/keyboard-shortcuts",
    togglekeyboardshortcutsmodal
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.toolbardropdownmenu,
      {
        icon: more_vertical_default,
        label: (0,external_wp_i18n_namespaceobject.__)("options"),
        popoverprops: {
          placement: "bottom-end",
          classname: "more-menu-dropdown__content"
        },
        toggleprops: {
          tooltipposition: "bottom",
          size: "compact"
        },
        children: () => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menugroup, { label: (0,external_wp_i18n_namespaceobject._x)("view", "noun"), children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_preferences_namespaceobject.preferencetogglemenuitem,
            {
              scope: "core/customize-widgets",
              name: "fixedtoolbar",
              label: (0,external_wp_i18n_namespaceobject.__)("top toolbar"),
              info: (0,external_wp_i18n_namespaceobject.__)(
                "access all block and document tools in a single place"
              ),
              messageactivated: (0,external_wp_i18n_namespaceobject.__)(
                "top toolbar activated"
              ),
              messagedeactivated: (0,external_wp_i18n_namespaceobject.__)(
                "top toolbar deactivated"
              )
            }
          ) }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_wp_components_namespaceobject.menugroup, { label: (0,external_wp_i18n_namespaceobject.__)("tools"), children: [
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.menuitem,
              {
                onclick: () => {
                  setiskeyboardshortcutsmodalvisible(true);
                },
                shortcut: external_wp_keycodes_namespaceobject.displayshortcut.access("h"),
                children: (0,external_wp_i18n_namespaceobject.__)("keyboard shortcuts")
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_preferences_namespaceobject.preferencetogglemenuitem,
              {
                scope: "core/customize-widgets",
                name: "welcomeguide",
                label: (0,external_wp_i18n_namespaceobject.__)("welcome guide")
              }
            ),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
              external_wp_components_namespaceobject.menuitem,
              {
                role: "menuitem",
                icon: external_default,
                href: (0,external_wp_i18n_namespaceobject.__)(
                  "https://wordpress.org/documentation/article/block-based-widgets-editor/"
                ),
                target: "_blank",
                rel: "noopener noreferrer",
                children: [
                  (0,external_wp_i18n_namespaceobject.__)("help"),
                  /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.visuallyhidden, {
                    as: "span",
                    /* translators: accessibility text */
                    children: (0,external_wp_i18n_namespaceobject.__)("(opens in a new tab)")
                  })
                ]
              }
            )
          ] }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.menugroup, { label: (0,external_wp_i18n_namespaceobject.__)("preferences"), children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            external_wp_preferences_namespaceobject.preferencetogglemenuitem,
            {
              scope: "core/customize-widgets",
              name: "keepcaretinsideblock",
              label: (0,external_wp_i18n_namespaceobject.__)(
                "contain text cursor inside block"
              ),
              info: (0,external_wp_i18n_namespaceobject.__)(
                "aids screen readers by stopping text caret from leaving blocks."
              ),
              messageactivated: (0,external_wp_i18n_namespaceobject.__)(
                "contain text cursor inside block activated"
              ),
              messagedeactivated: (0,external_wp_i18n_namespaceobject.__)(
                "contain text cursor inside block deactivated"
              )
            }
          ) })
        ] })
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      keyboardshortcuthelpmodal,
      {
        ismodalactive: iskeyboardshortcutsmodalactive,
        togglemodal: togglekeyboardshortcutsmodal
      }
    )
  ] });
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/header/index.js










function header({
  sidebar,
  inserter,
  isinserteropened,
  setisinserteropened,
  isfixedtoolbaractive
}) {
  const [[hasundo, hasredo], setundoredo] = (0,external_wp_element_namespaceobject.usestate)([
    sidebar.hasundo(),
    sidebar.hasredo()
  ]);
  const shortcut = (0,external_wp_keycodes_namespaceobject.isappleos)() ? external_wp_keycodes_namespaceobject.displayshortcut.primaryshift("z") : external_wp_keycodes_namespaceobject.displayshortcut.primary("y");
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    return sidebar.subscribehistory(() => {
      setundoredo([sidebar.hasundo(), sidebar.hasredo()]);
    });
  }, [sidebar]);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      "div",
      {
        classname: dist_clsx("customize-widgets-header", {
          "is-fixed-toolbar-active": isfixedtoolbaractive
        }),
        children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
          external_wp_blockeditor_namespaceobject.navigabletoolbar,
          {
            classname: "customize-widgets-header-toolbar",
            "aria-label": (0,external_wp_i18n_namespaceobject.__)("document tools"),
            children: [
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                external_wp_components_namespaceobject.toolbarbutton,
                {
                  icon: !(0,external_wp_i18n_namespaceobject.isrtl)() ? undo_default : redo_default,
                  label: (0,external_wp_i18n_namespaceobject.__)("undo"),
                  shortcut: external_wp_keycodes_namespaceobject.displayshortcut.primary("z"),
                  disabled: !hasundo,
                  onclick: sidebar.undo,
                  classname: "customize-widgets-editor-history-button undo-button"
                }
              ),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                external_wp_components_namespaceobject.toolbarbutton,
                {
                  icon: !(0,external_wp_i18n_namespaceobject.isrtl)() ? redo_default : undo_default,
                  label: (0,external_wp_i18n_namespaceobject.__)("redo"),
                  shortcut,
                  disabled: !hasredo,
                  onclick: sidebar.redo,
                  classname: "customize-widgets-editor-history-button redo-button"
                }
              ),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                external_wp_components_namespaceobject.toolbarbutton,
                {
                  classname: "customize-widgets-header-toolbar__inserter-toggle",
                  ispressed: isinserteropened,
                  variant: "primary",
                  icon: plus_default,
                  label: (0,external_wp_i18n_namespaceobject._x)(
                    "add block",
                    "generic label for block inserter button"
                  ),
                  onclick: () => {
                    setisinserteropened((isopen) => !isopen);
                  }
                }
              ),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(moremenu, {})
            ]
          }
        )
      }
    ),
    (0,external_wp_element_namespaceobject.createportal)(
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(inserter_default, { setisopened: setisinserteropened }),
      inserter.contentcontainer[0]
    )
  ] });
}
var header_default = header;


;// ./node_modules/@wordpress/customize-widgets/build-module/components/inserter/use-inserter.js



function useinserter(inserter) {
  const isinserteropened = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store).isinserteropened(),
    []
  );
  const { setisinserteropened } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (isinserteropened) {
      inserter.open();
    } else {
      inserter.close();
    }
  }, [inserter, isinserteropened]);
  return [
    isinserteropened,
    (0,external_wp_element_namespaceobject.usecallback)(
      (updater) => {
        let isopen = updater;
        if (typeof updater === "function") {
          isopen = updater(
            (0,external_wp_data_namespaceobject.select)(store).isinserteropened()
          );
        }
        setisinserteropened(isopen);
      },
      [setisinserteropened]
    )
  ];
}


// external module: ./node_modules/fast-deep-equal/es6/index.js
var es6 = __webpack_require__(7734);
var es6_default = /*#__pure__*/__webpack_require__.n(es6);
;// external ["wp","isshallowequal"]
const external_wp_isshallowequal_namespaceobject = window["wp"]["isshallowequal"];
var external_wp_isshallowequal_default = /*#__pure__*/__webpack_require__.n(external_wp_isshallowequal_namespaceobject);
;// ./node_modules/@wordpress/customize-widgets/build-module/utils.js


function settingidtowidgetid(settingid) {
  const matches = settingid.match(/^widget_(.+)(?:\[(\d+)\])$/);
  if (matches) {
    const idbase = matches[1];
    const number = parseint(matches[2], 10);
    return `${idbase}-${number}`;
  }
  return settingid;
}
function blocktowidget(block, existingwidget = null) {
  let widget;
  const isvalidlegacywidgetblock = block.name === "core/legacy-widget" && (block.attributes.id || block.attributes.instance);
  if (isvalidlegacywidgetblock) {
    if (block.attributes.id) {
      widget = {
        id: block.attributes.id
      };
    } else {
      const { encoded, hash, raw, ...rest } = block.attributes.instance;
      widget = {
        idbase: block.attributes.idbase,
        instance: {
          ...existingwidget?.instance,
          // required only for the customizer.
          is_widget_customizer_js_value: true,
          encoded_serialized_instance: encoded,
          instance_hash_key: hash,
          raw_instance: raw,
          ...rest
        }
      };
    }
  } else {
    const instance = {
      content: (0,external_wp_blocks_namespaceobject.serialize)(block)
    };
    widget = {
      idbase: "block",
      widgetclass: "wp_widget_block",
      instance: {
        raw_instance: instance
      }
    };
  }
  const { form, rendered, ...restexistingwidget } = existingwidget || {};
  return {
    ...restexistingwidget,
    ...widget
  };
}
function widgettoblock({ id, idbase, number, instance }) {
  let block;
  const {
    encoded_serialized_instance: encoded,
    instance_hash_key: hash,
    raw_instance: raw,
    ...rest
  } = instance;
  if (idbase === "block") {
    const parsedblocks = (0,external_wp_blocks_namespaceobject.parse)(raw.content ?? "", {
      __unstableskipautop: true
    });
    block = parsedblocks.length ? parsedblocks[0] : (0,external_wp_blocks_namespaceobject.createblock)("core/paragraph", {});
  } else if (number) {
    block = (0,external_wp_blocks_namespaceobject.createblock)("core/legacy-widget", {
      idbase,
      instance: {
        encoded,
        hash,
        raw,
        ...rest
      }
    });
  } else {
    block = (0,external_wp_blocks_namespaceobject.createblock)("core/legacy-widget", {
      id
    });
  }
  return (0,external_wp_widgets_namespaceobject.addwidgetidtoblock)(block, id);
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/sidebar-block-editor/use-sidebar-block-editor.js





function widgetstoblocks(widgets) {
  return widgets.map((widget) => widgettoblock(widget));
}
function usesidebarblockeditor(sidebar) {
  const [blocks, setblocks] = (0,external_wp_element_namespaceobject.usestate)(
    () => widgetstoblocks(sidebar.getwidgets())
  );
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    return sidebar.subscribe((prevwidgets, nextwidgets) => {
      setblocks((prevblocks) => {
        const prevwidgetsmap = new map(
          prevwidgets.map((widget) => [widget.id, widget])
        );
        const prevblocksmap = new map(
          prevblocks.map((block) => [
            (0,external_wp_widgets_namespaceobject.getwidgetidfromblock)(block),
            block
          ])
        );
        const nextblocks = nextwidgets.map((nextwidget) => {
          const prevwidget = prevwidgetsmap.get(nextwidget.id);
          if (prevwidget && prevwidget === nextwidget) {
            return prevblocksmap.get(nextwidget.id);
          }
          return widgettoblock(nextwidget);
        });
        if (external_wp_isshallowequal_default()(prevblocks, nextblocks)) {
          return prevblocks;
        }
        return nextblocks;
      });
    });
  }, [sidebar]);
  const onchangeblocks = (0,external_wp_element_namespaceobject.usecallback)(
    (nextblocks) => {
      setblocks((prevblocks) => {
        if (external_wp_isshallowequal_default()(prevblocks, nextblocks)) {
          return prevblocks;
        }
        const prevblocksmap = new map(
          prevblocks.map((block) => [
            (0,external_wp_widgets_namespaceobject.getwidgetidfromblock)(block),
            block
          ])
        );
        const nextwidgets = nextblocks.map((nextblock) => {
          const widgetid = (0,external_wp_widgets_namespaceobject.getwidgetidfromblock)(nextblock);
          if (widgetid && prevblocksmap.has(widgetid)) {
            const prevblock = prevblocksmap.get(widgetid);
            const prevwidget = sidebar.getwidget(widgetid);
            if (es6_default()(nextblock, prevblock) && prevwidget) {
              return prevwidget;
            }
            return blocktowidget(nextblock, prevwidget);
          }
          return blocktowidget(nextblock);
        });
        if (external_wp_isshallowequal_default()(sidebar.getwidgets(), nextwidgets)) {
          return prevblocks;
        }
        const addedwidgetids = sidebar.setwidgets(nextwidgets);
        return nextblocks.reduce(
          (updatednextblocks, nextblock, index) => {
            const addedwidgetid = addedwidgetids[index];
            if (addedwidgetid !== null) {
              if (updatednextblocks === nextblocks) {
                updatednextblocks = nextblocks.slice();
              }
              updatednextblocks[index] = (0,external_wp_widgets_namespaceobject.addwidgetidtoblock)(
                nextblock,
                addedwidgetid
              );
            }
            return updatednextblocks;
          },
          nextblocks
        );
      });
    },
    [sidebar]
  );
  return [blocks, onchangeblocks, onchangeblocks];
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/focus-control/index.js



const focuscontrolcontext = (0,external_wp_element_namespaceobject.createcontext)();
focuscontrolcontext.displayname = "focuscontrolcontext";
function focuscontrol({ api, sidebarcontrols, children }) {
  const [focusedwidgetidref, setfocusedwidgetidref] = (0,external_wp_element_namespaceobject.usestate)({
    current: null
  });
  const focuswidget = (0,external_wp_element_namespaceobject.usecallback)(
    (widgetid) => {
      for (const sidebarcontrol of sidebarcontrols) {
        const widgets = sidebarcontrol.setting.get();
        if (widgets.includes(widgetid)) {
          sidebarcontrol.sectioninstance.expand({
            // schedule it after the complete callback so that
            // it won't be overridden by the "back" button focus.
            completecallback() {
              setfocusedwidgetidref({ current: widgetid });
            }
          });
          break;
        }
      }
    },
    [sidebarcontrols]
  );
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    function handlefocus(settingid) {
      const widgetid = settingidtowidgetid(settingid);
      focuswidget(widgetid);
    }
    let previewbound = false;
    function handleready() {
      api.previewer.preview.bind(
        "focus-control-for-setting",
        handlefocus
      );
      previewbound = true;
    }
    api.previewer.bind("ready", handleready);
    return () => {
      api.previewer.unbind("ready", handleready);
      if (previewbound) {
        api.previewer.preview.unbind(
          "focus-control-for-setting",
          handlefocus
        );
      }
    };
  }, [api, focuswidget]);
  const context = (0,external_wp_element_namespaceobject.usememo)(
    () => [focusedwidgetidref, focuswidget],
    [focusedwidgetidref, focuswidget]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(focuscontrolcontext.provider, { value: context, children });
}
const usefocuscontrol = () => (0,external_wp_element_namespaceobject.usecontext)(focuscontrolcontext);


;// ./node_modules/@wordpress/customize-widgets/build-module/components/focus-control/use-blocks-focus-control.js





function useblocksfocuscontrol(blocks) {
  const { selectblock } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_blockeditor_namespaceobject.store);
  const [focusedwidgetidref] = usefocuscontrol();
  const blocksref = (0,external_wp_element_namespaceobject.useref)(blocks);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    blocksref.current = blocks;
  }, [blocks]);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (focusedwidgetidref.current) {
      const focusedblock = blocksref.current.find(
        (block) => (0,external_wp_widgets_namespaceobject.getwidgetidfromblock)(block) === focusedwidgetidref.current
      );
      if (focusedblock) {
        selectblock(focusedblock.clientid);
        const blocknode = document.queryselector(
          `[data-block="${focusedblock.clientid}"]`
        );
        blocknode?.focus();
      }
    }
  }, [focusedwidgetidref, selectblock]);
}


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/customize-widgets/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/customize-widgets"
);


;// ./node_modules/@wordpress/customize-widgets/build-module/components/sidebar-block-editor/sidebar-editor-provider.js





const { experimentalblockeditorprovider } = unlock(external_wp_blockeditor_namespaceobject.privateapis);
function sidebareditorprovider({
  sidebar,
  settings,
  children
}) {
  const [blocks, oninput, onchange] = usesidebarblockeditor(sidebar);
  useblocksfocuscontrol(blocks);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    experimentalblockeditorprovider,
    {
      value: blocks,
      oninput,
      onchange,
      settings,
      usesubregistry: false,
      children
    }
  );
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/welcome-guide/index.js





function welcomeguide({ sidebar }) {
  const { toggle } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_preferences_namespaceobject.store);
  const isentirelyblockwidgets = sidebar.getwidgets().every((widget) => widget.id.startswith("block-"));
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "customize-widgets-welcome-guide", children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "customize-widgets-welcome-guide__image__wrapper", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("picture", { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "source",
        {
          srcset: "https://s.w.org/images/block-editor/welcome-editor.svg",
          media: "(prefers-reduced-motion: reduce)"
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        "img",
        {
          classname: "customize-widgets-welcome-guide__image",
          src: "https://s.w.org/images/block-editor/welcome-editor.gif",
          width: "312",
          height: "240",
          alt: ""
        }
      )
    ] }) }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("h1", { classname: "customize-widgets-welcome-guide__heading", children: (0,external_wp_i18n_namespaceobject.__)("welcome to block widgets") }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("p", { classname: "customize-widgets-welcome-guide__text", children: isentirelyblockwidgets ? (0,external_wp_i18n_namespaceobject.__)(
      "your theme provides different \u201cblock\u201d areas for you to add and edit content.\xa0try adding a search bar, social icons, or other types of blocks here and see how they\u2019ll look on your site."
    ) : (0,external_wp_i18n_namespaceobject.__)(
      "you can now add any block to your site\u2019s widget areas. don\u2019t worry, all of your favorite widgets still work flawlessly."
    ) }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      external_wp_components_namespaceobject.button,
      {
        size: "compact",
        variant: "primary",
        onclick: () => toggle("core/customize-widgets", "welcomeguide"),
        children: (0,external_wp_i18n_namespaceobject.__)("got it")
      }
    ),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("hr", { classname: "customize-widgets-welcome-guide__separator" }),
    !isentirelyblockwidgets && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("p", { classname: "customize-widgets-welcome-guide__more-info", children: [
      (0,external_wp_i18n_namespaceobject.__)("want to stick with the old widgets?"),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("br", {}),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_components_namespaceobject.externallink,
        {
          href: (0,external_wp_i18n_namespaceobject.__)(
            "https://wordpress.org/plugins/classic-widgets/"
          ),
          children: (0,external_wp_i18n_namespaceobject.__)("get the classic widgets plugin.")
        }
      )
    ] }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("p", { classname: "customize-widgets-welcome-guide__more-info", children: [
      (0,external_wp_i18n_namespaceobject.__)("new to the block editor?"),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("br", {}),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_components_namespaceobject.externallink,
        {
          href: (0,external_wp_i18n_namespaceobject.__)(
            "https://wordpress.org/documentation/article/wordpress-block-editor/"
          ),
          children: (0,external_wp_i18n_namespaceobject.__)("here's a detailed guide.")
        }
      )
    ] })
  ] });
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/keyboard-shortcuts/index.js





function keyboardshortcuts({ undo, redo, save }) {
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)("core/customize-widgets/undo", (event) => {
    undo();
    event.preventdefault();
  });
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)("core/customize-widgets/redo", (event) => {
    redo();
    event.preventdefault();
  });
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)("core/customize-widgets/save", (event) => {
    event.preventdefault();
    save();
  });
  return null;
}
function keyboardshortcutsregister() {
  const { registershortcut, unregistershortcut } = (0,external_wp_data_namespaceobject.usedispatch)(
    external_wp_keyboardshortcuts_namespaceobject.store
  );
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    registershortcut({
      name: "core/customize-widgets/undo",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("undo your last changes."),
      keycombination: {
        modifier: "primary",
        character: "z"
      }
    });
    registershortcut({
      name: "core/customize-widgets/redo",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("redo your last undo."),
      keycombination: {
        modifier: "primaryshift",
        character: "z"
      },
      // disable on apple os because it conflicts with the browser's
      // history shortcut. it's a fine alias for both windows and linux.
      // since there's no conflict for ctrl+shift+z on both windows and
      // linux, we keep it as the default for consistency.
      aliases: (0,external_wp_keycodes_namespaceobject.isappleos)() ? [] : [
        {
          modifier: "primary",
          character: "y"
        }
      ]
    });
    registershortcut({
      name: "core/customize-widgets/save",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("save your changes."),
      keycombination: {
        modifier: "primary",
        character: "s"
      }
    });
    return () => {
      unregistershortcut("core/customize-widgets/undo");
      unregistershortcut("core/customize-widgets/redo");
      unregistershortcut("core/customize-widgets/save");
    };
  }, [registershortcut]);
  return null;
}
keyboardshortcuts.register = keyboardshortcutsregister;
var keyboard_shortcuts_default = keyboardshortcuts;


;// ./node_modules/@wordpress/customize-widgets/build-module/components/block-appender/index.js




function blockappender(props) {
  const ref = (0,external_wp_element_namespaceobject.useref)();
  const isblockslistempty = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(external_wp_blockeditor_namespaceobject.store).getblockcount() === 0
  );
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (isblockslistempty && ref.current) {
      const { ownerdocument } = ref.current;
      if (!ownerdocument.activeelement || ownerdocument.activeelement === ownerdocument.body) {
        ref.current.focus();
      }
    }
  }, [isblockslistempty]);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.buttonblockappender, { ...props, ref });
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/sidebar-block-editor/index.js

















const { experimentalblockcanvas: blockcanvas } = unlock(
  external_wp_blockeditor_namespaceobject.privateapis
);
const { blockkeyboardshortcuts } = unlock(external_wp_blocklibrary_namespaceobject.privateapis);
function sidebarblockeditor({
  blockeditorsettings,
  sidebar,
  inserter,
  inspector
}) {
  const [isinserteropened, setisinserteropened] = useinserter(inserter);
  const ismediumviewport = (0,external_wp_compose_namespaceobject.useviewportmatch)("small");
  const {
    hasuploadpermissions,
    isfixedtoolbaractive,
    keepcaretinsideblock,
    iswelcomeguideactive
  } = (0,external_wp_data_namespaceobject.useselect)((select) => {
    const { get } = select(external_wp_preferences_namespaceobject.store);
    return {
      hasuploadpermissions: select(external_wp_coredata_namespaceobject.store).canuser("create", {
        kind: "posttype",
        name: "attachment"
      }) ?? true,
      isfixedtoolbaractive: !!get(
        "core/customize-widgets",
        "fixedtoolbar"
      ),
      keepcaretinsideblock: !!get(
        "core/customize-widgets",
        "keepcaretinsideblock"
      ),
      iswelcomeguideactive: !!get(
        "core/customize-widgets",
        "welcomeguide"
      )
    };
  }, []);
  const settings = (0,external_wp_element_namespaceobject.usememo)(() => {
    let mediauploadblockeditor;
    if (hasuploadpermissions) {
      mediauploadblockeditor = ({ onerror, ...argumentsobject }) => {
        (0,external_wp_mediautils_namespaceobject.uploadmedia)({
          wpallowedmimetypes: blockeditorsettings.allowedmimetypes,
          onerror: ({ message }) => onerror(message),
          ...argumentsobject
        });
      };
    }
    return {
      ...blockeditorsettings,
      __experimentalsetisinserteropened: setisinserteropened,
      mediaupload: mediauploadblockeditor,
      hasfixedtoolbar: isfixedtoolbaractive || !ismediumviewport,
      keepcaretinsideblock,
      editortool: "edit",
      __unstablehascustomappender: true
    };
  }, [
    hasuploadpermissions,
    blockeditorsettings,
    isfixedtoolbaractive,
    ismediumviewport,
    keepcaretinsideblock,
    setisinserteropened
  ]);
  if (iswelcomeguideactive) {
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(welcomeguide, { sidebar });
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(keyboard_shortcuts_default.register, {}),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(blockkeyboardshortcuts, {}),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(sidebareditorprovider, { sidebar, settings, children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        keyboard_shortcuts_default,
        {
          undo: sidebar.undo,
          redo: sidebar.redo,
          save: sidebar.save
        }
      ),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        header_default,
        {
          sidebar,
          inserter,
          isinserteropened,
          setisinserteropened,
          isfixedtoolbaractive: isfixedtoolbaractive || !ismediumviewport
        }
      ),
      (isfixedtoolbaractive || !ismediumviewport) && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blocktoolbar, { hidedraghandle: true }),
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        blockcanvas,
        {
          shouldiframe: false,
          styles: settings.defaulteditorstyles,
          height: "100%",
          children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blocklist, { renderappender: blockappender })
        }
      ),
      (0,external_wp_element_namespaceobject.createportal)(
        // this is a temporary hack to prevent button component inside <blockinspector>
        // from submitting form when type="button" is not specified.
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("form", { onsubmit: (event) => event.preventdefault(), children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockinspector, {}) }),
        inspector.contentcontainer[0]
      )
    ] }),
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.__unstableblocksettingsmenufirstitem, { children: ({ onclose }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      block_inspector_button_default,
      {
        inspector,
        closemenu: onclose
      }
    ) })
  ] });
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/sidebar-controls/index.js


const sidebarcontrolscontext = (0,external_wp_element_namespaceobject.createcontext)();
sidebarcontrolscontext.displayname = "sidebarcontrolscontext";
function sidebarcontrols({
  sidebarcontrols,
  activesidebarcontrol,
  children
}) {
  const context = (0,external_wp_element_namespaceobject.usememo)(
    () => ({
      sidebarcontrols,
      activesidebarcontrol
    }),
    [sidebarcontrols, activesidebarcontrol]
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(sidebarcontrolscontext.provider, { value: context, children });
}
function usesidebarcontrols() {
  const { sidebarcontrols } = (0,external_wp_element_namespaceobject.usecontext)(sidebarcontrolscontext);
  return sidebarcontrols;
}
function useactivesidebarcontrol() {
  const { activesidebarcontrol } = (0,external_wp_element_namespaceobject.usecontext)(sidebarcontrolscontext);
  return activesidebarcontrol;
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/customize-widgets/use-clear-selected-block.js



function useclearselectedblock(sidebarcontrol, popoverref) {
  const { hasselectedblock, hasmultiselection } = (0,external_wp_data_namespaceobject.useselect)(external_wp_blockeditor_namespaceobject.store);
  const { clearselectedblock } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_blockeditor_namespaceobject.store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (popoverref.current && sidebarcontrol) {
      let handleclearselectedblock = function(element) {
        if (
          // 1. make sure there are blocks being selected.
          (hasselectedblock() || hasmultiselection()) && // 2. the element should exist in the dom (not deleted).
          element && ownerdocument.contains(element) && // 3. it should also not exist in the container, the popover, nor the dialog.
          !container.contains(element) && !popoverref.current.contains(element) && !element.closest('[role="dialog"]') && // 4. the inspector should not be opened.
          !inspector.expanded()
        ) {
          clearselectedblock();
        }
      }, handlemousedown = function(event) {
        handleclearselectedblock(event.target);
      }, handleblur = function() {
        handleclearselectedblock(ownerdocument.activeelement);
      };
      const inspector = sidebarcontrol.inspector;
      const container = sidebarcontrol.container[0];
      const ownerdocument = container.ownerdocument;
      const ownerwindow = ownerdocument.defaultview;
      ownerdocument.addeventlistener("mousedown", handlemousedown);
      ownerwindow.addeventlistener("blur", handleblur);
      return () => {
        ownerdocument.removeeventlistener(
          "mousedown",
          handlemousedown
        );
        ownerwindow.removeeventlistener("blur", handleblur);
      };
    }
  }, [
    popoverref,
    sidebarcontrol,
    hasselectedblock,
    hasmultiselection,
    clearselectedblock
  ]);
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/customize-widgets/index.js








function customizewidgets({
  api,
  sidebarcontrols,
  blockeditorsettings
}) {
  const [activesidebarcontrol, setactivesidebarcontrol] = (0,external_wp_element_namespaceobject.usestate)(null);
  const parentcontainer = document.getelementbyid(
    "customize-theme-controls"
  );
  const popoverref = (0,external_wp_element_namespaceobject.useref)();
  useclearselectedblock(activesidebarcontrol, popoverref);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const unsubscribers = sidebarcontrols.map(
      (sidebarcontrol) => sidebarcontrol.subscribe((expanded) => {
        if (expanded) {
          setactivesidebarcontrol(sidebarcontrol);
        }
      })
    );
    return () => {
      unsubscribers.foreach((unsubscriber) => unsubscriber());
    };
  }, [sidebarcontrols]);
  const activesidebar = activesidebarcontrol && (0,external_wp_element_namespaceobject.createportal)(
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(errorboundary, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      sidebarblockeditor,
      {
        blockeditorsettings,
        sidebar: activesidebarcontrol.sidebaradapter,
        inserter: activesidebarcontrol.inserter,
        inspector: activesidebarcontrol.inspector
      },
      activesidebarcontrol.id
    ) }),
    activesidebarcontrol.container[0]
  );
  const popover = parentcontainer && (0,external_wp_element_namespaceobject.createportal)(
    /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "customize-widgets-popover", ref: popoverref, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.popover.slot, {}) }),
    parentcontainer
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_components_namespaceobject.slotfillprovider, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    sidebarcontrols,
    {
      sidebarcontrols,
      activesidebarcontrol,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(focuscontrol, { api, sidebarcontrols, children: [
        activesidebar,
        popover
      ] })
    }
  ) });
}


;// ./node_modules/@wordpress/customize-widgets/build-module/controls/inspector-section.js
function getinspectorsection() {
  const {
    wp: { customize }
  } = window;
  return class inspectorsection extends customize.section {
    constructor(id, options) {
      super(id, options);
      this.parentsection = options.parentsection;
      this.returnfocuswhenclose = null;
      this._isopen = false;
    }
    get isopen() {
      return this._isopen;
    }
    set isopen(value) {
      this._isopen = value;
      this.triggeractivecallbacks();
    }
    ready() {
      this.contentcontainer[0].classlist.add(
        "customize-widgets-layout__inspector"
      );
    }
    iscontextuallyactive() {
      return this.isopen;
    }
    onchangeexpanded(expanded, args) {
      super.onchangeexpanded(expanded, args);
      if (this.parentsection && !args.unchanged) {
        if (expanded) {
          this.parentsection.collapse({
            manualtransition: true
          });
        } else {
          this.parentsection.expand({
            manualtransition: true,
            completecallback: () => {
              if (this.returnfocuswhenclose && !this.contentcontainer[0].contains(
                this.returnfocuswhenclose
              )) {
                this.returnfocuswhenclose.focus();
              }
            }
          });
        }
      }
    }
    open({ returnfocuswhenclose } = {}) {
      this.isopen = true;
      this.returnfocuswhenclose = returnfocuswhenclose;
      this.expand({
        allowmultiple: true
      });
    }
    close() {
      this.collapse({
        allowmultiple: true
      });
    }
    collapse(options) {
      this.isopen = false;
      super.collapse(options);
    }
    triggeractivecallbacks() {
      this.active.callbacks.firewith(this.active, [false, true]);
    }
  };
}


;// ./node_modules/@wordpress/customize-widgets/build-module/controls/sidebar-section.js


const getinspectorsectionid = (sidebarid) => `widgets-inspector-${sidebarid}`;
function getsidebarsection() {
  const {
    wp: { customize }
  } = window;
  const reducemotionmediaquery = window.matchmedia(
    "(prefers-reduced-motion: reduce)"
  );
  let isreducedmotion = reducemotionmediaquery.matches;
  reducemotionmediaquery.addeventlistener("change", (event) => {
    isreducedmotion = event.matches;
  });
  return class sidebarsection extends customize.section {
    ready() {
      const inspectorsection = getinspectorsection();
      this.inspector = new inspectorsection(
        getinspectorsectionid(this.id),
        {
          title: (0,external_wp_i18n_namespaceobject.__)("block settings"),
          parentsection: this,
          customizeaction: [
            (0,external_wp_i18n_namespaceobject.__)("customizing"),
            (0,external_wp_i18n_namespaceobject.__)("widgets"),
            this.params.title
          ].join(" \u25b8 ")
        }
      );
      customize.section.add(this.inspector);
      this.contentcontainer[0].classlist.add(
        "customize-widgets__sidebar-section"
      );
    }
    hassubsectionopened() {
      return this.inspector.expanded();
    }
    onchangeexpanded(expanded, _args) {
      const controls = this.controls();
      const args = {
        ..._args,
        completecallback() {
          controls.foreach((control) => {
            control.onchangesectionexpanded?.(expanded, args);
          });
          _args.completecallback?.();
        }
      };
      if (args.manualtransition) {
        if (expanded) {
          this.contentcontainer.addclass(["busy", "open"]);
          this.contentcontainer.removeclass("is-sub-section-open");
          this.contentcontainer.closest(".wp-full-overlay").addclass("section-open");
        } else {
          this.contentcontainer.addclass([
            "busy",
            "is-sub-section-open"
          ]);
          this.contentcontainer.closest(".wp-full-overlay").addclass("section-open");
          this.contentcontainer.removeclass("open");
        }
        const handletransitionend = () => {
          this.contentcontainer.removeclass("busy");
          args.completecallback();
        };
        if (isreducedmotion) {
          handletransitionend();
        } else {
          this.contentcontainer.one(
            "transitionend",
            handletransitionend
          );
        }
      } else {
        super.onchangeexpanded(expanded, args);
      }
    }
  };
}


;// ./node_modules/@wordpress/customize-widgets/build-module/components/sidebar-block-editor/sidebar-adapter.js

const { wp } = window;
function parsewidgetid(widgetid) {
  const matches = widgetid.match(/^(.+)-(\d+)$/);
  if (matches) {
    return {
      idbase: matches[1],
      number: parseint(matches[2], 10)
    };
  }
  return { idbase: widgetid };
}
function widgetidtosettingid(widgetid) {
  const { idbase, number } = parsewidgetid(widgetid);
  if (number) {
    return `widget_${idbase}[${number}]`;
  }
  return `widget_${idbase}`;
}
function debounce(leading, callback, timeout) {
  let isleading = false;
  let timerid;
  function debounced(...args) {
    const result = (isleading ? callback : leading).apply(this, args);
    isleading = true;
    cleartimeout(timerid);
    timerid = settimeout(() => {
      isleading = false;
    }, timeout);
    return result;
  }
  debounced.cancel = () => {
    isleading = false;
    cleartimeout(timerid);
  };
  return debounced;
}
class sidebaradapter {
  constructor(setting, api) {
    this.setting = setting;
    this.api = api;
    this.locked = false;
    this.widgetscache = /* @__pure__ */ new weakmap();
    this.subscribers = /* @__pure__ */ new set();
    this.history = [
      this._getwidgetids().map(
        (widgetid) => this.getwidget(widgetid)
      )
    ];
    this.historyindex = 0;
    this.historysubscribers = /* @__pure__ */ new set();
    this._debouncesethistory = debounce(
      this._pushhistory,
      this._replacehistory,
      1e3
    );
    this.setting.bind(this._handlesettingchange.bind(this));
    this.api.bind("change", this._handleallsettingschange.bind(this));
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.save = this.save.bind(this);
  }
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
  getwidgets() {
    return this.history[this.historyindex];
  }
  _emit(...args) {
    for (const callback of this.subscribers) {
      callback(...args);
    }
  }
  _getwidgetids() {
    return this.setting.get();
  }
  _pushhistory() {
    this.history = [
      ...this.history.slice(0, this.historyindex + 1),
      this._getwidgetids().map(
        (widgetid) => this.getwidget(widgetid)
      )
    ];
    this.historyindex += 1;
    this.historysubscribers.foreach((listener) => listener());
  }
  _replacehistory() {
    this.history[this.historyindex] = this._getwidgetids().map(
      (widgetid) => this.getwidget(widgetid)
    );
  }
  _handlesettingchange() {
    if (this.locked) {
      return;
    }
    const prevwidgets = this.getwidgets();
    this._pushhistory();
    this._emit(prevwidgets, this.getwidgets());
  }
  _handleallsettingschange(setting) {
    if (this.locked) {
      return;
    }
    if (!setting.id.startswith("widget_")) {
      return;
    }
    const widgetid = settingidtowidgetid(setting.id);
    if (!this.setting.get().includes(widgetid)) {
      return;
    }
    const prevwidgets = this.getwidgets();
    this._pushhistory();
    this._emit(prevwidgets, this.getwidgets());
  }
  _createwidget(widget) {
    const widgetmodel = wp.customize.widgets.availablewidgets.findwhere({
      id_base: widget.idbase
    });
    let number = widget.number;
    if (widgetmodel.get("is_multi") && !number) {
      widgetmodel.set(
        "multi_number",
        widgetmodel.get("multi_number") + 1
      );
      number = widgetmodel.get("multi_number");
    }
    const settingid = number ? `widget_${widget.idbase}[${number}]` : `widget_${widget.idbase}`;
    const settingargs = {
      transport: wp.customize.widgets.data.selectiverefreshablewidgets[widgetmodel.get("id_base")] ? "postmessage" : "refresh",
      previewer: this.setting.previewer
    };
    const setting = this.api.create(
      settingid,
      settingid,
      "",
      settingargs
    );
    setting.set(widget.instance);
    const widgetid = settingidtowidgetid(settingid);
    return widgetid;
  }
  _removewidget(widget) {
    const settingid = widgetidtosettingid(widget.id);
    const setting = this.api(settingid);
    if (setting) {
      const instance = setting.get();
      this.widgetscache.delete(instance);
    }
    this.api.remove(settingid);
  }
  _updatewidget(widget) {
    const prevwidget = this.getwidget(widget.id);
    if (prevwidget === widget) {
      return widget.id;
    }
    if (prevwidget.idbase && widget.idbase && prevwidget.idbase === widget.idbase) {
      const settingid = widgetidtosettingid(widget.id);
      this.api(settingid).set(widget.instance);
      return widget.id;
    }
    this._removewidget(widget);
    return this._createwidget(widget);
  }
  getwidget(widgetid) {
    if (!widgetid) {
      return null;
    }
    const { idbase, number } = parsewidgetid(widgetid);
    const settingid = widgetidtosettingid(widgetid);
    const setting = this.api(settingid);
    if (!setting) {
      return null;
    }
    const instance = setting.get();
    if (this.widgetscache.has(instance)) {
      return this.widgetscache.get(instance);
    }
    const widget = {
      id: widgetid,
      idbase,
      number,
      instance
    };
    this.widgetscache.set(instance, widget);
    return widget;
  }
  _updatewidgets(nextwidgets) {
    this.locked = true;
    const addedwidgetids = [];
    const nextwidgetids = nextwidgets.map((nextwidget) => {
      if (nextwidget.id && this.getwidget(nextwidget.id)) {
        addedwidgetids.push(null);
        return this._updatewidget(nextwidget);
      }
      const widgetid = this._createwidget(nextwidget);
      addedwidgetids.push(widgetid);
      return widgetid;
    });
    const deletedwidgets = this.getwidgets().filter(
      (widget) => !nextwidgetids.includes(widget.id)
    );
    deletedwidgets.foreach((widget) => this._removewidget(widget));
    this.setting.set(nextwidgetids);
    this.locked = false;
    return addedwidgetids;
  }
  setwidgets(nextwidgets) {
    const addedwidgetids = this._updatewidgets(nextwidgets);
    this._debouncesethistory();
    return addedwidgetids;
  }
  /**
   * undo/redo related features
   */
  hasundo() {
    return this.historyindex > 0;
  }
  hasredo() {
    return this.historyindex < this.history.length - 1;
  }
  _seek(historyindex) {
    const currentwidgets = this.getwidgets();
    this.historyindex = historyindex;
    const widgets = this.history[this.historyindex];
    this._updatewidgets(widgets);
    this._emit(currentwidgets, this.getwidgets());
    this.historysubscribers.foreach((listener) => listener());
    this._debouncesethistory.cancel();
  }
  undo() {
    if (!this.hasundo()) {
      return;
    }
    this._seek(this.historyindex - 1);
  }
  redo() {
    if (!this.hasredo()) {
      return;
    }
    this._seek(this.historyindex + 1);
  }
  subscribehistory(listener) {
    this.historysubscribers.add(listener);
    return () => {
      this.historysubscribers.delete(listener);
    };
  }
  save() {
    this.api.previewer.save();
  }
}


;// external ["wp","dom"]
const external_wp_dom_namespaceobject = window["wp"]["dom"];
;// ./node_modules/@wordpress/customize-widgets/build-module/controls/inserter-outer-section.js




function getinserteroutersection() {
  const {
    wp: { customize }
  } = window;
  const outersection = customize.outersection;
  customize.outersection = class extends outersection {
    onchangeexpanded(expanded, args) {
      if (expanded) {
        customize.section.each((section) => {
          if (section.params.type === "outer" && section.id !== this.id) {
            if (section.expanded()) {
              section.collapse();
            }
          }
        });
      }
      return super.onchangeexpanded(expanded, args);
    }
  };
  customize.sectionconstructor.outer = customize.outersection;
  return class inserteroutersection extends customize.outersection {
    constructor(...args) {
      super(...args);
      this.params.type = "outer";
      this.activeelementbeforeexpanded = null;
      const ownerwindow = this.contentcontainer[0].ownerdocument.defaultview;
      ownerwindow.addeventlistener(
        "keydown",
        (event) => {
          if (this.expanded() && (event.keycode === external_wp_keycodes_namespaceobject.escape || event.code === "escape") && !event.defaultprevented) {
            event.preventdefault();
            event.stoppropagation();
            (0,external_wp_data_namespaceobject.dispatch)(store).setisinserteropened(
              false
            );
          }
        },
        // use capture mode to make this run before other event listeners.
        true
      );
      this.contentcontainer.addclass("widgets-inserter");
      this.isfrominternalaction = false;
      this.expanded.bind(() => {
        if (!this.isfrominternalaction) {
          (0,external_wp_data_namespaceobject.dispatch)(store).setisinserteropened(
            this.expanded()
          );
        }
        this.isfrominternalaction = false;
      });
    }
    open() {
      if (!this.expanded()) {
        const contentcontainer = this.contentcontainer[0];
        this.activeelementbeforeexpanded = contentcontainer.ownerdocument.activeelement;
        this.isfrominternalaction = true;
        this.expand({
          completecallback() {
            const searchbox = external_wp_dom_namespaceobject.focus.tabbable.find(contentcontainer)[1];
            if (searchbox) {
              searchbox.focus();
            }
          }
        });
      }
    }
    close() {
      if (this.expanded()) {
        const contentcontainer = this.contentcontainer[0];
        const activeelement = contentcontainer.ownerdocument.activeelement;
        this.isfrominternalaction = true;
        this.collapse({
          completecallback() {
            if (contentcontainer.contains(activeelement)) {
              if (this.activeelementbeforeexpanded) {
                this.activeelementbeforeexpanded.focus();
              }
            }
          }
        });
      }
    }
  };
}


;// ./node_modules/@wordpress/customize-widgets/build-module/controls/sidebar-control.js




const getinserterid = (controlid) => `widgets-inserter-${controlid}`;
function getsidebarcontrol() {
  const {
    wp: { customize }
  } = window;
  return class sidebarcontrol extends customize.control {
    constructor(...args) {
      super(...args);
      this.subscribers = /* @__pure__ */ new set();
    }
    ready() {
      const inserteroutersection = getinserteroutersection();
      this.inserter = new inserteroutersection(
        getinserterid(this.id),
        {}
      );
      customize.section.add(this.inserter);
      this.sectioninstance = customize.section(this.section());
      this.inspector = this.sectioninstance.inspector;
      this.sidebaradapter = new sidebaradapter(this.setting, customize);
    }
    subscribe(callback) {
      this.subscribers.add(callback);
      return () => {
        this.subscribers.delete(callback);
      };
    }
    onchangesectionexpanded(expanded, args) {
      if (!args.unchanged) {
        if (!expanded) {
          (0,external_wp_data_namespaceobject.dispatch)(store).setisinserteropened(
            false
          );
        }
        this.subscribers.foreach(
          (subscriber) => subscriber(expanded, args)
        );
      }
    }
  };
}


;// ./node_modules/@wordpress/customize-widgets/build-module/filters/move-to-sidebar.js









const withmovetosidebartoolbaritem = (0,external_wp_compose_namespaceobject.createhigherordercomponent)(
  (blockedit) => (props) => {
    let widgetid = (0,external_wp_widgets_namespaceobject.getwidgetidfromblock)(props);
    const sidebarcontrols = usesidebarcontrols();
    const activesidebarcontrol = useactivesidebarcontrol();
    const hasmultiplesidebars = sidebarcontrols?.length > 1;
    const blockname = props.name;
    const clientid = props.clientid;
    const caninsertblockinsidebar = (0,external_wp_data_namespaceobject.useselect)(
      (select) => {
        return select(external_wp_blockeditor_namespaceobject.store).caninsertblocktype(
          blockname,
          ""
        );
      },
      [blockname]
    );
    const block = (0,external_wp_data_namespaceobject.useselect)(
      (select) => select(external_wp_blockeditor_namespaceobject.store).getblock(clientid),
      [clientid]
    );
    const { removeblock } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_blockeditor_namespaceobject.store);
    const [, focuswidget] = usefocuscontrol();
    function movetosidebar(sidebarcontrolid) {
      const newsidebarcontrol = sidebarcontrols.find(
        (sidebarcontrol) => sidebarcontrol.id === sidebarcontrolid
      );
      if (widgetid) {
        const oldsetting = activesidebarcontrol.setting;
        const newsetting = newsidebarcontrol.setting;
        oldsetting(oldsetting().filter((id) => id !== widgetid));
        newsetting([...newsetting(), widgetid]);
      } else {
        const sidebaradapter = newsidebarcontrol.sidebaradapter;
        removeblock(clientid);
        const addedwidgetids = sidebaradapter.setwidgets([
          ...sidebaradapter.getwidgets(),
          blocktowidget(block)
        ]);
        widgetid = addedwidgetids.reverse().find((id) => !!id);
      }
      focuswidget(widgetid);
    }
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(external_reactjsxruntime_namespaceobject.fragment, { children: [
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(blockedit, { ...props }, "edit"),
      hasmultiplesidebars && caninsertblockinsidebar && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_blockeditor_namespaceobject.blockcontrols, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        external_wp_widgets_namespaceobject.movetowidgetarea,
        {
          widgetareas: sidebarcontrols.map(
            (sidebarcontrol) => ({
              id: sidebarcontrol.id,
              name: sidebarcontrol.params.label,
              description: sidebarcontrol.params.description
            })
          ),
          currentwidgetareaid: activesidebarcontrol?.id,
          onselect: movetosidebar
        }
      ) })
    ] });
  },
  "withmovetosidebartoolbaritem"
);
(0,external_wp_hooks_namespaceobject.addfilter)(
  "editor.blockedit",
  "core/customize-widgets/block-edit",
  withmovetosidebartoolbaritem
);

;// ./node_modules/@wordpress/customize-widgets/build-module/filters/replace-media-upload.js


const replacemediaupload = () => external_wp_mediautils_namespaceobject.mediaupload;
(0,external_wp_hooks_namespaceobject.addfilter)(
  "editor.mediaupload",
  "core/edit-widgets/replace-media-upload",
  replacemediaupload
);

;// ./node_modules/@wordpress/customize-widgets/build-module/filters/wide-widget-display.js



const { wp: wide_widget_display_wp } = window;
const withwidewidgetdisplay = (0,external_wp_compose_namespaceobject.createhigherordercomponent)(
  (blockedit) => (props) => {
    const { idbase } = props.attributes;
    const iswide = wide_widget_display_wp.customize.widgets.data.availablewidgets.find(
      (widget) => widget.id_base === idbase
    )?.is_wide ?? false;
    return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(blockedit, { ...props, iswide }, "edit");
  },
  "withwidewidgetdisplay"
);
(0,external_wp_hooks_namespaceobject.addfilter)(
  "editor.blockedit",
  "core/customize-widgets/wide-widget-display",
  withwidewidgetdisplay
);

;// ./node_modules/@wordpress/customize-widgets/build-module/filters/index.js




;// ./node_modules/@wordpress/customize-widgets/build-module/index.js











const { wp: build_module_wp } = window;
const disabled_blocks = [
  "core/more",
  "core/block",
  "core/freeform",
  "core/template-part"
];
const enable_experimental_fse_blocks = false;
function initialize(editorname, blockeditorsettings) {
  (0,external_wp_data_namespaceobject.dispatch)(external_wp_preferences_namespaceobject.store).setdefaults("core/customize-widgets", {
    fixedtoolbar: false,
    welcomeguide: true
  });
  (0,external_wp_data_namespaceobject.dispatch)(external_wp_blocks_namespaceobject.store).reapplyblocktypefilters();
  const coreblocks = (0,external_wp_blocklibrary_namespaceobject.__experimentalgetcoreblocks)().filter((block) => {
    return !(disabled_blocks.includes(block.name) || block.name.startswith("core/post") || block.name.startswith("core/query") || block.name.startswith("core/site") || block.name.startswith("core/navigation"));
  });
  (0,external_wp_blocklibrary_namespaceobject.registercoreblocks)(coreblocks);
  (0,external_wp_widgets_namespaceobject.registerlegacywidgetblock)();
  if (false) {}
  (0,external_wp_widgets_namespaceobject.registerlegacywidgetvariations)(blockeditorsettings);
  (0,external_wp_widgets_namespaceobject.registerwidgetgroupblock)();
  (0,external_wp_blocks_namespaceobject.setfreeformcontenthandlername)("core/html");
  const sidebarcontrol = getsidebarcontrol(blockeditorsettings);
  build_module_wp.customize.sectionconstructor.sidebar = getsidebarsection();
  build_module_wp.customize.controlconstructor.sidebar_block_editor = sidebarcontrol;
  const container = document.createelement("div");
  document.body.appendchild(container);
  build_module_wp.customize.bind("ready", () => {
    const sidebarcontrols = [];
    build_module_wp.customize.control.each((control) => {
      if (control instanceof sidebarcontrol) {
        sidebarcontrols.push(control);
      }
    });
    (0,external_wp_element_namespaceobject.createroot)(container).render(
      /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_element_namespaceobject.strictmode, { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
        customizewidgets,
        {
          api: build_module_wp.customize,
          sidebarcontrols,
          blockeditorsettings
        }
      ) })
    );
  });
}



(window.wp = window.wp || {}).customizewidgets = __webpack_exports__;
/******/ })()
;





