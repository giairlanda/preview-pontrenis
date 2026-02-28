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
  store: () => (/* reexport */ store)
});

// namespace object: ./node_modules/@wordpress/annotations/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  __experimentalgetallannotationsforblock: () => (__experimentalgetallannotationsforblock),
  __experimentalgetannotations: () => (__experimentalgetannotations),
  __experimentalgetannotationsforblock: () => (__experimentalgetannotationsforblock),
  __experimentalgetannotationsforrichtext: () => (__experimentalgetannotationsforrichtext)
});

// namespace object: ./node_modules/@wordpress/annotations/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  __experimentaladdannotation: () => (__experimentaladdannotation),
  __experimentalremoveannotation: () => (__experimentalremoveannotation),
  __experimentalremoveannotationsbysource: () => (__experimentalremoveannotationsbysource),
  __experimentalupdateannotationrange: () => (__experimentalupdateannotationrange)
});

;// external ["wp","richtext"]
const external_wp_richtext_namespaceobject = window["wp"]["richtext"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// ./node_modules/@wordpress/annotations/build-module/store/constants.js
const store_name = "core/annotations";


;// ./node_modules/@wordpress/annotations/build-module/format/annotation.js


const format_name = "core/annotation";
const annotation_attribute_prefix = "annotation-text-";

function applyannotations(record, annotations = []) {
  annotations.foreach((annotation2) => {
    let { start, end } = annotation2;
    if (start > record.text.length) {
      start = record.text.length;
    }
    if (end > record.text.length) {
      end = record.text.length;
    }
    const classname = annotation_attribute_prefix + annotation2.source;
    const id = annotation_attribute_prefix + annotation2.id;
    record = (0,external_wp_richtext_namespaceobject.applyformat)(
      record,
      {
        type: format_name,
        attributes: {
          classname,
          id
        }
      },
      start,
      end
    );
  });
  return record;
}
function removeannotations(record) {
  return removeformat(record, "core/annotation", 0, record.text.length);
}
function retrieveannotationpositions(formats) {
  const positions = {};
  formats.foreach((characterformats, i) => {
    characterformats = characterformats || [];
    characterformats = characterformats.filter(
      (format) => format.type === format_name
    );
    characterformats.foreach((format) => {
      let { id } = format.attributes;
      id = id.replace(annotation_attribute_prefix, "");
      if (!positions.hasownproperty(id)) {
        positions[id] = {
          start: i
        };
      }
      positions[id].end = i + 1;
    });
  });
  return positions;
}
function updateannotationswithpositions(annotations, positions, { removeannotation, updateannotationrange }) {
  annotations.foreach((currentannotation) => {
    const position = positions[currentannotation.id];
    if (!position) {
      removeannotation(currentannotation.id);
      return;
    }
    const { start, end } = currentannotation;
    if (start !== position.start || end !== position.end) {
      updateannotationrange(
        currentannotation.id,
        position.start,
        position.end
      );
    }
  });
}
const annotation = {
  name: format_name,
  title: (0,external_wp_i18n_namespaceobject.__)("annotation"),
  tagname: "mark",
  classname: "annotation-text",
  attributes: {
    classname: "class",
    id: "id"
  },
  edit() {
    return null;
  },
  __experimentalgetpropsforeditabletreepreparation(select, { richtextidentifier, blockclientid }) {
    return {
      annotations: select(
        store_name
      ).__experimentalgetannotationsforrichtext(
        blockclientid,
        richtextidentifier
      )
    };
  },
  __experimentalcreateprepareeditabletree({ annotations }) {
    return (formats, text) => {
      if (annotations.length === 0) {
        return formats;
      }
      let record = { formats, text };
      record = applyannotations(record, annotations);
      return record.formats;
    };
  },
  __experimentalgetpropsforeditabletreechangehandler(dispatch) {
    return {
      removeannotation: dispatch(store_name).__experimentalremoveannotation,
      updateannotationrange: dispatch(store_name).__experimentalupdateannotationrange
    };
  },
  __experimentalcreateonchangeeditablevalue(props) {
    return (formats) => {
      const positions = retrieveannotationpositions(formats);
      const { removeannotation, updateannotationrange, annotations } = props;
      updateannotationswithpositions(annotations, positions, {
        removeannotation,
        updateannotationrange
      });
    };
  }
};


;// ./node_modules/@wordpress/annotations/build-module/format/index.js


const { name: format_name, ...settings } = annotation;
(0,external_wp_richtext_namespaceobject.registerformattype)(format_name, settings);

;// external ["wp","hooks"]
const external_wp_hooks_namespaceobject = window["wp"]["hooks"];
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// ./node_modules/@wordpress/annotations/build-module/block/index.js



const addannotationclassname = (originalcomponent) => {
  return (0,external_wp_data_namespaceobject.withselect)((select, { clientid, classname }) => {
    const annotations = select(store_name).__experimentalgetannotationsforblock(
      clientid
    );
    return {
      classname: annotations.map((annotation) => {
        return "is-annotated-by-" + annotation.source;
      }).concat(classname).filter(boolean).join(" ")
    };
  })(originalcomponent);
};
(0,external_wp_hooks_namespaceobject.addfilter)(
  "editor.blocklistblock",
  "core/annotations",
  addannotationclassname
);

;// ./node_modules/@wordpress/annotations/build-module/store/reducer.js
function filterwithreference(collection, predicate) {
  const filteredcollection = collection.filter(predicate);
  return collection.length === filteredcollection.length ? collection : filteredcollection;
}
const mapvalues = (obj, callback) => object.entries(obj).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: callback(value)
  }),
  {}
);
function isvalidannotationrange(annotation) {
  return typeof annotation.start === "number" && typeof annotation.end === "number" && annotation.start <= annotation.end;
}
function annotations(state = {}, action) {
  switch (action.type) {
    case "annotation_add":
      const blockclientid = action.blockclientid;
      const newannotation = {
        id: action.id,
        blockclientid,
        richtextidentifier: action.richtextidentifier,
        source: action.source,
        selector: action.selector,
        range: action.range
      };
      if (newannotation.selector === "range" && !isvalidannotationrange(newannotation.range)) {
        return state;
      }
      const previousannotationsforblock = state?.[blockclientid] ?? [];
      return {
        ...state,
        [blockclientid]: [
          ...previousannotationsforblock,
          newannotation
        ]
      };
    case "annotation_remove":
      return mapvalues(state, (annotationsforblock) => {
        return filterwithreference(
          annotationsforblock,
          (annotation) => {
            return annotation.id !== action.annotationid;
          }
        );
      });
    case "annotation_update_range":
      return mapvalues(state, (annotationsforblock) => {
        let haschangedrange = false;
        const newannotations = annotationsforblock.map(
          (annotation) => {
            if (annotation.id === action.annotationid) {
              haschangedrange = true;
              return {
                ...annotation,
                range: {
                  start: action.start,
                  end: action.end
                }
              };
            }
            return annotation;
          }
        );
        return haschangedrange ? newannotations : annotationsforblock;
      });
    case "annotation_remove_source":
      return mapvalues(state, (annotationsforblock) => {
        return filterwithreference(
          annotationsforblock,
          (annotation) => {
            return annotation.source !== action.source;
          }
        );
      });
  }
  return state;
}
var reducer_default = annotations;


;// ./node_modules/@wordpress/annotations/build-module/store/selectors.js

const empty_array = [];
const __experimentalgetannotationsforblock = (0,external_wp_data_namespaceobject.createselector)(
  (state, blockclientid) => {
    return (state?.[blockclientid] ?? []).filter((annotation) => {
      return annotation.selector === "block";
    });
  },
  (state, blockclientid) => [state?.[blockclientid] ?? empty_array]
);
function __experimentalgetallannotationsforblock(state, blockclientid) {
  return state?.[blockclientid] ?? empty_array;
}
const __experimentalgetannotationsforrichtext = (0,external_wp_data_namespaceobject.createselector)(
  (state, blockclientid, richtextidentifier) => {
    return (state?.[blockclientid] ?? []).filter((annotation) => {
      return annotation.selector === "range" && richtextidentifier === annotation.richtextidentifier;
    }).map((annotation) => {
      const { range, ...other } = annotation;
      return {
        ...range,
        ...other
      };
    });
  },
  (state, blockclientid) => [state?.[blockclientid] ?? empty_array]
);
function __experimentalgetannotations(state) {
  return object.values(state).flat();
}


;// ./node_modules/@wordpress/annotations/node_modules/uuid/dist/esm-browser/native.js
const randomuuid = typeof crypto !== 'undefined' && crypto.randomuuid && crypto.randomuuid.bind(crypto);
/* harmony default export */ const esm_browser_native = ({
  randomuuid
});
;// ./node_modules/@wordpress/annotations/node_modules/uuid/dist/esm-browser/rng.js
// unique id creation requires a high quality random # generator. in the browser we therefore
// require the crypto api and do not support built-in fallback to lower quality random number
// generators (like math.random()).
let getrandomvalues;
const rnds8 = new uint8array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getrandomvalues) {
    // getrandomvalues needs to be invoked in a context where "this" is a crypto implementation.
    getrandomvalues = typeof crypto !== 'undefined' && crypto.getrandomvalues && crypto.getrandomvalues.bind(crypto);

    if (!getrandomvalues) {
      throw new error('crypto.getrandomvalues() not supported. see https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getrandomvalues(rnds8);
}
;// ./node_modules/@wordpress/annotations/node_modules/uuid/dist/esm-browser/stringify.js

/**
 * convert array of 16 byte values to uuid string format of the form:
 * xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */

const bytetohex = [];

for (let i = 0; i < 256; ++i) {
  bytetohex.push((i + 0x100).tostring(16).slice(1));
}

function unsafestringify(arr, offset = 0) {
  // note: be careful editing this code!  it's been tuned for performance
  // and works in ways you may not expect. see https://github.com/uuidjs/uuid/pull/434
  return bytetohex[arr[offset + 0]] + bytetohex[arr[offset + 1]] + bytetohex[arr[offset + 2]] + bytetohex[arr[offset + 3]] + '-' + bytetohex[arr[offset + 4]] + bytetohex[arr[offset + 5]] + '-' + bytetohex[arr[offset + 6]] + bytetohex[arr[offset + 7]] + '-' + bytetohex[arr[offset + 8]] + bytetohex[arr[offset + 9]] + '-' + bytetohex[arr[offset + 10]] + bytetohex[arr[offset + 11]] + bytetohex[arr[offset + 12]] + bytetohex[arr[offset + 13]] + bytetohex[arr[offset + 14]] + bytetohex[arr[offset + 15]];
}

function stringify(arr, offset = 0) {
  const uuid = unsafestringify(arr, offset); // consistency check for valid uuid.  if this throws, it's likely due to one
  // of the following:
  // - one or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - invalid input values for the rfc `version` or `variant` fields

  if (!validate(uuid)) {
    throw typeerror('stringified uuid is invalid');
  }

  return uuid;
}

/* harmony default export */ const esm_browser_stringify = ((/* unused pure expression or super */ null && (stringify)));
;// ./node_modules/@wordpress/annotations/node_modules/uuid/dist/esm-browser/v4.js




function v4(options, buf, offset) {
  if (esm_browser_native.randomuuid && !buf && !options) {
    return esm_browser_native.randomuuid();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafestringify(rnds);
}

/* harmony default export */ const esm_browser_v4 = (v4);
;// ./node_modules/@wordpress/annotations/build-module/store/actions.js

function __experimentaladdannotation({
  blockclientid,
  richtextidentifier = null,
  range = null,
  selector = "range",
  source = "default",
  id = esm_browser_v4()
}) {
  const action = {
    type: "annotation_add",
    id,
    blockclientid,
    richtextidentifier,
    source,
    selector
  };
  if (selector === "range") {
    action.range = range;
  }
  return action;
}
function __experimentalremoveannotation(annotationid) {
  return {
    type: "annotation_remove",
    annotationid
  };
}
function __experimentalupdateannotationrange(annotationid, start, end) {
  return {
    type: "annotation_update_range",
    annotationid,
    start,
    end
  };
}
function __experimentalremoveannotationsbysource(source) {
  return {
    type: "annotation_remove_source",
    source
  };
}


;// ./node_modules/@wordpress/annotations/build-module/store/index.js





const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  reducer: reducer_default,
  selectors: selectors_namespaceobject,
  actions: actions_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);


;// ./node_modules/@wordpress/annotations/build-module/index.js





(window.wp = window.wp || {}).annotations = __webpack_exports__;
/******/ })()
;




