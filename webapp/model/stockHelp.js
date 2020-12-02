sap.ui.define(["sap/ui/base/Object"], function(object) {
	var totalNum = 0;
	var currNum = 0;
	var stockType = Object.freeze({
		SZ: "sz",
		SH: "sh"
	});
	var eStockStatus = {
		up: 1, //涨
		down: 2, //跌
		none: 3 //盘整
	};

	var fnGetstockNos = function(stockType) {
		this.stockType = stockType;
		currNum = 0;
		totalNum = this.endNo - this.startNo;
		//var ifUrl = this.target + "";
		var ifUrl = this.target + "?stockType=" + stockType;
		for (var i = this.startNo; i < this.endNo; i++) {
			var targetUrl = ifUrl + "&stockNo=" + String.padd("R", 6, i.toString(), "0");
			$.ajax(targetUrl, {
				success: fnGetstockNosSuccess.bind(this),
				error: fnGetstockNosError.bind(this)
			});
		}

	};

	var fnGetstockNosSuccess = function(data, that) {
		var currThis = this;
		if (that!=="success") {
			currThis = that;
		}
		var strstockNo = data.split('=')[0].replace("var hq_str_", "");
		//var stockType = strstockNo.substring(0, 2);
		var stockNo = strstockNo.substring(2);
		currThis.stockType = strstockNo.substr(0, 2);
		currNum++;
		$.globalEval(data);
		var varName = "hq_str_" + currThis.stockType + stockNo;
		//var strData = eval(varName);
		var strData = window[varName];
		if (strData === "" || strData === undefined) {
			return;
		}
		var stockDesc = strData.split(",")[0];
		if (!currThis[currThis.stockType]) {
			currThis[currThis.stockType] = [{
				"stockNo": stockNo,
				"stockDesc": stockDesc,
				"stockType": currThis.stockType
			}];
		} else {
			currThis[currThis.stockType].push({
				"stockNo": stockNo,
				"stockDesc": stockDesc,
				"stockType": currThis.stockType
			});
		}
		//if (currNum === totalNum) {
		currThis.refreshComplete(
			 {
			 data: currThis[currThis.stockType]
			}
			//currThis[currThis.stockType]
		);
		//}
		//console.log(currNum);

	};
	var fnGetstockNosError = function(Error) {
		console.log(Error);
		var that = this;
		if (Error.status === 200 && Error.responseText) {
			fnGetstockNosSuccess(Error.responseText, that);
		}
	};

	var fnStockCallBack = function(data) {
		$.globalEval(data);
		var varName = data.split('=')[0].replace('var ', '');
		var strData = eval(varName);
		var aDatas = strData.split(",");
		var strstockType = varName.split('_')[2].substr(0, 2);
		var strstockNo = varName.split('_')[2].substr(2, 6);
		var jsonData = {
			title: aDatas[0],
			stockType: strstockType,
			stockNo: strstockNo,
			imgUrl: this.imgUrl,
			inPrice: this.inPrice,
			inQty: this.inQty,
			totalQty: this.totalQty,
			linedata: [],
			lineImg: [],
			summary: {},
			status: {
				showLR: false, //隐藏利润
				showImg: false, //隐藏图片
				autoRefresh: false //定时刷新
			},
			params: {
				autoTime: 1 //间隔时间（单位为分钟）
			}
		};
		fnParseData(aDatas, jsonData);

		this.getDataComplete({
			result: jsonData
		});

	};

	var fnBuildLineImg = function(jsonData) {
		var sLineImgUrl = "";

		//
		//   分时线
		//
		sLineImgUrl = jsonData.imgUrl + "min/n/" + jsonData.stockType + jsonData.stockNo + ".gif";
		jsonData.lineImg.push(sLineImgUrl);
		jsonData.currImgUrl = sLineImgUrl;

		//
		//   日线
		//
		sLineImgUrl = jsonData.imgUrl + "daily/n/" + jsonData.stockType + jsonData.stockNo + ".gif";
		jsonData.lineImg.push(sLineImgUrl);

		//
		//  周线
		//
		sLineImgUrl = jsonData.imgUrl + "weekly/n/" + jsonData.stockType + jsonData.stockNo + ".gif";
		jsonData.lineImg.push(sLineImgUrl);

		//
		//  月线
		//
		sLineImgUrl = jsonData.imgUrl + "monthly/n/" + jsonData.stockType + jsonData.stockNo + ".gif";
		jsonData.lineImg.push(sLineImgUrl);
	};

	var fnBuildDataDesc = function() {
		var lineDataDesc = [];
		lineDataDesc.push("股票名字");
		lineDataDesc.push("今日开盘价");
		lineDataDesc.push("昨日收盘价");
		lineDataDesc.push("当前价格");
		lineDataDesc.push("今日最高价");
		lineDataDesc.push("今日最低价");
		lineDataDesc.push("竞买价");
		lineDataDesc.push("竞卖价");
		lineDataDesc.push("成交的股票数");
		lineDataDesc.push("成交金额");
		lineDataDesc.push("买一（数量）");
		lineDataDesc.push("买一（金额）");
		lineDataDesc.push("买二（数量）");
		lineDataDesc.push("买二（金额）");
		lineDataDesc.push("买三（数量）");
		lineDataDesc.push("买三（金额）");
		lineDataDesc.push("买四（数量）");
		lineDataDesc.push("买四（金额）");
		lineDataDesc.push("买五（数量）");
		lineDataDesc.push("买五（金额）");
		lineDataDesc.push("卖一（数量）");
		lineDataDesc.push("卖一（金额）");
		lineDataDesc.push("卖二（数量）");
		lineDataDesc.push("卖二（金额）");
		lineDataDesc.push("卖三（数量）");
		lineDataDesc.push("卖三（金额）");
		lineDataDesc.push("卖四（数量）");
		lineDataDesc.push("卖四（金额）");
		lineDataDesc.push("卖五（数量）");
		lineDataDesc.push("卖五（金额）");
		lineDataDesc.push("日期");
		lineDataDesc.push("时间");
		return lineDataDesc;
	};

	var fnGetSummary = function(jsonData, datas) {
		//var oZFStatus = eStockStatus.none; // 涨幅状态
		//var oLRStatus = oZFStatus; // 利润状态

		jsonData.summary["jk"] = datas[1]; // 今开
		jsonData.summary["dq"] = datas[3]; // 当前
		jsonData.summary["zd"] = datas[5]; // 最低
		jsonData.summary["cjl"] = datas[8]; // 成交量
		jsonData.summary["cjr"] = datas[9]; //成交额
		jsonData.summary["zs"] = datas[2]; //昨收

		if (jsonData.summary["dq"] > 0) {

			// 涨跌计算公式 = (昨收 - 当前) /昨收
			jsonData.summary["zf"] = ((jsonData.summary["dq"] - jsonData.summary["zs"]) / jsonData.summary["zs"] * 100).toFixed(2);
		} else {
			jsonData.summary["zf"] = 0.00;
		}
		if (jsonData.inPrice > 0) {
			jsonData.summary["cbj"] = jsonData.inPrice; //成本价
			jsonData.summary["kc"] = jsonData.inQty; //库存
			jsonData.summary["kcr"] = jsonData.summary["cbj"] * jsonData.summary["kc"]; //库存额
			jsonData.summary["lr"] = (jsonData.summary["kc"] * jsonData.summary["dq"] - jsonData.summary["kcr"]).toFixed(2); //利润
			jsonData.summary["lrl"] = jsonData.summary["kcr"] === 0 ? 0 : (jsonData.summary["lr"] / jsonData.summary["kcr"] * 100).toFixed(2); //利润率
			jsonData.summary["dqzr"] = (jsonData.summary["dq"] * jsonData.summary["kc"]).toFixed(2); //当前总额
			jsonData.summary["jrlr"] = (jsonData.summary["dqzr"] - jsonData.summary["zs"] * jsonData.summary["kc"]).toFixed(2); //今天利润
			jsonData.summary["cjjj"] = (jsonData.summary["cjr"] / jsonData.summary["cjl"]).toFixed(2); //成交均价
			jsonData.summary["hsn"] = (jsonData.summary["cjl"] / jsonData.totalQty * 100).toFixed(2); //  换手率
		}

		//
		// 涨跌情况
		if (jsonData.summary["zf"] > 0) {
			jsonData.zfStatus = eStockStatus.up;
		} else if (jsonData.summary["zf"] < 0) {
			jsonData.zfStatus = eStockStatus.down;
		}

		//
		// 利润情况
		if (jsonData.summary["lr"] > 0) {
			jsonData.lrStatus = eStockStatus.up;
		} else if (jsonData.summary["lr"] < 0) {
			jsonData.lrStatus = eStockStatus.down;
		}

	};

	var fnParseData = function(datas, jsonData) {

		var lineDataDesc = fnBuildDataDesc();
		fnBuildLineImg(jsonData);
		for (var ind in datas) {
			if (ind === "0") {
				continue;
			}
			var oLine = {};
			oLine["linedesc"] = lineDataDesc[ind];
			oLine["linedata"] = datas[ind];
			jsonData.linedata.push(oLine);
		}
		//this._showImg(0);

		fnGetSummary(jsonData, datas);

	};

	var fnPadd = function(pos, len, str, value) {
		var currLen = str.length;
		var diffLen = len - currLen;
		//var str = this;
		if (currLen >= len) {
			return str;
		}
		for (var i = 0; i < diffLen; i++) {
			switch (pos) {
				case "R":
					str = value + str;
					break;
				case "L":
					str = str + value;
					break;
			}

		};
		return str;
	};

	var fnGetDataBystockNo = function(url) {
		$.ajax(url, {
			success: fnStockCallBack.bind(this)
		});
	};

	return object.extend("ZHELI_UI5_CONTROLS.model.stockHelp", {
		metadata: {
			properties: {
				target: {
					type: "sap.ui.core.URI",
					group: "Data",
					defaultValue: null
				},
				startNo: {
					type: "int",
					defaultValue: 0
				},
				endNo: {
					type: "int",
					defaultValue: 0
				},
				stockType: {
					type: "string",
					defaultValue: "sz"
				},
				stockUrl: {
					type: "string"
				},
				stockImgUrl: {
					type: "string"
				},
				stockNo: {
					type: "string"
				}
			},
			events: {
				refreshComplete: {},
				getDataComplete: {}
			}
		},
		constructor: function(target, startNo, endNo, mSettings) {
			this.target = target;
			this.startNo = startNo;
			this.endNo = endNo;
			String.padd = fnPadd;
			for (var ind in mSettings) {
				this[ind] = mSettings[ind];
			}

		},
		getStockNos: fnGetstockNos,
		getDataBystockNo: fnGetDataBystockNo
	});
});