/**
 * 商品优惠活动 - 修改
 * Created by HuaLei.Du on 14-1-7.
 */
Ext.define('EBDesktop.gift.GoodsActivityEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.giftGoodsActivityEdit',
    title: '修改商品活动',
    id: 'giftGoodsActivityEdit',
    modal: true,
    closeAction: 'destroy',
    autoShow: false,
    constrain: true,
    layout: 'fit',
    width: 500,
    height: 220,
    initComponent: function () {

        Ext.tip.QuickTipManager.init();

        // 保存表单
        function saveForm(btn) {
            var formEle = btn.up('form'),
                form = formEle.getForm(),
                options = {
                    url: '/giftProd/update'
                };

            Espide.Common.submitForm(form, options, function () {
                Ext.getCmp('giftGoodsActivityEdit').close();
                Espide.Common.reLoadGird('giftGoodsActivityGrid', false, true);
            });
        }

        var giftProdListStore = Espide.Common.createComboStore('/giftProd/giftProdIdName', true, ['giftProdId', 'giftProdName']);


        this.items = [
            Ext.create('Ext.form.Panel', {
                id: 'giftGoodsActivityEditForm',
                forceFit: true,
                border: false,
                layout: 'form',
                bodyPadding: '5 5 0',
                requires: ['Ext.form.field.Text'],
                fieldDefaults: {
                    msgTarget: 'side',
                    labelWidth: 90
                },
                height: 'auto',
                defaultType: 'fieldcontainer',
                items: [
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
                                name: 'sellProdId',
                                itemId: 'sellProdId',
                                hidden: true
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                defaultType: 'textfield',
                                items: [
                                    {
                                        flex: 1,
                                        xtype: 'textfield',
                                        name: 'sellProdName',
                                        disabled: true,
                                        itemId: 'sellProdName',
                                        fieldLabel: '购买的商品',
                                        allowBlank: false
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                defaultType: 'combo',
                                items: [
                                    {
                                        flex: 1,
                                        name: 'giftProdId',
                                        itemId: 'giftProdId',
                                        fieldLabel: '赠送的商品',
                                        editable: false,
                                        queryMode: 'local',
                                        valueField: 'giftProdId',
                                        displayField: 'giftProdName',
                                        emptyText: '请选择',
                                        allowBlank: false,
                                        store: giftProdListStore
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                defaultType: 'textfield',
                                items: [
                                    {
                                        flex: 1,
                                        xtype: 'numberfield',
                                        name: 'giftProdCount',
                                        itemId: 'giftProdCount',
                                        fieldLabel: '赠送数量',
                                        allowBlank: false,
                                        value: 1,
                                        maxValue: 999,
                                        minValue: 1,
                                        validator: function (v) {
                                            if (!/^[1-9]\d*$/.test(v)) {
                                                return '只能为整数，且必须大于0';
                                            }
                                            return true;
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
                ],
                buttons: [
                    {
                        text: '保存',
                        itemId: 'saveBtn',
                        handler: saveForm
                    }
                ]
            })
        ];

        this.callParent(arguments);
    }
});