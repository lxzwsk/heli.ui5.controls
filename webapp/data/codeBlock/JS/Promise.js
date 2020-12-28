var _loadData = function(path,dataType){
		return new Promise(function(resolve,reject){
			$.ajax({
				url:path,
				dataType:dataType,
				success:function(oData){
					var strCode = oData;
					if(dataType === "xml"){
						strCode = (new XMLSerializer()).serializeToString(oData);
					}
					resolve(strCode);		
				},
				error:function(oResponse){
					reject(oResponse);
				}
			
			});
		});
		
	};

var loadData = function(path,dataType){
			return _loadData(path,dataType);
		};
		
var onLoadCodeBlock = function(oEvent){
	var oData = oEvent.getSource().getBinding("text").oContext.getObject();
	var path = this.rootPath + oData.path;
	var dataType = oData.type;                         
	loadData(path,dataType).then(function(oData){
		this.setCode(oData,dataType);
	}.bind(this)).catch(function(oResponse){
		//alert(oResponse);
		if(oResponse.responseText){
			this.setCode(oResponse.responseText);
		}
	}.bind(this));
};

var setCode = function(strCode,dataType){
	var strType = "javascript";
	switch(dataType){
		case"xml":
			strType = "xml";
		break;
		default:
			strType = "javascript";
	}
	this.setModelProperty("UIModel","code",strCode);
	
	this.setModelProperty("UIModel","type",strType);
};		

//
// Promise all
//
var _reactTreeOperation = function () {
	var aPromise = this._asynLoadChildren();
	Promise.all(aPromise).then(function () {
		
		for (var index in this.aTreeOperationHist) {
			var oHist = this.aTreeOperationHist[index];
			if(!oHist){
				continue;
			}
			if (oHist.expanded) {
				this.oTreeTable.expand(oHist.rowIndex);
			} else {
				this.oTreeTable.collapse(oHist.rowIndex);
			}
		}
		
	}.bind(this));

};

var _asynLoadChildren = function () {
	var aPromise = [];
	for (var index in this.aTreeOperationHist) {
		var currOperation = this.aTreeOperationHist[index];
		if(currOperation){
			var sPath = currOperation.rowContext.getPath();
			if (this._isLoadChildren(sPath)) {
				aPromise.push(this._addChildrenData(currOperation.rowContext, sPath));
			}
		
		}else{
			//
			// expand all
			aPromise.push(this._getExpandAllData());
		}
	}
	return aPromise;
};

var _addChildrenData = function (rowContext, sPath) {
	var oPromise = new Promise(function (resolve, reject) {
		var oRowContext = rowContext;
		var oCurrentRow = oRowContext && this.oTreeTable.getModel().getProperty(sPath);
		var oChildren = oCurrentRow && oCurrentRow.children && oCurrentRow.children[0];
		if (!oChildren || Object.keys(oChildren).length > 0) {
			// children of current row already loaded
			return;
		}

		this._getChildrenData(oCurrentRow.NodeId, oCurrentRow.RuleId,
			oCurrentRow.OriginalCurrency,
			oCurrentRow.GroupbyValue,
			oCurrentRow.GroupbyValue1,
			oCurrentRow.GroupbyValue2,
			oCurrentRow.RuleResult,
			oCurrentRow.IsInCompoundRule
		).then(function (oData) {
			var oSubData = [];
			if (oData.results.length > 0) {
				oSubData = oSubData.concat(oData.results) ;
				for (var i in oData.results) {
					if (this._getIndexInArray(this.oTreeTableData, oData.results[i]) < 0) {
						this.oTreeTableData.push(oData.results[i]);
					}
				}

				var oModel = this.oTreeTable.getModel();
				var oNewRow = oModel.getProperty(oRowContext.sPath);
				var oNewTreeNode = this._transToTree(oData.results);
				if (oNewTreeNode) {
					oNewRow.children = oNewTreeNode;
					oModel.setProperty(oRowContext.sPath, undefined);
					oModel.setProperty(oRowContext.sPath, oNewRow);
					this._adjustFilterText(oSubData,oRowContext);
				}
			}
			this.oTreeTable.setBusy(false);
			resolve();
		}.bind(this));

	}.bind(this));
	return oPromise;
};
