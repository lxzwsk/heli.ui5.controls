sap.ui.define([],function(){
	return {
		items:[
				{name:"Format",
				 toolbarId:"Format",
				 buttons:[
							{name:"Number",text:"Formatter Number",path:"formatter/Number.js",type:"script"},
							{name:"Timestamp",text:"Formatter Timestamp",path:"formatter/Timestamp.js",type:"script"}
						]
				},
				{
					name:"Popover",
					toolbarId:"Popover",
					buttons:[
								{name:"Dialog",text:"dialog",path:"popover/Dialog.js",type:"script"},
								{name:"Error",text:"error",path:"popover/Error.js",type:"script"}
							]
				},{
					name:"Binding",
					toolbarid:"Binding",
					buttons:[
								{name:"BindExpress",text:"bindExpress",path:"binding/BindExpress.xml",type:"xml"},
								{name:"BindAggregation",text:"BindAggregation",path:"binding/BindAggregation.js",type:"script"}
						]
						
				}
		]
	};
});