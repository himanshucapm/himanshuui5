var loc;
sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	"zwarrantyreport/util/Formatter"
	
	
], function(MessageBox,Fragment,Controller, JSONModel,MessageToast,Formatter) {
	"use strict";
		var that
return sap.ui.controller("zwarrantyreport.view.View1", {
	 onInit: function() {
			that= this;	
			that.onTicketSource();
			if (!jQuery.support.touch){
				    this.getView().addStyleClass("sapUiSizeCompact");
				    var iOriginalBusyDelay,
					oViewJModel = new sap.ui.model.json.JSONModel({
						busy: false,
						delay: 0
					});
				this.getView().setModel(oViewJModel, "oViewJModel");	
						}
		
					var tableid = this.getView().byId("idTable");
					var ListSetJModel = tableid.getModel();
					
					
					if(!ListSetJModel){
						ListSetJModel = new sap.ui.model.json.JSONModel();
						tableid.setModel(ListSetJModel).bindRows("/");
					}
					
					
/******************************Set Initial Date In Input Field**********************************************************************/
					var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyyy"});
					var date = new Date(), y = date.getFullYear(), m=date.getMonth();
					var firstDay = new Date(y,m,1);
					var currentDate = new Date;
					
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
					this.fromDate = dateFormat.format(firstDay)+"T00:00:00";
					this.toDate = dateFormat.format(currentDate)+"T00:00:00";
					currentDate = oDateFormat.format(currentDate);
					firstDay = oDateFormat.format(firstDay);
					
					var initialDateValue = firstDay + " - "  + currentDate;
					this.getView().byId("fromDate").setValue(firstDay).setMaxDate(new Date());
					this.getView().byId("toDate").setValue(currentDate).setMaxDate(new Date());
				
/***********************************************************************************************************************************/									
					var oDatePickerHr = this.getView().byId("fromDate");
					 oDatePickerHr.addEventDelegate({
					
							onAfterRendering: function(){
						var oDateInnerHr = this.$().find('.sapMInputBaseInner');
								var oIDHr = oDateInnerHr[0].id;
								$('#'+oIDHr).attr("disabled", "disabled"); 
							}},oDatePickerHr);
					 
					 var oDatePickerHr = this.getView().byId("toDate");
					 oDatePickerHr.addEventDelegate({
					
							onAfterRendering: function(){
						var oDateInnerHr = this.$().find('.sapMInputBaseInner');
								var oIDHr = oDateInnerHr[0].id;
								$('#'+oIDHr).attr("disabled", "disabled"); 
							}},oDatePickerHr);
					
	},
/*******************************************************************************************************************/
	onSearch : function() {                                              
		debugger
		var check = false;
		var that = this;
		var date
		var custtelfno  = this.getView().byId("idCustomerno").getValue();
		var TScouce     = this.getView().byId("idTicketSource").getSelectedKey();
		
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern : "dd-MM-yyyy"});
		var fromDate    = this.getView().byId("fromDate").getValue();
		var fromSplit   = fromDate.split(".");
		var fValue      = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		var dateFrom    = fValue+"T00:00:00";
		var toDate      = this.getView().byId("toDate").getValue();		
		var toSplit     = toDate.split(".");
		var tValue      = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
		var dateTo      = tValue+"T00:00:00";	
		
		
		
		if(dateTo < dateFrom){
			sap.m.MessageToast.show("Search Begin Date Can't Be Greater Than Search End Date.");
			this.getView().byId("fromDate").setValueState("Error").setValue();
			this.getView().byId("toDate").setValueState("Error").setValue();
			return false
			}
		else{
			this.getView().byId("fromDate").setValueState("None");
			this.getView().byId("toDate").setValueState("None");
			}
		
		
		 var State; 
		 if(this.State){
			 State = this.State;
		 }else{
			 State = "";
		}  
		 var District; 
		 if(this.District){
			 District = this.District;
		 }else{
			 District = "";
		}  
			             
		 var senginer;
		 if(this.SrEnggKey){
		    senginer = this.SrEnggKey;
		}else{
		   senginer = "";
		} 
			
		var ClaimNumber; 
		 if(this.ClaimValue){
			 ClaimNumber = this.ClaimValue;
		 } else {
			 ClaimNumber = "";
		 }
		 var varticket; 
		 if(this.ticket){
		   varticket = this.ticket;
		 }else{
		  varticket = "";
		} 
		 
		var TStatus;
		if(this.ticketstatusKey){
		   TStatus = this.ticketstatusKey;
		}else{
		   TStatus = "";
		} 
		
		var TicketSource;
		if(TScouce){
			TicketSource = TScouce;
		}else {
			TicketSource = "";
		}
		
	    var tableid = this.getView().byId("idTable");      
		 debugger
		 var ListSetJModel = tableid.getModel(); 
		
		 if( TicketSource == "" && ClaimNumber == "" && varticket == "" && custtelfno == "" && senginer == ""	 && TStatus == "" && State == "" && District == "" ){
			 // && varticket == "" && custtelfno == "" && senginer == ""	 && TStatus == "" && State == "" && District == ""
	     sap.m.MessageBox.alert("Enter atleast one field.", {
					    icon: sap.m.MessageBox.Icon.WARNING,
					    title: "Error"
						}
					);
	    	   return false;
	       }
		 else{
	    	   var oViewObj = this.getView();
				var oViewJModel = oViewObj.getModel("oViewJModel");
				oViewJModel.setProperty("/delay", 0);
				oViewJModel.setProperty("/busy", true);
				oViewJModel.refresh(true);
	       }

		var sServiceUrl = "/sap/opu/odata/sap/ZCS_WCM_SRV/";
	    var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			 oReadModel.setHeaders({"Content-Type" : "application/json"});
			                           
		var fncSuccess = function(oData, oResponse){
			debugger
			var oViewObj = that.getView();
			var oViewJModel = oViewObj.getModel("oViewJModel");
			oViewJModel.setProperty("/delay", 0);
			oViewJModel.setProperty("/busy", false);
			oViewJModel.refresh(true);
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd/MM/yyyy" });   
			   ListSetJModel.setData(oData.results);
//			   var UsageTyreDetailTableCount = oData.results.length;
//			   tableid.setVisibleRowCount(UsageTyreDetailTableCount);
			   
//change code related to date using a computer date  01/01/1970
			   
			/*	for(var i=0;i<oData.results.length;i++){
					
					oData.results[i].TicketDate = dateFormat.format(new Date(oData.results[i].TicketDate));
					if(oData.results[i].TicketDate == "01/01/1970"){
						oData.results[i].TicketDate = "";
						}
					oData.results[i].ClaimDate = dateFormat.format(new Date(oData.results[i].ClaimDate));
					if(oData.results[i].ClaimDate == "01/01/1970"){
						oData.results[i].ClaimDate = "";
						}
					oData.results[i].InspDate = dateFormat.format(new Date(oData.results[i].InspDate));
					if(oData.results[i].InspDate == "01/01/1970"){
						oData.results[i].InspDate = "";
						}
					oData.results[i].DisptachDate = dateFormat.format(new Date(oData.results[i].DisptachDate));
					if(oData.results[i].DisptachDate == "01/01/1970"){
						oData.results[i].DisptachDate = "";
						}
					oData.results[i].LetterRefDt = dateFormat.format(new Date(oData.results[i].LetterRefDt));
					if(oData.results[i].LetterRefDt == "01/01/1970"){
						oData.results[i].LetterRefDt = "";
						}
					oData.results[i].AppointDate = dateFormat.format(new Date(oData.results[i].AppointDate));
					if(oData.results[i].AppointDate == "01/01/1970"){
						oData.results[i].AppointDate = "";
						}
				}*/
			 }
		
		
		 var fncError = function(oError) { // error callback
			 var oViewObj = that.getView();
				var oViewJModel = oViewObj.getModel("oViewJModel");
				oViewJModel.setProperty("/delay", 0);
				oViewJModel.setProperty("/busy", false);
				oViewJModel.refresh(true);
		 }
		//var path = "/WCMReportSet?$filter=TicketNo eq '"+varticket+"' and ServEngg eq '"+senginer+"' and TicketStatus eq '"+TStatus+"'" ;
		if(dateFrom){
			var path = "WCMReportSet?$filter=ClaimNo eq '"+ClaimNumber
 					   +"' and DateFrom eq datetime'"+dateFrom
 					   +"' and DateTo eq datetime'"+dateTo
			 		   +"' and TicketNo eq '"+varticket
			 		   +"' and CustomerTelf1 eq '"+custtelfno
			 		   +"' and ServEngg eq '"+senginer
			 		   +"' and TicketSource eq '"+TScouce
			 		   +"' and CustomerCity2 eq '"+District
			 		   +"' and CustomerRegion eq '"+State
			 		   +"' and TicketStatus eq '"+TStatus+"'";
				}
		else{
			var path = "WCMReportSet?$filter=ClaimNo eq '"+ClaimNumber
	 			       +"' and DateFrom eq "+null
	 			       +" and DateTo eq "+null
	 			       +" and TicketNo eq '"+varticket
	 			       +"' and CustomerTelf1 eq '"+custtelfno
	 			       +"' and ServEngg eq '"+senginer
	 			       +"' and TicketSource eq '"+TScouce
	 			       +"' and CustomerCity2 eq '"+District
	 			       +"' and CustomerRegion eq '"+State
	 			       +"' and TicketStatus eq '"+TStatus+"'";
			}
		 oReadModel.read(path, {
			  success : fncSuccess,
			   error : fncError
			   });
	}, 					
/*************************************************************************************************************************************/
					 onClear : function()
					  {
						  debugger;
					        var tableid = this.getView().byId("idTable");
							var ListSetJModel = tableid.getModel();
							ListSetJModel.setData([]);
							ListSetJModel.refresh();
						    this.ticket = "";
					        this.getView().byId("inpTicketNo").setValue("");
					        this.getView().byId("idCustomerno").setValue("");
					        this.SrEnggKey = "";
					        this.getView().byId("idSE").setValue("");
					        this.ticketstatusKey = "";
					        this.getView().byId("idStatus").setValue("");
					        this.ClaimValue = "";
					        this.getView().byId("idClaimno").setValue("");
					      //  this.getView().byId("fromDate").setValue("");
					      //  this.getView().byId("toDate").setValue("");
					        this.getView().byId("idState").setValue("");
					        this.getView().byId("idDist").setValue("");
					        this.getView().byId("idTicketSource").setValue("");
					        sap.m.MessageToast.show("Filters Removed");
					   },
/****************************************************************************************************************************************/			
	
/*************************************************************************************************************************/	
	//number validation
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
	

/****************************************Using f4*******************************************************************/
					onTicketNoHelp : function(evt) 
					{
                   var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpTicketSet";
                   var jModel = new sap.ui.model.json.JSONModel();
                   jModel.loadData(sPath, null, false, "GET", false, false, null);
                   var _valueHelpticketnoSelectDialog = new sap.m.SelectDialog({
                   title : "Select Ticket",
                   items : 
                   {
                    path : "/d/results",
                    template : new sap.m.StandardListItem({
                    title : "{TicketNo}",
                    customData : [ new sap.ui.core.CustomData({
                     key : "{Key}",
                     value : "{TicketNo}"
                     }) ]
                     })
                   },
                   liveChange : function(oEvent) 
                   {
                         var sValue = oEvent.getParameter("value");
                         var oFilter = new sap.ui.model.Filter("TicketNo", sap.ui.model.FilterOperator.Contains, sValue);
                       /*  var oFilter2 = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue);*/
                         var oFilter1 = new sap.ui.model.Filter([oFilter],false);
                         oEvent.getSource().getBinding("items").filter([oFilter1]);    
                   },                   
                   confirm : [ this._handleticketClose, this ],
                   cancel : [ this._handleticketClose, this ]
            });
                   _valueHelpticketnoSelectDialog.setModel(jModel);
                   _valueHelpticketnoSelectDialog.open();
     },
     				_handleticketClose : function(oEvent) 
     				{
     				var oSelectedItem = oEvent.getParameter("selectedItem");
     				if (oSelectedItem) 
     				{
                   debugger                   
                   this.getView().byId("inpTicketNo").setValue(oSelectedItem.getTitle());
                   this.ticket = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
                   this.ticketno = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
                  // this.onEnter();
            }
     },
     
							onStatus : function(evt) 
							{
					       var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketStatusSet";
					       var jModel = new sap.ui.model.json.JSONModel();
					       jModel.loadData(sPath, null, false, "GET", false, false, null);
					       var _valueHelpOnStatusSelectDialog = new sap.m.SelectDialog({
					       title : "Status",
					       items : 
					       {
					        path : "/d/results",
					        template : new sap.m.StandardListItem({
					        title : "{Description}",
					        customData : [ new sap.ui.core.CustomData({
					         key : "{Status}",
					         value : "{Description}"
					         }) ]
					         })
					       },
					       liveChange : function(oEvent) 
					       {
					             var sValue = oEvent.getParameter("value");
					             var oFilter = new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue);
					          //   var oFilter2 = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue);
					             var oFilter1 = new sap.ui.model.Filter([oFilter],false);
					             oEvent.getSource().getBinding("items").filter([oFilter1]);    
					       },                   
					       confirm : [ this._handleStatusClose, this ],
					       cancel : [ this._handleStatusClose, this ]
					});
					       _valueHelpOnStatusSelectDialog.setModel(jModel);
					       _valueHelpOnStatusSelectDialog.open();
					},
								_handleStatusClose : function(oEvent) 
								{
								var oSelectedItem = oEvent.getParameter("selectedItem");
								if (oSelectedItem) 
								{
					       debugger                   
					       this.getView().byId("idStatus").setValue(oSelectedItem.getTitle());
					       this.tickets = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
					       this.ticketstatusKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
					      // this.onEnter();
					}
					},

					onServiceHelp : function(evt) 
					{
					var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/ListServiceEngineerSet";
					var jModel = new sap.ui.model.json.JSONModel();
					jModel.loadData(sPath, null, false, "GET", false, false, null);
					var _valueHelpOnServiceSelectDialog = new sap.m.SelectDialog({
					title : "Service Engineers",
					items : 
					{
					path : "/d/results",
					template : new sap.m.StandardListItem({
					title : "{SeName}",
					customData : [ new sap.ui.core.CustomData({
					 key : "{ServEngg}",
					 value : "{SeName}"
					 }) ]
					 })
					},
					liveChange : function(oEvent) 
					{
					     var sValue = oEvent.getParameter("value");
					     var oFilter = new sap.ui.model.Filter("SeName", sap.ui.model.FilterOperator.Contains, sValue);
					  //   var oFilter2 = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue);
					     var oFilter1 = new sap.ui.model.Filter([oFilter],false);
					     oEvent.getSource().getBinding("items").filter([oFilter1]);    
					},                   
					confirm : [ this._handleServiceClose, this ],
					cancel : [ this._handleServiceClose, this ]
					});
					_valueHelpOnServiceSelectDialog.setModel(jModel);
					_valueHelpOnServiceSelectDialog.open();
					},

					_handleServiceClose : function(oEvent) 
					{
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) 
					{
				       debugger                   
				       this.getView().byId("idSE").setValue(oSelectedItem.getTitle());
				       this.SrEnggValue = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
				       this.SrEnggKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
				       
		}
		},
		
		onClaimF4 : function() {
			debugger
			var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpClaimSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
					false, null);
			var _valueHelpClaimSelectDialog = new sap.m.SelectDialog(
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
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("IClaimNo",sap.ui.model.FilterOperator.Contains,sValue);
				oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
				
			confirm : [ this._handleClaimClose, this ],
			cancel : [ this._handleClaimClose, this ]
			});
			
			_valueHelpClaimSelectDialog.setModel(jModel);
			_valueHelpClaimSelectDialog.open();
			},
			
			_handleClaimClose : function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
			        if (oSelectedItem) {
			        	this.ClaimValue = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
					    this.ClaimKey = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
				        this.getView().byId("idClaimno").setValue(oSelectedItem.getTitle());
				        //this.getView().byId("idEdit").setVisible(true);
				        //this.onEnter();
			         }
             },
	
     //for busy inicator
             hideBusyIndicator : function() {
                 sap.ui.core.BusyIndicator.hide();
          },
          
          showBusyIndicator : function (iDuration, iDelay) {
                 sap.ui.core.BusyIndicator.show(iDelay);

                 if (iDuration && iDuration > 0) {
                        if (this._sTimeoutId) {
                              jQuery.sap.clearDelayedCall(this._sTimeoutId);
                              this._sTimeoutId = null;
                        }

                        this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
                              this.hideBusyIndicator();
                        });
                 }
          },
      
       
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
        		this.getView().byId("idState").setValue(oSelectedItem.getTitle());
        	//	state = oSelectedItem.getDescription();
        		this.getView().byId("idDist").setEnabled(true).setValue()
        	
        		
        	}
        },
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
        		this.District = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
        		this.getView().byId("idDist").setValue(oSelectedItem.getTitle());
        		
        	}

        },
        
 /*****************************************ticket source f4  ********************************/     
		onTicketSource:function(){
			//Method for setting the model for ticket source
            var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketSourceSet";
	 		var jModel = new sap.ui.model.json.JSONModel();
	 		jModel.loadData(sPath, null, false,"GET",false, false, null);
	 	    loc= this.getView().byId("idTicketSource");
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
			
			
/************End F4************************************************************************************/

})


});