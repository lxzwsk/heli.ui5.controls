sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/BusyDialog",
	"heli/ui5/controls/model/stockHelp",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"heli/ui5/controls/data/stock_favorite",
	"heli/ui5/controls/data/stock_equity",
	"sap/ui/core/routing/History"
], function(Controller, JSONModel, MessageToast, MessageBox, BusyDialog, stockHelp, Filter, FilterOperator, stock_favorite, stock_equity,
	History) {
	"use strict";

	var eStockStatus = {
		up: 1, //涨
		down: 2, //跌
		none: 3 //盘整
	};
	var stock_quantity = stock_equity.equity;
	var jsonFavorite = stock_favorite.favorites;
	var oTimer = null;
	return Controller.extend("heli.ui5.controls.controller.show_stock", {

		//
		//  http://hq.sinajs.cn/list=sh601006,sh601007
		//
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.show_stock
		 */
		onInit: function() {
			var jsonModel = new JSONModel();
			jsonModel.loadData("data/stocks.json", {}, false);
			this.getView().setModel(jsonModel, "stocks");

			//
			//
			var uiStateModel = new JSONModel();
			uiStateModel.setData({
				"status": {
					"showImg": false,
					"showLR": true
				}
			});
			this.getView().setModel(uiStateModel);
			this._initialToolbar();
			this.onHideLRCHK();

			this.getOwnerComponent().getRouter().getRoute("show_stock").attachPatternMatched(this._onRouteMatched, this);

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.show_stock
		 */
		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.show_stock
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.show_stock
		 */
		onExit: function() {

		},
		onNavButtonPress: function(oEvent) {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				// There is no history!
				// Naviate to master page
				this.getOwnerComponent().getRouter().navTo("stock_overview", {
					path: 0
				}, true);
			}
		},
		_onRouteMatched: function(oEvent) {
			var strPath = oEvent.getParameter("arguments").path;
			if (strPath.length === 8) {
				var stockType = strPath.substr(0, 2);
				var stockNo = strPath.substr(2, 6);
				this.byId("istockNo").setValue(stockNo);
				this.byId("cstockType").setSelectedKey(stockType);
				this._buildStockUrl();
			}
		},
		onShowPress: function() {

			this._buildStockUrl();
		},
		onImgPress: function(oEvent) {
			var pressId = oEvent.getSource().getId();
			var dayId = this.byId("lDayLink").getId();
			var weekId = this.byId("lWeekLink").getId();
			var monthId = this.byId("lMonthLink").getId();
			var iIndex = 0;
			switch (pressId) {
				case dayId:
					iIndex = 1;
					break;
				case weekId:
					iIndex = 2;
					break;
				case monthId:
					iIndex = 3;
					break;
			}
			this._showImg(iIndex);
		},
		onHideImg: function(oEvent) {
			var oModel = this._getModel();
			var isVisible = oModel.oData.status.showImg;
			var oBtn = oEvent.getSource();

			if (isVisible) {
				oBtn.setText("Show Image");
				oBtn.setIcon("sap-icon://expand-group");
			} else {
				oBtn.setText("Hide Image");
				oBtn.setIcon("sap-icon://collapse-group");
			}
			oModel.oData.status.showImg = !isVisible;
			oModel.setData(oModel.oData);

		},
		onImageLoad: function(oEvent) {
			//oEvent.getSource().setBusy(false);
		},
		onHideLRCHK: function(oEvent) {
			var oModel = this._getModel();
			var isVisible = oModel.oData.status.showLR;
			oModel.oData.status.showLR = !isVisible;
			oModel.setData(oModel.oData);
		},
		onAutoRefresh: function(oEvent) {
			var oModel = this._getModel();
			var bAutoRefresh = oEvent.getParameters("selected").selected;
			var nAutoTime = oModel.oData.params.autoTime * 60 * 1000;

			if (bAutoRefresh) {
				oTimer = setInterval(this.onShowPress.bind(this), nAutoTime);
			} else {
				if (oTimer) {
					clearInterval(oTimer);
				}
			}
			oModel.oData.status.autoRefresh = bAutoRefresh;
			oModel.setData(oModel.oData);
		},
		onSuggestionItemSelected: function(oEvent) {
			var oListItem = oEvent.getParameter("selectedRow");
			if (oListItem) {
				var oContext = oListItem.getBindingContext("stocks");
				var sPath = oContext.sPath;
				var oEntity = oContext.oModel.getProperty(sPath);
				if (oEntity) {
					//return oEntity.stockType;
					this._buildStockUrl(oEntity.stockType);
				}
			}

		},
		_buildStockUrl: function(sType) {

			var that = this;
			this.sStockNum = this.byId("istockNo").getValue();

			if (!this.sStockNum || this.sStockNum === "") {
				MessageToast.show("请输入股票代码");
				return;
			}
			if (!sType || sType.length === 0) {
				this.sstockType = this._getstockType(this.sStockNum);
			} else {
				this.sstockType = sType;
			}
			if (this.sstockType && this.sstockType.length > 0) {

				var sStockUrl = this.byId("iStockUrl").getValue();
				var sUrl = sStockUrl + "/list=" + this.sstockType + this.sStockNum;
				var iImgUrl = this.byId("iStockImgUrl").getValue();
				var currStock = stock_quantity.find(function(ele) {
					return ele.stockNo === that.sStockNum;
				});
				var inPrice, inQty, totalQty;
				if (currStock) {
					inPrice = currStock.inPrice;
					inQty = currStock.inQty;
					totalQty = currStock.totalQty;
				}
				var oStockHelp = new stockHelp(sStockUrl, 0, 0, {
					stockType: this.sstockType,
					stockNo: this.sStockNum,
					inPrice: inPrice,
					inQty: inQty,
					totalQty: totalQty,
					imgUrl: iImgUrl
				});
				oStockHelp.getDataBystockNo(sUrl);
				oStockHelp.getDataComplete = this.getDataCallBack.bind(this);

			} else {
				this._showErrorMsg("股票代码" + this.sStockNum + "有误，请检查");
			}
		},
		getDataCallBack: function(data) {

			var jsonModel = new JSONModel();
			jsonModel.setData(data.result);
			this.getView().setModel(jsonModel);

			var azf = this.getView().getControlsByFieldGroupId("zf");
			this._fontColorFormat(data.result.zfStatus, azf);

			var alr = this.getView().getControlsByFieldGroupId("lr");
			this._fontColorFormat(data.result.lrStatus, alr);
			MessageToast.show("Load Success!");

		},
		_showImg: function(index) {
			var jsonModel = this.getView().getModel();
			var lineImg = jsonModel.getProperty("/lineImg");
			var currImg = lineImg[index];
			jsonModel.setProperty("/currImgUrl", currImg);
		},
		_fontColorFormat: function(stockStatus, aControl) {

			if (!aControl || aControl.length === 0) {
				return;
			}
			for (var ind in aControl) {
				switch (stockStatus) {
					case eStockStatus.up:
						aControl[ind].toggleStyleClass("zfUp", true);
						aControl[ind].removeStyleClass("zfDown");
						break;
					case eStockStatus.down:
						aControl[ind].toggleStyleClass("zfDown", true);
						aControl[ind].removeStyleClass("zfUp");
						break;
					case eStockStatus.none:
						aControl[ind].removeStyleClass("zfUp");
						aControl[ind].removeStyleClass("zfDown");
						break;

				}
			}

		},
		_getModel: function() {
			return this.getView().getModel();
		},
		_showErrorMsg: function(msg) {
			MessageBox.error(msg, {
				title: "Error"
			});
		},
		_getstockType: function(stockNum) {
			var oModel = this.getView().getModel("stocks");
			if (oModel.oData.stock) {
				var oEntity = oModel.oData.stock.find(function(ele) {
					return ele["stockNo"] === stockNum;
				});

				if (oEntity) {
					return oEntity.stockType;
				}
			}
		},
		_initialToolbar: function() {
			var oToolbar = this.byId("oToolbar");
			for (var ind in jsonFavorite) {
				var oEntity = jsonFavorite[ind];
				//var ocustData = new sap.ui.core.CustomData({key:});
				var oButton = new sap.m.Button({
					text: oEntity.stockDesc,
					type: "Transparent"
				});
				oButton.attachPress(oEntity, this._clickFavorite.bind(this));
				oToolbar.addContent(oButton);
			}
		},
		_clickFavorite: function(oEvent, oEntity) {
			var oInput = this.byId("istockNo");
			oInput.setValue(oEntity.stockNo);
			this._buildStockUrl(oEntity.stockType);
		}

	});

});