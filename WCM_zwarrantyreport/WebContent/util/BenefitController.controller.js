jQuery.sap.require("com.jkt.ui.mybenefit.demo.app.util.Formatter");
//jQuery.sap.require("com.jkt.ui.mybenefit.demo.app.util.pdfString");

sap.ui.define([
               'jquery.sap.global',
               'sap/ui/core/mvc/Controller',
               'sap/ui/model/json/JSONModel',
               'sap/m/MessageToast',
               'sap/m/MessageBox',
               ], function(jQuery, Controller, JSONModel, MessageToast,MessageBox) {
  "use strict";

  var Controller =sap.ui.controller("com.jkt.ui.mybenefit.demo.app.controller.BenefitController", {
    onInit: function() {
      this.busyDialog = new sap.m.BusyDialog();
      this.busyDialog.open();
//      this.getView().setBusy(true);
      
//      this.initialViewConfig();
      //this.detailsUrl = "http://jkwgdev.jkti.com:8000/sap/opu/odata/sap/ZHRINSURANCE_SRV/";
      this.empId = "";
      this.maxYr = "";
      this.minYr = "";
      this.forceSave = false;//maintain the true value in this variable for saving the data and after successful save load the selected years data
      
      //this.oModel = new sap.ui.model.odata.ODataModel(this.detailsUrl);
      this.oModel=this.getModel();
      var insPvdrFlexBox = this.getView().byId("InsPvdrFlexBox");
      var oDpndntTable = this.getView().byId("idProductsTable");
      var claimStatusLink = this.getView().byId("checkStatusLinkId");
      if(!sap.ui.Device.system.phone){
        oDpndntTable.addStyleClass("tableTextCenter");
        insPvdrFlexBox.setDirection("Row");
        claimStatusLink.addStyleClass("claimStatBtn");
      }else{
        insPvdrFlexBox.setDirection("Column");
      }
      this.loadInsuranceData();         
    },

    loadCoveragePlanSet: function(Inspr){
      var cvrgPlan = this.byId("providerNameFieldId");
      if(cvrgPlan.getModel("CoveragePlanModel")){
        this.handleHdrDropDowns("INITIALCASE");
        return;
      }else{
        cvrgPlan.setBusy(true);
          var sUrl = "/CoveragePlanSet";
          var that = this;

          this.oModel.read(sUrl, {async: false,success: function(oData, response){
            var oPlanModel = new JSONModel();
            oPlanModel.setData();
            if(oData.results.length>0){
              oPlanModel.setData(that.removeDuplicates(oData.results,"Inspr"));
//              oPlanModel.oData.splice(0,0,that.dummyObject());
            }
            cvrgPlan.setModel(oPlanModel,"CoveragePlanModel");
            //Hold the data at the core level, which helps in further filteration
            var oAmountsModel = new sap.ui.model.json.JSONModel();
            sap.ui.getCore().setModel(oAmountsModel,"CoverageAmountData");
            oAmountsModel.setData(oData);
//            that.handleCoveragePlanChange();//Prepare the data for CvrgAmt Field Dropdown based on the key in CvrgPlan Field - added newly on 14 sep 2017
            /*Setting the data with based on pre-mapped data from policydetailset*/
            that.handleHdrDropDowns("INITIALCASE");
//            alert("New code was added");
            cvrgPlan.setBusy(false);
//            var cvrgAmount = that.byId("cvrgAmtFieldId");
//            cvrgAmount.setModel(oAmountsModel,"CoverageAmountSet");
          },error: function(oError){
            cvrgPlan.setBusy(false);
          }
          });  
      }     
      
    },

    removeDuplicates: function(plans,key){
      var obj = {};
      var res = [];
      for ( var i=0, len=plans.length; i < len; i++ ){
        obj[plans[i][key]] = plans[i];
      }

      for ( var key in obj ){
        res.push(obj[key]);
      }
      return res;
    },

//    removeDuplicates: function(plans,key){
//      var obj = {};
//      var res = [];
//      for ( var i=0, len=plans.length; i < len; i++ ){
//        obj[plans[i]['Instyp']] = plans[i];
//      }
//
//      for ( var Instyp in obj ){
//        res.push(obj[Instyp]);
//      }
//      return res;
//    },

    filterOptionsAndAmounts: function(plans,filterKey,duplicateRefKey,planType,removeDuplicates){
      var res = plans.filter(function(obj){
        if(obj[filterKey] === planType)
          return obj;
      });
      if(removeDuplicates){
        res = this.removeDuplicates(res,duplicateRefKey);
        return res;
      }else{
        return res;
      }

    },

    dummyObject: function(){
      return {
            "CovAmt"    : "",
            "Inspr"     : "",
            "InsprText"   : "",
            "InsttypeText"  : "",
            "Instyp"    : "",
            "Seqnr"     : ""
          };
    },
    
    /**
     * common code for handling the error style class for mandat fields like Provider name, Cvrg Option, Cvrg Amt
     * @params - prvdrChng, planChng, amntChng
     */
    handleStyleClassForMandatFields: function(srcRef,prvdrChng,planChng){
      var src = srcRef;
      var oView = this.getView();
      var prvdrField = oView.byId("providerNameFieldId");
      var planField  = oView.byId("cvrgOptionId");
      var amtField   = oView.byId("cvrgAmtFieldId");
      if(src.getSelectedKey()){
        if(src.hasStyleClass("myStateError"))
          src.removeStyleClass("myStateError");
      }else
        src.addStyleClass("myStateError");

      if(prvdrChng){
        /*if(prvdrField.getSelectedKey()){
            if(prvdrField.hasStyleClass("myStateError")){
              prvdrField.removeStyleClass("myStateError");
            }
          }else{
            prvdrField.addStyleClass("myStateError");
          }*/
        planField.addStyleClass("myStateError");
        amtField.addStyleClass("myStateError");
      }else if(planChng){
        amtField.addStyleClass("myStateError");
      }

    },

    handleProviderChange: function(oEvt){
      var cvrgOption = this.byId("cvrgOptionId");
      cvrgOption.setBusy(true);
      var cvrgAmount = this.byId("cvrgAmtFieldId");
      this.filteredCrgPlans = "";
      var srcRef = this.getView().byId("providerNameFieldId");
      var selKey = srcRef.getSelectedKey();
      if(selKey){
        var mainData = sap.ui.getCore().getModel("CoverageAmountData").getData().results;
        var filteredData = this.filterOptionsAndAmounts(mainData,"Inspr","Instyp",selKey,true);
        this.filteredCrgPlans = filteredData;
//        filteredData.splice(0,0,this.dummyObject());

        if(!cvrgOption.getModel("CoveragePlanModel")){
          var oModel = new JSONModel();
          oModel.setData(filteredData);
          cvrgOption.setModel(oModel,"CoveragePlanModel");
        }else{
          cvrgOption.getModel("CoveragePlanModel").setData(filteredData);
        }
        
        if(oEvt){
          cvrgOption.setEnabled(true);
        }
            
      }else{
        cvrgOption.setEnabled(false);
        cvrgAmount.setEnabled(false);
      }
      
      cvrgOption.setBusy(false);
      this.handleStyleClassForMandatFields(srcRef,true,false,false);
      if(oEvt){
        cvrgOption.setSelectedKey();
        cvrgAmount.setSelectedKey();
        if(!selKey){
          this.clearHdrAndDepndntPremiums();
        }         
      }
    },

    handleCoveragePlanChange: function(oEvt){
      var cvrgAmount = this.byId("cvrgAmtFieldId");
      cvrgAmount.setBusy(true);
      var srcRef = this.getView().byId("cvrgOptionId");
      var selKey = srcRef.getSelectedKey();
      if(selKey){
        var amountData = sap.ui.getCore().getModel("CoverageAmountData").getData().results;
        var filteredData = this.filterOptionsAndAmounts(amountData,"Instyp","",selKey,false);
//        filteredData.splice(0,0,this.dummyObject());

        if(!cvrgAmount.getModel("CvrgAmtModel")){
          var oAmountsModel = new sap.ui.model.json.JSONModel();
          oAmountsModel.setData(filteredData);
          cvrgAmount.setModel(oAmountsModel,"CvrgAmtModel");
        }else{
          cvrgAmount.getModel("CvrgAmtModel").setData(filteredData);
        }
        
        if(oEvt){
          cvrgAmount.setEnabled(true);
        }
        
      }else{
        cvrgAmount.setEnabled(false);  
      }
      
      if(oEvt){
        cvrgAmount.setSelectedKey();
        if(!selKey){
          this.clearHdrAndDepndntPremiums();
          this.handleStyleClassForMandatFields(srcRef,false,true,false);
        }else{
          this.handleStyleClassForMandatFields(srcRef,false,true,false);
          this.handleCvrgAmtChange(true);//pass true for performing calculations on header and individual premiums
        }
      }else{
        this.handleStyleClassForMandatFields(srcRef,false,true,false);
      }      
      cvrgAmount.setBusy(false);
    },
    
    getPostingObjForPremium: function(){
      this.postObj = {};
      var dependents = [];
      var oPage = this.getView().byId("benefitId");

      $.each(oPage.getModel().oData.PolicyDependentNav.results,function(i,entry){
        var obj = {};
        obj.Famsa   = entry.Famsa;
        obj.Gender  = entry.Gender;
        obj.Pernr   = entry.Pernr;
        obj.Seqnr   = entry.Seqnr;
        obj.Operation = "I";
        dependents.push(obj);
      });
      this.postObj = {
                "Pernr"       : this.empId,
                "Instyp"      : this.getView().byId("cvrgOptionId").getSelectedKey(),
                "Inspr"       : this.getView().byId("providerNameFieldId").getSelectedKey(),
                "Seqnr"       : this.selAmtSeqnr,
                "Save"        : false,
                "PolicyDependentNav": dependents,
                "CurrentYear" :	this.getView().byId("benefitId").getModel().oData.CurrentYear,
                "Status"    : this.getView().byId("benefitId").getModel().oData.Status
                };
    },
    
    
    handleCvrgAmtChange: function(oEvt){
      var srcRef = this.getView().byId("cvrgAmtFieldId");
      //*****//added newly on 14 sep 2017********//
      var selObj;
      if(srcRef.getSelectedItem()){
        selObj = srcRef.getSelectedItem().getBindingContext("CvrgAmtModel").getObject();
          if(srcRef.getSelectedKey()){
            this.selAmtSeqnr = selObj.Seqnr;
          }else{
            this.selAmtSeqnr = "";
          }
          this.handleStyleClassForMandatFields(srcRef);
          this.updateCategory(selObj);//sets the category  based on the cvrg amt //changed on 11-01-2018 
      }else if(srcRef.getSelectedKey()){
	  for(var i=0;i<srcRef.getItems().length;i++){
	      if(srcRef.getItems()[i].getProperty("key") == srcRef.getSelectedKey()){
		  selObj= srcRef.getItems()[i].getBindingContext("CvrgAmtModel").getObject();
	      }
	  }
        this.handleStyleClassForMandatFields(srcRef);
        this.updateCategory(selObj);//sets the category  based on the cvrg amt //changed on 11-01-2018
      }else{
        srcRef.addStyleClass("myStateError");
        return;
      }
      
     // this.updateCategory(selObj);//sets the category  based on the cvrg amt
      if(oEvt){
        this.busyDialog.open();
        this.clearHdrAndDepndntPremiums();
        this.calculateHdrAndDpndntPrem();
      }
    },
    
    updateCategory: function(selObj){
    	var num = selObj.Category;
    	var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1}, roman = '', i;
	    for ( i in lookup ) {
	      while ( num >= lookup[i] ) {
	        roman += i;
	        num -= lookup[i];
	      }
	    }
	    
    	this.getView().byId("categoryFieldId").setValue(roman);
    },
    
    calculateHdrAndDpndntPrem: function(){
      /*Post Data to backend to receive the updated premium of header and dependents*/
    this.getPostingObjForPremium();//prepare post object in this method
    var that = this;
    this.oModel.create("/PolicyDetailSet",this.postObj,null,function(data,response){
          var oPage = that.getView().byId("benefitId");
          var oPageData = oPage.getModel().oData;
          var cvrgAmt = that.getView().byId("cvrgAmtFieldId");
          if(response.statusCode === 201){
            if(!response.data.Message){
              if(response.data.PolicyDependentNav){
                for(var i=0; i<response.data.PolicyDependentNav.results.length; i++){
                  oPageData.PolicyDependentNav.results[i].ActPrem = response.data.PolicyDependentNav.results[i].ActPrem;
                  oPageData.PolicyDependentNav.results[i].StdPrem = response.data.PolicyDependentNav.results[i].StdPrem;
                  } 
              }
              oPageData.PremiumAmount = response.data.PremiumAmount;//update the hdr premium amount 
              oPageData.TotalPremium = response.data.TotalPremium;//added on 04102017
              oPage.getModel().updateBindings();
//              that.getView().setBusy(false);
              that.busyDialog.close();
            }else{
              cvrgAmt.setSelectedKey("");
              MessageToast.show(response.data.Message);
//              that.getView().setBusy(false);
              that.busyDialog.close();
            }
          }else{
            cvrgAmt.setSelectedKey("");
            MessageToast.show(response.data.Message);
//            that.getView().setBusy(false);
            that.busyDialog.close();
          }
          that.postObj = "";
        },function(oError){
            var cvrgAmt = that.getView().byId("cvrgAmtFieldId");
            cvrgAmt.setSelectedKey("");
            if(oError.hasOwnProperty("response")){
              MessageToast.show(JSON.parse(oError.response.body).error.message.value);
            }else{
              MessageToast.show(oError.message);
            }
            that.postObj = "";
//            that.getView().setBusy(false);
            that.busyDialog.close();
        });
    },
    
    
    /*
     * 
     */
    handleYearSelection: function(oEvt){
      var addDepndntBtn = this.getView().byId("ID_BTN_TBL_ADD");
      if(addDepndntBtn.getVisible()){//check whether it is in editable condition or not
        this.forceSave = "YEAR CHANGED";//maintain the true value in this variable for saving the data and after successful save load the selected years data
        this.confirmSaveAction();
      }else{
        this.forceSave = false;
        var oSelYear = this.getView().byId("selectYear").getSelectedKey();
          if(oSelYear){
            this.loadInsuranceData(oSelYear);
          }
      }



    },
    
    loadInsuranceData: function(oSelYear){
//      this.getView().setBusy(true);
      this.busyDialog.open();
      var that = this;
//      var oPath = "/PolicyDetailSet?$expand=PolicyDependentNav";
      var oPath = "";
      if(oSelYear){
        oPath = "/PolicyDetailSet"+ "?$filter=CurrentYear eq '"+ oSelYear + "'" +"&$expand=PolicyDependentNav";
      }else{
        this.maxYr = ""; 
        this.minYr = "";        
        oPath = "/PolicyDetailSet?$expand=PolicyDependentNav";
      }
      
      this.oModel.read(oPath, {async: false,success: function(oData, response){
//      oData.results[0].Editable = true;  
//      oData.results[0].Editable = false;
        var dataE = oData.results[0];
        that.patientData = dataE;
        var oRemarkBox = that.getView().byId("remarkBox");
        if(dataE.Status === "M"){//**If the period is Mid Year then Prepare a model and hold the data initial data in it, which later helps you for comparisons during add and delete operations
        	oRemarkBox.setVisible(true);
        	var oMidYearModel = new sap.ui.model.json.JSONModel();
          sap.ui.getCore().setModel(oMidYearModel,"midYearModel");
          oMidYearModel.oData = [];
          for(var i=0; i<dataE.PolicyDependentNav.results.length; i++){
            oMidYearModel.oData.push(dataE.PolicyDependentNav.results[i]);
          }
        }else{
        	oRemarkBox.setVisible(false);
        }
        that.initialViewConfig(dataE.Status);
        that.setInsuranceModel(dataE);
        that.empId = dataE.Pernr;
        
        if(!that.maxYr && !that.minYr){
          if(dataE.hasOwnProperty("CurrentYear") && dataE.hasOwnProperty("ThresholdYear")){
            that.maxYr = dataE.CurrentYear * 1;
            that.minYr = dataE.ThresholdYear * 1;
//              maxYr = 2017;
//              minYr = 2000;
              var years = [];
              for(var i=0; i< ((that.maxYr-that.minYr)+1); i++){
                var obj={};
                obj.year = (that.maxYr-i).toString();
                years.push(obj);
              }
              var oModel = new sap.ui.model.json.JSONModel();
              oModel.setData(years);
              that.getView().byId("selectYear").setModel(oModel);
              that.getView().byId("selectYear").setVisible(true);
              if(sap.ui.Device.system.phone){
                that.getView().byId("selectYear").addStyleClass("yearSelect");
              }
            }else{
              that.getView().byId("selectYear").setVisible(false);
            }
        }else{
          that.getView().byId("selectYear").setVisible(true);
          if(sap.ui.Device.system.phone){
            that.getView().byId("selectYear").addStyleClass("yearSelect");
          }
        }
        
        
        that.loadCoveragePlanSet();
//        that.getView().setBusy(false);
        that.busyDialog.close();

      },error: function(oError){
//        that.getView().setBusy(false);
        that.busyDialog.close();
      }
      });
    },
    setInsuranceModel: function (dataE) {
      var oJsonModel = new sap.ui.model.json.JSONModel();
      oJsonModel.setData(dataE);
      var oPage = this.getView().byId("benefitId");
      oPage.setModel(oJsonModel);
      oPage.getModel().updateBindings();
      var oDpndntTable = this.getView().byId("idProductsTable");
      var items = oDpndntTable.getItems();
      if(items.length>0){
        for(var i=0;i<items.length;i++){
              var cells = items[i].getCells();
              if(sap.ui.Device.system.phone){
                cells[3].setTextAlign("Initial");
              }else{
                cells[3].setTextAlign("Center");  
              }
            }
      }
    },
    onPress: function () {
      if (!this.confirmDialog){
        this.confirmDialog = sap.ui.xmlfragment("com.jkt.ui.mybenefit.demo.app.view.Dialog", this);
        this.getView().addDependent(this.confirmDialog);
      };
      this.confirmDialog.open();
    },
    onPressConfirm: function (){
      if (!this.confirmMailDialog){
        this.confirmMailDialog = sap.ui.xmlfragment("com.jkt.ui.mybenefit.demo.app.view.PatientDetialsDialog", this);
        this.getView().addDependent(this.confirmMailDialog);
      };
      this.resetPatientDialog();
      this.loadPatientModel(this.confirmMailDialog);
      this.confirmDialog.close();
      this.confirmMailDialog.open();
    },
    
    resetPatientDialog: function(){
    	sap.ui.getCore().byId("selectPatientId").setSelectedKey("");
        sap.ui.getCore().byId("datePickerId").setValue("");
        sap.ui.getCore().byId("timePickerId").setValue("");
        sap.ui.getCore().byId("hospitalNameId").setValue("");
        sap.ui.getCore().byId("illnessId").setValue("");
    },
    
    onPressSubmit: function () {
      var oPathSOS = "/SoSSet";
      var that = this;
      var patientName = sap.ui.getCore().byId("selectPatientId").getSelectedKey();
      var date = sap.ui.getCore().byId("datePickerId").getValue();
      var time = sap.ui.getCore().byId("timePickerId").getValue();
      var dateTime = date+"T"+time;
      var hospital = sap.ui.getCore().byId("hospitalNameId").getValue();
      var illness = sap.ui.getCore().byId("illnessId").getValue();

      if(patientName == null || patientName == ""){
        MessageToast.show("Please select patient name");
        return;
      };
      if(date == null || date == ""){
        MessageToast.show("Please select valid date");
        return;
      };
      if(time == null || time == ""){
        MessageToast.show("Please select valid time");
        return;
      };
      if(hospital == null || hospital == ""){
        MessageToast.show("Please enter hospital name and location");
        return;
      };
      if(illness == null || illness == ""){
        MessageToast.show("Please enter description of illness");
        return;
      };
      var jsonObject = {
          "Pernr": this.empId,
          "Mailsend": true,
          "PatientName": patientName,
          "DateTime": dateTime,
          "Hospital": hospital,
          "DescrIllness": illness
      };
      this.oModel.create(oPathSOS, jsonObject,{
        async: false,
        success: function(oData, response){
          if(oData.Message != ""){
            MessageToast.show("Error while sending email");
          }else{
            MessageToast.show("Email has been sent successfully");
            that.confirmMailDialog.close();
          };
        },
        error: function(oError){
          MessageToast.show("Error while sending email");
          console.log("error in mail send");
        }
      });
    },
    dialogClose: function () {
      this.confirmDialog.close();
    },
    dialogMailClose: function () {
      this.confirmMailDialog.close();
    },
    loadPatientModel: function(dialogId){
      var oJsonModel = new sap.ui.model.json.JSONModel();
//      dialogId.setModel(oJsonModel);
//      oJsonModel.setData(this.patientData);
      var patients = [];
      var pat1 = {
			     	Name : "Self"
			     };
      patients.push(pat1);
      if(this.patientData.PolicyDependentNav.results.length>0){
          var dependents = this.patientData.PolicyDependentNav.results;
    	  for(var i=0; i<dependents.length; i++){
    	      var obj = {
				    Name : dependents[i].Name
				 };
			  patients.push(obj);
    	  }
      }
      var oPatientField = sap.ui.getCore().byId("selectPatientId");
      oPatientField.setModel(oJsonModel);
      oJsonModel.setData(patients);
    },

    //handle edit policy details
    handleEditPolicyDetails:function(e){
      debugger
      var oPage = this.getView().byId("benefitId");
      var editable = oPage.getModel().oData.Status;      
      var screen= this.getView();
      var oTable = screen.byId("idProductsTable");
      
      oTable.getColumns()[6].setVisible(true);
      
      var items = oTable.getItems();
      if(editable){//handles both "R" & "M" cases
        this.controlFieldsCases(editable);
        oTable.setMode("Delete");
      }else{
        this.controlFieldsCases(editable);
        oTable.setMode("None");
      }
      this.controlFooterButtons(true);
    },

//    controlFieldsCases : function(state){
//      var oPage = this.getView().byId("benefitId");
//      var editable = oPage.getModel().oData.Editable;
//      var screen= this.getView();
//      var oTable = screen.byId("idProductsTable");
//      var items = oTable.getItems();
//      
//      var prvdr = screen.byId("providerNameFieldId");
//      var cvrgPlan = screen.byId("cvrgOptionId");
//      var cvrgAmt = screen.byId("cvrgAmtFieldId");
//      
//      if(state){//works only during editable true case
//        if(!prvdr.getSelectedKey()){
//            prvdr.setEnabled(state);  
//          }else{
//            prvdr.setEnabled(true);  
//            if(cvrgPlan.getSelectedKey()){
//              cvrgPlan.setEnabled(state);
//            }
//            
//            if(cvrgAmt.getSelectedKey()){
//              cvrgAmt.setEnabled(state);
//            }
//          }  
//      }     
//        screen.byId("policyNumFieldId").setEditable(!state);
//        screen.byId("phsCardNoFieldId").setEditable(!state);
//        screen.byId("ID_BTN_TBL_ADD").setVisible(state);
//        if(items.length>0){
//          for(var i=0;i<items.length;i++){
//            var cells = items[i].getCells();
//            if(cells.length>0){
//              cells[3].setEditable(!state);
//            }
//          }
//        }
//
////      }
//    },
    
    controlFieldsCases: function(Status){
      var oPage = this.getView().byId("benefitId");
      var oPageData = oPage.getModel().oData;
        var editable = oPageData.Status;
        var screen= this.getView();
        var oTable = screen.byId("idProductsTable");
        var items = oTable.getItems();
      
        var prvdr = screen.byId("providerNameFieldId");
        var cvrgPlan = screen.byId("cvrgOptionId");
        var cvrgAmt = screen.byId("cvrgAmtFieldId");
        var state = "";
        if(Status === "R" || Status === "M"){//works only during editable true case
          if(Status === "R"){
            state = true;
            screen.byId("premiumToRecoverOld").setVisible(false);
              screen.byId("balPremAmtLabel").setVisible(false);
              screen.byId("balPremAmtField").setVisible(false);
              screen.byId("totalPremiumOld").setVisible(false);
          }else{//here comes Mid Year case "M"
            state = false;
            var balPrem = com.jkt.ui.mybenefit.demo.app.util.Formatter.roundNumber((oPageData.PremiumAmount*1) - (oPageData.PremiumAmtOld*1));
            var oldPrem = com.jkt.ui.mybenefit.demo.app.util.Formatter.roundNumber(oPageData.TotalPremiumOld);
            screen.byId("premiumAmtId").setValue(com.jkt.ui.mybenefit.demo.app.util.Formatter.revisedPremium(oPageData.PremiumAmount, oPageData.Status));
            screen.byId("premiumToRecoverOld").setVisible(true).setText("Old: " + oldPrem);
              this.controlBalancePremium(oPageData.PremiumAmtOld);
              screen.byId("totalPremiumId").setValue(com.jkt.ui.mybenefit.demo.app.util.Formatter.revisedPremium(oPageData.TotalPremium, oPageData.Status));
              var oldTotPrem = com.jkt.ui.mybenefit.demo.app.util.Formatter.roundNumber(oPageData.TotalPremiumOld);
              screen.byId("totalPremiumOld").setVisible(true).setText("Old: " + oldTotPrem); 
              
              if(items.length>0){//turns the third cell of every item into editable mode
                  for(var i=0;i<items.length;i++){
                    var cells = items[i].getCells();
                    items[i].addStyleClass("tableItem");
                    if(cells.length>0){
                      cells[3].setEditable(!state);
                    }
                  }
           }
          }
          if(!prvdr.getSelectedKey()){
            prvdr.setEnabled(state);  
          }else{
            prvdr.setEnabled(state);  
                if(cvrgPlan.getSelectedKey()){
                  cvrgPlan.setEnabled(state);
                }
              
                if(cvrgAmt.getSelectedKey()){
                  cvrgAmt.setEnabled(state);
                }
          }

          
          screen.byId("policyNumFieldId").setEditable(!state);
          screen.byId("phsCardNoFieldId").setEditable(!state);
          screen.byId("ID_BTN_TBL_ADD").setVisible(true);
          
        }else if(Status === "C"){
          prvdr.setEnabled(false);
          cvrgPlan.setEnabled(false);
          cvrgAmt.setEnabled(false);
          screen.byId("policyNumFieldId").setEditable(false);
          screen.byId("phsCardNoFieldId").setEditable(false);
          screen.byId("ID_BTN_TBL_ADD").setVisible(false);
          
          screen.byId("premiumToRecoverOld").setVisible(false);
          screen.byId("balPremAmtLabel").setVisible(false);
          screen.byId("balPremAmtField").setVisible(false);
          screen.byId("totalPremiumOld").setVisible(false);
        }else{
          prvdr.setEnabled(false);
          cvrgPlan.setEnabled(false);
          cvrgAmt.setEnabled(false);
          screen.byId("policyNumFieldId").setEditable(false);
          screen.byId("phsCardNoFieldId").setEditable(false);
          screen.byId("ID_BTN_TBL_ADD").setVisible(false);
        }
    },

    //handle cancel policy details
    handleCancelPolicyDetails:function(e){
//      var model=this.getView().getModel("oViewModel");
//      model.setProperty("/editPolicyDtl",false);
//      model.setProperty("/dispPolicyDtl",true);
      var screen= this.getView();
      var oTable = screen.byId("idProductsTable");
      oTable.setMode("None");
      var items = oTable.getItems();
      if(items.length>0){
        for(var i=0;i<items.length;i++){
          var cells = items[i].getCells();
          if(cells.length>0){
            cells[3].setEditable(false);
          }
        }
      }
      screen.byId("providerNameFieldId").setEnabled(false);//added newly on 14 sep 2017
      screen.byId("cvrgOptionId").setEnabled(false);
      screen.byId("cvrgAmtFieldId").setEnabled(false);
      screen.byId("policyNumFieldId").setEditable(false);
      screen.byId("phsCardNoFieldId").setEditable(false);
      screen.byId("ID_BTN_TBL_ADD").setVisible(false);
      
      this.controlFooterButtons(false);
      if(e){
        var selYr = this.getView().byId("selectYear").getSelectedKey();
        this.refreshPageData(selYr);
      }
      
      oTable.getColumns()[6].setVisible(false)
    },

    controlFooterButtons : function(state){
      var screen= this.getView();
      screen.byId("editBtnId").setVisible(!state);
      screen.byId("saveBtnId").setVisible(state);
      screen.byId("cancelBtnId").setVisible(state);
    },
    
    confirmSaveAction: function(oEvt){
      var validRes = "";      
        if(this.getView().byId("benefitId").getModel().oData.Status === "M"){//By pass the validation 
          validRes = true;
        }else{
          validRes = this.validateMandatFields();//check for the mandatory fields like provider name, coverage option and coverage amount
        }
      if(validRes){
        var that = this;
        MessageBox.show("Are you sure, Do you want to save the changes made?", {
              icon: sap.m.MessageBox.Icon.CONFIRMATION,
              title: "Confirmation",
              actions: [sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],
              defaultAction: sap.m.MessageBox.Action.NO,
              styleClass: "sapUiSizeCompact",
              onClose:function(oAction){
                if(oAction=="YES"){
                  that.handleSavePolicyDetails();
                }else{
                  that.getView().byId("selectYear").setSelectedKey(that.getView().byId("benefitId").getModel().oData.CurrentYear);
                }
              }
          });
      }else{
        this.getView().byId("selectYear").setSelectedKey(this.getView().byId("benefitId").getModel().oData.CurrentYear);
        MessageToast.show("Please fill the data before saving it");
        return;
      }
    },
    
    handleSavePolicyDetails: function(){
//      this.getView().setBusy(true);
      this.busyDialog.open();
      var PolicyDependentNav = [];
      PolicyDependentNav = this.prepareAddOrSavePostingObject("SAVE");
      this.handleAddAndDeletePolicyDetails(true,PolicyDependentNav,"SAVE");
    },

    //handle cancel policy details
    handleAddAndDeletePolicyDetails:function(save,dependents,action){
      var oPage = this.getView().byId("benefitId");
      var policyDetails = oPage.getModel().oData;
      var editable = policyDetails.Status;
      var that = this;
//      if(editable){
        var oPage = this.getView().byId("benefitId");
        this.postObj = "";

        this.postObj = {
                "Pernr"       : this.empId,
                "Instyp"      : this.getView().byId("cvrgOptionId").getSelectedKey(),
                "Inspr"       : this.getView().byId("providerNameFieldId").getSelectedKey(),
                "Seqnr"       : this.selAmtSeqnr,
                "Save"        : save,
                "PolicyDependentNav": dependents,
                "CurrentYear" :	this.getView().byId("benefitId").getModel().oData.CurrentYear,
                "Status"    : this.getView().byId("benefitId").getModel().oData.Status,
//                "TotalPremium": this.getView().byId("totalPremiumId").getName()
                };
        if(editable === "M"){
          /*Add these attributes only in editable==false case only */
          this.postObj.PolicyNumber   = this.getView().byId("policyNumFieldId").getValue();
          this.postObj.EmpPhs     = this.getView().byId("phsCardNoFieldId").getValue();
          this.postObj.TotalPremium   = this.getView().byId("totalPremiumId").getName();
        }
        if(action === "SAVE"){
          this.postObj.PremiumAmount = this.getView().byId("premiumAmtId").getName();
          this.postObj.Status = policyDetails.Status;
          this.postObj.TotalPremium   = this.getView().byId("totalPremiumId").getName();
      }
        var sUrl = "/PolicyDetailSet";
        this.action = "";//declaration of global var for handling all three operations
        if(action === "ADD"){//here comes for add operation
          this.action = action;
          this.postDependants(sUrl);
        }else if(action === "DELETE"){//here comes for delete operation
          this.action = action;
          this.postDependants(sUrl);
        }else{//here comes for save operation
          this.action = "SAVE";
          this.saveEmpData(sUrl);
        }
//      }
    },


    postDependants: function(sUrl){
      var that = this;
      this.oModel.create(sUrl,this.postObj,null,function(data,response){
        var oPage = that.getView().byId("benefitId");
        var oPageData = oPage.getModel().oData;
        if(response.statusCode === 201){
          if(!response.data.Message){

            if(that.action === "ADD"){
              for(var i=0; i<response.data.PolicyDependentNav.results.length; i++){
                    if(response.data.PolicyDependentNav.results[i].Operation === "I"){
                      oPageData.PolicyDependentNav.results.push(response.data.PolicyDependentNav.results[i]);   
                    }                
                }

//              that.byId("ID_DEPENDENT_LIST").setBusy(false);
              that.busyDialog.close();
              that.oDependentDialog.close();
              MessageToast.show("Dependent has been added successfully");
            }else{//Works for "DELETE" action
              for(var j=0; j<that.postObj.PolicyDependentNav.length; j++){
                    if(that.postObj.PolicyDependentNav[j].Operation === "D"){
                        oPageData.PolicyDependentNav.results.splice(j,1);
                    }
                }
              MessageToast.show("Dependent has been deleted successfully");
//              that.getView().setBusy(false);
              that.busyDialog.close();
            }
            oPageData.PremiumAmount = response.data.PremiumAmount;//update the hdr premium to be recovered 
            oPageData.TotalPremium  = response.data.TotalPremium;//added on 04102017 - update the hdr total premium field
            oPageData.PremiumAmtOld = response.data.PremiumAmtOld;
            oPageData.TotalPremiumOld = response.data.TotalPremiumOld;
            that.getView().byId("balPremAmtField").setValue(com.jkt.ui.mybenefit.demo.app.util.Formatter.roundNumber(oPageData.PremiumAmount*1 - oPageData.PremiumAmtOld*1));
            that.controlBalancePremium(response.data.PremiumAmtOld);
            oPage.getModel().updateBindings();
            
            if((that.action === "ADD") || (that.action === "DELETE") ){
              if(that.getView().byId("benefitId").getModel().oData.Status === "M"){
                var oMidYrModel = sap.ui.getCore().getModel("midYearModel");
                var initialDpndnts = oMidYrModel.oData;
                
                  var oTable = that.getView().byId("idProductsTable");
                    var items = oTable.getItems();
                    for(var i=0; i<items.length; i++){ 
                      var cells = items[i].getCells();
                      var obj = items[i].getBindingContext().getObject();
                      if(i<initialDpndnts.length){
                        items[i].addStyleClass("tableItem");
                      }else{
                        items[i].removeStyleClass("tableItem");
                      }
                      cells[3].setEditable(true);
                    }
                    
                   that.setPremiumValues();//sets values with new strings
                }
            }
            

          }else{
            that.handleBusyStates();
            MessageToast.show(response.data.Message);
          }

        }else{
          that.handleBusyStates();
          MessageToast.show(response.data.Message);
        }
        that.postObj = "";
      },function(oError){
        if(oError.hasOwnProperty("response")){
        MessageToast.show(JSON.parse(oError.response.body).error.message.value);
        }else{
        MessageToast.show(oError.message);
        }
        that.postObj = "";
        if(that.action === "ADD"){
//          that.byId("ID_DEPENDENT_LIST").setBusy(false);
          that.busyDialog.close();
          that.oDependentDialog.close();
        }else{
//          that.getView().setBusy(false);
          that.busyDialog.close();
        }
      });
    },
    
    
    setPremiumValues: function(){
      var oPage = this.getView().byId("benefitId");
        var oPageData = oPage.getModel().oData;
      this.getView().byId("premiumAmtId").setValue(com.jkt.ui.mybenefit.demo.app.util.Formatter.revisedPremium(oPageData.PremiumAmount, oPageData.Status));
        this.getView().byId("totalPremiumId").setValue(com.jkt.ui.mybenefit.demo.app.util.Formatter.revisedPremium(oPageData.TotalPremium, oPageData.Status));
        this.getView().byId("premiumToRecoverOld").setText("Old: " + com.jkt.ui.mybenefit.demo.app.util.Formatter.roundNumber(oPageData.PremiumAmtOld));
        this.getView().byId("totalPremiumOld").setText("Old: " + com.jkt.ui.mybenefit.demo.app.util.Formatter.roundNumber(oPageData.TotalPremiumOld));
    },
    
    /*
     * if old premium value is other than zero, then the balance premium will have non zero value and bal premium field will be displayed
     * else bal premium field will be hidden
     */
    controlBalancePremium: function(oldPrem){
      var balPremLabel = this.getView().byId("balPremAmtLabel");
      var balPremField = this.getView().byId("balPremAmtField");
      if(oldPrem*1){
        balPremLabel.setVisible(true);
        balPremField.setVisible(true);
      }else{
        balPremLabel.setVisible(false);
        balPremField.setVisible(false);
      }
    },
    
    
    /*
     * handles busy states during error case and if response.data.Message has any value only
     */
    handleBusyStates: function(){
      var that = this;
      if(that.action === "ADD"){
//        that.byId("ID_DEPENDENT_LIST").setBusy(false);
        that.busyDialog.close();
        }else{
//        that.getView().setBusy(false);
      that.busyDialog.close();
        }
    },
    
    saveEmpData: function(sUrl){
      var that = this;
      this.oModel.create(sUrl,this.postObj,null,function(data,response){
        var oPage = that.getView().byId("benefitId");
        var oPageData = oPage.getModel().oData;

        if(response.statusCode === 201){

          if(!response.data.Message){
//            that.handleCancelPolicyDetails();//set the buttons to the initial state
            if(that.forceSave === "YEAR CHANGED"){
              var presYrInModel =  that.getView().byId("benefitId").getModel().oData.CurrentYear;
              var oSelYear = that.getView().byId("selectYear").getSelectedKey();
              if(!(oSelYear === presYrInModel)){// it means user tries to change the year
                that.handleCancelPolicyDetails(false);
                that.loadInsuranceData(oSelYear);
              }
              that.forceSave = false;
            }else if(that.forceSave === "TPA PORTAL BTN PRESSED"){//it means user tries to click on the TPA portal
//            var oLink = new sap.m.Link({visible:false,href:tpaUrl});
//            oLink.firePress();
              var tpaUrl = that.getView().byId("benefitId").getModel().oData.TpaUrl;
                  window.open(tpaUrl, '_blank');
            that.forceSave = false;
            var oSelYear = that.getView().byId("selectYear").getSelectedKey();
            that.handleCancelPolicyDetails(false);
            that.loadInsuranceData(oSelYear);
            
          }else{
              that.handleCancelPolicyDetails(true);//set the buttons to the initial state & load the page data again
            }           
            MessageToast.show("Your data has been saved successfully");
          }else{
            MessageToast.show(response.data.Message);
          }
        }else{
          MessageToast.show(response.data.Message);
        }

        that.postObj = "";
//        that.getView().setBusy(false);
        that.busyDialog.close();
      },function(oError){
        if(oError.hasOwnProperty("response")){
          MessageToast.show(JSON.parse(oError.response.body).error.message.value);
        }else{
          MessageToast.show(oError.message);
        }
        that.postObj = "";
        that.getView().byId("selectYear").setSelectedKey(that.getView().byId("benefitId").getModel().oData.CurrentYear);
//        that.getView().setBusy(false);
        that.busyDialog.close();
      });
    },

    //handle add dependent details
    handleAddDependentDetails:function(oEvt){
      var validRes = "";      
      if(this.getView().byId("benefitId").getModel().oData.Status === "M"){//By pass the validation 
        validRes = true;
      }else{
        validRes = this.validateMandatFields();//check for the mandatory fields like provider name, coverage option and coverage amount
      }
      if(!validRes){
        return;
      }else{
        if (!this.oDependentDialog){
          this.oDependentDialog = sap.ui.xmlfragment(this.getView().getId(),"com.jkt.ui.mybenefit.demo.app.view.DependentDetails", this);
            this.getView().addDependent(this.oDependentDialog);
        };
        this.oDependentDialog.open();
//        this.byId("ID_DEPENDENT_LIST").setBusy(true);
        this.busyDialog.open();
        var planStatus = this.getView().byId("benefitId").getModel().oData.Status;
//        this.oDependentDialog.setBusy(true);
        var sUrl = "/DependentDetailSet"+ "?$filter=Pernr eq '"+this.empId+"'" + " and PlanStatus eq '"+planStatus+"'" ;
//        var filter = "Pernr eq '"+this.empId+"'";
//        sUrl += "?$filter=" + filter;
        var that = this;

        this.oModel.read(sUrl, {async: false,success: function(oData, response){
          var filteredData = that.filterDependents(oData.results);
          var oModel=new JSONModel(filteredData);
//          var oModel=new JSONModel(oData.results);          
            that.getView().setModel(oModel,"oDpdtModel");
//            that.byId("ID_DEPENDENT_LIST").setBusy(false);
            that.busyDialog.close();
//            that.oDependentDialog.setBusy(false);
            },error: function(oError){
//              that.byId("ID_DEPENDENT_LIST").setBusy(false);
              that.BusyDialog.close();
//              that.oDependentDialog.setBusy(false);
            }
        });
      }
    },
    
    /*
     * It filters the latest Dependent data by comparing them with bounded objects of the UI dependent table 
     */
    filterDependents: function(onlineData){
      var oPage = this.getView().byId("benefitId");
      var onlineData = onlineData;
      var filteredData = [];
      var dependents = oPage.getModel().oData.PolicyDependentNav.results;
      if(dependents.length>0){
        for(var i=0; i<onlineData.length; i++){
          var entry = onlineData[i];
          var existence = dependents.reduce(function(n,lineItem){
            return n + ( (lineItem.Famsa === entry.Famsa) && (lineItem.Seqnr === entry.Seqnr) ); 
          },0);

          if(existence === 0){
            filteredData.push(onlineData[i]);
          }
        }
        return filteredData;
      }else{
        return onlineData;
      }


    },
    
//    handle delete dependent details
    onDeleteDependentDetails:function(oEvent){
      var oSrc=oEvent.getSource();
      //var sContext=oEvent.getParameter("listItem").getBindingContext();
      var sContext=oEvent.getSource().getBindingContext();
      this.deleteDependent="";
      this.deleteDependent = sContext.getObject();
      delete this.deleteDependent.__metadata;
//      if(this.deleteDependent.hasOwnProperty("newDep")){
//        delete this.deleteDependent.newDep;
//      }
      var that = this;
      MessageBox.show("Are you sure, Do you want to delete?", {
        icon: sap.m.MessageBox.Icon.CONFIRMATION,
        title: "Confirmation",
        actions: [sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],
        defaultAction: sap.m.MessageBox.Action.NO,
        //details: JSON,
        styleClass: "sapUiSizeCompact",
        //contentWidth: "100px",
        onClose:function(oAction){
          if(oAction=="YES"){
//            that.getView().setBusy(true);
          that.busyDialog.open();
            that.removeDependent(that.deleteDependent);
          }
        }
      });
    },

    removeDependent: function(deleteObj){
      deleteObj.Operation = "D";
      var delObj = [deleteObj];
//      delete deleteObj.DateOfBirth;
//      delete deleteObj.Gender;
//      delete deleteObj.Name;
      var PolicyDependentNav = [];
      PolicyDependentNav = this.prepareDeletePostingObject("DELETE")
      this.handleAddAndDeletePolicyDetails(false,PolicyDependentNav,"DELETE");
    },
    
    /*
     * prepares the deleting object by sending all the entries to update the premium amount in the header part
     */
    prepareDeletePostingObject:function(){
      var PolicyDependentNav = [];
      var oPage = this.getView().byId("benefitId");
      var dependents = oPage.getModel().oData.PolicyDependentNav.results;
      var delObj = this.deleteDependent;
      if(dependents.length>0){
        $.each(dependents,function(i,item){
          if( (item.Famsa===delObj.Famsa) && (item.Seqnr===delObj.Seqnr)){
            item.Operation = "D";
          }else{
            item.Operation = "";
          }
          PolicyDependentNav.push(item);
        });
      }
      return PolicyDependentNav;
    },
    
    //handle add button press of dependent dialog
    onAddDependentPress:function(e){
//      this.byId("ID_DEPENDENT_LIST").setBusy(true);
      this.busyDialog.open();
      var PolicyDependentNav = [];
      PolicyDependentNav = this.prepareAddOrSavePostingObject("ADD");
      this.handleAddAndDeletePolicyDetails(false,PolicyDependentNav,"ADD");
    },
    
//    validateMandatFields: function(){
//      var oView = this.getView();
//      var oPage = this.getView().byId("benefitId");
//      if(oPage.getModel().oData.Editable){//mandatory checks in Editable true case
//        var prvdrName   = oView.byId("providerNameFieldId");
//          var cvrgOptn  = oView.byId("cvrgOptionId");
//          var cvrgAmt   = oView.byId("cvrgAmtFieldId");
//          var msg = "";
//
//          if( prvdrName.getSelectedKey() && cvrgOptn.getSelectedKey() && cvrgAmt.getSelectedKey() ){
//            return true;
//          }else{
//            if( !prvdrName.getSelectedKey() ){
//              msg= "Please fill Provider Name, Coverage Option & Coverage Amount";
//              prvdrName.addStyleClass("myStateError");
//              cvrgOptn.addStyleClass("myStateError");
//              cvrgAmt.addStyleClass("myStateError");
//            }else if( prvdrName.getSelectedKey() && (!cvrgOptn.getSelectedKey()) ){
//              msg= "Please fill Coverage Option & Coverage Amount";
//              cvrgOptn.addStyleClass("myStateError");
//              cvrgAmt.addStyleClass("myStateError");
//            }else if( (prvdrName.getSelectedKey() && cvrgOptn.getSelectedKey()) && (!cvrgAmt.getSelectedKey()) ){
//              msg= "Please fill Coverage Amount";
//              cvrgAmt.addStyleClass("myStateError");
//            }
//
//            MessageToast.show(msg);
//            return false;
//          }
//      }else{//mandatory checks in Editable false case
//
//        /**********Header checks*********/
//        var policyNum = oView.byId("policyNumFieldId");
//        var phsCardNum = oView.byId("phsCardNoFieldId");
//        var hdrValidnRes = "";
//
//        if(policyNum.getValue() || phsCardNum.getValue()){
//          hdrValidnRes = true;
//        }else{
//          hdrValidnRes = false;
//        }
//        /**********Header checks*********/
//        if(hdrValidnRes){
//          return true;
//        }else{
//          /**********Dependent checks*********/
//          var oTable = this.getView().byId("idProductsTable");
//              var items = oTable.getItems();
//              var dpndntValidnRes = false;
//              if(items.length>0){
//                for(var i=0; i<items.length; i++){
//                  var cells = items[i].getCells();
//                    if(cells[3].getValue()){
//                      dpndntValidnRes = true;
//                      break;
//                    }
//                  }
//              }
//           
//            /**********Dependent checks*********/
//              
//              /**********Now check for both hdr and dependent field validations and return validation result*********/
//              if(hdrValidnRes || dpndntValidnRes){
//                return true;
//              }else{
//                return false;
//              }
//        }
//      }//main else ends here
//    },
    validateMandatFields: function(){
      var oView = this.getView();
      var oPage = this.getView().byId("benefitId");
      if(oPage.getModel().oData.Status === "R"){//mandatory checks in Status="R" condition
        var prvdrName   = oView.byId("providerNameFieldId");
          var cvrgOptn  = oView.byId("cvrgOptionId");
          var cvrgAmt   = oView.byId("cvrgAmtFieldId");
          var msg = "";

          if( prvdrName.getSelectedKey() && cvrgOptn.getSelectedKey() && cvrgAmt.getSelectedKey() ){
            return true;
          }else{
            if( !prvdrName.getSelectedKey() ){
              msg= "Please fill Provider Name, Coverage Option & Coverage Amount";
              prvdrName.addStyleClass("myStateError");
              cvrgOptn.addStyleClass("myStateError");
              cvrgAmt.addStyleClass("myStateError");
            }else if( prvdrName.getSelectedKey() && (!cvrgOptn.getSelectedKey()) ){
              msg= "Please fill Coverage Option & Coverage Amount";
              cvrgOptn.addStyleClass("myStateError");
              cvrgAmt.addStyleClass("myStateError");
            }else if( (prvdrName.getSelectedKey() && cvrgOptn.getSelectedKey()) && (!cvrgAmt.getSelectedKey()) ){
              msg= "Please fill Coverage Amount";
              cvrgAmt.addStyleClass("myStateError");
            }

            MessageToast.show(msg);
            return false;
          }
      }else if(oPage.getModel().oData.Status === "M"){//mandatory checks in Status="M" condition)

        /**********Header checks*********/
        var policyNum = oView.byId("policyNumFieldId");
        var phsCardNum = oView.byId("phsCardNoFieldId");
        var hdrValidnRes = "";

        if(policyNum.getValue() || phsCardNum.getValue()){
          hdrValidnRes = true;
        }else{
          hdrValidnRes = false;
        }
        /**********Header checks*********/
        if(hdrValidnRes){
          return true;
        }else{
          /**********Dependent checks*********/
          var oTable = this.getView().byId("idProductsTable");
              var items = oTable.getItems();
              var dpndntValidnRes = false;
              if(items.length>0){
                for(var i=0; i<items.length; i++){
                  var cells = items[i].getCells();
                    if(cells[3].getValue()){
                      dpndntValidnRes = true;
                      break;
                    }
                  }
              }
           
            /**********Dependent checks*********/
              
              /**********Now check for both hdr and dependent field validations and return validation result*********/
              if(hdrValidnRes || dpndntValidnRes){
                return true;
              }else{
                return false;
              }
        }
      }else{
        return true;
      }
    },

    prepareAddOrSavePostingObject: function(action){
      var oList=this.byId("ID_DEPENDENT_LIST");
      var oPage = this.getView().byId("benefitId");
      var dependants = oPage.getModel().oData.PolicyDependentNav.results;
      var selAction = action;
      var sItems = [];
      var PolicyDependentNav = [];
      if(selAction === "ADD"){
        //Moving table bounded items
      if(dependants.length>0){
        $.each(dependants,function(i,entry){
             	entry.Operation = "";//Sending null value for already bounded items

                delete entry.__metadata;
                delete entry.__proto__;
                if(entry.hasOwnProperty("newDep")){
                  delete entry.newDep;
                }
                PolicyDependentNav.push(entry);
            });
      }
        //Moving selected dependents from dialog
        sItems=oList.getSelectedItems();
        
        $.each(sItems,function(i,item){
            var itemPath = item.getBindingContextPath().replace("/","");
            var selObj = oList.getModel("oDpdtModel").oData[itemPath];
            if(selAction === "ADD"){
              selObj.Operation = "I";//I indicates Insert Dependeant
            }else{
              selObj.Operation = "";//Sending null value in case of save action
            }

            delete selObj.__metadata;
            delete selObj.__proto__;
            if(selObj.hasOwnProperty("newDep")){
              delete selObj.newDep;
            }
//            delete selObj.DateOfBirth;
//            delete selObj.Gender;
//            delete selObj.Name;

            PolicyDependentNav.push(selObj);
          });        
        
      }else{//works during SAVE operation
        if(dependants.length>0){
//          $.each(dependants,function(i,entry){
//              entry.Operation = "";//Sending null value in case of save action
//
//              delete entry.__metadata;
//                delete entry.__proto__;
//                //Added newly for testing SAVE operation
//                delete entry.DateOfBirth;
//                delete entry.Gender;
//                delete entry.Name;
//                delete entry.Operation;
//                delete entry.Relationship;
//                delete entry.StdPrem;         
//                
//                if(oPage.getModel().oData.Editable){
//                  delete entry.PhsCard;
//                }else{
//                  delete entry.ActPrem;
//                }
//                
//                PolicyDependentNav.push(entry);
//            });

        	for(var j=0; j<dependants.length; j++){
                var obj = {};
                obj.Operation   = "";//Sending null value in case of save action
                obj.Famsa   = dependants[j].Famsa;
                obj.Pernr   = dependants[j].Pernr;
                obj.Seqnr   = dependants[j].Seqnr;
                obj.ActPrem = dependants[j].ActPrem;
                obj.StdPrem = dependants[j].StdPrem;

                if(oPage.getModel().oData.Status === "M"){
                    obj.PhsCard = dependants[j].PhsCard;
                }
                
                PolicyDependentNav.push(obj);
              }
        }        
      }
      
      return PolicyDependentNav;
    },

    //handle cancel button press of dependent dialog
    onCancelDependentPress:function(e){
      this.oDependentDialog.close();
    },
    // config initial view data
    initialViewConfig:function(Status){
//      var obj={
//          editPolicyDtl:editable,
//          dispPolicyDtl:!editable
//      };
//      var obj={
//          editPolicyDtl:true,
//          dispPolicyDtl:false
//      };
//      var obj={
//          editPolicyDtl:false,
//          dispPolicyDtl:true
//      };
//      var oModel=new JSONModel(obj);
//      this.getView().setModel(oModel,"oViewModel");
//      this.getView().bindElement("oViewModel>/");

      this.getView().byId("premiumToRecoverOld").setVisible(false);
      this.getView().byId("balPremAmtLabel").setVisible(false);
      this.getView().byId("balPremAmtField").setVisible(false);
      this.getView().byId("totalPremiumOld").setVisible(false);   
      var editBtn = this.getView().byId("editBtnId");
      editBtn.setVisible(true);
      if(Status === "R"){//For registering the insurance plan and add any dependent during this period
        this.controlFooterButtons(false);
        editBtn.setText("Edit for Policy Renewal");
      }else if(Status === "M"){//No registration of ins plan is provided but the user can add his spouse or children
        this.controlFooterButtons(false);
        editBtn.setText("Edit Policy Details");
      }else if(Status === "C"){
        this.controlFooterButtons(false);//hide all the footer buttons
        editBtn.setVisible(false);
      }else{
        console.log("No mode was coming from backend for handling the fields.Ideally it will be R||M||C");
      }
    },

    // get models
    getModel: function(a) {
      var c=this.getView().getModel(a) || this.getOwnerComponent().getModel(a);
      return c;
    },
    
    
    refreshPageData: function(selYr){
      this.loadInsuranceData(selYr);
    },
    
    /*
     * clear header premium and premium amount fields in the dependent table
     */
    clearHdrAndDepndntPremiums: function(){
//      var hdrPrem = this.getView().byId("premiumAmtId");
//      hdrPrem.setValue("");
      var oPage = this.getView().byId("benefitId");
      var pageData = oPage.getModel().oData;
      /*clearing premium to be recovered & total premium of the employee*/
      pageData.TotalPremium = "";//added on 04102017
      pageData.PremiumAmount = "";
      var dpndnts = pageData.PolicyDependentNav.results;
      /*clearing premiums associated with the dependents*/
      if(dpndnts.length>0){
        $.each(dpndnts,function(i,item){
          item.StdPrem = "";
          item.ActPrem = "";
        });
      }
    },
    
    /*
     * filters the cvrgPlan Data and CvrgAmt Data based on mapped Inspr 
     */
    handleHdrDropDowns: function(stage){
//      var oView = this.getView();
//      var prvdr = oView.byId("providerNameFieldId");
//      var cvrgPlan = oView.byId("cvrgOptionId");
//      var cvrgAmt = oView.byId("cvrgAmtFieldId");
//
//      if(prvdr.getSelectedKey()){
//        this.handleProviderChange();
//      }
//
//      if(cvrgPlan.getSelectedKey()){
//        this.handleCoveragePlanChange();
//      }
//
//      if(cvrgAmt.getSelectedKey()){
//        this.handleCvrgAmtChange();
//      }

      if(stage === "INITIALCASE"){
        this.handleInitialCaseForHdrDropDowns();
      }
    },
    
    
    handleInitialCaseForHdrDropDowns: function(){
      var oPage = this.getView().byId("benefitId");
      var pageModel = oPage.getModel();

      var insPrvdr = this.getView().byId("providerNameFieldId");
      var insPlan = this.getView().byId("cvrgOptionId");
      var cvrgAmnt = this.getView().byId("cvrgAmtFieldId");

      //**Check for Insurance provider from PolicydetailSet**//
      if(!pageModel.oData.Inspr){
        if(insPrvdr.getItems().length>0){
          insPrvdr.setSelectedItem(insPrvdr.getItems()[0]);//set by default as first item;
        }   
      }
      this.handleProviderChange();

      //**Check for Insurance Type from PolicydetailSet**//
      if(!pageModel.oData.Instyp){
        if(insPlan.getItems().length>0){
          insPlan.setSelectedItem(insPlan.getItems()[0]);//set by default as first item;
        }   
      }
      this.handleCoveragePlanChange();

      //**Check for Insurance Type from PolicydetailSet**//
      if( pageModel.oData.CoverageAmount === "0.000"){
        if(cvrgAmnt.getItems().length>0){
          cvrgAmnt.setSelectedItem(cvrgAmnt.getItems()[0]);//set by default as first item;
        }   
      }
      this.handleCvrgAmtChange();//pass true in this method if you want to calculate the header and individual premiums
    },
    
    
    /*
     * 
     */
    handleClaimStatusClick: function(oEvt){
      this.forceSave = "";
      var addDepndntBtn = this.getView().byId("ID_BTN_TBL_ADD");
      if(addDepndntBtn.getVisible()){
        if(sap.ui.Device.system.desktop){
            var tpaPortal = this.getView().byId("benefitId").getModel().oData.TpaUrl;
              window.open(tpaPortal, '_blank');
          }else{
            this.forceSave = "TPA PORTAL BTN PRESSED";
            var that = this;
            MessageBox.show("Please save the changes that you made",{
                  icon: sap.m.MessageBox.Icon.CONFIRMATION,
                  title: "Confirmation",
                  actions: [sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],
                  defaultAction: sap.m.MessageBox.Action.NO,
                  styleClass: "sapUiSizeCompact",
                  onClose:function(oAction){
                    if(oAction=="YES"){
                      that.handleSavePolicyDetails();
                    }else{
                      that.getView().byId("selectYear").setSelectedKey(this.getView().byId("benefitId").getModel().oData.CurrentYear);
                    }
                  }
              });   
          }
      }else{
        var tpaPortal = this.getView().byId("benefitId").getModel().oData.TpaUrl;
          window.open(tpaPortal, '_blank');
      }
    },
    
    /*
     * 
     */
//    getPolicyDoc: function(oEvt){
//      var pdfContent = com.jkt.ui.mybenefit.demo.app.util.pdfString.pdfContent();
////      var link = new sap.m.Link({
////        href : pdfContent
////      });
////      link.press();
////      window.open(pdfContent);
//      var response = {};
//      response.mimetype = "pdf";
//      response.content = pdfContent;
//
//      var link = document.createElement("a");
//        if (link.download !== undefined) { // feature detection
//            // Browsers that support HTML5 download attribute
////            var url = URL.createObjectURL(pdfContent);
//            link.setAttribute("href", pdfContent);
//            link.setAttribute("download", "file.pdf");
//            link.style = "visibility:hidden";
//            document.body.appendChild(link);
//            link.click();
//            document.body.removeChild(link);
//        }
//
////      var blob;
////      if (response.mimetype == 'pdf') {
////        blob = converBase64toBlob(response.content, 'application/pdf');
////      } else if (response.mimetype == 'doc') {
////        blob = converBase64toBlob(response.content, 'application/msword'); 
////        /*Find the content types for different format of file at http://www.freeformatter.com/mime-types-list.html*/
////      }
////      var blobURL = URL.createObjectURL(blob);
////      window.open(blobURL);
////      window.open(blobURL,'_blank');
////      function checkForMIMEType(response) {
////          var blob;
////          if (response.mimetype == 'pdf') {
////            blob = converBase64toBlob(response.content, 'application/pdf');
////          } else if (response.mimetype == 'doc') {
////            blob = converBase64toBlob(response.content, 'application/msword'); 
////            /*Find the content types for different format of file at http://www.freeformatter.com/mime-types-list.html*/
////          }
////          var blobURL = URL.createObjectURL(blob);
////          window.open(blobURL);
////      }
//
//      function converBase64toBlob(content, contentType) {
//          content = content.slice(28); 
//          contentType = contentType || '';
//          var sliceSize = 512;
//          var byteCharacters = window.atob(content); //method which converts base64 to binary
//          var byteArrays = [
//          ];
//          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//            var slice = byteCharacters.slice(offset, offset + sliceSize);
//            var byteNumbers = new Array(slice.length);
//            for (var i = 0; i < slice.length; i++) {
//              byteNumbers[i] = slice.charCodeAt(i);
//            }
//            var byteArray = new Uint8Array(byteNumbers);
//            byteArrays.push(byteArray);
//          }
//          var blob = new Blob(byteArrays, {
//            type: contentType
//          }); //statement which creates the blob
//          return blob;
//      }
//
//
////      return;
//
////      this.forceSave = "";
////      var addDepndntBtn = this.getView().byId("ID_BTN_TBL_ADD");
////      if(addDepndntBtn.getVisible()){
////        if(sap.ui.Device.system.desktop){
//////            var tpaPortal = this.getView().byId("benefitId").getModel().oData.TpaUrl;
//////              window.open(tpaPortal, '_blank');
////          }else{
////            this.forceSave = "TPA PORTAL BTN PRESSED";
////            var that = this;
////            MessageBox.show("Please save the changes that you made",{
////                  icon: sap.m.MessageBox.Icon.CONFIRMATION,
////                  title: "Confirmation",
////                  actions: [sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],
////                  defaultAction: sap.m.MessageBox.Action.NO,
////                  styleClass: "sapUiSizeCompact",
////                  onClose:function(oAction){
////                    if(oAction=="YES"){
//////                      that.handleSavePolicyDetails();
////                    }else{
////                      that.getView().byId("selectYear").setSelectedKey(this.getView().byId("benefitId").getModel().oData.CurrentYear);
////                    }
////                  }
////              });   
////          }
////      }else{
//////        var tpaPortal = this.getView().byId("benefitId").getModel().oData.TpaUrl;
//////          window.open(tpaPortal, '_blank');
////      } 
//    },
//    
//    getPolicyDoc: function(oEvt){
////      this.busyDialog.open();
//        var that = this;
////        var oPath = "/PolicyDetailSet?$expand=PolicyDependentNav";
//        var oPath = "";
//        var pernr = this.getView().byId("benefitId").getModel().oData.Pernr;
//        oPath = "/PolicyDetailSet"+ "('"+ pernr +"')/$value";
////        oPath = "/sap/opu/odata/sap/ZHRINSURANCE_SRV" +oPath;
//        oPath = "http://jkwgdev.jkti.com:8000/sap/opu/odata/sap/ZHRINSURANCE_SRV" + oPath; 
////        parent.window.open(oPath,'_blank');
////        this.oModel.read(oPath, {async: false,success: function(oData, response){
////      var oData = oData;
////      var response = response;
////      },error: function(oError){
////        cvrgPlan.setBusy(false);
////      }
////    });
////        alert(oPath);
//        var link = document.createElement("a");
//        if (link.download !== undefined) { // feature detection
//            // Browsers that support HTML5 download attribute
////            var url = URL.createObjectURL(pdfContent);
//            link.setAttribute("href", oPath);
//            link.setAttribute("download", "file.pdf");
//            link.style = "visibility:hidden";
//            document.body.appendChild(link);
//            link.click();
//            document.body.removeChild(link);
//        }
//    },
    
    getPolicyDoc: function(oEvt){
        var that = this;
        var oPath = "/PolicyDocSet";
        var pernr = this.getView().byId("benefitId").getModel().oData.Pernr;
        oPath = "/PolicyDocSet"+ "('"+ 1 +"')/$value";
//        oPath = "/sap/opu/odata/sap/ZHRINSURANCE_SRV" +oPath;
        var serviceUri = this.getView().byId("benefitId").getModel().oData.__metadata.uri;
        var mainUri = serviceUri.slice(0,serviceUri.search("ZHRINSURANCE_SRV"));
        oPath = mainUri+"ZHRINSURANCE_SRV" + oPath;
      //oPath = "http://jkwgdev.jkti.com:8000/sap/opu/odata/sap/ZHRINSURANCE_SRV" + oPath; 
//        parent.window.open(oPath,'_blank');
//        this.oModel.read(oPath, {async: false,success: function(oData, response){
//      var oData = oData;
//      var response = response;
//      },error: function(oError){
//        cvrgPlan.setBusy(false);
//      }
//    });
        
//        alert(oPath);
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
//            var url = URL.createObjectURL(pdfContent);
            link.setAttribute("href", oPath);
            link.setAttribute("download", "file.pdf");
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    
    
  onExit: function() {
    //**Reset the changes to original settings **//
    try{
          var objShell = sap.ui.getCore().byId("shell");
          objShell.setHeaderHiding(true);
          objShell.setHeaderHidingDelay(3000);
        }catch(notInFioriLaunchPad){}
    }
    
  });

  return Controller;

});