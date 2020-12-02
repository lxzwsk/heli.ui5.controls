sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.BaseController", {

		showError: function(sMessage) {
			MessageToast.show(sMessage);
		},
		navTo: function(target) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (oRouter.getTarget(target)) {
				oRouter.navTo(target, {
					path: "0"
				});
			} else {
				this.showError("DEMO未完成");
			}
		},
		onHideMaster: function(oEvent) {
			var oBtn = oEvent.getSource();
			var sBtnText = oBtn.getText();
			var oApp = this.getView().getParent().getParent();
			if (sBtnText === 'HideMaster') {
				oApp.setMode("HideMode");
				oBtn.setText("ShowMaster");
			} else {
				oApp.setMode("ShowHideMode");
				oBtn.setText("HideMaster");
			}
		},
		onReload: function() {
			window.location.reload();
		},
		_addHideMasterButton: function() {
			var oPage = this.getView().getAggregation("content")[0];
			var oBar = new sap.m.Toolbar();
			//var oBar = oPage.getAggregation("subHeader");
			var oButton = new sap.m.Button({
				text: "HideMaster",
				icon: "sap-icon://full-screen"
			});
			oButton.attachPress(this.onHideMaster.bind(this));
			oBar.addAggregation("content", oButton);
			oPage.insertContent(oBar, 0);
		}

	});

});