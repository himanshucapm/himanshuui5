sap.ui.define(
[
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"zretreadgrnin/util/Formatter"
],
function(MessageBox,Controller, JSONModel,Formatter) {
"use strict";
var that;
var initialFlag, RetreadInJModel, StnclNumber, Kunnr;

sap.ui.controller("zretreadgrnin.controller.View1", {

	onInit:function(){
		debugger
		that = this;
		initialFlag = true;
		this.newBusy = new sap.m.BusyDialog();
		
		var RetreadInTable = this.getView().byId("idRetreadIn1");
		RetreadInJModel = new sap.ui.model.json.JSONModel();
		RetreadInTable.setModel(RetreadInJModel, "RetreadInJModel");
		
		var obj={
				busy:false,
				delay:0
				};
		var oPageModel=new sap.ui.model.json.JSONModel(obj);
		this.getView().setModel(oPageModel,"oPageModel");
		
		this.getFleetData();
		
		//set initial date in input field
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyyy"});
		var date = new Date(), y = date.getFullYear(), m=date.getMonth();
		this.firstDay = new Date(y,m,1);
		this.currentDate = new Date;
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
		this.dateFrom = dateFormat.format(this.firstDay)+"T00:00:00";
		this.dateTo = dateFormat.format(this.currentDate)+"T00:00:00";
		this.currentDate = oDateFormat.format(this.currentDate);
		this.firstDay = oDateFormat.format(this.firstDay);
		
		var initialDateValue = this.firstDay + " - "  + this.currentDate;
		this.getView().byId("fromDate").setValue(this.firstDay);
		this.getView().byId("toDate").setValue(this.currentDate);

		var oDatePicker = this.getView().byId("fromDate");
		oDatePicker.addEventDelegate({
			onAfterRendering: function(){
				var oDateInner = this.$().find('.sapMInputBaseInner');
				var oID = oDateInner[0].id;
				$('#'+oID).attr("disabled", "disabled"); 
			}
		},
		oDatePicker
		);
		var oDatePicker1 = this.getView().byId("toDate");
		oDatePicker1.addEventDelegate({
			onAfterRendering: function(){
				var oDateInner = this.$().find('.sapMInputBaseInner');
				var oID = oDateInner[0].id;
				$('#'+oID).attr("disabled", "disabled");
			}
		},
		oDatePicker1
		);
		var today = new Date();
		this.getView().byId("idTime").setText(today.toDateString());
		this.getView().byId("fromDate").setMaxDate(today);
		this.getView().byId("toDate").setMaxDate(today);
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onAfterRendering : function(){
		debugger
		if(initialFlag){
				if (!this._Dialog) {
					this._Dialog = sap.ui.xmlfragment(
					"zretreadgrnin.view.Initial", this);
					this.getView().addDependent(this._Dialog);
					}
					this._Dialog.open();
		}			
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onCancelButton : function() {
		debugger
		var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
		
		oCrossAppNavigator.toExternal({
							target: { semanticObject : "#"}
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////	
	onSelect:function(oEvt){
		debugger
		var selected = oEvt.getSource().getSelected();
		var tbl = this.getView().byId("idRetreadIn1");
		var lngth = tbl.getItems().length;
		for(var i=0; i<lngth; i++){
			if(selected){
				tbl.getItems()[i].getCells()[0].setSelected(true);
			}else{
				tbl.getItems()[i].getCells()[0].setSelected(false);
			}
			
		}
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	getFleetData:function(){
		debugger
		var oPageModel=this.getView().getModel("oPageModel");
		oPageModel.setProperty("/busy",true);
		var sServicePath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
		var sPathSet = "/User_Fleet_DetialsSet?$filter=CUname eq '"+ sap.ushell.Container.getService("UserInfo").getId() + "'";
		var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServicePath);
		var oParamsCartListSet = {};
			oParamsCartListSet.success = function(oData, oResponse) {
				debugger
				oPageModel.setProperty("/busy",false);
				oPageModel.setProperty("/F4FleetData",oData.results);
			};
			oParamsCartListSet.error = function(oError) {
			};
			frameworkODataModel.read(sPathSet, oParamsCartListSet);
	},

	onFleetFragment:function(oEvent){
		debugger
		this.oVal=oEvent.getSource();
		this._FleetHelpDialog = sap.ui.xmlfragment("zretreadgrnin.view.FleetDialog", this);
		this.getView().addDependent(this._FleetHelpDialog);
		var abc = this._FleetHelpDialog.open();
	},

	_handleFleetF4Confirm:function(oEvent){
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.oVal.setValue(oSelectedItem.getTitle());
			this.Kunnr = oSelectedItem.getBindingContext("oPageModel").getProperty().Kunnr;
			sap.ui.getCore().byId("idHub").setEnabled(true);
			sap.ui.getCore().byId("idHub").setValue();
		}
	},

	_handleValueHelpFleetSearch:function(oEvent){
		debugger
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("FleetName", sap.ui.model.FilterOperator.Contains, sValue);
		var oFilter3 = new sap.ui.model.Filter([oFilter],false)
		oEvent.getSource().getBinding("items").filter([oFilter3]);
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	onF4GRN:function(){
		debugger
		this.GRNModel= new sap.ui.model.json.JSONModel();
		if(Kunnr==undefined)Kunnr="";
		
		var oData={};
		var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
		var sPath = "F4GetGrnSet?$filter=App eq 'H' and Dealer eq '"+this.Dealer+"' and HubCode eq '"+this.hubCode+"'";
		var customerModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

		this.GRNDialog = new sap.m.SelectDialog({
					title : "Select GRN",
					items : {
						path : "/results",
						template : new sap.m.StandardListItem({
							title : "{Mblnr}",
							description:"{path:'Erdat',formatter:'zretreadgrnin.util.Formatter.date1'}",
							customData : [ new sap.ui.core.CustomData({
								key : "{Erdat}",
								value : "{Mblnr}"
							})],
						}),
					},
			liveChange : function(oEvent) {
				debugger
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Mblnr",sap.ui.model.FilterOperator.Contains,sValue);
				oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
				confirm : [ that._handleGRNClose, that ],
				cancel :  [ that._handleGRNClose, that ]
		});

			oData.success=function(oData,oResponse){
				debugger
				that.GRNModel.setData(oData);
				
				that.GRNDialog.setModel(that.GRNModel);
				that.GRNDialog.open();
			};
			customerModel.read(sPath,oData);
		},

		_handleGRNClose: function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					this.Mblnr = oSelectedItem.getBindingContext().getObject().Mblnr;
				}
				that.getView().byId("idF4GRN").setValue(this.Mblnr);
				
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		onStencilNo:function(){
			debugger
			 var user = new sap.ushell.services.UserInfo();
			 var uid = user.getId()
			 var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingStencilSet?$filter=App eq 'H' and Dealer eq '"+this.Dealer+"' and HubCode eq '"+this.hubCode+"'";
			 var jModel = new sap.ui.model.json.JSONModel();
		         jModel.loadData(sPath, null, false,"GET",false, false, null);
		     var _valueHelpStencilSelectDialog = new sap.m.SelectDialog({
			 title : "Stencil Number",
					items : {
					 path : "/d/results",
				 template : new sap.m.StandardListItem({
					title : "{StnclNumber}",
			   customData : [ new sap.ui.core.CustomData({
				   	  key : "{StnclNumber}",
					value : "{StnclNumber}"
					})],
					}),
					},
			liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("StnclNumber",sap.ui.model.FilterOperator.Contains,sValue);
				//  var oFilter1 = new sap.ui.model.Filter("EmpName",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter2 = new sap.ui.model.Filter([oFilter],false)
					 oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
				confirm : [ this._handleStencilClose, this ],
				 cancel : [ this._handleStencilClose, this ]
			});
		     _valueHelpStencilSelectDialog.setModel(jModel);
		     _valueHelpStencilSelectDialog.open();
			},

		_handleStencilClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
					this.getView().byId("idStencilNo").setValue(oSelectedItem.getTitle()); 	
					StnclNumber = oSelectedItem.getBindingContext().getObject().StnclNumber;
			}
		},

//////////////////////////////////////////////////////////////////////////////////////////////////

	onClickHub : function() {
		debugger
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"
					+sap.ushell.Container.getService("UserInfo").getId()+ "'and CKunnr eq '"+this.Kunnr+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false,false, null);
		if (jModel.getData().d.results.length) {
			var _valueHelpHubelectDialog = new sap.m.SelectDialog(
					{
						title : "Select Hub",
						 items : {
		                      path : "/d/results",
		                      template : new sap.m.StandardListItem(
		                          {
		                            title : "{HubName}",
		                            customData : [ new sap.ui.core.CustomData(
		                                {
		                                  key : "Key",
		                                  value : "{HubName}"
		                                }) ],

		                          }),
		                    },
						liveChange : function(oEvent) {
							var sValue = oEvent.getParameter("value");

							var oFilter = new sap.ui.model.Filter("HubName",sap.ui.model.FilterOperator.Contains,sValue);
							oEvent.getSource().getBinding("items").filter([ oFilter ]);
						},
						confirm : [ this._handleHubClose, this ],
						cancel : [ this._handleHubClose, this ]
					});
			_valueHelpHubelectDialog.setModel(jModel);
			_valueHelpHubelectDialog.open();
		} else {
			sap.m.MessageToast.show("You are not authorised for any Hub in Fleet "+ sap.ui.getCore().byId("idFleet").getValue());
		}
	},

	_handleHubClose : function(oEvent) {
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			sap.ui.getCore().byId("idHub").setValue(oSelectedItem.getTitle());
			this.hubCode = oSelectedItem.getBindingContext().getObject().HubCode;
		}
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onDealer: function(){
		debugger
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/CasingDealerSet?$filter=App eq 'H' and HubCode eq '"+this.hubCode+"'";
		 var jModel = new sap.ui.model.json.JSONModel();
		      jModel.loadData(sPath, null, false,"GET",false, false, null);
		  var _valueHelpDealerSelectDialog = new sap.m.SelectDialog({
					title : "Select Dealer",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{Name}",
							customData : [ new sap.ui.core.CustomData({
								key : "{Dealer}",
								value : "{Name}"
							})],
						}),
					},
			liveChange : function(oEvent) {
				debugger
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Dealer",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter1 = new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
					oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
			
				confirm : [ this._handleDealerClose, this ],
				cancel : [ this._handleDealerClose, this ]
			});
		
			_valueHelpDealerSelectDialog.setModel(jModel);
			_valueHelpDealerSelectDialog.open();
		},
		_handleDealerClose : function(oEvent) {
			debugger
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("idDealer").setValue(oSelectedItem.getBindingContext().getObject().Name);
				this.Dealer= oSelectedItem.getBindingContext().getObject().Dealer;
				this.getView().byId("idDealer").setValueState("None");
			}
			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onClear:function(){
			var tableid = this.getView().byId("idRetreadRepair1");
			RetreadInJModel.setData();
			RetreadInJModel.refresh(); 
			sap.m.MessageToast.show("Filters Removed");
			
			this.getView().byId("idStencilNo").setValue();
			this.getView().byId("idDealer").setValue();
			this.getView().byId("idF4GRN").setValue();
			
			this.setInitialDate();
		},
		
		onSearch:function(){
			this.newBusy.open();
			var check  = false;
			var oView = this.getView();
			var user = new sap.ushell.services.UserInfo();
			var uid = user.getId();
			
			if(this.getView().byId("idDealer").getValue() == ""){
				sap.m.MessageToast.show("Please select Dealer");
				this.getView().byId("idDealer").setValueState("Error");
				that.newBusy.close();
				return false;
			}
			else
				this.getView().byId("idDealer").setValueState("None");
			
			if(this.Dealer==undefined)this.Dealer = '';
			if(this.Kunnr==undefined)this.Kunnr = '';
			if(this.Mblnr==undefined)this.Mblnr = '';
			if(StnclNumber==undefined)StnclNumber = '';
			
				var oViewObj = this.getView();
				var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
				var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oReadModel.setHeaders({
					"Content-Type" : "application/json"
				});
			
				var fncSuccess = function(oData, oResponse)
				{
					that.newBusy.close();
					debugger
					RetreadInJModel.setData(oData.RetreadInNvg.results);
					
				}
				var fncError = function(oError) {
					that.newBusy.close();
					jQuery.sap.log.error("Read publishing group data failed");
					sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
				};
				var path = "RetreadInSet(Stencil='"+StnclNumber+"',Dealer='"+this.Dealer+"',HubCode='"+this.hubCode+"',Mblnr='"+this.Mblnr+"',DateFrom=datetime'"+this.dateFrom+"',DateTo=datetime'"+this.dateTo+"')?$expand=RetreadInNvg";
				
				oReadModel.read(path, {
					success : fncSuccess,
					error : fncError
				});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		setInitialDate:function(){
	    	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
			var date = new Date(), y = date.getFullYear(), m=date.getMonth();
			this.firstDay = new Date(y,m,1);
			this.currentDate = new Date;
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
			this.dateFrom  = dateFormat.format(this.firstDay)+"T00:00:00";
			this.dateTo = dateFormat.format(this.currentDate)+"T00:00:00";
			this.currentDate = oDateFormat.format(this.currentDate);
			this.firstDay = oDateFormat.format(this.firstDay);
			
			this.getView().byId("fromDate").setValue(this.firstDay);
			this.getView().byId("toDate").setValue(this.currentDate);
			
	    },
		handledatefrom: function(oEvent){
			debugger
				
		    	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
		    	var from = oEvent.getSource().getProperty("dateValue");
		    	var dateVal = oEvent.getSource().getProperty("value");
		    	if(from !== null){
		    		this.dateFrom = dateFormat.format(from)+"T00:00:00";
		    	}else{
		    	if(dateVal !== ""){
		        var dateSplit = dateVal.split("-");
		        var fromDate = dateSplit[0].trim();
		        var fromSplit = fromDate.split(".");
		        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		        this.dateFrom = fValue+"T00:00:00";
		       }else{
		        this.dateFrom = null;
		      }
		    }
		    	
		    	if( new Date(this.dateFrom) > new Date(this.dateTo) ){
					sap.m.MessageToast.show("To-Date cannot be less than From-Date");
					this.setInitialDate();
					return;
				}
			
		},
		
		handledateto: function(oEvent){
			debugger
			
		    	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
		    	var from = oEvent.getSource().getProperty("dateValue");
		    	var dateVal = oEvent.getSource().getProperty("value");
		    	if(from !== null){
		    	this.dateTo = dateFormat.format(from)+"T00:00:00";
		    	}else{
		    	if(dateVal !== ""){
		    	var dateSplit = dateVal.split("-");
		        var fromDate = dateSplit[0].trim();
		        var fromSplit = fromDate.split(".");
		        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		        this.dateTo = fValue+"T00:00:00";
		    	}else{
		        this.dateTo = null;
		    	}
		    }
		    	
		    	if( new Date(this.dateFrom) > new Date(this.dateTo) ){
					sap.m.MessageToast.show("From-Date cannot be greater than To-Date");
					this.setInitialDate();
					return;
				}
			
		},	
		
//////////////////////////////////////////////////////////////////////////////////////////////////
	onOKButton : function(){
		debugger
		var that = this;
		var fleet = sap.ui.getCore().byId("idFleet").getValue();
		var hub = sap.ui.getCore().byId("idHub").getValue();
		
		if( fleet == "" || fleet == undefined || hub == "" || hub == undefined){
			sap.m.MessageToast.show("Please select a Fleet and Hub.");
			return false;
		}
		
		this.getView().byId("idPage").setTitle(""+fleet+" ("+hub+")");
		this._Dialog.close();
	},

//////////////////////////////////////////////////////////////////////////////////////////////////
		onHome:function(){
				this.openDialog("cancel");
			},

		openDialog : function(status) {
			debugger
		    var labelMessage;
		    if (status == 'cancel') {
		      labelMessage = 'Are you sure you want to go back?';
		    }

		    var _that = this;
		    var dialog = new sap.m.Dialog({
		      title : 'Confirmation Dialog',
		      type : 'Message',
		      content : [ new sap.m.Label({
		        text : labelMessage,
		        labelFor : 'submitDialogTextarea'
		      }) ],
		      beginButton : new sap.m.Button({
		        text : 'Yes',
		        press : function() {
		         if (status == 'cancel') {
		            //window.history.back()
		        	 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
		        	 oCrossAppNavigator.toExternal({
		        	                       target: { semanticObject : "#"}
		        	                      });
		          }
		          dialog.close();
		        }
		      }),
		      endButton : new sap.m.Button({
		        text : 'No',
		        press : function() {
		          dialog.close();
		        }
		      }),
		      afterClose : function() {
		        dialog.destroy();
		      }
		    });

		    dialog.open();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onSubmit: function (){
			debugger
			var oTable = this.getView().byId("idRetreadIn1");
			var oItems = oTable.getItems();
			var tblLength = oItems.length;
			var modelData = RetreadInJModel.getData();
			var counter = false;
			
			if(oItems.length==0){
				sap.m.MessageToast.show("No Items for Goods Receipt.");
				return false;
			}
			
			var Data = {};
			Data.Dealer = this.Dealer;
			Data.HubCode = this.hubCode;
			Data.Mblnr = this.Mblnr;
			Data.DateFrom = this.dateFrom;
			Data.DateTo = this.dateTo;
			
			
			Data.RetreadInNvg = [];
			
				for(var i=0; i<tblLength; i++){
					delete modelData[i].__metadata;
					
					if(oItems[i].getCells()[0].getSelected() == true){
						counter = true;
						modelData[i].Select = 'X';
						Data.RetreadInNvg.push(modelData[i]);
					}
				
				}
				
				if(counter == false){
					sap.m.MessageToast.show("Select atleast one item for Goods Receipt.");
					return false;
				}
				
				this.newBusy.open();
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
			var sPath = "RetreadInSet";
			var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oCreateModel1.setHeaders = ({
					"Content-Type": "application/atom+xml"
				});
			var fncSuccess = function (oData, oResponse){
				that.newBusy.close();
				if(oData.EError == "true"){
					sap.m.MessageBox.show({
						title: "Error",
						icon:sap.m.MessageBox.Icon.ERROR,
						onClose:function (){
						}
					});
				}else{
					sap.m.MessageBox.show("Submitted Successfully",{
						title:"Success",
						icon:sap.m.MessageBox.Icon.SUCCESS,
						onClose: function (){
							var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
							oCrossAppNavigator.toExternal({
							                      target: { semanticObject : "#"}
							                     });
						}
					});
				}
			}
			var fncError = function (oError){
				that.newBusy.close();
				var parser = new DOMParser();
				sap.m.MessageBox.show(parser,{
					title: "Error",
					icon:sap.m.MessageBox.Icon.ERROR,
				});
			}

			oCreateModel1.create(sPath, Data,{
				success:fncSuccess,
				error:fncError
			});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
});
});