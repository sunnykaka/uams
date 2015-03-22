/**
 * Created by king on 13-12-23
 */

Ext.define('Supplier.controller.Win', {
        extend: 'Ext.app.Controller',
        views: ['win.AddGoodWin', 'win.AddOrderWin', 'win.OrderInfo', 'win.GoodList', 'win.GoodCart'],
        stores: ['GoodCart', 'GoodList'],
        models: ['GoodCart', 'GoodList'],
        init: function () {
            this.control({
                '#addGoodWin': {
                    //增加赠品窗口展开
                    show: function (win) {
                        Ext.getCmp('goodCart').getStore().removeAll();
                        Ext.getCmp('goodList').getStore().removeAll();
                    },
                    destroy: function (){
                        Espide.Common.reLoadGird('OrderList', 'search', false);
                        var store = Ext.getCmp('orderItem').getStore(),
                            sel = Ext.getCmp('OrderList').getSelectionModel().selected.items[0],
                            fld = sel.get('id');
                        store.load({
                            params: {
                                orderIds: fld
                            }
                        });
                    }
                },
                '#addOrderWin': {
                    //增加订单窗口展开
                    show: function (win) {
                        Ext.getCmp('goodCart').getStore().removeAll();
                        Ext.getCmp('goodList').getStore().removeAll();
                    }
                },
                "#addOrderWin #comfirm": {
                    click: function (btn){
                        var com = Espide.Common,
                            params = {},
                            orderInfo = Ext.getCmp('orderInfo').getForm(),
                            goodCartStore = Ext.getCmp('goodCart').getStore();

                        if (orderInfo.isValid()){

                            if (goodCartStore.count()===0){
                                Ext.Msg.alert('警告', '请至少加入一个商品!');
                                return;
                            }
                            goodCartStore.getProxy().api.create = "/order/addOrder";
                            goodCartStore.getProxy().extraParams = orderInfo.getValues();
                            goodCartStore.getProxy().extraParams['orderItemType'] = Ext.getCmp('goodList').down("#searchType").getValue();
                            goodCartStore.sync();
                        }else{
                            Ext.Msg.alert('警告', '请把订单信息补全!');
                        }


                    }
                },
                "#addOrderWin #cancel": {
                    click: function () {
                        Ext.getCmp('goodCart').getStore().removeAll();
                    }
                },
                '#searchBtn': {
                    //搜索商品
                    click: function (button) {
                        var params = button.up('form').getValues();
                        params['repoId'] = Espide.Common.getGridSels('OrderList', 'repoId')[0];

                        if (!!Ext.getCmp('addOrderWin')){
                            params['repoId'] = '0';
                        }
                        if (button.up('form').isValid()) {
                            button.up('grid').getStore().load({
                                params: params
                            });
                        }
                    }
                },
                '#addBtn': {
                    //多个添加到商品车
                    click: this.readyAddGood
                },
                '#goodList actioncolumn[itemId=addRow]': {
                    click: this.readyAddGood //单个添加到商品车
                },
                '#removeBtn': {
                    click: this.removeGoodCart  //移除购物车中商品
                },
                "#addGoodWin #submit": {
                    click: function (btn) {
                        var com = Espide.Common,
                            goodCartStore = Ext.getCmp('goodCart').getStore();

                        goodCartStore.getProxy().api.create = "/order/addGift";

                        goodCartStore.getProxy().extraParams = {
                            orderNos: com.getGridSels('OrderList', 'orderNo').join(','),
                            orderItemType: Ext.getCmp('goodList').down("#searchType").getValue()
                        };

                        goodCartStore.sync();

                        Ext.getCmp('addGoodWin').destroy();

                    }
                },
                "#addGoodWin #cancel": {
                    click: function () {
                        Ext.getCmp('goodCart').getStore().removeAll();
                    }
                },
                "#addOrderWin #receiverState": {
                    change: function (combo, newValue){
                        var state = Espide.City.getCities(newValue),
                            cityEle = combo.up('form').down('#receiverCity'),
                            districtEle = combo.up('form').down('#receiverDistrict');

                        cityEle.getStore().loadData(state);
                        cityEle.reset();

                        districtEle.getStore().loadData([]);
                        districtEle.reset();
                    }
                },
                "#addOrderWin #receiverCity": {
                    change: function (combo, newValue){
                        if (newValue){
                            var province = combo.up('form').down('#receiverState').getValue(),
                                areas = Espide.City.getAreas(province, newValue);
                            combo.up('form').down('#receiverDistrict').getStore().loadData(areas);
                            combo.up('form').down('#receiverDistrict').reset();
                        }
                    }
                },
                "#addOrderWin #shopId": {
                    afterrender: function (combo){
                        var store = combo.getStore(),
                            result = store.findRecord("shopId", 'null');
                        result && store.remove(result);
                    }
                }
            });
        },
        //准备添加到商品车
        readyAddGood: function (button, rowIndex, colIndex, item, e, selected) {
            var root = this,
                selectgoods = [],
                newgoods = null;

            //分情况获取所选项数组
            if (button.getXType() == 'button') {
                selectgoods = button.up('grid').getSelectionModel().getSelection();
            } else {
                selectgoods.push(selected);
            }

            //是否有加入项，有，则返回可加入数组
            newgoods = root.canSelGoodAdd(selectgoods);

            if (!newgoods) return false;

            //条件校检好后真正加入购物车
            root.addToGoodCart(newgoods);
        },

        //过滤所选项，判断是否符合加入条件，符合返回可加入的数组，否则返回false
        canSelGoodAdd: function (sels) {
            var root = this,
                flag = true,
                arr = [],
                addNum = Ext.getCmp('goodList').down('#addNum').getValue() || 1;

            Ext.each(sels, function (record, index, records) {
                if (root.isGoodAdded(record.get('skuCode'))) {
                    Ext.Msg.alert('警告', '暂存仓已有选中商品，请先移除已选再添加');
                    return flag = false;
                }

                var newgood = Ext.create('Supplier.model.GoodCart', {
                    prodCount: addNum,
                    autoId: null,
                    prodNo: record.get('prodNo'),
                    itemType: record.get('itemType'),
                    skuCode: record.get('skuCode'),
                    prodPrice: record.get('prodPrice'),
                    totalFee: addNum*record.get('prodPrice'),
                    actualFee: addNum*record.get('prodPrice'),
                    prodName: record.get('prodName')
                });

                arr.push(newgood);
            });
            if (!flag || arr.length === 0) {
                return false;
            }
            return arr;
        },
        //判断购物车是否已有要添加的商品
        isGoodAdded: function (goodId) {
            var flag = false,
                goodCartItems = Ext.getCmp('goodCart').getStore().data.items;
            Ext.each(goodCartItems, function (record, index, root) {
                if (record.get('skuCode') == goodId) {
                    return flag = true;
                }
            });
            return flag;
        },
        //过滤完后，真正加入购物车
        addToGoodCart: function (goods) {
            Ext.getCmp('goodCart').getStore().add(goods);
        },
        //移除购物车中商品
        removeGoodCart: function (button) {
            var goodCart = button.up('window').down("#goodCart"),
                records = goodCart.getSelectionModel().getSelection();
            if (records.length > 0) {
                goodCart.getStore().remove(records);
            }
        }
    }
);