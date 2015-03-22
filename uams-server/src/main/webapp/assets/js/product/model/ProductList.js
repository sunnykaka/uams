//定义产品
Ext.define('Product.model.ProductList', {
    extend: 'Ext.data.Model',
    fields: [
        'id',                   //商品id
        'brandId',                   //商品id
        'brandName',          	//商品品牌
        'prodName',          	//商品名称
        'prodNo',            	//商品编号
        'prodCode',          	//商品条形码
        'prodCategoryName',   	//商品分类id
        'cid',   	//商品分类id
        'description',          //商品描述
        'shopPriceStr',            //销售价
        'standardPriceStr',        //市场价
        'buyPriceStr',             //进货价
        'color',                //颜色
        'weight',               //重量
        'boxSize',              //尺寸
        'speci',                //规格
        'type',                  //商品类型
        'storage'
    ],
    idProperty: 'id'
});