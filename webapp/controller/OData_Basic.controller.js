sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.OData_Basic", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.OData_Basic
		 */
			onInit: function() {
				var oModel = this.getOwnerComponent().getModel("OData");
				oModel.attachMetadataLoaded(null,function(oEvent){
					var oMetadata = oEvent.getParameters("metadata");
					var arrEntitys = oMetadata.metadata.mEntityTypes;
					var arrPropertys = null;
					for(var entity in arrEntitys){
						arrPropertys = arrEntitys[entity];
						for(var oField in arrPropertys){
							
						}
					}
				}.bind(this));
			}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.OData_Basic
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.OData_Basic
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.OData_Basic
		 */
		//	onExit: function() {
		//
		//	}

	});

});