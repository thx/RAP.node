module.exports.err = function(err, res) {
	var errorObj = {
		code : 500,
		msg : 'unknown error'
	};

	if (typeof err === 'object') {
		errorObj.msg = err.message;
	    errorObj.stack = err.stack;
    } else if (typeof err === 'string') {
    	errorObj.msg = err;
    }

    res.json(errorObj);
};