sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.Basic_Button", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.Basic_Button
		 */
			onInit: function() {
				this.oTxt = this.byId("txt1");
				this.oBtn1 = this.byId("btn1");
				//sap.ui.getCore().               
			},
		onBtn1Press: function(oEvent) {
           this._busy = new sap.m.BusyDialog();
           this._busy.open();
		},
		onBtn2Press:function(oEvent){
			
		},
		onBtn3Press:function(oEvent){
			
		},
		onBtn4Press:function(oEvent){
		   var sTxt = this.oTxt.getText();
		   sTxt += "\r\n"+"onBtn4Press";
		   this.oTxt.setText(sTxt);
		   
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.Basic_Button
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.Basic_Button
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.Basic_Button
		 */
		//	onExit: function() {
		//
		//	}

	});

});