(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.whatwgfetch = {})));
}(this, (function (exports) { 'use strict';

  /* eslint-disable no-prototype-builtins */
  var g =
    (typeof globalthis !== 'undefined' && globalthis) ||
    (typeof self !== 'undefined' && self) ||
    // eslint-disable-next-line no-undef
    (typeof global !== 'undefined' && global) ||
    {};

  var support = {
    searchparams: 'urlsearchparams' in g,
    iterable: 'symbol' in g && 'iterator' in symbol,
    blob:
      'filereader' in g &&
      'blob' in g &&
      (function() {
        try {
          new blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formdata: 'formdata' in g,
    arraybuffer: 'arraybuffer' in g
  };

  function isdataview(obj) {
    return obj && dataview.prototype.isprototypeof(obj)
  }

  if (support.arraybuffer) {
    var viewclasses = [
      '[object int8array]',
      '[object uint8array]',
      '[object uint8clampedarray]',
      '[object int16array]',
      '[object uint16array]',
      '[object int32array]',
      '[object uint32array]',
      '[object float32array]',
      '[object float64array]'
    ];

    var isarraybufferview =
      arraybuffer.isview ||
      function(obj) {
        return obj && viewclasses.indexof(object.prototype.tostring.call(obj)) > -1
      };
  }

  function normalizename(name) {
    if (typeof name !== 'string') {
      name = string(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
      throw new typeerror('invalid character in header field name: "' + name + '"')
    }
    return name.tolowercase()
  }

  function normalizevalue(value) {
    if (typeof value !== 'string') {
      value = string(value);
    }
    return value
  }

  // build a destructive iterator for the value list
  function iteratorfor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function headers(headers) {
    this.map = {};

    if (headers instanceof headers) {
      headers.foreach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (array.isarray(headers)) {
      headers.foreach(function(header) {
        if (header.length != 2) {
          throw new typeerror('headers constructor: expected name/value pair to be length 2, found' + header.length)
        }
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      object.getownpropertynames(headers).foreach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  headers.prototype.append = function(name, value) {
    name = normalizename(name);
    value = normalizevalue(value);
    var oldvalue = this.map[name];
    this.map[name] = oldvalue ? oldvalue + ', ' + value : value;
  };

  headers.prototype['delete'] = function(name) {
    delete this.map[normalizename(name)];
  };

  headers.prototype.get = function(name) {
    name = normalizename(name);
    return this.has(name) ? this.map[name] : null
  };

  headers.prototype.has = function(name) {
    return this.map.hasownproperty(normalizename(name))
  };

  headers.prototype.set = function(name, value) {
    this.map[normalizename(name)] = normalizevalue(value);
  };

  headers.prototype.foreach = function(callback, thisarg) {
    for (var name in this.map) {
      if (this.map.hasownproperty(name)) {
        callback.call(thisarg, this.map[name], name, this);
      }
    }
  };

  headers.prototype.keys = function() {
    var items = [];
    this.foreach(function(value, name) {
      items.push(name);
    });
    return iteratorfor(items)
  };

  headers.prototype.values = function() {
    var items = [];
    this.foreach(function(value) {
      items.push(value);
    });
    return iteratorfor(items)
  };

  headers.prototype.entries = function() {
    var items = [];
    this.foreach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorfor(items)
  };

  if (support.iterable) {
    headers.prototype[symbol.iterator] = headers.prototype.entries;
  }

  function consumed(body) {
    if (body._nobody) return
    if (body.bodyused) {
      return promise.reject(new typeerror('already read'))
    }
    body.bodyused = true;
  }

  function filereaderready(reader) {
    return new promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readblobasarraybuffer(blob) {
    var reader = new filereader();
    var promise = filereaderready(reader);
    reader.readasarraybuffer(blob);
    return promise
  }

  function readblobastext(blob) {
    var reader = new filereader();
    var promise = filereaderready(reader);
    var match = /charset=([a-za-z0-9_-]+)/.exec(blob.type);
    var encoding = match ? match[1] : 'utf-8';
    reader.readastext(blob, encoding);
    return promise
  }

  function readarraybufferastext(buf) {
    var view = new uint8array(buf);
    var chars = new array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = string.fromcharcode(view[i]);
    }
    return chars.join('')
  }

  function bufferclone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new uint8array(buf.bytelength);
      view.set(new uint8array(buf));
      return view.buffer
    }
  }

  function body() {
    this.bodyused = false;

    this._initbody = function(body) {
      /*
        fetch-mock wraps the response object in an es6 proxy to
        provide useful test harness features such as flush. however, on
        es5 browsers without fetch or proxy support pollyfills must be used;
        the proxy-pollyfill is unable to proxy an attribute unless it exists
        on the object before the proxy is created. this change ensures
        response.bodyused exists on the instance, while maintaining the
        semantic of setting request.bodyused in the constructor before
        _initbody is called.
      */
      // eslint-disable-next-line no-self-assign
      this.bodyused = this.bodyused;
      this._bodyinit = body;
      if (!body) {
        this._nobody = true;
        this._bodytext = '';
      } else if (typeof body === 'string') {
        this._bodytext = body;
      } else if (support.blob && blob.prototype.isprototypeof(body)) {
        this._bodyblob = body;
      } else if (support.formdata && formdata.prototype.isprototypeof(body)) {
        this._bodyformdata = body;
      } else if (support.searchparams && urlsearchparams.prototype.isprototypeof(body)) {
        this._bodytext = body.tostring();
      } else if (support.arraybuffer && support.blob && isdataview(body)) {
        this._bodyarraybuffer = bufferclone(body.buffer);
        // ie 10-11 can't handle a dataview body.
        this._bodyinit = new blob([this._bodyarraybuffer]);
      } else if (support.arraybuffer && (arraybuffer.prototype.isprototypeof(body) || isarraybufferview(body))) {
        this._bodyarraybuffer = bufferclone(body);
      } else {
        this._bodytext = body = object.prototype.tostring.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=utf-8');
        } else if (this._bodyblob && this._bodyblob.type) {
          this.headers.set('content-type', this._bodyblob.type);
        } else if (support.searchparams && urlsearchparams.prototype.isprototypeof(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=utf-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyblob) {
          return promise.resolve(this._bodyblob)
        } else if (this._bodyarraybuffer) {
          return promise.resolve(new blob([this._bodyarraybuffer]))
        } else if (this._bodyformdata) {
          throw new error('could not read formdata body as blob')
        } else {
          return promise.resolve(new blob([this._bodytext]))
        }
      };
    }

    this.arraybuffer = function() {
      if (this._bodyarraybuffer) {
        var isconsumed = consumed(this);
        if (isconsumed) {
          return isconsumed
        } else if (arraybuffer.isview(this._bodyarraybuffer)) {
          return promise.resolve(
            this._bodyarraybuffer.buffer.slice(
              this._bodyarraybuffer.byteoffset,
              this._bodyarraybuffer.byteoffset + this._bodyarraybuffer.bytelength
            )
          )
        } else {
          return promise.resolve(this._bodyarraybuffer)
        }
      } else if (support.blob) {
        return this.blob().then(readblobasarraybuffer)
      } else {
        throw new error('could not read as arraybuffer')
      }
    };

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyblob) {
        return readblobastext(this._bodyblob)
      } else if (this._bodyarraybuffer) {
        return promise.resolve(readarraybufferastext(this._bodyarraybuffer))
      } else if (this._bodyformdata) {
        throw new error('could not read formdata body as text')
      } else {
        return promise.resolve(this._bodytext)
      }
    };

    if (support.formdata) {
      this.formdata = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(json.parse)
    };

    return this
  }

  // http methods whose capitalization should be normalized
  var methods = ['connect', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace'];

  function normalizemethod(method) {
    var upcased = method.touppercase();
    return methods.indexof(upcased) > -1 ? upcased : method
  }

  function request(input, options) {
    if (!(this instanceof request)) {
      throw new typeerror('please use the "new" operator, this dom object constructor cannot be called as a function.')
    }

    options = options || {};
    var body = options.body;

    if (input instanceof request) {
      if (input.bodyused) {
        throw new typeerror('already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyinit != null) {
        body = input._bodyinit;
        input.bodyused = true;
      }
    } else {
      this.url = string(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new headers(options.headers);
    }
    this.method = normalizemethod(options.method || this.method || 'get');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal || (function () {
      if ('abortcontroller' in g) {
        var ctrl = new abortcontroller();
        return ctrl.signal;
      }
    }());
    this.referrer = null;

    if ((this.method === 'get' || this.method === 'head') && body) {
      throw new typeerror('body not allowed for get or head requests')
    }
    this._initbody(body);

    if (this.method === 'get' || this.method === 'head') {
      if (options.cache === 'no-store' || options.cache === 'no-cache') {
        // search for a '_' parameter in the query string
        var reparamsearch = /([?&])_=[^&]*/;
        if (reparamsearch.test(this.url)) {
          // if it already exists then set the value with the current time
          this.url = this.url.replace(reparamsearch, '$1_=' + new date().gettime());
        } else {
          // otherwise add a new '_' parameter to the end with the current time
          var requerystring = /\?/;
          this.url += (requerystring.test(this.url) ? '&' : '?') + '_=' + new date().gettime();
        }
      }
    }
  }

  request.prototype.clone = function() {
    return new request(this, {body: this._bodyinit})
  };

  function decode(body) {
    var form = new formdata();
    body
      .trim()
      .split('&')
      .foreach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeuricomponent(name), decodeuricomponent(value));
        }
      });
    return form
  }

  function parseheaders(rawheaders) {
    var headers = new headers();
    // replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preprocessedheaders = rawheaders.replace(/\r?\n[\t ]+/g, ' ');
    // avoiding split via regex to work around a common ie11 bug with the core-js 3.6.0 regex polyfill
    // https://github.com/github/fetch/issues/748
    // https://github.com/zloirock/core-js/issues/751
    preprocessedheaders
      .split('\r')
      .map(function(header) {
        return header.indexof('\n') === 0 ? header.substr(1, header.length) : header
      })
      .foreach(function(line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        if (key) {
          var value = parts.join(':').trim();
          try {
            headers.append(key, value);
          } catch (error) {
            console.warn('response ' + error.message);
          }
        }
      });
    return headers
  }

  body.call(request.prototype);

  function response(bodyinit, options) {
    if (!(this instanceof response)) {
      throw new typeerror('please use the "new" operator, this dom object constructor cannot be called as a function.')
    }
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    if (this.status < 200 || this.status > 599) {
      throw new rangeerror("failed to construct 'response': the status provided (0) is outside the range [200, 599].")
    }
    this.ok = this.status >= 200 && this.status < 300;
    this.statustext = options.statustext === undefined ? '' : '' + options.statustext;
    this.headers = new headers(options.headers);
    this.url = options.url || '';
    this._initbody(bodyinit);
  }

  body.call(response.prototype);

  response.prototype.clone = function() {
    return new response(this._bodyinit, {
      status: this.status,
      statustext: this.statustext,
      headers: new headers(this.headers),
      url: this.url
    })
  };

  response.error = function() {
    var response = new response(null, {status: 200, statustext: ''});
    response.ok = false;
    response.status = 0;
    response.type = 'error';
    return response
  };

  var redirectstatuses = [301, 302, 303, 307, 308];

  response.redirect = function(url, status) {
    if (redirectstatuses.indexof(status) === -1) {
      throw new rangeerror('invalid status code')
    }

    return new response(null, {status: status, headers: {location: url}})
  };

  exports.domexception = g.domexception;
  try {
    new exports.domexception();
  } catch (err) {
    exports.domexception = function(message, name) {
      this.message = message;
      this.name = name;
      var error = error(message);
      this.stack = error.stack;
    };
    exports.domexception.prototype = object.create(error.prototype);
    exports.domexception.prototype.constructor = exports.domexception;
  }

  function fetch(input, init) {
    return new promise(function(resolve, reject) {
      var request = new request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.domexception('aborted', 'aborterror'))
      }

      var xhr = new xmlhttprequest();

      function abortxhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          statustext: xhr.statustext,
          headers: parseheaders(xhr.getallresponseheaders() || '')
        };
        // this check if specifically for when a user fetches a file locally from the file system
        // only if the status is out of a normal range
        if (request.url.indexof('file://') === 0 && (xhr.status < 200 || xhr.status > 599)) {
          options.status = 200;
        } else {
          options.status = xhr.status;
        }
        options.url = 'responseurl' in xhr ? xhr.responseurl : options.headers.get('x-request-url');
        var body = 'response' in xhr ? xhr.response : xhr.responsetext;
        settimeout(function() {
          resolve(new response(body, options));
        }, 0);
      };

      xhr.onerror = function() {
        settimeout(function() {
          reject(new typeerror('network request failed'));
        }, 0);
      };

      xhr.ontimeout = function() {
        settimeout(function() {
          reject(new typeerror('network request timed out'));
        }, 0);
      };

      xhr.onabort = function() {
        settimeout(function() {
          reject(new exports.domexception('aborted', 'aborterror'));
        }, 0);
      };

      function fixurl(url) {
        try {
          return url === '' && g.location.href ? g.location.href : url
        } catch (e) {
          return url
        }
      }

      xhr.open(request.method, fixurl(request.url), true);

      if (request.credentials === 'include') {
        xhr.withcredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withcredentials = false;
      }

      if ('responsetype' in xhr) {
        if (support.blob) {
          xhr.responsetype = 'blob';
        } else if (
          support.arraybuffer
        ) {
          xhr.responsetype = 'arraybuffer';
        }
      }

      if (init && typeof init.headers === 'object' && !(init.headers instanceof headers || (g.headers && init.headers instanceof g.headers))) {
        var names = [];
        object.getownpropertynames(init.headers).foreach(function(name) {
          names.push(normalizename(name));
          xhr.setrequestheader(name, normalizevalue(init.headers[name]));
        });
        request.headers.foreach(function(value, name) {
          if (names.indexof(name) === -1) {
            xhr.setrequestheader(name, value);
          }
        });
      } else {
        request.headers.foreach(function(value, name) {
          xhr.setrequestheader(name, value);
        });
      }

      if (request.signal) {
        request.signal.addeventlistener('abort', abortxhr);

        xhr.onreadystatechange = function() {
          // done (success or failure)
          if (xhr.readystate === 4) {
            request.signal.removeeventlistener('abort', abortxhr);
          }
        };
      }

      xhr.send(typeof request._bodyinit === 'undefined' ? null : request._bodyinit);
    })
  }

  fetch.polyfill = true;

  if (!g.fetch) {
    g.fetch = fetch;
    g.headers = headers;
    g.request = request;
    g.response = response;
  }

  exports.headers = headers;
  exports.request = request;
  exports.response = response;
  exports.fetch = fetch;

  object.defineproperty(exports, '__esmodule', { value: true });

})));







