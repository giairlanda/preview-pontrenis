/******/ (() => { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 1933:
/***/ ((module, exports, __webpack_require__) => {

var __webpack_amd_define_result__;/*global define:false */
/**
 * copyright 2012-2017 craig campbell
 *
 * licensed under the apache license, version 2.0 (the "license");
 * you may not use this file except in compliance with the license.
 * you may obtain a copy of the license at
 *
 * http://www.apache.org/licenses/license-2.0
 *
 * unless required by applicable law or agreed to in writing, software
 * distributed under the license is distributed on an "as is" basis,
 * without warranties or conditions of any kind, either express or implied.
 * see the license for the specific language governing permissions and
 * limitations under the license.
 *
 * mousetrap is a simple keyboard shortcut library for javascript with
 * no external dependencies
 *
 * @version 1.6.5
 * @url craig.is/killing/mice
 */
(function(window, document, undefined) {

    // check if mousetrap is used inside browser, if not, return
    if (!window) {
        return;
    }

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {object}
     */
    var _map = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta'
    };

    /**
     * mapping for special characters so they can support
     *
     * this dictionary is only used incase you want to bind a
     * keyup or keydown event to one of these keys
     *
     * @type {object}
     */
    var _keycode_map = {
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111 : '/',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: '\''
    };

    /**
     * this is a mapping of keys that require shift on a us keypad
     * back to the non shift equivelents
     *
     * this is so you can use keyup events with these keys
     *
     * note that this will only work reliably on us keyboards
     *
     * @type {object}
     */
    var _shift_map = {
        '~': '`',
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '_': '-',
        '+': '=',
        ':': ';',
        '\"': '\'',
        '<': ',',
        '>': '.',
        '?': '/',
        '|': '\\'
    };

    /**
     * this is a list of special strings you can use to map
     * to modifier keys when you specify your keyboard shortcuts
     *
     * @type {object}
     */
    var _special_aliases = {
        'option': 'alt',
        'command': 'meta',
        'return': 'enter',
        'escape': 'esc',
        'plus': '+',
        'mod': /mac|ipod|iphone|ipad/.test(navigator.platform) ? 'meta' : 'ctrl'
    };

    /**
     * variable to store the flipped version of _map from above
     * needed to check if we should use keypress or not when no action
     * is specified
     *
     * @type {object|undefined}
     */
    var _reverse_map;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _map[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {

        // this needs to use a string cause otherwise since 0 is falsey
        // mousetrap will never fire for numpad 0 pressed as part of a keydown
        // event.
        //
        // @see https://github.com/ccampbell/mousetrap/pull/258
        _map[i + 96] = i.tostring();
    }

    /**
     * cross browser add event method
     *
     * @param {element|htmldocument} object
     * @param {string} type
     * @param {function} callback
     * @returns void
     */
    function _addevent(object, type, callback) {
        if (object.addeventlistener) {
            object.addeventlistener(type, callback, false);
            return;
        }

        object.attachevent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {event} e
     * @return {string}
     */
    function _characterfromevent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            var character = string.fromcharcode(e.which);

            // if the shift key is not pressed then it is safe to assume
            // that we want the character to be lowercase.  this means if
            // you accidentally have caps lock on then your key bindings
            // will continue to work
            //
            // the only side effect that might not be desired is if you
            // bind something like 'a' cause you want to trigger an
            // event when capital a is pressed caps lock will no longer
            // trigger the event.  shift+a will though.
            if (!e.shiftkey) {
                character = character.tolowercase();
            }

            return character;
        }

        // for non keypress events the special maps are needed
        if (_map[e.which]) {
            return _map[e.which];
        }

        if (_keycode_map[e.which]) {
            return _keycode_map[e.which];
        }

        // if it is not in the special map

        // with keydown and keyup events the character seems to always
        // come in as an uppercase character whether you are pressing shift
        // or not.  we should make sure it is always lowercase for comparisons
        return string.fromcharcode(e.which).tolowercase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {array} modifiers1
     * @param {array} modifiers2
     * @returns {boolean}
     */
    function _modifiersmatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {event} e
     * @returns {array}
     */
    function _eventmodifiers(e) {
        var modifiers = [];

        if (e.shiftkey) {
            modifiers.push('shift');
        }

        if (e.altkey) {
            modifiers.push('alt');
        }

        if (e.ctrlkey) {
            modifiers.push('ctrl');
        }

        if (e.metakey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * prevents default for this event
     *
     * @param {event} e
     * @returns void
     */
    function _preventdefault(e) {
        if (e.preventdefault) {
            e.preventdefault();
            return;
        }

        e.returnvalue = false;
    }

    /**
     * stops propogation for this event
     *
     * @param {event} e
     * @returns void
     */
    function _stoppropagation(e) {
        if (e.stoppropagation) {
            e.stoppropagation();
            return;
        }

        e.cancelbubble = true;
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _ismodifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {object}
     */
    function _getreversemap() {
        if (!_reverse_map) {
            _reverse_map = {};
            for (var key in _map) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_map.hasownproperty(key)) {
                    _reverse_map[_map[key]] = key;
                }
            }
        }
        return _reverse_map;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {array} modifiers
     * @param {string=} action passed in
     */
    function _pickbestaction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getreversemap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {array}
     */
    function _keysfromstring(combination) {
        if (combination === '+') {
            return ['+'];
        }

        combination = combination.replace(/\+{2}/g, '+plus');
        return combination.split('+');
    }

    /**
     * gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {object}
     */
    function _getkeyinfo(combination, action) {
        var keys;
        var key;
        var i;
        var modifiers = [];

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = _keysfromstring(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_special_aliases[key]) {
                key = _special_aliases[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for us keyboards however
            if (action && action != 'keypress' && _shift_map[key]) {
                key = _shift_map[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_ismodifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickbestaction(key, modifiers, action);

        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }

    function _belongsto(element, ancestor) {
        if (element === null || element === document) {
            return false;
        }

        if (element === ancestor) {
            return true;
        }

        return _belongsto(element.parentnode, ancestor);
    }

    function mousetrap(targetelement) {
        var self = this;

        targetelement = targetelement || document;

        if (!(self instanceof mousetrap)) {
            return new mousetrap(targetelement);
        }

        /**
         * element to attach key events to
         *
         * @type {element}
         */
        self.target = targetelement;

        /**
         * a list of all the callbacks setup via mousetrap.bind()
         *
         * @type {object}
         */
        self._callbacks = {};

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {object}
         */
        self._directmap = {};

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {object}
         */
        var _sequencelevels = {};

        /**
         * variable to store the settimeout call
         *
         * @type {null|number}
         */
        var _resettimer;

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        var _ignorenextkeyup = false;

        /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
        var _ignorenextkeypress = false;

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        var _nextexpectedaction = false;

        /**
         * resets all sequence counters except for the ones passed in
         *
         * @param {object} donotreset
         * @returns void
         */
        function _resetsequences(donotreset) {
            donotreset = donotreset || {};

            var activesequences = false,
                key;

            for (key in _sequencelevels) {
                if (donotreset[key]) {
                    activesequences = true;
                    continue;
                }
                _sequencelevels[key] = 0;
            }

            if (!activesequences) {
                _nextexpectedaction = false;
            }
        }

        /**
         * finds all callbacks that match based on the keycode, modifiers,
         * and action
         *
         * @param {string} character
         * @param {array} modifiers
         * @param {event|object} e
         * @param {string=} sequencename - name of the sequence we are looking for
         * @param {string=} combination
         * @param {number=} level
         * @returns {array}
         */
        function _getmatches(character, modifiers, e, sequencename, combination, level) {
            var i;
            var callback;
            var matches = [];
            var action = e.type;

            // if there are no events related to this keycode
            if (!self._callbacks[character]) {
                return [];
            }

            // if a modifier key is coming up on its own we should allow it
            if (action == 'keyup' && _ismodifier(character)) {
                modifiers = [character];
            }

            // loop through all callbacks for the key that was pressed
            // and see if any of them match
            for (i = 0; i < self._callbacks[character].length; ++i) {
                callback = self._callbacks[character][i];

                // if a sequence name is not specified, but this is a sequence at
                // the wrong level then move onto the next match
                if (!sequencename && callback.seq && _sequencelevels[callback.seq] != callback.level) {
                    continue;
                }

                // if the action we are looking for doesn't match the action we got
                // then we should keep going
                if (action != callback.action) {
                    continue;
                }

                // if this is a keypress event and the meta key and control key
                // are not pressed that means that we need to only look at the
                // character, otherwise check the modifiers as well
                //
                // chrome will not fire a keypress if meta or control is down
                // safari will fire a keypress if meta or meta+shift is down
                // firefox will fire a keypress if meta or control is down
                if ((action == 'keypress' && !e.metakey && !e.ctrlkey) || _modifiersmatch(modifiers, callback.modifiers)) {

                    // when you bind a combination or sequence a second time it
                    // should overwrite the first one.  if a sequencename or
                    // combination is specified in this call it does just that
                    //
                    // @todo make deleting its own method?
                    var deletecombo = !sequencename && callback.combo == combination;
                    var deletesequence = sequencename && callback.seq == sequencename && callback.level == level;
                    if (deletecombo || deletesequence) {
                        self._callbacks[character].splice(i, 1);
                    }

                    matches.push(callback);
                }
            }

            return matches;
        }

        /**
         * actually calls the callback function
         *
         * if your callback function returns false this will use the jquery
         * convention - prevent default and stop propogation on the event
         *
         * @param {function} callback
         * @param {event} e
         * @returns void
         */
        function _firecallback(callback, e, combo, sequence) {

            // if this event should not happen stop here
            if (self.stopcallback(e, e.target || e.srcelement, combo, sequence)) {
                return;
            }

            if (callback(e, combo) === false) {
                _preventdefault(e);
                _stoppropagation(e);
            }
        }

        /**
         * handles a character key event
         *
         * @param {string} character
         * @param {array} modifiers
         * @param {event} e
         * @returns void
         */
        self._handlekey = function(character, modifiers, e) {
            var callbacks = _getmatches(character, modifiers, e);
            var i;
            var donotreset = {};
            var maxlevel = 0;
            var processedsequencecallback = false;

            // calculate the maxlevel for sequences so we can only execute the longest callback sequence
            for (i = 0; i < callbacks.length; ++i) {
                if (callbacks[i].seq) {
                    maxlevel = math.max(maxlevel, callbacks[i].level);
                }
            }

            // loop through matching callbacks for this key event
            for (i = 0; i < callbacks.length; ++i) {

                // fire for all sequence callbacks
                // this is because if for example you have multiple sequences
                // bound such as "g i" and "g t" they both need to fire the
                // callback for matching g cause otherwise you can only ever
                // match the first one
                if (callbacks[i].seq) {

                    // only fire callbacks for the maxlevel to prevent
                    // subsequences from also firing
                    //
                    // for example 'a option b' should not cause 'option b' to fire
                    // even though 'option b' is part of the other sequence
                    //
                    // any sequences that do not match here will be discarded
                    // below by the _resetsequences call
                    if (callbacks[i].level != maxlevel) {
                        continue;
                    }

                    processedsequencecallback = true;

                    // keep a list of which sequences were matches for later
                    donotreset[callbacks[i].seq] = 1;
                    _firecallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                    continue;
                }

                // if there were no sequence matches but we are still here
                // that means this is a regular match so we should fire that
                if (!processedsequencecallback) {
                    _firecallback(callbacks[i].callback, e, callbacks[i].combo);
                }
            }

            // if the key you pressed matches the type of sequence without
            // being a modifier (ie "keyup" or "keypress") then we should
            // reset all sequences that were not matched by this event
            //
            // this is so, for example, if you have the sequence "h a t" and you
            // type "h e a r t" it does not match.  in this case the "e" will
            // cause the sequence to reset
            //
            // modifier keys are ignored because you can have a sequence
            // that contains modifiers such as "enter ctrl+space" and in most
            // cases the modifier key will be pressed before the next key
            //
            // also if you have a sequence such as "ctrl+b a" then pressing the
            // "b" key will trigger a "keypress" and a "keydown"
            //
            // the "keydown" is expected when there is a modifier, but the
            // "keypress" ends up matching the _nextexpectedaction since it occurs
            // after and that causes the sequence to reset
            //
            // we ignore keypresses in a sequence that directly follow a keydown
            // for the same character
            var ignorethiskeypress = e.type == 'keypress' && _ignorenextkeypress;
            if (e.type == _nextexpectedaction && !_ismodifier(character) && !ignorethiskeypress) {
                _resetsequences(donotreset);
            }

            _ignorenextkeypress = processedsequencecallback && e.type == 'keydown';
        };

        /**
         * handles a keydown event
         *
         * @param {event} e
         * @returns void
         */
        function _handlekeyevent(e) {

            // normalize e.which for key events
            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
            if (typeof e.which !== 'number') {
                e.which = e.keycode;
            }

            var character = _characterfromevent(e);

            // no character found then stop
            if (!character) {
                return;
            }

            // need to use === for the character check because the character can be 0
            if (e.type == 'keyup' && _ignorenextkeyup === character) {
                _ignorenextkeyup = false;
                return;
            }

            self.handlekey(character, _eventmodifiers(e), e);
        }

        /**
         * called to set a 1 second timeout on the specified sequence
         *
         * this is so after each key press in the sequence you have 1 second
         * to press the next key before you have to start over
         *
         * @returns void
         */
        function _resetsequencetimer() {
            cleartimeout(_resettimer);
            _resettimer = settimeout(_resetsequences, 1000);
        }

        /**
         * binds a key sequence to an event
         *
         * @param {string} combo - combo specified in bind call
         * @param {array} keys
         * @param {function} callback
         * @param {string=} action
         * @returns void
         */
        function _bindsequence(combo, keys, callback, action) {

            // start off by adding a sequence level record for this combination
            // and setting the level to 0
            _sequencelevels[combo] = 0;

            /**
             * callback to increase the sequence level for this sequence and reset
             * all other sequences that were active
             *
             * @param {string} nextaction
             * @returns {function}
             */
            function _increasesequence(nextaction) {
                return function() {
                    _nextexpectedaction = nextaction;
                    ++_sequencelevels[combo];
                    _resetsequencetimer();
                };
            }

            /**
             * wraps the specified callback inside of another function in order
             * to reset all sequence counters as soon as this sequence is done
             *
             * @param {event} e
             * @returns void
             */
            function _callbackandreset(e) {
                _firecallback(callback, e, combo);

                // we should ignore the next key up if the action is key down
                // or keypress.  this is so if you finish a sequence and
                // release the key the final key will not trigger a keyup
                if (action !== 'keyup') {
                    _ignorenextkeyup = _characterfromevent(e);
                }

                // weird race condition if a sequence ends with the key
                // another sequence begins with
                settimeout(_resetsequences, 10);
            }

            // loop through keys one at a time and bind the appropriate callback
            // function.  for any key leading up to the final one it should
            // increase the sequence. after the final, it should reset all sequences
            //
            // if an action is specified in the original bind call then that will
            // be used throughout.  otherwise we will pass the action that the
            // next key in the sequence should match.  this allows a sequence
            // to mix and match keypress and keydown events depending on which
            // ones are better suited to the key provided
            for (var i = 0; i < keys.length; ++i) {
                var isfinal = i + 1 === keys.length;
                var wrappedcallback = isfinal ? _callbackandreset : _increasesequence(action || _getkeyinfo(keys[i + 1]).action);
                _bindsingle(keys[i], wrappedcallback, action, combo, i);
            }
        }

        /**
         * binds a single keyboard combination
         *
         * @param {string} combination
         * @param {function} callback
         * @param {string=} action
         * @param {string=} sequencename - name of sequence if part of sequence
         * @param {number=} level - what part of the sequence the command is
         * @returns void
         */
        function _bindsingle(combination, callback, action, sequencename, level) {

            // store a direct mapped reference for use with mousetrap.trigger
            self._directmap[combination + ':' + action] = callback;

            // make sure multiple spaces in a row become a single space
            combination = combination.replace(/\s+/g, ' ');

            var sequence = combination.split(' ');
            var info;

            // if this pattern is a sequence of keys then run through this method
            // to reprocess each pattern one key at a time
            if (sequence.length > 1) {
                _bindsequence(combination, sequence, callback, action);
                return;
            }

            info = _getkeyinfo(combination, action);

            // make sure to initialize array if this is the first time
            // a callback is added for this key
            self._callbacks[info.key] = self._callbacks[info.key] || [];

            // remove an existing match if there is one
            _getmatches(info.key, info.modifiers, {type: info.action}, sequencename, combination, level);

            // add this call back to the array
            // if it is a sequence put it at the beginning
            // if not put it at the end
            //
            // this is important because the way these are processed expects
            // the sequence ones to come first
            self._callbacks[info.key][sequencename ? 'unshift' : 'push']({
                callback: callback,
                modifiers: info.modifiers,
                action: info.action,
                seq: sequencename,
                level: level,
                combo: combination
            });
        }

        /**
         * binds multiple combinations to the same callback
         *
         * @param {array} combinations
         * @param {function} callback
         * @param {string|undefined} action
         * @returns void
         */
        self._bindmultiple = function(combinations, callback, action) {
            for (var i = 0; i < combinations.length; ++i) {
                _bindsingle(combinations[i], callback, action);
            }
        };

        // start!
        _addevent(targetelement, 'keypress', _handlekeyevent);
        _addevent(targetelement, 'keydown', _handlekeyevent);
        _addevent(targetelement, 'keyup', _handlekeyevent);
    }

    /**
     * binds an event to mousetrap
     *
     * can be a single key, a combination of keys separated with +,
     * an array of keys, or a sequence of keys separated by spaces
     *
     * be sure to list the modifier keys first to make sure that the
     * correct key ends up getting bound (the last key in the pattern)
     *
     * @param {string|array} keys
     * @param {function} callback
     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
     * @returns void
     */
    mousetrap.prototype.bind = function(keys, callback, action) {
        var self = this;
        keys = keys instanceof array ? keys : [keys];
        self._bindmultiple.call(self, keys, callback, action);
        return self;
    };

    /**
     * unbinds an event to mousetrap
     *
     * the unbinding sets the callback function of the specified key combo
     * to an empty function and deletes the corresponding key in the
     * _directmap dict.
     *
     * todo: actually remove this from the _callbacks dictionary instead
     * of binding an empty function
     *
     * the keycombo+action has to be exactly the same as
     * it was defined in the bind method
     *
     * @param {string|array} keys
     * @param {string} action
     * @returns void
     */
    mousetrap.prototype.unbind = function(keys, action) {
        var self = this;
        return self.bind.call(self, keys, function() {}, action);
    };

    /**
     * triggers an event that has already been bound
     *
     * @param {string} keys
     * @param {string=} action
     * @returns void
     */
    mousetrap.prototype.trigger = function(keys, action) {
        var self = this;
        if (self._directmap[keys + ':' + action]) {
            self._directmap[keys + ':' + action]({}, keys);
        }
        return self;
    };

    /**
     * resets the library back to its initial state.  this is useful
     * if you want to clear out the current keyboard shortcuts and bind
     * new ones - for example if you switch to another page
     *
     * @returns void
     */
    mousetrap.prototype.reset = function() {
        var self = this;
        self._callbacks = {};
        self._directmap = {};
        return self;
    };

    /**
     * should we stop this event before firing off callbacks
     *
     * @param {event} e
     * @param {element} element
     * @return {boolean}
     */
    mousetrap.prototype.stopcallback = function(e, element) {
        var self = this;

        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.classname + ' ').indexof(' mousetrap ') > -1) {
            return false;
        }

        if (_belongsto(element, self.target)) {
            return false;
        }

        // events originating from a shadow dom are re-targetted and `e.target` is the shadow host,
        // not the initial event target in the shadow tree. note that not all events cross the
        // shadow boundary.
        // for shadow trees with `mode: 'open'`, the initial event target is the first element in
        // the eventâ€™s composed path. for shadow trees with `mode: 'closed'`, the initial event
        // target cannot be obtained.
        if ('composedpath' in e && typeof e.composedpath === 'function') {
            // for open shadow trees, update `element` so that the following check works.
            var initialeventtarget = e.composedpath()[0];
            if (initialeventtarget !== e.target) {
                element = initialeventtarget;
            }
        }

        // stop for input, select, and textarea
        return element.tagname == 'input' || element.tagname == 'select' || element.tagname == 'textarea' || element.iscontenteditable;
    };

    /**
     * exposes _handlekey publicly so it can be overwritten by extensions
     */
    mousetrap.prototype.handlekey = function() {
        var self = this;
        return self._handlekey.apply(self, arguments);
    };

    /**
     * allow custom key mappings
     */
    mousetrap.addkeycodes = function(object) {
        for (var key in object) {
            if (object.hasownproperty(key)) {
                _map[key] = object[key];
            }
        }
        _reverse_map = null;
    };

    /**
     * init the global mousetrap functions
     *
     * this method is needed to allow the global mousetrap functions to work
     * now that mousetrap is a constructor function.
     */
    mousetrap.init = function() {
        var documentmousetrap = mousetrap(document);
        for (var method in documentmousetrap) {
            if (method.charat(0) !== '_') {
                mousetrap[method] = (function(method) {
                    return function() {
                        return documentmousetrap[method].apply(documentmousetrap, arguments);
                    };
                } (method));
            }
        }
    };

    mousetrap.init();

    // expose mousetrap to the global object
    window.mousetrap = mousetrap;

    // expose as a common js module
    if ( true && module.exports) {
        module.exports = mousetrap;
    }

    // expose mousetrap as an amd module
    if (true) {
        !(__webpack_amd_define_result__ = (function() {
            return mousetrap;
        }).call(exports, __webpack_require__, exports, module),
		__webpack_amd_define_result__ !== undefined && (module.exports = __webpack_amd_define_result__));
    }
}) (typeof window !== 'undefined' ? window : null, typeof  window !== 'undefined' ? document : null);


/***/ }),

/***/ 3758:
/***/ (function(module) {

/*!
 * clipboard.js v2.0.11
 * https://clipboardjs.com/
 *
 * licensed mit â© zeno rocha
 */
(function webpackuniversalmoduledefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, function() {
return /******/ (function() { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 686:
/***/ (function(__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_623__) {

"use strict";

// exports
__nested_webpack_require_623__.d(__nested_webpack_exports__, {
  "default": function() { return /* binding */ clipboard; }
});

// external module: ./node_modules/tiny-emitter/index.js
var tiny_emitter = __nested_webpack_require_623__(279);
var tiny_emitter_default = /*#__pure__*/__nested_webpack_require_623__.n(tiny_emitter);
// external module: ./node_modules/good-listener/src/listen.js
var listen = __nested_webpack_require_623__(370);
var listen_default = /*#__pure__*/__nested_webpack_require_623__.n(listen);
// external module: ./node_modules/select/src/select.js
var src_select = __nested_webpack_require_623__(817);
var select_default = /*#__pure__*/__nested_webpack_require_623__.n(src_select);
;// concatenated module: ./src/common/command.js
/**
 * executes a given operation type.
 * @param {string} type
 * @return {boolean}
 */
function command(type) {
  try {
    return document.execcommand(type);
  } catch (err) {
    return false;
  }
}
;// concatenated module: ./src/actions/cut.js


/**
 * cut action wrapper.
 * @param {string|htmlelement} target
 * @return {string}
 */

var clipboardactioncut = function clipboardactioncut(target) {
  var selectedtext = select_default()(target);
  command('cut');
  return selectedtext;
};

/* harmony default export */ var actions_cut = (clipboardactioncut);
;// concatenated module: ./src/common/create-fake-element.js
/**
 * creates a fake textarea element with a value.
 * @param {string} value
 * @return {htmlelement}
 */
function createfakeelement(value) {
  var isrtl = document.documentelement.getattribute('dir') === 'rtl';
  var fakeelement = document.createelement('textarea'); // prevent zooming on ios

  fakeelement.style.fontsize = '12pt'; // reset box model

  fakeelement.style.border = '0';
  fakeelement.style.padding = '0';
  fakeelement.style.margin = '0'; // move element out of screen horizontally

  fakeelement.style.position = 'absolute';
  fakeelement.style[isrtl ? 'right' : 'left'] = '-9999px'; // move element to the same position vertically

  var yposition = window.pageyoffset || document.documentelement.scrolltop;
  fakeelement.style.top = "".concat(yposition, "px");
  fakeelement.setattribute('readonly', '');
  fakeelement.value = value;
  return fakeelement;
}
;// concatenated module: ./src/actions/copy.js



/**
 * create fake copy action wrapper using a fake element.
 * @param {string} target
 * @param {object} options
 * @return {string}
 */

var fakecopyaction = function fakecopyaction(value, options) {
  var fakeelement = createfakeelement(value);
  options.container.appendchild(fakeelement);
  var selectedtext = select_default()(fakeelement);
  command('copy');
  fakeelement.remove();
  return selectedtext;
};
/**
 * copy action wrapper.
 * @param {string|htmlelement} target
 * @param {object} options
 * @return {string}
 */


var clipboardactioncopy = function clipboardactioncopy(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    container: document.body
  };
  var selectedtext = '';

  if (typeof target === 'string') {
    selectedtext = fakecopyaction(target, options);
  } else if (target instanceof htmlinputelement && !['text', 'search', 'url', 'tel', 'password'].includes(target === null || target === void 0 ? void 0 : target.type)) {
    // if input type doesn't support `setselectionrange`. simulate it. https://developer.mozilla.org/en-us/docs/web/api/htmlinputelement/setselectionrange
    selectedtext = fakecopyaction(target.value, options);
  } else {
    selectedtext = select_default()(target);
    command('copy');
  }

  return selectedtext;
};

/* harmony default export */ var actions_copy = (clipboardactioncopy);
;// concatenated module: ./src/actions/default.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof symbol === "function" && typeof symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/**
 * inner function which performs selection from either `text` or `target`
 * properties and then executes copy or cut operations.
 * @param {object} options
 */

var clipboardactiondefault = function clipboardactiondefault() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // defines base properties passed from constructor.
  var _options$action = options.action,
      action = _options$action === void 0 ? 'copy' : _options$action,
      container = options.container,
      target = options.target,
      text = options.text; // sets the `action` to be performed which can be either 'copy' or 'cut'.

  if (action !== 'copy' && action !== 'cut') {
    throw new error('invalid "action" value, use either "copy" or "cut"');
  } // sets the `target` property using an element that will be have its content copied.


  if (target !== undefined) {
    if (target && _typeof(target) === 'object' && target.nodetype === 1) {
      if (action === 'copy' && target.hasattribute('disabled')) {
        throw new error('invalid "target" attribute. please use "readonly" instead of "disabled" attribute');
      }

      if (action === 'cut' && (target.hasattribute('readonly') || target.hasattribute('disabled'))) {
        throw new error('invalid "target" attribute. you can\'t cut text from elements with "readonly" or "disabled" attributes');
      }
    } else {
      throw new error('invalid "target" value, use a valid element');
    }
  } // define selection strategy based on `text` property.


  if (text) {
    return actions_copy(text, {
      container: container
    });
  } // defines which selection strategy based on `target` property.


  if (target) {
    return action === 'cut' ? actions_cut(target) : actions_copy(target, {
      container: container
    });
  }
};

/* harmony default export */ var actions_default = (clipboardactiondefault);
;// concatenated module: ./src/clipboard.js
function clipboard_typeof(obj) { "@babel/helpers - typeof"; if (typeof symbol === "function" && typeof symbol.iterator === "symbol") { clipboard_typeof = function _typeof(obj) { return typeof obj; }; } else { clipboard_typeof = function _typeof(obj) { return obj && typeof symbol === "function" && obj.constructor === symbol && obj !== symbol.prototype ? "symbol" : typeof obj; }; } return clipboard_typeof(obj); }

function _classcallcheck(instance, constructor) { if (!(instance instanceof constructor)) { throw new typeerror("cannot call a class as a function"); } }

function _defineproperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; object.defineproperty(target, descriptor.key, descriptor); } }

function _createclass(constructor, protoprops, staticprops) { if (protoprops) _defineproperties(constructor.prototype, protoprops); if (staticprops) _defineproperties(constructor, staticprops); return constructor; }

function _inherits(subclass, superclass) { if (typeof superclass !== "function" && superclass !== null) { throw new typeerror("super expression must either be null or a function"); } subclass.prototype = object.create(superclass && superclass.prototype, { constructor: { value: subclass, writable: true, configurable: true } }); if (superclass) _setprototypeof(subclass, superclass); }

function _setprototypeof(o, p) { _setprototypeof = object.setprototypeof || function _setprototypeof(o, p) { o.__proto__ = p; return o; }; return _setprototypeof(o, p); }

function _createsuper(derived) { var hasnativereflectconstruct = _isnativereflectconstruct(); return function _createsuperinternal() { var super = _getprototypeof(derived), result; if (hasnativereflectconstruct) { var newtarget = _getprototypeof(this).constructor; result = reflect.construct(super, arguments, newtarget); } else { result = super.apply(this, arguments); } return _possibleconstructorreturn(this, result); }; }

function _possibleconstructorreturn(self, call) { if (call && (clipboard_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertthisinitialized(self); }

function _assertthisinitialized(self) { if (self === void 0) { throw new referenceerror("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isnativereflectconstruct() { if (typeof reflect === "undefined" || !reflect.construct) return false; if (reflect.construct.sham) return false; if (typeof proxy === "function") return true; try { date.prototype.tostring.call(reflect.construct(date, [], function () {})); return true; } catch (e) { return false; } }

function _getprototypeof(o) { _getprototypeof = object.setprototypeof ? object.getprototypeof : function _getprototypeof(o) { return o.__proto__ || object.getprototypeof(o); }; return _getprototypeof(o); }






/**
 * helper function to retrieve attribute value.
 * @param {string} suffix
 * @param {element} element
 */

function getattributevalue(suffix, element) {
  var attribute = "data-clipboard-".concat(suffix);

  if (!element.hasattribute(attribute)) {
    return;
  }

  return element.getattribute(attribute);
}
/**
 * base class which takes one or more elements, adds event listeners to them,
 * and instantiates a new `clipboardaction` on each click.
 */


var clipboard = /*#__pure__*/function (_emitter) {
  _inherits(clipboard, _emitter);

  var _super = _createsuper(clipboard);

  /**
   * @param {string|htmlelement|htmlcollection|nodelist} trigger
   * @param {object} options
   */
  function clipboard(trigger, options) {
    var _this;

    _classcallcheck(this, clipboard);

    _this = _super.call(this);

    _this.resolveoptions(options);

    _this.listenclick(trigger);

    return _this;
  }
  /**
   * defines if attributes would be resolved using internal setter functions
   * or custom functions that were passed in the constructor.
   * @param {object} options
   */


  _createclass(clipboard, [{
    key: "resolveoptions",
    value: function resolveoptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.action = typeof options.action === 'function' ? options.action : this.defaultaction;
      this.target = typeof options.target === 'function' ? options.target : this.defaulttarget;
      this.text = typeof options.text === 'function' ? options.text : this.defaulttext;
      this.container = clipboard_typeof(options.container) === 'object' ? options.container : document.body;
    }
    /**
     * adds a click event listener to the passed trigger.
     * @param {string|htmlelement|htmlcollection|nodelist} trigger
     */

  }, {
    key: "listenclick",
    value: function listenclick(trigger) {
      var _this2 = this;

      this.listener = listen_default()(trigger, 'click', function (e) {
        return _this2.onclick(e);
      });
    }
    /**
     * defines a new `clipboardaction` on each click event.
     * @param {event} e
     */

  }, {
    key: "onclick",
    value: function onclick(e) {
      var trigger = e.delegatetarget || e.currenttarget;
      var action = this.action(trigger) || 'copy';
      var text = actions_default({
        action: action,
        container: this.container,
        target: this.target(trigger),
        text: this.text(trigger)
      }); // fires an event based on the copy operation result.

      this.emit(text ? 'success' : 'error', {
        action: action,
        text: text,
        trigger: trigger,
        clearselection: function clearselection() {
          if (trigger) {
            trigger.focus();
          }

          window.getselection().removeallranges();
        }
      });
    }
    /**
     * default `action` lookup function.
     * @param {element} trigger
     */

  }, {
    key: "defaultaction",
    value: function defaultaction(trigger) {
      return getattributevalue('action', trigger);
    }
    /**
     * default `target` lookup function.
     * @param {element} trigger
     */

  }, {
    key: "defaulttarget",
    value: function defaulttarget(trigger) {
      var selector = getattributevalue('target', trigger);

      if (selector) {
        return document.queryselector(selector);
      }
    }
    /**
     * allow fire programmatically a copy action
     * @param {string|htmlelement} target
     * @param {object} options
     * @returns text copied.
     */

  }, {
    key: "defaulttext",

    /**
     * default `text` lookup function.
     * @param {element} trigger
     */
    value: function defaulttext(trigger) {
      return getattributevalue('text', trigger);
    }
    /**
     * destroy lifecycle.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.listener.destroy();
    }
  }], [{
    key: "copy",
    value: function copy(target) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        container: document.body
      };
      return actions_copy(target, options);
    }
    /**
     * allow fire programmatically a cut action
     * @param {string|htmlelement} target
     * @returns text cutted.
     */

  }, {
    key: "cut",
    value: function cut(target) {
      return actions_cut(target);
    }
    /**
     * returns the support of the given action, or all actions if no action is
     * given.
     * @param {string} [action]
     */

  }, {
    key: "issupported",
    value: function issupported() {
      var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];
      var actions = typeof action === 'string' ? [action] : action;
      var support = !!document.querycommandsupported;
      actions.foreach(function (action) {
        support = support && !!document.querycommandsupported(action);
      });
      return support;
    }
  }]);

  return clipboard;
}((tiny_emitter_default()));

/* harmony default export */ var clipboard = (clipboard);

/***/ }),

/***/ 828:
/***/ (function(module) {

var document_node_type = 9;

/**
 * a polyfill for element.matches()
 */
if (typeof element !== 'undefined' && !element.prototype.matches) {
    var proto = element.prototype;

    proto.matches = proto.matchesselector ||
                    proto.mozmatchesselector ||
                    proto.msmatchesselector ||
                    proto.omatchesselector ||
                    proto.webkitmatchesselector;
}

/**
 * finds the closest parent that matches a selector.
 *
 * @param {element} element
 * @param {string} selector
 * @return {function}
 */
function closest (element, selector) {
    while (element && element.nodetype !== document_node_type) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentnode;
    }
}

module.exports = closest;


/***/ }),

/***/ 438:
/***/ (function(module, __unused_webpack_exports, __nested_webpack_require_15749__) {

var closest = __nested_webpack_require_15749__(828);

/**
 * delegates event to a selector.
 *
 * @param {element} element
 * @param {string} selector
 * @param {string} type
 * @param {function} callback
 * @param {boolean} usecapture
 * @return {object}
 */
function _delegate(element, selector, type, callback, usecapture) {
    var listenerfn = listener.apply(this, arguments);

    element.addeventlistener(type, listenerfn, usecapture);

    return {
        destroy: function() {
            element.removeeventlistener(type, listenerfn, usecapture);
        }
    }
}

/**
 * delegates event to a selector.
 *
 * @param {element|string|array} [elements]
 * @param {string} selector
 * @param {string} type
 * @param {function} callback
 * @param {boolean} usecapture
 * @return {object}
 */
function delegate(elements, selector, type, callback, usecapture) {
    // handle the regular element usage
    if (typeof elements.addeventlistener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // handle element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // use `document` as the first parameter, then apply arguments
        // this is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // handle selector-based usage
    if (typeof elements === 'string') {
        elements = document.queryselectorall(elements);
    }

    // handle array-like based usage
    return array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, usecapture);
    });
}

/**
 * finds closest match and invokes callback.
 *
 * @param {element} element
 * @param {string} selector
 * @param {string} type
 * @param {function} callback
 * @return {function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegatetarget = closest(e.target, selector);

        if (e.delegatetarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),

/***/ 879:
/***/ (function(__unused_webpack_module, exports) {

/**
 * check if argument is a html element.
 *
 * @param {object} value
 * @return {boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof htmlelement
        && value.nodetype === 1;
};

/**
 * check if argument is a list of html elements.
 *
 * @param {object} value
 * @return {boolean}
 */
exports.nodelist = function(value) {
    var type = object.prototype.tostring.call(value);

    return value !== undefined
        && (type === '[object nodelist]' || type === '[object htmlcollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * check if argument is a string.
 *
 * @param {object} value
 * @return {boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof string;
};

/**
 * check if argument is a function.
 *
 * @param {object} value
 * @return {boolean}
 */
exports.fn = function(value) {
    var type = object.prototype.tostring.call(value);

    return type === '[object function]';
};


/***/ }),

/***/ 370:
/***/ (function(module, __unused_webpack_exports, __nested_webpack_require_19113__) {

var is = __nested_webpack_require_19113__(879);
var delegate = __nested_webpack_require_19113__(438);

/**
 * validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {string|htmlelement|htmlcollection|nodelist} target
 * @param {string} type
 * @param {function} callback
 * @return {object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new error('missing required arguments');
    }

    if (!is.string(type)) {
        throw new typeerror('second argument must be a string');
    }

    if (!is.fn(callback)) {
        throw new typeerror('third argument must be a function');
    }

    if (is.node(target)) {
        return listennode(target, type, callback);
    }
    else if (is.nodelist(target)) {
        return listennodelist(target, type, callback);
    }
    else if (is.string(target)) {
        return listenselector(target, type, callback);
    }
    else {
        throw new typeerror('first argument must be a string, htmlelement, htmlcollection, or nodelist');
    }
}

/**
 * adds an event listener to a html element
 * and returns a remove listener function.
 *
 * @param {htmlelement} node
 * @param {string} type
 * @param {function} callback
 * @return {object}
 */
function listennode(node, type, callback) {
    node.addeventlistener(type, callback);

    return {
        destroy: function() {
            node.removeeventlistener(type, callback);
        }
    }
}

/**
 * add an event listener to a list of html elements
 * and returns a remove listener function.
 *
 * @param {nodelist|htmlcollection} nodelist
 * @param {string} type
 * @param {function} callback
 * @return {object}
 */
function listennodelist(nodelist, type, callback) {
    array.prototype.foreach.call(nodelist, function(node) {
        node.addeventlistener(type, callback);
    });

    return {
        destroy: function() {
            array.prototype.foreach.call(nodelist, function(node) {
                node.removeeventlistener(type, callback);
            });
        }
    }
}

/**
 * add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {string} selector
 * @param {string} type
 * @param {function} callback
 * @return {object}
 */
function listenselector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;


/***/ }),

/***/ 817:
/***/ (function(module) {

function select(element) {
    var selectedtext;

    if (element.nodename === 'select') {
        element.focus();

        selectedtext = element.value;
    }
    else if (element.nodename === 'input' || element.nodename === 'textarea') {
        var isreadonly = element.hasattribute('readonly');

        if (!isreadonly) {
            element.setattribute('readonly', '');
        }

        element.select();
        element.setselectionrange(0, element.value.length);

        if (!isreadonly) {
            element.removeattribute('readonly');
        }

        selectedtext = element.value;
    }
    else {
        if (element.hasattribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getselection();
        var range = document.createrange();

        range.selectnodecontents(element);
        selection.removeallranges();
        selection.addrange(range);

        selectedtext = selection.tostring();
    }

    return selectedtext;
}

module.exports = select;


/***/ }),

/***/ 279:
/***/ (function(module) {

function e () {
  // keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

e.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtarr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtarr.length;

    for (i; i < len; i++) {
      evtarr[i].fn.apply(evtarr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveevents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveevents.push(evts[i]);
      }
    }

    // remove event from queue to prevent memory leak
    // suggested by https://github.com/lazd
    // ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveevents.length)
      ? e[name] = liveevents
      : delete e[name];

    return this;
  }
};

module.exports = e;
module.exports.tinyemitter = e;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// the module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// the require function
/******/ 	function __nested_webpack_require_24495__(moduleid) {
/******/ 		// check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleid]) {
/******/ 			return __webpack_module_cache__[moduleid].exports;
/******/ 		}
/******/ 		// create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleid] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// execute the module function
/******/ 		__webpack_modules__[moduleid](module, module.exports, __nested_webpack_require_24495__);
/******/ 	
/******/ 		// return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getdefaultexport function for compatibility with non-harmony modules
/******/ 		__nested_webpack_require_24495__.n = function(module) {
/******/ 			var getter = module && module.__esmodule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__nested_webpack_require_24495__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_24495__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_24495__.o(definition, key) && !__nested_webpack_require_24495__.o(exports, key)) {
/******/ 					object.defineproperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasownproperty shorthand */
/******/ 	!function() {
/******/ 		__nested_webpack_require_24495__.o = function(obj, prop) { return object.prototype.hasownproperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// load entry module and return exports
/******/ 	return __nested_webpack_require_24495__(686);
/******/ })()
.default;
});

/***/ }),

/***/ 5760:
/***/ (() => {

/**
 * adds a bindglobal method to mousetrap that allows you to
 * bind specific keyboard shortcuts that will still work
 * inside a text input field
 *
 * usage:
 * mousetrap.bindglobal('ctrl+s', _savechanges);
 */
/* global mousetrap:true */
(function(mousetrap) {
    if (! mousetrap) {
        return;
    }
    var _globalcallbacks = {};
    var _originalstopcallback = mousetrap.prototype.stopcallback;

    mousetrap.prototype.stopcallback = function(e, element, combo, sequence) {
        var self = this;

        if (self.paused) {
            return true;
        }

        if (_globalcallbacks[combo] || _globalcallbacks[sequence]) {
            return false;
        }

        return _originalstopcallback.call(self, e, element, combo);
    };

    mousetrap.prototype.bindglobal = function(keys, callback, action) {
        var self = this;
        self.bind(keys, callback, action);

        if (keys instanceof array) {
            for (var i = 0; i < keys.length; i++) {
                _globalcallbacks[keys[i]] = true;
            }
            return;
        }

        _globalcallbacks[keys] = true;
    };

    mousetrap.init();
}) (typeof mousetrap !== "undefined" ? mousetrap : undefined);


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
/******/ 		__webpack_modules__[moduleid].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
// this entry needs to be wrapped in an iife because it needs to be in strict mode.
(() => {
"use strict";
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  __experimentalusedialog: () => (/* reexport */ use_dialog_default),
  __experimentalusedragging: () => (/* reexport */ usedragging),
  __experimentalusedropzone: () => (/* reexport */ usedropzone),
  __experimentalusefixedwindowlist: () => (/* reexport */ usefixedwindowlist),
  __experimentalusefocusoutside: () => (/* reexport */ usefocusoutside),
  compose: () => (/* reexport */ compose_default),
  createhigherordercomponent: () => (/* reexport */ createhigherordercomponent),
  debounce: () => (/* reexport */ debounce),
  ifcondition: () => (/* reexport */ if_condition_default),
  observablemap: () => (/* reexport */ observablemap),
  pipe: () => (/* reexport */ pipe_default),
  pure: () => (/* reexport */ pure_default),
  throttle: () => (/* reexport */ throttle),
  useasynclist: () => (/* reexport */ use_async_list_default),
  useconstrainedtabbing: () => (/* reexport */ use_constrained_tabbing_default),
  usecopyonclick: () => (/* reexport */ usecopyonclick),
  usecopytoclipboard: () => (/* reexport */ usecopytoclipboard),
  usedebounce: () => (/* reexport */ usedebounce),
  usedebouncedinput: () => (/* reexport */ usedebouncedinput),
  usedisabled: () => (/* reexport */ usedisabled),
  useevent: () => (/* reexport */ useevent),
  usefocusonmount: () => (/* reexport */ usefocusonmount),
  usefocusreturn: () => (/* reexport */ use_focus_return_default),
  usefocusableiframe: () => (/* reexport */ usefocusableiframe),
  useinstanceid: () => (/* reexport */ use_instance_id_default),
  useisomorphiclayouteffect: () => (/* reexport */ use_isomorphic_layout_effect_default),
  usekeyboardshortcut: () => (/* reexport */ use_keyboard_shortcut_default),
  usemediaquery: () => (/* reexport */ usemediaquery),
  usemergerefs: () => (/* reexport */ usemergerefs),
  useobservablevalue: () => (/* reexport */ useobservablevalue),
  useprevious: () => (/* reexport */ useprevious),
  usereducedmotion: () => (/* reexport */ use_reduced_motion_default),
  userefeffect: () => (/* reexport */ userefeffect),
  useresizeobserver: () => (/* reexport */ use_resize_observer_useresizeobserver),
  usestatewithhistory: () => (/* reexport */ usestatewithhistory),
  usethrottle: () => (/* reexport */ usethrottle),
  useviewportmatch: () => (/* reexport */ use_viewport_match_default),
  usewarnonchange: () => (/* reexport */ use_warn_on_change_default),
  withglobalevents: () => (/* reexport */ withglobalevents),
  withinstanceid: () => (/* reexport */ with_instance_id_default),
  withsafetimeout: () => (/* reexport */ with_safe_timeout_default),
  withstate: () => (/* reexport */ withstate)
});

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

;// ./node_modules/lower-case/dist.es2015/index.js
/**
 * source: ftp://ftp.unicode.org/public/ucd/latest/ucd/specialcasing.txt
 */
var supported_locale = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            ä°: "\u0069",
            i: "\u0131",
            iì‡: "\u0069",
        },
    },
    az: {
        regexp: /\u0130/g,
        map: {
            ä°: "\u0069",
            i: "\u0131",
            iì‡: "\u0069",
        },
    },
    lt: {
        regexp: /\u0049|\u004a|\u012e|\u00cc|\u00cd|\u0128/g,
        map: {
            i: "\u0069\u0307",
            j: "\u006a\u0307",
            ä®: "\u012f\u0307",
            ãœ: "\u0069\u0307\u0300",
            ã: "\u0069\u0307\u0301",
            ä¨: "\u0069\u0307\u0303",
        },
    },
};
/**
 * localized lower case.
 */
function localelowercase(str, locale) {
    var lang = supported_locale[locale.tolowercase()];
    if (lang)
        return lowercase(str.replace(lang.regexp, function (m) { return lang.map[m]; }));
    return lowercase(str);
}
/**
 * lower case as a function.
 */
function lowercase(str) {
    return str.tolowercase();
}

;// ./node_modules/no-case/dist.es2015/index.js

// support camel case ("camelcase" -> "camel case" and "camelcase" -> "camel case").
var default_split_regexp = [/([a-z0-9])([a-z])/g, /([a-z])([a-z][a-z])/g];
// remove all non-word characters.
var default_strip_regexp = /[^a-z0-9]+/gi;
/**
 * normalize the string into something other libraries can manipulate easier.
 */
function nocase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitregexp, splitregexp = _a === void 0 ? default_split_regexp : _a, _b = options.stripregexp, stripregexp = _b === void 0 ? default_strip_regexp : _b, _c = options.transform, transform = _c === void 0 ? lowercase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitregexp, "$1\0$2"), stripregexp, "\0");
    var start = 0;
    var end = result.length;
    // trim the delimiter from around the output string.
    while (result.charat(start) === "\0")
        start++;
    while (result.charat(end - 1) === "\0")
        end--;
    // transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof regexp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}

;// ./node_modules/pascal-case/dist.es2015/index.js


function pascalcasetransform(input, index) {
    var firstchar = input.charat(0);
    var lowerchars = input.substr(1).tolowercase();
    if (index > 0 && firstchar >= "0" && firstchar <= "9") {
        return "_" + firstchar + lowerchars;
    }
    return "" + firstchar.touppercase() + lowerchars;
}
function pascalcasetransformmerge(input) {
    return input.charat(0).touppercase() + input.slice(1).tolowercase();
}
function pascalcase(input, options) {
    if (options === void 0) { options = {}; }
    return nocase(input, __assign({ delimiter: "", transform: pascalcasetransform }, options));
}

;// ./node_modules/@wordpress/compose/build-module/utils/create-higher-order-component/index.js

function createhigherordercomponent(mapcomponent, modifiername) {
  return (inner) => {
    const outer = mapcomponent(inner);
    outer.displayname = hocname(modifiername, inner);
    return outer;
  };
}
const hocname = (name, inner) => {
  const inner = inner.displayname || inner.name || "component";
  const outer = pascalcase(name ?? "");
  return `${outer}(${inner})`;
};


;// ./node_modules/@wordpress/compose/build-module/utils/debounce/index.js
const debounce = (func, wait, options) => {
  let lastargs;
  let lastthis;
  let maxwait = 0;
  let result;
  let timerid;
  let lastcalltime;
  let lastinvoketime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;
  if (options) {
    leading = !!options.leading;
    maxing = "maxwait" in options;
    if (options.maxwait !== void 0) {
      maxwait = math.max(options.maxwait, wait);
    }
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokefunc(time) {
    const args = lastargs;
    const thisarg = lastthis;
    lastargs = void 0;
    lastthis = void 0;
    lastinvoketime = time;
    result = func.apply(thisarg, args);
    return result;
  }
  function starttimer(pendingfunc, waittime) {
    timerid = settimeout(pendingfunc, waittime);
  }
  function canceltimer() {
    if (timerid !== void 0) {
      cleartimeout(timerid);
    }
  }
  function leadingedge(time) {
    lastinvoketime = time;
    starttimer(timerexpired, wait);
    return leading ? invokefunc(time) : result;
  }
  function gettimesincelastcall(time) {
    return time - (lastcalltime || 0);
  }
  function remainingwait(time) {
    const timesincelastcall = gettimesincelastcall(time);
    const timesincelastinvoke = time - lastinvoketime;
    const timewaiting = wait - timesincelastcall;
    return maxing ? math.min(timewaiting, maxwait - timesincelastinvoke) : timewaiting;
  }
  function shouldinvoke(time) {
    const timesincelastcall = gettimesincelastcall(time);
    const timesincelastinvoke = time - lastinvoketime;
    return lastcalltime === void 0 || timesincelastcall >= wait || timesincelastcall < 0 || maxing && timesincelastinvoke >= maxwait;
  }
  function timerexpired() {
    const time = date.now();
    if (shouldinvoke(time)) {
      return trailingedge(time);
    }
    starttimer(timerexpired, remainingwait(time));
    return void 0;
  }
  function cleartimer() {
    timerid = void 0;
  }
  function trailingedge(time) {
    cleartimer();
    if (trailing && lastargs) {
      return invokefunc(time);
    }
    lastargs = lastthis = void 0;
    return result;
  }
  function cancel() {
    canceltimer();
    lastinvoketime = 0;
    cleartimer();
    lastargs = lastcalltime = lastthis = void 0;
  }
  function flush() {
    return pending() ? trailingedge(date.now()) : result;
  }
  function pending() {
    return timerid !== void 0;
  }
  function debounced(...args) {
    const time = date.now();
    const isinvoking = shouldinvoke(time);
    lastargs = args;
    lastthis = this;
    lastcalltime = time;
    if (isinvoking) {
      if (!pending()) {
        return leadingedge(lastcalltime);
      }
      if (maxing) {
        starttimer(timerexpired, wait);
        return invokefunc(lastcalltime);
      }
    }
    if (!pending()) {
      starttimer(timerexpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
};


;// ./node_modules/@wordpress/compose/build-module/utils/throttle/index.js

const throttle = (func, wait, options) => {
  let leading = true;
  let trailing = true;
  if (options) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    leading,
    trailing,
    maxwait: wait
  });
};


;// ./node_modules/@wordpress/compose/build-module/utils/observable-map/index.js
function observablemap() {
  const map = /* @__pure__ */ new map();
  const listeners = /* @__pure__ */ new map();
  function calllisteners(name) {
    const list = listeners.get(name);
    if (!list) {
      return;
    }
    for (const listener of list) {
      listener();
    }
  }
  return {
    get(name) {
      return map.get(name);
    },
    set(name, value) {
      map.set(name, value);
      calllisteners(name);
    },
    delete(name) {
      map.delete(name);
      calllisteners(name);
    },
    subscribe(name, listener) {
      let list = listeners.get(name);
      if (!list) {
        list = /* @__pure__ */ new set();
        listeners.set(name, list);
      }
      list.add(listener);
      return () => {
        list.delete(listener);
        if (list.size === 0) {
          listeners.delete(name);
        }
      };
    }
  };
}


;// ./node_modules/@wordpress/compose/build-module/higher-order/pipe.js
const basepipe = (reverse = false) => (...funcs) => (...args) => {
  const functions = funcs.flat();
  if (reverse) {
    functions.reverse();
  }
  return functions.reduce(
    (prev, func) => [func(...prev)],
    args
  )[0];
};
const pipe = basepipe();
var pipe_default = pipe;


;// ./node_modules/@wordpress/compose/build-module/higher-order/compose.js

const compose = basepipe(true);
var compose_default = compose;


;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// ./node_modules/@wordpress/compose/build-module/higher-order/if-condition/index.js


function ifcondition(predicate) {
  return createhigherordercomponent(
    (wrappedcomponent) => (props) => {
      if (!predicate(props)) {
        return null;
      }
      return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(wrappedcomponent, { ...props });
    },
    "ifcondition"
  );
}
var if_condition_default = ifcondition;


;// external ["wp","isshallowequal"]
const external_wp_isshallowequal_namespaceobject = window["wp"]["isshallowequal"];
var external_wp_isshallowequal_default = /*#__pure__*/__webpack_require__.n(external_wp_isshallowequal_namespaceobject);
;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// ./node_modules/@wordpress/compose/build-module/higher-order/pure/index.js




const pure = createhigherordercomponent(function(wrappedcomponent) {
  if (wrappedcomponent.prototype instanceof external_wp_element_namespaceobject.component) {
    return class extends wrappedcomponent {
      shouldcomponentupdate(nextprops, nextstate) {
        return !external_wp_isshallowequal_default()(nextprops, this.props) || !external_wp_isshallowequal_default()(nextstate, this.state);
      }
    };
  }
  return class extends external_wp_element_namespaceobject.component {
    shouldcomponentupdate(nextprops) {
      return !external_wp_isshallowequal_default()(nextprops, this.props);
    }
    render() {
      return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(wrappedcomponent, { ...this.props });
    }
  };
}, "pure");
var pure_default = pure;


;// external ["wp","deprecated"]
const external_wp_deprecated_namespaceobject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__pure__*/__webpack_require__.n(external_wp_deprecated_namespaceobject);
;// ./node_modules/@wordpress/compose/build-module/higher-order/with-global-events/listener.js
class listener {
  constructor() {
    this.listeners = {};
    this.handleevent = this.handleevent.bind(this);
  }
  add(eventtype, instance) {
    if (!this.listeners[eventtype]) {
      window.addeventlistener(eventtype, this.handleevent);
      this.listeners[eventtype] = [];
    }
    this.listeners[eventtype].push(instance);
  }
  remove(eventtype, instance) {
    if (!this.listeners[eventtype]) {
      return;
    }
    this.listeners[eventtype] = this.listeners[eventtype].filter(
      (listener) => listener !== instance
    );
    if (!this.listeners[eventtype].length) {
      window.removeeventlistener(eventtype, this.handleevent);
      delete this.listeners[eventtype];
    }
  }
  handleevent(event) {
    this.listeners[event.type]?.foreach(
      (instance) => {
        instance.handleevent(event);
      }
    );
  }
}
var listener_default = listener;


;// ./node_modules/@wordpress/compose/build-module/higher-order/with-global-events/index.js





const listener = new listener_default();
function withglobalevents(eventtypestohandlers) {
  external_wp_deprecated_default()("wp.compose.withglobalevents", {
    since: "5.7",
    alternative: "useeffect"
  });
  return createhigherordercomponent((wrappedcomponent) => {
    class wrapper extends external_wp_element_namespaceobject.component {
      constructor(props) {
        super(props);
        this.handleevent = this.handleevent.bind(this);
        this.handleref = this.handleref.bind(this);
      }
      componentdidmount() {
        object.keys(eventtypestohandlers).foreach((eventtype) => {
          listener.add(eventtype, this);
        });
      }
      componentwillunmount() {
        object.keys(eventtypestohandlers).foreach((eventtype) => {
          listener.remove(eventtype, this);
        });
      }
      handleevent(event) {
        const handler = eventtypestohandlers[
          /** @type {keyof globaleventhandlerseventmap} */
          event.type
          /* eslint-enable jsdoc/no-undefined-types */
        ];
        if (typeof this.wrappedref[handler] === "function") {
          this.wrappedref[handler](event);
        }
      }
      handleref(el) {
        this.wrappedref = el;
        if (this.props.forwardedref) {
          this.props.forwardedref(el);
        }
      }
      render() {
        return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          wrappedcomponent,
          {
            ...this.props.ownprops,
            ref: this.handleref
          }
        );
      }
    }
    return (0,external_wp_element_namespaceobject.forwardref)((props, ref) => {
      return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(wrapper, { ownprops: props, forwardedref: ref });
    });
  }, "withglobalevents");
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-instance-id/index.js

const instancemap = /* @__pure__ */ new weakmap();
function createid(object) {
  const instances = instancemap.get(object) || 0;
  instancemap.set(object, instances + 1);
  return instances;
}
function useinstanceid(object, prefix, preferredid) {
  return (0,external_wp_element_namespaceobject.usememo)(() => {
    if (preferredid) {
      return preferredid;
    }
    const id = createid(object);
    return prefix ? `${prefix}-${id}` : id;
  }, [object, preferredid, prefix]);
}
var use_instance_id_default = useinstanceid;


;// ./node_modules/@wordpress/compose/build-module/higher-order/with-instance-id/index.js



const withinstanceid = createhigherordercomponent(
  (wrappedcomponent) => {
    return (props) => {
      const instanceid = use_instance_id_default(wrappedcomponent);
      return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(wrappedcomponent, { ...props, instanceid });
    };
  },
  "instanceid"
);
var with_instance_id_default = withinstanceid;


;// ./node_modules/@wordpress/compose/build-module/higher-order/with-safe-timeout/index.js



const withsafetimeout = createhigherordercomponent(
  (originalcomponent) => {
    return class wrappedcomponent extends external_wp_element_namespaceobject.component {
      timeouts;
      constructor(props) {
        super(props);
        this.timeouts = [];
        this.settimeout = this.settimeout.bind(this);
        this.cleartimeout = this.cleartimeout.bind(this);
      }
      componentwillunmount() {
        this.timeouts.foreach(cleartimeout);
      }
      settimeout(fn, delay) {
        const id = settimeout(() => {
          fn();
          this.cleartimeout(id);
        }, delay);
        this.timeouts.push(id);
        return id;
      }
      cleartimeout(id) {
        cleartimeout(id);
        this.timeouts = this.timeouts.filter(
          (timeoutid) => timeoutid !== id
        );
      }
      render() {
        return (
          // @ts-ignore
          /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
            originalcomponent,
            {
              ...this.props,
              settimeout: this.settimeout,
              cleartimeout: this.cleartimeout
            }
          )
        );
      }
    };
  },
  "withsafetimeout"
);
var with_safe_timeout_default = withsafetimeout;


;// ./node_modules/@wordpress/compose/build-module/higher-order/with-state/index.js




function withstate(initialstate = {}) {
  external_wp_deprecated_default()("wp.compose.withstate", {
    since: "5.8",
    alternative: "wp.element.usestate"
  });
  return createhigherordercomponent((originalcomponent) => {
    return class wrappedcomponent extends external_wp_element_namespaceobject.component {
      constructor(props) {
        super(props);
        this.setstate = this.setstate.bind(this);
        this.state = initialstate;
      }
      render() {
        return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
          originalcomponent,
          {
            ...this.props,
            ...this.state,
            setstate: this.setstate
          }
        );
      }
    };
  }, "withstate");
}


;// external ["wp","dom"]
const external_wp_dom_namespaceobject = window["wp"]["dom"];
;// ./node_modules/@wordpress/compose/build-module/hooks/use-ref-effect/index.js

function userefeffect(callback, dependencies) {
  const cleanupref = (0,external_wp_element_namespaceobject.useref)();
  return (0,external_wp_element_namespaceobject.usecallback)((node) => {
    if (node) {
      cleanupref.current = callback(node);
    } else if (cleanupref.current) {
      cleanupref.current();
    }
  }, dependencies);
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-constrained-tabbing/index.js


function useconstrainedtabbing() {
  return userefeffect((node) => {
    function onkeydown(event) {
      const { key, shiftkey, target } = event;
      if (key !== "tab") {
        return;
      }
      const action = shiftkey ? "findprevious" : "findnext";
      const nextelement = external_wp_dom_namespaceobject.focus.tabbable[action](
        /** @type {htmlelement} */
        target
      ) || null;
      if (
        /** @type {htmlelement} */
        target.contains(nextelement)
      ) {
        event.preventdefault();
        nextelement?.focus();
        return;
      }
      if (node.contains(nextelement)) {
        return;
      }
      const domaction = shiftkey ? "append" : "prepend";
      const { ownerdocument } = node;
      const trap = ownerdocument.createelement("div");
      trap.tabindex = -1;
      node[domaction](trap);
      trap.addeventlistener("blur", () => node.removechild(trap));
      trap.focus();
    }
    node.addeventlistener("keydown", onkeydown);
    return () => {
      node.removeeventlistener("keydown", onkeydown);
    };
  }, []);
}
var use_constrained_tabbing_default = useconstrainedtabbing;


// external module: ./node_modules/clipboard/dist/clipboard.js
var dist_clipboard = __webpack_require__(3758);
var clipboard_default = /*#__pure__*/__webpack_require__.n(dist_clipboard);
;// ./node_modules/@wordpress/compose/build-module/hooks/use-copy-on-click/index.js



function usecopyonclick(ref, text, timeout = 4e3) {
  external_wp_deprecated_default()("wp.compose.usecopyonclick", {
    since: "5.8",
    alternative: "wp.compose.usecopytoclipboard"
  });
  const clipboardref = (0,external_wp_element_namespaceobject.useref)();
  const [hascopied, sethascopied] = (0,external_wp_element_namespaceobject.usestate)(false);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    let timeoutid;
    if (!ref.current) {
      return;
    }
    clipboardref.current = new (clipboard_default())(ref.current, {
      text: () => typeof text === "function" ? text() : text
    });
    clipboardref.current.on("success", ({ clearselection, trigger }) => {
      clearselection();
      if (trigger) {
        trigger.focus();
      }
      if (timeout) {
        sethascopied(true);
        cleartimeout(timeoutid);
        timeoutid = settimeout(() => sethascopied(false), timeout);
      }
    });
    return () => {
      if (clipboardref.current) {
        clipboardref.current.destroy();
      }
      cleartimeout(timeoutid);
    };
  }, [text, timeout, sethascopied]);
  return hascopied;
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-copy-to-clipboard/index.js



function useupdatedref(value) {
  const ref = (0,external_wp_element_namespaceobject.useref)(value);
  (0,external_wp_element_namespaceobject.uselayouteffect)(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
function usecopytoclipboard(text, onsuccess) {
  const textref = useupdatedref(text);
  const onsuccessref = useupdatedref(onsuccess);
  return userefeffect((node) => {
    const clipboard = new (clipboard_default())(node, {
      text() {
        return typeof textref.current === "function" ? textref.current() : textref.current || "";
      }
    });
    clipboard.on("success", ({ clearselection }) => {
      clearselection();
      if (onsuccessref.current) {
        onsuccessref.current();
      }
    });
    return () => {
      clipboard.destroy();
    };
  }, []);
}


;// external ["wp","keycodes"]
const external_wp_keycodes_namespaceobject = window["wp"]["keycodes"];
;// ./node_modules/@wordpress/compose/build-module/hooks/use-focus-on-mount/index.js



function usefocusonmount(focusonmount = "firstelement") {
  const focusonmountref = (0,external_wp_element_namespaceobject.useref)(focusonmount);
  const setfocus = (target) => {
    target.focus({
      // when focusing newly mounted dialogs,
      // the position of the popover is often not right on the first render
      // this prevents the layout shifts when focusing the dialogs.
      preventscroll: true
    });
  };
  const timeridref = (0,external_wp_element_namespaceobject.useref)();
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    focusonmountref.current = focusonmount;
  }, [focusonmount]);
  return userefeffect((node) => {
    if (!node || focusonmountref.current === false) {
      return;
    }
    if (node.contains(node.ownerdocument?.activeelement ?? null)) {
      return;
    }
    if (focusonmountref.current !== "firstelement") {
      setfocus(node);
      return;
    }
    timeridref.current = settimeout(() => {
      const firsttabbable = external_wp_dom_namespaceobject.focus.tabbable.find(node)[0];
      if (firsttabbable) {
        setfocus(firsttabbable);
      }
    }, 0);
    return () => {
      if (timeridref.current) {
        cleartimeout(timeridref.current);
      }
    };
  }, []);
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-focus-return/index.js

let origin = null;
function usefocusreturn(onfocusreturn) {
  const ref = (0,external_wp_element_namespaceobject.useref)(null);
  const focusedbeforemount = (0,external_wp_element_namespaceobject.useref)(null);
  const onfocusreturnref = (0,external_wp_element_namespaceobject.useref)(onfocusreturn);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    onfocusreturnref.current = onfocusreturn;
  }, [onfocusreturn]);
  return (0,external_wp_element_namespaceobject.usecallback)((node) => {
    if (node) {
      ref.current = node;
      if (focusedbeforemount.current) {
        return;
      }
      const activedocument = node.ownerdocument.activeelement instanceof window.htmliframeelement ? node.ownerdocument.activeelement.contentdocument : node.ownerdocument;
      focusedbeforemount.current = activedocument?.activeelement ?? null;
    } else if (focusedbeforemount.current) {
      const isfocused = ref.current?.contains(
        ref.current?.ownerdocument.activeelement
      );
      if (ref.current?.isconnected && !isfocused) {
        origin ??= focusedbeforemount.current;
        return;
      }
      if (onfocusreturnref.current) {
        onfocusreturnref.current();
      } else {
        (!focusedbeforemount.current.isconnected ? origin : focusedbeforemount.current)?.focus();
      }
      origin = null;
    }
  }, []);
}
var use_focus_return_default = usefocusreturn;


;// ./node_modules/@wordpress/compose/build-module/hooks/use-focus-outside/index.js

const input_button_types = ["button", "submit"];
function isfocusnormalizedbutton(eventtarget) {
  if (!(eventtarget instanceof window.htmlelement)) {
    return false;
  }
  switch (eventtarget.nodename) {
    case "a":
    case "button":
      return true;
    case "input":
      return input_button_types.includes(
        eventtarget.type
      );
  }
  return false;
}
function usefocusoutside(onfocusoutside) {
  const currentonfocusoutsideref = (0,external_wp_element_namespaceobject.useref)(onfocusoutside);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    currentonfocusoutsideref.current = onfocusoutside;
  }, [onfocusoutside]);
  const preventblurcheckref = (0,external_wp_element_namespaceobject.useref)(false);
  const blurchecktimeoutidref = (0,external_wp_element_namespaceobject.useref)();
  const cancelblurcheck = (0,external_wp_element_namespaceobject.usecallback)(() => {
    cleartimeout(blurchecktimeoutidref.current);
  }, []);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (!onfocusoutside) {
      cancelblurcheck();
    }
  }, [onfocusoutside, cancelblurcheck]);
  const normalizebuttonfocus = (0,external_wp_element_namespaceobject.usecallback)((event) => {
    const { type, target } = event;
    const isinteractionend = ["mouseup", "touchend"].includes(type);
    if (isinteractionend) {
      preventblurcheckref.current = false;
    } else if (isfocusnormalizedbutton(target)) {
      preventblurcheckref.current = true;
    }
  }, []);
  const queueblurcheck = (0,external_wp_element_namespaceobject.usecallback)((event) => {
    event.persist();
    if (preventblurcheckref.current) {
      return;
    }
    const ignoreforrelatedtarget = event.target.getattribute(
      "data-unstable-ignore-focus-outside-for-relatedtarget"
    );
    if (ignoreforrelatedtarget && event.relatedtarget?.closest(ignoreforrelatedtarget)) {
      return;
    }
    blurchecktimeoutidref.current = settimeout(() => {
      if (!document.hasfocus()) {
        event.preventdefault();
        return;
      }
      if ("function" === typeof currentonfocusoutsideref.current) {
        currentonfocusoutsideref.current(event);
      }
    }, 0);
  }, []);
  return {
    onfocus: cancelblurcheck,
    onmousedown: normalizebuttonfocus,
    onmouseup: normalizebuttonfocus,
    ontouchstart: normalizebuttonfocus,
    ontouchend: normalizebuttonfocus,
    onblur: queueblurcheck
  };
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-merge-refs/index.js

function assignref(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && ref.hasownproperty("current")) {
    ref.current = value;
  }
}
function usemergerefs(refs) {
  const element = (0,external_wp_element_namespaceobject.useref)();
  const isattachedref = (0,external_wp_element_namespaceobject.useref)(false);
  const didelementchangeref = (0,external_wp_element_namespaceobject.useref)(false);
  const previousrefsref = (0,external_wp_element_namespaceobject.useref)([]);
  const currentrefsref = (0,external_wp_element_namespaceobject.useref)(refs);
  currentrefsref.current = refs;
  (0,external_wp_element_namespaceobject.uselayouteffect)(() => {
    if (didelementchangeref.current === false && isattachedref.current === true) {
      refs.foreach((ref, index) => {
        const previousref = previousrefsref.current[index];
        if (ref !== previousref) {
          assignref(previousref, null);
          assignref(ref, element.current);
        }
      });
    }
    previousrefsref.current = refs;
  }, refs);
  (0,external_wp_element_namespaceobject.uselayouteffect)(() => {
    didelementchangeref.current = false;
  });
  return (0,external_wp_element_namespaceobject.usecallback)((value) => {
    assignref(element, value);
    didelementchangeref.current = true;
    isattachedref.current = value !== null;
    const refstoassign = value ? currentrefsref.current : previousrefsref.current;
    for (const ref of refstoassign) {
      assignref(ref, value);
    }
  }, []);
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-dialog/index.js







function usedialog(options) {
  const currentoptions = (0,external_wp_element_namespaceobject.useref)();
  const { constraintabbing = options.focusonmount !== false } = options;
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    currentoptions.current = options;
  }, object.values(options));
  const constrainedtabbingref = use_constrained_tabbing_default();
  const focusonmountref = usefocusonmount(options.focusonmount);
  const focusreturnref = use_focus_return_default();
  const focusoutsideprops = usefocusoutside((event) => {
    if (currentoptions.current?.__unstableonclose) {
      currentoptions.current.__unstableonclose("focus-outside", event);
    } else if (currentoptions.current?.onclose) {
      currentoptions.current.onclose();
    }
  });
  const closeonescaperef = (0,external_wp_element_namespaceobject.usecallback)((node) => {
    if (!node) {
      return;
    }
    node.addeventlistener("keydown", (event) => {
      if (event.keycode === external_wp_keycodes_namespaceobject.escape && !event.defaultprevented && currentoptions.current?.onclose) {
        event.preventdefault();
        currentoptions.current.onclose();
      }
    });
  }, []);
  return [
    usemergerefs([
      constraintabbing ? constrainedtabbingref : null,
      options.focusonmount !== false ? focusreturnref : null,
      options.focusonmount !== false ? focusonmountref : null,
      closeonescaperef
    ]),
    {
      ...focusoutsideprops,
      tabindex: -1
    }
  ];
}
var use_dialog_default = usedialog;


;// ./node_modules/@wordpress/compose/build-module/hooks/use-disabled/index.js


function usedisabled({
  isdisabled: isdisabledprop = false
} = {}) {
  return userefeffect(
    (node) => {
      if (isdisabledprop) {
        return;
      }
      const defaultview = node?.ownerdocument?.defaultview;
      if (!defaultview) {
        return;
      }
      const updates = [];
      const disable = () => {
        node.childnodes.foreach((child) => {
          if (!(child instanceof defaultview.htmlelement)) {
            return;
          }
          if (!child.getattribute("inert")) {
            child.setattribute("inert", "true");
            updates.push(() => {
              child.removeattribute("inert");
            });
          }
        });
      };
      const debounceddisable = debounce(disable, 0, {
        leading: true
      });
      disable();
      const observer = new window.mutationobserver(debounceddisable);
      observer.observe(node, {
        childlist: true
      });
      return () => {
        if (observer) {
          observer.disconnect();
        }
        debounceddisable.cancel();
        updates.foreach((update) => update());
      };
    },
    [isdisabledprop]
  );
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-event/index.js

function useevent(callback) {
  const ref = (0,external_wp_element_namespaceobject.useref)(() => {
    throw new error(
      "callbacks created with `useevent` cannot be called during rendering."
    );
  });
  (0,external_wp_element_namespaceobject.useinsertioneffect)(() => {
    ref.current = callback;
  });
  return (0,external_wp_element_namespaceobject.usecallback)(
    (...args) => ref.current?.(...args),
    []
  );
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-isomorphic-layout-effect/index.js

const useisomorphiclayouteffect = typeof window !== "undefined" ? external_wp_element_namespaceobject.uselayouteffect : external_wp_element_namespaceobject.useeffect;
var use_isomorphic_layout_effect_default = useisomorphiclayouteffect;


;// ./node_modules/@wordpress/compose/build-module/hooks/use-dragging/index.js


function usedragging({ ondragstart, ondragmove, ondragend }) {
  const [isdragging, setisdragging] = (0,external_wp_element_namespaceobject.usestate)(false);
  const eventsref = (0,external_wp_element_namespaceobject.useref)({
    ondragstart,
    ondragmove,
    ondragend
  });
  use_isomorphic_layout_effect_default(() => {
    eventsref.current.ondragstart = ondragstart;
    eventsref.current.ondragmove = ondragmove;
    eventsref.current.ondragend = ondragend;
  }, [ondragstart, ondragmove, ondragend]);
  const onmousemove = (0,external_wp_element_namespaceobject.usecallback)(
    (event) => eventsref.current.ondragmove && eventsref.current.ondragmove(event),
    []
  );
  const enddrag = (0,external_wp_element_namespaceobject.usecallback)((event) => {
    if (eventsref.current.ondragend) {
      eventsref.current.ondragend(event);
    }
    document.removeeventlistener("mousemove", onmousemove);
    document.removeeventlistener("mouseup", enddrag);
    setisdragging(false);
  }, []);
  const startdrag = (0,external_wp_element_namespaceobject.usecallback)((event) => {
    if (eventsref.current.ondragstart) {
      eventsref.current.ondragstart(event);
    }
    document.addeventlistener("mousemove", onmousemove);
    document.addeventlistener("mouseup", enddrag);
    setisdragging(true);
  }, []);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    return () => {
      if (isdragging) {
        document.removeeventlistener("mousemove", onmousemove);
        document.removeeventlistener("mouseup", enddrag);
      }
    };
  }, [isdragging]);
  return {
    startdrag,
    enddrag,
    isdragging
  };
}


// external module: ./node_modules/mousetrap/mousetrap.js
var mousetrap_mousetrap = __webpack_require__(1933);
var mousetrap_default = /*#__pure__*/__webpack_require__.n(mousetrap_mousetrap);
// external module: ./node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind.js
var mousetrap_global_bind = __webpack_require__(5760);
;// ./node_modules/@wordpress/compose/build-module/hooks/use-keyboard-shortcut/index.js




function usekeyboardshortcut(shortcuts, callback, {
  bindglobal = false,
  eventname = "keydown",
  isdisabled = false,
  // this is important for performance considerations.
  target
} = {}) {
  const currentcallbackref = (0,external_wp_element_namespaceobject.useref)(callback);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    currentcallbackref.current = callback;
  }, [callback]);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    if (isdisabled) {
      return;
    }
    const mousetrap = new (mousetrap_default())(
      target && target.current ? target.current : (
        // we were passing `document` here previously, so to successfully cast it to element we must cast it first to `unknown`.
        // not sure if this is a mistake but it was the behavior previous to the addition of types so we're just doing what's
        // necessary to maintain the existing behavior.
        /** @type {element} */
        /** @type {unknown} */
        document
      )
    );
    const shortcutsarray = array.isarray(shortcuts) ? shortcuts : [shortcuts];
    shortcutsarray.foreach((shortcut) => {
      const keys = shortcut.split("+");
      const modifiers = new set(
        keys.filter((value) => value.length > 1)
      );
      const hasalt = modifiers.has("alt");
      const hasshift = modifiers.has("shift");
      if ((0,external_wp_keycodes_namespaceobject.isappleos)() && (modifiers.size === 1 && hasalt || modifiers.size === 2 && hasalt && hasshift)) {
        throw new error(
          `cannot bind ${shortcut}. alt and shift+alt modifiers are reserved for character input.`
        );
      }
      const bindfn = bindglobal ? "bindglobal" : "bind";
      mousetrap[bindfn](
        shortcut,
        (...args) => (
          /* eslint-enable jsdoc/valid-types */
          currentcallbackref.current(...args)
        ),
        eventname
      );
    });
    return () => {
      mousetrap.reset();
    };
  }, [shortcuts, bindglobal, eventname, target, isdisabled]);
}
var use_keyboard_shortcut_default = usekeyboardshortcut;


;// ./node_modules/@wordpress/compose/build-module/hooks/use-media-query/index.js

const matchmediacache = /* @__pure__ */ new map();
function getmediaquerylist(query) {
  if (!query) {
    return null;
  }
  let match = matchmediacache.get(query);
  if (match) {
    return match;
  }
  if (typeof window !== "undefined" && typeof window.matchmedia === "function") {
    match = window.matchmedia(query);
    matchmediacache.set(query, match);
    return match;
  }
  return null;
}
function usemediaquery(query) {
  const source = (0,external_wp_element_namespaceobject.usememo)(() => {
    const mediaquerylist = getmediaquerylist(query);
    return {
      /** @type {(onstorechange: () => void) => () => void} */
      subscribe(onstorechange) {
        if (!mediaquerylist) {
          return () => {
          };
        }
        mediaquerylist.addeventlistener?.("change", onstorechange);
        return () => {
          mediaquerylist.removeeventlistener?.(
            "change",
            onstorechange
          );
        };
      },
      getvalue() {
        return mediaquerylist?.matches ?? false;
      }
    };
  }, [query]);
  return (0,external_wp_element_namespaceobject.usesyncexternalstore)(
    source.subscribe,
    source.getvalue,
    () => false
  );
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-previous/index.js

function useprevious(value) {
  const ref = (0,external_wp_element_namespaceobject.useref)();
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-reduced-motion/index.js

const usereducedmotion = () => usemediaquery("(prefers-reduced-motion: reduce)");
var use_reduced_motion_default = usereducedmotion;


;// ./node_modules/@wordpress/undo-manager/build-module/index.js

function mergehistorychanges(changes1, changes2) {
  const newchanges = { ...changes1 };
  object.entries(changes2).foreach(([key, value]) => {
    if (newchanges[key]) {
      newchanges[key] = { ...newchanges[key], to: value.to };
    } else {
      newchanges[key] = value;
    }
  });
  return newchanges;
}
const addhistorychangesintorecord = (record, changes) => {
  const existingchangesindex = record?.findindex(
    ({ id: recordidentifier }) => {
      return typeof recordidentifier === "string" ? recordidentifier === changes.id : external_wp_isshallowequal_default()(recordidentifier, changes.id);
    }
  );
  const nextrecord = [...record];
  if (existingchangesindex !== -1) {
    nextrecord[existingchangesindex] = {
      id: changes.id,
      changes: mergehistorychanges(
        nextrecord[existingchangesindex].changes,
        changes.changes
      )
    };
  } else {
    nextrecord.push(changes);
  }
  return nextrecord;
};
function createundomanager() {
  let history = [];
  let stagedrecord = [];
  let offset = 0;
  const droppendingredos = () => {
    history = history.slice(0, offset || void 0);
    offset = 0;
  };
  const appendstagedrecordtolatesthistoryrecord = () => {
    const index = history.length === 0 ? 0 : history.length - 1;
    let latestrecord = history[index] ?? [];
    stagedrecord.foreach((changes) => {
      latestrecord = addhistorychangesintorecord(latestrecord, changes);
    });
    stagedrecord = [];
    history[index] = latestrecord;
  };
  const isrecordempty = (record) => {
    const filteredrecord = record.filter(({ changes }) => {
      return object.values(changes).some(
        ({ from, to }) => typeof from !== "function" && typeof to !== "function" && !external_wp_isshallowequal_default()(from, to)
      );
    });
    return !filteredrecord.length;
  };
  return {
    addrecord(record, isstaged = false) {
      const isempty = !record || isrecordempty(record);
      if (isstaged) {
        if (isempty) {
          return;
        }
        record.foreach((changes) => {
          stagedrecord = addhistorychangesintorecord(
            stagedrecord,
            changes
          );
        });
      } else {
        droppendingredos();
        if (stagedrecord.length) {
          appendstagedrecordtolatesthistoryrecord();
        }
        if (isempty) {
          return;
        }
        history.push(record);
      }
    },
    undo() {
      if (stagedrecord.length) {
        droppendingredos();
        appendstagedrecordtolatesthistoryrecord();
      }
      const undorecord = history[history.length - 1 + offset];
      if (!undorecord) {
        return;
      }
      offset -= 1;
      return undorecord;
    },
    redo() {
      const redorecord = history[history.length + offset];
      if (!redorecord) {
        return;
      }
      offset += 1;
      return redorecord;
    },
    hasundo() {
      return !!history[history.length - 1 + offset];
    },
    hasredo() {
      return !!history[history.length + offset];
    }
  };
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-state-with-history/index.js


function undoredoreducer(state, action) {
  switch (action.type) {
    case "undo": {
      const undorecord = state.manager.undo();
      if (undorecord) {
        return {
          ...state,
          value: undorecord[0].changes.prop.from
        };
      }
      return state;
    }
    case "redo": {
      const redorecord = state.manager.redo();
      if (redorecord) {
        return {
          ...state,
          value: redorecord[0].changes.prop.to
        };
      }
      return state;
    }
    case "record": {
      state.manager.addrecord(
        [
          {
            id: "object",
            changes: {
              prop: { from: state.value, to: action.value }
            }
          }
        ],
        action.isstaged
      );
      return {
        ...state,
        value: action.value
      };
    }
  }
  return state;
}
function initreducer(value) {
  return {
    manager: createundomanager(),
    value
  };
}
function usestatewithhistory(initialvalue) {
  const [state, dispatch] = (0,external_wp_element_namespaceobject.usereducer)(
    undoredoreducer,
    initialvalue,
    initreducer
  );
  return {
    value: state.value,
    setvalue: (0,external_wp_element_namespaceobject.usecallback)((newvalue, isstaged) => {
      dispatch({
        type: "record",
        value: newvalue,
        isstaged
      });
    }, []),
    hasundo: state.manager.hasundo(),
    hasredo: state.manager.hasredo(),
    undo: (0,external_wp_element_namespaceobject.usecallback)(() => {
      dispatch({ type: "undo" });
    }, []),
    redo: (0,external_wp_element_namespaceobject.usecallback)(() => {
      dispatch({ type: "redo" });
    }, [])
  };
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-viewport-match/index.js


const breakpoints = {
  xhuge: 1920,
  huge: 1440,
  wide: 1280,
  xlarge: 1080,
  large: 960,
  medium: 782,
  small: 600,
  mobile: 480
};
const conditions = {
  ">=": "min-width",
  "<": "max-width"
};
const operator_evaluators = {
  ">=": (breakpointvalue, width) => width >= breakpointvalue,
  "<": (breakpointvalue, width) => width < breakpointvalue
};
const viewportmatchwidthcontext = (0,external_wp_element_namespaceobject.createcontext)(
  /** @type {null | number} */
  null
);
viewportmatchwidthcontext.displayname = "viewportmatchwidthcontext";
const useviewportmatch = (breakpoint, operator = ">=") => {
  const simulatedwidth = (0,external_wp_element_namespaceobject.usecontext)(viewportmatchwidthcontext);
  const mediaquery = !simulatedwidth && `(${conditions[operator]}: ${breakpoints[breakpoint]}px)`;
  const mediaqueryresult = usemediaquery(mediaquery || void 0);
  if (simulatedwidth) {
    return operator_evaluators[operator](
      breakpoints[breakpoint],
      simulatedwidth
    );
  }
  return mediaqueryresult;
};
useviewportmatch.__experimentalwidthprovider = viewportmatchwidthcontext.provider;
var use_viewport_match_default = useviewportmatch;


;// ./node_modules/@wordpress/compose/build-module/hooks/use-resize-observer/use-resize-observer.js


function useresizeobserver(callback, resizeobserveroptions = {}) {
  const callbackevent = useevent(callback);
  const observedelementref = (0,external_wp_element_namespaceobject.useref)();
  const resizeobserverref = (0,external_wp_element_namespaceobject.useref)();
  return useevent((element) => {
    if (element === observedelementref.current) {
      return;
    }
    resizeobserverref.current ??= new resizeobserver(callbackevent);
    const { current: resizeobserver } = resizeobserverref;
    if (observedelementref.current) {
      resizeobserver.unobserve(observedelementref.current);
    }
    observedelementref.current = element;
    if (element) {
      resizeobserver.observe(element, resizeobserveroptions);
    }
  });
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-resize-observer/legacy/index.js



const extractsize = (entry) => {
  let entrysize;
  if (!entry.contentboxsize) {
    entrysize = [entry.contentrect.width, entry.contentrect.height];
  } else if (entry.contentboxsize[0]) {
    const contentboxsize = entry.contentboxsize[0];
    entrysize = [contentboxsize.inlinesize, contentboxsize.blocksize];
  } else {
    const contentboxsize = entry.contentboxsize;
    entrysize = [contentboxsize.inlinesize, contentboxsize.blocksize];
  }
  const [width, height] = entrysize.map((d) => math.round(d));
  return { width, height };
};
const resize_element_styles = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerevents: "none",
  opacity: 0,
  overflow: "hidden",
  zindex: -1
};
function resizeelement({ onresize }) {
  const resizeelementref = useresizeobserver((entries) => {
    const newsize = extractsize(entries.at(-1));
    onresize(newsize);
  });
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(
    "div",
    {
      ref: resizeelementref,
      style: resize_element_styles,
      "aria-hidden": "true"
    }
  );
}
function sizeequals(a, b) {
  return a.width === b.width && a.height === b.height;
}
const null_size = { width: null, height: null };
function uselegacyresizeobserver() {
  const [size, setsize] = (0,external_wp_element_namespaceobject.usestate)(null_size);
  const previoussizeref = (0,external_wp_element_namespaceobject.useref)(null_size);
  const handleresize = (0,external_wp_element_namespaceobject.usecallback)((newsize) => {
    if (!sizeequals(previoussizeref.current, newsize)) {
      previoussizeref.current = newsize;
      setsize(newsize);
    }
  }, []);
  const resizeelement = /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(resizeelement, { onresize: handleresize });
  return [resizeelement, size];
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-resize-observer/index.js


function use_resize_observer_useresizeobserver(callback, options = {}) {
  return callback ? useresizeobserver(callback, options) : uselegacyresizeobserver();
}


;// external ["wp","priorityqueue"]
const external_wp_priorityqueue_namespaceobject = window["wp"]["priorityqueue"];
;// ./node_modules/@wordpress/compose/build-module/hooks/use-async-list/index.js


function getfirstitemspresentinstate(list, state) {
  const firstitems = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!state.includes(item)) {
      break;
    }
    firstitems.push(item);
  }
  return firstitems;
}
function useasynclist(list, config = { step: 1 }) {
  const { step = 1 } = config;
  const [current, setcurrent] = (0,external_wp_element_namespaceobject.usestate)([]);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    let firstitems = getfirstitemspresentinstate(list, current);
    if (firstitems.length < step) {
      firstitems = firstitems.concat(
        list.slice(firstitems.length, step)
      );
    }
    setcurrent(firstitems);
    const asyncqueue = (0,external_wp_priorityqueue_namespaceobject.createqueue)();
    for (let i = firstitems.length; i < list.length; i += step) {
      asyncqueue.add({}, () => {
        (0,external_wp_element_namespaceobject.flushsync)(() => {
          setcurrent((state) => [
            ...state,
            ...list.slice(i, i + step)
          ]);
        });
      });
    }
    return () => asyncqueue.reset();
  }, [list]);
  return current;
}
var use_async_list_default = useasynclist;


;// ./node_modules/@wordpress/compose/build-module/hooks/use-warn-on-change/index.js

function usewarnonchange(object, prefix = "change detection") {
  const previousvalues = useprevious(object);
  object.entries(previousvalues ?? []).foreach(([key, value]) => {
    if (value !== object[
      /** @type {keyof typeof object} */
      key
    ]) {
      console.warn(
        `${prefix}: ${key} key changed:`,
        value,
        object[
          /** @type {keyof typeof object} */
          key
        ]
        /* eslint-enable jsdoc/check-types */
      );
    }
  });
}
var use_warn_on_change_default = usewarnonchange;


;// external "react"
const external_react_namespaceobject = window["react"];
;// ./node_modules/use-memo-one/dist/use-memo-one.esm.js


function areinputsequal(newinputs, lastinputs) {
  if (newinputs.length !== lastinputs.length) {
    return false;
  }

  for (var i = 0; i < newinputs.length; i++) {
    if (newinputs[i] !== lastinputs[i]) {
      return false;
    }
  }

  return true;
}

function usememoone(getresult, inputs) {
  var initial = (0,external_react_namespaceobject.usestate)(function () {
    return {
      inputs: inputs,
      result: getresult()
    };
  })[0];
  var isfirstrun = (0,external_react_namespaceobject.useref)(true);
  var committed = (0,external_react_namespaceobject.useref)(initial);
  var usecache = isfirstrun.current || boolean(inputs && committed.current.inputs && areinputsequal(inputs, committed.current.inputs));
  var cache = usecache ? committed.current : {
    inputs: inputs,
    result: getresult()
  };
  (0,external_react_namespaceobject.useeffect)(function () {
    isfirstrun.current = false;
    committed.current = cache;
  }, [cache]);
  return cache.result;
}
function usecallbackone(callback, inputs) {
  return usememoone(function () {
    return callback;
  }, inputs);
}
var usememo = (/* unused pure expression or super */ null && (usememoone));
var usecallback = (/* unused pure expression or super */ null && (usecallbackone));



;// ./node_modules/@wordpress/compose/build-module/hooks/use-debounce/index.js



function usedebounce(fn, wait, options) {
  const debounced = usememoone(
    () => debounce(fn, wait ?? 0, options),
    [fn, wait, options?.leading, options?.trailing, options?.maxwait]
  );
  (0,external_wp_element_namespaceobject.useeffect)(() => () => debounced.cancel(), [debounced]);
  return debounced;
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-debounced-input/index.js


function usedebouncedinput(defaultvalue = "") {
  const [input, setinput] = (0,external_wp_element_namespaceobject.usestate)(defaultvalue);
  const [debouncedinput, setdebouncedstate] = (0,external_wp_element_namespaceobject.usestate)(defaultvalue);
  const setdebouncedinput = usedebounce(setdebouncedstate, 250);
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    setdebouncedinput(input);
  }, [input, setdebouncedinput]);
  return [input, setinput, debouncedinput];
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-throttle/index.js



function usethrottle(fn, wait, options) {
  const throttled = usememoone(
    () => throttle(fn, wait ?? 0, options),
    [fn, wait, options]
  );
  (0,external_wp_element_namespaceobject.useeffect)(() => () => throttled.cancel(), [throttled]);
  return throttled;
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-drop-zone/index.js


function usedropzone({
  dropzoneelement,
  isdisabled,
  ondrop: _ondrop,
  ondragstart: _ondragstart,
  ondragenter: _ondragenter,
  ondragleave: _ondragleave,
  ondragend: _ondragend,
  ondragover: _ondragover
}) {
  const ondropevent = useevent(_ondrop);
  const ondragstartevent = useevent(_ondragstart);
  const ondragenterevent = useevent(_ondragenter);
  const ondragleaveevent = useevent(_ondragleave);
  const ondragendevent = useevent(_ondragend);
  const ondragoverevent = useevent(_ondragover);
  return userefeffect(
    (elem) => {
      if (isdisabled) {
        return;
      }
      const element = dropzoneelement ?? elem;
      let isdragging = false;
      const { ownerdocument } = element;
      function iselementinzone(targettocheck) {
        const { defaultview } = ownerdocument;
        if (!targettocheck || !defaultview || !(targettocheck instanceof defaultview.htmlelement) || !element.contains(targettocheck)) {
          return false;
        }
        let elementtocheck = targettocheck;
        do {
          if (elementtocheck.dataset.isdropzone) {
            return elementtocheck === element;
          }
        } while (elementtocheck = elementtocheck.parentelement);
        return false;
      }
      function maybedragstart(event) {
        if (isdragging) {
          return;
        }
        isdragging = true;
        ownerdocument.addeventlistener("dragend", maybedragend);
        ownerdocument.addeventlistener("mousemove", maybedragend);
        if (_ondragstart) {
          ondragstartevent(event);
        }
      }
      function ondragenter(event) {
        event.preventdefault();
        if (element.contains(
          /** @type {node} */
          event.relatedtarget
        )) {
          return;
        }
        if (_ondragenter) {
          ondragenterevent(event);
        }
      }
      function ondragover(event) {
        if (!event.defaultprevented && _ondragover) {
          ondragoverevent(event);
        }
        event.preventdefault();
      }
      function ondragleave(event) {
        if (iselementinzone(event.relatedtarget)) {
          return;
        }
        if (_ondragleave) {
          ondragleaveevent(event);
        }
      }
      function ondrop(event) {
        if (event.defaultprevented) {
          return;
        }
        event.preventdefault();
        event.datatransfer && event.datatransfer.files.length;
        if (_ondrop) {
          ondropevent(event);
        }
        maybedragend(event);
      }
      function maybedragend(event) {
        if (!isdragging) {
          return;
        }
        isdragging = false;
        ownerdocument.removeeventlistener("dragend", maybedragend);
        ownerdocument.removeeventlistener("mousemove", maybedragend);
        if (_ondragend) {
          ondragendevent(event);
        }
      }
      element.setattribute("data-is-drop-zone", "true");
      element.addeventlistener("drop", ondrop);
      element.addeventlistener("dragenter", ondragenter);
      element.addeventlistener("dragover", ondragover);
      element.addeventlistener("dragleave", ondragleave);
      ownerdocument.addeventlistener("dragenter", maybedragstart);
      return () => {
        element.removeattribute("data-is-drop-zone");
        element.removeeventlistener("drop", ondrop);
        element.removeeventlistener("dragenter", ondragenter);
        element.removeeventlistener("dragover", ondragover);
        element.removeeventlistener("dragleave", ondragleave);
        ownerdocument.removeeventlistener("dragend", maybedragend);
        ownerdocument.removeeventlistener("mousemove", maybedragend);
        ownerdocument.removeeventlistener(
          "dragenter",
          maybedragstart
        );
      };
    },
    [isdisabled, dropzoneelement]
    // refresh when the passed in dropzoneelement changes.
  );
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-focusable-iframe/index.js

function usefocusableiframe() {
  return userefeffect((element) => {
    const { ownerdocument } = element;
    if (!ownerdocument) {
      return;
    }
    const { defaultview } = ownerdocument;
    if (!defaultview) {
      return;
    }
    function checkfocus() {
      if (ownerdocument && ownerdocument.activeelement === element) {
        element.focus();
      }
    }
    defaultview.addeventlistener("blur", checkfocus);
    return () => {
      defaultview.removeeventlistener("blur", checkfocus);
    };
  }, []);
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-fixed-window-list/index.js




const default_init_window_size = 30;
function usefixedwindowlist(elementref, itemheight, totalitems, options) {
  const initwindowsize = options?.initwindowsize ?? default_init_window_size;
  const usewindowing = options?.usewindowing ?? true;
  const [fixedlistwindow, setfixedlistwindow] = (0,external_wp_element_namespaceobject.usestate)({
    visibleitems: initwindowsize,
    start: 0,
    end: initwindowsize,
    iteminview: (index) => {
      return index >= 0 && index <= initwindowsize;
    }
  });
  (0,external_wp_element_namespaceobject.uselayouteffect)(() => {
    if (!usewindowing) {
      return;
    }
    const scrollcontainer = (0,external_wp_dom_namespaceobject.getscrollcontainer)(elementref.current);
    const measurewindow = (initrender) => {
      if (!scrollcontainer) {
        return;
      }
      const visibleitems = math.ceil(
        scrollcontainer.clientheight / itemheight
      );
      const windowoverscan = initrender ? visibleitems : options?.windowoverscan ?? visibleitems;
      const firstviewableindex = math.floor(
        scrollcontainer.scrolltop / itemheight
      );
      const start = math.max(0, firstviewableindex - windowoverscan);
      const end = math.min(
        totalitems - 1,
        firstviewableindex + visibleitems + windowoverscan
      );
      setfixedlistwindow((lastwindow) => {
        const nextwindow = {
          visibleitems,
          start,
          end,
          iteminview: (index) => {
            return start <= index && index <= end;
          }
        };
        if (lastwindow.start !== nextwindow.start || lastwindow.end !== nextwindow.end || lastwindow.visibleitems !== nextwindow.visibleitems) {
          return nextwindow;
        }
        return lastwindow;
      });
    };
    measurewindow(true);
    const debouncemeasurelist = debounce(() => {
      measurewindow();
    }, 16);
    scrollcontainer?.addeventlistener("scroll", debouncemeasurelist);
    scrollcontainer?.ownerdocument?.defaultview?.addeventlistener(
      "resize",
      debouncemeasurelist
    );
    scrollcontainer?.ownerdocument?.defaultview?.addeventlistener(
      "resize",
      debouncemeasurelist
    );
    return () => {
      scrollcontainer?.removeeventlistener(
        "scroll",
        debouncemeasurelist
      );
      scrollcontainer?.ownerdocument?.defaultview?.removeeventlistener(
        "resize",
        debouncemeasurelist
      );
    };
  }, [
    itemheight,
    elementref,
    totalitems,
    options?.expandedstate,
    options?.windowoverscan,
    usewindowing
  ]);
  (0,external_wp_element_namespaceobject.uselayouteffect)(() => {
    if (!usewindowing) {
      return;
    }
    const scrollcontainer = (0,external_wp_dom_namespaceobject.getscrollcontainer)(elementref.current);
    const handlekeydown = (event) => {
      switch (event.keycode) {
        case external_wp_keycodes_namespaceobject.home: {
          return scrollcontainer?.scrollto({ top: 0 });
        }
        case external_wp_keycodes_namespaceobject.end: {
          return scrollcontainer?.scrollto({
            top: totalitems * itemheight
          });
        }
        case external_wp_keycodes_namespaceobject.pageup: {
          return scrollcontainer?.scrollto({
            top: scrollcontainer.scrolltop - fixedlistwindow.visibleitems * itemheight
          });
        }
        case external_wp_keycodes_namespaceobject.pagedown: {
          return scrollcontainer?.scrollto({
            top: scrollcontainer.scrolltop + fixedlistwindow.visibleitems * itemheight
          });
        }
      }
    };
    scrollcontainer?.ownerdocument?.defaultview?.addeventlistener(
      "keydown",
      handlekeydown
    );
    return () => {
      scrollcontainer?.ownerdocument?.defaultview?.removeeventlistener(
        "keydown",
        handlekeydown
      );
    };
  }, [
    totalitems,
    itemheight,
    elementref,
    fixedlistwindow.visibleitems,
    usewindowing,
    options?.expandedstate
  ]);
  return [fixedlistwindow, setfixedlistwindow];
}


;// ./node_modules/@wordpress/compose/build-module/hooks/use-observable-value/index.js

function useobservablevalue(map, name) {
  const [subscribe, getvalue] = (0,external_wp_element_namespaceobject.usememo)(
    () => [
      (listener) => map.subscribe(name, listener),
      () => map.get(name)
    ],
    [map, name]
  );
  return (0,external_wp_element_namespaceobject.usesyncexternalstore)(subscribe, getvalue, getvalue);
}


;// ./node_modules/@wordpress/compose/build-module/index.js












































})();

(window.wp = window.wp || {}).compose = __webpack_exports__;
/******/ })()
;




