/**
 * 添加仓库
 * Created by HuaLei.Du on 13-12-19.
 */
Ext.define('EBDesktop.warehouse.Save', {
    extend: 'Ext.window.Window',
    alias: 'widget.warehouseSave',
    title: '添加仓库',
    id: 'warehouseSave',
    modal: true,
    closeAction: 'destroy',
    autoShow: false,
    constrain: true,
    layout: 'fit',
    width: 500,
    height: 300,
    initComponent: function () {

        Ext.tip.QuickTipManager.init();

        // 保存表单
        function saveForm(btn) {
            var formEle = btn.up('form'),
                form = formEle.getForm(),
                options = {
                    url: formEle.down('[itemId=action]').getValue()
                };

            Espide.Common.submitForm(form, options, function () {
                Ext.getCmp('warehouseSave').close();
                Ext.getCmp('warehouseGrid').getStore().load();
            });
        }

        this.items = [
            Ext.create('Ext.form.Panel', {
                id: 'warehouseSaveForm',
                forceFit: true,
                border: false,
                layout: 'form',
                header: false,
                frame: false,
                bodyPadding: '5 5 0',
                requires: ['Ext.form.field.Text'],
                fieldDefaults: {
                    msgTarget: 'side',
                    labelWidth: 75
                },
                defaultType: 'textfield',
                items: [
                    {
                        fieldLabel: 'id',
                        name: 'id',
                        itemId: 'id',
                        hidden: true
                    },
                    {
                        fieldLabel: 'action',
                        name: 'action',
                        itemId: 'action',
                        hidden: true
                    },
                    {
                        fieldLabel: '仓库名称',
                        name: 'name',
                        itemId: 'name',
                        allowBlank: false,
                        blankText: '不能为空',
                        validator: function (v) {

                            if (!/(^\S+.*\S+$)|(^\S{1}$)/.test(v)) {
                                return '格式不对，前后不能包含空格';
                            }

                            if (v.replace(/[^\x00-\xff]/g, "rr").length <= 50) {
                                return true;
                            }

                            return '仓库名称不能多于50个字符';
                        }
                    },
                    {
                        fieldLabel: '仓库编码',
                        name: 'repoCode',
                        itemId: 'repoCode',
                        allowBlank: false,
                        blankText: '不能为空',
                        validator: function (v) {

                            if (!/^[A-Za-z0-9]*$/.test(v)) {
                                return '仓库编码只能为字母和数字';
                            }

                            if (v.replace(/[^\x00-\xff]/g, "rr").length <= 16) {
                                return true;
                            }

                            return '仓库编码不能多于16个字符';
                        }
                    },
                    {
                        fieldLabel: '地址',
                        name: 'address',
                        itemId: 'address',
                        allowBlank: false,
                        blankText: '不能为空',
                        validator: function (v) {

                            if (v.replace(/[^\x00-\xff]/g, "rr").length <= 200) {
                                return true;
                            }

                            return '地址不能多于200个字符';
                        }
                    },
                    {
                        fieldLabel: '联系人',
                        name: 'chargePerson',
                        itemId: 'chargePerson',
                        allowBlank: false,
                        blankText: '不能为空',
                        validator: function (v) {

                            if (v.replace(/[^\x00-\xff]/g, "rr").length <= 20) {
                                return true;
                            }

                            return '联系人不能多于20个字符';
                        }
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '物流公司',
                        name: 'shippingComp',
                        itemId: 'shippingComp',
                        allowBlank: false,
                        blankText: '不能为空',
                        queryMode: 'local',
                        editable: false,
                        emptyText: '请选择',
                        store: Espide.Common.expressStore()
                    },
                    {
                        fieldLabel: '电话',
                        name: 'chargePhone',
                        itemId: 'chargePhone',
                        emptyText: '格式：0755-88888888',
                        vtype: 'Phone'
                    },
                    {
                        fieldLabel: '手机',
                        name: 'chargeMobile',
                        itemId: 'chargeMobile',
                        emptyText: '格式：13800138000',
                        vtype: 'Mobile'
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