/*!require:*/
/*
	jQueryPlugin: xinput
	cross browser input event implementation
*/
;!function($, etui){

	$ = etui.$;

	var DATA_KEY_OPTS = 'jQuery.fn.xinput';


	var init = function(){
		var $el = $(this);
		var opts = $el.data(DATA_KEY_OPTS);
		var callbacks = opts.callbacks;

		$el
			.bind('input', callbacks[callbacks.length - 1])
        	.bind('propertychange',(function(callbacks){
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
	};

	var exports = {
		xinput: function(callback){
			

			var opts = this.data(DATA_KEY_OPTS);
			if (!opts){
				opts = {callbacks: []};
				this.data(DATA_KEY_OPTS, opts);
			}

			if (!opts.callbacks){
				opts.callbacks = [];
			}

			opts.callbacks.push(callback);
			
			return this.each(init);
		}
	};

	$.fn.extend(exports);

    // add etui compatible plugin
    // if etui is loaded
    if (etui && etui.$ && !(etui.$.fn.texttip)){
        etui.$.fn.extend(exports);
    }


}(window.jQuery, window.etui);