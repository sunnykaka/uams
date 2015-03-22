Ext.define('Log.store.LogList', {

    extend: 'Ext.data.Store',
    model: 'Log.model.LogList',
    proxy: {
        type: 'ajax',
        api: {
            read:"/log/list"
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            root: 'data.obj.result',
            messageProperty: 'message',
            totalProperty: 'data.obj.totalCount'
        }
    },
    listeners: {
        exception: function (proxy, response, operation) {
            var data = Ext.decode(response.responseText);
            Ext.MessageBox.show({
                title: '警告',
                msg: data.msg,
                icon: Ext.MessageBox.ERROR,
                button: Ext.Msg.OK
            });
        }
    },
    autoSync: true,
    autoLoad: {start: 0, limit: 30},
    pageSize: 30

});
