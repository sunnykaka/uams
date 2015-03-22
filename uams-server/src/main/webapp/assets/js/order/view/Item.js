/*
 * Created by king on 13-12-17
 */

Ext.define('Supplier.view.Item', {
    extend: 'Ext.grid.Panel',
    region: 'south',
    alias: 'widget.orderItem',
    id: 'orderItem',
    itemId: 'item',
    hidden: true,
    height: 200,
    split: true,
    store: 'ItemList',
    forceFit: true,
    viewConfig: {
        enableTextSelection: true
    },
    selType: 'checkboxmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        })
    ],
    columns: [
        { text: '商品id', dataIndex: 'id', width: 55, hidden: true},
        { text: '商品编号', dataIndex: 'prodNo', width: 55},
        { text: '商品名称', dataIndex: 'prodName', width: 170},
        { text: '条形码', dataIndex: 'skuCode', width: 60},
        { text: '类别', dataIndex: 'itemType', width: 45, scope: Espide.Common.goodType, renderer: Espide.Common.goodType.getData},
        { text: '单价', dataIndex: 'prodPrice', width: 45, xtype: 'numbercolumn', format:'0.00'},
        { text: '数量', dataIndex: 'prodCount', width: 40, editor: {
            xtype: 'numberfield',
            allowDecimals: false,
            minValue: 1
        }},
        { text: '总价', dataIndex: 'totalFee', width: 60, xtype: 'numbercolumn', format:'0.00'},
        { text: '实际总价', dataIndex: 'actualFee', width: 60, xtype: 'numbercolumn', format:'0.00', editor: {
            xtype: 'numberfield',
            minValue: 0
        }},
        { text: '价格描述', dataIndex: 'priceDescription', width: 120, editor: {xtype: 'textfield', allowBlank: true}},
        { text: '库存', dataIndex: 'actuallyNumber', width: 40},
        { text: '品牌', dataIndex: 'brandName', width: 70},
        { text: '原订单编号', dataIndex: 'outOrderNo', width: 90},
        {
            xtype: 'actioncolumn',
            text: '删除',
            menuDisabled: true,
            itemId: 'goodRemove',
            width: 50,
            items: [
                {
                    iconCls: 'icon-remove'
                }
            ]
        }
    ]
})