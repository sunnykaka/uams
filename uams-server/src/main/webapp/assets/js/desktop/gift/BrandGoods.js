/**
 * 品牌赠品列表
 * Created by HuaLei.Du on 14-2-20.
 */

Ext.define('EBDesktop.GiftBrandGoodsModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'brandName', 'prodName', 'prodNo', 'prodCode'],
    idProperty: 'id'
});

Ext.define('EBDesktop.gift.BrandGoods', {
    extend: 'Ext.container.Container',
    alias: 'widget.giftBrandGoods',
    id: 'giftBrandGoods',
    //region: 'north',
    height: 300,
    forceFit: true,
    border: '1 0 0 0',
    //layout: 'border',
    initComponent: function () {

        var brandListStore,
            brandGoodsStore,
            goodsSearchForm,
            goodListGrid;

        // 商品搜索
        function doGiftBrandGoodsSearch() {
            Espide.Common.doSearch('giftBrandGoodsGrid', 'giftBrandGoodsSearch', true);
        }

        function addGoodsCart(btn, rowIndex, colIndex, item, e, record) {
            var brandGoodsCartStore = Ext.getCmp('giftBrandGoodsCartGrid').getStore(),
                brandGoodsStore = Ext.getCmp('giftBrandGoodsGrid').getStore(),
                prodCode = record.get('prodCode'),
                flag = false,
                newRecord;


            // 是否为第一条
            if (brandGoodsCartStore.data.items.length > 0) {
                // 遍历判断是否已经存在
                brandGoodsCartStore.each(function (records, index) {
                    if (records.get('prodCode') == prodCode) {
                        flag = true;
                    }
                });

            }

            if (flag) {
                Ext.Msg.alert('警告', '此商品已经添加过了');
                return;
            }

            newRecord = Ext.create('EBDesktop.GiftBrandGoodsCartModel', {
                prodId: record.get('id'),
                brandName: record.get('brandName'),
                prodName: record.get('prodName'),
                prodNo: record.get('prodNo'),
                prodCode: record.get('prodCode'),
                giftProdCount: 1
            });

            brandGoodsCartStore.insert(0, newRecord);
            brandGoodsStore.remove(record);
        }

        // 品牌列表store
        brandListStore = Espide.Common.createComboStore('/brand/forList', true);

        // 商品列表store
        brandGoodsStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'EBDesktop.GiftBrandGoodsModel',
            proxy: {
                type: 'ajax',
                api: {
                    read: '/giftProd/productDetail'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'data.list',
                    messageProperty: 'msg'
                }
            },
            //autoSync: true,
            autoLoad: false,
            pageSize: 50
        });

        // 商品搜索表单
        goodsSearchForm = Ext.create('Ext.form.Panel', {
            region: 'north',
            layout: 'hbox',
            border: 0,
            bodyStyle: {
                padding: '6px 0 6px 8px'
            },
            id: 'giftBrandGoodsSearch',
            defaults: {
                xtype: 'combo',
                labelWidth: 62,
                width: 160,
                margin: '0 10 0 0'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'type',
                    hidden: true,
                    value: 'GIFT'
                },
                {
                    name: 'brandId',
                    itemId: 'brandId',
                    labelWidth: 40,
                    fieldLabel: '品牌',
                    editable: false,
                    queryMode: 'local',
                    valueField: 'id',
                    displayField: 'name',
                    emptyText: '不限',
                    store: brandListStore
                },
                {
                    xtype: 'textfield',
                    name: 'prodName',
                    fieldLabel: '赠品名称',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                doGiftBrandGoodsSearch();
                            }
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'prodNo',
                    fieldLabel: '赠品编码',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                doGiftBrandGoodsSearch();
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '查询',
                    width: 80,
                    itemId: 'searchBtn',
                    handler: function () {
                        doGiftBrandGoodsSearch();
                    }
                },
                {
                    xtype: 'container',
                    html: '<span style="line-height:24px;color:#f00;font-weight:700">仅显示前50条</span>'
                }
            ]
        });

        // 商品列表Grid
        goodListGrid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            store: brandGoodsStore,
            forceFit: true,
            height: 170,
            id: 'giftBrandGoodsGrid',
            viewConfig: {
                emptyText: '<div style="text-align:center; padding:10px;color:#F00">没有数据</div>'
            },
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
                    xtype: 'actioncolumn',
                    text: '添加',
                    itemId: 'addRow',
                    menuDisabled: true,
                    width: 50,
                    items: [
                        {
                            iconCls: 'icon-add'
                        }
                    ],
                    handler: addGoodsCart
                }
            ]
        });

        this.items = [goodsSearchForm, goodListGrid];

        this.callParent(arguments);
    }
});
