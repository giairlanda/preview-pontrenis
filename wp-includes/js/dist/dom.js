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
  __unstablestriphtml: () => (/* reexport */ striphtml),
  computecaretrect: () => (/* reexport */ computecaretrect),
  documenthasselection: () => (/* reexport */ documenthasselection),
  documenthastextselection: () => (/* reexport */ documenthastextselection),
  documenthasuncollapsedselection: () => (/* reexport */ documenthasuncollapsedselection),
  focus: () => (/* binding */ build_module_focus),
  getfilesfromdatatransfer: () => (/* reexport */ getfilesfromdatatransfer),
  getoffsetparent: () => (/* reexport */ getoffsetparent),
  getphrasingcontentschema: () => (/* reexport */ getphrasingcontentschema),
  getrectanglefromrange: () => (/* reexport */ getrectanglefromrange),
  getscrollcontainer: () => (/* reexport */ getscrollcontainer),
  insertafter: () => (/* reexport */ insertafter),
  isempty: () => (/* reexport */ isempty),
  isentirelyselected: () => (/* reexport */ isentirelyselected),
  isformelement: () => (/* reexport */ isformelement),
  ishorizontaledge: () => (/* reexport */ ishorizontaledge),
  isnumberinput: () => (/* reexport */ isnumberinput),
  isphrasingcontent: () => (/* reexport */ isphrasingcontent),
  isrtl: () => (/* reexport */ isrtl),
  isselectionforward: () => (/* reexport */ isselectionforward),
  istextcontent: () => (/* reexport */ istextcontent),
  istextfield: () => (/* reexport */ istextfield),
  isverticaledge: () => (/* reexport */ isverticaledge),
  placecaretathorizontaledge: () => (/* reexport */ placecaretathorizontaledge),
  placecaretatverticaledge: () => (/* reexport */ placecaretatverticaledge),
  remove: () => (/* reexport */ remove),
  removeinvalidhtml: () => (/* reexport */ removeinvalidhtml),
  replace: () => (/* reexport */ replace),
  replacetag: () => (/* reexport */ replacetag),
  safehtml: () => (/* reexport */ safehtml),
  unwrap: () => (/* reexport */ unwrap),
  wrap: () => (/* reexport */ wrap)
});

// namespace object: ./node_modules/@wordpress/dom/build-module/focusable.js
var focusable_namespaceobject = {};
__webpack_require__.r(focusable_namespaceobject);
__webpack_require__.d(focusable_namespaceobject, {
  find: () => (find)
});

// namespace object: ./node_modules/@wordpress/dom/build-module/tabbable.js
var tabbable_namespaceobject = {};
__webpack_require__.r(tabbable_namespaceobject);
__webpack_require__.d(tabbable_namespaceobject, {
  find: () => (tabbable_find),
  findnext: () => (findnext),
  findprevious: () => (findprevious),
  istabbableindex: () => (istabbableindex)
});

;// ./node_modules/@wordpress/dom/build-module/focusable.js
function buildselector(sequential) {
  return [
    sequential ? '[tabindex]:not([tabindex^="-"])' : "[tabindex]",
    "a[href]",
    "button:not([disabled])",
    'input:not([type="hidden"]):not([disabled])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    'iframe:not([tabindex^="-"])',
    "object",
    "embed",
    "summary",
    "area[href]",
    "[contenteditable]:not([contenteditable=false])"
  ].join(",");
}
function isvisible(element) {
  return element.offsetwidth > 0 || element.offsetheight > 0 || element.getclientrects().length > 0;
}
function isvalidfocusablearea(element) {
  const map = element.closest("map[name]");
  if (!map) {
    return false;
  }
  const img = element.ownerdocument.queryselector(
    'img[usemap="#' + map.name + '"]'
  );
  return !!img && isvisible(img);
}
function find(context, { sequential = false } = {}) {
  const elements = context.queryselectorall(buildselector(sequential));
  return array.from(elements).filter((element) => {
    if (!isvisible(element)) {
      return false;
    }
    const { nodename } = element;
    if ("area" === nodename) {
      return isvalidfocusablearea(
        /** @type {htmlareaelement} */
        element
      );
    }
    return true;
  });
}


;// ./node_modules/@wordpress/dom/build-module/tabbable.js

function gettabindex(element) {
  const tabindex = element.getattribute("tabindex");
  return tabindex === null ? 0 : parseint(tabindex, 10);
}
function istabbableindex(element) {
  return gettabindex(element) !== -1;
}
function createstatefulcollapseradiogroup() {
  const chosen_radio_by_name = {};
  return function collapseradiogroup(result, element) {
    const { nodename, type, checked, name } = element;
    if (nodename !== "input" || type !== "radio" || !name) {
      return result.concat(element);
    }
    const haschosen = chosen_radio_by_name.hasownproperty(name);
    const ischosen = checked || !haschosen;
    if (!ischosen) {
      return result;
    }
    if (haschosen) {
      const hadchosenelement = chosen_radio_by_name[name];
      result = result.filter((e) => e !== hadchosenelement);
    }
    chosen_radio_by_name[name] = element;
    return result.concat(element);
  };
}
function mapelementtoobjecttabbable(element, index) {
  return { element, index };
}
function mapobjecttabbabletoelement(object) {
  return object.element;
}
function compareobjecttabbables(a, b) {
  const atabindex = gettabindex(a.element);
  const btabindex = gettabindex(b.element);
  if (atabindex === btabindex) {
    return a.index - b.index;
  }
  return atabindex - btabindex;
}
function filtertabbable(focusables) {
  return focusables.filter(istabbableindex).map(mapelementtoobjecttabbable).sort(compareobjecttabbables).map(mapobjecttabbabletoelement).reduce(createstatefulcollapseradiogroup(), []);
}
function tabbable_find(context) {
  return filtertabbable(find(context));
}
function findprevious(element) {
  return filtertabbable(find(element.ownerdocument.body)).reverse().find(
    (focusable) => (
      // eslint-disable-next-line no-bitwise
      element.comparedocumentposition(focusable) & element.document_position_preceding
    )
  );
}
function findnext(element) {
  return filtertabbable(find(element.ownerdocument.body)).find(
    (focusable) => (
      // eslint-disable-next-line no-bitwise
      element.comparedocumentposition(focusable) & element.document_position_following
    )
  );
}


;// ./node_modules/@wordpress/dom/build-module/utils/assert-is-defined.js
function assertisdefined(val, name) {
  if (false) {}
}


;// ./node_modules/@wordpress/dom/build-module/dom/get-rectangle-from-range.js

function getrectanglefromrange(range) {
  if (!range.collapsed) {
    const rects2 = array.from(range.getclientrects());
    if (rects2.length === 1) {
      return rects2[0];
    }
    const filteredrects = rects2.filter(({ width }) => width > 1);
    if (filteredrects.length === 0) {
      return range.getboundingclientrect();
    }
    if (filteredrects.length === 1) {
      return filteredrects[0];
    }
    let {
      top: furthesttop,
      bottom: furthestbottom,
      left: furthestleft,
      right: furthestright
    } = filteredrects[0];
    for (const { top, bottom, left, right } of filteredrects) {
      if (top < furthesttop) {
        furthesttop = top;
      }
      if (bottom > furthestbottom) {
        furthestbottom = bottom;
      }
      if (left < furthestleft) {
        furthestleft = left;
      }
      if (right > furthestright) {
        furthestright = right;
      }
    }
    return new window.domrect(
      furthestleft,
      furthesttop,
      furthestright - furthestleft,
      furthestbottom - furthesttop
    );
  }
  const { startcontainer } = range;
  const { ownerdocument } = startcontainer;
  if (startcontainer.nodename === "br") {
    const { parentnode } = startcontainer;
    assertisdefined(parentnode, "parentnode");
    const index = (
      /** @type {node[]} */
      array.from(parentnode.childnodes).indexof(startcontainer)
    );
    assertisdefined(ownerdocument, "ownerdocument");
    range = ownerdocument.createrange();
    range.setstart(parentnode, index);
    range.setend(parentnode, index);
  }
  const rects = range.getclientrects();
  if (rects.length > 1) {
    return null;
  }
  let rect = rects[0];
  if (!rect || rect.height === 0) {
    assertisdefined(ownerdocument, "ownerdocument");
    const padnode = ownerdocument.createtextnode("\u200b");
    range = range.clonerange();
    range.insertnode(padnode);
    rect = range.getclientrects()[0];
    assertisdefined(padnode.parentnode, "padnode.parentnode");
    padnode.parentnode.removechild(padnode);
  }
  return rect;
}


;// ./node_modules/@wordpress/dom/build-module/dom/compute-caret-rect.js


function computecaretrect(win) {
  const selection = win.getselection();
  assertisdefined(selection, "selection");
  const range = selection.rangecount ? selection.getrangeat(0) : null;
  if (!range) {
    return null;
  }
  return getrectanglefromrange(range);
}


;// ./node_modules/@wordpress/dom/build-module/dom/document-has-text-selection.js

function documenthastextselection(doc) {
  assertisdefined(doc.defaultview, "doc.defaultview");
  const selection = doc.defaultview.getselection();
  assertisdefined(selection, "selection");
  const range = selection.rangecount ? selection.getrangeat(0) : null;
  return !!range && !range.collapsed;
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-html-input-element.js
function ishtmlinputelement(node) {
  return node?.nodename === "input";
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-text-field.js

function istextfield(node) {
  const nontextinputs = [
    "button",
    "checkbox",
    "hidden",
    "file",
    "radio",
    "image",
    "range",
    "reset",
    "submit",
    "number",
    "email",
    "time"
  ];
  return ishtmlinputelement(node) && node.type && !nontextinputs.includes(node.type) || node.nodename === "textarea" || /** @type {htmlelement} */
  node.contenteditable === "true";
}


;// ./node_modules/@wordpress/dom/build-module/dom/input-field-has-uncollapsed-selection.js


function inputfieldhasuncollapsedselection(element) {
  if (!ishtmlinputelement(element) && !istextfield(element)) {
    return false;
  }
  try {
    const { selectionstart, selectionend } = (
      /** @type {htmlinputelement | htmltextareaelement} */
      element
    );
    return (
      // `null` means the input type doesn't implement selection, thus we
      // cannot determine whether the selection is collapsed, so we
      // default to true.
      selectionstart === null || // when not null, compare the two points
      selectionstart !== selectionend
    );
  } catch (error) {
    return true;
  }
}


;// ./node_modules/@wordpress/dom/build-module/dom/document-has-uncollapsed-selection.js


function documenthasuncollapsedselection(doc) {
  return documenthastextselection(doc) || !!doc.activeelement && inputfieldhasuncollapsedselection(doc.activeelement);
}


;// ./node_modules/@wordpress/dom/build-module/dom/document-has-selection.js



function documenthasselection(doc) {
  return !!doc.activeelement && (ishtmlinputelement(doc.activeelement) || istextfield(doc.activeelement) || documenthastextselection(doc));
}


;// ./node_modules/@wordpress/dom/build-module/dom/get-computed-style.js

function getcomputedstyle(element) {
  assertisdefined(
    element.ownerdocument.defaultview,
    "element.ownerdocument.defaultview"
  );
  return element.ownerdocument.defaultview.getcomputedstyle(element);
}


;// ./node_modules/@wordpress/dom/build-module/dom/get-scroll-container.js

function getscrollcontainer(node, direction = "vertical") {
  if (!node) {
    return void 0;
  }
  if (direction === "vertical" || direction === "all") {
    if (node.scrollheight > node.clientheight) {
      const { overflowy } = getcomputedstyle(node);
      if (/(auto|scroll)/.test(overflowy)) {
        return node;
      }
    }
  }
  if (direction === "horizontal" || direction === "all") {
    if (node.scrollwidth > node.clientwidth) {
      const { overflowx } = getcomputedstyle(node);
      if (/(auto|scroll)/.test(overflowx)) {
        return node;
      }
    }
  }
  if (node.ownerdocument === node.parentnode) {
    return node;
  }
  return getscrollcontainer(
    /** @type {element} */
    node.parentnode,
    direction
  );
}


;// ./node_modules/@wordpress/dom/build-module/dom/get-offset-parent.js

function getoffsetparent(node) {
  let closestelement;
  while (closestelement = /** @type {node} */
  node.parentnode) {
    if (closestelement.nodetype === closestelement.element_node) {
      break;
    }
  }
  if (!closestelement) {
    return null;
  }
  if (getcomputedstyle(
    /** @type {element} */
    closestelement
  ).position !== "static") {
    return closestelement;
  }
  return (
    /** @type {node & { offsetparent: node }} */
    closestelement.offsetparent
  );
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-input-or-text-area.js
function isinputortextarea(element) {
  return element.tagname === "input" || element.tagname === "textarea";
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-entirely-selected.js


function isentirelyselected(element) {
  if (isinputortextarea(element)) {
    return element.selectionstart === 0 && element.value.length === element.selectionend;
  }
  if (!element.iscontenteditable) {
    return true;
  }
  const { ownerdocument } = element;
  const { defaultview } = ownerdocument;
  assertisdefined(defaultview, "defaultview");
  const selection = defaultview.getselection();
  assertisdefined(selection, "selection");
  const range = selection.rangecount ? selection.getrangeat(0) : null;
  if (!range) {
    return true;
  }
  const { startcontainer, endcontainer, startoffset, endoffset } = range;
  if (startcontainer === element && endcontainer === element && startoffset === 0 && endoffset === element.childnodes.length) {
    return true;
  }
  const lastchild = element.lastchild;
  assertisdefined(lastchild, "lastchild");
  const endcontainercontentlength = endcontainer.nodetype === endcontainer.text_node ? (
    /** @type {text} */
    endcontainer.data.length
  ) : endcontainer.childnodes.length;
  return isdeepchild(startcontainer, element, "firstchild") && isdeepchild(endcontainer, element, "lastchild") && startoffset === 0 && endoffset === endcontainercontentlength;
}
function isdeepchild(query, container, propname) {
  let candidate = container;
  do {
    if (query === candidate) {
      return true;
    }
    candidate = candidate[propname];
  } while (candidate);
  return false;
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-form-element.js

function isformelement(element) {
  if (!element) {
    return false;
  }
  const { tagname } = element;
  const checkforinputtextarea = isinputortextarea(element);
  return checkforinputtextarea || tagname === "button" || tagname === "select";
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-rtl.js

function isrtl(element) {
  return getcomputedstyle(element).direction === "rtl";
}


;// ./node_modules/@wordpress/dom/build-module/dom/get-range-height.js
function getrangeheight(range) {
  const rects = array.from(range.getclientrects());
  if (!rects.length) {
    return;
  }
  const highesttop = math.min(...rects.map(({ top }) => top));
  const lowestbottom = math.max(...rects.map(({ bottom }) => bottom));
  return lowestbottom - highesttop;
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-selection-forward.js

function isselectionforward(selection) {
  const { anchornode, focusnode, anchoroffset, focusoffset } = selection;
  assertisdefined(anchornode, "anchornode");
  assertisdefined(focusnode, "focusnode");
  const position = anchornode.comparedocumentposition(focusnode);
  if (position & anchornode.document_position_preceding) {
    return false;
  }
  if (position & anchornode.document_position_following) {
    return true;
  }
  if (position === 0) {
    return anchoroffset <= focusoffset;
  }
  return true;
}


;// ./node_modules/@wordpress/dom/build-module/dom/caret-range-from-point.js
function caretrangefrompoint(doc, x, y) {
  if (doc.caretrangefrompoint) {
    return doc.caretrangefrompoint(x, y);
  }
  if (!doc.caretpositionfrompoint) {
    return null;
  }
  const point = doc.caretpositionfrompoint(x, y);
  if (!point) {
    return null;
  }
  const range = doc.createrange();
  range.setstart(point.offsetnode, point.offset);
  range.collapse(true);
  return range;
}


;// ./node_modules/@wordpress/dom/build-module/dom/hidden-caret-range-from-point.js


function hiddencaretrangefrompoint(doc, x, y, container) {
  const originalzindex = container.style.zindex;
  const originalposition = container.style.position;
  const { position = "static" } = getcomputedstyle(container);
  if (position === "static") {
    container.style.position = "relative";
  }
  container.style.zindex = "10000";
  const range = caretrangefrompoint(doc, x, y);
  container.style.zindex = originalzindex;
  container.style.position = originalposition;
  return range;
}


;// ./node_modules/@wordpress/dom/build-module/dom/scroll-if-no-range.js
function scrollifnorange(container, aligntotop, callback) {
  let range = callback();
  if (!range || !range.startcontainer || !container.contains(range.startcontainer)) {
    container.scrollintoview(aligntotop);
    range = callback();
    if (!range || !range.startcontainer || !container.contains(range.startcontainer)) {
      return null;
    }
  }
  return range;
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-edge.js








function isedge(container, isreverse, onlyvertical = false) {
  if (isinputortextarea(container) && typeof container.selectionstart === "number") {
    if (container.selectionstart !== container.selectionend) {
      return false;
    }
    if (isreverse) {
      return container.selectionstart === 0;
    }
    return container.value.length === container.selectionstart;
  }
  if (!container.iscontenteditable) {
    return true;
  }
  const { ownerdocument } = container;
  const { defaultview } = ownerdocument;
  assertisdefined(defaultview, "defaultview");
  const selection = defaultview.getselection();
  if (!selection || !selection.rangecount) {
    return false;
  }
  const range = selection.getrangeat(0);
  const collapsedrange = range.clonerange();
  const isforward = isselectionforward(selection);
  const iscollapsed = selection.iscollapsed;
  if (!iscollapsed) {
    collapsedrange.collapse(!isforward);
  }
  const collapsedrangerect = getrectanglefromrange(collapsedrange);
  const rangerect = getrectanglefromrange(range);
  if (!collapsedrangerect || !rangerect) {
    return false;
  }
  const rangeheight = getrangeheight(range);
  if (!iscollapsed && rangeheight && rangeheight > collapsedrangerect.height && isforward === isreverse) {
    return false;
  }
  const isreversedir = isrtl(container) ? !isreverse : isreverse;
  const containerrect = container.getboundingclientrect();
  const x = isreversedir ? containerrect.left + 1 : containerrect.right - 1;
  const y = isreverse ? containerrect.top + 1 : containerrect.bottom - 1;
  const testrange = scrollifnorange(
    container,
    isreverse,
    () => hiddencaretrangefrompoint(ownerdocument, x, y, container)
  );
  if (!testrange) {
    return false;
  }
  const testrect = getrectanglefromrange(testrange);
  if (!testrect) {
    return false;
  }
  const verticalside = isreverse ? "top" : "bottom";
  const horizontalside = isreversedir ? "left" : "right";
  const verticaldiff = testrect[verticalside] - rangerect[verticalside];
  const horizontaldiff = testrect[horizontalside] - collapsedrangerect[horizontalside];
  const hasverticaldiff = math.abs(verticaldiff) <= 1;
  const hashorizontaldiff = math.abs(horizontaldiff) <= 1;
  return onlyvertical ? hasverticaldiff : hasverticaldiff && hashorizontaldiff;
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-horizontal-edge.js

function ishorizontaledge(container, isreverse) {
  return isedge(container, isreverse);
}


;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// ./node_modules/@wordpress/dom/build-module/dom/is-number-input.js


function isnumberinput(node) {
  external_wp_deprecated_default()("wp.dom.isnumberinput", {
    since: "6.1",
    version: "6.5"
  });
  return ishtmlinputelement(node) && node.type === "number" && !isnan(node.valueasnumber);
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-vertical-edge.js

function isverticaledge(container, isreverse) {
  return isedge(container, isreverse, true);
}


;// ./node_modules/@wordpress/dom/build-module/dom/place-caret-at-edge.js





function getrange(container, isreverse, x) {
  const { ownerdocument } = container;
  const isreversedir = isrtl(container) ? !isreverse : isreverse;
  const containerrect = container.getboundingclientrect();
  if (x === void 0) {
    x = isreverse ? containerrect.right - 1 : containerrect.left + 1;
  } else if (x <= containerrect.left) {
    x = containerrect.left + 1;
  } else if (x >= containerrect.right) {
    x = containerrect.right - 1;
  }
  const y = isreversedir ? containerrect.bottom - 1 : containerrect.top + 1;
  return hiddencaretrangefrompoint(ownerdocument, x, y, container);
}
function placecaretatedge(container, isreverse, x) {
  if (!container) {
    return;
  }
  container.focus();
  if (isinputortextarea(container)) {
    if (typeof container.selectionstart !== "number") {
      return;
    }
    if (isreverse) {
      container.selectionstart = container.value.length;
      container.selectionend = container.value.length;
    } else {
      container.selectionstart = 0;
      container.selectionend = 0;
    }
    return;
  }
  if (!container.iscontenteditable) {
    return;
  }
  const range = scrollifnorange(
    container,
    isreverse,
    () => getrange(container, isreverse, x)
  );
  if (!range) {
    return;
  }
  const { ownerdocument } = container;
  const { defaultview } = ownerdocument;
  assertisdefined(defaultview, "defaultview");
  const selection = defaultview.getselection();
  assertisdefined(selection, "selection");
  selection.removeallranges();
  selection.addrange(range);
}


;// ./node_modules/@wordpress/dom/build-module/dom/place-caret-at-horizontal-edge.js

function placecaretathorizontaledge(container, isreverse) {
  return placecaretatedge(container, isreverse, void 0);
}


;// ./node_modules/@wordpress/dom/build-module/dom/place-caret-at-vertical-edge.js

function placecaretatverticaledge(container, isreverse, rect) {
  return placecaretatedge(container, isreverse, rect?.left);
}


;// ./node_modules/@wordpress/dom/build-module/dom/insert-after.js

function insertafter(newnode, referencenode) {
  assertisdefined(referencenode.parentnode, "referencenode.parentnode");
  referencenode.parentnode.insertbefore(newnode, referencenode.nextsibling);
}


;// ./node_modules/@wordpress/dom/build-module/dom/remove.js

function remove(node) {
  assertisdefined(node.parentnode, "node.parentnode");
  node.parentnode.removechild(node);
}


;// ./node_modules/@wordpress/dom/build-module/dom/replace.js



function replace(processednode, newnode) {
  assertisdefined(processednode.parentnode, "processednode.parentnode");
  insertafter(newnode, processednode.parentnode);
  remove(processednode);
}


;// ./node_modules/@wordpress/dom/build-module/dom/unwrap.js

function unwrap(node) {
  const parent = node.parentnode;
  assertisdefined(parent, "node.parentnode");
  while (node.firstchild) {
    parent.insertbefore(node.firstchild, node);
  }
  parent.removechild(node);
}


;// ./node_modules/@wordpress/dom/build-module/dom/replace-tag.js

function replacetag(node, tagname) {
  const newnode = node.ownerdocument.createelement(tagname);
  while (node.firstchild) {
    newnode.appendchild(node.firstchild);
  }
  assertisdefined(node.parentnode, "node.parentnode");
  node.parentnode.replacechild(newnode, node);
  return newnode;
}


;// ./node_modules/@wordpress/dom/build-module/dom/wrap.js

function wrap(newnode, referencenode) {
  assertisdefined(referencenode.parentnode, "referencenode.parentnode");
  referencenode.parentnode.insertbefore(newnode, referencenode);
  newnode.appendchild(referencenode);
}


;// ./node_modules/@wordpress/dom/build-module/dom/safe-html.js

function safehtml(html) {
  const { body } = document.implementation.createhtmldocument("");
  body.innerhtml = html;
  const elements = body.getelementsbytagname("*");
  let elementindex = elements.length;
  while (elementindex--) {
    const element = elements[elementindex];
    if (element.tagname === "script") {
      remove(element);
    } else {
      let attributeindex = element.attributes.length;
      while (attributeindex--) {
        const { name: key } = element.attributes[attributeindex];
        if (key.startswith("on")) {
          element.removeattribute(key);
        }
      }
    }
  }
  return body.innerhtml;
}


;// ./node_modules/@wordpress/dom/build-module/dom/strip-html.js

function striphtml(html) {
  html = safehtml(html);
  const doc = document.implementation.createhtmldocument("");
  doc.body.innerhtml = html;
  return doc.body.textcontent || "";
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-empty.js
function isempty(element) {
  switch (element.nodetype) {
    case element.text_node:
      return /^[ \f\n\r\t\v\u00a0]*$/.test(element.nodevalue || "");
    case element.element_node:
      if (element.hasattributes()) {
        return false;
      } else if (!element.haschildnodes()) {
        return true;
      }
      return (
        /** @type {element[]} */
        array.from(element.childnodes).every(isempty)
      );
    default:
      return true;
  }
}


;// ./node_modules/@wordpress/dom/build-module/phrasing-content.js
const textcontentschema = {
  strong: {},
  em: {},
  s: {},
  del: {},
  ins: {},
  a: { attributes: ["href", "target", "rel", "id"] },
  code: {},
  abbr: { attributes: ["title"] },
  sub: {},
  sup: {},
  br: {},
  small: {},
  // to do: fix blockquote.
  // cite: {},
  q: { attributes: ["cite"] },
  dfn: { attributes: ["title"] },
  data: { attributes: ["value"] },
  time: { attributes: ["datetime"] },
  var: {},
  samp: {},
  kbd: {},
  i: {},
  b: {},
  u: {},
  mark: {},
  ruby: {},
  rt: {},
  rp: {},
  bdi: { attributes: ["dir"] },
  bdo: { attributes: ["dir"] },
  wbr: {},
  "#text": {}
};
const excludedelements = ["#text", "br"];
object.keys(textcontentschema).filter((element) => !excludedelements.includes(element)).foreach((tag) => {
  const { [tag]: removedtag, ...restschema } = textcontentschema;
  textcontentschema[tag].children = restschema;
});
const embeddedcontentschema = {
  audio: {
    attributes: [
      "src",
      "preload",
      "autoplay",
      "mediagroup",
      "loop",
      "muted"
    ]
  },
  canvas: { attributes: ["width", "height"] },
  embed: { attributes: ["src", "type", "width", "height"] },
  img: {
    attributes: [
      "alt",
      "src",
      "srcset",
      "usemap",
      "ismap",
      "width",
      "height"
    ]
  },
  object: {
    attributes: [
      "data",
      "type",
      "name",
      "usemap",
      "form",
      "width",
      "height"
    ]
  },
  video: {
    attributes: [
      "src",
      "poster",
      "preload",
      "playsinline",
      "autoplay",
      "mediagroup",
      "loop",
      "muted",
      "controls",
      "width",
      "height"
    ]
  },
  math: {
    attributes: ["display", "xmlns"],
    children: "*"
  }
};
const phrasingcontentschema = {
  ...textcontentschema,
  ...embeddedcontentschema
};
function getphrasingcontentschema(context) {
  if (context !== "paste") {
    return phrasingcontentschema;
  }
  const {
    u,
    // used to mark misspelling. shouldn't be pasted.
    abbr,
    // invisible.
    data,
    // invisible.
    time,
    // invisible.
    wbr,
    // invisible.
    bdi,
    // invisible.
    bdo,
    // invisible.
    ...remainingcontentschema
  } = {
    ...phrasingcontentschema,
    // we shouldn't paste potentially sensitive information which is not
    // visible to the user when pasted, so strip the attributes.
    ins: { children: phrasingcontentschema.ins.children },
    del: { children: phrasingcontentschema.del.children }
  };
  return remainingcontentschema;
}
function isphrasingcontent(node) {
  const tag = node.nodename.tolowercase();
  return getphrasingcontentschema().hasownproperty(tag) || tag === "span";
}
function istextcontent(node) {
  const tag = node.nodename.tolowercase();
  return textcontentschema.hasownproperty(tag) || tag === "span";
}


;// ./node_modules/@wordpress/dom/build-module/dom/is-element.js
function iselement(node) {
  return !!node && node.nodetype === node.element_node;
}


;// ./node_modules/@wordpress/dom/build-module/dom/clean-node-list.js






const noop = () => {
};
function cleannodelist(nodelist, doc, schema, inline) {
  array.from(nodelist).foreach(
    (node) => {
      const tag = node.nodename.tolowercase();
      if (schema.hasownproperty(tag) && (!schema[tag].ismatch || schema[tag].ismatch?.(node))) {
        if (iselement(node)) {
          const {
            attributes = [],
            classes = [],
            children,
            require: require2 = [],
            allowempty
          } = schema[tag];
          if (children && !allowempty && isempty(node)) {
            remove(node);
            return;
          }
          if (node.hasattributes()) {
            array.from(node.attributes).foreach(({ name }) => {
              if (name !== "class" && !attributes.includes(name)) {
                node.removeattribute(name);
              }
            });
            if (node.classlist && node.classlist.length) {
              const mattchers = classes.map((item) => {
                if (item === "*") {
                  return () => true;
                } else if (typeof item === "string") {
                  return (classname) => classname === item;
                } else if (item instanceof regexp) {
                  return (classname) => item.test(classname);
                }
                return noop;
              });
              array.from(node.classlist).foreach((name) => {
                if (!mattchers.some(
                  (ismatch) => ismatch(name)
                )) {
                  node.classlist.remove(name);
                }
              });
              if (!node.classlist.length) {
                node.removeattribute("class");
              }
            }
          }
          if (node.haschildnodes()) {
            if (children === "*") {
              return;
            }
            if (children) {
              if (require2.length && !node.queryselector(require2.join(","))) {
                cleannodelist(
                  node.childnodes,
                  doc,
                  schema,
                  inline
                );
                unwrap(node);
              } else if (node.parentnode && node.parentnode.nodename === "body" && isphrasingcontent(node)) {
                cleannodelist(
                  node.childnodes,
                  doc,
                  schema,
                  inline
                );
                if (array.from(node.childnodes).some(
                  (child) => !isphrasingcontent(child)
                )) {
                  unwrap(node);
                }
              } else {
                cleannodelist(
                  node.childnodes,
                  doc,
                  children,
                  inline
                );
              }
            } else {
              while (node.firstchild) {
                remove(node.firstchild);
              }
            }
          }
        }
      } else {
        cleannodelist(node.childnodes, doc, schema, inline);
        if (inline && !isphrasingcontent(node) && node.nextelementsibling) {
          insertafter(doc.createelement("br"), node);
        }
        unwrap(node);
      }
    }
  );
}


;// ./node_modules/@wordpress/dom/build-module/dom/remove-invalid-html.js

function removeinvalidhtml(html, schema, inline) {
  const doc = document.implementation.createhtmldocument("");
  doc.body.innerhtml = html;
  cleannodelist(doc.body.childnodes, doc, schema, inline);
  return doc.body.innerhtml;
}


;// ./node_modules/@wordpress/dom/build-module/dom/index.js





























;// ./node_modules/@wordpress/dom/build-module/data-transfer.js
function getfilesfromdatatransfer(datatransfer) {
  const files = array.from(datatransfer.files);
  array.from(datatransfer.items).foreach((item) => {
    const file = item.getasfile();
    if (file && !files.find(
      ({ name, type, size }) => name === file.name && type === file.type && size === file.size
    )) {
      files.push(file);
    }
  });
  return files;
}


;// ./node_modules/@wordpress/dom/build-module/index.js


const build_module_focus = { focusable: focusable_namespaceobject, tabbable: tabbable_namespaceobject };





(window.wp = window.wp || {}).dom = __webpack_exports__;
/******/ })()
;







