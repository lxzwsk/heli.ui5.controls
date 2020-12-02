sap.ui.define([
	"heli/ui5/controls/controller/BaseController",
	"heli/ui5/controls/data/SaleOrders",
	"sap/ui/model/json/JSONModel"
], function(Controller, SaleOrders, JSONModel) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.Chart_Stacked_Bar_Column", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.Chart_Stacked_Bar_Column
		 */
		onInit: function() {
			//this._setData();
			//this._initital_control2();
			this._addHideMasterButton();
			this._initial_control();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.Chart_Stacked_Bar_Column
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.Chart_Stacked_Bar_Column
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.Chart_Stacked_Bar_Column
		 */
		//	onExit: function() {
		//
		//	}
		_setData: function() {
			var jsonModel = new JSONModel();
			jsonModel.setData(SaleOrders.columnData);
			this.getView().setModel(jsonModel, "ColumnData");
		},
		_initial_control: function() {
			var ovizFrame = this.byId("idStackedChart");
			ovizFrame.setVizProperties({
				plotArea: {
					colorPalette: d3.scale.category20().range(),
					dataLabel: {
						showTotal: true
					}
				},
				tooltip: {
					visible: true
				},
				title: {
					text: "stacked bar chart"
				}
				
			});

			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: "Year",
					value: "{Year}"
				}],
				measures: [{
					name: "Milk",
					value: "{Milk}"
				}, {
					name: "Sugar",
					value: "{Sugar}"
				}, {
					name: "Tea",
					value: "{Tea}"
				}],
				data: {
					path: "/"
				}
			});
			ovizFrame.setDataset(oDataset);
			var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid: "valueAxis",
					type: "Measure",
					values: ["Milk"]
				}),
				oFeedValueAxis1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid: "valueAxis",
					type: "Measure",
					values: ["Sugar"]
				}),
				oFeedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid: "valueAxis",
					type: "Measure",
					values: ["Tea"]
				}),
				oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid: "categoryAxis",
					type: "Dimension",
					values: ["Year"]
				});
			ovizFrame.setModel(new JSONModel(SaleOrders.columnData));
			ovizFrame.addFeed(oFeedValueAxis);
			ovizFrame.addFeed(oFeedValueAxis1);
			ovizFrame.addFeed(oFeedValueAxis2);
			ovizFrame.addFeed(oFeedCategoryAxis);

		},
		_initital_control2: function() {
			var oVizFrame = this.getView().byId("idStackedChart");
			oVizFrame.setVizProperties({
				plotArea: {
					colorPalette: d3.scale.category20().range(),
					dataLabel: {
						showTotal: true
					}
				},
				tooltip: {
					visible: true
				},
				title: {
					text: "Stacked Bar Chart"
				}
			});
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: "Year",
					value: "{Year}"
				}],

				measures: [{
					name: "Milk",
					value: "{Milk}"
				}, {
					name: "Sugar",
					value: "{Sugar}"
				}, {
					name: "Tea",
					value: "{Tea}"
				}],

				data: {
					path: "/"
				}
			});
			oVizFrame.setDataset(oDataset);

			oVizFrame.setModel(new JSONModel(SaleOrders.columnData));

			var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "valueAxis",
					"type": "Measure",
					"values": ["Milk"]
				}),
				oFeedValueAxis1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "valueAxis",
					"type": "Measure",
					"values": ["Sugar"]
				}),
				oFeedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "valueAxis",
					"type": "Measure",
					"values": ["Tea"]
				}),

				oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "categoryAxis",
					"type": "Dimension",
					"values": ["Year"]
				});

			oVizFrame.addFeed(oFeedValueAxis);
			oVizFrame.addFeed(oFeedValueAxis1);
			oVizFrame.addFeed(oFeedValueAxis2);
			oVizFrame.addFeed(oFeedCategoryAxis);
		}

	});

});