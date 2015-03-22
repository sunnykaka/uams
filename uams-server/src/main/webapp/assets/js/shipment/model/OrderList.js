/*
 * Created by king on 13-12-19
 */

Ext.define('Supplier.model.OrderList',
    {
        //不要忘了继承
        extend:'Ext.data.Model',
        fields: [
            {name: 'id', type: 'int'},
            'orderNo',
            'orderStatus',
            'itemName',
            'totalFee',
            'itemCount','itemNumCount','buyerMessage','remark','buyerId',
            'receiverState','receiverCity','receiverDistrict', 'receiverName',
            'receiverAddress', 'receiverZip', 'receiverPhone', 'receiverMobile',
            'shippingNo', 'shippingComp', 'repoName',
            {name: 'buyTime', type: 'date', dateFormat: 'time'},
            {name: 'payTime', type: 'date', dateFormat: 'time'},
            {name: 'confirmTime', type: 'date', dateFormat: 'time'},
            {name: 'printTime', type: 'date', dateFormat: 'time'},
            'confirmUser','printUser',
            'shopName','invoiceName','invoiceContent'
        ],
        idProperty: 'id'
    }
)