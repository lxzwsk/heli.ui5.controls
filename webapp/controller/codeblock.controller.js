sap.ui.define([
	"../controller/BaseController",
	"sap/m/TabContainer",
	"sap/m/TabStrip",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"../data/codeBlock",
	"../util"
], function(Controller,	TabContainer,TabStrip,JSONModel,Button,codeBlockData,Util) {
	"use strict";
	
	TabStrip.prototype.onBeforeRendering = function() {
		//sap.m.TabStrip.prototype.onBeforeRendering.call(this);
		var aItems = this.getItems();
		aItems.forEach(function(oItem) {
			oItem.setAggregation("_closeButton", null);
		});
	};
	
	return Controller.extend("heli.ui5.controls.controller.codeblock", {
		
		rootPath:"/webapp/data/codeBlock/",
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.codeblock
		 */
			onInit: function() {
				var jsonModel = new JSONModel();
				jsonModel.setData(codeBlockData);
				this.getView().setModel(jsonModel,"TabMetaData");
				
				var uiModel = new JSONModel();
				var uiJson = {code:"var a = b;",type:"javascript"};
				uiModel.setData(uiJson);
				this.getView().setModel(uiModel,"UIModel");
			},
			toolBarFactory:function(sId,oContext){
				var oButton = new sap.m.Button({text:"{TabMetaData>name}",press:this.onLoadCodeBlock.bind(this)});
				return oButton;
			},
			onLoadCodeBlock:function(oEvent){
				var oData = oEvent.getSource().getBinding("text").oContext.getObject();
				var path = this.rootPath + oData.path;
				var dataType = oData.type;                         
				Util.loadData(path,dataType).then(function(oData){
					this.setCode(oData,dataType);
				}.bind(this));
			},
			setCode:function(strCode,dataType){
				var strType = "javascript";
				switch(dataType){
					case"xml":
						strType = "xml";
					break;
					default:
						strType = "javascript";
				}
				this.setModelProperty("UIModel","code",strCode);
				
				this.setModelProperty("UIModel","type",strType);
			}

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