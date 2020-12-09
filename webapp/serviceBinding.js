function initModel() {
	var sUrl = "/sap/opu/odata/sap/ICA_MATCHING_ITEM_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}