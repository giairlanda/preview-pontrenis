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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parse: () => (/* binding */ parse)
/* harmony export */ });
let document;
let offset;
let output;
let stack;
const tokenizer = /<!--\s+(\/)?wp:([a-z][a-z0-9_-]*\/)?([a-z][a-z0-9_-]*)\s+({(?:(?=([^}]+|}+(?=})|(?!}\s+\/?-->)[^])*)\5|[^]*?)}\s+)?(\/)?-->/g;
function block(blockname, attrs, innerblocks, innerhtml, innercontent) {
  return {
    blockname,
    attrs,
    innerblocks,
    innerhtml,
    innercontent
  };
}
function freeform(innerhtml) {
  return block(null, {}, [], innerhtml, [innerhtml]);
}
function frame(block, tokenstart, tokenlength, prevoffset, leadinghtmlstart) {
  return {
    block,
    tokenstart,
    tokenlength,
    prevoffset: prevoffset || tokenstart + tokenlength,
    leadinghtmlstart
  };
}
const parse = (doc) => {
  document = doc;
  offset = 0;
  output = [];
  stack = [];
  tokenizer.lastindex = 0;
  do {
  } while (proceed());
  return output;
};
function proceed() {
  const stackdepth = stack.length;
  const next = nexttoken();
  const [tokentype, blockname, attrs, startoffset, tokenlength] = next;
  const leadinghtmlstart = startoffset > offset ? offset : null;
  switch (tokentype) {
    case "no-more-tokens":
      if (0 === stackdepth) {
        addfreeform();
        return false;
      }
      if (1 === stackdepth) {
        addblockfromstack();
        return false;
      }
      while (0 < stack.length) {
        addblockfromstack();
      }
      return false;
    case "void-block":
      if (0 === stackdepth) {
        if (null !== leadinghtmlstart) {
          output.push(
            freeform(
              document.substr(
                leadinghtmlstart,
                startoffset - leadinghtmlstart
              )
            )
          );
        }
        output.push(block(blockname, attrs, [], "", []));
        offset = startoffset + tokenlength;
        return true;
      }
      addinnerblock(
        block(blockname, attrs, [], "", []),
        startoffset,
        tokenlength
      );
      offset = startoffset + tokenlength;
      return true;
    case "block-opener":
      stack.push(
        frame(
          block(blockname, attrs, [], "", []),
          startoffset,
          tokenlength,
          startoffset + tokenlength,
          leadinghtmlstart
        )
      );
      offset = startoffset + tokenlength;
      return true;
    case "block-closer":
      if (0 === stackdepth) {
        addfreeform();
        return false;
      }
      if (1 === stackdepth) {
        addblockfromstack(startoffset);
        offset = startoffset + tokenlength;
        return true;
      }
      const stacktop = stack.pop();
      const html = document.substr(
        stacktop.prevoffset,
        startoffset - stacktop.prevoffset
      );
      stacktop.block.innerhtml += html;
      stacktop.block.innercontent.push(html);
      stacktop.prevoffset = startoffset + tokenlength;
      addinnerblock(
        stacktop.block,
        stacktop.tokenstart,
        stacktop.tokenlength,
        startoffset + tokenlength
      );
      offset = startoffset + tokenlength;
      return true;
    default:
      addfreeform();
      return false;
  }
}
function parsejson(input) {
  try {
    return json.parse(input);
  } catch (e) {
    return null;
  }
}
function nexttoken() {
  const matches = tokenizer.exec(document);
  if (null === matches) {
    return ["no-more-tokens", "", null, 0, 0];
  }
  const startedat = matches.index;
  const [
    match,
    closermatch,
    namespacematch,
    namematch,
    attrsmatch,
    ,
    voidmatch
  ] = matches;
  const length = match.length;
  const iscloser = !!closermatch;
  const isvoid = !!voidmatch;
  const namespace = namespacematch || "core/";
  const name = namespace + namematch;
  const hasattrs = !!attrsmatch;
  const attrs = hasattrs ? parsejson(attrsmatch) : {};
  if (iscloser && (isvoid || hasattrs)) {
  }
  if (isvoid) {
    return ["void-block", name, attrs, startedat, length];
  }
  if (iscloser) {
    return ["block-closer", name, null, startedat, length];
  }
  return ["block-opener", name, attrs, startedat, length];
}
function addfreeform(rawlength) {
  const length = rawlength ? rawlength : document.length - offset;
  if (0 === length) {
    return;
  }
  output.push(freeform(document.substr(offset, length)));
}
function addinnerblock(block, tokenstart, tokenlength, lastoffset) {
  const parent = stack[stack.length - 1];
  parent.block.innerblocks.push(block);
  const html = document.substr(
    parent.prevoffset,
    tokenstart - parent.prevoffset
  );
  if (html) {
    parent.block.innerhtml += html;
    parent.block.innercontent.push(html);
  }
  parent.block.innercontent.push(null);
  parent.prevoffset = lastoffset ? lastoffset : tokenstart + tokenlength;
}
function addblockfromstack(endoffset) {
  const { block, leadinghtmlstart, prevoffset, tokenstart } = stack.pop();
  const html = endoffset ? document.substr(prevoffset, endoffset - prevoffset) : document.substr(prevoffset);
  if (html) {
    block.innerhtml += html;
    block.innercontent.push(html);
  }
  if (null !== leadinghtmlstart) {
    output.push(
      freeform(
        document.substr(
          leadinghtmlstart,
          tokenstart - leadinghtmlstart
        )
      )
    );
  }
  output.push(block);
}


(window.wp = window.wp || {}).blockserializationdefaultparser = __webpack_exports__;
/******/ })()
;



