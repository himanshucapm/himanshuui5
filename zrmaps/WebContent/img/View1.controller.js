//jQuery.sap.require("sap.m.MessageBox");
//jQuery.sap.require("sap.m.MessageToast");
	
sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"jquery.sap.global",
	"sap/ui/Device"
], function(MessageBox,Controller, JSONModel) {
	"use strict";
	
sap.ui.controller("zrmtest1.view.View1", {
	
	
	onInit: function() {
		//for system date
		var oModel = new JSONModel(this._data);
		this.getView().setModel(oModel);
		//use for listbox
		this.onTicketSource();
		this.onTitmentType();
		
		
		
	},
	
//****************************************************	
	//for system date 
	_data : {
		"date" : new Date()
			},
//*****************************************************			

	//Take only Number
	NumValid : function(oEvent)
	{ 
		debugger;
		var val = oEvent.getSource().getValue();
		if(val){
			if(isNaN(val)){
				val = val.substring(0, val.length - 1);
				oEvent.getSource().setValue(val);
			}
		}
	},
	
	//********************************
	NumDigit : function(oEvent){
		debugger;
		var val = oEvent.getSource().getValue();
		if(val){
			if(isNaN(val)){
				val = val.substring(0, val.length - 1);
				oEvent.getSource().setValue(val);
			}
		}
	},
	//*************************************************
	
	//Validate Charactor
	validateCharacter : function( oEvent ){
		var text     = oEvent.getSource().getValue();
		var reg      = /^[a-zA-Z]+$/;
		if( !text.match(reg) ){
			if( !isNaN( text.charAt(0)) || !text.charAt(0).match(reg)){
				text = text.substring( 1 , text.length );
			}else if( !isNaN( text.charAt( text.length - 1 )) || !text.charAt(text.length - 1).match(reg)){
				text = text.substring( 0 , text.length - 1 );
			}else{
				for( var i = 0 ; i < text.length; i++ ){
					if( !isNaN( text.charAt(i) ) || !text.charAt(i).match(reg)){
						text = text.split( text.charAt(i) )[0] + text.split( text.charAt(i) )[1];
					}
				}
			}
			oEvent.getSource().setValue( text );  
		}else{
			oEvent.getSource().setValueState( "None" );
		}       
	},
 //********************************************************
	//for clear field
	
	onClear : function(oEvent){
		var oInput1 = sap.ui.getCore().byId("inpName");
		oInput1.setValue("");
		var oInput1 = sap.ui.getCore().byId("inpPhon");
		oInput1.setValue("");
		
		
		
	},
//*****************************************************
	//Odata for listbox 
	onTicketSource:function(){
		//Method for setting the model for ticket source in list box 
        var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketSourceSet";
 		var jModel = new sap.ui.model.json.JSONModel();
 		jModel.loadData(sPath, null, false,"GET",false, false, null);
 		var  locvar= this.getView().byId("idTicketSource");
 		locvar.unbindAggregation("items");
 		locvar.setModel(jModel);
 		locvar.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{Code}",
				text : "{Text}"
			})
		});		
		},
		
//Fitment Type list box
		onTitmentType : function(){
			debugger;
			var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false,"GET", false, false, null);
			var locvar = this.getView().byId("idFitmentType");
			locvar.unbindAggregation("items");
			locvar.setModel(jModel);
			locvar.bindAggregation("items", {
				path : "/d/results",
				template : new sap.ui.core.Item({
					key : "{Type}",
					text : "{Description}"
				})
			});
		},
	
	//***************************************************************
		//Field validations
		onSave:function(){
			debugger;
			
			if (this.getView().byId("idTicketSource").getSelectedKey()== ""){
				sap.m.MessageToast.show("Please Select Ticket Source");
				this.getView().byId("idTicketSource").setValueState(sap.ui.core.ValueState.Error);
				
			}
			
			/*if (this.getView().byId("idTicketStatus").getSelectedKey()== ""){
				sap.m.MessageToast.show("Please Select Ticket Status");
				return
			}*/
			
			/*if (this.getView().byId("inpVechileType").getValue()== ""){
				sap.m.MessageToast.show("Please Select Vechile Type");
				return
			}*/
			
			var Pho = this.getView().byId("inpPhone").getValue();
			if(Pho ==""){
			sap.m.MessageToast.show("Please Enter Phone");
				this.getView().byId("inpPhone").setValueState(sap.ui.core.ValueState.Error);
				
			} else if(Pho.length < 10){
				sap.m.MessageToast.show("10 Digit Required");
				return;
			}
			
			
			if(this.getView().byId("inpName").getValue()==""){
				sap.m.MessageToast.show("Please Enter Name");
					//return
				this.getView().byId("inpName").setValueState(sap.ui.core.ValueState.Error);
				}
			
			if(this.getView().byId("inpAddress").getValue()==""){
				sap.m.MessageToast.show("Please Select Address");
					this.getView().byId("inpAddress").setValueState(sap.ui.core.ValueState.Error);
				}
			
			
			
			var Eml = this.getView().byId("idEmail").getValue();
			  var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			    if (!mailregex.test(Eml)) {
			    	sap.m.MessageToast.show("Invalid Email ID");	
			    	this.getView().byId("idEmail").setValueState(sap.ui.core.ValueState.Error);
			        }
			
		},
		
		
		/*onStartUpload: function(oEvent) {
			debugger;
			var oUploadCollection = this.byId("UploadCollection");
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = cFiles + " file(s)";

			if (cFiles > 0) {
				oUploadCollection.upload();
				sap.m.MessageBox.information("Uploaded " + uploadInfo);
				
			}
		},*/

		
		
		
		//for image upload
		OnAttachUploader : function(oEvent){
			debugger;
			var oFileUploader = sap.ui.getCore().byId("idUpload");
			var sFileName = oFileUploader.getValue();
			
			 if(!oFileUploader.getValue()){
				 sap.m.MessageToast.show("Choose a file first");
			 }
			 
			 var file = jquery.sap.domById(oFileUploader.getId()+ "-fu").Files[0];
			 var base64_marker = 'data'+file.type+';base64,';
			 var reader = new FileReader();
			 
			 //on load
			 reader.onload = (function(thefile){
				 return function(evt){
					 //locate base64 content
					 var base64Index = evt.target.result.indexof(base64_marker)
					 + base64_marker.length;
					 //get base64 content
					 var base64 = evt.target.result.substring(base64Index);
					 var sTasksService = window.location.origin
					 + "/sap/opu/odata/RUNUP/MY_RUNUP_TAST_SRV/RunupTasks";
					 
					 var sAttachService = window.location.origin
					 + "/sap/opu/odata/RUNUP/MY_RUNUP_TAST_SRV/RunupNewAttachments";
					 
					 var oViewModel = oView.getModel();
					 var oContext = oView.getBindingContext();
					 var oRunupTask = oViewModel.getProperty(oContext.getPath());
					 var oDataModel = sap.ui.getCore().getModel();
					 
					 sWorkitemID = JSON.stringify(oRunupTask.Wind);
					 var service_url = sAttachService;
					 
					 $.ajaxSetup({ cache: false });
					 	jQuery.ajax({
					 		url : service_url,
					 		async : false,
					 		dataType : 'json',
					 		cache : false,
					 		data : base64,
					 		type : 'POST',
					 		beforeSend : function(xhr){
					 			xhr.setRequestHeader("X-CSRF-Token", token);
					 			xhr.setRequestHeader("Content-type", file.type);
					 			xhr.setRequestHeader("slug", sFileName);
					 			xhr.setRequestHeader("WorkitemId", oRunupTask.WiId);
					 		},
					 		success : function(odata){
					 			sap.m.MessageToast.show("File Successfully uploaded");
					 			oFileUploader.setValue("");
					 		},
					 		error : function(odata){
					 			sap.m.MessageToast.show("File uploaded Error");
					 		}
					 	});
				 };
				 
			 }) 
			 
			 (file);
			 //read file
			reader.readAsDataURL(file);
			 oView = this.getView();
			 oAttachDataModel = this.oDataModel;
			
		},
		
		
	//********************************************************************************
		
		
	
	
	
/*****************************************************************************************************************/

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
 * (NOT before the first rendering! onInit() is used for that one!).
 * @memberOf zsumitapss.View1
 */
//	onBeforeRendering: function() {
//
//	},
/**
 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
 * This hook is the same one that SAPUI5 controls get after being rendered.
 * @memberOf zsumitapss.View1
 */
//	onAfterRendering: function() {
//
//	},
/**
 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
 * @memberOf zsumitapss.View1
 */
//	onExit: function() {
//
//	}
});

});