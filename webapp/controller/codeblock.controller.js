sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/TabContainer",
	"sap/m/TabStrip",
], function(Controller,	TabContainer,TabStrip) {
	"use strict";
	
	TabStrip.prototype.onBeforeRendering = function() {
		//sap.m.TabStrip.prototype.onBeforeRendering.call(this);
		var aItems = this.getItems();
		aItems.forEach(function(oItem) {
			oItem.setAggregation("_closeButton", null);
		});
	};
	
	return Controller.extend("heli.ui5.controls.controller.codeblock", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.codeblock
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.codeblock
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.codeblock
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.codeblock
		 */
		//	onExit: function() {
		//
		//	}

	});

});