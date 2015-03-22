/**
 * Created by king on 13-12-17
 */
Ext.define('Supplier.controller.Order', {
    extend: 'Ext.app.Controller',
    views: ['Order', 'Search', 'List', 'Item', 'Batch', 'AutoNumber'],
    stores: ['OrderList', 'ItemList'],
    models: ['OrderList', 'ItemList'],
    init: function () {
        this.control({
            'viewport': {
                afterrender: this.checkIsInstallLODOP
            },
            //0-订单四种状态切换
            "#search button[belong=mainBtn]": {
                click: function (button) {
                    var id = button.getItemId(),
                        root = this,
                        orderGridToolBar = Ext.getCmp('search').getDockedItems('toolbar[dock="top"]')[0];

                    //切换一级菜单状态
                    Ext.each(orderGridToolBar.items.items, function (item, index, items) {
                        flag = (item === button);
                        item.setDisabled(flag);
                    });

                    //对应改变form中四个一级菜单影像的状态
                    root.setOrderState(id);

                    //对应切换二级菜单的状态
                    root.changeSubBtn(id);

                    //刷新订单grid数据
                    Espide.Common.reLoadGird('OrderList', 'search', true);

                }
            },

            //1-表格操作
            "#list": {
                //order表格有选择项则把底部商品表格显示
                selectionchange: function (sm, records) {
                    var root = this,
                        record = records[0];
                    if (record) {
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
                        columns = com.getGridColumnData(grid, '/assets/js/order/data/UserConfig.json', 'hasImport');
                    columns = columns ? com.sortGridHead(grid, columns) : columns;
                    columns && columns.length > 0 && grid.reconfigure(store, columns);
                },

                //用户移到列顺序时保存数据
                columnmove: function (ct, column, fromIdx, toIdx, eOpts) {
                    Espide.Common.saveGridColumnsData(ct.getGridColumns(), fromIdx, toIdx, '/assets/js/order/data/UserConfig.json', 'OrderList', 'hasImport');
                },

                //订单物流编号编辑
                validateedit: function (editor, e) {
                    if (e.originalValue == e.value) {
                        return false;
                    }
                    return this.checkShippingValue(e.record.get('shippingComp'), e.value)
                },
                //判断是否可以编辑
                beforeedit: function () {
                    if (this.getOrderState() != "CONFIRMED") return false;
                }
            },

            //2-表格toobar

            //返回客服处理
            "#goBack_0": {
                click: function () {
                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList')) return;

                    root.comchangeOrderState('/invoice/orderBackToWaitProcess')('yes');
                }
            },

            //订单汇总按钮
            "#orderSummary": {
                click: function () {
                    var url = '/orders/summary_report/excel?orderIds=' + Espide.Common.getGridSelsId('OrderList').join(',');
                    window.open(url);
                }
            },

            //打印物流单
            "#printPreview": {
                click: this.printPreview
            },

            //打印发货单
            "#printInvoice": {
                click: this.printInvoice
            },

            //2.7-弹出联想单号窗口
            "#autoEditNum": {
                click: function () {

                    var com = Espide.Common;

                    if (!com.checkGridSel('OrderList', '请至少选择一项订单'))  return;

                    if (!com.isArrAllEqual(com.getGridSels('OrderList', 'shippingComp'))) {
                        Ext.Msg.show({
                            title: '错误',
                            msg: "所选的订单对应的物流公司必须相同",
                            buttons: Ext.Msg.YES,
                            icon: Ext.Msg.WARNING
                        });
                        return;
                    }

                    //如果"联想单号"视图已绘制就返回
                    if (Ext.getCmp('autoNumberWin')) return;

                    Ext.widget('autoNumber').show();
                }
            },

            //2.8-联想单号确定按钮
            "#autoNumberWin #comfirm": {
                click: function (btn) {
                    var com = Espide.Common,
                        root = this,
                        params = btn.up('form').getValues();

                    if (!btn.up('form').isValid()) return;

                    if (!root.checkShippingValue(params.shippingComp, params.intNo)) return;

                    params['orderIds'] = com.getGridSelsId('OrderList').join(',');

                    com.commonMsg({
                        msg: '你确定要联想单号吗，修改订单后不可复原!',
                        fn: com.doAction({
                            url: '/invoice/updateShipping',
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

            //确认打印
            "#printLogistics": {
                click: function () {
                    var root = this,
                        com = Espide.Common,
                        selItems = com.getGridSels('OrderList', 'shippingNo');

                    if (!com.checkGridSel('OrderList')) return;

                    if (!com.hasEmpytData(selItems)) {
                        Ext.Msg.alert('警告', '选中订单中有数据还没有加物流编号');
                        return false;
                    }

                    root.comchangeOrderState('/invoice/orderAffirmPrint')('yes');

                }
            },

            //返回上一级1
            "#goBack_1": {
                click: function () {
                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList')) return;

                    root.comchangeOrderState('/invoice/orderBackToConfirm')('yes');

                }
            },


            //批量验货
            "#batchInspection": {
                click: function () {
                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList')) return;

                    root.comchangeOrderState('/invoice/orderBatchExamine')('yes');

                }
            },

            //弹出验货窗口
            "#inspection": {
                click: function () {
                    //if (!Espide.Common.checkGridSel('OrderList', '请至少选择一项订单'))  return;

                    //如果"验货"视图已绘制就返回
                    if (Ext.getCmp('examineGoodWin')) return;

                    Ext.widget('examineGood').show();
                }
            },

            //返回上一级2
            "#goBack_2": {
                click: function () {

                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList')) return;

                    root.comchangeOrderState('/invoice/orderBackToPrint')('yes');

                }
            },

            //确认发货
            "#confirmationDelivery": {
                click: function () {

                    var root = this,
                        com = Espide.Common;

                    if (!com.checkGridSel('OrderList')) return;

                    root.comchangeOrderState('/invoice/orderInvoice')('yes');

                }
            },

            //刷新
            "#refresh": {
                click: function () {
                    Espide.Common.reLoadGird('OrderList', false, true);
                }
            },

            //导出表格
            "#orderExport": {
                click: function () {
                    var searchFormVal = Ext.getCmp('search').getValues(),
                        day = new Date(),
                        dayFormat = day.getFullYear() + '-' + day.getMonth() + '-' + day.getDate();

                    window.open('/orders/excel-' + dayFormat + '.xls?' + Espide.Common.parseParam(searchFormVal));
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

    //获取当前订单管理的四种状态（待处理-已发货-待发货-物流状态）
    getOrderState: function () {
        return Ext.getCmp('orderState').getValue();
    },

    //设置当前订单管理的四种状态 （待处理-已发货-待发货-物流状态）
    setOrderState: function (value) {
        var orderState = Ext.getCmp('orderState');
        orderState.getStore().find('field1', value) == -1 || orderState.select(value);
        Ext.getCmp('OrderList').getStore().getProxy().extraParams = {
            orderStatus: value
        }
    },

    //二级菜单切换:belong:一级菜单id，state(obj):是否为改变状态
    changeSubBtn: function (belong, state) {
        var toolBar = Ext.getCmp('OrderList').getDockedItems('toolbar[dock="top"]')[0],
            buttons = toolBar.items.items;
        if (state == undefined) {
            Ext.each(buttons, function (item, buttons, index) {
                if (!item.belong) {
                    item.show();
                } else if (item.belong == belong) {
                    item.show();
                } else {
                    item.hide();
                }
            });
        } else {
            var flag = state.disabled;
            Ext.each(buttons, function (item, buttons, index) {
                item.belong == belong && !item.initShow && item.setDisabled(flag);
            });
        }

    },

    /**
     * 订单页通用操作回调函数
     */
    orderComCallback: function () {
        Espide.Common.reLoadGird('OrderList', false, true);
        Ext.getCmp('orderItem').hide();
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

    // 打印物流单
    printPreview: function () {
        var parent = this,
            selectedOrder = Ext.getCmp('OrderList').getSelectionModel().getSelection(),
            ids = [],
            isValidate = true,
            isValidateShippingNo = true,
            firstDelivery = '',
            delivery = '',
            shippingNo = '',
            designCode = '',
            printHtml;

        // 检验选中的订单配送方式是否相同
        Ext.each(selectedOrder, function (name, index) {
            delivery = selectedOrder[index].data.shippingComp;
            shippingNo = selectedOrder[index].data.shippingNo;

            if (index === 0) {
                firstDelivery = delivery;
            } else {
                if (firstDelivery !== delivery) {
                    isValidate = false;
                    return false;
                }
            }

            if (!shippingNo || shippingNo == '') {
                isValidateShippingNo = false;
                return false;
            }

            ids.push(selectedOrder[index].data.id);
        });

        if (ids.length < 1) {
            Ext.MessageBox.show({
                title: '提示',
                msg: '请先选择订单',
                buttons: Ext.MessageBox.OK,
                icon: 'x-message-box-error'
            });
            return;
        }

        if (!isValidate) {
            Ext.MessageBox.show({
                title: '提示',
                msg: '请选择相同的配送方式',
                buttons: Ext.MessageBox.OK,
                icon: 'x-message-box-error'
            });
            return;
        }

        if (!isValidateShippingNo) {
            Ext.MessageBox.show({
                title: '提示',
                msg: '所选择订单中有的没有设置物流单号，请先设置物流单号',
                buttons: Ext.MessageBox.OK,
                icon: 'x-message-box-error'
            });
            return;
        }

        parent.getLogisticsDeign(delivery, function (data) { // 获取物流单设计代码
            designCode = data;

            if (data.split(';').length < 5) {
                Ext.MessageBox.show({
                    title: '提示',
                    msg: '快递公司的物流面单还没有设计',
                    buttons: Ext.MessageBox.OK,
                    icon: 'x-message-box-error'
                });
                return;
            }

            var msgText = '服务器错误';
            if (designCode === 'error' || designCode === 500) {

                if (designCode === 'error') {
                    msgText = '所选的配送方式单面设计未找到';
                }

                Ext.MessageBox.show({
                    title: '提示',
                    msg: msgText,
                    buttons: Ext.MessageBox.OK,
                    icon: 'x-message-box-error'
                });
                return;
            }

            Ext.MessageBox.show({
                title: '提示',
                msg: '打印控件正在运行...',
                width: 300
            });

            parent.getOrderPrintInfo(ids.join(), function (data) { // 获取物流信息列表
                var dataList = data.data.list;

                if (dataList.length > 0) {
                    LODOP = getLodop(document.getElementById('LODOP1'), document.getElementById('LODOP_EM1'));
                    LODOP.PRINT_INIT("打印物流单");
                    LODOP.PRINT_INITA(0, 0, 1000, 600, "初始化打印控件");
                    for (var i = 0; i < dataList.length; i++) {
                        LODOP.NewPage();
                        printHtml = parent.replaceAllHtml(designCode, dataList[i]);
                        eval(printHtml);
                    }
                    //LODOP.SET_PRINT_MODE("POS_BASEON_PAPER", true); // 输出以纸张边缘为基点
                    LODOP.SET_PRINT_STYLE("FontSize", 14);
                    LODOP.SET_PRINT_PAGESIZE(0, "2100", "1480", "CreateCustomPage");
                    LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", 1);
                    LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW", 1); // 在打印预览时内含背景图（当然实际打印时不输出背景图）
                    LODOP.PREVIEW();
                    Ext.MessageBox.hide();
                }

            });
        });
    },

    /// 获取到物流单设计
    getLogisticsDeign: function (delivery, callback) {
        var url = '/delivery/print_html';
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            params: {
                name: delivery
            },
            success: function (response) {
                var data = Ext.JSON.decode(response.responseText);
                if (data.success) {
                    callback(data.data.obj);
                } else {
                    callback('error');
                }
            },
            failure: function () {
                callback(500);
            }
        });
    },

    // 获取物流信息列表
    getOrderPrintInfo: function (ids, callback) {
        var url = '/invoice/deliveryPrint';
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {
                orderIds: ids
            },
            success: function (response) {
                var data = Ext.JSON.decode(response.responseText);
                if (typeof callback === 'function') {
                    callback(data);
                }
            }
        });
    },

    // 替换打印配置
    replaceAllHtml: function (html, data) {
        html = html.substr(html.indexOf(";") + 1, html.length);
        if (html.indexOf("收货人联系方式") > 0) {
            html = html.replace(new RegExp("收货人联系方式", "g"), (data.receiverMobile || '') + ' ' + (data.receiverPhone || ''));
        }
        if (html.indexOf("发货人联系方式") > 0) {
            html = html.replace(new RegExp("发货人联系方式", "g"), (data.chargeMobile || '') + '    /   ' + (data.chargePhone || ''));
        }
        if (html.indexOf("发货人单位名称") > 0) {
            html = html.replace(new RegExp("发货人单位名称", "g"), data.repoName); // todo 这里取的是仓库的名称
        }
        if (html.indexOf("邮编") > 0) {
            html = html.replace(new RegExp("邮编", "g"), data.receiverZip);
        }
        if (html.indexOf("发货地址") > 0) {
            html = html.replace(new RegExp("发货地址", "g"), data.repoAddress);
        }
        if (html.indexOf("收货人地址") > 0) {
            html = html.replace(new RegExp("收货人地址", "g"), data.receiverAddress);
        }
        if (html.indexOf("收货人") > 0) {
            html = html.replace(new RegExp("收货人", "g"), data.receiverName);
        }
        if (html.indexOf("发货人") > 0) {
            html = html.replace(new RegExp("发货人", "g"), data.chargePerson);
        }
        if (html.indexOf("收货市") > 0) {
            html = html.replace(new RegExp("收货市", "g"), data.receiverCity);
        }
        if (html.indexOf("发货时间") > 0) {
            var deliveryTime = data.deliveryTime;
            if (data.deliveryTime) {
                deliveryTime = new Date(deliveryTime);
                deliveryTime = Ext.Date.format(deliveryTime, 'Y-m-d H:i:s')
            }
            html = html.replace(new RegExp("发货时间", "g"), deliveryTime || '');
        }
        return html;
    },

    printInvoice: function () {
        var parent = this,
            url = '/invoice/orderPrint',
            ids = Espide.Common.getGridSels('OrderList', 'id');

        if (ids.length < 1) {
            Ext.MessageBox.show({
                title: '提示',
                msg: '请先选择订单',
                buttons: Ext.MessageBox.OK,
                icon: 'x-message-box-error'
            });
            return;
        }

        Ext.MessageBox.show({
            title: '提示',
            msg: '打印控件正在运行...',
            width: 300
        });

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {
                orderIds: ids.join(',')
            },
            success: function (response) {
                var data = Ext.JSON.decode(response.responseText),
                    style,
                    dataList;

                if (data.success) {
                    LODOP = getLodop(document.getElementById('LODOP1'), document.getElementById('LODOP_EM1'));
                    LODOP.PRINT_INIT("打印发货单");
                    style = parent.invoiceStyle();
                    dataList = data.data.list;
                    for (var i = 0; i < dataList.length; i++) {
                        parent.invoiceHtml(dataList[i], style, 1);
                    }
                    LODOP.SET_PRINT_PAGESIZE(0, '2100', '1450', 'CreateCustomPage'); // 设定纸张大小
                    LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); // 打印后自动关闭预览窗口
                    //LODOP.SET_PRINT_MODE("POS_BASEON_PAPER", true); // 输出以纸张边缘为基点
                    //加了这个代码后连打出现问题，选4单预览时只显示出来3单，后面2单还没有数据
                    LODOP.PREVIEW();
                    Ext.MessageBox.hide();
                } else {
                    Ext.MessageBox.show({
                        title: '提示',
                        msg: data.msg,
                        buttons: Ext.MessageBox.OK,
                        icon: 'x-message-box-error'
                    });
                }

            }
        });
    },

    // 发货单样式
    invoiceStyle: function () {
        return '<style type="text/css">' +
            '*{margin:0;padding:0}' +
            'table{border-collapse:collapse;border-spacing:0;}' +
            'body{font-size:14px;font-family:SimSun,SimHei,"microsoft yahei";line-height: 1.2em}' +
            '.print-wrapper{position:relative;height:430px;padding: 60px 0 0}' +
            '.table-order td{padding:2px 5px;}' +
            '.table-order th{width:70px;font-weight:400;text-align:left;padding:2px 5px 2px 0;}' +
            '.table-product{margin-top:10px;border-width:1px 0 0 1px;border-color:#999;border-style:solid;}' +
            '.table-product td,.table-product th{border-width:0 1px 1px 0;border-color:#999;' +
            '    border-style:solid;text-align:center;padding:5px;}' +
            '.total{text-align:right;padding:10px 0;}' +
            '.seller{position:absolute;width:90%;left:0;bottom:20px;}' +
            '.seller p{padding:2px 0;font-size:14px;}' +
            '</style>';
    },

    // 发货单模板
    invoiceTpl: function () {
        return new Ext.XTemplate(
            '<!DOCTYPE HTML>',
            '<html>',
            '<head>' ,
            '<meta charset="utf-8"/>' ,
            '#* style *#' ,
            '</head>',
            '<body>',
            '<div class="print-wrapper">',
            '   <table width="100%" class="table-order">',
            '       <tr>',
            '           <th>收 货 人：</th>',
            '           <td>{receiverName}</td>',
            '           <th>快递公司：</th>',
            '           <td style="width: 160px">{shippingComp}</td>',
            '       </tr>',
            '       <tr>',
            '           <th>联系方式：</th>',
            '           <td>{receiverMobile}, {receiverPhone}</td>',
            '           <th>快递单号：</th>',
            '           <td style="width: 160px">{shippingNo}</td>',
            '       </tr>',
            '   </table>',
            '   <table width="100%" class="table-order">',
            '       <tr>',
            '           <th>收货地址：</th>',
            '           <td>{receiverAddress}</td>',
            '       </tr>',
            '       <tr>',
            '           <th>买家留言：</th>',
            '           <td>{buyerMessage}</td>',
            '       </tr>',
            '   </table>',
            '   <table width="100%" class="table-product">',
            '   <thead>',
            '       <tr>',
            '           <th style="width:50px">序号</th>',
            '           <th style="width:75px">商品编号</th>',
            '           <th>商品名称</th>',
            '           <th style="width:75px">单价(元)</th>',
            '           <th style="width:50px">数量</th>',
            '           <th style="width:75px">金额(元)</th>',
            '       </tr>',
            '   </thead>',
            '   <tbody>',
            '   #* goodsList *#',
            '   </tbody>',
            '</table>',
            '   <div class="total">合计：￥：{finalTotalFee}元</div>',
            '   <div class="seller">',
            '       <p>订 单 号： {outOrderNo}</p>',
            '       <p>发 货 人： {chargePerson}</p>',
            '       <p>发货地址： {repoAddress}</p>',
            '       <p>卖家留言： {remark}</p>',
            '   </div>',
            '</div>',
            '</body>',
            '</html>'
        );
    },

    // 发货单HTML
    invoiceHtml: function (data, style, status) {
        var goodsList = data.orderItemPrintVos || [],
            newData = Ext.clone(data),
            index = 0,
            printTime = data.printTime || null,
            strFormHtml,
            goodsListHtml = '',
            shippingComp = data.shippingComp || null,
            i = (status - 1) * 3;

        if (printTime) {
            printTime = new Date(printTime);
            printTime = Ext.Date.format(printTime, 'Y-m-d H:i:s');
            newData.printTime = printTime;
        }

        if (shippingComp) {
            newData.shippingComp = Espide.Common.getExpress(shippingComp);
        }

        if (goodsList.length > 3 * status) {
            index = 3 * status;
        } else {
            index = goodsList.length;
        }

        for (; i < index; i++) {
            goodsListHtml += '<tr>' +
                '<td style="width: 50px">' + (i + 1) + '</td>' +
                '<td style="width: 75px">' + goodsList[i].prodCode + '</td>' +
                '<td>' + goodsList[i].prodName + ', 颜色：' + (goodsList[i].color || '') +
                ', 规格：' + (goodsList[i].speci || '') + '</td>' +
                '<td style="width: 75px">' + goodsList[i].prodPrice + '</td>' +
                '<td style="width: 50px">' + goodsList[i].prodCount + '</td>' +
                '<td style="width: 75px">' + goodsList[i].totalFee + '</td>' +
                '</tr>';
        }

        strFormHtml = this.invoiceTpl().apply(newData);
        strFormHtml = strFormHtml.replace('#* style *#', style);
        strFormHtml = strFormHtml.replace('#* goodsList *#', goodsListHtml);

        LODOP.NewPage();
        LODOP.ADD_PRINT_HTM('0.1mm', '10mm', 'RightMargin:10mm', 'BottomMargin:0.1mm', strFormHtml);
        //LODOP.ADD_PRINT_BARCODE(40, 516, 230, 47, '128Auto', data.orderNo);

        if (goodsList.length > 3 * status) {
            status = status + 1;
            this.invoiceHtml(data, style, status);
        }
    },

    // 检测是否已经安装LOGOP
    checkIsInstallLODOP: function () {
        setTimeout(function () {
            try {
                var LODOP = getLodop(document.getElementById('LODOP1'), document.getElementById('LODOP_EM1'));
                if ((LODOP != null) && (typeof(LODOP.VERSION) != "undefined")) {
                    console.log("本机已成功安装过Lodop控件!\n版本号:" + LODOP.VERSION);
                }
            } catch (err) {
                //alert("Error:本机未安装或需要升级!");
            }
        }, 800);
    },

    // 判断物流规则是否正确
    checkShippingValue: function (shipping, value) {
        if (shipping === "shunfeng" && !/^\d{12}$/.test(value)) {
            Ext.Msg.alert('警告', "顺丰物流单号必须是12位的数字，请重新输入");
            return false;
        } else if (shipping === "ems" && value.length!=13) {
            Ext.Msg.alert('警告', "EMS物流单号必须是13位的字符，请重新输入");
            return false;
        }
        return true;
    }

});