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
			return "<Table id=\"{Table1}\" alternateRowColors=\"true\" backgroundDesign=\"Transparent\" headerText=\"Header\" mode=\"SingleSelect\" noDataText=\"No Data\" items=\"{TableSet}\" >";
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
	var _startForm = function(){
		var strResult = "<f:Form id=\"basicForm\">\r\n";
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
			if (i === oParams.FormColumns) i = 0;
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
		buildForm:function(ddic,uiParams){
			return _buildForm(ddic, uiParams);
		}
	};
	
});