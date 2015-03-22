/**
 * 用户管理
 * Created by Lein.xu
 */

Ext.define('EBDesktop.depart.Win', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'EBDesktop.depart.departList'
    ],

    id: 'depart-win',

    init: function () {
        this.launcher = {
            text: '部门管理',
            iconCls: 'icon-grid'
        };
    },

    createWindow: function () {
        var desktop = this.app.getDesktop(),
            win = desktop.getWindow('depart-win');

        if (!win) {
            win = desktop.createWindow({
                id: 'depart-win',
                title: '部门管理',
                width: 580,
                height: 500,
                collapsible: true,
                iconCls: 'icon-grid',
                animCollapse: false,
                constrainHeader: true,
                layout: 'fit',
                items: [
                    {
                        xtype: 'departList'
                    }
                ]
            });
        }

        return win;
    },
    statics: {}
});