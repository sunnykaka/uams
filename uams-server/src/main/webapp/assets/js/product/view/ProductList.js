/*
 * Created by king on 13-12-17
 */

Ext.define('Product.view.ProductList', {
    extend: 'Ext.container.Container',
    id: 'ProductList',
    alias: 'widget.productList',
    title: "产品管理",
    fixed: true,
    layout: "fit",
    selType: 'checkboxmodel',
    initComponent: function () {


        //搜索按钮触发事件
        function searchProduct(){
            var value = Ext.getCmp('productListGrid').down('#value').getValue();
            var type = Ext.getCmp('productListGrid').down('#type').getValue();

            var  store = Ext.getCmp('productListGrid').getStore();
            var new_params = {
                searchType: type,
                searchValue: value
            };
            store.getProxy().extraParams = new_params;
            store.reload();
        }


//创建角色数据表格容器

        var productListGrid = Ext.create("Ext.grid.Panel", {
            region: 'center',
            title: "产品管理",
            id: 'productListGrid',
            loadMask: true,
            forceFit: true,
            selType: 'checkboxmodel',
            store: 'ProductList',
            viewConfig: {
                enableTextSelection: true,
                emptyText: '<div style="text-align:center; padding:10px;color:#F00">没有数据</div>',
                markDirty: false
            },
            columns: [
                {
                    header: '产品ID',
                    width:60,
                    dataIndex: 'id'

                },
                {
                    header: '产品品牌',
                    width:60,
                    dataIndex: 'brandName'

                },
                {
                    header: '产品名称',
                    width:100,
                    dataIndex: 'prodName'

                },
                {
                    header: '产品编号',
                    width:100,
                    dataIndex: 'prodNo'

                },
                {
                    header: '产品条形码',
                    width:100,
                    dataIndex: 'prodCode'

                },
                {
                    header: '产品分类',
                    width:80,
                    dataIndex: 'prodCategoryName'
                },
                {
                    header: '产品描述',
                    width:100,
                    dataIndex: 'description'
                },
                {
                    header: '销售价',
                    width:60,
                    dataIndex: 'shopPriceStr'
                },
                {
                    header: '市场价',
                    width:60,
                    dataIndex: 'standardPriceStr'
                },
                {
                    header: '进货价',
                    width:60,
                    dataIndex: 'buyPriceStr'
                },
                {
                    header: '颜色',
                    width:80,
                    dataIndex: 'color'
                },
                {
                    header: '重量',
                    width:60,
                    dataIndex: 'weight'
                },
                {
                    header: '尺寸',
                    width:100,
                    dataIndex: 'boxSize'
                },
                {
                    header: '规格',
                    width:100,
                    dataIndex: 'speci'
                },
                {
                    header: '产品类型',
                    width:60,
                    dataIndex: 'type',
                    renderer: function (value) {
                        switch (value) {
                            case "PRODUCT":
                                return "商品";
                                break;
                            case "GIFT":
                                return "赠品";
                                break;
                        }
                    }
                }

            ],
            tbar: [
                {xtype: 'combo', store: [
                    ["prodCode", "产品条形码"],
                    ["prodName", "产品名称"],
                    ["prodNo", "产品编号"]

                ], queryMode: 'local', name: "searchType", value: "prodCode", width: 100, itemId: "type"},
                {
                    xtype: 'textfield',
                    name: 'shopName',
                    width: 150,
                    itemId: "value",
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                searchProduct();
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    name: 'submuit',
                    text: '搜索',
                    handler: searchProduct
                },
                '-',
                {
                    xtype: 'button',
                    text: '删除已选定',
                    iconCls: 'icon-remove',
                    id:"del"
                },
                '-',
                {
                    xtype: 'button',
                    text: '添加产品',
                    iconCls: 'icon-add',
                    id:"add"
                },
                '-',
                {
                    xtype: 'button',
                    text: '导入产品',
                    iconCls: 'icon-add',
                    id:"include"
                }
            ],
            plugins:[
                Ext.create('Ext.grid.plugin.CellEditing',{
                    clicksToEdit:1 //设置单击单元格编辑
                })
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                displayMsg: "显示第 {0} 条到 {1} 条记录，一共 {2} 条记录",
                store: 'ProductList',
                displayInfo: true,
                emptyMsg: '没有记录'
            })
        });

        this.items = [productListGrid];
        this.callParent(arguments);

    }
});