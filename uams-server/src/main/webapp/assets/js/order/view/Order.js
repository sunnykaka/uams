/*
* Created by king on 13-12-17
*/

Ext.define('Supplier.view.Order', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.order',
    title: '订单预处理',
    id: 'order',
    fixed: true,
    layout: 'border',
    initComponent: function (){
        this.items = [
            {xtype: 'orderSearch'},
            {xtype: 'orderList'},
            {xtype: 'orderItem'}
        ];
        this.callParent(arguments);
    }
});