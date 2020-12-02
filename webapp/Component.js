sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"heli.ui5.controls/model/models",
	"heli.ui5.controls/util",
	"heli.ui5.controls/data/stock_equity",
	"heli.ui5.controls/data/stock_favorite",
	"heli.ui5.controls/model/MasterTree",
], function(UIComponent, Device, JSONModel, models, util, stock_equity, stock_favorite, MasterTree) {
	"use strict";

	return UIComponent.extend("heli.ui5.controls.Component", {

		metadata: {
			manifest: "json",
			routing: util.buildRoute()
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.defaultPath = util.getDefaultPath(MasterTree.treeData) || "detail";

			// Parse the current url and display the targets of the route that matches the hash
			this.getRouter().initialize();
			this._stock_equity = stock_equity.equity;
			this._stock_favorite = stock_favorite.favorites;
			this._getStocks();
			
		},
		_getStocks: function() {
			var jsonModel = new JSONModel();
			jsonModel.loadData("data/stocks.json", {}, false);
			this._stocks = jsonModel.getProperty("/");
		},
		getStocks: function() {
			return this._stocks;
		},
		getStock_Equity: function() {
			return this._stock_equity;
		},
		getStock_Favorite: function() {
			return this._stock_favorite;
		},
		setStock_Equity: function(jsonData) {
			this._stock_equity = jsonData;
		},
		setStock_Favorite: function(jsonData) {
			this._stock_favorite = jsonData;
		},
		_stocks: [],
		_stock_equity: {},
		_stock_favorite: []
	});
});