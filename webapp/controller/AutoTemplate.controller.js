sap.ui.define([
	"heli/ui5/controls/controller/BaseController",
	"sap/m/MessageToast",
	"heli/ui5/controls/util",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"../util/MyTemplates"
], function(Controller, MessageToast, util,JSONModel,ODataModel,MyTemplates) {
	"use strict";
	var iFixedRows = 3;
	var iTempData = "[{\"name\":\"MeetupID\"},{\"name\":\"Title\"},{\"name\":\"EventDate\"},{\"name\":\"Description\"}]";

	return Controller.extend("heli.ui5.controls.controller.AutoTemplate", {
		
		_oMetaDataOdataModel:null,
		_strDataSource:"",
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.AutoTemplate
		 */
		onInit: function() {
			this._addHideMasterButton();
			this.byId("ceFields").setValue(iTempData);
			this._initDataModel();
			
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.AutoTemplate
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.AutoTemplate
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.AutoTemplate
		 */
		//	onExit: function() {
		//
		//	}
		onBuildSmartFilterBarConfigure: function() {
			var oDdic = this._getFields();
			if (oDdic) {
				var strConfigure = MyTemplates.buildFilterConfigure(oDdic, 2, "");
				this._getResult().setValue(strConfigure);

			} else {
				MessageToast.show("数据有误，请检查");
			}

		},
		onCopy: function() {
			var strResult = this._getResult().getValue();
			util.copyStringToClipboard(strResult, "copy success", " copy failure");
		},
		onDataSourceAddRows: function() {
			var oDataSource = this.byId("TDataSource");
			this._addRows(oDataSource);
		},
		onDataSourceSubRows: function() {
			var oDataSource = this.byId("TDataSource");
			this._subRows(oDataSource);
		},
		onResultAddRows: function() {
			var oResult = this.byId("TResult");
			this._addRows(oResult);
		},
		onResultSubRows: function() {
			var oResult = this.byId("TResult");
			this._subRows(oResult);
		},
		onMTableTemplate: function() {
			var ddic = this._getFields();
			var result = MyTemplates.buildMTable(ddic);
			this._getResult().setValue(result);
		},
		onChangeDataSource:function(oEvent){
			if(oEvent.getParameter("itemPressed")){
				var oDataName = oEvent.getParameter("value");
				var oDataUri = this.getOwnerComponent().getDataSourceByName(oDataName);
				this._strDataSource = oDataName;
				if(oDataUri){
					this._oMetaDataOdataModel = new ODataModel(oDataUri);
					this._oMetaDataOdataModel.attachMetadataLoaded(this.onMetaDataOdataModelloaded.bind(this));
				}
			}
		},
		onMetaDataOdataModelloaded:function(oEvent){
			
			var oSource = oEvent.getSource();
			var oMetadata = oSource.getMetaModel().oMetadata;
			var aEntityType = oMetadata.oMetadata.dataServices.schema[0].entityType;
			var oEntityModel = new JSONModel(aEntityType);
			this.getView().setModel(oEntityModel,"oEntityModel");
		},
		onChangeEntitySet:function(oEvent){
			if(oEvent.getParameter("itemPressed")){
				var aEntitys = this.getView().getModel("oEntityModel").getData();
				var strEntityName = oEvent.getParameter("value");
				var oEntity = aEntitys.find(function(obj){return obj.name === strEntityName;});
				var oFields = [];
				if(oEntity){
					oFields = oFields.concat(oEntity.property);
				}
				oFields.forEach(function(obj){delete obj.extensions;});
				var oFieldsModel = new JSONModel(oFields);
				this.getView().setModel(oFieldsModel,"oFieldModel");
				
				var ceFieldCode = [];
				ceFieldCode = ceFieldCode.concat(oFields);
				// copy object
				//Object.assign(ceFieldCode,oFields);
				//ceFieldCode.forEach(function(obj){delete obj.extensions;});


				this.byId("ceFields").setValue(JSON.stringify(ceFieldCode));
			}
		},
		onLoaDataFromCode:function(oEvent){
			var strFields = this.byId("ceFields").getValue();
			var aFields = JSON.parse(strFields);
			var oJsonModel = this.getView().getModel("oFieldModel");
			if(!oJsonModel){
				oJsonModel = new JSONModel(aFields);
			}else{
				oJsonModel.setData(aFields);
			}
			this.getView().setModel(oJsonModel,"oFieldModel");
			var oIconTabFilter = this.byId("IFTTable");
			this.byId("ITBar1").setSelectedItem(oIconTabFilter);
			//this.byId("ITBar1").fireSelect({item:oIconTabFilter,key:oIconTabFilter.getId()});
		},
		onSelectIconTabBar:function(oEvent){
			var strITFId = oEvent.getParameter("item").getId().replace("__xmlview2--","");
			switch(strITFId){
				case "ITFCode":
					//var strCode = this.byId("ceFields").getValue();
					//this.byId("ceFields").setValue(strCode);
				break;
				case "IFTTable":
					var strFields = this.byId("ceFields").getValue();
					var aFields = JSON.parse(strFields);
					var oJsonModel = this.getView().getModel("oFieldModel");
					if(!oJsonModel){
						oJsonModel = new JSONModel(aFields);
					}
					this.getView().setModel(oJsonModel,"oFieldModel");
					break;
			}
		},
		onUITableTemplate:function(oEvent){
			
		},
		onFormTemplate:function(oEvent){
			
		},
		onWorkListTemplate:function(oEvent){
			
		}
		,
		_initDataModel:function(){
			var jsonDataSource = this.getOwnerComponent().getDataSources();
			var oDataModel = new JSONModel(jsonDataSource);
			this.getView().setModel(oDataModel,"ODataModel");
		}
		,
		_getResult: function() {
			return this.byId("TResult");
		},
		_getFields: function() {
			var oFieldModel = this.getView().getModel("oFieldModel");
			var aResult = [];
			var aFields = {};
			if(oFieldModel){
				 aFields = oFieldModel.getData();
				var oTabField = this.byId("tabField");
				var aSelectedIndices = oTabField.getSelectedIndices();
				aResult = [].concat( aFields.filter(function(obj,index){
											return index === aSelectedIndices.find(function(selectedObj){
																					return selectedObj === index;});  
					 
										   }));
				
			}
			else{
				var strFields = this.byId("ceFields").getValue();
				 aFields = JSON.parse(strFields);
				 aResult = aResult.concat(aFields);
			}
			return aResult;
		},
		
		_addRows: function(oControl) {
			var iCountRows = oControl.getRows();
			oControl.setRows(iCountRows + iFixedRows);
		},
		_subRows: function(oControl) {
			var iCountRows = oControl.getRows();
			if (iCountRows > iFixedRows) {
				oControl.setRows(iCountRows - iFixedRows);
			}
		}

	});

});