/*
 * Created by king on 13-12-17
 */

Ext.define('Supplier.view.List', {
    extend: 'Ext.grid.Panel',
    region: 'center',
    id: 'OrderList',
    itemId: 'list',
    alias: 'widget.orderList',
    store: 'OrderList',
    foreFit: false,
    split: true,
    selType: 'checkboxmodel',
    viewConfig: {
        enableTextSelection: true
    },
    initComponent: function () {

        this.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2
            })
        ];

        this.tbar = {
            items: [
                {
                    xtype: 'button',
                    text: '拆分',
                    iconCls: 'icon-split',
                    itemId: 'splitOrderBtn'
                },
                {
                    xtype: 'button',
                    text: '合并',
                    iconCls: 'icon-join',
                    itemId: 'mergerOrderBtn'
                },
                {
                    xtype: 'button',
                    text: '批量删除',
                    iconCls: 'icon-remove',
                    itemId: 'batDelete'
                },
                {
                    xtype: 'button',
                    text: '订单作废',
                    iconCls: 'icon-cancel',
                    itemId: 'cancelOrder'
                },
                {
                    xtype: 'button',
                    text: '订单恢复',
                    iconCls: 'icon-recover',
                    itemId: 'recoverOrder'
                },
                {
                    xtype: 'button',
                    text: '批量改状态',
                    iconCls: 'icon-batch-edit',
                    itemId: 'batEditState'
                },
                {
                    xtype: 'button',
                    text: '联想物流单号',
                    hidden: true,
                    iconCls: 'icon-edit',
                    itemId: 'autoEditNum'
                },
                {
                    xtype: 'button',
                    text: '导入进销存',
                    iconCls: 'icon-import',
                    itemId: 'importOrder'
                },
                {
                    xtype: 'button',
                    text: '标记打印',
                    hidden: true,
                    iconCls: 'icon-import',
                    itemId: 'signPrinter'
                },
                {
                    xtype: 'button',
                    text: '加产品',
                    iconCls: 'icon-cart-put',
                    itemId: 'addGood'
                },
                {
                    xtype: 'button',
                    text: '加订单',
                    iconCls: 'icon-add',
                    itemId: 'addOrder'
                },
                {
                    xtype: 'button',
                    text: '复制订单',
                    iconCls: 'icon-copy',
                    itemId: 'copyOrder'
                },
                {
                    xtype: 'button',
                    text: '汇总',
                    iconCls: 'icon-add',
                    itemId: 'orderCollect',
                    hidden: true
                },
                {
                    xtype: 'button',
                    text: '刷新',
                    iconCls: 'icon-refresh',
                    itemId: 'orderRefresh'
                },
                '->',
                { xtype: 'displayfield', itemId: 'orderConut', value: '0', fieldLabel: '订单总条数', labelWidth: 70, hiden: true}
            ]
        };

        this.columns = [
            {
                xtype: 'actioncolumn',
                width: 5,
                text: '操作',
                sortable: false,
                menuDisabled: true,
                locked: true,
                items: [
                    {
                        iconCls: 'icon-remove',
                        tooltip: '删除当前条'
                    }
                ]
            },
            {text: '自增号', dataIndex: 'id', sortable: true, menuDisabled: true, width: 150, hidden: true},
            {text: '订单编号', dataIndex: 'orderNo', sortable: true, menuDisabled: true, width: 150},
            {text: '订单状态', width: 80, dataIndex: 'orderStatus', sortable: true, scope: Espide.Common.orderState, renderer: Espide.Common.orderState.getData },
            {text: '商品名称', dataIndex: 'itemName', sortable: true, width: 250},
            {text: '成交金额', dataIndex: 'totalFee', sortable: true, width: 80, xtype: 'numbercolumn', format:'0.00'},
            {text: '总条数', width: 70, dataIndex: 'itemCount', sortable: true},
            {text: '总件数', dataIndex: 'itemNumCount', sortable: true, width: 70},
            {text: '买家留言', dataIndex: 'buyerMessage', sortable: true, width: 200, editor: {xtype: 'textfield', allowBlank: true}},
            {text: '备注说明', dataIndex: 'remark', sortable: true, width: 200, editor: {xtype: 'textfield', allowBlank: true}},
            {text: '买家ID', dataIndex: 'buyerId', sortable: true, width: 150},
            {text: '收货省', width: 100, dataIndex: 'receiverState', sortable: true, editor: {
                xtype: 'combo',
                triggerAction: 'all',
                listeners: {
                    change: function (btn, newValue) {
                        btn.hasChange = true;
                    },
                    blur: function (btn) {
                        Ext.getCmp('OrderList').getSelectionModel().getSelection()[0].set('receiverCity', '请选择');
                        Ext.getCmp('OrderList').getSelectionModel().getSelection()[0].set('receiverDistrict', '请选择');
                        btn.hasChange = false;
                    }
                },
                store: Espide.City.getProvinces()
            }},
            {text: '收货市', width: 100, dataIndex: 'receiverCity', sortable: true, editor: {
                xtype: 'combo',
                triggerAction: 'all',
                listeners: {
                    change: function () {
                        Ext.getCmp('OrderList').getSelectionModel().getSelection()[0].set('receiverDistrict', '请选择');
                    },
                    focus: function (combo) {
                        var province = Ext.getCmp('OrderList').getSelectionModel().getSelection()[0].get('receiverState'),
                            cities = Espide.City.getCities(province);
                        combo.getStore().loadData(cities);
                    }
                },
                store: Espide.City.getCities()
            }},
            {text: '收货区（县）', width: 100, dataIndex: 'receiverDistrict', sortable: true, editor: {
                xtype: 'combo',
                triggerAction: 'all',
                listeners: {
                    focus: function (combo) {
                        var record = Ext.getCmp('OrderList').getSelectionModel().getSelection()[0],
                            province = record.get('receiverState'),
                            city = record.get('receiverCity'),
                            areas = Espide.City.getAreas(province, city);
                        combo.getStore().loadData(areas);
                    }
                },
                store: Espide.City.getAreas()
            }},
            {text: '收货地址', dataIndex: 'receiverAddress', sortable: true, width: 250, editor: {xtype: 'textfield', allowBlank: false}},
            {text: '收货人', width: 90, dataIndex: 'receiverName', sortable: true, editor: {xtype: 'textfield', allowBlank: false}},
            {text: '邮政编码', dataIndex: 'receiverZip', sortable: true, width: 100, editor: {xtype: 'textfield', allowBlank: false}},
            {text: '收货电话', dataIndex: 'receiverPhone', sortable: true, width: 110, editor: {xtype: 'textfield', vtype: 'Phone', allowBlank: true}},
            {text: '收货手机', dataIndex: 'receiverMobile', sortable: true, width: 110, editor: {xtype: 'textfield', vtype: 'Mobile', allowBlank: false}},
            {text: '快递单号', dataIndex: 'shippingNo', sortable: true, width: 120},
            {text: '快递公司ID', dataIndex: 'repoId', sortable: true, hidden: true},
            {text: '快递公司', dataIndex: 'shippingComp', sortable: true, width: 70, renderer: Espide.Common.getExpress, editor: {
                xtype: 'combo',
                triggerAction: 'all',
                store: Espide.Common.expressStore()
            } },
            {text: '库房', dataIndex: 'repoName', sortable: true, width: 200},
            {text: '下单时间', dataIndex: 'buyTime', width: 160, sortable: true, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            {text: '付款时间', dataIndex: 'payTime', sortable: true, width: 160, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            {text: '审单时间', dataIndex: 'confirmTime', sortable: true, width: 160, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            {text: '打单时间', width: 160, dataIndex: 'printTime', sortable: true, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            {text: '审单员', dataIndex: 'confirmUser', sortable: true, width: 80},
            {text: '打单员', dataIndex: 'printUser', sortable: true, width: 80},
            {text: '店铺名称', dataIndex: 'shopName', sortable: true, width: 200},
            {text: '店铺ID', dataIndex: 'shopId', sortable: true, width: 200, hidden: true},
            {text: '发票抬头', dataIndex: 'invoiceName', sortable: true, width: 120, editor: {xtype: 'textfield', allowBlank: false}},
            {text: '发票内容', dataIndex: 'invoiceContent', sortable: true, width: 150, editor: {xtype: 'textfield', allowBlank: false}},
            {text: '原始订单号', dataIndex: 'outOrderNo', sortable: true, menuDisabled: true, width: 150}

        ];

        this.callParent(arguments);

    }
})