sap.ui.define([ 
	"sap/ui/core/mvc/Controller", 
	"sap/ui/core/routing/History" 
	], 
function(Controller, History) {
"use strict";

var Controller = Controller.extend("com.musashi.scan.controller.BaseController", {

		getRouter: function(that) {
			if (that !== undefined) {
				return sap.ui.core.UIComponent.getRouterFor(that);
			}
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getModel : function(sName) {
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		},

		setModel : function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle : function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack : function() {
			this.getRouter().navTo("home");
		},
		
		_getClonedObject: function(obj) {
			return JSON.parse(JSON.stringify(obj));
		},
		showErrorMessage: function(message, title) {
			sap.m.MessageBox.error(message, {
				title: title
			});
		},
		onLiveChangeNumberFields:function(oEvent){
			var oSrc=oEvent.getSource();
			var oVal=oEvent.getParameter("value");
			var val=oSrc._$input.data('val');
			var regx= /^\d{0,11}(\.\d{0,2})?$/
			if(!oVal.match(regx) && oVal.length>0){
				oVal=val;
				oSrc.setValue(oVal);
			}
			oSrc._$input.data('val',oVal);
		},
		
		approverActionsPayload:function(oData)	{
			var that=this;
			var oDataModel=this.getOwnerComponent().getModel("oDataModelSRV");
			oDataModel.create("/PurchaseReqListSet", oData, {
				success:function(oData,oResponse){
					that.oMessages=[];
					if(oData.NAVPRCrtHdrtoMessages!==undefined){
						if(oData.NAVPRCrtHdrtoMessages.results!==undefined){
							var messagesResult=oData.NAVPRCrtHdrtoMessages.results;
							if(messagesResult.length>0){
								var successMessages=[];
								for(var i=0;i<messagesResult.length;i++){
									var mType;
									if(messagesResult[i].Type==='S'){
										successMessages.push(messagesResult[i]);
									}
									if (messagesResult[i].Type === "E") {
										mType = "Error";
										var odata = {
												type: mType,
												title: messagesResult[i].MessageV1,
												subtitle: messagesResult[i].Message,
												description: messagesResult[i].Message
										};
										that.oMessages.push(odata);
									}
								}
								if(that.oMessages.length>0){
									that._initateMessagePopover(that.oMessages);
									MessageBox.information(oResource.getText("messageBox3"), {
										actions: [oResource.getText("checkMessages")],
										onClose: function(oAction) {
											if (oAction === oResource.getText("checkMessages")) {
												that.openMessagePopover();
											}
										}
									});
								}else{
									if(successMessages.length>0){
										var oAppAcModel = new sap.ui.model.json.JSONModel(successMessages);
										if (!that._oApproverActionsDialog) {
											that._oApproverActionsDialog = sap.ui.xmlfragment("com.musashi.scan.fragment.ApproverActionsDialog", that);
											that.getView().addDependent(that._oApproverActionsDialog);
										}
										that._oApproverActionsDialog.setModel(oAppAcModel,"approverActionsListModel");
										that._oApproverActionsDialog.open();
									}
								}
							}
						}
					}
				},
				error:function(error){
					that.showErrorMessage(error.message, oResource.getText("Error"));
				}
			});
		},
    });
    return Controller;
});
