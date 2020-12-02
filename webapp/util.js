sap.ui.define([
	"ZHELI_UI5_CONTROLS/model/MasterTree",
	"sap/m/MessageToast"
], function(MasterTree,MessageToast) {
	var fnBuildRoute = function() {
		return {
			config: {
				routerClass: "sap.m.routing.Router",
				viewPath: "ZHELI_UI5_CONTROLS.view",
				controlId: "AppRoot",
				viewType: "XML",
				async: true
			},
			targets: {
				master: {
					viewType: "XML",
					transition: "slide",
					clearAggregation: true,
					viewName: "Master",
					controlAggregation: "masterPages",
					viewLevel: 0
				},
				detail: {
					viewType: "XML",
					transition: "slide",
					clearAggregation: true,
					viewName: "Detail",
					viewLevel: 1,
					controlAggregation: "detailPages"
				}
			},
			routes: [{
				name: "master",
				pattern: "",
				greedy: false,
				target: ["master"]
			}, {
				name: "detail",
				pattern: "detail/{path}",
				greedy: false,
				target: ["detail", "master"]
			}]
		};

	};

	var fnBuildRouteByTreeData = function() {
		var jsonConfig = {
			routerClass: "sap.m.routing.Router",
			viewPath: "ZHELI_UI5_CONTROLS.view",
			controlId: "AppRoot",
			viewType: "XML",
			async: true
		};
		var jsonTargets = {
			master: {
				viewType: "XML",
				transition: "slide",
				clearAggregation: true,
				viewName: "Master",
				controlAggregation: "masterPages",
				viewLevel: 0
			},
			detail: {
				viewType: "XML",
				transition: "slide",
				clearAggregation: true,
				viewName: "Detail",
				viewLevel: 1,
				controlAggregation: "detailPages"
			}
		};
		var jsonRoutes = [{
			name: "master",
			pattern: "",
			greedy: false,
			target: ["master"]
		}, {
			name: "detail",
			pattern: "detail/{path}",
			greedy: false,
			target: ["detail", "master"]
		}];
		var jsonData = MasterTree.treeData;
		$.each(jsonData, function(i, node) {
			if (node.child) {
				fnBuildRouteByTreeNode(node.child, jsonTargets, jsonRoutes);
			} {

				//
				//  只有最后一级菜单能够导航
				//
				if (node.leaf) {
					jsonTargets[node.name] = fnGetTarget(node.name);
					jsonRoutes.push(fnGetRoute(node.name));
				}
			}
		}.bind(this));
		return {
			config: jsonConfig,
			targets: jsonTargets,
			routes: jsonRoutes

		};
	};

	var fnGetTarget = function(viewName) {
		return {
			viewType: "XML",
			transition: "slide",
			clearAggregation: true,
			viewName: viewName,
			controlAggregation: "detailPages",
			viewLevel: 0
		};
	};

	var fnGetRoute = function(viewName) {
		return {

			name: viewName,
			pattern: viewName + "/{path}",
			greedy: false,
			target: ["master",viewName]

		};
	};

	var fnBuildRouteByTreeNode = function(nodes, jsonTargets, jsonRoutes) {
		$.each(nodes, function(i, node) {

			if (node.child) {
				fnBuildRouteByTreeNode(node.child, jsonTargets, jsonRoutes);
			} else {

				//
				//   只有最后一级菜单能够导航
				//
				if (node.leaf) {
					jsonTargets[node.name] = fnGetTarget(node.name);
					jsonRoutes.push(fnGetRoute(node.name));
				}
			}

		}.bind(this));

	};
	
	var _copyStringToClipboard = function(copyText, successText, exceptionText){
		var oTemp = document.createElement("input");

			try {
				document.body.append(oTemp);
				oTemp.value = copyText;
				oTemp.select();
				document.execCommand("copy");
				oTemp.remove();

				MessageToast.show(successText);
			} catch (oException) {
				MessageToast.show(exceptionText);
			}
	};
	var fnGetDefaultViewPath = function(nodes){
		let sPath = null;
		for(let item of nodes){
			if(item.expand){
				sPath = item.name ;
				break;
			}
			if(item.child){
				sPath = fnGetDefaultViewPath(item.child);
			}
		}
		return sPath;
	};

	return {
		buildRoute: fnBuildRouteByTreeData,
		getDefaultPath:fnGetDefaultViewPath,
		copyStringToClipboard:_copyStringToClipboard
	};
});