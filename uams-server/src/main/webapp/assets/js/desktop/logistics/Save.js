/**
 * 保存物流
 * Created by HuaLei.Du on 13-12-27.
 */
Ext.define('EBDesktop.logistics.Save', {
    extend: 'Ext.window.Window',
    alias: 'widget.logisticsSave',
    title: '修改物流',
    id: 'logisticsSave',
    modal: true,
    closeAction: 'destroy',
    autoShow: false,
    constrain: true,
    layout: 'fit',
    width: 400,
    height: 230,
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
                Ext.getCmp('logisticsSave').close();
                Ext.getCmp('logisticsGrid').getStore().load();
            });
        }

        this.items = [
            Ext.create('Ext.form.Panel', {
                id: 'logisticsSaveForm',
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
                        xtype: 'combo',
                        fieldLabel: '物流公司',
                        name: 'name',
                        itemId: 'name',
                        allowBlank: false,
                        blankText: '不能为空',
                        queryMode: 'local',
                        editable: false,
                        emptyText: '请选择',
                        store: Espide.Common.expressStore()
                    },
                    {
                        fieldLabel: '物流面单',
                        xtype: 'filefield',
                        name: 'file',
                        buttonText: '选择物流面单',
                        regex: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,
                        regexText: '只允许上传图片，请检查您的文件格式!'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '递增数',
                        name: 'law',
                        allowBlank: false,
                        blankText: '不能为空',
                        value: 1,
                        minValue: 1,
                        validator: function (v) {
                            if (!/^[1-9]\d*$/.test(v)) {
                                return '只能为整数，且必须大于0';
                            }
                            return true;
                        }
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