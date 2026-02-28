
// domrect
(function (global) {
	function number(v) {
		return v === undefined ? 0 : number(v);
	}

	function different(u, v) {
		return u !== v && !(isnan(u) && isnan(v));
	}

	function domrect(xarg, yarg, warg, harg) {
		var x, y, width, height, left, right, top, bottom;

		x = number(xarg);
		y = number(yarg);
		width = number(warg);
		height = number(harg);

		object.defineproperties(this, {
			x: {
				get: function () { return x; },
				set: function (newx) {
					if (different(x, newx)) {
						x = newx;
						left = right = undefined;
					}
				},
				enumerable: true
			},
			y: {
				get: function () { return y; },
				set: function (newy) {
					if (different(y, newy)) {
						y = newy;
						top = bottom = undefined;
					}
				},
				enumerable: true
			},
			width: {
				get: function () { return width; },
				set: function (newwidth) {
					if (different(width, newwidth)) {
						width = newwidth;
						left = right = undefined;
					}
				},
				enumerable: true
			},
			height: {
				get: function () { return height; },
				set: function (newheight) {
					if (different(height, newheight)) {
						height = newheight;
						top = bottom = undefined;
					}
				},
				enumerable: true
			},
			left: {
				get: function () {
					if (left === undefined) {
						left = x + math.min(0, width);
					}
					return left;
				},
				enumerable: true
			},
			right: {
				get: function () {
					if (right === undefined) {
						right = x + math.max(0, width);
					}
					return right;
				},
				enumerable: true
			},
			top: {
				get: function () {
					if (top === undefined) {
						top = y + math.min(0, height);
					}
					return top;
				},
				enumerable: true
			},
			bottom: {
				get: function () {
					if (bottom === undefined) {
						bottom = y + math.max(0, height);
					}
					return bottom;
				},
				enumerable: true
			}
		});
	}

	global.domrect = domrect;
}(self));






