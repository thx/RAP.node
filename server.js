var express = require('express');
var app = express();
var port = process.env.PORT || 8827;        // set our port
var api = require('./route/api');
var index = require('./route/index');
var nodeStatic = require('node-static');

app.use('/api', api);
app.use('/index', index);
app.use(express.static(__dirname + '/public'));
app.listen(port);

console.log('RAP.node server deployed on port ' + port);

