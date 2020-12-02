sap.ui.define([
	"heli/ui5/controls/controller/BaseController",
	"sap/ui/model/json/JSONModel",
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.BasicChartPie", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.BasicChart2
		 */
		onInit: function() {
			this._addHideMasterButton();
			this._setIceCreamModel();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.BasicChart2
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.BasicChart2
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.BasicChart2
		 */
		//	onExit: function() {
		//
		//	}

		_setIceCreamModel: function() {

			var aData = {
				Items: [{
					Flavor: "Blue Moon",
					Sales: 700
				}, {
					Flavor: "Matcha Green Tea",
					Sales: 1100
				}, {
					Flavor: "ButterScotch",
					Sales: 1400
				}, {
					Flavor: "Black Current",
					Sales: 560
				}]
			};
			var oIceCreamModel = new JSONModel();
			oIceCreamModel.setData(aData);
			this.getView().setModel(oIceCreamModel, "IceCreamModel");
		}

	});

});