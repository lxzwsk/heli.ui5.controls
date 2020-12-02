sap.ui.define(["sap/ui/core/Control"], function(object) {
	var myObject = object.extend("heli.ui5.controls.Control.MyObject", {
		metadata: {
			properties: {
				value: {
					type: "string"
				}
			},
			events: {
				sumbit: {
					parameters: {
						values: {
							type: "string"
						}
					}
				}
			}
		},
		constructor: function(value, mSetting) {
			this.values = value;
			object.apply(this, mSetting);
		}
	});

	return myObject;
});