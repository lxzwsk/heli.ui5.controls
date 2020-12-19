sap.ui.define([], function() {
	var _getFilterConfigureTemplate = function(fieldName, controlType, filterType, index, mandatory, show){
		var result = "<smartfilterbar:ControlConfiguration groupId=\"_BASIC\" displayBehaviour=\"idAndDescription\" ";
			if (!fieldName) {
				return undefined;
			}
			if (controlType) {
				result += " controlType=\"" + controlType + "\" ";
			}

			if (filterType) {
				result += " filterType=\" " + filterType + "\" ";
			} else {
				result += " filterType=\"single\" ";
			}

			if (index) {
				result += " index=\"" + index + "\"";
			}

			if (mandatory === "mandatory") {
				result += " mandatory=\"mandatory\" ";
			} else {
				result += " mandatory=\"" + mandatory + "\" ";
			}

			if (show) {
				result += " visible=\"true\" ";
			} else {
				result += " visible=\"false\" ";
			}

			result += " id=\"filter." + fieldName + "\" ";
			result += " key=\"" + fieldName + "\" ";

			result += " /> \r\n";
			return result;
	};
	var _getMTableHeader = function() {
			return "<Table id=\"Table1\" alternateRowColors=\"true\" backgroundDesign=\"Transparent\" headerText=\"Header\" mode=\"SingleSelect\" noDataText=\"No Data\" items=\"{TableSet}\" >";
		};
	var _getMTableColumn = function(Column) {
			return "<Column> \r\n      <Text text=\"" + Column + "\" />  \r\n  </Column> \r\n";
		};
		
	var _getMTableColumns =  function(ddic) {
			var result = "<columns> \r\n";
			for (var ind in ddic) {
				result += _getMTableColumn(ddic[ind]["desc"]) + " \r\n ";
			}
			result += "</columns> \r\n";
			return result;
		};
	var	_getMTableItems = function(ddic) {
			var result = "<items>	\r\n <ColumnListItem type=\"Active\" press=\"onPress1\">	\r\n <cells> \r\n";
			for (var ind in ddic) {
				result += "		<Input value=\"{" + ddic[ind]["name"] + "}\"></Input> \r\n";
			}
			result += "</cells> \r\n </ColumnListItem> \r\n </items> \r\n </Table>\r\n";
			return result;
		};
	
	var _getUITableHeader = function(){
		
		var strResult =  "<table:Table id=\"reconTable\" \r\n" ;
		strResult += "    enableBusyIndicator=\"true\" \r\n";
		strResult += "    threshold=\"9999\" \r\n";
		strResult += "    ariaLabelledBy=\"title\" \r\n";
		strResult += "	  showColumnVisibilityMenu=\"true\" \r\n";
		strResult += "    enableSelectAll=\"true\"  \r\n";
		strResult += "    selectionMode=\"MultiToggle\" \r\n";
		strResult += "    rowActionCount=\"1\" \r\n";
		strResult += "    visibleRowCountMode=\"Auto\" \r\n";
		strResult += "    rowSelectionChange=\"onRowSelectionChange\" \r\n";
		strResult += "    width=\"100%\" \r\n";
		strResult += "    > \r\n";
		return strResult;
	};	
	
	var _getUItableColumns = function(ddic){
		var strResult = "	<table:columns>";
		ddic.forEach(function(obj){
			strResult += "	<table:Column   sortProperty=\""+obj.name+"\" filterProperty=\""+obj.name+"\" tooltip=\""+obj.desc+"\" >\r\n"; 
			
			strResult += "		<Label  text=\""+obj.desc+"\"  tooltip=\""+obj.desc+"\"/> \r\n";
			
			strResult += "		<table:template> \r\n";
			
			strResult += "			<Text	text=\"{"+obj.name+"}\" wrapping=\"false\" />\r\n";
			
			strResult += "		</table:template> \r\n";
			
			strResult += "		<table:customData> \r\n";
			strResult += "			<core:CustomData id=\""+obj.name+".CustData\" key=\"p13nData\" value='\{\"columnKey\": \""+obj.name+"\",\"leadingProperty\":\""+obj.name+"\"}'/> \r\n";
			strResult += "		</table:customData> \r\n";
			
			strResult += "	</table:Column> \r\n";
			
		});
		strResult += "	</table:columns> \r\n";
		return strResult;
	};
	
	var _getTableActionRow = function(){
		var strResult = "	<table:rowActionTemplate> \r\n";
		strResult += "			<table:RowAction id=\"reconTable.RowAction\">\r\n";
		strResult += "				<table:items> \r\n";
		strResult += "					<table:RowActionItem id=\"reconTable.Action.toObject\" type=\"Navigation\" press=\"onNavToObject\" /> \r\n";
		strResult += "				</table:items> \r\n";
		strResult += "			</table:RowAction>\r\n";
		strResult += "		</table:rowActionTemplate>\r\n";
		return strResult;
	};
	
	var _getSmartTableHeader = function(uiParams){
		var strResult = "<smartTable:SmartTable id=\""+uiParams.EntityName+"SmartTable\" \r\n";
		strResult += "	smartFilterId=\"SmartFilterBar\"  \r\n";
		strResult += "	class=\"sapUiNoMargin\" \r\n";
		strResult += "	height=\"100%\" \r\n";
		strResult += "	width=\"auto\" \r\n";
		strResult += "	header=\"{= ${worklistView>/tableHeaderText} }\" \r\n";
		strResult += "	tableType=\"TreeTable\" \r\n";
		strResult += "	showRowCount=\"true\" \r\n";
		strResult += "	useExportToExcel=\"true\" \r\n";
		strResult += "	useTablePersonalisation=\"true\" \r\n";
		strResult += "	persistencyKey=\"fin.cons.ica.reconclose.overview"+uiParams.EntityName+".table\" \r\n";
		strResult += "	showVariantManagement=\"false\" \r\n";
		strResult += "	useVariantManagement=\"false\" \r\n";
		strResult += "	enableAutoBinding=\"false\" \r\n";
		strResult += "	entitySet=\""+uiParams.EntityName+"\" \r\n";
		strResult += "	beforeExport=\"onBeforeExport\" \r\n";
		strResult += "	beforeRebindTable=\"onBeforeRebindTable\" \r\n";
		strResult += "	requestAtLeastFields=\"LeadingUnit,PartnerUnit,DiffAmt\" \r\n"	;
		strResult += "	dataReceived=\"onDataReceived\" \r\n";
		strResult += " > \r\n";
		return strResult;
	};
	
	var _getSmartTabCustomData = function(){
		var strResult = " <smartTable:customData>\r\n";
		strResult += "		<core:CustomData id=\"stb.ReconClose.CustData\" key=\"p13nDialogSettings\" \r\n";
		strResult += "						value='\{ \"sort\": \{ \"visible\": true}, \"filter\": \{ \"visible\": true}, \"group\": \{ \"visible\": false} }'/> \r\n";
		strResult += "	</smartTable:customData> \r\n";
		strResult += " <smartTable:customToolbar> \r\n";
		strResult += "	<OverflowToolbar id=\"overflowToolbar\" design=\"Transparent\"> \r\n";
		strResult += "		<ToolbarSpacer id=\"stb.ReconClose.tbp\" /> \r\n";
		strResult += "			<Button id=\"btn.ReconClose.Close\" text=\"{i18n>TXT_CLOSE\" press=\"onClose\" enabled=\"{worklistView>/enableClose}\" type=\"Emphasized\"/> \r\n";
		strResult += "			<Button id=\"btn.ReconClose.Reopen\" text=\"{i18n>TXT_REOPEN}\" press=\"onReOpen\" enabled=\"{worklistView>/enableReOpen}\"/>\r\n";
		strResult +=" </smartTable:customToolbar> \r\n";
		return strResult;
	};
	var _buildUITable = function(ddic){
		var strResult = _getUITableHeader();
		strResult += _getUItableColumns(ddic);
		strResult += _getTableActionRow();
		strResult += "</table:Table>\r\n";
		return strResult;
	};
	
	var _buildSmartTable = function(ddic,uiParams){
		var strResult = _getSmartTableHeader(uiParams);
		strResult += _getSmartTabCustomData();
		strResult += _buildUITable(ddic);
		strResult += "</smartTable:SmartTable> \r\n";
		return strResult;
	};
	
		
	var _startForm = function(){
		var strResult = "<f:Form id=\"basicForm\" editable=\"true\">\r\n";
		return strResult;
	};
	
	var _buildLayoutForForm = function(iColumnItems){
		
		var strResult = "";
		strResult += "	<f:layout>\r\n" ;
		strResult += "		<f:ResponsiveGridLayout  id=\"idGridLayout\" columnsXL=\"" + iColumnItems + "\" columnsL=\"" + iColumnItems + "\" columnsM=\""+ iColumnItems +  "\"\r\n" ;
		strResult += "					 labelSpanXL=\"4\" labelSpanL=\"4\" labelSpanM=\"4\"  labelSpanS=\"12\" adjustLabelSpan=\"false\"\r\n" ;
		strResult += "					 emptySpanXL=\"0\" emptySpanL=\"0\" emptySpanM=\"0\" emptySpanS=\"0\"\r\n" ;
		strResult += "					 singleContainerFullSize=\"false\"\r\n" ;
		strResult += "						/>\r\n" ;
		strResult += "	</f:layout>\r\n" ;
		return strResult;
	};
	
	var _endForm = function(){
		return "</f:Form> \r\n";
	};
	
	var _startFormContainers = function(){
		return "	<f:formContainers>\r\n";
	};
	
	var _endFormContainers = function(){
		return "	</f:formContainers> \r\n";
	};
	
	var _startFormContainer = function(index){
		var strResult = "		<f:FormContainer id=\"formContainer" + index.toString() + "\">\r\n";
		strResult += "				<f:formElements> \r\n";
		return strResult;
	};
	
	var _endFormContainer = function(){
		var strResult = "			</f:formElements>\r\n";
		strResult += "		</f:FormContainer> \r\n";
		return strResult;
	};
	
	var _buildFormElement = function(ddic){
		var strResult = "";	
		strResult += "					<f:FormElement label=\"" + ddic.desc + "\" id=\"formElement" + ddic.name + "\"> \r\n";
		strResult += "						<f:fields> \r\n";
		strResult += "							<Input value=\"{/" + ddic.name + "}\" id=\"idInput" + ddic.name + "\"></Input> \r\n";
		strResult += "						</f:fields> \r\n";
		strResult += "					</f:FormElement> \r\n";
		return strResult;
	};
	
	var _buildForm = function(ddic,oParams){
		var iColumnItems = 12 / oParams.FormColumns;
		var strResult = _startForm();
		strResult += _buildLayoutForForm(iColumnItems);
		strResult += _startFormContainers();
		
		var aContainer = [];
		for(var i = 0 ; i < oParams.FormColumns; i++){
			aContainer.push(_startFormContainer(i));
		
		}
		
		i = 0;
		for(var o in ddic){
			if (i == oParams.FormColumns){ 
				i = 0;
			}
			aContainer[i] += _buildFormElement(ddic[o]);
			i++;
		}
		
		
		for(i = 0 ; i < aContainer.length; i++){
			aContainer[i] += _endFormContainer();
			strResult += aContainer[i];
		}
		
		strResult += _endFormContainers();
		strResult += _endForm();
		return strResult;
	};
	
	var _buildFragment = function(xmlContent){
		var strResult = "<core:FragmentDefinition \r\n";	
		strResult += " xmlns=\"sap.m\"  \r\n";
		strResult += "xmlns:core=\"sap.ui.core\" \r\n";
		strResult += "xmlns:f=\"sap.ui.layout.form\" \r\n";
		strResult += "xmlns:table=\"sap.ui.table\" \r\n";
		strResult += " > \r\n";
		
		strResult += xmlContent + "\r\n";
		
		strResult += "</core:FragmentDefinition> \r\n";
		
		return strResult;
	};
	
	return {
		buildFilterConfigure:function(ddic, startIndex, keyPrefix){
			var result = "";
			for (var field in ddic) {
				result += _getFilterConfigureTemplate(keyPrefix + ddic[field]["name"], null, null, startIndex, "auto", false);
				startIndex++;
			}
			return result;
		},
		buildMTable:function(ddic){
			var result = _getMTableHeader();
			result += _getMTableColumns(ddic);
			result += _getMTableItems(ddic);
			return result;
		},
		buildUITable:function(ddic){
			return _buildUITable(ddic);
		},
		buildForm:function(ddic,uiParams){
			return _buildForm(ddic, uiParams);
		},
		buildSmartTable:function(ddic,uiParams){
			return _buildSmartTable(ddic,uiParams);
		},
		buildFragment:function(xmlContent){
			return _buildFragment(xmlContent);
		}
	};
	
});