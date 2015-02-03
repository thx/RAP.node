/** * translate between RAP data and Blueprint API */
var BaseAdapter = require('./baseAdapter.js');
var HEADER = 'FORMAT: 1A';
var Mock = require('mockjs');

function BlueprintAdapter(model) {
    this.data = model;
    this.mockjsMap = model.mockjsMap ? model.mockjsMap : {};
}

BlueprintAdapter.prototype = Object.create(new BaseAdapter());

BlueprintAdapter.prototype.getBlueprintText = function(type) {
    var i, j, k;
    var data = this.data;
    var mod, page, action;
    var arr = [];
    this.actionNameMap = {};
    this.seed = 1;

    arr.push(HEADER);
    arr.push('');

    console.log('prepare...');
    // model is action
    if (data.responseParameterList) {
        return this.convertAction(data);
    } else if (data.moduleList) { // model is project
        arr.push('# ' + titleFilter(data.name, 200) + '接口文档');
        arr.push(data.introduction);
        arr.push('');
        for (i = 0; i < data.moduleList.length; i++) {
            mod = data.moduleList[i];
            for (j = 0; j < mod.pageList.length; j++) {
                page = mod.pageList[j];
                arr.push('# Group ' + titleFilter(mod.name) + ' - ' + titleFilter(page.name));
                arr.push(page.description);
                for (k = 0; k < page.actionList.length; k++) {
                    action = page.actionList[k];
                    arr.push(this.convertAction(action));
                }
            }
        }
        console.log('blueprint api result\n', arr.join('\n'));
        return arr.join('\n');
    } else {
        console.log('Illegal RAP data model:', data);
        return "Illegal RAP data model.";
    }
};

BlueprintAdapter.prototype.convertAction = function(actionModel)  {
    var a = [];
    var d = actionModel;
    var actionName = titleFilter(d.name, 16);

    // prevent action name duplicate
    if (this.actionNameMap[actionName]) { 
        actionName += this.seed++;
    }

    a.push('## ' + actionName + ' [' + (d.requestUrl.charAt(0) == '/' ? '' : '/') + d.requestUrl + ']');
    a.push((actionName.indexOf('..') > -1 ? (d.name + ':') : '') + d.description);
    a.push('');
    a.push('+ Model');
    a.push('    + Body');
    var mockObj = this.mockjsMap[d.id];
    if (typeof mockObj === 'string') {
        mockObj = eval('(' + mockObj + ')');
        mockObj = Mock.mock(mockObj);
    } else {
        mockObj = {};
    }
    var mockData = JSON.stringify(mockObj, null, 4);
    var requestType = 'GET';
    if (d.requestType == 2) {
        requestType = 'POST';
    } else if (d.requestType == 3) {
        requestType = 'PUT';
    } else if (d.requestType == 4) {
        requestType = 'DELETE';
    }
    a.push(mockData);
    a.push('');
    a.push('### ' + requestType + ' [' + requestType + ']');
    a.push('');
    a.push('+ Response 200');
    a.push('');
    a.push('    [' + actionName + '][]');
    a.push('');
    var result =  a.join('\n');
    this.actionNameMap[actionName] = true;    
    return result;
}

/**
 * escape Blueprint API reserved chars
 */
function titleFilter(c, length) {
    length = length || 8;
    var str = c.replace(/\(|\)|\[|\]|\//g, ' ');
    if (str.length > length) {
        str = str.substring(0, length) + '..';
    }
    return str;
}

module.exports = BlueprintAdapter;
