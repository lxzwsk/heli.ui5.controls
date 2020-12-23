var timestampInList = function (oTimestamp) {
			if (!oTimestamp) {
				return "";
			}
			if (typeof oTimestamp === "string") {
				return oTimestamp;
			}
			var oDateTimeFormat = DateFormat.getDateTimeInstance({
				"style": "short",
				// "UTC": true
			});
			return oDateTimeFormat.format(oTimestamp);
		};
		
var formatDate=  function (oInput) {
			if (!oInput) {
				return "";
			}
			var oInternal = oInput;
			if (typeof oInput === "string") {
				oInternal = DateFormat.getDateTimeInstance().parse(oInput);
			}
			return DateFormat.getDateInstance().format(oInternal);
			// return oInput;
		};

var formatTime =  function (oInput) {
			if (!oInput) {
				return "";
			}
			var oInternal = oInput;
			if (typeof oInput === "string") {
				oInternal = DateFormat.getDateTimeInstance().parse(oInput);
			}
			return DateFormat.getTimeInstance().format(oInternal);
		};