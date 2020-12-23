var bindTokens = function (sPath) {
        	var that = this;
        	this._sPath = sPath;
        	var oNewToken = new sap.m.Token({
				text: "{text}",
				key:"{key}",
				tooltip:"{data/RuleDesc}",
				delete: function(oEvent) {
					var path = oEvent.getSource().getBindingContext().getPath();
					var index = parseInt(path.replace(sPath, "").replace("/", ""), 10);
					var oModel = that.getModel();  
					var aData = oModel.getProperty(sPath);
					
					if(aData){
						that.fireBeforeTokenDeleted({
							token: oEvent.getSource()
						});
						//Tools.deleteItemFromArray(aData, index);
						
						that._removeToken(oEvent.getSource());
						oEvent.getSource().destroy();
						oModel.setProperty(sPath, aData);
					}
				},
				select: function(oEvent){
					that._tokenizer.fireEvent("click");
					
					var oParameter = {
						token: oEvent.getSource(),
						data: JSON.parse(JSON.stringify(that.getModel().getProperty(oEvent.getSource().getBindingContext().getPath())))
					};
					//_fnClearFocusExceptCurrentBox(that._tokenizer);
					that.fireTokenSelected(oParameter);
				}
			}).addStyleClass("biggerToken");

        	oNewToken["onsapfocusleave"] = function(){};
			this.bindAggregation("tokens", sPath, oNewToken);
};		