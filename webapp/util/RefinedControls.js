sap.ui.define([	
	"sap/ui/model/json/JSONModel",
	"fin/cons/vecrule/util/Tools",
	"fin/cons/vecrule/control/TagBox",
	"fin/cons/vecrule/util/SQLFormatter",
	"fin/cons/vecrule/model/formatter",
	"fin/cons/vecrule/util/ValueHelpHandler",
	"sap/m/Button",
	"sap/m/Input",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/comp/smartfield/SmartField",
	"sap/m/MultiInput",
	"sap/m/Select",
	"sap/m/Label",
	"sap/m/HBox",
	"sap/m/VBox",
	"sap/m/RadioButtonGroup",
	"sap/m/RadioButton",
	"sap/m/Token",
	"sap/m/MessageItem",
	"sap/m/MessagePopover",
	"sap/m/MessageView",
	"sap/m/Table",
	"sap/m/Dialog",
	"sap/m/ColumnListItem",
	"sap/m/Text",
	"sap/m/ObjectStatus",
	"sap/m/MenuButton",
	"sap/m/Menu",
	"sap/m/MenuItem",
	"sap/m/MessageStrip",
	"sap/ui/table/Table",
	"sap/ui/codeeditor/CodeEditor",
	"sap/m/CheckBox",
    "sap/ui/generic/app/navigation/service/NavigationHandler"
	] , function (JSONModel, Tools, TagBox, SQLFormatter, formatter, ValueHelpHandler,
	Button, Input, SmartFilterBar, SmartField, MultiInput, Select, Label, 
	HBox, VBox, RadioButtonGroup, RadioButton, Token, MessageItem, MessagePopover, 
	MessageView, Table, Dialog, ColumnListItem, Text, ObjectStatus, MenuButton, 
	Menu, MenuItem, MessageStrip, UITable, CodeEditor, CheckBox, NavigationHandler) {
		"use strict";
		var _createF4 = function(oInfo, oModel, bEdit, fnChange, iMaxLength, sTitle, bValueHelpOnly, sFunction){
			var oInput = oControls.addDefaultClass(new Input({
				maxLength: iMaxLength? iMaxLength : 0,
                editable: bEdit,
                showValueHelp: true,
                valueHelpOnly: bValueHelpOnly ? true : false,
                valueHelpRequest: function(oControllEvent) {
		            var oVHhandler = new ValueHelpHandler();
		            var sSearchHelpFieldPath = "/DynamicSearchHelpFieldSet";
		
		            var oParam = {
		            	filters: [new sap.ui.model.Filter("ShlpName", sap.ui.model.FilterOperator.EQ, oInfo.Shlpname)],
		                success: function(oData) {
		                    sap.ui.core.BusyIndicator.hide();
		                    oVHhandler[sFunction](oInput, oModel, sTitle, oData.results, oInfo);
		                }
		            };
		            oModel.read(sSearchHelpFieldPath, oParam);
		            sap.ui.core.BusyIndicator.show();
                }
            }));
            // oInput.attachChange(fnChange);
            oInput.attachLiveChange(fnChange);
            return oInput;
		};
		var _createLimitedNumberInput = function(iMaxLength){
			var oInput = oControls.addDefaultClass(new Input({
				value: {
					path: "/value",
					formatter: formatter.formatAmount
				},
				width: "100%",
				maxLength: iMaxLength? iMaxLength : 0
			}));
			oInput.attachLiveChange(function(oEvent){
				var bLegal = Tools.compareBigNumberUnderLimit(oEvent.getParameter("newValue"));
				if(bLegal){
					oInput.setValueState(sap.ui.core.ValueState.None);
					oInput.setValueStateText("");
				}else{
					oInput.setValueState(sap.ui.core.ValueState.Error);
					oInput.setValueStateText(Tools.getText("MSG_NUMBER_EXCED_LIMIT"));
				}
			});
			oInput.setModel(new JSONModel({value:""}));
			return oInput;
		};
		var oControls = {
			createHBox: function(){
				return new HBox({
					width: "100%"
				});
			},
			createVBox: function(){
				return new VBox({
					width: "100%"
				});
			},
			createSelectionBox: function(){
				return this.createHBox().addStyleClass("sapUiNoMargin noPadding");
			},
			createOperandBox: function(){
				return this.createVBox().addStyleClass("sapUiTinyMarginBottom operandBox");
			},
			createTaggedAmountBox: function(){
				return this.createVBox().addStyleClass("noPadding");
			},
			createOperandWholeSingleLineBox: function(){
				return this.createHBox().addStyleClass("sapUiNoMargin noPadding");
			},
			createSelectStatementBodyBox: function(){
				return this.createHBox().addStyleClass("sapUiNoMargin noPadding");
			},
			createActionsPositionBox: function(){
				return this.createHBox().setJustifyContent(sap.m.FlexJustifyContent.End).addStyleClass("sapUiNoMargin noPadding");
			},
			createTaggedAmountHeaderLabelBox: function(){
				return this.createHBox().addStyleClass("sapUiNoMargin taggedAmountHeaderBox");
			},
			createTaggedAmountHeaderBox: function(){
				return this.createHBox().addStyleClass("sapUiSmallMarginBottom taggedAmountHeaderBox");
			},
			createExpressionCompareLineBox: function(){
				return this.createHBox().addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom expressionComparisonLineBox");
			},
			createGrayLineBox: function(){
				return this.createHBox().addStyleClass("grayLineBox sapUiNoMargin noPadding");	
			},
			createTagBox: function(){
				return new TagBox();
			},
			createExpressionTagBox: function(){
				return this.createVBox().addStyleClass("sapUiNoMargin noPadding");
			},
			createExpressionTagBoxHeaderBox: function(){
				return this.createHBox().addStyleClass("sapUiNoMargin noPadding");
			},
			createOperandHeaderBox: function(){
				return this.createHBox().addStyleClass("sapUiNoMargin noPadding");
			},
			
			
			
			
			
			
			addDefaultClass: function(oControl){
				return oControl.addStyleClass("sapUiNoMarginTop sapUiNoMarginBottom noPadding baseMargin");
			},
			createBlankPosition: function(){
				return this.addDefaultClass(new Label({
					text: "", 
					width: "100%"
				}));
			},
			createCheckBox: function(sText){
				return new CheckBox({
					text: sText
				});
			},
			createLabel: function(sTextKey, aPara){
				return this.addDefaultClass(new Input({
					value: Tools.getText(sTextKey, aPara), 
					editable: false,
					width: "100%",
					textDirection: sap.ui.core.TextDirection.RTL
				})).addStyleClass("noBorderInput");
			},
			createLabelCenter: function(sTextKey, aPara){
				return this.addDefaultClass(new Label({
					text: Tools.getText(sTextKey, aPara), 
					width: "100%",
					textAlign: sap.ui.core.TextAlign.Center,
					textDirection: sap.ui.core.TextDirection.RTL
				})).addStyleClass("noBorderInput");
			},
			adjustSelect: function(oSelect){
				oSelect.bEditable = true;
				oSelect.setEditable = function(bEditable){
					this.bEditable = bEditable;
					this.setEnabled(bEditable);
				};
				oSelect.onAfterRendering = function(){
					oSelect.setEditable(oSelect.bEditable);
				};
				return oSelect;
			},
			createSelect: function(){
				var oSelect = new Select({
					forceSelection: false,
					width: "100%"
				});
				return this.adjustSelect(oSelect);
			},
			createMultiComboBox: function(aData, sPath){
				var oBox = new sap.m.MultiComboBox({
					width: "100%"
				});
				oBox.setModel(new JSONModel(aData))
					.bindAggregation("items",{
						path: sPath,
						template: new sap.ui.core.Item({
							key: "{key}",
							text: "{text}"
						})
					});
				return oBox;
			},
			createComboBox: function(){
				var oBox =  new sap.m.ComboBox({
					width: "100%",
					showSecondaryValues: true
				}).attachChange(function(oEvent){
					var oComboBox = oEvent.getSource();
					if(!oComboBox.getKeys().includes(oEvent.getParameter("newValue"))){
						oComboBox.setValue();
					}
				});
				oBox.filterItems = function(mOptions, aItems) {
				    var aProperties = mOptions.properties,
				        sValue = mOptions.value,
				        bEmptyValue = sValue === "",
				        bMatch = false,
				        bTextMatch = false,
				        aMutators = [],
				        aFilteredItems = [],
				        oItem = null;
				    var fuzzySearch = function(str, sKeyWord){
				        var oReg = new RegExp(sKeyWord, 'i');
				        return oReg.test(str);
				    };
				    this._oFirstItemTextMatched = null;
				
				    aProperties.forEach(function(property){
				        aMutators.push("get" + property.charAt(0).toUpperCase() + property.slice(1));
				    });
				
				    aItems = aItems || this.getItems();
				
				    for (var i = 0; i < aItems.length; i++) {
				        oItem = aItems[i];
				
				        // the item match with the value
				        bMatch = bEmptyValue;
				        for (var j = 0; j < aMutators.length; j++) {
				            if (fuzzySearch(oItem[aMutators[j]](), sValue)) {
				                bMatch = true;
				                if (aMutators[j] === "getText") {
				                    bTextMatch = true;
				                }
				            }
				        }
				
				        if (bMatch) {
				            aFilteredItems.push(oItem);
				        }
				
				        if (!this._oFirstItemTextMatched && bTextMatch) {
				            this._oFirstItemTextMatched = oItem;
				        }
				
				        this._setItemVisibility(oItem, bMatch);
				    }
				
				    return aFilteredItems;
				};
				oBox.oninput = function(oEvent) {
				    sap.m.ComboBoxBase.prototype.oninput.apply(this, arguments);
				
				    // notice that the input event can be buggy in some web browsers,
				    // @see sap.m.InputBase#oninput
				    if (oEvent.isMarked("invalid")) {
				        return;
				    }
				
				    var bToggleOpenState = (this.getPickerType() === "Dropdown");
				    var fuzzySearch = function(str, sKeyWord){
				        var oReg = new RegExp(sKeyWord, 'i');
				        return oReg.test(str);
				    };
				    var fnSelectTextIfFocused = function (iStart, iEnd) {
				        if (document.activeElement === this.getFocusDomRef()) {
				            this.selectText(iStart, iEnd);
				        }
				    };
				    this.loadItems(function() {
				        var oSelectedItem = this.getSelectedItem(),
				            sValue = oEvent.target.value,
				            bEmptyValue = sValue === "",
				            oControl = oEvent.srcControl,
				            aVisibleItems;
				
				        if (bEmptyValue && !this.bOpenedByKeyboardOrButton) {
				            aVisibleItems = this.getItems();
				        } else {
				            aVisibleItems = this.filterItems({
				                properties: this._getFilters(),
				                value: sValue
				            });
				        }
				        var bItemsVisible = !!aVisibleItems.length;
				        var oFirstVisibleItem = aVisibleItems[0]; // first item that matches the value
				        if (!bEmptyValue && oFirstVisibleItem && oFirstVisibleItem.getEnabled()) {
				            if (oControl._bDoTypeAhead) {
				            	fnSelectTextIfFocused.call(oControl, sValue.length, oControl.getValue().length);
				            }
				        }
				
				        if (bEmptyValue || !bItemsVisible ||
				            (!oControl._bDoTypeAhead && (this._getSelectedItemText() !== sValue))) {
				            this.setSelection(null);
				
				            if (oSelectedItem !== this.getSelectedItem()) {
				                this.fireSelectionChange({
				                    selectedItem: this.getSelectedItem()
				                });
				            }
				        }
				
				        this._sInputValueBeforeOpen = sValue;
				
				        if (this.isOpen()) {
				            this._highlightList(sValue);
				        }
				
				        if (bItemsVisible) {
				            if (bEmptyValue && !this.bOpenedByKeyboardOrButton) {
				                this.close();
				            } else if (bToggleOpenState) {
				                this.open();
				                this.scrollToItem(this.getSelectedItem());
				            }
				        } else if (this.isOpen()) {
				            if (bToggleOpenState && !this.bOpenedByKeyboardOrButton) {
				                this.close();
				            }
				        } else {
				            this.clearFilter();
				        }
				    }, {
				        name: "input",
				        busyIndicator: false
				    });
				
				    // if the loadItems event is being processed,
				    // we need to open the dropdown list to show the busy indicator
				    if (this.bProcessingLoadItemsEvent && bToggleOpenState) {
				        this.open();
				    }
				};
				oBox._highlightList = function(sValue, aItems) {
					if(!aItems){
						aItems = this.filterItems({
				            properties: this._getFilters(),
				            value: sValue
				        });
					}
				    var iInitialValueLength = sValue.length,
				        sValue = sValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
				        oRegex = new RegExp(sValue, "i");
				
				    aItems.forEach(function (oItem) {
				        var oItemDomRef = oItem.getDomRef(),
				            oItemAdditionalTextRef, oItemTextRef;
				
				        // when loadItems is used the items are not rendered but picker is opened
				        if (oItemDomRef === null) {
				            return;
				        }
				        oItemAdditionalTextRef = oItemDomRef.children[1];
				        oItemTextRef = Array.prototype.filter.call(oItemDomRef.children, function(oChildRef) {
				                return oChildRef.tagName.toLowerCase() !== "b";
				            })[0] || oItemDomRef;
						var sTxt = "innerHTML";
				        oItemTextRef[sTxt] = this._boldItemRef(oItem.getText(), oRegex, iInitialValueLength);
				
				        if (oItemAdditionalTextRef && oItem.getAdditionalText) {
				            oItemAdditionalTextRef[sTxt] = this._boldItemRef(oItem.getAdditionalText(), oRegex, iInitialValueLength);
				        }
				    }, this);
				};
				oBox._boldItemRef = function (sItemText, oRegex, iInitialValueLength) {
				    var sResult;
				
				    var sTextReplacement = "<b>" + jQuery.sap.encodeHTML(sItemText.slice(sItemText.match(oRegex).index, sItemText.match(oRegex).index + iInitialValueLength)) + "</b>";
				
				    // parts should always be max of two because regex is not defined as global
				    // see above method
				    var aParts = sItemText.split(oRegex);
				
				    if (aParts.length === 1) {
				        // no match found, return value as it is
				        sResult = jQuery.sap.encodeHTML(sItemText);
				    } else {
				        sResult = aParts.map(function (sPart) {
				            return jQuery.sap.encodeHTML(sPart);
				        }).join(sTextReplacement);
				    }
				
				    return sResult;
				};
				return oBox;
			},
			createInput: function(iMaxLength){
				return this.addDefaultClass(new Input({
					width: "100%",
					maxLength: iMaxLength? iMaxLength : 0
				}));
			},
			createSingleF4: function(oInfo, oModel, bEdit, fnChange, iMaxLength, sTitle, bValueHelpOnly){
				return _createF4(oInfo, oModel, bEdit, fnChange, iMaxLength, sTitle, bValueHelpOnly, "handleValueHelpRequest");
			},
			createSingleF4ForAdditionalAttrSelection: function(oInfo, oModel, bEdit, fnChange, iMaxLength, sTitle){
				return _createF4(oInfo, oModel, bEdit, fnChange, iMaxLength, sTitle, true, "handleValueHelpRequestForAdditionalAttr");
			},
			createSingleF4ForHierarchy: function(oInfo, oModel, bEdit, fnChange, iMaxLength, sTitle, bValueHelpOnly){
				return _createF4(oInfo, oModel, bEdit, fnChange, iMaxLength, sTitle, true, "handleValueHelpRequestForHierarchy");
			},
			createSelectionInput: function(oInfo, oModel, bEdit, fnChange, iMaxLength, sTitle, bValueHelpOnly){
				var oInput = this.addDefaultClass(new Input({
					maxLength: iMaxLength? iMaxLength : 0,
                    editable: bEdit,
                    showValueHelp: bEdit,
                    valueHelpOnly: bValueHelpOnly ? true : false,
                    valueHelpRequest: function(oControllEvent) {
			            var oVHhandler = new ValueHelpHandler();
			            var sSearchHelpFieldPath = "/DynamicSearchHelpFieldSet";
			
			            var oParam = {
			            	filters: [new sap.ui.model.Filter("ShlpName", sap.ui.model.FilterOperator.EQ, oInfo.Shlpname)],
			                success: function(oData) {
			                    sap.ui.core.BusyIndicator.hide();
			                    oVHhandler.handleValueHelpRequest(oInput, oModel, sTitle, oData.results, oInfo);
			                }
			            };
			            oModel.read(sSearchHelpFieldPath, oParam);
			            sap.ui.core.BusyIndicator.show();
                    }
                }));
                // oInput.attachChange(fnChange);
                oInput.attachLiveChange(fnChange);
                return oInput;
			},
			createMultiF4: function(oInfo, oModel, bEdit, fnChange, iMaxLength, sTitle){
				var oInput = this.addDefaultClass(new MultiInput({
                    editable: bEdit,
                    maxLength: iMaxLength? iMaxLength : 0,
                    showValueHelp: bEdit,
                    valueHelpOnly: false,
                    valueHelpRequest: function(oControllEvent) {
			            var oVHhandler = new ValueHelpHandler();
			            var sSearchHelpFieldPath = "/DynamicSearchHelpFieldSet";
			
			            var oParam = {
			            	filters: [new sap.ui.model.Filter("ShlpName", sap.ui.model.FilterOperator.EQ, oInfo.Shlpname)],
			                success: function(oData) {
			                    sap.ui.core.BusyIndicator.hide();
			                    oVHhandler.handleValueHelpRequest(oInput, oModel, sTitle, oData.results, oInfo);
			                }
			            };
			            oModel.read(sSearchHelpFieldPath, oParam);
			            sap.ui.core.BusyIndicator.show();
                    }
                }));
                oInput.attachTokenUpdate(fnChange);
                return oInput;
			},
			
			// add heli 20201029
			createRuleMulti:function(oInfo,oModel,bEdit,fnChange,iMaxLength,sTitle){
				var oInput = this.addDefaultClass(new MultiInput({
                    editable: bEdit,
                    maxLength: iMaxLength? iMaxLength : 0,
                    showValueHelp: bEdit,
                    valueHelpOnly: false,
                    valueHelpRequest: function(oControllEvent) {
			            var oVHhandler = new ValueHelpHandler();
			            var sSearchHelpFieldPath = "/DynamicSearchHelpFieldSet";
			
			            var oParam = {
			            	filters: [new sap.ui.model.Filter("ShlpName", sap.ui.model.FilterOperator.EQ, oInfo.Shlpname)],
			                success: function(oData) {
			                    sap.ui.core.BusyIndicator.hide();
			                    oVHhandler.handleValueHelpRequest(oInput, oModel, sTitle, oData.results, oInfo);
			                }
			            };
			            oModel.read(sSearchHelpFieldPath, oParam);
			            sap.ui.core.BusyIndicator.show();
                    }
                }));
                oInput.attachTokenUpdate(fnChange);
                return oInput;
			}
			// end add
			,
			createSmartField: function(oInfo, fnChange){
				var oField = new SmartField({
					entitySet: oInfo.entitySet,
					value: oInfo.value,
					width: "100%"
				});
				oField.setModel(oInfo.model);
				oField.attachChange(fnChange);
				this.addDefaultClass(oField);
				return oField;
			},
			createCustomizeSmartField: function(oInfo, sFilterType, fnChange){
				var oControl = new SmartFilterBar({
					entitySet: oInfo.entitySet,
					controlConfiguration: [new sap.ui.comp.smartfilterbar.ControlConfiguration({
						filterType: sFilterType,
						key: oInfo.key,
						visible: true,
						groupId: "_BASIC"
					})]
				}).setModel(oInfo.model);
				// var that = this;
				oControl.onAfterRendering  = function(){
					var oInputHTML = $("#" + this.getId() + "-filterItemControl_BASIC-" + oInfo.key)[0];
					var oElement = $("#" + this.getId())[0];
					if(oElement.replaceWith){
						oElement.replaceWith(oInputHTML);
					}
					var oInput = sap.ui.getCore().byId(oInputHTML.getAttribute("id"));
					oInput.attachChange(fnChange);
					oInput.setEditable(this.bEditable);
					this.setEditable = function(bEditable){
						this.bEditable = bEditable;
						oInput.setEditable(bEditable);
					};
					this.setVisible = function(bVisible){
						this.bVisible = bVisible;
						this.setVisibleOld(bVisible);
						oInput.setVisible(bVisible);
					};
					this.setVisible(this.bVisible);
					this.setFilterData(this.value);
				};
				oControl.setEditable = function(bEditable){
					this.bEditable = bEditable;
				};
				oControl.setVisibleOld = oControl.setVisible;
				oControl.setVisible = function(bVisible){
					this.bVisible = bVisible;
				};
				oControl.setValue = function(value){
					this.value = value;
				};
				
				oControl.bEditable = true;
				return oControl;
			},
			createAmountInput: function(iMaxLength){
				var oInput = _createLimitedNumberInput(iMaxLength);
				oInput.setPlaceholder(Tools.getText("PLACE_AMOUNT"));
				return oInput;
			},
			createDescriptionInput: function(){
				var oInput = this.createInput();
				oInput.setType(sap.m.InputType.Text);
				oInput.setPlaceholder(Tools.getText("PLACE_DESCRIPTION"));
				return oInput;
			},
			createDecimalInput: function(){
				var oInput = this.createInput();
				oInput.setPlaceholder(Tools.getText("PLACE_DECIMAL"));
				return oInput;
			},
			createCurrencyInput: function(){
				var oInput = this.createComboBox();
				oInput.setPlaceholder(Tools.getText("PLACE_CURRENCY"));
				return oInput;
			},
			createNumberInput: function(iMaxLength){
				var oInput = _createLimitedNumberInput(iMaxLength);
				oInput.setPlaceholder(Tools.getText("PLACE_NUMBER"));
				return oInput;
			},
			createMutiInput: function(){
				return this.addDefaultClass(new MultiInput({
					width: "100%"
				}));
			},
			createToken: function(sValue){
				return new Token({
					selected: false,
					key: sValue,
					text: sValue
				});
			},
			createLineAddButton: function(){
				return new Button({
					text: "",
					icon: "sap-icon://add",
					type: "Transparent", 
					width: "100%"
				});
			},
			createLineDeleteButton: function(){
				return new Button({
					text: "",
					icon: "sap-icon://sys-cancel",
					type: "Reject", 
					width: "100%"
				}).addStyleClass("redButtonIcon");
			},
			createOperandDeleteButton: function(){
				return new Button({
					text: Tools.getText("BUTTON_DELETE"),
					type: "Transparent", 
					width: "100%"
				});
			},
			updateTokens: function(oMutiInput, aValues){
				if(aValues && aValues instanceof Array){
					oMutiInput.removeAllTokens();
					for(var i = 0; i < aValues.length; i ++){
						oMutiInput.addToken(this.createToken(aValues[i]));
					}
				}
			},
			createLabelBegin: function(sTextKey, aPara){
				return new Label({
					text: Tools.getText(sTextKey, aPara),
					width: "100%",
					textAlign: sap.ui.core.TextAlign.Left
				});
			},
			createLabelFor: function(sText, sId, bRequred, sAlign, sLabelID){
				var sLabelIDDefault = "";
				if(sLabelID){
					sLabelIDDefault = sLabelID;
				}
				return this.addDefaultClass(new Label(sLabelIDDefault, {
					text: sText, 
					width: "100%",
					textAlign: sAlign === undefined? sap.ui.core.TextAlign.Right : sAlign,
					labelFor: sId,
					required: bRequred? true : false
				}));
			},
			createMessagePopOver: function(){
				var oMessageTemplate = new MessageItem({
					type: "{type}",
					title: '{title}',
					description: "{message}",
					subtitle: "{subtitle}",
					groupName: "{groupName}",
					longtextUrl: "{longtextUrl}",
					markupDescription: true
				});

				var oMessagePopover = new MessagePopover({
					items: {
						path: '/',
						template: oMessageTemplate
					}
				});
				oMessagePopover.setModel(new JSONModel([]));
				return oMessagePopover;
			},
			createWhereUsedTable: function(oController){
				var oColumnTemplate = new ColumnListItem({
	                cells : [new sap.m.Link({
						text : "{MethodId}",
	                    press: function(oEvent){
	                    	var oBinding = oEvent.getSource().getBindingContext();
	                    	var oData = oBinding.getProperty(oBinding.getPath());
	                    	var oNavigationHandler = new NavigationHandler(oController);
							oNavigationHandler.navigate(
								"FinancialValidationMethod", 
								"validationMethodMaintenance", 
								{
									MtdId: oData.MethodId,
									ScenId: oData.ScenId,
									State: oData.State,
								}, {}, function(){}
							);
	                    }
					}),
					new ObjectStatus({
						text : {
					      path: "State",  
					      formatter: formatter.methodStateTextConvert
						},
						state : {
							path: "State", 
							formatter: formatter.methodStateColorConvert
						}
					}),
					new Text({
						text : "{MethodDescrS}"
					})]
	            });
	            var oTable = new Table({
					columns : [new sap.m.Column({
		                header : new sap.m.Label({
		                    text : Tools.getText("COL_METHOD_ID")
		                })
		            }), new sap.m.Column({
		                header : new sap.m.Label({
		                    text : Tools.getText("COL_METHOD_STATE")
		                })
		            }), new sap.m.Column({
		                header : new sap.m.Label({
		                    text : Tools.getText("COL_METHOD_DESCRIPTION")
		                })
		            })]
				});
				oTable.bindItems("/", oColumnTemplate);
				return oTable;
			},
			createWarningWithWhereUsedList: function(fnCallBack, sText, oController){
				var oText = sText ? new Text({
					text: Tools.getText("MSG_SELECTION_HAS_BEEN_USED")
				}) : new Text({
					text: sText
				});
				oText.addStyleClass("sapUiMediumMarginBottom");
				var oWhereUsedListDialog = new Dialog({
					title: Tools.getText("TITLE_WARNING"),
					type: 'Message',
					state: 'Warning',
					resizable: true,
					content: [
						oText,
						this.createWhereUsedTable(oController)
					],
					beginButton: new Button({
						text: Tools.getText("TEXT_BUSINESS_ENABLE_YES"),
						press: function () {
							if(fnCallBack){
								fnCallBack();
							}
							this.getParent().close();
						}
					}),
					endButton: new Button({
						text: Tools.getText("BUTTON_CLOSE"),
						press: function () {
							this.getParent().close();
						}
					})
				});
				
				return oWhereUsedListDialog;
			},
			createWhereUsedList: function(oController){
				return new Dialog({
					title: Tools.getText("TITLE_WHERE_USED_LIST"),
					resizable: true,
					content: this.createWhereUsedTable(oController),
					beginButton: new Button({
						text: Tools.getText("BUTTON_CLOSE"),
						press: function () {
							this.getParent().close();
						}
					})
				});
			},
			createMessageView: function(){
				var oBackButton;
				var oMessageTemplate = new MessageItem({
					type: "{type}",
					title: '{title}',
					description: "{message}",
					subtitle: "{subtitle}",
					groupName: "{groupName}",
					longtextUrl: "{longtextUrl}",
					markupDescription: true
				});
				var oMessageView = new MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: "/",
						template: oMessageTemplate
					}
				});
				oBackButton = new Button({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						oMessageView.navigateBack();
						this.setVisible(false);
					}
				});
				var oDialog = new Dialog({
					resizable: true,
					content: oMessageView,
					state: 'Error',
					beginButton: new sap.m.Button({
						press: function () {
							this.getParent().close();
						},
						text: Tools.getText("BUTTON_CLOSE")
					}),
					customHeader: new sap.m.Bar({
						contentMiddle: [
							new sap.m.Text({ text: Tools.getText("MSG_TITLE_ERROR")})
						],
						contentLeft: [oBackButton]
					}),
					contentHeight: "300px",
					contentWidth: "500px",
					verticalScrolling: false
				});
				oMessageView.setModel(new JSONModel([]));
				return oDialog;
			},
			createMessageStrip: function(sText, sType){
				return new MessageStrip({
					text: sText,
					showCloseButton: true,
					showIcon: true,
					type: sType
				});
			},
			createUITable: function(oData, sPath, aColumnInfo){
				var aColumns = [];
				for(var i = 0; i < aColumnInfo.length; i ++){
					aColumns.push(new sap.ui.table.Column({
						label: aColumnInfo[i].label, 
						template: aColumnInfo[i].template,
						width: aColumnInfo[i].width? aColumnInfo[i].width : "auto"
					}));
				}
				var oTable = new UITable({
					enableSelectAll: false,
					visibleRowCount: 5,
					selectionMode: sap.ui.table.SelectionMode.None,
	                columns: aColumns
	            });
	            var oModel = new sap.ui.model.json.JSONModel();
	            oModel.setData(oData);
	            oTable.setModel(oModel);
	            oTable.bindRows(sPath);
	            return oTable.addStyleClass("sapUiSmallMargin");
			},
			createDisplayMenuButton: function(sDefaultText){
				var oMenuButton = new MenuButton({
					text: sDefaultText, 
					buttonMode: "Regular",
					menu: new Menu()
				}).addStyleClass("MenuButtonCustom");
				oMenuButton.setDisplayText = function(sText){
		        	this.setText(sText);
		        	this.setTooltip(sText);
		        }.bind(oMenuButton);
				return oMenuButton;
			},
			createTreeMenuButton: function(sDefaultText, oJSONModel, sPath, fnOnItemSelected, fnAdditionalDataOnItem){
				var oMenuButton = new MenuButton({
					text: sDefaultText, 
					buttonMode: "Regular",
					menu: new Menu({
						itemSelected: function(oEvent){
							fnOnItemSelected(oEvent);
						}
					})
				}).addStyleClass("MenuButtonCustom");
				var aData = sPath === "" ? oJSONModel.getData() : oJSONModel.getData()[sPath];
				if(aData){
					var oMenu = oMenuButton.getMenu();
					var fnReverseBuildItem = function(oData, oItem){
						if(oData[sPath] && oData[sPath].length > 0){
							for(var j = 0; j < oData[sPath].length; j ++){
								var oNewItem = new MenuItem({
									icon: oData[sPath][j].icon,
									text: oData[sPath][j].text
								});
								fnAdditionalDataOnItem(oNewItem, oData[sPath][j]);
								// oNewItem.data("key", oData[sPath][j].key);
								fnReverseBuildItem(oData[sPath][j], oNewItem);
								oItem.addItem(oNewItem);
							}
						}
					};
					for(var i = 0; i < aData.length; i ++){
						var oItem = new MenuItem({
							icon: aData[i].icon,
							text: aData[i].text
						});
						fnAdditionalDataOnItem(oItem, aData[i]);
						// oItem.data("key", aData[i].key);
						fnReverseBuildItem(aData[i], oItem);
						oMenu.addItem(oItem);
					}
			        oMenuButton.setMenu(oMenu);
				}
				
		        oMenuButton.setDisplayText = function(sText){
		        	this.setText(sText);
		        	this.setTooltip(sText);
		        }.bind(oMenuButton);
				return oMenuButton;
			},
			createCodeDisplaySQL: function(sSQL){
				var sFormattedSQL = SQLFormatter.sqlFormatter({
                    keyword_case: "upper",
                    identifier_case: null,
                    strip_comments:  false,
                    reindent: true,
                    indent_tabs: false,
                    indent_width: 2,
                    truncate_strings: null,
                    truncate_char: "..."
                }).format(sSQL);
                var oCodeEditor = new CodeEditor({
                	type: "sql",
                	height: "500px",
                	lineNumbers: false,
                	width: "700px",
                	editable: false,
                	colorTheme: "default",
                	value: sFormattedSQL[0]
                });
                var oDialog = new Dialog({
					title: Tools.getText("TITLE_EXPERT_MODE_SQL"),
					width: "100%",
					resizable: true,
					draggable: true,
					content: oCodeEditor,
					beginButton: new Button({
						text: Tools.getText("BUTTON_CLOSE"),
						press: function () {
							this.getParent().close();
							this.getParent().destroy();
						}
					})
				});
				oDialog.attachAfterOpen(function(){
					sap.ui.core.ResizeHandler.register(oDialog, function(oEvent){
						oCodeEditor.destroy();
						oCodeEditor = new CodeEditor({
		                	type: "sql",
		                	height: "500px",
		                	lineNumbers: false,
		                	width: "100%",
		                	editable: false,
		                	colorTheme: "default",
		                	value: sFormattedSQL[0]
		                });
						oDialog.addContent(oCodeEditor);
					});
				});
				
				return oDialog;
			},
			createDisplaySingleRuleButton:function(){
				
				return new Button({
					text: "",
					icon: "sap-icon://search",
					type: "Default", 
					width: "100%"
				});
				
			}
		};
		return oControls;
	}
);