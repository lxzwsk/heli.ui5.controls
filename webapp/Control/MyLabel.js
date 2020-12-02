sap.ui.define(["sap/m/Label"], function(Label) {
	var maxValue = 100;
	var minValue = 10;
	var oLabel = Label.extend("heli.ui5.controls.Control.MyLabel", {
		metadata: {
			properties: {
				value: {
					type: "int",
					defaultValue: ""
				}
			},

			events: {
				alarm: {
					parameters: {
						value: {
							type: "string"
						}
					}
				},
				error: {
					parameters: {
						value: {
							type: "string"
						}
					}
				}
			}
		}
	});

	oLabel.prototype.checkValue = function() {
		var iValue = this.getValue();
		if (iValue < minValue) {
			this.fireError({
				value: iValue
			});
		} else if (iValue > maxValue) {
			this.fireAlarm({
				value: iValue
			});
		}
	};

	return oLabel;
});