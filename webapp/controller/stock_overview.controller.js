sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"heli/ui5/controls/model/stockHelp",
], function(Controller, MessageToast, JSONModel, stockHelp) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.stock_overview", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.stock_overview
		 */
		tile: [],
		onInit: function() {
			var ind = null;

			var oStocks = this.getOwnerComponent().getStock_Equity();
			var oStock_Favorite = this.getOwnerComponent().getStock_Favorite();

			for (ind in oStock_Favorite) {
				if (!oStocks.find(function(ele) {
						return ele.stockNo === oStock_Favorite[ind].stockNo;
					})) {
					oStocks.push({
						stockNo: oStock_Favorite[ind].stockNo,
						stockType: oStock_Favorite[ind].stockType,
						inPrice: 0,
						inQty: 0,
						totalQty: 0
					});
				}
			}
			//var oStockHelp = null;
			var sUrl = this.byId("iStockUrl").getValue();
			var sImgUrl = this.byId("iStockImgUrl").getValue();
			for (ind in oStocks) {
				var oStockHelp = new stockHelp(sUrl, 0, 0, {
					stockType: oStocks[ind].stockType,
					stockNo: oStocks[ind].stockNo,
					inPrice: oStocks[ind].inPrice,
					inQty: oStocks[ind].inQty,
					totalQty: oStocks[ind].totalQty,
					imgUrl: sImgUrl
				});
				//sUrl = sUrl + "/list=" + oStocks[ind].stockType + ind;
				oStockHelp.getDataBystockNo(sUrl + "/list=" + oStocks[ind].stockType + oStocks[ind].stockNo);
				oStockHelp.getDataComplete = this.onGetDataCallBack.bind(this);
			}

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.stock_overview
		 */
		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.stock_overview
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.stock_overview
		 */
		onExit: function() {

		},
		onBtnTest: function(oEvent) {
			MessageToast.show("aaaaaaaaa");
		},
		onGetDataCallBack: function(oData) {

			var jsonData = oData.result;
			var lineData = jsonData.linedata;
			var oViewData = {};
			oViewData.header = jsonData.title;
			oViewData.subheader = jsonData.stockNo;
			oViewData.value = jsonData.summary.zf;
			oViewData.footer = "Start" + lineData[1].linedata + " " + "End" + lineData[2].linedata;
			oViewData.indicator = this._getIndicator(jsonData.zfStatus);
			oViewData.valueColor = this._getFootColor(jsonData.zfStatus);
			oViewData.stockType = jsonData.stockType;
			oViewData.stockNo = jsonData.stockNo;
			this.tile.push(oViewData);
			var jsonModel = new JSONModel(this.tile);
			this.getView().setModel(jsonModel);
		},
		_getIndicator: function(zfStatus) {
			switch (zfStatus) {
				case 1:
					return "Up";
				case 2:
					return "Down";
				case 3:
					return "None";
			}
		},
		_getFootColor: function(zfStatus) {
			switch (zfStatus) {
				case 1:
					return "Error";
				case 2:
					return "Good";
				case 3:
					return "Neutral";
			}
		},
		onTilePress: function(oEvent) {
			var oSource = oEvent.getSource();
			var oModel = oSource.getBindingContext().oModel;
			var oPath = oSource.getBindingContext().sPath;
			var jsonData = oModel.getProperty(oPath);
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("show_stock", {
				path: jsonData.stockType + jsonData.stockNo
			});

		}

	});

});