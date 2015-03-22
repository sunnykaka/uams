/**
 * 商品优惠活动 - 添加
 * Created by HuaLei.Du on 13-12-30.
 */
Ext.define('EBDesktop.gift.GoodsActivityAdd', {
    extend: 'Ext.window.Window',
    alias: 'widget.giftGoodsActivityAdd',
    title: '添加商品活动',
    id: 'giftGoodsActivityAdd',
    modal: true,
    closeAction: 'destroy',
    autoShow: false,
    constrain: true,
    layout: 'border',
    width: 740,
    height: 480,
    initComponent: function () {
        this.items = [
            { xtype: 'giftGoodsList' },
            { xtype: 'giftGoodsActivityAddForm' }
        ];
        this.callParent(arguments);
    }
});