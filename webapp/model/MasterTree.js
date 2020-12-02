sap.ui.define([], function() {
	return {
		treeData: [{
			name: "Input",
			desc: "Input Demo",
			icon: "sap-icon://text",
			leaf: false,
			child: [{
				name: "BasicInput",
				desc: "Base Input Demo",
				leaf: true,
				icon: ""
			}, {
				name: "Basic_Button",
				desc: "Basic Button",
				leaf: true,
				icon: "sap-icon://dropdown",
				expand:true
			}]
		}, {
			name: "UITable",
			desc: "UI Table Demo",
			icon: "sap-icon://table-view",
			leaf: false,
			child: [{
				name: "BasicTable",
				desc: "Basic Table",
				leaf: true
			}, {
				name: "Table_M_Table",
				desc: "Table_M_Table",
				leaf: true
			}]
		}, {
			name: "vizChart",
			desc: "vizChart Demo",
			icon: "sap-icon://vertical-bar-chart",
			leaf: false,
			child: [{
				name: "BasicChart",
				desc: "Basic Chart",
				leaf: true
			}, {
				name: "BasicChartPie",
				desc: "Basec ChartPie",
				leaf: true
			}, {
				name: "Chart_Stacked_Bar_Column",
				desc: "Chart_Stacked_Bar_Column",
				leaf: true
			}]
		}, {
			name: "MockServer",
			desc: "MockServer",
			icon: "sap-icon://official-service",
			leaf: false,
			child: [{
				name: "MockBasicTable",
				desc: "MockBasicTable",
				leaf: true
			}]
		}, {
			name: "SmartTable",
			desc: "SmartTable",
			icon: "sap-icon://table-view",
			leaf: false,
			child: [{
				name: "AnalyticalTable",
				desc: "AnalyticalTable",
				icon: "sap-icon://table-view",
				leaf: false,
				child: [{
					name: "AnalyticalTable_Basic",
					desc: "AnalyticalTable_Basic",
					icon: "sap-icon://table-view",
					leaf: true
				}]
			}, {
				name: "TreeTable",
				desc: "TreeTable",
				icon: "sap-icon://table-view",
				leaf: true
			}]
		}, {
			name: "Tools",
			desc: "Tools",
			icon: "sap-icon://wrench",
			leaf: false,
			child: [{
				name: "AutoTemplate",
				desc: "UITemplateBuild",
				icon: "sap-icon://bbyd-dashboard",
				leaf: true

			},{
				name:"GenerateCode",
				desc:"Generate code",
				icon:"sap-icon://source-code",
				leaf:true
			}, {
				name: "show_stock",
				desc: "show_stock",
				icon: "sap-icon://opportunity",
				leaf: true
			}, {
				name: "stock_overview",
				desc: "stock_overview",
				icon: "sap-icon://simulate",
				leaf: true
			}, {
				name: "stock_setting",
				desc: "stock_setting",
				icon: "sap-icon://action-settings",
				leaf: true
			}, {
				name: "WebSocket_Basic",
				desc: "WebSocket_Basic",
				icon: "sap-icon://meeting-room",
				leaf: true
			}, {
				name: "stockHelp_Test",
				desc: "stockHelp_Test",
				icon: "sap-icon://feed",
				leaf: true
			}]
		}, {
			name: "OData",
			desc: "OData",
			icon: "sap-icon://official-service",
			leaf: false,
			child: [{
				name: "OData_Basic",
				desc: "OData_Basic",
				icon: "sap-icon://table-view",
				leaf: true
			}]
		}, {
			name: "Popover_Basic",
			desc: "Popover_Basic",
			icon: "sap-icon://popup-window",
			leaf: false,
			child: [{
				name: "Popover_Basic",
				desc: "Popover_Basic",
				icon: "sap-icon://popup-window",
				leaf: true
			}]
		}, {
			name: "Order CURD",
			desc: "Order CURD",
			icon: "sap-icon://popup-window",
			leaf: false,
			child: [{
				name: "OrderCURD",
				desc: "OrderCURD",
				icon: "sap-icon://popup-window",
				leaf: true
			}]
		}, {
			name: "ES6",
			desc: "ES6",
			leaf: false,
			child: [{
				name: "ES6",
				desc: "ES6",
				leaf: true,
				expand:false
			}]
		}]

	};
});