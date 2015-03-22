/**
 * 用户列表
 * Created by Lein.xu
 */

//定义用户列表数据模型
Ext.define('EBDesktop.clientListModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'uniqueNo',
        'fileMd5',
        {name: 'fileUpdateTime', type: 'date', dateFormat: 'time'},
        {name: 'createTime', type: 'date', dateFormat: 'time'},
        {name: 'updateTime', type: 'date', dateFormat: 'time'}
    ],
    idProperty: 'id'
});


//定义角色 数据模型
Ext.define('EBDesktop.RoleListModel', {
    extend: 'Ext.data.Model',
    fields: ["id", 'name', 'stubId'],
    idProperty: "id"
});


//定义模块数据模型
Ext.define('EBDesktop.ModuleListModel', {
    extend: 'Ext.data.Model',
    fields: ["id", 'name', 'url', 'resourceName'],
    idProperty: "id"
});

//定义用户列表类
Ext.define('EBDesktop.client.clientList', {
    extend: 'Ext.container.Container',
    alias: 'widget.clientList',
    id: 'clientList',
    title: "用户管理",
    layout: "border",
    fixed: true,
    initComponent: function () {
        // 用户数据源
        var clientListStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'EBDesktop.clientListModel',
            proxy: {
                type: 'rest',
                api: {
                    read: "stubs/"
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
            autoLoad: {start: 0, limit: 10},
            pageSize: 10
        });


        //角色数据集
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


        // 模块数据集
        var clientModuleStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'EBDesktop.ModuleListModel',
            groupField: 'resourceName',
            proxy: {
                type: 'ajax',
                api: {
                    read: 'operation/'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'data.list',
                    messageProperty: 'message'
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
            autoLoad: true
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

        // 移除用户
        function removeclientList() {

            var ids = Espide.Common.getGridSels('clientGrid', 'id');

            if (ids.length < 1) {
                Espide.Common.showGridSelErr('请先选择要删除的用户');
                return;
            }

            Ext.MessageBox.confirm('提醒', '您确定要删除吗？', function (optional) {
                Espide.Common.doAction({
                    url: 'stubs/' + ids.join(),
                    params: {
                        ids: ids.join(),
                        _method: 'delete'
                    },
                    successCall: function () {
                        Ext.getCmp('clientGrid').getStore().loadPage(1);
                    },
                    successTipMsg: '删除成功'
                })(optional);
            });

        }


        //添加角色
        function roleAdd() {
            var permissionList;
            var permissionCheckGroup = {};
            //发送ajax请求 获取动态权限模块
            Ext.Ajax.request({
                url: "/resources",

                success: function (response, options) {
                    var data = Ext.JSON.decode(response.responseText);
                    //假如请求成功
                    if (data.success) {
                        permissionList = Ext.JSON.decode(response.responseText).data.list;
                        Ext.each(permissionList, function (permission) {

                            if (!permissionCheckGroup[permission.name]) {
                                permissionCheckGroup[permission.name] = [];
                            }
                            Ext.each(permission.operationList, function (operationList) {

                                if (operationList.configable) {
                                    permissionCheckGroup[permission.name].push({
                                        boxLabel: operationList.name,
                                        name: 'permissionId',
                                        inputValue: operationList.id,
                                        checked: false,
                                        id: "check" + operationList.id,
                                        listeners: {
                                            change: function (obj) {
                                                Ext.Ajax.request({
                                                    method: 'post',
                                                    url: "operation/" + operationList.id,
                                                    params: {
                                                        id: operationList.id,
                                                        status: obj.checked
                                                    },
                                                    success: function (response, options) {
                                                        var data = Ext.JSON.decode(response.responseText);
                                                        if (data.success) {
                                                            var arr = Ext.JSON.decode(response.responseText).data.list;
                                                            if (arr.length == 0) { //当返回是空数组时 不执行以下操作
                                                                return;
                                                            } else {
                                                                if (obj.checked == true) {
                                                                    for (var i = 0; i < arr.length; i++) {
                                                                        Ext.getCmp("check" + arr[i]).setValue('true');
                                                                    }
                                                                }
                                                                else {
                                                                    for (var i = 0; i < arr.length; i++) {
                                                                        Ext.getCmp("check" + arr[i]).setValue('false');
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }

                                                });
                                            }
                                        }
                                    });

                                } else {
                                    permissionCheckGroup[permission.name].push({
                                        boxLabel: operationList.name,
                                        name: 'permissionId',
                                        inputValue: operationList.id,
                                        checked: false,
                                        id: "check" + operationList.id,
                                        hidden: true,
                                        listeners: {
                                            change: function (obj) {
                                                Ext.Ajax.request({
                                                    url: "/role/permission/link",
                                                    params: {
                                                        id: operationList.id,
                                                        status: obj.checked
                                                    },
                                                    success: function (response, options) {
                                                        var data = Ext.JSON.decode(response.responseText);
                                                        if (data.success) {
                                                            var arr = Ext.JSON.decode(response.responseText).data.list;
                                                            if (arr.length == 0) { //当返回是空数组时 不执行以下操作
                                                                return;
                                                            } else {
                                                                if (obj.checked == true) {
                                                                    for (var i = 0; i < arr.length; i++) {
                                                                        Ext.getCmp("check" + arr[i]).setValue('true');
                                                                    }
                                                                } else {
                                                                    for (var i = 0; i < arr.length; i++) {
                                                                        Ext.getCmp("check" + arr[i]).setValue('false');
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }

                                                });
                                            }
                                        }
                                    });
                                }
                            });


                        });
                        //创建表单
                        var formItems = [];
                        formItems.push({
                            xtype: 'hidden',
                            name: '_method',
                            value: 'post'
                        });

                        formItems.push({
                                fieldLabel: '角色名称',
                                name: 'roleName',
                                allowBlank: false,
                                blankText: '角色名称不能为空',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            }
                        );

                        if (permissionList.length > 0) {
                            for (var p in permissionCheckGroup) {
                                formItems.push({
                                    xtype: 'fieldset',
                                    title: p,
                                    collapsible: true,
                                    collapsed: false,
                                    autoHeight: true,
                                    items: {
                                        xtype: 'checkboxgroup',
                                        columns: 3,
                                        items: permissionCheckGroup[p]
                                    }
                                });
                            }
                        }
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
                            height: 400,
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
                                                    method: 'POST',
                                                    url: "/roles",
                                                    params: {
                                                        name: ids["roleName"],
                                                        permissionIds: Array.isArray(ids["permissionId"]) ? ids["permissionId"].join(",") : ids["permissionId"] },
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
                                },
                                {
                                    text: '重写',
                                    itemId: 'resetBtn',
                                    handler: function () {
                                        roleAddWin.getForm().reset();
                                    }
                                }
                            ]
                        });

                        roleAddWin.show();

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


        //添加用户
        function clientAdd() {

            //添加用户表单项
            var formItems = [];

            formItems.push({
                xtype: 'hidden',
                name: '_method',
                value: 'post'
            });
            formItems.push({
                    fieldLabel: '系统名称',
                    name: 'name',
                    regexText: '首尾不得包含空格'
                }
            );
            formItems.push({
                    fieldLabel: '唯一编号',
                    name: 'uniqueNo',
                    regexText: '首尾不得包含空格'
                }
            );


            //创建用户添加表单
            var clientAddForm = Ext.create('Ext.form.Panel', {
                baseCls: 'x-plain',
                labelWidth: 80,
                defaults: {
                    width: 380
                },
                id: 'clientAddForm',
                forceFit: true,
                border: false,
                layout: 'form',
                header: false,
                frame: false,
                bodyPadding: '5 5 0',
                width: 400,
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


            //创建一个弹窗容器
            var clientAddWin = Ext.create("Ext.window.Window", {
                title: '添加客户',
                width: 450,
                height: 180,
                modal: true,
                autoScroll: true,
                plain: true,
                buttonAlign: 'right',
                bodyStyle: 'padding:5px;',
                items: clientAddForm,
                buttons: [
                    {
                        text: '保存',
                        itemId: 'addBtn',
                        handler: function () {
                            var addForm = clientAddForm.getForm();
                            datas = addForm.getValues();

                            if (addForm.isValid()) {//判断表单是否验证
                                addForm.submit({
                                    clientValidation: true, //对客户端进行验证
                                    url: "stubs/",
                                    method: "post",
                                    params: {
                                        uniqueNo: datas["uniqueNo"],
                                        name: datas["name"]
                                    },
                                    success: function (form, action) {

                                        var data = Ext.JSON.decode(action.response.responseText);
                                        if (data.success) {
                                            Espide.Common.tipMsg('保存成功', data.msg);
                                            clientAddWin.close();
                                            Ext.getCmp('clientGrid').getStore().load();
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
                            clientAddForm.getForm().reset();
                        }
                    }
                ]
            });

            //显示弹窗
            clientAddWin.show();
        }





//用户查询
        function searchclient(button) {
            Espide.Common.doSearch("clientGrid", "searchclient", true);
        }

// 刷新clientGrid
        function refreshclientGrid() {
            Ext.getCmp('clientGrid').getStore().load();
        }

//顶栏表单
        var searchForm = Ext.create('Ext.form.Panel', {
            region: 'north',
            layout: 'hbox',
            border: 0,
            bodyStyle: {
                padding: '6px 0 6px 8px'
            },
            id: 'searchclient',
            defaults: {
                xtype: 'combo',
                labelWidth: 60,
                margin: '0 10 0 0'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: '用户名称',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                searchclient();
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '查询',
                    itemId: 'searchBtn',
                    handler: searchclient
                },
                {
                    xtype: 'button',
                    text: '添加',
                    itemId: 'addBtn',
                    handler: clientAdd
                },
                {
                    xtype: 'button',
                    text: '删除已选',
                    itemId: 'deleteBtn',
                    handler: removeclientList
                }
            ]
        });


//创建角色数据表格容器
        var clientGrid = Ext.create("Ext.grid.Panel", {
                region: 'center',
                id: 'clientGrid',
                loadMask: true,
                forceFit: true,
                selType: 'checkboxmodel',
                store: clientListStore,
                columns: [
                    {
                        header: '系统名称',
                        dataIndex: 'name',
                        width: 50
                    },
                    {
                        header: '唯一编号',
                        dataIndex: 'uniqueNo',
                        width: 50
                    },
                    {
                        header: 'Md5文件',
                        dataIndex: 'fileMd5',
                        width: 50
                    },
                    {
                        header: '文件修改时间',
                        dataIndex: 'fileUpdateTime',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
                        width: 80
                    },
                    {
                        header: '创建时间',
                        dataIndex: 'createTime',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
                        width: 80
                    },
                    {
                        header: '修改时间',
                        dataIndex: 'updateTime',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
                        width: 80
                    },
                    {
                        xtype: 'actioncolumn',
                        text: '权限/模块',
                        menuDisabled: true,
                        width: 40,
                        items: [
                            {
                                iconCls: 'icon-add',
                                tooltip: '角色管理',
                                handler: function (btn, rowIndex, colIndex, item, e, record) {
                                    var stubId = record.get('id'),title = record.get('name');


                                    //自定义一个客户列表
                                    Ext.define('ClientRole.grid.Panel', {
                                        extend: 'Ext.grid.Panel',
                                        initComponent: function () {
                                            Ext.apply(this, {
                                                region: 'center',
                                                id: 'clientRoleGrid',
                                                loadMask: true,
                                                forceFit: true,
                                                store: roleListStore,
                                                disableSelection: false,
                                                columns: [//配置表格列
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
                                                        //发送ajax请求
                                                        Ext.Ajax.request({
                                                            method: 'GET',
                                                            url: "roles/" + record.get('id'),
                                                            params: {
                                                                roleId: record.get('id'),
                                                                stubId: stubId
                                                            },
                                                            success: function (response, options) {
                                                                permissionList = Ext.JSON.decode(response.responseText).data.list;
                                                                Ext.each(permissionList, function (permission) {

                                                                    if (!permissionCheckGroup[permission.name]) {
                                                                        permissionCheckGroup[permission.name] = [];
                                                                    }
                                                                    Ext.each(permission.operationList, function (operationList) {
                                                                        if (operationList.configable) {
                                                                            permissionCheckGroup[permission.name].push({boxLabel: operationList.name, name: 'permissionId', inputValue: operationList.id, checked: operationList.op, id: "check" + operationList.id, listeners: {
                                                                                change: function (obj) {
                                                                                    Ext.Ajax.request({
                                                                                        url: "operation/" + operationList.id,
                                                                                        params: {
                                                                                            id: operationList.id,
                                                                                            status: obj.checked,
                                                                                            stubId: stubId
                                                                                        },
                                                                                        success: function (response, options) {
                                                                                            var data = Ext.JSON.decode(response.responseText);
                                                                                            if (data.success) {
                                                                                                var arr = Ext.JSON.decode(response.responseText).data.list;
                                                                                                if (arr.length == 0) { //当返回是空数组时 不执行以下操作
                                                                                                    return;
                                                                                                } else {
                                                                                                    if (obj.checked == true) {
                                                                                                        for (var i = 0; i < arr.length; i++) {
                                                                                                            Ext.getCmp("check" + arr[i]).setValue('true');
                                                                                                        }
                                                                                                    }
                                                                                                    else {
                                                                                                        for (var i = 0; i < arr.length; i++) {
                                                                                                            Ext.getCmp("check" + arr[i]).setValue('false');
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }

                                                                                    });
                                                                                }
                                                                            }});
                                                                        } else {
                                                                            permissionCheckGroup[permission.name].push(
                                                                                {
                                                                                    boxLabel: operationList.name,
                                                                                    name: 'permissionId',
                                                                                    inputValue: operationList.id,
                                                                                    checked: operationList.op,
                                                                                    id: "check" + operationList.id,
                                                                                   // hidden: true,
                                                                                    listeners: {
                                                                                        change: function (obj) {
                                                                                            Ext.Ajax.request({
                                                                                                url: "operation/" + operationList.id,
                                                                                                params: {
                                                                                                    id: operationList.id,
                                                                                                    status: obj.checked,
                                                                                                    stubId: stubId
                                                                                                },
                                                                                                success: function (response, options) {
                                                                                                    var data = Ext.JSON.decode(response.responseText);
                                                                                                    if (data.success) {
                                                                                                        var arr = Ext.JSON.decode(response.responseText).data.list;
                                                                                                        if (arr.length == 0) { //当返回是空数组时 不执行以下操作
                                                                                                            return;
                                                                                                        } else {
                                                                                                            if (obj.checked == true) {
                                                                                                                for (var i = 0; i < arr.length; i++) {
                                                                                                                    Ext.getCmp("check" + arr[i]).setValue('true');
                                                                                                                }
                                                                                                            }
                                                                                                            else {
                                                                                                                for (var i = 0; i < arr.length; i++) {
                                                                                                                    Ext.getCmp("check" + arr[i]).setValue('false');
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }

                                                                                            });
                                                                                        }
                                                                                    }});
                                                                        }


                                                                    });

                                                                });

                                                                var formItems = [];
                                                                formItems.push({
                                                                    xtype: 'hidden',
                                                                    name: '_method',
                                                                    value: 'put'
                                                                });
                                                                formItems.push({
                                                                        fieldLabel: '角色名称',
                                                                        name: 'roleName',
                                                                        value: record.get('name'),
                                                                        disabled: true,
                                                                        regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                                                        regexText: '首尾不得包含空格'
                                                                    }
                                                                );

                                                                formItems.push({
                                                                    xtype: 'hidden',
                                                                    name: 'roleId',
                                                                    value: record.get('id')
                                                                });


                                                                if (permissionList.length > 0) {
                                                                    for (var p in permissionCheckGroup) {

                                                                        formItems.push({
                                                                            xtype: 'fieldset',
                                                                            title: p,
                                                                            collapsible: true,
                                                                            collapsed: false,
                                                                            autoHeight: true,
                                                                            width: 400,
                                                                            items: {
                                                                                xtype: 'checkboxgroup',
                                                                                columns: 3,
                                                                                items: permissionCheckGroup[p]
                                                                            }
                                                                        });
                                                                    }
                                                                }
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
                                                                    title: title+"修改角色权限",
                                                                    width: 530,
                                                                    height: 400,
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
                                                                                    method: 'post',
                                                                                    clientValidation: true, //对客户端进行验证
                                                                                    url: "roles/" + record.get('id')+"/"+stubId,
                                                                                    params: {
                                                                                        permissionIds: Array.isArray(ids["permissionId"]) ? ids["permissionId"].join(",") : ids["permissionId"],
                                                                                        stubId: stubId
                                                                                    },
                                                                                    success: function (form, action) {
                                                                                        var data = Ext.JSON.decode(action.response.responseText);
                                                                                        if (data.success) {

                                                                                            Espide.Common.tipMsg('保存成功', data.msg);
                                                                                            roleUpdateWin.close();


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

                                                            },
                                                            failure: function (response, options) {

                                                                var data = Ext.JSON.decode(response.responseText);
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
                                            }),
                                                this.callParent(arguments);
                                        }

                                    });




//                               根据客户id 来判断 record.get('id') 打开相应的角色管理数据
                                    Ext.create("Ext.window.Window", {
                                        title: title+'角色列表',
                                        id: 'clientRoleList',
                                        collapsible: true,
                                        maximizable: true,
                                        modal: false,
                                        layout: 'border',
                                        width: 580,
                                        height: 400,
                                        buttonAlign: 'right',
                                        items: [
                                           new ClientRole.grid.Panel
                                        ]

                                    }).show();
                                }
                            },
                            {
                                iconCls: 'icon-remove',
                                tooltip: '模块管理',
                                handler: function (btn, rowIndex, colIndex, item, e, record) {
                                    //显示对应系统的模块
                                    var title = record.get('name') + '模块管理';

                                    clientModuleStore.load({
                                        params: {
                                            stubId: record.get('id')
                                        }
                                    });

                                    //自定义一个客户列表
                                    Ext.define('Client.grid.Panel', {
                                        extend: 'Ext.grid.Panel',
                                        initComponent: function () {
                                            Ext.apply(this, {
                                                region: 'center',
                                                id: 'clientModuleGrid',
                                                loadMask: true,
                                                forceFit: true,
                                                store: clientModuleStore,
                                                disableSelection: false,
                                                columns: [//配置表格列
                                                    {
                                                        header: '模块内容',
                                                        dataIndex: 'name'

                                                    },
                                                    {
                                                        header: '模块路径',
                                                        dataIndex: 'url'
                                                    }
                                                ],
                                                features: [
                                                    {
                                                        id: 'group',
                                                        ftype: 'grouping',
                                                        groupHeaderTpl: '{name}({rows.length})',
                                                        startCollapsed: true
                                                    }
                                                ]
                                            }),
                                                this.callParent(arguments);
                                        }

                                    });

                                    //定义一个窗口容器

                                    var win = Ext.getCmp('clientModuleList');
                                    if (!win) {
                                        win = new Ext.Window({
                                            title: '模块列表',
                                            id: 'clientModuleList',
                                            collapsible: true,
                                            maximizable: true,
                                            modal: false,
                                            layout: 'border',
                                            width: 580,
                                            height: 400,
                                            buttonAlign: 'right',
                                            items: [
                                                new Client.grid.Panel
                                            ]

                                        });

                                    }
                                    //展开窗口设置标题
                                    win.show().setTitle(title);
                                }
                            }
                        ]
                    }

                ],
                bbar: new Ext.PagingToolbar({
                    displayMsg: "显示第 {0} 条到 {1} 条记录，一共 {2} 条记录",
                    store: clientListStore,
                    displayInfo: true,
                    emptyMsg: '没有记录'
                }),
                listeners: {//单元格绑定双击事件   修改数据
                    'itemdblclick': function (view, record, item, index, event) {


                        //修改表单项
                        var formItems = [],title = record.get('name');

                        formItems.push({
                            xtype: 'hidden',
                            name: '_method',
                            value: 'put'
                        });
                        formItems.push({
                                fieldLabel: '系统名称',
                                name: 'name',
                                value: record.get('name'),
                                regexText: '首尾不得包含空格'
                            }
                        );
                        formItems.push({
                                fieldLabel: '唯一编码',
                                name: 'uniqueNo',
                                value: record.get('uniqueNo'),
                                regexText: '首尾不得包含空格'
                            }
                        );

                        //创建修改表单
                        var clientUpdateForm = Ext.create('Ext.form.Panel', {
                            baseCls: 'x-plain',
                            labelWidth: 80,
                            defaults: {
                                width: 380
                            },
                            id: 'clientUpdateForm',
                            forceFit: true,
                            border: false,
                            layout: 'form',
                            header: false,
                            frame: false,
                            bodyPadding: '5 5 0',
                            width: 500,
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

                        //修改用户窗口
                        var clientUpdateWin = Ext.create("Ext.window.Window", {
                            title: title+"修改客户系统",
                            id: "clientUpdateWin",
                            width: 530,
                            height: 400,
                            items: clientUpdateForm,
                            buttonAlign: "right",
                            autoScroll: true,
                            modal: true,
                            buttons: [
                                {
                                    text: '保存',
                                    itemId: 'addBtn',
                                    handler: function () {
                                        var ids = clientUpdateForm.getForm().getValues()["roleId"],
                                            password = clientUpdateForm.getForm().getValues()["password"],
                                            repassword = clientUpdateForm.getForm().getValues()["repassword"];

                                        clientUpdateForm.getForm().submit({
                                            url: "stubs/" + record.get('id'),
                                            method: "post",
                                            params: {
                                                name: record.get('name'),
                                                uniqueNo: record.get('uniqueNo'),

                                            },
                                            success: function (form, action) {
                                                var data = Ext.JSON.decode(action.response.responseText);
                                                if (data.success) {
                                                    Ext.MessageBox.show({
                                                        title: '提示',
                                                        msg: '修改成功！',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: 'x-message-box-info',
                                                        fn: function () {
                                                            clientUpdateWin.close();
                                                            Ext.getCmp('clientGrid').getStore().load();
                                                        }
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
                        //修改用户窗口
                        clientUpdateWin.show();
                    }

                }
            }

        );

        this.items = [searchForm, clientGrid];
        this.callParent(arguments);
    }

})
;
