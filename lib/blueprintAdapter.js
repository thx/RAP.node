/** * translate between RAP data and Blueprint API */
var BaseAdapter = require('./baseAdapter.js');
var HEADER = 'FORMAT: 1A\n';

function BlueprintAdapter(model) {
    this.data = model;
}

BlueprintAdapter.prototype = Object.create(new BaseAdapter());

BlueprintAdapter.prototype.getBlueprintText = function(type) {
    var i, j, k;
    var data = this.data;
    var mod, page, action;
    var arr = [];
    arr.push(HEADER);

    console.log('prepare...');
    // model is action
    if (data.responseParameterList) {
        console.log('model is action');
        return convertAction(data);
    } else if (data.moduleList) { // model is project
        for (i = 0; i < data.moduleList.length; i++) {
            mod = data.moduleList[i];
            for (j = 0; j < mod.pageList.length; j++) {
                page = mod.pageList[j];
                arr.push('# ' + mod.name + '-' + page.name);
                arr.push(page.description);
                for (k = 0; k < page.actionList.length; k++) {
                    action = page.actionList[k];
                    arr.push(convertAction(action));
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

function convertAction(actionModel) {
    var a = [];
    var d = actionModel;

    a.push('## ' + d.name + ' [' + d.requestUrl + ']');
    a.push(d.description);
    a.push('');
    a.push('+ Model 200 (application/json)');
    a.push('');
    a.push('```js');
    var pListJSON = JSON.stringify(d.responseParameterList, null, 4);
    /**
    if (type == 'html') {
        pListJSON = pListJSON.replace(/ /g, '&nbsp;');
        pListJSON = pListJSON.replace(/\n/g, '<br />');
    }
    */
    a.push(pListJSON);
    a.push('```');
    var result =  a.join('\n');
    return result;
}

module.exports = BlueprintAdapter;