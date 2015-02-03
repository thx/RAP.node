var aglio = require('aglio');
var BlueprintAdapter = require('../lib/blueprintAdapter');
var path = require('path');
var conf = require('../conf');


function DocMgr() {

}

DocMgr.prototype.do = function(model, cb) {  
	var adapter = new BlueprintAdapter(model);
	var blueprintText = adapter.getBlueprintText('html');
    aglio.render(blueprintText, 'default', function(err, html, warnings) {
    	if (err) {
    		cb(null, err);
    	} else {
    		cb(mapStaticSource(html));
    	}
    });
};


/**
 * default js/css resources will be blocked in China
 * so we need map these urls to local server
 */
function mapStaticSource(html) {
	// return html;
	var PATTERNS = [
		['//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css', 'css/bootstrap.min.css'],
		['//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css', 'css/font-awesome.min.css'],
		['//fonts.googleapis.com/css\\?family=Roboto:400,700\\|Inconsolata\\|Raleway:200', 'css/css.css'],
		['//code.jquery.com/jquery-1.11.0.min.js', '/js/jquery-1.11.0.min.js'],
		['//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js', 'js/bootstrap.min.js']
	];
	var pattern;

	for (var i = 0; i < PATTERNS.length; i++) {
		pattern = PATTERNS[i];
		var reg = new RegExp(pattern[0], 'gi');
		html = html.replace(reg, conf.SERVER + pattern[1]);
	}
	return html;
}


module.exports = DocMgr;