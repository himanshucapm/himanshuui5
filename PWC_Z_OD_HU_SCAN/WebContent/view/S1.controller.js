jQuery.sap.require("sap.ui.core.mvc.Controller");
//jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("com.acute.ticketReSn.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var DataArticles,that;
sap.ui.core.mvc.Controller.extend("com.acute.ticketReSn.view.S1", {
	
  onInit: function(){ 
      //this.newBusy = new sap.m.BusyDialog();
      //this.newBusy.open();      

	  this.model  = this.getOwnerComponent().getModel();
     
      that=this;
     
      if(!jQuery.support.touch){
        this.getView().addStyleClass("sapUiSizeCompact");
      }
      if(sap.ui.Device.system.desktop)
      {
        
      } 
      this.onComplainRaised();
      this.onTicketSource();
      this.onTyreFitMent();
   
        
    },
    OnSingleSelect:function(){
    	this.getView().byId("IdSearch").setVisible(true).setValue();
    	this.getView().byId("idPanel2").setVisible(false);
    	this.getView().byId("idPanel1").setExpanded(true);
    	this.getView().byId("Id_bt2").setVisible(false);
    	
    	
    	
    },
    
    //display complaind raised
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
 
      
      //for ticket source
      onTicketSource: function() {
    	  debugger
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
              
      
   /* **************/
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
  	    	this.getView().byId("IdSearch").setValue(oSelectedItem.getTitle());
     	     this.onEnter(oSelectedItem.getTitle());
     	    this.getView().byId("Id_bt1").setVisible(true);
     	    this.getView().byId("idPanel3").setVisible(true);
     	     }    
  	},
  	
    OnUnassigned:function(){
    	this.getView().byId("IdSearch").setVisible(false).setValue();
    	this.getView().byId("idPanel2").setVisible(true);
    	this.getView().byId("idPanel1").setExpanded(false);
    	this.getView().byId("Id_bt1").setVisible(false);
    	this.getView().byId("Id_bt2").setVisible(true);
    	this.getView().byId("idPanel3").setVisible(false);
    	
    	that.model.read("/GetUnassignedTicketsSet", null , null , false, function(oData, oResponse) {
    		var oTable=that.getView().byId("tblDetail");
    		var unassignedModel = new sap.ui.model.json.JSONModel(oData.results);
    		that.getView().byId("ID_Name").setText("Un-Assigned Tickets"+" ("+oData.results.length+")")
        	oTable.unbindAggregation("items");
            oTable.setModel(unassignedModel);
        	oTable.bindAggregation("items", {
        	        path: "/",
        	        template: new sap.m.ColumnListItem({
        	            cells: [new sap.m.Link({
        	                text: "{TicketNo}",press:[that.UnAssignDetail,that],
        	            }), new sap.m.Text({
        	                text: "{path:'TicketDate',formatter:'com.acute.ticketReSn.util.Formatter.date1'}",
        	            }), new sap.m.Text({
        	                text: "{CustTypeDesc}",
        	            }), new sap.m.Text({
        	                text: "{CustomerTelf1}",        	                
        	            }), new sap.m.Text({
        	                text: "{CustomerFname}"+"    "+ "{CustomerLname}",
        	            }) ],
        	        	//type:"Navigation"
        	        })
        	  })
        
      
      },function(err) {
	    	var errmsg = JSON.parse(err.response.body).error.message.value;
        sap.m.MessageBox.show(errmsg, {
            title: "Error",
            icon:sap.m.MessageBox.Icon.ERROR
        });
    });
    	
    },
    
    UnAssignDetail:function(evt){
    	debugger
    	this.getView().byId("idPanel2").setExpanded(false);
    	this.getView().byId("idPanel3").setExpanded(true);    	
    	this.getView().byId("idPanel3").setVisible(true);
    	
    	debugger
    	this.onEnter(evt.getSource().getBindingContext().getObject().TicketNo);
    	
    },
    onExit:function(){
      
    },

  OnticketSearch : function(oEvent){	
	  debugger
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

    
    onTickets: function(){
      var items=that.getView().byId("tblDetail").getSelectedItems();
      
		if(items.length!=0){
		 that.model.read("/ListServiceEngineerSet", null , null , false, function(oData, oResponse) {
			 var jModel = new sap.ui.model.json.JSONModel(oData.results);	
			 var _valueHelpSelectDialog = new sap.m.SelectDialog({
			    	
			        title: "Service Engineers",
			        items: {
			            path: "/",
			            template: new sap.m.StandardListItem({
			                title: "{SeName}",
			                customData: [new sap.ui.core.CustomData({
			                    key: "Key",
			                    value: "{ServEngg}"
			                })],
			               
			            }),
			        },
			        
			        liveChange: function(oEvent) {
			            var sValue = oEvent.getParameter("value");
			            var oFilter = new sap.ui.model.Filter("SeName",sap.ui.model.FilterOperator.Contains,sValue);
			            oEvent.getSource().getBinding("items").filter([oFilter]);
			        },
			        confirm: [that._handleClose, that],
			        cancel: [that._handleClose, that]
			    });
			    _valueHelpSelectDialog.setModel(jModel);
			    _valueHelpSelectDialog.open();
	      
	      },function(err) {
		    	var errmsg = JSON.parse(err.response.body).error.message.value;
	        sap.m.MessageBox.show(errmsg, {
	            title: "Error",
	            icon:sap.m.MessageBox.Icon.ERROR
	        });
	    });
		}else{
			sap.m.MessageBox.show("Select Ticket to Assign", {
	            title: "Error",
	            icon:sap.m.MessageBox.Icon.ERROR
	        });
		}	
	
     
    },

    _handleClose: function(oEvent) {
	    var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	        //this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
	    	var code = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
	        var name=oSelectedItem.getTitle();
	        that.onAssainTicketsSave(name,code); 	        
	    }
	    
	    
	    
	},
	onTicketSingle: function(){
	      that.model.read("/ListServiceEngineerSet", null , null , false, function(oData, oResponse) {
				 var jModel = new sap.ui.model.json.JSONModel(oData.results);	
				 var _valueHelpSelectDialog1 = new sap.m.SelectDialog({
				    	
				        title: "Service Engineers",
				        items: {
				            path: "/",
				            template: new sap.m.StandardListItem({
				                title: "{SeName}",
				                customData: [new sap.ui.core.CustomData({
				                    key: "Key",
				                    value: "{ServEngg}"
				                })],
				               
				            }),
				        },
				        liveChange: function(oEvent) {
				            var sValue = oEvent.getParameter("value");
				            var oFilter = new sap.ui.model.Filter("SeName",sap.ui.model.FilterOperator.Contains,sValue);
				            oEvent.getSource().getBinding("items").filter([oFilter]);
				        },
				        confirm: [that._handleClose1, that],
				        cancel: [that._handleClose1, that]
				    });
				    _valueHelpSelectDialog1.setModel(jModel);
				    _valueHelpSelectDialog1.open();
		      
		      },function(err) {
			    	var errmsg = JSON.parse(err.response.body).error.message.value;
		        sap.m.MessageBox.show(errmsg, {
		            title: "Error",
		            icon:sap.m.MessageBox.Icon.ERROR
		        });
		    });
			
		
	     
	    },

	    _handleClose1: function(oEvent) {
		    var oSelectedItem = oEvent.getParameter("selectedItem");
		    if (oSelectedItem) {
		        //this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
		    	var code = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		        var name=oSelectedItem.getTitle();
		        that.onAssainTicketsSave1(name,code); 
		    }
		    
		    
		    
		},
	onAssainTicketsSave:function(Engg,code){
		debugger
		var oTable=that.getView().byId("tblDetail");
		var selectedItems=oTable.getSelectedItems();
		var batchUrls = [];
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
		var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
			"Content-Type": "application/atom+xml"
			});
		for(var i=0;i<selectedItems.length;i++){
			var obj={};
			obj.IServEngg=code;
			obj.ISeName=Engg;
			obj.TicketNo=selectedItems[i].getCells()[0].getText();
			obj.EMessage="";
			var par={"Accept-Language": "en-US", "Accept": "application/xml"}
		batchUrls.push( oCreateModel1.createBatchOperation( "/SEReassignSet", "POST",obj,par)); 
		
		}
		
		oCreateModel1.addBatchChangeOperations(batchUrls);
		oCreateModel1.submitBatch(function(oData, oResponse) {
			debugger
			var oBtnCancel = new sap.m.Button({
				text : "Ok",
				press : function() {
					oDialog.close();
					that.OnUnassigned();
				}
			});
			var oDialog = new sap.m.Dialog({
				title : "Success",
				type : "Message",
				icon : "sap-icon://message-information",
				beginButton : oBtnCancel
			}); 
			for(var i=0;i<oData.__batchResponses[0].__changeResponses.length;i++){
				var res=oResponse.data.__batchResponses[0].__changeResponses[i].data;
					oDialog.addContent(new sap.m.ObjectStatus({
						text:"Ticket "+res.TicketNo+" "+res.EMessage,
					}));
				
			}
			oDialog.open();
		},function(oData, oResponse){
			// odata call error
			var parser = new DOMParser();
			var message=parser.parseFromString(oData.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
			
	        sap.m.MessageBox.show(message, {
	            title: "Error",
	            icon:sap.m.MessageBox.Icon.ERROR
	        });
		});
    	
    },
    onAssainTicketsSave1:function(Engg,code){
		debugger
		var batchUrls = [];
			var obj={};
			obj.IServEngg=code;
			obj.ISeName=Engg;
			obj.TicketNo=that.data.d.ITicketNo;
			obj.EMessage="";
			var par={"Accept-Language": "en-US", "Accept": "application/xml"}
			var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
			var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel1.setHeaders({
				"Content-Type": "application/atom+xml"
				});
		batchUrls.push( oCreateModel1.createBatchOperation( "/SEReassignSet", "POST",obj,par)); 
		
		
		
		oCreateModel1.addBatchChangeOperations(batchUrls);
		oCreateModel1.submitBatch(function(oData, oResponse) {
			debugger
			var oBtnCancel = new sap.m.Button({
				text : "Ok",
				press : function() {
					oDialog.close();
					if(that.getView().byId("idPanel2").getVisible()){
					that.OnUnassigned();
					}else{
						that.getView().byId("RD1").setSelected(false);
						that.getView().byId("idPanel3").setVisible(false);
						that.getView().byId("IdSearch").setVisible(false).setValue();
						that.getView().byId("idPanel2").setVisible(false);
						that.getView().byId("idPanel1").setExpanded(true);
						
					}
				}
			});
			var oDialog = new sap.m.Dialog({
				title : "Success",
				type : "Message",
				icon : "sap-icon://message-information",
				beginButton : oBtnCancel
			}); 
			
				var res=oResponse.data.__batchResponses[0].__changeResponses[0].data;
					oDialog.addContent(new sap.m.ObjectStatus({
						text:"Ticket "+res.TicketNo+" "+res.EMessage,
					}));
				
			
			oDialog.open();
		},function(oData, oResponse){
			// odata call error
			var parser = new DOMParser();
			var message=parser.parseFromString(oData.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
			
	        sap.m.MessageBox.show(message, {
	            title: "Error",
	            icon:sap.m.MessageBox.Icon.ERROR
	        });
		});
    	
    },
    
    onEnter: function(value) {
    	debugger
    	
        var that=this;
        var ticket = value;
        var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
        var oReadModel = new sap.ui.model.odata.ODataModel( sServiceUrl);
        oReadModel.setHeaders({
          "Content-Type": "application/atom+xml"
          });
        var fncSuccess = function(oData, oResponse) //sucess function 
        {
          var ary={"d":oData}
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

            var fittype = that.data.d.FitType;
      		if ((fittype === "REP" || fittype === "STU" || fittype === "DEF")) {
      			
      			that.getView().byId("idVboxRep").setVisible(true);
      			that.getView().byId("idVboxOem").setVisible(false);

      		} else {
      			that.getView().byId("idVboxRep").setVisible(false);
      			that.getView().byId("idVboxOem").setVisible(true);
      		}   	
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

}); 