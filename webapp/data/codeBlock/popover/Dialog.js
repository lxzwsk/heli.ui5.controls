/*
<core:FragmentDefinition
	xmlns="sap.m"
	xmlns:core="sap.ui.core">
	<Popover
		id="myPopover"
		title="{ProductId}"
		class="sapUiPopupWithPadding"
		placement="Right"
		initialFocus="action">
		<footer>
			<Toolbar>
				<ToolbarSpacer/>
				<Button
					id="action"
					text="Action"
					press="handleActionPress" />
			</Toolbar>
		</footer>
		<VBox>
		<Title text="{Name}" />
		<Image src="{ProductPicUrl}" width="15em" densityAware="false" />
		</VBox>
	</Popover>
</core:FragmentDefinition>
*/

var handlePopoverPress = function (oEvent) {
			var oCtx = oEvent.getSource().getBindingContext(),
				oControl = oEvent.getSource(),
				oView = this.getView();

			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "sap.m.sample.PopoverControllingCloseBehavior.view.Popover",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					oPopover.attachAfterOpen(function() {
						this.disablePointerEvents();
					}, this);
					oPopover.attachAfterClose(function() {
						this.enablePointerEvents();
					}, this);
					return oPopover;
				}.bind(this));
			}
			this._pPopover.then(function(oPopover) {
				oPopover.bindElement(oCtx.getPath());
				oPopover.openBy(oControl);
			});
		}