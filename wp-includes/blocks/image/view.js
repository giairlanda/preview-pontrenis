import * as __webpack_external_module__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
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

;// external "@wordpress/interactivity"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const interactivity_namespaceobject = x({ ["getcontext"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.getcontext), ["getelement"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.getelement), ["store"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.store), ["withsyncevent"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.withsyncevent) });
;// ./node_modules/@wordpress/block-library/build-module/image/view.js

let istouching = false;
let lasttouchtime = 0;
const { state, actions, callbacks } = (0,interactivity_namespaceobject.store)(
  "core/image",
  {
    state: {
      currentimageid: null,
      get currentimage() {
        return state.metadata[state.currentimageid];
      },
      get overlayopened() {
        return state.currentimageid !== null;
      },
      get roleattribute() {
        return state.overlayopened ? "dialog" : null;
      },
      get ariamodal() {
        return state.overlayopened ? "true" : null;
      },
      get enlargedsrc() {
        return state.currentimage.uploadedsrc || "data:image/gif;base64,r0lgodlhaqabaad/acwaaaaaaqabaaacads=";
      },
      get figurestyles() {
        return state.overlayopened && `${state.currentimage.figurestyles?.replace(
          /margin[^;]*;?/g,
          ""
        )};`;
      },
      get imgstyles() {
        return state.overlayopened && `${state.currentimage.imgstyles?.replace(
          /;$/,
          ""
        )}; object-fit:cover;`;
      },
      get imagebuttonright() {
        const { imageid } = (0,interactivity_namespaceobject.getcontext)();
        return state.metadata[imageid].imagebuttonright;
      },
      get imagebuttontop() {
        const { imageid } = (0,interactivity_namespaceobject.getcontext)();
        return state.metadata[imageid].imagebuttontop;
      },
      get iscontenthidden() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        return state.overlayenabled && state.currentimageid === ctx.imageid;
      },
      get iscontentvisible() {
        const ctx = (0,interactivity_namespaceobject.getcontext)();
        return !state.overlayenabled && state.currentimageid === ctx.imageid;
      }
    },
    actions: {
      showlightbox() {
        const { imageid } = (0,interactivity_namespaceobject.getcontext)();
        if (!state.metadata[imageid].imageref?.complete) {
          return;
        }
        state.scrolltopreset = document.documentelement.scrolltop;
        state.scrollleftreset = document.documentelement.scrollleft;
        state.overlayenabled = true;
        state.currentimageid = imageid;
        callbacks.setoverlaystyles();
      },
      hidelightbox() {
        if (state.overlayenabled) {
          state.overlayenabled = false;
          settimeout(function() {
            state.currentimage.buttonref.focus({
              preventscroll: true
            });
            state.currentimageid = null;
          }, 450);
        }
      },
      handlekeydown: (0,interactivity_namespaceobject.withsyncevent)((event) => {
        if (state.overlayenabled) {
          if (event.key === "tab") {
            event.preventdefault();
            const { ref } = (0,interactivity_namespaceobject.getelement)();
            ref.queryselector("button").focus();
          }
          if (event.key === "escape") {
            actions.hidelightbox();
          }
        }
      }),
      handletouchmove: (0,interactivity_namespaceobject.withsyncevent)((event) => {
        if (state.overlayenabled) {
          event.preventdefault();
        }
      }),
      handletouchstart() {
        istouching = true;
      },
      handletouchend() {
        lasttouchtime = date.now();
        istouching = false;
      },
      handlescroll() {
        if (state.overlayopened) {
          if (!istouching && date.now() - lasttouchtime > 450) {
            window.scrollto(
              state.scrollleftreset,
              state.scrolltopreset
            );
          }
        }
      }
    },
    callbacks: {
      setoverlaystyles() {
        if (!state.overlayenabled) {
          return;
        }
        let {
          naturalwidth,
          naturalheight,
          offsetwidth: originalwidth,
          offsetheight: originalheight
        } = state.currentimage.imageref;
        let { x: screenposx, y: screenposy } = state.currentimage.imageref.getboundingclientrect();
        const naturalratio = naturalwidth / naturalheight;
        let originalratio = originalwidth / originalheight;
        if (state.currentimage.scaleattr === "contain") {
          if (naturalratio > originalratio) {
            const heightwithoutspace = originalwidth / naturalratio;
            screenposy += (originalheight - heightwithoutspace) / 2;
            originalheight = heightwithoutspace;
          } else {
            const widthwithoutspace = originalheight * naturalratio;
            screenposx += (originalwidth - widthwithoutspace) / 2;
            originalwidth = widthwithoutspace;
          }
        }
        originalratio = originalwidth / originalheight;
        let imgmaxwidth = parsefloat(
          state.currentimage.targetwidth !== "none" ? state.currentimage.targetwidth : naturalwidth
        );
        let imgmaxheight = parsefloat(
          state.currentimage.targetheight !== "none" ? state.currentimage.targetheight : naturalheight
        );
        let imgratio = imgmaxwidth / imgmaxheight;
        let containermaxwidth = imgmaxwidth;
        let containermaxheight = imgmaxheight;
        let containerwidth = imgmaxwidth;
        let containerheight = imgmaxheight;
        if (naturalratio.tofixed(2) !== imgratio.tofixed(2)) {
          if (naturalratio > imgratio) {
            const reducedheight = imgmaxwidth / naturalratio;
            if (imgmaxheight - reducedheight > imgmaxwidth) {
              imgmaxheight = reducedheight;
              imgmaxwidth = reducedheight * naturalratio;
            } else {
              imgmaxheight = imgmaxwidth / naturalratio;
            }
          } else {
            const reducedwidth = imgmaxheight * naturalratio;
            if (imgmaxwidth - reducedwidth > imgmaxheight) {
              imgmaxwidth = reducedwidth;
              imgmaxheight = reducedwidth / naturalratio;
            } else {
              imgmaxwidth = imgmaxheight * naturalratio;
            }
          }
          containerwidth = imgmaxwidth;
          containerheight = imgmaxheight;
          imgratio = imgmaxwidth / imgmaxheight;
          if (originalratio > imgratio) {
            containermaxwidth = imgmaxwidth;
            containermaxheight = containermaxwidth / originalratio;
          } else {
            containermaxheight = imgmaxheight;
            containermaxwidth = containermaxheight * originalratio;
          }
        }
        if (originalwidth > containerwidth || originalheight > containerheight) {
          containerwidth = originalwidth;
          containerheight = originalheight;
        }
        let horizontalpadding = 0;
        if (window.innerwidth > 480) {
          horizontalpadding = 80;
        } else if (window.innerwidth > 1920) {
          horizontalpadding = 160;
        }
        const verticalpadding = 80;
        const targetmaxwidth = math.min(
          window.innerwidth - horizontalpadding,
          containerwidth
        );
        const targetmaxheight = math.min(
          window.innerheight - verticalpadding,
          containerheight
        );
        const targetcontainerratio = targetmaxwidth / targetmaxheight;
        if (originalratio > targetcontainerratio) {
          containerwidth = targetmaxwidth;
          containerheight = containerwidth / originalratio;
        } else {
          containerheight = targetmaxheight;
          containerwidth = containerheight * originalratio;
        }
        const containerscale = originalwidth / containerwidth;
        const lightboximgwidth = imgmaxwidth * (containerwidth / containermaxwidth);
        const lightboximgheight = imgmaxheight * (containerheight / containermaxheight);
        state.overlaystyles = `
					--wp--lightbox-initial-top-position: ${screenposy}px;
					--wp--lightbox-initial-left-position: ${screenposx}px;
					--wp--lightbox-container-width: ${containerwidth + 1}px;
					--wp--lightbox-container-height: ${containerheight + 1}px;
					--wp--lightbox-image-width: ${lightboximgwidth}px;
					--wp--lightbox-image-height: ${lightboximgheight}px;
					--wp--lightbox-scale: ${containerscale};
					--wp--lightbox-scrollbar-width: ${window.innerwidth - document.documentelement.clientwidth}px;
				`;
      },
      setbuttonstyles() {
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        if (!ref) {
          return;
        }
        const { imageid } = (0,interactivity_namespaceobject.getcontext)();
        state.metadata[imageid].imageref = ref;
        state.metadata[imageid].currentsrc = ref.currentsrc;
        const {
          naturalwidth,
          naturalheight,
          offsetwidth,
          offsetheight
        } = ref;
        if (naturalwidth === 0 || naturalheight === 0) {
          return;
        }
        const figure = ref.parentelement;
        const figurewidth = ref.parentelement.clientwidth;
        let figureheight = ref.parentelement.clientheight;
        const caption = figure.queryselector("figcaption");
        if (caption) {
          const captioncomputedstyle = window.getcomputedstyle(caption);
          if (!["absolute", "fixed"].includes(
            captioncomputedstyle.position
          )) {
            figureheight = figureheight - caption.offsetheight - parsefloat(captioncomputedstyle.margintop) - parsefloat(captioncomputedstyle.marginbottom);
          }
        }
        const buttonoffsettop = figureheight - offsetheight;
        const buttonoffsetright = figurewidth - offsetwidth;
        let imagebuttontop = buttonoffsettop + 16;
        let imagebuttonright = buttonoffsetright + 16;
        if (state.metadata[imageid].scaleattr === "contain") {
          const naturalratio = naturalwidth / naturalheight;
          const offsetratio = offsetwidth / offsetheight;
          if (naturalratio >= offsetratio) {
            const referenceheight = offsetwidth / naturalratio;
            imagebuttontop = (offsetheight - referenceheight) / 2 + buttonoffsettop + 16;
            imagebuttonright = buttonoffsetright + 16;
          } else {
            const referencewidth = offsetheight * naturalratio;
            imagebuttontop = buttonoffsettop + 16;
            imagebuttonright = (offsetwidth - referencewidth) / 2 + buttonoffsetright + 16;
          }
        }
        state.metadata[imageid].imagebuttontop = imagebuttontop;
        state.metadata[imageid].imagebuttonright = imagebuttonright;
      },
      setoverlayfocus() {
        if (state.overlayenabled) {
          const { ref } = (0,interactivity_namespaceobject.getelement)();
          ref.focus();
        }
      },
      inittriggerbutton() {
        const { imageid } = (0,interactivity_namespaceobject.getcontext)();
        const { ref } = (0,interactivity_namespaceobject.getelement)();
        state.metadata[imageid].buttonref = ref;
      }
    }
  },
  { lock: true }
);






