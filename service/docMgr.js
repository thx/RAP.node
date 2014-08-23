var aglio = require('aglio');
var BlueprintAdapter = require('../lib/blueprintAdapter');
var path = require('path');

function DocMgr() {

}

DocMgr.prototype.do = function(model, cb) {  
	var adapter = new BlueprintAdapter(model.moduleList[0].pageList[0].actionList[0]);
	var blueprintText = adapter.getBlueprintText('html');
	var tempPath = path.resolve('./templates/default-multi.jade');
    aglio.render(blueprintText, tempPath, function(err, html, warnings) {
    	if (err) {
    		cb(null, err);
    	} else {
    		cb(html);
    	}
    });
};


/**
 * default js/css resources will be blocked in China
 * so we need map these urls to local server
 */
function mapStaticSource() {
	var PATTERNS = [
		'//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css', 
		'//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css',
		'//fonts.googleapis.com/css?family=Roboto:400,700|Inconsolata|Raleway:200',
		'//code.jquery.com/jquery-1.11.0.min.js',
		'//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js'
	];
}


module.exports = DocMgr;