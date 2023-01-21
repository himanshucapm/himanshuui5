sap.ui.define([
    "sap/m/MessageBox",
  "sap/ui/core/mvc/Controller",
  "com/acute/ticketZTICKETCHD/model/formatter"
], function(MessageBox,Controller,formatter) {
  "use strict";

  return Controller.extend("com.acute.ticketZTICKETCHD.controller.View1", {
	  	formatter: formatter,
    
    onInit: function() 
    {
    	
      this.flag = "D";
      this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      this.onTypeofCustomer();
      this.onTyreFitMent();
    //  this.onTyreCondition();
      this.onTicketSource();
      this.onComplainRaised();
      
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
    
    
    onnavback:function(){
      window.history.back();
    },
    onKmsMaxlength: function(evt)
    {
      var value = evt.getSource().getValue();
      if (!/^.{0,10}$/.test(value))
        {
        var val = value.substr(0,10);
        this.getView().byId("idHours").setValue(val)
        }
    },


    onTicket:function(){
         var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpTicketSet";
          var jModel = new sap.ui.model.json.JSONModel();
          jModel.loadData(sPath, null, false,"GET",false, false, null);
        var _valueHelpTicketSelectDialog = new sap.m.SelectDialog({

            title: "Select Ticket",
            items: {
                path: "/d/results",
                template: new sap.m.StandardListItem({
                    title: "{TicketNo}",
                    customData: [new sap.ui.core.CustomData({
                        key: "Key",
                        value: "{TicketNo}"
                    })],
                   
                }),
            },
            liveChange: function(oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new sap.ui.model.Filter("TicketNo",sap.ui.model.FilterOperator.Contains,sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            confirm: [this._handleTicketClose, this],
            cancel: [this._handleTicketClose, this]
        });
        _valueHelpTicketSelectDialog.setModel(jModel);
        _valueHelpTicketSelectDialog.open();
      },
      _handleTicketClose: function(oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          if (oSelectedItem) {
            this.getView().byId("idTno").setValue(oSelectedItem.getTitle());
               this.onEnter();
             }
       
      },
      
    onFranch:function(){
       var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FranchiseCompanyNameSet";
        var jModel = new sap.ui.model.json.JSONModel();
        jModel.loadData(sPath, null, false,"GET",false, false, null);
      var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({

          title: "Franchise Company",
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
   	        
   	        this.getView().byId("idFPNameInput").setValue(oSelectedItem.getTitle());
   	    }
     
   	},
    onEnter: function() {
    	debugger
    	
      var that=this;
/*    var idViewImage = this.getView().byId("idViewImage");*/
      var ticket = this.getView().byId("idTno").getValue();
      var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
      var oReadModel = new sap.ui.model.odata.ODataModel( sServiceUrl);
      oReadModel.setHeaders({
        "Content-Type": "application/atom+xml"
        });
      var fncSuccess = function(oData, oResponse) //sucess function 
      {
        var ary={"d":oData}
     /*   idViewImage.setEnabled(true);
        that.docNo = oData.Document;*/
        debugger
        
// Get Tyre conditions based on vehicle type
        var sType = oData.VehicleType;
        var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TyreConditionSet?$filter=Type eq '" + sType + "'";
        var jModl = new sap.ui.model.json.JSONModel();
        jModl.loadData(sPath, null, false,"GET",false, false, null);
        var  loc= that.getView().byId("idCondition");
        loc.unbindAggregation("items");
		loc.setModel(jModl);
		loc.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{Condition}",
				text : "{Description}"
			})
		});  
		
	/*	oFinal.VechPurcMonth 	= this.getView().byId("idMonth").getSelectedKey();*/
        
        
        var jModel = new sap.ui.model.json.JSONModel(ary);
        debugger
        that.getView().setModel(jModel , "jModel");
        that.data = jModel.getData();

      if(that.data.d.EMessage!=""){
        sap.m.MessageBox.show(that.data.d.EMessage, {
                    title: "Error",
                    icon:sap.m.MessageBox.Icon.ERROR,
                    onClose:function(){
                      //window.history.back();
                      that.flag = "C";
                      that.handleButtonPress();
                      that.getView().byId("idSave").setEnabled(false);

                    }
                });
      }else{
        that.getView().byId("Change_Id").setEnabled(true);
      }

        that.getView().byId("idSave").setEnabled(false);
        that.Dealer=that.data.d.DealerCode;
        that.State=that.data.d.CustomerRegion;
        that.flag="C";
        that.handleButtonPress();
        
        debugger
        var fittype = that.data.d.FitType;
		if ((fittype === "REP" || fittype === "STU" || fittype === "DEF")) {
			
			that.getView().byId("idVboxRep").setVisible(true);
			that.getView().byId("idVboxOem").setVisible(false);

		} else {
			that.getView().byId("idVboxRep").setVisible(false);
			that.getView().byId("idVboxOem").setVisible(true);
	
		}
		debugger
		if(fittype != "REP")
			{
			that.getView().byId("lblVehicleMake").setRequired(true);
			that.getView().byId("idvehicleLabel").setRequired(true);
			that.getView().byId("lblVehModel").setRequired(true);
			that.getView().byId("lblVehVariant").setRequired(true);
			that.getView().byId("lblVehKmsDone").setRequired(true);
			that.getView().byId("idpurchaseLabell").setRequired(true);
			}
		if(fittype == "REP")
		{
		that.getView().byId("lblVehicleMake").setRequired(false);
		that.getView().byId("idvehicleLabel").setRequired(false);
		that.getView().byId("lblVehModel").setRequired(false);
		that.getView().byId("lblVehVariant").setRequired(false);
		that.getView().byId("lblVehKmsDone").setRequired(false);
		that.getView().byId("idpurchaseLabell").setRequired(false);
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
    oReadModel.read("/GetTicketDataSet(ITicketNo='" + ticket + "')", {
      success: fncSuccess,
      error: fncError
    });
    },
    
    handleButtonPress: function() {
    	debugger
      if (this.flag === "C") {
    	  debugger
          this.getView().byId("idCustomer1").setEnabled(false);
          this.getView().byId("idTicketSource").setEnabled(false);
          this.getView().byId("idTkDate").setEnabled(false);
          this.getView().byId("idFitment").setEnabled(false);
          
          this.getView().byId("idCustomer").setEnabled(false);
          this.getView().byId("idPhone1").setEnabled(false);
          this.getView().byId("idFname").setEnabled(false);
          this.getView().byId("idLname").setEnabled(false);
          this.getView().byId("idEmail").setEnabled(false);
          this.getView().byId("idAdd1").setEnabled(false);
          this.getView().byId("idAdd2").setEnabled(false);
          this.getView().byId("idDistrict").setEnabled(false);
          this.getView().byId("idState").setEnabled(false);
         /* this.getView().byId("idCountry").setEnabled(false);*/
          this.getView().byId("idLocation").setEnabled(false);        
          this.getView().byId("idphone2").setEnabled(false);
          
          this.getView().byId("idVehicle").setEnabled(false);
          this.getView().byId("idVehicleMake").setEnabled(false);
          this.getView().byId("idModel").setEnabled(false);
          this.getView().byId("idVariant").setEnabled(false);
          this.getView().byId("idMonth").setEnabled(false);
          this.getView().byId("idYear").setEnabled(false);
          this.getView().byId("idregno").setEnabled(false);  
          this.getView().byId("idHours").setEnabled(false);
          this.getView().byId("idchassisInput").setEnabled(false); 
          
          this.getView().byId("idFPNameInput").setEnabled(false);
          this.getView().byId("idFNameInput").setEnabled(false);
          this.getView().byId("idFPNoInput").setEnabled(false);
          this.getView().byId("idFEmailInput").setEnabled(false);
          this.getView().byId("idFLocationInput").setEnabled(false);        
          
          this.getView().byId("idTyreInput").setEnabled(false);
          this.getView().byId("idTyreInvolve").setEnabled(false);        
          this.getView().byId("idCondition").setEnabled(false);
          this.getView().byId("idText").setEnabled(false);
          this.getView().byId("idDescComp").setEnabled(false);
          this.getView().byId("idRemarks").setEnabled(false);       
          this.getView().byId("idComments").setEnabled(false);  
          
          this.getView().byId("idDealCodeInput").setEnabled(false);
          this.getView().byId("idDtTyreInput").setEnabled(false);     
          debugger
          this.getView().byId("idDealDescInput").setEnabled(false);  
          
          this.getView().byId("idSave").setEnabled(false);
        
        this.flag = "D";
        
      } else if (this.flag === "D") {
        this.flag = "C";
        
        this.getView().byId("idCustomer1").setEnabled(true);
        this.getView().byId("idTicketSource").setEnabled(true);
        this.getView().byId("idTkDate").setEnabled(false);
        this.getView().byId("idFitment").setEnabled(true);
        
        this.getView().byId("idCustomer").setEnabled(true);
        this.getView().byId("idPhone1").setEnabled(true);
        this.getView().byId("idFname").setEnabled(true);
        this.getView().byId("idLname").setEnabled(true);
        this.getView().byId("idEmail").setEnabled(true);
        this.getView().byId("idAdd1").setEnabled(true);
        this.getView().byId("idAdd2").setEnabled(true);
        this.getView().byId("idDistrict").setEnabled(true);
        this.getView().byId("idState").setEnabled(true);
/*        this.getView().byId("idCountry").setEnabled(true);*/
        this.getView().byId("idLocation").setEnabled(true);        
        this.getView().byId("idphone2").setEnabled(true);
        
        this.getView().byId("idVehicle").setEnabled(true);
        this.getView().byId("idVehicleMake").setEnabled(true);
        this.getView().byId("idModel").setEnabled(true);
        this.getView().byId("idVariant").setEnabled(true);
        this.getView().byId("idMonth").setEnabled(true);
        this.getView().byId("idYear").setEnabled(true);
        this.getView().byId("idregno").setEnabled(true);  
        this.getView().byId("idHours").setEnabled(true);
        this.getView().byId("idchassisInput").setEnabled(true); 
        
        this.getView().byId("idFPNameInput").setEnabled(true);
        this.getView().byId("idFNameInput").setEnabled(true);
        this.getView().byId("idFPNoInput").setEnabled(true);
        this.getView().byId("idFEmailInput").setEnabled(true);
        this.getView().byId("idFLocationInput").setEnabled(true);        
        
        this.getView().byId("idTyreInput").setEnabled(true);
        this.getView().byId("idTyreInvolve").setEnabled(true);        
        this.getView().byId("idCondition").setEnabled(true);
        this.getView().byId("idText").setEnabled(true);
        this.getView().byId("idDescComp").setEnabled(true);
        this.getView().byId("idRemarks").setEnabled(false);
        this.getView().byId("idComments").setEnabled(true);
        
        this.getView().byId("idDealCodeInput").setEnabled(true);
        this.getView().byId("idDtTyreInput").setEnabled(true);   
        debugger
        this.getView().byId("idDealDescInput").setEnabled(false);  
        
        this.getView().byId("idSave").setEnabled(true);
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
                 title: "{name1}"+" ("+"{kunnr}"+" )",
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
                  //this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
                this.Dealer = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
                  this.getView().byId("idDealCodeInput").setValue(oSelectedItem.getTitle());
              }
          
          },

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
        this.getView().byId("idDistrict").setValue(" ");
    	this.getView().byId("idLocation").setValue(" ");
        this.getView().byId("idState").setValue(oSelectedItem.getTitle());
      }

    },
    onTypeofCustomer: function() {

      //Method for setting the model for vehicle type
      var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TypeOfCustomerSet";
      var jModel = new sap.ui.model.json.JSONModel();
      jModel.loadData(sPath, null, false, "GET", false, false, null);
      var loc = this.getView().byId("idCustomer");
      loc.unbindAggregation("items");
      //var Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
      loc.setModel(jModel);
      loc.bindAggregation("items", {
        path: "/d/results",
        template: new sap.ui.core.Item({
          key: "{Type}",
          text: "{Description}"
        })
      });

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
    
    onTyreFitMent: function() {
      //Method for setting the model for vehicle type
      var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
      var jModel = new sap.ui.model.json.JSONModel();
      jModel.loadData(sPath, null, false, "GET", false, false, null);
      var loc = this.getView().byId("idFitment");
      loc.unbindAggregation("items");
      //var Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
      loc.setModel(jModel);
      loc.bindAggregation("items", {
        path: "/d/results",
        template: new sap.ui.core.Item({
          key: "{Type}",
          text: "{Description}"
        })
      });
    },
    
    
    //for ticket source
    onTicketSource: function() {
      //Method for setting the model for Ticket Source
      var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketSourceSet";
      var jModel = new sap.ui.model.json.JSONModel();
      jModel.loadData(sPath, null, false, "GET", false, false, null);
      var loc = this.getView().byId("idTicketSource");
      loc.unbindAggregation("items");
      //var Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
      loc.setModel(jModel);
      loc.bindAggregation("items", {
        path: "/d/results",
        template: new sap.ui.core.Item({
          key: "{Code}",
          text: "{Text}"
        })
      });
    },  
    
    //for Complain raised
    onComplainRaised: function() {
    	
      //Method for setting the model for Complain Raised type
      var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TypeOfCustomerSet";
      var jModel = new sap.ui.model.json.JSONModel();
      jModel.loadData(sPath, null, false, "GET", false, false, null);
      var loc = this.getView().byId("idCustomer1");
      loc.unbindAggregation("items");
      //var Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
      loc.setModel(jModel);
      loc.bindAggregation("items", {
        path: "/d/results",
        template: new sap.ui.core.Item({
          key: "{Type}",
          text: "{Description}"
        })
      });
    }, 
    
   
/*    onTyreCondition: function() {
   	
        //Method for setting the model for Tyre Raised Condition
        var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TyreConditionSet?$filter=Type eq '" + "" + "'";
        var jModel = new sap.ui.model.json.JSONModel();
        jModel.loadData(sPath, null, false, "GET", false, false, null);
        var loc = this.getView().byId("idCondition");
        loc.unbindAggregation("items");
        //var Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
        loc.setModel(jModel);
        loc.bindAggregation("items", {
          path: "/d/results",
          template: new sap.ui.core.Item({
            key: "{TyreCond}",
            text: "{TyreCondDescr}"
          })
        });
      }, */
    
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
    
    
	onFitmentChange: function(oEvent) {
		var key = oEvent.mParameters.selectedItem.getKey();

		this.getView().byId("idFNameInput").setValue("");
		this.getView().byId("idFPNameInput").setValue("");
		this.getView().byId("idFEmailInput").setValue("");
		this.getView().byId("idFPNoInput").setValue("");
		this.getView().byId("idFLocationInput").setValue("");
		this.getView().byId("idDealCodeInput").setValue("");
		this.getView().byId("idDtTyreInput").setValue("");
		this.getView().byId("idDealDescInput").setValue("");
		
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
	},
	
    /************SEARCH HELPS BEGIN*********/
    /*Vehicle Type Search Help Begin*/
    _onVehicleTypeHelp: function(oController) {
      //method for vehicle type value help
      // create value help dialog using fragment
      if (!this._onVehicleTypeHelpDialog) {
        this._onVehicleTypeHelpDialog = sap.ui.xmlfragment(
          "com.acute.ticketZTICKETCHD.view.VehicleType", this);
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
      var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, sValue);
      evt.getSource().getBinding("items").filter([oFilter]);
    }, //end of _VehicleTypeSearch method
    
    onVehicleType: function(oEvt) {
      //Method for setting the model for vehicle type
      this.VehicleType = new sap.ui.model.json.JSONModel();
      var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleTypeSet";
      this.VehicleType.loadData(oUri, null, false, "GET", false, false, null);
      this.getView().setModel(this.VehicleType, "VehicleType");
      this._onVehicleTypeHelp();
      //this._VehicleTypeClose();
      //this._VehicleTypeSearch();
    }, //end of onVehicleType Method
    /*Vehicle Type Search Help End*/

    /*Vehicle Make Search Help Begin*/
    _onVehicleMakeHelp: function(oController) {
      //method for vehicle make value help
      // create value help dialog using fragment
      if (!this._onVehicleMakeHelpDialog) {
        this._onVehicleMakeHelpDialog = sap.ui.xmlfragment(
          "com.acute.ticketZTICKETCHD.view.VehicleMake", this);
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
      var oFilter = new sap.ui.model.Filter("Make", sap.ui.model.FilterOperator.Contains, sValue);
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
      //      this._VehicleMakeClose();
      //      this._VehicleMakeSearch();
    }, //end of onVehicleMake Method
    /*Vehicle Make Search Help End*/

    /*Vehicle Model Search Help Begin*/
    _onVehicleModelHelp: function(oController) {
      //method for vehicle model value help
      // create value help dialog using fragment
      if (!this._onVehicleModelHelpDialog) {
        this._onVehicleModelHelpDialog = sap.ui.xmlfragment(
          "com.acute.ticketZTICKETCHD.view.VehicleModel", this);
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
      var oFilter = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sValue);
      evt.getSource().getBinding("items").filter([oFilter]);
    }, //end of _VehicleModelSearch method
    onVehicleModel: function(oEvt) {
      //Method for setting the model for vehicle type
      this.VehicleModel = new sap.ui.model.json.JSONModel();
      this.make = this.getView().byId("idVehicleMake").getValue();
      var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '" + this.type + "' and Make eq '" + this.make +
        "'";
      this.VehicleModel.loadData(oUri, null, false, "GET", false, false, null);
      this.getView().setModel(this.VehicleModel, "VehicleModel");
      this._onVehicleModelHelp();
      //      this._VehicleModelClose();
      //      this._VehicleModelSearch();
    }, //end of onVehicleModel Method
    /*Vehicle Model Search Help End*/

    /*Vehicle Variant Search Help Begin*/
    _onVehicleVariantHelp: function(oController) {
      //method for vehicle variant value help
      // create value help dialog using fragment
      if (!this._onVehicleVariantHelpDialog) {
        this._onVehicleVariantHelpDialog = sap.ui.xmlfragment(
          "com.acute.ticketZTICKETCHD.view.VehicleVariant", this);
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
      var oFilter = new sap.ui.model.Filter("Variant", sap.ui.model.FilterOperator.Contains, sValue);
      evt.getSource().getBinding("items").filter([oFilter]);
    }, //end of _VehicleVariantSearch method
    onVehicleVariant: function(oEvt) {
      //Method for setting the model for vehicle variant
      this.VehicleVariant = new sap.ui.model.json.JSONModel();
      this.model = this.getView().byId("idModel").getValue();
      var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleVariantSet?$filter=Type eq '" + this.type + "' and Make eq '" + this.make +
        "' and Model eq '" + this.model + "'";
      this.VehicleVariant.loadData(oUri, null, false, "GET", false, false, null);
      this.getView().setModel(this.VehicleVariant, "VehicleVariant");
      this._onVehicleVariantHelp();
      //      this._VehicleVariantClose();
      //      this._VehicleVariantSearch();
    }, //end of onVehicleVariant Method
    /*Vehicle Variant Search Help End*/

    /*Vehicle Type Search Help Begin*/
    _onDistrictCodeHelp: function(oController) {
      //method for vehicle type value help
      // create value help dialog using fragment
      if (!this._onDistrictHelpDialog) {
        this._onDistrictHelpDialog = sap.ui.xmlfragment(
          "com.acute.ticketZTICKETCHD.view.District", this);
        this.getView().addDependent(this._onDistrictHelpDialog);
      }
      // open value help dialog
      this._onDistrictHelpDialog.open();
    }, //end of onVehicleTypeHelp method
    _DistrictClose: function(evt) {
      //get the selected vehicle type
      var oSelectedItem = evt.getParameter("selectedItem");
      if (oSelectedItem) {
        //Fetching the selected value
        var sType = oSelectedItem.getTitle();
      /*  this.District = evt.getParameter("selectedItem").getCustomData()[0].getValue();*/
        this.getView().byId("idDistrict").setValue(sType);
        this.getView().byId("idLocation").setValue(" ");

      }
      evt.getSource().getBinding("items").filter([]);
    },
    _DistrictSearch: function(evt) {
      //method for serach in the Vehicle type
      var sValue = evt.getParameter("value");
      var oFilter = new sap.ui.model.Filter("District", sap.ui.model.FilterOperator.Contains, sValue);
      evt.getSource().getBinding("items").filter([oFilter]);
    }, //end of _VehicleTypeSearch method
    onDistrictHelp: function(oEvt) {
      //Method for setting the model for vehicle type
      this.District = new sap.ui.model.json.JSONModel();
      var oUri = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + this.State + "'";
      this.District.loadData(oUri, null, false, "GET", false, false, null);
      this.getView().setModel(this.District, "District");
      this._onDistrictCodeHelp();
      //this._VehicleTypeClose();
      //this._VehicleTypeSearch();
    }, //end of onVehicleType Method
    /*Vehicle Type Search Help End*/
    /************SEARCH HELPS END*********/

      checkRequired: function () {
    var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
    this.bValidationError = false;
    if(this.getView().byId("idCustomer").getSelectedKey() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idPhone1").getValue() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idFname").getValue() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idVehicle").getValue() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idVehicleMake").getValue() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idModel").getValue() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idVariant").getValue() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idTyreInput").getValue() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idTyreInvolve").getValue() === ""){
      this.bValidationError = true;
    }

//    else if(this.getView().byId("idFitment").getSelectedKey() === ""){
//      this.bValidationError = true;
//    }
//    else if(this.getView().byId("idCondition").getSelectedKey() === ""){
//      this.bValidationError = true;
//    }
//    else if(this.getView().byId("idCity").getValue() === ""){
//      this.bValidationError = true;
//    }
    else if(this.getView().byId("idDistrict").getValue() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idState").getValue() === ""){
      this.bValidationError = true;
    }else if(this.getView().byId("idCountry").getSelectedKey() === ""){
      this.bValidationError = true;
    }
      // output result
      if (!this.bValidationError) {
        var tyres=this.getView().byId("idTyreInput").getValue();
        var compliant=this.getView().byId("idTyreInvolve").getValue()
          if(parseInt(compliant)>parseInt(tyres)){
            this.bValidationError = true
            sap.m.MessageBox.show("Tyres Under Complaint cant be more than Number of Tyres", {
                  icon: sap.m.MessageBox.Icon.ERROR,
                  title: "Error",
                  styleClass: bCompact ? "sapUiSizeCompact" : "",
                  actions: [sap.m.MessageBox.Action.CLOSE]
                });  
          }
      } else {
          sap.m.MessageBox.show(
          this.oBundle.getText("required"), {
            icon: sap.m.MessageBox.Icon.ERROR,
            title: "Error",
            styleClass: bCompact ? "sapUiSizeCompact" : "",
            actions: [sap.m.MessageBox.Action.CLOSE]
          });
      }
  },
  DateCheck:function(Date1){
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
  },
  DateNew:function(oDate){
     if(oDate!=null){
//            var sFinalDate = oDate;
//            var sFinalNumber = sFinalDate.replace(/[^0-9]+/g,'' );
//            var iFinalNumber = sFinalNumber * 1; //trick seventeen
//            sFinalDate = new Date(iFinalNumber);
//            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
//            pattern: "yyyy-MM-dd'T'HH:mm:ss"
//          });
          var sDate = this.DateCheck(new Date(oDate))
          return sDate;
            }else{
              return null;
            }

  },
  
  
 /*****************************/
  /************SAVE BEGIN***************/

	onSave: function() {		
		debugger    
		    var check = false;

			var oFinal = {};
			oFinal.ICreate = true;
			oFinal.TicketNo = this.getView().byId("idTno").getValue();
			oFinal.TicketDate = null;
			oFinal.ServEngg = "";
			
			// get all values
			oFinal.CustType 		= this.getView().byId("idCustomer").getSelectedKey();			
			oFinal.FitType 			= this.getView().byId("idFitment").getSelectedKey();
			oFinal.TicketSource 	= this.getView().byId("idTicketSource").getSelectedKey();
			oFinal.CtiNumber 	    = this.getView().byId("idCTINumber").getValue();
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
			
/*			if(this.getView().byId("idDtTyreInput").getDateValue()!=null){
				var s = this.getView().byId("idDtTyreInput").getValue();	
				s=s.split(".");
				oFinal.TyrePurcDate = s[2] + "-" + s[1] + "-" + s[0] + "T00:00:00";		
			}else{
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
			oFinal.Comments 			= this.getView().byId("idComments").getValue();
			
			
			
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
				var mn = oFinal.VechPurcMonth;
				mn.replace(/^0+/, '');
				if(oFinal.VechPurcYear == yr && mn > mo){ 
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
			if(oFinal.FitType != "REP" && oFinal.VechPurcMonth == "00" && oFinal.FitType != "")
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
		    

			
			var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
			var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel1.setHeaders({
				"Content-Type": "application/atom+xml"
				});
			var fncSuccess = function(oData, oResponse) //sucess function 
				{
				debugger
				sap.m.MessageBox.show("Ticket:"+oData.ETicketNo+" Updated Successfully", {
                  title: "Success",
                  icon:sap.m.MessageBox.Icon.SUCCESS,
                  onClose:function(){
                  	window.history.back();
                  }
              });
				}
		var fncError = function(oError) { //error callback function
			debugger
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
	onViewImage: function(){	
		var sPathPdfGetListSet = "/TicketImageChangeSet('"+this.docNo+"')/$value";
		var frameworkODataModel = this.getOwnerComponent().getModel();
//		var modelServiceUrl = frameworkODataModel.sServiceUrl;
		var modelServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV";
		var origin = window.location.origin;
		var downloadURL = origin + modelServiceUrl + sPathPdfGetListSet ;
		sap.m.URLHelper.redirect(downloadURL, true);
		
	}
/************SAVE END***************/	
  
 /****************************/ 
  
  });
});