/**
 * 角色列表
 * Created by Lein.xu
 */
//定义角色 数据模型
Ext.define('EBDesktop.RoleListModel', {
    extend: 'Ext.data.Model',
    fields: ["id", 'name'],
    idProperty: "id"
});

//定义角色类
Ext.define('EBDesktop.role.roleList', {
    extend: 'Ext.container.Container',
    alias: 'widget.roleList',
    id: 'roleList',
    title: "角色管理",
    fixed: true,
    layout: 'border',
    initComponent: function () {

        // 角色数据集
        var roleListStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'EBDesktop.RoleListModel',
            proxy: {
                type: 'rest',
                api: {
                    read: '/roles'
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

        // 移除角色
        function removeRoleList() {

            //var url = '/roles',
               var  ids = Espide.Common.getGridSels('RoleGrid', 'id');

            if (ids.length < 1) {
                Espide.Common.showGridSelErr('请先选择要删除的角色');
                return;
            }

            Ext.MessageBox.confirm('提醒', '您确定要删除吗？', function (optional) {
                Espide.Common.doAction({
                    url: 'roles/'+ids.join(),
                    method:'post',
                    params: {
                        ids: ids.join(),
                        _method:'delete'

                    },
                    successCall: function () {
                        Ext.getCmp('RoleGrid').getStore().loadPage(1);
                    },
                    successTipMsg: '删除成功'
                })(optional);
            });
        }

        // 刷新roleGrid
        function refreshRoleGrid() {
            Ext.getCmp('RoleGrid').getStore().load();
        }


        //添加角色
        function roleAdd() {
            var permissionList;
            var permissionCheckGroup = {};

                        //创建表单
                        var formItems = [];
                        formItems.push({
                            xtype: 'hidden',
                            name: '_method',
                            value:'post'
                        });

                        formItems.push({
                                fieldLabel: '角色名称',
                                name: 'name',
                                allowBlank: false,
                                blankText: '角色名称不能为空',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            }
                        );


                        //角色添加表格
                        var roleAddForm = Ext.create('Ext.form.Panel', {
                            id: 'roleAddForm',
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

                        //角色添加窗口
                        var roleAddWin = Ext.create("Ext.window.Window", {
                            title: "添加角色",
                            width: 530,
                            height: 150,
                            items: roleAddForm,
                            buttonAlign: "right",
                            modal: true,
                            autoScroll: true,
                            buttons: [
                                {
                                    text: '保存',
                                    itemId: 'addBtn',
                                    handler: function () {
                                        if (roleAddForm.isValid()) {
                                            var ids = roleAddForm.getForm().getValues();
                                            if (roleAddForm.getForm().isValid()) {
                                                roleAddForm.getForm().submit({
                                                    clientValidation: true, //对客户端进行验证
                                                    method:'POST',
                                                    url: "/roles",
                                                    waitMsg: "保存成功...",
                                                    success: function (form, action) {
                                                        var data = Ext.JSON.decode(action.response.responseText);
                                                        if (data.success) {
                                                            Espide.Common.tipMsg('保存成功', data.msg);
                                                            roleAddWin.close();
                                                            refreshRoleGrid();
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

                        roleAddWin.show();



        }

        //用户查询
        function searchRole(button) {
            Espide.Common.doSearch("RoleGrid", "searchRole", true);
        }

        //顶栏表单
        var searchForm = Ext.create('Ext.form.Panel', {
            region: 'north',
            layout: 'hbox',
            border: 0,
            bodyStyle: {
                padding: '6px 0 6px 8px'
            },
            id: 'searchRole',
            defaults: {
                xtype: 'combo',
                labelWidth: 60,
                margin: '0 10 0 0'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: '角色名称',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                searchRole();
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '查询',
                    itemId: 'searchBtn',
                    handler: searchRole
                },
                {
                    xtype: 'button',
                    text: '添加',
                    itemId: 'addBtn',
                    handler: roleAdd
                },
                {
                    xtype: 'button',
                    text: '删除已选',
                    itemId: 'deleteBtn',
                    handler: removeRoleList
                }
            ]
        });

        //角色列表
        var roleGrid = Ext.create("Ext.grid.Panel", {
                region: 'center',
                id: 'RoleGrid',
                loadMask: true,
                forceFit: true,
                store: roleListStore,
                disableSelection: false,
                selType: 'checkboxmodel',
                columns: [
                    {
                        header: '角色名称',
                        dataIndex: 'name'
                    }
                ],
                bbar: new Ext.PagingToolbar({
                    store: roleListStore,
                    displayMsg: "显示第 {0} 条到 {1} 条记录，一共 {2} 条记录",
                    displayInfo: true,
                    emptyMsg: '没有记录'
                }),
                listeners: {//表格单元添加双击事件
                    'itemdblclick': function (view, record, item, index, e) {
                        var permissionList;
                        var permissionCheckGroup = {};

                                var formItems = [];
                                formItems.push({
                                    xtype: 'hidden',
                                    name: '_method',
                                    value:'put'
                                });
                                formItems.push({
                                        fieldLabel: '角色名称',
                                        name: 'name',
                                        value: record.get('name'),
                                        regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                        regexText: '首尾不得包含空格'
                                    }
                                );

                                formItems.push({
                                    xtype: 'hidden',
                                    name: 'roleId',
                                    value: record.get('id')
                                });



                                //创建角色更新表格
                                var roleUpdateForm = Ext.create('Ext.form.Panel', {
                                    id: 'roleUpdateForm',
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

                                //角色修改窗口
                                var roleUpdateWin = Ext.create("Ext.window.Window", {
                                    title: "角色修改",
                                    width: 530,
                                    height: 150,
                                    items: roleUpdateForm,
                                    buttonAlign: "right",
                                    modal: true,
                                    autoScroll: true,
                                    buttons: [
                                        {
                                            text: '保存',
                                            itemId: 'addBtn',
                                            handler: function () {
                                                var ids = roleUpdateForm.getForm().getValues();
                                                roleUpdateForm.getForm().submit({
                                                    method:'post',
                                                    clientValidation: true, //对客户端进行验证
                                                    url: "roles/"+record.get('id'),
                                                    success: function (form, action) {
                                                        var data = Ext.JSON.decode(action.response.responseText);
                                                        if (data.success) {

                                                            Espide.Common.tipMsg('保存成功', data.msg);
                                                            roleUpdateWin.close();
                                                            refreshRoleGrid();

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

                                roleUpdateWin.show();


                    }
                }
            }
        );

        this.items = [searchForm, roleGrid];
        this.callParent(arguments);
    }
});
