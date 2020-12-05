sap.ui.define([	
	"sap/ui/model/resource/ResourceModel",
	"sap/m/FlexItemData",
	"sap/ui/layout/GridData",
	"sap/ui/model/json/JSONModel",
	"fin/cons/vecrule/util/Const",
    "sap/ui/thirdparty/bignumber",
    "sap/ui/core/format/NumberFormat"
	] , function (ResourceModel, FlexItemData, GridData, JSONModel, Const, BigNumber, NumberFormat) {
		"use strict";
		var _oi18nLibModel                               = null,
			_oDataSourceModel                            = null,
			_oDefaultNewUISelectionWholeLineParameter    = null,
			_oDefaultNewUISelectionParameter             = null,
			_oDefaultNewUISelectStatementUIParameter     = null,
			_oDefaultNewUIRuleParameter                  = null,    // add heli 20201030
			_oDefaultNewUIHeaderParameter                = null,
			
			_oCharaterSelectBindingInfo                  = null,
			_oKeyFigureSelectBindingInfo                 = null,
			_oDefaultCharaterSelectBindingInfo           = null,
			_oDefaultKeyFigureSelectBindingInfo          = null,
			_oControlLevelBindingInfo                    = null,
			_oCharaterFieldsInfo                         = null,
			
			_oOperandOperatorJSONModel                   = null,
			_oOperandOperators                           = null,
			_oOperandTypes                               = null,
			_oOperandTypeJSONModel                       = null,
			_oOperandMathFunctions                       = null,
			_oOperandMathFunctionsJSONModel              = null,
			_oExpressionCompareOperators                 = null,
			
			_oDetailView                                 = null,
			_sScenId                                     = "",
			
			_oF4SearchHelpInfo                           = null,
			
			_aCharatersFieldsData                        = [];
			
		var oTools                                       = null;
		
		var _fnGetText                                   = null,
			_fnParseNumber                               = null,
			_fnGetExpressionLevel                        = null,
			_fnGetSimpleExpressionLevel                  = null,
			_fnXmlToJson                                 = null,
			_fnXmlStringToXml                            = null,
			_fnLiveChangeEventHandler                    = null;
		
		
		_oF4SearchHelpInfo = {
			/*"FinancialStatementItem": {
				model: oDataModel,
				entitySet: ""
			}*/
		};
		_oCharaterFieldsInfo = {
			
		};
		_fnGetText = function(sTextId, aPara){
			if (!_oi18nLibModel) {
				var textBundle = {
					bundleName: "fin.cons.vecrule.i18n.i18n",
					bundleLocale: sap.ui.getCore().getConfiguration().getFormatLocale()
				};
				_oi18nLibModel = new ResourceModel(textBundle);
			}
			return _oi18nLibModel.getResourceBundle().getText(sTextId, aPara);
		};
		_fnParseNumber = function(Number){
			var sNumber = Number + "";
			var oInstance = NumberFormat.getCurrencyInstance({parseAsString:true});
			if (sNumber === "" || sNumber === null) {
				return oInstance.parse("0")[0] + "";
			}
			var sResult = oInstance.parse(sNumber);
			if(!sResult){
				return oInstance.parse("0")[0] + "";
			}else{
				return sResult[0] + "";
			}
		};
		_oDefaultNewUIHeaderParameter = {
			wholeLineBox:           {minWidth: "100%"   , maxWidth: "100%"   , baseSize: "100%"   , styleClass: "sapUiNoMargin",                                                       order: 1 },
			descriptionLabel:       {minWidth: "10%"    , maxWidth: "10%"    , baseSize: "10%"    , styleClass: "percentageUiTinyMarginEnd alignedLabel",                              order: 0 },
			descriptionInput:       {minWidth: "30%"    , maxWidth: "30%"    , baseSize: "30%"    , styleClass: "percentageUiTinyMarginEnd",                                           order: 2 },
			mathFunctionSelect:     {minWidth: "15%"    , maxWidth: "15%"    , baseSize: "15%"    , styleClass: "percentageUiTinyMarginEnd alignedLabel",                              order: 4 },
			decimalPlacesInput:     {minWidth: "10%"    , maxWidth: "10%"    , baseSize: "10%"    , styleClass: "percentageUiTinyMarginEnd alignedLabel",                              order: 5 }
		};
		_oDefaultNewUISelectStatementUIParameter = {
			wholeLineBox:			{minWidth: "100%"   , maxWidth: "100%"   , baseSize: "100%"   , styleClass: "sapUiNoMargin",                                                       order: 2 },
			operandTypeLabel:       {minWidth: "10.00%" , maxWidth: "10.00%" , baseSize: "10.00%" , styleClass: "percentageUiTinyMarginEnd alignedLabel",                              order: 1 },
			operandTypeSelect:		{minWidth: "12%"    , maxWidth: "12%"    , baseSize: "12%"    , styleClass: "percentageUiTinyMarginEnd",                                           order: 2 },
			keyfigureSelect:  		{minWidth: "17%"    , maxWidth: "17%"    , baseSize: "17%"    , styleClass: "percentageUiTinyMarginEnd",                                           order: 3 },
			reusecheckbox:          {minWidth: "17%"    , maxWidth: "17%"    , baseSize: "17%"    , styleClass: "percentageUiTinyMarginEnd",                                           order: 4 },
			amountInput:	    	{minWidth: "17.62%" , maxWidth: "17.62%" , baseSize: "17.62%" , styleClass: "percentageUiTinyMarginEnd",                                           order: 5 },
			currencyInput:      	{minWidth: "8.5%"   , maxWidth: "8.5%"   , baseSize: "8.5%"   , styleClass: "percentageUiTinyMarginEnd",                                           order: 6 },
			numberInput:        	{minWidth: "17.62%" , maxWidth: "17.62%" , baseSize: "17.62%" , styleClass: "percentageUiTinyMarginEnd",                                           order: 7 }
		};
		// add heli 20201030
		_oDefaultNewUIRuleParameter = {
			wholeLineBox:           {minWidth: "100%"   , maxWidth: "100%"   , baseSize: "100%"   , styleClass: "sapUiNoMargin",                                                       order: 1 },
			rulesLabel:             {minWidth: "10%"    , maxWidth: "10%"    , baseSize: "10%"    , styleClass: "percentageUiTinyMarginEnd alignedLabel",                              order: 0 },
			rulesInput:             {minWidth: "15%"    , maxWidth: "15%"    , baseSize: "15%"    , styleClass: "percentageUiTinyMarginEnd",                                           order: 2 },
			ruleDescrLabel:         {minWidth: "32%"    , maxWidth: "60%"    , baseSize: "32%"    , styleClass: "percentageUiTinyMarginEnd",                                           order: 3 },
		    ruleOverviewButton:     {minWidth: "120px"    , maxWidth: "120px"    , baseSize: "120px"    , styleClass: "sapUiNoMargin",                                                       order: 4 }	
		};
		// add heli
		_oDefaultNewUISelectionWholeLineParameter = {
			wholeLine:              {minWidth: "100%"   , maxWidth: "100%"   , baseSize: "100%"   , styleClass: "sapUiNoMargin",                                                       order: 3},
			firstPosition:		    {minWidth: "10%"    , maxWidth: "10%"    , baseSize: "10%"    , styleClass: "percentageUiTinyMarginEnd alignedLabel",	                           order: 1 },
			bodyPosition:		    {minWidth: "80%"    , maxWidth: "80%"    , baseSize: "80%"    , 							                                                       order: 2 },
			selectionInput:		    {minWidth: "46%"    , maxWidth: "46%"    , baseSize: "46%"    , 							                                                       order: 4 },
			lastPosition: {
				box:		        {minWidth: "10%"    , maxWidth: "10%"    , baseSize: "10%"    , styleClass: "sapUiNoMargin",                                                       order: 5 },
				addButton:		    {minWidth: "25%"    , maxWidth: "25%"    , baseSize: "25%"    , styleClass: "sapUiNoMargin",		                                               order: 1 },
				deleteButton:       {minWidth: "25%"    , maxWidth: "25%"    , baseSize: "25%"    , styleClass: "sapUiNoMargin",		                                               order: 2 },
				blankPosition:      {minWidth: "50%"    , maxWidth: "50%"    , baseSize: "50%"    , styleClass: "sapUiNoMargin",		                                               order: 3 }
			}
		};
		_oDefaultNewUISelectionParameter = {
			characterSelect:	    {minWidth: "37.50%" , maxWidth: "37.50%" , baseSize: "37.50%" , styleClass: "percentageUiTinyMarginEnd",                                           order: 1 },//24.18
			operatorSelect: 	    {minWidth: "19.00%" , maxWidth: "19.00%" , baseSize: "19.00%" , styleClass: "percentageUiTinyMarginEnd",                                           order: 2 },//11.70
			changeableParts: {
				mutiValueInput:     {minWidth: "41.13%" , maxWidth: "41.13%" , baseSize: "41.13%" , styleClass: "percentageUiTinyMarginEnd",                                           order: 3 },//32.53873
				valueInput: 	    {minWidth: "41.13%" , maxWidth: "41.13%" , baseSize: "41.13%" , styleClass: "percentageUiTinyMarginEnd",                                           order: 4 },//32.53873
				fromValueInput:     {minWidth: "15.34%" , maxWidth: "15.34%" , baseSize: "15.34%" , styleClass: "percentageUiTinyMarginEnd",                                           order: 5 },//12.5
				toLabel:            {minWidth: "8.32%"  , maxWidth: "8.32%"  , baseSize: "8.32%"  , styleClass: "percentageUiTinyMarginEnd",  alignSelf: sap.m.FlexAlignSelf.Center,   order: 6 },//6
				toValueInput:	    {minWidth: "15.34%" , maxWidth: "15.34%" , baseSize: "15.34%" , styleClass: "percentageUiTinyMarginEnd",                                           order: 7 }//12.5
			}
		};
		
		
		_oDefaultCharaterSelectBindingInfo = {
			model: new JSONModel({
				characters: [{
					text: "Account",
					key: "RACCT"
				},{
					text: "Transaction Type",
					key: "RMVCT"
				},{
					text: "Trading Partner ",
					key: "TP"
				}]
			}),
			path: "characters"
		};
		_oDefaultKeyFigureSelectBindingInfo = {
			model: new JSONModel({
				keyFigures: [{
					text: "YTD",
					key: "YTD"
				},{
					text: "Current Period",
					key: "CPeri"
				},{
					text: "Previous Period",
					key: "PPeri"
				},{
					text: "Transaction Currency",
					key: "TCURR"
				}]
			}),
			path: "/keyFigures"
		};
		
		_oOperandOperators = {
			Operators: [{
				text: "+",
				key: "+"
			},{
				text: "-",
				key: "-"
			},{
				text: "*",
				key: "*"
			},{
				text: "/",
				key: "/"
			}]
		};
		_oOperandOperatorJSONModel = new JSONModel(_oOperandOperators);
		_oOperandTypes = {
			Types: [{
				text: _fnGetText("ITEM_SUM"),
				key: Const.OPERAND_TYPE_SUM
			},{
				text: _fnGetText("ITEM_AMOUNT"),
				key: Const.OPERAND_TYPE_AMOUNT
			},{
				text: _fnGetText("ITEM_NUMBER"),
				key: Const.OPERAND_TYPE_NUMBER
			},{
				text: _fnGetText("ITEM_QUANTITY"),
				key: Const.OPERAND_TYPE_QUANTITY
			}]
		};
		_oOperandTypeJSONModel = new JSONModel(_oOperandTypes);
		_oOperandMathFunctions = {
			MathFunctions: [{
				text: "f(x)",
				key: ""
			},{
				text: "ABS",
				key: "ABS"
			},{
				text: "Sign",
				key: "SIGN"
			},{
				text: "Round 0",
				key: "ROUND 0"
			},{
				text: "Round 1",
				key: "ROUND 1"
			},{
				text: "Round 2",
				key: "ROUND 2"
			}]
		};
		_oOperandMathFunctionsJSONModel = new JSONModel(_oOperandMathFunctions);
		_oControlLevelBindingInfo = {
			model: new JSONModel([{
				text: _fnGetText("TXT_CONTROL_LEVEL_ERROR"),
				key: "E"
			},{
				text: _fnGetText("TXT_CONTROL_LEVEL_WARNING"),
				key: "W"
			},{
				text: _fnGetText("TXT_CONTROL_LEVEL_INFORMATION"),
				key: "I"
			}]),
			path: "/"
		};
		
		_fnGetExpressionLevel = function(iInitialLevel, sExpression){
			if(sExpression === "" || iInitialLevel < 0){
				return iInitialLevel;
			}
			var sOperator = sExpression[0];
			var sNext = sExpression[1];
			return _fnGetExpressionLevel(_fnGetSimpleExpressionLevel(iInitialLevel, sOperator, parseInt(sNext, 10)), sExpression.substr(2, sExpression.length - 1));
		};
		
		_fnGetSimpleExpressionLevel = function(iPreviousLevel, sOperator, iCurrentLevel){
			switch(sOperator){
                case "+":
                    if(iPreviousLevel !== iCurrentLevel){
                    	return -1;
                    }
                    return Math.max(iPreviousLevel, iCurrentLevel);
                case "*":
                    return iPreviousLevel + iCurrentLevel;
                case "/":
                    return iPreviousLevel - iCurrentLevel;
            }
            return -1;
		};
		
		_fnXmlToJson = function(oXML) {
			// Create the return object
			var oResult = {};
			if(!oXML){
				return oXML;
			}
			if (oXML.nodeType === 1) { // element
				// do attributes
				if (oXML.attributes.length > 0) {
				oResult["@attributes"] = {};
					for (var j = 0; j < oXML.attributes.length; j++) {
						var attribute = oXML.attributes.item(j);
						oResult["@attributes"][attribute.nodeName] = attribute.nodeValue;
					}
				}
			} else if (oXML.nodeType === 3) { // text
				oResult = oXML.nodeValue;
			}
		
			// do children
			if (oXML.hasChildNodes()) {
				for(var i = 0; i < oXML.childNodes.length; i++) {
					var oItem = oXML.childNodes.item(i);
					var sNodeName = oItem.nodeName;
					if (typeof(oResult[sNodeName]) === "undefined") {
						oResult[sNodeName] = _fnXmlToJson(oItem);
					} else {
						if (typeof(oResult[sNodeName].push) === "undefined") {
							var old = oResult[sNodeName];
							oResult[sNodeName] = [];
							oResult[sNodeName].push(old);
						}
						oResult[sNodeName].push(_fnXmlToJson(oItem));
					}
				}
			}
			return oResult;
		};
		
		_fnXmlStringToXml = function(sXml){
			var oDOM = null;
			if (window.DOMParser) {
				try {
					oDOM = (new DOMParser()).parseFromString(sXml, "text/xml"); 
				}catch (oError) {
					oDOM = null;
				}
			}else if (window.ActiveXObject) {
				try {
					oDOM = new window.ActiveXObject('Microsoft.XMLDOM');
					oDOM.async = false;
					if (!oDOM.loadXML(sXml)){ // parse error ..
						oDOM = null;
					}
				}catch (oError) {
					oDOM = null; 
				}
			}else{
				oDOM = null;
			}
			return oDOM;
		};
		
		oTools = {
			/*Common reuseable functions*/
			getText: function(sTextId, aPara) {
				return _fnGetText(sTextId, aPara);
			},
			getDataSourceModel: function(){
				return _oDataSourceModel;
			},
			setDataSourceModel: function(oModel){
				_oDataSourceModel = oModel;
			},
			clearBoxItemsFromArray: function(oBox, aElements){
				for(var i = 0; i < aElements.length; i ++){
					if(oBox.indexOfItem(aElements[i]) >= 0){
						oBox.removeItem(oBox.indexOfItem(aElements[i]));
					}
				}
			},
			visibleItemsFromArray: function(aElements, bVisible){
				for(var i = 0; i < aElements.length; i ++){
					aElements[i].setVisible(bVisible);
				}
			},
			fnParseNumber: function(Number){
				return _fnParseNumber(Number);
			},
			compareBigNumberUnderLimit: function(sNumber){
				var oValue = new BigNumber(_fnParseNumber(sNumber));
				var oMax = new BigNumber("1000000000000000000000");
				var oMin = new BigNumber("-1000000000000000000000");
				return oValue.isLessThan(oMax) && oValue.isGreaterThan(oMin) && oValue.decimalPlaces() <= 2;
			},
			getLevelByExpressionString: function(sExpression){
				//A means first level, pure number
                //B means second level amount with currency
                var sNewExpression = sExpression.replace(new RegExp("[A]", "g"), 0); //pure number is 0
                sNewExpression = sNewExpression.replace(new RegExp("[B]", "g"), 1);// sum amount is 1
                sNewExpression = sNewExpression.replace(new RegExp("[C]", "g"), 1);// pure amount is 1
                var aExpression = sNewExpression.split(new RegExp("[+-]"));
                var sExpressionOnlyWithAdd = "";
                var iTempLevel = 0;
                for(var i = 0; i < aExpression.length; i ++){
                	if(aExpression[i] !== ""){
                		iTempLevel = _fnGetExpressionLevel(parseInt(aExpression[i][0], 10), aExpression[i].substr(1, aExpression[i].length));
                		sExpressionOnlyWithAdd = sExpressionOnlyWithAdd + "+" + iTempLevel;
                	}
                }
                return _fnGetExpressionLevel(iTempLevel, sExpressionOnlyWithAdd);
			},
			dealWithJqueryString: function(sString){
				var sResult = sString;  
				var aJsSpecialChars = ["\\", "^", "$", "*", "?", ".", "+", "(", ")", "[", "]", "|", "{", "}"];
				var aJquerySpecialChars = ["~", "`", "@", "#", "%", "&", "=", "'", "\"", ":", ";", "<", ">", ",", "/"];  
				for (var i = 0; i < aJsSpecialChars.length; i++) {  
					sResult = sResult.replace(new RegExp("\\" + aJsSpecialChars[i], "g"), "\\"  + aJsSpecialChars[i]);  
				}
				for (var j = 0; j < aJquerySpecialChars.length; j++) {  
					sResult = sResult.replace(new RegExp(aJquerySpecialChars[j],  "g"), "\\" + aJquerySpecialChars[i]);  
				}  
				return sResult;  
			},
			getKeyValueByTextFromArrar: function(aArray, sText){
				for(var i = 0; i < aArray.length; i ++){
					if(aArray[i].text === sText){
						return aArray[i].key;
					}
				}
				return null;
			},
			getReversedOperator: function(sOperator){
				var oMapping = {
					"NE": "EQ",
					"Not In": "In",
					"NP": "CP",
					"NB": "BT",
					"EQ": "NE",
					"In": "Not In",
					"CP": "NP",
					"BT": "NB"
				};
				return oMapping[sOperator];
			},
			fnExpandNodeToBottom : function(oTable, oRowData, iIndex){
				//record total children number for calculate previous sibling's children
				if(!oRowData){
					oRowData = oTable.getContextByIndex(iIndex).getObject();
				}
				oRowData.childrenNumber = oRowData.children.length;
				if(oRowData.childrenNumber > 0){
					oTable.getBinding("rows").expand(iIndex);
					var iPreviousSiblingChildrenTotalNumber = 0;
					for(var i = 0; i < oRowData.children.length; i++){
						if(oRowData.children[i].children && oRowData.children[i].children.length > 0){
							//index is inherited from parent
							//"+1" is because parent will take one position
							//"+i" is because there mey contain sibling nodes
							//"+iPreviousSiblingChildrenTotalNumber" is because sibling nodes may contain children
							this.fnExpandNodeToBottom(oTable, oRowData.children[i], iIndex +1 +i +iPreviousSiblingChildrenTotalNumber);
						}else{
							oRowData.children[i].childrenNumber = 0;
						}
						//update parent node's total number and current total sibling children number
						oRowData.childrenNumber += oRowData.children[i].childrenNumber;
						iPreviousSiblingChildrenTotalNumber += oRowData.children[i].childrenNumber;
					}
				}
				return;
			},
			generateHierarchyDisplayText: function(sFullHierarchyId, sNodevalue){
				return sFullHierarchyId.split("/").slice(1).join("/") + "/" + sNodevalue;
			},
			/**
			 * aPropertyMapping = [[["sourceProperty"], "targetProperty", fnFormat], [["sourceProperty"], "targetProperty", fnFormat]]
			 * 
			 * 
			 */
			buildTreeStructureData: function(aData, sSelfIDProperty, sParentIDProperty, sLevelProperty, sSortProperty, aPropertyMapping){
				var _processNode = function(oNodeData){
					for(var i = 0; i < aPropertyMapping.length; i ++){
						if(aPropertyMapping[i][2]){
							var aParameters = [];
							for(var j = 0; j < aPropertyMapping[i][0].length; j ++){
								aParameters.push(oNodeData[aPropertyMapping[i][0][j]]);
							}
							oNodeData[aPropertyMapping[i][1]] = aPropertyMapping[i][2].apply(null, aParameters);
						}else{
							oNodeData[aPropertyMapping[i][1]] = oNodeData[aPropertyMapping[i][0][0]];
						}
					}
				};
				var _findAllChildren = function(aNodes, oParent, sCounter){
				    var findChildren = function(child){
				        return child[sParentIDProperty] === oParent[sSelfIDProperty];
				    };
				    _processNode(oParent);
				    var aChildren = aNodes.filter(findChildren);
				    this.sortList(aChildren, sSortProperty);
				    if( aChildren.length > 0 ){
				        sCounter = sCounter - aChildren.length;
				        for(var iChildIndex in aChildren){
				            this.deleteObjectWithProperty(aNodes, aChildren[iChildIndex], sSelfIDProperty);
				            aChildren[iChildIndex] = _findAllChildren(aNodes, aChildren[iChildIndex]);
				            _processNode(aChildren[iChildIndex]);
				        }
				        oParent['children'] = aChildren;
				    }
				    return oParent;
				}.bind(this);
				
				if(aData.length > 0){
					this.sortList(aData, sLevelProperty, sSelfIDProperty);
					var sTime = aData.length + 1;
					var oParent = {};
					while(sTime >= 0){
					    oParent = aData.shift();
					    sTime = sTime - 1;
					    oParent = _findAllChildren(aData, oParent, sTime);
					    aData = aData.concat(oParent);
					}
				}
				return {
				    children: this.sortList(aData, sSortProperty)
				};
			},
			/***
			 * oPara = {
			 	
			 }
			 */
			fetchChildrenAndResetDOMForTreeTable: function(oTreeTable, sFetchChildrenPath, /*oPara, bExpanded, */oURLPara, fnCallBAck){
				// if(oPara.bRoot && bExpanded && !oPara.bLoaded){
					oTreeTable.setBusy(true);
					this.getDataSourceModel().callFunction("/" + sFetchChildrenPath, {
						method: "GET",
						urlParameters: oURLPara, 
						success: function(oData, response) {
							// oRowData.bLoaded = true;
							var aChildren = this.buildTreeStructureData(
								oData.results, "Hrynode", 
								"Parnode", "Hrylevel", "Hryseqnbr", 
								[
									[["Hrynode"], "NodeId", null],
									[["Hryid"], "FullHierarchyId", null],
									[["Nodetxt"], "Description", null],
									[["Nodevalue"], "NodeValue", null],
									[["Hryvalfrom"], "TimeFrom", function(oDate){
										return oDate.toDateString ? oDate.toDateString() : oDate;
									}],
									[["Hryvalto"], "TimeTo", function(oDate){
										return oDate.toDateString ? oDate.toDateString() : oDate;
									}],
									[["Hryid", "Nodevalue"], "InputDisplayText", function(sHryid, sNodevalue){
										return this.generateHierarchyDisplayText(sHryid, sNodevalue);
									}.bind(this)],
									[["Nodetype"], "bLeaf", function(sNodetype){
										return sNodetype === "L";
									}],
									[["Nodetype"], "bRoot", function(sNodetype){
										return sNodetype === "R";
									}],
									[["__metadata"], "__metadata", function(){
										return "";
									}],
									[["Hryvalfrom"], "Hryvalfrom", function(oDate){
										return oDate.toDateString ? oDate.toDateString() : oDate;
									}],
									[["Hryvalto"], "Hryvalto", function(oDate){
										return oDate.toDateString ? oDate.toDateString() : oDate;
									}]
								]
							).children;
							oTreeTable.getModel().setData({children: aChildren});
							// oRowContext.getObject().children = aChildren;
							// var oState = oTreeTable.getBinding("rows").getCurrentTreeState();
							oTreeTable.bindRows({
								path: "/children"
							});
							// oTreeTable.getBinding("rows").setTreeState(oState);
							// oTreeTable.getBinding("rows").filter();
							oTreeTable.setBusy(false);
							if(fnCallBAck){
								fnCallBAck();
							}
						}.bind(this),
						error: function(oError) {
							oTreeTable.setBusy(false);
						}
					});
				// }
			},

			getOperandOperatorsModel: function(){
				//Static display JSON Model, one is enough
				return _oOperandOperatorJSONModel;
			},
			getOperandTypesModel: function(){
				//Static display JSON Model, one is enough
				return _oOperandTypeJSONModel;
			},
			getOperandMathFunctionsModel: function(){
				//Static display JSON Model, one is enough
				return _oOperandMathFunctionsJSONModel;
			},
			getExpressionOperatorModel: function(){
				//this model will be changed during switch, need seperate instance
				return new JSONModel(_oExpressionCompareOperators);
			},
			
			
			
			/*Get Set Method for Global*/
			getLiveChangeEventHandler: function(){
				return _fnLiveChangeEventHandler;
			},
			setLiveChangeEventHandler: function(fnHandler){
				_fnLiveChangeEventHandler = fnHandler;
			},
			setF4SearchHelpInfo: function(sKey, oPara){
				_oF4SearchHelpInfo[sKey] = oPara;
			},
			getF4SearchHelpInfo: function(sKey){
				return _oF4SearchHelpInfo[sKey];
			},
			getCharaterSelectBindingInfo: function(){
				if(_oCharaterSelectBindingInfo){
					return _oCharaterSelectBindingInfo;
				}else{
					return _oDefaultCharaterSelectBindingInfo;
				}
			},
			getKeyFigureSelectBindingInfo: function(){
				if(_oKeyFigureSelectBindingInfo){
					return _oKeyFigureSelectBindingInfo;
				}else{
					return _oDefaultKeyFigureSelectBindingInfo;
				}
			},
			setCharaterSelectBindingInfo: function(oInfo){
				_oCharaterSelectBindingInfo = oInfo;
			},
			setKeyFigureSelectBindingInfo: function(oInfo){
				_oKeyFigureSelectBindingInfo = oInfo;
			},
			getControlLevelBindingInfo: function(){
				return _oControlLevelBindingInfo;
			},
			getDetailView: function(){
				return _oDetailView;
			},
			setDetailView: function(oView){
				_oDetailView = oView;
			},
			setCharaterFieldsInfo: function(aInfo){
				for(var i = 0; i < aInfo.length; i ++){
					_oCharaterFieldsInfo[aInfo[i].NodeId] = aInfo[i];
				}
			},
			getCharaterFieldsInfo: function(){
				return _oCharaterFieldsInfo;
			},
			getScenId: function(){
				return _sScenId;
			},
			setScenId: function(sScenId){
				_sScenId = sScenId;
			},
			
			/*Functions used for get Layout Configuration*/
			getLayoutConfiguration: function(oPara){
				return new FlexItemData(oPara);
			},
			getGridLayout: function(oPara){
				return new GridData(oPara);
			},
			getDefaultNewUISelectionWholeLineParameter: function(){
				return _oDefaultNewUISelectionWholeLineParameter;
			},
			getDefaultNewUISelectionParameter: function(){
				return _oDefaultNewUISelectionParameter;
			},
			getDefaultNewUISelectStatementUIParameter: function(){
				return _oDefaultNewUISelectStatementUIParameter;
			},
			getDefaultNewUIHeaderParameter: function(){
				return _oDefaultNewUIHeaderParameter;
			},
			// add heli 20201030
			getDefaultNewUIRuleParameter:function(){
				return _oDefaultNewUIRuleParameter;
			},
			// add heli
			setCharatersFieldsData: function(aData){
				_aCharatersFieldsData = JSON.parse(JSON.stringify(aData));
			},
			getCharatersFieldsData: function(){
				return _aCharatersFieldsData;
			},
			
			/*Enhancement for original functions*/
			//excute: eval,
			excute:function(sExpression){
				/*
				remove temporarily to skip eslint check
				*/
				//Function('return('+sExpression+')')();
				if(!this.checkExp(sExpression)){
					throw "Expression invalid";
				}
			},
			excuteForCompound:function(sExpression){
				/*
				remove temporarily to skip eslint check
				*/
				//Function('return('+sExpression+')')();
				if(!this.checkBooleanExpression(sExpression)){
					throw "Expression invalid";
				}
			},
			checkExp:function(e){
				var lastIsInt = false;	
				while(e.length>0){
					var isInt = !isNaN(parseInt(e.pop()));
					if(lastIsInt != isInt ){
						lastIsInt = isInt;
					}else{
						return false;
					};
				}
				return lastIsInt;
			},
			checkBooleanExpression:function(aExpression){
				var strExp = "";
				aExpression.forEach(function(obj){
									strExp += obj + " ";}
									);
				strExp = strExp.replace(/AND/g,"&&");
				strExp = strExp.replace(/OR/g,"||");
				strExp = strExp.replace(/NOT/g,"!");
				try{
					jQuery.sap.globalEval(strExp);
					return true;
				}catch(err){
					return false;
				}
			}
			,
			sortList: function(/*list, bDescending, sortBy, secondBy, ......*/) {
				var list = arguments[0];
				var bDescending = false;
				var aPropertys = Array.prototype.slice.call(arguments, 1);
				if(typeof(arguments[1]) === typeof(true)){
					bDescending = arguments[1];
					aPropertys = Array.prototype.slice.call(arguments, 2);
				}
			    return list.sort(function(a, b) {
			    	for(var i = 0; i < aPropertys.length; i++){
			    		if (a[aPropertys[i]] !== b[aPropertys[i]] || !aPropertys[i+1]) {
			    			if(bDescending){
			    				return (a[aPropertys[i]] < b[aPropertys[i]]) ? 1 : ((b[aPropertys[i]] < a[aPropertys[i]]) ? -1 : 0);
			    			}else{
			    				return (a[aPropertys[i]] > b[aPropertys[i]]) ? 1 : ((b[aPropertys[i]] > a[aPropertys[i]]) ? -1 : 0);
			    			}
				        }
			    	}
			        return 0;
			    });
			},
			sortListWithDifferentSequence: function(/*list, sortBy, bAscending secondBy, bAscending......*/){
				var list = arguments[0];
				var aPropertys = Array.prototype.slice.call(arguments, 1);
			    return list.sort(function(a, b) {
			    	for(var i = 0; i < aPropertys.length - 1; i++){
			    		if(aPropertys[i+1]){
			    			if (a[aPropertys[i]] !== b[aPropertys[i]] || !aPropertys[i+2]) {
					            return (a[aPropertys[i]] > b[aPropertys[i]]) ? 1 : ((b[aPropertys[i]] > a[aPropertys[i]]) ? -1 : 0);
					        }
			    		}else{
			    			if (a[aPropertys[i]] !== b[aPropertys[i]] || !aPropertys[i+2]) {
					            return (a[aPropertys[i]] < b[aPropertys[i]]) ? 1 : ((b[aPropertys[i]] < a[aPropertys[i]]) ? -1 : 0);
					        }
			    		}
			    		i++;
			    	}
			        return 0;
			    });
			},
			objectCompare: function(obj1, obj2){
				return JSON.stringify(obj1) === JSON.stringify(obj2);
			},
			findObjectIndexWithProperty: function(array, object, property){
			    for (var i = 0; i < array.length; i++) {
			        if (this.objectCompare(array[i][property], object[property])) {
			        	return i;
			        }
			    }
			    return -1;
			},
			deleteObjectWithProperty: function(array, object, property){
			    var index = this.findObjectIndexWithProperty(array, object, property);
			    if (index > -1) {
			        array.splice(index, 1);
			    }
			},
			insertItemIntoArray: function(array, index, item){
				array.splice(index, 0, item);  
			},
			deleteItemFromArray: function(array, from, to) {
				var rest = array.slice((to || from) + 1 || array.length);
				array.length = from < 0 ? array.length + from : from;
				return array.push.apply(array, rest);
			},
			sXML2oJSON: function(sXML){
				return _fnXmlToJson(_fnXmlStringToXml(sXML));
			}
			
		};
		return oTools;
	}
);