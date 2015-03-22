/*
 * Created by king on 13-12-17
 */

Ext.define('Supplier.view.Search', {
    extend: 'Ext.form.Panel',
    id: 'search',
    alias: 'widget.orderSearch',
    region: 'north',
    border: 0,
    //bodyPadding: 10,
    layout: {
        type: 'hbox',
        align: 'left'
    },
    height: 'auto',
    defaultType: 'fieldcontainer',
    defaults: {
        margin: '0 10 0 0',
        defaults: {
            xtype: 'combo',
            labelWidth: 60,
            width: 160,
            queryMode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            editable: false
        }
    },
    initComponent: function () {
        this.items = [
            {
                xtype: 'button',
                text: '确定',
                itemId: 'confirmBtn',
                width: 55,
                height: 55,
                hidden: true
            },
            {
                fieldLabel: '订单状态', value: 'CONFIRMED', name: 'orderStatus', id: 'orderState', hidden: true,
                queryMode:      'local',
                triggerAction:  'all',
                forceSelection: true,
                xtype: 'combo',
                store: Espide.Common.orderState.getStore(true)
            }
        ];
        this.tbar =  {
            ui: 'footer',
                items: [
                { text: '待处理', itemId: 'CONFIRMED', belong: 'mainBtn', disabled: true},
                '--》',
                { text: '已打印', itemId: 'PRINTED', belong: 'mainBtn'},
                '--》',
                { text: '已验货', itemId: 'EXAMINED', belong: 'mainBtn'},
                '--》',
                { text: '处理完', itemId: 'INVOICED', belong: 'mainBtn'}
            ]
        };

        this.callParent(arguments);
    }
})