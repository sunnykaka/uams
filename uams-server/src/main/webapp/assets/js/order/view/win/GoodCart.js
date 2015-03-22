/**
 * Created by king on 13-12-23
 */

Ext.define('Supplier.view.win.GoodCart', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.goodCart',
    region: 'south',
    height: 160,
    id: 'goodCart',
    forceFit: true,
    store: 'GoodCart',
    selType: 'checkboxmodel',
    viewConfig: Espide.Common.getEmptyText(),
    initComponent: function () {
        this.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2
            })
        ];
        this.columns = [
            {text: '自增号', dataIndex: 'autoId', hidden: true},
            {text: '商品编号', dataIndex: 'prodNo'},
            {text: '商品类型', dataIndex: 'itemType', hidden: true},
            {text: '数量', dataIndex: 'prodCount', editor: {
                xtype: 'numberfield',
                allowDecimals: false,
                minValue: 1
            }, renderer: function (value) {
                return (value + ' 件');
            }},
            {text: '商品单价', dataIndex: 'prodPrice', xtype: 'numbercolumn', format:'0.00'},
            {text: '商品总价', dataIndex: 'totalFee', xtype: 'numbercolumn', format:'0.00', width: 150},
            {text: '实际总价', dataIndex: 'actualFee', xtype: 'numbercolumn', format:'0.00', width: 150, editor: {
                xtype: 'numberfield',
                minValue: 0
            }},
            {text: '商品名称', dataIndex: 'prodName'},
            {text: '条形码', dataIndex: 'skuCode'},
            {
                xtype: 'actioncolumn',
                text: '删除',
                menuDisabled: true,
                width: 50,
                items: [
                    {
                        iconCls: 'icon-remove'
                    }
                ],
                handler: function (view, rowIndex, colIndex, item, e, record) {
                    view.up('grid').getStore().remove(record);
                }
            }
        ];
        this.callParent(arguments);
    }
})