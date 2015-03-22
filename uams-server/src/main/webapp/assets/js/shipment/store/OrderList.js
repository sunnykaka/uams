/*
 * Created by king on 13-12-19
 */

Ext.define('Supplier.store.OrderList',{
    //不要忘了继承
    extend:'Ext.data.Store',
    //记得设置model
    model:'Supplier.model.OrderList',
    //自动加载设为true
    autoSync: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        batchActions: false,
        //limitParam: 'limitNum',
        extraParams: {
            orderStatus: 'CONFIRMED'
        },
        api: {
            read: 'order/list',
            //read: '/assets/js/order/data/orderList.json',
            create: '/assets/js/order/data/orderList.json',
            update: '/order/updateShippingNo',
            destroy: '/assets/js/order/data/orderList.json'
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            root: 'data.obj.result',
            totalProperty: 'data.obj.totalCount',
            messageProperty: 'msg'
        },
        writer: {
            type: 'json',
            encode: true,
            writeAllFields: false,
            root: 'data'
        },
        listeners: {
            exception: function(proxy, response, operation){
                if(!!response.responseText){
                    var data = Ext.decode(response.responseText);
                    Ext.MessageBox.show({
                        title: '警告',
                        msg: data.msg,
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        }
    },
    listeners: {
        write: function(proxy, operation) {
            var com = Espide.Common,
                data = Ext.decode(operation.response.responseText);
            if (data.success) {
                com.tipMsg('操作成功', '订单修改成功');
                //com.reLoadGird('OrderList', 'search', false);
            } else {
                Ext.Msg.show({
                    title: '错误',
                    msg: data.msg,
                    buttons: Ext.Msg.YES,
                    icon: Ext.Msg.WARNING
                });
            }
        }
    },
    pageSize: 100
});