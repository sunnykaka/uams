/**
 * 商品优惠活动 - 添加表单
 * Created by HuaLei.Du on 14-1-7.
 */
Ext.define('EBDesktop.gift.GoodsActivityAddForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.giftGoodsActivityAddForm',
    id: 'giftGoodsActivityAddForm',
    forceFit: true,
    border: false,
    region: 'south',
    layout: 'form',
    bodyPadding: '5 5 0',
    requires: ['Ext.form.field.Text'],
    fieldDefaults: {
        msgTarget: 'side',
        labelWidth: 90
    },
    height: 140,
    defaultType: 'fieldcontainer',
    initComponent: function () {

        Ext.tip.QuickTipManager.init();

        // 保存表单
        function saveForm(btn) {
            var formEle = btn.up('form'),
                form = formEle.getForm(),
                options = {
                    url: '/giftProd/add'
                };

            Espide.Common.submitForm(form, options, function () {
                Ext.getCmp('giftGoodsActivityAdd').close();
                Ext.getCmp('giftGoodsActivityGrid').getStore().load();
            });
        }

        var giftProdListStore = Espide.Common.createComboStore('/giftProd/giftProdIdName', true, ['giftProdId', 'giftProdName']);

        this.items = [
            {
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'sellProdIds',
                        itemId: 'sellProdIds',
                        hidden: true
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
                                    return true
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

        this.buttons = [
            {
                text: '保存',
                itemId: 'saveBtn',
                handler: function (btn) {
                    var ids = Espide.Common.getGridSels('giftGoodsListGrid', 'id');

                    if (ids.length < 1) {
                        Espide.Common.showGridSelErr('最少需要选择一个商品');
                        return;
                    }

                    this.up('form').down('[itemId=sellProdIds]').setValue(ids.join());
                    saveForm(btn);
                }
            }
        ];

        this.callParent(arguments);
    }
});