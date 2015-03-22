/**
 * 客户管理
 * Created by Lein.xu
 */

Ext.define('EBDesktop.client.Win', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'EBDesktop.client.clientList'
    ],

    id: 'client-win',

    init: function () {
        this.launcher = {
            text: '用户管理',
            iconCls: 'icon-grid'
        };
    },

    createWindow: function () {
        var desktop = this.app.getDesktop(),
            win = desktop.getWindow('client-win');

        if (!win) {
            win = desktop.createWindow({
                id: 'client-win',
                title: '客户管理',
                width: 820,
                height: 480,
                collapsible: true,
                iconCls: 'icon-grid',
                animCollapse: false,
                constrainHeader: true,
                layout: 'fit',
                items: [
                    {
                        xtype: 'clientList'
                    }
                ]
            });
        }

        return win;
    },
    statics: {}
});