/**
 * 用户列表
 * Created by Lein.xu
 */

//定义用户列表数据模型
Ext.define('EBDesktop.AccountListModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'username',
        'employeeInfo',
        'employeeRoleList',
        {name: 'realName', type: 'string', mapping: 'employeeInfo.name'},
        {name: 'gender', type: 'string', mapping: 'employeeInfo.sex'},
        {name: 'number', type: 'string', mapping: 'employeeInfo.number'},
        {name: 'email', type: 'string', mapping: 'employeeInfo.email'},
        {name: 'tel', type: 'string', mapping: 'employeeInfo.tel'},
        {name: 'address', type: 'string', mapping: 'employeeInfo.address'},
        {name: 'position', type: 'string', mapping: 'employeeInfo.position'},
        'department',
        {name: 'departmentName', type: 'string', mapping: 'department.name'},
        {name: 'departmentId', type: 'string', mapping: 'department.id'},
        'status',
        'employeeRoleList',
        {name: 'createTime', type: 'date', dateFormat: 'time'},
        {name: 'updateTime', type: 'date', dateFormat: 'time'}
    ],
    idProperty: 'id'
});


//定义用户列表类
Ext.define('EBDesktop.account.accountList', {
    extend: 'Ext.container.Container',
    alias: 'widget.accountList',
    id: 'accountList',
    title: "用户管理",
    layout: "border",
    fixed: true,
    initComponent: function () {
        // 用户数据源
        var accountListStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'EBDesktop.AccountListModel',
            proxy: {
                type: 'rest',
                api: {
                    read: "employees/"
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
            autoLoad: {start: 0, limit: 15},
            pageSize: 15
        });


        /*!
         * @author caizhiping
         * 下拉树
         */
        Ext.define('dataAddOrg.TreeComboBox', {
            extend: 'Ext.form.field.ComboBox',
            alias: 'widget.keeltreecombo',
            store: new Ext.data.ArrayStore({
                fields: [],
                data: [
                    []
                ]
            }),
            editable: false,
            allowBlank: false,
            _idValue: null,
            _txtValue: null,
            initComponent: function () {
                this.treeRenderId = Ext.id();
                this.tpl = "<tpl><div id='" + this.treeRenderId + "'></div></tpl>";
                this.callParent(arguments);
                this.on({
                    'expand': function () {
                        if (!this.treeObj.rendered && this.treeObj
                            && !this.readOnly) {
                            Ext.defer(function () {
                                this.treeObj.render(this.treeRenderId);
                            }, 300, this);
                        }
                    }
                });
                this.treeObj = new Ext.tree.Panel({
                    border: true,
                    id: 'technicalTreePanel',
                    height: 250,
                    width: 400,
                    split: true,
                    autoScroll: true,
                    tbar: new Ext.Toolbar({
                        style: 'border-top:0px;border-left:0px',
                        items: [
                            {
                                iconCls: 'expand',
                                text: '展开',
                                handler: function () {
                                    this.treeObj.getRootNode().expand(true);
                                },
                                scope: this
                            },
                            '-',
                            {
                                iconCls: 'collapse',
                                text: '折叠',
                                handler: function () {
                                    this.treeObj.getRootNode().collapse(true);
                                },
                                scope: this
                            }
                        ]
                    }),
                    root: {
                        id: '0',
                        name: '全部部门',
                        expanded: true
                    },
                    store: Ext.create('Ext.data.TreeStore', {
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: 'departments/',
                            reader: 'json',
                            extractResponseData: function (response) {
                                var json = Ext.JSON.decode(response.responseText).data.list;
                                return json;
                            }
                        }
                    }),
                    columns: [
                        {
                            width: '100%',
                            xtype: 'treecolumn',
                            dataIndex: 'name'
                        }
                    ]
                });
                this.treeObj.on('itemclick', function (view, rec) {
                    if (rec) {
                        this.setValue(this._txtValue = rec.get('name'));
                        this._idValue = rec.get('id');
                        if (Ext.getCmp('departmentIdTrue')) {
                            Ext.getCmp('departmentIdTrue').setValue(this._idValue);
                        }
                        if (Ext.getCmp('departmentNameTrue')) {
                            Ext.getCmp('departmentNameTrue').setValue(rec.get('name'));
                        }
                        this.collapse();
                    }
                }, this);
            },
            getValue: function () {// 获取id值
                return this._idValue;
            },
            getTextValue: function () {// 获取text值
                return this._txtValue;
            },
            setLocalValue: function (txt, id) {// 设值
                this._idValue = id;
                this.setValue(this._txtValue = txt);
            }
        });


        //添加用户
        function accountAdd() {
            //新建一个空数组 将查询的角色列表 封装成checkbox item 对象成为空数组的元素
            var roleList;
            var getRoleId;
            var roleCheckGroup = [];
            Ext.Ajax.request({
                url: '/roles',
                params: {
                    _method: 'get'
                },
                success: function (response, options) { //成功返回回调函数
                    var data = Ext.JSON.decode(response.responseText);
                    //假如请求成功
                    if (data.success) {
                        roleList = Ext.JSON.decode(response.responseText).data.obj.result;
                        Ext.each(roleList, function (roleList) {
                            roleCheckGroup.push({
                                boxLabel: roleList.name,
                                name: 'roleId',
                                inputValue: roleList.id,
                                checked: roleList.ur
                            });


                        });
                        //添加用户表单项
                        var formItems = [];
                        formItems.push({
                                fieldLabel: '用户名称',
                                name: 'username',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            }
                        );
                        formItems.push({
                                fieldLabel: '真实姓名',
                                name: 'name',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            }
                        );
                        formItems.push({
                                fieldLabel: '用户密码',
                                name: 'newPassword',
                                inputType: "password"
                            }
                        );
                        formItems.push({
                                xtype: 'combo',
                                id: "sex",
                                fieldLabel: '员工性别',
                                name: 'sex',
                                queryMode: 'local',
                                triggerAction: 'all',
                                forceSelection: true,
                                allowBlank: true,
                                editable: false,
                                value: 'man',
                                store: [
                                    ['man', '男'],
                                    ['woman', '女']
                                ],
                            }
                        );

                        formItems.push({
                                fieldLabel: '电子邮箱',
                                allowBlank: true,
                                name: 'email',
                                vtype: 'email',
                                vtypeText: '不是有效的邮箱地址',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            }
                        );
                        formItems.push({
                                fieldLabel: '手机号码',
                                allowBlank: true,
                                name: 'tel',
                                vtype: 'Mobile',
                                vtypeText: '不是有效的手机号码',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            }
                        );

                        formItems.push({
                                fieldLabel: '员工住址',
                                allowBlank: true,
                                name: 'address',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            }
                        );

                        formItems.push({
                                fieldLabel: '员工工号',
                                allowBlank: true,
                                name: 'number',
                                regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                regexText: '首尾不得包含空格'
                            }
                        );
                        formItems.push(
                            new dataAddOrg.TreeComboBox({
                                fieldLabel: '部门机构',
                                name: 'departmentId',
                                allowBlank: true,
                                anchor: '95%'
                            })
                        );

                        formItems.push({
                                fieldLabel: '员工职位',
                                allowBlank: true,
                                xtype: 'combo',
                                id: "position",
                                name: 'position',
                                queryMode: 'local',
                                triggerAction: 'all',
                                forceSelection: true,
                                editable: false,
                                value: 'EMPLOYEE',
                                store: [
                                    ['EMPLOYEE', '职员'],
                                    ['SUPERVISOR', '部门主管'],
                                    ['MANAGER', '部门经理'],
                                    ['DIRECTOR', '总监']
                                ],
                            }
                        );

                        formItems.push({
                            xtype: 'checkboxgroup',
                            id: 'roleGrounp',
                            fieldLabel: '分配角色',
                            columns: 3,
                            items: roleCheckGroup
                        });


                        //创建用户添加表单
                        var accountAddForm = Ext.create('Ext.form.Panel', {
                            baseCls: 'x-plain',
                            labelWidth: 80,
                            defaults: {
                                width: 380
                            },
                            id: 'accountAddForm',
                            forceFit: true,
                            border: false,
                            layout: 'form',
                            header: false,
                            frame: false,
                            closeAction: 'hide',
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


                        //创建一个弹窗容器
                        var accountAddWin = Ext.create("Ext.window.Window", {
                            title: '添加用户',
                            width: 550,
                            height: 500,
                            modal: true,
                            autoScroll: true,
                            plain: true,
                            buttonAlign: 'right',
                            bodyStyle: 'padding:5px;',
                            items: accountAddForm,
                            buttons: [
                                {
                                    text: '保存',
                                    itemId: 'addBtn',
                                    handler: function () {
                                        var addForm = accountAddForm.getForm();
                                        var ids = accountAddForm.getForm().getValues()["roleId"];

                                        datas = addForm.getValues();

                                        if (ids == undefined) {
                                            //现在的场景只能一个用户对应一个角色
                                            Ext.MessageBox.show({
                                                title: '提示',
                                                msg: '必须选择一个角色',
                                                buttons: Ext.MessageBox.OK,
                                                icon: 'x-message-box-info'
                                            });

                                            return false;
                                        }


                                        if (addForm.isValid()) {//判断表单是否验证
                                            addForm.submit({
                                                clientValidation: true, //对客户端进行验证
                                                url: "employees/",
                                                method: "post",
                                                params: {
                                                    _method: 'post',
                                                    username: datas["username"],
                                                    newPassword: datas["newPassword"],
                                                    'employeeInfo.name': datas["name"],
                                                    'employeeInfo.sex': datas["sex"],
                                                    'employeeInfo.email': datas["email"],
                                                    'employeeInfo.tel': datas["tel"],
                                                    'employeeInfo.address': datas["address"],
                                                    'employeeInfo.number': datas["number"],
                                                    'employeeInfo.position': datas["position"],
                                                    'employeeInfo.tel': datas["tel"],
                                                    department: datas["departmentId"],
                                                    roleIds: Ext.isArray(datas["roleId"]) ? datas["roleId"].join() : datas["roleId"]
                                                },
                                                success: function (form, action) {

                                                    var data = Ext.JSON.decode(action.response.responseText);
                                                    if (data.success) {
                                                        Espide.Common.tipMsg('保存成功', data.msg);
                                                        accountAddWin.close();
                                                        Ext.getCmp('accountGrid').getStore().load();

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

                        //显示弹窗
                        accountAddWin.show();
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

                }});
        }

        //用户查询
        function searchAccount(button) {
            Espide.Common.doSearch("accountGrid", "searchAccount", true);
        }

        // 刷新accountGrid
        function refreshAccountGrid() {
            Ext.getCmp('accountGrid').getStore().load();
        }

        //顶栏表单
        var searchForm = Ext.create('Ext.form.Panel', {
            region: 'north',
            layout: 'hbox',
            border: 0,
            bodyStyle: {
                padding: '6px 0 6px 8px'
            },
            id: 'searchAccount',
            defaults: {
                xtype: 'combo',
                labelWidth: 60,
                margin: '0 10 0 0'
            },
            items: [
                {
                    xtype: 'combo',
                    name: 'searchType',
                    itemId: 'dateType',
                    value: 'username',
                    store: [
                        ['name', '真实姓名'],
                        ['username', '用户名'],
                        ['tel', '电话'],
                        ['number', '工号'],
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'searchValue',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                searchAccount();
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '查询',
                    itemId: 'searchBtn',
                    handler: searchAccount
                },
                {
                    xtype: 'button',
                    text: '添加',
                    itemId: 'addBtn',
                    handler: accountAdd
                },
                {
                    xtype: 'button',
                    text: '导入数据',
                    itemId: 'include',
                    handler: include
                }
            ]
        });



        function include(button) {
            var uploadForm = Ext.create("Ext.form.Panel", {
                baseCls: 'x-plain',
                labelWidth: 80,
                defaults: {
                    width: 380
                },
                id: 'uploadForm',
                border: false,
                layout: {
                    type: 'hbox',
                    align: 'center'
                },
                header: false,
                frame: false,
                bodyPadding: '20',
                items: [
                    {
                        xtype: "filefield",
                        name: "uploadFile",
                        fieldLabel: "导入文件",
                        labelWidth: 80,
                        width: 300,
                        anchor: "100%",
                        id: "uploadFile",
                        allowBlank: false,
                        blankText: 'Excel文件不能为空',
                        buttonText: "选择文件",
                        msgTarget: 'under',
                        validator: function (value) {
                            var arr = value.split(".");
                            if (arr[arr.length - 1] != "xls") {
                                return "文件不合法";
                            } else {
                                return true;
                            }
                        }

                    },
//                    {
//                        xtype: 'container',
//                        layout: {
//                            type: 'hbox',
//                            pack: 'left'
//                        },
//                        items: [
//                            {
//                                xtype: 'button',
//                                cls: 'contactBtn',
//                                margin: "0 0 0 20",
//                                text: '下载模板',
//                                listeners: {
//                                    'click': function () {
//                                        location.href = "/static/templet/brandExcelModel.xls";
//                                    }
//                                }
//                            }
//                        ]}
                ]


            });


            var includeWin = Ext.create("Ext.window.Window", {
                title: '导入员工数据',
                width: 500,
                height: 150,
                modal: true,
                autoHeight: true,
                layout: 'fit',
                buttonAlign: 'right',
                bodyStyle: 'padding:5px;',
                items: uploadForm,
                buttons: [
                    {
                        text: "确认导入",
                        handler: function () {
                            var form = uploadForm.getForm();
                            if (form.isValid()) {
                                form.submit({
                                    url: "/employees/upload_excel",
                                    waitMsg: "正在导入验证数据",
                                    success: function (fp, o) {
                                        var data = Ext.JSON.decode(o.response.responseText);
                                        console.log(data);
                                        if (data.success) {
                                            Espide.Common.tipMsgIsCloseWindow(data,includeWin,'accountGrid',true);
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


        //创建角色数据表格容器
        var accountGrid = Ext.create("Ext.grid.Panel", {
                region: 'center',
                id: 'accountGrid',
                loadMask: true,
                forceFit: true,
                selType: 'checkboxmodel',
                store: accountListStore,
                columns: [
                    {
                        header: '用户名',
                        dataIndex: 'username',
                        width: 40
                    },
                    {
                        header: '真实姓名',
                        dataIndex: 'realName',
                        width: 40
                    },
                    {
                        header: '性别',
                        dataIndex: 'gender',
                        width: 20,
                        renderer: function (value) {
                            switch (value) {
                                case 'man':
                                    return '男';
                                    break;
                                case 'woman':
                                    return '女';
                                    break;

                            }
                        }
                    },
                    {
                        header: '部门名称',
                        dataIndex: 'departmentName',
                        width: 40
                    },
                    {
                        header: '职位',
                        dataIndex: 'position',
                        width: 30,
                        renderer: function (value) {
                            switch (value) {
                                case 'EMPLOYEE':
                                    return '职员';
                                    break;
                                case 'SUPERVISOR':
                                    return '部门主管';
                                    break;
                                case 'MANAGER':
                                    return '部门经理';
                                    break;
                                case 'DIRECTOR':
                                    return '总监';
                                    break;

                            }
                        }
                    },
                    {
                        header: '更新时间',
                        dataIndex: 'updateTime',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
                        width: 60
                    } ,
                    {
                        header: '状态',
                        dataIndex: 'status',
                        renderer: function (value) {
                            switch (value) {
                                case "NORMAL":
                                    return "正常";
                                    break;
                                case "FROZEN":
                                    return "冻结";
                                    break;
                            }
                        },
                        width: 30
                    },
                    {
                        xtype: 'actioncolumn',
                        text: '修改状态',
                        menuDisabled: true,
                        width: 40,
                        items: [
                            {
                                iconCls: 'icon-add',
                                tooltip: '恢复正常',
                                handler: function (btn, rowIndex, colIndex, item, e, record) {

                                    Espide.Common.doAction({
                                        method: 'post',
                                        url: 'employees/' + record.get('id'),
                                        params: {
                                            status: 'NORMAL',
                                            _method: 'put'
                                        },
                                        successCall: function () {
                                            Ext.getCmp('accountGrid').getStore().loadPage(1);
                                        },
                                        successTipMsg: '状态修改成功'
                                    })('yes');
                                }
                            },
                            {
                                iconCls: 'icon-remove',
                                tooltip: '冻结用户',
                                handler: function (btn, rowIndex, colIndex, item, e, record) {
                                    Espide.Common.doAction({
                                        method: 'post',
                                        url: 'employees/' + record.get('id'),
                                        params: {
                                            status: 'FROZEN',
                                            _method: 'put'
                                        },
                                        successCall: function () {
                                            Ext.getCmp('accountGrid').getStore().loadPage(1);
                                        },
                                        successTipMsg: '状态修改成功'
                                    })('yes');
                                }
                            }
                        ]
                    }

                ],
                bbar: new Ext.PagingToolbar({
                    displayMsg: "显示第 {0} 条到 {1} 条记录，一共 {2} 条记录",
                    store: accountListStore,
                    displayInfo: true,
                    emptyMsg: '没有记录'
                }),
                listeners: {//单元格绑定双击事件   修改数据
                    'itemdblclick': function (view, record, item, index, event) {

                        //新建一个空数组 将查询的角色列表 封装成checkbox item 对象成为空数组的元素
                        var roleList;
                        var getRoleId;
                        var roleCheckGroup = [];
                        Ext.Ajax.request({
                            url: 'employees/roles/' + record.get('id'),
                            params: {
                                _method: 'get',
                                id: record.get('id')
                            },
                            success: function (response, options) { //成功返回回调函数
                                var data = Ext.JSON.decode(response.responseText);

                                //假如请求成功
                                if (data.success) {
                                    roleList = Ext.JSON.decode(response.responseText).data.obj;
                                    Ext.Array.each(roleList, function (roleList, i) {

                                        if (roleList.status) {
                                            roleCheckGroup.push({
                                                boxLabel: roleList.name,
                                                name: 'roleId',
                                                inputValue: roleList.id,
                                                checked: true
                                            });
                                        } else {
                                            roleCheckGroup.push({
                                                boxLabel: roleList.name,
                                                name: 'roleId',
                                                inputValue: roleList.id,
                                                checked: false
                                            });
                                        }
                                    });

                                    //修改表单项
                                    var formItems = [];
                                    formItems.push({
                                        xtype: 'hidden',
                                        id: 'departmentIdTrue',
                                        name: 'departmentIdTrue',
                                        value: record.get('departmentId')
                                    });
                                    formItems.push({
                                        xtype: 'hidden',
                                        id: 'departmentNameTrue',
                                        name: 'departmentNameTrue',
                                        value: record.get('departmentName')
                                    });

                                    formItems.push({
                                            fieldLabel: '用户名称',
                                            name: 'username',
                                            value: record.get('username'),
                                            regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                            regexText: '首尾不得包含空格'
                                        }
                                    );
                                    formItems.push({
                                            fieldLabel: '真实姓名',
                                            name: 'name',
                                            value: record.get('realName'),
                                            regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                            regexText: '首尾不得包含空格'
                                        }
                                    );

                                    formItems.push({
                                            fieldLabel: '重置密码',
                                            name: 'newPassword',
                                            allowBlank:true,
                                            inputType: "password",
                                            allowBlank: true
                                        }
                                    );
                                    formItems.push({
                                            fieldLabel: '确认密码',
                                            name: 'repassword',
                                            allowBlank:true,
                                            inputType: "password",
                                            allowBlank: true
                                        }
                                    );

                                    formItems.push({
                                            xtype: 'combo',
                                            id: "sex",
                                            fieldLabel: '员工性别',
                                            name: 'sex',
                                            queryMode: 'local',
                                            triggerAction: 'all',
                                            allowBlank:true,
                                            forceSelection: true,
                                            editable: false,
                                            value: 'man',
                                            store: [
                                                ['man', '男'],
                                                ['woman', '女']
                                            ],
                                        }
                                    );

                                    formItems.push({
                                            fieldLabel: '电子邮箱',
                                            name: 'email',
                                            vtype: 'email',
                                            value: record.get('email'),
                                            vtypeText: '不是有效的邮箱地址',
                                            allowBlank:true,
                                            regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                            regexText: '首尾不得包含空格'
                                        }
                                    );
                                    formItems.push({
                                            fieldLabel: '手机号码',
                                            name: 'tel',
                                            vtype: 'Mobile',
                                            value: record.get('tel'),
                                            vtypeText: '不是有效的手机号码',
                                            allowBlank:true,
                                            regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                            regexText: '首尾不得包含空格'
                                        }
                                    );

                                    formItems.push({
                                            fieldLabel: '员工住址',
                                            name: 'address',
                                            value: record.get('address'),
                                            allowBlank:true,
                                            regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                            regexText: '首尾不得包含空格'
                                        }
                                    );

                                    formItems.push({
                                            fieldLabel: '员工工号',
                                            name: 'number',
                                            value: record.get('number'),
                                            allowBlank:true,
                                            regex: /(^\S+.*\S+$)|(^\S{1}$)/,
                                            regexText: '首尾不得包含空格'
                                        }
                                    );
                                    formItems.push(
                                        new dataAddOrg.TreeComboBox({
                                            fieldLabel: '部门机构',
                                            allowBlank:true,
                                            id: 'departmentId',
                                            name: 'departmentIdFalse',
                                            anchor: '95%'
                                        }).setValue(record.get('departmentName'))
                                    );

                                    formItems.push({
                                            fieldLabel: '员工职位',
                                            xtype: 'combo',
                                            id: "position",
                                            name: 'position',
                                            queryMode: 'local',
                                            triggerAction: 'all',
                                            allowBlank:true,
                                            forceSelection: true,
                                            editable: false,
                                            value: 'EMPLOYEE',
                                            store: [
                                                ['EMPLOYEE', '职员'],
                                                ['SUPERVISOR', '部门主管'],
                                                ['MANAGER', '部门经理'],
                                                ['DIRECTOR', '总监']
                                            ],
                                        }
                                    );


                                    formItems.push({
                                        xtype: 'checkboxgroup',
                                        fieldLabel: '分配角色',
                                        columns: 3,
                                        items: roleCheckGroup

                                    });

                                    //创建修改表单
                                    var accountUpdateForm = Ext.create('Ext.form.Panel', {
                                        baseCls: 'x-plain',
                                        labelWidth: 80,
                                        defaults: {
                                            width: 380
                                        },
                                        id: 'accountUpdateForm',
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
                                    Ext.getCmp('sex').setValue(record.get('gender'));
                                    Ext.getCmp('position').setValue(record.get('position'));


                                    //修改用户窗口
                                    var accountUpdateWin = Ext.create("Ext.window.Window", {
                                        title: "修改用户",
                                        id: "accountUpdateWin",
                                        width: 550,
                                        height: 500,
                                        items: accountUpdateForm,
                                        buttonAlign: "right",
                                        autoScroll: true,
                                        modal: true,
                                        buttons: [
                                            {
                                                text: '保存',
                                                itemId: 'addBtn',
                                                handler: function () {
                                                    var ids = accountUpdateForm.getForm().getValues()["roleId"],
                                                        newPassword = accountUpdateForm.getForm().getValues()["newPassword"],
                                                        repassword = accountUpdateForm.getForm().getValues()["repassword"];

                                                    var addForm = accountUpdateForm.getForm();
                                                    var datas = addForm.getValues();
                                                    console.log(datas["departmentId"]);
                                                    if (ids == undefined) {
                                                        //现在的场景只能一个用户对应一个角色
                                                        Ext.MessageBox.show({
                                                            title: '提示',
                                                            msg: '必须选择一个角色',
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: 'x-message-box-info'
                                                        });
                                                    } else {
                                                        if (newPassword === repassword) { //密码必须与确认密码相同
                                                            accountUpdateForm.getForm().submit({
                                                                clientValidation: true, //对客户端进行验证
                                                                url: "employees/" + record.get('id'),
                                                                method: "post",
                                                                params: {
                                                                    _method: 'put',
                                                                    username: datas["username"],
                                                                    newPassword: datas["newPassword"],
                                                                    'employeeInfo.name': datas["name"],
                                                                    'employeeInfo.sex': datas["sex"],
                                                                    'employeeInfo.email': datas["email"],
                                                                    'employeeInfo.tel': datas["tel"],
                                                                    'employeeInfo.address': datas["address"],
                                                                    'employeeInfo.number': datas["number"],
                                                                    'employeeInfo.position': datas["position"],
                                                                    'employeeInfo.tel': datas["tel"],
                                                                    department: datas["departmentIdTrue"],
                                                                    departmentId: datas["departmentIdTrue"],
                                                                    roleIds: Ext.isArray(datas["roleId"]) ? datas["roleId"].join() : datas["roleId"]
                                                                },
                                                                success: function (form, action) {
                                                                    var data = Ext.JSON.decode(action.response.responseText);
                                                                    if (data.success) {
                                                                        Espide.Common.tipMsg('保存成功', data.msg);
                                                                        accountUpdateWin.close();
                                                                        Ext.getCmp('accountGrid').getStore().load();

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
                                                        } else {
                                                            Ext.MessageBox.show({
                                                                title: '提示',
                                                                msg: '密码必须与确认密码相同',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: 'x-message-box-error'
                                                            });
                                                        }

                                                    }


                                                }
                                            }
                                        ]
                                    });
                                    //修改用户窗口
                                    accountUpdateWin.show();

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

                            }});
                    }
                }
            }
        );

        this.items = [searchForm, accountGrid];
        this.callParent(arguments);
    }

});
