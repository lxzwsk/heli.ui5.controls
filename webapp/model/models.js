sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"heli/ui5/controls/model/MasterTree",
	"heli/ui5/controls/data/SaleOrders",
	"sap/ui/Device"
], function(JSONModel,MasterTree,SaleOrders, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createMasterTreeModel:function(){
			var oModel = new JSONModel();
			oModel.setData(MasterTree.treeData);
			return oModel;
		},
		createSaleOrderModel:function(){
			var oModel = new JSONModel();
			oModel.setData(SaleOrders.saleorders);
			return oModel;
		},
		createProductModel:function(){
			var oModel = new JSONModel();
			oModel.loadData("data/products.json",{},false);
			return oModel;
		}

	};
});