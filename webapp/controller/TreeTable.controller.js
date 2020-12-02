sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.TreeTable", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.TreeTable
		 */
		onInit: function() {
			var oJson = {
				categories: [{
						Rcode: "CNY",
						categories: [{
							Rcode: "1001",
							RText: "Rtext1",
							Comments: "123456"
						}, {
							Rcode: "1002",
							RText: "Rtext2",
							Comments: "12345678"
						}, {
							Rcode: "1003",
							RText: "Rtext3",
							Comments: "2345678"
						}]
					}, {
						Rcode: "RMB",
						categories: [{
							Rcode: "2001",
							RText: "RText2001",
							Comments: "234567"
						}, {
							Rcode: "2002",
							RText: "RText2002",
							Comments: "23456789"
						}, {
							Rcode: "2003",
							RText: "RText2003",
							Comments: "3456789"
						}]
					}

				]
			};

			var oDetail = new JSONModel();
			oDetail.setData(oJson);
			this.getView().setModel(oDetail, "Detail");

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.TreeTable
		 */
		onBeforeRendering: function() {
			var osmTable = this.byId("osmTable");
		}

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.TreeTable
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.TreeTable
		 */
		//	onExit: function() {
		//
		//	}

	});

});