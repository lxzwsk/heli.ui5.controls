sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/smartfilterbar/ControlConfiguration",
	"sap/ui/core/format/DateFormat",
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"fin/cons/vecrule/util/Tools"
], function (ManagedObject, JSONModel, ControlConfiguration, DateFormat, ValueHelpDialog, Tools) {
	"use strict";
	return ManagedObject.extend("fin.cons.vecrule.util.ValueHelpHandler", {

		// oBusinessEntity: {},
		// oCategory: {},
		// oClassField: {},
		oValueHelpDialog: {},
		oModel: {},
		ShlpField: "",
		ShlpName: "",
		ValueOption: {
			Equal: "EQ",
			Greater: "GT",
			GreaterEqual: "GE",
			Less: "LT",
			LessEqual: "LE",
			Between: "BT",
			Contains: "CP"
		},
		/*
		oBusinessEntity = {
			BusinessEntityText: ""  //Dialog Title
		}
		*/
		handleValueHelpRequest: function (oInput, oModel, sTitle, aFieldsInformations, oInfo) {
			this.oModel = oModel;
			this.sTitle = sTitle;
			this.ShlpField = oInfo.Shlpfield;
			this.ShlpName = oInfo.Shlpname;

			this.oValueHelpDialog = this.createValueHelpDialog(oInput);
			this.oValueHelpDialog.setFilterBar(this.createFilterbar(aFieldsInformations));
			this.createTableColumn(aFieldsInformations);
			if (oInput instanceof sap.m.MultiInput && oInput.getTokens().length > 0) {
				this.oValueHelpDialog.setTokens(oInput.getTokens());
			}
			this.oValueHelpDialog.open();
		},
		handleValueHelpRequestForAdditionalAttr: function (oInput, oModel, sTitle, aFieldsInformations, oInfo) {
			this.oModel = oModel;
			this.sTitle = sTitle;
			this.ShlpField = oInfo.Shlpfield;
			this.ShlpName = oInfo.Shlpname;
			this.sAdditionalAttributeID = oInfo.Ddtext;

			this.oValueHelpDialog = this.createValueHelpDialog(oInput);
			this.oValueHelpDialog.setFilterBar(this.createFilterbar(aFieldsInformations));
			this.createTableColumn(aFieldsInformations);
			if (oInput instanceof sap.m.MultiInput && oInput.getTokens().length > 0) {
				this.oValueHelpDialog.setTokens(oInput.getTokens());
			}
			this.oValueHelpDialog.open();
		},
		handleValueHelpRequestForHierarchy: function (oInput, oModel, sTitle, aFieldsInformations, oInfo) {
			this.oModel = oModel;
			this.sTitle = sTitle;
			this.ShlpField = oInfo.Shlpfield;
			this.ShlpName = oInfo.Shlpname;

			this.oValueHelpDialog = this.createValueHelpDialogForHierarchy(oInput);
			this.oValueHelpDialog.setFilterBar(this.createFilterbarForHierarchy(aFieldsInformations));
			this.createTableForHierarchy(aFieldsInformations);
			this.oValueHelpDialog.open();
		},
		
		createValueHelpDialog: function (oInput) {
			var sTitle = this.sTitle;
			var bMulti = oInput instanceof sap.m.MultiInput;
			var oVHDialog = new ValueHelpDialog({
				basicSearchText: bMulti ? "12" : oInput.getValue(),
				title: sTitle,
				supportMultiselect: bMulti,
				supportRanges: false,
				key: "KEY",
				descriptionKey: "KEY_TEXT",
				tokenDisplayBehaviour: sap.ui.comp.smartfilterbar.DisplayBehaviour.idAndDescription,

				ok: function (oControlEvent) {
					var aTokens = oControlEvent.getParameter("tokens");
					if (bMulti) {
						oInput.fireTokenUpdate({
							type: sap.m.Tokenizer.TokenUpdateType.Removed,
							removedTokens: oInput.getTokens()
						});
						oInput.fireTokenUpdate({
							type: sap.m.Tokenizer.TokenUpdateType.Added,
							addedTokens: aTokens
						});

					} else {
						oInput.setValue(aTokens[0].getKey());
						// oInput.fireChange({
						// 	newValue: aTokens[0].getKey()
						// });
						oInput.fireLiveChange({
							newValue: aTokens[0].getKey()
						});
					}
					oVHDialog.close();
				},

				cancel: function () {
					oVHDialog.close();
				},
				afterClose: function () {
					oVHDialog.destroy();
				}
			});

			var oRowsModel = new sap.ui.model.json.JSONModel();
			oVHDialog.setModel(oRowsModel);
			oVHDialog.getTable().bindRows("/");
			oVHDialog.data("source", "leaf");
			return oVHDialog;
		},
		createValueHelpDialogForHierarchy: function(oInput){
			var sTitle = this.sTitle;
			var oVHDialog = new ValueHelpDialog({
				basicSearchText: "",
				title: sTitle,
				supportMultiselect: false,
				supportRanges: false,
				key: "NodeId",
				descriptionKey: "Description",
				tokenDisplayBehaviour: sap.ui.comp.smartfilterbar.DisplayBehaviour.idAndDescription,
				selectionChange: function(oEvent){
					oEvent.getParameter("updateTokens").push({
						sKey: oEvent.getParameter("tableSelectionParams").rowContext.getObject().NodeId,
						oRow: oEvent.getParameter("tableSelectionParams").rowContext.getObject(),
						bSelected: true
					});
				},
				ok: function (oControlEvent) {
					var aTokens = oControlEvent.getParameter("tokens");
					var oSelectedData = aTokens[aTokens.length - 1].data("row");
					
					if(!oSelectedData.bLeaf){
						oInput.setValue(oSelectedData.InputDisplayText);
						// oInput.fireChange({
						// 	newValue: oSelectedData
						// });
						oInput.fireLiveChange({
							newValue: oSelectedData
						});
						oVHDialog.close();
					}else{
						oVHDialog._bIgnoreSelectionChange = false;
					}
					
				},

				cancel: function () {
					oVHDialog.close();
				},
				afterClose: function () {
					oVHDialog.destroy();
				}
			});
			return oVHDialog;
		},
		
		createTableColumn: function (aFilters) {
			var i;
			var oColModel = new sap.ui.model.json.JSONModel();
			var aColumns = [];
			var oColumnData;

			if (aFilters) {

				for (i = 0; i < aFilters.length; i++) {
					oColumnData = aFilters[i];

					// Columns of the table
					var iResultPos = 0;

					iResultPos = parseInt(oColumnData.ResultPos, 10);
					if (iResultPos > 0) {
						aColumns.push({
							label: oColumnData.FieldText,
							template: "CELLS/" + (iResultPos - 1) + "/TEXT",
							iResultPos: iResultPos
						});
					}
				}
				// sort columns by result position
				aColumns.sort(function (a, b) {
					return a.iResultPos - b.iResultPos;
				});
			}
			oColModel.setData({
				cols: aColumns
			});
			this.oValueHelpDialog.setModel(oColModel, "columns");
		},
		
		/**
		 * 
		 * sLeafJudgmentProperty the property shows if current node is leaf or not
		 */
		createTreeTableForF4Dialog: function(aColumnsInfo, sFetchChildrenPath, sLeafJudgmentProperty){
			var aColumns = [];
			aColumnsInfo.sort(function (a, b) {
				return parseInt(a.iResultPos, 10) - parseInt(b.iResultPos, 10);
			});
			for(var i = 0; i < aColumnsInfo.length; i ++){
				aColumns.push(new sap.ui.table.Column({
					label: aColumnsInfo[i].label,
					template: aColumnsInfo[i].template,
					name: aColumnsInfo[i].name
				}));
			}
			var oTree = new sap.ui.table.TreeTable({
				columns: aColumns,
				selectionMode: "None",
				showColumnVisibilityMenu: false,
				rowHeight: 30,
				enableBusyIndicator: true,
				visibleRowCount: 30,
				busyIndicatorDelay: 0
			});
			
			oTree.setRowActionTemplate(new sap.ui.table.RowAction({items: [
				new sap.ui.table.RowActionItem({
					icon: "sap-icon://expand-group",
					text: "Expand",
					visible: sLeafJudgmentProperty,
					type: sap.ui.table.RowActionType.Custom,
					press: function(oEvent){
						oTree.expandToLevel(999);
					}
				})
			]}));
			
			oTree.setRowActionCount(1);
			oTree.setModel(new JSONModel({children:[]}));
			oTree.bindRows({
				path: "/children"
			});
			return oTree;
		},
		createTableForHierarchy: function(aFilters){
			var aColumnInfo = [{
				label: Tools.getText("LABEL_NODE_VALUE"),
				template: "NodeValue",
				name: "NodeValue"
			},{
				label: Tools.getText("LABEL_NODE_DESCRIPTION"),
				template: "Description",
				name: "Description"
			}];
			
			this.oValueHelpDialog.setTable(this.createTreeTableForF4Dialog(aColumnInfo, "GetUniversalHierarchyTree", "{bRoot}"));
		},
		
		createFilterbar: function (aFilters) {
			var oFilter;
			var oFilterGroupItem;
			var aFilterControls = [];
			var aFilterGroupItems = [];
			var iOutLength;
			var oInput;
			var oFilterBar;
			var iSelectionPos;

			aFilters.sort(function (a, b) {
				return a.SelectionPos - b.SelectionPos;
			});

			for (var i = 0; i < aFilters.length; i++) {
				oFilter = aFilters[i];
				iSelectionPos = parseInt(oFilter.SelectionPos, 10);
				if (iSelectionPos !== 0) {
					iOutLength = parseInt(oFilter.OutLength, 10);
					if (oFilter.ShlpName === "VEC_SH_RULE_USEL" && oFilter.FieldName === "FIELD_NAME") {
						var aCharatersFieldsData = Tools.getCharatersFieldsData();
						for (var l = 0; l < aCharatersFieldsData.length; l++) {
							aCharatersFieldsData[l].key = aCharatersFieldsData[l].NodeId.split(".")[0];
							aCharatersFieldsData[l].text = aCharatersFieldsData[l].NodeDesc;
						}
						oInput = new sap.m.MultiComboBox({
							width: "100%"
						}).data("FilterData", oFilter);
						oInput.setModel(new JSONModel(aCharatersFieldsData))
							.bindAggregation("items", {
								path: "/",
								template: new sap.ui.core.Item({
									key: "{key}",
									text: "{text}"
								})
							});
					} else if (oFilter.ShlpName === "VEC_SH_RULE_USEL" && oFilter.FieldName === "SINGLE_OPTION") {
						oInput = new sap.m.ComboBox({
							width: "100%",
							showSecondaryValues: true
						}).data("FilterData", oFilter);
						oInput.setModel(new JSONModel([{
								key: "X",
								text: Tools.getText("LABEL_YES")
							}, {
								key: "",
								text: Tools.getText("LABEL_NO")
							}]))
							.bindAggregation("items", {
								path: "/",
								template: new sap.ui.core.Item({
									key: "{key}",
									text: "{text}"
								})
							});
					} else {
						oInput = new sap.m.MultiInput().data("FilterData", oFilter);
						oInput.addValidator(function (args) {
							var text = args.text;
							return new sap.m.Token({
								key: text,
								text: text
							});
						});
						// oInput.setShowValueHelp(oFilter.HasValueHelp ? true : false);
						oInput.setShowValueHelp(false);
					}

					oInput.attachBrowserEvent("keyup", jQuery.proxy(function (e) {
						if (e.which === 13 && !oInput.__bSuggestInProgress && !oInput.__bValidatingToken) {
							oFilterBar.fireSearch({
								selectionSet: aFilterControls
							});
						}
					}, this));
					if (!isNaN(iOutLength) && oInput.setMaxLength) {
						oInput.setMaxLength(iOutLength);
					}
					//deal with additional attribute, set id as default and unchangeable value
					if(oFilter.FieldName === "IATID"){
						oInput.addToken(new sap.m.Token({
							key: this.sAdditionalAttributeID,
							text: this.sAdditionalAttributeID
						}));
						oInput.setEnabled(false);
					}
					oFilterGroupItem = new sap.ui.comp.filterbar.FilterGroupItem({
						groupName: "gn1",
						name: oFilter.FieldName,
						label: oFilter.FieldText,
						control: oInput
					});

					aFilterControls.push(oInput);
					aFilterGroupItems.push(oFilterGroupItem);
				}
			}

			//Addd Max Hit Selector
			var oSelector = new sap.m.Select({
				selectedKey: "500",
				name: "MaxHit"
			});
			for (i = 500; i < 1500; i += 500) {
				var oItem = new sap.ui.core.Item({
					key: i,
					text: i
				});
				oSelector.addItem(oItem);
			}

			oFilterGroupItem = new sap.ui.comp.filterbar.FilterGroupItem({
				groupName: "gn1",
				label: Tools.getText("TIT_MAX_HIT"),
				name: "MaxHit",
				control: oSelector
			});

			aFilterControls.push(oSelector);
			aFilterGroupItems.push(oFilterGroupItem);

			var fnSearch = function (oEventParameters) {
				var oSelectionField;
				var aSelectionSet = oEventParameters.getParameter("selectionSet");
				var aSearchFilters = [];
				var sFilterString;
				var iOutLengthOfSelection;
				var sOption;
				// var oSelection;
				// var aSelectionValues;
				var aSelections = [];
				var iMaxHit = 500;

				if (aSelectionSet) {
					var fnBuildFilters = function (sValue) {
						sFilterString = sValue;
						iOutLengthOfSelection = parseInt(oSelectionField.data("FilterData").OutLength, 10);

						// CAUTION: The following only holds for char based data types only
						// INT4 might have restricted length but should never be send as CP and/or with trailing/leading *
						// INT4 means oSelectionField.data("FilterData").DataType === "I"
						if (oSelectionField.data("FilterData").DataType !== "I") {
							if (sFilterString.length + 2 <= iOutLengthOfSelection || isNaN(iOutLengthOfSelection)) {
								// prepend and append *
								sFilterString = "*" + sFilterString + "*";
								sOption = this.ValueOption.Contains;
							} else if (sFilterString.length + 1 <= iOutLengthOfSelection) {
								// append star
								sFilterString = sFilterString + "*";
								sOption = this.ValueOption.Contains;
							} else {
								// no star
								sOption = this.ValueOption.Equal;
							}
						} else {
							// no star
							sOption = this.ValueOption.Equal;
						}
						aSearchFilters.push({
							NAME: oSelectionField.data("FilterData").FieldName,
							T_VALUE: [{
								LOW: sFilterString,
								HIGH: "",
								SIGN: "I",
								OPTION: sOption
							}]
						});
					}.bind(this);
					for (var j = 0; j < aSelectionSet.length; j++) {
						oSelectionField = aSelectionSet[j];
						if (oSelectionField.getName() === "MaxHit") {
							iMaxHit = parseInt(oSelectionField.getSelectedKey(), 10);
						} else {
							if (oSelectionField instanceof sap.m.MultiInput) {
								oSelectionField.getTokens().forEach(function (oToken) {
									fnBuildFilters(oToken.getKey());
								});
							} else if (oSelectionField instanceof sap.m.ComboBox && oSelectionField.getSelectedItem()) {
								oSelectionField.data("FilterData").DataType = "I";
								fnBuildFilters(oSelectionField.getSelectedKey());
							} else if (oSelectionField instanceof sap.m.MultiComboBox && oSelectionField.getSelectedItems()) {
								oSelectionField.data("FilterData").DataType = "I";
								oSelectionField.getSelectedKeys().forEach(fnBuildFilters);
							}
						}

					}
				}

				// get value help values and write them into the model
				var sFilters = JSON.stringify({
					VALUES: aSearchFilters
				});
				var sSelections = JSON.stringify({
					VALUES: aSelections
				});
				this.getResultData(sFilters, sSelections, iMaxHit);
			}.bind(this);

			oFilterBar = new sap.ui.comp.filterbar.FilterBar({
				advancedMode: true,
				filterGroupItems: aFilterGroupItems,
				search: fnSearch
			});
			oFilterBar.onAfterRendering = function(){
				sap.ui.comp.filterbar.FilterBar.prototype.onAfterRendering.apply(oFilterBar, arguments);
				oFilterBar.fireSearch({
					selectionSet: aFilterControls
				});
			};
			return oFilterBar;

		},
		createFilterbarForHierarchy: function (aFilters) {
			var oFilter;
			var oFilterGroupItem;
			var aFilterControls = [];
			var aFilterGroupItems = [];
			var iOutLength;
			
			var oFilterBar;
			var iSelectionPos;

			aFilters.sort(function (a, b) {
				return a.SelectionPos - b.SelectionPos;
			});

			for (var i = 0; i < aFilters.length; i++) {
				var oInput = null;
				oFilter = aFilters[i];
				iSelectionPos = parseInt(oFilter.SelectionPos, 10);
				if (iSelectionPos !== 0) {
					iOutLength = parseInt(oFilter.OutLength, 10);
					if (oFilter.FieldName === "USELHIERARCHYID") {
						oInput = new sap.m.ComboBox({
							width: "100%"
						}).data("FilterData", oFilter);
						oInput.data("Updated", false);
						oInput.data("FieldName", "USELHIERARCHYID");
						oInput.attachChange(function(oEvent){
							oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
						});
					} else if(oFilter.FieldName === "VALIDITYDATE"){
						oInput = new sap.m.ComboBox({
							width: "100%"
						}).data("FilterData", oFilter);
						oInput.data("Updated", false);
						oInput.data("FieldName", "VALIDITYDATE");
						oInput.attachChange(function(){
							oInput.setValueState(sap.ui.core.ValueState.None);
						});
					}
					if (!isNaN(iOutLength) && oInput && oInput.setMaxLength) {
						oInput.setMaxLength(iOutLength);
					}
					oFilterGroupItem = new sap.ui.comp.filterbar.FilterGroupItem({
						groupName: "gn1",
						name: oFilter.FieldName,
						label: oFilter.FieldText,
						mandatory: true,
						control: oInput
					});

					aFilterControls.push(oInput);
					aFilterGroupItems.push(oFilterGroupItem);
				}
			}

			var fnSearch = function (oEventParameters) {
				var aFields = oEventParameters.getParameter("selectionSet");
				var sID = "";
				var sTime = "";
				var bValid = true;
				for(var j = 0; j < aFields.length; j++){
					var oSelectionField = aFields[j];
					var oSelectedItem = oSelectionField.getSelectedItem();
					if(oSelectedItem){
						var oPara = oSelectedItem.getBindingContext().getObject();
						if(oSelectionField.data("FieldName") === "USELHIERARCHYID"){
							sID = oPara.FullHierarchyId;
							if(aFields.length === 1){
								sTime = oPara.TimeTo;
							}
						}
						if(oSelectionField.data("FieldName") === "VALIDITYDATE"){
							sTime = oPara.TimeTo;
						}
					}else{
						oSelectionField.setValueState(sap.ui.core.ValueState.Error);
						bValid = false;
					}
				}
				if(bValid){
					var oTree = this.oValueHelpDialog.getTable();
					Tools.fetchChildrenAndResetDOMForTreeTable(
						oTree, "GetUniversalHierarchyTree", 
						{
							AdditionalMasterDataHierarchy: sID,
							ValidityEndDate: sTime
						}
					);
				}
				
				
			}.bind(this);

			oFilterBar = new sap.ui.comp.filterbar.FilterBar({
				advancedMode: true,
				filterGroupItems: aFilterGroupItems,
				search: fnSearch
			});
			
			this.fetchHeaderInformation();
			var that = this;
			oFilterBar.setBasicSearch(new sap.m.SearchField({
				showSearchButton: false,
				search: function(oEvent){
					var oTable = that.oValueHelpDialog.getTable();
					oTable.setBusy(true);
					var filters = [];
					var sSearchText = oEvent.getParameter("query");
					if (sSearchText !== "") {
						var aInputTextFilters = new Array();
						aInputTextFilters.push(new sap.ui.model.Filter("NodeValue", sap.ui.model.FilterOperator.Contains, sSearchText));
						aInputTextFilters.push(new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sSearchText));
				
						var oOrFilter = new sap.ui.model.Filter(aInputTextFilters, false);
						filters.push(oOrFilter);
						oTable.getBinding().filter(filters);
						oTable.expandToLevel(999);
						oTable.setBusy(false);
					} else if(sSearchText === ""){
						filters = [];
						filters = [new sap.ui.model.Filter({
							aFilters: filters,
							bAnd: true
						})];
						oTable.getBinding().filter(filters);
						oTable.collapseAll();
						oTable.setBusy(false);
					}
				}
			}));
			
			return oFilterBar;

		},

		getResultData: function (sFilters, sSelections, iMaxHit) {
			var sSource = this.oValueHelpDialog.data("source");
			var fnSucess = jQuery.proxy(function (oData, oResponse) {
				var oValueHelpList;
				var oTable = this.oValueHelpDialog.getTable();
				this.oValueHelpDialog.setBusy(false);
				try {
					oValueHelpList = JSON.parse(oData.Result);
					this.oValueHelpDialog.getModel().setData(oValueHelpList.VALUES);
					//oModel
					if (oTable && oTable.bindRows) {
						oTable.bindRows("/");
						this.oValueHelpDialog.TableStateDataFilled();
					}
					this.oValueHelpDialog.update();
				} catch (e) {
					oValueHelpList = [];
				}
			}, this);
			var fnError = function () {
				this.oValueHelpDialog.setBusy(false);
				//sap.m.MessageToast.show("Value help get Error");
			}.bind(this);
			if (sSource === "leaf") {
				var mParam = {
					method: "GET",
					urlParameters: {
						"ShlpField": this.ShlpField,
						"ShlpName": this.ShlpName,
						"Filters": sFilters,
						"Selection": sSelections,
						"MaxHit": iMaxHit
					},
					success: fnSucess,
					error: fnError

				};
				this.oModel.callFunction("/GetDynamicSearchHelpResult", mParam);
				this.oValueHelpDialog.setBusy(true);
			}
		},
		fetchHeaderInformation: function(){
			var fnFormatDate = function(sTime){
				var oDateInstance = sap.ui.core.format.DateFormat.getDateInstance();
				return oDateInstance.format(oDateInstance.parse(sTime));
			};
			var fnBuildData = function(oSourceData){
				var oComboBoxIDData = [];
				var oComboBoxTimeData = [];
				for(var i = 0; i < oSourceData.VALUES.length; i ++){
					if(Tools.findObjectIndexWithProperty(oComboBoxIDData, {FullHierarchyId: oSourceData.VALUES[i].CELLS[2].TEXT}, "FullHierarchyId") === -1){
						oComboBoxIDData.push({
							key: oSourceData.VALUES[i].CELLS[0].TEXT,
							text: oSourceData.VALUES[i].CELLS[0].TEXT,
							FullHierarchyId: oSourceData.VALUES[i].CELLS[2].TEXT,
							TimeFrom: oSourceData.VALUES[i].CELLS[3].TEXT,
							TimeTo: oSourceData.VALUES[i].CELLS[4].TEXT
						});
					}
					oComboBoxTimeData.push({
						FullHierarchyId: oSourceData.VALUES[i].CELLS[2].TEXT,
						text: fnFormatDate(oSourceData.VALUES[i].CELLS[3].TEXT) + " - " + fnFormatDate(oSourceData.VALUES[i].CELLS[4].TEXT),
						key: oSourceData.VALUES[i].CELLS[2].TEXT+oSourceData.VALUES[i].CELLS[3].TEXT,
						TimeTo: oSourceData.VALUES[i].CELLS[4].TEXT
					});
				}
				return {
					IDData: oComboBoxIDData,
					TimeData: oComboBoxTimeData
				};
			};
			var fnSucess = jQuery.proxy(function (oData, oResponse) {
				var oFormattedData;
				this.oValueHelpDialog.setBusy(false);
				try {
					oFormattedData = fnBuildData(JSON.parse(oData.Result));
					var aFilterBarInputs = this.oValueHelpDialog.getFilterBar().getFilterGroupItems();
					for(var i = 0; i < aFilterBarInputs.length; i ++){
						var oInput = aFilterBarInputs[i].getControl();
						if(oInput.data("FieldName") === "USELHIERARCHYID"){
							oInput.setModel(new JSONModel(oFormattedData.IDData))
							.bindAggregation("items", {
								path: "/",
								template: new sap.ui.core.Item({
									key: "{key}",
									text: "{text}"
								})
							});
							
							if(aFilterBarInputs.length > 1){
								oInput.attachChange(function(oEvent){
									if(oEvent.getSource().getSelectedItem()){
										var oPara = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
										aFilterBarInputs[1].getControl().getBinding("items").filter(new sap.ui.model.Filter("FullHierarchyId", sap.ui.model.FilterOperator.EQ, oPara.FullHierarchyId));                       
									}else{
										aFilterBarInputs[1].getControl().getBinding("items").filter(new sap.ui.model.Filter("FullHierarchyId", sap.ui.model.FilterOperator.EQ, ""));
									}
								});
							}
						}
						if(oInput.data("FieldName") === "VALIDITYDATE"){
							oInput.setModel(new JSONModel(oFormattedData.TimeData))
							.bindAggregation("items", {
								path: "/",
								template: new sap.ui.core.Item({
									key: "{key}",
									text: "{text}"
								})
							});
							oInput.getBinding("items").filter(new sap.ui.model.Filter("FullHierarchyId", sap.ui.model.FilterOperator.EQ, ""));
						}
					}
					
					
				} catch (e) {
					oFormattedData = {};
				}
			}, this);
			var fnError = function () {
				this.oValueHelpDialog.setBusy(false);
			}.bind(this);
			var mParam = {
				method: "GET",
				urlParameters: {
					"ShlpField": this.ShlpField,
					"ShlpName": this.ShlpName,
					"Filters": '{"VALUES":[]}',
					"Selection": '{"VALUES":[]}',
					"MaxHit": 500
				},
				success: fnSucess,
				error: fnError
			};
			this.oModel.callFunction("/GetDynamicSearchHelpResult", mParam);
			this.oValueHelpDialog.setBusy(true);
		}
	});
});