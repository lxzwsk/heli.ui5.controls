var _delete= function () {

		this._doAction("/deleteEntries", "deleteEntries", "deleteChid", this._deleteSuccess, this._deleteError);
	};
	
var _doAction = function (functionPath, groupId, changesetid, successCallBack, errorCallBack) {
		this._showBusy(true);
		var oBinding = this.oTable.getBinding();
		var oModel = this._getModel();
		var aSelectedIndexs = [];
		if (this._isNewSelectionModel()) {
			aSelectedIndexs = this.oSelectionPlugin.getSelectedIndices();
		} else {
			aSelectedIndexs = this.oTable.getSelectedIndices();
		}
		this.getOwnerComponent()["SelectedIndexs"] = aSelectedIndexs;

		var sGroupId = groupId;
		var sChangeSetId = changesetid;
		var aKeys = oBinding.aKeys;
		oModel.setDeferredGroups([sGroupId]);
		for (var ind in aSelectedIndexs) {
			var sPath = aKeys[aSelectedIndexs[ind]];
			var oEntity = oModel.getProperty("/" + sPath);

			// oModel.callFunction(functionPath, { 
			// 	method: "POST", 
			// 	urlParameters: { 
			// 		METHOD_ID: this._getMethodID(), 
			// 		DOCNR: oEntity.DOCNR 
			// 	}, 
			// 	groupId: sGroupId, 
			// 	changeSetId: sChangeSetId 
			// }); 
			this._callFunction(oModel, functionPath, this._getMethodID(), oEntity.DOCNR, sGroupId, sChangeSetId);
		}
		// oModel.submitChanges({ 
		// 	groupId: sGroupId, 
		// 	success: successCallBack.bind(this), 
		// 	error: errorCallBack.bind(this) 
		// }); 
		this._submitChanges(oModel, sGroupId, successCallBack, errorCallBack);
	};
var _deleteSuccess = function (oData) {
		this._showBusy(false);
		if (this._badRequestHandler(oData) || this._badRequestHandler1(oData)) {
			return;
		}
		var successInfo = this._getText("deleteSuccessInfo");
		this._updateDelflg("Yes");
		this._showMessage(successInfo);
	};
	
var	_deleteError =  function (oData) {
		//var errorInfo = this._getText("deleteFailureInfo"); 
		this._showBusy(false);
		this._showError(oData.responseText);
	};
var _callFunction =  function (oModel, functionPath, sMethodID, sDocnr, sGroupId, sChangeSetId) {
		oModel.callFunction(functionPath, {
			method: "POST",
			urlParameters: {
				METHOD_ID: sMethodID,
				DOCNR: sDocnr
			},
			groupId: sGroupId,
			changeSetId: sChangeSetId
		});
	};
var _submitChanges =  function (oModel, sGroupId, successCallBack, errorCallBack) {
		oModel.submitChanges({
			groupId: sGroupId,
			success: successCallBack.bind(this),
			error: errorCallBack.bind(this)
		});
	};	