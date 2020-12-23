/*
<Link id="objectPage.overview.form.diffenerce.Amount.link" 
	  text="{ parts:[{path:'head>/DiffAmt'},{path:'head>/Curr'}], formatter:'.formatter.linkAmountCurrency',type: 'sap.ui.model.type.Currency', formatOptions: {showMeasure: false} }" 
	  tooltip="{i18n>navigationToBalance}" 
	  press="onNavigationToBalance"
	  class="commentLink"  
	  emphasized="true"
 />
*/
var linkAmountCurrency = function (sNumber, sCurrency) {
			if (typeof sNumber === "number") {
				sNumber += "";
			}
			//if (sNumber && sCurrency) {
			return NumberFormat.getCurrencyInstance().format(sNumber, sCurrency);
			//}
			//return sNumber;
		};
