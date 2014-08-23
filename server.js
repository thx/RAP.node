var express = require('express');
var app = express();
var port = process.env.PORT || 8827;        // set our port
var api = require('./route/api');
var index = require('./route/index');

app.use('/api', api);
app.use('/index', index);
app.listen(port);

console.log('RAP.node server deployed on port ' + port);

