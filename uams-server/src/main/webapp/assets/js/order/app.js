Ext.Loader.setConfig({
    enabled:true,
    paths:{
        'Go':'assets/js/order/dateExtend/'
    }
});

Ext.application({
    name: 'Supplier',
    appFolder: 'assets/js/order',
    controllers: ['Order', 'Win'],
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            id: 'mainViewPort',
            layout: 'fit',
            items: [
                {xtype: 'order'}
            ]
        });
    }
});