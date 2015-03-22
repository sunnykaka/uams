/**
 * Created by king on 13-12-17
 */

Ext.define('Stock.controller.Stock', {
    extend: 'Ext.app.Controller',
    views: ['List'],
    stores: ['List'],
    models: ['List'],
    init: function () {
        this.control({
            '#stockListGrid': {
                edit: this.updateStockNumber
            },
            '#stockListSearch #searchBtn': {
                'click': function () {
                    Espide.Common.doSearch('stockListGrid', 'stockListSearch', true);
                }
            }
        });
    },

    // 更新库存数量
    updateStockNumber: function (editor, e) {
        var params = {},
            prodName = e.record.get('prodName'),
            originalValue = e.originalValue,
            msg;

        // 判断库存数量是否有变动
        if (originalValue == e.value) {
            return;
        }

        params.id = e.record.get('id');
        params[e.field] = e.value;

        msg = '您确定要修改商品名为 <strong style="color: red">' + prodName + '</strong> 的库存吗？' +
            '<br>原始库存为 <strong style="color: red">' + originalValue + '</strong> ' +
            '<br>修改后库存将变更为 <strong style="color: green">' + e.value + '</strong> ';

        // 执行更新操作前弹出确认提醒
        Ext.MessageBox.confirm('系统提示', msg, function (optional) {

            if (optional !== 'yes') {
                e.record.data.actuallyNumber = originalValue;
                Ext.getDom(e.row.cells[e.colIdx].firstChild.id).innerHTML = originalValue;
                return;
            }

            // 执行更新操作
            Ext.Ajax.request({
                url: '/storage/update',
                params: params,
                success: function (response) {
                    var data = Ext.decode(response.responseText);
                    if (data.success) {
                        Espide.Common.tipMsg('成功', '修改成功');
                    } else {
                        Ext.MessageBox.show({
                            title: '错误',
                            msg: data.msg,
                            buttons: Ext.Msg.YES,
                            icon: Ext.Msg.WARNING
                        });
                    }
                },
                failure: function () {
                    Ext.Msg.show({
                        title: '错误',
                        msg: '服务器错误，请重新提交!',
                        buttons: Ext.Msg.YES,
                        icon: Ext.Msg.WARNING
                    });
                }
            });
        });
    }

});