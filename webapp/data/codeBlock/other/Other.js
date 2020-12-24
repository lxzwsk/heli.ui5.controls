//延时执行
var delayedCall = function(){ 
	jQuery.sap.delayedCall(0, this, function () {
				
		this._oQuickView.openBy("oButton");
	});
};

// 构造filter
/*var aFiters = [];
if (sExpandLevel) {
	aFiters.push(new sap.ui.model.Filter("NodeLev", sap.ui.model.FilterOperator.EQ, sExpandLevel));
}
this.getModel().read(sPath + "/GetDetails", {
	filters: aFiters,
	success: function (oData) {
		this._mappingOData(oData);
		this.oTreeTableData = oData.results;
		this.refreshResultTable(oData.results);
		this._adjustFilterText(oData.results);
		if (bExpandAll) {

			this.oTreeTable.expandToLevel(this.oTreeState.maxLevel);
		}
		this.oTreeTable.setBusy(false);
	}.bind(this),
	error: function (oData) {
		this.oTreeTable.setModel(); //set empty

	}.bind(this)
});*/

//
// read data add urlParameters expand
//
var _loadData = function () {

	//
	var objKeys = {};
	if (!this.bLoaded) {

		objKeys = this.getOwnerComponent().objectKeys;
		objKeys = this._mergeKeys(objKeys);
		if (objKeys) {
			var sObjectPath = this.getModel().createKey("ReconCloseDetailSet", objKeys);
			this.getModel().read("/" + sObjectPath, {
				urlParameters: {
					"$expand": "ReconCloseDetailNav,ReconCloseDetailTNav"
				},
				success: this._loadSuccess.bind(this),
				error: this._loadError.bind(this)
			});
			this.bLoaded = true;
		}
	}

};