var express = require('express');
var router = express.Router();
var DocMgr = require('../service/docMgr');
var docMgr = new DocMgr();
var request = require('request');
var util = require('./common');
var conf = require('../conf');
var rapServer = conf.RAP_API_SERVER;
var fs = require('fs');

router.get('/generateDoc', function(req, res) {
    var projectId = +req.query.projectId;
    if (projectId > 0) {
        request(rapServer + '/queryRAPModel.do?projectId=' + projectId, function(err, response, body) {
            if (err) {
               util.err(err, res);
            } else {
                try {
                    var data = eval('(' + body + ')');
                    var model = eval('(' + data.modelJSON + ')');
                    var filePath = './doc/' + projectId + '.html';
                    model.mockjsMap = data.mockjsMap;
                    var html = docMgr.do(model, function(html, err) {
                        if (html === null) {
                            util.err(err, res);
                        } else {
                            try {
                                fs.writeFileSync(filePath, html);
                            } catch (err) {
                                    res.json({'code' : 500, 'msg' : err.message});
                            }
                            res.json({code : 200});
                        }
                    });
                } catch (err) {
                    res.json({code : 500, msg : err.message});
                }
            }
        });
    } else {
        util.err('Illegal param: projectId=' + projectId, res);
    }
});

module.exports = router;
