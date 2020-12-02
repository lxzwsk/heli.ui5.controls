sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.stock_setting", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.stock_setting
		 */
		onInit: function() {//
			this._oFilterBar = this.byId("filterBar1");
			//this._bindData//();
			//this._Favorite// = this.getOwnerComponent().getStock_Favorite();
			//this._Equity = this.getOwnerComponent().getStock_Equity();

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.stock_setting
		 */
		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.stock_setting
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.stock_setting
		 */
		onExit: function() {

		},
		onReset: function() {

		},
		onSearch: function(oEvent) {
			var that = this;
			var oSource = oEvent.getSource();
			var aItems = oSource.getFilterItems();
			var oFilter = [];
			aItems.forEach(function(ele) {
				var currFilter = null;
				var oCtrl = that._oFilterBar.determineControlByFilterItem(ele);
				var ctrlType = oCtrl.getMetadata().getName();
				var fieldName = ele.getName();
				var oValue = null;
				switch (ctrlType) {
					case "sap.m.MultiComboBox":
						oValue = oCtrl.getSelectedKeys();
						currFilter = new Filter({
							filters: [],
							and: true
						});
						oValue.forEach(function(valueEle) {
							currFilter.aFilters.push(new Filter({
								path: fieldName,
								operator: FilterOperator.EQ,
								value1: valueEle
							}));
						});
						//oFilter.push(currFilter);
						break;
					case "sap.m.MultiInput":
					case "heli.ui5.controls.Control.StockInput":
						oValue = oCtrl.getValue();
						if (oValue) {
							currFilter = new Filter({
								path: fieldName,
								operator: FilterOperator.Contains,
								value1: oValue
							});
						}
						//oFilter.push(currFilter);
						break;
					case "sap.m.CheckBox":
						oValue = oCtrl.getSelected();
						if (oValue) {
							currFilter = new Filter({
								path: fieldName,
								operator: FilterOperator.EQ,
								value1: oValue
							});
						}
						//oFilter.push(currFilter);
						break;
				}
				if (currFilter) {
					oFilter.push(currFilter);
				}
			});

			var oTable = this.byId("tabStocks");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(new Filter({
				filters: oFilter,
				and: true
			}));
		},
		onExpand: function(oEvent) {
			var oSource = oEvent.getSource();
			var bExpend = oEvent.getParameter("expand");
			if (bExpend) {
				oSource.setHeight("600px");
			} else {
				oSource.setHeight("50px");
			}
		},
		onItemClose: function(oEvent) {
			oEvent.bPreventDefault = true;
		},

		_bindData: function() {
			var ind = null;
			var jsonModel = new JSONModel();
			var jsonData_Equity = this._Favorite;
			jsonModel = new JSONModel();
			jsonModel.setData(jsonData_Equity);
			this.getView().setModel(jsonModel, "stockEquity");

			var jsonData_Favorite = this._Favorite;
			jsonModel = new JSONModel();
			jsonModel.setData(jsonData_Favorite);
			this.getView().setModel(jsonModel, "stockFavorite");
			this._oFilterBar = this.byId("filterBar1");

			var jsonData = this.getOwnerComponent().getStocks();
			jsonModel = new JSONModel();
			for (ind in jsonData.stock) {
				var currData = jsonData.stock[ind];
				if (jsonData_Equity.find(function(ele) {
						return ele.stockNo === currData.stockno;
					})) {
					currData.ycy = true;
				}

				if (jsonData_Favorite.find(function(ele) {
						return ele.stockno === currData.stockno;
					})) {
					currData.ysc = true;
				}
			}
			jsonModel.setData(jsonData);
			this.getView().setModel(jsonModel);
		},
		onFavoritePress: function(oEvent) {
			var oTab = this.byId("tabStocks");
			var aItems = oTab.getSelectedItems();
			var sPath = null;
			var oModel = null;
			for (var ind in aItems) {
				sPath = aItems[ind].getBindingContext().sPath;
				if (!oModel) {
					oModel = aItems[ind].getBindingContext().oModel;
				}
				var currStock = oModel.getProperty(sPath);
				currStock.ysc = true;
				oModel.setProperty(sPath, currStock);

				this._updateFavorite(currStock);
			}
		},
		_updateFavorite: function(stock) {
			var jsonModel = this.getView().getModel("stockFavorite");
			var aData = jsonModel.oData;
			var currData = aData.find(function(ele) {
				return ele.stockno === stock.stockno;
			});
			if (!currData) {
				aData.push(stock);
			}
			this.getOwnerComponent().getStock_Favorite().push(stock);

		},
		onDeleteFavorite: function(oEvent) {
			var oTab = this.byId("tabFavorite");
			var aItems = oTab.getSelectedItems();
			var sPath = null;
			var oModel = null;
			for (var ind in aItems) {
				sPath = aItems[ind].getBindingContext("stockFavorite").sPath;
				if (!oModel) {
					oModel = aItems[0].getBindingContext("stockFavorite").oModel;
				}
				var currStock = oModel.getProperty(sPath);
				var opt = oModel.oData.indexOf(currStock);
				oModel.oData.splice(opt, 1);
				oModel.setData(oModel.oData);
				
				this.getOwnerComponent().getStock_Favorite()

			}

		}

	});

});