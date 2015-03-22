/**
 * Created by king on 13-12-17
 */

Ext.define('Supplier.controller.Order', {
    extend: 'Ext.app.Controller',
    views: ['Order', 'Search', 'List', 'Item', 'Batch', 'AutoNumber'],
    stores: ['OrderList', 'ItemList', 'StorageAll', 'ShopAll'],
    models: ['OrderList', 'ItemList'],
    init: function () {
        this.control({

            //1-表格操作
            "#list": {

                //order表格有选择项则把底部商品表格显示
                selectionchange: function (sm, records) {
                    var root = this,
                        record = records[records.length - 1];
                    if (record && records.length===1) {
                        root.getOrderGood(record.get('id'));
                        Ext.getCmp('orderItem').show();
                    } else {
                        Ext.getCmp('orderItem').hide();
                    }
                },

                //在表格渲染后跟据用户的自定义重新加载列顺序
                afterrender: function (grid) {
                    var root = this,
                        com = Espide.Common,
                        store = grid.getStore(),
                        columns = com.getGridColumnData(grid, '/assets/js/order/data/UserConfig.json');

                    store.getProxy().extraParams = Ext.getCmp('search').getValues();
                    columns = columns ? com.sortGridHead(grid, columns) : columns;
                    columns && columns.length > 0 && grid.reconfigure(store, columns);
                    Ext.Function.defer(function () {
                        //store.getProxy().extraParams = {};
                    }, 700)

                },

                //用户移到列顺序时保存数据addNum
                columnmove: function (ct, column, fromIdx, toIdx, eOpts) {
                    Espide.Common.saveGridColumnsData(ct.getGridColumns(), fromIdx, toIdx, '/assets/js/order/data/UserConfig.json', 'OrderList');
                },

                //判断是否可以编辑
                beforeedit: function (editor, e) {
                    if (e.record.get('orderStatus') != "WAIT_PROCESS") return false;
                }
            },

            "#item": {
                //判断是否可以编辑
                beforeedit: function (editor, e) {
                    if (Espide.Common.getGridSels('OrderList', 'orderStatus')[0] != "WAIT_PROCESS") return false;
                }
            },

            //1.1-订单对应商品删除
            "#item actioncolumn#goodRemove": {
                click: function (button, rowIndex, colIndex, item, e, selected) {
                    var itemStore = Ext.getCmp('orderItem').getStore();

                    if (itemStore.count()===1){
                        Ext.MessageBox.show({
                            title: '警告',
                            msg: '请至少保留一个商品',
                            buttons: Ext.MessageBox.OK,
                            icon: 'x-message-box-error'
                        });
                        return;
                    }
                    if (selected) {
                        Ext.Msg.confirm('操作确认', '确定要删除这项商品吗？', function (optional) {
                            if (optional == "yes") {
                                itemStore.remove(selected);
                            }
                        });
                    }
                }
            },

            //2-表格toobar

            //2.0.1-搜索订单
            "#search #confirmBtn": {
                click: function () {
                    var com = Espide.Common,
                        startDate = Ext.getCmp('search').down('#startDate').getValue(),
                        endDate = Ext.getCmp('search').down('#endDate').getValue();


                    if (Ext.getCmp('search').down('#dateType').getValue() != 'all' && !!startDate && !!endDate  && startDate.getTime && endDate.getTime && endDate.getTime()<startDate.getTime()){
                        Ext.MessageBox.show({
                            title: '警告',
                            msg: '搜索条件的结束日期必须大于开始日期! ',
                            buttons: Ext.MessageBox.OK,
                            icon: 'x-message-box-error'
                        });
                        return;
                    }
                    com.doFormCheck(Ext.getCmp('search').getForm(), function (){
                        com.reLoadGird('OrderList', 'search', true);
                        Ext.getCmp('orderItem').hide();
                    }, '请正确输入要搜索的信息!')
                }
            },

            //2.0.2-条件搜索
            "#search #querySelect": {
                change: function (that, newValue, oldValue, eOpts) {
                    var queryType = Ext.getCmp('search').down("#queryType"),
                        type = that.getStore().getById(newValue).get('type');
                    if (type === 'string') {
                        queryType.setValue('has');
                    } else if (type === "number") {
                        queryType.setValue('=');

                    }
                }
            },

            //2.0.2-条件搜索
            "#search #querySelect2": {
                change: function (that, newValue, oldValue, eOpts) {
                    var queryType = Ext.getCmp('search').down("#queryType2"),
                        type = that.getStore().getById(newValue).get('type');
                    if (type === 'string') {
                        queryType.setValue('has');
                    } else if (type === "number") {
                        queryType.setValue('=');

                    }
                }
            },

            //2.0.3-条件搜索类型
            "#search #queryType": {
                beforeselect: function (combo, record, index, eOpts) {
                    var type = record.get('type'),
                        querySelect = Ext.getCmp('search').down("#querySelect"),
                        querySelectType = querySelect.getStore().getById(querySelect.getValue()).get('type');

                    if (type != 'all' && type != querySelectType) {
                        Ext.Msg.alert('警告', '您请选的查询对象不支持所选值类型，请换一种试试');
                        return false;
                    }
                }
            },

            //2.0.3-条件搜索类型
            "#search #queryType2": {
                beforeselect: function (combo, record, index, eOpts) {
                    var type = record.get('type'),
                        querySelect = Ext.getCmp('search').down("#querySelect2"),
                        querySelectType = querySelect.getStore().getById(querySelect.getValue()).get('type');

                    if (type != 'all' && type != querySelectType) {
                        Ext.Msg.alert('警告', '您请选的查询对象不支持所选值类型，请换一种试试');
                        return false;
                    }
                }
            },

            //日期类型
            "#search #dateType": {
                change: function (combo, newValue){
                    var startDate = combo.up('#search').down("#startDate"),
                        endDate = combo.up('#search').down('#endDate');

                    if (newValue === 'all'){
                        startDate.disable();
                        endDate.disable();
                    }else{
                        startDate.enable();
                        endDate.enable();
                    }
                }
            },

            //2.1-拆分订单
            "#splitOrderBtn": {
                click: function () {
                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList', '请至少选择一项订单'))  return;

                    if (!root.checkOrderState('OrderList')) return;

                    if (!com.checkGridSel('orderItem', '选至少选择一件商品'))  return;

                    if (Ext.getCmp('orderItem').getStore().getCount() === com.getGridSelsId('orderItem').length) {
                        Ext.Msg.alert({
                            title: '警告！',
                            msg: '您的操作有误，请检查选择的商品数量是否正确',
                            icon: Ext.Msg.WARNING,
                            buttons: Ext.Msg.YES
                        });
                        return;
                    }

                    //先弹出操作确认警告，再概据用户交互做回调
                    com.commonMsg({
                        msg: '你确定要拆分订单吗，拆分后不可复原!',
                        fn: com.doAction({
                            url: 'order/orderSeparate',
                            params: {
                                orderNo: com.getGridSels('OrderList', 'orderNo')[0],
                                ids: com.getGridSelsId('orderItem').join(',')
                            },
                            successCall: function (data) {
                                root.orderComCallback();
                                Ext.Msg.show({
                                    title: '拆分成功',
                                    msg: data.msg,
                                    buttons: Ext.Msg.YES
                                });
                            }
                        })
                    });

                }
            },

            //2.2-合并订单
            "#mergerOrderBtn": {
                click: function () {
                    var root = this,
                        com = Espide.Common,
                        OrderList = Ext.getCmp('OrderList'),
                        sels = com.getGridSelsId(OrderList);

                    if (sels.length < 2) {
                        com.showGridSelErr('请至少选择两个订单来合并');
                        return;
                    }

                    if (!root.checkOrderState('OrderList')) return;


                    //此项过滤条件暂时不用
                    //if (!com.isArrAllEqual(sels)) {
                    //    com.showGridSelErr('要合并的订单的物流编号必须相同');
                    //    return;
                    //}

                    //先弹出操作确认警告，再概据用户交互做回调
                    com.commonMsg({
                        msg: '你确定要合并订单吗，合并后不可复原!',
                        fn: com.doAction({
                            url: 'order/merge',
                            params: {
                                orderIds: sels.join(',')
                            },
                            successTipMsg: '订单合并成功',
                            successCall: root.orderComCallback
                        })
                    });
                }
            },

            //2.2-订单作废
            "#cancelOrder": {
                click: function () {
                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList')) return;

                    //if (!root.checkOrderState('OrderList')) return;

                    com.commonMsg({
                        msg: '您确定要作废此订单?',
                        fn: function (action) {
                            root.comchangeOrderState('/order/orderCancellation')(action);
                        }
                    })
                }
            },

            //2.2.1-订单恢复
            "#recoverOrder": {
                click: function () {
                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList')) return;

                    if (!root.checkOrderState('OrderList', 'INVALID')) return;

                    com.commonMsg({
                        msg: '您确定要恢复此订单?',
                        fn: function (action) {
                            root.comchangeOrderState('/order/orderRecover')(action);
                        }
                    })
                }
            },

            //2.3-批量删除订单
            "#batDelete": {
                click: function () {
                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList', '请至少选择一项订单'))  return;

                    if (!root.checkOrderState('OrderList')) return;


                    //先弹出操作确认警告，再概据用户交互做回调
                    com.commonMsg({
                        msg: '你确定要删除订单吗，删除订单后不可复原!',
                        fn: com.doAction({
                            url: '/order/delete',
                            params: {
                                orderIds: com.getGridSelsId('OrderList').join(',')
                            },
                            successTipMsg: '订单删除成功',
                            successCall: root.orderComCallback
                        })
                    });
                }
            },

            //2.4-批量改状态
            "#batEditState": {
                click: function () {

                    if (!Espide.Common.checkGridSel('OrderList', '请至少选择一项订单'))  return;

                    if (!this.checkOrderState('OrderList')) return;


                    //如果"批量改状态"视图已绘制就返回
                    if (Ext.getCmp('batchStateWin')) return false;

                    Ext.widget('batchState').show();
                }
            },

            //2.5-批量改状态确定按钮
            "#batchStateWin #comfirm": {
                click: function (btn) {
                    var com = Espide.Common,
                        params = btn.up('form').getValues();

                    if (com.isEmptyObj(params)) {
                        Ext.Msg.show({
                            title: '错误',
                            msg: "请至少选择一项状态",
                            buttons: Ext.Msg.YES,
                            icon: Ext.Msg.WARNING
                        });
                        return;
                    }

                    params['orderIds'] = com.getGridSelsId('OrderList').join(',');
                    com.commonMsg({
                        msg: '你确定要批量修改订单吗，修改订单后不可复原!',
                        fn: com.doAction({
                            url: '/order/updateStautsByOrder',
                            params: params,
                            successTipMsg: '订单批量修改成功',
                            successCall: function () {
                                com.reLoadGird('OrderList', false, false);
                                //Ext.getCmp('orderItem').hide();
                                Ext.getCmp('batchStateWin').destroy();
                            }
                        })
                    });
                }
            },

            //2.6-批量改状态取消按钮
            "#batchStateWin #cancel": {
                click: function () {
                    Ext.getCmp('batchStateWin').destroy();
                }
            },

            //2.7-弹出联想单号窗口
            "#autoEditNum": {
                click: function () {

                    if (!Espide.Common.checkGridSel('OrderList', '请至少选择一项订单'))  return;

                    if (!root.checkOrderState('OrderList')) return;


                    //如果"联想单号"视图已绘制就返回
                    if (Ext.getCmp('autoNumberWin')) return;

                    Ext.widget('autoNumber').show();
                }
            },

            //2.8-联想单号确定按钮
            "#autoNumberWin #comfirm": {
                click: function (btn) {
                    var com = Espide.Common,
                        params = btn.up('form').getValues();

                    if (!btn.up('form').isValid()) return;

                    if (params.shippingComp === "shunfeng" && !/^\d{12}$/.test(params.intNo)) {
                        Ext.Msg.alert('警告', "顺丰物流单号必须是12位的数字");
                        btn.up('form').down('[name=intNo]').focus();
                        return false;
                    } else if (params.shippingComp === "ems" && !/^\d{13}$/.test(params.intNo)) {
                        Ext.Msg.alert('警告', "EMS物流单号必须是13位的数字或数字");
                        btn.up('form').down('[name=intNo]').focus();
                        return false;
                    }

                    params['orderIds'] = com.getGridSelsId('OrderList').join(',');

                    com.commonMsg({
                        msg: '你确定要联想单号吗，修改订单后不可复原!',
                        fn: com.doAction({
                            url: '/order/updateShipping',
                            params: params,
                            successTipMsg: '联想单号成功',
                            successCall: function () {
                                com.reLoadGird('OrderList', false, true);
                                Ext.getCmp('orderItem').hide();
                                Ext.getCmp('autoNumberWin').destroy();
                            }
                        })
                    });
                }
            },

            //2.9-联想单号取消按钮
            "#autoNumberWin #cancel": {
                click: function () {
                    Ext.getCmp('autoNumberWin').destroy();
                }
            },

            //2.10-导入进销存
            "#importOrder": {
                click: function () {
                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList', '请至少选择一项订单'))  return;

                    if (!root.checkOrderState('OrderList')) return;

                    if (!com.hasEmpytData(com.getGridSels('OrderList', 'shippingComp'))) {
                        Ext.Msg.alert({
                            title: '警告！',
                            msg: '选中的订单中含有没有指派物流公司的订单，请指定后再导入',
                            icon: Ext.Msg.WARNING,
                            buttons: Ext.Msg.YES
                        });
                        return;
                    }

                    root.comchangeOrderState('/order/orderConfirm')('yes');
                }
            },

            //2.11-标记打印
            "#signPrinter": {
                click: function () {
                    var flag = true,
                        root = this,
                        com = Espide.Common,
                        shippingNums = com.getGridSels('OrderList', 'shipping_no') || [];

                    if (shippingNums.length === 0) {
                        Ext.Msg.alert('警告', '请至少选择一项订单');
                    }

                    if (!root.checkOrderState('OrderList')) return;


                    Ext.each(shippingNums, function (num, index, nums) {
                        if (Espide.Common.isEmptyData(num)) {
                            return flag = false;
                        }
                    });

                    if (!flag) {
                        Ext.Msg.alert('警告', '请修正没有写入订单编号的订单再提交');
                    } else {
                        com.commonMsg({
                            msg: '你确定要标记打印这些订单吗?',
                            fn: com.doAction({
                                url: '/assets/js/order/data/orderList.json',
                                params: {
                                    orderIds: com.getGridSelsId('OrderList').join(',')
                                },
                                successTipMsg: '订单标记成功',
                                successCall: root.orderComCallback
                            })
                        })
                    }
                }
            },

            //2.12-给订单增加商品
            "#addGood": {
                click: function () {

                    var com = Espide.Common,
                        sels = com.getGridSels('OrderList', 'repoId');

                    if (!com.checkGridSel('OrderList', '请至少选择一项订单'))  return;

                    if (sels.length>1 && !com.isArrAllEqual(sels)) {
                        Ext.MessageBox.show({
                            title: '警告',
                            msg: '选中的订单来自不同的仓库，不能批量加入商品!',
                            buttons: Ext.MessageBox.OK,
                            icon: 'x-message-box-error'
                        });
                        return;
                    }

                    if (!this.checkOrderState('OrderList')) return;

                    if (Ext.getCmp('addGoodWin')) return;

                    Ext.widget('addGood').show();
                }
            },

            //2.13-加订单
            "#addOrder": {
                click: function () {
                    if (Ext.getCmp('addOrderWin')) return;
                    Ext.widget('addOrder').show();
                }
            },

            //2.14-复制订单
            "#copyOrder": {
                click: function () {

                    var root = this,
                        com = Espide.Common,
                        records = Ext.getCmp('OrderList').getSelectionModel().getSelection();

                    if (!com.checkGridSel('OrderList', '请至少选择一项订单'))  return;

                    if (records.length > 1) {
                        Ext.Msg.alert({
                            title: '警告！',
                            msg: '只能选中一项订单进行复制作',
                            icon: Ext.Msg.WARNING,
                            buttons: Ext.Msg.YES
                        });
                        return;
                    }

                    if (Ext.getCmp('addOrderWin')) return;

                    Ext.widget('addOrder').show();

                    Ext.getCmp('orderInfo').getForm().loadRecord(records[0]);

                    function loadOrderItem() {
                        var records = Ext.getCmp('orderItem').getStore().data.items;
                        if (records.length > 0) {
                            var newRecords = [];
                            Ext.each(records, function (item, index, items) {
                                newRecords.push(item.data);
                            });
                            Ext.getCmp('goodCart').getStore().loadData(newRecords);
                        }
                    }

                    loadOrderItem();
                }
            },

            //2.15-汇总订单
            "#orderCollect": {
                click: function () {

                }
            },

            //2.16-刷新
            "#orderRefresh": {
                click: function () {
                    Espide.Common.reLoadGird('OrderList', false, false);
                }
            }
        });
    },

    //订单页通用操作
    /**
     * 根据某一字段取出订单对应商品信息
     * @param fld {String} 字段名
     */
    getOrderGood: function (fld) {
        var store = Ext.getCmp('orderItem').getStore();
        store.load({
            params: {
                orderIds: fld
            }
        });
    },

    /**
     * 订单页通用操作回调函数
     */
    orderComCallback: function () {
        Espide.Common.reLoadGird('OrderList', false, false);
        Ext.getCmp('orderItem').getStore().reload();
    },

    checkOrderState: function (grid, state) {
        state = state || 'WAIT_PROCESS';
        var com = Espide.Common,
            orderStates = com.getGridSels(grid, 'orderStatus'),
            msg = {
                WAIT_PROCESS: '待处理',
                INVALID: '已做废'
            };
        if (!(com.isArrAllEqual(orderStates) && orderStates[0] === state )) {
            Ext.Msg.alert({
                title: '警告！',
                msg: '选中的订单中含有非' + msg[state] + '状态的订单，请重请选择',
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.YES
            });
            return false;
        }
        return true;
    },

    //通用修改订单状态
    comchangeOrderState: function (url) {
        var com = Espide.Common;
        return com.doAction({
            url: url,
            params: {
                orderIds: com.getGridSelsId('OrderList').join(',')
            },
            successTipMsg: '状态修改成功',
            successCall: this.orderComCallback
        })
    },
});