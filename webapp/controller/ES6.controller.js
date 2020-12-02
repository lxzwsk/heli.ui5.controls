sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.ES6", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.ES6
		 */
		onInit: function() {

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.ES6
		 */
		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.ES6
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.ES6
		 */
		onExit: function() {

		},
		onInitSet: function(oEvent) {
			var oPersons = [{
				name: "heli",
				age: 37
			}, {
				name: "heli",
				age: 37
			}, {
				name: "liu",
				age: 38
			}, {
				name: "hehaoxuan",
				age: 10
			}];
			this.oSet = new Set(oPersons);
			
			
		},
		writeLog: function(sText) {
			var oResult = this.byId("opstResult");
			var sValue = oResult.getValue() + "\r\n" + sText;
			oResult.setValue(sValue);

		}

	});

});