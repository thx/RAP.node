var express = require('express');
var app = express();
var request = require('request');
var port = process.env.PORT || 8827;        // set our port
var router = express.Router();              // get an instance of the express Router
var aglio = require('aglio');
var BlueprintAdapter = require('./lib/blueprintAdapter.js');

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/doc', function(req, res) {
    console.log('send request...');
    request('http://etaoux-bj.taobao.ali.com:8439/api/queryRAPModel.do?projectId=354', function(err, response, body) {
        console.log('request returned...');
        if (err) {
            res.json({
                code : 500,
                msg : err.message
            });
        } else {
            var data = JSON.parse(body);
            var model = JSON.parse(data.modelJSON);
            var adapter = new BlueprintAdapter(model.moduleList[0].pageList[0].actionList[0]);
            var blueprintText = adapter.getBlueprintText();

            aglio.render(blueprintText, 'default', function(err, html, warnings) {
                res.setHeader('Content-Type', 'text/html');
                res.setHeader('Congtent-Length', html.length);
                res.send(html);
            });
        }
    });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('RAP.node server deployed on port ' + port);

