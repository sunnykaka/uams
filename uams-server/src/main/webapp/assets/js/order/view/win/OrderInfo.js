/*
* Created by king on 13-12-17
*/

Ext.define('Supplier.view.win.OrderInfo', {
    extend: 'Ext.form.Panel',
    id: 'orderInfo',
    region: 'north',
    alias: 'widget.orderInfo',
    bodyPadding: 10,
    layout:'anchor',
    height: 'auto',
    defaults: {
        margin: '0 0 10 0',
        layout: 'hbox',
        border: 0,
        defaults: {
            xtype: 'textfield',
            margin: '0 10 0 0',
            labelWidth: 60,
            width: 200,
            queryMode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            editable: false
        }
    },
    initComponent: function (){
        this.items = [
            {
                items: [
                    {
                        name: 'buyerId',
                        fieldLabel: '买家Id',
                        allowBlank: false
                    },
                    {
                        name: 'receiverPhone',
                        fieldLabel: '收货电话',
                        emptyText: '0000-0000000',
                        vtype: 'Phone',
                        allowBlank: true

                    },
                    {
                        name: 'receiverMobile',
                        fieldLabel: '收货手机',
                        vtype: 'Mobile',
                        allowBlank: false
                    },
                    {
                        name: 'orderType',
                        fieldLabel:'订单类型',
                        allowBlank: false,
                        xtype: 'combo',
                        value: 'NORMAL',
                        store: Espide.Common.orderType.getStore()
                    }
                ]
            },
            {
                items: [
                    {
                        name: 'receiverState',
                        itemId: 'receiverState',
                        fieldLabel:'收货省',
                        width: 160,
                        xtype: 'combo',
                        emptyText: "请选择",
                        allowBlank: false,
                        store: Espide.City.getProvinces()
                    },
                    {
                        name: 'receiverCity',
                        itemId: 'receiverCity',
                        fieldLabel:'收货市',
                        width: 160,
                        xtype: 'combo',
                        emptyText: "请选择",
                        allowBlank: false,
                        store: []
                    },
                    {
                        name: 'receiverDistrict',
                        itemId: 'receiverDistrict',
                        fieldLabel:'收货区',
                        width: 180,
                        xtype: 'combo',
                        emptyText: "请选择",
                        allowBlank: false,
                        store: []
                    },
                    {
                        name: 'receiverAddress',
                        fieldLabel:'收货地址',
                        width: 300,
                        allowBlank: false
                    }
                ]
            },
            {
                items: [
                    {
                        name: 'receiverName',
                        width: 180,
                        fieldLabel:'收货人',
                        allowBlank: false
                    },
                    {
                        name: 'receiverZip',
                        width: 160,
                        fieldLabel:'邮政编码',
                        allowBlank: true
                    },
                    {
                        fieldLabel: '快递',
                        labelWidth: 40,
                        width:150,
                        name: 'shippingComp',
                        xtype: 'combo',
                        emptyText: '请选择',
                        allowBlank: false,
                        store: Espide.Common.expressStore()
                    },
                    {
                        fieldLabel: '店铺',
                        labelWidth: 40,
                        width: 310,
                        xtype: 'combo',
                        emptyText: '请选择',
                        name: 'shopId',
                        itemId: 'shopId',
                        valueField: 'shopId',
                        displayField: 'title',
                        allowBlank: false,
                        store: 'ShopAll'
                    }
                ]
            },
            {
                items: [
//                    {
//                        name: 'totalFee',
//                        width: 160,
//                        xtype: 'numberfield',
//                        minValue: 0,
//                        fieldLabel: '成交金额',
//                        editable: true,
//                        disabled: true,
//                        value: 0
//                    },
                    {
                        name: 'buyerMessage',
                        width: 405,
                        margin: '0 20 0 0',
                        fieldLabel: '买家留言',
                        allowBlank: true
                    },
                    {
                        name: 'remark',
                        width: 405,
                        fieldLabel: '备注说明',
                        allowBlank: true
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
})