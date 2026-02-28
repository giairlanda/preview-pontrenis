/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 1233:
/***/ ((module) => {

module.exports = window["wp"]["preferences"];

/***/ }),

/***/ 6087:
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ 7143:
/***/ ((module) => {

module.exports = window["wp"]["data"];

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
  loadview: () => (/* reexport */ loadview),
  useview: () => (/* reexport */ useview)
});

;// ./node_modules/dequal/dist/index.mjs
var has = object.prototype.hasownproperty;

function find(iter, tar, key) {
	for (key of iter.keys()) {
		if (dequal(key, tar)) return key;
	}
}

function dequal(foo, bar) {
	var ctor, len, tmp;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === date) return foo.gettime() === bar.gettime();
		if (ctor === regexp) return foo.tostring() === bar.tostring();

		if (ctor === array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (ctor === set) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}

		if (ctor === map) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!dequal(len[1], bar.get(tmp))) {
					return false;
				}
			}
			return true;
		}

		if (ctor === arraybuffer) {
			foo = new uint8array(foo);
			bar = new uint8array(bar);
		} else if (ctor === dataview) {
			if ((len=foo.bytelength) === bar.bytelength) {
				while (len-- && foo.getint8(len) === bar.getint8(len));
			}
			return len === -1;
		}

		if (arraybuffer.isview(foo)) {
			if ((len=foo.bytelength) === bar.bytelength) {
				while (len-- && foo[len] === bar[len]);
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}

;// ./node_modules/@wordpress/views/build-module/preference-keys.js
function generatepreferencekey(kind, name, slug) {
  return `dataviews-${kind}-${name}-${slug}`;
}


// external module: external ["wp","element"]
var external_wp_element_ = __webpack_require__(6087);
// external module: external ["wp","data"]
var external_wp_data_ = __webpack_require__(7143);
// external module: external ["wp","preferences"]
var external_wp_preferences_ = __webpack_require__(1233);
;// ./node_modules/@wordpress/views/build-module/use-view.js





function omit(obj, keys) {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
function useview(config) {
  const { kind, name, slug, defaultview, queryparams, onchangequeryparams } = config;
  const preferencekey = generatepreferencekey(kind, name, slug);
  const persistedview = (0,external_wp_data_.useselect)(
    (select) => {
      return select(external_wp_preferences_.store).get(
        "core/views",
        preferencekey
      );
    },
    [preferencekey]
  );
  const { set } = (0,external_wp_data_.usedispatch)(external_wp_preferences_.store);
  const baseview = persistedview ?? defaultview;
  const page = number(queryparams?.page ?? baseview.page ?? 1);
  const search = queryparams?.search ?? baseview.search ?? "";
  const view = (0,external_wp_element_.usememo)(() => {
    return {
      ...baseview,
      page,
      search
    };
  }, [baseview, page, search]);
  const ismodified = !!persistedview;
  const updateview = (0,external_wp_element_.usecallback)(
    (newview) => {
      const urlparams = {
        page: newview?.page,
        search: newview?.search
      };
      const preferenceview = omit(newview, ["page", "search"]);
      if (onchangequeryparams && !dequal(urlparams, { page, search })) {
        onchangequeryparams(urlparams);
      }
      if (!dequal(baseview, preferenceview)) {
        if (dequal(preferenceview, defaultview)) {
          set("core/views", preferencekey, void 0);
        } else {
          set("core/views", preferencekey, preferenceview);
        }
      }
    },
    [
      onchangequeryparams,
      page,
      search,
      baseview,
      defaultview,
      set,
      preferencekey
    ]
  );
  const resettodefault = (0,external_wp_element_.usecallback)(() => {
    set("core/views", preferencekey, void 0);
  }, [preferencekey, set]);
  return {
    view,
    ismodified,
    updateview,
    resettodefault
  };
}


;// ./node_modules/@wordpress/views/build-module/load-view.js



async function loadview(config) {
  const { kind, name, slug, defaultview, queryparams } = config;
  const preferencekey = generatepreferencekey(kind, name, slug);
  const persistedview = (0,external_wp_data_.select)(external_wp_preferences_.store).get(
    "core/views",
    preferencekey
  );
  const baseview = persistedview ?? defaultview;
  const page = queryparams?.page ?? 1;
  const search = queryparams?.search ?? "";
  return {
    ...baseview,
    page,
    search
  };
}


;// ./node_modules/@wordpress/views/build-module/index.js




(window.wp = window.wp || {}).views = __webpack_exports__;
/******/ })()
;


