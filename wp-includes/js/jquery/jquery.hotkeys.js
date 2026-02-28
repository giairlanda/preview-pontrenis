/******************************************************************************************************************************

 * @ original idea by by binny v a, original version: 2.00.a
 * @ http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * @ original license : bsd

 * @ jquery plugin by tzury bar yochay
        mail: tzury.by@gmail.com
        blog: evalinux.wordpress.com
        face: facebook.com/profile.php?id=513676303

        (c) copyrights 2007

 * @ jquery plugin version beta (0.0.2)
 * @ license: jquery-license.

todo:
    add queue support (as in gmail) e.g. 'x' then 'y', etc.
    add mouse + mouse wheel events.

usage:
    $.hotkeys.add('ctrl+c', function(){ alert('copy anyone?');});
    $.hotkeys.add('ctrl+c', {target:'div#editor', type:'keyup', propagate: true},function(){ alert('copy anyone?');});>
    $.hotkeys.remove('ctrl+c');
    $.hotkeys.remove('ctrl+c', {target:'div#editor', type:'keypress'});

******************************************************************************************************************************/
(function (jquery){
    this.version = '(beta)(0.0.3)';
	this.all = {};
    this.special_keys = {
        27: 'esc', 9: 'tab', 32:'space', 13: 'return', 8:'backspace', 145: 'scroll', 20: 'capslock',
        144: 'numlock', 19:'pause', 45:'insert', 36:'home', 46:'del',35:'end', 33: 'pageup',
        34:'pagedown', 37:'left', 38:'up', 39:'right',40:'down', 112:'f1',113:'f2', 114:'f3',
        115:'f4', 116:'f5', 117:'f6', 118:'f7', 119:'f8', 120:'f9', 121:'f10', 122:'f11', 123:'f12'};

    this.shift_nums = { "`":"~", "1":"!", "2":"@", "3":"#", "4":"$", "5":"%", "6":"^", "7":"&",
        "8":"*", "9":"(", "0":")", "-":"_", "=":"+", ";":":", "'":"\"", ",":"<",
        ".":">",  "/":"?",  "\\":"|" };

    this.add = function(combi, options, callback) {
        if ( typeof options === 'function' ){
            callback = options;
            options = {};
        }
        var opt = {},
            defaults = {type: 'keydown', propagate: false, disableininput: false, target: jquery('html')[0]},
            that = this;
        opt = jquery.extend( opt , defaults, options || {} );
        combi = combi.tolowercase();

        // inspect if keystroke matches
        var inspector = function(event) {
            // wp: not needed with newer jquery
            // event = jquery.event.fix(event); // jquery event normalization.
            var element = event.target;
            // @ textnode -> nodetype == 3
            // wp: not needed with newer jquery
            // element = (element.nodetype==3) ? element.parentnode : element;

            if ( opt['disableininput'] ) { // disable shortcut keys in input, textarea fields
                var target = jquery(element);

				if ( ( target.is('input') || target.is('textarea') ) &&
					( ! opt.nodisable || ! target.is( opt.nodisable ) ) ) {

					return;
                }
            }
            var code = event.which,
                type = event.type,
                character = string.fromcharcode(code).tolowercase(),
                special = that.special_keys[code],
                shift = event.shiftkey,
                ctrl = event.ctrlkey,
                alt= event.altkey,
                meta = event.metakey,
                propagate = true, // default behaivour
                mappoint = null;

            // in opera + safari, the event.target is unpredictable.
            // for example: 'keydown' might be associated with htmlbodyelement
            // or the element where you last clicked with your mouse.
            // wp: needed for all browsers
            // if (jquery.browser.opera || jquery.browser.safari){
                while (!that.all[element] && element.parentnode){
                    element = element.parentnode;
                }
            // }
            var cbmap = that.all[element].events[type].callbackmap;
            if(!shift && !ctrl && !alt && !meta) { // no modifiers
                mappoint = cbmap[special] ||  cbmap[character]
			}
            // deals with combinaitons (alt|ctrl|shift+anything)
            else{
                var modif = '';
                if(alt) modif +='alt+';
                if(ctrl) modif+= 'ctrl+';
                if(shift) modif += 'shift+';
                if(meta) modif += 'meta+';
                // modifiers + special keys or modifiers + characters or modifiers + shift characters
                mappoint = cbmap[modif+special] || cbmap[modif+character] || cbmap[modif+that.shift_nums[character]]
            }
            if (mappoint){
                mappoint.cb(event);
                if(!mappoint.propagate) {
                    event.stoppropagation();
                    event.preventdefault();
                    return false;
                }
            }
		};
        // first hook for this element
        if (!this.all[opt.target]){
            this.all[opt.target] = {events:{}};
        }
        if (!this.all[opt.target].events[opt.type]){
            this.all[opt.target].events[opt.type] = {callbackmap: {}}
            jquery.event.add(opt.target, opt.type, inspector);
        }
        this.all[opt.target].events[opt.type].callbackmap[combi] =  {cb: callback, propagate:opt.propagate};
        return jquery;
	};
    this.remove = function(exp, opt) {
        opt = opt || {};
        target = opt.target || jquery('html')[0];
        type = opt.type || 'keydown';
		exp = exp.tolowercase();
        delete this.all[target].events[type].callbackmap[exp]
        return jquery;
	};
    jquery.hotkeys = this;
    return jquery;
})(jquery);







