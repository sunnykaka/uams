/**
 * Created by HuaLei.Du on 13-12-19.
 */
Ext.define('Stock.view.List', {
    extend: 'Ext.container.Container',
    alias: 'widget.stockList',
    id: 'stockList',
    fixed: true,
    layout: 'border',
    initComponent: function () {

        var brandListStore = Espide.Common.createComboStore('/brand/forList', true), // 品牌列表Store
            repositoryListStore = Espide.Common.createComboStore('/repository/findAll', true), // 仓库列表Store
            productCategoryListStore = Espide.Common.createComboStore('/prodCategory/forList', true), // 商品分类列表Store
            isForceFit = false, // 是否强制Grid的列自适应宽度
            searchForm, // 库存搜索表单
            stockGrid; // 库存Grid

        searchForm = Ext.create('Ext.form.Panel', {
            region: 'north',
            title: '库存管理',
            layout: 'hbox',
            border: 0,
            bodyStyle: {
                padding: '6px 0 6px 8px'
            },
            id: 'stockListSearch',
            defaults: {
                xtype: 'combo',
                labelWidth: 60,
                width: 180,
                margin: '0 10 0 0'
            },
            items: [
                {
                    name: 'brandId',
                    itemId: 'brandId',
                    fieldLabel: '品牌',
                    editable: false,
                    queryMode: 'local',
                    valueField: 'id',
                    displayField: 'name',
                    emptyText: '不限',
                    store: brandListStore
                },
                {

                    name: 'repoId',
                    fieldLabel: '选择仓库',
                    editable: false,
                    queryMode: 'local',
                    valueField: 'id',
                    displayField: 'name',
                    emptyText: '不限',
                    store: repositoryListStore
                },
                {
                    name: 'cid',
                    fieldLabel: '商品分类',
                    editable: false,
                    queryMode: 'local',
                    valueField: 'id',
                    displayField: 'name',
                    emptyText: '不限',
                    store: productCategoryListStore
                },
                {
                    xtype: 'textfield',
                    name: 'prodName',
                    fieldLabel: '产品名称'
                },
                {
                    xtype: 'textfield',
                    name: 'prodNo',
                    fieldLabel: '产品编码'
                },
                {
                    xtype: 'textfield',
                    name: 'prodCode',
                    fieldLabel: '产品条码'
                },
                {
                    xtype: 'button',
                    text: '查询',
                    width: 80,
                    //ui: 'default-toolbar',
                    itemId: 'searchBtn'
                }
            ]
        });

        if (window.screen.width > 1880) {
            isForceFit = true;
        }

        stockGrid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            store: 'List',
            forceFit: isForceFit,
            id: 'stockListGrid',
            viewConfig: {
                enableTextSelection: true,
                emptyText: '<div style="text-align:center; padding:10px;color:#F00">没有数据</div>',
                markDirty: false
            },
            plugins: new Ext.grid.plugin.CellEditing({
                pluginId: 'cellEdit',
                clicksToEdit: 2
            }),
            columns: [
                {
                    text: 'id',
                    dataIndex: 'id',
                    width: 80
                },
                {
                    text: '仓库名',
                    dataIndex: 'repoName',
                    width: 160
                },
                {
                    text: '品牌',
                    dataIndex: 'brandName',
                    width: 160
                },
                {
                    text: '商品分类',
                    dataIndex: 'prodCaName',
                    width: 160
                },
                {
                    text: '商品名',
                    dataIndex: 'prodName',
                    width: 260
                },
                {
                    text: '商品编码',
                    dataIndex: 'prodNo',
                    width: 120
                },
                {
                    text: '商品条形码',
                    dataIndex: 'prodCode',
                    width: 120
                },
                {
                    text: '销售价',
                    dataIndex: 'shopPrice',
                    width: 100
                },
                {
                    text: '市场价',
                    dataIndex: 'standardPrice',
                    width: 100
                },
                {
                    text: '库存',
                    dataIndex: 'actuallyNumber',
                    width: 100,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                        allowDecimals: false
                    }
                },
                {
                    text: '商品描述',
                    dataIndex: 'description',
                    width: 260
                },
                {
                    text: '关键属性说明',
                    dataIndex: 'propsStr',
                    width: 260
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: 'List',
                displayInfo: true
            })
        });

        this.items = [searchForm, stockGrid];

        this.callParent(arguments);
    }
});