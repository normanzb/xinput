/*!require:*/
/*
	jQueryPlugin: xinput
	cross browser input event implementation
*/
;!function($, etui){

	var DATA_KEY_OPTS = 'jQuery.fn.xinput',
		DATA_KEY_XINPUT = 'jQuery.fn.xinput.prevText';

	var defaultSettings = {
		callback: jQuery.noop
	};

	var init = function(){
		var $el = $(this);
		var opts = $el.data(DATA_KEY_OPTS);

		$el
			.bind('input', opts.callback)
        	.bind('propertychange',(function(callback){
            	return function(){
	                var el = $(this);
	                var pt = el.data(DATA_KEY_XINPUT);
	                el.data(DATA_KEY_XINPUT, el.val());
	                if (pt !== el.val()){
	                    callback.apply(this, arguments);
	                }
            	};
        	})(opts.callback))
        	.data(DATA_KEY_XINPUT, $el.val());
	};

	var exports = {
		xinput: function(callback){
			var opts = $.extend({}, defaultSettings, {
				callback: callback
			});

			this.data(DATA_KEY_OPTS, opts);
			
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