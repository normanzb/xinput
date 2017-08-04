# XInput

Cross browser input event observer

# Usage

Use it as global variable:

    var x = new XInput();
    x.observe(elInput);
    x.oninput = function(){
        console.log('input changed');
    };

Or use it as amd module:

    require(['./XInput'], function(XInput){
        var x = new XInput();
        x.observe(elInput);
        x.oninput = function(){
            console.log('input changed');
        };
    });


# Method

* observe: start observing the change
* neglect: stop observing the change
* sync: sync up input value (usually after value is changed by code)
* trigger: will call into oninput event handler

# Callback

* oninput: will be called once the input value gets changed

