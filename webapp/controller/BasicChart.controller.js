sap.ui.define([
	"heli/ui5/controls/controller/BaseController",
	"heli/ui5/controls/model/models",
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format'
], function(Controller, models, ChartFormatter, Format) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.BasicChart", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.BasicChart
		 */
		onInit: function() {

			//this.getView().setModel(models.createSaleOrderModel(), "SaleOrders");
			//Format.numericFormatter(ChartFormatter.getInstance());
			//var formatPattern = ChartFormatter.DefaultPattern;
			this._addHideMasterButton();
			var ovizFrame = this.getView().byId("myFrame");
			ovizFrame.setModel(models.createSaleOrderModel(),"SaleOrders");
			// ovizFrame.setVizProperties({
			// 	plotArea: {
			// 		dataLabel: {
			// 			colorPalette: d3.scale.category20().range(),
			// 			visible: true
			// 		}
			// 	},
			// 	tooltip:{
			// 		visible:true
			// 	},
			// 	title: {
			// 		visible: false,
			// 		text: 'Revenue by City and Store Name'
			// 	}
			// });
			
			//var oPopOver = this.getView().byId("idPopOver");
            //oPopOver.connect(ovizFrame.getVizUid());
            //oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.BasicChart
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.BasicChart
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.BasicChart
		 */
		//	onExit: function() {
		//
		//	}

	});

});