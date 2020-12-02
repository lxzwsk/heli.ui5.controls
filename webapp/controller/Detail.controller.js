sap.ui.define([
	"heli/ui5/controls/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller,JSONModel,MessageBox) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.Detail
		 */
			onInit: function() {
				this._addHideMasterButton();
				let aSet = new Set([1,1,2,2,3,3,4,5]);
				for(let item of aSet){
					console.log(item);
				}
				console.log(aSet);
			},
			onReadNodeData:function(oEvent){
				var oModel = new JSONModel();
				oModel.loadData("http://localhost:3000/getData?fileName=stockInfo",{},false);
				this.oData = oModel.oData;
				MessageBox.alert(oModel.oData);
				
			},
			onPostNodeData:function(oEvent){
				var oData = {fileName:"stockInfo",Data:[
					{stockNo:"002065",stockDesc:"东华软件"},
					{stockNo:"600196",stockDesc:"复星医药"},
					{stockNo:"000063",stockDesc:"中兴通讯"},
					{stockNo:"000651",stockDesc:"格力"}
					]};
				$.ajax({
					type:"POST",
					data:oData,
					url:"http://localhost:3000/getData",
					success:this._PostNodeDataSuccess.bind(this),
					error:this._PostNodeDataError.bind(this),
				});
			},
			_PostNodeDataSuccess:function(data){
				MessageBox.alert("Success");
			},
			_PostNodeDataError:function(request,message){
				MessageBox.alert(message);
			}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZHELI_UI5_CONTROLS.view.Detail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZHELI_UI5_CONTROLS.view.Detail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZHELI_UI5_CONTROLS.view.Detail
		 */
		//	onExit: function() {
		//
		//	}

	});

});