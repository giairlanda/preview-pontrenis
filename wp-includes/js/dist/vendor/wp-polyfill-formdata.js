/* formdata-polyfill. mit license. jimmy wã¤rting <https://jimmy.warting.se/opensource> */

/* global formdata self blob file */
/* eslint-disable no-inner-declarations */

if (typeof blob !== 'undefined' && (typeof formdata === 'undefined' || !formdata.prototype.keys)) {
  const global = typeof globalthis === 'object'
    ? globalthis
    : typeof window === 'object'
      ? window
      : typeof self === 'object' ? self : this

  // keep a reference to native implementation
  const _formdata = global.formdata

  // to be monkey patched
  const _send = global.xmlhttprequest && global.xmlhttprequest.prototype.send
  const _fetch = global.request && global.fetch
  const _sendbeacon = global.navigator && global.navigator.sendbeacon
  // might be a worker thread...
  const _match = global.element && global.element.prototype

  // unable to patch request/response constructor correctly #109
  // only way is to use es6 class extend
  // https://github.com/babel/babel/issues/1966

  const stringtag = global.symbol && symbol.tostringtag

  // add missing stringtags to blob and files
  if (stringtag) {
    if (!blob.prototype[stringtag]) {
      blob.prototype[stringtag] = 'blob'
    }

    if ('file' in global && !file.prototype[stringtag]) {
      file.prototype[stringtag] = 'file'
    }
  }

  // fix so you can construct your own file
  try {
    new file([], '') // eslint-disable-line
  } catch (a) {
    global.file = function file (b, d, c) {
      const blob = new blob(b, c || {})
      const t = c && void 0 !== c.lastmodified ? new date(c.lastmodified) : new date()

      object.defineproperties(blob, {
        name: {
          value: d
        },
        lastmodified: {
          value: +t
        },
        tostring: {
          value () {
            return '[object file]'
          }
        }
      })

      if (stringtag) {
        object.defineproperty(blob, stringtag, {
          value: 'file'
        })
      }

      return blob
    }
  }

  function ensureargs (args, expected) {
    if (args.length < expected) {
      throw new typeerror(`${expected} argument required, but only ${args.length} present.`)
    }
  }

  /**
   * @param {string} name
   * @param {string | undefined} filename
   * @returns {[string, file|string]}
   */
  function normalizeargs (name, value, filename) {
    if (value instanceof blob) {
      filename = filename !== undefined
      ? string(filename + '')
      : typeof value.name === 'string'
      ? value.name
      : 'blob'

      if (value.name !== filename || object.prototype.tostring.call(value) === '[object blob]') {
        value = new file([value], filename)
      }
      return [string(name), value]
    }
    return [string(name), string(value)]
  }

  // normalize line feeds for textarea
  // https://html.spec.whatwg.org/multipage/form-elements.html#textarea-line-break-normalisation-transformation
  function normalizelinefeeds (value) {
    return value.replace(/\r?\n|\r/g, '\r\n')
  }

  /**
   * @template t
   * @param {arraylike<t>} arr
   * @param {{ (elm: t): void; }} cb
   */
  function each (arr, cb) {
    for (let i = 0; i < arr.length; i++) {
      cb(arr[i])
    }
  }

  const escape = str => str.replace(/\n/g, '%0a').replace(/\r/g, '%0d').replace(/"/g, '%22')

  /**
   * @implements {iterable}
   */
  class formdatapolyfill {
    /**
     * formdata class
     *
     * @param {htmlformelement=} form
     */
    constructor (form) {
      /** @type {[string, string|file][]} */
      this._data = []

      const self = this
      form && each(form.elements, (/** @type {htmlinputelement} */ elm) => {
        if (
          !elm.name ||
          elm.disabled ||
          elm.type === 'submit' ||
          elm.type === 'button' ||
          elm.matches('form fieldset[disabled] *')
        ) return

        if (elm.type === 'file') {
          const files = elm.files && elm.files.length
            ? elm.files
            : [new file([], '', { type: 'application/octet-stream' })] // #78

          each(files, file => {
            self.append(elm.name, file)
          })
        } else if (elm.type === 'select-multiple' || elm.type === 'select-one') {
          each(elm.options, opt => {
            !opt.disabled && opt.selected && self.append(elm.name, opt.value)
          })
        } else if (elm.type === 'checkbox' || elm.type === 'radio') {
          if (elm.checked) self.append(elm.name, elm.value)
        } else {
          const value = elm.type === 'textarea' ? normalizelinefeeds(elm.value) : elm.value
          self.append(elm.name, value)
        }
      })
    }

    /**
     * append a field
     *
     * @param   {string}           name      field name
     * @param   {string|blob|file} value     string / blob / file
     * @param   {string=}          filename  filename to use with blob
     * @return  {undefined}
     */
    append (name, value, filename) {
      ensureargs(arguments, 2)
      this._data.push(normalizeargs(name, value, filename))
    }

    /**
     * delete all fields values given name
     *
     * @param   {string}  name  field name
     * @return  {undefined}
     */
    delete (name) {
      ensureargs(arguments, 1)
      const result = []
      name = string(name)

      each(this._data, entry => {
        entry[0] !== name && result.push(entry)
      })

      this._data = result
    }

    /**
     * iterate over all fields as [name, value]
     *
     * @return {iterator}
     */
    * entries () {
      for (var i = 0; i < this._data.length; i++) {
        yield this._data[i]
      }
    }

    /**
     * iterate over all fields
     *
     * @param   {function}  callback  executed for each item with parameters (value, name, thisarg)
     * @param   {object=}   thisarg   `this` context for callback function
     */
    foreach (callback, thisarg) {
      ensureargs(arguments, 1)
      for (const [name, value] of this) {
        callback.call(thisarg, value, name, this)
      }
    }

    /**
     * return first field value given name
     * or null if non existent
     *
     * @param   {string}  name      field name
     * @return  {string|file|null}  value fields value
     */
    get (name) {
      ensureargs(arguments, 1)
      const entries = this._data
      name = string(name)
      for (let i = 0; i < entries.length; i++) {
        if (entries[i][0] === name) {
          return entries[i][1]
        }
      }
      return null
    }

    /**
     * return all fields values given name
     *
     * @param   {string}  name  fields name
     * @return  {array}         [{string|file}]
     */
    getall (name) {
      ensureargs(arguments, 1)
      const result = []
      name = string(name)
      each(this._data, data => {
        data[0] === name && result.push(data[1])
      })

      return result
    }

    /**
     * check for field name existence
     *
     * @param   {string}   name  field name
     * @return  {boolean}
     */
    has (name) {
      ensureargs(arguments, 1)
      name = string(name)
      for (let i = 0; i < this._data.length; i++) {
        if (this._data[i][0] === name) {
          return true
        }
      }
      return false
    }

    /**
     * iterate over all fields name
     *
     * @return {iterator}
     */
    * keys () {
      for (const [name] of this) {
        yield name
      }
    }

    /**
     * overwrite all values given name
     *
     * @param   {string}    name      filed name
     * @param   {string}    value     field value
     * @param   {string=}   filename  filename (optional)
     */
    set (name, value, filename) {
      ensureargs(arguments, 2)
      name = string(name)
      /** @type {[string, string|file][]} */
      const result = []
      const args = normalizeargs(name, value, filename)
      let replace = true

      // - replace the first occurrence with same name
      // - discards the remaining with same name
      // - while keeping the same order items where added
      each(this._data, data => {
        data[0] === name
          ? replace && (replace = !result.push(args))
          : result.push(data)
      })

      replace && result.push(args)

      this._data = result
    }

    /**
     * iterate over all fields
     *
     * @return {iterator}
     */
    * values () {
      for (const [, value] of this) {
        yield value
      }
    }

    /**
     * return a native (perhaps degraded) formdata with only a `append` method
     * can throw if it's not supported
     *
     * @return {formdata}
     */
    ['_asnative'] () {
      const fd = new _formdata()

      for (const [name, value] of this) {
        fd.append(name, value)
      }

      return fd
    }

    /**
     * [_blob description]
     *
     * @return {blob} [description]
     */
    ['_blob'] () {
        const boundary = '----formdata-polyfill-' + math.random(),
          chunks = [],
          p = `--${boundary}\r\ncontent-disposition: form-data; name="`
        this.foreach((value, name) => typeof value == 'string'
          ? chunks.push(p + escape(normalizelinefeeds(name)) + `"\r\n\r\n${normalizelinefeeds(value)}\r\n`)
          : chunks.push(p + escape(normalizelinefeeds(name)) + `"; filename="${escape(value.name)}"\r\ncontent-type: ${value.type||"application/octet-stream"}\r\n\r\n`, value, `\r\n`))
        chunks.push(`--${boundary}--`)
        return new blob(chunks, {
          type: "multipart/form-data; boundary=" + boundary
        })
    }

    /**
     * the class itself is iterable
     * alias for formdata.entries()
     *
     * @return {iterator}
     */
    [symbol.iterator] () {
      return this.entries()
    }

    /**
     * create the default string description.
     *
     * @return  {string} [object formdata]
     */
    tostring () {
      return '[object formdata]'
    }
  }

  if (_match && !_match.matches) {
    _match.matches =
      _match.matchesselector ||
      _match.mozmatchesselector ||
      _match.msmatchesselector ||
      _match.omatchesselector ||
      _match.webkitmatchesselector ||
      function (s) {
        var matches = (this.document || this.ownerdocument).queryselectorall(s)
        var i = matches.length
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1
      }
  }

  if (stringtag) {
    /**
     * create the default string description.
     * it is accessed internally by the object.prototype.tostring().
     */
    formdatapolyfill.prototype[stringtag] = 'formdata'
  }

  // patch xhr's send method to call _blob transparently
  if (_send) {
    const setrequestheader = global.xmlhttprequest.prototype.setrequestheader

    global.xmlhttprequest.prototype.setrequestheader = function (name, value) {
      setrequestheader.call(this, name, value)
      if (name.tolowercase() === 'content-type') this._hascontenttype = true
    }

    global.xmlhttprequest.prototype.send = function (data) {
      // need to patch send b/c old ie don't send blob's type (#44)
      if (data instanceof formdatapolyfill) {
        const blob = data['_blob']()
        if (!this._hascontenttype) this.setrequestheader('content-type', blob.type)
        _send.call(this, blob)
      } else {
        _send.call(this, data)
      }
    }
  }

  // patch fetch's function to call _blob transparently
  if (_fetch) {
    global.fetch = function (input, init) {
      if (init && init.body && init.body instanceof formdatapolyfill) {
        init.body = init.body['_blob']()
      }

      return _fetch.call(this, input, init)
    }
  }

  // patch navigator.sendbeacon to use native formdata
  if (_sendbeacon) {
    global.navigator.sendbeacon = function (url, data) {
      if (data instanceof formdatapolyfill) {
        data = data['_asnative']()
      }
      return _sendbeacon.call(this, url, data)
    }
  }

  global['formdata'] = formdatapolyfill
}




