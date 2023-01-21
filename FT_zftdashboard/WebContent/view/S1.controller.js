/*jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("com.acute.claimEdit.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var that, initialFlag, FitType,CName,bukrs,DlName,DepoCode,selKey2,selKey1,CustMob,
    Kunnr,tyreitem,tubeitem,flapitem,count,state,VendorCode,TicketNo,Ticket,stencilvalid;

sap.ui.core.mvc.Controller
		.extend(
				"com.acute.claimEdit.view.S1",
				{
onInit : function() { 
		
		that = this;
		initialFlag = true;
		*//**************added (for Busy indicator)***********//*
		this.newBusy = new sap.m.BusyDialog();
},
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// open Initial Fragments for cust Mob no and Company
onAfterRendering: function() {
	var that = this;
	if(initialFlag){
			if (!that._DealerDialog) {
				
				that._DealerDialog = sap.ui.xmlfragment(
					"com.acute.claimEdit.view.Intial", that);
				that.getView().addDependent(that._DealerDialog);}
			that._DealerDialog.open();
	}				
			if (this.getView().byId("HeaderIdTicketDt").getText() == "" )
				this.getView().byId("idTolbarTDt").setVisible(false);
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onVehicleType2 : function(oEvent){
	this.typepath = oEvent.getSource();
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehTypeDealerSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var _valueHelpVehTypeDialog2 = new sap.m.SelectDialog({

		title: "Vehicle Type",
		items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
				title: "{Type}",
				customData: [new sap.ui.core.CustomData({
					key: "Type",
					value: "{Type}"
				})]

			})
		},
		liveChange: function(oEvent) {
			var sValue = oEvent.getParameter("Type");
			var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleVehTypeClose2, this],
		cancel: [this._handleVehTypeClose2, this]
	});
	_valueHelpVehTypeDialog2.setModel(jModel);
	_valueHelpVehTypeDialog2.open();
},

_handleVehTypeClose2: function(oEvent) {
	var posPath = this.typepath.getParent().getParent().getItems().indexOf(this.typepath.getParent());
	var table = this.getView().byId("idTyreDetailsTable2");
	
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.typepath.setValue(oSelectedItem.getTitle());
		table.getItems()[posPath].getCells()[4].setValue("");
		table.getItems()[posPath].getCells()[4].setEnabled(true);
		table.getItems()[posPath].getCells()[5].setValue("");
		table.getItems()[posPath].getCells()[5].setEnabled(false);
		table.getItems()[posPath].getCells()[6].setValue("");
		table.getItems()[posPath].getCells()[6].setEnabled(false);
		
	}
},

//////////////////////////////////////////////////////////////////////////////////////////////////
onVehicleMake2: function(oEvent) {
		
	this.makepath = oEvent.getSource();
	var posPath = this.makepath.getParent().getParent().getItems().indexOf(this.makepath.getParent());
	var table = this.getView().byId("idTyreDetailsTable2");
	var vehtype = table.getItems()[posPath].getCells()[3].getValue();
	
		var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleMakeSet?$filter=Type eq '"+vehtype+"'";
	 	var jModel = new sap.ui.model.json.JSONModel();
	 	jModel.loadData(sPath, null, false,"GET",false, false, null);
	    var _valueMakeHelpSelectDialog2 = new sap.m.SelectDialog({
	    	
	        title: "Vehicle Make",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{Make}",
	                customData: [new sap.ui.core.CustomData({
	                    key  : "{Make}",
	                    value: "{Type}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue  = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("Make",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleVechMakeClose2, this],
	        cancel : [this._handleVechMakeClose2, this]
	    });
	    _valueMakeHelpSelectDialog2.setModel(jModel);
	    _valueMakeHelpSelectDialog2.open();
	},
	
	_handleVechMakeClose2: function(oEvent) {
		var posPath = this.makepath.getParent().getParent().getItems().indexOf(this.makepath.getParent());
		var table = this.getView().byId("idTyreDetailsTable2");
		
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.makepath.setValue(oSelectedItem.getTitle());
			table.getItems()[posPath].getCells()[5].setValue("");
			table.getItems()[posPath].getCells()[5].setEnabled(true);
			table.getItems()[posPath].getCells()[6].setValue("");
			table.getItems()[posPath].getCells()[6].setEnabled(false);
			
		}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onTyreVechModlF42 : function(oEvent){
	
	this.modelpath = oEvent.getSource();
	var posPath = this.modelpath.getParent().getParent().getItems().indexOf(this.modelpath.getParent());
	var table = this.getView().byId("idTyreDetailsTable2");
	var vehtype = table.getItems()[posPath].getCells()[3].getValue();
	var vehmake = table.getItems()[posPath].getCells()[4].getValue();
	
		var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '"+vehtype+"' and Make eq '" + vehmake + "'";
	 	var jModel = new sap.ui.model.json.JSONModel();
	 	jModel.loadData(sPath, null, false,"GET",false, false, null);
	    var _valueTyreModelHelpSelectDialog2 = new sap.m.SelectDialog({
	    	
	        title: "Vehicle Model",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{Model}",
	                customData: [new sap.ui.core.CustomData({
	                    key  : "{Model}",
	                    value: "{Type}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue  = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("Model",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleVechTyreModelClose2, this],
	        cancel : [this._handleVechTyreModelClose2, this]
	    });
	    _valueTyreModelHelpSelectDialog2.setModel(jModel);
	    _valueTyreModelHelpSelectDialog2.open();
	},
	
	_handleVechTyreModelClose2: function(oEvent) {
		var posPath = this.modelpath.getParent().getParent().getItems().indexOf(this.modelpath.getParent());
		var table = this.getView().byId("idTyreDetailsTable2");
		
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.modelpath.setValue(oSelectedItem.getTitle());
			table.getItems()[posPath].getCells()[6].setValue("");
			table.getItems()[posPath].getCells()[6].setEnabled(true);
			
		}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onVehicleVariant2 : function(oEvent){
	
	this.varpath = oEvent.getSource();
	var posPath = this.varpath.getParent().getParent().getItems().indexOf(this.varpath.getParent());
	var table = this.getView().byId("idTyreDetailsTable2");
	var type = table.getItems()[posPath].getCells()[3].getValue();
	var make = table.getItems()[posPath].getCells()[4].getValue();
	var model = table.getItems()[posPath].getCells()[5].getValue();
	
		var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleVariantSet?$filter=Type eq '" + type + "' and Make eq '" + make + "' and Model eq '" + model + "'";
	 	var jModel = new sap.ui.model.json.JSONModel();
	 	jModel.loadData(sPath, null, false,"GET",false, false, null);
	    var _valueTyreVariantHelpSelectDialog2 = new sap.m.SelectDialog({
	    	
	        title: "Vehicle Variant",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{Variant}",
	                customData: [new sap.ui.core.CustomData({
	                    key  : "{Variant}",
	                    value: "{Type}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue  = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("Variant",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleVechTyreVariantClose2, this],
	        cancel : [this._handleVechTyreVariantClose2, this]
	    });
	    _valueTyreVariantHelpSelectDialog2.setModel(jModel);
	    _valueTyreVariantHelpSelectDialog2.open();
	},
	
	_handleVechTyreVariantClose2: function(oEvent) {
		var posPath = this.varpath.getParent().getParent().getItems().indexOf(this.varpath.getParent());
		var table = this.getView().byId("idTyreDetailsTable2");
		
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.varpath.setValue(oSelectedItem.getTitle());
		
		}
},
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//On Initial Fragment Close
OnFragOk : function(){
	
	
		selKey1 = sap.ui.getCore().byId("RD1").getSelected();		
		selKey2 = sap.ui.getCore().byId("RD2").getSelected();
		
		if(selKey1){			
			Ticket = sap.ui.getCore().byId("idTicketNo").getValue();
			if(Ticket == ""){
				sap.ui.getCore().byId("idTicketNo").setValueState(sap.ui.core.ValueState.Error);
				return;
			} else { 
				sap.ui.getCore().byId("idTicketNo").setValueState(sap.ui.core.ValueState.None);
			}			
		}else{
			
			CustMob = sap.ui.getCore().byId("idCustMob").getValue();
			if(CustMob == ""){
				sap.ui.getCore().byId("idCustMob").setValueState(sap.ui.core.ValueState.Error);
				return;
			} else { 
				sap.ui.getCore().byId("idCustMob").setValueState(sap.ui.core.ValueState.None);
			}
			
			if(CustMob != "" && CustMob.length < "10"){  //check Mobile no valid or not
				sap.m.MessageBox.show("Invalid Mobile Nunber.", {
		            title: "ERROR",
		            icon:sap.m.MessageBox.Icon.ERROR,
					});
					return;
			}	
		};	
		28-August-2019
		CName 	= sap.ui.getCore().byId("idCname").getSelectedKey();
		if(CName == ""){
			sap.ui.getCore().byId("idCname").setValueState(sap.ui.core.ValueState.Error);
			return;
		} else { 
			sap.ui.getCore().byId("idCname").setValueState(sap.ui.core.ValueState.None);
		}
		
		if(selKey1){
			this.onEnter();
			//this.OnDisableFields();
		}else{
			this.OnCustomerDetails();
		};
// Added on April 9		
		if(selKey1){
			this.onEnter();
		}else{
			
			this.getTicketDetails();
			//this.MobileWithTicket();//Ticket Details for mobile number
			//this.OnEnterMobileNo();
			//this.FitType1();//In case of Mobile number
		};
//		
		
		this.onDealerInfo();

		that._DealerDialog.close();
		that._DealerDialog.destroy(); 
		that._DealerDialog=undefined;
	
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//for cancel fragment
OnFragCancel :function(){
	window.history.back();
},
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//fragment for onOK
MobileWithTicket : function(){
	
	
	var TicketListSetJModel = new sap.ui.model.json.JSONModel();
	this._EntriesHelpDialog = sap.ui.xmlfragment("com.acute.claimEdit.view.Ticket_DTL_Mobile",this);
	this.getView().addDependent(this._entriesHelpDialog);
	this._EntriesHelpDialog.setModel(TicketListSetJModel, "TicketListSetJModel");
	this.getTicketDetails();	//Get ticket details with reference to mobile number
	//this._EntriesHelpDialog.open();
}

onWithoutTicket: function(evt){
	
	this._EntriesHelpDialog.close();
	this._EntriesHelpDialog.destroy(true);
	this.OnEnterMobileNo();
	
	//this.getView().byId("idFitmentType").setSelectedKey("REP");
	//this.getView().byId("idVbox1").setVisible(false);
},

getTicketDetails : function(){
	
	var ticket  = "";
	var mobile  = sap.ui.getCore().byId("idCustMob").getValue();
	var that = this;		
	var sPathCartListSet = "/DealerTicketSearchSet?$filter=Kunnr eq '"+Kunnr+"' and TicketNo eq'"+ticket+"' and ITelf1 eq'"+mobile+"'";
		
	var frameworkODataModel = this.getOwnerComponent().getModel();
	var oParamsCartListSet = {};
	oParamsCartListSet.context = "";
	oParamsCartListSet.urlParameters = "";
	oParamsCartListSet.success = function(oData, oResponse) {	// success handler
				
		if(oData.results.length != 0){	
			if (!that._EntriesHelpDialog) {
				that._EntriesHelpDialog = sap.ui.xmlfragment(
					"com.acute.claimEdit.view.Ticket_DTL_Mobile", that);
				that.getView().addDependent(that._EntriesHelpDialog);								
			}
			var TicketListSetJModel = new sap.ui.model.json.JSONModel();
			that._EntriesHelpDialog.setModel(TicketListSetJModel, "TicketListSetJModel");
			TicketListSetJModel.setData(oData.results);
			that._EntriesHelpDialog.open();	
					
		}else{
			that.OnEnterMobileNo();
		}
		

		if(oData.results.length == 0){
			sap.m.MessageToast.show("No Data Found.");	
		}
	};
	
	oParamsCartListSet.error = function(oError) {	// error handler
		jQuery.sap.log.error("read publishing group data failed");
		sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
	};
	frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	frameworkODataModel.attachRequestCompleted(function() {
	});
	
},

displayTicktRequest: function(e){
	
	var path = e.getSource().getBindingContext("TicketListSetJModel").getPath().split('/')[1]
	var data = e.getSource().getBindingContext("TicketListSetJModel").getModel().getData()[path];
	    Ticket = data.TicketNo;
	this.onEnter();
	this.onCustomerfrgClose();
	},

onCustomerfrgClose: function(evt){
		this._EntriesHelpDialog.close();
		this._EntriesHelpDialog.destroy(true);
},	
//////////////////////////////////////////////////////////////////////////////////////////////////
OnEnterMobileNo : function(){
	
	var that = this;

	var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	var fncSuccess = function(oData, oResponse){
		var ary = {
		"d" : oData
		}
        var jModel = new sap.ui.model.json.JSONModel(ary);
        
        state = oData.CustomerRegion;
        that.getView().setModel(jModel , "jModel");
        that.data = jModel.getData();
        	if(that.data.d.Flag != "X"){
        	  that.OnDisableCustomerFields();
        	} 
        	//that.getView().byId("HedClaimNo").setText("Mobile No : " + CustMob);	
        that.getView().byId("idFitmentType").setSelectedKey("REP");	
	}	 
					
	var fncError = function(oError) { // error callback	// function
		var parser = new DOMParser();
		var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
		sap.m.MessageBox.show(message, {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
		});
	}
	// Create Method for final Save
	oReadModel.read("/DealerCustomerInfoSet(CustomerTelf1='"+ CustMob + "')", { 
		success : fncSuccess,
		error : fncError
	});

},	
//////////////////////////////////////////////////////////////////////////////////////////////////
//Model for Customer Details
OnCustomerDetails : function(){
	
	var that = this;
	var CustMob = sap.ui.getCore().byId("idCustMob").getValue();

	var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	var fncSuccess = function(oData, oResponse){
		var ary = {
		"d" : oData
		}
        var jModel = new sap.ui.model.json.JSONModel(ary);
        
        state = oData.CustomerRegion;
        that.getView().setModel(jModel , "jModel");
        that.data = jModel.getData();
        	if(that.data.d.Flag != "X"){
        	  that.OnDisableCustomerFields();
        	}
        	        	
        	that.getView().byId("idTolbarTDt").setVisible(false);
        	that.getView().byId("HedCustMob").setText("Customer Mob No : " + that.data.d.CustomerTelf1);        
	}	 
					
	var fncError = function(oError) { // error callback	// function
		var parser = new DOMParser();
		var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
		sap.m.MessageBox.show(message, {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
		});
	}
	// Create Method for final Save
	oReadModel.read("/DealerCustomerInfoSet(CustomerTelf1='"+ CustMob + "')", { 
		success : fncSuccess,
		error : fncError
	});

},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Action with Radio Button on initial fragment 
selectRefrToTicket : function(e){	
	
	var selKey1 = sap.ui.getCore().byId("RD1").getSelected()
	if(selKey1){
		sap.ui.getCore().byId("idTnolbl").setVisible(true);
    	sap.ui.getCore().byId("idTicketNo").setVisible(true);
    	sap.ui.getCore().byId("idCustMob").setVisible(false);
	}else{
		sap.ui.getCore().byId("idTnolbl").setVisible(false);
    	sap.ui.getCore().byId("idTicketNo").setVisible(false);
    	sap.ui.getCore().byId("idCustMob").setVisible(true);
	}			        	
},


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
onTabSelected :function(oEvent){
	
	var MnfgMonth 	= this.getView().byId("idMnfMonth").getSelectedKey();
	var MnfgYear 	= this.getView().byId("idMnfYear").getValue();
	var filter = oEvent.getParameters().key;
	var tabBar = this.getView().byId("idIconTabBar");
	
	
	if(filter == "ItemTabKey"){
		var validaterequired = this.validaterequired();
		if(!validaterequired){
			sap.m.MessageBox.alert(
					"Please fill all The Required Fields.", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Error"
					 }
			 );
			tabBar.setSelectedKey("VehOemKey");
			return false;
		}
	};
	
	var dt = new Date();
	var mo = dt.getMonth();
	var yr = dt.getFullYear();
	if(MnfgYear == yr && MnfgMonth > mo){ 
	 sap.m.MessageToast.show("Vech. Mnfg. Month/Year can not greater than current Month and Year");	
	 this.getView().byId("idMnfMonth").setValueState("Error");
	 this.getView().byId("idMnfYear").setValueState("Error");
	 tabBar.setSelectedKey("VehOemKey");
	 return (false)
	}

},

//validate TyreOem fields
validateVehOemDtl : function(){
	
	var valid = false;
	var vehmake = this.getView().byId("idFVehicleOemMake");
	var vehmodl = this.getView().byId("idVehicleOemModel");
	var rgno    = this.getView().byId("idVehicleOemRegNo");
	var Vehtype = this.getView().byId("idVehidtl");
	var check = true;
		
	if(Vehtype.getValue()==""){
		Vehtype.setValueState("Error");
		check = false;
	}else{
		Vehtype.setValueState("None");
	}
	
		if(vehmake.getValue()==""){
			vehmake.setValueState("Error");
			check = false;
		}else{
			vehmake.setValueState("None");
		}
		
		if(vehmodl.getValue()==""){
			vehmodl.setValueState("Error");
			check = false;
		}else{
			vehmodl.setValueState("None");
		}
		
		if(rgno.getValue()==""){
			rgno.setValueState("Error");
			check = false;
		}else{
			rgno.setValueState("None");
		}
		
		return check;

},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Base of Ticket selection disabled all field
OnDisableFields : function(){

	this.getView().byId("idCustFirstname").setEnabled(false);
	
	this.getView().byId("idCustAddress").setEnabled(false);
	this.getView().byId("idCustState").setEnabled(false);
	this.getView().byId("idCustDistrict").setEnabled(false);
	this.getView().byId("idCustCity").setEnabled(false);	
	
	this.getView().byId("idCustLastname").getValue();
	this.getView().byId("idCustEmail").getValue();
	
	if (this.getView().byId("idCustLastname").getValue()==""){
		this.getView().byId("idCustLastname").setEnabled(true);
	}
	else{
		this.getView().byId("idCustLastname").setEnabled(false);	
	}
		
	if (this.getView().byId("idCustEmail").getValue()==""){
		this.getView().byId("idCustEmail").setEnabled(true);	
	}else{
		this.getView().byId("idCustEmail").setEnabled(false);	
	}
	
},

//Base of Customer Mobile no disable customer field
OnDisableCustomerFields : function(){
	 
	this.getView().byId("idCustAddress").setEnabled(false);
	this.getView().byId("idCustState").setEnabled(false);
	this.getView().byId("idCustDistrict").setEnabled(false);
	this.getView().byId("idCustCity").setEnabled(false);
	
	if (this.getView().byId("idCustLastname").getValue()==""){
		this.getView().byId("idCustLastname").setEnabled(false);	
	}else{
		this.getView().byId("idCustLastname").setEnabled(true);
	}
	
	if (this.getView().byId("idCustEmail").getValue()==""){
		this.getView().byId("idCustEmail").setEnabled(false);	
	}else{
		this.getView().byId("idCustEmail").setEnabled(true);
	}
},
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Dealer Information
onDealerInfo : function(){
	
	var that=this;
	var user = new sap.ushell.services.UserInfo();
	var uid = user.getId();
	var oViewObj = this.getView();
	var stateListSetJModel = oViewObj.getModel("stateListSetJModel");
	if (!stateListSetJModel) { 
		
		stateListSetJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(stateListSetJModel, "stateListSetJModel");
	}
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	
	var fncSuccess = function(oData, oResponse){
		stateListSetJModel.setData(oData);
		DlName = stateListSetJModel.oData.Name1;
		DepoCode = stateListSetJModel.oData.Werks;
		Kunnr    = stateListSetJModel.oData.Kunnr;
		that.getView().byId("HeaderIdTit").setTitle("Create Claim" + "("+ DlName +")");

	}	
					
	var fncError = function(oError) { // error callback	// function
		var parser = new DOMParser();
		var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
		sap.m.MessageBox.show(message, {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
		}); 
	}
	// Create Method for final Save
	oReadModel.read("/GetDealerInfoSet(Uname='"+uid+"',Bukrs='"+CName+"')", {
		success : fncSuccess,
		error : fncError
	});
	
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//F4 for Ticket No
onTicket : function() {
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpDealerTicketSet?$filter=Kunnr eq '"+Kunnr+"'";
    var jModel = new sap.ui.model.json.JSONModel();
        jModel.loadData(sPath, null, false,"GET",false, false, null);
	var _valueHelpTicketSelectDialog = new sap.m.SelectDialog(
			{
				title : "Select Ticket",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem(
							{
								title : "{TicketNo}",
								customData : [ new sap.ui.core.CustomData(
										{
											key : "Key",
											value : "{TicketNo}"
										}) ],
							}),
				},
				liveChange : function(oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("TicketNo",sap.ui.model.FilterOperator.Contains,sValue);
					oEvent.getSource().getBinding("items").filter([ oFilter ]);
				},
				confirm : [ this._handleTicketClose, this ],
				cancel : [ this._handleTicketClose, this ]
			});
	_valueHelpTicketSelectDialog.setModel(jModel);
	_valueHelpTicketSelectDialog.open();
},
_handleTicketClose : function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		
			sap.ui.getCore().byId("idTicketNo").setValue(oSelectedItem.getTitle()); 	
	}
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//On Select Ticket No
onEnter : function() {
	debugger
	var that = this;
	var ticket = Ticket;
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	var fncSuccess = function(oData, oResponse){
		var ary = {
		"d" : oData
		} 
        var jModel = new sap.ui.model.json.JSONModel(ary);
        
        that.getView().setModel(jModel , "jModel");
        that.data = jModel.getData();
        state = oData.CustomerRegion;
        FitType = that.data.d.FitType;
		that.getView().byId("HeaderIdTicket").setText("Ticket No : " + that.data.d.ITicketNo); //set ticket no in title bar
		//that.OnDisableFields();
		that.onFitmentTypeChange();
	}	
					
	var fncError = function(oError) { // error callback	// function
		var parser = new DOMParser();
		var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
		sap.m.MessageBox.show(message, {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
		});
	}
	
	oReadModel.read("/GetTicketDataSet(ITicketNo='"
			+ ticket + "')", {
		success : fncSuccess,
		error : fncError
	});
}, 

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Making f4 for Vechicle Make
onVehicleMake: function() {
	
		var VechKey = this.getView().byId("idVehidtl").getValue();
		if(VechKey == ""){
			sap.m.MessageBox.show("Please Select Vehicle Type.", {
				title: "ERROR",
	            icon:sap.m.MessageBox.Icon.ERROR,
		        onClose:function(){
		        }
			});
			this.getView().byId("idVehidtl").setValueState("Error");
			return;
		} else { 
			this.getView().byId("idVehidtl").setValueState("None");
		}
			
		var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleMakeSet?$filter=Type eq '"+VechKey+"'";
	 	var jModel = new sap.ui.model.json.JSONModel();
	 	jModel.loadData(sPath, null, false,"GET",false, false, null);
	    var _valueMakeHelpSelectDialog = new sap.m.SelectDialog({
	    	
	        title: "Vehicle Make",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{Make}",
	                customData: [new sap.ui.core.CustomData({
	                    key  : "{Make}",
	                    value: "{Type}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue  = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("Make",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleVechMakeClose, this],
	        cancel : [this._handleVechMakeClose, this]
	    });
	    _valueMakeHelpSelectDialog.setModel(jModel);
	    _valueMakeHelpSelectDialog.open();
	},
	
	_handleVechMakeClose: function(oEvent) {
		
	    var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	        this.getView().byId("idFVehicleOemMake").setValue(oSelectedItem.getTitle());
	    } 
	    this.getView().byId("idVehicleOemModel").setValue("").setEnabled(true);
	    
},


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//F4 for Vehicle Model
onVehicleModel: function() {
	
		var VechMake = this.getView().byId("idFVehicleOemMake").getValue();
		var vechtype = this.getView().byId("idVehidtl").getValue();
		
		var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '"+vechtype+"' and Make eq '" + VechMake + "'";
	 	var jModel = new sap.ui.model.json.JSONModel();
	 	jModel.loadData(sPath, null, false,"GET",false, false, null);
	    var _valueModelHelpSelectDialog = new sap.m.SelectDialog({
	    	
	        title: "Vehicle Model",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{Model}",
	                customData: [new sap.ui.core.CustomData({
	                    key  : "{Model}",
	                    value: "{Type}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue  = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("Model",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleVechModelClose, this],
	        cancel : [this._handleVechModelClose, this]
	    });
	    _valueModelHelpSelectDialog.setModel(jModel);
	    _valueModelHelpSelectDialog.open();
	},
	
	_handleVechModelClose: function(oEvent) {
		
	    var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	        this.getView().byId("idVehicleOemModel").setValue(oSelectedItem.getTitle());
	    }      
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//F4 for item tyre vehicle model
onTyreVechModlF4 : function(evt){
		
		   this.TyreModelCode=evt.getSource().getId();
			var VechMake = this.getView().byId("idFVehicleOemMake").getValue();
			var vehtyp = this.getView().byId("idVehidtl").getValue();
		    var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '"+vehtyp+"' and Make eq '" + VechMake + "'";
		 	var jModel = new sap.ui.model.json.JSONModel();
		 	jModel.loadData(sPath, null, false,"GET",false, false, null);
		    var _valueTyreModelHelpSelectDialog = new sap.m.SelectDialog({
		    	
		        title: "Vehicle Model",
		        items: {
		            path: "/d/results",
		            template: new sap.m.StandardListItem({
		                title: "{Model}",
		                customData: [new sap.ui.core.CustomData({
		                    key  : "{Model}",
		                    value: "{Type}"
		                })],    	               
		            }),
		        },
		        liveChange: function(oEvent) {
		            var sValue  = oEvent.getParameter("value");
		            var oFilter = new sap.ui.model.Filter("Model",sap.ui.model.FilterOperator.Contains,sValue);
		            oEvent.getSource().getBinding("items").filter([oFilter]);
		        },
		        confirm: [this._handleVechTyreModelClose, this],
		        cancel : [this._handleVechTyreModelClose, this]
		    });
		    _valueTyreModelHelpSelectDialog.setModel(jModel);
		    _valueTyreModelHelpSelectDialog.open();
		},
		
		_handleVechTyreModelClose: function(oEvent) {
			
		    var oSelectedItem = oEvent.getParameter("selectedItem");
			var TyreModelCode = sap.ui.getCore().byId(this.TyreModelCode);
		    if (oSelectedItem) {
		        this.getView().byId("idVehicleOemModel").setValue(oSelectedItem.getTitle());
		        TyreModelCode.getParent().getCells()[3].setValue(oSelectedItem.getTitle());
		    } 
	
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//f4 for Tyre Item 
onTyreItemCondeF4:function(evt){
	this.TyreTypeCode=evt.getSource().getId();
	
	var tabitem= this.getView().byId("idIconTabBarStretchContent");
	var ttype;
	if(tabitem.getSelectedKey()=="TyrDtl_A"){
		ttype = "TYRE"
	};
	if(tabitem.getSelectedKey()=="TubDtl_B"){
		ttype = "TUBE"
	};
	if(tabitem.getSelectedKey()=="FlapDtl_C"){
		ttype = "FLAP"
	};
	
	var type  = this.getView().byId("idVehidtl").getValue(); 
	
	var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq '"+ttype+"' and IClaimType eq 'WR10' and IRecvDepo eq '"+DepoCode+"'";
	//var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpDealerItemCodeSet?$filter=Bukrs eq '"+CName+"' and Type eq '"+type+"' and Kunnr eq '"+Kunnr+"' and IClaimItemType eq '"+ttype+"' and IClaimType eq 'SP10' and IRecvDepo eq '"+DepoCode+"'";
	
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	
	var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
			{

				title : "Select Tyre Code",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem(
							{
								title : "{ItemDescr}",
								description:"{ItemCode}",
								 customData: [{ 
									 Type:"sap.ui.core.CustomData",
									    key:"Key",
									    value:"{ItemCode}" 
									   },
									   {
								    Type:"sap.ui.core.CustomData",
									    key:"PrdDesc",
									    value:"{PrdtCatDesc}"  
								     }]	 
							}),
				},
				liveChange : function(oEvent) {
					var sValue = oEvent
							.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
							"ItemDescr",
							sap.ui.model.FilterOperator.Contains,
							sValue);
					oEvent.getSource().getBinding("items")
							.filter([ oFilter ]);
				},
				confirm : [ this._handleTyreJKDealClose, this ],
				cancel : [ this._handleTyreJKDealClose, this ]
			});
	_valueHelpTyreSelectDialog.setModel(jModel);
	_valueHelpTyreSelectDialog.open();

},
_handleTyreJKDealClose : function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	var TyreTypeCode = sap.ui.getCore().byId(this.TyreTypeCode);
	if (oSelectedItem) {
		TyreTypeCode.setValue(oSelectedItem.getDescription());
		TyreTypeCode.getParent().getCells()[1].setValue(oSelectedItem.getTitle());
		var prddesc = oSelectedItem.getCustomData()[1].getValue();
		TyreTypeCode.getParent().getCells()[1].setValue(oSelectedItem.getTitle());
		
		
	
	}

},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
onTyreOemItemCondeF4 : function(evt){
	this.TyreTypeCode=evt.getSource().getId();
	var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'TYRE' and IClaimType eq 'WR10' and IRecvDepo eq '"+DepoCode+"'";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false,
			false, null);
	var _valueHelpTyreOemSelectDialog = new sap.m.SelectDialog(
			{

				title : "Select Tyre Code",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem(
							{
								title : "{ItemDescr}",
								description:"{ItemCode}",
								 customData: [{ 
									 Type:"sap.ui.core.CustomData",
									    key:"Key",
									    value:"{ItemCode}" 
									   },
									   {
								    Type:"sap.ui.core.CustomData",
									    key:"PrdDesc",
									    value:"{PrdtCatDesc}"  
								     }]	 
							}),
				},
				liveChange : function(oEvent) {
					var sValue = oEvent
							.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
							"ItemDescr",
							sap.ui.model.FilterOperator.Contains,
							sValue);
					oEvent.getSource().getBinding("items")
							.filter([ oFilter ]);
				},
				confirm : [ this._handleTyreOemJKDealClose, this ],
				cancel : [ this._handleTyreOemJKDealClose, this ]
			});
	_valueHelpTyreOemSelectDialog.setModel(jModel);
	_valueHelpTyreOemSelectDialog.open();

},
_handleTyreOemJKDealClose : function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	var TyreTypeCode = sap.ui.getCore().byId(this.TyreTypeCode);
	if (oSelectedItem) {
		TyreTypeCode.setValue(oSelectedItem.getDescription());
		TyreTypeCode.getParent().getCells()[0].setValue(oSelectedItem.getDescription());
	}
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//F4 for State
onStateHelp: function() {

	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var _valueHelpSelectDialog = new sap.m.SelectDialog({

		title: "State",
		items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
				title: "{Region}",
				description: "{RegionCode}",
				customData: [new sap.ui.core.CustomData({
					key: "Key",
					value: "{RegionCode}"
				})]

			})
		},
		liveChange: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleClose, this],
		cancel: [this._handleClose, this]
	});
	_valueHelpSelectDialog.setModel(jModel);
	_valueHelpSelectDialog.open();
},

_handleClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.State = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.getView().byId("idCustState").setValue(oSelectedItem.getTitle());
		state = oSelectedItem.getDescription();
		//this.getView().byId("idCustStateCode").setValue(oSelectedItem.getDescription());
		this.getView().byId("idCustDistrict").setEnabled(true).setValue();
		this.getView().byId("idCustCity").setEnabled(false).setValue();
	}
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//F4 for District
onDistrictHelp: function() {
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + this.State + "'";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var _valueHelpDistrictDialog = new sap.m.SelectDialog({

		title: "District",
		items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
				title: "{District}",
				customData: [new sap.ui.core.CustomData({
					key: "Key",
					value: "{District}"
				})]

			})
		},
		liveChange: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("District", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleDistrictClose, this],
		cancel: [this._handleDistrictClose, this]
	});
	_valueHelpDistrictDialog.setModel(jModel);
	_valueHelpDistrictDialog.open();
},

_handleDistrictClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		//this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
		this.District = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.getView().byId("idCustDistrict").setValue(oSelectedItem.getTitle());
		this.getView().byId("idCustCity").setEnabled(true).setValue();
	}

},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
onVehicleType : function(){
	
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleTypeSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var _valueHelpVehTypeDialog = new sap.m.SelectDialog({

		title: "Vehicle Type",
		items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
				title: "{Type}",
				customData: [new sap.ui.core.CustomData({
					key: "Type",
					value: "{Type}"
				})]

			})
		},
		liveChange: function(oEvent) {
			var sValue = oEvent.getParameter("Type");
			var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleVehTypeClose, this],
		cancel: [this._handleVehTypeClose, this]
	});
	_valueHelpVehTypeDialog.setModel(jModel);
	_valueHelpVehTypeDialog.open();
},

_handleVehTypeClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.getView().byId("idVehidtl").setValue(oSelectedItem.getTitle());
		this.getView().byId("idFVehicleOemMake").setValue("").setEnabled(true);
		this.getView().byId("idVehicleOemModel").setValue("");		
	}
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Add items in Tyre Details table
addItemTyreDetailBtn : function(){
	
	var tblItemRep = this.getView().byId("idTyreDetailsTable1");
	var tblItemOem = this.getView().byId("idTyreDetailsTable2");
	    FitType = this.getView().byId("idFitmentType").getSelectedKey();
	
	if(FitType == "OEM"){
		
		var templete= new sap.m.ColumnListItem({
			cells : [
					new sap.m.Input({value:"",valueHelpRequest:[this.onTyreItemCondeF4,this],
									valueHelpOnly:true, showValueHelp:true,editable:true 
					}),
					 
					new sap.m.Input({value:"",valueHelpRequest:[this.onTyreDescF4,this],
						valueHelpOnly:true, showValueHelp:false,editable:false 
					}),
					
					new sap.m.Input({value:"",maxLength:11,change:[this.onvalidate,this]
					 
					}),
//Changed on April 5					
					new sap.m.Input({value:"",valueHelpRequest:[this.onVehicleType2,this],
						valueHelpOnly:true, showValueHelp:true,editable:true
					}),
					
					new sap.m.Input({value:"",valueHelpRequest:[this.onVehicleMake2,this],
									valueHelpOnly:true, showValueHelp:true,editable:true,enabled:false
					}),
					
					new sap.m.Input({value:"",valueHelpRequest:[this.onTyreVechModlF42,this],
									valueHelpOnly:true, showValueHelp:true,editable:true,enabled:false
					}),
				
					new sap.m.Input({value:"",valueHelpRequest:[this.onVehicleVariant2,this],
									valueHelpOnly:true, showValueHelp:true,editable:true,enabled:false
					}),
					
					new sap.m.Input({value:"",liveChange:[this.NumChar,this],maxLength:18
					}),					
									
					new sap.m.Input({value:"",valueHelpRequest:[this.onTyreChassis,this],
						valueHelpOnly:true, showValueHelp:false,editable:true,maxLength:10
					}),
					
					new sap.m.Input({value:"",valueHelpRequest:[this.onTyreKMCvrdF4,this],
						valueHelpOnly:true,liveChange:[this.NumberValid,that],showValueHelp:false,
						editable:true,maxLength:6
					}),
					
					new sap.m.Button({press:[this.onDelete,that],visible:true,type:"Reject",icon:"sap-icon://delete"}),
			], 
	});
		tblItemOem.addItem(templete); 
		
	}else if(FitType == "REP"){
		var templete= new sap.m.ColumnListItem({ 
				cells : [
						new sap.m.Input({value:"",valueHelpRequest:[this.onTyreItemCondeF4,this],
										valueHelpOnly:true, showValueHelp:true,editable:true  
						}),
						
						new sap.m.Input({value:"",valueHelpRequest:[this.onTyreDescF4,this],
										valueHelpOnly:true, showValueHelp:false,editable:false 
						}),
					
						new sap.m.Input({value:"",maxLength:11,change:[this.onvalidate,this]
												
						}),
						new sap.m.Button({press:[this.onDelete,that],visible:true,type:"Reject",icon:"sap-icon://delete"}),
				],
		});
		tblItemRep.addItem(templete);
	}
},

//validate Stencil Number
onvalidate:function(evt)
	{
		
		this.event = evt.getSource();
		var stencilNumber = evt.getSource().getValue();
		var itemCode = evt.getSource().getParent().mAggregations.cells[0].getValue();
//Added on April 5		
		stencilNumber = stencilNumber.toUpperCase();
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(
				sServiceUrl);
		oReadModel.setHeaders({
			"Content-Type" : "application/atom+xml"
		});
		var fncError = function(oError) { // error callback
			// function
			var parser = new DOMParser();
			var message = parser.parseFromString(
					oError.response.body, "text/xml")
					.getElementsByTagName("message")[0].innerHTML
					sap.m.MessageBox.show(message, {
						title : "Error",
						icon : sap.m.MessageBox.Icon.ERROR,
					});
		}
		var fncSuccess = function(oData, oResponse){
			stencilvalid = "";
			if (oData.Message != "") {
				that.stencilFlag = "";
				sap.m.MessageBox.show(oData.Message, {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose : function() {
						that.event.setValue("");
					}
				});
				stencilvalid = "X";
			}
			else{
				that.stencilFlag = "X";
			}
		}
		oReadModel.read("ValidateStencilNumberSet(ClaimRecDepo='"+DepoCode+"',ItemCode='"+itemCode+"',StencilNo='"+stencilNumber+"')",
				{
			success : fncSuccess,
			error : fncError
		});
		
// Added on April 16
		if (FitType == 'REP'){
			var table = this.getView().byId("idTyreDetailsTable1");
		}else{
			var table = this.getView().byId("idTyreDetailsTable2");
		}	
			
		var len = table.getItems().length; 
		
		for(var i=0 ; i<len ; i++){
            
			var cells = table.getItems()[i].getCells();
			var stncl = table.getItems()[i].getCells()[2].getValue();
			var stlgn = stncl.length;
			
			if (stlgn!=5){
			for(var j=0 ; j<len ; j++){
				if( i !== j ){
					if((table.getItems()[i].getCells()[2].getValue() == table.getItems()[j].getCells()[2].getValue()) 
						&& (table.getItems()[i].getCells()[2].getValue() !== "") 
						&& (table.getItems()[j].getCells()[2].getValue() !== "")){
						evt.getSource().setValue("");
						sap.m.MessageToast.show("Duplicate Stencil Entered.");
					}
				}
			}
		  }				
		}
		
//		
	},
	
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Add items in Tube Detail table
addTubeDetailBtn : function(){
	
	var tbltube = this.getView().byId("idTubeDetailsTable");
	
	var templete= new sap.m.ColumnListItem({ 
			cells : [
					new sap.m.Input({value:"",valueHelpRequest:[this.onTyreItemCondeF4,this],
									valueHelpOnly:true, showValueHelp:true,editable:true 
					}),
					
					new sap.m.Input({value:"",valueHelpRequest:[this.onTubeDescF4,this],
									valueHelpOnly:true, showValueHelp:false,editable:false
					}),
					
					new sap.m.Input({value:"",valueHelpRequest:[this.onVendorF4,this],
						valueHelpOnly:true, showValueHelp:true,editable:true
					}),
					
					new sap.m.Input({value:"", visible:false
					}),
					
					new sap.m.Button({press:[this.onDelete,that],visible:true,type:"Reject",icon:"sap-icon://delete"}),
					
					new sap.m.Input({value:"",valueHelpRequest:[this.onVendorF4,this],
						valueHelpOnly:true, showValueHelp:true,editable:true, visible:false
					}),
			],
	});
	tbltube.addItem(templete);
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Add items in Flap Detail table
addFlapDetailBtn : function(){
	
	var tblflap = this.getView().byId("idflapDetailsTable");
	
	var templete= new sap.m.ColumnListItem({
			cells : [
					new sap.m.Input({value:"",valueHelpRequest:[this.onTyreItemCondeF4,this],
									valueHelpOnly:true, showValueHelp:true,editable:true 
					}),
					
					new sap.m.Input({value:"",valueHelpRequest:[this.onFlapDescF4,this],
									valueHelpOnly:true, showValueHelp:false,editable:false
					}),
				
					new sap.m.Input({value:"",change:[this.onvalidateKunnr,that],maxLength:10
					}),
					new sap.m.Input({value:"",valueHelpRequest:[this.onVendorF4,this],
						valueHelpOnly:true, showValueHelp:true,editable:true
					}),
					
					new sap.m.Input({value:"", visible:false
					}),
					
					new sap.m.Button({press:[this.onDelete,that],visible:true,type:"Reject",icon:"sap-icon://delete"}),
					
					new sap.m.Input({value:"",valueHelpRequest:[this.onVendorF4,this],
						valueHelpOnly:true, showValueHelp:true,editable:true, visible:false
					}),
			],
	});
	tblflap.addItem(templete);
},

onvalidateKunnr : function(evt){
	
	this.event = evt.getSource();
	var vendorNumber = evt.getSource().getValue();
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(
			sServiceUrl);
	oReadModel.setHeaders({
		"Content-Type" : "application/atom+xml"
	});
	var fncError = function(oError) { // error callback
		// function
		var parser = new DOMParser();
		var message = parser.parseFromString(
				oError.response.body, "text/xml")
				.getElementsByTagName("message")[0].innerHTML
				sap.m.MessageBox.show(message, {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
				});
	}
	var fncSuccess = function(oData, oResponse){
		
		if (oData.Msg != "") {
			that.stencilFlag = "";
			sap.m.MessageBox.show(oData.Msg, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
				onClose : function() {
				that.event.setValue("");
				}
			});
		}
		else{
			that.stencilFlag = "X";
		}
	}
	oReadModel.read("ValidateVendorSet(Kunnr='"+vendorNumber+"')",
			{
		success : fncSuccess,
		error : fncError
	});
	
},

//f4 for Vendor Code 
onVendorF4:function(evt){
	this.VendorName = evt.getSource().getId();
	var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpVendorTubeFlapSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false,
			false, null);
	var _valueHelpVendorSelectDialog = new sap.m.SelectDialog(
			{

				title : "Select Vendor Code",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem(
							{
								title : "{VendorCode}",
								description:"{VendorCode}",
								 customData: [{ 
									 Type:"sap.ui.core.CustomData",
									    key:"VendorCode"
									    value:"{VendorName}" 
									   }]	 
							}),
				},
				liveChange : function(oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("VendorCode",sap.ui.model.FilterOperator.Contains,sValue);
					    oEvent.getSource().getBinding("items").filter([ oFilter ]);
				},
				confirm : [ this._handleVendorClose, this ],
				cancel : [ this._handleVendorClose, this ]
			});
	_valueHelpVendorSelectDialog.setModel(jModel);
	_valueHelpVendorSelectDialog.open();

},
_handleVendorClose : function(oEvent) {
	
	var oSelectedItem = oEvent.getParameter("selectedItem");
	var VendorName = sap.ui.getCore().byId(this.VendorName);
	if (oSelectedItem) {
		//VendorName.setValue(oSelectedItem.getDescription());
		VendorName.getParent().getCells()[2].setValue(oSelectedItem.getTitle());
		VendorName.getParent().getCells()[4].setValue(oSelectedItem.getTitle());
		
	}

},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Delete Items form item Table
onDelete:function(evt){
	evt.getSource().getParent().getParent().removeItem(evt.getSource().getParent());
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Validate Number
NumberValid: function(oEvent){ 
	var val = oEvent.getSource().getValue();
	   if(val){
		 if(isNaN(val)){
		   val = val.substring(0, val.length - 1); 
		   oEvent.getSource().setValue(val);						
		 }else if(val.indexOf(".")!="-1"){
		   val = val.substring(0, val.length - 1);
		   oEvent.getSource().setValue(val);
		 }
	   }
},
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Validate Customer name.
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
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Name with space
ValidateName : function(oEvent){ 
	
var text = oEvent.getSource().getValue();
var code = text.charCodeAt(text.length-1);
  
          if ( !(code > 64 && code < 91) && !(code > 96 && code < 123) && !(code == 32) ){ //point
                 text = text.substring( 0 , text.length - 1 );
            }                    
    oEvent.getSource().setValue(text);       
  },
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Validate Email id
emailValidate : function(oEvent){
	
//var email = this.getView().byId("idCustEmail").getValue();
	var email = oEvent.getSource().getValue();
 var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
 if (!mailregex.test(email)) {
	 sap.m.MessageToast.show("Invalid Email");
	 oEvent.getSource().setValue();
  }

},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Item table change on selection OEM and REP
onFitmentTypeChange : function(){
	
		FitType = this.getView().byId("idFitmentType").getSelectedKey();
		if(FitType == "OEM"){
			this.getView().byId("idVehicleOemOdometer").setVisible(true);
			this.getView().byId("idTyreDetailsTable2").setVisible(true);
			this.getView().byId("idTyreDetailsTable1").setVisible(false);
			
			this.getView().byId("lblLetterRefNo").setRequired(true);
			this.getView().byId("lblLetterRefDate").setRequired(true);
			
			this.getView().byId("idpnl1").setVisible(true);
			this.getView().byId("idFranchName").setValue();
			this.getView().byId("idFranchPName").setValue();
			this.getView().byId("idFranchEmail").setValue();;
			this.getView().byId("idFranchPhone").setValue();
			this.getView().byId("idFranchLoc").setValue();
			
			this.getView().byId("idFranchName").setValueState("None");
			this.getView().byId("idFranchLoc").setValueState("None");
			
			this.getView().byId("lblVehType").setRequired(true);
			this.getView().byId("idlblFVehicleMake").setRequired(true);
			this.getView().byId("idlblOdometer").setRequired(true);
			this.getView().byId("idlblModel").setRequired(true);
			this.getView().byId("idlblRegno").setRequired(true);
			this.getView().byId("lblMnfg").setRequired(true);
			
			this.getView().byId("idlblFranName").setRequired(true);
			this.getView().byId("idlblFranLoc").setRequired(true);
//			
		}else{
			this.getView().byId("idVehicleOemOdometer").setVisible(false);
			this.getView().byId("idTyreDetailsTable2").setVisible(false);
			this.getView().byId("idTyreDetailsTable1").setVisible(true);
			
			this.getView().byId("lblLetterRefNo").setRequired(false);
			this.getView().byId("lblLetterRefDate").setRequired(false);
			
			this.getView().byId("idpnl1").setVisible(false);
			this.getView().byId("idFranchName").setValue();
			this.getView().byId("idFranchPName").setValue();
			this.getView().byId("idFranchEmail").setValue();;
			this.getView().byId("idFranchPhone").setValue();
			this.getView().byId("idFranchLoc").setValue();
			
			this.getView().byId("idFVehicleOemMake").setValueState("None")
			this.getView().byId("idVehicleOemOdometer").setValueState("None")
			this.getView().byId("idVehicleOemModel").setValueState("None")
			this.getView().byId("idVehicleOemRegNo").setValueState("None")
			this.getView().byId("idMnfMonth").setValueState("None")
			this.getView().byId("idMnfYear").setValueState("None");
		
			this.getView().byId("lblVehType").setRequired(true);
			this.getView().byId("idlblFVehicleMake").setRequired(false);
			this.getView().byId("idlblOdometer").setRequired(false);
			this.getView().byId("idlblModel").setRequired(false);
			this.getView().byId("idlblRegno").setRequired(false);
			this.getView().byId("lblMnfg").setRequired(false);
			
			this.getView().byId("idlblFranName").setRequired(false);
			this.getView().byId("idlblFranLoc").setRequired(false);

		}
		
},

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
OnChangeYear:function(oEvent){ 
	var val = oEvent.getSource().getValue();
	if(val){
		if(isNaN(val)){
			val = val.substring(0, val.length - 1);
			oEvent.getSource().setValue(val);					
		}else if(!(isNaN(val)) && val.length == 4){
			var d = new Date();
			var y = d.getFullYear();
				if(val < 2000){
				sap.m.MessageToast.show("Year cannot be less than 2000");
				oEvent.getSource().setValue();				
				}else if(val > y){
				sap.m.MessageToast.show("Year cannot be future year");
				oEvent.getSource().setValue();
				}				
			}
		else
		{					
		}
	}
},	

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

OnReview: function(){	
	
	
	//validate required fields
	var validaterequired = this.validaterequired();
	if(!validaterequired){
		sap.m.MessageBox.alert(
				"Please fill all Required Fields.", {
				 icon: sap.m.MessageBox.Icon.WARNING,
				 title: "Error"
				 }
		 );
		return false;
	}
			
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~	
	//validate for select any one item table
	var tabBar = this.getView().byId("idIconTabBar");
	var ChooseAnyOneItemDetails =  this.ChooseAnyOneItemDetails();
	if(!ChooseAnyOneItemDetails){
		sap.m.MessageBox.alert(
				"Please fill atleast one product for claim", {
				 icon: sap.m.MessageBox.Icon.WARNING,
				 title: "Error"
				 }
		 );
		tabBar.setSelectedKey("ItemTabKey");
		return false;
	}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~	
	//validate Item Details Fields
	var validateTyreDtlTable = this.validateTyreDtlTable();
	var tabitem= this.getView().byId("idIconTabBarStretchContent");
	var valid =true;
	
	if(!validateTyreDtlTable){
		sap.m.MessageBox.alert(
				"Please fill all Required Fields.", {
				 icon: sap.m.MessageBox.Icon.WARNING,
				 title: "Error"
				 }
		 );
		tabBar.setSelectedKey("ItemTabKey");
		if(tyreitem==false){
		tabitem.setSelectedKey("TyrDtl_A");
		}else if(tubeitem==false){
		tabitem.setSelectedKey("TubDtl_B");
		}else if(flapitem==false){
		 tabitem.setSelectedKey("FlapDtl_C")
		}
		return false;			 							
	}
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//validate Header Details Fields
validaterequired: function(){
	
	var check = true;
	
		FitType 	= this.getView().byId("idFitmentType");

	var RefNo		= this.getView().byId("inpLetterRefNo");
	var RefDt       = this.getView().byId("inpLetterRefDate");

	var phoneno 	= this.getView().byId("idPhoneNo");
	var fname 		= this.getView().byId("idCustFirstname");
	var Address 	= this.getView().byId("idCustAddress");
	var stat 		= this.getView().byId("idCustState");
	var Dist 		= this.getView().byId("idCustDistrict");
	var Location 	= this.getView().byId("idCustCity");
	
	var Vehtype 	= this.getView().byId("idVehidtl");
	var vehmake 	= this.getView().byId("idFVehicleOemMake");
	var vehOdo 		= this.getView().byId("idVehicleOemOdometer");
	var vehmodl 	= this.getView().byId("idVehicleOemModel");
	var rgno    	= this.getView().byId("idVehicleOemRegNo");
	var MnfgMonth 	= this.getView().byId("idMnfMonth");
	var MnfgYear 	= this.getView().byId("idMnfYear");
	
	var FranchNm 	= this.getView().byId("idFranchName");
	//var FranchPNm 	= this.getView().byId("idFranchPName");
	//var FranchEml 	= this.getView().byId("idFranchEmail");
	//var FranchPhon 	= this.getView().byId("idFranchPhone");
	var FranchLoc 	= this.getView().byId("idFranchLoc");
	
	
	if(FitType.getSelectedKey()==""){
		FitType.setValueState("Error");
		check = false;
	}else{
		FitType.setValueState("None");
	}
// Changed on April 5			
				if(FitType.getSelectedKey()=="OEM"){
					if(RefNo.getValue()==""){
						RefNo.setValueState("Error");
						check = false;
					}else{
						RefNo.setValueState("None");
					}
				
					if(RefDt.getDateValue()=="" || RefDt.getDateValue()== null){
						RefDt.setValueState("Error");
						check = false;
					}else{
						RefDt.setValueState("None");
					}
				}
//	
	if(phoneno.getValue()==""){
		phoneno.setValueState("Error");
		check = false;
	}else{
		phoneno.setValueState("None");
	}

	if(fname.getValue()==""){
		fname.setValueState("Error");
		check = false;
	}else{
		fname.setValueState("None");
	}

	if(Address.getValue()==""){
		Address.setValueState("Error");
		check = false;
	}else{
		Address.setValueState("None");
	}

	if(stat.getValue()==""){
		stat.setValueState("Error");
		check = false;
	}else{
		stat.setValueState("None");
	}

	if(Dist.getValue()==""){
		Dist.setValueState("Error");
		check = false;
	}else{
		Dist.setValueState("None");
	}

	if(Location.getValue() == ""){
		Location.setValueState("Error");
		check = false;
	}else{
		Location.setValueState("None");
	}
	
if(FitType.getSelectedKey() =="REP"){
		if(Vehtype.getValue()==""){
			Vehtype.setValueState("Error");
			check = false;
		}else{
			Vehtype.setValueState("None");
		}
				
	}	
	
		
if(FitType.getSelectedKey() == "OEM"){	
	if(Vehtype.getValue()==""){
		Vehtype.setValueState("Error");
		check = false;
	}else{
		Vehtype.setValueState("None");
	}
	
	if(vehmake.getValue()==""){
		vehmake.setValueState("Error");
		check = false;
	}else{
		vehmake.setValueState("None");
	}
	
	if(vehOdo.getValue()==""){
		vehOdo.setValueState("Error");
		check = false;
	}else{
		vehOdo.setValueState("None");
	}
		
	if(vehmodl.getValue()==""){
		vehmodl.setValueState("Error");
		check = false;
	}else{
		vehmodl.setValueState("None");
	}
		
	if(rgno.getValue()==""){
		rgno.setValueState("Error");
		check = false;
	}else{
		rgno.setValueState("None");
	}
	
	if(MnfgMonth.getSelectedKey()==""){
		MnfgMonth.setValueState("Error");
		check = false;
	}else{
		MnfgMonth.setValueState("None");
	}
	
	if(MnfgYear.getValue()==""){
		MnfgYear.setValueState("Error");
		check = false;
	}else{
		MnfgYear.setValueState("None");
	}
	
	if(FranchNm.getValue()==""){
		FranchNm.setValueState("Error");
		check = false;
	}else{
		FranchNm.setValueState("None");
	}
	
	if(FranchLoc.getValue()==""){
		FranchLoc.setValueState("Error");
		check = false;
	}else{
		FranchLoc.setValueState("None");
	}
		
}	
			
	return check;
	
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ChooseAnyOneItemDetails : function(){
	
	var tyreDtlTable1 = this.getView().byId("idTyreDetailsTable1");
	var tyreDtlTable2 = this.getView().byId("idTyreDetailsTable2");
	var tubeDtlTable = this.getView().byId("idTubeDetailsTable");
	var flapDtlTable = this.getView().byId("idflapDetailsTable");
	//(Check Table is empty or not)
	if(tyreDtlTable1.getItems().length <= 0 && tyreDtlTable2 .getItems().length <= 0 && 
	   tubeDtlTable.getItems().length <= 0 && flapDtlTable.getItems().length <= 0 ){
		return false;
	} else {
		return true;
	}
},

//validate Item Details Fields
validateTyreDtlTable : function(){
	
	FitType = this.getView().byId("idFitmentType").getSelectedKey();
	var tyreDtlTable1 = this.getView().byId("idTyreDetailsTable1");
	var tyreDtlTable2 = this.getView().byId("idTyreDetailsTable2");
	var tubeDtlTable  = this.getView().byId("idTubeDetailsTable");
	var flapDtlTable  = this.getView().byId("idflapDetailsTable");
	
	var tyreTabValid = true;
		if(FitType == "REP"){
			var tblrow = tyreDtlTable1.getItems();
			var len = tblrow.length;
			for(var i=0; i<len; i++){
				var tblCell = tblrow[i].getCells;
					for(var j=0; j<=2; j++){
						var getTyrDtlVal = tblrow[i].getCells()[j].getValue();
							if(getTyrDtlVal == ""){
								tblrow[i].getCells()[j].setValueState("Error");
								tyreitem = false;
								tyreTabValid = false;
							}else{
								tblrow[i].getCells()[j].setValueState("None");
							}
					}
			}
			
		} else {
//Changed on April 5			
			var tblrow = tyreDtlTable2.getItems();
			var len = tblrow.length;
			for(var i=0; i<len; i++){
				var tblCell = tblrow[i].getCells; 
					for(var j=0; j<=2; j++){
						var getTyrDtlVal = tblrow[i].getCells()[j].getValue();
							if(getTyrDtlVal == ""){
								tblrow[i].getCells()[j].setValueState("Error");
								tyreitem = false;
								tyreTabValid = false;
							}else{
								tblrow[i].getCells()[j].setValueState("None");
							}
					}
			}
		}
		
		var tblrow = tubeDtlTable.getItems();
		var len = tblrow.length;
		for(var i=0; i<len; i++){
			var tblCell = tblrow[i].getCells;
				for(var j=0; j<=2; j++){
					var getTyrDtlVal = tblrow[i].getCells()[j].getValue();
						if(getTyrDtlVal == ""){
							tblrow[i].getCells()[j].setValueState("Error");
							tubeitem = false;
							tyreTabValid = false;
						}else{
							tblrow[i].getCells()[j].setValueState("None");
						}
				}
		}
		
		var tblrow = flapDtlTable.getItems();
		var len = tblrow.length;
		for(var i=0; i<len; i++){
			var tblCell = tblrow[i].getCells;
				for(var j=0; j<=2; j++){
					var getTyrDtlVal = tblrow[i].getCells()[j].getValue();
						if(getTyrDtlVal == ""){
							tblrow[i].getCells()[j].setValueState("Error");
							flapitem = false;
							tyreTabValid = false;
						}else{
							tblrow[i].getCells()[j].setValueState("None");
						}
				}
		}
		
		return tyreTabValid;
},

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
payLoadDate: function(SDateValue) {
	 
	var str = "T00:00:00";
	var currentTime = new Date(SDateValue);
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var date = year + "-" + month + "-" + day + str;
	return date;
},

//////////////////////////////////////////////////////////////////////////////////////////////////
//Final create claim
onClaimCreate : function(){
	
	if(this.OnReview() == false){
		return;
	};
	 if(stencilvalid == "X"){
		 return false;
	 }
	var count = 0;
	var FitType 	= this.getView().byId("idFitmentType").getSelectedKey();
	var VechType 	= this.getView().byId("idVehidtl").getValue();
	var RefNo		= this.getView().byId("inpLetterRefNo").getValue();
	var RefDt       = this.getView().byId("inpLetterRefDate").getDateValue();
		if(RefDt!=null){
			RefDt = this.payLoadDate(RefDt);		
		 }
	
	var CustPhone   = this.getView().byId("idPhoneNo").getValue();
	var CustFname   = this.getView().byId("idCustFirstname").getValue();
	var CustLname   = this.getView().byId("idCustLastname").getValue();
	var CustAdd     = this.getView().byId("idCustAddress").getValue();
	//var CustState   = this.getView().byId("idCustStateCode").getValue();
	var CustState   = state;
	var CustDist    = this.getView().byId("idCustDistrict").getValue();
	var CustCity    = this.getView().byId("idCustCity").getValue();
	var CustEmail   = this.getView().byId("idCustEmail").getValue();
	var VechMake    = this.getView().byId("idFVehicleOemMake").getValue();
	var VechModel   = this.getView().byId("idVehicleOemModel").getValue();
	var VechRegNo   = this.getView().byId("idVehicleOemRegNo").getValue();
	var MnfgMonth 	= this.getView().byId("idMnfMonth").getSelectedKey();
	var MnfgYear 	= this.getView().byId("idMnfYear").getValue();
	
	if(FitType == "OEM"){
	var KmsDone 	= this.getView().byId("idVehicleOemOdometer").getValue();
	var FranchNm 	= this.getView().byId("idFranchName").getValue();
	var FranchPNm 	= this.getView().byId("idFranchPName").getValue();
	var FranchEml 	= this.getView().byId("idFranchEmail").getValue();
	var FranchPhon 	= this.getView().byId("idFranchPhone").getValue();
	var FranchLoc 	= this.getView().byId("idFranchLoc").getValue();
	}
	
	var tabBar = this.getView().byId("idIconTabBar");
	var dt = new Date();
	var mo = dt.getMonth();
	var yr = dt.getFullYear();
	if(MnfgYear == yr && MnfgMonth > mo){ 
	 sap.m.MessageToast.show("Vech. Mnfg. Month/Year cannot be greater than current Month and Year");	
	 this.getView().byId("idMnfMonth").setValueState("Error");
	 this.getView().byId("idMnfYear").setValueState("Error");
	 tabBar.setSelectedKey("VehOemKey");
	 return (false)
	}
	
	
	var Data={};

		 Data.TicketNo = Ticket;
	Data.SubNo 			= "1";
	
	Data.FitType		= FitType;
	Data.LetterRefNo	= RefNo;
	Data.LetterRefDt	= RefDt;
	Data.CustomerTelf1  = CustPhone;
	Data.CustomerFname  = CustFname;
	Data.CustomerLname  = CustLname;
	Data.CustomerAddr1  = CustAdd;
	Data.CustomerLand1  = 'IN';
	Data.CustType       = '01';
	Data.CustomerRegion = CustState;
	Data.CustomerCity2  = CustDist;
	Data.CustomerCity1  = CustCity;
	Data.CustomerEmail  = CustEmail;
	Data.ClaimRecDepo   = DepoCode;
	Data.ClaimTyp       = "WR10";
	Data.DealerCode     = Kunnr;
	Data.Bukrs          = CName;
	Data.TicketSource   = "05"; 
	Data.Owner          = "02";
// Added on April 9
	if(VechOdoMtr == undefined){
		VechOdoMtr = "0.00";
	}
	
	Data.VehicleType	= VechType;
	Data.VehicleMake  	= VechMake;
	Data.VehicleModel  	= VechModel;
// Added on April 16	
	if(FitType == "REP"){
	Data.KmsDone 		= 0;
	}else
		{Data.KmsDone = KmsDone;
		}
//	
	Data.RegNo  		= VechRegNo;
	
	Data.VechPurcMonth  = MnfgMonth;
	Data.VechPurcYear   = MnfgYear;
	Data.FranhiseName   = FranchNm;
	Data.FranhisePName  = FranchPNm;
	Data.FranhiseEmail  = FranchEml;
	Data.FranhiseContact = FranchPhon;
	Data.FranhiseLoc  	= FranchLoc;
	
	Data.RcptToTyreNvg=[];
	Data.RcptToTubeNvg=[];
	Data.RcptToFlapNvg=[];
		
	if(FitType == "REP"){
	var table=this.getView().byId("idTyreDetailsTable1");
	var len = table.getItems().length;
		for(var i=0; i<len; i++){
			var obj={};
			obj.ItemCode    = table.getItems()[i].getCells()[0].getValue();
			obj.StnclNumber = table.getItems()[i].getCells()[2].getValue().toUpperCase();
			//count++;
			Data.RcptToTyreNvg.push(obj);//push data in tyre table			
		}
		count = count + len;
	
	} else {
		var table1=this.getView().byId("idTyreDetailsTable2");
		var len = table1.getItems().length;
//Changed on April 5
		for(var i=0; i<len; i++){
			var obj={};
			obj.ItemCode 	= table1.getItems()[i].getCells()[0].getValue();
			obj.StnclNumber = table1.getItems()[i].getCells()[2].getValue().toUpperCase();
			//obj.VehType 	= table1.getItems()[i].getCells()[3].getValue();
			//obj.VehMake 	= table1.getItems()[i].getCells()[4].getValue();
			//obj.VehModel 	= table1.getItems()[i].getCells()[5].getValue();
			//obj.VehVariant 	= table1.getItems()[i].getCells()[6].getValue();
			//obj.RegNo 		= table1.getItems()[i].getCells()[7].getValue();
			//obj.ChassisNo   = table1.getItems()[i].getCells()[8].getValue();
			//obj.KMCovered 	= table1.getItems()[i].getCells()[3].getValue();
			//count++;			
			Data.RcptToTyreNvg.push(obj);//push data in tyre table  
		}
		count = count + len;
		
	}	
	
	var table2=this.getView().byId("idTubeDetailsTable");
	var len2 = table2.getItems().length;
		for(var i=0; i<len2; i++){
			var obj={};
			obj.ItemCode = table2.getItems()[i].getCells()[0].getValue();
			obj.Lifnr	 = table2.getItems()[i].getCells()[4].getValue();
			
			Data.RcptToTubeNvg.push(obj);		//push data in tube table
		}
		count = count + len2;
					
		var table3=this.getView().byId("idflapDetailsTable");
		var len3 = table3.getItems().length;
		for(var i=0; i<len3; i++){
			var obj={};
			obj.ItemCode = table3.getItems()[i].getCells()[0].getValue();
			obj.Lifnr    = table3.getItems()[i].getCells()[4].getValue();
			
			Data.RcptToFlapNvg.push(obj);		//push data in flap table
		}
		count = count + len3;
	
		if(Data.RcptToTyreNvg.length==0){
		  delete Data.RcptToTyreNvg;	
		}
		
		if(Data.RcptToTubeNvg.length==0){
			  delete Data.RcptToTubeNvg;	
			}
		
		if(Data.RcptToFlapNvg.length==0){
			  delete Data.RcptToFlapNvg;	
			}
		
		Data.DefectiveTyres = count;
		
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
		var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
			"Content-Type": "application/atom+xml"
			});
		var fncSuccess = function(oData, oResponse) //success function 
			{
		
			if(oData.EError=="true"){
				sap.m.MessageBox.show(oData.EMessage, {
			        title: "Error",
			        icon:sap.m.MessageBox.Icon.ERROR,
			        onClose:function(){
			        }
			    });	
			}else{
			sap.m.MessageBox.show(oData.EMessage, {
		        title: "Success",
		        icon:sap.m.MessageBox.Icon.SUCCESS,
		        onClose:function(){
		        	
		        	//window.history.back();
		        	window.location.reload();
		        	
		        }
		    });
			}
			}
		var fncError = function(oError) { //error callback function
			var parser = new DOMParser();
			//var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
			sap.m.MessageBox.show(parser, {
		        title: "Error",
		        icon:sap.m.MessageBox.Icon.ERROR,
		    });
		}
		//Create Method for final Save
		oCreateModel1.create("/ModifyReceiptNoSet", Data, {
			success: fncSuccess,
			error: fncError
		});
},

//////////////////////////////////////////////////////////////////////////////////////////////////

ValidateFields : function(){
	
	var CustMob		=	this.getView().byId("idPhoneNo");
	
	if(CustMob.getValue() != "" && CustMob.getValue().length < "10"){ //check Mobile no valid or not
		sap.m.MessageBox.show("Invalid Mobile Nunber.", {
            title: "ERROR",
            icon:sap.m.MessageBox.Icon.ERROR,
			});
			return(false); 			
	}
},
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
onchangeletterDate: function(evt){
	
	var date = evt.getSource().getDateValue();
	var today=new Date();
	
	today.setHours(00,00,00);
	if(date.getTime()>today.getTime()){
		sap.m.MessageToast.show("Letter Reference Date Cannot Be A Future Date.");
		evt.getSource().setDateValue(null);
		return
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
NumChar:function(oEvent){
	var text = oEvent.getSource().getValue();
	var code = text.charCodeAt(text.length-1);	 
	
					if ( !(code > 47 && code < 58) && 
						!(code > 64 && code < 91) &&
						!(code > 96 && code < 123)
						){ 
						text = text.substring( 0 , text.length - 1 );
					}
		oEvent.getSource().setValue(text.toUpperCase());		
},
});
*/

/****************************************************************************************************************/
jQuery.sap.require("sap.ui.core.mvc.Controller");
// jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("com.acute.claimEdit.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var DataArticles, that;
sap.ui.core.mvc.Controller
		.extend(
				"com.acute.claimEdit.view.S1",
				{
					onInit : function() {
						debugger
						this.newBusy = new sap.m.BusyDialog();
						// this.newBusy.open();
						this.model = this.getOwnerComponent().getModel();						
						that = this;
						if (!jQuery.support.touch) {
							this.getView().addStyleClass("sapUiSizeCompact");
						}
						if (sap.ui.Device.system.desktop) {
						}
						//this.onTypeofCustomer();
						//this.onTyreFitMent();
						},
					/*onCustSelect:function(evt){
						var key=evt.getSource().getSelectedKey();
						this.onTyreFitMent(key);
						this.getView().byId("idFitment").setEnabled(true);
					},
					
					/*	onTypeofCustomer: function(key) {
						//Method for setting the model for vehicle type
						if(key==undefined){
						var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TypeOfCustomerSet";
						}else{
							var sPath ="/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpCustomerTypeSet?$filter=IClaimTyp eq '"+key+"'"
						}
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false, false, null);
						var loc = this.getView().byId("idCustomer");
						loc.unbindAggregation("items");
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						loc.setModel(jModel);
						loc.unbindAggregation("items");
						if(key==undefined){
							loc.bindAggregation("items", {
								path: "/d/results",
								template: new sap.ui.core.Item({
									key: "{Type}",
									text: "{Description}"
								})
							});
							
							}else{
								loc.bindAggregation("items", {
									path: "/d/results",
									template: new sap.ui.core.Item({
										key: "{CustType}",
										text: "{CustTypeDesc}"
									})
								});
								loc.setSelectedKey();
								}
					},*/
						payLoadDate: function(SDateValue) {
							 
							var str = "T00:00:00";
							var currentTime = new Date(SDateValue);
							var month = currentTime.getMonth() + 1;
							var day = currentTime.getDate();
							var year = currentTime.getFullYear();
							var date = year + "-" + month + "-" + day + str;
							return date;
						},	
/********************************************************************************************/
						OnChangeYear:function(oEvent){ 
							var val = oEvent.getSource().getValue();
							if(val){
								if(isNaN(val)){
									val = val.substring(0, val.length - 1);
									oEvent.getSource().setValue(val);					
								}else if(!(isNaN(val)) && val.length == 4){
									var d = new Date();
									var y = d.getFullYear();
										if(val < 2000){
										sap.m.MessageToast.show("Year cannot be less than 2000");
										oEvent.getSource().setValue();				
										}else if(val > y){
										sap.m.MessageToast.show("Year cannot be future year");
										oEvent.getSource().setValue();
										}				
									}
								else
								{					
								}
							}
						},	
/*****************************dropdown of fitment type*******************************************************************/
					onTyreFitMent: function(key) {
						debugger
						//Method for setting the model for vehicle type
						if(key==undefined){
						var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
						}else{
						var sPath ="/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpFitmentTypeSet?$filter=IClaimTyp eq '"+this.ClaimType+"' and ICustType eq '"+key+"'";
						}
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false, false, null);
						var loc = this.getView().byId("idFitment");
						loc.unbindAggregation("items");
						loc.setModel(jModel);
						if(key==undefined){
							loc.bindAggregation("items", {
								path: "/d/results",
								template: new sap.ui.core.Item({
									key: "{Type}",
									text: "{Description}"
								})
							});
							
							}else{
								loc.bindAggregation("items", {
									path: "/d/results",
									template: new sap.ui.core.Item({
										key: "{FitType}",
										text: "{FitTypeDesc}"
									})
								});
								loc.setSelectedKey();
								}
						//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
						
						
					},
/*************************************************************************************/
/*					onTicket : function() {
						debugger
						var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpTicketSet";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTicketSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Ticket",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{TicketNo}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{TicketNo}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"TicketNo",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleTicketClose, this ],
									cancel : [ this._handleTicketClose, this ]
								});
						_valueHelpTicketSelectDialog.setModel(jModel);
						_valueHelpTicketSelectDialog.open();
					},
					_handleTicketClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.getView().byId("idTno").setValue(oSelectedItem.getTitle());
							that.onEnter();
							
						}

					},*/
/****************************function for claim number(changes by amit on 03/09/2019)****************************/
					onClaimF4 : function() {
						debugger
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimSet";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTicketSelectDialog = new sap.m.SelectDialog(
								{
									title : "Select Claim No",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{IClaimNo}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{IClaimNo}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"IClaimNo",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleClaimClose, this ],
									cancel : [ this._handleClaimClose, this ]
								});
						_valueHelpTicketSelectDialog.setModel(jModel);
						_valueHelpTicketSelectDialog.open();
					},
					_handleClaimClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.getView().byId("idClaimNo").setValue(
									oSelectedItem.getTitle());
							that.getView().byId("idEdit").setVisible(true);
							that.onEnter();
							that.onFitmentChange();
						}

					},
/***************************************************************************************************/
/*					onTypeofClaim : function() {
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimTypeSet";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpClaimSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Ticket",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{Descr}"+" ("+"{ClaimType}"+")",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{ClaimType}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
	
	 var oFilter = new sap.ui.model.Filter("ClaimType",sap.ui.model.FilterOperator.Contains,sValue);
     var oFilter2 = new sap.ui.model.Filter("Descr",sap.ui.model.FilterOperator.Contains,sValue);
     
     var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false); 
										oEvent.getSource().getBinding("items")
												.filter([ oFilter1 ]);
									},
									confirm : [ this._handleTypeClaimClose, this ],
									cancel : [ this._handleTypeClaimClose, this ]
								});
						_valueHelpClaimSelectDialog.setModel(jModel);
						_valueHelpClaimSelectDialog.open();
					},
					_handleTypeClaimClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.getView().byId("idClaim").setValue(
									oSelectedItem.getTitle());
							this.getView().byId("iddepo").setEnabled(true);
							this.ClaimType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							that.onTypeofCustomer(this.ClaimType);
							//this.getView().byId("idCustomer").setEnabled(true);
							
						}

					},*/
/**************************************************************************************************/
					/*onTypeofDepo : function() {
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimRecvDepoSet";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelprDepoSelectDialog = new sap.m.SelectDialog(
								{
									title : "Select Receving Depo",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{Name1}"+" ("+"{Werks}"+")",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{Werks}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
	 var sValue = oEvent.getParameter("value");
	 var oFilter = new sap.ui.model.Filter("Werks",sap.ui.model.FilterOperator.Contains,sValue);
     var oFilter2 = new sap.ui.model.Filter("Name1",sap.ui.model.FilterOperator.Contains,sValue);
     var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false);									
	 oEvent.getSource().getBinding("items")
												.filter([ oFilter1 ]);
									},
									confirm : [ this._handleTypeDepoClose, this ],
									cancel : [ this._handleTypeDepoClose, this ]
								});
						_valueHelprDepoSelectDialog.setModel(jModel);
						_valueHelprDepoSelectDialog.open();
					},
					_handleTypeDepoClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.getView().byId("iddepo").setValue(
									oSelectedItem.getTitle());
							this.RecDepoType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							this.getView().byId("idIconTabBarStretchContent").setVisible(true);
							//this.getView().byId("idDelar").setEnabled(true);
							this.getView().byId("Id_bt1").setVisible(true);
							
						}

					},*/
/*************************************************************************************************/				
					onEnter : function() {
						debugger
						var that = this;
						var ticket = this.getView().byId("idClaimNo").getValue();
						// var sPath =
						// "/sap/opu/odata/sap/ZCS_TICKET_SRV/GetTicketDataSet(ITicketNo='"
						// + ticket + "')";
						var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
						var oReadModel = new sap.ui.model.odata.ODataModel(
								sServiceUrl);
						oReadModel.setHeaders({
							"Content-Type" : "application/atom+xml"
						});
						var fncSuccess = function(oData, oResponse) // sucess function
						{
							var ary = {
								"d" : oData
							}
							var jModel = new sap.ui.model.json.JSONModel(ary);
							that.getView().setModel(jModel, "jModel");
							that.data = jModel.getData();
							if(that.data.d.FitType == "OEM"){
								that.getView().byId("idpnl1").setVisible(true);
							}
							if(that.data.d.ItemType == "TYRE"){
								that.getView().byId("IdPanel").setVisible(true);
								that.getView().byId("IdPanel1").setVisible(false);
								that.getView().byId("IdPanel2").setVisible(false);
							} else if(that.data.d.ItemType == "TUBE"){
								that.getView().byId("IdPanel").setVisible(false);
								that.getView().byId("IdPanel1").setVisible(true);
								that.getView().byId("IdPanel2").setVisible(false);

							}else{
								that.getView().byId("IdPanel").setVisible(false);
								that.getView().byId("IdPanel1").setVisible(false);
								that.getView().byId("IdPanel2").setVisible(true);
							}
							that.getView().byId("idToolbar").setVisible(true);
							//jModel = setData(d);
							if (that.data.d.EMessage != "") {
								sap.m.MessageBox.show(that.data.d.EMessage, {
									title : "Error",
									icon : sap.m.MessageBox.Icon.ERROR,
									onClose : function() {
										// window.history.back();
										that.flag = "C";
										that.handleButtonPress();
										that.getView().byId("idSave").setEnabled(false);
									}
								});
							} 
							else{
							}
							that.Dealer 		= that.data.d.DealerCode;
							that.State 			= that.data.d.CustomerRegion;
							that.ClaimType 		= that.data.d.ClaimTyp;
							that.RecDepoType	= that.data.d.ClaimRecDepo;
							that.ClaimStatus 	= that.data.d.ClaimStatus
							
						if(oData.ClaimNoTyre!="" && oData.ClaimNoTube=="" && oData.ClaimNoFlap==""){
								that.getView().byId("IdPanel").setVisible(true);
								that.getView().byId("IdPanel1").setVisible(false);
								that.getView().byId("IdPanel2").setVisible(false);
							}
						if(oData.ClaimNoTyre=="" && oData.ClaimNoTube!="" && oData.ClaimNoFlap==""){
							that.getView().byId("IdPanel").setVisible(false);
							that.getView().byId("IdPanel1").setVisible(true);
							that.getView().byId("IdPanel2").setVisible(false);
													}
						if(oData.ClaimNoTyre=="" && oData.ClaimNoTube=="" && oData.ClaimNoFlap!=""){
							that.getView().byId("IdPanel").setVisible(false);
							that.getView().byId("IdPanel1").setVisible(false);
							that.getView().byId("IdPanel2").setVisible(true);	
						}
						that.getView().byId("idPhone1").setEnabled(false);
						that.getView().byId("idFname").setEnabled(false);
						that.getView().byId("idLname").setEnabled(false);
						that.getView().byId("idEmail").setEnabled(false);
						that.getView().byId("idAdd1").setEnabled(false);
						//that.getView().byId("idAdd2").setEnabled(false);
						that.getView().byId("idCity").setEnabled(false);
						that.getView().byId("idDistrict").setEnabled(false);
						that.getView().byId("idState").setEnabled(false);
						//that.getView().byId("idCountry").setEnabled(false);
						//that.getView().byId("idCode").setEnabled(false);
						//that.getView().byId("idFCNameInput").setEnabled(true);
						//that.getView().byId("idFNameInput").setEnabled(true);
						//that.getView().byId("idFPNoInput").setEnabled(true);	
						if(that.getView().byId("IdPanel").getVisible(true)){
							that.getView().byId("idTyreCode").setEnabled(false);
							that.getView().byId("idTyreDescription").setEnabled(false);
							that.getView().byId("idTyreStencil").setEnabled(false);
							//that.getView().byId("idTyreMDNo").setEnabled(false);
							//that.getView().byId("idTyreVmodel").setEnabled(false);
							//that.getView().byId("idTyreRgNo").setEnabled(false);
							//that.getView().byId("idTubeCode").setEnabled(false);
							//that.getView().byId("idFlapCode").setEnabled(false);					
						}
						if(that.getView().byId("IdPanel1").getVisible(true)){
							that.getView().byId("idTubeCode").setEnabled(false);
							that.getView().byId("idTubeDescription").setEnabled(false);
							that.getView().byId("idVendorCodeTube").setEnabled(false);
							//that.getView().byId("idTyreMDNo").setEnabled(false);
							//that.getView().byId("idTyreVmodel").setEnabled(false);
							//that.getView().byId("idTyreRgNo").setEnabled(false);
							//that.getView().byId("idTubeCode").setEnabled(false);
							//that.getView().byId("idFlapCode").setEnabled(false);
												}
						if(that.getView().byId("IdPanel2").getVisible()){
							that.getView().byId("idFlapCode").setEnabled(false);
							that.getView().byId("idFlapDescription").setEnabled(false);
							that.getView().byId("idVendorCodeFlap").setEnabled(false);
							//that.getView().byId("idTyreMDNo").setEnabled(false);
							//that.getView().byId("idTyreVmodel").setEnabled(false);
							//that.getView().byId("idTyreRgNo").setEnabled(false);	
							//that.getView().byId("idTubeCode").setEnabled(false);
							//that.getView().byId("idFlapCode").setEnabled(false);	
						}
						//that.getView().byId("idDelar").setEnabled(false);
						that.getView().byId("Id_bt1").setVisible(false);						
						that.getView().byId("idEdit").setVisible(true);
						//that.getView().byId("idPrint").setVisible(true);
						}	
						var fncError = function(oError) { // error callback  function
							var parser = new DOMParser();
							var message = parser.parseFromString(
									oError.response.body, "text/xml")
									.getElementsByTagName("message")[0].innerHTML
							sap.m.MessageBox.show(message, {
								title : "Error",
								icon : sap.m.MessageBox.Icon.ERROR,
							});
						}
						// Create Method for final Save
						oReadModel.read("/DisplayClaimDataSet('"
								+ ticket + "')", {
							success : fncSuccess,
							error : fncError
						});

					},
/****************************************************************************************/
/*					onStateHelp: function() {
						var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false, false, null);
						var _valueHelpSelectDialog = new sap.m.SelectDialog({

							title: "State",
							items: {
								path: "/d/results",
								template: new sap.m.StandardListItem({
									title: "{Region}",
									customData: [new sap.ui.core.CustomData({
										key: "Key",
										value: "{RegionCode}"
									})]

								})
							},
							liveChange: function(oEvent) {
								var sValue = oEvent.getParameter("value");
								var oFilter = new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, sValue);
								oEvent.getSource().getBinding("items").filter([oFilter]);
							},
							confirm: [this._handleClose, this],
							cancel: [this._handleClose, this]
						});
						_valueHelpSelectDialog.setModel(jModel);
						_valueHelpSelectDialog.open();
					},

					_handleClose: function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							//this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
							this.State = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							this.getView().byId("idState").setValue(oSelectedItem.getTitle());
						}

					},*/
/******************************************************************************************************/
					onDistrictHelp: function() {
						var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + this.State + "'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false, false, null);
						var _valueHelpDistrictDialog = new sap.m.SelectDialog({

							title: "District",
							items: {
								path: "/d/results",
								template: new sap.m.StandardListItem({
									title: "{District}",
									customData: [new sap.ui.core.CustomData({
										key: "Key",
										value: "{District}"
									})]

								})
							},
							liveChange: function(oEvent) {
								var sValue = oEvent.getParameter("value");
								var oFilter = new sap.ui.model.Filter("District", sap.ui.model.FilterOperator.Contains, sValue);
								oEvent.getSource().getBinding("items").filter([oFilter]);
							},
							confirm: [this._handleDistrictClose, this],
							cancel: [this._handleDistrictClose, this]
						});
						_valueHelpDistrictDialog.setModel(jModel);
						_valueHelpDistrictDialog.open();
					},

					_handleDistrictClose: function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							//this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
							this.District = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							this.getView().byId("idDistrict").setValue(oSelectedItem.getTitle());
						}

					},
/*****************************************************************************************************/
/*					onTypeJkDelar:function(){
						debugger
					//var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpDealerSet?$filter=ClaimType eq '"+this.ClaimType+"' and ClaimRecvDepo eq '"+this.RecDepoType+"'";
					var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpDealerSet?$filter=ClaimType eq '"+ this.data.d.ClaimTyp +"' and ClaimRecvDepo eq '"+this.data.d.ClaimRecDepo+"'";
					var jModel = new sap.ui.model.json.JSONModel();
					jModel.loadData(sPath, null, false, "GET", false,
							false, null);
					var _valueHelprJKDealSelectDialog = new sap.m.SelectDialog(
							{
								title : "Select Delar Code",
								items : {
									path : "/d/results",
									template : new sap.m.StandardListItem(
											{
												 title: "{Name1}",
									             description : "{Kunnr}",
												//title : "{Name1}"+"("+"{Kunnr}"+")",
												customData : [ new sap.ui.core.CustomData(
														{
															key : "Key",
															value : "{Kunnr}"
														}) ],
											}),
								},
								liveChange : function(oEvent) {
									var sValue = oEvent
											.getParameter("value");
								
									 var oFilter = new sap.ui.model.Filter("Name1",sap.ui.model.FilterOperator.Contains,sValue);
							         var oFilter2 = new sap.ui.model.Filter("Kunnr",sap.ui.model.FilterOperator.Contains,sValue);
							         
							         var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false);
									oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
								},
								confirm : [ this._handleTypeJKDealClose, this ],
								cancel : [ this._handleTypeJKDealClose, this ]
							});
					_valueHelprJKDealSelectDialog.setModel(jModel);
					_valueHelprJKDealSelectDialog.open();
				},
				_handleTypeJKDealClose : function(oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						debugger
						//this.getView().byId("idDelar").setValue();
						//this.getView().byId("idDelar").setValue(oSelectedItem.getDescription());
						
						var obj=oSelectedItem.getBindingContext().getObject();
						this.getView().byId("idDelarName").setValue(obj.Name1);
						this.getView().byId("idStreet").setValue(obj.Street);
						this.getView().byId("iddelCity").setValue(obj.City1);
						this.getView().byId("iddelDist").setValue(obj.City2);
						this.getView().byId("idDealPos").setValue(obj.Post_code1);
						this.getView().byId("idDealMobil").setValue(obj.Tel_number);
						this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
						this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
						this.getView().byId("idDelarName").setValue(oEvent.getParameter("selectedItem").getCustomData()[0].getValue());
					}

				},*/
/****************************************************************************************************/
				NumberValid : function(oEvent)
				{ 
					debugger
					var val = oEvent.getSource().getValue();
					if(val){
						if(isNaN(val)){
							val = val.substring(0, val.length - 1);
							oEvent.getSource().setValue(val);
							
						}
					}
				},
/********************************************************************************************************/
				validateCharacter : function( oEvent ){
					debugger
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
/******************************************************************************************************/
/*					handleButtonPress:function(){
						var Table=this.getView().byId("tblDetail");
						var templete= new sap.m.ColumnListItem({
	        	            cells: [ new sap.m.Input({
	        	                valueHelpRequest:[that.IteamCodeTyre,that],
	        	                valueHelpOnly:true,
	        	                showValueHelp:true
	        	                
	        	            }), new sap.m.Text({
	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Text({        	                
	        	            }),
	        	            new sap.m.Text({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            }),new sap.m.Input({	        	                
	        	            })],
	        	        	
	        	        });
						Table.addItem(templete);
					},
					handleButtonPress1:function(){
						var Table=this.getView().byId("tblDetail2");
						var templete= new sap.m.ColumnListItem({
	        	            cells: [ new sap.m.Input({
	        	                valueHelpRequest:[that.IteamCodeFlap,that],
	        	                valueHelpOnly:true,
	        	                showValueHelp:true
	        	                
	        	            }), new sap.m.Text({
	        	                
	        	            }) ],
	        	        	
	        	        });
						Table.addItem(templete);
					},*/
/*******************************************************************************************************/
					/*handleButtonPress2:function(){
						var Table=this.getView().byId("tblDetail1");
						var templete= new sap.m.ColumnListItem({
	        	            cells: [ new sap.m.Input({
	        	                valueHelpRequest:[that.IteamCodeTube,that],
	        	                valueHelpOnly:true,
	        	                showValueHelp:true
	        	                
	        	            }), new sap.m.Text({
	        	                
	        	            }) ],
	        	        	
	        	        });
						Table.addItem(templete);
					},*/
				
					ItemCodeTyre:function(evt){
						debugger
						//this.TyreTypeCode=evt.getSource().getParent();
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'TYRE' and IClaimType eq '"+this.ClaimType+"' and IRecvDepo eq '"+this.RecDepoType+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Tyre Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{ItemDescr}",
													description:"{ItemCode}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{ItemCode}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"ItemDescr",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleTyreJKDealClose, this ],
									cancel : [ this._handleTyreJKDealClose, this ]
								});
						_valueHelpTyreSelectDialog.setModel(jModel);
						_valueHelpTyreSelectDialog.open();
					},
					_handleTyreJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idTyreCode").setValue(oSelectedItem.getDescription());
							that.getView().byId("idTyreDescription").setValue(oSelectedItem.getTitle());
							debugger
							/*var obj=oSelectedItem.getBindingContext().getObject();
							that.getView().byId("idTyreodeDsc").setValue(obj.ItemDescr);
							that.getView().byId("idTyrePdc").setValue(obj.PrdtCat);
							that.getView().byId("idTyrePdcds").setValue(obj.PrdtCatDesc);*/
							
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							
						}

					},
/********************************************************************************************************/
					ItemCodeTube:function(evt){
						debugger
						//this.TyreTypeCode=evt.getSource().getParent();
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'TUBE' and IClaimType eq '"+this.ClaimType+"' and IRecvDepo eq '"+this.RecDepoType+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Tube Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{ItemDescr}",
													description:"{ItemCode}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{ItemCode}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"ItemDescr",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleTubeJKDealClose, this ],
									cancel : [ this._handleTubeJKDealClose, this ]
								});
						_valueHelpTyreSelectDialog.setModel(jModel);
						_valueHelpTyreSelectDialog.open();
					},
					_handleTubeJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idTubeCode").setValue(
									oSelectedItem.getDescription());
							debugger
							var obj=oSelectedItem.getBindingContext().getObject();
							that.getView().byId("idTubeDescription").setValue(obj.ItemDescr);
							
							
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							
						}

					},
/*************************************************************************************************/
					ItemCodeFlap:function(evt){
						debugger
						var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpItemCodeSet?$filter=IClaimItemType eq 'FLAP' and IClaimType eq '"+this.ClaimType+"' and IRecvDepo eq '"+this.RecDepoType+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Flap Code",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{ItemDescr}",
													description:"{ItemCode}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{ItemCode}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
										var oFilter = new sap.ui.model.Filter(
												"ItemDescr",
												sap.ui.model.FilterOperator.Contains,
												sValue);
										oEvent.getSource().getBinding("items")
												.filter([ oFilter ]);
									},
									confirm : [ this._handleFLAPJKDealClose, this ],
									cancel : [ this._handleFLAPJKDealClose, this ]
								});
						_valueHelpTyreSelectDialog.setModel(jModel);
						_valueHelpTyreSelectDialog.open();
					},
					_handleFLAPJKDealClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							that.getView().byId("idFlapCode").setValue(
									oSelectedItem.getDescription());
							debugger
							var obj=oSelectedItem.getBindingContext().getObject();
							that.getView().byId("idFlapDescription").setValue(obj.ItemDescr);
							//this.DelarCodeType = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
							
						}

					},
/************************************************************************************************************/
					onClaimCreate:function(){
						debugger
						//var claimType=this.getView().byId("idClaim").getValue();
						//var ClaimDepo=this.getView().byId("iddepo").getValue();
						//var TicketNO=this.getView().byId("idTno").getValue();
						//var TicketDate=this.getView().byId("idTkDate").getValue();
						//var custType=this.getView().byId("idCustomer").getSelectedKey();
						var claimNo = this.getView().byId("idClaimNo").getValue();
						var FitType = this.getView().byId("idFitment").getSelectedKey();
						var LetterRefNo = this.getView().byId("idlttno").getValue();
						var LetterRefDt = this.getView().byId("idlttdt").getDateValue();
						if(LetterRefDt!=null){
							LetterRefDt = this.payLoadDate(LetterRefDt);		
						 }
						var CustmMobile=    this.getView().byId("idPhone1").getValue();
						var CustomerFname = this.getView().byId("idFname").getValue();
						var CustomerLname = this.getView().byId("idLname").getValue();
						var CustomerAddr1 = this.getView().byId("idAdd1").getValue();
						var CustomerRegion = this.getView().byId("idState").getValue();
						//var CustomerAddr2 = this.getView().byId("idAdd2").getValue();
						var CustomerCity1 = this.getView().byId("idCity").getValue();
						var CustomerCity2 = this.getView().byId("idDistrict").getValue();
						var CustomerEmail = this.getView().byId("idEmail").getValue();
						//var CustomerLand1 = this.getView().byId("idCountry").getSelectedKey();
						//var CustomerPstlz = this.getView().byId("idCode").getValue();
						var VehType = this.getView().byId("idVehType").getValue();
						var VehMake = this.getView().byId("idFVehicleOemMake").getValue();
						var VehModel = this.getView().byId("idVehicleOemModel").getValue();
						var regNumber = this.getView().byId("idVehicleOemRegNo").getValue();
						var mfgMonth = this.getView().byId("idMnfMonth").getSelectedKey();
						var mfgYear = this.getView().byId("idMnfYear").getValue();
						var FranhiseName = this.getView().byId("idFranchName").getValue();
						var FranhisePName = this.getView().byId("idFranchPName").getValue();
						var FranchiseEmail = this.getView().byId("idFranchEmail").getValue();
						var FranchisePhone = this.getView().byId("idFranchPhone").getValue();
						var FranchiseLocation = this.getView().byId("idFranchLoc").getValue();
						//var CompanyName = this.getView().byId("idFCNameInput").getValue();
						//var FranhiseName = this.getView().byId("idFNameInput").getValue();
						//var FranhiseContact = this.getView().byId("idFPNoInput").getValue();
						//var Dealar=this.getView().byId("idDelar").getValue();
							/*if(this.getView().byId("idTno").getVisible()){
								if(TicketNO==""){sap.m.MessageBox.show("Select Ticket NO", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
								return
							}	
							}*/
							if(CustmMobile==""){sap.m.MessageBox.show("Enter Customer Mobile No", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
														return
													}
							if(CustomerFname==""){sap.m.MessageBox.show("Enter Customer First Name", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
														return
													}
							
							if(CustomerCity2=="" ){sap.m.MessageBox.show("Enter Customer District", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							return
							}
							if(CustomerRegion=="" ){sap.m.MessageBox.show("Enter Customer State", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							return
							}
							//if(FitType=="" ){sap.m.MessageBox.show("Select FitMent Type", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							//return
							//}
							/*if(CompanyName=="" && this.getView().byId("idFCNameLabel").getRequired() ){sap.m.MessageBox.show("Enter Franchise Comp Name", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							return
							}*/
							/*if(Dealar=="" ){sap.m.MessageBox.show("Select JK Dealer Code", {title: "Error",icon:sap.m.MessageBox.Icon.ERROR,});
							return
							}*/ 
							//get all values
							var Data={};
							Data.EMessage="";
							Data.EError="";
							//Data.ClaimDate= this.DateNew(this.getView().byId("idclDate").getDateValue());;
							Data.ClaimNo		=claimNo;
							Data.ClaimTyp 		= this.ClaimType;
							Data.ClaimRecDepo 	= this.RecDepoType;
							Data.ClaimStatus 	= this.ClaimStatus;
							//Data.ClaimRecDepo=that.data.d.ClaimRecDepo;
							//Data.ClaimTyp=that.data.d.ClaimTyp;
							//Data.ClaimStatus=that.data.d.ClaimStatus
							//Data.TicketNo=that.data.d.TicketNo;
							//Data.TicketDate=this.DateNew(this.getView().byId("idTkDate").getDateValue());
							Data.LetterRefNo=LetterRefNo;
							Data.LetterRefDt=LetterRefDt;
							Data.FitType=that.data.d.FitType;
							//Data.CustType=custType;
							Data.CustomerTelf1=CustmMobile;
							Data.CustomerFname=CustomerFname;
							Data.CustomerLname=CustomerLname;
							Data.CustomerEmail=CustomerEmail;
							Data.CustomerAddr1=CustomerAddr1;
							//Data.CustomerAddr2=CustomerAddr2;
							Data.CustomerCity1=CustomerCity1;
							Data.CustomerCity2=this.District;
							Data.CustomerRegion=this.State;
                            Data.VehType = VehType;
							Data.VehMake = VehMake;
							Data.VehModel = VehModel;
							Data.RegNo = regNumber;
							Data.VehPurchaseMonth = mfgMonth;
							Data.VehPurchaseYear = mfgYear;
							Data.FranhiseName = FranhiseName;
							Data.FranchisePName = FranhisePName;
							Data.FranchiseEmail = FranchiseEmail;
							Data.FranhiseContact = FranchisePhone;
							Data.FranchiseLocation = FranchiseLocation;
							//Data.CustomerLand1=CustomerLand1;
							//Data.CustomerPstlz=CustomerPstlz;
							//Data.DealerCode=this.DelarCodeType;
							//Data.CompanyName=CompanyName;
							//Data.FranhiseName=FranhiseName;
							//Data.FranhiseContact=FranhiseContact;
							if(that.getView().byId("IdPanel").getVisible()){
							Data.ClaimNoTyre=claimNo;
							Data.ItemCodeTyre=this.getView().byId("idTyreCode").getValue();
							Data.ItemDescTyre=this.getView().byId("idTyreDescription").getValue();
							Data.StnclNumber=this.getView().byId("idTyreStencil").getValue();
							//Data.MouldNo=this.getView().byId("idTyreMDNo").getValue();
							//Data.OldMatDesc="";
							//Data.PrdtCat=this.getView().byId("idTyrePdc").getValue();
							//Data.PrdtCatDesc=this.getView().byId("idTyrePdcds").getValue();
							//Data.SubmNo=this.getView().byId("idTyreSubno").getValue();
							//Data.TlyFlg=this.getView().byId("idTyreTally").getValue();
							//Data.SubmReason=this.getView().byId("idTyreSubres").getValue();
							//Data.ManfPlnt=this.getView().byId("idTyreMfP").getValue();
							//Data.VehMake=this.getView().byId("idTyreVmk").getValue();
							//Data.VehModel=this.getView().byId("idTyreVmodel").getValue();
							//Data.RegNo=this.getView().byId("idTyreRgNo").getValue();
							//Data.ChassisNo=this.getView().byId("idTyreChNo").getValue();
							//Data.ClaimNoTube="";
							//Data.ItemCodeTube="";
							//Data.ItemDescTube="";
							//Data.ClaimNoFlap="";
							//Data.ItemCodeFlap="";
							//Data.ItemDescFlap="";
							}else if(that.getView().byId("IdPanel1").getVisible()){
							//Data.ClaimNoTyre="";
							Data.ClaimNoTube=claimNo;
							Data.ItemCodeTube = this.getView().byId("idTubeCode").getValue();
							Data.ItemDescTube = this.getView().byId("idTubeDescription").getValue();
							Data.VendorCode   = this.getView().byId("idVendorCodeTube").getValue();
							//Data.StnclNumber="";
							//Data.MouldNo="";
							//Data.OldMatDesc="";
							//Data.PrdtCat="";
							//Data.PrdtCatDesc="";
							//Data.SubmNo="";
							//Data.TlyFlg="";
							//Data.SubmReason="";
							//Data.ManfPlnt="";
							//Data.VehMake="";
							//Data.VehModel="";
							//Data.RegNo="";
							//Data.ChassisNo="";
							//Data.ItemCodeTube=this.getView().byId("idTubeCode").getValue();;
							//Data.ItemDescTube=this.getView().byId("idTubeDescription").getValue();;
							//Data.ClaimNoFlap="";
							//Data.ItemCodeFlap="";
							//Data.ItemDescFlap="";	   		
							}else if(that.getView().byId("IdPanel2").getVisible()){
								Data.ClaimNoFlap  = claimNo;
								Data.ItemCodeFlap = this.getView().byId("idFlapCode").getValue();
								Data.ItemDescFlap = this.getView().byId("idFlapDescription").getValue();
								Data.VendorCode   = this.getView().byId("idVendorCodeFlap").getValue();	
								//Data.ClaimNo="";
								//Data.ItemCodeTyre="";
								//Data.ItemDescTyre="";
								//Data.StnclNumber="";
								//Data.MouldNo="";
								//Data.OldMatDesc="";
								//Data.PrdtCat="";
								//Data.PrdtCatDesc="";
								//Data.SubmNo="";
								//Data.TlyFlg="";
								//Data.SubmReason="";
								//Data.ManfPlnt="";
								//Data.VehMake="";
								//Data.VehModel="";
								//Data.RegNo="";
								//Data.ChassisNo="";
								//Data.ClaimNoTube="";
								//Data.ItemCodeTube="";
								//Data.ItemDescTube=""	
							}
								var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
								var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
								oCreateModel1.setHeaders({
									"Content-Type": "application/atom+xml"
									});
								var fncSuccess = function(oData, oResponse) //sucess function 
									{
								//	sap.m.MessageBox.show("Ticket:"+oData.ETicketNo+" Updated", {
								//        title: "Success",
								//        icon:sap.m.MessageBox.Icon.SUCCESS,
								//        onClose:function(){
								//        	window.history.back();
								//        	
								//    			
								//        }
								//    });
								if(oData.EError=="X"){
									sap.m.MessageBox.show(oData.EMessage, {
								        title: "Error",
								        icon:sap.m.MessageBox.Icon.ERROR,
								        onClose:function(){
								        }
								    });	
								}else{
								sap.m.MessageBox.show(oData.EMessage, {
							        title: "Success",
							        icon:sap.m.MessageBox.Icon.SUCCESS,
							        onClose:function(){
							        	sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_CLAIM_SRV/ClaimOutputFormSet(ClaimNo='',TicketNo='"+oData.TicketNo+"')/$value", true);
							        	window.history.back();
							        }
								});
								}
											}
								var fncError = function(oError) { //error callback function
								var parser = new DOMParser();
								var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
								sap.m.MessageBox.show(message, {
									title: "Error",
									icon:sap.m.MessageBox.Icon.ERROR,
								});
					}
								//Create Method for final Save
								oCreateModel1.create("/UpdateClaimDataSet", Data, {
									success: fncSuccess,
									error: fncError
								});
									},
/********************* using a btton for item info************************************************/
/*					onIteminfo:function(){
						debugger
					//this.getView().byId("vbox1").setVisible(false); 
					var jModel = this.getView().getModel("jModel");
					var itemData = jModel.getData();
					var itemType = itemData.d.ItemType; 
					
					if(itemType == "TYRE"){
						this.getView().byId("IdPanel").setVisible(true);
					}
					else if(itemType == "TUBE")
					{
						this.getView().byId("IdPanel1").setVisible(true);
						
					}
					else{
						this.getView().byId("IdPanel2").setVisible(true);
					}
					
					//this.getView().byId("idTypeCust").setVisible(true);
					//this.getView().byId("idDlName").setVisible(true);
					//this.getView().byId("idClmStatus").setVisible(true);
					//this.getView().byId("idDlLocation").setVisible(true);
					//this.getView().byId("idCustomer").setVisible(false);
					//this.getView().byId("idTicketSource").setVisible(false);
					//this.getView().byId("idNoPr").setVisible(false);
					this.getView().byId("idlttno").setVisible(false);
					this.getView().byId("idlttdt").setVisible(false);
					//this.getView().byId("idMonth").setVisible(false);
					//this.getView().byId("idYear").setVisible(false);
					
					},*/
/******************************************************************************************************/
			/*		DateNew:function(Date1){
						if(Date1===null){
							Date1=new Date();
						}
						var month = Date1.getMonth() + 1;
						var date  = Date1.getDate();
						if (month.toString().length < 2) {
							month = "0" + month.toString();
						}
						if (date.toString().length < 2) {
							date = "0" + date.toString();
						}
						var formatDate = Date1.getFullYear()  + '-' + month + '-' + date + "T00:00:00";
						return formatDate;
					},*/
/******************************************************************************************************/
					onFitmentChange: function(oEvent) {
						//var key = oEvent.mParameters.selectedItem.getKey();
						var key = this.getView().byId("idFitment").getSelectedKey();
						if (key === "OEM") {
							that.getView().byId("idVehicleOemOdometer").setVisible(true);
							that.getView().byId("idRefNo").setRequired(true);
							that.getView().byId("idRefDate").setRequired(true);
							that.getView().byId("lblVehType").setRequired(true);
							that.getView().byId("idlblFVehicleMake").setRequired(true);
							that.getView().byId("idlblOdometer").setRequired(true);
							that.getView().byId("idlblModel").setRequired(true);
							that.getView().byId("idlblRegno").setRequired(true);
							that.getView().byId("lblMnfg").setRequired(true);
							that.getView().byId("idlblFranName").setRequired(true);
							that.getView().byId("idlblFranLoc").setRequired(true);
							//that.getView().byId("idlblRegno").setRequired(true);
							that.getView().byId("idpnl1").setVisible(true);
							/*that.getView().byId("idFCNameInput").setEnabled(true);
							that.getView().byId("idFNameInput").setEnabled(true);
							that.getView().byId("idDVPInput").setEnabled(true);
							that.getView().byId("idFPNoInput").setEnabled(true);
							that.getView().byId("idFCNameLabel").setRequired(true);*/
						} else {
							that.getView().byId("idVehicleOemOdometer").setVisible(false);
							that.getView().byId("idRefNo").setRequired(false);
							that.getView().byId("idRefDate").setRequired(false);
							that.getView().byId("lblVehType").setRequired(false);
							that.getView().byId("idlblFVehicleMake").setRequired(false);
							that.getView().byId("idlblOdometer").setRequired(false);
							that.getView().byId("idlblModel").setRequired(false);
							that.getView().byId("idlblRegno").setRequired(false);
							that.getView().byId("lblMnfg").setRequired(false);
							that.getView().byId("idlblFranName").setRequired(false);
							that.getView().byId("idlblFranLoc").setRequired(false);
							that.getView().byId("idpnl1").setVisible(false)
							/*that.getView().byId("idFCNameInput").setEnabled(false);
							that.getView().byId("idFNameInput").setEnabled(false);
							that.getView().byId("idDVPInput").setEnabled(true);
							that.getView().byId("idFPNoInput").setEnabled(false);
							that.getView().byId("idFCNameLabel").setRequired(false);*/
						}
					},
/**********************************************************************************************************/
/*			    	onFranch:function(){
			    		 	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FranchiseCompanyNameSet";
					 		var jModel = new sap.ui.model.json.JSONModel();
					 		jModel.loadData(sPath, null, false,"GET",false, false, null);
			 	    		var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({
			 	    	
					 	        title: "Company Name",
					 	        items: {
					 	            path: "/d/results",
					 	            template: new sap.m.StandardListItem({
					 	                title: "{CompanyName}",
					 	                customData: [new sap.ui.core.CustomData({
					 	                    key: "Key",
					 	                    value: "{CompanyName}"
					 	                })],
					 	               
					 	            }),
					 	        },
					 	        liveChange: function(oEvent) {
					 	            var sValue = oEvent.getParameter("value");
					 	            var oFilter = new sap.ui.model.Filter("CompanyName",sap.ui.model.FilterOperator.Contains,sValue);
					 	            oEvent.getSource().getBinding("items").filter([oFilter]);
					 	        },
					 	        confirm: [this._handlefranchClose, this],
					 	        cancel: [this._handlefranchClose, this]
					 	    });
					 	    _valueHelpFranchSelectDialog.setModel(jModel);
					 	   _valueHelpFranchSelectDialog.open();	
					    	},
					    	_handlefranchClose: function(oEvent) {
					    	    var oSelectedItem = oEvent.getParameter("selectedItem");
					    	    if (oSelectedItem) {
					    	        
					    	        this.getView().byId("idFCNameInput").setValue(oSelectedItem.getTitle());
					    	    }
			      
			    	},*/
/********************************************************************************************************/
			    	Onedit:function(){
			    		debugger
			    		that.getView().byId("Id_bt1").setVisible(true);//change by amit
			    		//that.getView().byId("Id_bt2").setVisible(true);
			    		//that.getView().byId("backBtn").setVisible(true);
			    		//that.getView().byId("idDelar").setEnabled(true);
						//that.getView().byId("idPhone1").setEnabled(false);
						//that.getView().byId("idAltNo").setEnabled(true);
						//that.getView().byId("idClaimNo").setEnabled(true);
						//that.getView().byId("idCustomer").setEnabled(true);
						that.getView().byId("idFitment").setEnabled(true);
						that.getView().byId("idlttno").setEnabled(true);
						that.getView().byId("idlttdt").setEnabled(true);
						that.getView().byId("idPhone").setEnabled(true);
						that.getView().byId("idPhone1").setEnabled(true);
						//that.getView().byId("idFname").setEnabled(true);
						//that.getView().byId("idLname").setEnabled(true);
						//that.getView().byId("idAdd1").setEnabled(true);
						//that.getView().byId("idState").setEnabled(true);
						that.getView().byId("idDistrict").setEnabled(true);
						//that.getView().byId("idCity").setEnabled(true);
						//that.getView().byId("idAdd2").setEnabled(false);
						//that.getView().byId("idEmail").setEnabled(true);
						//that.getView().byId("idCountry").setEnabled(false);
						//that.getView().byId("idCode").setEnabled(true);
						//that.getView().byId("idVehType").setEnabled(true);
						//that.getView().byId("idFVehicleOemMake").setEnabled(true);
						//that.getView().byId("idVehicleOemModel").setEnabled(true);
						//that.getView().byId("idVehicleOemRegNo").setEnabled(true);
						that.getView().byId("idMnfMonth").setEnabled(true);
						that.getView().byId("idMnfYear").setEnabled(true);
						that.getView().byId("idFranchName").setEnabled(true);
						that.getView().byId("idFranchPName").setEnabled(true);
						that.getView().byId("idFranchEmail").setEnabled(true);
						that.getView().byId("idFranchPhone").setEnabled(true);
						that.getView().byId("idFranchLoc").setEnabled(true);
						//that.getView().byId("idFCNameInput").setEnabled(true);
						//that.getView().byId("idFNameInput").setEnabled(true);
						//that.getView().byId("idfranEmail").setEnabled(true);
						//that.getView().byId("idFPNoInput").setEnabled(true);
						//that.getView().byId("idFranLocation").setEnabled(true);
						
						if(that.getView().byId("IdPanel").getVisible()){
							that.getView().byId("idTyreCode").setEnabled(true);
							//that.getView().byId("idTyreDescription").setEnabled(true);
							that.getView().byId("idTyreStencil").setEnabled(true);
							//that.getView().byId("idTyreMDNo").setEnabled(true);
							//that.getView().byId("idTyreVmodel").setEnabled(true);
							//that.getView().byId("idTyreRgNo").setEnabled(true);
							//that.getView().byId("idTubeCode").setEnabled(false);
							//that.getView().byId("idFlapCode").setEnabled(false);
												
						}
						if(that.getView().byId("IdPanel1").getVisible()){
							that.getView().byId("idTubeCode").setEnabled(true);
							//that.getView().byId("idTubeDescription").setEnabled(true);
							that.getView().byId("idVendorCodeTube").setEnabled(true);
							//that.getView().byId("idTyreMDNo").setEnabled(false);
							//that.getView().byId("idTyreVmodel").setEnabled(false);
							//that.getView().byId("idTyreRgNo").setEnabled(false);
							//that.getView().byId("idTubeCode").setEnabled(true);
							//that.getView().byId("idFlapCode").setEnabled(false);
												}
						if(that.getView().byId("IdPanel2").getVisible()){
							that.getView().byId("idFlapCode").setEnabled(true);
							//that.getView().byId("idFlapDescription").setEnabled(true);
							that.getView().byId("idVendorCodeFlap").setEnabled(true);
							//that.getView().byId("idTyreMDNo").setEnabled(false);
							//that.getView().byId("idTyreVmodel").setEnabled(false);
							//that.getView().byId("idTyreRgNo").setEnabled(false);
							//that.getView().byId("idTubeCode").setEnabled(false);
							//that.getView().byId("idFlapCode").setEnabled(true);	
						}	
			    	},
/**************************************************************************************/
			    	//f4 for Vendor Code 
			    	onVendorTubeF4:function(evt){
			    		debugger
			    		this.VendorName = evt.getSource().getId();
			    		var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpVendorTubeFlapSet";
			    		var jModel = new sap.ui.model.json.JSONModel();
			    		jModel.loadData(sPath, null, false, "GET", false,
			    				false, null);
			    		var _valueHelpVendorTubeSelectDialog = new sap.m.SelectDialog(
			    				{

			    					title : "Select Vendor Code",
			    					items : {
			    						path : "/d/results",
			    						template : new sap.m.StandardListItem(
			    								{
			    									title : "{VendorCode}",
			    									/*description:"{VendorCode}",*/
			    									 customData: [{ 
			    										 Type:"sap.ui.core.CustomData",
			    										    key:"VendorCode"
			    										   /* value:"{VendorName}" */
			    										   }]	 
			    								}),
			    					},
			    					liveChange : function(oEvent) {
			    						var sValue = oEvent.getParameter("value");
			    						var oFilter = new sap.ui.model.Filter("VendorCode",sap.ui.model.FilterOperator.Contains,sValue);
			    						    oEvent.getSource().getBinding("items").filter([ oFilter ]);
			    					},
			    					confirm : [ this._handleVendorTubeClose, this ],
			    					cancel : [ this._handleVendorTubeClose, this ]
			    				});
			    		_valueHelpVendorTubeSelectDialog.setModel(jModel);
			    		_valueHelpVendorTubeSelectDialog.open();

			    	},	
			    	_handleVendorTubeClose : function(oEvent) {
			    		debugger
			    		var oSelectedItem = oEvent.getParameter("selectedItem");
			    		var VendorName = this.getView().byId("idVendorCodeTube");
			    		if (oSelectedItem) {
			    			VendorName.setValue(oSelectedItem.getTitle());
			    		}

			    	},
		    	
/***************************************************************************************************/
			    	onVendorFlapF4:function(evt){
			    		debugger
			    		this.VendorName = evt.getSource().getId();
			    		var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpVendorTubeFlapSet";
			    		var jModel = new sap.ui.model.json.JSONModel();
			    		jModel.loadData(sPath, null, false, "GET", false,
			    				false, null);
			    		var _valueHelpVendorFlapSelectDialog = new sap.m.SelectDialog(
			    				{

			    					title : "Select Vendor Code",
			    					items : {
			    						path : "/d/results",
			    						template : new sap.m.StandardListItem(
			    								{
			    									title : "{VendorCode}",
			    									/*description:"{VendorCode}",*/
			    									 customData: [{ 
			    										 Type:"sap.ui.core.CustomData",
			    										    key:"VendorCode"
			    										   /* value:"{VendorName}" */
			    										   }]	 
			    								}),
			    					},
			    					liveChange : function(oEvent) {
			    						var sValue = oEvent.getParameter("value");
			    						var oFilter = new sap.ui.model.Filter("VendorCode",sap.ui.model.FilterOperator.Contains,sValue);
			    						    oEvent.getSource().getBinding("items").filter([ oFilter ]);
			    					},
			    					confirm : [ this.handleVendorFlapClose, this ],
			    					cancel : [ this.handleVendorFlapClose, this ]
			    				});
			    		_valueHelpVendorFlapSelectDialog.setModel(jModel);
			    		_valueHelpVendorFlapSelectDialog.open();

			    	},
			    	handleVendorFlapClose : function(oEvent) {
			    		debugger
			    		var oSelectedItem = oEvent.getParameter("selectedItem");
			    		if (oSelectedItem) {
			    			 this.getView().byId("idVendorCodeFlap").setValue(oSelectedItem.getTitle());
			    		}

			    	},	
/*********************************************************************************************************/
			    	/*OnPrint:function(){
			    		debugger
			    		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_CLAIM_SRV/ClaimOutputFormSet(ClaimNo='',TicketNo='"+that.data.d.TicketNo+"')/$value", true);
			        		
			    	},
*/
				});