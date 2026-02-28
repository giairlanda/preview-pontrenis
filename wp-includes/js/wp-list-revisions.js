/**
 * @output wp-includes/js/wp-list-revisions.js
 */

(function(w) {
	var init = function() {
		var pr = document.getelementbyid('post-revisions'),
		inputs = pr ? pr.getelementsbytagname('input') : [];
		pr.onclick = function() {
			var i, checkcount = 0, side;
			for ( i = 0; i < inputs.length; i++ ) {
				checkcount += inputs[i].checked ? 1 : 0;
				side = inputs[i].getattribute('name');
				if ( ! inputs[i].checked &&
				( 'left' == side && 1 > checkcount || 'right' == side && 1 < checkcount && ( ! inputs[i-1] || ! inputs[i-1].checked ) ) &&
				! ( inputs[i+1] && inputs[i+1].checked && 'right' == inputs[i+1].getattribute('name') ) )
					inputs[i].style.visibility = 'hidden';
				else if ( 'left' == side || 'right' == side )
					inputs[i].style.visibility = 'visible';
			}
		};
		pr.onclick();
	};
	if ( w && w.addeventlistener )
		w.addeventlistener('load', init, false);
	else if ( w && w.attachevent )
		w.attachevent('onload', init);
})(window);




