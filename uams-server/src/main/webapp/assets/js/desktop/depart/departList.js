/**
 * 部门列表
 * Created by Lein.xu
 */
//定义部门 数据模型
Ext.define('EBDesktop.departListModel', {
    extend: 'Ext.data.Model',
    fields: [
        "id",
        'name',
        'code',
        {name: 'createTime', type: 'date', dateFormat: 'time'},
        {name: 'updateTime', type: 'date', dateFormat: 'time'}
    ],
    idProperty: "id"
});

//定义部门类
Ext.define('EBDesktop.depart.departList', {
    extend: 'Ext.container.Container',
    alias: 'widget.departList',
    id: 'departList',
    title: "部门管理",
    fixed: true,
    layout: 'border',
    initComponent: function () {

        // 部门数据集
//        var departListStore = Ext.create('Ext.data.TreeStore', {
//           // model: 'EBDesktop.departListModel',
//            proxy: {
//                type: 'ajax',
////                url:'departments/',
//                url:'assets/js/desktop/depart/test.json',
//                reader:{
//                    type: 'json',
//                    root: 'data'
//                }
////                api: {
////                    read: 'departments/'
////                },
////                reader: {
////                    type: 'json',
////                    successProperty: 'success',
////                    root: 'data.obj.result',
////                    messageProperty: 'message',
////                    totalProperty: 'data.obj.totalCount'
////                }
//            }
////            root: {
////                expanded:true,
////                text: "My Root"
////            },
////            folderSort: true
//        });

        var departListStore = Ext.create('Ext.data.TreeStore', {
            model: 'EBDesktop.departListModel',
            proxy: {
                type: 'ajax',
                url: 'departments/',
                extractResponseData: function (response) {
                    var json = Ext.JSON.decode(response.responseText).data.list;
                    return json;
                    console.log(json);
                }
            },
            root: {
                name: '全部部门',
                id: "0"
            }
        });


        //获取组件
        function getGridSelected(id) {
            return Ext.getCmp(id).getSelectionModel().getSelection();
        }

        //获取属性
        function getJsonAttr(obj, attr) {
            var arr = [];
            Ext.each(obj, function (sel) {
                sel && arr.push(sel.get(attr));
            });
            return arr;
        }

        // 移除部门
        function removedepartList() {

            //var url = '/departs',
            var ids = Espide.Common.getGridSels('departGrid', 'id');

            if (ids.length < 1) {
                Espide.Common.showGridSelErr('请先选择要删除的部门');
                return;
            }

            Ext.MessageBox.confirm('提醒', '您确定要删除吗？', function (optional) {
                Espide.Common.doAction({
                    url: 'departs/' + ids.join(),
                    method: 'post',
                    params: {
                        ids: ids.join(),
                        _method: 'delete'

                    },
                    successCall: function () {
                        Ext.getCmp('departGrid').getStore().loadPage(1);
                    },
                    successTipMsg: '删除成功'
                })(optional);
            });
        }

        // 刷新departGrid
        function refreshdepartGrid() {
            Ext.getCmp('departGrid').getStore().load();
        }


        //添加部门
        function departAdd() {
            var permissionList;
            var permissionCheckGroup = {};

            //创建表单
            var formItems = [];
            formItems.push({
                xtype: 'hidden',
                name: '_method',
                value: 'post'
            });

            formItems.push({
                    fieldLabel: '部门名称',
                    name: 'name',
                    allowBlank: false,
                    blankText: '部门名称不能为空',
                    regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                    regexText: '首尾不得包含空格'
                }
            );


            //部门添加表格
            var departAddForm = Ext.create('Ext.form.Panel', {
                id: 'departAddForm',
                autoScroll: true,
                forceFit: true,
                border: false,
                layout: 'form',
                header: false,
                frame: false,
                width: 500,
                bodyPadding: '5 5 0',
                requires: ['Ext.form.field.Text'],
                fieldDefaults: {
                    msgTarget: 'qtip',
                    labelWidth: 75
                },
                defaultType: 'textfield',
                items: formItems
            });

            //部门添加窗口
            var departUpdateWin = Ext.create("Ext.window.Window", {
                title: "添加部门",
                width: 530,
                height: 150,
                items: departAddForm,
                buttonAlign: "right",
                modal: true,
                autoScroll: true,
                buttons: [
                    {
                        text: '保存',
                        itemId: 'addBtn',
                        handler: function () {
                            if (departAddForm.isValid()) {
                                var ids = departAddForm.getForm().getValues();
                                if (departAddForm.getForm().isValid()) {
                                    departAddForm.getForm().submit({
                                        clientValidation: true, //对客户端进行验证
                                        method: 'POST',
                                        url: "/departs",
                                        waitMsg: "保存成功...",
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            if (data.success) {
                                                Espide.Common.tipMsg('保存成功', data.msg);
                                                departUpdateWin.close();
                                                refreshdepartGrid();
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

                                        },
                                        timeout: 5
                                    });
                                }

                            }

                        }
                    }
                ]
            });

            departUpdateWin.show();


        }

        //用户查询
        function searchdepart(button) {
            //Espide.Common.doSearch("departGrid", "searchdepart", true);
            var data = Ext.getCmp('searchdepart').getValues();
            console.log(data['name']);
            var node = departGrid.get;
            console.log(node);
        }




        //顶栏表单
        var searchForm = Ext.create('Ext.form.Panel', {
            region: 'north',
            layout: 'hbox',
            border: 0,
            bodyStyle: {
                padding: '6px 0 6px 8px'
            },
            id: 'searchdepart',
            defaults: {
                xtype: 'combo',
                labelWidth: 60,
                margin: '0 10 0 0'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: '部门名称',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                searchdepart();
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '查询',
                    itemId: 'searchBtn',
                    handler: searchdepart
                }
            ]
        });


        //部门列表
        var departGrid = Ext.create("Ext.tree.Panel", {
                region: 'center',
                id: 'departGrid',
                //rootVisible: false,
                store: departListStore,
                useArrows: true,
                columns: [
                    {
                        xtype: 'treecolumn',
                        text: '部门名称',
                        flex: 2,
                        dataIndex: 'name'
                    },
                    {
                        header: '部门编号',
                        width: 80,
                        dataIndex: 'code'
                    }
                ],

                listeners: {//表格单元添加双击事件
                    "itemcontextmenu": function (view, record, item, index, e, eOpts) {
                        //禁用浏览器的右键相应事件
                        e.preventDefault();
                        e.stopEvent();
                        var myContextMenu = new Ext.menu.Menu({
                            shadow: 'frame',
                            float: true,
                            items: [
                                {
                                    iconCls: "button-add",
                                    text: "添加",
                                    scope: this,
                                    handler: function () {
                                        myContextMenu.hide();
//                                        if(record.get('id')==0){
//                                            return;
//                                        }


//                                        Ext.MessageBox.prompt("添加部门", "名称：", function (button, text) {
//                                            if (button == "ok") {
//                                                if (Ext.util.Format.trim(text) != "") {
//                                                    console.log(record.parentNode);
//                                                    addCategory(item, text);
//                                                }
//                                            }
//                                        });

                                        //表单
                                        //创建表单
                                        var formItems = [];
                                        formItems.push({
                                            xtype: 'hidden',
                                            name: '_method',
                                            value: 'post'
                                        });

                                        formItems.push({
                                                fieldLabel: '部门名称',
                                                name: 'name',
                                                allowBlank: false,
                                                blankText: '部门名称不能为空',
                                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                                regexText: '首尾不得包含空格'
                                            }
                                        );
                                        formItems.push({
                                                fieldLabel: '部门编号',
                                                name: 'code',
                                                allowBlank: false,
                                                blankText: '部门编号不能为空',
                                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                                regexText: '首尾不得包含空格'
                                            }
                                        );

                                        //创建部门更新表格
                                        var departAddForm = Ext.create('Ext.form.Panel', {
                                            id: 'departAddForm',
                                            autoScroll: true,
                                            forceFit: true,
                                            border: false,
                                            layout: 'form',
                                            header: false,
                                            frame: false,
                                            width: 500,
                                            bodyPadding: '5 5 0',
                                            requires: ['Ext.form.field.Text'],
                                            fieldDefaults: {
                                                msgTarget: 'side',
                                                labelWidth: 75
                                            },
                                            defaultType: 'textfield',
                                            items: formItems
                                        });

                                        var departUpdateWin = Ext.create("Ext.window.Window", {
                                            title: "添加部门",
                                            width: 530,
                                            height: 150,
                                            items: departAddForm,
                                            buttonAlign: "right",
                                            modal: true,
                                            autoScroll: true,
                                            buttons: [
                                                {
                                                    text: '保存',
                                                    itemId: 'addBtn',
                                                    handler: function () {
                                                        var ids = departAddForm.getForm().getValues();
                                                        //console.log(record.parentNode.getId());
                                                        departAddForm.getForm().submit({
                                                            method: 'post',
                                                            clientValidation: true, //对客户端进行验证
                                                            url: "departments/",
                                                            params: {
                                                                _method: 'post',
                                                                name: ids["name"],
                                                                code: ids["code"],
                                                                parentId: record.get('id'),

                                                            },
                                                            success: function (form, action) {
                                                                var data = Ext.JSON.decode(action.response.responseText);
                                                                if (data.success) {
                                                                    console.log(data);
                                                                    Espide.Common.tipMsg('保存成功', data.msg);
                                                                    departUpdateWin.close();
                                                                    record.appendChild({
                                                                        name: data.data.obj.name,
                                                                        code:ids["code"],
                                                                        id: data.data.obj.id,
                                                                        draggable: false,
                                                                        leaf:true,
                                                                        expanded : true
                                                                    });
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
                                            ]
                                        });

                                        departUpdateWin.show();


                                    }
                                },
                                {
                                    iconCls: "button-edit",
                                    text: "编辑",
                                    handler: function () {
                                        myContextMenu.hide();
//创建表单
                                        var formItems = [];
                                        formItems.push({
                                            xtype: 'hidden',
                                            name: '_method',
                                            value: 'put'
                                        });

                                        formItems.push({
                                                fieldLabel: '部门名称',
                                                name: 'name',
                                                value: record.get('name'),
                                                allowBlank: false,
                                                blankText: '部门名称不能为空',
                                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                                regexText: '首尾不得包含空格'
                                            }
                                        );
                                        formItems.push({
                                                fieldLabel: '部门编号',
                                                name: 'code',
                                                value: record.get('code'),
                                                allowBlank: false,
                                                blankText: '部门编号不能为空',
                                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                                regexText: '首尾不得包含空格'
                                            }
                                        );

                                        //创建部门更新表格
                                        var departUpdateForm = Ext.create('Ext.form.Panel', {
                                            id: 'departUpdateForm',
                                            autoScroll: true,
                                            forceFit: true,
                                            border: false,
                                            layout: 'form',
                                            header: false,
                                            frame: false,
                                            width: 500,
                                            bodyPadding: '5 5 0',
                                            requires: ['Ext.form.field.Text'],
                                            fieldDefaults: {
                                                msgTarget: 'side',
                                                labelWidth: 75
                                            },
                                            defaultType: 'textfield',
                                            items: formItems
                                        });

                                        var departUpdateWin = Ext.create("Ext.window.Window", {
                                            title: "修改部门",
                                            width: 530,
                                            height: 150,
                                            items: departUpdateForm,
                                            buttonAlign: "right",
                                            modal: true,
                                            autoScroll: true,
                                            buttons: [
                                                {
                                                    text: '保存',
                                                    itemId: 'addBtn',
                                                    handler: function () {
                                                        var ids = departUpdateForm.getForm().getValues();
                                                        //console.log(record.parentNode.getId());
                                                        departUpdateForm.getForm().submit({
                                                            method: 'post',
                                                            clientValidation: true, //对客户端进行验证
                                                            url: "departments/" + record.get('id'),
                                                            params: {
                                                                _method: 'put',
                                                                name: ids["name"],
                                                                code: ids["code"]

                                                            },
                                                            success: function (form, action) {
                                                                var data = Ext.JSON.decode(action.response.responseText);
                                                                if (data.success) {
                                                                    Espide.Common.tipMsg('保存成功', data.msg);
                                                                    departUpdateWin.close();
                                                                    record.set('name', ids['name']);
                                                                    record.set('code', ids['code']);
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
                                            ]
                                        });

                                        departUpdateWin.show();
                                    }
                                },
                                {
                                    iconCls: "button-delete",
                                    text: "删除",
                                    handler: function () {
                                        myContextMenu.hide();
                                        if (record.get('id') == 0) {
                                            Ext.MessageBox.show({
                                                title: '提示',
                                                msg: '根目录不难删除',
                                                buttons: Ext.MessageBox.OK,
                                                icon: 'x-message-box-warning'
                                            });

                                            return;
                                        }
                                        Ext.MessageBox.confirm("确认删除", "是否要删除指定内容？", function (button, text) {
                                            if (button == "yes") {
                                                Ext.Ajax.request({
                                                    url: "departments/" + record.get('id'), //请求的地址
                                                    method: "post",
                                                    params: {
                                                        _method: 'delete',
                                                        departmentId: record.get('id')
                                                    }, //发送的参数
                                                    success: function (response, option) {
                                                        data = Ext.JSON.decode(response.responseText);
                                                        if (data.success) {
                                                            Espide.Common.tipMsg('删除成功', data.msg);

                                                            var pNode = record.parentNode;
                                                            record.remove();
                                                        }

                                                    },
                                                    failure: function (response, option) {
                                                        data = Ext.JSON.decode(response.responseText);
                                                        Ext.MessageBox.show({
                                                            title: '提示',
                                                            msg: data.msg,
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: 'x-message-box-warning'
                                                        });
                                                    }
                                                });
                                            }
                                        });

                                    }
                                }
                            ]
                        });
//
//                        if (node.parentNode == null) {    /* 主根目录没有编辑和删除的功能 */
//                            myContextMenu.items.get(1).setDisabled(true);
//                            myContextMenu.items.get(2).setDisabled(true);
//                        } else {
//                            if (!node.isLeaf()) {
//                                myContextMenu.items.itemAt(2).setDisabled(true);
//                                /* 如果有子目录没有删除功能，根据需求而定（也可以设置删除功能） */
//                            } else {
//                                //myContextMenu.items.itemAt(0).setDisabled(true);
//                            }
//
//                            myContextMenu.items.itemAt(1).setDisabled(false);
//
//                        }
//
//                        node.select(); //结点进入选择状态
                        myContextMenu.showAt(e.getXY());
                    }





//                        var permissionList;
//                        var permissionCheckGroup = {};
//
//                        var formItems = [];
//                        formItems.push({
//                            xtype: 'hidden',
//                            name: '_method',
//                            value: 'put'
//                        });
//                        formItems.push({
//                                fieldLabel: '部门名称',
//                                name: 'name',
//                                value: record.get('name'),
//                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
//                                regexText: '首尾不得包含空格'
//                            }
//                        );
//
//                        formItems.push({
//                            xtype: 'hidden',
//                            name: 'departId',
//                            value: record.get('id')
//                        });
//
//
//                        //创建部门更新表格
//                        var departUpdateForm = Ext.create('Ext.form.Panel', {
//                            id: 'departUpdateForm',
//                            autoScroll: true,
//                            forceFit: true,
//                            border: false,
//                            layout: 'form',
//                            header: false,
//                            frame: false,
//                            width: 500,
//                            bodyPadding: '5 5 0',
//                            requires: ['Ext.form.field.Text'],
//                            fieldDefaults: {
//                                msgTarget: 'side',
//                                labelWidth: 75
//                            },
//                            defaultType: 'textfield',
//                            items: formItems
//                        });
//
//                        //部门修改窗口
//                        var departUpdateWin = Ext.create("Ext.window.Window", {
//                            title: "部门修改",
//                            width: 530,
//                            height: 150,
//                            items: departUpdateForm,
//                            buttonAlign: "right",
//                            modal: true,
//                            autoScroll: true,
//                            buttons: [
//                                {
//                                    text: '保存',
//                                    itemId: 'addBtn',
//                                    handler: function () {
//                                        var ids = departUpdateForm.getForm().getValues();
//                                        departUpdateForm.getForm().submit({
//                                            method: 'post',
//                                            clientValidation: true, //对客户端进行验证
//                                            url: "departs/" + record.get('id'),
//                                            success: function (form, action) {
//                                                var data = Ext.JSON.decode(action.response.responseText);
//                                                if (data.success) {
//
//                                                    Espide.Common.tipMsg('保存成功', data.msg);
//                                                    departUpdateWin.close();
//                                                    refreshdepartGrid();
//
//                                                }
//
//                                            },
//                                            failure: function (form, action) {
//
//                                                var data = Ext.JSON.decode(action.response.responseText);
//                                                Ext.MessageBox.show({
//                                                    title: '提示',
//                                                    msg: data.msg,
//                                                    buttons: Ext.MessageBox.OK,
//                                                    icon: 'x-message-box-warning'
//                                                });
//
//                                            }
//                                        });
//                                    }
//                                }
//                            ]
//                        });
//
//                        departUpdateWin.show();


//                    }
                }
            }
        );

        //this.items = [searchForm, departGrid];
        this.items = [ departGrid];
        this.callParent(arguments);
    }
});
