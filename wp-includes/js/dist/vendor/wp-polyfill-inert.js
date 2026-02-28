(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define('inert', factory) :
  (factory());
}(this, (function () { 'use strict';

  var _createclass = function () { function defineproperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; object.defineproperty(target, descriptor.key, descriptor); } } return function (constructor, protoprops, staticprops) { if (protoprops) defineproperties(constructor.prototype, protoprops); if (staticprops) defineproperties(constructor, staticprops); return constructor; }; }();

  function _classcallcheck(instance, constructor) { if (!(instance instanceof constructor)) { throw new typeerror("cannot call a class as a function"); } }

  /**
   * this work is licensed under the w3c software and document license
   * (http://www.w3.org/consortium/legal/2015/copyright-software-and-document).
   */

  (function () {
    // return early if we're not running inside of the browser.
    if (typeof window === 'undefined' || typeof element === 'undefined') {
      return;
    }

    // convenience function for converting nodelists.
    /** @type {typeof array.prototype.slice} */
    var slice = array.prototype.slice;

    /**
     * ie has a non-standard name for "matches".
     * @type {typeof element.prototype.matches}
     */
    var matches = element.prototype.matches || element.prototype.msmatchesselector;

    /** @type {string} */
    var _focusableelementsstring = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'details', 'summary', 'iframe', 'object', 'embed', 'video', '[contenteditable]'].join(',');

    /**
     * `inertroot` manages a single inert subtree, i.e. a dom subtree whose root element has an `inert`
     * attribute.
     *
     * its main functions are:
     *
     * - to create and maintain a set of managed `inertnode`s, including when mutations occur in the
     *   subtree. the `makesubtreeunfocusable()` method handles collecting `inertnode`s via registering
     *   each focusable node in the subtree with the singleton `inertmanager` which manages all known
     *   focusable nodes within inert subtrees. `inertmanager` ensures that a single `inertnode`
     *   instance exists for each focusable node which has at least one inert root as an ancestor.
     *
     * - to notify all managed `inertnode`s when this subtree stops being inert (i.e. when the `inert`
     *   attribute is removed from the root node). this is handled in the destructor, which calls the
     *   `deregister` method on `inertmanager` for each managed inert node.
     */

    var inertroot = function () {
      /**
       * @param {!htmlelement} rootelement the htmlelement at the root of the inert subtree.
       * @param {!inertmanager} inertmanager the global singleton inertmanager object.
       */
      function inertroot(rootelement, inertmanager) {
        _classcallcheck(this, inertroot);

        /** @type {!inertmanager} */
        this._inertmanager = inertmanager;

        /** @type {!htmlelement} */
        this._rootelement = rootelement;

        /**
         * @type {!set<!inertnode>}
         * all managed focusable nodes in this inertroot's subtree.
         */
        this._managednodes = new set();

        // make the subtree hidden from assistive technology
        if (this._rootelement.hasattribute('aria-hidden')) {
          /** @type {?string} */
          this._savedariahidden = this._rootelement.getattribute('aria-hidden');
        } else {
          this._savedariahidden = null;
        }
        this._rootelement.setattribute('aria-hidden', 'true');

        // make all focusable elements in the subtree unfocusable and add them to _managednodes
        this._makesubtreeunfocusable(this._rootelement);

        // watch for:
        // - any additions in the subtree: make them unfocusable too
        // - any removals from the subtree: remove them from this inert root's managed nodes
        // - attribute changes: if `tabindex` is added, or removed from an intrinsically focusable
        //   element, make that node a managed node.
        this._observer = new mutationobserver(this._onmutation.bind(this));
        this._observer.observe(this._rootelement, { attributes: true, childlist: true, subtree: true });
      }

      /**
       * call this whenever this object is about to become obsolete.  this unwinds all of the state
       * stored in this object and updates the state of all of the managed nodes.
       */


      _createclass(inertroot, [{
        key: 'destructor',
        value: function destructor() {
          this._observer.disconnect();

          if (this._rootelement) {
            if (this._savedariahidden !== null) {
              this._rootelement.setattribute('aria-hidden', this._savedariahidden);
            } else {
              this._rootelement.removeattribute('aria-hidden');
            }
          }

          this._managednodes.foreach(function (inertnode) {
            this._unmanagenode(inertnode.node);
          }, this);

          // note we cast the nulls to the any type here because:
          // 1) we want the class properties to be declared as non-null, or else we
          //    need even more casts throughout this code. all bets are off if an
          //    instance has been destroyed and a method is called.
          // 2) we don't want to cast "this", because we want type-aware optimizations
          //    to know which properties we're setting.
          this._observer = /** @type {?} */null;
          this._rootelement = /** @type {?} */null;
          this._managednodes = /** @type {?} */null;
          this._inertmanager = /** @type {?} */null;
        }

        /**
         * @return {!set<!inertnode>} a copy of this inertroot's managed nodes set.
         */

      }, {
        key: '_makesubtreeunfocusable',


        /**
         * @param {!node} startnode
         */
        value: function _makesubtreeunfocusable(startnode) {
          var _this2 = this;

          composedtreewalk(startnode, function (node) {
            return _this2._visitnode(node);
          });

          var activeelement = document.activeelement;

          if (!document.body.contains(startnode)) {
            // startnode may be in shadow dom, so find its nearest shadowroot to get the activeelement.
            var node = startnode;
            /** @type {!shadowroot|undefined} */
            var root = undefined;
            while (node) {
              if (node.nodetype === node.document_fragment_node) {
                root = /** @type {!shadowroot} */node;
                break;
              }
              node = node.parentnode;
            }
            if (root) {
              activeelement = root.activeelement;
            }
          }
          if (startnode.contains(activeelement)) {
            activeelement.blur();
            // in ie11, if an element is already focused, and then set to tabindex=-1
            // calling blur() will not actually move the focus.
            // to work around this we call focus() on the body instead.
            if (activeelement === document.activeelement) {
              document.body.focus();
            }
          }
        }

        /**
         * @param {!node} node
         */

      }, {
        key: '_visitnode',
        value: function _visitnode(node) {
          if (node.nodetype !== node.element_node) {
            return;
          }
          var element = /** @type {!htmlelement} */node;

          // if a descendant inert root becomes un-inert, its descendants will still be inert because of
          // this inert root, so all of its managed nodes need to be adopted by this inertroot.
          if (element !== this._rootelement && element.hasattribute('inert')) {
            this._adoptinertroot(element);
          }

          if (matches.call(element, _focusableelementsstring) || element.hasattribute('tabindex')) {
            this._managenode(element);
          }
        }

        /**
         * register the given node with this inertroot and with inertmanager.
         * @param {!node} node
         */

      }, {
        key: '_managenode',
        value: function _managenode(node) {
          var inertnode = this._inertmanager.register(node, this);
          this._managednodes.add(inertnode);
        }

        /**
         * unregister the given node with this inertroot and with inertmanager.
         * @param {!node} node
         */

      }, {
        key: '_unmanagenode',
        value: function _unmanagenode(node) {
          var inertnode = this._inertmanager.deregister(node, this);
          if (inertnode) {
            this._managednodes['delete'](inertnode);
          }
        }

        /**
         * unregister the entire subtree starting at `startnode`.
         * @param {!node} startnode
         */

      }, {
        key: '_unmanagesubtree',
        value: function _unmanagesubtree(startnode) {
          var _this3 = this;

          composedtreewalk(startnode, function (node) {
            return _this3._unmanagenode(node);
          });
        }

        /**
         * if a descendant node is found with an `inert` attribute, adopt its managed nodes.
         * @param {!htmlelement} node
         */

      }, {
        key: '_adoptinertroot',
        value: function _adoptinertroot(node) {
          var inertsubroot = this._inertmanager.getinertroot(node);

          // during initialisation this inert root may not have been registered yet,
          // so register it now if need be.
          if (!inertsubroot) {
            this._inertmanager.setinert(node, true);
            inertsubroot = this._inertmanager.getinertroot(node);
          }

          inertsubroot.managednodes.foreach(function (savedinertnode) {
            this._managenode(savedinertnode.node);
          }, this);
        }

        /**
         * callback used when mutation observer detects subtree additions, removals, or attribute changes.
         * @param {!array<!mutationrecord>} records
         * @param {!mutationobserver} self
         */

      }, {
        key: '_onmutation',
        value: function _onmutation(records, self) {
          records.foreach(function (record) {
            var target = /** @type {!htmlelement} */record.target;
            if (record.type === 'childlist') {
              // manage added nodes
              slice.call(record.addednodes).foreach(function (node) {
                this._makesubtreeunfocusable(node);
              }, this);

              // un-manage removed nodes
              slice.call(record.removednodes).foreach(function (node) {
                this._unmanagesubtree(node);
              }, this);
            } else if (record.type === 'attributes') {
              if (record.attributename === 'tabindex') {
                // re-initialise inert node if tabindex changes
                this._managenode(target);
              } else if (target !== this._rootelement && record.attributename === 'inert' && target.hasattribute('inert')) {
                // if a new inert root is added, adopt its managed nodes and make sure it knows about the
                // already managed nodes from this inert subroot.
                this._adoptinertroot(target);
                var inertsubroot = this._inertmanager.getinertroot(target);
                this._managednodes.foreach(function (managednode) {
                  if (target.contains(managednode.node)) {
                    inertsubroot._managenode(managednode.node);
                  }
                });
              }
            }
          }, this);
        }
      }, {
        key: 'managednodes',
        get: function get() {
          return new set(this._managednodes);
        }

        /** @return {boolean} */

      }, {
        key: 'hassavedariahidden',
        get: function get() {
          return this._savedariahidden !== null;
        }

        /** @param {?string} ariahidden */

      }, {
        key: 'savedariahidden',
        set: function set(ariahidden) {
          this._savedariahidden = ariahidden;
        }

        /** @return {?string} */
        ,
        get: function get() {
          return this._savedariahidden;
        }
      }]);

      return inertroot;
    }();

    /**
     * `inertnode` initialises and manages a single inert node.
     * a node is inert if it is a descendant of one or more inert root elements.
     *
     * on construction, `inertnode` saves the existing `tabindex` value for the node, if any, and
     * either removes the `tabindex` attribute or sets it to `-1`, depending on whether the element
     * is intrinsically focusable or not.
     *
     * `inertnode` maintains a set of `inertroot`s which are descendants of this `inertnode`. when an
     * `inertroot` is destroyed, and calls `inertmanager.deregister()`, the `inertmanager` notifies the
     * `inertnode` via `removeinertroot()`, which in turn destroys the `inertnode` if no `inertroot`s
     * remain in the set. on destruction, `inertnode` reinstates the stored `tabindex` if one exists,
     * or removes the `tabindex` attribute if the element is intrinsically focusable.
     */


    var inertnode = function () {
      /**
       * @param {!node} node a focusable element to be made inert.
       * @param {!inertroot} inertroot the inert root element associated with this inert node.
       */
      function inertnode(node, inertroot) {
        _classcallcheck(this, inertnode);

        /** @type {!node} */
        this._node = node;

        /** @type {boolean} */
        this._overrodefocusmethod = false;

        /**
         * @type {!set<!inertroot>} the set of descendant inert roots.
         *    if and only if this set becomes empty, this node is no longer inert.
         */
        this._inertroots = new set([inertroot]);

        /** @type {?number} */
        this._savedtabindex = null;

        /** @type {boolean} */
        this._destroyed = false;

        // save any prior tabindex info and make this node untabbable
        this.ensureuntabbable();
      }

      /**
       * call this whenever this object is about to become obsolete.
       * this makes the managed node focusable again and deletes all of the previously stored state.
       */


      _createclass(inertnode, [{
        key: 'destructor',
        value: function destructor() {
          this._throwifdestroyed();

          if (this._node && this._node.nodetype === node.element_node) {
            var element = /** @type {!htmlelement} */this._node;
            if (this._savedtabindex !== null) {
              element.setattribute('tabindex', this._savedtabindex);
            } else {
              element.removeattribute('tabindex');
            }

            // use `delete` to restore native focus method.
            if (this._overrodefocusmethod) {
              delete element.focus;
            }
          }

          // see note in inertroot.destructor for why we cast these nulls to any.
          this._node = /** @type {?} */null;
          this._inertroots = /** @type {?} */null;
          this._destroyed = true;
        }

        /**
         * @type {boolean} whether this object is obsolete because the managed node is no longer inert.
         * if the object has been destroyed, any attempt to access it will cause an exception.
         */

      }, {
        key: '_throwifdestroyed',


        /**
         * throw if user tries to access destroyed inertnode.
         */
        value: function _throwifdestroyed() {
          if (this.destroyed) {
            throw new error('trying to access destroyed inertnode');
          }
        }

        /** @return {boolean} */

      }, {
        key: 'ensureuntabbable',


        /** save the existing tabindex value and make the node untabbable and unfocusable */
        value: function ensureuntabbable() {
          if (this.node.nodetype !== node.element_node) {
            return;
          }
          var element = /** @type {!htmlelement} */this.node;
          if (matches.call(element, _focusableelementsstring)) {
            if ( /** @type {!htmlelement} */element.tabindex === -1 && this.hassavedtabindex) {
              return;
            }

            if (element.hasattribute('tabindex')) {
              this._savedtabindex = /** @type {!htmlelement} */element.tabindex;
            }
            element.setattribute('tabindex', '-1');
            if (element.nodetype === node.element_node) {
              element.focus = function () {};
              this._overrodefocusmethod = true;
            }
          } else if (element.hasattribute('tabindex')) {
            this._savedtabindex = /** @type {!htmlelement} */element.tabindex;
            element.removeattribute('tabindex');
          }
        }

        /**
         * add another inert root to this inert node's set of managing inert roots.
         * @param {!inertroot} inertroot
         */

      }, {
        key: 'addinertroot',
        value: function addinertroot(inertroot) {
          this._throwifdestroyed();
          this._inertroots.add(inertroot);
        }

        /**
         * remove the given inert root from this inert node's set of managing inert roots.
         * if the set of managing inert roots becomes empty, this node is no longer inert,
         * so the object should be destroyed.
         * @param {!inertroot} inertroot
         */

      }, {
        key: 'removeinertroot',
        value: function removeinertroot(inertroot) {
          this._throwifdestroyed();
          this._inertroots['delete'](inertroot);
          if (this._inertroots.size === 0) {
            this.destructor();
          }
        }
      }, {
        key: 'destroyed',
        get: function get() {
          return (/** @type {!inertnode} */this._destroyed
          );
        }
      }, {
        key: 'hassavedtabindex',
        get: function get() {
          return this._savedtabindex !== null;
        }

        /** @return {!node} */

      }, {
        key: 'node',
        get: function get() {
          this._throwifdestroyed();
          return this._node;
        }

        /** @param {?number} tabindex */

      }, {
        key: 'savedtabindex',
        set: function set(tabindex) {
          this._throwifdestroyed();
          this._savedtabindex = tabindex;
        }

        /** @return {?number} */
        ,
        get: function get() {
          this._throwifdestroyed();
          return this._savedtabindex;
        }
      }]);

      return inertnode;
    }();

    /**
     * inertmanager is a per-document singleton object which manages all inert roots and nodes.
     *
     * when an element becomes an inert root by having an `inert` attribute set and/or its `inert`
     * property set to `true`, the `setinert` method creates an `inertroot` object for the element.
     * the `inertroot` in turn registers itself as managing all of the element's focusable descendant
     * nodes via the `register()` method. the `inertmanager` ensures that a single `inertnode` instance
     * is created for each such node, via the `_managednodes` map.
     */


    var inertmanager = function () {
      /**
       * @param {!document} document
       */
      function inertmanager(document) {
        _classcallcheck(this, inertmanager);

        if (!document) {
          throw new error('missing required argument; inertmanager needs to wrap a document.');
        }

        /** @type {!document} */
        this._document = document;

        /**
         * all managed nodes known to this inertmanager. in a map to allow looking up by node.
         * @type {!map<!node, !inertnode>}
         */
        this._managednodes = new map();

        /**
         * all inert roots known to this inertmanager. in a map to allow looking up by node.
         * @type {!map<!node, !inertroot>}
         */
        this._inertroots = new map();

        /**
         * observer for mutations on `document.body`.
         * @type {!mutationobserver}
         */
        this._observer = new mutationobserver(this._watchforinert.bind(this));

        // add inert style.
        addinertstyle(document.head || document.body || document.documentelement);

        // wait for document to be loaded.
        if (document.readystate === 'loading') {
          document.addeventlistener('domcontentloaded', this._ondocumentloaded.bind(this));
        } else {
          this._ondocumentloaded();
        }
      }

      /**
       * set whether the given element should be an inert root or not.
       * @param {!htmlelement} root
       * @param {boolean} inert
       */


      _createclass(inertmanager, [{
        key: 'setinert',
        value: function setinert(root, inert) {
          if (inert) {
            if (this._inertroots.has(root)) {
              // element is already inert
              return;
            }

            var inertroot = new inertroot(root, this);
            root.setattribute('inert', '');
            this._inertroots.set(root, inertroot);
            // if not contained in the document, it must be in a shadowroot.
            // ensure inert styles are added there.
            if (!this._document.body.contains(root)) {
              var parent = root.parentnode;
              while (parent) {
                if (parent.nodetype === 11) {
                  addinertstyle(parent);
                }
                parent = parent.parentnode;
              }
            }
          } else {
            if (!this._inertroots.has(root)) {
              // element is already non-inert
              return;
            }

            var _inertroot = this._inertroots.get(root);
            _inertroot.destructor();
            this._inertroots['delete'](root);
            root.removeattribute('inert');
          }
        }

        /**
         * get the inertroot object corresponding to the given inert root element, if any.
         * @param {!node} element
         * @return {!inertroot|undefined}
         */

      }, {
        key: 'getinertroot',
        value: function getinertroot(element) {
          return this._inertroots.get(element);
        }

        /**
         * register the given inertroot as managing the given node.
         * in the case where the node has a previously existing inert root, this inert root will
         * be added to its set of inert roots.
         * @param {!node} node
         * @param {!inertroot} inertroot
         * @return {!inertnode} inertnode
         */

      }, {
        key: 'register',
        value: function register(node, inertroot) {
          var inertnode = this._managednodes.get(node);
          if (inertnode !== undefined) {
            // node was already in an inert subtree
            inertnode.addinertroot(inertroot);
          } else {
            inertnode = new inertnode(node, inertroot);
          }

          this._managednodes.set(node, inertnode);

          return inertnode;
        }

        /**
         * de-register the given inertroot as managing the given inert node.
         * removes the inert root from the inertnode's set of managing inert roots, and remove the inert
         * node from the inertmanager's set of managed nodes if it is destroyed.
         * if the node is not currently managed, this is essentially a no-op.
         * @param {!node} node
         * @param {!inertroot} inertroot
         * @return {?inertnode} the potentially destroyed inertnode associated with this node, if any.
         */

      }, {
        key: 'deregister',
        value: function deregister(node, inertroot) {
          var inertnode = this._managednodes.get(node);
          if (!inertnode) {
            return null;
          }

          inertnode.removeinertroot(inertroot);
          if (inertnode.destroyed) {
            this._managednodes['delete'](node);
          }

          return inertnode;
        }

        /**
         * callback used when document has finished loading.
         */

      }, {
        key: '_ondocumentloaded',
        value: function _ondocumentloaded() {
          // find all inert roots in document and make them actually inert.
          var inertelements = slice.call(this._document.queryselectorall('[inert]'));
          inertelements.foreach(function (inertelement) {
            this.setinert(inertelement, true);
          }, this);

          // comment this out to use programmatic api only.
          this._observer.observe(this._document.body || this._document.documentelement, { attributes: true, subtree: true, childlist: true });
        }

        /**
         * callback used when mutation observer detects attribute changes.
         * @param {!array<!mutationrecord>} records
         * @param {!mutationobserver} self
         */

      }, {
        key: '_watchforinert',
        value: function _watchforinert(records, self) {
          var _this = this;
          records.foreach(function (record) {
            switch (record.type) {
              case 'childlist':
                slice.call(record.addednodes).foreach(function (node) {
                  if (node.nodetype !== node.element_node) {
                    return;
                  }
                  var inertelements = slice.call(node.queryselectorall('[inert]'));
                  if (matches.call(node, '[inert]')) {
                    inertelements.unshift(node);
                  }
                  inertelements.foreach(function (inertelement) {
                    this.setinert(inertelement, true);
                  }, _this);
                }, _this);
                break;
              case 'attributes':
                if (record.attributename !== 'inert') {
                  return;
                }
                var target = /** @type {!htmlelement} */record.target;
                var inert = target.hasattribute('inert');
                _this.setinert(target, inert);
                break;
            }
          }, this);
        }
      }]);

      return inertmanager;
    }();

    /**
     * recursively walk the composed tree from |node|.
     * @param {!node} node
     * @param {(function (!htmlelement))=} callback callback to be called for each element traversed,
     *     before descending into child nodes.
     * @param {?shadowroot=} shadowrootancestor the nearest shadowroot ancestor, if any.
     */


    function composedtreewalk(node, callback, shadowrootancestor) {
      if (node.nodetype == node.element_node) {
        var element = /** @type {!htmlelement} */node;
        if (callback) {
          callback(element);
        }

        // descend into node:
        // if it has a shadowroot, ignore all child elements - these will be picked
        // up by the <content> or <shadow> elements. descend straight into the
        // shadowroot.
        var shadowroot = /** @type {!htmlelement} */element.shadowroot;
        if (shadowroot) {
          composedtreewalk(shadowroot, callback, shadowroot);
          return;
        }

        // if it is a <content> element, descend into distributed elements - these
        // are elements from outside the shadow root which are rendered inside the
        // shadow dom.
        if (element.localname == 'content') {
          var content = /** @type {!htmlcontentelement} */element;
          // verifies if shadowdom v0 is supported.
          var distributednodes = content.getdistributednodes ? content.getdistributednodes() : [];
          for (var i = 0; i < distributednodes.length; i++) {
            composedtreewalk(distributednodes[i], callback, shadowrootancestor);
          }
          return;
        }

        // if it is a <slot> element, descend into assigned nodes - these
        // are elements from outside the shadow root which are rendered inside the
        // shadow dom.
        if (element.localname == 'slot') {
          var slot = /** @type {!htmlslotelement} */element;
          // verify if shadowdom v1 is supported.
          var _distributednodes = slot.assignednodes ? slot.assignednodes({ flatten: true }) : [];
          for (var _i = 0; _i < _distributednodes.length; _i++) {
            composedtreewalk(_distributednodes[_i], callback, shadowrootancestor);
          }
          return;
        }
      }

      // if it is neither the parent of a shadowroot, a <content> element, a <slot>
      // element, nor a <shadow> element recurse normally.
      var child = node.firstchild;
      while (child != null) {
        composedtreewalk(child, callback, shadowrootancestor);
        child = child.nextsibling;
      }
    }

    /**
     * adds a style element to the node containing the inert specific styles
     * @param {!node} node
     */
    function addinertstyle(node) {
      if (node.queryselector('style#inert-style, link#inert-style')) {
        return;
      }
      var style = document.createelement('style');
      style.setattribute('id', 'inert-style');
      style.textcontent = '\n' + '[inert] {\n' + '  pointer-events: none;\n' + '  cursor: default;\n' + '}\n' + '\n' + '[inert], [inert] * {\n' + '  -webkit-user-select: none;\n' + '  -moz-user-select: none;\n' + '  -ms-user-select: none;\n' + '  user-select: none;\n' + '}\n';
      node.appendchild(style);
    }

    if (!htmlelement.prototype.hasownproperty('inert')) {
      /** @type {!inertmanager} */
      var inertmanager = new inertmanager(document);

      object.defineproperty(htmlelement.prototype, 'inert', {
        enumerable: true,
        /** @this {!htmlelement} */
        get: function get() {
          return this.hasattribute('inert');
        },
        /** @this {!htmlelement} */
        set: function set(inert) {
          inertmanager.setinert(this, inert);
        }
      });
    }
  })();

})));






