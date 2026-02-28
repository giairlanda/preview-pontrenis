(function webpackuniversalmoduledefinition(root, factory) {
/* istanbul ignore next */
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
/* istanbul ignore next */
	else if(typeof exports === 'object')
		exports["esprima"] = factory();
	else
		root["esprima"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackbootstrap
/******/ 	// the module cache
/******/ 	var installedmodules = {};

/******/ 	// the require function
/******/ 	function __webpack_require__(moduleid) {

/******/ 		// check if module is in cache
/* istanbul ignore if */
/******/ 		if(installedmodules[moduleid])
/******/ 			return installedmodules[moduleid].exports;

/******/ 		// create a new module (and put it into the cache)
/******/ 		var module = installedmodules[moduleid] = {
/******/ 			exports: {},
/******/ 			id: moduleid,
/******/ 			loaded: false
/******/ 		};

/******/ 		// execute the module function
/******/ 		modules[moduleid].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedmodules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*
	  copyright js foundation and other contributors, https://js.foundation/

	  redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  this software is provided by the copyright holders and contributors "as is"
	  and any express or implied warranties, including, but not limited to, the
	  implied warranties of merchantability and fitness for a particular purpose
	  are disclaimed. in no event shall <copyright holder> be liable for any
	  direct, indirect, incidental, special, exemplary, or consequential damages
	  (including, but not limited to, procurement of substitute goods or services;
	  loss of use, data, or profits; or business interruption) however caused and
	  on any theory of liability, whether in contract, strict liability, or tort
	  (including negligence or otherwise) arising in any way out of the use of
	  this software, even if advised of the possibility of such damage.
	*/
	object.defineproperty(exports, "__esmodule", { value: true });
	var comment_handler_1 = __webpack_require__(1);
	var jsx_parser_1 = __webpack_require__(3);
	var parser_1 = __webpack_require__(8);
	var tokenizer_1 = __webpack_require__(15);
	function parse(code, options, delegate) {
	    var commenthandler = null;
	    var proxydelegate = function (node, metadata) {
	        if (delegate) {
	            delegate(node, metadata);
	        }
	        if (commenthandler) {
	            commenthandler.visit(node, metadata);
	        }
	    };
	    var parserdelegate = (typeof delegate === 'function') ? proxydelegate : null;
	    var collectcomment = false;
	    if (options) {
	        collectcomment = (typeof options.comment === 'boolean' && options.comment);
	        var attachcomment = (typeof options.attachcomment === 'boolean' && options.attachcomment);
	        if (collectcomment || attachcomment) {
	            commenthandler = new comment_handler_1.commenthandler();
	            commenthandler.attach = attachcomment;
	            options.comment = true;
	            parserdelegate = proxydelegate;
	        }
	    }
	    var ismodule = false;
	    if (options && typeof options.sourcetype === 'string') {
	        ismodule = (options.sourcetype === 'module');
	    }
	    var parser;
	    if (options && typeof options.jsx === 'boolean' && options.jsx) {
	        parser = new jsx_parser_1.jsxparser(code, options, parserdelegate);
	    }
	    else {
	        parser = new parser_1.parser(code, options, parserdelegate);
	    }
	    var program = ismodule ? parser.parsemodule() : parser.parsescript();
	    var ast = program;
	    if (collectcomment && commenthandler) {
	        ast.comments = commenthandler.comments;
	    }
	    if (parser.config.tokens) {
	        ast.tokens = parser.tokens;
	    }
	    if (parser.config.tolerant) {
	        ast.errors = parser.errorhandler.errors;
	    }
	    return ast;
	}
	exports.parse = parse;
	function parsemodule(code, options, delegate) {
	    var parsingoptions = options || {};
	    parsingoptions.sourcetype = 'module';
	    return parse(code, parsingoptions, delegate);
	}
	exports.parsemodule = parsemodule;
	function parsescript(code, options, delegate) {
	    var parsingoptions = options || {};
	    parsingoptions.sourcetype = 'script';
	    return parse(code, parsingoptions, delegate);
	}
	exports.parsescript = parsescript;
	function tokenize(code, options, delegate) {
	    var tokenizer = new tokenizer_1.tokenizer(code, options);
	    var tokens;
	    tokens = [];
	    try {
	        while (true) {
	            var token = tokenizer.getnexttoken();
	            if (!token) {
	                break;
	            }
	            if (delegate) {
	                token = delegate(token);
	            }
	            tokens.push(token);
	        }
	    }
	    catch (e) {
	        tokenizer.errorhandler.tolerate(e);
	    }
	    if (tokenizer.errorhandler.tolerant) {
	        tokens.errors = tokenizer.errors();
	    }
	    return tokens;
	}
	exports.tokenize = tokenize;
	var syntax_1 = __webpack_require__(2);
	exports.syntax = syntax_1.syntax;
	// sync with *.json manifests.
	exports.version = '4.0.0';


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	var syntax_1 = __webpack_require__(2);
	var commenthandler = (function () {
	    function commenthandler() {
	        this.attach = false;
	        this.comments = [];
	        this.stack = [];
	        this.leading = [];
	        this.trailing = [];
	    }
	    commenthandler.prototype.insertinnercomments = function (node, metadata) {
	        //  innnercomments for properties empty block
	        //  `function a() {/** comments **\/}`
	        if (node.type === syntax_1.syntax.blockstatement && node.body.length === 0) {
	            var innercomments = [];
	            for (var i = this.leading.length - 1; i >= 0; --i) {
	                var entry = this.leading[i];
	                if (metadata.end.offset >= entry.start) {
	                    innercomments.unshift(entry.comment);
	                    this.leading.splice(i, 1);
	                    this.trailing.splice(i, 1);
	                }
	            }
	            if (innercomments.length) {
	                node.innercomments = innercomments;
	            }
	        }
	    };
	    commenthandler.prototype.findtrailingcomments = function (metadata) {
	        var trailingcomments = [];
	        if (this.trailing.length > 0) {
	            for (var i = this.trailing.length - 1; i >= 0; --i) {
	                var entry_1 = this.trailing[i];
	                if (entry_1.start >= metadata.end.offset) {
	                    trailingcomments.unshift(entry_1.comment);
	                }
	            }
	            this.trailing.length = 0;
	            return trailingcomments;
	        }
	        var entry = this.stack[this.stack.length - 1];
	        if (entry && entry.node.trailingcomments) {
	            var firstcomment = entry.node.trailingcomments[0];
	            if (firstcomment && firstcomment.range[0] >= metadata.end.offset) {
	                trailingcomments = entry.node.trailingcomments;
	                delete entry.node.trailingcomments;
	            }
	        }
	        return trailingcomments;
	    };
	    commenthandler.prototype.findleadingcomments = function (metadata) {
	        var leadingcomments = [];
	        var target;
	        while (this.stack.length > 0) {
	            var entry = this.stack[this.stack.length - 1];
	            if (entry && entry.start >= metadata.start.offset) {
	                target = entry.node;
	                this.stack.pop();
	            }
	            else {
	                break;
	            }
	        }
	        if (target) {
	            var count = target.leadingcomments ? target.leadingcomments.length : 0;
	            for (var i = count - 1; i >= 0; --i) {
	                var comment = target.leadingcomments[i];
	                if (comment.range[1] <= metadata.start.offset) {
	                    leadingcomments.unshift(comment);
	                    target.leadingcomments.splice(i, 1);
	                }
	            }
	            if (target.leadingcomments && target.leadingcomments.length === 0) {
	                delete target.leadingcomments;
	            }
	            return leadingcomments;
	        }
	        for (var i = this.leading.length - 1; i >= 0; --i) {
	            var entry = this.leading[i];
	            if (entry.start <= metadata.start.offset) {
	                leadingcomments.unshift(entry.comment);
	                this.leading.splice(i, 1);
	            }
	        }
	        return leadingcomments;
	    };
	    commenthandler.prototype.visitnode = function (node, metadata) {
	        if (node.type === syntax_1.syntax.program && node.body.length > 0) {
	            return;
	        }
	        this.insertinnercomments(node, metadata);
	        var trailingcomments = this.findtrailingcomments(metadata);
	        var leadingcomments = this.findleadingcomments(metadata);
	        if (leadingcomments.length > 0) {
	            node.leadingcomments = leadingcomments;
	        }
	        if (trailingcomments.length > 0) {
	            node.trailingcomments = trailingcomments;
	        }
	        this.stack.push({
	            node: node,
	            start: metadata.start.offset
	        });
	    };
	    commenthandler.prototype.visitcomment = function (node, metadata) {
	        var type = (node.type[0] === 'l') ? 'line' : 'block';
	        var comment = {
	            type: type,
	            value: node.value
	        };
	        if (node.range) {
	            comment.range = node.range;
	        }
	        if (node.loc) {
	            comment.loc = node.loc;
	        }
	        this.comments.push(comment);
	        if (this.attach) {
	            var entry = {
	                comment: {
	                    type: type,
	                    value: node.value,
	                    range: [metadata.start.offset, metadata.end.offset]
	                },
	                start: metadata.start.offset
	            };
	            if (node.loc) {
	                entry.comment.loc = node.loc;
	            }
	            node.type = type;
	            this.leading.push(entry);
	            this.trailing.push(entry);
	        }
	    };
	    commenthandler.prototype.visit = function (node, metadata) {
	        if (node.type === 'linecomment') {
	            this.visitcomment(node, metadata);
	        }
	        else if (node.type === 'blockcomment') {
	            this.visitcomment(node, metadata);
	        }
	        else if (this.attach) {
	            this.visitnode(node, metadata);
	        }
	    };
	    return commenthandler;
	}());
	exports.commenthandler = commenthandler;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	exports.syntax = {
	    assignmentexpression: 'assignmentexpression',
	    assignmentpattern: 'assignmentpattern',
	    arrayexpression: 'arrayexpression',
	    arraypattern: 'arraypattern',
	    arrowfunctionexpression: 'arrowfunctionexpression',
	    awaitexpression: 'awaitexpression',
	    blockstatement: 'blockstatement',
	    binaryexpression: 'binaryexpression',
	    breakstatement: 'breakstatement',
	    callexpression: 'callexpression',
	    catchclause: 'catchclause',
	    classbody: 'classbody',
	    classdeclaration: 'classdeclaration',
	    classexpression: 'classexpression',
	    conditionalexpression: 'conditionalexpression',
	    continuestatement: 'continuestatement',
	    dowhilestatement: 'dowhilestatement',
	    debuggerstatement: 'debuggerstatement',
	    emptystatement: 'emptystatement',
	    exportalldeclaration: 'exportalldeclaration',
	    exportdefaultdeclaration: 'exportdefaultdeclaration',
	    exportnameddeclaration: 'exportnameddeclaration',
	    exportspecifier: 'exportspecifier',
	    expressionstatement: 'expressionstatement',
	    forstatement: 'forstatement',
	    forofstatement: 'forofstatement',
	    forinstatement: 'forinstatement',
	    functiondeclaration: 'functiondeclaration',
	    functionexpression: 'functionexpression',
	    identifier: 'identifier',
	    ifstatement: 'ifstatement',
	    importdeclaration: 'importdeclaration',
	    importdefaultspecifier: 'importdefaultspecifier',
	    importnamespacespecifier: 'importnamespacespecifier',
	    importspecifier: 'importspecifier',
	    literal: 'literal',
	    labeledstatement: 'labeledstatement',
	    logicalexpression: 'logicalexpression',
	    memberexpression: 'memberexpression',
	    metaproperty: 'metaproperty',
	    methoddefinition: 'methoddefinition',
	    newexpression: 'newexpression',
	    objectexpression: 'objectexpression',
	    objectpattern: 'objectpattern',
	    program: 'program',
	    property: 'property',
	    restelement: 'restelement',
	    returnstatement: 'returnstatement',
	    sequenceexpression: 'sequenceexpression',
	    spreadelement: 'spreadelement',
	    super: 'super',
	    switchcase: 'switchcase',
	    switchstatement: 'switchstatement',
	    taggedtemplateexpression: 'taggedtemplateexpression',
	    templateelement: 'templateelement',
	    templateliteral: 'templateliteral',
	    thisexpression: 'thisexpression',
	    throwstatement: 'throwstatement',
	    trystatement: 'trystatement',
	    unaryexpression: 'unaryexpression',
	    updateexpression: 'updateexpression',
	    variabledeclaration: 'variabledeclaration',
	    variabledeclarator: 'variabledeclarator',
	    whilestatement: 'whilestatement',
	    withstatement: 'withstatement',
	    yieldexpression: 'yieldexpression'
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
/* istanbul ignore next */
	var __extends = (this && this.__extends) || (function () {
	    var extendstatics = object.setprototypeof ||
	        ({ __proto__: [] } instanceof array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasownproperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendstatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	object.defineproperty(exports, "__esmodule", { value: true });
	var character_1 = __webpack_require__(4);
	var jsxnode = __webpack_require__(5);
	var jsx_syntax_1 = __webpack_require__(6);
	var node = __webpack_require__(7);
	var parser_1 = __webpack_require__(8);
	var token_1 = __webpack_require__(13);
	var xhtml_entities_1 = __webpack_require__(14);
	token_1.tokenname[100 /* identifier */] = 'jsxidentifier';
	token_1.tokenname[101 /* text */] = 'jsxtext';
	// fully qualified element name, e.g. <svg:path> returns "svg:path"
	function getqualifiedelementname(elementname) {
	    var qualifiedname;
	    switch (elementname.type) {
	        case jsx_syntax_1.jsxsyntax.jsxidentifier:
	            var id = elementname;
	            qualifiedname = id.name;
	            break;
	        case jsx_syntax_1.jsxsyntax.jsxnamespacedname:
	            var ns = elementname;
	            qualifiedname = getqualifiedelementname(ns.namespace) + ':' +
	                getqualifiedelementname(ns.name);
	            break;
	        case jsx_syntax_1.jsxsyntax.jsxmemberexpression:
	            var expr = elementname;
	            qualifiedname = getqualifiedelementname(expr.object) + '.' +
	                getqualifiedelementname(expr.property);
	            break;
	        /* istanbul ignore next */
	        default:
	            break;
	    }
	    return qualifiedname;
	}
	var jsxparser = (function (_super) {
	    __extends(jsxparser, _super);
	    function jsxparser(code, options, delegate) {
	        return _super.call(this, code, options, delegate) || this;
	    }
	    jsxparser.prototype.parseprimaryexpression = function () {
	        return this.match('<') ? this.parsejsxroot() : _super.prototype.parseprimaryexpression.call(this);
	    };
	    jsxparser.prototype.startjsx = function () {
	        // unwind the scanner before the lookahead token.
	        this.scanner.index = this.startmarker.index;
	        this.scanner.linenumber = this.startmarker.line;
	        this.scanner.linestart = this.startmarker.index - this.startmarker.column;
	    };
	    jsxparser.prototype.finishjsx = function () {
	        // prime the next lookahead.
	        this.nexttoken();
	    };
	    jsxparser.prototype.reenterjsx = function () {
	        this.startjsx();
	        this.expectjsx('}');
	        // pop the closing '}' added from the lookahead.
	        if (this.config.tokens) {
	            this.tokens.pop();
	        }
	    };
	    jsxparser.prototype.createjsxnode = function () {
	        this.collectcomments();
	        return {
	            index: this.scanner.index,
	            line: this.scanner.linenumber,
	            column: this.scanner.index - this.scanner.linestart
	        };
	    };
	    jsxparser.prototype.createjsxchildnode = function () {
	        return {
	            index: this.scanner.index,
	            line: this.scanner.linenumber,
	            column: this.scanner.index - this.scanner.linestart
	        };
	    };
	    jsxparser.prototype.scanxhtmlentity = function (quote) {
	        var result = '&';
	        var valid = true;
	        var terminated = false;
	        var numeric = false;
	        var hex = false;
	        while (!this.scanner.eof() && valid && !terminated) {
	            var ch = this.scanner.source[this.scanner.index];
	            if (ch === quote) {
	                break;
	            }
	            terminated = (ch === ';');
	            result += ch;
	            ++this.scanner.index;
	            if (!terminated) {
	                switch (result.length) {
	                    case 2:
	                        // e.g. '&#123;'
	                        numeric = (ch === '#');
	                        break;
	                    case 3:
	                        if (numeric) {
	                            // e.g. '&#x41;'
	                            hex = (ch === 'x');
	                            valid = hex || character_1.character.isdecimaldigit(ch.charcodeat(0));
	                            numeric = numeric && !hex;
	                        }
	                        break;
	                    default:
	                        valid = valid && !(numeric && !character_1.character.isdecimaldigit(ch.charcodeat(0)));
	                        valid = valid && !(hex && !character_1.character.ishexdigit(ch.charcodeat(0)));
	                        break;
	                }
	            }
	        }
	        if (valid && terminated && result.length > 2) {
	            // e.g. '&#x41;' becomes just '#x41'
	            var str = result.substr(1, result.length - 2);
	            if (numeric && str.length > 1) {
	                result = string.fromcharcode(parseint(str.substr(1), 10));
	            }
	            else if (hex && str.length > 2) {
	                result = string.fromcharcode(parseint('0' + str.substr(1), 16));
	            }
	            else if (!numeric && !hex && xhtml_entities_1.xhtmlentities[str]) {
	                result = xhtml_entities_1.xhtmlentities[str];
	            }
	        }
	        return result;
	    };
	    // scan the next jsx token. this replaces scanner#lex when in jsx mode.
	    jsxparser.prototype.lexjsx = function () {
	        var cp = this.scanner.source.charcodeat(this.scanner.index);
	        // < > / : = { }
	        if (cp === 60 || cp === 62 || cp === 47 || cp === 58 || cp === 61 || cp === 123 || cp === 125) {
	            var value = this.scanner.source[this.scanner.index++];
	            return {
	                type: 7 /* punctuator */,
	                value: value,
	                linenumber: this.scanner.linenumber,
	                linestart: this.scanner.linestart,
	                start: this.scanner.index - 1,
	                end: this.scanner.index
	            };
	        }
	        // " '
	        if (cp === 34 || cp === 39) {
	            var start = this.scanner.index;
	            var quote = this.scanner.source[this.scanner.index++];
	            var str = '';
	            while (!this.scanner.eof()) {
	                var ch = this.scanner.source[this.scanner.index++];
	                if (ch === quote) {
	                    break;
	                }
	                else if (ch === '&') {
	                    str += this.scanxhtmlentity(quote);
	                }
	                else {
	                    str += ch;
	                }
	            }
	            return {
	                type: 8 /* stringliteral */,
	                value: str,
	                linenumber: this.scanner.linenumber,
	                linestart: this.scanner.linestart,
	                start: start,
	                end: this.scanner.index
	            };
	        }
	        // ... or .
	        if (cp === 46) {
	            var n1 = this.scanner.source.charcodeat(this.scanner.index + 1);
	            var n2 = this.scanner.source.charcodeat(this.scanner.index + 2);
	            var value = (n1 === 46 && n2 === 46) ? '...' : '.';
	            var start = this.scanner.index;
	            this.scanner.index += value.length;
	            return {
	                type: 7 /* punctuator */,
	                value: value,
	                linenumber: this.scanner.linenumber,
	                linestart: this.scanner.linestart,
	                start: start,
	                end: this.scanner.index
	            };
	        }
	        // `
	        if (cp === 96) {
	            // only placeholder, since it will be rescanned as a real assignment expression.
	            return {
	                type: 10 /* template */,
	                value: '',
	                linenumber: this.scanner.linenumber,
	                linestart: this.scanner.linestart,
	                start: this.scanner.index,
	                end: this.scanner.index
	            };
	        }
	        // identifer can not contain backslash (char code 92).
	        if (character_1.character.isidentifierstart(cp) && (cp !== 92)) {
	            var start = this.scanner.index;
	            ++this.scanner.index;
	            while (!this.scanner.eof()) {
	                var ch = this.scanner.source.charcodeat(this.scanner.index);
	                if (character_1.character.isidentifierpart(ch) && (ch !== 92)) {
	                    ++this.scanner.index;
	                }
	                else if (ch === 45) {
	                    // hyphen (char code 45) can be part of an identifier.
	                    ++this.scanner.index;
	                }
	                else {
	                    break;
	                }
	            }
	            var id = this.scanner.source.slice(start, this.scanner.index);
	            return {
	                type: 100 /* identifier */,
	                value: id,
	                linenumber: this.scanner.linenumber,
	                linestart: this.scanner.linestart,
	                start: start,
	                end: this.scanner.index
	            };
	        }
	        return this.scanner.lex();
	    };
	    jsxparser.prototype.nextjsxtoken = function () {
	        this.collectcomments();
	        this.startmarker.index = this.scanner.index;
	        this.startmarker.line = this.scanner.linenumber;
	        this.startmarker.column = this.scanner.index - this.scanner.linestart;
	        var token = this.lexjsx();
	        this.lastmarker.index = this.scanner.index;
	        this.lastmarker.line = this.scanner.linenumber;
	        this.lastmarker.column = this.scanner.index - this.scanner.linestart;
	        if (this.config.tokens) {
	            this.tokens.push(this.converttoken(token));
	        }
	        return token;
	    };
	    jsxparser.prototype.nextjsxtext = function () {
	        this.startmarker.index = this.scanner.index;
	        this.startmarker.line = this.scanner.linenumber;
	        this.startmarker.column = this.scanner.index - this.scanner.linestart;
	        var start = this.scanner.index;
	        var text = '';
	        while (!this.scanner.eof()) {
	            var ch = this.scanner.source[this.scanner.index];
	            if (ch === '{' || ch === '<') {
	                break;
	            }
	            ++this.scanner.index;
	            text += ch;
	            if (character_1.character.islineterminator(ch.charcodeat(0))) {
	                ++this.scanner.linenumber;
	                if (ch === '\r' && this.scanner.source[this.scanner.index] === '\n') {
	                    ++this.scanner.index;
	                }
	                this.scanner.linestart = this.scanner.index;
	            }
	        }
	        this.lastmarker.index = this.scanner.index;
	        this.lastmarker.line = this.scanner.linenumber;
	        this.lastmarker.column = this.scanner.index - this.scanner.linestart;
	        var token = {
	            type: 101 /* text */,
	            value: text,
	            linenumber: this.scanner.linenumber,
	            linestart: this.scanner.linestart,
	            start: start,
	            end: this.scanner.index
	        };
	        if ((text.length > 0) && this.config.tokens) {
	            this.tokens.push(this.converttoken(token));
	        }
	        return token;
	    };
	    jsxparser.prototype.peekjsxtoken = function () {
	        var state = this.scanner.savestate();
	        this.scanner.scancomments();
	        var next = this.lexjsx();
	        this.scanner.restorestate(state);
	        return next;
	    };
	    // expect the next jsx token to match the specified punctuator.
	    // if not, an exception will be thrown.
	    jsxparser.prototype.expectjsx = function (value) {
	        var token = this.nextjsxtoken();
	        if (token.type !== 7 /* punctuator */ || token.value !== value) {
	            this.throwunexpectedtoken(token);
	        }
	    };
	    // return true if the next jsx token matches the specified punctuator.
	    jsxparser.prototype.matchjsx = function (value) {
	        var next = this.peekjsxtoken();
	        return next.type === 7 /* punctuator */ && next.value === value;
	    };
	    jsxparser.prototype.parsejsxidentifier = function () {
	        var node = this.createjsxnode();
	        var token = this.nextjsxtoken();
	        if (token.type !== 100 /* identifier */) {
	            this.throwunexpectedtoken(token);
	        }
	        return this.finalize(node, new jsxnode.jsxidentifier(token.value));
	    };
	    jsxparser.prototype.parsejsxelementname = function () {
	        var node = this.createjsxnode();
	        var elementname = this.parsejsxidentifier();
	        if (this.matchjsx(':')) {
	            var namespace = elementname;
	            this.expectjsx(':');
	            var name_1 = this.parsejsxidentifier();
	            elementname = this.finalize(node, new jsxnode.jsxnamespacedname(namespace, name_1));
	        }
	        else if (this.matchjsx('.')) {
	            while (this.matchjsx('.')) {
	                var object = elementname;
	                this.expectjsx('.');
	                var property = this.parsejsxidentifier();
	                elementname = this.finalize(node, new jsxnode.jsxmemberexpression(object, property));
	            }
	        }
	        return elementname;
	    };
	    jsxparser.prototype.parsejsxattributename = function () {
	        var node = this.createjsxnode();
	        var attributename;
	        var identifier = this.parsejsxidentifier();
	        if (this.matchjsx(':')) {
	            var namespace = identifier;
	            this.expectjsx(':');
	            var name_2 = this.parsejsxidentifier();
	            attributename = this.finalize(node, new jsxnode.jsxnamespacedname(namespace, name_2));
	        }
	        else {
	            attributename = identifier;
	        }
	        return attributename;
	    };
	    jsxparser.prototype.parsejsxstringliteralattribute = function () {
	        var node = this.createjsxnode();
	        var token = this.nextjsxtoken();
	        if (token.type !== 8 /* stringliteral */) {
	            this.throwunexpectedtoken(token);
	        }
	        var raw = this.gettokenraw(token);
	        return this.finalize(node, new node.literal(token.value, raw));
	    };
	    jsxparser.prototype.parsejsxexpressionattribute = function () {
	        var node = this.createjsxnode();
	        this.expectjsx('{');
	        this.finishjsx();
	        if (this.match('}')) {
	            this.tolerateerror('jsx attributes must only be assigned a non-empty expression');
	        }
	        var expression = this.parseassignmentexpression();
	        this.reenterjsx();
	        return this.finalize(node, new jsxnode.jsxexpressioncontainer(expression));
	    };
	    jsxparser.prototype.parsejsxattributevalue = function () {
	        return this.matchjsx('{') ? this.parsejsxexpressionattribute() :
	            this.matchjsx('<') ? this.parsejsxelement() : this.parsejsxstringliteralattribute();
	    };
	    jsxparser.prototype.parsejsxnamevalueattribute = function () {
	        var node = this.createjsxnode();
	        var name = this.parsejsxattributename();
	        var value = null;
	        if (this.matchjsx('=')) {
	            this.expectjsx('=');
	            value = this.parsejsxattributevalue();
	        }
	        return this.finalize(node, new jsxnode.jsxattribute(name, value));
	    };
	    jsxparser.prototype.parsejsxspreadattribute = function () {
	        var node = this.createjsxnode();
	        this.expectjsx('{');
	        this.expectjsx('...');
	        this.finishjsx();
	        var argument = this.parseassignmentexpression();
	        this.reenterjsx();
	        return this.finalize(node, new jsxnode.jsxspreadattribute(argument));
	    };
	    jsxparser.prototype.parsejsxattributes = function () {
	        var attributes = [];
	        while (!this.matchjsx('/') && !this.matchjsx('>')) {
	            var attribute = this.matchjsx('{') ? this.parsejsxspreadattribute() :
	                this.parsejsxnamevalueattribute();
	            attributes.push(attribute);
	        }
	        return attributes;
	    };
	    jsxparser.prototype.parsejsxopeningelement = function () {
	        var node = this.createjsxnode();
	        this.expectjsx('<');
	        var name = this.parsejsxelementname();
	        var attributes = this.parsejsxattributes();
	        var selfclosing = this.matchjsx('/');
	        if (selfclosing) {
	            this.expectjsx('/');
	        }
	        this.expectjsx('>');
	        return this.finalize(node, new jsxnode.jsxopeningelement(name, selfclosing, attributes));
	    };
	    jsxparser.prototype.parsejsxboundaryelement = function () {
	        var node = this.createjsxnode();
	        this.expectjsx('<');
	        if (this.matchjsx('/')) {
	            this.expectjsx('/');
	            var name_3 = this.parsejsxelementname();
	            this.expectjsx('>');
	            return this.finalize(node, new jsxnode.jsxclosingelement(name_3));
	        }
	        var name = this.parsejsxelementname();
	        var attributes = this.parsejsxattributes();
	        var selfclosing = this.matchjsx('/');
	        if (selfclosing) {
	            this.expectjsx('/');
	        }
	        this.expectjsx('>');
	        return this.finalize(node, new jsxnode.jsxopeningelement(name, selfclosing, attributes));
	    };
	    jsxparser.prototype.parsejsxemptyexpression = function () {
	        var node = this.createjsxchildnode();
	        this.collectcomments();
	        this.lastmarker.index = this.scanner.index;
	        this.lastmarker.line = this.scanner.linenumber;
	        this.lastmarker.column = this.scanner.index - this.scanner.linestart;
	        return this.finalize(node, new jsxnode.jsxemptyexpression());
	    };
	    jsxparser.prototype.parsejsxexpressioncontainer = function () {
	        var node = this.createjsxnode();
	        this.expectjsx('{');
	        var expression;
	        if (this.matchjsx('}')) {
	            expression = this.parsejsxemptyexpression();
	            this.expectjsx('}');
	        }
	        else {
	            this.finishjsx();
	            expression = this.parseassignmentexpression();
	            this.reenterjsx();
	        }
	        return this.finalize(node, new jsxnode.jsxexpressioncontainer(expression));
	    };
	    jsxparser.prototype.parsejsxchildren = function () {
	        var children = [];
	        while (!this.scanner.eof()) {
	            var node = this.createjsxchildnode();
	            var token = this.nextjsxtext();
	            if (token.start < token.end) {
	                var raw = this.gettokenraw(token);
	                var child = this.finalize(node, new jsxnode.jsxtext(token.value, raw));
	                children.push(child);
	            }
	            if (this.scanner.source[this.scanner.index] === '{') {
	                var container = this.parsejsxexpressioncontainer();
	                children.push(container);
	            }
	            else {
	                break;
	            }
	        }
	        return children;
	    };
	    jsxparser.prototype.parsecomplexjsxelement = function (el) {
	        var stack = [];
	        while (!this.scanner.eof()) {
	            el.children = el.children.concat(this.parsejsxchildren());
	            var node = this.createjsxchildnode();
	            var element = this.parsejsxboundaryelement();
	            if (element.type === jsx_syntax_1.jsxsyntax.jsxopeningelement) {
	                var opening = element;
	                if (opening.selfclosing) {
	                    var child = this.finalize(node, new jsxnode.jsxelement(opening, [], null));
	                    el.children.push(child);
	                }
	                else {
	                    stack.push(el);
	                    el = { node: node, opening: opening, closing: null, children: [] };
	                }
	            }
	            if (element.type === jsx_syntax_1.jsxsyntax.jsxclosingelement) {
	                el.closing = element;
	                var open_1 = getqualifiedelementname(el.opening.name);
	                var close_1 = getqualifiedelementname(el.closing.name);
	                if (open_1 !== close_1) {
	                    this.tolerateerror('expected corresponding jsx closing tag for %0', open_1);
	                }
	                if (stack.length > 0) {
	                    var child = this.finalize(el.node, new jsxnode.jsxelement(el.opening, el.children, el.closing));
	                    el = stack[stack.length - 1];
	                    el.children.push(child);
	                    stack.pop();
	                }
	                else {
	                    break;
	                }
	            }
	        }
	        return el;
	    };
	    jsxparser.prototype.parsejsxelement = function () {
	        var node = this.createjsxnode();
	        var opening = this.parsejsxopeningelement();
	        var children = [];
	        var closing = null;
	        if (!opening.selfclosing) {
	            var el = this.parsecomplexjsxelement({ node: node, opening: opening, closing: closing, children: children });
	            children = el.children;
	            closing = el.closing;
	        }
	        return this.finalize(node, new jsxnode.jsxelement(opening, children, closing));
	    };
	    jsxparser.prototype.parsejsxroot = function () {
	        // pop the opening '<' added from the lookahead.
	        if (this.config.tokens) {
	            this.tokens.pop();
	        }
	        this.startjsx();
	        var element = this.parsejsxelement();
	        this.finishjsx();
	        return element;
	    };
	    jsxparser.prototype.isstartofexpression = function () {
	        return _super.prototype.isstartofexpression.call(this) || this.match('<');
	    };
	    return jsxparser;
	}(parser_1.parser));
	exports.jsxparser = jsxparser;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	// see also tools/generate-unicode-regex.js.
	var regex = {
	    // unicode v8.0.0 nonasciiidentifierstart:
	    nonasciiidentifierstart: /[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0-\u08b4\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fd5\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ad\ua7b0-\ua7b7\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab65\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]|\ud800[\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\udd40-\udd74\ude80-\ude9c\udea0-\uded0\udf00-\udf1f\udf30-\udf4a\udf50-\udf75\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf\udfd1-\udfd5]|\ud801[\udc00-\udc9d\udd00-\udd27\udd30-\udd63\ude00-\udf36\udf40-\udf55\udf60-\udf67]|\ud802[\udc00-\udc05\udc08\udc0a-\udc35\udc37\udc38\udc3c\udc3f-\udc55\udc60-\udc76\udc80-\udc9e\udce0-\udcf2\udcf4\udcf5\udd00-\udd15\udd20-\udd39\udd80-\uddb7\uddbe\uddbf\ude00\ude10-\ude13\ude15-\ude17\ude19-\ude33\ude60-\ude7c\ude80-\ude9c\udec0-\udec7\udec9-\udee4\udf00-\udf35\udf40-\udf55\udf60-\udf72\udf80-\udf91]|\ud803[\udc00-\udc48\udc80-\udcb2\udcc0-\udcf2]|\ud804[\udc03-\udc37\udc83-\udcaf\udcd0-\udce8\udd03-\udd26\udd50-\udd72\udd76\udd83-\uddb2\uddc1-\uddc4\uddda\udddc\ude00-\ude11\ude13-\ude2b\ude80-\ude86\ude88\ude8a-\ude8d\ude8f-\ude9d\ude9f-\udea8\udeb0-\udede\udf05-\udf0c\udf0f\udf10\udf13-\udf28\udf2a-\udf30\udf32\udf33\udf35-\udf39\udf3d\udf50\udf5d-\udf61]|\ud805[\udc80-\udcaf\udcc4\udcc5\udcc7\udd80-\uddae\uddd8-\udddb\ude00-\ude2f\ude44\ude80-\udeaa\udf00-\udf19]|\ud806[\udca0-\udcdf\udcff\udec0-\udef8]|\ud808[\udc00-\udf99]|\ud809[\udc00-\udc6e\udc80-\udd43]|[\ud80c\ud840-\ud868\ud86a-\ud86c\ud86f-\ud872][\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud811[\udc00-\ude46]|\ud81a[\udc00-\ude38\ude40-\ude5e\uded0-\udeed\udf00-\udf2f\udf40-\udf43\udf63-\udf77\udf7d-\udf8f]|\ud81b[\udf00-\udf44\udf50\udf93-\udf9f]|\ud82c[\udc00\udc01]|\ud82f[\udc00-\udc6a\udc70-\udc7c\udc80-\udc88\udc90-\udc99]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e\udc9f\udca2\udca5\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]|\ud83a[\udc00-\udcc4]|\ud83b[\ude00-\ude03\ude05-\ude1f\ude21\ude22\ude24\ude27\ude29-\ude32\ude34-\ude37\ude39\ude3b\ude42\ude47\ude49\ude4b\ude4d-\ude4f\ude51\ude52\ude54\ude57\ude59\ude5b\ude5d\ude5f\ude61\ude62\ude64\ude67-\ude6a\ude6c-\ude72\ude74-\ude77\ude79-\ude7c\ude7e\ude80-\ude89\ude8b-\ude9b\udea1-\udea3\udea5-\udea9\udeab-\udebb]|\ud869[\udc00-\uded6\udf00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d\udc20-\udfff]|\ud873[\udc00-\udea1]|\ud87e[\udc00-\ude1d]/,
	    // unicode v8.0.0 nonasciiidentifierpart:
	    nonasciiidentifierpart: /[\xaa\xb5\xb7\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b4\u08e3-\u0963\u0966-\u096f\u0971-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0af9\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58-\u0c5a\u0c60-\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d5f-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1369-\u1371\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19da\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1ab0-\u1abd\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c\u200d\u203f\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fd5\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ad\ua7b0-\ua7b7\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua8fd\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\ua9e0-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab65\uab70-\uabea\uabec\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]|\ud800[\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\udd40-\udd74\uddfd\ude80-\ude9c\udea0-\uded0\udee0\udf00-\udf1f\udf30-\udf4a\udf50-\udf7a\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf\udfd1-\udfd5]|\ud801[\udc00-\udc9d\udca0-\udca9\udd00-\udd27\udd30-\udd63\ude00-\udf36\udf40-\udf55\udf60-\udf67]|\ud802[\udc00-\udc05\udc08\udc0a-\udc35\udc37\udc38\udc3c\udc3f-\udc55\udc60-\udc76\udc80-\udc9e\udce0-\udcf2\udcf4\udcf5\udd00-\udd15\udd20-\udd39\udd80-\uddb7\uddbe\uddbf\ude00-\ude03\ude05\ude06\ude0c-\ude13\ude15-\ude17\ude19-\ude33\ude38-\ude3a\ude3f\ude60-\ude7c\ude80-\ude9c\udec0-\udec7\udec9-\udee6\udf00-\udf35\udf40-\udf55\udf60-\udf72\udf80-\udf91]|\ud803[\udc00-\udc48\udc80-\udcb2\udcc0-\udcf2]|\ud804[\udc00-\udc46\udc66-\udc6f\udc7f-\udcba\udcd0-\udce8\udcf0-\udcf9\udd00-\udd34\udd36-\udd3f\udd50-\udd73\udd76\udd80-\uddc4\uddca-\uddcc\uddd0-\uddda\udddc\ude00-\ude11\ude13-\ude37\ude80-\ude86\ude88\ude8a-\ude8d\ude8f-\ude9d\ude9f-\udea8\udeb0-\udeea\udef0-\udef9\udf00-\udf03\udf05-\udf0c\udf0f\udf10\udf13-\udf28\udf2a-\udf30\udf32\udf33\udf35-\udf39\udf3c-\udf44\udf47\udf48\udf4b-\udf4d\udf50\udf57\udf5d-\udf63\udf66-\udf6c\udf70-\udf74]|\ud805[\udc80-\udcc5\udcc7\udcd0-\udcd9\udd80-\uddb5\uddb8-\uddc0\uddd8-\udddd\ude00-\ude40\ude44\ude50-\ude59\ude80-\udeb7\udec0-\udec9\udf00-\udf19\udf1d-\udf2b\udf30-\udf39]|\ud806[\udca0-\udce9\udcff\udec0-\udef8]|\ud808[\udc00-\udf99]|\ud809[\udc00-\udc6e\udc80-\udd43]|[\ud80c\ud840-\ud868\ud86a-\ud86c\ud86f-\ud872][\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud811[\udc00-\ude46]|\ud81a[\udc00-\ude38\ude40-\ude5e\ude60-\ude69\uded0-\udeed\udef0-\udef4\udf00-\udf36\udf40-\udf43\udf50-\udf59\udf63-\udf77\udf7d-\udf8f]|\ud81b[\udf00-\udf44\udf50-\udf7e\udf8f-\udf9f]|\ud82c[\udc00\udc01]|\ud82f[\udc00-\udc6a\udc70-\udc7c\udc80-\udc88\udc90-\udc99\udc9d\udc9e]|\ud834[\udd65-\udd69\udd6d-\udd72\udd7b-\udd82\udd85-\udd8b\uddaa-\uddad\ude42-\ude44]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e\udc9f\udca2\udca5\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb\udfce-\udfff]|\ud836[\ude00-\ude36\ude3b-\ude6c\ude75\ude84\ude9b-\ude9f\udea1-\udeaf]|\ud83a[\udc00-\udcc4\udcd0-\udcd6]|\ud83b[\ude00-\ude03\ude05-\ude1f\ude21\ude22\ude24\ude27\ude29-\ude32\ude34-\ude37\ude39\ude3b\ude42\ude47\ude49\ude4b\ude4d-\ude4f\ude51\ude52\ude54\ude57\ude59\ude5b\ude5d\ude5f\ude61\ude62\ude64\ude67-\ude6a\ude6c-\ude72\ude74-\ude77\ude79-\ude7c\ude7e\ude80-\ude89\ude8b-\ude9b\udea1-\udea3\udea5-\udea9\udeab-\udebb]|\ud869[\udc00-\uded6\udf00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d\udc20-\udfff]|\ud873[\udc00-\udea1]|\ud87e[\udc00-\ude1d]|\udb40[\udd00-\uddef]/
	};
	exports.character = {
	    /* tslint:disable:no-bitwise */
	    fromcodepoint: function (cp) {
	        return (cp < 0x10000) ? string.fromcharcode(cp) :
	            string.fromcharcode(0xd800 + ((cp - 0x10000) >> 10)) +
	                string.fromcharcode(0xdc00 + ((cp - 0x10000) & 1023));
	    },
	    // https://tc39.github.io/ecma262/#sec-white-space
	    iswhitespace: function (cp) {
	        return (cp === 0x20) || (cp === 0x09) || (cp === 0x0b) || (cp === 0x0c) || (cp === 0xa0) ||
	            (cp >= 0x1680 && [0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x202f, 0x205f, 0x3000, 0xfeff].indexof(cp) >= 0);
	    },
	    // https://tc39.github.io/ecma262/#sec-line-terminators
	    islineterminator: function (cp) {
	        return (cp === 0x0a) || (cp === 0x0d) || (cp === 0x2028) || (cp === 0x2029);
	    },
	    // https://tc39.github.io/ecma262/#sec-names-and-keywords
	    isidentifierstart: function (cp) {
	        return (cp === 0x24) || (cp === 0x5f) ||
	            (cp >= 0x41 && cp <= 0x5a) ||
	            (cp >= 0x61 && cp <= 0x7a) ||
	            (cp === 0x5c) ||
	            ((cp >= 0x80) && regex.nonasciiidentifierstart.test(exports.character.fromcodepoint(cp)));
	    },
	    isidentifierpart: function (cp) {
	        return (cp === 0x24) || (cp === 0x5f) ||
	            (cp >= 0x41 && cp <= 0x5a) ||
	            (cp >= 0x61 && cp <= 0x7a) ||
	            (cp >= 0x30 && cp <= 0x39) ||
	            (cp === 0x5c) ||
	            ((cp >= 0x80) && regex.nonasciiidentifierpart.test(exports.character.fromcodepoint(cp)));
	    },
	    // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
	    isdecimaldigit: function (cp) {
	        return (cp >= 0x30 && cp <= 0x39); // 0..9
	    },
	    ishexdigit: function (cp) {
	        return (cp >= 0x30 && cp <= 0x39) ||
	            (cp >= 0x41 && cp <= 0x46) ||
	            (cp >= 0x61 && cp <= 0x66); // a..f
	    },
	    isoctaldigit: function (cp) {
	        return (cp >= 0x30 && cp <= 0x37); // 0..7
	    }
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	var jsx_syntax_1 = __webpack_require__(6);
	/* tslint:disable:max-classes-per-file */
	var jsxclosingelement = (function () {
	    function jsxclosingelement(name) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxclosingelement;
	        this.name = name;
	    }
	    return jsxclosingelement;
	}());
	exports.jsxclosingelement = jsxclosingelement;
	var jsxelement = (function () {
	    function jsxelement(openingelement, children, closingelement) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxelement;
	        this.openingelement = openingelement;
	        this.children = children;
	        this.closingelement = closingelement;
	    }
	    return jsxelement;
	}());
	exports.jsxelement = jsxelement;
	var jsxemptyexpression = (function () {
	    function jsxemptyexpression() {
	        this.type = jsx_syntax_1.jsxsyntax.jsxemptyexpression;
	    }
	    return jsxemptyexpression;
	}());
	exports.jsxemptyexpression = jsxemptyexpression;
	var jsxexpressioncontainer = (function () {
	    function jsxexpressioncontainer(expression) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxexpressioncontainer;
	        this.expression = expression;
	    }
	    return jsxexpressioncontainer;
	}());
	exports.jsxexpressioncontainer = jsxexpressioncontainer;
	var jsxidentifier = (function () {
	    function jsxidentifier(name) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxidentifier;
	        this.name = name;
	    }
	    return jsxidentifier;
	}());
	exports.jsxidentifier = jsxidentifier;
	var jsxmemberexpression = (function () {
	    function jsxmemberexpression(object, property) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxmemberexpression;
	        this.object = object;
	        this.property = property;
	    }
	    return jsxmemberexpression;
	}());
	exports.jsxmemberexpression = jsxmemberexpression;
	var jsxattribute = (function () {
	    function jsxattribute(name, value) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxattribute;
	        this.name = name;
	        this.value = value;
	    }
	    return jsxattribute;
	}());
	exports.jsxattribute = jsxattribute;
	var jsxnamespacedname = (function () {
	    function jsxnamespacedname(namespace, name) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxnamespacedname;
	        this.namespace = namespace;
	        this.name = name;
	    }
	    return jsxnamespacedname;
	}());
	exports.jsxnamespacedname = jsxnamespacedname;
	var jsxopeningelement = (function () {
	    function jsxopeningelement(name, selfclosing, attributes) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxopeningelement;
	        this.name = name;
	        this.selfclosing = selfclosing;
	        this.attributes = attributes;
	    }
	    return jsxopeningelement;
	}());
	exports.jsxopeningelement = jsxopeningelement;
	var jsxspreadattribute = (function () {
	    function jsxspreadattribute(argument) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxspreadattribute;
	        this.argument = argument;
	    }
	    return jsxspreadattribute;
	}());
	exports.jsxspreadattribute = jsxspreadattribute;
	var jsxtext = (function () {
	    function jsxtext(value, raw) {
	        this.type = jsx_syntax_1.jsxsyntax.jsxtext;
	        this.value = value;
	        this.raw = raw;
	    }
	    return jsxtext;
	}());
	exports.jsxtext = jsxtext;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	exports.jsxsyntax = {
	    jsxattribute: 'jsxattribute',
	    jsxclosingelement: 'jsxclosingelement',
	    jsxelement: 'jsxelement',
	    jsxemptyexpression: 'jsxemptyexpression',
	    jsxexpressioncontainer: 'jsxexpressioncontainer',
	    jsxidentifier: 'jsxidentifier',
	    jsxmemberexpression: 'jsxmemberexpression',
	    jsxnamespacedname: 'jsxnamespacedname',
	    jsxopeningelement: 'jsxopeningelement',
	    jsxspreadattribute: 'jsxspreadattribute',
	    jsxtext: 'jsxtext'
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	var syntax_1 = __webpack_require__(2);
	/* tslint:disable:max-classes-per-file */
	var arrayexpression = (function () {
	    function arrayexpression(elements) {
	        this.type = syntax_1.syntax.arrayexpression;
	        this.elements = elements;
	    }
	    return arrayexpression;
	}());
	exports.arrayexpression = arrayexpression;
	var arraypattern = (function () {
	    function arraypattern(elements) {
	        this.type = syntax_1.syntax.arraypattern;
	        this.elements = elements;
	    }
	    return arraypattern;
	}());
	exports.arraypattern = arraypattern;
	var arrowfunctionexpression = (function () {
	    function arrowfunctionexpression(params, body, expression) {
	        this.type = syntax_1.syntax.arrowfunctionexpression;
	        this.id = null;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = expression;
	        this.async = false;
	    }
	    return arrowfunctionexpression;
	}());
	exports.arrowfunctionexpression = arrowfunctionexpression;
	var assignmentexpression = (function () {
	    function assignmentexpression(operator, left, right) {
	        this.type = syntax_1.syntax.assignmentexpression;
	        this.operator = operator;
	        this.left = left;
	        this.right = right;
	    }
	    return assignmentexpression;
	}());
	exports.assignmentexpression = assignmentexpression;
	var assignmentpattern = (function () {
	    function assignmentpattern(left, right) {
	        this.type = syntax_1.syntax.assignmentpattern;
	        this.left = left;
	        this.right = right;
	    }
	    return assignmentpattern;
	}());
	exports.assignmentpattern = assignmentpattern;
	var asyncarrowfunctionexpression = (function () {
	    function asyncarrowfunctionexpression(params, body, expression) {
	        this.type = syntax_1.syntax.arrowfunctionexpression;
	        this.id = null;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = expression;
	        this.async = true;
	    }
	    return asyncarrowfunctionexpression;
	}());
	exports.asyncarrowfunctionexpression = asyncarrowfunctionexpression;
	var asyncfunctiondeclaration = (function () {
	    function asyncfunctiondeclaration(id, params, body) {
	        this.type = syntax_1.syntax.functiondeclaration;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = false;
	        this.async = true;
	    }
	    return asyncfunctiondeclaration;
	}());
	exports.asyncfunctiondeclaration = asyncfunctiondeclaration;
	var asyncfunctionexpression = (function () {
	    function asyncfunctionexpression(id, params, body) {
	        this.type = syntax_1.syntax.functionexpression;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = false;
	        this.async = true;
	    }
	    return asyncfunctionexpression;
	}());
	exports.asyncfunctionexpression = asyncfunctionexpression;
	var awaitexpression = (function () {
	    function awaitexpression(argument) {
	        this.type = syntax_1.syntax.awaitexpression;
	        this.argument = argument;
	    }
	    return awaitexpression;
	}());
	exports.awaitexpression = awaitexpression;
	var binaryexpression = (function () {
	    function binaryexpression(operator, left, right) {
	        var logical = (operator === '||' || operator === '&&');
	        this.type = logical ? syntax_1.syntax.logicalexpression : syntax_1.syntax.binaryexpression;
	        this.operator = operator;
	        this.left = left;
	        this.right = right;
	    }
	    return binaryexpression;
	}());
	exports.binaryexpression = binaryexpression;
	var blockstatement = (function () {
	    function blockstatement(body) {
	        this.type = syntax_1.syntax.blockstatement;
	        this.body = body;
	    }
	    return blockstatement;
	}());
	exports.blockstatement = blockstatement;
	var breakstatement = (function () {
	    function breakstatement(label) {
	        this.type = syntax_1.syntax.breakstatement;
	        this.label = label;
	    }
	    return breakstatement;
	}());
	exports.breakstatement = breakstatement;
	var callexpression = (function () {
	    function callexpression(callee, args) {
	        this.type = syntax_1.syntax.callexpression;
	        this.callee = callee;
	        this.arguments = args;
	    }
	    return callexpression;
	}());
	exports.callexpression = callexpression;
	var catchclause = (function () {
	    function catchclause(param, body) {
	        this.type = syntax_1.syntax.catchclause;
	        this.param = param;
	        this.body = body;
	    }
	    return catchclause;
	}());
	exports.catchclause = catchclause;
	var classbody = (function () {
	    function classbody(body) {
	        this.type = syntax_1.syntax.classbody;
	        this.body = body;
	    }
	    return classbody;
	}());
	exports.classbody = classbody;
	var classdeclaration = (function () {
	    function classdeclaration(id, superclass, body) {
	        this.type = syntax_1.syntax.classdeclaration;
	        this.id = id;
	        this.superclass = superclass;
	        this.body = body;
	    }
	    return classdeclaration;
	}());
	exports.classdeclaration = classdeclaration;
	var classexpression = (function () {
	    function classexpression(id, superclass, body) {
	        this.type = syntax_1.syntax.classexpression;
	        this.id = id;
	        this.superclass = superclass;
	        this.body = body;
	    }
	    return classexpression;
	}());
	exports.classexpression = classexpression;
	var computedmemberexpression = (function () {
	    function computedmemberexpression(object, property) {
	        this.type = syntax_1.syntax.memberexpression;
	        this.computed = true;
	        this.object = object;
	        this.property = property;
	    }
	    return computedmemberexpression;
	}());
	exports.computedmemberexpression = computedmemberexpression;
	var conditionalexpression = (function () {
	    function conditionalexpression(test, consequent, alternate) {
	        this.type = syntax_1.syntax.conditionalexpression;
	        this.test = test;
	        this.consequent = consequent;
	        this.alternate = alternate;
	    }
	    return conditionalexpression;
	}());
	exports.conditionalexpression = conditionalexpression;
	var continuestatement = (function () {
	    function continuestatement(label) {
	        this.type = syntax_1.syntax.continuestatement;
	        this.label = label;
	    }
	    return continuestatement;
	}());
	exports.continuestatement = continuestatement;
	var debuggerstatement = (function () {
	    function debuggerstatement() {
	        this.type = syntax_1.syntax.debuggerstatement;
	    }
	    return debuggerstatement;
	}());
	exports.debuggerstatement = debuggerstatement;
	var directive = (function () {
	    function directive(expression, directive) {
	        this.type = syntax_1.syntax.expressionstatement;
	        this.expression = expression;
	        this.directive = directive;
	    }
	    return directive;
	}());
	exports.directive = directive;
	var dowhilestatement = (function () {
	    function dowhilestatement(body, test) {
	        this.type = syntax_1.syntax.dowhilestatement;
	        this.body = body;
	        this.test = test;
	    }
	    return dowhilestatement;
	}());
	exports.dowhilestatement = dowhilestatement;
	var emptystatement = (function () {
	    function emptystatement() {
	        this.type = syntax_1.syntax.emptystatement;
	    }
	    return emptystatement;
	}());
	exports.emptystatement = emptystatement;
	var exportalldeclaration = (function () {
	    function exportalldeclaration(source) {
	        this.type = syntax_1.syntax.exportalldeclaration;
	        this.source = source;
	    }
	    return exportalldeclaration;
	}());
	exports.exportalldeclaration = exportalldeclaration;
	var exportdefaultdeclaration = (function () {
	    function exportdefaultdeclaration(declaration) {
	        this.type = syntax_1.syntax.exportdefaultdeclaration;
	        this.declaration = declaration;
	    }
	    return exportdefaultdeclaration;
	}());
	exports.exportdefaultdeclaration = exportdefaultdeclaration;
	var exportnameddeclaration = (function () {
	    function exportnameddeclaration(declaration, specifiers, source) {
	        this.type = syntax_1.syntax.exportnameddeclaration;
	        this.declaration = declaration;
	        this.specifiers = specifiers;
	        this.source = source;
	    }
	    return exportnameddeclaration;
	}());
	exports.exportnameddeclaration = exportnameddeclaration;
	var exportspecifier = (function () {
	    function exportspecifier(local, exported) {
	        this.type = syntax_1.syntax.exportspecifier;
	        this.exported = exported;
	        this.local = local;
	    }
	    return exportspecifier;
	}());
	exports.exportspecifier = exportspecifier;
	var expressionstatement = (function () {
	    function expressionstatement(expression) {
	        this.type = syntax_1.syntax.expressionstatement;
	        this.expression = expression;
	    }
	    return expressionstatement;
	}());
	exports.expressionstatement = expressionstatement;
	var forinstatement = (function () {
	    function forinstatement(left, right, body) {
	        this.type = syntax_1.syntax.forinstatement;
	        this.left = left;
	        this.right = right;
	        this.body = body;
	        this.each = false;
	    }
	    return forinstatement;
	}());
	exports.forinstatement = forinstatement;
	var forofstatement = (function () {
	    function forofstatement(left, right, body) {
	        this.type = syntax_1.syntax.forofstatement;
	        this.left = left;
	        this.right = right;
	        this.body = body;
	    }
	    return forofstatement;
	}());
	exports.forofstatement = forofstatement;
	var forstatement = (function () {
	    function forstatement(init, test, update, body) {
	        this.type = syntax_1.syntax.forstatement;
	        this.init = init;
	        this.test = test;
	        this.update = update;
	        this.body = body;
	    }
	    return forstatement;
	}());
	exports.forstatement = forstatement;
	var functiondeclaration = (function () {
	    function functiondeclaration(id, params, body, generator) {
	        this.type = syntax_1.syntax.functiondeclaration;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = generator;
	        this.expression = false;
	        this.async = false;
	    }
	    return functiondeclaration;
	}());
	exports.functiondeclaration = functiondeclaration;
	var functionexpression = (function () {
	    function functionexpression(id, params, body, generator) {
	        this.type = syntax_1.syntax.functionexpression;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = generator;
	        this.expression = false;
	        this.async = false;
	    }
	    return functionexpression;
	}());
	exports.functionexpression = functionexpression;
	var identifier = (function () {
	    function identifier(name) {
	        this.type = syntax_1.syntax.identifier;
	        this.name = name;
	    }
	    return identifier;
	}());
	exports.identifier = identifier;
	var ifstatement = (function () {
	    function ifstatement(test, consequent, alternate) {
	        this.type = syntax_1.syntax.ifstatement;
	        this.test = test;
	        this.consequent = consequent;
	        this.alternate = alternate;
	    }
	    return ifstatement;
	}());
	exports.ifstatement = ifstatement;
	var importdeclaration = (function () {
	    function importdeclaration(specifiers, source) {
	        this.type = syntax_1.syntax.importdeclaration;
	        this.specifiers = specifiers;
	        this.source = source;
	    }
	    return importdeclaration;
	}());
	exports.importdeclaration = importdeclaration;
	var importdefaultspecifier = (function () {
	    function importdefaultspecifier(local) {
	        this.type = syntax_1.syntax.importdefaultspecifier;
	        this.local = local;
	    }
	    return importdefaultspecifier;
	}());
	exports.importdefaultspecifier = importdefaultspecifier;
	var importnamespacespecifier = (function () {
	    function importnamespacespecifier(local) {
	        this.type = syntax_1.syntax.importnamespacespecifier;
	        this.local = local;
	    }
	    return importnamespacespecifier;
	}());
	exports.importnamespacespecifier = importnamespacespecifier;
	var importspecifier = (function () {
	    function importspecifier(local, imported) {
	        this.type = syntax_1.syntax.importspecifier;
	        this.local = local;
	        this.imported = imported;
	    }
	    return importspecifier;
	}());
	exports.importspecifier = importspecifier;
	var labeledstatement = (function () {
	    function labeledstatement(label, body) {
	        this.type = syntax_1.syntax.labeledstatement;
	        this.label = label;
	        this.body = body;
	    }
	    return labeledstatement;
	}());
	exports.labeledstatement = labeledstatement;
	var literal = (function () {
	    function literal(value, raw) {
	        this.type = syntax_1.syntax.literal;
	        this.value = value;
	        this.raw = raw;
	    }
	    return literal;
	}());
	exports.literal = literal;
	var metaproperty = (function () {
	    function metaproperty(meta, property) {
	        this.type = syntax_1.syntax.metaproperty;
	        this.meta = meta;
	        this.property = property;
	    }
	    return metaproperty;
	}());
	exports.metaproperty = metaproperty;
	var methoddefinition = (function () {
	    function methoddefinition(key, computed, value, kind, isstatic) {
	        this.type = syntax_1.syntax.methoddefinition;
	        this.key = key;
	        this.computed = computed;
	        this.value = value;
	        this.kind = kind;
	        this.static = isstatic;
	    }
	    return methoddefinition;
	}());
	exports.methoddefinition = methoddefinition;
	var module = (function () {
	    function module(body) {
	        this.type = syntax_1.syntax.program;
	        this.body = body;
	        this.sourcetype = 'module';
	    }
	    return module;
	}());
	exports.module = module;
	var newexpression = (function () {
	    function newexpression(callee, args) {
	        this.type = syntax_1.syntax.newexpression;
	        this.callee = callee;
	        this.arguments = args;
	    }
	    return newexpression;
	}());
	exports.newexpression = newexpression;
	var objectexpression = (function () {
	    function objectexpression(properties) {
	        this.type = syntax_1.syntax.objectexpression;
	        this.properties = properties;
	    }
	    return objectexpression;
	}());
	exports.objectexpression = objectexpression;
	var objectpattern = (function () {
	    function objectpattern(properties) {
	        this.type = syntax_1.syntax.objectpattern;
	        this.properties = properties;
	    }
	    return objectpattern;
	}());
	exports.objectpattern = objectpattern;
	var property = (function () {
	    function property(kind, key, computed, value, method, shorthand) {
	        this.type = syntax_1.syntax.property;
	        this.key = key;
	        this.computed = computed;
	        this.value = value;
	        this.kind = kind;
	        this.method = method;
	        this.shorthand = shorthand;
	    }
	    return property;
	}());
	exports.property = property;
	var regexliteral = (function () {
	    function regexliteral(value, raw, pattern, flags) {
	        this.type = syntax_1.syntax.literal;
	        this.value = value;
	        this.raw = raw;
	        this.regex = { pattern: pattern, flags: flags };
	    }
	    return regexliteral;
	}());
	exports.regexliteral = regexliteral;
	var restelement = (function () {
	    function restelement(argument) {
	        this.type = syntax_1.syntax.restelement;
	        this.argument = argument;
	    }
	    return restelement;
	}());
	exports.restelement = restelement;
	var returnstatement = (function () {
	    function returnstatement(argument) {
	        this.type = syntax_1.syntax.returnstatement;
	        this.argument = argument;
	    }
	    return returnstatement;
	}());
	exports.returnstatement = returnstatement;
	var script = (function () {
	    function script(body) {
	        this.type = syntax_1.syntax.program;
	        this.body = body;
	        this.sourcetype = 'script';
	    }
	    return script;
	}());
	exports.script = script;
	var sequenceexpression = (function () {
	    function sequenceexpression(expressions) {
	        this.type = syntax_1.syntax.sequenceexpression;
	        this.expressions = expressions;
	    }
	    return sequenceexpression;
	}());
	exports.sequenceexpression = sequenceexpression;
	var spreadelement = (function () {
	    function spreadelement(argument) {
	        this.type = syntax_1.syntax.spreadelement;
	        this.argument = argument;
	    }
	    return spreadelement;
	}());
	exports.spreadelement = spreadelement;
	var staticmemberexpression = (function () {
	    function staticmemberexpression(object, property) {
	        this.type = syntax_1.syntax.memberexpression;
	        this.computed = false;
	        this.object = object;
	        this.property = property;
	    }
	    return staticmemberexpression;
	}());
	exports.staticmemberexpression = staticmemberexpression;
	var super = (function () {
	    function super() {
	        this.type = syntax_1.syntax.super;
	    }
	    return super;
	}());
	exports.super = super;
	var switchcase = (function () {
	    function switchcase(test, consequent) {
	        this.type = syntax_1.syntax.switchcase;
	        this.test = test;
	        this.consequent = consequent;
	    }
	    return switchcase;
	}());
	exports.switchcase = switchcase;
	var switchstatement = (function () {
	    function switchstatement(discriminant, cases) {
	        this.type = syntax_1.syntax.switchstatement;
	        this.discriminant = discriminant;
	        this.cases = cases;
	    }
	    return switchstatement;
	}());
	exports.switchstatement = switchstatement;
	var taggedtemplateexpression = (function () {
	    function taggedtemplateexpression(tag, quasi) {
	        this.type = syntax_1.syntax.taggedtemplateexpression;
	        this.tag = tag;
	        this.quasi = quasi;
	    }
	    return taggedtemplateexpression;
	}());
	exports.taggedtemplateexpression = taggedtemplateexpression;
	var templateelement = (function () {
	    function templateelement(value, tail) {
	        this.type = syntax_1.syntax.templateelement;
	        this.value = value;
	        this.tail = tail;
	    }
	    return templateelement;
	}());
	exports.templateelement = templateelement;
	var templateliteral = (function () {
	    function templateliteral(quasis, expressions) {
	        this.type = syntax_1.syntax.templateliteral;
	        this.quasis = quasis;
	        this.expressions = expressions;
	    }
	    return templateliteral;
	}());
	exports.templateliteral = templateliteral;
	var thisexpression = (function () {
	    function thisexpression() {
	        this.type = syntax_1.syntax.thisexpression;
	    }
	    return thisexpression;
	}());
	exports.thisexpression = thisexpression;
	var throwstatement = (function () {
	    function throwstatement(argument) {
	        this.type = syntax_1.syntax.throwstatement;
	        this.argument = argument;
	    }
	    return throwstatement;
	}());
	exports.throwstatement = throwstatement;
	var trystatement = (function () {
	    function trystatement(block, handler, finalizer) {
	        this.type = syntax_1.syntax.trystatement;
	        this.block = block;
	        this.handler = handler;
	        this.finalizer = finalizer;
	    }
	    return trystatement;
	}());
	exports.trystatement = trystatement;
	var unaryexpression = (function () {
	    function unaryexpression(operator, argument) {
	        this.type = syntax_1.syntax.unaryexpression;
	        this.operator = operator;
	        this.argument = argument;
	        this.prefix = true;
	    }
	    return unaryexpression;
	}());
	exports.unaryexpression = unaryexpression;
	var updateexpression = (function () {
	    function updateexpression(operator, argument, prefix) {
	        this.type = syntax_1.syntax.updateexpression;
	        this.operator = operator;
	        this.argument = argument;
	        this.prefix = prefix;
	    }
	    return updateexpression;
	}());
	exports.updateexpression = updateexpression;
	var variabledeclaration = (function () {
	    function variabledeclaration(declarations, kind) {
	        this.type = syntax_1.syntax.variabledeclaration;
	        this.declarations = declarations;
	        this.kind = kind;
	    }
	    return variabledeclaration;
	}());
	exports.variabledeclaration = variabledeclaration;
	var variabledeclarator = (function () {
	    function variabledeclarator(id, init) {
	        this.type = syntax_1.syntax.variabledeclarator;
	        this.id = id;
	        this.init = init;
	    }
	    return variabledeclarator;
	}());
	exports.variabledeclarator = variabledeclarator;
	var whilestatement = (function () {
	    function whilestatement(test, body) {
	        this.type = syntax_1.syntax.whilestatement;
	        this.test = test;
	        this.body = body;
	    }
	    return whilestatement;
	}());
	exports.whilestatement = whilestatement;
	var withstatement = (function () {
	    function withstatement(object, body) {
	        this.type = syntax_1.syntax.withstatement;
	        this.object = object;
	        this.body = body;
	    }
	    return withstatement;
	}());
	exports.withstatement = withstatement;
	var yieldexpression = (function () {
	    function yieldexpression(argument, delegate) {
	        this.type = syntax_1.syntax.yieldexpression;
	        this.argument = argument;
	        this.delegate = delegate;
	    }
	    return yieldexpression;
	}());
	exports.yieldexpression = yieldexpression;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	var assert_1 = __webpack_require__(9);
	var error_handler_1 = __webpack_require__(10);
	var messages_1 = __webpack_require__(11);
	var node = __webpack_require__(7);
	var scanner_1 = __webpack_require__(12);
	var syntax_1 = __webpack_require__(2);
	var token_1 = __webpack_require__(13);
	var arrowparameterplaceholder = 'arrowparameterplaceholder';
	var parser = (function () {
	    function parser(code, options, delegate) {
	        if (options === void 0) { options = {}; }
	        this.config = {
	            range: (typeof options.range === 'boolean') && options.range,
	            loc: (typeof options.loc === 'boolean') && options.loc,
	            source: null,
	            tokens: (typeof options.tokens === 'boolean') && options.tokens,
	            comment: (typeof options.comment === 'boolean') && options.comment,
	            tolerant: (typeof options.tolerant === 'boolean') && options.tolerant
	        };
	        if (this.config.loc && options.source && options.source !== null) {
	            this.config.source = string(options.source);
	        }
	        this.delegate = delegate;
	        this.errorhandler = new error_handler_1.errorhandler();
	        this.errorhandler.tolerant = this.config.tolerant;
	        this.scanner = new scanner_1.scanner(code, this.errorhandler);
	        this.scanner.trackcomment = this.config.comment;
	        this.operatorprecedence = {
	            ')': 0,
	            ';': 0,
	            ',': 0,
	            '=': 0,
	            ']': 0,
	            '||': 1,
	            '&&': 2,
	            '|': 3,
	            '^': 4,
	            '&': 5,
	            '==': 6,
	            '!=': 6,
	            '===': 6,
	            '!==': 6,
	            '<': 7,
	            '>': 7,
	            '<=': 7,
	            '>=': 7,
	            '<<': 8,
	            '>>': 8,
	            '>>>': 8,
	            '+': 9,
	            '-': 9,
	            '*': 11,
	            '/': 11,
	            '%': 11
	        };
	        this.lookahead = {
	            type: 2 /* eof */,
	            value: '',
	            linenumber: this.scanner.linenumber,
	            linestart: 0,
	            start: 0,
	            end: 0
	        };
	        this.haslineterminator = false;
	        this.context = {
	            ismodule: false,
	            await: false,
	            allowin: true,
	            allowstrictdirective: true,
	            allowyield: true,
	            firstcoverinitializednameerror: null,
	            isassignmenttarget: false,
	            isbindingelement: false,
	            infunctionbody: false,
	            initeration: false,
	            inswitch: false,
	            labelset: {},
	            strict: false
	        };
	        this.tokens = [];
	        this.startmarker = {
	            index: 0,
	            line: this.scanner.linenumber,
	            column: 0
	        };
	        this.lastmarker = {
	            index: 0,
	            line: this.scanner.linenumber,
	            column: 0
	        };
	        this.nexttoken();
	        this.lastmarker = {
	            index: this.scanner.index,
	            line: this.scanner.linenumber,
	            column: this.scanner.index - this.scanner.linestart
	        };
	    }
	    parser.prototype.throwerror = function (messageformat) {
	        var values = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            values[_i - 1] = arguments[_i];
	        }
	        var args = array.prototype.slice.call(arguments, 1);
	        var msg = messageformat.replace(/%(\d)/g, function (whole, idx) {
	            assert_1.assert(idx < args.length, 'message reference must be in range');
	            return args[idx];
	        });
	        var index = this.lastmarker.index;
	        var line = this.lastmarker.line;
	        var column = this.lastmarker.column + 1;
	        throw this.errorhandler.createerror(index, line, column, msg);
	    };
	    parser.prototype.tolerateerror = function (messageformat) {
	        var values = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            values[_i - 1] = arguments[_i];
	        }
	        var args = array.prototype.slice.call(arguments, 1);
	        var msg = messageformat.replace(/%(\d)/g, function (whole, idx) {
	            assert_1.assert(idx < args.length, 'message reference must be in range');
	            return args[idx];
	        });
	        var index = this.lastmarker.index;
	        var line = this.scanner.linenumber;
	        var column = this.lastmarker.column + 1;
	        this.errorhandler.tolerateerror(index, line, column, msg);
	    };
	    // throw an exception because of the token.
	    parser.prototype.unexpectedtokenerror = function (token, message) {
	        var msg = message || messages_1.messages.unexpectedtoken;
	        var value;
	        if (token) {
	            if (!message) {
	                msg = (token.type === 2 /* eof */) ? messages_1.messages.unexpectedeos :
	                    (token.type === 3 /* identifier */) ? messages_1.messages.unexpectedidentifier :
	                        (token.type === 6 /* numericliteral */) ? messages_1.messages.unexpectednumber :
	                            (token.type === 8 /* stringliteral */) ? messages_1.messages.unexpectedstring :
	                                (token.type === 10 /* template */) ? messages_1.messages.unexpectedtemplate :
	                                    messages_1.messages.unexpectedtoken;
	                if (token.type === 4 /* keyword */) {
	                    if (this.scanner.isfuturereservedword(token.value)) {
	                        msg = messages_1.messages.unexpectedreserved;
	                    }
	                    else if (this.context.strict && this.scanner.isstrictmodereservedword(token.value)) {
	                        msg = messages_1.messages.strictreservedword;
	                    }
	                }
	            }
	            value = token.value;
	        }
	        else {
	            value = 'illegal';
	        }
	        msg = msg.replace('%0', value);
	        if (token && typeof token.linenumber === 'number') {
	            var index = token.start;
	            var line = token.linenumber;
	            var lastmarkerlinestart = this.lastmarker.index - this.lastmarker.column;
	            var column = token.start - lastmarkerlinestart + 1;
	            return this.errorhandler.createerror(index, line, column, msg);
	        }
	        else {
	            var index = this.lastmarker.index;
	            var line = this.lastmarker.line;
	            var column = this.lastmarker.column + 1;
	            return this.errorhandler.createerror(index, line, column, msg);
	        }
	    };
	    parser.prototype.throwunexpectedtoken = function (token, message) {
	        throw this.unexpectedtokenerror(token, message);
	    };
	    parser.prototype.tolerateunexpectedtoken = function (token, message) {
	        this.errorhandler.tolerate(this.unexpectedtokenerror(token, message));
	    };
	    parser.prototype.collectcomments = function () {
	        if (!this.config.comment) {
	            this.scanner.scancomments();
	        }
	        else {
	            var comments = this.scanner.scancomments();
	            if (comments.length > 0 && this.delegate) {
	                for (var i = 0; i < comments.length; ++i) {
	                    var e = comments[i];
	                    var node = void 0;
	                    node = {
	                        type: e.multiline ? 'blockcomment' : 'linecomment',
	                        value: this.scanner.source.slice(e.slice[0], e.slice[1])
	                    };
	                    if (this.config.range) {
	                        node.range = e.range;
	                    }
	                    if (this.config.loc) {
	                        node.loc = e.loc;
	                    }
	                    var metadata = {
	                        start: {
	                            line: e.loc.start.line,
	                            column: e.loc.start.column,
	                            offset: e.range[0]
	                        },
	                        end: {
	                            line: e.loc.end.line,
	                            column: e.loc.end.column,
	                            offset: e.range[1]
	                        }
	                    };
	                    this.delegate(node, metadata);
	                }
	            }
	        }
	    };
	    // from internal representation to an external structure
	    parser.prototype.gettokenraw = function (token) {
	        return this.scanner.source.slice(token.start, token.end);
	    };
	    parser.prototype.converttoken = function (token) {
	        var t = {
	            type: token_1.tokenname[token.type],
	            value: this.gettokenraw(token)
	        };
	        if (this.config.range) {
	            t.range = [token.start, token.end];
	        }
	        if (this.config.loc) {
	            t.loc = {
	                start: {
	                    line: this.startmarker.line,
	                    column: this.startmarker.column
	                },
	                end: {
	                    line: this.scanner.linenumber,
	                    column: this.scanner.index - this.scanner.linestart
	                }
	            };
	        }
	        if (token.type === 9 /* regularexpression */) {
	            var pattern = token.pattern;
	            var flags = token.flags;
	            t.regex = { pattern: pattern, flags: flags };
	        }
	        return t;
	    };
	    parser.prototype.nexttoken = function () {
	        var token = this.lookahead;
	        this.lastmarker.index = this.scanner.index;
	        this.lastmarker.line = this.scanner.linenumber;
	        this.lastmarker.column = this.scanner.index - this.scanner.linestart;
	        this.collectcomments();
	        if (this.scanner.index !== this.startmarker.index) {
	            this.startmarker.index = this.scanner.index;
	            this.startmarker.line = this.scanner.linenumber;
	            this.startmarker.column = this.scanner.index - this.scanner.linestart;
	        }
	        var next = this.scanner.lex();
	        this.haslineterminator = (token.linenumber !== next.linenumber);
	        if (next && this.context.strict && next.type === 3 /* identifier */) {
	            if (this.scanner.isstrictmodereservedword(next.value)) {
	                next.type = 4 /* keyword */;
	            }
	        }
	        this.lookahead = next;
	        if (this.config.tokens && next.type !== 2 /* eof */) {
	            this.tokens.push(this.converttoken(next));
	        }
	        return token;
	    };
	    parser.prototype.nextregextoken = function () {
	        this.collectcomments();
	        var token = this.scanner.scanregexp();
	        if (this.config.tokens) {
	            // pop the previous token, '/' or '/='
	            // this is added from the lookahead token.
	            this.tokens.pop();
	            this.tokens.push(this.converttoken(token));
	        }
	        // prime the next lookahead.
	        this.lookahead = token;
	        this.nexttoken();
	        return token;
	    };
	    parser.prototype.createnode = function () {
	        return {
	            index: this.startmarker.index,
	            line: this.startmarker.line,
	            column: this.startmarker.column
	        };
	    };
	    parser.prototype.startnode = function (token) {
	        return {
	            index: token.start,
	            line: token.linenumber,
	            column: token.start - token.linestart
	        };
	    };
	    parser.prototype.finalize = function (marker, node) {
	        if (this.config.range) {
	            node.range = [marker.index, this.lastmarker.index];
	        }
	        if (this.config.loc) {
	            node.loc = {
	                start: {
	                    line: marker.line,
	                    column: marker.column,
	                },
	                end: {
	                    line: this.lastmarker.line,
	                    column: this.lastmarker.column
	                }
	            };
	            if (this.config.source) {
	                node.loc.source = this.config.source;
	            }
	        }
	        if (this.delegate) {
	            var metadata = {
	                start: {
	                    line: marker.line,
	                    column: marker.column,
	                    offset: marker.index
	                },
	                end: {
	                    line: this.lastmarker.line,
	                    column: this.lastmarker.column,
	                    offset: this.lastmarker.index
	                }
	            };
	            this.delegate(node, metadata);
	        }
	        return node;
	    };
	    // expect the next token to match the specified punctuator.
	    // if not, an exception will be thrown.
	    parser.prototype.expect = function (value) {
	        var token = this.nexttoken();
	        if (token.type !== 7 /* punctuator */ || token.value !== value) {
	            this.throwunexpectedtoken(token);
	        }
	    };
	    // quietly expect a comma when in tolerant mode, otherwise delegates to expect().
	    parser.prototype.expectcommaseparator = function () {
	        if (this.config.tolerant) {
	            var token = this.lookahead;
	            if (token.type === 7 /* punctuator */ && token.value === ',') {
	                this.nexttoken();
	            }
	            else if (token.type === 7 /* punctuator */ && token.value === ';') {
	                this.nexttoken();
	                this.tolerateunexpectedtoken(token);
	            }
	            else {
	                this.tolerateunexpectedtoken(token, messages_1.messages.unexpectedtoken);
	            }
	        }
	        else {
	            this.expect(',');
	        }
	    };
	    // expect the next token to match the specified keyword.
	    // if not, an exception will be thrown.
	    parser.prototype.expectkeyword = function (keyword) {
	        var token = this.nexttoken();
	        if (token.type !== 4 /* keyword */ || token.value !== keyword) {
	            this.throwunexpectedtoken(token);
	        }
	    };
	    // return true if the next token matches the specified punctuator.
	    parser.prototype.match = function (value) {
	        return this.lookahead.type === 7 /* punctuator */ && this.lookahead.value === value;
	    };
	    // return true if the next token matches the specified keyword
	    parser.prototype.matchkeyword = function (keyword) {
	        return this.lookahead.type === 4 /* keyword */ && this.lookahead.value === keyword;
	    };
	    // return true if the next token matches the specified contextual keyword
	    // (where an identifier is sometimes a keyword depending on the context)
	    parser.prototype.matchcontextualkeyword = function (keyword) {
	        return this.lookahead.type === 3 /* identifier */ && this.lookahead.value === keyword;
	    };
	    // return true if the next token is an assignment operator
	    parser.prototype.matchassign = function () {
	        if (this.lookahead.type !== 7 /* punctuator */) {
	            return false;
	        }
	        var op = this.lookahead.value;
	        return op === '=' ||
	            op === '*=' ||
	            op === '**=' ||
	            op === '/=' ||
	            op === '%=' ||
	            op === '+=' ||
	            op === '-=' ||
	            op === '<<=' ||
	            op === '>>=' ||
	            op === '>>>=' ||
	            op === '&=' ||
	            op === '^=' ||
	            op === '|=';
	    };
	    // cover grammar support.
	    //
	    // when an assignment expression position starts with an left parenthesis, the determination of the type
	    // of the syntax is to be deferred arbitrarily long until the end of the parentheses pair (plus a lookahead)
	    // or the first comma. this situation also defers the determination of all the expressions nested in the pair.
	    //
	    // there are three productions that can be parsed in a parentheses pair that needs to be determined
	    // after the outermost pair is closed. they are:
	    //
	    //   1. assignmentexpression
	    //   2. bindingelements
	    //   3. assignmenttargets
	    //
	    // in order to avoid exponential backtracking, we use two flags to denote if the production can be
	    // binding element or assignment target.
	    //
	    // the three productions have the relationship:
	    //
	    //   bindingelements ⚆ assignmenttargets ⚆ assignmentexpression
	    //
	    // with a single exception that coverinitializedname when used directly in an expression, generates
	    // an early error. therefore, we need the third state, firstcoverinitializednameerror, to track the
	    // first usage of coverinitializedname and report it when we reached the end of the parentheses pair.
	    //
	    // isolatecovergrammar function runs the given parser function with a new cover grammar context, and it does not
	    // effect the current flags. this means the production the parser parses is only used as an expression. therefore
	    // the coverinitializedname check is conducted.
	    //
	    // inheritcovergrammar function runs the given parse function with a new cover grammar context, and it propagates
	    // the flags outside of the parser. this means the production the parser parses is used as a part of a potential
	    // pattern. the coverinitializedname check is deferred.
	    parser.prototype.isolatecovergrammar = function (parsefunction) {
	        var previousisbindingelement = this.context.isbindingelement;
	        var previousisassignmenttarget = this.context.isassignmenttarget;
	        var previousfirstcoverinitializednameerror = this.context.firstcoverinitializednameerror;
	        this.context.isbindingelement = true;
	        this.context.isassignmenttarget = true;
	        this.context.firstcoverinitializednameerror = null;
	        var result = parsefunction.call(this);
	        if (this.context.firstcoverinitializednameerror !== null) {
	            this.throwunexpectedtoken(this.context.firstcoverinitializednameerror);
	        }
	        this.context.isbindingelement = previousisbindingelement;
	        this.context.isassignmenttarget = previousisassignmenttarget;
	        this.context.firstcoverinitializednameerror = previousfirstcoverinitializednameerror;
	        return result;
	    };
	    parser.prototype.inheritcovergrammar = function (parsefunction) {
	        var previousisbindingelement = this.context.isbindingelement;
	        var previousisassignmenttarget = this.context.isassignmenttarget;
	        var previousfirstcoverinitializednameerror = this.context.firstcoverinitializednameerror;
	        this.context.isbindingelement = true;
	        this.context.isassignmenttarget = true;
	        this.context.firstcoverinitializednameerror = null;
	        var result = parsefunction.call(this);
	        this.context.isbindingelement = this.context.isbindingelement && previousisbindingelement;
	        this.context.isassignmenttarget = this.context.isassignmenttarget && previousisassignmenttarget;
	        this.context.firstcoverinitializednameerror = previousfirstcoverinitializednameerror || this.context.firstcoverinitializednameerror;
	        return result;
	    };
	    parser.prototype.consumesemicolon = function () {
	        if (this.match(';')) {
	            this.nexttoken();
	        }
	        else if (!this.haslineterminator) {
	            if (this.lookahead.type !== 2 /* eof */ && !this.match('}')) {
	                this.throwunexpectedtoken(this.lookahead);
	            }
	            this.lastmarker.index = this.startmarker.index;
	            this.lastmarker.line = this.startmarker.line;
	            this.lastmarker.column = this.startmarker.column;
	        }
	    };
	    // https://tc39.github.io/ecma262/#sec-primary-expression
	    parser.prototype.parseprimaryexpression = function () {
	        var node = this.createnode();
	        var expr;
	        var token, raw;
	        switch (this.lookahead.type) {
	            case 3 /* identifier */:
	                if ((this.context.ismodule || this.context.await) && this.lookahead.value === 'await') {
	                    this.tolerateunexpectedtoken(this.lookahead);
	                }
	                expr = this.matchasyncfunction() ? this.parsefunctionexpression() : this.finalize(node, new node.identifier(this.nexttoken().value));
	                break;
	            case 6 /* numericliteral */:
	            case 8 /* stringliteral */:
	                if (this.context.strict && this.lookahead.octal) {
	                    this.tolerateunexpectedtoken(this.lookahead, messages_1.messages.strictoctalliteral);
	                }
	                this.context.isassignmenttarget = false;
	                this.context.isbindingelement = false;
	                token = this.nexttoken();
	                raw = this.gettokenraw(token);
	                expr = this.finalize(node, new node.literal(token.value, raw));
	                break;
	            case 1 /* booleanliteral */:
	                this.context.isassignmenttarget = false;
	                this.context.isbindingelement = false;
	                token = this.nexttoken();
	                raw = this.gettokenraw(token);
	                expr = this.finalize(node, new node.literal(token.value === 'true', raw));
	                break;
	            case 5 /* nullliteral */:
	                this.context.isassignmenttarget = false;
	                this.context.isbindingelement = false;
	                token = this.nexttoken();
	                raw = this.gettokenraw(token);
	                expr = this.finalize(node, new node.literal(null, raw));
	                break;
	            case 10 /* template */:
	                expr = this.parsetemplateliteral();
	                break;
	            case 7 /* punctuator */:
	                switch (this.lookahead.value) {
	                    case '(':
	                        this.context.isbindingelement = false;
	                        expr = this.inheritcovergrammar(this.parsegroupexpression);
	                        break;
	                    case '[':
	                        expr = this.inheritcovergrammar(this.parsearrayinitializer);
	                        break;
	                    case '{':
	                        expr = this.inheritcovergrammar(this.parseobjectinitializer);
	                        break;
	                    case '/':
	                    case '/=':
	                        this.context.isassignmenttarget = false;
	                        this.context.isbindingelement = false;
	                        this.scanner.index = this.startmarker.index;
	                        token = this.nextregextoken();
	                        raw = this.gettokenraw(token);
	                        expr = this.finalize(node, new node.regexliteral(token.regex, raw, token.pattern, token.flags));
	                        break;
	                    default:
	                        expr = this.throwunexpectedtoken(this.nexttoken());
	                }
	                break;
	            case 4 /* keyword */:
	                if (!this.context.strict && this.context.allowyield && this.matchkeyword('yield')) {
	                    expr = this.parseidentifiername();
	                }
	                else if (!this.context.strict && this.matchkeyword('let')) {
	                    expr = this.finalize(node, new node.identifier(this.nexttoken().value));
	                }
	                else {
	                    this.context.isassignmenttarget = false;
	                    this.context.isbindingelement = false;
	                    if (this.matchkeyword('function')) {
	                        expr = this.parsefunctionexpression();
	                    }
	                    else if (this.matchkeyword('this')) {
	                        this.nexttoken();
	                        expr = this.finalize(node, new node.thisexpression());
	                    }
	                    else if (this.matchkeyword('class')) {
	                        expr = this.parseclassexpression();
	                    }
	                    else {
	                        expr = this.throwunexpectedtoken(this.nexttoken());
	                    }
	                }
	                break;
	            default:
	                expr = this.throwunexpectedtoken(this.nexttoken());
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-array-initializer
	    parser.prototype.parsespreadelement = function () {
	        var node = this.createnode();
	        this.expect('...');
	        var arg = this.inheritcovergrammar(this.parseassignmentexpression);
	        return this.finalize(node, new node.spreadelement(arg));
	    };
	    parser.prototype.parsearrayinitializer = function () {
	        var node = this.createnode();
	        var elements = [];
	        this.expect('[');
	        while (!this.match(']')) {
	            if (this.match(',')) {
	                this.nexttoken();
	                elements.push(null);
	            }
	            else if (this.match('...')) {
	                var element = this.parsespreadelement();
	                if (!this.match(']')) {
	                    this.context.isassignmenttarget = false;
	                    this.context.isbindingelement = false;
	                    this.expect(',');
	                }
	                elements.push(element);
	            }
	            else {
	                elements.push(this.inheritcovergrammar(this.parseassignmentexpression));
	                if (!this.match(']')) {
	                    this.expect(',');
	                }
	            }
	        }
	        this.expect(']');
	        return this.finalize(node, new node.arrayexpression(elements));
	    };
	    // https://tc39.github.io/ecma262/#sec-object-initializer
	    parser.prototype.parsepropertymethod = function (params) {
	        this.context.isassignmenttarget = false;
	        this.context.isbindingelement = false;
	        var previousstrict = this.context.strict;
	        var previousallowstrictdirective = this.context.allowstrictdirective;
	        this.context.allowstrictdirective = params.simple;
	        var body = this.isolatecovergrammar(this.parsefunctionsourceelements);
	        if (this.context.strict && params.firstrestricted) {
	            this.tolerateunexpectedtoken(params.firstrestricted, params.message);
	        }
	        if (this.context.strict && params.stricted) {
	            this.tolerateunexpectedtoken(params.stricted, params.message);
	        }
	        this.context.strict = previousstrict;
	        this.context.allowstrictdirective = previousallowstrictdirective;
	        return body;
	    };
	    parser.prototype.parsepropertymethodfunction = function () {
	        var isgenerator = false;
	        var node = this.createnode();
	        var previousallowyield = this.context.allowyield;
	        this.context.allowyield = false;
	        var params = this.parseformalparameters();
	        var method = this.parsepropertymethod(params);
	        this.context.allowyield = previousallowyield;
	        return this.finalize(node, new node.functionexpression(null, params.params, method, isgenerator));
	    };
	    parser.prototype.parsepropertymethodasyncfunction = function () {
	        var node = this.createnode();
	        var previousallowyield = this.context.allowyield;
	        var previousawait = this.context.await;
	        this.context.allowyield = false;
	        this.context.await = true;
	        var params = this.parseformalparameters();
	        var method = this.parsepropertymethod(params);
	        this.context.allowyield = previousallowyield;
	        this.context.await = previousawait;
	        return this.finalize(node, new node.asyncfunctionexpression(null, params.params, method));
	    };
	    parser.prototype.parseobjectpropertykey = function () {
	        var node = this.createnode();
	        var token = this.nexttoken();
	        var key;
	        switch (token.type) {
	            case 8 /* stringliteral */:
	            case 6 /* numericliteral */:
	                if (this.context.strict && token.octal) {
	                    this.tolerateunexpectedtoken(token, messages_1.messages.strictoctalliteral);
	                }
	                var raw = this.gettokenraw(token);
	                key = this.finalize(node, new node.literal(token.value, raw));
	                break;
	            case 3 /* identifier */:
	            case 1 /* booleanliteral */:
	            case 5 /* nullliteral */:
	            case 4 /* keyword */:
	                key = this.finalize(node, new node.identifier(token.value));
	                break;
	            case 7 /* punctuator */:
	                if (token.value === '[') {
	                    key = this.isolatecovergrammar(this.parseassignmentexpression);
	                    this.expect(']');
	                }
	                else {
	                    key = this.throwunexpectedtoken(token);
	                }
	                break;
	            default:
	                key = this.throwunexpectedtoken(token);
	        }
	        return key;
	    };
	    parser.prototype.ispropertykey = function (key, value) {
	        return (key.type === syntax_1.syntax.identifier && key.name === value) ||
	            (key.type === syntax_1.syntax.literal && key.value === value);
	    };
	    parser.prototype.parseobjectproperty = function (hasproto) {
	        var node = this.createnode();
	        var token = this.lookahead;
	        var kind;
	        var key = null;
	        var value = null;
	        var computed = false;
	        var method = false;
	        var shorthand = false;
	        var isasync = false;
	        if (token.type === 3 /* identifier */) {
	            var id = token.value;
	            this.nexttoken();
	            computed = this.match('[');
	            isasync = !this.haslineterminator && (id === 'async') &&
	                !this.match(':') && !this.match('(') && !this.match('*');
	            key = isasync ? this.parseobjectpropertykey() : this.finalize(node, new node.identifier(id));
	        }
	        else if (this.match('*')) {
	            this.nexttoken();
	        }
	        else {
	            computed = this.match('[');
	            key = this.parseobjectpropertykey();
	        }
	        var lookaheadpropertykey = this.qualifiedpropertyname(this.lookahead);
	        if (token.type === 3 /* identifier */ && !isasync && token.value === 'get' && lookaheadpropertykey) {
	            kind = 'get';
	            computed = this.match('[');
	            key = this.parseobjectpropertykey();
	            this.context.allowyield = false;
	            value = this.parsegettermethod();
	        }
	        else if (token.type === 3 /* identifier */ && !isasync && token.value === 'set' && lookaheadpropertykey) {
	            kind = 'set';
	            computed = this.match('[');
	            key = this.parseobjectpropertykey();
	            value = this.parsesettermethod();
	        }
	        else if (token.type === 7 /* punctuator */ && token.value === '*' && lookaheadpropertykey) {
	            kind = 'init';
	            computed = this.match('[');
	            key = this.parseobjectpropertykey();
	            value = this.parsegeneratormethod();
	            method = true;
	        }
	        else {
	            if (!key) {
	                this.throwunexpectedtoken(this.lookahead);
	            }
	            kind = 'init';
	            if (this.match(':') && !isasync) {
	                if (!computed && this.ispropertykey(key, '__proto__')) {
	                    if (hasproto.value) {
	                        this.tolerateerror(messages_1.messages.duplicateprotoproperty);
	                    }
	                    hasproto.value = true;
	                }
	                this.nexttoken();
	                value = this.inheritcovergrammar(this.parseassignmentexpression);
	            }
	            else if (this.match('(')) {
	                value = isasync ? this.parsepropertymethodasyncfunction() : this.parsepropertymethodfunction();
	                method = true;
	            }
	            else if (token.type === 3 /* identifier */) {
	                var id = this.finalize(node, new node.identifier(token.value));
	                if (this.match('=')) {
	                    this.context.firstcoverinitializednameerror = this.lookahead;
	                    this.nexttoken();
	                    shorthand = true;
	                    var init = this.isolatecovergrammar(this.parseassignmentexpression);
	                    value = this.finalize(node, new node.assignmentpattern(id, init));
	                }
	                else {
	                    shorthand = true;
	                    value = id;
	                }
	            }
	            else {
	                this.throwunexpectedtoken(this.nexttoken());
	            }
	        }
	        return this.finalize(node, new node.property(kind, key, computed, value, method, shorthand));
	    };
	    parser.prototype.parseobjectinitializer = function () {
	        var node = this.createnode();
	        this.expect('{');
	        var properties = [];
	        var hasproto = { value: false };
	        while (!this.match('}')) {
	            properties.push(this.parseobjectproperty(hasproto));
	            if (!this.match('}')) {
	                this.expectcommaseparator();
	            }
	        }
	        this.expect('}');
	        return this.finalize(node, new node.objectexpression(properties));
	    };
	    // https://tc39.github.io/ecma262/#sec-template-literals
	    parser.prototype.parsetemplatehead = function () {
	        assert_1.assert(this.lookahead.head, 'template literal must start with a template head');
	        var node = this.createnode();
	        var token = this.nexttoken();
	        var raw = token.value;
	        var cooked = token.cooked;
	        return this.finalize(node, new node.templateelement({ raw: raw, cooked: cooked }, token.tail));
	    };
	    parser.prototype.parsetemplateelement = function () {
	        if (this.lookahead.type !== 10 /* template */) {
	            this.throwunexpectedtoken();
	        }
	        var node = this.createnode();
	        var token = this.nexttoken();
	        var raw = token.value;
	        var cooked = token.cooked;
	        return this.finalize(node, new node.templateelement({ raw: raw, cooked: cooked }, token.tail));
	    };
	    parser.prototype.parsetemplateliteral = function () {
	        var node = this.createnode();
	        var expressions = [];
	        var quasis = [];
	        var quasi = this.parsetemplatehead();
	        quasis.push(quasi);
	        while (!quasi.tail) {
	            expressions.push(this.parseexpression());
	            quasi = this.parsetemplateelement();
	            quasis.push(quasi);
	        }
	        return this.finalize(node, new node.templateliteral(quasis, expressions));
	    };
	    // https://tc39.github.io/ecma262/#sec-grouping-operator
	    parser.prototype.reinterpretexpressionaspattern = function (expr) {
	        switch (expr.type) {
	            case syntax_1.syntax.identifier:
	            case syntax_1.syntax.memberexpression:
	            case syntax_1.syntax.restelement:
	            case syntax_1.syntax.assignmentpattern:
	                break;
	            case syntax_1.syntax.spreadelement:
	                expr.type = syntax_1.syntax.restelement;
	                this.reinterpretexpressionaspattern(expr.argument);
	                break;
	            case syntax_1.syntax.arrayexpression:
	                expr.type = syntax_1.syntax.arraypattern;
	                for (var i = 0; i < expr.elements.length; i++) {
	                    if (expr.elements[i] !== null) {
	                        this.reinterpretexpressionaspattern(expr.elements[i]);
	                    }
	                }
	                break;
	            case syntax_1.syntax.objectexpression:
	                expr.type = syntax_1.syntax.objectpattern;
	                for (var i = 0; i < expr.properties.length; i++) {
	                    this.reinterpretexpressionaspattern(expr.properties[i].value);
	                }
	                break;
	            case syntax_1.syntax.assignmentexpression:
	                expr.type = syntax_1.syntax.assignmentpattern;
	                delete expr.operator;
	                this.reinterpretexpressionaspattern(expr.left);
	                break;
	            default:
	                // allow other node type for tolerant parsing.
	                break;
	        }
	    };
	    parser.prototype.parsegroupexpression = function () {
	        var expr;
	        this.expect('(');
	        if (this.match(')')) {
	            this.nexttoken();
	            if (!this.match('=>')) {
	                this.expect('=>');
	            }
	            expr = {
	                type: arrowparameterplaceholder,
	                params: [],
	                async: false
	            };
	        }
	        else {
	            var starttoken = this.lookahead;
	            var params = [];
	            if (this.match('...')) {
	                expr = this.parserestelement(params);
	                this.expect(')');
	                if (!this.match('=>')) {
	                    this.expect('=>');
	                }
	                expr = {
	                    type: arrowparameterplaceholder,
	                    params: [expr],
	                    async: false
	                };
	            }
	            else {
	                var arrow = false;
	                this.context.isbindingelement = true;
	                expr = this.inheritcovergrammar(this.parseassignmentexpression);
	                if (this.match(',')) {
	                    var expressions = [];
	                    this.context.isassignmenttarget = false;
	                    expressions.push(expr);
	                    while (this.lookahead.type !== 2 /* eof */) {
	                        if (!this.match(',')) {
	                            break;
	                        }
	                        this.nexttoken();
	                        if (this.match(')')) {
	                            this.nexttoken();
	                            for (var i = 0; i < expressions.length; i++) {
	                                this.reinterpretexpressionaspattern(expressions[i]);
	                            }
	                            arrow = true;
	                            expr = {
	                                type: arrowparameterplaceholder,
	                                params: expressions,
	                                async: false
	                            };
	                        }
	                        else if (this.match('...')) {
	                            if (!this.context.isbindingelement) {
	                                this.throwunexpectedtoken(this.lookahead);
	                            }
	                            expressions.push(this.parserestelement(params));
	                            this.expect(')');
	                            if (!this.match('=>')) {
	                                this.expect('=>');
	                            }
	                            this.context.isbindingelement = false;
	                            for (var i = 0; i < expressions.length; i++) {
	                                this.reinterpretexpressionaspattern(expressions[i]);
	                            }
	                            arrow = true;
	                            expr = {
	                                type: arrowparameterplaceholder,
	                                params: expressions,
	                                async: false
	                            };
	                        }
	                        else {
	                            expressions.push(this.inheritcovergrammar(this.parseassignmentexpression));
	                        }
	                        if (arrow) {
	                            break;
	                        }
	                    }
	                    if (!arrow) {
	                        expr = this.finalize(this.startnode(starttoken), new node.sequenceexpression(expressions));
	                    }
	                }
	                if (!arrow) {
	                    this.expect(')');
	                    if (this.match('=>')) {
	                        if (expr.type === syntax_1.syntax.identifier && expr.name === 'yield') {
	                            arrow = true;
	                            expr = {
	                                type: arrowparameterplaceholder,
	                                params: [expr],
	                                async: false
	                            };
	                        }
	                        if (!arrow) {
	                            if (!this.context.isbindingelement) {
	                                this.throwunexpectedtoken(this.lookahead);
	                            }
	                            if (expr.type === syntax_1.syntax.sequenceexpression) {
	                                for (var i = 0; i < expr.expressions.length; i++) {
	                                    this.reinterpretexpressionaspattern(expr.expressions[i]);
	                                }
	                            }
	                            else {
	                                this.reinterpretexpressionaspattern(expr);
	                            }
	                            var parameters = (expr.type === syntax_1.syntax.sequenceexpression ? expr.expressions : [expr]);
	                            expr = {
	                                type: arrowparameterplaceholder,
	                                params: parameters,
	                                async: false
	                            };
	                        }
	                    }
	                    this.context.isbindingelement = false;
	                }
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-left-hand-side-expressions
	    parser.prototype.parsearguments = function () {
	        this.expect('(');
	        var args = [];
	        if (!this.match(')')) {
	            while (true) {
	                var expr = this.match('...') ? this.parsespreadelement() :
	                    this.isolatecovergrammar(this.parseassignmentexpression);
	                args.push(expr);
	                if (this.match(')')) {
	                    break;
	                }
	                this.expectcommaseparator();
	                if (this.match(')')) {
	                    break;
	                }
	            }
	        }
	        this.expect(')');
	        return args;
	    };
	    parser.prototype.isidentifiername = function (token) {
	        return token.type === 3 /* identifier */ ||
	            token.type === 4 /* keyword */ ||
	            token.type === 1 /* booleanliteral */ ||
	            token.type === 5 /* nullliteral */;
	    };
	    parser.prototype.parseidentifiername = function () {
	        var node = this.createnode();
	        var token = this.nexttoken();
	        if (!this.isidentifiername(token)) {
	            this.throwunexpectedtoken(token);
	        }
	        return this.finalize(node, new node.identifier(token.value));
	    };
	    parser.prototype.parsenewexpression = function () {
	        var node = this.createnode();
	        var id = this.parseidentifiername();
	        assert_1.assert(id.name === 'new', 'new expression must start with `new`');
	        var expr;
	        if (this.match('.')) {
	            this.nexttoken();
	            if (this.lookahead.type === 3 /* identifier */ && this.context.infunctionbody && this.lookahead.value === 'target') {
	                var property = this.parseidentifiername();
	                expr = new node.metaproperty(id, property);
	            }
	            else {
	                this.throwunexpectedtoken(this.lookahead);
	            }
	        }
	        else {
	            var callee = this.isolatecovergrammar(this.parselefthandsideexpression);
	            var args = this.match('(') ? this.parsearguments() : [];
	            expr = new node.newexpression(callee, args);
	            this.context.isassignmenttarget = false;
	            this.context.isbindingelement = false;
	        }
	        return this.finalize(node, expr);
	    };
	    parser.prototype.parseasyncargument = function () {
	        var arg = this.parseassignmentexpression();
	        this.context.firstcoverinitializednameerror = null;
	        return arg;
	    };
	    parser.prototype.parseasyncarguments = function () {
	        this.expect('(');
	        var args = [];
	        if (!this.match(')')) {
	            while (true) {
	                var expr = this.match('...') ? this.parsespreadelement() :
	                    this.isolatecovergrammar(this.parseasyncargument);
	                args.push(expr);
	                if (this.match(')')) {
	                    break;
	                }
	                this.expectcommaseparator();
	                if (this.match(')')) {
	                    break;
	                }
	            }
	        }
	        this.expect(')');
	        return args;
	    };
	    parser.prototype.parselefthandsideexpressionallowcall = function () {
	        var starttoken = this.lookahead;
	        var maybeasync = this.matchcontextualkeyword('async');
	        var previousallowin = this.context.allowin;
	        this.context.allowin = true;
	        var expr;
	        if (this.matchkeyword('super') && this.context.infunctionbody) {
	            expr = this.createnode();
	            this.nexttoken();
	            expr = this.finalize(expr, new node.super());
	            if (!this.match('(') && !this.match('.') && !this.match('[')) {
	                this.throwunexpectedtoken(this.lookahead);
	            }
	        }
	        else {
	            expr = this.inheritcovergrammar(this.matchkeyword('new') ? this.parsenewexpression : this.parseprimaryexpression);
	        }
	        while (true) {
	            if (this.match('.')) {
	                this.context.isbindingelement = false;
	                this.context.isassignmenttarget = true;
	                this.expect('.');
	                var property = this.parseidentifiername();
	                expr = this.finalize(this.startnode(starttoken), new node.staticmemberexpression(expr, property));
	            }
	            else if (this.match('(')) {
	                var asyncarrow = maybeasync && (starttoken.linenumber === this.lookahead.linenumber);
	                this.context.isbindingelement = false;
	                this.context.isassignmenttarget = false;
	                var args = asyncarrow ? this.parseasyncarguments() : this.parsearguments();
	                expr = this.finalize(this.startnode(starttoken), new node.callexpression(expr, args));
	                if (asyncarrow && this.match('=>')) {
	                    for (var i = 0; i < args.length; ++i) {
	                        this.reinterpretexpressionaspattern(args[i]);
	                    }
	                    expr = {
	                        type: arrowparameterplaceholder,
	                        params: args,
	                        async: true
	                    };
	                }
	            }
	            else if (this.match('[')) {
	                this.context.isbindingelement = false;
	                this.context.isassignmenttarget = true;
	                this.expect('[');
	                var property = this.isolatecovergrammar(this.parseexpression);
	                this.expect(']');
	                expr = this.finalize(this.startnode(starttoken), new node.computedmemberexpression(expr, property));
	            }
	            else if (this.lookahead.type === 10 /* template */ && this.lookahead.head) {
	                var quasi = this.parsetemplateliteral();
	                expr = this.finalize(this.startnode(starttoken), new node.taggedtemplateexpression(expr, quasi));
	            }
	            else {
	                break;
	            }
	        }
	        this.context.allowin = previousallowin;
	        return expr;
	    };
	    parser.prototype.parsesuper = function () {
	        var node = this.createnode();
	        this.expectkeyword('super');
	        if (!this.match('[') && !this.match('.')) {
	            this.throwunexpectedtoken(this.lookahead);
	        }
	        return this.finalize(node, new node.super());
	    };
	    parser.prototype.parselefthandsideexpression = function () {
	        assert_1.assert(this.context.allowin, 'callee of new expression always allow in keyword.');
	        var node = this.startnode(this.lookahead);
	        var expr = (this.matchkeyword('super') && this.context.infunctionbody) ? this.parsesuper() :
	            this.inheritcovergrammar(this.matchkeyword('new') ? this.parsenewexpression : this.parseprimaryexpression);
	        while (true) {
	            if (this.match('[')) {
	                this.context.isbindingelement = false;
	                this.context.isassignmenttarget = true;
	                this.expect('[');
	                var property = this.isolatecovergrammar(this.parseexpression);
	                this.expect(']');
	                expr = this.finalize(node, new node.computedmemberexpression(expr, property));
	            }
	            else if (this.match('.')) {
	                this.context.isbindingelement = false;
	                this.context.isassignmenttarget = true;
	                this.expect('.');
	                var property = this.parseidentifiername();
	                expr = this.finalize(node, new node.staticmemberexpression(expr, property));
	            }
	            else if (this.lookahead.type === 10 /* template */ && this.lookahead.head) {
	                var quasi = this.parsetemplateliteral();
	                expr = this.finalize(node, new node.taggedtemplateexpression(expr, quasi));
	            }
	            else {
	                break;
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-update-expressions
	    parser.prototype.parseupdateexpression = function () {
	        var expr;
	        var starttoken = this.lookahead;
	        if (this.match('++') || this.match('--')) {
	            var node = this.startnode(starttoken);
	            var token = this.nexttoken();
	            expr = this.inheritcovergrammar(this.parseunaryexpression);
	            if (this.context.strict && expr.type === syntax_1.syntax.identifier && this.scanner.isrestrictedword(expr.name)) {
	                this.tolerateerror(messages_1.messages.strictlhsprefix);
	            }
	            if (!this.context.isassignmenttarget) {
	                this.tolerateerror(messages_1.messages.invalidlhsinassignment);
	            }
	            var prefix = true;
	            expr = this.finalize(node, new node.updateexpression(token.value, expr, prefix));
	            this.context.isassignmenttarget = false;
	            this.context.isbindingelement = false;
	        }
	        else {
	            expr = this.inheritcovergrammar(this.parselefthandsideexpressionallowcall);
	            if (!this.haslineterminator && this.lookahead.type === 7 /* punctuator */) {
	                if (this.match('++') || this.match('--')) {
	                    if (this.context.strict && expr.type === syntax_1.syntax.identifier && this.scanner.isrestrictedword(expr.name)) {
	                        this.tolerateerror(messages_1.messages.strictlhspostfix);
	                    }
	                    if (!this.context.isassignmenttarget) {
	                        this.tolerateerror(messages_1.messages.invalidlhsinassignment);
	                    }
	                    this.context.isassignmenttarget = false;
	                    this.context.isbindingelement = false;
	                    var operator = this.nexttoken().value;
	                    var prefix = false;
	                    expr = this.finalize(this.startnode(starttoken), new node.updateexpression(operator, expr, prefix));
	                }
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-unary-operators
	    parser.prototype.parseawaitexpression = function () {
	        var node = this.createnode();
	        this.nexttoken();
	        var argument = this.parseunaryexpression();
	        return this.finalize(node, new node.awaitexpression(argument));
	    };
	    parser.prototype.parseunaryexpression = function () {
	        var expr;
	        if (this.match('+') || this.match('-') || this.match('~') || this.match('!') ||
	            this.matchkeyword('delete') || this.matchkeyword('void') || this.matchkeyword('typeof')) {
	            var node = this.startnode(this.lookahead);
	            var token = this.nexttoken();
	            expr = this.inheritcovergrammar(this.parseunaryexpression);
	            expr = this.finalize(node, new node.unaryexpression(token.value, expr));
	            if (this.context.strict && expr.operator === 'delete' && expr.argument.type === syntax_1.syntax.identifier) {
	                this.tolerateerror(messages_1.messages.strictdelete);
	            }
	            this.context.isassignmenttarget = false;
	            this.context.isbindingelement = false;
	        }
	        else if (this.context.await && this.matchcontextualkeyword('await')) {
	            expr = this.parseawaitexpression();
	        }
	        else {
	            expr = this.parseupdateexpression();
	        }
	        return expr;
	    };
	    parser.prototype.parseexponentiationexpression = function () {
	        var starttoken = this.lookahead;
	        var expr = this.inheritcovergrammar(this.parseunaryexpression);
	        if (expr.type !== syntax_1.syntax.unaryexpression && this.match('**')) {
	            this.nexttoken();
	            this.context.isassignmenttarget = false;
	            this.context.isbindingelement = false;
	            var left = expr;
	            var right = this.isolatecovergrammar(this.parseexponentiationexpression);
	            expr = this.finalize(this.startnode(starttoken), new node.binaryexpression('**', left, right));
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-exp-operator
	    // https://tc39.github.io/ecma262/#sec-multiplicative-operators
	    // https://tc39.github.io/ecma262/#sec-additive-operators
	    // https://tc39.github.io/ecma262/#sec-bitwise-shift-operators
	    // https://tc39.github.io/ecma262/#sec-relational-operators
	    // https://tc39.github.io/ecma262/#sec-equality-operators
	    // https://tc39.github.io/ecma262/#sec-binary-bitwise-operators
	    // https://tc39.github.io/ecma262/#sec-binary-logical-operators
	    parser.prototype.binaryprecedence = function (token) {
	        var op = token.value;
	        var precedence;
	        if (token.type === 7 /* punctuator */) {
	            precedence = this.operatorprecedence[op] || 0;
	        }
	        else if (token.type === 4 /* keyword */) {
	            precedence = (op === 'instanceof' || (this.context.allowin && op === 'in')) ? 7 : 0;
	        }
	        else {
	            precedence = 0;
	        }
	        return precedence;
	    };
	    parser.prototype.parsebinaryexpression = function () {
	        var starttoken = this.lookahead;
	        var expr = this.inheritcovergrammar(this.parseexponentiationexpression);
	        var token = this.lookahead;
	        var prec = this.binaryprecedence(token);
	        if (prec > 0) {
	            this.nexttoken();
	            this.context.isassignmenttarget = false;
	            this.context.isbindingelement = false;
	            var markers = [starttoken, this.lookahead];
	            var left = expr;
	            var right = this.isolatecovergrammar(this.parseexponentiationexpression);
	            var stack = [left, token.value, right];
	            var precedences = [prec];
	            while (true) {
	                prec = this.binaryprecedence(this.lookahead);
	                if (prec <= 0) {
	                    break;
	                }
	                // reduce: make a binary expression from the three topmost entries.
	                while ((stack.length > 2) && (prec <= precedences[precedences.length - 1])) {
	                    right = stack.pop();
	                    var operator = stack.pop();
	                    precedences.pop();
	                    left = stack.pop();
	                    markers.pop();
	                    var node = this.startnode(markers[markers.length - 1]);
	                    stack.push(this.finalize(node, new node.binaryexpression(operator, left, right)));
	                }
	                // shift.
	                stack.push(this.nexttoken().value);
	                precedences.push(prec);
	                markers.push(this.lookahead);
	                stack.push(this.isolatecovergrammar(this.parseexponentiationexpression));
	            }
	            // final reduce to clean-up the stack.
	            var i = stack.length - 1;
	            expr = stack[i];
	            markers.pop();
	            while (i > 1) {
	                var node = this.startnode(markers.pop());
	                var operator = stack[i - 1];
	                expr = this.finalize(node, new node.binaryexpression(operator, stack[i - 2], expr));
	                i -= 2;
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-conditional-operator
	    parser.prototype.parseconditionalexpression = function () {
	        var starttoken = this.lookahead;
	        var expr = this.inheritcovergrammar(this.parsebinaryexpression);
	        if (this.match('?')) {
	            this.nexttoken();
	            var previousallowin = this.context.allowin;
	            this.context.allowin = true;
	            var consequent = this.isolatecovergrammar(this.parseassignmentexpression);
	            this.context.allowin = previousallowin;
	            this.expect(':');
	            var alternate = this.isolatecovergrammar(this.parseassignmentexpression);
	            expr = this.finalize(this.startnode(starttoken), new node.conditionalexpression(expr, consequent, alternate));
	            this.context.isassignmenttarget = false;
	            this.context.isbindingelement = false;
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-assignment-operators
	    parser.prototype.checkpatternparam = function (options, param) {
	        switch (param.type) {
	            case syntax_1.syntax.identifier:
	                this.validateparam(options, param, param.name);
	                break;
	            case syntax_1.syntax.restelement:
	                this.checkpatternparam(options, param.argument);
	                break;
	            case syntax_1.syntax.assignmentpattern:
	                this.checkpatternparam(options, param.left);
	                break;
	            case syntax_1.syntax.arraypattern:
	                for (var i = 0; i < param.elements.length; i++) {
	                    if (param.elements[i] !== null) {
	                        this.checkpatternparam(options, param.elements[i]);
	                    }
	                }
	                break;
	            case syntax_1.syntax.objectpattern:
	                for (var i = 0; i < param.properties.length; i++) {
	                    this.checkpatternparam(options, param.properties[i].value);
	                }
	                break;
	            default:
	                break;
	        }
	        options.simple = options.simple && (param instanceof node.identifier);
	    };
	    parser.prototype.reinterpretascoverformalslist = function (expr) {
	        var params = [expr];
	        var options;
	        var asyncarrow = false;
	        switch (expr.type) {
	            case syntax_1.syntax.identifier:
	                break;
	            case arrowparameterplaceholder:
	                params = expr.params;
	                asyncarrow = expr.async;
	                break;
	            default:
	                return null;
	        }
	        options = {
	            simple: true,
	            paramset: {}
	        };
	        for (var i = 0; i < params.length; ++i) {
	            var param = params[i];
	            if (param.type === syntax_1.syntax.assignmentpattern) {
	                if (param.right.type === syntax_1.syntax.yieldexpression) {
	                    if (param.right.argument) {
	                        this.throwunexpectedtoken(this.lookahead);
	                    }
	                    param.right.type = syntax_1.syntax.identifier;
	                    param.right.name = 'yield';
	                    delete param.right.argument;
	                    delete param.right.delegate;
	                }
	            }
	            else if (asyncarrow && param.type === syntax_1.syntax.identifier && param.name === 'await') {
	                this.throwunexpectedtoken(this.lookahead);
	            }
	            this.checkpatternparam(options, param);
	            params[i] = param;
	        }
	        if (this.context.strict || !this.context.allowyield) {
	            for (var i = 0; i < params.length; ++i) {
	                var param = params[i];
	                if (param.type === syntax_1.syntax.yieldexpression) {
	                    this.throwunexpectedtoken(this.lookahead);
	                }
	            }
	        }
	        if (options.message === messages_1.messages.strictparamdupe) {
	            var token = this.context.strict ? options.stricted : options.firstrestricted;
	            this.throwunexpectedtoken(token, options.message);
	        }
	        return {
	            simple: options.simple,
	            params: params,
	            stricted: options.stricted,
	            firstrestricted: options.firstrestricted,
	            message: options.message
	        };
	    };
	    parser.prototype.parseassignmentexpression = function () {
	        var expr;
	        if (!this.context.allowyield && this.matchkeyword('yield')) {
	            expr = this.parseyieldexpression();
	        }
	        else {
	            var starttoken = this.lookahead;
	            var token = starttoken;
	            expr = this.parseconditionalexpression();
	            if (token.type === 3 /* identifier */ && (token.linenumber === this.lookahead.linenumber) && token.value === 'async') {
	                if (this.lookahead.type === 3 /* identifier */ || this.matchkeyword('yield')) {
	                    var arg = this.parseprimaryexpression();
	                    this.reinterpretexpressionaspattern(arg);
	                    expr = {
	                        type: arrowparameterplaceholder,
	                        params: [arg],
	                        async: true
	                    };
	                }
	            }
	            if (expr.type === arrowparameterplaceholder || this.match('=>')) {
	                // https://tc39.github.io/ecma262/#sec-arrow-function-definitions
	                this.context.isassignmenttarget = false;
	                this.context.isbindingelement = false;
	                var isasync = expr.async;
	                var list = this.reinterpretascoverformalslist(expr);
	                if (list) {
	                    if (this.haslineterminator) {
	                        this.tolerateunexpectedtoken(this.lookahead);
	                    }
	                    this.context.firstcoverinitializednameerror = null;
	                    var previousstrict = this.context.strict;
	                    var previousallowstrictdirective = this.context.allowstrictdirective;
	                    this.context.allowstrictdirective = list.simple;
	                    var previousallowyield = this.context.allowyield;
	                    var previousawait = this.context.await;
	                    this.context.allowyield = true;
	                    this.context.await = isasync;
	                    var node = this.startnode(starttoken);
	                    this.expect('=>');
	                    var body = void 0;
	                    if (this.match('{')) {
	                        var previousallowin = this.context.allowin;
	                        this.context.allowin = true;
	                        body = this.parsefunctionsourceelements();
	                        this.context.allowin = previousallowin;
	                    }
	                    else {
	                        body = this.isolatecovergrammar(this.parseassignmentexpression);
	                    }
	                    var expression = body.type !== syntax_1.syntax.blockstatement;
	                    if (this.context.strict && list.firstrestricted) {
	                        this.throwunexpectedtoken(list.firstrestricted, list.message);
	                    }
	                    if (this.context.strict && list.stricted) {
	                        this.tolerateunexpectedtoken(list.stricted, list.message);
	                    }
	                    expr = isasync ? this.finalize(node, new node.asyncarrowfunctionexpression(list.params, body, expression)) :
	                        this.finalize(node, new node.arrowfunctionexpression(list.params, body, expression));
	                    this.context.strict = previousstrict;
	                    this.context.allowstrictdirective = previousallowstrictdirective;
	                    this.context.allowyield = previousallowyield;
	                    this.context.await = previousawait;
	                }
	            }
	            else {
	                if (this.matchassign()) {
	                    if (!this.context.isassignmenttarget) {
	                        this.tolerateerror(messages_1.messages.invalidlhsinassignment);
	                    }
	                    if (this.context.strict && expr.type === syntax_1.syntax.identifier) {
	                        var id = expr;
	                        if (this.scanner.isrestrictedword(id.name)) {
	                            this.tolerateunexpectedtoken(token, messages_1.messages.strictlhsassignment);
	                        }
	                        if (this.scanner.isstrictmodereservedword(id.name)) {
	                            this.tolerateunexpectedtoken(token, messages_1.messages.strictreservedword);
	                        }
	                    }
	                    if (!this.match('=')) {
	                        this.context.isassignmenttarget = false;
	                        this.context.isbindingelement = false;
	                    }
	                    else {
	                        this.reinterpretexpressionaspattern(expr);
	                    }
	                    token = this.nexttoken();
	                    var operator = token.value;
	                    var right = this.isolatecovergrammar(this.parseassignmentexpression);
	                    expr = this.finalize(this.startnode(starttoken), new node.assignmentexpression(operator, expr, right));
	                    this.context.firstcoverinitializednameerror = null;
	                }
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-comma-operator
	    parser.prototype.parseexpression = function () {
	        var starttoken = this.lookahead;
	        var expr = this.isolatecovergrammar(this.parseassignmentexpression);
	        if (this.match(',')) {
	            var expressions = [];
	            expressions.push(expr);
	            while (this.lookahead.type !== 2 /* eof */) {
	                if (!this.match(',')) {
	                    break;
	                }
	                this.nexttoken();
	                expressions.push(this.isolatecovergrammar(this.parseassignmentexpression));
	            }
	            expr = this.finalize(this.startnode(starttoken), new node.sequenceexpression(expressions));
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-block
	    parser.prototype.parsestatementlistitem = function () {
	        var statement;
	        this.context.isassignmenttarget = true;
	        this.context.isbindingelement = true;
	        if (this.lookahead.type === 4 /* keyword */) {
	            switch (this.lookahead.value) {
	                case 'export':
	                    if (!this.context.ismodule) {
	                        this.tolerateunexpectedtoken(this.lookahead, messages_1.messages.illegalexportdeclaration);
	                    }
	                    statement = this.parseexportdeclaration();
	                    break;
	                case 'import':
	                    if (!this.context.ismodule) {
	                        this.tolerateunexpectedtoken(this.lookahead, messages_1.messages.illegalimportdeclaration);
	                    }
	                    statement = this.parseimportdeclaration();
	                    break;
	                case 'const':
	                    statement = this.parselexicaldeclaration({ infor: false });
	                    break;
	                case 'function':
	                    statement = this.parsefunctiondeclaration();
	                    break;
	                case 'class':
	                    statement = this.parseclassdeclaration();
	                    break;
	                case 'let':
	                    statement = this.islexicaldeclaration() ? this.parselexicaldeclaration({ infor: false }) : this.parsestatement();
	                    break;
	                default:
	                    statement = this.parsestatement();
	                    break;
	            }
	        }
	        else {
	            statement = this.parsestatement();
	        }
	        return statement;
	    };
	    parser.prototype.parseblock = function () {
	        var node = this.createnode();
	        this.expect('{');
	        var block = [];
	        while (true) {
	            if (this.match('}')) {
	                break;
	            }
	            block.push(this.parsestatementlistitem());
	        }
	        this.expect('}');
	        return this.finalize(node, new node.blockstatement(block));
	    };
	    // https://tc39.github.io/ecma262/#sec-let-and-const-declarations
	    parser.prototype.parselexicalbinding = function (kind, options) {
	        var node = this.createnode();
	        var params = [];
	        var id = this.parsepattern(params, kind);
	        if (this.context.strict && id.type === syntax_1.syntax.identifier) {
	            if (this.scanner.isrestrictedword(id.name)) {
	                this.tolerateerror(messages_1.messages.strictvarname);
	            }
	        }
	        var init = null;
	        if (kind === 'const') {
	            if (!this.matchkeyword('in') && !this.matchcontextualkeyword('of')) {
	                if (this.match('=')) {
	                    this.nexttoken();
	                    init = this.isolatecovergrammar(this.parseassignmentexpression);
	                }
	                else {
	                    this.throwerror(messages_1.messages.declarationmissinginitializer, 'const');
	                }
	            }
	        }
	        else if ((!options.infor && id.type !== syntax_1.syntax.identifier) || this.match('=')) {
	            this.expect('=');
	            init = this.isolatecovergrammar(this.parseassignmentexpression);
	        }
	        return this.finalize(node, new node.variabledeclarator(id, init));
	    };
	    parser.prototype.parsebindinglist = function (kind, options) {
	        var list = [this.parselexicalbinding(kind, options)];
	        while (this.match(',')) {
	            this.nexttoken();
	            list.push(this.parselexicalbinding(kind, options));
	        }
	        return list;
	    };
	    parser.prototype.islexicaldeclaration = function () {
	        var state = this.scanner.savestate();
	        this.scanner.scancomments();
	        var next = this.scanner.lex();
	        this.scanner.restorestate(state);
	        return (next.type === 3 /* identifier */) ||
	            (next.type === 7 /* punctuator */ && next.value === '[') ||
	            (next.type === 7 /* punctuator */ && next.value === '{') ||
	            (next.type === 4 /* keyword */ && next.value === 'let') ||
	            (next.type === 4 /* keyword */ && next.value === 'yield');
	    };
	    parser.prototype.parselexicaldeclaration = function (options) {
	        var node = this.createnode();
	        var kind = this.nexttoken().value;
	        assert_1.assert(kind === 'let' || kind === 'const', 'lexical declaration must be either let or const');
	        var declarations = this.parsebindinglist(kind, options);
	        this.consumesemicolon();
	        return this.finalize(node, new node.variabledeclaration(declarations, kind));
	    };
	    // https://tc39.github.io/ecma262/#sec-destructuring-binding-patterns
	    parser.prototype.parsebindingrestelement = function (params, kind) {
	        var node = this.createnode();
	        this.expect('...');
	        var arg = this.parsepattern(params, kind);
	        return this.finalize(node, new node.restelement(arg));
	    };
	    parser.prototype.parsearraypattern = function (params, kind) {
	        var node = this.createnode();
	        this.expect('[');
	        var elements = [];
	        while (!this.match(']')) {
	            if (this.match(',')) {
	                this.nexttoken();
	                elements.push(null);
	            }
	            else {
	                if (this.match('...')) {
	                    elements.push(this.parsebindingrestelement(params, kind));
	                    break;
	                }
	                else {
	                    elements.push(this.parsepatternwithdefault(params, kind));
	                }
	                if (!this.match(']')) {
	                    this.expect(',');
	                }
	            }
	        }
	        this.expect(']');
	        return this.finalize(node, new node.arraypattern(elements));
	    };
	    parser.prototype.parsepropertypattern = function (params, kind) {
	        var node = this.createnode();
	        var computed = false;
	        var shorthand = false;
	        var method = false;
	        var key;
	        var value;
	        if (this.lookahead.type === 3 /* identifier */) {
	            var keytoken = this.lookahead;
	            key = this.parsevariableidentifier();
	            var init = this.finalize(node, new node.identifier(keytoken.value));
	            if (this.match('=')) {
	                params.push(keytoken);
	                shorthand = true;
	                this.nexttoken();
	                var expr = this.parseassignmentexpression();
	                value = this.finalize(this.startnode(keytoken), new node.assignmentpattern(init, expr));
	            }
	            else if (!this.match(':')) {
	                params.push(keytoken);
	                shorthand = true;
	                value = init;
	            }
	            else {
	                this.expect(':');
	                value = this.parsepatternwithdefault(params, kind);
	            }
	        }
	        else {
	            computed = this.match('[');
	            key = this.parseobjectpropertykey();
	            this.expect(':');
	            value = this.parsepatternwithdefault(params, kind);
	        }
	        return this.finalize(node, new node.property('init', key, computed, value, method, shorthand));
	    };
	    parser.prototype.parseobjectpattern = function (params, kind) {
	        var node = this.createnode();
	        var properties = [];
	        this.expect('{');
	        while (!this.match('}')) {
	            properties.push(this.parsepropertypattern(params, kind));
	            if (!this.match('}')) {
	                this.expect(',');
	            }
	        }
	        this.expect('}');
	        return this.finalize(node, new node.objectpattern(properties));
	    };
	    parser.prototype.parsepattern = function (params, kind) {
	        var pattern;
	        if (this.match('[')) {
	            pattern = this.parsearraypattern(params, kind);
	        }
	        else if (this.match('{')) {
	            pattern = this.parseobjectpattern(params, kind);
	        }
	        else {
	            if (this.matchkeyword('let') && (kind === 'const' || kind === 'let')) {
	                this.tolerateunexpectedtoken(this.lookahead, messages_1.messages.letinlexicalbinding);
	            }
	            params.push(this.lookahead);
	            pattern = this.parsevariableidentifier(kind);
	        }
	        return pattern;
	    };
	    parser.prototype.parsepatternwithdefault = function (params, kind) {
	        var starttoken = this.lookahead;
	        var pattern = this.parsepattern(params, kind);
	        if (this.match('=')) {
	            this.nexttoken();
	            var previousallowyield = this.context.allowyield;
	            this.context.allowyield = true;
	            var right = this.isolatecovergrammar(this.parseassignmentexpression);
	            this.context.allowyield = previousallowyield;
	            pattern = this.finalize(this.startnode(starttoken), new node.assignmentpattern(pattern, right));
	        }
	        return pattern;
	    };
	    // https://tc39.github.io/ecma262/#sec-variable-statement
	    parser.prototype.parsevariableidentifier = function (kind) {
	        var node = this.createnode();
	        var token = this.nexttoken();
	        if (token.type === 4 /* keyword */ && token.value === 'yield') {
	            if (this.context.strict) {
	                this.tolerateunexpectedtoken(token, messages_1.messages.strictreservedword);
	            }
	            else if (!this.context.allowyield) {
	                this.throwunexpectedtoken(token);
	            }
	        }
	        else if (token.type !== 3 /* identifier */) {
	            if (this.context.strict && token.type === 4 /* keyword */ && this.scanner.isstrictmodereservedword(token.value)) {
	                this.tolerateunexpectedtoken(token, messages_1.messages.strictreservedword);
	            }
	            else {
	                if (this.context.strict || token.value !== 'let' || kind !== 'var') {
	                    this.throwunexpectedtoken(token);
	                }
	            }
	        }
	        else if ((this.context.ismodule || this.context.await) && token.type === 3 /* identifier */ && token.value === 'await') {
	            this.tolerateunexpectedtoken(token);
	        }
	        return this.finalize(node, new node.identifier(token.value));
	    };
	    parser.prototype.parsevariabledeclaration = function (options) {
	        var node = this.createnode();
	        var params = [];
	        var id = this.parsepattern(params, 'var');
	        if (this.context.strict && id.type === syntax_1.syntax.identifier) {
	            if (this.scanner.isrestrictedword(id.name)) {
	                this.tolerateerror(messages_1.messages.strictvarname);
	            }
	        }
	        var init = null;
	        if (this.match('=')) {
	            this.nexttoken();
	            init = this.isolatecovergrammar(this.parseassignmentexpression);
	        }
	        else if (id.type !== syntax_1.syntax.identifier && !options.infor) {
	            this.expect('=');
	        }
	        return this.finalize(node, new node.variabledeclarator(id, init));
	    };
	    parser.prototype.parsevariabledeclarationlist = function (options) {
	        var opt = { infor: options.infor };
	        var list = [];
	        list.push(this.parsevariabledeclaration(opt));
	        while (this.match(',')) {
	            this.nexttoken();
	            list.push(this.parsevariabledeclaration(opt));
	        }
	        return list;
	    };
	    parser.prototype.parsevariablestatement = function () {
	        var node = this.createnode();
	        this.expectkeyword('var');
	        var declarations = this.parsevariabledeclarationlist({ infor: false });
	        this.consumesemicolon();
	        return this.finalize(node, new node.variabledeclaration(declarations, 'var'));
	    };
	    // https://tc39.github.io/ecma262/#sec-empty-statement
	    parser.prototype.parseemptystatement = function () {
	        var node = this.createnode();
	        this.expect(';');
	        return this.finalize(node, new node.emptystatement());
	    };
	    // https://tc39.github.io/ecma262/#sec-expression-statement
	    parser.prototype.parseexpressionstatement = function () {
	        var node = this.createnode();
	        var expr = this.parseexpression();
	        this.consumesemicolon();
	        return this.finalize(node, new node.expressionstatement(expr));
	    };
	    // https://tc39.github.io/ecma262/#sec-if-statement
	    parser.prototype.parseifclause = function () {
	        if (this.context.strict && this.matchkeyword('function')) {
	            this.tolerateerror(messages_1.messages.strictfunction);
	        }
	        return this.parsestatement();
	    };
	    parser.prototype.parseifstatement = function () {
	        var node = this.createnode();
	        var consequent;
	        var alternate = null;
	        this.expectkeyword('if');
	        this.expect('(');
	        var test = this.parseexpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateunexpectedtoken(this.nexttoken());
	            consequent = this.finalize(this.createnode(), new node.emptystatement());
	        }
	        else {
	            this.expect(')');
	            consequent = this.parseifclause();
	            if (this.matchkeyword('else')) {
	                this.nexttoken();
	                alternate = this.parseifclause();
	            }
	        }
	        return this.finalize(node, new node.ifstatement(test, consequent, alternate));
	    };
	    // https://tc39.github.io/ecma262/#sec-do-while-statement
	    parser.prototype.parsedowhilestatement = function () {
	        var node = this.createnode();
	        this.expectkeyword('do');
	        var previousiniteration = this.context.initeration;
	        this.context.initeration = true;
	        var body = this.parsestatement();
	        this.context.initeration = previousiniteration;
	        this.expectkeyword('while');
	        this.expect('(');
	        var test = this.parseexpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateunexpectedtoken(this.nexttoken());
	        }
	        else {
	            this.expect(')');
	            if (this.match(';')) {
	                this.nexttoken();
	            }
	        }
	        return this.finalize(node, new node.dowhilestatement(body, test));
	    };
	    // https://tc39.github.io/ecma262/#sec-while-statement
	    parser.prototype.parsewhilestatement = function () {
	        var node = this.createnode();
	        var body;
	        this.expectkeyword('while');
	        this.expect('(');
	        var test = this.parseexpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateunexpectedtoken(this.nexttoken());
	            body = this.finalize(this.createnode(), new node.emptystatement());
	        }
	        else {
	            this.expect(')');
	            var previousiniteration = this.context.initeration;
	            this.context.initeration = true;
	            body = this.parsestatement();
	            this.context.initeration = previousiniteration;
	        }
	        return this.finalize(node, new node.whilestatement(test, body));
	    };
	    // https://tc39.github.io/ecma262/#sec-for-statement
	    // https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements
	    parser.prototype.parseforstatement = function () {
	        var init = null;
	        var test = null;
	        var update = null;
	        var forin = true;
	        var left, right;
	        var node = this.createnode();
	        this.expectkeyword('for');
	        this.expect('(');
	        if (this.match(';')) {
	            this.nexttoken();
	        }
	        else {
	            if (this.matchkeyword('var')) {
	                init = this.createnode();
	                this.nexttoken();
	                var previousallowin = this.context.allowin;
	                this.context.allowin = false;
	                var declarations = this.parsevariabledeclarationlist({ infor: true });
	                this.context.allowin = previousallowin;
	                if (declarations.length === 1 && this.matchkeyword('in')) {
	                    var decl = declarations[0];
	                    if (decl.init && (decl.id.type === syntax_1.syntax.arraypattern || decl.id.type === syntax_1.syntax.objectpattern || this.context.strict)) {
	                        this.tolerateerror(messages_1.messages.forinofloopinitializer, 'for-in');
	                    }
	                    init = this.finalize(init, new node.variabledeclaration(declarations, 'var'));
	                    this.nexttoken();
	                    left = init;
	                    right = this.parseexpression();
	                    init = null;
	                }
	                else if (declarations.length === 1 && declarations[0].init === null && this.matchcontextualkeyword('of')) {
	                    init = this.finalize(init, new node.variabledeclaration(declarations, 'var'));
	                    this.nexttoken();
	                    left = init;
	                    right = this.parseassignmentexpression();
	                    init = null;
	                    forin = false;
	                }
	                else {
	                    init = this.finalize(init, new node.variabledeclaration(declarations, 'var'));
	                    this.expect(';');
	                }
	            }
	            else if (this.matchkeyword('const') || this.matchkeyword('let')) {
	                init = this.createnode();
	                var kind = this.nexttoken().value;
	                if (!this.context.strict && this.lookahead.value === 'in') {
	                    init = this.finalize(init, new node.identifier(kind));
	                    this.nexttoken();
	                    left = init;
	                    right = this.parseexpression();
	                    init = null;
	                }
	                else {
	                    var previousallowin = this.context.allowin;
	                    this.context.allowin = false;
	                    var declarations = this.parsebindinglist(kind, { infor: true });
	                    this.context.allowin = previousallowin;
	                    if (declarations.length === 1 && declarations[0].init === null && this.matchkeyword('in')) {
	                        init = this.finalize(init, new node.variabledeclaration(declarations, kind));
	                        this.nexttoken();
	                        left = init;
	                        right = this.parseexpression();
	                        init = null;
	                    }
	                    else if (declarations.length === 1 && declarations[0].init === null && this.matchcontextualkeyword('of')) {
	                        init = this.finalize(init, new node.variabledeclaration(declarations, kind));
	                        this.nexttoken();
	                        left = init;
	                        right = this.parseassignmentexpression();
	                        init = null;
	                        forin = false;
	                    }
	                    else {
	                        this.consumesemicolon();
	                        init = this.finalize(init, new node.variabledeclaration(declarations, kind));
	                    }
	                }
	            }
	            else {
	                var initstarttoken = this.lookahead;
	                var previousallowin = this.context.allowin;
	                this.context.allowin = false;
	                init = this.inheritcovergrammar(this.parseassignmentexpression);
	                this.context.allowin = previousallowin;
	                if (this.matchkeyword('in')) {
	                    if (!this.context.isassignmenttarget || init.type === syntax_1.syntax.assignmentexpression) {
	                        this.tolerateerror(messages_1.messages.invalidlhsinforin);
	                    }
	                    this.nexttoken();
	                    this.reinterpretexpressionaspattern(init);
	                    left = init;
	                    right = this.parseexpression();
	                    init = null;
	                }
	                else if (this.matchcontextualkeyword('of')) {
	                    if (!this.context.isassignmenttarget || init.type === syntax_1.syntax.assignmentexpression) {
	                        this.tolerateerror(messages_1.messages.invalidlhsinforloop);
	                    }
	                    this.nexttoken();
	                    this.reinterpretexpressionaspattern(init);
	                    left = init;
	                    right = this.parseassignmentexpression();
	                    init = null;
	                    forin = false;
	                }
	                else {
	                    if (this.match(',')) {
	                        var initseq = [init];
	                        while (this.match(',')) {
	                            this.nexttoken();
	                            initseq.push(this.isolatecovergrammar(this.parseassignmentexpression));
	                        }
	                        init = this.finalize(this.startnode(initstarttoken), new node.sequenceexpression(initseq));
	                    }
	                    this.expect(';');
	                }
	            }
	        }
	        if (typeof left === 'undefined') {
	            if (!this.match(';')) {
	                test = this.parseexpression();
	            }
	            this.expect(';');
	            if (!this.match(')')) {
	                update = this.parseexpression();
	            }
	        }
	        var body;
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateunexpectedtoken(this.nexttoken());
	            body = this.finalize(this.createnode(), new node.emptystatement());
	        }
	        else {
	            this.expect(')');
	            var previousiniteration = this.context.initeration;
	            this.context.initeration = true;
	            body = this.isolatecovergrammar(this.parsestatement);
	            this.context.initeration = previousiniteration;
	        }
	        return (typeof left === 'undefined') ?
	            this.finalize(node, new node.forstatement(init, test, update, body)) :
	            forin ? this.finalize(node, new node.forinstatement(left, right, body)) :
	                this.finalize(node, new node.forofstatement(left, right, body));
	    };
	    // https://tc39.github.io/ecma262/#sec-continue-statement
	    parser.prototype.parsecontinuestatement = function () {
	        var node = this.createnode();
	        this.expectkeyword('continue');
	        var label = null;
	        if (this.lookahead.type === 3 /* identifier */ && !this.haslineterminator) {
	            var id = this.parsevariableidentifier();
	            label = id;
	            var key = '$' + id.name;
	            if (!object.prototype.hasownproperty.call(this.context.labelset, key)) {
	                this.throwerror(messages_1.messages.unknownlabel, id.name);
	            }
	        }
	        this.consumesemicolon();
	        if (label === null && !this.context.initeration) {
	            this.throwerror(messages_1.messages.illegalcontinue);
	        }
	        return this.finalize(node, new node.continuestatement(label));
	    };
	    // https://tc39.github.io/ecma262/#sec-break-statement
	    parser.prototype.parsebreakstatement = function () {
	        var node = this.createnode();
	        this.expectkeyword('break');
	        var label = null;
	        if (this.lookahead.type === 3 /* identifier */ && !this.haslineterminator) {
	            var id = this.parsevariableidentifier();
	            var key = '$' + id.name;
	            if (!object.prototype.hasownproperty.call(this.context.labelset, key)) {
	                this.throwerror(messages_1.messages.unknownlabel, id.name);
	            }
	            label = id;
	        }
	        this.consumesemicolon();
	        if (label === null && !this.context.initeration && !this.context.inswitch) {
	            this.throwerror(messages_1.messages.illegalbreak);
	        }
	        return this.finalize(node, new node.breakstatement(label));
	    };
	    // https://tc39.github.io/ecma262/#sec-return-statement
	    parser.prototype.parsereturnstatement = function () {
	        if (!this.context.infunctionbody) {
	            this.tolerateerror(messages_1.messages.illegalreturn);
	        }
	        var node = this.createnode();
	        this.expectkeyword('return');
	        var hasargument = !this.match(';') && !this.match('}') &&
	            !this.haslineterminator && this.lookahead.type !== 2 /* eof */;
	        var argument = hasargument ? this.parseexpression() : null;
	        this.consumesemicolon();
	        return this.finalize(node, new node.returnstatement(argument));
	    };
	    // https://tc39.github.io/ecma262/#sec-with-statement
	    parser.prototype.parsewithstatement = function () {
	        if (this.context.strict) {
	            this.tolerateerror(messages_1.messages.strictmodewith);
	        }
	        var node = this.createnode();
	        var body;
	        this.expectkeyword('with');
	        this.expect('(');
	        var object = this.parseexpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateunexpectedtoken(this.nexttoken());
	            body = this.finalize(this.createnode(), new node.emptystatement());
	        }
	        else {
	            this.expect(')');
	            body = this.parsestatement();
	        }
	        return this.finalize(node, new node.withstatement(object, body));
	    };
	    // https://tc39.github.io/ecma262/#sec-switch-statement
	    parser.prototype.parseswitchcase = function () {
	        var node = this.createnode();
	        var test;
	        if (this.matchkeyword('default')) {
	            this.nexttoken();
	            test = null;
	        }
	        else {
	            this.expectkeyword('case');
	            test = this.parseexpression();
	        }
	        this.expect(':');
	        var consequent = [];
	        while (true) {
	            if (this.match('}') || this.matchkeyword('default') || this.matchkeyword('case')) {
	                break;
	            }
	            consequent.push(this.parsestatementlistitem());
	        }
	        return this.finalize(node, new node.switchcase(test, consequent));
	    };
	    parser.prototype.parseswitchstatement = function () {
	        var node = this.createnode();
	        this.expectkeyword('switch');
	        this.expect('(');
	        var discriminant = this.parseexpression();
	        this.expect(')');
	        var previousinswitch = this.context.inswitch;
	        this.context.inswitch = true;
	        var cases = [];
	        var defaultfound = false;
	        this.expect('{');
	        while (true) {
	            if (this.match('}')) {
	                break;
	            }
	            var clause = this.parseswitchcase();
	            if (clause.test === null) {
	                if (defaultfound) {
	                    this.throwerror(messages_1.messages.multipledefaultsinswitch);
	                }
	                defaultfound = true;
	            }
	            cases.push(clause);
	        }
	        this.expect('}');
	        this.context.inswitch = previousinswitch;
	        return this.finalize(node, new node.switchstatement(discriminant, cases));
	    };
	    // https://tc39.github.io/ecma262/#sec-labelled-statements
	    parser.prototype.parselabelledstatement = function () {
	        var node = this.createnode();
	        var expr = this.parseexpression();
	        var statement;
	        if ((expr.type === syntax_1.syntax.identifier) && this.match(':')) {
	            this.nexttoken();
	            var id = expr;
	            var key = '$' + id.name;
	            if (object.prototype.hasownproperty.call(this.context.labelset, key)) {
	                this.throwerror(messages_1.messages.redeclaration, 'label', id.name);
	            }
	            this.context.labelset[key] = true;
	            var body = void 0;
	            if (this.matchkeyword('class')) {
	                this.tolerateunexpectedtoken(this.lookahead);
	                body = this.parseclassdeclaration();
	            }
	            else if (this.matchkeyword('function')) {
	                var token = this.lookahead;
	                var declaration = this.parsefunctiondeclaration();
	                if (this.context.strict) {
	                    this.tolerateunexpectedtoken(token, messages_1.messages.strictfunction);
	                }
	                else if (declaration.generator) {
	                    this.tolerateunexpectedtoken(token, messages_1.messages.generatorinlegacycontext);
	                }
	                body = declaration;
	            }
	            else {
	                body = this.parsestatement();
	            }
	            delete this.context.labelset[key];
	            statement = new node.labeledstatement(id, body);
	        }
	        else {
	            this.consumesemicolon();
	            statement = new node.expressionstatement(expr);
	        }
	        return this.finalize(node, statement);
	    };
	    // https://tc39.github.io/ecma262/#sec-throw-statement
	    parser.prototype.parsethrowstatement = function () {
	        var node = this.createnode();
	        this.expectkeyword('throw');
	        if (this.haslineterminator) {
	            this.throwerror(messages_1.messages.newlineafterthrow);
	        }
	        var argument = this.parseexpression();
	        this.consumesemicolon();
	        return this.finalize(node, new node.throwstatement(argument));
	    };
	    // https://tc39.github.io/ecma262/#sec-try-statement
	    parser.prototype.parsecatchclause = function () {
	        var node = this.createnode();
	        this.expectkeyword('catch');
	        this.expect('(');
	        if (this.match(')')) {
	            this.throwunexpectedtoken(this.lookahead);
	        }
	        var params = [];
	        var param = this.parsepattern(params);
	        var parammap = {};
	        for (var i = 0; i < params.length; i++) {
	            var key = '$' + params[i].value;
	            if (object.prototype.hasownproperty.call(parammap, key)) {
	                this.tolerateerror(messages_1.messages.duplicatebinding, params[i].value);
	            }
	            parammap[key] = true;
	        }
	        if (this.context.strict && param.type === syntax_1.syntax.identifier) {
	            if (this.scanner.isrestrictedword(param.name)) {
	                this.tolerateerror(messages_1.messages.strictcatchvariable);
	            }
	        }
	        this.expect(')');
	        var body = this.parseblock();
	        return this.finalize(node, new node.catchclause(param, body));
	    };
	    parser.prototype.parsefinallyclause = function () {
	        this.expectkeyword('finally');
	        return this.parseblock();
	    };
	    parser.prototype.parsetrystatement = function () {
	        var node = this.createnode();
	        this.expectkeyword('try');
	        var block = this.parseblock();
	        var handler = this.matchkeyword('catch') ? this.parsecatchclause() : null;
	        var finalizer = this.matchkeyword('finally') ? this.parsefinallyclause() : null;
	        if (!handler && !finalizer) {
	            this.throwerror(messages_1.messages.nocatchorfinally);
	        }
	        return this.finalize(node, new node.trystatement(block, handler, finalizer));
	    };
	    // https://tc39.github.io/ecma262/#sec-debugger-statement
	    parser.prototype.parsedebuggerstatement = function () {
	        var node = this.createnode();
	        this.expectkeyword('debugger');
	        this.consumesemicolon();
	        return this.finalize(node, new node.debuggerstatement());
	    };
	    // https://tc39.github.io/ecma262/#sec-ecmascript-language-statements-and-declarations
	    parser.prototype.parsestatement = function () {
	        var statement;
	        switch (this.lookahead.type) {
	            case 1 /* booleanliteral */:
	            case 5 /* nullliteral */:
	            case 6 /* numericliteral */:
	            case 8 /* stringliteral */:
	            case 10 /* template */:
	            case 9 /* regularexpression */:
	                statement = this.parseexpressionstatement();
	                break;
	            case 7 /* punctuator */:
	                var value = this.lookahead.value;
	                if (value === '{') {
	                    statement = this.parseblock();
	                }
	                else if (value === '(') {
	                    statement = this.parseexpressionstatement();
	                }
	                else if (value === ';') {
	                    statement = this.parseemptystatement();
	                }
	                else {
	                    statement = this.parseexpressionstatement();
	                }
	                break;
	            case 3 /* identifier */:
	                statement = this.matchasyncfunction() ? this.parsefunctiondeclaration() : this.parselabelledstatement();
	                break;
	            case 4 /* keyword */:
	                switch (this.lookahead.value) {
	                    case 'break':
	                        statement = this.parsebreakstatement();
	                        break;
	                    case 'continue':
	                        statement = this.parsecontinuestatement();
	                        break;
	                    case 'debugger':
	                        statement = this.parsedebuggerstatement();
	                        break;
	                    case 'do':
	                        statement = this.parsedowhilestatement();
	                        break;
	                    case 'for':
	                        statement = this.parseforstatement();
	                        break;
	                    case 'function':
	                        statement = this.parsefunctiondeclaration();
	                        break;
	                    case 'if':
	                        statement = this.parseifstatement();
	                        break;
	                    case 'return':
	                        statement = this.parsereturnstatement();
	                        break;
	                    case 'switch':
	                        statement = this.parseswitchstatement();
	                        break;
	                    case 'throw':
	                        statement = this.parsethrowstatement();
	                        break;
	                    case 'try':
	                        statement = this.parsetrystatement();
	                        break;
	                    case 'var':
	                        statement = this.parsevariablestatement();
	                        break;
	                    case 'while':
	                        statement = this.parsewhilestatement();
	                        break;
	                    case 'with':
	                        statement = this.parsewithstatement();
	                        break;
	                    default:
	                        statement = this.parseexpressionstatement();
	                        break;
	                }
	                break;
	            default:
	                statement = this.throwunexpectedtoken(this.lookahead);
	        }
	        return statement;
	    };
	    // https://tc39.github.io/ecma262/#sec-function-definitions
	    parser.prototype.parsefunctionsourceelements = function () {
	        var node = this.createnode();
	        this.expect('{');
	        var body = this.parsedirectiveprologues();
	        var previouslabelset = this.context.labelset;
	        var previousiniteration = this.context.initeration;
	        var previousinswitch = this.context.inswitch;
	        var previousinfunctionbody = this.context.infunctionbody;
	        this.context.labelset = {};
	        this.context.initeration = false;
	        this.context.inswitch = false;
	        this.context.infunctionbody = true;
	        while (this.lookahead.type !== 2 /* eof */) {
	            if (this.match('}')) {
	                break;
	            }
	            body.push(this.parsestatementlistitem());
	        }
	        this.expect('}');
	        this.context.labelset = previouslabelset;
	        this.context.initeration = previousiniteration;
	        this.context.inswitch = previousinswitch;
	        this.context.infunctionbody = previousinfunctionbody;
	        return this.finalize(node, new node.blockstatement(body));
	    };
	    parser.prototype.validateparam = function (options, param, name) {
	        var key = '$' + name;
	        if (this.context.strict) {
	            if (this.scanner.isrestrictedword(name)) {
	                options.stricted = param;
	                options.message = messages_1.messages.strictparamname;
	            }
	            if (object.prototype.hasownproperty.call(options.paramset, key)) {
	                options.stricted = param;
	                options.message = messages_1.messages.strictparamdupe;
	            }
	        }
	        else if (!options.firstrestricted) {
	            if (this.scanner.isrestrictedword(name)) {
	                options.firstrestricted = param;
	                options.message = messages_1.messages.strictparamname;
	            }
	            else if (this.scanner.isstrictmodereservedword(name)) {
	                options.firstrestricted = param;
	                options.message = messages_1.messages.strictreservedword;
	            }
	            else if (object.prototype.hasownproperty.call(options.paramset, key)) {
	                options.stricted = param;
	                options.message = messages_1.messages.strictparamdupe;
	            }
	        }
	        /* istanbul ignore next */
	        if (typeof object.defineproperty === 'function') {
	            object.defineproperty(options.paramset, key, { value: true, enumerable: true, writable: true, configurable: true });
	        }
	        else {
	            options.paramset[key] = true;
	        }
	    };
	    parser.prototype.parserestelement = function (params) {
	        var node = this.createnode();
	        this.expect('...');
	        var arg = this.parsepattern(params);
	        if (this.match('=')) {
	            this.throwerror(messages_1.messages.defaultrestparameter);
	        }
	        if (!this.match(')')) {
	            this.throwerror(messages_1.messages.parameterafterrestparameter);
	        }
	        return this.finalize(node, new node.restelement(arg));
	    };
	    parser.prototype.parseformalparameter = function (options) {
	        var params = [];
	        var param = this.match('...') ? this.parserestelement(params) : this.parsepatternwithdefault(params);
	        for (var i = 0; i < params.length; i++) {
	            this.validateparam(options, params[i], params[i].value);
	        }
	        options.simple = options.simple && (param instanceof node.identifier);
	        options.params.push(param);
	    };
	    parser.prototype.parseformalparameters = function (firstrestricted) {
	        var options;
	        options = {
	            simple: true,
	            params: [],
	            firstrestricted: firstrestricted
	        };
	        this.expect('(');
	        if (!this.match(')')) {
	            options.paramset = {};
	            while (this.lookahead.type !== 2 /* eof */) {
	                this.parseformalparameter(options);
	                if (this.match(')')) {
	                    break;
	                }
	                this.expect(',');
	                if (this.match(')')) {
	                    break;
	                }
	            }
	        }
	        this.expect(')');
	        return {
	            simple: options.simple,
	            params: options.params,
	            stricted: options.stricted,
	            firstrestricted: options.firstrestricted,
	            message: options.message
	        };
	    };
	    parser.prototype.matchasyncfunction = function () {
	        var match = this.matchcontextualkeyword('async');
	        if (match) {
	            var state = this.scanner.savestate();
	            this.scanner.scancomments();
	            var next = this.scanner.lex();
	            this.scanner.restorestate(state);
	            match = (state.linenumber === next.linenumber) && (next.type === 4 /* keyword */) && (next.value === 'function');
	        }
	        return match;
	    };
	    parser.prototype.parsefunctiondeclaration = function (identifierisoptional) {
	        var node = this.createnode();
	        var isasync = this.matchcontextualkeyword('async');
	        if (isasync) {
	            this.nexttoken();
	        }
	        this.expectkeyword('function');
	        var isgenerator = isasync ? false : this.match('*');
	        if (isgenerator) {
	            this.nexttoken();
	        }
	        var message;
	        var id = null;
	        var firstrestricted = null;
	        if (!identifierisoptional || !this.match('(')) {
	            var token = this.lookahead;
	            id = this.parsevariableidentifier();
	            if (this.context.strict) {
	                if (this.scanner.isrestrictedword(token.value)) {
	                    this.tolerateunexpectedtoken(token, messages_1.messages.strictfunctionname);
	                }
	            }
	            else {
	                if (this.scanner.isrestrictedword(token.value)) {
	                    firstrestricted = token;
	                    message = messages_1.messages.strictfunctionname;
	                }
	                else if (this.scanner.isstrictmodereservedword(token.value)) {
	                    firstrestricted = token;
	                    message = messages_1.messages.strictreservedword;
	                }
	            }
	        }
	        var previousallowawait = this.context.await;
	        var previousallowyield = this.context.allowyield;
	        this.context.await = isasync;
	        this.context.allowyield = !isgenerator;
	        var formalparameters = this.parseformalparameters(firstrestricted);
	        var params = formalparameters.params;
	        var stricted = formalparameters.stricted;
	        firstrestricted = formalparameters.firstrestricted;
	        if (formalparameters.message) {
	            message = formalparameters.message;
	        }
	        var previousstrict = this.context.strict;
	        var previousallowstrictdirective = this.context.allowstrictdirective;
	        this.context.allowstrictdirective = formalparameters.simple;
	        var body = this.parsefunctionsourceelements();
	        if (this.context.strict && firstrestricted) {
	            this.throwunexpectedtoken(firstrestricted, message);
	        }
	        if (this.context.strict && stricted) {
	            this.tolerateunexpectedtoken(stricted, message);
	        }
	        this.context.strict = previousstrict;
	        this.context.allowstrictdirective = previousallowstrictdirective;
	        this.context.await = previousallowawait;
	        this.context.allowyield = previousallowyield;
	        return isasync ? this.finalize(node, new node.asyncfunctiondeclaration(id, params, body)) :
	            this.finalize(node, new node.functiondeclaration(id, params, body, isgenerator));
	    };
	    parser.prototype.parsefunctionexpression = function () {
	        var node = this.createnode();
	        var isasync = this.matchcontextualkeyword('async');
	        if (isasync) {
	            this.nexttoken();
	        }
	        this.expectkeyword('function');
	        var isgenerator = isasync ? false : this.match('*');
	        if (isgenerator) {
	            this.nexttoken();
	        }
	        var message;
	        var id = null;
	        var firstrestricted;
	        var previousallowawait = this.context.await;
	        var previousallowyield = this.context.allowyield;
	        this.context.await = isasync;
	        this.context.allowyield = !isgenerator;
	        if (!this.match('(')) {
	            var token = this.lookahead;
	            id = (!this.context.strict && !isgenerator && this.matchkeyword('yield')) ? this.parseidentifiername() : this.parsevariableidentifier();
	            if (this.context.strict) {
	                if (this.scanner.isrestrictedword(token.value)) {
	                    this.tolerateunexpectedtoken(token, messages_1.messages.strictfunctionname);
	                }
	            }
	            else {
	                if (this.scanner.isrestrictedword(token.value)) {
	                    firstrestricted = token;
	                    message = messages_1.messages.strictfunctionname;
	                }
	                else if (this.scanner.isstrictmodereservedword(token.value)) {
	                    firstrestricted = token;
	                    message = messages_1.messages.strictreservedword;
	                }
	            }
	        }
	        var formalparameters = this.parseformalparameters(firstrestricted);
	        var params = formalparameters.params;
	        var stricted = formalparameters.stricted;
	        firstrestricted = formalparameters.firstrestricted;
	        if (formalparameters.message) {
	            message = formalparameters.message;
	        }
	        var previousstrict = this.context.strict;
	        var previousallowstrictdirective = this.context.allowstrictdirective;
	        this.context.allowstrictdirective = formalparameters.simple;
	        var body = this.parsefunctionsourceelements();
	        if (this.context.strict && firstrestricted) {
	            this.throwunexpectedtoken(firstrestricted, message);
	        }
	        if (this.context.strict && stricted) {
	            this.tolerateunexpectedtoken(stricted, message);
	        }
	        this.context.strict = previousstrict;
	        this.context.allowstrictdirective = previousallowstrictdirective;
	        this.context.await = previousallowawait;
	        this.context.allowyield = previousallowyield;
	        return isasync ? this.finalize(node, new node.asyncfunctionexpression(id, params, body)) :
	            this.finalize(node, new node.functionexpression(id, params, body, isgenerator));
	    };
	    // https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive
	    parser.prototype.parsedirective = function () {
	        var token = this.lookahead;
	        var node = this.createnode();
	        var expr = this.parseexpression();
	        var directive = (expr.type === syntax_1.syntax.literal) ? this.gettokenraw(token).slice(1, -1) : null;
	        this.consumesemicolon();
	        return this.finalize(node, directive ? new node.directive(expr, directive) : new node.expressionstatement(expr));
	    };
	    parser.prototype.parsedirectiveprologues = function () {
	        var firstrestricted = null;
	        var body = [];
	        while (true) {
	            var token = this.lookahead;
	            if (token.type !== 8 /* stringliteral */) {
	                break;
	            }
	            var statement = this.parsedirective();
	            body.push(statement);
	            var directive = statement.directive;
	            if (typeof directive !== 'string') {
	                break;
	            }
	            if (directive === 'use strict') {
	                this.context.strict = true;
	                if (firstrestricted) {
	                    this.tolerateunexpectedtoken(firstrestricted, messages_1.messages.strictoctalliteral);
	                }
	                if (!this.context.allowstrictdirective) {
	                    this.tolerateunexpectedtoken(token, messages_1.messages.illegallanguagemodedirective);
	                }
	            }
	            else {
	                if (!firstrestricted && token.octal) {
	                    firstrestricted = token;
	                }
	            }
	        }
	        return body;
	    };
	    // https://tc39.github.io/ecma262/#sec-method-definitions
	    parser.prototype.qualifiedpropertyname = function (token) {
	        switch (token.type) {
	            case 3 /* identifier */:
	            case 8 /* stringliteral */:
	            case 1 /* booleanliteral */:
	            case 5 /* nullliteral */:
	            case 6 /* numericliteral */:
	            case 4 /* keyword */:
	                return true;
	            case 7 /* punctuator */:
	                return token.value === '[';
	            default:
	                break;
	        }
	        return false;
	    };
	    parser.prototype.parsegettermethod = function () {
	        var node = this.createnode();
	        var isgenerator = false;
	        var previousallowyield = this.context.allowyield;
	        this.context.allowyield = false;
	        var formalparameters = this.parseformalparameters();
	        if (formalparameters.params.length > 0) {
	            this.tolerateerror(messages_1.messages.badgetterarity);
	        }
	        var method = this.parsepropertymethod(formalparameters);
	        this.context.allowyield = previousallowyield;
	        return this.finalize(node, new node.functionexpression(null, formalparameters.params, method, isgenerator));
	    };
	    parser.prototype.parsesettermethod = function () {
	        var node = this.createnode();
	        var isgenerator = false;
	        var previousallowyield = this.context.allowyield;
	        this.context.allowyield = false;
	        var formalparameters = this.parseformalparameters();
	        if (formalparameters.params.length !== 1) {
	            this.tolerateerror(messages_1.messages.badsetterarity);
	        }
	        else if (formalparameters.params[0] instanceof node.restelement) {
	            this.tolerateerror(messages_1.messages.badsetterrestparameter);
	        }
	        var method = this.parsepropertymethod(formalparameters);
	        this.context.allowyield = previousallowyield;
	        return this.finalize(node, new node.functionexpression(null, formalparameters.params, method, isgenerator));
	    };
	    parser.prototype.parsegeneratormethod = function () {
	        var node = this.createnode();
	        var isgenerator = true;
	        var previousallowyield = this.context.allowyield;
	        this.context.allowyield = true;
	        var params = this.parseformalparameters();
	        this.context.allowyield = false;
	        var method = this.parsepropertymethod(params);
	        this.context.allowyield = previousallowyield;
	        return this.finalize(node, new node.functionexpression(null, params.params, method, isgenerator));
	    };
	    // https://tc39.github.io/ecma262/#sec-generator-function-definitions
	    parser.prototype.isstartofexpression = function () {
	        var start = true;
	        var value = this.lookahead.value;
	        switch (this.lookahead.type) {
	            case 7 /* punctuator */:
	                start = (value === '[') || (value === '(') || (value === '{') ||
	                    (value === '+') || (value === '-') ||
	                    (value === '!') || (value === '~') ||
	                    (value === '++') || (value === '--') ||
	                    (value === '/') || (value === '/='); // regular expression literal
	                break;
	            case 4 /* keyword */:
	                start = (value === 'class') || (value === 'delete') ||
	                    (value === 'function') || (value === 'let') || (value === 'new') ||
	                    (value === 'super') || (value === 'this') || (value === 'typeof') ||
	                    (value === 'void') || (value === 'yield');
	                break;
	            default:
	                break;
	        }
	        return start;
	    };
	    parser.prototype.parseyieldexpression = function () {
	        var node = this.createnode();
	        this.expectkeyword('yield');
	        var argument = null;
	        var delegate = false;
	        if (!this.haslineterminator) {
	            var previousallowyield = this.context.allowyield;
	            this.context.allowyield = false;
	            delegate = this.match('*');
	            if (delegate) {
	                this.nexttoken();
	                argument = this.parseassignmentexpression();
	            }
	            else if (this.isstartofexpression()) {
	                argument = this.parseassignmentexpression();
	            }
	            this.context.allowyield = previousallowyield;
	        }
	        return this.finalize(node, new node.yieldexpression(argument, delegate));
	    };
	    // https://tc39.github.io/ecma262/#sec-class-definitions
	    parser.prototype.parseclasselement = function (hasconstructor) {
	        var token = this.lookahead;
	        var node = this.createnode();
	        var kind = '';
	        var key = null;
	        var value = null;
	        var computed = false;
	        var method = false;
	        var isstatic = false;
	        var isasync = false;
	        if (this.match('*')) {
	            this.nexttoken();
	        }
	        else {
	            computed = this.match('[');
	            key = this.parseobjectpropertykey();
	            var id = key;
	            if (id.name === 'static' && (this.qualifiedpropertyname(this.lookahead) || this.match('*'))) {
	                token = this.lookahead;
	                isstatic = true;
	                computed = this.match('[');
	                if (this.match('*')) {
	                    this.nexttoken();
	                }
	                else {
	                    key = this.parseobjectpropertykey();
	                }
	            }
	            if ((token.type === 3 /* identifier */) && !this.haslineterminator && (token.value === 'async')) {
	                var punctuator = this.lookahead.value;
	                if (punctuator !== ':' && punctuator !== '(' && punctuator !== '*') {
	                    isasync = true;
	                    token = this.lookahead;
	                    key = this.parseobjectpropertykey();
	                    if (token.type === 3 /* identifier */) {
	                        if (token.value === 'get' || token.value === 'set') {
	                            this.tolerateunexpectedtoken(token);
	                        }
	                        else if (token.value === 'constructor') {
	                            this.tolerateunexpectedtoken(token, messages_1.messages.constructorisasync);
	                        }
	                    }
	                }
	            }
	        }
	        var lookaheadpropertykey = this.qualifiedpropertyname(this.lookahead);
	        if (token.type === 3 /* identifier */) {
	            if (token.value === 'get' && lookaheadpropertykey) {
	                kind = 'get';
	                computed = this.match('[');
	                key = this.parseobjectpropertykey();
	                this.context.allowyield = false;
	                value = this.parsegettermethod();
	            }
	            else if (token.value === 'set' && lookaheadpropertykey) {
	                kind = 'set';
	                computed = this.match('[');
	                key = this.parseobjectpropertykey();
	                value = this.parsesettermethod();
	            }
	        }
	        else if (token.type === 7 /* punctuator */ && token.value === '*' && lookaheadpropertykey) {
	            kind = 'init';
	            computed = this.match('[');
	            key = this.parseobjectpropertykey();
	            value = this.parsegeneratormethod();
	            method = true;
	        }
	        if (!kind && key && this.match('(')) {
	            kind = 'init';
	            value = isasync ? this.parsepropertymethodasyncfunction() : this.parsepropertymethodfunction();
	            method = true;
	        }
	        if (!kind) {
	            this.throwunexpectedtoken(this.lookahead);
	        }
	        if (kind === 'init') {
	            kind = 'method';
	        }
	        if (!computed) {
	            if (isstatic && this.ispropertykey(key, 'prototype')) {
	                this.throwunexpectedtoken(token, messages_1.messages.staticprototype);
	            }
	            if (!isstatic && this.ispropertykey(key, 'constructor')) {
	                if (kind !== 'method' || !method || (value && value.generator)) {
	                    this.throwunexpectedtoken(token, messages_1.messages.constructorspecialmethod);
	                }
	                if (hasconstructor.value) {
	                    this.throwunexpectedtoken(token, messages_1.messages.duplicateconstructor);
	                }
	                else {
	                    hasconstructor.value = true;
	                }
	                kind = 'constructor';
	            }
	        }
	        return this.finalize(node, new node.methoddefinition(key, computed, value, kind, isstatic));
	    };
	    parser.prototype.parseclasselementlist = function () {
	        var body = [];
	        var hasconstructor = { value: false };
	        this.expect('{');
	        while (!this.match('}')) {
	            if (this.match(';')) {
	                this.nexttoken();
	            }
	            else {
	                body.push(this.parseclasselement(hasconstructor));
	            }
	        }
	        this.expect('}');
	        return body;
	    };
	    parser.prototype.parseclassbody = function () {
	        var node = this.createnode();
	        var elementlist = this.parseclasselementlist();
	        return this.finalize(node, new node.classbody(elementlist));
	    };
	    parser.prototype.parseclassdeclaration = function (identifierisoptional) {
	        var node = this.createnode();
	        var previousstrict = this.context.strict;
	        this.context.strict = true;
	        this.expectkeyword('class');
	        var id = (identifierisoptional && (this.lookahead.type !== 3 /* identifier */)) ? null : this.parsevariableidentifier();
	        var superclass = null;
	        if (this.matchkeyword('extends')) {
	            this.nexttoken();
	            superclass = this.isolatecovergrammar(this.parselefthandsideexpressionallowcall);
	        }
	        var classbody = this.parseclassbody();
	        this.context.strict = previousstrict;
	        return this.finalize(node, new node.classdeclaration(id, superclass, classbody));
	    };
	    parser.prototype.parseclassexpression = function () {
	        var node = this.createnode();
	        var previousstrict = this.context.strict;
	        this.context.strict = true;
	        this.expectkeyword('class');
	        var id = (this.lookahead.type === 3 /* identifier */) ? this.parsevariableidentifier() : null;
	        var superclass = null;
	        if (this.matchkeyword('extends')) {
	            this.nexttoken();
	            superclass = this.isolatecovergrammar(this.parselefthandsideexpressionallowcall);
	        }
	        var classbody = this.parseclassbody();
	        this.context.strict = previousstrict;
	        return this.finalize(node, new node.classexpression(id, superclass, classbody));
	    };
	    // https://tc39.github.io/ecma262/#sec-scripts
	    // https://tc39.github.io/ecma262/#sec-modules
	    parser.prototype.parsemodule = function () {
	        this.context.strict = true;
	        this.context.ismodule = true;
	        var node = this.createnode();
	        var body = this.parsedirectiveprologues();
	        while (this.lookahead.type !== 2 /* eof */) {
	            body.push(this.parsestatementlistitem());
	        }
	        return this.finalize(node, new node.module(body));
	    };
	    parser.prototype.parsescript = function () {
	        var node = this.createnode();
	        var body = this.parsedirectiveprologues();
	        while (this.lookahead.type !== 2 /* eof */) {
	            body.push(this.parsestatementlistitem());
	        }
	        return this.finalize(node, new node.script(body));
	    };
	    // https://tc39.github.io/ecma262/#sec-imports
	    parser.prototype.parsemodulespecifier = function () {
	        var node = this.createnode();
	        if (this.lookahead.type !== 8 /* stringliteral */) {
	            this.throwerror(messages_1.messages.invalidmodulespecifier);
	        }
	        var token = this.nexttoken();
	        var raw = this.gettokenraw(token);
	        return this.finalize(node, new node.literal(token.value, raw));
	    };
	    // import {<foo as bar>} ...;
	    parser.prototype.parseimportspecifier = function () {
	        var node = this.createnode();
	        var imported;
	        var local;
	        if (this.lookahead.type === 3 /* identifier */) {
	            imported = this.parsevariableidentifier();
	            local = imported;
	            if (this.matchcontextualkeyword('as')) {
	                this.nexttoken();
	                local = this.parsevariableidentifier();
	            }
	        }
	        else {
	            imported = this.parseidentifiername();
	            local = imported;
	            if (this.matchcontextualkeyword('as')) {
	                this.nexttoken();
	                local = this.parsevariableidentifier();
	            }
	            else {
	                this.throwunexpectedtoken(this.nexttoken());
	            }
	        }
	        return this.finalize(node, new node.importspecifier(local, imported));
	    };
	    // {foo, bar as bas}
	    parser.prototype.parsenamedimports = function () {
	        this.expect('{');
	        var specifiers = [];
	        while (!this.match('}')) {
	            specifiers.push(this.parseimportspecifier());
	            if (!this.match('}')) {
	                this.expect(',');
	            }
	        }
	        this.expect('}');
	        return specifiers;
	    };
	    // import <foo> ...;
	    parser.prototype.parseimportdefaultspecifier = function () {
	        var node = this.createnode();
	        var local = this.parseidentifiername();
	        return this.finalize(node, new node.importdefaultspecifier(local));
	    };
	    // import <* as foo> ...;
	    parser.prototype.parseimportnamespacespecifier = function () {
	        var node = this.createnode();
	        this.expect('*');
	        if (!this.matchcontextualkeyword('as')) {
	            this.throwerror(messages_1.messages.noasafterimportnamespace);
	        }
	        this.nexttoken();
	        var local = this.parseidentifiername();
	        return this.finalize(node, new node.importnamespacespecifier(local));
	    };
	    parser.prototype.parseimportdeclaration = function () {
	        if (this.context.infunctionbody) {
	            this.throwerror(messages_1.messages.illegalimportdeclaration);
	        }
	        var node = this.createnode();
	        this.expectkeyword('import');
	        var src;
	        var specifiers = [];
	        if (this.lookahead.type === 8 /* stringliteral */) {
	            // import 'foo';
	            src = this.parsemodulespecifier();
	        }
	        else {
	            if (this.match('{')) {
	                // import {bar}
	                specifiers = specifiers.concat(this.parsenamedimports());
	            }
	            else if (this.match('*')) {
	                // import * as foo
	                specifiers.push(this.parseimportnamespacespecifier());
	            }
	            else if (this.isidentifiername(this.lookahead) && !this.matchkeyword('default')) {
	                // import foo
	                specifiers.push(this.parseimportdefaultspecifier());
	                if (this.match(',')) {
	                    this.nexttoken();
	                    if (this.match('*')) {
	                        // import foo, * as foo
	                        specifiers.push(this.parseimportnamespacespecifier());
	                    }
	                    else if (this.match('{')) {
	                        // import foo, {bar}
	                        specifiers = specifiers.concat(this.parsenamedimports());
	                    }
	                    else {
	                        this.throwunexpectedtoken(this.lookahead);
	                    }
	                }
	            }
	            else {
	                this.throwunexpectedtoken(this.nexttoken());
	            }
	            if (!this.matchcontextualkeyword('from')) {
	                var message = this.lookahead.value ? messages_1.messages.unexpectedtoken : messages_1.messages.missingfromclause;
	                this.throwerror(message, this.lookahead.value);
	            }
	            this.nexttoken();
	            src = this.parsemodulespecifier();
	        }
	        this.consumesemicolon();
	        return this.finalize(node, new node.importdeclaration(specifiers, src));
	    };
	    // https://tc39.github.io/ecma262/#sec-exports
	    parser.prototype.parseexportspecifier = function () {
	        var node = this.createnode();
	        var local = this.parseidentifiername();
	        var exported = local;
	        if (this.matchcontextualkeyword('as')) {
	            this.nexttoken();
	            exported = this.parseidentifiername();
	        }
	        return this.finalize(node, new node.exportspecifier(local, exported));
	    };
	    parser.prototype.parseexportdeclaration = function () {
	        if (this.context.infunctionbody) {
	            this.throwerror(messages_1.messages.illegalexportdeclaration);
	        }
	        var node = this.createnode();
	        this.expectkeyword('export');
	        var exportdeclaration;
	        if (this.matchkeyword('default')) {
	            // export default ...
	            this.nexttoken();
	            if (this.matchkeyword('function')) {
	                // export default function foo () {}
	                // export default function () {}
	                var declaration = this.parsefunctiondeclaration(true);
	                exportdeclaration = this.finalize(node, new node.exportdefaultdeclaration(declaration));
	            }
	            else if (this.matchkeyword('class')) {
	                // export default class foo {}
	                var declaration = this.parseclassdeclaration(true);
	                exportdeclaration = this.finalize(node, new node.exportdefaultdeclaration(declaration));
	            }
	            else if (this.matchcontextualkeyword('async')) {
	                // export default async function f () {}
	                // export default async function () {}
	                // export default async x => x
	                var declaration = this.matchasyncfunction() ? this.parsefunctiondeclaration(true) : this.parseassignmentexpression();
	                exportdeclaration = this.finalize(node, new node.exportdefaultdeclaration(declaration));
	            }
	            else {
	                if (this.matchcontextualkeyword('from')) {
	                    this.throwerror(messages_1.messages.unexpectedtoken, this.lookahead.value);
	                }
	                // export default {};
	                // export default [];
	                // export default (1 + 2);
	                var declaration = this.match('{') ? this.parseobjectinitializer() :
	                    this.match('[') ? this.parsearrayinitializer() : this.parseassignmentexpression();
	                this.consumesemicolon();
	                exportdeclaration = this.finalize(node, new node.exportdefaultdeclaration(declaration));
	            }
	        }
	        else if (this.match('*')) {
	            // export * from 'foo';
	            this.nexttoken();
	            if (!this.matchcontextualkeyword('from')) {
	                var message = this.lookahead.value ? messages_1.messages.unexpectedtoken : messages_1.messages.missingfromclause;
	                this.throwerror(message, this.lookahead.value);
	            }
	            this.nexttoken();
	            var src = this.parsemodulespecifier();
	            this.consumesemicolon();
	            exportdeclaration = this.finalize(node, new node.exportalldeclaration(src));
	        }
	        else if (this.lookahead.type === 4 /* keyword */) {
	            // export var f = 1;
	            var declaration = void 0;
	            switch (this.lookahead.value) {
	                case 'let':
	                case 'const':
	                    declaration = this.parselexicaldeclaration({ infor: false });
	                    break;
	                case 'var':
	                case 'class':
	                case 'function':
	                    declaration = this.parsestatementlistitem();
	                    break;
	                default:
	                    this.throwunexpectedtoken(this.lookahead);
	            }
	            exportdeclaration = this.finalize(node, new node.exportnameddeclaration(declaration, [], null));
	        }
	        else if (this.matchasyncfunction()) {
	            var declaration = this.parsefunctiondeclaration();
	            exportdeclaration = this.finalize(node, new node.exportnameddeclaration(declaration, [], null));
	        }
	        else {
	            var specifiers = [];
	            var source = null;
	            var isexportfromidentifier = false;
	            this.expect('{');
	            while (!this.match('}')) {
	                isexportfromidentifier = isexportfromidentifier || this.matchkeyword('default');
	                specifiers.push(this.parseexportspecifier());
	                if (!this.match('}')) {
	                    this.expect(',');
	                }
	            }
	            this.expect('}');
	            if (this.matchcontextualkeyword('from')) {
	                // export {default} from 'foo';
	                // export {foo} from 'foo';
	                this.nexttoken();
	                source = this.parsemodulespecifier();
	                this.consumesemicolon();
	            }
	            else if (isexportfromidentifier) {
	                // export {default}; // missing fromclause
	                var message = this.lookahead.value ? messages_1.messages.unexpectedtoken : messages_1.messages.missingfromclause;
	                this.throwerror(message, this.lookahead.value);
	            }
	            else {
	                // export {foo};
	                this.consumesemicolon();
	            }
	            exportdeclaration = this.finalize(node, new node.exportnameddeclaration(null, specifiers, source));
	        }
	        return exportdeclaration;
	    };
	    return parser;
	}());
	exports.parser = parser;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	// ensure the condition is true, otherwise throw an error.
	// this is only to have a better contract semantic, i.e. another safety net
	// to catch a logic error. the condition shall be fulfilled in normal case.
	// do not use this to enforce a certain condition on any user input.
	object.defineproperty(exports, "__esmodule", { value: true });
	function assert(condition, message) {
	    /* istanbul ignore if */
	    if (!condition) {
	        throw new error('assert: ' + message);
	    }
	}
	exports.assert = assert;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	/* tslint:disable:max-classes-per-file */
	object.defineproperty(exports, "__esmodule", { value: true });
	var errorhandler = (function () {
	    function errorhandler() {
	        this.errors = [];
	        this.tolerant = false;
	    }
	    errorhandler.prototype.recorderror = function (error) {
	        this.errors.push(error);
	    };
	    errorhandler.prototype.tolerate = function (error) {
	        if (this.tolerant) {
	            this.recorderror(error);
	        }
	        else {
	            throw error;
	        }
	    };
	    errorhandler.prototype.constructerror = function (msg, column) {
	        var error = new error(msg);
	        try {
	            throw error;
	        }
	        catch (base) {
	            /* istanbul ignore else */
	            if (object.create && object.defineproperty) {
	                error = object.create(base);
	                object.defineproperty(error, 'column', { value: column });
	            }
	        }
	        /* istanbul ignore next */
	        return error;
	    };
	    errorhandler.prototype.createerror = function (index, line, col, description) {
	        var msg = 'line ' + line + ': ' + description;
	        var error = this.constructerror(msg, col);
	        error.index = index;
	        error.linenumber = line;
	        error.description = description;
	        return error;
	    };
	    errorhandler.prototype.throwerror = function (index, line, col, description) {
	        throw this.createerror(index, line, col, description);
	    };
	    errorhandler.prototype.tolerateerror = function (index, line, col, description) {
	        var error = this.createerror(index, line, col, description);
	        if (this.tolerant) {
	            this.recorderror(error);
	        }
	        else {
	            throw error;
	        }
	    };
	    return errorhandler;
	}());
	exports.errorhandler = errorhandler;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	// error messages should be identical to v8.
	exports.messages = {
	    badgetterarity: 'getter must not have any formal parameters',
	    badsetterarity: 'setter must have exactly one formal parameter',
	    badsetterrestparameter: 'setter function argument must not be a rest parameter',
	    constructorisasync: 'class constructor may not be an async method',
	    constructorspecialmethod: 'class constructor may not be an accessor',
	    declarationmissinginitializer: 'missing initializer in %0 declaration',
	    defaultrestparameter: 'unexpected token =',
	    duplicatebinding: 'duplicate binding %0',
	    duplicateconstructor: 'a class may only have one constructor',
	    duplicateprotoproperty: 'duplicate __proto__ fields are not allowed in object literals',
	    forinofloopinitializer: '%0 loop variable declaration may not have an initializer',
	    generatorinlegacycontext: 'generator declarations are not allowed in legacy contexts',
	    illegalbreak: 'illegal break statement',
	    illegalcontinue: 'illegal continue statement',
	    illegalexportdeclaration: 'unexpected token',
	    illegalimportdeclaration: 'unexpected token',
	    illegallanguagemodedirective: 'illegal \'use strict\' directive in function with non-simple parameter list',
	    illegalreturn: 'illegal return statement',
	    invalidescapedreservedword: 'keyword must not contain escaped characters',
	    invalidhexescapesequence: 'invalid hexadecimal escape sequence',
	    invalidlhsinassignment: 'invalid left-hand side in assignment',
	    invalidlhsinforin: 'invalid left-hand side in for-in',
	    invalidlhsinforloop: 'invalid left-hand side in for-loop',
	    invalidmodulespecifier: 'unexpected token',
	    invalidregexp: 'invalid regular expression',
	    letinlexicalbinding: 'let is disallowed as a lexically bound name',
	    missingfromclause: 'unexpected token',
	    multipledefaultsinswitch: 'more than one default clause in switch statement',
	    newlineafterthrow: 'illegal newline after throw',
	    noasafterimportnamespace: 'unexpected token',
	    nocatchorfinally: 'missing catch or finally after try',
	    parameterafterrestparameter: 'rest parameter must be last formal parameter',
	    redeclaration: '%0 \'%1\' has already been declared',
	    staticprototype: 'classes may not have static property named prototype',
	    strictcatchvariable: 'catch variable may not be eval or arguments in strict mode',
	    strictdelete: 'delete of an unqualified identifier in strict mode.',
	    strictfunction: 'in strict mode code, functions can only be declared at top level or inside a block',
	    strictfunctionname: 'function name may not be eval or arguments in strict mode',
	    strictlhsassignment: 'assignment to eval or arguments is not allowed in strict mode',
	    strictlhspostfix: 'postfix increment/decrement may not have eval or arguments operand in strict mode',
	    strictlhsprefix: 'prefix increment/decrement may not have eval or arguments operand in strict mode',
	    strictmodewith: 'strict mode code may not include a with statement',
	    strictoctalliteral: 'octal literals are not allowed in strict mode.',
	    strictparamdupe: 'strict mode function may not have duplicate parameter names',
	    strictparamname: 'parameter name eval or arguments is not allowed in strict mode',
	    strictreservedword: 'use of future reserved word in strict mode',
	    strictvarname: 'variable name may not be eval or arguments in strict mode',
	    templateoctalliteral: 'octal literals are not allowed in template strings.',
	    unexpectedeos: 'unexpected end of input',
	    unexpectedidentifier: 'unexpected identifier',
	    unexpectednumber: 'unexpected number',
	    unexpectedreserved: 'unexpected reserved word',
	    unexpectedstring: 'unexpected string',
	    unexpectedtemplate: 'unexpected quasi %0',
	    unexpectedtoken: 'unexpected token %0',
	    unexpectedtokenillegal: 'unexpected token illegal',
	    unknownlabel: 'undefined label \'%0\'',
	    unterminatedregexp: 'invalid regular expression: missing /'
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	var assert_1 = __webpack_require__(9);
	var character_1 = __webpack_require__(4);
	var messages_1 = __webpack_require__(11);
	function hexvalue(ch) {
	    return '0123456789abcdef'.indexof(ch.tolowercase());
	}
	function octalvalue(ch) {
	    return '01234567'.indexof(ch);
	}
	var scanner = (function () {
	    function scanner(code, handler) {
	        this.source = code;
	        this.errorhandler = handler;
	        this.trackcomment = false;
	        this.length = code.length;
	        this.index = 0;
	        this.linenumber = (code.length > 0) ? 1 : 0;
	        this.linestart = 0;
	        this.curlystack = [];
	    }
	    scanner.prototype.savestate = function () {
	        return {
	            index: this.index,
	            linenumber: this.linenumber,
	            linestart: this.linestart
	        };
	    };
	    scanner.prototype.restorestate = function (state) {
	        this.index = state.index;
	        this.linenumber = state.linenumber;
	        this.linestart = state.linestart;
	    };
	    scanner.prototype.eof = function () {
	        return this.index >= this.length;
	    };
	    scanner.prototype.throwunexpectedtoken = function (message) {
	        if (message === void 0) { message = messages_1.messages.unexpectedtokenillegal; }
	        return this.errorhandler.throwerror(this.index, this.linenumber, this.index - this.linestart + 1, message);
	    };
	    scanner.prototype.tolerateunexpectedtoken = function (message) {
	        if (message === void 0) { message = messages_1.messages.unexpectedtokenillegal; }
	        this.errorhandler.tolerateerror(this.index, this.linenumber, this.index - this.linestart + 1, message);
	    };
	    // https://tc39.github.io/ecma262/#sec-comments
	    scanner.prototype.skipsinglelinecomment = function (offset) {
	        var comments = [];
	        var start, loc;
	        if (this.trackcomment) {
	            comments = [];
	            start = this.index - offset;
	            loc = {
	                start: {
	                    line: this.linenumber,
	                    column: this.index - this.linestart - offset
	                },
	                end: {}
	            };
	        }
	        while (!this.eof()) {
	            var ch = this.source.charcodeat(this.index);
	            ++this.index;
	            if (character_1.character.islineterminator(ch)) {
	                if (this.trackcomment) {
	                    loc.end = {
	                        line: this.linenumber,
	                        column: this.index - this.linestart - 1
	                    };
	                    var entry = {
	                        multiline: false,
	                        slice: [start + offset, this.index - 1],
	                        range: [start, this.index - 1],
	                        loc: loc
	                    };
	                    comments.push(entry);
	                }
	                if (ch === 13 && this.source.charcodeat(this.index) === 10) {
	                    ++this.index;
	                }
	                ++this.linenumber;
	                this.linestart = this.index;
	                return comments;
	            }
	        }
	        if (this.trackcomment) {
	            loc.end = {
	                line: this.linenumber,
	                column: this.index - this.linestart
	            };
	            var entry = {
	                multiline: false,
	                slice: [start + offset, this.index],
	                range: [start, this.index],
	                loc: loc
	            };
	            comments.push(entry);
	        }
	        return comments;
	    };
	    scanner.prototype.skipmultilinecomment = function () {
	        var comments = [];
	        var start, loc;
	        if (this.trackcomment) {
	            comments = [];
	            start = this.index - 2;
	            loc = {
	                start: {
	                    line: this.linenumber,
	                    column: this.index - this.linestart - 2
	                },
	                end: {}
	            };
	        }
	        while (!this.eof()) {
	            var ch = this.source.charcodeat(this.index);
	            if (character_1.character.islineterminator(ch)) {
	                if (ch === 0x0d && this.source.charcodeat(this.index + 1) === 0x0a) {
	                    ++this.index;
	                }
	                ++this.linenumber;
	                ++this.index;
	                this.linestart = this.index;
	            }
	            else if (ch === 0x2a) {
	                // block comment ends with '*/'.
	                if (this.source.charcodeat(this.index + 1) === 0x2f) {
	                    this.index += 2;
	                    if (this.trackcomment) {
	                        loc.end = {
	                            line: this.linenumber,
	                            column: this.index - this.linestart
	                        };
	                        var entry = {
	                            multiline: true,
	                            slice: [start + 2, this.index - 2],
	                            range: [start, this.index],
	                            loc: loc
	                        };
	                        comments.push(entry);
	                    }
	                    return comments;
	                }
	                ++this.index;
	            }
	            else {
	                ++this.index;
	            }
	        }
	        // ran off the end of the file - the whole thing is a comment
	        if (this.trackcomment) {
	            loc.end = {
	                line: this.linenumber,
	                column: this.index - this.linestart
	            };
	            var entry = {
	                multiline: true,
	                slice: [start + 2, this.index],
	                range: [start, this.index],
	                loc: loc
	            };
	            comments.push(entry);
	        }
	        this.tolerateunexpectedtoken();
	        return comments;
	    };
	    scanner.prototype.scancomments = function () {
	        var comments;
	        if (this.trackcomment) {
	            comments = [];
	        }
	        var start = (this.index === 0);
	        while (!this.eof()) {
	            var ch = this.source.charcodeat(this.index);
	            if (character_1.character.iswhitespace(ch)) {
	                ++this.index;
	            }
	            else if (character_1.character.islineterminator(ch)) {
	                ++this.index;
	                if (ch === 0x0d && this.source.charcodeat(this.index) === 0x0a) {
	                    ++this.index;
	                }
	                ++this.linenumber;
	                this.linestart = this.index;
	                start = true;
	            }
	            else if (ch === 0x2f) {
	                ch = this.source.charcodeat(this.index + 1);
	                if (ch === 0x2f) {
	                    this.index += 2;
	                    var comment = this.skipsinglelinecomment(2);
	                    if (this.trackcomment) {
	                        comments = comments.concat(comment);
	                    }
	                    start = true;
	                }
	                else if (ch === 0x2a) {
	                    this.index += 2;
	                    var comment = this.skipmultilinecomment();
	                    if (this.trackcomment) {
	                        comments = comments.concat(comment);
	                    }
	                }
	                else {
	                    break;
	                }
	            }
	            else if (start && ch === 0x2d) {
	                // u+003e is '>'
	                if ((this.source.charcodeat(this.index + 1) === 0x2d) && (this.source.charcodeat(this.index + 2) === 0x3e)) {
	                    // '-->' is a single-line comment
	                    this.index += 3;
	                    var comment = this.skipsinglelinecomment(3);
	                    if (this.trackcomment) {
	                        comments = comments.concat(comment);
	                    }
	                }
	                else {
	                    break;
	                }
	            }
	            else if (ch === 0x3c) {
	                if (this.source.slice(this.index + 1, this.index + 4) === '!--') {
	                    this.index += 4; // `<!--`
	                    var comment = this.skipsinglelinecomment(4);
	                    if (this.trackcomment) {
	                        comments = comments.concat(comment);
	                    }
	                }
	                else {
	                    break;
	                }
	            }
	            else {
	                break;
	            }
	        }
	        return comments;
	    };
	    // https://tc39.github.io/ecma262/#sec-future-reserved-words
	    scanner.prototype.isfuturereservedword = function (id) {
	        switch (id) {
	            case 'enum':
	            case 'export':
	            case 'import':
	            case 'super':
	                return true;
	            default:
	                return false;
	        }
	    };
	    scanner.prototype.isstrictmodereservedword = function (id) {
	        switch (id) {
	            case 'implements':
	            case 'interface':
	            case 'package':
	            case 'private':
	            case 'protected':
	            case 'public':
	            case 'static':
	            case 'yield':
	            case 'let':
	                return true;
	            default:
	                return false;
	        }
	    };
	    scanner.prototype.isrestrictedword = function (id) {
	        return id === 'eval' || id === 'arguments';
	    };
	    // https://tc39.github.io/ecma262/#sec-keywords
	    scanner.prototype.iskeyword = function (id) {
	        switch (id.length) {
	            case 2:
	                return (id === 'if') || (id === 'in') || (id === 'do');
	            case 3:
	                return (id === 'var') || (id === 'for') || (id === 'new') ||
	                    (id === 'try') || (id === 'let');
	            case 4:
	                return (id === 'this') || (id === 'else') || (id === 'case') ||
	                    (id === 'void') || (id === 'with') || (id === 'enum');
	            case 5:
	                return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                    (id === 'throw') || (id === 'const') || (id === 'yield') ||
	                    (id === 'class') || (id === 'super');
	            case 6:
	                return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                    (id === 'switch') || (id === 'export') || (id === 'import');
	            case 7:
	                return (id === 'default') || (id === 'finally') || (id === 'extends');
	            case 8:
	                return (id === 'function') || (id === 'continue') || (id === 'debugger');
	            case 10:
	                return (id === 'instanceof');
	            default:
	                return false;
	        }
	    };
	    scanner.prototype.codepointat = function (i) {
	        var cp = this.source.charcodeat(i);
	        if (cp >= 0xd800 && cp <= 0xdbff) {
	            var second = this.source.charcodeat(i + 1);
	            if (second >= 0xdc00 && second <= 0xdfff) {
	                var first = cp;
	                cp = (first - 0xd800) * 0x400 + second - 0xdc00 + 0x10000;
	            }
	        }
	        return cp;
	    };
	    scanner.prototype.scanhexescape = function (prefix) {
	        var len = (prefix === 'u') ? 4 : 2;
	        var code = 0;
	        for (var i = 0; i < len; ++i) {
	            if (!this.eof() && character_1.character.ishexdigit(this.source.charcodeat(this.index))) {
	                code = code * 16 + hexvalue(this.source[this.index++]);
	            }
	            else {
	                return null;
	            }
	        }
	        return string.fromcharcode(code);
	    };
	    scanner.prototype.scanunicodecodepointescape = function () {
	        var ch = this.source[this.index];
	        var code = 0;
	        // at least, one hex digit is required.
	        if (ch === '}') {
	            this.throwunexpectedtoken();
	        }
	        while (!this.eof()) {
	            ch = this.source[this.index++];
	            if (!character_1.character.ishexdigit(ch.charcodeat(0))) {
	                break;
	            }
	            code = code * 16 + hexvalue(ch);
	        }
	        if (code > 0x10ffff || ch !== '}') {
	            this.throwunexpectedtoken();
	        }
	        return character_1.character.fromcodepoint(code);
	    };
	    scanner.prototype.getidentifier = function () {
	        var start = this.index++;
	        while (!this.eof()) {
	            var ch = this.source.charcodeat(this.index);
	            if (ch === 0x5c) {
	                // blackslash (u+005c) marks unicode escape sequence.
	                this.index = start;
	                return this.getcomplexidentifier();
	            }
	            else if (ch >= 0xd800 && ch < 0xdfff) {
	                // need to handle surrogate pairs.
	                this.index = start;
	                return this.getcomplexidentifier();
	            }
	            if (character_1.character.isidentifierpart(ch)) {
	                ++this.index;
	            }
	            else {
	                break;
	            }
	        }
	        return this.source.slice(start, this.index);
	    };
	    scanner.prototype.getcomplexidentifier = function () {
	        var cp = this.codepointat(this.index);
	        var id = character_1.character.fromcodepoint(cp);
	        this.index += id.length;
	        // '\u' (u+005c, u+0075) denotes an escaped character.
	        var ch;
	        if (cp === 0x5c) {
	            if (this.source.charcodeat(this.index) !== 0x75) {
	                this.throwunexpectedtoken();
	            }
	            ++this.index;
	            if (this.source[this.index] === '{') {
	                ++this.index;
	                ch = this.scanunicodecodepointescape();
	            }
	            else {
	                ch = this.scanhexescape('u');
	                if (ch === null || ch === '\\' || !character_1.character.isidentifierstart(ch.charcodeat(0))) {
	                    this.throwunexpectedtoken();
	                }
	            }
	            id = ch;
	        }
	        while (!this.eof()) {
	            cp = this.codepointat(this.index);
	            if (!character_1.character.isidentifierpart(cp)) {
	                break;
	            }
	            ch = character_1.character.fromcodepoint(cp);
	            id += ch;
	            this.index += ch.length;
	            // '\u' (u+005c, u+0075) denotes an escaped character.
	            if (cp === 0x5c) {
	                id = id.substr(0, id.length - 1);
	                if (this.source.charcodeat(this.index) !== 0x75) {
	                    this.throwunexpectedtoken();
	                }
	                ++this.index;
	                if (this.source[this.index] === '{') {
	                    ++this.index;
	                    ch = this.scanunicodecodepointescape();
	                }
	                else {
	                    ch = this.scanhexescape('u');
	                    if (ch === null || ch === '\\' || !character_1.character.isidentifierpart(ch.charcodeat(0))) {
	                        this.throwunexpectedtoken();
	                    }
	                }
	                id += ch;
	            }
	        }
	        return id;
	    };
	    scanner.prototype.octaltodecimal = function (ch) {
	        // \0 is not octal escape sequence
	        var octal = (ch !== '0');
	        var code = octalvalue(ch);
	        if (!this.eof() && character_1.character.isoctaldigit(this.source.charcodeat(this.index))) {
	            octal = true;
	            code = code * 8 + octalvalue(this.source[this.index++]);
	            // 3 digits are only allowed when string starts
	            // with 0, 1, 2, 3
	            if ('0123'.indexof(ch) >= 0 && !this.eof() && character_1.character.isoctaldigit(this.source.charcodeat(this.index))) {
	                code = code * 8 + octalvalue(this.source[this.index++]);
	            }
	        }
	        return {
	            code: code,
	            octal: octal
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-names-and-keywords
	    scanner.prototype.scanidentifier = function () {
	        var type;
	        var start = this.index;
	        // backslash (u+005c) starts an escaped character.
	        var id = (this.source.charcodeat(start) === 0x5c) ? this.getcomplexidentifier() : this.getidentifier();
	        // there is no keyword or literal with only one character.
	        // thus, it must be an identifier.
	        if (id.length === 1) {
	            type = 3 /* identifier */;
	        }
	        else if (this.iskeyword(id)) {
	            type = 4 /* keyword */;
	        }
	        else if (id === 'null') {
	            type = 5 /* nullliteral */;
	        }
	        else if (id === 'true' || id === 'false') {
	            type = 1 /* booleanliteral */;
	        }
	        else {
	            type = 3 /* identifier */;
	        }
	        if (type !== 3 /* identifier */ && (start + id.length !== this.index)) {
	            var restore = this.index;
	            this.index = start;
	            this.tolerateunexpectedtoken(messages_1.messages.invalidescapedreservedword);
	            this.index = restore;
	        }
	        return {
	            type: type,
	            value: id,
	            linenumber: this.linenumber,
	            linestart: this.linestart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-punctuators
	    scanner.prototype.scanpunctuator = function () {
	        var start = this.index;
	        // check for most common single-character punctuators.
	        var str = this.source[this.index];
	        switch (str) {
	            case '(':
	            case '{':
	                if (str === '{') {
	                    this.curlystack.push('{');
	                }
	                ++this.index;
	                break;
	            case '.':
	                ++this.index;
	                if (this.source[this.index] === '.' && this.source[this.index + 1] === '.') {
	                    // spread operator: ...
	                    this.index += 2;
	                    str = '...';
	                }
	                break;
	            case '}':
	                ++this.index;
	                this.curlystack.pop();
	                break;
	            case ')':
	            case ';':
	            case ',':
	            case '[':
	            case ']':
	            case ':':
	            case '?':
	            case '~':
	                ++this.index;
	                break;
	            default:
	                // 4-character punctuator.
	                str = this.source.substr(this.index, 4);
	                if (str === '>>>=') {
	                    this.index += 4;
	                }
	                else {
	                    // 3-character punctuators.
	                    str = str.substr(0, 3);
	                    if (str === '===' || str === '!==' || str === '>>>' ||
	                        str === '<<=' || str === '>>=' || str === '**=') {
	                        this.index += 3;
	                    }
	                    else {
	                        // 2-character punctuators.
	                        str = str.substr(0, 2);
	                        if (str === '&&' || str === '||' || str === '==' || str === '!=' ||
	                            str === '+=' || str === '-=' || str === '*=' || str === '/=' ||
	                            str === '++' || str === '--' || str === '<<' || str === '>>' ||
	                            str === '&=' || str === '|=' || str === '^=' || str === '%=' ||
	                            str === '<=' || str === '>=' || str === '=>' || str === '**') {
	                            this.index += 2;
	                        }
	                        else {
	                            // 1-character punctuators.
	                            str = this.source[this.index];
	                            if ('<>=!+-*%&|^/'.indexof(str) >= 0) {
	                                ++this.index;
	                            }
	                        }
	                    }
	                }
	        }
	        if (this.index === start) {
	            this.throwunexpectedtoken();
	        }
	        return {
	            type: 7 /* punctuator */,
	            value: str,
	            linenumber: this.linenumber,
	            linestart: this.linestart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
	    scanner.prototype.scanhexliteral = function (start) {
	        var num = '';
	        while (!this.eof()) {
	            if (!character_1.character.ishexdigit(this.source.charcodeat(this.index))) {
	                break;
	            }
	            num += this.source[this.index++];
	        }
	        if (num.length === 0) {
	            this.throwunexpectedtoken();
	        }
	        if (character_1.character.isidentifierstart(this.source.charcodeat(this.index))) {
	            this.throwunexpectedtoken();
	        }
	        return {
	            type: 6 /* numericliteral */,
	            value: parseint('0x' + num, 16),
	            linenumber: this.linenumber,
	            linestart: this.linestart,
	            start: start,
	            end: this.index
	        };
	    };
	    scanner.prototype.scanbinaryliteral = function (start) {
	        var num = '';
	        var ch;
	        while (!this.eof()) {
	            ch = this.source[this.index];
	            if (ch !== '0' && ch !== '1') {
	                break;
	            }
	            num += this.source[this.index++];
	        }
	        if (num.length === 0) {
	            // only 0b or 0b
	            this.throwunexpectedtoken();
	        }
	        if (!this.eof()) {
	            ch = this.source.charcodeat(this.index);
	            /* istanbul ignore else */
	            if (character_1.character.isidentifierstart(ch) || character_1.character.isdecimaldigit(ch)) {
	                this.throwunexpectedtoken();
	            }
	        }
	        return {
	            type: 6 /* numericliteral */,
	            value: parseint(num, 2),
	            linenumber: this.linenumber,
	            linestart: this.linestart,
	            start: start,
	            end: this.index
	        };
	    };
	    scanner.prototype.scanoctalliteral = function (prefix, start) {
	        var num = '';
	        var octal = false;
	        if (character_1.character.isoctaldigit(prefix.charcodeat(0))) {
	            octal = true;
	            num = '0' + this.source[this.index++];
	        }
	        else {
	            ++this.index;
	        }
	        while (!this.eof()) {
	            if (!character_1.character.isoctaldigit(this.source.charcodeat(this.index))) {
	                break;
	            }
	            num += this.source[this.index++];
	        }
	        if (!octal && num.length === 0) {
	            // only 0o or 0o
	            this.throwunexpectedtoken();
	        }
	        if (character_1.character.isidentifierstart(this.source.charcodeat(this.index)) || character_1.character.isdecimaldigit(this.source.charcodeat(this.index))) {
	            this.throwunexpectedtoken();
	        }
	        return {
	            type: 6 /* numericliteral */,
	            value: parseint(num, 8),
	            octal: octal,
	            linenumber: this.linenumber,
	            linestart: this.linestart,
	            start: start,
	            end: this.index
	        };
	    };
	    scanner.prototype.isimplicitoctalliteral = function () {
	        // implicit octal, unless there is a non-octal digit.
	        // (annex b.1.1 on numeric literals)
	        for (var i = this.index + 1; i < this.length; ++i) {
	            var ch = this.source[i];
	            if (ch === '8' || ch === '9') {
	                return false;
	            }
	            if (!character_1.character.isoctaldigit(ch.charcodeat(0))) {
	                return true;
	            }
	        }
	        return true;
	    };
	    scanner.prototype.scannumericliteral = function () {
	        var start = this.index;
	        var ch = this.source[start];
	        assert_1.assert(character_1.character.isdecimaldigit(ch.charcodeat(0)) || (ch === '.'), 'numeric literal must start with a decimal digit or a decimal point');
	        var num = '';
	        if (ch !== '.') {
	            num = this.source[this.index++];
	            ch = this.source[this.index];
	            // hex number starts with '0x'.
	            // octal number starts with '0'.
	            // octal number in es6 starts with '0o'.
	            // binary number in es6 starts with '0b'.
	            if (num === '0') {
	                if (ch === 'x' || ch === 'x') {
	                    ++this.index;
	                    return this.scanhexliteral(start);
	                }
	                if (ch === 'b' || ch === 'b') {
	                    ++this.index;
	                    return this.scanbinaryliteral(start);
	                }
	                if (ch === 'o' || ch === 'o') {
	                    return this.scanoctalliteral(ch, start);
	                }
	                if (ch && character_1.character.isoctaldigit(ch.charcodeat(0))) {
	                    if (this.isimplicitoctalliteral()) {
	                        return this.scanoctalliteral(ch, start);
	                    }
	                }
	            }
	            while (character_1.character.isdecimaldigit(this.source.charcodeat(this.index))) {
	                num += this.source[this.index++];
	            }
	            ch = this.source[this.index];
	        }
	        if (ch === '.') {
	            num += this.source[this.index++];
	            while (character_1.character.isdecimaldigit(this.source.charcodeat(this.index))) {
	                num += this.source[this.index++];
	            }
	            ch = this.source[this.index];
	        }
	        if (ch === 'e' || ch === 'e') {
	            num += this.source[this.index++];
	            ch = this.source[this.index];
	            if (ch === '+' || ch === '-') {
	                num += this.source[this.index++];
	            }
	            if (character_1.character.isdecimaldigit(this.source.charcodeat(this.index))) {
	                while (character_1.character.isdecimaldigit(this.source.charcodeat(this.index))) {
	                    num += this.source[this.index++];
	                }
	            }
	            else {
	                this.throwunexpectedtoken();
	            }
	        }
	        if (character_1.character.isidentifierstart(this.source.charcodeat(this.index))) {
	            this.throwunexpectedtoken();
	        }
	        return {
	            type: 6 /* numericliteral */,
	            value: parsefloat(num),
	            linenumber: this.linenumber,
	            linestart: this.linestart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-literals-string-literals
	    scanner.prototype.scanstringliteral = function () {
	        var start = this.index;
	        var quote = this.source[start];
	        assert_1.assert((quote === '\'' || quote === '"'), 'string literal must starts with a quote');
	        ++this.index;
	        var octal = false;
	        var str = '';
	        while (!this.eof()) {
	            var ch = this.source[this.index++];
	            if (ch === quote) {
	                quote = '';
	                break;
	            }
	            else if (ch === '\\') {
	                ch = this.source[this.index++];
	                if (!ch || !character_1.character.islineterminator(ch.charcodeat(0))) {
	                    switch (ch) {
	                        case 'u':
	                            if (this.source[this.index] === '{') {
	                                ++this.index;
	                                str += this.scanunicodecodepointescape();
	                            }
	                            else {
	                                var unescaped_1 = this.scanhexescape(ch);
	                                if (unescaped_1 === null) {
	                                    this.throwunexpectedtoken();
	                                }
	                                str += unescaped_1;
	                            }
	                            break;
	                        case 'x':
	                            var unescaped = this.scanhexescape(ch);
	                            if (unescaped === null) {
	                                this.throwunexpectedtoken(messages_1.messages.invalidhexescapesequence);
	                            }
	                            str += unescaped;
	                            break;
	                        case 'n':
	                            str += '\n';
	                            break;
	                        case 'r':
	                            str += '\r';
	                            break;
	                        case 't':
	                            str += '\t';
	                            break;
	                        case 'b':
	                            str += '\b';
	                            break;
	                        case 'f':
	                            str += '\f';
	                            break;
	                        case 'v':
	                            str += '\x0b';
	                            break;
	                        case '8':
	                        case '9':
	                            str += ch;
	                            this.tolerateunexpectedtoken();
	                            break;
	                        default:
	                            if (ch && character_1.character.isoctaldigit(ch.charcodeat(0))) {
	                                var octtodec = this.octaltodecimal(ch);
	                                octal = octtodec.octal || octal;
	                                str += string.fromcharcode(octtodec.code);
	                            }
	                            else {
	                                str += ch;
	                            }
	                            break;
	                    }
	                }
	                else {
	                    ++this.linenumber;
	                    if (ch === '\r' && this.source[this.index] === '\n') {
	                        ++this.index;
	                    }
	                    this.linestart = this.index;
	                }
	            }
	            else if (character_1.character.islineterminator(ch.charcodeat(0))) {
	                break;
	            }
	            else {
	                str += ch;
	            }
	        }
	        if (quote !== '') {
	            this.index = start;
	            this.throwunexpectedtoken();
	        }
	        return {
	            type: 8 /* stringliteral */,
	            value: str,
	            octal: octal,
	            linenumber: this.linenumber,
	            linestart: this.linestart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-template-literal-lexical-components
	    scanner.prototype.scantemplate = function () {
	        var cooked = '';
	        var terminated = false;
	        var start = this.index;
	        var head = (this.source[start] === '`');
	        var tail = false;
	        var rawoffset = 2;
	        ++this.index;
	        while (!this.eof()) {
	            var ch = this.source[this.index++];
	            if (ch === '`') {
	                rawoffset = 1;
	                tail = true;
	                terminated = true;
	                break;
	            }
	            else if (ch === '$') {
	                if (this.source[this.index] === '{') {
	                    this.curlystack.push('${');
	                    ++this.index;
	                    terminated = true;
	                    break;
	                }
	                cooked += ch;
	            }
	            else if (ch === '\\') {
	                ch = this.source[this.index++];
	                if (!character_1.character.islineterminator(ch.charcodeat(0))) {
	                    switch (ch) {
	                        case 'n':
	                            cooked += '\n';
	                            break;
	                        case 'r':
	                            cooked += '\r';
	                            break;
	                        case 't':
	                            cooked += '\t';
	                            break;
	                        case 'u':
	                            if (this.source[this.index] === '{') {
	                                ++this.index;
	                                cooked += this.scanunicodecodepointescape();
	                            }
	                            else {
	                                var restore = this.index;
	                                var unescaped_2 = this.scanhexescape(ch);
	                                if (unescaped_2 !== null) {
	                                    cooked += unescaped_2;
	                                }
	                                else {
	                                    this.index = restore;
	                                    cooked += ch;
	                                }
	                            }
	                            break;
	                        case 'x':
	                            var unescaped = this.scanhexescape(ch);
	                            if (unescaped === null) {
	                                this.throwunexpectedtoken(messages_1.messages.invalidhexescapesequence);
	                            }
	                            cooked += unescaped;
	                            break;
	                        case 'b':
	                            cooked += '\b';
	                            break;
	                        case 'f':
	                            cooked += '\f';
	                            break;
	                        case 'v':
	                            cooked += '\v';
	                            break;
	                        default:
	                            if (ch === '0') {
	                                if (character_1.character.isdecimaldigit(this.source.charcodeat(this.index))) {
	                                    // illegal: \01 \02 and so on
	                                    this.throwunexpectedtoken(messages_1.messages.templateoctalliteral);
	                                }
	                                cooked += '\0';
	                            }
	                            else if (character_1.character.isoctaldigit(ch.charcodeat(0))) {
	                                // illegal: \1 \2
	                                this.throwunexpectedtoken(messages_1.messages.templateoctalliteral);
	                            }
	                            else {
	                                cooked += ch;
	                            }
	                            break;
	                    }
	                }
	                else {
	                    ++this.linenumber;
	                    if (ch === '\r' && this.source[this.index] === '\n') {
	                        ++this.index;
	                    }
	                    this.linestart = this.index;
	                }
	            }
	            else if (character_1.character.islineterminator(ch.charcodeat(0))) {
	                ++this.linenumber;
	                if (ch === '\r' && this.source[this.index] === '\n') {
	                    ++this.index;
	                }
	                this.linestart = this.index;
	                cooked += '\n';
	            }
	            else {
	                cooked += ch;
	            }
	        }
	        if (!terminated) {
	            this.throwunexpectedtoken();
	        }
	        if (!head) {
	            this.curlystack.pop();
	        }
	        return {
	            type: 10 /* template */,
	            value: this.source.slice(start + 1, this.index - rawoffset),
	            cooked: cooked,
	            head: head,
	            tail: tail,
	            linenumber: this.linenumber,
	            linestart: this.linestart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals
	    scanner.prototype.testregexp = function (pattern, flags) {
	        // the bmp character to use as a replacement for astral symbols when
	        // translating an es6 "u"-flagged pattern to an es5-compatible
	        // approximation.
	        // note: replacing with '\uffff' enables false positives in unlikely
	        // scenarios. for example, `[\u{1044f}-\u{10440}]` is an invalid
	        // pattern that would not be detected by this substitution.
	        var astralsubstitute = '\uffff';
	        var tmp = pattern;
	        var self = this;
	        if (flags.indexof('u') >= 0) {
	            tmp = tmp
	                .replace(/\\u\{([0-9a-fa-f]+)\}|\\u([a-fa-f0-9]{4})/g, function ($0, $1, $2) {
	                var codepoint = parseint($1 || $2, 16);
	                if (codepoint > 0x10ffff) {
	                    self.throwunexpectedtoken(messages_1.messages.invalidregexp);
	                }
	                if (codepoint <= 0xffff) {
	                    return string.fromcharcode(codepoint);
	                }
	                return astralsubstitute;
	            })
	                .replace(/[\ud800-\udbff][\udc00-\udfff]/g, astralsubstitute);
	        }
	        // first, detect invalid regular expressions.
	        try {
	            regexp(tmp);
	        }
	        catch (e) {
	            this.throwunexpectedtoken(messages_1.messages.invalidregexp);
	        }
	        // return a regular expression object for this pattern-flag pair, or
	        // `null` in case the current environment doesn't support the flags it
	        // uses.
	        try {
	            return new regexp(pattern, flags);
	        }
	        catch (exception) {
	            /* istanbul ignore next */
	            return null;
	        }
	    };
	    scanner.prototype.scanregexpbody = function () {
	        var ch = this.source[this.index];
	        assert_1.assert(ch === '/', 'regular expression literal must start with a slash');
	        var str = this.source[this.index++];
	        var classmarker = false;
	        var terminated = false;
	        while (!this.eof()) {
	            ch = this.source[this.index++];
	            str += ch;
	            if (ch === '\\') {
	                ch = this.source[this.index++];
	                // https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals
	                if (character_1.character.islineterminator(ch.charcodeat(0))) {
	                    this.throwunexpectedtoken(messages_1.messages.unterminatedregexp);
	                }
	                str += ch;
	            }
	            else if (character_1.character.islineterminator(ch.charcodeat(0))) {
	                this.throwunexpectedtoken(messages_1.messages.unterminatedregexp);
	            }
	            else if (classmarker) {
	                if (ch === ']') {
	                    classmarker = false;
	                }
	            }
	            else {
	                if (ch === '/') {
	                    terminated = true;
	                    break;
	                }
	                else if (ch === '[') {
	                    classmarker = true;
	                }
	            }
	        }
	        if (!terminated) {
	            this.throwunexpectedtoken(messages_1.messages.unterminatedregexp);
	        }
	        // exclude leading and trailing slash.
	        return str.substr(1, str.length - 2);
	    };
	    scanner.prototype.scanregexpflags = function () {
	        var str = '';
	        var flags = '';
	        while (!this.eof()) {
	            var ch = this.source[this.index];
	            if (!character_1.character.isidentifierpart(ch.charcodeat(0))) {
	                break;
	            }
	            ++this.index;
	            if (ch === '\\' && !this.eof()) {
	                ch = this.source[this.index];
	                if (ch === 'u') {
	                    ++this.index;
	                    var restore = this.index;
	                    var char = this.scanhexescape('u');
	                    if (char !== null) {
	                        flags += char;
	                        for (str += '\\u'; restore < this.index; ++restore) {
	                            str += this.source[restore];
	                        }
	                    }
	                    else {
	                        this.index = restore;
	                        flags += 'u';
	                        str += '\\u';
	                    }
	                    this.tolerateunexpectedtoken();
	                }
	                else {
	                    str += '\\';
	                    this.tolerateunexpectedtoken();
	                }
	            }
	            else {
	                flags += ch;
	                str += ch;
	            }
	        }
	        return flags;
	    };
	    scanner.prototype.scanregexp = function () {
	        var start = this.index;
	        var pattern = this.scanregexpbody();
	        var flags = this.scanregexpflags();
	        var value = this.testregexp(pattern, flags);
	        return {
	            type: 9 /* regularexpression */,
	            value: '',
	            pattern: pattern,
	            flags: flags,
	            regex: value,
	            linenumber: this.linenumber,
	            linestart: this.linestart,
	            start: start,
	            end: this.index
	        };
	    };
	    scanner.prototype.lex = function () {
	        if (this.eof()) {
	            return {
	                type: 2 /* eof */,
	                value: '',
	                linenumber: this.linenumber,
	                linestart: this.linestart,
	                start: this.index,
	                end: this.index
	            };
	        }
	        var cp = this.source.charcodeat(this.index);
	        if (character_1.character.isidentifierstart(cp)) {
	            return this.scanidentifier();
	        }
	        // very common: ( and ) and ;
	        if (cp === 0x28 || cp === 0x29 || cp === 0x3b) {
	            return this.scanpunctuator();
	        }
	        // string literal starts with single quote (u+0027) or double quote (u+0022).
	        if (cp === 0x27 || cp === 0x22) {
	            return this.scanstringliteral();
	        }
	        // dot (.) u+002e can also start a floating-point number, hence the need
	        // to check the next character.
	        if (cp === 0x2e) {
	            if (character_1.character.isdecimaldigit(this.source.charcodeat(this.index + 1))) {
	                return this.scannumericliteral();
	            }
	            return this.scanpunctuator();
	        }
	        if (character_1.character.isdecimaldigit(cp)) {
	            return this.scannumericliteral();
	        }
	        // template literals start with ` (u+0060) for template head
	        // or } (u+007d) for template middle or template tail.
	        if (cp === 0x60 || (cp === 0x7d && this.curlystack[this.curlystack.length - 1] === '${')) {
	            return this.scantemplate();
	        }
	        // possible identifier start in a surrogate pair.
	        if (cp >= 0xd800 && cp < 0xdfff) {
	            if (character_1.character.isidentifierstart(this.codepointat(this.index))) {
	                return this.scanidentifier();
	            }
	        }
	        return this.scanpunctuator();
	    };
	    return scanner;
	}());
	exports.scanner = scanner;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	exports.tokenname = {};
	exports.tokenname[1 /* booleanliteral */] = 'boolean';
	exports.tokenname[2 /* eof */] = '<end>';
	exports.tokenname[3 /* identifier */] = 'identifier';
	exports.tokenname[4 /* keyword */] = 'keyword';
	exports.tokenname[5 /* nullliteral */] = 'null';
	exports.tokenname[6 /* numericliteral */] = 'numeric';
	exports.tokenname[7 /* punctuator */] = 'punctuator';
	exports.tokenname[8 /* stringliteral */] = 'string';
	exports.tokenname[9 /* regularexpression */] = 'regularexpression';
	exports.tokenname[10 /* template */] = 'template';


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	// generated by generate-xhtml-entities.js. do not modify!
	object.defineproperty(exports, "__esmodule", { value: true });
	exports.xhtmlentities = {
	    quot: '\u0022',
	    amp: '\u0026',
	    apos: '\u0027',
	    gt: '\u003e',
	    nbsp: '\u00a0',
	    iexcl: '\u00a1',
	    cent: '\u00a2',
	    pound: '\u00a3',
	    curren: '\u00a4',
	    yen: '\u00a5',
	    brvbar: '\u00a6',
	    sect: '\u00a7',
	    uml: '\u00a8',
	    copy: '\u00a9',
	    ordf: '\u00aa',
	    laquo: '\u00ab',
	    not: '\u00ac',
	    shy: '\u00ad',
	    reg: '\u00ae',
	    macr: '\u00af',
	    deg: '\u00b0',
	    plusmn: '\u00b1',
	    sup2: '\u00b2',
	    sup3: '\u00b3',
	    acute: '\u00b4',
	    micro: '\u00b5',
	    para: '\u00b6',
	    middot: '\u00b7',
	    cedil: '\u00b8',
	    sup1: '\u00b9',
	    ordm: '\u00ba',
	    raquo: '\u00bb',
	    frac14: '\u00bc',
	    frac12: '\u00bd',
	    frac34: '\u00be',
	    iquest: '\u00bf',
	    agrave: '\u00c0',
	    aacute: '\u00c1',
	    acirc: '\u00c2',
	    atilde: '\u00c3',
	    auml: '\u00c4',
	    aring: '\u00c5',
	    aelig: '\u00c6',
	    ccedil: '\u00c7',
	    egrave: '\u00c8',
	    eacute: '\u00c9',
	    ecirc: '\u00ca',
	    euml: '\u00cb',
	    igrave: '\u00cc',
	    iacute: '\u00cd',
	    icirc: '\u00ce',
	    iuml: '\u00cf',
	    eth: '\u00d0',
	    ntilde: '\u00d1',
	    ograve: '\u00d2',
	    oacute: '\u00d3',
	    ocirc: '\u00d4',
	    otilde: '\u00d5',
	    ouml: '\u00d6',
	    times: '\u00d7',
	    oslash: '\u00d8',
	    ugrave: '\u00d9',
	    uacute: '\u00da',
	    ucirc: '\u00db',
	    uuml: '\u00dc',
	    yacute: '\u00dd',
	    thorn: '\u00de',
	    szlig: '\u00df',
	    agrave: '\u00e0',
	    aacute: '\u00e1',
	    acirc: '\u00e2',
	    atilde: '\u00e3',
	    auml: '\u00e4',
	    aring: '\u00e5',
	    aelig: '\u00e6',
	    ccedil: '\u00e7',
	    egrave: '\u00e8',
	    eacute: '\u00e9',
	    ecirc: '\u00ea',
	    euml: '\u00eb',
	    igrave: '\u00ec',
	    iacute: '\u00ed',
	    icirc: '\u00ee',
	    iuml: '\u00ef',
	    eth: '\u00f0',
	    ntilde: '\u00f1',
	    ograve: '\u00f2',
	    oacute: '\u00f3',
	    ocirc: '\u00f4',
	    otilde: '\u00f5',
	    ouml: '\u00f6',
	    divide: '\u00f7',
	    oslash: '\u00f8',
	    ugrave: '\u00f9',
	    uacute: '\u00fa',
	    ucirc: '\u00fb',
	    uuml: '\u00fc',
	    yacute: '\u00fd',
	    thorn: '\u00fe',
	    yuml: '\u00ff',
	    oelig: '\u0152',
	    oelig: '\u0153',
	    scaron: '\u0160',
	    scaron: '\u0161',
	    yuml: '\u0178',
	    fnof: '\u0192',
	    circ: '\u02c6',
	    tilde: '\u02dc',
	    alpha: '\u0391',
	    beta: '\u0392',
	    gamma: '\u0393',
	    delta: '\u0394',
	    epsilon: '\u0395',
	    zeta: '\u0396',
	    eta: '\u0397',
	    theta: '\u0398',
	    iota: '\u0399',
	    kappa: '\u039a',
	    lambda: '\u039b',
	    mu: '\u039c',
	    nu: '\u039d',
	    xi: '\u039e',
	    omicron: '\u039f',
	    pi: '\u03a0',
	    rho: '\u03a1',
	    sigma: '\u03a3',
	    tau: '\u03a4',
	    upsilon: '\u03a5',
	    phi: '\u03a6',
	    chi: '\u03a7',
	    psi: '\u03a8',
	    omega: '\u03a9',
	    alpha: '\u03b1',
	    beta: '\u03b2',
	    gamma: '\u03b3',
	    delta: '\u03b4',
	    epsilon: '\u03b5',
	    zeta: '\u03b6',
	    eta: '\u03b7',
	    theta: '\u03b8',
	    iota: '\u03b9',
	    kappa: '\u03ba',
	    lambda: '\u03bb',
	    mu: '\u03bc',
	    nu: '\u03bd',
	    xi: '\u03be',
	    omicron: '\u03bf',
	    pi: '\u03c0',
	    rho: '\u03c1',
	    sigmaf: '\u03c2',
	    sigma: '\u03c3',
	    tau: '\u03c4',
	    upsilon: '\u03c5',
	    phi: '\u03c6',
	    chi: '\u03c7',
	    psi: '\u03c8',
	    omega: '\u03c9',
	    thetasym: '\u03d1',
	    upsih: '\u03d2',
	    piv: '\u03d6',
	    ensp: '\u2002',
	    emsp: '\u2003',
	    thinsp: '\u2009',
	    zwnj: '\u200c',
	    zwj: '\u200d',
	    lrm: '\u200e',
	    rlm: '\u200f',
	    ndash: '\u2013',
	    mdash: '\u2014',
	    lsquo: '\u2018',
	    rsquo: '\u2019',
	    sbquo: '\u201a',
	    ldquo: '\u201c',
	    rdquo: '\u201d',
	    bdquo: '\u201e',
	    dagger: '\u2020',
	    dagger: '\u2021',
	    bull: '\u2022',
	    hellip: '\u2026',
	    permil: '\u2030',
	    prime: '\u2032',
	    prime: '\u2033',
	    lsaquo: '\u2039',
	    rsaquo: '\u203a',
	    oline: '\u203e',
	    frasl: '\u2044',
	    euro: '\u20ac',
	    image: '\u2111',
	    weierp: '\u2118',
	    real: '\u211c',
	    trade: '\u2122',
	    alefsym: '\u2135',
	    larr: '\u2190',
	    uarr: '\u2191',
	    rarr: '\u2192',
	    darr: '\u2193',
	    harr: '\u2194',
	    crarr: '\u21b5',
	    larr: '\u21d0',
	    uarr: '\u21d1',
	    rarr: '\u21d2',
	    darr: '\u21d3',
	    harr: '\u21d4',
	    forall: '\u2200',
	    part: '\u2202',
	    exist: '\u2203',
	    empty: '\u2205',
	    nabla: '\u2207',
	    isin: '\u2208',
	    notin: '\u2209',
	    ni: '\u220b',
	    prod: '\u220f',
	    sum: '\u2211',
	    minus: '\u2212',
	    lowast: '\u2217',
	    radic: '\u221a',
	    prop: '\u221d',
	    infin: '\u221e',
	    ang: '\u2220',
	    and: '\u2227',
	    or: '\u2228',
	    cap: '\u2229',
	    cup: '\u222a',
	    int: '\u222b',
	    there4: '\u2234',
	    sim: '\u223c',
	    cong: '\u2245',
	    asymp: '\u2248',
	    ne: '\u2260',
	    equiv: '\u2261',
	    le: '\u2264',
	    ge: '\u2265',
	    sub: '\u2282',
	    sup: '\u2283',
	    nsub: '\u2284',
	    sube: '\u2286',
	    supe: '\u2287',
	    oplus: '\u2295',
	    otimes: '\u2297',
	    perp: '\u22a5',
	    sdot: '\u22c5',
	    lceil: '\u2308',
	    rceil: '\u2309',
	    lfloor: '\u230a',
	    rfloor: '\u230b',
	    loz: '\u25ca',
	    spades: '\u2660',
	    clubs: '\u2663',
	    hearts: '\u2665',
	    diams: '\u2666',
	    lang: '\u27e8',
	    rang: '\u27e9'
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	object.defineproperty(exports, "__esmodule", { value: true });
	var error_handler_1 = __webpack_require__(10);
	var scanner_1 = __webpack_require__(12);
	var token_1 = __webpack_require__(13);
	var reader = (function () {
	    function reader() {
	        this.values = [];
	        this.curly = this.paren = -1;
	    }
	    // a function following one of those tokens is an expression.
	    reader.prototype.beforefunctionexpression = function (t) {
	        return ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
	            'return', 'case', 'delete', 'throw', 'void',
	            // assignment operators
	            '=', '+=', '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=',
	            '&=', '|=', '^=', ',',
	            // binary/unary operators
	            '+', '-', '*', '**', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
	            '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
	            '<=', '<', '>', '!=', '!=='].indexof(t) >= 0;
	    };
	    // determine if forward slash (/) is an operator or part of a regular expression
	    // https://github.com/mozilla/sweet.js/wiki/design
	    reader.prototype.isregexstart = function () {
	        var previous = this.values[this.values.length - 1];
	        var regex = (previous !== null);
	        switch (previous) {
	            case 'this':
	            case ']':
	                regex = false;
	                break;
	            case ')':
	                var keyword = this.values[this.paren - 1];
	                regex = (keyword === 'if' || keyword === 'while' || keyword === 'for' || keyword === 'with');
	                break;
	            case '}':
	                // dividing a function by anything makes little sense,
	                // but we have to check for that.
	                regex = false;
	                if (this.values[this.curly - 3] === 'function') {
	                    // anonymous function, e.g. function(){} /42
	                    var check = this.values[this.curly - 4];
	                    regex = check ? !this.beforefunctionexpression(check) : false;
	                }
	                else if (this.values[this.curly - 4] === 'function') {
	                    // named function, e.g. function f(){} /42/
	                    var check = this.values[this.curly - 5];
	                    regex = check ? !this.beforefunctionexpression(check) : true;
	                }
	                break;
	            default:
	                break;
	        }
	        return regex;
	    };
	    reader.prototype.push = function (token) {
	        if (token.type === 7 /* punctuator */ || token.type === 4 /* keyword */) {
	            if (token.value === '{') {
	                this.curly = this.values.length;
	            }
	            else if (token.value === '(') {
	                this.paren = this.values.length;
	            }
	            this.values.push(token.value);
	        }
	        else {
	            this.values.push(null);
	        }
	    };
	    return reader;
	}());
	var tokenizer = (function () {
	    function tokenizer(code, config) {
	        this.errorhandler = new error_handler_1.errorhandler();
	        this.errorhandler.tolerant = config ? (typeof config.tolerant === 'boolean' && config.tolerant) : false;
	        this.scanner = new scanner_1.scanner(code, this.errorhandler);
	        this.scanner.trackcomment = config ? (typeof config.comment === 'boolean' && config.comment) : false;
	        this.trackrange = config ? (typeof config.range === 'boolean' && config.range) : false;
	        this.trackloc = config ? (typeof config.loc === 'boolean' && config.loc) : false;
	        this.buffer = [];
	        this.reader = new reader();
	    }
	    tokenizer.prototype.errors = function () {
	        return this.errorhandler.errors;
	    };
	    tokenizer.prototype.getnexttoken = function () {
	        if (this.buffer.length === 0) {
	            var comments = this.scanner.scancomments();
	            if (this.scanner.trackcomment) {
	                for (var i = 0; i < comments.length; ++i) {
	                    var e = comments[i];
	                    var value = this.scanner.source.slice(e.slice[0], e.slice[1]);
	                    var comment = {
	                        type: e.multiline ? 'blockcomment' : 'linecomment',
	                        value: value
	                    };
	                    if (this.trackrange) {
	                        comment.range = e.range;
	                    }
	                    if (this.trackloc) {
	                        comment.loc = e.loc;
	                    }
	                    this.buffer.push(comment);
	                }
	            }
	            if (!this.scanner.eof()) {
	                var loc = void 0;
	                if (this.trackloc) {
	                    loc = {
	                        start: {
	                            line: this.scanner.linenumber,
	                            column: this.scanner.index - this.scanner.linestart
	                        },
	                        end: {}
	                    };
	                }
	                var startregex = (this.scanner.source[this.scanner.index] === '/') && this.reader.isregexstart();
	                var token = startregex ? this.scanner.scanregexp() : this.scanner.lex();
	                this.reader.push(token);
	                var entry = {
	                    type: token_1.tokenname[token.type],
	                    value: this.scanner.source.slice(token.start, token.end)
	                };
	                if (this.trackrange) {
	                    entry.range = [token.start, token.end];
	                }
	                if (this.trackloc) {
	                    loc.end = {
	                        line: this.scanner.linenumber,
	                        column: this.scanner.index - this.scanner.linestart
	                    };
	                    entry.loc = loc;
	                }
	                if (token.type === 9 /* regularexpression */) {
	                    var pattern = token.pattern;
	                    var flags = token.flags;
	                    entry.regex = { pattern: pattern, flags: flags };
	                }
	                this.buffer.push(entry);
	            }
	        }
	        return this.buffer.shift();
	    };
	    return tokenizer;
	}());
	exports.tokenizer = tokenizer;


/***/ }
/******/ ])
});
;







