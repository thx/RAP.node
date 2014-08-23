var express = require('express');
var router = express.Router();
var DocMgr = require('../service/docMgr');
var docMgr = new DocMgr();
var request = require('request');
var util = require('./common');
var conf = require('../conf');

var rapServer = conf.RAP_API_SERVER;

router.get('/doc', function(req, res) {
    var projectId = +req.query.projectId;
    if (projectId > 0) {
        request(rapServer + '/queryRAPModel.do?projectId=' + projectId, function(err, response, body) {
            if (err) {
               util.err(err, res);
            } else {
                var data = JSON.parse(body);
                var model = JSON.parse(data.modelJSON);
                var html = docMgr.do(model, function(html, err) {
                    if (html === null) {
                        util.err(err, res);
                    } else {
                        res.setHeader('Content-Type', 'text/html');
                        res.setHeader('Congtent-Length', html.length);
                        res.send(html);
                    }
                });
            }
        });
    } else {
        util.err('Illegal param: projectId=' + projectId, res);
    }
});

module.exports = router;