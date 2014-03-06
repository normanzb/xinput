if (typeof define !== 'function' && typeof module != 'undefined') {
    var define = require('amdefine')(module);
}

define(function () {
    var INPUT = 'input';

    /* Feature Detection */

    var hasOnInput = function(){
        /*
            The following function tests an element for oninput support in Firefox.
            Many thanks to:
            http://blog.danielfriesen.name/2010/02/16/html5-browser-maze-oninput-support/
        */
        function checkEvent(el) {
            // First check, for if Firefox fixes its issue with el.oninput = function
            el.setAttribute("oninput", "return");
            if (typeof el.oninput == "function"){
                return true;
            }

            // Second check, because Firefox doesn't map oninput attribute to oninput property
            try {
                var e  = document.createEvent("KeyboardEvent"),
                    ok = false,
                    tester = function(e) {
                        ok = true;
                        e.preventDefault();
                        e.stopPropagation();
                    }
                e.initKeyEvent("keypress", true, true, window, false, false, false, false, 0, "e".charCodeAt(0));
                document.body.appendChild(el);
                el.addEventListener(INPUT, tester, false);
                el.focus();
                el.dispatchEvent(e);
                el.removeEventListener(INPUT, tester, false);
                document.body.removeChild(el);
                return ok;
            } catch(e) {}
        }

        var testee = document.createElement(INPUT);
        return "oninput" in testee || checkEvent(testee);
    }();

    /* Public */
    
    function Observer(){
        this._old = '';
        this.oninput = function(){};
    }

    var p = Observer.prototype;

    p.observe = function(el){
        if ( el == null || el.tagName.toLowerCase() != INPUT ) {
            throw "Target input element must be specified.";
        }

        var me = this;

        if ( hasOnInput ) {
            el.addEventListener(INPUT, function() {
                me.oninput();
            }, false);
        }
        else if (el.attachEvent) {
            this._old = el.value;
            el.attachEvent('onpropertychange', function(evt){
                if ( evt.propertyName == "value" && el.value != this._old ) {
                    this._old = el.value;
                    me.oninput();
                }
            });
        }
        else {
            throw "Something wrong, should never goes to here.";
        }
    };

    return Observer;

});