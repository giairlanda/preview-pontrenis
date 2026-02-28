/**
 * copyright (c) 2014-present, facebook, inc.
 *
 * this source code is licensed under the mit license found in the
 * license file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var op = object.prototype;
  var hasown = op.hasownproperty;
  var defineproperty = object.defineproperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // more compressible than void 0.
  var $symbol = typeof symbol === "function" ? symbol : {};
  var iteratorsymbol = $symbol.iterator || "@@iterator";
  var asynciteratorsymbol = $symbol.asynciterator || "@@asynciterator";
  var tostringtagsymbol = $symbol.tostringtag || "@@tostringtag";

  function define(obj, key, value) {
    object.defineproperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // ie 8 has a broken object.defineproperty that only works on dom objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerfn, outerfn, self, trylocslist) {
    // if outerfn provided and outerfn.prototype is a generator, then outerfn.prototype instanceof generator.
    var protogenerator = outerfn && outerfn.prototype instanceof generator ? outerfn : generator;
    var generator = object.create(protogenerator.prototype);
    var context = new context(trylocslist || []);

    // the ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineproperty(generator, "_invoke", { value: makeinvokemethod(innerfn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // try/catch helper to minimize deoptimizations. returns a completion
  // record like context.tryentries[i].completion. this interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. we can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. the
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function trycatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var genstatesuspendedstart = "suspendedstart";
  var genstatesuspendedyield = "suspendedyield";
  var genstateexecuting = "executing";
  var genstatecompleted = "completed";

  // returning this object from the innerfn has the same effect as
  // breaking out of the dispatch switch statement.
  var continuesentinel = {};

  // dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return generator
  // objects. for full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function generator() {}
  function generatorfunction() {}
  function generatorfunctionprototype() {}

  // this is a polyfill for %iteratorprototype% for environments that
  // don't natively support it.
  var iteratorprototype = {};
  define(iteratorprototype, iteratorsymbol, function () {
    return this;
  });

  var getproto = object.getprototypeof;
  var nativeiteratorprototype = getproto && getproto(getproto(values([])));
  if (nativeiteratorprototype &&
      nativeiteratorprototype !== op &&
      hasown.call(nativeiteratorprototype, iteratorsymbol)) {
    // this environment has a native %iteratorprototype%; use it instead
    // of the polyfill.
    iteratorprototype = nativeiteratorprototype;
  }

  var gp = generatorfunctionprototype.prototype =
    generator.prototype = object.create(iteratorprototype);
  generatorfunction.prototype = generatorfunctionprototype;
  defineproperty(gp, "constructor", { value: generatorfunctionprototype, configurable: true });
  defineproperty(
    generatorfunctionprototype,
    "constructor",
    { value: generatorfunction, configurable: true }
  );
  generatorfunction.displayname = define(
    generatorfunctionprototype,
    tostringtagsymbol,
    "generatorfunction"
  );

  // helper for defining the .next, .throw, and .return methods of the
  // iterator interface in terms of a single ._invoke method.
  function defineiteratormethods(prototype) {
    ["next", "throw", "return"].foreach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isgeneratorfunction = function(genfun) {
    var ctor = typeof genfun === "function" && genfun.constructor;
    return ctor
      ? ctor === generatorfunction ||
        // for the native generatorfunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayname || ctor.name) === "generatorfunction"
      : false;
  };

  exports.mark = function(genfun) {
    if (object.setprototypeof) {
      object.setprototypeof(genfun, generatorfunctionprototype);
    } else {
      genfun.__proto__ = generatorfunctionprototype;
      define(genfun, tostringtagsymbol, "generatorfunction");
    }
    genfun.prototype = object.create(gp);
    return genfun;
  };

  // within the body of any async function, `await x` is transformed to
  // `yield regeneratorruntime.awrap(x)`, so that the runtime can test
  // `hasown.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function asynciterator(generator, promiseimpl) {
    function invoke(method, arg, resolve, reject) {
      var record = trycatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasown.call(value, "__await")) {
          return promiseimpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return promiseimpl.resolve(value).then(function(unwrapped) {
          // when a yielded promise is resolved, its final value becomes
          // the .value of the promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // if a rejected promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previouspromise;

    function enqueue(method, arg) {
      function callinvokewithmethodandarg() {
        return new promiseimpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previouspromise =
        // if enqueue has been called before, then we want to wait until
        // all previous promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. if
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. this predictability
        // is why the promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previouspromise ? previouspromise.then(
          callinvokewithmethodandarg,
          // avoid propagating failures to promises returned by later
          // invocations of the iterator.
          callinvokewithmethodandarg
        ) : callinvokewithmethodandarg();
    }

    // define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineiteratormethods).
    defineproperty(this, "_invoke", { value: enqueue });
  }

  defineiteratormethods(asynciterator.prototype);
  define(asynciterator.prototype, asynciteratorsymbol, function () {
    return this;
  });
  exports.asynciterator = asynciterator;

  // note that simple async functions are implemented on top of
  // asynciterator objects; they just return a promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerfn, outerfn, self, trylocslist, promiseimpl) {
    if (promiseimpl === void 0) promiseimpl = promise;

    var iter = new asynciterator(
      wrap(innerfn, outerfn, self, trylocslist),
      promiseimpl
    );

    return exports.isgeneratorfunction(outerfn)
      ? iter // if outerfn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeinvokemethod(innerfn, self, context) {
    var state = genstatesuspendedstart;

    return function invoke(method, arg) {
      if (state === genstateexecuting) {
        throw new error("generator is already running");
      }

      if (state === genstatecompleted) {
        if (method === "throw") {
          throw arg;
        }

        // be forgiving, per generatorresume behavior specified since es2015:
        // es2015 spec, step 3: https://262.ecma-international.org/6.0/#sec-generatorresume
        // latest spec, step 2: https://tc39.es/ecma262/#sec-generatorresume
        return doneresult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateresult = maybeinvokedelegate(delegate, context);
          if (delegateresult) {
            if (delegateresult === continuesentinel) continue;
            return delegateresult;
          }
        }

        if (context.method === "next") {
          // setting context._sent for legacy support of babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === genstatesuspendedstart) {
            state = genstatecompleted;
            throw context.arg;
          }

          context.dispatchexception(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = genstateexecuting;

        var record = trycatch(innerfn, self, context);
        if (record.type === "normal") {
          // if an exception is thrown from innerfn, we leave state ===
          // genstateexecuting and loop back for another invocation.
          state = context.done
            ? genstatecompleted
            : genstatesuspendedyield;

          if (record.arg === continuesentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = genstatecompleted;
          // dispatch the exception by looping back around to the
          // context.dispatchexception(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the continuesentinel.
  function maybeinvokedelegate(delegate, context) {
    var methodname = context.method;
    var method = delegate.iterator[methodname];
    if (method === undefined) {
      // a .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next method, always terminate the
      // yield* loop.
      context.delegate = null;

      // note: ["return"] must be used for es3 parsing compatibility.
      if (methodname === "throw" && delegate.iterator["return"]) {
        // if the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeinvokedelegate(delegate, context);

        if (context.method === "throw") {
          // if maybeinvokedelegate(context) changed context.method from
          // "return" to "throw", let that override the typeerror below.
          return continuesentinel;
        }
      }
      if (methodname !== "return") {
        context.method = "throw";
        context.arg = new typeerror(
          "the iterator does not provide a '" + methodname + "' method");
      }

      return continuesentinel;
    }

    var record = trycatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return continuesentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new typeerror("iterator result is not an object");
      context.delegate = null;
      return continuesentinel;
    }

    if (info.done) {
      // assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultname (see delegateyield).
      context[delegate.resultname] = info.value;

      // resume execution at the desired location (see delegateyield).
      context.next = delegate.nextloc;

      // if context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. if
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. if context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // re-yield the result returned by the delegate method.
      return info;
    }

    // the delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return continuesentinel;
  }

  // define generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineiteratormethods(gp);

  define(gp, tostringtagsymbol, "generator");

  // a generator should always return itself as the iterator object when the
  // @@iterator function is called on it. some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the generator
  // object to not be returned from this call. this ensures that doesn't happen.
  // see https://github.com/facebook/regenerator/issues/274 for more details.
  define(gp, iteratorsymbol, function() {
    return this;
  });

  define(gp, "tostring", function() {
    return "[object generator]";
  });

  function pushtryentry(locs) {
    var entry = { tryloc: locs[0] };

    if (1 in locs) {
      entry.catchloc = locs[1];
    }

    if (2 in locs) {
      entry.finallyloc = locs[2];
      entry.afterloc = locs[3];
    }

    this.tryentries.push(entry);
  }

  function resettryentry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function context(trylocslist) {
    // the root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryentries = [{ tryloc: "root" }];
    trylocslist.foreach(pushtryentry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // to avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. this
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable != null) {
      var iteratormethod = iterable[iteratorsymbol];
      if (iteratormethod) {
        return iteratormethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isnan(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasown.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    throw new typeerror(typeof iterable + " is not iterable");
  }
  exports.values = values;

  function doneresult() {
    return { value: undefined, done: true };
  }

  context.prototype = {
    constructor: context,

    reset: function(skiptempreset) {
      this.prev = 0;
      this.next = 0;
      // resetting context._sent for legacy support of babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryentries.foreach(resettryentry);

      if (!skiptempreset) {
        for (var name in this) {
          // not sure about the optimal order of these conditions:
          if (name.charat(0) === "t" &&
              hasown.call(this, name) &&
              !isnan(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootentry = this.tryentries[0];
      var rootrecord = rootentry.completion;
      if (rootrecord.type === "throw") {
        throw rootrecord.arg;
      }

      return this.rval;
    },

    dispatchexception: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // if the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryentries.length - 1; i >= 0; --i) {
        var entry = this.tryentries[i];
        var record = entry.completion;

        if (entry.tryloc === "root") {
          // exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryloc <= this.prev) {
          var hascatch = hasown.call(entry, "catchloc");
          var hasfinally = hasown.call(entry, "finallyloc");

          if (hascatch && hasfinally) {
            if (this.prev < entry.catchloc) {
              return handle(entry.catchloc, true);
            } else if (this.prev < entry.finallyloc) {
              return handle(entry.finallyloc);
            }

          } else if (hascatch) {
            if (this.prev < entry.catchloc) {
              return handle(entry.catchloc, true);
            }

          } else if (hasfinally) {
            if (this.prev < entry.finallyloc) {
              return handle(entry.finallyloc);
            }

          } else {
            throw new error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryentries.length - 1; i >= 0; --i) {
        var entry = this.tryentries[i];
        if (entry.tryloc <= this.prev &&
            hasown.call(entry, "finallyloc") &&
            this.prev < entry.finallyloc) {
          var finallyentry = entry;
          break;
        }
      }

      if (finallyentry &&
          (type === "break" ||
           type === "continue") &&
          finallyentry.tryloc <= arg &&
          arg <= finallyentry.finallyloc) {
        // ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyentry = null;
      }

      var record = finallyentry ? finallyentry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyentry) {
        this.method = "next";
        this.next = finallyentry.finallyloc;
        return continuesentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterloc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterloc) {
        this.next = afterloc;
      }

      return continuesentinel;
    },

    finish: function(finallyloc) {
      for (var i = this.tryentries.length - 1; i >= 0; --i) {
        var entry = this.tryentries[i];
        if (entry.finallyloc === finallyloc) {
          this.complete(entry.completion, entry.afterloc);
          resettryentry(entry);
          return continuesentinel;
        }
      }
    },

    "catch": function(tryloc) {
      for (var i = this.tryentries.length - 1; i >= 0; --i) {
        var entry = this.tryentries[i];
        if (entry.tryloc === tryloc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resettryentry(entry);
          }
          return thrown;
        }
      }

      // the context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new error("illegal catch attempt");
    },

    delegateyield: function(iterable, resultname, nextloc) {
      this.delegate = {
        iterator: values(iterable),
        resultname: resultname,
        nextloc: nextloc
      };

      if (this.method === "next") {
        // deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return continuesentinel;
    }
  };

  // regardless of whether this script is executing as a commonjs module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorruntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // if this script is executing as a commonjs module, use module.exports
  // as the regeneratorruntime namespace. otherwise create a new empty
  // object. either way, the resulting object will be used to initialize
  // the regeneratorruntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorruntime = runtime;
} catch (accidentalstrictmode) {
  // this module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalthis. in older engines we can escape
  // strict mode using a global function call. this could conceivably fail
  // if a content security policy forbids using function, but in that case
  // the proper solution is to fix the accidental strict mode problem. if
  // you've misconfigured your bundler to force strict mode and applied a
  // csp to forbid function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a github issue.
  if (typeof globalthis === "object") {
    globalthis.regeneratorruntime = runtime;
  } else {
    function("r", "regeneratorruntime = r")(runtime);
  }
}


