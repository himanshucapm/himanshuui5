sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"zstatnrymaster/util/Formatter",
	"sap/m/MessageBox",
], function (Controller , MessageToast , JSONModel , Formatter , MessageBox){
"use strict";

var that, index="";
var statusJModel, historyJModel, requestedJModel, ApproveHeadToItemNvg=[];
var F4Pernr="", Remarks="", RequestNo, Item, ItemDesc, Pernr, AvailMenge, ReqMenge, ReqDate, Status, Empcode, UserName, Persa, Name1, Ename;

return Controller.extend("zstatnrymaster.controller.View1",{
		onInit: function () {
			debugger
			that = this;
			
			statusJModel = new JSONModel();
			this.getView().byId("idRequestHistory").setModel(statusJModel, "statusJModel");
			
			historyJModel = new JSONModel();
			this.getView().byId("idRequestHistory").setModel(historyJModel, "historyJModel");
			
			requestedJModel = new JSONModel();
			//this.getView().byId("idRequestHistory").setModel(requestedJModel, "requestedJModel");
			
			//this.getStatusData();
			this.getUserInfo();
			
			var datum = new Date();
			var time = datum.toLocaleTimeString();
			datum = datum.toString();
			datum = datum.substr(0,16);
			this.getView().byId("idDate").setText(datum).addStyleClass("textBold1");
			
			// example usage: realtime clock
			setInterval(function(){
				var currentTime = that.getDateTime();
				that.getView().byId("idTime").setText(currentTime);
				}, 1000);
			
			//set initial date in input field
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
			var date = new Date(), y = date.getFullYear(), m=date.getMonth();
			var firstDay = new Date(y,m,1);
			var currentDate = new Date;
			var dateFormat  = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
			this.dateFrom   = dateFormat.format(firstDay)+"T00:00:00";
			this.dateTo     = dateFormat.format(currentDate)+"T00:00:00";
			currentDate     = oDateFormat.format(currentDate);
			firstDay        = oDateFormat.format(firstDay);
			
			var initialDateValue = firstDay + " - " + currentDate;
			this.getView().byId("idfromDate").setValue(firstDay);
			this.getView().byId("idToDate").setValue(currentDate);
			
			//set maximum date in input field
			var oDatePicker = this.getView().byId("idfromDate");
				oDatePicker.addEventDelegate({
				onAfterRendering: function(){
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#'+oID).attr("disabled", "disabled"); 
				}
			},
				oDatePicker
			); 
			var oDatePicker1 = this.getView().byId("idToDate");
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
			this.getView().byId("idToDate").setMaxDate(today);
			this.onStatus();
			Status = "01";
			this.getView().byId("idStatus").setSelectedKey("01");
			//this.onSearch();
			
			var table = this.getView().byId("idRequestHistory");
			table.addEventDelegate({
				onAfterRendering: function(){
					debugger
					for(var i=0 ; i<table.getItems().length ; i++){
						if(table.getModel("historyJModel").getData()[i].Status != '01'){
							table.getItems()[i].getCells()[11].setVisible(false);
							table.getItems()[i].getCells()[12].setVisible(false);
						}else{
							table.getItems()[i].getCells()[11].setVisible(true);
							table.getItems()[i].getCells()[12].setVisible(true);
						}
					}
				}
			}, table);
			
		},
		
		getDateTime:function() {
			var now     = new Date(); 
	        var hour    = now.getHours();
	        var minute  = now.getMinutes();
	        var second  = now.getSeconds(); 
	        if(hour.toString().length == 1) {
	             hour = '0'+hour;
	        }
	        if(minute.toString().length == 1) {
	             minute = '0'+minute;
	        }
	        if(second.toString().length == 1) {
	             second = '0'+second;
	        }   
	        var dateTime = hour+':'+minute+':'+second;   
	         return dateTime;
	        
	    },
//////////////////////////////////////////////////////////////////////////////////////////////////
		setButtons:function(){
			var table = this.getView().byId("idRequestHistory");
			
					debugger
					for(var i=0 ; i<table.getItems().length ; i++){
						if(table.getModel("historyJModel").getData()[i].Status != '01'){
							table.getItems()[i].getCells()[11].setVisible(false);
							table.getItems()[i].getCells()[12].setVisible(false);
						}else{
							table.getItems()[i].getCells()[11].setVisible(true);
							table.getItems()[i].getCells()[12].setVisible(true);
						}
					}
			
		},
		
//////////////////////////////////////Get User Status/////////////////////////////////////////////
		
		onStatus:function(){
				debugger
					//Method for setting the model for Primary Reason
					var sPath = "/sap/opu/odata/SAP/ZSTAT_MNGT_SRV/GetStatusSet";
					var jModel = new sap.ui.model.json.JSONModel();
					jModel.loadData(sPath, null, false,"GET",false, false, null);
					var  loc= this.getView().byId("idStatus");
					loc.unbindAggregation("items");
					loc.setModel(jModel);
					loc.bindAggregation("items", {
						path : "/d/results",
						template : new sap.ui.core.Item({
							key : "{Status}",
							text : "{Description}"
						})
					});		
					},	 
////////////////////////////////////////////Get User Info/////////////////////////////////////////
		getUserInfo: function(){
			debugger
			that = this;
			var sServicePath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/";
			var sPath = "/GetEmpDetailSet(Username='"+sap.ushell.Container.getService("UserInfo").getId()+"')";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServicePath);
			var oData = {};
				oData.success = function (oData, oResponse){
					debugger
					Empcode  = oData.Empcode;
					UserName = oData.Username
					Persa	 = oData.Persa
					Name1 	 = oData.Name1
					Ename	 = oData.Ename
			//		that.getUserHistory();
					
					/*that.getView().byId("idEmpCode").setText(Empcode).addStyleClass("textBold");*/
					that.getView().byId("idName").setText(Ename).addStyleClass("textBold");
					that.getView().byId("idLocation").setText(Name1);
					
					that.onSearch();
					that.setButtons();
				};
				oData.error = function(oError){
					
				};
				oDataModel.read(sPath, oData);
		},
///////////////////////////////////////Get User History///////////////////////////////////////////
	
		getUserHistory: function(){
			debugger
			that = this;
			var user = new sap.ushell.services.UserInfo();
			var uid = user.getId();
			var sServiceUrlPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/";
			var sPath = "/EmpReqHdrSet";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlPath);
			var oData = {};
				oData.success = function(oData, oResponse){
					debugger
					historyJModel.setData(oData.results);
			//		this.getEmployeeDetails();
				};
				oData.error = function(oError){
				};
				oDataModel.read(sPath, oData);
		},
////////////////////////////////////////////Get Employee Details//////////////////////////////////
 			getEmployeeDetails: function(){
					debugger
					that = this;
					var user = new sap.ushell.services.UserInfo();
					var uid = user.getId();
					var sServiceUrlPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/";
					var sPath = "F4PernrSet?$filter=Persa eq '"+Persa+"' ";
					var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlPath);
					var oData = {};
						oData.success = function(oData, oResponse){
							debugger
							historyJModel.setData(oData.results);
						};
						oData.error = function(oError){
						};
						oDataModel.read(sPath, oData);
				},	
				
//////////////////////////////////////////////////////////////////////////////////////////////////
				onF4Employee: function (evt) {
					debugger
					this.Source = evt.getSource();
					
					var sPath  = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/F4PernrSet?$filter=Persa eq '"+Persa+"' ";
					var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false,"GET",false, false, null);
					var _valueHelpItemSelectDialog = new sap.m.SelectDialog({
								title : "Select Employee",
								items : {
									path : "/d/results",
									template : new sap.m.StandardListItem({
										title : "{Ename}",
										description: "{Pernr}",
										customData : [ new sap.ui.core.CustomData({
											key : "{Pernr}",
											value : "{Ename}"
										})],
									}),
								},
								
						liveChange : function(oEvent) {
							var sValue = oEvent.getParameter("value");
							var oFilter = new sap.ui.model.Filter("Ename",sap.ui.model.FilterOperator.Contains,sValue);
							var oFilter1 = new sap.ui.model.Filter("Pernr",sap.ui.model.FilterOperator.Contains,sValue);
							var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
							oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
						},
						
							confirm : [ this._handleItemClose, this ],
							cancel : [ this._handleItemClose, this ]
						});
							_valueHelpItemSelectDialog.setModel(jModel);
							_valueHelpItemSelectDialog.open();
				},

					_handleItemClose : function(oEvent) {
						debugger
						that = this;
						
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
								var obj = oSelectedItem.getBindingContext().getObject();
								this.Source.setValue(obj.Ename);
								F4Pernr = obj.Pernr;
						}
						
				},
	
	onClear:function(){
		debugger
		this.getView().byId("idEmployee").setValue();
		F4Pernr="";
		this.getView().byId("idStatus").setSelectedKey("00");
	},

/******************************Go Button Service related to table data **************************/
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
					},	
					
					payLoadDate: function(SDateValue) {
						debugger
						var str = "T00:00:00";
						var currentTime = new Date(SDateValue);
						var month = currentTime.getMonth() + 1;
						var day = currentTime.getDate();
						var year = currentTime.getFullYear();
						var date = year + "-" + month + "-" + day + str;
						return date;
						},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onSearch:function(){
			debugger
			
			var check  = false;
			var oView = this.getView();
			var user = new sap.ushell.services.UserInfo();
			var uid = user.getId();
			
			var Status	= this.getView().byId("idStatus").getSelectedKey();
			if(this.dateFrom > this.dateTo){
				sap.m.MessageToast.show("From-Date cannot be greater than To-Date.");
				this.getView().byId("idfromDate").setValueState("Error");
				this.getView().byId("idToDate").setValueState("Error");
				return false
				}
			else{
				this.getView().byId("idfromDate").setValueState("None");
				this.getView().byId("idToDate").setValueState("None");
				}
		 	var oViewObj = this.getView();
			
			var sServiceUrl = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type" : "application/json"
			});
			
			if(this.dateFrom)
				var path = "ApproverDataSet?$filter=Persa eq '"+Persa+"' and Pernr eq '"+F4Pernr+"' and Status eq '"+Status+"' and FromDate eq datetime'"+this.dateFrom+"' and ToDate eq datetime'"+this.dateTo+"'&$expand=ApproveHeadToItemNvg";
			
			var fncSuccess = function(oData, oResponse){
				debugger
				historyJModel.setData(oData.results);
				//var tbl =  oViewObj.byId("idRequestHistory");
				//var tblrow = tbl.getItems();
				//var len = tblrow.length;
				
				that.setButtons();
			}
			
			var fncError = function(oError) {
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			
			
			oReadModel.read(path, {
				success : fncSuccess,
				error : fncError
				});
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		
		onQuantitychange:function(oEvent){
			debugger
			var index = oEvent.getSource().getParent().getBindingContext("requestedJModel").sPath.split("/")[1];
			var data  = sap.ui.getCore().byId("idRequestedTable").getItems()[index];
			var ReqQty = parseInt(data.getCells()[2].getText());
			var AppQty = parseInt(data.getCells()[4].getValue()); 
			if(ReqQty < AppQty){
					sap.m.MessageToast.show("Item does not have enough stock.");
					data.getCells()[4].setValueState("Error").setValue();
					return false;
				}else{
					data.getCells()[4].setValueState("None");
				}
		},
		
		onQtyValid:function(oEvent){
				debugger
				var val = oEvent.getSource().getValue();
				var newval="";   
			
			for(var i=0 ; i<val.length ; i++){
                	if(isNaN(val.charAt(i))){}
                	else
                	{
                		newval += val.charAt(i);
                	}
			}
				oEvent.getSource().setValue(newval);

		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onApproveok:function(){
			debugger
			sap.ui.getCore().byId("idAcceptRemarks").setValueState(sap.ui.core.ValueState.None);
			
			Remarks = "";
			Remarks = sap.ui.getCore().byId("idAcceptRemarks").getValue();
			
			if( that.getView().byId("idRequestHistory").getModel("historyJModel").getData()[index].Flag == '' && (Remarks == "" || Remarks != ""))
			{
				sap.ui.getCore().byId("idAcceptRemarks").setValueState(sap.ui.core.ValueState.None);
				var mode = 'A';
				this.onAcceptReject(mode);
				this._AcceptRemarkDialog.close();
				this.onSearch();
				that.setButtons();
			}
			else if( that.getView().byId("idRequestHistory").getModel("historyJModel").getData()[index].Flag == 'X' && Remarks == "" )
			{
				sap.ui.getCore().byId("idAcceptRemarks").setValueState(sap.ui.core.ValueState.Error);
				sap.m.MessageToast.show("Please input remarks.");
				return;
			}
			else if( that.getView().byId("idRequestHistory").getModel("historyJModel").getData()[index].Flag == 'X' && Remarks != "" )
			{
				sap.ui.getCore().byId("idAcceptRemarks").setValueState(sap.ui.core.ValueState.None);
				var mode = 'A';
				this.onAcceptReject(mode);
				this._AcceptRemarkDialog.close();
				this.onSearch();
				that.setButtons();
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onApproveRemarks:function(oEvent){
			debugger
			
			that = this;
			ApproveHeadToItemNvg = [];
			
			var tbl = sap.ui.getCore().byId("idRequestedTable").getItems();
			var reqqty = 0;
			
			for(var i=0 ; i<tbl.length ; i++){
				tbl[i].getCells()[6].setValueState("None");
				if(tbl[i].getCells()[0].getSelected()==true){
					var appqty = tbl[i].getCells()[6].getValue();
					var resqty = tbl[i].getCells()[4].getText();
					
					if(	parseInt(appqty) == 0 || appqty == "" ){
						tbl[i].getCells()[6].setValueState("Error");
						sap.m.MessageToast.show("Approved quantity cannot be zero.");
						return false;
					}
					
					if(	parseInt(appqty) > parseInt(resqty) ){
						tbl[i].getCells()[6].setValueState("Error");
						sap.m.MessageToast.show("Approved quantity cannot be more than requested quantity.");
						return false;
					}
					
					reqqty = parseInt(reqqty) + parseInt(appqty);
					
					var row = {
							"Select":requestedJModel.getData()[i].Select,
							"Matnr":requestedJModel.getData()[i].Matnr,
							"ReqNo":requestedJModel.getData()[i].ReqNo,
							"Persa":requestedJModel.getData()[i].Persa,
							"Pernr":requestedJModel.getData()[i].Pernr,
							"Maktx":requestedJModel.getData()[i].Maktx,
							"Ename":requestedJModel.getData()[i].Ename,
							"ReqMenge":requestedJModel.getData()[i].ReqMenge,
							"Remark":requestedJModel.getData()[i].Remark,
							"AppMenge":requestedJModel.getData()[i].AppMenge,
							"AppRemarks":requestedJModel.getData()[i].AppRemarks,
							"Action":'A'
					};
					ApproveHeadToItemNvg.push(row);
				}
			}
			
			if(ApproveHeadToItemNvg.length == 0){
				sap.m.MessageToast.show("Please select a request to approve.");
				return false;
			}
			
			
			
/*			for(var i=0 ; i<tbl.length ; i++){
				if(tbl[i].getCells()[0].getSelected()==true){
					if(tbl[i].getCells()[6].getValue()=="")tbl[i].getCells()[6].setValue(0);
					
					

					reqqty = parseInt(reqqty) + parseInt(tbl[i].getCells()[6].getValue());

					if(parseInt(requestedJModel.getData()[i].AppMenge)>parseInt(requestedJModel.getData()[i].ReqMenge)){
						sap.m.MessageToast.show("Approved quantity cannot be more than requested quantity.");
						return false;
					}

					var row = {
							"Select":requestedJModel.getData()[i].Select,
							"Matnr":requestedJModel.getData()[i].Matnr,
							"ReqNo":requestedJModel.getData()[i].ReqNo,
							"Persa":requestedJModel.getData()[i].Persa,
							"Pernr":requestedJModel.getData()[i].Pernr,
							"Maktx":requestedJModel.getData()[i].Maktx,
							"Ename":requestedJModel.getData()[i].Ename,
							"ReqMenge":requestedJModel.getData()[i].ReqMenge,
							"Remark":requestedJModel.getData()[i].Remark,
							"AppMenge":requestedJModel.getData()[i].AppMenge,
							"AppRemarks":requestedJModel.getData()[i].AppRemarks,
							"Action":requestedJModel.getData()[i].Action
					};
					ApproveHeadToItemNvg.push(row);
					}
			}*/
			
			if(parseInt(reqqty) > parseInt(historyJModel.getData()[index].TotAvaMenge))
			{
				sap.m.MessageToast.show("Approved Qty cannot be more than Total Available Qty.");
				return false
			}
			
			var mode = 'A';
			this.onAcceptReject(mode);
			this._AcceptTableDialog.close();
			
			that.onSearch();
			that.setButtons();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onAcceptSubmit : function(oEvent){
			debugger
			that = this;
			ApproveHeadToItemNvg=[];
			index = oEvent.getSource().getParent().getBindingContext("historyJModel").sPath.split("/")[1];
			
			/////////
			if(historyJModel.getData()[index].AppMenge==""){
				sap.m.MessageToast.show("Approved quantity cannot be blank.");
				that.getView().byId("idRequestHistory").getItems()[index].getCells()[8].setValueState("Error");
				return;
			}
			else{
				that.getView().byId("idRequestHistory").getItems()[index].getCells()[8].setValueState("None");
			}
			
			if(parseInt(historyJModel.getData()[index].AppMenge)==0){
				sap.m.MessageToast.show("Approved quantity cannot be 'Zero'.");
				that.getView().byId("idRequestHistory").getItems()[index].getCells()[8].setValueState("Error");
				return;
			}
			else{
				that.getView().byId("idRequestHistory").getItems()[index].getCells()[8].setValueState("None");
			}
			
			if(parseInt(historyJModel.getData()[index].AppMenge) > parseInt(historyJModel.getData()[index].TotAvaMenge)){
				sap.m.MessageToast.show("Approved quantity cannot be more than available quantity.");
				that.getView().byId("idRequestHistory").getItems()[index].getCells()[8].setValueState("Error");
				return;
			}
			else{
				that.getView().byId("idRequestHistory").getItems()[index].getCells()[8].setValueState("None");
			}
			
			if(parseInt(historyJModel.getData()[index].AppMenge) > parseInt(historyJModel.getData()[index].ReqMenge)){
				sap.m.MessageToast.show("Approved quantity cannot be more than requested quantity.");
				that.getView().byId("idRequestHistory").getItems()[index].getCells()[8].setValueState("Error");
				return;
			}
			else{
				that.getView().byId("idRequestHistory").getItems()[index].getCells()[8].setValueState("None");
			}
			
			/////////
				if( that.getView().byId("idRequestHistory").getModel("historyJModel").getData()[index].Flag == '')
				{
					if (!that._AcceptRemarkDialog) {
						that._AcceptRemarkDialog = sap.ui.xmlfragment(
								"zstatnrymaster.view.AcceptRemarks", that);
							that.getView().addDependent(that._AcceptRemarkDialog);
							}
					that._AcceptRemarkDialog.open();
					sap.ui.getCore().byId("idAcceptRemarks").setValue();
				}
				else
				{
					
					sap.ui.define(["sap/m/MessageBox"], function(MessageBox){
						MessageBox.show("Same item has been requested by multiple employees. Please proceed for approval.",{
								icon: MessageBox.Icon.INFORMATION,
								title: "Warning",
								actions: [MessageBox.Action.YES, MessageBox.Action.NO],
								onClose: function(oAction){
									if(oAction === sap.m.MessageBox.Action.YES){
										if (!that._AcceptTableDialog) {
											that._AcceptTableDialog = sap.ui.xmlfragment(
												"zstatnrymaster.view.AcceptTable", that);
											that.getView().addDependent(that._AcceptTableDialog);
										}
										that._AcceptTableDialog.open();
											
										var item = that.getView().byId("idRequestHistory").getModel("historyJModel").getData()[index].Maktx;
										var avail = that.getView().byId("idRequestHistory").getModel("historyJModel").getData()[index].TotAvaMenge;
										var reserve = that.getView().byId("idRequestHistory").getModel("historyJModel").getData()[index].TotReqMenge;
										
										var string = "Total Available Quantity( "+avail+" ), Total Reserved Quantity( "+reserve+" )";
										sap.ui.getCore().byId("idFragmentHeader").setText(string).addStyleClass("textBold");
										sap.ui.getCore().byId("idFragLabel").setText("Item ( "+item+" )");
										
										sap.ui.getCore().byId("idRequestedTable").setModel(requestedJModel,"requestedJModel");
										requestedJModel.setData(that.getView().byId("idRequestHistory").getModel("historyJModel").getData()[index].ApproveHeadToItemNvg.results);
									
									}
									else{}
								}
							})
					
						});
				}
		},

//////////////////////////////////////////////////////////////////////////////////////////////////
		onTableCancel :function(){
			this._AcceptTableDialog.close();
		},
		
		onAcceptCancel :function(){
			this._AcceptRemarkDialog.close();
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		onAcceptReject:function(mode){
			debugger
			
			var NVGData = this.getView().byId("idRequestHistory").getModel("historyJModel").getData()[index];
			
			var ReqNo		= NVGData.ReqNo;
			var Persa		= NVGData.Persa;
			var Pernr		= NVGData.Pernr;
			var Matnr		= NVGData.Matnr;
			var TotAvaMenge	= NVGData.TotAvaMenge;
			var ReqMenge	= NVGData.ReqMenge;
			var AppMenge	= NVGData.AppMenge;
			
			var Data		= {};
			Data.ReqNo		= ReqNo;
			Data.Persa		= Persa;
			Data.Pernr		= Pernr;
			Data.Matnr		= Matnr;
			Data.AppMenge	= AppMenge;
			Data.ReqMenge	= ReqMenge;
			Data.AppRemarks = Remarks;
			Data.Action 	= mode;
			
			if(NVGData.Flag=="X"){
				Data.ApproveHeadToItemNvg = ApproveHeadToItemNvg;
				};
				
			var sServiceUrl = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV";
			var sPath="/ApproverDataSet";
			var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel.setHeaders({
			"Content-Type": "application/atom+xml"
			});
			var fncSuccess = function(oData, oResponse)
				{
					if(mode=='A'){
						sap.m.MessageBox.success("Approved Successfully.");
						//that.onSearch();
					}
					else{
						sap.m.MessageBox.warning("Rejected Successfully.");
						//that.onSearch();
					}
				}
			
			var fncError = function(oError) {
				var parser = new DOMParser();
				sap.m.MessageBox.show(parser, {
					title: "Error",
					icon:sap.m.MessageBox.Icon.ERROR,
				});
			}
			
			oCreateModel.create(sPath, Data, {
			success: fncSuccess,
			error: fncError
			});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onRejectRemarks:function(oEvent){
			that = this;
			index = oEvent.getSource().getParent().getBindingContext("historyJModel").sPath.split("/")[1];
			
			var oFinal = {};
			if (!that._RemarkDialog) {
				that._RemarkDialog = sap.ui.xmlfragment(
						"zstatnrymaster.view.Remarks", that);
					that.getView().addDependent(that._RemarkDialog);
					}
			that._RemarkDialog.open();
			sap.ui.getCore().byId("idRemarks").setValue();
		},
	
		onSubmit : function(){
			debugger
			sap.ui.getCore().byId("idRemarks").setValueState(sap.ui.core.ValueState.None);
			
			Remarks = "";
			Remarks = sap.ui.getCore().byId("idRemarks").getValue();
			if(Remarks == ""){
				sap.ui.getCore().byId("idRemarks").setValueState(sap.ui.core.ValueState.Error);
				sap.m.MessageToast.show("Please Input Remarks.");
				return;
			}else{
				sap.ui.getCore().byId("idRemarks").setValueState(sap.ui.core.ValueState.None);
			}
			
			var mode = 'R';
			this.onAcceptReject(mode);
			
			this._RemarkDialog.close();
			that.onSearch();
			that.setButtons();
		},
		
		onCancel :function(){
			this._RemarkDialog.close();
		},
///////////////////////////Submit Fragment code///////////////////////////////////////////////////
			onSelect:function(oEvt){
				debugger
				var selected = oEvt.getSource().getSelected();
				var tbl 	 = sap.ui.getCore().byId("IdMasterTable");
				var lngth 	 = tbl.getItems().length;
				for(var i=0; i<lngth; i++){
					if(selected){
						tbl.getItems()[i].getCells()[0].setSelected(true);
					}else{
						tbl.getItems()[i].getCells()[0].setSelected(false);
					}
				}
			},

///////////////////////////close fragment////////////////////////////////
		onRequestCancel: function(){
			debugger
			
			that._RequestHistoryHelpDialog.close();
			that._RequestHistoryHelpDialog.destroy(true);
			that._RequestHistoryHelpDialog=undefined
			},

//////////////////////////////////////////////////////////////////////////////////////////////////
onHome:function(){
var labelMessage = 'Are you sure you want to go back?';
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
//window.history.back()
var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
oCrossAppNavigator.toExternal({
target: { semanticObject : "#"}
});
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
	});
});