sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("heli.ui5.controls.controller.WebSocket_Basic", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf heli.ui5.controls.view.WebSocket_Basic
		 */
		onInit: function() {

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf heli.ui5.controls.view.WebSocket_Basic
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf heli.ui5.controls.view.WebSocket_Basic
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf heli.ui5.controls.view.WebSocket_Basic
		 */
		//	onExit: function() {
		//
		//	}
		onConnectPress: function(oEvent) {
			var sUrl = this._getWsUrl();
			if (sUrl && sUrl.length > 0) {
				this.ws = new WebSocket(sUrl);
				this.ws.onmessage = this._MessageHandler;
			} else {
				MessageToast.show("请输入WS地址");
			}

		},
		onClosePress: function(oEvent) {
			if (this.ws.readyState < 2) {
				this.ws.close();
			}
		},
		onSendPress: function(oEvent) {

			if (this.ws.readyState === 1) {
				var sMsg = this.byId("iSender").getValue();
				this.ws.send(sMsg);
			}else{
				MessageToast.show("未连接服务，不能发送");
			}
		},
		_getWsUrl: function() {
			var oInput = this.byId("iWsUrl");
			return oInput.getValue();
		},
		_MessageHandler: function(oEvent) {
			var a = "abc";
		}

	});

});