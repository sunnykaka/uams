/**
 * 产品分类列表
 * Created by Lein.xu
 */

//定义品牌列表数据模型
Ext.define('EBDesktop.productCategoryModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name'],
    idProperty: 'id'
});
//定义品牌列表容器
Ext.define('EBDesktop.productCategory.productCategoryList', {
    extend: 'Ext.container.Container',
    alias: 'widget.productCategoryList',
    id: 'productCategoryList',
    title: "产品分类管理",
    fixed: true,
    layout: 'border',
    initComponent: function () {
        // 产品分类数据集
        var productCategoryListStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'EBDesktop.productCategoryModel',
            proxy: {
                type: 'ajax',
                api: {
                    read: '/prodCategory/list'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'data.obj.result',
                    messageProperty: 'message',
                    totalProperty: 'data.obj.totalCount'
                }
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    var data = Ext.decode(response.responseText);
                    Ext.MessageBox.show({
                        title: '警告',
                        msg: data.msg,
                        icon: Ext.MessageBox.ERROR,
                        button: Ext.Msg.OK
                    });
                }
            },
            autoSync: true,
            autoLoad: {start: 0, limit: 13},
            pageSize: 13
        });

        //产品分类查询
        function searchProductCategory(button) {
            Espide.Common.doSearch("productCategoryListGrid", "searchProductCategory", true);
        }

        // 刷新productCategoryListGrid
        function refreshProductGrid() {
            Ext.getCmp('productCategoryListGrid').getStore().load();
        }

        //添加产品分类
        function ProductCategoryAdd() {
            var formItems = [];
            formItems.push({
                    fieldLabel: '产品分类',
                    name: 'name',
                    regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                    regexText: '首尾不得包含空格'
                }
            );

            //创建用户添加表单
            var productAddForm = Ext.create('Ext.form.Panel', {
                baseCls: 'x-plain',
                labelWidth: 80,
                defaults: {
                    width: 380
                },
                id: 'productAddForm',
                forceFit: true,
                border: false,
                layout: 'form',
                header: false,
                frame: false,
                bodyPadding: '5 5 0',
                requires: ['Ext.form.field.Text'],
                fieldDefaults: {
                    msgTarget: 'qtip',
                    blankText: '不能为空',
                    allowBlank: false,
                    labelAlign: "left",
                    labelSeparator: "：",
                    labelWidth: 75
                },
                defaultType: 'textfield',
                items: formItems

            });
            //创建一个弹窗容器，把表单面板放进弹窗容器
            var addWin = Ext.create("Ext.window.Window", {
                title: '添加品牌分类',
                width: 500,
                height: 150,
                modal: true,
                autoHeight: true,
                layout: 'fit',
                plain: true,
                buttonAlign: 'right',
                bodyStyle: 'padding:5px;',
                items: productAddForm,
                buttons: [
                    {
                        text: '保存',
                        itemId: 'addBtn',
                        handler: function () {
                            var addForm = productAddForm.getForm();
                            datas = addForm.getValues();

                            if (addForm.isValid()) {
                                addForm.submit({
                                    clientValidation: true, //对客户端进行验证
                                    url: "/prodCategory/add",
                                    method: "post",
                                    params: {name: datas["name"]},
                                    success: function (form, action) {
                                        var data = Ext.JSON.decode(action.response.responseText);
                                        if (data.success) {
                                            Espide.Common.tipMsg('保存成功', data.msg);
                                            addWin.close();
                                            Ext.getCmp('productCategoryListGrid').getStore().load();

                                        }
                                    },
                                    failure: function (form, action) {

                                        var data = Ext.JSON.decode(action.response.responseText);
                                        Ext.MessageBox.show({
                                            title: '提示',
                                            msg: data.msg,
                                            buttons: Ext.MessageBox.OK,
                                            icon: 'x-message-box-warning'
                                        });

                                    }
                                });

                            }
                        }


                    },
                    {
                        text: '重写',
                        itemId: 'resetBtn',
                        handler: function () {
                            productAddForm.getForm().reset();
                        }
                    }
                ]
            });
            //显示弹窗
            addWin.show();
        }

        //产品分类删除
        function ProductCategoryDel() {
            var url = 'prodCategory/delete',
                ids = Espide.Common.getGridSels('productCategoryListGrid', 'id');

            if (ids.length < 1) {
                Espide.Common.showGridSelErr('请先选择要删除的产品分类');
                return;
            }

            Ext.MessageBox.confirm('提醒', '您确定要删除吗？', function (optional) {
                Espide.Common.doAction({
                    url: url,
                    params: {
                        idArray: ids.join()
                    },
                    successCall: function () {
                        Ext.getCmp('productCategoryListGrid').getStore().loadPage(1);
                    },
                    successTipMsg: '删除成功'
                })(optional);
            });
        }


//顶栏表单
        var searchForm = Ext.create('Ext.form.Panel', {
            region: 'north',
            layout: 'hbox',
            border: 0,
            bodyStyle: {
                padding: '6px 0 6px 8px'
            },
            id: 'searchProductCategory',
            defaults: {
                xtype: 'combo',
                labelWidth: 90,
                margin: '0 10 0 0'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: '产品分类名称',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                searchProductCategory();
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '查询',
                    itemId: 'searchBtn',
                    handler: searchProductCategory
                },
                {
                    xtype: 'button',
                    text: '添加',
                    itemId: 'addBtn',
                    handler: ProductCategoryAdd
                },
                {
                    xtype: 'button',
                    text: '删除已选定',
                    itemId: 'delBtn',
                    handler: ProductCategoryDel
                }
            ]
        });
        //创建角色数据表格容器
        var productCategoryListGrid = Ext.create("Ext.grid.Panel", {
                region: 'center',
                id: 'productCategoryListGrid',
                loadMask: true,
                forceFit: true,
                selType: 'checkboxmodel',
                store: productCategoryListStore,
                columns: [
                    {
                        header: '产品分类名称',
                        dataIndex: 'name'
                    }

                ],
                bbar: new Ext.PagingToolbar({
                    displayMsg: "显示第 {0} 条到 {1} 条记录，一共 {2} 条记录",
                    store: productCategoryListStore,
                    displayInfo: true,
                    emptyMsg: '没有记录'
                }),
                listeners: {
                    'itemdblclick': function (view, record, item, index, event) {//单元格绑定双击事件

                        var formItems = [];
                        formItems.push({
                                fieldLabel: '商品名称',
                                name: 'name',
                                value: record.get('name')
                            }
                        );

                        var productCategoryUpdateForm = Ext.create('Ext.form.Panel', {
                            baseCls: 'x-plain',
                            labelWidth: 80,
                            id: 'productCategoryUpdateForm',
                            forceFit: true,
                            border: false,
                            layout: 'form',
                            header: false,
                            frame: false,
                            bodyPadding: '5 5 0',
                            requires: ['Ext.form.field.Text'],
                            fieldDefaults: {
                                blankText: '不能为空',
                                allowBlank: false,
                                msgTarget: 'side',
                                labelWidth: 75
                            },
                            defaultType: 'textfield',
                            items: formItems

                        });


                        var winUpdate = Ext.create("Ext.window.Window", {
                            title: "修改产品分类",
                            width: 500,
                            height: 150,
                            items: productCategoryUpdateForm,
                            buttonAlign: "right",
                            modal: true,
                            buttons: [
                                {
                                    text: '保存',
                                    itemId: 'updateBtn',
                                    handler: function () {
                                        if (productCategoryUpdateForm.isValid()) {
                                            productCategoryUpdateForm.getForm().submit({
                                                url: "/prodCategory/update",
                                                params: {id: record.get("id"), name: record.get('name')},
                                                waitMsg: "保存成功...",
                                                success: function (form, action) {

                                                    var data = Ext.JSON.decode(action.response.responseText);
                                                    if (data.success) {
                                                        Espide.Common.tipMsg('保存成功', data.msg);
                                                        winUpdate.close();
                                                        Ext.getCmp('productCategoryListGrid').getStore().load();

                                                    }
                                                },
                                                failure: function (form, action) {

                                                    var data = Ext.JSON.decode(action.response.responseText);
                                                    Ext.MessageBox.show({
                                                        title: '提示',
                                                        msg: data.msg,
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: 'x-message-box-warning'
                                                    });

                                                }
                                            });
                                        }

                                    }
                                }
                            ]
                        });
                        //更新窗口
                        winUpdate.show();
                    }
                }
            }
        );


        this.items = [searchForm, productCategoryListGrid];
        this.callParent(arguments);
    }

});
