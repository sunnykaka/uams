/**
 * 日志类型列表
 */
Ext.define('Log.model.LogList', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'userName',
        'operationName',
        'resourceName',
        {name: 'createTime', type: 'date', dateFormat: 'time'},
        'requestUrl',
        'executionTime'
    ],
    idProperty: 'id'
});