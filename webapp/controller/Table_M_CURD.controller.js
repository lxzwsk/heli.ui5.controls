sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.Table_M_CURD", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.Table_M_CURD
		 */
		onInit: function() {
			var jsonModel = new JSONModel();
			var jsonData = {
				"product": []
			};
			jsonModel.setData(jsonData);
			this.getView().setModel(jsonModel,"jsonModel");
		},
		onPressAdd: function() {
			var jsonModel = this.getView().getModel("jsonModel");
			var jsonData = jsonModel.getData();
			var emptyData = {
				Field1: "",
				Field2: "",
				Field3: ""
			};
			jsonData.product.push(emptyData);
			jsonModel.setData(jsonData);
			jsonModel.refresh();
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.Table_M_CURD
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.Table_M_CURD
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.Table_M_CURD
		 */
		//	onExit: function() {
		//
		//	}

	});

});