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
  pluginarea: () => (/* reexport */ plugin_area_default),
  getplugin: () => (/* reexport */ getplugin),
  getplugins: () => (/* reexport */ getplugins),
  registerplugin: () => (/* reexport */ registerplugin),
  unregisterplugin: () => (/* reexport */ unregisterplugin),
  useplugincontext: () => (/* reexport */ useplugincontext),
  withplugincontext: () => (/* reexport */ withplugincontext)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
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



;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","hooks"]
const external_wp_hooks_namespaceobject = window["wp"]["hooks"];
;// external ["wp","isshallowequal"]
const external_wp_isshallowequal_namespaceobject = window["wp"]["isshallowequal"];
var external_wp_isshallowequal_default = /*#__pure__*/__webpack_require__.n(external_wp_isshallowequal_namespaceobject);
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// ./node_modules/@wordpress/plugins/build-module/components/plugin-context/index.js




const context = (0,external_wp_element_namespaceobject.createcontext)({
  name: null,
  icon: null
});
context.displayname = "plugincontext";
const plugincontextprovider = context.provider;
function useplugincontext() {
  return (0,external_wp_element_namespaceobject.usecontext)(context);
}
const withplugincontext = (mapcontexttoprops) => (0,external_wp_compose_namespaceobject.createhigherordercomponent)((originalcomponent) => {
  external_wp_deprecated_default()("wp.plugins.withplugincontext", {
    since: "6.8.0",
    alternative: "wp.plugins.useplugincontext"
  });
  return (props) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(context.consumer, { children: (context) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    originalcomponent,
    {
      ...props,
      ...mapcontexttoprops(context, props)
    }
  ) });
}, "withplugincontext");


;// ./node_modules/@wordpress/plugins/build-module/components/plugin-error-boundary/index.js

class pluginerrorboundary extends external_wp_element_namespaceobject.component {
  constructor(props) {
    super(props);
    this.state = {
      haserror: false
    };
  }
  static getderivedstatefromerror() {
    return { haserror: true };
  }
  componentdidcatch(error) {
    const { name, onerror } = this.props;
    if (onerror) {
      onerror(name, error);
    }
  }
  render() {
    if (!this.state.haserror) {
      return this.props.children;
    }
    return null;
  }
}


;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/plugins.js


var plugins_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m10.5 4v4h3v4h15v4h1.5a1 1 0 011 1v4l-3 4v2a1 1 0 01-1 1h-3a1 1 0 01-1-1v-2l-3-4v9a1 1 0 011-1h9v4h1.5zm.5 12.5v2h2v-2l3-4v-3h8v3l3 4z" }) });


;// ./node_modules/@wordpress/plugins/build-module/api/index.js


const plugins = {};
function registerplugin(name, settings) {
  if (typeof settings !== "object") {
    console.error("no settings object provided!");
    return null;
  }
  if (typeof name !== "string") {
    console.error("plugin name must be string.");
    return null;
  }
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    console.error(
      'plugin name must include only lowercase alphanumeric characters or dashes, and start with a letter. example: "my-plugin".'
    );
    return null;
  }
  if (plugins[name]) {
    console.error(`plugin "${name}" is already registered.`);
  }
  settings = (0,external_wp_hooks_namespaceobject.applyfilters)(
    "plugins.registerplugin",
    settings,
    name
  );
  const { render, scope } = settings;
  if (typeof render !== "function") {
    console.error(
      'the "render" property must be specified and must be a valid function.'
    );
    return null;
  }
  if (scope) {
    if (typeof scope !== "string") {
      console.error("plugin scope must be string.");
      return null;
    }
    if (!/^[a-z][a-z0-9-]*$/.test(scope)) {
      console.error(
        'plugin scope must include only lowercase alphanumeric characters or dashes, and start with a letter. example: "my-page".'
      );
      return null;
    }
  }
  plugins[name] = {
    name,
    icon: plugins_default,
    ...settings
  };
  (0,external_wp_hooks_namespaceobject.doaction)("plugins.pluginregistered", settings, name);
  return settings;
}
function unregisterplugin(name) {
  if (!plugins[name]) {
    console.error('plugin "' + name + '" is not registered.');
    return;
  }
  const oldplugin = plugins[name];
  delete plugins[name];
  (0,external_wp_hooks_namespaceobject.doaction)("plugins.pluginunregistered", oldplugin, name);
  return oldplugin;
}
function getplugin(name) {
  return plugins[name];
}
function getplugins(scope) {
  return object.values(plugins).filter(
    (plugin) => plugin.scope === scope
  );
}


;// ./node_modules/@wordpress/plugins/build-module/components/plugin-area/index.js








const getplugincontext = memize(
  (icon, name) => ({
    icon,
    name
  })
);
function pluginarea({
  scope,
  onerror
}) {
  const store = (0,external_wp_element_namespaceobject.usememo)(() => {
    let lastvalue = [];
    return {
      subscribe(listener) {
        (0,external_wp_hooks_namespaceobject.addaction)(
          "plugins.pluginregistered",
          "core/plugins/plugin-area/plugins-registered",
          listener
        );
        (0,external_wp_hooks_namespaceobject.addaction)(
          "plugins.pluginunregistered",
          "core/plugins/plugin-area/plugins-unregistered",
          listener
        );
        return () => {
          (0,external_wp_hooks_namespaceobject.removeaction)(
            "plugins.pluginregistered",
            "core/plugins/plugin-area/plugins-registered"
          );
          (0,external_wp_hooks_namespaceobject.removeaction)(
            "plugins.pluginunregistered",
            "core/plugins/plugin-area/plugins-unregistered"
          );
        };
      },
      getvalue() {
        const nextvalue = getplugins(scope);
        if (!external_wp_isshallowequal_default()(lastvalue, nextvalue)) {
          lastvalue = nextvalue;
        }
        return lastvalue;
      }
    };
  }, [scope]);
  const plugins = (0,external_wp_element_namespaceobject.usesyncexternalstore)(
    store.subscribe,
    store.getvalue,
    store.getvalue
  );
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { style: { display: "none" }, children: plugins.map(({ icon, name, render: plugin }) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    plugincontextprovider,
    {
      value: getplugincontext(icon, name),
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(pluginerrorboundary, { name, onerror, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(plugin, {}) })
    },
    name
  )) });
}
var plugin_area_default = pluginarea;


;// ./node_modules/@wordpress/plugins/build-module/components/index.js




;// ./node_modules/@wordpress/plugins/build-module/index.js



(window.wp = window.wp || {}).plugins = __webpack_exports__;
/******/ })()
;



