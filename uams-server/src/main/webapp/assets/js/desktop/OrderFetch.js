/**
 * 查询抓取的订单
 * Created by Lein xu.
 */
Ext.define('EBDesktop.OrderFetch', {
    extend: 'Ext.ux.desktop.Module',

    id: 'orderfetch-win',

    init: function () {
        this.launcher = {
            text: '查看订单抓取',
            iconCls: 'icon-grid'
        };
    },

    createWindow: function () {
        var desktop = this.app.getDesktop(),
            root = this,
            win = desktop.getWindow('orderfetch-win'),
            OrderFetchStore = root.self.getConfigStore();

        if (!win) {
            win = desktop.createWindow({
                title: '查看订单抓取',
                id: 'orderfetch-win',
                collapsible: true,
                maximizable: true,
                modal: false,
                layout: 'fit',
                width: 900,
                height: 602,
                items: [
                    root.self.createShopGrid(OrderFetchStore)
                ]
            })
        }
        return win;
    },

    statics: {

        //生成配置数据表格
        createShopGrid: function (store) {
            return Ext.create('Ext.grid.Panel', {
                region: 'west',
                id: 'OrderFetchList',
                store: store,
                forceFit: true,
                columns: [
                    {
                        text: '抓取时间',
                        dataIndex: 'fetchTime',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                    },
                    {
                        text: '抓取平台',
                        width:50,
                        dataIndex: 'outPlatform'

                    },
                    {
                        text: '店铺名称',
                        width:160,
                        dataIndex: 'title'
                    },
                    {
                        text: '抓取条数',
                        width:50,
                        dataIndex: 'fetchCount'
                    },
                    {
                        text: '记录创建时间',
                        dataIndex: 'createTime',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                    },
                    {
                        text: '记录修改时间',
                        dataIndex: 'updateTime',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                    }

                ],
                bbar: new Ext.PagingToolbar({
                    displayMsg: "显示第 {0} 条到 {1} 条记录，一共 {2} 条记录",
                    store: store,
                    displayInfo: true,
                    emptyMsg: '没有记录'
                })
            });
        },



        //生成配置store
        getConfigStore: function () {

            Ext.define('OrderFetchModel', {
                //不要忘了继承
                extend: 'Ext.data.Model',
                fields: [
                    'id',
                    {name: 'fetchTime', type: 'date', dateFormat: 'time'},
                    'outPlatform',
                    'title',
                    'fetchCount',
                    {name: 'createTime', type: 'date', dateFormat: 'time'},
                    {name: 'updateTime', type: 'date', dateFormat: 'time'}

                ],
                idProperty: 'id'
            });

            return Ext.create('Ext.data.Store', {
                model: 'OrderFetchModel',
                proxy: {
                    type: 'ajax',
                    url: '/orderfetch/list',
                    reader: {
                        type: 'json',
                        successProperty: 'success',
                        root: 'data.obj.result',
                        messageProperty: 'msg',
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
                autoLoad: {start: 0, limit: 19},
                pageSize: 19
            });
        }
    }
});