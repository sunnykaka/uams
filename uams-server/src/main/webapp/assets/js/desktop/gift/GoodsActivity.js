/**
 * 商品优惠活动 - 活动列表
 * Created by HuaLei.Du on 13-12-30.
 */
Ext.define('EBDesktop.GiftGoodsActivityModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'brandName', 'sellProdId', 'sellProdName', 'prodNo', 'giftProdId', 'giftProdName', 'giftProdCount', 'inUse'],
    idProperty: 'id'
});

Ext.define('EBDesktop.gift.GoodsActivity', {
    extend: 'Ext.container.Container',
    alias: 'widget.giftGoodsActivity',
    id: 'giftGoodsActivity',
    fixed: true,
    layout: 'border',
    initComponent: function () {

        var goodsGridId = 'giftGoodsActivityGrid',
            giftListStore,
            searchForm,
            giftGoodsActivityGrid;

        // 显示添加窗口
        function showAddWin() {

            var saveWin = Ext.getCmp('giftGoodsActivityAdd') || Ext.widget('giftGoodsActivityAdd'),
                saveForm;

            saveWin.show().setTitle('添加商品活动');
            saveForm = Ext.getCmp('giftGoodsActivityAddForm');
            saveForm.getForm().reset();
        }

        // 显示修改窗口
        function showEditWin(t, record) {
            var saveWin = Ext.getCmp('giftGoodsActivityEdit') || Ext.widget('giftGoodsActivityEdit'),
                saveForm = Ext.getCmp('giftGoodsActivityEditForm');

            saveForm.getForm().loadRecord(record);
            if (!record.data.inUse) {
                saveForm.down('[itemId=inUseYes]').setValue(false);
                saveForm.down('[itemId=inUseNo]').setValue(true);
            }
            saveWin.show();
        }

        // 移除商品活动
        function removeGift() {
            var url = '/giftProd/delete',
                ids = Espide.Common.getGridSels(goodsGridId, 'id');

            if (ids.length < 1) {
                Espide.Common.showGridSelErr('请先选择要删除的商品活动');
                return;
            }

            Ext.MessageBox.confirm('提醒', '您确定要删除吗？', function (optional) {
                Espide.Common.doAction({
                    url: url,
                    params: {
                        ids: ids.join()
                    },
                    successCall: function () {
                        Espide.Common.reLoadGird(goodsGridId, false, true);
                    },
                    successTipMsg: '删除成功'
                })(optional);
            });
        }

        // 商品活动搜索
        function doGiftGoodsActivitySearch() {
            Espide.Common.doSearch(goodsGridId, 'giftGoodsActivitySearch', true);
        }

        giftListStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'EBDesktop.GiftGoodsActivityModel',
            proxy: {
                type: 'ajax',
                api: {
                    read: '/giftProd/list'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'data.obj.result',
                    totalProperty: 'data.obj.totalCount',
                    messageProperty: 'msg'
                }
            },
            pageSize: 12,
            autoLoad: false
        });

        searchForm = Ext.create('Ext.form.Panel', {
            region: 'north',
            layout: 'hbox',
            border: 0,
            bodyStyle: {
                padding: '6px 0 6px 8px'
            },
            id: 'giftGoodsActivitySearch',
            defaults: {
                xtype: 'combo',
                labelWidth: 60,
                margin: '0 10 0 0'
            },
            items: [
                {
                    xtype: 'combo',
                    store: [
                        ['prodNo', '商品编码'],
                        ['prodName', '商品名称'],
                        ['brandName', '品牌名称']
                    ],
                    queryMode: 'local',
                    name: 'searchType',
                    value: 'prodNo',
                    editable: false,
                    width: 100
                },
                {
                    xtype: 'textfield',
                    name: 'searchValue',
                    width: 160,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                doGiftGoodsActivitySearch();
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '查询',
                    width: 60,
                    itemId: 'searchBtn',
                    handler: function () {
                        doGiftGoodsActivitySearch();
                    }
                },
                {
                    xtype: 'button',
                    text: '添加活动',
                    width: 70,
                    itemId: 'addBtn',
                    handler: showAddWin
                },
                {
                    xtype: 'button',
                    text: '删除已选',
                    width: 70,
                    itemId: 'deleteBtn',
                    handler: removeGift
                }
            ]
        });

        giftGoodsActivityGrid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            store: giftListStore,
            forceFit: true,
            id: goodsGridId,
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
                    text: '购买商品',
                    dataIndex: 'sellProdName',
                    width: 120
                },
                {
                    text: '商品编码',
                    dataIndex: 'prodNo',
                    width: 120
                },
                {
                    text: '赠送的商品',
                    dataIndex: 'giftProdName',
                    width: 120
                },
                {
                    text: '赠送数量',
                    dataIndex: 'giftProdCount',
                    width: 60
                },
                {
                    text: '是否启用',
                    dataIndex: 'inUse',
                    width: 60,
                    renderer: function (value) {
                        if (value) {
                            return '是';
                        }
                        return '否';
                    }
                }
            ],
            listeners: {
                'itemdblclick': showEditWin
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                store: giftListStore,
                displayInfo: true
            })
        });

        this.items = [searchForm, giftGoodsActivityGrid];

        this.callParent(arguments);
    }
});