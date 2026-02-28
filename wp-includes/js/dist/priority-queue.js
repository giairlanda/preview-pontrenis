/******/ (() => { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 5033:
/***/ ((module, exports, __webpack_require__) => {

var __webpack_amd_define_factory__, __webpack_amd_define_array__, __webpack_amd_define_result__;(function (factory) {
	if (true) {
		!(__webpack_amd_define_array__ = [], __webpack_amd_define_factory__ = (factory),
		__webpack_amd_define_result__ = (typeof __webpack_amd_define_factory__ === 'function' ?
		(__webpack_amd_define_factory__.apply(exports, __webpack_amd_define_array__)) : __webpack_amd_define_factory__),
		__webpack_amd_define_result__ !== undefined && (module.exports = __webpack_amd_define_result__));
	} else {}
}(function(){
	'use strict';
	var schedulestart, throttledelay, lazytimer, lazyraf;
	var root = typeof window != 'undefined' ?
		window :
		typeof __webpack_require__.g != undefined ?
			__webpack_require__.g :
			this || {};
	var requestanimationframe = root.cancelrequestanimationframe && root.requestanimationframe || settimeout;
	var cancelrequestanimationframe = root.cancelrequestanimationframe || cleartimeout;
	var tasks = [];
	var runattempts = 0;
	var isrunning = false;
	var remainingtime = 7;
	var minthrottle = 35;
	var throttle = 125;
	var index = 0;
	var taskstart = 0;
	var tasklength = 0;
	var idledeadline = {
		get didtimeout(){
			return false;
		},
		timeremaining: function(){
			var timeremaining = remainingtime - (date.now() - taskstart);
			return timeremaining < 0 ? 0 : timeremaining;
		},
	};
	var setinactive = debounce(function(){
		remainingtime = 22;
		throttle = 66;
		minthrottle = 0;
	});

	function debounce(fn){
		var id, timestamp;
		var wait = 99;
		var check = function(){
			var last = (date.now()) - timestamp;

			if (last < wait) {
				id = settimeout(check, wait - last);
			} else {
				id = null;
				fn();
			}
		};
		return function(){
			timestamp = date.now();
			if(!id){
				id = settimeout(check, wait);
			}
		};
	}

	function abortrunning(){
		if(isrunning){
			if(lazyraf){
				cancelrequestanimationframe(lazyraf);
			}
			if(lazytimer){
				cleartimeout(lazytimer);
			}
			isrunning = false;
		}
	}

	function oninputormutation(){
		if(throttle != 125){
			remainingtime = 7;
			throttle = 125;
			minthrottle = 35;

			if(isrunning) {
				abortrunning();
				schedulelazy();
			}
		}
		setinactive();
	}

	function scheduleafterraf() {
		lazyraf = null;
		lazytimer = settimeout(runtasks, 0);
	}

	function scheduleraf(){
		lazytimer = null;
		requestanimationframe(scheduleafterraf);
	}

	function schedulelazy(){

		if(isrunning){return;}
		throttledelay = throttle - (date.now() - taskstart);

		schedulestart = date.now();

		isrunning = true;

		if(minthrottle && throttledelay < minthrottle){
			throttledelay = minthrottle;
		}

		if(throttledelay > 9){
			lazytimer = settimeout(scheduleraf, throttledelay);
		} else {
			throttledelay = 0;
			scheduleraf();
		}
	}

	function runtasks(){
		var task, i, len;
		var timethreshold = remainingtime > 9 ?
			9 :
			1
		;

		taskstart = date.now();
		isrunning = false;

		lazytimer = null;

		if(runattempts > 2 || taskstart - throttledelay - 50 < schedulestart){
			for(i = 0, len = tasks.length; i < len && idledeadline.timeremaining() > timethreshold; i++){
				task = tasks.shift();
				tasklength++;
				if(task){
					task(idledeadline);
				}
			}
		}

		if(tasks.length){
			schedulelazy();
		} else {
			runattempts = 0;
		}
	}

	function requestidlecallbackshim(task){
		index++;
		tasks.push(task);
		schedulelazy();
		return index;
	}

	function cancelidlecallbackshim(id){
		var index = id - 1 - tasklength;
		if(tasks[index]){
			tasks[index] = null;
		}
	}

	if(!root.requestidlecallback || !root.cancelidlecallback){
		root.requestidlecallback = requestidlecallbackshim;
		root.cancelidlecallback = cancelidlecallbackshim;

		if(root.document && document.addeventlistener){
			root.addeventlistener('scroll', oninputormutation, true);
			root.addeventlistener('resize', oninputormutation);

			document.addeventlistener('focus', oninputormutation, true);
			document.addeventlistener('mouseover', oninputormutation, true);
			['click', 'keypress', 'touchstart', 'mousedown'].foreach(function(name){
				document.addeventlistener(name, oninputormutation, {capture: true, passive: true});
			});

			if(root.mutationobserver){
				new mutationobserver( oninputormutation ).observe( document.documentelement, {childlist: true, subtree: true, attributes: true} );
			}
		}
	} else {
		try{
			root.requestidlecallback(function(){}, {timeout: 0});
		} catch(e){
			(function(ric){
				var timeremainingproto, timeremaining;
				root.requestidlecallback = function(fn, timeout){
					if(timeout && typeof timeout.timeout == 'number'){
						return ric(fn, timeout.timeout);
					}
					return ric(fn);
				};
				if(root.idlecallbackdeadline && (timeremainingproto = idlecallbackdeadline.prototype)){
					timeremaining = object.getownpropertydescriptor(timeremainingproto, 'timeremaining');
					if(!timeremaining || !timeremaining.configurable || !timeremaining.get){return;}
					object.defineproperty(timeremainingproto, 'timeremaining', {
						value:  function(){
							return timeremaining.get.call(this);
						},
						enumerable: true,
						configurable: true,
					});
				}
			})(root.requestidlecallback)
		}
	}

	return {
		request: requestidlecallbackshim,
		cancel: cancelidlecallbackshim,
	};
}));


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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalthis === 'object') return globalthis;
/******/ 			try {
/******/ 				return this || new function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
// this entry needs to be wrapped in an iife because it needs to be in strict mode.
(() => {
"use strict";
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  createqueue: () => (/* binding */ createqueue)
});

// external module: ./node_modules/requestidlecallback/index.js
var requestidlecallback = __webpack_require__(5033);
;// ./node_modules/@wordpress/priority-queue/build-module/request-idle-callback.js

function createrequestidlecallback() {
  if (typeof window === "undefined") {
    return (callback) => {
      settimeout(() => callback(date.now()), 0);
    };
  }
  return window.requestidlecallback;
}
var request_idle_callback_default = createrequestidlecallback();


;// ./node_modules/@wordpress/priority-queue/build-module/index.js

const createqueue = () => {
  const waitinglist = /* @__pure__ */ new map();
  let isrunning = false;
  const runwaitinglist = (deadline) => {
    for (const [nextelement, callback] of waitinglist) {
      waitinglist.delete(nextelement);
      callback();
      if ("number" === typeof deadline || deadline.timeremaining() <= 0) {
        break;
      }
    }
    if (waitinglist.size === 0) {
      isrunning = false;
      return;
    }
    request_idle_callback_default(runwaitinglist);
  };
  const add = (element, item) => {
    waitinglist.set(element, item);
    if (!isrunning) {
      isrunning = true;
      request_idle_callback_default(runwaitinglist);
    }
  };
  const flush = (element) => {
    const callback = waitinglist.get(element);
    if (void 0 === callback) {
      return false;
    }
    waitinglist.delete(element);
    callback();
    return true;
  };
  const cancel = (element) => {
    return waitinglist.delete(element);
  };
  const reset = () => {
    waitinglist.clear();
    isrunning = false;
  };
  return {
    add,
    flush,
    cancel,
    reset
  };
};


})();

(window.wp = window.wp || {}).priorityqueue = __webpack_exports__;
/******/ })()
;






