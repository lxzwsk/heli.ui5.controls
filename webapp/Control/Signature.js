sap.ui.define(["sap/ui/core/Control",
	"sap/m/Toolbar",
	"sap/m/Button",
	"sap/m/ToolbarSpacer",
], function(Control, ToolBar, Button, ToolbarSpacer) {
	var lastX = 0;
	var lastY = 0;
	var oControl = Control.extend("heli.ui5.controls.Control.Signature", {
		metadata: {
			properties: {
				lineWidth: {
					type: "int",
					defaultValue: "1"
				},
				strokeStyle: {
					type: "string",
					defaultValue: "#330000"
				},
				height: {
					type: "int",
					defaultValue: "300"
				},
				width: {
					type: "int",
					defaultValue: "300"
				}
			},

			events: {
				saveImg: {
					parameters: {
						value: {
							type: "string"
						}
					}
				}
			}
		},
		init: function(oEvent) {},
		onAfterRendering: function() {
			this._oCan = this.getDomRef("inner-content");
			if (this._oCan) {
				this._oCtx = this._oCan.getContext("2d");
				this._intitalCanvas(this._oCan);
			}
		},
		clear: function() {
			this._oCtx.setTransform(1, 0, 0, 1, 0, 0);
			this._oCtx.clearRect(0, 0, this._oCtx.canvas.width, this._oCtx.canvas.height);
		},
		saveToImg: function() {

		},
		Draw: function(x, y, isDown) {
			if (isDown) {
				
				var ctx = this._oCtx;
				ctx.beginPath();
				ctx.strokeStyle = this.getStrokeStyle();
				ctx.lineWidth = this.getLineWidth();
				ctx.lineJoin = "round";
				ctx.moveTo(lastX, lastY);
				ctx.lineTo(x, y);
				ctx.closePath();
				ctx.stroke();
			}
			lastX = x;
			lastY = y;
		},
		_oToolbar: null,
		_oCtx: null,
		_oCan: null,
		_mousePressed: false,
		_initialToolbar: function() {
			var that = this;
			if (!this._oToolbar) {
				this._oToolbar = new ToolBar();
				this._oToolbar.addContent(new Button({
					text: "Clear",
					press: this.clear.bind(this)
				}));
				//this._oToolbar.addContent(new ToolbarSpacer());
				this._oToolbar.addContent(new Button({
					text: "Save",
					press: that.clear.bind(that)
				}));
			}
		},
		_getOffsetLeft: function(obj) {
			var iOffsetLeft = 0;
			var sScriptHead = "obj";
			var sScriptMid = "";
			var sScriptEnd = ".offsetLeft";
			var sScript = sScriptHead + sScriptMid + sScriptEnd;
			iOffsetLeft = eval(sScript);
			while (iOffsetLeft === 0) {
				sScriptMid += ".offsetParent";
				sScript = sScriptHead + sScriptMid + sScriptEnd;
				iOffsetLeft = eval(sScript);
			}

			return iOffsetLeft;
		},
		_getOffsetTop: function(obj) {
			var iOffsetTop = 0;
			var sScriptHead = "obj";
			var sScriptMid = "";
			var sScriptEnd = ".offsetTop";
			var sScript = sScriptHead + sScriptMid + sScriptEnd;
			iOffsetTop = eval(sScript);
			while (iOffsetTop === 0) {
				sScriptMid += ".offsetParent";
				sScript = sScriptHead + sScriptMid + sScriptEnd;
				iOffsetTop = eval(sScript);
			}

			return iOffsetTop;
		},
		_intitalCanvas: function(oCanvas) {
			var that = this;
			//          触摸屏
			oCanvas.addEventListener('touchstart', function(event) {
				//console.log(1)
				if (event.targetTouches.length == 1) {
					event.preventDefault(); // 阻止浏览器默认事件，重要
					var touch = event.targetTouches[0];
					that._mousePressed = true;
					that.Draw(touch.pageX - that._getOffsetLeft(this), touch.pageY - that._getOffsetTop(this), false);
				}

			}, false);

			oCanvas.addEventListener('touchmove', function(event) {
				//console.log(2)
				if (event.targetTouches.length == 1) {
					event.preventDefault(); // 阻止浏览器默认事件，重要
					var touch = event.targetTouches[0];
					if (that._mousePressed) {
						that.Draw(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop, true);
					}
				}

			}, false);

			oCanvas.addEventListener('touchend', function(event) {
				//console.log(3)
				if (event.targetTouches.length == 1) {
					event.preventDefault(); // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
					//                  var touch = event.targetTouches[0];
					that._mousePressed = false;
				}
			}, false);
			/*c.addEventListener('touchcancel', function (event) {
			    console.log(4)
			    mousePressed = false;
			},false);*/

			//         鼠标
			oCanvas.onmousedown = function(event) {
				that._mousePressed = true;
				//this.offsetLeft = 0;
				//this.offsetTop = 300;
				that.Draw(event.pageX - that._getOffsetLeft(this), event.pageY - that._getOffsetTop(this), false);
			};

			oCanvas.onmousemove = function(event) {
				if (that._mousePressed) {
					//this.offsetLeft = 0;
					//this.offsetTop = 300;
					that.Draw(event.pageX - that._getOffsetLeft(this), event.pageY - that._getOffsetTop(this), true);
				}
			};

			oCanvas.onmouseup = function(event) {
				that._mousePressed = false;
			};
		},

		renderer: function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.write(">");
			oRm.write("<canvas");
			oRm.writeAttribute("id", oControl.getId() + "-inner-content");
			oRm.writeAttribute("height", oControl.getHeight());
			oRm.writeAttribute("width", oControl.getWidth());
			oRm.writeAttribute("style", "border:1px solid #6699cc");
			oRm.write(" >");
			oRm.write("</canvas>");

			if (!oControl._oToolbar) {
				oControl._initialToolbar();
			}
			oRm.renderControl(oControl._oToolbar);

			oRm.write("</div>");
		}
	});
});