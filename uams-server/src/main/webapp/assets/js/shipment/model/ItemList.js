Ext.define('Supplier.model.ItemList',
    {
        //不要忘了继承
        extend:'Ext.data.Model',
        fields:['id','prodNo', 'prodName', 'skuCode', 'itemType', 'prodPrice', 'prodCount', 'actuallyNumber', 'brandName', 'outOrderNo'],
        idProperty: 'id'
    }
)