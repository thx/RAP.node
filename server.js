var express = require('express');
var app = express();
var port = process.env.PORT || 7429;        // set our port
var api = require('./route/api');
var index = require('./route/index');

app.use('/api', api);
app.use('/index', index);
app.use(express.static(__dirname + '/public'));
app.use('/doc', express.static(__dirname + '/doc'));
app.listen(port);

console.log('RAP.node server deployed on port ' + port);
process.on('uncaughtException', function ( err ) {
    console.error('An uncaughtException was found.');
    console.error(err.message);
    console.error(err.stack);
});

