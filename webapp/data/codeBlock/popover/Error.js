/*
if(this._sRuleType === Const.RULE_TYPE_COMPOUND && this._bOnlyBasicRule ){
				var errorData = {statusCode:"201"};
				var errorStr = Tools.getText("CREATE_COMPOUND_RULE");
				this._dealWithRequestError(errorData,errorStr);
				return;
}*/


var _dealWithRequestError = function(oError, sDefaultError, fnCallBack) {
			if (oError.statusCode === 404 || oError.statusCode >= 500) {
				return;
			}
			var aMessage = this._getBackendErrorMessage(oError);

			if (aMessage.length === 0) {
				aMessage.push({
					severity: "error",
					message: sDefaultError,
					code: ""
				});
			}
			var aFormattedMessage = [];
			for (var i = 0; i < aMessage.length; i++) {
				aFormattedMessage.push({
					type: aMessage[i].severity === "error" ? "Error" : (aMessage[i].severity === "info" ? "Information" : (aMessage[i].severity ===
						"warning" ? "Warning" : "None")),
					title: aMessage[i].message,
					description: aMessage[i].message,
					subtitle: aMessage[i].code,
					longtextUrl: aMessage[i].longtext_url,
					groupName: "BackendError"
				});
			}
			var oDialog = this.getErrorDialog();
			this.getErrorDialogPopOver().getModel().setData([]);
			this.getErrorDialogPopOver().getModel().setData(aFormattedMessage);
			if(fnCallBack){
				oDialog.attachEventOnce("afterClose", function(oEvent){
					fnCallBack();
				});
			}
			oDialog.open();
			this.getView().setBusy(false);
		};

var _getBackendErrorMessage = function (oError) {
			try {
				var oMessage = JSON.parse(oError.responseText).error;
				if (oMessage.innererror.errordetails) {
					return oMessage.innererror.errordetails;
				} else if (oMessage.message.value) {
					return [{
						severity: "error",
						message: oMessage.message.value,
						description: oMessage.message.value,
						longtext_url: "",
						subtitle: ""
					}];
				} else {
					return [];
				}
			} catch (error) {
				return [];
			}
		};
		
var getErrorDialog = function() {
			if (this._oBackendErrorDetailDialog) {
				this._oBackendErrorDetailDialog.destroy();
				this._oBackendErrorDetailDialog = null;
			}
			this.initBackendErrorDialog();
			return this._oBackendErrorDetailDialog;
		};

var initBackendErrorDialog = function() {
			if (!this._oBackendErrorDetailDialog) {
				this._oBackendErrorDetailDialog = createMessageView();
				this.getView().addDependent(this._oBackendErrorDetailDialog);
			}
		};
var createMessageView = function(){
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
			};		