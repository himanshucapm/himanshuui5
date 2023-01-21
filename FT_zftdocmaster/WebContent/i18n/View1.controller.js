var PlanInspRepJModel, that;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/UploadCollectionParameter",
	"zftplanreportmd/utils/Formatter"
], function (Controller, UploadCollectionParameter, Formatter) {
	"use strict";
	return Controller.extend("zftplanreportmd.controller.View1", {
		onInit: function () {
				debugger
				var that = this;
					that.bindMasterListFunction();
		},		
/****************************************************/
		bindMasterListFunction : function (){
			debugger
			var master = this;
			var serviceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(serviceUrl);
			//var oModel = this.getOwnerComponent().getModel();
			var path = "/InspectionReportDetailSet?$filter=PlanGuid eq '' and FitStatus eq 'A' and RegNo eq '' and PlanRevNo eq ''&$expand=InspReportToDetailNvg,InspReportToVechNvg";
			var testPlanNolist = this.getView().byId("idTestPlanNo");
			var _self = this;
			var loListTemplate = "";
				oDataModel.read(path, null , null , false, function(oData, oResponse){
					var that = _self;
					master.reqdata = oData.results;
					var lngth = oData.results.length;
					if(lngth !== 0){
						var tempModel = new sap.ui.model.json.JSONModel({"InspectionReportDetailSet" :  master.reqdata});
						loListTemplate = new sap.m.ObjectListItem(
								{
									type : sap.m.ListType.Active,
									title : "{TestPlanNumber}",
									intro : "",
									number : "{InspNo}",
									numberUnit : "{path:'InspDt',formatter:'zftplanreportmd.utils.Formatter.date1'}",
									press : function(e) {
										debugger
										that.listItemSelect(e);
									},
									attributes : [
											new sap.m.ObjectAttribute(
													{
														text : "Fitment No: "+ "{FitmentNo}"
													})
											 ]
						});
						testPlanNolist.unbindAggregation("items");
						testPlanNolist.setModel(tempModel);
						tempModel.setSizeLimit(tempModel.oData.InspectionReportDetailSet.length);
						testPlanNolist.bindAggregation("items", "/InspectionReportDetailSet", loListTemplate);

					
					}
				})
		},
			
/***********************************************/
			toggleFullScreen : function(oEvt) {
				var lo_Id = oEvt.getSource().sId;
				var lo_Cid = this.getView().byId(lo_Id);
				var spapp = oEvt.getSource().getParent().getParent().getParent().getParent();
				if (spapp.getMode() === 'ShowHideMode') 
				{
					spapp.setMode('HideMode');
					lo_Cid.setIcon('sap-icon://exit-full-screen').setTooltip('Exit from full screen mode');
				} 
				else 
				{
					spapp.setMode('ShowHideMode');
					lo_Cid.setIcon('sap-icon://full-screen').setTooltip('Show in full screen mode');
				}
			},
/****************************************************//*
			bindDetailsPage: function (selectedTestPlanNo, inspectionNumber, fitmentNumber){
				debugger
				var _self = this;
				var oBindingPath = "Model>/FitmentHeaderSet(PlanGuid='',PlanRevno=''," +
						"PlanItemNo='',RegNo='',Cart='',LInspNo='"+inspectionNumber+"'," +
								"FitmentNo='"+fitmentNumber+"',InspNo='')?$expand=NavtoFitmentDetail";
				var form = this.getView().byId("idSimpleForm");
				form.bindElement(oBindingPath);
				//this.TestPlanNumber = selectedTestPlanNo;
				var obj = this.getView().byId("splitApp");
				obj.toDetail(this.getView().byId("inpectionDetailPage"));
				
			},
*//**************************************************//*
			listItemSelect: function (e){
				debugger
				var _self = this;
		    	var selectedTestPlanNo = e.getSource().getTitle();
		    	var inspectionNumber = e.getSource().getNumber();
		    	var fitmentNumber = e.getSource().getNumber();
		    	this.selectedTestPlanNo = selectedTestPlanNo;
		    	this.inspectionNumber = inspectionNumber;
		    	this.fitmentNumber = fitmentNumber;
		    	this.bindDetailsPage(selectedTestPlanNo, inspectionNumber, fitmentNumber);
		    	var obj = this.getView().byId("splitApp");
					obj.toDetail(this.getView().byId("inpectionDetailPage"));
					
			},
*/	
			
	});
});