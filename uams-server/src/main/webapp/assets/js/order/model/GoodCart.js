Ext.define('Supplier.model.GoodCart',
    {
        //不要忘了继承
        extend:'Ext.data.Model',
        fields:['autoId', 'prodNo','prodName', 'skuCode', 'prodCount',
            {name: 'prodPrice', type: 'float'},
            {name: 'totalFee', type: 'float'},
            {name: 'actualFee', type: 'float'},
            'itemType'],
        idProperty: 'autoId'
    }
)