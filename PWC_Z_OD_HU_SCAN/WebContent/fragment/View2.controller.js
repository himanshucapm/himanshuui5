
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"zexpoinvoice/util/Formatter",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox,Formatter,JSONModel) {
"use strict";

return Controller.extend("zexpoinvoice.controller.View2", {
	onInit:function(){
		debugger
		var that = this;
		 sap.ui.core.UIComponent.getRouterFor(this).getRoute("page2").attachMatched(this._onRoute, this);
		},
	
	_onRoute:function(e){
		debugger
		var that 				= this;
		var tempjsonString  	= e.getParameter("arguments").entity;
		var jsonstring 			= tempjsonString.replace(/@/g, "/");
		var tempSelectedData 	= JSON.parse(jsonstring);
		},

		
	onHome:function(){
		var selectedData={};
	    var tempjsonString = JSON.stringify(selectedData);
		var jsonstring = tempjsonString.replace(/\//g, "@");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("page1",{"entity":JSON.stringify(jsonstring)});
		},
});
});