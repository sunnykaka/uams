/*
 * Created by Lein on 13-12-17
 */

Ext.define('Log.view.LogList', {
    extend: 'Ext.container.Container',
    id: 'LogList',
    alias: 'widget.LogList',
    title: "系统日志管理",
    fixed: true,
    layout: "border",
    initComponent: function () {
        var startDate = Ext.create('Log.dateExtend.form.field.DateTime', {
            fieldLabel: '开始日期',
            value: new Date(new Date().getTime() - 60 * 60 * 24 * 1000),
            name: 'startDate',
            id: 'startDate',
            format: 'Y-m-d H:i:s',
            margin: '0 0 5 0',
            labelWidth: 60,
            width: 220
        });


        var endDate = Ext.create('Log.dateExtend.form.field.DateTime', {
            fieldLabel: '结束日期',
            value: new Date(),
            name: 'endDate',
            id: 'endDate',
            format: 'Y-m-d H:i:s',
            margin: '0 0 5 0',
            labelWidth: 60,
            width: 220
        });

//操作日志
        var LogListGrid = Ext.create("Ext.grid.Panel", {
            region: 'center',
            title: "系统日志管理",
            id: 'LogListGrid',
            loadMask: true,
            forceFit: true,
            split: true,
            store: 'LogList',
            viewConfig: {
                enableTextSelection: true,
                emptyText: '<div style="text-align:center; padding:10px;color:#F00">没有数据</div>',
                markDirty: false
            },
            columns: [
                {
                    header: '日志ID',
                    dataIndex: 'id'
                },
                {
                    header: '操作用户',
                    dataIndex: 'userName'
                },
                {
                    header: '操作名称',
                    dataIndex: 'operationName'
                },
                {
                    header: '请求链接',
                    dataIndex: 'requestUrl'
                },
                {
                    header: '模块名称',
                    dataIndex: 'resourceName'
                },
                {
                    header: '创建开始时间',
                    dataIndex: 'createTime',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },
                {
                    header: '执行时长',
                    dataIndex: 'executionTime'
                }

            ],
            tbar: [
                {xtype: startDate},
                '-',
                {xtype: endDate},
                '-',
                {
                    fieldLabel: '开始执行耗时',
                    xtype: 'textfield',
                    name: 'executionTimeStart',
                    width: 150,
                    itemId: "executionTimeStart",
                    value: 0
                },
                '-',
                {
                    fieldLabel: '结束执行耗时',
                    xtype: 'textfield',
                    name: 'executionTimeEnd',
                    width: 150,
                    itemId: "executionTimeEnd"
                },
                '-',
                {xtype: 'combo', store: [
                    ["userName", "操作用户"],
                    ["operationName", "操作名称"],
                    ["resourceName", "模块名称"]
                ], queryMode: 'local', name: "searchType", value: "userName", width: 100, itemId: "type"},
                '-',
                {
                    xtype: 'textfield',
                    name: 'shopName',
                    width: 150,
                    itemId: "inputValue"},
                {
                    xtype: 'button',
                    name: 'submuit',
                    text: '搜索',
                    handler: function (btn) {
                        var inputValue = btn.up('grid').down('#inputValue').getValue();
                        var type = btn.up('grid').down('#type').getValue();
                        var start = Ext.util.Format.date(Ext.getCmp('startDate').getRawValue(), 'Y-m-d H:i:s');
                        var end = Ext.util.Format.date(Ext.getCmp('endDate').getRawValue(), 'Y-m-d H:i:s');
                        var execStart = btn.up('grid').down('#executionTimeStart').getValue();
                        var execEnd = btn.up('grid').down('#executionTimeEnd').getValue();


                        var  store = btn.up('grid').getStore();
                        var new_params = {
                            searchType: type,
                            searchValue: inputValue,
                            createTimeStart: start,
                            createTimeEnd: end,
                            executionTimeStart:execStart,
                            executionTimeEnd:execEnd
                        };
                        store.getProxy().extraParams = new_params;
                        store.loadPage(1);
                        Espide.Common.removeGridSel(LogListGrid);

                    }}


            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                displayMsg: "显示第 {0} 条到 {1} 条记录，一共 {2} 条记录",
                store: 'LogList',
                displayInfo: true,
                emptyMsg: '没有记录'
            })
        });
//操作日志
        var BusinessGrid = Ext.create("Ext.grid.Panel", {
            region: 'south',
            id: 'BusinessGrid',
            split: true,
            height: 200,
            loadMask: true,
            hidden: true,
            forceFit: true,
            store: 'BusinessLog',
            viewConfig: {
                enableTextSelection: true,
                emptyText: '<div style="text-align:center; padding:10px;color:#F00">没有数据</div>',
                markDirty: false
            },
            plugins:[
                Ext.create('Ext.grid.plugin.CellEditing',{
                    clicksToEdit:1 //设置单击单元格编辑
                })
            ],
            columns: [
                {
                    header: '日志ID',
                    width: 50,
                    dataIndex: 'id'
                },
                {
                    header: '业务日志ID',
                    width: 50,
                    dataIndex: 'businessLogId'
                },
                {
                    header: 'SQL语句',
                    width: 800,
                    dataIndex: 'content',
                    editor: {
                        xtype: "textfield",
                        allowBlank: false
                    }
                },
                {
                    header: '操作类型',
                    width: 40,
                    dataIndex: 'operationType'
                },
                {
                    header: '创建时间',
                    dataIndex: 'createTime',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },
                {
                    header: '执行时长',
                    width: 40,
                    dataIndex: 'executionTime'
                }

            ]
        });


        this.items = [LogListGrid, BusinessGrid];
        this.callParent(arguments);

    }
})
;