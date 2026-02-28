/**
 * @license
 * lodash <https://lodash.com/>
 * copyright openjs foundation and other contributors <https://openjsf.org/>
 * released under mit license <https://lodash.com/license>
 * based on underscore.js 1.8.3 <http://underscorejs.org/license>
 * copyright jeremy ashkenas, documentcloud and investigative reporters & editors
 */
;(function() {

  /** used as a safe reference for `undefined` in pre-es5 environments. */
  var undefined;

  /** used as the semantic version number. */
  var version = '4.17.21';

  /** used as the size to enable large array optimizations. */
  var large_array_size = 200;

  /** error message constants. */
  var core_error_text = 'unsupported core-js use. try https://npms.io/search?q=ponyfill.',
      func_error_text = 'expected a function',
      invalid_templ_var_error_text = 'invalid `variable` option passed into `_.template`';

  /** used to stand-in for `undefined` hash values. */
  var hash_undefined = '__lodash_hash_undefined__';

  /** used as the maximum memoize cache size. */
  var max_memoize_size = 500;

  /** used as the internal argument placeholder. */
  var placeholder = '__lodash_placeholder__';

  /** used to compose bitmasks for cloning. */
  var clone_deep_flag = 1,
      clone_flat_flag = 2,
      clone_symbols_flag = 4;

  /** used to compose bitmasks for value comparisons. */
  var compare_partial_flag = 1,
      compare_unordered_flag = 2;

  /** used to compose bitmasks for function metadata. */
  var wrap_bind_flag = 1,
      wrap_bind_key_flag = 2,
      wrap_curry_bound_flag = 4,
      wrap_curry_flag = 8,
      wrap_curry_right_flag = 16,
      wrap_partial_flag = 32,
      wrap_partial_right_flag = 64,
      wrap_ary_flag = 128,
      wrap_rearg_flag = 256,
      wrap_flip_flag = 512;

  /** used as default options for `_.truncate`. */
  var default_trunc_length = 30,
      default_trunc_omission = '...';

  /** used to detect hot functions by number of calls within a span of milliseconds. */
  var hot_count = 800,
      hot_span = 16;

  /** used to indicate the type of lazy iteratees. */
  var lazy_filter_flag = 1,
      lazy_map_flag = 2,
      lazy_while_flag = 3;

  /** used as references for various `number` constants. */
  var infinity = 1 / 0,
      max_safe_integer = 9007199254740991,
      max_integer = 1.7976931348623157e+308,
      nan = 0 / 0;

  /** used as references for the maximum length and index of an array. */
  var max_array_length = 4294967295,
      max_array_index = max_array_length - 1,
      half_max_array_length = max_array_length >>> 1;

  /** used to associate wrap methods with their bit flags. */
  var wrapflags = [
    ['ary', wrap_ary_flag],
    ['bind', wrap_bind_flag],
    ['bindkey', wrap_bind_key_flag],
    ['curry', wrap_curry_flag],
    ['curryright', wrap_curry_right_flag],
    ['flip', wrap_flip_flag],
    ['partial', wrap_partial_flag],
    ['partialright', wrap_partial_right_flag],
    ['rearg', wrap_rearg_flag]
  ];

  /** `object#tostring` result references. */
  var argstag = '[object arguments]',
      arraytag = '[object array]',
      asynctag = '[object asyncfunction]',
      booltag = '[object boolean]',
      datetag = '[object date]',
      domexctag = '[object domexception]',
      errortag = '[object error]',
      functag = '[object function]',
      gentag = '[object generatorfunction]',
      maptag = '[object map]',
      numbertag = '[object number]',
      nulltag = '[object null]',
      objecttag = '[object object]',
      promisetag = '[object promise]',
      proxytag = '[object proxy]',
      regexptag = '[object regexp]',
      settag = '[object set]',
      stringtag = '[object string]',
      symboltag = '[object symbol]',
      undefinedtag = '[object undefined]',
      weakmaptag = '[object weakmap]',
      weaksettag = '[object weakset]';

  var arraybuffertag = '[object arraybuffer]',
      dataviewtag = '[object dataview]',
      float32tag = '[object float32array]',
      float64tag = '[object float64array]',
      int8tag = '[object int8array]',
      int16tag = '[object int16array]',
      int32tag = '[object int32array]',
      uint8tag = '[object uint8array]',
      uint8clampedtag = '[object uint8clampedarray]',
      uint16tag = '[object uint16array]',
      uint32tag = '[object uint32array]';

  /** used to match empty string literals in compiled template source. */
  var reemptystringleading = /\b__p \+= '';/g,
      reemptystringmiddle = /\b(__p \+=) '' \+/g,
      reemptystringtrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** used to match html entities and html characters. */
  var reescapedhtml = /&(?:amp|lt|gt|quot|#39);/g,
      reunescapedhtml = /[&<>"']/g,
      rehasescapedhtml = regexp(reescapedhtml.source),
      rehasunescapedhtml = regexp(reunescapedhtml.source);

  /** used to match template delimiters. */
  var reescape = /<%-([\s\s]+?)%>/g,
      reevaluate = /<%([\s\s]+?)%>/g,
      reinterpolate = /<%=([\s\s]+?)%>/g;

  /** used to match property names within property paths. */
  var reisdeepprop = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reisplainprop = /^\w*$/,
      repropname = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * used to match `regexp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reregexpchar = /[\\^$.*+?()[\]{}|]/g,
      rehasregexpchar = regexp(reregexpchar.source);

  /** used to match leading whitespace. */
  var retrimstart = /^\s+/;

  /** used to match a single whitespace character. */
  var rewhitespace = /\s/;

  /** used to match wrap detail comments. */
  var rewrapcomment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      rewrapdetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      resplitdetails = /,? & /;

  /** used to match words composed of alphanumeric characters. */
  var reasciiword = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /**
   * used to validate the `validate` option in `_.template` variable.
   *
   * forbids characters which could potentially change the meaning of the function argument definition:
   * - "()," (modification of function parameters)
   * - "=" (default value)
   * - "[]{}" (destructuring of function parameters)
   * - "/" (beginning of a comment)
   * - whitespace
   */
  var reforbiddenidentifierchars = /[()=,{}\[\]\/\s]/;

  /** used to match backslashes in property paths. */
  var reescapechar = /\\(\\)?/g;

  /**
   * used to match
   * [es template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reestemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** used to match `regexp` flags from their coerced string values. */
  var reflags = /\w*$/;

  /** used to detect bad signed hexadecimal string values. */
  var reisbadhex = /^[-+]0x[0-9a-f]+$/i;

  /** used to detect binary string values. */
  var reisbinary = /^0b[01]+$/i;

  /** used to detect host constructors (safari). */
  var reishostctor = /^\[object .+?constructor\]$/;

  /** used to detect octal string values. */
  var reisoctal = /^0o[0-7]+$/i;

  /** used to detect unsigned integer values. */
  var reisuint = /^(?:0|[1-9]\d*)$/;

  /** used to match latin unicode letters (excluding mathematical operators). */
  var relatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** used to ensure capturing order of template delimiters. */
  var renomatch = /($^)/;

  /** used to match unescaped characters in compiled string literals. */
  var reunescapedstring = /['\n\r\u2028\u2029\\]/g;

  /** used to compose unicode character classes. */
  var rsastralrange = '\\ud800-\\udfff',
      rscombomarksrange = '\\u0300-\\u036f',
      recombohalfmarksrange = '\\ufe20-\\ufe2f',
      rscombosymbolsrange = '\\u20d0-\\u20ff',
      rscomborange = rscombomarksrange + recombohalfmarksrange + rscombosymbolsrange,
      rsdingbatrange = '\\u2700-\\u27bf',
      rslowerrange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsmathoprange = '\\xac\\xb1\\xd7\\xf7',
      rsnoncharrange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rspunctuationrange = '\\u2000-\\u206f',
      rsspacerange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsupperrange = 'a-z\\xc0-\\xd6\\xd8-\\xde',
      rsvarrange = '\\ufe0e\\ufe0f',
      rsbreakrange = rsmathoprange + rsnoncharrange + rspunctuationrange + rsspacerange;

  /** used to compose unicode capture groups. */
  var rsapos = "['\u2019]",
      rsastral = '[' + rsastralrange + ']',
      rsbreak = '[' + rsbreakrange + ']',
      rscombo = '[' + rscomborange + ']',
      rsdigits = '\\d+',
      rsdingbat = '[' + rsdingbatrange + ']',
      rslower = '[' + rslowerrange + ']',
      rsmisc = '[^' + rsastralrange + rsbreakrange + rsdigits + rsdingbatrange + rslowerrange + rsupperrange + ']',
      rsfitz = '\\ud83c[\\udffb-\\udfff]',
      rsmodifier = '(?:' + rscombo + '|' + rsfitz + ')',
      rsnonastral = '[^' + rsastralrange + ']',
      rsregional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rssurrpair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsupper = '[' + rsupperrange + ']',
      rszwj = '\\u200d';

  /** used to compose unicode regexes. */
  var rsmisclower = '(?:' + rslower + '|' + rsmisc + ')',
      rsmiscupper = '(?:' + rsupper + '|' + rsmisc + ')',
      rsoptcontrlower = '(?:' + rsapos + '(?:d|ll|m|re|s|t|ve))?',
      rsoptcontrupper = '(?:' + rsapos + '(?:d|ll|m|re|s|t|ve))?',
      reoptmod = rsmodifier + '?',
      rsoptvar = '[' + rsvarrange + ']?',
      rsoptjoin = '(?:' + rszwj + '(?:' + [rsnonastral, rsregional, rssurrpair].join('|') + ')' + rsoptvar + reoptmod + ')*',
      rsordlower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[a-z_])',
      rsordupper = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[a-z_])',
      rsseq = rsoptvar + reoptmod + rsoptjoin,
      rsemoji = '(?:' + [rsdingbat, rsregional, rssurrpair].join('|') + ')' + rsseq,
      rssymbol = '(?:' + [rsnonastral + rscombo + '?', rscombo, rsregional, rssurrpair, rsastral].join('|') + ')';

  /** used to match apostrophes. */
  var reapos = regexp(rsapos, 'g');

  /**
   * used to match [combining diacritical marks](https://en.wikipedia.org/wiki/combining_diacritical_marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/combining_diacritical_marks_for_symbols).
   */
  var recombomark = regexp(rscombo, 'g');

  /** used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reunicode = regexp(rsfitz + '(?=' + rsfitz + ')|' + rssymbol + rsseq, 'g');

  /** used to match complex or compound words. */
  var reunicodeword = regexp([
    rsupper + '?' + rslower + '+' + rsoptcontrlower + '(?=' + [rsbreak, rsupper, '$'].join('|') + ')',
    rsmiscupper + '+' + rsoptcontrupper + '(?=' + [rsbreak, rsupper + rsmisclower, '$'].join('|') + ')',
    rsupper + '?' + rsmisclower + '+' + rsoptcontrlower,
    rsupper + '+' + rsoptcontrupper,
    rsordupper,
    rsordlower,
    rsdigits,
    rsemoji
  ].join('|'), 'g');

  /** used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var rehasunicode = regexp('[' + rszwj + rsastralrange  + rscomborange + rsvarrange + ']');

  /** used to detect strings that need a more robust regexp to match words. */
  var rehasunicodeword = /[a-z][a-z]|[a-z]{2}[a-z]|[0-9][a-za-z]|[a-za-z][0-9]|[^a-za-z0-9 ]/;

  /** used to assign default `context` object properties. */
  var contextprops = [
    'array', 'buffer', 'dataview', 'date', 'error', 'float32array', 'float64array',
    'function', 'int8array', 'int16array', 'int32array', 'map', 'math', 'object',
    'promise', 'regexp', 'set', 'string', 'symbol', 'typeerror', 'uint8array',
    'uint8clampedarray', 'uint16array', 'uint32array', 'weakmap',
    '_', 'cleartimeout', 'isfinite', 'parseint', 'settimeout'
  ];

  /** used to make template sourceurls easier to identify. */
  var templatecounter = -1;

  /** used to identify `tostringtag` values of typed arrays. */
  var typedarraytags = {};
  typedarraytags[float32tag] = typedarraytags[float64tag] =
  typedarraytags[int8tag] = typedarraytags[int16tag] =
  typedarraytags[int32tag] = typedarraytags[uint8tag] =
  typedarraytags[uint8clampedtag] = typedarraytags[uint16tag] =
  typedarraytags[uint32tag] = true;
  typedarraytags[argstag] = typedarraytags[arraytag] =
  typedarraytags[arraybuffertag] = typedarraytags[booltag] =
  typedarraytags[dataviewtag] = typedarraytags[datetag] =
  typedarraytags[errortag] = typedarraytags[functag] =
  typedarraytags[maptag] = typedarraytags[numbertag] =
  typedarraytags[objecttag] = typedarraytags[regexptag] =
  typedarraytags[settag] = typedarraytags[stringtag] =
  typedarraytags[weakmaptag] = false;

  /** used to identify `tostringtag` values supported by `_.clone`. */
  var cloneabletags = {};
  cloneabletags[argstag] = cloneabletags[arraytag] =
  cloneabletags[arraybuffertag] = cloneabletags[dataviewtag] =
  cloneabletags[booltag] = cloneabletags[datetag] =
  cloneabletags[float32tag] = cloneabletags[float64tag] =
  cloneabletags[int8tag] = cloneabletags[int16tag] =
  cloneabletags[int32tag] = cloneabletags[maptag] =
  cloneabletags[numbertag] = cloneabletags[objecttag] =
  cloneabletags[regexptag] = cloneabletags[settag] =
  cloneabletags[stringtag] = cloneabletags[symboltag] =
  cloneabletags[uint8tag] = cloneabletags[uint8clampedtag] =
  cloneabletags[uint16tag] = cloneabletags[uint32tag] = true;
  cloneabletags[errortag] = cloneabletags[functag] =
  cloneabletags[weakmaptag] = false;

  /** used to map latin unicode letters to basic latin letters. */
  var deburredletters = {
    // latin-1 supplement block.
    '\xc0': 'a',  '\xc1': 'a', '\xc2': 'a', '\xc3': 'a', '\xc4': 'a', '\xc5': 'a',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'c',  '\xe7': 'c',
    '\xd0': 'd',  '\xf0': 'd',
    '\xc8': 'e',  '\xc9': 'e', '\xca': 'e', '\xcb': 'e',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'i',  '\xcd': 'i', '\xce': 'i', '\xcf': 'i',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'n',  '\xf1': 'n',
    '\xd2': 'o',  '\xd3': 'o', '\xd4': 'o', '\xd5': 'o', '\xd6': 'o', '\xd8': 'o',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'u',  '\xda': 'u', '\xdb': 'u', '\xdc': 'u',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'ae', '\xe6': 'ae',
    '\xde': 'th', '\xfe': 'th',
    '\xdf': 'ss',
    // latin extended-a block.
    '\u0100': 'a',  '\u0102': 'a', '\u0104': 'a',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'c',  '\u0108': 'c', '\u010a': 'c', '\u010c': 'c',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'd',  '\u0110': 'd', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'e',  '\u0114': 'e', '\u0116': 'e', '\u0118': 'e', '\u011a': 'e',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'g',  '\u011e': 'g', '\u0120': 'g', '\u0122': 'g',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'h',  '\u0126': 'h', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'i',  '\u012a': 'i', '\u012c': 'i', '\u012e': 'i', '\u0130': 'i',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'j',  '\u0135': 'j',
    '\u0136': 'k',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'l',  '\u013b': 'l', '\u013d': 'l', '\u013f': 'l', '\u0141': 'l',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'n',  '\u0145': 'n', '\u0147': 'n', '\u014a': 'n',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'o',  '\u014e': 'o', '\u0150': 'o',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'r',  '\u0156': 'r', '\u0158': 'r',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 's',  '\u015c': 's', '\u015e': 's', '\u0160': 's',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 't',  '\u0164': 't', '\u0166': 't',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'u',  '\u016a': 'u', '\u016c': 'u', '\u016e': 'u', '\u0170': 'u', '\u0172': 'u',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'w',  '\u0175': 'w',
    '\u0176': 'y',  '\u0177': 'y', '\u0178': 'y',
    '\u0179': 'z',  '\u017b': 'z', '\u017d': 'z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'ij', '\u0133': 'ij',
    '\u0152': 'oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** used to map characters to html entities. */
  var htmlescapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** used to map html entities to characters. */
  var htmlunescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** used to escape characters for inclusion in compiled string literals. */
  var stringescapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** built-in method references without a dependency on `root`. */
  var freeparsefloat = parsefloat,
      freeparseint = parseint;

  /** detect free variable `global` from node.js. */
  var freeglobal = typeof global == 'object' && global && global.object === object && global;

  /** detect free variable `self`. */
  var freeself = typeof self == 'object' && self && self.object === object && self;

  /** used as a reference to the global object. */
  var root = freeglobal || freeself || function('return this')();

  /** detect free variable `exports`. */
  var freeexports = typeof exports == 'object' && exports && !exports.nodetype && exports;

  /** detect free variable `module`. */
  var freemodule = freeexports && typeof module == 'object' && module && !module.nodetype && module;

  /** detect the popular commonjs extension `module.exports`. */
  var moduleexports = freemodule && freemodule.exports === freeexports;

  /** detect free variable `process` from node.js. */
  var freeprocess = moduleexports && freeglobal.process;

  /** used to access faster node.js helpers. */
  var nodeutil = (function() {
    try {
      // use `util.types` for node.js 10+.
      var types = freemodule && freemodule.require && freemodule.require('util').types;

      if (types) {
        return types;
      }

      // legacy `process.binding('util')` for node.js < 10.
      return freeprocess && freeprocess.binding && freeprocess.binding('util');
    } catch (e) {}
  }());

  /* node.js helper references. */
  var nodeisarraybuffer = nodeutil && nodeutil.isarraybuffer,
      nodeisdate = nodeutil && nodeutil.isdate,
      nodeismap = nodeutil && nodeutil.ismap,
      nodeisregexp = nodeutil && nodeutil.isregexp,
      nodeisset = nodeutil && nodeutil.isset,
      nodeistypedarray = nodeutil && nodeutil.istypedarray;

  /*--------------------------------------------------------------------------*/

  /**
   * a faster alternative to `function#apply`, this function invokes `func`
   * with the `this` binding of `thisarg` and the arguments of `args`.
   *
   * @private
   * @param {function} func the function to invoke.
   * @param {*} thisarg the `this` binding of `func`.
   * @param {array} args the arguments to invoke `func` with.
   * @returns {*} returns the result of `func`.
   */
  function apply(func, thisarg, args) {
    switch (args.length) {
      case 0: return func.call(thisarg);
      case 1: return func.call(thisarg, args[0]);
      case 2: return func.call(thisarg, args[0], args[1]);
      case 3: return func.call(thisarg, args[0], args[1], args[2]);
    }
    return func.apply(thisarg, args);
  }

  /**
   * a specialized version of `baseaggregator` for arrays.
   *
   * @private
   * @param {array} [array] the array to iterate over.
   * @param {function} setter the function to set `accumulator` values.
   * @param {function} iteratee the iteratee to transform keys.
   * @param {object} accumulator the initial aggregated object.
   * @returns {function} returns `accumulator`.
   */
  function arrayaggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * a specialized version of `_.foreach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {array} [array] the array to iterate over.
   * @param {function} iteratee the function invoked per iteration.
   * @returns {array} returns `array`.
   */
  function arrayeach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * a specialized version of `_.foreachright` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {array} [array] the array to iterate over.
   * @param {function} iteratee the function invoked per iteration.
   * @returns {array} returns `array`.
   */
  function arrayeachright(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * a specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {array} [array] the array to iterate over.
   * @param {function} predicate the function invoked per iteration.
   * @returns {boolean} returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayevery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * a specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {array} [array] the array to iterate over.
   * @param {function} predicate the function invoked per iteration.
   * @returns {array} returns the new filtered array.
   */
  function arrayfilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resindex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resindex++] = value;
      }
    }
    return result;
  }

  /**
   * a specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {array} [array] the array to inspect.
   * @param {*} target the value to search for.
   * @returns {boolean} returns `true` if `target` is found, else `false`.
   */
  function arrayincludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseindexof(array, value, 0) > -1;
  }

  /**
   * this function is like `arrayincludes` except that it accepts a comparator.
   *
   * @private
   * @param {array} [array] the array to inspect.
   * @param {*} target the value to search for.
   * @param {function} comparator the comparator invoked per element.
   * @returns {boolean} returns `true` if `target` is found, else `false`.
   */
  function arrayincludeswith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * a specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {array} [array] the array to iterate over.
   * @param {function} iteratee the function invoked per iteration.
   * @returns {array} returns the new mapped array.
   */
  function arraymap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * appends the elements of `values` to `array`.
   *
   * @private
   * @param {array} array the array to modify.
   * @param {array} values the values to append.
   * @returns {array} returns `array`.
   */
  function arraypush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * a specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {array} [array] the array to iterate over.
   * @param {function} iteratee the function invoked per iteration.
   * @param {*} [accumulator] the initial value.
   * @param {boolean} [initaccum] specify using the first element of `array` as
   *  the initial value.
   * @returns {*} returns the accumulated value.
   */
  function arrayreduce(array, iteratee, accumulator, initaccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initaccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * a specialized version of `_.reduceright` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {array} [array] the array to iterate over.
   * @param {function} iteratee the function invoked per iteration.
   * @param {*} [accumulator] the initial value.
   * @param {boolean} [initaccum] specify using the last element of `array` as
   *  the initial value.
   * @returns {*} returns the accumulated value.
   */
  function arrayreduceright(array, iteratee, accumulator, initaccum) {
    var length = array == null ? 0 : array.length;
    if (initaccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * a specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {array} [array] the array to iterate over.
   * @param {function} predicate the function invoked per iteration.
   * @returns {boolean} returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraysome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * gets the size of an ascii `string`.
   *
   * @private
   * @param {string} string the string inspect.
   * @returns {number} returns the string size.
   */
  var asciisize = baseproperty('length');

  /**
   * converts an ascii `string` to an array.
   *
   * @private
   * @param {string} string the string to convert.
   * @returns {array} returns the converted array.
   */
  function asciitoarray(string) {
    return string.split('');
  }

  /**
   * splits an ascii `string` into an array of its words.
   *
   * @private
   * @param {string} the string to inspect.
   * @returns {array} returns the words of `string`.
   */
  function asciiwords(string) {
    return string.match(reasciiword) || [];
  }

  /**
   * the base implementation of methods like `_.findkey` and `_.findlastkey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachfunc`.
   *
   * @private
   * @param {array|object} collection the collection to inspect.
   * @param {function} predicate the function invoked per iteration.
   * @param {function} eachfunc the function to iterate over `collection`.
   * @returns {*} returns the found element or its key, else `undefined`.
   */
  function basefindkey(collection, predicate, eachfunc) {
    var result;
    eachfunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * the base implementation of `_.findindex` and `_.findlastindex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {array} array the array to inspect.
   * @param {function} predicate the function invoked per iteration.
   * @param {number} fromindex the index to search from.
   * @param {boolean} [fromright] specify iterating from right to left.
   * @returns {number} returns the index of the matched value, else `-1`.
   */
  function basefindindex(array, predicate, fromindex, fromright) {
    var length = array.length,
        index = fromindex + (fromright ? 1 : -1);

    while ((fromright ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * the base implementation of `_.indexof` without `fromindex` bounds checks.
   *
   * @private
   * @param {array} array the array to inspect.
   * @param {*} value the value to search for.
   * @param {number} fromindex the index to search from.
   * @returns {number} returns the index of the matched value, else `-1`.
   */
  function baseindexof(array, value, fromindex) {
    return value === value
      ? strictindexof(array, value, fromindex)
      : basefindindex(array, baseisnan, fromindex);
  }

  /**
   * this function is like `baseindexof` except that it accepts a comparator.
   *
   * @private
   * @param {array} array the array to inspect.
   * @param {*} value the value to search for.
   * @param {number} fromindex the index to search from.
   * @param {function} comparator the comparator invoked per element.
   * @returns {number} returns the index of the matched value, else `-1`.
   */
  function baseindexofwith(array, value, fromindex, comparator) {
    var index = fromindex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * the base implementation of `_.isnan` without support for number objects.
   *
   * @private
   * @param {*} value the value to check.
   * @returns {boolean} returns `true` if `value` is `nan`, else `false`.
   */
  function baseisnan(value) {
    return value !== value;
  }

  /**
   * the base implementation of `_.mean` and `_.meanby` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {array} array the array to iterate over.
   * @param {function} iteratee the function invoked per iteration.
   * @returns {number} returns the mean.
   */
  function basemean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (basesum(array, iteratee) / length) : nan;
  }

  /**
   * the base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key the key of the property to get.
   * @returns {function} returns the new accessor function.
   */
  function baseproperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * the base implementation of `_.propertyof` without support for deep paths.
   *
   * @private
   * @param {object} object the object to query.
   * @returns {function} returns the new accessor function.
   */
  function basepropertyof(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * the base implementation of `_.reduce` and `_.reduceright`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachfunc`.
   *
   * @private
   * @param {array|object} collection the collection to iterate over.
   * @param {function} iteratee the function invoked per iteration.
   * @param {*} accumulator the initial value.
   * @param {boolean} initaccum specify using the first or last element of
   *  `collection` as the initial value.
   * @param {function} eachfunc the function to iterate over `collection`.
   * @returns {*} returns the accumulated value.
   */
  function basereduce(collection, iteratee, accumulator, initaccum, eachfunc) {
    eachfunc(collection, function(value, index, collection) {
      accumulator = initaccum
        ? (initaccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * the base implementation of `_.sortby` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {array} array the array to sort.
   * @param {function} comparer the function to define sort order.
   * @returns {array} returns `array`.
   */
  function basesortby(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * the base implementation of `_.sum` and `_.sumby` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {array} array the array to iterate over.
   * @param {function} iteratee the function invoked per iteration.
   * @returns {number} returns the sum.
   */
  function basesum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * the base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n the number of times to invoke `iteratee`.
   * @param {function} iteratee the function invoked per iteration.
   * @returns {array} returns the array of results.
   */
  function basetimes(n, iteratee) {
    var index = -1,
        result = array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * the base implementation of `_.topairs` and `_.topairsin` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {object} object the object to query.
   * @param {array} props the property names to get values for.
   * @returns {object} returns the key-value pairs.
   */
  function basetopairs(object, props) {
    return arraymap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * the base implementation of `_.trim`.
   *
   * @private
   * @param {string} string the string to trim.
   * @returns {string} returns the trimmed string.
   */
  function basetrim(string) {
    return string
      ? string.slice(0, trimmedendindex(string) + 1).replace(retrimstart, '')
      : string;
  }

  /**
   * the base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {function} func the function to cap arguments for.
   * @returns {function} returns the new capped function.
   */
  function baseunary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * the base implementation of `_.values` and `_.valuesin` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {object} object the object to query.
   * @param {array} props the property names to get values for.
   * @returns {object} returns the array of property values.
   */
  function basevalues(object, props) {
    return arraymap(props, function(key) {
      return object[key];
    });
  }

  /**
   * checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {object} cache the cache to query.
   * @param {string} key the key of the entry to check.
   * @returns {boolean} returns `true` if an entry for `key` exists, else `false`.
   */
  function cachehas(cache, key) {
    return cache.has(key);
  }

  /**
   * used by `_.trim` and `_.trimstart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {array} strsymbols the string symbols to inspect.
   * @param {array} chrsymbols the character symbols to find.
   * @returns {number} returns the index of the first unmatched string symbol.
   */
  function charsstartindex(strsymbols, chrsymbols) {
    var index = -1,
        length = strsymbols.length;

    while (++index < length && baseindexof(chrsymbols, strsymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * used by `_.trim` and `_.trimend` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {array} strsymbols the string symbols to inspect.
   * @param {array} chrsymbols the character symbols to find.
   * @returns {number} returns the index of the last unmatched string symbol.
   */
  function charsendindex(strsymbols, chrsymbols) {
    var index = strsymbols.length;

    while (index-- && baseindexof(chrsymbols, strsymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {array} array the array to inspect.
   * @param {*} placeholder the placeholder to search for.
   * @returns {number} returns the placeholder count.
   */
  function countholders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * used by `_.deburr` to convert latin-1 supplement and latin extended-a
   * letters to basic latin letters.
   *
   * @private
   * @param {string} letter the matched letter to deburr.
   * @returns {string} returns the deburred letter.
   */
  var deburrletter = basepropertyof(deburredletters);

  /**
   * used by `_.escape` to convert characters to html entities.
   *
   * @private
   * @param {string} chr the matched character to escape.
   * @returns {string} returns the escaped character.
   */
  var escapehtmlchar = basepropertyof(htmlescapes);

  /**
   * used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr the matched character to escape.
   * @returns {string} returns the escaped character.
   */
  function escapestringchar(chr) {
    return '\\' + stringescapes[chr];
  }

  /**
   * gets the value at `key` of `object`.
   *
   * @private
   * @param {object} [object] the object to query.
   * @param {string} key the key of the property to get.
   * @returns {*} returns the property value.
   */
  function getvalue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * checks if `string` contains unicode symbols.
   *
   * @private
   * @param {string} string the string to inspect.
   * @returns {boolean} returns `true` if a symbol is found, else `false`.
   */
  function hasunicode(string) {
    return rehasunicode.test(string);
  }

  /**
   * checks if `string` contains a word composed of unicode symbols.
   *
   * @private
   * @param {string} string the string to inspect.
   * @returns {boolean} returns `true` if a word is found, else `false`.
   */
  function hasunicodeword(string) {
    return rehasunicodeword.test(string);
  }

  /**
   * converts `iterator` to an array.
   *
   * @private
   * @param {object} iterator the iterator to convert.
   * @returns {array} returns the converted array.
   */
  function iteratortoarray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * converts `map` to its key-value pairs.
   *
   * @private
   * @param {object} map the map to convert.
   * @returns {array} returns the key-value pairs.
   */
  function maptoarray(map) {
    var index = -1,
        result = array(map.size);

    map.foreach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {function} func the function to wrap.
   * @param {function} transform the argument transform.
   * @returns {function} returns the new function.
   */
  function overarg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {array} array the array to modify.
   * @param {*} placeholder the placeholder to replace.
   * @returns {array} returns the new array of placeholder indexes.
   */
  function replaceholders(array, placeholder) {
    var index = -1,
        length = array.length,
        resindex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === placeholder) {
        array[index] = placeholder;
        result[resindex++] = index;
      }
    }
    return result;
  }

  /**
   * converts `set` to an array of its values.
   *
   * @private
   * @param {object} set the set to convert.
   * @returns {array} returns the values.
   */
  function settoarray(set) {
    var index = -1,
        result = array(set.size);

    set.foreach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * converts `set` to its value-value pairs.
   *
   * @private
   * @param {object} set the set to convert.
   * @returns {array} returns the value-value pairs.
   */
  function settopairs(set) {
    var index = -1,
        result = array(set.size);

    set.foreach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * a specialized version of `_.indexof` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {array} array the array to inspect.
   * @param {*} value the value to search for.
   * @param {number} fromindex the index to search from.
   * @returns {number} returns the index of the matched value, else `-1`.
   */
  function strictindexof(array, value, fromindex) {
    var index = fromindex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * a specialized version of `_.lastindexof` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {array} array the array to inspect.
   * @param {*} value the value to search for.
   * @param {number} fromindex the index to search from.
   * @returns {number} returns the index of the matched value, else `-1`.
   */
  function strictlastindexof(array, value, fromindex) {
    var index = fromindex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string the string to inspect.
   * @returns {number} returns the string size.
   */
  function stringsize(string) {
    return hasunicode(string)
      ? unicodesize(string)
      : asciisize(string);
  }

  /**
   * converts `string` to an array.
   *
   * @private
   * @param {string} string the string to convert.
   * @returns {array} returns the converted array.
   */
  function stringtoarray(string) {
    return hasunicode(string)
      ? unicodetoarray(string)
      : asciitoarray(string);
  }

  /**
   * used by `_.trim` and `_.trimend` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string the string to inspect.
   * @returns {number} returns the index of the last non-whitespace character.
   */
  function trimmedendindex(string) {
    var index = string.length;

    while (index-- && rewhitespace.test(string.charat(index))) {}
    return index;
  }

  /**
   * used by `_.unescape` to convert html entities to characters.
   *
   * @private
   * @param {string} chr the matched character to unescape.
   * @returns {string} returns the unescaped character.
   */
  var unescapehtmlchar = basepropertyof(htmlunescapes);

  /**
   * gets the size of a unicode `string`.
   *
   * @private
   * @param {string} string the string inspect.
   * @returns {number} returns the string size.
   */
  function unicodesize(string) {
    var result = reunicode.lastindex = 0;
    while (reunicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * converts a unicode `string` to an array.
   *
   * @private
   * @param {string} string the string to convert.
   * @returns {array} returns the converted array.
   */
  function unicodetoarray(string) {
    return string.match(reunicode) || [];
  }

  /**
   * splits a unicode `string` into an array of its words.
   *
   * @private
   * @param {string} the string to inspect.
   * @returns {array} returns the words of `string`.
   */
  function unicodewords(string) {
    return string.match(reunicodeword) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberof _
   * @since 1.1.0
   * @category util
   * @param {object} [context=root] the context object.
   * @returns {function} returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runincontext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isfunction(_.foo);
   * // => true
   * _.isfunction(_.bar);
   * // => false
   *
   * lodash.isfunction(lodash.foo);
   * // => false
   * lodash.isfunction(lodash.bar);
   * // => true
   *
   * // create a suped-up `defer` in node.js.
   * var defer = _.runincontext({ 'settimeout': setimmediate }).defer;
   */
  var runincontext = (function runincontext(context) {
    context = context == null ? root : _.defaults(root.object(), context, _.pick(root, contextprops));

    /** built-in constructor references. */
    var array = context.array,
        date = context.date,
        error = context.error,
        function = context.function,
        math = context.math,
        object = context.object,
        regexp = context.regexp,
        string = context.string,
        typeerror = context.typeerror;

    /** used for built-in method references. */
    var arrayproto = array.prototype,
        funcproto = function.prototype,
        objectproto = object.prototype;

    /** used to detect overreaching core-js shims. */
    var corejsdata = context['__core-js_shared__'];

    /** used to resolve the decompiled source of functions. */
    var functostring = funcproto.tostring;

    /** used to check objects for own properties. */
    var hasownproperty = objectproto.hasownproperty;

    /** used to generate unique ids. */
    var idcounter = 0;

    /** used to detect methods masquerading as native. */
    var masksrckey = (function() {
      var uid = /[^.]+$/.exec(corejsdata && corejsdata.keys && corejsdata.keys.ie_proto || '');
      return uid ? ('symbol(src)_1.' + uid) : '';
    }());

    /**
     * used to resolve the
     * [`tostringtag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeobjecttostring = objectproto.tostring;

    /** used to infer the `object` constructor. */
    var objectctorstring = functostring.call(object);

    /** used to restore the original `_` reference in `_.noconflict`. */
    var olddash = root._;

    /** used to detect if a method is native. */
    var reisnative = regexp('^' +
      functostring.call(hasownproperty).replace(reregexpchar, '\\$&')
      .replace(/hasownproperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** built-in value references. */
    var buffer = moduleexports ? context.buffer : undefined,
        symbol = context.symbol,
        uint8array = context.uint8array,
        allocunsafe = buffer ? buffer.allocunsafe : undefined,
        getprototype = overarg(object.getprototypeof, object),
        objectcreate = object.create,
        propertyisenumerable = objectproto.propertyisenumerable,
        splice = arrayproto.splice,
        spreadablesymbol = symbol ? symbol.isconcatspreadable : undefined,
        symiterator = symbol ? symbol.iterator : undefined,
        symtostringtag = symbol ? symbol.tostringtag : undefined;

    var defineproperty = (function() {
      try {
        var func = getnative(object, 'defineproperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** mocked built-ins. */
    var ctxcleartimeout = context.cleartimeout !== root.cleartimeout && context.cleartimeout,
        ctxnow = date && date.now !== root.date.now && date.now,
        ctxsettimeout = context.settimeout !== root.settimeout && context.settimeout;

    /* built-in method references for those with the same name as other `lodash` methods. */
    var nativeceil = math.ceil,
        nativefloor = math.floor,
        nativegetsymbols = object.getownpropertysymbols,
        nativeisbuffer = buffer ? buffer.isbuffer : undefined,
        nativeisfinite = context.isfinite,
        nativejoin = arrayproto.join,
        nativekeys = overarg(object.keys, object),
        nativemax = math.max,
        nativemin = math.min,
        nativenow = date.now,
        nativeparseint = context.parseint,
        nativerandom = math.random,
        nativereverse = arrayproto.reverse;

    /* built-in method references that are verified to be native. */
    var dataview = getnative(context, 'dataview'),
        map = getnative(context, 'map'),
        promise = getnative(context, 'promise'),
        set = getnative(context, 'set'),
        weakmap = getnative(context, 'weakmap'),
        nativecreate = getnative(object, 'create');

    /** used to store function metadata. */
    var metamap = weakmap && new weakmap;

    /** used to lookup unminified function names. */
    var realnames = {};

    /** used to detect maps, sets, and weakmaps. */
    var dataviewctorstring = tosource(dataview),
        mapctorstring = tosource(map),
        promisectorstring = tosource(promise),
        setctorstring = tosource(set),
        weakmapctorstring = tosource(weakmap);

    /** used to convert symbols to primitives and strings. */
    var symbolproto = symbol ? symbol.prototype : undefined,
        symbolvalueof = symbolproto ? symbolproto.valueof : undefined,
        symboltostring = symbolproto ? symbolproto.tostring : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. methods that operate on and return arrays, collections,
     * and functions can be chained together. methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * the execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * lazy evaluation allows several methods to support shortcut fusion.
     * shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. the heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * in addition to lodash methods, wrappers have `array` and `string` methods.
     *
     * the wrapper `array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * the wrapper `string` methods are:
     * `replace` and `split`
     *
     * the wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropright`, `dropwhile`, `filter`, `find`,
     * `findlast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeright`, `takerightwhile`, `takewhile`, and `toarray`
     *
     * the chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignin`, `assigninwith`, `assignwith`, `at`,
     * `before`, `bind`, `bindall`, `bindkey`, `castarray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countby`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsdeep`, `defer`, `delay`,
     * `difference`, `differenceby`, `differencewith`, `drop`, `dropright`,
     * `droprightwhile`, `dropwhile`, `extend`, `extendwith`, `fill`, `filter`,
     * `flatmap`, `flatmapdeep`, `flatmapdepth`, `flatten`, `flattendeep`,
     * `flattendepth`, `flip`, `flow`, `flowright`, `frompairs`, `functions`,
     * `functionsin`, `groupby`, `initial`, `intersection`, `intersectionby`,
     * `intersectionwith`, `invert`, `invertby`, `invokemap`, `iteratee`, `keyby`,
     * `keys`, `keysin`, `map`, `mapkeys`, `mapvalues`, `matches`, `matchesproperty`,
     * `memoize`, `merge`, `mergewith`, `method`, `methodof`, `mixin`, `negate`,
     * `ntharg`, `omit`, `omitby`, `once`, `orderby`, `over`, `overargs`,
     * `overevery`, `oversome`, `partial`, `partialright`, `partition`, `pick`,
     * `pickby`, `plant`, `property`, `propertyof`, `pull`, `pullall`, `pullallby`,
     * `pullallwith`, `pullat`, `push`, `range`, `rangeright`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `samplesize`, `set`, `setwith`, `shuffle`,
     * `slice`, `sort`, `sortby`, `splice`, `spread`, `tail`, `take`, `takeright`,
     * `takerightwhile`, `takewhile`, `tap`, `throttle`, `thru`, `toarray`,
     * `topairs`, `topairsin`, `topath`, `toplainobject`, `transform`, `unary`,
     * `union`, `unionby`, `unionwith`, `uniq`, `uniqby`, `uniqwith`, `unset`,
     * `unshift`, `unzip`, `unzipwith`, `update`, `updatewith`, `values`,
     * `valuesin`, `without`, `wrap`, `xor`, `xorby`, `xorwith`, `zip`,
     * `zipobject`, `zipobjectdeep`, and `zipwith`
     *
     * the wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelcase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `clonedeep`, `clonedeepwith`, `clonewith`, `conformsto`, `deburr`,
     * `defaultto`, `divide`, `each`, `eachright`, `endswith`, `eq`, `escape`,
     * `escaperegexp`, `every`, `find`, `findindex`, `findkey`, `findlast`,
     * `findlastindex`, `findlastkey`, `first`, `floor`, `foreach`, `foreachright`,
     * `forin`, `forinright`, `forown`, `forownright`, `get`, `gt`, `gte`, `has`,
     * `hasin`, `head`, `identity`, `includes`, `indexof`, `inrange`, `invoke`,
     * `isarguments`, `isarray`, `isarraybuffer`, `isarraylike`, `isarraylikeobject`,
     * `isboolean`, `isbuffer`, `isdate`, `iselement`, `isempty`, `isequal`,
     * `isequalwith`, `iserror`, `isfinite`, `isfunction`, `isinteger`, `islength`,
     * `ismap`, `ismatch`, `ismatchwith`, `isnan`, `isnative`, `isnil`, `isnull`,
     * `isnumber`, `isobject`, `isobjectlike`, `isplainobject`, `isregexp`,
     * `issafeinteger`, `isset`, `isstring`, `isundefined`, `istypedarray`,
     * `isweakmap`, `isweakset`, `join`, `kebabcase`, `last`, `lastindexof`,
     * `lowercase`, `lowerfirst`, `lt`, `lte`, `max`, `maxby`, `mean`, `meanby`,
     * `min`, `minby`, `multiply`, `noconflict`, `noop`, `now`, `nth`, `pad`,
     * `padend`, `padstart`, `parseint`, `pop`, `random`, `reduce`, `reduceright`,
     * `repeat`, `result`, `round`, `runincontext`, `sample`, `shift`, `size`,
     * `snakecase`, `some`, `sortedindex`, `sortedindexby`, `sortedlastindex`,
     * `sortedlastindexby`, `startcase`, `startswith`, `stubarray`, `stubfalse`,
     * `stubobject`, `stubstring`, `stubtrue`, `subtract`, `sum`, `sumby`,
     * `template`, `times`, `tofinite`, `tointeger`, `tojson`, `tolength`,
     * `tolower`, `tonumber`, `tosafeinteger`, `tostring`, `toupper`, `trim`,
     * `trimend`, `trimstart`, `truncate`, `unescape`, `uniqueid`, `uppercase`,
     * `upperfirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category seq
     * @param {*} value the value to wrap in a `lodash` instance.
     * @returns {object} returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isarray(squares);
     * // => false
     *
     * _.isarray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isobjectlike(value) && !isarray(value) && !(value instanceof lazywrapper)) {
        if (value instanceof lodashwrapper) {
          return value;
        }
        if (hasownproperty.call(value, '__wrapped__')) {
          return wrapperclone(value);
        }
      }
      return new lodashwrapper(value);
    }

    /**
     * the base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {object} proto the object to inherit from.
     * @returns {object} returns the new object.
     */
    var basecreate = (function() {
      function object() {}
      return function(proto) {
        if (!isobject(proto)) {
          return {};
        }
        if (objectcreate) {
          return objectcreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * the function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baselodash() {
      // no operation performed.
    }

    /**
     * the base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value the value to wrap.
     * @param {boolean} [chainall] enable explicit method chain sequences.
     */
    function lodashwrapper(value, chainall) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainall;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * by default, the template delimiters used by lodash are like those in
     * embedded ruby (erb) as well as es2015 template strings. change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberof _
     * @type {object}
     */
    lodash.templatesettings = {

      /**
       * used to detect `data` property values to be html-escaped.
       *
       * @memberof _.templatesettings
       * @type {regexp}
       */
      'escape': reescape,

      /**
       * used to detect code to be evaluated.
       *
       * @memberof _.templatesettings
       * @type {regexp}
       */
      'evaluate': reevaluate,

      /**
       * used to detect `data` property values to inject.
       *
       * @memberof _.templatesettings
       * @type {regexp}
       */
      'interpolate': reinterpolate,

      /**
       * used to reference the data object in the template text.
       *
       * @memberof _.templatesettings
       * @type {string}
       */
      'variable': '',

      /**
       * used to import variables into the compiled template.
       *
       * @memberof _.templatesettings
       * @type {object}
       */
      'imports': {

        /**
         * a reference to the `lodash` function.
         *
         * @memberof _.templatesettings.imports
         * @type {function}
         */
        '_': lodash
      }
    };

    // ensure wrappers are instances of `baselodash`.
    lodash.prototype = baselodash.prototype;
    lodash.prototype.constructor = lodash;

    lodashwrapper.prototype = basecreate(baselodash.prototype);
    lodashwrapper.prototype.constructor = lodashwrapper;

    /*------------------------------------------------------------------------*/

    /**
     * creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value the value to wrap.
     */
    function lazywrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takecount__ = max_array_length;
      this.__views__ = [];
    }

    /**
     * creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberof lazywrapper
     * @returns {object} returns the cloned `lazywrapper` object.
     */
    function lazyclone() {
      var result = new lazywrapper(this.__wrapped__);
      result.__actions__ = copyarray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyarray(this.__iteratees__);
      result.__takecount__ = this.__takecount__;
      result.__views__ = copyarray(this.__views__);
      return result;
    }

    /**
     * reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberof lazywrapper
     * @returns {object} returns the new reversed `lazywrapper` object.
     */
    function lazyreverse() {
      if (this.__filtered__) {
        var result = new lazywrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberof lazywrapper
     * @returns {*} returns the unwrapped value.
     */
    function lazyvalue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isarr = isarray(array),
          isright = dir < 0,
          arrlength = isarr ? array.length : 0,
          view = getview(0, arrlength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isright ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterlength = iteratees.length,
          resindex = 0,
          takecount = nativemin(length, this.__takecount__);

      if (!isarr || (!isright && arrlength == length && takecount == length)) {
        return basewrappervalue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resindex < takecount) {
        index += dir;

        var iterindex = -1,
            value = array[index];

        while (++iterindex < iterlength) {
          var data = iteratees[iterindex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == lazy_map_flag) {
            value = computed;
          } else if (!computed) {
            if (type == lazy_filter_flag) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resindex++] = value;
      }
      return result;
    }

    // ensure `lazywrapper` is an instance of `baselodash`.
    lazywrapper.prototype = basecreate(baselodash.prototype);
    lazywrapper.prototype.constructor = lazywrapper;

    /*------------------------------------------------------------------------*/

    /**
     * creates a hash object.
     *
     * @private
     * @constructor
     * @param {array} [entries] the key-value pairs to cache.
     */
    function hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberof hash
     */
    function hashclear() {
      this.__data__ = nativecreate ? nativecreate(null) : {};
      this.size = 0;
    }

    /**
     * removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberof hash
     * @param {object} hash the hash to modify.
     * @param {string} key the key of the value to remove.
     * @returns {boolean} returns `true` if the entry was removed, else `false`.
     */
    function hashdelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberof hash
     * @param {string} key the key of the value to get.
     * @returns {*} returns the entry value.
     */
    function hashget(key) {
      var data = this.__data__;
      if (nativecreate) {
        var result = data[key];
        return result === hash_undefined ? undefined : result;
      }
      return hasownproperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberof hash
     * @param {string} key the key of the entry to check.
     * @returns {boolean} returns `true` if an entry for `key` exists, else `false`.
     */
    function hashhas(key) {
      var data = this.__data__;
      return nativecreate ? (data[key] !== undefined) : hasownproperty.call(data, key);
    }

    /**
     * sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberof hash
     * @param {string} key the key of the value to set.
     * @param {*} value the value to set.
     * @returns {object} returns the hash instance.
     */
    function hashset(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativecreate && value === undefined) ? hash_undefined : value;
      return this;
    }

    // add methods to `hash`.
    hash.prototype.clear = hashclear;
    hash.prototype['delete'] = hashdelete;
    hash.prototype.get = hashget;
    hash.prototype.has = hashhas;
    hash.prototype.set = hashset;

    /*------------------------------------------------------------------------*/

    /**
     * creates an list cache object.
     *
     * @private
     * @constructor
     * @param {array} [entries] the key-value pairs to cache.
     */
    function listcache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberof listcache
     */
    function listcacheclear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberof listcache
     * @param {string} key the key of the value to remove.
     * @returns {boolean} returns `true` if the entry was removed, else `false`.
     */
    function listcachedelete(key) {
      var data = this.__data__,
          index = associndexof(data, key);

      if (index < 0) {
        return false;
      }
      var lastindex = data.length - 1;
      if (index == lastindex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberof listcache
     * @param {string} key the key of the value to get.
     * @returns {*} returns the entry value.
     */
    function listcacheget(key) {
      var data = this.__data__,
          index = associndexof(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberof listcache
     * @param {string} key the key of the entry to check.
     * @returns {boolean} returns `true` if an entry for `key` exists, else `false`.
     */
    function listcachehas(key) {
      return associndexof(this.__data__, key) > -1;
    }

    /**
     * sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberof listcache
     * @param {string} key the key of the value to set.
     * @param {*} value the value to set.
     * @returns {object} returns the list cache instance.
     */
    function listcacheset(key, value) {
      var data = this.__data__,
          index = associndexof(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // add methods to `listcache`.
    listcache.prototype.clear = listcacheclear;
    listcache.prototype['delete'] = listcachedelete;
    listcache.prototype.get = listcacheget;
    listcache.prototype.has = listcachehas;
    listcache.prototype.set = listcacheset;

    /*------------------------------------------------------------------------*/

    /**
     * creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {array} [entries] the key-value pairs to cache.
     */
    function mapcache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberof mapcache
     */
    function mapcacheclear() {
      this.size = 0;
      this.__data__ = {
        'hash': new hash,
        'map': new (map || listcache),
        'string': new hash
      };
    }

    /**
     * removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberof mapcache
     * @param {string} key the key of the value to remove.
     * @returns {boolean} returns `true` if the entry was removed, else `false`.
     */
    function mapcachedelete(key) {
      var result = getmapdata(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberof mapcache
     * @param {string} key the key of the value to get.
     * @returns {*} returns the entry value.
     */
    function mapcacheget(key) {
      return getmapdata(this, key).get(key);
    }

    /**
     * checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberof mapcache
     * @param {string} key the key of the entry to check.
     * @returns {boolean} returns `true` if an entry for `key` exists, else `false`.
     */
    function mapcachehas(key) {
      return getmapdata(this, key).has(key);
    }

    /**
     * sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberof mapcache
     * @param {string} key the key of the value to set.
     * @param {*} value the value to set.
     * @returns {object} returns the map cache instance.
     */
    function mapcacheset(key, value) {
      var data = getmapdata(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // add methods to `mapcache`.
    mapcache.prototype.clear = mapcacheclear;
    mapcache.prototype['delete'] = mapcachedelete;
    mapcache.prototype.get = mapcacheget;
    mapcache.prototype.has = mapcachehas;
    mapcache.prototype.set = mapcacheset;

    /*------------------------------------------------------------------------*/

    /**
     *
     * creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {array} [values] the values to cache.
     */
    function setcache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new mapcache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberof setcache
     * @alias push
     * @param {*} value the value to cache.
     * @returns {object} returns the cache instance.
     */
    function setcacheadd(value) {
      this.__data__.set(value, hash_undefined);
      return this;
    }

    /**
     * checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberof setcache
     * @param {*} value the value to search for.
     * @returns {number} returns `true` if `value` is found, else `false`.
     */
    function setcachehas(value) {
      return this.__data__.has(value);
    }

    // add methods to `setcache`.
    setcache.prototype.add = setcache.prototype.push = setcacheadd;
    setcache.prototype.has = setcachehas;

    /*------------------------------------------------------------------------*/

    /**
     * creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {array} [entries] the key-value pairs to cache.
     */
    function stack(entries) {
      var data = this.__data__ = new listcache(entries);
      this.size = data.size;
    }

    /**
     * removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberof stack
     */
    function stackclear() {
      this.__data__ = new listcache;
      this.size = 0;
    }

    /**
     * removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberof stack
     * @param {string} key the key of the value to remove.
     * @returns {boolean} returns `true` if the entry was removed, else `false`.
     */
    function stackdelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberof stack
     * @param {string} key the key of the value to get.
     * @returns {*} returns the entry value.
     */
    function stackget(key) {
      return this.__data__.get(key);
    }

    /**
     * checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberof stack
     * @param {string} key the key of the entry to check.
     * @returns {boolean} returns `true` if an entry for `key` exists, else `false`.
     */
    function stackhas(key) {
      return this.__data__.has(key);
    }

    /**
     * sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberof stack
     * @param {string} key the key of the value to set.
     * @param {*} value the value to set.
     * @returns {object} returns the stack cache instance.
     */
    function stackset(key, value) {
      var data = this.__data__;
      if (data instanceof listcache) {
        var pairs = data.__data__;
        if (!map || (pairs.length < large_array_size - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new mapcache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // add methods to `stack`.
    stack.prototype.clear = stackclear;
    stack.prototype['delete'] = stackdelete;
    stack.prototype.get = stackget;
    stack.prototype.has = stackhas;
    stack.prototype.set = stackset;

    /*------------------------------------------------------------------------*/

    /**
     * creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value the value to query.
     * @param {boolean} inherited specify returning inherited property names.
     * @returns {array} returns the array of property names.
     */
    function arraylikekeys(value, inherited) {
      var isarr = isarray(value),
          isarg = !isarr && isarguments(value),
          isbuff = !isarr && !isarg && isbuffer(value),
          istype = !isarr && !isarg && !isbuff && istypedarray(value),
          skipindexes = isarr || isarg || isbuff || istype,
          result = skipindexes ? basetimes(value.length, string) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasownproperty.call(value, key)) &&
            !(skipindexes && (
               // safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // node.js 0.10 has enumerable non-index properties on buffers.
               (isbuff && (key == 'offset' || key == 'parent')) ||
               // phantomjs 2 has enumerable non-index properties on typed arrays.
               (istype && (key == 'buffer' || key == 'bytelength' || key == 'byteoffset')) ||
               // skip index properties.
               isindex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * a specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {array} array the array to sample.
     * @returns {*} returns the random element.
     */
    function arraysample(array) {
      var length = array.length;
      return length ? array[baserandom(0, length - 1)] : undefined;
    }

    /**
     * a specialized version of `_.samplesize` for arrays.
     *
     * @private
     * @param {array} array the array to sample.
     * @param {number} n the number of elements to sample.
     * @returns {array} returns the random elements.
     */
    function arraysamplesize(array, n) {
      return shuffleself(copyarray(array), baseclamp(n, 0, array.length));
    }

    /**
     * a specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {array} array the array to shuffle.
     * @returns {array} returns the new shuffled array.
     */
    function arrayshuffle(array) {
      return shuffleself(copyarray(array));
    }

    /**
     * this function is like `assignvalue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {object} object the object to modify.
     * @param {string} key the key of the property to assign.
     * @param {*} value the value to assign.
     */
    function assignmergevalue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseassignvalue(object, key, value);
      }
    }

    /**
     * assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {object} object the object to modify.
     * @param {string} key the key of the property to assign.
     * @param {*} value the value to assign.
     */
    function assignvalue(object, key, value) {
      var objvalue = object[key];
      if (!(hasownproperty.call(object, key) && eq(objvalue, value)) ||
          (value === undefined && !(key in object))) {
        baseassignvalue(object, key, value);
      }
    }

    /**
     * gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {array} array the array to inspect.
     * @param {*} key the key to search for.
     * @returns {number} returns the index of the matched value, else `-1`.
     */
    function associndexof(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {array|object} collection the collection to iterate over.
     * @param {function} setter the function to set `accumulator` values.
     * @param {function} iteratee the iteratee to transform keys.
     * @param {object} accumulator the initial aggregated object.
     * @returns {function} returns `accumulator`.
     */
    function baseaggregator(collection, setter, iteratee, accumulator) {
      baseeach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * the base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {object} object the destination object.
     * @param {object} source the source object.
     * @returns {object} returns `object`.
     */
    function baseassign(object, source) {
      return object && copyobject(source, keys(source), object);
    }

    /**
     * the base implementation of `_.assignin` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {object} object the destination object.
     * @param {object} source the source object.
     * @returns {object} returns `object`.
     */
    function baseassignin(object, source) {
      return object && copyobject(source, keysin(source), object);
    }

    /**
     * the base implementation of `assignvalue` and `assignmergevalue` without
     * value checks.
     *
     * @private
     * @param {object} object the object to modify.
     * @param {string} key the key of the property to assign.
     * @param {*} value the value to assign.
     */
    function baseassignvalue(object, key, value) {
      if (key == '__proto__' && defineproperty) {
        defineproperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * the base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {object} object the object to iterate over.
     * @param {string[]} paths the property paths to pick.
     * @returns {array} returns the picked elements.
     */
    function baseat(object, paths) {
      var index = -1,
          length = paths.length,
          result = array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * the base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number the number to clamp.
     * @param {number} [lower] the lower bound.
     * @param {number} upper the upper bound.
     * @returns {number} returns the clamped number.
     */
    function baseclamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * the base implementation of `_.clone` and `_.clonedeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value the value to clone.
     * @param {boolean} bitmask the bitmask flags.
     *  1 - deep clone
     *  2 - flatten inherited properties
     *  4 - clone symbols
     * @param {function} [customizer] the function to customize cloning.
     * @param {string} [key] the key of `value`.
     * @param {object} [object] the parent object of `value`.
     * @param {object} [stack] tracks traversed objects and their clone counterparts.
     * @returns {*} returns the cloned value.
     */
    function baseclone(value, bitmask, customizer, key, object, stack) {
      var result,
          isdeep = bitmask & clone_deep_flag,
          isflat = bitmask & clone_flat_flag,
          isfull = bitmask & clone_symbols_flag;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isobject(value)) {
        return value;
      }
      var isarr = isarray(value);
      if (isarr) {
        result = initclonearray(value);
        if (!isdeep) {
          return copyarray(value, result);
        }
      } else {
        var tag = gettag(value),
            isfunc = tag == functag || tag == gentag;

        if (isbuffer(value)) {
          return clonebuffer(value, isdeep);
        }
        if (tag == objecttag || tag == argstag || (isfunc && !object)) {
          result = (isflat || isfunc) ? {} : initcloneobject(value);
          if (!isdeep) {
            return isflat
              ? copysymbolsin(value, baseassignin(result, value))
              : copysymbols(value, baseassign(result, value));
          }
        } else {
          if (!cloneabletags[tag]) {
            return object ? value : {};
          }
          result = initclonebytag(value, tag, isdeep);
        }
      }
      // check for circular references and return its corresponding clone.
      stack || (stack = new stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isset(value)) {
        value.foreach(function(subvalue) {
          result.add(baseclone(subvalue, bitmask, customizer, subvalue, value, stack));
        });
      } else if (ismap(value)) {
        value.foreach(function(subvalue, key) {
          result.set(key, baseclone(subvalue, bitmask, customizer, key, value, stack));
        });
      }

      var keysfunc = isfull
        ? (isflat ? getallkeysin : getallkeys)
        : (isflat ? keysin : keys);

      var props = isarr ? undefined : keysfunc(value);
      arrayeach(props || value, function(subvalue, key) {
        if (props) {
          key = subvalue;
          subvalue = value[key];
        }
        // recursively populate clone (susceptible to call stack limits).
        assignvalue(result, key, baseclone(subvalue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * the base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {object} source the object of property predicates to conform to.
     * @returns {function} returns the new spec function.
     */
    function baseconforms(source) {
      var props = keys(source);
      return function(object) {
        return baseconformsto(object, source, props);
      };
    }

    /**
     * the base implementation of `_.conformsto` which accepts `props` to check.
     *
     * @private
     * @param {object} object the object to inspect.
     * @param {object} source the object of property predicates to conform to.
     * @returns {boolean} returns `true` if `object` conforms, else `false`.
     */
    function baseconformsto(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * the base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {function} func the function to delay.
     * @param {number} wait the number of milliseconds to delay invocation.
     * @param {array} args the arguments to provide to `func`.
     * @returns {number|object} returns the timer id or timeout object.
     */
    function basedelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new typeerror(func_error_text);
      }
      return settimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * the base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {array} array the array to inspect.
     * @param {array} values the values to exclude.
     * @param {function} [iteratee] the iteratee invoked per element.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns the new array of filtered values.
     */
    function basedifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayincludes,
          iscommon = true,
          length = array.length,
          result = [],
          valueslength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arraymap(values, baseunary(iteratee));
      }
      if (comparator) {
        includes = arrayincludeswith;
        iscommon = false;
      }
      else if (values.length >= large_array_size) {
        includes = cachehas;
        iscommon = false;
        values = new setcache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (iscommon && computed === computed) {
          var valuesindex = valueslength;
          while (valuesindex--) {
            if (values[valuesindex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * the base implementation of `_.foreach` without support for iteratee shorthands.
     *
     * @private
     * @param {array|object} collection the collection to iterate over.
     * @param {function} iteratee the function invoked per iteration.
     * @returns {array|object} returns `collection`.
     */
    var baseeach = createbaseeach(baseforown);

    /**
     * the base implementation of `_.foreachright` without support for iteratee shorthands.
     *
     * @private
     * @param {array|object} collection the collection to iterate over.
     * @param {function} iteratee the function invoked per iteration.
     * @returns {array|object} returns `collection`.
     */
    var baseeachright = createbaseeach(baseforownright, true);

    /**
     * the base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {array|object} collection the collection to iterate over.
     * @param {function} predicate the function invoked per iteration.
     * @returns {boolean} returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseevery(collection, predicate) {
      var result = true;
      baseeach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * the base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {array} array the array to iterate over.
     * @param {function} iteratee the iteratee invoked per iteration.
     * @param {function} comparator the comparator used to compare values.
     * @returns {*} returns the extremum value.
     */
    function baseextremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !issymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * the base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {array} array the array to fill.
     * @param {*} value the value to fill `array` with.
     * @param {number} [start=0] the start position.
     * @param {number} [end=array.length] the end position.
     * @returns {array} returns `array`.
     */
    function basefill(array, value, start, end) {
      var length = array.length;

      start = tointeger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : tointeger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : tolength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * the base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {array|object} collection the collection to iterate over.
     * @param {function} predicate the function invoked per iteration.
     * @returns {array} returns the new filtered array.
     */
    function basefilter(collection, predicate) {
      var result = [];
      baseeach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * the base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {array} array the array to flatten.
     * @param {number} depth the maximum recursion depth.
     * @param {boolean} [predicate=isflattenable] the function invoked per iteration.
     * @param {boolean} [isstrict] restrict to values that pass `predicate` checks.
     * @param {array} [result=[]] the initial result value.
     * @returns {array} returns the new flattened array.
     */
    function baseflatten(array, depth, predicate, isstrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isflattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // recursively flatten arrays (susceptible to call stack limits).
            baseflatten(value, depth - 1, predicate, isstrict, result);
          } else {
            arraypush(result, value);
          }
        } else if (!isstrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * the base implementation of `baseforown` which iterates over `object`
     * properties returned by `keysfunc` and invokes `iteratee` for each property.
     * iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {object} object the object to iterate over.
     * @param {function} iteratee the function invoked per iteration.
     * @param {function} keysfunc the function to get the keys of `object`.
     * @returns {object} returns `object`.
     */
    var basefor = createbasefor();

    /**
     * this function is like `basefor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {object} object the object to iterate over.
     * @param {function} iteratee the function invoked per iteration.
     * @param {function} keysfunc the function to get the keys of `object`.
     * @returns {object} returns `object`.
     */
    var baseforright = createbasefor(true);

    /**
     * the base implementation of `_.forown` without support for iteratee shorthands.
     *
     * @private
     * @param {object} object the object to iterate over.
     * @param {function} iteratee the function invoked per iteration.
     * @returns {object} returns `object`.
     */
    function baseforown(object, iteratee) {
      return object && basefor(object, iteratee, keys);
    }

    /**
     * the base implementation of `_.forownright` without support for iteratee shorthands.
     *
     * @private
     * @param {object} object the object to iterate over.
     * @param {function} iteratee the function invoked per iteration.
     * @returns {object} returns `object`.
     */
    function baseforownright(object, iteratee) {
      return object && baseforright(object, iteratee, keys);
    }

    /**
     * the base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {object} object the object to inspect.
     * @param {array} props the property names to filter.
     * @returns {array} returns the function names.
     */
    function basefunctions(object, props) {
      return arrayfilter(props, function(key) {
        return isfunction(object[key]);
      });
    }

    /**
     * the base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {object} object the object to query.
     * @param {array|string} path the path of the property to get.
     * @returns {*} returns the resolved value.
     */
    function baseget(object, path) {
      path = castpath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[tokey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * the base implementation of `getallkeys` and `getallkeysin` which uses
     * `keysfunc` and `symbolsfunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {object} object the object to query.
     * @param {function} keysfunc the function to get the keys of `object`.
     * @param {function} symbolsfunc the function to get the symbols of `object`.
     * @returns {array} returns the array of property names and symbols.
     */
    function basegetallkeys(object, keysfunc, symbolsfunc) {
      var result = keysfunc(object);
      return isarray(object) ? result : arraypush(result, symbolsfunc(object));
    }

    /**
     * the base implementation of `gettag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value the value to query.
     * @returns {string} returns the `tostringtag`.
     */
    function basegettag(value) {
      if (value == null) {
        return value === undefined ? undefinedtag : nulltag;
      }
      return (symtostringtag && symtostringtag in object(value))
        ? getrawtag(value)
        : objecttostring(value);
    }

    /**
     * the base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @returns {boolean} returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function basegt(value, other) {
      return value > other;
    }

    /**
     * the base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {object} [object] the object to query.
     * @param {array|string} key the key to check.
     * @returns {boolean} returns `true` if `key` exists, else `false`.
     */
    function basehas(object, key) {
      return object != null && hasownproperty.call(object, key);
    }

    /**
     * the base implementation of `_.hasin` without support for deep paths.
     *
     * @private
     * @param {object} [object] the object to query.
     * @param {array|string} key the key to check.
     * @returns {boolean} returns `true` if `key` exists, else `false`.
     */
    function basehasin(object, key) {
      return object != null && key in object(object);
    }

    /**
     * the base implementation of `_.inrange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number the number to check.
     * @param {number} start the start of the range.
     * @param {number} end the end of the range.
     * @returns {boolean} returns `true` if `number` is in the range, else `false`.
     */
    function baseinrange(number, start, end) {
      return number >= nativemin(start, end) && number < nativemax(start, end);
    }

    /**
     * the base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {array} arrays the arrays to inspect.
     * @param {function} [iteratee] the iteratee invoked per element.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns the new array of shared values.
     */
    function baseintersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayincludeswith : arrayincludes,
          length = arrays[0].length,
          othlength = arrays.length,
          othindex = othlength,
          caches = array(othlength),
          maxlength = infinity,
          result = [];

      while (othindex--) {
        var array = arrays[othindex];
        if (othindex && iteratee) {
          array = arraymap(array, baseunary(iteratee));
        }
        maxlength = nativemin(array.length, maxlength);
        caches[othindex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new setcache(othindex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxlength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cachehas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othindex = othlength;
          while (--othindex) {
            var cache = caches[othindex];
            if (!(cache
                  ? cachehas(cache, computed)
                  : includes(arrays[othindex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * the base implementation of `_.invert` and `_.invertby` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {object} object the object to iterate over.
     * @param {function} setter the function to set `accumulator` values.
     * @param {function} iteratee the iteratee to transform values.
     * @param {object} accumulator the initial inverted object.
     * @returns {function} returns `accumulator`.
     */
    function baseinverter(object, setter, iteratee, accumulator) {
      baseforown(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * the base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {object} object the object to query.
     * @param {array|string} path the path of the method to invoke.
     * @param {array} args the arguments to invoke the method with.
     * @returns {*} returns the result of the invoked method.
     */
    function baseinvoke(object, path, args) {
      path = castpath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[tokey(last(path))];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * the base implementation of `_.isarguments`.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is an `arguments` object,
     */
    function baseisarguments(value) {
      return isobjectlike(value) && basegettag(value) == argstag;
    }

    /**
     * the base implementation of `_.isarraybuffer` without node.js optimizations.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is an array buffer, else `false`.
     */
    function baseisarraybuffer(value) {
      return isobjectlike(value) && basegettag(value) == arraybuffertag;
    }

    /**
     * the base implementation of `_.isdate` without node.js optimizations.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a date object, else `false`.
     */
    function baseisdate(value) {
      return isobjectlike(value) && basegettag(value) == datetag;
    }

    /**
     * the base implementation of `_.isequal` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @param {boolean} bitmask the bitmask flags.
     *  1 - unordered comparison
     *  2 - partial comparison
     * @param {function} [customizer] the function to customize comparisons.
     * @param {object} [stack] tracks traversed `value` and `other` objects.
     * @returns {boolean} returns `true` if the values are equivalent, else `false`.
     */
    function baseisequal(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isobjectlike(value) && !isobjectlike(other))) {
        return value !== value && other !== other;
      }
      return baseisequaldeep(value, other, bitmask, customizer, baseisequal, stack);
    }

    /**
     * a specialized version of `baseisequal` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {object} object the object to compare.
     * @param {object} other the other object to compare.
     * @param {number} bitmask the bitmask flags. see `baseisequal` for more details.
     * @param {function} customizer the function to customize comparisons.
     * @param {function} equalfunc the function to determine equivalents of values.
     * @param {object} [stack] tracks traversed `object` and `other` objects.
     * @returns {boolean} returns `true` if the objects are equivalent, else `false`.
     */
    function baseisequaldeep(object, other, bitmask, customizer, equalfunc, stack) {
      var objisarr = isarray(object),
          othisarr = isarray(other),
          objtag = objisarr ? arraytag : gettag(object),
          othtag = othisarr ? arraytag : gettag(other);

      objtag = objtag == argstag ? objecttag : objtag;
      othtag = othtag == argstag ? objecttag : othtag;

      var objisobj = objtag == objecttag,
          othisobj = othtag == objecttag,
          issametag = objtag == othtag;

      if (issametag && isbuffer(object)) {
        if (!isbuffer(other)) {
          return false;
        }
        objisarr = true;
        objisobj = false;
      }
      if (issametag && !objisobj) {
        stack || (stack = new stack);
        return (objisarr || istypedarray(object))
          ? equalarrays(object, other, bitmask, customizer, equalfunc, stack)
          : equalbytag(object, other, objtag, bitmask, customizer, equalfunc, stack);
      }
      if (!(bitmask & compare_partial_flag)) {
        var objiswrapped = objisobj && hasownproperty.call(object, '__wrapped__'),
            othiswrapped = othisobj && hasownproperty.call(other, '__wrapped__');

        if (objiswrapped || othiswrapped) {
          var objunwrapped = objiswrapped ? object.value() : object,
              othunwrapped = othiswrapped ? other.value() : other;

          stack || (stack = new stack);
          return equalfunc(objunwrapped, othunwrapped, bitmask, customizer, stack);
        }
      }
      if (!issametag) {
        return false;
      }
      stack || (stack = new stack);
      return equalobjects(object, other, bitmask, customizer, equalfunc, stack);
    }

    /**
     * the base implementation of `_.ismap` without node.js optimizations.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a map, else `false`.
     */
    function baseismap(value) {
      return isobjectlike(value) && gettag(value) == maptag;
    }

    /**
     * the base implementation of `_.ismatch` without support for iteratee shorthands.
     *
     * @private
     * @param {object} object the object to inspect.
     * @param {object} source the object of property values to match.
     * @param {array} matchdata the property names, values, and compare flags to match.
     * @param {function} [customizer] the function to customize comparisons.
     * @returns {boolean} returns `true` if `object` is a match, else `false`.
     */
    function baseismatch(object, source, matchdata, customizer) {
      var index = matchdata.length,
          length = index,
          nocustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = object(object);
      while (index--) {
        var data = matchdata[index];
        if ((nocustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchdata[index];
        var key = data[0],
            objvalue = object[key],
            srcvalue = data[1];

        if (nocustomizer && data[2]) {
          if (objvalue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new stack;
          if (customizer) {
            var result = customizer(objvalue, srcvalue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseisequal(srcvalue, objvalue, compare_partial_flag | compare_unordered_flag, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * the base implementation of `_.isnative` without bad shim checks.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseisnative(value) {
      if (!isobject(value) || ismasked(value)) {
        return false;
      }
      var pattern = isfunction(value) ? reisnative : reishostctor;
      return pattern.test(tosource(value));
    }

    /**
     * the base implementation of `_.isregexp` without node.js optimizations.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a regexp, else `false`.
     */
    function baseisregexp(value) {
      return isobjectlike(value) && basegettag(value) == regexptag;
    }

    /**
     * the base implementation of `_.isset` without node.js optimizations.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a set, else `false`.
     */
    function baseisset(value) {
      return isobjectlike(value) && gettag(value) == settag;
    }

    /**
     * the base implementation of `_.istypedarray` without node.js optimizations.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a typed array, else `false`.
     */
    function baseistypedarray(value) {
      return isobjectlike(value) &&
        islength(value.length) && !!typedarraytags[basegettag(value)];
    }

    /**
     * the base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] the value to convert to an iteratee.
     * @returns {function} returns the iteratee.
     */
    function baseiteratee(value) {
      // don't store the `typeof` result in a variable to avoid a jit bug in safari 9.
      // see https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isarray(value)
          ? basematchesproperty(value[0], value[1])
          : basematches(value);
      }
      return property(value);
    }

    /**
     * the base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {object} object the object to query.
     * @returns {array} returns the array of property names.
     */
    function basekeys(object) {
      if (!isprototype(object)) {
        return nativekeys(object);
      }
      var result = [];
      for (var key in object(object)) {
        if (hasownproperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * the base implementation of `_.keysin` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {object} object the object to query.
     * @returns {array} returns the array of property names.
     */
    function basekeysin(object) {
      if (!isobject(object)) {
        return nativekeysin(object);
      }
      var isproto = isprototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isproto || !hasownproperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * the base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @returns {boolean} returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baselt(value, other) {
      return value < other;
    }

    /**
     * the base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {array|object} collection the collection to iterate over.
     * @param {function} iteratee the function invoked per iteration.
     * @returns {array} returns the new mapped array.
     */
    function basemap(collection, iteratee) {
      var index = -1,
          result = isarraylike(collection) ? array(collection.length) : [];

      baseeach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * the base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {object} source the object of property values to match.
     * @returns {function} returns the new spec function.
     */
    function basematches(source) {
      var matchdata = getmatchdata(source);
      if (matchdata.length == 1 && matchdata[0][2]) {
        return matchesstrictcomparable(matchdata[0][0], matchdata[0][1]);
      }
      return function(object) {
        return object === source || baseismatch(object, source, matchdata);
      };
    }

    /**
     * the base implementation of `_.matchesproperty` which doesn't clone `srcvalue`.
     *
     * @private
     * @param {string} path the path of the property to get.
     * @param {*} srcvalue the value to match.
     * @returns {function} returns the new spec function.
     */
    function basematchesproperty(path, srcvalue) {
      if (iskey(path) && isstrictcomparable(srcvalue)) {
        return matchesstrictcomparable(tokey(path), srcvalue);
      }
      return function(object) {
        var objvalue = get(object, path);
        return (objvalue === undefined && objvalue === srcvalue)
          ? hasin(object, path)
          : baseisequal(srcvalue, objvalue, compare_partial_flag | compare_unordered_flag);
      };
    }

    /**
     * the base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {object} object the destination object.
     * @param {object} source the source object.
     * @param {number} srcindex the index of `source`.
     * @param {function} [customizer] the function to customize merged values.
     * @param {object} [stack] tracks traversed source values and their merged
     *  counterparts.
     */
    function basemerge(object, source, srcindex, customizer, stack) {
      if (object === source) {
        return;
      }
      basefor(source, function(srcvalue, key) {
        stack || (stack = new stack);
        if (isobject(srcvalue)) {
          basemergedeep(object, source, key, srcindex, basemerge, customizer, stack);
        }
        else {
          var newvalue = customizer
            ? customizer(safeget(object, key), srcvalue, (key + ''), object, source, stack)
            : undefined;

          if (newvalue === undefined) {
            newvalue = srcvalue;
          }
          assignmergevalue(object, key, newvalue);
        }
      }, keysin);
    }

    /**
     * a specialized version of `basemerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {object} object the destination object.
     * @param {object} source the source object.
     * @param {string} key the key of the value to merge.
     * @param {number} srcindex the index of `source`.
     * @param {function} mergefunc the function to merge values.
     * @param {function} [customizer] the function to customize assigned values.
     * @param {object} [stack] tracks traversed source values and their merged
     *  counterparts.
     */
    function basemergedeep(object, source, key, srcindex, mergefunc, customizer, stack) {
      var objvalue = safeget(object, key),
          srcvalue = safeget(source, key),
          stacked = stack.get(srcvalue);

      if (stacked) {
        assignmergevalue(object, key, stacked);
        return;
      }
      var newvalue = customizer
        ? customizer(objvalue, srcvalue, (key + ''), object, source, stack)
        : undefined;

      var iscommon = newvalue === undefined;

      if (iscommon) {
        var isarr = isarray(srcvalue),
            isbuff = !isarr && isbuffer(srcvalue),
            istyped = !isarr && !isbuff && istypedarray(srcvalue);

        newvalue = srcvalue;
        if (isarr || isbuff || istyped) {
          if (isarray(objvalue)) {
            newvalue = objvalue;
          }
          else if (isarraylikeobject(objvalue)) {
            newvalue = copyarray(objvalue);
          }
          else if (isbuff) {
            iscommon = false;
            newvalue = clonebuffer(srcvalue, true);
          }
          else if (istyped) {
            iscommon = false;
            newvalue = clonetypedarray(srcvalue, true);
          }
          else {
            newvalue = [];
          }
        }
        else if (isplainobject(srcvalue) || isarguments(srcvalue)) {
          newvalue = objvalue;
          if (isarguments(objvalue)) {
            newvalue = toplainobject(objvalue);
          }
          else if (!isobject(objvalue) || isfunction(objvalue)) {
            newvalue = initcloneobject(srcvalue);
          }
        }
        else {
          iscommon = false;
        }
      }
      if (iscommon) {
        // recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcvalue, newvalue);
        mergefunc(newvalue, srcvalue, srcindex, customizer, stack);
        stack['delete'](srcvalue);
      }
      assignmergevalue(object, key, newvalue);
    }

    /**
     * the base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {array} array the array to query.
     * @param {number} n the index of the element to return.
     * @returns {*} returns the nth element of `array`.
     */
    function basenth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isindex(n, length) ? array[n] : undefined;
    }

    /**
     * the base implementation of `_.orderby` without param guards.
     *
     * @private
     * @param {array|object} collection the collection to iterate over.
     * @param {function[]|object[]|string[]} iteratees the iteratees to sort by.
     * @param {string[]} orders the sort orders of `iteratees`.
     * @returns {array} returns the new sorted array.
     */
    function baseorderby(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arraymap(iteratees, function(iteratee) {
          if (isarray(iteratee)) {
            return function(value) {
              return baseget(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            }
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }

      var index = -1;
      iteratees = arraymap(iteratees, baseunary(getiteratee()));

      var result = basemap(collection, function(value, key, collection) {
        var criteria = arraymap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return basesortby(result, function(object, other) {
        return comparemultiple(object, other, orders);
      });
    }

    /**
     * the base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {object} object the source object.
     * @param {string[]} paths the property paths to pick.
     * @returns {object} returns the new object.
     */
    function basepick(object, paths) {
      return basepickby(object, paths, function(value, path) {
        return hasin(object, path);
      });
    }

    /**
     * the base implementation of  `_.pickby` without support for iteratee shorthands.
     *
     * @private
     * @param {object} object the source object.
     * @param {string[]} paths the property paths to pick.
     * @param {function} predicate the function invoked per property.
     * @returns {object} returns the new object.
     */
    function basepickby(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseget(object, path);

        if (predicate(value, path)) {
          baseset(result, castpath(path, object), value);
        }
      }
      return result;
    }

    /**
     * a specialized version of `baseproperty` which supports deep paths.
     *
     * @private
     * @param {array|string} path the path of the property to get.
     * @returns {function} returns the new accessor function.
     */
    function basepropertydeep(path) {
      return function(object) {
        return baseget(object, path);
      };
    }

    /**
     * the base implementation of `_.pullallby` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {array} array the array to modify.
     * @param {array} values the values to remove.
     * @param {function} [iteratee] the iteratee invoked per element.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns `array`.
     */
    function basepullall(array, values, iteratee, comparator) {
      var indexof = comparator ? baseindexofwith : baseindexof,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyarray(values);
      }
      if (iteratee) {
        seen = arraymap(array, baseunary(iteratee));
      }
      while (++index < length) {
        var fromindex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromindex = indexof(seen, computed, fromindex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromindex, 1);
          }
          splice.call(array, fromindex, 1);
        }
      }
      return array;
    }

    /**
     * the base implementation of `_.pullat` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {array} array the array to modify.
     * @param {number[]} indexes the indexes of elements to remove.
     * @returns {array} returns `array`.
     */
    function basepullat(array, indexes) {
      var length = array ? indexes.length : 0,
          lastindex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastindex || index !== previous) {
          var previous = index;
          if (isindex(index)) {
            splice.call(array, index, 1);
          } else {
            baseunset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * the base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower the lower bound.
     * @param {number} upper the upper bound.
     * @returns {number} returns the random number.
     */
    function baserandom(lower, upper) {
      return lower + nativefloor(nativerandom() * (upper - lower + 1));
    }

    /**
     * the base implementation of `_.range` and `_.rangeright` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start the start of the range.
     * @param {number} end the end of the range.
     * @param {number} step the value to increment or decrement by.
     * @param {boolean} [fromright] specify iterating from right to left.
     * @returns {array} returns the range of numbers.
     */
    function baserange(start, end, step, fromright) {
      var index = -1,
          length = nativemax(nativeceil((end - start) / (step || 1)), 0),
          result = array(length);

      while (length--) {
        result[fromright ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * the base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string the string to repeat.
     * @param {number} n the number of times to repeat the string.
     * @returns {string} returns the repeated string.
     */
    function baserepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > max_safe_integer) {
        return result;
      }
      // leverage the exponentiation by squaring algorithm for a faster repeat.
      // see https://en.wikipedia.org/wiki/exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativefloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * the base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {function} func the function to apply a rest parameter to.
     * @param {number} [start=func.length-1] the start position of the rest parameter.
     * @returns {function} returns the new function.
     */
    function baserest(func, start) {
      return settostring(overrest(func, start, identity), func + '');
    }

    /**
     * the base implementation of `_.sample`.
     *
     * @private
     * @param {array|object} collection the collection to sample.
     * @returns {*} returns the random element.
     */
    function basesample(collection) {
      return arraysample(values(collection));
    }

    /**
     * the base implementation of `_.samplesize` without param guards.
     *
     * @private
     * @param {array|object} collection the collection to sample.
     * @param {number} n the number of elements to sample.
     * @returns {array} returns the random elements.
     */
    function basesamplesize(collection, n) {
      var array = values(collection);
      return shuffleself(array, baseclamp(n, 0, array.length));
    }

    /**
     * the base implementation of `_.set`.
     *
     * @private
     * @param {object} object the object to modify.
     * @param {array|string} path the path of the property to set.
     * @param {*} value the value to set.
     * @param {function} [customizer] the function to customize path creation.
     * @returns {object} returns `object`.
     */
    function baseset(object, path, value, customizer) {
      if (!isobject(object)) {
        return object;
      }
      path = castpath(path, object);

      var index = -1,
          length = path.length,
          lastindex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = tokey(path[index]),
            newvalue = value;

        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return object;
        }

        if (index != lastindex) {
          var objvalue = nested[key];
          newvalue = customizer ? customizer(objvalue, key, nested) : undefined;
          if (newvalue === undefined) {
            newvalue = isobject(objvalue)
              ? objvalue
              : (isindex(path[index + 1]) ? [] : {});
          }
        }
        assignvalue(nested, key, newvalue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * the base implementation of `setdata` without support for hot loop shorting.
     *
     * @private
     * @param {function} func the function to associate metadata with.
     * @param {*} data the metadata.
     * @returns {function} returns `func`.
     */
    var basesetdata = !metamap ? identity : function(func, data) {
      metamap.set(func, data);
      return func;
    };

    /**
     * the base implementation of `settostring` without support for hot loop shorting.
     *
     * @private
     * @param {function} func the function to modify.
     * @param {function} string the `tostring` result.
     * @returns {function} returns `func`.
     */
    var basesettostring = !defineproperty ? identity : function(func, string) {
      return defineproperty(func, 'tostring', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * the base implementation of `_.shuffle`.
     *
     * @private
     * @param {array|object} collection the collection to shuffle.
     * @returns {array} returns the new shuffled array.
     */
    function baseshuffle(collection) {
      return shuffleself(values(collection));
    }

    /**
     * the base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {array} array the array to slice.
     * @param {number} [start=0] the start position.
     * @param {number} [end=array.length] the end position.
     * @returns {array} returns the slice of `array`.
     */
    function baseslice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * the base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {array|object} collection the collection to iterate over.
     * @param {function} predicate the function invoked per iteration.
     * @returns {boolean} returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function basesome(collection, predicate) {
      var result;

      baseeach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * the base implementation of `_.sortedindex` and `_.sortedlastindex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {array} array the sorted array to inspect.
     * @param {*} value the value to evaluate.
     * @param {boolean} [rethighest] specify returning the highest qualified index.
     * @returns {number} returns the index at which `value` should be inserted
     *  into `array`.
     */
    function basesortedindex(array, value, rethighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= half_max_array_length) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !issymbol(computed) &&
              (rethighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return basesortedindexby(array, value, identity, rethighest);
    }

    /**
     * the base implementation of `_.sortedindexby` and `_.sortedlastindexby`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. the iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {array} array the sorted array to inspect.
     * @param {*} value the value to evaluate.
     * @param {function} iteratee the iteratee invoked per element.
     * @param {boolean} [rethighest] specify returning the highest qualified index.
     * @returns {number} returns the index at which `value` should be inserted
     *  into `array`.
     */
    function basesortedindexby(array, value, iteratee, rethighest) {
      var low = 0,
          high = array == null ? 0 : array.length;
      if (high === 0) {
        return 0;
      }

      value = iteratee(value);
      var valisnan = value !== value,
          valisnull = value === null,
          valissymbol = issymbol(value),
          valisundefined = value === undefined;

      while (low < high) {
        var mid = nativefloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othisdefined = computed !== undefined,
            othisnull = computed === null,
            othisreflexive = computed === computed,
            othissymbol = issymbol(computed);

        if (valisnan) {
          var setlow = rethighest || othisreflexive;
        } else if (valisundefined) {
          setlow = othisreflexive && (rethighest || othisdefined);
        } else if (valisnull) {
          setlow = othisreflexive && othisdefined && (rethighest || !othisnull);
        } else if (valissymbol) {
          setlow = othisreflexive && othisdefined && !othisnull && (rethighest || !othissymbol);
        } else if (othisnull || othissymbol) {
          setlow = false;
        } else {
          setlow = rethighest ? (computed <= value) : (computed < value);
        }
        if (setlow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativemin(high, max_array_index);
    }

    /**
     * the base implementation of `_.sorteduniq` and `_.sorteduniqby` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {array} array the array to inspect.
     * @param {function} [iteratee] the iteratee invoked per element.
     * @returns {array} returns the new duplicate free array.
     */
    function basesorteduniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resindex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resindex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * the base implementation of `_.tonumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value the value to process.
     * @returns {number} returns the number.
     */
    function basetonumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (issymbol(value)) {
        return nan;
      }
      return +value;
    }

    /**
     * the base implementation of `_.tostring` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value the value to process.
     * @returns {string} returns the string.
     */
    function basetostring(value) {
      // exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isarray(value)) {
        // recursively convert values (susceptible to call stack limits).
        return arraymap(value, basetostring) + '';
      }
      if (issymbol(value)) {
        return symboltostring ? symboltostring.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -infinity) ? '-0' : result;
    }

    /**
     * the base implementation of `_.uniqby` without support for iteratee shorthands.
     *
     * @private
     * @param {array} array the array to inspect.
     * @param {function} [iteratee] the iteratee invoked per element.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns the new duplicate free array.
     */
    function baseuniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayincludes,
          length = array.length,
          iscommon = true,
          result = [],
          seen = result;

      if (comparator) {
        iscommon = false;
        includes = arrayincludeswith;
      }
      else if (length >= large_array_size) {
        var set = iteratee ? null : createset(array);
        if (set) {
          return settoarray(set);
        }
        iscommon = false;
        includes = cachehas;
        seen = new setcache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (iscommon && computed === computed) {
          var seenindex = seen.length;
          while (seenindex--) {
            if (seen[seenindex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * the base implementation of `_.unset`.
     *
     * @private
     * @param {object} object the object to modify.
     * @param {array|string} path the property path to unset.
     * @returns {boolean} returns `true` if the property is deleted, else `false`.
     */
    function baseunset(object, path) {
      path = castpath(path, object);
      object = parent(object, path);
      return object == null || delete object[tokey(last(path))];
    }

    /**
     * the base implementation of `_.update`.
     *
     * @private
     * @param {object} object the object to modify.
     * @param {array|string} path the path of the property to update.
     * @param {function} updater the function to produce the updated value.
     * @param {function} [customizer] the function to customize path creation.
     * @returns {object} returns `object`.
     */
    function baseupdate(object, path, updater, customizer) {
      return baseset(object, path, updater(baseget(object, path)), customizer);
    }

    /**
     * the base implementation of methods like `_.dropwhile` and `_.takewhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {array} array the array to query.
     * @param {function} predicate the function invoked per iteration.
     * @param {boolean} [isdrop] specify dropping elements instead of taking them.
     * @param {boolean} [fromright] specify iterating from right to left.
     * @returns {array} returns the slice of `array`.
     */
    function basewhile(array, predicate, isdrop, fromright) {
      var length = array.length,
          index = fromright ? length : -1;

      while ((fromright ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isdrop
        ? baseslice(array, (fromright ? 0 : index), (fromright ? index + 1 : length))
        : baseslice(array, (fromright ? index + 1 : 0), (fromright ? length : index));
    }

    /**
     * the base implementation of `wrappervalue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value the unwrapped value.
     * @param {array} actions actions to perform to resolve the unwrapped value.
     * @returns {*} returns the resolved value.
     */
    function basewrappervalue(value, actions) {
      var result = value;
      if (result instanceof lazywrapper) {
        result = result.value();
      }
      return arrayreduce(actions, function(result, action) {
        return action.func.apply(action.thisarg, arraypush([result], action.args));
      }, result);
    }

    /**
     * the base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {array} arrays the arrays to inspect.
     * @param {function} [iteratee] the iteratee invoked per element.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns the new array of values.
     */
    function basexor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseuniq(arrays[0]) : [];
      }
      var index = -1,
          result = array(length);

      while (++index < length) {
        var array = arrays[index],
            othindex = -1;

        while (++othindex < length) {
          if (othindex != index) {
            result[index] = basedifference(result[index] || array, arrays[othindex], iteratee, comparator);
          }
        }
      }
      return baseuniq(baseflatten(result, 1), iteratee, comparator);
    }

    /**
     * this base implementation of `_.zipobject` which assigns values using `assignfunc`.
     *
     * @private
     * @param {array} props the property identifiers.
     * @param {array} values the property values.
     * @param {function} assignfunc the function to assign values.
     * @returns {object} returns the new object.
     */
    function basezipobject(props, values, assignfunc) {
      var index = -1,
          length = props.length,
          valslength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valslength ? values[index] : undefined;
        assignfunc(result, props[index], value);
      }
      return result;
    }

    /**
     * casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value the value to inspect.
     * @returns {array|object} returns the cast array-like object.
     */
    function castarraylikeobject(value) {
      return isarraylikeobject(value) ? value : [];
    }

    /**
     * casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value the value to inspect.
     * @returns {function} returns cast function.
     */
    function castfunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value the value to inspect.
     * @param {object} [object] the object to query keys on.
     * @returns {array} returns the cast property path array.
     */
    function castpath(value, object) {
      if (isarray(value)) {
        return value;
      }
      return iskey(value, object) ? [value] : stringtopath(tostring(value));
    }

    /**
     * a `baserest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {function}
     * @param {function} func the function to apply a rest parameter to.
     * @returns {function} returns the new function.
     */
    var castrest = baserest;

    /**
     * casts `array` to a slice if it's needed.
     *
     * @private
     * @param {array} array the array to inspect.
     * @param {number} start the start position.
     * @param {number} [end=array.length] the end position.
     * @returns {array} returns the cast slice.
     */
    function castslice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseslice(array, start, end);
    }

    /**
     * a simple wrapper around the global [`cleartimeout`](https://mdn.io/cleartimeout).
     *
     * @private
     * @param {number|object} id the timer id or timeout object of the timer to clear.
     */
    var cleartimeout = ctxcleartimeout || function(id) {
      return root.cleartimeout(id);
    };

    /**
     * creates a clone of  `buffer`.
     *
     * @private
     * @param {buffer} buffer the buffer to clone.
     * @param {boolean} [isdeep] specify a deep clone.
     * @returns {buffer} returns the cloned buffer.
     */
    function clonebuffer(buffer, isdeep) {
      if (isdeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocunsafe ? allocunsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * creates a clone of `arraybuffer`.
     *
     * @private
     * @param {arraybuffer} arraybuffer the array buffer to clone.
     * @returns {arraybuffer} returns the cloned array buffer.
     */
    function clonearraybuffer(arraybuffer) {
      var result = new arraybuffer.constructor(arraybuffer.bytelength);
      new uint8array(result).set(new uint8array(arraybuffer));
      return result;
    }

    /**
     * creates a clone of `dataview`.
     *
     * @private
     * @param {object} dataview the data view to clone.
     * @param {boolean} [isdeep] specify a deep clone.
     * @returns {object} returns the cloned data view.
     */
    function clonedataview(dataview, isdeep) {
      var buffer = isdeep ? clonearraybuffer(dataview.buffer) : dataview.buffer;
      return new dataview.constructor(buffer, dataview.byteoffset, dataview.bytelength);
    }

    /**
     * creates a clone of `regexp`.
     *
     * @private
     * @param {object} regexp the regexp to clone.
     * @returns {object} returns the cloned regexp.
     */
    function cloneregexp(regexp) {
      var result = new regexp.constructor(regexp.source, reflags.exec(regexp));
      result.lastindex = regexp.lastindex;
      return result;
    }

    /**
     * creates a clone of the `symbol` object.
     *
     * @private
     * @param {object} symbol the symbol object to clone.
     * @returns {object} returns the cloned symbol object.
     */
    function clonesymbol(symbol) {
      return symbolvalueof ? object(symbolvalueof.call(symbol)) : {};
    }

    /**
     * creates a clone of `typedarray`.
     *
     * @private
     * @param {object} typedarray the typed array to clone.
     * @param {boolean} [isdeep] specify a deep clone.
     * @returns {object} returns the cloned typed array.
     */
    function clonetypedarray(typedarray, isdeep) {
      var buffer = isdeep ? clonearraybuffer(typedarray.buffer) : typedarray.buffer;
      return new typedarray.constructor(buffer, typedarray.byteoffset, typedarray.length);
    }

    /**
     * compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @returns {number} returns the sort order indicator for `value`.
     */
    function compareascending(value, other) {
      if (value !== other) {
        var valisdefined = value !== undefined,
            valisnull = value === null,
            valisreflexive = value === value,
            valissymbol = issymbol(value);

        var othisdefined = other !== undefined,
            othisnull = other === null,
            othisreflexive = other === other,
            othissymbol = issymbol(other);

        if ((!othisnull && !othissymbol && !valissymbol && value > other) ||
            (valissymbol && othisdefined && othisreflexive && !othisnull && !othissymbol) ||
            (valisnull && othisdefined && othisreflexive) ||
            (!valisdefined && othisreflexive) ||
            !valisreflexive) {
          return 1;
        }
        if ((!valisnull && !valissymbol && !othissymbol && value < other) ||
            (othissymbol && valisdefined && valisreflexive && !valisnull && !valissymbol) ||
            (othisnull && valisdefined && valisreflexive) ||
            (!othisdefined && valisreflexive) ||
            !othisreflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * used by `_.orderby` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * if `orders` is unspecified, all values are sorted in ascending order. otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {object} object the object to compare.
     * @param {object} other the other object to compare.
     * @param {boolean[]|string[]} orders the order to sort by for each property.
     * @returns {number} returns the sort order indicator for `object`.
     */
    function comparemultiple(object, other, orders) {
      var index = -1,
          objcriteria = object.criteria,
          othcriteria = other.criteria,
          length = objcriteria.length,
          orderslength = orders.length;

      while (++index < length) {
        var result = compareascending(objcriteria[index], othcriteria[index]);
        if (result) {
          if (index >= orderslength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // fixes an `array#sort` bug in the js engine embedded in adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. see https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // this also ensures a stable sort in v8 and other engines.
      // see https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {array} args the provided arguments.
     * @param {array} partials the arguments to prepend to those provided.
     * @param {array} holders the `partials` placeholder indexes.
     * @params {boolean} [iscurried] specify composing for a curried function.
     * @returns {array} returns the new array of composed arguments.
     */
    function composeargs(args, partials, holders, iscurried) {
      var argsindex = -1,
          argslength = args.length,
          holderslength = holders.length,
          leftindex = -1,
          leftlength = partials.length,
          rangelength = nativemax(argslength - holderslength, 0),
          result = array(leftlength + rangelength),
          isuncurried = !iscurried;

      while (++leftindex < leftlength) {
        result[leftindex] = partials[leftindex];
      }
      while (++argsindex < holderslength) {
        if (isuncurried || argsindex < argslength) {
          result[holders[argsindex]] = args[argsindex];
        }
      }
      while (rangelength--) {
        result[leftindex++] = args[argsindex++];
      }
      return result;
    }

    /**
     * this function is like `composeargs` except that the arguments composition
     * is tailored for `_.partialright`.
     *
     * @private
     * @param {array} args the provided arguments.
     * @param {array} partials the arguments to append to those provided.
     * @param {array} holders the `partials` placeholder indexes.
     * @params {boolean} [iscurried] specify composing for a curried function.
     * @returns {array} returns the new array of composed arguments.
     */
    function composeargsright(args, partials, holders, iscurried) {
      var argsindex = -1,
          argslength = args.length,
          holdersindex = -1,
          holderslength = holders.length,
          rightindex = -1,
          rightlength = partials.length,
          rangelength = nativemax(argslength - holderslength, 0),
          result = array(rangelength + rightlength),
          isuncurried = !iscurried;

      while (++argsindex < rangelength) {
        result[argsindex] = args[argsindex];
      }
      var offset = argsindex;
      while (++rightindex < rightlength) {
        result[offset + rightindex] = partials[rightindex];
      }
      while (++holdersindex < holderslength) {
        if (isuncurried || argsindex < argslength) {
          result[offset + holders[holdersindex]] = args[argsindex++];
        }
      }
      return result;
    }

    /**
     * copies the values of `source` to `array`.
     *
     * @private
     * @param {array} source the array to copy values from.
     * @param {array} [array=[]] the array to copy values to.
     * @returns {array} returns `array`.
     */
    function copyarray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * copies properties of `source` to `object`.
     *
     * @private
     * @param {object} source the object to copy properties from.
     * @param {array} props the property identifiers to copy.
     * @param {object} [object={}] the object to copy properties to.
     * @param {function} [customizer] the function to customize copied values.
     * @returns {object} returns `object`.
     */
    function copyobject(source, props, object, customizer) {
      var isnew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newvalue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newvalue === undefined) {
          newvalue = source[key];
        }
        if (isnew) {
          baseassignvalue(object, key, newvalue);
        } else {
          assignvalue(object, key, newvalue);
        }
      }
      return object;
    }

    /**
     * copies own symbols of `source` to `object`.
     *
     * @private
     * @param {object} source the object to copy symbols from.
     * @param {object} [object={}] the object to copy symbols to.
     * @returns {object} returns `object`.
     */
    function copysymbols(source, object) {
      return copyobject(source, getsymbols(source), object);
    }

    /**
     * copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {object} source the object to copy symbols from.
     * @param {object} [object={}] the object to copy symbols to.
     * @returns {object} returns `object`.
     */
    function copysymbolsin(source, object) {
      return copyobject(source, getsymbolsin(source), object);
    }

    /**
     * creates a function like `_.groupby`.
     *
     * @private
     * @param {function} setter the function to set accumulator values.
     * @param {function} [initializer] the accumulator object initializer.
     * @returns {function} returns the new aggregator function.
     */
    function createaggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isarray(collection) ? arrayaggregator : baseaggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getiteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * creates a function like `_.assign`.
     *
     * @private
     * @param {function} assigner the function to assign values.
     * @returns {function} returns the new assigner function.
     */
    function createassigner(assigner) {
      return baserest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isiterateecall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * creates a `baseeach` or `baseeachright` function.
     *
     * @private
     * @param {function} eachfunc the function to iterate over a collection.
     * @param {boolean} [fromright] specify iterating from right to left.
     * @returns {function} returns the new base function.
     */
    function createbaseeach(eachfunc, fromright) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isarraylike(collection)) {
          return eachfunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromright ? length : -1,
            iterable = object(collection);

        while ((fromright ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * creates a base function for methods like `_.forin` and `_.forown`.
     *
     * @private
     * @param {boolean} [fromright] specify iterating from right to left.
     * @returns {function} returns the new base function.
     */
    function createbasefor(fromright) {
      return function(object, iteratee, keysfunc) {
        var index = -1,
            iterable = object(object),
            props = keysfunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromright ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisarg`.
     *
     * @private
     * @param {function} func the function to wrap.
     * @param {number} bitmask the bitmask flags. see `createwrap` for more details.
     * @param {*} [thisarg] the `this` binding of `func`.
     * @returns {function} returns the new wrapped function.
     */
    function createbind(func, bitmask, thisarg) {
      var isbind = bitmask & wrap_bind_flag,
          ctor = creatector(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? ctor : func;
        return fn.apply(isbind ? thisarg : this, arguments);
      }
      return wrapper;
    }

    /**
     * creates a function like `_.lowerfirst`.
     *
     * @private
     * @param {string} methodname the name of the `string` case method to use.
     * @returns {function} returns the new case function.
     */
    function createcasefirst(methodname) {
      return function(string) {
        string = tostring(string);

        var strsymbols = hasunicode(string)
          ? stringtoarray(string)
          : undefined;

        var chr = strsymbols
          ? strsymbols[0]
          : string.charat(0);

        var trailing = strsymbols
          ? castslice(strsymbols, 1).join('')
          : string.slice(1);

        return chr[methodname]() + trailing;
      };
    }

    /**
     * creates a function like `_.camelcase`.
     *
     * @private
     * @param {function} callback the function to combine each word.
     * @returns {function} returns the new compounder function.
     */
    function createcompounder(callback) {
      return function(string) {
        return arrayreduce(words(deburr(string).replace(reapos, '')), callback, '');
      };
    }

    /**
     * creates a function that produces an instance of `ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {function} ctor the constructor to wrap.
     * @returns {function} returns the new wrapped function.
     */
    function creatector(ctor) {
      return function() {
        // use a `switch` statement to work with class constructors. see
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new ctor;
          case 1: return new ctor(args[0]);
          case 2: return new ctor(args[0], args[1]);
          case 3: return new ctor(args[0], args[1], args[2]);
          case 4: return new ctor(args[0], args[1], args[2], args[3]);
          case 5: return new ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisbinding = basecreate(ctor.prototype),
            result = ctor.apply(thisbinding, args);

        // mimic the constructor's `return` behavior.
        // see https://es5.github.io/#x13.2.2 for more details.
        return isobject(result) ? result : thisbinding;
      };
    }

    /**
     * creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {function} func the function to wrap.
     * @param {number} bitmask the bitmask flags. see `createwrap` for more details.
     * @param {number} arity the arity of `func`.
     * @returns {function} returns the new wrapped function.
     */
    function createcurry(func, bitmask, arity) {
      var ctor = creatector(func);

      function wrapper() {
        var length = arguments.length,
            args = array(length),
            index = length,
            placeholder = getholder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceholders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createrecurry(
            func, bitmask, createhybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * creates a `_.find` or `_.findlast` function.
     *
     * @private
     * @param {function} findindexfunc the function to find the collection index.
     * @returns {function} returns the new find function.
     */
    function createfind(findindexfunc) {
      return function(collection, predicate, fromindex) {
        var iterable = object(collection);
        if (!isarraylike(collection)) {
          var iteratee = getiteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findindexfunc(collection, predicate, fromindex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      };
    }

    /**
     * creates a `_.flow` or `_.flowright` function.
     *
     * @private
     * @param {boolean} [fromright] specify iterating from right to left.
     * @returns {function} returns the new flow function.
     */
    function createflow(fromright) {
      return flatrest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = lodashwrapper.prototype.thru;

        if (fromright) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new typeerror(func_error_text);
          }
          if (prereq && !wrapper && getfuncname(func) == 'wrapper') {
            var wrapper = new lodashwrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcname = getfuncname(func),
              data = funcname == 'wrapper' ? getdata(func) : undefined;

          if (data && islaziable(data[0]) &&
                data[1] == (wrap_ary_flag | wrap_curry_flag | wrap_partial_flag | wrap_rearg_flag) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getfuncname(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && islaziable(func))
              ? wrapper[funcname]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isarray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisarg`, partial application, and currying.
     *
     * @private
     * @param {function|string} func the function or method name to wrap.
     * @param {number} bitmask the bitmask flags. see `createwrap` for more details.
     * @param {*} [thisarg] the `this` binding of `func`.
     * @param {array} [partials] the arguments to prepend to those provided to
     *  the new function.
     * @param {array} [holders] the `partials` placeholder indexes.
     * @param {array} [partialsright] the arguments to append to those provided
     *  to the new function.
     * @param {array} [holdersright] the `partialsright` placeholder indexes.
     * @param {array} [argpos] the argument positions of the new function.
     * @param {number} [ary] the arity cap of `func`.
     * @param {number} [arity] the arity of `func`.
     * @returns {function} returns the new wrapped function.
     */
    function createhybrid(func, bitmask, thisarg, partials, holders, partialsright, holdersright, argpos, ary, arity) {
      var isary = bitmask & wrap_ary_flag,
          isbind = bitmask & wrap_bind_flag,
          isbindkey = bitmask & wrap_bind_key_flag,
          iscurried = bitmask & (wrap_curry_flag | wrap_curry_right_flag),
          isflip = bitmask & wrap_flip_flag,
          ctor = isbindkey ? undefined : creatector(func);

      function wrapper() {
        var length = arguments.length,
            args = array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (iscurried) {
          var placeholder = getholder(wrapper),
              holderscount = countholders(args, placeholder);
        }
        if (partials) {
          args = composeargs(args, partials, holders, iscurried);
        }
        if (partialsright) {
          args = composeargsright(args, partialsright, holdersright, iscurried);
        }
        length -= holderscount;
        if (iscurried && length < arity) {
          var newholders = replaceholders(args, placeholder);
          return createrecurry(
            func, bitmask, createhybrid, wrapper.placeholder, thisarg,
            args, newholders, argpos, ary, arity - length
          );
        }
        var thisbinding = isbind ? thisarg : this,
            fn = isbindkey ? thisbinding[func] : func;

        length = args.length;
        if (argpos) {
          args = reorder(args, argpos);
        } else if (isflip && length > 1) {
          args.reverse();
        }
        if (isary && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = ctor || creatector(fn);
        }
        return fn.apply(thisbinding, args);
      }
      return wrapper;
    }

    /**
     * creates a function like `_.invertby`.
     *
     * @private
     * @param {function} setter the function to set accumulator values.
     * @param {function} toiteratee the function to resolve iteratees.
     * @returns {function} returns the new inverter function.
     */
    function createinverter(setter, toiteratee) {
      return function(object, iteratee) {
        return baseinverter(object, setter, toiteratee(iteratee), {});
      };
    }

    /**
     * creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {function} operator the function to perform the operation.
     * @param {number} [defaultvalue] the value used for `undefined` arguments.
     * @returns {function} returns the new mathematical operation function.
     */
    function createmathoperation(operator, defaultvalue) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return defaultvalue;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = basetostring(value);
            other = basetostring(other);
          } else {
            value = basetonumber(value);
            other = basetonumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * creates a function like `_.over`.
     *
     * @private
     * @param {function} arrayfunc the function to iterate over iteratees.
     * @returns {function} returns the new over function.
     */
    function createover(arrayfunc) {
      return flatrest(function(iteratees) {
        iteratees = arraymap(iteratees, baseunary(getiteratee()));
        return baserest(function(args) {
          var thisarg = this;
          return arrayfunc(iteratees, function(iteratee) {
            return apply(iteratee, thisarg, args);
          });
        });
      });
    }

    /**
     * creates the padding for `string` based on `length`. the `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length the padding length.
     * @param {string} [chars=' '] the string used as padding.
     * @returns {string} returns the padding for `string`.
     */
    function createpadding(length, chars) {
      chars = chars === undefined ? ' ' : basetostring(chars);

      var charslength = chars.length;
      if (charslength < 2) {
        return charslength ? baserepeat(chars, length) : chars;
      }
      var result = baserepeat(chars, nativeceil(length / stringsize(chars)));
      return hasunicode(chars)
        ? castslice(stringtoarray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisarg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {function} func the function to wrap.
     * @param {number} bitmask the bitmask flags. see `createwrap` for more details.
     * @param {*} thisarg the `this` binding of `func`.
     * @param {array} partials the arguments to prepend to those provided to
     *  the new function.
     * @returns {function} returns the new wrapped function.
     */
    function createpartial(func, bitmask, thisarg, partials) {
      var isbind = bitmask & wrap_bind_flag,
          ctor = creatector(func);

      function wrapper() {
        var argsindex = -1,
            argslength = arguments.length,
            leftindex = -1,
            leftlength = partials.length,
            args = array(leftlength + argslength),
            fn = (this && this !== root && this instanceof wrapper) ? ctor : func;

        while (++leftindex < leftlength) {
          args[leftindex] = partials[leftindex];
        }
        while (argslength--) {
          args[leftindex++] = arguments[++argsindex];
        }
        return apply(fn, isbind ? thisarg : this, args);
      }
      return wrapper;
    }

    /**
     * creates a `_.range` or `_.rangeright` function.
     *
     * @private
     * @param {boolean} [fromright] specify iterating from right to left.
     * @returns {function} returns the new range function.
     */
    function createrange(fromright) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isiterateecall(start, end, step)) {
          end = step = undefined;
        }
        // ensure the sign of `-0` is preserved.
        start = tofinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = tofinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : tofinite(step);
        return baserange(start, end, step, fromright);
      };
    }

    /**
     * creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {function} operator the function to perform the operation.
     * @returns {function} returns the new relational operation function.
     */
    function createrelationaloperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = tonumber(value);
          other = tonumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {function} func the function to wrap.
     * @param {number} bitmask the bitmask flags. see `createwrap` for more details.
     * @param {function} wrapfunc the function to create the `func` wrapper.
     * @param {*} placeholder the placeholder value.
     * @param {*} [thisarg] the `this` binding of `func`.
     * @param {array} [partials] the arguments to prepend to those provided to
     *  the new function.
     * @param {array} [holders] the `partials` placeholder indexes.
     * @param {array} [argpos] the argument positions of the new function.
     * @param {number} [ary] the arity cap of `func`.
     * @param {number} [arity] the arity of `func`.
     * @returns {function} returns the new wrapped function.
     */
    function createrecurry(func, bitmask, wrapfunc, placeholder, thisarg, partials, holders, argpos, ary, arity) {
      var iscurry = bitmask & wrap_curry_flag,
          newholders = iscurry ? holders : undefined,
          newholdersright = iscurry ? undefined : holders,
          newpartials = iscurry ? partials : undefined,
          newpartialsright = iscurry ? undefined : partials;

      bitmask |= (iscurry ? wrap_partial_flag : wrap_partial_right_flag);
      bitmask &= ~(iscurry ? wrap_partial_right_flag : wrap_partial_flag);

      if (!(bitmask & wrap_curry_bound_flag)) {
        bitmask &= ~(wrap_bind_flag | wrap_bind_key_flag);
      }
      var newdata = [
        func, bitmask, thisarg, newpartials, newholders, newpartialsright,
        newholdersright, argpos, ary, arity
      ];

      var result = wrapfunc.apply(undefined, newdata);
      if (islaziable(func)) {
        setdata(result, newdata);
      }
      result.placeholder = placeholder;
      return setwraptostring(result, func, bitmask);
    }

    /**
     * creates a function like `_.round`.
     *
     * @private
     * @param {string} methodname the name of the `math` method to use when rounding.
     * @returns {function} returns the new round function.
     */
    function createround(methodname) {
      var func = math[methodname];
      return function(number, precision) {
        number = tonumber(number);
        precision = precision == null ? 0 : nativemin(tointeger(precision), 292);
        if (precision && nativeisfinite(number)) {
          // shift with exponential notation to avoid floating-point issues.
          // see [mdn](https://mdn.io/round#examples) for more details.
          var pair = (tostring(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (tostring(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * creates a set object of `values`.
     *
     * @private
     * @param {array} values the values to add to the set.
     * @returns {object} returns the new set.
     */
    var createset = !(set && (1 / settoarray(new set([,-0]))[1]) == infinity) ? noop : function(values) {
      return new set(values);
    };

    /**
     * creates a `_.topairs` or `_.topairsin` function.
     *
     * @private
     * @param {function} keysfunc the function to get the keys of a given object.
     * @returns {function} returns the new pairs function.
     */
    function createtopairs(keysfunc) {
      return function(object) {
        var tag = gettag(object);
        if (tag == maptag) {
          return maptoarray(object);
        }
        if (tag == settag) {
          return settopairs(object);
        }
        return basetopairs(object, keysfunc(object));
      };
    }

    /**
     * creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {function|string} func the function or method name to wrap.
     * @param {number} bitmask the bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindkey`
     *    4 - `_.curry` or `_.curryright` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryright`
     *   32 - `_.partial`
     *   64 - `_.partialright`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisarg] the `this` binding of `func`.
     * @param {array} [partials] the arguments to be partially applied.
     * @param {array} [holders] the `partials` placeholder indexes.
     * @param {array} [argpos] the argument positions of the new function.
     * @param {number} [ary] the arity cap of `func`.
     * @param {number} [arity] the arity of `func`.
     * @returns {function} returns the new wrapped function.
     */
    function createwrap(func, bitmask, thisarg, partials, holders, argpos, ary, arity) {
      var isbindkey = bitmask & wrap_bind_key_flag;
      if (!isbindkey && typeof func != 'function') {
        throw new typeerror(func_error_text);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(wrap_partial_flag | wrap_partial_right_flag);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativemax(tointeger(ary), 0);
      arity = arity === undefined ? arity : tointeger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & wrap_partial_right_flag) {
        var partialsright = partials,
            holdersright = holders;

        partials = holders = undefined;
      }
      var data = isbindkey ? undefined : getdata(func);

      var newdata = [
        func, bitmask, thisarg, partials, holders, partialsright, holdersright,
        argpos, ary, arity
      ];

      if (data) {
        mergedata(newdata, data);
      }
      func = newdata[0];
      bitmask = newdata[1];
      thisarg = newdata[2];
      partials = newdata[3];
      holders = newdata[4];
      arity = newdata[9] = newdata[9] === undefined
        ? (isbindkey ? 0 : func.length)
        : nativemax(newdata[9] - length, 0);

      if (!arity && bitmask & (wrap_curry_flag | wrap_curry_right_flag)) {
        bitmask &= ~(wrap_curry_flag | wrap_curry_right_flag);
      }
      if (!bitmask || bitmask == wrap_bind_flag) {
        var result = createbind(func, bitmask, thisarg);
      } else if (bitmask == wrap_curry_flag || bitmask == wrap_curry_right_flag) {
        result = createcurry(func, bitmask, arity);
      } else if ((bitmask == wrap_partial_flag || bitmask == (wrap_bind_flag | wrap_partial_flag)) && !holders.length) {
        result = createpartial(func, bitmask, thisarg, partials);
      } else {
        result = createhybrid.apply(undefined, newdata);
      }
      var setter = data ? basesetdata : setdata;
      return setwraptostring(setter(result, newdata), func, bitmask);
    }

    /**
     * used by `_.defaults` to customize its `_.assignin` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objvalue the destination value.
     * @param {*} srcvalue the source value.
     * @param {string} key the key of the property to assign.
     * @param {object} object the parent object of `objvalue`.
     * @returns {*} returns the value to assign.
     */
    function customdefaultsassignin(objvalue, srcvalue, key, object) {
      if (objvalue === undefined ||
          (eq(objvalue, objectproto[key]) && !hasownproperty.call(object, key))) {
        return srcvalue;
      }
      return objvalue;
    }

    /**
     * used by `_.defaultsdeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objvalue the destination value.
     * @param {*} srcvalue the source value.
     * @param {string} key the key of the property to merge.
     * @param {object} object the parent object of `objvalue`.
     * @param {object} source the parent object of `srcvalue`.
     * @param {object} [stack] tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} returns the value to assign.
     */
    function customdefaultsmerge(objvalue, srcvalue, key, object, source, stack) {
      if (isobject(objvalue) && isobject(srcvalue)) {
        // recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcvalue, objvalue);
        basemerge(objvalue, srcvalue, undefined, customdefaultsmerge, stack);
        stack['delete'](srcvalue);
      }
      return objvalue;
    }

    /**
     * used by `_.omit` to customize its `_.clonedeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value the value to inspect.
     * @param {string} key the key of the property to inspect.
     * @returns {*} returns the uncloned value or `undefined` to defer cloning to `_.clonedeep`.
     */
    function customomitclone(value) {
      return isplainobject(value) ? undefined : value;
    }

    /**
     * a specialized version of `baseisequaldeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {array} array the array to compare.
     * @param {array} other the other array to compare.
     * @param {number} bitmask the bitmask flags. see `baseisequal` for more details.
     * @param {function} customizer the function to customize comparisons.
     * @param {function} equalfunc the function to determine equivalents of values.
     * @param {object} stack tracks traversed `array` and `other` objects.
     * @returns {boolean} returns `true` if the arrays are equivalent, else `false`.
     */
    function equalarrays(array, other, bitmask, customizer, equalfunc, stack) {
      var ispartial = bitmask & compare_partial_flag,
          arrlength = array.length,
          othlength = other.length;

      if (arrlength != othlength && !(ispartial && othlength > arrlength)) {
        return false;
      }
      // check that cyclic values are equal.
      var arrstacked = stack.get(array);
      var othstacked = stack.get(other);
      if (arrstacked && othstacked) {
        return arrstacked == other && othstacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & compare_unordered_flag) ? new setcache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // ignore non-index properties.
      while (++index < arrlength) {
        var arrvalue = array[index],
            othvalue = other[index];

        if (customizer) {
          var compared = ispartial
            ? customizer(othvalue, arrvalue, index, other, array, stack)
            : customizer(arrvalue, othvalue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraysome(other, function(othvalue, othindex) {
                if (!cachehas(seen, othindex) &&
                    (arrvalue === othvalue || equalfunc(arrvalue, othvalue, bitmask, customizer, stack))) {
                  return seen.push(othindex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrvalue === othvalue ||
                equalfunc(arrvalue, othvalue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * a specialized version of `baseisequaldeep` for comparing objects of
     * the same `tostringtag`.
     *
     * **note:** this function only supports comparing values with tags of
     * `boolean`, `date`, `error`, `number`, `regexp`, or `string`.
     *
     * @private
     * @param {object} object the object to compare.
     * @param {object} other the other object to compare.
     * @param {string} tag the `tostringtag` of the objects to compare.
     * @param {number} bitmask the bitmask flags. see `baseisequal` for more details.
     * @param {function} customizer the function to customize comparisons.
     * @param {function} equalfunc the function to determine equivalents of values.
     * @param {object} stack tracks traversed `object` and `other` objects.
     * @returns {boolean} returns `true` if the objects are equivalent, else `false`.
     */
    function equalbytag(object, other, tag, bitmask, customizer, equalfunc, stack) {
      switch (tag) {
        case dataviewtag:
          if ((object.bytelength != other.bytelength) ||
              (object.byteoffset != other.byteoffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arraybuffertag:
          if ((object.bytelength != other.bytelength) ||
              !equalfunc(new uint8array(object), new uint8array(other))) {
            return false;
          }
          return true;

        case booltag:
        case datetag:
        case numbertag:
          // coerce booleans to `1` or `0` and dates to milliseconds.
          // invalid dates are coerced to `nan`.
          return eq(+object, +other);

        case errortag:
          return object.name == other.name && object.message == other.message;

        case regexptag:
        case stringtag:
          // coerce regexes to strings and treat strings, primitives and objects,
          // as equal. see http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case maptag:
          var convert = maptoarray;

        case settag:
          var ispartial = bitmask & compare_partial_flag;
          convert || (convert = settoarray);

          if (object.size != other.size && !ispartial) {
            return false;
          }
          // assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= compare_unordered_flag;

          // recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalarrays(convert(object), convert(other), bitmask, customizer, equalfunc, stack);
          stack['delete'](object);
          return result;

        case symboltag:
          if (symbolvalueof) {
            return symbolvalueof.call(object) == symbolvalueof.call(other);
          }
      }
      return false;
    }

    /**
     * a specialized version of `baseisequaldeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {object} object the object to compare.
     * @param {object} other the other object to compare.
     * @param {number} bitmask the bitmask flags. see `baseisequal` for more details.
     * @param {function} customizer the function to customize comparisons.
     * @param {function} equalfunc the function to determine equivalents of values.
     * @param {object} stack tracks traversed `object` and `other` objects.
     * @returns {boolean} returns `true` if the objects are equivalent, else `false`.
     */
    function equalobjects(object, other, bitmask, customizer, equalfunc, stack) {
      var ispartial = bitmask & compare_partial_flag,
          objprops = getallkeys(object),
          objlength = objprops.length,
          othprops = getallkeys(other),
          othlength = othprops.length;

      if (objlength != othlength && !ispartial) {
        return false;
      }
      var index = objlength;
      while (index--) {
        var key = objprops[index];
        if (!(ispartial ? key in other : hasownproperty.call(other, key))) {
          return false;
        }
      }
      // check that cyclic values are equal.
      var objstacked = stack.get(object);
      var othstacked = stack.get(other);
      if (objstacked && othstacked) {
        return objstacked == other && othstacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipctor = ispartial;
      while (++index < objlength) {
        key = objprops[index];
        var objvalue = object[key],
            othvalue = other[key];

        if (customizer) {
          var compared = ispartial
            ? customizer(othvalue, objvalue, key, other, object, stack)
            : customizer(objvalue, othvalue, key, object, other, stack);
        }
        // recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objvalue === othvalue || equalfunc(objvalue, othvalue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipctor || (skipctor = key == 'constructor');
      }
      if (result && !skipctor) {
        var objctor = object.constructor,
            othctor = other.constructor;

        // non `object` object instances with different constructors are not equal.
        if (objctor != othctor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objctor == 'function' && objctor instanceof objctor &&
              typeof othctor == 'function' && othctor instanceof othctor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * a specialized version of `baserest` which flattens the rest array.
     *
     * @private
     * @param {function} func the function to apply a rest parameter to.
     * @returns {function} returns the new function.
     */
    function flatrest(func) {
      return settostring(overrest(func, undefined, flatten), func + '');
    }

    /**
     * creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {object} object the object to query.
     * @returns {array} returns the array of property names and symbols.
     */
    function getallkeys(object) {
      return basegetallkeys(object, keys, getsymbols);
    }

    /**
     * creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {object} object the object to query.
     * @returns {array} returns the array of property names and symbols.
     */
    function getallkeysin(object) {
      return basegetallkeys(object, keysin, getsymbolsin);
    }

    /**
     * gets metadata for `func`.
     *
     * @private
     * @param {function} func the function to query.
     * @returns {*} returns the metadata for `func`.
     */
    var getdata = !metamap ? noop : function(func) {
      return metamap.get(func);
    };

    /**
     * gets the name of `func`.
     *
     * @private
     * @param {function} func the function to query.
     * @returns {string} returns the function name.
     */
    function getfuncname(func) {
      var result = (func.name + ''),
          array = realnames[result],
          length = hasownproperty.call(realnames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherfunc = data.func;
        if (otherfunc == null || otherfunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * gets the argument placeholder value for `func`.
     *
     * @private
     * @param {function} func the function to inspect.
     * @returns {*} returns the placeholder value.
     */
    function getholder(func) {
      var object = hasownproperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * gets the appropriate "iteratee" function. if `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseiteratee`.
     * if arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] the value to convert to an iteratee.
     * @param {number} [arity] the arity of the created iteratee.
     * @returns {function} returns the chosen function or its result.
     */
    function getiteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseiteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * gets the data for `map`.
     *
     * @private
     * @param {object} map the map to query.
     * @param {string} key the reference key.
     * @returns {*} returns the map data.
     */
    function getmapdata(map, key) {
      var data = map.__data__;
      return iskeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {object} object the object to query.
     * @returns {array} returns the match data of `object`.
     */
    function getmatchdata(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isstrictcomparable(value)];
      }
      return result;
    }

    /**
     * gets the native function at `key` of `object`.
     *
     * @private
     * @param {object} object the object to query.
     * @param {string} key the key of the method to get.
     * @returns {*} returns the function if it's native, else `undefined`.
     */
    function getnative(object, key) {
      var value = getvalue(object, key);
      return baseisnative(value) ? value : undefined;
    }

    /**
     * a specialized version of `basegettag` which ignores `symbol.tostringtag` values.
     *
     * @private
     * @param {*} value the value to query.
     * @returns {string} returns the raw `tostringtag`.
     */
    function getrawtag(value) {
      var isown = hasownproperty.call(value, symtostringtag),
          tag = value[symtostringtag];

      try {
        value[symtostringtag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeobjecttostring.call(value);
      if (unmasked) {
        if (isown) {
          value[symtostringtag] = tag;
        } else {
          delete value[symtostringtag];
        }
      }
      return result;
    }

    /**
     * creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {object} object the object to query.
     * @returns {array} returns the array of symbols.
     */
    var getsymbols = !nativegetsymbols ? stubarray : function(object) {
      if (object == null) {
        return [];
      }
      object = object(object);
      return arrayfilter(nativegetsymbols(object), function(symbol) {
        return propertyisenumerable.call(object, symbol);
      });
    };

    /**
     * creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {object} object the object to query.
     * @returns {array} returns the array of symbols.
     */
    var getsymbolsin = !nativegetsymbols ? stubarray : function(object) {
      var result = [];
      while (object) {
        arraypush(result, getsymbols(object));
        object = getprototype(object);
      }
      return result;
    };

    /**
     * gets the `tostringtag` of `value`.
     *
     * @private
     * @param {*} value the value to query.
     * @returns {string} returns the `tostringtag`.
     */
    var gettag = basegettag;

    // fallback for data views, maps, sets, and weak maps in ie 11 and promises in node.js < 6.
    if ((dataview && gettag(new dataview(new arraybuffer(1))) != dataviewtag) ||
        (map && gettag(new map) != maptag) ||
        (promise && gettag(promise.resolve()) != promisetag) ||
        (set && gettag(new set) != settag) ||
        (weakmap && gettag(new weakmap) != weakmaptag)) {
      gettag = function(value) {
        var result = basegettag(value),
            ctor = result == objecttag ? value.constructor : undefined,
            ctorstring = ctor ? tosource(ctor) : '';

        if (ctorstring) {
          switch (ctorstring) {
            case dataviewctorstring: return dataviewtag;
            case mapctorstring: return maptag;
            case promisectorstring: return promisetag;
            case setctorstring: return settag;
            case weakmapctorstring: return weakmaptag;
          }
        }
        return result;
      };
    }

    /**
     * gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start the start of the view.
     * @param {number} end the end of the view.
     * @param {array} transforms the transformations to apply to the view.
     * @returns {object} returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getview(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropright': end -= size; break;
          case 'take':      end = nativemin(end, start + size); break;
          case 'takeright': start = nativemax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source the source to inspect.
     * @returns {array} returns the wrapper details.
     */
    function getwrapdetails(source) {
      var match = source.match(rewrapdetails);
      return match ? match[1].split(resplitdetails) : [];
    }

    /**
     * checks if `path` exists on `object`.
     *
     * @private
     * @param {object} object the object to query.
     * @param {array|string} path the path to check.
     * @param {function} hasfunc the function to check properties.
     * @returns {boolean} returns `true` if `path` exists, else `false`.
     */
    function haspath(object, path, hasfunc) {
      path = castpath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = tokey(path[index]);
        if (!(result = object != null && hasfunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && islength(length) && isindex(key, length) &&
        (isarray(object) || isarguments(object));
    }

    /**
     * initializes an array clone.
     *
     * @private
     * @param {array} array the array to clone.
     * @returns {array} returns the initialized clone.
     */
    function initclonearray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // add properties assigned by `regexp#exec`.
      if (length && typeof array[0] == 'string' && hasownproperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * initializes an object clone.
     *
     * @private
     * @param {object} object the object to clone.
     * @returns {object} returns the initialized clone.
     */
    function initcloneobject(object) {
      return (typeof object.constructor == 'function' && !isprototype(object))
        ? basecreate(getprototype(object))
        : {};
    }

    /**
     * initializes an object clone based on its `tostringtag`.
     *
     * **note:** this function only supports cloning values with tags of
     * `boolean`, `date`, `error`, `map`, `number`, `regexp`, `set`, or `string`.
     *
     * @private
     * @param {object} object the object to clone.
     * @param {string} tag the `tostringtag` of the object to clone.
     * @param {boolean} [isdeep] specify a deep clone.
     * @returns {object} returns the initialized clone.
     */
    function initclonebytag(object, tag, isdeep) {
      var ctor = object.constructor;
      switch (tag) {
        case arraybuffertag:
          return clonearraybuffer(object);

        case booltag:
        case datetag:
          return new ctor(+object);

        case dataviewtag:
          return clonedataview(object, isdeep);

        case float32tag: case float64tag:
        case int8tag: case int16tag: case int32tag:
        case uint8tag: case uint8clampedtag: case uint16tag: case uint32tag:
          return clonetypedarray(object, isdeep);

        case maptag:
          return new ctor;

        case numbertag:
        case stringtag:
          return new ctor(object);

        case regexptag:
          return cloneregexp(object);

        case settag:
          return new ctor;

        case symboltag:
          return clonesymbol(object);
      }
    }

    /**
     * inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source the source to modify.
     * @returns {array} details the details to insert.
     * @returns {string} returns the modified source.
     */
    function insertwrapdetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastindex = length - 1;
      details[lastindex] = (length > 1 ? '& ' : '') + details[lastindex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(rewrapcomment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is flattenable, else `false`.
     */
    function isflattenable(value) {
      return isarray(value) || isarguments(value) ||
        !!(spreadablesymbol && value && value[spreadablesymbol]);
    }

    /**
     * checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value the value to check.
     * @param {number} [length=max_safe_integer] the upper bounds of a valid index.
     * @returns {boolean} returns `true` if `value` is a valid index, else `false`.
     */
    function isindex(value, length) {
      var type = typeof value;
      length = length == null ? max_safe_integer : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reisuint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value the potential iteratee value argument.
     * @param {*} index the potential iteratee index or key argument.
     * @param {*} object the potential iteratee object argument.
     * @returns {boolean} returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isiterateecall(value, index, object) {
      if (!isobject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isarraylike(object) && isindex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value the value to check.
     * @param {object} [object] the object to query keys on.
     * @returns {boolean} returns `true` if `value` is a property name, else `false`.
     */
    function iskey(value, object) {
      if (isarray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || issymbol(value)) {
        return true;
      }
      return reisplainprop.test(value) || !reisdeepprop.test(value) ||
        (object != null && value in object(object));
    }

    /**
     * checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is suitable, else `false`.
     */
    function iskeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {function} func the function to check.
     * @returns {boolean} returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function islaziable(func) {
      var funcname = getfuncname(func),
          other = lodash[funcname];

      if (typeof other != 'function' || !(funcname in lazywrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getdata(other);
      return !!data && func === data[0];
    }

    /**
     * checks if `func` has its source masked.
     *
     * @private
     * @param {function} func the function to check.
     * @returns {boolean} returns `true` if `func` is masked, else `false`.
     */
    function ismasked(func) {
      return !!masksrckey && (masksrckey in func);
    }

    /**
     * checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `func` is maskable, else `false`.
     */
    var ismaskable = corejsdata ? isfunction : stubfalse;

    /**
     * checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a prototype, else `false`.
     */
    function isprototype(value) {
      var ctor = value && value.constructor,
          proto = (typeof ctor == 'function' && ctor.prototype) || objectproto;

      return value === proto;
    }

    /**
     * checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isstrictcomparable(value) {
      return value === value && !isobject(value);
    }

    /**
     * a specialized version of `matchesproperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key the key of the property to get.
     * @param {*} srcvalue the value to match.
     * @returns {function} returns the new spec function.
     */
    function matchesstrictcomparable(key, srcvalue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcvalue &&
          (srcvalue !== undefined || (key in object(object)));
      };
    }

    /**
     * a specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `max_memoize_size`.
     *
     * @private
     * @param {function} func the function to have its output memoized.
     * @returns {function} returns the new memoized function.
     */
    function memoizecapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === max_memoize_size) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * merges the function metadata of `source` into `data`.
     *
     * merging metadata reduces the number of wrappers used to invoke a function.
     * this is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. however, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {array} data the destination metadata.
     * @param {array} source the source metadata.
     * @returns {array} returns `data`.
     */
    function mergedata(data, source) {
      var bitmask = data[1],
          srcbitmask = source[1],
          newbitmask = bitmask | srcbitmask,
          iscommon = newbitmask < (wrap_bind_flag | wrap_bind_key_flag | wrap_ary_flag);

      var iscombo =
        ((srcbitmask == wrap_ary_flag) && (bitmask == wrap_curry_flag)) ||
        ((srcbitmask == wrap_ary_flag) && (bitmask == wrap_rearg_flag) && (data[7].length <= source[8])) ||
        ((srcbitmask == (wrap_ary_flag | wrap_rearg_flag)) && (source[7].length <= source[8]) && (bitmask == wrap_curry_flag));

      // exit early if metadata can't be merged.
      if (!(iscommon || iscombo)) {
        return data;
      }
      // use source `thisarg` if available.
      if (srcbitmask & wrap_bind_flag) {
        data[2] = source[2];
        // set when currying a bound function.
        newbitmask |= bitmask & wrap_bind_flag ? 0 : wrap_curry_bound_flag;
      }
      // compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeargs(partials, value, source[4]) : value;
        data[4] = partials ? replaceholders(data[3], placeholder) : source[4];
      }
      // compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeargsright(partials, value, source[6]) : value;
        data[6] = partials ? replaceholders(data[5], placeholder) : source[6];
      }
      // use source `argpos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // use source `ary` if it's smaller.
      if (srcbitmask & wrap_ary_flag) {
        data[8] = data[8] == null ? source[8] : nativemin(data[8], source[8]);
      }
      // use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newbitmask;

      return data;
    }

    /**
     * this function is like
     * [`object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {object} object the object to query.
     * @returns {array} returns the array of property names.
     */
    function nativekeysin(object) {
      var result = [];
      if (object != null) {
        for (var key in object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * converts `value` to a string using `object.prototype.tostring`.
     *
     * @private
     * @param {*} value the value to convert.
     * @returns {string} returns the converted string.
     */
    function objecttostring(value) {
      return nativeobjecttostring.call(value);
    }

    /**
     * a specialized version of `baserest` which transforms the rest array.
     *
     * @private
     * @param {function} func the function to apply a rest parameter to.
     * @param {number} [start=func.length-1] the start position of the rest parameter.
     * @param {function} transform the rest array transform.
     * @returns {function} returns the new function.
     */
    function overrest(func, start, transform) {
      start = nativemax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativemax(args.length - start, 0),
            array = array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherargs = array(start + 1);
        while (++index < start) {
          otherargs[index] = args[index];
        }
        otherargs[start] = transform(array);
        return apply(func, this, otherargs);
      };
    }

    /**
     * gets the parent value at `path` of `object`.
     *
     * @private
     * @param {object} object the object to query.
     * @param {array} path the path to get the parent value of.
     * @returns {*} returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseget(object, baseslice(path, 0, -1));
    }

    /**
     * reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {array} array the array to reorder.
     * @param {array} indexes the arranged array indexes.
     * @returns {array} returns `array`.
     */
    function reorder(array, indexes) {
      var arrlength = array.length,
          length = nativemin(indexes.length, arrlength),
          oldarray = copyarray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isindex(index, arrlength) ? oldarray[index] : undefined;
      }
      return array;
    }

    /**
     * gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {object} object the object to query.
     * @param {string} key the key of the property to get.
     * @returns {*} returns the property value.
     */
    function safeget(object, key) {
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }

      if (key == '__proto__') {
        return;
      }

      return object[key];
    }

    /**
     * sets metadata for `func`.
     *
     * **note:** if this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in v8. see
     * [v8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {function} func the function to associate metadata with.
     * @param {*} data the metadata.
     * @returns {function} returns `func`.
     */
    var setdata = shortout(basesetdata);

    /**
     * a simple wrapper around the global [`settimeout`](https://mdn.io/settimeout).
     *
     * @private
     * @param {function} func the function to delay.
     * @param {number} wait the number of milliseconds to delay invocation.
     * @returns {number|object} returns the timer id or timeout object.
     */
    var settimeout = ctxsettimeout || function(func, wait) {
      return root.settimeout(func, wait);
    };

    /**
     * sets the `tostring` method of `func` to return `string`.
     *
     * @private
     * @param {function} func the function to modify.
     * @param {function} string the `tostring` result.
     * @returns {function} returns `func`.
     */
    var settostring = shortout(basesettostring);

    /**
     * sets the `tostring` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {function} wrapper the function to modify.
     * @param {function} reference the reference function.
     * @param {number} bitmask the bitmask flags. see `createwrap` for more details.
     * @returns {function} returns `wrapper`.
     */
    function setwraptostring(wrapper, reference, bitmask) {
      var source = (reference + '');
      return settostring(wrapper, insertwrapdetails(source, updatewrapdetails(getwrapdetails(source), bitmask)));
    }

    /**
     * creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `hot_count` or more times in `hot_span`
     * milliseconds.
     *
     * @private
     * @param {function} func the function to restrict.
     * @returns {function} returns the new shortable function.
     */
    function shortout(func) {
      var count = 0,
          lastcalled = 0;

      return function() {
        var stamp = nativenow(),
            remaining = hot_span - (stamp - lastcalled);

        lastcalled = stamp;
        if (remaining > 0) {
          if (++count >= hot_count) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * a specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {array} array the array to shuffle.
     * @param {number} [size=array.length] the size of `array`.
     * @returns {array} returns `array`.
     */
    function shuffleself(array, size) {
      var index = -1,
          length = array.length,
          lastindex = length - 1;

      size = size === undefined ? length : size;
      while (++index < size) {
        var rand = baserandom(index, lastindex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * converts `string` to a property path array.
     *
     * @private
     * @param {string} string the string to convert.
     * @returns {array} returns the property path array.
     */
    var stringtopath = memoizecapped(function(string) {
      var result = [];
      if (string.charcodeat(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(repropname, function(match, number, quote, substring) {
        result.push(quote ? substring.replace(reescapechar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value the value to inspect.
     * @returns {string|symbol} returns the key.
     */
    function tokey(value) {
      if (typeof value == 'string' || issymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -infinity) ? '-0' : result;
    }

    /**
     * converts `func` to its source code.
     *
     * @private
     * @param {function} func the function to convert.
     * @returns {string} returns the source code.
     */
    function tosource(func) {
      if (func != null) {
        try {
          return functostring.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {array} details the details to modify.
     * @param {number} bitmask the bitmask flags. see `createwrap` for more details.
     * @returns {array} returns `details`.
     */
    function updatewrapdetails(details, bitmask) {
      arrayeach(wrapflags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayincludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * creates a clone of `wrapper`.
     *
     * @private
     * @param {object} wrapper the wrapper to clone.
     * @returns {object} returns the cloned wrapper.
     */
    function wrapperclone(wrapper) {
      if (wrapper instanceof lazywrapper) {
        return wrapper.clone();
      }
      var result = new lodashwrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyarray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * creates an array of elements split into groups the length of `size`.
     * if `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to process.
     * @param {number} [size=1] the length of each chunk
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {array} returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isiterateecall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativemax(tointeger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resindex = 0,
          result = array(nativeceil(length / size));

      while (index < length) {
        result[resindex++] = baseslice(array, index, (index += size));
      }
      return result;
    }

    /**
     * creates an array with all falsey values removed. the values `false`, `null`,
     * `0`, `""`, `undefined`, and `nan` are falsey.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to compact.
     * @returns {array} returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resindex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resindex++] = value;
        }
      }
      return result;
    }

    /**
     * creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to concatenate.
     * @param {...*} [values] the values to concatenate.
     * @returns {array} returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arraypush(isarray(array) ? copyarray(array) : [array], baseflatten(args, 1));
    }

    /**
     * creates an array of `array` values not included in the other given arrays
     * using [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. the order and references of result values are
     * determined by the first array.
     *
     * **note:** unlike `_.pullall`, this method returns a new array.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {...array} [values] the values to exclude.
     * @returns {array} returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baserest(function(array, values) {
      return isarraylikeobject(array)
        ? basedifference(array, baseflatten(values, 1, isarraylikeobject, true))
        : [];
    });

    /**
     * this method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. the order and references of result values are
     * determined by the first array. the iteratee is invoked with one argument:
     * (value).
     *
     * **note:** unlike `_.pullallby`, this method returns a new array.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {...array} [values] the values to exclude.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {array} returns the new array of filtered values.
     * @example
     *
     * _.differenceby([2.1, 1.2], [2.3, 3.4], math.floor);
     * // => [1.2]
     *
     * // the `_.property` iteratee shorthand.
     * _.differenceby([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceby = baserest(function(array, values) {
      var iteratee = last(values);
      if (isarraylikeobject(iteratee)) {
        iteratee = undefined;
      }
      return isarraylikeobject(array)
        ? basedifference(array, baseflatten(values, 1, isarraylikeobject, true), getiteratee(iteratee, 2))
        : [];
    });

    /**
     * this method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. the order and
     * references of result values are determined by the first array. the comparator
     * is invoked with two arguments: (arrval, othval).
     *
     * **note:** unlike `_.pullallwith`, this method returns a new array.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {...array} [values] the values to exclude.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differencewith(objects, [{ 'x': 1, 'y': 2 }], _.isequal);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differencewith = baserest(function(array, values) {
      var comparator = last(values);
      if (isarraylikeobject(comparator)) {
        comparator = undefined;
      }
      return isarraylikeobject(array)
        ? basedifference(array, baseflatten(values, 1, isarraylikeobject, true), undefined, comparator)
        : [];
    });

    /**
     * creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberof _
     * @since 0.5.0
     * @category array
     * @param {array} array the array to query.
     * @param {number} [n=1] the number of elements to drop.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : tointeger(n);
      return baseslice(array, n < 0 ? 0 : n, length);
    }

    /**
     * creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to query.
     * @param {number} [n=1] the number of elements to drop.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * _.dropright([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropright([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropright([1, 2, 3], 5);
     * // => []
     *
     * _.dropright([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropright(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : tointeger(n);
      n = length - n;
      return baseslice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * creates a slice of `array` excluding elements dropped from the end.
     * elements are dropped until `predicate` returns falsey. the predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to query.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.droprightwhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // the `_.matches` iteratee shorthand.
     * _.droprightwhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.droprightwhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // the `_.property` iteratee shorthand.
     * _.droprightwhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function droprightwhile(array, predicate) {
      return (array && array.length)
        ? basewhile(array, getiteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * creates a slice of `array` excluding elements dropped from the beginning.
     * elements are dropped until `predicate` returns falsey. the predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to query.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropwhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // the `_.matches` iteratee shorthand.
     * _.dropwhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.dropwhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // the `_.property` iteratee shorthand.
     * _.dropwhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropwhile(array, predicate) {
      return (array && array.length)
        ? basewhile(array, getiteratee(predicate, 3), true)
        : [];
    }

    /**
     * fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **note:** this method mutates `array`.
     *
     * @static
     * @memberof _
     * @since 3.2.0
     * @category array
     * @param {array} array the array to fill.
     * @param {*} value the value to fill `array` with.
     * @param {number} [start=0] the start position.
     * @param {number} [end=array.length] the end position.
     * @returns {array} returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isiterateecall(array, value, start)) {
        start = 0;
        end = length;
      }
      return basefill(array, value, start, end);
    }

    /**
     * this method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberof _
     * @since 1.1.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @param {number} [fromindex=0] the index to search from.
     * @returns {number} returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findindex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // the `_.matches` iteratee shorthand.
     * _.findindex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.findindex(users, ['active', false]);
     * // => 0
     *
     * // the `_.property` iteratee shorthand.
     * _.findindex(users, 'active');
     * // => 2
     */
    function findindex(array, predicate, fromindex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromindex == null ? 0 : tointeger(fromindex);
      if (index < 0) {
        index = nativemax(length + index, 0);
      }
      return basefindindex(array, getiteratee(predicate, 3), index);
    }

    /**
     * this method is like `_.findindex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @param {number} [fromindex=array.length-1] the index to search from.
     * @returns {number} returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findlastindex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // the `_.matches` iteratee shorthand.
     * _.findlastindex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.findlastindex(users, ['active', false]);
     * // => 2
     *
     * // the `_.property` iteratee shorthand.
     * _.findlastindex(users, 'active');
     * // => 0
     */
    function findlastindex(array, predicate, fromindex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromindex !== undefined) {
        index = tointeger(fromindex);
        index = fromindex < 0
          ? nativemax(length + index, 0)
          : nativemin(index, length - 1);
      }
      return basefindindex(array, getiteratee(predicate, 3), index, true);
    }

    /**
     * flattens `array` a single level deep.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to flatten.
     * @returns {array} returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseflatten(array, 1) : [];
    }

    /**
     * recursively flattens `array`.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to flatten.
     * @returns {array} returns the new flattened array.
     * @example
     *
     * _.flattendeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattendeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseflatten(array, infinity) : [];
    }

    /**
     * recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberof _
     * @since 4.4.0
     * @category array
     * @param {array} array the array to flatten.
     * @param {number} [depth=1] the maximum recursion depth.
     * @returns {array} returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattendepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattendepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattendepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : tointeger(depth);
      return baseflatten(array, depth);
    }

    /**
     * the inverse of `_.topairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} pairs the key-value pairs.
     * @returns {object} returns the new object.
     * @example
     *
     * _.frompairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function frompairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * gets the first element of `array`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @alias first
     * @category array
     * @param {array} array the array to query.
     * @returns {*} returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * gets the index at which the first occurrence of `value` is found in `array`
     * using [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. if `fromindex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {*} value the value to search for.
     * @param {number} [fromindex=0] the index to search from.
     * @returns {number} returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexof([1, 2, 1, 2], 2);
     * // => 1
     *
     * // search from the `fromindex`.
     * _.indexof([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexof(array, value, fromindex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromindex == null ? 0 : tointeger(fromindex);
      if (index < 0) {
        index = nativemax(length + index, 0);
      }
      return baseindexof(array, value, index);
    }

    /**
     * gets all but the last element of `array`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to query.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseslice(array, 0, -1) : [];
    }

    /**
     * creates an array of unique values that are included in all given arrays
     * using [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. the order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {...array} [arrays] the arrays to inspect.
     * @returns {array} returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baserest(function(arrays) {
      var mapped = arraymap(arrays, castarraylikeobject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseintersection(mapped)
        : [];
    });

    /**
     * this method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. the order and references of result values are
     * determined by the first array. the iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {...array} [arrays] the arrays to inspect.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {array} returns the new array of intersecting values.
     * @example
     *
     * _.intersectionby([2.1, 1.2], [2.3, 3.4], math.floor);
     * // => [2.1]
     *
     * // the `_.property` iteratee shorthand.
     * _.intersectionby([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionby = baserest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arraymap(arrays, castarraylikeobject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseintersection(mapped, getiteratee(iteratee, 2))
        : [];
    });

    /**
     * this method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. the order and references
     * of result values are determined by the first array. the comparator is
     * invoked with two arguments: (arrval, othval).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {...array} [arrays] the arrays to inspect.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionwith(objects, others, _.isequal);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionwith = baserest(function(arrays) {
      var comparator = last(arrays),
          mapped = arraymap(arrays, castarraylikeobject);

      comparator = typeof comparator == 'function' ? comparator : undefined;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseintersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to convert.
     * @param {string} [separator=','] the element separator.
     * @returns {string} returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativejoin.call(array, separator);
    }

    /**
     * gets the last element of `array`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to query.
     * @returns {*} returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    /**
     * this method is like `_.indexof` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {*} value the value to search for.
     * @param {number} [fromindex=array.length-1] the index to search from.
     * @returns {number} returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastindexof([1, 2, 1, 2], 2);
     * // => 3
     *
     * // search from the `fromindex`.
     * _.lastindexof([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastindexof(array, value, fromindex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromindex !== undefined) {
        index = tointeger(fromindex);
        index = index < 0 ? nativemax(length + index, 0) : nativemin(index, length - 1);
      }
      return value === value
        ? strictlastindexof(array, value, index)
        : basefindindex(array, baseisnan, index, true);
    }

    /**
     * gets the element at index `n` of `array`. if `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberof _
     * @since 4.11.0
     * @category array
     * @param {array} array the array to query.
     * @param {number} [n=0] the index of the element to return.
     * @returns {*} returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? basenth(array, tointeger(n)) : undefined;
    }

    /**
     * removes all given values from `array` using
     * [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **note:** unlike `_.without`, this method mutates `array`. use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @category array
     * @param {array} array the array to modify.
     * @param {...*} [values] the values to remove.
     * @returns {array} returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baserest(pullall);

    /**
     * this method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **note:** unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to modify.
     * @param {array} values the values to remove.
     * @returns {array} returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullall(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullall(array, values) {
      return (array && array.length && values && values.length)
        ? basepullall(array, values)
        : array;
    }

    /**
     * this method is like `_.pullall` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. the iteratee is invoked with one argument: (value).
     *
     * **note:** unlike `_.differenceby`, this method mutates `array`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to modify.
     * @param {array} values the values to remove.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {array} returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullallby(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullallby(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basepullall(array, values, getiteratee(iteratee, 2))
        : array;
    }

    /**
     * this method is like `_.pullall` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. the comparator is
     * invoked with two arguments: (arrval, othval).
     *
     * **note:** unlike `_.differencewith`, this method mutates `array`.
     *
     * @static
     * @memberof _
     * @since 4.6.0
     * @category array
     * @param {array} array the array to modify.
     * @param {array} values the values to remove.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullallwith(array, [{ 'x': 3, 'y': 4 }], _.isequal);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullallwith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basepullall(array, values, undefined, comparator)
        : array;
    }

    /**
     * removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **note:** unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to modify.
     * @param {...(number|number[])} [indexes] the indexes of elements to remove.
     * @returns {array} returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullat(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullat = flatrest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseat(array, indexes);

      basepullat(array, arraymap(indexes, function(index) {
        return isindex(index, length) ? +index : index;
      }).sort(compareascending));

      return result;
    });

    /**
     * removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. the predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **note:** unlike `_.filter`, this method mutates `array`. use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @category array
     * @param {array} array the array to modify.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {array} returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getiteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basepullat(array, indexes);
      return result;
    }

    /**
     * reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **note:** this method mutates `array` and is based on
     * [`array#reverse`](https://mdn.io/array/reverse).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to modify.
     * @returns {array} returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativereverse.call(array);
    }

    /**
     * creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **note:** this method is used instead of
     * [`array#slice`](https://mdn.io/array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to slice.
     * @param {number} [start=0] the start position.
     * @param {number} [end=array.length] the end position.
     * @returns {array} returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isiterateecall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : tointeger(start);
        end = end === undefined ? length : tointeger(end);
      }
      return baseslice(array, start, end);
    }

    /**
     * uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the sorted array to inspect.
     * @param {*} value the value to evaluate.
     * @returns {number} returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedindex([30, 50], 40);
     * // => 1
     */
    function sortedindex(array, value) {
      return basesortedindex(array, value);
    }

    /**
     * this method is like `_.sortedindex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. the iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the sorted array to inspect.
     * @param {*} value the value to evaluate.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {number} returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedindexby(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // the `_.property` iteratee shorthand.
     * _.sortedindexby(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedindexby(array, value, iteratee) {
      return basesortedindexby(array, value, getiteratee(iteratee, 2));
    }

    /**
     * this method is like `_.indexof` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {*} value the value to search for.
     * @returns {number} returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedindexof([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedindexof(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = basesortedindex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * this method is like `_.sortedindex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the sorted array to inspect.
     * @param {*} value the value to evaluate.
     * @returns {number} returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedlastindex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedlastindex(array, value) {
      return basesortedindex(array, value, true);
    }

    /**
     * this method is like `_.sortedlastindex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. the iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the sorted array to inspect.
     * @param {*} value the value to evaluate.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {number} returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedlastindexby(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // the `_.property` iteratee shorthand.
     * _.sortedlastindexby(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedlastindexby(array, value, iteratee) {
      return basesortedindexby(array, value, getiteratee(iteratee, 2), true);
    }

    /**
     * this method is like `_.lastindexof` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {*} value the value to search for.
     * @returns {number} returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedlastindexof([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedlastindexof(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = basesortedindex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * this method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to inspect.
     * @returns {array} returns the new duplicate free array.
     * @example
     *
     * _.sorteduniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sorteduniq(array) {
      return (array && array.length)
        ? basesorteduniq(array)
        : [];
    }

    /**
     * this method is like `_.uniqby` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {function} [iteratee] the iteratee invoked per element.
     * @returns {array} returns the new duplicate free array.
     * @example
     *
     * _.sorteduniqby([1.1, 1.2, 2.3, 2.4], math.floor);
     * // => [1.1, 2.3]
     */
    function sorteduniqby(array, iteratee) {
      return (array && array.length)
        ? basesorteduniq(array, getiteratee(iteratee, 2))
        : [];
    }

    /**
     * gets all but the first element of `array`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to query.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseslice(array, 1, length) : [];
    }

    /**
     * creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to query.
     * @param {number} [n=1] the number of elements to take.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : tointeger(n);
      return baseslice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to query.
     * @param {number} [n=1] the number of elements to take.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * _.takeright([1, 2, 3]);
     * // => [3]
     *
     * _.takeright([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeright([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeright([1, 2, 3], 0);
     * // => []
     */
    function takeright(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : tointeger(n);
      n = length - n;
      return baseslice(array, n < 0 ? 0 : n, length);
    }

    /**
     * creates a slice of `array` with elements taken from the end. elements are
     * taken until `predicate` returns falsey. the predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to query.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takerightwhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // the `_.matches` iteratee shorthand.
     * _.takerightwhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.takerightwhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // the `_.property` iteratee shorthand.
     * _.takerightwhile(users, 'active');
     * // => []
     */
    function takerightwhile(array, predicate) {
      return (array && array.length)
        ? basewhile(array, getiteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * creates a slice of `array` with elements taken from the beginning. elements
     * are taken until `predicate` returns falsey. the predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category array
     * @param {array} array the array to query.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {array} returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takewhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // the `_.matches` iteratee shorthand.
     * _.takewhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.takewhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // the `_.property` iteratee shorthand.
     * _.takewhile(users, 'active');
     * // => []
     */
    function takewhile(array, predicate) {
      return (array && array.length)
        ? basewhile(array, getiteratee(predicate, 3))
        : [];
    }

    /**
     * creates an array of unique values, in order, from all given arrays using
     * [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {...array} [arrays] the arrays to inspect.
     * @returns {array} returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baserest(function(arrays) {
      return baseuniq(baseflatten(arrays, 1, isarraylikeobject, true));
    });

    /**
     * this method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. result values are chosen from the first
     * array in which the value occurs. the iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {...array} [arrays] the arrays to inspect.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {array} returns the new array of combined values.
     * @example
     *
     * _.unionby([2.1], [1.2, 2.3], math.floor);
     * // => [2.1, 1.2]
     *
     * // the `_.property` iteratee shorthand.
     * _.unionby([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionby = baserest(function(arrays) {
      var iteratee = last(arrays);
      if (isarraylikeobject(iteratee)) {
        iteratee = undefined;
      }
      return baseuniq(baseflatten(arrays, 1, isarraylikeobject, true), getiteratee(iteratee, 2));
    });

    /**
     * this method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. result values are chosen from
     * the first array in which the value occurs. the comparator is invoked
     * with two arguments: (arrval, othval).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {...array} [arrays] the arrays to inspect.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionwith(objects, others, _.isequal);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionwith = baserest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseuniq(baseflatten(arrays, 1, isarraylikeobject, true), undefined, comparator);
    });

    /**
     * creates a duplicate-free version of an array, using
     * [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. the order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to inspect.
     * @returns {array} returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseuniq(array) : [];
    }

    /**
     * this method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. the order of result values is determined by the
     * order they occur in the array. the iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {array} returns the new duplicate free array.
     * @example
     *
     * _.uniqby([2.1, 1.2, 2.3], math.floor);
     * // => [2.1, 1.2]
     *
     * // the `_.property` iteratee shorthand.
     * _.uniqby([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqby(array, iteratee) {
      return (array && array.length) ? baseuniq(array, getiteratee(iteratee, 2)) : [];
    }

    /**
     * this method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. the order of result values is
     * determined by the order they occur in the array.the comparator is invoked
     * with two arguments: (arrval, othval).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqwith(objects, _.isequal);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqwith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return (array && array.length) ? baseuniq(array, undefined, comparator) : [];
    }

    /**
     * this method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberof _
     * @since 1.2.0
     * @category array
     * @param {array} array the array of grouped elements to process.
     * @returns {array} returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayfilter(array, function(group) {
        if (isarraylikeobject(group)) {
          length = nativemax(group.length, length);
          return true;
        }
      });
      return basetimes(length, function(index) {
        return arraymap(array, baseproperty(index));
      });
    }

    /**
     * this method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. the iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberof _
     * @since 3.8.0
     * @category array
     * @param {array} array the array of grouped elements to process.
     * @param {function} [iteratee=_.identity] the function to combine
     *  regrouped values.
     * @returns {array} returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipwith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipwith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arraymap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * creates an array excluding all given values using
     * [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **note:** unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {array} array the array to inspect.
     * @param {...*} [values] the values to exclude.
     * @returns {array} returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baserest(function(array, values) {
      return isarraylikeobject(array)
        ? basedifference(array, values)
        : [];
    });

    /**
     * creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/symmetric_difference)
     * of the given arrays. the order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberof _
     * @since 2.4.0
     * @category array
     * @param {...array} [arrays] the arrays to inspect.
     * @returns {array} returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baserest(function(arrays) {
      return basexor(arrayfilter(arrays, isarraylikeobject));
    });

    /**
     * this method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. the order of result values is determined
     * by the order they occur in the arrays. the iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {...array} [arrays] the arrays to inspect.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {array} returns the new array of filtered values.
     * @example
     *
     * _.xorby([2.1, 1.2], [2.3, 3.4], math.floor);
     * // => [1.2, 3.4]
     *
     * // the `_.property` iteratee shorthand.
     * _.xorby([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorby = baserest(function(arrays) {
      var iteratee = last(arrays);
      if (isarraylikeobject(iteratee)) {
        iteratee = undefined;
      }
      return basexor(arrayfilter(arrays, isarraylikeobject), getiteratee(iteratee, 2));
    });

    /**
     * this method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. the order of result values is
     * determined by the order they occur in the arrays. the comparator is invoked
     * with two arguments: (arrval, othval).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category array
     * @param {...array} [arrays] the arrays to inspect.
     * @param {function} [comparator] the comparator invoked per element.
     * @returns {array} returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorwith(objects, others, _.isequal);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorwith = baserest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return basexor(arrayfilter(arrays, isarraylikeobject), undefined, comparator);
    });

    /**
     * creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category array
     * @param {...array} [arrays] the arrays to process.
     * @returns {array} returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baserest(unzip);

    /**
     * this method is like `_.frompairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberof _
     * @since 0.4.0
     * @category array
     * @param {array} [props=[]] the property identifiers.
     * @param {array} [values=[]] the property values.
     * @returns {object} returns the new object.
     * @example
     *
     * _.zipobject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipobject(props, values) {
      return basezipobject(props || [], values || [], assignvalue);
    }

    /**
     * this method is like `_.zipobject` except that it supports property paths.
     *
     * @static
     * @memberof _
     * @since 4.1.0
     * @category array
     * @param {array} [props=[]] the property identifiers.
     * @param {array} [values=[]] the property values.
     * @returns {object} returns the new object.
     * @example
     *
     * _.zipobjectdeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipobjectdeep(props, values) {
      return basezipobject(props || [], values || [], baseset);
    }

    /**
     * this method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. the iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberof _
     * @since 3.8.0
     * @category array
     * @param {...array} [arrays] the arrays to process.
     * @param {function} [iteratee=_.identity] the function to combine
     *  grouped values.
     * @returns {array} returns the new array of grouped elements.
     * @example
     *
     * _.zipwith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipwith = baserest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipwith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. the result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberof _
     * @since 1.3.0
     * @category seq
     * @param {*} value the value to wrap.
     * @returns {object} returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortby('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * this method invokes `interceptor` and returns `value`. the interceptor
     * is invoked with one argument; (value). the purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category seq
     * @param {*} value the value to provide to `interceptor`.
     * @param {function} interceptor the function to invoke.
     * @returns {*} returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * this method is like `_.tap` except that it returns the result of `interceptor`.
     * the purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category seq
     * @param {*} value the value to provide to `interceptor`.
     * @param {function} interceptor the function to invoke.
     * @returns {*} returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * this method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberof _
     * @since 1.0.0
     * @category seq
     * @param {...(string|string[])} [paths] the property paths to pick.
     * @returns {object} returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperat = flatrest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseat(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof lazywrapper) || !isindex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisarg': undefined
      });
      return new lodashwrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberof _
     * @since 0.1.0
     * @category seq
     * @returns {object} returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // a sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // a sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperchain() {
      return chain(this);
    }

    /**
     * executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberof _
     * @since 3.2.0
     * @category seq
     * @returns {object} returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrappercommit() {
      return new lodashwrapper(this.value(), this.__chain__);
    }

    /**
     * gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberof _
     * @since 4.0.0
     * @category seq
     * @returns {object} returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrappernext() {
      if (this.__values__ === undefined) {
        this.__values__ = toarray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * enables the wrapper to be iterable.
     *
     * @name symbol.iterator
     * @memberof _
     * @since 4.0.0
     * @category seq
     * @returns {object} returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[symbol.iterator]() === wrapped;
     * // => true
     *
     * array.from(wrapped);
     * // => [1, 2]
     */
    function wrappertoiterator() {
      return this;
    }

    /**
     * creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberof _
     * @since 3.2.0
     * @category seq
     * @param {*} value the value to plant.
     * @returns {object} returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperplant(value) {
      var result,
          parent = this;

      while (parent instanceof baselodash) {
        var clone = wrapperclone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * this method is the wrapper version of `_.reverse`.
     *
     * **note:** this method mutates the wrapped array.
     *
     * @name reverse
     * @memberof _
     * @since 0.1.0
     * @category seq
     * @returns {object} returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperreverse() {
      var value = this.__wrapped__;
      if (value instanceof lazywrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new lazywrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisarg': undefined
        });
        return new lodashwrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberof _
     * @since 0.1.0
     * @alias tojson, valueof
     * @category seq
     * @returns {*} returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrappervalue() {
      return basewrappervalue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. the corresponding value of
     * each key is the number of times the key was returned by `iteratee`. the
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 0.5.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the iteratee to transform keys.
     * @returns {object} returns the composed aggregate object.
     * @example
     *
     * _.countby([6.1, 4.2, 6.3], math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // the `_.property` iteratee shorthand.
     * _.countby(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countby = createaggregator(function(result, value, key) {
      if (hasownproperty.call(result, key)) {
        ++result[key];
      } else {
        baseassignvalue(result, key, 1);
      }
    });

    /**
     * checks if `predicate` returns truthy for **all** elements of `collection`.
     * iteration is stopped once `predicate` returns falsey. the predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **note:** this method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // the `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // the `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isarray(collection) ? arrayevery : baseevery;
      if (guard && isiterateecall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getiteratee(predicate, 3));
    }

    /**
     * iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. the predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **note:** unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {array} returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // the `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // the `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     *
     * // combining several predicates using `_.overevery` or `_.oversome`.
     * _.filter(users, _.oversome([{ 'age': 36 }, ['age', 40]]));
     * // => objects for ['fred', 'barney']
     */
    function filter(collection, predicate) {
      var func = isarray(collection) ? arrayfilter : basefilter;
      return func(collection, getiteratee(predicate, 3));
    }

    /**
     * iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. the predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to inspect.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @param {number} [fromindex=0] the index to search from.
     * @returns {*} returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // the `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // the `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createfind(findindex);

    /**
     * this method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @category collection
     * @param {array|object} collection the collection to inspect.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @param {number} [fromindex=collection.length-1] the index to search from.
     * @returns {*} returns the matched element, else `undefined`.
     * @example
     *
     * _.findlast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findlast = createfind(findlastindex);

    /**
     * creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. the iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {array} returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatmap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatmap(collection, iteratee) {
      return baseflatten(map(collection, iteratee), 1);
    }

    /**
     * this method is like `_.flatmap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberof _
     * @since 4.7.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {array} returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatmapdeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatmapdeep(collection, iteratee) {
      return baseflatten(map(collection, iteratee), infinity);
    }

    /**
     * this method is like `_.flatmap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberof _
     * @since 4.7.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @param {number} [depth=1] the maximum recursion depth.
     * @returns {array} returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatmapdepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatmapdepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : tointeger(depth);
      return baseflatten(map(collection, iteratee), depth);
    }

    /**
     * iterates over elements of `collection` and invokes `iteratee` for each element.
     * the iteratee is invoked with three arguments: (value, index|key, collection).
     * iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **note:** as with other "collections" methods, objects with a "length"
     * property are iterated like arrays. to avoid this behavior use `_.forin`
     * or `_.forown` for object iteration.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @alias each
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {array|object} returns `collection`.
     * @see _.foreachright
     * @example
     *
     * _.foreach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => logs `1` then `2`.
     *
     * _.foreach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function foreach(collection, iteratee) {
      var func = isarray(collection) ? arrayeach : baseeach;
      return func(collection, getiteratee(iteratee, 3));
    }

    /**
     * this method is like `_.foreach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @alias eachright
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {array|object} returns `collection`.
     * @see _.foreach
     * @example
     *
     * _.foreachright([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => logs `2` then `1`.
     */
    function foreachright(collection, iteratee) {
      var func = isarray(collection) ? arrayeachright : baseeachright;
      return func(collection, getiteratee(iteratee, 3));
    }

    /**
     * creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. the order of grouped values
     * is determined by the order they occur in `collection`. the corresponding
     * value of each key is an array of elements responsible for generating the
     * key. the iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the iteratee to transform keys.
     * @returns {object} returns the composed aggregate object.
     * @example
     *
     * _.groupby([6.1, 4.2, 6.3], math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // the `_.property` iteratee shorthand.
     * _.groupby(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupby = createaggregator(function(result, value, key) {
      if (hasownproperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseassignvalue(result, key, [value]);
      }
    });

    /**
     * checks if `value` is in `collection`. if `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. if `fromindex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object|string} collection the collection to inspect.
     * @param {*} value the value to search for.
     * @param {number} [fromindex=0] the index to search from.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromindex, guard) {
      collection = isarraylike(collection) ? collection : values(collection);
      fromindex = (fromindex && !guard) ? tointeger(fromindex) : 0;

      var length = collection.length;
      if (fromindex < 0) {
        fromindex = nativemax(length + fromindex, 0);
      }
      return isstring(collection)
        ? (fromindex <= length && collection.indexof(value, fromindex) > -1)
        : (!!length && baseindexof(collection, value, fromindex) > -1);
    }

    /**
     * invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. any additional arguments
     * are provided to each invoked method. if `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {array|function|string} path the path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] the arguments to invoke each method with.
     * @returns {array} returns the array of results.
     * @example
     *
     * _.invokemap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokemap([123, 456], string.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokemap = baserest(function(collection, path, args) {
      var index = -1,
          isfunc = typeof path == 'function',
          result = isarraylike(collection) ? array(collection.length) : [];

      baseeach(collection, function(value) {
        result[++index] = isfunc ? apply(path, value, args) : baseinvoke(value, path, args);
      });
      return result;
    });

    /**
     * creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. the corresponding value of
     * each key is the last element responsible for generating the key. the
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the iteratee to transform keys.
     * @returns {object} returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyby(array, function(o) {
     *   return string.fromcharcode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyby(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyby = createaggregator(function(result, value, key) {
      baseassignvalue(result, key, value);
    });

    /**
     * creates an array of values by running each element in `collection` thru
     * `iteratee`. the iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapvalues`, `_.reject`, and `_.some`.
     *
     * the guarded methods are:
     * `ary`, `chunk`, `curry`, `curryright`, `drop`, `dropright`, `every`,
     * `fill`, `invert`, `parseint`, `random`, `range`, `rangeright`, `repeat`,
     * `samplesize`, `slice`, `some`, `sortby`, `split`, `take`, `takeright`,
     * `template`, `trim`, `trimend`, `trimstart`, and `words`
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {array} returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // the `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isarray(collection) ? arraymap : basemap;
      return func(collection, getiteratee(iteratee, 3));
    }

    /**
     * this method is like `_.sortby` except that it allows specifying the sort
     * orders of the iteratees to sort by. if `orders` is unspecified, all values
     * are sorted in ascending order. otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {array[]|function[]|object[]|string[]} [iteratees=[_.identity]]
     *  the iteratees to sort by.
     * @param {string[]} [orders] the sort orders of `iteratees`.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.reduce`.
     * @returns {array} returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // sort by `user` in ascending order and by `age` in descending order.
     * _.orderby(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderby(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isarray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isarray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseorderby(collection, iteratees, orders);
    }

    /**
     * creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. the predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {array} returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // the `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // the `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createaggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. if `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. the iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceright`, and `_.transform`.
     *
     * the guarded methods are:
     * `assign`, `defaults`, `defaultsdeep`, `includes`, `merge`, `orderby`,
     * and `sortby`
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @param {*} [accumulator] the initial value.
     * @returns {*} returns the accumulated value.
     * @see _.reduceright
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isarray(collection) ? arrayreduce : basereduce,
          initaccum = arguments.length < 3;

      return func(collection, getiteratee(iteratee, 4), accumulator, initaccum, baseeach);
    }

    /**
     * this method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @param {*} [accumulator] the initial value.
     * @returns {*} returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceright(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceright(collection, iteratee, accumulator) {
      var func = isarray(collection) ? arrayreduceright : basereduce,
          initaccum = arguments.length < 3;

      return func(collection, getiteratee(iteratee, 4), accumulator, initaccum, baseeachright);
    }

    /**
     * the opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {array} returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // the `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // the `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isarray(collection) ? arrayfilter : basefilter;
      return func(collection, negate(getiteratee(predicate, 3)));
    }

    /**
     * gets a random element from `collection`.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @category collection
     * @param {array|object} collection the collection to sample.
     * @returns {*} returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isarray(collection) ? arraysample : basesample;
      return func(collection);
    }

    /**
     * gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category collection
     * @param {array|object} collection the collection to sample.
     * @param {number} [n=1] the number of elements to sample.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {array} returns the random elements.
     * @example
     *
     * _.samplesize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.samplesize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function samplesize(collection, n, guard) {
      if ((guard ? isiterateecall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = tointeger(n);
      }
      var func = isarray(collection) ? arraysamplesize : basesamplesize;
      return func(collection, n);
    }

    /**
     * creates an array of shuffled values, using a version of the
     * [fisher-yates shuffle](https://en.wikipedia.org/wiki/fisher-yates_shuffle).
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to shuffle.
     * @returns {array} returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isarray(collection) ? arrayshuffle : baseshuffle;
      return func(collection);
    }

    /**
     * gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object|string} collection the collection to inspect.
     * @returns {number} returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isarraylike(collection)) {
        return isstring(collection) ? stringsize(collection) : collection.length;
      }
      var tag = gettag(collection);
      if (tag == maptag || tag == settag) {
        return collection.size;
      }
      return basekeys(collection).length;
    }

    /**
     * checks if `predicate` returns truthy for **any** element of `collection`.
     * iteration is stopped once `predicate` returns truthy. the predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // the `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // the `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isarray(collection) ? arraysome : basesome;
      if (guard && isiterateecall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getiteratee(predicate, 3));
    }

    /**
     * creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. this method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. the iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category collection
     * @param {array|object} collection the collection to iterate over.
     * @param {...(function|function[])} [iteratees=[_.identity]]
     *  the iteratees to sort by.
     * @returns {array} returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 30 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortby(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
     *
     * _.sortby(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
     */
    var sortby = baserest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isiterateecall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isiterateecall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseorderby(collection, baseflatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * gets the timestamp of the number of milliseconds that have elapsed since
     * the unix epoch (1 january 1970 00:00:00 utc).
     *
     * @static
     * @memberof _
     * @since 2.4.0
     * @category date
     * @returns {number} returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxnow || function() {
      return root.date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * the opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category function
     * @param {number} n the number of calls before `func` is invoked.
     * @param {function} func the function to restrict.
     * @returns {function} returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.foreach(saves, function(type) {
     *   asyncsave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new typeerror(func_error_text);
      }
      n = tointeger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category function
     * @param {function} func the function to cap arguments for.
     * @param {number} [n=func.length] the arity cap.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {function} returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseint, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createwrap(func, wrap_ary_flag, undefined, undefined, undefined, undefined, n);
    }

    /**
     * creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category function
     * @param {number} n the number of calls at which `func` is no longer invoked.
     * @param {function} func the function to restrict.
     * @returns {function} returns the new restricted function.
     * @example
     *
     * jquery(element).on('click', _.before(5, addcontacttolist));
     * // => allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new typeerror(func_error_text);
      }
      n = tointeger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * creates a function that invokes `func` with the `this` binding of `thisarg`
     * and `partials` prepended to the arguments it receives.
     *
     * the `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **note:** unlike native `function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category function
     * @param {function} func the function to bind.
     * @param {*} thisarg the `this` binding of `func`.
     * @param {...*} [partials] the arguments to be partially applied.
     * @returns {function} returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baserest(function(func, thisarg, partials) {
      var bitmask = wrap_bind_flag;
      if (partials.length) {
        var holders = replaceholders(partials, getholder(bind));
        bitmask |= wrap_partial_flag;
      }
      return createwrap(func, bitmask, thisarg, partials, holders);
    });

    /**
     * creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * this method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. see
     * [peter michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * the `_.bindkey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberof _
     * @since 0.10.0
     * @category function
     * @param {object} object the object to invoke the method on.
     * @param {string} key the key of the method.
     * @param {...*} [partials] the arguments to be partially applied.
     * @returns {function} returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindkey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // bound with placeholders.
     * var bound = _.bindkey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindkey = baserest(function(object, key, partials) {
      var bitmask = wrap_bind_flag | wrap_bind_key_flag;
      if (partials.length) {
        var holders = replaceholders(partials, getholder(bindkey));
        bitmask |= wrap_partial_flag;
      }
      return createwrap(key, bitmask, object, partials, holders);
    });

    /**
     * creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. the arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * the `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **note:** this method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @category function
     * @param {function} func the function to curry.
     * @param {number} [arity=func.length] the arity of `func`.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {function} returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createwrap(func, wrap_curry_flag, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * this method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialright` instead of `_.partial`.
     *
     * the `_.curryright.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **note:** this method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category function
     * @param {function} func the function to curry.
     * @param {number} [arity=func.length] the arity of `func`.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {function} returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryright(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryright(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createwrap(func, wrap_curry_right_flag, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryright.placeholder;
      return result;
    }

    /**
     * creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. the debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. the `func` is invoked
     * with the last arguments provided to the debounced function. subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **note:** if `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * if `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `settimeout` with a timeout of `0`.
     *
     * see [david corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category function
     * @param {function} func the function to debounce.
     * @param {number} [wait=0] the number of milliseconds to delay.
     * @param {object} [options={}] the options object.
     * @param {boolean} [options.leading=false]
     *  specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxwait]
     *  the maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  specify invoking on the trailing edge of the timeout.
     * @returns {function} returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux.
     * jquery(window).on('resize', _.debounce(calculatelayout, 150));
     *
     * // invoke `sendmail` when clicked, debouncing subsequent calls.
     * jquery(element).on('click', _.debounce(sendmail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchlog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchlog, 250, { 'maxwait': 1000 });
     * var source = new eventsource('/stream');
     * jquery(source).on('message', debounced);
     *
     * // cancel the trailing debounced invocation.
     * jquery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastargs,
          lastthis,
          maxwait,
          result,
          timerid,
          lastcalltime,
          lastinvoketime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new typeerror(func_error_text);
      }
      wait = tonumber(wait) || 0;
      if (isobject(options)) {
        leading = !!options.leading;
        maxing = 'maxwait' in options;
        maxwait = maxing ? nativemax(tonumber(options.maxwait) || 0, wait) : maxwait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokefunc(time) {
        var args = lastargs,
            thisarg = lastthis;

        lastargs = lastthis = undefined;
        lastinvoketime = time;
        result = func.apply(thisarg, args);
        return result;
      }

      function leadingedge(time) {
        // reset any `maxwait` timer.
        lastinvoketime = time;
        // start the timer for the trailing edge.
        timerid = settimeout(timerexpired, wait);
        // invoke the leading edge.
        return leading ? invokefunc(time) : result;
      }

      function remainingwait(time) {
        var timesincelastcall = time - lastcalltime,
            timesincelastinvoke = time - lastinvoketime,
            timewaiting = wait - timesincelastcall;

        return maxing
          ? nativemin(timewaiting, maxwait - timesincelastinvoke)
          : timewaiting;
      }

      function shouldinvoke(time) {
        var timesincelastcall = time - lastcalltime,
            timesincelastinvoke = time - lastinvoketime;

        // either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxwait` limit.
        return (lastcalltime === undefined || (timesincelastcall >= wait) ||
          (timesincelastcall < 0) || (maxing && timesincelastinvoke >= maxwait));
      }

      function timerexpired() {
        var time = now();
        if (shouldinvoke(time)) {
          return trailingedge(time);
        }
        // restart the timer.
        timerid = settimeout(timerexpired, remainingwait(time));
      }

      function trailingedge(time) {
        timerid = undefined;

        // only invoke if we have `lastargs` which means `func` has been
        // debounced at least once.
        if (trailing && lastargs) {
          return invokefunc(time);
        }
        lastargs = lastthis = undefined;
        return result;
      }

      function cancel() {
        if (timerid !== undefined) {
          cleartimeout(timerid);
        }
        lastinvoketime = 0;
        lastargs = lastcalltime = lastthis = timerid = undefined;
      }

      function flush() {
        return timerid === undefined ? result : trailingedge(now());
      }

      function debounced() {
        var time = now(),
            isinvoking = shouldinvoke(time);

        lastargs = arguments;
        lastthis = this;
        lastcalltime = time;

        if (isinvoking) {
          if (timerid === undefined) {
            return leadingedge(lastcalltime);
          }
          if (maxing) {
            // handle invocations in a tight loop.
            cleartimeout(timerid);
            timerid = settimeout(timerexpired, wait);
            return invokefunc(lastcalltime);
          }
        }
        if (timerid === undefined) {
          timerid = settimeout(timerexpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * defers invoking the `func` until the current call stack has cleared. any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category function
     * @param {function} func the function to defer.
     * @param {...*} [args] the arguments to invoke `func` with.
     * @returns {number} returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => logs 'deferred' after one millisecond.
     */
    var defer = baserest(function(func, args) {
      return basedelay(func, 1, args);
    });

    /**
     * invokes `func` after `wait` milliseconds. any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category function
     * @param {function} func the function to delay.
     * @param {number} wait the number of milliseconds to delay invocation.
     * @param {...*} [args] the arguments to invoke `func` with.
     * @returns {number} returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second.
     */
    var delay = baserest(function(func, wait, args) {
      return basedelay(func, tonumber(wait) || 0, args);
    });

    /**
     * creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category function
     * @param {function} func the function to flip arguments for.
     * @returns {function} returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toarray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createwrap(func, wrap_flip_flag);
    }

    /**
     * creates a function that memoizes the result of `func`. if `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. by default, the first argument
     * provided to the memoized function is used as the map cache key. the `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **note:** the cache is exposed as the `cache` property on the memoized
     * function. its creation may be customized by replacing the `_.memoize.cache`
     * constructor with one whose instances implement the
     * [`map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category function
     * @param {function} func the function to have its output memoized.
     * @param {function} [resolver] the function to resolve the cache key.
     * @returns {function} returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // replace `_.memoize.cache`.
     * _.memoize.cache = weakmap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new typeerror(func_error_text);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.cache || mapcache);
      return memoized;
    }

    // expose `mapcache`.
    memoize.cache = mapcache;

    /**
     * creates a function that negates the result of the predicate `func`. the
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category function
     * @param {function} predicate the predicate to negate.
     * @returns {function} returns the new negated function.
     * @example
     *
     * function iseven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(iseven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new typeerror(func_error_text);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * creates a function that is restricted to invoking `func` once. repeat calls
     * to the function return the value of the first invocation. the `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category function
     * @param {function} func the function to restrict.
     * @returns {function} returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createapplication);
     * initialize();
     * initialize();
     * // => `createapplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberof _
     * @category function
     * @param {function} func the function to wrap.
     * @param {...(function|function[])} [transforms=[_.identity]]
     *  the argument transforms.
     * @returns {function} returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overargs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overargs = castrest(function(func, transforms) {
      transforms = (transforms.length == 1 && isarray(transforms[0]))
        ? arraymap(transforms[0], baseunary(getiteratee()))
        : arraymap(baseflatten(transforms, 1), baseunary(getiteratee()));

      var funcslength = transforms.length;
      return baserest(function(args) {
        var index = -1,
            length = nativemin(args.length, funcslength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. this method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * the `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **note:** this method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberof _
     * @since 0.2.0
     * @category function
     * @param {function} func the function to partially apply arguments to.
     * @param {...*} [partials] the arguments to be partially applied.
     * @returns {function} returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayhelloto = _.partial(greet, 'hello');
     * sayhelloto('fred');
     * // => 'hello fred'
     *
     * // partially applied with placeholders.
     * var greetfred = _.partial(greet, _, 'fred');
     * greetfred('hi');
     * // => 'hi fred'
     */
    var partial = baserest(function(func, partials) {
      var holders = replaceholders(partials, getholder(partial));
      return createwrap(func, wrap_partial_flag, undefined, partials, holders);
    });

    /**
     * this method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * the `_.partialright.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **note:** this method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberof _
     * @since 1.0.0
     * @category function
     * @param {function} func the function to partially apply arguments to.
     * @param {...*} [partials] the arguments to be partially applied.
     * @returns {function} returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetfred = _.partialright(greet, 'fred');
     * greetfred('hi');
     * // => 'hi fred'
     *
     * // partially applied with placeholders.
     * var sayhelloto = _.partialright(greet, 'hello', _);
     * sayhelloto('fred');
     * // => 'hello fred'
     */
    var partialright = baserest(function(func, partials) {
      var holders = replaceholders(partials, getholder(partialright));
      return createwrap(func, wrap_partial_right_flag, undefined, partials, holders);
    });

    /**
     * creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category function
     * @param {function} func the function to rearrange arguments for.
     * @param {...(number|number[])} indexes the arranged argument indexes.
     * @returns {function} returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatrest(function(func, indexes) {
      return createwrap(func, wrap_rearg_flag, undefined, undefined, undefined, indexes);
    });

    /**
     * creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **note:** this method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category function
     * @param {function} func the function to apply a rest parameter to.
     * @param {number} [start=func.length-1] the start position of the rest parameter.
     * @returns {function} returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new typeerror(func_error_text);
      }
      start = start === undefined ? start : tointeger(start);
      return baserest(func, start);
    }

    /**
     * creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **note:** this method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberof _
     * @since 3.2.0
     * @category function
     * @param {function} func the function to spread arguments over.
     * @param {number} [start=0] the start position of the spread.
     * @returns {function} returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = promise.all([
     *   promise.resolve(40),
     *   promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new typeerror(func_error_text);
      }
      start = start == null ? 0 : nativemax(tointeger(start), 0);
      return baserest(function(args) {
        var array = args[start],
            otherargs = castslice(args, 0, start);

        if (array) {
          arraypush(otherargs, array);
        }
        return apply(func, this, otherargs);
      });
    }

    /**
     * creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. the throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. the `func` is invoked with the last arguments provided to the
     * throttled function. subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **note:** if `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * if `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `settimeout` with a timeout of `0`.
     *
     * see [david corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category function
     * @param {function} func the function to throttle.
     * @param {number} [wait=0] the number of milliseconds to throttle invocations to.
     * @param {object} [options={}] the options object.
     * @param {boolean} [options.leading=true]
     *  specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  specify invoking on the trailing edge of the timeout.
     * @returns {function} returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling.
     * jquery(window).on('scroll', _.throttle(updateposition, 100));
     *
     * // invoke `renewtoken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewtoken, 300000, { 'trailing': false });
     * jquery(element).on('click', throttled);
     *
     * // cancel the trailing throttled invocation.
     * jquery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new typeerror(func_error_text);
      }
      if (isobject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxwait': wait,
        'trailing': trailing
      });
    }

    /**
     * creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category function
     * @param {function} func the function to cap arguments for.
     * @returns {function} returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseint));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * creates a function that provides `value` to `wrapper` as its first
     * argument. any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. the wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category function
     * @param {*} value the value to wrap.
     * @param {function} [wrapper=identity] the wrapper function.
     * @returns {function} returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castfunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * casts `value` as an array if it's not one.
     *
     * @static
     * @memberof _
     * @since 4.4.0
     * @category lang
     * @param {*} value the value to inspect.
     * @returns {array} returns the cast array.
     * @example
     *
     * _.castarray(1);
     * // => [1]
     *
     * _.castarray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castarray('abc');
     * // => ['abc']
     *
     * _.castarray(null);
     * // => [null]
     *
     * _.castarray(undefined);
     * // => [undefined]
     *
     * _.castarray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castarray(array) === array);
     * // => true
     */
    function castarray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isarray(value) ? value : [value];
    }

    /**
     * creates a shallow clone of `value`.
     *
     * **note:** this method is loosely based on the
     * [structured clone algorithm](https://mdn.io/structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `object` objects, regexes, sets, strings, symbols, and typed
     * arrays. the own enumerable properties of `arguments` objects are cloned
     * as plain objects. an empty object is returned for uncloneable values such
     * as error objects, functions, dom nodes, and weakmaps.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to clone.
     * @returns {*} returns the cloned value.
     * @see _.clonedeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseclone(value, clone_symbols_flag);
    }

    /**
     * this method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. if `customizer` returns `undefined`,
     * cloning is handled by the method instead. the `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to clone.
     * @param {function} [customizer] the function to customize cloning.
     * @returns {*} returns the cloned value.
     * @see _.clonedeepwith
     * @example
     *
     * function customizer(value) {
     *   if (_.iselement(value)) {
     *     return value.clonenode(false);
     *   }
     * }
     *
     * var el = _.clonewith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodename);
     * // => 'body'
     * console.log(el.childnodes.length);
     * // => 0
     */
    function clonewith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseclone(value, clone_symbols_flag, customizer);
    }

    /**
     * this method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberof _
     * @since 1.0.0
     * @category lang
     * @param {*} value the value to recursively clone.
     * @returns {*} returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.clonedeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function clonedeep(value) {
      return baseclone(value, clone_deep_flag | clone_symbols_flag);
    }

    /**
     * this method is like `_.clonewith` except that it recursively clones `value`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to recursively clone.
     * @param {function} [customizer] the function to customize cloning.
     * @returns {*} returns the deep cloned value.
     * @see _.clonewith
     * @example
     *
     * function customizer(value) {
     *   if (_.iselement(value)) {
     *     return value.clonenode(true);
     *   }
     * }
     *
     * var el = _.clonedeepwith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodename);
     * // => 'body'
     * console.log(el.childnodes.length);
     * // => 20
     */
    function clonedeepwith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseclone(value, clone_deep_flag | clone_symbols_flag, customizer);
    }

    /**
     * checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **note:** this method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberof _
     * @since 4.14.0
     * @category lang
     * @param {object} object the object to inspect.
     * @param {object} source the object of property predicates to conform to.
     * @returns {boolean} returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsto(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsto(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsto(object, source) {
      return source == null || baseconformsto(object, source, keys(source));
    }

    /**
     * performs a
     * [`samevaluezero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @returns {boolean} returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', object('a'));
     * // => false
     *
     * _.eq(nan, nan);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * checks if `value` is greater than `other`.
     *
     * @static
     * @memberof _
     * @since 3.9.0
     * @category lang
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @returns {boolean} returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createrelationaloperation(basegt);

    /**
     * checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberof _
     * @since 3.9.0
     * @category lang
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @returns {boolean} returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createrelationaloperation(function(value, other) {
      return value >= other;
    });

    /**
     * checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isarguments(function() { return arguments; }());
     * // => true
     *
     * _.isarguments([1, 2, 3]);
     * // => false
     */
    var isarguments = baseisarguments(function() { return arguments; }()) ? baseisarguments : function(value) {
      return isobjectlike(value) && hasownproperty.call(value, 'callee') &&
        !propertyisenumerable.call(value, 'callee');
    };

    /**
     * checks if `value` is classified as an `array` object.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isarray([1, 2, 3]);
     * // => true
     *
     * _.isarray(document.body.children);
     * // => false
     *
     * _.isarray('abc');
     * // => false
     *
     * _.isarray(_.noop);
     * // => false
     */
    var isarray = array.isarray;

    /**
     * checks if `value` is classified as an `arraybuffer` object.
     *
     * @static
     * @memberof _
     * @since 4.3.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isarraybuffer(new arraybuffer(2));
     * // => true
     *
     * _.isarraybuffer(new array(2));
     * // => false
     */
    var isarraybuffer = nodeisarraybuffer ? baseunary(nodeisarraybuffer) : baseisarraybuffer;

    /**
     * checks if `value` is array-like. a value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `number.max_safe_integer`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isarraylike([1, 2, 3]);
     * // => true
     *
     * _.isarraylike(document.body.children);
     * // => true
     *
     * _.isarraylike('abc');
     * // => true
     *
     * _.isarraylike(_.noop);
     * // => false
     */
    function isarraylike(value) {
      return value != null && islength(value.length) && !isfunction(value);
    }

    /**
     * this method is like `_.isarraylike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isarraylikeobject([1, 2, 3]);
     * // => true
     *
     * _.isarraylikeobject(document.body.children);
     * // => true
     *
     * _.isarraylikeobject('abc');
     * // => false
     *
     * _.isarraylikeobject(_.noop);
     * // => false
     */
    function isarraylikeobject(value) {
      return isobjectlike(value) && isarraylike(value);
    }

    /**
     * checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isboolean(false);
     * // => true
     *
     * _.isboolean(null);
     * // => false
     */
    function isboolean(value) {
      return value === true || value === false ||
        (isobjectlike(value) && basegettag(value) == booltag);
    }

    /**
     * checks if `value` is a buffer.
     *
     * @static
     * @memberof _
     * @since 4.3.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isbuffer(new buffer(2));
     * // => true
     *
     * _.isbuffer(new uint8array(2));
     * // => false
     */
    var isbuffer = nativeisbuffer || stubfalse;

    /**
     * checks if `value` is classified as a `date` object.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isdate(new date);
     * // => true
     *
     * _.isdate('mon april 23 2012');
     * // => false
     */
    var isdate = nodeisdate ? baseunary(nodeisdate) : baseisdate;

    /**
     * checks if `value` is likely a dom element.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a dom element, else `false`.
     * @example
     *
     * _.iselement(document.body);
     * // => true
     *
     * _.iselement('<body>');
     * // => false
     */
    function iselement(value) {
      return isobjectlike(value) && value.nodetype === 1 && !isplainobject(value);
    }

    /**
     * checks if `value` is an empty object, collection, map, or set.
     *
     * objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jquery-like collections are considered empty if they have a `length` of `0`.
     * similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isempty(null);
     * // => true
     *
     * _.isempty(true);
     * // => true
     *
     * _.isempty(1);
     * // => true
     *
     * _.isempty([1, 2, 3]);
     * // => false
     *
     * _.isempty({ 'a': 1 });
     * // => false
     */
    function isempty(value) {
      if (value == null) {
        return true;
      }
      if (isarraylike(value) &&
          (isarray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isbuffer(value) || istypedarray(value) || isarguments(value))) {
        return !value.length;
      }
      var tag = gettag(value);
      if (tag == maptag || tag == settag) {
        return !value.size;
      }
      if (isprototype(value)) {
        return !basekeys(value).length;
      }
      for (var key in value) {
        if (hasownproperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **note:** this method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `object` objects are compared
     * by their own, not inherited, enumerable properties. functions and dom
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @returns {boolean} returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isequal(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isequal(value, other) {
      return baseisequal(value, other);
    }

    /**
     * this method is like `_.isequal` except that it accepts `customizer` which
     * is invoked to compare values. if `customizer` returns `undefined`, comparisons
     * are handled by the method instead. the `customizer` is invoked with up to
     * six arguments: (objvalue, othvalue [, index|key, object, other, stack]).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @param {function} [customizer] the function to customize comparisons.
     * @returns {boolean} returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isgreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objvalue, othvalue) {
     *   if (isgreeting(objvalue) && isgreeting(othvalue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isequalwith(array, other, customizer);
     * // => true
     */
    function isequalwith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseisequal(value, other, undefined, customizer) : !!result;
    }

    /**
     * checks if `value` is an `error`, `evalerror`, `rangeerror`, `referenceerror`,
     * `syntaxerror`, `typeerror`, or `urierror` object.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.iserror(new error);
     * // => true
     *
     * _.iserror(error);
     * // => false
     */
    function iserror(value) {
      if (!isobjectlike(value)) {
        return false;
      }
      var tag = basegettag(value);
      return tag == errortag || tag == domexctag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isplainobject(value));
    }

    /**
     * checks if `value` is a finite primitive number.
     *
     * **note:** this method is based on
     * [`number.isfinite`](https://mdn.io/number/isfinite).
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isfinite(3);
     * // => true
     *
     * _.isfinite(number.min_value);
     * // => true
     *
     * _.isfinite(infinity);
     * // => false
     *
     * _.isfinite('3');
     * // => false
     */
    function isfinite(value) {
      return typeof value == 'number' && nativeisfinite(value);
    }

    /**
     * checks if `value` is classified as a `function` object.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isfunction(_);
     * // => true
     *
     * _.isfunction(/abc/);
     * // => false
     */
    function isfunction(value) {
      if (!isobject(value)) {
        return false;
      }
      // the use of `object#tostring` avoids issues with the `typeof` operator
      // in safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = basegettag(value);
      return tag == functag || tag == gentag || tag == asynctag || tag == proxytag;
    }

    /**
     * checks if `value` is an integer.
     *
     * **note:** this method is based on
     * [`number.isinteger`](https://mdn.io/number/isinteger).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isinteger(3);
     * // => true
     *
     * _.isinteger(number.min_value);
     * // => false
     *
     * _.isinteger(infinity);
     * // => false
     *
     * _.isinteger('3');
     * // => false
     */
    function isinteger(value) {
      return typeof value == 'number' && value == tointeger(value);
    }

    /**
     * checks if `value` is a valid array-like length.
     *
     * **note:** this method is loosely based on
     * [`tolength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.islength(3);
     * // => true
     *
     * _.islength(number.min_value);
     * // => false
     *
     * _.islength(infinity);
     * // => false
     *
     * _.islength('3');
     * // => false
     */
    function islength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= max_safe_integer;
    }

    /**
     * checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `object`. (e.g. arrays, functions, objects, regexes, `new number(0)`, and `new string('')`)
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isobject({});
     * // => true
     *
     * _.isobject([1, 2, 3]);
     * // => true
     *
     * _.isobject(_.noop);
     * // => true
     *
     * _.isobject(null);
     * // => false
     */
    function isobject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * checks if `value` is object-like. a value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isobjectlike({});
     * // => true
     *
     * _.isobjectlike([1, 2, 3]);
     * // => true
     *
     * _.isobjectlike(_.noop);
     * // => false
     *
     * _.isobjectlike(null);
     * // => false
     */
    function isobjectlike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * checks if `value` is classified as a `map` object.
     *
     * @static
     * @memberof _
     * @since 4.3.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.ismap(new map);
     * // => true
     *
     * _.ismap(new weakmap);
     * // => false
     */
    var ismap = nodeismap ? baseunary(nodeismap) : baseismap;

    /**
     * performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **note:** this method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. see `_.isequal`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category lang
     * @param {object} object the object to inspect.
     * @param {object} source the object of property values to match.
     * @returns {boolean} returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.ismatch(object, { 'b': 2 });
     * // => true
     *
     * _.ismatch(object, { 'b': 1 });
     * // => false
     */
    function ismatch(object, source) {
      return object === source || baseismatch(object, source, getmatchdata(source));
    }

    /**
     * this method is like `_.ismatch` except that it accepts `customizer` which
     * is invoked to compare values. if `customizer` returns `undefined`, comparisons
     * are handled by the method instead. the `customizer` is invoked with five
     * arguments: (objvalue, srcvalue, index|key, object, source).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {object} object the object to inspect.
     * @param {object} source the object of property values to match.
     * @param {function} [customizer] the function to customize comparisons.
     * @returns {boolean} returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isgreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objvalue, srcvalue) {
     *   if (isgreeting(objvalue) && isgreeting(srcvalue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.ismatchwith(object, source, customizer);
     * // => true
     */
    function ismatchwith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseismatch(object, source, getmatchdata(source), customizer);
    }

    /**
     * checks if `value` is `nan`.
     *
     * **note:** this method is based on
     * [`number.isnan`](https://mdn.io/number/isnan) and is not the same as
     * global [`isnan`](https://mdn.io/isnan) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is `nan`, else `false`.
     * @example
     *
     * _.isnan(nan);
     * // => true
     *
     * _.isnan(new number(nan));
     * // => true
     *
     * isnan(undefined);
     * // => true
     *
     * _.isnan(undefined);
     * // => false
     */
    function isnan(value) {
      // an `nan` primitive is the only value that is not equal to itself.
      // perform the `tostringtag` check first to avoid errors with some
      // activex objects in ie.
      return isnumber(value) && value != +value;
    }

    /**
     * checks if `value` is a pristine native function.
     *
     * **note:** this method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. as a result, we're left
     * with little choice but to throw an error. unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isnative(array.prototype.push);
     * // => true
     *
     * _.isnative(_);
     * // => false
     */
    function isnative(value) {
      if (ismaskable(value)) {
        throw new error(core_error_text);
      }
      return baseisnative(value);
    }

    /**
     * checks if `value` is `null`.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isnull(null);
     * // => true
     *
     * _.isnull(void 0);
     * // => false
     */
    function isnull(value) {
      return value === null;
    }

    /**
     * checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isnil(null);
     * // => true
     *
     * _.isnil(void 0);
     * // => true
     *
     * _.isnil(nan);
     * // => false
     */
    function isnil(value) {
      return value == null;
    }

    /**
     * checks if `value` is classified as a `number` primitive or object.
     *
     * **note:** to exclude `infinity`, `-infinity`, and `nan`, which are
     * classified as numbers, use the `_.isfinite` method.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isnumber(3);
     * // => true
     *
     * _.isnumber(number.min_value);
     * // => true
     *
     * _.isnumber(infinity);
     * // => true
     *
     * _.isnumber('3');
     * // => false
     */
    function isnumber(value) {
      return typeof value == 'number' ||
        (isobjectlike(value) && basegettag(value) == numbertag);
    }

    /**
     * checks if `value` is a plain object, that is, an object created by the
     * `object` constructor or one with a `[[prototype]]` of `null`.
     *
     * @static
     * @memberof _
     * @since 0.8.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function foo() {
     *   this.a = 1;
     * }
     *
     * _.isplainobject(new foo);
     * // => false
     *
     * _.isplainobject([1, 2, 3]);
     * // => false
     *
     * _.isplainobject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isplainobject(object.create(null));
     * // => true
     */
    function isplainobject(value) {
      if (!isobjectlike(value) || basegettag(value) != objecttag) {
        return false;
      }
      var proto = getprototype(value);
      if (proto === null) {
        return true;
      }
      var ctor = hasownproperty.call(proto, 'constructor') && proto.constructor;
      return typeof ctor == 'function' && ctor instanceof ctor &&
        functostring.call(ctor) == objectctorstring;
    }

    /**
     * checks if `value` is classified as a `regexp` object.
     *
     * @static
     * @memberof _
     * @since 0.1.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isregexp(/abc/);
     * // => true
     *
     * _.isregexp('/abc/');
     * // => false
     */
    var isregexp = nodeisregexp ? baseunary(nodeisregexp) : baseisregexp;

    /**
     * checks if `value` is a safe integer. an integer is safe if it's an ieee-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **note:** this method is based on
     * [`number.issafeinteger`](https://mdn.io/number/issafeinteger).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.issafeinteger(3);
     * // => true
     *
     * _.issafeinteger(number.min_value);
     * // => false
     *
     * _.issafeinteger(infinity);
     * // => false
     *
     * _.issafeinteger('3');
     * // => false
     */
    function issafeinteger(value) {
      return isinteger(value) && value >= -max_safe_integer && value <= max_safe_integer;
    }

    /**
     * checks if `value` is classified as a `set` object.
     *
     * @static
     * @memberof _
     * @since 4.3.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isset(new set);
     * // => true
     *
     * _.isset(new weakset);
     * // => false
     */
    var isset = nodeisset ? baseunary(nodeisset) : baseisset;

    /**
     * checks if `value` is classified as a `string` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isstring('abc');
     * // => true
     *
     * _.isstring(1);
     * // => false
     */
    function isstring(value) {
      return typeof value == 'string' ||
        (!isarray(value) && isobjectlike(value) && basegettag(value) == stringtag);
    }

    /**
     * checks if `value` is classified as a `symbol` primitive or object.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.issymbol(symbol.iterator);
     * // => true
     *
     * _.issymbol('abc');
     * // => false
     */
    function issymbol(value) {
      return typeof value == 'symbol' ||
        (isobjectlike(value) && basegettag(value) == symboltag);
    }

    /**
     * checks if `value` is classified as a typed array.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.istypedarray(new uint8array);
     * // => true
     *
     * _.istypedarray([]);
     * // => false
     */
    var istypedarray = nodeistypedarray ? baseunary(nodeistypedarray) : baseistypedarray;

    /**
     * checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isundefined(void 0);
     * // => true
     *
     * _.isundefined(null);
     * // => false
     */
    function isundefined(value) {
      return value === undefined;
    }

    /**
     * checks if `value` is classified as a `weakmap` object.
     *
     * @static
     * @memberof _
     * @since 4.3.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isweakmap(new weakmap);
     * // => true
     *
     * _.isweakmap(new map);
     * // => false
     */
    function isweakmap(value) {
      return isobjectlike(value) && gettag(value) == weakmaptag;
    }

    /**
     * checks if `value` is classified as a `weakset` object.
     *
     * @static
     * @memberof _
     * @since 4.3.0
     * @category lang
     * @param {*} value the value to check.
     * @returns {boolean} returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isweakset(new weakset);
     * // => true
     *
     * _.isweakset(new set);
     * // => false
     */
    function isweakset(value) {
      return isobjectlike(value) && basegettag(value) == weaksettag;
    }

    /**
     * checks if `value` is less than `other`.
     *
     * @static
     * @memberof _
     * @since 3.9.0
     * @category lang
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @returns {boolean} returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createrelationaloperation(baselt);

    /**
     * checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberof _
     * @since 3.9.0
     * @category lang
     * @param {*} value the value to compare.
     * @param {*} other the other value to compare.
     * @returns {boolean} returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createrelationaloperation(function(value, other) {
      return value <= other;
    });

    /**
     * converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category lang
     * @param {*} value the value to convert.
     * @returns {array} returns the converted array.
     * @example
     *
     * _.toarray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toarray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toarray(1);
     * // => []
     *
     * _.toarray(null);
     * // => []
     */
    function toarray(value) {
      if (!value) {
        return [];
      }
      if (isarraylike(value)) {
        return isstring(value) ? stringtoarray(value) : copyarray(value);
      }
      if (symiterator && value[symiterator]) {
        return iteratortoarray(value[symiterator]());
      }
      var tag = gettag(value),
          func = tag == maptag ? maptoarray : (tag == settag ? settoarray : values);

      return func(value);
    }

    /**
     * converts `value` to a finite number.
     *
     * @static
     * @memberof _
     * @since 4.12.0
     * @category lang
     * @param {*} value the value to convert.
     * @returns {number} returns the converted number.
     * @example
     *
     * _.tofinite(3.2);
     * // => 3.2
     *
     * _.tofinite(number.min_value);
     * // => 5e-324
     *
     * _.tofinite(infinity);
     * // => 1.7976931348623157e+308
     *
     * _.tofinite('3.2');
     * // => 3.2
     */
    function tofinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = tonumber(value);
      if (value === infinity || value === -infinity) {
        var sign = (value < 0 ? -1 : 1);
        return sign * max_integer;
      }
      return value === value ? value : 0;
    }

    /**
     * converts `value` to an integer.
     *
     * **note:** this method is loosely based on
     * [`tointeger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to convert.
     * @returns {number} returns the converted integer.
     * @example
     *
     * _.tointeger(3.2);
     * // => 3
     *
     * _.tointeger(number.min_value);
     * // => 0
     *
     * _.tointeger(infinity);
     * // => 1.7976931348623157e+308
     *
     * _.tointeger('3.2');
     * // => 3
     */
    function tointeger(value) {
      var result = tofinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **note:** this method is based on
     * [`tolength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to convert.
     * @returns {number} returns the converted integer.
     * @example
     *
     * _.tolength(3.2);
     * // => 3
     *
     * _.tolength(number.min_value);
     * // => 0
     *
     * _.tolength(infinity);
     * // => 4294967295
     *
     * _.tolength('3.2');
     * // => 3
     */
    function tolength(value) {
      return value ? baseclamp(tointeger(value), 0, max_array_length) : 0;
    }

    /**
     * converts `value` to a number.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to process.
     * @returns {number} returns the number.
     * @example
     *
     * _.tonumber(3.2);
     * // => 3.2
     *
     * _.tonumber(number.min_value);
     * // => 5e-324
     *
     * _.tonumber(infinity);
     * // => infinity
     *
     * _.tonumber('3.2');
     * // => 3.2
     */
    function tonumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (issymbol(value)) {
        return nan;
      }
      if (isobject(value)) {
        var other = typeof value.valueof == 'function' ? value.valueof() : value;
        value = isobject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = basetrim(value);
      var isbinary = reisbinary.test(value);
      return (isbinary || reisoctal.test(value))
        ? freeparseint(value.slice(2), isbinary ? 2 : 8)
        : (reisbadhex.test(value) ? nan : +value);
    }

    /**
     * converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category lang
     * @param {*} value the value to convert.
     * @returns {object} returns the converted plain object.
     * @example
     *
     * function foo() {
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toplainobject(new foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toplainobject(value) {
      return copyobject(value, keysin(value));
    }

    /**
     * converts `value` to a safe integer. a safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to convert.
     * @returns {number} returns the converted integer.
     * @example
     *
     * _.tosafeinteger(3.2);
     * // => 3
     *
     * _.tosafeinteger(number.min_value);
     * // => 0
     *
     * _.tosafeinteger(infinity);
     * // => 9007199254740991
     *
     * _.tosafeinteger('3.2');
     * // => 3
     */
    function tosafeinteger(value) {
      return value
        ? baseclamp(tointeger(value), -max_safe_integer, max_safe_integer)
        : (value === 0 ? value : 0);
    }

    /**
     * converts `value` to a string. an empty string is returned for `null`
     * and `undefined` values. the sign of `-0` is preserved.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category lang
     * @param {*} value the value to convert.
     * @returns {string} returns the converted string.
     * @example
     *
     * _.tostring(null);
     * // => ''
     *
     * _.tostring(-0);
     * // => '-0'
     *
     * _.tostring([1, 2, 3]);
     * // => '1,2,3'
     */
    function tostring(value) {
      return value == null ? '' : basetostring(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * assigns own enumerable string keyed properties of source objects to the
     * destination object. source objects are applied from left to right.
     * subsequent sources overwrite property assignments of previous sources.
     *
     * **note:** this method mutates `object` and is loosely based on
     * [`object.assign`](https://mdn.io/object/assign).
     *
     * @static
     * @memberof _
     * @since 0.10.0
     * @category object
     * @param {object} object the destination object.
     * @param {...object} [sources] the source objects.
     * @returns {object} returns `object`.
     * @see _.assignin
     * @example
     *
     * function foo() {
     *   this.a = 1;
     * }
     *
     * function bar() {
     *   this.c = 3;
     * }
     *
     * foo.prototype.b = 2;
     * bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new foo, new bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createassigner(function(object, source) {
      if (isprototype(source) || isarraylike(source)) {
        copyobject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasownproperty.call(source, key)) {
          assignvalue(object, key, source[key]);
        }
      }
    });

    /**
     * this method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @alias extend
     * @category object
     * @param {object} object the destination object.
     * @param {...object} [sources] the source objects.
     * @returns {object} returns `object`.
     * @see _.assign
     * @example
     *
     * function foo() {
     *   this.a = 1;
     * }
     *
     * function bar() {
     *   this.c = 3;
     * }
     *
     * foo.prototype.b = 2;
     * bar.prototype.d = 4;
     *
     * _.assignin({ 'a': 0 }, new foo, new bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignin = createassigner(function(object, source) {
      copyobject(source, keysin(source), object);
    });

    /**
     * this method is like `_.assignin` except that it accepts `customizer`
     * which is invoked to produce the assigned values. if `customizer` returns
     * `undefined`, assignment is handled by the method instead. the `customizer`
     * is invoked with five arguments: (objvalue, srcvalue, key, object, source).
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @alias extendwith
     * @category object
     * @param {object} object the destination object.
     * @param {...object} sources the source objects.
     * @param {function} [customizer] the function to customize assigned values.
     * @returns {object} returns `object`.
     * @see _.assignwith
     * @example
     *
     * function customizer(objvalue, srcvalue) {
     *   return _.isundefined(objvalue) ? srcvalue : objvalue;
     * }
     *
     * var defaults = _.partialright(_.assigninwith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assigninwith = createassigner(function(object, source, srcindex, customizer) {
      copyobject(source, keysin(source), object, customizer);
    });

    /**
     * this method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. if `customizer` returns
     * `undefined`, assignment is handled by the method instead. the `customizer`
     * is invoked with five arguments: (objvalue, srcvalue, key, object, source).
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category object
     * @param {object} object the destination object.
     * @param {...object} sources the source objects.
     * @param {function} [customizer] the function to customize assigned values.
     * @returns {object} returns `object`.
     * @see _.assigninwith
     * @example
     *
     * function customizer(objvalue, srcvalue) {
     *   return _.isundefined(objvalue) ? srcvalue : objvalue;
     * }
     *
     * var defaults = _.partialright(_.assignwith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignwith = createassigner(function(object, source, srcindex, customizer) {
      copyobject(source, keys(source), object, customizer);
    });

    /**
     * creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberof _
     * @since 1.0.0
     * @category object
     * @param {object} object the object to iterate over.
     * @param {...(string|string[])} [paths] the property paths to pick.
     * @returns {array} returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatrest(baseat);

    /**
     * creates an object that inherits from the `prototype` object. if a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberof _
     * @since 2.3.0
     * @category object
     * @param {object} prototype the object to inherit from.
     * @param {object} [properties] the properties to assign to the object.
     * @returns {object} returns the new object.
     * @example
     *
     * function shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function circle() {
     *   shape.call(this);
     * }
     *
     * circle.prototype = _.create(shape.prototype, {
     *   'constructor': circle
     * });
     *
     * var circle = new circle;
     * circle instanceof circle;
     * // => true
     *
     * circle instanceof shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = basecreate(prototype);
      return properties == null ? result : baseassign(result, properties);
    }

    /**
     * assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. source objects are applied from left to right.
     * once a property is set, additional values of the same property are ignored.
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category object
     * @param {object} object the destination object.
     * @param {...object} [sources] the source objects.
     * @returns {object} returns `object`.
     * @see _.defaultsdeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baserest(function(object, sources) {
      object = object(object);

      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : undefined;

      if (guard && isiterateecall(sources[0], sources[1], guard)) {
        length = 1;
      }

      while (++index < length) {
        var source = sources[index];
        var props = keysin(source);
        var propsindex = -1;
        var propslength = props.length;

        while (++propsindex < propslength) {
          var key = props[propsindex];
          var value = object[key];

          if (value === undefined ||
              (eq(value, objectproto[key]) && !hasownproperty.call(object, key))) {
            object[key] = source[key];
          }
        }
      }

      return object;
    });

    /**
     * this method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 3.10.0
     * @category object
     * @param {object} object the destination object.
     * @param {...object} [sources] the source objects.
     * @returns {object} returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsdeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsdeep = baserest(function(args) {
      args.push(undefined, customdefaultsmerge);
      return apply(mergewith, undefined, args);
    });

    /**
     * this method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberof _
     * @since 1.1.0
     * @category object
     * @param {object} object the object to inspect.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {string|undefined} returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findkey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // the `_.matches` iteratee shorthand.
     * _.findkey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.findkey(users, ['active', false]);
     * // => 'fred'
     *
     * // the `_.property` iteratee shorthand.
     * _.findkey(users, 'active');
     * // => 'barney'
     */
    function findkey(object, predicate) {
      return basefindkey(object, getiteratee(predicate, 3), baseforown);
    }

    /**
     * this method is like `_.findkey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @category object
     * @param {object} object the object to inspect.
     * @param {function} [predicate=_.identity] the function invoked per iteration.
     * @returns {string|undefined} returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findlastkey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findkey` returns 'barney'
     *
     * // the `_.matches` iteratee shorthand.
     * _.findlastkey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.findlastkey(users, ['active', false]);
     * // => 'fred'
     *
     * // the `_.property` iteratee shorthand.
     * _.findlastkey(users, 'active');
     * // => 'pebbles'
     */
    function findlastkey(object, predicate) {
      return basefindkey(object, getiteratee(predicate, 3), baseforownright);
    }

    /**
     * iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. the iteratee is invoked
     * with three arguments: (value, key, object). iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberof _
     * @since 0.3.0
     * @category object
     * @param {object} object the object to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {object} returns `object`.
     * @see _.forinright
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.forin(new foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forin(object, iteratee) {
      return object == null
        ? object
        : basefor(object, getiteratee(iteratee, 3), keysin);
    }

    /**
     * this method is like `_.forin` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @category object
     * @param {object} object the object to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {object} returns `object`.
     * @see _.forin
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.forinright(new foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', then 'a' assuming `_.forin` logs 'a', 'b', then 'c'.
     */
    function forinright(object, iteratee) {
      return object == null
        ? object
        : baseforright(object, getiteratee(iteratee, 3), keysin);
    }

    /**
     * iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. the iteratee is invoked with three
     * arguments: (value, key, object). iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberof _
     * @since 0.3.0
     * @category object
     * @param {object} object the object to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {object} returns `object`.
     * @see _.forownright
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.forown(new foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forown(object, iteratee) {
      return object && baseforown(object, getiteratee(iteratee, 3));
    }

    /**
     * this method is like `_.forown` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberof _
     * @since 2.0.0
     * @category object
     * @param {object} object the object to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {object} returns `object`.
     * @see _.forown
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.forownright(new foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' then 'a' assuming `_.forown` logs 'a' then 'b'.
     */
    function forownright(object, iteratee) {
      return object && baseforownright(object, getiteratee(iteratee, 3));
    }

    /**
     * creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category object
     * @param {object} object the object to inspect.
     * @returns {array} returns the function names.
     * @see _.functionsin
     * @example
     *
     * function foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * foo.prototype.c = _.constant('c');
     *
     * _.functions(new foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : basefunctions(object, keys(object));
    }

    /**
     * creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category object
     * @param {object} object the object to inspect.
     * @returns {array} returns the function names.
     * @see _.functions
     * @example
     *
     * function foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * foo.prototype.c = _.constant('c');
     *
     * _.functionsin(new foo);
     * // => ['a', 'b', 'c']
     */
    function functionsin(object) {
      return object == null ? [] : basefunctions(object, keysin(object));
    }

    /**
     * gets the value at `path` of `object`. if the resolved value is
     * `undefined`, the `defaultvalue` is returned in its place.
     *
     * @static
     * @memberof _
     * @since 3.7.0
     * @category object
     * @param {object} object the object to query.
     * @param {array|string} path the path of the property to get.
     * @param {*} [defaultvalue] the value returned for `undefined` resolved values.
     * @returns {*} returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultvalue) {
      var result = object == null ? undefined : baseget(object, path);
      return result === undefined ? defaultvalue : result;
    }

    /**
     * checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category object
     * @param {object} object the object to query.
     * @param {array|string} path the path to check.
     * @returns {boolean} returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && haspath(object, path, basehas);
    }

    /**
     * checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category object
     * @param {object} object the object to query.
     * @param {array|string} path the path to check.
     * @returns {boolean} returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasin(object, 'a');
     * // => true
     *
     * _.hasin(object, 'a.b');
     * // => true
     *
     * _.hasin(object, ['a', 'b']);
     * // => true
     *
     * _.hasin(object, 'b');
     * // => false
     */
    function hasin(object, path) {
      return object != null && haspath(object, path, basehasin);
    }

    /**
     * creates an object composed of the inverted keys and values of `object`.
     * if `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberof _
     * @since 0.7.0
     * @category object
     * @param {object} object the object to invert.
     * @returns {object} returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createinverter(function(result, value, key) {
      if (value != null &&
          typeof value.tostring != 'function') {
        value = nativeobjecttostring.call(value);
      }

      result[value] = key;
    }, constant(identity));

    /**
     * this method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. the
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. the iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 4.1.0
     * @category object
     * @param {object} object the object to invert.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {object} returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertby(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertby(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertby = createinverter(function(result, value, key) {
      if (value != null &&
          typeof value.tostring != 'function') {
        value = nativeobjecttostring.call(value);
      }

      if (hasownproperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getiteratee);

    /**
     * invokes the method at `path` of `object`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category object
     * @param {object} object the object to query.
     * @param {array|string} path the path of the method to invoke.
     * @param {...*} [args] the arguments to invoke the method with.
     * @returns {*} returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baserest(baseinvoke);

    /**
     * creates an array of the own enumerable property names of `object`.
     *
     * **note:** non-object values are coerced to objects. see the
     * [es spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category object
     * @param {object} object the object to query.
     * @returns {array} returns the array of property names.
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.keys(new foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isarraylike(object) ? arraylikekeys(object) : basekeys(object);
    }

    /**
     * creates an array of the own and inherited enumerable property names of `object`.
     *
     * **note:** non-object values are coerced to objects.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category object
     * @param {object} object the object to query.
     * @returns {array} returns the array of property names.
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.keysin(new foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysin(object) {
      return isarraylike(object) ? arraylikekeys(object, true) : basekeysin(object);
    }

    /**
     * the opposite of `_.mapvalues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. the iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberof _
     * @since 3.8.0
     * @category object
     * @param {object} object the object to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {object} returns the new mapped object.
     * @see _.mapvalues
     * @example
     *
     * _.mapkeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapkeys(object, iteratee) {
      var result = {};
      iteratee = getiteratee(iteratee, 3);

      baseforown(object, function(value, key, object) {
        baseassignvalue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. the iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberof _
     * @since 2.4.0
     * @category object
     * @param {object} object the object to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {object} returns the new mapped object.
     * @see _.mapkeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapvalues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // the `_.property` iteratee shorthand.
     * _.mapvalues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapvalues(object, iteratee) {
      var result = {};
      iteratee = getiteratee(iteratee, 3);

      baseforown(object, function(value, key, object) {
        baseassignvalue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * this method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. source properties that resolve to `undefined` are
     * skipped if a destination value exists. array and plain object properties
     * are merged recursively. other objects and value types are overridden by
     * assignment. source objects are applied from left to right. subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 0.5.0
     * @category object
     * @param {object} object the destination object.
     * @param {...object} [sources] the source objects.
     * @returns {object} returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createassigner(function(object, source, srcindex) {
      basemerge(object, source, srcindex);
    });

    /**
     * this method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. if `customizer` returns `undefined`, merging is handled by the
     * method instead. the `customizer` is invoked with six arguments:
     * (objvalue, srcvalue, key, object, source, stack).
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category object
     * @param {object} object the destination object.
     * @param {...object} sources the source objects.
     * @param {function} customizer the function to customize assigned values.
     * @returns {object} returns `object`.
     * @example
     *
     * function customizer(objvalue, srcvalue) {
     *   if (_.isarray(objvalue)) {
     *     return objvalue.concat(srcvalue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergewith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergewith = createassigner(function(object, source, srcindex, customizer) {
      basemerge(object, source, srcindex, customizer);
    });

    /**
     * the opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **note:** this method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category object
     * @param {object} object the source object.
     * @param {...(string|string[])} [paths] the property paths to omit.
     * @returns {object} returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatrest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isdeep = false;
      paths = arraymap(paths, function(path) {
        path = castpath(path, object);
        isdeep || (isdeep = path.length > 1);
        return path;
      });
      copyobject(object, getallkeysin(object), result);
      if (isdeep) {
        result = baseclone(result, clone_deep_flag | clone_flat_flag | clone_symbols_flag, customomitclone);
      }
      var length = paths.length;
      while (length--) {
        baseunset(result, paths[length]);
      }
      return result;
    });

    /**
     * the opposite of `_.pickby`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. the predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category object
     * @param {object} object the source object.
     * @param {function} [predicate=_.identity] the function invoked per property.
     * @returns {object} returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitby(object, _.isnumber);
     * // => { 'b': '2' }
     */
    function omitby(object, predicate) {
      return pickby(object, negate(getiteratee(predicate)));
    }

    /**
     * creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category object
     * @param {object} object the source object.
     * @param {...(string|string[])} [paths] the property paths to pick.
     * @returns {object} returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatrest(function(object, paths) {
      return object == null ? {} : basepick(object, paths);
    });

    /**
     * creates an object composed of the `object` properties `predicate` returns
     * truthy for. the predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category object
     * @param {object} object the source object.
     * @param {function} [predicate=_.identity] the function invoked per property.
     * @returns {object} returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickby(object, _.isnumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickby(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arraymap(getallkeysin(object), function(prop) {
        return [prop];
      });
      predicate = getiteratee(predicate);
      return basepickby(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * this method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category object
     * @param {object} object the object to query.
     * @param {array|string} path the path of the property to resolve.
     * @param {*} [defaultvalue] the value returned for `undefined` resolved values.
     * @returns {*} returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultvalue) {
      path = castpath(path, object);

      var index = -1,
          length = path.length;

      // ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[tokey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultvalue;
        }
        object = isfunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * sets the value at `path` of `object`. if a portion of `path` doesn't exist,
     * it's created. arrays are created for missing index properties while objects
     * are created for all other missing properties. use `_.setwith` to customize
     * `path` creation.
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 3.7.0
     * @category object
     * @param {object} object the object to modify.
     * @param {array|string} path the path of the property to set.
     * @param {*} value the value to set.
     * @returns {object} returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseset(object, path, value);
    }

    /**
     * this method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  if `customizer` returns `undefined`
     * path creation is handled by the method instead. the `customizer` is invoked
     * with three arguments: (nsvalue, key, nsobject).
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category object
     * @param {object} object the object to modify.
     * @param {array|string} path the path of the property to set.
     * @param {*} value the value to set.
     * @param {function} [customizer] the function to customize assigned values.
     * @returns {object} returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setwith(object, '[0][1]', 'a', object);
     * // => { '0': { '1': 'a' } }
     */
    function setwith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseset(object, path, value, customizer);
    }

    /**
     * creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.frompairs`. if `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @alias entries
     * @category object
     * @param {object} object the object to query.
     * @returns {array} returns the key-value pairs.
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.topairs(new foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var topairs = createtopairs(keys);

    /**
     * creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.frompairs`. if `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @alias entriesin
     * @category object
     * @param {object} object the object to query.
     * @returns {array} returns the key-value pairs.
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.topairsin(new foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var topairsin = createtopairs(keysin);

    /**
     * an alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. if `accumulator` is not
     * provided, a new object with the same `[[prototype]]` will be used. the
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberof _
     * @since 1.3.0
     * @category object
     * @param {object} object the object to iterate over.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @param {*} [accumulator] the custom accumulator value.
     * @returns {*} returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isarr = isarray(object),
          isarrlike = isarr || isbuffer(object) || istypedarray(object);

      iteratee = getiteratee(iteratee, 4);
      if (accumulator == null) {
        var ctor = object && object.constructor;
        if (isarrlike) {
          accumulator = isarr ? new ctor : [];
        }
        else if (isobject(object)) {
          accumulator = isfunction(ctor) ? basecreate(getprototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isarrlike ? arrayeach : baseforown)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * removes the property at `path` of `object`.
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category object
     * @param {object} object the object to modify.
     * @param {array|string} path the path of the property to unset.
     * @returns {boolean} returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseunset(object, path);
    }

    /**
     * this method is like `_.set` except that accepts `updater` to produce the
     * value to set. use `_.updatewith` to customize `path` creation. the `updater`
     * is invoked with one argument: (value).
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 4.6.0
     * @category object
     * @param {object} object the object to modify.
     * @param {array|string} path the path of the property to set.
     * @param {function} updater the function to produce the updated value.
     * @returns {object} returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseupdate(object, path, castfunction(updater));
    }

    /**
     * this method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  if `customizer` returns `undefined`
     * path creation is handled by the method instead. the `customizer` is invoked
     * with three arguments: (nsvalue, key, nsobject).
     *
     * **note:** this method mutates `object`.
     *
     * @static
     * @memberof _
     * @since 4.6.0
     * @category object
     * @param {object} object the object to modify.
     * @param {array|string} path the path of the property to set.
     * @param {function} updater the function to produce the updated value.
     * @param {function} [customizer] the function to customize assigned values.
     * @returns {object} returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updatewith(object, '[0][1]', _.constant('a'), object);
     * // => { '0': { '1': 'a' } }
     */
    function updatewith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseupdate(object, path, castfunction(updater), customizer);
    }

    /**
     * creates an array of the own enumerable string keyed property values of `object`.
     *
     * **note:** non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category object
     * @param {object} object the object to query.
     * @returns {array} returns the array of property values.
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.values(new foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : basevalues(object, keys(object));
    }

    /**
     * creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **note:** non-object values are coerced to objects.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category object
     * @param {object} object the object to query.
     * @returns {array} returns the array of property values.
     * @example
     *
     * function foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * foo.prototype.c = 3;
     *
     * _.valuesin(new foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesin(object) {
      return object == null ? [] : basevalues(object, keysin(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category number
     * @param {number} number the number to clamp.
     * @param {number} [lower] the lower bound.
     * @param {number} upper the upper bound.
     * @returns {number} returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = tonumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = tonumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseclamp(tonumber(number), lower, upper);
    }

    /**
     * checks if `n` is between `start` and up to, but not including, `end`. if
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * if `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberof _
     * @since 3.3.0
     * @category number
     * @param {number} number the number to check.
     * @param {number} [start=0] the start of the range.
     * @param {number} end the end of the range.
     * @returns {boolean} returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeright
     * @example
     *
     * _.inrange(3, 2, 4);
     * // => true
     *
     * _.inrange(4, 8);
     * // => true
     *
     * _.inrange(4, 2);
     * // => false
     *
     * _.inrange(2, 2);
     * // => false
     *
     * _.inrange(1.2, 2);
     * // => true
     *
     * _.inrange(5.2, 4);
     * // => false
     *
     * _.inrange(-3, -2, -6);
     * // => true
     */
    function inrange(number, start, end) {
      start = tofinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = tofinite(end);
      }
      number = tonumber(number);
      return baseinrange(number, start, end);
    }

    /**
     * produces a random number between the inclusive `lower` and `upper` bounds.
     * if only one argument is provided a number between `0` and the given number
     * is returned. if `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **note:** javascript follows the ieee-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberof _
     * @since 0.7.0
     * @category number
     * @param {number} [lower=0] the lower bound.
     * @param {number} [upper=1] the upper bound.
     * @param {boolean} [floating] specify returning a floating-point number.
     * @returns {number} returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isiterateecall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = tofinite(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = tofinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativerandom();
        return nativemin(lower + (rand * (upper - lower + freeparsefloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baserandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * converts `string` to [camel case](https://en.wikipedia.org/wiki/camelcase).
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the camel cased string.
     * @example
     *
     * _.camelcase('foo bar');
     * // => 'foobar'
     *
     * _.camelcase('--foo-bar--');
     * // => 'foobar'
     *
     * _.camelcase('__foo_bar__');
     * // => 'foobar'
     */
    var camelcase = createcompounder(function(result, word, index) {
      word = word.tolowercase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to capitalize.
     * @returns {string} returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'fred'
     */
    function capitalize(string) {
      return upperfirst(tostring(string).tolowercase());
    }

    /**
     * deburrs `string` by converting
     * [latin-1 supplement](https://en.wikipedia.org/wiki/latin-1_supplement_(unicode_block)#character_table)
     * and [latin extended-a](https://en.wikipedia.org/wiki/latin_extended-a)
     * letters to basic latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/combining_diacritical_marks).
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to deburr.
     * @returns {string} returns the deburred string.
     * @example
     *
     * _.deburr('dã©jã  vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = tostring(string);
      return string && string.replace(relatin, deburrletter).replace(recombomark, '');
    }

    /**
     * checks if `string` ends with the given target string.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to inspect.
     * @param {string} [target] the string to search for.
     * @param {number} [position=string.length] the position to search up to.
     * @returns {boolean} returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endswith('abc', 'c');
     * // => true
     *
     * _.endswith('abc', 'b');
     * // => false
     *
     * _.endswith('abc', 'b', 2);
     * // => true
     */
    function endswith(string, target, position) {
      string = tostring(string);
      target = basetostring(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseclamp(tointeger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding html entities.
     *
     * **note:** no other characters are escaped. to escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in html and have no special meaning
     * unless they're part of a tag or unquoted attribute value. see
     * [mathias bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * when working with html you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * xss vectors.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category string
     * @param {string} [string=''] the string to escape.
     * @returns {string} returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = tostring(string);
      return (string && rehasunescapedhtml.test(string))
        ? string.replace(reunescapedhtml, escapehtmlchar)
        : string;
    }

    /**
     * escapes the `regexp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to escape.
     * @returns {string} returns the escaped string.
     * @example
     *
     * _.escaperegexp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escaperegexp(string) {
      string = tostring(string);
      return (string && rehasregexpchar.test(string))
        ? string.replace(reregexpchar, '\\$&')
        : string;
    }

    /**
     * converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/letter_case#special_case_styles).
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the kebab cased string.
     * @example
     *
     * _.kebabcase('foo bar');
     * // => 'foo-bar'
     *
     * _.kebabcase('foobar');
     * // => 'foo-bar'
     *
     * _.kebabcase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabcase = createcompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.tolowercase();
    });

    /**
     * converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the lower cased string.
     * @example
     *
     * _.lowercase('--foo-bar--');
     * // => 'foo bar'
     *
     * _.lowercase('foobar');
     * // => 'foo bar'
     *
     * _.lowercase('__foo_bar__');
     * // => 'foo bar'
     */
    var lowercase = createcompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.tolowercase();
    });

    /**
     * converts the first character of `string` to lower case.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the converted string.
     * @example
     *
     * _.lowerfirst('fred');
     * // => 'fred'
     *
     * _.lowerfirst('fred');
     * // => 'fred'
     */
    var lowerfirst = createcasefirst('tolowercase');

    /**
     * pads `string` on the left and right sides if it's shorter than `length`.
     * padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to pad.
     * @param {number} [length=0] the padding length.
     * @param {string} [chars=' '] the string used as padding.
     * @returns {string} returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = tostring(string);
      length = tointeger(length);

      var strlength = length ? stringsize(string) : 0;
      if (!length || strlength >= length) {
        return string;
      }
      var mid = (length - strlength) / 2;
      return (
        createpadding(nativefloor(mid), chars) +
        string +
        createpadding(nativeceil(mid), chars)
      );
    }

    /**
     * pads `string` on the right side if it's shorter than `length`. padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to pad.
     * @param {number} [length=0] the padding length.
     * @param {string} [chars=' '] the string used as padding.
     * @returns {string} returns the padded string.
     * @example
     *
     * _.padend('abc', 6);
     * // => 'abc   '
     *
     * _.padend('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padend('abc', 3);
     * // => 'abc'
     */
    function padend(string, length, chars) {
      string = tostring(string);
      length = tointeger(length);

      var strlength = length ? stringsize(string) : 0;
      return (length && strlength < length)
        ? (string + createpadding(length - strlength, chars))
        : string;
    }

    /**
     * pads `string` on the left side if it's shorter than `length`. padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to pad.
     * @param {number} [length=0] the padding length.
     * @param {string} [chars=' '] the string used as padding.
     * @returns {string} returns the padded string.
     * @example
     *
     * _.padstart('abc', 6);
     * // => '   abc'
     *
     * _.padstart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padstart('abc', 3);
     * // => 'abc'
     */
    function padstart(string, length, chars) {
      string = tostring(string);
      length = tointeger(length);

      var strlength = length ? stringsize(string) : 0;
      return (length && strlength < length)
        ? (createpadding(length - strlength, chars) + string)
        : string;
    }

    /**
     * converts `string` to an integer of the specified radix. if `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **note:** this method aligns with the
     * [es5 implementation](https://es5.github.io/#x15.1.2.2) of `parseint`.
     *
     * @static
     * @memberof _
     * @since 1.1.0
     * @category string
     * @param {string} string the string to convert.
     * @param {number} [radix=10] the radix to interpret `value` by.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {number} returns the converted integer.
     * @example
     *
     * _.parseint('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseint);
     * // => [6, 8, 10]
     */
    function parseint(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeparseint(tostring(string).replace(retrimstart, ''), radix || 0);
    }

    /**
     * repeats the given string `n` times.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to repeat.
     * @param {number} [n=1] the number of times to repeat the string.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {string} returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isiterateecall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = tointeger(n);
      }
      return baserepeat(tostring(string), n);
    }

    /**
     * replaces matches for `pattern` in `string` with `replacement`.
     *
     * **note:** this method is based on
     * [`string#replace`](https://mdn.io/string/replace).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to modify.
     * @param {regexp|string} pattern the pattern to replace.
     * @param {function|string} replacement the match replacement.
     * @returns {string} returns the modified string.
     * @example
     *
     * _.replace('hi fred', 'fred', 'barney');
     * // => 'hi barney'
     */
    function replace() {
      var args = arguments,
          string = tostring(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/snake_case).
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the snake cased string.
     * @example
     *
     * _.snakecase('foo bar');
     * // => 'foo_bar'
     *
     * _.snakecase('foobar');
     * // => 'foo_bar'
     *
     * _.snakecase('--foo-bar--');
     * // => 'foo_bar'
     */
    var snakecase = createcompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.tolowercase();
    });

    /**
     * splits `string` by `separator`.
     *
     * **note:** this method is based on
     * [`string#split`](https://mdn.io/string/split).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to split.
     * @param {regexp|string} separator the separator pattern to split by.
     * @param {number} [limit] the length to truncate results to.
     * @returns {array} returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isiterateecall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? max_array_length : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = tostring(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isregexp(separator))
          )) {
        separator = basetostring(separator);
        if (!separator && hasunicode(string)) {
          return castslice(stringtoarray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * converts `string` to
     * [start case](https://en.wikipedia.org/wiki/letter_case#stylistic_or_specialised_usage).
     *
     * @static
     * @memberof _
     * @since 3.1.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the start cased string.
     * @example
     *
     * _.startcase('--foo-bar--');
     * // => 'foo bar'
     *
     * _.startcase('foobar');
     * // => 'foo bar'
     *
     * _.startcase('__foo_bar__');
     * // => 'foo bar'
     */
    var startcase = createcompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperfirst(word);
    });

    /**
     * checks if `string` starts with the given target string.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to inspect.
     * @param {string} [target] the string to search for.
     * @param {number} [position=0] the position to search from.
     * @returns {boolean} returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startswith('abc', 'a');
     * // => true
     *
     * _.startswith('abc', 'b');
     * // => false
     *
     * _.startswith('abc', 'b', 1);
     * // => true
     */
    function startswith(string, target, position) {
      string = tostring(string);
      position = position == null
        ? 0
        : baseclamp(tointeger(position), 0, string.length);

      target = basetostring(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, html-escape interpolated data properties in
     * "escape" delimiters, and execute javascript in "evaluate" delimiters. data
     * properties may be accessed as free variables in the template. if a setting
     * object is given, it takes precedence over `_.templatesettings` values.
     *
     * **note:** in the development build `_.template` utilizes
     * [sourceurls](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * for more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * for more information on chrome extension sandboxes see
     * [chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingeval).
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category string
     * @param {string} [string=''] the template string.
     * @param {object} [options={}] the options object.
     * @param {regexp} [options.escape=_.templatesettings.escape]
     *  the html "escape" delimiter.
     * @param {regexp} [options.evaluate=_.templatesettings.evaluate]
     *  the "evaluate" delimiter.
     * @param {object} [options.imports=_.templatesettings.imports]
     *  an object to import into the template as free variables.
     * @param {regexp} [options.interpolate=_.templatesettings.interpolate]
     *  the "interpolate" delimiter.
     * @param {string} [options.sourceurl='lodash.templatesources[n]']
     *  the sourceurl of the compiled template.
     * @param {string} [options.variable='obj']
     *  the data object variable name.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {function} returns the compiled template function.
     * @example
     *
     * // use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // use the html "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // use the "evaluate" delimiter to execute javascript and generate html.
     * var compiled = _.template('<% _.foreach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // use the es template literal delimiter as an "interpolate" delimiter.
     * // disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // use the `imports` option to import `jquery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jquery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // use the `sourceurl` option to specify a custom sourceurl for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceurl': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the sources tab or resources panel of the web inspector.
     *
     * // use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // use custom template delimiters.
     * _.templatesettings.interpolate = /{{([\s\s]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writefilesync(path.join(process.cwd(), 'jst.js'), '\
     *   var jst = {\
     *     "main": ' + _.template(maintext).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // based on john resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and laura doktorova's dot.js (https://github.com/olado/dot).
      var settings = lodash.templatesettings;

      if (guard && isiterateecall(string, options, guard)) {
        options = undefined;
      }
      string = tostring(string);
      options = assigninwith({}, options, settings, customdefaultsassignin);

      var imports = assigninwith({}, options.imports, settings.imports, customdefaultsassignin),
          importskeys = keys(imports),
          importsvalues = basevalues(imports, importskeys);

      var isescaping,
          isevaluating,
          index = 0,
          interpolate = options.interpolate || renomatch,
          source = "__p += '";

      // compile the regexp to match each delimiter.
      var redelimiters = regexp(
        (options.escape || renomatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reinterpolate ? reestemplate : renomatch).source + '|' +
        (options.evaluate || renomatch).source + '|$'
      , 'g');

      // use a sourceurl for easier debugging.
      // the sourceurl gets injected into the source that's eval-ed, so be careful
      // to normalize all kinds of whitespace, so e.g. newlines (and unicode versions of it) can't sneak in
      // and escape the comment, thus injecting code that gets evaled.
      var sourceurl = '//# sourceurl=' +
        (hasownproperty.call(options, 'sourceurl')
          ? (options.sourceurl + '').replace(/\s/g, ' ')
          : ('lodash.templatesources[' + (++templatecounter) + ']')
        ) + '\n';

      string.replace(redelimiters, function(match, escapevalue, interpolatevalue, estemplatevalue, evaluatevalue, offset) {
        interpolatevalue || (interpolatevalue = estemplatevalue);

        // escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reunescapedstring, escapestringchar);

        // replace delimiters with snippets.
        if (escapevalue) {
          isescaping = true;
          source += "' +\n__e(" + escapevalue + ") +\n'";
        }
        if (evaluatevalue) {
          isevaluating = true;
          source += "';\n" + evaluatevalue + ";\n__p += '";
        }
        if (interpolatevalue) {
          source += "' +\n((__t = (" + interpolatevalue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the js engine embedded in adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // if `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = hasownproperty.call(options, 'variable') && options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // throw an error if a forbidden character was found in `variable`, to prevent
      // potential command injection attacks.
      else if (reforbiddenidentifierchars.test(variable)) {
        throw new error(invalid_templ_var_error_text);
      }

      // cleanup code by stripping empty strings.
      source = (isevaluating ? source.replace(reemptystringleading, '') : source)
        .replace(reemptystringmiddle, '$1')
        .replace(reemptystringtrailing, '$1;');

      // frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isescaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isevaluating
          ? ', __j = array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return function(importskeys, sourceurl + 'return ' + source)
          .apply(undefined, importsvalues);
      });

      // provide the compiled function's source by its `tostring` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (iserror(result)) {
        throw result;
      }
      return result;
    }

    /**
     * converts `string`, as a whole, to lower case just like
     * [string#tolowercase](https://mdn.io/tolowercase).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the lower cased string.
     * @example
     *
     * _.tolower('--foo-bar--');
     * // => '--foo-bar--'
     *
     * _.tolower('foobar');
     * // => 'foobar'
     *
     * _.tolower('__foo_bar__');
     * // => '__foo_bar__'
     */
    function tolower(value) {
      return tostring(value).tolowercase();
    }

    /**
     * converts `string`, as a whole, to upper case just like
     * [string#touppercase](https://mdn.io/touppercase).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the upper cased string.
     * @example
     *
     * _.toupper('--foo-bar--');
     * // => '--foo-bar--'
     *
     * _.toupper('foobar');
     * // => 'foobar'
     *
     * _.toupper('__foo_bar__');
     * // => '__foo_bar__'
     */
    function toupper(value) {
      return tostring(value).touppercase();
    }

    /**
     * removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to trim.
     * @param {string} [chars=whitespace] the characters to trim.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {string} returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = tostring(string);
      if (string && (guard || chars === undefined)) {
        return basetrim(string);
      }
      if (!string || !(chars = basetostring(chars))) {
        return string;
      }
      var strsymbols = stringtoarray(string),
          chrsymbols = stringtoarray(chars),
          start = charsstartindex(strsymbols, chrsymbols),
          end = charsendindex(strsymbols, chrsymbols) + 1;

      return castslice(strsymbols, start, end).join('');
    }

    /**
     * removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to trim.
     * @param {string} [chars=whitespace] the characters to trim.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {string} returns the trimmed string.
     * @example
     *
     * _.trimend('  abc  ');
     * // => '  abc'
     *
     * _.trimend('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimend(string, chars, guard) {
      string = tostring(string);
      if (string && (guard || chars === undefined)) {
        return string.slice(0, trimmedendindex(string) + 1);
      }
      if (!string || !(chars = basetostring(chars))) {
        return string;
      }
      var strsymbols = stringtoarray(string),
          end = charsendindex(strsymbols, stringtoarray(chars)) + 1;

      return castslice(strsymbols, 0, end).join('');
    }

    /**
     * removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to trim.
     * @param {string} [chars=whitespace] the characters to trim.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {string} returns the trimmed string.
     * @example
     *
     * _.trimstart('  abc  ');
     * // => 'abc  '
     *
     * _.trimstart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimstart(string, chars, guard) {
      string = tostring(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(retrimstart, '');
      }
      if (!string || !(chars = basetostring(chars))) {
        return string;
      }
      var strsymbols = stringtoarray(string),
          start = charsstartindex(strsymbols, stringtoarray(chars));

      return castslice(strsymbols, start).join('');
    }

    /**
     * truncates `string` if it's longer than the given maximum string length.
     * the last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to truncate.
     * @param {object} [options={}] the options object.
     * @param {number} [options.length=30] the maximum string length.
     * @param {string} [options.omission='...'] the string to indicate text is omitted.
     * @param {regexp|string} [options.separator] the separator pattern to truncate to.
     * @returns {string} returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = default_trunc_length,
          omission = default_trunc_omission;

      if (isobject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? tointeger(options.length) : length;
        omission = 'omission' in options ? basetostring(options.omission) : omission;
      }
      string = tostring(string);

      var strlength = string.length;
      if (hasunicode(string)) {
        var strsymbols = stringtoarray(string);
        strlength = strsymbols.length;
      }
      if (length >= strlength) {
        return string;
      }
      var end = length - stringsize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strsymbols
        ? castslice(strsymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strsymbols) {
        end += (result.length - end);
      }
      if (isregexp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = regexp(separator.source, tostring(reflags.exec(separator)) + 'g');
          }
          separator.lastindex = 0;
          while ((match = separator.exec(substring))) {
            var newend = match.index;
          }
          result = result.slice(0, newend === undefined ? end : newend);
        }
      } else if (string.indexof(basetostring(separator), end) != end) {
        var index = result.lastindexof(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * the inverse of `_.escape`; this method converts the html entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **note:** no other html entities are unescaped. to unescape additional
     * html entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberof _
     * @since 0.6.0
     * @category string
     * @param {string} [string=''] the string to unescape.
     * @returns {string} returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = tostring(string);
      return (string && rehasescapedhtml.test(string))
        ? string.replace(reescapedhtml, unescapehtmlchar)
        : string;
    }

    /**
     * converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the upper cased string.
     * @example
     *
     * _.uppercase('--foo-bar');
     * // => 'foo bar'
     *
     * _.uppercase('foobar');
     * // => 'foo bar'
     *
     * _.uppercase('__foo_bar__');
     * // => 'foo bar'
     */
    var uppercase = createcompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.touppercase();
    });

    /**
     * converts the first character of `string` to upper case.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category string
     * @param {string} [string=''] the string to convert.
     * @returns {string} returns the converted string.
     * @example
     *
     * _.upperfirst('fred');
     * // => 'fred'
     *
     * _.upperfirst('fred');
     * // => 'fred'
     */
    var upperfirst = createcasefirst('touppercase');

    /**
     * splits `string` into an array of its words.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category string
     * @param {string} [string=''] the string to inspect.
     * @param {regexp|string} [pattern] the pattern to match words.
     * @param- {object} [guard] enables use as an iteratee for methods like `_.map`.
     * @returns {array} returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = tostring(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return hasunicodeword(string) ? unicodewords(string) : asciiwords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * attempts to invoke `func`, returning either the result or the caught error
     * object. any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category util
     * @param {function} func the function to attempt.
     * @param {...*} [args] the arguments to invoke `func` with.
     * @returns {*} returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.queryselectorall(selector);
     * }, '>_>');
     *
     * if (_.iserror(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baserest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return iserror(e) ? e : new error(e);
      }
    });

    /**
     * binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **note:** this method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category util
     * @param {object} object the object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodnames the object method names to bind.
     * @returns {object} returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindall(view, ['click']);
     * jquery(element).on('click', view.click);
     * // => logs 'clicked docs' when clicked.
     */
    var bindall = flatrest(function(object, methodnames) {
      arrayeach(methodnames, function(key) {
        key = tokey(key);
        baseassignvalue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. the predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category util
     * @param {array} pairs the predicate-function pairs.
     * @returns {function} returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches a')],
     *   [_.conforms({ 'b': _.isnumber }), _.constant('matches b')],
     *   [_.stubtrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches a'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches b'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toiteratee = getiteratee();

      pairs = !length ? [] : arraymap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new typeerror(func_error_text);
        }
        return [toiteratee(pair[0]), pair[1]];
      });

      return baserest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **note:** the created function is equivalent to `_.conformsto` with
     * `source` partially applied.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category util
     * @param {object} source the object of property predicates to conform to.
     * @returns {function} returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseconforms(baseclone(source, clone_deep_flag));
    }

    /**
     * creates a function that returns `value`.
     *
     * @static
     * @memberof _
     * @since 2.4.0
     * @category util
     * @param {*} value the value to return from the new function.
     * @returns {function} returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * checks `value` to determine whether a default value should be returned in
     * its place. the `defaultvalue` is returned if `value` is `nan`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberof _
     * @since 4.14.0
     * @category util
     * @param {*} value the value to check.
     * @param {*} defaultvalue the default value.
     * @returns {*} returns the resolved value.
     * @example
     *
     * _.defaultto(1, 10);
     * // => 1
     *
     * _.defaultto(undefined, 10);
     * // => 10
     */
    function defaultto(value, defaultvalue) {
      return (value == null || value !== value) ? defaultvalue : value;
    }

    /**
     * creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category util
     * @param {...(function|function[])} [funcs] the functions to invoke.
     * @returns {function} returns the new composite function.
     * @see _.flowright
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addsquare = _.flow([_.add, square]);
     * addsquare(1, 2);
     * // => 9
     */
    var flow = createflow();

    /**
     * this method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberof _
     * @category util
     * @param {...(function|function[])} [funcs] the functions to invoke.
     * @returns {function} returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addsquare = _.flowright([square, _.add]);
     * addsquare(1, 2);
     * // => 9
     */
    var flowright = createflow(true);

    /**
     * this method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category util
     * @param {*} value any value.
     * @returns {*} returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * creates a function that invokes `func` with the arguments of the created
     * function. if `func` is a property name, the created function returns the
     * property value for a given element. if `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberof _
     * @category util
     * @param {*} [func=_.identity] the value to convert to a callback.
     * @returns {function} returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // the `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // the `_.matchesproperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // the `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isregexp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseiteratee(typeof func == 'function' ? func : baseclone(func, clone_deep_flag));
    }

    /**
     * creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **note:** the created function is equivalent to `_.ismatch` with `source`
     * partially applied.
     *
     * partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. see `_.isequal`
     * for a list of supported value comparisons.
     *
     * **note:** multiple values can be checked by combining several matchers
     * using `_.oversome`
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category util
     * @param {object} source the object of property values to match.
     * @returns {function} returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     *
     * // checking for several possible values
     * _.filter(objects, _.oversome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return basematches(baseclone(source, clone_deep_flag));
    }

    /**
     * creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcvalue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **note:** partial comparisons will match empty array and empty object
     * `srcvalue` values against any array or object value, respectively. see
     * `_.isequal` for a list of supported value comparisons.
     *
     * **note:** multiple values can be checked by combining several matchers
     * using `_.oversome`
     *
     * @static
     * @memberof _
     * @since 3.2.0
     * @category util
     * @param {array|string} path the path of the property to get.
     * @param {*} srcvalue the value to match.
     * @returns {function} returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesproperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     *
     * // checking for several possible values
     * _.filter(objects, _.oversome([_.matchesproperty('a', 1), _.matchesproperty('a', 4)]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matchesproperty(path, srcvalue) {
      return basematchesproperty(path, baseclone(srcvalue, clone_deep_flag));
    }

    /**
     * creates a function that invokes the method at `path` of a given object.
     * any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberof _
     * @since 3.7.0
     * @category util
     * @param {array|string} path the path of the method to invoke.
     * @param {...*} [args] the arguments to invoke the method with.
     * @returns {function} returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baserest(function(path, args) {
      return function(object) {
        return baseinvoke(object, path, args);
      };
    });

    /**
     * the opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberof _
     * @since 3.7.0
     * @category util
     * @param {object} object the object to query.
     * @param {...*} [args] the arguments to invoke the method with.
     * @returns {function} returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodof(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodof(object));
     * // => [2, 0]
     */
    var methodof = baserest(function(object, args) {
      return function(path) {
        return baseinvoke(object, path, args);
      };
    });

    /**
     * adds all own enumerable string keyed function properties of a source
     * object to the destination object. if `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **note:** use `_.runincontext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category util
     * @param {function|object} [object=lodash] the destination object.
     * @param {object} source the object of functions to add.
     * @param {object} [options={}] the options object.
     * @param {boolean} [options.chain=true] specify whether mixins are chainable.
     * @returns {function|object} returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodnames = basefunctions(source, props);

      if (options == null &&
          !(isobject(source) && (methodnames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodnames = basefunctions(source, keys(source));
      }
      var chain = !(isobject(options) && 'chain' in options) || !!options.chain,
          isfunc = isfunction(object);

      arrayeach(methodnames, function(methodname) {
        var func = source[methodname];
        object[methodname] = func;
        if (isfunc) {
          object.prototype[methodname] = function() {
            var chainall = this.__chain__;
            if (chain || chainall) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyarray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisarg': object });
              result.__chain__ = chainall;
              return result;
            }
            return func.apply(object, arraypush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category util
     * @returns {function} returns the `lodash` function.
     * @example
     *
     * var lodash = _.noconflict();
     */
    function noconflict() {
      if (root._ === this) {
        root._ = olddash;
      }
      return this;
    }

    /**
     * this method returns `undefined`.
     *
     * @static
     * @memberof _
     * @since 2.3.0
     * @category util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // no operation performed.
    }

    /**
     * creates a function that gets the argument at index `n`. if `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category util
     * @param {number} [n=0] the index of the argument to return.
     * @returns {function} returns the new pass-thru function.
     * @example
     *
     * var func = _.ntharg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.ntharg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function ntharg(n) {
      n = tointeger(n);
      return baserest(function(args) {
        return basenth(args, n);
      });
    }

    /**
     * creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category util
     * @param {...(function|function[])} [iteratees=[_.identity]]
     *  the iteratees to invoke.
     * @returns {function} returns the new function.
     * @example
     *
     * var func = _.over([math.max, math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createover(arraymap);

    /**
     * creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * following shorthands are possible for providing predicates.
     * pass an `object` and it will be used as an parameter for `_.matches` to create the predicate.
     * pass an `array` of parameters for `_.matchesproperty` and the predicate will be created using them.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category util
     * @param {...(function|function[])} [predicates=[_.identity]]
     *  the predicates to check.
     * @returns {function} returns the new function.
     * @example
     *
     * var func = _.overevery([boolean, isfinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(nan);
     * // => false
     */
    var overevery = createover(arrayevery);

    /**
     * creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * following shorthands are possible for providing predicates.
     * pass an `object` and it will be used as an parameter for `_.matches` to create the predicate.
     * pass an `array` of parameters for `_.matchesproperty` and the predicate will be created using them.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category util
     * @param {...(function|function[])} [predicates=[_.identity]]
     *  the predicates to check.
     * @returns {function} returns the new function.
     * @example
     *
     * var func = _.oversome([boolean, isfinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(nan);
     * // => false
     *
     * var matchesfunc = _.oversome([{ 'a': 1 }, { 'a': 2 }])
     * var matchespropertyfunc = _.oversome([['a', 1], ['a', 2]])
     */
    var oversome = createover(arraysome);

    /**
     * creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberof _
     * @since 2.4.0
     * @category util
     * @param {array|string} path the path of the property to get.
     * @returns {function} returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortby(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return iskey(path) ? baseproperty(tokey(path)) : basepropertydeep(path);
    }

    /**
     * the opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberof _
     * @since 3.0.0
     * @category util
     * @param {object} object the object to query.
     * @returns {function} returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyof(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyof(object));
     * // => [2, 0]
     */
    function propertyof(object) {
      return function(path) {
        return object == null ? undefined : baseget(object, path);
      };
    }

    /**
     * creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. a step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. if `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **note:** javascript follows the ieee-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category util
     * @param {number} [start=0] the start of the range.
     * @param {number} end the end of the range.
     * @param {number} [step=1] the value to increment or decrement by.
     * @returns {array} returns the range of numbers.
     * @see _.inrange, _.rangeright
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createrange();

    /**
     * this method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category util
     * @param {number} [start=0] the start of the range.
     * @param {number} end the end of the range.
     * @param {number} [step=1] the value to increment or decrement by.
     * @returns {array} returns the range of numbers.
     * @see _.inrange, _.range
     * @example
     *
     * _.rangeright(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeright(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeright(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeright(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeright(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeright(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeright(0);
     * // => []
     */
    var rangeright = createrange(true);

    /**
     * this method returns a new empty array.
     *
     * @static
     * @memberof _
     * @since 4.13.0
     * @category util
     * @returns {array} returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubarray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubarray() {
      return [];
    }

    /**
     * this method returns `false`.
     *
     * @static
     * @memberof _
     * @since 4.13.0
     * @category util
     * @returns {boolean} returns `false`.
     * @example
     *
     * _.times(2, _.stubfalse);
     * // => [false, false]
     */
    function stubfalse() {
      return false;
    }

    /**
     * this method returns a new empty object.
     *
     * @static
     * @memberof _
     * @since 4.13.0
     * @category util
     * @returns {object} returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubobject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubobject() {
      return {};
    }

    /**
     * this method returns an empty string.
     *
     * @static
     * @memberof _
     * @since 4.13.0
     * @category util
     * @returns {string} returns the empty string.
     * @example
     *
     * _.times(2, _.stubstring);
     * // => ['', '']
     */
    function stubstring() {
      return '';
    }

    /**
     * this method returns `true`.
     *
     * @static
     * @memberof _
     * @since 4.13.0
     * @category util
     * @returns {boolean} returns `true`.
     * @example
     *
     * _.times(2, _.stubtrue);
     * // => [true, true]
     */
    function stubtrue() {
      return true;
    }

    /**
     * invokes the iteratee `n` times, returning an array of the results of
     * each invocation. the iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category util
     * @param {number} n the number of times to invoke `iteratee`.
     * @param {function} [iteratee=_.identity] the function invoked per iteration.
     * @returns {array} returns the array of results.
     * @example
     *
     * _.times(3, string);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = tointeger(n);
      if (n < 1 || n > max_safe_integer) {
        return [];
      }
      var index = max_array_length,
          length = nativemin(n, max_array_length);

      iteratee = getiteratee(iteratee);
      n -= max_array_length;

      var result = basetimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * converts `value` to a property path array.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category util
     * @param {*} value the value to convert.
     * @returns {array} returns the new property path array.
     * @example
     *
     * _.topath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.topath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function topath(value) {
      if (isarray(value)) {
        return arraymap(value, tokey);
      }
      return issymbol(value) ? [value] : copyarray(stringtopath(tostring(value)));
    }

    /**
     * generates a unique id. if `prefix` is given, the id is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category util
     * @param {string} [prefix=''] the value to prefix the id with.
     * @returns {string} returns the unique id.
     * @example
     *
     * _.uniqueid('contact_');
     * // => 'contact_104'
     *
     * _.uniqueid();
     * // => '105'
     */
    function uniqueid(prefix) {
      var id = ++idcounter;
      return tostring(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * adds two numbers.
     *
     * @static
     * @memberof _
     * @since 3.4.0
     * @category math
     * @param {number} augend the first number in an addition.
     * @param {number} addend the second number in an addition.
     * @returns {number} returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createmathoperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * computes `number` rounded up to `precision`.
     *
     * @static
     * @memberof _
     * @since 3.10.0
     * @category math
     * @param {number} number the number to round up.
     * @param {number} [precision=0] the precision to round up to.
     * @returns {number} returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createround('ceil');

    /**
     * divide two numbers.
     *
     * @static
     * @memberof _
     * @since 4.7.0
     * @category math
     * @param {number} dividend the first number in a division.
     * @param {number} divisor the second number in a division.
     * @returns {number} returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createmathoperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * computes `number` rounded down to `precision`.
     *
     * @static
     * @memberof _
     * @since 3.10.0
     * @category math
     * @param {number} number the number to round down.
     * @param {number} [precision=0] the precision to round down to.
     * @returns {number} returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createround('floor');

    /**
     * computes the maximum value of `array`. if `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category math
     * @param {array} array the array to iterate over.
     * @returns {*} returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseextremum(array, identity, basegt)
        : undefined;
    }

    /**
     * this method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. the iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category math
     * @param {array} array the array to iterate over.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {*} returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxby(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // the `_.property` iteratee shorthand.
     * _.maxby(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxby(array, iteratee) {
      return (array && array.length)
        ? baseextremum(array, getiteratee(iteratee, 2), basegt)
        : undefined;
    }

    /**
     * computes the mean of the values in `array`.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category math
     * @param {array} array the array to iterate over.
     * @returns {number} returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return basemean(array, identity);
    }

    /**
     * this method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * the iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 4.7.0
     * @category math
     * @param {array} array the array to iterate over.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {number} returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanby(objects, function(o) { return o.n; });
     * // => 5
     *
     * // the `_.property` iteratee shorthand.
     * _.meanby(objects, 'n');
     * // => 5
     */
    function meanby(array, iteratee) {
      return basemean(array, getiteratee(iteratee, 2));
    }

    /**
     * computes the minimum value of `array`. if `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberof _
     * @category math
     * @param {array} array the array to iterate over.
     * @returns {*} returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseextremum(array, identity, baselt)
        : undefined;
    }

    /**
     * this method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. the iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category math
     * @param {array} array the array to iterate over.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {*} returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minby(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // the `_.property` iteratee shorthand.
     * _.minby(objects, 'n');
     * // => { 'n': 1 }
     */
    function minby(array, iteratee) {
      return (array && array.length)
        ? baseextremum(array, getiteratee(iteratee, 2), baselt)
        : undefined;
    }

    /**
     * multiply two numbers.
     *
     * @static
     * @memberof _
     * @since 4.7.0
     * @category math
     * @param {number} multiplier the first number in a multiplication.
     * @param {number} multiplicand the second number in a multiplication.
     * @returns {number} returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createmathoperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * computes `number` rounded to `precision`.
     *
     * @static
     * @memberof _
     * @since 3.10.0
     * @category math
     * @param {number} number the number to round.
     * @param {number} [precision=0] the precision to round to.
     * @returns {number} returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createround('round');

    /**
     * subtract two numbers.
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category math
     * @param {number} minuend the first number in a subtraction.
     * @param {number} subtrahend the second number in a subtraction.
     * @returns {number} returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createmathoperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * computes the sum of the values in `array`.
     *
     * @static
     * @memberof _
     * @since 3.4.0
     * @category math
     * @param {array} array the array to iterate over.
     * @returns {number} returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? basesum(array, identity)
        : 0;
    }

    /**
     * this method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * the iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberof _
     * @since 4.0.0
     * @category math
     * @param {array} array the array to iterate over.
     * @param {function} [iteratee=_.identity] the iteratee invoked per element.
     * @returns {number} returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumby(objects, function(o) { return o.n; });
     * // => 20
     *
     * // the `_.property` iteratee shorthand.
     * _.sumby(objects, 'n');
     * // => 20
     */
    function sumby(array, iteratee) {
      return (array && array.length)
        ? basesum(array, getiteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignin = assignin;
    lodash.assigninwith = assigninwith;
    lodash.assignwith = assignwith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindall = bindall;
    lodash.bindkey = bindkey;
    lodash.castarray = castarray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countby = countby;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryright = curryright;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsdeep = defaultsdeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceby = differenceby;
    lodash.differencewith = differencewith;
    lodash.drop = drop;
    lodash.dropright = dropright;
    lodash.droprightwhile = droprightwhile;
    lodash.dropwhile = dropwhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatmap = flatmap;
    lodash.flatmapdeep = flatmapdeep;
    lodash.flatmapdepth = flatmapdepth;
    lodash.flatten = flatten;
    lodash.flattendeep = flattendeep;
    lodash.flattendepth = flattendepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowright = flowright;
    lodash.frompairs = frompairs;
    lodash.functions = functions;
    lodash.functionsin = functionsin;
    lodash.groupby = groupby;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionby = intersectionby;
    lodash.intersectionwith = intersectionwith;
    lodash.invert = invert;
    lodash.invertby = invertby;
    lodash.invokemap = invokemap;
    lodash.iteratee = iteratee;
    lodash.keyby = keyby;
    lodash.keys = keys;
    lodash.keysin = keysin;
    lodash.map = map;
    lodash.mapkeys = mapkeys;
    lodash.mapvalues = mapvalues;
    lodash.matches = matches;
    lodash.matchesproperty = matchesproperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergewith = mergewith;
    lodash.method = method;
    lodash.methodof = methodof;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.ntharg = ntharg;
    lodash.omit = omit;
    lodash.omitby = omitby;
    lodash.once = once;
    lodash.orderby = orderby;
    lodash.over = over;
    lodash.overargs = overargs;
    lodash.overevery = overevery;
    lodash.oversome = oversome;
    lodash.partial = partial;
    lodash.partialright = partialright;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickby = pickby;
    lodash.property = property;
    lodash.propertyof = propertyof;
    lodash.pull = pull;
    lodash.pullall = pullall;
    lodash.pullallby = pullallby;
    lodash.pullallwith = pullallwith;
    lodash.pullat = pullat;
    lodash.range = range;
    lodash.rangeright = rangeright;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.samplesize = samplesize;
    lodash.set = set;
    lodash.setwith = setwith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortby = sortby;
    lodash.sorteduniq = sorteduniq;
    lodash.sorteduniqby = sorteduniqby;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeright = takeright;
    lodash.takerightwhile = takerightwhile;
    lodash.takewhile = takewhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toarray = toarray;
    lodash.topairs = topairs;
    lodash.topairsin = topairsin;
    lodash.topath = topath;
    lodash.toplainobject = toplainobject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionby = unionby;
    lodash.unionwith = unionwith;
    lodash.uniq = uniq;
    lodash.uniqby = uniqby;
    lodash.uniqwith = uniqwith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipwith = unzipwith;
    lodash.update = update;
    lodash.updatewith = updatewith;
    lodash.values = values;
    lodash.valuesin = valuesin;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorby = xorby;
    lodash.xorwith = xorwith;
    lodash.zip = zip;
    lodash.zipobject = zipobject;
    lodash.zipobjectdeep = zipobjectdeep;
    lodash.zipwith = zipwith;

    // add aliases.
    lodash.entries = topairs;
    lodash.entriesin = topairsin;
    lodash.extend = assignin;
    lodash.extendwith = assigninwith;

    // add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelcase = camelcase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.clonedeep = clonedeep;
    lodash.clonedeepwith = clonedeepwith;
    lodash.clonewith = clonewith;
    lodash.conformsto = conformsto;
    lodash.deburr = deburr;
    lodash.defaultto = defaultto;
    lodash.divide = divide;
    lodash.endswith = endswith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escaperegexp = escaperegexp;
    lodash.every = every;
    lodash.find = find;
    lodash.findindex = findindex;
    lodash.findkey = findkey;
    lodash.findlast = findlast;
    lodash.findlastindex = findlastindex;
    lodash.findlastkey = findlastkey;
    lodash.floor = floor;
    lodash.foreach = foreach;
    lodash.foreachright = foreachright;
    lodash.forin = forin;
    lodash.forinright = forinright;
    lodash.forown = forown;
    lodash.forownright = forownright;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasin = hasin;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexof = indexof;
    lodash.inrange = inrange;
    lodash.invoke = invoke;
    lodash.isarguments = isarguments;
    lodash.isarray = isarray;
    lodash.isarraybuffer = isarraybuffer;
    lodash.isarraylike = isarraylike;
    lodash.isarraylikeobject = isarraylikeobject;
    lodash.isboolean = isboolean;
    lodash.isbuffer = isbuffer;
    lodash.isdate = isdate;
    lodash.iselement = iselement;
    lodash.isempty = isempty;
    lodash.isequal = isequal;
    lodash.isequalwith = isequalwith;
    lodash.iserror = iserror;
    lodash.isfinite = isfinite;
    lodash.isfunction = isfunction;
    lodash.isinteger = isinteger;
    lodash.islength = islength;
    lodash.ismap = ismap;
    lodash.ismatch = ismatch;
    lodash.ismatchwith = ismatchwith;
    lodash.isnan = isnan;
    lodash.isnative = isnative;
    lodash.isnil = isnil;
    lodash.isnull = isnull;
    lodash.isnumber = isnumber;
    lodash.isobject = isobject;
    lodash.isobjectlike = isobjectlike;
    lodash.isplainobject = isplainobject;
    lodash.isregexp = isregexp;
    lodash.issafeinteger = issafeinteger;
    lodash.isset = isset;
    lodash.isstring = isstring;
    lodash.issymbol = issymbol;
    lodash.istypedarray = istypedarray;
    lodash.isundefined = isundefined;
    lodash.isweakmap = isweakmap;
    lodash.isweakset = isweakset;
    lodash.join = join;
    lodash.kebabcase = kebabcase;
    lodash.last = last;
    lodash.lastindexof = lastindexof;
    lodash.lowercase = lowercase;
    lodash.lowerfirst = lowerfirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxby = maxby;
    lodash.mean = mean;
    lodash.meanby = meanby;
    lodash.min = min;
    lodash.minby = minby;
    lodash.stubarray = stubarray;
    lodash.stubfalse = stubfalse;
    lodash.stubobject = stubobject;
    lodash.stubstring = stubstring;
    lodash.stubtrue = stubtrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noconflict = noconflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padend = padend;
    lodash.padstart = padstart;
    lodash.parseint = parseint;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceright = reduceright;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runincontext = runincontext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakecase = snakecase;
    lodash.some = some;
    lodash.sortedindex = sortedindex;
    lodash.sortedindexby = sortedindexby;
    lodash.sortedindexof = sortedindexof;
    lodash.sortedlastindex = sortedlastindex;
    lodash.sortedlastindexby = sortedlastindexby;
    lodash.sortedlastindexof = sortedlastindexof;
    lodash.startcase = startcase;
    lodash.startswith = startswith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumby = sumby;
    lodash.template = template;
    lodash.times = times;
    lodash.tofinite = tofinite;
    lodash.tointeger = tointeger;
    lodash.tolength = tolength;
    lodash.tolower = tolower;
    lodash.tonumber = tonumber;
    lodash.tosafeinteger = tosafeinteger;
    lodash.tostring = tostring;
    lodash.toupper = toupper;
    lodash.trim = trim;
    lodash.trimend = trimend;
    lodash.trimstart = trimstart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueid = uniqueid;
    lodash.uppercase = uppercase;
    lodash.upperfirst = upperfirst;

    // add aliases.
    lodash.each = foreach;
    lodash.eachright = foreachright;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseforown(lodash, function(func, methodname) {
        if (!hasownproperty.call(lodash.prototype, methodname)) {
          source[methodname] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * the semantic version number.
     *
     * @static
     * @memberof _
     * @type {string}
     */
    lodash.version = version;

    // assign default placeholders.
    arrayeach(['bind', 'bindkey', 'curry', 'curryright', 'partial', 'partialright'], function(methodname) {
      lodash[methodname].placeholder = lodash;
    });

    // add `lazywrapper` methods for `_.drop` and `_.take` variants.
    arrayeach(['drop', 'take'], function(methodname, index) {
      lazywrapper.prototype[methodname] = function(n) {
        n = n === undefined ? 1 : nativemax(tointeger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new lazywrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takecount__ = nativemin(n, result.__takecount__);
        } else {
          result.__views__.push({
            'size': nativemin(n, max_array_length),
            'type': methodname + (result.__dir__ < 0 ? 'right' : '')
          });
        }
        return result;
      };

      lazywrapper.prototype[methodname + 'right'] = function(n) {
        return this.reverse()[methodname](n).reverse();
      };
    });

    // add `lazywrapper` methods that accept an `iteratee` value.
    arrayeach(['filter', 'map', 'takewhile'], function(methodname, index) {
      var type = index + 1,
          isfilter = type == lazy_filter_flag || type == lazy_while_flag;

      lazywrapper.prototype[methodname] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getiteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isfilter;
        return result;
      };
    });

    // add `lazywrapper` methods for `_.head` and `_.last`.
    arrayeach(['head', 'last'], function(methodname, index) {
      var takename = 'take' + (index ? 'right' : '');

      lazywrapper.prototype[methodname] = function() {
        return this[takename](1).value()[0];
      };
    });

    // add `lazywrapper` methods for `_.initial` and `_.tail`.
    arrayeach(['initial', 'tail'], function(methodname, index) {
      var dropname = 'drop' + (index ? '' : 'right');

      lazywrapper.prototype[methodname] = function() {
        return this.__filtered__ ? new lazywrapper(this) : this[dropname](1);
      };
    });

    lazywrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    lazywrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    lazywrapper.prototype.findlast = function(predicate) {
      return this.reverse().find(predicate);
    };

    lazywrapper.prototype.invokemap = baserest(function(path, args) {
      if (typeof path == 'function') {
        return new lazywrapper(this);
      }
      return this.map(function(value) {
        return baseinvoke(value, path, args);
      });
    });

    lazywrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getiteratee(predicate)));
    };

    lazywrapper.prototype.slice = function(start, end) {
      start = tointeger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new lazywrapper(result);
      }
      if (start < 0) {
        result = result.takeright(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = tointeger(end);
        result = end < 0 ? result.dropright(-end) : result.take(end - start);
      }
      return result;
    };

    lazywrapper.prototype.takerightwhile = function(predicate) {
      return this.reverse().takewhile(predicate).reverse();
    };

    lazywrapper.prototype.toarray = function() {
      return this.take(max_array_length);
    };

    // add `lazywrapper` methods to `lodash.prototype`.
    baseforown(lazywrapper.prototype, function(func, methodname) {
      var checkiteratee = /^(?:filter|find|map|reject)|while$/.test(methodname),
          istaker = /^(?:head|last)$/.test(methodname),
          lodashfunc = lodash[istaker ? ('take' + (methodname == 'last' ? 'right' : '')) : methodname],
          retunwrapped = istaker || /^find/.test(methodname);

      if (!lodashfunc) {
        return;
      }
      lodash.prototype[methodname] = function() {
        var value = this.__wrapped__,
            args = istaker ? [1] : arguments,
            islazy = value instanceof lazywrapper,
            iteratee = args[0],
            uselazy = islazy || isarray(value);

        var interceptor = function(value) {
          var result = lodashfunc.apply(lodash, arraypush([value], args));
          return (istaker && chainall) ? result[0] : result;
        };

        if (uselazy && checkiteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // avoid lazy use if the iteratee has a "length" value other than `1`.
          islazy = uselazy = false;
        }
        var chainall = this.__chain__,
            ishybrid = !!this.__actions__.length,
            isunwrapped = retunwrapped && !chainall,
            onlylazy = islazy && !ishybrid;

        if (!retunwrapped && uselazy) {
          value = onlylazy ? value : new lazywrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisarg': undefined });
          return new lodashwrapper(result, chainall);
        }
        if (isunwrapped && onlylazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isunwrapped ? (istaker ? result.value()[0] : result.value()) : result;
      };
    });

    // add `array` methods to `lodash.prototype`.
    arrayeach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodname) {
      var func = arrayproto[methodname],
          chainname = /^(?:push|sort|unshift)$/.test(methodname) ? 'tap' : 'thru',
          retunwrapped = /^(?:pop|shift)$/.test(methodname);

      lodash.prototype[methodname] = function() {
        var args = arguments;
        if (retunwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isarray(value) ? value : [], args);
        }
        return this[chainname](function(value) {
          return func.apply(isarray(value) ? value : [], args);
        });
      };
    });

    // map minified method names to their real names.
    baseforown(lazywrapper.prototype, function(func, methodname) {
      var lodashfunc = lodash[methodname];
      if (lodashfunc) {
        var key = lodashfunc.name + '';
        if (!hasownproperty.call(realnames, key)) {
          realnames[key] = [];
        }
        realnames[key].push({ 'name': methodname, 'func': lodashfunc });
      }
    });

    realnames[createhybrid(undefined, wrap_bind_key_flag).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // add methods to `lazywrapper`.
    lazywrapper.prototype.clone = lazyclone;
    lazywrapper.prototype.reverse = lazyreverse;
    lazywrapper.prototype.value = lazyvalue;

    // add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperat;
    lodash.prototype.chain = wrapperchain;
    lodash.prototype.commit = wrappercommit;
    lodash.prototype.next = wrappernext;
    lodash.prototype.plant = wrapperplant;
    lodash.prototype.reverse = wrapperreverse;
    lodash.prototype.tojson = lodash.prototype.valueof = lodash.prototype.value = wrappervalue;

    // add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symiterator) {
      lodash.prototype[symiterator] = wrappertoiterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // export lodash.
  var _ = runincontext();

  // some amd build optimizers, like r.js, check for condition patterns like:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // expose lodash on the global object to prevent errors when lodash is
    // loaded by a script tag in the presence of an amd loader.
    // see http://requirejs.org/docs/errors.html#mismatch for more details.
    // use `_.noconflict` to remove lodash from the global object.
    root._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds it.
  else if (freemodule) {
    // export for node.js.
    (freemodule.exports = _)._ = _;
    // export for commonjs support.
    freeexports._ = _;
  }
  else {
    // export to the global object.
    root._ = _;
  }
}.call(this));






