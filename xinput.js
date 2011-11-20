/*!require:*/
/*
    jQueryPlugin: xinput
    cross browser input event implementation
*/
;!function($, etui){

    var DATA_KEY_OPTS = 'jQuery.fn.xinput';

    var testee = document.createElement('input');
    var supportInput = "oninput" in testee || checkEvent(testee);
    /*
       The following function tests an element for oninput support in Firefox.  Many thanks to
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
            el.addEventListener("input", tester, false);
            el.focus();
            el.dispatchEvent(e);
            el.removeEventListener("input", tester, false);
            document.body.removeChild(el);
            return ok;
        } catch(e) {}
    }

    function bind($, callback){
        var $el = $(this);
        var opts = begatOptions($el);
        var callbacks = opts.callbacks;

        callbacks.push(callback);

        if (!!opts.bound == false){
            $el.bind('propertychange',(function(callbacks){
                return function(){
                    var $el = $(this);
                    var pt = opts.prevText;
                    opts.prevText = $el.val();
                    
                    if (pt !== $el.val()){
                        var l = callbacks.length;
                        while(l--){
                            callbacks[l].apply(this, arguments);
                        }
                        
                    }
                };
            })(callbacks));
            opts.prevText = $el.val();
            opts.bound = true;
        }
    };

    function unbind($, callback){
        var $el = $(this);
        var opts = begatOptions($el);
        var callbacks = opts.callbacks;

        var l = callbacks.length;
        while(l--){
            if (callbacks[l] == callback){
                callbacks.splice(l, 1);
            }
        }
    };


    function begatOptions($el){
        var opts = $el.data(DATA_KEY_OPTS);
        if (!opts){
            opts = {callbacks: []};
            $el.data(DATA_KEY_OPTS, opts);
        }

        if (!opts.callbacks){
            opts.callbacks = [];
        }

        return opts;
    }

    var exports = {
        xinput: function(callback){
        
            return this.bind('xinput', callback);
        }
    };

    function funcBind(which, params){
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        return function(){
            var innerArgs = args.concat(arguments);
            return which.apply(this, innerArgs);
        };
        
    };

    function jQOverwrite($){
        var jQBind = $.fn.bind,
            jQUnbind = $.fn.unbind;

        $.fn.bind = function(eventName, callback){

            if (eventName === 'xinput'){

                if (!supportInput){
                    
                    return this.each(funcBind(bind, $, callback));
                }

                eventName = 'input';
            }

            return jQBind.apply(this, arguments);
        };

        $.fn.unbind = function(eventName){

            if (eventName === 'xinput'){
                
                if (!supportInput){
                    
                    return this.each(funcBind(unbind, $, callback));
                }

                eventName = 'input';
            }

            return jQUnbind.apply(this, arguments);
        };

        $.fn.extend(exports);

        return jQOverwrite;
    };

    
    jQOverwrite($);


    // add etui compatible plugin
    // if etui is loaded
    if (etui && etui.$ && !(etui.$.fn.texttip)){
        jQOverwrite(etui.$);
    }


}(window.jQuery, window.etui);