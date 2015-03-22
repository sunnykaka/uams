/**
 * 品牌优惠活动 - 保存
 * Created by HuaLei.Du on 13-12-30.
 */
Ext.define('EBDesktop.gift.BrandSave', {
    extend: 'Ext.window.Window',
    alias: 'widget.giftBrandSave',
    title: '添加品牌活动',
    id: 'giftBrandSave',
    modal: true,
    closeAction: 'destroy',
    autoShow: false,
    constrain: true,
    //layout: 'fit',
    width: 740,
    height: 508,
    initComponent: function () {

        Ext.tip.QuickTipManager.init();

        // 保存表单
        function saveForm(btn) {
            var form = Ext.getCmp('giftBrandForm'),
                brandGoodsCartStore = Ext.getCmp('giftBrandGoodsCartGrid').getStore(),
                giftProdId = [],
                giftProdCount = [],
                options = {
                    url: form.down('[itemId=action]').getValue()
                };

            if (brandGoodsCartStore.data.items.length > 0) {
                brandGoodsCartStore.each(function (records, index) {
                    giftProdId.push(records.get('prodId'));
                    giftProdCount.push(records.get('giftProdCount'));
                });
            }

            if (giftProdId.length < 1) {
                Ext.Msg.alert('提示', '你还没有添加赠品哦~');
                return;
            }

            form.down('[itemId=giftProdId]').setValue(giftProdId);
            form.down('[itemId=giftProdCount]').setValue(giftProdCount);

            console.log(giftProdId.length);
            console.log(giftProdId);
            console.log(giftProdCount);
            console.log(form.getValues());

            Espide.Common.submitForm(form, options, function () {
                Ext.getCmp('giftBrandSave').close();
                Espide.Common.reLoadGird('giftBrandActivityGrid', false, true);
            });
        }

        this.items = [
            {
                region: 'north',
                xtype: 'giftBrandForm'
            },
            {
                region: 'center',
                height: 204,
                xtype: 'giftBrandGoods'
            },
            {
                region: 'south',
                height: 150,
                xtype: 'giftBrandGoodsCart'
            }
        ];

        this.buttons = {
            layout: {
                pack: 'center'
            },
            items: [
                {
                    text: '确定',
                    handler: saveForm
                },
                {
                    text: '取消',
                    handler: function () {
                        Ext.getCmp('giftBrandSave').close();
                    }
                }
            ]
        };

        this.callParent(arguments);
    }
});