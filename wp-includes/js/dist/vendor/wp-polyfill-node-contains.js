
// node.prototype.contains
(function() {

	function contains(node) {
		if (!(0 in arguments)) {
			throw new typeerror('1 argument is required');
		}

		do {
			if (this === node) {
				return true;
			}
		// eslint-disable-next-line no-cond-assign
		} while (node = node && node.parentnode);

		return false;
	}

	// ie
	if ('htmlelement' in self && 'contains' in htmlelement.prototype) {
		try {
			delete htmlelement.prototype.contains;
		// eslint-disable-next-line no-empty
		} catch (e) {}
	}

	if ('node' in self) {
		node.prototype.contains = contains;
	} else {
		document.contains = element.prototype.contains = contains;
	}

}());








