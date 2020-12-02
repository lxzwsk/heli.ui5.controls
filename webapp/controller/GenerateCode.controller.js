sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
], function(Controller, ODataModel, JSONModel) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.GenerateCode", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.GenerateCode
		 */
		onInit: function() {

			var oControl = {
				showWorkListTable: false,
				showObjectTable: false,
				WorkListTable: {
					EnabledSmartTable: true,
					EnabledSelectedAll: true,
					EnabledMultiToggle: true
				}
			};
			var jsonModel = new JSONModel(oControl);
			this.getView().setModel(jsonModel, "oControl");

			var oControlType = {
				tableControlType: [{
					key: "Text",
					text: "Text"
				}, {
					key: "Link",
					text: "Link"
				}, {
					key: "ComboBox",
					text: "ComboBox"
				}, {
					key: "MultiComboBox",
					text: "MultiComboBox"
				}],
				filterControlType: [{
					key: "auto",
					text: "auto"
				}, {
					key: "date",
					text: "date"
				}, {
					key: "dateTimePicker",
					text: "dateTimePicker"
				}, {
					key: "dropDownList",
					text: "dropDownList"
				}, {
					key: "input",
					text: "input"
				}]
			};

			var jsonControlTypeModel = new JSONModel(oControlType);
			this.getView().setModel(jsonControlTypeModel, "controlType");

			this.sCodeSource = "";

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.GenerateCode
		 */
		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.GenerateCode
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.GenerateCode
		 */
		onExit: function() {

		},
		onWorkListEntitySetChanged: function(oEvent) {
			var sEntitySet = oEvent.getParameters().value;
			if (sEntitySet) {
				sEntitySet = sEntitySet.substring(0, sEntitySet.length - 3);
				var oMetaModel = this.oOdataModel.getServiceMetadata();
				var aEntity = oMetaModel.dataServices.schema[0].entityType;
				var oEntity = aEntity.find(function(object) {
					return object.name === sEntitySet;
				});

				var jsonFields = [];
				oEntity.property.forEach(function(obj) {
					jsonFields.push({
						FieldName: obj.name,
						DataType: obj.type,
						showTable: true,
						ShowType: "Text",
						ShowFilter: true,
						Mandatory: false,
						FilterType: "auto",
						EnableOrder: true,
						EnabledFilter: true
					});
				});

				var jsonModel = new JSONModel(jsonFields);
				this.getView().setModel(jsonModel, "fieldList");
				this.setControlProperty("showWorkListTable", true);
			}
		},
		onLoadDataSourcePress: function() {
			this.getPage().setBusy(true);
			var txtUrl = this.byId("DataSource.Url").getValue();
			this.oOdataModel = new ODataModel(txtUrl);
			this.oOdataModel.attachMetadataLoaded(function(metadata) {
				this.oMetadata = metadata;
				this.initialOdataSource();
				this.getPage().setBusy(false);
			}.bind(this));
		},
		onWorkListGenerate: function(oEvent) {
			var oControlData = this.getView().getModel("oControl").oData;
			var oFieldData = this.getView().getModel("fieldList").oData;
			var sEntitySet = this.byId("cBoxWorkListEntitySet").getSelectedItem().getText();
			this.buildWorkListFilter(sEntitySet, oControlData, oFieldData);
			this.buildWorkListTable(sEntitySet, oControlData, oFieldData);
			this.byId("codeSource").setValue(this.sCodeSource);
		},
		getPage: function() {
			return this.byId("mainPage");
		},
		initialOdataSource: function() {
			var oMetaModel = this.oOdataModel.getServiceMetadata();
			var oentityContainer = oMetaModel.dataServices.schema[0].entityContainer[0].entitySet;
			var jsonEntitySet = [];
			oentityContainer.forEach(function(obj) {
				jsonEntitySet.push({
					key: obj.entityType,
					text: obj.name
				});
			});
			var jsonModel = new JSONModel(jsonEntitySet);

			this.getView().setModel(jsonModel);

		},
		setControlProperty: function(name, value) {
			var oModel = this.getView().getModel("oControl");
			oModel.setProperty("/" + name, value);
		},
		getControlProperty: function(name) {
			var oModel = this.getView().getModel("oControl");
			return oModel.getProperty("/" + name);
		},
		buildWorkListFilter: function(sEntitySet, oControlData, oFieldData) {
			var filterHead =
				`<smartfilterbar:SmartFilterBar id='smartFilterbar' entitySet="${sEntitySet}" persistencyKey="variant" useToolbar="true" liveMode="false"
						showClearButton="true" search="onSearch" beforeVariantFetch="onBeforeFilterVariantFetch" afterVariantLoad="onAfterFilterVariantLoad"
						clear="onClearFilterData" reset="onFilterBarReset" initialized="onFilterBarInitialized">\r\n`;
			var that = this;
			this.sCodeSource += filterHead;
			this.sCodeSource += "<smartfilterbar:controlConfiguration>\r\n";
			oFieldData.forEach(function(obj, iIndex) {

				if (obj.ShowFilter) {
					var filterConfigure =
						`<smartfilterbar:ControlConfiguration filterType="single" displayBehaviour="idAndDescription" groupId="_BASIC" mandatory="mandatory"
								id="filter.${obj.FieldName}" key="${obj.FieldName}" index="${iIndex}" visible="true"></smartfilterbar:ControlConfiguration>\r\n`;

					that.sCodeSource += filterConfigure;
				}
			});
			this.sCodeSource += "</smartfilterbar:controlConfiguration>\r\n";
			this.sCodeSource += "</smartfilterbar:SmartFilterBar>\r\n";
		},
		buildWorkListTable: function(sEntitySet, oControlData, oFieldData) {
			
			var sEntity = sEntitySet.substring(0,sEntitySet.length - 3);
			var smartTableHead = `<smarttable:SmartTable id="stb.LeadingUnit" width="{VLM>/LTable/Width}" editable="false" entitySet="${sEntitySet}"
								visible="{VLM>/LTable/Visible}"
								requestAtLeastFields="METHOD_ID,RYEAR,POPER,GRREF,DOCNR,DOCLN,REF_BELNR,REF_DOCLN,PSTAT,CSTAT,CLEARING_STATUS,RACCT,TSL,RTCUR,RCOMP,RASSC,RBUKRS,DS_NAME,DUE_DATE"
								class="sapUiSizeCondensed" persistencyKey="stb.LeadingUnit.variant" useExportToExcel="false" useVariantManagement="true"
								header="{i18n>LTableTitleCount}" showRowCount="true" useTablePersonalisation="true" enableAutoBinding="false"
								beforeRebindTable="onBeforeRebindLeadingUnit" initialise="onStbInitialise">
								<smarttable:customData>
									<core:CustomData id="stb.LeadingUnit.CustData" key="p13nDialogSettings"
										value='\{ "sort": \{ "visible": true}, "filter": \{ "visible": true}, "group": \{ "visible": false} }'/>
								</smarttable:customData>
								<smarttable:customToolbar>
									<Toolbar id="stb.Partner.Toolbar" design="Transparent">
										<Select id="selPartner" change="onSelPartnerChange"></Select>
										<Label id="selPartnerName" design="Bold"/>
										<ToolbarSpacer id="stb.Partner.ToolbarSpacer"/>
									</Toolbar>
								</smarttable:customToolbar>
								\r\n`;
								
			this.sCodeSource += smartTableHead;
			
			var tableHead = `<table:Table id="partnerTable" selectionMode="MultiToggle" enableSelectAll="true" enableBusyIndicator="true" ariaLabelledBy="title"
									threshold="9999" visibleRowCount="{VLM>/PTable/VisibleRowCount}" showColumnVisibilityMenu="true" rowSelectionChange="onTableRowSelected">\r\n
									<table:columns>\r\n`;
									
			this.sCodeSource += tableHead;
			
			var that = this;
			oFieldData.forEach(function(obj){
				var field = `<table:Column id="partnerTable.${obj.FieldName}" autoResizable="true" sortProperty="${obj.FieldName}" filterProperty="${obj.FieldName}" width="100px">
											<table:customData>
												<core:CustomData id="partnerTable.Column6.CustData" key="p13nData" value='\{"columnKey": "${obj.FieldName}"}'/>
											</table:customData>
											<Label id="partnerTable.Column6.Lbl" text="{/#${sEntity}/${obj.FieldName}/@sap:label}" tooltip="{/#${sEntity}/${obj.FieldName}/@sap:label}"/>
											<table:template>
												<Text id="partnerTable.Column6.Ctrl" text="{${obj.FieldName}}" wrapping="false"/>
											</table:template>
										</table:Column>`;
			  that.sCodeSource += field;
			});
			this.sCodeSource += " 	</table:columns>\r\n	</table:Table>\r\n";
			
			this.sCodeSource += "</smarttable:SmartTable>\r\n";
		}

	});

});