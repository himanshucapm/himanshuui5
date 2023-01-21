var that, newDate ,oData;
sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	"ZHrApprove/util/Formatter"
	],
	function(MessageBox,Fragment,Controller, JSONModel,MessageToast) {
	"use strict";
		
return sap.ui.controller("ZHrApprove.view.View1", {
		 onInit: function() {
			 	this.newBusy = new sap.m.BusyDialog();
				this.model = this.getOwnerComponent().getModel();
				that = this;
				if (!jQuery.support.touch) {
					this.getView().addStyleClass("sapUiSizeCompact");
				}
				if (sap.ui.Device.system.desktop) {
				} 
},
			 
//////////////////////////////////////////////////////////////////
			
/*onSearch : function(){
debugger
	var check  = false;
	var oView = this.getView();
	var user = new sap.ushell.services.UserInfo();
	var uid = user.getId();
	var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
	var datefrm1 = this.getView().byId("idSearchDate").getFrom();
	var dateVal = dateFormat1.format(datefrm1)+"T00:00:00";
	var dateto2 = this.getView().byId("idSearchDate").getTo();
	var dateVal2 = dateFormat1.format(dateto2)+"T00:00:00";	
	var EmpId   = this.getView().byId("IdEmp").getValue();
		if(dateVal == "T00:00:00"){
		// this.getView().byId("idSearchDate").setValueState("Error");
		// return false;
		} else {
		// this.getView().byId("idSearchDate").setValueState("None"); 
		}
		
		if(dateVal!=null){
		var dateFrom = this.payLoadDate(dateVal);
		if (dateFrom == "NaN-NaN-NaNT00:00:00"){
		dateFrom = "";
		}
		}else{
		var dateFrom=null;
		}
		
		if(dateVal2!=null){
		var dateTo = this.payLoadDate(dateVal2);
		if (dateTo == "NaN-NaN-NaNT00:00:00"){
		dateTo = "";
		}
		}else{
		var dateTo=null;
		}
		
		var oViewObj = this.getView();
		var that = this;
		var EmpListSetJModel = oViewObj.getModel("EmpListSetJModel");
			if (!EmpListSetJModel) {
			EmpListSetJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(EmpListSetJModel, "EmpListSetJModel");
			}
		var sServiceUrl = "/sap/opu/odata/sap/ZER_SEPERATION_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
			"Content-Type" : "application/json"
			});
		var fncSuccess = function(oData, oResponse) 									// success function
			{
			EmpListSetJModel.setData(oData.results);
			}
		var fncError = function(oError) { 	 											// error handler
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
				
			if(dateFrom){
				var path = "SeparationApproveSet?$filter=Uname eq '"+uid
			 		+"' and DateFrom eq datetime'"+dateFrom
			 		+"' and DateTo eq datetime'"+dateTo
			 		+"' and Pernr eq '"+EmpId+"'";
			}else{
				var path = "SeparationApproveSet?$filter=Uname eq '"+uid
			 		+"' and DateFrom eq "+null
			 		+' and DateTo eq '+null
			 		+" and Pernr eq '"+EmpId+"'";
			}
			
			oReadModel.read(path, {
				success : fncSuccess,
			    error : fncError
			});
},*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onChange : function(){
debugger
	var HrMng = this.getView().byId("idAction2").getSelectedKey();
		if(HrMng == "A"){
		this.getView().byId("idSwitch").setVisible(true);
		this.getView().byId("IdFnlRelDt").setVisible(true);
		this.getView().byId("idHrComments").setVisible(true);
		}
		
		if(HrMng == "H"){
		this.getView().byId("IdFnlRelDt").setVisible(true);	
		this.getView().byId("idSwitch").setVisible(false);
		this.getView().byId("idHrComments").setVisible(true);
		}
		
		else if(HrMng == "R"){
		this.getView().byId("IdFnlRelDt").setVisible(false);	
		this.getView().byId("idSwitch").setVisible(false);
		this.getView().byId("idHrComments").setVisible(true);
		}
},		    
		    
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/		    
		    
		    
		   
		})
	});