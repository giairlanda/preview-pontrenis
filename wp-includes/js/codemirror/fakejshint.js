// jshint has some gpl compatability issues, so we are faking it out and using esprima for validation
// based on https://github.com/jquery/esprima/blob/gh-pages/demo/validate.js which is mit licensed

var fakejshint = new function() {
	var syntax, errors;
	var that = this;
	this.data = [];
	this.converterror = function( error ){
		return {
			line: error.linenumber,
			character: error.column,
			reason: error.description,
			code: 'e'
		};
	};
	this.parse = function( code ){
		try {
			syntax = window.esprima.parse(code, { tolerant: true, loc: true });
			errors = syntax.errors;
			if ( errors.length > 0 ) {
				for ( var i = 0; i < errors.length; i++) {
					var error = errors[i];
					that.data.push( that.converterror( error ) );
				}
			} else {
				that.data = [];
			}
		} catch (e) {
			that.data.push( that.converterror( e ) );
		}
	};
};

window.jshint = function( text ){
	fakejshint.parse( text );
};
window.jshint.data = function(){
	return {
		errors: fakejshint.data
	};
};




