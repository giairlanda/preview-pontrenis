/**
 * @license react
 * react.development.js
 *
 * copyright (c) facebook, inc. and its affiliates.
 *
 * this source code is licensed under the mit license found in the
 * license file in the root directory of this source tree.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.react = {}));
}(this, (function (exports) { 'use strict';

  var reactversion = '18.3.1';

  // attention
  // when adding new symbols to this file,
  // please consider also adding to 'react-devtools-shared/src/backend/reactsymbols'
  // the symbol used to tag the reactelement-like types.
  var react_element_type = symbol.for('react.element');
  var react_portal_type = symbol.for('react.portal');
  var react_fragment_type = symbol.for('react.fragment');
  var react_strict_mode_type = symbol.for('react.strict_mode');
  var react_profiler_type = symbol.for('react.profiler');
  var react_provider_type = symbol.for('react.provider');
  var react_context_type = symbol.for('react.context');
  var react_forward_ref_type = symbol.for('react.forward_ref');
  var react_suspense_type = symbol.for('react.suspense');
  var react_suspense_list_type = symbol.for('react.suspense_list');
  var react_memo_type = symbol.for('react.memo');
  var react_lazy_type = symbol.for('react.lazy');
  var react_offscreen_type = symbol.for('react.offscreen');
  var maybe_iterator_symbol = symbol.iterator;
  var faux_iterator_symbol = '@@iterator';
  function getiteratorfn(maybeiterable) {
    if (maybeiterable === null || typeof maybeiterable !== 'object') {
      return null;
    }

    var maybeiterator = maybe_iterator_symbol && maybeiterable[maybe_iterator_symbol] || maybeiterable[faux_iterator_symbol];

    if (typeof maybeiterator === 'function') {
      return maybeiterator;
    }

    return null;
  }

  /**
   * keeps track of the current dispatcher.
   */
  var reactcurrentdispatcher = {
    /**
     * @internal
     * @type {reactcomponent}
     */
    current: null
  };

  /**
   * keeps track of the current batch's configuration such as how long an update
   * should suspend for if it needs to.
   */
  var reactcurrentbatchconfig = {
    transition: null
  };

  var reactcurrentactqueue = {
    current: null,
    // used to reproduce behavior of `batchedupdates` in legacy mode.
    isbatchinglegacy: false,
    didschedulelegacyupdate: false
  };

  /**
   * keeps track of the current owner.
   *
   * the current owner is the component who should own any components that are
   * currently being constructed.
   */
  var reactcurrentowner = {
    /**
     * @internal
     * @type {reactcomponent}
     */
    current: null
  };

  var reactdebugcurrentframe = {};
  var currentextrastackframe = null;
  function setextrastackframe(stack) {
    {
      currentextrastackframe = stack;
    }
  }

  {
    reactdebugcurrentframe.setextrastackframe = function (stack) {
      {
        currentextrastackframe = stack;
      }
    }; // stack implementation injected by the current renderer.


    reactdebugcurrentframe.getcurrentstack = null;

    reactdebugcurrentframe.getstackaddendum = function () {
      var stack = ''; // add an extra top frame while an element is being validated

      if (currentextrastackframe) {
        stack += currentextrastackframe;
      } // delegate to the injected renderer-specific implementation


      var impl = reactdebugcurrentframe.getcurrentstack;

      if (impl) {
        stack += impl() || '';
      }

      return stack;
    };
  }

  // -----------------------------------------------------------------------------

  var enablescopeapi = false; // experimental create event handle api.
  var enablecacheelement = false;
  var enabletransitiontracing = false; // no known bugs, but needs performance testing

  var enablelegacyhidden = false; // enables unstable_avoidthisfallback feature in fiber
  // stuff. intended to enable react core members to more easily debug scheduling
  // issues in dev builds.

  var enabledebugtracing = false; // track which fiber(s) schedule render work.

  var reactsharedinternals = {
    reactcurrentdispatcher: reactcurrentdispatcher,
    reactcurrentbatchconfig: reactcurrentbatchconfig,
    reactcurrentowner: reactcurrentowner
  };

  {
    reactsharedinternals.reactdebugcurrentframe = reactdebugcurrentframe;
    reactsharedinternals.reactcurrentactqueue = reactcurrentactqueue;
  }

  // by calls to these methods by a babel plugin.
  //
  // in prod (or in packages without access to react internals),
  // they are left as they are instead.

  function warn(format) {
    {
      {
        for (var _len = arguments.length, args = new array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        printwarning('warn', format, args);
      }
    }
  }
  function error(format) {
    {
      {
        for (var _len2 = arguments.length, args = new array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        printwarning('error', format, args);
      }
    }
  }

  function printwarning(level, format, args) {
    // when changing this logic, you might want to also
    // update consolewithstackdev.www.js as well.
    {
      var reactdebugcurrentframe = reactsharedinternals.reactdebugcurrentframe;
      var stack = reactdebugcurrentframe.getstackaddendum();

      if (stack !== '') {
        format += '%s';
        args = args.concat([stack]);
      } // eslint-disable-next-line react-internal/safe-string-coercion


      var argswithformat = args.map(function (item) {
        return string(item);
      }); // careful: rn currently depends on this prefix

      argswithformat.unshift('warning: ' + format); // we intentionally don't use spread (or .apply) directly because it
      // breaks ie9: https://github.com/facebook/react/issues/13610
      // eslint-disable-next-line react-internal/no-production-logging

      function.prototype.apply.call(console[level], console, argswithformat);
    }
  }

  var didwarnstateupdateforunmountedcomponent = {};

  function warnnoop(publicinstance, callername) {
    {
      var _constructor = publicinstance.constructor;
      var componentname = _constructor && (_constructor.displayname || _constructor.name) || 'reactclass';
      var warningkey = componentname + "." + callername;

      if (didwarnstateupdateforunmountedcomponent[warningkey]) {
        return;
      }

      error("can't call %s on a component that is not yet mounted. " + 'this is a no-op, but it might indicate a bug in your application. ' + 'instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callername, componentname);

      didwarnstateupdateforunmountedcomponent[warningkey] = true;
    }
  }
  /**
   * this is the abstract api for an update queue.
   */


  var reactnoopupdatequeue = {
    /**
     * checks whether or not this composite component is mounted.
     * @param {reactclass} publicinstance the instance we want to test.
     * @return {boolean} true if mounted, false otherwise.
     * @protected
     * @final
     */
    ismounted: function (publicinstance) {
      return false;
    },

    /**
     * forces an update. this should only be invoked when it is known with
     * certainty that we are **not** in a dom transaction.
     *
     * you may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setstate` was not called.
     *
     * this will not invoke `shouldcomponentupdate`, but it will invoke
     * `componentwillupdate` and `componentdidupdate`.
     *
     * @param {reactclass} publicinstance the instance that should rerender.
     * @param {?function} callback called after component is updated.
     * @param {?string} callername name of the calling function in the public api.
     * @internal
     */
    enqueueforceupdate: function (publicinstance, callback, callername) {
      warnnoop(publicinstance, 'forceupdate');
    },

    /**
     * replaces all of the state. always use this or `setstate` to mutate state.
     * you should treat `this.state` as immutable.
     *
     * there is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {reactclass} publicinstance the instance that should rerender.
     * @param {object} completestate next state.
     * @param {?function} callback called after component is updated.
     * @param {?string} callername name of the calling function in the public api.
     * @internal
     */
    enqueuereplacestate: function (publicinstance, completestate, callback, callername) {
      warnnoop(publicinstance, 'replacestate');
    },

    /**
     * sets a subset of the state. this only exists because _pendingstate is
     * internal. this provides a merging strategy that is not available to deep
     * properties which is confusing. todo: expose pendingstate or don't use it
     * during the merge.
     *
     * @param {reactclass} publicinstance the instance that should rerender.
     * @param {object} partialstate next partial state to be merged with state.
     * @param {?function} callback called after component is updated.
     * @param {?string} name of the calling function in the public api.
     * @internal
     */
    enqueuesetstate: function (publicinstance, partialstate, callback, callername) {
      warnnoop(publicinstance, 'setstate');
    }
  };

  var assign = object.assign;

  var emptyobject = {};

  {
    object.freeze(emptyobject);
  }
  /**
   * base class helpers for the updating state of a component.
   */


  function component(props, context, updater) {
    this.props = props;
    this.context = context; // if a component has string refs, we will assign a different object later.

    this.refs = emptyobject; // we initialize the default updater but the real one gets injected by the
    // renderer.

    this.updater = updater || reactnoopupdatequeue;
  }

  component.prototype.isreactcomponent = {};
  /**
   * sets a subset of the state. always use this to mutate
   * state. you should treat `this.state` as immutable.
   *
   * there is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * there is no guarantee that calls to `setstate` will run synchronously,
   * as they may eventually be batched together.  you can provide an optional
   * callback that will be executed when the call to setstate is actually
   * completed.
   *
   * when a function is provided to setstate, it will be called at some point in
   * the future (not synchronously). it will be called with the up to date
   * component arguments (state, props, context). these values can be different
   * from this.* because your function may be called after receiveprops but before
   * shouldcomponentupdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialstate next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback called after state is updated.
   * @final
   * @protected
   */

  component.prototype.setstate = function (partialstate, callback) {
    if (typeof partialstate !== 'object' && typeof partialstate !== 'function' && partialstate != null) {
      throw new error('setstate(...): takes an object of state variables to update or a ' + 'function which returns an object of state variables.');
    }

    this.updater.enqueuesetstate(this, partialstate, callback, 'setstate');
  };
  /**
   * forces an update. this should only be invoked when it is known with
   * certainty that we are **not** in a dom transaction.
   *
   * you may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setstate` was not called.
   *
   * this will not invoke `shouldcomponentupdate`, but it will invoke
   * `componentwillupdate` and `componentdidupdate`.
   *
   * @param {?function} callback called after update is complete.
   * @final
   * @protected
   */


  component.prototype.forceupdate = function (callback) {
    this.updater.enqueueforceupdate(this, callback, 'forceupdate');
  };
  /**
   * deprecated apis. these apis used to exist on classic react classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. instead, we define a getter that warns if it's accessed.
   */


  {
    var deprecatedapis = {
      ismounted: ['ismounted', 'instead, make sure to clean up subscriptions and pending requests in ' + 'componentwillunmount to prevent memory leaks.'],
      replacestate: ['replacestate', 'refactor your code to use setstate instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };

    var definedeprecationwarning = function (methodname, info) {
      object.defineproperty(component.prototype, methodname, {
        get: function () {
          warn('%s(...) is deprecated in plain javascript react classes. %s', info[0], info[1]);

          return undefined;
        }
      });
    };

    for (var fnname in deprecatedapis) {
      if (deprecatedapis.hasownproperty(fnname)) {
        definedeprecationwarning(fnname, deprecatedapis[fnname]);
      }
    }
  }

  function componentdummy() {}

  componentdummy.prototype = component.prototype;
  /**
   * convenience component with default shallow equality check for scu.
   */

  function purecomponent(props, context, updater) {
    this.props = props;
    this.context = context; // if a component has string refs, we will assign a different object later.

    this.refs = emptyobject;
    this.updater = updater || reactnoopupdatequeue;
  }

  var purecomponentprototype = purecomponent.prototype = new componentdummy();
  purecomponentprototype.constructor = purecomponent; // avoid an extra prototype jump for these methods.

  assign(purecomponentprototype, component.prototype);
  purecomponentprototype.ispurereactcomponent = true;

  // an immutable object with a single mutable value
  function createref() {
    var refobject = {
      current: null
    };

    {
      object.seal(refobject);
    }

    return refobject;
  }

  var isarrayimpl = array.isarray; // eslint-disable-next-line no-redeclare

  function isarray(a) {
    return isarrayimpl(a);
  }

  /*
   * the `'' + value` pattern (used in in perf-sensitive code) throws for symbol
   * and temporal.* types. see https://github.com/facebook/react/pull/22064.
   *
   * the functions in this module will throw an easier-to-understand,
   * easier-to-debug exception with a clear errors message message explaining the
   * problem. (instead of a confusing exception thrown inside the implementation
   * of the `value` object).
   */
  // $flowfixme only called in dev, so void return is not possible.
  function typename(value) {
    {
      // tostringtag is needed for namespaced types like temporal.instant
      var hastostringtag = typeof symbol === 'function' && symbol.tostringtag;
      var type = hastostringtag && value[symbol.tostringtag] || value.constructor.name || 'object';
      return type;
    }
  } // $flowfixme only called in dev, so void return is not possible.


  function willcoercionthrow(value) {
    {
      try {
        teststringcoercion(value);
        return false;
      } catch (e) {
        return true;
      }
    }
  }

  function teststringcoercion(value) {
    // if you ended up here by following an exception call stack, here's what's
    // happened: you supplied an object or symbol value to react (as a prop, key,
    // dom attribute, css property, string ref, etc.) and when react tried to
    // coerce it to a string using `'' + value`, an exception was thrown.
    //
    // the most common types that will cause this exception are `symbol` instances
    // and temporal objects like `temporal.instant`. but any object that has a
    // `valueof` or `[symbol.toprimitive]` method that throws will also cause this
    // exception. (library authors do this to prevent users from using built-in
    // numeric operators like `+` or comparison operators like `>=` because custom
    // methods are needed to perform accurate arithmetic or comparison.)
    //
    // to fix the problem, coerce this object or symbol value to a string before
    // passing it to react. the most reliable way is usually `string(value)`.
    //
    // to find which value is throwing, check the browser or debugger console.
    // before this exception was thrown, there should be `console.error` output
    // that shows the type (symbol, temporal.plaindate, etc.) that caused the
    // problem and how that type was used: key, atrribute, input value prop, etc.
    // in most cases, this console output also shows the component and its
    // ancestor components where the exception happened.
    //
    // eslint-disable-next-line react-internal/safe-string-coercion
    return '' + value;
  }
  function checkkeystringcoercion(value) {
    {
      if (willcoercionthrow(value)) {
        error('the provided key is an unsupported type %s.' + ' this value must be coerced to a string before before using it here.', typename(value));

        return teststringcoercion(value); // throw (to help callers find troubleshooting comments)
      }
    }
  }

  function getwrappedname(outertype, innertype, wrappername) {
    var displayname = outertype.displayname;

    if (displayname) {
      return displayname;
    }

    var functionname = innertype.displayname || innertype.name || '';
    return functionname !== '' ? wrappername + "(" + functionname + ")" : wrappername;
  } // keep in sync with react-reconciler/getcomponentnamefromfiber


  function getcontextname(type) {
    return type.displayname || 'context';
  } // note that the reconciler package should generally prefer to use getcomponentnamefromfiber() instead.


  function getcomponentnamefromtype(type) {
    if (type == null) {
      // host root, text node or just invalid type.
      return null;
    }

    {
      if (typeof type.tag === 'number') {
        error('received an unexpected object in getcomponentnamefromtype(). ' + 'this is likely a bug in react. please file an issue.');
      }
    }

    if (typeof type === 'function') {
      return type.displayname || type.name || null;
    }

    if (typeof type === 'string') {
      return type;
    }

    switch (type) {
      case react_fragment_type:
        return 'fragment';

      case react_portal_type:
        return 'portal';

      case react_profiler_type:
        return 'profiler';

      case react_strict_mode_type:
        return 'strictmode';

      case react_suspense_type:
        return 'suspense';

      case react_suspense_list_type:
        return 'suspenselist';

    }

    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case react_context_type:
          var context = type;
          return getcontextname(context) + '.consumer';

        case react_provider_type:
          var provider = type;
          return getcontextname(provider._context) + '.provider';

        case react_forward_ref_type:
          return getwrappedname(type, type.render, 'forwardref');

        case react_memo_type:
          var outername = type.displayname || null;

          if (outername !== null) {
            return outername;
          }

          return getcomponentnamefromtype(type.type) || 'memo';

        case react_lazy_type:
          {
            var lazycomponent = type;
            var payload = lazycomponent._payload;
            var init = lazycomponent._init;

            try {
              return getcomponentnamefromtype(init(payload));
            } catch (x) {
              return null;
            }
          }

        // eslint-disable-next-line no-fallthrough
      }
    }

    return null;
  }

  var hasownproperty = object.prototype.hasownproperty;

  var reserved_props = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };
  var specialpropkeywarningshown, specialproprefwarningshown, didwarnaboutstringrefs;

  {
    didwarnaboutstringrefs = {};
  }

  function hasvalidref(config) {
    {
      if (hasownproperty.call(config, 'ref')) {
        var getter = object.getownpropertydescriptor(config, 'ref').get;

        if (getter && getter.isreactwarning) {
          return false;
        }
      }
    }

    return config.ref !== undefined;
  }

  function hasvalidkey(config) {
    {
      if (hasownproperty.call(config, 'key')) {
        var getter = object.getownpropertydescriptor(config, 'key').get;

        if (getter && getter.isreactwarning) {
          return false;
        }
      }
    }

    return config.key !== undefined;
  }

  function definekeypropwarninggetter(props, displayname) {
    var warnaboutaccessingkey = function () {
      {
        if (!specialpropkeywarningshown) {
          specialpropkeywarningshown = true;

          error('%s: `key` is not a prop. trying to access it will result ' + 'in `undefined` being returned. if you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayname);
        }
      }
    };

    warnaboutaccessingkey.isreactwarning = true;
    object.defineproperty(props, 'key', {
      get: warnaboutaccessingkey,
      configurable: true
    });
  }

  function definerefpropwarninggetter(props, displayname) {
    var warnaboutaccessingref = function () {
      {
        if (!specialproprefwarningshown) {
          specialproprefwarningshown = true;

          error('%s: `ref` is not a prop. trying to access it will result ' + 'in `undefined` being returned. if you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayname);
        }
      }
    };

    warnaboutaccessingref.isreactwarning = true;
    object.defineproperty(props, 'ref', {
      get: warnaboutaccessingref,
      configurable: true
    });
  }

  function warnifstringrefcannotbeautoconverted(config) {
    {
      if (typeof config.ref === 'string' && reactcurrentowner.current && config.__self && reactcurrentowner.current.statenode !== config.__self) {
        var componentname = getcomponentnamefromtype(reactcurrentowner.current.type);

        if (!didwarnaboutstringrefs[componentname]) {
          error('component "%s" contains the string ref "%s". ' + 'support for string refs will be removed in a future major release. ' + 'this case cannot be automatically converted to an arrow function. ' + 'we ask you to manually fix this case by using useref() or createref() instead. ' + 'learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentname, config.ref);

          didwarnaboutstringrefs[componentname] = true;
        }
      }
    }
  }
  /**
   * factory method to create a new react element. this no longer adheres to
   * the class pattern, so do not use new to call it. also, instanceof check
   * will not work. instead test $$typeof field against symbol.for('react.element') to check
   * if something is a react element.
   *
   * @param {*} type
   * @param {*} props
   * @param {*} key
   * @param {string|object} ref
   * @param {*} owner
   * @param {*} self a *temporary* helper to detect places where `this` is
   * different from the `owner` when react.createelement is called, so that we
   * can warn. we want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source an annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @internal
   */


  var reactelement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // this tag allows us to uniquely identify this as a react element
      $$typeof: react_element_type,
      // built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,
      // record the component responsible for creating this element.
      _owner: owner
    };

    {
      // the validation flag is currently mutative. we put it on
      // an external backing store so that we can freeze the whole object.
      // this can be replaced with a weakmap once they are implemented in
      // commonly used development environments.
      element._store = {}; // to make comparing reactelements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.

      object.defineproperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      }); // self and source are dev only properties.

      object.defineproperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      }); // two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.

      object.defineproperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });

      if (object.freeze) {
        object.freeze(element.props);
        object.freeze(element);
      }
    }

    return element;
  };
  /**
   * create and return a new reactelement of the given type.
   * see https://reactjs.org/docs/react-api.html#createelement
   */

  function createelement(type, config, children) {
    var propname; // reserved names are extracted

    var props = {};
    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      if (hasvalidref(config)) {
        ref = config.ref;

        {
          warnifstringrefcannotbeautoconverted(config);
        }
      }

      if (hasvalidkey(config)) {
        {
          checkkeystringcoercion(config.key);
        }

        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source; // remaining properties are added to a new props object

      for (propname in config) {
        if (hasownproperty.call(config, propname) && !reserved_props.hasownproperty(propname)) {
          props[propname] = config[propname];
        }
      }
    } // children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


    var childrenlength = arguments.length - 2;

    if (childrenlength === 1) {
      props.children = children;
    } else if (childrenlength > 1) {
      var childarray = array(childrenlength);

      for (var i = 0; i < childrenlength; i++) {
        childarray[i] = arguments[i + 2];
      }

      {
        if (object.freeze) {
          object.freeze(childarray);
        }
      }

      props.children = childarray;
    } // resolve default props


    if (type && type.defaultprops) {
      var defaultprops = type.defaultprops;

      for (propname in defaultprops) {
        if (props[propname] === undefined) {
          props[propname] = defaultprops[propname];
        }
      }
    }

    {
      if (key || ref) {
        var displayname = typeof type === 'function' ? type.displayname || type.name || 'unknown' : type;

        if (key) {
          definekeypropwarninggetter(props, displayname);
        }

        if (ref) {
          definerefpropwarninggetter(props, displayname);
        }
      }
    }

    return reactelement(type, key, ref, self, source, reactcurrentowner.current, props);
  }
  function cloneandreplacekey(oldelement, newkey) {
    var newelement = reactelement(oldelement.type, newkey, oldelement.ref, oldelement._self, oldelement._source, oldelement._owner, oldelement.props);
    return newelement;
  }
  /**
   * clone and return a new reactelement using element as the starting point.
   * see https://reactjs.org/docs/react-api.html#cloneelement
   */

  function cloneelement(element, config, children) {
    if (element === null || element === undefined) {
      throw new error("react.cloneelement(...): the argument must be a react element, but you passed " + element + ".");
    }

    var propname; // original props are copied

    var props = assign({}, element.props); // reserved names are extracted

    var key = element.key;
    var ref = element.ref; // self is preserved since the owner is preserved.

    var self = element._self; // source is preserved since cloneelement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.

    var source = element._source; // owner will be preserved, unless ref is overridden

    var owner = element._owner;

    if (config != null) {
      if (hasvalidref(config)) {
        // silently steal the ref from the parent.
        ref = config.ref;
        owner = reactcurrentowner.current;
      }

      if (hasvalidkey(config)) {
        {
          checkkeystringcoercion(config.key);
        }

        key = '' + config.key;
      } // remaining properties override existing props


      var defaultprops;

      if (element.type && element.type.defaultprops) {
        defaultprops = element.type.defaultprops;
      }

      for (propname in config) {
        if (hasownproperty.call(config, propname) && !reserved_props.hasownproperty(propname)) {
          if (config[propname] === undefined && defaultprops !== undefined) {
            // resolve default props
            props[propname] = defaultprops[propname];
          } else {
            props[propname] = config[propname];
          }
        }
      }
    } // children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


    var childrenlength = arguments.length - 2;

    if (childrenlength === 1) {
      props.children = children;
    } else if (childrenlength > 1) {
      var childarray = array(childrenlength);

      for (var i = 0; i < childrenlength; i++) {
        childarray[i] = arguments[i + 2];
      }

      props.children = childarray;
    }

    return reactelement(element.type, key, ref, self, source, owner, props);
  }
  /**
   * verifies the object is a reactelement.
   * see https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} true if `object` is a reactelement.
   * @final
   */

  function isvalidelement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === react_element_type;
  }

  var separator = '.';
  var subseparator = ':';
  /**
   * escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */

  function escape(key) {
    var escaperegex = /[=:]/g;
    var escaperlookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedstring = key.replace(escaperegex, function (match) {
      return escaperlookup[match];
    });
    return '$' + escapedstring;
  }
  /**
   * todo: test that a single child and an array with one item have the same key
   * pattern.
   */


  var didwarnaboutmaps = false;
  var userprovidedkeyescaperegex = /\/+/g;

  function escapeuserprovidedkey(text) {
    return text.replace(userprovidedkeyescaperegex, '$&/');
  }
  /**
   * generate a key string that identifies a element within a set.
   *
   * @param {*} element a element that could contain a manual key.
   * @param {number} index index that is used if a manual key is not provided.
   * @return {string}
   */


  function getelementkey(element, index) {
    // do some typechecking here since we call this blindly. we want to ensure
    // that we don't block potential future es apis.
    if (typeof element === 'object' && element !== null && element.key != null) {
      // explicit key
      {
        checkkeystringcoercion(element.key);
      }

      return escape('' + element.key);
    } // implicit key determined by the index in the set


    return index.tostring(36);
  }

  function mapintoarray(children, array, escapedprefix, namesofar, callback) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // all of the above are perceived as null.
      children = null;
    }

    var invokecallback = false;

    if (children === null) {
      invokecallback = true;
    } else {
      switch (type) {
        case 'string':
        case 'number':
          invokecallback = true;
          break;

        case 'object':
          switch (children.$$typeof) {
            case react_element_type:
            case react_portal_type:
              invokecallback = true;
          }

      }
    }

    if (invokecallback) {
      var _child = children;
      var mappedchild = callback(_child); // if it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows:

      var childkey = namesofar === '' ? separator + getelementkey(_child, 0) : namesofar;

      if (isarray(mappedchild)) {
        var escapedchildkey = '';

        if (childkey != null) {
          escapedchildkey = escapeuserprovidedkey(childkey) + '/';
        }

        mapintoarray(mappedchild, array, escapedchildkey, '', function (c) {
          return c;
        });
      } else if (mappedchild != null) {
        if (isvalidelement(mappedchild)) {
          {
            // the `if` statement here prevents auto-disabling of the safe
            // coercion eslint rule, so we must manually disable it below.
            // $flowfixme flow incorrectly thinks react.portal doesn't have a key
            if (mappedchild.key && (!_child || _child.key !== mappedchild.key)) {
              checkkeystringcoercion(mappedchild.key);
            }
          }

          mappedchild = cloneandreplacekey(mappedchild, // keep both the (mapped) and old keys if they differ, just as
          // traverseallchildren used to do for objects as children
          escapedprefix + ( // $flowfixme flow incorrectly thinks react.portal doesn't have a key
          mappedchild.key && (!_child || _child.key !== mappedchild.key) ? // $flowfixme flow incorrectly thinks existing element's key can be a number
          // eslint-disable-next-line react-internal/safe-string-coercion
          escapeuserprovidedkey('' + mappedchild.key) + '/' : '') + childkey);
        }

        array.push(mappedchild);
      }

      return 1;
    }

    var child;
    var nextname;
    var subtreecount = 0; // count of children found in the current subtree.

    var nextnameprefix = namesofar === '' ? separator : namesofar + subseparator;

    if (isarray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextname = nextnameprefix + getelementkey(child, i);
        subtreecount += mapintoarray(child, array, escapedprefix, nextname, callback);
      }
    } else {
      var iteratorfn = getiteratorfn(children);

      if (typeof iteratorfn === 'function') {
        var iterablechildren = children;

        {
          // warn about using maps as children
          if (iteratorfn === iterablechildren.entries) {
            if (!didwarnaboutmaps) {
              warn('using maps as children is not supported. ' + 'use an array of keyed reactelements instead.');
            }

            didwarnaboutmaps = true;
          }
        }

        var iterator = iteratorfn.call(iterablechildren);
        var step;
        var ii = 0;

        while (!(step = iterator.next()).done) {
          child = step.value;
          nextname = nextnameprefix + getelementkey(child, ii++);
          subtreecount += mapintoarray(child, array, escapedprefix, nextname, callback);
        }
      } else if (type === 'object') {
        // eslint-disable-next-line react-internal/safe-string-coercion
        var childrenstring = string(children);
        throw new error("objects are not valid as a react child (found: " + (childrenstring === '[object object]' ? 'object with keys {' + object.keys(children).join(', ') + '}' : childrenstring) + "). " + 'if you meant to render a collection of children, use an array ' + 'instead.');
      }
    }

    return subtreecount;
  }

  /**
   * maps children that are typically specified as `props.children`.
   *
   * see https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * the provided mapfunction(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children children tree container.
   * @param {function(*, int)} func the map function.
   * @param {*} context context for mapfunction.
   * @return {object} object containing the ordered map of results.
   */
  function mapchildren(children, func, context) {
    if (children == null) {
      return children;
    }

    var result = [];
    var count = 0;
    mapintoarray(children, result, '', '', function (child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  /**
   * count the number of children that are typically specified as
   * `props.children`.
   *
   * see https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children children tree container.
   * @return {number} the number of children.
   */


  function countchildren(children) {
    var n = 0;
    mapchildren(children, function () {
      n++; // don't return anything
    });
    return n;
  }

  /**
   * iterates through children that are typically specified as `props.children`.
   *
   * see https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * the provided foreachfunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children children tree container.
   * @param {function(*, int)} foreachfunc
   * @param {*} foreachcontext context for foreachcontext.
   */
  function foreachchildren(children, foreachfunc, foreachcontext) {
    mapchildren(children, function () {
      foreachfunc.apply(this, arguments); // don't return anything.
    }, foreachcontext);
  }
  /**
   * flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * see https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */


  function toarray(children) {
    return mapchildren(children, function (child) {
      return child;
    }) || [];
  }
  /**
   * returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * see https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * the current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children child collection structure.
   * @return {reactelement} the first and only `reactelement` contained in the
   * structure.
   */


  function onlychild(children) {
    if (!isvalidelement(children)) {
      throw new error('react.children.only expected to receive a single react element child.');
    }

    return children;
  }

  function createcontext(defaultvalue) {
    // todo: second argument used to be an optional `calculatechangedbits`
    // function. warn to reserve for future use?
    var context = {
      $$typeof: react_context_type,
      // as a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. we only expect
      // there to be two concurrent renderers at most: react native (primary) and
      // fabric (secondary); react dom (primary) and react art (secondary).
      // secondary renderers store their context values on separate fields.
      _currentvalue: defaultvalue,
      _currentvalue2: defaultvalue,
      // used to track how many concurrent renderers this context currently
      // supports within in a single renderer. such as parallel server rendering.
      _threadcount: 0,
      // these are circular
      provider: null,
      consumer: null,
      // add these to use same hidden class in vm as servercontext
      _defaultvalue: null,
      _globalname: null
    };
    context.provider = {
      $$typeof: react_provider_type,
      _context: context
    };
    var haswarnedaboutusingnestedcontextconsumers = false;
    var haswarnedaboutusingconsumerprovider = false;
    var haswarnedaboutdisplaynameonconsumer = false;

    {
      // a separate object, but proxies back to the original context object for
      // backwards compatibility. it has a different $$typeof, so we can properly
      // warn for the incorrect usage of context as a consumer.
      var consumer = {
        $$typeof: react_context_type,
        _context: context
      }; // $flowfixme: flow complains about not setting a value, which is intentional here

      object.defineproperties(consumer, {
        provider: {
          get: function () {
            if (!haswarnedaboutusingconsumerprovider) {
              haswarnedaboutusingconsumerprovider = true;

              error('rendering <context.consumer.provider> is not supported and will be removed in ' + 'a future major release. did you mean to render <context.provider> instead?');
            }

            return context.provider;
          },
          set: function (_provider) {
            context.provider = _provider;
          }
        },
        _currentvalue: {
          get: function () {
            return context._currentvalue;
          },
          set: function (_currentvalue) {
            context._currentvalue = _currentvalue;
          }
        },
        _currentvalue2: {
          get: function () {
            return context._currentvalue2;
          },
          set: function (_currentvalue2) {
            context._currentvalue2 = _currentvalue2;
          }
        },
        _threadcount: {
          get: function () {
            return context._threadcount;
          },
          set: function (_threadcount) {
            context._threadcount = _threadcount;
          }
        },
        consumer: {
          get: function () {
            if (!haswarnedaboutusingnestedcontextconsumers) {
              haswarnedaboutusingnestedcontextconsumers = true;

              error('rendering <context.consumer.consumer> is not supported and will be removed in ' + 'a future major release. did you mean to render <context.consumer> instead?');
            }

            return context.consumer;
          }
        },
        displayname: {
          get: function () {
            return context.displayname;
          },
          set: function (displayname) {
            if (!haswarnedaboutdisplaynameonconsumer) {
              warn('setting `displayname` on context.consumer has no effect. ' + "you should set it directly on the context with context.displayname = '%s'.", displayname);

              haswarnedaboutdisplaynameonconsumer = true;
            }
          }
        }
      }); // $flowfixme: flow complains about missing properties because it doesn't understand defineproperty

      context.consumer = consumer;
    }

    {
      context._currentrenderer = null;
      context._currentrenderer2 = null;
    }

    return context;
  }

  var uninitialized = -1;
  var pending = 0;
  var resolved = 1;
  var rejected = 2;

  function lazyinitializer(payload) {
    if (payload._status === uninitialized) {
      var ctor = payload._result;
      var thenable = ctor(); // transition to the next state.
      // this might throw either because it's missing or throws. if so, we treat it
      // as still uninitialized and try again next time. which is the same as what
      // happens if the ctor or any wrappers processing the ctor throws. this might
      // end up fixing it if the resolution was a concurrency bug.

      thenable.then(function (moduleobject) {
        if (payload._status === pending || payload._status === uninitialized) {
          // transition to the next state.
          var resolved = payload;
          resolved._status = resolved;
          resolved._result = moduleobject;
        }
      }, function (error) {
        if (payload._status === pending || payload._status === uninitialized) {
          // transition to the next state.
          var rejected = payload;
          rejected._status = rejected;
          rejected._result = error;
        }
      });

      if (payload._status === uninitialized) {
        // in case, we're still uninitialized, then we're waiting for the thenable
        // to resolve. set it as pending in the meantime.
        var pending = payload;
        pending._status = pending;
        pending._result = thenable;
      }
    }

    if (payload._status === resolved) {
      var moduleobject = payload._result;

      {
        if (moduleobject === undefined) {
          error('lazy: expected the result of a dynamic imp' + 'ort() call. ' + 'instead received: %s\n\nyour code should look like: \n  ' + // break up imports to avoid accidentally parsing them as dependencies.
          'const mycomponent = lazy(() => imp' + "ort('./mycomponent'))\n\n" + 'did you accidentally put curly braces around the import?', moduleobject);
        }
      }

      {
        if (!('default' in moduleobject)) {
          error('lazy: expected the result of a dynamic imp' + 'ort() call. ' + 'instead received: %s\n\nyour code should look like: \n  ' + // break up imports to avoid accidentally parsing them as dependencies.
          'const mycomponent = lazy(() => imp' + "ort('./mycomponent'))", moduleobject);
        }
      }

      return moduleobject.default;
    } else {
      throw payload._result;
    }
  }

  function lazy(ctor) {
    var payload = {
      // we use these fields to store the result.
      _status: uninitialized,
      _result: ctor
    };
    var lazytype = {
      $$typeof: react_lazy_type,
      _payload: payload,
      _init: lazyinitializer
    };

    {
      // in production, this would just set it on the object.
      var defaultprops;
      var proptypes; // $flowfixme

      object.defineproperties(lazytype, {
        defaultprops: {
          configurable: true,
          get: function () {
            return defaultprops;
          },
          set: function (newdefaultprops) {
            error('react.lazy(...): it is not supported to assign `defaultprops` to ' + 'a lazy component import. either specify them where the component ' + 'is defined, or create a wrapping component around it.');

            defaultprops = newdefaultprops; // match production behavior more closely:
            // $flowfixme

            object.defineproperty(lazytype, 'defaultprops', {
              enumerable: true
            });
          }
        },
        proptypes: {
          configurable: true,
          get: function () {
            return proptypes;
          },
          set: function (newproptypes) {
            error('react.lazy(...): it is not supported to assign `proptypes` to ' + 'a lazy component import. either specify them where the component ' + 'is defined, or create a wrapping component around it.');

            proptypes = newproptypes; // match production behavior more closely:
            // $flowfixme

            object.defineproperty(lazytype, 'proptypes', {
              enumerable: true
            });
          }
        }
      });
    }

    return lazytype;
  }

  function forwardref(render) {
    {
      if (render != null && render.$$typeof === react_memo_type) {
        error('forwardref requires a render function but received a `memo` ' + 'component. instead of forwardref(memo(...)), use ' + 'memo(forwardref(...)).');
      } else if (typeof render !== 'function') {
        error('forwardref requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        if (render.length !== 0 && render.length !== 2) {
          error('forwardref render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'did you forget to use the ref parameter?' : 'any additional parameter will be undefined.');
        }
      }

      if (render != null) {
        if (render.defaultprops != null || render.proptypes != null) {
          error('forwardref render functions do not support proptypes or defaultprops. ' + 'did you accidentally pass a react component?');
        }
      }
    }

    var elementtype = {
      $$typeof: react_forward_ref_type,
      render: render
    };

    {
      var ownname;
      object.defineproperty(elementtype, 'displayname', {
        enumerable: false,
        configurable: true,
        get: function () {
          return ownname;
        },
        set: function (name) {
          ownname = name; // the inner component shouldn't inherit this display name in most cases,
          // because the component may be used elsewhere.
          // but it's nice for anonymous functions to inherit the name,
          // so that our component-stack generation logic will display their frames.
          // an anonymous function generally suggests a pattern like:
          //   react.forwardref((props, ref) => {...});
          // this kind of inner function is not used elsewhere so the side effect is okay.

          if (!render.name && !render.displayname) {
            render.displayname = name;
          }
        }
      });
    }

    return elementtype;
  }

  var react_module_reference;

  {
    react_module_reference = symbol.for('react.module.reference');
  }

  function isvalidelementtype(type) {
    if (typeof type === 'string' || typeof type === 'function') {
      return true;
    } // note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


    if (type === react_fragment_type || type === react_profiler_type || enabledebugtracing  || type === react_strict_mode_type || type === react_suspense_type || type === react_suspense_list_type || enablelegacyhidden  || type === react_offscreen_type || enablescopeapi  || enablecacheelement  || enabletransitiontracing ) {
      return true;
    }

    if (typeof type === 'object' && type !== null) {
      if (type.$$typeof === react_lazy_type || type.$$typeof === react_memo_type || type.$$typeof === react_provider_type || type.$$typeof === react_context_type || type.$$typeof === react_forward_ref_type || // this needs to include all possible module reference object
      // types supported by any flight configuration anywhere since
      // we don't know which flight build this will end up being used
      // with.
      type.$$typeof === react_module_reference || type.getmoduleid !== undefined) {
        return true;
      }
    }

    return false;
  }

  function memo(type, compare) {
    {
      if (!isvalidelementtype(type)) {
        error('memo: the first argument must be a component. instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }

    var elementtype = {
      $$typeof: react_memo_type,
      type: type,
      compare: compare === undefined ? null : compare
    };

    {
      var ownname;
      object.defineproperty(elementtype, 'displayname', {
        enumerable: false,
        configurable: true,
        get: function () {
          return ownname;
        },
        set: function (name) {
          ownname = name; // the inner component shouldn't inherit this display name in most cases,
          // because the component may be used elsewhere.
          // but it's nice for anonymous functions to inherit the name,
          // so that our component-stack generation logic will display their frames.
          // an anonymous function generally suggests a pattern like:
          //   react.memo((props) => {...});
          // this kind of inner function is not used elsewhere so the side effect is okay.

          if (!type.name && !type.displayname) {
            type.displayname = name;
          }
        }
      });
    }

    return elementtype;
  }

  function resolvedispatcher() {
    var dispatcher = reactcurrentdispatcher.current;

    {
      if (dispatcher === null) {
        error('invalid hook call. hooks can only be called inside of the body of a function component. this could happen for' + ' one of the following reasons:\n' + '1. you might have mismatching versions of react and the renderer (such as react dom)\n' + '2. you might be breaking the rules of hooks\n' + '3. you might have more than one copy of react in the same app\n' + 'see https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.');
      }
    } // will result in a null access error if accessed outside render phase. we
    // intentionally don't throw our own error because this is in a hot path.
    // also helps ensure this is inlined.


    return dispatcher;
  }
  function usecontext(context) {
    var dispatcher = resolvedispatcher();

    {
      // todo: add a more generic warning for invalid values.
      if (context._context !== undefined) {
        var realcontext = context._context; // don't deduplicate because this legitimately causes bugs
        // and nobody should be using this in existing code.

        if (realcontext.consumer === context) {
          error('calling usecontext(context.consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. did you mean to call usecontext(context) instead?');
        } else if (realcontext.provider === context) {
          error('calling usecontext(context.provider) is not supported. ' + 'did you mean to call usecontext(context) instead?');
        }
      }
    }

    return dispatcher.usecontext(context);
  }
  function usestate(initialstate) {
    var dispatcher = resolvedispatcher();
    return dispatcher.usestate(initialstate);
  }
  function usereducer(reducer, initialarg, init) {
    var dispatcher = resolvedispatcher();
    return dispatcher.usereducer(reducer, initialarg, init);
  }
  function useref(initialvalue) {
    var dispatcher = resolvedispatcher();
    return dispatcher.useref(initialvalue);
  }
  function useeffect(create, deps) {
    var dispatcher = resolvedispatcher();
    return dispatcher.useeffect(create, deps);
  }
  function useinsertioneffect(create, deps) {
    var dispatcher = resolvedispatcher();
    return dispatcher.useinsertioneffect(create, deps);
  }
  function uselayouteffect(create, deps) {
    var dispatcher = resolvedispatcher();
    return dispatcher.uselayouteffect(create, deps);
  }
  function usecallback(callback, deps) {
    var dispatcher = resolvedispatcher();
    return dispatcher.usecallback(callback, deps);
  }
  function usememo(create, deps) {
    var dispatcher = resolvedispatcher();
    return dispatcher.usememo(create, deps);
  }
  function useimperativehandle(ref, create, deps) {
    var dispatcher = resolvedispatcher();
    return dispatcher.useimperativehandle(ref, create, deps);
  }
  function usedebugvalue(value, formatterfn) {
    {
      var dispatcher = resolvedispatcher();
      return dispatcher.usedebugvalue(value, formatterfn);
    }
  }
  function usetransition() {
    var dispatcher = resolvedispatcher();
    return dispatcher.usetransition();
  }
  function usedeferredvalue(value) {
    var dispatcher = resolvedispatcher();
    return dispatcher.usedeferredvalue(value);
  }
  function useid() {
    var dispatcher = resolvedispatcher();
    return dispatcher.useid();
  }
  function usesyncexternalstore(subscribe, getsnapshot, getserversnapshot) {
    var dispatcher = resolvedispatcher();
    return dispatcher.usesyncexternalstore(subscribe, getsnapshot, getserversnapshot);
  }

  // helpers to patch console.logs to avoid logging during side-effect free
  // replaying on render function. this currently only patches the object
  // lazily which won't cover if the log function was extracted eagerly.
  // we could also eagerly patch the method.
  var disableddepth = 0;
  var prevlog;
  var previnfo;
  var prevwarn;
  var preverror;
  var prevgroup;
  var prevgroupcollapsed;
  var prevgroupend;

  function disabledlog() {}

  disabledlog.__reactdisabledlog = true;
  function disablelogs() {
    {
      if (disableddepth === 0) {
        /* eslint-disable react-internal/no-production-logging */
        prevlog = console.log;
        previnfo = console.info;
        prevwarn = console.warn;
        preverror = console.error;
        prevgroup = console.group;
        prevgroupcollapsed = console.groupcollapsed;
        prevgroupend = console.groupend; // https://github.com/facebook/react/issues/19099

        var props = {
          configurable: true,
          enumerable: true,
          value: disabledlog,
          writable: true
        }; // $flowfixme flow thinks console is immutable.

        object.defineproperties(console, {
          info: props,
          log: props,
          warn: props,
          error: props,
          group: props,
          groupcollapsed: props,
          groupend: props
        });
        /* eslint-enable react-internal/no-production-logging */
      }

      disableddepth++;
    }
  }
  function reenablelogs() {
    {
      disableddepth--;

      if (disableddepth === 0) {
        /* eslint-disable react-internal/no-production-logging */
        var props = {
          configurable: true,
          enumerable: true,
          writable: true
        }; // $flowfixme flow thinks console is immutable.

        object.defineproperties(console, {
          log: assign({}, props, {
            value: prevlog
          }),
          info: assign({}, props, {
            value: previnfo
          }),
          warn: assign({}, props, {
            value: prevwarn
          }),
          error: assign({}, props, {
            value: preverror
          }),
          group: assign({}, props, {
            value: prevgroup
          }),
          groupcollapsed: assign({}, props, {
            value: prevgroupcollapsed
          }),
          groupend: assign({}, props, {
            value: prevgroupend
          })
        });
        /* eslint-enable react-internal/no-production-logging */
      }

      if (disableddepth < 0) {
        error('disableddepth fell below zero. ' + 'this is a bug in react. please file an issue.');
      }
    }
  }

  var reactcurrentdispatcher$1 = reactsharedinternals.reactcurrentdispatcher;
  var prefix;
  function describebuiltincomponentframe(name, source, ownerfn) {
    {
      if (prefix === undefined) {
        // extract the vm specific prefix used by each line.
        try {
          throw error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || '';
        }
      } // we use the prefix to ensure our stacks line up with native stack frames.


      return '\n' + prefix + name;
    }
  }
  var reentry = false;
  var componentframecache;

  {
    var possiblyweakmap = typeof weakmap === 'function' ? weakmap : map;
    componentframecache = new possiblyweakmap();
  }

  function describenativecomponentframe(fn, construct) {
    // if something asked for a stack inside a fake render, it should get ignored.
    if ( !fn || reentry) {
      return '';
    }

    {
      var frame = componentframecache.get(fn);

      if (frame !== undefined) {
        return frame;
      }
    }

    var control;
    reentry = true;
    var previouspreparestacktrace = error.preparestacktrace; // $flowfixme it does accept undefined.

    error.preparestacktrace = undefined;
    var previousdispatcher;

    {
      previousdispatcher = reactcurrentdispatcher$1.current; // set the dispatcher in dev because this might be call in the render function
      // for warnings.

      reactcurrentdispatcher$1.current = null;
      disablelogs();
    }

    try {
      // this should throw.
      if (construct) {
        // something should be setting the props in the constructor.
        var fake = function () {
          throw error();
        }; // $flowfixme


        object.defineproperty(fake.prototype, 'props', {
          set: function () {
            // we use a throwing setter instead of frozen or non-writable props
            // because that won't throw in a non-strict mode function.
            throw error();
          }
        });

        if (typeof reflect === 'object' && reflect.construct) {
          // we construct a different control for this case to include any extra
          // frames added by the construct call.
          try {
            reflect.construct(fake, []);
          } catch (x) {
            control = x;
          }

          reflect.construct(fn, [], fake);
        } else {
          try {
            fake.call();
          } catch (x) {
            control = x;
          }

          fn.call(fake.prototype);
        }
      } else {
        try {
          throw error();
        } catch (x) {
          control = x;
        }

        fn();
      }
    } catch (sample) {
      // this is inlined manually because closure doesn't do it for us.
      if (sample && control && typeof sample.stack === 'string') {
        // this extracts the first frame from the sample that isn't also in the control.
        // skipping one frame that we assume is the frame that calls the two.
        var samplelines = sample.stack.split('\n');
        var controllines = control.stack.split('\n');
        var s = samplelines.length - 1;
        var c = controllines.length - 1;

        while (s >= 1 && c >= 0 && samplelines[s] !== controllines[c]) {
          // we expect at least one stack frame to be shared.
          // typically this will be the root most one. however, stack frames may be
          // cut off due to maximum stack limits. in this case, one maybe cut off
          // earlier than the other. we assume that the sample is longer or the same
          // and there for cut off earlier. so we should find the root most frame in
          // the sample somewhere in the control.
          c--;
        }

        for (; s >= 1 && c >= 0; s--, c--) {
          // next we find the first one that isn't the same which should be the
          // frame that called our sample function and the control.
          if (samplelines[s] !== controllines[c]) {
            // in v8, the first line is describing the message but other vms don't.
            // if we're about to return the first line, and the control is also on the same
            // line, that's a pretty good indicator that our sample threw at same line as
            // the control. i.e. before we entered the sample frame. so we ignore this result.
            // this can happen if you passed a class to function component, or non-function.
            if (s !== 1 || c !== 1) {
              do {
                s--;
                c--; // we may still have similar intermediate frames from the construct call.
                // the next one that isn't the same should be our match though.

                if (c < 0 || samplelines[s] !== controllines[c]) {
                  // v8 adds a "new" prefix for native classes. let's remove it to make it prettier.
                  var _frame = '\n' + samplelines[s].replace(' at new ', ' at '); // if our component frame is labeled "<anonymous>"
                  // but we have a user-provided "displayname"
                  // splice it in to make the stack more readable.


                  if (fn.displayname && _frame.includes('<anonymous>')) {
                    _frame = _frame.replace('<anonymous>', fn.displayname);
                  }

                  {
                    if (typeof fn === 'function') {
                      componentframecache.set(fn, _frame);
                    }
                  } // return the line we found.


                  return _frame;
                }
              } while (s >= 1 && c >= 0);
            }

            break;
          }
        }
      }
    } finally {
      reentry = false;

      {
        reactcurrentdispatcher$1.current = previousdispatcher;
        reenablelogs();
      }

      error.preparestacktrace = previouspreparestacktrace;
    } // fallback to just using the name if we couldn't make it throw.


    var name = fn ? fn.displayname || fn.name : '';
    var syntheticframe = name ? describebuiltincomponentframe(name) : '';

    {
      if (typeof fn === 'function') {
        componentframecache.set(fn, syntheticframe);
      }
    }

    return syntheticframe;
  }
  function describefunctioncomponentframe(fn, source, ownerfn) {
    {
      return describenativecomponentframe(fn, false);
    }
  }

  function shouldconstruct(component) {
    var prototype = component.prototype;
    return !!(prototype && prototype.isreactcomponent);
  }

  function describeunknownelementtypeframeindev(type, source, ownerfn) {

    if (type == null) {
      return '';
    }

    if (typeof type === 'function') {
      {
        return describenativecomponentframe(type, shouldconstruct(type));
      }
    }

    if (typeof type === 'string') {
      return describebuiltincomponentframe(type);
    }

    switch (type) {
      case react_suspense_type:
        return describebuiltincomponentframe('suspense');

      case react_suspense_list_type:
        return describebuiltincomponentframe('suspenselist');
    }

    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case react_forward_ref_type:
          return describefunctioncomponentframe(type.render);

        case react_memo_type:
          // memo may contain any component type so we recursively resolve it.
          return describeunknownelementtypeframeindev(type.type, source, ownerfn);

        case react_lazy_type:
          {
            var lazycomponent = type;
            var payload = lazycomponent._payload;
            var init = lazycomponent._init;

            try {
              // lazy may contain any component type so we recursively resolve it.
              return describeunknownelementtypeframeindev(init(payload), source, ownerfn);
            } catch (x) {}
          }
      }
    }

    return '';
  }

  var loggedtypefailures = {};
  var reactdebugcurrentframe$1 = reactsharedinternals.reactdebugcurrentframe;

  function setcurrentlyvalidatingelement(element) {
    {
      if (element) {
        var owner = element._owner;
        var stack = describeunknownelementtypeframeindev(element.type, element._source, owner ? owner.type : null);
        reactdebugcurrentframe$1.setextrastackframe(stack);
      } else {
        reactdebugcurrentframe$1.setextrastackframe(null);
      }
    }
  }

  function checkproptypes(typespecs, values, location, componentname, element) {
    {
      // $flowfixme this is okay but flow doesn't know it.
      var has = function.call.bind(hasownproperty);

      for (var typespecname in typespecs) {
        if (has(typespecs, typespecname)) {
          var error$1 = void 0; // prop type validation may throw. in case they do, we don't want to
          // fail the render phase where it didn't fail before. so we log it.
          // after these have been cleaned up, we'll let them throw.

          try {
            // this is intentionally an invariant that gets caught. it's the same
            // behavior as without this statement except with a better message.
            if (typeof typespecs[typespecname] !== 'function') {
              // eslint-disable-next-line react-internal/prod-error-codes
              var err = error((componentname || 'react class') + ': ' + location + ' type `' + typespecname + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typespecs[typespecname] + '`.' + 'this often happens because of typos such as `proptypes.function` instead of `proptypes.func`.');
              err.name = 'invariant violation';
              throw err;
            }

            error$1 = typespecs[typespecname](values, typespecname, componentname, location, null, 'secret_do_not_pass_this_or_you_will_be_fired');
          } catch (ex) {
            error$1 = ex;
          }

          if (error$1 && !(error$1 instanceof error)) {
            setcurrentlyvalidatingelement(element);

            error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `error` but returned a %s. ' + 'you may have forgotten to pass an argument to the type checker ' + 'creator (arrayof, instanceof, objectof, oneof, oneoftype, and ' + 'shape all require an argument).', componentname || 'react class', location, typespecname, typeof error$1);

            setcurrentlyvalidatingelement(null);
          }

          if (error$1 instanceof error && !(error$1.message in loggedtypefailures)) {
            // only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedtypefailures[error$1.message] = true;
            setcurrentlyvalidatingelement(element);

            error('failed %s type: %s', location, error$1.message);

            setcurrentlyvalidatingelement(null);
          }
        }
      }
    }
  }

  function setcurrentlyvalidatingelement$1(element) {
    {
      if (element) {
        var owner = element._owner;
        var stack = describeunknownelementtypeframeindev(element.type, element._source, owner ? owner.type : null);
        setextrastackframe(stack);
      } else {
        setextrastackframe(null);
      }
    }
  }

  var proptypesmisspellwarningshown;

  {
    proptypesmisspellwarningshown = false;
  }

  function getdeclarationerroraddendum() {
    if (reactcurrentowner.current) {
      var name = getcomponentnamefromtype(reactcurrentowner.current.type);

      if (name) {
        return '\n\ncheck the render method of `' + name + '`.';
      }
    }

    return '';
  }

  function getsourceinfoerroraddendum(source) {
    if (source !== undefined) {
      var filename = source.filename.replace(/^.*[\\\/]/, '');
      var linenumber = source.linenumber;
      return '\n\ncheck your code at ' + filename + ':' + linenumber + '.';
    }

    return '';
  }

  function getsourceinfoerroraddendumforprops(elementprops) {
    if (elementprops !== null && elementprops !== undefined) {
      return getsourceinfoerroraddendum(elementprops.__source);
    }

    return '';
  }
  /**
   * warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. this allows us to keep track of children between
   * updates.
   */


  var ownerhaskeyusewarning = {};

  function getcurrentcomponenterrorinfo(parenttype) {
    var info = getdeclarationerroraddendum();

    if (!info) {
      var parentname = typeof parenttype === 'string' ? parenttype : parenttype.displayname || parenttype.name;

      if (parentname) {
        info = "\n\ncheck the top-level render call using <" + parentname + ">.";
      }
    }

    return info;
  }
  /**
   * warn if the element doesn't have an explicit key assigned to it.
   * this element is in an array. the array could grow and shrink or be
   * reordered. all children that haven't already been validated are required to
   * have a "key" property assigned to it. error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {reactelement} element element that requires a key.
   * @param {*} parenttype element's parent's type.
   */


  function validateexplicitkey(element, parenttype) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    var currentcomponenterrorinfo = getcurrentcomponenterrorinfo(parenttype);

    if (ownerhaskeyusewarning[currentcomponenterrorinfo]) {
      return;
    }

    ownerhaskeyusewarning[currentcomponenterrorinfo] = true; // usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childowner = '';

    if (element && element._owner && element._owner !== reactcurrentowner.current) {
      // give the component that originally created this child.
      childowner = " it was passed a child from " + getcomponentnamefromtype(element._owner.type) + ".";
    }

    {
      setcurrentlyvalidatingelement$1(element);

      error('each child in a list should have a unique "key" prop.' + '%s%s see https://reactjs.org/link/warning-keys for more information.', currentcomponenterrorinfo, childowner);

      setcurrentlyvalidatingelement$1(null);
    }
  }
  /**
   * ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {reactnode} node statically passed child of any type.
   * @param {*} parenttype node's parent's type.
   */


  function validatechildkeys(node, parenttype) {
    if (typeof node !== 'object') {
      return;
    }

    if (isarray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];

        if (isvalidelement(child)) {
          validateexplicitkey(child, parenttype);
        }
      }
    } else if (isvalidelement(node)) {
      // this element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorfn = getiteratorfn(node);

      if (typeof iteratorfn === 'function') {
        // entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorfn !== node.entries) {
          var iterator = iteratorfn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            if (isvalidelement(step.value)) {
              validateexplicitkey(step.value, parenttype);
            }
          }
        }
      }
    }
  }
  /**
   * given an element, validate that its props follow the proptypes definition,
   * provided by the type.
   *
   * @param {reactelement} element
   */


  function validateproptypes(element) {
    {
      var type = element.type;

      if (type === null || type === undefined || typeof type === 'string') {
        return;
      }

      var proptypes;

      if (typeof type === 'function') {
        proptypes = type.proptypes;
      } else if (typeof type === 'object' && (type.$$typeof === react_forward_ref_type || // note: memo only checks outer props here.
      // inner props are checked in the reconciler.
      type.$$typeof === react_memo_type)) {
        proptypes = type.proptypes;
      } else {
        return;
      }

      if (proptypes) {
        // intentionally inside to avoid triggering lazy initializers:
        var name = getcomponentnamefromtype(type);
        checkproptypes(proptypes, element.props, 'prop', name, element);
      } else if (type.proptypes !== undefined && !proptypesmisspellwarningshown) {
        proptypesmisspellwarningshown = true; // intentionally inside to avoid triggering lazy initializers:

        var _name = getcomponentnamefromtype(type);

        error('component %s declared `proptypes` instead of `proptypes`. did you misspell the property assignment?', _name || 'unknown');
      }

      if (typeof type.getdefaultprops === 'function' && !type.getdefaultprops.isreactclassapproved) {
        error('getdefaultprops is only used on classic react.createclass ' + 'definitions. use a static property named `defaultprops` instead.');
      }
    }
  }
  /**
   * given a fragment, validate that it can only be provided with fragment props
   * @param {reactelement} fragment
   */


  function validatefragmentprops(fragment) {
    {
      var keys = object.keys(fragment.props);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (key !== 'children' && key !== 'key') {
          setcurrentlyvalidatingelement$1(fragment);

          error('invalid prop `%s` supplied to `react.fragment`. ' + 'react.fragment can only have `key` and `children` props.', key);

          setcurrentlyvalidatingelement$1(null);
          break;
        }
      }

      if (fragment.ref !== null) {
        setcurrentlyvalidatingelement$1(fragment);

        error('invalid attribute `ref` supplied to `react.fragment`.');

        setcurrentlyvalidatingelement$1(null);
      }
    }
  }
  function createelementwithvalidation(type, props, children) {
    var validtype = isvalidelementtype(type); // we warn in this case but don't throw. we expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validtype) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && object.keys(type).length === 0) {
        info += ' you likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceinfo = getsourceinfoerroraddendumforprops(props);

      if (sourceinfo) {
        info += sourceinfo;
      } else {
        info += getdeclarationerroraddendum();
      }

      var typestring;

      if (type === null) {
        typestring = 'null';
      } else if (isarray(type)) {
        typestring = 'array';
      } else if (type !== undefined && type.$$typeof === react_element_type) {
        typestring = "<" + (getcomponentnamefromtype(type.type) || 'unknown') + " />";
        info = ' did you accidentally export a jsx literal instead of a component?';
      } else {
        typestring = typeof type;
      }

      {
        error('react.createelement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typestring, info);
      }
    }

    var element = createelement.apply(this, arguments); // the result can be nullish if a mock or a custom function is used.
    // todo: drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // we don't want exception behavior to differ between dev and prod.
    // (rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validtype) {
      for (var i = 2; i < arguments.length; i++) {
        validatechildkeys(arguments[i], type);
      }
    }

    if (type === react_fragment_type) {
      validatefragmentprops(element);
    } else {
      validateproptypes(element);
    }

    return element;
  }
  var didwarnaboutdeprecatedcreatefactory = false;
  function createfactorywithvalidation(type) {
    var validatedfactory = createelementwithvalidation.bind(null, type);
    validatedfactory.type = type;

    {
      if (!didwarnaboutdeprecatedcreatefactory) {
        didwarnaboutdeprecatedcreatefactory = true;

        warn('react.createfactory() is deprecated and will be removed in ' + 'a future major release. consider using jsx ' + 'or use react.createelement() directly instead.');
      } // legacy hook: remove it


      object.defineproperty(validatedfactory, 'type', {
        enumerable: false,
        get: function () {
          warn('factory.type is deprecated. access the class directly ' + 'before passing it to createfactory.');

          object.defineproperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }

    return validatedfactory;
  }
  function cloneelementwithvalidation(element, props, children) {
    var newelement = cloneelement.apply(this, arguments);

    for (var i = 2; i < arguments.length; i++) {
      validatechildkeys(arguments[i], newelement.type);
    }

    validateproptypes(newelement);
    return newelement;
  }

  var enableschedulerdebugging = false;
  var enableprofiling = false;
  var frameyieldms = 5;

  function push(heap, node) {
    var index = heap.length;
    heap.push(node);
    siftup(heap, node, index);
  }
  function peek(heap) {
    return heap.length === 0 ? null : heap[0];
  }
  function pop(heap) {
    if (heap.length === 0) {
      return null;
    }

    var first = heap[0];
    var last = heap.pop();

    if (last !== first) {
      heap[0] = last;
      siftdown(heap, last, 0);
    }

    return first;
  }

  function siftup(heap, node, i) {
    var index = i;

    while (index > 0) {
      var parentindex = index - 1 >>> 1;
      var parent = heap[parentindex];

      if (compare(parent, node) > 0) {
        // the parent is larger. swap positions.
        heap[parentindex] = node;
        heap[index] = parent;
        index = parentindex;
      } else {
        // the parent is smaller. exit.
        return;
      }
    }
  }

  function siftdown(heap, node, i) {
    var index = i;
    var length = heap.length;
    var halflength = length >>> 1;

    while (index < halflength) {
      var leftindex = (index + 1) * 2 - 1;
      var left = heap[leftindex];
      var rightindex = leftindex + 1;
      var right = heap[rightindex]; // if the left or right node is smaller, swap with the smaller of those.

      if (compare(left, node) < 0) {
        if (rightindex < length && compare(right, left) < 0) {
          heap[index] = right;
          heap[rightindex] = node;
          index = rightindex;
        } else {
          heap[index] = left;
          heap[leftindex] = node;
          index = leftindex;
        }
      } else if (rightindex < length && compare(right, node) < 0) {
        heap[index] = right;
        heap[rightindex] = node;
        index = rightindex;
      } else {
        // neither child is smaller. exit.
        return;
      }
    }
  }

  function compare(a, b) {
    // compare sort index first, then task id.
    var diff = a.sortindex - b.sortindex;
    return diff !== 0 ? diff : a.id - b.id;
  }

  // todo: use symbols?
  var immediatepriority = 1;
  var userblockingpriority = 2;
  var normalpriority = 3;
  var lowpriority = 4;
  var idlepriority = 5;

  function marktaskerrored(task, ms) {
  }

  /* eslint-disable no-var */
  var getcurrenttime;
  var hasperformancenow = typeof performance === 'object' && typeof performance.now === 'function';

  if (hasperformancenow) {
    var localperformance = performance;

    getcurrenttime = function () {
      return localperformance.now();
    };
  } else {
    var localdate = date;
    var initialtime = localdate.now();

    getcurrenttime = function () {
      return localdate.now() - initialtime;
    };
  } // max 31 bit integer. the max integer size in v8 for 32-bit systems.
  // math.pow(2, 30) - 1
  // 0b111111111111111111111111111111


  var maxsigned31bitint = 1073741823; // times out immediately

  var immediate_priority_timeout = -1; // eventually times out

  var user_blocking_priority_timeout = 250;
  var normal_priority_timeout = 5000;
  var low_priority_timeout = 10000; // never times out

  var idle_priority_timeout = maxsigned31bitint; // tasks are stored on a min heap

  var taskqueue = [];
  var timerqueue = []; // incrementing id counter. used to maintain insertion order.

  var taskidcounter = 1; // pausing the scheduler is useful for debugging.
  var currenttask = null;
  var currentprioritylevel = normalpriority; // this is set while performing work, to prevent re-entrance.

  var isperformingwork = false;
  var ishostcallbackscheduled = false;
  var ishosttimeoutscheduled = false; // capture local references to native apis, in case a polyfill overrides them.

  var localsettimeout = typeof settimeout === 'function' ? settimeout : null;
  var localcleartimeout = typeof cleartimeout === 'function' ? cleartimeout : null;
  var localsetimmediate = typeof setimmediate !== 'undefined' ? setimmediate : null; // ie and node.js + jsdom

  var isinputpending = typeof navigator !== 'undefined' && navigator.scheduling !== undefined && navigator.scheduling.isinputpending !== undefined ? navigator.scheduling.isinputpending.bind(navigator.scheduling) : null;

  function advancetimers(currenttime) {
    // check for tasks that are no longer delayed and add them to the queue.
    var timer = peek(timerqueue);

    while (timer !== null) {
      if (timer.callback === null) {
        // timer was cancelled.
        pop(timerqueue);
      } else if (timer.starttime <= currenttime) {
        // timer fired. transfer to the task queue.
        pop(timerqueue);
        timer.sortindex = timer.expirationtime;
        push(taskqueue, timer);
      } else {
        // remaining timers are pending.
        return;
      }

      timer = peek(timerqueue);
    }
  }

  function handletimeout(currenttime) {
    ishosttimeoutscheduled = false;
    advancetimers(currenttime);

    if (!ishostcallbackscheduled) {
      if (peek(taskqueue) !== null) {
        ishostcallbackscheduled = true;
        requesthostcallback(flushwork);
      } else {
        var firsttimer = peek(timerqueue);

        if (firsttimer !== null) {
          requesthosttimeout(handletimeout, firsttimer.starttime - currenttime);
        }
      }
    }
  }

  function flushwork(hastimeremaining, initialtime) {


    ishostcallbackscheduled = false;

    if (ishosttimeoutscheduled) {
      // we scheduled a timeout but it's no longer needed. cancel it.
      ishosttimeoutscheduled = false;
      cancelhosttimeout();
    }

    isperformingwork = true;
    var previousprioritylevel = currentprioritylevel;

    try {
      if (enableprofiling) {
        try {
          return workloop(hastimeremaining, initialtime);
        } catch (error) {
          if (currenttask !== null) {
            var currenttime = getcurrenttime();
            marktaskerrored(currenttask, currenttime);
            currenttask.isqueued = false;
          }

          throw error;
        }
      } else {
        // no catch in prod code path.
        return workloop(hastimeremaining, initialtime);
      }
    } finally {
      currenttask = null;
      currentprioritylevel = previousprioritylevel;
      isperformingwork = false;
    }
  }

  function workloop(hastimeremaining, initialtime) {
    var currenttime = initialtime;
    advancetimers(currenttime);
    currenttask = peek(taskqueue);

    while (currenttask !== null && !(enableschedulerdebugging )) {
      if (currenttask.expirationtime > currenttime && (!hastimeremaining || shouldyieldtohost())) {
        // this currenttask hasn't expired, and we've reached the deadline.
        break;
      }

      var callback = currenttask.callback;

      if (typeof callback === 'function') {
        currenttask.callback = null;
        currentprioritylevel = currenttask.prioritylevel;
        var didusercallbacktimeout = currenttask.expirationtime <= currenttime;

        var continuationcallback = callback(didusercallbacktimeout);
        currenttime = getcurrenttime();

        if (typeof continuationcallback === 'function') {
          currenttask.callback = continuationcallback;
        } else {

          if (currenttask === peek(taskqueue)) {
            pop(taskqueue);
          }
        }

        advancetimers(currenttime);
      } else {
        pop(taskqueue);
      }

      currenttask = peek(taskqueue);
    } // return whether there's additional work


    if (currenttask !== null) {
      return true;
    } else {
      var firsttimer = peek(timerqueue);

      if (firsttimer !== null) {
        requesthosttimeout(handletimeout, firsttimer.starttime - currenttime);
      }

      return false;
    }
  }

  function unstable_runwithpriority(prioritylevel, eventhandler) {
    switch (prioritylevel) {
      case immediatepriority:
      case userblockingpriority:
      case normalpriority:
      case lowpriority:
      case idlepriority:
        break;

      default:
        prioritylevel = normalpriority;
    }

    var previousprioritylevel = currentprioritylevel;
    currentprioritylevel = prioritylevel;

    try {
      return eventhandler();
    } finally {
      currentprioritylevel = previousprioritylevel;
    }
  }

  function unstable_next(eventhandler) {
    var prioritylevel;

    switch (currentprioritylevel) {
      case immediatepriority:
      case userblockingpriority:
      case normalpriority:
        // shift down to normal priority
        prioritylevel = normalpriority;
        break;

      default:
        // anything lower than normal priority should remain at the current level.
        prioritylevel = currentprioritylevel;
        break;
    }

    var previousprioritylevel = currentprioritylevel;
    currentprioritylevel = prioritylevel;

    try {
      return eventhandler();
    } finally {
      currentprioritylevel = previousprioritylevel;
    }
  }

  function unstable_wrapcallback(callback) {
    var parentprioritylevel = currentprioritylevel;
    return function () {
      // this is a fork of runwithpriority, inlined for performance.
      var previousprioritylevel = currentprioritylevel;
      currentprioritylevel = parentprioritylevel;

      try {
        return callback.apply(this, arguments);
      } finally {
        currentprioritylevel = previousprioritylevel;
      }
    };
  }

  function unstable_schedulecallback(prioritylevel, callback, options) {
    var currenttime = getcurrenttime();
    var starttime;

    if (typeof options === 'object' && options !== null) {
      var delay = options.delay;

      if (typeof delay === 'number' && delay > 0) {
        starttime = currenttime + delay;
      } else {
        starttime = currenttime;
      }
    } else {
      starttime = currenttime;
    }

    var timeout;

    switch (prioritylevel) {
      case immediatepriority:
        timeout = immediate_priority_timeout;
        break;

      case userblockingpriority:
        timeout = user_blocking_priority_timeout;
        break;

      case idlepriority:
        timeout = idle_priority_timeout;
        break;

      case lowpriority:
        timeout = low_priority_timeout;
        break;

      case normalpriority:
      default:
        timeout = normal_priority_timeout;
        break;
    }

    var expirationtime = starttime + timeout;
    var newtask = {
      id: taskidcounter++,
      callback: callback,
      prioritylevel: prioritylevel,
      starttime: starttime,
      expirationtime: expirationtime,
      sortindex: -1
    };

    if (starttime > currenttime) {
      // this is a delayed task.
      newtask.sortindex = starttime;
      push(timerqueue, newtask);

      if (peek(taskqueue) === null && newtask === peek(timerqueue)) {
        // all tasks are delayed, and this is the task with the earliest delay.
        if (ishosttimeoutscheduled) {
          // cancel an existing timeout.
          cancelhosttimeout();
        } else {
          ishosttimeoutscheduled = true;
        } // schedule a timeout.


        requesthosttimeout(handletimeout, starttime - currenttime);
      }
    } else {
      newtask.sortindex = expirationtime;
      push(taskqueue, newtask);
      // wait until the next time we yield.


      if (!ishostcallbackscheduled && !isperformingwork) {
        ishostcallbackscheduled = true;
        requesthostcallback(flushwork);
      }
    }

    return newtask;
  }

  function unstable_pauseexecution() {
  }

  function unstable_continueexecution() {

    if (!ishostcallbackscheduled && !isperformingwork) {
      ishostcallbackscheduled = true;
      requesthostcallback(flushwork);
    }
  }

  function unstable_getfirstcallbacknode() {
    return peek(taskqueue);
  }

  function unstable_cancelcallback(task) {
    // remove from the queue because you can't remove arbitrary nodes from an
    // array based heap, only the first one.)


    task.callback = null;
  }

  function unstable_getcurrentprioritylevel() {
    return currentprioritylevel;
  }

  var ismessagelooprunning = false;
  var scheduledhostcallback = null;
  var tasktimeoutid = -1; // scheduler periodically yields in case there is other work on the main
  // thread, like user events. by default, it yields multiple times per frame.
  // it does not attempt to align with frame boundaries, since most tasks don't
  // need to be frame aligned; for those that do, use requestanimationframe.

  var frameinterval = frameyieldms;
  var starttime = -1;

  function shouldyieldtohost() {
    var timeelapsed = getcurrenttime() - starttime;

    if (timeelapsed < frameinterval) {
      // the main thread has only been blocked for a really short amount of time;
      // smaller than a single frame. don't yield yet.
      return false;
    } // the main thread has been blocked for a non-negligible amount of time. we


    return true;
  }

  function requestpaint() {

  }

  function forceframerate(fps) {
    if (fps < 0 || fps > 125) {
      // using console['error'] to evade babel and eslint
      console['error']('forceframerate takes a positive int between 0 and 125, ' + 'forcing frame rates higher than 125 fps is not supported');
      return;
    }

    if (fps > 0) {
      frameinterval = math.floor(1000 / fps);
    } else {
      // reset the framerate
      frameinterval = frameyieldms;
    }
  }

  var performworkuntildeadline = function () {
    if (scheduledhostcallback !== null) {
      var currenttime = getcurrenttime(); // keep track of the start time so we can measure how long the main thread
      // has been blocked.

      starttime = currenttime;
      var hastimeremaining = true; // if a scheduler task throws, exit the current browser task so the
      // error can be observed.
      //
      // intentionally not using a try-catch, since that makes some debugging
      // techniques harder. instead, if `scheduledhostcallback` errors, then
      // `hasmorework` will remain true, and we'll continue the work loop.

      var hasmorework = true;

      try {
        hasmorework = scheduledhostcallback(hastimeremaining, currenttime);
      } finally {
        if (hasmorework) {
          // if there's more work, schedule the next message event at the end
          // of the preceding one.
          scheduleperformworkuntildeadline();
        } else {
          ismessagelooprunning = false;
          scheduledhostcallback = null;
        }
      }
    } else {
      ismessagelooprunning = false;
    } // yielding to the browser will give it a chance to paint, so we can
  };

  var scheduleperformworkuntildeadline;

  if (typeof localsetimmediate === 'function') {
    // node.js and old ie.
    // there's a few reasons for why we prefer setimmediate.
    //
    // unlike messagechannel, it doesn't prevent a node.js process from exiting.
    // (even though this is a dom fork of the scheduler, you could get here
    // with a mix of node.js 15+, which has a messagechannel, and jsdom.)
    // https://github.com/facebook/react/issues/20756
    //
    // but also, it runs earlier which is the semantic we want.
    // if other browsers ever implement it, it's better to use it.
    // although both of these would be inferior to native scheduling.
    scheduleperformworkuntildeadline = function () {
      localsetimmediate(performworkuntildeadline);
    };
  } else if (typeof messagechannel !== 'undefined') {
    // dom and worker environments.
    // we prefer messagechannel because of the 4ms settimeout clamping.
    var channel = new messagechannel();
    var port = channel.port2;
    channel.port1.onmessage = performworkuntildeadline;

    scheduleperformworkuntildeadline = function () {
      port.postmessage(null);
    };
  } else {
    // we should only fallback here in non-browser environments.
    scheduleperformworkuntildeadline = function () {
      localsettimeout(performworkuntildeadline, 0);
    };
  }

  function requesthostcallback(callback) {
    scheduledhostcallback = callback;

    if (!ismessagelooprunning) {
      ismessagelooprunning = true;
      scheduleperformworkuntildeadline();
    }
  }

  function requesthosttimeout(callback, ms) {
    tasktimeoutid = localsettimeout(function () {
      callback(getcurrenttime());
    }, ms);
  }

  function cancelhosttimeout() {
    localcleartimeout(tasktimeoutid);
    tasktimeoutid = -1;
  }

  var unstable_requestpaint = requestpaint;
  var unstable_profiling =  null;



  var scheduler = /*#__pure__*/object.freeze({
    __proto__: null,
    unstable_immediatepriority: immediatepriority,
    unstable_userblockingpriority: userblockingpriority,
    unstable_normalpriority: normalpriority,
    unstable_idlepriority: idlepriority,
    unstable_lowpriority: lowpriority,
    unstable_runwithpriority: unstable_runwithpriority,
    unstable_next: unstable_next,
    unstable_schedulecallback: unstable_schedulecallback,
    unstable_cancelcallback: unstable_cancelcallback,
    unstable_wrapcallback: unstable_wrapcallback,
    unstable_getcurrentprioritylevel: unstable_getcurrentprioritylevel,
    unstable_shouldyield: shouldyieldtohost,
    unstable_requestpaint: unstable_requestpaint,
    unstable_continueexecution: unstable_continueexecution,
    unstable_pauseexecution: unstable_pauseexecution,
    unstable_getfirstcallbacknode: unstable_getfirstcallbacknode,
    get unstable_now () { return getcurrenttime; },
    unstable_forceframerate: forceframerate,
    unstable_profiling: unstable_profiling
  });

  var reactsharedinternals$1 = {
    reactcurrentdispatcher: reactcurrentdispatcher,
    reactcurrentowner: reactcurrentowner,
    reactcurrentbatchconfig: reactcurrentbatchconfig,
    // re-export the schedule api(s) for umd bundles.
    // this avoids introducing a dependency on a new umd global in a minor update,
    // since that would be a breaking change (e.g. for all existing codesandboxes).
    // this re-export is only required for umd bundles;
    // cjs bundles use the shared npm package.
    scheduler: scheduler
  };

  {
    reactsharedinternals$1.reactcurrentactqueue = reactcurrentactqueue;
    reactsharedinternals$1.reactdebugcurrentframe = reactdebugcurrentframe;
  }

  function starttransition(scope, options) {
    var prevtransition = reactcurrentbatchconfig.transition;
    reactcurrentbatchconfig.transition = {};
    var currenttransition = reactcurrentbatchconfig.transition;

    {
      reactcurrentbatchconfig.transition._updatedfibers = new set();
    }

    try {
      scope();
    } finally {
      reactcurrentbatchconfig.transition = prevtransition;

      {
        if (prevtransition === null && currenttransition._updatedfibers) {
          var updatedfiberscount = currenttransition._updatedfibers.size;

          if (updatedfiberscount > 10) {
            warn('detected a large number of updates inside starttransition. ' + 'if this is due to a subscription please re-write it to use react provided hooks. ' + 'otherwise concurrent mode guarantees are off the table.');
          }

          currenttransition._updatedfibers.clear();
        }
      }
    }
  }

  var didwarnaboutmessagechannel = false;
  var enqueuetaskimpl = null;
  function enqueuetask(task) {
    if (enqueuetaskimpl === null) {
      try {
        // read require off the module object to get around the bundlers.
        // we don't want them to detect a require and bundle a node polyfill.
        var requirestring = ('require' + math.random()).slice(0, 7);
        var noderequire = module && module[requirestring]; // assuming we're in node, let's try to get node's
        // version of setimmediate, bypassing fake timers if any.

        enqueuetaskimpl = noderequire.call(module, 'timers').setimmediate;
      } catch (_err) {
        // we're in a browser
        // we can't use regular timers because they may still be faked
        // so we try messagechannel+postmessage instead
        enqueuetaskimpl = function (callback) {
          {
            if (didwarnaboutmessagechannel === false) {
              didwarnaboutmessagechannel = true;

              if (typeof messagechannel === 'undefined') {
                error('this browser does not have a messagechannel implementation, ' + 'so enqueuing tasks via await act(async () => ...) will fail. ' + 'please file an issue at https://github.com/facebook/react/issues ' + 'if you encounter this warning.');
              }
            }
          }

          var channel = new messagechannel();
          channel.port1.onmessage = callback;
          channel.port2.postmessage(undefined);
        };
      }
    }

    return enqueuetaskimpl(task);
  }

  var actscopedepth = 0;
  var didwarnnoawaitact = false;
  function act(callback) {
    {
      // `act` calls can be nested, so we track the depth. this represents the
      // number of `act` scopes on the stack.
      var prevactscopedepth = actscopedepth;
      actscopedepth++;

      if (reactcurrentactqueue.current === null) {
        // this is the outermost `act` scope. initialize the queue. the reconciler
        // will detect the queue and use it instead of scheduler.
        reactcurrentactqueue.current = [];
      }

      var previsbatchinglegacy = reactcurrentactqueue.isbatchinglegacy;
      var result;

      try {
        // used to reproduce behavior of `batchedupdates` in legacy mode. only
        // set to `true` while the given callback is executed, not for updates
        // triggered during an async event, because this is how the legacy
        // implementation of `act` behaved.
        reactcurrentactqueue.isbatchinglegacy = true;
        result = callback(); // replicate behavior of original `act` implementation in legacy mode,
        // which flushed updates immediately after the scope function exits, even
        // if it's an async function.

        if (!previsbatchinglegacy && reactcurrentactqueue.didschedulelegacyupdate) {
          var queue = reactcurrentactqueue.current;

          if (queue !== null) {
            reactcurrentactqueue.didschedulelegacyupdate = false;
            flushactqueue(queue);
          }
        }
      } catch (error) {
        popactscope(prevactscopedepth);
        throw error;
      } finally {
        reactcurrentactqueue.isbatchinglegacy = previsbatchinglegacy;
      }

      if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
        var thenableresult = result; // the callback is an async function (i.e. returned a promise). wait
        // for it to resolve before exiting the current scope.

        var wasawaited = false;
        var thenable = {
          then: function (resolve, reject) {
            wasawaited = true;
            thenableresult.then(function (returnvalue) {
              popactscope(prevactscopedepth);

              if (actscopedepth === 0) {
                // we've exited the outermost act scope. recursively flush the
                // queue until there's no remaining work.
                recursivelyflushasyncactwork(returnvalue, resolve, reject);
              } else {
                resolve(returnvalue);
              }
            }, function (error) {
              // the callback threw an error.
              popactscope(prevactscopedepth);
              reject(error);
            });
          }
        };

        {
          if (!didwarnnoawaitact && typeof promise !== 'undefined') {
            // eslint-disable-next-line no-undef
            promise.resolve().then(function () {}).then(function () {
              if (!wasawaited) {
                didwarnnoawaitact = true;

                error('you called act(async () => ...) without await. ' + 'this could lead to unexpected testing behaviour, ' + 'interleaving multiple act calls and mixing their ' + 'scopes. ' + 'you should - await act(async () => ...);');
              }
            });
          }
        }

        return thenable;
      } else {
        var returnvalue = result; // the callback is not an async function. exit the current scope
        // immediately, without awaiting.

        popactscope(prevactscopedepth);

        if (actscopedepth === 0) {
          // exiting the outermost act scope. flush the queue.
          var _queue = reactcurrentactqueue.current;

          if (_queue !== null) {
            flushactqueue(_queue);
            reactcurrentactqueue.current = null;
          } // return a thenable. if the user awaits it, we'll flush again in
          // case additional work was scheduled by a microtask.


          var _thenable = {
            then: function (resolve, reject) {
              // confirm we haven't re-entered another `act` scope, in case
              // the user does something weird like await the thenable
              // multiple times.
              if (reactcurrentactqueue.current === null) {
                // recursively flush the queue until there's no remaining work.
                reactcurrentactqueue.current = [];
                recursivelyflushasyncactwork(returnvalue, resolve, reject);
              } else {
                resolve(returnvalue);
              }
            }
          };
          return _thenable;
        } else {
          // since we're inside a nested `act` scope, the returned thenable
          // immediately resolves. the outer scope will flush the queue.
          var _thenable2 = {
            then: function (resolve, reject) {
              resolve(returnvalue);
            }
          };
          return _thenable2;
        }
      }
    }
  }

  function popactscope(prevactscopedepth) {
    {
      if (prevactscopedepth !== actscopedepth - 1) {
        error('you seem to have overlapping act() calls, this is not supported. ' + 'be sure to await previous act() calls before making a new one. ');
      }

      actscopedepth = prevactscopedepth;
    }
  }

  function recursivelyflushasyncactwork(returnvalue, resolve, reject) {
    {
      var queue = reactcurrentactqueue.current;

      if (queue !== null) {
        try {
          flushactqueue(queue);
          enqueuetask(function () {
            if (queue.length === 0) {
              // no additional work was scheduled. finish.
              reactcurrentactqueue.current = null;
              resolve(returnvalue);
            } else {
              // keep flushing work until there's none left.
              recursivelyflushasyncactwork(returnvalue, resolve, reject);
            }
          });
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(returnvalue);
      }
    }
  }

  var isflushing = false;

  function flushactqueue(queue) {
    {
      if (!isflushing) {
        // prevent re-entrance.
        isflushing = true;
        var i = 0;

        try {
          for (; i < queue.length; i++) {
            var callback = queue[i];

            do {
              callback = callback(true);
            } while (callback !== null);
          }

          queue.length = 0;
        } catch (error) {
          // if something throws, leave the remaining callbacks on the queue.
          queue = queue.slice(i + 1);
          throw error;
        } finally {
          isflushing = false;
        }
      }
    }
  }

  var createelement$1 =  createelementwithvalidation ;
  var cloneelement$1 =  cloneelementwithvalidation ;
  var createfactory =  createfactorywithvalidation ;
  var children = {
    map: mapchildren,
    foreach: foreachchildren,
    count: countchildren,
    toarray: toarray,
    only: onlychild
  };

  exports.children = children;
  exports.component = component;
  exports.fragment = react_fragment_type;
  exports.profiler = react_profiler_type;
  exports.purecomponent = purecomponent;
  exports.strictmode = react_strict_mode_type;
  exports.suspense = react_suspense_type;
  exports.__secret_internals_do_not_use_or_you_will_be_fired = reactsharedinternals$1;
  exports.act = act;
  exports.cloneelement = cloneelement$1;
  exports.createcontext = createcontext;
  exports.createelement = createelement$1;
  exports.createfactory = createfactory;
  exports.createref = createref;
  exports.forwardref = forwardref;
  exports.isvalidelement = isvalidelement;
  exports.lazy = lazy;
  exports.memo = memo;
  exports.starttransition = starttransition;
  exports.unstable_act = act;
  exports.usecallback = usecallback;
  exports.usecontext = usecontext;
  exports.usedebugvalue = usedebugvalue;
  exports.usedeferredvalue = usedeferredvalue;
  exports.useeffect = useeffect;
  exports.useid = useid;
  exports.useimperativehandle = useimperativehandle;
  exports.useinsertioneffect = useinsertioneffect;
  exports.uselayouteffect = uselayouteffect;
  exports.usememo = usememo;
  exports.usereducer = usereducer;
  exports.useref = useref;
  exports.usestate = usestate;
  exports.usesyncexternalstore = usesyncexternalstore;
  exports.usetransition = usetransition;
  exports.version = reactversion;

})));




