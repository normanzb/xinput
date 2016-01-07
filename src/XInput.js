define(['../lib/boe/src/boe/Function/bind'], function (bind) {
    'use strict';

    var INPUT = 'input';
    var TEXTAREA = 'textarea';
    var CHANGE = 'change';
    var PROPERTYNAME = 'propertyName';

    /* Feature Detection */
    var hasOnInput = function(){
        /*
            The following function tests an element for oninput support in Firefox.
            Many thanks to:
            http://blog.danielfriesen.name/2010/02/16/html5-browser-maze-oninput-support/
        */
        function checkEvent(el) {
            // First check, for if Firefox fixes its issue with el.oninput = function
            el.setAttribute('oninput', 'return');
            if (typeof el.oninput == 'function'){
                return true;
            }

            // Second check, because Firefox doesn't map oninput attribute to oninput property
            try {
                var e  = document.createEvent('KeyboardEvent'),
                    ok = false,
                    tester = function(e) {
                        ok = true;
                        e.preventDefault();
                        e.stopPropagation();
                    };
                e.initKeyEvent('keypress', true, true, window, false, false, false, false, 0, 'e'.charCodeAt(0));
                document.body.appendChild(el);
                el.addEventListener(INPUT, tester, false);
                el.focus();
                el.dispatchEvent(e);
                el.removeEventListener(INPUT, tester, false);
                document.body.removeChild(el);
                return ok;
            } catch(ex) {}
        }

        var testee = document.createElement(INPUT);
        return 'oninput' in testee || checkEvent(testee);
    }();

    /* Private */

    function onchange( evt ){
        var me = this;
        
        if ( 
            window.event != null &&
            PROPERTYNAME in window.event && 
            window.event[PROPERTYNAME] != null && 
            window.event[PROPERTYNAME] !== ''
        ) {
            if ( window.event[PROPERTYNAME] !== 'value') {
                return;
            }
        }
        
        if ( me._el.value != me._old ) {
            me._old = me._el.value;
            me.oninput( evt );
        }
    }

    function onfocus () {
        document.attachEvent('onselectionchange', this._onchange);
    }

    function onblur() {
        document.detachEvent('onselectionchange', this._onchange);
    }

    function oninput(){
        this.oninput();
    }

    /* Public */
    
    function Observer(){
        this._old = '';
        this._el = null;
        this._onchange = bind.call(onchange, this);
        this._onfocus = bind.call(onfocus, this);
        this._onblur = bind.call(onblur, this);
        this._oninput = bind.call(oninput, this);
        this.oninput = function(){};
    }

    var p = Observer.prototype;

    p.trigger = function () {
        return this._onchange();
    };

    p.sync = function () {
        this._old = this._el.value;
    };

    p.observe = function(el){
        if ( el == null || (
                el.tagName.toLowerCase() != INPUT &&
                el.tagName.toLowerCase() != TEXTAREA
            )
        ) {
            throw 'Target input element must be specified.';
        }

        var me = this;
        me._el = el;

        // higher priority to use prooperty change
        // because IE9 oninput is not implemented correctly
        // when you do backspace it doesn't fire oninput
        if ( el.attachEvent ) {
            me._old = el.value;
            el.attachEvent('onpropertychange', me._onchange);
            el.attachEvent('onfocus', me._onfocus);
            el.attachEvent('onblur', me._onblur);
            // binding onkeypress to avoid https://gist.github.com/normanzb/137a8b9d0cf317a1be58
            el.attachEvent('onkeypress', me._onchange);
            el.attachEvent('onkeyup', me._onchange);
        }
        else if ( hasOnInput ) {
            el.addEventListener(INPUT, me._onchange, false);
            // monitor onchange event as well just in case chrome browser bugs:
            // https://code.google.com/p/chromium/issues/detail?id=353691
            el.addEventListener(CHANGE, me._onchange, false);
        }
        else {
            throw 'Something wrong, should never goes to here.';
        }
    };

    p.neglect = function (){
        var me = this;
        var el = me._el;

        if ( el.attachEvent ) {
            el.detachEvent('onpropertychange', me._onchange);
            el.detachEvent('onfocus', me._onfocus);
            el.detachEvent('onblur', me._onblur);
            el.detachEvent('onkeypress', me._onchange);
            el.detachEvent('onkeyup', me._onchange);
        }
        else {
            el.removeEventListener(INPUT, me._onchange);
            el.removeEventListener(CHANGE, me._onchange);
        }

    };

    p.dispose = function() {
        var me = this;
        me.neglect();
        me._el = null;
    };

    return Observer;
});