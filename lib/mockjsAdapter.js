/**
 * translate between RAP data and MockJS
 */
var BaseAdapter = require('baseAdapter');

function MockjsAdapter() {

}

MockjsAdapter.prototype = Object.create(new BaseAdapter);

global.MockjsAdapter = MockjsAdapter;
exports = MockjsAdapter;
