var RequestNo,Item,ItemDesc ,Pernr ,EmpName, AvailMenge, ReqMenge, ReqDate ,Status,Empcode ,UserName,Persa,Name1,Ename;
var F4Matnr="", F4Pernr="", Remarks="";
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"zstatnryissue/util/Formatter",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox,Formatter,JSONModel) {
"use strict";
var btcd, empCode, RequestJModel, historyJModel, statusJModel,that,Issue_Status,IssueTblJModel;
	
return Controller.extend("zstatnryissue.controller.View1", {
	onInit: function () {
		debugger
		that = this;
		
		// example usage: realtime clock
		setInterval(function(){
			var currentTime = that.getDateTime();
			that.getView().byId("idTime").setText(currentTime);
		}, 1000);
		
		statusJModel = new JSONModel();
		this.getView().byId("idRequestHistory").setModel(statusJModel, "statusJModel");
		
		historyJModel = new JSONModel();
		this.getView().byId("idRequestHistory").setModel(historyJModel, "historyJModel");
		
		IssueTblJModel = new JSONModel();
		this.getView().byId("idRequestHistory").setModel(IssueTblJModel, "IssueTblJModel");
		
	//	this.getStatusData();
		this.getUserInfo();
	//	this.getUserHistory();
		
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
		var datum = new Date();
		var time = datum.toLocaleTimeString();
		datum = datum.toString();
		datum = datum.substr(0,16);
		this.getView().byId("idDate").setText(datum).addStyleClass("textBold");
	
		var today = new Date();
		this.getView().byId("idToDate").setMaxDate(today);
		this.onStatus();
		Status = "02";
		this.getView().byId("idStatus").setSelectedKey("02");
	//	this.onSearch();
		
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
//////////////////////////Get User Status/////////////////////////////////

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
		
		
		
//////////////////////////Get User Info/////////////////////////////////
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
				Persa    = oData.Persa
				Name1 	 = oData.Name1
				Ename	 = oData.Ename
				that.getEmployeeDetails();
				that.getView().byId("idLocation").setText(Persa).addStyleClass("textBold");
				that.getView().byId("idName").setText(Ename).addStyleClass("textBold");
				that.onSearch();
			};
			oData.error = function(oError){
			};
			oDataModel.read(sPath, oData);
	},
	
/////////////////////////////Get Employee Details/////////////////////////////////////////
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
//////////////////////////Get User History////////////////////////////////
	getUserHistory: function(){
		debugger
		that = this;
		var sServiceUrlPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/";
		var sPath = "/IssueReqHdrSet";
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
//////////////////////////////////////////////////////////////////////////////////////////////////
				onF4Employee: function (evt) {
				debugger
				this.Source = evt.getSource();
				var sPath  = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/F4PernrSet?$filter=Persa eq '"+Persa+"' ";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
				var _valueHelpEmpSelectDialog = new sap.m.SelectDialog({
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
				confirm : [ this._handleEmpClose, this ],
				cancel : [ this._handleEmpClose, this ]
				});
				_valueHelpEmpSelectDialog.setModel(jModel);
				_valueHelpEmpSelectDialog.open();
				},
				_handleEmpClose : function(oEvent) {
				debugger
				that = this;
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
				var obj = oSelectedItem.getBindingContext().getObject();
				this.Source.setValue(obj.Ename);
				F4Pernr = obj.Pernr;
				}
				},
				
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				
//////////////////////////////////////////////////////////////////////////////////////////////////
				onF4Item: function (evt) {
				debugger
				this.Source = evt.getSource();
				var sPath  = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/F4ItemSet?$filter=Matnr eq ''";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
				var _valueHelpItemSelectDialog = new sap.m.SelectDialog({
				title : "Select Item",
				items : {
				path : "/d/results",
				template : new sap.m.StandardListItem({
				title : "{Maktx}",//{Matnr}
				//description: "{Maktx}",
				customData : [ new sap.ui.core.CustomData({
				key : "{Matnr}",
				value : "{Maktx}"
				})],
				}),
				},
				liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
			//	var oFilter = new sap.ui.model.Filter("Matnr",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter1 = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter2 = new sap.ui.model.Filter([ oFilter1],false);//oFilter,
				oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
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
				this.Source.setValue(obj.Maktx);
				F4Matnr = obj.Matnr;
				}
				},



/*************************************Go Button Service related to table data *****************************************************/		
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
				
			onSearch:function(){
				debugger
				var check  = false;
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

				var sServiceUrl = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/";
				var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oReadModel.setHeaders({
					"Content-Type" : "application/json"
				});
				
				var fncSuccess = function(oData, oResponse)
				{
					debugger
					IssueTblJModel.setData(oData.results);
					IssueTblJModel.refresh();
					
					var tbl    = that.getView().byId("idRequestHistory");
					var tblrow = tbl.getItems();
					
					for(var i = 0 ; i < tblrow.length ; i++){
						if(IssueTblJModel.oData[i].Status == '00' || IssueTblJModel.oData[i].Status == '01' || IssueTblJModel.oData[i].Status =="03" || IssueTblJModel.oData[i].Status =="04"){
							tblrow[i].getCells()[0].setEnabled(false);
							that.getView().byId("idSave").setVisible(false);	
						}else{
							tblrow[i].getCells()[0].setEnabled(true);	
							that.getView().byId("idSave").setVisible(true);
							}
						}
					
					if(Status=='02') that.getView().byId("idCheckBox").setEnabled(true).setSelected(false);
					else that.getView().byId("idCheckBox").setEnabled(false).setSelected(false);
				}
				
				var fncError = function(oError) {
					jQuery.sap.log.error("read publishing group data failed");
					sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
				};
				
				if(this.dateFrom){
					var path = "IssueItemSet?$filter=Status  eq '"+Status+"' and Matnr eq '"+F4Matnr+"' and Pernr eq '"+F4Pernr+"' and Persa eq '"+Persa+"' and FromDate  eq datetime'"+this.dateFrom+"' and ToDate  eq datetime'"+this.dateTo+"'";
				}else{
					var path = "IssueItemSet?$?$filter=Status  eq '"+Status+"' and Matnr eq '"+F4Matnr+"' and Pernr eq '"+F4Pernr+"' and Persa eq '"+Persa+"' and FromDate eq "+null+'  and ToDate eq '+null+"";
				}
				
				oReadModel.read(path, {
					success : fncSuccess,
					error : fncError
					});
			},
			
				onClear:function(){
					debugger
					this.getView().byId("idEmployee").setValue();
					F4Pernr="";
					this.getView().byId("idItem").setValue();
					F4Matnr = "";
					this.getView().byId("idStatus").setSelectedKey("00");
				},
////////////////////////////////////////on select code////////////////////////////////////////////
				onSelect:function(oEvt){
					debugger
					var selected = oEvt.getSource().getSelected();
					var tbl 	 = this.getView().byId("idRequestHistory");
					var lngth 	 = tbl.getItems().length;
					
					for(var i=0; i<lngth; i++){
						if(selected){
							tbl.getItems()[i].getCells()[0].setSelected(true);
						}else{
							tbl.getItems()[i].getCells()[0].setSelected(false);
						}
					}
					
				},

//////////////////////////////////////////////////////////////////////////////////////////////////
				onIssueSubmit:function(oEvent){
				debugger
				var oTable 		= this.getView().byId("idRequestHistory");
				var oItems 		= oTable.getItems();
				var tblLength 	= oItems.length;
				var ModelData 	= IssueTblJModel.getData();
				var Data 		= {};
				var count 		= 0;
				Data.Persa  	= Persa;
				Data.IssueHeadToItemNvg = [];
				for (var i = 0; i < tblLength; i++) {
					delete ModelData[i].__metadata;
				if(oItems[i].getCells()[0].getSelected()==true){
						count=count+1;
						ModelData[i].Action = 'X'
							}; 
						Data.IssueHeadToItemNvg.push(ModelData[i]);
				}
				
				if(count == 0){
					sap.m.MessageToast.show("Please select atleast one row");
					return false;
				}
				var sServiceUrl = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV";
				var sPath = "/IssueDataSet";
				var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oCreateModel.setHeaders({
				"Content-Type": "application/atom+xml"
				});
				var fncSuccess = function(oData, oResponse) //success function 
					{
						sap.m.MessageBox.show("Submitted Successfully.", {
							title: "Success",
							icon:sap.m.MessageBox.Icon.SUCCESS,
							onClose:function(){
						 		/*	 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
						        	 oCrossAppNavigator.toExternal({
						        	                       target: { semanticObject : "#"}
						        	                      });*/
								   window.location.reload();
						    	}
							});
						}
				
				var fncError = function(oError) {
					var parser = new DOMParser();
					sap.m.MessageBox.show(parser, {
						title: "Error",
						icon:sap.m.MessageBox.Icon.ERROR,
					});
				}
			//Create Method for final Save
				oCreateModel.create(sPath, Data, {
				success: fncSuccess,
				error: fncError
				});
			},

////////////////////////////////////////Home Button/////////////////////////////////////////
			
			onHome : function(){
				this.openDialog("cancel");        
			},
			openDialog : function(status) {
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
			        //  _that.onNavBack();
			          window.history.back()
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	});
});