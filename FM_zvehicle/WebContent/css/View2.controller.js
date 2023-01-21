jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("zfieldplanrepor.utils.Formatter");

var that, newDate, PlanInspRepJModel;

sap.ui.define([
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet",
	],
	
function(Export, Controller, JSONModel, ExportTypeCSV, Spreadsheet) {
"use strict";
return sap.ui.controller("zfieldplanrepor.controller.View2", {

onInit: function(){
	//that = this;
	
	debugger
/*	sap.ui.core.UIComponent.getRouterFor(this).getRoute("View2").attachMatched(this._onRoute, this);
	
	var oViewObj = this.getView();
	PlanInspRepJModel = oViewObj.getModel("PlanInspRepJModel");
	if (!PlanInspRepJModel) {
		PlanInspRepJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(PlanInspRepJModel, "PlanInspRepJModel");
	}*/
	
	var that = this;
	
	sap.ui.core.UIComponent.getRouterFor(this).getRoute(
	"View2").attachMatched(this._onRoute, this);
	
	var fitmentTb1JModel = new sap.ui.model.json.JSONModel();
	fitmentTb1JModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
	var idFitmentPlanTable= this.getView().byId("idFitmentPlanTable");
	idFitmentPlanTable.setModel(fitmentTb1JModel,"fitmentTb1JModel");
	
},
//////////////////////////////////////////////////////////////////////////////////////////////////
_onRoute: function(oEvent){
	debugger

	var that = this;
	that.initialLoad = true;
	var tempjsonString = e.getParameter("arguments").entity;
	var jsonstring = tempjsonString.replace(/@/g, "/");
	var tempSelectedData = JSON.parse(jsonstring);
	this.SelectedData  = JSON.parse(tempSelectedData);
	
	
	var getRequestDataJModel = oView.getModel("getRequestDataJModel");
	if (!getRequestDataJModel) {
		getRequestDataJModel = new sap.ui.model.json.JSONModel();
		oView.setModel(getRequestDataJModel, "getRequestDataJModel");
	}
	
	getRequestDataJModel.setData(SelectedData);
	
/*	var that = this;
	
	sap.ui.core.UIComponent.getRouterFor(this).getRoute(
	"S2").attachMatched(this._onRoute, this);
	
	var fitmentTb1JModel = new sap.ui.model.json.JSONModel();
	fitmentTb1JModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
	var idFitmentPlanTable= this.getView().byId("idFitmentPlanTable");
	idFitmentPlanTable.setModel(fitmentTb1JModel,"fitmentTb1JModel");*/
	

	/*var tempjsonString = oEvent.getParameter("arguments").entity;
	var jsonstring = tempjsonString.replace(/@/g, "/");
	var tempSelectedData = JSON.parse(jsonstring);
	this.SelectedData  = JSON.parse(tempSelectedData);*/
},

onAfterRendering:function(){
	debugger
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
	//var path = oEvent.getSource().getBindingContext("PlanInspRepJModel").getPath().split('/')[1];
	//var Plandata = oEvent.getSource().getBindingContext("PlanInspRepJModel").getModel().getData()[path];
	
	//var plandate   = Plandata.TestPlanDate;
	
	var selectedData={};
	
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("View2",{"entity":JSON.stringify(jsonstring)});
},

//////////////////////////////////////////////////////////////////////////////////////////////////


});
});
