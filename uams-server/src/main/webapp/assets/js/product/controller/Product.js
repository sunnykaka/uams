/**
 * Created by Lein xu
 */
Ext.define('Product.controller.Product', {
    extend: 'Ext.app.Controller',
    views: ['ProductList'],
    stores: ['ProductList', 'BrandCategoryList', 'BrandList', 'WarehouseList'],
    models: ['ProductList', 'BrandCategoryList', 'BrandList', 'WarehouseList'],
    init: function () {
        this.control({
            "#add": {
                'click': function (button) {
                    var addProductForm = Ext.create('Ext.form.Panel', {
                        region: 'center',
                        id: 'addProductForm',
                        height: 'auto',
                        bodyPadding: 10,
                        layout: 'anchor',
                        border: 0,
                        defaults: {
                            xtype: 'textfield',
                            margin: '0 0 5 0',
                            labelWidth: 100,
                            labelAlign: 'right',
                            width: 350,
                            queryMode: 'local',
                            triggerAction: 'all',
                            allowBlank: false,
                            forceSelection: true,
                            editable: false,
                            minValue: 1
                        },
                        items: [
                            {
                                name: 'picUrl',
                                fieldLabel: '产品图片',
                                hidden: true,
                                value: "无"
                            },
                            {   name: 'type',
                                id: "type",
                                xtype: 'combo',
                                queryMode: 'local',
                                triggerAction: 'all',
                                forceSelection: true,
                                editable: false,
                                fieldLabel: '产品分类',
                                value: 'PRODUCT',
                                store: [
                                    ['GIFT', '赠品'],
                                    ['PRODUCT', '商品']
                                ],
                                listeners: {
                                    change: function () {
                                        var form = Ext.getCmp('addProductForm');
                                        var upform = form.getForm();
                                        if (Ext.getCmp("type").getRawValue() == "赠品") {
                                            upform.findField('standardPriceStr').setValue(0);
                                            upform.findField('shopPriceStr').setValue(0);
                                            upform.findField('buyPriceStr').setValue(0);
                                            upform.findField('standardPriceStr').setReadOnly(true);
                                            upform.findField('shopPriceStr').setReadOnly(true);
                                            upform.findField('buyPriceStr').setReadOnly(true);

                                        } else {
                                            upform.findField('standardPriceStr').setValue("");
                                            upform.findField('shopPriceStr').setValue("");
                                            upform.findField('buyPriceStr').setValue("");
                                            upform.findField('standardPriceStr').setReadOnly(false);
                                            upform.findField('shopPriceStr').setReadOnly(false);
                                            upform.findField('buyPriceStr').setReadOnly(false);
                                        }
                                    }
                                }
                            },
                            {
                                name: 'prodName',
                                fieldLabel: '产品名称',
                                maxLength: 32
                            },
                            {   name: 'brandId',
                                fieldLabel: '产品品牌',
                                xtype: 'combo',
                                queryMode: "remote",
                                triggerAction: 'all',
                                forceSelection: true,
                                editable: false,
                                displayField: "name",
                                valueField: 'id',
                                blankText: '请选择',
                                store: 'BrandList'
                            },
                            {
                                name: 'prodNo',
                                fieldLabel: '产品编号',
                                maxLength: 32
                            },
                            {
                                name: 'prodCode',
                                fieldLabel: '产品条形码',
                                maxLength: 32
                            },
                            { name: 'cid',
                                xtype: 'combo',
                                queryMode: "remote",
                                triggerAction: 'all',
                                forceSelection: true,
                                editable: false,
                                displayField: "name",
                                fieldLabel: '产品类型',
                                value: 'name',
                                valueField: 'id',
                                blankText: '请选择',
                                store: 'BrandCategoryList'
                            },
                            {
                                name: 'description',
                                fieldLabel: '产品描述',
                                xtype: 'textareafield',
                                maxLength: 512,
                                height: 50
                            },
                            {
                                name: 'shopPriceStr',
                                id: "shopPriceStr",
                                xtype: 'numberfield',
                                editable: true,
                                fieldLabel: '销售价(元)',
                                minValue: 0,
                                negativeText: '不得输入负数'
                            },
                            {
                                name: 'standardPriceStr',
                                id: "standardPrice",
                                xtype: 'numberfield',
                                editable: true,
                                fieldLabel: '市场价(元)',
                                minValue: 0,
                                negativeText: '不得输入负数'
                            },
                            {
                                name: 'buyPriceStr',
                                id: "buyPrice",
                                xtype: 'numberfield',
                                editable: true,
                                fieldLabel: '进货价(元)',
                                minValue: 0,
                                negativeText: '不得输入负数'
                            },
                            {
                                name: 'color',
                                fieldLabel: '颜色',
                                maxLength: 5,
                                regex: /[\u4e00-\u9fa5]+/,
                                regexText: '颜色必须是中文'
                            },
                            {
                                name: 'weight',
                                fieldLabel: '重量(kg)',
                                maxLength: 20
                            },
                            {
                                name: 'boxSize',
                                fieldLabel: '尺寸(厘米)',
                                maxLength: 20
                            },
                            {
                                name: 'speci',
                                fieldLabel: '规格'
                            },
                            {
                                name: 'repoId',
                                xtype: 'combo',
                                queryMode: "remote",
                                triggerAction: 'all',
                                forceSelection: true,
                                editable: false,
                                displayField: "name",
                                fieldLabel: '产品仓库',
                                value: 'name',
                                valueField: 'id',
                                blankText: '请选择',
                                store: 'WarehouseList'
                            },
                            {
                                name: 'actuallyNumber',
                                id: "actuallyNumber",
                                xtype: 'numberfield',
                                editable: true,
                                fieldLabel: '库存数量(件)',
                                allowDecimals:false,
                                minValue: 0,
                                negativeText: '不得输入负数',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            }
                        ]

                    });


                    var addProductWin = Ext.create("Ext.window.Window", {
                        title: '添加产品',
                        width: 440,
                        height: 600,
                        modal: true,
                        autoHeight: true,
                        layout: 'fit',
                        buttonAlign: 'right',
                        bodyStyle: 'padding:5px;',
                        items: addProductForm,
                        buttons: [
                            {
                                text: "保存",
                                handler: function () {
                                    var form = addProductForm.getForm();
                                    var data = form.getValues();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: "/product/add",
                                            params: data,
                                            success: function (response, options) {
                                                var data = Ext.JSON.decode(options.response.responseText);
                                                if (data.success) {
                                                    addProductWin.close();
                                                    Espide.Common.tipMsg('保存成功', data.msg);
                                                    Ext.getCmp('productListGrid').getStore().load();
                                                }
                                            },
                                            failure: function (response, options) {

                                                var data = Ext.JSON.decode(options.response.responseText);

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
                    addProductWin.show();
                }
            },
            "#productListGrid": {
                'itemdblclick': function (view, record, item, index, event) {//单元格绑定双击事件
                    var updateGoodsForm = Ext.create('Ext.form.Panel', {
                        region: 'center',
                        id: 'updateGoodsForm',
                        height: 'auto',
                        bodyPadding: 10,
                        layout: 'anchor',
                        border: 0,
                        defaults: {
                            xtype: 'textfield',
                            margin: '0 0 5 0',
                            labelWidth: 100,
                            labelAlign: 'right',
                            width: 350,
                            queryMode: 'local',
                            triggerAction: 'all',
                            forceSelection: true,
                            allowBlank: false,
                            editable: false,
                            minValue: 1
                        },
                        items: [
                            { name: 'picUrl', fieldLabel: '产品图片', hidden: true, value: "无"},
                            { name: 'id', hidden: true, value: record.get("id")},
                            { name: 'prodName', fieldLabel: '产品名称', value: record.get("prodName")},
                            {   name: 'brandId',
                                id: "brandId",
                                fieldLabel: '产品品牌',
                                xtype: 'combo',
                                queryMode: "remote",
                                triggerAction: 'all',
                                forceSelection: true,
                                editable: false,
                                displayField: "name",
                                valueField: 'id',
                                blankText: '请选择',
                                store: 'BrandList'
                            },
                            { name: 'prodNo', fieldLabel: '产品编号', value: record.get("prodNo"), readOnly: true},
                            { name: 'prodCode', fieldLabel: '产品条形码', value: record.get("prodCode"), readOnly: true },
                            { name: 'cid',
                                id: "cid",
                                xtype: 'combo',
                                queryMode: "remote",
                                triggerAction: 'all',
                                forceSelection: true,
                                editable: false,
                                displayField: "name",
                                fieldLabel: '产品类型',
                                value: 'name',
                                valueField: 'id',
                                blankText: '请选择',
                                store: 'BrandCategoryList'
                            },
                            { name: 'description', fieldLabel: '产品描述', xtype: 'textareafield', height: 50, value: record.get("description")},
                            {
                                name: 'shopPriceStr',
                                fieldLabel: '销售价(元)',
                                xtype: 'numberfield',
                                editable: true,
                                value: record.get("shopPriceStr"),
                                minValue: 0,
                                negativeText: '不得输入负数'
                            },
                            {
                                name: 'standardPriceStr',
                                fieldLabel: '市场价(元)',
                                xtype: 'numberfield',
                                editable: true,
                                value: record.get("standardPriceStr"),
                                minValue: 0,
                                negativeText: '不得输入负数'
                            },
                            {
                                name: 'buyPriceStr',
                                fieldLabel: '进货价(元)',
                                xtype: 'numberfield',
                                editable: true,
                                value: record.get("buyPriceStr"),
                                minValue: 0,
                                negativeText: '不得输入负数'
                            },
                            { name: 'color', fieldLabel: '颜色', value: record.get("color")},
                            { name: 'weight', fieldLabel: '重量(公斤)', value: record.get("weight")},
                            { name: 'boxSize', fieldLabel: '尺寸(厘米)', value: record.get("boxSize")},
                            { name: 'speci', fieldLabel: '规格', value: record.get("speci")},
                            { name: 'repoId',
                                xtype: 'combo',
                                'id': "repoId",
                                queryMode: "remote",
                                triggerAction: 'all',
                                forceSelection: true,
                                editable: false,
                                displayField: "name",
                                fieldLabel: '产品仓库',
                                value: 'name',
                                valueField: 'id',
                                blankText: '请选择',
                                store: 'WarehouseList'
                            },
                            {
                                name: 'actuallyNumber',
                                id: "actuallyNumber",
                                xtype: 'numberfield',
                                editable: true,
                                fieldLabel: '库存数量(件)',
                                value: record.get("storage").actuallyNumber,
                                allowDecimals:false,
                                minValue: 0,
                                negativeText: '不得输入负数',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            },
                        ]


                    });

                    Ext.getCmp('repoId').setValue(record.get("storage").repoId);
                    Ext.getCmp('brandId').setValue(record.get("brandId"));
                    Ext.getCmp('cid').setValue(record.get("cid"));


                    var updateGoodListWin = Ext.create("Ext.window.Window", {
                        title: '修改产品',
                        width: 440,
                        height: 600,
                        modal: true,
                        autoHeight: true,
                        layout: 'fit',
                        buttonAlign: 'right',
                        bodyStyle: 'padding:5px;',
                        items: updateGoodsForm,
                        buttons: [
                            {
                                text: "保存",
                                handler: function () {
                                    var form = updateGoodsForm.getForm();
                                    var data = form.getValues();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: "/product/update",
                                            params: data,
                                            success: function (response, options) {
                                                var data = Ext.JSON.decode(options.response.responseText);
                                                if (data.success) {//修改成功
                                                    updateGoodListWin.close();
                                                    Espide.Common.tipMsg('修改成功', data.msg);
                                                    Ext.getCmp('productListGrid').getStore().load();
                                                }
                                            },
                                            failure: function (response, options) {

                                                var data = Ext.JSON.decode(options.response.responseText);
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
                    updateGoodListWin.show();
                }
            },
            '#del': {
                'click': function (button) {

                    var url = '/product/delete',
                        ids = Espide.Common.getGridSels('productListGrid', 'id');

                    if (ids.length < 1) {
                        Espide.Common.showGridSelErr('请先选择要删除的产品');
                        return;
                    }

                    Ext.MessageBox.confirm('提醒', '您确定要删除吗？', function (optional) {
                        Espide.Common.doAction({
                            url: url,
                            params: {
                                idArray: ids.join()
                            },
                            successCall: function () {
                                Ext.getCmp('productListGrid').getStore().loadPage(1);
                            },
                            successTipMsg: '删除成功'
                        })(optional);
                    });
                }
            },
            "#refresh": {
                'click': function (button) {
                    Ext.getCmp('productListGrid').getStore().load();
                }
            },
            "#include": {
                'click': function (button) {
                    var uploadForm = Ext.create("Ext.form.Panel", {
                        baseCls: 'x-plain',
                        labelWidth: 80,
                        defaults: {
                            width: 380
                        },
                        id: 'uploadForm',
                        border: false,
                        layout: {
                            type: 'vbox',
                            align: 'center'
                        },
                        header: false,
                        frame: false,
                        bodyPadding: '20',
                        items: [

                            {
                                xtype: 'container',
                                layout: {
                                    type: 'hbox',
                                    pack: 'center'
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        cls: 'contactBtn',
                                        margin: "20 20 30 20",
                                        text: '下载Excel模板',
                                        listeners: {
                                            'click': function () {
                                                location.href = "/static/templet/excelmode.xls";
                                            }
                                        }
                                    }
                                ]},
                            {
                                xtype: "filefield",
                                name: "multipartFile",
                                fieldLabel: "导入产品Excel",
                                anchor: "100%",
                                id: "multipartFile",
                                allowBlank: false,
                                blankText: 'Excel文件不能为空',
                                buttonText: "选择导入文件",
                                msgTarget: 'under',
                                validator: function (value) {
                                    var arr = value.split(".");
                                    if (arr[arr.length - 1] != "xls") {
                                        return "文件不合法";
                                    } else {
                                        return true;
                                    }
                                }

                            }
                        ]


                    });


                    var includeWin = Ext.create("Ext.window.Window", {
                        title: '导入产品',
                        width: 500,
                        height: 300,
                        modal: true,
                        autoHeight: true,
                        layout: 'fit',
                        buttonAlign: 'center',
                        bodyStyle: 'padding:5px;',
                        items: uploadForm,
                        buttons: [
                            {
                                text: "确认导入产品",
                                handler: function () {
                                    var form = uploadForm.getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: "/product/leadingIn",
                                            waitMsg: "正在导入验证数据",
                                            success: function (fp, o) {
                                                var data = Ext.JSON.decode(o.response.responseText);
                                                if (data.data.status == "success") {
                                                    Ext.MessageBox.show({
                                                        title: '提示',
                                                        msg: data.msg,
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: 'x-message-box-info',
                                                        fn: function () {
                                                            //关闭上传窗口
                                                            includeWin.close();
                                                        }
                                                    });

                                                    //刷新产品表
                                                    Ext.getCmp('productListGrid').getStore().load();
                                                }
                                            },
                                            failure: function (fp, o) {

                                                var data = Ext.JSON.decode(o.response.responseText);
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

                    includeWin.show();
                }
            }
        });
    }



});