/* simple ajax code-kit (sack) v1.6.1 */
/* â©2005 gregory wild-smith */
/* www.twilightuniverse.com */
/* software licenced under a modified x11 licence,
   see documentation or authors website for more details */

function sack(file) {
	this.xmlhttp = null;

	this.resetdata = function() {
		this.method = "post";
  		this.querystringseparator = "?";
		this.argumentseparator = "&";
		this.urlstring = "";
		this.encodeuristring = true;
  		this.execute = false;
  		this.element = null;
		this.elementobj = null;
		this.requestfile = file;
		this.vars = new object();
		this.responsestatus = new array(2);
  	};

	this.resetfunctions = function() {
  		this.onloading = function() { };
  		this.onloaded = function() { };
  		this.oninteractive = function() { };
  		this.oncompletion = function() { };
  		this.onerror = function() { };
		this.onfail = function() { };
	};

	this.reset = function() {
		this.resetfunctions();
		this.resetdata();
	};

	this.createajax = function() {
		try {
			this.xmlhttp = new activexobject("msxml2.xmlhttp");
		} catch (e1) {
			try {
				this.xmlhttp = new activexobject("microsoft.xmlhttp");
			} catch (e2) {
				this.xmlhttp = null;
			}
		}

		if (! this.xmlhttp) {
			if (typeof xmlhttprequest != "undefined") {
				this.xmlhttp = new xmlhttprequest();
			} else {
				this.failed = true;
			}
		}
	};

	this.setvar = function(name, value){
		this.vars[name] = array(value, false);
	};

	this.encvar = function(name, value, returnvars) {
		if (true == returnvars) {
			return array(encodeuricomponent(name), encodeuricomponent(value));
		} else {
			this.vars[encodeuricomponent(name)] = array(encodeuricomponent(value), true);
		}
	}

	this.processurlstring = function(string, encode) {
		encoded = encodeuricomponent(this.argumentseparator);
		regexp = new regexp(this.argumentseparator + "|" + encoded);
		vararray = string.split(regexp);
		for (i = 0; i < vararray.length; i++){
			urlvars = vararray[i].split("=");
			if (true == encode){
				this.encvar(urlvars[0], urlvars[1]);
			} else {
				this.setvar(urlvars[0], urlvars[1]);
			}
		}
	}

	this.createurlstring = function(urlstring) {
		if (this.encodeuristring && this.urlstring.length) {
			this.processurlstring(this.urlstring, true);
		}

		if (urlstring) {
			if (this.urlstring.length) {
				this.urlstring += this.argumentseparator + urlstring;
			} else {
				this.urlstring = urlstring;
			}
		}

		// prevents caching of urlstring
		this.setvar("rndval", new date().gettime());

		urlstringtemp = new array();
		for (key in this.vars) {
			if (false == this.vars[key][1] && true == this.encodeuristring) {
				encoded = this.encvar(key, this.vars[key][0], true);
				delete this.vars[key];
				this.vars[encoded[0]] = array(encoded[1], true);
				key = encoded[0];
			}

			urlstringtemp[urlstringtemp.length] = key + "=" + this.vars[key][0];
		}
		if (urlstring){
			this.urlstring += this.argumentseparator + urlstringtemp.join(this.argumentseparator);
		} else {
			this.urlstring += urlstringtemp.join(this.argumentseparator);
		}
	}

	this.runresponse = function() {
		eval(this.response);
	}

	this.runajax = function(urlstring) {
		if (this.failed) {
			this.onfail();
		} else {
			this.createurlstring(urlstring);
			if (this.element) {
				this.elementobj = document.getelementbyid(this.element);
			}
			if (this.xmlhttp) {
				var self = this;
				if (this.method == "get") {
					totalurlstring = this.requestfile + this.querystringseparator + this.urlstring;
					this.xmlhttp.open(this.method, totalurlstring, true);
				} else {
					this.xmlhttp.open(this.method, this.requestfile, true);
					try {
						this.xmlhttp.setrequestheader("content-type", "application/x-www-form-urlencoded")
					} catch (e) { }
				}

				this.xmlhttp.onreadystatechange = function() {
					switch (self.xmlhttp.readystate) {
						case 1:
							self.onloading();
							break;
						case 2:
							self.onloaded();
							break;
						case 3:
							self.oninteractive();
							break;
						case 4:
							self.response = self.xmlhttp.responsetext;
							self.responsexml = self.xmlhttp.responsexml;
							self.responsestatus[0] = self.xmlhttp.status;
							self.responsestatus[1] = self.xmlhttp.statustext;

							if (self.execute) {
								self.runresponse();
							}

							if (self.elementobj) {
								elemnodename = self.elementobj.nodename;
								elemnodename.tolowercase();
								if (elemnodename == "input"
								|| elemnodename == "select"
								|| elemnodename == "option"
								|| elemnodename == "textarea") {
									self.elementobj.value = self.response;
								} else {
									self.elementobj.innerhtml = self.response;
								}
							}
							if (self.responsestatus[0] == "200") {
								self.oncompletion();
							} else {
								self.onerror();
							}

							self.urlstring = "";
							break;
					}
				};

				this.xmlhttp.send(this.urlstring);
			}
		}
	};

	this.reset();
	this.createajax();
}



