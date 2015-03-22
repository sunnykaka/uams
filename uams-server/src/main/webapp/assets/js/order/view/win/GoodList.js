/**
 * Created by king on 13-12-23
 */

Ext.define('Supplier.view.win.GoodList', {
    extend: 'Ext.grid.Panel',
    region: 'center',
    alias: 'widget.goodList',
    id: 'goodList',
    height: 200,
    forceFit: true,
    store: 'GoodList',
    selType: 'checkboxmodel',
    viewConfig: Espide.Common.getEmptyText(),
    initComponent: function () {
        this.tbar = [
            Ext.create('Ext.form.Panel', {
                layout: 'hbox',
                border: false,
                itemId: 'goodSearch',
                items: [
                    {
                        xtype: 'textfield',
                        emptyText: '请输入关键字',
                        itemId: 'keyword',
                        allowBlank: false,
                        name: 'param',
                        width: 120,
                        margin: '0 5 0 0'
                    },
                    {
                        xtype: 'combo',
                        hideLabel: true,
                        name: 'paramType',
                        width: 90,
                        queryMode: 'local',
                        triggerAction: 'all',
                        forceSelection: true,
                        editable: false,
                        value: 'PRODNAME',
                        store: [
                            ['PRODNAME', '商品名称'],
                            ['PRODNO', '商品编号']
                        ],
                        margin: '0 5 0 0'
                    },
                    {
                        xtype: 'combo',
                        hideLabel: true,
                        name: 'orderItemType',
                        itemId: 'searchType',
                        width: 80,
                        queryMode: 'local',
                        triggerAction: 'all',
                        forceSelection: true,
                        editable: false,
                        value: 'PRODUCT',
                        store: Espide.Common.goodType.getStore(),
                        margin: '0 5 0 0'
                    },
                    {
                        xtype: 'button',
                        text: '搜索',
                        margin: '0 5 0 0',
                        itemId: 'searchBtn'
                    }
                ]
            }),
            '->',
            {xtype: 'numberfield', value: 1, minValue: 1, width: 110, name: 'addGiftNum', itemId: 'addNum', fieldLabel: '增加数量', labelWidth: 60},
            {xtype: 'button', text: '增加', iconCls: 'icon-add', disabled: false, itemId: 'addBtn'}
        ];
        this.columns = [
            {text: '商品编号', dataIndex: 'prodNo'},
            {text: '商品名称', dataIndex: 'prodName'},
            {text: '条形码', dataIndex: 'skuCode'},
            {text: '商品类型', dataIndex: 'itemType', hidden: true},
            {text: '商品单价', dataIndex: 'prodPrice', xtype: 'numbercolumn', format:'0.00'},
            {
                xtype: 'actioncolumn',
                text: '增加',
                itemId: 'addRow',
                menuDisabled: true,
                width: 50,
                iconCls: 'icon-add'
            }
        ];
        this.callParent(arguments);
    }
});
