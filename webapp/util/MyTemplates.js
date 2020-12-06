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
				result += _getMTableColumn(ddic[ind]["name"]) + " \r\n ";
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
		buildForm:function(ddic){
			return "";
		}
	};
	
});