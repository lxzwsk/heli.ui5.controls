sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"heli.ui5.controls/model/stockHelp",
	"sap/ui/model/json/JSONModel"
], function(Controller, stockHelp,JSONModel) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.stockHelp_Test", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.stockHelp_Test
		 */
			onInit: function() {

			},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.stockHelp_Test
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.stockHelp_Test
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.stockHelp_Test
		 */
		//	onExit: function() {
		//
		//	}
		onGoPress: function() {
			//this.showBusy();
			var that = this;
			var sUrl = this.byId("iStockUrl").getValue();
			var iStartNo = this.byId("iStartNo").getValue();
			var iEndNo = this.byId("iEndNo").getValue();
			var iStartType = this.byId("iStockType").getValue();
			var oHelp = new stockHelp(sUrl, iStartNo, iEndNo);
			oHelp.getStockNos(iStartType);
			
			oHelp.refreshComplete = function(data) {
				var oResult = that.byId("tResult");
				oResult.setValue(JSON.stringify(data));
				//that.hideBusy();
			};
		},
		showBusy: function() {
			if (!this.busyBox) {
				this.busyBox = new sap.m.BusyDialog();
			}
			this.busyBox.open();
		},
		hideBusy: function() {
			this.busyBox.close();
		}

	});

});