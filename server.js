var request = require('request');

request('http://etaoux-bj.taobao.ali.com:8080/api/queryRAPModel.do?projectId=354', function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    } else {
        console.log(error);
    }
});
