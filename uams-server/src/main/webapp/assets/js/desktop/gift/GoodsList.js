/**
 * 商品优惠活动 - 商品列表
 * Created by HuaLei.Du on 14-1-7.
 */
Ext.define('EBDesktop.GiftGoodsListModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'brandName', 'prodName', 'prodNo', 'shopPrice'],
    idProperty: 'id'
});

Ext.define('EBDesktop.gift.GoodsList', {
    extend: 'Ext.container.Container',
    alias: 'widget.giftGoodsList',
    id: 'giftGoodsList',
    region: 'north',
    height: 330,
    forceFit: true,
    //layout: 'border',
    initComponent: function () {

        var brandListStore,
            goodListStore,
            goodsSearchForm,
            goodListGrid;

        // 商品搜索
        function doGiftGoodsSearch() {
            Espide.Common.doSearch('giftGoodsListGrid', 'giftGoodsSearch', true);
        }

        // 品牌列表store
        brandListStore = Espide.Common.createComboStore('/brand/forList', true);

        // 商品列表store
        goodListStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'EBDesktop.GiftGoodsListModel',
            proxy: {
                type: 'ajax',
                api: {
                    //read: '/assets/js/desktop/gift/data/goodsList.json',
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
            id: 'giftGoodsSearch',
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
                    value: 'PRODUCT'
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
                    fieldLabel: '产品名称',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                doGiftGoodsSearch();
                            }
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'prodNo',
                    fieldLabel: '产品编码',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                doGiftGoodsSearch();
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
                        doGiftGoodsSearch();
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
            store: goodListStore,
            forceFit: true,
            height: 250,
            id: 'giftGoodsListGrid',
            selType: 'checkboxmodel',
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
                    text: '商品名称',
                    dataIndex: 'prodName',
                    width: 160
                },
                {
                    text: '商品编码',
                    dataIndex: 'prodNo',
                    width: 100
                },
                {
                    text: '销售价',
                    dataIndex: 'shopPrice',
                    width: 80
                }
            ]
        });

        this.items = [goodsSearchForm, goodListGrid];

        this.callParent(arguments);
    }
});