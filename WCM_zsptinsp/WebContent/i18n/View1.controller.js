sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(MessageBox,Controller, JSONModel) {
	"use strict";
var that1;
	return Controller.extend("com.acute.ticketZTicket.controller.View1", {
		
		
		onInit: function() 
		{
			that1=this;
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			var date = new Date();

			this.onTypeofCustomer();
			this.onFitmentType();
			this.onTicketSource();
			this.bindStateData();

			var oModel = new JSONModel(this._data);
			this.getView().setModel(oModel);
		},
		
		payLoadDate: function(SDateValue) {
			var str = "T00:00:00";
			var currentTime = new Date(SDateValue);
			var month = currentTime.getMonth() + 1;
			var day = currentTime.getDate();
			var year = currentTime.getFullYear();
			var date = year + "-" + month + "-" + day + str;
			return date;
		},						
		
//for date
	_data : {
		"date" : new Date()
			},
			
			
			bindStateData: function() {
				var oViewObj = this.getView();
				var stateListSetJModel = oViewObj.getModel("stateListSetJModel");
				if (!stateListSetJModel) {
					stateListSetJModel = new JSONModel();
					oViewObj.setModel(stateListSetJModel, "stateListSetJModel");
				}
				var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
		 		var jModel = new sap.ui.model.json.JSONModel();
		 		stateListSetJModel.loadData(sPath, null, false,"GET",false, false, null);

			},
			bindDistrictData: function(state) {
				var oViewObj = this.getView();
				var districtListSetJModel = oViewObj.getModel("districtListSetJModel");
				if (!districtListSetJModel) {
					districtListSetJModel = new JSONModel();
					oViewObj.setModel(districtListSetJModel, "districtListSetJModel");
				}
				var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + state + "'";
		 		var jModel = new sap.ui.model.json.JSONModel();
		 		districtListSetJModel.loadData(sPath, null, false,"GET",false, false, null);

			},
				
/************EVENTS BEGIN*****************/	
			
			//start state 
			onStateHelp: function(oEvt) {  
			var oViewObj = this.getView();
			var stateListSetJModel = oViewObj.getModel("stateListSetJModel");
    	    var _valueHelpSelectDialog = new sap.m.SelectDialog({
    	    	
    	        title: "State",
    	        items: {
    	            path: "/d/results",
    	            template: new sap.m.StandardListItem({
    	                title: "{Region}",
    	                customData: [new sap.ui.core.CustomData({
    	                    key: "Key",
    	                    value: "{RegionCode}"
    	                })],    	               
    	            }),
    	        },
    	        liveChange: function(oEvent) {
    	            var sValue = oEvent.getParameter("value");
    	            var oFilter = new sap.ui.model.Filter("Region",sap.ui.model.FilterOperator.Contains,sValue);
    	            oEvent.getSource().getBinding("items").filter([oFilter]);
    	        },
    	        confirm: [this._handleClose, this],
    	        cancel: [this._handleClose, this]
    	    });
    	    _valueHelpSelectDialog.setModel(stateListSetJModel);
    	    _valueHelpSelectDialog.open();
    	},
    	
    	_handleClose: function(oEvent) {
    	    var oSelectedItem = oEvent.getParameter("selectedItem");
    	    if (oSelectedItem) {
    	    	this.State = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
    	    	this.getView().byId("idDistrict").setEnabled(true);
    	    	this.getView().byId("idDistrict").setValue(" ");
    	    	this.getView().byId("idLocation").setValue(" ");
    	        this.getView().byId("idState").setValue(oSelectedItem.getTitle());
    	        this.bindDistrictData(this.State);
    	    }      
    	},
//    	end state

//     start district	
		onDistrictHelp: function(oEvt) {
			var oViewObj = this.getView();
			var districtListSetJModel = oViewObj.getModel("districtListSetJModel");
			this._onDistrictCodeHelp();
		},     	
		_onDistrictCodeHelp: function(oController) {
			if (!this._onDistrictHelpDialog) {
				this._onDistrictHelpDialog = sap.ui.xmlfragment(
					"com.acute.ticketZTicket.view.District", this);
				this.getView().addDependent(this._onDistrictHelpDialog);
			}
			// open value help dialog
			this._onDistrictHelpDialog.open();
		}, 
		_DistrictClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				//Fetching the selected value
			 	this.getView().byId("idLocation").setEnabled(true);
			 	this.getView().byId("idLocation").setValue(" ");
				this.getView().byId("idDistrict").setValue(oSelectedItem.getTitle());
			
			}
			evt.getSource().getBinding("items").filter([]);
		},
		
		_DistrictSearch: function(evt) {
			var sValue = evt.getParameter("value");
            var oFilter = new sap.ui.model.Filter("District",sap.ui.model.FilterOperator.Contains,sValue);
            evt.getSource().getBinding("items").filter([oFilter]);
		}, 
// End district		
    	
    	onFranch:function(){
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
      
    	},
    	
    	
    	
onDelarCodeType:function(){
	 var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpDealerSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
 var _valueHelpDealertDialog = new sap.m.SelectDialog({
 	
     title: "Dealer Code",
     items: {
         path: "/d/results",
         template: new sap.m.StandardListItem({
             title: "{name1}",
             description : "{kunnr}",
             customData: [new sap.ui.core.CustomData({
                 key: "Key",
                 value: "{kunnr}"
             })],
            
         }),
     },
     liveChange: function(oEvent) {
         var sValue = oEvent.getParameter("value");
         var oFilter = new sap.ui.model.Filter("name1",sap.ui.model.FilterOperator.Contains,sValue);
         var oFilter2 = new sap.ui.model.Filter("kunnr",sap.ui.model.FilterOperator.Contains,sValue);
         
         var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
         oEvent.getSource().getBinding("items").filter([oFilter1]);
     },
     confirm: [this._handleDealerClose, this],
     cancel: [this._handleDealerClose, this]
 });
 _valueHelpDealertDialog.setModel(jModel);
 _valueHelpDealertDialog.open();	
		},
		_handleDealerClose: function(oEvent) {
    	    var oSelectedItem = oEvent.getParameter("selectedItem");
    	    if (oSelectedItem) {
    	    	this.Dealer = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
    	        this.getView().byId("idDealCodeInput").setValue(oSelectedItem.getDescription());
    	        this.getView().byId("idDealDescInput").setValue(oSelectedItem.getTitle());
    	    }      
    	},
    	
    	
		onTypeofCustomer:function(){
			//Method for setting the model for vehicle type
            var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TypeOfCustomerSet";
	 		var jModel = new sap.ui.model.json.JSONModel();
	 		jModel.loadData(sPath, null, false,"GET",false, false, null);
	 		var  loc= this.getView().byId("idCustomer");
			loc.unbindAggregation("items");
			loc.setModel(jModel);
			loc.bindAggregation("items", {
				path : "/d/results",
				template : new sap.ui.core.Item({
					key : "{Type}",
					text : "{Description}"
				})
			}); 		
			
		
		},
		
		NumberValid : function(oEvent)
		{ 
			var val = oEvent.getSource().getValue();
			if(val){
				if(isNaN(val)){
					val = val.substring(0, val.length - 1);
					oEvent.getSource().setValue(val);
					
				}
			}
		},
		
		
		NumberValidOpenTicket : function(oEvent)
		{ 
			var that=this;
			var val = oEvent.getSource().getValue();
			if(val){
				if(isNaN(val)){
					val = val.substring(0, val.length - 1);
					oEvent.getSource().setValue(val);
					
				}
			}
			
			if (val.length == '10'){
				debugger
			var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel( sServiceUrl);
			oReadModel.setHeaders({
			        "Content-Type": "application/atom+xml"
			        });
			 
		     var fncSuccess = function(oData, oResponse) //success function 
		      {
		    	 debugger
		         if(oData.Flag=="X"){
		             sap.m.MessageBox.show(oData.Message, {
		                title: "Last Ticket Detail",
		                icon:sap.m.MessageBox.Icon.SUCCESS,
		            onClose:function(){
		            	that.getView().byId("idphone2").setValue(oData.ITelf2);     
		            	that.getView().byId("idFname").setValue(oData.Fname);   
		            	that.getView().byId("idLname").setValue(oData.Lname);   
		            	that.getView().byId("idAdd1").setValue(oData.Addr1);   
		            	that.getView().byId("idAdd2").setValue(oData.Addr2);   
		            	that.getView().byId("idState").setValue(oData.Bezei);   
		            	that.State = oData.Region;
		            	that.getView().byId("idDistrict").setValue(oData.City2);   
		            	that.getView().byId("idDistrict").setEnabled(true);
		    			that.getView().byId("idLocation").setEnabled(true);
		            	that.getView().byId("idLocation").setValue(oData.City1);   
		            	that.getView().byId("idEmail").setValue(oData.Email);   
			             }
		              });
		           }
		      }		
		     var fncError = function(oError) {} //error callback function
			       
		    oReadModel.read("/CustomerSet(ITelf1='" + val + "')", {
		        success: fncSuccess,
		        error: fncError
		      });
		    
			}
		},
		
		
		YearValid : function(oEvent)
		{ 
			debugger
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
		
/*		else if(y.length != 4 && y.length != 0){
			sap.m.MessageToast.show("Invalid Year");
			oEvent.getSource().setValue();
		}	*/
		

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
		
		validateChar : function( oEvent ){
			var text     = oEvent.getSource().getValue();
			var reg      = /^[a-z A-Z]+$/;
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
		
		
		
		onFitmentType:function(){
			//Method for setting the model for Fitment Type
            var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
	 		var jModel = new sap.ui.model.json.JSONModel();
	 		jModel.loadData(sPath, null, false,"GET",false, false, null);
	 		var  loc= this.getView().byId("idFitment");
			loc.unbindAggregation("items");
			loc.setModel(jModel);
			loc.bindAggregation("items", {
				path : "/d/results",
				template : new sap.ui.core.Item({
					key : "{Type}",
					text : "{Description}"						
				})
			});
		},
		
		
/*		{
			sap.m.MessageToast.show("Phone No. can not be less than 10 digits"); 
			this.getView().byId("idPhone1").setValueState(sap.ui.core.ValueState.Error);
			return
		}
		else {
			this.getView().byId("idPhone1").setValueState(sap.ui.core.ValueState.None);
		}*/
		
	 	onchangepurdt:function(){
	 		debugger
	 	 var p = this.getView().byId("idDtTyreInput");	
	 	 var temp = p.getDateValue();
	 	 var tdate = new Date();
	 	 var tdt1 = tdate.setHours(0,0,0,0);
	 	 var tdt2 = temp.setHours(0,0,0,0);
	 	 if (tdt2 > tdt1){
	 		sap.m.MessageToast.show("Purcahse Date can not be greater than current date"); 
	 		p.setValue(""); 
	 		this.getView().byId("idDtTyreInput").setValueState(sap.ui.core.ValueState.Error);
			return
	 	 }
	 	 else {
	 		this.getView().byId("idDtTyreInput").setValueState(sap.ui.core.ValueState.None);
	 	  }
	 	 }, 
		
/*		onTyreCondition:function(sType){
			debugger
			//Method for setting the model for probable condition
            var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TyreConditionSet?$filter=Type eq '" + sType + "'";
	 		var jModel = new sap.ui.model.json.JSONModel();
	 		jModel.loadData(sPath, null, false,"GET",false, false, null);
	 		var  loc= that.getView().byId("idCondition");
			loc.unbindAggregation("items");
			loc.setModel(jModel);
			loc.bindAggregation("items", {
				path : "/d/results",
				template : new sap.ui.core.Item({
					key : "{Condition}",
					text : "{Description}"
				})
			});
		},*/
//***********************			
			onTicketSource:function(){
				//Method for setting the model for ticket source
	            var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketSourceSet";
		 		var jModel = new sap.ui.model.json.JSONModel();
		 		jModel.loadData(sPath, null, false,"GET",false, false, null);
		 		var  loc= this.getView().byId("idTicketSource");
				loc.unbindAggregation("items");
				loc.setModel(jModel);
				loc.bindAggregation("items", {
					path : "/d/results",
					template : new sap.ui.core.Item({
						key : "{Code}",
						text : "{Text}"
					})
				});		
				},	 		
			
		
		
		onPress: function() {
			this.getView().byId("idPhone1").setEnabled(true);
			this.getView().byId("idphone2").setEnabled(true);
			this.getView().byId("idFname").setEnabled(true);
			this.getView().byId("idLname").setEnabled(true);
			this.getView().byId("idAdd1").setEnabled(true);
			this.getView().byId("idAdd2").setEnabled(true);
			this.getView().byId("idEmail").setEnabled(true);
			this.getView().byId("idCountry").setEnabled(true);
			this.getView().byId("idState").setEnabled(true);
			this.getView().byId("idDistrict").setEnabled(true);
			this.getView().byId("idLocation").setEnabled(true);
			this.getView().byId("idCode").setEnabled(true);
		},
		
		onEnter: function() {
		},
		
		onFitmentChange: function(oEvent) {
			var key = oEvent.mParameters.selectedItem.getKey();
			if ((key === "REP" || key === "STU" || key === "DEF")) {
				
				this.getView().byId("idVboxRep").setVisible(true);
				this.getView().byId("idVboxOem").setVisible(false);

			} else {
				this.getView().byId("idVboxRep").setVisible(false);
				this.getView().byId("idVboxOem").setVisible(true);
		
			}
			debugger
			if(key != "REP")
				{
				this.getView().byId("lblVehicleMake").setRequired(true);
				this.getView().byId("idvehicleLabel").setRequired(true);
				this.getView().byId("lblVehModel").setRequired(true);
				this.getView().byId("lblVehVariant").setRequired(true);
				this.getView().byId("lblVehKmsDone").setRequired(true);
				this.getView().byId("idpurchaseLabell").setRequired(true);
				}
			if(key == "REP")
			{
			this.getView().byId("lblVehicleMake").setRequired(false);
			this.getView().byId("idvehicleLabel").setRequired(false);
			this.getView().byId("lblVehModel").setRequired(false);
			this.getView().byId("lblVehVariant").setRequired(false);
			this.getView().byId("lblVehKmsDone").setRequired(false);
			this.getView().byId("idpurchaseLabell").setRequired(false);
			}	
			if(key == "STU")
			{
			this.getView().byId("lblVehicleMake").setRequired(true);
			this.getView().byId("idvehicleLabel").setRequired(true);
			this.getView().byId("lblVehModel").setRequired(true);
			this.getView().byId("lblVehVariant").setRequired(true);
			this.getView().byId("lblVehKmsDone").setRequired(true);
			this.getView().byId("idpurchaseLabell").setRequired(false);
			}
			
			if(key == "DEF")
			{
			this.getView().byId("lblVehicleMake").setRequired(true);
			this.getView().byId("idvehicleLabel").setRequired(true);
			this.getView().byId("lblVehModel").setRequired(true);
			this.getView().byId("lblVehVariant").setRequired(true);
			this.getView().byId("lblVehKmsDone").setRequired(true);
			this.getView().byId("idpurchaseLabell").setRequired(false);
			}
			
		},
/************EVENTS END*****************/		
		
		
		/************SEARCH HELPS BEGIN*********/
		/*Vehicle Type Search Help Begin*/
				_onVehicleTypeHelp: function(oController) {
					//method for vehicle type value help
					// create value help dialog using fragment
					if (!this._onVehicleTypeHelpDialog) {
						this._onVehicleTypeHelpDialog = sap.ui.xmlfragment(
							"com.acute.ticketZTicket.view.VehicleType", this);
						this.getView().addDependent(this._onVehicleTypeHelpDialog);
					}
					// open value help dialog
					this._onVehicleTypeHelpDialog.open();
				}, //end of onVehicleTypeHelp method
				_VehicleTypeClose: function(evt) {
					//get the selected vehicle type
					var oSelectedItem = evt.getParameter("selectedItem");
					if (oSelectedItem) {
						//Fetching the selected value
						var sType = oSelectedItem.getTitle();
						
						this.getView().byId("idVehicle").setValue(sType);
						this.getView().byId("idVehicleMake").setEnabled(true);
						/*this.onTyreCondition(sType);	*/
						
					
							debugger
							this.getView().byId("idCondition").setSelectedKey("");
							//Method for setting the model for probable condition
				            var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TyreConditionSet?$filter=Type eq '" + sType + "'";
					 		var jModel = new sap.ui.model.json.JSONModel();
					 		jModel.loadData(sPath, null, false,"GET",false, false, null);
					 		var  loc= this.getView().byId("idCondition");
							loc.unbindAggregation("items");
							loc.setModel(jModel);
							loc.bindAggregation("items", {
								path : "/d/results",
								template : new sap.ui.core.Item({
									key : "{Condition}",
									text : "{Description}"
								})
							});
								
						
						
						
					}
					evt.getSource().getBinding("items").filter([]);
				},
				_VehicleTypeSearch: function(evt) {
					//method for serach in the Vehicle type
					var sValue = evt.getParameter("value");
		            var oFilter = new sap.ui.model.Filter("Type",sap.ui.model.FilterOperator.Contains,sValue);
		            evt.getSource().getBinding("items").filter([oFilter]);
				}, //end of _VehicleTypeSearch method
				onVehicleType: function(oEvt) {
					//Method for setting the model for vehicle type
					this.VehicleType = new sap.ui.model.json.JSONModel();
					var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleTypeSet";
					this.VehicleType.loadData(oUri, null, false, "GET", false, false, null);
					this.getView().setModel(this.VehicleType, "VehicleType");
					this._onVehicleTypeHelp();
				}, //end of onVehicleType Method
		/*Vehicle Type Search Help End*/

		/*Vehicle Make Search Help Begin*/
				_onVehicleMakeHelp: function(oController) {
					//method for vehicle make value help
					// create value help dialog using fragment
					if (!this._onVehicleMakeHelpDialog) {
						this._onVehicleMakeHelpDialog = sap.ui.xmlfragment(
							"com.acute.ticketZTicket.view.VehicleMake", this);
						this.getView().addDependent(this._onVehicleMakeHelpDialog);
					}
					// open value help dialog
					this._onVehicleMakeHelpDialog.open();
				}, //end of onVehicleMakeHelp method
				_VehicleMakeClose: function(evt) {
					//get the selected vehicle make
					var oSelectedItem = evt.getParameter("selectedItem");
					if (oSelectedItem) {
						//Fetching the selected value
						var sType = oSelectedItem.getTitle();
						this.getView().byId("idVehicleMake").setValue(sType);
						this.getView().byId("idModel").setEnabled(true);
						
					}
					evt.getSource().getBinding("items").filter([]);
				},
				_VehicleMakeSearch: function(evt) {
					//method for serach in the Vehicle Make
					var sValue = evt.getParameter("value");
					var oFilter = new sap.ui.model.Filter("Make",sap.ui.model.FilterOperator.Contains,sValue);
		            evt.getSource().getBinding("items").filter([oFilter]);
				}, //end of _VehicleMakeSearch method
				
				
				onVehicleMake: function(oEvt) {
					//Method for setting the model for vehicle type
					this.VehicleMake = new sap.ui.model.json.JSONModel();
					this.type = this.getView().byId("idVehicle").getValue();
					var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleMakeSet?$filter=Type eq '" + this.type + "'";
					this.VehicleMake.loadData(oUri, null, false, "GET", false, false, null);
					this.getView().setModel(this.VehicleMake, "VehicleMake");
					this._onVehicleMakeHelp();
				}, //end of onVehicleMake Method
		/*Vehicle Make Search Help End*/

		/*Vehicle Model Search Help Begin*/
				_onVehicleModelHelp: function(oController) {
					//method for vehicle model value help
					// create value help dialog using fragment
					if (!this._onVehicleModelHelpDialog) {
						this._onVehicleModelHelpDialog = sap.ui.xmlfragment(
							"com.acute.ticketZTicket.view.VehicleModel", this);
						this.getView().addDependent(this._onVehicleModelHelpDialog);
					}
					// open value help dialog
					this._onVehicleModelHelpDialog.open();
				}, //end of onVehicleModelHelp method
				_VehicleModelClose: function(evt) {
					//get the selected vehicle model
					var oSelectedItem = evt.getParameter("selectedItem");
					if (oSelectedItem) {
						//Fetching the selected value
						var sType = oSelectedItem.getTitle();
						this.getView().byId("idModel").setValue(sType);
						this.getView().byId("idVariant").setEnabled(true);
					}
					evt.getSource().getBinding("items").filter([]);
				},
				_VehicleModelSearch: function(evt) {
					//method for serach in the Vehicle Model
					var sValue = evt.getParameter("value");
					var oFilter = new sap.ui.model.Filter("Model",sap.ui.model.FilterOperator.Contains,sValue);
		            evt.getSource().getBinding("items").filter([oFilter]);
				}, //end of _VehicleModelSearch method
				onVehicleModel: function(oEvt) {
					//Method for setting the model for vehicle type
					this.VehicleModel = new sap.ui.model.json.JSONModel();
					this.make = this.getView().byId("idVehicleMake").getValue();
					var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '" + this.type + "' and Make eq '" + this.make + "'";
					this.VehicleModel.loadData(oUri, null, false, "GET", false, false, null);
					this.getView().setModel(this.VehicleModel, "VehicleModel");
					this._onVehicleModelHelp();
				}, //end of onVehicleModel Method
				
				vehicleModelChange : function()
				{
					var modelValue = this.getView().byId("idModel").getValue();
					if(modelValue !="" && modelValue !=undefined)
						{
						this.getView().byId("idVariant").setEnabled(true);
						}
				},
		/*Vehicle Model Search Help End*/

		/*Vehicle Variant Search Help Begin*/
				_onVehicleVariantHelp: function(oController) {
					//method for vehicle variant value help
					// create value help dialog using fragment
					if (!this._onVehicleVariantHelpDialog) {
						this._onVehicleVariantHelpDialog = sap.ui.xmlfragment(
							"com.acute.ticketZTicket.view.VehicleVariant", this);
						this.getView().addDependent(this._onVehicleVariantHelpDialog);
					}
					// open value help dialog
					this._onVehicleVariantHelpDialog.open();
				}, //end of onVehicleVariantHelp method
				_VehicleVariantClose: function(evt) {
					//get the selected vehicle variant
					var oSelectedItem = evt.getParameter("selectedItem");
					if (oSelectedItem) {
						//Fetching the selected value
						var sType = oSelectedItem.getTitle();
						this.getView().byId("idVariant").setValue(sType);
					}
					evt.getSource().getBinding("items").filter([]);
				},
				_VehicleVariantSearch: function(evt) {
					//method for serach in the Vehicle Variant
					var sValue = evt.getParameter("value");
					var oFilter = new sap.ui.model.Filter("Variant",sap.ui.model.FilterOperator.Contains,sValue);
		            evt.getSource().getBinding("items").filter([oFilter]);
				}, //end of _VehicleVariantSearch method
				onVehicleVariant: function(oEvt) {
					//Method for setting the model for vehicle variant
					this.VehicleVariant = new sap.ui.model.json.JSONModel();
					this.model = this.getView().byId("idModel").getValue();
					var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleVariantSet?$filter=Type eq '" + this.type + "' and Make eq '" + this.make + "' and Model eq '" + this.model + "'";
					this.VehicleVariant.loadData(oUri, null, false, "GET", false, false, null);
					this.getView().setModel(this.VehicleVariant, "VehicleVariant");
					this._onVehicleVariantHelp();
				}, //end of onVehicleVariant Method
		/*Vehicle Variant Search Help End*/

		
		

/************SAVE BEGIN***************/

	onSave: function() {
		    
		    var check = false;

			var oFinal = {};
			oFinal.ICreate = true;
			oFinal.TicketNo = "";
			oFinal.TicketDate = null;
			oFinal.ServEngg = "";
			 
			// get all values
			oFinal.CustType 		= this.getView().byId("idCustomer").getSelectedKey();			
			oFinal.FitType 			= this.getView().byId("idFitment").getSelectedKey();
			oFinal.CtiNumber 		= this.getView().byId("idCTINumber").getValue();
			oFinal.TicketSource 	= this.getView().byId("idTicketSource").getSelectedKey();
			oFinal.CustomerTelf1 	= this.getView().byId("idPhone1").getValue();
			oFinal.CustomerTelf2 	= this.getView().byId("idphone2").getValue();
			oFinal.CustomerFname 	= this.getView().byId("idFname").getValue();
			oFinal.CustomerLname 	= this.getView().byId("idLname").getValue();
			oFinal.CustomerAddr1 	= this.getView().byId("idAdd1").getValue();
			oFinal.CustomerAddr2 	= this.getView().byId("idAdd2").getValue();
			oFinal.CustomerLand1 	= this.getView().byId("idCountry").getSelectedKey();
			oFinal.CustomerRegion 	= this.State;
			oFinal.CustomerCity2 	= this.getView().byId("idDistrict").getValue();
			oFinal.CustomerCity1 	= this.getView().byId("idLocation").getValue();
			oFinal.CustomerEmail 	= this.getView().byId("idEmail").getValue();
			oFinal.VehicleType 		= this.getView().byId("idVehicle").getValue();
			oFinal.VehicleMake 		= this.getView().byId("idVehicleMake").getValue();		
			oFinal.VehicleModel 	= this.getView().byId("idModel").getValue();			
			oFinal.VehicleVariant 	= this.getView().byId("idVariant").getValue();
			oFinal.RegNo 			= this.getView().byId("idregno").getValue();
			oFinal.ChassisNo 		= this.getView().byId("idchassisInput").getValue();
			oFinal.KmsDone 			= this.getView().byId("idHours").getValue()!=""? parseInt(this.getView().byId("idHours").getValue()):0;
			oFinal.VechPurcMonth 	= this.getView().byId("idMonth").getSelectedKey();
			oFinal.VechPurcYear 	= this.getView().byId("idYear").getValue();
			oFinal.DealerCode 		= this.Dealer;
			
			
/*			if(this.getView().byId("idDtTyreInput").getDateValue()!=null)
				{
				var s = this.getView().byId("idDtTyreInput").getValue();	
				s=s.split(".");
				oFinal.TyrePurcDate = s[2] + "-" + s[1] + "-" + s[0] + "T00:00:00";		
				}
			else
				{
				oFinal.TyrePurcDate=null;
				}*/
			
			var purcDate = this.getView().byId("idDtTyreInput").getDateValue();
			
			if(purcDate!=null)
				{
				oFinal.TyrePurcDate = this.payLoadDate(purcDate);		
				}
			else{
				oFinal.TyrePurcDate = null;
				}

				

			
			oFinal.FranhiseName 	= this.getView().byId("idFNameInput").getValue();
			oFinal.FranhiseContact 	= this.getView().byId("idFPNoInput").getValue();
			oFinal.FranhiseEmail 	= this.getView().byId("idFEmailInput").getValue();
			oFinal.FranhisePName 	= this.getView().byId("idFPNameInput").getValue();
			oFinal.FranhiseLoc 		= this.getView().byId("idFLocationInput").getValue();
			oFinal.NoOfTyres 		= this.getView().byId("idTyreInput").getValue()!=""? parseInt(this.getView().byId("idTyreInput").getValue()):0;
			oFinal.DefectiveTyres 	= this.getView().byId("idTyreInvolve").getValue()!=""? parseInt(this.getView().byId("idTyreInvolve").getValue()):0;
			oFinal.TyreDesrc 		= this.getView().byId("idText").getValue();
			oFinal.ComplDescr 		= this.getView().byId("idDescComp").getValue();
			oFinal.TyreCond 		= this.getView().byId("idCondition").getSelectedKey();
			oFinal.Remarks 			= this.getView().byId("idRemarks").getValue();
			
			
			// validation all fields 
			
			if(oFinal.CustomerTelf1.length < 10 && oFinal.CustomerTelf1.length != 0 )
			{
				sap.m.MessageToast.show("Phone No. can not be less than 10 digits"); 
				this.getView().byId("idPhone1").setValueState(sap.ui.core.ValueState.Error);
				return
			}
			else {
				this.getView().byId("idPhone1").setValueState(sap.ui.core.ValueState.None);
			}
			

			if(oFinal.CustomerTelf2.length < 10 && oFinal.CustomerTelf2.length != 0){
				sap.m.MessageToast.show("Phone No. can not be less than 10 digits"); 
				this.getView().byId("idphone2").setValueState(sap.ui.core.ValueState.Error);
				return
			}
			else {
				this.getView().byId("idphone2").setValueState(sap.ui.core.ValueState.None);
			}
			
			if(oFinal.CustomerEmail.length != 0){
				 var e= this.getView().byId("idEmail").getValue();
				 var atindex= e.indexOf('@');
				 var dotindex=e.lastIndexOf('.');
				if(atindex<1 || dotindex>=e.length-2 || dotindex-atindex<3){
				 sap.m.MessageToast.show("Invalid Email");				 
				this.getView().byId("idEmail").setValueState(sap.ui.core.ValueState.Error);
				return (false)
				}
				else {
					this.getView().byId("idEmail").setValueState(sap.ui.core.ValueState.None);
				}
			}	
			    
			debugger
				var dt = new Date();
				var mo = dt.getMonth();
				var yr = dt.getFullYear();
				if(oFinal.VechPurcYear == yr && oFinal.VechPurcMonth > mo){ 
				 sap.m.MessageToast.show("Purchase Date can not greater than current date");				 
				this.getView().byId("idMonth").addStyleClass("myStateError");
				return (false)
				}
				else {
					this.getView().byId("idMonth").removeStyleClass("myStateError");
				}
			
			
			if(oFinal.FranhiseEmail.length != 0){
				 var e= this.getView().byId("idFEmailInput").getValue();
				 var atindex= e.indexOf('@');
				 var dotindex=e.lastIndexOf('.');
				if(atindex<1 || dotindex>=e.length-2 || dotindex-atindex<3){
				 sap.m.MessageToast.show("Invalid Email");				 
				this.getView().byId("idFEmailInput").setValueState(sap.ui.core.ValueState.Error);
				return (false)
				}
				else {
					this.getView().byId("idFEmailInput").setValueState(sap.ui.core.ValueState.None);
				}
			}	
			
			if(oFinal.FranhiseContact.length < 10 && oFinal.FranhiseContact.length != 0){
				sap.m.MessageToast.show("Phone No. can not be less than 10 digits"); 
				this.getView().byId("idFPNoInput").setValueState(sap.ui.core.ValueState.Error);
				return
			}
			else {
				this.getView().byId("idFPNoInput").setValueState(sap.ui.core.ValueState.None);
			}			
		
			if(oFinal.NoOfTyres < oFinal.DefectiveTyres && oFinal.NoOfTyres != 0){
				this.getView().byId("idTyreInvolve").setValueState(sap.ui.core.ValueState.Error);
				alert("No of Tyres less than Defective tyres")
				return (false)
			}
			else {
			this.getView().byId("idTyreInvolve").setValueState(sap.ui.core.ValueState.None);	
			}				
		
			// check all mandatory fields			
			
			if(oFinal.CustType == "")
			{
		    check = true;
			this.getView().byId("idCustomer").addStyleClass("myStateError");
			}
			else {
			this.getView().byId("idCustomer").removeStyleClass("myStateError");			
			}
			
			if(oFinal.FitType == "")
			{
			check = true;
			this.getView().byId("idFitment").addStyleClass("myStateError");       
			}
			else {
			this.getView().byId("idFitment").removeStyleClass("myStateError");			
			}
			
			if(oFinal.TicketSource == "")
			{
				check = true;				
			this.getView().byId("idTicketSource").addStyleClass("myStateError");
			}
			else {
			this.getView().byId("idTicketSource").removeStyleClass("myStateError");			
			}
			
			debugger
						
			if(oFinal.CustomerTelf1 == ""){
				check = true;
				this.getView().byId("idPhone1").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
				this.getView().byId("idPhone1").setValueState(sap.ui.core.ValueState.None);			
			}			
						
			if(oFinal.CustomerFname == "")
			{
				check = true;
			this.getView().byId("idFname").setValueState(sap.ui.core.ValueState.Error);
			}	
			else {
			this.getView().byId("idFname").setValueState(sap.ui.core.ValueState.None);				
			}
			
			if(oFinal.CustomerAddr1 == "")
			{
				check = true;
			this.getView().byId("idAdd1").setValueState(sap.ui.core.ValueState.Error);
			}	
			else {
			this.getView().byId("idAdd1").setValueState(sap.ui.core.ValueState.None);			
			}
			
			debugger
			if(oFinal.CustomerRegion == "" || oFinal.CustomerRegion == undefined )
			{
				check = true;
			this.getView().byId("idState").setValueState(sap.ui.core.ValueState.Error);	
			}	
			else {
			this.getView().byId("idState").setValueState(sap.ui.core.ValueState.None);				
			}
			
			if(oFinal.CustomerCity2 == "")
			{
				check = true;
			this.getView().byId("idDistrict").setValueState(sap.ui.core.ValueState.Error);	
			}	
			else {
			this.getView().byId("idDistrict").setValueState(sap.ui.core.ValueState.None);			
			}

			if(oFinal.CustomerCity1 == "")
			{
				check = true;
			this.getView().byId("idLocation").setValueState(sap.ui.core.ValueState.Error);		
			}
			else {
			this.getView().byId("idLocation").setValueState(sap.ui.core.ValueState.None);			
			}	
			
	
/*			oFinal.CustomerPstlz = this.getView().byId("idCode").getValue();	
			this.getView().byId("idCode").setValueState(sap.ui.core.ValueState.None);
			if(oFinal.CustomerPstlz.length < 6 && oFinal.CustomerPstlz.length != 0)
			{
			this.getView().byId("idCode").addStyleClass("myStateError");
			}	*/

			if(oFinal.VehicleType == "")
			{
				check = true;
			this.getView().byId("idVehicle").setValueState(sap.ui.core.ValueState.Error);
			}	
			else {
			this.getView().byId("idVehicle").setValueState(sap.ui.core.ValueState.None);			
			}			
			
			if(oFinal.FitType != "REP" && oFinal.VehicleMake == "" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idVehicleMake").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idVehicleMake").setValueState(sap.ui.core.ValueState.None);				
			}			

			if(oFinal.FitType != "REP" && oFinal.VehicleModel == "" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idModel").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idModel").setValueState(sap.ui.core.ValueState.None);				
			}

			if(oFinal.FitType != "REP" && oFinal.VehicleVariant == "" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idVariant").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idVariant").setValueState(sap.ui.core.ValueState.None);				
			}			

			if(oFinal.FitType != "REP" && oFinal.RegNo == "" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idregno").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idregno").setValueState(sap.ui.core.ValueState.None);				
			}							

			if(oFinal.FitType != "REP" && oFinal.KmsDone == "" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idHours").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idHours").setValueState(sap.ui.core.ValueState.None);				
			}	
			
			
			debugger
			if(oFinal.FitType != "REP" && oFinal.VechPurcMonth == "0" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idMonth").addStyleClass("myStateError");
			}
			else {
			this.getView().byId("idMonth").removeStyleClass("myStateError");				
			}				
			
			if(oFinal.FitType != "REP" && oFinal.VechPurcYear == "" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.None);				
			}	
			
			
			if(oFinal.FitType == "STU" && oFinal.VechPurcMonth == "0" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idMonth").removeStyleClass("myStateError");
			}
			
			if(oFinal.FitType == "STU" && oFinal.VechPurcMonth == "0" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.None);
			}
			
			
			
			
			if(oFinal.FitType == "DEF" && oFinal.VechPurcYear == "" && oFinal.FitType != "")
			{
				check = true;
			this.getView().byId("idYear").setValueState(sap.ui.core.ValueState.None);
			}
			
			if(oFinal.FitType == "DEF" && oFinal.VechPurcYear == "" && oFinal.FitType != "")
			{
				check = true;
				this.getView().byId("idMonth").removeStyleClass("myStateError");
			}
			
			
			
			if(oFinal.FitType == "OEM" && oFinal.FranhiseName == "")
			{
				check = true;
			this.getView().byId("idFNameInput").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idFNameInput").setValueState(sap.ui.core.ValueState.None);				
			}			
			
			if(oFinal.FitType == "OEM" && oFinal.FranhiseLoc == "")
			{
				check = true;
			this.getView().byId("idFLocationInput").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idFLocationInput").setValueState(sap.ui.core.ValueState.None);			
			}	
			
			if(oFinal.FitType == "OEM" && oFinal.FranhisePName == "" && oFinal.CustType == "03")
			{
				check = true;
			this.getView().byId("idFPNameInput").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idFPNameInput").setValueState(sap.ui.core.ValueState.None);			
			}
			
			if(oFinal.FitType == "OEM" && oFinal.FranhiseEmail == "" && oFinal.CustType == "03")
			{
				check = true;
			this.getView().byId("idFEmailInput").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idFEmailInput").setValueState(sap.ui.core.ValueState.None);			
			}
			
			if(oFinal.FitType == "OEM" && oFinal.FranhiseContact == "" && oFinal.CustType == "03")
			{
				check = true;
			this.getView().byId("idFPNoInput").setValueState(sap.ui.core.ValueState.Error);
			}
			else {
			this.getView().byId("idFPNoInput").setValueState(sap.ui.core.ValueState.None);			
			}
			
			
			
						
			if(oFinal.DefectiveTyres == "")
			{
				check = true;
			this.getView().byId("idTyreInvolve").setValueState(sap.ui.core.ValueState.Error);
			}	
			else {
			this.getView().byId("idTyreInvolve").setValueState(sap.ui.core.ValueState.None);		
			}
            
			debugger
			if (check == true){
				sap.m.MessageBox.show("Please fill all Required Fields.", {
                title: "ERROR",
                icon:sap.m.MessageBox.Icon.ERROR,
				});
				return;
			}
		    
			
			
			
/*			oFinal.IValidation = false;
			oFinal.EError = false;
			oFinal.EMessage = "";*/
/*			sap.m.MessageBox.show("Please Fill All Fields.", {
                title: "ERROR",
                icon:sap.m.MessageBox.Icon.ERROR,
            });*/
			
			
			var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
			var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel1.setHeaders({
				"Content-Type": "application/atom+xml"
				});
			var fncSuccess = function(oData, oResponse) //sucess function 
				{
				sap.m.MessageBox.show("Ticket:"+oData.ETicketNo+" Created", {
                    title: "Success",
                    icon:sap.m.MessageBox.Icon.SUCCESS,
                    onClose:function(){
                    	window.history.back();
                    }
                });
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
			oCreateModel1.create("/ModifyTicketSet", oFinal, {
				success: fncSuccess,
				error: fncError
			});
	},
//	image upload
	onChangeCamera : function(oEvt){
        var oFileUploader = oEvt.getSource();
        var aFiles=oEvt.getParameters().files;
        var currentFile = aFiles[0];
        this.getView().getController().resizeAndUpload(currentFile,{
          	  success:function(oEvt){
          		  oFileUploader.setValue("");
          		  //Here the image is on the backend, so i call it again and set the image
          	  },
          	  error:function(oEvt){
          		
          	  }
            });
        },
        resizeAndUpload : function (file,mParams) {
        	var that=this;
            var reader = new FileReader();
            reader.onerror = function (e) {}
            reader.onloadend = function() {
//                	var tempImg = new Image();
//            	    tempImg.src = reader.result;
//            	    tempImg.onload = function() {
            	    	that.getView().getController().uploadFile(reader.result,mParams,file);
//            	    }
                }
            reader.readAsDataURL(file);
    },
    uploadFile: function (dataURL,mParams,file){
    	that1.uploadDetails= {};
    	var that= this;
    	var xhr = new XMLHttpRequest();
    	var BASE64_MARKER = 'data:' + file.type + ';base64,';
    	var base64Index = dataURL.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    	var base64string = dataURL.split(",")[1];

        xhr.onreadystatechange = function(ev){
        	if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)){
        		mParams.success(ev);
        		
        		var prop = xhr.responseXML.getElementsByTagName("entry")[0].getElementsByTagName("m:properties")[0];
        		var error = prop.getElementsByTagName("d:Error")[0].innerHTML;
        		var errMsg = prop.getElementsByTagName("d:Message")[0].innerHTML;
        		if(error == "X"){
        			sap.m.MessageBox.alert(errMsg);
        			return false;
        		}else{
        			that1.uploadDetails.UpfileName = prop.getElementsByTagName("d:FileName")[0].innerHTML;
        			that1.uploadDetails.fileString = prop.getElementsByTagName("d:FileString")[0].innerHTML;
        		}
        		
        		
        	}else if(xhr.readyState == 4){
        		mParams.error(ev);
        	}
        };
        var csrf = that.getCSRFToken();
        var fileName = (file.name==="image.jpeg")?"image_"+new Date().getTime()+".jpeg":file.name;
        xhr.open('POST', "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketImageUploadSet", true);
        xhr.setRequestHeader("Content-type",file.type);//"application/x-www-form-urlencoded");
//        xhr.setRequestHeader("x-csrf-token", oView.getModel().getHeaders()['x-csrf-token']);
        xhr.setRequestHeader("x-csrf-token", that.token);
        xhr.setRequestHeader("slug",fileName);
        var data = base64string;
        xhr.send(data);
    },
    getCSRFToken: function() {	
    	var that=this;
//    	this.token="";
    	$.ajax({	url: "/sap/opu/odata/sap/ZCS_TICKET_SRV/",	type: "GET",	async: false,	
    		beforeSend: function(xhr) { 
    			xhr.setRequestHeader("X-CSRF-Token", "Fetch");	
    		},
    		complete: function(xhr) {	
    			that.token = xhr.getResponseHeader("X-CSRF-Token");	
//    		return token;
    		}
    	});
    },
    onTypeMissmatch: function(oEvent){
    	sap.m.MessageBox.alert("Please select Valid File format (DOC, PDF, JPEG)");
    	return false;
    }

	
/************SAVE END***************/	
	});
});


