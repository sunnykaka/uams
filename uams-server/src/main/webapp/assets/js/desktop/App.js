/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('EBDesktop.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel',
        'EBDesktop.Order',
        'EBDesktop.Shipment',
        'EBDesktop.Stock',
        'EBDesktop.Shop',
        'EBDesktop.Config',
        'EBDesktop.LogisticsQuery',
        'EBDesktop.OrderFetch',
        'EBDesktop.Product',
        'EBDesktop.Log',
        'EBDesktop.logistics.Win',
        'EBDesktop.warehouse.Win',
        'EBDesktop.gift.Win',
        //'EBDesktop.mutex.Win',
        //'EBDesktop.permission.Win',
        'EBDesktop.account.Win',
        'EBDesktop.client.Win',
        'EBDesktop.role.Win',
        'EBDesktop.depart.Win',
        'EBDesktop.module.Win',
        //'EBDesktop.goods.Goods',
        'EBDesktop.brand.Win',
        'EBDesktop.productCategory.Win',
        'EBDesktop.mealset.Win',
        'EBDesktop.Warn'
    ],

    init: function () {
        // custom logic before getXYZ methods get called...

        this.callParent();

        // now ready...
    },

    getModules: function () {
        return [
            new EBDesktop.Order(),
            new EBDesktop.Shipment(),
            new EBDesktop.Stock(),
            new EBDesktop.Shop(),
            new EBDesktop.Product(),
            new EBDesktop.Log(),
            new EBDesktop.Config(),
            new EBDesktop.LogisticsQuery(),
            new EBDesktop.OrderFetch(),
            new EBDesktop.logistics.Win(),
            new EBDesktop.warehouse.Win(),
            new EBDesktop.gift.Win(),
            //new EBDesktop.mutex.Win(),
            //new EBDesktop.permission.Win(),
            new EBDesktop.account.Win(),
            new EBDesktop.client.Win(),
            new EBDesktop.role.Win(),
            new EBDesktop.depart.Win(),
            new EBDesktop.module.Win(),
            //new EBDesktop.goods.Goods(),
            new EBDesktop.brand.Win(),
            new EBDesktop.productCategory.Win(),
            new EBDesktop.mealset.Win(),
            new EBDesktop.Warn()
        ];

    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        var moduleArray = [
//            { name: '订单管理', iconCls: 'desktop-order', module: 'order-win'},
//            { name: '发货管理', iconCls: 'desktop-shipment', module: 'shipment-win'},
//            { name: '库存管理', iconCls: 'desktop-stock', module: 'stock-win' },
//            { name: '物流管理', iconCls: 'desktop-logistics', module: 'logistics-win'},
//            { name: '仓库管理', iconCls: 'desktop-warehouse', module: 'warehouse-win'},
//            { name: '优惠活动管理', iconCls: 'desktop-gift', module: 'gift-win' },
//            { name: '品牌管理', iconCls: 'desktop-brand', module: 'brand-win' },
//            { name: '产品分类管理', iconCls: 'desktop-productCategory', module: 'productCategory-win'},
            { name: '用户管理', iconCls: 'desktop-account', module: 'account-win'},
            { name: '客户管理', iconCls: 'desktop-client', module: 'client-win'},
            { name: '角色管理', iconCls: 'desktop-role', module: 'role-win' },
            { name: '部门管理', iconCls: 'desktop-depart', module: 'depart-win' }

//            { name: '模块管理', iconCls: 'desktop-module', module: 'module-win'}
//            { name: '店铺管理', iconCls: 'desktop-shop', module: 'shop-win'},
//            { name: '系统配置', iconCls: 'desktop-config', module: 'config-win'},
//            { name: '产品管理', iconCls: 'desktop-product', module: 'product-win'},
//            { name: '系统日志', iconCls: 'desktop-log', module: 'log-win'},
//            { name: '套餐管理', iconCls: 'desktop-mealset', module: 'mealset-win'},
//            { name: '订单预警', iconCls: 'desktop-warn', module: 'warn-win'},
//            { name: '抓取订单查询', iconCls: 'desktop-orderfetch', module: 'orderfetch-win'},
//            { name: '快递单查询', iconCls: 'desktop-logisticsquery', module: 'logisticsquery-win'}
        ];


        //假如GV.userId为空时 啥事都不做
//        if(GV.userId == ""){
//            return;
//        }
//
//        var moduleArray = [];
//        Ext.Ajax.request({
//            url: '/role/user/resource',
//            params: {
//                id: GV.userId
//            },
//            async: false,
//            success: function (response) {
//                var data = Ext.decode(response.responseText);
//                if (data.success) {
//                    moduleArray = data.data.list;
//
//                }
//            }
//        });


        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',

            contextMenuItems: [
                { text: 'Change Settings', scope: me }
            ],
            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: moduleArray

            }),

            wallpaper: 'assets/images/wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: false
        });

    },

    // config for the start menu
    getStartConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title:'uams唐杨专用版' ,
            iconCls: 'user',
            height: 200,
            toolConfig: {
                width: 150,
                items: [
                    {
                        text: '修改密码',
                        iconCls: 'settings',
                        scope: me
                    },
                    '-',
                    {
                        text: '退出系统',
                        iconCls: 'logout',
                        scope: me,
                        handler: function () {
                            location.href = '/logout';
                        }
                    }
                ]
            }
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('退出', '你确定要退出系统吗?');
    },

    onSettings: function () {
        var dlg = new EBDesktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
