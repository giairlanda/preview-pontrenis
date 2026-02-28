/**
 * handles the addition of the comment form.
 *
 * @since 2.7.0
 * @output wp-includes/js/comment-reply.js
 *
 * @namespace addcomment
 *
 * @type {object}
 */
window.addcomment = ( function( window ) {
	// avoid scope lookups on commonly used variables.
	var document = window.document;

	// settings.
	var config = {
		commentreplyclass   : 'comment-reply-link',
		commentreplytitleid : 'reply-title',
		cancelreplyid       : 'cancel-comment-reply-link',
		commentformid       : 'commentform',
		temporaryformid     : 'wp-temp-form-div',
		parentidfieldid     : 'comment_parent',
		postidfieldid       : 'comment_post_id'
	};

	// cross browser mutationobserver.
	var mutationobserver = window.mutationobserver || window.webkitmutationobserver || window.mozmutationobserver;

	// check browser cuts the mustard.
	var cutsthemustard = 'queryselector' in document && 'addeventlistener' in window;

	/*
	 * check browser supports dataset.
	 * !! sets the variable to true if the property exists.
	 */
	var supportsdataset = !! document.documentelement.dataset;

	// for holding the cancel element.
	var cancelelement;

	// for holding the comment form element.
	var commentformelement;

	// the respond element.
	var respondelement;

	// the mutation observer.
	var observer;

	if ( cutsthemustard && document.readystate !== 'loading' ) {
		ready();
	} else if ( cutsthemustard ) {
		window.addeventlistener( 'domcontentloaded', ready, false );
	}

	/**
	 * sets up object variables after the dom is ready.
	 *
	 * @since 5.1.1
	 */
	function ready() {
		// initialize the events.
		init();

		// set up a mutationobserver to check for comments loaded late.
		observechanges();
	}

	/**
	 * add events to links classed .comment-reply-link.
	 *
	 * searches the context for reply links and adds the javascript events
	 * required to move the comment form. to allow for lazy loading of
	 * comments this method is exposed as window.commentreply.init().
	 *
	 * @since 5.1.0
	 *
	 * @memberof addcomment
	 *
	 * @param {htmlelement} context the parent dom element to search for links.
	 */
	function init( context ) {
		if ( ! cutsthemustard ) {
			return;
		}

		// get required elements.
		cancelelement = getelementbyid( config.cancelreplyid );
		commentformelement = getelementbyid( config.commentformid );

		// no cancel element, no replies.
		if ( ! cancelelement ) {
			return;
		}

		cancelelement.addeventlistener( 'touchstart', cancelevent );
		cancelelement.addeventlistener( 'click',      cancelevent );

		// submit the comment form when the user types [ctrl] or [cmd] + [enter].
		var submitformhandler = function( e ) {
			if ( ( e.metakey || e.ctrlkey ) && e.keycode === 13 && document.activeelement.tagname.tolowercase() !== 'a' ) {
				commentformelement.removeeventlistener( 'keydown', submitformhandler );
				e.preventdefault();
				// the submit button id is 'submit' so we can't call commentformelement.submit(). click it instead.
				commentformelement.submit.click();
				return false;
			}
		};

		if ( commentformelement ) {
			commentformelement.addeventlistener( 'keydown', submitformhandler );
		}

		var links = replylinks( context );
		var element;

		for ( var i = 0, l = links.length; i < l; i++ ) {
			element = links[i];

			element.addeventlistener( 'touchstart', clickevent );
			element.addeventlistener( 'click',      clickevent );
		}
	}

	/**
	 * return all links classed .comment-reply-link.
	 *
	 * @since 5.1.0
	 *
	 * @param {htmlelement} context the parent dom element to search for links.
	 *
	 * @return {htmlcollection|nodelist|array}
	 */
	function replylinks( context ) {
		var selectorclass = config.commentreplyclass;
		var allreplylinks;

		// childnodes is a handy check to ensure the context is a htmlelement.
		if ( ! context || ! context.childnodes ) {
			context = document;
		}

		if ( document.getelementsbyclassname ) {
			// fastest.
			allreplylinks = context.getelementsbyclassname( selectorclass );
		}
		else {
			// fast.
			allreplylinks = context.queryselectorall( '.' + selectorclass );
		}

		return allreplylinks;
	}

	/**
	 * cancel event handler.
	 *
	 * @since 5.1.0
	 *
	 * @param {event} event the calling event.
	 */
	function cancelevent( event ) {
		var cancellink = this;
		var temporaryformid  = config.temporaryformid;
		var temporaryelement = getelementbyid( temporaryformid );

		if ( ! temporaryelement || ! respondelement ) {
			// conditions for cancel link fail.
			return;
		}

		getelementbyid( config.parentidfieldid ).value = '0';

		// move the respond form back in place of the temporary element.
		var headingtext = temporaryelement.textcontent;
		temporaryelement.parentnode.replacechild( respondelement, temporaryelement );
		cancellink.style.display = 'none';

		var replyheadingelement  = getelementbyid( config.commentreplytitleid );
		var replyheadingtextnode = replyheadingelement && replyheadingelement.firstchild;
		var replylinktoparent    = replyheadingtextnode && replyheadingtextnode.nextsibling;

		if ( replyheadingtextnode && replyheadingtextnode.nodetype === node.text_node && headingtext ) {
			if ( replylinktoparent && 'a' === replylinktoparent.nodename && replylinktoparent.id !== config.cancelreplyid ) {
				replylinktoparent.style.display = '';
			}

			replyheadingtextnode.textcontent = headingtext;
		}

		event.preventdefault();
	}

	/**
	 * click event handler.
	 *
	 * @since 5.1.0
	 *
	 * @param {event} event the calling event.
	 */
	function clickevent( event ) {
		var replynode = getelementbyid( config.commentreplytitleid );
		var defaultreplyheading = replynode && replynode.firstchild.textcontent;
		var replylink = this,
			commid    = getdataattribute( replylink, 'belowelement' ),
			parentid  = getdataattribute( replylink, 'commentid' ),
			respondid = getdataattribute( replylink, 'respondelement' ),
			postid    = getdataattribute( replylink, 'postid' ),
			replyto   = getdataattribute( replylink, 'replyto' ) || defaultreplyheading,
			follow;

		if ( ! commid || ! parentid || ! respondid || ! postid ) {
			/*
			 * theme or plugin defines own link via custom `wp_list_comments()` callback
			 * and calls `moveform()` either directly or via a custom event hook.
			 */
			return;
		}

		/*
		 * third party comments systems can hook into this function via the global scope,
		 * therefore the click event needs to reference the global scope.
		 */
		follow = window.addcomment.moveform( commid, parentid, respondid, postid, replyto );
		if ( false === follow ) {
			event.preventdefault();
		}
	}

	/**
	 * creates a mutation observer to check for newly inserted comments.
	 *
	 * @since 5.1.0
	 */
	function observechanges() {
		if ( ! mutationobserver ) {
			return;
		}

		var observeroptions = {
			childlist: true,
			subtree: true
		};

		observer = new mutationobserver( handlechanges );
		observer.observe( document.body, observeroptions );
	}

	/**
	 * handles dom changes, calling init() if any new nodes are added.
	 *
	 * @since 5.1.0
	 *
	 * @param {array} mutationrecords array of mutationrecord objects.
	 */
	function handlechanges( mutationrecords ) {
		var i = mutationrecords.length;

		while ( i-- ) {
			// call init() once if any record in this set adds nodes.
			if ( mutationrecords[ i ].addednodes.length ) {
				init();
				return;
			}
		}
	}

	/**
	 * backward compatible getter of data-* attribute.
	 *
	 * uses element.dataset if it exists, otherwise uses getattribute.
	 *
	 * @since 5.1.0
	 *
	 * @param {htmlelement} element dom element with the attribute.
	 * @param {string}      attribute the attribute to get.
	 *
	 * @return {string}
	 */
	function getdataattribute( element, attribute ) {
		if ( supportsdataset ) {
			return element.dataset[attribute];
		}
		else {
			return element.getattribute( 'data-' + attribute );
		}
	}

	/**
	 * get element by id.
	 *
	 * local alias for document.getelementbyid.
	 *
	 * @since 5.1.0
	 *
	 * @param {htmlelement} the requested element.
	 */
	function getelementbyid( elementid ) {
		return document.getelementbyid( elementid );
	}

	/**
	 * moves the reply form from its current position to the reply location.
	 *
	 * @since 2.7.0
	 *
	 * @memberof addcomment
	 *
	 * @param {string} addbelowid html id of element the form follows.
	 * @param {string} commentid  database id of comment being replied to.
	 * @param {string} respondid  html id of 'respond' element.
	 * @param {string} postid     database id of the post.
	 * @param {string} replyto    form heading content.
	 */
	function moveform( addbelowid, commentid, respondid, postid, replyto ) {
		// get elements based on their ids.
		var addbelowelement = getelementbyid( addbelowid );
		respondelement  = getelementbyid( respondid );

		// get the hidden fields.
		var parentidfield   = getelementbyid( config.parentidfieldid );
		var postidfield     = getelementbyid( config.postidfieldid );
		var element, csshidden, style;

		var replyheading         = getelementbyid( config.commentreplytitleid );
		var replyheadingtextnode = replyheading && replyheading.firstchild;
		var replylinktoparent    = replyheadingtextnode && replyheadingtextnode.nextsibling;

		if ( ! addbelowelement || ! respondelement || ! parentidfield ) {
			// missing key elements, fail.
			return;
		}

		if ( 'undefined' === typeof replyto ) {
			replyto = replyheadingtextnode && replyheadingtextnode.textcontent;
		}

		addplaceholder( respondelement );

		// set the value of the post.
		if ( postid && postidfield ) {
			postidfield.value = postid;
		}

		parentidfield.value = commentid;

		cancelelement.style.display = '';
		addbelowelement.parentnode.insertbefore( respondelement, addbelowelement.nextsibling );

		if ( replyheadingtextnode && replyheadingtextnode.nodetype === node.text_node ) {
			if ( replylinktoparent && 'a' === replylinktoparent.nodename && replylinktoparent.id !== config.cancelreplyid ) {
				replylinktoparent.style.display = 'none';
			}

			replyheadingtextnode.textcontent = replyto;
		}

		/*
		 * this is for backward compatibility with third party commenting systems
		 * hooking into the event using older techniques.
		 */
		cancelelement.onclick = function() {
			return false;
		};

		// focus on the first field in the comment form.
		try {
			for ( var i = 0; i < commentformelement.elements.length; i++ ) {
				element = commentformelement.elements[i];
				csshidden = false;

				// get elements computed style.
				if ( 'getcomputedstyle' in window ) {
					// modern browsers.
					style = window.getcomputedstyle( element );
				} else if ( document.documentelement.currentstyle ) {
					// ie 8.
					style = element.currentstyle;
				}

				/*
				 * for display none, do the same thing jquery does. for visibility,
				 * check the element computed style since browsers are already doing
				 * the job for us. in fact, the visibility computed style is the actual
				 * computed value and already takes into account the element ancestors.
				 */
				if ( ( element.offsetwidth <= 0 && element.offsetheight <= 0 ) || style.visibility === 'hidden' ) {
					csshidden = true;
				}

				// skip form elements that are hidden or disabled.
				if ( 'hidden' === element.type || element.disabled || csshidden ) {
					continue;
				}

				element.focus();
				// stop after the first focusable element.
				break;
			}
		}
		catch(e) {

		}

		/*
		 * false is returned for backward compatibility with third party commenting systems
		 * hooking into this function.
		 */
		return false;
	}

	/**
	 * add placeholder element.
	 *
	 * places a place holder element above the #respond element for
	 * the form to be returned to if needs be.
	 *
	 * @since 2.7.0
	 *
	 * @param {htmlelement} respondelement the #respond element holding comment form.
	 */
	function addplaceholder( respondelement ) {
		var temporaryformid  = config.temporaryformid;
		var temporaryelement = getelementbyid( temporaryformid );
		var replyelement = getelementbyid( config.commentreplytitleid );
		var initialheadingtext = replyelement ? replyelement.firstchild.textcontent : '';

		if ( temporaryelement ) {
			// the element already exists, no need to recreate.
			return;
		}

		temporaryelement = document.createelement( 'div' );
		temporaryelement.id = temporaryformid;
		temporaryelement.style.display = 'none';
		temporaryelement.textcontent = initialheadingtext;
		respondelement.parentnode.insertbefore( temporaryelement, respondelement );
	}

	return {
		init: init,
		moveform: moveform
	};
})( window );




