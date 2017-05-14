/**
 * ExclusiveRequst interface, provide a way to do some request
 * exclusivly, that is, those request submitted will be just one alive
 *
 * Param
 *   @cancelImpl : must be implemented, it should be a function, which
 *      accepts a handler object, and do cancelling the request submited
 *      with that handler
 *   @reqHdlrEnsureFunc : it's a function to check and ensure requests
 *      submitted by submit function returns a valid handler, by default,
 *      it is:
 *          (handler) {
 *              return handler;
 *          }
 */
function AbstractExclusiveRequest(cancelImpl, fireImpl, reqHdlrEnsureFunc) {
    // TODO: return false if obj is null or is not a function
    var isFunction = function(obj) { return obj; }

    /**
     * Checking subclass implements
     */
    // check cancelling function implementation
    if(!isFunction(cancelImpl)) {
        ariseError("Subclass should implements how the request will be cancelled.");
        return null;
    }

    // check ensure function
    if(reqHdlrEnsureFunc && !isFunction(reqHdlrEnsureFunc)) {
        ariseError("Trying to override request handler ensure function, but implementation is not a funciton!");
        reqHdlrEnsureFunc = null;
    }

    if(!reqHdlrEnsureFunc) {
        reqHdlrEnsureFunc = function(handler) { return handler; }
    }

    //TODO: check fire implementation
    // here... 
    if(!fireImpl) {
        fireImpl = function(_this, requestInvoker, args) {
            requestInvoker.apply(null, args)
        };
    }        

    /**
     * Build up instance
     */
    let self = {};

    /** Properties **/
    // this is how request will be cancelled
    self.cancelImpl = cancelImpl;
    self.fireImpl = fireImpl;
    self.ensureReqHandler = reqHdlrEnsureFunc;

    // fires a request
    // param:
    //   @_this: instance of ExclusiveRequest itself
    //   @requestInvoker: function that send request
    //   @args: arguments for @requestInvoker
    function _fireRequest(_this, requestInvoker, args, fireImpl) {
        if(!isFunction(requestInvoker)) {
            ariseError("Invalid parameter, request invoker should be a function which returns a cancellable request handler object.");
            return null;
        }

        let handler = fireImpl(_this, requestInvoker, args);

        if(!_this.ensureReqHandler(handler)) {
            ariseError("Trying to submit a request with a invalid handler!");
            return null;
        }

        _this.cancel();

        _this.currentReqHandler = handler;
        return handler;
    }

    /** Methods **/
    // function submit, use this function to launch a request
    self.submit = function(requestInvoker, requestArgs) {
        return _fireRequest(self, requestInvoker, requestArgs, self.fireImpl);
    };

    // function unique, use this function to decorate a request function, so 
    // it'll be more convinient to do refactoring
    self.unique = function(requestInvoker) {
        if(!requestInvoker) {
            return null;
        }

        let uReqIkr = function() {
            return _fireRequest(self, requestInvoker, arguments, self.fireImpl);
        }

        return uReqIkr;
    };

    // function cancel, use this function to manually cancel
    // current request
    self.cancel = function() {
        let currentReq = self.currentReqHandler;

        if(!currentReq) {
            return;
        }

        // do cancel
        self.cancelImpl(self, currentReq);
    };


    return self;
}

/**
 * Tipical fanctory methods to build implementations of AbstractExclusiveRequest
 */
// ajax implement
function ExclusiveAjax() {
    return new AbstractExclusiveRequest(function(xhr) {
        xhr.abort();
    });
}

// ajax implement, more careful one
function AnotherExclusiveAjax() {
    return new AbstractExclusiveRequest(
            function(_self, xhr) {
                xhr.abort();
            },
            null,
            function(_self, handler) {
                return handler && handler.constructor.name == "XMLHttpRequest";
            }
    );
}

// axios implement
function ExclusiveAxios() {
    return new AbstractExclusiveRequest(
            function(_self, prom) {
                prom.reject();
            },
            null,
            function(_self, handler) {
                return handler && handler.reject;
            }
    );
}


//////////////////////////////////////////////
//// Sample
//////////////////////////////////////////////
var er = ExclusiveAjax();

function requestFoo(url) {
    return $.ajax({type: "GET", url: url});
}

function requestBar() {
    return $.ajax({type: "GET", url: "www.baidu.com"});
}

function test() {
    console.log("raw ajax");
    er.unique($.ajax)({
        type: "GET",
        url: "www.baidu1.com"
    });

    console.log("bar");
    er.submit(requestBar);

    console.log("foo");
    er.submit(requestFoo, ["www.baidu2.com"]);

    console.log("another way to do foo");
    er.unique(requestFoo)("http://www.baidu3.com");

    console.log("bar");
    er.submit(requestBar);
}

export default {
    AbstractExclusiveRequest,
    ExclusiveAxios
}
