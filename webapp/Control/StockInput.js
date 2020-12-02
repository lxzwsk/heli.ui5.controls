sap.ui.define([
	"sap/m/Input",
	"sap/m/ColumnListItem",
	"sap/m/Text",
	"sap/m/Column",
	"sap/m/Label",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Input, ListItem, Text, Column, Label, Filter, FilterOperator) {
	var myInput = Input.extend("heli.ui5.controls.Control.StockInput", {
		metadata: {
			properties: {
				dataSource: {
					type: "string"
				},
				itemFields: {
					type: "string"
				}
			}
		},
		constructor: function(sId, mSetting) {
			Input.apply(this, arguments);
			if (this.getDataSource()) {
				this.initialStock();
			}
		}

	});

	myInput.prototype.initialStock = function() {

		if (!this.getPlaceholder()) {
			this.setPlaceholder("请输入股票代码");
		}

		if (!this.getShowSuggestion()) {
			this.setShowSuggestion(true);
		}

		if (this.getShowTableSuggestionValueHelp()) {
			this.setShowTableSuggestionValueHelp(false);
		}

		var oRowsTemplate = new ListItem({
			cells: []
		});

		var strFields = this.getItemFields();
		if (strFields) {
			var aFields = strFields.split(',');
			for (var ind in aFields) {
				oRowsTemplate.addCell(new Text({
					text: "{" + aFields[ind] + "}"
				}));
			}
		}

		this.bindSuggestionRows(this.getDataSource(), oRowsTemplate);

		var oColumn = new Column({
			demandPopin: true,
			popinDisplay: "Inline",
			header: new Label({
				text: "stockNo"
			})
		});
		this.addSuggestionColumn(oColumn);

		oColumn = new Column({
			demandPopin: true,
			popinDisplay: "Inline",
			header: new Label({
				text: "stockDesc"
			})
		});
		this.addSuggestionColumn(oColumn);

		oColumn = new Column({
			demandPopin: true,
			popinDisplay: "Inline",
			header: new Label({
				text: "stockType"
			})
		});

		this.addSuggestionColumn(oColumn);
		
		this.attachSuggest(this.onSuggest.bind(this));
	};

	myInput.prototype.onSuggest = function(oEvent) {
		var oSource = oEvent.getSource();
		var sValue = oEvent.getParameters("suggestValue").suggestValue;
		var oBindIng = oSource.getBinding("suggestionRows");
		var filter = new Filter([new Filter("stockNo", FilterOperator.Contains, sValue),
				new Filter("stockDesc", FilterOperator.Contains, sValue)
			],
			false);
		oBindIng.filter(filter);
	};
	
	/*
	myInput.prototype.onSuggestionItemSelected = function(oEvent){
		var oListItem = oEvent.getParameter("selectedRow");
			if (oListItem) {
				var oContext = oListItem.getBindingContext("stocks");
				var sPath = oContext.sPath;
				var oEntity = oContext.oModel.getProperty(sPath);
				if (oEntity) {
					//return oEntity.stockType;
					//this._buildStockUrl(oEntity.stockType);
				}
			}
	};*/
	
	//myInput.init();
	return myInput;
});