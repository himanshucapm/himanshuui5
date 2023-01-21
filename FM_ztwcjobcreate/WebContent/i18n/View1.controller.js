jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("zfieldplanrepor.utils.Formatter");

var that, newDate, getExcelJModel, PlanInspRepJModel;

sap.ui.define([
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet",
	],
	
function(Export, Controller, JSONModel, ExportTypeCSV, Spreadsheet) {
"use strict";
return sap.ui.controller("zfieldplanrepor.controller.View1", {

onInit: function(){
	that = this;
	
	debugger
	
	var oViewObj = this.getView();
	PlanInspRepJModel = oViewObj.getModel("PlanInspRepJModel");
	if (!PlanInspRepJModel) {
		PlanInspRepJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(PlanInspRepJModel, "PlanInspRepJModel");
	}
	
},
//////////////////////////////////////////////////////////////////////////////////////////////////
_onRoute: function(){
	

},
//////////////////////////////////////////////////////////////////////////////////////////////////
bindGetTestRequest: function(){
	debugger;
	var that =this;
	var oView = this.getView();
	var GetTestRequestSetJModel = oView.getModel("GetTestRequestSetJModel");
	if (!GetTestRequestSetJModel) {
		GetTestRequestSetJModel = new sap.ui.model.json.JSONModel();
		oView.setModel(GetTestRequestSetJModel, "GetTestRequestSetJModel");
	}

	var sPathGetRequestSet = "/GetTestPlanForFitmentSet?$filter=Flag eq 'I' and Uname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
	var frameworkODataModel = that.getOwnerComponent().getModel();
	var oParamsGetRequestSet = {};
	oParamsGetRequestSet.context = "";
	oParamsGetRequestSet.urlParameters = "";
	oParamsGetRequestSet.success = function(oData, oResponse) { // success handler
		
		GetTestRequestSetJModel.setData(oData.results);
		
	};
	oParamsGetRequestSet.error = function(oError) { // error handler 		
		jQuery.sap.log.error("read publishing group data failed");
	}.bind(this);
	frameworkODataModel.read(sPathGetRequestSet, oParamsGetRequestSet);
	frameworkODataModel.attachRequestCompleted(function() {
		
	});

},

//////////////////////////////////////////////////////////////////////////////////////////////////
onSearch: function(){
		debugger;
		var PlanGuid = this.getView().byId("idPlan").getSelectedKey();
		var VehReg = this.getView().byId("idVehNo").getValue();
		var PlanStatus = this.getView().byId("idPlanStatus").getSelectedKey();
		var FitStatus = this.getView().byId("idFitmentStatus").getSelectedKey();
		
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/"; 
	
	//var sPathCartListSet ="/InspectionReportSet?$expand=ReportToDetailNvg/NavtoFitmentDetail&$filter=TestPlanGuid eq '"+PlanGuid+"' and DateFrom eq datetime'"+dateFrom+"' and DateTo eq datetime'"+dateTo+"' and RegNo eq '"+VehReg+"' and PlanStatus eq '"+PlanStatus+"' and FitStatus eq '"+FitStatus+"'";
	var sPathCartListSet ="/InspectionReportDetailSet?$filter=PlanGuid eq ''&$expand=InspReportToDetailNvg,InspReportToVechNvg";
	//var sPathCartListSet ="/TreeSet";
	
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			var oParamsCartListSet = {};
			
			oParamsCartListSet.success = function(oData, oResponse) {
				debugger
				
				 // MaterialListSetJModel.setData(oData.results);
	             var deepData = that.transformTreeData(oData.results);
				
				PlanInspRepJModel.setData(deepData);
				that.getView().getModel("PlanInspRepJModel").setData(deepData);
				PlanInspRepJModel.refresh();
				//var nodesIn = oData.results;
				
			  	debugger;
			/*    var nodes = []; //'deep' object structure
			    var nodeMap = {}; //'map', each node is an attribute
			    
			    if (nodesIn) {
			      var nodeOut;
			      var parentId;

			      for (var i = 0; i < nodesIn.length; i++) {
			        var nodeIn = nodesIn[i];

			        nodeOut = {
			          Child: nodeIn.Child,
			          TestPlanNumber: nodeIn.TestPlanNumber,
			          PlanGuid: nodeIn.PlanGuid,
			          children: []
			        };

			        var Parent = nodeIn.Parent;
			        if (nodeIn.Parent === nodeIn.Child) {
			          nodes.push(nodeOut);
			        } else if (Parent && Parent > 0) {

			          var parent = nodeMap[nodeIn.Parent];
			          if (parent) {
			            parent.children.push(nodeOut);
			          }
			        }
			        nodeMap[nodeOut.Id] = nodeOut;
			      }
			    }*/
				
				//
				
				
				
	              
	              /*var nodesModel = new sap.ui.model.json.JSONModel();
	              nodesModel.setData({ children: deepData });	              
	              this.getView().setModel(nodesModel);*/
	              
	              //var amountModel = this.getView().getModel("nodesModel");
	              
	              //this._RaceAmountDispDialog.setModel(amountModel,"amountModel");
	              
	          /*    var raceTbl = this.getView().byId("idRaceTable");
	              var amountModel = this.getView().getModel();  */            
	              
	              
	              
	             //this._RaceAmountDialog.setModel(amountModel);
				
				
				//var oModel_tree = new sap.ui.model.json.JSONModel();
				//oModel_tree.setData(oData.results);
			/*	that.getView().setModel(oModel_tree, "oModel_tree");
				that.getView().getModel("oModel_tree").refresh();*/
				
		/*		var oModel2 = this.getOwnerComponent().getModel();
				this.getView().setModel(oModel2);*/
				
				
				//PlanInspRepJModel.setData(arr);
		/*		PlanInspRepJModel.setData(final);
				getExcelJModel.setData(arr1);*/
				
			};
			oParamsCartListSet.error = function(oError) {
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		
},


transformTreeData: function(nodesIn) {
    var nodes = []; //'deep' object structure
    var nodeMap = {}; //'map', each node is an attribute
    if (nodesIn) {
      var nodeOut;
      var Parent;

      for (var i = 0; i < nodesIn.length; i++) {
        var nodeIn = nodesIn[i];

        nodeOut = {
        		 Parent: nodeIn.Parent,
                 Child: nodeIn.Child,
                 TestPlanNumber: nodeIn.TestPlanNumber,
                 PlanGuid: nodeIn.PlanGuid,
                 children: []
        };

        Parent = nodeIn.Parent;
        if (nodeIn.Parent === nodeIn.Child) {
          //there is no parent, must be top level
          nodes.push(nodeOut);
        } else if (Parent && Parent > 0) {

          var parent = nodeMap[nodeIn.Parent];
          if (parent) {
            parent.children.push(nodeOut);
          }
        }
        nodeMap[nodeOut.Child] = nodeOut;
      }
    }

    return nodes;
  },

//////////////////////////////////////////////////////////////////////////////////////////////////

  onDetailPress: function(oEvent){
	debugger
	var path = oEvent.getSource().getBindingContext("PlanInspRepJModel").getPath();
	var plandata = oEvent.getSource().getBindingContext("PlanInspRepJModel").getObject(path);
	
	var selectedData={};
	selectedData.data1 = "Data1";
	selectedData.data2 = "Data2";
	
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("View2",{"entity":JSON.stringify(jsonstring)});
},

//////////////////////////////////////////////////////////////////////////////////////////////////

onDownload : sap.m.Table.prototype.exportData || function(oEvent) {
	 debugger
	 	 
	 var oExport = new sap.ui.core.util.Export({
	 exportType : new sap.ui.core.util.ExportTypeCSV({
	 separatorChar: "\t",
	 mimeType: "application/vnd.ms-excel",
	 charset: "utf-8",
	 fileExtension: "xls"
	}),
			
	 models : this.getView().getModel("getExcelJModel"),
		 rows : {
		 path : "/",
	 },
					 	
	 columns: [{
		name: "Test Plan No",
		template: {
		content: "{TestPlanNumber}"
		},
	 },
	{
		name: "Test Plan Date",
		template: {
		content: "{path:'TestPlanDate',formatter:'zftplanreport.util.formatter.date1'}"
		},								
	},
	{
		name: "Vehicle Number",
		template: {
		content: "{RegNo}"
		},								
	},
	
	{
		name: "Fitment No",
		template: {
		content: "{FitmentNo}"
		},								
	},
	
	{
		name: "Inspection No",
		template: {
		content: "{InspNo}"
		},								
	},
	
	{
		name: "Fitment/Inspection Date",
		template: {
		content: "{path:'InspDt',formatter:'zftplanreport.util.formatter.date1'}"
		},								
	},

	{
		name: "Meter Status",
		template: {
		content: "{MeterStatusDesc}"
		},								
	},

	{
		name: "Meter Reading",
		template: {
		content: "{HeadMeterReading}"
		},								
	},	 
	
	{
		name: "KM Covered",
		template: {
		content: "{HeadKmCovered}"
		},								
	},
	
	{
		name: "Total KM Covered",
		template: {
		content: "{HeadTKMCovered}"
		},								
	},
	
	{
		name: "Tyre Position",
		template: {
		content: "{TyrePosition}"
		},								
	},
	
	{
		name: "Tyre Removal Status",
		template: {
		content: "{RemoveDesc}"
		},								
	},
	
	{
		name: "Removal Reason",
		template: {
		content: "{RemReasonDesc}"
		},								
	},
	
	{
		name: "Defect Code",
		template: {
		content: "{DefectDesc}"
		},								
	},
	
	{
		name: "Stencil Number",
		template: {
		content: "{StnclNumber}"
		},								
	},
	
	{
		name: "Group",
		template: {
		content: "{GroupType}"
		},								
	},
	
	{
		name: "IP Condition",
		template: {
		content: "{IpCondition}"
		},								
	},
	
	{
		name: "IP PSI",
		template: {
		content: "{IpPsi}"
		},								
	},
	
	{
		name: "Hardness",
		template: {
		content: "{Hardness}"
		},								
	},
	
	{
		name: "Original NSD",
		template: {
		content: "{OrgNsd}"
		},								
	},
	
	{
		name: "G1 NSD (mm)",
		template: {
		content: "{G1Nsd}"
		},								
	},
	
	{
		name: "G2 NSD (mm)",
		template: {
		content: "{G2Nsd}"
		},								
	},
	
	{
		name: "G3 NSD (mm)",
		template: {
		content: "{G3Nsd}"
		},								
	},
	
	{
		name: "G4 NSD (mm)",
		template: {
		content: "{G4Nsd}"
		},								
	},
	
	{
		name: "G5 NSD (mm)",
		template: {
		content: "{G5Nsd}"
		},								
	},
	
	{
		name: "G6 NSD (mm)",
		template: {
		content: "{G6Nsd}"
		},								
	},
	
	{
		name: "Minimum NSD",
		template: {
		content: "{MinNsd}"
		},								
	},

	{
		name: "KM Suspended",
		template: {
		content: "{KmSuspended}"
		},								
	},
	
	{
		name: "KM Covered",
		template: {
		content: "{KMCovered}"
		},								
	},
	
	{
		name: "Total KM Covered",
		template: {
		content: "{TotKmCovered}"
		},								
	},
	
	{
		name: "% Wear",
		template: {
		content: "{Wear}"
		},								
	},
	
	{
		name: "Projected Milage",
		template: {
		content: "{MilageProj}"
		},								
	},
	
	{
		name: "KM per MM",
		template: {
		content: "{KmPerMm}"
		},								
	},
	
	{
		name: "Wear Type",
		template: {
		content: "{WearDesc}"
		},								
	},
	
	{
		name: "Gravity",
		template: {
		content: "{Gravity}"
		},								
	},	
	
	{
		name: "PWA",
		template: {
		content: "{PwaDesc}"
		},
	}	
	
	 ]

});
	 //* download exported file

	oExport.saveFile().always(function() {
		this.destroy();
	});
},	

});
});
