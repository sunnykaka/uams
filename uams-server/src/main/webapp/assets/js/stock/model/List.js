/**
 * Created by HuaLei.Du on 13-12-19.
 */
Ext.define('Stock.model.List', {
    extend: 'Ext.data.Model',
    fields: ['id', 'repoName', 'brandName', 'prodCaName', 'prodName', 'prodNo', 'prodCode', 'shopPrice',
        'standardPrice', 'actuallyNumber', 'description', 'propsStr'],
    idProperty: 'id'
});