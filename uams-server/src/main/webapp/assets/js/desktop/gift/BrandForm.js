/**
 * Created by HuaLei.Du on 14-2-20.
 */

Ext.define('EBDesktop.gift.BrandForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.giftBrandForm',
    id: 'giftBrandForm',
    forceFit: true,
    layout: 'form',
    bodyPadding: '5 5 0',
    border: '0 0 1 0',
    requires: ['Ext.form.field.Text'],
    fieldDefaults: {
        msgTarget: 'side',
        labelWidth: 90
    },
    height: 'auto',
    defaultType: 'fieldcontainer',
    initComponent: function () {

        Ext.tip.QuickTipManager.init();

        var brandListStore = Espide.Common.createComboStore('/brand/forList', false);

        this.items = [
            {
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'id',
                        itemId: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'action',
                        itemId: 'action',
                        hidden: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'giftProdId',
                        itemId: 'giftProdId',
                        hidden: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'giftProdCount',
                        itemId: 'giftProdCount',
                        hidden: true
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType: 'combo',
                        items: [
                            {
                                flex: 1,
                                name: 'brandId',
                                itemId: 'brandId',
                                fieldLabel: '品牌',
                                editable: false,
                                queryMode: 'local',
                                valueField: 'id',
                                displayField: 'name',
                                emptyText: '请选择',
                                allowBlank: false,
                                store: brandListStore
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType: 'textfield',
                        itemId: 'c_money',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '满足条件',
                                name: 'priceBegin',
                                itemId: 'priceBegin',
                                allowBlank: false,
                                vtype: 'Number',
                                emptyText: '开始金额',
                                maxLength: 10,
                                flex: 5
                            },
                            {
                                xtype: 'container',
                                flex: 3,
                                html: '<span class="x-form-item-label" style="text-align:center">&lt;=订单总额&lt;=</span>'
                            },
                            {
                                xtype: 'textfield',
                                name: 'priceEnd',
                                itemId: 'priceEnd',
                                allowBlank: false,
                                vtype: 'Number',
                                emptyText: '结束金额',
                                maxLength: 10,
                                flex: 4,
                                validator: function (v) {
                                    var priceBeginVal = this.up('form').down('[itemId=priceBegin]').getValue();
                                    if (parseInt(v) > parseInt(priceBeginVal)) {
                                        return true;
                                    }
                                    return '结束金额必须大于开始金额';
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType: 'radiofield',
                        fieldLabel: '是否启用',
                        defaults: {
                            flex: 1
                        },
                        items: [
                            {
                                boxLabel: '是',
                                name: 'inUse',
                                inputValue: 1,
                                itemId: 'inUseYes',
                                checked: true
                            },
                            {
                                boxLabel: '否',
                                name: 'inUse',
                                itemId: 'inUseNo',
                                inputValue: 0
                            }
                        ]
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
