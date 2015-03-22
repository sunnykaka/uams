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

        this.bbar =  Ext.create('Ext.PagingToolbar', {
            store: 'OrderList',
            displayInfo: true,
            displayMsg: '当前页 {0} - {1} of {2}',
            emptyMsg: "没有页了"
        });

        this.tbar = {
            items: [
                { text: '返回客服处理', iconCls: 'icon-goback', belong: 'CONFIRMED', itemId: 'goBack_0'},
//              { text: '订单汇总', iconCls: 'icon-sum', belong: 'CONFIRMED', itemId: 'orderSummary', hidden: true},
                { text: '打印物流单', iconCls: 'icon-printer', belong: 'CONFIRMED', itemId: 'printPreview'},
                { text: '打印发货单', iconCls: 'icon-printer', belong: 'CONFIRMED', itemId: 'printInvoice'},
                { xtype: 'button', text: '联想物流单号', iconCls: 'icon-edit', belong: 'CONFIRMED', itemId: 'autoEditNum' },
                { text: '确认打印', iconCls: 'icon-import', belong: 'CONFIRMED', itemId: 'printLogistics'},
                { text: '返回待处理', iconCls: 'icon-goback', belong: 'PRINTED', hidden: true, itemId: 'goBack_1'},
                { text: '批量验货', iconCls: 'icon-batch-examine', belong: 'PRINTED', hidden: true, itemId: 'batchInspection'},
                { text: '验货', iconCls: 'icon-examine', belong: 'PRINTED', hidden: true, itemId: 'inspection'},
                { text: '返回已打印', iconCls: 'icon-goback', belong: 'EXAMINED', hidden: true, itemId: 'goBack_2'},
                { text: '确认发货', iconCls: 'icon-deliver', belong: 'EXAMINED', hidden: true, itemId: 'confirmationDelivery'},
                { text: '刷新', iconCls: 'icon-refresh', itemId: 'refresh'},
                { text: '导出表格', iconCls: 'icon-sum', itemId: 'orderExport', belong: 'INVOICED1', hidden: true},
                Ext.create('Ext.container.Container', {
                    width: 10,
                    html: '<object id="LODOP1" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0>' +
                        '<embed id="LODOP_EM1" TYPE="application/x-print-lodop" width=0 height=0 PLUGINSPAGE="install_lodop32.exe"></embed>' +
                        '</object>'
                })

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
            {text: '订单状态', width: 70, dataIndex: 'orderStatus', sortable: true, scope: Espide.Common.orderState, renderer: Espide.Common.orderState.getData },
            {text: '快递公司', dataIndex: 'shippingComp', sortable: true, width: 70, renderer: Espide.Common.getExpress },
            {text: '快递单号', dataIndex: 'shippingNo', sortable: true, width: 120, editor: {
                xtype: 'textfield'
            }},
            {text: '收货人', width: 90, dataIndex: 'receiverName', sortable: true},
            {text: '收货省', width: 80, dataIndex: 'receiverState', sortable: true},
            {text: '收货市', width: 80, dataIndex: 'receiverCity', sortable: true},
            {text: '收货区（县）', width: 100, dataIndex: 'receiverDistrict', sortable: true},
            {text: '收货地址', dataIndex: 'receiverAddress', sortable: true, width: 250},
            {text: '商品名称', dataIndex: 'itemName', sortable: true, width: 250},
            {text: '成交金额', dataIndex: 'totalFee', sortable: true, width: 80, renderer: function (value) {
                return ('￥' + value);
            }},
            {text: '总条数', width: 70, dataIndex: 'itemCount', sortable: true},
            {text: '总件数', dataIndex: 'itemNumCount', sortable: true, width: 70},
            {text: '买家留言', dataIndex: 'buyerMessage', sortable: true, width: 200},
            {text: '备注说明', dataIndex: 'remark', sortable: true, width: 200},
            {text: '买家ID', dataIndex: 'buyerId', sortable: true, width: 150},
            {text: '邮政编码', dataIndex: 'receiverZip', sortable: true, width: 100},
            {text: '收货电话', dataIndex: 'receiverPhone', sortable: true, width: 110},
            {text: '收货手机', dataIndex: 'receiverMobile', sortable: true, width: 110},
            {text: '库房', dataIndex: 'repoName', sortable: true, width: 200},
            {text: '下单时间', dataIndex: 'buyTime', width: 160, sortable: true, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            {text: '付款时间', dataIndex: 'payTime', sortable: true, width: 160, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            {text: '审单时间', dataIndex: 'confirmTime', sortable: true, width: 160, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            {text: '打单时间', width: 160, dataIndex: 'printTime', sortable: true, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            {text: '审单员', dataIndex: 'confirmUser', sortable: true, width: 80},
            {text: '打单员', dataIndex: 'printUser', sortable: true, width: 80},
            {text: '店铺名称', dataIndex: 'shopName', sortable: true, width: 200},
            {text: '发票抬头', dataIndex: 'invoiceName', sortable: true, width: 120},
            {text: '发票内容', dataIndex: 'invoiceContent', sortable: true, width: 150}

        ];

        this.callParent(arguments);

    }
});