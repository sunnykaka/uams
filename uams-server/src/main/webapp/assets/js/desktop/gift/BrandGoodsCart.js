/**
 * 品牌已经添加的赠品列表
 * Created by HuaLei.Du on 14-2-20.
 */

Ext.define('EBDesktop.GiftBrandGoodsCartModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'prodId', 'brandName', 'prodName', 'prodNo', 'prodCode', 'giftProdCount'],
    idProperty: 'id'
});

Ext.define('EBDesktop.gift.BrandGoodsCart', {
    extend: 'Ext.container.Container',
    alias: 'widget.giftBrandGoodsCart',
    id: 'giftBrandGoodsCart',
    height: 150,
    initComponent: function () {

        Ext.tip.QuickTipManager.init();

        var brandGoodsCartStore,
            goodListGridCart;

        // 商品列表store
        brandGoodsCartStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'EBDesktop.GiftBrandGoodsCartModel',
            proxy: {
                type: 'ajax',
                api: {
                    read: '/giftBrandItem/detail'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'data.list',
                    messageProperty: 'msg'
                }
            },
            autoLoad: false
        });

        // 商品列表Grid
        goodListGridCart = Ext.create('Ext.grid.Panel', {
            region: 'center',
            store: brandGoodsCartStore,
            height: 120,
            forceFit: true,
            id: 'giftBrandGoodsCartGrid',
            viewConfig: {
                emptyText: '<div style="text-align:center; padding:10px;color:#F00">没有数据</div>'
            },
            plugins: new Ext.grid.plugin.CellEditing({
                pluginId: 'cellEdit',
                clicksToEdit: 2
            }),
            columns: [
                {
                    text: '品牌名称',
                    dataIndex: 'brandName',
                    width: 120
                },
                {
                    text: '赠品名称',
                    dataIndex: 'prodName',
                    width: 160
                },
                {
                    text: '赠品编码',
                    dataIndex: 'prodNo',
                    width: 100
                },
                {
                    header: '数量',
                    dataIndex: 'giftProdCount',
                    editor: {
                        xtype: "textfield",
                        allowBlank: false,
                        vtype: 'Number',
                        minValue: 1
                    }
                },
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
                    handler: function (btn, rowIndex, colIndex, item, e, record) {
                        btn.up('grid').getStore().remove(record);
                    }
                }
            ]
        });

        this.items = [goodListGridCart];

        this.callParent(arguments);
    }
});
