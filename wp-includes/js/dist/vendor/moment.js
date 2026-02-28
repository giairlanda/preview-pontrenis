//! moment.js
//! version : 2.30.1
//! authors : tim wood, iskren chernev, moment.js contributors
//! license : mit
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookcallback;

    function hooks() {
        return hookcallback.apply(null, arguments);
    }

    // this is done to register the method called with moment()
    // without creating circular dependencies.
    function sethookcallback(callback) {
        hookcallback = callback;
    }

    function isarray(input) {
        return (
            input instanceof array ||
            object.prototype.tostring.call(input) === '[object array]'
        );
    }

    function isobject(input) {
        // ie8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            object.prototype.tostring.call(input) === '[object object]'
        );
    }

    function hasownprop(a, b) {
        return object.prototype.hasownproperty.call(a, b);
    }

    function isobjectempty(obj) {
        if (object.getownpropertynames) {
            return object.getownpropertynames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasownprop(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isundefined(input) {
        return input === void 0;
    }

    function isnumber(input) {
        return (
            typeof input === 'number' ||
            object.prototype.tostring.call(input) === '[object number]'
        );
    }

    function isdate(input) {
        return (
            input instanceof date ||
            object.prototype.tostring.call(input) === '[object date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i,
            arrlen = arr.length;
        for (i = 0; i < arrlen; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasownprop(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasownprop(b, 'tostring')) {
            a.tostring = b.tostring;
        }

        if (hasownprop(b, 'valueof')) {
            a.valueof = b.valueof;
        }

        return a;
    }

    function createutc(input, format, locale, strict) {
        return createlocalorutc(input, format, locale, strict, true).utc();
    }

    function defaultparsingflags() {
        // we need to deep clone this object.
        return {
            empty: false,
            unusedtokens: [],
            unusedinput: [],
            overflow: -2,
            charsleftover: 0,
            nullinput: false,
            invalidera: null,
            invalidmonth: null,
            invalidformat: false,
            userinvalidated: false,
            iso: false,
            parseddateparts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdaymismatch: false,
        };
    }

    function getparsingflags(m) {
        if (m._pf == null) {
            m._pf = defaultparsingflags();
        }
        return m._pf;
    }

    var some;
    if (array.prototype.some) {
        some = array.prototype.some;
    } else {
        some = function (fun) {
            var t = object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isvalid(m) {
        var flags = null,
            parsedparts = false,
            isnowvalid = m._d && !isnan(m._d.gettime());
        if (isnowvalid) {
            flags = getparsingflags(m);
            parsedparts = some.call(flags.parseddateparts, function (i) {
                return i != null;
            });
            isnowvalid =
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidera &&
                !flags.invalidmonth &&
                !flags.invalidweekday &&
                !flags.weekdaymismatch &&
                !flags.nullinput &&
                !flags.invalidformat &&
                !flags.userinvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedparts));
            if (m._strict) {
                isnowvalid =
                    isnowvalid &&
                    flags.charsleftover === 0 &&
                    flags.unusedtokens.length === 0 &&
                    flags.bighour === undefined;
            }
        }
        if (object.isfrozen == null || !object.isfrozen(m)) {
            m._isvalid = isnowvalid;
        } else {
            return isnowvalid;
        }
        return m._isvalid;
    }

    function createinvalid(flags) {
        var m = createutc(nan);
        if (flags != null) {
            extend(getparsingflags(m), flags);
        } else {
            getparsingflags(m).userinvalidated = true;
        }

        return m;
    }

    // plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentproperties = (hooks.momentproperties = []),
        updateinprogress = false;

    function copyconfig(to, from) {
        var i,
            prop,
            val,
            momentpropertieslen = momentproperties.length;

        if (!isundefined(from._isamomentobject)) {
            to._isamomentobject = from._isamomentobject;
        }
        if (!isundefined(from._i)) {
            to._i = from._i;
        }
        if (!isundefined(from._f)) {
            to._f = from._f;
        }
        if (!isundefined(from._l)) {
            to._l = from._l;
        }
        if (!isundefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isundefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isundefined(from._isutc)) {
            to._isutc = from._isutc;
        }
        if (!isundefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isundefined(from._pf)) {
            to._pf = getparsingflags(from);
        }
        if (!isundefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentpropertieslen > 0) {
            for (i = 0; i < momentpropertieslen; i++) {
                prop = momentproperties[i];
                val = from[prop];
                if (!isundefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // moment prototype object
    function moment(config) {
        copyconfig(this, config);
        this._d = new date(config._d != null ? config._d.gettime() : nan);
        if (!this.isvalid()) {
            this._d = new date(nan);
        }
        // prevent infinite loop in case updateoffset creates new moment
        // objects.
        if (updateinprogress === false) {
            updateinprogress = true;
            hooks.updateoffset(this);
            updateinprogress = false;
        }
    }

    function ismoment(obj) {
        return (
            obj instanceof moment || (obj != null && obj._isamomentobject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressdeprecationwarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firsttime = true;

        return extend(function () {
            if (hooks.deprecationhandler != null) {
                hooks.deprecationhandler(null, msg);
            }
            if (firsttime) {
                var args = [],
                    arg,
                    i,
                    key,
                    arglen = arguments.length;
                for (i = 0; i < arglen; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasownprop(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\narguments: ' +
                        array.prototype.slice.call(args).join('') +
                        '\n' +
                        new error().stack
                );
                firsttime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecatesimple(name, msg) {
        if (hooks.deprecationhandler != null) {
            hooks.deprecationhandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressdeprecationwarnings = false;
    hooks.deprecationhandler = null;

    function isfunction(input) {
        return (
            (typeof function !== 'undefined' && input instanceof function) ||
            object.prototype.tostring.call(input) === '[object function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasownprop(config, i)) {
                prop = config[i];
                if (isfunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayofmonthordinalparse.
        // todo: remove "ordinalparse" fallback in next major release.
        this._dayofmonthordinalparselenient = new regexp(
            (this._dayofmonthordinalparse.source || this._ordinalparse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeconfigs(parentconfig, childconfig) {
        var res = extend({}, parentconfig),
            prop;
        for (prop in childconfig) {
            if (hasownprop(childconfig, prop)) {
                if (isobject(parentconfig[prop]) && isobject(childconfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentconfig[prop]);
                    extend(res[prop], childconfig[prop]);
                } else if (childconfig[prop] != null) {
                    res[prop] = childconfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentconfig) {
            if (
                hasownprop(parentconfig, prop) &&
                !hasownprop(childconfig, prop) &&
                isobject(parentconfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (object.keys) {
        keys = object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasownprop(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultcalendar = {
        sameday: '[today at] lt',
        nextday: '[tomorrow at] lt',
        nextweek: 'dddd [at] lt',
        lastday: '[yesterday at] lt',
        lastweek: '[last] dddd [at] lt',
        sameelse: 'l',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameelse'];
        return isfunction(output) ? output.call(mom, now) : output;
    }

    function zerofill(number, targetlength, forcesign) {
        var absnumber = '' + math.abs(number),
            zerostofill = targetlength - absnumber.length,
            sign = number >= 0;
        return (
            (sign ? (forcesign ? '+' : '') : '-') +
            math.pow(10, math.max(0, zerostofill)).tostring().substr(1) +
            absnumber
        );
    }

    var formattingtokens =
            /(\[[^\[]*\])|(\\)?([hh]mm(ss)?|mo|mm?m?m?|do|dddo|dd?d?d?|ddd?d?|do?|w[o|w]?|w[o|w]?|qo?|n{1,5}|yyyyyy|yyyyy|yyyy|yy|y{2,4}|yo?|gg(ggg?)?|gg(ggg?)?|e|e|a|a|hh?|hh?|kk?|mm?|ss?|s{1,9}|x|x|zz?|zz?|.)/g,
        localformattingtokens = /(\[[^\[]*\])|(\\)?(lts|lt|ll?l?l?|l{1,4})/g,
        formatfunctions = {},
        formattokenfunctions = {};

    // token:    'm'
    // padded:   ['mm', 2]
    // ordinal:  'mo'
    // callback: function () { this.month() + 1 }
    function addformattoken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formattokenfunctions[token] = func;
        }
        if (padded) {
            formattokenfunctions[padded[0]] = function () {
                return zerofill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formattokenfunctions[ordinal] = function () {
                return this.localedata().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeformattingtokens(input) {
        if (input.match(/\[[\s\s]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeformatfunction(format) {
        var array = format.match(formattingtokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formattokenfunctions[array[i]]) {
                array[i] = formattokenfunctions[array[i]];
            } else {
                array[i] = removeformattingtokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isfunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatmoment(m, format) {
        if (!m.isvalid()) {
            return m.localedata().invaliddate();
        }

        format = expandformat(format, m.localedata());
        formatfunctions[format] =
            formatfunctions[format] || makeformatfunction(format);

        return formatfunctions[format](m);
    }

    function expandformat(format, locale) {
        var i = 5;

        function replacelongdateformattokens(input) {
            return locale.longdateformat(input) || input;
        }

        localformattingtokens.lastindex = 0;
        while (i >= 0 && localformattingtokens.test(format)) {
            format = format.replace(
                localformattingtokens,
                replacelongdateformattokens
            );
            localformattingtokens.lastindex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultlongdateformat = {
        lts: 'h:mm:ss a',
        lt: 'h:mm a',
        l: 'mm/dd/yyyy',
        ll: 'mmmm d, yyyy',
        lll: 'mmmm d, yyyy h:mm a',
        llll: 'dddd, mmmm d, yyyy h:mm a',
    };

    function longdateformat(key) {
        var format = this._longdateformat[key],
            formatupper = this._longdateformat[key.touppercase()];

        if (format || !formatupper) {
            return format;
        }

        this._longdateformat[key] = formatupper
            .match(formattingtokens)
            .map(function (tok) {
                if (
                    tok === 'mmmm' ||
                    tok === 'mm' ||
                    tok === 'dd' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longdateformat[key];
    }

    var defaultinvaliddate = 'invalid date';

    function invaliddate() {
        return this._invaliddate;
    }

    var defaultordinal = '%d',
        defaultdayofmonthordinalparse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultrelativetime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        m: 'a month',
        mm: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativetime(number, withoutsuffix, string, isfuture) {
        var output = this._relativetime[string];
        return isfunction(output)
            ? output(number, withoutsuffix, string, isfuture)
            : output.replace(/%d/i, number);
    }

    function pastfuture(diff, output) {
        var format = this._relativetime[diff > 0 ? 'future' : 'past'];
        return isfunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {
        d: 'date',
        dates: 'date',
        date: 'date',
        d: 'day',
        days: 'day',
        day: 'day',
        e: 'weekday',
        weekdays: 'weekday',
        weekday: 'weekday',
        e: 'isoweekday',
        isoweekdays: 'isoweekday',
        isoweekday: 'isoweekday',
        ddd: 'dayofyear',
        dayofyears: 'dayofyear',
        dayofyear: 'dayofyear',
        h: 'hour',
        hours: 'hour',
        hour: 'hour',
        ms: 'millisecond',
        milliseconds: 'millisecond',
        millisecond: 'millisecond',
        m: 'minute',
        minutes: 'minute',
        minute: 'minute',
        m: 'month',
        months: 'month',
        month: 'month',
        q: 'quarter',
        quarters: 'quarter',
        quarter: 'quarter',
        s: 'second',
        seconds: 'second',
        second: 'second',
        gg: 'weekyear',
        weekyears: 'weekyear',
        weekyear: 'weekyear',
        gg: 'isoweekyear',
        isoweekyears: 'isoweekyear',
        isoweekyear: 'isoweekyear',
        w: 'week',
        weeks: 'week',
        week: 'week',
        w: 'isoweek',
        isoweeks: 'isoweek',
        isoweek: 'isoweek',
        y: 'year',
        years: 'year',
        year: 'year',
    };

    function normalizeunits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.tolowercase()]
            : undefined;
    }

    function normalizeobjectunits(inputobject) {
        var normalizedinput = {},
            normalizedprop,
            prop;

        for (prop in inputobject) {
            if (hasownprop(inputobject, prop)) {
                normalizedprop = normalizeunits(prop);
                if (normalizedprop) {
                    normalizedinput[normalizedprop] = inputobject[prop];
                }
            }
        }

        return normalizedinput;
    }

    var priorities = {
        date: 9,
        day: 11,
        weekday: 11,
        isoweekday: 11,
        dayofyear: 4,
        hour: 13,
        millisecond: 16,
        minute: 14,
        month: 8,
        quarter: 7,
        second: 15,
        weekyear: 1,
        isoweekyear: 1,
        week: 5,
        isoweek: 5,
        year: 1,
    };

    function getprioritizedunits(unitsobj) {
        var units = [],
            u;
        for (u in unitsobj) {
            if (hasownprop(unitsobj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchunsigned = /\d+/, //       0 - inf
        matchsigned = /[+-]?\d+/, //    -inf - inf
        matchoffset = /z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or z
        matchshortoffset = /z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or z
        matchtimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchword =
            /[0-9]{0,256}['a-z\u00a0-\u05ff\u0700-\ud7ff\uf900-\ufdcf\ufdf0-\uff07\uff10-\uffef]{1,256}|[\u0600-\u06ff\/]{1,256}(\s*?[\u0600-\u06ff]{1,256}){1,2}/i,
        match1to2noleadingzero = /^[1-9]\d?/, //         1-99
        match1to2haszero = /^([1-9]\d|\d)/, //           0-99
        regexes;

    regexes = {};

    function addregextoken(token, regex, strictregex) {
        regexes[token] = isfunction(regex)
            ? regex
            : function (isstrict, localedata) {
                  return isstrict && strictregex ? strictregex : regex;
              };
    }

    function getparseregexfortoken(token, config) {
        if (!hasownprop(regexes, token)) {
            return new regexp(unescapeformat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeformat(s) {
        return regexescape(
            s
                .replace('\\', '')
                .replace(
                    /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
                    function (matched, p1, p2, p3, p4) {
                        return p1 || p2 || p3 || p4;
                    }
                )
        );
    }

    function regexescape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    function absfloor(number) {
        if (number < 0) {
            // -0 -> 0
            return math.ceil(number) || 0;
        } else {
            return math.floor(number);
        }
    }

    function toint(argumentforcoercion) {
        var coercednumber = +argumentforcoercion,
            value = 0;

        if (coercednumber !== 0 && isfinite(coercednumber)) {
            value = absfloor(coercednumber);
        }

        return value;
    }

    var tokens = {};

    function addparsetoken(token, callback) {
        var i,
            func = callback,
            tokenlen;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isnumber(callback)) {
            func = function (input, array) {
                array[callback] = toint(input);
            };
        }
        tokenlen = token.length;
        for (i = 0; i < tokenlen; i++) {
            tokens[token[i]] = func;
        }
    }

    function addweekparsetoken(token, callback) {
        addparsetoken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addtimetoarrayfromtoken(token, input, config) {
        if (input != null && hasownprop(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    function isleapyear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    var year = 0,
        month = 1,
        date = 2,
        hour = 3,
        minute = 4,
        second = 5,
        millisecond = 6,
        week = 7,
        weekday = 8;

    // formatting

    addformattoken('y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zerofill(y, 4) : '+' + y;
    });

    addformattoken(0, ['yy', 2], 0, function () {
        return this.year() % 100;
    });

    addformattoken(0, ['yyyy', 4], 0, 'year');
    addformattoken(0, ['yyyyy', 5], 0, 'year');
    addformattoken(0, ['yyyyyy', 6, true], 0, 'year');

    // parsing

    addregextoken('y', matchsigned);
    addregextoken('yy', match1to2, match2);
    addregextoken('yyyy', match1to4, match4);
    addregextoken('yyyyy', match1to6, match6);
    addregextoken('yyyyyy', match1to6, match6);

    addparsetoken(['yyyyy', 'yyyyyy'], year);
    addparsetoken('yyyy', function (input, array) {
        array[year] =
            input.length === 2 ? hooks.parsetwodigityear(input) : toint(input);
    });
    addparsetoken('yy', function (input, array) {
        array[year] = hooks.parsetwodigityear(input);
    });
    addparsetoken('y', function (input, array) {
        array[year] = parseint(input, 10);
    });

    // helpers

    function daysinyear(year) {
        return isleapyear(year) ? 366 : 365;
    }

    // hooks

    hooks.parsetwodigityear = function (input) {
        return toint(input) + (toint(input) > 68 ? 1900 : 2000);
    };

    // moments

    var getsetyear = makegetset('fullyear', true);

    function getisleapyear() {
        return isleapyear(this.year());
    }

    function makegetset(unit, keeptime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateoffset(this, keeptime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        if (!mom.isvalid()) {
            return nan;
        }

        var d = mom._d,
            isutc = mom._isutc;

        switch (unit) {
            case 'milliseconds':
                return isutc ? d.getutcmilliseconds() : d.getmilliseconds();
            case 'seconds':
                return isutc ? d.getutcseconds() : d.getseconds();
            case 'minutes':
                return isutc ? d.getutcminutes() : d.getminutes();
            case 'hours':
                return isutc ? d.getutchours() : d.gethours();
            case 'date':
                return isutc ? d.getutcdate() : d.getdate();
            case 'day':
                return isutc ? d.getutcday() : d.getday();
            case 'month':
                return isutc ? d.getutcmonth() : d.getmonth();
            case 'fullyear':
                return isutc ? d.getutcfullyear() : d.getfullyear();
            default:
                return nan; // just in case
        }
    }

    function set$1(mom, unit, value) {
        var d, isutc, year, month, date;

        if (!mom.isvalid() || isnan(value)) {
            return;
        }

        d = mom._d;
        isutc = mom._isutc;

        switch (unit) {
            case 'milliseconds':
                return void (isutc
                    ? d.setutcmilliseconds(value)
                    : d.setmilliseconds(value));
            case 'seconds':
                return void (isutc ? d.setutcseconds(value) : d.setseconds(value));
            case 'minutes':
                return void (isutc ? d.setutcminutes(value) : d.setminutes(value));
            case 'hours':
                return void (isutc ? d.setutchours(value) : d.sethours(value));
            case 'date':
                return void (isutc ? d.setutcdate(value) : d.setdate(value));
            // case 'day': // not real
            //    return void (isutc ? d.setutcday(value) : d.setday(value));
            // case 'month': // not used because we need to pass two variables
            //     return void (isutc ? d.setutcmonth(value) : d.setmonth(value));
            case 'fullyear':
                break; // see below ...
            default:
                return; // just in case
        }

        year = value;
        month = mom.month();
        date = mom.date();
        date = date === 29 && month === 1 && !isleapyear(year) ? 28 : date;
        void (isutc
            ? d.setutcfullyear(year, month, date)
            : d.setfullyear(year, month, date));
    }

    // moments

    function stringget(units) {
        units = normalizeunits(units);
        if (isfunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringset(units, value) {
        if (typeof units === 'object') {
            units = normalizeobjectunits(units);
            var prioritized = getprioritizedunits(units),
                i,
                prioritizedlen = prioritized.length;
            for (i = 0; i < prioritizedlen; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeunits(units);
            if (isfunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexof;

    if (array.prototype.indexof) {
        indexof = array.prototype.indexof;
    } else {
        indexof = function (o) {
            // i know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysinmonth(year, month) {
        if (isnan(year) || isnan(month)) {
            return nan;
        }
        var modmonth = mod(month, 12);
        year += (month - modmonth) / 12;
        return modmonth === 1
            ? isleapyear(year)
                ? 29
                : 28
            : 31 - ((modmonth % 7) % 2);
    }

    // formatting

    addformattoken('m', ['mm', 2], 'mo', function () {
        return this.month() + 1;
    });

    addformattoken('mmm', 0, 0, function (format) {
        return this.localedata().monthsshort(this, format);
    });

    addformattoken('mmmm', 0, 0, function (format) {
        return this.localedata().months(this, format);
    });

    // parsing

    addregextoken('m', match1to2, match1to2noleadingzero);
    addregextoken('mm', match1to2, match2);
    addregextoken('mmm', function (isstrict, locale) {
        return locale.monthsshortregex(isstrict);
    });
    addregextoken('mmmm', function (isstrict, locale) {
        return locale.monthsregex(isstrict);
    });

    addparsetoken(['m', 'mm'], function (input, array) {
        array[month] = toint(input) - 1;
    });

    addparsetoken(['mmm', 'mmmm'], function (input, array, config, token) {
        var month = config._locale.monthsparse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[month] = month;
        } else {
            getparsingflags(config).invalidmonth = input;
        }
    });

    // locales

    var defaultlocalemonths =
            'january_february_march_april_may_june_july_august_september_october_november_december'.split(
                '_'
            ),
        defaultlocalemonthsshort =
            'jan_feb_mar_apr_may_jun_jul_aug_sep_oct_nov_dec'.split('_'),
        months_in_format = /d[od]?(\[[^\[\]]*\]|\s)+mmmm?/,
        defaultmonthsshortregex = matchword,
        defaultmonthsregex = matchword;

    function localemonths(m, format) {
        if (!m) {
            return isarray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isarray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isformat || months_in_format).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localemonthsshort(m, format) {
        if (!m) {
            return isarray(this._monthsshort)
                ? this._monthsshort
                : this._monthsshort['standalone'];
        }
        return isarray(this._monthsshort)
            ? this._monthsshort[m.month()]
            : this._monthsshort[
                  months_in_format.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handlestrictparse(monthname, format, strict) {
        var i,
            ii,
            mom,
            llc = monthname.tolocalelowercase();
        if (!this._monthsparse) {
            // this is not used
            this._monthsparse = [];
            this._longmonthsparse = [];
            this._shortmonthsparse = [];
            for (i = 0; i < 12; ++i) {
                mom = createutc([2000, i]);
                this._shortmonthsparse[i] = this.monthsshort(
                    mom,
                    ''
                ).tolocalelowercase();
                this._longmonthsparse[i] = this.months(mom, '').tolocalelowercase();
            }
        }

        if (strict) {
            if (format === 'mmm') {
                ii = indexof.call(this._shortmonthsparse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexof.call(this._longmonthsparse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'mmm') {
                ii = indexof.call(this._shortmonthsparse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexof.call(this._longmonthsparse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexof.call(this._longmonthsparse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexof.call(this._shortmonthsparse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localemonthsparse(monthname, format, strict) {
        var i, mom, regex;

        if (this._monthsparseexact) {
            return handlestrictparse.call(this, monthname, format, strict);
        }

        if (!this._monthsparse) {
            this._monthsparse = [];
            this._longmonthsparse = [];
            this._shortmonthsparse = [];
        }

        // todo: add sorting
        // sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computemonthsparse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createutc([2000, i]);
            if (strict && !this._longmonthsparse[i]) {
                this._longmonthsparse[i] = new regexp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortmonthsparse[i] = new regexp(
                    '^' + this.monthsshort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsparse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsshort(mom, '');
                this._monthsparse[i] = new regexp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'mmmm' &&
                this._longmonthsparse[i].test(monthname)
            ) {
                return i;
            } else if (
                strict &&
                format === 'mmm' &&
                this._shortmonthsparse[i].test(monthname)
            ) {
                return i;
            } else if (!strict && this._monthsparse[i].test(monthname)) {
                return i;
            }
        }
    }

    // moments

    function setmonth(mom, value) {
        if (!mom.isvalid()) {
            // no op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toint(value);
            } else {
                value = mom.localedata().monthsparse(value);
                // todo: another silent failure?
                if (!isnumber(value)) {
                    return mom;
                }
            }
        }

        var month = value,
            date = mom.date();

        date = date < 29 ? date : math.min(date, daysinmonth(mom.year(), month));
        void (mom._isutc
            ? mom._d.setutcmonth(month, date)
            : mom._d.setmonth(month, date));
        return mom;
    }

    function getsetmonth(value) {
        if (value != null) {
            setmonth(this, value);
            hooks.updateoffset(this, true);
            return this;
        } else {
            return get(this, 'month');
        }
    }

    function getdaysinmonth() {
        return daysinmonth(this.year(), this.month());
    }

    function monthsshortregex(isstrict) {
        if (this._monthsparseexact) {
            if (!hasownprop(this, '_monthsregex')) {
                computemonthsparse.call(this);
            }
            if (isstrict) {
                return this._monthsshortstrictregex;
            } else {
                return this._monthsshortregex;
            }
        } else {
            if (!hasownprop(this, '_monthsshortregex')) {
                this._monthsshortregex = defaultmonthsshortregex;
            }
            return this._monthsshortstrictregex && isstrict
                ? this._monthsshortstrictregex
                : this._monthsshortregex;
        }
    }

    function monthsregex(isstrict) {
        if (this._monthsparseexact) {
            if (!hasownprop(this, '_monthsregex')) {
                computemonthsparse.call(this);
            }
            if (isstrict) {
                return this._monthsstrictregex;
            } else {
                return this._monthsregex;
            }
        } else {
            if (!hasownprop(this, '_monthsregex')) {
                this._monthsregex = defaultmonthsregex;
            }
            return this._monthsstrictregex && isstrict
                ? this._monthsstrictregex
                : this._monthsregex;
        }
    }

    function computemonthsparse() {
        function cmplenrev(a, b) {
            return b.length - a.length;
        }

        var shortpieces = [],
            longpieces = [],
            mixedpieces = [],
            i,
            mom,
            shortp,
            longp;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createutc([2000, i]);
            shortp = regexescape(this.monthsshort(mom, ''));
            longp = regexescape(this.months(mom, ''));
            shortpieces.push(shortp);
            longpieces.push(longp);
            mixedpieces.push(longp);
            mixedpieces.push(shortp);
        }
        // sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortpieces.sort(cmplenrev);
        longpieces.sort(cmplenrev);
        mixedpieces.sort(cmplenrev);

        this._monthsregex = new regexp('^(' + mixedpieces.join('|') + ')', 'i');
        this._monthsshortregex = this._monthsregex;
        this._monthsstrictregex = new regexp(
            '^(' + longpieces.join('|') + ')',
            'i'
        );
        this._monthsshortstrictregex = new regexp(
            '^(' + shortpieces.join('|') + ')',
            'i'
        );
    }

    function createdate(y, m, d, h, m, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new date(y + 400, m, d, h, m, s, ms);
            if (isfinite(date.getfullyear())) {
                date.setfullyear(y);
            }
        } else {
            date = new date(y, m, d, h, m, s, ms);
        }

        return date;
    }

    function createutcdate(y) {
        var date, args;
        // the date.utc function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new date(date.utc.apply(null, args));
            if (isfinite(date.getutcfullyear())) {
                date.setutcfullyear(y);
            }
        } else {
            date = new date(date.utc.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstweekoffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createutcdate(year, 0, fwd).getutcday() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/iso_week_date#calculating_a_date_given_the_year.2c_week_number_and_weekday
    function dayofyearfromweeks(year, week, weekday, dow, doy) {
        var localweekday = (7 + weekday - dow) % 7,
            weekoffset = firstweekoffset(year, dow, doy),
            dayofyear = 1 + 7 * (week - 1) + localweekday + weekoffset,
            resyear,
            resdayofyear;

        if (dayofyear <= 0) {
            resyear = year - 1;
            resdayofyear = daysinyear(resyear) + dayofyear;
        } else if (dayofyear > daysinyear(year)) {
            resyear = year + 1;
            resdayofyear = dayofyear - daysinyear(year);
        } else {
            resyear = year;
            resdayofyear = dayofyear;
        }

        return {
            year: resyear,
            dayofyear: resdayofyear,
        };
    }

    function weekofyear(mom, dow, doy) {
        var weekoffset = firstweekoffset(mom.year(), dow, doy),
            week = math.floor((mom.dayofyear() - weekoffset - 1) / 7) + 1,
            resweek,
            resyear;

        if (week < 1) {
            resyear = mom.year() - 1;
            resweek = week + weeksinyear(resyear, dow, doy);
        } else if (week > weeksinyear(mom.year(), dow, doy)) {
            resweek = week - weeksinyear(mom.year(), dow, doy);
            resyear = mom.year() + 1;
        } else {
            resyear = mom.year();
            resweek = week;
        }

        return {
            week: resweek,
            year: resyear,
        };
    }

    function weeksinyear(year, dow, doy) {
        var weekoffset = firstweekoffset(year, dow, doy),
            weekoffsetnext = firstweekoffset(year + 1, dow, doy);
        return (daysinyear(year) - weekoffset + weekoffsetnext) / 7;
    }

    // formatting

    addformattoken('w', ['ww', 2], 'wo', 'week');
    addformattoken('w', ['ww', 2], 'wo', 'isoweek');

    // parsing

    addregextoken('w', match1to2, match1to2noleadingzero);
    addregextoken('ww', match1to2, match2);
    addregextoken('w', match1to2, match1to2noleadingzero);
    addregextoken('ww', match1to2, match2);

    addweekparsetoken(
        ['w', 'ww', 'w', 'ww'],
        function (input, week, config, token) {
            week[token.substr(0, 1)] = toint(input);
        }
    );

    // helpers

    // locales

    function localeweek(mom) {
        return weekofyear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultlocaleweek = {
        dow: 0, // sunday is the first day of the week.
        doy: 6, // the week that contains jan 6th is the first week of the year.
    };

    function localefirstdayofweek() {
        return this._week.dow;
    }

    function localefirstdayofyear() {
        return this._week.doy;
    }

    // moments

    function getsetweek(input) {
        var week = this.localedata().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getsetisoweek(input) {
        var week = weekofyear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // formatting

    addformattoken('d', 0, 'do', 'day');

    addformattoken('dd', 0, 0, function (format) {
        return this.localedata().weekdaysmin(this, format);
    });

    addformattoken('ddd', 0, 0, function (format) {
        return this.localedata().weekdaysshort(this, format);
    });

    addformattoken('dddd', 0, 0, function (format) {
        return this.localedata().weekdays(this, format);
    });

    addformattoken('e', 0, 0, 'weekday');
    addformattoken('e', 0, 0, 'isoweekday');

    // parsing

    addregextoken('d', match1to2);
    addregextoken('e', match1to2);
    addregextoken('e', match1to2);
    addregextoken('dd', function (isstrict, locale) {
        return locale.weekdaysminregex(isstrict);
    });
    addregextoken('ddd', function (isstrict, locale) {
        return locale.weekdaysshortregex(isstrict);
    });
    addregextoken('dddd', function (isstrict, locale) {
        return locale.weekdaysregex(isstrict);
    });

    addweekparsetoken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysparse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getparsingflags(config).invalidweekday = input;
        }
    });

    addweekparsetoken(['d', 'e', 'e'], function (input, week, config, token) {
        week[token] = toint(input);
    });

    // helpers

    function parseweekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isnan(input)) {
            return parseint(input, 10);
        }

        input = locale.weekdaysparse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseisoweekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysparse(input) % 7 || 7;
        }
        return isnan(input) ? null : input;
    }

    // locales
    function shiftweekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultlocaleweekdays =
            'sunday_monday_tuesday_wednesday_thursday_friday_saturday'.split('_'),
        defaultlocaleweekdaysshort = 'sun_mon_tue_wed_thu_fri_sat'.split('_'),
        defaultlocaleweekdaysmin = 'su_mo_tu_we_th_fr_sa'.split('_'),
        defaultweekdaysregex = matchword,
        defaultweekdaysshortregex = matchword,
        defaultweekdaysminregex = matchword;

    function localeweekdays(m, format) {
        var weekdays = isarray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isformat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftweekdays(weekdays, this._week.dow)
            : m
              ? weekdays[m.day()]
              : weekdays;
    }

    function localeweekdaysshort(m) {
        return m === true
            ? shiftweekdays(this._weekdaysshort, this._week.dow)
            : m
              ? this._weekdaysshort[m.day()]
              : this._weekdaysshort;
    }

    function localeweekdaysmin(m) {
        return m === true
            ? shiftweekdays(this._weekdaysmin, this._week.dow)
            : m
              ? this._weekdaysmin[m.day()]
              : this._weekdaysmin;
    }

    function handlestrictparse$1(weekdayname, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayname.tolocalelowercase();
        if (!this._weekdaysparse) {
            this._weekdaysparse = [];
            this._shortweekdaysparse = [];
            this._minweekdaysparse = [];

            for (i = 0; i < 7; ++i) {
                mom = createutc([2000, 1]).day(i);
                this._minweekdaysparse[i] = this.weekdaysmin(
                    mom,
                    ''
                ).tolocalelowercase();
                this._shortweekdaysparse[i] = this.weekdaysshort(
                    mom,
                    ''
                ).tolocalelowercase();
                this._weekdaysparse[i] = this.weekdays(mom, '').tolocalelowercase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexof.call(this._weekdaysparse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexof.call(this._shortweekdaysparse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexof.call(this._minweekdaysparse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexof.call(this._weekdaysparse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexof.call(this._shortweekdaysparse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexof.call(this._minweekdaysparse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexof.call(this._shortweekdaysparse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexof.call(this._weekdaysparse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexof.call(this._minweekdaysparse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexof.call(this._minweekdaysparse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexof.call(this._weekdaysparse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexof.call(this._shortweekdaysparse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeweekdaysparse(weekdayname, format, strict) {
        var i, mom, regex;

        if (this._weekdaysparseexact) {
            return handlestrictparse$1.call(this, weekdayname, format, strict);
        }

        if (!this._weekdaysparse) {
            this._weekdaysparse = [];
            this._minweekdaysparse = [];
            this._shortweekdaysparse = [];
            this._fullweekdaysparse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createutc([2000, 1]).day(i);
            if (strict && !this._fullweekdaysparse[i]) {
                this._fullweekdaysparse[i] = new regexp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortweekdaysparse[i] = new regexp(
                    '^' + this.weekdaysshort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minweekdaysparse[i] = new regexp(
                    '^' + this.weekdaysmin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysparse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysshort(mom, '') +
                    '|^' +
                    this.weekdaysmin(mom, '');
                this._weekdaysparse[i] = new regexp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullweekdaysparse[i].test(weekdayname)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortweekdaysparse[i].test(weekdayname)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minweekdaysparse[i].test(weekdayname)
            ) {
                return i;
            } else if (!strict && this._weekdaysparse[i].test(weekdayname)) {
                return i;
            }
        }
    }

    // moments

    function getsetdayofweek(input) {
        if (!this.isvalid()) {
            return input != null ? this : nan;
        }

        var day = get(this, 'day');
        if (input != null) {
            input = parseweekday(input, this.localedata());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getsetlocaledayofweek(input) {
        if (!this.isvalid()) {
            return input != null ? this : nan;
        }
        var weekday = (this.day() + 7 - this.localedata()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getsetisodayofweek(input) {
        if (!this.isvalid()) {
            return input != null ? this : nan;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseisoweekday(input, this.localedata());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysregex(isstrict) {
        if (this._weekdaysparseexact) {
            if (!hasownprop(this, '_weekdaysregex')) {
                computeweekdaysparse.call(this);
            }
            if (isstrict) {
                return this._weekdaysstrictregex;
            } else {
                return this._weekdaysregex;
            }
        } else {
            if (!hasownprop(this, '_weekdaysregex')) {
                this._weekdaysregex = defaultweekdaysregex;
            }
            return this._weekdaysstrictregex && isstrict
                ? this._weekdaysstrictregex
                : this._weekdaysregex;
        }
    }

    function weekdaysshortregex(isstrict) {
        if (this._weekdaysparseexact) {
            if (!hasownprop(this, '_weekdaysregex')) {
                computeweekdaysparse.call(this);
            }
            if (isstrict) {
                return this._weekdaysshortstrictregex;
            } else {
                return this._weekdaysshortregex;
            }
        } else {
            if (!hasownprop(this, '_weekdaysshortregex')) {
                this._weekdaysshortregex = defaultweekdaysshortregex;
            }
            return this._weekdaysshortstrictregex && isstrict
                ? this._weekdaysshortstrictregex
                : this._weekdaysshortregex;
        }
    }

    function weekdaysminregex(isstrict) {
        if (this._weekdaysparseexact) {
            if (!hasownprop(this, '_weekdaysregex')) {
                computeweekdaysparse.call(this);
            }
            if (isstrict) {
                return this._weekdaysminstrictregex;
            } else {
                return this._weekdaysminregex;
            }
        } else {
            if (!hasownprop(this, '_weekdaysminregex')) {
                this._weekdaysminregex = defaultweekdaysminregex;
            }
            return this._weekdaysminstrictregex && isstrict
                ? this._weekdaysminstrictregex
                : this._weekdaysminregex;
        }
    }

    function computeweekdaysparse() {
        function cmplenrev(a, b) {
            return b.length - a.length;
        }

        var minpieces = [],
            shortpieces = [],
            longpieces = [],
            mixedpieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createutc([2000, 1]).day(i);
            minp = regexescape(this.weekdaysmin(mom, ''));
            shortp = regexescape(this.weekdaysshort(mom, ''));
            longp = regexescape(this.weekdays(mom, ''));
            minpieces.push(minp);
            shortpieces.push(shortp);
            longpieces.push(longp);
            mixedpieces.push(minp);
            mixedpieces.push(shortp);
            mixedpieces.push(longp);
        }
        // sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minpieces.sort(cmplenrev);
        shortpieces.sort(cmplenrev);
        longpieces.sort(cmplenrev);
        mixedpieces.sort(cmplenrev);

        this._weekdaysregex = new regexp('^(' + mixedpieces.join('|') + ')', 'i');
        this._weekdaysshortregex = this._weekdaysregex;
        this._weekdaysminregex = this._weekdaysregex;

        this._weekdaysstrictregex = new regexp(
            '^(' + longpieces.join('|') + ')',
            'i'
        );
        this._weekdaysshortstrictregex = new regexp(
            '^(' + shortpieces.join('|') + ')',
            'i'
        );
        this._weekdaysminstrictregex = new regexp(
            '^(' + minpieces.join('|') + ')',
            'i'
        );
    }

    // formatting

    function hformat() {
        return this.hours() % 12 || 12;
    }

    function kformat() {
        return this.hours() || 24;
    }

    addformattoken('h', ['hh', 2], 0, 'hour');
    addformattoken('h', ['hh', 2], 0, hformat);
    addformattoken('k', ['kk', 2], 0, kformat);

    addformattoken('hmm', 0, 0, function () {
        return '' + hformat.apply(this) + zerofill(this.minutes(), 2);
    });

    addformattoken('hmmss', 0, 0, function () {
        return (
            '' +
            hformat.apply(this) +
            zerofill(this.minutes(), 2) +
            zerofill(this.seconds(), 2)
        );
    });

    addformattoken('hmm', 0, 0, function () {
        return '' + this.hours() + zerofill(this.minutes(), 2);
    });

    addformattoken('hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zerofill(this.minutes(), 2) +
            zerofill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addformattoken(token, 0, 0, function () {
            return this.localedata().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('a', false);

    // parsing

    function matchmeridiem(isstrict, locale) {
        return locale._meridiemparse;
    }

    addregextoken('a', matchmeridiem);
    addregextoken('a', matchmeridiem);
    addregextoken('h', match1to2, match1to2haszero);
    addregextoken('h', match1to2, match1to2noleadingzero);
    addregextoken('k', match1to2, match1to2noleadingzero);
    addregextoken('hh', match1to2, match2);
    addregextoken('hh', match1to2, match2);
    addregextoken('kk', match1to2, match2);

    addregextoken('hmm', match3to4);
    addregextoken('hmmss', match5to6);
    addregextoken('hmm', match3to4);
    addregextoken('hmmss', match5to6);

    addparsetoken(['h', 'hh'], hour);
    addparsetoken(['k', 'kk'], function (input, array, config) {
        var kinput = toint(input);
        array[hour] = kinput === 24 ? 0 : kinput;
    });
    addparsetoken(['a', 'a'], function (input, array, config) {
        config._ispm = config._locale.ispm(input);
        config._meridiem = input;
    });
    addparsetoken(['h', 'hh'], function (input, array, config) {
        array[hour] = toint(input);
        getparsingflags(config).bighour = true;
    });
    addparsetoken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[hour] = toint(input.substr(0, pos));
        array[minute] = toint(input.substr(pos));
        getparsingflags(config).bighour = true;
    });
    addparsetoken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[hour] = toint(input.substr(0, pos1));
        array[minute] = toint(input.substr(pos1, 2));
        array[second] = toint(input.substr(pos2));
        getparsingflags(config).bighour = true;
    });
    addparsetoken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[hour] = toint(input.substr(0, pos));
        array[minute] = toint(input.substr(pos));
    });
    addparsetoken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[hour] = toint(input.substr(0, pos1));
        array[minute] = toint(input.substr(pos1, 2));
        array[second] = toint(input.substr(pos2));
    });

    // locales

    function localeispm(input) {
        // ie8 quirks mode & ie7 standards mode do not allow accessing strings like arrays
        // using charat should be more compatible.
        return (input + '').tolowercase().charat(0) === 'p';
    }

    var defaultlocalemeridiemparse = /[ap]\.?m?\.?/i,
        // setting the hour should keep the time, because the user explicitly
        // specified which hour they want. so trying to maintain the same hour (in
        // a new timezone) makes sense. adding/subtracting hours does not follow
        // this rule.
        getsethour = makegetset('hours', true);

    function localemeridiem(hours, minutes, islower) {
        if (hours > 11) {
            return islower ? 'pm' : 'pm';
        } else {
            return islower ? 'am' : 'am';
        }
    }

    var baseconfig = {
        calendar: defaultcalendar,
        longdateformat: defaultlongdateformat,
        invaliddate: defaultinvaliddate,
        ordinal: defaultordinal,
        dayofmonthordinalparse: defaultdayofmonthordinalparse,
        relativetime: defaultrelativetime,

        months: defaultlocalemonths,
        monthsshort: defaultlocalemonthsshort,

        week: defaultlocaleweek,

        weekdays: defaultlocaleweekdays,
        weekdaysmin: defaultlocaleweekdaysmin,
        weekdaysshort: defaultlocaleweekdaysshort,

        meridiemparse: defaultlocalemeridiemparse,
    };

    // internal storage for locale config files
    var locales = {},
        localefamilies = {},
        globallocale;

    function commonprefix(arr1, arr2) {
        var i,
            minl = math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizelocale(key) {
        return key ? key.tolowercase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooselocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizelocale(names[i]).split('-');
            j = split.length;
            next = normalizelocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadlocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonprefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globallocale;
    }

    function islocalenamesane(name) {
        // prevent names that look like filesystem paths, i.e contain '/' or '\'
        // ensure name is available and function returns boolean
        return !!(name && name.match('^[^/\\\\]*$'));
    }

    function loadlocale(name) {
        var oldlocale = null,
            aliasedrequire;
        // todo: find a better way to register and load all the locales in node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports &&
            islocalenamesane(name)
        ) {
            try {
                oldlocale = globallocale._abbr;
                aliasedrequire = require;
                aliasedrequire('./locale/' + name);
                getsetgloballocale(oldlocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high cpu
                // when trying to find en-us, en_us, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // this function will load locale and then set the global locale.  if
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getsetgloballocale(key, values) {
        var data;
        if (key) {
            if (isundefined(values)) {
                data = getlocale(key);
            } else {
                data = definelocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globallocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'locale ' + key + ' not found. did you forget to load it?'
                    );
                }
            }
        }

        return globallocale._abbr;
    }

    function definelocale(name, config) {
        if (config !== null) {
            var locale,
                parentconfig = baseconfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecatesimple(
                    'definelocaleoverride',
                    'use moment.updatelocale(localename, config) to change ' +
                        'an existing locale. moment.definelocale(localename, ' +
                        'config) should only be used for creating a new locale ' +
                        'see http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentconfig = locales[name]._config;
            } else if (config.parentlocale != null) {
                if (locales[config.parentlocale] != null) {
                    parentconfig = locales[config.parentlocale]._config;
                } else {
                    locale = loadlocale(config.parentlocale);
                    if (locale != null) {
                        parentconfig = locale._config;
                    } else {
                        if (!localefamilies[config.parentlocale]) {
                            localefamilies[config.parentlocale] = [];
                        }
                        localefamilies[config.parentlocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new locale(mergeconfigs(parentconfig, config));

            if (localefamilies[name]) {
                localefamilies[name].foreach(function (x) {
                    definelocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale after all child locales have been
            // created, so we won't end up with the child locale set.
            getsetgloballocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updatelocale(name, config) {
        if (config != null) {
            var locale,
                tmplocale,
                parentconfig = baseconfig;

            if (locales[name] != null && locales[name].parentlocale != null) {
                // update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeconfigs(locales[name]._config, config));
            } else {
                // merge
                tmplocale = loadlocale(name);
                if (tmplocale != null) {
                    parentconfig = tmplocale._config;
                }
                config = mergeconfigs(parentconfig, config);
                if (tmplocale == null) {
                    // updatelocale is called for creating a new locale
                    // set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new locale(config);
                locale.parentlocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getsetgloballocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentlocale != null) {
                    locales[name] = locales[name].parentlocale;
                    if (name === getsetgloballocale()) {
                        getsetgloballocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getlocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globallocale;
        }

        if (!isarray(key)) {
            //short-circuit everything else
            locale = loadlocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooselocale(key);
    }

    function listlocales() {
        return keys(locales);
    }

    function checkoverflow(m) {
        var overflow,
            a = m._a;

        if (a && getparsingflags(m).overflow === -2) {
            overflow =
                a[month] < 0 || a[month] > 11
                    ? month
                    : a[date] < 1 || a[date] > daysinmonth(a[year], a[month])
                      ? date
                      : a[hour] < 0 ||
                          a[hour] > 24 ||
                          (a[hour] === 24 &&
                              (a[minute] !== 0 ||
                                  a[second] !== 0 ||
                                  a[millisecond] !== 0))
                        ? hour
                        : a[minute] < 0 || a[minute] > 59
                          ? minute
                          : a[second] < 0 || a[second] > 59
                            ? second
                            : a[millisecond] < 0 || a[millisecond] > 999
                              ? millisecond
                              : -1;

            if (
                getparsingflags(m)._overflowdayofyear &&
                (overflow < year || overflow > date)
            ) {
                overflow = date;
            }
            if (getparsingflags(m)._overflowweeks && overflow === -1) {
                overflow = week;
            }
            if (getparsingflags(m)._overflowweekday && overflow === -1) {
                overflow = weekday;
            }

            getparsingflags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-w00 or 0000-w00-0 + t + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedisoregex =
            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|w\d\d-\d|w\d\d|\d\d\d|\d\d))(?:(t| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*z)?)?$/,
        basicisoregex =
            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|w\d\d\d|w\d\d|\d\d\d|\d\d|))(?:(t| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*z)?)?$/,
        tzregex = /z|[+-]\d\d(?::?\d\d)?/,
        isodates = [
            ['yyyyyy-mm-dd', /[+-]\d{6}-\d\d-\d\d/],
            ['yyyy-mm-dd', /\d{4}-\d\d-\d\d/],
            ['gggg-[w]ww-e', /\d{4}-w\d\d-\d/],
            ['gggg-[w]ww', /\d{4}-w\d\d/, false],
            ['yyyy-ddd', /\d{4}-\d{3}/],
            ['yyyy-mm', /\d{4}-\d\d/, false],
            ['yyyyyymmdd', /[+-]\d{10}/],
            ['yyyymmdd', /\d{8}/],
            ['gggg[w]wwe', /\d{4}w\d{3}/],
            ['gggg[w]ww', /\d{4}w\d{2}/, false],
            ['yyyyddd', /\d{7}/],
            ['yyyymm', /\d{6}/, false],
            ['yyyy', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isotimes = [
            ['hh:mm:ss.ssss', /\d\d:\d\d:\d\d\.\d+/],
            ['hh:mm:ss,ssss', /\d\d:\d\d:\d\d,\d+/],
            ['hh:mm:ss', /\d\d:\d\d:\d\d/],
            ['hh:mm', /\d\d:\d\d/],
            ['hhmmss.ssss', /\d\d\d\d\d\d\.\d+/],
            ['hhmmss,ssss', /\d\d\d\d\d\d,\d+/],
            ['hhmmss', /\d\d\d\d\d\d/],
            ['hhmm', /\d\d\d\d/],
            ['hh', /\d\d/],
        ],
        aspnetjsonregex = /^\/?date\((-?\d+)/i,
        // rfc 2822 regex: for details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 =
            /^(?:(mon|tue|wed|thu|fri|sat|sun),?\s)?(\d{1,2})\s(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(ut|gmt|[ecmp][sd]t)|([zz])|([+-]\d{4}))$/,
        obsoffsets = {
            ut: 0,
            gmt: 0,
            edt: -4 * 60,
            est: -5 * 60,
            cdt: -5 * 60,
            cst: -6 * 60,
            mdt: -6 * 60,
            mst: -7 * 60,
            pdt: -7 * 60,
            pst: -8 * 60,
        };

    // date from iso format
    function configfromiso(config) {
        var i,
            l,
            string = config._i,
            match = extendedisoregex.exec(string) || basicisoregex.exec(string),
            allowtime,
            dateformat,
            timeformat,
            tzformat,
            isodateslen = isodates.length,
            isotimeslen = isotimes.length;

        if (match) {
            getparsingflags(config).iso = true;
            for (i = 0, l = isodateslen; i < l; i++) {
                if (isodates[i][1].exec(match[1])) {
                    dateformat = isodates[i][0];
                    allowtime = isodates[i][2] !== false;
                    break;
                }
            }
            if (dateformat == null) {
                config._isvalid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isotimeslen; i < l; i++) {
                    if (isotimes[i][1].exec(match[3])) {
                        // match[2] should be 't' or space
                        timeformat = (match[2] || ' ') + isotimes[i][0];
                        break;
                    }
                }
                if (timeformat == null) {
                    config._isvalid = false;
                    return;
                }
            }
            if (!allowtime && timeformat != null) {
                config._isvalid = false;
                return;
            }
            if (match[4]) {
                if (tzregex.exec(match[4])) {
                    tzformat = 'z';
                } else {
                    config._isvalid = false;
                    return;
                }
            }
            config._f = dateformat + (timeformat || '') + (tzformat || '');
            configfromstringandformat(config);
        } else {
            config._isvalid = false;
        }
    }

    function extractfromrfc2822strings(
        yearstr,
        monthstr,
        daystr,
        hourstr,
        minutestr,
        secondstr
    ) {
        var result = [
            untruncateyear(yearstr),
            defaultlocalemonthsshort.indexof(monthstr),
            parseint(daystr, 10),
            parseint(hourstr, 10),
            parseint(minutestr, 10),
        ];

        if (secondstr) {
            result.push(parseint(secondstr, 10));
        }

        return result;
    }

    function untruncateyear(yearstr) {
        var year = parseint(yearstr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessrfc2822(s) {
        // remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^()]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkweekday(weekdaystr, parsedinput, config) {
        if (weekdaystr) {
            // todo: replace the vanilla js date object with an independent day-of-week check.
            var weekdayprovided = defaultlocaleweekdaysshort.indexof(weekdaystr),
                weekdayactual = new date(
                    parsedinput[0],
                    parsedinput[1],
                    parsedinput[2]
                ).getday();
            if (weekdayprovided !== weekdayactual) {
                getparsingflags(config).weekdaymismatch = true;
                config._isvalid = false;
                return false;
            }
        }
        return true;
    }

    function calculateoffset(obsoffset, militaryoffset, numoffset) {
        if (obsoffset) {
            return obsoffsets[obsoffset];
        } else if (militaryoffset) {
            // the only allowed military tz is z
            return 0;
        } else {
            var hm = parseint(numoffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configfromrfc2822(config) {
        var match = rfc2822.exec(preprocessrfc2822(config._i)),
            parsedarray;
        if (match) {
            parsedarray = extractfromrfc2822strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkweekday(match[1], parsedarray, config)) {
                return;
            }

            config._a = parsedarray;
            config._tzm = calculateoffset(match[8], match[9], match[10]);

            config._d = createutcdate.apply(null, config._a);
            config._d.setutcminutes(config._d.getutcminutes() - config._tzm);

            getparsingflags(config).rfc2822 = true;
        } else {
            config._isvalid = false;
        }
    }

    // date from 1) asp.net, 2) iso, 3) rfc 2822 formats, or 4) optional fallback if parsing isn't strict
    function configfromstring(config) {
        var matched = aspnetjsonregex.exec(config._i);
        if (matched !== null) {
            config._d = new date(+matched[1]);
            return;
        }

        configfromiso(config);
        if (config._isvalid === false) {
            delete config._isvalid;
        } else {
            return;
        }

        configfromrfc2822(config);
        if (config._isvalid === false) {
            delete config._isvalid;
        } else {
            return;
        }

        if (config._strict) {
            config._isvalid = false;
        } else {
            // final attempt, use input fallback
            hooks.createfrominputfallback(config);
        }
    }

    hooks.createfrominputfallback = deprecate(
        'value provided is not in a recognized rfc2822 or iso format. moment construction falls back to js date(), ' +
            'which is not reliable across all browsers and versions. non rfc2822/iso date formats are ' +
            'discouraged. please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new date(config._i + (config._useutc ? ' utc' : ''));
        }
    );

    // pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentdatearray(config) {
        // hooks is actually the exported moment object
        var nowvalue = new date(hooks.now());
        if (config._useutc) {
            return [
                nowvalue.getutcfullyear(),
                nowvalue.getutcmonth(),
                nowvalue.getutcdate(),
            ];
        }
        return [nowvalue.getfullyear(), nowvalue.getmonth(), nowvalue.getdate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configfromarray(config) {
        var i,
            date,
            input = [],
            currentdate,
            expectedweekday,
            yeartouse;

        if (config._d) {
            return;
        }

        currentdate = currentdatearray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[date] == null && config._a[month] == null) {
            dayofyearfromweekinfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayofyear != null) {
            yeartouse = defaults(config._a[year], currentdate[year]);

            if (
                config._dayofyear > daysinyear(yeartouse) ||
                config._dayofyear === 0
            ) {
                getparsingflags(config)._overflowdayofyear = true;
            }

            date = createutcdate(yeartouse, 0, config._dayofyear);
            config._a[month] = date.getutcmonth();
            config._a[date] = date.getutcdate();
        }

        // default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentdate[i];
        }

        // zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // check for 24:00:00.000
        if (
            config._a[hour] === 24 &&
            config._a[minute] === 0 &&
            config._a[second] === 0 &&
            config._a[millisecond] === 0
        ) {
            config._nextday = true;
            config._a[hour] = 0;
        }

        config._d = (config._useutc ? createutcdate : createdate).apply(
            null,
            input
        );
        expectedweekday = config._useutc
            ? config._d.getutcday()
            : config._d.getday();

        // apply timezone offset from input. the actual utcoffset can be changed
        // with parsezone.
        if (config._tzm != null) {
            config._d.setutcminutes(config._d.getutcminutes() - config._tzm);
        }

        if (config._nextday) {
            config._a[hour] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedweekday
        ) {
            getparsingflags(config).weekdaymismatch = true;
        }
    }

    function dayofyearfromweekinfo(config) {
        var w, weekyear, week, weekday, dow, doy, temp, weekdayoverflow, curweek;

        w = config._w;
        if (w.gg != null || w.w != null || w.e != null) {
            dow = 1;
            doy = 4;

            // todo: we need to take the current isoweekyear, but that depends on
            // how we interpret now (local, utc, fixed offset). so create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekyear = defaults(
                w.gg,
                config._a[year],
                weekofyear(createlocal(), 1, 4).year
            );
            week = defaults(w.w, 1);
            weekday = defaults(w.e, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayoverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curweek = weekofyear(createlocal(), dow, doy);

            weekyear = defaults(w.gg, config._a[year], curweek.year);

            // default to current week.
            week = defaults(w.w, curweek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayoverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayoverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksinyear(weekyear, dow, doy)) {
            getparsingflags(config)._overflowweeks = true;
        } else if (weekdayoverflow != null) {
            getparsingflags(config)._overflowweekday = true;
        } else {
            temp = dayofyearfromweeks(weekyear, week, weekday, dow, doy);
            config._a[year] = temp.year;
            config._dayofyear = temp.dayofyear;
        }
    }

    // constant that refers to the iso standard
    hooks.iso_8601 = function () {};

    // constant that refers to the rfc 2822 form
    hooks.rfc_2822 = function () {};

    // date from string and format string
    function configfromstringandformat(config) {
        // todo: move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.iso_8601) {
            configfromiso(config);
            return;
        }
        if (config._f === hooks.rfc_2822) {
            configfromrfc2822(config);
            return;
        }
        config._a = [];
        getparsingflags(config).empty = true;

        // this array is used to make a date, either with `new date` or `date.utc`
        var string = '' + config._i,
            i,
            parsedinput,
            tokens,
            token,
            skipped,
            stringlength = string.length,
            totalparsedinputlength = 0,
            era,
            tokenlen;

        tokens =
            expandformat(config._f, config._locale).match(formattingtokens) || [];
        tokenlen = tokens.length;
        for (i = 0; i < tokenlen; i++) {
            token = tokens[i];
            parsedinput = (string.match(getparseregexfortoken(token, config)) ||
                [])[0];
            if (parsedinput) {
                skipped = string.substr(0, string.indexof(parsedinput));
                if (skipped.length > 0) {
                    getparsingflags(config).unusedinput.push(skipped);
                }
                string = string.slice(
                    string.indexof(parsedinput) + parsedinput.length
                );
                totalparsedinputlength += parsedinput.length;
            }
            // don't parse if it's not a known token
            if (formattokenfunctions[token]) {
                if (parsedinput) {
                    getparsingflags(config).empty = false;
                } else {
                    getparsingflags(config).unusedtokens.push(token);
                }
                addtimetoarrayfromtoken(token, parsedinput, config);
            } else if (config._strict && !parsedinput) {
                getparsingflags(config).unusedtokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getparsingflags(config).charsleftover =
            stringlength - totalparsedinputlength;
        if (string.length > 0) {
            getparsingflags(config).unusedinput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[hour] <= 12 &&
            getparsingflags(config).bighour === true &&
            config._a[hour] > 0
        ) {
            getparsingflags(config).bighour = undefined;
        }

        getparsingflags(config).parseddateparts = config._a.slice(0);
        getparsingflags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[hour] = meridiemfixwrap(
            config._locale,
            config._a[hour],
            config._meridiem
        );

        // handle era
        era = getparsingflags(config).era;
        if (era !== null) {
            config._a[year] = config._locale.erasconvertyear(era, config._a[year]);
        }

        configfromarray(config);
        checkoverflow(config);
    }

    function meridiemfixwrap(locale, hour, meridiem) {
        var ispm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemhour != null) {
            return locale.meridiemhour(hour, meridiem);
        } else if (locale.ispm != null) {
            // fallback
            ispm = locale.ispm(meridiem);
            if (ispm && hour < 12) {
                hour += 12;
            }
            if (!ispm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configfromstringandarray(config) {
        var tempconfig,
            bestmoment,
            scoretobeat,
            i,
            currentscore,
            validformatfound,
            bestformatisvalid = false,
            configflen = config._f.length;

        if (configflen === 0) {
            getparsingflags(config).invalidformat = true;
            config._d = new date(nan);
            return;
        }

        for (i = 0; i < configflen; i++) {
            currentscore = 0;
            validformatfound = false;
            tempconfig = copyconfig({}, config);
            if (config._useutc != null) {
                tempconfig._useutc = config._useutc;
            }
            tempconfig._f = config._f[i];
            configfromstringandformat(tempconfig);

            if (isvalid(tempconfig)) {
                validformatfound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentscore += getparsingflags(tempconfig).charsleftover;

            //or tokens
            currentscore += getparsingflags(tempconfig).unusedtokens.length * 10;

            getparsingflags(tempconfig).score = currentscore;

            if (!bestformatisvalid) {
                if (
                    scoretobeat == null ||
                    currentscore < scoretobeat ||
                    validformatfound
                ) {
                    scoretobeat = currentscore;
                    bestmoment = tempconfig;
                    if (validformatfound) {
                        bestformatisvalid = true;
                    }
                }
            } else {
                if (currentscore < scoretobeat) {
                    scoretobeat = currentscore;
                    bestmoment = tempconfig;
                }
            }
        }

        extend(config, bestmoment || tempconfig);
    }

    function configfromobject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeobjectunits(config._i),
            dayordate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayordate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseint(obj, 10);
            }
        );

        configfromarray(config);
    }

    function createfromconfig(config) {
        var res = new moment(checkoverflow(prepareconfig(config)));
        if (res._nextday) {
            // adding is smart enough around dst
            res.add(1, 'd');
            res._nextday = undefined;
        }

        return res;
    }

    function prepareconfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getlocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createinvalid({ nullinput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (ismoment(input)) {
            return new moment(checkoverflow(input));
        } else if (isdate(input)) {
            config._d = input;
        } else if (isarray(format)) {
            configfromstringandarray(config);
        } else if (format) {
            configfromstringandformat(config);
        } else {
            configfrominput(config);
        }

        if (!isvalid(config)) {
            config._d = null;
        }

        return config;
    }

    function configfrominput(config) {
        var input = config._i;
        if (isundefined(input)) {
            config._d = new date(hooks.now());
        } else if (isdate(input)) {
            config._d = new date(input.valueof());
        } else if (typeof input === 'string') {
            configfromstring(config);
        } else if (isarray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseint(obj, 10);
            });
            configfromarray(config);
        } else if (isobject(input)) {
            configfromobject(config);
        } else if (isnumber(input)) {
            // from milliseconds
            config._d = new date(input);
        } else {
            hooks.createfrominputfallback(config);
        }
    }

    function createlocalorutc(input, format, locale, strict, isutc) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isobject(input) && isobjectempty(input)) ||
            (isarray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isamomentobject = true;
        c._useutc = c._isutc = isutc;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createfromconfig(c);
    }

    function createlocal(input, format, locale, strict) {
        return createlocalorutc(input, format, locale, strict, false);
    }

    var prototypemin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createlocal.apply(null, arguments);
                if (this.isvalid() && other.isvalid()) {
                    return other < this ? this : other;
                } else {
                    return createinvalid();
                }
            }
        ),
        prototypemax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createlocal.apply(null, arguments);
                if (this.isvalid() && other.isvalid()) {
                    return other > this ? this : other;
                } else {
                    return createinvalid();
                }
            }
        );

    // pick a moment m from moments so that m[fn](other) is true for all
    // other. this relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickby(fn, moments) {
        var res, i;
        if (moments.length === 1 && isarray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createlocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isvalid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // todo: use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickby('isbefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickby('isafter', args);
    }

    var now = function () {
        return date.now ? date.now() : +new date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isdurationvalid(m) {
        var key,
            unithasdecimal = false,
            i,
            orderlen = ordering.length;
        for (key in m) {
            if (
                hasownprop(m, key) &&
                !(
                    indexof.call(ordering, key) !== -1 &&
                    (m[key] == null || !isnan(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < orderlen; ++i) {
            if (m[ordering[i]]) {
                if (unithasdecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parsefloat(m[ordering[i]]) !== toint(m[ordering[i]])) {
                    unithasdecimal = true;
                }
            }
        }

        return true;
    }

    function isvalid$1() {
        return this._isvalid;
    }

    function createinvalid$1() {
        return createduration(nan);
    }

    function duration(duration) {
        var normalizedinput = normalizeobjectunits(duration),
            years = normalizedinput.year || 0,
            quarters = normalizedinput.quarter || 0,
            months = normalizedinput.month || 0,
            weeks = normalizedinput.week || normalizedinput.isoweek || 0,
            days = normalizedinput.day || 0,
            hours = normalizedinput.hour || 0,
            minutes = normalizedinput.minute || 0,
            seconds = normalizedinput.second || 0,
            milliseconds = normalizedinput.millisecond || 0;

        this._isvalid = isdurationvalid(normalizedinput);

        // representation for dateaddremove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // because of dateaddremove treats 24 hours as different from a
        // day when working around dst, we need to store them separately
        this._days = +days + weeks * 7;
        // it is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getlocale();

        this._bubble();
    }

    function isduration(obj) {
        return obj instanceof duration;
    }

    function absround(number) {
        if (number < 0) {
            return math.round(-1 * number) * -1;
        } else {
            return math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function comparearrays(array1, array2, dontconvert) {
        var len = math.min(array1.length, array2.length),
            lengthdiff = math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontconvert && array1[i] !== array2[i]) ||
                (!dontconvert && toint(array1[i]) !== toint(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthdiff;
    }

    // formatting

    function offset(token, separator) {
        addformattoken(token, 0, 0, function () {
            var offset = this.utcoffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zerofill(~~(offset / 60), 2) +
                separator +
                zerofill(~~offset % 60, 2)
            );
        });
    }

    offset('z', ':');
    offset('zz', '');

    // parsing

    addregextoken('z', matchshortoffset);
    addregextoken('zz', matchshortoffset);
    addparsetoken(['z', 'zz'], function (input, array, config) {
        config._useutc = true;
        config._tzm = offsetfromstring(matchshortoffset, input);
    });

    // helpers

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkoffset = /([\+\-]|\d\d)/gi;

    function offsetfromstring(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkoffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toint(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // return a moment from input, that is local/utc/zone equivalent to model.
    function clonewithoffset(input, model) {
        var res, diff;
        if (model._isutc) {
            res = model.clone();
            diff =
                (ismoment(input) || isdate(input)
                    ? input.valueof()
                    : createlocal(input).valueof()) - res.valueof();
            // use low-level api, because this fn is low-level api.
            res._d.settime(res._d.valueof() + diff);
            hooks.updateoffset(res, false);
            return res;
        } else {
            return createlocal(input).local();
        }
    }

    function getdateoffset(m) {
        // on firefox.24 date#gettimezoneoffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -math.round(m._d.gettimezoneoffset());
    }

    // hooks

    // this function will be called whenever a moment is mutated.
    // it is intended to keep the offset in sync with the timezone.
    hooks.updateoffset = function () {};

    // moments

    // keeplocaltime = true means only change the timezone, without
    // affecting the local hour. so 5:31:26 +0300 --[utcoffset(2, true)]-->
    // 5:31:26 +0200 it is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. that is why we call updateoffset
    // a second time. in case it wants us to change the offset again
    // _changeinprogress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getsetoffset(input, keeplocaltime, keepminutes) {
        var offset = this._offset || 0,
            localadjust;
        if (!this.isvalid()) {
            return input != null ? this : nan;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetfromstring(matchshortoffset, input);
                if (input === null) {
                    return this;
                }
            } else if (math.abs(input) < 16 && !keepminutes) {
                input = input * 60;
            }
            if (!this._isutc && keeplocaltime) {
                localadjust = getdateoffset(this);
            }
            this._offset = input;
            this._isutc = true;
            if (localadjust != null) {
                this.add(localadjust, 'm');
            }
            if (offset !== input) {
                if (!keeplocaltime || this._changeinprogress) {
                    addsubtract(
                        this,
                        createduration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeinprogress) {
                    this._changeinprogress = true;
                    hooks.updateoffset(this, true);
                    this._changeinprogress = null;
                }
            }
            return this;
        } else {
            return this._isutc ? offset : getdateoffset(this);
        }
    }

    function getsetzone(input, keeplocaltime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcoffset(input, keeplocaltime);

            return this;
        } else {
            return -this.utcoffset();
        }
    }

    function setoffsettoutc(keeplocaltime) {
        return this.utcoffset(0, keeplocaltime);
    }

    function setoffsettolocal(keeplocaltime) {
        if (this._isutc) {
            this.utcoffset(0, keeplocaltime);
            this._isutc = false;

            if (keeplocaltime) {
                this.subtract(getdateoffset(this), 'm');
            }
        }
        return this;
    }

    function setoffsettoparsedoffset() {
        if (this._tzm != null) {
            this.utcoffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tzone = offsetfromstring(matchoffset, this._i);
            if (tzone != null) {
                this.utcoffset(tzone);
            } else {
                this.utcoffset(0, true);
            }
        }
        return this;
    }

    function hasalignedhouroffset(input) {
        if (!this.isvalid()) {
            return false;
        }
        input = input ? createlocal(input).utcoffset() : 0;

        return (this.utcoffset() - input) % 60 === 0;
    }

    function isdaylightsavingtime() {
        return (
            this.utcoffset() > this.clone().month(0).utcoffset() ||
            this.utcoffset() > this.clone().month(5).utcoffset()
        );
    }

    function isdaylightsavingtimeshifted() {
        if (!isundefined(this._isdstshifted)) {
            return this._isdstshifted;
        }

        var c = {},
            other;

        copyconfig(c, this);
        c = prepareconfig(c);

        if (c._a) {
            other = c._isutc ? createutc(c._a) : createlocal(c._a);
            this._isdstshifted =
                this.isvalid() && comparearrays(c._a, other.toarray()) > 0;
        } else {
            this._isdstshifted = false;
        }

        return this._isdstshifted;
    }

    function islocal() {
        return this.isvalid() ? !this._isutc : false;
    }

    function isutcoffset() {
        return this.isvalid() ? this._isutc : false;
    }

    function isutc() {
        return this.isvalid() ? this._isutc && this._offset === 0 : false;
    }

    // asp.net json date format regex
    var aspnetregex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoregex =
            /^(-|\+)?p(?:([-+]?[0-9,.]*)y)?(?:([-+]?[0-9,.]*)m)?(?:([-+]?[0-9,.]*)w)?(?:([-+]?[0-9,.]*)d)?(?:t(?:([-+]?[0-9,.]*)h)?(?:([-+]?[0-9,.]*)m)?(?:([-+]?[0-9,.]*)s)?)?$/;

    function createduration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffres;

        if (isduration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                m: input._months,
            };
        } else if (isnumber(input) || !isnan(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspnetregex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toint(match[date]) * sign,
                h: toint(match[hour]) * sign,
                m: toint(match[minute]) * sign,
                s: toint(match[second]) * sign,
                ms: toint(absround(match[millisecond] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoregex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseiso(match[2], sign),
                m: parseiso(match[3], sign),
                w: parseiso(match[4], sign),
                d: parseiso(match[5], sign),
                h: parseiso(match[6], sign),
                m: parseiso(match[7], sign),
                s: parseiso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffres = momentsdifference(
                createlocal(duration.from),
                createlocal(duration.to)
            );

            duration = {};
            duration.ms = diffres.milliseconds;
            duration.m = diffres.months;
        }

        ret = new duration(duration);

        if (isduration(input) && hasownprop(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isduration(input) && hasownprop(input, '_isvalid')) {
            ret._isvalid = input._isvalid;
        }

        return ret;
    }

    createduration.fn = duration.prototype;
    createduration.invalid = createinvalid$1;

    function parseiso(inp, sign) {
        // we'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parsefloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isnan(res) ? 0 : res) * sign;
    }

    function positivemomentsdifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'm').isafter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'm');

        return res;
    }

    function momentsdifference(base, other) {
        var res;
        if (!(base.isvalid() && other.isvalid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = clonewithoffset(other, base);
        if (base.isbefore(other)) {
            res = positivemomentsdifference(base, other);
        } else {
            res = positivemomentsdifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // todo: remove 'name' arg after deprecation is removed
    function createadder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isnan(+period)) {
                deprecatesimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. please use moment().' +
                        name +
                        '(number, period). ' +
                        'see http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createduration(val, period);
            addsubtract(this, dur, direction);
            return this;
        };
    }

    function addsubtract(mom, duration, isadding, updateoffset) {
        var milliseconds = duration._milliseconds,
            days = absround(duration._days),
            months = absround(duration._months);

        if (!mom.isvalid()) {
            // no op
            return;
        }

        updateoffset = updateoffset == null ? true : updateoffset;

        if (months) {
            setmonth(mom, get(mom, 'month') + months * isadding);
        }
        if (days) {
            set$1(mom, 'date', get(mom, 'date') + days * isadding);
        }
        if (milliseconds) {
            mom._d.settime(mom._d.valueof() + milliseconds * isadding);
        }
        if (updateoffset) {
            hooks.updateoffset(mom, days || months);
        }
    }

    var add = createadder(1, 'add'),
        subtract = createadder(-1, 'subtract');

    function isstring(input) {
        return typeof input === 'string' || input instanceof string;
    }

    // type momentinput = moment | date | string | number | (number | string)[] | momentinputobject | void; // null | undefined
    function ismomentinput(input) {
        return (
            ismoment(input) ||
            isdate(input) ||
            isstring(input) ||
            isnumber(input) ||
            isnumberorstringarray(input) ||
            ismomentinputobject(input) ||
            input === null ||
            input === undefined
        );
    }

    function ismomentinputobject(input) {
        var objecttest = isobject(input) && !isobjectempty(input),
            propertytest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'm',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'd',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property,
            propertylen = properties.length;

        for (i = 0; i < propertylen; i += 1) {
            property = properties[i];
            propertytest = propertytest || hasownprop(input, property);
        }

        return objecttest && propertytest;
    }

    function isnumberorstringarray(input) {
        var arraytest = isarray(input),
            datatypetest = false;
        if (arraytest) {
            datatypetest =
                input.filter(function (item) {
                    return !isnumber(item) && isstring(input);
                }).length === 0;
        }
        return arraytest && datatypetest;
    }

    function iscalendarspec(input) {
        var objecttest = isobject(input) && !isobjectempty(input),
            propertytest = false,
            properties = [
                'sameday',
                'nextday',
                'lastday',
                'nextweek',
                'lastweek',
                'sameelse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertytest = propertytest || hasownprop(input, property);
        }

        return objecttest && propertytest;
    }

    function getcalendarformat(mymoment, now) {
        var diff = mymoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameelse'
            : diff < -1
              ? 'lastweek'
              : diff < 0
                ? 'lastday'
                : diff < 1
                  ? 'sameday'
                  : diff < 2
                    ? 'nextday'
                    : diff < 7
                      ? 'nextweek'
                      : 'sameelse';
    }

    function calendar$1(time, formats) {
        // support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (!arguments[0]) {
                time = undefined;
                formats = undefined;
            } else if (ismomentinput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (iscalendarspec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // we want to compare the start of today, vs this.
        // getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createlocal(),
            sod = clonewithoffset(now, this).startof('day'),
            format = hooks.calendarformat(this, sod) || 'sameelse',
            output =
                formats &&
                (isfunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localedata().calendar(format, this, createlocal(now))
        );
    }

    function clone() {
        return new moment(this);
    }

    function isafter(input, units) {
        var localinput = ismoment(input) ? input : createlocal(input);
        if (!(this.isvalid() && localinput.isvalid())) {
            return false;
        }
        units = normalizeunits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueof() > localinput.valueof();
        } else {
            return localinput.valueof() < this.clone().startof(units).valueof();
        }
    }

    function isbefore(input, units) {
        var localinput = ismoment(input) ? input : createlocal(input);
        if (!(this.isvalid() && localinput.isvalid())) {
            return false;
        }
        units = normalizeunits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueof() < localinput.valueof();
        } else {
            return this.clone().endof(units).valueof() < localinput.valueof();
        }
    }

    function isbetween(from, to, units, inclusivity) {
        var localfrom = ismoment(from) ? from : createlocal(from),
            localto = ismoment(to) ? to : createlocal(to);
        if (!(this.isvalid() && localfrom.isvalid() && localto.isvalid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isafter(localfrom, units)
                : !this.isbefore(localfrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isbefore(localto, units)
                : !this.isafter(localto, units))
        );
    }

    function issame(input, units) {
        var localinput = ismoment(input) ? input : createlocal(input),
            inputms;
        if (!(this.isvalid() && localinput.isvalid())) {
            return false;
        }
        units = normalizeunits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueof() === localinput.valueof();
        } else {
            inputms = localinput.valueof();
            return (
                this.clone().startof(units).valueof() <= inputms &&
                inputms <= this.clone().endof(units).valueof()
            );
        }
    }

    function issameorafter(input, units) {
        return this.issame(input, units) || this.isafter(input, units);
    }

    function issameorbefore(input, units) {
        return this.issame(input, units) || this.isbefore(input, units);
    }

    function diff(input, units, asfloat) {
        var that, zonedelta, output;

        if (!this.isvalid()) {
            return nan;
        }

        that = clonewithoffset(input, this);

        if (!that.isvalid()) {
            return nan;
        }

        zonedelta = (that.utcoffset() - this.utcoffset()) * 6e4;

        units = normalizeunits(units);

        switch (units) {
            case 'year':
                output = monthdiff(this, that) / 12;
                break;
            case 'month':
                output = monthdiff(this, that);
                break;
            case 'quarter':
                output = monthdiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zonedelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zonedelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asfloat ? output : absfloor(output);
    }

    function monthdiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthdiff(b, a);
        }
        // difference in months
        var wholemonthdiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholemonthdiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholemonthdiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholemonthdiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholemonthdiff + adjust) || 0;
    }

    hooks.defaultformat = 'yyyy-mm-ddthh:mm:ssz';
    hooks.defaultformatutc = 'yyyy-mm-ddthh:mm:ss[z]';

    function tostring() {
        return this.clone().locale('en').format('ddd mmm dd yyyy hh:mm:ss [gmt]zz');
    }

    function toisostring(keepoffset) {
        if (!this.isvalid()) {
            return null;
        }
        var utc = keepoffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatmoment(
                m,
                utc
                    ? 'yyyyyy-mm-dd[t]hh:mm:ss.sss[z]'
                    : 'yyyyyy-mm-dd[t]hh:mm:ss.sssz'
            );
        }
        if (isfunction(date.prototype.toisostring)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.todate().toisostring();
            } else {
                return new date(this.valueof() + this.utcoffset() * 60 * 1000)
                    .toisostring()
                    .replace('z', formatmoment(m, 'z'));
            }
        }
        return formatmoment(
            m,
            utc ? 'yyyy-mm-dd[t]hh:mm:ss.sss[z]' : 'yyyy-mm-dd[t]hh:mm:ss.sssz'
        );
    }

    /**
     * return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isvalid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.islocal()) {
            func = this.utcoffset() === 0 ? 'moment.utc' : 'moment.parsezone';
            zone = 'z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'yyyy' : 'yyyyyy';
        datetime = '-mm-dd[t]hh:mm:ss.sss';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputstring) {
        if (!inputstring) {
            inputstring = this.isutc()
                ? hooks.defaultformatutc
                : hooks.defaultformat;
        }
        var output = formatmoment(this, inputstring);
        return this.localedata().postformat(output);
    }

    function from(time, withoutsuffix) {
        if (
            this.isvalid() &&
            ((ismoment(time) && time.isvalid()) || createlocal(time).isvalid())
        ) {
            return createduration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutsuffix);
        } else {
            return this.localedata().invaliddate();
        }
    }

    function fromnow(withoutsuffix) {
        return this.from(createlocal(), withoutsuffix);
    }

    function to(time, withoutsuffix) {
        if (
            this.isvalid() &&
            ((ismoment(time) && time.isvalid()) || createlocal(time).isvalid())
        ) {
            return createduration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutsuffix);
        } else {
            return this.localedata().invaliddate();
        }
    }

    function tonow(withoutsuffix) {
        return this.to(createlocal(), withoutsuffix);
    }

    // if passed a locale key, it will set the locale for this
    // instance.  otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newlocaledata;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newlocaledata = getlocale(key);
            if (newlocaledata != null) {
                this._locale = newlocaledata;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. instead, use moment().localedata() to get the language configuration. use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localedata();
            } else {
                return this.locale(key);
            }
        }
    );

    function localedata() {
        return this._locale;
    }

    var ms_per_second = 1000,
        ms_per_minute = 60 * ms_per_second,
        ms_per_hour = 60 * ms_per_minute,
        ms_per_400_years = (365 * 400 + 97) * 24 * ms_per_hour;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localstartofdate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new date(y + 400, m, d) - ms_per_400_years;
        } else {
            return new date(y, m, d).valueof();
        }
    }

    function utcstartofdate(y, m, d) {
        // date.utc remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return date.utc(y + 400, m, d) - ms_per_400_years;
        } else {
            return date.utc(y, m, d);
        }
    }

    function startof(units) {
        var time, startofdate;
        units = normalizeunits(units);
        if (units === undefined || units === 'millisecond' || !this.isvalid()) {
            return this;
        }

        startofdate = this._isutc ? utcstartofdate : localstartofdate;

        switch (units) {
            case 'year':
                time = startofdate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startofdate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startofdate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startofdate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoweek':
                time = startofdate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoweekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startofdate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueof();
                time -= mod$1(
                    time + (this._isutc ? 0 : this.utcoffset() * ms_per_minute),
                    ms_per_hour
                );
                break;
            case 'minute':
                time = this._d.valueof();
                time -= mod$1(time, ms_per_minute);
                break;
            case 'second':
                time = this._d.valueof();
                time -= mod$1(time, ms_per_second);
                break;
        }

        this._d.settime(time);
        hooks.updateoffset(this, true);
        return this;
    }

    function endof(units) {
        var time, startofdate;
        units = normalizeunits(units);
        if (units === undefined || units === 'millisecond' || !this.isvalid()) {
            return this;
        }

        startofdate = this._isutc ? utcstartofdate : localstartofdate;

        switch (units) {
            case 'year':
                time = startofdate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startofdate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startofdate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startofdate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoweek':
                time =
                    startofdate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoweekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startofdate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueof();
                time +=
                    ms_per_hour -
                    mod$1(
                        time + (this._isutc ? 0 : this.utcoffset() * ms_per_minute),
                        ms_per_hour
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueof();
                time += ms_per_minute - mod$1(time, ms_per_minute) - 1;
                break;
            case 'second':
                time = this._d.valueof();
                time += ms_per_second - mod$1(time, ms_per_second) - 1;
                break;
        }

        this._d.settime(time);
        hooks.updateoffset(this, true);
        return this;
    }

    function valueof() {
        return this._d.valueof() - (this._offset || 0) * 60000;
    }

    function unix() {
        return math.floor(this.valueof() / 1000);
    }

    function todate() {
        return new date(this.valueof());
    }

    function toarray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toobject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function tojson() {
        // new date(nan).tojson() === null
        return this.isvalid() ? this.toisostring() : null;
    }

    function isvalid$2() {
        return isvalid(this);
    }

    function parsingflags() {
        return extend({}, getparsingflags(this));
    }

    function invalidat() {
        return getparsingflags(this).overflow;
    }

    function creationdata() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isutc: this._isutc,
            strict: this._strict,
        };
    }

    addformattoken('n', 0, 0, 'eraabbr');
    addformattoken('nn', 0, 0, 'eraabbr');
    addformattoken('nnn', 0, 0, 'eraabbr');
    addformattoken('nnnn', 0, 0, 'eraname');
    addformattoken('nnnnn', 0, 0, 'eranarrow');

    addformattoken('y', ['y', 1], 'yo', 'erayear');
    addformattoken('y', ['yy', 2], 0, 'erayear');
    addformattoken('y', ['yyy', 3], 0, 'erayear');
    addformattoken('y', ['yyyy', 4], 0, 'erayear');

    addregextoken('n', matcheraabbr);
    addregextoken('nn', matcheraabbr);
    addregextoken('nnn', matcheraabbr);
    addregextoken('nnnn', matcheraname);
    addregextoken('nnnnn', matcheranarrow);

    addparsetoken(
        ['n', 'nn', 'nnn', 'nnnn', 'nnnnn'],
        function (input, array, config, token) {
            var era = config._locale.erasparse(input, token, config._strict);
            if (era) {
                getparsingflags(config).era = era;
            } else {
                getparsingflags(config).invalidera = input;
            }
        }
    );

    addregextoken('y', matchunsigned);
    addregextoken('yy', matchunsigned);
    addregextoken('yyy', matchunsigned);
    addregextoken('yyyy', matchunsigned);
    addregextoken('yo', matcherayearordinal);

    addparsetoken(['y', 'yy', 'yyy', 'yyyy'], year);
    addparsetoken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._erayearordinalregex) {
            match = input.match(config._locale._erayearordinalregex);
        }

        if (config._locale.erayearordinalparse) {
            array[year] = config._locale.erayearordinalparse(input, match);
        } else {
            array[year] = parseint(input, 10);
        }
    });

    function localeeras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getlocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startof('day');
                    eras[i].since = date.valueof();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startof('day').valueof();
                    eras[i].until = date.valueof();
                    break;
            }
        }
        return eras;
    }

    function localeerasparse(eraname, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraname = eraname.touppercase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.touppercase();
            abbr = eras[i].abbr.touppercase();
            narrow = eras[i].narrow.touppercase();

            if (strict) {
                switch (format) {
                    case 'n':
                    case 'nn':
                    case 'nnn':
                        if (abbr === eraname) {
                            return eras[i];
                        }
                        break;

                    case 'nnnn':
                        if (name === eraname) {
                            return eras[i];
                        }
                        break;

                    case 'nnnnn':
                        if (narrow === eraname) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexof(eraname) >= 0) {
                return eras[i];
            }
        }
    }

    function localeerasconvertyear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function geteraname() {
        var i,
            l,
            val,
            eras = this.localedata().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startof('day').valueof();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function geteranarrow() {
        var i,
            l,
            val,
            eras = this.localedata().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startof('day').valueof();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function geteraabbr() {
        var i,
            l,
            val,
            eras = this.localedata().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startof('day').valueof();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function geterayear() {
        var i,
            l,
            dir,
            val,
            eras = this.localedata().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.clone().startof('day').valueof();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasnameregex(isstrict) {
        if (!hasownprop(this, '_erasnameregex')) {
            computeerasparse.call(this);
        }
        return isstrict ? this._erasnameregex : this._erasregex;
    }

    function erasabbrregex(isstrict) {
        if (!hasownprop(this, '_erasabbrregex')) {
            computeerasparse.call(this);
        }
        return isstrict ? this._erasabbrregex : this._erasregex;
    }

    function erasnarrowregex(isstrict) {
        if (!hasownprop(this, '_erasnarrowregex')) {
            computeerasparse.call(this);
        }
        return isstrict ? this._erasnarrowregex : this._erasregex;
    }

    function matcheraabbr(isstrict, locale) {
        return locale.erasabbrregex(isstrict);
    }

    function matcheraname(isstrict, locale) {
        return locale.erasnameregex(isstrict);
    }

    function matcheranarrow(isstrict, locale) {
        return locale.erasnarrowregex(isstrict);
    }

    function matcherayearordinal(isstrict, locale) {
        return locale._erayearordinalregex || matchunsigned;
    }

    function computeerasparse() {
        var abbrpieces = [],
            namepieces = [],
            narrowpieces = [],
            mixedpieces = [],
            i,
            l,
            erasname,
            erasabbr,
            erasnarrow,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            erasname = regexescape(eras[i].name);
            erasabbr = regexescape(eras[i].abbr);
            erasnarrow = regexescape(eras[i].narrow);

            namepieces.push(erasname);
            abbrpieces.push(erasabbr);
            narrowpieces.push(erasnarrow);
            mixedpieces.push(erasname);
            mixedpieces.push(erasabbr);
            mixedpieces.push(erasnarrow);
        }

        this._erasregex = new regexp('^(' + mixedpieces.join('|') + ')', 'i');
        this._erasnameregex = new regexp('^(' + namepieces.join('|') + ')', 'i');
        this._erasabbrregex = new regexp('^(' + abbrpieces.join('|') + ')', 'i');
        this._erasnarrowregex = new regexp(
            '^(' + narrowpieces.join('|') + ')',
            'i'
        );
    }

    // formatting

    addformattoken(0, ['gg', 2], 0, function () {
        return this.weekyear() % 100;
    });

    addformattoken(0, ['gg', 2], 0, function () {
        return this.isoweekyear() % 100;
    });

    function addweekyearformattoken(token, getter) {
        addformattoken(0, [token, token.length], 0, getter);
    }

    addweekyearformattoken('gggg', 'weekyear');
    addweekyearformattoken('ggggg', 'weekyear');
    addweekyearformattoken('gggg', 'isoweekyear');
    addweekyearformattoken('ggggg', 'isoweekyear');

    // aliases

    // parsing

    addregextoken('g', matchsigned);
    addregextoken('g', matchsigned);
    addregextoken('gg', match1to2, match2);
    addregextoken('gg', match1to2, match2);
    addregextoken('gggg', match1to4, match4);
    addregextoken('gggg', match1to4, match4);
    addregextoken('ggggg', match1to6, match6);
    addregextoken('ggggg', match1to6, match6);

    addweekparsetoken(
        ['gggg', 'ggggg', 'gggg', 'ggggg'],
        function (input, week, config, token) {
            week[token.substr(0, 2)] = toint(input);
        }
    );

    addweekparsetoken(['gg', 'gg'], function (input, week, config, token) {
        week[token] = hooks.parsetwodigityear(input);
    });

    // moments

    function getsetweekyear(input) {
        return getsetweekyearhelper.call(
            this,
            input,
            this.week(),
            this.weekday() + this.localedata()._week.dow,
            this.localedata()._week.dow,
            this.localedata()._week.doy
        );
    }

    function getsetisoweekyear(input) {
        return getsetweekyearhelper.call(
            this,
            input,
            this.isoweek(),
            this.isoweekday(),
            1,
            4
        );
    }

    function getisoweeksinyear() {
        return weeksinyear(this.year(), 1, 4);
    }

    function getisoweeksinisoweekyear() {
        return weeksinyear(this.isoweekyear(), 1, 4);
    }

    function getweeksinyear() {
        var weekinfo = this.localedata()._week;
        return weeksinyear(this.year(), weekinfo.dow, weekinfo.doy);
    }

    function getweeksinweekyear() {
        var weekinfo = this.localedata()._week;
        return weeksinyear(this.weekyear(), weekinfo.dow, weekinfo.doy);
    }

    function getsetweekyearhelper(input, week, weekday, dow, doy) {
        var weekstarget;
        if (input == null) {
            return weekofyear(this, dow, doy).year;
        } else {
            weekstarget = weeksinyear(input, dow, doy);
            if (week > weekstarget) {
                week = weekstarget;
            }
            return setweekall.call(this, input, week, weekday, dow, doy);
        }
    }

    function setweekall(weekyear, week, weekday, dow, doy) {
        var dayofyeardata = dayofyearfromweeks(weekyear, week, weekday, dow, doy),
            date = createutcdate(dayofyeardata.year, 0, dayofyeardata.dayofyear);

        this.year(date.getutcfullyear());
        this.month(date.getutcmonth());
        this.date(date.getutcdate());
        return this;
    }

    // formatting

    addformattoken('q', 0, 'qo', 'quarter');

    // parsing

    addregextoken('q', match1);
    addparsetoken('q', function (input, array) {
        array[month] = (toint(input) - 1) * 3;
    });

    // moments

    function getsetquarter(input) {
        return input == null
            ? math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // formatting

    addformattoken('d', ['dd', 2], 'do', 'date');

    // parsing

    addregextoken('d', match1to2, match1to2noleadingzero);
    addregextoken('dd', match1to2, match2);
    addregextoken('do', function (isstrict, locale) {
        // todo: remove "ordinalparse" fallback in next major release.
        return isstrict
            ? locale._dayofmonthordinalparse || locale._ordinalparse
            : locale._dayofmonthordinalparselenient;
    });

    addparsetoken(['d', 'dd'], date);
    addparsetoken('do', function (input, array) {
        array[date] = toint(input.match(match1to2)[0]);
    });

    // moments

    var getsetdayofmonth = makegetset('date', true);

    // formatting

    addformattoken('ddd', ['dddd', 3], 'dddo', 'dayofyear');

    // parsing

    addregextoken('ddd', match1to3);
    addregextoken('dddd', match3);
    addparsetoken(['ddd', 'dddd'], function (input, array, config) {
        config._dayofyear = toint(input);
    });

    // helpers

    // moments

    function getsetdayofyear(input) {
        var dayofyear =
            math.round(
                (this.clone().startof('day') - this.clone().startof('year')) / 864e5
            ) + 1;
        return input == null ? dayofyear : this.add(input - dayofyear, 'd');
    }

    // formatting

    addformattoken('m', ['mm', 2], 0, 'minute');

    // parsing

    addregextoken('m', match1to2, match1to2haszero);
    addregextoken('mm', match1to2, match2);
    addparsetoken(['m', 'mm'], minute);

    // moments

    var getsetminute = makegetset('minutes', false);

    // formatting

    addformattoken('s', ['ss', 2], 0, 'second');

    // parsing

    addregextoken('s', match1to2, match1to2haszero);
    addregextoken('ss', match1to2, match2);
    addparsetoken(['s', 'ss'], second);

    // moments

    var getsetsecond = makegetset('seconds', false);

    // formatting

    addformattoken('s', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addformattoken(0, ['ss', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addformattoken(0, ['sss', 3], 0, 'millisecond');
    addformattoken(0, ['ssss', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addformattoken(0, ['sssss', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addformattoken(0, ['ssssss', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addformattoken(0, ['sssssss', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addformattoken(0, ['ssssssss', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addformattoken(0, ['sssssssss', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // parsing

    addregextoken('s', match1to3, match1);
    addregextoken('ss', match1to3, match2);
    addregextoken('sss', match1to3, match3);

    var token, getsetmillisecond;
    for (token = 'ssss'; token.length <= 9; token += 's') {
        addregextoken(token, matchunsigned);
    }

    function parsems(input, array) {
        array[millisecond] = toint(('0.' + input) * 1000);
    }

    for (token = 's'; token.length <= 9; token += 's') {
        addparsetoken(token, parsems);
    }

    getsetmillisecond = makegetset('milliseconds', false);

    // formatting

    addformattoken('z', 0, 0, 'zoneabbr');
    addformattoken('zz', 0, 0, 'zonename');

    // moments

    function getzoneabbr() {
        return this._isutc ? 'utc' : '';
    }

    function getzonename() {
        return this._isutc ? 'coordinated universal time' : '';
    }

    var proto = moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endof = endof;
    proto.format = format;
    proto.from = from;
    proto.fromnow = fromnow;
    proto.to = to;
    proto.tonow = tonow;
    proto.get = stringget;
    proto.invalidat = invalidat;
    proto.isafter = isafter;
    proto.isbefore = isbefore;
    proto.isbetween = isbetween;
    proto.issame = issame;
    proto.issameorafter = issameorafter;
    proto.issameorbefore = issameorbefore;
    proto.isvalid = isvalid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localedata = localedata;
    proto.max = prototypemax;
    proto.min = prototypemin;
    proto.parsingflags = parsingflags;
    proto.set = stringset;
    proto.startof = startof;
    proto.subtract = subtract;
    proto.toarray = toarray;
    proto.toobject = toobject;
    proto.todate = todate;
    proto.toisostring = toisostring;
    proto.inspect = inspect;
    if (typeof symbol !== 'undefined' && symbol.for != null) {
        proto[symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'moment<' + this.format() + '>';
        };
    }
    proto.tojson = tojson;
    proto.tostring = tostring;
    proto.unix = unix;
    proto.valueof = valueof;
    proto.creationdata = creationdata;
    proto.eraname = geteraname;
    proto.eranarrow = geteranarrow;
    proto.eraabbr = geteraabbr;
    proto.erayear = geterayear;
    proto.year = getsetyear;
    proto.isleapyear = getisleapyear;
    proto.weekyear = getsetweekyear;
    proto.isoweekyear = getsetisoweekyear;
    proto.quarter = proto.quarters = getsetquarter;
    proto.month = getsetmonth;
    proto.daysinmonth = getdaysinmonth;
    proto.week = proto.weeks = getsetweek;
    proto.isoweek = proto.isoweeks = getsetisoweek;
    proto.weeksinyear = getweeksinyear;
    proto.weeksinweekyear = getweeksinweekyear;
    proto.isoweeksinyear = getisoweeksinyear;
    proto.isoweeksinisoweekyear = getisoweeksinisoweekyear;
    proto.date = getsetdayofmonth;
    proto.day = proto.days = getsetdayofweek;
    proto.weekday = getsetlocaledayofweek;
    proto.isoweekday = getsetisodayofweek;
    proto.dayofyear = getsetdayofyear;
    proto.hour = proto.hours = getsethour;
    proto.minute = proto.minutes = getsetminute;
    proto.second = proto.seconds = getsetsecond;
    proto.millisecond = proto.milliseconds = getsetmillisecond;
    proto.utcoffset = getsetoffset;
    proto.utc = setoffsettoutc;
    proto.local = setoffsettolocal;
    proto.parsezone = setoffsettoparsedoffset;
    proto.hasalignedhouroffset = hasalignedhouroffset;
    proto.isdst = isdaylightsavingtime;
    proto.islocal = islocal;
    proto.isutcoffset = isutcoffset;
    proto.isutc = isutc;
    proto.isutc = isutc;
    proto.zoneabbr = getzoneabbr;
    proto.zonename = getzonename;
    proto.dates = deprecate(
        'dates accessor is deprecated. use date instead.',
        getsetdayofmonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. use month instead',
        getsetmonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. use year instead',
        getsetyear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcoffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getsetzone
    );
    proto.isdstshifted = deprecate(
        'isdstshifted is deprecated. see http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isdaylightsavingtimeshifted
    );

    function createunix(input) {
        return createlocal(input * 1000);
    }

    function createinzone() {
        return createlocal.apply(null, arguments).parsezone();
    }

    function preparsepostformat(string) {
        return string;
    }

    var proto$1 = locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longdateformat = longdateformat;
    proto$1.invaliddate = invaliddate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preparsepostformat;
    proto$1.postformat = preparsepostformat;
    proto$1.relativetime = relativetime;
    proto$1.pastfuture = pastfuture;
    proto$1.set = set;
    proto$1.eras = localeeras;
    proto$1.erasparse = localeerasparse;
    proto$1.erasconvertyear = localeerasconvertyear;
    proto$1.erasabbrregex = erasabbrregex;
    proto$1.erasnameregex = erasnameregex;
    proto$1.erasnarrowregex = erasnarrowregex;

    proto$1.months = localemonths;
    proto$1.monthsshort = localemonthsshort;
    proto$1.monthsparse = localemonthsparse;
    proto$1.monthsregex = monthsregex;
    proto$1.monthsshortregex = monthsshortregex;
    proto$1.week = localeweek;
    proto$1.firstdayofyear = localefirstdayofyear;
    proto$1.firstdayofweek = localefirstdayofweek;

    proto$1.weekdays = localeweekdays;
    proto$1.weekdaysmin = localeweekdaysmin;
    proto$1.weekdaysshort = localeweekdaysshort;
    proto$1.weekdaysparse = localeweekdaysparse;

    proto$1.weekdaysregex = weekdaysregex;
    proto$1.weekdaysshortregex = weekdaysshortregex;
    proto$1.weekdaysminregex = weekdaysminregex;

    proto$1.ispm = localeispm;
    proto$1.meridiem = localemeridiem;

    function get$1(format, index, field, setter) {
        var locale = getlocale(),
            utc = createutc().set(setter, index);
        return locale[field](utc, format);
    }

    function listmonthsimpl(format, index, field) {
        if (isnumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listweekdaysimpl(localesorted, format, index, field) {
        if (typeof localesorted === 'boolean') {
            if (isnumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localesorted;
            index = format;
            localesorted = false;

            if (isnumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getlocale(),
            shift = localesorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listmonths(format, index) {
        return listmonthsimpl(format, index, 'months');
    }

    function listmonthsshort(format, index) {
        return listmonthsimpl(format, index, 'monthsshort');
    }

    function listweekdays(localesorted, format, index) {
        return listweekdaysimpl(localesorted, format, index, 'weekdays');
    }

    function listweekdaysshort(localesorted, format, index) {
        return listweekdaysimpl(localesorted, format, index, 'weekdaysshort');
    }

    function listweekdaysmin(localesorted, format, index) {
        return listweekdaysimpl(localesorted, format, index, 'weekdaysmin');
    }

    getsetgloballocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +infinity,
                offset: 1,
                name: 'anno domini',
                narrow: 'ad',
                abbr: 'ad',
            },
            {
                since: '0000-12-31',
                until: -infinity,
                offset: 1,
                name: 'before christ',
                narrow: 'bc',
                abbr: 'bc',
            },
        ],
        dayofmonthordinalparse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toint((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                          ? 'st'
                          : b === 2
                            ? 'nd'
                            : b === 3
                              ? 'rd'
                              : 'th';
            return number + output;
        },
    });

    // side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. use moment.locale instead.',
        getsetgloballocale
    );
    hooks.langdata = deprecate(
        'moment.langdata is deprecated. use moment.localedata instead.',
        getlocale
    );

    var mathabs = math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathabs(this._milliseconds);
        this._days = mathabs(this._days);
        this._months = mathabs(this._months);

        data.milliseconds = mathabs(data.milliseconds);
        data.seconds = mathabs(data.seconds);
        data.minutes = mathabs(data.minutes);
        data.hours = mathabs(data.hours);
        data.months = mathabs(data.months);
        data.years = mathabs(data.years);

        return this;
    }

    function addsubtract$1(duration, input, value, direction) {
        var other = createduration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addsubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addsubtract$1(this, input, value, -1);
    }

    function absceil(number) {
        if (number < 0) {
            return math.floor(number);
        } else {
            return math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsfromdays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absceil(monthstodays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // the following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absfloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absfloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absfloor(minutes / 60);
        data.hours = hours % 24;

        days += absfloor(hours / 24);

        // convert days to months
        monthsfromdays = absfloor(daystomonths(days));
        months += monthsfromdays;
        days -= absceil(monthstodays(monthsfromdays));

        // 12 months -> 1 year
        years = absfloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daystomonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthstodays(months) {
        // the reverse of daystomonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isvalid()) {
            return nan;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeunits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daystomonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + math.round(monthstodays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // math.floor prevents floating point math errors here
                case 'millisecond':
                    return math.floor(days * 864e5) + milliseconds;
                default:
                    throw new error('unknown unit ' + units);
            }
        }
    }

    function makeas(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asmilliseconds = makeas('ms'),
        asseconds = makeas('s'),
        asminutes = makeas('m'),
        ashours = makeas('h'),
        asdays = makeas('d'),
        asweeks = makeas('w'),
        asmonths = makeas('m'),
        asquarters = makeas('q'),
        asyears = makeas('y'),
        valueof$1 = asmilliseconds;

    function clone$1() {
        return createduration(this);
    }

    function get$2(units) {
        units = normalizeunits(units);
        return this.isvalid() ? this[units + 's']() : nan;
    }

    function makegetter(name) {
        return function () {
            return this.isvalid() ? this._data[name] : nan;
        };
    }

    var milliseconds = makegetter('milliseconds'),
        seconds = makegetter('seconds'),
        minutes = makegetter('minutes'),
        hours = makegetter('hours'),
        days = makegetter('days'),
        months = makegetter('months'),
        years = makegetter('years');

    function weeks() {
        return absfloor(this.days() / 7);
    }

    var round = math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            m: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromnow, and moment.duration.fn.humanize
    function substitutetimeago(string, number, withoutsuffix, isfuture, locale) {
        return locale.relativetime(number || 1, !!withoutsuffix, string, isfuture);
    }

    function relativetime$1(posnegduration, withoutsuffix, thresholds, locale) {
        var duration = createduration(posnegduration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('m')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['m']) ||
            (months < thresholds.m && ['mm', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutsuffix;
        a[3] = +posnegduration > 0;
        a[4] = locale;
        return substitutetimeago.apply(null, a);
    }

    // this function allows you to set the rounding function for relative time strings
    function getsetrelativetimerounding(roundingfunction) {
        if (roundingfunction === undefined) {
            return round;
        }
        if (typeof roundingfunction === 'function') {
            round = roundingfunction;
            return true;
        }
        return false;
    }

    // this function allows you to set a threshold for relative time strings
    function getsetrelativetimethreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argwithsuffix, argthresholds) {
        if (!this.isvalid()) {
            return this.localedata().invaliddate();
        }

        var withsuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argwithsuffix === 'object') {
            argthresholds = argwithsuffix;
            argwithsuffix = false;
        }
        if (typeof argwithsuffix === 'boolean') {
            withsuffix = argwithsuffix;
        }
        if (typeof argthresholds === 'object') {
            th = object.assign({}, thresholds, argthresholds);
            if (argthresholds.s != null && argthresholds.ss == null) {
                th.ss = argthresholds.s - 1;
            }
        }

        locale = this.localedata();
        output = relativetime$1(this, !withsuffix, th, locale);

        if (withsuffix) {
            output = locale.pastfuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toisostring$1() {
        // for iso strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // this is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isvalid()) {
            return this.localedata().invaliddate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asseconds(),
            totalsign,
            ymsign,
            dayssign,
            hmssign;

        if (!total) {
            // this is the same as c#'s (noda) and python (isodate)...
            // but not other js (goog.date)
            return 'p0d';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absfloor(seconds / 60);
        hours = absfloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absfloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.tofixed(3).replace(/\.?0+$/, '') : '';

        totalsign = total < 0 ? '-' : '';
        ymsign = sign(this._months) !== sign(total) ? '-' : '';
        dayssign = sign(this._days) !== sign(total) ? '-' : '';
        hmssign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalsign +
            'p' +
            (years ? ymsign + years + 'y' : '') +
            (months ? ymsign + months + 'm' : '') +
            (days ? dayssign + days + 'd' : '') +
            (hours || minutes || seconds ? 't' : '') +
            (hours ? hmssign + hours + 'h' : '') +
            (minutes ? hmssign + minutes + 'm' : '') +
            (seconds ? hmssign + s + 's' : '')
        );
    }

    var proto$2 = duration.prototype;

    proto$2.isvalid = isvalid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asmilliseconds = asmilliseconds;
    proto$2.asseconds = asseconds;
    proto$2.asminutes = asminutes;
    proto$2.ashours = ashours;
    proto$2.asdays = asdays;
    proto$2.asweeks = asweeks;
    proto$2.asmonths = asmonths;
    proto$2.asquarters = asquarters;
    proto$2.asyears = asyears;
    proto$2.valueof = valueof$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toisostring = toisostring$1;
    proto$2.tostring = toisostring$1;
    proto$2.tojson = toisostring$1;
    proto$2.locale = locale;
    proto$2.localedata = localedata;

    proto$2.toisostring = deprecate(
        'toisostring() is deprecated. please use toisostring() instead (notice the capitals)',
        toisostring$1
    );
    proto$2.lang = lang;

    // formatting

    addformattoken('x', 0, 0, 'unix');
    addformattoken('x', 0, 0, 'valueof');

    // parsing

    addregextoken('x', matchsigned);
    addregextoken('x', matchtimestamp);
    addparsetoken('x', function (input, array, config) {
        config._d = new date(parsefloat(input) * 1000);
    });
    addparsetoken('x', function (input, array, config) {
        config._d = new date(toint(input));
    });

    //! moment.js

    hooks.version = '2.30.1';

    sethookcallback(createlocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createutc;
    hooks.unix = createunix;
    hooks.months = listmonths;
    hooks.isdate = isdate;
    hooks.locale = getsetgloballocale;
    hooks.invalid = createinvalid;
    hooks.duration = createduration;
    hooks.ismoment = ismoment;
    hooks.weekdays = listweekdays;
    hooks.parsezone = createinzone;
    hooks.localedata = getlocale;
    hooks.isduration = isduration;
    hooks.monthsshort = listmonthsshort;
    hooks.weekdaysmin = listweekdaysmin;
    hooks.definelocale = definelocale;
    hooks.updatelocale = updatelocale;
    hooks.locales = listlocales;
    hooks.weekdaysshort = listweekdaysshort;
    hooks.normalizeunits = normalizeunits;
    hooks.relativetimerounding = getsetrelativetimerounding;
    hooks.relativetimethreshold = getsetrelativetimethreshold;
    hooks.calendarformat = getcalendarformat;
    hooks.prototype = proto;

    // currently html5 input type only supports 24-hour formats
    hooks.html5_fmt = {
        datetime_local: 'yyyy-mm-ddthh:mm', // <input type="datetime-local" />
        datetime_local_seconds: 'yyyy-mm-ddthh:mm:ss', // <input type="datetime-local" step="1" />
        datetime_local_ms: 'yyyy-mm-ddthh:mm:ss.sss', // <input type="datetime-local" step="0.001" />
        date: 'yyyy-mm-dd', // <input type="date" />
        time: 'hh:mm', // <input type="time" />
        time_seconds: 'hh:mm:ss', // <input type="time" step="1" />
        time_ms: 'hh:mm:ss.sss', // <input type="time" step="0.001" />
        week: 'gggg-[w]ww', // <input type="week" />
        month: 'yyyy-mm', // <input type="month" />
    };

    return hooks;

})));


