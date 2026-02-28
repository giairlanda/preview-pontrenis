/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({});
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
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getproto = object.getprototypeof ? (obj) => (object.getprototypeof(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafprototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esmodule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafprototypes = leafprototypes || [null, getproto({}), getproto([]), getproto(getproto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafprototypes.indexof(current); current = getproto(current)) {
/******/ 				object.getownpropertynames(current).foreach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  commandmenu: () => (/* reexport */ commandmenu),
  privateapis: () => (/* reexport */ privateapis),
  store: () => (/* reexport */ store),
  usecommand: () => (/* reexport */ usecommand),
  usecommandloader: () => (/* reexport */ usecommandloader),
  usecommands: () => (/* reexport */ usecommands)
});

// namespace object: ./node_modules/@wordpress/commands/build-module/store/actions.js
var actions_namespaceobject = {};
__webpack_require__.r(actions_namespaceobject);
__webpack_require__.d(actions_namespaceobject, {
  close: () => (actions_close),
  open: () => (actions_open),
  registercommand: () => (registercommand),
  registercommandloader: () => (registercommandloader),
  unregistercommand: () => (unregistercommand),
  unregistercommandloader: () => (unregistercommandloader)
});

// namespace object: ./node_modules/@wordpress/commands/build-module/store/selectors.js
var selectors_namespaceobject = {};
__webpack_require__.r(selectors_namespaceobject);
__webpack_require__.d(selectors_namespaceobject, {
  getcommandloaders: () => (getcommandloaders),
  getcommands: () => (getcommands),
  getcontext: () => (getcontext),
  isopen: () => (selectors_isopen)
});

// namespace object: ./node_modules/@wordpress/commands/build-module/store/private-actions.js
var private_actions_namespaceobject = {};
__webpack_require__.r(private_actions_namespaceobject);
__webpack_require__.d(private_actions_namespaceobject, {
  setcontext: () => (setcontext)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// ./node_modules/cmdk/dist/chunk-nzjy6eh4.mjs
var u=1,y=.9,h=.8,j=.17,p=.1,u=.999,$=.9999;var k=.99,m=/[\\\/_+.#"@\[\(\{&]/,b=/[\\\/_+.#"@\[\(\{&]/g,k=/[\s-]/,x=/[\s-]/g;function g(_,c,h,p,a,f,o){if(f===c.length)return a===_.length?u:k;var t=`${a},${f}`;if(o[t]!==void 0)return o[t];for(var l=p.charat(f),c=h.indexof(l,a),s=0,e,n,r,m;c>=0;)e=g(_,c,h,p,c+1,f+1,o),e>s&&(c===a?e*=u:m.test(_.charat(c-1))?(e*=h,r=_.slice(a,c-1).match(b),r&&a>0&&(e*=math.pow(u,r.length))):k.test(_.charat(c-1))?(e*=y,m=_.slice(a,c-1).match(x),m&&a>0&&(e*=math.pow(u,m.length))):(e*=j,a>0&&(e*=math.pow(u,c-a))),_.charat(c)!==c.charat(f)&&(e*=$)),(e<p&&h.charat(c-1)===p.charat(f+1)||p.charat(f+1)===p.charat(f)&&h.charat(c-1)!==p.charat(f))&&(n=g(_,c,h,p,c+1,f+2,o),n*p>e&&(e=n*p)),e>s&&(s=e),c=h.indexof(l,c+1);return o[t]=s,s}function d(_){return _.tolowercase().replace(x," ")}function w(_,c,h){return _=h&&h.length>0?`${_+" "+h.join(" ")}`:_,g(_,c,d(_),d(c),0,0,{})}

;// ./node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = object.assign ? object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasownproperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

;// external "react"
const external_react_namespaceobject = window["react"];
var external_react_namespaceobject_0 = /*#__pure__*/__webpack_require__.t(external_react_namespaceobject, 2);
;// ./node_modules/@radix-ui/primitive/dist/index.mjs
function $e42e1063c40fb3ef$export$b9ecd428b558ff10(originaleventhandler, oureventhandler, { checkfordefaultprevented: checkfordefaultprevented = true  } = {}) {
    return function handleevent(event) {
        originaleventhandler === null || originaleventhandler === void 0 || originaleventhandler(event);
        if (checkfordefaultprevented === false || !event.defaultprevented) return oureventhandler === null || oureventhandler === void 0 ? void 0 : oureventhandler(event);
    };
}





;// ./node_modules/@radix-ui/react-compose-refs/dist/index.mjs



/**
 * set a given ref to a given value
 * this utility takes care of different types of refs: callback refs and refobject(s)
 */ function $6ed0406888f73fc4$var$setref(ref, value) {
    if (typeof ref === 'function') ref(value);
    else if (ref !== null && ref !== undefined) ref.current = value;
}
/**
 * a utility to compose multiple refs together
 * accepts callback refs and refobject(s)
 */ function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
    return (node)=>refs.foreach((ref)=>$6ed0406888f73fc4$var$setref(ref, node)
        )
    ;
}
/**
 * a custom hook that composes multiple refs
 * accepts callback refs and refobject(s)
 */ function $6ed0406888f73fc4$export$c7b2cbe3552a0d05(...refs) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return (0,external_react_namespaceobject.usecallback)($6ed0406888f73fc4$export$43e446d32b3d21af(...refs), refs);
}





;// ./node_modules/@radix-ui/react-context/dist/index.mjs



function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootcomponentname, defaultcontext) {
    const context = /*#__pure__*/ (0,external_react_namespaceobject.createcontext)(defaultcontext);
    function provider(props) {
        const { children: children , ...context } = props; // only re-memoize when prop values change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const value = (0,external_react_namespaceobject.usememo)(()=>context
        , object.values(context));
        return /*#__pure__*/ (0,external_react_namespaceobject.createelement)(context.provider, {
            value: value
        }, children);
    }
    function usecontext(consumername) {
        const context = (0,external_react_namespaceobject.usecontext)(context);
        if (context) return context;
        if (defaultcontext !== undefined) return defaultcontext; // if a defaultcontext wasn't specified, it's a required context.
        throw new error(`\`${consumername}\` must be used within \`${rootcomponentname}\``);
    }
    provider.displayname = rootcomponentname + 'provider';
    return [
        provider,
        usecontext
    ];
}
/* -------------------------------------------------------------------------------------------------
 * createcontextscope
 * -----------------------------------------------------------------------------------------------*/ function $c512c27ab02ef895$export$50c7b4e9d9f19c1(scopename, createcontextscopedeps = []) {
    let defaultcontexts = [];
    /* -----------------------------------------------------------------------------------------------
   * createcontext
   * ---------------------------------------------------------------------------------------------*/ function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootcomponentname, defaultcontext) {
        const basecontext = /*#__pure__*/ (0,external_react_namespaceobject.createcontext)(defaultcontext);
        const index = defaultcontexts.length;
        defaultcontexts = [
            ...defaultcontexts,
            defaultcontext
        ];
        function provider(props) {
            const { scope: scope , children: children , ...context } = props;
            const context = (scope === null || scope === void 0 ? void 0 : scope[scopename][index]) || basecontext; // only re-memoize when prop values change
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const value = (0,external_react_namespaceobject.usememo)(()=>context
            , object.values(context));
            return /*#__pure__*/ (0,external_react_namespaceobject.createelement)(context.provider, {
                value: value
            }, children);
        }
        function usecontext(consumername, scope) {
            const context = (scope === null || scope === void 0 ? void 0 : scope[scopename][index]) || basecontext;
            const context = (0,external_react_namespaceobject.usecontext)(context);
            if (context) return context;
            if (defaultcontext !== undefined) return defaultcontext; // if a defaultcontext wasn't specified, it's a required context.
            throw new error(`\`${consumername}\` must be used within \`${rootcomponentname}\``);
        }
        provider.displayname = rootcomponentname + 'provider';
        return [
            provider,
            usecontext
        ];
    }
    /* -----------------------------------------------------------------------------------------------
   * createscope
   * ---------------------------------------------------------------------------------------------*/ const createscope = ()=>{
        const scopecontexts = defaultcontexts.map((defaultcontext)=>{
            return /*#__pure__*/ (0,external_react_namespaceobject.createcontext)(defaultcontext);
        });
        return function usescope(scope) {
            const contexts = (scope === null || scope === void 0 ? void 0 : scope[scopename]) || scopecontexts;
            return (0,external_react_namespaceobject.usememo)(()=>({
                    [`__scope${scopename}`]: {
                        ...scope,
                        [scopename]: contexts
                    }
                })
            , [
                scope,
                contexts
            ]);
        };
    };
    createscope.scopename = scopename;
    return [
        $c512c27ab02ef895$export$fd42f52fd3ae1109,
        $c512c27ab02ef895$var$composecontextscopes(createscope, ...createcontextscopedeps)
    ];
}
/* -------------------------------------------------------------------------------------------------
 * composecontextscopes
 * -----------------------------------------------------------------------------------------------*/ function $c512c27ab02ef895$var$composecontextscopes(...scopes) {
    const basescope = scopes[0];
    if (scopes.length === 1) return basescope;
    const createscope1 = ()=>{
        const scopehooks = scopes.map((createscope)=>({
                usescope: createscope(),
                scopename: createscope.scopename
            })
        );
        return function usecomposedscopes(overridescopes) {
            const nextscopes1 = scopehooks.reduce((nextscopes, { usescope: usescope , scopename: scopename  })=>{
                // we are calling a hook inside a callback which react warns against to avoid inconsistent
                // renders, however, scoping doesn't have render side effects so we ignore the rule.
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const scopeprops = usescope(overridescopes);
                const currentscope = scopeprops[`__scope${scopename}`];
                return {
                    ...nextscopes,
                    ...currentscope
                };
            }, {});
            return (0,external_react_namespaceobject.usememo)(()=>({
                    [`__scope${basescope.scopename}`]: nextscopes1
                })
            , [
                nextscopes1
            ]);
        };
    };
    createscope1.scopename = basescope.scopename;
    return createscope1;
}





;// ./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs



/**
 * on the server, react emits a warning when calling `uselayouteffect`.
 * this is because neither `uselayouteffect` nor `useeffect` run on the server.
 * we use this safe version which suppresses the warning by replacing it with a noop on the server.
 *
 * see: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */ const $9f79659886946c16$export$e5c5a5f917a5871c = boolean(globalthis === null || globalthis === void 0 ? void 0 : globalthis.document) ? external_react_namespaceobject.uselayouteffect : ()=>{};





;// ./node_modules/@radix-ui/react-id/dist/index.mjs





const $1746a345f3d73bb7$var$usereactid = external_react_namespaceobject_0['useid'.tostring()] || (()=>undefined
);
let $1746a345f3d73bb7$var$count = 0;
function $1746a345f3d73bb7$export$f680877a34711e37(deterministicid) {
    const [id, setid] = external_react_namespaceobject.usestate($1746a345f3d73bb7$var$usereactid()); // react versions older than 18 will have client-side ids only.
    $9f79659886946c16$export$e5c5a5f917a5871c(()=>{
        if (!deterministicid) setid((reactid)=>reactid !== null && reactid !== void 0 ? reactid : string($1746a345f3d73bb7$var$count++)
        );
    }, [
        deterministicid
    ]);
    return deterministicid || (id ? `radix-${id}` : '');
}





;// ./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs



/**
 * a custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 */ function $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback) {
    const callbackref = (0,external_react_namespaceobject.useref)(callback);
    (0,external_react_namespaceobject.useeffect)(()=>{
        callbackref.current = callback;
    }); // https://github.com/facebook/react/issues/19240
    return (0,external_react_namespaceobject.usememo)(()=>(...args)=>{
            var _callbackref$current;
            return (_callbackref$current = callbackref.current) === null || _callbackref$current === void 0 ? void 0 : _callbackref$current.call(callbackref, ...args);
        }
    , []);
}





;// ./node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs





function $71cd76cc60e0454e$export$6f32135080cb4c3({ prop: prop , defaultprop: defaultprop , onchange: onchange = ()=>{}  }) {
    const [uncontrolledprop, setuncontrolledprop] = $71cd76cc60e0454e$var$useuncontrolledstate({
        defaultprop: defaultprop,
        onchange: onchange
    });
    const iscontrolled = prop !== undefined;
    const value1 = iscontrolled ? prop : uncontrolledprop;
    const handlechange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onchange);
    const setvalue = (0,external_react_namespaceobject.usecallback)((nextvalue)=>{
        if (iscontrolled) {
            const setter = nextvalue;
            const value = typeof nextvalue === 'function' ? setter(prop) : nextvalue;
            if (value !== prop) handlechange(value);
        } else setuncontrolledprop(nextvalue);
    }, [
        iscontrolled,
        prop,
        setuncontrolledprop,
        handlechange
    ]);
    return [
        value1,
        setvalue
    ];
}
function $71cd76cc60e0454e$var$useuncontrolledstate({ defaultprop: defaultprop , onchange: onchange  }) {
    const uncontrolledstate = (0,external_react_namespaceobject.usestate)(defaultprop);
    const [value] = uncontrolledstate;
    const prevvalueref = (0,external_react_namespaceobject.useref)(value);
    const handlechange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onchange);
    (0,external_react_namespaceobject.useeffect)(()=>{
        if (prevvalueref.current !== value) {
            handlechange(value);
            prevvalueref.current = value;
        }
    }, [
        value,
        prevvalueref,
        handlechange
    ]);
    return uncontrolledstate;
}





;// external "reactdom"
const external_reactdom_namespaceobject = window["reactdom"];
;// ./node_modules/@radix-ui/react-slot/dist/index.mjs







/* -------------------------------------------------------------------------------------------------
 * slot
 * -----------------------------------------------------------------------------------------------*/ const $5e63c961fc1ce211$export$8c6ed5c666ac1360 = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const { children: children , ...slotprops } = props;
    const childrenarray = external_react_namespaceobject.children.toarray(children);
    const slottable = childrenarray.find($5e63c961fc1ce211$var$isslottable);
    if (slottable) {
        // the new element to render is the one passed as a child of `slottable`
        const newelement = slottable.props.children;
        const newchildren = childrenarray.map((child)=>{
            if (child === slottable) {
                // because the new element will be the one rendered, we are only interested
                // in grabbing its children (`newelement.props.children`)
                if (external_react_namespaceobject.children.count(newelement) > 1) return external_react_namespaceobject.children.only(null);
                return /*#__pure__*/ (0,external_react_namespaceobject.isvalidelement)(newelement) ? newelement.props.children : null;
            } else return child;
        });
        return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5e63c961fc1ce211$var$slotclone, _extends({}, slotprops, {
            ref: forwardedref
        }), /*#__pure__*/ (0,external_react_namespaceobject.isvalidelement)(newelement) ? /*#__pure__*/ (0,external_react_namespaceobject.cloneelement)(newelement, undefined, newchildren) : null);
    }
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5e63c961fc1ce211$var$slotclone, _extends({}, slotprops, {
        ref: forwardedref
    }), children);
});
$5e63c961fc1ce211$export$8c6ed5c666ac1360.displayname = 'slot';
/* -------------------------------------------------------------------------------------------------
 * slotclone
 * -----------------------------------------------------------------------------------------------*/ const $5e63c961fc1ce211$var$slotclone = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const { children: children , ...slotprops } = props;
    if (/*#__pure__*/ (0,external_react_namespaceobject.isvalidelement)(children)) return /*#__pure__*/ (0,external_react_namespaceobject.cloneelement)(children, {
        ...$5e63c961fc1ce211$var$mergeprops(slotprops, children.props),
        ref: forwardedref ? $6ed0406888f73fc4$export$43e446d32b3d21af(forwardedref, children.ref) : children.ref
    });
    return external_react_namespaceobject.children.count(children) > 1 ? external_react_namespaceobject.children.only(null) : null;
});
$5e63c961fc1ce211$var$slotclone.displayname = 'slotclone';
/* -------------------------------------------------------------------------------------------------
 * slottable
 * -----------------------------------------------------------------------------------------------*/ const $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = ({ children: children  })=>{
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)(external_react_namespaceobject.fragment, null, children);
};
/* ---------------------------------------------------------------------------------------------- */ function $5e63c961fc1ce211$var$isslottable(child) {
    return /*#__pure__*/ (0,external_react_namespaceobject.isvalidelement)(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45;
}
function $5e63c961fc1ce211$var$mergeprops(slotprops, childprops) {
    // all child props should override
    const overrideprops = {
        ...childprops
    };
    for(const propname in childprops){
        const slotpropvalue = slotprops[propname];
        const childpropvalue = childprops[propname];
        const ishandler = /^on[a-z]/.test(propname);
        if (ishandler) {
            // if the handler exists on both, we compose them
            if (slotpropvalue && childpropvalue) overrideprops[propname] = (...args)=>{
                childpropvalue(...args);
                slotpropvalue(...args);
            };
            else if (slotpropvalue) overrideprops[propname] = slotpropvalue;
        } else if (propname === 'style') overrideprops[propname] = {
            ...slotpropvalue,
            ...childpropvalue
        };
        else if (propname === 'classname') overrideprops[propname] = [
            slotpropvalue,
            childpropvalue
        ].filter(boolean).join(' ');
    }
    return {
        ...slotprops,
        ...overrideprops
    };
}
const $5e63c961fc1ce211$export$be92b6f5f03c0fe9 = (/* unused pure expression or super */ null && ($5e63c961fc1ce211$export$8c6ed5c666ac1360));





;// ./node_modules/@radix-ui/react-primitive/dist/index.mjs









const $8927f6f2acc4f386$var$nodes = [
    'a',
    'button',
    'div',
    'form',
    'h2',
    'h3',
    'img',
    'input',
    'label',
    'li',
    'nav',
    'ol',
    'p',
    'span',
    'svg',
    'ul'
]; // temporary while we await merge of this fix:
// https://github.com/definitelytyped/definitelytyped/pull/55396
// prettier-ignore
/* -------------------------------------------------------------------------------------------------
 * primitive
 * -----------------------------------------------------------------------------------------------*/ const $8927f6f2acc4f386$export$250ffa63cdc0d034 = $8927f6f2acc4f386$var$nodes.reduce((primitive, node)=>{
    const node = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
        const { aschild: aschild , ...primitiveprops } = props;
        const comp = aschild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : node;
        (0,external_react_namespaceobject.useeffect)(()=>{
            window[symbol.for('radix-ui')] = true;
        }, []);
        return /*#__pure__*/ (0,external_react_namespaceobject.createelement)(comp, _extends({}, primitiveprops, {
            ref: forwardedref
        }));
    });
    node.displayname = `primitive.${node}`;
    return {
        ...primitive,
        [node]: node
    };
}, {});
/* -------------------------------------------------------------------------------------------------
 * utils
 * -----------------------------------------------------------------------------------------------*/ /**
 * flush custom event dispatch
 * https://github.com/radix-ui/primitives/pull/1378
 *
 * react batches *all* event handlers since version 18, this introduces certain considerations when using custom event types.
 *
 * internally, react prioritises events in the following order:
 *  - discrete
 *  - continuous
 *  - default
 *
 * https://github.com/facebook/react/blob/a8a4742f1c54493df00da648a3f9d26e3db9c8b5/packages/react-dom/src/events/reactdomeventlistener.js#l294-l350
 *
 * `discrete` is an  important distinction as updates within these events are applied immediately.
 * react however, is not able to infer the priority of custom event types due to how they are detected internally.
 * because of this, it's possible for updates from custom events to be unexpectedly batched when
 * dispatched by another `discrete` event.
 *
 * in order to ensure that updates from custom events are applied predictably, we need to manually flush the batch.
 * this utility should be used when dispatching a custom event from within another `discrete` event, this utility
 * is not nessesary when dispatching known event types, or if dispatching a custom type inside a non-discrete event.
 * for example:
 *
 * dispatching a known click ðÿ‘ž
 * target.dispatchevent(new event(â€˜clickâ€™))
 *
 * dispatching a custom type within a non-discrete event ðÿ‘ž
 * onscroll={(event) => event.target.dispatchevent(new customevent(â€˜customtypeâ€™))}
 *
 * dispatching a custom type within a `discrete` event ðÿ‘
 * onpointerdown={(event) => dispatchdiscretecustomevent(event.target, new customevent(â€˜customtypeâ€™))}
 *
 * note: though react classifies `focus`, `focusin` and `focusout` events as `discrete`, it's  not recommended to use
 * this utility with them. this is because it's possible for those handlers to be called implicitly during render
 * e.g. when focus is within a component as it is unmounted, or when managing focus on mount.
 */ function $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event) {
    if (target) (0,external_reactdom_namespaceobject.flushsync)(()=>target.dispatchevent(event)
    );
}
/* -----------------------------------------------------------------------------------------------*/ const $8927f6f2acc4f386$export$be92b6f5f03c0fe9 = (/* unused pure expression or super */ null && ($8927f6f2acc4f386$export$250ffa63cdc0d034));





;// ./node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs





/**
 * listens for when the escape key is down
 */ function $addc16e1bbe58fd0$export$3a72a57244d6e765(onescapekeydownprop, ownerdocument = globalthis === null || globalthis === void 0 ? void 0 : globalthis.document) {
    const onescapekeydown = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onescapekeydownprop);
    (0,external_react_namespaceobject.useeffect)(()=>{
        const handlekeydown = (event)=>{
            if (event.key === 'escape') onescapekeydown(event);
        };
        ownerdocument.addeventlistener('keydown', handlekeydown);
        return ()=>ownerdocument.removeeventlistener('keydown', handlekeydown)
        ;
    }, [
        onescapekeydown,
        ownerdocument
    ]);
}





;// ./node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs















/* -------------------------------------------------------------------------------------------------
 * dismissablelayer
 * -----------------------------------------------------------------------------------------------*/ const $5cb92bef7577960e$var$dismissable_layer_name = 'dismissablelayer';
const $5cb92bef7577960e$var$context_update = 'dismissablelayer.update';
const $5cb92bef7577960e$var$pointer_down_outside = 'dismissablelayer.pointerdownoutside';
const $5cb92bef7577960e$var$focus_outside = 'dismissablelayer.focusoutside';
let $5cb92bef7577960e$var$originalbodypointerevents;
const $5cb92bef7577960e$var$dismissablelayercontext = /*#__pure__*/ (0,external_react_namespaceobject.createcontext)({
    layers: new set(),
    layerswithoutsidepointereventsdisabled: new set(),
    branches: new set()
});
const $5cb92bef7577960e$export$177fb62ff3ec1f22 = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    var _node$ownerdocument;
    const { disableoutsidepointerevents: disableoutsidepointerevents = false , onescapekeydown: onescapekeydown , onpointerdownoutside: onpointerdownoutside , onfocusoutside: onfocusoutside , oninteractoutside: oninteractoutside , ondismiss: ondismiss , ...layerprops } = props;
    const context = (0,external_react_namespaceobject.usecontext)($5cb92bef7577960e$var$dismissablelayercontext);
    const [node1, setnode] = (0,external_react_namespaceobject.usestate)(null);
    const ownerdocument = (_node$ownerdocument = node1 === null || node1 === void 0 ? void 0 : node1.ownerdocument) !== null && _node$ownerdocument !== void 0 ? _node$ownerdocument : globalthis === null || globalthis === void 0 ? void 0 : globalthis.document;
    const [, force] = (0,external_react_namespaceobject.usestate)({});
    const composedrefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedref, (node)=>setnode(node)
    );
    const layers = array.from(context.layers);
    const [highestlayerwithoutsidepointereventsdisabled] = [
        ...context.layerswithoutsidepointereventsdisabled
    ].slice(-1); // prettier-ignore
    const highestlayerwithoutsidepointereventsdisabledindex = layers.indexof(highestlayerwithoutsidepointereventsdisabled); // prettier-ignore
    const index = node1 ? layers.indexof(node1) : -1;
    const isbodypointereventsdisabled = context.layerswithoutsidepointereventsdisabled.size > 0;
    const ispointereventsenabled = index >= highestlayerwithoutsidepointereventsdisabledindex;
    const pointerdownoutside = $5cb92bef7577960e$var$usepointerdownoutside((event)=>{
        const target = event.target;
        const ispointerdownonbranch = [
            ...context.branches
        ].some((branch)=>branch.contains(target)
        );
        if (!ispointereventsenabled || ispointerdownonbranch) return;
        onpointerdownoutside === null || onpointerdownoutside === void 0 || onpointerdownoutside(event);
        oninteractoutside === null || oninteractoutside === void 0 || oninteractoutside(event);
        if (!event.defaultprevented) ondismiss === null || ondismiss === void 0 || ondismiss();
    }, ownerdocument);
    const focusoutside = $5cb92bef7577960e$var$usefocusoutside((event)=>{
        const target = event.target;
        const isfocusinbranch = [
            ...context.branches
        ].some((branch)=>branch.contains(target)
        );
        if (isfocusinbranch) return;
        onfocusoutside === null || onfocusoutside === void 0 || onfocusoutside(event);
        oninteractoutside === null || oninteractoutside === void 0 || oninteractoutside(event);
        if (!event.defaultprevented) ondismiss === null || ondismiss === void 0 || ondismiss();
    }, ownerdocument);
    $addc16e1bbe58fd0$export$3a72a57244d6e765((event)=>{
        const ishighestlayer = index === context.layers.size - 1;
        if (!ishighestlayer) return;
        onescapekeydown === null || onescapekeydown === void 0 || onescapekeydown(event);
        if (!event.defaultprevented && ondismiss) {
            event.preventdefault();
            ondismiss();
        }
    }, ownerdocument);
    (0,external_react_namespaceobject.useeffect)(()=>{
        if (!node1) return;
        if (disableoutsidepointerevents) {
            if (context.layerswithoutsidepointereventsdisabled.size === 0) {
                $5cb92bef7577960e$var$originalbodypointerevents = ownerdocument.body.style.pointerevents;
                ownerdocument.body.style.pointerevents = 'none';
            }
            context.layerswithoutsidepointereventsdisabled.add(node1);
        }
        context.layers.add(node1);
        $5cb92bef7577960e$var$dispatchupdate();
        return ()=>{
            if (disableoutsidepointerevents && context.layerswithoutsidepointereventsdisabled.size === 1) ownerdocument.body.style.pointerevents = $5cb92bef7577960e$var$originalbodypointerevents;
        };
    }, [
        node1,
        ownerdocument,
        disableoutsidepointerevents,
        context
    ]);
    /**
   * we purposefully prevent combining this effect with the `disableoutsidepointerevents` effect
   * because a change to `disableoutsidepointerevents` would remove this layer from the stack
   * and add it to the end again so the layering order wouldn't be _creation order_.
   * we only want them to be removed from context stacks when unmounted.
   */ (0,external_react_namespaceobject.useeffect)(()=>{
        return ()=>{
            if (!node1) return;
            context.layers.delete(node1);
            context.layerswithoutsidepointereventsdisabled.delete(node1);
            $5cb92bef7577960e$var$dispatchupdate();
        };
    }, [
        node1,
        context
    ]);
    (0,external_react_namespaceobject.useeffect)(()=>{
        const handleupdate = ()=>force({})
        ;
        document.addeventlistener($5cb92bef7577960e$var$context_update, handleupdate);
        return ()=>document.removeeventlistener($5cb92bef7577960e$var$context_update, handleupdate)
        ;
    }, []);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, layerprops, {
        ref: composedrefs,
        style: {
            pointerevents: isbodypointereventsdisabled ? ispointereventsenabled ? 'auto' : 'none' : undefined,
            ...props.style
        },
        onfocuscapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onfocuscapture, focusoutside.onfocuscapture),
        onblurcapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onblurcapture, focusoutside.onblurcapture),
        onpointerdowncapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onpointerdowncapture, pointerdownoutside.onpointerdowncapture)
    }));
});
/*#__pure__*/ object.assign($5cb92bef7577960e$export$177fb62ff3ec1f22, {
    displayname: $5cb92bef7577960e$var$dismissable_layer_name
});
/* -------------------------------------------------------------------------------------------------
 * dismissablelayerbranch
 * -----------------------------------------------------------------------------------------------*/ const $5cb92bef7577960e$var$branch_name = 'dismissablelayerbranch';
const $5cb92bef7577960e$export$4d5eb2109db14228 = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const context = (0,external_react_namespaceobject.usecontext)($5cb92bef7577960e$var$dismissablelayercontext);
    const ref = (0,external_react_namespaceobject.useref)(null);
    const composedrefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedref, ref);
    (0,external_react_namespaceobject.useeffect)(()=>{
        const node = ref.current;
        if (node) {
            context.branches.add(node);
            return ()=>{
                context.branches.delete(node);
            };
        }
    }, [
        context.branches
    ]);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, props, {
        ref: composedrefs
    }));
});
/*#__pure__*/ object.assign($5cb92bef7577960e$export$4d5eb2109db14228, {
    displayname: $5cb92bef7577960e$var$branch_name
});
/* -----------------------------------------------------------------------------------------------*/ /**
 * listens for `pointerdown` outside a react subtree. we use `pointerdown` rather than `pointerup`
 * to mimic layer dismissing behaviour present in os.
 * returns props to pass to the node we want to check for outside events.
 */ function $5cb92bef7577960e$var$usepointerdownoutside(onpointerdownoutside, ownerdocument = globalthis === null || globalthis === void 0 ? void 0 : globalthis.document) {
    const handlepointerdownoutside = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onpointerdownoutside);
    const ispointerinsidereacttreeref = (0,external_react_namespaceobject.useref)(false);
    const handleclickref = (0,external_react_namespaceobject.useref)(()=>{});
    (0,external_react_namespaceobject.useeffect)(()=>{
        const handlepointerdown = (event)=>{
            if (event.target && !ispointerinsidereacttreeref.current) {
                const eventdetail = {
                    originalevent: event
                };
                function handleanddispatchpointerdownoutsideevent() {
                    $5cb92bef7577960e$var$handleanddispatchcustomevent($5cb92bef7577960e$var$pointer_down_outside, handlepointerdownoutside, eventdetail, {
                        discrete: true
                    });
                }
                /**
         * on touch devices, we need to wait for a click event because browsers implement
         * a ~350ms delay between the time the user stops touching the display and when the
         * browser executres events. we need to ensure we don't reactivate pointer-events within
         * this timeframe otherwise the browser may execute events that should have been prevented.
         *
         * additionally, this also lets us deal automatically with cancellations when a click event
         * isn't raised because the page was considered scrolled/drag-scrolled, long-pressed, etc.
         *
         * this is why we also continuously remove the previous listener, because we cannot be
         * certain that it was raised, and therefore cleaned-up.
         */ if (event.pointertype === 'touch') {
                    ownerdocument.removeeventlistener('click', handleclickref.current);
                    handleclickref.current = handleanddispatchpointerdownoutsideevent;
                    ownerdocument.addeventlistener('click', handleclickref.current, {
                        once: true
                    });
                } else handleanddispatchpointerdownoutsideevent();
            } else // we need to remove the event listener in case the outside click has been canceled.
            // see: https://github.com/radix-ui/primitives/issues/2171
            ownerdocument.removeeventlistener('click', handleclickref.current);
            ispointerinsidereacttreeref.current = false;
        };
        /**
     * if this hook executes in a component that mounts via a `pointerdown` event, the event
     * would bubble up to the document and trigger a `pointerdownoutside` event. we avoid
     * this by delaying the event listener registration on the document.
     * this is not react specific, but rather how the dom works, ie:
     * ```
     * button.addeventlistener('pointerdown', () => {
     *   console.log('i will log');
     *   document.addeventlistener('pointerdown', () => {
     *     console.log('i will also log');
     *   })
     * });
     */ const timerid = window.settimeout(()=>{
            ownerdocument.addeventlistener('pointerdown', handlepointerdown);
        }, 0);
        return ()=>{
            window.cleartimeout(timerid);
            ownerdocument.removeeventlistener('pointerdown', handlepointerdown);
            ownerdocument.removeeventlistener('click', handleclickref.current);
        };
    }, [
        ownerdocument,
        handlepointerdownoutside
    ]);
    return {
        // ensures we check react component tree (not just dom tree)
        onpointerdowncapture: ()=>ispointerinsidereacttreeref.current = true
    };
}
/**
 * listens for when focus happens outside a react subtree.
 * returns props to pass to the root (node) of the subtree we want to check.
 */ function $5cb92bef7577960e$var$usefocusoutside(onfocusoutside, ownerdocument = globalthis === null || globalthis === void 0 ? void 0 : globalthis.document) {
    const handlefocusoutside = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onfocusoutside);
    const isfocusinsidereacttreeref = (0,external_react_namespaceobject.useref)(false);
    (0,external_react_namespaceobject.useeffect)(()=>{
        const handlefocus = (event)=>{
            if (event.target && !isfocusinsidereacttreeref.current) {
                const eventdetail = {
                    originalevent: event
                };
                $5cb92bef7577960e$var$handleanddispatchcustomevent($5cb92bef7577960e$var$focus_outside, handlefocusoutside, eventdetail, {
                    discrete: false
                });
            }
        };
        ownerdocument.addeventlistener('focusin', handlefocus);
        return ()=>ownerdocument.removeeventlistener('focusin', handlefocus)
        ;
    }, [
        ownerdocument,
        handlefocusoutside
    ]);
    return {
        onfocuscapture: ()=>isfocusinsidereacttreeref.current = true
        ,
        onblurcapture: ()=>isfocusinsidereacttreeref.current = false
    };
}
function $5cb92bef7577960e$var$dispatchupdate() {
    const event = new customevent($5cb92bef7577960e$var$context_update);
    document.dispatchevent(event);
}
function $5cb92bef7577960e$var$handleanddispatchcustomevent(name, handler, detail, { discrete: discrete  }) {
    const target = detail.originalevent.target;
    const event = new customevent(name, {
        bubbles: false,
        cancelable: true,
        detail: detail
    });
    if (handler) target.addeventlistener(name, handler, {
        once: true
    });
    if (discrete) $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event);
    else target.dispatchevent(event);
}
const $5cb92bef7577960e$export$be92b6f5f03c0fe9 = (/* unused pure expression or super */ null && ($5cb92bef7577960e$export$177fb62ff3ec1f22));
const $5cb92bef7577960e$export$aecb2ddcb55c95be = (/* unused pure expression or super */ null && ($5cb92bef7577960e$export$4d5eb2109db14228));





;// ./node_modules/@radix-ui/react-focus-scope/dist/index.mjs











const $d3863c46a17e8a28$var$autofocus_on_mount = 'focusscope.autofocusonmount';
const $d3863c46a17e8a28$var$autofocus_on_unmount = 'focusscope.autofocusonunmount';
const $d3863c46a17e8a28$var$event_options = {
    bubbles: false,
    cancelable: true
};
/* -------------------------------------------------------------------------------------------------
 * focusscope
 * -----------------------------------------------------------------------------------------------*/ const $d3863c46a17e8a28$var$focus_scope_name = 'focusscope';
const $d3863c46a17e8a28$export$20e40289641fbbb6 = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const { loop: loop = false , trapped: trapped = false , onmountautofocus: onmountautofocusprop , onunmountautofocus: onunmountautofocusprop , ...scopeprops } = props;
    const [container1, setcontainer] = (0,external_react_namespaceobject.usestate)(null);
    const onmountautofocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onmountautofocusprop);
    const onunmountautofocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onunmountautofocusprop);
    const lastfocusedelementref = (0,external_react_namespaceobject.useref)(null);
    const composedrefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedref, (node)=>setcontainer(node)
    );
    const focusscope = (0,external_react_namespaceobject.useref)({
        paused: false,
        pause () {
            this.paused = true;
        },
        resume () {
            this.paused = false;
        }
    }).current; // takes care of trapping focus if focus is moved outside programmatically for example
    (0,external_react_namespaceobject.useeffect)(()=>{
        if (trapped) {
            function handlefocusin(event) {
                if (focusscope.paused || !container1) return;
                const target = event.target;
                if (container1.contains(target)) lastfocusedelementref.current = target;
                else $d3863c46a17e8a28$var$focus(lastfocusedelementref.current, {
                    select: true
                });
            }
            function handlefocusout(event) {
                if (focusscope.paused || !container1) return;
                const relatedtarget = event.relatedtarget; // a `focusout` event with a `null` `relatedtarget` will happen in at least two cases:
                //
                // 1. when the user switches app/tabs/windows/the browser itself loses focus.
                // 2. in google chrome, when the focused element is removed from the dom.
                //
                // we let the browser do its thing here because:
                //
                // 1. the browser already keeps a memory of what's focused for when the page gets refocused.
                // 2. in google chrome, if we try to focus the deleted focused element (as per below), it
                //    throws the cpu to 100%, so we avoid doing anything for this reason here too.
                if (relatedtarget === null) return; // if the focus has moved to an actual legitimate element (`relatedtarget !== null`)
                // that is outside the container, we move focus to the last valid focused element inside.
                if (!container1.contains(relatedtarget)) $d3863c46a17e8a28$var$focus(lastfocusedelementref.current, {
                    select: true
                });
            } // when the focused element gets removed from the dom, browsers move focus
            // back to the document.body. in this case, we move focus to the container
            // to keep focus trapped correctly.
            function handlemutations(mutations) {
                const focusedelement = document.activeelement;
                if (focusedelement !== document.body) return;
                for (const mutation of mutations)if (mutation.removednodes.length > 0) $d3863c46a17e8a28$var$focus(container1);
            }
            document.addeventlistener('focusin', handlefocusin);
            document.addeventlistener('focusout', handlefocusout);
            const mutationobserver = new mutationobserver(handlemutations);
            if (container1) mutationobserver.observe(container1, {
                childlist: true,
                subtree: true
            });
            return ()=>{
                document.removeeventlistener('focusin', handlefocusin);
                document.removeeventlistener('focusout', handlefocusout);
                mutationobserver.disconnect();
            };
        }
    }, [
        trapped,
        container1,
        focusscope.paused
    ]);
    (0,external_react_namespaceobject.useeffect)(()=>{
        if (container1) {
            $d3863c46a17e8a28$var$focusscopesstack.add(focusscope);
            const previouslyfocusedelement = document.activeelement;
            const hasfocusedcandidate = container1.contains(previouslyfocusedelement);
            if (!hasfocusedcandidate) {
                const mountevent = new customevent($d3863c46a17e8a28$var$autofocus_on_mount, $d3863c46a17e8a28$var$event_options);
                container1.addeventlistener($d3863c46a17e8a28$var$autofocus_on_mount, onmountautofocus);
                container1.dispatchevent(mountevent);
                if (!mountevent.defaultprevented) {
                    $d3863c46a17e8a28$var$focusfirst($d3863c46a17e8a28$var$removelinks($d3863c46a17e8a28$var$gettabbablecandidates(container1)), {
                        select: true
                    });
                    if (document.activeelement === previouslyfocusedelement) $d3863c46a17e8a28$var$focus(container1);
                }
            }
            return ()=>{
                container1.removeeventlistener($d3863c46a17e8a28$var$autofocus_on_mount, onmountautofocus); // we hit a react bug (fixed in v17) with focusing in unmount.
                // we need to delay the focus a little to get around it for now.
                // see: https://github.com/facebook/react/issues/17894
                settimeout(()=>{
                    const unmountevent = new customevent($d3863c46a17e8a28$var$autofocus_on_unmount, $d3863c46a17e8a28$var$event_options);
                    container1.addeventlistener($d3863c46a17e8a28$var$autofocus_on_unmount, onunmountautofocus);
                    container1.dispatchevent(unmountevent);
                    if (!unmountevent.defaultprevented) $d3863c46a17e8a28$var$focus(previouslyfocusedelement !== null && previouslyfocusedelement !== void 0 ? previouslyfocusedelement : document.body, {
                        select: true
                    });
                     // we need to remove the listener after we `dispatchevent`
                    container1.removeeventlistener($d3863c46a17e8a28$var$autofocus_on_unmount, onunmountautofocus);
                    $d3863c46a17e8a28$var$focusscopesstack.remove(focusscope);
                }, 0);
            };
        }
    }, [
        container1,
        onmountautofocus,
        onunmountautofocus,
        focusscope
    ]); // takes care of looping focus (when tabbing whilst at the edges)
    const handlekeydown = (0,external_react_namespaceobject.usecallback)((event)=>{
        if (!loop && !trapped) return;
        if (focusscope.paused) return;
        const istabkey = event.key === 'tab' && !event.altkey && !event.ctrlkey && !event.metakey;
        const focusedelement = document.activeelement;
        if (istabkey && focusedelement) {
            const container = event.currenttarget;
            const [first, last] = $d3863c46a17e8a28$var$gettabbableedges(container);
            const hastabbableelementsinside = first && last; // we can only wrap focus if we have tabbable edges
            if (!hastabbableelementsinside) {
                if (focusedelement === container) event.preventdefault();
            } else {
                if (!event.shiftkey && focusedelement === last) {
                    event.preventdefault();
                    if (loop) $d3863c46a17e8a28$var$focus(first, {
                        select: true
                    });
                } else if (event.shiftkey && focusedelement === first) {
                    event.preventdefault();
                    if (loop) $d3863c46a17e8a28$var$focus(last, {
                        select: true
                    });
                }
            }
        }
    }, [
        loop,
        trapped,
        focusscope.paused
    ]);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
        tabindex: -1
    }, scopeprops, {
        ref: composedrefs,
        onkeydown: handlekeydown
    }));
});
/*#__pure__*/ object.assign($d3863c46a17e8a28$export$20e40289641fbbb6, {
    displayname: $d3863c46a17e8a28$var$focus_scope_name
});
/* -------------------------------------------------------------------------------------------------
 * utils
 * -----------------------------------------------------------------------------------------------*/ /**
 * attempts focusing the first element in a list of candidates.
 * stops when focus has actually moved.
 */ function $d3863c46a17e8a28$var$focusfirst(candidates, { select: select = false  } = {}) {
    const previouslyfocusedelement = document.activeelement;
    for (const candidate of candidates){
        $d3863c46a17e8a28$var$focus(candidate, {
            select: select
        });
        if (document.activeelement !== previouslyfocusedelement) return;
    }
}
/**
 * returns the first and last tabbable elements inside a container.
 */ function $d3863c46a17e8a28$var$gettabbableedges(container) {
    const candidates = $d3863c46a17e8a28$var$gettabbablecandidates(container);
    const first = $d3863c46a17e8a28$var$findvisible(candidates, container);
    const last = $d3863c46a17e8a28$var$findvisible(candidates.reverse(), container);
    return [
        first,
        last
    ];
}
/**
 * returns a list of potential tabbable candidates.
 *
 * note: this is only a close approximation. for example it doesn't take into account cases like when
 * elements are not visible. this cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). we deal with these cases separately.
 *
 * see: https://developer.mozilla.org/en-us/docs/web/api/treewalker
 * credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapfocus.tsx#l1
 */ function $d3863c46a17e8a28$var$gettabbablecandidates(container) {
    const nodes = [];
    const walker = document.createtreewalker(container, nodefilter.show_element, {
        acceptnode: (node)=>{
            const ishiddeninput = node.tagname === 'input' && node.type === 'hidden';
            if (node.disabled || node.hidden || ishiddeninput) return nodefilter.filter_skip; // `.tabindex` is not the same as the `tabindex` attribute. it works on the
            // runtime's understanding of tabbability, so this automatically accounts
            // for any kind of element that could be tabbed to.
            return node.tabindex >= 0 ? nodefilter.filter_accept : nodefilter.filter_skip;
        }
    });
    while(walker.nextnode())nodes.push(walker.currentnode); // we do not take into account the order of nodes with positive `tabindex` as it
    // hinders accessibility to have tab order different from visual order.
    return nodes;
}
/**
 * returns the first visible element in a list.
 * note: only checks visibility up to the `container`.
 */ function $d3863c46a17e8a28$var$findvisible(elements, container) {
    for (const element of elements){
        // we stop checking if it's hidden at the `container` level (excluding)
        if (!$d3863c46a17e8a28$var$ishidden(element, {
            upto: container
        })) return element;
    }
}
function $d3863c46a17e8a28$var$ishidden(node, { upto: upto  }) {
    if (getcomputedstyle(node).visibility === 'hidden') return true;
    while(node){
        // we stop at `upto` (excluding it)
        if (upto !== undefined && node === upto) return false;
        if (getcomputedstyle(node).display === 'none') return true;
        node = node.parentelement;
    }
    return false;
}
function $d3863c46a17e8a28$var$isselectableinput(element) {
    return element instanceof htmlinputelement && 'select' in element;
}
function $d3863c46a17e8a28$var$focus(element, { select: select = false  } = {}) {
    // only focus if that element is focusable
    if (element && element.focus) {
        const previouslyfocusedelement = document.activeelement; // note: we prevent scrolling on focus, to minimize jarring transitions for users
        element.focus({
            preventscroll: true
        }); // only select if its not the same element, it supports selection and we need to select
        if (element !== previouslyfocusedelement && $d3863c46a17e8a28$var$isselectableinput(element) && select) element.select();
    }
}
/* -------------------------------------------------------------------------------------------------
 * focusscope stack
 * -----------------------------------------------------------------------------------------------*/ const $d3863c46a17e8a28$var$focusscopesstack = $d3863c46a17e8a28$var$createfocusscopesstack();
function $d3863c46a17e8a28$var$createfocusscopesstack() {
    /** a stack of focus scopes, with the active one at the top */ let stack = [];
    return {
        add (focusscope) {
            // pause the currently active focus scope (at the top of the stack)
            const activefocusscope = stack[0];
            if (focusscope !== activefocusscope) activefocusscope === null || activefocusscope === void 0 || activefocusscope.pause();
             // remove in case it already exists (because we'll re-add it at the top of the stack)
            stack = $d3863c46a17e8a28$var$arrayremove(stack, focusscope);
            stack.unshift(focusscope);
        },
        remove (focusscope) {
            var _stack$;
            stack = $d3863c46a17e8a28$var$arrayremove(stack, focusscope);
            (_stack$ = stack[0]) === null || _stack$ === void 0 || _stack$.resume();
        }
    };
}
function $d3863c46a17e8a28$var$arrayremove(array, item) {
    const updatedarray = [
        ...array
    ];
    const index = updatedarray.indexof(item);
    if (index !== -1) updatedarray.splice(index, 1);
    return updatedarray;
}
function $d3863c46a17e8a28$var$removelinks(items) {
    return items.filter((item)=>item.tagname !== 'a'
    );
}
const $d3863c46a17e8a28$export$be92b6f5f03c0fe9 = (/* unused pure expression or super */ null && ($d3863c46a17e8a28$export$20e40289641fbbb6));





;// ./node_modules/@radix-ui/react-portal/dist/index.mjs









/* -------------------------------------------------------------------------------------------------
 * portal
 * -----------------------------------------------------------------------------------------------*/ const $f1701beae083dbae$var$portal_name = 'portal';
const $f1701beae083dbae$export$602eac185826482c = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    var _globalthis$document;
    const { container: container = globalthis === null || globalthis === void 0 ? void 0 : (_globalthis$document = globalthis.document) === null || _globalthis$document === void 0 ? void 0 : _globalthis$document.body , ...portalprops } = props;
    return container ? /*#__pure__*/ external_reactdom_namespaceobject.createportal(/*#__pure__*/ (0,external_react_namespaceobject.createelement)($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, portalprops, {
        ref: forwardedref
    })), container) : null;
});
/*#__pure__*/ object.assign($f1701beae083dbae$export$602eac185826482c, {
    displayname: $f1701beae083dbae$var$portal_name
});
/* -----------------------------------------------------------------------------------------------*/ const $f1701beae083dbae$export$be92b6f5f03c0fe9 = (/* unused pure expression or super */ null && ($f1701beae083dbae$export$602eac185826482c));





;// ./node_modules/@radix-ui/react-presence/dist/index.mjs










function $fe963b355347cc68$export$3e6543de14f8614f(initialstate, machine) {
    return (0,external_react_namespaceobject.usereducer)((state, event)=>{
        const nextstate = machine[state][event];
        return nextstate !== null && nextstate !== void 0 ? nextstate : state;
    }, initialstate);
}


const $921a889cee6df7e8$export$99c2b779aa4e8b8b = (props)=>{
    const { present: present , children: children  } = props;
    const presence = $921a889cee6df7e8$var$usepresence(present);
    const child = typeof children === 'function' ? children({
        present: presence.ispresent
    }) : external_react_namespaceobject.children.only(children);
    const ref = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(presence.ref, child.ref);
    const forcemount = typeof children === 'function';
    return forcemount || presence.ispresent ? /*#__pure__*/ (0,external_react_namespaceobject.cloneelement)(child, {
        ref: ref
    }) : null;
};
$921a889cee6df7e8$export$99c2b779aa4e8b8b.displayname = 'presence';
/* -------------------------------------------------------------------------------------------------
 * usepresence
 * -----------------------------------------------------------------------------------------------*/ function $921a889cee6df7e8$var$usepresence(present) {
    const [node1, setnode] = (0,external_react_namespaceobject.usestate)();
    const stylesref = (0,external_react_namespaceobject.useref)({});
    const prevpresentref = (0,external_react_namespaceobject.useref)(present);
    const prevanimationnameref = (0,external_react_namespaceobject.useref)('none');
    const initialstate = present ? 'mounted' : 'unmounted';
    const [state, send] = $fe963b355347cc68$export$3e6543de14f8614f(initialstate, {
        mounted: {
            unmount: 'unmounted',
            animation_out: 'unmountsuspended'
        },
        unmountsuspended: {
            mount: 'mounted',
            animation_end: 'unmounted'
        },
        unmounted: {
            mount: 'mounted'
        }
    });
    (0,external_react_namespaceobject.useeffect)(()=>{
        const currentanimationname = $921a889cee6df7e8$var$getanimationname(stylesref.current);
        prevanimationnameref.current = state === 'mounted' ? currentanimationname : 'none';
    }, [
        state
    ]);
    $9f79659886946c16$export$e5c5a5f917a5871c(()=>{
        const styles = stylesref.current;
        const waspresent = prevpresentref.current;
        const haspresentchanged = waspresent !== present;
        if (haspresentchanged) {
            const prevanimationname = prevanimationnameref.current;
            const currentanimationname = $921a889cee6df7e8$var$getanimationname(styles);
            if (present) send('mount');
            else if (currentanimationname === 'none' || (styles === null || styles === void 0 ? void 0 : styles.display) === 'none') // if there is no exit animation or the element is hidden, animations won't run
            // so we unmount instantly
            send('unmount');
            else {
                /**
         * when `present` changes to `false`, we check changes to animation-name to
         * determine whether an animation has started. we chose this approach (reading
         * computed styles) because there is no `animationrun` event and `animationstart`
         * fires after `animation-delay` has expired which would be too late.
         */ const isanimating = prevanimationname !== currentanimationname;
                if (waspresent && isanimating) send('animation_out');
                else send('unmount');
            }
            prevpresentref.current = present;
        }
    }, [
        present,
        send
    ]);
    $9f79659886946c16$export$e5c5a5f917a5871c(()=>{
        if (node1) {
            /**
       * triggering an animation_out during an animation_in will fire an `animationcancel`
       * event for animation_in after we have entered `unmountsuspended` state. so, we
       * make sure we only trigger animation_end for the currently active animation.
       */ const handleanimationend = (event)=>{
                const currentanimationname = $921a889cee6df7e8$var$getanimationname(stylesref.current);
                const iscurrentanimation = currentanimationname.includes(event.animationname);
                if (event.target === node1 && iscurrentanimation) // with react 18 concurrency this update is applied
                // a frame after the animation ends, creating a flash of visible content.
                // by manually flushing we ensure they sync within a frame, removing the flash.
                (0,external_reactdom_namespaceobject.flushsync)(()=>send('animation_end')
                );
            };
            const handleanimationstart = (event)=>{
                if (event.target === node1) // if animation occurred, store its name as the previous animation.
                prevanimationnameref.current = $921a889cee6df7e8$var$getanimationname(stylesref.current);
            };
            node1.addeventlistener('animationstart', handleanimationstart);
            node1.addeventlistener('animationcancel', handleanimationend);
            node1.addeventlistener('animationend', handleanimationend);
            return ()=>{
                node1.removeeventlistener('animationstart', handleanimationstart);
                node1.removeeventlistener('animationcancel', handleanimationend);
                node1.removeeventlistener('animationend', handleanimationend);
            };
        } else // transition to the unmounted state if the node is removed prematurely.
        // we avoid doing so during cleanup as the node may change but still exist.
        send('animation_end');
    }, [
        node1,
        send
    ]);
    return {
        ispresent: [
            'mounted',
            'unmountsuspended'
        ].includes(state),
        ref: (0,external_react_namespaceobject.usecallback)((node)=>{
            if (node) stylesref.current = getcomputedstyle(node);
            setnode(node);
        }, [])
    };
}
/* -----------------------------------------------------------------------------------------------*/ function $921a889cee6df7e8$var$getanimationname(styles) {
    return (styles === null || styles === void 0 ? void 0 : styles.animationname) || 'none';
}





;// ./node_modules/@radix-ui/react-focus-guards/dist/index.mjs



/** number of components which have requested interest to have focus guards */ let $3db38b7d1fb3fe6a$var$count = 0;
function $3db38b7d1fb3fe6a$export$ac5b58043b79449b(props) {
    $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c();
    return props.children;
}
/**
 * injects a pair of focus guards at the edges of the whole dom tree
 * to ensure `focusin` & `focusout` events can be caught consistently.
 */ function $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c() {
    (0,external_react_namespaceobject.useeffect)(()=>{
        var _edgeguards$, _edgeguards$2;
        const edgeguards = document.queryselectorall('[data-radix-focus-guard]');
        document.body.insertadjacentelement('afterbegin', (_edgeguards$ = edgeguards[0]) !== null && _edgeguards$ !== void 0 ? _edgeguards$ : $3db38b7d1fb3fe6a$var$createfocusguard());
        document.body.insertadjacentelement('beforeend', (_edgeguards$2 = edgeguards[1]) !== null && _edgeguards$2 !== void 0 ? _edgeguards$2 : $3db38b7d1fb3fe6a$var$createfocusguard());
        $3db38b7d1fb3fe6a$var$count++;
        return ()=>{
            if ($3db38b7d1fb3fe6a$var$count === 1) document.queryselectorall('[data-radix-focus-guard]').foreach((node)=>node.remove()
            );
            $3db38b7d1fb3fe6a$var$count--;
        };
    }, []);
}
function $3db38b7d1fb3fe6a$var$createfocusguard() {
    const element = document.createelement('span');
    element.setattribute('data-radix-focus-guard', '');
    element.tabindex = 0;
    element.style.csstext = 'outline: none; opacity: 0; position: fixed; pointer-events: none';
    return element;
}
const $3db38b7d1fb3fe6a$export$be92b6f5f03c0fe9 = (/* unused pure expression or super */ null && ($3db38b7d1fb3fe6a$export$ac5b58043b79449b));





;// ./node_modules/tslib/tslib.es6.mjs
/******************************************************************************
copyright (c) microsoft corporation.

permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

the software is provided "as is" and the author disclaims all warranties with
regard to this software including all implied warranties of merchantability
and fitness. in no event shall the author be liable for any special, direct,
indirect, or consequential damages or any damages whatsoever resulting from
loss of use, data or profits, whether in an action of contract, negligence or
other tortious action, arising out of or in connection with the use or
performance of this software.
***************************************************************************** */
/* global reflect, promise, suppressederror, symbol, iterator */

var extendstatics = function(d, b) {
  extendstatics = object.setprototypeof ||
      ({ __proto__: [] } instanceof array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (object.prototype.hasownproperty.call(b, p)) d[p] = b[p]; };
  return extendstatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new typeerror("class extends value " + string(b) + " is not a constructor or null");
  extendstatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (object.prototype.hasownproperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (object.prototype.hasownproperty.call(s, p) && e.indexof(p) < 0)
      t[p] = s[p];
  if (s != null && typeof object.getownpropertysymbols === "function")
      for (var i = 0, p = object.getownpropertysymbols(s); i < p.length; i++) {
          if (e.indexof(p[i]) < 0 && object.prototype.propertyisenumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = object.getownpropertydescriptor(target, key) : desc, d;
  if (typeof reflect === "object" && typeof reflect.decorate === "function") r = reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && object.defineproperty(target, key, r), r;
}

function __param(paramindex, decorator) {
  return function (target, key) { decorator(target, key, paramindex); }
}

function __esdecorate(ctor, descriptorin, decorators, contextin, initializers, extrainitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new typeerror("function expected"); return f; }
  var kind = contextin.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorin && ctor ? contextin["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorin || (target ? object.getownpropertydescriptor(target, contextin.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextin) context[p] = p === "access" ? {} : contextin[p];
      for (var p in contextin.access) context.access[p] = contextin.access[p];
      context.addinitializer = function (f) { if (done) throw new typeerror("cannot add initializers after decoration has completed"); extrainitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new typeerror("object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) object.defineproperty(target, contextin.name, descriptor);
  done = true;
};

function __runinitializers(thisarg, initializers, value) {
  var usevalue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = usevalue ? initializers[i].call(thisarg, value) : initializers[i].call(thisarg);
  }
  return usevalue ? value : void 0;
};

function __propkey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setfunctionname(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return object.defineproperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadatakey, metadatavalue) {
  if (typeof reflect === "object" && typeof reflect.metadata === "function") return reflect.metadata(metadatakey, metadatavalue);
}

function __awaiter(thisarg, _arguments, p, generator) {
  function adopt(value) { return value instanceof p ? value : new p(function (resolve) { resolve(value); }); }
  return new (p || (p = promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisarg, _arguments || [])).next());
  });
}

function __generator(thisarg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = object.create((typeof iterator === "function" ? iterator : object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof symbol === "function" && (g[symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new typeerror("generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisarg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createbinding = object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = object.getownpropertydescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esmodule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  object.defineproperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportstar(m, o) {
  for (var p in m) if (p !== "default" && !object.prototype.hasownproperty.call(o, p)) __createbinding(o, m, p);
}

function __values(o) {
  var s = typeof symbol === "function" && symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new typeerror(s ? "object is not iterable." : "symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof symbol === "function" && o[symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadarrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadarray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncgenerator(thisarg, _arguments, generator) {
  if (!symbol.asynciterator) throw new typeerror("symbol.asynciterator is not defined.");
  var g = generator.apply(thisarg, _arguments || []), i, q = [];
  return i = object.create((typeof asynciterator === "function" ? asynciterator : object).prototype), verb("next"), verb("throw"), verb("return", awaitreturn), i[symbol.asynciterator] = function () { return this; }, i;
  function awaitreturn(f) { return function (v) { return promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncdelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncvalues(o) {
  if (!symbol.asynciterator) throw new typeerror("symbol.asynciterator is not defined.");
  var m = o[symbol.asynciterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[symbol.asynciterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __maketemplateobject(cooked, raw) {
  if (object.defineproperty) { object.defineproperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setmoduledefault = object.create ? (function(o, v) {
  object.defineproperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownkeys = function(o) {
  ownkeys = object.getownpropertynames || function (o) {
    var ar = [];
    for (var k in o) if (object.prototype.hasownproperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownkeys(o);
};

function __importstar(mod) {
  if (mod && mod.__esmodule) return mod;
  var result = {};
  if (mod != null) for (var k = ownkeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createbinding(result, mod, k[i]);
  __setmoduledefault(result, mod);
  return result;
}

function __importdefault(mod) {
  return (mod && mod.__esmodule) ? mod : { default: mod };
}

function __classprivatefieldget(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new typeerror("private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new typeerror("cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classprivatefieldset(receiver, state, value, kind, f) {
  if (kind === "m") throw new typeerror("private method is not writable");
  if (kind === "a" && !f) throw new typeerror("private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new typeerror("cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classprivatefieldin(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new typeerror("cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __adddisposableresource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new typeerror("object expected.");
    var dispose, inner;
    if (async) {
      if (!symbol.asyncdispose) throw new typeerror("symbol.asyncdispose is not defined.");
      dispose = value[symbol.asyncdispose];
    }
    if (dispose === void 0) {
      if (!symbol.dispose) throw new typeerror("symbol.dispose is not defined.");
      dispose = value[symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new typeerror("object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _suppressederror = typeof suppressederror === "function" ? suppressederror : function (error, suppressed, message) {
  var e = new error(message);
  return e.name = "suppressederror", e.error = error, e.suppressed = suppressed, e;
};

function __disposeresources(env) {
  function fail(e) {
    env.error = env.haserror ? new _suppressederror(e, env.error, "an error was suppressed during disposal.") : e;
    env.haserror = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.haserror ? promise.reject(env.error) : promise.resolve();
    if (env.haserror) throw env.error;
  }
  return next();
}

function __rewriterelativeimportextension(path, preservejsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preservejsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.tolowercase() + "js");
      });
  }
  return path;
}

/* harmony default export */ const tslib_es6 = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esdecorate,
  __runinitializers,
  __propkey,
  __setfunctionname,
  __metadata,
  __awaiter,
  __generator,
  __createbinding,
  __exportstar,
  __values,
  __read,
  __spread,
  __spreadarrays,
  __spreadarray,
  __await,
  __asyncgenerator,
  __asyncdelegator,
  __asyncvalues,
  __maketemplateobject,
  __importstar,
  __importdefault,
  __classprivatefieldget,
  __classprivatefieldset,
  __classprivatefieldin,
  __adddisposableresource,
  __disposeresources,
  __rewriterelativeimportextension,
});

;// ./node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var zerorightclassname = 'right-scroll-bar-position';
var fullwidthclassname = 'width-before-scroll-bar';
var noscrollbarsclassname = 'with-scroll-bars-hidden';
/**
 * name of a css variable containing the amount of "hidden" scrollbar
 * ! might be undefined ! use will fallback!
 */
var removedbarsizevariable = '--removed-body-scroll-bar-size';

;// ./node_modules/use-callback-ref/dist/es2015/assignref.js
/**
 * assigns a value for a given ref, no matter of the ref format
 * @param {refobject} ref - a callback function or ref object
 * @param value - a new value
 *
 * @see https://github.com/thekashey/use-callback-ref#assignref
 * @example
 * const refobject = useref();
 * const reffn = (ref) => {....}
 *
 * assignref(refobject, "refvalue");
 * assignref(reffn, "refvalue");
 */
function assignref(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    }
    else if (ref) {
        ref.current = value;
    }
    return ref;
}

;// ./node_modules/use-callback-ref/dist/es2015/useref.js

/**
 * creates a mutableref with ref change callback
 * @param initialvalue - initial ref value
 * @param {function} callback - a callback to run when value changes
 *
 * @example
 * const ref = usecallbackref(0, (newvalue, oldvalue) => console.log(oldvalue, '->', newvalue);
 * ref.current = 1;
 * // prints 0 -> 1
 *
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 * @see https://github.com/thekashey/use-callback-ref#usecallbackref---to-replace-reactuseref
 * @returns {mutablerefobject}
 */
function usecallbackref(initialvalue, callback) {
    var ref = (0,external_react_namespaceobject.usestate)(function () { return ({
        // value
        value: initialvalue,
        // last callback
        callback: callback,
        // "memoized" public interface
        facade: {
            get current() {
                return ref.value;
            },
            set current(value) {
                var last = ref.value;
                if (last !== value) {
                    ref.value = value;
                    ref.callback(value, last);
                }
            },
        },
    }); })[0];
    // update callback
    ref.callback = callback;
    return ref.facade;
}

;// ./node_modules/use-callback-ref/dist/es2015/usemergeref.js



var useisomorphiclayouteffect = typeof window !== 'undefined' ? external_react_namespaceobject.uselayouteffect : external_react_namespaceobject.useeffect;
var currentvalues = new weakmap();
/**
 * merges two or more refs together providing a single interface to set their value
 * @param {refobject|ref} refs
 * @returns {mutablerefobject} - a new ref, which translates all changes to {refs}
 *
 * @see {@link mergerefs} a version without buit-in memoization
 * @see https://github.com/thekashey/use-callback-ref#usemergerefs
 * @example
 * const component = react.forwardref((props, ref) => {
 *   const ownref = useref();
 *   const domref = usemergerefs([ref, ownref]); // ðÿ‘ˆ merge together
 *   return <div ref={domref}>...</div>
 * }
 */
function usemergerefs(refs, defaultvalue) {
    var callbackref = usecallbackref(defaultvalue || null, function (newvalue) {
        return refs.foreach(function (ref) { return assignref(ref, newvalue); });
    });
    // handle refs changes - added or removed
    useisomorphiclayouteffect(function () {
        var oldvalue = currentvalues.get(callbackref);
        if (oldvalue) {
            var prevrefs_1 = new set(oldvalue);
            var nextrefs_1 = new set(refs);
            var current_1 = callbackref.current;
            prevrefs_1.foreach(function (ref) {
                if (!nextrefs_1.has(ref)) {
                    assignref(ref, null);
                }
            });
            nextrefs_1.foreach(function (ref) {
                if (!prevrefs_1.has(ref)) {
                    assignref(ref, current_1);
                }
            });
        }
        currentvalues.set(callbackref, refs);
    }, [refs]);
    return callbackref;
}

;// ./node_modules/use-sidecar/dist/es2015/medium.js

function itoi(a) {
    return a;
}
function innercreatemedium(defaults, middleware) {
    if (middleware === void 0) { middleware = itoi; }
    var buffer = [];
    var assigned = false;
    var medium = {
        read: function () {
            if (assigned) {
                throw new error('sidecar: could not `read` from an `assigned` medium. `read` could be used only with `usemedium`.');
            }
            if (buffer.length) {
                return buffer[buffer.length - 1];
            }
            return defaults;
        },
        usemedium: function (data) {
            var item = middleware(data, assigned);
            buffer.push(item);
            return function () {
                buffer = buffer.filter(function (x) { return x !== item; });
            };
        },
        assignsyncmedium: function (cb) {
            assigned = true;
            while (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.foreach(cb);
            }
            buffer = {
                push: function (x) { return cb(x); },
                filter: function () { return buffer; },
            };
        },
        assignmedium: function (cb) {
            assigned = true;
            var pendingqueue = [];
            if (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.foreach(cb);
                pendingqueue = buffer;
            }
            var executequeue = function () {
                var cbs = pendingqueue;
                pendingqueue = [];
                cbs.foreach(cb);
            };
            var cycle = function () { return promise.resolve().then(executequeue); };
            cycle();
            buffer = {
                push: function (x) {
                    pendingqueue.push(x);
                    cycle();
                },
                filter: function (filter) {
                    pendingqueue = pendingqueue.filter(filter);
                    return buffer;
                },
            };
        },
    };
    return medium;
}
function createmedium(defaults, middleware) {
    if (middleware === void 0) { middleware = itoi; }
    return innercreatemedium(defaults, middleware);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function createsidecarmedium(options) {
    if (options === void 0) { options = {}; }
    var medium = innercreatemedium(null);
    medium.options = __assign({ async: true, ssr: false }, options);
    return medium;
}

;// ./node_modules/react-remove-scroll/dist/es2015/medium.js

var effectcar = createsidecarmedium();

;// ./node_modules/react-remove-scroll/dist/es2015/ui.js





var nothing = function () {
    return;
};
/**
 * removes scrollbar from the page and contain the scroll within the lock
 */
var removescroll = external_react_namespaceobject.forwardref(function (props, parentref) {
    var ref = external_react_namespaceobject.useref(null);
    var _a = external_react_namespaceobject.usestate({
        onscrollcapture: nothing,
        onwheelcapture: nothing,
        ontouchmovecapture: nothing,
    }), callbacks = _a[0], setcallbacks = _a[1];
    var forwardprops = props.forwardprops, children = props.children, classname = props.classname, removescrollbar = props.removescrollbar, enabled = props.enabled, shards = props.shards, sidecar = props.sidecar, noisolation = props.noisolation, inert = props.inert, allowpinchzoom = props.allowpinchzoom, _b = props.as, container = _b === void 0 ? 'div' : _b, rest = __rest(props, ["forwardprops", "children", "classname", "removescrollbar", "enabled", "shards", "sidecar", "noisolation", "inert", "allowpinchzoom", "as"]);
    var sidecar = sidecar;
    var containerref = usemergerefs([ref, parentref]);
    var containerprops = __assign(__assign({}, rest), callbacks);
    return (external_react_namespaceobject.createelement(external_react_namespaceobject.fragment, null,
        enabled && (external_react_namespaceobject.createelement(sidecar, { sidecar: effectcar, removescrollbar: removescrollbar, shards: shards, noisolation: noisolation, inert: inert, setcallbacks: setcallbacks, allowpinchzoom: !!allowpinchzoom, lockref: ref })),
        forwardprops ? (external_react_namespaceobject.cloneelement(external_react_namespaceobject.children.only(children), __assign(__assign({}, containerprops), { ref: containerref }))) : (external_react_namespaceobject.createelement(container, __assign({}, containerprops, { classname: classname, ref: containerref }), children))));
});
removescroll.defaultprops = {
    enabled: true,
    removescrollbar: true,
    inert: false,
};
removescroll.classnames = {
    fullwidth: fullwidthclassname,
    zeroright: zerorightclassname,
};


;// ./node_modules/use-sidecar/dist/es2015/exports.js


var sidecar = function (_a) {
    var sidecar = _a.sidecar, rest = __rest(_a, ["sidecar"]);
    if (!sidecar) {
        throw new error('sidecar: please provide `sidecar` property to import the right car');
    }
    var target = sidecar.read();
    if (!target) {
        throw new error('sidecar medium not found');
    }
    return external_react_namespaceobject.createelement(target, __assign({}, rest));
};
sidecar.issidecarexport = true;
function exportsidecar(medium, exported) {
    medium.usemedium(exported);
    return sidecar;
}

;// ./node_modules/get-nonce/dist/es2015/index.js
var currentnonce;
var setnonce = function (nonce) {
    currentnonce = nonce;
};
var getnonce = function () {
    if (currentnonce) {
        return currentnonce;
    }
    if (true) {
        return __webpack_require__.nc;
    }
    return undefined;
};

;// ./node_modules/react-style-singleton/dist/es2015/singleton.js

function makestyletag() {
    if (!document)
        return null;
    var tag = document.createelement('style');
    tag.type = 'text/css';
    var nonce = getnonce();
    if (nonce) {
        tag.setattribute('nonce', nonce);
    }
    return tag;
}
function injectstyles(tag, css) {
    // @ts-ignore
    if (tag.stylesheet) {
        // @ts-ignore
        tag.stylesheet.csstext = css;
    }
    else {
        tag.appendchild(document.createtextnode(css));
    }
}
function insertstyletag(tag) {
    var head = document.head || document.getelementsbytagname('head')[0];
    head.appendchild(tag);
}
var stylesheetsingleton = function () {
    var counter = 0;
    var stylesheet = null;
    return {
        add: function (style) {
            if (counter == 0) {
                if ((stylesheet = makestyletag())) {
                    injectstyles(stylesheet, style);
                    insertstyletag(stylesheet);
                }
            }
            counter++;
        },
        remove: function () {
            counter--;
            if (!counter && stylesheet) {
                stylesheet.parentnode && stylesheet.parentnode.removechild(stylesheet);
                stylesheet = null;
            }
        },
    };
};

;// ./node_modules/react-style-singleton/dist/es2015/hook.js


/**
 * creates a hook to control style singleton
 * @see {@link stylesingleton} for a safer component version
 * @example
 * ```tsx
 * const usestyle = stylehooksingleton();
 * ///
 * usestyle('body { overflow: hidden}');
 */
var stylehooksingleton = function () {
    var sheet = stylesheetsingleton();
    return function (styles, isdynamic) {
        external_react_namespaceobject.useeffect(function () {
            sheet.add(styles);
            return function () {
                sheet.remove();
            };
        }, [styles && isdynamic]);
    };
};

;// ./node_modules/react-style-singleton/dist/es2015/component.js

/**
 * create a component to add styles on demand
 * - styles are added when first instance is mounted
 * - styles are removed when the last instance is unmounted
 * - changing styles in runtime does nothing unless dynamic is set. but with multiple components that can lead to the undefined behavior
 */
var stylesingleton = function () {
    var usestyle = stylehooksingleton();
    var sheet = function (_a) {
        var styles = _a.styles, dynamic = _a.dynamic;
        usestyle(styles, dynamic);
        return null;
    };
    return sheet;
};

;// ./node_modules/react-style-singleton/dist/es2015/index.js




;// ./node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var zerogap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0,
};
var parse = function (x) { return parseint(x || '', 10) || 0; };
var getoffset = function (gapmode) {
    var cs = window.getcomputedstyle(document.body);
    var left = cs[gapmode === 'padding' ? 'paddingleft' : 'marginleft'];
    var top = cs[gapmode === 'padding' ? 'paddingtop' : 'margintop'];
    var right = cs[gapmode === 'padding' ? 'paddingright' : 'marginright'];
    return [parse(left), parse(top), parse(right)];
};
var getgapwidth = function (gapmode) {
    if (gapmode === void 0) { gapmode = 'margin'; }
    if (typeof window === 'undefined') {
        return zerogap;
    }
    var offsets = getoffset(gapmode);
    var documentwidth = document.documentelement.clientwidth;
    var windowwidth = window.innerwidth;
    return {
        left: offsets[0],
        top: offsets[1],
        right: offsets[2],
        gap: math.max(0, windowwidth - documentwidth + offsets[2] - offsets[0]),
    };
};

;// ./node_modules/react-remove-scroll-bar/dist/es2015/component.js




var style = stylesingleton();
var lockattribute = 'data-scroll-locked';
// important tip - once we measure scrollbar width and remove them
// we could not repeat this operation
// thus we are using style-singleton - only the first "yet correct" style will be applied.
var getstyles = function (_a, allowrelative, gapmode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapmode === void 0) { gapmode = 'margin'; }
    return "\n  .".concat(noscrollbarsclassname, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockattribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
        allowrelative && "position: relative ".concat(important, ";"),
        gapmode === 'margin' &&
            "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
        gapmode === 'padding' && "padding-right: ".concat(gap, "px ").concat(important, ";"),
    ]
        .filter(boolean)
        .join(''), "\n  }\n  \n  .").concat(zerorightclassname, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullwidthclassname, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zerorightclassname, " .").concat(zerorightclassname, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullwidthclassname, " .").concat(fullwidthclassname, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockattribute, "] {\n    ").concat(removedbarsizevariable, ": ").concat(gap, "px;\n  }\n");
};
var getcurrentusecounter = function () {
    var counter = parseint(document.body.getattribute(lockattribute) || '0', 10);
    return isfinite(counter) ? counter : 0;
};
var uselockattribute = function () {
    external_react_namespaceobject.useeffect(function () {
        document.body.setattribute(lockattribute, (getcurrentusecounter() + 1).tostring());
        return function () {
            var newcounter = getcurrentusecounter() - 1;
            if (newcounter <= 0) {
                document.body.removeattribute(lockattribute);
            }
            else {
                document.body.setattribute(lockattribute, newcounter.tostring());
            }
        };
    }, []);
};
/**
 * removes page scrollbar and blocks page scroll when mounted
 */
var removescrollbar = function (_a) {
    var norelative = _a.norelative, noimportant = _a.noimportant, _b = _a.gapmode, gapmode = _b === void 0 ? 'margin' : _b;
    uselockattribute();
    /*
     gap will be measured on every component mount
     however it will be used only by the "first" invocation
     due to singleton nature of <style
     */
    var gap = external_react_namespaceobject.usememo(function () { return getgapwidth(gapmode); }, [gapmode]);
    return external_react_namespaceobject.createelement(style, { styles: getstyles(gap, !norelative, gapmode, !noimportant ? '!important' : '') });
};

;// ./node_modules/react-remove-scroll-bar/dist/es2015/index.js





;// ./node_modules/react-remove-scroll/dist/es2015/aggresivecapture.js
var passivesupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = object.defineproperty({}, 'passive', {
            get: function () {
                passivesupported = true;
                return true;
            },
        });
        // @ts-ignore
        window.addeventlistener('test', options, options);
        // @ts-ignore
        window.removeeventlistener('test', options, options);
    }
    catch (err) {
        passivesupported = false;
    }
}
var nonpassive = passivesupported ? { passive: false } : false;

;// ./node_modules/react-remove-scroll/dist/es2015/handlescroll.js
var alwayscontainsscroll = function (node) {
    // textarea will always _contain_ scroll inside self. it only can be hidden
    return node.tagname === 'textarea';
};
var elementcanbescrolled = function (node, overflow) {
    var styles = window.getcomputedstyle(node);
    return (
    // not-not-scrollable
    styles[overflow] !== 'hidden' &&
        // contains scroll inside self
        !(styles.overflowy === styles.overflowx && !alwayscontainsscroll(node) && styles[overflow] === 'visible'));
};
var elementcouldbevscrolled = function (node) { return elementcanbescrolled(node, 'overflowy'); };
var elementcouldbehscrolled = function (node) { return elementcanbescrolled(node, 'overflowx'); };
var locationcouldbescrolled = function (axis, node) {
    var current = node;
    do {
        // skip over shadow root
        if (typeof shadowroot !== 'undefined' && current instanceof shadowroot) {
            current = current.host;
        }
        var isscrollable = elementcouldbescrolled(axis, current);
        if (isscrollable) {
            var _a = getscrollvariables(axis, current), s = _a[1], d = _a[2];
            if (s > d) {
                return true;
            }
        }
        current = current.parentnode;
    } while (current && current !== document.body);
    return false;
};
var getvscrollvariables = function (_a) {
    var scrolltop = _a.scrolltop, scrollheight = _a.scrollheight, clientheight = _a.clientheight;
    return [
        scrolltop,
        scrollheight,
        clientheight,
    ];
};
var gethscrollvariables = function (_a) {
    var scrollleft = _a.scrollleft, scrollwidth = _a.scrollwidth, clientwidth = _a.clientwidth;
    return [
        scrollleft,
        scrollwidth,
        clientwidth,
    ];
};
var elementcouldbescrolled = function (axis, node) {
    return axis === 'v' ? elementcouldbevscrolled(node) : elementcouldbehscrolled(node);
};
var getscrollvariables = function (axis, node) {
    return axis === 'v' ? getvscrollvariables(node) : gethscrollvariables(node);
};
var getdirectionfactor = function (axis, direction) {
    /**
     * if the element's direction is rtl (right-to-left), then scrollleft is 0 when the scrollbar is at its rightmost position,
     * and then increasingly negative as you scroll towards the end of the content.
     * @see https://developer.mozilla.org/en-us/docs/web/api/element/scrollleft
     */
    return axis === 'h' && direction === 'rtl' ? -1 : 1;
};
var handlescroll = function (axis, endtarget, event, sourcedelta, nooverscroll) {
    var directionfactor = getdirectionfactor(axis, window.getcomputedstyle(endtarget).direction);
    var delta = directionfactor * sourcedelta;
    // find scrollable target
    var target = event.target;
    var targetinlock = endtarget.contains(target);
    var shouldcancelscroll = false;
    var isdeltapositive = delta > 0;
    var availablescroll = 0;
    var availablescrolltop = 0;
    do {
        var _a = getscrollvariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
        var elementscroll = scroll_1 - capacity - directionfactor * position;
        if (position || elementscroll) {
            if (elementcouldbescrolled(axis, target)) {
                availablescroll += elementscroll;
                availablescrolltop += position;
            }
        }
        target = target.parentnode;
    } while (
    // portaled content
    (!targetinlock && target !== document.body) ||
        // self content
        (targetinlock && (endtarget.contains(target) || endtarget === target)));
    if (isdeltapositive && ((nooverscroll && availablescroll === 0) || (!nooverscroll && delta > availablescroll))) {
        shouldcancelscroll = true;
    }
    else if (!isdeltapositive &&
        ((nooverscroll && availablescrolltop === 0) || (!nooverscroll && -delta > availablescrolltop))) {
        shouldcancelscroll = true;
    }
    return shouldcancelscroll;
};

;// ./node_modules/react-remove-scroll/dist/es2015/sideeffect.js






var gettouchxy = function (event) {
    return 'changedtouches' in event ? [event.changedtouches[0].clientx, event.changedtouches[0].clienty] : [0, 0];
};
var getdeltaxy = function (event) { return [event.deltax, event.deltay]; };
var extractref = function (ref) {
    return ref && 'current' in ref ? ref.current : ref;
};
var deltacompare = function (x, y) { return x[0] === y[0] && x[1] === y[1]; };
var generatestyle = function (id) { return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n"); };
var idcounter = 0;
var lockstack = [];
function removescrollsidecar(props) {
    var shouldpreventqueue = external_react_namespaceobject.useref([]);
    var touchstartref = external_react_namespaceobject.useref([0, 0]);
    var activeaxis = external_react_namespaceobject.useref();
    var id = external_react_namespaceobject.usestate(idcounter++)[0];
    var style = external_react_namespaceobject.usestate(function () { return stylesingleton(); })[0];
    var lastprops = external_react_namespaceobject.useref(props);
    external_react_namespaceobject.useeffect(function () {
        lastprops.current = props;
    }, [props]);
    external_react_namespaceobject.useeffect(function () {
        if (props.inert) {
            document.body.classlist.add("block-interactivity-".concat(id));
            var allow_1 = __spreadarray([props.lockref.current], (props.shards || []).map(extractref), true).filter(boolean);
            allow_1.foreach(function (el) { return el.classlist.add("allow-interactivity-".concat(id)); });
            return function () {
                document.body.classlist.remove("block-interactivity-".concat(id));
                allow_1.foreach(function (el) { return el.classlist.remove("allow-interactivity-".concat(id)); });
            };
        }
        return;
    }, [props.inert, props.lockref.current, props.shards]);
    var shouldcancelevent = external_react_namespaceobject.usecallback(function (event, parent) {
        if ('touches' in event && event.touches.length === 2) {
            return !lastprops.current.allowpinchzoom;
        }
        var touch = gettouchxy(event);
        var touchstart = touchstartref.current;
        var deltax = 'deltax' in event ? event.deltax : touchstart[0] - touch[0];
        var deltay = 'deltay' in event ? event.deltay : touchstart[1] - touch[1];
        var currentaxis;
        var target = event.target;
        var movedirection = math.abs(deltax) > math.abs(deltay) ? 'h' : 'v';
        // allow horizontal touch move on range inputs. they will not cause any scroll
        if ('touches' in event && movedirection === 'h' && target.type === 'range') {
            return false;
        }
        var canbescrolledinmaindirection = locationcouldbescrolled(movedirection, target);
        if (!canbescrolledinmaindirection) {
            return true;
        }
        if (canbescrolledinmaindirection) {
            currentaxis = movedirection;
        }
        else {
            currentaxis = movedirection === 'v' ? 'h' : 'v';
            canbescrolledinmaindirection = locationcouldbescrolled(movedirection, target);
            // other axis might be not scrollable
        }
        if (!canbescrolledinmaindirection) {
            return false;
        }
        if (!activeaxis.current && 'changedtouches' in event && (deltax || deltay)) {
            activeaxis.current = currentaxis;
        }
        if (!currentaxis) {
            return true;
        }
        var cancelingaxis = activeaxis.current || currentaxis;
        return handlescroll(cancelingaxis, parent, event, cancelingaxis === 'h' ? deltax : deltay, true);
    }, []);
    var shouldprevent = external_react_namespaceobject.usecallback(function (_event) {
        var event = _event;
        if (!lockstack.length || lockstack[lockstack.length - 1] !== style) {
            // not the last active
            return;
        }
        var delta = 'deltay' in event ? getdeltaxy(event) : gettouchxy(event);
        var sourceevent = shouldpreventqueue.current.filter(function (e) { return e.name === event.type && e.target === event.target && deltacompare(e.delta, delta); })[0];
        // self event, and should be canceled
        if (sourceevent && sourceevent.should) {
            if (event.cancelable) {
                event.preventdefault();
            }
            return;
        }
        // outside or shard event
        if (!sourceevent) {
            var shardnodes = (lastprops.current.shards || [])
                .map(extractref)
                .filter(boolean)
                .filter(function (node) { return node.contains(event.target); });
            var shouldstop = shardnodes.length > 0 ? shouldcancelevent(event, shardnodes[0]) : !lastprops.current.noisolation;
            if (shouldstop) {
                if (event.cancelable) {
                    event.preventdefault();
                }
            }
        }
    }, []);
    var shouldcancel = external_react_namespaceobject.usecallback(function (name, delta, target, should) {
        var event = { name: name, delta: delta, target: target, should: should };
        shouldpreventqueue.current.push(event);
        settimeout(function () {
            shouldpreventqueue.current = shouldpreventqueue.current.filter(function (e) { return e !== event; });
        }, 1);
    }, []);
    var scrolltouchstart = external_react_namespaceobject.usecallback(function (event) {
        touchstartref.current = gettouchxy(event);
        activeaxis.current = undefined;
    }, []);
    var scrollwheel = external_react_namespaceobject.usecallback(function (event) {
        shouldcancel(event.type, getdeltaxy(event), event.target, shouldcancelevent(event, props.lockref.current));
    }, []);
    var scrolltouchmove = external_react_namespaceobject.usecallback(function (event) {
        shouldcancel(event.type, gettouchxy(event), event.target, shouldcancelevent(event, props.lockref.current));
    }, []);
    external_react_namespaceobject.useeffect(function () {
        lockstack.push(style);
        props.setcallbacks({
            onscrollcapture: scrollwheel,
            onwheelcapture: scrollwheel,
            ontouchmovecapture: scrolltouchmove,
        });
        document.addeventlistener('wheel', shouldprevent, nonpassive);
        document.addeventlistener('touchmove', shouldprevent, nonpassive);
        document.addeventlistener('touchstart', scrolltouchstart, nonpassive);
        return function () {
            lockstack = lockstack.filter(function (inst) { return inst !== style; });
            document.removeeventlistener('wheel', shouldprevent, nonpassive);
            document.removeeventlistener('touchmove', shouldprevent, nonpassive);
            document.removeeventlistener('touchstart', scrolltouchstart, nonpassive);
        };
    }, []);
    var removescrollbar = props.removescrollbar, inert = props.inert;
    return (external_react_namespaceobject.createelement(external_react_namespaceobject.fragment, null,
        inert ? external_react_namespaceobject.createelement(style, { styles: generatestyle(id) }) : null,
        removescrollbar ? external_react_namespaceobject.createelement(removescrollbar, { gapmode: "margin" }) : null));
}

;// ./node_modules/react-remove-scroll/dist/es2015/sidecar.js



/* harmony default export */ const sidecar = (exportsidecar(effectcar, removescrollsidecar));

;// ./node_modules/react-remove-scroll/dist/es2015/combination.js




var reactremovescroll = external_react_namespaceobject.forwardref(function (props, ref) { return (external_react_namespaceobject.createelement(removescroll, __assign({}, props, { ref: ref, sidecar: sidecar }))); });
reactremovescroll.classnames = removescroll.classnames;
/* harmony default export */ const combination = (reactremovescroll);

;// ./node_modules/aria-hidden/dist/es2015/index.js
var getdefaultparent = function (originaltarget) {
    if (typeof document === 'undefined') {
        return null;
    }
    var sampletarget = array.isarray(originaltarget) ? originaltarget[0] : originaltarget;
    return sampletarget.ownerdocument.body;
};
var countermap = new weakmap();
var uncontrollednodes = new weakmap();
var markermap = {};
var lockcount = 0;
var unwraphost = function (node) {
    return node && (node.host || unwraphost(node.parentnode));
};
var correcttargets = function (parent, targets) {
    return targets
        .map(function (target) {
        if (parent.contains(target)) {
            return target;
        }
        var correctedtarget = unwraphost(target);
        if (correctedtarget && parent.contains(correctedtarget)) {
            return correctedtarget;
        }
        console.error('aria-hidden', target, 'in not contained inside', parent, '. doing nothing');
        return null;
    })
        .filter(function (x) { return boolean(x); });
};
/**
 * marks everything except given node(or nodes) as aria-hidden
 * @param {element | element[]} originaltarget - elements to keep on the page
 * @param [parentnode] - top element, defaults to document.body
 * @param {string} [markername] - a special attribute to mark every node
 * @param {string} [controlattribute] - html attribute to control
 * @return {undo} undo command
 */
var applyattributetoothers = function (originaltarget, parentnode, markername, controlattribute) {
    var targets = correcttargets(parentnode, array.isarray(originaltarget) ? originaltarget : [originaltarget]);
    if (!markermap[markername]) {
        markermap[markername] = new weakmap();
    }
    var markercounter = markermap[markername];
    var hiddennodes = [];
    var elementstokeep = new set();
    var elementstostop = new set(targets);
    var keep = function (el) {
        if (!el || elementstokeep.has(el)) {
            return;
        }
        elementstokeep.add(el);
        keep(el.parentnode);
    };
    targets.foreach(keep);
    var deep = function (parent) {
        if (!parent || elementstostop.has(parent)) {
            return;
        }
        array.prototype.foreach.call(parent.children, function (node) {
            if (elementstokeep.has(node)) {
                deep(node);
            }
            else {
                try {
                    var attr = node.getattribute(controlattribute);
                    var alreadyhidden = attr !== null && attr !== 'false';
                    var countervalue = (countermap.get(node) || 0) + 1;
                    var markervalue = (markercounter.get(node) || 0) + 1;
                    countermap.set(node, countervalue);
                    markercounter.set(node, markervalue);
                    hiddennodes.push(node);
                    if (countervalue === 1 && alreadyhidden) {
                        uncontrollednodes.set(node, true);
                    }
                    if (markervalue === 1) {
                        node.setattribute(markername, 'true');
                    }
                    if (!alreadyhidden) {
                        node.setattribute(controlattribute, 'true');
                    }
                }
                catch (e) {
                    console.error('aria-hidden: cannot operate on ', node, e);
                }
            }
        });
    };
    deep(parentnode);
    elementstokeep.clear();
    lockcount++;
    return function () {
        hiddennodes.foreach(function (node) {
            var countervalue = countermap.get(node) - 1;
            var markervalue = markercounter.get(node) - 1;
            countermap.set(node, countervalue);
            markercounter.set(node, markervalue);
            if (!countervalue) {
                if (!uncontrollednodes.has(node)) {
                    node.removeattribute(controlattribute);
                }
                uncontrollednodes.delete(node);
            }
            if (!markervalue) {
                node.removeattribute(markername);
            }
        });
        lockcount--;
        if (!lockcount) {
            // clear
            countermap = new weakmap();
            countermap = new weakmap();
            uncontrollednodes = new weakmap();
            markermap = {};
        }
    };
};
/**
 * marks everything except given node(or nodes) as aria-hidden
 * @param {element | element[]} originaltarget - elements to keep on the page
 * @param [parentnode] - top element, defaults to document.body
 * @param {string} [markername] - a special attribute to mark every node
 * @return {undo} undo command
 */
var hideothers = function (originaltarget, parentnode, markername) {
    if (markername === void 0) { markername = 'data-aria-hidden'; }
    var targets = array.from(array.isarray(originaltarget) ? originaltarget : [originaltarget]);
    var activeparentnode = parentnode || getdefaultparent(originaltarget);
    if (!activeparentnode) {
        return function () { return null; };
    }
    // we should not hide arialive elements - https://github.com/thekashey/aria-hidden/issues/10
    targets.push.apply(targets, array.from(activeparentnode.queryselectorall('[aria-live]')));
    return applyattributetoothers(targets, activeparentnode, markername, 'aria-hidden');
};
/**
 * marks everything except given node(or nodes) as inert
 * @param {element | element[]} originaltarget - elements to keep on the page
 * @param [parentnode] - top element, defaults to document.body
 * @param {string} [markername] - a special attribute to mark every node
 * @return {undo} undo command
 */
var inertothers = function (originaltarget, parentnode, markername) {
    if (markername === void 0) { markername = 'data-inert-ed'; }
    var activeparentnode = parentnode || getdefaultparent(originaltarget);
    if (!activeparentnode) {
        return function () { return null; };
    }
    return applyattributetoothers(originaltarget, activeparentnode, markername, 'inert');
};
/**
 * @returns if current browser supports inert
 */
var supportsinert = function () {
    return typeof htmlelement !== 'undefined' && htmlelement.prototype.hasownproperty('inert');
};
/**
 * automatic function to "suppress" dom elements - _hide_ or _inert_ in the best possible way
 * @param {element | element[]} originaltarget - elements to keep on the page
 * @param [parentnode] - top element, defaults to document.body
 * @param {string} [markername] - a special attribute to mark every node
 * @return {undo} undo command
 */
var suppressothers = function (originaltarget, parentnode, markername) {
    if (markername === void 0) { markername = 'data-suppressed'; }
    return (supportsinert() ? inertothers : hideothers)(originaltarget, parentnode, markername);
};

;// ./node_modules/@radix-ui/react-dialog/dist/index.mjs

































/* -------------------------------------------------------------------------------------------------
 * dialog
 * -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$dialog_name = 'dialog';
const [$5d3850c4d0b4e6c7$var$createdialogcontext, $5d3850c4d0b4e6c7$export$cc702773b8ea3e41] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($5d3850c4d0b4e6c7$var$dialog_name);
const [$5d3850c4d0b4e6c7$var$dialogprovider, $5d3850c4d0b4e6c7$var$usedialogcontext] = $5d3850c4d0b4e6c7$var$createdialogcontext($5d3850c4d0b4e6c7$var$dialog_name);
const $5d3850c4d0b4e6c7$export$3ddf2d174ce01153 = (props)=>{
    const { __scopedialog: __scopedialog , children: children , open: openprop , defaultopen: defaultopen , onopenchange: onopenchange , modal: modal = true  } = props;
    const triggerref = (0,external_react_namespaceobject.useref)(null);
    const contentref = (0,external_react_namespaceobject.useref)(null);
    const [open = false, setopen] = $71cd76cc60e0454e$export$6f32135080cb4c3({
        prop: openprop,
        defaultprop: defaultopen,
        onchange: onopenchange
    });
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5d3850c4d0b4e6c7$var$dialogprovider, {
        scope: __scopedialog,
        triggerref: triggerref,
        contentref: contentref,
        contentid: $1746a345f3d73bb7$export$f680877a34711e37(),
        titleid: $1746a345f3d73bb7$export$f680877a34711e37(),
        descriptionid: $1746a345f3d73bb7$export$f680877a34711e37(),
        open: open,
        onopenchange: setopen,
        onopentoggle: (0,external_react_namespaceobject.usecallback)(()=>setopen((prevopen)=>!prevopen
            )
        , [
            setopen
        ]),
        modal: modal
    }, children);
};
/*#__pure__*/ object.assign($5d3850c4d0b4e6c7$export$3ddf2d174ce01153, {
    displayname: $5d3850c4d0b4e6c7$var$dialog_name
});
/* -------------------------------------------------------------------------------------------------
 * dialogtrigger
 * -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$trigger_name = 'dialogtrigger';
const $5d3850c4d0b4e6c7$export$2e1e1122cf0cba88 = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const { __scopedialog: __scopedialog , ...triggerprops } = props;
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$trigger_name, __scopedialog);
    const composedtriggerref = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedref, context.triggerref);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentid,
        "data-state": $5d3850c4d0b4e6c7$var$getstate(context.open)
    }, triggerprops, {
        ref: composedtriggerref,
        onclick: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onclick, context.onopentoggle)
    }));
});
/*#__pure__*/ object.assign($5d3850c4d0b4e6c7$export$2e1e1122cf0cba88, {
    displayname: $5d3850c4d0b4e6c7$var$trigger_name
});
/* -------------------------------------------------------------------------------------------------
 * dialogportal
 * -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$portal_name = 'dialogportal';
const [$5d3850c4d0b4e6c7$var$portalprovider, $5d3850c4d0b4e6c7$var$useportalcontext] = $5d3850c4d0b4e6c7$var$createdialogcontext($5d3850c4d0b4e6c7$var$portal_name, {
    forcemount: undefined
});
const $5d3850c4d0b4e6c7$export$dad7c95542bacce0 = (props)=>{
    const { __scopedialog: __scopedialog , forcemount: forcemount , children: children , container: container  } = props;
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$portal_name, __scopedialog);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5d3850c4d0b4e6c7$var$portalprovider, {
        scope: __scopedialog,
        forcemount: forcemount
    }, external_react_namespaceobject.children.map(children, (child)=>/*#__pure__*/ (0,external_react_namespaceobject.createelement)($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
            present: forcemount || context.open
        }, /*#__pure__*/ (0,external_react_namespaceobject.createelement)($f1701beae083dbae$export$602eac185826482c, {
            aschild: true,
            container: container
        }, child))
    ));
};
/*#__pure__*/ object.assign($5d3850c4d0b4e6c7$export$dad7c95542bacce0, {
    displayname: $5d3850c4d0b4e6c7$var$portal_name
});
/* -------------------------------------------------------------------------------------------------
 * dialogoverlay
 * -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$overlay_name = 'dialogoverlay';
const $5d3850c4d0b4e6c7$export$bd1d06c79be19e17 = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const portalcontext = $5d3850c4d0b4e6c7$var$useportalcontext($5d3850c4d0b4e6c7$var$overlay_name, props.__scopedialog);
    const { forcemount: forcemount = portalcontext.forcemount , ...overlayprops } = props;
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$overlay_name, props.__scopedialog);
    return context.modal ? /*#__pure__*/ (0,external_react_namespaceobject.createelement)($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
        present: forcemount || context.open
    }, /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5d3850c4d0b4e6c7$var$dialogoverlayimpl, _extends({}, overlayprops, {
        ref: forwardedref
    }))) : null;
});
/*#__pure__*/ object.assign($5d3850c4d0b4e6c7$export$bd1d06c79be19e17, {
    displayname: $5d3850c4d0b4e6c7$var$overlay_name
});
const $5d3850c4d0b4e6c7$var$dialogoverlayimpl = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const { __scopedialog: __scopedialog , ...overlayprops } = props;
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$overlay_name, __scopedialog);
    return(/*#__pure__*/ // make sure `content` is scrollable even when it doesn't live inside `removescroll`
    // ie. when `overlay` and `content` are siblings
    (0,external_react_namespaceobject.createelement)(combination, {
        as: $5e63c961fc1ce211$export$8c6ed5c666ac1360,
        allowpinchzoom: true,
        shards: [
            context.contentref
        ]
    }, /*#__pure__*/ (0,external_react_namespaceobject.createelement)($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
        "data-state": $5d3850c4d0b4e6c7$var$getstate(context.open)
    }, overlayprops, {
        ref: forwardedref // we re-enable pointer-events prevented by `dialog.content` to allow scrolling the overlay.
        ,
        style: {
            pointerevents: 'auto',
            ...overlayprops.style
        }
    }))));
});
/* -------------------------------------------------------------------------------------------------
 * dialogcontent
 * -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$content_name = 'dialogcontent';
const $5d3850c4d0b4e6c7$export$b6d9565de1e068cf = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const portalcontext = $5d3850c4d0b4e6c7$var$useportalcontext($5d3850c4d0b4e6c7$var$content_name, props.__scopedialog);
    const { forcemount: forcemount = portalcontext.forcemount , ...contentprops } = props;
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$content_name, props.__scopedialog);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
        present: forcemount || context.open
    }, context.modal ? /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5d3850c4d0b4e6c7$var$dialogcontentmodal, _extends({}, contentprops, {
        ref: forwardedref
    })) : /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5d3850c4d0b4e6c7$var$dialogcontentnonmodal, _extends({}, contentprops, {
        ref: forwardedref
    })));
});
/*#__pure__*/ object.assign($5d3850c4d0b4e6c7$export$b6d9565de1e068cf, {
    displayname: $5d3850c4d0b4e6c7$var$content_name
});
/* -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$dialogcontentmodal = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$content_name, props.__scopedialog);
    const contentref = (0,external_react_namespaceobject.useref)(null);
    const composedrefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedref, context.contentref, contentref); // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    (0,external_react_namespaceobject.useeffect)(()=>{
        const content = contentref.current;
        if (content) return hideothers(content);
    }, []);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5d3850c4d0b4e6c7$var$dialogcontentimpl, _extends({}, props, {
        ref: composedrefs // we make sure focus isn't trapped once `dialogcontent` has been closed
        ,
        trapfocus: context.open,
        disableoutsidepointerevents: true,
        oncloseautofocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.oncloseautofocus, (event)=>{
            var _context$triggerref$c;
            event.preventdefault();
            (_context$triggerref$c = context.triggerref.current) === null || _context$triggerref$c === void 0 || _context$triggerref$c.focus();
        }),
        onpointerdownoutside: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onpointerdownoutside, (event)=>{
            const originalevent = event.detail.originalevent;
            const ctrlleftclick = originalevent.button === 0 && originalevent.ctrlkey === true;
            const isrightclick = originalevent.button === 2 || ctrlleftclick; // if the event is a right-click, we shouldn't close because
            // it is effectively as if we right-clicked the `overlay`.
            if (isrightclick) event.preventdefault();
        }) // when focus is trapped, a `focusout` event may still happen.
        ,
        onfocusoutside: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onfocusoutside, (event)=>event.preventdefault()
        )
    }));
});
/* -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$dialogcontentnonmodal = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$content_name, props.__scopedialog);
    const hasinteractedoutsideref = (0,external_react_namespaceobject.useref)(false);
    const haspointerdownoutsideref = (0,external_react_namespaceobject.useref)(false);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5d3850c4d0b4e6c7$var$dialogcontentimpl, _extends({}, props, {
        ref: forwardedref,
        trapfocus: false,
        disableoutsidepointerevents: false,
        oncloseautofocus: (event)=>{
            var _props$oncloseautofoc;
            (_props$oncloseautofoc = props.oncloseautofocus) === null || _props$oncloseautofoc === void 0 || _props$oncloseautofoc.call(props, event);
            if (!event.defaultprevented) {
                var _context$triggerref$c2;
                if (!hasinteractedoutsideref.current) (_context$triggerref$c2 = context.triggerref.current) === null || _context$triggerref$c2 === void 0 || _context$triggerref$c2.focus(); // always prevent auto focus because we either focus manually or want user agent focus
                event.preventdefault();
            }
            hasinteractedoutsideref.current = false;
            haspointerdownoutsideref.current = false;
        },
        oninteractoutside: (event)=>{
            var _props$oninteractouts, _context$triggerref$c3;
            (_props$oninteractouts = props.oninteractoutside) === null || _props$oninteractouts === void 0 || _props$oninteractouts.call(props, event);
            if (!event.defaultprevented) {
                hasinteractedoutsideref.current = true;
                if (event.detail.originalevent.type === 'pointerdown') haspointerdownoutsideref.current = true;
            } // prevent dismissing when clicking the trigger.
            // as the trigger is already setup to close, without doing so would
            // cause it to close and immediately open.
            const target = event.target;
            const targetistrigger = (_context$triggerref$c3 = context.triggerref.current) === null || _context$triggerref$c3 === void 0 ? void 0 : _context$triggerref$c3.contains(target);
            if (targetistrigger) event.preventdefault(); // on safari if the trigger is inside a container with tabindex={0}, when clicked
            // we will get the pointer down outside event on the trigger, but then a subsequent
            // focus outside event on the container, we ignore any focus outside event when we've
            // already had a pointer down outside event.
            if (event.detail.originalevent.type === 'focusin' && haspointerdownoutsideref.current) event.preventdefault();
        }
    }));
});
/* -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$dialogcontentimpl = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const { __scopedialog: __scopedialog , trapfocus: trapfocus , onopenautofocus: onopenautofocus , oncloseautofocus: oncloseautofocus , ...contentprops } = props;
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$content_name, __scopedialog);
    const contentref = (0,external_react_namespaceobject.useref)(null);
    const composedrefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedref, contentref); // make sure the whole tree has focus guards as our `dialog` will be
    // the last element in the dom (beacuse of the `portal`)
    $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c();
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)(external_react_namespaceobject.fragment, null, /*#__pure__*/ (0,external_react_namespaceobject.createelement)($d3863c46a17e8a28$export$20e40289641fbbb6, {
        aschild: true,
        loop: true,
        trapped: trapfocus,
        onmountautofocus: onopenautofocus,
        onunmountautofocus: oncloseautofocus
    }, /*#__pure__*/ (0,external_react_namespaceobject.createelement)($5cb92bef7577960e$export$177fb62ff3ec1f22, _extends({
        role: "dialog",
        id: context.contentid,
        "aria-describedby": context.descriptionid,
        "aria-labelledby": context.titleid,
        "data-state": $5d3850c4d0b4e6c7$var$getstate(context.open)
    }, contentprops, {
        ref: composedrefs,
        ondismiss: ()=>context.onopenchange(false)
    }))), false);
});
/* -------------------------------------------------------------------------------------------------
 * dialogtitle
 * -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$title_name = 'dialogtitle';
const $5d3850c4d0b4e6c7$export$16f7638e4a34b909 = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const { __scopedialog: __scopedialog , ...titleprops } = props;
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$title_name, __scopedialog);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($8927f6f2acc4f386$export$250ffa63cdc0d034.h2, _extends({
        id: context.titleid
    }, titleprops, {
        ref: forwardedref
    }));
});
/*#__pure__*/ object.assign($5d3850c4d0b4e6c7$export$16f7638e4a34b909, {
    displayname: $5d3850c4d0b4e6c7$var$title_name
});
/* -------------------------------------------------------------------------------------------------
 * dialogdescription
 * -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$description_name = 'dialogdescription';
const $5d3850c4d0b4e6c7$export$94e94c2ec2c954d5 = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const { __scopedialog: __scopedialog , ...descriptionprops } = props;
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$description_name, __scopedialog);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($8927f6f2acc4f386$export$250ffa63cdc0d034.p, _extends({
        id: context.descriptionid
    }, descriptionprops, {
        ref: forwardedref
    }));
});
/*#__pure__*/ object.assign($5d3850c4d0b4e6c7$export$94e94c2ec2c954d5, {
    displayname: $5d3850c4d0b4e6c7$var$description_name
});
/* -------------------------------------------------------------------------------------------------
 * dialogclose
 * -----------------------------------------------------------------------------------------------*/ const $5d3850c4d0b4e6c7$var$close_name = 'dialogclose';
const $5d3850c4d0b4e6c7$export$fba2fb7cd781b7ac = /*#__pure__*/ (0,external_react_namespaceobject.forwardref)((props, forwardedref)=>{
    const { __scopedialog: __scopedialog , ...closeprops } = props;
    const context = $5d3850c4d0b4e6c7$var$usedialogcontext($5d3850c4d0b4e6c7$var$close_name, __scopedialog);
    return /*#__pure__*/ (0,external_react_namespaceobject.createelement)($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
        type: "button"
    }, closeprops, {
        ref: forwardedref,
        onclick: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onclick, ()=>context.onopenchange(false)
        )
    }));
});
/*#__pure__*/ object.assign($5d3850c4d0b4e6c7$export$fba2fb7cd781b7ac, {
    displayname: $5d3850c4d0b4e6c7$var$close_name
});
/* -----------------------------------------------------------------------------------------------*/ function $5d3850c4d0b4e6c7$var$getstate(open) {
    return open ? 'open' : 'closed';
}
const $5d3850c4d0b4e6c7$var$title_warning_name = 'dialogtitlewarning';
const [$5d3850c4d0b4e6c7$export$69b62a49393917d6, $5d3850c4d0b4e6c7$var$usewarningcontext] = $c512c27ab02ef895$export$fd42f52fd3ae1109($5d3850c4d0b4e6c7$var$title_warning_name, {
    contentname: $5d3850c4d0b4e6c7$var$content_name,
    titlename: $5d3850c4d0b4e6c7$var$title_name,
    docsslug: 'dialog'
});
const $5d3850c4d0b4e6c7$var$titlewarning = ({ titleid: titleid  })=>{
    const titlewarningcontext = $5d3850c4d0b4e6c7$var$usewarningcontext($5d3850c4d0b4e6c7$var$title_warning_name);
    const message = `\`${titlewarningcontext.contentname}\` requires a \`${titlewarningcontext.titlename}\` for the component to be accessible for screen reader users.

if you want to hide the \`${titlewarningcontext.titlename}\`, you can wrap it with our visuallyhidden component.

for more information, see https://radix-ui.com/primitives/docs/components/${titlewarningcontext.docsslug}`;
    $67uhm$useeffect(()=>{
        if (titleid) {
            const hastitle = document.getelementbyid(titleid);
            if (!hastitle) throw new error(message);
        }
    }, [
        message,
        titleid
    ]);
    return null;
};
const $5d3850c4d0b4e6c7$var$description_warning_name = 'dialogdescriptionwarning';
const $5d3850c4d0b4e6c7$var$descriptionwarning = ({ contentref: contentref , descriptionid: descriptionid  })=>{
    const descriptionwarningcontext = $5d3850c4d0b4e6c7$var$usewarningcontext($5d3850c4d0b4e6c7$var$description_warning_name);
    const message = `warning: missing \`description\` or \`aria-describedby={undefined}\` for {${descriptionwarningcontext.contentname}}.`;
    $67uhm$useeffect(()=>{
        var _contentref$current;
        const describedbyid = (_contentref$current = contentref.current) === null || _contentref$current === void 0 ? void 0 : _contentref$current.getattribute('aria-describedby'); // if we have an id and the user hasn't set aria-describedby={undefined}
        if (descriptionid && describedbyid) {
            const hasdescription = document.getelementbyid(descriptionid);
            if (!hasdescription) console.warn(message);
        }
    }, [
        message,
        contentref,
        descriptionid
    ]);
    return null;
};
const $5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9 = $5d3850c4d0b4e6c7$export$3ddf2d174ce01153;
const $5d3850c4d0b4e6c7$export$41fb9f06171c75f4 = (/* unused pure expression or super */ null && ($5d3850c4d0b4e6c7$export$2e1e1122cf0cba88));
const $5d3850c4d0b4e6c7$export$602eac185826482c = $5d3850c4d0b4e6c7$export$dad7c95542bacce0;
const $5d3850c4d0b4e6c7$export$c6fdb837b070b4ff = $5d3850c4d0b4e6c7$export$bd1d06c79be19e17;
const $5d3850c4d0b4e6c7$export$7c6e2c02157bb7d2 = $5d3850c4d0b4e6c7$export$b6d9565de1e068cf;
const $5d3850c4d0b4e6c7$export$f99233281efd08a0 = (/* unused pure expression or super */ null && ($5d3850c4d0b4e6c7$export$16f7638e4a34b909));
const $5d3850c4d0b4e6c7$export$393edc798c47379d = (/* unused pure expression or super */ null && ($5d3850c4d0b4e6c7$export$94e94c2ec2c954d5));
const $5d3850c4d0b4e6c7$export$f39c2d165cd861fe = (/* unused pure expression or super */ null && ($5d3850c4d0b4e6c7$export$fba2fb7cd781b7ac));





;// ./node_modules/cmdk/dist/index.mjs
var v='[cmdk-group=""]',dist_x='[cmdk-group-items=""]',ge='[cmdk-group-heading=""]',dist_y='[cmdk-item=""]',le=`${dist_y}:not([aria-disabled="true"])`,q="cmdk-item-select",m="data-value",re=(r,o,n)=>w(r,o,n),ue=external_react_namespaceobject.createcontext(void 0),dist_g=()=>external_react_namespaceobject.usecontext(ue),de=external_react_namespaceobject.createcontext(void 0),z=()=>external_react_namespaceobject.usecontext(de),fe=external_react_namespaceobject.createcontext(void 0),me=external_react_namespaceobject.forwardref((r,o)=>{let n=dist_k(()=>{var e,s;return{search:"",value:(s=(e=r.value)!=null?e:r.defaultvalue)!=null?s:"",filtered:{count:0,items:new map,groups:new set}}}),u=dist_k(()=>new set),c=dist_k(()=>new map),d=dist_k(()=>new map),f=dist_k(()=>new set),p=pe(r),{label:v,children:b,value:l,onvaluechange:y,filter:s,shouldfilter:c,loop:l,disablepointerselection:ee=!1,vimbindings:j=!0,...h}=r,te=external_react_namespaceobject.useid(),$=external_react_namespaceobject.useid(),k=external_react_namespaceobject.useid(),x=external_react_namespaceobject.useref(null),g=me();t(()=>{if(l!==void 0){let e=l.trim();n.current.value=e,h.emit()}},[l]),t(()=>{g(6,re)},[]);let h=external_react_namespaceobject.usememo(()=>({subscribe:e=>(f.current.add(e),()=>f.current.delete(e)),snapshot:()=>n.current,setstate:(e,s,i)=>{var a,m,r;if(!object.is(n.current[e],s)){if(n.current[e]=s,e==="search")z(),q(),g(1,u);else if(e==="value"&&(i||g(5,re),((a=p.current)==null?void 0:a.value)!==void 0)){let e=s!=null?s:"";(r=(m=p.current).onvaluechange)==null||r.call(m,e);return}h.emit()}},emit:()=>{f.current.foreach(e=>e())}}),[]),b=external_react_namespaceobject.usememo(()=>({value:(e,s,i)=>{var a;s!==((a=d.current.get(e))==null?void 0:a.value)&&(d.current.set(e,{value:s,keywords:i}),n.current.filtered.items.set(e,ne(s,i)),g(2,()=>{q(),h.emit()}))},item:(e,s)=>(u.current.add(e),s&&(c.current.has(s)?c.current.get(s).add(e):c.current.set(s,new set([e]))),g(3,()=>{z(),q(),n.current.value||u(),h.emit()}),()=>{d.current.delete(e),u.current.delete(e),n.current.filtered.items.delete(e);let i=o();g(4,()=>{z(),(i==null?void 0:i.getattribute("id"))===e&&u(),h.emit()})}),group:e=>(c.current.has(e)||c.current.set(e,new set),()=>{d.current.delete(e),c.current.delete(e)}),filter:()=>p.current.shouldfilter,label:v||r["aria-label"],disablepointerselection:ee,listid:te,inputid:k,labelid:$,listinnerref:x}),[]);function ne(e,s){var a,m;let i=(m=(a=p.current)==null?void 0:a.filter)!=null?m:re;return e?i(e,n.current.search,s):0}function q(){if(!n.current.search||p.current.shouldfilter===!1)return;let e=n.current.filtered.items,s=[];n.current.filtered.groups.foreach(a=>{let m=c.current.get(a),r=0;m.foreach(e=>{let p=e.get(e);r=math.max(p,r)}),s.push([a,r])});let i=x.current;a().sort((a,m)=>{var p,_;let r=a.getattribute("id"),e=m.getattribute("id");return((p=e.get(e))!=null?p:0)-((_=e.get(r))!=null?_:0)}).foreach(a=>{let m=a.closest(dist_x);m?m.appendchild(a.parentelement===m?a:a.closest(`${dist_x} > *`)):i.appendchild(a.parentelement===i?a:a.closest(`${dist_x} > *`))}),s.sort((a,m)=>m[1]-a[1]).foreach(a=>{let m=x.current.queryselector(`${v}[${m}="${encodeuricomponent(a[0])}"]`);m==null||m.parentelement.appendchild(m)})}function u(){let e=a().find(i=>i.getattribute("aria-disabled")!=="true"),s=e==null?void 0:e.getattribute(m);h.setstate("value",s||void 0)}function z(){var s,i,a,m;if(!n.current.search||p.current.shouldfilter===!1){n.current.filtered.count=u.current.size;return}n.current.filtered.groups=new set;let e=0;for(let r of u.current){let e=(i=(s=d.current.get(r))==null?void 0:s.value)!=null?i:"",p=(m=(a=d.current.get(r))==null?void 0:a.keywords)!=null?m:[],_=ne(e,p);n.current.filtered.items.set(r,_),_>0&&e++}for(let[r,e]of c.current)for(let p of e)if(n.current.filtered.items.get(p)>0){n.current.filtered.groups.add(r);break}n.current.filtered.count=e}function re(){var s,i,a;let e=o();e&&(((s=e.parentelement)==null?void 0:s.firstchild)===e&&((a=(i=e.closest(v))==null?void 0:i.queryselector(ge))==null||a.scrollintoview({block:"nearest"})),e.scrollintoview({block:"nearest"}))}function o(){var e;return(e=x.current)==null?void 0:e.queryselector(`${dist_y}[aria-selected="true"]`)}function a(){var e;return array.from((e=x.current)==null?void 0:e.queryselectorall(le))}function w(e){let i=a()[e];i&&h.setstate("value",i.getattribute(m))}function j(e){var r;let s=o(),i=a(),a=i.findindex(e=>e===s),m=i[a+e];(r=p.current)!=null&&r.loop&&(m=a+e<0?i[i.length-1]:a+e===i.length?i[0]:i[a+e]),m&&h.setstate("value",m.getattribute(m))}function oe(e){let s=o(),i=s==null?void 0:s.closest(v),a;for(;i&&!a;)i=e>0?we(i,v):ie(i,v),a=i==null?void 0:i.queryselector(le);a?h.setstate("value",a.getattribute(m)):j(e)}let ie=()=>w(a().length-1),ae=e=>{e.preventdefault(),e.metakey?ie():e.altkey?oe(1):j(1)},se=e=>{e.preventdefault(),e.metakey?w(0):e.altkey?oe(-1):j(-1)};return external_react_namespaceobject.createelement($8927f6f2acc4f386$export$250ffa63cdc0d034.div,{ref:o,tabindex:-1,...h,"cmdk-root":"",onkeydown:e=>{var s;if((s=h.onkeydown)==null||s.call(h,e),!e.defaultprevented)switch(e.key){case"n":case"j":{j&&e.ctrlkey&&ae(e);break}case"arrowdown":{ae(e);break}case"p":case"k":{j&&e.ctrlkey&&se(e);break}case"arrowup":{se(e);break}case"home":{e.preventdefault(),w(0);break}case"end":{e.preventdefault(),ie();break}case"enter":if(!e.nativeevent.iscomposing&&e.keycode!==229){e.preventdefault();let i=o();if(i){let a=new event(q);i.dispatchevent(a)}}}}},external_react_namespaceobject.createelement("label",{"cmdk-label":"",htmlfor:b.inputid,id:b.labelid,style:de},v),f(r,e=>external_react_namespaceobject.createelement(de.provider,{value:h},external_react_namespaceobject.createelement(ue.provider,{value:b},e))))}),be=external_react_namespaceobject.forwardref((r,o)=>{var k,x;let n=external_react_namespaceobject.useid(),u=external_react_namespaceobject.useref(null),c=external_react_namespaceobject.usecontext(fe),d=dist_g(),f=pe(r),p=(x=(k=f.current)==null?void 0:k.forcemount)!=null?x:c==null?void 0:c.forcemount;t(()=>{if(!p)return d.item(n,c==null?void 0:c.id)},[p]);let v=ve(n,u,[r.value,r.children,u],r.keywords),b=z(),l=dist_d(g=>g.value&&g.value===v.current),y=dist_d(g=>p||d.filter()===!1?!0:g.search?g.filtered.items.get(n)>0:!0);external_react_namespaceobject.useeffect(()=>{let g=u.current;if(!(!g||r.disabled))return g.addeventlistener(q,s),()=>g.removeeventlistener(q,s)},[y,r.onselect,r.disabled]);function s(){var g,h;c(),(h=(g=f.current).onselect)==null||h.call(g,v.current)}function c(){b.setstate("value",v.current,!0)}if(!y)return null;let{disabled:l,value:ee,onselect:j,forcemount:h,keywords:te,...$}=r;return external_react_namespaceobject.createelement($8927f6f2acc4f386$export$250ffa63cdc0d034.div,{ref:n([u,o]),...$,id:n,"cmdk-item":"",role:"option","aria-disabled":!!l,"aria-selected":!!l,"data-disabled":!!l,"data-selected":!!l,onpointermove:l||d.disablepointerselection?void 0:c,onclick:l?void 0:s},r.children)}),he=external_react_namespaceobject.forwardref((r,o)=>{let{heading:n,children:u,forcemount:c,...d}=r,f=external_react_namespaceobject.useid(),p=external_react_namespaceobject.useref(null),v=external_react_namespaceobject.useref(null),b=external_react_namespaceobject.useid(),l=dist_g(),y=dist_d(c=>c||l.filter()===!1?!0:c.search?c.filtered.groups.has(f):!0);t(()=>l.group(f),[]),ve(f,p,[r.value,r.heading,v]);let s=external_react_namespaceobject.usememo(()=>({id:f,forcemount:c}),[c]);return external_react_namespaceobject.createelement($8927f6f2acc4f386$export$250ffa63cdc0d034.div,{ref:n([p,o]),...d,"cmdk-group":"",role:"presentation",hidden:y?void 0:!0},n&&external_react_namespaceobject.createelement("div",{ref:v,"cmdk-group-heading":"","aria-hidden":!0,id:b},n),f(r,c=>external_react_namespaceobject.createelement("div",{"cmdk-group-items":"",role:"group","aria-labelledby":n?b:void 0},external_react_namespaceobject.createelement(fe.provider,{value:s},c))))}),ye=external_react_namespaceobject.forwardref((r,o)=>{let{alwaysrender:n,...u}=r,c=external_react_namespaceobject.useref(null),d=dist_d(f=>!f.search);return!n&&!d?null:external_react_namespaceobject.createelement($8927f6f2acc4f386$export$250ffa63cdc0d034.div,{ref:n([c,o]),...u,"cmdk-separator":"",role:"separator"})}),ee=external_react_namespaceobject.forwardref((r,o)=>{let{onvaluechange:n,...u}=r,c=r.value!=null,d=z(),f=dist_d(l=>l.search),p=dist_d(l=>l.value),v=dist_g(),b=external_react_namespaceobject.usememo(()=>{var y;let l=(y=v.listinnerref.current)==null?void 0:y.queryselector(`${dist_y}[${m}="${encodeuricomponent(p)}"]`);return l==null?void 0:l.getattribute("id")},[]);return external_react_namespaceobject.useeffect(()=>{r.value!=null&&d.setstate("search",r.value)},[r.value]),external_react_namespaceobject.createelement($8927f6f2acc4f386$export$250ffa63cdc0d034.input,{ref:o,...u,"cmdk-input":"",autocomplete:"off",autocorrect:"off",spellcheck:!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,"aria-controls":v.listid,"aria-labelledby":v.labelid,"aria-activedescendant":b,id:v.inputid,type:"text",value:c?r.value:f,onchange:l=>{c||d.setstate("search",l.target.value),n==null||n(l.target.value)}})}),se=external_react_namespaceobject.forwardref((r,o)=>{let{children:n,label:u="suggestions",...c}=r,d=external_react_namespaceobject.useref(null),f=external_react_namespaceobject.useref(null),p=dist_g();return external_react_namespaceobject.useeffect(()=>{if(f.current&&d.current){let v=f.current,b=d.current,l,y=new resizeobserver(()=>{l=requestanimationframe(()=>{let s=v.offsetheight;b.style.setproperty("--cmdk-list-height",s.tofixed(1)+"px")})});return y.observe(v),()=>{cancelanimationframe(l),y.unobserve(v)}}},[]),external_react_namespaceobject.createelement($8927f6f2acc4f386$export$250ffa63cdc0d034.div,{ref:n([d,o]),...c,"cmdk-list":"",role:"listbox","aria-label":u,id:p.listid},f(r,v=>external_react_namespaceobject.createelement("div",{ref:n([f,p.listinnerref]),"cmdk-list-sizer":""},v)))}),ce=external_react_namespaceobject.forwardref((r,o)=>{let{open:n,onopenchange:u,overlayclassname:c,contentclassname:d,container:f,...p}=r;return external_react_namespaceobject.createelement($5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9,{open:n,onopenchange:u},external_react_namespaceobject.createelement($5d3850c4d0b4e6c7$export$602eac185826482c,{container:f},external_react_namespaceobject.createelement($5d3850c4d0b4e6c7$export$c6fdb837b070b4ff,{"cmdk-overlay":"",classname:c}),external_react_namespaceobject.createelement($5d3850c4d0b4e6c7$export$7c6e2c02157bb7d2,{"aria-label":r.label,"cmdk-dialog":"",classname:d},external_react_namespaceobject.createelement(me,{ref:o,...p}))))}),xe=external_react_namespaceobject.forwardref((r,o)=>dist_d(u=>u.filtered.count===0)?external_react_namespaceobject.createelement($8927f6f2acc4f386$export$250ffa63cdc0d034.div,{ref:o,...r,"cmdk-empty":"",role:"presentation"}):null),pe=external_react_namespaceobject.forwardref((r,o)=>{let{progress:n,children:u,label:c="loading...",...d}=r;return external_react_namespaceobject.createelement($8927f6f2acc4f386$export$250ffa63cdc0d034.div,{ref:o,...d,"cmdk-loading":"",role:"progressbar","aria-valuenow":n,"aria-valuemin":0,"aria-valuemax":100,"aria-label":c},f(r,f=>external_react_namespaceobject.createelement("div",{"aria-hidden":!0},f)))}),he=object.assign(me,{list:se,item:be,input:ee,group:he,separator:ye,dialog:ce,empty:xe,loading:pe});function we(r,o){let n=r.nextelementsibling;for(;n;){if(n.matches(o))return n;n=n.nextelementsibling}}function ie(r,o){let n=r.previouselementsibling;for(;n;){if(n.matches(o))return n;n=n.previouselementsibling}}function pe(r){let o=external_react_namespaceobject.useref(r);return t(()=>{o.current=r}),o}var t=typeof window=="undefined"?external_react_namespaceobject.useeffect:external_react_namespaceobject.uselayouteffect;function dist_k(r){let o=external_react_namespaceobject.useref();return o.current===void 0&&(o.current=r()),o}function n(r){return o=>{r.foreach(n=>{typeof n=="function"?n(o):n!=null&&(n.current=o)})}}function dist_d(r){let o=z(),n=()=>r(o.snapshot());return external_react_namespaceobject.usesyncexternalstore(o.subscribe,n,n)}function ve(r,o,n,u=[]){let c=external_react_namespaceobject.useref(),d=dist_g();return t(()=>{var v;let f=(()=>{var b;for(let l of n){if(typeof l=="string")return l.trim();if(typeof l=="object"&&"current"in l)return l.current?(b=l.current.textcontent)==null?void 0:b.trim():c.current}})(),p=u.map(b=>b.trim());d.value(r,f,p),(v=o.current)==null||v.setattribute(m,f),c.current=f}),c}var me=()=>{let[r,o]=external_react_namespaceobject.usestate(),n=dist_k(()=>new map);return t(()=>{n.current.foreach(u=>u()),n.current=new map},[r]),(u,c)=>{n.current.set(u,c),o({})}};function te(r){let o=r.type;return typeof o=="function"?o(r.props):"render"in o?o.render(r.props):r}function f({aschild:r,children:o},n){return r&&external_react_namespaceobject.isvalidelement(o)?external_react_namespaceobject.cloneelement(te(o),{ref:o.ref},n(o.props.children)):n(o)}var de={position:"absolute",width:"1px",height:"1px",padding:"0",margin:"-1px",overflow:"hidden",clip:"rect(0, 0, 0, 0)",whitespace:"nowrap",borderwidth:"0"};

;// ./node_modules/clsx/dist/clsx.mjs
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(array.isarray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const dist_clsx = (clsx);
;// external ["wp","data"]
const external_wp_data_namespaceobject = window["wp"]["data"];
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// external ["wp","components"]
const external_wp_components_namespaceobject = window["wp"]["components"];
;// external ["wp","keyboardshortcuts"]
const external_wp_keyboardshortcuts_namespaceobject = window["wp"]["keyboardshortcuts"];
;// ./node_modules/@wordpress/icons/build-module/icon/index.js

var icon_default = (0,external_wp_element_namespaceobject.forwardref)(
  ({ icon, size = 24, ...props }, ref) => {
    return (0,external_wp_element_namespaceobject.cloneelement)(icon, {
      width: size,
      height: size,
      ...props,
      ref
    });
  }
);


;// external ["wp","primitives"]
const external_wp_primitives_namespaceobject = window["wp"]["primitives"];
;// ./node_modules/@wordpress/icons/build-module/library/search.js


var search_default = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.svg, { xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_wp_primitives_namespaceobject.path, { d: "m13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6s16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" }) });


;// ./node_modules/@wordpress/commands/build-module/store/reducer.js

function commands(state = {}, action) {
  switch (action.type) {
    case "register_command":
      return {
        ...state,
        [action.name]: {
          name: action.name,
          label: action.label,
          searchlabel: action.searchlabel,
          context: action.context,
          callback: action.callback,
          icon: action.icon,
          keywords: action.keywords
        }
      };
    case "unregister_command": {
      const { [action.name]: _, ...remainingstate } = state;
      return remainingstate;
    }
  }
  return state;
}
function commandloaders(state = {}, action) {
  switch (action.type) {
    case "register_command_loader":
      return {
        ...state,
        [action.name]: {
          name: action.name,
          context: action.context,
          hook: action.hook
        }
      };
    case "unregister_command_loader": {
      const { [action.name]: _, ...remainingstate } = state;
      return remainingstate;
    }
  }
  return state;
}
function isopen(state = false, action) {
  switch (action.type) {
    case "open":
      return true;
    case "close":
      return false;
  }
  return state;
}
function context(state = "root", action) {
  switch (action.type) {
    case "set_context":
      return action.context;
  }
  return state;
}
const reducer = (0,external_wp_data_namespaceobject.combinereducers)({
  commands,
  commandloaders,
  isopen,
  context
});
var reducer_default = reducer;


;// ./node_modules/@wordpress/commands/build-module/store/actions.js
function registercommand(config) {
  return {
    type: "register_command",
    ...config
  };
}
function unregistercommand(name) {
  return {
    type: "unregister_command",
    name
  };
}
function registercommandloader(config) {
  return {
    type: "register_command_loader",
    ...config
  };
}
function unregistercommandloader(name) {
  return {
    type: "unregister_command_loader",
    name
  };
}
function actions_open() {
  return {
    type: "open"
  };
}
function actions_close() {
  return {
    type: "close"
  };
}


;// ./node_modules/@wordpress/commands/build-module/store/selectors.js

const getcommands = (0,external_wp_data_namespaceobject.createselector)(
  (state, contextual = false) => object.values(state.commands).filter((command) => {
    const iscontextual = command.context && command.context === state.context;
    return contextual ? iscontextual : !iscontextual;
  }),
  (state) => [state.commands, state.context]
);
const getcommandloaders = (0,external_wp_data_namespaceobject.createselector)(
  (state, contextual = false) => object.values(state.commandloaders).filter((loader) => {
    const iscontextual = loader.context && loader.context === state.context;
    return contextual ? iscontextual : !iscontextual;
  }),
  (state) => [state.commandloaders, state.context]
);
function selectors_isopen(state) {
  return state.isopen;
}
function getcontext(state) {
  return state.context;
}


;// ./node_modules/@wordpress/commands/build-module/store/private-actions.js
function setcontext(context) {
  return {
    type: "set_context",
    context
  };
}


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/commands/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/commands"
);


;// ./node_modules/@wordpress/commands/build-module/store/index.js






const store_name = "core/commands";
const store = (0,external_wp_data_namespaceobject.createreduxstore)(store_name, {
  reducer: reducer_default,
  actions: actions_namespaceobject,
  selectors: selectors_namespaceobject
});
(0,external_wp_data_namespaceobject.register)(store);
unlock(store).registerprivateactions(private_actions_namespaceobject);


;// ./node_modules/@wordpress/commands/build-module/components/command-menu.js










const inputlabel = (0,external_wp_i18n_namespaceobject.__)("search commands and settings");
function commandmenuloader({ name, search, hook, setloader, close }) {
  const { isloading, commands = [] } = hook({ search }) ?? {};
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    setloader(name, isloading);
  }, [setloader, name, isloading]);
  if (!commands.length) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(external_reactjsxruntime_namespaceobject.fragment, { children: commands.map((command) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    he.item,
    {
      value: command.searchlabel ?? command.label,
      keywords: command.keywords,
      onselect: () => command.callback({ close }),
      id: command.name,
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
        external_wp_components_namespaceobject.__experimentalhstack,
        {
          alignment: "left",
          classname: dist_clsx("commands-command-menu__item", {
            "has-icon": command.icon
          }),
          children: [
            command.icon && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(icon_default, { icon: command.icon }),
            /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("span", { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
              external_wp_components_namespaceobject.texthighlight,
              {
                text: command.label,
                highlight: search
              }
            ) })
          ]
        }
      )
    },
    command.name
  )) });
}
function commandmenuloaderwrapper({ hook, search, setloader, close }) {
  const currentloaderref = (0,external_wp_element_namespaceobject.useref)(hook);
  const [key, setkey] = (0,external_wp_element_namespaceobject.usestate)(0);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (currentloaderref.current !== hook) {
      currentloaderref.current = hook;
      setkey((prevkey) => prevkey + 1);
    }
  }, [hook]);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    commandmenuloader,
    {
      hook: currentloaderref.current,
      search,
      setloader,
      close
    },
    key
  );
}
function commandmenugroup({ iscontextual, search, setloader, close }) {
  const { commands, loaders } = (0,external_wp_data_namespaceobject.useselect)(
    (select) => {
      const { getcommands, getcommandloaders } = select(store);
      return {
        commands: getcommands(iscontextual),
        loaders: getcommandloaders(iscontextual)
      };
    },
    [iscontextual]
  );
  if (!commands.length && !loaders.length) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(he.group, { children: [
    commands.map((command) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      he.item,
      {
        value: command.searchlabel ?? command.label,
        keywords: command.keywords,
        onselect: () => command.callback({ close }),
        id: command.name,
        children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(
          external_wp_components_namespaceobject.__experimentalhstack,
          {
            alignment: "left",
            classname: dist_clsx("commands-command-menu__item", {
              "has-icon": command.icon
            }),
            children: [
              command.icon && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(icon_default, { icon: command.icon }),
              /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("span", { children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
                external_wp_components_namespaceobject.texthighlight,
                {
                  text: command.label,
                  highlight: search
                }
              ) })
            ]
          }
        )
      },
      command.name
    )),
    loaders.map((loader) => /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
      commandmenuloaderwrapper,
      {
        hook: loader.hook,
        search,
        setloader,
        close
      },
      loader.name
    ))
  ] });
}
function commandinput({ isopen, search, setsearch }) {
  const commandmenuinput = (0,external_wp_element_namespaceobject.useref)();
  const _value = dist_d((state) => state.value);
  const selecteditemid = (0,external_wp_element_namespaceobject.usememo)(() => {
    const item = document.queryselector(
      `[cmdk-item=""][data-value="${_value}"]`
    );
    return item?.getattribute("id");
  }, [_value]);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (isopen) {
      commandmenuinput.current.focus();
    }
  }, [isopen]);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    he.input,
    {
      ref: commandmenuinput,
      value: search,
      onvaluechange: setsearch,
      placeholder: inputlabel,
      "aria-activedescendant": selecteditemid,
      icon: search
    }
  );
}
function commandmenu() {
  const { registershortcut } = (0,external_wp_data_namespaceobject.usedispatch)(external_wp_keyboardshortcuts_namespaceobject.store);
  const [search, setsearch] = (0,external_wp_element_namespaceobject.usestate)("");
  const isopen = (0,external_wp_data_namespaceobject.useselect)(
    (select) => select(store).isopen(),
    []
  );
  const { open, close } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const [loaders, setloaders] = (0,external_wp_element_namespaceobject.usestate)({});
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    registershortcut({
      name: "core/commands",
      category: "global",
      description: (0,external_wp_i18n_namespaceobject.__)("open the command palette."),
      keycombination: {
        modifier: "primary",
        character: "k"
      }
    });
  }, [registershortcut]);
  (0,external_wp_keyboardshortcuts_namespaceobject.useshortcut)(
    "core/commands",
    /** @type {import('react').keyboardeventhandler} */
    (event) => {
      if (event.defaultprevented) {
        return;
      }
      event.preventdefault();
      if (isopen) {
        close();
      } else {
        open();
      }
    },
    {
      bindglobal: true
    }
  );
  const setloader = (0,external_wp_element_namespaceobject.usecallback)(
    (name, value) => setloaders((current) => ({
      ...current,
      [name]: value
    })),
    []
  );
  const closeandreset = () => {
    setsearch("");
    close();
  };
  if (!isopen) {
    return false;
  }
  const onkeydown = (event) => {
    if (
      // ignore keydowns from imes
      event.nativeevent.iscomposing || // workaround for mac safari where the final enter/backspace of an ime composition
      // is `iscomposing=false`, even though it's technically still part of the composition.
      // these can only be detected by keycode.
      event.keycode === 229
    ) {
      event.preventdefault();
    }
  };
  const isloading = object.values(loaders).some(boolean);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    external_wp_components_namespaceobject.modal,
    {
      classname: "commands-command-menu",
      overlayclassname: "commands-command-menu__overlay",
      onrequestclose: closeandreset,
      __experimentalhideheader: true,
      contentlabel: (0,external_wp_i18n_namespaceobject.__)("command palette"),
      children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("div", { classname: "commands-command-menu__container", children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(he, { label: inputlabel, onkeydown, children: [
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)("div", { classname: "commands-command-menu__header", children: [
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            icon_default,
            {
              classname: "commands-command-menu__header-search-icon",
              icon: search_default
            }
          ),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            commandinput,
            {
              search,
              setsearch,
              isopen
            }
          )
        ] }),
        /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsxs)(he.list, { label: (0,external_wp_i18n_namespaceobject.__)("command suggestions"), children: [
          search && !isloading && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(he.empty, { children: (0,external_wp_i18n_namespaceobject.__)("no results found.") }),
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            commandmenugroup,
            {
              search,
              setloader,
              close: closeandreset,
              iscontextual: true
            }
          ),
          search && /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            commandmenugroup,
            {
              search,
              setloader,
              close: closeandreset
            }
          )
        ] })
      ] }) })
    }
  );
}


;// ./node_modules/@wordpress/commands/build-module/hooks/use-command-context.js




function usecommandcontext(context) {
  const { getcontext } = (0,external_wp_data_namespaceobject.useselect)(store);
  const initialcontext = (0,external_wp_element_namespaceobject.useref)(getcontext());
  const { setcontext } = unlock((0,external_wp_data_namespaceobject.usedispatch)(store));
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    setcontext(context);
  }, [context, setcontext]);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const initialcontextref = initialcontext.current;
    return () => setcontext(initialcontextref);
  }, [setcontext]);
}


;// ./node_modules/@wordpress/commands/build-module/private-apis.js


const privateapis = {};
lock(privateapis, {
  usecommandcontext: usecommandcontext
});


;// ./node_modules/@wordpress/commands/build-module/hooks/use-command.js



function usecommand(command) {
  const { registercommand, unregistercommand } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const currentcallbackref = (0,external_wp_element_namespaceobject.useref)(command.callback);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    currentcallbackref.current = command.callback;
  }, [command.callback]);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (command.disabled) {
      return;
    }
    registercommand({
      name: command.name,
      context: command.context,
      label: command.label,
      searchlabel: command.searchlabel,
      icon: command.icon,
      keywords: command.keywords,
      callback: (...args) => currentcallbackref.current(...args)
    });
    return () => {
      unregistercommand(command.name);
    };
  }, [
    command.name,
    command.label,
    command.searchlabel,
    command.icon,
    command.context,
    command.keywords,
    command.disabled,
    registercommand,
    unregistercommand
  ]);
}
function usecommands(commands) {
  const { registercommand, unregistercommand } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  const currentcallbacksref = (0,external_wp_element_namespaceobject.useref)({});
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (!commands) {
      return;
    }
    commands.foreach((command) => {
      if (command.callback) {
        currentcallbacksref.current[command.name] = command.callback;
      }
    });
  }, [commands]);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (!commands) {
      return;
    }
    commands.foreach((command) => {
      if (command.disabled) {
        return;
      }
      registercommand({
        name: command.name,
        context: command.context,
        label: command.label,
        searchlabel: command.searchlabel,
        icon: command.icon,
        keywords: command.keywords,
        callback: (...args) => {
          const callback = currentcallbacksref.current[command.name];
          if (callback) {
            callback(...args);
          }
        }
      });
    });
    return () => {
      commands.foreach((command) => {
        unregistercommand(command.name);
      });
    };
  }, [commands, registercommand, unregistercommand]);
}


;// ./node_modules/@wordpress/commands/build-module/hooks/use-command-loader.js



function usecommandloader(loader) {
  const { registercommandloader, unregistercommandloader } = (0,external_wp_data_namespaceobject.usedispatch)(store);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (loader.disabled) {
      return;
    }
    registercommandloader({
      name: loader.name,
      hook: loader.hook,
      context: loader.context
    });
    return () => {
      unregistercommandloader(loader.name);
    };
  }, [
    loader.name,
    loader.hook,
    loader.context,
    loader.disabled,
    registercommandloader,
    unregistercommandloader
  ]);
}


;// ./node_modules/@wordpress/commands/build-module/index.js







(window.wp = window.wp || {}).commands = __webpack_exports__;
/******/ })()
;



