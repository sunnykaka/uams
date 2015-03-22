Ext.define('Supplier.model.GoodList',
    {
        //不要忘了继承
        extend:'Ext.data.Model',
        fields:['skuCode','prodNo', 'prodName',
            {name: 'prodPrice', type: 'float'},
            'prodPrice', 'itemType'],
        idProperty: 'skuCode'
    }
)